import { Seo } from "@/components/Seo/Seo";
import { TransitionLink } from "@/components/TransitionLink/TransitionLink";
import styles from "./NotFoundPage.module.scss";

export function NotFoundPage() {
  return (
    <section className={`container ${styles.wrap}`}>
      <Seo title="404 — Demo" description="Página no encontrada." />
      <div className={styles.poem}>
        <h1>404</h1>
        <p>La ruta se perdió en el ruido,</p>
        <p>pero el pulso del código sigue vivo.</p>
        <TransitionLink to="/">Volver al inicio</TransitionLink>
      </div>
    </section>
  );
}
