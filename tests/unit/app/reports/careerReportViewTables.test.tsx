import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import {
  CareerReportView,
} from "../../../../src/app/reports/[reportId]/CareerReportView";
import type {
  CareerReportDraft,
} from "../../../../src/lib/report-generation/careerReportDraftTypes";
import {
  buildCareerReportEvidence,
} from "../../../../src/lib/report-knowledge/careerReportEvidence";
import {
  requireCareerReportFixture,
} from "../../../../src/lib/report-knowledge/careerReportFixtures";

const draft: CareerReportDraft = {
  version: "v1",
  productType: "career_money_study",
  productVersion: "v1",
  personLabel: "덕민",
  openingTitle: "직업 구조를 먼저 잡는 리포트",
  openingSummary: "일, 돈, 공부의 흐름을 하나의 구조로 정리합니다.",
  coreLine: "자원과 구조를 다루는 힘을 일의 기준으로 삼습니다.",
  userContextSummary: {
    lifeStatusLabel: "직장인",
    fieldLabel: "개발·서비스 기획",
    relationshipStatusLabel: null,
    contextNote: "현재 직업은 비교 기준으로만 사용합니다.",
  },
  careerIdentity: {
    headline: "운영형 기획자",
    archetypeLabel: "구조를 세우는 사람",
    body: "문제를 작게 쪼개고 실행 단위로 바꾸는 데 강합니다.",
    strongestFit: "기획, 운영, 정산 구조",
    biggestRisk: "속도만 앞세우는 환경",
  },
  myeongliMbtiSummary: {
    myeongliCore: "명리는 자원과 구조를 강조합니다.",
    mbtiCore: "MBTI는 목표 중심 행동을 보조 근거로 보여줍니다.",
    combinedReading: "명리와 MBTI는 같은 뜻이 아니라 서로 다른 근거입니다.",
    alignment: "mixed",
    tensionNote: null,
  },
  recommendedJobs: [
    {
      title: "서비스 기획자",
      fit: "high",
      tagline: "구조를 제품으로 바꾸는 역할",
      reason: "요구사항을 정리하고 실행 흐름으로 바꾸는 데 맞습니다.",
      caution: "혼자 판단을 끝내면 협업 속도가 흔들립니다.",
      exampleFields: ["핀테크", "정산", "운영 자동화"],
    },
  ],
  unsuitableJobs: [
    {
      title: "반복 응대 중심 업무",
      reason: "판단권 없이 반복만 요구하면 장점이 살아나기 어렵습니다.",
      warning: "성장 기준이 없으면 소진이 빨라집니다.",
    },
  ],
  careerPaths: [
    {
      label: "커리어",
      fit: "high",
      headline: "기획과 운영을 연결합니다",
      body: "요구사항, 정책, 데이터 흐름을 함께 잡는 방식이 맞습니다.",
      push: ["정산 구조 문서화"],
      avoid: ["근거 없는 속도전"],
    },
  ],
  moneyEarningStyle: {
    headline: "구조를 만든 뒤 수입을 키웁니다",
    body: "단발 수입보다 반복 가능한 수입 구조가 맞습니다.",
    bestIncomeChannels: ["프로젝트 수입", "운영 개선"],
    riskyIncomeChannels: ["충동 확장"],
    sideIncomeIdeas: ["템플릿화", "자동화 도구"],
  },
  investmentAndSavingStyle: {
    headline: "분산과 한도 설정이 먼저입니다",
    body: "빠른 판단보다 손실 한도와 검증 절차가 필요합니다.",
    suitablePatterns: ["분산", "정기 점검"],
    cautionPatterns: ["레버리지", "확신 매수"],
    forbiddenNote: "금융 자문이 아니며 수익을 보장하지 않습니다.",
  },
  careerTiming: [
    {
      year: 2026,
      label: "정리",
      headline: "구조를 재정렬하는 해",
      body: "기준을 다시 잡고 우선순위를 줄이는 흐름입니다.",
      push: ["업무 범위 정리"],
      avoid: ["무리한 확장"],
    },
  ],
  studyCertificatePlan: {
    headline: "실무 포트폴리오 중심",
    body: "자격증보다 사례 정리가 더 강한 증거가 됩니다.",
    recommendedCertificates: ["데이터 분석"],
    recommendedStudyMethods: ["케이스 정리"],
    portfolioStrategy: ["문제-해결-결과 구조"],
    avoidStudyPatterns: ["목표 없는 강의 수집"],
  },
  actionPlan: [
    {
      label: "직업",
      headline: "핵심 역할을 좁힙니다",
      body: "기획과 운영 중 강한 축을 먼저 정합니다.",
      firstAction: "최근 프로젝트 3개를 역할별로 분류합니다.",
    },
    {
      label: "커리어",
      headline: "성과 기준을 문장화합니다",
      body: "무엇을 개선했는지 숫자와 흐름으로 정리합니다.",
      firstAction: "성과 문장 5개를 작성합니다.",
    },
    {
      label: "돈",
      headline: "고정비를 먼저 잡습니다",
      body: "현금 흐름 기준을 세우면 선택이 단순해집니다.",
      firstAction: "월 고정비를 한 표로 정리합니다.",
    },
    {
      label: "투자·저축",
      headline: "한도를 정합니다",
      body: "한도 없는 판단을 줄입니다.",
      firstAction: "손실 한도와 점검일을 적습니다.",
    },
    {
      label: "학업·자격증",
      headline: "실무와 연결합니다",
      body: "공부 결과를 포트폴리오로 남깁니다.",
      firstAction: "한 가지 사례를 문서화합니다.",
    },
    {
      label: "포트폴리오",
      headline: "케이스를 쌓습니다",
      body: "작은 개선 사례를 반복해서 남깁니다.",
      firstAction: "문제 해결 기록 템플릿을 만듭니다.",
    },
  ],
  riskWarnings: [
    {
      title: "과속 판단",
      body: "검증을 줄이면 설득 비용이 커집니다.",
      prevention: "결정 전에 반대 근거를 하나 적습니다.",
    },
  ],
  safetyNotes: ["자기이해용 참고 콘텐츠입니다.", "금융 자문이 아닙니다."],
};

function buildEvidence() {
  const fixture = requireCareerReportFixture("deokmin-career");

  return buildCareerReportEvidence({
    fixtureId: fixture.id,
    person: fixture.person,
  });
}

describe("CareerReportView common table slots", () => {
  it("renders actual common tables when evidencePacket is provided", () => {
    const html = renderToStaticMarkup(
      <CareerReportView draft={draft} evidencePacket={buildEvidence()} />,
    );

    expect(html).toContain("덕민님의 만세력");
    expect(html).toContain("지장간");
    expect(html).toContain("십이운성");
    expect(html).toContain("십이신살");
    expect(html).toContain("신살/귀인");
    expect(html).toContain("합충형파해");
    expect(html).toContain("이번 리포트에서 실제로 쓰는 명리 근거");
    expect(html).toContain("편재");
    expect(html).toContain("정재");
    expect(html).toContain("현침살");
    expect(html).toContain("천을귀인");
    expect(html).toContain("문서형 공부");
    expect(html).toContain("ENTJ 대담한 통솔자");
    expect(html).toContain("가까운 키워드");
    expect(html).toContain("먼 키워드");
    expect(html).toContain("선호 지표와 기능 서열 자세히 보기");
    expect(html).not.toContain("선호 지표 비교");
    expect(html).not.toContain("리포트 활용 포인트");
    expect(html).not.toContain("외향 사고");
    expect(html).not.toContain("career 섹션");
    expect(html).not.toContain("workplace 문장");
    expect(html).not.toContain("money 섹션");
    expect(html).not.toContain("investment 섹션");
    expect(html).not.toContain("study 섹션");
  });

  it("keeps dense body sections without repeating job fields and action labels", () => {
    const expandedDraft: CareerReportDraft = {
      ...draft,
      recommendedJobs: Array.from({ length: 8 }, (_, index) => ({
        title: `추천 직업 ${index + 1}`,
        fit: index < 4 ? "high" : "medium",
        tagline: "구조를 결과로 바꾸는 역할",
        reason: "요구사항을 정리하고 실행 흐름으로 바꾸는 데 맞습니다.",
        caution: "협업 기준을 문서로 맞춰야 합니다.",
        exampleFields: ["핀테크", "정산", "운영 자동화"],
      })),
      careerTiming: [
        ...draft.careerTiming,
        {
          year: 2026,
          label: "실행",
          headline: "현재 실행 기준을 잡습니다",
          body: "올해 안에서 바로 줄일 것과 남길 것을 나눕니다.",
          push: ["성과 문장화"],
          avoid: ["범위 없는 책임"],
        },
      ],
      riskWarnings: [
        {
          title: "권한 없는 책임",
          body: "책임과 일정이 한쪽으로 몰립니다.",
          prevention: "역할, 돈, 일정 기준을 문서로 고정하고 회복 루틴을 일정에 넣습니다.",
        },
        {
          title: "성과 노출 부족",
          body: "결과물이 밖으로 보이지 않으면 평가에서 손해를 봅니다.",
          prevention: "역할, 돈, 일정 기준을 문서로 고정하고 회복 루틴을 일정에 넣습니다.",
        },
        {
          title: "회복 루틴 부족",
          body: "과열되기 쉬운 패턴이 있습니다.",
          prevention: "역할, 돈, 일정 기준을 문서로 고정하고 회복 루틴을 일정에 넣습니다.",
        },
        {
          title: "기준 없는 확장",
          body: "일과 돈을 동시에 넓히면 기준이 흐려집니다.",
          prevention: "역할, 돈, 일정 기준을 문서로 고정하고 회복 루틴을 일정에 넣습니다.",
        },
      ],
    };
    const html = renderToStaticMarkup(<CareerReportView draft={expandedDraft} />);

    expect(html).toContain("주요 예시 분야");
    expect(html.match(/주요 예시 분야/g)).toHaveLength(1);
    expect(html).toContain("나머지 추천 직업 2개 더 보기");
    expect(html).toContain("정리 · 연도별 흐름");
    expect(html).toContain("현재 실행 기준");
    expect(html).toContain("지금 바로 조정할 기준");
    expect(html).not.toContain("실행 · 현재 실행 기준");
    expect(html).not.toContain("2026 · 현재 실행 기준");
    expect(html).toContain("바로 할 일");
    expect(html).toContain("줄이는 방법");
    expect(html).toContain("역할 범위와 승인선을 문서로 고정합니다.");
    expect(html).toContain("주간 산출물과 포트폴리오 기록을 남깁니다.");
    expect(html).toContain("휴식과 정리 시간을 캘린더에 먼저 고정합니다.");
    expect(html).toContain("투입 한도, 회수 시점, 철수 기준을 숫자로 정합니다.");
    expect(html).not.toContain("역할, 돈, 일정 기준을 문서로 고정하고 회복 루틴을 일정에 넣습니다.");
    expect(html).not.toContain("첫 행동:");
    expect(html).not.toContain("예방:");
  });
});
