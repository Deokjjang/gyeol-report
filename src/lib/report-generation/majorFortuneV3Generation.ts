import { buildMajorFortuneV3, isMajorFortuneV3Draft, majorFortuneV3CustomerText } from "../interpretation-v3/majorFortuneEditorial";
import type { MajorFortuneEvidencePacket } from "../report-knowledge/majorFortuneTypes";
import { generateMajorFortuneProductDraft } from "./majorFortuneGenerationHandler";
import { validateMajorFortuneReportDraft } from "./majorFortuneReportDraftValidator";
import type { MajorFortuneReportDraft } from "./majorFortuneReportDraftTypes";
import { normalizeReportInputPayload } from "./reportInputAdapter";

const record = (value: unknown): value is Record<string, unknown> => !!value && typeof value === "object" && !Array.isArray(value);
const stable = (value: unknown): string => Array.isArray(value) ? `[${value.map(stable).join(",")}]` : record(value) ? `{${Object.keys(value).filter(key => value[key] !== undefined).sort().map(key => `${JSON.stringify(key)}:${stable(value[key])}`).join(",")}}` : JSON.stringify(value);
const editorialProjection = (draft: ReturnType<typeof buildMajorFortuneV3>) => ({ title: draft.title, inputSummary: draft.inputSummary, chapterTitle: draft.chapterTitle, opening: draft.opening, editorialSections: draft.editorialSections, editorialYears: draft.editorialYears, nextChapter: draft.nextChapter, finale: draft.finale, editorialAudit: draft.editorialAudit });

export async function createMajorFortuneV3(payload: unknown) {
  const normalized = normalizeReportInputPayload(payload);
  if (!normalized.ok || normalized.value.kind !== "majorFortune") return null;
  const generated = await generateMajorFortuneProductDraft(normalized.value, { writer: { enabled: false } });
  if (!generated.ok) return null;
  const packet = generated.evidencePacket as MajorFortuneEvidencePacket;
  if (packet.decadeReading?.version !== "major-decade-v2" || packet.decadeReading.years.length !== 10) return null;
  return { draft: buildMajorFortuneV3(generated.draft, packet), evidencePacket: packet };
}

export function validateMajorFortuneV3(draft: unknown, evidence: unknown): readonly string[] {
  if (!isMajorFortuneV3Draft(draft) || !record(evidence) || evidence.productType !== "major_fortune") return ["MAJOR_FORTUNE_V3_CONTRACT_REQUIRED"];
  const packet = evidence as unknown as MajorFortuneEvidencePacket;
  if (packet.decadeReading?.version !== "major-decade-v2" || packet.decadeReading.years.length !== 10) return ["MAJOR_FORTUNE_V3_READING_REQUIRED"];
  const errors: string[] = [];
  const legacyCandidate = { ...draft, version: "v1", productVersion: "v1" } as MajorFortuneReportDraft;
  const legacy = validateMajorFortuneReportDraft(legacyCandidate);
  if (!legacy.ok || !legacy.value) errors.push("MAJOR_FORTUNE_V3_LEGACY_COMPAT_INVALID");
  else {
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
  if (draft.opening.length < 5 || draft.editorialSections.length < 8 || draft.finale.length < 3) errors.push("MAJOR_FORTUNE_V3_EDITORIAL_INCOMPLETE");
  const visible = majorFortuneV3CustomerText(draft);
  if (/evidenceId|debug|fixture|backend|source_id|0\s*[~-]\s*100|\d+\s*점|[SABC][+\-]?\s*등급/iu.test(visible)) errors.push("MAJOR_FORTUNE_V3_VISIBLE_COPY_INVALID");
  return [...new Set(errors)];
}
