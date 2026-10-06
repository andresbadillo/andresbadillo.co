/**
 * Genera las imágenes derivadas del avatar (se versionan; no se ejecuta en el build):
 * - src/assets/avatar/avatar-600.{avif,webp}: retrato del hero (300 px CSS, 2× para pantallas HiDPI).
 * - public/og-image.png: previsualización de 1200×630 para LinkedIn, WhatsApp, X…
 *
 * Uso: npm run images
 */
import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const source = path.join(root, "src/assets/placeholders/avatar.png");
const avatarDir = path.join(root, "src/assets/avatar");
const ogFile = path.join(root, "public/og-image.png");
/* Pango no lee .woff2, así que el texto usa una sans del sistema parecida a Inter (Segoe UI en
   Windows; en otros sistemas, la sans por defecto). */
const FONT = "Segoe UI, Inter, sans-serif";

/* Colores de src/styles/theme.scss (tema oscuro). */
const BG = "#1a1a1a";
const FG = "#e2e4e8";
const MUTED = "#9ea5af";
const ACCENT = "#f2a36b";

async function buildAvatar() {
  await mkdir(avatarDir, { recursive: true });
  const resized = sharp(source).resize(600, 600, { fit: "cover" });
  await resized.clone().avif({ quality: 55, effort: 6 }).toFile(path.join(avatarDir, "avatar-600.avif"));
  await resized.clone().webp({ quality: 78, effort: 6 }).toFile(path.join(avatarDir, "avatar-600.webp"));
}

function text(markup, width) {
  return sharp({
    text: { text: `<span font_family="${FONT}">${markup}</span>`, width, rgba: true, dpi: 72 },
  })
    .png()
    .toBuffer();
}

async function buildOgImage() {
  const W = 1200;
  const H = 630;
  const size = 380;
  /* Misma silueta orgánica que el retrato del hero (45% 55% 50% 50% / 40% 45% 55% 60%). */
  const blob = `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
    <path fill="#fff" d="M ${size * 0.45} 0 H ${size * 0.45} C ${size * 0.75} 0 ${size} ${size * 0.15} ${size} ${size * 0.45}
      C ${size} ${size * 0.75} ${size * 0.8} ${size} ${size * 0.5} ${size} C ${size * 0.2} ${size} 0 ${size * 0.8} 0 ${size * 0.55}
      C 0 ${size * 0.2} ${size * 0.18} 0 ${size * 0.45} 0 Z"/></svg>`;
  const ring = `<svg width="${size + 40}" height="${size + 40}" xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(20 20)"><path fill="none" stroke="${ACCENT}" stroke-opacity="0.7" stroke-width="14"
      d="M ${size * 0.45} 0 C ${size * 0.75} 0 ${size} ${size * 0.15} ${size} ${size * 0.45}
      C ${size} ${size * 0.75} ${size * 0.8} ${size} ${size * 0.5} ${size} C ${size * 0.2} ${size} 0 ${size * 0.8} 0 ${size * 0.55}
      C 0 ${size * 0.2} ${size * 0.18} 0 ${size * 0.45} 0 Z"/></g></svg>`;

  const portrait = await sharp(source)
    .resize(size, size, { fit: "cover" })
    .composite([{ input: Buffer.from(blob), blend: "dest-in" }])
    .png()
    .toBuffer();

  const logo = await text(`<span foreground="${ACCENT}" size="34pt" weight="bold">&lt;AB/&gt;</span>`, 400);
  const greet = await text(`<span foreground="${MUTED}" size="40pt">Hey, I'm</span>`, 600);
  const name = await text(`<span foreground="${ACCENT}" size="64pt" weight="600">Andrés Badillo</span>`, 640);
  const role = await text(
    `<span foreground="${FG}" size="23pt">Product Manager · Data Analyst · Frontend Developer</span>`,
    640,
  );
  const url = await text(`<span foreground="${MUTED}" size="22pt">andresbadillo.co</span>`, 400);

  const left = 110;
  const textLeft = left + size + 80;
  await sharp({ create: { width: W, height: H, channels: 4, background: BG } })
    .composite([
      { input: Buffer.from(ring), left: left - 20, top: (H - size) / 2 - 20 },
      { input: portrait, left, top: (H - size) / 2 },
      { input: logo, left: textLeft, top: 120 },
      { input: greet, left: textLeft, top: 215 },
      { input: name, left: textLeft, top: 275 },
      { input: role, left: textLeft, top: 395 },
      { input: url, left: textLeft, top: 470 },
    ])
    .png({ compressionLevel: 9, palette: true, quality: 90 })
    .toFile(ogFile);
}

await buildAvatar();
await buildOgImage();
console.log("Imágenes generadas: src/assets/avatar/avatar-600.{avif,webp}, public/og-image.png");
