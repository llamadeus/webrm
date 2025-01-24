import { OrderStatus } from "webrm-shared";
import { z } from "zod";
import { NotFoundError } from "~/errors";
import { sync } from "~/lib/sync";
import { AuthState } from "~/lib/xapi";
import { endpoint } from "~/lib/xapi/builder/endpoint";
import { Order } from "~/models";


export const updateOrder = endpoint({
  method: "PATCH",
  route: "/orders/:id",
  auth: [AuthState.Admin, AuthState.Waiter, AuthState.AreaTerminal],
  input: z.object({
    status: z.enum([OrderStatus.Pending, OrderStatus.Ready, OrderStatus.Delivered]),
  }),
  output: z.object({
    status: z.string(),
  }),
  handler: async ({ input, params, session }) => {
    const order = await Order.findOne({
      _id: params.id,
      restaurantId: session.auth.restaurantId,
    });
    if (order === null) {
      throw new NotFoundError("Order not found");
    }

    if (input.status === order.status) {
      return {
        status: "success",
      };
    }

    order.status = input.status;
    await order.save();

    // Notify restaurant
    sync.publish(session.auth.restaurantId, {
      type: "order-updated",
      data: {
        id: order.id,
        status: order.status,
      },
    });

    return {
      status: "success",
    };
  },
});
