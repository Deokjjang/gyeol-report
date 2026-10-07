import type { MyeongliSemanticProfile } from "./foundationIntegratedProfile";
import type { MbtiSemanticProfile } from "./mbtiSemanticProfile";
import { fusionOrder, fusionUnique as unique, type MyeongliMbtiFusionProfile } from "./fusionCore";
import { stableFusionIssues } from "./fusionDiagnostics";
import { GYEOL_CLAIM_ENGINE_VERSION, CLAIM_REGISTRY_VERSION, type ClaimCandidate, type ClaimProfile, type ClaimResult } from "./claimCore";
import { CLAIM_REGISTRY } from "./claimRegistry";
import { buildClaimEvidenceView } from "./claimEvidence";
import { evaluateClaim } from "./claimEvaluator";
import { emptyClaimDiagnostics, inspectClaimInputs, inspectClaimRegistry, validateClaimCandidates } from "./claimDiagnostics";

const orderClaims = (a: ClaimCandidate, b: ClaimCandidate) => b.level - a.level || b.priority - a.priority ||
  Number(b.rankingSupport.preferredFusionMain) - Number(a.rankingSupport.preferredFusionMain) ||
  Number(b.rankingSupport.validFusionMain) - Number(a.rankingSupport.validFusionMain) ||
  Number(b.rankingSupport.actualMbtiMain) - Number(a.rankingSupport.actualMbtiMain) || b.evidenceDiversity - a.evidenceDiversity || fusionOrder(a.id, b.id);
const overlap = (a: readonly string[], b: readonly string[]) => { const union = new Set([...a, ...b]); return union.size ? new Set(a.filter(id => b.includes(id))).size / union.size : 0; };

/** All eligible candidates survive. Final selection belongs to a later scheduler. */
export function buildClaimProfile(m: MyeongliSemanticProfile, b: MbtiSemanticProfile, f: MyeongliMbtiFusionProfile): ClaimResult {
  const diagnostics = emptyClaimDiagnostics();
  diagnostics.hardErrors = stableFusionIssues([...inspectClaimRegistry(CLAIM_REGISTRY), ...inspectClaimInputs(m, b, f)]);
  if (diagnostics.hardErrors.length) return { ok: false, diagnostics };
  const view = buildClaimEvidenceView(m, b, f), evaluated = CLAIM_REGISTRY.map(d => evaluateClaim(d, view, m));
  const candidates = evaluated.flatMap(r => r.candidate ? [r.candidate] : []).sort(orderClaims);
  const suppressed = evaluated.flatMap(r => r.suppressed).sort((a, b) => fusionOrder(`${a.id}:${a.context}`, `${b.id}:${b.context}`));
  for (const a of candidates) for (const other of candidates.filter(c => c.id !== a.id)) {
    const score = overlap(a.evidence.myeongliEvidenceIds, other.evidence.myeongliEvidenceIds);
    a.overlapScore = Math.max(a.overlapScore, score);
    const wealthHonor = [a.id, other.id].includes("S08_MONEY_AND_HONOR") && [a.id, other.id].some(id => ["M08_GOOD_WEALTH_PATTERN", "S04_HONOR_FORTUNE"].includes(id));
    if (a.exclusivityGroup === other.exclusivityGroup || wealthHonor) a.relatedClaimIds.push(other.id);
    if (wealthHonor && other.id === "S08_MONEY_AND_HONOR" && other.level === 4) a.diagnostics.warnings.push("STRONGER_COMPOSITE_CLAIM_AVAILABLE");
  }
  for (const c of candidates) { c.relatedClaimIds = unique(c.relatedClaimIds); c.diagnostics.warnings = unique(c.diagnostics.warnings); }
  const fast = candidates.find(c => c.id === "F06_TOO_FAST");
  if (fast) {
    // A planning counterweight is a relation, not additional speed evidence.
    fast.relatedFusionIds = unique([...fast.relatedFusionIds, ...view.fusionCandidates.filter(f => ["C020", "C021"].includes(f.ruleId ?? "") &&
      f.strength !== "SUPPORT" && !f.priorHeavy && f.contexts.some(context => fast.contexts.includes(context))).map(f => f.id)]);
    fast.relatedClaimIds = unique([...fast.relatedClaimIds, ...candidates.filter(c => ["F03_PERFECTIONISM", "SU04_EXPERTISE"].includes(c.id)).map(c => c.id)]);
  }
  for (const id of unique(candidates.map(c => c.exclusivityGroup))) diagnostics.exclusivityGroups.push({ id, claimIds: candidates.filter(c => c.exclusivityGroup === id).map(c => c.id) });
  for (const [id, claims, split] of [
    ["DECISION_TIMING", ["F05_OVERTHINKING", "F06_TOO_FAST"], "BEFORE_AFTER_DECISION"],
    ["STABILITY_AND_OPPORTUNITY", ["M05_STABLE_INCOME", "M04_BUSINESS_TRANSACTION_STYLE"], "START_MAINTAIN"],
  ] as const) {
    const members = candidates.filter(c => (claims as readonly string[]).includes(c.id));
    if (members.length !== 2) continue;
    const fusionIds = unique(view.fusionCandidates.filter(c => c.conditionSplit?.resolved && c.conditionSplit.type === split &&
      members.some(m => m.contexts.some(context => c.contexts.includes(context)))).map(c => c.id));
    diagnostics.conflictGroups.push({ id, claimIds: members.map(c => c.id), fusionIds });
    for (const c of members) { c.conflictGroupId = id; c.relatedClaimIds = unique([...c.relatedClaimIds, ...members.filter(m => m.id !== c.id).map(m => m.id)]);
      c.relatedFusionIds = unique([...c.relatedFusionIds, ...fusionIds]); c.diagnostics.warnings.push("VALID_CONFLICTING_DESIRES_PRESERVED"); }
  }
  diagnostics.generatedCount = candidates.length;
  diagnostics.levelCounts[0] = CLAIM_REGISTRY.length - candidates.length;
  for (const c of candidates) diagnostics.levelCounts[c.level]++;
  diagnostics.fortuneCount = candidates.filter(c => c.fortuneClaim).length; diagnostics.factBombCount = candidates.filter(c => c.factBomb).length;
  const suppressedIds = (reason: string) => unique(suppressed.filter(c => c.reasons.includes(reason) && !candidates.some(v => v.id === c.id)).map(c => c.id));
  diagnostics.suppressedInsufficientEvidence = unique([...suppressedIds("INSUFFICIENT_EVIDENCE"), ...suppressedIds("INSUFFICIENT_LEVEL")]);
  diagnostics.suppressedAmplifierOnly = suppressedIds("AMPLIFIER_ONLY"); diagnostics.suppressedMissingMyeongliGate = suppressedIds("MISSING_MYEONGLI_GATE");
  diagnostics.suppressedContradiction = candidates.filter(c => c.diagnostics.warnings.includes("UNRESOLVED_CONTRADICTION_LEVEL4_BLOCKED")).map(c => c.id);
  diagnostics.warnings = stableFusionIssues([
    ...(!b.available ? [{ code: "MBTI_UNAVAILABLE", refs: [] }] : []), ...(!view.fusionCandidates.length ? [{ code: "FUSION_UNAVAILABLE", refs: [] }] : []),
    ...candidates.flatMap(c => c.diagnostics.warnings.map(code => ({ code, refs: [c.id] }))),
  ]);
  diagnostics.hardErrors = validateClaimCandidates(candidates, m, b, f);
  if (diagnostics.hardErrors.length) return { ok: false, diagnostics };
  const byCategory: ClaimProfile["debug"]["byCategory"] = {};
  for (const c of candidates) (byCategory[c.category] ??= []).push(c.id);
  return { ok: true, value: { version: GYEOL_CLAIM_ENGINE_VERSION, registryVersion: CLAIM_REGISTRY_VERSION, candidates, diagnostics,
    debug: { topClaims: structuredClone(candidates.slice(0, 12)), byCategory, level4: candidates.filter(c => c.level === 4).map(c => c.id),
      fortune: candidates.filter(c => c.fortuneClaim).map(c => c.id), factBomb: candidates.filter(c => c.factBomb).map(c => c.id),
      suppressed, conflicts: structuredClone(diagnostics.conflictGroups), exclusivity: structuredClone(diagnostics.exclusivityGroups), evidenceSummary: view, diagnostics: structuredClone(diagnostics) } } };
}
