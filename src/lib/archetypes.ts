export interface ArchetypeDefinition {
  icon: string;
  color: string;
  description: string;
}

export const ARCHETYPES: Record<string, ArchetypeDefinition> = {
  zeus: { icon: "⚡", color: "#fbbf24", description: "Priming meta-order" },
  apollo: { icon: "☉", color: "#6ee7b7", description: "Harmonic revelation" },
  hermes: { icon: "☿", color: "#93c5fd", description: "Bridge, messenger" },
  athena: { icon: "🦉", color: "#c084fc", description: "Strategic wisdom" },
};
