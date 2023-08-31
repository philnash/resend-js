import { Resend } from "../main.ts";
import { ListResponse } from "../src/types.ts";
import { describe, it, beforeEach, assertEquals } from "./deps.ts";
import { expectedHeaders, apiKey, stubFetch } from "./helpers.ts";
import {
  CreateDomainOptions,
  CreateDomainResponse,
  GetDomainResponse,
} from "../src/domains/types.ts";

describe("with an authenticated client", () => {
  let resend: Resend;
  const url = new URL("https://api.resend.com/domains");
  const payload: CreateDomainOptions = {
    name: "Test Domain",
    region: "us-east-1",
  };

  beforeEach(() => {
    resend = new Resend(apiKey);
  });

  describe("creating a domain", () => {
    const domainData: CreateDomainResponse = {
      id: "4dd369bc-aa82-4ff3-97de-514ae3000ee0",
      name: "example.com",
      created_at: new Date("2023-03-28T17:12:02.059593+00:00"),
      status: "not_started",
      records: [
        {
          record: "SPF",
          name: "bounces",
          type: "MX",
          ttl: "Auto",
          status: "not_started",
          value: "feedback-smtp.us-east-1.amazonses.com",
          priority: 10,
        },
        {
          record: "SPF",
          name: "bounces",
          value: '"v=spf1 include:amazonses.com ~all"',
          type: "TXT",
          ttl: "Auto",
          status: "not_started",
        },
        {
          record: "DKIM",
          name: "nhapbbryle57yxg3fbjytyodgbt2kyyg._domainkey",
          value: "nhapbbryle57yxg3fbjytyodgbt2kyyg.dkim.amazonses.com.",
          type: "CNAME",
          status: "not_started",
          ttl: "Auto",
        },
        {
          record: "DKIM",
          name: "xbakwbe5fcscrhzshpap6kbxesf6pfgn._domainkey",
          value: "xbakwbe5fcscrhzshpap6kbxesf6pfgn.dkim.amazonses.com.",
          type: "CNAME",
          status: "not_started",
          ttl: "Auto",
        },
        {
          record: "DKIM",
          name: "txrcreso3dqbvcve45tqyosxwaegvhgn._domainkey",
          value: "txrcreso3dqbvcve45tqyosxwaegvhgn.dkim.amazonses.com.",
          type: "CNAME",
          status: "not_started",
          ttl: "Auto",
        },
      ],
      region: "us-east-1",
    };
    let domainResponse: Promise<Response>;

    beforeEach(() => {
      domainResponse = Promise.resolve(
        new Response(JSON.stringify(domainData))
      );
    });

    it("succeeds with a name and region", async () => {
      const result = await stubFetch(
        url,
        "POST",
        expectedHeaders,
        JSON.stringify(payload),
        domainResponse,
        () => {
          return resend.domains.create(payload);
        }
      );
      assertEquals(result, domainData);
    });
  });

  describe("fetching domains", () => {
    const domainData: GetDomainResponse = {
      name: "example.com",
      id: "d91cd9bd-1176-453e-8fc1-35364d380206",
      status: "not_started",
      created_at: new Date("2023-04-26T20:21:26.347412+00:00"),
      object: "domain",
      region: "us-east-1",
    };

    it("gets the individual domain data", async () => {
      const domainResponse: Promise<Response> = Promise.resolve(
        new Response(JSON.stringify(domainData))
      );
      const domainGetUrl = new URL(`${url.toString()}/${domainData.id}`);
      const result = await stubFetch(
        domainGetUrl,
        "GET",
        expectedHeaders,
        null,
        domainResponse,
        () => {
          return resend.domains.get(domainData.id);
        }
      );
      assertEquals(result, domainData);
    });

    it("gets a list of domains", async () => {
      const domainListData: ListResponse<GetDomainResponse> = {
        data: [domainData],
      };
      const domainListResponse: Promise<Response> = Promise.resolve(
        new Response(JSON.stringify(domainListData))
      );
      const result = await stubFetch(
        url,
        "GET",
        expectedHeaders,
        null,
        domainListResponse,
        () => {
          return resend.domains.list();
        }
      );
      assertEquals(result, domainListData);
    });
  });

  describe("verifying domain", () => {
    it("verifies with no response", async () => {
      const id = "d91cd9bd-1176-453e-8fc1-35364d380206";
      const verifyUrl = new URL(`${url.toString()}/${id}/verify`);
      await stubFetch(
        verifyUrl,
        "POST",
        expectedHeaders,
        undefined,
        Promise.resolve(new Response()),
        async () => {
          await resend.domains.verify(id);
        }
      );
    });
  });

  describe("deleting a domain", async () => {
    const id = "d91cd9bd-1176-453e-8fc1-35364d380206";
    const domainRemoveUrl = new URL(`${url.toString()}/${id}`);
    await stubFetch(
      domainRemoveUrl,
      "DELETE",
      expectedHeaders,
      undefined,
      Promise.resolve(new Response()),
      async () => {
        await resend.domains.remove(id);
      }
    );
  });
});
