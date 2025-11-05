import React from "react";
import type { CognitiveAspect } from "../data/cognitiveLattice";

interface GridMatrixProps {
  lattice: CognitiveAspect[][];
  onSelectCell?: (fieldIndex: number, planeIndex: number) => void;
  overlay?: Record<string, number>;
}

export function GridMatrix({ lattice, onSelectCell, overlay }: GridMatrixProps) {
  if (!lattice.length) return null;

  return (
    <div
      className="grid gap-px bg-slate-800/40"
      style={{ gridTemplateColumns: `150px repeat(${lattice[0].length}, minmax(0, 1fr))` }}
    >
      <div className="bg-transparent" />
      {lattice[0].map((col) => (
        <div key={col.planeIndex} className="p-2 text-xs font-semibold text-indigo-100">
          {col.planeName}
        </div>
      ))}

      {lattice.map((row, fi) => (
        <React.Fragment key={fi}>
          <div className="p-2 text-xs font-semibold text-indigo-100">{row[0].fieldName}</div>
          {row.map((cell, pj) => {
            const key = `f${fi}-p${pj}`;
            const value = overlay?.[key];
            return (
              <button
                key={key}
                onClick={() => onSelectCell?.(fi, pj)}
                className={`p-2 border border-slate-800/50 text-left hover:bg-indigo-900/40 transition ${
                  value !== undefined ? "bg-indigo-700/30" : "bg-slate-900/20"
                }`}
                type="button"
              >
                <div className="text-xs text-indigo-50">{cell.title}</div>
                {value !== undefined && (
                  <div className="text-[10px] text-indigo-200 mt-1">val: {value.toFixed(2)}</div>
                )}
              </button>
            );
          })}
        </React.Fragment>
      ))}
    </div>
  );
}
