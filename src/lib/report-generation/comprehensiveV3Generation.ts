import type { SajuCalcResult } from "../saju/types";
import { buildProductNatalTables, getCanonicalNatalTable } from "../report-knowledge/natalTableEvidence";
import { SAJU_CALENDAR_VERSION } from "../saju/calendarVersion";
import { adaptCalculation, adaptMbti, adaptNatalTable, mergeEvidence, validateEvidence } from "../interpretation-v3/evidence";
import { normalizeContext } from "../interpretation-v3/context";
import { buildComprehensiveV3, buildComprehensiveV3Legacy, COMPREHENSIVE_V3_VERSION, comprehensiveV3CustomerText, isComprehensiveV3Draft, type ComprehensiveV3Draft } from "../interpretation-v3/comprehensive";
import { validateV3Copy } from "../interpretation-v3/engine";
import { buildComprehensiveV2EvidenceFromGenerationInput } from "./comprehensiveV2GenerationHandler";
import { buildComprehensiveReportV2ProfileTable } from "./comprehensiveReportProfileTableBuilder";
import { withReportInputEvidence } from "./reportInputEvidence";
import { normalizeReportInputPayload } from "./reportInputAdapter";
import type { Evidence } from "../interpretation-v3/types";

const record = (v: unknown): v is Record<string, unknown> => !!v && typeof v === "object" && !Array.isArray(v);
const stable = (value: unknown): string => Array.isArray(value) ? `[${value.map(stable).join(",")}]`
  : record(value) ? `{${Object.keys(value).sort().map(k => `${JSON.stringify(k)}:${stable(value[k])}`).join(",")}}` : JSON.stringify(value);
function v3Facts(packet: unknown, calc: SajuCalcResult, mbti: string, enriched = true): readonly Evidence[] {
  const table = getCanonicalNatalTable(packet);
  if (!table) return [];
  // Eight visible glyphs stay in the professional table, never determine
  // missing/excess elements or the body interpretation. Use weighted labels only.
  const calculated = adaptCalculation(calc);
  const dominant = Math.max(...calculated.filter(e => e.kind === "ten_god").map(e => Number(e.value)));
  // The Phase 2 adapter omitted canonical WEAK labels. Read them here for the
  // comprehensive presentation only; do not invent a threshold or alter core.
  const weak: Evidence[] = enriched && table.precision === "exact" && calc.calculationVersion ? calc.elements.labels.filter(l => l.endsWith("_WEAK")).map(l => {
    const element = l.split("_")[0].toLowerCase(), id = `person:natal:element_${element}_weak`;
    return { id, featureId: `element_${element}_weak`, kind: "element", subject: "person", scope: "natal",
      value: { element, condition: "weak", method: "canonical-weighted", version: calc.calculationVersion, weighted: calc.elements.weighted },
      sourceRefs: [`${calc.calculationVersion}:elements.labels:${l}`, `${calc.calculationVersion}:elements.weighted`], lineage: [id], certainty: "confirmed", salience: "supporting", domains: ["lifestyle"] };
  }) : [];
  return mergeEvidence(adaptNatalTable(table).filter(e => e.kind !== "element"), calculated, weak, adaptMbti(mbti)).map(e => {
    const god = calculated.find(c => c.featureId === e.featureId && c.kind === "ten_god");
    return { ...e, ...(god && Number(god.value) === dominant ? { salience: "prominent" as const } : {}),
      // Unknown/approximate time must not silently acquire exact-time certainty.
      ...(table.precision !== "exact" && e.kind !== "mbti" ? { certainty: "conditional" as const } : {}) };
  });
}
export function createComprehensiveV3(payload: unknown) {
  const normalized = normalizeReportInputPayload(payload);
  if (!normalized.ok || normalized.value.kind !== "comprehensiveV2") return null;
  const input = normalized.value, p = input.person;
  const generated = buildComprehensiveV2EvidenceFromGenerationInput(input);
  const calculation = generated.calculation;
  const packet = { ...withReportInputEvidence(generated.packet, input), calendarCalculationVersion: SAJU_CALENDAR_VERSION, natalTableEvidence: buildProductNatalTables(generated.packet) };
  const facts = v3Facts(packet, calculation, p.mbtiType);
  const context = normalizeContext({ lifeStatus: input.userContext.jobStatus, fieldLabel: input.userContext.detailJob, relationshipStatus: input.userContext.relationshipStatus });
  const draft = buildComprehensiveV3({ name: p.name, facts, context, relationshipStatus: input.userContext.relationshipStatus,
    profileTable: buildComprehensiveReportV2ProfileTable({ evidencePacket: generated.packet, mbtiType: p.mbtiType || "미입력", sajuFacts: generated.facts }) });
  return { draft, evidencePacket: { ...packet, comprehensiveV3: { version: "comprehensive-evidence-v3.1", calculation, facts } } };
}

/** Versioned snapshot validation, with no migration, provider or write. Rebuild
 * content from stored canonical evidence to reject unsupported refs/copy. */
export function validateComprehensiveV3(draft: unknown, packet: unknown): readonly string[] {
  if (!isComprehensiveV3Draft(draft) || !record(packet) || !record(packet.comprehensiveV3) || !record(packet.inputBasis)) return ["V3_CONTRACT_REQUIRED"];
  const v3 = packet.comprehensiveV3, basis = packet.inputBasis;
  if (v3.version !== "comprehensive-evidence-v3.1" || !record(v3.calculation) || !record(basis.person) || !record(basis.userContext)) return ["V3_EVIDENCE_REQUIRED"];
  try {
    const calc = v3.calculation as unknown as SajuCalcResult;
    const table = getCanonicalNatalTable(packet);
    if (!table || table.pillars.some(p => {
      const actual = calc.pillars[p.columnId];
      return !actual || actual.stem + actual.branch !== p.pillar;
    })) return ["V3_CALCULATION_MISMATCH"];
    const legacy = draft.version === COMPREHENSIVE_V3_VERSION;
    const facts = v3Facts(packet, calc, String(basis.person.mbtiType ?? ""), !legacy);
    const errors = [...validateEvidence(facts)];
    if (stable(facts) !== stable(v3.facts)) errors.push("V3_FACTS_MISMATCH");
    const expected = (legacy ? buildComprehensiveV3Legacy : buildComprehensiveV3)({ name: String(basis.person.name), facts,
      context: normalizeContext({ lifeStatus: String(basis.userContext.jobStatus), fieldLabel: String(basis.userContext.detailJob), relationshipStatus: String(basis.userContext.relationshipStatus) }),
      relationshipStatus: String(basis.userContext.relationshipStatus), profileTable: draft.profileTable });
    if (stable(expected) !== stable(draft)) errors.push("V3_CONTENT_MISMATCH");
    errors.push(...validateV3Copy(comprehensiveV3CustomerText(draft)));
    if (!draft.opening.length || !draft.sections.length || draft.patterns.length < 3) errors.push("V3_CONTENT_INCOMPLETE");
    return errors;
  } catch { return ["V3_EVIDENCE_INVALID"]; }
}
export type { ComprehensiveV3Draft };
