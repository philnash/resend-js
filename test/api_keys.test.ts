import { Resend } from "../main.ts";
import {
  CreateAPIKeyOptions,
  CreateAPIKeyResponse,
  GetAPIKeyResponse,
} from "../src/api_keys/types.ts";
import { ListResponse } from "../src/types.ts";
import { ResendHttpError, ResendNetworkError } from "../src/error.ts";
import {
  describe,
  it,
  beforeEach,
  assertEquals,
  assertRejects,
} from "./deps.ts";
import { expectedHeaders, apiKey, stubFetch } from "./helpers.ts";

describe("with an authenticated client", () => {
  let resend: Resend;
  const url = new URL("https://api.resend.com/api-keys");
  const payload: CreateAPIKeyOptions = {
    name: "Test API Key",
  };

  beforeEach(() => {
    resend = new Resend(apiKey);
  });

  describe("creating an API Key", () => {
    const apiKeyData: CreateAPIKeyResponse = {
      id: "dacf4072-4119-4d88-932f-6202748ac7c8",
      token: "re_c1tpEyD8_NKFusih9vKVQknRAQfmFcWCv",
    };
    let apiKeyResponse: Promise<Response>;

    beforeEach(() => {
      apiKeyResponse = Promise.resolve(
        new Response(JSON.stringify(apiKeyData))
      );
    });

    it("succeeds with a name", async () => {
      const result = await stubFetch(
        url,
        "POST",
        expectedHeaders,
        JSON.stringify(payload),
        apiKeyResponse,
        () => {
          return resend.apiKeys.create(payload);
        }
      );
      assertEquals(result, apiKeyData);
    });

    it("succeeds with a name, permission, and domain_id", async () => {
      const fullPayload: CreateAPIKeyOptions = {
        ...payload,
        permission: "sending_access",
        domain_id: "4dd369bc-aa82-4ff3-97de-514ae3000ee0",
      };
      const result = await stubFetch(
        url,
        "POST",
        expectedHeaders,
        JSON.stringify(fullPayload),
        apiKeyResponse,
        () => {
          return resend.apiKeys.create(fullPayload);
        }
      );
      assertEquals(result, apiKeyData);
    });
  });

  describe("listing API Keys", () => {
    let apiKeyListResponse: Promise<Response>;
    const apiKeyList: ListResponse<GetAPIKeyResponse> = {
      data: [
        {
          id: "91f3200a-df72-4654-b0cd-f202395f5354",
          name: "Production",
          created_at: new Date("2023-04-08T00:11:13.110779+00:00"),
        },
      ],
    };
    beforeEach(() => {
      apiKeyListResponse = Promise.resolve(
        new Response(JSON.stringify(apiKeyList))
      );
    });

    it("returns a list of api keys", async () => {
      const result = await stubFetch(
        url,
        "GET",
        expectedHeaders,
        null,
        apiKeyListResponse,
        () => {
          return resend.apiKeys.list();
        }
      );
      assertEquals(result, apiKeyList);
    });
  });

  describe("deleting an api key", () => {
    const apiKeyId = "b6d24b8e-af0b-4c3c-be0c-359bbd97381e";
    const url = new URL(`https://api.resend.com/api-keys/${apiKeyId}`);

    it("succeeds with a resolved promise", async () => {
      await stubFetch(
        url,
        "DELETE",
        expectedHeaders,
        null,
        Promise.resolve(new Response()),
        async () => {
          await resend.apiKeys.remove(apiKeyId);
        }
      );
    });

    it("it throws an Http error if the response is an error", async () => {
      const errorResponse = Promise.resolve(
        new Response("", {
          status: 404,
          statusText: "The requested endpoint does not exist.",
        })
      );

      await assertRejects(
        async () => {
          await stubFetch(
            url,
            "DELETE",
            expectedHeaders,
            null,
            errorResponse,
            () => {
              return resend.apiKeys.remove(apiKeyId);
            }
          );
        },
        ResendHttpError,
        "The requested endpoint does not exist."
      );
    });

    it("rethrows any other errors as a network error", async () => {
      const error = new Error("Oops");
      await assertRejects(
        async () => {
          await stubFetch(url, "DELETE", expectedHeaders, null, error, () => {
            return resend.apiKeys.remove(apiKeyId);
          });
        },
        ResendNetworkError,
        "Oops"
      );
    });
  });
});
