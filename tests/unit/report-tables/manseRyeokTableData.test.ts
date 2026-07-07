import { describe, expect, it } from "vitest";

import {
  buildManseRyeokCommonTableData,
  type ManseRyeokFourPillarGridColumnInput,
} from "../../../src/lib/report-tables/manseRyeokTableData";

const sampleFourPillarGrid: readonly ManseRyeokFourPillarGridColumnInput[] = [
  {
    columnId: "year",
    heavenlyStem: "己",
    earthlyBranch: "卯",
    tenGod: ["천간 정재", "지지 겁재"],
    hiddenStems: ["乙"],
    twelveLifeStage: ["제왕"],
    twelveSinsal: ["장성살"],
    sinsal: ["진신"],
    gwiin: ["천을귀인"],
    interactions: ["묘신합"],
  },
  {
    columnId: "hour",
    pillar: "戊辰",
    tenGod: ["천간 편재", "지지 편재"],
    hiddenStems: ["乙", "癸", "戊"],
    twelveLifeStage: ["쇠"],
    twelveSinsal: ["반안살"],
    sinsal: ["귀문관살"],
    interactions: ["감기합→토"],
  },
  {
    columnId: "month",
    heavenlyStem: "辛",
    earthlyBranch: "未",
    tenGod: ["천간 정관", "지지 정재"],
    hiddenStems: ["丁", "乙", "己"],
    twelveLifeStage: ["묘"],
    twelveSinsal: ["화개살"],
    gwiin: ["효신살"],
  },
  {
    columnId: "day",
    heavenlyStem: "甲",
    earthlyBranch: "申",
    tenGod: ["천간 비견", "지지 편관"],
    hiddenStems: ["戊", "壬", "庚"],
    twelveLifeStage: ["절"],
    twelveSinsal: ["겁살"],
    sinsal: ["남연살"],
    gwiin: ["현침살"],
  },
];

describe("buildManseRyeokCommonTableData", () => {
  it("keeps the fixed hour, day, month, year column order", () => {
    const data = buildManseRyeokCommonTableData({
      displayName: "정덕민",
      fourPillarGrid: sampleFourPillarGrid,
    });

    expect(data.title).toBe("정덕민님의 만세력");
    expect(data.columns).toEqual([
      { key: "hour", label: "시주" },
      { key: "day", label: "일주" },
      { key: "month", label: "월주" },
      { key: "year", label: "연주" },
    ]);
  });

  it("fills heavenly stem and earthly branch display data from dictionaries", () => {
    const data = buildManseRyeokCommonTableData({
      fourPillarGrid: sampleFourPillarGrid,
    });

    expect(data.stemRow.hour).toMatchObject({
      hanja: "戊",
      ko: "무",
      tenGod: "편재",
      element: "earth",
      yinYang: "yang",
      colorToken: "earth-soil",
    });
    expect(data.branchRow.day).toMatchObject({
      hanja: "申",
      ko: "신",
      tenGod: "편관",
      element: "metal",
      yinYang: "yang",
      colorToken: "metal-gold",
    });
  });

  it("adds element color tokens to stem and branch cells", () => {
    const data = buildManseRyeokCommonTableData({
      fourPillarGrid: sampleFourPillarGrid,
    });

    expect(data.stemRow.year?.colorToken).toBe("earth-soil");
    expect(data.branchRow.year?.colorToken).toBe("wood-green");
    expect(data.stemRow.day?.colorToken).toBe("wood-green");
    expect(data.branchRow.month?.colorToken).toBe("earth-soil");
  });

  it("calculates five-element distribution from heavenly stems and earthly branches only", () => {
    const data = buildManseRyeokCommonTableData({
      fourPillarGrid: sampleFourPillarGrid,
    });

    expect(data.fiveElementDistribution.basisLabel).toBe(
      "천간·지지 8글자 기준",
    );
    expect(
      data.fiveElementDistribution.items.map((item) => [
        item.label,
        item.count,
      ]),
    ).toEqual([
      ["목", 2],
      ["화", 0],
      ["토", 4],
      ["금", 2],
      ["수", 0],
    ]);
  });

  it("builds detail rows in the spec order", () => {
    const data = buildManseRyeokCommonTableData({
      fourPillarGrid: sampleFourPillarGrid,
    });

    expect(data.detailRows.map((row) => row.key)).toEqual([
      "hiddenStems",
      "twelveLifeStage",
      "twelveSinsal",
      "sinsalAndGwiin",
      "interactions",
    ]);
    expect(data.detailRows.map((row) => row.label)).toEqual([
      "지장간",
      "십이운성",
      "십이신살",
      "신살/귀인",
      "합충형파해",
    ]);
    expect(data.detailRows[3].cells.day).toEqual(["남연살", "현침살"]);
  });

  it("normalizes missing detail values to empty arrays and missing cells to null", () => {
    const data = buildManseRyeokCommonTableData({
      fourPillarGrid: [
        {
          columnId: "day",
          heavenlyStem: "甲",
          earthlyBranch: "子",
        },
      ],
    });

    expect(data.stemRow.hour).toBeNull();
    expect(data.branchRow.hour).toBeNull();
    expect(data.detailRows[0].cells.hour).toEqual([]);
    expect(data.detailRows[0].cells.day).toEqual([]);
    expect(data.detailRows[3].cells.day).toEqual([]);
  });

  it("throws for unsupported heavenly stems and earthly branches", () => {
    expect(() =>
      buildManseRyeokCommonTableData({
        fourPillarGrid: [
          {
            columnId: "day",
            heavenlyStem: "A",
            earthlyBranch: "子",
          },
        ],
      }),
    ).toThrow("Unsupported heavenly stem: A");

    expect(() =>
      buildManseRyeokCommonTableData({
        fourPillarGrid: [
          {
            columnId: "day",
            heavenlyStem: "甲",
            earthlyBranch: "B",
          },
        ],
      }),
    ).toThrow("Unsupported earthly branch: B");
  });
});
