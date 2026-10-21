import { CanvasBarsDivider } from "@/components/Dividers/CanvasBarsDivider";
import { Seo } from "@/components/Seo/Seo";
import { usePosts } from "@/context/PostsContext";
import { useLocale } from "@/i18n/LocaleProvider";
import { BlogPostCard } from "@/components/cards/BlogPostCard";
import { TransitionLink } from "@/components/TransitionLink/TransitionLink";
import { useHeadingAccentReveal } from "@/hooks/useHeadingAccentReveal";
import pageLayout from "@/styles/pageLayout.module.scss";
import headingAccent from "@/styles/sectionHeadingAccent.module.scss";
import clsx from "clsx";
import { useRef } from "react";
import styles from "./BlogPage.module.scss";

export function BlogPage() {
  const { t } = useLocale();
  const { availableTags, posts, loading, error } = usePosts();
  const headingRef = useRef<HTMLHeadingElement>(null);
  useHeadingAccentReveal(headingRef);

  return (
    <>
      <section className={clsx("container", pageLayout.pageSection, pageLayout.mainBlock)}>
        <Seo title={t("seoBlogTitle")} description={t("seoBlogDescription")} />
        <h1 ref={headingRef} className={pageLayout.pageHeading}>
          <span className={headingAccent.sectionAccent}>Blog</span>
        </h1>
        {error && <p role="alert">{t("blogError")} {error.message}</p>}
        {loading && <p aria-live="polite">{t("blogLoading")}</p>}
        <div className={styles.tags}>
          <span className={styles.tagsLabel}>{t("tagsLabel")}</span>
          <TransitionLink to="/blog/tag/all" className={styles.tag}>
            {t("tagAll")}
          </TransitionLink>
          {availableTags.map((tag) => (
            <TransitionLink key={tag.slug} to={`/blog/tag/${encodeURIComponent(tag.slug)}`} className={styles.tag}>
              {tag.label}
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
