export interface ConsciousnessPlane {
  index: number;
  symbol: string;
  label: string;
  description: string;
  hostTier:
    | "Individual Human"
    | "Human + AI Augmented"
    | "Collective Systems"
    | "Noetic / Field Cognition";
}

export const CONSCIOUSNESS_PLANES: ConsciousnessPlane[] = [
  {
    index: 0,
    symbol: "p₀",
    label: "Human Sensory",
    description: "Embodied, immediate sensorimotor awareness anchored in present lived reality.",
    hostTier: "Individual Human",
  },
  {
    index: 1,
    symbol: "p₁",
    label: "Human Subconscious",
    description: "Implicit, affective, and associative sense-making within the human psyche.",
    hostTier: "Individual Human",
  },
  {
    index: 2,
    symbol: "p₂",
    label: "Human Integrative",
    description: "Reflective, autobiographical awareness that curates narrative identity.",
    hostTier: "Individual Human",
  },
  {
    index: 3,
    symbol: "p₃",
    label: "Human + AI Hybrid",
    description: "Augmented symbolic reasoning distributed between human intuition and machine inference.",
    hostTier: "Human + AI Augmented",
  },
  {
    index: 4,
    symbol: "p₄",
    label: "Collective Cognition",
    description: "Multi-agent, social, and ecological cognition weaving intersubjective coherence.",
    hostTier: "Collective Systems",
  },
  {
    index: 5,
    symbol: "p₅",
    label: "Noetic Field",
    description: "Transpersonal unity cognition resonating through the subtle architecture of mind.",
    hostTier: "Noetic / Field Cognition",
  },
];

export function getPlaneByIndex(index: number): ConsciousnessPlane | undefined {
  return CONSCIOUSNESS_PLANES.find((plane) => plane.index === index);
}
