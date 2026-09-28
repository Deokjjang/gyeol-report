import { buildCareerEvidenceFromGenerationInput, calculateCareerSaju } from "./careerMoneyStudyGenerationHandler";
import { normalizeReportInputPayload } from "./reportInputAdapter";
import { withReportInputEvidence } from "./reportInputEvidence";
import { buildProductNatalTables, getCanonicalNatalTable } from "../report-knowledge/natalTableEvidence";
import { SAJU_CALENDAR_VERSION } from "../saju/calendarVersion";
import { adaptCalculation, adaptMbti, adaptNatalTable, mergeEvidence, validateEvidence } from "../interpretation-v3/evidence";
import { buildCareerV3, CAREER_V3_POLISH_VERSION, careerV3CustomerText, isCareerV3Draft } from "../interpretation-v3/careerEditorial";
import { buildCareerV3Polished } from "../interpretation-v3/careerEditorialPolish";
import { normalizeContext } from "../interpretation-v3/context";
import { validateV3Copy } from "../interpretation-v3/engine";
import type { SajuCalcResult } from "../saju/types";

const record = (v: unknown): v is Record<string, unknown> => !!v && typeof v === "object" && !Array.isArray(v);
const stable = (v: unknown): string => Array.isArray(v) ? `[${v.map(stable).join(",")}]` : record(v) ? `{${Object.keys(v).filter(k => v[k] !== undefined).sort().map(k => `${JSON.stringify(k)}:${stable(v[k])}`).join(",")}}` : JSON.stringify(v);
function careerFacts(packet: unknown, calc: SajuCalcResult, mbti: string) {
  const table = getCanonicalNatalTable(packet);
  if (!table || table.precision !== "exact") return [];
  return mergeEvidence(adaptNatalTable(table).filter(f => f.kind !== "element"), adaptCalculation(calc), adaptMbti(mbti));
}
export function createCareerV3(payload: unknown) {
  const normalized = normalizeReportInputPayload(payload);
  if (!normalized.ok || normalized.value.kind !== "careerMoneyStudy") return null;
  const input = normalized.value, calculation = calculateCareerSaju(input.person);
  // Non-exact times keep the existing conservative Career path. Never upgrade
  // conditional observations into a V3 hero to fill out an editorial chapter.
  if (calculation.birthTimeContext?.birthTimePrecision !== "exact") return null;
  const base = buildCareerEvidenceFromGenerationInput(input);
  const packet = { ...withReportInputEvidence(base, input), calendarCalculationVersion: SAJU_CALENDAR_VERSION, natalTableEvidence: buildProductNatalTables(base) };
  const facts = careerFacts(packet, calculation, input.person.mbtiType);
  const draft = buildCareerV3Polished({ name: input.person.name, mbti: input.person.mbtiType, facts, calculation,
    context: normalizeContext({ lifeStatus: input.userContext.jobStatus, fieldLabel: input.userContext.detailJob, relationshipStatus: input.userContext.relationshipStatus }) });
  return { draft, evidencePacket: { ...packet, careerV3: { version: "career-evidence-v3.1", calculation, facts } } };
}

/** Read-only, version-specific snapshot validation. Legacy drafts never enter
 * this builder, and validation has no provider, clock or persistence effects. */
export function validateCareerV3(draft: unknown, packet: unknown): readonly string[] {
  if (!isCareerV3Draft(draft) || !record(packet) || !record(packet.careerV3) || !record(packet.inputBasis)) return ["CAREER_V3_CONTRACT_REQUIRED"];
  const v3 = packet.careerV3, basis = packet.inputBasis;
  if (v3.version !== "career-evidence-v3.1" || !record(v3.calculation) || !record(basis.person) || !record(basis.userContext)) return ["CAREER_V3_EVIDENCE_REQUIRED"];
  try {
    const calc = v3.calculation as unknown as SajuCalcResult, table = getCanonicalNatalTable(packet);
    if (!table || table.precision !== "exact" || table.pillars.some(p => { const actual = calc.pillars[p.columnId]; return !actual || actual.stem + actual.branch !== p.pillar; })) return ["CAREER_V3_CALCULATION_MISMATCH"];
    const facts = careerFacts(packet, calc, String(basis.person.mbtiType ?? "")), errors = [...validateEvidence(facts)];
    if (stable(facts) !== stable(v3.facts)) errors.push("CAREER_V3_FACTS_MISMATCH");
    const builder = draft.version === CAREER_V3_POLISH_VERSION ? buildCareerV3Polished : buildCareerV3;
    const expected = builder({ name: String(basis.person.name), mbti: String(basis.person.mbtiType ?? ""), facts, calculation: calc,
      context: normalizeContext({ lifeStatus: String(basis.userContext.jobStatus), fieldLabel: String(basis.userContext.detailJob), relationshipStatus: String(basis.userContext.relationshipStatus) }) });
    if (stable(expected) !== stable(draft)) errors.push("CAREER_V3_CONTENT_MISMATCH");
    const qa = draft.editorialAudit;
    if (!qa || qa.errors.length || qa.rejected.length || qa.warnings.length || qa.audit.mix.character <= 0.5 || qa.audit.mix.advice > 0.35 || draft.chapters.length < 10) errors.push("CAREER_V3_EDITORIAL_INCOMPLETE");
    errors.push(...validateV3Copy(careerV3CustomerText(draft)));
    return errors;
  } catch { return ["CAREER_V3_EVIDENCE_INVALID"]; }
}
