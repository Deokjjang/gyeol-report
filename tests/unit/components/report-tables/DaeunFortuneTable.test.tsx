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
      yearDetail: {
        myeongliSummary: "2026년 丙午 연운은 식신 흐름으로 대운 戊辰 안에서 결과물을 압박합니다.",
        daeunAnnualRelation: "대운 위에 연운이 올라와 실행 압력이 커지는 해입니다.",
        natalAnnualRelation: "辰申 반합 수 흐름: 생각과 회복, 정보 흐름이 부분적으로 살아나는 장면입니다.",
        careerWork: "직업·일에서는 책임 범위를 먼저 좁힙니다.",
        moneyResource: "돈·자원에서는 계약과 정산 기준을 숫자로 확인합니다.",
        relationshipLove: "관계·연애에서는 연락과 거리 기준이 중요합니다.",
        healthRoutine: "건강관리·생활 리듬에서는 회복 시간을 먼저 고정합니다.",
        socialFamily: "사회·가족에서는 역할 기대를 먼저 조율합니다.",
        studyGrowth: "공부·성장에서는 배운 것을 문서로 남깁니다.",
        mbtiExpression: "ENTJ는 이 흐름을 빠른 결정과 실행 압력으로 드러내기 쉽습니다.",
        caution: "주의할 패턴은 권한 없는 책임을 떠안는 것입니다.",
        actionStandard: "실행 기준은 역할, 돈, 회복 루틴을 하나씩 고정하는 것입니다.",
      },
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
      yearDetail: {
        myeongliSummary: "2027년 丁未 연운은 상관 흐름으로 표현과 결과물을 자극합니다.",
        daeunAnnualRelation: "대운의 장기 배경 안에서 초반 기준을 시험하는 해입니다.",
        natalAnnualRelation: "원국·세운 작용은 생활 리듬과 역할 조율로 풀어 읽습니다.",
        careerWork: "직업·일에서는 보고와 결과물 기준을 맞춥니다.",
        moneyResource: "돈·자원에서는 반복 지출을 확인합니다.",
        relationshipLove: "관계·연애에서는 말의 온도를 조절합니다.",
        healthRoutine: "건강관리·생활 리듬에서는 무리한 마감을 줄입니다.",
        socialFamily: "사회·가족에서는 부탁의 범위를 좁힙니다.",
        studyGrowth: "공부·성장에서는 포트폴리오를 정리합니다.",
        mbtiExpression: "ENTJ는 기준을 먼저 세우려 하지만 회복 시간을 같이 잡아야 합니다.",
        caution: "주의할 패턴은 말과 일정이 앞서는 것입니다.",
        actionStandard: "실행 기준은 기록과 회고를 남기는 것입니다.",
      },
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

  it("renders annual comparison before the ten-year timeline", () => {
    const html = renderToStaticMarkup(<DaeunFortuneTable data={tableData} />);

    expect(html.indexOf("대운 · 연운")).toBeLessThan(
      html.indexOf("대운 타임라인"),
    );
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

  it("renders yearly accordion details with domain and MBTI markers", () => {
    const html = renderToStaticMarkup(<DaeunFortuneTable data={tableData} />);

    for (const marker of [
      "직업·일",
      "돈·자원",
      "관계·연애",
      "건강관리·생활 리듬",
      "사회·가족",
      "공부·성장",
      "MBTI 발현",
      "주의할 패턴",
      "실행 기준",
      "辰申 반합 수 흐름: 생각과 회복",
    ]) {
      expect(html).toContain(marker);
    }
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
