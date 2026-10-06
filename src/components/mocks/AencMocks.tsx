import { Banner, Card, Cell, Chip, Code, CodeKey, CodeOk, Kpi, ListRow, Log, Main, MockFrame, Row, Table, Title } from "./MockParts";

export function AencHero() {
  return (
    <MockFrame url="contenedor / corrida diaria" label="Maqueta del resumen de una corrida diaria desatendida con tres secciones y el estado del día">
      <Main>
        <Row>
          <div style={{ flex: 1 }}>
            <Title sub="Programada · 06:00 · 5 min 12 s">Corrida del día</Title>
          </div>
          <Chip tone="ok">Exitoso · código 0</Chip>
        </Row>
        <Row gap={12}>
          <Card title="1 · Consumos" grow={1}>
            <ListRow on>Descargar del FTP</ListRow>
            <ListRow on>Subir a SharePoint</ListRow>
            <ListRow on>Procesar datos</ListRow>
            <ListRow on>Consumo anual</ListRow>
            <ListRow on>Demanda anual</ListRow>
          </Card>
          <Card title="2 · Fronteras" grow={1}>
            <ListRow on>Descargar del FTP</ListRow>
            <ListRow on>Actualizar dimensión</ListRow>
          </Card>
          <Card title="3 · Falla / hurto" grow={1}>
            <ListRow on>Descargar del FTP</ListRow>
            <ListRow on>Sincronizar histórico</ListRow>
          </Card>
        </Row>
        <Row>
          <Kpi label="Secciones" value="3 / 3" accent />
          <Kpi label="Pasos" value="9 / 9" />
          <Kpi label="Errores" value="0" />
        </Row>
        <Banner>Estado del día guardado en el volumen y en SharePoint</Banner>
      </Main>
    </MockFrame>
  );
}

export function AencRegistro() {
  return (
    <MockFrame url="docker compose logs -f" label="Maqueta del registro de una corrida con cada sección y paso y su resultado">
      <Main>
        <Title sub="Salida del proceso desatendido">Registro de la corrida</Title>
        <Log
          lines={[
            { time: "06:00:02", text: "▶ Sección 1 · Consumos", tone: "accent" },
            { time: "06:00:03", text: "✓ Paso 1 · Descarga FTP (mes actual y anterior)", tone: "ok" },
            { time: "06:00:41", text: "✓ Paso 2 · Subida a SharePoint", tone: "ok" },
            { time: "06:01:12", text: "  Mes anterior: versión final por primera vez → reprocesar", tone: "plain" },
            { time: "06:02:05", text: "✓ Paso 3 · Procesar datos", tone: "ok" },
            { time: "06:02:31", text: "✓ Paso 4 · Actualizar consumo anual", tone: "ok" },
            { time: "06:02:50", text: "✓ Paso 5 · Actualizar demanda anual", tone: "ok" },
            { time: "06:02:51", text: "▶ Sección 2 · Fronteras", tone: "accent" },
            { time: "06:03:20", text: "✓ Descarga FTP · ✓ Actualizar dimensión", tone: "ok" },
            { time: "06:03:21", text: "▶ Sección 3 · Falla / hurto", tone: "accent" },
            { time: "06:04:58", text: "✓ Descarga FTP · ✓ Sincronizar histórico", tone: "ok" },
            { time: "06:05:14", text: "■ Estado: Exitoso · lock_AAAA-MM-DD.json escrito", tone: "ok" },
            { time: "06:05:14", text: "■ Próxima corrida: mañana 06:00", tone: "plain" },
          ]}
        />
      </Main>
    </MockFrame>
  );
}

export function AencVersiones() {
  return (
    <MockFrame url="contenedor / versiones y estado" label="Maqueta de la regla de versiones de los archivos y del archivo de estado diario">
      <Main>
        <Title sub="Qué se procesa en cada corrida">Versiones y estado del día</Title>
        <Row gap={6}>
          <Chip>.Tx2 · preliminar</Chip>
          <span style={{ color: "var(--muted)" }}>→</span>
          <Chip tone="accent">.TxR · revisada</Chip>
          <span style={{ color: "var(--muted)" }}>→</span>
          <Chip tone="ok">.TxF · final</Chip>
        </Row>
        <Card title="Regla de reprocesamiento">
          <Table
            head={["Mes", "Versión", "Acción"]}
            rows={[
              [<Cell key="m" strong>Actual</Cell>, <Cell key="v" mono>.TxR</Cell>, "Procesar siempre"],
              [<Cell key="m" strong>Anterior</Cell>, <Cell key="v" mono>.TxR</Cell>, "Reprocesar (sigue preliminar)"],
              [<Cell key="m" strong>Anterior</Cell>, <Cell key="v" mono>.TxF</Cell>, <Chip key="a" tone="ok">Última pasada</Chip>],
              [<Cell key="m" strong>Anterior</Cell>, <Cell key="v" mono>.TxF ya procesada</Cell>, "Omitir"],
            ]}
          />
        </Card>
        <Card title="Estado del día">
          <Code>
            {"{ "}
            <CodeKey>&quot;fecha&quot;</CodeKey>
            {": "}
            &quot;AAAA-MM-DD&quot;
            {", "}
            <CodeKey>&quot;estado&quot;</CodeKey>
            {": "}
            <CodeOk>&quot;Exitoso&quot;</CodeOk>
            {",\n  "}
            <CodeKey>&quot;secciones&quot;</CodeKey>
            {": { "}
            &quot;Consumos&quot;{": "}
            <CodeOk>&quot;Exitoso&quot;</CodeOk>
            {", "}
            &quot;Fronteras&quot;{": "}
            <CodeOk>&quot;Exitoso&quot;</CodeOk>
            {" },\n  "}
            <CodeKey>&quot;errores&quot;</CodeKey>
            {": [] }"}
          </Code>
        </Card>
      </Main>
    </MockFrame>
  );
}
