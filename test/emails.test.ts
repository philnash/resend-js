import { Resend } from "../main.ts";
import {
  CreateEmailOptions,
  CreateEmailResponse,
  GetEmailResponse,
} from "../src/emails/types.ts";
import {
  describe,
  it,
  beforeEach,
  assertEquals,
  assertRejects,
} from "./deps.ts";
import { expectedHeaders, apiKey, stubFetch } from "./helpers.ts";
import { ResendHttpError } from "../src/error.ts";

const emailData: CreateEmailResponse = {
  id: "49a3999c-0ce1-4ea6-ab68-afcd6dc2e794",
};
const emailResponse: Promise<Response> = Promise.resolve(
  new Response(JSON.stringify(emailData))
);

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

  describe("sending emails", () => {
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

    it("throws an error if the API returns an 4xx error", async () => {
      const errorResponse = Promise.resolve(
        new Response("", {
          status: 422,
          statusText:
            "The request body is missing one or more required fields.",
        })
      );
      await assertRejects(
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

    it("throws an error if the API returns an 5xx error", async () => {
      const errorResponse = Promise.resolve(
        new Response("", {
          status: 500,
          statusText: "An unexpected error occurred.",
        })
      );
      await assertRejects(
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
        "An unexpected error occurred."
      );
    });

    it("rethrows any other errors", async () => {
      const error = new Error("Oops");
      await assertRejects(
        async () => {
          await stubFetch(
            url,
            "POST",
            expectedHeaders,
            JSON.stringify(payload),
            error,
            () => {
              return resend.emails.send(payload);
            }
          );
        },
        Error,
        "Oops"
      );
    });
  });

  describe("fetching emails", () => {
    const emailData: GetEmailResponse = {
      object: "email",
      id: "4ef9a417-02e9-4d39-ad75-9611e0fcc33c",
      to: ["delivered@resend.dev"],
      from: "Acme <onboarding@resend.dev>",
      created_at: "2023-04-03T22:13:42.674981+00:00",
      subject: "Hello World",
      html: "Congrats on sending your <strong>first email</strong>!",
      last_event: "delivered",
      cc: [],
      bcc: [],
      reply_to: null,
    };
    const emailResponse: Promise<Response> = Promise.resolve(
      new Response(JSON.stringify(emailData))
    );

    it("gets the email data", async () => {
      url.pathname += `/${emailData.id}`;
      const result = await stubFetch(
        url,
        "GET",
        expectedHeaders,
        null,
        emailResponse,
        () => {
          return resend.emails.get(emailData.id);
        }
      );
      assertEquals(result, emailData);
    });

    it("throws an Http error if the response is an error", async () => {
      const errorResponse = Promise.resolve(
        new Response("", {
          status: 404,
          statusText: "The requested endpoint does not exist.",
        })
      );

      url.pathname += `/${emailData.id}blah`;
      await assertRejects(
        async () => {
          await stubFetch(
            url,
            "GET",
            expectedHeaders,
            null,
            errorResponse,
            () => {
              return resend.emails.get(emailData.id);
            }
          );
        },
        ResendHttpError,
        "The requested endpoint does not exist."
      );
    });

    it("rethrows any other errors", async () => {
      const error = new Error("Oops");
      await assertRejects(
        async () => {
          await stubFetch(
            url,
            "POST",
            expectedHeaders,
            JSON.stringify(payload),
            error,
            () => {
              return resend.emails.get(emailData.id);
            }
          );
        },
        Error,
        "Oops"
      );
    });
  });
});
