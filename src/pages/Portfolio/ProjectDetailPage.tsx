import { Seo } from "@/components/Seo/Seo";
import { TransitionLink } from "@/components/TransitionLink/TransitionLink";
import { projects } from "@/data/projects";
import { useParams } from "react-router-dom";
import styles from "./ProjectDetailPage.module.scss";

export function ProjectDetailPage() {
  const { slug = "" } = useParams();
  const project = projects.find((item) => item.slug === slug);

  if (!project) {
    return (
      <section className="container">
        <h1>Proyecto no encontrado</h1>
        <TransitionLink to="/portfolio">Back to portfolio</TransitionLink>
      </section>
    );
  }

  return (
    <article className={`container ${styles.wrap}`}>
      <Seo title={`${project.title} — Proyecto`} description={project.excerpt} />
      <h1>{project.title}</h1>
      <p>{project.excerpt}</p>
      {project.heroImage && <img className={styles.image} src={project.heroImage} alt={`Portada de ${project.title}`} />}
      {project.content.map((block, index) =>
        block.type === "paragraph" ? <p key={index}>{block.text}</p> : <ul key={index}>{block.items.map((item) => <li key={item}>{item}</li>)}</ul>,
      )}
      <TransitionLink to="/portfolio">Back to portfolio</TransitionLink>
    </article>
  );
}
