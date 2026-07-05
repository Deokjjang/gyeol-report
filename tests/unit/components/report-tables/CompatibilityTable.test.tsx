import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import CompatibilityTable from "../../../../src/components/report-tables/CompatibilityTable";
import { buildCompatibilityTableData } from "../../../../src/lib/report-tables/compatibilityTableData";
import { buildManseRyeokCommonTableData } from "../../../../src/lib/report-tables/manseRyeokTableData";
import { buildMbtiCommonProfileTableData } from "../../../../src/lib/report-tables/mbtiProfileTableData";

const personAManseRyeok = buildManseRyeokCommonTableData({
  title: "A님의 만세력",
  fourPillarGrid: [
    {
      columnId: "day",
      heavenlyStem: "甲",
      earthlyBranch: "子",
      tenGod: ["천간 비견", "지지 정인"],
    },
  ],
});

const personBManseRyeok = buildManseRyeokCommonTableData({
  title: "B님의 만세력",
  fourPillarGrid: [
    {
      columnId: "day",
      heavenlyStem: "辛",
      earthlyBranch: "酉",
      tenGod: ["천간 정관", "지지 정관"],
    },
  ],
});

const personAMbti = buildMbtiCommonProfileTableData({
  type: "ENTJ",
  titleKo: "대담한 통솔자",
  archetype: "목표를 현실화하는 전략 지휘관",
  oneLine: "목표를 구조화해 실행하는 사람",
  summary: {
    identity: "목표와 기준을 먼저 잡는다.",
    strength: "역할과 방향을 빠르게 정리한다.",
    risk: "감정 온도를 생략하기 쉽다.",
    growthStrategy: "속도와 확인 시간을 분리한다.",
  },
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

const personBMbti = buildMbtiCommonProfileTableData({
  type: "ISFP",
  titleKo: "호기심 많은 예술가",
  archetype: "감각과 가치로 현재를 조율하는 사람",
  oneLine: "자기 기준과 현실 감각을 함께 쓰는 사람",
  summary: {
    identity: "현재의 감각과 자기 기준을 본다.",
    strength: "정서와 생활 온도를 섬세하게 살핀다.",
    risk: "불편함을 말보다 거리로 표현하기 쉽다.",
    growthStrategy: "감정과 요청을 함께 말한다.",
  },
  preferenceAxes: {
    energy: "I",
    perception: "S",
    judgment: "F",
    lifestyle: "P",
  },
  functionStack: {
    dominant: "Fi",
    auxiliary: "Se",
    tertiary: "Ni",
    inferior: "Te",
  },
});

const tableData = buildCompatibilityTableData({
  title: "A와 B의 궁합표",
  relationCategory: "businessPartner",
  personA: {
    label: "A",
    displayName: "정A",
    manseRyeok: personAManseRyeok,
    mbti: personAMbti,
  },
  personB: {
    label: "B",
    displayName: "정B",
    manseRyeok: personBManseRyeok,
    mbti: personBMbti,
  },
  connectionSummary: {
    compatibilityHeadline: "속도와 구조가 만나는 관계",
    overallTone: "강한 실행형 조합",
    myeongliConnectionSummary: "일간 기준으로 역할이 선명하다.",
    mbtiConnectionSummary: "목표 설정과 실행 기준이 빠르게 맞는다.",
    dayMasterRelation: "갑목과 신금",
    dayBranchRelation: "자유 관계",
    elementBalance: "목과 금의 긴장",
    tenGodRelation: "관성 중심",
    interactionLabels: ["합", "충"],
    sharedStrengths: ["실행력", "판단 속도"],
    frictionPoints: ["통제감", "감정 생략"],
    repairStrategy: "역할과 결정권을 먼저 분리한다.",
    timingNotes: ["계약 전 조건 정리", "분기별 재합의"],
  },
});

describe("CompatibilityTable", () => {
  it("renders the table title", () => {
    const html = renderToStaticMarkup(<CompatibilityTable data={tableData} />);

    expect(html).toContain("A와 B의 궁합표");
  });

  it("renders the relationCategory label", () => {
    const html = renderToStaticMarkup(<CompatibilityTable data={tableData} />);

    expect(html).toContain("사업/협업 궁합");
  });

  it("renders A and B person blocks", () => {
    const html = renderToStaticMarkup(<CompatibilityTable data={tableData} />);

    for (const marker of [
      "A 사람 요약",
      "정A",
      "A님의 만세력",
      "ENTJ 대담한 통솔자",
      "B 사람 요약",
      "정B",
      "B님의 만세력",
      "ISFP 호기심 많은 예술가",
    ]) {
      expect(html).toContain(marker);
    }
  });

  it("renders connection summary fields", () => {
    const html = renderToStaticMarkup(<CompatibilityTable data={tableData} />);

    for (const marker of [
      "연결/궁합 요약표",
      "궁합 헤드라인",
      "속도와 구조가 만나는 관계",
      "전체 톤",
      "강한 실행형 조합",
      "명리 연결 요약",
      "일간 기준으로 역할이 선명하다.",
      "MBTI 연결 요약",
      "목표 설정과 실행 기준이 빠르게 맞는다.",
      "일간 관계",
      "갑목과 신금",
      "일지 관계",
      "자유 관계",
      "오행 균형",
      "목과 금의 긴장",
      "십성 관계",
      "관성 중심",
      "관계 라벨",
      "합",
      "충",
      "공유 강점",
      "실행력",
      "마찰 지점",
      "통제감",
      "회복 전략",
      "역할과 결정권을 먼저 분리한다.",
      "타이밍 메모",
      "분기별 재합의",
    ]) {
      expect(html).toContain(marker);
    }
  });

  it("renders MBTI tables in compact mode with detail closed by default", () => {
    const html = renderToStaticMarkup(<CompatibilityTable data={tableData} />);

    expect(html).toContain("선호 지표와 기능 서열 자세히 보기");
    expect(html).toContain("핵심 요약");
    expect(html).not.toContain("선호 지표 비교");
    expect(html).not.toContain("리포트 활용 포인트");
  });

  it("handles empty and null fields safely", () => {
    const emptyData = buildCompatibilityTableData({
      title: "빈 궁합표",
      relationCategory: "friendship",
      personA: {
        label: "A",
        manseRyeok: personAManseRyeok,
      },
      personB: {
        label: "B",
        manseRyeok: personBManseRyeok,
      },
      connectionSummary: {},
    });
    const html = renderToStaticMarkup(<CompatibilityTable data={emptyData} />);

    expect(html).toContain("친구/인간관계 궁합");
    expect(html).toContain("A MBTI표");
    expect(html).toContain("B MBTI표");
    expect(html).toContain(">-</");
  });

  it("hides table content when defaultOpen is false", () => {
    const html = renderToStaticMarkup(
      <CompatibilityTable data={tableData} defaultOpen={false} />,
    );

    expect(html).toContain("A와 B의 궁합표");
    expect(html).toContain('aria-expanded="false"');
    expect(html).toContain("펼치기");
    expect(html).not.toContain("사업/협업 궁합");
    expect(html).not.toContain("A 사람 요약");
    expect(html).not.toContain("연결/궁합 요약표");
  });
});
