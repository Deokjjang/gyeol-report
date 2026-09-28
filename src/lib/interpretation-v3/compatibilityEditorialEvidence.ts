import { adaptCalculation, adaptMbti, adaptNatalTable, mergeEvidence } from "./evidence";
import { storySupport } from "./comprehensiveStoryEvidence";
import type { Evidence } from "./types";
import type { SajuCalcResult } from "../saju/types";
import type { CompatibilityEvidencePacket } from "../report-knowledge/compatibilityEvidenceBuilder";
import { getCanonicalNatalTable } from "../report-knowledge/natalTableEvidence";
import { buildCompatibilityDirectionEvidence } from "../report-knowledge/compatibilityDirectionEvidence";
import { createBranchRef, detectCrossBranchRelations } from "../report-knowledge/compatibilityRelationRules";

export type PairSlot = "personA" | "personB";
export type PairCalculations = Readonly<Record<PairSlot, SajuCalcResult>>;
export const PAIR_SLOTS = ["personA", "personB"] as const;
export const otherSlot = (slot: PairSlot): PairSlot => slot === "personA" ? "personB" : "personA";

/** Adapts existing relations. No new scoring, calendar or MBTI pair rules. */
export function compatibilityEditorialEvidence(packet: CompatibilityEvidencePacket, calculations: PairCalculations) {
  const direction = buildCompatibilityDirectionEvidence(packet.input, packet.personAChartSummary, packet.personBChartSummary, packet.relationshipType);
  const facts: Evidence[] = [];
  const substantial: string[] = [];
  for (const slot of PAIR_SLOTS) {
    const table = getCanonicalNatalTable(packet, slot);
    if (!table) continue;
    const calc = calculations[slot];
    const natal = mergeEvidence(adaptNatalTable(table, slot).filter(f => f.kind !== "element"),
      // No uncertain-hour weighted distribution becomes a character hero.
      table.precision === "exact" ? adaptCalculation(calc, slot) : [], adaptMbti(direction.persons[slot].mbti, slot));
    facts.push(...natal);
    substantial.push(...natal.filter(f => storySupport(f.featureId, natal, calc).substantial).map(f => f.id));
  }
  const pairFact = (slot: PairSlot, key: string, value: unknown, label: string, kind: "relation" | "mbti" = "relation") => {
    const id = `${slot}:pair:${key}`;
    facts.push({ id, featureId: `pair:${key}`, kind, subject: slot, scope: kind === "mbti" ? "behavior" : "natal", value: { detail: value, label },
      sourceRefs: kind === "mbti" ? [`docs/product/mbti/source/${direction.persons[slot].mbti}.json:relationshipHints:notablePairs:${direction.persons[otherSlot(slot)].mbti}`] : ["compatibilityRelationRules", ...PAIR_SLOTS.map(s => `${s}:canonical-natal-table:pillars`)],
      lineage: [`${direction.persons[slot].personId}:to:${direction.persons[otherSlot(slot)].personId}:${key}`], certainty: "confirmed", salience: "direct", domains: ["relationship", "love", "career", "business", "lifestyle"] });
    if (kind === "relation") substantial.push(id);
    return id;
  };
  for (const slot of PAIR_SLOTS) {
    const d = slot === "personA" ? direction.aToB : direction.bToA;
    if (d.receivedTenGod) pairFact(slot, "received-god", d.receivedTenGod, `${direction.persons[otherSlot(slot)].name}님에게 ${d.receivedTenGod.tenGodKo}`);
    if (d.element) pairFact(slot, "element", d.element, d.element.relationLabel);
    if (d.mbtiPair) pairFact(slot, "mbti", d.mbtiPair, `${direction.persons[slot].mbti} · ${direction.persons[otherSlot(slot)].mbti} 대화`, "mbti");
  }
  const refs = (slot: PairSlot) => (getCanonicalNatalTable(packet, slot)?.pillars ?? []).flatMap(p => {
    const ref = createBranchRef({ person: slot, personLabel: direction.persons[slot].name, position: p.columnId, pillar: p.pillar });
    return ref ? [ref] : [];
  });
  const relations = detectCrossBranchRelations({ personARefs: refs("personA"), personBRefs: refs("personB") }).map(r => ({ ...r,
    identity: `${r.kind}:${r.refs.map(ref => `${direction.persons[ref.person].personId}:${ref.position}:${ref.branch}`).sort().join("|")}`,
  })).toSorted((a, b) => Number(b.refs.every(r => r.position === "day")) - Number(a.refs.every(r => r.position === "day")) ||
    Number(b.refs.some(r => r.position === "day")) - Number(a.refs.some(r => r.position === "day")) || a.identity.localeCompare(b.identity));
  // Identical birth/name identities can produce the same symmetric observation
  // twice. Keep one fact without counting duplicated evidence as extra support.
  const uniqueRelations = [...new Map(relations.map(r => [r.identity, r])).values()];
  for (const r of uniqueRelations) pairFact("personA", r.identity, r, r.relationLabel);
  const invariant = [...new Set([
    ...relations.map(r => r.identity),
    ...PAIR_SLOTS.map(slot => `${direction.persons[slot].personId}:${direction.persons[slot].dayPillar}`),
    ...[direction.aToB, direction.bToA].map(d => `${d.subjectPerson}:to:${d.targetPerson}:${d.receivedTenGod?.tenGod}:${d.element?.relation}`),
  ])].sort();
  return { facts, substantial, direction, relations: uniqueRelations, invariant };
}
