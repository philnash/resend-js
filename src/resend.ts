import { baseUrl, apiKey } from "./config.ts";
import { version } from "./version.ts";
import { ResendError, ResendHttpError, ResendNetworkError } from "./error.ts";
import { Emails } from "./emails/emails.ts";
import { CreateEmailOptions } from "./emails/types.ts";

type ResendOptions = {
  baseUrl: string;
};
type DefaultHeaders = {
  Authorization: string;
  "User-Agent": string;
  "Content-Type": string;
};

type PostPayload = CreateEmailOptions;

export class Resend {
  readonly baseUrl: string;
  readonly apiKey?: string;
  private readonly headers: DefaultHeaders;

  readonly emails = new Emails(this);

  constructor(key?: string, options: ResendOptions = { baseUrl }) {
    this.baseUrl = options.baseUrl;
    this.apiKey = key;
    if (!key) {
      this.apiKey = apiKey;
    }
    if (!this.apiKey) {
      throw new ResendError(
        'Missing API key. Pass it to the constructor `new Resend("re_123")`'
      );
    }
    this.headers = {
      Authorization: `Bearer: ${this.apiKey}`,
      "Content-Type": "application/json",
      "User-Agent": `resend-fetch:${version}`,
    };
  }

  async get<T>(path: string): Promise<T> {
    const url = new URL(`${this.baseUrl}${path}`);
    try {
      const response = await fetch(url, {
        headers: this.headers,
        method: "GET",
      });
      if (response.ok) {
        return await response.json();
      } else {
        throw new ResendHttpError(
          response.statusText,
          response.status,
          response
        );
      }
    } catch (error) {
      throw this.#rethrowError(error);
    }
  }

  async post<T>(path: string, payload: PostPayload): Promise<T> {
    const url = new URL(`${this.baseUrl}${path}`);
    try {
      const response = await fetch(url, {
        body: JSON.stringify(payload),
        headers: this.headers,
        method: "POST",
      });
      if (response.ok) {
        return await response.json();
      } else {
        throw new ResendHttpError(
          response.statusText,
          response.status,
          response
        );
      }
    } catch (error) {
      throw this.#rethrowError(error);
    }
  }

  #rethrowError(error: unknown) {
    if (error instanceof ResendHttpError) {
      return error;
    } else if (error instanceof Error) {
      return new ResendNetworkError(error.message, { cause: error });
    } else {
      return error;
    }
  }
}
