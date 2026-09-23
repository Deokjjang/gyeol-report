import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { generateProductReport } from "../../../src/lib/report-generation/generateProductReport";
import { validateProductPublication } from "../../../src/lib/report-generation/productPublishGate";
import type { ComprehensiveReportV2Draft } from "../../../src/lib/report-generation/comprehensiveReportDraftTypes";
import type { ComprehensiveReportEvidencePacket } from "../../../src/lib/report-knowledge/comprehensiveReportEvidenceTypes";
import { ComprehensiveReportV2View } from "../../../src/app/reports/[reportId]/ComprehensiveReportV2View";
import { buildOpenAIComprehensiveReportWriterMessages } from "../../../src/lib/report-generation/openaiReportWriterPrompt";
import { comprehensiveFeaturePerspectives } from "../../../src/lib/report-generation/comprehensiveFeaturePerspectives";
import * as writer from "../../../src/lib/report-generation/openaiComprehensiveReportWriter";
const customers = [
    { name: "가람", birthDate: "1996-12-06", birthTime: "14:15", gender: "MALE", mbtiType: "INTP", beforeChars: 17223 },
    { name: "나래", birthDate: "1980-03-09", birthTime: "13:30", gender: "FEMALE", mbtiType: "ENTP", beforeChars: 16060 },
    { name: "지민", birthDate: "2001-06-22", birthTime: "13:30", gender: "MALE", mbtiType: "ISFJ", beforeChars: 15195 },
    { name: "서진", birthDate: "1999-07-31", birthTime: "13:30", gender: "MALE", mbtiType: "ENTJ", beforeChars: 17366 },
    { name: "수연", birthDate: "1988-10-17", birthTime: "08:30", gender: "FEMALE", mbtiType: "", beforeChars: 12848 },
];
function payload(person = customers[0]) {
    return { productKey: "saju_mbti_full", productSlug: "saju-mbti-full", person: { ...person, birthTimeUnknown: false, approximateBirthTimeSlot: "" },
        userContext: { relationshipStatus: "single", jobStatus: "employee", detailJob: "기획", focusAreas: [] }, productOptions: {} };
}
const textOf = (html: string) => html.replace(/<[^>]+>/g, " ").replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
async function report(person = customers[0]) {
    const p = payload(person);
    const result = await generateProductReport(p, { enabled: false, reason: "flag_disabled" }, "deterministic_fallback");
    expect(result.ok, result.ok ? "" : result.error.message).toBe(true);
    if (!result.ok)
        throw new Error("local report failed");
    expect(result.externalCalls).toEqual([]);
    const draft = result.draft as ComprehensiveReportV2Draft;
    const evidence = result.evidencePacket as ComprehensiveReportEvidencePacket;
    expect(validateProductPublication("saju_mbti_full", draft, evidence, p)).toEqual({ ok: true, errors: [] });
    const html = renderToStaticMarkup(createElement(ComprehensiveReportV2View, { draft, evidencePacket: evidence }));
    return { draft, evidence, html, text: textOf(html) };
}
beforeEach(() => { vi.useFakeTimers(); vi.setSystemTime(new Date("2026-09-23T03:00:00Z")); });
afterEach(() => { expect(fetch).not.toHaveBeenCalled(); vi.restoreAllMocks(); vi.useRealTimers(); });
describe("comprehensive personal narrative", () => {
    it.each(customers)("$name: factual themes, owned scenes, publication and actual SSR retain volume", async (person) => {
        const r = await report(person), plan = r.evidence.narrativePlan!;
        expect(plan.themes.length).toBeGreaterThanOrEqual(2);
        expect(plan.themes.length).toBeLessThanOrEqual(4);
        expect(plan.sections).toHaveLength(10);
        expect(r.text.length).toBeGreaterThanOrEqual(person.beforeChars * 0.95);
        expect(r.html.indexOf('id="report-core"')).toBeLessThan(r.html.indexOf('id="report-foundation"'));
        expect(r.text).toContain("나의 만세력");
        expect(r.draft.profileTable.fourPillarGrid).toHaveLength(4);
        for (const theme of plan.themes) {
            expect(theme.sajuEvidenceIds.length).toBeGreaterThan(0);
            if (theme.interactionId) {
                const scene = r.evidence.sajuMbtiBridgeEvidence!.find(s => s.interaction?.interactionId === theme.interactionId)!;
                expect(theme.mbtiEvidenceIds).toEqual(scene.interaction!.mbtiEvidenceIds);
                expect(theme.sajuEvidenceIds).toEqual(scene.interaction!.myeongliEvidenceIds);
            }
            else
                expect(theme.mbtiEvidenceIds).toEqual([]);
        }
        for (const scene of r.evidence.sajuMbtiBridgeEvidence ?? []) {
            expect(plan.sections.filter(s => s.interactionIds.includes(scene.interaction!.interactionId))).toHaveLength(1);
            expect(r.text.split(scene.sceneSeed).length - 1, scene.sceneSeed).toBe(1);
        }
        for (const perspective of Object.values(comprehensiveFeaturePerspectives)) {
            expect(r.text.split(perspective).length - 1).toBeLessThanOrEqual(1);
        }
        const sentences = r.text.split(/[.!?]\s*/u).map(s => s.trim()).filter(s => s.length >= 40);
        expect(new Set(sentences).size).toBeGreaterThan(120);
        expect(r.text).not.toMatch(/처음에는 판단 속도와 책임감이 같이|수익화 감각이 빠른 사람일수록|반복 압박|placeholder|writer|fallback/iu);
        expect(r.text).not.toMatch(/현실화이|현실화을|감정 절제이|감정 절제을|유연한 속도이|유연한 속도을|갑목는|신금는/);
        if (!person.mbtiType) {
            expect(r.evidence.mbtiBasis).toBeUndefined();
            expect(plan.themes.every(t => t.mbtiEvidenceIds.length === 0 && !t.interactionId)).toBe(true);
            expect(r.text).not.toMatch(/\b[IE][NS][TF][JP]\b/);
        }
    });
    it("five different customers have different decisions, agreement and tension are real matches", async () => {
        const reports = await Promise.all(customers.map(report));
        expect(new Set(reports.map(r => r.draft.finalAdvice)).size).toBe(5);
        expect(new Set(reports.map(r => JSON.stringify(r.evidence.narrativePlan!.themes))).size).toBe(5);
        expect(reports[0].evidence.sajuMbtiBridgeEvidence!.some(s => s.interaction?.interactionType === "agreement")).toBe(true);
        expect(reports[1].evidence.sajuMbtiBridgeEvidence!.some(s => s.interaction?.interactionType === "tension")).toBe(true);
        const all = reports.map(r => new Set(r.draft.longformReadings!.map(x => x.body)));
        expect([...all[0]].filter(s => all.slice(1).every(a => a.has(s)))).toEqual([]);
    });
    it("MBTI counterfactual preserves computed Saju; natal counterfactual preserves MBTI source", async () => {
        const original = await report();
        const changeType = await report({ ...customers[0], mbtiType: "ENTJ" });
        expect(changeType.evidence.bridgeFactIds).toEqual(original.evidence.bridgeFactIds);
        expect({ ...changeType.draft.profileTable, mbti: "" }).toEqual({ ...original.draft.profileTable, mbti: "" });
        expect(changeType.evidence.narrativePlan!.themes).not.toEqual(original.evidence.narrativePlan!.themes);
        const changeNatal = await report({ ...customers[1], mbtiType: "INTP" });
        expect(changeNatal.evidence.mbtiBasis!.traitAreas).toEqual(original.evidence.mbtiBasis!.traitAreas);
        expect(changeNatal.evidence.mbtiBasis!.functionStack).toEqual(original.evidence.mbtiBasis!.functionStack);
        expect(changeNatal.evidence.bridgeFactIds).not.toEqual(original.evidence.bridgeFactIds);
        expect(changeNatal.evidence.narrativePlan!.themes).not.toEqual(original.evidence.narrativePlan!.themes);
    });
    it.each(["foreign_fact", "foreign_mbti", "wrong_interaction", "duplicate_scene", "duplicate_section"])("publish rejects %s in the selection proof", async (mutation) => {
        const r = await report();
        const e = JSON.parse(JSON.stringify(r.evidence));
        if (mutation === "foreign_fact")
            e.narrativePlan.themes[0].sajuEvidenceIds = ["not_a_customer_fact"];
        if (mutation === "foreign_mbti")
            e.narrativePlan.sections[0].mbtiTraitIds = ["mbti:ENTJ:traits:career:fake"];
        if (mutation === "wrong_interaction")
            e.narrativePlan.themes[0].interactionId = "foreign_interaction";
        if (mutation === "duplicate_scene")
            e.narrativePlan.sections[0].interactionIds.push(e.sajuMbtiBridgeEvidence[0].interaction.interactionId);
        if (mutation === "duplicate_section")
            e.narrativePlan.sections[1].readingId = e.narrativePlan.sections[0].readingId;
        expect(validateProductPublication("saju_mbti_full", r.draft, e).ok).toBe(false);
    });
    it("an absent 食神 alone does not mean no output when 傷官 exists", async () => {
        const r = await report(customers[1]);
        expect(r.evidence.bridgeFactIds).toContain("ten_god_shang_guan");
        expect(r.evidence.bridgeFactIds).not.toContain("ten_god_shi_shen");
        expect(r.evidence.bridgeFactIds).not.toContain("structure_no_output");
        expect(r.text).not.toContain("無食傷");
        expect(r.text).not.toContain("무식상");
    });
    it("an absent 正印 alone does not mean no resource when 偏印 exists", async () => {
        const r = await report(customers[3]);
        expect(r.evidence.bridgeFactIds).toContain("ten_god_pian_yin");
        expect(r.evidence.bridgeFactIds).not.toContain("ten_god_zheng_yin");
        expect(r.evidence.bridgeFactIds).not.toContain("structure_no_resource");
        expect(r.text).not.toContain("무인성");
    });
    it("writer receives the same selected theme/section basis as fallback; valid prose is not replaced", async () => {
        const r = await report();
        const { productVersion, ...draft } = r.draft as ComprehensiveReportV2Draft & {
            productVersion: string;
        };
        expect(productVersion).toBe("v2");
        const spy = vi.spyOn(writer, "generateComprehensiveReportDraft").mockResolvedValue({ draft, rawText: "", warnings: [] });
        const result = await generateProductReport(payload(), { enabled: true, config: { enabled: true, apiKey: "mock-only", model: "mock" } }, "normal_writer");
        expect(result.ok, result.ok ? "" : result.error.message).toBe(true);
        expect(spy).toHaveBeenCalledOnce();
        expect(spy.mock.calls[0][0].evidencePacket.narrativePlan).toEqual(r.evidence.narrativePlan);
        if (result.ok)
            expect((result.draft as ComprehensiveReportV2Draft).longformReadings).toEqual(r.draft.longformReadings);
        const prompt = buildOpenAIComprehensiveReportWriterMessages({ mbtiType: "INTP", evidencePacket: r.evidence });
        expect(JSON.stringify(prompt)).toContain("sectionSelectedEvidence");
        expect(JSON.stringify(prompt)).not.toContain("이런 연결 문장을 최소 4개 이상");
    });
});
