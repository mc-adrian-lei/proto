export interface ConsciousnessPlane {
  id: string;
  name: string;
  short: string;
  description: string;
}

export const CONSCIOUSNESS_PLANES: ConsciousnessPlane[] = [
  {
    id: "somatic",
    name: "Somatic",
    short: "Soma",
    description: "Embodied sensation and bio-intelligence",
  },
  {
    id: "affective",
    name: "Affective",
    short: "Affect",
    description: "Emotional tone and motivational charge",
  },
  {
    id: "mythic",
    name: "Mythic",
    short: "Myth",
    description: "Symbolic narratives and archetypal story-fields",
  },
  {
    id: "noetic",
    name: "Noetic",
    short: "Nous",
    description: "Direct knowing and intuitive insight",
  },
  {
    id: "collective",
    name: "Collective",
    short: "Co",
    description: "Shared mind-space and socio-cultural patterning",
  },
  {
    id: "transcendent",
    name: "Transcendent",
    short: "Trans",
    description: "Meta-perspective unifying the full spectrum of experience",
  },
];
