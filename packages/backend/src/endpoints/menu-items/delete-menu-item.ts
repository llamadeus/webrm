import { z } from "zod";
import { NotFoundError } from "~/errors";
import { sync } from "~/lib/sync";
import { AuthState, xapi } from "~/lib/xapi";
import { MenuItem } from "~/models";


export const deleteMenuItem = xapi.endpoint({
  method: "DELETE",
  route: "/menu-items/:id",
  auth: AuthState.Admin,
  output: z.object({
    status: z.string(),
  }),
  handler: async ({ params, session }) => {
    const menuItem = await MenuItem.findOne({
      _id: params.id,
      restaurantId: session.auth.restaurantId,
    });
    if (menuItem == null) {
      throw new NotFoundError("Menu item not found");
    }

    await menuItem.deleteOne();
    sync.publish(session.auth.restaurantId, {
      type: "menu-item-deleted",
      data: {
        id: menuItem.id,
      },
    });

    return {
      status: "success",
    };
  },
});
