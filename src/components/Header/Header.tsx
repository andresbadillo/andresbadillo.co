import clsx from "clsx";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { navItems, siteBrandShort } from "@/data/site";
import { ThemeToggle } from "@/components/ThemeToggle/ThemeToggle";
import { TransitionLink } from "@/components/TransitionLink/TransitionLink";
import styles from "./Header.module.scss";

function isNavActive(pathname: string, to: string) {
  if (to === "/") return pathname === "/";
  return pathname === to || pathname.startsWith(`${to}/`);
}

interface HeaderProps {
  theme: "dark" | "light";
  onThemeChange: (next: "dark" | "light") => void;
}

const SCROLL_TOP_SHOW = 28;
const SCROLL_MIN_HIDE = 44;

export function Header({ theme, onThemeChange }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);
  const location = useLocation();

  useEffect(() => {
    let lastY = window.scrollY;
    if (lastY > SCROLL_MIN_HIDE) {
      setHeaderVisible(false);
    }

    const onScroll = () => {
      const y = Math.max(0, window.scrollY);
      const delta = y - lastY;

      if (y <= SCROLL_TOP_SHOW) {
        setHeaderVisible(true);
      } else if (delta > 3 && y > SCROLL_MIN_HIDE) {
        setHeaderVisible(false);
        setOpen(false);
      }

      lastY = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={clsx(styles.header, !headerVisible && styles.headerHidden)}>
      <div className={clsx("container", styles.inner)}>
        <TransitionLink to="/" className={styles.logo} ariaLabel="Ir al inicio">
          <span className={styles.logoDot}>{'<'}</span>
          <span className={styles.logoText}>{siteBrandShort}</span>
          <span className={styles.logoDot}>{'/>'}</span>
        </TransitionLink>
        <nav className={clsx(styles.nav, open && styles.open)} aria-label="Navegación principal">
          {navItems.map((item) => (
            <TransitionLink
              key={item.to}
              to={item.to}
              className={clsx(styles.navLink, isNavActive(location.pathname, item.to) && styles.navActive)}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </TransitionLink>
          ))}
        </nav>
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.menuButton}
            aria-label="Alternar menú móvil"
            aria-expanded={open}
            onClick={() => setOpen((prev) => !prev)}
          >
            <span className={styles.menuButtonBars} aria-hidden="true" />
          </button>
          <ThemeToggle theme={theme} onThemeChange={onThemeChange} />
        </div>
      </div>
    </header>
  );
}
