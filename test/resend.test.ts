import { assertEquals } from "https://deno.land/std@0.197.0/assert/assert_equals.ts";
import { Resend } from "../main.ts";
import {
  CreateEmailOptions,
  CreateEmailResponse,
} from "../src/emails/emails.ts";
import {
  describe,
  it,
  assertThrows,
  stub,
  returnsNext,
  assertSpyCall,
} from "./deps.ts";
import { version } from "../src/version.ts";

const apiKey = "re_123";
const emailData: CreateEmailResponse = {
  id: "49a3999c-0ce1-4ea6-ab68-afcd6dc2e794",
};
const emailResponse: Promise<Response> = Promise.resolve(
  new Response(JSON.stringify(emailData))
);
const expectedHeaders = {
  "Content-Type": "application/json",
  "User-Agent": `resend-fetch:${version}`,
  Authorization: `Bearer: ${apiKey}`,
};

async function stubFetch<T>(
  url: string | URL,
  method: "GET" | "POST",
  headers: HeadersInit,
  body: string,
  response: Promise<Response>,
  fn: () => Promise<T>
) {
  const fetchStub = stub(globalThis, "fetch", returnsNext([response]));
  const result = await fn();
  assertSpyCall(fetchStub, 0, { args: [url, { headers, body, method }] });
  fetchStub.restore();
  return result;
}

describe("Resend", () => {
  it("requires an API key", () => {
    assertThrows(
      () => new Resend(),
      Error,
      'Missing API key. Pass it to the constructor `new Resend("re_123")`'
    );
  });

  it("sends an email", async () => {
    const resend = new Resend(apiKey);
    const payload: CreateEmailOptions = {
      from: "bu@resend.com",
      to: "zeno@resend.com",
      subject: "Hello World",
      html: "<h1>Hello world</h1>",
    };
    const result = await stubFetch(
      new URL("https://api.resend.com/emails"),
      "POST",
      expectedHeaders,
      JSON.stringify(payload),
      emailResponse,
      () => {
        return resend.emails.send(payload);
      }
    );
    assertEquals(result, emailData);
  });
});
