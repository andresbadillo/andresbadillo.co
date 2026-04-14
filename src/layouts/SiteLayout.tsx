import { Header } from "@/components/Header/Header";
import { SocialLinksRow } from "@/components/SocialLinksRow/SocialLinksRow";
import clsx from "clsx";
import { type PropsWithChildren, useEffect, useState } from "react";
import styles from "./SiteLayout.module.scss";

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
                © 2026 - Designed and built by <span className={styles.accentName}>Andres Badillo</span>.
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
