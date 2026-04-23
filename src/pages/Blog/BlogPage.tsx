import { CanvasBarsDivider } from "@/components/Dividers/CanvasBarsDivider";
import { Seo } from "@/components/Seo/Seo";
import { usePosts } from "@/context/PostsContext";
import { BlogPostCard } from "@/components/cards/BlogPostCard";
import { TransitionLink } from "@/components/TransitionLink/TransitionLink";
import { useHeadingAccentReveal } from "@/hooks/useHeadingAccentReveal";
import pageLayout from "@/styles/pageLayout.module.scss";
import headingAccent from "@/styles/sectionHeadingAccent.module.scss";
import clsx from "clsx";
import { useRef } from "react";
import styles from "./BlogPage.module.scss";

export function BlogPage() {
  const { availableTags, posts, loading, error } = usePosts();
  const headingRef = useRef<HTMLHeadingElement>(null);
  useHeadingAccentReveal(headingRef);

  return (
    <>
      <section className={clsx("container", pageLayout.pageSection, pageLayout.mainBlock)}>
        <Seo title="Blog — Andres Badillo Demo" description="Artículos placeholder con navegación por etiquetas." />
        <h1 ref={headingRef} className={pageLayout.pageHeading}>
          <span className={headingAccent.sectionAccent}>Blog</span>
        </h1>
        {error && <p role="alert">No se pudo cargar el blog. {error.message}</p>}
        {loading && <p aria-live="polite">Cargando artículos…</p>}
        <div className={styles.tags}>
          <span className={styles.tagsLabel}>Tags:</span>
          {availableTags.map((tag) => (
            <TransitionLink key={tag} to={`/blog/tag/${encodeURIComponent(tag)}`} className={styles.tag}>
              {tag}
            </TransitionLink>
          ))}
        </div>
        <div className={styles.grid}>
          {!loading &&
            !error &&
            posts.map((post) => (
            <BlogPostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>
      <CanvasBarsDivider topBackground="var(--bg)" bottomBackground="var(--home-hero-bg)" />
    </>
  );
}
