import { isRecord, validateNewProductPublication } from "./productPublishGate";
import type { ProductGenerationSuccessResult } from "./productGenerationDispatcher";
import { validateComprehensiveReportDraft } from "./comprehensiveReportDraftValidator";
import { deriveAllowedSajuTermsFromEvidencePacket } from "./openaiReportWriterPrompt";
import type { ComprehensiveReportEvidencePacket } from "../report-knowledge/comprehensiveReportEvidenceTypes";

export type DeliveryAudit = {
  version: "paid-one-call-v1";
  preflight: "pass" | "fail";
  writerValidation: "not_run" | "pass" | "fail";
  rescueKinds: string[];
  fallbackUsed: boolean;
  publish: "pass" | "fail";
  failureCode: string | null;
  issues: string[];
};

// Validator messages sometimes include rejected prose. Persist codes only.
export function deliveryIssueCodes(issues: readonly string[]): string[] {
  return [...new Set(issues.map(issue => issue.trim().match(/^[A-Z][A-Z0-9_]+/)?.[0] ?? "FIELD_INVALID"))].slice(0, 40);
}

const immutable = /^(?:productType|version|productVersion|personLabel|personALabel|personBLabel|relationshipType|targetYear|mode|dayunContext|profileTable|chartComparison|directionalClaims|personProfiles|categoryRole|calendarMonths|monthlyCalculationVersion|scoreSummary|calculationBasis|cycleSummary)$/;
const factKey = /^(?:.*[Ee]videnceIds?|.*[Ff]actIds?|mbti|mbtiType|dayMaster|.*[Pp]illar|.*[Gg]anji|stem|branch|stemTenGod|branchTenGod|startYear|endYear|startAge|endAge|year|month|subjectPerson|targetPerson|startKst|endKstExclusive)$/;
const internalMarker = /INTERNAL_META|TODO|PLACEHOLDER|\[object Object\]|fixture|fallback|validation_errors|sourceStatus|\b(?:mock|sample|deokmin|internal|validator|writer)\b/iu;
const same = (a: unknown, b: unknown): boolean => {
  if (Array.isArray(a)) return Array.isArray(b) && a.length === b.length && a.every((v, i) => same(v, b[i]));
  if (isRecord(a)) return isRecord(b) && Object.keys(a).filter(k => a[k] !== undefined).length === Object.keys(b).filter(k => b[k] !== undefined).length && Object.keys(a).every(k => same(a[k], b[k]));
  return a === b;
};

// Model-supplied facts must never be silently overwritten by deterministic
// attachments. Unknown IDs and scalar facts are rejected before any rescue.
function factMismatch(value: unknown, reference: unknown, evidence: unknown): boolean {
  const ids = new Set<string>();
  const collect = (v: unknown, idField = false) => {
    if (typeof v === "string" && idField) ids.add(v);
    else if (Array.isArray(v)) v.forEach(item => collect(item, idField));
    else if (isRecord(v)) Object.entries(v).forEach(([key, item]) => collect(item, /(?:^id$|[Ii]ds?$)/.test(key)));
  };
  collect(evidence);
  const check = (v: unknown, ref: unknown): boolean => {
    if (Array.isArray(v)) return v.some((item, i) => check(item, Array.isArray(ref) ? ref[i] : undefined));
    if (!isRecord(v)) return false;
    return Object.entries(v).some(([key, item]) => {
      const expected = isRecord(ref) ? ref[key] : undefined;
      if (immutable.test(key)) return !same(item, expected);
      if (/[Ee]videnceIds?$|[Ff]actIds?$/.test(key)) return !same(item, expected) && (Array.isArray(item) ? item : [item]).some(id => typeof id !== "string" || !ids.has(id));
      if (factKey.test(key)) return !same(item, expected);
      return check(item, expected);
    });
  };
  return check(value, reference);
}

export function settlePaidWriterDraft(product: string, parsed: unknown, prepared: ProductGenerationSuccessResult, payload: unknown) {
  const fallback = prepared.draft;
  const reject = (issues: readonly string[]) => ({ draft: fallback, source: "fallback" as const, issues: deliveryIssueCodes(issues), rescueKinds: [] as string[] });
  if (!isRecord(parsed) || !isRecord(fallback)) return reject(["DRAFT_REQUIRED"]);
  if (factMismatch(parsed, fallback, prepared.evidencePacket)) return reject(["WRITER_FACT_MISMATCH"]);
  if (product === "saju_mbti_full") {
    const checked = validateComprehensiveReportDraft(parsed, {
      allowedSajuTerms: deriveAllowedSajuTermsFromEvidencePacket(prepared.evidencePacket as ComprehensiveReportEvidencePacket),
    });
    const unsupported = checked.errors.filter(error => error.startsWith("UNSUPPORTED_SAJU_TERM"));
    if (unsupported.length) return reject(unsupported);
  }
  const texts = (v: unknown): string[] => typeof v === "string" ? [v] : Array.isArray(v) ? v.flatMap(texts) : isRecord(v) ? Object.values(v).flatMap(texts) : [];
  // Do not launder a medical/financial claim through a word-replacement sanitizer.
  if (texts(parsed).some(s => /(?:우울증|불안장애|정신질환|약물 치료|확정 진단|반드시 완치|수익을 보장|수익 보장|질병을 예방)/u.test(s))) return reject(["UNSAFE_MEDICAL_OR_GUARANTEED_CLAIM"]);
  if (typeof parsed.openingSummary === "string" && !parsed.openingSummary.trim()) return reject(["CONTENT_REQUIRED"]);
  const counts = (v: unknown) => {
    const map = new Map<string, number>();
    for (const s of texts(v).flatMap(t => t.split(/[.!?]\s*/u)).map(s => s.replace(/\s+/gu, " ").trim()).filter(s => s.length >= 40)) map.set(s, (map.get(s) ?? 0) + 1);
    return map;
  };
  const canonicalCounts = counts(fallback);
  if ([...counts(parsed)].some(([s, n]) => n > Math.max(3, canonicalCounts.get(s) ?? 0))) return reject(["EXCESSIVE_REPETITION"]);

  // These fields are calculated server-side and are absent from narrative schemas.
  // Missing narrative sections/longform are never filled wholesale here.
  const attachments = ["profileTable", "sajuFeatureChapter", "sajuFeatureSpotlight", "sajuSignatureScenes",
    "reportDifferentiationModules", "sajuSymbolicNickname", "dayunContext", "productVersion"];
  const candidate = structuredClone(parsed);
  for (const key of attachments) if (candidate[key] === undefined && fallback[key] !== undefined) candidate[key] = structuredClone(fallback[key]);
  const gate = (draft: unknown) => validateNewProductPublication(product, draft, prepared.evidencePacket, payload);
  const first = gate(candidate);
  if (first.ok) return { draft: candidate, source: "writer" as const, issues: [], rescueKinds: [] };

  // Narrow allowlist: safety/fact/structure errors never go through text repair.
  const allowed = /^(?:RAW_SAJU_LABEL_EXPLANATION_MISSING|EVERYDAY_SCENE_MISSING|CAREER_INTERNAL_MARKER|INTERNAL_MARKER)(?::|$)/;
  if (!first.errors.every(e => allowed.test(e.trim()))) return reject(first.errors);
  const rescueKinds: string[] = [];
  const replaceMarkers = (v: unknown, ref: unknown): unknown => {
    if (typeof v === "string") {
      if (internalMarker.test(v) && typeof ref === "string" && !internalMarker.test(ref)) {
        rescueKinds.push("CANONICAL_PRESENTATION"); return ref;
      }
      return v;
    }
    if (Array.isArray(v)) return v.map((item, i) => replaceMarkers(item, Array.isArray(ref) ? ref[i] : undefined));
    if (isRecord(v)) return Object.fromEntries(Object.entries(v).map(([key, item]) => [key, replaceMarkers(item, isRecord(ref) ? ref[key] : undefined)]));
    return v;
  };
  const rescued = replaceMarkers(candidate, fallback) as Record<string, unknown>;
  for (const error of first.errors) {
    const match = error.match(/^(RAW_SAJU_LABEL_EXPLANATION_MISSING|EVERYDAY_SCENE_MISSING):\s*([A-Za-z0-9_]+)/);
    if (!match) continue;
    for (const [list, idKey] of [["chapters", "chapterId"], ["longformReadings", "readingId"]] as const) {
      const rows = rescued[list], references = fallback[list];
      if (!Array.isArray(rows) || !Array.isArray(references)) continue;
      const index = rows.findIndex(row => isRecord(row) && row[idKey] === match[2]);
      const replacement = references.find(row => isRecord(row) && row[idKey] === match[2]);
      if (index >= 0 && replacement) { rows[index] = structuredClone(replacement); rescueKinds.push(match[1]); }
    }
  }
  const final = gate(rescued);
  return final.ok
    ? { draft: rescued, source: "rescue" as const, issues: deliveryIssueCodes(first.errors), rescueKinds: [...new Set(rescueKinds)] }
    : reject(first.errors);
}
