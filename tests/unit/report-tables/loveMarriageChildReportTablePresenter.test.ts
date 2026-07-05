import { describe, expect, it } from "vitest";

import {
  buildCareerReportManseRyeokTableData,
  buildLoveMarriageChildReportCommonTablesData,
  buildLoveMarriageChildReportManseRyeokTableData,
  buildLoveMarriageChildReportMbtiProfileTableData,
} from "../../../src/lib/report-tables";
import {
  buildCareerReportEvidence,
} from "../../../src/lib/report-knowledge/careerReportEvidence";
import {
  requireCareerReportFixture,
} from "../../../src/lib/report-knowledge/careerReportFixtures";
import {
  buildLoveMarriageChildReportEvidence,
  type BuildLoveMarriageChildReportEvidenceInput,
} from "../../../src/lib/report-knowledge/loveMarriageChildReportEvidence";

const baseInput = {
  name: "덕민",
  gender: "male",
  mbtiType: "ENTJ",
  relationshipStatus: "single",
  saju: {
    dayPillar: "甲申",
    labels: [
      "편재",
      "정재",
      "정관",
      "편관",
      "상관",
      "현침살",
      "홍염살",
      "도화살",
      "화개살",
      "천을귀인",
      "월덕귀인",
      "연일 천간합 甲己",
      "申亥해",
    ],
  },
} as const satisfies BuildLoveMarriageChildReportEvidenceInput;

const fullPillarInput = {
  ...baseInput,
  saju: {
    ...baseInput.saju,
    fullPillars: [
      {
        key: "year",
        pillar: "己卯",
        stem: "己",
        branch: "卯",
        stemTenGod: "정재",
        branchTenGod: "겁재",
        hiddenStems: ["乙 겁재"],
        twelveLifeStage: ["제왕"],
        twelveSinsal: ["장성살"],
        sinsal: ["현침살"],
        gwiin: [],
        interactions: ["연일 천간합 甲己"],
      },
      {
        key: "month",
        pillar: "辛未",
        stem: "辛",
        branch: "未",
        stemTenGod: "정관",
        branchTenGod: "정재",
        hiddenStems: ["己 정재", "丁 상관", "乙 겁재"],
        twelveLifeStage: ["묘"],
        twelveSinsal: ["화개살"],
        sinsal: ["화개"],
        gwiin: ["천을귀인"],
        interactions: [],
      },
      {
        key: "day",
        pillar: "甲申",
        stem: "甲",
        branch: "申",
        stemTenGod: "비견",
        branchTenGod: "편관",
        hiddenStems: ["庚 편관", "壬 편인", "戊 편재"],
        twelveLifeStage: ["절"],
        twelveSinsal: ["겁살"],
        sinsal: ["망신살"],
        gwiin: ["월덕귀인", "천덕귀인"],
        interactions: ["연일 천간합 甲己", "申亥해"],
      },
      {
        key: "hour",
        pillar: "戊辰",
        stem: "戊",
        branch: "辰",
        stemTenGod: "편재",
        branchTenGod: null,
        hiddenStems: ["戊 편재", "乙 겁재", "癸 정인"],
        twelveLifeStage: ["쇠"],
        twelveSinsal: ["반안살"],
        sinsal: ["백호대살"],
        gwiin: [],
        interactions: [],
      },
    ],
  },
} as const satisfies BuildLoveMarriageChildReportEvidenceInput;

function buildFixtureEvidence(
  input: BuildLoveMarriageChildReportEvidenceInput = baseInput,
) {
  return buildLoveMarriageChildReportEvidence(input);
}

function buildCareerDeokminManseRyeokTableData() {
  const fixture = requireCareerReportFixture("deokmin-career");

  return buildCareerReportManseRyeokTableData(
    buildCareerReportEvidence({
      fixtureId: fixture.id,
      person: fixture.person,
    }),
  );
}

describe("love marriage child report table presenter", () => {
  it("builds day-pillar manse ryeok table data from love evidence", () => {
    const data = buildLoveMarriageChildReportManseRyeokTableData(
      buildFixtureEvidence(),
    );

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
      colorToken: "wood-green",
    });
    expect(data.branchRow.day).toMatchObject({
      hanja: "申",
      ko: "신",
      colorToken: "metal-gold",
    });
    expect(data.stemRow.day?.tenGod).not.toBeNull();
    expect(data.branchRow.day?.tenGod).not.toBeNull();
    expect(
      data.detailRows.find((row) => row.key === "sinsalAndGwiin")?.cells.day,
    ).toEqual([]);
    expect(
      data.detailRows.find((row) => row.key === "interactions")?.cells.day,
    ).toEqual([]);
    expect(
      data.detailRows.find((row) => row.key === "hiddenStems")?.cells.day,
    ).toEqual([]);
  });

  it("uses full pillar table data when the evidence snapshot already has it", () => {
    const evidence = {
      ...buildFixtureEvidence(),
      manseRyeokPillars: [
        {
          columnId: "year",
          pillar: "己卯",
          tenGod: ["정재", "겁재"],
          hiddenStems: ["乙 겁재"],
          twelveLifeStage: ["제왕"],
          twelveSinsal: ["장성"],
          sinsal: ["도화"],
          gwiin: ["천을귀인"],
          interactions: ["연일 천간합 甲己"],
        },
        {
          columnId: "day",
          pillar: "甲申",
          tenGod: ["비견", "편관"],
          hiddenStems: ["庚 편관"],
          twelveLifeStage: ["절"],
          twelveSinsal: ["겁살"],
          sinsal: ["현침"],
          gwiin: [],
          interactions: ["甲己합", "연일 천간합 甲己"],
        },
      ],
    } as const;
    const data = buildLoveMarriageChildReportManseRyeokTableData(evidence);

    expect(data.stemRow.year?.hanja).toBe("己");
    expect(data.branchRow.year?.hanja).toBe("卯");
    expect(data.stemRow.year?.tenGod).toBe("정재");
    expect(data.branchRow.day?.tenGod).toBe("편관");
    expect(
      data.detailRows.find((row) => row.key === "hiddenStems")?.cells.year,
    ).toEqual(["乙 겁재"]);
    expect(
      data.detailRows.find((row) => row.key === "interactions")?.cells.day,
    ).toEqual(["연일 천간합 甲己"]);
    expect(
      data.detailRows.find((row) => row.key === "interactions")?.cells.day,
    ).not.toContain("甲己합");
  });

  it("uses formal full pillars before the day-pillar fallback", () => {
    const data = buildLoveMarriageChildReportManseRyeokTableData(
      buildFixtureEvidence(fullPillarInput),
    );

    expect(data.stemRow.hour?.hanja).toBe("戊");
    expect(data.branchRow.hour?.hanja).toBe("辰");
    expect(data.stemRow.month?.tenGod).toBe("정관");
    expect(data.branchRow.year?.tenGod).toBe("겁재");
    expect(
      data.detailRows.find((row) => row.key === "hiddenStems")?.cells.hour,
    ).toEqual(["戊 편재", "乙 겁재", "癸 정인"]);
    expect(
      data.detailRows.find((row) => row.key === "twelveLifeStage")?.cells.day,
    ).toEqual(["절"]);
    expect(
      data.detailRows.find((row) => row.key === "twelveSinsal")?.cells.year,
    ).toEqual(["장성살"]);
    expect(
      data.detailRows.find((row) => row.key === "sinsalAndGwiin")?.cells.month,
    ).toEqual(["화개", "천을귀인"]);
    expect(
      data.detailRows.find((row) => row.key === "interactions")?.cells.year,
    ).toEqual(["연일 천간합 甲己"]);
    expect(
      data.detailRows.find((row) => row.key === "interactions")?.cells.day,
    ).toEqual(["연일 천간합 甲己"]);
    expect(
      data.detailRows.find((row) => row.key === "interactions")?.cells.day,
    ).not.toContain("申亥해");
  });

  it("matches the career product original table for the same deokmin input", () => {
    const loveData = buildLoveMarriageChildReportManseRyeokTableData(
      buildFixtureEvidence(fullPillarInput),
    );
    const careerData = buildCareerDeokminManseRyeokTableData();

    expect(loveData.stemRow).toEqual(careerData.stemRow);
    expect(loveData.branchRow).toEqual(careerData.branchRow);

    for (const key of [
      "hiddenStems",
      "twelveLifeStage",
      "twelveSinsal",
      "sinsalAndGwiin",
      "interactions",
    ] as const) {
      expect(loveData.detailRows.find((row) => row.key === key)?.cells).toEqual(
        careerData.detailRows.find((row) => row.key === key)?.cells,
      );
    }
  });

  it("builds compact MBTI profile data with relationship-safe usage notes", () => {
    const data = buildLoveMarriageChildReportMbtiProfileTableData(
      buildFixtureEvidence(),
    );

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
    expect(data?.closeKeywords.length).toBeLessThanOrEqual(6);
    expect(data?.farKeywords.length).toBeLessThanOrEqual(6);
    expect(data?.coreSummary.some((item) => item.text.includes("관계"))).toBe(true);
    expect(data?.reportUsageNotes.length).toBeGreaterThan(0);
    expect(data?.reportUsageNotes.length).toBeLessThanOrEqual(5);
    expect(data?.reportUsageNotes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          categoryKey: "연애·결혼·자녀 활용",
          label: "사랑 방식",
          productDomains: [],
        }),
      ]),
    );
    expect(data?.reportUsageNotes.some((note) => note.plainKo?.includes("love 섹션"))).toBe(false);
    expect(data?.reportUsageNotes.some((note) => note.plainKo?.includes("marriage 섹션"))).toBe(false);
    expect(data?.reportUsageNotes.some((note) => note.plainKo?.includes("career"))).toBe(false);
    expect(data?.reportUsageNotes.some((note) => note.categoryKey === "love")).toBe(false);
    expect(data?.reportUsageNotes.some((note) => note.categoryKey === "marriage")).toBe(false);
  });

  it("returns null MBTI table data for unknown MBTI without breaking manse table data", () => {
    const evidence = buildFixtureEvidence({
      ...baseInput,
      mbtiType: "UNKNOWN",
    });
    const data = buildLoveMarriageChildReportCommonTablesData(evidence);

    expect(data.manseRyeokTableData.title).toBe("덕민님의 만세력");
    expect(data.mbtiProfileTableData).toBeNull();
  });
});
