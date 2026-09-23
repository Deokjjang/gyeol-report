import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { AnnualFortuneReportView } from "../../../src/app/reports/[reportId]/AnnualFortuneReportView";
import { buildAnnualMonthRelationFacts, classifyAnnualMonthFacts, explainAnnualMonthFact, type AnnualMonthRelationFact } from "../../../src/lib/report-knowledge/annualMonthRelationFacts";
import { buildAnnualMonthlyFortunes, type AnnualFortuneEvidencePacket } from "../../../src/lib/report-knowledge/annualFortuneEvidence";
import { getAnnualBranchInteractions, getAnnualMonthGanjiInfo } from "../../../src/lib/report-knowledge/annualFortuneYearRules";
import type { EarthlyBranch } from "../../../src/lib/report-knowledge/annualFortuneTypes";
import { generateAnnualFortuneProductDraft } from "../../../src/lib/report-generation/annualFortuneGenerationHandler";
import { buildAnnualMonthlyPublication, annualMonthlyEvidenceMatches } from "../../../src/lib/report-generation/annualMonthlyPublication";
import { validateAnnualFortuneReportDraft } from "../../../src/lib/report-generation/annualFortuneReportDraftValidator";
import { validateProductPublication } from "../../../src/lib/report-generation/productPublishGate";
import { generateAnnualFortuneReportDraft } from "../../../src/lib/report-generation/openaiAnnualFortuneReportWriter";
import { buildOpenAIAnnualFortuneReportWriterMessages } from "../../../src/lib/report-generation/openaiAnnualFortuneReportWriterPrompt";
import type { SinglePersonGenerationInput } from "../../../src/lib/report-generation/reportInputAdapter";

const customers = [
  { name: "고객A", birthDate: "1996-12-06", birthTime: "14:15", gender: "MALE", mbtiType: "ENTJ" },
  { name: "고객B", birthDate: "1980-05-15", birthTime: "09:30", gender: "FEMALE", mbtiType: "ISFJ" },
  { name: "고객C", birthDate: "2001-08-20", birthTime: "16:20", gender: "MALE", mbtiType: "ENFP" },
] as const;
function inputFor(index = 0, mbti?: SinglePersonGenerationInput["person"]["mbtiType"], year = "2026"): SinglePersonGenerationInput {
  return {
    kind: "annualFortune", productKey: "annual_fortune", productSlug: "annual-fortune",
    person: { ...customers[index], ...(mbti === undefined ? {} : { mbtiType: mbti }),
      birthTimeUnknown: false, approximateBirthTimeSlot: "", calendarType: "solar", timezone: "Asia/Seoul" },
    userContext: { relationshipStatus: "single", jobStatus: "employee", detailJob: "서비스 기획자", focusAreas: ["직업", "돈"] },
    productOptions: { selectedYear: year },
  };
}
async function generate(index = 0, mbti?: SinglePersonGenerationInput["person"]["mbtiType"], year?: string) {
  const result = await generateAnnualFortuneProductDraft(inputFor(index, mbti, year), {
    writer: { enabled: false }, now: () => new Date("2026-09-23T00:00:00+09:00"),
  });
  expect(result.ok).toBe(true);
  if (!result.ok) throw new Error("local annual fixture failed");
  return result;
}
function facts(natalBranches: readonly EarthlyBranch[]) {
  return buildAnnualMonthRelationFacts({ monthGanji: getAnnualMonthGanjiInfo({ year: 2026, month: 11 }), natalBranches, missingElements: [], heavyElements: [] });
}
function render(result: Awaited<ReturnType<typeof generate>>) {
  return renderToStaticMarkup(createElement(AnnualFortuneReportView, { draft: result.draft, evidencePacket: result.evidencePacket }));
}
const clean = (html: string) => html.replace(/<[^>]+>/gu, " ").replace(/&[^;]+;/gu, " ").replace(/\s+/gu, " ").trim();

describe("annual monthly facts precede wording", () => {
  it.each([
    "합이 약하다", "합이 없다", "충이 없다", "뚜렷한 충·합·해가 없다", "보완이 약하다", "직접 보완 없음",
    "부족 오행 직접 보완 약함 / 과다 오행 자극 약함 / 뚜렷한 지지 충·합·해는 약함",
  ])("does not classify absence prose: %s", (plain) => {
    const actualFacts = facts(["巳"]); // 子/巳: no relation in the existing engine.
    const seed = { plain, relationFacts: actualFacts };
    expect(seed.relationFacts).toEqual([]);
    expect(classifyAnnualMonthFacts(seed.relationFacts)).toEqual({ status: "neutral", supportFactIds: [], frictionFactIds: [] });
    // Permanent reproduction of the old parser's error, not a production parser.
    if (plain.includes("뚜렷한 지지")) {
      expect(/충|해|형|파/u.test(plain)).toBe(true);
      expect(/보완|합|반합|삼합|육합/u.test(plain)).toBe(true);
    }
  });

  it("retains a clash without the word 충 and responds only to changed structured facts", () => {
    const clash = facts(["午"]);
    expect(clash).toEqual([expect.objectContaining({ source: "month_natal_branch", type: "충", participants: ["子", "午"] })]);
    const rewritten = clash.map(fact => ({ ...fact, plain: "일정과 반응이 서로 당기는 달입니다." }));
    expect(classifyAnnualMonthFacts(rewritten)).toEqual(classifyAnnualMonthFacts(clash));
    expect(classifyAnnualMonthFacts(rewritten).status).toBe("friction");
    const harmony = facts(["丑"]);
    expect(harmony[0]).toMatchObject({ type: "육합", participants: ["子", "丑"] });
    expect(classifyAnnualMonthFacts(harmony).status).toBe("supportive");
  });

  it("preserves mixed facts, merges repeated participants and never invents strength", () => {
    const actual = facts(["丑", "丑", "午"]);
    expect(actual.filter(f => f.type === "육합")).toEqual([expect.objectContaining({ affectedPillars: ["year", "month"] })]);
    expect(new Set(actual.map(f => f.id)).size).toBe(actual.length);
    const c = classifyAnnualMonthFacts(actual);
    expect(c.status).toBe("mixed");
    expect(c.supportFactIds.filter(id => c.frictionFactIds.includes(id))).toEqual([]);
    expect(JSON.stringify(actual)).not.toMatch(/strength|intensity|direction/);
  });

  it("preserves ten-gods and elements in a neutral month without inventing relations", () => {
    const neutral = buildAnnualMonthlyFortunes({ targetYear: 2026, dayMaster: "甲", missingElements: [], heavyElements: [], natalBranches: ["巳"] })[10];
    expect(neutral).toMatchObject({ ganji: "庚子", stemTenGod: "편관", branchTenGod: "정인", elements: ["metal", "water"], basis: "calendar_month_approximation", relationFacts: [], classification: { status: "neutral" } });
    expect(neutral.neutralObservations).toHaveLength(3);
    expect(neutral.interpretation).toContain("편관");
    expect(neutral.supportSignals).toEqual([]);
    expect(neutral.frictionSignals).toEqual([]);
  });

  it("derives missing/pressure effects from elements, separately from ten-god valence", () => {
    const monthGanji = getAnnualMonthGanjiInfo({ year: 2026, month: 11 }); // 庚子
    const actual = buildAnnualMonthRelationFacts({ monthGanji, natalBranches: ["巳"], missingElements: ["water"], heavyElements: ["metal"] });
    expect(actual).toHaveLength(2);
    expect(actual.map(f => f.type)).toEqual(["missing_element_present", "heavy_element_present"]);
    expect(classifyAnnualMonthFacts(actual).status).toBe("mixed");
    const generated = buildAnnualMonthRelationFacts({ monthGanji, natalBranches: ["巳"], missingElements: [], heavyElements: ["wood"] });
    expect(generated[0]).toMatchObject({ type: "heavy_element_generated", element: "wood", monthElements: ["water"] });
  });
});

describe("annual monthly publication and regression", () => {
  it("publishes and SSR renders 3 customers ×12 months with unique actual facts", async () => {
    const baselineChars = [12783, 12061, 12258];
    const totals = { support: 0, friction: 0, mixed: 0, neutral: 0 };
    const allFacts: string[] = [];
    for (let i = 0; i < customers.length; i++) {
      const r = await generate(i);
      expect(validateProductPublication("annual_fortune", r.draft, r.evidencePacket)).toEqual({ ok: true, errors: [] });
      expect(annualMonthlyEvidenceMatches(r.evidencePacket)).toBe(true);
      const text = clean(render(r));
      expect(text.length).toBeGreaterThanOrEqual(baselineChars[i] * 0.95);
      const sentences = r.draft.monthlyFlow.flatMap(m => [m.natalInteractionSummary ?? "", m.body, m.advice]
        .flatMap(text => text.split(/(?<=[.!?])\s+/u))).filter(text => text.length >= 40);
      expect(new Set(sentences).size).toBe(sentences.length);
      const months = r.evidencePacket.monthlyFortunes;
      expect(months).toHaveLength(12);
      allFacts.push(JSON.stringify(months.map(m => m.relationFacts)));
      const branches = Object.values(r.evidencePacket.baseSaju.pillars).map(p => p[1] as EarthlyBranch);
      for (const month of months) {
        const c = month.classification;
        totals.support += Number(c.supportFactIds.length > 0);
        totals.friction += Number(c.frictionFactIds.length > 0);
        totals.mixed += Number(c.status === "mixed"); totals.neutral += Number(c.status === "neutral");
        expect(c.supportFactIds.filter(id => c.frictionFactIds.includes(id))).toEqual([]);
        expect(month.supportSignals.filter(s => month.frictionSignals.includes(s))).toEqual([]);
        expect(new Set(month.relationFacts.map(f => f.id)).size).toBe(month.relationFacts.length);
        expect(month.ganji).toBe(getAnnualMonthGanjiInfo({ year: 2026, month: month.month }).ganji);
        const independentlyCalculated = getAnnualBranchInteractions({ annualBranch: month.branch, natalBranches: branches });
        const keys = (list: readonly { type: string; branches: readonly string[] }[]) => [...new Set(list.map(f => `${f.type}:${f.branches.join("")}`))].sort();
        const actualBranchFacts = month.relationFacts.flatMap(f => f.source === "month_natal_branch" ? [{ type: f.type, branches: f.participants }] : []);
        expect(keys(actualBranchFacts)).toEqual(keys(independentlyCalculated));
        const draftMonth = r.draft.monthlyFlow[month.month - 1];
        expect(draftMonth.body).toContain(month.ganji);
        expect(draftMonth.body).toContain(month.stemTenGod);
        expect(draftMonth.body).toContain(month.branchTenGod);
        expect([draftMonth.headline, draftMonth.body, draftMonth.natalInteractionSummary, draftMonth.advice].join(" ").length).toBeGreaterThan(180);
        expect(draftMonth.monthlyBasis).toBe("달력월 기준 운영 가이드");
      }
    }
    expect(new Set(allFacts).size).toBe(3);
    expect(totals).toEqual({ support: 30, friction: 36, mixed: 30, neutral: 0 });
    expect(vi.mocked(fetch)).not.toHaveBeenCalled();
  });

  it("keeps natal month facts unchanged for MBTI-only changes and recalculates the selected year", async () => {
    const a = await generate(); const b = await generate(0, "ISFJ"); const c = await generate(0, "ENTJ", "2025");
    expect(a.evidencePacket.monthlyFortunes).toEqual(b.evidencePacket.monthlyFortunes);
    expect(a.evidencePacket.mbtiBasis).not.toEqual(b.evidencePacket.mbtiBasis);
    expect(c.draft.targetYear).toBe(2025);
    expect(c.evidencePacket.monthlyFortunes.map(m => m.ganji)).toEqual(Array.from({ length: 12 }, (_, i) => getAnnualMonthGanjiInfo({ year: 2025, month: i + 1 }).ganji));
    expect(c.evidencePacket.monthlyFortunes.map(m => m.ganji)).not.toEqual(a.evidencePacket.monthlyFortunes.map(m => m.ganji));
    expect(validateProductPublication("annual_fortune", c.draft, c.evidencePacket).ok).toBe(true);
  });

  it("accepts persisted JSON with reordered object keys", async () => {
    const r = await generate();
    function reverseKeys(value: unknown): unknown {
      if (Array.isArray(value)) return value.map(reverseKeys);
      if (value !== null && typeof value === "object") return Object.fromEntries(Object.entries(value).reverse().map(([key, item]) => [key, reverseKeys(item)]));
      return value;
    }
    expect(validateProductPublication("annual_fortune", reverseKeys(r.draft), reverseKeys(r.evidencePacket)).ok).toBe(true);
  });

  it("rejects tampered fact type, IDs, classification, month ganji, selectedYear and duplicated facts", async () => {
    const r = await generate();
    const mutations = [
      (p: AnnualFortuneEvidencePacket) => ({ ...p, selectedYear: 2025 }),
      (p: AnnualFortuneEvidencePacket) => ({ ...p, monthlyFortunes: p.monthlyFortunes.map((m, i) => i ? m : { ...m, ganji: "甲子" }) }),
      (p: AnnualFortuneEvidencePacket) => ({ ...p, monthlyFortunes: p.monthlyFortunes.map((m, i) => i ? m : { ...m, classification: { ...m.classification, supportFactIds: m.classification.frictionFactIds } }) }),
      (p: AnnualFortuneEvidencePacket) => ({ ...p, monthlyFortunes: p.monthlyFortunes.map((m, i) => i ? m : { ...m, relationFacts: [...m.relationFacts, m.relationFacts[0]] }) }),
      (p: AnnualFortuneEvidencePacket) => ({ ...p, monthlyFortunes: p.monthlyFortunes.map((m, i) => i ? m : { ...m, relationFacts: m.relationFacts.map(f => ({ ...f, id: "invented" })) }) }),
      (p: AnnualFortuneEvidencePacket) => ({ ...p, monthlyFortunes: p.monthlyFortunes.map((m, i) => i ? m : { ...m, relationFacts: m.relationFacts.map(f => ({ ...f, type: "충" } as AnnualMonthRelationFact)) }) }),
    ];
    for (const mutate of mutations) expect(validateProductPublication("annual_fortune", r.draft, mutate(r.evidencePacket)).ok).toBe(false);
    expect(validateProductPublication("annual_fortune", { ...r.draft, targetYear: 2025 }, r.evidencePacket).ok).toBe(false);
  });

  it("renders each monthly fact once, not again as support and friction", async () => {
    const r = await generate(1);
    const html = clean(render(r));
    const months = r.evidencePacket.monthlyFortunes;
    const explanations = months.flatMap(m => m.relationFacts.map(explainAnnualMonthFact));
    for (const line of explanations) {
      const count = html.split(line).length - 1;
      // The same relation may legitimately recur in distinct months; no double rendering per month.
      expect(count).toBe(explanations.filter(s => s === line).length);
    }
  });

  it("sends facts and fact references, with one object per fact, rather than duplicate support/friction prose", async () => {
    const r = await generate();
    const messages = buildOpenAIAnnualFortuneReportWriterMessages({ evidencePacket: r.evidencePacket });
    const prompt = JSON.stringify(messages);
    expect(prompt).toContain("supportFactIds"); expect(prompt).toContain("neutralObservations");
    expect(prompt).toContain("monthlyPublication");
    const id = r.evidencePacket.monthlyFortunes[0].relationFacts[0].id;
    expect(prompt.split(`\\"id\\": \\"${id}\\"`).length - 1).toBe(1);
  });

  it("accepts a valid mock writer but rejects hallucinated, reversed and neutral-to-collision monthly copy", async () => {
    const r = await generate();
    const request = (draft: unknown, evidencePacket = r.evidencePacket) => generateAnnualFortuneReportDraft({
      evidencePacket, config: { enabled: true, apiKey: "test-only", model: "mock-model", fetchImpl: vi.fn(async () => new Response(JSON.stringify({ output_text: JSON.stringify(draft) }), { status: 200 })) },
    });
    const good = await request(r.draft);
    expect(good.draft.monthlyFlow).toEqual(r.draft.monthlyFlow);
    const invented = { ...r.draft, monthlyFlow: r.draft.monthlyFlow.map((m, i) => i ? m : { ...m, natalInteractionSummary: "없는 子午 충이 강하게 작용합니다." }) };
    await expect(request(invented)).rejects.toMatchObject({ code: "OPENAI_ANNUAL_FORTUNE_REPORT_WRITER_VALIDATION_FAILED" });
    const reverse = { ...r.draft, monthlyFlow: r.draft.monthlyFlow.map((m, i) => i ? m : { ...m, body: "마찰 작용은 전부 도움이며, 연결 작용은 강한 충돌입니다." }) };
    await expect(request(reverse)).rejects.toMatchObject({ code: "OPENAI_ANNUAL_FORTUNE_REPORT_WRITER_VALIDATION_FAILED" });
    // Diagnostic neutral fixture: no uncalculated branch/element relation is supplied.
    const baseSaju = { ...r.evidencePacket.baseSaju, pillars: { year: "乙巳", month: "丁巳", day: "丁巳" }, natalLabels: [] };
    const packet = { ...r.evidencePacket, baseSaju, monthlyFortunes: buildAnnualMonthlyFortunes({ targetYear: 2026, dayMaster: "丁", missingElements: [], heavyElements: [], natalBranches: ["巳", "巳", "巳"] }) };
    const neutralDraft = { ...r.draft, ...buildAnnualMonthlyPublication(packet) };
    expect(validateAnnualFortuneReportDraft(neutralDraft, packet).ok).toBe(true);
    const neutralCollision = { ...neutralDraft, monthlyFlow: neutralDraft.monthlyFlow.map((m, i) => i !== 10 ? m : { ...m, advice: "강한 충돌이 확실히 발생합니다." }) };
    await expect(request(neutralCollision, packet)).rejects.toMatchObject({ code: "OPENAI_ANNUAL_FORTUNE_REPORT_WRITER_VALIDATION_FAILED" });
    await expect(request({ ...r.draft, targetYear: 2025 })).rejects.toMatchObject({ code: "OPENAI_ANNUAL_FORTUNE_REPORT_WRITER_VALIDATION_FAILED" });
    expect(vi.mocked(fetch)).not.toHaveBeenCalled();
  });
});
