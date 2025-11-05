import type { CognitiveAspect } from "../data/cognitiveLattice";
import type { Annotation } from "../lib/collaborativeAnnotation";
import type { TensorCellComputation, TensorPropertyDefinition } from "../lib/lib-tensorEngine";
import type { OntologyValidationReport } from "../lib/ontologyValidation";

interface DetailPanelProps {
  cell: CognitiveAspect | null;
  tensorValues?: TensorCellComputation;
  propertyDefinitions: TensorPropertyDefinition[];
  annotations?: Annotation[];
  recursionDepth: number;
  validationReport?: OntologyValidationReport;
  onClose?: () => void;
}

export function DetailPanel({
  cell,
  tensorValues,
  propertyDefinitions,
  annotations,
  recursionDepth,
  validationReport,
  onClose,
}: DetailPanelProps) {
  if (!cell) return null;

  const issues = validationReport?.issues.filter((issue) => issue.coordinate === cell.id) ?? [];
  const values = tensorValues?.values ?? {};

  return (
    <div className="fixed right-4 top-4 w-96 max-h-[90vh] overflow-y-auto bg-slate-950/95 border border-indigo-700/50 rounded-2xl p-5 shadow-2xl space-y-4">
      <div className="flex justify-between items-start gap-2">
        <div>
          <h2 className="text-base font-semibold text-indigo-100 leading-tight">{cell.title}</h2>
          <p className="text-[11px] text-indigo-200 mt-1 leading-snug">{cell.summary}</p>
        </div>
        <button type="button" onClick={onClose} className="text-xs text-indigo-200/80 hover:text-indigo-100">
          Close
        </button>
      </div>

      <div className="text-[11px] text-indigo-200/90 space-y-1">
        <div>
          <span className="font-semibold text-indigo-100">Field:</span> {cell.field.symbol} · {cell.field.label} ({cell.field.processType})
        </div>
        <div>
          <span className="font-semibold text-indigo-100">Plane:</span> {cell.plane.symbol} · {cell.plane.label} ({cell.plane.hostTier})
        </div>
        <div>
          <span className="font-semibold text-indigo-100">Recursion depth:</span> ×{recursionDepth}
        </div>
        {cell.archetype && (
          <div className="flex items-center gap-2 text-violet-200">
            <span className="text-lg" style={{ color: cell.archetype.color }}>
              {cell.archetype.icon}
            </span>
            <span>{cell.archetype.description}</span>
          </div>
        )}
      </div>

      {tensorValues && (
        <div>
          <h3 className="text-[12px] font-semibold text-indigo-100 mb-2">Tensor harmonics</h3>
          <ul className="space-y-1 text-[11px] text-indigo-200/90">
            {propertyDefinitions.map((property) => (
              <li key={property.id} className="flex justify-between gap-4">
                <span>{property.label}</span>
                <span className="font-mono text-indigo-100">{values[property.id]?.toFixed(3) ?? "—"}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {annotations && annotations.length > 0 && (
        <div>
          <h3 className="text-[12px] font-semibold text-indigo-100 mb-2">Collaborative annotations</h3>
          <ul className="space-y-3 text-[11px] text-indigo-100/90">
            {annotations.map((annotation) => (
              <li key={annotation.id} className="border border-indigo-700/30 rounded-lg p-2 bg-slate-900/50">
                <div className="flex justify-between text-[10px] text-indigo-300/90">
                  <span>{annotation.author}</span>
                  <time dateTime={annotation.createdAt}>{new Date(annotation.createdAt).toLocaleDateString()}</time>
                </div>
                <p className="mt-1 leading-snug">{annotation.body}</p>
                {annotation.tags && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {annotation.tags.map((tag) => (
                      <span key={tag} className="px-1.5 py-0.5 rounded bg-indigo-800/60 text-[9px] uppercase tracking-wide text-indigo-100">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {issues.length > 0 && (
        <div>
          <h3 className="text-[12px] font-semibold text-amber-200 mb-1">Ontology notes</h3>
          <ul className="space-y-1 text-[10px] text-amber-100/90">
            {issues.map((issue, index) => (
              <li key={`${issue.coordinate ?? "global"}-${index}`}>
                <span className="uppercase tracking-wide mr-1">{issue.level}</span>
                {issue.message}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
