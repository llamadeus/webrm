import { z } from "zod";
import { sync } from "~/lib/sync";
import { AuthState } from "~/lib/xapi";
import { endpoint } from "~/lib/xapi/builder/endpoint";
import { MenuItem } from "~/models";


export const createMenuItem = endpoint({
  method: "PUT",
  route: "/menu-items",
  auth: AuthState.Admin,
  input: z.object({
    name: z.string().min(1).max(50),
    category: z.string().min(1).max(50),
    price: z.number().min(0),
  }),
  output: z.object({
    status: z.string(),
  }),
  handler: async ({ input, session }) => {
    const menuItem = await MenuItem.create({
      restaurantId: session.auth.restaurantId,
      name: input.name.trim(),
      category: input.category.trim(),
      price: input.price,
    });

    sync.publish(session.auth.restaurantId, {
      type: "menu-item-created",
      data: {
        id: menuItem.id,
        name: menuItem.name,
        category: menuItem.category,
        price: menuItem.price,
        createdAt: menuItem.createdAt.toISOString(),
      },
    });

    return {
      status: "success",
    };
  },
});
