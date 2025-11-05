import type { CognitiveAspect } from "../data/cognitiveLattice";

interface DetailPanelProps {
  cell: CognitiveAspect | null;
  tensorValues?: Record<string, number>;
  onClose?: () => void;
}

export function DetailPanel({ cell, tensorValues, onClose }: DetailPanelProps) {
  if (!cell) return null;

  return (
    <div className="fixed right-4 top-4 w-80 bg-slate-950/95 border border-indigo-700/40 rounded-xl p-4 shadow-2xl">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-sm font-semibold text-indigo-100">{cell.title}</h2>
        <button type="button" onClick={onClose} className="text-xs text-indigo-200">
          close
        </button>
      </div>
      <p className="text-xs text-indigo-200 mb-3">{cell.summary}</p>
      <p className="text-[10px] text-indigo-300 mb-1">
        Field: {cell.fieldName} ({cell.fieldIndex}) • Plane: {cell.planeName} ({cell.planeIndex})
      </p>
      {cell.archetype && (
        <p className="text-[11px] text-violet-200 mb-2">Archetype: {cell.archetype}</p>
      )}
      {tensorValues && (
        <div className="mt-3">
          <h3 className="text-[11px] text-indigo-100 mb-1">Tensor values</h3>
          {Object.entries(tensorValues).map(([key, value]) => (
            <div key={key} className="flex justify-between text-[10px] text-indigo-200">
              <span>{key}</span>
              <span>{typeof value === "number" ? value.toFixed(3) : value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
