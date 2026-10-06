import { useRef, useState, type FormEvent } from "react";
import { validateContactInput, type ContactValidationErrors } from "@/lib/contactMessage";

export type ContactFormStatus = "idle" | "sending" | "sent" | "error";

const FALLBACK_EMAIL = "r.andres.badillo@gmail.com";

/**
 * Estado y envío del formulario de contacto (home y /contact). Valida en el navegador con las
 * mismas reglas que api/contact.ts y envía a esa función.
 */
export function useContactForm() {
  const [status, setStatus] = useState<ContactFormStatus>("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [errors, setErrors] = useState<ContactValidationErrors>({});
  /* Momento en que se mostró el formulario: un envío casi inmediato es de un bot. */
  const shownAtRef = useRef(performance.now());

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "sending") return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const input = {
      name: data.get("name"),
      email: data.get("email"),
      message: data.get("message"),
      website: data.get("website"),
      elapsedMs: Math.round(performance.now() - shownAtRef.current),
    };

    const validation = validateContactInput(input);
    if (!validation.ok) {
      setErrors(validation.errors);
      setStatus("idle");
      setStatusMessage("");
      return;
    }

    setErrors({});
    setStatus("sending");
    setStatusMessage("Sending…");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validation.value),
      });
      if (response.status === 400) {
        const body = (await response.json().catch(() => ({}))) as { errors?: ContactValidationErrors };
        if (body.errors) {
          setErrors(body.errors);
          setStatus("idle");
          setStatusMessage("");
          return;
        }
      }
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      form.reset();
      shownAtRef.current = performance.now();
      setStatus("sent");
      setStatusMessage("Message sent. I'll get back to you soon.");
    } catch {
      setStatus("error");
      setStatusMessage(`The message could not be sent. Please email me at ${FALLBACK_EMAIL}.`);
    }
  };

  return {
    status,
    statusMessage,
    errors,
    sending: status === "sending",
    onSubmit: (event: FormEvent<HTMLFormElement>) => void onSubmit(event),
  };
}
