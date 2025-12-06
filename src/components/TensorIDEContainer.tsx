import { DetailPanel } from "./DetailPanel";
import { GridMatrix } from "./GridMatrix";
import { ArchetypeLegend } from "./ArchetypeLegend";
import { TensorControls } from "./TensorControls";
import { useLattice } from "../context/LatticeContext";

export function TensorIDEContainer() {
  const {
    selected,
    setSelected,
    overlay,
    tensorProperties,
    selectedProperty,
    setSelectedProperty,
    recursionEnabled,
    toggleRecursion,
    archetypesEnabled,
    toggleArchetypes,
    recursionDepth,
  } = useLattice();

  return (
    <div className="flex min-h-screen bg-slate-950 text-indigo-50">
      <div className="flex-1 p-6 space-y-4">
        <TensorControls
          properties={tensorProperties}
          selectedProperty={selectedProperty}
          onSelectProperty={setSelectedProperty}
          onToggleRecursion={toggleRecursion}
          onToggleArchetypes={toggleArchetypes}
          recursionEnabled={recursionEnabled}
          archetypesEnabled={archetypesEnabled}
        />
        {archetypesEnabled && <ArchetypeLegend />}
        <GridMatrix
          overlay={overlay}
          onSelect={(fieldIndex, planeIndex) => setSelected({ fieldIndex, planeIndex })}
          selected={selected}
          showArchetypes={archetypesEnabled}
        />
      </div>
      <DetailPanel selected={selected} recursionDepth={recursionDepth} onClose={() => setSelected(null)} />
    </div>
  );
}

export default TensorIDEContainer;
