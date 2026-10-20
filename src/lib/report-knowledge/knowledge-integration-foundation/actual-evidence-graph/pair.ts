import { getCrossTenGodRelation } from "../../compatibilityRelationRules";
import type { EvidenceBuilder } from "./builder";
export function adaptPairEvidence(b: EvidenceBuilder) {
  const c = b.input.evidence.composition; if (c.product !== "saju_mbti_compatibility") return;
  const e = c.result.evidence, a = b.owner("personA"), z = b.owner("personB");
  const pairOwner = { slot: "pair" as const, fixtureOwnerId: `fixture-pair:${[a.fixtureOwnerId, z.fixtureOwnerId].sort().join("|")}`, originalPersonId: null };
  const p = b.producer("interpretation-v4/compatibilityEvidence", "compatibilityNarrativeEvidence", e.relationProjection, "pair");
  for (const [i, r] of e.relations.entries()) {
    const participants = r.refs.map(ref => ({ owner: b.owner(ref.person).fixtureOwnerId, position: ref.position, slot: "branch", value: ref.branch }));
    const parents = r.refs.map(ref => b.anchors.get(`${ref.person}:${ref.position}:branch`)!);
    const n = b.node("CANONICAL_PAIR_FACT", pairOwner, p, r.identity, `/composition/result/evidence/relations/${i}`, { kind: r.kind, branches: r.branches, actualCrossPersonDetection: true }, { root: true, independent: true, participants, parents: parents.filter(Boolean) });
    if (new Set(r.refs.map(ref => ref.person)).size !== 2 || parents.some(id => !id) || r.refs.some(ref => b.input.evidence.calculations[ref.person].pillars[ref.position]?.branch !== ref.branch)) b.index.block(n, "MISSING_PARTICIPANT", [r.identity]);
    if (!["six_harmony", "three_harmony", "half_harmony", "clash", "harm"].includes(r.kind)) b.index.block(n, "UNSUPPORTED_PRODUCER", [r.kind]);
  }
  if (!e.relations.length) b.node("CONTEXT_INPUT", pairOwner, p, null, "/composition/result/evidence/relations", { detection: "NO_RELATION_DETECTED", meansBadCompatibility: false });
  for (const [name, subjectSlot, recipientSlot] of [["aToB", "personA", "personB"], ["bToA", "personB", "personA"]] as const) {
    const d = e.directions[name], subject = b.owner(subjectSlot), recipient = b.owner(recipientSlot);
    const subjectStem = b.input.evidence.calculations[subjectSlot].dayMaster, recipientStem = b.input.evidence.calculations[recipientSlot].dayMaster;
    const n = b.node("DIRECTIONAL_RELATION_FACT", subject, b.producer("report-knowledge/compatibilityDirectionEvidence", "buildCompatibilityDirectionEvidence", `source-sha256:${b.knowledge.input.frozen.get("src/lib/report-knowledge/compatibilityDirectionEvidence.ts") ?? "UNKNOWN"}`, "direction"), d.relationId, `/composition/result/evidence/directions/${name}`, { receivedTenGod: d.receivedTenGod, element: d.element }, { root: true, independent: true, parents: [b.anchors.get(`${subjectSlot}:day:stem`)!, b.anchors.get(`${recipientSlot}:day:stem`)!].filter(Boolean), direction: { subject: subject.fixtureOwnerId, recipient: recipient.fixtureOwnerId, relationId: d.relationId, recipientDayMaster: recipientStem, subjectDayMaster: subjectStem }, participants: [{ owner: subject.fixtureOwnerId, position: "day", slot: "stem", value: subjectStem }, { owner: recipient.fixtureOwnerId, position: "day", slot: "stem", value: recipientStem }] });
    const expected = getCrossTenGodRelation({ viewerDayStem: recipientStem, targetDayStem: subjectStem });
    if (d.subjectPerson !== subject.originalPersonId || d.targetPerson !== recipient.originalPersonId || d.receivedTenGod?.viewerDayStem !== recipientStem || d.receivedTenGod?.targetDayStem !== subjectStem || d.receivedTenGod?.tenGod !== expected?.tenGod) b.index.block(n, "WRONG_DIRECTION", [d.relationId]);
    if (d.mbtiPair) {
      const source = d.mbtiPair.sourceType;
      if (source) {
        const file = `docs/product/mbti/source/${source}.json`, raw = JSON.parse(b.knowledge.input.readFile(file).replace(/^\uFEFF/, "")) as { relationshipHints?: { notablePairs?: { withType: string; sourceCoverage?: string }[] } };
        const index = raw.relationshipHints?.notablePairs?.findIndex(p => p.withType === d.mbtiPair!.targetType) ?? -1;
        const node = b.node("SOURCE_DECLARATION", subject, p, d.mbtiPair.evidenceId, `/composition/result/evidence/directions/${name}/mbtiPair`, { sourceType: source, targetType: d.mbtiPair.targetType, sourceCoverage: d.mbtiPair.sourceCoverage, classification: "REFERENCE_ONLY", individualTrait: false }, { parents: [n.id], sources: index >= 0 ? [b.knowledge.source(file, `/relationshipHints/notablePairs/${index}/withType`, d.mbtiPair.targetType)] : [] });
        if (index < 0) b.index.block(node, "SOURCE_REFERENCE_UNRESOLVED", [d.mbtiPair.evidenceId]);
      }
    }
  }
  for (const kind of e.unsupportedCrossRelations) b.requirement(pairOwner, "UNSUPPORTED_PRODUCER", `/pair/unsupported/${kind}`, true, [kind]);
  if (["parentChild", "managerReport"].includes(e.category)) b.requirement(pairOwner, "UNKNOWN_ROLE_AUTHORITY", "/pair/actualRoleAssignments");
  if (e.category === "businessPartner") b.requirement(pairOwner, "UNKNOWN_BUSINESS_FACTS", "/pair/contractsSharesRevenueDebtAuthority");
  if (e.category === "friendship") b.requirement(pairOwner, "UNKNOWN_RELATIONSHIP_HISTORY", "/pair/actualClosenessConflictContactHistory");
}
