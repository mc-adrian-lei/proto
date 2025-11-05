# Cognitive Lattice IDE — Integration Guide

This guide documents the architectural touch points for the cognitive lattice tensor environment. Use it as a reference when
extending the IDE, wiring new overlays, or integrating collaborative tooling.

## Directory Overview

```
src/
  App.tsx                      # Shell that mounts the IDE container
  components/
    TensorIDEContainer.tsx     # Orchestrates state, validation, exports, and rendering
    TensorControls.tsx         # Property selector, recursion toggles, export triggers
    GridMatrix.tsx             # 6×6 lattice visualisation with overlays and annotation hints
    DetailPanel.tsx            # Deep dive into a selected aspect, tensor harmonics, annotations
  data/
    cognitiveLattice.ts        # Dual-axis ontology describing all 36 aspects
  hooks/
    useTensorState.ts          # Shared state machine for property overlays and selection
  lib/
    lib-fields.ts              # Canonical cognitive field definitions (horizontal axis)
    lib-planes.ts              # Consciousness plane definitions (vertical axis)
    lib-tensorEngine.ts        # φ-bounded tensor computations and overlay generation
    ontologyValidation.ts      # Structural validation helpers for field/plane coherence
    exportUtils.ts             # Helpers for exporting the lattice to JSON/CSV/SVG
    collaborativeAnnotation.ts # In-memory collaborative annotation store
    archetypes.ts              # Symbolic archetype metadata surfaced in the UI
```

Legacy entry points (`src/lib/fields.ts`, `src/lib/planes.ts`, `src/lib/tensorEngine.ts`) re-export the canonical modules to
support downstream consumers that have not yet been migrated.

## Tensor Engine Contracts

* `TensorEngine.properties` exposes the available overlay dimensions. Each property carries:
  * `id` — stable identifier used in exports and overlays.
  * `label` — UI facing title.
  * `description` — guidance surfaced in the controls panel.
* `TensorEngine.computeCellValues(fi, pj, options)` returns:
  * Golden-ratio bounded harmonic weighting (`phiHarmonics`).
  * Semantic gravity, lived salience, memory resonance, and recursive coupling values.
  * φ weight and recursion gain metadata for advanced consumers.
* `TensorEngine.computeOverlay(propertyId, options)` aggregates a property over the full 6×6 grid for display.

The engine is deterministic; the same field/plane coordinates always yield identical values for a given recursion depth.

## Validation Pipeline

`validateOntology(lattice)` inspects the provided lattice for:

* Field and plane cardinality mismatches.
* Index integrity issues.
* Underspecified summaries (flagged as informational notes).

The IDE surfaces validation status inline so researchers can see coherence drift while iterating on ontology updates.

## Annotation Flows

`collaborativeAnnotation.ts` holds an in-memory annotation store that can be replaced with a networked service. Key
extension points:

* `getAnnotations(aspectId)` — hydrate a detail view with existing comments.
* `addAnnotation(annotation)` — push new commentary into the store.
* `getAnnotationSummaries(lattice)` — provide summary counts for the grid overlay.

To integrate a real-time backend, replace the store implementation but retain the exported function signatures.

## Export Utilities

Use `exportLatticeToJSON`, `exportLatticeToCSV`, or `exportOverlayToSVG` when wiring download actions. The IDE’s controls call
these helpers and handle browser download fallbacks automatically.

## Extending the IDE

1. Use `useTensorState` to stay in sync with the canonical tensor engine and overlays.
2. Run `validateOntology` after modifying lattice definitions to ensure coherence.
3. Respect the φ-bounded semantics within `lib-tensorEngine.ts` when introducing new properties or recursion dynamics.
4. Update `INTEGRATION_GUIDE.md` whenever you add top-level modules or change the public contracts described above.

Happy exploring — may the lattice reveal the harmonics you seek.
