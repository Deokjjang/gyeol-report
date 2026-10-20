import { canonicalJson } from "../sourceReader";
import type { KnowledgeCandidate } from "../knowledge-binder/types";
/** Preserve the original normalized contract and append unresolved declarations
 * that it did not ingest. No natural-language predicate or source group is made. */
export function adaptMajorRequirements(original: KnowledgeCandidate, raw: Readonly<Record<string, unknown>>) {
  const candidate = structuredClone(original), originalConditions = original.requirement.unresolvedConditions;
  for (const field of ["requires", "natalRequired", "elementRequired", "requiredFacts", "formation", "counterconditions", "participants", "window", "condition", "unsupported", "sourceObservation"]) {
    if (raw[field] === undefined || candidate.requirement.unresolvedConditions.some(c => c.field === "/" + field)) continue;
    candidate.requirement.unresolvedConditions.push({ field: "/" + field, original: raw[field] });
  }
  if (candidate.requirement.unresolvedConditions.length) candidate.requirement.applicabilityState = candidate.requirement.sourceRequirements.some(s => s.selector) ? "PARTIALLY_CHECKABLE" : "CONTRACT_NOT_MACHINE_CHECKABLE";
  const normalized = { ...candidate.requirement, unresolvedConditions: originalConditions, applicabilityState: original.requirement.applicabilityState };
  if (canonicalJson(normalized) !== canonicalJson(original.requirement) || canonicalJson(candidate.requirement.unresolvedConditions.slice(0, originalConditions.length)) !== canonicalJson(originalConditions)) throw Error("ORIGINAL_MAJOR_REQUIREMENTS_RELAXED");
  return candidate;
}
