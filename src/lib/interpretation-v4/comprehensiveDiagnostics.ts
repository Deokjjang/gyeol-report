import { buildContextualGuidanceProfile } from "./guidanceProfile";
import type { GuidanceContextInput } from "./guidanceContext";
import { stableResonanceValue } from "./personalResonanceDiagnostics";
import { COMPREHENSIVE_SECTIONS, type ComprehensivePlanDiagnostics, type ComprehensivePlanInputs, type EditorialCandidate, type EditorialSuppression } from "./comprehensivePlanCore";
import { editorialUnique } from "./comprehensiveCandidateAdapter";

export function emptyComprehensiveDiagnostics(): ComprehensivePlanDiagnostics {
  return { candidateCount: 0, assignedPrimaryCount: 0, assignedSupportCount: 0, suppressedCount: 0,
    sectionCoverage: Object.fromEntries(COMPREHENSIVE_SECTIONS.map(s => [s, 0])) as ComprehensivePlanDiagnostics["sectionCoverage"],
    sectionNovelty: Object.fromEntries(COMPREHENSIVE_SECTIONS.map(s => [s, [] as string[]])) as ComprehensivePlanDiagnostics["sectionNovelty"],
    duplicateThemeWarnings: [], evidenceReuseWarnings: [], unresolvedContradictions: [], c10NewEvidenceViolations: [], terminologyDefinitionViolations: [], warnings: [], hardErrors: [] };
}

export function inspectComprehensiveInputs(input: ComprehensivePlanInputs): string[] {
  if ([input.myeongli, input.mbti, input.fusion, input.claims, input.resonance, input.guidance].some(p => p.diagnostics.hardErrors.length)) return ["UPSTREAM_HARD_DIAGNOSTIC"];
  const provenance = input.guidance.context.provenance;
  const raw: GuidanceContextInput = {
    ...(provenance.lifeStatusSource !== undefined ? { jobStatus: provenance.lifeStatusSource.replace(/^userContext\.jobStatus:/, "") as GuidanceContextInput["jobStatus"] } : {}),
    ...(provenance.relationshipSource !== undefined ? { relationshipStatus: provenance.relationshipSource.replace(/^userContext\.relationshipStatus:/, "") as GuidanceContextInput["relationshipStatus"] } : {}),
    ...(provenance.jobTextSource !== undefined ? { detailJob: input.guidance.context.rawJobText ?? "" } : {}),
  };
  // The existing 3C boundary recursively verifies 1D/2A/2B/3A/3B. Comparing the
  // full 3C result also prevents forged top/merged/provenance views from being
  // used as a back door. No new semantic validity thresholds are introduced.
  const rebuilt = buildContextualGuidanceProfile(input, raw);
  if (!rebuilt.ok) return rebuilt.diagnostics.hardErrors.map(e => `UPSTREAM:${e}`);
  return stableResonanceValue(rebuilt.value) === stableResonanceValue(input.guidance) ? [] : ["STALE_OR_FORGED_GUIDANCE_PROFILE"];
}

export function filterEditorialCandidates(rows: readonly EditorialCandidate[], input: ComprehensivePlanInputs) {
  const ids = new Set([...input.myeongli.evidence.map(e => e.id), ...input.mbti.sourceNodes.filter(n => n.classification === "SCORING_SEMANTIC").map(n => n.id)]);
  const eligible: EditorialCandidate[] = [], suppressed: EditorialSuppression[] = [];
  for (const row of rows) {
    const errors = [...row.invalidReasons];
    if (!row.underlyingEvidenceIds.length || row.underlyingEvidenceIds.some(id => !ids.has(id))) errors.push("INVALID_OR_REFERENCE_ONLY_EVIDENCE");
    if (!input.mbti.available && row.mbtiSourceNodeIds.length) errors.push("UNKNOWN_MBTI_INFERENCE");
    if ([row.confidence, row.specificity, row.emotionalValue, row.evidenceDiversity, row.fusionValue, row.inputFit, row.genericness].some(n => !Number.isFinite(n) || n < 0 || n > 1)) errors.push("INVALID_EDITORIAL_COMPONENT");
    if (errors.length) suppressed.push(...editorialUnique(errors).map(reason => ({ candidateId: row.id, reason })));
    else eligible.push(row);
  }
  return { eligible, suppressed };
}
