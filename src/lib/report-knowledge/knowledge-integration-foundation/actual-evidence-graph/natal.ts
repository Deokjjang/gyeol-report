import { collectStructureAtoms } from "../../../interpretation-v4/strength";
import { STRUCTURE_VERSION } from "../../../interpretation-v4/structureTypes";
import { adaptSupplementTable, SUPPLEMENT_FOUNDATION_VERSION } from "../../../interpretation-v4/foundationSupplement";
import { SAJU_CALENDAR_VERSION } from "../../../saju/calendarVersion";
import { NATAL_TABLE_VERSION } from "../../natalTableEvidence";
import type { EvidenceBuilder } from "./builder";
export function adaptNatalEvidence(b: EvidenceBuilder, slot: "person" | "personA" | "personB") {
  const e = b.input.evidence, calc = e.calculations[slot], table = e.natalTableEvidence[slot], owner = b.owner(slot);
  if (!calc || !table) { b.requirement(owner, "MISSING_PRODUCER_OUTPUT", `/calculations/${slot}`); return; }
  if (calc.calculationVersion !== SAJU_CALENDAR_VERSION || table.calendarVersion !== SAJU_CALENDAR_VERSION || table.version !== NATAL_TABLE_VERSION || calc.dayMaster !== calc.pillars.day.stem) { b.requirement(owner, "UNSUPPORTED_PRODUCER", `/calculations/${slot}/producerVersion`, true); return; }
  const producer = b.producer("report-knowledge/natalTableEvidence", "buildCanonicalNatalTable", `${table.version}/${table.calendarVersion}`);
  // All six inspected handlers call this same calendar producer. Preserve that
  // identity across products instead of counting its wrappers as new facts.
  const calculationProducer = b.producer("saju/calculateSaju", "calculateSaju", calc.calculationVersion ?? "UNKNOWN");
  if (calc.calculationVersion !== table.calendarVersion || calc.birthTimeContext?.calendarVersion !== table.calendarVersion) b.requirement(owner, "UNSUPPORTED_PRODUCER", `/calculations/${slot}/calculationVersion`);
  const pillars: string[] = [];
  for (const p of table.pillars) {
    const position = p.columnId, value = calc.pillars[position], confirmed = calc.birthTimeContext?.confirmed[position];
    if (!value || !confirmed || value.stem !== confirmed.stem || value.branch !== confirmed.branch || position === "hour" && table.precision === "unknown") { b.requirement(owner, position === "hour" ? "UNKNOWN_BIRTH_TIME" : "MISSING_PARTICIPANT", `/natalTableEvidence/${slot}/pillars/${position}`); continue; }
    const ids: string[] = [];
    for (const part of ["stem", "branch"] as const) {
      const n = b.node("CALCULATED_NATAL_FACT", owner, calculationProducer, null, `/calculations/${slot}/pillars/${position}/${part}`, { position, slot: part, value: value[part], isDayMaster: position === "day" && part === "stem", birthTimePrecision: table.precision }, { root: true, independent: true, participants: [{ owner: owner.fixtureOwnerId, position, slot: part, value: value[part] }] });
      b.anchors.set(`${slot}:${position}:${part}`, n.id); pillars.push(n.id); ids.push(n.id);
    }
    b.node("CALCULATED_NATAL_FACT", owner, producer, null, `/natalTableEvidence/${slot}/pillars/${position}`, { position, pillar: p.pillar, hiddenStems: p.hiddenStems, tenGod: p.tenGod, twelveLifeStage: p.twelveLifeStage }, { parents: ids });
  }
  if (table.precision === "unknown") b.requirement(owner, "UNKNOWN_BIRTH_TIME", `/calculations/${slot}/birthTimeContext/confirmed/hour`);
  const distribution = b.node("CALCULATED_NATAL_FACT", owner, calculationProducer, null, `/calculations/${slot}/elements`, { elements: calc.elements, yinYang: calc.yinYang, completeHour: !!calc.pillars.hour }, { parents: pillars });
  b.anchors.set(`${slot}:element-distribution`, distribution.id);
  for (const a of collectStructureAtoms(calc.pillars)) {
    const n = b.node("CALCULATED_NATAL_FACT", owner, b.producer("interpretation-v4/strength", "collectStructureAtoms", STRUCTURE_VERSION), a.id, `/calculationObservations/${slot}/structureAtoms/${a.id}`, { god: a.god, position: a.position, location: a.location, stem: a.stem, element: a.element, weight: a.weight, provenance: a.provenance }, { root: true, independent: true, participants: [{ owner: owner.fixtureOwnerId, position: a.position, slot: a.location, value: a.stem }], parents: [b.anchors.get(`${slot}:day:stem`)!, b.anchors.get(`${slot}:${a.position}:${a.location === "visible" ? "stem" : "branch"}`)!].filter(Boolean) });
    b.anchors.set(`${slot}:atom:${a.id}`, n.id);
  }
  for (const [i, f] of table.features.entries()) {
    const n = b.node("CALCULATED_NATAL_FACT", owner, producer, f.evidenceIds[0] ?? null, `/natalTableEvidence/${slot}/features/${i}`, { featureDefinitionId: f.id, category: f.category, source: f.source, basis: f.basis, positions: f.positions, evidenceIds: f.evidenceIds }, { root: true, independent: true, parents: pillars, participants: f.positions.map(position => ({ owner: owner.fixtureOwnerId, position, slot: "feature-position", value: f.id })) });
    b.anchors.set(`${slot}:feature:${f.id}`, n.id); for (const id of f.evidenceIds) b.anchors.set(`${slot}:original:${id}`, n.id);
  }
  for (const [i, r] of table.relations.entries()) {
    const n = b.node("CALCULATED_NATAL_FACT", owner, producer, r.id, `/natalTableEvidence/${slot}/relations/${i}`, { positions: r.positions, participants: r.participants }, { root: true, independent: true, parents: r.positions.map(p => b.anchors.get(`${slot}:${p}:${r.id.includes("STEM_COMBINATION") ? "stem" : "branch"}`)!).filter(Boolean), participants: r.positions.map((p, j) => ({ owner: owner.fixtureOwnerId, position: p, slot: r.id.includes("STEM_COMBINATION") ? "stem" : "branch", value: r.participants[j] ?? "UNKNOWN" })) });
    b.anchors.set(`${slot}:original:${r.id}`, n.id);
  }
  for (const [i, stage] of adaptSupplementTable(table).stages.entries()) {
    const n = b.node("CALCULATED_NATAL_FACT", owner, b.producer("interpretation-v4/foundationSupplement", "adaptSupplementTable", SUPPLEMENT_FOUNDATION_VERSION), stage.canonicalId, `/calculationObservations/${slot}/stages/${i}`, { stage: stage.stage, scope: stage.scope, provenance: stage.provenance, involvedPillars: stage.involvedPillars, involvedCharacters: stage.involvedCharacters }, { root: true, independent: true, parents: stage.involvedPillars.map(p => b.anchors.get(`${slot}:${p}:branch`)!).filter(Boolean) });
    b.anchors.set(`${slot}:original:${stage.canonicalId}`, n.id);
  }
}
