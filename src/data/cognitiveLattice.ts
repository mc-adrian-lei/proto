import { ARCHETYPES } from "../lib/archetypes";
import type { ArchetypeDefinition } from "../lib/archetypes";
import type { CognitiveField } from "../lib/lib-fields";
import { COGNITIVE_FIELDS } from "../lib/lib-fields";
import type { ConsciousnessPlane } from "../lib/lib-planes";
import { CONSCIOUSNESS_PLANES } from "../lib/lib-planes";

export interface CognitiveAspect {
  id: string;
  fieldIndex: number;
  planeIndex: number;
  field: CognitiveField;
  plane: ConsciousnessPlane;
  title: string;
  summary: string;
  archetype?: ArchetypeDefinition | null;
}

const ARCHETYPE_MAP: Partial<Record<string, keyof typeof ARCHETYPES>> = {
  "f0-p0": "zeus",
  "f2-p3": "athena",
  "f3-p4": "hermes",
  "f5-p5": "apollo",
};

export const COGNITIVE_LATTICE: CognitiveAspect[][] = COGNITIVE_FIELDS.map((field) => {
  return CONSCIOUSNESS_PLANES.map((plane) => {
    const id = `f${field.index}-p${plane.index}`;
    const archetypeKey = ARCHETYPE_MAP[id];
    return {
      id,
      fieldIndex: field.index,
      planeIndex: plane.index,
      field,
      plane,
      title: `${field.symbol} · ${field.label} × ${plane.symbol} · ${plane.label}`,
      summary: `${field.description} expressed through the ${plane.label.toLowerCase()} plane of ${plane.hostTier.toLowerCase()}.`,
      archetype: archetypeKey ? ARCHETYPES[archetypeKey] : null,
    };
  });
});
