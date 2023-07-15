export class ResendError extends Error {}

export class ResendHttpError extends Error {
  readonly status?: number;
  readonly response?: Response;

  constructor(message: string, status?: number, response?: Response) {
    super(message);
    this.status = status;
    this.response = response;
    Object.setPrototypeOf(this, ResendHttpError.prototype);
  }
}
