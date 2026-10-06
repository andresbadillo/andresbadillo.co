import { CanvasBarsDivider } from "@/components/Dividers/CanvasBarsDivider";
import { Seo } from "@/components/Seo/Seo";
import { LinkedInEmbed } from "@/components/LinkedInEmbed/LinkedInEmbed";
import { usePosts } from "@/context/PostsContext";
import { TransitionLink } from "@/components/TransitionLink/TransitionLink";
import { useParams } from "react-router-dom";
import pageLayout from "@/styles/pageLayout.module.scss";
import clsx from "clsx";
import styles from "./BlogPostDetailPage.module.scss";

export function BlogPostDetailPage() {
  const { slug = "" } = useParams();
  const { getPostBySlug, loading, error } = usePosts();
  const post = getPostBySlug(slug);

  if (error) {
    return (
      <section className={clsx("container", pageLayout.pageSection, pageLayout.mainBlock)}>
        <Seo title="Error — Blog de Andres Badillo" description="No se pudo cargar el artículo." noindex />
        <h1 className={styles.title}>Blog</h1>
        <p role="alert">No se pudo cargar el blog. {error.message}</p>
        <TransitionLink to="/blog">Volver al blog</TransitionLink>
      </section>
    );
  }

  if (loading) {
    return (
      <section className={clsx("container", pageLayout.pageSection, pageLayout.mainBlock)}>
        <Seo title="Blog — Andres Badillo" description="Cargando artículo…" />
        <h1 className={styles.title}>Blog</h1>
        <p aria-live="polite">Cargando artículo…</p>
        <TransitionLink to="/blog">Volver al blog</TransitionLink>
      </section>
    );
  }

  if (!post) {
    return (
      <section className={clsx("container", pageLayout.pageSection, pageLayout.mainBlock)}>
        <Seo title="Artículo no encontrado — Andres Badillo" description="La entrada solicitada no existe." noindex />
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
        <Seo title={`${post.title} — Andres Badillo`} description={post.excerpt} type="article" />
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
