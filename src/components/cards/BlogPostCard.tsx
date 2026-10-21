import type { Post } from "@/data/posts";
import { LinkedInEmbed } from "@/components/LinkedInEmbed/LinkedInEmbed";
import { useLocale } from "@/i18n/LocaleProvider";
import styles from "./BlogPostCard.module.scss";
import { TransitionLink } from "@/components/TransitionLink/TransitionLink";

interface BlogPostCardProps {
  post: Post;
}

export function BlogPostCard({ post }: BlogPostCardProps) {
  const { t } = useLocale();
  const detailPath = `/blog/${post.slug}`;
  const iframeTitle = t("linkedinIframeTitle", { title: post.title });

  return (
    <article className={styles.card}>
      {post.linkedinEmbed ? (
        <div className={styles.embedBlock}>
          <LinkedInEmbed spec={post.linkedinEmbed.compact} variant="compact" title={iframeTitle} loading="lazy" surfaceWhite />
        </div>
      ) : (
        <TransitionLink to={detailPath} className={styles.mediaLink} ariaLabel={t("articleAria", { title: post.title })}>
          <img src={post.coverImage} alt="" className={styles.img} />
        </TransitionLink>
      )}
      <h3 className={styles.title}>
        <TransitionLink to={detailPath}>{post.title}</TransitionLink>
      </h3>
      <p className={styles.tags}>
        {post.tags.map((item) => (
          <span key={item.slug} className={styles.tag}>
            {item.label.toUpperCase()}
          </span>
        ))}
      </p>
    </article>
  );
}
