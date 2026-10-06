import { CanvasBarsDivider } from "@/components/Dividers/CanvasBarsDivider";
import { Mock } from "@/components/mocks";
import { Seo } from "@/components/Seo/Seo";
import { TransitionLink } from "@/components/TransitionLink/TransitionLink";
import { projects, type Project } from "@/data/projects";
import pageLayout from "@/styles/pageLayout.module.scss";
import clsx from "clsx";
import { useEffect, useState, type ReactNode } from "react";
import { useParams } from "react-router-dom";
import styles from "./ProjectDetailPage.module.scss";

const sections = [
  { id: "resumen", label: "Resumen" },
  { id: "contexto", label: "Contexto" },
  { id: "retos", label: "Retos técnicos" },
  { id: "arquitectura", label: "Arquitectura" },
  { id: "funciones", label: "Funcionalidades" },
  { id: "interfaz", label: "Interfaz" },
  { id: "impacto", label: "Impacto" },
] as const;

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
  return (
    <section className={clsx("container", pageLayout.pageSection, pageLayout.mainBlock)}>
      <Seo title="Proyecto no encontrado — Andres Badillo" description="El proyecto solicitado no existe." noindex />
      <h1 className={styles.title}>Proyecto no encontrado</h1>
      <TransitionLink to="/portfolio" className={styles.back}>
        Back to portfolio
      </TransitionLink>
    </section>
  );
}

function ProjectDetail({ project, next }: { project: Project; next: Project }) {
  const active = useActiveSection();
  const meta = [project.date, ...project.tags.map((tag) => tag.toUpperCase())].join(" | ");

  return (
    <>
      <article className={clsx("container", pageLayout.pageSection, pageLayout.mainBlock)}>
        <Seo title={`${project.title} — Portfolio de Andres Badillo`} description={project.excerpt} />

        <TransitionLink to="/portfolio" className={styles.back}>
          ← Portfolio
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
          <nav className={styles.toc} aria-label="Contenido del proyecto">
            <ol>
              {sections.map((section, index) => (
                <li key={section.id}>
                  <a href={`#${section.id}`} className={clsx(active === section.id && styles.tocActive)} aria-current={active === section.id ? "location" : undefined}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    {section.label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className={styles.content}>
            <section id="resumen" aria-labelledby="resumen-title" className={styles.section}>
              <SectionHead index={0} id="resumen">
                Resumen
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
                {project.anonymized
                  ? "Proyecto desarrollado para una empresa del sector energético. Los nombres, los datos y las cifras están anonimizados o redondeados, y las pantallas son maquetas con datos ficticios."
                  : "Las pantallas son maquetas ilustrativas con datos ficticios."}
              </p>
            </section>

            <section id="contexto" aria-labelledby="contexto-title" className={styles.section}>
              <SectionHead index={1} id="contexto">
                Contexto
              </SectionHead>
              {project.context.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              <blockquote className={styles.quote}>{project.context.question}</blockquote>
            </section>

            <section id="retos" aria-labelledby="retos-title" className={styles.section}>
              <SectionHead index={2} id="retos">
                Retos técnicos
              </SectionHead>
              <p className={styles.callout}>
                <strong>Novedad. </strong>
                {project.novelty}
              </p>
              <div className={styles.cards}>
                {project.challenges.map((challenge, index) => (
                  <article key={challenge.title} className={styles.card}>
                    <span className={styles.cardTag}>Reto {index + 1}</span>
                    <h3>{challenge.title}</h3>
                    <p>{challenge.text}</p>
                  </article>
                ))}
              </div>
              <h3 className={styles.subhead}>Método de trabajo</h3>
              <ul className={styles.check}>
                {project.method.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            <section id="arquitectura" aria-labelledby="arquitectura-title" className={styles.section}>
              <SectionHead index={3} id="arquitectura">
                Arquitectura
              </SectionHead>
              <h3 className={styles.subhead}>Stack</h3>
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th scope="col">Tecnología</th>
                      <th scope="col">Rol</th>
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
              <h3 className={styles.subhead}>Módulos</h3>
              <dl className={styles.arch}>
                {project.architecture.map((item) => (
                  <div key={item.label}>
                    <dt>{item.label}</dt>
                    <dd>{item.value}</dd>
                  </div>
                ))}
              </dl>
              <h3 className={styles.subhead}>Flujo</h3>
              <ol className={styles.flow}>
                {project.flow.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </section>

            <section id="funciones" aria-labelledby="funciones-title" className={styles.section}>
              <SectionHead index={4} id="funciones">
                Funcionalidades
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
                Interfaz
              </SectionHead>
              <div className={styles.figures}>
                {project.screens.map((screen, index) => (
                  <figure key={screen.mock} className={styles.figure}>
                    <div className={styles.preview}>
                      <Mock id={screen.mock} />
                    </div>
                    <figcaption>
                      <span>Pantalla {index + 1}</span>
                      <strong>{screen.title}</strong>
                      {screen.caption}
                    </figcaption>
                  </figure>
                ))}
              </div>
            </section>

            <section id="impacto" aria-labelledby="impacto-title" className={styles.section}>
              <SectionHead index={6} id="impacto">
                Impacto
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
                      <th scope="col">Indicador</th>
                      <th scope="col">Antes</th>
                      <th scope="col">Ahora</th>
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

            <nav className={styles.footerNav} aria-label="Navegación entre proyectos">
              <TransitionLink to="/portfolio" className={styles.back}>
                ← Back to portfolio
              </TransitionLink>
              <TransitionLink to={`/portfolio/${next.slug}`} className={styles.cta}>
                Next: {next.title}
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
  const { slug = "" } = useParams();
  const index = projects.findIndex((item) => item.slug === slug);
  if (index === -1) return <NotFound />;
  return <ProjectDetail key={slug} project={projects[index]} next={projects[(index + 1) % projects.length]} />;
}
