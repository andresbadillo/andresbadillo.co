import { Header } from "@/components/Header/Header";
import { SocialLinksRow } from "@/components/SocialLinksRow/SocialLinksRow";
import clsx from "clsx";
import { type PropsWithChildren, useEffect, useRef, useState } from "react";
import styles from "./SiteLayout.module.scss";

const FOOTER_ATTRIBUTION_NAME = "Andres Badillo";
const FOOTER_TYPE_STEP_MS = 28;

function FooterAttributionName() {
  const wrapRef = useRef<HTMLSpanElement>(null);
  const [typed, setTyped] = useState("");
  const [complete, setComplete] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  const typingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const typingActiveRef = useRef(false);
  const animationFinishedRef = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;

    const el = wrapRef.current;
    if (!el) return;

    const clearIntervalSafe = () => {
      if (typingIntervalRef.current !== null) {
        clearInterval(typingIntervalRef.current);
        typingIntervalRef.current = null;
      }
    };

    const startTyping = () => {
      clearIntervalSafe();
      typingActiveRef.current = true;
      animationFinishedRef.current = false;
      setComplete(false);
      setTyped("");
      let i = 0;
      const step = () => {
        i += 1;
        setTyped(FOOTER_ATTRIBUTION_NAME.slice(0, i));
        if (i >= FOOTER_ATTRIBUTION_NAME.length) {
          setComplete(true);
          clearIntervalSafe();
          typingActiveRef.current = false;
          animationFinishedRef.current = true;
        }
      };
      step();
      typingIntervalRef.current = setInterval(step, FOOTER_TYPE_STEP_MS);
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) {
            clearIntervalSafe();
            typingActiveRef.current = false;
            animationFinishedRef.current = false;
            setTyped("");
            setComplete(false);
            continue;
          }
          if (typingActiveRef.current || animationFinishedRef.current) continue;
          startTyping();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px 8% 0px" },
    );

    io.observe(el);
    return () => {
      clearIntervalSafe();
      io.disconnect();
    };
  }, [reducedMotion]);

  if (reducedMotion) {
    return <span className={styles.accentName}>{FOOTER_ATTRIBUTION_NAME}</span>;
  }

  return (
    <span ref={wrapRef} className={styles.accentName}>
      <span className={styles.srOnly}>{FOOTER_ATTRIBUTION_NAME}</span>
      <span className={styles.accentNameType} aria-hidden="true">
        {typed}
        <span
          className={clsx(
            styles.typeCursor,
            (typed.length > 0 || complete) && styles.typeCursorVisible,
            complete && styles.typeCursorBlink,
          )}
        />
      </span>
    </span>
  );
}

interface SiteLayoutProps {
  theme: "dark" | "light";
  onThemeChange: (next: "dark" | "light") => void;
}

export function SiteLayout({ theme, onThemeChange, children }: PropsWithChildren<SiteLayoutProps>) {
  const [backToTopVisible, setBackToTopVisible] = useState(false);

  useEffect(() => {
    const nearBottomPx = 80;
    const update = () => {
      const doc = document.documentElement;
      const y = window.scrollY + window.innerHeight;
      setBackToTopVisible(y >= doc.scrollHeight - nearBottomPx);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const scrollToTop = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <>
      <Header theme={theme} onThemeChange={onThemeChange} />
      <main id="main-content" className={styles.main}>
        {children}
      </main>
      <footer className={styles.footer}>
        <div className="container">
          <div className={styles.footerRow}>
            <div className={styles.footerMain}>
              <div className={styles.footerSocial}>
                <SocialLinksRow />
              </div>
              <p>
                © 2026 - Designed and built by <FooterAttributionName />
              </p>
            </div>
            <button
              type="button"
              className={clsx(styles.backToTop, backToTopVisible && styles.backToTopVisible)}
              onClick={scrollToTop}
              aria-label="Volver arriba"
            >
              <svg
                className={styles.backToTopIcon}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M12 19V5M6 11l6-6 6 6"
                  stroke="currentColor"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            </button>
          </div>
        </div>
      </footer>
    </>
  );
}
