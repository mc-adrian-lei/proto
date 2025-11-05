import type { CognitiveAspect } from "../data/cognitiveLattice";

export interface Annotation {
  id: string;
  aspectId: string;
  author: string;
  body: string;
  createdAt: string;
  tags?: string[];
}

export interface AnnotationSummary {
  count: number;
  lastUpdated?: string;
  latestAuthor?: string;
}

const annotationStore: Record<string, Annotation[]> = {};

const DEFAULT_THREADS: Array<Omit<Annotation, "id">> = [
  {
    aspectId: "f0-p0",
    author: "Dr. Rivera",
    body: "Baseline resonance between presence and sensory plane forms the experiential root for all later recursion.",
    createdAt: new Date("2023-09-18T09:24:00Z").toISOString(),
    tags: ["foundational", "phenomenology"],
  },
  {
    aspectId: "f2-p3",
    author: "A. Mensah",
    body: "Identification gains hybrid lift here; note the phi weighting drift when AI augmentation focuses analytic attention.",
    createdAt: new Date("2024-02-11T15:02:00Z").toISOString(),
    tags: ["analysis", "augmentation"],
  },
  {
    aspectId: "f3-p4",
    author: "S. Chandra",
    body: "Bridge-building in the collective plane carries semantic gravity into social memory; track the recursive coupling uptick.",
    createdAt: new Date("2024-07-01T21:18:00Z").toISOString(),
    tags: ["collective", "memory"],
  },
];

let seeded = false;

function ensureSeeded() {
  if (seeded) return;
  DEFAULT_THREADS.forEach((annotation, index) => {
    const id = `seed-${index}`;
    const existing = annotationStore[annotation.aspectId] ?? [];
    annotationStore[annotation.aspectId] = [...existing, { ...annotation, id }];
  });
  seeded = true;
}

export function getAnnotations(aspectId: string): Annotation[] {
  ensureSeeded();
  return [...(annotationStore[aspectId] ?? [])].sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1));
}

export function addAnnotation(annotation: Annotation): void {
  ensureSeeded();
  const list = annotationStore[annotation.aspectId] ?? [];
  annotationStore[annotation.aspectId] = [...list, annotation];
}

export function getAnnotationSummaries(lattice: CognitiveAspect[][]): Record<string, AnnotationSummary> {
  ensureSeeded();
  const summaries: Record<string, AnnotationSummary> = {};
  lattice.flat().forEach((cell) => {
    const annotations = annotationStore[cell.id] ?? [];
    const latest = annotations[annotations.length - 1];
    summaries[cell.id] = {
      count: annotations.length,
      lastUpdated: latest?.createdAt,
      latestAuthor: latest?.author,
    };
  });
  return summaries;
}
