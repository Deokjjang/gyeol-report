import { describe, expect, it } from "vitest";

import {
  buildCareerReportCommonTablesData,
  buildCareerReportManseRyeokTableData,
  buildCareerReportMbtiProfileTableData,
} from "../../../src/lib/report-tables";
import {
  buildCareerReportEvidence,
} from "../../../src/lib/report-knowledge/careerReportEvidence";
import {
  requireCareerReportFixture,
} from "../../../src/lib/report-knowledge/careerReportFixtures";

function buildFixtureEvidence(fixtureId = "deokmin-career") {
  const fixture = requireCareerReportFixture(fixtureId);

  return buildCareerReportEvidence({
    fixtureId: fixture.id,
    person: fixture.person,
  });
}

describe("career report table presenter", () => {
  it("builds manse ryeok table data from career evidence pillars", () => {
    const data = buildCareerReportManseRyeokTableData(buildFixtureEvidence());

    expect(data.title).toBe("덕민님의 만세력");
    expect(data.columns.map((column) => column.key)).toEqual([
      "hour",
      "day",
      "month",
      "year",
    ]);
    expect(data.stemRow.day).toMatchObject({
      hanja: "甲",
      ko: "갑",
      tenGod: "비견",
      colorToken: "wood-green",
    });
    expect(data.branchRow.day).toMatchObject({
      hanja: "申",
      ko: "신",
      tenGod: "편관",
      colorToken: "metal-gold",
    });
    expect(data.detailRows.find((row) => row.key === "hiddenStems")?.cells.day).toEqual(
      expect.arrayContaining(["庚 편관"]),
    );
    expect(data.detailRows.find((row) => row.key === "twelveLifeStage")?.cells.day).toEqual([
      "절",
    ]);
    expect(data.detailRows.find((row) => row.key === "twelveSinsal")?.cells.day.length).toBeGreaterThan(0);
    expect(data.detailRows.find((row) => row.key === "sinsalAndGwiin")?.cells.day.length).toBeGreaterThan(0);
    expect(data.detailRows.find((row) => row.key === "interactions")?.cells.day.length).toBeGreaterThan(0);
  });

  it("builds MBTI profile table data from the runtime source adapter", () => {
    const data = buildCareerReportMbtiProfileTableData(buildFixtureEvidence());

    expect(data).not.toBeNull();
    expect(data?.type).toBe("ENTJ");
    expect(data?.titleKo).toBe("대담한 통솔자");
    expect(data?.preferenceRows).toHaveLength(4);
    expect(data?.functionRows.map((row) => row.code)).toEqual([
      "Te",
      "Ni",
      "Se",
      "Fi",
    ]);
    expect(data?.closeKeywords.length).toBeGreaterThan(0);
    expect(data?.farKeywords.length).toBeGreaterThan(0);
    expect(data?.closeKeywords.length).toBeLessThanOrEqual(6);
    expect(data?.farKeywords.length).toBeLessThanOrEqual(6);
    expect(data?.reportUsageNotes.length).toBeGreaterThan(0);
    expect(data?.reportUsageNotes.length).toBeLessThanOrEqual(5);
    expect(data?.reportUsageNotes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          categoryKey: "직업·돈·학업 활용",
          label: "직업 활용",
          plainKo: expect.stringContaining("직업 해석"),
          productDomains: [],
        }),
      ]),
    );
    expect(
      data?.reportUsageNotes.some((note) => note.plainKo.includes("career 섹션")),
    ).toBe(false);
    expect(
      data?.reportUsageNotes.some((note) => note.plainKo.includes("workplace 문장")),
    ).toBe(false);
    expect(
      data?.reportUsageNotes.some((note) => note.plainKo.includes("money 섹션")),
    ).toBe(false);
    expect(
      data?.reportUsageNotes.some((note) => note.categoryKey === "money"),
    ).toBe(false);
    expect(
      data?.reportUsageNotes.some((note) => note.categoryKey === "study"),
    ).toBe(false);
  });

  it("returns null MBTI table data for unknown MBTI without breaking manse table data", () => {
    const evidence = {
      ...buildFixtureEvidence(),
      mbtiType: null,
    };
    const data = buildCareerReportCommonTablesData(evidence);

    expect(data.manseRyeokTableData.title).toBe("덕민님의 만세력");
    expect(data.mbtiProfileTableData).toBeNull();
  });
});
