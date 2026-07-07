import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import ManseRyeokCommonTable from "../../../../src/components/report-tables/ManseRyeokCommonTable";
import type { ManseRyeokCommonTableData } from "../../../../src/lib/report-tables/types";

const tableData: ManseRyeokCommonTableData = {
  title: "정덕민님의 만세력",
  columns: [
    { key: "hour", label: "시주" },
    { key: "day", label: "일주" },
    { key: "month", label: "월주" },
    { key: "year", label: "연주" },
  ],
  stemRow: {
    hour: {
      hanja: "戊",
      ko: "무",
      tenGod: "편재",
      element: "earth",
      yinYang: "yang",
      colorToken: "earth-soil",
    },
    day: {
      hanja: "甲",
      ko: "갑",
      tenGod: "비견",
      element: "wood",
      yinYang: "yang",
      colorToken: "wood-green",
    },
    month: {
      hanja: "辛",
      ko: "신",
      tenGod: "정관",
      element: "metal",
      yinYang: "yin",
      colorToken: "metal-gold",
    },
    year: {
      hanja: "己",
      ko: "기",
      tenGod: "정재",
      element: "earth",
      yinYang: "yin",
      colorToken: "earth-soil",
    },
  },
  branchRow: {
    hour: {
      hanja: "辰",
      ko: "진",
      tenGod: "편재",
      element: "earth",
      yinYang: "yang",
      colorToken: "earth-soil",
    },
    day: {
      hanja: "申",
      ko: "신",
      tenGod: "편관",
      element: "metal",
      yinYang: "yang",
      colorToken: "metal-gold",
    },
    month: {
      hanja: "未",
      ko: "미",
      tenGod: "정재",
      element: "earth",
      yinYang: "yin",
      colorToken: "earth-soil",
    },
    year: {
      hanja: "卯",
      ko: "묘",
      tenGod: "겁재",
      element: "wood",
      yinYang: "yin",
      colorToken: "wood-green",
    },
  },
  fiveElementDistribution: {
    basisLabel: "천간·지지 8글자 기준",
    items: [
      {
        element: "wood",
        label: "목",
        count: 2,
        colorToken: "wood-green",
      },
      {
        element: "fire",
        label: "화",
        count: 0,
        colorToken: "fire-red",
      },
      {
        element: "earth",
        label: "토",
        count: 4,
        colorToken: "earth-soil",
      },
      {
        element: "metal",
        label: "금",
        count: 2,
        colorToken: "metal-gold",
      },
      {
        element: "water",
        label: "수",
        count: 0,
        colorToken: "water-sky",
      },
    ],
  },
  detailRows: [
    {
      key: "hiddenStems",
      label: "지장간",
      cells: {
        hour: ["乙", "癸", "戊"],
        day: ["戊", "壬", "庚"],
        month: ["丁", "乙", "己"],
        year: ["癸"],
      },
    },
    {
      key: "twelveLifeStage",
      label: "십이운성",
      cells: {
        hour: ["쇠"],
        day: ["절"],
        month: ["묘"],
        year: ["태"],
      },
    },
    {
      key: "twelveSinsal",
      label: "십이신살",
      cells: {
        hour: ["반안살"],
        day: ["겁살"],
        month: ["화개살"],
        year: ["육해살"],
      },
    },
    {
      key: "sinsalAndGwiin",
      label: "신살·귀인",
      cells: {
        hour: ["귀문관살"],
        day: ["남연살", "현침살"],
        month: [],
        year: ["천을귀인"],
      },
    },
    {
      key: "interactions",
      label: "합충형파해",
      cells: {
        hour: ["감기합→토"],
        day: [],
        month: ["묘미합"],
        year: [],
      },
    },
  ],
};

describe("ManseRyeokCommonTable", () => {
  it("renders the table title", () => {
    const html = renderToStaticMarkup(
      <ManseRyeokCommonTable data={tableData} />,
    );

    expect(html).toContain("정덕민님의 만세력");
  });

  it("renders fixed pillar columns", () => {
    const html = renderToStaticMarkup(
      <ManseRyeokCommonTable data={tableData} />,
    );

    for (const label of ["시주", "일주", "월주", "연주"]) {
      expect(html).toContain(label);
    }
  });

  it("renders heavenly stem and earthly branch cards", () => {
    const html = renderToStaticMarkup(
      <ManseRyeokCommonTable data={tableData} />,
    );

    for (const marker of ["戊", "辰", "甲", "申", "비견", "편관"]) {
      expect(html).toContain(marker);
    }
    expect(html).toContain("manse-element-wood-green");
    expect(html).toContain("manse-element-fire-red");
    expect(html).toContain("manse-element-earth-soil");
    expect(html).toContain("manse-element-metal-gold");
    expect(html).toContain("manse-element-water-sky");
  });

  it("renders detail rows", () => {
    const html = renderToStaticMarkup(
      <ManseRyeokCommonTable data={tableData} />,
    );

    for (const marker of [
      "지장간",
      "십이운성",
      "십이신살",
      "신살·귀인",
      "합충형파해",
      "남연살 · 현침살",
      "감기합→토",
    ]) {
      expect(html).toContain(marker);
    }
  });

  it("renders the five-element distribution including zero counts", () => {
    const html = renderToStaticMarkup(
      <ManseRyeokCommonTable data={tableData} />,
    );

    for (const marker of [
      "오행 분포",
      "기준: 천간·지지 8글자 기준",
      "manse-five-element-grid",
      "목 2",
      "화 0",
      "토 4",
      "금 2",
      "수 0",
    ]) {
      expect(html).toContain(marker);
    }
    expect(html).toContain('aria-label="목 2"');
    expect(html).not.toContain("sr-only");
  });

  it("renders hyphens for empty values", () => {
    const html = renderToStaticMarkup(
      <ManseRyeokCommonTable data={tableData} />,
    );

    expect(html).toContain("정보 없음");
    expect(html).toContain(">-</span>");
  });

  it("hides detail rows when every pillar cell is empty", () => {
    const html = renderToStaticMarkup(
      <ManseRyeokCommonTable
        data={{
          ...tableData,
          detailRows: [
            {
              key: "hiddenStems",
              label: "지장간",
              cells: {
                hour: [],
                day: [],
                month: [],
                year: [],
              },
            },
          ],
        }}
      />,
    );

    expect(html).not.toContain("지장간");
  });

  it("hides table content when defaultOpen is false", () => {
    const html = renderToStaticMarkup(
      <ManseRyeokCommonTable data={tableData} defaultOpen={false} />,
    );

    expect(html).toContain("정덕민님의 만세력");
    expect(html).toContain('aria-expanded="false"');
    expect(html).toContain("펼치기");
    expect(html).not.toContain("시주");
    expect(html).not.toContain("戊");
    expect(html).not.toContain("지장간");
  });
});
