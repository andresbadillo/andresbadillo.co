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
import { useParams } from "react-router-dom";
import styles from "./BlogPage.module.scss";

export function BlogTagPage() {
  const { t } = useLocale();
  const { availableTags, posts, loading, error } = usePosts();
  const { tag = "all" } = useParams();
  const normalized = tag.toLowerCase();
  const current = availableTags.find((item) => item.slug.toLowerCase() === normalized);
  const label = normalized === "all" ? t("tagAll") : current?.label ?? tag;
  const filtered = normalized === "all" ? posts : posts.filter((post) => post.tags.some((item) => item.slug.toLowerCase() === normalized));
  const isKnownTag = normalized === "all" || current !== undefined;
  const headingRef = useRef<HTMLHeadingElement>(null);
  useHeadingAccentReveal(headingRef);

  return (
    <>
      <section className={clsx("container", pageLayout.pageSection, pageLayout.mainBlock)}>
        <Seo
          title={t("seoBlogTagTitle", { tag: label })}
          description={t("seoBlogTagDescription", { tag: label })}
          noindex={!loading && !error && !isKnownTag}
        />
        <h1 ref={headingRef} className={pageLayout.pageHeading}>
          <span className={headingAccent.sectionAccent}>Blog</span>
          {" / "}
          {label}
        </h1>
        {error && <p role="alert">{t("blogError")} {error.message}</p>}
        {loading && <p aria-live="polite">{t("blogLoading")}</p>}
        <div className={styles.tags}>
          <span className={styles.tagsLabel}>{t("tagsLabel")}</span>
          <TransitionLink to="/blog/tag/all" className={styles.tag}>
            {t("tagAll")}
          </TransitionLink>
          {availableTags.map((item) => (
            <TransitionLink key={item.slug} to={`/blog/tag/${encodeURIComponent(item.slug)}`} className={styles.tag}>
              {item.label}
            </TransitionLink>
          ))}
        </div>
        {!loading && !error && !isKnownTag && <p>{t("tagUnknown")}</p>}
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
