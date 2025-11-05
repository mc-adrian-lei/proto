import type { TensorPropertyDefinition } from "../lib/lib-tensorEngine";

type ExportFormat = "json" | "csv" | "svg";

interface TensorControlsProps {
  properties: TensorPropertyDefinition[];
  selectedProperty: string;
  selectedPropertyDescription?: string;
  recursionEnabled: boolean;
  archetypeEnabled: boolean;
  onPropertyChange: (prop: string) => void;
  onToggleRecursion: () => void;
  onToggleArchetypes: () => void;
  onExport?: (format: ExportFormat) => void;
}

export function TensorControls({
  properties,
  selectedProperty,
  selectedPropertyDescription,
  recursionEnabled,
  archetypeEnabled,
  onPropertyChange,
  onToggleRecursion,
  onToggleArchetypes,
  onExport,
}: TensorControlsProps) {
  return (
    <div className="flex flex-col gap-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-700/50 shadow-inner">
      <div className="flex flex-wrap gap-3 items-center">
        <label className="text-xs text-indigo-100" htmlFor="tensor-property">
          Tensor property
        </label>
        <select
          id="tensor-property"
          value={selectedProperty}
          onChange={(event) => onPropertyChange(event.target.value)}
          className="bg-slate-950 text-indigo-100 text-sm rounded px-2 py-1 border border-slate-700"
        >
          {properties.map((property) => (
            <option key={property.id} value={property.id}>
              {property.label}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={onToggleRecursion}
          className={`text-xs rounded px-2 py-1 transition ${
            recursionEnabled ? "bg-emerald-600 hover:bg-emerald-500" : "bg-slate-700 hover:bg-slate-600"
          }`}
        >
          {recursionEnabled ? "Recursion ×3" : "Recursion ×1"}
        </button>
        <button
          type="button"
          onClick={onToggleArchetypes}
          className={`text-xs rounded px-2 py-1 transition ${
            archetypeEnabled ? "bg-violet-600 hover:bg-violet-500" : "bg-slate-700 hover:bg-slate-600"
          }`}
        >
          {archetypeEnabled ? "Archetypes on" : "Archetypes off"}
        </button>
      </div>
      {selectedPropertyDescription && (
        <p className="text-[11px] text-indigo-200 max-w-3xl">{selectedPropertyDescription}</p>
      )}
      <div className="flex flex-wrap gap-2 text-[11px] text-indigo-200/80">
        {(["json", "csv", "svg"] as ExportFormat[]).map((format) => (
          <button
            key={format}
            type="button"
            onClick={() => onExport?.(format)}
            className="px-2 py-1 rounded border border-indigo-500/50 text-indigo-100 hover:bg-indigo-600/40 transition"
          >
            Export {format.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
}
