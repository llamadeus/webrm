import { OrderStatus } from "webrm-shared";
import { z } from "zod";
import { NotFoundError } from "~/errors";
import { AuthState, xapi } from "~/lib/xapi";
import { Order, Table } from "~/models";


export const tableOrders = xapi.endpoint({
  method: "GET",
  route: "/tables/:id/orders",
  auth: AuthState.Admin,
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
  handler: async ({ params, session }) => {
    const table = await Table.findOne({
      _id: params.id,
      restaurantId: session.auth.restaurantId,
    });
    if (table === null) {
      throw new NotFoundError("Table not found");
    }

    const orders = await Order.find({
      restaurantId: session.auth.restaurantId,
      tableId: table.id,
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
