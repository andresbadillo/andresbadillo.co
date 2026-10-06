import { Banner, Btn, Card, Cell, Chip, Code, CodeKey, Col, Heat, Kpi, Legend, Main, MockFrame, Progress, Row, Table, Title, Link, Side, Sheet } from "./MockParts";

const sideItems = ["Liquidación", "Matrices", "Archivo mercado"];

/** Curva solar: campana centrada alrededor del mediodía, 0–100. */
function sun(col: number): number {
  const d = (col - 12) / 3.4;
  return Math.max(0, Math.round(100 * Math.exp(-d * d)));
}

const DAYS = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"));

/** Exc1 se llena día a día hasta el tope importado: los primeros días completos, uno parcial y el resto en cero. */
function exc1(row: number, col: number): number {
  if (row < 5) return sun(col);
  if (row === 5) return col < 12 ? sun(col) : 0;
  return 0;
}

export function AgpeHero() {
  return (
    <MockFrame url="liquidacion.interno / matrices" label="Maqueta de la matriz horaria de excedentes tipo 1 de un usuario, que se llena hasta el tope importado">
      <Side brand="AGPE" items={sideItems} active={1} foot="Periodo 07" />
      <Main>
        <Title sub="Usuario NIU 0412 · matriz hora a hora">Excedentes tipo 1</Title>
        <Row>
          <Kpi label="Importada · kWh" value="642" />
          <Kpi label="Exportada · kWh" value="1.180" />
          <Kpi label="Exc. tipo 1 · kWh" value="642" accent />
          <Kpi label="Exc. tipo 2 · kWh" value="538" />
        </Row>
        <Card title="Día × hora · llenado cronológico hasta el tope importado">
          <Heat rowLabels={DAYS} cols={24} fn={exc1} />
        </Card>
        <Legend items={[{ label: "Exc. tipo 1 asignado", accent: true }, { label: "Sin asignar: pasa a tipo 2" }]} />
      </Main>
    </MockFrame>
  );
}

const users: [string, string, string, string, string, string, string][] = [
  ["0412", "Solar", "642", "538", "512.400", "18.200", "494.200"],
  ["0087", "Solar", "318", "204", "251.900", "9.100", "242.800"],
  ["0203", "Solar", "905", "711", "708.300", "25.400", "682.900"],
  ["0555", "Hídrica", "271", "96", "205.700", "7.800", "197.900"],
  ["0319", "Solar", "466", "389", "366.800", "13.000", "353.800"],
  ["0621", "Gas", "540", "420", "425.600", "15.100", "410.500"],
];

export function AgpeLiquidacion() {
  return (
    <MockFrame url="liquidacion.interno / liquidación" label="Maqueta de la liquidación del periodo con el resumen y la tabla de valoración por usuario">
      <Side brand="AGPE" items={sideItems} active={0} foot="Periodo 07" />
      <Main>
        <Title sub="Periodo 07 · 248 usuarios">Liquidación del periodo</Title>
        <Row>
          <Kpi label="Usuarios" value="248" />
          <Kpi label="Importada" value="160 MWh" />
          <Kpi label="Exportada" value="135 MWh" />
          <Kpi label="Total a pagar" value="$ 41,8 M" accent />
        </Row>
        <Card title="Valoración por usuario ($)">
          <Table
            head={["NIU", "Fuente", "Exc1 kWh", "Exc2 kWh", "VE", "Contrib.", "Total"]}
            right={[2, 3, 4, 5, 6]}
            rows={users.map(([niu, src, e1, e2, ve, ap, total]) => [
              <Cell key="n" mono strong>
                {niu}
              </Cell>,
              src,
              e1,
              e2,
              ve,
              ap,
              <Cell key="t" strong>
                {total}
              </Cell>,
            ])}
          />
        </Card>
        <Row>
          <Link>Exportar a Excel</Link>
        </Row>
      </Main>
    </MockFrame>
  );
}

export function AgpeXm() {
  return (
    <MockFrame url="liquidacion.interno / archivo del mercado" label="Maqueta de la generación del archivo para el mercado y de la impresión de matrices por usuario">
      <Side brand="AGPE" items={sideItems} active={2} foot="Periodo 07" />
      <Main>
        <Title sub="Formato oficial del operador del mercado">Archivo del mercado</Title>
        <Banner>Archivo generado · 496 registros · 248 usuarios</Banner>
        <Card title="Vista previa">
          <Code>
            <CodeKey>NIU,Mercado,NT,Capacidad,Fuente,Tipo,H1,H2,H3 …</CodeKey>
            {"\n0001,M01,1,5.2,SOLAR,CreditoEnergia,0.000,0.000,0.412 …"}
            {"\n0001,M01,1,5.2,SOLAR,TotalExcedente,0.000,0.000,0.655 …"}
            {"\n0002,M01,1,3.0,SOLAR,CreditoEnergia,0.000,0.000,0.280 …"}
          </Code>
        </Card>
        <Row gap={12}>
          <Card title="Impresión de matrices" grow={1}>
            <Progress value={72} />
            <div style={{ marginTop: 5, color: "var(--muted)" }}>Hoja 179 de 248</div>
          </Card>
          <Col grow={1}>
            <Sheet head="NIU 0179 · anexo de factura">
              <Heat rowLabels={["01", "02", "03"]} cols={24} fn={(_, c) => sun(c)} headEvery={6} />
            </Sheet>
          </Col>
        </Row>
        <Row>
          <Btn>Publicar en SharePoint</Btn>
          <Chip tone="ok">Carpeta por año y mes</Chip>
        </Row>
      </Main>
    </MockFrame>
  );
}
