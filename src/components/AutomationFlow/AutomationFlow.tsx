import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import styles from "./AutomationFlow.module.scss";

/**
 * Animación del capítulo "Where Excel became software": tres archivos desordenados entran a un nodo de
 * automatización y salen como un solo resultado limpio. Es SVG con CSS (solo transform y opacity), sin
 * librerías ni bucle de JavaScript. Corre únicamente mientras está en pantalla y con la pestaña visible;
 * con prefers-reduced-motion se muestra el estado final, quieto.
 */
export function AutomationFlow() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.25 });
    observer.observe(root);
    const onVisibility = () => setTabVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className={clsx(styles.root, !(inView && tabVisible) && styles.paused)}
      role="img"
      aria-label="Three messy spreadsheet files flow into an automation step and come out as one clean dashboard."
    >
      {/* Horizontal: pantallas anchas. */}
      <svg className={styles.wide} viewBox="0 0 680 220" aria-hidden="true" focusable="false">
        <g transform="rotate(-3 95 47)">
          <rect className={styles.file} x="20" y="30" width="150" height="34" rx="6" />
          <text x="34" y="52">Excel v3_final</text>
        </g>
        <g transform="rotate(2 95 97)">
          <rect className={styles.file} x="20" y="80" width="150" height="34" rx="6" />
          <text x="34" y="102">Excel v3_final_2</text>
        </g>
        <g transform="rotate(-2 95 147)">
          <rect className={styles.file} x="20" y="130" width="150" height="34" rx="6" />
          <text x="34" y="152">CSV export (copy)</text>
        </g>
        <path className={styles.line} d="M175 47 L275 100 M175 97 L275 100 M175 147 L275 100" />
        <circle className={clsx(styles.dot, styles.inWide)} cx="180" cy="47" r="5" style={{ ["--dy" as string]: "53px", animationDelay: "0s" }} />
        <circle className={clsx(styles.dot, styles.inWide)} cx="180" cy="97" r="5" style={{ ["--dy" as string]: "3px", animationDelay: "0.3s" }} />
        <circle className={clsx(styles.dot, styles.inWide)} cx="180" cy="147" r="5" style={{ ["--dy" as string]: "-47px", animationDelay: "0.6s" }} />
        <g className={styles.node}>
          <rect className={styles.nodeBox} x="275" y="70" width="160" height="60" rx="12" />
          <text className={styles.strong} x="355" y="96" textAnchor="middle">Automation</text>
          <text x="355" y="115" textAnchor="middle">Python · Power Platform</text>
        </g>
        <path className={styles.line} d="M440 100 L530 100" />
        <circle className={clsx(styles.dot, styles.outWide)} cx="440" cy="100" r="5" />
        <rect className={styles.file} x="530" y="40" width="130" height="120" rx="12" />
        <g>
          <rect className={clsx(styles.bar)} x="550" y="110" width="16" height="30" rx="3" style={{ animationDelay: "0s" }} />
          <rect className={clsx(styles.bar)} x="576" y="95" width="16" height="45" rx="3" style={{ animationDelay: "0.1s" }} />
          <rect className={clsx(styles.bar)} x="602" y="80" width="16" height="60" rx="3" style={{ animationDelay: "0.2s" }} />
          <rect className={clsx(styles.bar)} x="628" y="62" width="16" height="78" rx="3" style={{ animationDelay: "0.3s" }} />
        </g>
        <path className={styles.check} d="M632 50 l4 4 l8 -9" />
        <text x="20" y="200">Manual: copy, paste, reconcile</text>
        <text x="530" y="200">Automated: one clean output</text>
      </svg>

      {/* Vertical: móvil, para que el texto no se encoja. */}
      <svg className={styles.tall} viewBox="0 0 300 420" aria-hidden="true" focusable="false">
        <g transform="rotate(-3 50 25)">
          <rect className={styles.file} x="6" y="8" width="88" height="34" rx="6" />
          <text x="14" y="30">v3_final</text>
        </g>
        <g transform="rotate(2 150 25)">
          <rect className={styles.file} x="106" y="8" width="88" height="34" rx="6" />
          <text x="114" y="30">v3_final_2</text>
        </g>
        <g transform="rotate(-2 250 25)">
          <rect className={styles.file} x="206" y="8" width="88" height="34" rx="6" />
          <text x="214" y="30">export.csv</text>
        </g>
        <path className={styles.line} d="M50 48 L150 150 M150 48 L150 150 M250 48 L150 150" />
        <circle className={clsx(styles.dot, styles.inTall)} cx="50" cy="50" r="5" style={{ ["--dx" as string]: "100px", animationDelay: "0s" }} />
        <circle className={clsx(styles.dot, styles.inTall)} cx="150" cy="50" r="5" style={{ ["--dx" as string]: "0px", animationDelay: "0.3s" }} />
        <circle className={clsx(styles.dot, styles.inTall)} cx="250" cy="50" r="5" style={{ ["--dx" as string]: "-100px", animationDelay: "0.6s" }} />
        <g className={styles.node}>
          <rect className={styles.nodeBox} x="70" y="150" width="160" height="60" rx="12" />
          <text className={styles.strong} x="150" y="176" textAnchor="middle">Automation</text>
          <text x="150" y="195" textAnchor="middle">Python · Power Platform</text>
        </g>
        <path className={styles.line} d="M150 215 L150 270" />
        <circle className={clsx(styles.dot, styles.outTall)} cx="150" cy="215" r="5" />
        <rect className={styles.file} x="85" y="275" width="130" height="120" rx="12" />
        <g>
          <rect className={styles.bar} x="105" y="345" width="16" height="30" rx="3" style={{ animationDelay: "0s" }} />
          <rect className={styles.bar} x="131" y="330" width="16" height="45" rx="3" style={{ animationDelay: "0.1s" }} />
          <rect className={styles.bar} x="157" y="315" width="16" height="60" rx="3" style={{ animationDelay: "0.2s" }} />
          <rect className={styles.bar} x="183" y="297" width="16" height="78" rx="3" style={{ animationDelay: "0.3s" }} />
        </g>
        <path className={styles.check} d="M187 285 l4 4 l8 -9" />
      </svg>
    </div>
  );
}
