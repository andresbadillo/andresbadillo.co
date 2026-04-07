import type { Post } from "@/data/posts";
import styles from "./BlogPostCard.module.scss";
import { TransitionLink } from "@/components/TransitionLink/TransitionLink";

interface BlogPostCardProps {
  post: Post;
}

export function BlogPostCard({ post }: BlogPostCardProps) {
  return (
    <article className={styles.card}>
      <TransitionLink to="/blog" className={styles.mediaLink} ariaLabel={`Artículo: ${post.title}`}>
        <img src={post.coverImage} alt="" className={styles.img} />
      </TransitionLink>
      <h3 className={styles.title}>
        <TransitionLink to="/blog">{post.title}</TransitionLink>
      </h3>
      <p className={styles.tags}>
        {post.tags.map((t) => (
          <span key={t} className={styles.tag}>
            {t.toUpperCase()}
          </span>
        ))}
      </p>
    </article>
  );
}
