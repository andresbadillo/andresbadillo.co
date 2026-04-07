import project1 from "@/assets/placeholders/project-1.svg";
import project2 from "@/assets/placeholders/project-2.svg";
import project3 from "@/assets/placeholders/project-3.svg";

export type ProjectContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] };

export interface Project {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  tags: string[];
  featured: boolean;
  heroImage?: string;
  content: ProjectContentBlock[];
}

export const projects: Project[] = [
  {
    slug: "neon-grid-labs",
    title: "Neon Grid Labs",
    excerpt: "Plataforma demo para visualizar patrones generativos en dashboards compactos.",
    date: "2026-03",
    tags: ["React", "Typescript", "Web"],
    featured: true,
    heroImage: project1,
    content: [
      { type: "paragraph", text: "Proyecto de laboratorio con paneles interactivos y estética minimalista." },
      { type: "paragraph", text: "Se prioriza rendimiento, legibilidad visual y arquitectura reusable." },
      {
        type: "list",
        items: ["UI modular con componentes reutilizables", "Animaciones ligeras basadas en CSS", "Sistema de tema oscuro y claro"],
      },
    ],
  },
  {
    slug: "wave-signal-engine",
    title: "Wave Signal Engine",
    excerpt: "Explorador de señales sintéticas con controles simples y animación fluida.",
    date: "2025-11",
    tags: ["Algorithms", "AI", "Javascript"],
    featured: true,
    heroImage: project2,
    content: [
      { type: "paragraph", text: "Motor de simulación visual para análisis de eventos de baja latencia." },
      { type: "paragraph", text: "El diseño está orientado a lectura rápida en escritorio y móvil." },
      {
        type: "list",
        items: ["Capas de señal con diferentes frecuencias", "Render híbrido canvas + SVG", "Exportación de estados mock"],
      },
    ],
  },
  {
    slug: "quiet-runtime",
    title: "Quiet Runtime",
    excerpt: "Plantilla de sitio portfolio con enfoque en accesibilidad y contenido técnico.",
    date: "2025-05",
    tags: ["React", "C#", "Web"],
    featured: false,
    heroImage: project3,
    content: [
      { type: "paragraph", text: "Base de frontend para contenido editorial y showcases de productos." },
      { type: "paragraph", text: "Se incluyen patrones de navegación por teclado y SEO por ruta." },
      {
        type: "list",
        items: ["Estructura semántica", "Soporte reduced motion", "Buenas prácticas de foco visible"],
      },
    ],
  },
  {
    slug: "pixel-archive",
    title: "Pixel Archive",
    excerpt: "Galería curada de prototipos visuales para ideas de interacción creativa.",
    date: "2024-10",
    tags: ["Python", "AI", "Portfolio"],
    featured: true,
    heroImage: project1,
    content: [
      { type: "paragraph", text: "Colección de prototipos con enfoque experimental y narrativa visual." },
      {
        type: "list",
        items: ["Curación por categoría", "Sistema de etiquetas", "Página de detalle con bloques reusables"],
      },
    ],
  },
];
