import { getAnnualGanjiInfo, getTenGodForStemPair } from "../report-knowledge/annualFortuneYearRules";
import { careerSignalMatches } from "../report-knowledge/careerEvidenceSelection";
import type { HeavenlyStem } from "../report-knowledge/annualFortuneTypes";

function record(v: unknown): v is Record<string, unknown> {
  return v !== null && typeof v === "object" && !Array.isArray(v);
}
function strings(v: unknown): string[] {
  return typeof v === "string" ? [v] : Array.isArray(v) ? v.flatMap(strings)
    : record(v) ? Object.values(v).flatMap(strings) : [];
}

// Deliberately limited to checkable facts; this is not a natural-language truth classifier.
export function validateCareerEvidenceClaims(draft: unknown, evidence: unknown): string[] {
  if (!record(draft) || !record(evidence) || !Array.isArray(evidence.natalLabels)) return ["CAREER_EVIDENCE_REQUIRED"];
  const labels = evidence.natalLabels.filter((v): v is string => typeof v === "string");
  const errors = new Set<string>();
  const text = strings(draft).join("\n");
  if (/\b(?:writer|fallback|placeholder|validator|candidate|internal|mock)\b/iu.test(text)) errors.add("CAREER_INTERNAL_MARKER");
  for (const claim of text.matchAll(/([목화토금수])(?:이|가|의)?\s*(과다|부족|없음)/gu)) {
    const term = `${claim[1]} ${claim[2] === "없음" ? "부족" : claim[2]}`;
    const elements: Record<string, string> = { 목: "wood", 화: "fire", 토: "earth", 금: "metal", 수: "water" };
    if (claim[2] === "없음" && (!record(evidence.elementCounts) || evidence.elementCounts[elements[claim[1]!]] !== 0)) errors.add(`CAREER_ELEMENT_ABSENCE:${claim[1]}`);
    if (!labels.includes(term)) errors.add(`CAREER_ELEMENT_CLAIM:${term}`);
  }
  for (const feature of ["현침", "역마", "문창", "도화", "홍염", "천을귀인", "월덕귀인", "천덕귀인", "화개"]) {
    if (text.includes(feature) && !careerSignalMatches(labels, feature)) errors.add(`CAREER_FEATURE_CLAIM:${feature}`);
  }
  const type = typeof evidence.mbtiType === "string" ? evidence.mbtiType : null;
  for (const match of text.matchAll(/\b[IE][NS][TF][JP]\b/gu)) {
    if (match[0] !== type) errors.add("CAREER_MBTI_CLAIM");
  }
  const { careerTiming: _timing, ...natalDraft } = draft;
  void _timing;
  const natalText = strings(natalDraft).join("\n");
  const groups: Record<string, string[]> = { 재성: ["정재", "편재"], 관성: ["정관", "편관"], 식상: ["식신", "상관"], 인성: ["정인", "편인"], 비겁: ["비견", "겁재"] };
  for (const term of ["정재", "편재", "정관", "편관", "식신", "상관", "정인", "편인", "비견", "겁재", ...Object.keys(groups)]) {
    if (new RegExp(`(?<!무)${term}(?:의|이|가|은|는| 흐름| 신호)`, "u").test(natalText) &&
      ![term, ...(groups[term] ?? [])].some((s) => careerSignalMatches(labels, s))) errors.add(`CAREER_TEN_GOD_CLAIM:${term}`);
  }
  // A present ten-god is not automatically strong; strength wording needs its exact label.
  for (const match of text.matchAll(/(재성|관성|식상|인성|비겁)(?:이|가|은|는)?\s*(강|과다)/gu)) {
    if (!labels.some((l) => l.startsWith(`${match[1]} 강`) || l.startsWith(`${match[1]} 과다`))) errors.add(`CAREER_STRENGTH_CLAIM:${match[1]}`);
  }
  const hints = Array.isArray(evidence.timingHints) ? evidence.timingHints.filter(record) : [];
  const timings = Array.isArray(draft.careerTiming) ? draft.careerTiming.filter(record) : [];
  const expected = hints.map((h) => h.yearBasis).filter(record);
  if (expected.length !== 5 || timings.length !== expected.length ||
    new Set(timings.map((t) => t.year)).size !== expected.length) errors.add("CAREER_TIMING_RANGE");
  for (const timing of timings) {
    const basis = expected.find((b) => b.year === timing.year);
    if (!basis || typeof basis.year !== "number" || !Number.isInteger(basis.year) ||
      typeof evidence.dayMaster !== "string" || !/^[甲乙丙丁戊己庚辛壬癸]$/u.test(evidence.dayMaster)) {
      errors.add("CAREER_TIMING_BASIS"); continue;
    }
    const ganji = getAnnualGanjiInfo(basis.year);
    const god = getTenGodForStemPair(evidence.dayMaster as HeavenlyStem, ganji.stem);
    if (basis.ganji !== ganji.ganji || basis.tenGod !== god) errors.add("CAREER_TIMING_BASIS");
    const body = strings(timing).join(" ");
    // The year-specific explanation must actually retain the calculated basis.
    if (!body.includes(ganji.ganji) || !body.includes(god)) errors.add("CAREER_TIMING_CLAIM");
    for (const match of body.matchAll(/(\d{4})년?\s*([甲乙丙丁戊己庚辛壬癸][子丑寅卯辰巳午未申酉戌亥])/gu)) {
      if (Number(match[1]) !== basis.year || match[2] !== ganji.ganji) errors.add("CAREER_TIMING_CLAIM");
    }
  }
  return [...errors];
}
