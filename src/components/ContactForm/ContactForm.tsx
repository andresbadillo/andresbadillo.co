import { useLocale } from "@/i18n/LocaleProvider";
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
  const { t } = useLocale();
  const contactForm = useContactForm();
  const id = (field: string) => `${idPrefix}-${field}`;
  const showError = (message: string | undefined) => {
    if (!message) return undefined;
    if (message.startsWith("Write your name")) return t("contactNameError");
    if (message.startsWith("Enter a valid email")) return t("contactEmailError");
    if (message.startsWith("Write between")) return t("contactMessageError");
    if (message.startsWith("Accept the privacy")) return t("contactConsentError");
    return message;
  };

  const fieldA11y = (field: ContactField) =>
    contactForm.errors[field] ? { "aria-invalid": true, "aria-describedby": id(`${field}-error`) } : {};
  const fieldError = (field: ContactField) =>
    contactForm.errors[field] ? (
      <p id={id(`${field}-error`)} className={controls.fieldError}>
        {showError(contactForm.errors[field])}
      </p>
    ) : null;

  return (
    <>
      <p className={styles.lead}>{t("contactLead")}</p>
      <form className={styles.form} onSubmit={contactForm.onSubmit} noValidate>
        {/* Trampa para bots: fuera de pantalla e ignorada por lectores de pantalla y teclado. */}
        <div className={styles.honeypot} aria-hidden="true">
          <label htmlFor={id("website")}>Website</label>
          <input id={id("website")} name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>
        <div className={styles.row2}>
          <div className={styles.field}>
            <label className={controls.srOnly} htmlFor={id("name")}>
              {t("contactName")}
            </label>
            <input
              id={id("name")}
              name="name"
              className={controls.input}
              autoComplete="name"
              placeholder={t("contactName")}
              required
              {...fieldA11y("name")}
            />
            {fieldError("name")}
          </div>
          <div className={styles.field}>
            <label className={controls.srOnly} htmlFor={id("email")}>
              {t("contactEmail")}
            </label>
            <input
              id={id("email")}
              name="email"
              type="email"
              className={controls.input}
              autoComplete="email"
              placeholder={t("contactEmail")}
              required
              {...fieldA11y("email")}
            />
            {fieldError("email")}
          </div>
        </div>
        <div className={styles.field}>
          <label className={controls.srOnly} htmlFor={id("message")}>
            {t("contactMessage")}
          </label>
          <textarea
            id={id("message")}
            name="message"
            className={controls.textarea}
            rows={6}
            placeholder={t("contactMessage")}
            required
            {...fieldA11y("message")}
          />
          {fieldError("message")}
        </div>
        {/* Autorización de tratamiento de datos (Ley 1581 de 2012): sin marcar por defecto. */}
        <div className={styles.consent}>
          <label className={styles.consentLabel} htmlFor={id("consent")}>
            <input
              id={id("consent")}
              name="consent"
              type="checkbox"
              className={controls.checkbox}
              required
              aria-invalid={contactForm.errors.consent ? true : undefined}
              aria-describedby={clsx(id("consent-note"), contactForm.errors.consent && id("consent-error"))}
            />
            <span>
              {t("contactConsent")}{" "}
              <a className={styles.consentLink} href="/privacy-policy" target="_blank" rel="noopener">
                {t("contactPrivacy")}
              </a>
              .
            </span>
          </label>
          <p id={id("consent-note")} className={styles.consentNote}>
            {t("contactConsentNote")}
          </p>
          {fieldError("consent")}
        </div>
        <button type="submit" className={controls.submit} disabled={contactForm.sending}>
          {contactForm.sending ? t("contactSending") : t("contactSend")}
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
