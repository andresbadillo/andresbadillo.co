import {
  isLinkedInEmbedPair,
  isSafeLinkedInUrl,
  normalizeTags,
  validatePostInput,
  type PostInput,
} from "@/data/postValidation";
import { describe, expect, it } from "vitest";

const validEmbed = {
  compact: {
    src: "https://www.linkedin.com/embed/feed/update/urn:li:share:123",
    width: 504,
    height: 420,
  },
  full: {
    src: "https://www.linkedin.com/embed/feed/update/urn:li:share:123",
    width: 504,
    height: 760,
  },
};

const validPost: PostInput = {
  slug: "post-seguro",
  title: "Post seguro",
  excerpt: "Resumen público",
  publishedAt: "2026-08-27",
  featured: false,
  tags: ["React", "Security"],
  coverKey: "thumb-1",
  linkedinEmbed: validEmbed,
  displayOrder: 1,
};

describe("LinkedIn embed validation", () => {
  it("accepts the exact HTTPS LinkedIn embed origin", () => {
    expect(isSafeLinkedInUrl(validEmbed.compact.src)).toBe(true);
    expect(isLinkedInEmbedPair(validEmbed)).toBe(true);
  });

  it.each([
    "http://www.linkedin.com/embed/feed/update/1",
    "https://linkedin.com/embed/feed/update/1",
    "https://evil.www.linkedin.com/embed/feed/update/1",
    "https://www.linkedin.com.evil.test/embed/feed/update/1",
    "https://evil.test@www.linkedin.com/embed/feed/update/1",
    "https://www.linkedin.com:444/embed/feed/update/1",
    "https://www.linkedin.com/feed/update/1",
    "https://www.linkedin.com/%65mbed/feed/update/1",
    "data:text/html,<script>alert(1)</script>",
  ])("rejects an unsafe source: %s", (source) => {
    expect(isSafeLinkedInUrl(source)).toBe(false);
  });

  it("enforces frame dimension boundaries", () => {
    expect(isLinkedInEmbedPair({
      ...validEmbed,
      compact: { ...validEmbed.compact, width: 319 },
    })).toBe(false);
    expect(isLinkedInEmbedPair({
      ...validEmbed,
      full: { ...validEmbed.full, height: 1001 },
    })).toBe(false);
    expect(isLinkedInEmbedPair({
      ...validEmbed,
      compact: { ...validEmbed.compact, width: 320, height: 200 },
      full: { ...validEmbed.full, width: 800, height: 1000 },
    })).toBe(true);
  });
});

describe("post input validation", () => {
  it("normalizes tags and editor whitespace", () => {
    const result = validatePostInput({
      ...validPost,
      slug: "  post-seguro  ",
      title: "  Post seguro  ",
      tags: ["React", " React ", "", "Security"],
    });
    expect(result).toEqual({
      ok: true,
      value: {
        ...validPost,
        tags: ["React", "Security"],
      },
    });
    expect(normalizeTags(["a", " A ", "b"])).toEqual(["a", "b"]);
  });

  it("normalizes uppercase slugs before validation", () => {
    const result = validatePostInput({ ...validPost, slug: "POST-SEGURO" });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value.slug).toBe("post-seguro");
  });

  it.each(["two--hyphens", "../admin", "//evil.test", "with space", "diseño-web"])(
    "rejects an unsafe slug: %s",
    (slug) => {
      const result = validatePostInput({ ...validPost, slug });
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.errors.slug).toBeDefined();
    },
  );

  it("rejects impossible calendar dates", () => {
    const result = validatePostInput({ ...validPost, publishedAt: "2026-02-30" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.publishedAt).toBeDefined();
  });
});
