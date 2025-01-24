import { z } from "zod";
import { NotFoundError } from "~/errors";
import { xapi } from "~/lib/xapi";
import { Invitation, Restaurant } from "~/models";


export const invitation = xapi.endpoint({
  method: "GET",
  route: "/invitation/:token",
  auth: null,
  output: z.object({
    restaurant: z.string(),
    name: z.string(),
  }),
  handler: async ({ params }) => {
    const invitation = await Invitation.findOne({ token: params.token });
    if (invitation === null) {
      throw new NotFoundError("Invitation not found");
    }

    const restaurant = await Restaurant.findById(invitation.restaurantId);
    if (restaurant === null) {
      throw new NotFoundError("Restaurant not found");
    }

    return {
      restaurant: restaurant.name,
      name: invitation.name,
    };
  },
});
