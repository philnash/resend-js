import { Resend } from "../resend.ts";
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

  get(id: string): Promise<GetEmailResponse> {
    return this.resend.get<GetEmailResponse>(`/emails/${id}`);
  }
}
