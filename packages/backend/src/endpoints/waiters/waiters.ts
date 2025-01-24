import { z } from "zod";
import { AuthState, xapi } from "~/lib/xapi";
import { User, UserRole } from "~/models";


export const waiters = xapi.endpoint({
  method: "GET",
  route: "/waiters",
  auth: AuthState.Admin,
  output: z.array(z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    lastLogin: z.string(),
    createdAt: z.string(),
  })),
  handler: async ({ session }) => {
    const waiters = await User.find({
      restaurantId: session.auth.restaurantId,
      role: UserRole.Waiter,
    });

    return waiters.map((table) => ({
      id: table.id,
      name: table.name ?? "Unknown",
      email: table.email,
      lastLogin: table.lastLogin.toISOString(),
      createdAt: table.createdAt.toISOString(),
    }));
  },
});
