import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import MbtiCommonProfileTable from "../../../src/components/report-tables/MbtiCommonProfileTable";
import { buildMbtiCommonProfileTableData, getMbtiSourceByType } from "../../../src/lib/report-tables";
import { createCareerV3, validateCareerV3 } from "../../../src/lib/report-generation/careerV3Generation";
import { CareerReportV3View } from "../../../src/app/reports/[reportId]/CareerReportV3View";
import { careerFixture, CAREER_V3_FIXTURES } from "./careerFixtures";
import { groupPublicRelations, publicSignalRows } from "../../../src/lib/interpretation-v3/comprehensivePublicSignals";
import { MBTI_TYPES } from "../../../src/lib/report-generation/reportInputTypes";
import EditorialPreview from "../../../src/app/dev/v3-editorial-preview/page";

it.each(MBTI_TYPES.filter(Boolean))("%s retains all detailed areas; only usage notes are hidden", mbti => {
  const data = buildMbtiCommonProfileTableData(getMbtiSourceByType(mbti)!);
  const old = renderToStaticMarkup(createElement(MbtiCommonProfileTable, { data }));
  const current = renderToStaticMarkup(createElement(MbtiCommonProfileTable, { data, showUsageNotes: false }));
  for (const label of ["핵심 요약", "정체성", "강점", "주의점", "가까운 키워드", "먼 키워드", "선호 지표 비교", "기능 서열"]) expect(current).toContain(label);
  expect(current).not.toContain("리포트 활용 포인트"); expect(old).toContain("리포트 활용 포인트");
  for (const row of data.functionRows) expect(current).toContain(row.code);
  expect(data.reportUsageNotes.length).toBeGreaterThan(0);
});

it("F3 saved narrative still validates and renders compact; new narrative has the detailed table", () => {
  const { payload } = careerFixture(CAREER_V3_FIXTURES[0]), r = createCareerV3(payload)!;
  expect(r.draft.narrativeEdition).toBe("mbti-library-2");
  const old = { ...r.draft, narrativeEdition: "mbti-library-1" as const };
  expect(validateCareerV3(old, r.evidencePacket)).toEqual([]);
  expect(renderToStaticMarkup(createElement(CareerReportV3View, { ...r, draft: old }))).not.toContain("data-mbti-detail");
  expect(renderToStaticMarkup(createElement(CareerReportV3View, r))).toContain("data-mbti-detail");
  expect(r.draft.narrativeAudit.length).toBeGreaterThan(2);
});

it.each(["comprehensive", "career", "love", "compatibility"])("%s preview restores the detail control without provider calls", async product => {
  const html = renderToStaticMarkup(await EditorialPreview({ searchParams: Promise.resolve({ product }) }));
  expect(html).toContain("data-mbti-detail"); expect(html).not.toContain("리포트 활용 포인트"); expect(fetch).not.toHaveBeenCalled();
});

it("groups positional relation rows in the display only, retaining every basis", () => {
  const rows = ["연주·일주", "연주·시주", "월주·일주", "월주·시주"].map(position => ({ label: "巳申 육합", meaning: "연결", power: "협력", basis: [position] }));
  const original = JSON.stringify(rows), grouped = groupPublicRelations(rows);
  expect(grouped).toHaveLength(1); expect(grouped[0].label).toBe("巳申 육합 · 원국 4곳");
  expect(grouped[0].basis).toEqual(rows.flatMap(r => r.basis)); expect(JSON.stringify(rows)).toBe(original);
  const { payload } = careerFixture(CAREER_V3_FIXTURES[0]), r = createCareerV3({ ...payload, person: { ...payload.person, birthDate: "1992-08-21", birthTime: "09:30" } })!;
  const { facts, calculation } = r.evidencePacket.careerV3, before = JSON.stringify(facts);
  const real = publicSignalRows(facts, calculation, { opening: [], sections: [] });
  expect([...new Set(groupPublicRelations(real).flatMap(r => r.basis))].sort()).toEqual([...new Set(real.flatMap(r => r.basis))].sort());
  expect(groupPublicRelations(real).find(r => r.label === "巳申 육합 · 원국 4곳")?.basis).toHaveLength(4);
  expect(JSON.stringify(facts)).toBe(before);
});
