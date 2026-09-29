import { writeFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import { createMajorFortuneV3, validateMajorFortuneV3 } from "../../../src/lib/report-generation/majorFortuneV3Generation";
import { validateNewProductPublication } from "../../../src/lib/report-generation/productPublishGate";
import { createProductPreviewSnapshot, isProductPreviewSnapshot } from "../../../src/lib/report-generation/productPreviewSnapshot";
import { getAnnualGanjiInfo, getTenGodForStemPair } from "../../../src/lib/report-knowledge/annualFortuneYearRules";
import { majorFortuneV3CustomerText } from "../../../src/lib/interpretation-v3/majorFortuneEditorial";
import { GAON_MAJOR_FORTUNE_V3_PAYLOAD as payload } from "../../../src/lib/interpretation-v3/majorFortuneFixtures";
import { MajorFortuneReportV3View } from "../../../src/app/reports/[reportId]/MajorFortuneReportV3View";
import { careerFixture, CAREER_V3_FIXTURES } from "./careerFixtures";

const now = () => new Date("2026-09-29T03:00:00Z");
const internals = /evidenceId|sourceRefs|canonical-|career_shift|money_responsibility|previous_to_current|metal|water|narrativeAudit|\d+\s*점|[SABC][+\-]?\s*등급|겁재은|정재은|결과이/;

it("2026 means 2023–2032, with the actual 2028 transition and full common manse", async () => {
  const r = (await createMajorFortuneV3(payload, { now }))!;
  expect(r).not.toBeNull();
  expect(validateMajorFortuneV3(r.draft, r.evidencePacket)).toEqual([]);
  expect(validateNewProductPublication("major_fortune", r.draft, r.evidencePacket, payload)).toEqual({ ok: true, errors: [] });
  expect(r.draft.editorialYears.map(y => y.year)).toEqual(Array.from({ length: 10 }, (_, i) => 2023 + i));
  expect(r.draft.horizon?.transitions.map(t => [t.year, t.before.ganji, t.after.ganji])).toEqual([[2028, "辛亥", "壬子"]]);
  expect(r.draft.horizon?.activeCycle?.ganji).toBe("辛亥");
  const past = r.draft.editorialYears.filter(y => y.timePosition === "past"), current = r.draft.editorialYears.find(y => y.isCurrentYear)!, future = r.draft.editorialYears.filter(y => y.timePosition === "future");
  expect(past).toHaveLength(3); expect(future).toHaveLength(6);
  expect(past.every(y => y.paragraphs.length <= 3)).toBe(true);
  expect(future.every(y => y.paragraphs.length >= 4)).toBe(true);
  expect(current.paragraphs.join("").length).toBeGreaterThan(Math.max(...future.map(y => y.paragraphs.join("").length)));
  for (const y of r.draft.editorialYears) {
    const calculated = getAnnualGanjiInfo(y.year);
    expect(y.ganji).toBe(calculated.ganji);
    expect(y.tenGod).toBe(getTenGodForStemPair(r.evidencePacket.dayMaster, calculated.stem));
  }
  const html = renderToStaticMarkup(createElement(MajorFortuneReportV3View, r));
  expect(html.includes("data-story-tables")).toBe(true); expect(html.includes("data-mbti-identity")).toBe(true);
  expect(html).not.toMatch(internals); expect(html).not.toContain("리포트 활용 포인트");
  expect(html.indexOf("data-horizon-timeline")).toBeLessThan(html.indexOf("data-horizon-transition"));
  expect(html.indexOf("data-horizon-transition")).toBeLessThan(html.indexOf("data-story-tables"));
  expect(new Set(future.map(y => y.title)).size).toBe(6);
  const customerText = majorFortuneV3CustomerText(r.draft);
  expect(customerText).not.toMatch(internals);
  expect(customerText).not.toMatch(/속도가 이 흐름에 섞|그해의 일 장면|돌아보면.+힘이 앞에|확정 예측/);
  expect(customerText).toMatch(/좋은 패|명예|축적|자리운/);
  if (process.env.F3_REVIEW_OUTPUT === "1") {
    writeFileSync("/tmp/gyeol-major-f3-gaon.txt", customerText);
    writeFileSync("/tmp/gyeol-major-f3-gaon.json", JSON.stringify(r, null, 2));
  }
  const snapshot = createProductPreviewSnapshot({ reportId: "f3-gaon", createdAtIso: now().toISOString(), productKey: "major_fortune", productSlug: "major-fortune", ...r });
  expect(snapshot.ok).toBe(true);
  if (snapshot.ok) expect(isProductPreviewSnapshot(JSON.parse(JSON.stringify(snapshot.value)))).toBe(true);
});

it.each([2021, 2027, 2028, 2029, 2031])("authoritative %i changes window, never the saju or cycle calculation", async year => {
  const r = (await createMajorFortuneV3({ ...payload, currentYear: 2099, productOptions: { contentVersion: "v3", currentYear: 2099 } }, { now: () => new Date(`${year}-01-02T00:00:00Z`) }))!;
  expect(validateMajorFortuneV3(r.draft, r.evidencePacket)).toEqual([]);
  expect(r.draft.horizon?.from).toBe(year - 3); expect(r.draft.horizon?.through).toBe(year + 6);
  const expected = r.evidencePacket.customerDayun!.cycles.filter(c => c.startYear >= year - 3 && c.startYear <= year + 6);
  expect(r.draft.horizon?.transitions.map(t => t.year)).toEqual(expected.map(c => c.startYear));
  expect(r.draft.editorialYears.filter(y => y.isCurrentYear)).toHaveLength(1);
  expect(r.draft.horizon?.transitions.every(t => t.after.tenGod === getTenGodForStemPair(r.evidencePacket.dayMaster, t.after.ganji[0] as Parameters<typeof getTenGodForStemPair>[1]))).toBe(true);
});

it("switches active cycle at the stored instant, not January 1; saved snapshots replay without the clock", async () => {
  const seed = (await createMajorFortuneV3(payload, { now }))!, boundary = seed.evidencePacket.customerDayun!.cycles.find(c => c.startYear === 2028)!;
  const before = (await createMajorFortuneV3(payload, { now: () => new Date(Date.parse(boundary.startSolarKst!) - 1) }))!;
  const after = (await createMajorFortuneV3(payload, { now: () => new Date(Date.parse(boundary.startSolarKst!) + 1) }))!;
  expect(before.draft.horizon?.activeCycle?.ganji).toBe("辛亥");
  expect(after.draft.horizon?.activeCycle?.ganji).toBe("壬子");
  expect(before.draft.horizon?.transitions[0].paragraphs[0]).toContain("壬子로 넘어가면");
  expect(after.draft.horizon?.transitions[0].paragraphs[0]).toContain("壬子로 넘어가며");
  expect(before.draft.horizon?.transitions[0].startSolarKst).toBe(boundary.startSolarKst);
  expect(validateMajorFortuneV3(JSON.parse(JSON.stringify(before.draft)), before.evidencePacket)).toEqual([]);
  const tampered = { ...before.draft, horizon: { ...before.draft.horizon, from: 2000 } };
  expect(validateMajorFortuneV3(tampered, before.evidencePacket)).toContain("MAJOR_FORTUNE_V3_CONTENT_MISMATCH");
});

it("includes a transition during the first window year and excludes the next boundary outside it", async () => {
  const r = (await createMajorFortuneV3(payload, { now: () => new Date("2021-09-29T03:00:00Z") }))!;
  expect(r.draft.horizon?.from).toBe(2018);
  expect(r.draft.horizon?.transitions.map(t => t.year)).toEqual([2018]);
  expect(r.draft.horizon?.transitions[0].paragraphs[0]).toContain("무게가 옮겨온 흐름");
});

it.each(CAREER_V3_FIXTURES)("%s job/MBTI context generates, publishes and SSR-renders", async (...row) => {
  const input = careerFixture(row).payload;
  const r = (await createMajorFortuneV3({ ...input, productKey: "major_fortune", productSlug: "major-fortune" }, { now }))!;
  expect(r).not.toBeNull(); if (!r) return;
  expect(validateMajorFortuneV3(r.draft, r.evidencePacket)).toEqual([]);
  const text = majorFortuneV3CustomerText(r.draft);
  expect(text).not.toMatch(internals);
  expect(renderToStaticMarkup(createElement(MajorFortuneReportV3View, r))).not.toMatch(internals);
  const ids = r.draft.narrativeAudit!.map(t => t.traitId);
  expect(new Set(ids).size).toBe(ids.length);
  if (input.person.mbtiType) expect(ids.length).toBeGreaterThan(2); else expect(ids).toEqual([]);
});

it("same saju changes actual behavior by MBTI and job without altering cycle facts", async () => {
  const cases = [payload, { ...payload, person: { ...payload.person, mbtiType: "INFP" } }, { ...payload, userContext: { ...payload.userContext, detailJob: "백엔드 개발자" } }];
  const rs = await Promise.all(cases.map(p => createMajorFortuneV3(p, { now })));
  const charts = rs.map(r => r!.evidencePacket.customerDayun);
  expect(charts[0]).toEqual(charts[1]); expect(charts[1]).toEqual(charts[2]);
  expect(new Set(rs.map(r => majorFortuneV3CustomerText(r!.draft).replaceAll("ENTJ", "").replaceAll("INFP", "").replaceAll("B2B SaaS 영업기획", "").replaceAll("백엔드 개발자", ""))).size).toBe(3);
  expect(majorFortuneV3CustomerText(rs[0]!.draft)).toContain("고객 미팅");
  expect(majorFortuneV3CustomerText(rs[2]!.draft)).toContain("코드");
});
