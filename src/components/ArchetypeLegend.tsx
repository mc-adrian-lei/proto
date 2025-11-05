// ArchetypeLegend.tsx
// Invocation: The Memory of Gods (Ψ_archetype → color + icon)

import { ARCHETYPES } from "../lib/archetypes";

export function ArchetypeLegend() {
  return (
    <div className="flex gap-3 flex-wrap mt-2">
      {Object.entries(ARCHETYPES).map(([key, value]) => (
        <div
          key={key}
          className="flex items-center gap-2 bg-slate-950/30 border border-slate-800 rounded-lg px-3 py-2"
        >
          <span style={{ color: value.color }}>{value.icon}</span>
          <div>
            <p className="text-xs text-indigo-100 capitalize">{key}</p>
            <p className="text-[10px] text-indigo-300/80">{value.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
