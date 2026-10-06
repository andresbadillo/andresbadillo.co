import { AutomationFlow } from "@/components/AutomationFlow/AutomationFlow";
import { CanvasBarsDivider } from "@/components/Dividers/CanvasBarsDivider";
import { Seo } from "@/components/Seo/Seo";
import { TransitionLink } from "@/components/TransitionLink/TransitionLink";
import {
  aboutAi,
  aboutBeyond,
  aboutChapters,
  aboutEducation,
  aboutIntro,
  aboutLanguages,
  aboutManagement,
  aboutPrinciples,
  aboutStages,
  aboutStats,
  aboutTagline,
  aboutToolsIntro,
} from "@/data/about";
import type { AboutBand } from "@/data/about";
import { projects } from "@/data/projects";
import { socialLinks } from "@/data/site";
import { useHeadingAccentReveal } from "@/hooks/useHeadingAccentReveal";
import avatarAvif from "@/assets/avatar/avatar-600.avif";
import avatarWebp from "@/assets/avatar/avatar-600.webp";
import pageLayout from "@/styles/pageLayout.module.scss";
import headingAccent from "@/styles/sectionHeadingAccent.module.scss";
import clsx from "clsx";
import { useRef } from "react";
import styles from "./AboutPage.module.scss";

/** Título de sección del sitio: primera palabra en --fg con subrayado que se revela, el resto en --muted. */
function SectionTitle({ id, accent, children }: { id: string; accent: string; children: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  useHeadingAccentReveal(ref);
  return (
    <h2 ref={ref} id={id} className={styles.sectionTitle}>
      <span className={headingAccent.sectionAccent}>{accent}</span>
      {children}
    </h2>
  );
}

function Band({ band }: { band: AboutBand }) {
  return (
    <p className={styles.band}>
      <span className={styles.bandLabel}>{band.label}</span>
      <span>
        {band.lead ? `${band.lead} ` : null}
        {band.key.map((item, index) => (
          <span key={item}>
            {index > 0 ? " · " : ""}
            <strong>{item}</strong>
          </span>
        ))}
        {band.others.map((item) => ` · ${item}`).join("")}
      </span>
    </p>
  );
}

const linkedIn = socialLinks.find((link) => link.label === "LinkedIn");
const gitHub = socialLinks.find((link) => link.label === "GitHub");

export function AboutPage() {
  const headingRef = useRef<HTMLHeadingElement>(null);
  useHeadingAccentReveal(headingRef);

  return (
    <>
      <section className={clsx("container", pageLayout.pageSection, pageLayout.mainBlock)} aria-labelledby="about-heading">
        <Seo
          title="About — Andres Badillo"
          description="Electronic engineer and MBA candidate with 14+ years in energy and technology, building software, data and automation where operations meet code."
        />
        <h1 ref={headingRef} id="about-heading" className={pageLayout.pageHeading}>
          <span className={headingAccent.sectionAccent}>About</span>
          me
        </h1>

        <div className={styles.intro}>
          <div className={styles.portrait}>
            <picture>
              <source srcSet={avatarAvif} type="image/avif" />
              <img src={avatarWebp} className={styles.avatar} alt="Portrait of Andrés Badillo" width={600} height={600} decoding="async" />
            </picture>
          </div>
          <div className={styles.introCopy}>
            <p className={styles.tagline}>{aboutTagline}</p>
            {aboutIntro.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>

        <ul className={styles.stats}>
          {aboutStats.map((stat) => (
            <li key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </li>
          ))}
        </ul>

        <section className={styles.block} aria-labelledby="about-story">
          <SectionTitle id="about-story" accent="My">
            story in four chapters
          </SectionTitle>
          <ol className={styles.chapters}>
            {aboutChapters.map((chapter) => (
              <li key={chapter.title} className={styles.chapter}>
                <span className={styles.period}>{chapter.period}</span>
                <div className={styles.chapterBody}>
                  <h3>{chapter.title}</h3>
                  <p>{chapter.text}</p>
                  {chapter.visual === "automation" ? <AutomationFlow /> : null}
                  {chapter.proof.length > 0 ? (
                    <p className={styles.proof}>
                      <span>See it in practice</span>
                      {chapter.proof.map((slug) => {
                        const project = projects.find((item) => item.slug === slug);
                        return project ? (
                          <TransitionLink key={slug} to={`/portfolio/${slug}`} className={styles.proofLink}>
                            {project.title}
                          </TransitionLink>
                        ) : null;
                      })}
                    </p>
                  ) : null}
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className={styles.block} aria-labelledby="about-think">
          <SectionTitle id="about-think" accent="How">
            I think
          </SectionTitle>
          <div className={styles.principles}>
            {aboutPrinciples.map((principle, index) => (
              <article key={principle.title} className={styles.principle}>
                <span className={styles.principleNum}>{String(index + 1).padStart(2, "0")}</span>
                <h3>{principle.title}</h3>
                <p>{principle.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.block} aria-labelledby="about-tools">
          <SectionTitle id="about-tools" accent="Tools">
            I use
          </SectionTitle>
          <p className={styles.toolsIntro}>{aboutToolsIntro}</p>
          <Band band={aboutManagement} />
          <ol className={styles.stages}>
            {aboutStages.map((stage, index) => (
              <li key={stage.title} className={styles.stage}>
                <span className={styles.stageNum}>{String(index + 1).padStart(2, "0")}</span>
                <h3>{stage.title}</h3>
                <ul className={styles.stageKey}>
                  {stage.key.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <p className={styles.stageOthers}>{stage.others.join(" · ")}</p>
              </li>
            ))}
          </ol>
          <Band band={aboutAi} />
        </section>

        <section className={styles.block} aria-labelledby="about-education">
          <SectionTitle id="about-education" accent="Education">
            and languages
          </SectionTitle>
          <ul className={styles.education}>
            {aboutEducation.map((item) => (
              <li key={item.title}>
                <span className={styles.period}>{item.period}</span>
                <div>
                  <strong>{item.title}</strong>
                  <span>{item.place}</span>
                </div>
              </li>
            ))}
          </ul>
          <ul className={styles.languages}>
            {aboutLanguages.map((language) => (
              <li key={language.value}>
                <strong>{language.value}</strong>
                <span>{language.label}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.block} aria-labelledby="about-beyond">
          <SectionTitle id="about-beyond" accent="Beyond">
            the keyboard
          </SectionTitle>
          <p className={styles.beyond}>{aboutBeyond}</p>
        </section>

        <section className={styles.closing} aria-labelledby="about-closing">
          <h2 id="about-closing">Have a process worth improving?</h2>
          <p>I&apos;m happy to talk about data, automation or a product that needs someone who understands the operation.</p>
          <div className={styles.actions}>
            <TransitionLink to="/contact" className={styles.cta}>
              Get in touch
            </TransitionLink>
            {linkedIn ? (
              <a href={linkedIn.href} className={styles.textLink} target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
            ) : null}
            {gitHub ? (
              <a href={gitHub.href} className={styles.textLink} target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
            ) : null}
          </div>
        </section>
      </section>
      <CanvasBarsDivider topBackground="var(--bg)" bottomBackground="var(--home-hero-bg)" />
    </>
  );
}
