export const baseUrl =
  Deno.env.get("RESEND_BASE_URL") || "https://api.resend.com";

export const apiKey = Deno.env.get("RESEND_API_KEY");
