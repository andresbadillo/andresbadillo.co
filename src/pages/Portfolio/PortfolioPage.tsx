import { CanvasBarsDivider } from "@/components/Dividers/CanvasBarsDivider";
import { Seo } from "@/components/Seo/Seo";
import { ProjectCard } from "@/components/cards/ProjectCard";
import { projects } from "@/data/projects";
import pageLayout from "@/styles/pageLayout.module.scss";
import clsx from "clsx";
import styles from "./PortfolioPage.module.scss";

export function PortfolioPage() {
  return (
    <>
      <section className={clsx("container", pageLayout.mainBlock)}>
        <Seo title="Portfolio — Andres Badillo Demo" description="Listado de proyectos mock con tags y fecha." />
        <h1>Portfolio</h1>
        <p>Selección curada de proyectos de producto y experimentos visuales.</p>
        <div className={styles.grid}>
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </section>
      <CanvasBarsDivider topBackground="var(--bg)" bottomBackground="var(--home-hero-bg)" />
    </>
  );
}
