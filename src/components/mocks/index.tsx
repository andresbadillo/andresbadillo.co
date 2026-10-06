import type { ComponentType } from "react";
import { AencHero, AencRegistro, AencVersiones } from "./AencMocks";
import { AgpeHero, AgpeLiquidacion, AgpeXm } from "./AgpeMocks";
import { MemDescarga, MemHero, MemProceso } from "./MemMocks";
import type { MockId } from "./mockIds";
import { RadarHero, RadarHistorial, RadarSenal } from "./RadarMocks";
import { SaidiConsolidado, SaidiHero, SaidiPasos } from "./SaidiMocks";
import { TarifasAhorro, TarifasConfig, TarifasHero } from "./TarifasMocks";

const registry: Record<MockId, ComponentType> = {
  "tarifas-hero": TarifasHero,
  "tarifas-config": TarifasConfig,
  "tarifas-ahorro": TarifasAhorro,
  "agpe-hero": AgpeHero,
  "agpe-liquidacion": AgpeLiquidacion,
  "agpe-xm": AgpeXm,
  "saidi-hero": SaidiHero,
  "saidi-pasos": SaidiPasos,
  "saidi-consolidado": SaidiConsolidado,
  "mem-hero": MemHero,
  "mem-descarga": MemDescarga,
  "mem-proceso": MemProceso,
  "aenc-hero": AencHero,
  "aenc-registro": AencRegistro,
  "aenc-versiones": AencVersiones,
  "radar-hero": RadarHero,
  "radar-senal": RadarSenal,
  "radar-historial": RadarHistorial,
};

/** Dibuja la maqueta con ese id dentro de su marco, a todo el ancho del contenedor. */
export function Mock({ id }: { id: MockId }) {
  const Component = registry[id];
  return <Component />;
}
