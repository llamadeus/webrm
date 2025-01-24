import type { HttpMethod } from "webrm-shared";
import { z, type ZodTypeAny } from "zod";
import { HttpError } from "~/errors";
import type { AuthState, Endpoint, EndpointContext } from "~/lib/xapi/types";
import { authorized } from "~/lib/xapi/utils";
import { destroySession, json } from "~/utils/express";
import { getFieldErrors } from "~/utils/zod";


export interface Options<
  TMethod extends HttpMethod,
  TRoute extends string,
  TAuth extends AuthState | AuthState[] | null,
  TInput extends ZodTypeAny = ZodTypeAny,
  TOutput extends ZodTypeAny = ZodTypeAny,
> {
  method: TMethod;
  route: TRoute;
  auth?: TAuth;
  input?: TInput;
  output?: TOutput;
  handler: (ctx: EndpointContext<TRoute, TAuth, TInput>) => Promise<z.infer<TOutput>> | z.infer<TOutput>;
}

export function endpoint<
  TMethod extends HttpMethod,
  TRoute extends string,
  TAuth extends AuthState | AuthState[] | null,
  TInput extends ZodTypeAny = ZodTypeAny,
  TOutput extends ZodTypeAny = ZodTypeAny,
>(options: Options<TMethod, TRoute, TAuth, TInput, TOutput>): Endpoint<TMethod, TRoute, TInput, TOutput> {
  return {
    method: options.method,
    route: options.route,
    input: null as never,
    output: null as never,
    handler: async (req, res) => {
      if (typeof options.auth != "undefined") {
        if (options.auth === null) {
          if (typeof req.session.auth != "undefined") {
            return json(res, 401, { message: "Authorized" });
          }
        }
        else {
          const result = authorized(req, options.auth);
          if (! result) {
            return json(res, 401, { message: "Unauthorized" });
          }
        }
      }

      if (typeof options.input != "undefined") {
        const result = options.input.safeParse(req.body);
        if (! result.success) {
          return json(res, 422, { errors: getFieldErrors(result.error) });
        }
      }

      try {
        const result = await options.handler({
          input: req.body,
          params: req.params,
          user: req.user,
          terminal: req.terminal,
          session: {
            auth: req.session.auth as never,
            update: (auth) => {
              req.session.auth = auth;
            },
            destroy: () => destroySession(req),
          },
        });

        return json(res, 200, result);
      }
      catch (error) {
        console.error(error);

        if (error instanceof HttpError) {
          return json(res, error.status, { message: error.message });
        }

        return json(res, 500, { message: "Internal server error" });
      }
    },
  };
}
