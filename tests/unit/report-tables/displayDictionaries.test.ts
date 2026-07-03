import { describe, expect, it } from "vitest";

import {
  earthlyBranchDisplays,
  getBranchDisplay,
  getElementColorToken,
  getMbtiFunctionDisplay,
  getMbtiPreferenceDisplay,
  getStemDisplay,
  heavenlyStemDisplays,
  mbtiFunctionDisplays,
  mbtiPreferenceDisplays,
  reportTableElementColorTokens,
} from "../../../src/lib/report-tables/displayDictionaries";

describe("report table display dictionaries", () => {
  it("resolves all 10 heavenly stems", () => {
    const stems = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];

    expect(Object.keys(heavenlyStemDisplays)).toHaveLength(10);
    expect(stems.map((stem) => getStemDisplay(stem).hanja)).toEqual(stems);
    expect(getStemDisplay("甲")).toMatchObject({
      ko: "갑",
      element: "wood",
      yinYang: "yang",
      colorToken: "wood-green",
    });
    expect(getStemDisplay("癸")).toMatchObject({
      ko: "계",
      element: "water",
      yinYang: "yin",
      colorToken: "water-sky",
    });
  });

  it("resolves all 12 earthly branches", () => {
    const branches = [
      "子",
      "丑",
      "寅",
      "卯",
      "辰",
      "巳",
      "午",
      "未",
      "申",
      "酉",
      "戌",
      "亥",
    ];

    expect(Object.keys(earthlyBranchDisplays)).toHaveLength(12);
    expect(branches.map((branch) => getBranchDisplay(branch).hanja)).toEqual(
      branches,
    );
    expect(getBranchDisplay("子")).toMatchObject({
      ko: "자",
      element: "water",
      yinYang: "yang",
      colorToken: "water-sky",
    });
    expect(getBranchDisplay("亥")).toMatchObject({
      ko: "해",
      element: "water",
      yinYang: "yin",
      colorToken: "water-sky",
    });
  });

  it("defines all five element color tokens", () => {
    expect(reportTableElementColorTokens).toEqual({
      wood: "wood-green",
      fire: "fire-red",
      earth: "earth-soil",
      metal: "metal-gold",
      water: "water-sky",
    });
    expect(getElementColorToken("wood")).toBe("wood-green");
    expect(getElementColorToken("fire")).toBe("fire-red");
    expect(getElementColorToken("earth")).toBe("earth-soil");
    expect(getElementColorToken("metal")).toBe("metal-gold");
    expect(getElementColorToken("water")).toBe("water-sky");
  });

  it("keeps earth and metal color tokens distinct", () => {
    expect(getElementColorToken("earth")).not.toBe(
      getElementColorToken("metal"),
    );
  });

  it("throws for unsupported stem and branch values", () => {
    expect(() => getStemDisplay("A")).toThrow("Unsupported heavenly stem: A");
    expect(() => getBranchDisplay("A")).toThrow("Unsupported earthly branch: A");
  });

  it("defines MBTI preference display values", () => {
    expect(Object.keys(mbtiPreferenceDisplays)).toEqual([
      "E",
      "I",
      "S",
      "N",
      "T",
      "F",
      "J",
      "P",
    ]);
    expect(getMbtiPreferenceDisplay("E")).toMatchObject({
      code: "E",
      nameKo: "외향",
      nameEn: "Extravert",
    });
    expect(getMbtiPreferenceDisplay("N")).toMatchObject({
      code: "N",
      nameKo: "직관",
      nameEn: "iNtuition",
    });
  });

  it("defines MBTI cognitive function display values", () => {
    expect(Object.keys(mbtiFunctionDisplays)).toEqual([
      "Te",
      "Ti",
      "Fe",
      "Fi",
      "Se",
      "Si",
      "Ne",
      "Ni",
    ]);
    expect(getMbtiFunctionDisplay("Te")).toMatchObject({
      code: "Te",
      nameKo: "외향 사고",
      attitude: "외향",
      domain: "사고",
    });
    expect(getMbtiFunctionDisplay("Fi")).toMatchObject({
      code: "Fi",
      nameKo: "내향 감정",
      attitude: "내향",
      domain: "감정",
    });
  });

  it("throws for unsupported MBTI display values", () => {
    expect(() => getMbtiPreferenceDisplay("A")).toThrow(
      "Unsupported MBTI preference code: A",
    );
    expect(() => getMbtiFunctionDisplay("Tx")).toThrow(
      "Unsupported MBTI function code: Tx",
    );
  });
});
