import { createShardedAdapter } from "@socket.io/redis-adapter";
import type { CorsOptions } from "cors";
import dayjs from "dayjs";
import type { Request, RequestHandler } from "express";
import http from "http";
import type Redis from "ioredis";
import { Server, Socket } from "socket.io";
import { type Auth, AuthType } from "webrm-shared";
import { link, LINK_CODE_TTL } from "~/features/link";
import { getSocketRoom } from "~/features/link/utils";
import { sync } from "~/lib/sync";


interface InitializeOptions {
  redis: Redis;
  cors: CorsOptions;
  middleware: RequestHandler;
}

interface Connection {
  ip: string;
  lastSeen: string;
}

let io: Server | null = null;

export const socket = {
  initialize(server: http.Server, options: InitializeOptions): void {
    const pub = options.redis.duplicate();
    const sub = options.redis.duplicate();

    io = new Server(server, {
      cors: options.cors,
      adapter: createShardedAdapter(pub, sub),
    });

    io.engine.use(options.middleware);
    io.on("connection", async (socket) => {
      const { session } = socket.request as Request;

      return typeof session.auth == "undefined"
        ? handleAnonymousSocket(socket)
        : handleAuthenticatedSocket(socket, session.auth);
    });
  },
  toChannel(channel: string): ReturnType<Server["to"]> {
    if (io === null) {
      throw new Error("Socket not initialized");
    }

    return io.to(channel);
  },
  toUser(userId: string): ReturnType<Server["to"]> {
    if (io === null) {
      throw new Error("Socket not initialized");
    }

    return io.to(`user:${userId}`);
  },
  toTerminal(terminalId: string): ReturnType<Server["to"]> {
    if (io === null) {
      throw new Error("Socket not initialized");
    }

    return io.to(`terminal:${terminalId}`);
  },
  toRestaurant(restaurantId: string, roles: AuthType[]): ReturnType<Server["to"]> {
    if (io === null) {
      throw new Error("Socket not initialized");
    }

    const rooms = roles.map(role => `restaurant:${restaurantId}:${role}`);

    return io.to(rooms);
  },
  async fetchTerminalConnections(terminalIds: string[]): Promise<Record<string, Connection>> {
    if (io === null) {
      throw new Error("Socket not initialized");
    }

    const rooms = terminalIds.map((terminalId) => `terminal:${terminalId}`);
    const sockets = await io.in(rooms).fetchSockets();
    const connections: Record<string, Connection> = {};

    for (const socket of sockets) {
      const { terminalId, lastSeen } = socket.data;
      if (typeof terminalId != "string" || typeof lastSeen != "string") {
        continue;
      }

      connections[terminalId] = {
        ip: socket.handshake.address,
        lastSeen,
      };
    }

    return connections;
  },
};

async function handleAnonymousSocket(client: Socket) {
  let timeout: ReturnType<typeof setTimeout>;
  let currentCode: string | null = null;

  async function generateAndSendCode() {
    if (currentCode !== null) {
      client.leave(getSocketRoom(currentCode));
    }

    currentCode = await link.getLinkCde(client.handshake.address);
    if (currentCode === null) {
      client.disconnect(true);
      return;
    }

    client.join(getSocketRoom(currentCode));
    client.emit("link-code", {
      value: currentCode,
      ttl: dayjs().add(LINK_CODE_TTL, "seconds").toDate(),
    });

    // Schedule the next code generation
    timeout = setTimeout(generateAndSendCode, LINK_CODE_TTL * 1000);
  }

  client.on("disconnect", () => {
    clearTimeout(timeout);
  });

  await generateAndSendCode();
}

async function handleAuthenticatedSocket(client: Socket, auth: Auth) {
  const request = client.request as Request;
  const channels: string[] = [
    `restaurant:${auth.restaurantId}:${auth.type}`,
  ];

  if (request.user !== null) {
    channels.push(`user:${request.user.id}`);
  }

  if (request.terminal !== null) {
    channels.push(`terminal:${request.terminal.id}`);
  }

  for (const channel of channels) {
    client.join(channel);
  }

  if (request.terminal !== null) {
    const terminalId = request.terminal.id;
    let nextPing: ReturnType<typeof setInterval>;

    function updateLastSeenAndPublishEvent() {
      client.data.lastSeen = new Date().toISOString();

      sync.publish(auth.restaurantId, {
        type: "terminal-updated",
        data: {
          id: terminalId,
          connection: {
            ip: client.handshake.address,
            lastSeen: client.data.lastSeen,
          },
        },
      });

      nextPing = setTimeout(() => {
        client.emitWithAck("ping").then(updateLastSeenAndPublishEvent);
      }, 5000);
    }

    client.data.terminalId = terminalId;
    updateLastSeenAndPublishEvent();

    client.on("disconnect", () => {
      sync.publish(auth.restaurantId, {
        type: "terminal-updated",
        data: {
          id: terminalId,
          connection: null,
        },
      });

      clearTimeout(nextPing);
    });
  }

  client.on("disconnect", () => {
    for (const channel of channels) {
      client.leave(channel);
    }
  });

  client.on("error", () => {
    for (const channel of channels) {
      client.leave(channel);
    }
  });
}
