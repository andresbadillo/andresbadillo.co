/**
 * Contenido de /about. Va aparte del componente para poder editar textos y cifras sin tocar el diseño.
 * Los empleadores no se nombran: el detalle de la trayectoria está en LinkedIn. `proof` son slugs de
 * src/data/projects.ts.
 */

export interface AboutStat {
  value: string;
  label: string;
}

export interface AboutChapter {
  period: string;
  title: string;
  text: string;
  proof: string[];
}

export interface AboutPrinciple {
  title: string;
  text: string;
}

/** Etapa del recorrido de los datos al software: `key` se muestra destacado y `others` en texto corrido. */
export interface AboutStage {
  title: string;
  key: string[];
  others: string[];
}

/** Franja que cruza el recorrido (gestión arriba, agentes de IA abajo). */
export interface AboutBand {
  label: string;
  lead?: string;
  key: string[];
  others: string[];
}

export interface AboutEducation {
  period: string;
  title: string;
  place: string;
}

export const aboutTagline = "Turning complexity into software, data, and decisions that drive impact.";

export const aboutIntro = [
  "I'm an electronic engineer and MBA candidate with more than 14 years across energy, oil & gas and technology. Since 2017 I've worked inside Colombia's power sector, running the operations that keep a distribution and retail utility regulated, measured and billing correctly.",
  "Over time I kept seeing the same pattern: the process lived in Excel, in someone's head, or in five versions of the same file. So I started building the software, data models and automations to fix it. The people who understand a process from the inside are the best placed to improve it.",
];

export const aboutStats: AboutStat[] = [
  { value: "14+", label: "years across energy, oil & gas and technology" },
  { value: "5.4 GWh", label: "connected to the grid in 2025" },
  { value: "Up to 10 h", label: "saved every week by my automations" },
  { value: "2019–27", label: "distribution charges and investment plan filed with the regulator" },
];

export const aboutChapters: AboutChapter[] = [
  {
    period: "2008 – 2016",
    title: "Engineer, then project builder",
    text: "I studied electronic engineering and went straight into projects: coordinating maintenance and construction work, setting up PMI-aligned processes, and building and running a PMO. I specialized in integral project management and structured projects to bring natural-gas service into homes. It taught me budgets, schedules and how to keep a team moving.",
    proof: [],
  },
  {
    period: "2017 – 2025",
    title: "Inside the grid",
    text: "I joined an electricity distribution and retail utility and ended up leading energy management for its technical division: the control center, the metering management center, the asset management system and every regulatory report. I presented the 2019–2027 distribution charges and investment plan to the regulator, led the DMS rollout in the control center, implemented an ISO 55001 asset management system and built Power BI analytics for the technical team.",
    proof: ["indicadores-saidi-saifi"],
  },
  {
    period: "2025",
    title: "Where Excel became software",
    text: "Tariffs, regulation and hourly energy data kept ending up in spreadsheets, so I started turning them into tools: a tariff comparison app, an automated settlement for self-generators, regulatory data pipelines. Python and the Microsoft Power Platform now take over work that cost the team up to 10 hours a week, and the competitive-intelligence apps save the sales team up to 2 hours a day.",
    proof: ["comparador-tarifas-energia", "liquidacion-agpe", "pipeline-aenc-tfroc"],
  },
  {
    period: "Today",
    title: "Operations, data and AI agents",
    text: "I head Operations & Management: grid connections, commercial metering boundaries, metering and after-sales under Colombia's regulatory framework. I run it with pipelines, forecasts and dashboards for SLA, backlog and tracking, and I build with AI coding agents such as Claude Code, Codex and Cursor while I finish my MBA.",
    proof: ["cargos-mercado-mayorista", "ai-radar"],
  },
];

export const aboutPrinciples: AboutPrinciple[] = [
  {
    title: "Order before AI",
    text: "Before adding more AI I ask where the data lives and who understands it. A model can't tell which of five file versions is the right one. First one source of truth, connected systems and someone from the business sitting next to whoever builds. Then AI pays off.",
  },
  {
    title: "Prepare. Fire. Aim.",
    text: "Planning everything first meant solutions arrived late. Now version one works, version two improves with real feedback and version three is tuned with data. Shipping early is how a solution starts creating value on day one.",
  },
  {
    title: "Technology that gives time back",
    text: "Automation isn't about replacing people. It takes the mechanical work off their desks so they can think, analyze and decide. Knowing the process from the inside is what shows where the hours are being lost.",
  },
];

export const aboutToolsIntro = "How I work, from raw data to a tool people use every day.";

export const aboutManagement: AboutBand = {
  label: "Management",
  key: ["PMI", "Scrum"],
  others: ["PMO", "ISO 55001"],
};

export const aboutStages: AboutStage[] = [
  { title: "Collect", key: ["SharePoint", "Supabase"], others: ["PostgreSQL", "Firebase", "Postman"] },
  { title: "Analyze", key: ["Python", "SQL", "Pandas", "Power BI"], others: ["NumPy", "scikit-learn", "Matplotlib", "Jupyter", "DAX"] },
  { title: "Build", key: ["TypeScript", "React", "Flutter"], others: ["JavaScript", "HTML", "CSS", "Tailwind", "Vite", "Dart", "Android", "Figma"] },
  { title: "Automate", key: ["Streamlit", "Power Automate"], others: ["Power Apps", "Python scripts"] },
  { title: "Ship", key: ["Git", "GitHub"], others: ["Vercel"] },
];

export const aboutAi: AboutBand = {
  label: "AI agents",
  lead: "Across every stage:",
  key: ["Claude Code", "Codex", "Cursor"],
  others: ["prompt engineering"],
};

export const aboutEducation: AboutEducation[] = [
  { period: "2024 – present", title: "MBA, Business Management and Administration", place: "CORE School of Management, Universidad Autónoma de Bucaramanga" },
  { period: "2011 – 2012", title: "Specialization in Integral Project Management", place: "Universidad de Investigación y Desarrollo" },
  { period: "2008 – 2011", title: "Electronic Engineering", place: "Universidad de Investigación y Desarrollo" },
];

export const aboutLanguages: AboutStat[] = [
  { value: "Spanish", label: "Native" },
  { value: "English", label: "Advanced" },
  { value: "German", label: "Basic" },
];

export const aboutBeyond =
  "Away from the screen it's the gym, music, books and coffee. Lately I've been reading Morgan Housel on money and Freddy Vega's Control, and I write about data, automation and habits on LinkedIn.";
