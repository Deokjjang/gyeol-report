import { describe, expect, it } from "vitest";

import {
  buildSaeunFortuneTableData,
  type BuildSaeunFortuneTableDataInput,
} from "../../../src/lib/report-tables/saeunFortuneTableData";

const monthlyGanji = [
  "己丑",
  "庚寅",
  "辛卯",
  "壬辰",
  "癸巳",
  "甲午",
  "乙未",
  "丙申",
  "丁酉",
  "戊戌",
  "己亥",
  "庚子",
] as const;

const sampleInput: BuildSaeunFortuneTableDataInput = {
  displayName: "정덕민",
  selectedYear: 2026,
  currentDaeunCycle: {
    ganji: "戊辰",
    stemTenGod: "편재",
    branchTenGod: "편재",
    hiddenStems: ["乙", "癸", "戊"],
    twelveLifeStage: ["쇠"],
    twelveSinsal: ["반안살"],
    sinsal: ["귀문관살"],
    gwiin: ["천을귀인"],
    interactions: ["진술충"],
  },
  annualFortune: {
    year: 2026,
    ganji: "丙午",
    stemTenGod: "식신",
    branchTenGod: "상관",
    hiddenStems: ["丁", "己"],
    twelveLifeStage: ["사"],
    twelveSinsal: ["육해살"],
    sinsal: ["도화살"],
    gwiin: ["문창귀인"],
    interactions: ["오진 관계 없음"],
  },
  monthlyFortunes: monthlyGanji.map((ganji, index) => ({
    month: index + 1,
    monthLabel: `${index + 1}월`,
    monthGanji: ganji,
    stemTenGod: index === 0 ? "정재" : undefined,
    branchTenGod: index === 0 ? "정재" : undefined,
    hiddenStems: index === 0 ? ["癸", "辛", "己"] : undefined,
    twelveLifeStage: index === 0 ? ["관대"] : undefined,
    twelveSinsal: index === 0 ? ["월살"] : undefined,
    sinsal: index === 0 ? ["망신살"] : undefined,
    gwiin: index === 0 ? ["천을귀인"] : undefined,
    interactions: index === 0 ? ["축오해"] : undefined,
    oneLine: `${index + 1}월 운영 포인트`,
    caution: index === 0 ? "계약 조건 확인" : undefined,
    basis: "달력월 기준 운영 가이드",
  })),
};

describe("buildSaeunFortuneTableData", () => {
  it("splits 12 monthly fortune rows into first and second half tables", () => {
    const data = buildSaeunFortuneTableData(sampleInput);

    expect(data.title).toBe("정덕민님의 2026년 세운표");
    expect(data.selectedYear).toBe(2026);
    expect(data.firstHalfMonthlyTable).toMatchObject({
      half: "first",
      title: "월운 - 상반기",
      monthRangeLabel: "1월~6월",
    });
    expect(data.secondHalfMonthlyTable).toMatchObject({
      half: "second",
      title: "월운 - 하반기",
      monthRangeLabel: "7월~12월",
    });
    expect(data.firstHalfMonthlyTable.rows.map((row) => row.month)).toEqual([
      1, 2, 3, 4, 5, 6,
    ]);
    expect(data.secondHalfMonthlyTable.rows.map((row) => row.month)).toEqual([
      7, 8, 9, 10, 11, 12,
    ]);
  });

  it("fills each monthly stem and branch display data", () => {
    const data = buildSaeunFortuneTableData(sampleInput);
    const january = data.firstHalfMonthlyTable.rows[0];
    const july = data.secondHalfMonthlyTable.rows[0];

    expect(january).toMatchObject({
      month: 1,
      monthLabel: "1월",
      monthlyPillar: "己丑",
      oneLine: "1월 운영 포인트",
      caution: "계약 조건 확인",
      basis: "달력월 기준 운영 가이드",
    });
    expect(january?.stemCell).toMatchObject({
      hanja: "己",
      ko: "기",
      tenGod: "정재",
      element: "earth",
      yinYang: "yin",
      colorToken: "earth-soil",
    });
    expect(january?.branchCell).toMatchObject({
      hanja: "丑",
      ko: "축",
      tenGod: "정재",
      element: "earth",
      yinYang: "yin",
      colorToken: "earth-soil",
    });
    expect(july?.stemCell).toMatchObject({
      hanja: "乙",
      ko: "을",
      element: "wood",
      colorToken: "wood-green",
    });
    expect(july?.branchCell).toMatchObject({
      hanja: "未",
      ko: "미",
      element: "earth",
      colorToken: "earth-soil",
    });
  });

  it("builds daeun and annual comparison data", () => {
    const data = buildSaeunFortuneTableData(sampleInput);

    expect(data.daeunAnnualCompareTable.daeunStem).toMatchObject({
      hanja: "戊",
      ko: "무",
      tenGod: "편재",
      colorToken: "earth-soil",
    });
    expect(data.daeunAnnualCompareTable.annualStem).toMatchObject({
      hanja: "丙",
      ko: "병",
      tenGod: "식신",
      colorToken: "fire-red",
    });
    expect(data.daeunAnnualCompareTable.hiddenStems).toEqual({
      daeun: ["乙", "癸", "戊"],
      annual: ["丁", "己"],
    });
    expect(data.daeunAnnualCompareTable.sinsalAndGwiin).toEqual({
      daeun: ["귀문관살", "천을귀인"],
      annual: ["도화살", "문창귀인"],
    });
    expect(data.daeunAnnualCompareTable.interactions).toEqual({
      daeun: ["진술충"],
      annual: ["오진 관계 없음"],
    });
  });

  it("normalizes missing detail values to empty arrays and nulls", () => {
    const data = buildSaeunFortuneTableData({
      selectedYear: 2026,
      annualFortune: {
        ganji: "丙午",
      },
      monthlyFortunes: [
        {
          month: 1,
          monthGanji: "己丑",
        },
      ],
    });
    const january = data.firstHalfMonthlyTable.rows[0];

    expect(data.daeunAnnualCompareTable.daeunStem).toBeNull();
    expect(data.daeunAnnualCompareTable.hiddenStems).toEqual({
      daeun: [],
      annual: [],
    });
    expect(january).toMatchObject({
      monthLabel: "1월",
      hiddenStems: [],
      twelveLifeStage: [],
      twelveSinsal: [],
      sinsalAndGwiin: [],
      interactions: [],
      oneLine: null,
      caution: null,
      basis: null,
    });
  });

  it("throws for unsupported heavenly stems and earthly branches", () => {
    expect(() =>
      buildSaeunFortuneTableData({
        ...sampleInput,
        annualFortune: {
          ganji: "A午",
        },
      }),
    ).toThrow("Unsupported heavenly stem: A");

    expect(() =>
      buildSaeunFortuneTableData({
        ...sampleInput,
        monthlyFortunes: [
          {
            month: 1,
            monthGanji: "己X",
          },
        ],
      }),
    ).toThrow("Unsupported earthly branch: X");
  });
});
