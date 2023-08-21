import { Buffer } from "../deps.ts";

export type Attachment = {
  content?: string | Buffer;
  filename?: string | false;
  path?: string;
};

export type Tag = { name: string; value: string };

export type BaseCreateEmailOptions = {
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

export type GetEmailResponse = {
  object: "email";
  id: string;
  to: string[];
  from: string;
  created_at: string;
  subject: string;
  html: string | null;
  text?: string | null;
  cc: string[];
  bcc: string[];
  reply_to: string[] | null;
  last_event:
    | "sent"
    | "delivered"
    | "delivery delayed"
    | "complained"
    | "bounced";
};
