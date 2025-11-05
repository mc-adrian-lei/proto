export const fields = [
  "Priming",
  "Orienting",
  "Detecting",
  "Synthesizing",
  "Reconstructive",
  "Recursive"
];
export const planes = [
  "Base",
  "Subconscious",
  "Supra-Conscious",
  "Meta-Reflective",
  "Org",
  "Noetic"
];

export const phi = (1 + Math.sqrt(5)) / 2;
export const tensorEngine = {
  getAspect(field: number, plane: number) {
    return { field: fields[field], plane: planes[plane], phi };
  },
};
