import clsx from "clsx";
import { useEffect, useRef, useState, type CSSProperties } from "react";
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
  const navRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

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

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  /* Menú móvil abierto: foco en el primer enlace, Tab no sale del menú y Escape lo cierra. */
  useEffect(() => {
    if (!open) return;
    const menuButton = menuButtonRef.current;
    const focusables = () => [
      ...(navRef.current?.querySelectorAll<HTMLElement>("a[href]") ?? []),
      ...(menuButton ? [menuButton] : []),
    ];
    focusables()[0]?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        menuButton?.focus();
        return;
      }
      if (event.key !== "Tab") return;
      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (event.shiftKey && (active === first || !items.includes(active as HTMLElement))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (active === last || !items.includes(active as HTMLElement))) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <header className={clsx(styles.header, !headerVisible && styles.headerHidden)}>
      <div className={clsx("container", styles.inner)}>
        <TransitionLink to="/" className={styles.logo} ariaLabel="Ir al inicio">
          <span className={styles.logoDot}>{'<'}</span>
          <span className={styles.logoText}>{siteBrandShort}</span>
          <span className={styles.logoDot}>{'/>'}</span>
        </TransitionLink>
        <nav
          ref={navRef}
          className={clsx(styles.nav, open && styles.open)}
          aria-label="Navegación principal"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div
            className={styles.navMobileInner}
            onClick={(e) => e.stopPropagation()}
          >
            {navItems.map((item, index) => (
              <span
                key={item.to}
                className={styles.navStaggerSlot}
                style={{ "--nav-stagger": index } as CSSProperties}
              >
                <TransitionLink
                  to={item.to}
                  className={clsx(styles.navLink, isNavActive(location.pathname, item.to) && styles.navActive)}
                  ariaCurrent={isNavActive(location.pathname, item.to) ? "page" : undefined}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </TransitionLink>
              </span>
            ))}
          </div>
        </nav>
        <div className={styles.themeSlot}>
          <ThemeToggle theme={theme} onThemeChange={onThemeChange} />
        </div>
        <div className={styles.actions}>
          <button
            ref={menuButtonRef}
            type="button"
            className={clsx(styles.menuButton, open && styles.menuButtonOpen)}
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
            onClick={() => setOpen((prev) => !prev)}
          >
            <span className={styles.menuButtonBars} aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  );
}
