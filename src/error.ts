export class ResendError extends Error {
  constructor(message?: string, options?: ErrorOptions) {
    super(message, options);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ResendNetworkError extends ResendError {}

export class ResendHttpError extends ResendError {
  readonly status?: number;
  readonly response?: Response;

  constructor(message: string, status?: number, response?: Response) {
    super(message);
    this.status = status;
    this.response = response;
  }
}
