import { Seo } from "@/components/Seo/Seo";
import { ProjectCard } from "@/components/cards/ProjectCard";
import { projects } from "@/data/projects";
import styles from "./PortfolioPage.module.scss";

export function PortfolioPage() {
  return (
    <section className="container">
      <Seo title="Portfolio — Andres Badillo Demo" description="Listado de proyectos mock con tags y fecha." />
      <h1>Portfolio</h1>
      <p>Selección curada de proyectos de producto y experimentos visuales.</p>
      <div className={styles.grid}>
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </section>
  );
}
