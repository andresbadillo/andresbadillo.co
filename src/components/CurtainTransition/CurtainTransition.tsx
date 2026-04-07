import clsx from "clsx";
import { createContext, useContext, useMemo, useState, type PropsWithChildren } from "react";
import styles from "./CurtainTransition.module.scss";

const CURTAIN_MS = 320;
const REDUCED_FADE_MS = 140;

interface CurtainContextValue {
  startTransition: (callbackAfterCovered?: () => void) => void;
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

  const startTransition = (callbackAfterCovered?: () => void) => {
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
  };

  const value = useMemo(() => ({ startTransition }), []);

  return (
    <CurtainContext.Provider value={value}>
      {children}
      {state !== "idle" && (
        <div
          aria-hidden="true"
          className={clsx(
            (state === "covering" || state === "revealing") && styles.overlay,
            state === "covering" && styles.covering,
            state === "revealing" && styles.revealing,
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
