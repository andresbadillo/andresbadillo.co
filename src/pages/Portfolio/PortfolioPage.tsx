import { CanvasBarsDivider } from "@/components/Dividers/CanvasBarsDivider";
import { Seo } from "@/components/Seo/Seo";
import { useHeadingAccentReveal } from "@/hooks/useHeadingAccentReveal";
import { HomeProjectRow } from "@/pages/Home/HomeProjectRow";
import { useProjects } from "@/context/ProjectsContext";
import { useLocale } from "@/i18n/LocaleProvider";
import pageLayout from "@/styles/pageLayout.module.scss";
import headingAccent from "@/styles/sectionHeadingAccent.module.scss";
import clsx from "clsx";
import { useRef } from "react";
import styles from "./PortfolioPage.module.scss";

export function PortfolioPage() {
  const { t } = useLocale();
  const { projects, loading, error } = useProjects();
  const headingRef = useRef<HTMLHeadingElement>(null);
  useHeadingAccentReveal(headingRef);

  return (
    <>
      <section
        className={clsx("container", pageLayout.pageSection, styles.section)}
        aria-labelledby="portfolio-page-heading"
      >
        <Seo title={t("seoPortfolioTitle")} description={t("seoPortfolioDescription")} />
        <h1 ref={headingRef} id="portfolio-page-heading" className={styles.sectionTitle}>
          <span className={headingAccent.sectionAccent}>{t("portfolioAccent")}</span>
          {` ${t("portfolioRest")}`}
        </h1>
        <p className={styles.lead}>{t("portfolioLead")}</p>
        {error && <p role="alert">{t("projectsError")} {error.message}</p>}
        {loading && <p aria-live="polite">{t("projectsLoading")}</p>}
        {projects.map((project, index) => (
          <HomeProjectRow key={project.slug} project={project} reversed={index % 2 === 0} />
        ))}
      </section>
      <CanvasBarsDivider topBackground="var(--bg)" bottomBackground="var(--home-hero-bg)" />
    </>
  );
}
