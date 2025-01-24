import { z } from "zod";
import { NotFoundError } from "~/errors";
import { sync } from "~/lib/sync";
import { AuthState, xapi } from "~/lib/xapi";
import { Order } from "~/models";


export const deleteOrder = xapi.endpoint({
  method: "DELETE",
  route: "/orders/:id",
  auth: [AuthState.Admin, AuthState.Waiter, AuthState.AreaTerminal],
  output: z.object({
    status: z.string(),
  }),
  handler: async ({ params, session }) => {
    const order = await Order.findOne({
      _id: params.id,
      restaurantId: session.auth.restaurantId,
    });
    if (order == null) {
      throw new NotFoundError("Order not found");
    }

    await order.deleteOne();

    // Publish event to restaurant
    sync.publish(session.auth.restaurantId, {
      type: "order-deleted",
      data: {
        id: order.id,
      },
    });

    return {
      status: "success",
    };
  },
});
