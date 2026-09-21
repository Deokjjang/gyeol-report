import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { calculateSaju } from "../../../src/lib/saju/calculateSaju";
import { buildCareerReportEvidence } from "../../../src/lib/report-knowledge/careerReportEvidence";
import { careerSignalMatches, selectCareerMbti } from "../../../src/lib/report-knowledge/careerEvidenceSelection";
import { MBTI_SOURCE_TYPES, getMbtiSourceProfile } from "../../../src/lib/report-knowledge/mbti/sourceRuntimeAdapter";
import { getAnnualGanjiInfo, getTenGodForStemPair } from "../../../src/lib/report-knowledge/annualFortuneYearRules";
import { generateCareerMoneyStudyProductDraft } from "../../../src/lib/report-generation/careerMoneyStudyGenerationHandler";
import { buildCareerReportScreenQaFallbackDraft } from "../../../src/lib/report-generation/careerReportDraftTypes";
import { validateCareerReportDraft } from "../../../src/lib/report-generation/careerReportDraftValidator";
import { validateProductPublication } from "../../../src/lib/report-generation/productPublishGate";
import { generateProductReport } from "../../../src/lib/report-generation/generateProductReport";
import { buildOpenAICareerReportWriterMessages } from "../../../src/lib/report-generation/openaiCareerReportWriterPrompt";
import { CareerReportView } from "../../../src/app/reports/[reportId]/CareerReportView";
import type { SinglePersonGenerationInput } from "../../../src/lib/report-generation/reportInputAdapter";

const now = new Date("2026-09-22T03:00:00Z");
const customers = [
  { birthDate: "1980-05-09", birthTime: "09:30", mbtiType: "ENFP" },
  { birthDate: "2001-06-22", birthTime: "13:30", mbtiType: "ENTJ" },
  { birthDate: "1999-07-31", birthTime: "13:30", mbtiType: "ISTJ" },
  { birthDate: "1996-12-06", birthTime: "13:30", mbtiType: "INTP" },
  { birthDate: "1992-05-21", birthTime: "13:30", mbtiType: "ISFJ" },
  { birthDate: "1998-03-14", birthTime: "13:30", mbtiType: "" },
] as const;
function input(person: { birthDate: string; birthTime: string; mbtiType: SinglePersonGenerationInput["person"]["mbtiType"] } = customers[0]): SinglePersonGenerationInput {
  return { kind: "careerMoneyStudy", productKey: "career_money_study", productSlug: "career-money-study",
    person: { name: "고객", ...person, birthTimeUnknown: false, approximateBirthTimeSlot: "", gender: "FEMALE", calendarType: "solar", timezone: "Asia/Seoul" },
    userContext: { relationshipStatus: "single", jobStatus: "employee", detailJob: "운영", focusAreas: [] }, productOptions: {} };
}
async function generate(person = input(), referenceDate = now) {
  const r = await generateCareerMoneyStudyProductDraft(person, { now: () => referenceDate });
  expect(r.ok, JSON.stringify(r)).toBe(true);
  if (!r.ok) throw new Error("local career generation failed");
  return r;
}
const marker = /\b(?:writer|fallback|placeholder|validator|candidate|internal|mock)\b|지원 범위 밖/iu;
beforeEach(() => { vi.useFakeTimers(); vi.setSystemTime(now); });
afterEach(() => { expect(fetch).not.toHaveBeenCalled(); vi.useRealTimers(); });

describe("career claim-level correctness", () => {
  it("permanent P0 regression: zero visible earth cannot justify earth excess", async () => {
    const s = calculateSaju({ ...customers[0], birthTimeUnknown: false, calendarType: "SOLAR", gender: "FEMALE", timezone: "Asia/Seoul" });
    expect(s.elements.visible).toEqual({ WOOD: 1, FIRE: 3, EARTH: 0, METAL: 3, WATER: 1 });
    const r = await generate();
    expect(r.evidencePacket.myeongliCareerBasis.heavyElements).not.toContain("earth");
    expect(JSON.stringify(r.draft)).not.toContain("토 과다");
    const bad = { ...r.draft, openingSummary: "토 과다와 재성은 관리, 비용, 프로세스에 유리합니다." };
    expect(validateCareerReportDraft(bad, r.evidencePacket).errors).toContain("CAREER_ELEMENT_CLAIM:토 과다");
    expect(validateProductPublication("career_money_study", bad, r.evidencePacket).ok).toBe(false);
  });
  it("only actual excess supports an excess statement", async () => {
    const r = await generate(input(customers[1]));
    expect(r.evidencePacket.myeongliCareerBasis.heavyElements).toContain("earth");
    expect(JSON.stringify(r.draft)).toContain("토 과다");
    expect(validateCareerReportDraft(r.draft, r.evidencePacket).ok).toBe(true);
  });
  it.each(customers)("$birthDate / $mbtiType fallback → gate → SSR", async (person) => {
    const r = await generate(input(person));
    expect(validateProductPublication("career_money_study", r.draft, r.evidencePacket)).toEqual({ ok: true, errors: [] });
    const html = renderToStaticMarkup(createElement(CareerReportView, { draft: r.draft, evidencePacket: r.evidencePacket }));
    expect(html).not.toMatch(marker);
    expect(html).toContain("운영");
    expect(r.draft.userContextSummary.contextNote).toContain("직업명만으로 세부 업무를 확정하지 않습니다");
    expect(r.evidencePacket.recommendedJobs.every((j) => j.evidenceIds?.length)).toBe(true);
    for (const job of r.evidencePacket.recommendedJobs) {
      for (const id of job.evidenceIds ?? []) if (id.startsWith("natal:")) {
        expect(careerSignalMatches(r.evidencePacket.natalLabels, id.slice(6))).toBe(true);
      }
    }
    for (const hint of r.evidencePacket.timingHints) {
      const basis = hint.yearBasis!;
      const ganji = getAnnualGanjiInfo(basis.year);
      expect(basis.ganji).toBe(ganji.ganji);
      expect(basis.tenGod).toBe(getTenGodForStemPair(r.evidencePacket.dayMaster, ganji.stem));
      expect(hint.plain).toContain(basis.tenGod);
    }
  });
  it.each([...MBTI_SOURCE_TYPES, ""] as const)("all source areas, jobs and avoidance remain usable for '%s'", async (type) => {
    const r = await generate(input({ ...customers[0], mbtiType: type }));
    const text = JSON.stringify(r.draft);
    expect(text).not.toMatch(marker);
    expect(validateProductPublication("career_money_study", r.draft, r.evidencePacket).ok).toBe(true);
    expect(r.evidencePacket.mbtiCareerBasis.type).toBe(type || null);
    const source = getMbtiSourceProfile(type);
    if (!source) {
      expect(text).not.toMatch(/\b[IE][NS][TF][JP]\b/u);
      expect(r.evidencePacket.mbtiSourceSelection?.traitIds.money).toEqual([]);
      return;
    }
    const selection = selectCareerMbti(type, r.evidencePacket.natalLabels);
    for (const area of ["career", "workplace", "money", "investment", "study"] as const) {
      expect(r.evidencePacket.mbtiSourceSelection?.traitIds[area]?.length).toBeGreaterThan(0);
      expect(text).toContain(selection[area][0]!.plainKo);
    }
    expect(r.evidencePacket.mbtiSourceSelection?.reportUseCases).toEqual(source.reportUseCases?.careerReport);
    expect(r.evidencePacket.recommendedJobs.some((j) => j.evidenceIds?.some((id) => id.startsWith(`mbti:${type}:recommendedJobs:`)))).toBe(true);
    expect(r.evidencePacket.workRiskWarnings.some((j) => j.evidenceIds?.some((id) => id.startsWith(`mbti:${type}:avoidJobsOrEnvironments:`)))).toBe(true);
    expect(r.draft.investmentAndSavingStyle.forbiddenNote).toContain("금융 자문이 아닙니다");
  });
  it("negative labels do not become positive resource/expression evidence", () => {
    const e = buildCareerReportEvidence({ referenceDate: now, person: {
      label: "검증", pillars: { year: "庚申", month: "辛巳", day: "壬午", hour: "乙巳" },
      labels: ["무인성", "무식상", "토 부족"], mbti: null, userContext: { lifeStatus: "other", fieldLabel: null },
    } });
    expect(e.myeongliCareerBasis.tenGodFocus).not.toEqual(expect.arrayContaining(["정인", "식신"]));
    expect(e.combinedCareerProfile.workStyleArchetypes).not.toContain("specialist_researcher");
    expect(e.combinedCareerProfile.workStyleArchetypes).not.toContain("creator_expression");
    const d = buildCareerReportScreenQaFallbackDraft(e);
    expect(JSON.stringify(d)).not.toMatch(marker);
    expect(validateCareerReportDraft(d, e).ok).toBe(true);
  });
  it.each(["정인", "식신", "비견"])("sparse %s fallback never appends screen-QA writer copy", (signal) => {
    const e = buildCareerReportEvidence({ referenceDate: now, person: {
      label: "검증", pillars: { year: "庚申", month: "辛巳", day: "壬午", hour: "乙巳" },
      labels: [signal], mbti: "ISFJ", userContext: { lifeStatus: "other", fieldLabel: null },
    } });
    const d = buildCareerReportScreenQaFallbackDraft(e);
    expect(JSON.stringify(d)).not.toMatch(marker);
    expect(validateCareerReportDraft(d, e).ok).toBe(true);
    expect(d.recommendedJobs.map((j) => j.title)).toEqual(e.recommendedJobs.map((j) => j.title));
  });
  it("rejects impossible feature, type, strength and year claims before publishing", async () => {
    const r = await generate();
    const noFeatures = { ...r.evidencePacket, natalLabels: ["토 부족"] };
    for (const line of ["현침의 정밀성", "ISFJ의 직업", "재성이 강합니다", "정재의 관리 감각", "writer 검수"]) {
      expect(validateCareerReportDraft({ ...r.draft, openingSummary: line }, noFeatures).ok).toBe(false);
    }
    const wrongYear = { ...r.draft, careerTiming: r.draft.careerTiming.map((t, i) => i ? t : { ...t, year: 2039 }) };
    expect(validateCareerReportDraft(wrongYear, r.evidencePacket).ok).toBe(false);
    const wrongGanji = { ...r.draft, careerTiming: r.draft.careerTiming.map((t, i) => i ? t : { ...t, body: "2026년 甲子는 사업 성공을 뜻합니다." }) };
    expect(validateCareerReportDraft(wrongGanji, r.evidencePacket).ok).toBe(false);
  });
  it("MBTI counterfactual changes behavior sources, not natal facts or annual calculations", async () => {
    const a = await generate(), b = await generate(input({ ...customers[0], mbtiType: "ISFJ" }));
    expect(a.evidencePacket.userPillars).toEqual(b.evidencePacket.userPillars);
    expect(a.evidencePacket.myeongliCareerBasis).toEqual(b.evidencePacket.myeongliCareerBasis);
    expect(a.evidencePacket.timingHints).toEqual(b.evidencePacket.timingHints);
    expect(a.evidencePacket.recommendedJobs).not.toEqual(b.evidencePacket.recommendedJobs);
    expect(a.evidencePacket.studyCertificateStrategy).not.toEqual(b.evidencePacket.studyCertificateStrategy);
  });
  it("element and ten-god counterfactuals only admit claims supported by the changed labels", () => {
    const person = { label: "비교", pillars: { year: "庚申", month: "辛巳", day: "壬午", hour: "乙巳" }, mbti: null,
      userContext: { lifeStatus: "other" as const, fieldLabel: null } };
    const e = (labels: string[]) => buildCareerReportEvidence({ person: { ...person, labels }, referenceDate: now });
    const a = e(["토 부족", "정재"]), b = e(["토 과다", "정재"]);
    expect(JSON.stringify(buildCareerReportScreenQaFallbackDraft(a))).not.toContain("토 과다");
    expect(JSON.stringify(buildCareerReportScreenQaFallbackDraft(b))).toContain("토 과다");
    expect(a.timingHints).toEqual(b.timingHints);
    expect(a.mbtiCareerBasis).toEqual(b.mbtiCareerBasis);
    const weak = e(["비견"]), wealth = e(["정재", "편재"]), officer = e(["정관", "편관"]);
    expect(wealth.recommendedJobs.some((j) => j.role === "자원·거래 조율")).toBe(true);
    expect(officer.recommendedJobs.some((j) => j.role === "운영·책임 관리")).toBe(true);
    expect(weak.recommendedJobs.some((j) => j.evidenceIds?.includes("natal:정재"))).toBe(false);
    expect(wealth.recommendedJobs).not.toEqual(officer.recommendedJobs);
  });
  it("KST year rollover changes only timing; overlapping years retain the same facts", async () => {
    const a = await generate(input(), new Date("2026-12-31T14:59:59Z"));
    const b = await generate(input(), new Date("2026-12-31T15:00:00Z"));
    expect(a.draft.careerTiming.map((t) => t.year)).toEqual([2026, 2027, 2028, 2029, 2030]);
    expect(b.draft.careerTiming.map((t) => t.year)).toEqual([2027, 2028, 2029, 2030, 2031]);
    const { timingHints: at, ...arest } = a.evidencePacket, { timingHints: bt, ...brest } = b.evidencePacket;
    expect(arest).toEqual(brest);
    expect(at.slice(1)).toEqual(bt.slice(0, 4));
  });
  it("2028 has different customer-relative meanings, not a shared monetization theme", async () => {
    const rows = await Promise.all(customers.map((c) => generate(input(c))));
    const hints = rows.map((r) => r.evidencePacket.timingHints.find((h) => h.yearBasis?.year === 2028)!);
    expect(new Set(hints.map((h) => h.yearBasis?.tenGod)).size).toBeGreaterThan(2);
    expect(new Set(hints.map((h) => h.title)).size).toBeGreaterThan(2);
    expect(hints.every((h) => h.title.includes("외부 프로젝트·수익화"))).toBe(false);
  });
  it("malformed/contradictory writer is rejected; deterministic fallback still passes the same gate", async () => {
    const local = await generate();
    for (const output of ["{broken", JSON.stringify({ ...local.draft, openingSummary: "토 과다와 재성은 관리에 유리합니다." })]) {
      const mockFetch = vi.fn<typeof fetch>().mockResolvedValue(new Response(JSON.stringify({ output_text: output }), { status: 200 }));
      const r = await generateCareerMoneyStudyProductDraft(input(), { now: () => now, writer: { enabled: true, config: { enabled: true, apiKey: "sk-test", model: "mock-model", fetchImpl: mockFetch } } });
      expect(r.ok).toBe(false);
      expect(mockFetch).toHaveBeenCalledTimes(1);
    }
    const { kind: _kind, ...payload } = input(); void _kind;
    const r = await generateProductReport(payload, { enabled: false, reason: "flag_disabled" }, "deterministic_fallback");
    expect(r.ok, JSON.stringify(r)).toBe(true);
    expect(r.externalCalls).toEqual([]);
  });
  it("correct writer prose keeps meaning and selected source payload omits raw trait duplicates", async () => {
    const local = await generate();
    const draft = { ...local.draft, openingSummary: "거래의 범위와 보상 기준을 따로 살펴보세요." };
    const mockFetch = vi.fn<typeof fetch>().mockResolvedValue(new Response(JSON.stringify({ output_text: JSON.stringify(draft) }), { status: 200 }));
    const r = await generateCareerMoneyStudyProductDraft(input(), { now: () => now, writer: { enabled: true, config: { enabled: true, apiKey: "sk-test", model: "mock-model", fetchImpl: mockFetch } } });
    expect(r.ok && r.draft.openingSummary).toBe(draft.openingSummary);
    const prompt = buildOpenAICareerReportWriterMessages({ evidencePacket: local.evidencePacket });
    expect(prompt.user).not.toContain('"source":');
    expect(prompt.user).toContain('"evidenceId":');
    expect(prompt.user).toContain('"mbtiSourceSelection":');
  });
});
