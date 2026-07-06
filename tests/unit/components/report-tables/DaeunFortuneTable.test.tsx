import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import DaeunFortuneTable from "../../../../src/components/report-tables/DaeunFortuneTable";
import type { DaeunFortuneTableData } from "../../../../src/lib/report-tables/types";

const tableData: DaeunFortuneTableData = {
  title: "정덕민님의 대운표",
  selectedYear: 2026,
  currentDaeun: {
    ganji: "戊辰",
    startYear: 2026,
    endYear: 2035,
    startAge: 28,
    endAge: 37,
    stem: {
      hanja: "戊",
      ko: "무",
      tenGod: "편재",
      element: "earth",
      yinYang: "yang",
      colorToken: "earth-soil",
    },
    branch: {
      hanja: "辰",
      ko: "진",
      tenGod: "편재",
      element: "earth",
      yinYang: "yang",
      colorToken: "earth-soil",
    },
  },
  timelineRows: [
    {
      year: 2026,
      age: 28,
      ageLabel: "28세",
      isCurrentYear: true,
      isTransitionYear: true,
      badges: ["올해", "전환"],
      daeunPillar: {
        ganji: "戊辰",
        stem: {
          hanja: "戊",
          ko: "무",
          tenGod: "편재",
          element: "earth",
          yinYang: "yang",
          colorToken: "earth-soil",
        },
        branch: {
          hanja: "辰",
          ko: "진",
          tenGod: "편재",
          element: "earth",
          yinYang: "yang",
          colorToken: "earth-soil",
        },
      },
      annualPillar: {
        ganji: "丙午",
        stem: {
          hanja: "丙",
          ko: "병",
          tenGod: "식신",
          element: "fire",
          yinYang: "yang",
          colorToken: "fire-red",
        },
        branch: {
          hanja: "午",
          ko: "오",
          tenGod: "상관",
          element: "fire",
          yinYang: "yang",
          colorToken: "fire-red",
        },
      },
      daeunTenGod: "편재",
      annualTenGod: "식신",
      keyInteractionLabel: "충: 부딪힘",
      oneLine: "대운이 시작되는 해",
      strategy: "속도를 내기 전에 기준을 고정한다.",
    },
    {
      year: 2027,
      age: 29,
      ageLabel: "29세",
      isCurrentYear: false,
      isTransitionYear: false,
      badges: [],
      daeunPillar: {
        ganji: "戊辰",
        stem: null,
        branch: null,
      },
      annualPillar: {
        ganji: "丁未",
        stem: null,
        branch: null,
      },
      daeunTenGod: "편재",
      annualTenGod: "상관",
      keyInteractionLabel: null,
      oneLine: "역할이 구체화되는 해",
      strategy: null,
    },
  ],
  annualCompareTable: {
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
};

describe("DaeunFortuneTable", () => {
  it("renders daeun timeline title, years, and ages", () => {
    const html = renderToStaticMarkup(<DaeunFortuneTable data={tableData} />);

    expect(html).toContain("정덕민님의 대운표");
    expect(html).toContain("대운 타임라인");
    expect(html).toContain("2026년");
    expect(html).toContain("28세");
    expect(html).toContain("2027년");
    expect(html).toContain("29세");
  });

  it("renders current year and transition badges", () => {
    const html = renderToStaticMarkup(<DaeunFortuneTable data={tableData} />);

    expect(html).toContain("daeun-current-year-row");
    expect(html).toContain("올해");
    expect(html).toContain("전환");
  });

  it("renders daeun and annual timeline pillars", () => {
    const html = renderToStaticMarkup(<DaeunFortuneTable data={tableData} />);

    expect(html).toContain("대운");
    expect(html).toContain("연운");
    expect(html).toContain("戊辰");
    expect(html).toContain("丙午");
    expect(html).toContain("충: 부딪힘");
    expect(html).toContain("대운이 시작되는 해");
  });

  it("renders daeun and annual comparison table", () => {
    const html = renderToStaticMarkup(<DaeunFortuneTable data={tableData} />);

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
      "오진 관계 없음",
    ]) {
      expect(html).toContain(marker);
    }
    expect(html).toContain("daeun-element-earth-soil");
    expect(html).toContain("daeun-element-fire-red");
  });

  it("keeps long timeline and detail text wrapped inside the table width", () => {
    const html = renderToStaticMarkup(<DaeunFortuneTable data={tableData} />);

    expect(html).toContain("max-w-full");
    expect(html).toContain("overflow-hidden");
    expect(html).toContain("break-words");
  });

  it("renders hyphens when detail lists are empty", () => {
    const html = renderToStaticMarkup(
      <DaeunFortuneTable
        data={{
          ...tableData,
          annualCompareTable: {
            ...tableData.annualCompareTable,
            hiddenStems: {
              daeun: [],
              annual: [],
            },
            twelveLifeStage: {
              daeun: [],
              annual: [],
            },
          },
        }}
      />,
    );

    expect(html).toContain(">-</div>");
  });

  it("hides table content when defaultOpen is false", () => {
    const html = renderToStaticMarkup(
      <DaeunFortuneTable data={tableData} defaultOpen={false} />,
    );

    expect(html).toContain("정덕민님의 대운표");
    expect(html).toContain('aria-expanded="false"');
    expect(html).toContain("펼치기");
    expect(html).not.toContain("대운 타임라인");
    expect(html).not.toContain("2026년");
    expect(html).not.toContain("대운 · 연운");
  });
});
