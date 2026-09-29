import { buildMajorFortuneV3, isMajorFortuneV3Draft, LEGACY_MAJOR_FORTUNE_V3_VERSION, MAJOR_FORTUNE_V3_VERSION, majorFortuneV3CustomerText } from "../interpretation-v3/majorFortuneEditorial";
import { adaptCalculation, adaptMbti, adaptNatalTable, mergeEvidence, validateEvidence } from "../interpretation-v3/evidence";
import type { Evidence } from "../interpretation-v3/types";
import { buildProductNatalTables, getCanonicalNatalTable } from "../report-knowledge/natalTableEvidence";
import type { MajorFortuneEvidencePacket } from "../report-knowledge/majorFortuneTypes";
import { SAJU_CALENDAR_VERSION } from "../saju/calendarVersion";
import type { SajuCalcResult } from "../saju/types";
import { calculateMajorFortuneSaju, generateMajorFortuneProductDraft } from "./majorFortuneGenerationHandler";
import { validateMajorFortuneReportDraft } from "./majorFortuneReportDraftValidator";
import type { MajorFortuneReportDraft } from "./majorFortuneReportDraftTypes";
import { normalizeReportInputPayload } from "./reportInputAdapter";
import { buildMajorFortuneHorizon, MAJOR_HORIZON_VERSION } from "../interpretation-v3/majorFortuneHorizon";

const record = (value: unknown): value is Record<string, unknown> => !!value && typeof value === "object" && !Array.isArray(value);
const stable = (value: unknown): string => Array.isArray(value) ? `[${value.map(stable).join(",")}]` : record(value) ? `{${Object.keys(value).filter(key => value[key] !== undefined).sort().map(key => `${JSON.stringify(key)}:${stable(value[key])}`).join(",")}}` : JSON.stringify(value);
const editorialProjection = (draft: ReturnType<typeof buildMajorFortuneV3>) => ({ title: draft.title, inputSummary: draft.inputSummary, chapterTitle: draft.chapterTitle, opening: draft.opening, fortuneSignals: draft.fortuneSignals, editorialSections: draft.editorialSections, editorialYears: draft.editorialYears, nextChapter: draft.nextChapter, finale: draft.finale, editorialAudit: draft.editorialAudit });

function majorFortuneFacts(packet: unknown, calculation: SajuCalcResult, mbti: string): readonly Evidence[] {
  const table = getCanonicalNatalTable(packet);
  if (!table) return [];
  return mergeEvidence(adaptNatalTable(table).filter(fact => fact.kind !== "element"), adaptCalculation(calculation), adaptMbti(mbti));
}

export async function createMajorFortuneV3(payload: unknown, options: { now?: () => Date; edition?: "legacy-depth" } = {}) {
  const normalized = normalizeReportInputPayload(payload);
  if (!normalized.ok || normalized.value.kind !== "majorFortune") return null;
  const generated = await generateMajorFortuneProductDraft(normalized.value, { now: options.now, writer: { enabled: false } });
  if (!generated.ok) return null;
  const calculation = calculateMajorFortuneSaju(normalized.value.person);
  const basePacket = generated.evidencePacket as MajorFortuneEvidencePacket;
  const packet = { ...basePacket, calendarCalculationVersion: SAJU_CALENDAR_VERSION, natalTableEvidence: buildProductNatalTables(basePacket) };
  if (packet.decadeReading?.version !== "major-decade-v2" || packet.decadeReading.years.length !== 10) return null;
  const facts = majorFortuneFacts(packet, calculation, normalized.value.person.mbtiType);
  const draft = options.edition === "legacy-depth" ? buildMajorFortuneV3(generated.draft, packet) : buildMajorFortuneHorizon(generated.draft, packet, facts, calculation);
  if (!draft) return null;
  return { draft, evidencePacket: { ...packet, majorFortuneV3: { version: "major-fortune-evidence-v3.2", calculation, facts } } };
}

export function validateMajorFortuneV3(draft: unknown, evidence: unknown): readonly string[] {
  if (!isMajorFortuneV3Draft(draft) || !record(evidence) || evidence.productType !== "major_fortune") return ["MAJOR_FORTUNE_V3_CONTRACT_REQUIRED"];
  const packet = evidence as unknown as MajorFortuneEvidencePacket;
  if (packet.decadeReading?.version !== "major-decade-v2" || packet.decadeReading.years.length !== 10) return ["MAJOR_FORTUNE_V3_READING_REQUIRED"];
  const errors: string[] = [];
  const legacyCandidate = { ...draft, version: "v1", productVersion: "v1" } as MajorFortuneReportDraft;
  const legacy = validateMajorFortuneReportDraft(legacyCandidate);
  if (!legacy.ok || !legacy.value) errors.push("MAJOR_FORTUNE_V3_LEGACY_COMPAT_INVALID");
  else if (draft.version === MAJOR_HORIZON_VERSION) {
    const extension = record(evidence.majorFortuneV3) ? evidence.majorFortuneV3 : null;
    if (!extension || !record(extension.calculation) || !Array.isArray(extension.facts)) return ["MAJOR_FORTUNE_V3_EVIDENCE_REQUIRED"];
    const calculation = extension.calculation as unknown as SajuCalcResult;
    const table = getCanonicalNatalTable(evidence);
    if (!table || table.pillars.some(p => { const actual = calculation.pillars[p.columnId]; return !actual || actual.stem + actual.branch !== p.pillar; })) errors.push("MAJOR_FORTUNE_V3_CALCULATION_MISMATCH");
    const basis = record(evidence.inputBasis) && record(evidence.inputBasis.person) ? evidence.inputBasis.person : null;
    const facts = majorFortuneFacts(evidence, calculation, String(basis?.mbtiType ?? ""));
    errors.push(...validateEvidence(facts));
    if (stable(facts) !== stable(extension.facts)) errors.push("MAJOR_FORTUNE_V3_FACTS_MISMATCH");
    const expected = buildMajorFortuneHorizon(legacy.value, packet, facts, calculation);
    const projection = (d: typeof draft) => ({ ...editorialProjection(d), horizon: d.horizon, narrativeEdition: d.narrativeEdition, narrativeAudit: d.narrativeAudit, rhythmWarnings: d.rhythmWarnings });
    if (!expected || stable(projection(expected)) !== stable(projection(draft))) errors.push("MAJOR_FORTUNE_V3_CONTENT_MISMATCH");
    if (!draft.horizon || draft.horizon.currentYear !== packet.currentYear || draft.editorialYears.length !== 10 || draft.editorialYears.some((y, i) => y.year !== packet.currentYear - 3 + i)) errors.push("MAJOR_FORTUNE_V3_HORIZON_INVALID");
    const visible = majorFortuneV3CustomerText(draft);
    if (/evidenceId|debug|fixture|backend|source_id|career_shift|money_responsibility|previous_to_current|metal|water|\d+\s*점|[SABC][+\-]?\s*등급|확정 예측|그해의 일 장면|속도가 이 흐름에 섞/iu.test(visible)) errors.push("MAJOR_FORTUNE_V3_VISIBLE_COPY_INVALID");
    return [...new Set(errors)];
  }
  else if (draft.version === MAJOR_FORTUNE_V3_VERSION) {
    const expected = buildMajorFortuneV3(legacy.value, packet);
    if (stable(editorialProjection(expected)) !== stable(editorialProjection(draft))) errors.push("MAJOR_FORTUNE_V3_CONTENT_MISMATCH");
  }
  const years = draft.editorialYears;
  if (years.length !== 10 || new Set(years.map(year => year.year)).size !== 10 || new Set(years.map(year => year.title)).size !== 10) errors.push("MAJOR_FORTUNE_V3_YEARS_INCOMPLETE");
  for (const expected of packet.decadeReading.years) {
    const actual = years.find(year => year.year === expected.year);
    if (!actual || actual.ganji !== expected.ganji || actual.tenGod !== expected.tenGod || actual.importance !== expected.importance) errors.push(`MAJOR_FORTUNE_V3_YEAR_MISMATCH:${expected.year}`);
  }
  if (!years.some(year => year.isCurrentYear && year.year === packet.currentYear && year.paragraphs.length >= 4)) errors.push("MAJOR_FORTUNE_V3_CURRENT_YEAR_REQUIRED");
  if (draft.version === MAJOR_FORTUNE_V3_VERSION) {
    const extension = record(evidence.majorFortuneV3) ? evidence.majorFortuneV3 : null;
    if (!extension || extension.version !== "major-fortune-evidence-v3.2" || !record(extension.calculation) || !Array.isArray(extension.facts)) errors.push("MAJOR_FORTUNE_V3_EVIDENCE_REQUIRED");
    else {
      const calculation = extension.calculation as unknown as SajuCalcResult, table = getCanonicalNatalTable(evidence);
      if (!table || table.pillars.some(pillar => { const actual = calculation.pillars[pillar.columnId]; return !actual || actual.stem + actual.branch !== pillar.pillar; })) errors.push("MAJOR_FORTUNE_V3_CALCULATION_MISMATCH");
      const basis = record(evidence.inputBasis) && record(evidence.inputBasis.person) ? evidence.inputBasis.person : null;
      const facts = majorFortuneFacts(evidence, calculation, String(basis?.mbtiType ?? ""));
      errors.push(...validateEvidence(facts));
      if (stable(facts) !== stable(extension.facts)) errors.push("MAJOR_FORTUNE_V3_FACTS_MISMATCH");
    }
    if (draft.opening.length < 7 || draft.editorialSections.length < 8 || draft.finale.length < 4 || (draft.fortuneSignals?.length ?? 0) < 4 || years.some(year => year.paragraphs.length < 3)) errors.push("MAJOR_FORTUNE_V3_EDITORIAL_INCOMPLETE");
    if (years.some(year => year.timePosition !== (year.year < packet.currentYear ? "past" : year.year === packet.currentYear ? "current" : "future"))) errors.push("MAJOR_FORTUNE_V3_TENSE_POSITION_INVALID");
  } else if (draft.version !== LEGACY_MAJOR_FORTUNE_V3_VERSION) errors.push("MAJOR_FORTUNE_V3_VERSION_INVALID");
  const visible = majorFortuneV3CustomerText(draft);
  if (/evidenceId|debug|fixture|backend|source_id|career_shift|money_responsibility|previous_to_current|metal|water|0\s*[~-]\s*100|\d+\s*점|[SABC][+\-]?\s*등급/iu.test(visible)) errors.push("MAJOR_FORTUNE_V3_VISIBLE_COPY_INVALID");
  if (draft.version === MAJOR_FORTUNE_V3_VERSION && (/다음 10년/u.test(draft.title) || /크게 튀는 사건을 정해 두는 해가 아니라|생활의 어느 장면에서 반복되는지|특정 사건의 확정 예측은 아닙니다/u.test(visible))) errors.push("MAJOR_FORTUNE_V3_TEMPLATE_COPY_INVALID");
  return [...new Set(errors)];
}
