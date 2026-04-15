import { CanvasBarsDivider } from "@/components/Dividers/CanvasBarsDivider";
import { Seo } from "@/components/Seo/Seo";
import { useState } from "react";
import avatar from "@/assets/placeholders/avatar.svg";
import thumb1 from "@/assets/placeholders/thumb-1.svg";
import thumb2 from "@/assets/placeholders/thumb-2.svg";
import pageLayout from "@/styles/pageLayout.module.scss";
import clsx from "clsx";
import styles from "./AboutPage.module.scss";

const publications = [
  "Measuring Adaptive Frontend Systems (2025)",
  "Interface Patterns for Quiet UX (2024)",
  "Data Narratives in Dashboard Design (2023)",
  "Accessible Motion by Default (2022)",
  "Theme Architecture for SPAs (2021)",
  "Responsive Stories on the Web (2020)",
];

export function AboutPage() {
  const [expanded, setExpanded] = useState(false);
  const visiblePublications = expanded ? publications : publications.slice(0, 3);

  return (
    <>
      <section className={clsx("container", pageLayout.mainBlock)}>
        <Seo title="About — Andres Badillo Demo" description="Perfil profesional y publicaciones mock." />
        <h1>About</h1>
        <p>Frontend engineer enfocado en sistemas robustos, visualización clara y performance.</p>
        <img className={styles.avatar} src={avatar} alt="Avatar placeholder de perfil" />
        <h2>Public speaking</h2>
        <div className={styles.thumbs}>
          {[thumb1, thumb2, thumb1, thumb2, thumb1, thumb2].map((thumb, idx) => (
            <img key={idx} src={thumb} alt={`Miniatura placeholder ${idx + 1}`} />
          ))}
        </div>
        <h2>Publications</h2>
        <ul>
          {visiblePublications.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <button type="button" onClick={() => setExpanded((prev) => !prev)} aria-expanded={expanded}>
          More publications
        </button>
      </section>
      <CanvasBarsDivider topBackground="var(--bg)" bottomBackground="var(--home-hero-bg)" />
    </>
  );
}
