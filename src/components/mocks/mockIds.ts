/** Ids de las maquetas. Los usa projects.ts (solo texto) y los resuelve el registro de index.tsx. */
export const mockIds = [
  "tarifas-hero",
  "tarifas-config",
  "tarifas-ahorro",
  "agpe-hero",
  "agpe-liquidacion",
  "agpe-xm",
  "saidi-hero",
  "saidi-pasos",
  "saidi-consolidado",
  "mem-hero",
  "mem-descarga",
  "mem-proceso",
  "aenc-hero",
  "aenc-registro",
  "aenc-versiones",
  "radar-hero",
  "radar-senal",
  "radar-historial",
] as const;

export type MockId = (typeof mockIds)[number];
