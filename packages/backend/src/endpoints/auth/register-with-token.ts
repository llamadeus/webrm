import { AuthType } from "webrm-shared";
import { z } from "zod";
import { BadRequestError, NotFoundError } from "~/errors";
import { sync } from "~/lib/sync";
import { xapi } from "~/lib/xapi";
import { Invitation, Restaurant, User, UserRole } from "~/models";
import { hashPassword } from "~/utils/crypto";


export const registerWithToken = xapi.endpoint({
  method: "POST",
  route: "/register/:token",
  auth: null,
  input: z.object({
    email: z.string().email().min(1).max(50),
    password: z.string().min(6).max(50),
  }),
  output: z.object({
    status: z.string(),
  }),
  handler: async ({ input, params, session }) => {
    const invitation = await Invitation.findOne({ token: params.token });
    if (invitation === null) {
      throw new NotFoundError("Invitation not found");
    }

    const restaurant = await Restaurant.findById(invitation.restaurantId);
    if (restaurant === null) {
      throw new NotFoundError("Restaurant not found");
    }

    const existing = await User.findOne({ email: input.email.trim() });
    if (existing !== null) {
      throw new BadRequestError("Email already in use");
    }

    const password = await hashPassword(input.password);
    const user = await User.create({
      restaurantId: restaurant.id,
      name: invitation.name,
      role: UserRole.Waiter,
      email: input.email.trim(),
      password: password,
    });

    // Delete the invitation
    await invitation.deleteOne();

    // Login the user
    session.update({
      id: user.id,
      type: AuthType.Waiter,
      restaurantId: user.restaurantId,
    });

    sync.publish(restaurant.id, {
      type: "waiter-created",
      data: {
        id: user.id,
        name: user.name ?? "Unknown",
        email: user.email,
        lastLogin: user.lastLogin.toISOString(),
        createdAt: user.createdAt.toISOString(),
      },
    });

    return {
      status: "success",
    };
  },
});
