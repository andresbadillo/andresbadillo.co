/**
 * Contenido de /about. Cada texto lleva español e inglés. `proof` son slugs de proyectos en Supabase.
 * Los empleadores no se nombran: el detalle de la trayectoria está en LinkedIn.
 */

export interface LocalizedText {
  es: string;
  en: string;
}

export interface AboutStat {
  value: LocalizedText;
  label: LocalizedText;
}

export interface AboutChapter {
  period: LocalizedText;
  title: LocalizedText;
  text: LocalizedText;
  proof: string[];
  visual?: "automation";
}

export interface AboutPrinciple {
  title: LocalizedText;
  text: LocalizedText;
}

export interface AboutStage {
  title: LocalizedText;
  key: string[];
  others: string[];
}

export interface AboutBand {
  label: LocalizedText;
  lead?: LocalizedText;
  key: string[];
  others: LocalizedText[];
}

export interface AboutEducation {
  period: LocalizedText;
  title: LocalizedText;
  place: string;
}

export const aboutTagline: LocalizedText = {
  es: "Convierto complejidad en software, datos y decisiones que generan impacto.",
  en: "Turning complexity into software, data, and decisions that drive impact.",
};

export const aboutIntro: { es: string[]; en: string[] } = {
  es: [
    "Soy ingeniero electrónico y candidato a MBA, con más de 14 años entre energía, petróleo y gas, y tecnología. Desde 2017 trabajo en el sector eléctrico de Colombia, a cargo de las operaciones que mantienen regulada, medida y bien facturada a una empresa de distribución y comercialización.",
    "Con el tiempo veía el mismo patrón: el proceso vivía en Excel, en la cabeza de alguien o en cinco versiones del mismo archivo. Empecé a construir el software, los modelos de datos y las automatizaciones para resolverlo. Quien entiende un proceso desde dentro es quien mejor puede mejorarlo.",
  ],
  en: [
    "I'm an electronic engineer and MBA candidate with more than 14 years across energy, oil & gas and technology. Since 2017 I've worked inside Colombia's power sector, running the operations that keep a distribution and retail utility regulated, measured and billing correctly.",
    "Over time I kept seeing the same pattern: the process lived in Excel, in someone's head, or in five versions of the same file. So I started building the software, data models and automations to fix it. The people who understand a process from the inside are the best placed to improve it.",
  ],
};

export const aboutStats: AboutStat[] = [
  { value: { es: "14+", en: "14+" }, label: { es: "años entre energía, petróleo y gas, y tecnología", en: "years across energy, oil & gas and technology" } },
  { value: { es: "5.4 GWh", en: "5.4 GWh" }, label: { es: "conectados a la red en 2025", en: "connected to the grid in 2025" } },
  { value: { es: "Hasta 10 h", en: "Up to 10 h" }, label: { es: "ahorradas cada semana con mis automatizaciones", en: "saved every week by my automations" } },
  { value: { es: "2019–27", en: "2019–27" }, label: { es: "cargos de distribución y plan de inversión presentados al regulador", en: "distribution charges and investment plan filed with the regulator" } },
];

export const aboutChapters: AboutChapter[] = [
  {
    period: { es: "2008 – 2016", en: "2008 – 2016" },
    title: { es: "Ingeniero, y después constructor de proyectos", en: "Engineer, then project builder" },
    text: {
      es: "Estudié ingeniería electrónica y pasé directo a los proyectos: coordinaba mantenimiento y obras, montaba procesos alineados con PMI, y armé y dirigí una PMO. Me especialicé en gerencia integral de proyectos y estructuré proyectos para llevar gas natural a los hogares. Ahí aprendí presupuestos, cronogramas y cómo mantener a un equipo en movimiento.",
      en: "I studied electronic engineering and went straight into projects: coordinating maintenance and construction work, setting up PMI-aligned processes, and building and running a PMO. I specialized in integral project management and structured projects to bring natural-gas service into homes. It taught me budgets, schedules and how to keep a team moving.",
    },
    proof: [],
  },
  {
    period: { es: "2017 – 2025", en: "2017 – 2025" },
    title: { es: "Dentro de la red", en: "Inside the grid" },
    text: {
      es: "Entré a una empresa de distribución y comercialización de energía y terminé liderando la gestión energética de su división técnica: el centro de control, el centro de gestión de medida, el sistema de gestión de activos y cada reporte regulatorio. Presenté al regulador los cargos de distribución y el plan de inversión 2019–2027, lideré la puesta en marcha del DMS en el centro de control, implementé un sistema de gestión de activos ISO 55001 y construí analítica en Power BI para el equipo técnico.",
      en: "I joined an electricity distribution and retail utility and ended up leading energy management for its technical division: the control center, the metering management center, the asset management system and every regulatory report. I presented the 2019–2027 distribution charges and investment plan to the regulator, led the DMS rollout in the control center, implemented an ISO 55001 asset management system and built Power BI analytics for the technical team.",
    },
    proof: ["indicadores-saidi-saifi"],
  },
  {
    period: { es: "2025", en: "2025" },
    title: { es: "Cuando Excel se volvió software", en: "Where Excel became software" },
    text: {
      es: "Las tarifas, la regulación y los datos horarios de energía seguían terminando en hojas de cálculo, así que empecé a convertirlos en herramientas: un comparador de tarifas, una liquidación automatizada para autogeneradores, pipelines de datos regulatorios. Python y Microsoft Power Platform se encargan hoy de trabajo que al equipo le costaba hasta 10 horas a la semana, y las apps de inteligencia competitiva le ahorran al equipo comercial hasta 2 horas al día.",
      en: "Tariffs, regulation and hourly energy data kept ending up in spreadsheets, so I started turning them into tools: a tariff comparison app, an automated settlement for self-generators, regulatory data pipelines. Python and the Microsoft Power Platform now take over work that cost the team up to 10 hours a week, and the competitive-intelligence apps save the sales team up to 2 hours a day.",
    },
    proof: ["comparador-tarifas-energia", "liquidacion-agpe", "pipeline-aenc-tfroc"],
    visual: "automation",
  },
  {
    period: { es: "Hoy", en: "Today" },
    title: { es: "Operación, datos y agentes de IA", en: "Operations, data and AI agents" },
    text: {
      es: "Dirijo Operaciones y Gestión: conexiones a la red, fronteras comerciales de medida, medición y posventa bajo el marco regulatorio de Colombia. Lo llevo con pipelines, pronósticos y tableros de SLA, backlog y seguimiento, y construyo con agentes de código como Claude Code, Codex y Cursor mientras termino el MBA.",
      en: "I head Operations & Management: grid connections, commercial metering boundaries, metering and after-sales under Colombia's regulatory framework. I run it with pipelines, forecasts and dashboards for SLA, backlog and tracking, and I build with AI coding agents such as Claude Code, Codex and Cursor while I finish my MBA.",
    },
    proof: ["cargos-mercado-mayorista", "ai-radar"],
  },
];

export const aboutPrinciples: AboutPrinciple[] = [
  {
    title: { es: "Orden antes que IA", en: "Order before AI" },
    text: {
      es: "Antes de sumar más IA pregunto dónde viven los datos y quién los entiende. Un modelo no puede decir cuál de cinco versiones de un archivo es la correcta. Primero una sola fuente de verdad, sistemas conectados y alguien del negocio sentado al lado de quien construye. Después la IA sí paga.",
      en: "Before adding more AI I ask where the data lives and who understands it. A model can't tell which of five file versions is the right one. First one source of truth, connected systems and someone from the business sitting next to whoever builds. Then AI pays off.",
    },
  },
  {
    title: { es: "Preparen. Fuego. Apunten.", en: "Prepare. Fire. Aim." },
    text: {
      es: "Planearlo todo primero hacía que las soluciones llegaran tarde. Ahora la versión uno funciona, la dos mejora con retroalimentación real y la tres se afina con datos. Entregar pronto es como una solución empieza a crear valor desde el día uno.",
      en: "Planning everything first meant solutions arrived late. Now version one works, version two improves with real feedback and version three is tuned with data. Shipping early is how a solution starts creating value on day one.",
    },
  },
  {
    title: { es: "Tecnología que devuelve tiempo", en: "Technology that gives time back" },
    text: {
      es: "La automatización no se trata de reemplazar personas. Les quita el trabajo mecánico del escritorio para que puedan pensar, analizar y decidir. Conocer el proceso desde dentro es lo que muestra dónde se están perdiendo las horas.",
      en: "Automation isn't about replacing people. It takes the mechanical work off their desks so they can think, analyze and decide. Knowing the process from the inside is what shows where the hours are being lost.",
    },
  },
];

export const aboutToolsIntro: LocalizedText = {
  es: "Cómo trabajo, del dato crudo a una herramienta que la gente usa todos los días.",
  en: "How I work, from raw data to a tool people use every day.",
};

export const aboutManagement: AboutBand = {
  label: { es: "Gestión", en: "Management" },
  key: ["PMI", "Scrum"],
  others: [{ es: "PMO", en: "PMO" }, { es: "ISO 55001", en: "ISO 55001" }],
};

export const aboutStages: AboutStage[] = [
  { title: { es: "Recoger", en: "Collect" }, key: ["SharePoint", "Supabase"], others: ["PostgreSQL", "Firebase", "Postman"] },
  { title: { es: "Analizar", en: "Analyze" }, key: ["Python", "SQL", "Pandas", "Power BI"], others: ["NumPy", "scikit-learn", "Matplotlib", "Jupyter", "DAX"] },
  { title: { es: "Construir", en: "Build" }, key: ["TypeScript", "React", "Flutter"], others: ["JavaScript", "HTML", "CSS", "Tailwind", "Vite", "Dart", "Android", "Figma"] },
  { title: { es: "Automatizar", en: "Automate" }, key: ["Streamlit", "Power Automate"], others: ["Power Apps", "Python scripts"] },
  { title: { es: "Publicar", en: "Ship" }, key: ["Git", "GitHub"], others: ["Vercel"] },
];

export const aboutAi: AboutBand = {
  label: { es: "Agentes de IA", en: "AI agents" },
  lead: { es: "En cada etapa:", en: "Across every stage:" },
  key: ["Claude Code", "Codex", "Cursor"],
  others: [{ es: "ingeniería de prompts", en: "prompt engineering" }],
};

export const aboutEducation: AboutEducation[] = [
  {
    period: { es: "2024 – actualidad", en: "2024 – present" },
    title: { es: "MBA, Administración y Dirección de Empresas", en: "MBA, Business Management and Administration" },
    place: "CORE School of Management, Universidad Autónoma de Bucaramanga",
  },
  {
    period: { es: "2011 – 2012", en: "2011 – 2012" },
    title: { es: "Especialización en Gerencia Integral de Proyectos", en: "Specialization in Integral Project Management" },
    place: "Universidad de Investigación y Desarrollo",
  },
  {
    period: { es: "2008 – 2011", en: "2008 – 2011" },
    title: { es: "Ingeniería Electrónica", en: "Electronic Engineering" },
    place: "Universidad de Investigación y Desarrollo",
  },
];

export const aboutLanguages: { value: LocalizedText; label: LocalizedText }[] = [
  { value: { es: "Español", en: "Spanish" }, label: { es: "Nativo", en: "Native" } },
  { value: { es: "Inglés", en: "English" }, label: { es: "Avanzado", en: "Advanced" } },
  { value: { es: "Alemán", en: "German" }, label: { es: "Básico", en: "Basic" } },
];

export const aboutBeyond: LocalizedText = {
  es: "Lejos de la pantalla están el gimnasio, la música, los libros y el café. Últimamente leo a Morgan Housel sobre el dinero y Control, de Freddy Vega, y escribo sobre datos, automatización y hábitos en LinkedIn.",
  en: "Away from the screen it's the gym, music, books and coffee. Lately I've been reading Morgan Housel on money and Freddy Vega's Control, and I write about data, automation and habits on LinkedIn.",
};
