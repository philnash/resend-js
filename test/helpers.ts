import { assertSpyCall, returnsNext, stub } from "./deps.ts";
import { version } from "../src/version.ts";

export const apiKey = "re_123";

export const expectedHeaders = {
  "Content-Type": "application/json",
  "User-Agent": `resend-fetch:${version}`,
  Authorization: `Bearer ${apiKey}`,
};

export async function stubFetch<T>(
  url: string | URL,
  method: "GET" | "POST" | "DELETE",
  headers: HeadersInit,
  body: string | null | undefined,
  response: Promise<Response> | Error,
  fn: () => Promise<T>,
) {
  const fetchStub = stub(globalThis, "fetch", returnsNext([response]));
  try {
    const result = await fn();
    if (method === "GET" || method === "DELETE") {
      assertSpyCall(fetchStub, 0, { args: [url, { headers, method }] });
    } else {
      assertSpyCall(fetchStub, 0, { args: [url, { headers, body, method }] });
    }
    return result;
  } finally {
    fetchStub.restore();
  }
}
