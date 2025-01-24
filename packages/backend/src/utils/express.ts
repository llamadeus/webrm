import { type NextFunction, type Request, type RequestHandler, type Response } from "express";
import type { Json } from "webrm-shared";


export function json(res: Response, status: number, data: Json) {
  res.status(status).json(data);
}

export async function destroySession(req: Request) {
  return new Promise<void>((resolve, reject) => {
    req.session.destroy((err) => {
      if (err) {
        return reject(err);
      }

      resolve();
    });
  });
}

export function chainMiddlewares(...middlewares: RequestHandler[]): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    let index = 0;

    const runNext = (err?: unknown) => {
      if (err) {
        return next(err);
      }

      const middleware = middlewares[index++];
      if (! middleware) {
        return next();
      }

      try {
        middleware(req, res, runNext);
      }
      catch (error) {
        next(error);
      }
    };

    runNext();
  };
}
