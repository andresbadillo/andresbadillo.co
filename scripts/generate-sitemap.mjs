/**
 * Escribe dist/sitemap.xml tras `vite build`: páginas fijas, proyectos y posts del blog.
 * Los posts se leen de Supabase con la clave pública (la misma que usa el navegador). Si Supabase
 * no responde —por ejemplo en CI, que usa una URL de ejemplo— el sitemap sale sin posts y el
 * build sigue adelante.
 */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { loadEnv } from "vite";

const root = path.resolve(import.meta.dirname, "..");
/* Mismo valor que siteUrl en src/data/site.ts. */
const SITE_URL = "https://andresbadillo.co";
const STATIC_PATHS = ["/", "/portfolio", "/blog", "/about", "/contact", "/privacy-policy"];

/* projects.ts importa SVG y no se puede ejecutar desde Node: se leen sus slugs como texto. */
async function readProjectSlugs() {
  const source = await readFile(path.join(root, "src/data/projects.ts"), "utf8");
  return [...source.matchAll(/^\s*slug:\s*"([a-z0-9-]+)"/gm)].map((match) => match[1]);
}

async function readPosts() {
  const env = { ...loadEnv("production", root, "VITE_"), ...process.env };
  const url = env.VITE_SUPABASE_URL;
  const key = env.VITE_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return [];
  try {
    const response = await fetch(`${url}/rest/v1/posts?select=slug,published_at&order=display_order.asc`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const rows = await response.json();
    return Array.isArray(rows) ? rows.filter((row) => typeof row.slug === "string") : [];
  } catch (error) {
    console.warn(`[sitemap] Sin posts del blog (${error instanceof Error ? error.message : error}).`);
    return [];
  }
}

function entry(pathname, lastmod) {
  const loc = `${SITE_URL}${pathname}`.replace(/&/g, "&amp;");
  const date = typeof lastmod === "string" ? `\n    <lastmod>${lastmod.slice(0, 10)}</lastmod>` : "";
  return `  <url>\n    <loc>${loc}</loc>${date}\n  </url>`;
}

const [projectSlugs, posts] = await Promise.all([readProjectSlugs(), readPosts()]);
const entries = [
  ...STATIC_PATHS.map((pathname) => entry(pathname)),
  ...projectSlugs.map((slug) => entry(`/portfolio/${slug}`)),
  ...posts.map((post) => entry(`/blog/${encodeURIComponent(post.slug)}`, post.published_at)),
];
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join("\n")}
</urlset>
`;
await writeFile(path.join(root, "dist/sitemap.xml"), xml);
console.log(`[sitemap] ${entries.length} URLs (${posts.length} posts) → dist/sitemap.xml`);
