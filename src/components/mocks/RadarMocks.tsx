import { Card, Cell, Chip, Col, Kpi, LineChart, Main, MockFrame, Row, Score, Side, Table, Title } from "./MockParts";

const sideItems = ["Hoy", "Historial", "Fuentes"];

const signals: [string, string, number][] = [
  ["Modelo abierto de razonamiento", "Modelo", 88],
  ["SDK para agentes con memoria persistente", "Herramienta", 74],
  ["Evaluación de agentes de larga duración", "Paper", 81],
  ["Orquestador de flujos con trazas", "Repositorio", 66],
  ["API con salida estructurada", "Lanzamiento", 79],
];

export function RadarHero() {
  return (
    <MockFrame url="airadar.app / hoy" label="Maqueta del dashboard con las cinco señales del día ordenadas por puntaje">
      <Side brand="AI Radar" items={sideItems} active={0} foot="Captura de hoy" />
      <Main>
        <Title sub="Cinco señales · ordenadas por novedad, impacto, evidencia y accionabilidad">Señales de hoy</Title>
        <Card>
          <Table
            head={["#", "Señal", "Tipo", "Puntaje"]}
            rows={signals.map(([title, kind, score], index) => [
              <Cell key="n" strong>
                {index + 1}
              </Cell>,
              <Cell key="t" strong>
                {title}
              </Cell>,
              <Chip key="k" tone={index === 0 ? "accent" : "neutral"}>
                {kind}
              </Chip>,
              <Score key="s" value={score} />,
            ])}
          />
        </Card>
        <Row>
          <Kpi label="Fuentes revisadas" value="42" />
          <Kpi label="Duplicados descartados" value="18" />
          <Kpi label="Señales del día" value="5" accent />
        </Row>
        <Card title="Puntaje medio · últimos 14 días">
          <LineChart
            area
            labels={["", "", "", "", "", "", "", "", "", "", "", "", "", ""]}
            height={46}
            series={[{ points: [71, 74, 70, 76, 78, 75, 73, 77, 80, 76, 79, 82, 78, 80], kind: "accent" }]}
          />
        </Card>
      </Main>
    </MockFrame>
  );
}

export function RadarSenal() {
  return (
    <MockFrame url="airadar.app / señal" label="Maqueta del detalle de una señal con su contexto, la confiabilidad de la evidencia y qué probar">
      <Side brand="AI Radar" items={sideItems} active={0} foot="Captura de hoy" />
      <Main>
        <Row>
          <div style={{ flex: 1 }}>
            <Title sub="Señal 1 de 5 · lanzamiento de ayer">Modelo abierto de razonamiento</Title>
          </div>
          <Chip tone="accent">Modelo</Chip>
        </Row>
        <Row gap={10}>
          <Card title="Qué pasó" grow={1}>
            Se publicó un modelo con pesos abiertos y licencia permisiva que iguala a modelos cerrados en tareas de razonamiento.
          </Card>
          <Card title="Por qué importa" grow={1}>
            Permite correr agentes con razonamiento sin depender de una API de pago, con control total de los datos.
          </Card>
        </Row>
        <Row gap={10}>
          <Card title="Qué tan confiable es" grow={1}>
            <Col>
              {[
                ["Novedad", 90],
                ["Impacto", 85],
                ["Evidencia", 88],
                ["Accionabilidad", 80],
              ].map(([label, value]) => (
                <Score key={label} label={label as string} value={value as number} />
              ))}
            </Col>
          </Card>
          <Card title="Qué vale la pena probar" grow={1}>
            Correrlo en local con una de tus evaluaciones y comparar costo y latencia frente al modelo que usas hoy.
          </Card>
        </Row>
        <Row gap={6}>
          <Chip>Fuentes</Chip>
          <Chip tone="ok">Anuncio oficial</Chip>
          <Chip tone="ok">Repositorio con adopción</Chip>
          <Chip tone="ok">Paper con código</Chip>
        </Row>
      </Main>
    </MockFrame>
  );
}

const captures = ["Hoy", "Ayer", "Hace 2 días", "Hace 3 días", "Hace 4 días", "Hace 5 días"];

export function RadarHistorial() {
  return (
    <MockFrame url="airadar.app / historial" label="Maqueta del historial de capturas y del estado de las rutas de la API">
      <Side brand="AI Radar" items={sideItems} active={1} foot="Capturas guardadas" />
      <Main>
        <Title sub="Capturas persistidas y rutas de la API">Historial</Title>
        <Row>
          <Kpi label="Capturas" value="87" accent />
          <Kpi label="Señales" value="435" />
          <Kpi label="Por captura" value="5" />
        </Row>
        <Row gap={12}>
          <Card title="Periodo" grow={1}>
            <Col>
              {captures.map((label, index) => (
                <Row key={label} gap={6}>
                  <Chip tone={index === 1 ? "accent" : "neutral"}>{label}</Chip>
                </Row>
              ))}
            </Col>
          </Card>
          <Card title="API" grow={2}>
            <Table
              head={["Ruta", "Permiso", "Estado"]}
              rows={[
                [<Cell key="r" mono>PUT /api/radars</Cell>, "Escritura", <Chip key="s" tone="ok">Activa</Chip>],
                [<Cell key="r" mono>GET /api/captures</Cell>, "Lectura", <Chip key="s" tone="ok">Activa</Chip>],
                [<Cell key="r" mono>GET /api/signals</Cell>, "Lectura", <Chip key="s" tone="ok">Activa</Chip>],
              ]}
            />
          </Card>
        </Row>
      </Main>
    </MockFrame>
  );
}
