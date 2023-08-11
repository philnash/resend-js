import { Resend } from "../main.ts";
import {
  CreateEmailOptions,
  CreateEmailResponse,
} from "../src/emails/emails.ts";
import {
  describe,
  it,
  beforeEach,
  stub,
  returnsNext,
  assertThrows,
  assertSpyCall,
  assertEquals,
  assertRejects,
} from "./deps.ts";
import { version } from "../src/version.ts";
import { ResendHttpError } from "../src/error.ts";

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

  describe("with an authenticated client", () => {
    let resend: Resend;
    const url = new URL("https://api.resend.com/emails");
    const payload: CreateEmailOptions = {
      from: "bu@resend.com",
      to: "zeno@resend.com",
      subject: "Hello World",
      html: "<h1>Hello world</h1>",
    };

    beforeEach(() => {
      resend = new Resend(apiKey);
    });

    it("sends an email", async () => {
      const result = await stubFetch(
        url,
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

    it("throws an error if the API returns an 4xx error", () => {
      const errorResponse = Promise.resolve(
        new Response("", {
          status: 422,
          statusText:
            "The request body is missing one or more required fields.",
        })
      );
      assertRejects(
        async () => {
          await stubFetch(
            url,
            "POST",
            expectedHeaders,
            JSON.stringify(payload),
            errorResponse,
            () => {
              return resend.emails.send(payload);
            }
          );
        },
        ResendHttpError,
        "The request body is missing one or more required fields."
      );
    });
  });
});
