export interface TensorCell {
  fieldIndex: number;
  planeIndex: number;
  values: Record<string, number>;
}

export interface TensorConfig {
  properties: string[];
}

const DEFAULT_PROPERTIES = ["Affect", "Gravity", "Salience", "Memory"];

export class TensorEngine {
  readonly properties: string[];

  constructor(config: Partial<TensorConfig> = {}) {
    this.properties = config.properties ?? DEFAULT_PROPERTIES;
  }

  computeCellValues(fieldIndex: number, planeIndex: number): TensorCell {
    const values: Record<string, number> = {};
    this.properties.forEach((property, index) => {
      const seed = Math.sin(fieldIndex * 13.37 + planeIndex * 7.11 + index);
      values[property] = (seed + 1) / 2;
    });

    return {
      fieldIndex,
      planeIndex,
      values,
    };
  }

  computeLattice(): Record<string, Record<string, number>> {
    const lattice: Record<string, Record<string, number>> = {};
    for (let fi = 0; fi < 6; fi += 1) {
      for (let pj = 0; pj < 6; pj += 1) {
        const cell = this.computeCellValues(fi, pj);
        lattice[`f${fi}-p${pj}`] = cell.values;
      }
    }
    return lattice;
  }
}

export const tensorEngine = new TensorEngine();
