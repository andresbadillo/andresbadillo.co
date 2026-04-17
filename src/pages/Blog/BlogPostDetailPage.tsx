import { CanvasBarsDivider } from "@/components/Dividers/CanvasBarsDivider";
import { Seo } from "@/components/Seo/Seo";
import { LinkedInEmbed } from "@/components/LinkedInEmbed/LinkedInEmbed";
import { getPostBySlug } from "@/data/posts";
import { TransitionLink } from "@/components/TransitionLink/TransitionLink";
import { useParams } from "react-router-dom";
import pageLayout from "@/styles/pageLayout.module.scss";
import clsx from "clsx";
import styles from "./BlogPostDetailPage.module.scss";

export function BlogPostDetailPage() {
  const { slug = "" } = useParams();
  const post = getPostBySlug(slug);

  if (!post) {
    return (
      <section className={clsx("container", pageLayout.pageSection, pageLayout.mainBlock)}>
        <Seo title="Artículo no encontrado — Blog" description="La entrada solicitada no existe." />
        <h1 className={styles.title}>Blog</h1>
        <p>Artículo no encontrado.</p>
        <TransitionLink to="/blog">Volver al blog</TransitionLink>
      </section>
    );
  }

  const iframeTitle = `Publicación de LinkedIn: ${post.title}`;

  return (
    <>
      <article className={clsx("container", pageLayout.pageSection, pageLayout.mainBlock, styles.article)}>
        <Seo title={`${post.title} — Blog`} description={post.excerpt} />
        <header className={styles.header}>
          <h1 className={styles.title}>{post.title}</h1>
          <time className={styles.date} dateTime={post.date}>
            {post.date}
          </time>
          <p className={styles.tags}>
            {post.tags.map((t) => (
              <span key={t} className={styles.tag}>
                {t.toUpperCase()}
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
          Volver al blog
        </TransitionLink>
      </article>
      <CanvasBarsDivider topBackground="var(--bg)" bottomBackground="var(--home-hero-bg)" />
    </>
  );
}
