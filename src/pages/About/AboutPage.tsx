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
import type { AboutBand, LocalizedText } from "@/data/about";
import { useProjects } from "@/context/ProjectsContext";
import { useLocale } from "@/i18n/LocaleProvider";
import { pickLocalized } from "@/i18n/locale";
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

function Band({ band, text }: { band: AboutBand; text: (value: LocalizedText) => string }) {
  return (
    <p className={styles.band}>
      <span className={styles.bandLabel}>{text(band.label)}</span>
      <span>
        {band.lead ? `${text(band.lead)} ` : null}
        {band.key.map((item, index) => (
          <span key={item}>
            {index > 0 ? " · " : ""}
            <strong>{item}</strong>
          </span>
        ))}
        {band.others.map((item) => ` · ${text(item)}`).join("")}
      </span>
    </p>
  );
}

const linkedIn = socialLinks.find((link) => link.label === "LinkedIn");
const gitHub = socialLinks.find((link) => link.label === "GitHub");

export function AboutPage() {
  const { locale, t } = useLocale();
  const { getProjectBySlug } = useProjects();
  const text = (value: LocalizedText) => pickLocalized(locale, value.es, value.en);
  const intro = aboutIntro.es.map((paragraph, index) => pickLocalized(locale, paragraph, aboutIntro.en[index]));
  const headingRef = useRef<HTMLHeadingElement>(null);
  useHeadingAccentReveal(headingRef);

  return (
    <>
      <section className={clsx("container", pageLayout.pageSection, pageLayout.mainBlock)} aria-labelledby="about-heading">
        <Seo title={t("seoAboutTitle")} description={t("seoAboutDescription")} />
        <h1 ref={headingRef} id="about-heading" className={pageLayout.pageHeading}>
          <span className={headingAccent.sectionAccent}>{t("aboutAccent")}</span>
          {` ${t("aboutRest")}`}
        </h1>

        <div className={styles.intro}>
          <div className={styles.portrait}>
            <picture>
              <source srcSet={avatarAvif} type="image/avif" />
              <img src={avatarWebp} className={styles.avatar} alt={t("aboutPortraitAlt")} width={600} height={600} decoding="async" />
            </picture>
          </div>
          <div className={styles.introCopy}>
            <p className={styles.tagline}>{text(aboutTagline)}</p>
            {intro.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>

        <ul className={styles.stats}>
          {aboutStats.map((stat) => (
            <li key={stat.value.en}>
              <strong>{text(stat.value)}</strong>
              <span>{text(stat.label)}</span>
            </li>
          ))}
        </ul>

        <section className={styles.block} aria-labelledby="about-story">
          <SectionTitle id="about-story" accent={t("aboutStoryAccent")}>
            {` ${t("aboutStoryRest")}`}
          </SectionTitle>
          <ol className={styles.chapters}>
            {aboutChapters.map((chapter) => (
              <li key={chapter.title.en} className={styles.chapter}>
                <span className={styles.period}>{text(chapter.period)}</span>
                <div className={styles.chapterBody}>
                  <h3>{text(chapter.title)}</h3>
                  <p>{text(chapter.text)}</p>
                  {chapter.visual === "automation" ? <AutomationFlow /> : null}
                  {chapter.proof.length > 0 ? (
                    <p className={styles.proof}>
                      <span>{t("aboutProof")}</span>
                      {chapter.proof.map((slug) => {
                        const project = getProjectBySlug(slug);
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
          <SectionTitle id="about-think" accent={t("aboutThinkAccent")}>
            {` ${t("aboutThinkRest")}`}
          </SectionTitle>
          <div className={styles.principles}>
            {aboutPrinciples.map((principle, index) => (
              <article key={principle.title.en} className={styles.principle}>
                <span className={styles.principleNum}>{String(index + 1).padStart(2, "0")}</span>
                <h3>{text(principle.title)}</h3>
                <p>{text(principle.text)}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.block} aria-labelledby="about-tools">
          <SectionTitle id="about-tools" accent={t("aboutToolsAccent")}>
            {` ${t("aboutToolsRest")}`}
          </SectionTitle>
          <p className={styles.toolsIntro}>{text(aboutToolsIntro)}</p>
          <Band band={aboutManagement} text={text} />
          <ol className={styles.stages}>
            {aboutStages.map((stage, index) => (
              <li key={stage.title.en} className={styles.stage}>
                <span className={styles.stageNum}>{String(index + 1).padStart(2, "0")}</span>
                <h3>{text(stage.title)}</h3>
                <ul className={styles.stageTools}>
                  {stage.key.map((item) => (
                    <li key={item} className={styles.toolKey}>
                      {item}
                    </li>
                  ))}
                  {stage.others.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
          <Band band={aboutAi} text={text} />
        </section>

        <section className={styles.block} aria-labelledby="about-education">
          <SectionTitle id="about-education" accent={t("aboutEducationAccent")}>
            {` ${t("aboutEducationRest")}`}
          </SectionTitle>
          <ul className={styles.education}>
            {aboutEducation.map((item) => (
              <li key={item.title.en}>
                <span className={styles.period}>{text(item.period)}</span>
                <div>
                  <strong>{text(item.title)}</strong>
                  <span>{item.place}</span>
                </div>
              </li>
            ))}
          </ul>
          <ul className={styles.languages}>
            {aboutLanguages.map((language) => (
              <li key={language.value.en}>
                <strong>{text(language.value)}</strong>
                <span>{text(language.label)}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.block} aria-labelledby="about-beyond">
          <SectionTitle id="about-beyond" accent={t("aboutBeyondAccent")}>
            {` ${t("aboutBeyondRest")}`}
          </SectionTitle>
          <p className={styles.beyond}>{text(aboutBeyond)}</p>
        </section>

        <section className={styles.closing} aria-labelledby="about-closing">
          <h2 id="about-closing">{t("aboutClosingTitle")}</h2>
          <p>{t("aboutClosingText")}</p>
          <div className={styles.actions}>
            <TransitionLink to="/contact" className={styles.cta}>
              {t("aboutCta")}
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
