interface TensorControlsProps {
  properties: { id: string; label: string }[];
  selectedProperty: string;
  onSelectProperty: (id: string) => void;
  onToggleRecursion: () => void;
  onToggleArchetypes: () => void;
  recursionEnabled: boolean;
  archetypesEnabled: boolean;
}

export function TensorControls({
  properties,
  selectedProperty,
  onSelectProperty,
  onToggleRecursion,
  onToggleArchetypes,
  recursionEnabled,
  archetypesEnabled,
}: TensorControlsProps) {
  return (
    <div className="flex gap-3 items-center bg-slate-950/40 border border-indigo-800 rounded-xl px-4 py-3">
      <label className="text-xs text-indigo-200" htmlFor="tensor-property">
        tensor(property)
      </label>
      <select
        id="tensor-property"
        value={selectedProperty}
        onChange={(event) => onSelectProperty(event.target.value)}
        className="bg-slate-900 text-indigo-100 text-xs rounded-md px-2 py-1 border border-slate-700"
      >
        {properties.map((property) => (
          <option key={property.id} value={property.id}>
            {property.label}
          </option>
        ))}
      </select>

      <button
        onClick={onToggleRecursion}
        className={`text-xs rounded-md px-2 py-1 transition-colors ${
          recursionEnabled ? "bg-indigo-600 text-white" : "bg-slate-800 text-indigo-100"
        }`}
        type="button"
      >
        ∮ recursion
      </button>

      <button
        onClick={onToggleArchetypes}
        className={`text-xs rounded-md px-2 py-1 transition-colors ${
          archetypesEnabled ? "bg-violet-600 text-white" : "bg-slate-800 text-indigo-100"
        }`}
        type="button"
      >
        ☉ archetype
      </button>
    </div>
  );
}
