import type { RequestHandler, Router } from "express";
import type { RouteParameters } from "express-serve-static-core";
import type { Auth, HttpMethod } from "webrm-shared";
import { z, type ZodTypeAny } from "zod";
import type { Terminal, User } from "~/models";


export interface Endpoint<
  TMethod extends HttpMethod,
  TRoute extends string,
  TInput extends ZodTypeAny,
  TOutput extends ZodTypeAny
> {
  method: TMethod;
  route: TRoute;
  input: z.infer<TInput>;
  output: z.infer<TOutput>;
  handler: RequestHandler<RouteParameters<TRoute>>;
}

export interface Api<T extends Record<string, Endpoint<HttpMethod, any, ZodTypeAny, ZodTypeAny>>> {
  endpoints: T;
  toRouter(): Router;
}

export interface EndpointContext<
  TRoute extends string,
  TAuth extends AuthState | AuthState[] | null,
  TInput extends ZodTypeAny,
> {
  params: RouteParameters<TRoute>;
  input: TInput extends ZodTypeAny ? z.infer<TInput> : never;
  session: EndpointContextSession<TAuth>;
  user: User | null;
  terminal: Terminal | null;
}

export interface EndpointContextSession<TAuth extends AuthState | AuthState[] | null> {
  auth: TAuth extends null ? undefined : Auth;
  update(auth: Auth): void;
  destroy(): Promise<void>;
}

export enum AuthState {
  Admin,
  Waiter,
  AreaTerminal,
  TableTerminal,
}
