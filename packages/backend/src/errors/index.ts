export class HttpError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
  }
}

export class BadRequestError extends HttpError {
  constructor(message: string) {
    super(400, message);
  }
}

export class UnauthorizedError extends HttpError {
  constructor() {
    super(401, "Unauthorized");
  }
}

export class ForbiddenError extends HttpError {
  constructor() {
    super(403, "Forbidden");
  }
}

export class NotFoundError extends HttpError {
  constructor(message = "Not Found") {
    super(404, message);
  }
}

export class InternalServerError extends HttpError {
  constructor(message = "Internal server error") {
    super(500, message);
  }
}

export class NotImplementedError extends HttpError {
  constructor() {
    super(501, "Not Implemented");
  }
}
