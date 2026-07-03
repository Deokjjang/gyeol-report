import { describe, expect, it } from "vitest";

import {
  buildManseRyeokCommonTableData,
  buildMbtiCommonProfileTableData,
  getMbtiFunctionDisplay,
  getStemDisplay,
  type ManseRyeokCommonTableData,
  type MbtiCommonProfileTableData,
} from "../../../src/lib/report-tables";

describe("report table lib exports", () => {
  it("exports display dictionary helpers", () => {
    expect(getStemDisplay("甲").ko).toBe("갑");
    expect(getMbtiFunctionDisplay("Te").nameKo).toBe("외향 사고");
  });

  it("exports table data builders and types", () => {
    const manseRyeokData: ManseRyeokCommonTableData =
      buildManseRyeokCommonTableData({
        displayName: "정덕민",
        fourPillarGrid: [
          {
            columnId: "day",
            heavenlyStem: "甲",
            earthlyBranch: "子",
          },
        ],
      });
    const mbtiData: MbtiCommonProfileTableData =
      buildMbtiCommonProfileTableData({
        type: "ENTJ",
        titleKo: "대담한 통솔자",
        archetype: "목표를 현실화하는 전략 지휘관",
        oneLine: "목표를 구조화해 실행하는 사람",
        preferenceAxes: {
          energy: "E",
          perception: "N",
          judgment: "T",
          lifestyle: "J",
        },
        functionStack: {
          dominant: "Te",
          auxiliary: "Ni",
          tertiary: "Se",
          inferior: "Fi",
        },
      });

    expect(manseRyeokData.title).toBe("정덕민님의 만세력");
    expect(mbtiData.type).toBe("ENTJ");
  });
});
