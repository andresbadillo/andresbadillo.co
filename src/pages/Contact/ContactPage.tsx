import { CanvasBarsDivider } from "@/components/Dividers/CanvasBarsDivider";
import { Seo } from "@/components/Seo/Seo";
import { useContactForm } from "@/hooks/useContactForm";
import { useHeadingAccentReveal } from "@/hooks/useHeadingAccentReveal";
import type { ContactField } from "@/lib/contactMessage";
import { useRef } from "react";
import pageLayout from "@/styles/pageLayout.module.scss";
import headingAccent from "@/styles/sectionHeadingAccent.module.scss";
import clsx from "clsx";
import styles from "./ContactPage.module.scss";

export function ContactPage() {
  const contactForm = useContactForm();
  const headingRef = useRef<HTMLHeadingElement>(null);
  useHeadingAccentReveal(headingRef);

  const fieldA11y = (field: ContactField) =>
    contactForm.errors[field]
      ? { "aria-invalid": true, "aria-describedby": `contact-${field}-error` }
      : {};
  const fieldError = (field: ContactField) =>
    contactForm.errors[field] ? (
      <p id={`contact-${field}-error`} className={styles.fieldError}>
        {contactForm.errors[field]}
      </p>
    ) : null;

  return (
    <>
      <section className={clsx("container", pageLayout.pageSection, pageLayout.mainBlock)}>
        <Seo title="Contact — Andres Badillo" description="Escríbeme sobre producto, datos o frontend." />
        <h1 ref={headingRef} className={pageLayout.pageHeading}>
          <span className={headingAccent.sectionAccent}>Contact</span>
        </h1>
        <p>Si quieres conversar sobre producto y frontend, escríbeme.</p>
        <form className={styles.form} onSubmit={contactForm.onSubmit} noValidate>
          {/* Trampa para bots: fuera de pantalla e ignorada por lectores de pantalla y teclado. */}
          <div className={styles.honeypot} aria-hidden="true">
            <label htmlFor="contact-website">Website</label>
            <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
          </div>
          <label htmlFor="contact-name">Name</label>
          <input
            id="contact-name"
            className={styles.input}
            name="name"
            autoComplete="name"
            required
            {...fieldA11y("name")}
          />
          {fieldError("name")}
          <label htmlFor="contact-email">Email</label>
          <input
            id="contact-email"
            className={styles.input}
            name="email"
            type="email"
            autoComplete="email"
            required
            {...fieldA11y("email")}
          />
          {fieldError("email")}
          <label htmlFor="contact-message">Message</label>
          <textarea
            id="contact-message"
            className={styles.textarea}
            name="message"
            rows={6}
            required
            {...fieldA11y("message")}
          />
          {fieldError("message")}
          <button type="submit" className={styles.submit} disabled={contactForm.sending}>
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
      </section>
      <CanvasBarsDivider topBackground="var(--bg)" bottomBackground="var(--home-hero-bg)" />
    </>
  );
}
