import { baseUrl, apiKey } from "./config.ts";
import { version } from "./version.ts";
import { ResendError, ResendHttpError, ResendNetworkError } from "./error.ts";
import { Emails } from "./emails/emails.ts";
import { CreateEmailOptions } from "./emails/types.ts";
import { APIKeys } from "./api_keys/api_keys.ts";
import { CreateAPIKeyOptions } from "./api_keys/types.ts";
import { Domains } from "./domains/domains.ts";
import { CreateDomainOptions } from "./domains/types.ts";

type ResendOptions = {
  baseUrl: string;
};
type DefaultHeaders = {
  Authorization: string;
  "User-Agent": string;
  "Content-Type": string;
};

type PostPayload =
  | CreateEmailOptions
  | CreateAPIKeyOptions
  | CreateDomainOptions;

export class Resend {
  readonly baseUrl: string;
  readonly apiKey?: string;
  private readonly headers: DefaultHeaders;

  readonly emails = new Emails(this);
  readonly apiKeys = new APIKeys(this);
  readonly domains = new Domains(this);

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

  post(path: string): Promise<void>;
  post<T>(path: string, payload: PostPayload): Promise<T>;
  async post<T>(path: string, payload?: PostPayload): Promise<T | void> {
    const url = new URL(`${this.baseUrl}${path}`);
    try {
      const response = await fetch(url, {
        body: JSON.stringify(payload),
        headers: this.headers,
        method: "POST",
      });
      if (response.ok) {
        if (typeof payload !== "undefined") {
          return await response.json();
        } else {
          return;
        }
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

  async remove(path: string): Promise<void> {
    const url = new URL(`${this.baseUrl}${path}`);
    try {
      const response = await fetch(url, {
        headers: this.headers,
        method: "DELETE",
      });
      if (response.ok) {
        return;
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
