export class HttpError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);

    console.error(this, message, this.message);
  }
}
