import { z } from "zod";
import { NotFoundError } from "~/errors";
import { sync } from "~/lib/sync";
import { AuthState, xapi } from "~/lib/xapi";
import { Terminal } from "~/models";
import { socket } from "~/socket";


export const unlinkTerminal = xapi.endpoint({
  method: "DELETE",
  route: "/terminals/:ref",
  auth: AuthState.Admin,
  output: z.object({
    status: z.string(),
  }),
  handler: async ({ params, session }) => {
    const terminal = await Terminal.findOne({
      restaurantId: session.auth.restaurantId,
      ref: params.ref,
    });
    if (terminal == null) {
      throw new NotFoundError("Terminal not found");
    }

    await terminal.deleteOne();

    // Send notification to the terminal
    socket.toTerminal(terminal.id).emit("redirect", "/link");
    socket.toTerminal(terminal.id).disconnectSockets(true);

    // Sync with restaurant
    sync.publish(session.auth.restaurantId, {
      type: "terminal-unlinked",
      data: {
        id: terminal.id,
      },
    });

    return {
      status: "success",
    };
  },
});
