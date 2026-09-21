import { publicationBirthTimeContexts, publishedPillarMatches } from "./birthTimePublication";
import { validateDayunPublication } from "./dayunPublication";
import { COMPREHENSIVE_REPORT_SECTION_IDS } from "../report-knowledge/reportSectionSchema";
import { deriveAllowedCompatibilityMbtiTerms, deriveAllowedCompatibilitySajuTerms } from "./openaiCompatibilityReportWriterPrompt";
import type { CompatibilityEvidencePacket } from "../report-knowledge/compatibilityEvidenceBuilder";
import { validateComprehensiveReportDraft } from "./comprehensiveReportDraftValidator";
import { COMPREHENSIVE_REPORT_V2_LONGFORM_READING_IDS } from "./comprehensiveReportDraftTypes";
import { validateCareerReportDraft } from "./careerReportDraftValidator";
import { validateLoveMarriageChildReportDraft } from "./loveMarriageChildReportDraftValidator";
import { validateCompatibilityReportDraft } from "./compatibilityReportDraftValidator";
import { validateMajorFortuneReportDraft } from "./majorFortuneReportDraftValidator";
import { validateAnnualFortuneReportDraft } from "./annualFortuneReportDraftValidator";

export const PUBLISH_GATE_VERSION = "paid-report-v1";
export function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
function nonempty(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}
function strings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(strings);
  return isRecord(value) ? Object.values(value).flatMap(strings) : [];
}

// Validate the exact JSON that will be persisted, including deterministic evidence.
// The older draft validators remain available for legacy imports and repair diagnostics.
export function validateProductPublication(product: string, draft: unknown, evidence: unknown, inputPayload?: unknown) {
  const errors: string[] = [];
  const birthContexts = publicationBirthTimeContexts(evidence);
  if (isRecord(evidence) && evidence.birthTimeContexts !== undefined && !birthContexts) errors.push("BIRTH_TIME_CONTEXT_INVALID");
  if (!isRecord(draft)) return { ok: false, errors: ["DRAFT_REQUIRED"] };
  if (product === "major_fortune" || product === "annual_fortune") errors.push(...validateDayunPublication(product, draft, evidence, inputPayload));
  if (draft.productType !== product) errors.push("PRODUCT_MISMATCH");
  if (!isRecord(evidence) || Object.keys(evidence).length < 3) errors.push("EVIDENCE_REQUIRED");
  else if (evidence.productType !== product) errors.push("EVIDENCE_PRODUCT_MISMATCH");
  if (birthContexts && isRecord(evidence) && product !== "saju_mbti_full") {
    for (const [role, context] of Object.entries(birthContexts)) {
      let pillars: Record<string, unknown> = {};
      if (product === "saju_mbti_compatibility" && isRecord(evidence.participants)) {
        const participant = evidence.participants[role === "personA" ? "a" : "b"];
        if (isRecord(participant) && isRecord(participant.pillars)) pillars = participant.pillars;
      } else if (product === "love_marriage_child" && isRecord(evidence.sajuBasis) && Array.isArray(evidence.sajuBasis.fullPillars)) {
        pillars = Object.fromEntries(evidence.sajuBasis.fullPillars.filter(isRecord).map((p) => [String(p.key), p.pillar]));
      } else if (isRecord(evidence.userPillars)) pillars = evidence.userPillars;
      for (const key of ["year", "month", "day", "hour"] as const) {
        if (key === "hour" && context.birthTimePrecision === "unknown") {
          if (nonempty(pillars.hour)) errors.push("UNCONFIRMED_HOUR_PUBLISHED");
        } else if (!publishedPillarMatches(pillars[key], context.confirmed[key])) errors.push(`BIRTH_TIME_PILLAR_MISMATCH:${role}:${key}`);
      }
    }
  }
  const { productVersion: _version, ...candidate } = draft;
  void _version;
  const validators: Record<string, (value: unknown) => { ok: boolean; errors: readonly string[] }> = {
    saju_mbti_full: validateComprehensiveReportDraft,
    career_money_study: validateCareerReportDraft,
    love_marriage_child: validateLoveMarriageChildReportDraft,
    saju_mbti_compatibility: (value) => validateCompatibilityReportDraft(value, {
      allowedSajuTerms: deriveAllowedCompatibilitySajuTerms(evidence as CompatibilityEvidencePacket),
      allowedMbtiTerms: deriveAllowedCompatibilityMbtiTerms(evidence as CompatibilityEvidencePacket),
    }),
    major_fortune: validateMajorFortuneReportDraft,
    annual_fortune: validateAnnualFortuneReportDraft,
  };
  let validation: { ok: boolean; errors: readonly string[] } | undefined;
  try { validation = validators[product]?.(product === "saju_mbti_full" ? candidate : draft); }
  catch { errors.push("INVALID_DRAFT_OR_EVIDENCE"); }
  if (!validation?.ok) errors.push(...(validation?.errors ?? ["UNSUPPORTED_PRODUCT"]));
  if (product === "saju_mbti_full") {
    if (!isRecord(evidence) || !Array.isArray(evidence.sajuEntryIds) || evidence.sajuEntryIds.length === 0 ||
      !Array.isArray(evidence.sections) || evidence.sections.length === 0 || !isRecord(evidence.mbtiBasis) ||
      !Array.isArray(evidence.sajuFeatureDictionary) || evidence.sajuFeatureDictionary.length < 3) errors.push("EVIDENCE_INCOMPLETE");
    if (isRecord(evidence) && Array.isArray(evidence.sections)) {
      const sectionIds = evidence.sections.flatMap((s) => isRecord(s) && typeof s.sectionId === "string" ? [s.sectionId] : []);
      if (!COMPREHENSIVE_REPORT_SECTION_IDS.every((id) => sectionIds.filter((s) => s === id).length === 1)) errors.push("EVIDENCE_SECTIONS_INCOMPLETE");
    }
    const profile = isRecord(draft.profileTable) ? draft.profileTable : {};
    const grid = Array.isArray(profile.fourPillarGrid) ? profile.fourPillarGrid : [];
    for (const id of ["hour", "day", "month", "year"]) {
      const columns = grid.filter((column) => isRecord(column) && column.columnId === id);
      const column = columns[0];
      const birthContext = birthContexts?.person;
      if (id === "hour" && birthContext?.birthTimePrecision === "unknown") {
        if (nonempty(profile.hourPillar) || columns.length > 1 ||
          (isRecord(column) && (nonempty(column.pillar) || nonempty(column.heavenlyStem) || nonempty(column.earthlyBranch) ||
            ["hiddenStems", "tenGod", "twelveLifeStage", "twelveSinsal", "sinsal", "gwiin"].some((key) => Array.isArray(column[key]) && column[key].length > 0)))) {
          errors.push("UNCONFIRMED_HOUR_PUBLISHED");
        }
        continue;
      }
      if (birthContext && isRecord(column) && !publishedPillarMatches(column.pillar, birthContext.confirmed[id as "year" | "month" | "day" | "hour"])) {
        errors.push(`BIRTH_TIME_PILLAR_MISMATCH:${id}`);
      }
      if (columns.length !== 1 || !isRecord(column) || !nonempty(column.pillar)) {
        errors.push(`PILLAR_REQUIRED:${id}`);
      } else if (!nonempty(column.heavenlyStem) || !nonempty(column.earthlyBranch) ||
        !Array.isArray(column.hiddenStems) || column.hiddenStems.length === 0 ||
        !Array.isArray(column.tenGod) || column.tenGod.length === 0 ||
        !Array.isArray(column.twelveLifeStage) || column.twelveLifeStage.length === 0) {
        errors.push(`MANSERYEOK_INCOMPLETE:${id}`);
      }
    }
    const elements = Array.isArray(profile.fiveElementSummary) ? profile.fiveElementSummary : [];
    if (!["목", "화", "토", "금", "수"].every((label) =>
      elements.filter((s) => typeof s === "string" && new RegExp(`^${label}\\s*\\d+$`, "u").test(s.trim())).length === 1)) {
      errors.push("FIVE_ELEMENTS_INCOMPLETE");
    }
    if (!nonempty(profile.mbti) || !/^[IE][NS][TF][JP]$/.test(profile.mbti)) errors.push("MBTI_REQUIRED");
    if (isRecord(evidence) && evidence.mbtiType !== profile.mbti) errors.push("EVIDENCE_MBTI_MISMATCH");
    const features = isRecord(draft.sajuFeatureChapter) && Array.isArray(draft.sajuFeatureChapter.items)
      ? draft.sajuFeatureChapter.items : [];
    if (features.length < 3) errors.push("SAJU_FEATURES_REQUIRED");
    const readings = Array.isArray(draft.longformReadings) ? draft.longformReadings : [];
    for (const id of COMPREHENSIVE_REPORT_V2_LONGFORM_READING_IDS) {
      const matches = readings.filter((r) => isRecord(r) && r.readingId === id);
      if (matches.length !== 1 || !isRecord(matches[0]) || !nonempty(matches[0].body) || matches[0].body.trim().length < 260) {
        errors.push(`LONGFORM_REQUIRED:${id}`);
      }
    }
    const bodies = readings.flatMap((r) => isRecord(r) && nonempty(r.body) ? [r.body] : []);
    if (bodies.join("").length < 6000) errors.push("CONTENT_DENSITY_LOW");
    const paragraphs = bodies.flatMap((body) => body.split(/\n\s*\n/u)).map((p) => p.replace(/\s+/gu, " ").trim());
    const counts = new Map<string, number>();
    for (const paragraph of paragraphs.filter((p) => p.length > 80)) counts.set(paragraph, (counts.get(paragraph) ?? 0) + 1);
    const sentenceCounts = new Map<string, number>();
    for (const sentence of bodies.flatMap((body) => body.split(/[.!?]\s*/u)).map((s) => s.replace(/\s+/gu, " ").trim()).filter((s) => s.length >= 45)) {
      sentenceCounts.set(sentence, (sentenceCounts.get(sentence) ?? 0) + 1);
    }
    if ([...sentenceCounts.values()].some((count) => count > 3)) errors.push("EXCESSIVE_SENTENCE_REPETITION");
    if ([...counts.values()].some((count) => count > 2)) errors.push("EXCESSIVE_REPETITION");
    const meanings = features.flatMap((f) => isRecord(f) && nonempty(f.plainMeaning) ? [f.plainMeaning.trim()] : []);
    if (new Set(meanings).size !== meanings.length) errors.push("GENERIC_FEATURE_REPETITION");
  }
  if (strings(draft).some((s) => /INTERNAL_META|TODO|PLACEHOLDER|\[object Object\]|fixture|fallback|validation_errors/iu.test(s))) {
    errors.push("INTERNAL_MARKER");
  }
  return { ok: errors.length === 0, errors };
}
