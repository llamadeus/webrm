import { TerminalType } from "webrm-shared";
import { z } from "zod";
import { NotFoundError } from "~/errors";
import { sync } from "~/lib/sync";
import { AuthState, xapi } from "~/lib/xapi";
import { Table, Terminal } from "~/models";
import { socket } from "~/socket";


export const deleteTable = xapi.endpoint({
  method: "DELETE",
  route: "/tables/:id",
  auth: AuthState.Admin,
  output: z.object({
    status: z.string(),
  }),
  handler: async ({ params, session }) => {
    const table = await Table.findOne({
      _id: params.id,
      restaurantId: session.auth.restaurantId,
    });
    if (table == null) {
      throw new NotFoundError("Table not found");
    }

    const terminal = await Terminal.findOne({
      restaurantId: session.auth.restaurantId,
      ref: `${TerminalType.Table}:${table.id}`,
    });
    if (terminal !== null) {
      // TODO: Destroy terminal session

      await terminal.deleteOne();

      // Send notification to the terminal
      socket.toTerminal(terminal.id).emit("redirect", "/link");
      socket.toTerminal(terminal.id).disconnectSockets(true);
    }

    await table.deleteOne();

    // Publish event to restaurant
    sync.publish(session.auth.restaurantId, {
      type: "table-deleted",
      data: {
        id: table.id,
      },
    });

    return {
      status: "success",
    };
  },
});
