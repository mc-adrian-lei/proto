import React from "react";
import type { CognitiveAspect } from "../data/cognitiveLattice";
import type { AnnotationSummary } from "../lib/collaborativeAnnotation";

interface GridMatrixProps {
  lattice: CognitiveAspect[][];
  onSelectCell?: (fieldIndex: number, planeIndex: number) => void;
  overlay?: Record<string, number>;
  annotationSummaries?: Record<string, AnnotationSummary>;
  showArchetypes?: boolean;
  selectedCellId?: string | null;
}

export function GridMatrix({
  lattice,
  onSelectCell,
  overlay,
  annotationSummaries,
  showArchetypes,
  selectedCellId,
}: GridMatrixProps) {
  if (!lattice.length) return null;

  return (
    <div
      className="grid gap-px bg-slate-800/60 rounded-3xl overflow-hidden"
      style={{ gridTemplateColumns: `160px repeat(${lattice[0].length}, minmax(0, 1fr))` }}
    >
      <div className="bg-slate-900/40" />
      {lattice[0].map((col) => (
        <div key={col.planeIndex} className="p-3 text-xs font-semibold text-indigo-100 bg-slate-900/60">
          {col.plane.symbol} · {col.plane.label}
        </div>
      ))}

      {lattice.map((row, fi) => (
        <React.Fragment key={fi}>
          <div className="p-3 text-xs font-semibold text-indigo-100 bg-slate-900/60">
            {row[0].field.symbol} · {row[0].field.label}
          </div>
          {row.map((cell, pj) => {
            const key = cell.id;
            const overlayValue = overlay?.[key];
            const intensity = overlayValue !== undefined ? Math.max(0, Math.min(1, overlayValue)) : 0;
            const background = overlayValue !== undefined ? `rgba(99, 102, 241, ${0.1 + intensity * 0.6})` : "rgba(15, 23, 42, 0.65)";
            const summary = annotationSummaries?.[key];
            const isSelected = selectedCellId === key;

            return (
              <button
                key={key}
                onClick={() => onSelectCell?.(fi, pj)}
                className={`relative p-3 text-left border border-slate-800/60 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${
                  isSelected ? "ring-2 ring-indigo-400" : ""
                }`}
                style={{ background }}
                type="button"
              >
                <div className="text-xs text-indigo-50 font-medium leading-tight">{cell.title}</div>
                <p className="text-[10px] text-indigo-200/90 mt-1 leading-snug">{cell.summary}</p>
                {overlayValue !== undefined && (
                  <div className="mt-2 text-[10px] text-indigo-100/90">{overlayValue.toFixed(3)}</div>
                )}
                {showArchetypes && cell.archetype && (
                  <div className="absolute top-1 right-1 text-lg" title={cell.archetype.description}>
                    <span style={{ color: cell.archetype.color }}>{cell.archetype.icon}</span>
                  </div>
                )}
                {summary && summary.count > 0 && (
                  <div className="mt-2 text-[9px] text-emerald-200">
                    {summary.count} annotation{summary.count > 1 ? "s" : ""}
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
