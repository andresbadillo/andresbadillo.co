import { Seo } from "@/components/Seo/Seo";
import styles from "./PrivacyPolicyPage.module.scss";

export function PrivacyPolicyPage() {
  return (
    <section className={`container ${styles.wrap}`}>
      <Seo title="Privacy policy — Demo" description="Política de privacidad placeholder para proyecto demo." />
      <h1>Privacy policy</h1>
      <p>Este sitio demo utiliza cookies técnicas para recordar preferencias de interfaz como tema claro/oscuro.</p>
      <p>También podría integrar herramientas como reCAPTCHA para prevenir abuso en formularios de contacto.</p>
      <p>No se recopilan datos sensibles en esta demostración.</p>
    </section>
  );
}
