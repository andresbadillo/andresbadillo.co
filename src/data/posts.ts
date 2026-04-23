/** Fragmento copiado del iframe de LinkedIn (Embed this post → Copy code): atributo `src` y opcionalmente `height` / `width`. */
export interface LinkedInFrameSpec {
  src: string;
  height?: number;
  width?: number;
}

export interface LinkedInEmbedPair {
  compact: LinkedInFrameSpec;
  full: LinkedInFrameSpec;
}

export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  tags: string[];
  coverImage: string;
  /** Dos embeds del mismo post: compact = "Embed with less text", full = "Embed full post". */
  linkedinEmbed?: LinkedInEmbedPair;
}
