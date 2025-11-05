import { useCallback, useMemo, useState } from "react";
import type { CognitiveAspect } from "../data/cognitiveLattice";
import type { TensorCellComputation, TensorEngine } from "../lib/lib-tensorEngine";

export interface UseTensorStateResult {
  selectedAspect: CognitiveAspect | null;
  tensorValues?: TensorCellComputation;
  overlay: Record<string, number>;
  selectedPropertyId: string;
  setSelectedPropertyId: (id: string) => void;
  showRecursion: boolean;
  toggleRecursion: () => void;
  recursionDepth: number;
  showArchetypes: boolean;
  toggleArchetypes: () => void;
  selectAspect: (fieldIndex: number, planeIndex: number) => void;
  clearSelection: () => void;
}

export interface UseTensorStateOptions {
  engine: TensorEngine;
  lattice: CognitiveAspect[][];
}

export function useTensorState({ engine, lattice }: UseTensorStateOptions): UseTensorStateResult {
  const [selectedPropertyId, setSelectedPropertyId] = useState(engine.properties[0]?.id ?? "");
  const [selectedCoordinate, setSelectedCoordinate] = useState<{ fieldIndex: number; planeIndex: number } | null>(
    lattice[0]?.[0] ? { fieldIndex: lattice[0][0].fieldIndex, planeIndex: lattice[0][0].planeIndex } : null,
  );
  const [showRecursion, setShowRecursion] = useState(false);
  const [showArchetypes, setShowArchetypes] = useState(false);

  const recursionDepth = showRecursion ? 3 : 1;

  const selectedAspect = useMemo(() => {
    if (!selectedCoordinate) return null;
    const row = lattice[selectedCoordinate.fieldIndex];
    return row?.[selectedCoordinate.planeIndex] ?? null;
  }, [lattice, selectedCoordinate]);

  const overlay = useMemo(() => {
    if (!selectedPropertyId) {
      return {};
    }
    return engine.computeOverlay(selectedPropertyId, { recursionDepth });
  }, [engine, recursionDepth, selectedPropertyId]);

  const tensorValues = useMemo(() => {
    if (!selectedAspect) return undefined;
    return engine.computeCellValues(selectedAspect.fieldIndex, selectedAspect.planeIndex, { recursionDepth });
  }, [engine, recursionDepth, selectedAspect]);

  const selectAspect = useCallback((fieldIndex: number, planeIndex: number) => {
    setSelectedCoordinate({ fieldIndex, planeIndex });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedCoordinate(null);
  }, []);

  const toggleRecursion = useCallback(() => {
    setShowRecursion((value) => !value);
  }, []);

  const toggleArchetypes = useCallback(() => {
    setShowArchetypes((value) => !value);
  }, []);

  return {
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
  };
}
