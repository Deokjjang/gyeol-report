import type { SajuCalcResult } from "../saju/types";
import type { EvidenceAtom, FoundationSynthesisCandidate, SemanticAxis, FortuneTag, DynamicTag } from "./semanticCore";
import type { FoundationSemanticProfile } from "./foundationProfile";
import type { NormalizedTenGodStates } from "./foundationTenGods";
import { buildNatalFoundationFromCalculation } from "./foundationNatalProfile";
import { buildFoundationSupplementFromCalculation } from "./foundationSupplement";
import { CONTENT_RANK_POLICY, buildIntegratedAxisLedger, independentFamilies, isMeaningfulEvidence, normalizeContentScore,
  rawEvidenceWeight, rankInterpretationCandidates, sortedUnique, BROAD_SEMANTIC_THEMES, type BroadSemanticTheme } from "./foundationRanking";
import { buildHumanPatterns, buildInterpretationSeeds, detectMyeongliTensions } from "./foundationTension";
import { inspectIntegratedSources, stableDiagnostics, UNSUPPORTED_PROFILE_FEATURES, type MyeongliProfileDiagnostics, type ProfileDiagnostic } from "./foundationDiagnostics";

export const INTEGRATED_FOUNDATION_VERSION = "myeongli-semantic-profile-13d-1d-v1" as const;
export type IntegratedFoundationInput = {
  evidence: readonly EvidenceAtom[];
  synthesisCandidates: readonly FoundationSynthesisCandidate[];
  foundation?: { yinYang?: FoundationSemanticProfile["yinYang"]; elements?: FoundationSemanticProfile["elements"]; tenGodStates?: NormalizedTenGodStates };
  warnings?: readonly ProfileDiagnostic[];
  suppressedEvidence?: readonly ProfileDiagnostic[];
};
function initialDiagnostics(): MyeongliProfileDiagnostics {
  return { unsupportedCanonicalFeatures: [...UNSUPPORTED_PROFILE_FEATURES], suppressedEvidence: [], duplicateGroups: [],
    tensionCount: 0, signatureCandidateCount: 0, mainCandidateCount: 0, supportCandidateCount: 0, amplifierOnlyCandidates: [], warnings: [], hardErrors: [] };
}
function assembleProfile(input: IntegratedFoundationInput, inspected: ReturnType<typeof inspectIntegratedSources>, diagnostics: MyeongliProfileDiagnostics) {
  const { evidence, synthesisCandidates } = inspected;
  const { axes, contributions, rankedAxes } = buildIntegratedAxisLedger(evidence);
  const tensionCandidates = detectMyeongliTensions(evidence);
  const ranked = rankInterpretationCandidates(buildInterpretationSeeds(evidence, synthesisCandidates, tensionCandidates), evidence);
  const rankedCandidates = ranked.candidates;
  const signatureCandidates = rankedCandidates.filter(c => c.rank === "SIGNATURE"), mainCandidates = rankedCandidates.filter(c => c.rank === "MAIN"), supportCandidates = rankedCandidates.filter(c => c.rank === "SUPPORT");
  const bySource = (source: EvidenceAtom["sourceType"]) => evidence.filter(e => e.sourceType === source);
  const evidenceFamilies = independentFamilies(evidence).map(family => {
    const atoms = evidence.filter(e => e.family === family), ledger = buildIntegratedAxisLedger(atoms);
    return { family, evidenceIds: atoms.map(e => e.id), sourceTypes: sortedUnique(atoms.map(e => e.sourceType)),
      meaningfulEvidenceCount: atoms.filter(isMeaningfulEvidence).length,
      rawWeight: atoms.reduce((sum, e) => sum + rawEvidenceWeight(e), 0), effectiveWeight: atoms.reduce((sum, e) => sum + e.weight, 0),
      rawContribution: Object.fromEntries(ledger.rankedAxes.map(a => [a.axis, a.rawAggregate])) as Record<SemanticAxis, number>,
      effectiveContribution: ledger.axes };
  });
  const semanticThemes = (Object.keys(BROAD_SEMANTIC_THEMES) as BroadSemanticTheme[]).map(theme => {
    const candidates = rankedCandidates.filter(c => c.broadTheme === theme), ids = sortedUnique(candidates.flatMap(c => c.evidenceIds));
    const atoms = evidence.filter(e => ids.includes(e.id));
    return { theme, candidateCount: candidates.length, ...(candidates[0] ? { topCandidateId: candidates[0].id } : {}),
      evidenceIds: ids, evidenceDiversity: independentFamilies(atoms).length,
      totalSupport: atoms.reduce((sum, e) => sum + e.weight, 0), duplicationCount: candidates.filter(c => c.rankingFactors.duplicationPenalty > 0).length };
  });
  const fortuneSignals = (sortedUnique(evidence.flatMap(e => Object.keys(e.fortuneTags ?? {}))) as FortuneTag[]).map(tag => {
    const atoms = evidence.filter(e => e.fortuneTags?.[tag] !== undefined);
    return { tag, evidenceIds: atoms.map(e => e.id), rawContribution: atoms.reduce((sum, e) => sum + e.fortuneTags![tag]! * rawEvidenceWeight(e), 0),
      effectiveContribution: atoms.reduce((sum, e) => sum + e.fortuneTags![tag]! * e.weight, 0), promotion: "SUPPORT_ONLY" as const };
  });
  const dynamicSignals = (sortedUnique(evidence.flatMap(e => e.dynamicTags ?? [])) as DynamicTag[]).map(tag => {
    const atoms = evidence.filter(e => e.dynamicTags?.includes(tag));
    return { tag, evidenceIds: atoms.map(e => e.id), families: independentFamilies(atoms) };
  });
  const dominantAxes = rankedAxes.filter(a => a.absoluteStrength > 0).slice(0, CONTENT_RANK_POLICY.dominantAxisLimit);
  const dominantNames = new Set(dominantAxes.map(a => a.axis));
  const supportingAxes = rankedAxes.filter(a => !dominantNames.has(a.axis));
  const amplifierOnlyCandidates = rankedCandidates.filter(c => c.amplifierOnly).map(c => c.id);
  return { version: INTEGRATED_FOUNDATION_VERSION, axes, contributions, evidence, synthesisCandidates, rankedCandidates,
    rawAxes: Object.fromEntries(rankedAxes.map(a => [a.axis, a.rawAggregate])) as Record<SemanticAxis, number>,
    normalizedAxes: Object.fromEntries(rankedAxes.map(a => [a.axis, normalizeContentScore(a.netScore)])) as Record<SemanticAxis, number>,
    dominantAxes, supportingAxes, tensionCandidates, ...buildHumanPatterns(rankedCandidates, tensionCandidates),
    semanticThemes, evidenceFamilies, signatureCandidates, mainCandidates, supportCandidates, fortuneSignals, dynamicSignals,
    foundation: { yinYang: structuredClone(input.foundation?.yinYang ?? null), elements: structuredClone(input.foundation?.elements ?? null),
      pillars: [...bySource("heavenly_stem"), ...bySource("earthly_branch")],
      tenGods: { evidence: bySource("ten_god"), states: structuredClone(input.foundation?.tenGodStates ?? { families: {}, gods: {} }) },
      relations: bySource("relation"), twelveStages: bySource("twelve_stage"), shinsal: bySource("shinsal"), gwiin: bySource("gwiin") },
    diagnostics: { ...diagnostics, duplicateGroups: ranked.duplicateGroups, tensionCount: tensionCandidates.length,
      signatureCandidateCount: signatureCandidates.length, mainCandidateCount: mainCandidates.length, supportCandidateCount: supportCandidates.length,
      amplifierOnlyCandidates, warnings: stableDiagnostics([...diagnostics.warnings,
        ...amplifierOnlyCandidates.map(id => ({ code: "AMPLIFIER_ONLY_RANK_RESTRICTED", evidenceIds: rankedCandidates.find(c => c.id === id)!.evidenceIds, detail: id }))]) },
  };
}
export type MyeongliSemanticProfile = ReturnType<typeof assembleProfile>;
export type IntegratedProfileResult = { ok: true; value: MyeongliSemanticProfile } | { ok: false; diagnostics: MyeongliProfileDiagnostics };

/** Normalized internal hook, also used by explicit semantic fixtures. No raw
 * pillars/counts are classified here; 1A/1B/1C remain the sole producers. */
export function integrateMyeongliFoundation(input: IntegratedFoundationInput): IntegratedProfileResult {
  const inspected = inspectIntegratedSources(input.evidence, input.synthesisCandidates);
  const diagnostics = initialDiagnostics();
  diagnostics.hardErrors = inspected.hardErrors;
  diagnostics.suppressedEvidence = stableDiagnostics([...inspected.suppressedEvidence, ...(input.suppressedEvidence ?? [])]);
  diagnostics.warnings = stableDiagnostics([...inspected.warnings, ...(input.warnings ?? []),
    ...UNSUPPORTED_PROFILE_FEATURES.map(feature => ({ code: "CANONICAL_FEATURE_UNAVAILABLE", evidenceIds: [], detail: feature })),
    ...diagnostics.suppressedEvidence.map(d => ({ ...d, code: `SUPPRESSED:${d.code}` }))]);
  if (diagnostics.hardErrors.length) return { ok: false, diagnostics };
  return { ok: true, value: assembleProfile(input, inspected, diagnostics) };
}

/** Actual opt-in path: 1B already contains 1A, so never add 1A atoms twice.
 * This is intentionally not imported by any product writer or Book runtime. */
export function buildIntegratedMyeongliProfile(calculation: SajuCalcResult): IntegratedProfileResult {
  const natal = buildNatalFoundationFromCalculation(calculation), supplement = buildFoundationSupplementFromCalculation(calculation);
  if (!natal.ok || !supplement.ok) {
    const diagnostics = initialDiagnostics();
    diagnostics.hardErrors = stableDiagnostics([...(natal.ok ? [] : [{ code: natal.error, evidenceIds: [] }]), ...(supplement.ok ? [] : [{ code: supplement.error, evidenceIds: [] }])]);
    return { ok: false, diagnostics };
  }
  const foundation = natal.value.foundation;
  const warnings: ProfileDiagnostic[] = natal.value.limitations.map(code => ({ code, evidenceIds: [] }));
  if (natal.value.foundationUnavailable) warnings.push({ code: "INCOMPLETE_CHART_FOUNDATION_UNAVAILABLE", evidenceIds: [] });
  if (foundation && (!foundation.elements.strongestIsUnique || !foundation.elements.weakestIsUnique)) warnings.push({ code: "TIED_EXTREMA_SYNTHESIS_SUPPRESSED", evidenceIds: [] });
  for (const family of natal.value.families.filter(f => f.normalizedState === undefined)) warnings.push({ code: "CANONICAL_FAMILY_STRENGTH_UNAVAILABLE", evidenceIds: family.evidenceIds, detail: family.family });
  const input: IntegratedFoundationInput = {
    evidence: [...natal.value.evidence, ...supplement.value.evidence], synthesisCandidates: natal.value.synthesisCandidates,
    foundation: { ...(foundation ? { yinYang: foundation.yinYang, elements: foundation.elements } : {}), tenGodStates: natal.value.states },
    warnings, suppressedEvidence: supplement.value.suppressed.map(s => ({ code: s.reason, evidenceIds: [s.canonicalId] })),
  };
  return integrateMyeongliFoundation(input);
}
