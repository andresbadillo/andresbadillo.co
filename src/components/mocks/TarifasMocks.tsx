import { Banner, BarChart, BigNumber, Cell, Chip, Code, CodeKey, Card, Col, Field, Kpi, Legend, LineChart, Main, MockFrame, Row, Side, Table, Title } from "./MockParts";

const MONTHS = ["Ago", "Sep", "Oct", "Nov", "Dic", "Ene", "Feb", "Mar", "Abr", "May", "Jun"];
const OWN = [742, 731, 728, 722, 719, 716, 712, 709, 714, 706, 701];
const RIVAL = [801, 798, 796, 799, 794, 793, 797, 792, 790, 795, 788];
const THIRD = [770, 768, 765, 769, 766, 764, 760, 763, 761, 759, 757];

const sideItems = ["Datos", "Comparación", "Ahorro", "Exportar"];

export function TarifasHero() {
  return (
    <MockFrame url="comparador.interno / comparación" label="Maqueta del comparador: tarjetas de costo unitario y gráfico de evolución frente a dos competidores">
      <Side brand="Tarifas" items={sideItems} active={1} foot="Sesión corporativa" />
      <Main>
        <Title sub="Mercado A · Nivel de tensión N1 · 11 periodos">Comparación de CU</Title>
        <Row>
          <Kpi label="CU propio" value="$ 718,3" accent hint="promedio del periodo" />
          <Kpi label="Competidor A" value="$ 794,9" hint="9,6 % por encima" />
          <Kpi label="Competidor B" value="$ 765,0" hint="6,1 % por encima" />
        </Row>
        <Card title="Evolución del CU ($/kWh)">
          <LineChart
            labels={MONTHS}
            series={[
              { points: OWN, kind: "accent" },
              { points: RIVAL, kind: "muted" },
              { points: THIRD, kind: "fg" },
            ]}
          />
          <Legend items={[{ label: "Propio", accent: true }, { label: "Competidor A" }, { label: "Competidor B" }]} />
        </Card>
        <Banner>11 de 11 periodos clasificados como Exitosos</Banner>
      </Main>
    </MockFrame>
  );
}

const periodRows: [string, string, string, string, string, boolean][] = [
  ["Ene", "716,0", "793,0", "−9,7 %", "−9,1 %", true],
  ["Feb", "712,0", "797,0", "−10,7 %", "−9,5 %", true],
  ["Mar", "709,0", "792,0", "−10,5 %", "−9,7 %", true],
  ["Abr", "714,0", "790,0", "−9,6 %", "−9,7 %", true],
  ["May", "706,0", "795,0", "−11,2 %", "−9,9 %", true],
  ["Jun", "701,0", "788,0", "−11,0 %", "−10,0 %", true],
];

export function TarifasConfig() {
  return (
    <MockFrame url="comparador.interno / configuración" label="Maqueta del panel de configuración y de la tabla periodo a periodo con su clasificación">
      <Side brand="Tarifas" items={sideItems} active={1} foot="Sesión corporativa" />
      <Main>
        <Title sub="Parámetros de la comparación">Configuración</Title>
        <Row>
          <Field label="Mercado" value="Mercado A" />
          <Field label="Comercializador" value="Propio" />
          <Field label="Competidor" value="Competidor A" />
        </Row>
        <Row>
          <Field label="Nivel de tensión" value="N1 · Propiedad del cliente" />
          <Field label="Desde" value="ago-2025" />
          <Field label="Hasta" value="jun-2026" />
        </Row>
        <Card title="Periodo a periodo · promedio acumulado">
          <Table
            head={["Periodo", "CU propio", "CU competidor", "Diferencia", "Acumulado", "Estado"]}
            right={[1, 2, 3, 4]}
            rows={periodRows.map(([period, own, rival, diff, acc, ok]) => [
              <Cell key="p" strong>
                {period}
              </Cell>,
              own,
              rival,
              diff,
              acc,
              <Chip key="s" tone={ok ? "ok" : "accent"}>
                {ok ? "Exitoso" : "Atención"}
              </Chip>,
            ])}
          />
        </Card>
      </Main>
    </MockFrame>
  );
}

const SAVINGS = [1.38, 1.46, 1.51, 1.57, 1.6, 1.64, 1.7, 1.73, 1.55, 1.66, 1.71];

export function TarifasAhorro() {
  return (
    <MockFrame url="comparador.interno / ahorro" label="Maqueta del análisis de ahorro con el resultado, el cálculo y el ahorro mensual">
      <Side brand="Tarifas" items={sideItems} active={2} foot="Sesión corporativa" />
      <Main>
        <Title sub="Consumo promedio del cliente: 20.000 kWh/mes">Ahorro proyectado</Title>
        <Row gap={12}>
          <Card grow={1}>
            <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.04em" }}>Ahorro en el periodo</div>
            <BigNumber>$ 16,9 M</BigNumber>
            <div style={{ marginTop: 6 }}>
              <Chip tone="ok">9,6 % menos que el competidor</Chip>
            </div>
          </Card>
          <Col grow={1}>
            <Kpi label="Ahorro mensual" value="$ 1,53 M" accent />
            <Kpi label="Periodos" value="11" hint="todos Exitosos" />
          </Col>
        </Row>
        <Row gap={12}>
          <Card title="Cálculo" grow={1.3}>
            <Code>
              <CodeKey>ahorro</CodeKey>
              {" = (CU_comp − CU_propio) × kWh\n"}
              {"       = (794,9 − 718,3) × 20.000\n"}
              <CodeKey>mensual</CodeKey>
              {" = $ 1.532.000\n"}
              <CodeKey>periodo</CodeKey>
              {" = 11 × mensual"}
            </Code>
          </Card>
          <Card title="Ahorro por mes ($ M)" grow={1}>
            <BarChart primary={SAVINGS} labels={MONTHS.map((m) => m.slice(0, 1))} width={206} height={96} />
          </Card>
        </Row>
      </Main>
    </MockFrame>
  );
}
