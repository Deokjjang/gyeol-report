import { buildLoveMarriageChildEvidenceFromGenerationInput, calculateLoveMarriageChildSaju } from "./loveMarriageChildGenerationHandler";
import { normalizeReportInputPayload } from "./reportInputAdapter";
import { RELATIONSHIP_STATUSES, type RelationshipStatus } from "./reportInputTypes";
import { withReportInputEvidence } from "./reportInputEvidence";
import { buildProductNatalTables, getCanonicalNatalTable } from "../report-knowledge/natalTableEvidence";
import { SAJU_CALENDAR_VERSION } from "../saju/calendarVersion";
import { adaptCalculation, adaptMbti, adaptNatalTable, mergeEvidence, validateEvidence } from "../interpretation-v3/evidence";
import { buildLoveV3, isLoveV3Draft, loveV3CustomerText, LOVE_V3_VERSION, LOVE_V3_POLISH_VERSION, type LoveV3Draft } from "../interpretation-v3/loveEditorial";
import { buildLoveV3Polished } from "../interpretation-v3/loveEditorialPolish";
import { validateV3Copy } from "../interpretation-v3/engine";
import type { SajuCalcResult } from "../saju/types";

const record = (v: unknown): v is Record<string, unknown> => !!v && typeof v === "object" && !Array.isArray(v);
const stable = (v: unknown): string => Array.isArray(v) ? `[${v.map(stable).join(",")}]` : record(v) ? `{${Object.keys(v).filter(k => v[k] !== undefined).sort().map(k => `${JSON.stringify(k)}:${stable(v[k])}`).join(",")}}` : JSON.stringify(v);
function loveFacts(packet: unknown, calc: SajuCalcResult, mbti: string) {
  const table = getCanonicalNatalTable(packet);
  if (!table || table.precision !== "exact") return [];
  return mergeEvidence(adaptNatalTable(table).filter(f => f.kind !== "element"), adaptCalculation(calc), adaptMbti(mbti));
}
export function createLoveV3(payload: unknown, version: LoveV3Draft["version"] = LOVE_V3_POLISH_VERSION) {
  const normalized = normalizeReportInputPayload(payload);
  if (!normalized.ok || normalized.value.kind !== "loveMarriageChild") return null;
  const input = normalized.value, calculation = calculateLoveMarriageChildSaju(input.person);
  // Preserve conservative legacy handling for uncertain times; no fabricated
  // exact-hour heroes and no fall-through to a provider on explicit V3.
  if (calculation.birthTimeContext?.birthTimePrecision !== "exact") return null;
  const base = buildLoveMarriageChildEvidenceFromGenerationInput(input);
  const packet = { ...withReportInputEvidence(base, input), calendarCalculationVersion: SAJU_CALENDAR_VERSION, natalTableEvidence: buildProductNatalTables(base) };
  const facts = loveFacts(packet, calculation, input.person.mbtiType);
  const draft = (version === LOVE_V3_VERSION ? buildLoveV3 : buildLoveV3Polished)({ name: input.person.name, mbti: input.person.mbtiType, relationshipStatus: input.userContext.relationshipStatus, familyFocus: input.userContext.focusAreas.includes("가족"), facts, calculation });
  return { draft, evidencePacket: { ...packet, loveV3: { version: "love-evidence-v3.1", calculation, facts } } };
}

/** Snapshot-only validation: replay the exact version's content from stored
 * evidence. No new calculation, provider call or persistence side effect. */
export function validateLoveV3(draft: unknown, packet: unknown): readonly string[] {
  if (!isLoveV3Draft(draft) || !record(packet) || !record(packet.loveV3) || !record(packet.inputBasis)) return ["LOVE_V3_CONTRACT_REQUIRED"];
  const v3 = packet.loveV3, basis = packet.inputBasis;
  if (v3.version !== "love-evidence-v3.1" || !record(v3.calculation) || !record(basis.person) || !record(basis.userContext)) return ["LOVE_V3_EVIDENCE_REQUIRED"];
  if (!RELATIONSHIP_STATUSES.includes(basis.userContext.relationshipStatus as RelationshipStatus) || !Array.isArray(basis.userContext.focusAreas)) return ["LOVE_V3_INPUT_REQUIRED"];
  try {
    const calculation = v3.calculation as unknown as SajuCalcResult, table = getCanonicalNatalTable(packet);
    if (!table || table.precision !== "exact" || table.pillars.some(p => { const actual = calculation.pillars[p.columnId]; return !actual || actual.stem + actual.branch !== p.pillar; })) return ["LOVE_V3_CALCULATION_MISMATCH"];
    const facts = loveFacts(packet, calculation, String(basis.person.mbtiType ?? "")), errors = [...validateEvidence(facts)];
    if (stable(facts) !== stable(v3.facts)) errors.push("LOVE_V3_FACTS_MISMATCH");
    const expected = (draft.version === LOVE_V3_VERSION ? buildLoveV3 : buildLoveV3Polished)({ name: String(basis.person.name), mbti: String(basis.person.mbtiType ?? ""), relationshipStatus: basis.userContext.relationshipStatus as RelationshipStatus, familyFocus: basis.userContext.focusAreas.includes("가족"), facts, calculation });
    if (stable(expected) !== stable(draft)) errors.push("LOVE_V3_CONTENT_MISMATCH");
    const qa = draft.editorialAudit;
    if (!qa || qa.errors.length || qa.rejected.length || qa.warnings.length || qa.audit.mix.character < 0.6 || qa.audit.mix.advice > 0.2 || draft.chapters.length !== 9) errors.push("LOVE_V3_EDITORIAL_INCOMPLETE");
    errors.push(...validateV3Copy(loveV3CustomerText(draft)));
    return errors;
  } catch { return ["LOVE_V3_EVIDENCE_INVALID"]; }
}
