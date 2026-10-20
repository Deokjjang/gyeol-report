import { canonicalJson } from "../sourceReader";
import { isRecord } from "../normalization";
import type { ActualBindingIndex } from "../knowledge-binder/matching";
import type { ActualEvidenceNode } from "../actual-evidence-graph/types";

// Identity-only adapter. No relationship meaning, score, or selection policy.
export const SUPPORTED_CROSS_RELATIONS = ["six_harmony", "three_harmony", "half_harmony", "clash", "harm"] as const;
export function pairWitnessErrors(index: ActualBindingIndex, node: ActualEvidenceNode): string[] {
  const e = index.request.graphInput.evidence, c = e.composition;
  if (e.input.kind !== "compatibility" || c.product !== "saju_mbti_compatibility" || !("personA" in e.calculations)) return ["ACTUAL_PAIR_INPUT_REQUIRED"];
  const errors: string[] = [], a = index.owner("A"), b = index.owner("B");
  if (!a || !b || a === b) errors.push("DISTINCT_ACTUAL_OWNERS_REQUIRED");
  if (node.status !== "VERIFIED" || !node.ancestry.complete || index.ancestors(node).some(n => n.status === "WITHHELD" || !n.ancestry.complete || n.sources.some(s => s.state !== "VERIFIED"))) errors.push("COMPLETE_VERIFIED_ANCESTRY_REQUIRED");
  if (node.kind === "CANONICAL_PAIR_FACT") {
    const original = c.result.evidence.relations.find(r => r.identity === node.fact.producerEvidenceId);
    if (!original || !isRecord(node.value) || !SUPPORTED_CROSS_RELATIONS.includes(node.value.kind as typeof SUPPORTED_CROSS_RELATIONS[number]) || node.value.kind !== original.kind || canonicalJson(node.value.branches) !== canonicalJson(original.branches)) errors.push("ORIGINAL_SUPPORTED_RELATION_REQUIRED");
    const expected = original?.refs.map(r => ({ owner: index.request.graph.context.owners[r.person], position: r.position, slot: "branch", value: r.branch })) ?? [];
    if (canonicalJson(expected) !== canonicalJson(node.participants) || new Set(node.participants.map(p => p.owner)).size !== 2 || node.owner.fixtureOwnerId !== index.owner("PAIR")) errors.push("EXACT_PAIR_PARTICIPANTS_REQUIRED");
    for (const p of node.participants) {
      const slot = p.owner === a ? "personA" : p.owner === b ? "personB" : null;
      if (!slot || !Object.entries(e.calculations[slot].pillars).some(([position, pillar]) => position === p.position && pillar?.branch === p.value)) errors.push("CALCULATED_POSITION_BRANCH_REQUIRED");
    }
  } else if (node.kind === "DIRECTIONAL_RELATION_FACT") {
    const direction = node.direction, original = Object.values(c.result.evidence.directions).find(d => d.relationId === node.fact.producerEvidenceId);
    const subject = direction?.subject === a ? "personA" : direction?.subject === b ? "personB" : null, recipient = direction?.recipient === a ? "personA" : direction?.recipient === b ? "personB" : null;
    if (!direction || !original || !subject || !recipient || subject === recipient || node.owner.fixtureOwnerId !== direction.subject || direction.relationId !== node.fact.producerEvidenceId || original.subjectPerson !== c.result.evidence.persons[subject].personId || original.targetPerson !== c.result.evidence.persons[recipient].personId || direction.subjectDayMaster !== e.calculations[subject].dayMaster || direction.recipientDayMaster !== e.calculations[recipient].dayMaster || !isRecord(node.value) || canonicalJson(node.value.receivedTenGod) !== canonicalJson(original.receivedTenGod) || original.receivedTenGod?.viewerDayStem !== direction.recipientDayMaster || original.receivedTenGod?.targetDayStem !== direction.subjectDayMaster) errors.push("EXACT_RECIPIENT_DIRECTION_REQUIRED");
  } else if (["CALCULATED_NATAL_FACT", "MBTI_SOURCE_NODE", "SEMANTIC_DERIVATION", "FUSION_DERIVATION"].includes(node.kind)) {
    if (![a, b].includes(node.owner.fixtureOwnerId)) errors.push("ACTUAL_PERSON_OWNER_REQUIRED");
    if (node.kind === "FUSION_DERIVATION") {
      const slot = node.owner.fixtureOwnerId === a ? "personA" : "personB", profile = index.request.graphInput.profiles[slot];
      const original = profile ? [...profile.fusion.reinforce, ...profile.fusion.complements, ...profile.fusion.tensions].find(f => f.id === node.fact.producerEvidenceId) : null;
      if (!original || !isRecord(node.value) || node.value.ruleId !== (original.ruleId ?? "UNKNOWN") || canonicalJson(node.value.axes) !== canonicalJson(original.primaryAxes) || canonicalJson(node.value.contexts) !== canonicalJson(original.contexts)) errors.push("ORIGINAL_OWN_FUSION_PROFILE_REQUIRED");
      const ancestors = index.ancestors(node), own = ancestors.filter(n => n.owner.fixtureOwnerId === node.owner.fixtureOwnerId);
      if (!own.some(n => n.kind === "CALCULATED_NATAL_FACT") || !own.some(n => n.kind === "MBTI_SOURCE_NODE" && isRecord(n.value) && n.value.classification === "SCORING_SEMANTIC")) errors.push("MISSING_FUSION_ROOT");
      if (ancestors.some(n => ["CALCULATED_NATAL_FACT", "MBTI_SOURCE_NODE", "SEMANTIC_DERIVATION"].includes(n.kind) && n.owner.fixtureOwnerId !== node.owner.fixtureOwnerId)) errors.push("CROSS_OWNER_FUSION_FORBIDDEN");
      if (!isRecord(node.value) || !node.value.ruleId || node.value.ruleId === "UNKNOWN") errors.push("MISSING_RULE_ID");
    }
  }
  return [...new Set(errors)].sort();
}
export function observePairWitnesses(index: ActualBindingIndex) {
  return [...index.graph.nodes.values()].filter(n => ["CANONICAL_PAIR_FACT", "DIRECTIONAL_RELATION_FACT", "FUSION_DERIVATION"].includes(n.kind)).map(n => ({ nodeId: n.id, kind: n.kind, owner: n.owner.fixtureOwnerId, originalEvidenceId: n.fact.producerEvidenceId, pointer: n.fact.observationPointer, participants: n.participants, direction: n.direction, value: n.value, roots: n.ancestry.rootIds, sources: n.sources, errors: pairWitnessErrors(index, n) }));
}
