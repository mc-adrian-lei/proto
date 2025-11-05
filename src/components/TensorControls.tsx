interface TensorControlsProps {
  properties: string[];
  selectedProperty: string;
  onPropertyChange: (prop: string) => void;
  onToggleRecursion?: () => void;
  onToggleArchetypes?: () => void;
}

export function TensorControls({
  properties,
  selectedProperty,
  onPropertyChange,
  onToggleRecursion,
  onToggleArchetypes,
}: TensorControlsProps) {
  return (
    <div className="flex gap-3 items-center bg-slate-900/40 p-3 rounded-xl border border-slate-700/40">
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
          <option key={property} value={property}>
            {property}
          </option>
        ))}
      </select>
      <button
        type="button"
        onClick={onToggleRecursion}
        className="text-xs bg-indigo-700 hover:bg-indigo-600 rounded px-2 py-1"
      >
        Toggle recursion
      </button>
      <button
        type="button"
        onClick={onToggleArchetypes}
        className="text-xs bg-violet-700 hover:bg-violet-600 rounded px-2 py-1"
      >
        Archetype overlay
      </button>
    </div>
  );
}
