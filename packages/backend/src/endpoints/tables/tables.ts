import { TerminalType } from "webrm-shared";
import { z } from "zod";
import { AuthState, xapi } from "~/lib/xapi";
import { Table, Terminal } from "~/models";
import { socket } from "~/socket";


export const tables = xapi.endpoint({
  method: "GET",
  route: "/tables",
  auth: AuthState.Admin,
  output: z.object({
    tables: z.array(z.object({
      id: z.string(),
      name: z.string(),
      createdAt: z.string(),
    })),
    terminals: z.array(z.object({
      id: z.string(),
      ref: z.string(),
      connection: z.object({
        ip: z.string(),
        lastSeen: z.string(),
      }).nullable(),
    })),
  }),
  handler: async ({ session }) => {
    const tables = await Table.find({ restaurantId: session.auth.restaurantId });
    const terminals = await Terminal.find({
      restaurantId: session.auth.restaurantId,
      ref: new RegExp(`^${TerminalType.Table}:`),
    });
    const terminalIds = terminals.map((terminal) => terminal.id);
    const connections = await socket.fetchTerminalConnections(terminalIds);

    return {
      tables: tables.map((table) => ({
        id: table.id,
        name: table.name,
        createdAt: table.createdAt.toISOString(),
      })),
      terminals: terminals.map((terminal) => ({
        id: terminal.id,
        ref: terminal.ref,
        connection: connections[terminal.id] ?? null,
      })),
    };
  },
});
