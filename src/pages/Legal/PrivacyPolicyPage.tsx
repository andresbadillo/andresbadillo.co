import { Seo } from "@/components/Seo/Seo";
import { PRIVACY_POLICY_VERSION } from "@/lib/contactMessage";
import { siteUrl } from "@/data/site";
import styles from "./PrivacyPolicyPage.module.scss";

/** Responsable del tratamiento (Decreto 1377 de 2013, art. 13): nombre, domicilio, correo y teléfono. */
const RESPONSIBLE = {
  name: "Raúl Andrés Badillo Jaimes",
  city: "Bucaramanga",
  email: "r.andres.badillo@gmail.com",
  phone: "+57 301 632 0701",
};

const EFFECTIVE_DATE = "21 de octubre de 2026";

export function PrivacyPolicyPage() {
  return (
    <section className={`container ${styles.wrap}`}>
      <Seo
        title="Privacy policy — Andres Badillo"
        description="Política de tratamiento de datos personales de andresbadillo.co (Ley 1581 de 2012)."
      />
      <h1>Política de Tratamiento de Datos Personales</h1>
      <p className={styles.meta}>
        Vigente desde el {EFFECTIVE_DATE} · Versión {PRIVACY_POLICY_VERSION}
      </p>
      <p className={styles.summary} lang="en">
        <strong>Summary in English:</strong> I only use the name, email and message you send through the contact form
        to reply to you. They are delivered to my inbox by email and are not stored on this site. You can ask me to
        access, correct or delete them at any time by writing to {RESPONSIBLE.email}.
      </p>

      <h2>1. Responsable del tratamiento</h2>
      <ul>
        <li>Nombre: {RESPONSIBLE.name}</li>
        <li>Domicilio: {RESPONSIBLE.city}, Colombia</li>
        <li>Correo: {RESPONSIBLE.email}</li>
        <li>Teléfono: {RESPONSIBLE.phone}</li>
        <li>Sitio web: {siteUrl}</li>
      </ul>

      <h2>2. Marco legal</h2>
      <p>
        Esta política se rige por la Ley 1581 de 2012, el Decreto 1377 de 2013 (compilado en el Decreto 1074 de 2015) y
        las demás normas colombianas sobre protección de datos personales.
      </p>

      <h2>3. Datos que se tratan</h2>
      <p>
        A través del formulario de contacto se recogen tu nombre, tu correo electrónico y el mensaje que escribas. No se
        solicitan datos sensibles; te pido no incluirlos en el mensaje. El formulario está dirigido a mayores de edad.
      </p>

      <h2>4. Finalidades</h2>
      <p>Tus datos se usan únicamente para:</p>
      <ol>
        <li>Leer y responder tu mensaje.</li>
        <li>
          Mantener la conversación que se derive de él (propuestas profesionales, colaboraciones o consultas).
        </li>
      </ol>
      <p>No se usan para enviarte publicidad ni boletines, y no se venden ni se ceden a terceros.</p>

      <h2>5. Encargados y transmisión internacional</h2>
      <p>Para que el mensaje llegue intervienen estos proveedores, que actúan como encargados del tratamiento:</p>
      <ul>
        <li>Vercel Inc. (EE. UU.): aloja el sitio y la función que procesa el envío.</li>
        <li>Resend (EE. UU.): envía el mensaje por correo electrónico.</li>
        <li>Google LLC (EE. UU.): Gmail, donde se recibe y se conserva el correo.</li>
      </ul>
      <p>
        Estados Unidos figura entre los países con nivel adecuado de protección según la Circular Externa 005 de 2017 de
        la Superintendencia de Industria y Comercio. Al aceptar esta política autorizas esta transmisión.
      </p>

      <h2>6. Conservación</h2>
      <p>
        El sitio no guarda tus datos en ninguna base de datos. El correo con tu mensaje se conserva en mi buzón mientras
        dure la conversación y hasta dos (2) años después del último contacto, salvo que pidas antes su supresión o que
        una obligación legal exija conservarlo.
      </p>

      <h2>7. Tus derechos</h2>
      <p>Como titular tienes derecho a (art. 8, Ley 1581 de 2012):</p>
      <ol>
        <li>Conocer, actualizar y rectificar tus datos.</li>
        <li>Solicitar prueba de la autorización que otorgaste.</li>
        <li>Ser informado del uso que se ha dado a tus datos.</li>
        <li>Presentar quejas ante la Superintendencia de Industria y Comercio (SIC).</li>
        <li>Revocar la autorización y pedir la supresión de tus datos.</li>
        <li>Acceder gratuitamente a tus datos.</li>
      </ol>

      <h2>8. Cómo ejercer tus derechos</h2>
      <p>
        Escribe a {RESPONSIBLE.email} con el asunto «Datos personales», indicando tu nombre, el correo con el que me
        escribiste y lo que solicitas.
      </p>
      <ul>
        <li>
          Consultas: se responden en máximo diez (10) días hábiles. Si no es posible en ese plazo, te informaré el motivo
          y la respuesta llegará en máximo cinco (5) días hábiles más.
        </li>
        <li>
          Reclamos (corrección, actualización, supresión o incumplimiento): se responden en máximo quince (15) días
          hábiles, prorrogables ocho (8) días hábiles más avisándote el motivo. Si el reclamo está incompleto, te pediré
          completarlo en los cinco (5) días siguientes; si pasan dos (2) meses sin respuesta, se entenderá que
          desististe.
        </li>
      </ul>
      <p>Antes de acudir a la SIC debes haber agotado este trámite (art. 16, Ley 1581 de 2012).</p>

      <h2>9. Seguridad</h2>
      <p>
        El sitio usa HTTPS, el formulario solo acepta envíos desde el propio dominio y el acceso al buzón está protegido.
        No se guarda copia de los mensajes en el sitio.
      </p>

      <h2>10. Otros datos del sitio</h2>
      <ul>
        <li>
          Preferencias: el tema claro u oscuro que elijas se guarda en el almacenamiento local de tu navegador
          (localStorage). No se usan cookies propias.
        </li>
        <li>
          Estadísticas: Vercel Web Analytics y Speed Insights miden visitas y rendimiento de forma agregada, sin cookies y
          sin identificarte.
        </li>
        <li>
          Contenido de terceros: las publicaciones del blog se muestran con el reproductor oficial de LinkedIn. Al
          cargarse, LinkedIn puede usar sus propias cookies según su política de privacidad.
        </li>
      </ul>

      <h2>11. Cambios</h2>
      <p>
        Si esta política cambia de forma sustancial, se publicará aquí la nueva versión con su fecha antes de aplicarla.
      </p>
    </section>
  );
}
