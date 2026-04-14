import { Seo } from "@/components/Seo/Seo";
import { StarfieldCanvas } from "@/components/StarfieldCanvas/StarfieldCanvas";
import { CanvasBarsDivider } from "@/components/Dividers/CanvasBarsDivider";
import { SvgWavesDivider } from "@/components/Dividers/SvgWavesDivider";
import { BlogPostCard } from "@/components/cards/BlogPostCard";
import { SocialLinksRow } from "@/components/SocialLinksRow/SocialLinksRow";
import { TransitionLink } from "@/components/TransitionLink/TransitionLink";
import { projects } from "@/data/projects";
import { posts } from "@/data/posts";
import avatarPlaceholder from "@/assets/placeholders/avatar.png";
import { HomeProjectRow } from "@/pages/Home/HomeProjectRow";
import clsx from "clsx";
import {
  type FormEvent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import styles from "./HomePage.module.scss";

export function HomePage() {
  const [formStatus, setFormStatus] = useState("");
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const scrollProgressRef = useRef(0);
  const clusterTargetRef = useRef({ x: 0, y: 0 });
  const motionEnabledRef = useRef(true);

  const heroTrackRef = useRef<HTMLDivElement>(null);
  const heroStickyRef = useRef<HTMLElement>(null);
  const starCanvasRef = useRef<HTMLCanvasElement>(null);
  const avatarWrapRef = useRef<HTMLDivElement>(null);
  const scrollCueRef = useRef<HTMLDivElement>(null);
  const portfolioSentinelRef = useRef<HTMLElement>(null);
  const projectsHeadingRef = useRef<HTMLHeadingElement>(null);
  const blogHeadingRef = useRef<HTMLHeadingElement>(null);
  const contactHeadingRef = useRef<HTMLHeadingElement>(null);
  const introRevealRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      setPrefersReducedMotion(mq.matches);
      motionEnabledRef.current = !mq.matches;
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const syncScrollDrivenUi = useCallback(() => {
    const layer = heroStickyRef.current;
    if (!layer) return;

    const reduced = prefersReducedMotion;

    const revealEl = introRevealRef.current;
    const setIntroPhases = (p1: number, p3: number) => {
      if (!revealEl) return;
      revealEl.style.setProperty("--intro-p1", String(p1));
      revealEl.style.setProperty("--intro-p3", String(p3));
    };

    if (reduced) {
      scrollProgressRef.current = 0;
      setIntroPhases(1, 1);
      const avatarRm = avatarWrapRef.current;
      if (avatarRm) {
        const cr = starCanvasRef.current?.getBoundingClientRect();
        const sr = layer.getBoundingClientRect();
        const base = cr ?? sr;
        const ar = avatarRm.getBoundingClientRect();
        clusterTargetRef.current = {
          x: ar.left + ar.width / 2 - base.left,
          y: ar.top + ar.height / 2 - base.top,
        };
      }
      scrollCueRef.current?.classList.remove(styles.scrollCueHidden);
      return;
    }

    const track = heroTrackRef.current;
    if (!track) return;

    const docY = window.scrollY;
    /* Misma altura que el hero en CSS (lvh): innerHeight en móvil varía con la barra y desincroniza el progreso. */
    const vh = layer.clientHeight > 1 ? layer.clientHeight : window.innerHeight;
    const trackH = track.offsetHeight;
    const trackRect = track.getBoundingClientRect();
    const trackTop = trackRect.top + docY;
    const scrollRange = Math.max(1, trackH - vh);

    const raw = (docY - trackTop) / scrollRange;
    const progress = trackH >= vh * 2 ? Math.min(1, Math.max(0, raw)) : 0;
    scrollProgressRef.current = progress;

    const span = (t: number, start: number, end: number) =>
      Math.min(1, Math.max(0, (t - start) / Math.max(1e-6, end - start)));
    /* Segundo bloque listo ~0,72 del hero para leerlo antes de Selected Portfolio */
    setIntroPhases(span(progress, 0.05, 0.2), span(progress, 0.4, 0.72));

    const avatar = avatarWrapRef.current;
    if (avatar) {
      const cr = starCanvasRef.current?.getBoundingClientRect();
      const sr = layer.getBoundingClientRect();
      const base = cr ?? sr;
      const ar = avatar.getBoundingClientRect();
      clusterTargetRef.current = {
        x: ar.left + ar.width / 2 - base.left,
        y: ar.top + ar.height / 2 - base.top,
      };
    }

    scrollCueRef.current?.classList.toggle(styles.scrollCueHidden, progress >= 0.96);
  }, [prefersReducedMotion]);

  useLayoutEffect(() => {
    syncScrollDrivenUi();
    window.addEventListener("scroll", syncScrollDrivenUi, { passive: true });
    window.addEventListener("resize", syncScrollDrivenUi);
    const ro = new ResizeObserver(syncScrollDrivenUi);
    const track = heroTrackRef.current;
    const layer = heroStickyRef.current;
    const avatarEl = avatarWrapRef.current;
    const introEl = introRevealRef.current;
    if (track) ro.observe(track);
    if (layer) ro.observe(layer);
    if (avatarEl) ro.observe(avatarEl);
    if (introEl) ro.observe(introEl);
    return () => {
      window.removeEventListener("scroll", syncScrollDrivenUi);
      window.removeEventListener("resize", syncScrollDrivenUi);
      ro.disconnect();
    };
  }, [syncScrollDrivenUi]);

  useEffect(() => {
    const target = portfolioSentinelRef.current;
    if (!target || prefersReducedMotion) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.08 && scrollCueRef.current) {
          scrollCueRef.current.classList.add(styles.scrollCueHidden);
        }
      },
      { threshold: [0, 0.08, 0.15] },
    );
    io.observe(target);
    return () => io.disconnect();
  }, [prefersReducedMotion]);

  useEffect(() => {
    const reveal = (el: HTMLHeadingElement | null) => {
      el?.classList.add(styles.sectionTitleAccentRevealed);
    };

    if (prefersReducedMotion) {
      reveal(projectsHeadingRef.current);
      reveal(blogHeadingRef.current);
      reveal(contactHeadingRef.current);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.sectionTitleAccentRevealed);
          } else {
            entry.target.classList.remove(styles.sectionTitleAccentRevealed);
          }
        }
      },
      { threshold: 0.22, rootMargin: "0px 0px -6% 0px" },
    );

    const hProjects = projectsHeadingRef.current;
    const hBlog = blogHeadingRef.current;
    const hContact = contactHeadingRef.current;
    if (hProjects) io.observe(hProjects);
    if (hBlog) io.observe(hBlog);
    if (hContact) io.observe(hContact);
    return () => io.disconnect();
  }, [prefersReducedMotion]);

  const onSubmitHomeContact = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormStatus("Mensaje de prueba registrado. Para envío real, conecta un backend.");
  };

  return (
    <div className={styles.home}>
      <Seo title="Home — Andres Badillo" description="Home de portfolio minimalista con arte generativo." />
      <div
        ref={heroTrackRef}
        className={clsx(styles.heroTrack, prefersReducedMotion && styles.heroTrackReduced)}
      >
        <section
          ref={heroStickyRef}
          className={clsx(styles.hero, prefersReducedMotion ? styles.heroStatic : styles.heroSticky)}
          aria-label="Presentación"
        >
        <StarfieldCanvas
          canvasRef={starCanvasRef}
          scrollProgressRef={scrollProgressRef}
          clusterTargetRef={clusterTargetRef}
          motionEnabledRef={motionEnabledRef}
        />
        <div className={styles.heroMotion}>
          <div className={styles.heroContent}>
            <div ref={avatarWrapRef} className={styles.avatarWrap}>
              <img src={avatarPlaceholder} className={styles.avatar} alt="Retrato de Andrés Badillo" />
            </div>
            <div className={styles.intro}>
              <div className={styles.introText}>
                <h1>
                  <span className={styles.greet}>Hey, I&apos;m</span>{" "}
                  <span className={styles.nameHighlight}>Andrés Badillo</span>
                </h1>
                <div ref={introRevealRef} className={styles.introReveal}>
                  <p className={clsx(styles.bio, styles.bioLine, styles.bioLine1)}>
                    MBA, Product Manager, Project Manager,<br />
                    Data Analyst, Data Science, Frontend Developer.
                  </p>
                  <p className={clsx(styles.bio, styles.bioLine, styles.bioLine3)}>
                    Turning complexity into software, data, and decisions that drive impact.
                  </p>
                </div>
              </div>
              <div className={styles.introSocial}>
                <SocialLinksRow />
              </div>
            </div>
          </div>
        </div>
        {!prefersReducedMotion && (
          <div ref={scrollCueRef} className={styles.scrollCue}>
            <span className={styles.scrollText}>SCROLL</span>
            <svg
              className={styles.scrollLine}
              viewBox="0 0 10 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <line x1="5" y1="0" x2="5" y2="30" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" />
              <path
                d="M 1 30 L 5 38 L 9 30"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </div>
        )}
        </section>
      </div>

      <div className={styles.portfolioBand}>
        <div className={styles.heroPortfolioDivider} aria-hidden="true">
          {/* Detrás de la onda principal: misma amplitud, mitad de frecuencia (2 vs 4 ciclos); borde ~10px más arriba para que se vea la franja */}
          <svg className={styles.heroPortfolioWaveSub} viewBox="0 0 1440 240" preserveAspectRatio="none">
            <path d="M0,110 C240,42 480,42 720,110 C960,178 1200,178 1440,110 L1440,240 L0,240 Z" />
          </svg>
          <svg className={styles.heroPortfolioWave} viewBox="0 0 1440 240" preserveAspectRatio="none">
            <path d="M0,120 C120,52 240,52 360,120 C480,188 600,188 720,120 C840,52 960,52 1080,120 C1200,188 1320,188 1440,120 L1440,240 L0,240 Z" />
          </svg>
        </div>
        <div className="container">
          <section
            ref={portfolioSentinelRef}
            className={styles.section}
            id="selected-portfolio-projects"
            aria-labelledby="home-projects-heading"
          >
            <h2 id="home-projects-heading" ref={projectsHeadingRef} className={styles.sectionTitle}>
              <span className={styles.sectionAccent}>Selected</span>
              Portfolio Projects
            </h2>
            {projects.slice(0, 4).map((project, index) => (
              <HomeProjectRow key={project.slug} project={project} reversed={index % 2 === 0} />
            ))}
            <TransitionLink to="/portfolio" className={styles.seeAllCta}>
              See all
            </TransitionLink>
          </section>
        </div>
      </div>

      <SvgWavesDivider />

      <div className={styles.blogBand}>
        <div className="container">
          <section className={styles.blogSection} aria-labelledby="home-blog-heading">
            <h2 id="home-blog-heading" ref={blogHeadingRef} className={styles.sectionTitle}>
              <span className={styles.sectionAccent}>Selected</span>
              Blog Articles
            </h2>
            <div className={styles.blogGrid}>{posts.slice(0, 6).map((p) => <BlogPostCard key={p.slug} post={p} />)}</div>
            <TransitionLink to="/blog" className={styles.seeAllCta}>
              See all
            </TransitionLink>
          </section>
        </div>
      </div>

      <div className={styles.blogContactDivider} aria-hidden="true">
        <svg className={styles.blogContactWaveSub} viewBox="0 0 1440 240" preserveAspectRatio="none">
          <path d="M0,110 C240,42 480,42 720,110 C960,178 1200,178 1440,110 L1440,240 L0,240 Z" />
        </svg>
        <svg className={styles.blogContactWave} viewBox="0 0 1440 240" preserveAspectRatio="none">
          <path d="M0,120 C120,52 240,52 360,120 C480,188 600,188 720,120 C840,52 960,52 1080,120 C1200,188 1320,188 1440,120 L1440,240 L0,240 Z" />
        </svg>
      </div>

      <div className={styles.contactBand}>
        <div className="container">
          <section className={styles.contactSection} aria-labelledby="home-contact-heading">
            <h2 id="home-contact-heading" ref={contactHeadingRef} className={styles.sectionTitle}>
              <span className={styles.sectionAccent}>Contact</span>
            </h2>
            <p className={styles.contactLead}>
              Feel free to contact me at <strong>r.andres.badillo@gmail.com</strong> or drop me a message using the contact form below:
            </p>
            <form className={styles.form} onSubmit={onSubmitHomeContact}>
              <div className={styles.row2}>
                <div className={styles.field}>
                  <label className={styles.srOnly} htmlFor="home-contact-name">
                    Name
                  </label>
                  <input
                    id="home-contact-name"
                    name="name"
                    className={styles.input}
                    autoComplete="name"
                    placeholder="Name"
                    required
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.srOnly} htmlFor="home-contact-email">
                    Email
                  </label>
                  <input
                    id="home-contact-email"
                    name="email"
                    type="email"
                    className={styles.input}
                    autoComplete="email"
                    placeholder="Email"
                    required
                  />
                </div>
              </div>
              <div className={styles.field}>
                <label className={styles.srOnly} htmlFor="home-contact-message">
                  Message
                </label>
                <textarea
                  id="home-contact-message"
                  name="message"
                  className={styles.textarea}
                  rows={6}
                  placeholder="Message"
                  required
                />
              </div>
              <button type="submit" className={styles.send}>
                Send
              </button>
            </form>
            <p role="status" aria-live="polite" className={styles.formNote}>
              {formStatus}
            </p>
          </section>
        </div>
      </div>
      <CanvasBarsDivider topBackground="var(--bg)" bottomBackground="var(--home-hero-bg)" />
    </div>
  );
}
