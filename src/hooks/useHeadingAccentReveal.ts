import { useEffect, useState, type RefObject } from "react";
import accent from "@/styles/sectionHeadingAccent.module.scss";

/** Misma lógica que en Home: IO al entrar/salir de vista; reduced motion = revelado al montar. */
export function useHeadingAccentReveal(ref: RefObject<HTMLElement | null>) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setPrefersReducedMotion(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const REVEALED = accent.headingAccentRevealed;

    if (prefersReducedMotion) {
      el.classList.add(REVEALED);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add(REVEALED);
          } else {
            entry.target.classList.remove(REVEALED);
          }
        }
      },
      { threshold: 0.22, rootMargin: "0px 0px -6% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [prefersReducedMotion, ref]);
}
