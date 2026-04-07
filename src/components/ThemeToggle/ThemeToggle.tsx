import { useCurtain } from "@/components/CurtainTransition/CurtainTransition";
import styles from "./ThemeToggle.module.scss";

interface ThemeToggleProps {
  theme: "dark" | "light";
  onThemeChange: (next: "dark" | "light") => void;
}

function SunIcon() {
  return (
    <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2 12h2M20 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
      </g>
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z"
      />
    </svg>
  );
}

export function ThemeToggle({ theme, onThemeChange }: ThemeToggleProps) {
  const { startTransition } = useCurtain();
  const next = theme === "dark" ? "light" : "dark";

  const handleClick = () => {
    startTransition(() => onThemeChange(next));
  };

  return (
    <button
      type="button"
      className={styles.button}
      onClick={handleClick}
      aria-label={`Cambiar a tema ${next === "dark" ? "oscuro" : "claro"}`}
    >
      <span className={styles.track}>{theme === "dark" ? <SunIcon /> : <MoonIcon />}</span>
    </button>
  );
}
