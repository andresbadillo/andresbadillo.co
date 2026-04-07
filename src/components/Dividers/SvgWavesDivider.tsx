import styles from "./SvgWavesDivider.module.scss";

export function SvgWavesDivider() {
  return (
    <div className={styles.wrap} aria-hidden="true">
      <svg className={styles.svg} viewBox="0 0 1200 140" preserveAspectRatio="none">
        <path d="M0,70 C150,120 320,10 480,70 C620,130 780,30 920,80 C1020,115 1100,100 1200,80 L1200,140 L0,140 Z" fill="rgba(242,163,107,0.16)" />
        <path d="M0,80 C180,20 300,130 520,70 C690,20 860,125 1040,80 C1110,65 1160,70 1200,75 L1200,140 L0,140 Z" fill="rgba(242,163,107,0.12)" />
        <path d="M0,95 C120,40 280,115 420,92 C600,60 790,120 980,90 C1080,75 1140,95 1200,92 L1200,140 L0,140 Z" fill="rgba(242,163,107,0.09)" />
      </svg>
    </div>
  );
}
