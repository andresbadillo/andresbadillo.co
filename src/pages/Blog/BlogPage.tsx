import { Seo } from "@/components/Seo/Seo";
import { BlogPostCard } from "@/components/cards/BlogPostCard";
import { availableTags, posts } from "@/data/posts";
import { TransitionLink } from "@/components/TransitionLink/TransitionLink";
import styles from "./BlogPage.module.scss";

export function BlogPage() {
  return (
    <section className="container">
      <Seo title="Blog — Andres Badillo Demo" description="Artículos placeholder con navegación por etiquetas." />
      <h1>Blog</h1>
      <div className={styles.tags}>
        {availableTags.map((tag) => (
          <TransitionLink key={tag} to={`/blog/tag/${tag}`} className={styles.tag}>
            {tag}
          </TransitionLink>
        ))}
      </div>
      <div className={styles.grid}>
        {posts.map((post) => (
          <BlogPostCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  );
}
