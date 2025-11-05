export interface CognitiveField {
  index: number;
  symbol: string;
  label: string;
  description: string;
  processType: "sensorimotor" | "implicit" | "reflective" | "hybrid" | "collective" | "noetic";
}

export const COGNITIVE_FIELDS: CognitiveField[] = [
  {
    index: 0,
    symbol: "f₀",
    label: "Presence",
    description: "Priming and foundational sensory awareness that orients the lattice toward immediate experience.",
    processType: "sensorimotor",
  },
  {
    index: 1,
    symbol: "f₁",
    label: "Curiosity → Intent",
    description: "Orientation of attention that routes latent curiosity into directional impulse and nascent intent.",
    processType: "implicit",
  },
  {
    index: 2,
    symbol: "f₂",
    label: "Identification",
    description: "Pattern recognition that stabilises features, personas, and conceptual contours within experience.",
    processType: "reflective",
  },
  {
    index: 3,
    symbol: "f₃",
    label: "Bridge-Building",
    description: "Cross-domain synthesis that binds disparate impressions into meaningful through-lines and models.",
    processType: "hybrid",
  },
  {
    index: 4,
    symbol: "f₄",
    label: "Re-membering",
    description: "Collective reconstruction and memory retrieval that threads personal insight into shared narratives.",
    processType: "collective",
  },
  {
    index: 5,
    symbol: "f₅",
    label: "Transmission",
    description: "Recursive reporting, teaching, and iteration that propagates understanding across epochs of inquiry.",
    processType: "noetic",
  },
];

export function getFieldByIndex(index: number): CognitiveField | undefined {
  return COGNITIVE_FIELDS.find((field) => field.index === index);
}
