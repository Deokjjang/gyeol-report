import type {
  CareerReportEvidencePacket,
  CareerSignal,
} from "../report-knowledge/careerReportTypes";
import {
  USER_LIFE_STATUS_LABELS,
  USER_RELATIONSHIP_STATUS_LABELS,
} from "../report-knowledge/userContextTypes";

export type CareerActionPlanLabel =
  | "직업"
  | "커리어"
  | "돈"
  | "투자·저축"
  | "학업·자격증"
  | "포트폴리오";

export const careerActionPlanLabels = [
  "직업",
  "커리어",
  "돈",
  "투자·저축",
  "학업·자격증",
  "포트폴리오",
] as const satisfies readonly CareerActionPlanLabel[];

export interface CareerReportDraft {
  readonly version: "v1";
  readonly productType: "career_money_study";
  readonly productVersion: "v1";
  readonly personLabel: string;
  readonly openingTitle: string;
  readonly openingSummary: string;
  readonly coreLine: string;
  readonly userContextSummary: {
    readonly lifeStatusLabel: string;
    readonly fieldLabel: string | null;
    readonly relationshipStatusLabel: string | null;
    readonly contextNote: string;
  };
  readonly careerIdentity: {
    readonly headline: string;
    readonly archetypeLabel: string;
    readonly body: string;
    readonly strongestFit: string;
    readonly biggestRisk: string;
  };
  readonly myeongliMbtiSummary: {
    readonly myeongliCore: string;
    readonly mbtiCore: string;
    readonly combinedReading: string;
    readonly alignment: "aligned" | "mixed" | "tension" | "unknown";
    readonly tensionNote: string | null;
  };
  readonly recommendedJobs: readonly {
    readonly title: string;
    readonly fit: "high" | "medium" | "low";
    readonly tagline: string;
    readonly reason: string;
    readonly caution: string;
    readonly exampleFields: readonly string[];
  }[];
  readonly unsuitableJobs: readonly {
    readonly title: string;
    readonly reason: string;
    readonly warning: string;
  }[];
  readonly careerPaths: readonly {
    readonly label: string;
    readonly fit: "high" | "medium" | "low";
    readonly headline: string;
    readonly body: string;
    readonly push: readonly string[];
    readonly avoid: readonly string[];
  }[];
  readonly moneyEarningStyle: {
    readonly headline: string;
    readonly body: string;
    readonly bestIncomeChannels: readonly string[];
    readonly riskyIncomeChannels: readonly string[];
    readonly sideIncomeIdeas: readonly string[];
  };
  readonly investmentAndSavingStyle: {
    readonly headline: string;
    readonly body: string;
    readonly suitablePatterns: readonly string[];
    readonly cautionPatterns: readonly string[];
    readonly forbiddenNote: string;
  };
  readonly careerTiming: readonly {
    readonly year: number;
    readonly label: string;
    readonly headline: string;
    readonly body: string;
    readonly push: readonly string[];
    readonly avoid: readonly string[];
  }[];
  readonly studyCertificatePlan: {
    readonly headline: string;
    readonly body: string;
    readonly recommendedCertificates: readonly string[];
    readonly recommendedStudyMethods: readonly string[];
    readonly portfolioStrategy: readonly string[];
    readonly avoidStudyPatterns: readonly string[];
  };
  readonly actionPlan: readonly {
    readonly label: CareerActionPlanLabel;
    readonly headline: string;
    readonly body: string;
    readonly firstAction: string;
  }[];
  readonly riskWarnings: readonly {
    readonly title: string;
    readonly body: string;
    readonly prevention: string;
  }[];
  readonly safetyNotes: readonly string[];
}

const stringSchema = { type: "string" } as const;
const numberSchema = { type: "number" } as const;
const nullableStringSchema = { type: ["string", "null"] } as const;
const stringArraySchema = {
  type: "array",
  items: stringSchema,
} as const;

const fitSchema = {
  type: "string",
  enum: ["high", "medium", "low"],
} as const;

const userContextSummarySchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "lifeStatusLabel",
    "fieldLabel",
    "relationshipStatusLabel",
    "contextNote",
  ],
  properties: {
    lifeStatusLabel: stringSchema,
    fieldLabel: nullableStringSchema,
    relationshipStatusLabel: nullableStringSchema,
    contextNote: stringSchema,
  },
} as const;

const careerIdentitySchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "headline",
    "archetypeLabel",
    "body",
    "strongestFit",
    "biggestRisk",
  ],
  properties: {
    headline: stringSchema,
    archetypeLabel: stringSchema,
    body: stringSchema,
    strongestFit: stringSchema,
    biggestRisk: stringSchema,
  },
} as const;

const myeongliMbtiSummarySchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "myeongliCore",
    "mbtiCore",
    "combinedReading",
    "alignment",
    "tensionNote",
  ],
  properties: {
    myeongliCore: stringSchema,
    mbtiCore: stringSchema,
    combinedReading: stringSchema,
    alignment: {
      type: "string",
      enum: ["aligned", "mixed", "tension", "unknown"],
    },
    tensionNote: nullableStringSchema,
  },
} as const;

const recommendedJobSchema = {
  type: "object",
  additionalProperties: false,
  required: ["title", "fit", "tagline", "reason", "caution", "exampleFields"],
  properties: {
    title: stringSchema,
    fit: fitSchema,
    tagline: stringSchema,
    reason: stringSchema,
    caution: stringSchema,
    exampleFields: stringArraySchema,
  },
} as const;

const unsuitableJobSchema = {
  type: "object",
  additionalProperties: false,
  required: ["title", "reason", "warning"],
  properties: {
    title: stringSchema,
    reason: stringSchema,
    warning: stringSchema,
  },
} as const;

const careerPathSchema = {
  type: "object",
  additionalProperties: false,
  required: ["label", "fit", "headline", "body", "push", "avoid"],
  properties: {
    label: stringSchema,
    fit: fitSchema,
    headline: stringSchema,
    body: stringSchema,
    push: stringArraySchema,
    avoid: stringArraySchema,
  },
} as const;

const moneyEarningStyleSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "headline",
    "body",
    "bestIncomeChannels",
    "riskyIncomeChannels",
    "sideIncomeIdeas",
  ],
  properties: {
    headline: stringSchema,
    body: stringSchema,
    bestIncomeChannels: stringArraySchema,
    riskyIncomeChannels: stringArraySchema,
    sideIncomeIdeas: stringArraySchema,
  },
} as const;

const investmentAndSavingStyleSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "headline",
    "body",
    "suitablePatterns",
    "cautionPatterns",
    "forbiddenNote",
  ],
  properties: {
    headline: stringSchema,
    body: stringSchema,
    suitablePatterns: stringArraySchema,
    cautionPatterns: stringArraySchema,
    forbiddenNote: stringSchema,
  },
} as const;

const careerTimingSchema = {
  type: "object",
  additionalProperties: false,
  required: ["year", "label", "headline", "body", "push", "avoid"],
  properties: {
    year: numberSchema,
    label: stringSchema,
    headline: stringSchema,
    body: stringSchema,
    push: stringArraySchema,
    avoid: stringArraySchema,
  },
} as const;

const studyCertificatePlanSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "headline",
    "body",
    "recommendedCertificates",
    "recommendedStudyMethods",
    "portfolioStrategy",
    "avoidStudyPatterns",
  ],
  properties: {
    headline: stringSchema,
    body: stringSchema,
    recommendedCertificates: stringArraySchema,
    recommendedStudyMethods: stringArraySchema,
    portfolioStrategy: stringArraySchema,
    avoidStudyPatterns: stringArraySchema,
  },
} as const;

const actionPlanSchema = {
  type: "object",
  additionalProperties: false,
  required: ["label", "headline", "body", "firstAction"],
  properties: {
    label: {
      type: "string",
      enum: careerActionPlanLabels,
    },
    headline: stringSchema,
    body: stringSchema,
    firstAction: stringSchema,
  },
} as const;

const riskWarningSchema = {
  type: "object",
  additionalProperties: false,
  required: ["title", "body", "prevention"],
  properties: {
    title: stringSchema,
    body: stringSchema,
    prevention: stringSchema,
  },
} as const;

export const careerReportDraftJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "version",
    "productType",
    "productVersion",
    "personLabel",
    "openingTitle",
    "openingSummary",
    "coreLine",
    "userContextSummary",
    "careerIdentity",
    "myeongliMbtiSummary",
    "recommendedJobs",
    "unsuitableJobs",
    "careerPaths",
    "moneyEarningStyle",
    "investmentAndSavingStyle",
    "careerTiming",
    "studyCertificatePlan",
    "actionPlan",
    "riskWarnings",
    "safetyNotes",
  ],
  properties: {
    version: { type: "string", enum: ["v1"] },
    productType: { type: "string", enum: ["career_money_study"] },
    productVersion: { type: "string", enum: ["v1"] },
    personLabel: stringSchema,
    openingTitle: stringSchema,
    openingSummary: stringSchema,
    coreLine: stringSchema,
    userContextSummary: userContextSummarySchema,
    careerIdentity: careerIdentitySchema,
    myeongliMbtiSummary: myeongliMbtiSummarySchema,
    recommendedJobs: {
      type: "array",
      items: recommendedJobSchema,
    },
    unsuitableJobs: {
      type: "array",
      items: unsuitableJobSchema,
    },
    careerPaths: {
      type: "array",
      items: careerPathSchema,
    },
    moneyEarningStyle: moneyEarningStyleSchema,
    investmentAndSavingStyle: investmentAndSavingStyleSchema,
    careerTiming: {
      type: "array",
      items: careerTimingSchema,
    },
    studyCertificatePlan: studyCertificatePlanSchema,
    actionPlan: {
      type: "array",
      items: actionPlanSchema,
    },
    riskWarnings: {
      type: "array",
      items: riskWarningSchema,
    },
    safetyNotes: stringArraySchema,
  },
} as const;

export function getCareerReportDraftSchemaTopLevelKeys(): readonly string[] {
  return Object.keys(careerReportDraftJsonSchema.properties);
}

const fallbackCareerTimingYear = 2026;

function compactStrings(values: readonly (string | null | undefined)[]): readonly string[] {
  return [...new Set(values.map((value) => value?.trim()).filter(
    (value): value is string => value !== undefined && value.length > 0,
  ))];
}

function takeWithFallback(
  values: readonly string[],
  fallback: readonly string[],
  min: number,
  max: number,
): readonly string[] {
  const result = compactStrings([...values, ...fallback]);

  return result.slice(0, Math.max(min, Math.min(max, result.length)));
}

function takeRecordsWithFallback<T extends { readonly title?: string; readonly label?: string }>(
  values: readonly T[],
  fallback: readonly T[],
  min: number,
  max: number,
): readonly T[] {
  const seen = new Set<string>();
  const result: T[] = [];

  for (const item of [...values, ...fallback]) {
    const key = [
      item.title,
      item.label,
      "headline" in item && typeof item.headline === "string" ? item.headline : undefined,
      "year" in item && typeof item.year === "number" ? String(item.year) : undefined,
    ]
      .filter((value): value is string => value !== undefined)
      .join(":") || JSON.stringify(item);

    if (!seen.has(key)) {
      seen.add(key);
      result.push(item);
    }
  }

  return result.slice(0, Math.max(min, Math.min(max, result.length)));
}

function getTimingYear(signal: CareerSignal, index: number): number {
  const year = `${signal.title} ${signal.plain}`.match(/\b20\d{2}\b/u)?.[0];

  return year === undefined ? fallbackCareerTimingYear + index : Number(year);
}

function buildFallbackRecommendedJobs(
  evidence: CareerReportEvidencePacket,
): CareerReportDraft["recommendedJobs"] {
  const exampleFields = compactStrings([
    evidence.userContext.fieldLabel,
    ...evidence.careerPaths.flatMap((path) => path.examples),
  ]).slice(0, 4);
  const jobs = evidence.recommendedJobs.map((job) => ({
    title: job.title,
    fit: job.fit,
    tagline:
      job.fit === "high"
        ? "강점이 바로 드러나는 업무 축"
        : job.fit === "medium"
          ? "조건을 맞추면 활용 가능한 업무 축"
          : "주의해서 비교할 업무 축",
    reason: job.reason,
    caution: job.caution,
    exampleFields:
      exampleFields.length > 0 ? exampleFields : ["기획", "운영", "데이터"],
  }));

  return takeRecordsWithFallback(
    jobs,
    [
      {
        title: "서비스 기획자",
        fit: "high",
        tagline: "요구사항을 구조로 바꾸는 자리",
        reason: "입력 근거가 부족해도 기획·운영 축은 화면 검수용 기본 후보로 유지합니다.",
        caution: "실제 판매용 문장에서는 writer가 evidence를 다시 정리합니다.",
        exampleFields: ["서비스 기획", "운영", "정책"],
      },
      {
        title: "프로젝트 매니저",
        fit: "medium",
        tagline: "일정과 역할을 묶는 자리",
        reason: "일의 범위와 산출물을 정리하는 흐름을 보여주는 기본 후보입니다.",
        caution: "권한과 책임 범위를 먼저 확인해야 합니다.",
        exampleFields: ["프로젝트", "운영", "협업"],
      },
      {
        title: "데이터 기반 기획",
        fit: "medium",
        tagline: "숫자로 기준을 잡는 자리",
        reason: "직업·돈·학업 화면에서 분석 축을 보여주는 기본 후보입니다.",
        caution: "분석이 실행으로 이어져야 합니다.",
        exampleFields: ["데이터", "지표", "리포팅"],
      },
    ],
    8,
    20,
  );
}

function buildFallbackUnsuitableJobs(
  evidence: CareerReportEvidencePacket,
): CareerReportDraft["unsuitableJobs"] {
  const lowFitJobs = evidence.recommendedJobs
    .filter((job) => job.fit === "low")
    .map((job) => ({
      title: job.title,
      reason: job.reason,
      warning: job.caution,
    }));
  const riskJobs = evidence.workRiskWarnings.map((risk) => ({
    title: risk.title,
    reason: risk.plain,
    warning: "역할 범위, 회복 루틴, 성과 기준을 먼저 고정해야 합니다.",
  }));

  return takeRecordsWithFallback(
    [...lowFitJobs, ...riskJobs],
    [
      {
        title: "권한 없는 책임만 큰 자리",
        reason: "기준을 잡을 권한 없이 일정과 비용만 떠안으면 장점이 소모됩니다.",
        warning: "역할 범위와 결정권을 문서로 확인해야 합니다.",
      },
      {
        title: "성과 증거가 남지 않는 반복 업무",
        reason: "일을 많이 해도 포트폴리오와 평가 기준으로 남기 어렵습니다.",
        warning: "반복 업무라도 개선 산출물을 남길 수 있어야 합니다.",
      },
      {
        title: "구두 약속으로 움직이는 돈·협업 구조",
        reason: "정산일, 범위, 책임 기준이 흐리면 손실과 피로가 커집니다.",
        warning: "계약, 견적, 정산 기준을 먼저 고정해야 합니다.",
      },
    ],
    3,
    8,
  );
}

function buildFallbackCareerPaths(
  evidence: CareerReportEvidencePacket,
): CareerReportDraft["careerPaths"] {
  return takeRecordsWithFallback(
    evidence.careerPaths.map((path) => ({
      label: path.label,
      fit: path.fit,
      headline: path.label,
      body: path.plain,
      push: path.examples,
      avoid: [path.risk],
    })),
    [
      {
        label: "직무 구조화 루트",
        fit: "medium",
        headline: "업무 기준을 먼저 정리하는 길",
        body: "현재 입력과 사주 근거를 바탕으로 직무 기준을 좁히는 경로입니다.",
        push: ["직무 공고 비교", "성과 문장 정리", "역할 범위 문서화"],
        avoid: ["기준 없는 지원", "구두 협업", "권한 없는 책임"],
      },
    ],
    3,
    6,
  );
}

function buildFallbackCareerTiming(
  evidence: CareerReportEvidencePacket,
): CareerReportDraft["careerTiming"] {
  return takeRecordsWithFallback(
    evidence.timingHints.map((signal, index) => ({
      year: getTimingYear(signal, index),
      label: signal.strength === "high" ? "강한 활용" : "정리",
      headline: signal.title,
      body: signal.plain,
      push: takeWithFallback(
        evidence.opportunitySignals.map((item) => item.title),
        ["산출물 만들기", "역할 기준 정리", "성과 문장화"],
        3,
        5,
      ),
      avoid: takeWithFallback(
        evidence.workRiskWarnings.map((item) => item.title),
        ["무리한 확장", "구두 약속", "범위 없는 책임"],
        3,
        5,
      ),
    })),
    [
      {
        year: fallbackCareerTimingYear,
        label: "정리",
        headline: "직업 기준을 다시 잡는 시기",
        body: "업무 범위, 돈의 흐름, 공부 산출물을 한 번에 정리하는 흐름입니다.",
        push: ["직무 기준 정리", "포트폴리오 작성", "현금흐름 점검"],
        avoid: ["무리한 확장", "계획 없는 지출", "결과물 없는 공부"],
      },
    ],
    3,
    8,
  );
}

function buildFallbackActionPlan(
  evidence: CareerReportEvidencePacket,
): CareerReportDraft["actionPlan"] {
  const moneyStrategy = evidence.moneyStrategies[0];

  return careerActionPlanLabels.map((label) => {
    if (label === "직업") {
      return {
        label,
        headline: "잘 맞는 역할을 좁힙니다",
        body: evidence.combinedCareerProfile.headline,
        firstAction: "추천 직업 목록에서 실제 공고 10개를 골라 공통 요구 역량을 표시합니다.",
      };
    }
    if (label === "커리어") {
      return {
        label,
        headline: "성과 기준을 문장으로 남깁니다",
        body: evidence.myeongliCareerBasis.careerPlain,
        firstAction: "최근 프로젝트 3개를 문제, 행동, 결과 순서로 정리합니다.",
      };
    }
    if (label === "돈") {
      return {
        label,
        headline: moneyStrategy?.label ?? "현금흐름을 먼저 고정합니다",
        body: moneyStrategy?.plain ?? evidence.myeongliCareerBasis.moneyPlain,
        firstAction: "월 수입, 고정비, 저축액, 변동비를 한 표로 분리합니다.",
      };
    }
    if (label === "투자·저축") {
      return {
        label,
        headline: evidence.investmentProfile.headline,
        body: evidence.investmentProfile.plain,
        firstAction: "투자 전 비상금, 손실 한도, 점검일을 먼저 적습니다.",
      };
    }
    if (label === "학업·자격증") {
      return {
        label,
        headline: evidence.studyCertificateStrategy.headline,
        body: evidence.studyCertificateStrategy.plain,
        firstAction: "이번 달에 남길 산출물 1개와 시험·학습 일정을 같이 정합니다.",
      };
    }

    return {
      label,
      headline: "결과물을 포트폴리오로 바꿉니다",
      body: "공부와 업무 경험은 말보다 산출물로 남을 때 커리어 설명력이 생깁니다.",
      firstAction: "문제 정의, 해결 과정, 숫자 결과가 들어간 케이스 1개를 작성합니다.",
    };
  });
}

export function buildCareerReportScreenQaFallbackDraft(
  evidence: CareerReportEvidencePacket,
): CareerReportDraft {
  const fieldLabel = evidence.userContext.fieldLabel ?? null;
  const relationshipStatus = evidence.userContext.relationshipStatus ?? "unknown";
  const moneyPush = evidence.moneyStrategies.flatMap((strategy) => strategy.push);
  const moneyAvoid = evidence.moneyStrategies.flatMap((strategy) => strategy.avoid);
  const riskWarnings = takeRecordsWithFallback(
    evidence.workRiskWarnings.map((warning) => ({
      title: warning.title,
      body: warning.plain,
      prevention: "역할, 돈, 일정 기준을 문서로 고정하고 회복 루틴을 일정에 넣습니다.",
    })),
    [
      {
        title: "기준 없는 확장",
        body: "일과 돈을 동시에 넓히면 판단 기준이 흐려질 수 있습니다.",
        prevention: "이번 달에 늘릴 것과 줄일 것을 각각 하나씩만 정합니다.",
      },
      {
        title: "성과 노출 부족",
        body: "좋은 일을 해도 밖으로 보이는 산출물이 없으면 평가에서 손해를 봅니다.",
        prevention: "업무 결과를 문서, 숫자, 화면 자료로 남깁니다.",
      },
    ],
    1,
    6,
  );

  return {
    version: "v1",
    productType: "career_money_study",
    productVersion: "v1",
    personLabel: evidence.personLabel,
    openingTitle: `${evidence.personLabel}님의 직업·커리어·돈·학업 리포트`,
    openingSummary:
      "직업, 돈, 투자, 공부 전략을 한 흐름으로 묶어 화면에서 확인할 수 있게 정리했습니다.",
    coreLine: evidence.combinedCareerProfile.headline,
    userContextSummary: {
      lifeStatusLabel: USER_LIFE_STATUS_LABELS[evidence.userContext.lifeStatus],
      fieldLabel,
      relationshipStatusLabel:
        relationshipStatus === "unknown"
          ? null
          : USER_RELATIONSHIP_STATUS_LABELS[relationshipStatus],
      contextNote:
        "현재 직업과 관심 분야는 계산 기준이 아니라 적합도를 비교하는 현실 맥락으로만 사용합니다.",
    },
    careerIdentity: {
      headline: evidence.combinedCareerProfile.headline,
      archetypeLabel: evidence.combinedCareerProfile.workStyleArchetypes[0] ?? "career_profile",
      body: evidence.combinedCareerProfile.plain,
      strongestFit: evidence.myeongliCareerBasis.careerPlain,
      biggestRisk:
        evidence.workRiskWarnings[0]?.plain ?? evidence.mbtiCareerBasis.riskPlain,
    },
    myeongliMbtiSummary: {
      myeongliCore: evidence.myeongliCareerBasis.dayMasterPlain,
      mbtiCore: evidence.mbtiCareerBasis.workStylePlain,
      combinedReading: evidence.combinedCareerProfile.plain,
      alignment: evidence.mbtiType === null ? "unknown" : "mixed",
      tensionNote: evidence.workRiskWarnings[0]?.plain ?? null,
    },
    recommendedJobs: buildFallbackRecommendedJobs(evidence),
    unsuitableJobs: buildFallbackUnsuitableJobs(evidence),
    careerPaths: buildFallbackCareerPaths(evidence),
    moneyEarningStyle: {
      headline: evidence.moneyStrategies[0]?.label ?? "현금흐름과 정산 기준을 먼저 잡습니다",
      body: evidence.myeongliCareerBasis.moneyPlain,
      bestIncomeChannels: takeWithFallback(
        moneyPush,
        ["월급", "프로젝트 수입", "성과급", "포트폴리오 기반 부수입"],
        3,
        8,
      ),
      riskyIncomeChannels: takeWithFallback(
        moneyAvoid,
        ["구두 약속", "조건 없는 협업", "무리한 할부", "레버리지"],
        3,
        8,
      ),
      sideIncomeIdeas: takeWithFallback(
        evidence.careerPaths.flatMap((path) => path.examples),
        ["기획 외주", "운영 개선", "템플릿 판매", "실무 콘텐츠"],
        3,
        8,
      ),
    },
    investmentAndSavingStyle: {
      headline: evidence.investmentProfile.headline,
      body: evidence.investmentProfile.plain,
      suitablePatterns: takeWithFallback(
        evidence.investmentProfile.suitablePatterns,
        ["분산", "정기 점검", "현금흐름 관리"],
        3,
        8,
      ),
      cautionPatterns: takeWithFallback(
        evidence.investmentProfile.cautionPatterns.map((pattern) =>
          pattern === "확정 수익처럼 포장된 제안"
            ? "검증되지 않은 고수익 제안"
            : pattern,
        ),
        ["레버리지", "감정 단타", "몰빵"],
        3,
        8,
      ),
      forbiddenNote: evidence.investmentProfile.disclaimer,
    },
    careerTiming: buildFallbackCareerTiming(evidence),
    studyCertificatePlan: {
      headline: evidence.studyCertificateStrategy.headline,
      body: evidence.studyCertificateStrategy.plain,
      recommendedCertificates: takeWithFallback(
        evidence.studyCertificateStrategy.recommendedFields,
        ["데이터 분석", "SQL", "PM 실무"],
        3,
        8,
      ),
      recommendedStudyMethods: takeWithFallback(
        evidence.studyCertificateStrategy.recommendedMethods,
        ["기출·오답 루틴", "주간 산출물", "포트폴리오 케이스 정리"],
        3,
        8,
      ),
      portfolioStrategy: [
        "문제 정의",
        "실행 과정",
        "숫자 결과",
        fieldLabel ?? "현재 관심 분야",
      ],
      avoidStudyPatterns: takeWithFallback(
        evidence.studyCertificateStrategy.avoidMethods,
        ["벼락치기", "결과물 없는 공부", "목표 없는 강의 수집"],
        3,
        8,
      ),
    },
    actionPlan: buildFallbackActionPlan(evidence),
    riskWarnings,
    safetyNotes: takeWithFallback(
      evidence.safetyNotes,
      [
        "이 리포트는 자기이해용 참고 콘텐츠이며 특정 결과를 보장하지 않습니다.",
        "투자 관련 문장은 금융 자문이나 매수·매도 지시가 아닙니다.",
      ],
      2,
      4,
    ),
  };
}
