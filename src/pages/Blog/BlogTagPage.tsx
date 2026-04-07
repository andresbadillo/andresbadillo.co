import { Seo } from "@/components/Seo/Seo";
import { BlogPostCard } from "@/components/cards/BlogPostCard";
import { availableTags, posts } from "@/data/posts";
import { TransitionLink } from "@/components/TransitionLink/TransitionLink";
import { useParams } from "react-router-dom";
import styles from "./BlogPage.module.scss";

export function BlogTagPage() {
  const { tag = "all" } = useParams();
  const normalized = tag.toLowerCase();
  const filtered = normalized === "all" ? posts : posts.filter((post) => post.tags.map((t) => t.toLowerCase()).includes(normalized));
  const isKnownTag = availableTags.includes(normalized);

  return (
    <section className="container">
      <Seo title={`Blog tag ${tag} — Demo`} description="Filtrado de artículos por etiqueta." />
      <h1>Blog / {tag}</h1>
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
  );
}
