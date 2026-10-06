import { Banner, Btn, Card, Cell, Chip, Field, Kpi, ListRow, Log, Main, MockFrame, Progress, Row, Side, Steps, Table, Title } from "./MockParts";

const sideItems = ["Cargos SDL", "Futuro"];

export function MemHero() {
  return (
    <MockFrame url="mercado.interno / cargos" label="Maqueta del flujo de cuatro pasos con la conexión al portal y la tabla de archivos del periodo">
      <Side brand="Cargos" items={sideItems} active={0} foot="Sesión corporativa" />
      <Main>
        <Title sub="Cargos publicados por el operador del mercado">Cargos del mercado</Title>
        <Steps
          items={[
            { name: "Conectar", note: "Portal conectado", state: "done" },
            { name: "Descargar", note: "6 de 8 archivos", state: "active" },
            { name: "Subir", note: "SharePoint del equipo", state: "todo" },
            { name: "Procesar", note: "Cargos SDL", state: "todo" },
          ]}
        />
        <Row>
          <Field label="Fuente" value="Ambas fuentes" />
          <Field label="Año" value="2026" />
          <Field label="Mes" value="Marzo" />
        </Row>
        <Card title="Archivos del periodo">
          <Table
            head={["Archivo", "Fuente", "Tamaño", "Estado"]}
            right={[2]}
            rows={[
              [<Cell key="a" mono>cargos_sdl_03.xlsx</Cell>, "Cargos SDL", "1,2 MB", <Chip key="s" tone="ok">Descargado</Chip>],
              [<Cell key="a" mono>cargos_sdl_03_ajuste.xlsx</Cell>, "Cargos SDL", "0,8 MB", <Chip key="s" tone="ok">Descargado</Chip>],
              [<Cell key="a" mono>uso_red_03_n1.xlsx</Cell>, "Uso de la red", "2,4 MB", <Chip key="s" tone="accent">Descargando</Chip>],
              [<Cell key="a" mono>uso_red_03_n2.xlsx</Cell>, "Uso de la red", "2,1 MB", <Chip key="s">En cola</Chip>],
            ]}
          />
        </Card>
      </Main>
    </MockFrame>
  );
}

export function MemDescarga() {
  return (
    <MockFrame url="mercado.interno / paso 2" label="Maqueta del paso de descarga con la selección de fuente y periodo y la lista de archivos marcados">
      <Side brand="Cargos" items={sideItems} active={0} foot="Sesión corporativa" />
      <Main>
        <Title sub="Elige qué traer del portal">Paso 2 · Descargar archivos</Title>
        <Row>
          <Field label="Fuente" value="Ambas fuentes" />
          <Field label="Tipo" value="Todos" />
          <Field label="Año" value="2026" />
          <Field label="Mes" value="Marzo" />
        </Row>
        <Card title="8 archivos encontrados">
          <ListRow on>
            <span style={{ flex: 1 }}>Cargos SDL · Resolución vigente</span>
            <Chip tone="ok">Listo</Chip>
          </ListRow>
          <ListRow on>
            <span style={{ flex: 1 }}>Cargos SDL · Ajuste del periodo</span>
            <Chip tone="ok">Listo</Chip>
          </ListRow>
          <ListRow on>
            <span style={{ flex: 1 }}>Uso de la red · Nivel 1</span>
            <Chip tone="accent">64 %</Chip>
          </ListRow>
          <ListRow on>
            <span style={{ flex: 1 }}>Uso de la red · Nivel 2</span>
            <Chip>En cola</Chip>
          </ListRow>
          <ListRow>
            <span style={{ flex: 1, color: "var(--muted)" }}>Uso de la red · Histórico</span>
            <Chip>Omitido</Chip>
          </ListRow>
        </Card>
        <Progress value={64} />
        <Row>
          <Btn>Descargar archivos</Btn>
        </Row>
      </Main>
    </MockFrame>
  );
}

export function MemProceso() {
  return (
    <MockFrame url="mercado.interno / pasos 3 y 4" label="Maqueta de la subida a SharePoint y del procesamiento de los cargos con su registro">
      <Side brand="Cargos" items={sideItems} active={0} foot="Sesión corporativa" />
      <Main>
        <Title sub="Carga al sitio del equipo y procesamiento">Pasos 3 y 4</Title>
        <Row>
          <Kpi label="Archivos subidos" value="8 / 8" accent />
          <Kpi label="Libros procesados" value="4" />
          <Kpi label="Advertencias" value="1" />
        </Row>
        <Banner>Conexión con SharePoint verificada</Banner>
        <Log
          lines={[
            { time: "10:02:11", text: "Subiendo 8 archivos a la carpeta del periodo", tone: "plain" },
            { time: "10:02:19", text: "✓ 8 de 8 archivos cargados", tone: "ok" },
            { time: "10:02:20", text: "Procesando libros de cargos SDL…", tone: "plain" },
            { time: "10:02:34", text: "✓ Hoja de cargos leída y validada", tone: "ok" },
            { time: "10:02:35", text: "! Un nivel sin valor publicado (se deja vacío)", tone: "accent" },
            { time: "10:02:41", text: "✓ Archivo de salida generado", tone: "ok" },
          ]}
        />
        <Row>
          <Btn>Procesar cargos</Btn>
        </Row>
      </Main>
    </MockFrame>
  );
}
