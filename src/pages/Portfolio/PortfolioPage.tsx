import { CanvasBarsDivider } from "@/components/Dividers/CanvasBarsDivider";
import { Seo } from "@/components/Seo/Seo";
import { useHeadingAccentReveal } from "@/hooks/useHeadingAccentReveal";
import { HomeProjectRow } from "@/pages/Home/HomeProjectRow";
import { projects } from "@/data/projects";
import pageLayout from "@/styles/pageLayout.module.scss";
import headingAccent from "@/styles/sectionHeadingAccent.module.scss";
import clsx from "clsx";
import { useRef } from "react";
import styles from "./PortfolioPage.module.scss";

export function PortfolioPage() {
  const headingRef = useRef<HTMLHeadingElement>(null);
  useHeadingAccentReveal(headingRef);

  return (
    <>
      <section
        className={clsx("container", pageLayout.pageSection, styles.section)}
        aria-labelledby="portfolio-page-heading"
      >
        <Seo title="Portfolio — Andres Badillo Demo" description="Listado de proyectos mock con tags y fecha." />
        <h1 ref={headingRef} id="portfolio-page-heading" className={styles.sectionTitle}>
          <span className={headingAccent.sectionAccent}>Portfolio</span>
          Projects
        </h1>
        <p className={styles.lead}>Selección curada de proyectos de producto y experimentos visuales.</p>
        {projects.map((project, index) => (
          <HomeProjectRow key={project.slug} project={project} reversed={index % 2 === 0} />
        ))}
      </section>
      <CanvasBarsDivider topBackground="var(--bg)" bottomBackground="var(--home-hero-bg)" />
    </>
  );
}
