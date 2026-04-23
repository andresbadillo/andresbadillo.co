import { CanvasBarsDivider } from "@/components/Dividers/CanvasBarsDivider";
import { Seo } from "@/components/Seo/Seo";
import { useHeadingAccentReveal } from "@/hooks/useHeadingAccentReveal";
import { useState, useRef, type FormEvent } from "react";
import pageLayout from "@/styles/pageLayout.module.scss";
import headingAccent from "@/styles/sectionHeadingAccent.module.scss";
import clsx from "clsx";
import styles from "./ContactPage.module.scss";

export function ContactPage() {
  const [status, setStatus] = useState("");
  const headingRef = useRef<HTMLHeadingElement>(null);
  useHeadingAccentReveal(headingRef);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    setStatus("Mensaje de prueba enviado. Para envío real, conecta un backend.");
  };

  return (
    <>
      <section className={clsx("container", pageLayout.pageSection, pageLayout.mainBlock)}>
        <Seo title="Contact — Andres Badillo" description="Formulario de contacto demo sin backend." />
        <h1 ref={headingRef} className={pageLayout.pageHeading}>
          <span className={headingAccent.sectionAccent}>Contact</span>
        </h1>
        <p>Si quieres conversar sobre producto y frontend, escríbeme.</p>
        <form className={styles.form} onSubmit={onSubmit}>
          <label htmlFor="name">Name</label>
          <input id="name" className={styles.input} name="name" required />
          <label htmlFor="email">Email</label>
          <input id="email" className={styles.input} name="email" type="email" required />
          <label htmlFor="message">Message</label>
          <textarea id="message" className={styles.textarea} name="message" rows={6} required />
          <button type="submit">Send</button>
        </form>
        <p role="status" aria-live="polite">
          {status}
        </p>
        <p>Nota: Para enviar realmente, conecta un backend.</p>
      </section>
      <CanvasBarsDivider topBackground="var(--bg)" bottomBackground="var(--home-hero-bg)" />
    </>
  );
}
