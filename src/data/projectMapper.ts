import { mockIds, type MockId } from "@/components/mocks/mockIds";
import type { Project, ProjectCopy, ProjectFact, ProjectScreen } from "@/data/projectModel";
import { pickLocalized, type Locale } from "@/i18n/locale";
import type { Json, ProjectRow } from "@/types/database";

const EMPTY_COPY: ProjectCopy = {
  title: "",
  excerpt: "",
  lead: "",
  facts: [],
  summary: [],
  context: { paragraphs: [], question: "" },
  novelty: "",
  challenges: [],
  method: [],
  stack: [],
  architecture: [],
  flow: [],
  features: [],
  screens: [
    { title: "", caption: "" },
    { title: "", caption: "" },
  ],
  impact: { stats: [], rows: [], closing: "" },
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function asStringList(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function asPairs(value: unknown): ProjectFact[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!isRecord(item)) return [];
    return [{ label: asString(item.label), value: asString(item.value) }];
  });
}

export function parseProjectCopy(value: unknown): ProjectCopy {
  return asCopy(value);
}

function asCopy(value: unknown): ProjectCopy {
  if (!isRecord(value)) return EMPTY_COPY;
  const context = isRecord(value.context) ? value.context : {};
  const impact = isRecord(value.impact) ? value.impact : {};
  const screens = Array.isArray(value.screens) ? value.screens : [];
  const screenAt = (index: number) => {
    const screen = screens[index];
    return isRecord(screen)
      ? { title: asString(screen.title), caption: asString(screen.caption) }
      : { title: "", caption: "" };
  };
  return {
    title: asString(value.title),
    excerpt: asString(value.excerpt),
    lead: asString(value.lead),
    facts: asPairs(value.facts),
    summary: asStringList(value.summary),
    context: { paragraphs: asStringList(context.paragraphs), question: asString(context.question) },
    novelty: asString(value.novelty),
    challenges: Array.isArray(value.challenges)
      ? value.challenges.flatMap((item) => (
        isRecord(item) ? [{ title: asString(item.title), text: asString(item.text) }] : []
      ))
      : [],
    method: asStringList(value.method),
    stack: asPairs(value.stack),
    architecture: asPairs(value.architecture),
    flow: asStringList(value.flow),
    features: Array.isArray(value.features)
      ? value.features.flatMap((item) => (
        isRecord(item) ? [{ title: asString(item.title), text: asString(item.text) }] : []
      ))
      : [],
    screens: [screenAt(0), screenAt(1)],
    impact: {
      stats: Array.isArray(impact.stats)
        ? impact.stats.flatMap((item) => (
          isRecord(item) ? [{ value: asString(item.value), label: asString(item.label) }] : []
        ))
        : [],
      rows: Array.isArray(impact.rows)
        ? impact.rows.flatMap((item) => (
          isRecord(item)
            ? [{ indicator: asString(item.indicator), before: asString(item.before), after: asString(item.after) }]
            : []
        ))
        : [],
      closing: asString(impact.closing),
    },
  };
}

function pickText(locale: Locale, es: string, en: string): string {
  return pickLocalized(locale, es, en);
}

function pickList<T>(_locale: Locale, es: T[], en: T[], read: (esItem: T | undefined, enItem: T | undefined) => T | null): T[] {
  const length = Math.max(es.length, en.length);
  const items: T[] = [];
  for (let index = 0; index < length; index += 1) {
    const item = read(es[index], en[index]);
    if (item) items.push(item);
  }
  return items;
}

function isMockId(value: string): value is MockId {
  return (mockIds as readonly string[]).includes(value);
}

export function rowToProject(row: ProjectRow, locale: Locale): Project | null {
  if (!isMockId(row.hero)) return null;
  const copy = isRecord(row.copy) ? row.copy : {};
  const es = asCopy(copy.es);
  const en = asCopy(copy.en);
  const screenMocks = Array.isArray(row.screens) ? row.screens : [];
  const mockAt = (index: number): MockId | null => {
    const entry = screenMocks[index];
    if (!isRecord(entry) || typeof entry.mock !== "string" || !isMockId(entry.mock)) return null;
    return entry.mock;
  };
  const firstMock = mockAt(0);
  const secondMock = mockAt(1);
  if (!firstMock || !secondMock) return null;

  const screens: [ProjectScreen, ProjectScreen] = [0, 1].map((index) => ({
    mock: index === 0 ? firstMock : secondMock,
    title: pickText(locale, es.screens[index].title, en.screens[index].title),
    caption: pickText(locale, es.screens[index].caption, en.screens[index].caption),
  })) as [ProjectScreen, ProjectScreen];

  return {
    id: row.id,
    slug: row.slug,
    date: row.date,
    displayOrder: row.display_order,
    featured: row.featured,
    anonymized: row.anonymized,
    hero: row.hero,
    tags: Array.isArray(row.tags) ? row.tags.filter((tag) => typeof tag === "string" && tag.trim()) : [],
    title: pickText(locale, es.title, en.title),
    excerpt: pickText(locale, es.excerpt, en.excerpt),
    lead: pickText(locale, es.lead, en.lead),
    facts: pickList(locale, es.facts, en.facts, (item, fallback) => {
      const label = pickText(locale, item?.label ?? "", fallback?.label ?? "");
      const value = pickText(locale, item?.value ?? "", fallback?.value ?? "");
      return label || value ? { label, value } : null;
    }),
    summary: pickList(locale, es.summary, en.summary, (item, fallback) => {
      const text = pickText(locale, item ?? "", fallback ?? "");
      return text || null;
    }),
    context: {
      paragraphs: pickList(locale, es.context.paragraphs, en.context.paragraphs, (item, fallback) => {
        const text = pickText(locale, item ?? "", fallback ?? "");
        return text || null;
      }),
      question: pickText(locale, es.context.question, en.context.question),
    },
    novelty: pickText(locale, es.novelty, en.novelty),
    challenges: pickList(locale, es.challenges, en.challenges, (item, fallback) => {
      const title = pickText(locale, item?.title ?? "", fallback?.title ?? "");
      const text = pickText(locale, item?.text ?? "", fallback?.text ?? "");
      return title || text ? { title, text } : null;
    }),
    method: pickList(locale, es.method, en.method, (item, fallback) => pickText(locale, item ?? "", fallback ?? "") || null),
    stack: pickList(locale, es.stack, en.stack, (item, fallback) => {
      const label = pickText(locale, item?.label ?? "", fallback?.label ?? "");
      const value = pickText(locale, item?.value ?? "", fallback?.value ?? "");
      return label || value ? { label, value } : null;
    }),
    architecture: pickList(locale, es.architecture, en.architecture, (item, fallback) => {
      const label = pickText(locale, item?.label ?? "", fallback?.label ?? "");
      const value = pickText(locale, item?.value ?? "", fallback?.value ?? "");
      return label || value ? { label, value } : null;
    }),
    flow: pickList(locale, es.flow, en.flow, (item, fallback) => pickText(locale, item ?? "", fallback ?? "") || null),
    features: pickList(locale, es.features, en.features, (item, fallback) => {
      const title = pickText(locale, item?.title ?? "", fallback?.title ?? "");
      const text = pickText(locale, item?.text ?? "", fallback?.text ?? "");
      return title || text ? { title, text } : null;
    }),
    screens,
    impact: {
      stats: pickList(locale, es.impact.stats, en.impact.stats, (item, fallback) => {
        const value = pickText(locale, item?.value ?? "", fallback?.value ?? "");
        const label = pickText(locale, item?.label ?? "", fallback?.label ?? "");
        return value || label ? { value, label } : null;
      }),
      rows: pickList(locale, es.impact.rows, en.impact.rows, (item, fallback) => {
        const indicator = pickText(locale, item?.indicator ?? "", fallback?.indicator ?? "");
        const before = pickText(locale, item?.before ?? "", fallback?.before ?? "");
        const after = pickText(locale, item?.after ?? "", fallback?.after ?? "");
        return indicator || before || after ? { indicator, before, after } : null;
      }),
      closing: pickText(locale, es.impact.closing, en.impact.closing),
    },
  };
}

export function copyToJson(copy: { es: ProjectCopy | null; en: ProjectCopy | null }): Json {
  return {
    ...(copy.es ? { es: copy.es as unknown as Json } : {}),
    ...(copy.en ? { en: copy.en as unknown as Json } : {}),
  };
}
