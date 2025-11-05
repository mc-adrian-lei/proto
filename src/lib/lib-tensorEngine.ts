import { COGNITIVE_FIELDS, getFieldByIndex } from "./lib-fields";
import { CONSCIOUSNESS_PLANES, getPlaneByIndex } from "./lib-planes";

const PHI = (1 + Math.sqrt(5)) / 2;

export interface TensorPropertyDefinition {
  id: string;
  label: string;
  description: string;
}

export interface TensorCellComputation {
  fieldIndex: number;
  planeIndex: number;
  values: Record<string, number>;
  phiWeight: number;
  recursionGain: number;
}

export interface TensorAspectDetail {
  fieldIndex: number;
  planeIndex: number;
  fieldName: string;
  planeName: string;
  phi: number;
  gravity: number;
  salience: number;
  values: Record<string, number>;
}

export interface ComputeOptions {
  recursionDepth?: number;
}

const PROCESS_WEIGHTS: Record<string, number> = {
  sensorimotor: 0.18,
  implicit: 0.34,
  reflective: 0.52,
  hybrid: 0.68,
  collective: 0.82,
  noetic: 0.94,
};

const HOST_WEIGHTS: Record<string, number> = {
  "Individual Human": 0.36,
  "Human + AI Augmented": 0.62,
  "Collective Systems": 0.81,
  "Noetic / Field Cognition": 0.95,
};

const PROPERTY_DEFINITIONS: TensorPropertyDefinition[] = [
  {
    id: "phiHarmonics",
    label: "φ-bounded Harmonics",
    description: "Golden-ratio bounded harmonic weighting describing coherence between field and plane.",
  },
  {
    id: "semanticGravity",
    label: "Semantic Gravity",
    description: "Relative pull created by narrative density and process coupling within the aspect.",
  },
  {
    id: "livedSalience",
    label: "Lived Salience",
    description: "Felt immediacy based on process type, host tier, and phi resonance.",
  },
  {
    id: "memoryResonance",
    label: "Memory Resonance",
    description: "Retentive strength indicating how the aspect participates in collective remembering.",
  },
  {
    id: "recursiveCoupling",
    label: "Recursive Coupling",
    description: "Feedback amplification from iterative hand-offs between cognitive planes.",
  },
];

export class TensorEngine {
  readonly properties = PROPERTY_DEFINITIONS;

  getPropertyById(propertyId: string): TensorPropertyDefinition | undefined {
    return this.properties.find((property) => property.id === propertyId);
  }

  computeCellValues(fieldIndex: number, planeIndex: number, options: ComputeOptions = {}): TensorCellComputation {
    const recursionDepth = Math.max(1, options.recursionDepth ?? 1);
    const field = getFieldByIndex(fieldIndex);
    const plane = getPlaneByIndex(planeIndex);

    if (!field || !plane) {
      throw new Error(`Invalid lattice coordinate f${fieldIndex}-p${planeIndex}`);
    }

    const phiSeed = this.phiBoundedProportion((fieldIndex + 1) * (planeIndex + 1) * 0.618);
    const processWeight = PROCESS_WEIGHTS[field.processType];
    const hostWeight = HOST_WEIGHTS[plane.hostTier];
    const semanticGravity = this.semanticGravity(fieldIndex, planeIndex);
    const recursionGain = this.recursiveCouplingGain(fieldIndex, planeIndex, recursionDepth);

    const livedSalience = this.normalize((phiSeed + processWeight + hostWeight) / 3);
    const memoryResonance = this.normalize((livedSalience + recursionGain + processWeight) / 3);

    const values: Record<string, number> = {
      phiHarmonics: phiSeed,
      semanticGravity,
      livedSalience,
      memoryResonance,
      recursiveCoupling: recursionGain,
    };

    return {
      fieldIndex,
      planeIndex,
      values,
      phiWeight: phiSeed,
      recursionGain,
    };
  }

  computeLattice(options: ComputeOptions = {}): Record<string, Record<string, number>> {
    const lattice: Record<string, Record<string, number>> = {};
    COGNITIVE_FIELDS.forEach((field) => {
      CONSCIOUSNESS_PLANES.forEach((plane) => {
        const key = `f${field.index}-p${plane.index}`;
        lattice[key] = this.computeCellValues(field.index, plane.index, options).values;
      });
    });
    return lattice;
  }

  computeOverlay(propertyId: string, options: ComputeOptions = {}): Record<string, number> {
    if (!this.getPropertyById(propertyId)) {
      return {};
    }

    const overlay: Record<string, number> = {};
    COGNITIVE_FIELDS.forEach((field) => {
      CONSCIOUSNESS_PLANES.forEach((plane) => {
        const key = `f${field.index}-p${plane.index}`;
        const value = this.computeCellValues(field.index, plane.index, options).values[propertyId];
        if (typeof value === "number") {
          overlay[key] = value;
        }
      });
    });
    return overlay;
  }

  getAspect(fieldIndex: number, planeIndex: number, options: ComputeOptions = {}): TensorAspectDetail {
    const field = getFieldByIndex(fieldIndex);
    const plane = getPlaneByIndex(planeIndex);

    if (!field || !plane) {
      throw new Error(`Invalid lattice coordinate f${fieldIndex}-p${planeIndex}`);
    }

    const computation = this.computeCellValues(fieldIndex, planeIndex, options);
    const gravity = computation.values.semanticGravity ?? 0;
    const salience = computation.values.livedSalience ?? 0;

    return {
      fieldIndex,
      planeIndex,
      fieldName: `${field.symbol} · ${field.label}`,
      planeName: `${plane.symbol} · ${plane.label}`,
      phi: PHI,
      gravity,
      salience,
      values: computation.values,
    };
  }

  private phiBoundedProportion(seed: number): number {
    const fractional = seed % 1;
    const bounded = (fractional * PHI) % 1;
    return this.normalize(bounded);
  }

  private semanticGravity(fieldIndex: number, planeIndex: number): number {
    const distance = Math.abs(fieldIndex - planeIndex);
    const maxDistance = COGNITIVE_FIELDS.length + CONSCIOUSNESS_PLANES.length - 2;
    const gravity = 1 - distance / maxDistance;
    return this.normalize(gravity * 0.85 + 0.1);
  }

  private recursiveCouplingGain(fieldIndex: number, planeIndex: number, recursionDepth: number): number {
    const base = (fieldIndex + 1) * (planeIndex + 1) * recursionDepth * 0.42;
    return this.normalize(this.phiBoundedProportion(base) * 0.8 + recursionDepth / 12);
  }

  private normalize(value: number): number {
    if (Number.isNaN(value)) {
      return 0;
    }
    return Math.min(1, Math.max(0, value));
  }
}

export const tensorEngine = new TensorEngine();
