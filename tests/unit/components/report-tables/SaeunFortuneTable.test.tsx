import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import SaeunFortuneTable from "../../../../src/components/report-tables/SaeunFortuneTable";
import type { SaeunFortuneTableData } from "../../../../src/lib/report-tables/types";

const monthlyRows: SaeunFortuneTableData["firstHalfMonthlyTable"]["rows"] = [
  {
    month: 1,
    monthLabel: "1월",
    monthlyPillar: "己丑",
    stemCell: {
      hanja: "己",
      ko: "기",
      tenGod: "정재",
      element: "earth",
      yinYang: "yin",
      colorToken: "earth-soil",
    },
    branchCell: {
      hanja: "丑",
      ko: "축",
      tenGod: "정재",
      element: "earth",
      yinYang: "yin",
      colorToken: "earth-soil",
    },
    hiddenStems: ["癸", "辛", "己"],
    twelveLifeStage: ["관대"],
    twelveSinsal: ["월살"],
    sinsalAndGwiin: ["망신살", "천을귀인"],
    interactions: ["축오해"],
    oneLine: "계약과 지출 기준을 다시 세우는 달",
    caution: "조건 확인",
    basis: "달력월 기준 운영 가이드",
  },
  ...Array.from({ length: 11 }, (_, index) => {
    const month = index + 2;

    return {
      month,
      monthLabel: `${month}월`,
      monthlyPillar: month === 7 ? "乙未" : "甲子",
      stemCell: {
        hanja: month === 7 ? "乙" : "甲",
        ko: month === 7 ? "을" : "갑",
        tenGod: null,
        element: "wood",
        yinYang: month === 7 ? "yin" : "yang",
        colorToken: "wood-green",
      },
      branchCell: {
        hanja: month === 7 ? "未" : "子",
        ko: month === 7 ? "미" : "자",
        tenGod: null,
        element: month === 7 ? "earth" : "water",
        yinYang: month === 7 ? "yin" : "yang",
        colorToken: month === 7 ? "earth-soil" : "water-sky",
      },
      hiddenStems: [],
      twelveLifeStage: [],
      twelveSinsal: [],
      sinsalAndGwiin: [],
      interactions: [],
      oneLine: `${month}월 운영 포인트`,
      caution: null,
      basis: "달력월 기준 운영 가이드",
    } as const;
  }),
];

const tableData: SaeunFortuneTableData = {
  title: "정덕민님의 2026년 세운표",
  selectedYear: 2026,
  daeunAnnualCompareTable: {
    daeunStem: {
      hanja: "戊",
      ko: "무",
      tenGod: "편재",
      element: "earth",
      yinYang: "yang",
      colorToken: "earth-soil",
    },
    daeunBranch: {
      hanja: "辰",
      ko: "진",
      tenGod: "편재",
      element: "earth",
      yinYang: "yang",
      colorToken: "earth-soil",
    },
    annualStem: {
      hanja: "丙",
      ko: "병",
      tenGod: "식신",
      element: "fire",
      yinYang: "yang",
      colorToken: "fire-red",
    },
    annualBranch: {
      hanja: "午",
      ko: "오",
      tenGod: "상관",
      element: "fire",
      yinYang: "yang",
      colorToken: "fire-red",
    },
    hiddenStems: {
      daeun: ["乙", "癸", "戊"],
      annual: ["丁", "己"],
    },
    twelveLifeStage: {
      daeun: ["쇠"],
      annual: ["사"],
    },
    twelveSinsal: {
      daeun: ["반안살"],
      annual: ["육해살"],
    },
    sinsalAndGwiin: {
      daeun: ["귀문관살", "천을귀인"],
      annual: ["도화살", "문창귀인"],
    },
    interactions: {
      daeun: ["진술충"],
      annual: ["오진 관계 없음"],
    },
  },
  firstHalfMonthlyTable: {
    half: "first",
    title: "월운 - 상반기",
    monthRangeLabel: "1월~6월",
    rows: monthlyRows.slice(0, 6),
  },
  secondHalfMonthlyTable: {
    half: "second",
    title: "월운 - 하반기",
    monthRangeLabel: "7월~12월",
    rows: monthlyRows.slice(6),
  },
};

describe("SaeunFortuneTable", () => {
  it("renders the table title", () => {
    const html = renderToStaticMarkup(<SaeunFortuneTable data={tableData} />);

    expect(html).toContain("정덕민님의 2026년 세운표");
  });

  it("renders daeun and annual comparison table", () => {
    const html = renderToStaticMarkup(<SaeunFortuneTable data={tableData} />);

    for (const marker of [
      "대운 · 연운",
      "연운 (2026)",
      "戊",
      "辰",
      "丙",
      "午",
      "편재",
      "식신",
      "상관",
      "지장간",
      "십이운성",
      "십이신살",
      "신살·귀인",
      "합충형파해",
      "乙 · 癸 · 戊",
      "귀문관살 · 천을귀인",
    ]) {
      expect(html).toContain(marker);
    }
  });

  it("renders first and second half monthly labels", () => {
    const html = renderToStaticMarkup(<SaeunFortuneTable data={tableData} />);

    expect(html).toContain("월운 - 상반기");
    expect(html).toContain("1월~6월");
    expect(html).toContain("월운 - 하반기");
    expect(html).toContain("7월~12월");
  });

  it("renders all 12 monthly fortune rows", () => {
    const html = renderToStaticMarkup(<SaeunFortuneTable data={tableData} />);

    for (const month of Array.from({ length: 12 }, (_, index) => `${index + 1}월`)) {
      expect(html).toContain(month);
    }
    expect(html).toContain("己");
    expect(html).toContain("丑");
    expect(html).toContain("乙");
    expect(html).toContain("未");
    expect(html).toContain("계약과 지출 기준을 다시 세우는 달");
    expect(html).toContain("조건 확인");
    expect(html).toContain("달력월 기준 운영 가이드");
    expect(html).toContain("saeun-element-earth-soil");
    expect(html).toContain("saeun-element-wood-green");
    expect(html).toContain("max-w-full overflow-x-auto overscroll-x-contain");
    expect(html).toContain("min-w-full sm:min-w-[42rem]");
    expect(html).toContain("break-words");
    expect(html).toContain("overflow-wrap:anywhere");
  });

  it("renders safe empty state for empty monthly sections", () => {
    const html = renderToStaticMarkup(
      <SaeunFortuneTable
        data={{
          ...tableData,
          firstHalfMonthlyTable: {
            ...tableData.firstHalfMonthlyTable,
            rows: [],
          },
          secondHalfMonthlyTable: {
            ...tableData.secondHalfMonthlyTable,
            rows: [],
          },
        }}
      />,
    );

    expect(html).toContain("월운 - 상반기");
    expect(html).toContain("월운 - 하반기");
    expect(html).toContain(">-</div>");
  });

  it("hides table content when defaultOpen is false", () => {
    const html = renderToStaticMarkup(
      <SaeunFortuneTable data={tableData} defaultOpen={false} />,
    );

    expect(html).toContain("정덕민님의 2026년 세운표");
    expect(html).toContain('aria-expanded="false"');
    expect(html).toContain("펼치기");
    expect(html).not.toContain("대운 · 연운");
    expect(html).not.toContain("월운 - 상반기");
    expect(html).not.toContain("1월");
  });
});
