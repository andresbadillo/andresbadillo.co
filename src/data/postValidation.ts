import type { LinkedInEmbedPair, LinkedInFrameSpec } from "@/data/posts";
import type { Json, PostInsert, PostRow } from "@/types/database";

export const COVER_KEYS = [
  "thumb-1",
  "thumb-2",
  "project-1",
  "project-2",
  "project-3",
] as const;

export type CoverKey = (typeof COVER_KEYS)[number];

export interface PostInput {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  featured: boolean;
  tags: string[];
  coverKey: CoverKey | null;
  linkedinEmbed: LinkedInEmbedPair | null;
  displayOrder: number;
}

export type PostInputField = keyof PostInput | "linkedinCompact" | "linkedinFull";
export type PostValidationErrors = Partial<Record<PostInputField, string>>;

export type PostValidationResult =
  | { ok: true; value: PostInput }
  | { ok: false; errors: PostValidationErrors };

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const LINKEDIN_HOST = "www.linkedin.com";
const LINKEDIN_PATH_PREFIX = "/embed/";
const MIN_FRAME_WIDTH = 320;
const MAX_FRAME_WIDTH = 800;
const MIN_FRAME_HEIGHT = 200;
const MAX_FRAME_HEIGHT = 1000;
const IFRAME_CODE_PATTERN = /^\s*<iframe\b([\s\S]*?)>\s*<\/iframe>\s*$/i;
const ATTRIBUTE_PATTERN = /([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;

export type LinkedInIframeParseResult =
  | { ok: true; value: LinkedInFrameSpec }
  | { ok: false; error: string };

function isObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isOptionalDimension(
  value: unknown,
  minimum: number,
  maximum: number,
): value is number | undefined {
  return (
    value === undefined ||
    (typeof value === "number" && Number.isInteger(value) && value >= minimum && value <= maximum)
  );
}

function decodeHtmlAttribute(value: string): string {
  const namedEntities: Record<string, string> = {
    amp: "&",
    apos: "'",
    gt: ">",
    lt: "<",
    quot: '"',
  };

  return value.replace(/&(?:#(\d+)|#x([\da-f]+)|([a-z]+));/gi, (entity, decimal, hexadecimal, named) => {
    if (decimal || hexadecimal) {
      const codePoint = decimal ? Number(decimal) : Number.parseInt(hexadecimal, 16);
      return Number.isInteger(codePoint) && codePoint >= 0 && codePoint <= 0x10ffff
        ? String.fromCodePoint(codePoint)
        : entity;
    }
    return namedEntities[String(named).toLowerCase()] ?? entity;
  });
}

function parseIframeDimension(value: string | undefined, minimum: number, maximum: number): number | undefined | null {
  if (value === undefined) return undefined;
  if (!/^\d+$/.test(value)) return null;
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= minimum && parsed <= maximum ? parsed : null;
}

function isValidIsoDate(value: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;
  const [, yearText, monthText, dayText] = match;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

export function isSafeLinkedInUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      url.hostname === LINKEDIN_HOST &&
      url.port === "" &&
      url.pathname.startsWith(LINKEDIN_PATH_PREFIX) &&
      url.username === "" &&
      url.password === ""
    );
  } catch {
    return false;
  }
}

export function isLinkedInFrameSpec(value: unknown): value is LinkedInFrameSpec {
  if (!isObject(value) || typeof value.src !== "string") return false;
  return (
    isSafeLinkedInUrl(value.src) &&
    isOptionalDimension(value.width, MIN_FRAME_WIDTH, MAX_FRAME_WIDTH) &&
    isOptionalDimension(value.height, MIN_FRAME_HEIGHT, MAX_FRAME_HEIGHT)
  );
}

export function isLinkedInEmbedPair(value: unknown): value is LinkedInEmbedPair {
  if (!isObject(value)) return false;
  return isLinkedInFrameSpec(value.compact) && isLinkedInFrameSpec(value.full);
}

export function parseLinkedInIframeCode(value: string): LinkedInIframeParseResult {
  const match = IFRAME_CODE_PATTERN.exec(value);
  if (!match) {
    return { ok: false, error: "Pega el código <iframe> completo que entrega LinkedIn." };
  }

  const attributes = new Map<string, string>();
  let attributeMatch: RegExpExecArray | null;
  ATTRIBUTE_PATTERN.lastIndex = 0;
  while ((attributeMatch = ATTRIBUTE_PATTERN.exec(match[1])) !== null) {
    const name = attributeMatch[1].toLowerCase();
    if (!['src', 'width', 'height'].includes(name)) continue;
    if (attributes.has(name)) {
      return { ok: false, error: `El iframe contiene el atributo ${name} más de una vez.` };
    }
    attributes.set(name, decodeHtmlAttribute(attributeMatch[2] ?? attributeMatch[3] ?? attributeMatch[4] ?? ""));
  }

  const src = attributes.get("src") ?? "";
  if (!isSafeLinkedInUrl(src)) {
    return { ok: false, error: "El iframe debe usar una URL https://www.linkedin.com/embed/… válida." };
  }

  const width = parseIframeDimension(attributes.get("width"), MIN_FRAME_WIDTH, MAX_FRAME_WIDTH);
  const height = parseIframeDimension(attributes.get("height"), MIN_FRAME_HEIGHT, MAX_FRAME_HEIGHT);
  if (width === null || height === null) {
    return { ok: false, error: "El ancho debe estar entre 320–800 y el alto entre 200–1000." };
  }

  return { ok: true, value: { src, width, height } };
}

export function linkedInFrameToIframeCode(frame: LinkedInFrameSpec): string {
  const src = frame.src.replaceAll("&", "&amp;").replaceAll('"', "&quot;");
  const width = frame.width === undefined ? "" : ` width="${frame.width}"`;
  const height = frame.height === undefined ? "" : ` height="${frame.height}"`;
  return `<iframe src="${src}"${width}${height}></iframe>`;
}

export function normalizeTags(tags: string[]): string[] {
  const normalized = tags.map((tag) => tag.trim()).filter(Boolean);
  const seen = new Set<string>();
  return normalized.filter((tag) => {
    const comparisonKey = tag.toLocaleLowerCase("es");
    if (seen.has(comparisonKey)) return false;
    seen.add(comparisonKey);
    return true;
  });
}

export function validatePostInput(input: PostInput): PostValidationResult {
  const value: PostInput = {
    ...input,
    slug: input.slug.trim().toLowerCase(),
    title: input.title.trim(),
    excerpt: input.excerpt.trim(),
    tags: normalizeTags(input.tags),
  };
  const errors: PostValidationErrors = {};

  if (!SLUG_PATTERN.test(value.slug) || value.slug.length > 80) {
    errors.slug = "Usa hasta 80 caracteres en minúscula, números y guiones.";
  }
  if (value.title.length < 1 || value.title.length > 120) {
    errors.title = "El título debe tener entre 1 y 120 caracteres.";
  }
  if (value.excerpt.length < 1 || value.excerpt.length > 300) {
    errors.excerpt = "El resumen debe tener entre 1 y 300 caracteres.";
  }
  if (!isValidIsoDate(value.publishedAt)) {
    errors.publishedAt = "Selecciona una fecha válida.";
  }
  if (!Number.isInteger(value.displayOrder) || value.displayOrder < 0 || value.displayOrder > 9999) {
    errors.displayOrder = "El orden debe ser un entero entre 0 y 9999.";
  }
  if (value.tags.length > 10 || value.tags.some((tag) => tag.length > 30)) {
    errors.tags = "Usa máximo 10 etiquetas de hasta 30 caracteres.";
  }
  if (value.coverKey !== null && !COVER_KEYS.includes(value.coverKey)) {
    errors.coverKey = "Selecciona una portada conocida.";
  }
  if (value.linkedinEmbed !== null && !isLinkedInEmbedPair(value.linkedinEmbed)) {
    errors.linkedinEmbed = "Ambos embeds deben ser URLs HTTPS válidas de LinkedIn con dimensiones permitidas.";
  }

  return Object.keys(errors).length === 0 ? { ok: true, value } : { ok: false, errors };
}

export function postRowToInput(row: PostRow): PostInput {
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    publishedAt: row.published_at.slice(0, 10),
    featured: row.featured,
    tags: row.tags ?? [],
    coverKey: COVER_KEYS.includes(row.cover_key as CoverKey) ? (row.cover_key as CoverKey) : null,
    linkedinEmbed: isLinkedInEmbedPair(row.linkedin_embed) ? row.linkedin_embed : null,
    displayOrder: row.display_order,
  };
}

export function postInputToInsert(input: PostInput): Omit<PostInsert, "id"> {
  return {
    slug: input.slug,
    title: input.title,
    excerpt: input.excerpt,
    published_at: input.publishedAt,
    featured: input.featured,
    tags: input.tags,
    cover_key: input.coverKey,
    linkedin_embed: input.linkedinEmbed as unknown as Json,
    display_order: input.displayOrder,
  };
}
