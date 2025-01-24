import { AreaType, AuthType } from "webrm-shared";
import { z } from "zod";
import { NotFoundError } from "~/errors";
import { link } from "~/features/link";
import { sync } from "~/lib/sync";
import { xapi } from "~/lib/xapi";
import { Terminal } from "~/models";


export const connect = xapi.endpoint({
  method: "POST",
  route: "/connect",
  auth: null,
  input: z.object({
    token: z.string(),
  }),
  output: z.object({
    status: z.string(),
  }),
  handler: async ({ input, session }) => {
    const meta = await link.checkEphemeralToken(input.token);
    if (! meta) {
      throw new NotFoundError("Token not found");
    }

    // Create terminal entity
    const terminal = await Terminal.create({
      restaurantId: meta.restaurantId,
      ref: meta.ref,
      name: meta.name,
    });

    let authType: AuthType;
    switch (terminal.ref) {
    case `${AreaType.Kitchen}`:
    case `${AreaType.Bar}`:
      authType = AuthType.AreaTerminal;
      break;
    default:
      authType = AuthType.TableTerminal;
    }

    // Give the terminal a session
    session.update({
      id: terminal.id,
      type: authType,
      restaurantId: terminal.restaurantId,
    });

    // Publish event
    sync.publish(terminal.restaurantId, {
      type: "terminal-linked",
      data: {
        id: terminal.id,
        ref: terminal.ref,
        connection: null,
      },
    });

    return {
      status: "success",
    };
  },
});
