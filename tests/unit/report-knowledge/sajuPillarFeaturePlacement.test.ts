import { describe, expect, it } from "vitest";

import {
  buildSajuPillarFeaturePlacements,
  buildSajuPillarGridColumns,
  createExternalFixturePlacement,
} from "../../../src/lib/report-knowledge/sajuPillarFeaturePlacement";

const externalPillars = {
  dayMaster: "甲",
  hourPillar: "戊辰",
  dayPillar: "甲申",
  monthPillar: "辛未",
  yearPillar: "己卯",
} as const;

function getColumn(columns: ReturnType<typeof buildSajuPillarGridColumns>, columnId: string) {
  const column = columns.find((item) => item.columnId === columnId);

  if (column === undefined) {
    throw new Error(`missing column: ${columnId}`);
  }

  return column;
}

describe("saju pillar feature placement", () => {
  it("builds deterministic ten-god rows for the external parity fixture", () => {
    const columns = buildSajuPillarGridColumns(externalPillars);

    expect(getColumn(columns, "hour").tenGod).toEqual([
      "천간 편재",
      "지지 편재",
    ]);
    expect(getColumn(columns, "day").tenGod).toEqual([
      "천간 비견",
      "지지 편관",
    ]);
    expect(getColumn(columns, "month").tenGod).toEqual([
      "천간 정관",
      "지지 정재",
    ]);
    expect(getColumn(columns, "year").tenGod).toEqual([
      "천간 정재",
      "지지 겁재",
    ]);
  });

  it("builds hidden-stem and twelve-life-stage rows for the external parity fixture", () => {
    const columns = buildSajuPillarGridColumns(externalPillars);

    expect(getColumn(columns, "hour").hiddenStems).toEqual(["乙", "癸", "戊"]);
    expect(getColumn(columns, "day").hiddenStems).toEqual(["戊", "壬", "庚"]);
    expect(getColumn(columns, "month").hiddenStems).toEqual(["丁", "乙", "己"]);
    expect(getColumn(columns, "year").hiddenStems).toEqual(["甲", "乙"]);
    expect(getColumn(columns, "hour").twelveLifeStage).toEqual(["쇠"]);
    expect(getColumn(columns, "day").twelveLifeStage).toEqual(["절"]);
    expect(getColumn(columns, "month").twelveLifeStage).toEqual(["묘"]);
    expect(getColumn(columns, "year").twelveLifeStage).toEqual(["제왕"]);
  });

  it("renders explicit production placements under the correct pillar only", () => {
    const columns = buildSajuPillarGridColumns({
      ...externalPillars,
      featurePlacements: [
        {
          ...createExternalFixturePlacement({
            featureId: "sinsal_baekho",
            labelKo: "백호살",
            pillar: "hour",
            sourcePillar: "戊辰",
            basis: "test production placement",
          }),
          confidence: "production",
        },
        {
          ...createExternalFixturePlacement({
            featureId: "gwiin_cheoneul",
            pillar: "month",
            sourcePillar: "辛未",
            basis: "test production placement",
          }),
          confidence: "production",
        },
        {
          ...createExternalFixturePlacement({
            featureId: "sinsal_yangin",
            pillar: "year",
            sourcePillar: "己卯",
            basis: "test production placement",
          }),
          confidence: "production",
        },
      ],
    });

    expect(getColumn(columns, "hour").sinsal).toContain("백호살");
    expect(getColumn(columns, "month").gwiin).toContain("천을귀인");
    expect(getColumn(columns, "year").sinsal).toContain("양인살");
    expect(getColumn(columns, "day").sinsal).toBeUndefined();
  });

  it("keeps diagnostic-only placements out of confirmed table rows", () => {
    const columns = buildSajuPillarGridColumns({
      ...externalPillars,
      featurePlacements: [
        createExternalFixturePlacement({
          featureId: "twelve_sinsal_banan",
          pillar: "hour",
          sourcePillar: "戊辰",
          basis: "external fixture only",
        }),
      ],
    });

    expect(getColumn(columns, "hour").twelveSinsal).toBeUndefined();
  });

  it("builds production placements only from production feature ids", () => {
    const placements = buildSajuPillarFeaturePlacements({
      ...externalPillars,
      productionFeatureIds: ["gwiin_cheoneul", "gwiin_jaego"],
    });

    expect(placements.map((placement) => placement.featureId)).toEqual(
      expect.arrayContaining(["gwiin_cheoneul", "gwiin_jaego"]),
    );
    expect(placements.map((placement) => placement.featureId)).not.toContain(
      "twelve_sinsal_banan",
    );
    expect(placements.every((placement) => placement.confidence === "production")).toBe(
      true,
    );
  });
});
