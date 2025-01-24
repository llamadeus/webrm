import { z } from "zod";
import { AuthState } from "~/lib/xapi";
import { endpoint } from "~/lib/xapi/builder/endpoint";
import { Invitation } from "~/models";
import { generateToken } from "~/utils/crypto";


export const inviteWaiter = endpoint({
  method: "POST",
  route: "/waiters/invite",
  auth: AuthState.Admin,
  input: z.object({
    name: z.string().min(1).max(50),
  }),
  output: z.object({
    status: z.string(),
    token: z.string(),
  }),
  handler: async ({ input, session }) => {
    const invitation = await Invitation.create({
      restaurantId: session.auth.restaurantId,
      token: generateToken(64),
      name: input.name.trim(),
    });

    return {
      status: "success",
      token: invitation.token,
    };
  },
});
