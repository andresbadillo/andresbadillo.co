import clsx from "clsx";
import type { LinkedInFrameSpec } from "@/data/posts";
import styles from "./LinkedInEmbed.module.scss";

const DEFAULT_HEIGHT: Record<"compact" | "full", number> = {
  compact: 420,
  full: 760,
};

export interface LinkedInEmbedProps {
  spec: LinkedInFrameSpec;
  variant: "compact" | "full";
  /** Texto accesible del iframe (p. ej. título del post). */
  title: string;
  loading?: "lazy" | "eager";
}

export function LinkedInEmbed({ spec, variant, title, loading = "lazy" }: LinkedInEmbedProps) {
  const height = spec.height ?? DEFAULT_HEIGHT[variant];
  const width = spec.width;

  return (
    <div className={clsx(styles.root, variant === "compact" ? styles.compact : styles.full)}>
      <iframe
        className={styles.iframe}
        src={spec.src}
        title={title}
        height={height}
        {...(variant === "compact" && width != null ? { width } : {})}
        loading={loading}
      />
    </div>
  );
}
