import { AreaType, TerminalType } from "webrm-shared";
import { z } from "zod";
import { BadRequestError, NotFoundError } from "~/errors";
import { isValidAreaCode } from "~/features/areas/utils";
import { link } from "~/features/link";
import { getSocketRoom } from "~/features/link/utils";
import { AuthState, xapi } from "~/lib/xapi";
import { socket } from "~/socket";


export const linkArea = xapi.endpoint({
  method: "POST",
  route: "/areas/:area/link",
  auth: AuthState.Admin,
  input: z.object({
    code: z.string().max(50),
  }),
  output: z.object({
    status: z.string(),
  }),
  handler: async ({ input, params, session }) => {
    if (! isValidAreaCode(params.area)) {
      throw new BadRequestError("Invalid area type");
    }

    const exists = await link.checkCode(input.code);
    if (! exists) {
      throw new NotFoundError("Link code not found");
    }

    let terminalType: TerminalType;
    switch (params.area) {
    case AreaType.Kitchen:
      terminalType = TerminalType.Kitchen;
      break;
    case AreaType.Bar:
      terminalType = TerminalType.Bar;
      break;
    default:
      throw new BadRequestError("Invalid area type");
    }

    const ephemeralToken = await link.getEphemeralToken({
      restaurantId: session.auth.restaurantId,
      ref: terminalType,
    });

    await link.deleteCode(input.code);
    socket.toChannel(getSocketRoom(input.code)).emit("linked", ephemeralToken);

    return {
      status: "success",
    };
  },
});
