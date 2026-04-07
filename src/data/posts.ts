import thumb1 from "@/assets/placeholders/thumb-1.svg";
import thumb2 from "@/assets/placeholders/thumb-2.svg";
import project1 from "@/assets/placeholders/project-1.svg";
import project2 from "@/assets/placeholders/project-2.svg";
import project3 from "@/assets/placeholders/project-3.svg";

export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  tags: string[];
  coverImage: string;
}

export const availableTags = [
  "all",
  "python",
  "ai",
  "java",
  "javascript",
  "c#",
  "typescript",
  "react",
  "algorithms",
  "web",
];

export const posts: Post[] = [
  {
    slug: "designing-for-calm-systems",
    title: "Designing for Calm Systems",
    excerpt: "Estrategias para interfaces sobrias que no saturan al usuario.",
    date: "2026-03-07",
    tags: ["web", "react", "typescript"],
    coverImage: thumb1,
  },
  {
    slug: "small-algorithms-big-impact",
    title: "Small Algorithms, Big Impact",
    excerpt: "Cómo pequeños cambios en lógica mejoran experiencia y costo.",
    date: "2026-02-19",
    tags: ["algorithms", "javascript"],
    coverImage: thumb2,
  },
  {
    slug: "prompting-ux-teams",
    title: "Prompting for UX Teams",
    excerpt: "Buenas prácticas para integrar IA en procesos de diseño.",
    date: "2026-01-21",
    tags: ["ai", "python", "web"],
    coverImage: project1,
  },
  {
    slug: "modern-ts-boundaries",
    title: "Modern TS Boundaries",
    excerpt: "Patrones de tipado para escalar frontends de producto.",
    date: "2025-12-05",
    tags: ["typescript", "react"],
    coverImage: project2,
  },
  {
    slug: "legacy-java-ui-stories",
    title: "Legacy Java UI Stories",
    excerpt: "Lecciones aprendidas migrando interfaces heredadas.",
    date: "2025-10-12",
    tags: ["java", "c#"],
    coverImage: project3,
  },
  {
    slug: "debugging-javascript-motion",
    title: "Debugging JavaScript Motion",
    excerpt: "Optimización de animaciones con mediciones reales.",
    date: "2025-08-29",
    tags: ["javascript", "web"],
    coverImage: thumb1,
  },
];
