import { Seo } from "@/components/Seo/Seo";
import styles from "./PrivacyPolicyPage.module.scss";

export function PrivacyPolicyPage() {
  return (
    <section className={`container ${styles.wrap}`}>
      <Seo title="Privacy policy — Andres Badillo" description="Qué datos trata este sitio y para qué." />
      <h1>Privacy policy</h1>
      <h2>Formulario de contacto</h2>
      <p>
        Cuando envías el formulario, tu nombre, tu email y tu mensaje se me envían por correo a través de Resend, un
        servicio de envío de email. Este sitio no los guarda en ninguna base de datos. Solo los uso para responderte.
      </p>
      <h2>Preferencias</h2>
      <p>
        El tema claro u oscuro que elijas se guarda en el almacenamiento local de tu navegador (localStorage). No se usan
        cookies propias.
      </p>
      <h2>Estadísticas</h2>
      <p>
        El sitio usa Vercel Web Analytics y Speed Insights para medir visitas y rendimiento de forma agregada, sin cookies
        y sin identificarte.
      </p>
      <h2>Contenido de terceros</h2>
      <p>
        Las publicaciones del blog se muestran con el reproductor oficial de LinkedIn. Al cargarse, LinkedIn puede usar
        sus propias cookies según su política de privacidad.
      </p>
      <h2>Contacto</h2>
      <p>Para cualquier consulta sobre tus datos, escríbeme a r.andres.badillo@gmail.com.</p>
    </section>
  );
}
