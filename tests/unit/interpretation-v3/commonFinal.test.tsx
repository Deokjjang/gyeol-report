import { writeFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import { createMajorFortuneV3, validateMajorFortuneV3 } from "../../../src/lib/report-generation/majorFortuneV3Generation";
import { createComprehensiveV3 } from "../../../src/lib/report-generation/comprehensiveV3Generation";
import { createCareerV3 } from "../../../src/lib/report-generation/careerV3Generation";
import { createLoveV3 } from "../../../src/lib/report-generation/loveV3Generation";
import { createCompatibilityV3 } from "../../../src/lib/report-generation/compatibilityV3Generation";
import { GAON_MAJOR_FORTUNE_V3_PAYLOAD as payload } from "../../../src/lib/interpretation-v3/majorFortuneFixtures";
import { majorFortuneV3CustomerText } from "../../../src/lib/interpretation-v3/majorFortuneEditorial";
import { MajorFortuneReportV3View } from "../../../src/app/reports/[reportId]/MajorFortuneReportV3View";
import { CompatibilityReportV3View } from "../../../src/app/reports/[reportId]/CompatibilityReportV3View";
import { buildCanonicalManseRyeokTableData, withConsistentNatalMarkers } from "../../../src/lib/report-tables/manseRyeokTableData";
import { validateNewProductPublication } from "../../../src/lib/report-generation/productPublishGate";
import { createProductPreviewSnapshot, isProductPreviewSnapshot } from "../../../src/lib/report-generation/productPreviewSnapshot";
import { careerFixture, CAREER_V3_FIXTURES } from "./careerFixtures";
import { compatibilityFixture } from "./compatibilityFixtures";
import { publicSignalRows } from "../../../src/lib/interpretation-v3/comprehensivePublicSignals";
import { adaptNatalTable } from "../../../src/lib/interpretation-v3/evidence";
import type { SajuCalcResult } from "../../../src/lib/saju/types";

const now = () => new Date("2026-09-29T03:00:00Z");
it.each(CAREER_V3_FIXTURES)("F5 %s preserves F4 density, all calculations, traits and snapshots", async (...fixture) => {
  const input = { ...careerFixture(fixture).payload, productKey: "major_fortune", productSlug: "major-fortune" };
  const current = (await createMajorFortuneV3(input, { now, edition: "legacy-final" }))!;
  const old = (await createMajorFortuneV3(input, { now, edition: "legacy-outlook" }))!;
  expect(current.draft.version).toBe("major_fortune_v3.0-editorial.5");
  expect(current.evidencePacket).toEqual(old.evidencePacket);
  expect(current.draft.narrativeAudit).toEqual(old.draft.narrativeAudit);
  expect(current.draft.horizon).toEqual(old.draft.horizon);
  for (const report of [current, old]) {
    expect(validateMajorFortuneV3(report.draft, report.evidencePacket)).toEqual([]);
    expect(validateNewProductPublication("major_fortune", report.draft, report.evidencePacket, input).ok).toBe(true);
    const snapshot = createProductPreviewSnapshot({ reportId: "f5-check", createdAtIso: now().toISOString(), productKey: "major_fortune", productSlug: "major-fortune", ...report });
    expect(snapshot.ok && isProductPreviewSnapshot(JSON.parse(JSON.stringify(snapshot.value)))).toBe(true);
  }
  for (const [index, year] of current.draft.editorialYears.entries()) {
    const before = old.draft.editorialYears[index];
    expect(year.paragraphs.length).toBe(before.paragraphs.length);
    expect([year.ganji, year.ageLabel, year.evidence]).toEqual([before.ganji, before.ageLabel, before.evidence]);
    if (year.timePosition === "past") expect(year).toEqual(before);
    else expect(year.paragraphs.join("").length, `${fixture[0]} ${year.year}`).toBeGreaterThanOrEqual(before.paragraphs.join("").length);
  }
  expect(majorFortuneV3CustomerText(current.draft)).not.toMatch(/보완과 연결|의 접점은 서로 다른 경험과 역할|의 긴장도 함께 들어옵니다/);
  expect(fetch).not.toHaveBeenCalled();
});

it("Gaon retains all 14 ages and exact 2028 boundary with varied relation scenes", async () => {
  const result = (await createMajorFortuneV3(payload, { now }))!;
  const old = (await createMajorFortuneV3(payload, { now, edition: "legacy-outlook" }))!;
  result.draft.editorialYears.forEach((y, i) => expect(y.paragraphs.join("").length).toBeGreaterThanOrEqual(old.draft.editorialYears[i].paragraphs.join("").length));
  const html = renderToStaticMarkup(createElement(MajorFortuneReportV3View, result));
  expect(result.draft.editorialYears.map(y => y.year)).toEqual(Array.from({ length: 14 }, (_, i) => 2023 + i));
  for (const y of result.draft.editorialYears) expect(html).toContain(`${y.year}년 · ${y.ageLabel}`);
  expect(result.draft.horizon!.transitions[0].startSolarKst).toContain("2028-06-04");
  expect(html).not.toMatch(/sourceRefs|evidenceRefs|mbti:[A-Z]{4}:|보완과 연결/);
  expect(html).not.toMatch(/계산 기준|근거 더 보기|연지 기준|일지 기준|절입(?:·교운|과|을|은|이|의|전후|\s)|교운(?:\s|경계|시각|전후)|provenance|canonical|전문 근거|천간·지장간의 십성|원국 전체의 파생 근거/iu);
  if (process.env.F5_REVIEW_OUTPUT === "1") writeFileSync("/tmp/gyeol-major-f5-gaon.txt", majorFortuneV3CustomerText(result.draft));
});

it("five V3 products project identical confirmed natal marker positions without changing evidence", async () => {
  const full = createComprehensiveV3({ ...payload, productKey: "saju_mbti_full", productSlug: "saju-mbti-full" })!;
  const career = createCareerV3({ ...payload, productKey: "career_money_study", productSlug: "career-money-study" })!;
  const love = createLoveV3({ ...payload, productKey: "love_marriage_child", productSlug: "love-marriage-child" })!;
  const pair = createCompatibilityV3({ ...compatibilityFixture(), personA: payload.person })!;
  const major = (await createMajorFortuneV3(payload, { now }))!;
  for (const report of [full, career, love, pair, major]) {
    const audit = report.draft.narrativeAudit!;
    // Pair editorial already contains MBTI scenes; its shared injection is
    // deliberately confined to the two directed perspectives, not every chapter.
    expect(audit.length).toBeGreaterThanOrEqual(report === pair ? 2 : 3);
    expect(new Set(audit.map(a => `${a.subject}:${a.traitId}`)).size).toBe(audit.length);
    expect(new Set(audit.map(a => a.section)).size).toBeGreaterThanOrEqual(report === pair ? 1 : 3);
  }
  const cases: [unknown, SajuCalcResult, "person" | "personA"][] = [
    [full.evidencePacket, full.evidencePacket.comprehensiveV3.calculation, "person"],
    [career.evidencePacket, career.evidencePacket.careerV3.calculation, "person"],
    [love.evidencePacket, love.evidencePacket.loveV3.calculation, "person"],
    [pair.evidencePacket, pair.evidencePacket.compatibilityV3.calculations.personA, "personA"],
    [major.evidencePacket, major.evidencePacket.majorFortuneV3.calculation, "person"],
  ];
  const outputs: string[] = [];
  for (const [packet, calculation, role] of cases) {
    const original = JSON.stringify(packet), data = buildCanonicalManseRyeokTableData(packet, "가온", role)!;
    const projected = withConsistentNatalMarkers(data), natal = data.natalEvidence!;
    const twelveSinsal = projected.detailRows.find(row => row.key === "twelveSinsal")!;
    expect(twelveSinsal.label).toBe("십이신살");
    expect(Object.values(twelveSinsal.cells).flat().join(" ")).not.toMatch(/연지 기준|일지 기준/u);
    outputs.push(JSON.stringify(projected.detailRows));
    const signals = publicSignalRows(adaptNatalTable(natal, role), calculation, { opening: [], sections: [] });
    for (const feature of natal.features.filter(f => ["sinsal", "gwiin", "twelve_sinsal"].includes(f.category))) {
      const row = projected.detailRows.find(r => r.key === (feature.category === "twelve_sinsal" ? "twelveSinsal" : "sinsalAndGwiin"))!;
      for (const position of feature.positions) expect(row.cells[position as keyof typeof row.cells].some(label => label.startsWith(feature.label))).toBe(true);
      if (!feature.positions.length) expect(Object.values(row.cells).flat()).not.toContain(feature.label);
      if (feature.positions.length) expect(signals.some(s => feature.aliases.includes(s.label) || s.label === feature.label)).toBe(true);
    }
    expect(JSON.stringify(packet)).toBe(original);
  }
  expect(new Set(outputs).size).toBe(1);
});

it.each(["parentChild", "managerReport"] as const)("%s displays compact actual birth input and fixed roles", category => {
  const input = compatibilityFixture(category), result = createCompatibilityV3(input)!;
  const html = renderToStaticMarkup(createElement(CompatibilityReportV3View, result));
  for (const slot of ["personA", "personB"] as const) {
    expect(html).toContain(input[slot].birthDate);
    expect(html).toContain(`${result.draft.people[slot].role} 이름 / MBTI`);
  }
  expect(html).toContain("시간 정확"); expect(html).not.toContain("compatibility-role");
});

it.each(["unknown", "approximate"] as const)("compatibility %s time keeps raw birth date and never implies exact time", precision => {
  const base = compatibilityFixture();
  const personA = { ...base.personA, birthTime: "", birthTimeUnknown: precision === "unknown", birthTimePrecision: precision, approximateBirthTimeSlot: precision === "approximate" ? "SASI" : "" };
  const result = createCompatibilityV3({ ...base, personA })!;
  expect(result).toBeTruthy();
  const html = renderToStaticMarkup(createElement(CompatibilityReportV3View, result));
  expect(html).toContain(precision === "unknown" ? "시간 모름" : "대략적인 시간대");
  expect(html).toContain(personA.birthDate);
  expect(html).not.toMatch(/sourceRefs|canonical-|mbti:ENTJ:/);
});
