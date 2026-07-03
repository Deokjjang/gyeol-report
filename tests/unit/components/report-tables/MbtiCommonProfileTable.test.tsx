import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import MbtiCommonProfileTable from "../../../../src/components/report-tables/MbtiCommonProfileTable";
import type { MbtiCommonProfileTableData } from "../../../../src/lib/report-tables/types";

const tableData: MbtiCommonProfileTableData = {
  type: "ENTJ",
  titleKo: "대담한 통솔자",
  archetype: "목표를 현실화하는 전략 지휘관",
  oneLine:
    "비효율을 발견하면 구조를 새로 짜고 목표를 현실로 밀어붙이는 사람",
  preferenceRows: [
    {
      axisKey: "energy",
      label: "에너지 방향",
      selectedCode: "E",
      left: {
        code: "E",
        nameKo: "외향",
        nameEn: "Extravert",
        description: "외부 자극과 표현을 통해 에너지가 활성화된다.",
        selected: true,
      },
      right: {
        code: "I",
        nameKo: "내향",
        nameEn: "Introvert",
        description: "내면의 생각과 정리를 통해 에너지가 회복된다.",
        selected: false,
      },
    },
    {
      axisKey: "perception",
      label: "인식 방식",
      selectedCode: "N",
      left: {
        code: "S",
        nameKo: "감각",
        nameEn: "Sensing",
        description: "현실, 경험, 실용 정보에 먼저 주의를 둔다.",
        selected: false,
      },
      right: {
        code: "N",
        nameKo: "직관",
        nameEn: "iNtuition",
        description: "가능성, 의미, 패턴과 예측에 먼저 주의를 둔다.",
        selected: true,
      },
    },
    {
      axisKey: "judgment",
      label: "판단 방식",
      selectedCode: "T",
      left: {
        code: "T",
        nameKo: "사고",
        nameEn: "Thinking",
        description: "논리, 사실, 원칙을 기준으로 판단한다.",
        selected: true,
      },
      right: {
        code: "F",
        nameKo: "감정",
        nameEn: "Feeling",
        description: "관계, 가치, 사람에게 미치는 영향을 기준으로 판단한다.",
        selected: false,
      },
    },
    {
      axisKey: "lifestyle",
      label: "생활 양식",
      selectedCode: "J",
      left: {
        code: "J",
        nameKo: "판단",
        nameEn: "Judging",
        description: "목표, 계획, 절차를 정리해 안정감을 만든다.",
        selected: true,
      },
      right: {
        code: "P",
        nameKo: "인식",
        nameEn: "Perceiving",
        description: "자율성, 변화, 유동적인 선택지를 열어 둔다.",
        selected: false,
      },
    },
  ],
  functionRows: [
    {
      position: "dominant",
      label: "주 기능",
      code: "Te",
      nameKo: "외향 사고",
      attitude: "외향",
      domain: "사고",
      description: "목표, 기준, 성과를 바깥 세계에서 구조화하고 실행한다.",
      reportUsageNote: "업무, 돈, 의사결정에서 실행 기준과 효율성을 읽는다.",
    },
    {
      position: "auxiliary",
      label: "부 기능",
      code: "Ni",
      nameKo: "내향 직관",
      attitude: "내향",
      domain: "직관",
      description: "패턴의 핵심을 압축해 장기 방향과 의미를 읽는다.",
      reportUsageNote: "진로, 대운, 세운에서 장기 방향 감각을 읽는다.",
    },
    {
      position: "tertiary",
      label: "3차 기능",
      code: "Se",
      nameKo: "외향 감각",
      attitude: "외향",
      domain: "감각",
      description: "현재의 감각 정보와 현실적 기회를 즉각적으로 다룬다.",
      reportUsageNote: "현장 대응, 행동력, 소비와 경험 추구 방식을 읽는다.",
    },
    {
      position: "inferior",
      label: "열등 기능",
      code: "Fi",
      nameKo: "내향 감정",
      attitude: "내향",
      domain: "감정",
      description: "개인의 가치관과 진정성을 기준으로 선택한다.",
      reportUsageNote: "연애, 결혼, 성장에서 내적 기준과 상처 지점을 읽는다.",
    },
  ],
  coreSummary: [
    {
      key: "identity",
      label: "정체성",
      text: "ENTJ는 목표, 구조, 효율을 중심으로 움직인다.",
    },
    {
      key: "growthStrategy",
      label: "성장 전략",
      text: "성장은 추진력에 경청 절차를 붙이는 데 있다.",
    },
  ],
  closeKeywords: ["결과 중시", "리더십"],
  farKeywords: ["갈등 회피", "시간 낭비"],
  reportUsageNotes: [
    {
      categoryKey: "identity",
      id: "commanding_goal_builder",
      label: "목표 지휘관",
      plainKo: "공통 목표를 세우고 사람을 끌어모아 추진한다.",
      strongLine: "사람과 자원과 시간을 하나의 작전처럼 재배치한다.",
      positiveUse: "조직 운영과 프로젝트 리드에서 방향과 속도를 만든다.",
      risk: "사람을 자원처럼 다루는 인상을 줄 수 있다.",
      productDomains: ["general", "career"],
    },
  ],
};

describe("MbtiCommonProfileTable", () => {
  it("renders the type header", () => {
    const html = renderToStaticMarkup(
      <MbtiCommonProfileTable data={tableData} />,
    );

    for (const marker of [
      "ENTJ",
      "대담한 통솔자",
      "목표를 현실화하는 전략 지휘관",
      "비효율을 발견하면 구조를 새로 짜고 목표를 현실로 밀어붙이는 사람",
    ]) {
      expect(html).toContain(marker);
    }
  });

  it("renders four preference axis rows", () => {
    const html = renderToStaticMarkup(
      <MbtiCommonProfileTable data={tableData} />,
    );

    for (const marker of [
      "외향 Extravert",
      "내향 Introvert",
      "감각 Sensing",
      "직관 iNtuition",
      "사고 Thinking",
      "감정 Feeling",
      "판단 Judging",
      "인식 Perceiving",
    ]) {
      expect(html).toContain(marker);
    }
  });

  it("renders selected preference emphasis classes", () => {
    const html = renderToStaticMarkup(
      <MbtiCommonProfileTable data={tableData} />,
    );

    expect(html).toContain("mbti-preference-selected");
    expect(html.match(/mbti-preference-selected/g)).toHaveLength(8);
  });

  it("renders four function stack rows", () => {
    const html = renderToStaticMarkup(
      <MbtiCommonProfileTable data={tableData} />,
    );

    for (const marker of [
      "주 기능",
      "부 기능",
      "3차 기능",
      "열등 기능",
      "Te",
      "Ni",
      "Se",
      "Fi",
      "외향 사고",
      "내향 직관",
    ]) {
      expect(html).toContain(marker);
    }
  });

  it("renders close and far keywords", () => {
    const html = renderToStaticMarkup(
      <MbtiCommonProfileTable data={tableData} />,
    );

    for (const marker of ["결과 중시", "리더십", "갈등 회피", "시간 낭비"]) {
      expect(html).toContain(marker);
    }
  });

  it("renders report usage notes", () => {
    const html = renderToStaticMarkup(
      <MbtiCommonProfileTable data={tableData} />,
    );

    for (const marker of [
      "리포트 활용 포인트",
      "목표 지휘관",
      "공통 목표를 세우고 사람을 끌어모아 추진한다.",
      "사람과 자원과 시간을 하나의 작전처럼 재배치한다.",
      "general",
      "career",
    ]) {
      expect(html).toContain(marker);
    }
  });

  it("hides table content when defaultOpen is false", () => {
    const html = renderToStaticMarkup(
      <MbtiCommonProfileTable data={tableData} defaultOpen={false} />,
    );

    expect(html).toContain("ENTJ 대담한 통솔자");
    expect(html).toContain('aria-expanded="false"');
    expect(html).toContain("펼치기");
    expect(html).not.toContain("선호 지표 비교");
    expect(html).not.toContain("외향 Extravert");
    expect(html).not.toContain("목표 지휘관");
  });
});
