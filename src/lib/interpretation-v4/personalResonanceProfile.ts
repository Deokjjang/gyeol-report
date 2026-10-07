import type { MyeongliSemanticProfile } from "./foundationIntegratedProfile";
import type { MbtiSemanticProfile } from "./mbtiSemanticProfile";
import type { MyeongliMbtiFusionProfile } from "./fusionCore";
import { stableFusionIssues } from "./fusionDiagnostics";
import type { ClaimProfile } from "./claimCore";
import { inspectClaimInputs, validateClaimCandidates } from "./claimDiagnostics";
import { buildClaimEvidenceView } from "./claimEvidence";
import { GYEOL_PERSONAL_RESONANCE_VERSION, PERSONAL_RESONANCE_REGISTRY_VERSION, GYEOL_CORE_GYEOL_VERSION, type PersonalResonanceProfile, type PersonalResonanceResult } from "./personalResonanceCore";
import { PERSONAL_RESONANCE_REGISTRY } from "./personalResonanceRegistry";
import { evaluatePersonalResonance, rejectedResonanceSpecificity } from "./personalResonanceEvaluator";
import { rankPersonalResonance } from "./personalResonanceRanking";
import { emptyResonanceDiagnostics, inspectPersonalResonanceRegistry, validatePersonalResonanceCandidates, validateCoreGyeol } from "./personalResonanceDiagnostics";
import { buildTraitArcs } from "./traitArc";
import { buildCoreGyeol } from "./coreGyeol";

/** Four immutable upstream inputs, no writer, route, scheduler or advice. */
export function buildPersonalResonanceProfile(m: MyeongliSemanticProfile, b: MbtiSemanticProfile, f: MyeongliMbtiFusionProfile, claims: ClaimProfile): PersonalResonanceResult {
  const diagnostics = emptyResonanceDiagnostics();
  diagnostics.hardErrors = stableFusionIssues([...inspectPersonalResonanceRegistry(PERSONAL_RESONANCE_REGISTRY), ...inspectClaimInputs(m, b, f),
    ...(claims.diagnostics.hardErrors.length ? [{ code: "INVALID_CLAIM_PROFILE", refs: [] }] : [])]);
  if (diagnostics.hardErrors.length) return { ok: false, diagnostics };
  diagnostics.hardErrors = validateClaimCandidates(claims.candidates, m, b, f);
  if (diagnostics.hardErrors.length) return { ok: false, diagnostics };
  const scope = { myeongli: m, mbti: b, claims, view: buildClaimEvidenceView(m, b, f) };
  const evaluated = PERSONAL_RESONANCE_REGISTRY.flatMap(d => { const c = evaluatePersonalResonance(d, scope); return c ? [c] : []; });
  diagnostics.unsupportedSpecificityRejected = PERSONAL_RESONANCE_REGISTRY.filter(d => !evaluated.some(c => c.ruleId === d.id) && rejectedResonanceSpecificity(d, scope)).map(d => d.id);
  const { candidates, duplicateGroups, conflictGroups } = rankPersonalResonance(evaluated);
  const traitArcs = buildTraitArcs(candidates, claims), { coreGyeolCandidates, bestCoreGyeol } = buildCoreGyeol(candidates, traitArcs);
  const byContext: PersonalResonanceProfile["byContext"] = {}, byDescriptionType: PersonalResonanceProfile["byDescriptionType"] = {};
  for (const c of candidates) {
    for (const context of c.contexts) (byContext[context] ??= []).push(c.id);
    (byDescriptionType[c.descriptionType] ??= []).push(c.id);
    diagnostics.emotionalMix[PERSONAL_RESONANCE_REGISTRY.find(d => d.id === c.ruleId)!.polarity]++;
  }
  const signature = candidates.filter(c => c.rank === "SIGNATURE"), main = candidates.filter(c => c.rank === "MAIN"), support = candidates.filter(c => c.rank === "SUPPORT");
  Object.assign(diagnostics, { totalCandidates: candidates.length, signatureCount: signature.length, mainCount: main.length, supportCount: support.length,
    genericCandidateCount: candidates.filter(c => c.genericness > .7).length, suppressedRuleIds: PERSONAL_RESONANCE_REGISTRY.filter(d => !candidates.some(c => c.ruleId === d.id)).map(d => d.id),
    duplicateGroups, conflictGroups, mbtiIndependentCandidateCount: candidates.filter(c => !c.evidence.mbtiSourceNodeIds.length).length,
    fusionDrivenCandidateCount: candidates.filter(c => c.evidence.fusionCandidateIds.length).length, coreGyeolCandidateCount: coreGyeolCandidates.length,
    coreGyeolQualityWarnings: coreGyeolCandidates.filter(c => c.diagnostics.qualityPassed < 6).map(c => c.id), traitArcCount: traitArcs.length });
  diagnostics.warnings = stableFusionIssues([
    ...(!b.available ? [{ code: "MBTI_UNAVAILABLE_NO_TYPE_INFERENCE", refs: [] }] : []),
    ...(!scope.view.fusionCandidates.length ? [{ code: "FUSION_UNAVAILABLE", refs: [] }] : []),
    ...(candidates.slice(0, 20).filter(c => c.genericness > .7).length > candidates.slice(0, 20).length / 2 ? [{ code: "GENERIC_TOP_CANDIDATES", refs: [] }] : []),
    ...(duplicateGroups.length ? [{ code: "SEMANTIC_DUPLICATES_RETAINED", refs: duplicateGroups.map(g => g.id) }] : []),
    ...(coreGyeolCandidates.length === 1 ? [{ code: "SINGLE_VALID_CORE_GYEOL", refs: [coreGyeolCandidates[0].id] }] : []),
    ...traitArcs.filter(a => !a.shadowDescription).map(a => ({ code: "ARC_WITHOUT_SUPPORTED_SHADOW", refs: [a.id] })),
    ...candidates.filter(c => !c.evidence.mbtiSourceNodeIds.length).map(c => ({ code: "SINGLE_SYSTEM_ONLY", refs: [c.id] })),
    ...coreGyeolCandidates.filter(c => c.identitySalience < .8).map(c => ({ code: "CONTEXT_SPECIFIC_CORE_NOT_BEST", refs: [c.id] })),
  ]);
  diagnostics.hardErrors = stableFusionIssues([...validatePersonalResonanceCandidates(candidates, scope), ...validateCoreGyeol(coreGyeolCandidates, candidates)]);
  if (diagnostics.hardErrors.length) return { ok: false, diagnostics };
  return { ok: true, value: { version: GYEOL_PERSONAL_RESONANCE_VERSION, registryVersion: PERSONAL_RESONANCE_REGISTRY_VERSION, coreGyeolVersion: GYEOL_CORE_GYEOL_VERSION,
    candidates, signature, main, support, byContext, byDescriptionType, duplicateGroups, conflictGroups, traitArcs, coreGyeolCandidates, ...(bestCoreGyeol ? { bestCoreGyeol } : {}), diagnostics,
    debug: { topSignatureResonance: structuredClone(signature.slice(0, 8)), topMainResonance: structuredClone(main.slice(0, 16)),
      byContext: structuredClone(byContext), byDescriptionType: structuredClone(byDescriptionType), duplicateGroups: structuredClone(duplicateGroups), conflictGroups: structuredClone(conflictGroups),
      traitArcs: structuredClone(traitArcs), coreGyeolCandidates: structuredClone(coreGyeolCandidates), ...(bestCoreGyeol ? { bestCoreGyeol: structuredClone(bestCoreGyeol) } : {}),
      mbtiIndependentCount: diagnostics.mbtiIndependentCandidateCount, fusionDrivenCount: diagnostics.fusionDrivenCandidateCount, diagnostics: structuredClone(diagnostics) } } };
}
