import type { Post } from "@/data/posts";
import { LinkedInEmbed } from "@/components/LinkedInEmbed/LinkedInEmbed";
import styles from "./BlogPostCard.module.scss";
import { TransitionLink } from "@/components/TransitionLink/TransitionLink";

interface BlogPostCardProps {
  post: Post;
}

export function BlogPostCard({ post }: BlogPostCardProps) {
  const detailPath = `/blog/${post.slug}`;
  const iframeTitle = `Publicación de LinkedIn: ${post.title}`;

  return (
    <article className={styles.card}>
      {post.linkedinEmbed ? (
        <div className={styles.embedBlock}>
          <LinkedInEmbed spec={post.linkedinEmbed.compact} variant="compact" title={iframeTitle} loading="lazy" />
        </div>
      ) : (
        <TransitionLink to={detailPath} className={styles.mediaLink} ariaLabel={`Artículo: ${post.title}`}>
          <img src={post.coverImage} alt="" className={styles.img} />
        </TransitionLink>
      )}
      <h3 className={styles.title}>
        <TransitionLink to={detailPath}>{post.title}</TransitionLink>
      </h3>
      <p className={styles.tags}>
        {post.tags.map((t) => (
          <span key={t} className={styles.tag}>
            {t.toUpperCase()}
          </span>
        ))}
      </p>
      <TransitionLink to={detailPath} className={styles.detailCta}>
        Ver publicación completa
      </TransitionLink>
    </article>
  );
}
