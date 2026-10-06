import type { Project } from "@/data/projects";
import { Mock } from "@/components/mocks";
import { TransitionLink } from "@/components/TransitionLink/TransitionLink";
import clsx from "clsx";
import styles from "./HomeProjectRow.module.scss";

interface HomeProjectRowProps {
  project: Project;
  reversed: boolean;
}

export function HomeProjectRow({ project, reversed }: HomeProjectRowProps) {
  const meta = [project.date, ...project.tags.map((t) => t.toUpperCase())].join(" | ");

  return (
    <article className={clsx(styles.row, reversed && styles.reversed)}>
      <div className={styles.preview}>
        <Mock id={project.hero} />
      </div>
      <div className={styles.copy}>
        <h3 className={styles.title}>{project.title}</h3>
        <p className={styles.text}>{project.excerpt}</p>
        <TransitionLink className={styles.cta} to={`/portfolio/${project.slug}`}>
          More Info
        </TransitionLink>
        <p className={styles.meta}>{meta}</p>
      </div>
    </article>
  );
}
