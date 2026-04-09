import clsx from "clsx";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import styles from "./CurtainTransition.module.scss";

const CURTAIN_MS = 320;
const REDUCED_FADE_MS = 140;

/** Barrido de la cortina: horizontal izq→der, horizontal der→izq, o vertical (p. ej. navegación). */
export type CurtainSweep = "ltr" | "rtl" | "tb";

interface CurtainContextValue {
  startTransition: (callbackAfterCovered?: () => void, sweep?: CurtainSweep) => void;
}

const CurtainContext = createContext<CurtainContextValue | null>(null);

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

type CurtainState =
  | "idle"
  | "covering"
  | "revealing"
  | "reducedCover"
  | "reducedReveal";

export function CurtainProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<CurtainState>("idle");
  const [sweep, setSweep] = useState<CurtainSweep>("tb");

  const startTransition = useCallback((callbackAfterCovered?: () => void, sweepMode: CurtainSweep = "tb") => {
    setSweep(sweepMode);
    if (prefersReducedMotion()) {
      setState("reducedCover");
      window.setTimeout(() => {
        callbackAfterCovered?.();
        setState("reducedReveal");
        window.setTimeout(() => setState("idle"), REDUCED_FADE_MS);
      }, REDUCED_FADE_MS);
      return;
    }
    setState("covering");
    window.setTimeout(() => {
      callbackAfterCovered?.();
      setState("revealing");
      window.setTimeout(() => setState("idle"), CURTAIN_MS);
    }, CURTAIN_MS);
  }, []);

  const value = useMemo(() => ({ startTransition }), [startTransition]);

  return (
    <CurtainContext.Provider value={value}>
      {children}
      {state !== "idle" && (
        <div
          aria-hidden="true"
          className={clsx(
            (state === "covering" || state === "revealing") && styles.overlay,
            (state === "covering" || state === "revealing") && sweep === "tb" && styles.overlayTb,
            (state === "covering" || state === "revealing") && sweep === "ltr" && styles.overlayLtr,
            (state === "covering" || state === "revealing") && sweep === "rtl" && styles.overlayRtl,
            state === "covering" && sweep === "tb" && styles.coveringTb,
            state === "revealing" && sweep === "tb" && styles.revealingTb,
            state === "covering" && sweep === "ltr" && styles.coveringLtr,
            state === "revealing" && sweep === "ltr" && styles.revealingLtr,
            state === "covering" && sweep === "rtl" && styles.coveringRtl,
            state === "revealing" && sweep === "rtl" && styles.revealingRtl,
            (state === "reducedCover" || state === "reducedReveal") && styles.overlayReduced,
            state === "reducedCover" && styles.reducedFadeIn,
            state === "reducedReveal" && styles.reducedFadeOut,
          )}
        />
      )}
    </CurtainContext.Provider>
  );
}

export function useCurtain() {
  const ctx = useContext(CurtainContext);
  if (!ctx) throw new Error("useCurtain must be used inside CurtainProvider");
  return ctx;
}
