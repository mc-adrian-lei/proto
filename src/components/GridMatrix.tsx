import React from "react";
import { COGNITIVE_LATTICE } from "../data/cognitiveLattice";
import { COGNITIVE_FIELDS } from "../lib/lib-fields";
import { CONSCIOUSNESS_PLANES } from "../lib/lib-planes";

interface GridMatrixProps {
  overlay?: Record<string, number>;
  onSelect?: (fieldIndex: number, planeIndex: number) => void;
  selected?: { fieldIndex: number; planeIndex: number } | null;
  showArchetypes?: boolean;
}

export function GridMatrix({ overlay = {}, onSelect, selected, showArchetypes }: GridMatrixProps) {
  const columnCount = CONSCIOUSNESS_PLANES.length;

  return (
    <div className="grid gap-1" style={{ gridTemplateColumns: `160px repeat(${columnCount}, minmax(88px, 1fr))` }}>
      <div />
      {CONSCIOUSNESS_PLANES.map((plane) => (
        <div key={plane.index} className="text-xs text-indigo-100 px-2 py-1 font-semibold">
          {plane.symbol} · {plane.label}
        </div>
      ))}

      {COGNITIVE_FIELDS.map((field) => (
        <React.Fragment key={field.index}>
          <div className="text-xs text-indigo-100 px-2 py-1 font-semibold">
            {field.symbol} · {field.label}
          </div>

          {CONSCIOUSNESS_PLANES.map((plane) => {
            const key = `f${field.index}-p${plane.index}`;
            const value = overlay[key];
            const active = selected && selected.fieldIndex === field.index && selected.planeIndex === plane.index;
            const aspect = COGNITIVE_LATTICE[field.index]?.[plane.index];

            return (
              <button
                key={key}
                onClick={() => onSelect?.(field.index, plane.index)}
                className={`rounded-md border px-2 py-1 text-[10px] transition-colors duration-150 ${
                  active ? "bg-indigo-700 text-white" : "bg-slate-900/70 hover:bg-slate-800"
                }`}
                type="button"
              >
                {field.symbol} × {plane.symbol}
                <div className="text-[9px] text-indigo-200">{value !== undefined ? value.toFixed(2) : "—"}</div>
                {showArchetypes && aspect?.archetype && (
                  <div className="mt-1 text-sm" title={aspect.archetype.description}>
                    <span style={{ color: aspect.archetype.color }}>{aspect.archetype.icon}</span>
                  </div>
                )}
              </button>
            );
          })}
        </React.Fragment>
      ))}
    </div>
  );
}
