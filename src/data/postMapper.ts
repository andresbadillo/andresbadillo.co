import type { Post, PostTag } from "@/data/posts";
import { coverKeyToImageUrl } from "@/data/coverAssets";
import { isLinkedInEmbedPair } from "@/data/postValidation";
import { pickLocalized, type Locale } from "@/i18n/locale";
import type { PostRow, PostTagRow } from "@/types/database";

export interface TagLink {
  slug: string;
  label: string;
}

function asTagRows(value: PostRow["tags"]): PostTagRow[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const row = item as Partial<PostTagRow>;
    const slug = typeof row.slug === "string" ? row.slug.trim() : "";
    if (!slug) return [];
    return [{
      slug,
      es: typeof row.es === "string" ? row.es : "",
      en: typeof row.en === "string" ? row.en : "",
    }];
  });
}

export function buildAvailableTags(posts: Post[]): TagLink[] {
  const unique = new Map<string, string>();
  for (const post of posts) {
    for (const tag of post.tags) {
      if (!unique.has(tag.slug)) unique.set(tag.slug, tag.label);
    }
  }
  return Array.from(unique, ([slug, label]) => ({ slug, label }));
}

function formatDateLabel(isoOrDate: string): string {
  if (/^\d{4}-\d{2}-\d{2}/.test(isoOrDate)) {
    const d = new Date(isoOrDate);
    if (!Number.isNaN(d.getTime())) {
      const y = d.getUTCFullYear();
      const m = d.getUTCMonth() + 1;
      const day = d.getUTCDate();
      return `${y}-${String(m).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    }
  }
  return isoOrDate;
}

export function rowToPost(row: PostRow, locale: Locale): Post {
  const tags: PostTag[] = asTagRows(row.tags).map((tag) => ({
    slug: tag.slug,
    label: pickLocalized(locale, tag.es, tag.en),
  }));
  return {
    slug: row.slug,
    title: pickLocalized(locale, row.title_es, row.title_en),
    excerpt: pickLocalized(locale, row.excerpt_es, row.excerpt_en),
    date: formatDateLabel(row.published_at),
    tags,
    coverImage: coverKeyToImageUrl(row.cover_key),
    linkedinEmbed: isLinkedInEmbedPair(row.linkedin_embed) ? row.linkedin_embed : undefined,
  };
}
