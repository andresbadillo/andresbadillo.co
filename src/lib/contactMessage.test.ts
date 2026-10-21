import {
  buildEmail,
  CONTACT_LIMITS,
  isLikelyBot,
  PRIVACY_POLICY_VERSION,
  validateContactInput,
} from "@/lib/contactMessage";
import { describe, expect, it } from "vitest";

const validInput = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  message: "Hola, me interesa tu trabajo.",
  consent: true,
  website: "",
  elapsedMs: 12_000,
};

describe("validateContactInput", () => {
  it("accepts a valid message and trims fields", () => {
    const result = validateContactInput({ ...validInput, name: "  Ada  ", message: "  Hola, me interesa.  " });
    expect(result).toEqual({
      ok: true,
      value: { ...validInput, name: "Ada", message: "Hola, me interesa." },
    });
  });

  it("rejects non-object payloads", () => {
    const result = validateContactInput("hola");
    expect(result.ok).toBe(false);
    if (!result.ok) expect(Object.keys(result.errors).sort()).toEqual(["consent", "email", "message", "name"]);
  });

  it("rejects empty and overlong names", () => {
    expect(validateContactInput({ ...validInput, name: "   " }).ok).toBe(false);
    expect(validateContactInput({ ...validInput, name: "a".repeat(CONTACT_LIMITS.nameMax + 1) }).ok).toBe(false);
    expect(validateContactInput({ ...validInput, name: "a".repeat(CONTACT_LIMITS.nameMax) }).ok).toBe(true);
  });

  it.each(["", "ada", "ada@", "ada@example", "ada @example.com", "ada@exa mple.com"])(
    "rejects invalid email %j",
    (email) => {
      expect(validateContactInput({ ...validInput, email }).ok).toBe(false);
    },
  );

  it("rejects emails longer than the limit", () => {
    const email = `${"a".repeat(CONTACT_LIMITS.emailMax)}@example.com`;
    expect(validateContactInput({ ...validInput, email }).ok).toBe(false);
  });

  it("enforces message length", () => {
    expect(validateContactInput({ ...validInput, message: "a".repeat(CONTACT_LIMITS.messageMin - 1) }).ok).toBe(false);
    expect(validateContactInput({ ...validInput, message: "a".repeat(CONTACT_LIMITS.messageMax + 1) }).ok).toBe(false);
    expect(validateContactInput({ ...validInput, message: "a".repeat(CONTACT_LIMITS.messageMax) }).ok).toBe(true);
  });

  it("keeps the name on one line so it cannot break the email subject", () => {
    const result = validateContactInput({ ...validInput, name: "Ada\r\nBcc: spam@example.com" });
    expect(result.ok && result.value.name).toBe("Ada Bcc: spam@example.com");
  });

  it("keeps line breaks in the message but drops other control characters", () => {
    const result = validateContactInput({ ...validInput, message: "Línea uno\r\nLínea\u0007 dos" });
    expect(result.ok && result.value.message).toBe("Línea uno\nLínea dos");
  });

  it("requires the privacy consent to be exactly true", () => {
    const { consent: _omitted, ...withoutConsent } = validInput;
    for (const input of [withoutConsent, { ...validInput, consent: false }, { ...validInput, consent: "on" }]) {
      const result = validateContactInput(input);
      expect(result.ok).toBe(false);
      if (!result.ok) expect(Object.keys(result.errors)).toEqual(["consent"]);
    }
  });

  it("treats a missing or invalid elapsed time as zero", () => {
    const result = validateContactInput({ ...validInput, elapsedMs: "nope" });
    expect(result.ok && result.value.elapsedMs).toBe(0);
  });
});

describe("isLikelyBot", () => {
  it("passes a person who took a while to write", () => {
    expect(isLikelyBot(validInput)).toBe(false);
  });

  it("flags a filled honeypot", () => {
    expect(isLikelyBot({ ...validInput, website: "https://spam.example" })).toBe(true);
  });

  it("flags a submission faster than the minimum time", () => {
    expect(isLikelyBot({ ...validInput, elapsedMs: CONTACT_LIMITS.minElapsedMs - 1 })).toBe(true);
  });
});

describe("buildEmail", () => {
  it("builds a plain-text email with the sender details and the consent proof", () => {
    const receivedAt = new Date("2026-10-21T15:42:10.000Z");
    expect(buildEmail({ ...validInput, message: "<b>Hola</b>" }, receivedAt)).toEqual({
      subject: "Contacto desde el portfolio: Ada Lovelace",
      text: [
        "Nombre: Ada Lovelace",
        "Email: ada@example.com",
        `Autorización de tratamiento de datos: aceptada el 2026-10-21T15:42:10.000Z · Política v${PRIVACY_POLICY_VERSION}`,
        "",
        "<b>Hola</b>",
      ].join("\n"),
    });
  });
});
