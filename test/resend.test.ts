import { describe, it, assertThrows } from "./deps.ts";
import { Resend } from "../mod.ts";
import { ResendError } from "../src/error.ts";

describe("Resend", () => {
  it("requires an API key", () => {
    assertThrows(
      () => new Resend(),
      ResendError,
      'Missing API key. Pass it to the constructor `new Resend("re_123")`'
    );
  });
});
