import { CanvasBarsDivider } from "@/components/Dividers/CanvasBarsDivider";
import { Seo } from "@/components/Seo/Seo";
import { BlogPostCard } from "@/components/cards/BlogPostCard";
import { availableTags, posts } from "@/data/posts";
import { TransitionLink } from "@/components/TransitionLink/TransitionLink";
import { useHeadingAccentReveal } from "@/hooks/useHeadingAccentReveal";
import pageLayout from "@/styles/pageLayout.module.scss";
import headingAccent from "@/styles/sectionHeadingAccent.module.scss";
import clsx from "clsx";
import { useRef } from "react";
import { useParams } from "react-router-dom";
import styles from "./BlogPage.module.scss";

export function BlogTagPage() {
  const { tag = "all" } = useParams();
  const normalized = tag.toLowerCase();
  const filtered = normalized === "all" ? posts : posts.filter((post) => post.tags.map((t) => t.toLowerCase()).includes(normalized));
  const isKnownTag = availableTags.includes(normalized);
  const headingRef = useRef<HTMLHeadingElement>(null);
  useHeadingAccentReveal(headingRef);

  return (
    <>
      <section className={clsx("container", pageLayout.pageSection, pageLayout.mainBlock)}>
        <Seo title={`Blog tag ${tag} — Demo`} description="Filtrado de artículos por etiqueta." />
        <h1 ref={headingRef} className={pageLayout.pageHeading}>
          <span className={headingAccent.sectionAccent}>Blog</span>
          {" / "}
          {tag}
        </h1>
        <div className={styles.tags}>
          {availableTags.map((currentTag) => (
            <TransitionLink key={currentTag} to={`/blog/tag/${currentTag}`} className={styles.tag}>
              {currentTag}
            </TransitionLink>
          ))}
        </div>
        {!isKnownTag && <p>Etiqueta no reconocida, mostrando coincidencias vacías.</p>}
        <div className={styles.grid}>
          {filtered.map((post) => (
            <BlogPostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>
      <CanvasBarsDivider topBackground="var(--bg)" bottomBackground="var(--home-hero-bg)" />
    </>
  );
}
