/** Ids de las maquetas. El admin solo puede elegir estos ids; el registro de index.tsx las dibuja. */
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
