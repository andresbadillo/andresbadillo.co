import type { LinkedInEmbedPair, Post } from "@/data/posts";
import { coverKeyToImageUrl } from "@/data/coverAssets";

export function buildAvailableTags(posts: Post[]): string[] {
  const unique = new Set(
    posts.flatMap((post) => post.tags.map((tag) => tag.trim()).filter(Boolean)),
  );
  return ["all", ...Array.from(unique)];
}

export interface PostRow {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  published_at: string;
  featured: boolean;
  tags: string[] | null;
  cover_key: string | null;
  linkedin_embed: unknown;
  display_order: number;
}

function isFrameSpec(
  v: unknown,
): v is { src: string; height?: number; width?: number } {
  if (v === null || typeof v !== "object") return false;
  const o = v as { src?: unknown };
  return typeof o.src === "string";
}

function isLinkedInEmbedPair(v: unknown): v is LinkedInEmbedPair {
  if (v === null || typeof v !== "object") return false;
  const o = v as { compact?: unknown; full?: unknown };
  return isFrameSpec(o.compact) && isFrameSpec(o.full);
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

export function rowToPost(row: PostRow): Post {
  const tags = Array.isArray(row.tags) ? row.tags : [];
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    date: formatDateLabel(row.published_at),
    tags: tags.map((t) => t.trim()).filter(Boolean),
    coverImage: coverKeyToImageUrl(row.cover_key),
    linkedinEmbed: isLinkedInEmbedPair(row.linkedin_embed) ? row.linkedin_embed : undefined,
  };
}
