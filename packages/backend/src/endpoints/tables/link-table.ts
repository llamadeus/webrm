import { TerminalType } from "webrm-shared";
import { z } from "zod";
import { NotFoundError } from "~/errors";
import { link } from "~/features/link";
import { getSocketRoom } from "~/features/link/utils";
import { AuthState, xapi } from "~/lib/xapi";
import { Table } from "~/models";
import { socket } from "~/socket";


export const linkTable = xapi.endpoint({
  method: "POST",
  route: "/tables/:id/link",
  auth: AuthState.Admin,
  input: z.object({
    code: z.string().max(50),
  }),
  output: z.object({
    status: z.string(),
  }),
  handler: async ({ input, params, session }) => {
    const table = await Table.findOne({
      _id: params.id,
      restaurantId: session.auth.restaurantId,
    });
    if (table === null) {
      throw new NotFoundError("Table not found");
    }

    const exists = await link.checkCode(input.code);
    if (! exists) {
      throw new NotFoundError("Link code not found");
    }

    const ephemeralToken = await link.getEphemeralToken({
      restaurantId: session.auth.restaurantId,
      ref: `${TerminalType.Table}:${table.id}`,
      name: table.name,
    });

    await link.deleteCode(input.code);
    socket.toChannel(getSocketRoom(input.code)).emit("linked", ephemeralToken);

    return {
      status: "success",
    };
  },
});
