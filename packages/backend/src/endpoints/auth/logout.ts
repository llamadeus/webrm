import { z } from "zod";
import { AuthState, xapi } from "~/lib/xapi";


export const logout = xapi.endpoint({
  method: "POST",
  route: "/logout",
  auth: [AuthState.Admin, AuthState.Waiter, AuthState.AreaTerminal],
  output: z.object({
    status: z.string(),
  }),
  handler: async ({ session }) => {
    await session.destroy();

    return {
      status: "success",
    };
  },
});
