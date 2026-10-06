import { useContactForm } from "@/hooks/useContactForm";
import type { ContactField } from "@/lib/contactMessage";
import clsx from "clsx";
import controls from "@/styles/formControls.module.scss";
import styles from "./ContactForm.module.scss";

interface ContactFormProps {
  /** Prefijo de los id (dos instancias no pueden repetir id en la misma página). */
  idPrefix: string;
}

/** Texto, formulario y estado del contacto. Lo usan la home y /contact. */
export function ContactForm({ idPrefix }: ContactFormProps) {
  const contactForm = useContactForm();
  const id = (field: string) => `${idPrefix}-${field}`;

  const fieldA11y = (field: ContactField) =>
    contactForm.errors[field] ? { "aria-invalid": true, "aria-describedby": id(`${field}-error`) } : {};
  const fieldError = (field: ContactField) =>
    contactForm.errors[field] ? (
      <p id={id(`${field}-error`)} className={controls.fieldError}>
        {contactForm.errors[field]}
      </p>
    ) : null;

  return (
    <>
      <p className={styles.lead}>
        Feel free to contact me at <strong>r.andres.badillo@gmail.com</strong> or drop me a message using the contact
        form below:
      </p>
      <form className={styles.form} onSubmit={contactForm.onSubmit} noValidate>
        {/* Trampa para bots: fuera de pantalla e ignorada por lectores de pantalla y teclado. */}
        <div className={styles.honeypot} aria-hidden="true">
          <label htmlFor={id("website")}>Website</label>
          <input id={id("website")} name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>
        <div className={styles.row2}>
          <div className={styles.field}>
            <label className={controls.srOnly} htmlFor={id("name")}>
              Name
            </label>
            <input
              id={id("name")}
              name="name"
              className={controls.input}
              autoComplete="name"
              placeholder="Name"
              required
              {...fieldA11y("name")}
            />
            {fieldError("name")}
          </div>
          <div className={styles.field}>
            <label className={controls.srOnly} htmlFor={id("email")}>
              Email
            </label>
            <input
              id={id("email")}
              name="email"
              type="email"
              className={controls.input}
              autoComplete="email"
              placeholder="Email"
              required
              {...fieldA11y("email")}
            />
            {fieldError("email")}
          </div>
        </div>
        <div className={styles.field}>
          <label className={controls.srOnly} htmlFor={id("message")}>
            Message
          </label>
          <textarea
            id={id("message")}
            name="message"
            className={controls.textarea}
            rows={6}
            placeholder="Message"
            required
            {...fieldA11y("message")}
          />
          {fieldError("message")}
        </div>
        <button type="submit" className={controls.submit} disabled={contactForm.sending}>
          {contactForm.sending ? "Sending…" : "Send"}
        </button>
      </form>
      <p
        role="status"
        aria-live="polite"
        className={clsx(styles.status, contactForm.status === "error" && styles.statusError)}
      >
        {contactForm.statusMessage}
      </p>
    </>
  );
}
