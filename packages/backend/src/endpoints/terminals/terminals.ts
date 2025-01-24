import { z } from "zod";
import { AuthState, xapi } from "~/lib/xapi";
import { Terminal } from "~/models";
import { socket } from "~/socket";


export const terminals = xapi.endpoint({
  method: "GET",
  route: "/terminals",
  auth: AuthState.Admin,
  output: z.array(z.object({
    id: z.string(),
    ref: z.string(),
    name: z.string().optional(),
    connection: z.object({
      ip: z.string(),
      lastSeen: z.string(),
    }).nullable(),
  })),
  handler: async ({ session }) => {
    const terminals = await Terminal.find({ restaurantId: session.auth.restaurantId });
    const terminalIds = terminals.map((terminal) => terminal.id);
    const connections = await socket.fetchTerminalConnections(terminalIds);

    return terminals.map((terminal) => ({
      id: terminal.id,
      ref: terminal.ref,
      name: terminal.name,
      connection: connections[terminal.id] ?? null,
    }));
  },
});
