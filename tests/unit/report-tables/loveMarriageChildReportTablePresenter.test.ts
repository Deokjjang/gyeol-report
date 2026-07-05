import { describe, expect, it } from "vitest";

import {
  buildLoveMarriageChildReportCommonTablesData,
  buildLoveMarriageChildReportManseRyeokTableData,
  buildLoveMarriageChildReportMbtiProfileTableData,
} from "../../../src/lib/report-tables";
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
      "식신",
      "현침살",
      "홍염살",
      "도화살",
      "화개살",
      "천을귀인",
      "월덕귀인",
      "甲己합",
      "申亥해",
    ],
  },
} as const satisfies BuildLoveMarriageChildReportEvidenceInput;

function buildFixtureEvidence(
  input: BuildLoveMarriageChildReportEvidenceInput = baseInput,
) {
  return buildLoveMarriageChildReportEvidence(input);
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
    ).toEqual(expect.arrayContaining(["도화", "홍염", "현침", "화개", "귀인"]));
    expect(
      data.detailRows.find((row) => row.key === "interactions")?.cells.day,
    ).toEqual(expect.arrayContaining(["甲己합", "申亥해"]));
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
          interactions: ["甲己합"],
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
          interactions: ["申亥해"],
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
    ).toEqual(["申亥해"]);
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
