import { COGNITIVE_LATTICE } from "../data/cognitiveLattice";
import { tensorEngine } from "../lib/tensorEngine";

interface DetailPanelProps {
  selected: { fieldIndex: number; planeIndex: number } | null;
  recursionDepth: number;
  onClose?: () => void;
}

export function DetailPanel({ selected, recursionDepth, onClose }: DetailPanelProps) {
  if (!selected) return null;

  const { fieldIndex, planeIndex } = selected;
  const aspect = tensorEngine.getAspect(fieldIndex, planeIndex, { recursionDepth });
  const latticeAspect = COGNITIVE_LATTICE[fieldIndex]?.[planeIndex];

  return (
    <div className="w-80 bg-slate-950 border-l border-slate-800 p-4 flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <h2 className="text-sm font-semibold text-indigo-50">
          {aspect.fieldName} × {aspect.planeName}
        </h2>
        <button onClick={onClose} className="text-xs text-indigo-200" type="button">
          ⨂ close
        </button>
      </div>

      {latticeAspect?.summary && (
        <p className="text-[11px] text-indigo-200/90 leading-snug">{latticeAspect.summary}</p>
      )}

      <p className="text-xs text-indigo-200">φ = {aspect.phi.toFixed(5)} (ratio of wholeness)</p>
      <p className="text-xs text-indigo-200">gravity = {aspect.gravity.toFixed(3)} (semantic pull)</p>
      <p className="text-xs text-indigo-200">salience = {aspect.salience.toFixed(3)} (lived weight)</p>

      {latticeAspect?.archetype && (
        <div className="flex items-center gap-2 text-xs text-violet-200/90">
          <span style={{ color: latticeAspect.archetype.color }} className="text-base">
            {latticeAspect.archetype.icon}
          </span>
          <span>{latticeAspect.archetype.description}</span>
        </div>
      )}

      <button className="text-xs bg-indigo-900 rounded-md px-2 py-1 mt-2" type="button">
        ⟳ export(aspect)
      </button>
    </div>
  );
}
