import { AuthType, TerminalType } from "webrm-shared";
import { z } from "zod";
import { InternalServerError } from "~/errors";
import { xapi } from "~/lib/xapi";
import { Area, Restaurant } from "~/models";


const areaTerminalSchema = z.object({
  ref: z.string(),
  categories: z.array(z.string()),
});

const tableTerminalSchema = z.object({
  ref: z.string(),
  name: z.string(),
});

export const auth = xapi.endpoint({
  method: "GET",
  route: "/auth",
  output: z.object({
    id: z.string(),
    type: z.enum([AuthType.Admin, AuthType.Waiter, AuthType.AreaTerminal, AuthType.TableTerminal]),
    user: z.object({
      email: z.string(),
    }).optional(),
    areaTerminal: areaTerminalSchema.optional(),
    tableTerminal: tableTerminalSchema.optional(),
    restaurant: z.string(),
  }).nullable(),
  handler: async ({ session, user, terminal }) => {
    if (typeof session.auth == "undefined") {
      return null;
    }

    const restaurant = await Restaurant.findById(session.auth.restaurantId);
    if (restaurant === null) {
      return null;
    }

    let areaTerminal: z.infer<typeof areaTerminalSchema> | undefined;
    let tableTerminal: z.infer<typeof tableTerminalSchema> | undefined;
    if (terminal !== null) {
      switch (terminal.ref) {
      case `${TerminalType.Kitchen}`:
      case `${TerminalType.Bar}`:
        let areaType: TerminalType;
        switch (terminal.ref) {
        case `${TerminalType.Kitchen}`:
          areaType = TerminalType.Kitchen;
          break;
        case `${TerminalType.Bar}`:
          areaType = TerminalType.Bar;
          break;
        default:
          throw new InternalServerError("Invalid terminal type");
        }

        const area = await Area.findOne({
          restaurantId: session.auth.restaurantId,
          type: areaType,
        });
        if (area === null) {
          throw new InternalServerError("Area not found");
        }

        areaTerminal = {
          ref: terminal.ref,
          categories: area?.categories ?? [],
        };
        break;

      default:
        tableTerminal = {
          ref: terminal.ref,
          name: terminal.name ?? "<unknown>",
        };
        break;
      }
    }

    return {
      id: session.auth.id,
      type: session.auth.type,
      user: user !== null ? {
        email: user.email,
      } : undefined,
      areaTerminal,
      tableTerminal,
      restaurant: restaurant.name,
    };
  },
});
