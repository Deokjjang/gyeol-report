import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync, writeFileSync } from "node:fs";
import { describe, expect, it, vi } from "vitest";
import { createAnnualV3, validateAnnualV3 } from "../../../src/lib/report-generation/annualV3Generation";
import { annualV3CustomerText, buildAnnualV3, annualTime } from "../../../src/lib/interpretation-v3/annualEditorial";
import { annualThemes } from "../../../src/lib/interpretation-v3/annualEditorialCopy";
import { ANNUAL_V3_FIXTURES, annualFixturePayload } from "../../../src/lib/interpretation-v3/annualFixtures";
import { validateNewProductPublication } from "../../../src/lib/report-generation/productPublishGate";
import { AnnualFortuneReportV3View } from "../../../src/app/reports/[reportId]/AnnualFortuneReportV3View";
import { createProductPreviewSnapshot, isProductPreviewSnapshot } from "../../../src/lib/report-generation/productPreviewSnapshot";
import { generateProductReport } from "../../../src/lib/report-generation/generateProductReport";
import { generateAnnualFortuneProductDraft } from "../../../src/lib/report-generation/annualFortuneGenerationHandler";
import { normalizeReportInputPayload } from "../../../src/lib/report-generation/reportInputAdapter";
import { extendAnnualMonthEvidence, annualSegmentAt } from "../../../src/lib/report-knowledge/annualMonthExtendedEvidence";
import { getAnnualJieBoundaries } from "../../../src/lib/report-knowledge/annualMonthJie";
import { formatDayunKst } from "../../../src/lib/saju/customerDayun";
import { SHINSAL_RULES } from "../../../src/lib/saju/shinsalConstants";
import { detectShinsal } from "../../../src/lib/saju/shinsal";
import type { AnnualFortuneReportDraft } from "../../../src/lib/report-generation/annualFortuneReportDraftTypes";
import { createAnnualCommerceAcceptance } from "../../../src/lib/payment/annualPurchasePolicy";
import type { HeavenlyStem, EarthlyBranch } from "../../../src/lib/saju/types";

const now = new Date("2026-09-29T13:00:00+09:00");
const generate = (input: unknown = annualFixturePayload()) => createAnnualV3(input, { now: () => now });
const copy = (html: string) => html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");

describe("Annual V3 generation, publication and reading", () => {
  it("does not serialize backend evidence IDs as React Flight keys", () => {
    const source = readFileSync("src/app/reports/[reportId]/AnnualFortuneReportV3View.tsx", "utf8");
    expect(source).not.toMatch(/key=\{(?:f|fact|feature|relation)\.id\}/);
  });
  it.each(ANNUAL_V3_FIXTURES)("$id: 12 substantive months, publication, snapshot and SSR", async ({ id, input }) => {
    const result = await generate(input); expect(result).not.toBeNull(); if (!result) return;
    const { draft, evidencePacket } = result;
    expect(validateNewProductPublication("annual_fortune", draft, evidencePacket, input), annualV3CustomerText(draft).match(/.{0,40}(?:evidenceId|sourceRefs|unsupported|backend|debug|metal|water|\d+\s*점|[SABC][+-]?\s*등급|겁재은|정재은|결과이(?:\s|[,.])).{0,40}/giu)?.join("\n")).toEqual({ ok: true, errors: [] });
    const snapshot = createProductPreviewSnapshot({ reportId: `annual-v3-${id}`, createdAtIso: now.toISOString(), productKey: "annual_fortune", productSlug: "annual-fortune", ...result });
    expect(snapshot.ok).toBe(true);
    if (snapshot.ok) expect(isProductPreviewSnapshot(JSON.parse(JSON.stringify(snapshot.value)))).toBe(true);
    expect(draft.editorialMonths).toHaveLength(12);
    expect(draft.editorialMonths.every(m => m.paragraphs.length >= 4)).toBe(true);
    expect(draft.editorialMonths.find(m => m.month === 9)?.paragraphs.length).toBeGreaterThanOrEqual(6);
    expect(draft.focusMonths.length).toBeGreaterThanOrEqual(3); expect(draft.focusMonths.length).toBeLessThanOrEqual(5);
    expect(draft.finale.length).toBeGreaterThanOrEqual(4);
    expect(draft.inputSummary).toContainEqual({ label: input.userContext.jobStatus === "student" ? "관심 분야" : "현재 직업", value: input.userContext.detailJob });
    const html = renderToStaticMarkup(createElement(AnnualFortuneReportV3View, { ...result, now }));
    expect(html).toContain("data-story-tables"); expect(html).toContain("data-story-signals");
    expect(html.match(/data-current-jie="true"/g)).toHaveLength(1);
    expect(copy(html)).not.toMatch(/리포트 활용 포인트|evidenceId|sourceRefs|unsupported|backend|debug|metal|water|\d+\s*점|[SABC][+-]?\s*등급|겁재은|정재은|결과이(?:\s|[,.])/iu);
    expect(html).not.toMatch(/sourceRefs|narrativeAudit|natal\.day|month-v2:|NO_VERIFIED|SHINSAL_RULES/);
    if (id === "gaon") {
      writeFileSync("/tmp/gyeol-annual-v3-gaon.txt", annualV3CustomerText(draft));
      writeFileSync("/tmp/gyeol-annual-v3-gaon.html", html);
      writeFileSync("/tmp/gyeol-annual-v3-gaon-audit.json", JSON.stringify({ titles: draft.editorialMonths.map(m => `${m.month}월 ${m.title}`), traits: draft.narrativeAudit, monthly: evidencePacket.annualV3.monthly }, null, 2));
    }
  });
  it("keeps existing calculations byte-identical to the legacy handler", async () => {
    const input = annualFixturePayload(), normalized = normalizeReportInputPayload(input);
    expect(normalized.ok).toBe(true); if (!normalized.ok || normalized.value.kind === "compatibility") return;
    const legacy = await generateAnnualFortuneProductDraft(normalized.value, { now: () => now, writer: { enabled: false } });
    const result = await generate(input); expect(legacy.ok).toBe(true); if (!legacy.ok || !result) return;
    for (const key of ["calendarMonths", "customerDayun", "dayunSelection", "annualFortune", "baseSaju", "annualReading"] as const) {
      expect(result.evidencePacket[key]).toEqual((legacy.evidencePacket as typeof result.evidencePacket)[key]);
    }
    expect(result.draft.monthlyFlow).toEqual(legacy.draft.monthlyFlow);
  });
  it("has meaningful MBTI, job and relationship counterfactuals without changing pillars", async () => {
    const reports = await Promise.all([{}, { mbti: "INFP" }, { mbti: "" }, { job: "백엔드 개발자" }, { status: "student", job: "컴퓨터공학" }, { relationship: "dating" }, { relationship: "married" }].map(o => generate(annualFixturePayload(o))));
    const baseline = reports[0]!;
    for (const result of reports.slice(1)) { expect(result).not.toBeNull(); if (!result) continue; expect(result.evidencePacket.calendarMonths).toEqual(baseline.evidencePacket.calendarMonths); expect(annualV3CustomerText(result.draft)).not.toEqual(annualV3CustomerText(baseline.draft)); }
    expect(baseline.draft.narrativeAudit.length).toBeGreaterThanOrEqual(8);
    expect(new Set(baseline.draft.narrativeAudit.map(a => a.traitId)).size).toBe(baseline.draft.narrativeAudit.length);
    expect(reports[2]!.draft.narrativeAudit).toHaveLength(0);
    expect(reports[1]!.draft.opening).not.toEqual(baseline.draft.opening);
    expect(reports[3]!.draft.editorialMonths.map(m => m.paragraphs)).not.toEqual(baseline.draft.editorialMonths.map(m => m.paragraphs));
  });
  it("preserves all twelve Jie boundaries, before/exact/after and carry-over current month", async () => {
    const r = (await generate())!, calendar = r.evidencePacket.calendarMonths!;
    for (const boundary of getAnnualJieBoundaries(2026)) for (const seconds of [-1, 0, 1]) {
      const instant = formatDayunKst(Date.parse(boundary.instantKst) + seconds * 1000), segment = annualSegmentAt(calendar, instant)!;
      expect(segment.monthPillar).toEqual(seconds < 0 ? boundary.beforeMonth : boundary.afterMonth);
      const extended = r.evidencePacket.annualV3.monthly.months.flatMap(m => m.segments).find(s => s.startKst === segment.startKst)!;
      expect(extended.ganji).toBe(segment.monthPillar.stem + segment.monthPillar.branch);
      const d = buildAnnualV3({ ...r.draft, version: "v1", productVersion: "v1" } as AnnualFortuneReportDraft, r.evidencePacket, r.evidencePacket.annualV3.monthly, r.evidencePacket.annualV3.facts, new Date(instant));
      const active = d.editorialMonths.find(m => m.timePosition === "current")!;
      expect(active.focusStartKst).toBe(segment.startKst);
      expect(active.labels[0]).toContain(extended.ganji);
      expect(active.evidenceRefs).toEqual(expect.arrayContaining(extended.features.map(f => f.id)));
      const nextJie = calendar.flatMap(m => m.segments).find(s => Date.parse(s.startKst) >= Date.parse(segment.endKstExclusive) && s.boundaryReason.some(b => b.startsWith("jie:")));
      if (nextJie) expect(active.paragraphs.at(-1)).toContain(annualThemes[nextJie.stemTenGod].focus);
    }
    const past = await generate(annualFixturePayload({ year: "2025" }));
    expect(past!.draft.editorialMonths.every(m => m.timePosition === "past")).toBe(true);
    expect(past!.draft.editorialMonths.flatMap(m => m.paragraphs).join(" ")).not.toMatch(/해질 거예요|들어올 거예요|앞으로는|앞으로 남은/);
    expect(annualTime("2026-09-01T00:00:00+09:00", "2026-10-01T00:00:00+09:00", "2026-10-01T00:00:00+09:00")).toBe("past");
  });
  it("rejects tampered features, provenance and prose", async () => {
    const r = (await generate())!;
    const changed = JSON.parse(JSON.stringify(r)); changed.evidencePacket.annualV3.monthly.months[0].segments[0].features[0].sourceRefs = ["invented"];
    expect(validateAnnualV3(changed.draft, changed.evidencePacket)).toContain("ANNUAL_V3_MONTH_EVIDENCE_MISMATCH");
    const d = { ...r.draft, opening: ["무조건 부자가 됩니다."] }; expect(validateAnnualV3(d, r.evidencePacket)).toContain("ANNUAL_V3_CONTENT_MISMATCH");
  });
  it("explicit V3 never calls an external writer and refuses unavailable years", async () => {
    const fetch = vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("NETWORK_FORBIDDEN"));
    try {
      const r = await generateProductReport(annualFixturePayload(), { enabled: false, reason: "flag_disabled" }, "normal_writer", undefined, { annualVersion: "v3" });
      expect(r.ok, JSON.stringify(r)).toBe(true); expect(r.externalCalls).toEqual([]); expect(fetch).not.toHaveBeenCalled();
      expect(await generate(annualFixturePayload({ year: "2036" }))).toBeNull();
      const fromNewInput = await generateProductReport(annualFixturePayload(), { enabled: false, reason: "flag_disabled" }, "deterministic_fallback");
      expect(fromNewInput.ok && (fromNewInput.draft as { productVersion: string }).productVersion).toBe("v3");
      const accepted = createAnnualCommerceAcceptance(2021, new Date("2026-01-01T00:00:00+09:00"));
      const delayed = await createAnnualV3(annualFixturePayload({ year: "2021" }), { policyDate: new Date(accepted.acceptedAt), now: () => new Date("2027-01-01T00:00:00+09:00") });
      expect(delayed).not.toBeNull(); expect(delayed?.draft.editorialMonths.every(m => m.timePosition === "past")).toBe(true);
    } finally { fetch.mockRestore(); }
  });
  it("keeps all six raw relationship choices and does not label focus areas as a job", async () => {
    for (const [relationship, label] of [["", "미선택"], ["single", "솔로"], ["some", "썸"], ["dating", "연애"], ["marriage_preparing", "결혼 준비"], ["married", "기혼"]]) {
      const r = (await generate(annualFixturePayload({ relationship })))!;
      expect(r.draft.inputSummary).toContainEqual({ label: "관계 상태", value: label });
      expect(validateAnnualV3(r.draft, r.evidencePacket)).toEqual([]);
    }
    const input = annualFixturePayload({ job: "" });
    const r = (await generate({ ...input, userContext: { ...input.userContext, focusAreas: ["돈"] } }))!;
    expect(r.draft.inputSummary.some(row => row.label === "현재 직업")).toBe(false);
  });
});

describe("Separate monthly evidence, not recycled natal shinsal", () => {
  it("uses canonical anchor-target tables with provenance for every segment", async () => {
    const r = (await generate())!, extension = r.evidencePacket.annualV3.monthly;
    expect(extendAnnualMonthEvidence(r.evidencePacket)).toEqual(extension);
    for (const segment of extension.months.flatMap(m => m.segments)) {
      expect(segment.features.find(f => f.kind === "lifeStage")).toBeTruthy();
      expect(segment.unsupported).toContainEqual({ code: "banghap", reason: "NO_VERIFIED_CANONICAL_RULE" });
      expect(segment.features.every(f => f.sourceRefs.length >= 2 && f.basis.target.startsWith("month."))).toBe(true);
      for (const f of segment.features.filter(f => f.kind === "shinsal" || f.kind === "noble")) expect(SHINSAL_RULES.some(rule => rule.code === f.code)).toBe(true);
    }
    expect(new Set(extension.months.flatMap(m => m.segments.flatMap(s => s.features.filter(f => f.kind === "shinsal").map(f => f.label)))).size).toBeGreaterThan(8);
    const natal = detectShinsal(r.evidencePacket.annualV3.calculation.pillars).map(s => s.code);
    expect(extension.months.flatMap(m => m.segments).some(s => s.features.some(f => f.kind === "shinsal" && !natal.includes(f.code as typeof natal[number])))).toBe(true);
    // Independent canonical detector as an oracle: only the artificial target
    // pillar in this TEST is replaced; all real reference pillars stay fixed.
    for (const s of extension.months.flatMap(m => m.segments)) {
      const pillars = r.evidencePacket.annualV3.calculation.pillars;
      const expected = detectShinsal({ ...pillars, hour: { ...pillars.day, stem: s.ganji[0] as HeavenlyStem, branch: s.ganji[1] as EarthlyBranch } })
        .filter(f => f.positions.includes("hour") && !["BRANCH_ONLY", "STEM_BRANCH_PAIR"].includes(f.basis.kind)).map(f => f.code);
      expect([...new Set(s.features.filter(f => f.kind === "noble" || f.kind === "shinsal").map(f => f.code))].sort()).toEqual([...new Set(expected)].sort());
    }
  });
  it("has explicit positive and negative monthly charm/noble goldens", async () => {
    const r = (await generate(annualFixturePayload({ birthDate: "1996-12-06" })))!;
    expect(r.evidencePacket.baseSaju.dayMaster).toBe("丁");
    for (const s of r.evidencePacket.annualV3.monthly.months.flatMap(m => m.segments)) {
      expect(s.features.some(f => f.code === "HONGYEOMSAL")).toBe(s.ganji[1] === "未");
      expect(s.features.some(f => f.code === "DOHWASAL")).toBe(s.ganji[1] === "酉");
      expect(s.features.some(f => f.code === "CHEON_EUL_GWIIN")).toBe(["亥", "酉"].includes(s.ganji[1]));
      expect(s.features.some(f => f.code === "lifeStage")).toBe(true);
      expect(s.features.some(f => f.code === "banghap")).toBe(false);
    }
  });
  it("distinguishes dohwa first impression and hongyeom close attraction only in matching segments", async () => {
    const r = (await generate())!, months = r.evidencePacket.annualV3.monthly.months;
    for (const month of r.draft.editorialMonths) {
      const segment = months.find(m => m.month === month.month)!.segments.find(s => s.startKst === month.focusStartKst)!;
      const text = month.paragraphs.join(" ");
      if (text.includes("도화")) expect(segment.features.some(f => f.code === "DOHWASAL")).toBe(true);
      if (text.includes("홍염")) expect(segment.features.some(f => f.code === "HONGYEOMSAL")).toBe(true);
    }
    expect(months.flatMap(m => m.segments).some(s => s.features.some(f => f.code === "wonjin"))).toBe(true);
  });
});
