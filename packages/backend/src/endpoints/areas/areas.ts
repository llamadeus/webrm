import { AreaType, TerminalType } from "webrm-shared";
import { z } from "zod";
import { getAreas } from "~/features/areas/utils";
import { AuthState, xapi } from "~/lib/xapi";
import { Terminal } from "~/models";
import { socket } from "~/socket";


const areaSchema = z.object({
  type: z.enum([AreaType.Kitchen, AreaType.Bar]),
  enabled: z.boolean(),
  categories: z.array(z.string()),
});

export const areas = xapi.endpoint({
  method: "GET",
  route: "/areas",
  auth: AuthState.Admin,
  output: z.object({
    areas: z.object({
      [AreaType.Kitchen]: areaSchema,
      [AreaType.Bar]: areaSchema,
    }),
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
    const areas = await getAreas(session.auth.restaurantId);
    const terminals = await Terminal.find({
      restaurantId: session.auth.restaurantId,
      ref: {
        $in: [TerminalType.Kitchen, TerminalType.Bar],
      },
    });
    const terminalIds = terminals.map((terminal) => terminal.id);
    const connections = await socket.fetchTerminalConnections(terminalIds);

    return {
      areas,
      terminals: terminals.map((terminal) => ({
        id: terminal.id,
        ref: terminal.ref,
        connection: connections[terminal.id] ?? null,
      })),
    };
  },
});
