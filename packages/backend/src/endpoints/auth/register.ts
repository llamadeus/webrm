import { AuthType } from "webrm-shared";
import { z } from "zod";
import { BadRequestError } from "~/errors";
import { xapi } from "~/lib/xapi";
import { Restaurant, User, UserRole } from "~/models";
import { hashPassword } from "~/utils/crypto";


export const register = xapi.endpoint({
  method: "POST",
  route: "/register",
  auth: null,
  input: z.object({
    restaurant: z.string().min(1).max(50),
    email: z.string().email().min(1).max(50),
    password: z.string().min(6).max(50),
  }),
  output: z.object({
    status: z.string(),
  }),
  handler: async ({ input, session }) => {
    const existing = await User.findOne({ email: input.email.trim() });
    if (existing !== null) {
      throw new BadRequestError("Email already in use");
    }

    const restaurant = await Restaurant.create({
      name: input.restaurant.trim(),
    });

    const password = await hashPassword(input.password);
    const user = await User.create({
      restaurantId: restaurant.id,
      role: UserRole.Admin,
      email: input.email.trim(),
      password: password,
    });

    // Login the user
    session.update({
      id: user.id,
      type: AuthType.Admin,
      restaurantId: user.restaurantId,
    });

    return {
      status: "success",
    };
  },
});
