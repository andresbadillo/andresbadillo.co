import {
  useCallback,
  useEffect,
  useRef,
  type MutableRefObject,
  type Ref,
  type RefCallback,
} from "react";
import styles from "./StarfieldCanvas.module.scss";

function assignRef<T>(r: Ref<T | null> | undefined, value: T | null) {
  if (!r) return;
  if (typeof r === "function") (r as (instance: T | null) => void)(value);
  else (r as MutableRefObject<T | null>).current = value;
}

/**
 * Estrellas en pantalla: revuelo independiente.
 * Progreso de scroll alto → nube hacia el avatar; al bajar el progreso (scroll hacia arriba)
 * vuelven a tender hacia sus anclas dispersas en el viewport.
 */

type Star = {
  sx: number;
  sy: number;
  /** Posición de “reposo” dispersa; hacia aquí se tira cuando el scroll vuelve arriba. */
  anchorX: number;
  anchorY: number;
  vx: number;
  vy: number;
  depth: number;
  vDepth: number;
  jx: number;
  jy: number;
  wanderCountdown: number;
  offX: number;
  offY: number;
  mode: "cluster" | "field";
};

const STAR_COUNT = 1200;

const STAR_RADIUS_MIN = 0.14;
const STAR_RADIUS_MAX = 1.72;

const DEPTH_LO = 0;
const DEPTH_HI = 1;

const STAR_SPEED = 0.4;

/** Fracción que permanece repartida por la pantalla (no colapsa hacia el avatar). */
const FIELD_FRACTION = 0.24;

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function smoothstep(t: number) {
  const x = Math.min(1, Math.max(0, t));
  return x * x * (3 - 2 * x);
}

function rollWander(s: Star) {
  const a = Math.random() * Math.PI * 2;
  const mag = 0.38 + Math.random() * 1.35;
  s.vx = Math.cos(a) * mag;
  s.vy = Math.sin(a) * mag;
  s.vDepth = (Math.random() - 0.5) * 1.05;
  s.wanderCountdown = 22 + Math.floor(Math.random() * 88);
}

function makeStars(w: number, h: number): Star[] {
  const stars: Star[] = [];
  for (let i = 0; i < STAR_COUNT; i++) {
    const mode: Star["mode"] = Math.random() < FIELD_FRACTION ? "field" : "cluster";
    let offX: number;
    let offY: number;
    if (mode === "field") {
      offX = (Math.random() - 0.5) * w * 0.98;
      offY = (Math.random() - 0.5) * h * 0.94;
    } else {
      /* Elipse en px respecto al centro del avatar: ancho ~viewport para que al agrupar no quede la mitad derecha vacía. */
      const theta = Math.random() * Math.PI * 2;
      const rr = 0.12 + Math.random() * 0.88;
      offX = Math.cos(theta) * rr * w * 0.48;
      offY = Math.sin(theta) * rr * h * 0.4;
    }
    const sx0 = Math.random() * w;
    const sy0 = Math.random() * h;
    const s: Star = {
      sx: sx0,
      sy: sy0,
      anchorX: sx0,
      anchorY: sy0,
      vx: 0,
      vy: 0,
      depth: Math.random(),
      vDepth: (Math.random() - 0.5) * 0.65,
      jx: 0,
      jy: 0,
      wanderCountdown: 0,
      offX,
      offY,
      mode,
    };
    rollWander(s);
    stars.push(s);
  }
  return stars;
}

function radiusFromDepth(depth: number) {
  const t = Math.max(DEPTH_LO, Math.min(DEPTH_HI, depth));
  return STAR_RADIUS_MIN + t * (STAR_RADIUS_MAX - STAR_RADIUS_MIN);
}

function wrapStar(s: Star, w: number, h: number, pad: number) {
  if (s.sx < -pad) s.sx += w + pad * 2;
  if (s.sx > w + pad) s.sx -= w + pad * 2;
  if (s.sy < -pad) s.sy += h + pad * 2;
  if (s.sy > h + pad) s.sy -= h + pad * 2;
}

function readStarfieldPalette(): { bg: string; starRgb: string } {
  if (typeof document === "undefined") {
    return { bg: "#000000", starRgb: "242, 244, 255" };
  }
  const cs = getComputedStyle(document.documentElement);
  const bg = cs.getPropertyValue("--home-hero-bg").trim() || "#000000";
  const starRgb = cs.getPropertyValue("--starfield-rgb").trim() || "242, 244, 255";
  return { bg, starRgb };
}

export type ClusterTargetRef = MutableRefObject<{ x: number; y: number }>;

interface StarfieldCanvasProps {
  className?: string;
  scrollProgressRef: MutableRefObject<number>;
  clusterTargetRef: ClusterTargetRef;
  motionEnabledRef: MutableRefObject<boolean>;
  canvasRef?: Ref<HTMLCanvasElement | null>;
}

export function StarfieldCanvas({
  className,
  scrollProgressRef,
  clusterTargetRef,
  motionEnabledRef,
  canvasRef,
}: StarfieldCanvasProps) {
  const innerRef = useRef<HTMLCanvasElement | null>(null);
  const setCanvasRef: RefCallback<HTMLCanvasElement> = useCallback(
    (el) => {
      innerRef.current = el;
      assignRef(canvasRef, el);
    },
    [canvasRef],
  );
  const starsRef = useRef<Star[]>([]);
  const frameRef = useRef<number>(0);
  const pointerRef = useRef({ nx: 0, ny: 0 });
  const lastTimeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = innerRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    const reducedMotion = prefersReducedMotion();
    let widthCss = 0;
    let heightCss = 0;

    const onPointerMove = (event: PointerEvent) => {
      const rect = parent.getBoundingClientRect();
      const nx = (event.clientX - rect.left) / rect.width - 0.5;
      const ny = (event.clientY - rect.top) / rect.height - 0.5;
      pointerRef.current = {
        nx: Number.isFinite(nx) ? Math.max(-1, Math.min(1, nx)) : 0,
        ny: Number.isFinite(ny) ? Math.max(-1, Math.min(1, ny)) : 0,
      };
    };

    const drawStatic = () => {
      const w = widthCss;
      const h = heightCss;
      if (w < 2 || h < 2) return;
      const { bg, starRgb } = readStarfieldPalette();
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);
      const stars = starsRef.current;
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        const px = s.sx;
        const py = s.sy;
        const depth = Math.max(DEPTH_LO, Math.min(DEPTH_HI, s.depth));
        const alpha = 0.13 + depth * 0.75;
        const radius = radiusFromDepth(s.depth);
        if (px < -6 || py < -6 || px > w + 6 || py > h + 6) continue;
        ctx.fillStyle = `rgba(${starRgb},${alpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(px, py, radius, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const loop = (now: number) => {
      const w = widthCss;
      const h = heightCss;
      if (w < 2 || h < 2) {
        frameRef.current = requestAnimationFrame(loop);
        return;
      }

      const dt = Math.min(40, now - lastTimeRef.current);
      lastTimeRef.current = now;

      const allowMotion = motionEnabledRef.current && !reducedMotion;
      const pRaw = allowMotion ? scrollProgressRef.current : 0;
      const p = smoothstep(pRaw);
      const { nx, ny } = pointerRef.current;
      const parallaxX = nx * 32 * STAR_SPEED * (allowMotion ? 1 : 0);
      const parallaxY = ny * 22 * STAR_SPEED * (allowMotion ? 1 : 0);

      const tx = clusterTargetRef.current.x;
      const ty = clusterTargetRef.current.y;
      const pull = smoothstep(p * 1.02);
      const pullLerpCore = 0.012 + pull * pull * 0.26;
      const clusterTight = 0.34 + pull * pull * 0.54;
      /* 0 → ancla dispersa; 1 → nube en el avatar (reversible al subir scroll). */
      const clusterWeight = smoothstep((p - 0.1) / 0.82);
      /* Scroll arriba → tamaño original; scroll abajo → hasta 50 % del radio (junto al movimiento existente). */
      const starSizeMul = 1 - 0.8 * p;

      const { bg: skyBg, starRgb } = readStarfieldPalette();
      ctx.fillStyle = skyBg;
      ctx.fillRect(0, 0, w, h);

      const stars = starsRef.current;
      const jitterAmp = allowMotion ? 0.55 * STAR_SPEED * (1 - p) * (1 - p) : 0;
      const posStep = ((STAR_SPEED * dt) / 16) * 1.28;
      const depthStep = ((STAR_SPEED * dt) / 16) * 0.42;
      const pad = Math.max(w, h) * 0.12;

      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];

        if (allowMotion) {
          s.wanderCountdown -= 1;
          if (s.wanderCountdown <= 0) {
            rollWander(s);
          } else if (Math.random() < 0.012 * (dt / 16)) {
            const da = (Math.random() - 0.5) * 0.9;
            const ca = Math.cos(da);
            const sa = Math.sin(da);
            const nvx = s.vx * ca - s.vy * sa;
            const nvy = s.vx * sa + s.vy * ca;
            s.vx = nvx;
            s.vy = nvy;
          }
          if (Math.random() < 0.008 * (dt / 16)) {
            s.vDepth += (Math.random() - 0.5) * 0.35;
            s.vDepth = Math.max(-1.15, Math.min(1.15, s.vDepth));
          }

          s.sx += s.vx * posStep;
          s.sy += s.vy * posStep;

          const wx = s.mode === "cluster" ? clusterWeight : clusterWeight * 0.26;
          const tcxCloud = tx + s.offX * clusterTight;
          const tcyCloud = ty + s.offY * clusterTight;
          const tcx = s.anchorX * (1 - wx) + tcxCloud * wx;
          const tcy = s.anchorY * (1 - wx) + tcyCloud * wx;
          const kBlend = 0.034 + wx * wx * 0.052;
          s.sx += (tcx - s.sx) * kBlend;
          s.sy += (tcy - s.sy) * kBlend;

          s.depth += s.vDepth * depthStep;
          if (s.depth <= DEPTH_LO) {
            s.depth = DEPTH_LO;
            s.vDepth = Math.abs(s.vDepth) * 0.35 + Math.random() * 0.4;
          } else if (s.depth >= DEPTH_HI) {
            s.depth = DEPTH_HI;
            s.vDepth = -(Math.abs(s.vDepth) * 0.35 + Math.random() * 0.4);
          }

          wrapStar(s, w, h, pad);
        }

        if (jitterAmp > 0.01) {
          const j = jitterAmp * 0.5 * (dt / 16);
          s.jx += (Math.random() - 0.5) * j;
          s.jy += (Math.random() - 0.5) * j;
        }
        s.jx *= 0.93;
        s.jy *= 0.93;

        let px = s.sx + s.jx;
        let py = s.sy + s.jy;

        px += parallaxX * 0.22;
        py += parallaxY * 0.22;

        if (allowMotion && clusterWeight > 0.04) {
          const wxD = s.mode === "cluster" ? clusterWeight : clusterWeight * 0.24;
          const tcxD = s.anchorX * (1 - wxD) + (tx + s.offX * clusterTight) * wxD;
          const tcyD = s.anchorY * (1 - wxD) + (ty + s.offY * clusterTight) * wxD;
          const pl = pullLerpCore * (0.28 + 0.72 * wxD);
          px += (tcxD - px) * pl;
          py += (tcyD - py) * pl;
        }

        const depthVis = Math.max(DEPTH_LO, Math.min(DEPTH_HI, s.depth));
        let alpha = 0.11 + depthVis * 0.76 + pull * (s.mode === "field" ? 0.04 : 0.09);
        const radius = (radiusFromDepth(s.depth) + pull * (s.mode === "field" ? 0.12 : 0.28)) * starSizeMul;
        alpha = Math.min(1, alpha);

        if (px < -10 || py < -10 || px > w + 10 || py > h + 10) continue;

        ctx.fillStyle = `rgba(${starRgb},${alpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(px, py, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      frameRef.current = requestAnimationFrame(loop);
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      widthCss = parent.clientWidth;
      heightCss = parent.clientHeight;
      canvas.width = Math.floor(widthCss * dpr);
      canvas.height = Math.floor(heightCss * dpr);
      canvas.style.width = `${widthCss}px`;
      canvas.style.height = `${heightCss}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      starsRef.current = makeStars(widthCss, heightCss);
      lastTimeRef.current = performance.now();
      if (reducedMotion) drawStatic();
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(parent);
    parent.addEventListener("pointermove", onPointerMove);

    const themeMo = new MutationObserver(() => {
      if (reducedMotion) drawStatic();
    });
    themeMo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    if (!reducedMotion) {
      lastTimeRef.current = performance.now();
      frameRef.current = requestAnimationFrame(loop);
    }

    return () => {
      ro.disconnect();
      themeMo.disconnect();
      parent.removeEventListener("pointermove", onPointerMove);
      cancelAnimationFrame(frameRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- refs del padre estables; un solo ciclo de vida del canvas
  }, []);

  return <canvas ref={setCanvasRef} className={`${styles.canvas} ${className ?? ""}`.trim()} aria-hidden="true" />;
}
