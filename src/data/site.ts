export const siteBrandShort = "AB";

/** Dominio canónico (sin www): canonical, og:url, sitemap y robots.txt apuntan aquí. */
export const siteUrl = "https://andresbadillo.co";
export const siteName = "Andres Badillo";
/** Imagen de previsualización (1200×630), generada con `npm run images`. */
export const siteOgImage = `${siteUrl}/og-image.png`;

export const navItems = [
  { to: "/" },
  { to: "/portfolio" },
  { to: "/blog" },
  { to: "/about" },
  { to: "/contact" },
] as const;

export const socialLinks = [
  { label: "GitHub", href: "https://github.com/andresbadillo" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/raul-andres-badillo-jaimes/" },
  { label: "Instagram", href: "https://www.instagram.com/andresbadillo.co" },
  { label: "TikTok", href: "https://www.tiktok.com/@andresbadillo.co" },
];
