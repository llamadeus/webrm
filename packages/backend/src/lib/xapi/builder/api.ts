import { Router } from "express";
import type { HttpMethod } from "webrm-shared";
import type { ZodTypeAny } from "zod";
import type { API, Endpoint } from "~/lib/xapi/types";


export function api<T extends Record<string, Endpoint<HttpMethod, any, ZodTypeAny, ZodTypeAny>>>(endpoints: T): API<T> {
  return {
    endpoints,
    toRouter() {
      const router = Router();

      for (const endpoint of Object.values(endpoints)) {
        const method = endpoint.method.toLowerCase() as Lowercase<HttpMethod>;

        router[method](endpoint.route, endpoint.handler);
      }

      return router;
    },
  };
}
