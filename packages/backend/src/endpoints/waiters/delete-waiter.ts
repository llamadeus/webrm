import { z } from "zod";
import { NotFoundError } from "~/errors";
import { sync } from "~/lib/sync";
import { AuthState, xapi } from "~/lib/xapi";
import { User, UserRole } from "~/models";
import { socket } from "~/socket";


export const deleteWaiter = xapi.endpoint({
  method: "DELETE",
  route: "/waiters/:id",
  auth: AuthState.Admin,
  output: z.object({
    status: z.string(),
  }),
  handler: async ({ params, session }) => {
    const waiter = await User.findOne({
      _id: params.id,
      restaurantId: session.auth.restaurantId,
      role: UserRole.Waiter,
    });
    if (waiter == null) {
      throw new NotFoundError("Waiter not found");
    }

    // TODO: Destroy waiter session

    await waiter.deleteOne();

    // Send notification to the waiter
    socket.toUser(waiter.id).emit("redirect", "/login");
    socket.toUser(waiter.id).disconnectSockets(true);

    // Sync with restaurant
    sync.publish(session.auth.restaurantId, {
      type: "waiter-deleted",
      data: {
        id: waiter.id,
      },
    });

    return {
      status: "success",
    };
  },
});
