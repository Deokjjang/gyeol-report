import "server-only";
import { buildIntegratedMyeongliProfile } from "./foundationIntegratedProfile";
import { buildMbtiSemanticProfile } from "./mbtiSemanticProfile";
import { buildMyeongliMbtiFusion } from "./fusionSemanticProfile";
import { buildClaimProfile } from "./claimProfile";
import { buildPersonalResonanceProfile } from "./personalResonanceProfile";
import { buildContextualGuidanceProfile } from "./guidanceProfile";
import { collectComprehensiveCandidates } from "./comprehensiveCandidateAdapter";
import { adaptMyeongliFusionSide, adaptMbtiFusionSide } from "./fusionProfileAdapter";
import type { ComprehensivePlanInputs, EditorialCandidate } from "./comprehensivePlanCore";
import type { NarrativeInput } from "./narrativeTypes";
import type { InterpretationContext, SemanticAxis } from "./semanticCore";
import type { MbtiSourceDomain } from "./mbtiSemanticCore";

export const RELATIONSHIP_DOMAINS: readonly MbtiSourceDomain[] = ["LOVE", "MARRIAGE", "RELATIONSHIPS", "COMMUNICATION", "IDENTITY", "STRENGTHS", "RISKS", "GROWTH"];
export const RELATIONSHIP_AXES: readonly SemanticAxis[] = ["RELATION_STYLE", "CARE", "EXPRESSION", "SOCIAL_ATTUNEMENT", "COMMUNICATION_STYLE", "AUTONOMY", "BOUNDARY", "RECOVERY_NEED", "STABILITY", "MEANING", "DUTY", "CHARISMA"];
export type RelationshipProfiles = ComprehensivePlanInputs;
export type RelationshipPlacement = { question: string; context: InterpretationContext; candidate: EditorialCandidate };

/** Build each frozen individual core once. Relationship status belongs only to
 * contextual guidance, never to axes, claims, resonance or individual Fusion. */
export function buildRelationshipProfiles(input: NarrativeInput) {
  const m = buildIntegratedMyeongliProfile(input.calculation);
  const b = buildMbtiSemanticProfile(input.mbti || null);
  if (!m.ok || !b.ok) return { ok: false as const, errors: ["RELATIONSHIP_SOURCE_INVALID"] };
  const f = buildMyeongliMbtiFusion(m.value, b.value);
  if (!f.ok) return { ok: false as const, errors: ["RELATIONSHIP_FUSION_INVALID"] };
  const c = buildClaimProfile(m.value, b.value, f.value);
  if (!c.ok) return { ok: false as const, errors: ["RELATIONSHIP_CLAIM_INVALID"] };
  const r = buildPersonalResonanceProfile(m.value, b.value, f.value, c.value);
  if (!r.ok) return { ok: false as const, errors: ["RELATIONSHIP_RESONANCE_INVALID"] };
  const shared = { myeongli: m.value, mbti: b.value, fusion: f.value, claims: c.value, resonance: r.value };
  const g = buildContextualGuidanceProfile(shared, input.context);
  if (!g.ok) return { ok: false as const, errors: ["RELATIONSHIP_CONTEXT_INVALID"] };
  return { ok: true as const, profiles: { ...shared, guidance: g.value } };
}

/** Read-only product projection. No weights, annotations, thresholds or new
 * semantics. Pair references and parent/child traits cannot license a person. */
export function projectRelationshipView(profiles: RelationshipProfiles, romantic = true) {
  const domains = romantic ? RELATIONSHIP_DOMAINS : RELATIONSHIP_DOMAINS.filter(d => d !== "LOVE" && d !== "MARRIAGE");
  const nodes = profiles.mbti.sourceNodes.filter(n => n.classification === "SCORING_SEMANTIC" && n.sourceDomain && domains.includes(n.sourceDomain));
  const ids = new Set(nodes.map(n => n.id));
  const contexts: InterpretationContext[] = romantic ? ["love", "social", "recovery"] : ["social", "recovery"];
  const candidates = collectComprehensiveCandidates(profiles).filter(c => c.primaryEligible && !c.invalidReasons.length && c.sourceType !== "CORE_GYEOL"
    && c.contexts.some(x => contexts.includes(x)) && (c.primaryAxes.some(a => RELATIONSHIP_AXES.includes(a)) || c.fortune)
    && (!c.mbtiSourceNodeIds.length || c.mbtiSourceNodeIds.some(id => ids.has(id)))
    && (!c.fortune || c.sourceType === "CLAIM" && /^(A0[1-5]|P0[1-3])_/.test(c.sourceId)));
  const sides = [...adaptMyeongliFusionSide(profiles.myeongli), ...adaptMbtiFusionSide(profiles.mbti).sides]
    .filter(s => contexts.includes(s.scope as InterpretationContext) && RELATIONSHIP_AXES.includes(s.axis)
      && !s.amplifierOnly && s.band !== "NONE" && (s.system === "myeongli" || s.exactEvidenceIds.some(id => ids.has(id))));
  return { profiles, domains, nodes, candidates, sides };
}
export type RelationshipView = ReturnType<typeof projectRelationshipView>;

/** Question allocation only. Existing ranks and domain priority are compared
 * lexically; this is not an additional personality or compatibility score. */
export function selectLoveProductSources(view: RelationshipView) {
  const selected: RelationshipPlacement[] = [], used = new Set<string>(), themes = new Set<string>();
  const positive = (c: EditorialCandidate) => !c.factBomb && !c.fortune && c.sourceType !== "GUIDANCE";
  const priority = (c: EditorialCandidate) => c.mbtiSourceNodeIds.reduce((best, id) => {
    const domain = view.nodes.find(n => n.id === id)?.sourceDomain;
    return domain ? Math.min(best, view.domains.indexOf(domain)) : best;
  }, view.domains.length);
  const sorted = [...view.candidates].sort((a, b) => priority(a) - priority(b) || Number(b.rank === "SIGNATURE") - Number(a.rank === "SIGNATURE")
    || b.confidence - a.confidence || a.id.localeCompare(b.id));
  function take(question: string, count: number, predicate: (c: EditorialCandidate) => boolean) {
    for (const c of sorted.filter(c => !used.has(c.id) && predicate(c))) {
      const theme = c.duplicateGroupId ?? c.semanticOverlapGroup ?? c.semanticTheme;
      if (themes.has(theme)) continue;
      selected.push({ question, context: c.contexts.includes("love") ? "love" : c.contexts.includes("social") ? "social" : "recovery", candidate: c });
      used.add(c.id); themes.add(theme);
      if (selected.filter(p => p.question === question).length >= count) break;
    }
  }
  take("L1", 1, c => positive(c) && c.sourceType === "PERSONAL_RESONANCE");
  take("L1", 2, c => positive(c) && !!c.fusionType);
  if (!selected.some(p => p.question === "L1")) take("L1", 1, positive);
  take("L3", 1, c => positive(c) && c.primaryAxes.some(a => ["CARE", "EXPRESSION", "SOCIAL_ATTUNEMENT"].includes(a)));
  take("L4", 1, c => positive(c) && c.conditionSplit?.type === "STRANGER_CLOSE" && c.conditionSplit.resolved);
  take("L5", 1, c => positive(c) && c.primaryAxes.includes("COMMUNICATION_STYLE"));
  take("L6", 1, c => positive(c) && c.primaryAxes.some(a => ["BOUNDARY", "AUTONOMY", "RECOVERY_NEED", "MEANING"].includes(a)));
  take("L7", 1, c => c.factBomb);
  take("L8", 1, c => positive(c) && c.mbtiSourceNodeIds.some(id => view.nodes.some(n => n.id === id && n.sourceDomain === "MARRIAGE")));
  take("L9", 3, c => c.sourceType === "GUIDANCE" && c.operatingRuleType === "RELATIONSHIP");
  const families = new Set<string>();
  const fortunes = sorted.filter(c => c.fortune).filter(c => {
    if (c.fortuneFamilies.some(f => families.has(f))) return false;
    c.fortuneFamilies.forEach(f => families.add(f)); return true;
  }).slice(0, 3);
  return { selected, fortunes };
}
