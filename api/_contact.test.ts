// El guion bajo evita que Vercel convierta este archivo en una función.
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "./contact";

const SITE = "https://andresbadillo.example";

const validBody = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  message: "Hola, me interesa tu trabajo.",
  website: "",
  elapsedMs: 12_000,
};

function contactRequest(
  body: unknown,
  { origin = SITE, contentType = "application/json" }: { origin?: string | null; contentType?: string } = {},
): Request {
  const headers = new Headers({ "Content-Type": contentType });
  if (origin) headers.set("Origin", origin);
  return new Request(`${SITE}/api/contact`, {
    method: "POST",
    headers,
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

describe("POST /api/contact", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.stubGlobal("fetch", fetchMock);
    vi.stubEnv("RESEND_API_KEY", "re_test_key");
    vi.stubEnv("CONTACT_TO_EMAIL", "owner@example.com");
    vi.stubEnv("CONTACT_FROM_EMAIL", "");
    vi.spyOn(console, "error").mockImplementation(() => {});
    fetchMock.mockResolvedValue(new Response(JSON.stringify({ id: "email_1" }), { status: 200 }));
  });

  afterEach(() => {
    fetchMock.mockReset();
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("sends a valid message to Resend as plain text with reply-to", async () => {
    const response = await POST(contactRequest(validBody));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://api.resend.com/emails");
    expect(new Headers(init.headers).get("Authorization")).toBe("Bearer re_test_key");
    const payload = JSON.parse(String(init.body));
    expect(payload).toEqual({
      from: "Portfolio <onboarding@resend.dev>",
      to: ["owner@example.com"],
      reply_to: "ada@example.com",
      subject: "Contacto desde el portfolio: Ada Lovelace",
      text: "Nombre: Ada Lovelace\nEmail: ada@example.com\n\nHola, me interesa tu trabajo.",
    });
    expect(payload).not.toHaveProperty("html");
  });

  it("uses CONTACT_FROM_EMAIL when it is set", async () => {
    vi.stubEnv("CONTACT_FROM_EMAIL", "Portfolio <hola@andresbadillo.example>");
    await POST(contactRequest(validBody));
    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(JSON.parse(String(init.body)).from).toBe("Portfolio <hola@andresbadillo.example>");
  });

  it("returns field errors for an invalid message without calling Resend", async () => {
    const response = await POST(contactRequest({ ...validBody, email: "nope" }));
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ errors: { email: expect.any(String) } });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("pretends success for bots without sending anything", async () => {
    const honeypot = await POST(contactRequest({ ...validBody, website: "https://spam.example" }));
    const tooFast = await POST(contactRequest({ ...validBody, elapsedMs: 500 }));
    expect(honeypot.status).toBe(200);
    expect(tooFast.status).toBe(200);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects requests from another origin or without origin", async () => {
    expect((await POST(contactRequest(validBody, { origin: "https://evil.example" }))).status).toBe(403);
    expect((await POST(contactRequest(validBody, { origin: null }))).status).toBe(403);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects non-JSON bodies", async () => {
    const form = contactRequest("name=Ada", { contentType: "application/x-www-form-urlencoded" });
    expect((await POST(form)).status).toBe(415);
    expect((await POST(contactRequest("{not json"))).status).toBe(400);
  });

  it("rejects bodies larger than 16 KB", async () => {
    const response = await POST(contactRequest({ ...validBody, message: "a".repeat(17_000) }));
    expect(response.status).toBe(413);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("fails with 502 when the server is not configured", async () => {
    vi.stubEnv("RESEND_API_KEY", "");
    const response = await POST(contactRequest(validBody));
    expect(response.status).toBe(502);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("fails with 502 when Resend rejects or is unreachable", async () => {
    fetchMock.mockResolvedValueOnce(new Response("forbidden", { status: 403 }));
    expect((await POST(contactRequest(validBody))).status).toBe(502);
    fetchMock.mockRejectedValueOnce(new Error("network down"));
    expect((await POST(contactRequest(validBody))).status).toBe(502);
  });
});
