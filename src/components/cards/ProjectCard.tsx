import type { Project } from "@/data/projects";
import styles from "./ProjectCard.module.scss";
import { TransitionLink } from "@/components/TransitionLink/TransitionLink";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className={styles.card}>
      <img src={project.heroImage} alt={`Imagen placeholder de ${project.title}`} className={styles.img} />
      <div className={styles.body}>
        <h3>{project.title}</h3>
        <p>{project.excerpt}</p>
        <p className={styles.meta}>
          {project.date} · {project.tags.join(" · ")}
        </p>
        <TransitionLink to={`/portfolio/${project.slug}`}>More info</TransitionLink>
      </div>
    </article>
  );
}
