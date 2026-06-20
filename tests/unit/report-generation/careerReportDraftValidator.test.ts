import { describe, expect, it } from "vitest";

import {
  validateCareerReportDraft,
  summarizeCareerReportDraftQuality,
} from "../../../src/lib/report-generation/careerReportDraftValidator";
import type {
  CareerReportDraft,
} from "../../../src/lib/report-generation/careerReportDraftTypes";

function createValidDraft(): CareerReportDraft {
  return {
    version: "v1",
    productType: "career_money_study",
    productVersion: "v1",
    personLabel: "덕민",
    openingTitle: "운영형 PM 쪽에서 강점이 살아나는 구조",
    openingSummary:
      "직업, 돈, 공부를 현실 기준과 산출물 중심으로 묶어 보는 리포트입니다.",
    coreLine:
      "아이디어보다 요구사항·일정·성과 기준을 구조로 묶을 때 성과를 볼 가능성이 커집니다.",
    userContextSummary: {
      lifeStatusLabel: "직장인",
      fieldLabel: "개발·서비스 기획",
      relationshipStatusLabel: null,
      contextNote: "현재 직업과 분야를 해석 필터로 사용했습니다.",
    },
    careerIdentity: {
      headline: "운영형 기획자 / 전략형 PM",
      archetypeLabel: "operator_planner",
      body:
        "서비스 기획과 운영 기준을 함께 다룰 때 강점이 살아납니다.",
      strongestFit: "요구사항, 일정, 성과 기준을 구조로 묶는 자리",
      biggestRisk: "권한 없는 책임만 커지는 자리",
    },
    myeongliMbtiSummary: {
      myeongliCore: "재성·관성·토 과다가 현실 책임과 계약 감각을 키웁니다.",
      mbtiCore: "ENTJ는 전략, 효율, 구조화를 행동 방식으로 씁니다.",
      combinedReading:
        "명리의 현실 구조성과 MBTI의 추진력이 맞물려 PM/PO형 역할에 힘이 실립니다.",
      alignment: "aligned",
      tensionNote: null,
    },
    recommendedJobs: Array.from({ length: 8 }, (_, index) => ({
      title: [
        "서비스 기획자",
        "PM / PO",
        "프로젝트 매니저",
        "사업개발",
        "전략기획",
        "운영기획",
        "데이터 기반 기획",
        "B2B 서비스 기획",
      ][index] ?? `직업 ${index + 1}`,
      fit: index < 6 ? "high" : "medium",
      tagline: "요구사항과 성과 기준을 묶는 자리",
      reason: "현재 evidence와 맞는 실제 직무입니다.",
      caution: "역할 범위를 문서로 고정해야 합니다.",
      exampleFields: ["SaaS", "핀테크", "정산"],
    })),
    unsuitableJobs: [
      {
        title: "감정노동 중심 상담직",
        reason: "구조보다 감정 소모가 앞설 수 있습니다.",
        warning: "회복 루틴이 없으면 소진될 수 있습니다.",
      },
      {
        title: "반복 단순 업무",
        reason: "성과 증거가 남기 어렵습니다.",
        warning: "성장 설명력이 약해질 수 있습니다.",
      },
      {
        title: "산출물 없는 추상 기획",
        reason: "결과물이 없으면 장점이 보이지 않습니다.",
        warning: "평가 기준을 잡기 어렵습니다.",
      },
    ],
    careerPaths: [
      {
        label: "조직형 PM",
        fit: "high",
        headline: "운영 기준을 잡는 길",
        body: "프로젝트 요구사항과 일정, 성과 기준을 정리하는 경로입니다.",
        push: ["문서화", "보고 라인", "성과 기준"],
        avoid: ["구두 지시", "권한 없는 책임", "범위 없는 조율"],
      },
      {
        label: "사업개발",
        fit: "medium",
        headline: "계약과 외부 프로젝트를 다루는 길",
        body: "조건과 정산 기준을 숫자로 고정해야 합니다.",
        push: ["계약", "견적", "외부 프로젝트"],
        avoid: ["구두 약속", "무리한 확장", "조건 없는 협업"],
      },
      {
        label: "전문성 증명",
        fit: "medium",
        headline: "자격과 포트폴리오를 남기는 길",
        body: "공부를 산출물로 연결해야 합니다.",
        push: ["자격증", "SQL", "포트폴리오"],
        avoid: ["벼락치기", "요약만 읽기", "결과물 없는 공부"],
      },
    ],
    moneyEarningStyle: {
      headline: "계약과 정산 기준을 먼저 잡는 돈 흐름",
      body:
        "외부 프로젝트, 인센티브, 부업성 수익 접점은 열릴 수 있지만 조건을 숫자로 고정해야 합니다.",
      bestIncomeChannels: ["월급", "성과급", "외부 프로젝트"],
      riskyIncomeChannels: ["구두 돈거래", "조건 없는 협업", "감정 단타"],
      sideIncomeIdeas: ["기획 외주", "PM 템플릿", "운영 컨설팅"],
    },
    investmentAndSavingStyle: {
      headline: "단기 투기보다 분산·적립 방식",
      body:
        "우량주, ETF, 지수형, 장기 분산, 매달 일정 금액 적립식이 안정적으로 맞습니다.",
      suitablePatterns: ["우량주", "ETF", "장기 분산"],
      cautionPatterns: ["감정 단타", "구두 돈거래", "과도한 레버리지"],
      forbiddenNote:
        "이 내용은 성향 기반 해석이며 금융 자문이 아닙니다. 실제 투자는 본인의 판단과 별도 검토가 필요합니다.",
    },
    careerTiming: [
      {
        year: 2026,
        label: "산출물",
        headline: "첫 기준을 잡는 해",
        body: "포트폴리오와 운영 기준을 만들기 쉽습니다.",
        push: ["첫 산출물", "문서화", "운영 체계"],
        avoid: ["구두 지시", "무리한 일정", "범위 없는 책임"],
      },
      {
        year: 2028,
        label: "외부 프로젝트",
        headline: "수익화 접점이 늘어날 수 있는 해",
        body: "계약과 부업성 수익을 검토하기 쉬운 흐름입니다.",
        push: ["계약", "견적", "인센티브"],
        avoid: ["감정 투자", "구두 약속", "몰아가기"],
      },
      {
        year: 2029,
        label: "현금흐름",
        headline: "숫자를 고정하는 해",
        body: "고정비와 정산 기준을 점검하기 좋습니다.",
        push: ["현금흐름", "고정비", "정산"],
        avoid: ["방치", "불필요한 구독", "검토 없는 지출"],
      },
    ],
    studyCertificatePlan: {
      headline: "자격증보다 실무 증명까지 묶는 방식",
      body: "시험과 포트폴리오를 함께 가져가야 설명력이 생깁니다.",
      recommendedCertificates: ["SQL", "데이터 분석", "PM 실무"],
      recommendedStudyMethods: ["기출·오답", "주간 산출물", "피드백"],
      portfolioStrategy: ["문제 정의", "실행 과정", "숫자 결과"],
      avoidStudyPatterns: ["벼락치기", "요약만 읽기", "결과물 없는 공부"],
    },
    actionPlan: [
      {
        label: "직업",
        headline: "운영형 직무를 좁히기",
        body: "서비스 기획과 PM 중심으로 후보를 좁힙니다.",
        firstAction: "직무 공고 10개를 비교합니다.",
      },
      {
        label: "커리어",
        headline: "성과 기준을 남기기",
        body: "프로젝트에서 내 역할과 결과를 기록합니다.",
        firstAction: "성과 기록 템플릿을 만듭니다.",
      },
      {
        label: "돈",
        headline: "정산 기준 만들기",
        body: "수입과 고정비를 분리합니다.",
        firstAction: "월초 자동 분리를 설정합니다.",
      },
      {
        label: "투자·저축",
        headline: "분산·적립 우선",
        body: "감정 단타보다 정해진 금액을 쌓습니다.",
        firstAction: "월 적립 금액을 정합니다.",
      },
      {
        label: "학업·자격증",
        headline: "실무형 공부",
        body: "자격증과 실무 산출물을 연결합니다.",
        firstAction: "SQL 학습 계획을 잡습니다.",
      },
      {
        label: "포트폴리오",
        headline: "결과물화",
        body: "기획 문서를 케이스로 바꿉니다.",
        firstAction: "서비스 개선안을 1개 씁니다.",
      },
    ],
    riskWarnings: [
      {
        title: "권한 없는 책임",
        body: "역할 범위가 없으면 소모가 커집니다.",
        prevention: "R&R을 문서로 남기세요.",
      },
    ],
    safetyNotes: [
      "이 리포트는 직업·커리어·돈·학업 성향과 가능성을 해석한 것이며, 특정 결과를 보장하지 않습니다.",
      "투자 관련 문장은 성향 기반 해석이며 금융 자문이나 매수·매도 지시가 아닙니다.",
    ],
  };
}

describe("careerReportDraftValidator", () => {
  it("accepts a valid draft", () => {
    const validation = validateCareerReportDraft(createValidDraft());

    expect(validation.ok).toBe(true);
    expect(validation.value?.productType).toBe("career_money_study");
  });

  it("requires career_money_study product type and recommendedJobs minimum", () => {
    const draft = {
      ...createValidDraft(),
      productType: "major_fortune",
      recommendedJobs: createValidDraft().recommendedJobs.slice(0, 7),
    };
    const validation = validateCareerReportDraft(draft);

    expect(validation.ok).toBe(false);
    expect(validation.errors).toContain("CAREER_REPORT_PRODUCT_TYPE_INVALID");
    expect(validation.errors).toContain("CAREER_REPORT_RECOMMENDED_JOBS_TOO_SHORT");
  });

  it("enforces actionPlan six labels and investment forbiddenNote", () => {
    const draft = {
      ...createValidDraft(),
      actionPlan: createValidDraft().actionPlan.slice(0, 5),
      investmentAndSavingStyle: {
        ...createValidDraft().investmentAndSavingStyle,
        forbiddenNote: "",
      },
    };
    const validation = validateCareerReportDraft(draft);

    expect(validation.ok).toBe(false);
    expect(validation.errors).toContain("CAREER_REPORT_ACTION_PLAN_INVALID_LENGTH");
    expect(validation.errors).toContain("CAREER_REPORT_ACTION_PLAN_LABELS_INVALID");
    expect(validation.errors).toContain("CAREER_REPORT_INVESTMENT_STYLE_INVALID");
  });

  it("repairs safetyNotes", () => {
    const validation = validateCareerReportDraft({
      ...createValidDraft(),
      safetyNotes: ["반드시 돈을 법니다"],
    });

    expect(validation.ok).toBe(true);
    expect(validation.value?.safetyNotes.length).toBeGreaterThanOrEqual(2);
    expect(validation.warnings).toContain("CAREER_REPORT_SAFETY_NOTES_REPAIRED");
    expect(JSON.stringify(validation.value)).not.toContain("반드시");
    expect(JSON.stringify(validation.value)).not.toContain("돈을 법니다");
  });

  it("sanitizes hard claims, financial guarantees, tickers, and buy/sell instructions", () => {
    const draft = {
      ...createValidDraft(),
      coreLine:
        "반드시 이직합니다. AAPL 이 종목 매수하세요. 원금 보장과 투자 수익이 납니다.",
    };
    const validation = validateCareerReportDraft(draft);

    expect(validation.ok).toBe(true);
    expect(validation.warnings).toEqual(
      expect.arrayContaining([
        "CAREER_REPORT_HARD_CLAIM_SANITIZED",
        "CAREER_REPORT_FINANCIAL_GUARANTEE_SANITIZED",
        "CAREER_REPORT_TICKER_SANITIZED",
        "CAREER_REPORT_BUY_SELL_INSTRUCTION_SANITIZED",
      ]),
    );
    expect(JSON.stringify(validation.value)).not.toMatch(/AAPL|매수하세요|원금 보장/u);
  });

  it("allows strong safe investment phrases", () => {
    const draft = {
      ...createValidDraft(),
      investmentAndSavingStyle: {
        ...createValidDraft().investmentAndSavingStyle,
        body:
          "우량주, ETF, 장기분산, 적립식, 매달 일정 금액 방식이 안정적입니다. 외부 프로젝트 가능성이 커질 수 있습니다.",
      },
    };
    const validation = validateCareerReportDraft(draft);
    const quality = summarizeCareerReportDraftQuality(validation.value ?? draft);

    expect(validation.ok).toBe(true);
    expect(JSON.stringify(validation.value)).toContain("우량주");
    expect(JSON.stringify(validation.value)).toContain("ETF");
    expect(JSON.stringify(validation.value)).toContain("외부 프로젝트 가능성이 커질 수 있습니다");
    expect(quality.financialGuaranteeWarnings).toBe(0);
  });
});
