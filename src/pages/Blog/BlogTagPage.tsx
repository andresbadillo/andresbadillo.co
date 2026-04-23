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
import { useParams } from "react-router-dom";
import styles from "./BlogPage.module.scss";

export function BlogTagPage() {
  const { availableTags, posts, loading, error } = usePosts();
  const { tag = "all" } = useParams();
  const currentTag = decodeURIComponent(tag);
  const normalized = currentTag.toLowerCase();
  const filtered = normalized === "all" ? posts : posts.filter((post) => post.tags.map((t) => t.toLowerCase()).includes(normalized));
  const isKnownTag = availableTags.some((availableTag) => availableTag.toLowerCase() === normalized);
  const headingRef = useRef<HTMLHeadingElement>(null);
  useHeadingAccentReveal(headingRef);

  return (
    <>
      <section className={clsx("container", pageLayout.pageSection, pageLayout.mainBlock)}>
        <Seo title={`Blog tag ${currentTag} — Demo`} description="Filtrado de artículos por etiqueta." />
        <h1 ref={headingRef} className={pageLayout.pageHeading}>
          <span className={headingAccent.sectionAccent}>Blog</span>
          {" / "}
          {currentTag}
        </h1>
        {error && <p role="alert">No se pudo cargar el blog. {error.message}</p>}
        {loading && <p aria-live="polite">Cargando artículos…</p>}
        <div className={styles.tags}>
          <span className={styles.tagsLabel}>Tags:</span>
          {availableTags.map((t) => (
            <TransitionLink key={t} to={`/blog/tag/${encodeURIComponent(t)}`} className={styles.tag}>
              {t}
            </TransitionLink>
          ))}
        </div>
        {!isKnownTag && <p>Etiqueta no reconocida, mostrando coincidencias vacías.</p>}
        <div className={styles.grid}>
          {!loading &&
            !error &&
            filtered.map((post) => (
            <BlogPostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>
      <CanvasBarsDivider topBackground="var(--bg)" bottomBackground="var(--home-hero-bg)" />
    </>
  );
}
