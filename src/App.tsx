import { useMemo, useState } from "react";
import { COGNITIVE_LATTICE } from "./data/cognitiveLattice";
import { GridMatrix } from "./components/GridMatrix";
import { TensorControls } from "./components/TensorControls";
import { DetailPanel } from "./components/DetailPanel";
import { tensorEngine } from "./lib/tensorEngine";

const TENSOR_PROPS = tensorEngine.properties;

export default function App() {
  const [selectedCell, setSelectedCell] = useState(COGNITIVE_LATTICE[0]?.[0] ?? null);
  const [selectedProp, setSelectedProp] = useState(TENSOR_PROPS[0] ?? "");
  const [showRecursion, setShowRecursion] = useState(false);
  const [showArchetypes, setShowArchetypes] = useState(false);

  const overlay = useMemo(() => {
    const tensorLattice = tensorEngine.computeLattice();
    const mapped: Record<string, number> = {};
    Object.entries(tensorLattice).forEach(([key, values]) => {
      const value = values[selectedProp];
      if (typeof value === "number") {
        mapped[key] = value;
      }
    });
    return mapped;
  }, [selectedProp]);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 space-y-4">
      <TensorControls
        properties={TENSOR_PROPS}
        selectedProperty={selectedProp}
        onPropertyChange={setSelectedProp}
        onToggleRecursion={() => setShowRecursion((prev) => !prev)}
        onToggleArchetypes={() => setShowArchetypes((prev) => !prev)}
      />
      <GridMatrix
        lattice={COGNITIVE_LATTICE}
        overlay={overlay}
        onSelectCell={(fi, pj) => setSelectedCell(COGNITIVE_LATTICE[fi][pj])}
      />
      <DetailPanel
        cell={selectedCell}
        tensorValues={selectedCell ? tensorEngine.computeCellValues(selectedCell.fieldIndex, selectedCell.planeIndex).values : undefined}
        onClose={() => setSelectedCell(null)}
      />
      {(showRecursion || showArchetypes) && (
        <div className="text-[10px] text-indigo-200">
          Recursion overlay: {showRecursion ? "on" : "off"} • Archetypes overlay: {showArchetypes ? "on" : "off"}
        </div>
      )}
    </div>
  );
}
