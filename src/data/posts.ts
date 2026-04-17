import thumb1 from "@/assets/placeholders/thumb-1.svg";
import thumb2 from "@/assets/placeholders/thumb-2.svg";
import project1 from "@/assets/placeholders/project-1.svg";
import project2 from "@/assets/placeholders/project-2.svg";
import project3 from "@/assets/placeholders/project-3.svg";

/** Fragmento copiado del iframe de LinkedIn (Embed this post → Copy code): atributo `src` y opcionalmente `height` / `width`. */
export interface LinkedInFrameSpec {
  src: string;
  height?: number;
  width?: number;
}

export interface LinkedInEmbedPair {
  compact: LinkedInFrameSpec;
  full: LinkedInFrameSpec;
}

export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  tags: string[];
  coverImage: string;
  /** Dos embeds del mismo post: compact = "Embed with less text", full = "Embed full post". */
  linkedinEmbed?: LinkedInEmbedPair;
}

/**
 * Cada publicación de LinkedIn debe tener su propio objeto `linkedinEmbed` en su entrada.
 * Si reutilizas el mismo objeto en varios posts, el mismo iframe se mostrará en todos.
 *
 * Metadatos (`slug`, `title`, `tags`, `excerpt`): los defines tú aquí; LinkedIn no los importa
 * automáticamente. Ajusta título y slug para que coincidan con lo que quieres en el sitio.
 */
const linkedinWebPersonal: LinkedInEmbedPair = {
  compact: {
    src: "https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7448138398982160385?collapsed=1",
    height: 420,
    width: 504,
  },
  full: {
    src: "https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7448138398982160385",
    height: 760,
    width: 504,
  },
};

const linkedinInterseccion: LinkedInEmbedPair = {
  compact: {
    src: "https://www.linkedin.com/embed/feed/update/urn:li:share:7446888014242398209",
    height: 420,
    width: 504,
  },
  full: {
    src: "https://www.linkedin.com/embed/feed/update/urn:li:share:7446888014242398209",
    height: 760,
    width: 504,
  },
};

const linkedinLiderazgo: LinkedInEmbedPair = {
  compact: {
    src: "https://www.linkedin.com/embed/feed/update/urn:li:share:7442629095978422272",
    height: 420,
    width: 504,
  },
  full: {
    src: "https://www.linkedin.com/embed/feed/update/urn:li:share:7442629095978422272",
    height: 760,
    width: 504,
  },
};

const linkedinDisciplinaDatos: LinkedInEmbedPair = {
  compact: {
    src: "https://www.linkedin.com/embed/feed/update/urn:li:share:7440378569089945600?collapsed=1",
    height: 420,
    width: 504,
  },
  full: {
    src: "https://www.linkedin.com/embed/feed/update/urn:li:share:7440378569089945600",
    height: 760,
    width: 504,
  },
};

const linkedinValorDeNegocio: LinkedInEmbedPair = {
  compact: {
    src: "https://www.linkedin.com/embed/feed/update/urn:li:share:7438344692884373506?collapsed=1",
    height: 420,
    width: 504,
  },
  full: {
    src: "https://www.linkedin.com/embed/feed/update/urn:li:share:7438344692884373506",
    height: 760,
    width: 504,
  },
};

const linkedinConstruirSoluciones: LinkedInEmbedPair = {
  compact: {
    src: "https://www.linkedin.com/embed/feed/update/urn:li:share:7432927059125104640",
    height: 420,
    width: 504,
  },
  full: {
    src: "https://www.linkedin.com/embed/feed/update/urn:li:share:7432927059125104640",
    height: 760,
    width: 504,
  },
};

const linkedinPensarEnSistemas: LinkedInEmbedPair = {
  compact: {
    src: "https://www.linkedin.com/embed/feed/update/urn:li:share:7419898886749749248?collapsed=1",
    height: 420,
    width: 504,
  },
  full: {
    src: "https://www.linkedin.com/embed/feed/update/urn:li:share:7419898886749749248",
    height: 760,
    width: 504,
  },
};

export const posts: Post[] = [
  {
    slug: "web-personal",
    title: "Construyendo para mí",
    excerpt: "Algunas de las mejores cosas nacen cuando decides construir para ti",
    date: "2026-04-09",
    tags: ["web", "react", "typescript"],
    coverImage: thumb1,
    linkedinEmbed: linkedinWebPersonal,
  },
  {
    slug: "interseccion-de-habilidades",
    title: "Intersección de habilidades",
    excerpt: "No subestimes el poder de lo que sabes cuando decides combinarlo.",
    date: "2026-04-07",
    tags: ["Transformacion Digital", "DataDriven", "BI"],
    coverImage: thumb2,
    linkedinEmbed: linkedinInterseccion,
  },
  {
    slug: "liderando-equipos",
    title: "Liderando equipos",
    excerpt: "El líder que entiende el negocio y además construye soluciones, transforma organizaciones.",
    date: "2026-03-26",
    tags: ["Liderazgo", "DataDriven", "Automatizacion"],
    coverImage: project1,
    linkedinEmbed: linkedinLiderazgo,
  },
  {
    slug: "disciplina-de-datos",
    title: "Disciplina de datos",
    excerpt: "La disciplina de datos es la base de la transformación digital.",
    date: "2026-03-16",
    tags: ["DataDriven", "BI", "Automatizacion"],
    coverImage: project2,
    linkedinEmbed: linkedinDisciplinaDatos,
  },
  {
    slug: "valor-de-negocio",
    title: "Valor del negocio - transformación digital",
    excerpt: "Conocer el valor de negocio es la base de la transformación digital.",
    date: "2026-03-10",
    tags: ["DataDriven", "Negocios", "Transformacion Digital"],
    coverImage: project3,
    linkedinEmbed: linkedinValorDeNegocio,
  },
  {
    slug: "construyendo-soluciones",
    title: "Construyendo soluciones",
    excerpt: "El liderazgo también se mide por la fricción que le quitas a tu equipo.",
    date: "2026-03-03",
    tags: ["DataDriven", "Python", "Automatizacion"],
    coverImage: thumb1,
    linkedinEmbed: linkedinConstruirSoluciones,
  },
  {
    slug: "pensar-en-sistemas",
    title: "Pensar en sistemas, no solo en soluciones",
    excerpt: "Las soluciones rápidas ganan semanas. Los sistemas bien diseñados ganan años.",
    date: "2026-02-19",
    tags: ["Python", "Streamlit", "Data"],
    coverImage: thumb1,
    linkedinEmbed: linkedinPensarEnSistemas,
  },
];

const uniquePostTags = Array.from(new Set(posts.flatMap((post) => post.tags.map((tag) => tag.trim()).filter(Boolean))));

export const availableTags = ["all", ...uniquePostTags];

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}
