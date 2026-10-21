import { mockIds, type MockId } from "@/components/mocks/mockIds";
import type { ProjectCopy } from "@/data/projectModel";

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DATE_PATTERN = /^\d{4}-(0[1-9]|1[0-2])$/;

export interface CopyDraft {
  title: string;
  excerpt: string;
  lead: string;
  summary: string;
  facts: string;
  paragraphs: string;
  question: string;
  novelty: string;
  challenges: string;
  method: string;
  stack: string;
  architecture: string;
  flow: string;
  features: string;
  screenTitle1: string;
  screenCaption1: string;
  screenTitle2: string;
  screenCaption2: string;
  stats: string;
  rows: string;
  closing: string;
}

export interface ProjectInput {
  slug: string;
  date: string;
  displayOrder: number;
  featured: boolean;
  anonymized: boolean;
  hero: MockId;
  tags: string[];
  screens: [MockId, MockId];
  es: ProjectCopy | null;
  en: ProjectCopy | null;
}

export type ProjectField = "slug" | "date" | "displayOrder" | "hero" | "tags" | "screens" | "copy";
export type ProjectErrors = Partial<Record<ProjectField, string>>;

export function emptyDraft(): CopyDraft {
  return {
    title: "",
    excerpt: "",
    lead: "",
    summary: "",
    facts: "",
    paragraphs: "",
    question: "",
    novelty: "",
    challenges: "",
    method: "",
    stack: "",
    architecture: "",
    flow: "",
    features: "",
    screenTitle1: "",
    screenCaption1: "",
    screenTitle2: "",
    screenCaption2: "",
    stats: "",
    rows: "",
    closing: "",
  };
}

function lines(value: string): string[] {
  return value.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
}

function splitPair(line: string): [string, string] {
  const [left, ...rest] = line.split("|");
  return [left.trim(), rest.join("|").trim()];
}

function pairs(value: string): { label: string; value: string }[] {
  return lines(value).map((line) => {
    const [label, pairValue] = splitPair(line);
    return { label, value: pairValue };
  });
}

export function draftToCopy(draft: CopyDraft): ProjectCopy {
  return {
    title: draft.title.trim(),
    excerpt: draft.excerpt.trim(),
    lead: draft.lead.trim(),
    summary: lines(draft.summary),
    facts: pairs(draft.facts),
    context: { paragraphs: lines(draft.paragraphs), question: draft.question.trim() },
    novelty: draft.novelty.trim(),
    challenges: lines(draft.challenges).map((line) => {
      const [title, text] = splitPair(line);
      return { title, text };
    }),
    method: lines(draft.method),
    stack: pairs(draft.stack),
    architecture: pairs(draft.architecture),
    flow: lines(draft.flow),
    features: lines(draft.features).map((line) => {
      const [title, text] = splitPair(line);
      return { title, text };
    }),
    screens: [
      { title: draft.screenTitle1.trim(), caption: draft.screenCaption1.trim() },
      { title: draft.screenTitle2.trim(), caption: draft.screenCaption2.trim() },
    ],
    impact: {
      stats: lines(draft.stats).map((line) => {
        const [value, label] = splitPair(line);
        return { value, label };
      }),
      rows: lines(draft.rows).map((line) => {
        const [indicator, before, ...after] = line.split("|").map((part) => part.trim());
        return { indicator, before, after: after.join("|").trim() };
      }),
      closing: draft.closing.trim(),
    },
  };
}

function joinPairs(items: { label: string; value: string }[]): string {
  return items.map((item) => `${item.label} | ${item.value}`).join("\n");
}

export function copyToDraft(copy: ProjectCopy): CopyDraft {
  return {
    title: copy.title,
    excerpt: copy.excerpt,
    lead: copy.lead,
    summary: copy.summary.join("\n"),
    facts: joinPairs(copy.facts),
    paragraphs: copy.context.paragraphs.join("\n"),
    question: copy.context.question,
    novelty: copy.novelty,
    challenges: copy.challenges.map((item) => `${item.title} | ${item.text}`).join("\n"),
    method: copy.method.join("\n"),
    stack: joinPairs(copy.stack),
    architecture: joinPairs(copy.architecture),
    flow: copy.flow.join("\n"),
    features: copy.features.map((item) => `${item.title} | ${item.text}`).join("\n"),
    screenTitle1: copy.screens[0]?.title ?? "",
    screenCaption1: copy.screens[0]?.caption ?? "",
    screenTitle2: copy.screens[1]?.title ?? "",
    screenCaption2: copy.screens[1]?.caption ?? "",
    stats: copy.impact.stats.map((item) => `${item.value} | ${item.label}`).join("\n"),
    rows: copy.impact.rows.map((item) => `${item.indicator} | ${item.before} | ${item.after}`).join("\n"),
    closing: copy.impact.closing,
  };
}

export function isBlankCopy(copy: ProjectCopy): boolean {
  return !copy.title && !copy.excerpt && !copy.lead && !copy.summary.length && !copy.facts.length
    && !copy.context.paragraphs.length && !copy.context.question && !copy.novelty
    && !copy.challenges.length && !copy.method.length && !copy.stack.length
    && !copy.architecture.length && !copy.flow.length && !copy.features.length
    && !copy.screens[0].title && !copy.screens[0].caption && !copy.screens[1].title && !copy.screens[1].caption
    && !copy.impact.stats.length && !copy.impact.rows.length && !copy.impact.closing;
}

export function isCompleteCopy(copy: ProjectCopy): boolean {
  const filled = (items: { title?: string; text?: string; label?: string; value?: string }[]) =>
    items.length > 0 && items.every((item) => (item.title ?? item.label ?? "").trim() && (item.text ?? item.value ?? "").trim());
  return Boolean(
    copy.title.trim()
    && copy.excerpt.trim()
    && copy.lead.trim()
    && copy.summary.length
    && copy.facts.length
    && copy.facts.every((item) => item.label.trim() && item.value.trim())
    && copy.context.paragraphs.length
    && copy.context.question.trim()
    && copy.novelty.trim()
    && filled(copy.challenges)
    && copy.method.length
    && copy.stack.length
    && copy.stack.every((item) => item.label.trim() && item.value.trim())
    && copy.architecture.length
    && copy.flow.length
    && filled(copy.features)
    && copy.screens.every((screen) => screen.title.trim() && screen.caption.trim())
    && copy.impact.stats.length
    && copy.impact.stats.every((item) => item.value.trim() && item.label.trim())
    && copy.impact.rows.length
    && copy.impact.rows.every((row) => row.indicator.trim() && row.before.trim() && row.after.trim())
    && copy.impact.closing.trim(),
  );
}

export function validateProjectInput(input: ProjectInput): { ok: true; value: ProjectInput } | { ok: false; errors: ProjectErrors } {
  const slug = input.slug.trim().toLowerCase();
  const errors: ProjectErrors = {};
  if (!SLUG_PATTERN.test(slug) || slug.length > 80) {
    errors.slug = "Usa hasta 80 caracteres en minúscula, números y guiones.";
  }
  if (!DATE_PATTERN.test(input.date)) {
    errors.date = "Usa una fecha AAAA-MM.";
  }
  if (!Number.isInteger(input.displayOrder) || input.displayOrder < 0 || input.displayOrder > 9999) {
    errors.displayOrder = "El orden debe ser un entero entre 0 y 9999.";
  }
  if (!(mockIds as readonly string[]).includes(input.hero)) {
    errors.hero = "Elige una maqueta existente.";
  }
  if (input.screens.length !== 2 || input.screens.some((mock) => !(mockIds as readonly string[]).includes(mock))) {
    errors.screens = "Elige dos maquetas existentes.";
  }
  const es = input.es && !isBlankCopy(input.es) ? input.es : null;
  const en = input.en && !isBlankCopy(input.en) ? input.en : null;
  if ((!es || !isCompleteCopy(es)) && (!en || !isCompleteCopy(en))) {
    errors.copy = "Completa al menos un idioma: título, resumen y el resto de secciones.";
  }
  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return { ok: true, value: { ...input, slug, es, en } };
}
