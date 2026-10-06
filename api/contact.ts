/**
 * POST /api/contact — recibe el formulario de contacto y lo envía por correo con Resend.
 *
 * Variables de entorno (solo servidor, sin prefijo VITE_):
 * - RESEND_API_KEY      clave de Resend con permiso de envío.
 * - CONTACT_TO_EMAIL    buzón que recibe los mensajes.
 * - CONTACT_FROM_EMAIL  remitente (opcional). Sin dominio verificado en Resend, solo funciona
 *                       onboarding@resend.dev y solo hacia el correo de la propia cuenta.
 */
// Extensión .js: Vercel compila cada .ts a .js y Node (ESM) exige la extensión en imports relativos.
import { buildEmail, isLikelyBot, validateContactInput } from "../src/lib/contactMessage.js";

const MAX_BODY_BYTES = 16 * 1024;
const RESEND_ENDPOINT = "https://api.resend.com/emails";
const DEFAULT_FROM = "Portfolio <onboarding@resend.dev>";

function json(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}

/** Solo se aceptan envíos desde el propio sitio (el navegador siempre manda Origin en un POST). */
function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    return new URL(origin).host === new URL(request.url).host;
  } catch {
    return false;
  }
}

export async function POST(request: Request): Promise<Response> {
  if (!isSameOrigin(request)) {
    return json(403, { error: "forbidden" });
  }
  if (!(request.headers.get("content-type") ?? "").toLowerCase().startsWith("application/json")) {
    return json(415, { error: "unsupported_media_type" });
  }
  if (Number(request.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) {
    return json(413, { error: "payload_too_large" });
  }

  const raw = await request.text();
  if (new TextEncoder().encode(raw).length > MAX_BODY_BYTES) {
    return json(413, { error: "payload_too_large" });
  }

  let payload: unknown;
  try {
    payload = JSON.parse(raw);
  } catch {
    return json(400, { error: "invalid_json" });
  }

  const validation = validateContactInput(payload);
  if (!validation.ok) {
    return json(400, { errors: validation.errors });
  }

  /* Al bot se le responde como si hubiera funcionado, para no darle pistas. */
  if (isLikelyBot(validation.value)) {
    return json(200, { ok: true });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !to) {
    console.error("[contact] Faltan RESEND_API_KEY o CONTACT_TO_EMAIL.");
    return json(502, { error: "send_failed" });
  }

  const { subject, text } = buildEmail(validation.value);
  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL || DEFAULT_FROM,
        to: [to],
        reply_to: validation.value.email,
        subject,
        text,
      }),
    });
    if (!response.ok) {
      console.error("[contact] Resend respondió", response.status, await response.text());
      return json(502, { error: "send_failed" });
    }
  } catch (error) {
    console.error("[contact] Error de red con Resend", error);
    return json(502, { error: "send_failed" });
  }

  return json(200, { ok: true });
}
