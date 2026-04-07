import clsx from "clsx";
import { useState } from "react";
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

export function Header({ theme, onThemeChange }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <header className={styles.header}>
      <div className={clsx("container", styles.inner)}>
        <TransitionLink to="/" className={styles.logo} ariaLabel="Ir al inicio">
          <span className={styles.logoDot}>.</span>
          <span className={styles.logoText}>{siteBrandShort}</span>
          <span className={styles.logoDot}>.</span>
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
            onClick={() => setOpen((prev) => !prev)}
          >
            Menu
          </button>
          <ThemeToggle theme={theme} onThemeChange={onThemeChange} />
        </div>
      </div>
    </header>
  );
}
