import { AuthType } from "webrm-shared";
import { z } from "zod";
import { NotFoundError } from "~/errors";
import { xapi } from "~/lib/xapi";
import { User, UserRole } from "~/models";
import { verifyPassword } from "~/utils/crypto";


export const login = xapi.endpoint({
  method: "POST",
  route: "/login",
  auth: null,
  input: z.object({
    email: z.string().email(),
    password: z.string(),
  }),
  output: z.object({
    status: z.string(),
  }),
  handler: async ({ input, session }) => {
    const user = await User.findOne({ email: input.email });
    if (user == null) {
      throw new NotFoundError("User not found");
    }

    const result = await verifyPassword(input.password, user.password);
    if (! result) {
      throw new NotFoundError("User not found");
    }

    user.lastLogin = new Date();
    await user.save();

    // Login the user
    session.update({
      id: user.id,
      type: user.role === UserRole.Admin ? AuthType.Admin : AuthType.Waiter,
      restaurantId: user.restaurantId,
    });

    return {
      status: "success",
    };
  },
});
