import { OrderStatus } from "webrm-shared";
import { z } from "zod";
import { InternalServerError } from "~/errors";
import { sync } from "~/lib/sync";
import { AuthState } from "~/lib/xapi";
import { endpoint } from "~/lib/xapi/builder/endpoint";
import { MenuItem, Order, Table } from "~/models";


export const createOrder = endpoint({
  method: "PUT",
  route: "/orders",
  auth: AuthState.TableTerminal,
  input: z.array(z.object({
    itemId: z.string(),
    quantity: z.number(),
  })),
  output: z.object({
    status: z.string(),
  }),
  handler: async ({ input, session, terminal }) => {
    const [, tableId] = terminal?.ref.split(":") ?? [];
    if (typeof tableId == "undefined") {
      throw new InternalServerError("Invalid terminal type");
    }

    const table = await Table.findOne({
      _id: tableId,
      restaurantId: session.auth.restaurantId,
    });
    if (table === null) {
      throw new InternalServerError("Table not found");
    }

    const inputMap = Object.fromEntries(input.map((item) => [item.itemId, item.quantity]));
    const menuItems = await MenuItem.find({
      _id: { $in: Object.keys(inputMap) },
      restaurantId: session.auth.restaurantId,
    });

    const orders: Order[] = [];
    for (const menuItem of menuItems) {
      const quantity = inputMap[menuItem.id] ?? 0;
      if (quantity === 0) {
        continue;
      }

      orders.push(new Order({
        quantity,
        tableId: table.id,
        tableName: table.name,
        restaurantId: session.auth.restaurantId,
        menuItemId: menuItem.id,
        menuItemName: menuItem.name,
        menuItemCategory: menuItem.category,
        menuItemPrice: menuItem.price,
        status: OrderStatus.Pending,
      }));
    }

    await Order.insertMany(orders);

    // Notify restaurant
    sync.publish(session.auth.restaurantId, {
      type: "orders-created",
      data: orders.map((order) => ({
        id: order.id,
        quantity: order.quantity,
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
        status: order.status,
        createdAt: order.createdAt.toISOString(),
      })),
    });

    return {
      status: "success",
    };
  },
});
