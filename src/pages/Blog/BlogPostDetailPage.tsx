import { CanvasBarsDivider } from "@/components/Dividers/CanvasBarsDivider";
import { Seo } from "@/components/Seo/Seo";
import { LinkedInEmbed } from "@/components/LinkedInEmbed/LinkedInEmbed";
import { usePosts } from "@/context/PostsContext";
import { useLocale } from "@/i18n/LocaleProvider";
import { TransitionLink } from "@/components/TransitionLink/TransitionLink";
import { useParams } from "react-router-dom";
import pageLayout from "@/styles/pageLayout.module.scss";
import clsx from "clsx";
import styles from "./BlogPostDetailPage.module.scss";

export function BlogPostDetailPage() {
  const { t } = useLocale();
  const { slug = "" } = useParams();
  const { getPostBySlug, loading, error } = usePosts();
  const post = getPostBySlug(slug);

  if (error) {
    return (
      <section className={clsx("container", pageLayout.pageSection, pageLayout.mainBlock)}>
        <Seo title={t("seoPostErrorTitle")} description={t("seoPostErrorDescription")} noindex />
        <h1 className={styles.title}>Blog</h1>
        <p role="alert">{t("blogError")} {error.message}</p>
        <TransitionLink to="/blog">{t("backToBlog")}</TransitionLink>
      </section>
    );
  }

  if (loading) {
    return (
      <section className={clsx("container", pageLayout.pageSection, pageLayout.mainBlock)}>
        <Seo title={t("seoPostLoadingTitle")} description={t("seoPostLoadingDescription")} />
        <h1 className={styles.title}>Blog</h1>
        <p aria-live="polite">{t("postLoading")}</p>
        <TransitionLink to="/blog">{t("backToBlog")}</TransitionLink>
      </section>
    );
  }

  if (!post) {
    return (
      <section className={clsx("container", pageLayout.pageSection, pageLayout.mainBlock)}>
        <Seo title={t("seoPostMissingTitle")} description={t("seoPostMissingDescription")} noindex />
        <h1 className={styles.title}>Blog</h1>
        <p>{t("postMissing")}</p>
        <TransitionLink to="/blog">{t("backToBlog")}</TransitionLink>
      </section>
    );
  }

  const iframeTitle = t("linkedinIframeTitle", { title: post.title });

  return (
    <>
      <article className={clsx("container", pageLayout.pageSection, pageLayout.mainBlock, styles.article)}>
        <Seo title={`${post.title} — Andres Badillo`} description={post.excerpt} type="article" />
        <header className={styles.header}>
          <h1 className={styles.title}>{post.title}</h1>
          <time className={styles.date} dateTime={post.date}>
            {post.date}
          </time>
          <p className={styles.tags}>
            {post.tags.map((item) => (
              <span key={item.slug} className={styles.tag}>
                {item.label.toUpperCase()}
              </span>
            ))}
          </p>
        </header>

        {post.linkedinEmbed ? (
          <LinkedInEmbed spec={post.linkedinEmbed.full} variant="full" title={iframeTitle} loading="eager" />
        ) : (
          <p className={styles.fallback}>{post.excerpt}</p>
        )}

        <TransitionLink to="/blog" className={styles.back}>
          {t("backToBlog")}
        </TransitionLink>
      </article>
      <CanvasBarsDivider topBackground="var(--bg)" bottomBackground="var(--home-hero-bg)" />
    </>
  );
}
