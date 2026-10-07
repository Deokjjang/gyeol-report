import type { MyeongliSemanticProfile } from "./foundationIntegratedProfile";
import type { MbtiSemanticProfile } from "./mbtiSemanticProfile";
import { TEN_GOD_SEMANTICS } from "./foundationTenGods";
import { BIPOLAR_AXES, DYNAMIC_TAGS, FORTUNE_TAGS } from "./semanticCore";
import { inspectFusionInputs, validFusionAxis, validFusionContexts } from "./fusionProfileAdapter";
import { inspectFusionMyeongliSource, stableFusionIssues, validateFusionCandidates } from "./fusionDiagnostics";
import { buildMyeongliMbtiFusion } from "./fusionSemanticProfile";
import { FUSION_COMPLEMENT_RULES } from "./fusionComplementRegistry";
import { fusionUnique as unique, type FusionIssue, type MyeongliMbtiFusionProfile } from "./fusionCore";
import { CLAIM_CATEGORIES, CLAIM_LEVELS, type ClaimCandidate, type ClaimCondition, type ClaimDefinition, type ClaimDiagnostics } from "./claimCore";
import { CLAIM_REGISTRY, FORTUNE_CLAIM_IDS, LEVEL4_CLAIM_IDS } from "./claimRegistry";
import { buildClaimEvidenceView } from "./claimEvidence";
import { evaluateClaim } from "./claimEvaluator";

export function emptyClaimDiagnostics(): ClaimDiagnostics {
  return { generatedCount: 0, levelCounts: { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 }, fortuneCount: 0, factBombCount: 0,
    suppressedInsufficientEvidence: [], suppressedAmplifierOnly: [], suppressedMissingMyeongliGate: [], suppressedContradiction: [],
    conflictGroups: [], exclusivityGroups: [], warnings: [], hardErrors: [] };
}
export const CLAIM_FORBIDDEN_LANGUAGE = /발현|양상|상호작용|사회적\s?지위|역할과\s?이름|내적\s?성찰|재정적\s?성취|복합적으로\s?작용|경향성이 있습니다|가능성이 존재합니다|해석될 여지가 있습니다|좋은 흐름|사회적 자리|자신의 몫|반드시|무조건|확실히 부자|부자가 됩니다|고위직이 됩니다|CEO가 됩니다|유명해집니다|승진합니다|사업(?:하면 성공| 성공합니다)|좋은 배우자를 만납니다|평생 귀인이 돕습니다|바람기|돈에 미쳤|성격이 나쁨|공감 능력이 없|사람을 이용|정신적 문제/;

export function inspectClaimRegistry(registry: readonly ClaimDefinition[]): FusionIssue[] {
  const errors: FusionIssue[] = [], seen = new Set<string>();
  const fail = (code: string, refs: string[]) => errors.push({ code, refs });
  const validFusion = (id: string) => FUSION_COMPLEMENT_RULES.some(r => r.id === id);
  for (const d of registry) {
    if (!CLAIM_REGISTRY.some(r => r.id === d.id)) fail("UNKNOWN_CLAIM_ID", [d.id]);
    if (seen.has(d.id)) fail("DUPLICATE_CLAIM_ID", [d.id]); seen.add(d.id);
    if (!CLAIM_CATEGORIES.includes(d.category) || !validFusionContexts(d.contexts)) fail("INVALID_CLAIM_METADATA", [d.id]);
    if (d.fortuneClaim !== (FORTUNE_CLAIM_IDS as readonly string[]).includes(d.id)) fail("FORTUNE_FLAG_MISMATCH", [d.id]);
    if (d.factBomb !== (d.id.startsWith("F") || d.id.startsWith("M10_"))) fail("FACT_BOMB_FLAG_MISMATCH", [d.id]);
    if (!CLAIM_LEVELS.includes(d.minLevel) || !CLAIM_LEVELS.includes(d.maxLevel) || d.minLevel < 1 || d.minLevel > d.maxLevel) fail("INVALID_CLAIM_LEVEL", [d.id]);
    if (d.maxLevel === 4 && !(LEVEL4_CLAIM_IDS as readonly string[]).includes(d.id)) fail("UNAUTHORIZED_LEVEL4", [d.id]);
    for (const [level, copy] of Object.entries(d.claimsByLevel)) {
      if (!copy || Number(level) < d.minLevel || Number(level) > d.maxLevel || !CLAIM_LEVELS.includes(Number(level) as 0)) fail("INVALID_COPY_LEVEL_MAPPING", [d.id, level]);
      if (CLAIM_FORBIDDEN_LANGUAGE.test(copy)) fail("FORBIDDEN_CLAIM_LANGUAGE", [d.id]);
    }
    for (let level = d.minLevel; level <= d.maxLevel; level++) if (!d.claimsByLevel[level as 1]) fail("MISSING_LEVEL_COPY", [d.id, String(level)]);
    if (d.alternativeLevel3 && CLAIM_FORBIDDEN_LANGUAGE.test(d.alternativeLevel3)) fail("FORBIDDEN_CLAIM_LANGUAGE", [d.id]);
    function check(c: ClaimCondition) {
      if (c.kind === "axis" && (!validFusionAxis(c.requirement.axis) || !["SUPPORT", "MAIN", "STRONG"].includes(c.requirement.band) || ![1, -1].includes(c.requirement.direction) ||
        (c.requirement.direction < 0 && !(BIPOLAR_AXES as readonly string[]).includes(c.requirement.axis)))) fail("INVALID_AXIS_REQUIREMENT", [d.id]);
      if (c.kind === "fortune" && !FORTUNE_TAGS.includes(c.tag)) fail("INVALID_FORTUNE_TAG", [d.id]);
      if (c.kind === "dynamic" && !DYNAMIC_TAGS.includes(c.tag)) fail("INVALID_DYNAMIC_TAG", [d.id]);
      if (c.kind === "fusion" && !validFusion(c.ruleId)) fail("UNKNOWN_FUSION_ID", [d.id, c.ruleId]);
      if (c.kind === "any" || c.kind === "all") { if (!c.conditions.length) fail("EMPTY_CLAIM_CONDITION", [d.id]); c.conditions.forEach(check); }
    }
    d.requiredAxes.forEach(requirement => check({ kind: "axis", requirement })); d.requiredConditions.forEach(check);
    for (const id of d.preferredFusionIds) if (!validFusion(id)) fail("UNKNOWN_FUSION_ID", [d.id, id]);
  }
  if (registry.length !== 41 || CLAIM_REGISTRY.some(d => !seen.has(d.id))) fail("INCOMPLETE_CLAIM_REGISTRY", []);
  return stableFusionIssues(errors);
}

/** Compare semantic payloads, not object insertion order. No source is edited. */
function stableValue(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableValue).join(",")}]`;
  if (value && typeof value === "object") return `{${Object.entries(value).filter(([, v]) => v !== undefined).sort(([a], [b]) => a < b ? -1 : 1).map(([k, v]) => `${JSON.stringify(k)}:${stableValue(v)}`).join(",")}}`;
  return JSON.stringify(value);
}
export function inspectClaimInputs(m: MyeongliSemanticProfile, b: MbtiSemanticProfile, f: MyeongliMbtiFusionProfile): FusionIssue[] {
  const errors = [...inspectFusionInputs(m, b), ...inspectFusionMyeongliSource(m)];
  if (f.diagnostics.hardErrors.length) errors.push({ code: "INVALID_FUSION_PROFILE", refs: [] });
  for (const [family, state] of Object.entries(m.foundation.tenGods.states.families)) if (state && (!state.provenance.length || !state.evidenceIds.length || state.evidenceIds.some(id => {
    const e = m.evidence.find(e => e.id === id);
    return !e || e.sourceType !== "ten_god" || !Object.hasOwn(TEN_GOD_SEMANTICS, e.sourceKey) || TEN_GOD_SEMANTICS[e.sourceKey as keyof typeof TEN_GOD_SEMANTICS].family !== family;
  }))) errors.push({ code: "INVALID_TEN_GOD_FAMILY_PROVENANCE", refs: [family] });
  if (errors.length) return stableFusionIssues(errors);
  const candidates = [...f.reinforce, ...f.tensions, ...f.complements];
  errors.push(...validateFusionCandidates(candidates, m, b));
  if (errors.length) return stableFusionIssues(errors);
  // Reuse the existing deterministic producer to reject stale/forged strength,
  // contexts, proofs and splits. This is not a new fusion calculation rule.
  const canonical = buildMyeongliMbtiFusion(m, b);
  if (!canonical.ok) return stableFusionIssues([...errors, ...canonical.diagnostics.hardErrors]);
  const known = new Map([...canonical.value.reinforce, ...canonical.value.tensions, ...canonical.value.complements].map(c => [c.id, c]));
  for (const c of candidates) {
    if (!known.has(c.id)) errors.push({ code: "UNKNOWN_FUSION_ID", refs: [c.id] });
    else if (stableValue(c) !== stableValue(known.get(c.id))) errors.push({ code: "STALE_OR_FORGED_FUSION", refs: [c.id] });
  }
  return stableFusionIssues(errors);
}

export function validateClaimCandidates(candidates: readonly ClaimCandidate[], m: MyeongliSemanticProfile, b: MbtiSemanticProfile, f: MyeongliMbtiFusionProfile): FusionIssue[] {
  const errors: FusionIssue[] = [], seen = new Set<string>(), view = buildClaimEvidenceView(m, b, f);
  const nodes = new Set(view.mbtiSourceNodeIds), atoms = new Set(view.myeongliEvidenceIds), fusion = new Set(view.fusionCandidates.map(c => c.id));
  for (const c of candidates) {
    const fail = (code: string) => errors.push({ code, refs: [c.id] });
    if (seen.has(c.id)) fail("DUPLICATE_CLAIM_ID"); seen.add(c.id);
    const d = CLAIM_REGISTRY.find(d => d.id === c.id);
    if (!d) { fail("UNKNOWN_CLAIM_ID"); continue; }
    if (c.fortuneClaim !== d.fortuneClaim) fail("FORTUNE_FLAG_MISMATCH");
    if (c.level === 4 && !(LEVEL4_CLAIM_IDS as readonly string[]).includes(c.id)) fail("UNAUTHORIZED_LEVEL4");
    if (c.evidence.myeongliEvidenceIds.some(id => !atoms.has(id))) fail("MISSING_MYEONGLI_EVIDENCE");
    if (c.evidence.mbtiSourceNodeIds.some(id => !nodes.has(id))) fail("NON_SCORING_MBTI_SOURCE");
    if (c.evidence.fusionCandidateIds.some(id => !fusion.has(id))) fail("UNKNOWN_FUSION_ID");
    for (const ids of Object.values(c.evidence)) if (ids.length !== unique(ids).length) fail("UNDERLYING_EVIDENCE_DOUBLE_COUNT");
    const expected = evaluateClaim(d, view, m).candidate;
    if (!expected) fail(c.fortuneClaim ? "FORTUNE_WITHOUT_MYEONGLI_GATE" : "UNSUPPORTED_CLAIM");
    else {
      if (c.level !== expected.level || c.maxAllowedLevel !== expected.maxAllowedLevel || c.confidenceBand !== expected.confidenceBand) fail("INVALID_CLAIM_PROMOTION");
      if (c.customerClaim !== expected.customerClaim) fail("INVALID_COPY_LEVEL_MAPPING");
      if (c.category !== expected.category || c.semanticTheme !== expected.semanticTheme || c.factBomb !== expected.factBomb || stableValue(c.contexts) !== stableValue(expected.contexts) ||
        stableValue(c.rankingSupport) !== stableValue(expected.rankingSupport)) fail("INVALID_CLAIM_METADATA");
      if (stableValue(c.evidence) !== stableValue(expected.evidence) || c.evidenceDiversity !== expected.evidenceDiversity) fail("EVIDENCE_ATTRIBUTION_MISMATCH");
      if (c.fortuneClaim && !c.diagnostics.primaryMyeongliGatePassed) fail("FORTUNE_WITHOUT_MYEONGLI_GATE");
    }
    if (CLAIM_FORBIDDEN_LANGUAGE.test(c.customerClaim)) fail("FORBIDDEN_CLAIM_LANGUAGE");
  }
  return stableFusionIssues(errors);
}
