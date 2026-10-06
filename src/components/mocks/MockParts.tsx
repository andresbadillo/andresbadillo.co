import clsx from "clsx";
import { useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import s from "./Mock.module.scss";

const CANVAS_WIDTH = 720;

/**
 * Marco de navegador con lienzo fijo de 720×450 que se escala al ancho disponible.
 * El contenido es decorativo: se anuncia como una sola imagen con `label`.
 */
export function MockFrame({ url, label, children }: { url: string; label: string; children: ReactNode }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number | null>(null);

  useLayoutEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const measure = () => setScale(host.clientWidth / CANVAS_WIDTH);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(host);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={hostRef} className={s.host} role="img" aria-label={label}>
      <div
        className={s.canvas}
        aria-hidden="true"
        style={{ transform: `scale(${scale ?? 1})`, visibility: scale === null ? "hidden" : "visible" }}
      >
        <div className={s.chrome}>
          <span className={s.chromeDot} />
          <span className={s.chromeDot} />
          <span className={s.chromeDot} />
          <span className={s.chromeUrl}>{url}</span>
        </div>
        <div className={s.body}>{children}</div>
      </div>
    </div>
  );
}

export function Side({ brand, items, active, foot }: { brand: string; items: string[]; active: number; foot?: string }) {
  return (
    <div className={s.side}>
      <div className={s.sideBrand}>{brand}</div>
      {items.map((item, index) => (
        <div key={item} className={clsx(s.sideItem, index === active && s.sideItemActive)}>
          {item}
        </div>
      ))}
      {foot ? <div className={s.sideFoot}>{foot}</div> : null}
    </div>
  );
}

export function Main({ children }: { children: ReactNode }) {
  return <div className={s.main}>{children}</div>;
}

export function Title({ children, sub }: { children: ReactNode; sub?: ReactNode }) {
  return (
    <div>
      <div className={s.title}>{children}</div>
      {sub ? <div className={s.sub}>{sub}</div> : null}
    </div>
  );
}

export function Row({ children, gap }: { children: ReactNode; gap?: number }) {
  return (
    <div className={s.row} style={gap === undefined ? undefined : { gap }}>
      {children}
    </div>
  );
}

export function Col({ children, grow, width }: { children: ReactNode; grow?: number; width?: number }) {
  const style: CSSProperties = {};
  if (grow !== undefined) style.flex = grow;
  if (width !== undefined) {
    style.flex = "none";
    style.width = width;
  }
  return (
    <div className={clsx(s.col, grow !== undefined && s.grow)} style={style}>
      {children}
    </div>
  );
}

export function Card({ title, children, grow }: { title?: string; children: ReactNode; grow?: number }) {
  return (
    <div className={clsx(s.card, grow !== undefined && s.grow)} style={grow === undefined ? undefined : { flex: grow }}>
      {title ? <div className={s.cardTitle}>{title}</div> : null}
      {children}
    </div>
  );
}

export function Kpi({ label, value, hint, accent }: { label: string; value: string; hint?: string; accent?: boolean }) {
  return (
    <div className={clsx(s.kpi, accent && s.kpiAccent)}>
      <div className={s.kpiLabel}>{label}</div>
      <div className={s.kpiValue}>{value}</div>
      {hint ? <div className={s.kpiHint}>{hint}</div> : null}
    </div>
  );
}

export type Tone = "neutral" | "ok" | "bad" | "accent";

const toneClass: Record<Tone, string | undefined> = {
  neutral: undefined,
  ok: s.toneOk,
  bad: s.toneBad,
  accent: s.toneAccent,
};

export function Chip({ children, tone = "neutral" }: { children: ReactNode; tone?: Tone }) {
  return <span className={clsx(s.chip, toneClass[tone])}>{children}</span>;
}

export function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className={s.field}>
      <div className={s.fieldLabel}>{label}</div>
      <div className={s.fieldBox}>{value}</div>
    </div>
  );
}

export function Btn({ children }: { children: ReactNode }) {
  return <span className={s.btn}>{children}</span>;
}

export function Link({ children }: { children: ReactNode }) {
  return <span className={s.link}>{children}</span>;
}

export function Banner({ children, warn }: { children: ReactNode; warn?: boolean }) {
  return <div className={clsx(s.banner, warn && s.bannerWarn)}>{children}</div>;
}

export function Progress({ value }: { value: number }) {
  return (
    <div className={s.progress}>
      <div className={s.progressFill} style={{ width: `${value}%` }} />
    </div>
  );
}

export function Cell({ children, right, mono, muted, strong }: { children: ReactNode; right?: boolean; mono?: boolean; muted?: boolean; strong?: boolean }) {
  return <span className={clsx(right && s.right, mono && s.mono, muted && s.muted, strong && s.strong)}>{children}</span>;
}

/** Tabla compacta. Cada celda es un nodo; `right` lista los índices de columna alineados a la derecha. */
export function Table({ head, rows, right = [] }: { head: string[]; rows: ReactNode[][]; right?: number[] }) {
  return (
    <table className={s.table}>
      <thead>
        <tr>
          {head.map((cell, index) => (
            <th key={cell} className={clsx(right.includes(index) && s.right)}>
              {cell}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, index) => (
              <td key={index} className={clsx(right.includes(index) && s.right)}>
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export type SeriesKind = "accent" | "muted" | "fg";

const lineClass: Record<SeriesKind, string> = { accent: s.lineAccent, muted: s.lineMuted, fg: s.lineFg };

export function LineChart({
  series,
  labels,
  width = 508,
  height = 140,
  area,
}: {
  series: { points: number[]; kind: SeriesKind }[];
  labels: string[];
  width?: number;
  height?: number;
  area?: boolean;
}) {
  const padL = 6;
  const padR = 6;
  const padT = 8;
  const padB = 18;
  const all = series.flatMap((item) => item.points);
  const lo = Math.min(...all);
  const hi = Math.max(...all);
  const span = hi - lo || 1;
  const count = series[0].points.length;
  const x = (i: number) => padL + (i * (width - padL - padR)) / (count - 1);
  const y = (v: number) => padT + (1 - (v - lo) / span) * (height - padT - padB);
  const path = (points: number[]) => points.map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(" ");

  return (
    <svg className={s.chart} viewBox={`0 0 ${width} ${height}`}>
      {[0, 1, 2, 3].map((i) => {
        const gy = padT + (i * (height - padT - padB)) / 3;
        return <line key={i} className={s.gridLine} x1={padL} x2={width - padR} y1={gy} y2={gy} />;
      })}
      {area ? (
        <path
          className={s.areaAccent}
          d={`${path(series[0].points)} L${x(count - 1).toFixed(1)} ${height - padB} L${x(0).toFixed(1)} ${height - padB} Z`}
        />
      ) : null}
      {[...series].reverse().map((item, index) => (
        <path key={index} className={lineClass[item.kind]} d={path(item.points)} />
      ))}
      {series
        .filter((item) => item.kind === "accent")
        .flatMap((item) => item.points.map((v, i) => <circle key={i} className={s.dotAccent} cx={x(i)} cy={y(v)} r={2.6} />))}
      {labels.map((label, i) => (
        <text key={label + i} className={s.axisText} x={x(i)} y={height - 4} textAnchor="middle">
          {label}
        </text>
      ))}
    </svg>
  );
}

export function BarChart({
  primary,
  secondary,
  labels,
  width = 508,
  height = 140,
}: {
  primary: number[];
  secondary?: number[];
  labels: string[];
  width?: number;
  height?: number;
}) {
  const padB = 18;
  const padT = 6;
  const hi = Math.max(...primary, ...(secondary ?? [0]));
  const slot = width / primary.length;
  const barW = secondary ? slot * 0.32 : slot * 0.52;
  const h = (v: number) => (v / hi) * (height - padB - padT);

  return (
    <svg className={s.chart} viewBox={`0 0 ${width} ${height}`}>
      {[0, 1, 2, 3].map((i) => {
        const gy = padT + (i * (height - padB - padT)) / 3;
        return <line key={i} className={s.gridLine} x1={0} x2={width} y1={gy} y2={gy} />;
      })}
      {primary.map((v, i) => {
        const cx = slot * i + slot / 2;
        return (
          <g key={i}>
            <rect
              className={s.barAccent}
              x={secondary ? cx - barW - 1 : cx - barW / 2}
              y={height - padB - h(v)}
              width={barW}
              height={h(v)}
              rx={2}
            />
            {secondary ? (
              <rect className={s.barMuted} x={cx + 1} y={height - padB - h(secondary[i])} width={barW} height={h(secondary[i])} rx={2} />
            ) : null}
            <text className={s.axisText} x={cx} y={height - 4} textAnchor="middle">
              {labels[i]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function Legend({ items }: { items: { label: string; accent?: boolean }[] }) {
  return (
    <div className={s.legend}>
      {items.map((item) => (
        <span key={item.label} className={s.legendItem}>
          <span className={clsx(s.swatch, item.accent && s.swatchAccent)} />
          {item.label}
        </span>
      ))}
    </div>
  );
}

/** Rejilla de calor: filas con etiqueta y `cols` columnas; `fn` devuelve la intensidad 0–100. */
export function Heat({ rowLabels, cols, fn, headEvery = 4 }: { rowLabels: string[]; cols: number; fn: (row: number, col: number) => number; headEvery?: number }) {
  return (
    <div className={s.heat} style={{ gridTemplateColumns: `34px repeat(${cols}, 1fr)` }}>
      <span />
      {Array.from({ length: cols }, (_, c) => (
        <span key={c} className={s.heatHead}>
          {c % headEvery === 0 ? c + 1 : ""}
        </span>
      ))}
      {rowLabels.map((label, r) => (
        <HeatRow key={label} label={label} row={r} cols={cols} fn={fn} />
      ))}
    </div>
  );
}

function HeatRow({ label, row, cols, fn }: { label: string; row: number; cols: number; fn: (row: number, col: number) => number }) {
  return (
    <>
      <span className={s.heatLabel}>{label}</span>
      {Array.from({ length: cols }, (_, c) => (
        <span key={c} className={s.heatCell} style={{ "--heat": `${fn(row, c)}%` } as CSSProperties} />
      ))}
    </>
  );
}

export type StepState = "done" | "active" | "todo";

export function Steps({ items }: { items: { name: string; note: string; state: StepState }[] }) {
  return (
    <div className={s.steps}>
      {items.map((item, index) => (
        <div key={item.name} className={clsx(s.step, item.state === "done" && s.stepDone, item.state === "active" && s.stepActive)}>
          <span className={s.stepNum}>{item.state === "done" ? "✓" : index + 1}</span>
          <div className={s.stepName}>{item.name}</div>
          <div className={s.stepNote}>{item.note}</div>
        </div>
      ))}
    </div>
  );
}

const logClass = { ok: s.logOk, bad: s.logBad, accent: s.logAccent, plain: undefined } as const;

export function Log({ lines }: { lines: { time?: string; text: string; tone?: keyof typeof logClass }[] }) {
  return (
    <div className={s.log}>
      {lines.map((line, index) => (
        <div key={index}>
          {line.time ? <span className={s.logTime}>{line.time} </span> : null}
          <span className={logClass[line.tone ?? "plain"]}>{line.text}</span>
        </div>
      ))}
    </div>
  );
}

export function ListRow({ children, on }: { children: ReactNode; on?: boolean }) {
  return (
    <div className={s.listRow}>
      <span className={clsx(s.check, on && s.checkOn)} />
      {children}
    </div>
  );
}

export function Sheet({ head, children }: { head: string; children: ReactNode }) {
  return (
    <div className={s.sheet}>
      <div className={s.sheetHead}>{head}</div>
      {children}
    </div>
  );
}

export function Code({ children }: { children: ReactNode }) {
  return <div className={s.code}>{children}</div>;
}

export function CodeKey({ children }: { children: ReactNode }) {
  return <span className={s.codeKey}>{children}</span>;
}

export function CodeOk({ children }: { children: ReactNode }) {
  return <span className={s.codeOk}>{children}</span>;
}

export function BigNumber({ children }: { children: ReactNode }) {
  return <div className={s.bigNumber}>{children}</div>;
}

export function Score({ value, label }: { value: number; label?: string }) {
  return (
    <div className={s.scoreWrap}>
      {label ? <span className={s.scoreLabel}>{label}</span> : null}
      <div className={s.scoreBar}>
        <div className={s.scoreFill} style={{ width: `${value}%` }} />
      </div>
      <span className={clsx(s.mono, s.strong)}>{value}</span>
    </div>
  );
}
