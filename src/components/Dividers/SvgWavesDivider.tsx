import styles from "./SvgWavesDivider.module.scss";

/**
 * Transición portfolio (--bg) → blog (--home-hero-bg): misma geometría que heroPortfolioDivider
 * (escala viewBox 1200×140), doble capa animada; colores adaptados al sentido del gradiente.
 */
export function SvgWavesDivider() {
  return (
    <div className={styles.wrap} aria-hidden="true">
      <svg className={styles.waveSub} viewBox="0 0 1200 140" preserveAspectRatio="none">
        <path d="M0,64.17 C200,24.5 400,24.5 600,64.17 C800,103.83 1000,103.83 1200,64.17 L1200,140 L0,140 Z" />
      </svg>
      <svg className={styles.waveMain} viewBox="0 0 1200 140" preserveAspectRatio="none">
        <path d="M0,70 C100,30.33 200,30.33 300,70 C400,109.67 500,109.67 600,70 C700,30.33 800,30.33 900,70 C1000,109.67 1100,109.67 1200,70 L1200,140 L0,140 Z" />
      </svg>
    </div>
  );
}
