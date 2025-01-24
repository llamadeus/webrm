import { z } from "zod";
import { AuthState, xapi } from "~/lib/xapi";
import { MenuItem } from "~/models";


export const menuItems = xapi.endpoint({
  method: "GET",
  route: "/menu-items",
  auth: [AuthState.Admin, AuthState.Waiter, AuthState.TableTerminal],
  output: z.array(z.object({
    id: z.string(),
    name: z.string(),
    category: z.string(),
    price: z.number(),
    createdAt: z.string(),
  })),
  handler: async ({ session }) => {
    const menuItems = await MenuItem.find({ restaurantId: session.auth.restaurantId });

    return menuItems.map((menuItem) => ({
      id: menuItem.id,
      name: menuItem.name,
      category: menuItem.category,
      price: menuItem.price,
      createdAt: menuItem.createdAt.toISOString(),
    }));
  },
});
