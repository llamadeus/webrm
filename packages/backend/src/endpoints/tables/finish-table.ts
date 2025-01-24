import { z } from "zod";
import { NotFoundError } from "~/errors";
import { sync } from "~/lib/sync";
import { AuthState } from "~/lib/xapi";
import { endpoint } from "~/lib/xapi/builder/endpoint";
import { Order, Table } from "~/models";


export const finishTable = endpoint({
  method: "POST",
  route: "/tables/:id/finish",
  auth: [AuthState.Admin, AuthState.Waiter],
  output: z.object({
    status: z.string(),
  }),
  handler: async ({ params, session }) => {
    const table = await Table.findOne({
      _id: params.id,
      restaurantId: session.auth.restaurantId,
    });
    if (table === null) {
      throw new NotFoundError("Table not found");
    }

    const orders = await Order.find({
      tableId: table.id,
    });

    for (const order of orders) {
      await order.deleteOne();

      sync.publish(session.auth.restaurantId, {
        type: "order-deleted",
        data: {
          id: order.id,
        },
      });
    }

    return {
      status: "success",
    };
  },
});
