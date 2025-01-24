import { z } from "zod";
import { BadRequestError } from "~/errors";
import { isValidAreaCode } from "~/features/areas/utils";
import { sync } from "~/lib/sync";
import { AuthState, xapi } from "~/lib/xapi";
import { Area } from "~/models";


export const updateArea = xapi.endpoint({
  method: "PATCH",
  route: "/areas/:area",
  auth: AuthState.Admin,
  input: z.object({
    enabled: z.boolean().optional(),
    categories: z.array(z.string().min(1).max(50)).optional(),
  }),
  output: z.object({
    type: z.string(),
    enabled: z.boolean(),
    categories: z.array(z.string()),
  }),
  handler: async ({ input, params, session }) => {
    if (! isValidAreaCode(params.area)) {
      throw new BadRequestError("Invalid area type");
    }

    let area = await Area.findOne({
      restaurantId: session.auth.restaurantId,
      type: params.area,
    });
    if (area === null) {
      area = new Area({
        restaurantId: session.auth.restaurantId,
        type: params.area,
        enabled: false,
        categories: [],
      });
    }

    if (typeof input.enabled != "undefined") {
      area.enabled = input.enabled;
    }

    if (typeof input.categories != "undefined") {
      area.categories = input.categories;
    }

    await area.save();
    sync.publish(session.auth.restaurantId, {
      type: "area-updated",
      data: {
        type: area.type,
        enabled: area.enabled,
        categories: area.categories,
      },
    });

    // TODO: Notify the area terminal that it has been updated
    //       This should be done to have it apply the categories filter locally or show a DISABLED screen

    return {
      type: area.type,
      enabled: area.enabled,
      categories: area.categories,
    };
  },
});
