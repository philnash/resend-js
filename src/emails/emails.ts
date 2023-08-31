import { Resend } from "../resend.ts";
import { WithStringCreatedAt } from "../types.ts";
import {
  CreateEmailOptions,
  CreateEmailResponse,
  GetEmailResponse,
} from "./types.ts";

export class Emails {
  constructor(private readonly resend: Resend) {}

  send(options: CreateEmailOptions): Promise<CreateEmailResponse> {
    return this.resend.post<CreateEmailResponse>("/emails", options);
  }

  async get(id: string): Promise<GetEmailResponse> {
    const result = await this.resend.get<WithStringCreatedAt<GetEmailResponse>>(
      `/emails/${id}`
    );
    return { ...result, created_at: new Date(result.created_at) };
  }
}
