import { siteName, siteOgImage, siteUrl } from "@/data/site";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

interface SeoProps {
  title: string;
  description: string;
  /** Páginas privadas, de error o vacías: que no las indexen los buscadores. */
  noindex?: boolean;
  type?: "website" | "article";
}

/**
 * Metadatos de cada página. Sustituye a las etiquetas por defecto de index.html (llevan data-rh),
 * que son las únicas que leen LinkedIn, WhatsApp o X, porque no ejecutan JavaScript.
 */
export function Seo({ title, description, noindex = false, type = "website" }: SeoProps) {
  const { pathname } = useLocation();
  const path = pathname === "/" ? "/" : pathname.replace(/\/+$/, "");
  const url = `${siteUrl}${path}`;

  return (
    /* defer={false}: se aplica en el mismo render, sin esperar a un requestAnimationFrame
       (que no llega en pestañas en segundo plano ni en capturas rápidas de rastreadores). */
    <Helmet defer={false}>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noindex ? <meta name="robots" content="noindex, nofollow" /> : null}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={siteOgImage} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={siteOgImage} />
    </Helmet>
  );
}
