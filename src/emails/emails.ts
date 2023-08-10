import { Resend } from "../resend.ts";
import { Buffer } from "../deps.ts";

type Attachment = {
  content?: string | Buffer;
  filename?: string | false;
  path?: string;
};

type Tag = { name: string; value: string };

type BaseCreateEmailOptions = {
  attachments?: Attachment[];
  bcc?: string | string[];
  cc?: string | string[];
  from: string;
  headers?: Record<string, string>;
  reply_to?: string | string[];
  subject: string;
  tags?: Tag[];
  to: string | string[];
};

export type CreateEmailOptions =
  | (BaseCreateEmailOptions & {
      text: string;
      html?: string;
    })
  | (BaseCreateEmailOptions & { html: string; text?: string });

export type CreateEmailResponse = {
  id: string;
};

export class Emails {
  constructor(private readonly resend: Resend) {}

  send(options: CreateEmailOptions): Promise<CreateEmailResponse> {
    return this.resend.post<CreateEmailResponse>("/emails", options);
  }
}
