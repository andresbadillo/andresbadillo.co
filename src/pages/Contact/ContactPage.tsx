import { Seo } from "@/components/Seo/Seo";
import { useState, type FormEvent } from "react";
import styles from "./ContactPage.module.scss";

export function ContactPage() {
  const [status, setStatus] = useState("");

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    setStatus("Mensaje de prueba enviado. Para envío real, conecta un backend.");
  };

  return (
    <section className="container">
      <Seo title="Contact — Andres Badillo Demo" description="Formulario de contacto demo sin backend." />
      <h1>Contact</h1>
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
  );
}
