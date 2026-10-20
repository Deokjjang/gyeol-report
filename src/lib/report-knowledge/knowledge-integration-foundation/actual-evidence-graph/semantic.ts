import { GENERAL_MBTI_DOMAINS, MBTI_SEMANTIC_ANNOTATION_VERSION } from "../../../interpretation-v4/mbtiSemanticCore";
import { INTEGRATED_FOUNDATION_VERSION } from "../../../interpretation-v4/foundationIntegratedProfile";
import { GYEOL_FUSION_ENGINE_VERSION } from "../../../interpretation-v4/fusionCore";
import { SEMANTIC_AXES } from "../../../interpretation-v4/semanticCore";
import { isRecord } from "../normalization";
import type { EvidenceBuilder } from "./builder";
export function adaptSemanticEvidence(b: EvidenceBuilder, slot: "person" | "personA" | "personB") {
  const profiles = b.input.profiles[slot], owner = b.owner(slot), e = b.input.evidence;
  if (!profiles) { b.requirement(owner, "MISSING_PRODUCER_OUTPUT", `/profiles/${slot}`); return; }
  const { myeongli: m, mbti: mb, fusion: f } = profiles;
  if (m.version !== INTEGRATED_FOUNDATION_VERSION || mb.version !== MBTI_SEMANTIC_ANNOTATION_VERSION || f.version !== GYEOL_FUSION_ENGINE_VERSION) { b.requirement(owner, "UNSUPPORTED_PRODUCER", `/profiles/${slot}/producerVersion`, true); return; }
  const p = b.producer("interpretation-v4/foundationIntegratedProfile", "buildIntegratedMyeongliProfile", m.version, "semantic");
  const pillarIds = [...b.anchors.entries()].filter(([k]) => k.startsWith(`${slot}:`) && /:(stem|branch)$/.test(k)).map(([, id]) => id);
  for (const [i, a] of m.evidence.entries()) {
    const meta = a.metadata ?? {}, parents: string[] = [];
    if (typeof meta.pillar === "string" && typeof meta.slot === "string") {
      const parent = b.anchors.get(`${slot}:${meta.pillar}:${meta.slot}`); if (parent) parents.push(parent);
    }
    if (typeof meta.canonicalAtomId === "string") { const parent = b.anchors.get(`${slot}:atom:${meta.canonicalAtomId}`); if (parent) parents.push(parent); }
    if (Array.isArray(meta.canonicalIds)) for (const id of meta.canonicalIds) if (typeof id === "string") { const parent = b.anchors.get(`${slot}:original:${id}`) ?? b.anchors.get(`${slot}:feature:${id}`); if (parent) parents.push(parent); }
    if (["yin_yang", "element"].includes(a.sourceType)) parents.push(...pillarIds);
    const n = b.node("SEMANTIC_DERIVATION", owner, p, a.id, `/profiles/${slot}/myeongli/evidence/${i}`, { sourceType: a.sourceType, sourceKey: a.sourceKey, axes: a.axes, weight: a.weight, tier: a.tier, contexts: a.contexts, family: a.family, dynamicTags: a.dynamicTags ?? [], fortuneTags: a.fortuneTags ?? {}, scope: "natal", actualCalculatedFact: false }, { parents });
    if (["heavenly_stem", "earthly_branch"].includes(a.sourceType) && typeof meta.pillar === "string" && typeof meta.slot === "string") {
      const actual = b.input.evidence.calculations[slot].pillars[meta.pillar as "year" | "month" | "day" | "hour"];
      if (!actual || actual[meta.slot as "stem" | "branch"] !== a.sourceKey) b.index.block(n, "WRONG_OWNER", [a.id]);
    }
    if (!parents.length) b.index.block(n, "SOURCE_REFERENCE_UNRESOLVED", Array.isArray(meta.provenance) ? meta.provenance.filter((s): s is string => typeof s === "string") : [a.id]);
  }
  for (const axis of SEMANTIC_AXES) {
    const n = b.node("SEMANTIC_DERIVATION", owner, p, null, `/profiles/${slot}/myeongli/axes/${axis}`, { axis, score: m.axes[axis], rawScore: m.rawAxes[axis], normalizedScore: m.normalizedAxes[axis], actualCalculatedFact: false });
    b.reference(n, owner.fixtureOwnerId, (m.contributions[axis] ?? []).map(v => v.evidenceId));
  }
  const person = e.input.kind === "compatibility" ? e.input[slot as "personA" | "personB"] : e.input.person;
  if (mb.mbtiType !== (person.mbtiType || null)) { b.requirement(owner, "WRONG_OWNER", `/profiles/${slot}/mbti/mbtiType`); return; }
  const mp = b.producer("interpretation-v4/mbtiSemanticProfile", "buildMbtiSemanticProfile", mb.version, "mbti");
  if (!mb.available || !mb.mbtiType) { b.requirement(owner, "UNKNOWN_MBTI", `/input/${slot}/mbtiType`); }
  else {
    const type = b.node("MBTI_INPUT_TYPE", owner, mp, null, `/input/${slot}/mbtiType`, { type: mb.mbtiType, selfReported: true, empiricallyValidatedPersonality: false }, { root: true });
    for (const [i, s] of mb.sourceNodes.entries()) {
      const source = b.knowledge.source(`docs/product/mbti/source/${mb.mbtiType}.json`, s.sourcePath, s.value);
      source.originalClassification = s.classification; source.sourceCoverage = s.sourceCoverage;
      b.node("MBTI_SOURCE_NODE", owner, mp, s.id, `/profiles/${slot}/mbti/sourceNodes/${i}`, { type: s.mbtiType, sourceDomain: s.sourceDomain, classification: s.classification, sourceCoverage: s.sourceCoverage ?? "UNKNOWN", value: s.value, sourcePath: s.sourcePath, empiricallyValidatedPersonality: false }, { root: true, parents: [type.id], sources: [source] });
    }
    for (const a of mb.dimensionPriors) b.node("SOURCE_DECLARATION", owner, mp, a.sourceNodeId, `/profiles/${slot}/mbti/dimensionPriors/${a.id}`, { axes: a.axes, weightClass: a.weightClass, dimensionPrior: true, observedBehavior: false }, { parents: [type.id] });
    for (const [i, a] of mb.annotations.entries()) {
      const n = b.node("SEMANTIC_DERIVATION", owner, mp, a.id, `/profiles/${slot}/mbti/annotations/${i}`, { sourceNodeId: a.sourceNodeId, sourceDomain: a.sourceDomain, sourceType: a.sourceType, axes: a.axes, contexts: a.contexts, weightClass: a.weightClass, annotationConfidence: a.annotationConfidence });
      b.reference(n, owner.fixtureOwnerId, [a.sourceNodeId]);
    }
    const contributions: { nodeId: string; contribution: typeof mb.contributions[number] }[] = [];
    for (const [i, c] of mb.contributions.entries()) {
      const n = b.node("SEMANTIC_DERIVATION", owner, mp, null, `/profiles/${slot}/mbti/contributions/${i}`, { ...c, independentFact: false });
      b.reference(n, owner.fixtureOwnerId, [c.sourceNodeId]);
      const original = mb.sourceNodes.find(s => s.id === c.sourceNodeId);
      if (c.sourceType !== "dimension_prior" && original?.classification !== "SCORING_SEMANTIC") b.index.block(n, "SOURCE_DECLARATION_NOT_EVIDENCE", [c.sourceNodeId]);
      contributions.push({ nodeId: n.id, contribution: c });
    }
    for (const axis of SEMANTIC_AXES) {
      const relevant = contributions.filter(c => c.contribution.axis === axis && (c.contribution.sourceType === "dimension_prior" || GENERAL_MBTI_DOMAINS.includes(c.contribution.sourceDomain)));
      b.node("SEMANTIC_DERIVATION", owner, mp, null, `/profiles/${slot}/mbti/generalAxes/${axis}`, { axis, score: mb.generalAxes[axis], sourceScore: mb.sourceAxes[axis], priorScore: mb.priorAxes[axis], observedBehavior: false }, { parents: relevant.map(c => c.nodeId) });
    }
    for (const [context, axes] of Object.entries(mb.contextAxes)) for (const axis of SEMANTIC_AXES) b.node("SEMANTIC_DERIVATION", owner, mp, null, `/profiles/${slot}/mbti/contextAxes/${context}/${axis}`, { axis, context, score: axes?.[axis], observedBehavior: false }, { parents: contributions.filter(c => c.contribution.axis === axis && c.contribution.sourceType !== "dimension_prior" && c.contribution.contexts.includes(context as typeof c.contribution.contexts[number])).map(c => c.nodeId) });
  }
  const fp = b.producer("interpretation-v4/fusionSemanticProfile", "buildMyeongliMbtiFusion", `${f.version}/${f.registryVersion}`, "semantic-fusion");
  const candidates = new Map([...f.reinforce, ...f.tensions, ...f.complements].map(c => [c.id, c]));
  for (const c of candidates.values()) {
    const n = b.node("FUSION_DERIVATION", owner, fp, c.id, `/profiles/${slot}/fusion/${c.id}`, { type: c.type, ruleId: c.ruleId ?? "UNKNOWN", axes: c.primaryAxes, contexts: c.contexts, primaryContext: c.primaryContext, rankingScore: c.rankingScore, rankingFactors: c.rankingFactors, conditionSplit: c.conditionSplit ?? null, metadata: c.metadata, independentFactsAdded: 0 });
    const mids = c.myeongli.evidenceIds, bids = c.mbti.actualSourceEvidenceIds;
    b.reference(n, owner.fixtureOwnerId, [...mids, ...bids], "MISSING_FUSION_ROOT");
    if (!mids.length || !bids.length) b.index.block(n, "MISSING_FUSION_ROOT", [c.id]);
  }
  // No existing per-person Facet observation producer is exposed by these profiles.
  b.requirement(owner, "UNSUPPORTED_PRODUCER", `/profiles/${slot}/actualFacetObservations`, true, ["109 facet definitions are declarations, not 109 observed facts"]);
  b.requirement(owner, "MISSING_PRODUCER_OUTPUT", `/profiles/${slot}/personalResonance`, true, ["Persisted V4 packet does not expose the complete resonance source graph; no new claims are generated here"]);
}
export function applyActualDomainPolicy(b: EvidenceBuilder) {
  const c = b.input.evidence.composition;
  if (c.product !== "saju_mbti_compatibility") return;
  const category = c.result.evidence.category;
  const rules = b.knowledge.input.policyRules.filter(r => r.relationship === category);
  for (const n of b.index.nodes.values()) {
    if (!["SEMANTIC_DERIVATION", "FUSION_DERIVATION", "EDITORIAL_PROOF_OBSERVATION"].includes(n.kind)) continue;
    for (const rule of rules) {
      const bad = n.ancestry.domains.filter(d => rule.prohibitedDomains.includes(d));
      if (bad.length) { b.index.block(n, "DISALLOWED_ANCESTOR_DOMAIN", [rule.id, rule.originalId, ...bad]); b.index.link(n.id, rule.id, "HAS_BLOCKING_POLICY", false); }
    }
    if (isRecord(n.value) && n.value.sourceDomain === "RELATIONSHIP_PAIR") b.index.block(n, "SOURCE_DECLARATION_NOT_EVIDENCE");
  }
}
