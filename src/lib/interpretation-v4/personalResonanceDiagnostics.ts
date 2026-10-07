import { BIPOLAR_AXES, DYNAMIC_TAGS, FORTUNE_TAGS, SEMANTIC_AXES } from "./semanticCore";
import { FUSION_COMPLEMENT_RULES } from "./fusionComplementRegistry";
import { FUSION_CONDITION_SPLITS, fusionUnique as unique, type FusionIssue } from "./fusionCore";
import { stableFusionIssues } from "./fusionDiagnostics";
import { SPECIFIC_TEN_GOD_RULES } from "./foundationTenGodSynthesis";
import { CLAIM_REGISTRY } from "./claimRegistry";
import type { ClaimCondition } from "./claimCore";
import { HUMAN_DESCRIPTION_TYPES, humanLanguageErrors } from "./humanDescription";
import { CORE_GYEOL_GRAMMARS, RESONANCE_RISKS, type CoreGyeolCandidate, type PersonalResonanceCandidate, type PersonalResonanceDiagnostics, type ResonanceCondition, type ResonanceDefinition } from "./personalResonanceCore";
import { PERSONAL_RESONANCE_REGISTRY } from "./personalResonanceRegistry";
import type { ResonanceScope } from "./personalResonanceEvidence";
import { evaluatePersonalResonance } from "./personalResonanceEvaluator";
import { rankPersonalResonance } from "./personalResonanceRanking";

export const stableResonanceValue = (v: unknown): string => {
  if (Array.isArray(v)) return `[${v.map(stableResonanceValue).join(",")}]`;
  if (v && typeof v === "object") return `{${Object.entries(v).filter(([, v]) => v !== undefined).sort(([a], [b]) => a < b ? -1 : 1).map(([k, v]) => `${JSON.stringify(k)}:${stableResonanceValue(v)}`).join(",")}}`;
  return JSON.stringify(v);
};
export function emptyResonanceDiagnostics(): PersonalResonanceDiagnostics {
  return { totalCandidates: 0, signatureCount: 0, mainCount: 0, supportCount: 0, genericCandidateCount: 0, unsupportedSpecificityRejected: [], suppressedRuleIds: [],
    duplicateGroups: [], conflictGroups: [], mbtiIndependentCandidateCount: 0, fusionDrivenCandidateCount: 0, coreGyeolCandidateCount: 0, coreGyeolQualityWarnings: [], traitArcCount: 0,
    warnings: [], hardErrors: [], emotionalMix: { positive: 0, neutral: 0, shadow: 0 } };
}
export function inspectPersonalResonanceRegistry(registry: readonly ResonanceDefinition[]): FusionIssue[] {
  const errors: FusionIssue[] = [], seen = new Set<string>();
  const fail = (code: string, refs: string[]) => errors.push({ code, refs });
  const validAxis = (x: string) => (SEMANTIC_AXES as readonly string[]).includes(x);
  for (const d of registry) {
    if (!/^PR(?:00[1-9]|0[1-8][0-9]|09[0-6])$/.test(d.id)) fail("INVALID_PR_ID", [d.id]);
    if (seen.has(d.id)) fail("DUPLICATE_PR_ID", [d.id]); seen.add(d.id);
    if (!HUMAN_DESCRIPTION_TYPES.includes(d.descriptionType) || !d.contexts.length || d.contexts.some(c => !["identity", "work", "money", "social", "love", "stress", "learning", "recovery"].includes(c))) fail("INVALID_PR_METADATA", [d.id]);
    if (!d.primaryAxes.length || d.primaryAxes.some(a => !validAxis(a))) fail("INVALID_AXIS", [d.id]);
    if ([d.specificityBase, d.emotionalImpactBase].some(v => !Number.isFinite(v) || v < 0 || v > 1)) fail("INVALID_EDITORIAL_FACTOR", [d.id]);
    for (const text of [d.humanDescription, d.positiveMeaning, d.shadowMeaning, ...d.alternatives.map(v => v.text)].filter((x): x is string => !!x)) {
      for (const code of humanLanguageErrors(text)) fail(code, [d.id]);
    }
    function existing(c: ClaimCondition) {
      if (c.kind === "axis" && (!validAxis(c.requirement.axis) || !["SUPPORT", "MAIN", "STRONG"].includes(c.requirement.band) || ![1, -1].includes(c.requirement.direction) ||
        (c.requirement.direction < 0 && !(BIPOLAR_AXES as readonly string[]).includes(c.requirement.axis)))) fail("INVALID_AXIS", [d.id]);
      if (c.kind === "synthesis" && !SPECIFIC_TEN_GOD_RULES.some(r => r.id === c.theme)) fail("UNKNOWN_SYNTHESIS_THEME", [d.id, c.theme]);
      if (c.kind === "fusion" && !FUSION_COMPLEMENT_RULES.some(r => r.id === c.ruleId)) fail("UNKNOWN_FUSION_ID", [d.id]);
      if (c.kind === "fortune" && !FORTUNE_TAGS.includes(c.tag)) fail("UNKNOWN_FORTUNE_TAG", [d.id]);
      if (c.kind === "dynamic" && !DYNAMIC_TAGS.includes(c.tag)) fail("UNKNOWN_DYNAMIC_TAG", [d.id]);
      if (c.kind === "all" || c.kind === "any") { if (!c.conditions.length) fail("EMPTY_CONDITION", [d.id]); c.conditions.forEach(existing); }
    }
    function check(c: ResonanceCondition) {
      if (c.kind === "existing") existing(c.condition);
      if (c.kind === "claim" && (!CLAIM_REGISTRY.some(r => r.id === c.id) || c.minLevel < 1 || c.minLevel > 4)) fail("UNKNOWN_CLAIM_ID", [d.id, c.id]);
      if (c.kind === "fusion" && ((!c.ruleId && !c.theme && !c.split) || (c.ruleId && !FUSION_COMPLEMENT_RULES.some(r => r.id === c.ruleId)) ||
        (c.theme && !FUSION_COMPLEMENT_RULES.some(r => r.semanticTheme === c.theme)) || (c.split && !FUSION_CONDITION_SPLITS.includes(c.split)))) fail("UNKNOWN_FUSION_ID_OR_THEME", [d.id]);
      if (c.kind === "limited" && !validAxis(c.axis)) fail("INVALID_AXIS", [d.id]);
      if (c.kind === "risk" && !RESONANCE_RISKS.includes(c.risk)) fail("UNSUPPORTED_BEHAVIOR_GATE", [d.id]);
      if (c.kind === "all" || c.kind === "any") { if (!c.conditions.length) fail("EMPTY_CONDITION", [d.id]); c.conditions.forEach(check); }
    }
    [d.required, ...d.optionalSupport, ...d.forbiddenConditions, ...d.alternatives.map(v => v.when)].forEach(check);
  }
  if (registry.length !== 96 || Array.from({ length: 96 }, (_, i) => `PR${String(i + 1).padStart(3, "0")}`).some(id => !seen.has(id))) fail("INCOMPLETE_PR_REGISTRY", []);
  return stableFusionIssues(errors);
}
export function validatePersonalResonanceCandidates(candidates: readonly PersonalResonanceCandidate[], s: Omit<ResonanceScope, "context">): FusionIssue[] {
  const expected = rankPersonalResonance(PERSONAL_RESONANCE_REGISTRY.flatMap(d => { const c = evaluatePersonalResonance(d, s); return c ? [c] : []; })).candidates;
  const errors: FusionIssue[] = [], seen = new Set<string>();
  for (const c of candidates) {
    const fail = (code: string) => errors.push({ code, refs: [c.id] });
    if (seen.has(c.id)) fail("DUPLICATE_PR_ID"); seen.add(c.id);
    if (!PERSONAL_RESONANCE_REGISTRY.some(d => d.id === c.ruleId)) fail("INVALID_PR_ID");
    for (const ids of Object.values(c.evidence)) if (ids.length !== unique(ids).length) fail("UNDERLYING_EVIDENCE_DOUBLE_COUNT");
    if (c.evidence.myeongliEvidenceIds.some(id => !s.view.myeongliEvidenceIds.includes(id))) fail("UNSUPPORTED_EVIDENCE_ID");
    if (c.evidence.mbtiSourceNodeIds.some(id => !s.view.mbtiSourceNodeIds.includes(id))) fail("REFERENCE_ONLY_MBTI_SOURCE");
    if (c.evidence.fusionCandidateIds.some(id => !s.view.fusionCandidates.some(f => f.id === id))) fail("UNKNOWN_FUSION_ID");
    if (c.evidence.claimIds.some(id => !s.claims.candidates.some(x => x.id === id))) fail("UNKNOWN_CLAIM_ID");
    humanLanguageErrors(c.humanDescription).forEach(fail);
    if (c.diagnostics.unsupportedSpecificity) fail("UNSUPPORTED_SPECIFICITY");
    const known = expected.find(e => e.id === c.id);
    if (!known) fail("UNSUPPORTED_RESONANCE");
    else if (stableResonanceValue(known) !== stableResonanceValue(c)) fail("STALE_OR_FORGED_RESONANCE");
  }
  return stableFusionIssues(errors);
}
export function validateCoreGyeol(candidates: readonly CoreGyeolCandidate[], resonance: readonly PersonalResonanceCandidate[]): FusionIssue[] {
  const errors: FusionIssue[] = [];
  for (const c of candidates) {
    const fail = (code: string) => errors.push({ code, refs: [c.id] });
    if (!CORE_GYEOL_GRAMMARS.includes(c.grammar) || c.diagnostics.concepts.length > 3 || c.diagnostics.concepts.length < 2) fail("INVALID_CORE_CONCEPTS");
    const sources = resonance.filter(r => c.sourceResonanceIds.includes(r.id));
    if (!sources.length || sources.length !== c.sourceResonanceIds.length) fail("INVALID_CORE_SOURCE");
    if (sources.some(r => r.diagnostics.unresolvedContradiction)) fail("UNRESOLVED_CORE_CONTRADICTION");
    if (c.diagnostics.qualityQuestions.length !== 7) fail("INVALID_CORE_QUALITY_CONTRACT");
    humanLanguageErrors(c.humanDescription).forEach(fail);
    if (/재물복|사람복|명예운|돈과 명예를 얻/.test(c.humanDescription)) fail("FORTUNE_DOMINATES_CORE");
  }
  return stableFusionIssues(errors);
}
