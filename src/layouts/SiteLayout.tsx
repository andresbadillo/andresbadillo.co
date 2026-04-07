import { Header } from "@/components/Header/Header";
import { socialLinks } from "@/data/site";
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
          <p>© 2026 Andres Badillo. Demo frontend minimalista.</p>
          <p>
            {socialLinks.map((social) => (
              <a key={social.label} href={social.href} target="_blank" rel="noreferrer" style={{ marginRight: 12 }}>
                {social.label}
              </a>
            ))}
          </p>
        </div>
      </footer>
    </>
  );
}
