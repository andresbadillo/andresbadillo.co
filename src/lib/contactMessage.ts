/**
 * Validación del formulario de contacto. La usan el navegador (useContactForm) y la función
 * serverless (api/contact.ts), así que no importa nada de React ni de Node.
 */

export interface ContactInput {
  name: string;
  email: string;
  message: string;
  /** Campo trampa: invisible para personas; si llega relleno, lo envió un bot. */
  website: string;
  /** Milisegundos entre que se mostró el formulario y el envío. */
  elapsedMs: number;
}

export type ContactField = "name" | "email" | "message";
export type ContactValidationErrors = Partial<Record<ContactField, string>>;

export type ContactValidationResult =
  | { ok: true; value: ContactInput }
  | { ok: false; errors: ContactValidationErrors };

export const CONTACT_LIMITS = {
  nameMax: 100,
  emailMax: 254,
  messageMin: 10,
  messageMax: 5000,
  /** Menos tiempo que esto entre mostrar y enviar el formulario no es una persona escribiendo. */
  minElapsedMs: 3000,
} as const;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// eslint-disable-next-line no-control-regex
const CONTROL_CHARS = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g;
// eslint-disable-next-line no-control-regex
const LINE_BREAKS_AND_CONTROL = /[\u0000-\u001f\u007f]+/g;

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

/** Una sola línea: el nombre va en el asunto del correo. */
function cleanSingleLine(value: unknown): string {
  return asString(value).replace(LINE_BREAKS_AND_CONTROL, " ").replace(/\s+/g, " ").trim();
}

/** Conserva saltos de línea y tabuladores; quita el resto de caracteres de control. */
function cleanMultiline(value: unknown): string {
  return asString(value).replace(/\r\n?/g, "\n").replace(CONTROL_CHARS, "").trim();
}

export function validateContactInput(raw: unknown): ContactValidationResult {
  const source = raw !== null && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  const elapsed = Number(source.elapsedMs);
  const value: ContactInput = {
    name: cleanSingleLine(source.name),
    email: cleanSingleLine(source.email),
    message: cleanMultiline(source.message),
    website: asString(source.website).trim(),
    elapsedMs: Number.isFinite(elapsed) ? elapsed : 0,
  };
  const errors: ContactValidationErrors = {};

  if (value.name.length < 1 || value.name.length > CONTACT_LIMITS.nameMax) {
    errors.name = `Write your name (up to ${CONTACT_LIMITS.nameMax} characters).`;
  }
  if (value.email.length > CONTACT_LIMITS.emailMax || !EMAIL_PATTERN.test(value.email)) {
    errors.email = "Enter a valid email address.";
  }
  if (value.message.length < CONTACT_LIMITS.messageMin || value.message.length > CONTACT_LIMITS.messageMax) {
    errors.message = `Write between ${CONTACT_LIMITS.messageMin} and ${CONTACT_LIMITS.messageMax} characters.`;
  }

  return Object.keys(errors).length === 0 ? { ok: true, value } : { ok: false, errors };
}

export function isLikelyBot(input: ContactInput): boolean {
  return input.website.length > 0 || input.elapsedMs < CONTACT_LIMITS.minElapsedMs;
}

/** Correo en texto plano: sin HTML no hay nada que escapar ni que inyectar. */
export function buildEmail(input: ContactInput): { subject: string; text: string } {
  return {
    subject: `Contacto desde el portfolio: ${input.name}`,
    text: [`Nombre: ${input.name}`, `Email: ${input.email}`, "", input.message].join("\n"),
  };
}
