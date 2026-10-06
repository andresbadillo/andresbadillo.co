import type { MockId } from "@/components/mocks/mockIds";

/**
 * Proyectos del portfolio. Es solo texto y ids: las pantallas son componentes (src/components/mocks)
 * y se piden por id. scripts/generate-sitemap.mjs lee los `slug` de este archivo como texto, así que
 * cada uno debe seguir en su propia línea con la forma `slug: "mi-proyecto",`.
 *
 * Los proyectos de empleador están anonimizados: sin nombre de empresa, cliente, rutas ni enlaces, y
 * con cifras redondeadas. Las pantallas son maquetas con datos ficticios, no capturas.
 */

export interface ProjectFact {
  label: string;
  value: string;
}

export interface ProjectStat {
  value: string;
  label: string;
}

export interface ProjectChallenge {
  title: string;
  text: string;
}

export interface ProjectFeature {
  title: string;
  text: string;
}

export interface ProjectScreen {
  mock: MockId;
  title: string;
  caption: string;
}

export interface ProjectImpactRow {
  indicator: string;
  before: string;
  after: string;
}

export interface Project {
  slug: string;
  title: string;
  excerpt: string;
  /** Inicio del desarrollo, AAAA-MM. */
  date: string;
  tags: string[];
  featured: boolean;
  /** Proyecto de empleador: se anonimizó. Controla el aviso de la página de detalle. */
  anonymized: boolean;
  /** Maqueta principal: la que se ve en la tarjeta y al abrir el proyecto. */
  hero: MockId;
  /** Frase de apertura de la página de detalle. */
  lead: string;
  facts: ProjectFact[];
  summary: string[];
  context: { paragraphs: string[]; question: string };
  novelty: string;
  challenges: ProjectChallenge[];
  method: string[];
  stack: ProjectFact[];
  architecture: ProjectFact[];
  flow: string[];
  features: ProjectFeature[];
  screens: [ProjectScreen, ProjectScreen];
  impact: {
    stats: ProjectStat[];
    rows: ProjectImpactRow[];
    closing: string;
  };
}

export const projects: Project[] = [
  {
    slug: "comparador-tarifas-energia",
    title: "Comparador de Tarifas de Energía",
    excerpt: "Compara el costo unitario de una comercializadora frente a sus competidores y proyecta el ahorro de un cliente en minutos.",
    date: "2025-03",
    tags: ["Python", "Streamlit", "Azure AD", "SharePoint"],
    featured: true,
    anonymized: true,
    hero: "tarifas-hero",
    lead: "Una herramienta web a la medida que convierte una comparación manual de tarifas en un análisis automático, trazable y listo para presentar al cliente.",
    facts: [
      { label: "Tipo", value: "Aplicación web interna, software a la medida" },
      { label: "Rol", value: "Diseño, desarrollo y puesta en producción" },
      { label: "Estado", value: "En producción, en evolución continua" },
      { label: "Usuarios", value: "Equipo comercial (más de 10 ejecutivos)" },
      { label: "Stack", value: "Python, Streamlit, Pandas, Plotly, openpyxl" },
      { label: "Integraciones", value: "Azure AD (OAuth2) y SharePoint vía Microsoft Graph" },
    ],
    summary: [
      "La aplicación permite al equipo comercial de una comercializadora de energía comparar su Costo Unitario (CU) frente al de otros comercializadores del mercado, cuantificar el ahorro proyectado para un cliente y exportar el resultado como soporte de una oferta.",
      "Los datos se leen directamente de la fuente oficial en SharePoint, el análisis aplica una lógica de comparación propia del negocio energético y el resultado se presenta en un tablero con la identidad visual de la empresa.",
    ],
    context: {
      paragraphs: [
        "En el mercado de energía no regulada, la principal palanca comercial es demostrar con cifras que el costo propio es más competitivo que el de la competencia a lo largo del tiempo. La comparación no es trivial: el CU cambia cada mes y depende del mercado, del nivel de tensión y del comercializador.",
        "Comparar un solo mes puede engañar: un competidor puede tener un mes puntual más barato y aun así ser más costoso en el acumulado. Además, la información viva reside en un libro de Excel corporativo, y trabajar sobre copias locales generaba inconsistencias y riesgo de usar datos desactualizados.",
      ],
      question: "¿Cuánto habría ahorrado este cliente en los últimos meses y en qué periodos fuimos realmente más competitivos?",
    },
    novelty:
      "No existe un producto comercial que resuelva la comparación de CU con esta lógica: por mercado y nivel de tensión, con promedios acumulados periodo a periodo y proyección de ahorro sobre el consumo real del cliente, integrado a la infraestructura corporativa.",
    challenges: [
      {
        title: "Algoritmo de comparación por promedio acumulado",
        text: "Recorre los periodos del más reciente hacia atrás y evalúa el promedio acumulado del CU propio frente al del competidor. Cada periodo se clasifica como Exitoso o de Atención, y los periodos que no existen en ambos comercializadores se concilian para comparar sobre una base homogénea.",
      },
      {
        title: "Lectura validada de la fuente corporativa",
        text: "La fuente es una tabla nombrada dentro de un Excel en SharePoint. La lectura valida el esquema de columnas antes de procesar, de modo que si la estructura cambia el análisis falla con un mensaje claro en lugar de producir resultados erróneos en silencio.",
      },
      {
        title: "Inicio de sesión corporativo en un entorno restringido",
        text: "OAuth2 sobre Azure AD dentro de las restricciones de aislamiento de marcos de la plataforma. La solución es un flujo de ventana emergente que se autentica, se cierra sola y deja la sesión lista. Fue el componente que más pruebas requirió.",
      },
      {
        title: "Sistema de diseño sobre un framework cerrado",
        text: "Paleta, tipografía, tarjetas, indicadores y tablas reutilizables sobre Streamlit, que no está pensado para ese nivel de personalización. Incluye técnicas propias para estilizar componentes que el framework no deja tocar directamente.",
      },
    ],
    method: [
      "Arquitectura por capas: la lógica de negocio son funciones puras, separadas de la interfaz.",
      "Funciones con contrato explícito: devuelven resultado y mensaje de error, y la interfaz decide cómo comunicarlo.",
      "Configuración externalizada y validada al arrancar, sin credenciales en el código.",
      "Git desde el primer commit y documentación técnica junto al código.",
    ],
    stack: [
      { label: "Python 3", value: "Núcleo de la aplicación" },
      { label: "Streamlit", value: "Interfaz de usuario y servidor" },
      { label: "Pandas", value: "Transformación y cálculo sobre los datos" },
      { label: "Plotly", value: "Gráficos interactivos de comparación" },
      { label: "openpyxl", value: "Extracción de la tabla de origen y exportación" },
      { label: "Azure AD · Graph API", value: "Autenticación y descarga desde SharePoint" },
    ],
    architecture: [
      { label: "app.py", value: "Punto de entrada: validación, autenticación y enrutamiento" },
      { label: "auth/", value: "Azure AD y cliente de SharePoint" },
      { label: "config/", value: "Constantes, validación y estilos" },
      { label: "ui/", value: "Tablero, carga, comparación y ahorro" },
      { label: "utils/", value: "Lógica de negocio pura" },
    ],
    flow: [
      "Valida la configuración al arrancar.",
      "Autentica al usuario contra Azure AD.",
      "Descarga el archivo de tarifas de SharePoint con los permisos del usuario.",
      "Lee y valida la tabla, normaliza tipos y ordena.",
      "El usuario elige mercado, comercializadores, nivel de tensión y rango de periodos.",
      "El algoritmo calcula y clasifica cada periodo.",
      "Presenta el tablero, el gráfico y el ahorro, con exportación a Excel.",
    ],
    features: [
      { title: "Carga automática desde SharePoint", text: "Resume el universo de datos disponible y garantiza el uso del dato oficial." },
      { title: "Comparación multi-competidor", text: "La comercializadora propia frente a hasta tres competidores a la vez." },
      { title: "Clasificación por periodo", text: "Cada periodo queda marcado como Exitoso o de Atención según el promedio acumulado." },
      { title: "Gráfico interactivo", text: "Evolución del CU, clara para presentarla al cliente." },
      { title: "Ahorro proyectado", text: "Ahorro absoluto, porcentual y mensual a partir del consumo del cliente, con la fórmula a la vista." },
      { title: "Exportación a Excel", text: "Un archivo por comercializador comparado, como soporte de la oferta." },
    ],
    screens: [
      {
        mock: "tarifas-config",
        title: "Configuración y periodo a periodo",
        caption: "Se elige el mercado, los competidores y el rango; la tabla marca cada periodo como Exitoso o de Atención.",
      },
      {
        mock: "tarifas-ahorro",
        title: "Ahorro proyectado",
        caption: "Con el consumo del cliente se calcula el ahorro del periodo y se muestra la fórmula, de modo que el resultado se puede auditar.",
      },
    ],
    impact: {
      stats: [
        { value: "~3 min", label: "por comparación, antes ~1 h" },
        { value: "4–8", label: "análisis al día" },
        { value: "+10", label: "ejecutivos usuarios" },
        { value: "~10 mil", label: "registros de tarifas procesados" },
      ],
      rows: [
        { indicator: "Tiempo de una comparación", before: "~1 hora, manual en Excel", after: "~3 minutos" },
        { indicator: "Fuente de datos", before: "Copias locales, riesgo de desactualización", after: "Dato oficial y vigente desde SharePoint" },
        { indicator: "Consistencia del análisis", before: "Variable según el analista", after: "Lógica única y estandarizada" },
      ],
      closing:
        "Convirtió un análisis disperso y manual en un argumento de venta cuantificado y verificable, alineado con la infraestructura corporativa y con una presentación a la altura de una oferta comercial.",
    },
  },
  {
    slug: "liquidacion-agpe",
    title: "Liquidación AGPE",
    excerpt: "Liquida a los autogeneradores a pequeña escala según la regulación colombiana y genera el reporte al mercado y el anexo de factura.",
    date: "2026-01",
    tags: ["Python", "Pandas", "Excel", "Regulación CREG"],
    featured: true,
    anonymized: true,
    hero: "agpe-hero",
    lead: "Cálculo regulatorio hora a hora, reporte en formato oficial y anexo por usuario, automatizados de extremo a extremo.",
    facts: [
      { label: "Tipo", value: "Aplicación web interna, software a la medida" },
      { label: "Rol", value: "Diseño, desarrollo y puesta en producción" },
      { label: "Estado", value: "En producción, uso mensual" },
      { label: "Usuarios", value: "Áreas de facturación y operaciones comerciales" },
      { label: "Marco", value: "Resolución CREG 174 de 2021, artículo 26" },
      { label: "Stack", value: "Python, Streamlit, Pandas, openpyxl, MSAL" },
      { label: "Despliegue", value: "Azure App Service" },
    ],
    summary: [
      "Automatiza la liquidación de la energía de los usuarios con Autogeneración a Pequeña Escala (AGPE). Toma las lecturas horarias de energía importada y exportada, calcula los excedentes de tipo 1 y tipo 2 hora a hora, los valora según la tarifa del periodo y el precio de bolsa, y produce la liquidación económica de cada usuario.",
      "Con el mismo cálculo genera el archivo regulatorio en el formato exacto que exige el operador del mercado y el anexo de energía que se adjunta a la factura de cada usuario.",
    ],
    context: {
      paragraphs: [
        "Un usuario AGPE entrega sus excedentes a la red y recibe una compensación. La regulación divide esos excedentes en dos tipos con reglas de valoración distintas, y la separación no es un total mensual: se resuelve hora a hora, acumulando cronológicamente hasta alcanzar la energía que el usuario importó.",
        "El excedente tipo 2 se valora al precio de bolsa, que cambia cada hora de cada día. Además, el mercado exige un archivo con formato estricto y la factura de cada usuario debe llevar su matriz horaria. Hacerlo a mano para cientos de usuarios y 24 horas por día es inviable de forma confiable.",
      ],
      question: "¿Cuánto se le debe pagar o cobrar a cada usuario este mes, según la fórmula regulatoria, y cómo lo entregamos en el formato exacto que exige el mercado?",
    },
    novelty:
      "No existe un producto comercial que aplique esta regla: separación de excedentes por llenado horario cronológico, valoración diferenciada por costo unitario y por precio de bolsa horario, y generación del archivo oficial, integrado a la infraestructura corporativa.",
    challenges: [
      {
        title: "Separación horaria de excedentes tipo 1",
        text: "Recorre la energía exportada en orden cronológico y acumula hora a hora hasta alcanzar el tope importado. En la hora exacta en que se alcanza, parte la casilla y asigna solo la fracción que falta. No se resuelve con una suma ni con un mínimo mensual.",
      },
      {
        title: "Excedente tipo 2 por diferencia condicionada",
        text: "Compara la matriz de tipo 1 contra la exportada original con tres casos por casilla: antes del tope es cero, en la hora del cruce es la diferencia y después del tope es todo lo exportado. Encadenar ese estado durante todo el mes exigió mucha verificación.",
      },
      {
        title: "Archivo regulatorio con layout estricto",
        text: "Layout de salida propio con 24 columnas horarias, mapeo de fuentes de energía a los códigos oficiales, normalización de identificadores y convenciones de formato fijas, con validaciones y advertencias cuando falta un insumo.",
      },
      {
        title: "Anexo por usuario sobre una plantilla Excel",
        text: "Genera un libro con una hoja por usuario clonando la plantilla: preserva el formato heredado, escribe sobre celdas combinadas, ajusta el rango de la tabla nombrada y limpia las filas sobrantes, para que cada anexo salga impecable.",
      },
      {
        title: "Escritura segura de vuelta en SharePoint",
        text: "La aplicación también escribe: crea de forma idempotente la estructura de carpetas por año y mes y sube el archivo generado, con manejo diferenciado de errores de permisos. El inicio de sesión usa un estado firmado con expiración contra CSRF.",
      },
    ],
    method: [
      "La fórmula regulatoria vive en funciones puras y verificables, aparte de la interfaz.",
      "Detección preventiva de fechas duplicadas: se informa antes de liquidar, no después.",
      "Lectura de tablas nombradas recorriendo todas las hojas del libro de origen.",
      "Versionado en Git y documentación mantenida junto al código.",
    ],
    stack: [
      { label: "Python 3", value: "Núcleo de la aplicación" },
      { label: "Streamlit", value: "Interfaz y servidor" },
      { label: "Pandas", value: "Cálculo horario de excedentes y liquidación" },
      { label: "openpyxl", value: "Tablas nombradas y exportación con formato" },
      { label: "MSAL · OAuth2", value: "Inicio de sesión corporativo" },
      { label: "Graph API · Azure", value: "Lectura y escritura en SharePoint, despliegue" },
    ],
    architecture: [
      { label: "app.py", value: "Orquestador y enrutador de los tres módulos" },
      { label: "auth/", value: "Azure AD y cliente de SharePoint" },
      { label: "ui/", value: "Liquidación, impresión de matrices y archivo del mercado" },
      { label: "utils/", value: "Liquidación, matrices, exportación y generador del archivo" },
    ],
    flow: [
      "Carga tarifas, usuarios, precios de bolsa y matrices desde SharePoint.",
      "Valida la integridad: fechas duplicadas por usuario y tipo de energía.",
      "Resume la energía por usuario antes de liquidar.",
      "Genera la matriz de excedentes tipo 1 y luego la de tipo 2.",
      "Liquida por usuario: valoración del excedente, contribución, alumbrado y total.",
      "Exporta a Excel, imprime las matrices y publica el archivo del mercado en SharePoint.",
    ],
    features: [
      { title: "Liquidación por usuario", text: "Valoración del excedente, contribución, alumbrado público y total a pagar, de forma auditable." },
      { title: "Matrices Exc1 y Exc2", text: "Generación hora a hora con el resumen de energía por usuario." },
      { title: "Impresión de matrices", text: "Una hoja por usuario sobre plantilla corporativa, con barra de progreso para lotes grandes." },
      { title: "Archivo del mercado", text: "Generado en el formato oficial y publicado en SharePoint por año y mes." },
      { title: "Validación de integridad", text: "Evita liquidaciones erróneas por datos de origen inconsistentes." },
      { title: "Exportación con formato", text: "Todas las tablas a Excel con formato de moneda." },
    ],
    screens: [
      {
        mock: "agpe-liquidacion",
        title: "Liquidación por usuario",
        caption: "Resumen del periodo y tabla con la valoración del excedente y el total a pagar de cada usuario.",
      },
      {
        mock: "agpe-xm",
        title: "Archivo del mercado y anexo",
        caption: "Generación del archivo oficial con su vista previa y de las hojas por usuario para la factura.",
      },
    ],
    impact: {
      stats: [
        { value: "~5 min", label: "por liquidación, antes más de 12 h" },
        { value: "~3 min", label: "para las matrices, antes más de 5 h" },
        { value: "~250", label: "usuarios liquidados por periodo" },
        { value: "3", label: "salidas: liquidación, reporte y anexo" },
      ],
      rows: [
        { indicator: "Liquidación de un periodo", before: "Más de 12 horas, manual en Excel", after: "~5 minutos" },
        { indicator: "Matrices horarias por usuario", before: "Más de 5 horas, propensas a errores", after: "~3 minutos, formato uniforme" },
        { indicator: "Cálculo hora a hora", before: "Errores de arrastre", after: "Automático y consistente" },
        { indicator: "Archivo para el mercado", before: "Manual, riesgo de rechazo", after: "Formato exacto, generado" },
      ],
      closing:
        "Cubre de extremo a extremo las tres salidas del proceso: la liquidación económica, el reporte al mercado y el documento que ve el cliente. Redujo el riesgo de error y estandarizó un proceso que dependía del cuidado manual de cada analista.",
    },
  },
  {
    slug: "indicadores-saidi-saifi",
    title: "Indicadores SAIDI-SAIFI y Formularios SUI",
    excerpt: "Calcula los indicadores de calidad del servicio de distribución y arma el formulario regulatorio mes a mes.",
    date: "2026-06",
    tags: ["Python", "Streamlit", "SharePoint", "Regulación CREG"],
    featured: true,
    anonymized: true,
    hero: "saidi-hero",
    lead: "Un pipeline de cuatro pasos que va de los archivos diarios de interrupciones al formulario mensual, con una arquitectura de módulos que crece sin tocar el núcleo.",
    facts: [
      { label: "Tipo", value: "Aplicación web interna, modular" },
      { label: "Rol", value: "Diseño, desarrollo y puesta en producción" },
      { label: "Estado", value: "Módulo SAIDI-SAIFI en producción; los demás formularios, planificados" },
      { label: "Marco", value: "CREG 015 de 2018 y formularios del SUI" },
      { label: "Stack", value: "Python, Streamlit, Pandas, openpyxl" },
      { label: "Integraciones", value: "Azure AD y SharePoint multi-sitio vía Graph API" },
    ],
    summary: [
      "Calcula los indicadores de duración (SAIDI) y frecuencia (SAIFI) de las interrupciones de una red de distribución, los consolida por año y genera el formulario mensual que se reporta al regulador.",
      "La aplicación está pensada como una plataforma: cada formulario es un módulo que se descubre solo, con su propio contrato, rutas y servicios, de modo que sumar uno nuevo no exige modificar el núcleo.",
    ],
    context: {
      paragraphs: [
        "La regulación define cómo se mide la calidad del servicio: la duración y la frecuencia de las interrupciones, ponderadas por los usuarios que cuelgan de cada transformador y separadas entre programadas y no programadas. Los datos llegan como archivos diarios, y se deben cruzar con el inventario de transformadores y con el reporte mensual de usuarios.",
        "Cada mes el resultado alimenta un consolidado anual, una tabla histórica y un formulario que se carga a la plataforma del regulador. Hacer esa cadena a mano exige abrir decenas de archivos y repetir cruces que fallan en silencio.",
      ],
      question: "¿Cuál fue el SAIDI y el SAIFI de este mes, cómo se explican por transformador y cómo se arma el formulario sin errores de arrastre?",
    },
    novelty:
      "Es una solución específica del reporte regulatorio de un distribuidor: cruza interrupciones, inventario y usuarios, mantiene una tabla histórica por transformador y arma el formulario, todo sobre varios sitios de SharePoint.",
    challenges: [
      {
        title: "Cálculo ponderado por transformador",
        text: "SAIDI y SAIFI se calculan por separado para interrupciones programadas y no programadas, ponderando por usuarios, y se suman al final. Una columna de aplicabilidad decide qué eventos entran, según los criterios de exclusión de la norma.",
      },
      {
        title: "Dependencias entre pasos con validación",
        text: "Cada paso exige los resultados de los anteriores: el formulario necesita el consolidado del año y los pasos 1 y 2 de cada mes hasta el elegido. La aplicación verifica esas dependencias, informa los archivos faltantes y evita generar un formulario incompleto.",
      },
      {
        title: "SharePoint multi-sitio y rutas por periodo",
        text: "Los insumos viven en sitios distintos y en carpetas por año y mes, con variantes con y sin cero a la izquierda. Un cliente de Graph y un servicio de dominio encapsulan el descubrimiento de rutas, y el Excel maestro con tablas nombradas se actualiza de forma controlada.",
      },
      {
        title: "Arquitectura modular con descubrimiento automático",
        text: "Cada módulo declara su metadata y expone un contrato único. El enrutador los descubre al arrancar. Se apoya en un tipo de resultado unificado, un almacén de caché genérico y servicios sin estado, así que los módulos pendientes se agregan sin tocar el núcleo.",
      },
    ],
    method: [
      "Servicios de dominio sin estado y con resultados tipados (dataclasses), fáciles de probar.",
      "Una sola fuente para las variables de entorno y un mapa documentado de sitios y rutas.",
      "Pruebas automatizadas del módulo de cálculo.",
      "Guías técnicas versionadas (negocio y arquitectura) pensadas para trabajar con asistentes de IA.",
    ],
    stack: [
      { label: "Python 3", value: "Núcleo y servicios de dominio" },
      { label: "Streamlit", value: "Interfaz y navegación por módulos" },
      { label: "Pandas", value: "Cruces y cálculo de indicadores" },
      { label: "openpyxl", value: "Tablas nombradas y formularios" },
      { label: "Azure AD · Graph API", value: "Autenticación y SharePoint multi-sitio" },
      { label: "PyInstaller", value: "Ejecutable de escritorio opcional" },
    ],
    architecture: [
      { label: "core/auth", value: "Azure AD y cliente de Graph multi-sitio" },
      { label: "core/config", value: "Constantes, ajustes, enrutador y sesión" },
      { label: "core/services", value: "Servicio de SharePoint, caché y resultado unificado" },
      { label: "modules/…", value: "Un directorio por formulario, con ui, rutas, servicios y almacenes" },
    ],
    flow: [
      "Paso 1: lee los archivos diarios y los cruza con el inventario para generar el resumen mensual.",
      "Paso 2: calcula SAIDI y SAIFI por transformador y actualiza la tabla histórica.",
      "Paso 3: consolida el año y actualiza la tabla de indicadores.",
      "Paso 4: genera el formulario mensual con los resultados anteriores.",
    ],
    features: [
      { title: "Resumen del mes", text: "Cruza interrupciones con el inventario y avisa de transformadores nuevos." },
      { title: "Cálculo por transformador", text: "SAIDI y SAIFI programados y no programados, con el total del periodo." },
      { title: "Consolidado anual", text: "Todos los meses disponibles, con los archivos faltantes a la vista." },
      { title: "Formulario del regulador", text: "Generado a partir de los pasos previos y guardado por año." },
      { title: "Histórico en el Excel maestro", text: "La tabla de hechos y la de indicadores se actualizan sin pisar lo anterior." },
      { title: "Módulos por descubrimiento", text: "Cada formulario nuevo es un directorio con su contrato." },
    ],
    screens: [
      {
        mock: "saidi-pasos",
        title: "Flujo de cuatro pasos",
        caption: "Cada paso muestra su estado, sus advertencias y qué insumos necesita del anterior.",
      },
      {
        mock: "saidi-consolidado",
        title: "Consolidado anual",
        caption: "Indicadores por mes, con la comparación entre programadas y no programadas y los archivos faltantes.",
      },
    ],
    impact: {
      stats: [
        { value: "~10 min", label: "por periodo, antes varias horas" },
        { value: "4", label: "pasos encadenados y validados" },
        { value: "5", label: "formularios previstos en la plataforma" },
        { value: "2", label: "sitios de SharePoint integrados" },
      ],
      rows: [
        { indicator: "Preparación mensual del reporte", before: "Varias horas entre archivos y hojas", after: "~10 minutos" },
        { indicator: "Cruce de interrupciones e inventario", before: "Manual, fallas silenciosas", after: "Validado, con advertencias" },
        { indicator: "Histórico de indicadores", before: "Copias dispersas", after: "Tabla única en el Excel maestro" },
      ],
      closing:
        "Estandarizó un reporte mensual obligatorio y dejó una base reutilizable: los formularios que faltan se construyen como módulos, con el mismo contrato y las mismas herramientas.",
    },
  },
  {
    slug: "cargos-mercado-mayorista",
    title: "Cargos del Mercado Mayorista",
    excerpt: "Automatiza la descarga de cargos publicados por el operador del mercado, su carga a SharePoint y su procesamiento.",
    date: "2026-05",
    tags: ["Python", "Playwright", "Streamlit", "ELT"],
    featured: false,
    anonymized: true,
    hero: "mem-hero",
    lead: "Un flujo ELT en cuatro pasos que automatiza un portal sin API: descarga, carga y procesamiento de los cargos de uso de la red.",
    facts: [
      { label: "Tipo", value: "Aplicación web interna y ejecutable de escritorio" },
      { label: "Rol", value: "Diseño, desarrollo y empaquetado" },
      { label: "Estado", value: "En uso; los reportes tarifarios completos, pendientes" },
      { label: "Marco", value: "CREG 015 de 2018 (cargos del sistema de distribución)" },
      { label: "Stack", value: "Python, Streamlit, Playwright, Pandas, openpyxl" },
      { label: "Integraciones", value: "Portal del operador del mercado y SharePoint vía Graph API" },
    ],
    summary: [
      "Cada mes el operador del mercado publica en su portal los cargos que alimentan la tarifa de energía. Esta aplicación se conecta al portal, lista lo publicado, descarga los archivos del periodo elegido, los sube al SharePoint del equipo y procesa los libros de cargos.",
      "El portal no ofrece API, así que la extracción se hace con un navegador automatizado, y la herramienta se puede usar desde la web o como ejecutable de escritorio.",
    ],
    context: {
      paragraphs: [
        "El equipo de mercado necesitaba tener cada mes los cargos publicados, organizados en SharePoint y listos para calcular tarifas. El proceso era manual: entrar al portal con una cuenta distinta a la corporativa, buscar los archivos, descargarlos uno a uno, renombrarlos y subirlos.",
        "Es un trabajo repetitivo, sin margen de error, y que depende de una sola persona con acceso.",
      ],
      question: "¿Cómo dejamos cada mes los archivos correctos en el sitio del equipo, sin repetir una tarea manual que no escala?",
    },
    novelty:
      "Resuelve la extracción de un portal sin API, con dos identidades distintas (la del portal y la corporativa), y entrega el resultado como una herramienta que cualquier usuario puede ejecutar sin instalar un entorno de desarrollo.",
    challenges: [
      {
        title: "Automatizar un portal sin API",
        text: "Un navegador controlado con Playwright se conecta al portal, lista las fuentes publicadas y descarga los archivos del periodo elegido, con mensajes claros de estado en cada paso.",
      },
      {
        title: "Dos identidades en el mismo flujo",
        text: "El portal exige una cuenta Microsoft distinta de la corporativa, que se usa para SharePoint. Las credenciales de cada una se manejan por separado y nunca se incrustan en el código.",
      },
      {
        title: "Ejecutable autocontenido",
        text: "El empaquetado incluye Streamlit, un lanzador que carga la configuración junto al ejecutable y una carpeta con el navegador. Se distribuye en una carpeta de SharePoint sin instalar Python en cada equipo.",
      },
      {
        title: "Despliegue en la nube con navegador",
        text: "Correr un navegador automatizado en un hosting gestionado exigió dependencias de sistema, un arranque que instala el navegador en frío y fijar versiones compatibles de las librerías y de Python.",
      },
    ],
    method: [
      "Pasos secuenciales con estado visible: cada uno habilita el siguiente.",
      "Un registro de módulos que deja espacio para nuevas funciones sin reescribir la navegación.",
      "Manual de usuario y guía de empaquetado versionados junto al código.",
    ],
    stack: [
      { label: "Python 3", value: "Núcleo y servicios" },
      { label: "Streamlit", value: "Interfaz por pasos" },
      { label: "Playwright", value: "Navegador automatizado para el portal" },
      { label: "Pandas · openpyxl", value: "Procesamiento de los libros de cargos" },
      { label: "Azure AD · Graph API", value: "Carga a SharePoint" },
      { label: "PyInstaller", value: "Ejecutable de escritorio" },
    ],
    architecture: [
      { label: "app.py", value: "Orquestador: autenticación, encabezado y enrutador" },
      { label: "config/", value: "Constantes, registro de módulos y estilos" },
      { label: "ui/", value: "Navegación, enrutador y los cuatro pasos del módulo" },
      { label: "services/", value: "Portal, descarga, SharePoint y procesamiento" },
    ],
    flow: [
      "Conecta al portal y lista los archivos publicados.",
      "Descarga los del periodo elegido, por tipo de cargo.",
      "Los sube al sitio de SharePoint del equipo.",
      "Procesa los libros de cargos y genera el archivo de salida.",
    ],
    features: [
      { title: "Conexión al portal", text: "Estado visible y listado de lo publicado." },
      { title: "Descarga por periodo", text: "Elige el tipo, el año y el mes; una o ambas fuentes." },
      { title: "Carga a SharePoint", text: "Con prueba de conexión previa." },
      { title: "Procesamiento de cargos", text: "Lectura de los libros y generación del archivo de salida." },
      { title: "Ejecutable de escritorio", text: "Para usuarios sin entorno de desarrollo." },
      { title: "Despliegue web", text: "Alternativa en la nube con el navegador incluido." },
    ],
    screens: [
      {
        mock: "mem-descarga",
        title: "Listado y descarga",
        caption: "Se eligen las fuentes y el periodo, y se marca lo que se va a descargar con el avance de cada archivo.",
      },
      {
        mock: "mem-proceso",
        title: "Carga y procesamiento",
        caption: "Los últimos dos pasos con el estado de la subida a SharePoint y el registro del procesamiento.",
      },
    ],
    impact: {
      stats: [
        { value: "~5 min", label: "por mes, antes ~40 min" },
        { value: "4", label: "pasos automatizados" },
        { value: "2", label: "tipos de cargo soportados" },
        { value: "0", label: "instalaciones de Python en los equipos" },
      ],
      rows: [
        { indicator: "Obtención mensual de los cargos", before: "~40 minutos, descarga manual", after: "~5 minutos, flujo guiado" },
        { indicator: "Orden en SharePoint", before: "Depende de quien suba", after: "Estructura uniforme por periodo" },
        { indicator: "Dependencia de una persona", before: "Alta", after: "Cualquier usuario autorizado" },
      ],
      closing:
        "Convirtió una tarea manual y frágil en un flujo guiado y repetible, y dejó la base para los reportes tarifarios que se construyen sobre esos cargos.",
    },
  },
  {
    slug: "pipeline-aenc-tfroc",
    title: "Pipeline AENC/TFROC",
    excerpt: "De una app guiada a un proceso desatendido en Docker: descarga de un FTP, carga a SharePoint y actualización de consumos y demanda.",
    date: "2026-03",
    tags: ["Python", "Docker", "Cron", "Azure AD"],
    featured: false,
    anonymized: true,
    hero: "aenc-hero",
    lead: "El mismo motor de negocio, primero como aplicación con interfaz y luego como proceso diario sin intervención y sin navegador.",
    facts: [
      { label: "Tipo", value: "App guiada y versión desatendida" },
      { label: "Rol", value: "Diseño, desarrollo y despliegue" },
      { label: "Estado", value: "App en uso; versión desatendida en despliegue" },
      { label: "Fuente", value: "Servidor FTP del operador del mercado" },
      { label: "Stack", value: "Python, Streamlit, Pandas, Docker, cron" },
      { label: "Integraciones", value: "SharePoint vía Graph API, autenticación de aplicación con certificado" },
    ],
    summary: [
      "El operador del mercado publica cada día archivos de consumos y de fronteras en un servidor FTP. El proyecto los descarga, los sube a SharePoint, los procesa y actualiza los archivos anuales de consumo y de demanda.",
      "Nació como una aplicación con interfaz de cuatro pasos y evolucionó a una versión desatendida: se ejecuta sola en un contenedor, con una programación diaria, y deja un registro de estado de cada corrida.",
    ],
    context: {
      paragraphs: [
        "Los archivos llegan en varias versiones: preliminares y una final. El mes anterior se reprocesa mientras sigan siendo preliminares y una última vez cuando pasan a final. Seguir ese rastro a mano, cada día y para tres tipos de información, es una fuente constante de errores.",
        "Una vez estable el proceso guiado, el siguiente paso natural era sacar a la persona del medio.",
      ],
      question: "¿Cómo dejamos que el proceso corra solo cada día, sepa qué versión ya procesó y avise con claridad cuando algo falla?",
    },
    novelty:
      "Una regla de reprocesamiento por versión con marcador durable, y un motor de negocio reutilizado sin cambios entre una interfaz web y un proceso por lotes.",
    challenges: [
      {
        title: "Prioridad de versiones y reprocesamiento",
        text: "Entre las versiones de un archivo gana la final sobre las preliminares. El mes anterior se reprocesa mientras haya preliminares y una vez más al llegar la final. Un marcador durable entre corridas recuerda la última versión procesada.",
      },
      {
        title: "Reutilizar el motor sin la interfaz",
        text: "El motor de negocio ya estaba desacoplado de la UI. La versión por lotes lo reutiliza y sustituye la capa de Streamlit por un reportero basado en logging, así que no hay dos copias de la lógica.",
      },
      {
        title: "Autenticación sin usuario",
        text: "La aplicación se autentica a sí misma con un certificado y obtiene un token de aplicación, con permisos limitados y consentimiento de administrador, en lugar de depender del inicio de sesión de una persona.",
      },
      {
        title: "Estado diario y fallo controlado",
        text: "Cada paso confirma el éxito del anterior y, si una sección falla, la siguiente no corre. Cada corrida deja un archivo de estado, primero local y luego en SharePoint, y termina con un código de salida que dice si todo salió bien.",
      },
    ],
    method: [
      "Secciones y pasos con confirmación explícita antes de continuar.",
      "Credenciales que rotan leídas en cada corrida desde un archivo montado, sin reconstruir la imagen.",
      "Guías de despliegue y de configuración de Azure versionadas.",
    ],
    stack: [
      { label: "Python 3", value: "Motor de negocio y orquestador" },
      { label: "Pandas", value: "Procesamiento día a día" },
      { label: "Streamlit", value: "Interfaz de la versión guiada" },
      { label: "Docker · cron", value: "Ejecución programada y desatendida" },
      { label: "Graph API", value: "SharePoint con token de aplicación" },
      { label: "PyInstaller", value: "Ejecutable de la versión guiada" },
    ],
    architecture: [
      { label: "run_batch.py", value: "Orquestador y punto de entrada" },
      { label: "orchestrator/", value: "Consumos, fronteras y falla/hurto" },
      { label: "runtime/", value: "Reportero con logging y estado diario" },
      { label: "services/ · utils/", value: "Motor de negocio compartido con la app" },
    ],
    flow: [
      "Descarga del FTP y subida a SharePoint, para el mes actual y el anterior.",
      "Procesa los datos de consumo.",
      "Actualiza el archivo anual de consumo y el de demanda.",
      "Actualiza fronteras y falla/hurto, cada una como sección propia.",
      "Escribe el estado del día y termina con su código de salida.",
    ],
    features: [
      { title: "Prioridad de versiones", text: "Final sobre preliminares, con limpieza de lo reemplazado." },
      { title: "Tres secciones", text: "Consumos, fronteras y falla/hurto, en orden y con control de errores." },
      { title: "Ejecución programada", text: "Cron interno en un contenedor, con corrida manual cuando se necesita." },
      { title: "Estado diario", text: "Registro por sección y por paso, local y en SharePoint." },
      { title: "Configuración rotativa", text: "Cambiar credenciales no exige reconstruir nada." },
      { title: "Versión guiada", text: "La misma lógica con interfaz de cuatro pasos y ejecutable." },
    ],
    screens: [
      {
        mock: "aenc-registro",
        title: "Registro de una corrida",
        caption: "Salida del proceso desatendido: cada sección y paso con su resultado y el cierre del día.",
      },
      {
        mock: "aenc-versiones",
        title: "Versiones y estado del día",
        caption: "La regla de versiones sobre un mes y el archivo de estado que deja cada corrida.",
      },
    ],
    impact: {
      stats: [
        { value: "3", label: "secciones, 9 pasos encadenados" },
        { value: "~30 min", label: "diarios de trabajo manual evitados" },
        { value: "0", label: "clics y 0 navegadores" },
        { value: "1", label: "motor de negocio para dos versiones" },
      ],
      rows: [
        { indicator: "Ejecución diaria", before: "Una persona recorre los pasos", after: "Automática, con cron" },
        { indicator: "Control de versiones del archivo", before: "Seguimiento manual", after: "Marcador durable por mes" },
        { indicator: "Visibilidad del resultado", before: "Se sabe al revisar", after: "Estado diario y código de salida" },
      ],
      closing:
        "Mostró cómo evolucionar una herramienta guiada hacia un proceso desatendido sin duplicar la lógica: el mismo motor, dos formas de ejecutarlo.",
    },
  },
  {
    slug: "ai-radar",
    title: "AI Radar",
    excerpt: "Convierte el ruido de noticias, repos y papers de IA en cinco señales diarias accionables, con API y dashboard.",
    date: "2026-05",
    tags: ["Node.js", "Supabase", "Vercel", "Playwright"],
    featured: false,
    anonymized: false,
    hero: "radar-hero",
    lead: "Un radar diario que separa lo que importa del ruido: qué pasó, por qué importa, qué tan confiable es y qué vale la pena probar.",
    facts: [
      { label: "Tipo", value: "Proyecto personal, curso avanzado de Codex" },
      { label: "Rol", value: "Producto, diseño y desarrollo" },
      { label: "Estado", value: "En construcción por capas" },
      { label: "Stack", value: "Node.js 24, Supabase (Postgres), Vercel Functions" },
      { label: "Calidad", value: "Pruebas de dominio con node:test y E2E con Playwright" },
    ],
    summary: [
      "AI Radar organiza noticias, herramientas, papers, repos y lanzamientos de IA para convertirlos en señales accionables para quien construye producto: qué ocurrió, por qué importa, qué tan confiable es y qué conviene probar.",
      "Cada día se guarda una captura de exactamente cinco señales con su contexto y fuentes, y un dashboard la consulta a través de una API propia.",
    ],
    context: {
      paragraphs: [
        "El ritmo de la IA genera demasiado ruido: lanzamientos repetidos en varias fuentes, repos que parecen importantes pero no tienen adopción, demos sin documentación y herramientas con impacto real mezcladas con marketing.",
      ],
      question: "¿Qué pasó hoy en IA que realmente vale la pena probar, y con qué evidencia?",
    },
    novelty:
      "Un producto con contrato de datos explícito: un JSON Schema valida cada captura y la escritura reemplaza el día completo de forma atómica, de modo que nunca quedan datos a medias.",
    challenges: [
      {
        title: "Contrato de datos validado",
        text: "Cada captura diaria se valida con un esquema y comprobaciones de fechas, identificadores, URLs y etiquetas, y se exigen exactamente cinco señales. Existen fixtures y un script de validación.",
      },
      {
        title: "Escritura idempotente y atómica",
        text: "Una captura reemplaza por completo las señales y fuentes del día, de modo que repetir la importación produce el mismo resultado. Un modo de ensayo muestra qué cambiaría antes de escribir.",
      },
      {
        title: "Permisos separados y secretos en el servidor",
        text: "Hay un token de lectura y otro de escritura, distintos. El navegador nunca recibe secretos: las funciones del dashboard los inyectan desde el entorno del servidor. La base usa RLS sin acceso para roles públicos.",
      },
      {
        title: "Sin respaldo silencioso",
        text: "El dashboard usa solo la API real y falla de forma explícita si la base no responde; no cae a datos locales. Una prueba E2E verifica que la API real carga las cinco señales en el navegador.",
      },
    ],
    method: [
      "Se construye por capas: dominio, aplicación e infraestructura separados.",
      "Reglas de trabajo para agentes de IA versionadas junto al código.",
      "Despliegue sin paso de compilación: frontend estático y funciones en Vercel.",
    ],
    stack: [
      { label: "Node.js 24", value: "Dominio, scripts y API" },
      { label: "Supabase", value: "Postgres con RLS" },
      { label: "Vercel", value: "Frontend estático y Functions" },
      { label: "Ajv", value: "Validación con JSON Schema" },
      { label: "Playwright", value: "Pruebas de extremo a extremo" },
    ],
    architecture: [
      { label: "src/", value: "Dominio, aplicación e infraestructura" },
      { label: "api/", value: "Vercel Functions con los adaptadores" },
      { label: "data/contracts/", value: "Esquema JSON de la captura diaria" },
      { label: "scripts/", value: "Importación, validación y consulta" },
      { label: "supabase/", value: "Migraciones reproducibles" },
    ],
    flow: [
      "Se genera la captura del día con cinco señales.",
      "Se valida contra el esquema.",
      "Se importa en modo ensayo y luego se aplica.",
      "La API sirve las capturas y señales con el token de lectura.",
      "El dashboard muestra el día o una fecha histórica.",
    ],
    features: [
      { title: "Cinco señales al día", text: "Ordenadas por novedad, impacto, evidencia y accionabilidad." },
      { title: "Historial", text: "Consulta de hasta 100 capturas persistidas." },
      { title: "Guía práctica", text: "Qué vale la pena probar y por qué." },
      { title: "API con permisos", text: "Rutas de lectura y de escritura con tokens separados." },
      { title: "Importación segura", text: "Ensayo previo y verificación de paridad al aplicar." },
      { title: "Dashboard", text: "Selector de periodo sobre la API real." },
    ],
    screens: [
      {
        mock: "radar-senal",
        title: "Detalle de una señal",
        caption: "Qué pasó, por qué importa, qué tan confiable es la evidencia y qué conviene probar.",
      },
      {
        mock: "radar-historial",
        title: "Historial y estado de la API",
        caption: "Selector de capturas persistidas y el estado de las rutas de lectura y escritura.",
      },
    ],
    impact: {
      stats: [
        { value: "5", label: "señales por captura diaria" },
        { value: "100", label: "capturas consultables" },
        { value: "2", label: "tokens con permisos separados" },
        { value: "E2E", label: "con la API real en el navegador" },
      ],
      rows: [
        { indicator: "Lectura diaria de novedades", before: "Decenas de fuentes y duplicados", after: "Cinco señales con contexto" },
        { indicator: "Calidad del dato", before: "Sin contrato", after: "Esquema validado y escritura atómica" },
        { indicator: "Secretos en el navegador", before: "—", after: "Ninguno" },
      ],
      closing:
        "Es un proyecto en marcha: lo que ya existe es el contrato de datos, la persistencia y la API con su dashboard, y el trabajo siguiente es la recopilación y el ranking automático de fuentes.",
    },
  },
];
