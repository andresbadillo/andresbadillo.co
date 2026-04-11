import { useEffect, useRef } from "react";
import styles from "./CanvasBarsDivider.module.scss";

/** Altura máxima de una barra: 15 + sin*12 + lift, con lift ≤ 26 → 53px */
const BAR_MAX_PX = 53;

export function CanvasBarsDivider() {
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
      canvas.width = canvas.clientWidth * window.devicePixelRatio;
      canvas.height = canvas.clientHeight * window.devicePixelRatio;
      ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
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
        ctx.fillRect(x, canvas.clientHeight - h, barWidth - 1, h);
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
    <div className={styles.wrap}>
      <canvas
        ref={canvasRef}
        className={styles.canvas}
        onMouseMove={(e) => (mouseX.current = e.nativeEvent.offsetX)}
        onMouseLeave={() => (mouseX.current = -999)}
        aria-hidden="true"
        height={BAR_MAX_PX}
      />
    </div>
  );
}
