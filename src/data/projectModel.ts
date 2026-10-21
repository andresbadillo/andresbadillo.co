import type { MockId } from "@/components/mocks/mockIds";

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

/** Texto de un idioma. Los mocks viven fuera, una sola vez. */
export interface ProjectCopy {
  title: string;
  excerpt: string;
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
  screens: [{ title: string; caption: string }, { title: string; caption: string }];
  impact: {
    stats: ProjectStat[];
    rows: ProjectImpactRow[];
    closing: string;
  };
}

export interface Project {
  id: number;
  slug: string;
  date: string;
  displayOrder: number;
  featured: boolean;
  anonymized: boolean;
  hero: MockId;
  tags: string[];
  title: string;
  excerpt: string;
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
