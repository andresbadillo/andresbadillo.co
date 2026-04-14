import { Header } from "@/components/Header/Header";
import { SocialLinksRow } from "@/components/SocialLinksRow/SocialLinksRow";
import type { PropsWithChildren } from "react";
import styles from "./SiteLayout.module.scss";

interface SiteLayoutProps {
  theme: "dark" | "light";
  onThemeChange: (next: "dark" | "light") => void;
}

export function SiteLayout({ theme, onThemeChange, children }: PropsWithChildren<SiteLayoutProps>) {
  return (
    <>
      <Header theme={theme} onThemeChange={onThemeChange} />
      <main id="main-content" className={styles.main}>
        {children}
      </main>
      <footer className={styles.footer}>
        <div className="container">
          <div className={styles.footerSocial}>
            <SocialLinksRow />
          </div>
          <p>
            © 2026 - Designed and built by <span className={styles.accentName}>Andres Badillo</span>. 
          </p>
        </div>
      </footer>
    </>
  );
}
