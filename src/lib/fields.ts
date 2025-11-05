export interface CognitiveField {
  id: string;
  name: string;
  short: string;
  description: string;
}

export const COGNITIVE_FIELDS: CognitiveField[] = [
  {
    id: "awareness",
    name: "Awareness",
    short: "Awareness",
    description: "Baseline noticing and receptivity to phenomenological stimuli",
  },
  {
    id: "imagination",
    name: "Imagination",
    short: "Imag",
    description: "Generative visualization and internal simulation of possibilities",
  },
  {
    id: "reason",
    name: "Reason",
    short: "Reason",
    description: "Analytic discrimination and logical structuring of meaning",
  },
  {
    id: "expression",
    name: "Expression",
    short: "Expr",
    description: "Articulation of intent through language, symbol, and gesture",
  },
  {
    id: "relation",
    name: "Relation",
    short: "Rel",
    description: "Attunement to interpersonal dynamics and collective fields",
  },
  {
    id: "integration",
    name: "Integration",
    short: "Integr",
    description: "Synthesis of experiences into coherent self-organizing patterns",
  },
];
