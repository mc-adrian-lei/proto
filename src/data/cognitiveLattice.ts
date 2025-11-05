import { COGNITIVE_FIELDS } from "../lib/fields";
import { CONSCIOUSNESS_PLANES } from "../lib/planes";

export interface CognitiveAspect {
  id: string;
  fieldIndex: number;
  planeIndex: number;
  fieldName: string;
  planeName: string;
  title: string;
  summary: string;
  archetype?: string | null;
}

export const COGNITIVE_LATTICE: CognitiveAspect[][] = COGNITIVE_FIELDS.map((field, fi) => {
  return CONSCIOUSNESS_PLANES.map((plane, pj) => ({
    id: `f${fi}-p${pj}`,
    fieldIndex: fi,
    planeIndex: pj,
    fieldName: field.name,
    planeName: plane.name,
    title: `${field.short} × ${plane.short}`,
    summary: `${field.description} in the context of ${plane.description}.`,
    archetype: null,
  }));
});
