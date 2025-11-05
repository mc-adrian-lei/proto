import { useCallback, useMemo } from "react";
import { COGNITIVE_LATTICE } from "../data/cognitiveLattice";
import { useTensorState } from "../hooks/useTensorState";
import { getAnnotations, getAnnotationSummaries } from "../lib/collaborativeAnnotation";
import { exportLatticeToCSV, exportLatticeToJSON, exportOverlayToSVG } from "../lib/exportUtils";
import { tensorEngine } from "../lib/lib-tensorEngine";
import { validateOntology } from "../lib/ontologyValidation";
import { DetailPanel } from "./DetailPanel";
import { GridMatrix } from "./GridMatrix";
import { TensorControls } from "./TensorControls";

type ExportFormat = "json" | "csv" | "svg";

export function TensorIDEContainer() {
  const {
    selectedAspect,
    tensorValues,
    overlay,
    selectedPropertyId,
    setSelectedPropertyId,
    showRecursion,
    toggleRecursion,
    recursionDepth,
    showArchetypes,
    toggleArchetypes,
    selectAspect,
    clearSelection,
  } = useTensorState({ engine: tensorEngine, lattice: COGNITIVE_LATTICE });

  const validationReport = useMemo(() => validateOntology(COGNITIVE_LATTICE), []);
  const propertyDefinition = useMemo(() => tensorEngine.getPropertyById(selectedPropertyId), [selectedPropertyId]);
  const annotationSummaries = useMemo(() => getAnnotationSummaries(COGNITIVE_LATTICE), [selectedPropertyId, showArchetypes]);
  const annotations = useMemo(() => (selectedAspect ? getAnnotations(selectedAspect.id) : []), [selectedAspect]);

  const handleExport = useCallback(
    (format: ExportFormat) => {
      let payload = "";
      switch (format) {
        case "json":
          payload = exportLatticeToJSON(COGNITIVE_LATTICE);
          break;
        case "csv":
          payload = exportLatticeToCSV(COGNITIVE_LATTICE, tensorEngine, selectedPropertyId);
          break;
        case "svg":
          payload = exportOverlayToSVG(COGNITIVE_LATTICE, overlay);
          break;
        default:
          break;
      }

      if (typeof window !== "undefined" && payload) {
        const blob = new Blob([payload], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `cognitive-lattice.${format}`;
        link.click();
        URL.revokeObjectURL(url);
      } else if (payload) {
        console.info(`[tensor-ide] ${format.toUpperCase()} export`, payload.slice(0, 240));
      }
    },
    [overlay, selectedPropertyId],
  );

  return (
    <div className="space-y-4">
      <TensorControls
        properties={tensorEngine.properties}
        selectedProperty={selectedPropertyId}
        selectedPropertyDescription={propertyDefinition?.description}
        recursionEnabled={showRecursion}
        archetypeEnabled={showArchetypes}
        onPropertyChange={setSelectedPropertyId}
        onToggleRecursion={toggleRecursion}
        onToggleArchetypes={toggleArchetypes}
        onExport={handleExport}
      />

      <div className="text-[10px] text-indigo-200/80">
        Ontology status: {validationReport.valid ? "coherent" : "needs attention"} • {validationReport.issues.length} notes logged •
        fields: {validationReport.fieldCount} × planes: {validationReport.planeCount}
      </div>

      <GridMatrix
        lattice={COGNITIVE_LATTICE}
        overlay={overlay}
        annotationSummaries={annotationSummaries}
        showArchetypes={showArchetypes}
        selectedCellId={selectedAspect?.id ?? null}
        onSelectCell={selectAspect}
      />

      <DetailPanel
        cell={selectedAspect}
        tensorValues={tensorValues}
        propertyDefinitions={tensorEngine.properties}
        annotations={annotations}
        recursionDepth={recursionDepth}
        validationReport={validationReport}
        onClose={clearSelection}
      />
    </div>
  );
}
