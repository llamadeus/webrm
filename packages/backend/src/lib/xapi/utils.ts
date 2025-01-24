import type { Request } from "express";
import { type Auth, AuthType } from "webrm-shared";
import { AuthState } from "~/lib/xapi/types";


const AUTHORIZATION_CHECKERS = {
  [AuthState.Admin]: (auth) => auth?.type === AuthType.Admin,
  [AuthState.Waiter]: (auth) => auth?.type === AuthType.Waiter,
  [AuthState.AreaTerminal]: (auth) => auth?.type === AuthType.AreaTerminal,
  [AuthState.TableTerminal]: (auth) => auth?.type === AuthType.TableTerminal,
} satisfies Record<AuthState, (auth: Auth | undefined) => boolean>;

export function authorized(req: Request, state: AuthState | AuthState[]): boolean {
  const states = Array.isArray(state) ? state : [state];

  for (const s of states) {
    const result = AUTHORIZATION_CHECKERS[s](req.session.auth);
    if (result) {
      return result;
    }
  }

  return false;
}
