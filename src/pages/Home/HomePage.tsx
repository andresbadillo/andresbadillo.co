import { Seo } from "@/components/Seo/Seo";
import { StarfieldCanvas } from "@/components/StarfieldCanvas/StarfieldCanvas";
import { CanvasBarsDivider } from "@/components/Dividers/CanvasBarsDivider";
import { SvgWavesDivider } from "@/components/Dividers/SvgWavesDivider";
import { BlogPostCard } from "@/components/cards/BlogPostCard";
import { SocialLinksRow } from "@/components/SocialLinksRow/SocialLinksRow";
import { TransitionLink } from "@/components/TransitionLink/TransitionLink";
import { projects } from "@/data/projects";
import { posts } from "@/data/posts";
import avatarPlaceholder from "@/assets/placeholders/avatar.svg";
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

    if (reduced) {
      scrollProgressRef.current = 0;
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
    const vh = window.innerHeight;
    const trackH = track.offsetHeight;
    const trackRect = track.getBoundingClientRect();
    const trackTop = trackRect.top + docY;
    const scrollRange = Math.max(1, trackH - vh);

    const raw = (docY - trackTop) / scrollRange;
    const progress = trackH >= vh * 2 ? Math.min(1, Math.max(0, raw)) : 0;
    scrollProgressRef.current = progress;

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
    if (track) ro.observe(track);
    if (layer) ro.observe(layer);
    if (avatarEl) ro.observe(avatarEl);
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

  const onSubmitHomeContact = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormStatus("Mensaje de prueba registrado. Para envío real, conecta un backend.");
  };

  return (
    <div className={styles.home}>
      <Seo title="Home — Andres Badillo Demo" description="Home de portfolio minimalista con arte generativo." />
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
              <img src={avatarPlaceholder} className={styles.avatar} alt="Retrato placeholder del autor" />
            </div>
            <div className={styles.intro}>
              <h1>
                <span className={styles.greet}>Hey, I&apos;m</span>{" "}
                <span className={styles.nameHighlight}>Alex Rivera</span>
              </h1>
              <p className={styles.bio}>
                Ingeniero de software full-stack de demostración. Construyo plataformas web claras, datos accesibles y
                interfaces que respiran. Basado en un hub inventado entre dos ciudades ficticias.
              </p>
              <SocialLinksRow />
            </div>
          </div>
        </div>
        {!prefersReducedMotion && (
          <div ref={scrollCueRef} className={styles.scrollCue}>
            <span className={styles.scrollLine} />
            <span className={styles.scrollText}>SCROLL</span>
          </div>
        )}
        </section>
      </div>

      <div className="container">
        <section
          ref={portfolioSentinelRef}
          className={styles.section}
          id="selected-portfolio-projects"
          aria-labelledby="home-projects-heading"
        >
          <h2 id="home-projects-heading" className={styles.sectionTitle}>
            <span className={styles.sectionAccent}>Selected</span>
            Portfolio Projects
          </h2>
          {projects.slice(0, 4).map((project, index) => (
            <HomeProjectRow key={project.slug} project={project} reversed={index % 2 === 0} />
          ))}
          <TransitionLink to="/portfolio" className={styles.seeAll}>
            See all
          </TransitionLink>
        </section>
      </div>

      <SvgWavesDivider />

      <div className="container">
        <section className={styles.blogSection} aria-labelledby="home-blog-heading">
          <h2 id="home-blog-heading" className={styles.sectionTitle}>
            <span className={styles.sectionAccent}>Selected</span>
            Blog Articles
          </h2>
          <div className={styles.blogGrid}>{posts.slice(0, 6).map((p) => <BlogPostCard key={p.slug} post={p} />)}</div>
          <TransitionLink to="/blog" className={styles.seeAll}>
            See all
          </TransitionLink>
        </section>
      </div>

      <CanvasBarsDivider />

      <div className="container">
        <section className={styles.contactSection} aria-labelledby="home-contact-heading">
          <h2 id="home-contact-heading" className={styles.sectionTitle}>
            Contact
          </h2>
          <p className={styles.contactLead}>
            Si quieres comentar un proyecto, escribe a <strong>contacto@demo.dev</strong> o usa el formulario de prueba:
          </p>
          <form className={styles.form} onSubmit={onSubmitHomeContact}>
            <div className={styles.row2}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="home-contact-name">
                  Name
                </label>
                <input id="home-contact-name" name="name" className={styles.input} autoComplete="name" required />
              </div>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="home-contact-email">
                  Email
                </label>
                <input
                  id="home-contact-email"
                  name="email"
                  type="email"
                  className={styles.input}
                  autoComplete="email"
                  required
                />
              </div>
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="home-contact-message">
                Message
              </label>
              <textarea id="home-contact-message" name="message" className={styles.textarea} rows={6} required />
            </div>
            <button type="submit" className={styles.send}>
              Send
            </button>
          </form>
          <p role="status" aria-live="polite" className={styles.formNote}>
            {formStatus}
          </p>
          <p className={styles.formNote}>Para enviar realmente, conecta un backend.</p>
        </section>
      </div>
    </div>
  );
}
