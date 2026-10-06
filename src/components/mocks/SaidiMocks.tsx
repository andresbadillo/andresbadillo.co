import { Banner, BarChart, Card, Cell, Chip, Kpi, Legend, Log, Main, MockFrame, Row, Side, Steps, Table, Title } from "./MockParts";

const sideItems = ["SAIDI-SAIFI", "TC1", "TC3", "DIU-FIU", "Pérdidas"];
const MONTHS = ["E", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];

export function SaidiHero() {
  return (
    <MockFrame url="distribucion.interno / saidi-saifi" label="Maqueta de los indicadores SAIDI y SAIFI del año con la comparación mensual entre interrupciones programadas y no programadas">
      <Side brand="Distribución" items={sideItems} active={0} foot="Módulo activo" />
      <Main>
        <Title sub="Acumulado del año · 9 meses consolidados">SAIDI · SAIFI</Title>
        <Row>
          <Kpi label="SAIDI" value="8,4 h" accent hint="duración" />
          <Kpi label="SAIFI" value="5,1" hint="frecuencia" />
          <Kpi label="Interrupciones" value="312" hint="que aplican" />
          <Kpi label="Transformadores" value="148" hint="afectados" />
        </Row>
        <Card title="SAIDI por mes (h)">
          <BarChart
            primary={[0.9, 0.7, 1.1, 0.8, 0.6, 1.2, 0.9, 1.0, 0.7, 0, 0, 0]}
            secondary={[0.4, 0.3, 0.5, 0.2, 0.4, 0.3, 0.6, 0.4, 0.3, 0, 0, 0]}
            labels={MONTHS}
            height={140}
          />
          <Legend items={[{ label: "No programadas", accent: true }, { label: "Programadas" }]} />
        </Card>
      </Main>
    </MockFrame>
  );
}

export function SaidiPasos() {
  return (
    <MockFrame url="distribucion.interno / saidi-saifi / pasos" label="Maqueta del flujo de cuatro pasos con su estado, una advertencia de transformadores nuevos y el registro del paso activo">
      <Side brand="Distribución" items={sideItems} active={0} foot="Módulo activo" />
      <Main>
        <Title sub="Periodo de trabajo: septiembre">Flujo mensual</Title>
        <Steps
          items={[
            { name: "Resumen INDICA", note: "30 archivos leídos", state: "done" },
            { name: "SAIDI-SAIFI", note: "148 transformadores", state: "done" },
            { name: "Consolidado", note: "9 de 12 meses", state: "active" },
            { name: "Formulario", note: "Requiere el paso 3", state: "todo" },
          ]}
        />
        <Banner warn>2 transformadores nuevos no están en el inventario</Banner>
        <Log
          lines={[
            { time: "paso 3", text: "Leyendo los meses disponibles del año", tone: "plain" },
            { time: "paso 3", text: "✓ Resumen y resultado de 9 meses", tone: "ok" },
            { time: "paso 3", text: "! Mes 10 sin archivo de resultado (omitido)", tone: "accent" },
            { time: "paso 3", text: "✓ Consolidado calculado: SAIDI 8,4 · SAIFI 5,1", tone: "ok" },
            { time: "paso 3", text: "Actualizando la tabla de indicadores del Excel maestro…", tone: "plain" },
          ]}
        />
        <Row>
          <Chip tone="ok">Pasos 1 y 2 · completos</Chip>
          <Chip tone="accent">Paso 3 · en curso</Chip>
          <Chip>Paso 4 · pendiente</Chip>
        </Row>
      </Main>
    </MockFrame>
  );
}

const rows: [string, string, string, string, string, boolean][] = [
  ["Enero", "0,5", "0,9", "1,4", "0,8", true],
  ["Febrero", "0,3", "0,7", "1,0", "0,6", true],
  ["Marzo", "0,5", "1,1", "1,6", "0,9", true],
  ["Abril", "0,2", "0,8", "1,0", "0,5", true],
  ["Mayo", "0,4", "0,6", "1,0", "0,7", true],
  ["Junio", "0,3", "1,2", "1,5", "0,8", true],
  ["Julio", "0,6", "0,9", "1,5", "0,9", true],
  ["Agosto", "0,4", "1,0", "1,4", "0,8", false],
];

export function SaidiConsolidado() {
  return (
    <MockFrame url="distribucion.interno / saidi-saifi / consolidado" label="Maqueta del consolidado anual con SAIDI y SAIFI por mes y el estado de los archivos">
      <Side brand="Distribución" items={sideItems} active={0} foot="Módulo activo" />
      <Main>
        <Title sub="Resultado por mes, programadas y no programadas">Consolidado anual</Title>
        <Card>
          <Table
            head={["Mes", "SAIDI P", "SAIDI NP", "SAIDI", "SAIFI", "Archivos"]}
            right={[1, 2, 3, 4]}
            rows={rows.map(([month, p, np, total, saifi, ok]) => [
              <Cell key="m" strong>
                {month}
              </Cell>,
              p,
              np,
              <Cell key="t" strong>
                {total}
              </Cell>,
              saifi,
              <Chip key="s" tone={ok ? "ok" : "accent"}>
                {ok ? "Completo" : "Falta TC3"}
              </Chip>,
            ])}
          />
        </Card>
        <Row>
          <Kpi label="SAIDI acumulado" value="8,4 h" accent />
          <Kpi label="SAIFI acumulado" value="5,1" />
          <Kpi label="Meses incluidos" value="8 de 12" />
        </Row>
      </Main>
    </MockFrame>
  );
}
