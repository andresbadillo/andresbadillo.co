import { type CSSProperties, useEffect, useRef } from "react";
import styles from "./CanvasBarsDivider.module.scss";

/** Altura máxima de una barra: 15 + sin*12 + lift, con lift ≤ 26 → 53px */
const BAR_MAX_PX = 53;
const DIVIDER_HEIGHT_PX = BAR_MAX_PX * 2;

interface CanvasBarsDividerProps {
  topBackground?: string;
  bottomBackground?: string;
}

export function CanvasBarsDivider({
  topBackground = "var(--home-hero-bg)",
  bottomBackground = "var(--bg)",
}: CanvasBarsDividerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseX = useRef<number>(-999);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    let t = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio;
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      t += 0.03;
      ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
      const bars = 80;
      const barWidth = canvas.clientWidth / bars;
      for (let i = 0; i < bars; i++) {
        const x = i * barWidth;
        const dist = Math.abs(mouseX.current - x) / canvas.clientWidth;
        const lift = Math.max(0, 1 - dist * 4) * 26;
        const h = 15 + Math.sin(t + i * 0.2) * 12 + lift;
        ctx.fillStyle = "rgba(242,163,107,0.35)";
        ctx.fillRect(x, BAR_MAX_PX - h, barWidth - 1, h);
        ctx.fillRect(x, BAR_MAX_PX, barWidth - 1, h);
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div
      className={styles.wrap}
      style={
        {
          "--canvas-top-bg": topBackground,
          "--canvas-bottom-bg": bottomBackground,
        } as CSSProperties
      }
    >
      <canvas
        ref={canvasRef}
        className={styles.canvas}
        onMouseMove={(e) => (mouseX.current = e.nativeEvent.offsetX)}
        onMouseLeave={() => (mouseX.current = -999)}
        aria-hidden="true"
        height={DIVIDER_HEIGHT_PX}
      />
    </div>
  );
}
