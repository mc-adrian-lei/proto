import type { CognitiveAspect } from "../data/cognitiveLattice";
import { COGNITIVE_FIELDS } from "./lib-fields";
import { CONSCIOUSNESS_PLANES } from "./lib-planes";

export type ValidationLevel = "error" | "warning" | "info";

export interface OntologyValidationIssue {
  level: ValidationLevel;
  message: string;
  coordinate?: string;
}

export interface OntologyValidationReport {
  valid: boolean;
  issues: OntologyValidationIssue[];
  fieldCount: number;
  planeCount: number;
}

export function validateOntology(lattice: CognitiveAspect[][]): OntologyValidationReport {
  const issues: OntologyValidationIssue[] = [];

  if (lattice.length !== COGNITIVE_FIELDS.length) {
    issues.push({
      level: "error",
      message: `Expected ${COGNITIVE_FIELDS.length} cognitive fields but received ${lattice.length}.`,
    });
  }

  lattice.forEach((row, fieldIndex) => {
    if (row.length !== CONSCIOUSNESS_PLANES.length) {
      issues.push({
        level: "error",
        coordinate: `f${fieldIndex}`,
        message: `Field ${fieldIndex} does not contain ${CONSCIOUSNESS_PLANES.length} planes.`,
      });
    }

    row.forEach((cell, planeIndex) => {
      if (cell.fieldIndex !== fieldIndex) {
        issues.push({
          level: "warning",
          coordinate: cell.id,
          message: `Field index mismatch: expected ${fieldIndex} but received ${cell.fieldIndex}.`,
        });
      }
      if (cell.planeIndex !== planeIndex) {
        issues.push({
          level: "warning",
          coordinate: cell.id,
          message: `Plane index mismatch: expected ${planeIndex} but received ${cell.planeIndex}.`,
        });
      }
      if (!cell.summary || cell.summary.length < 12) {
        issues.push({
          level: "info",
          coordinate: cell.id,
          message: "Summary is very short; consider expanding narrative context.",
        });
      }
    });
  });

  return {
    valid: !issues.some((issue) => issue.level === "error"),
    issues,
    fieldCount: COGNITIVE_FIELDS.length,
    planeCount: CONSCIOUSNESS_PLANES.length,
  };
}
