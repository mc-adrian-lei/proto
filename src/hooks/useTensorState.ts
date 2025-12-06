import { useCallback, useMemo, useState } from "react";
import { COGNITIVE_FIELDS } from "../lib/lib-fields";
import { CONSCIOUSNESS_PLANES } from "../lib/lib-planes";
import { tensorEngine } from "../lib/tensorEngine";

export interface SelectedCoordinate {
  fieldIndex: number;
  planeIndex: number;
}

export interface UseTensorStateResult {
  selected: SelectedCoordinate | null;
  setSelected: (coordinate: SelectedCoordinate | null) => void;
  overlay: Record<string, number>;
  tensorProperties: { id: string; label: string }[];
  selectedProperty: string;
  setSelectedProperty: (propertyId: string) => void;
  recursionEnabled: boolean;
  toggleRecursion: () => void;
  archetypesEnabled: boolean;
  toggleArchetypes: () => void;
  recursionDepth: number;
}

const FIRST_COORDINATE: SelectedCoordinate | null =
  COGNITIVE_FIELDS.length && CONSCIOUSNESS_PLANES.length
    ? { fieldIndex: COGNITIVE_FIELDS[0].index, planeIndex: CONSCIOUSNESS_PLANES[0].index }
    : null;

export function useTensorState(): UseTensorStateResult {
  const [selected, setSelected] = useState<SelectedCoordinate | null>(FIRST_COORDINATE);
  const [selectedProperty, setSelectedProperty] = useState<string>(tensorEngine.properties[0]?.id ?? "");
  const [recursionEnabled, setRecursionEnabled] = useState(false);
  const [archetypesEnabled, setArchetypesEnabled] = useState(false);

  const recursionDepth = recursionEnabled ? 3 : 1;

  const overlay = useMemo(() => {
    if (!selectedProperty) {
      return {};
    }
    return tensorEngine.computeOverlay(selectedProperty, { recursionDepth });
  }, [recursionDepth, selectedProperty]);

  const tensorProperties = useMemo(
    () => tensorEngine.properties.map((property) => ({ id: property.id, label: property.label })),
    [],
  );

  const toggleRecursion = useCallback(() => {
    setRecursionEnabled((value) => !value);
  }, []);

  const toggleArchetypes = useCallback(() => {
    setArchetypesEnabled((value) => !value);
  }, []);

  return {
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
  };
}
