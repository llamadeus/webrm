import { OrderStatus } from "webrm-shared";
import { z } from "zod";
import { AuthState, xapi } from "~/lib/xapi";
import { Order } from "~/models";


export const orders = xapi.endpoint({
  method: "GET",
  route: "/orders",
  auth: [AuthState.Admin, AuthState.Waiter, AuthState.AreaTerminal],
  output: z.array(z.object({
    id: z.string(),
    table: z.object({
      id: z.string(),
      name: z.string(),
    }),
    menuItem: z.object({
      id: z.string(),
      name: z.string(),
      category: z.string(),
      price: z.number(),
    }),
    quantity: z.number(),
    status: z.enum([OrderStatus.Pending, OrderStatus.Ready, OrderStatus.Delivered]),
    createdAt: z.string(),
  })),
  handler: async ({ session }) => {
    const orders = await Order.find({
      restaurantId: session.auth.restaurantId,
    });

    return orders.map((order) => ({
      id: order.id,
      table: {
        id: order.tableId,
        name: order.tableName,
      },
      menuItem: {
        id: order.menuItemId,
        name: order.menuItemName,
        category: order.menuItemCategory,
        price: order.menuItemPrice,
      },
      quantity: order.quantity,
      status: order.status,
      createdAt: order.createdAt.toISOString(),
    }));
  },
});
