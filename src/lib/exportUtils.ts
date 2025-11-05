import type { CognitiveAspect } from "../data/cognitiveLattice";
import type { TensorEngine } from "./lib-tensorEngine";

export function exportLatticeToJSON(lattice: CognitiveAspect[][]): string {
  return JSON.stringify(lattice, null, 2);
}

export function exportLatticeToCSV(
  lattice: CognitiveAspect[][],
  engine: TensorEngine,
  propertyId: string,
): string {
  const header = [
    "field_index",
    "plane_index",
    "aspect_id",
    "field_label",
    "plane_label",
    propertyId,
  ];

  const rows = lattice.flatMap((row) =>
    row.map((cell) => {
      const value = engine.computeCellValues(cell.fieldIndex, cell.planeIndex).values[propertyId];
      return [
        String(cell.fieldIndex),
        String(cell.planeIndex),
        cell.id,
        cell.field.label,
        cell.plane.label,
        value?.toFixed(3) ?? "",
      ];
    }),
  );

  return [header, ...rows].map((line) => line.map(csvEscape).join(",")).join("\n");
}

export function exportOverlayToSVG(
  lattice: CognitiveAspect[][],
  overlay: Record<string, number>,
  size = 120,
): string {
  const rows = lattice.length;
  const cols = lattice[0]?.length ?? 0;
  const cellSize = size;
  const width = cols * cellSize;
  const height = rows * cellSize;

  const rects = lattice
    .map((row, fi) =>
      row
        .map((cell, pj) => {
          const key = cell.id;
          const value = overlay[key] ?? 0;
          const opacity = Math.max(0.08, Math.min(1, value));
          return `<rect x="${pj * cellSize}" y="${fi * cellSize}" width="${cellSize}" height="${cellSize}" fill="rgb(99,102,241)" fill-opacity="${opacity.toFixed(
            2,
          )}" stroke="rgb(30,41,59)" stroke-width="1" />`;
        })
        .join(""),
    )
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${rects}</svg>`;
}

function csvEscape(value: string): string {
  if (value.includes(",") || value.includes("\"") || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}
