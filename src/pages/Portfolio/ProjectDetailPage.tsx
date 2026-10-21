import { CanvasBarsDivider } from "@/components/Dividers/CanvasBarsDivider";
import { Mock } from "@/components/mocks";
import { Seo } from "@/components/Seo/Seo";
import { TransitionLink } from "@/components/TransitionLink/TransitionLink";
import { useProjects } from "@/context/ProjectsContext";
import type { Project } from "@/data/projectModel";
import { useLocale } from "@/i18n/LocaleProvider";
import type { MessageKey } from "@/data/ui";
import pageLayout from "@/styles/pageLayout.module.scss";
import clsx from "clsx";
import { useEffect, useState, type ReactNode } from "react";
import { useParams } from "react-router-dom";
import styles from "./ProjectDetailPage.module.scss";

const sections = [
  { id: "resumen", labelKey: "sectionSummary" },
  { id: "contexto", labelKey: "sectionContext" },
  { id: "retos", labelKey: "sectionChallenges" },
  { id: "arquitectura", labelKey: "sectionArchitecture" },
  { id: "funciones", labelKey: "sectionFeatures" },
  { id: "interfaz", labelKey: "sectionInterface" },
  { id: "impacto", labelKey: "sectionImpact" },
] as const satisfies ReadonlyArray<{ id: string; labelKey: MessageKey }>;

function SectionHead({ index, id, children }: { index: number; id: string; children: ReactNode }) {
  return (
    <header className={styles.sectionHead}>
      <span className={styles.sectionNum}>{String(index + 1).padStart(2, "0")}</span>
      <h2 id={`${id}-title`} className={styles.sectionTitle}>
        {children}
      </h2>
    </header>
  );
}

/** Marca en el índice la sección que está a la altura de la lectura. */
function useActiveSection(): string {
  const [active, setActive] = useState<string>(sections[0].id);

  useEffect(() => {
    const elements = sections.map((section) => document.getElementById(section.id)).filter((el): el is HTMLElement => el !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return active;
}

function NotFound() {
  const { t } = useLocale();
  return (
    <section className={clsx("container", pageLayout.pageSection, pageLayout.mainBlock)}>
      <Seo title={t("seoProjectMissingTitle")} description={t("seoProjectMissingDescription")} noindex />
      <h1 className={styles.title}>{t("projectMissing")}</h1>
      <TransitionLink to="/portfolio" className={styles.back}>
        {t("backToPortfolio")}
      </TransitionLink>
    </section>
  );
}

function ProjectDetail({ project, next }: { project: Project; next: Project }) {
  const { t } = useLocale();
  const active = useActiveSection();
  const meta = [project.date, ...project.tags.map((tag) => tag.toUpperCase())].join(" | ");

  return (
    <>
      <article className={clsx("container", pageLayout.pageSection, pageLayout.mainBlock)}>
        <Seo title={`${project.title} — ${t("portfolioAccent")} — Andres Badillo`} description={project.excerpt} />

        <TransitionLink to="/portfolio" className={styles.back}>
          {t("portfolioBackShort")}
        </TransitionLink>

        <header className={styles.header}>
          <p className={styles.meta}>{meta}</p>
          <h1 className={styles.title}>{project.title}</h1>
          <p className={styles.lead}>{project.lead}</p>
        </header>

        <div className={styles.preview}>
          <Mock id={project.hero} />
        </div>

        <div className={styles.layout}>
          <nav className={styles.toc} aria-label={t("projectToc")}>
            <ol>
              {sections.map((section, index) => (
                <li key={section.id}>
                  <a href={`#${section.id}`} className={clsx(active === section.id && styles.tocActive)} aria-current={active === section.id ? "location" : undefined}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    {t(section.labelKey)}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className={styles.content}>
            <section id="resumen" aria-labelledby="resumen-title" className={styles.section}>
              <SectionHead index={0} id="resumen">
                {t("sectionSummary")}
              </SectionHead>
              {project.summary.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              <dl className={styles.facts}>
                {project.facts.map((fact) => (
                  <div key={fact.label} className={styles.fact}>
                    <dt>{fact.label}</dt>
                    <dd>{fact.value}</dd>
                  </div>
                ))}
              </dl>
              <p className={styles.note}>
                {project.anonymized ? t("anonymizedNote") : t("mockNote")}
              </p>
            </section>

            <section id="contexto" aria-labelledby="contexto-title" className={styles.section}>
              <SectionHead index={1} id="contexto">
                {t("sectionContext")}
              </SectionHead>
              {project.context.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              <blockquote className={styles.quote}>{project.context.question}</blockquote>
            </section>

            <section id="retos" aria-labelledby="retos-title" className={styles.section}>
              <SectionHead index={2} id="retos">
                {t("sectionChallenges")}
              </SectionHead>
              <p className={styles.callout}>
                <strong>{t("noveltyLabel")} </strong>
                {project.novelty}
              </p>
              <div className={styles.cards}>
                {project.challenges.map((challenge, index) => (
                  <article key={challenge.title} className={styles.card}>
                    <span className={styles.cardTag}>{t("challengeLabel", { n: String(index + 1) })}</span>
                    <h3>{challenge.title}</h3>
                    <p>{challenge.text}</p>
                  </article>
                ))}
              </div>
              <h3 className={styles.subhead}>{t("subheadMethod")}</h3>
              <ul className={styles.check}>
                {project.method.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            <section id="arquitectura" aria-labelledby="arquitectura-title" className={styles.section}>
              <SectionHead index={3} id="arquitectura">
                {t("sectionArchitecture")}
              </SectionHead>
              <h3 className={styles.subhead}>{t("subheadStack")}</h3>
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th scope="col">{t("colTechnology")}</th>
                      <th scope="col">{t("colRole")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {project.stack.map((item) => (
                      <tr key={item.label}>
                        <td>
                          <code>{item.label}</code>
                        </td>
                        <td>{item.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <h3 className={styles.subhead}>{t("subheadModules")}</h3>
              <dl className={styles.arch}>
                {project.architecture.map((item) => (
                  <div key={item.label}>
                    <dt>{item.label}</dt>
                    <dd>{item.value}</dd>
                  </div>
                ))}
              </dl>
              <h3 className={styles.subhead}>{t("subheadFlow")}</h3>
              <ol className={styles.flow}>
                {project.flow.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </section>

            <section id="funciones" aria-labelledby="funciones-title" className={styles.section}>
              <SectionHead index={4} id="funciones">
                {t("sectionFeatures")}
              </SectionHead>
              <ul className={styles.features}>
                {project.features.map((feature) => (
                  <li key={feature.title}>
                    <strong>{feature.title}</strong>
                    <span>{feature.text}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section id="interfaz" aria-labelledby="interfaz-title" className={styles.section}>
              <SectionHead index={5} id="interfaz">
                {t("sectionInterface")}
              </SectionHead>
              <div className={styles.figures}>
                {project.screens.map((screen, index) => (
                  <figure key={screen.mock} className={styles.figure}>
                    <div className={styles.preview}>
                      <Mock id={screen.mock} />
                    </div>
                    <figcaption>
                      <span>{t("screenLabel", { n: String(index + 1) })}</span>
                      <strong>{screen.title}</strong>
                      {screen.caption}
                    </figcaption>
                  </figure>
                ))}
              </div>
            </section>

            <section id="impacto" aria-labelledby="impacto-title" className={styles.section}>
              <SectionHead index={6} id="impacto">
                {t("sectionImpact")}
              </SectionHead>
              <ul className={styles.stats}>
                {project.impact.stats.map((stat) => (
                  <li key={stat.label}>
                    <strong>{stat.value}</strong>
                    <span>{stat.label}</span>
                  </li>
                ))}
              </ul>
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th scope="col">{t("colIndicator")}</th>
                      <th scope="col">{t("colBefore")}</th>
                      <th scope="col">{t("colAfter")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {project.impact.rows.map((row) => (
                      <tr key={row.indicator}>
                        <th scope="row">{row.indicator}</th>
                        <td className={styles.before}>{row.before}</td>
                        <td className={styles.after}>{row.after}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p>{project.impact.closing}</p>
            </section>

            <nav className={styles.footerNav} aria-label={t("projectNav")}>
              <TransitionLink to="/portfolio" className={styles.back}>
                {t("backToPortfolio")}
              </TransitionLink>
              <TransitionLink to={`/portfolio/${next.slug}`} className={styles.cta}>
                {t("projectNext", { title: next.title })}
              </TransitionLink>
            </nav>
          </div>
        </div>
      </article>
      <CanvasBarsDivider topBackground="var(--bg)" bottomBackground="var(--home-hero-bg)" />
    </>
  );
}

export function ProjectDetailPage() {
  const { t } = useLocale();
  const { slug = "" } = useParams();
  const { projects, loading, error } = useProjects();
  if (error) {
    return (
      <section className={clsx("container", pageLayout.pageSection, pageLayout.mainBlock)}>
        <p role="alert">{t("projectsError")} {error.message}</p>
      </section>
    );
  }
  if (loading) {
    return (
      <section className={clsx("container", pageLayout.pageSection, pageLayout.mainBlock)}>
        <p aria-live="polite">{t("projectsLoading")}</p>
      </section>
    );
  }
  const index = projects.findIndex((item) => item.slug === slug);
  if (index === -1) return <NotFound />;
  return <ProjectDetail key={slug} project={projects[index]} next={projects[(index + 1) % projects.length]} />;
}
