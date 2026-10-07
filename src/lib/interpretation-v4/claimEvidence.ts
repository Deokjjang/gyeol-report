import type { MyeongliSemanticProfile } from "./foundationIntegratedProfile";
import type { MbtiSemanticProfile } from "./mbtiSemanticProfile";
import { TEN_GOD_FAMILIES, TEN_GOD_SEMANTICS } from "./foundationTenGods";
import { isMeaningfulEvidence } from "./foundationRanking";
import { adaptMyeongliFusionSide, adaptMbtiFusionSide } from "./fusionProfileAdapter";
import { BAND_ORDER, fusionUnique as unique, fusionOrder, type MyeongliMbtiFusionProfile, type FusionSide } from "./fusionCore";
import type { EvidenceAtom, InterpretationContext, SemanticAxis } from "./semanticCore";
import type { AxisBandRequirement, ClaimCondition, ClaimEvidenceView, ClaimGateResult } from "./claimCore";

export const claimAtomsInContext = (atoms: readonly EvidenceAtom[], context: InterpretationContext) => atoms.filter(e => isMeaningfulEvidence(e) && (e.contexts.includes(context) || e.contexts.includes("identity")));
export const claimAxisSides = (sides: readonly FusionSide[], a: AxisBandRequirement, context: InterpretationContext) => sides.filter(s => s.axis === a.axis && s.direction === a.direction && (s.scope === "general" || s.scope === context));
export const claimBestBand = (sides: readonly FusionSide[]) => sides.reduce((b, s) => BAND_ORDER[s.band] > BAND_ORDER[b] ? s.band : b, "NONE" as FusionSide["band"]);
export const claimConditionAxes = (condition: ClaimCondition): SemanticAxis[] => condition.kind === "axis" ? [condition.requirement.axis] : condition.kind === "any" || condition.kind === "all" ? condition.conditions.flatMap(claimConditionAxes) : [];

/** Uses 1D's verified family/rank and 2B's source bands. No new chart thresholds. */
export function buildClaimEvidenceView(m: MyeongliSemanticProfile, b: MbtiSemanticProfile, f: MyeongliMbtiFusionProfile): ClaimEvidenceView {
  const atoms = m.evidence.filter(isMeaningfulEvidence), my = adaptMyeongliFusionSide(m), mb = adaptMbtiFusionSide(b).sides;
  const tenGodFamilies: ClaimEvidenceView["tenGodFamilies"] = {};
  for (const family of TEN_GOD_FAMILIES) {
    const rows = atoms.filter(e => e.sourceType === "ten_god" && Object.hasOwn(TEN_GOD_SEMANTICS, e.sourceKey) && TEN_GOD_SEMANTICS[e.sourceKey as keyof typeof TEN_GOD_SEMANTICS].family === family);
    if (!rows.length) continue;
    const state = m.foundation.tenGods.states.families[family];
    const ids = rows.map(e => e.id);
    const ranked = m.rankedCandidates.filter(c => c.evidenceIds.length && c.evidenceIds.every(id => ids.includes(id)) && !c.supportOnly);
    const band = state ? ({ HIGH: "STRONG", MEANINGFUL: "MAIN", SUPPORT: "SUPPORT", WEAK: "NONE", UNCERTAIN: "NONE" } as const)[state.state]
      : ranked.some(c => c.rank === "SIGNATURE") ? "STRONG" : ranked.some(c => c.rank === "MAIN") ? "MAIN" : "SUPPORT";
    tenGodFamilies[family] = { band, evidenceIds: unique(state ? state.evidenceIds : ids) };
  }
  const index = <T extends string>(keys: readonly T[], match: (e: EvidenceAtom, key: T) => boolean) => Object.fromEntries(keys.map(key => [key, unique(atoms.filter(e => match(e, key)).map(e => e.id))]));
  return {
    myeongliAxisBands: my, mbtiAxisBands: mb,
    fusionCandidates: structuredClone([...f.reinforce, ...f.tensions, ...f.complements].sort((a, b) => fusionOrder(a.id, b.id))),
    tenGodFamilies, specificTenGodEvidence: index(unique(atoms.filter(e => e.sourceType === "ten_god").map(e => e.sourceKey)), (e, key) => e.sourceType === "ten_god" && e.sourceKey === key),
    fortuneTags: index(unique(atoms.flatMap(e => Object.keys(e.fortuneTags ?? {}))), (e, key) => (e.fortuneTags?.[key as keyof NonNullable<EvidenceAtom["fortuneTags"]>] ?? 0) > 0),
    dynamicTags: index(unique(atoms.flatMap(e => e.dynamicTags ?? [])), (e, key) => e.dynamicTags?.includes(key) === true),
    synthesisIds: unique(m.synthesisCandidates.map(c => c.id)), semanticThemes: unique(m.rankedCandidates.map(c => c.semanticTheme)),
    myeongliEvidenceIds: unique(atoms.map(e => e.id)), mbtiSourceNodeIds: unique(mb.flatMap(s => s.evidenceIds)),
    independentMyeongliFamilies: unique(atoms.map(e => e.family)), mbtiDomainDiversity: unique(mb.flatMap(s => s.domains)), amplifierOnly: atoms.every(e => e.tier === "AMPLIFIER"),
  };
}

export type ClaimGateScope = { view: ClaimEvidenceView; myeongli: MyeongliSemanticProfile; context: InterpretationContext; myeongliOnly: boolean };
const result = (gate: string, passed: boolean, my: string[] = [], mb: string[] = [], fusion: string[] = []): ClaimGateResult => ({ gate, passed, myeongliEvidenceIds: unique(my), mbtiSourceNodeIds: unique(mb), fusionCandidateIds: unique(fusion) });
export function evaluateClaimCondition(c: ClaimCondition, scope: ClaimGateScope): ClaimGateResult {
  const { view: v, myeongli: m, context, myeongliOnly } = scope;
  const atoms = claimAtomsInContext(m.evidence, context), ids = new Set(atoms.map(e => e.id));
  const usable = (refs: readonly string[]) => refs.length > 0 && refs.every(id => ids.has(id));
  if (c.kind === "axis") {
    const my = claimAxisSides(v.myeongliAxisBands, c.requirement, context), mb = myeongliOnly ? [] : claimAxisSides(v.mbtiAxisBands, c.requirement, context);
    const passed = BAND_ORDER[claimBestBand([...my, ...mb])] >= BAND_ORDER[c.requirement.band];
    return result(`axis:${c.requirement.axis}:${c.requirement.direction}:${c.requirement.band}`, passed, my.flatMap(s => s.evidenceIds), mb.flatMap(s => s.evidenceIds));
  }
  if (c.kind === "any" || c.kind === "all") {
    const children = c.conditions.map(condition => evaluateClaimCondition(condition, scope)), passed = c.kind === "any" ? children.some(g => g.passed) : children.every(g => g.passed);
    const selected = children.filter(g => g.passed);
    return result(`${c.kind}(${children.map(g => g.gate).join(",")})`, passed, selected.flatMap(g => g.myeongliEvidenceIds), selected.flatMap(g => g.mbtiSourceNodeIds), selected.flatMap(g => g.fusionCandidateIds));
  }
  if (c.kind === "family") {
    const family = v.tenGodFamilies[c.family];
    // A family rank from evidence in another domain cannot be borrowed here.
    return result(`family:${c.family}:${c.band}`, !!family && BAND_ORDER[family.band] >= BAND_ORDER[c.band] && usable(family.evidenceIds), family?.evidenceIds ?? []);
  }
  if (c.kind === "fortune" || c.kind === "dynamic") {
    const rows = (c.kind === "fortune" ? v.fortuneTags[c.tag] : v.dynamicTags[c.tag])?.filter(id => ids.has(id)) ?? [];
    return result(`${c.kind}:${c.tag}`, rows.length > 0, rows);
  }
  if (c.kind === "source") {
    const rows = atoms.filter(e => e.sourceKey === c.key);
    return result(`source:${c.key}`, rows.length > 0, rows.map(e => e.id));
  }
  if (c.kind === "synthesis") {
    const rows = m.synthesisCandidates.filter(s => s.semanticTheme === c.theme && s.strength !== "SUPPORT" && (s.contexts.includes(context) || s.contexts.includes("identity")) && usable(s.evidenceIds));
    return result(`synthesis:${c.theme}`, rows.length > 0, rows.flatMap(s => s.evidenceIds));
  }
  if (c.kind === "fusion") {
    const rows = v.fusionCandidates.filter(f => f.ruleId === c.ruleId && f.contexts.includes(context) && f.strength !== "SUPPORT" && !f.priorHeavy && !f.amplifierOnly);
    return result(`fusion:${c.ruleId}`, rows.length > 0, rows.flatMap(f => f.myeongli.evidenceIds), rows.flatMap(f => f.mbti.sourceNodeIds), rows.map(f => f.id));
  }
  if (c.kind === "helperCompanion") {
    const helpers = atoms.filter(e => (e.fortuneTags?.HELPER_LUCK ?? 0) > 0);
    const helperFamilies = new Set(helpers.map(e => e.family));
    const independent = atoms.filter(e => !helperFamilies.has(e.family) && ((e.fortuneTags?.RELATION_RESOURCE ?? 0) > 0 || e.family === "HELPER_SOFTENING" ||
      (e.sourceType === "relation" && e.dynamicTags?.some(t => ["COOPERATION", "PAIR_COHESION", "STRONG_COHERENCE", "SHARED_DIRECTION", "COORDINATION"].includes(t)))));
    const care = evaluateClaimCondition({ kind: "any", conditions: [{ kind: "axis", requirement: { axis: "CARE", band: "MAIN", direction: 1 } },
      { kind: "axis", requirement: { axis: "SOCIAL_ATTUNEMENT", band: "MAIN", direction: 1 } }] }, { ...scope, myeongliOnly: true });
    const careIds = care.myeongliEvidenceIds.filter(id => !helperFamilies.has(atoms.find(e => e.id === id)!.family));
    return result("helper:independent-companion", independent.length > 0 || (care.passed && careIds.length > 0), [...independent.map(e => e.id), ...(care.passed ? careIds : [])]);
  }
  // Only this explicit, existing shadow meaning is usable; no keyword inference.
  const shadow = atoms.filter(e => e.sourceType === "ten_god" && e.sourceKey === "偏印" && e.shadowMeaning === TEN_GOD_SEMANTICS.偏印.shadowMeaning);
  const resource = v.tenGodFamilies.RESOURCE;
  const resourceIds = resource && BAND_ORDER[resource.band] >= BAND_ORDER.MAIN && usable(resource.evidenceIds) ? resource.evidenceIds : [];
  const negative = evaluateClaimCondition({ kind: "any", conditions: [{ kind: "axis", requirement: { axis: "ACTION_TEMPO", band: "SUPPORT", direction: -1 } },
    { kind: "axis", requirement: { axis: "DECISION_STYLE", band: "SUPPORT", direction: -1 } }] }, scope);
  const splits = myeongliOnly ? [] : v.fusionCandidates.filter(f => f.contexts.includes(context) && f.type === "TENSION" && f.strength !== "SUPPORT" &&
    f.conditionSplit?.resolved && f.conditionSplit.type === "BEFORE_AFTER_DECISION" && !f.priorHeavy);
  return result("delay:actual-or-resolved-split-or-resource-shadow", negative.passed || splits.length > 0 || shadow.length > 0 || resourceIds.length > 0,
    [...negative.myeongliEvidenceIds, ...splits.flatMap(f => f.myeongli.evidenceIds), ...shadow.map(e => e.id), ...resourceIds],
    [...negative.mbtiSourceNodeIds, ...splits.flatMap(f => f.mbti.sourceNodeIds)], splits.map(f => f.id));
}
