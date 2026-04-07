import { socialLinks } from "@/data/site";
import styles from "./SocialLinksRow.module.scss";

function IconFor({ label }: { label: string }) {
  const common = { className: styles.icon, viewBox: "0 0 24 24", fill: "currentColor" as const };
  switch (label) {
    case "GitHub":
      return (
        <svg {...common} aria-hidden="true">
          <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.52 2.87 8.35 6.84 9.71.5.1.68-.22.68-.48 0-.24-.01-.87-.01-1.7-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.1-1.5-1.1-1.5-.9-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.89 1.56 2.34 1.11 2.91.85.09-.67.35-1.11.63-1.37-2.22-.26-4.55-1.14-4.55-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.27 2.75 1.05A9.36 9.36 0 0 1 12 6.82c.85.004 1.71.12 2.51.35 1.9-1.32 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.8-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.8 0 .27.18.59.69.49A10.01 10.01 0 0 0 22 12.26C22 6.58 17.52 2 12 2z" />
        </svg>
      );
    case "LinkedIn":
      return (
        <svg {...common} aria-hidden="true">
          <path d="M6.94 9.63v10.36H3.55V9.63h3.39zm11.05 0c3 0 4.4 1.98 4.4 4.56v5.8h-3.39v-5.14c0-1.22-.44-2.05-1.53-2.05-.83 0-1.32.56-1.54 1.1-.08.2-.1.48-.1.76v5.33h-3.39s.04-8.65 0-9.54h3.39v1.35l.02.03h-.02v-.03c.45-.7 1.26-1.7 3.07-1.7zM6.75 5.5A2 2 0 1 1 6.75 9a2 2 0 0 1 0-3.5z" />
        </svg>
      );
    case "Medium":
      return (
        <svg {...common} aria-hidden="true">
          <path d="M4.2 7.4c0-.4.32-.78.88-.86l4.88-.7v7.1l-4.4-2.5a1.06 1.06 0 0 1-.6-.95V7.4zm6.22-.86 6.58-.95a.55.55 0 0 1 .6.57v10.68L10.42 16V6.54zm6.6-.08L20.9 6v9.9l-3.88 1.12V6.46z" />
        </svg>
      );
    case "X":
      return (
        <svg {...common} aria-hidden="true">
          <path d="M16.24 3h2.74l-6 6.85L20 21h-6.13l-4.8-6.26L6.63 21H3.88l6.42-7.33L4 3h6.27l4.35 5.77L16.24 3zm-.96 16.13h1.52L8.87 4.82H7.25l7.03 14.31z" />
        </svg>
      );
    case "Instagram":
      return (
        <svg {...common} aria-hidden="true">
          <path d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zm10 1.8H7A2.2 2.2 0 0 0 4.8 7v10A2.2 2.2 0 0 0 7 19.2h10a2.2 2.2 0 0 0 2.2-2.2V7A2.2 2.2 0 0 0 17 4.8zM12 7.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9zm0 1.8a2.7 2.7 0 1 0 0 5.4 2.7 2.7 0 0 0 0-5.4zm4.65-3.05a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
        </svg>
      );
    case "YouTube":
      return (
        <svg {...common} aria-hidden="true">
          <path d="M21.8 8.2s-.2-1.6-.8-2.2c-.8-.9-1.7-.9-2.1-1-2.4-.2-6-.2-6-.2s-3.6 0-6 .2c-.4 0-1.3 0-2.1 1-.6.6-.8 2.2-.8 2.2S4 10.1 4 12.1v1.8c0 2 .2 3.9.2 3.9s.2 1.6.8 2.2c.8.9 1.9.87 2.4.96 1.8.17 7.6.2 7.6.2s3.6 0 6-.3c.4 0 1.3 0 2.1-1 .6-.6.8-2.2.8-2.2s.2-1.9.2-3.9v-1.8c0-2-.2-3.9-.2-3.9zM10 14.9V9.6l5.2 2.7-5.2 2.6z" />
        </svg>
      );
    default:
      return (
        <svg {...common} aria-hidden="true">
          <circle cx="12" cy="12" r="4" />
        </svg>
      );
  }
}

export function SocialLinksRow() {
  return (
    <ul className={styles.row}>
      {socialLinks.map((s) => (
        <li key={s.label}>
          <a className={styles.link} href={s.href} target="_blank" rel="noreferrer" aria-label={s.label}>
            <IconFor label={s.label} />
          </a>
        </li>
      ))}
    </ul>
  );
}
