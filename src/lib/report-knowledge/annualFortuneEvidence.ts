import type {
  AnnualBranchInteraction,
  AnnualFortuneDomainFlowKey,
  AnnualFortuneMode,
  AnnualFortuneYearAccessStatus,
  AnnualFortuneYearAccess,
  AnnualGanjiInfo,
  AnnualMonthGanjiInfo,
  EarthlyBranch,
  FiveElement,
  HeavenlyStem,
  TenGod,
} from "./annualFortuneTypes";
import {
  buildMyeongliMbtiBridgePacket,
  buildProductBridgeEvidence,
  type MyeongliSignal,
  type ProductBridgeEvidencePacket,
} from "./bridge";
import {
  getMbtiReportUseCase,
  getMbtiSourceProfile,
  type MbtiSourceTraitItem,
} from "./mbti";
import type { MajorFortuneCycle } from "./majorFortuneTypes";
import { getMajorFortuneCycleForYear } from "./majorFortuneRules";
import type {
  UserContextProfile,
  UserLifeStatus,
} from "./userContextTypes";
import { USER_LIFE_STATUS_LABELS } from "./userContextTypes";
import {
  getAnnualBranchInteractions,
  getAnnualFortuneYearAccess,
  getAnnualGanjiInfo,
  getAnnualMonthGanjiInfo,
  getBranchElement,
  getGeneratedElement,
  getTenGodForStemPair,
} from "./annualFortuneYearRules";

export interface AnnualFortuneEvidencePacket {
  readonly productType: "annual_fortune";
  readonly productVersion: "v1";
  readonly selectedYear: number;
  readonly targetYear: number;
  readonly currentDate: string;
  readonly mode: AnnualFortuneMode;
  readonly yearAccess: AnnualFortuneYearAccess;
  readonly yearAccessPolicy: {
    readonly selectedYear: number;
    readonly currentYear: number;
    readonly status: AnnualFortuneYearAccessStatus;
    readonly reason: string | null;
    readonly isNewYearPreview: boolean;
    readonly availableYearRange: {
      readonly from: number;
      readonly to: number;
    };
    readonly policyLabel: string;
    readonly notice: string;
  };
  readonly personContext: {
    readonly name: string;
    readonly birthDate?: string;
    readonly gender?: string;
    readonly mbtiType?: string | null;
    readonly userContext: UserContextProfile;
  };
  readonly baseSaju: {
    readonly dayMaster: HeavenlyStem;
    readonly pillars: {
      readonly year: string;
      readonly month: string;
      readonly day: string;
      readonly hour?: string;
    };
    readonly natalLabels: readonly string[];
  };
  readonly mbtiBasis: {
    readonly type: string | null;
    readonly titleKo: string | null;
    readonly archetype: string | null;
    readonly summary: string;
    readonly coreTraits: readonly string[];
    readonly stressPattern: string;
    readonly decisionPattern: string;
    readonly workPattern: string;
    readonly relationshipPattern: string;
    readonly growthPattern: string;
    readonly reportUseCase: "saeunReport";
    readonly reportUseCases: readonly string[];
  };
  readonly bridgeEvidence?: ProductBridgeEvidencePacket;
  readonly currentMajorFortune: {
    readonly ganji: string;
    readonly stemTenGod: TenGod;
    readonly branchTenGod: TenGod;
    readonly yearRange: string;
    readonly ageRange: string;
    readonly keyTheme: string;
  } | null;
  readonly annualFortune: {
    readonly year: number;
    readonly ganji: string;
    readonly stem: HeavenlyStem;
    readonly branch: EarthlyBranch;
    readonly stemTenGod: TenGod;
    readonly branchTenGod: TenGod;
    readonly elementFocus: readonly FiveElement[];
    readonly yearTheme: string;
    readonly supportSignals: readonly string[];
    readonly frictionSignals: readonly string[];
    readonly interpretation: string;
    readonly caution: string;
  };
  readonly majorAnnualCross: {
    readonly majorGanji: string;
    readonly annualGanji: string;
    readonly majorToAnnualRelation: string;
    readonly majorTenGodToAnnualTenGod: string;
    readonly interpretation: string;
    readonly caution: string;
  } | null;
  readonly natalAnnualRelations: {
    readonly annualBranch: EarthlyBranch;
    readonly interactions: readonly AnnualBranchInteraction[];
    readonly supportSignals: readonly string[];
    readonly frictionSignals: readonly string[];
    readonly interpretation: string;
    readonly caution: string;
  };
  readonly monthlyFortunes: readonly {
    readonly month: number;
    readonly label: string;
    readonly ganji: string;
    readonly stem: HeavenlyStem;
    readonly branch: EarthlyBranch;
    readonly stemTenGod: TenGod;
    readonly branchTenGod: TenGod;
    readonly monthTheme: string;
    readonly supportSignals: readonly string[];
    readonly frictionSignals: readonly string[];
    readonly actionHint: string;
    readonly caution: string;
    readonly interpretation: string;
  }[];
  readonly yearlyThemeSummary: {
    readonly headline: string;
    readonly summary: string;
    readonly keySignals: readonly string[];
  };
  readonly domainFlows: Record<
    AnnualFortuneDomainFlowKey,
    {
      readonly title: string;
      readonly summary: string;
      readonly supportingSignals: readonly string[];
      readonly frictionSignals: readonly string[];
      readonly actionHint: string;
    }
  >;
  readonly riskPatterns: readonly {
    readonly title: string;
    readonly summary: string;
    readonly evidence: readonly string[];
    readonly prevention: string;
  }[];
  readonly actionGuides: readonly {
    readonly title: string;
    readonly action: string;
    readonly timingHint: string;
  }[];
  readonly safetyNotes: readonly string[];
  readonly annualGanji: AnnualGanjiInfo;
  readonly userPillars: {
    readonly year: string;
    readonly month: string;
    readonly day: string;
    readonly hour?: string;
  };
  readonly userContext: UserContextProfile;
  readonly contextTranslationHints: readonly {
    readonly domain:
      | "work"
      | "money"
      | "relationship"
      | "family_love"
      | "study_certificate"
      | "health_rhythm";
    readonly preferredSceneNouns: readonly string[];
    readonly plain: string;
  }[];
  readonly dayMaster: HeavenlyStem;
  readonly annualTenGod: {
    readonly stemTenGod: TenGod;
    readonly branchMainElement?: FiveElement;
    readonly plain: string;
  };
  readonly elementEffect: {
    readonly strengthens: readonly FiveElement[];
    readonly fillsMissing: readonly FiveElement[];
    readonly overloadsHeavy: readonly FiveElement[];
    readonly plain: string;
  };
  readonly branchInteractions: readonly AnnualBranchInteraction[];
  readonly lifeAreaSignals: readonly {
    readonly area:
      | "work"
      | "money"
      | "relationship"
      | "health_rhythm"
      | "study_certificate"
      | "family"
      | "movement_change";
    readonly strength: "low" | "medium" | "high";
    readonly plain: string;
  }[];
  readonly difficultySignals: readonly {
    readonly type:
      | "overload"
      | "conflict"
      | "missing_element_unfilled"
      | "pressure"
      | "relationship_friction"
      | "money_responsibility"
      | "career_shift";
    readonly severity: "low" | "medium" | "high";
    readonly plain: string;
  }[];
  readonly opportunitySignals: readonly {
    readonly type:
      | "expression"
      | "career"
      | "money"
      | "relationship"
      | "learning"
      | "stability"
      | "movement";
    readonly strength: "low" | "medium" | "high";
    readonly plain: string;
  }[];
  readonly monthlyFortuneSeeds: readonly {
    readonly month: number;
    readonly label: string;
    readonly monthGanji: AnnualMonthGanjiInfo;
    readonly elementFocus: string;
    readonly basis: "calendar_month_approximation" | "solar_term_exact";
    readonly natalInteractionSummary: string;
    readonly plain: string;
  }[];
  readonly warnings: readonly string[];
}

export type AnnualPersonInput = {
  readonly label: string;
  readonly birthDate?: string;
  readonly gender?: string;
  readonly mbti?: string | null;
  readonly userContext: UserContextProfile;
  readonly majorFortuneCycles?: readonly MajorFortuneCycle[];
  readonly pillars: {
    readonly year: string;
    readonly month: string;
    readonly day: string;
    readonly hour?: string;
  };
  readonly labels: readonly string[];
};

const elementKo = {
  wood: "목",
  fire: "화",
  earth: "토",
  metal: "금",
  water: "수",
} as const satisfies Record<FiveElement, string>;

const hiddenStemsByBranch = {
  子: ["癸"],
  丑: ["己", "癸", "辛"],
  寅: ["甲", "丙", "戊"],
  卯: ["乙"],
  辰: ["戊", "乙", "癸"],
  巳: ["丙", "戊", "庚"],
  午: ["丁", "己"],
  未: ["己", "丁", "乙"],
  申: ["庚", "壬", "戊"],
  酉: ["辛"],
  戌: ["戊", "辛", "丁"],
  亥: ["壬", "甲"],
} as const satisfies Record<EarthlyBranch, readonly HeavenlyStem[]>;

const annualDomainFlowTitles = {
  careerWork: "직업·일 흐름",
  moneyResource: "돈·자원 흐름",
  relationshipLove: "관계·연애 흐름",
  healthRoutine: "건강관리·생활 리듬",
  socialFamily: "사회·가족 흐름",
  studyGrowth: "공부·성장 흐름",
} as const satisfies Record<AnnualFortuneDomainFlowKey, string>;

const annualSafetyNotes = [
  "세운 리포트는 선택 연도의 흐름과 월별 운영 기준을 해석한 참고용 리포트이며, 특정 사건이나 날짜를 예언하지 않습니다.",
  "월운은 현재 1차 범위에서 달력월 기준 운영 가이드로 제공되며, 절기와 개인 일정에 따라 체감 시점은 달라질 수 있습니다.",
  "돈, 직업, 관계, 건강 관련 문장은 결과 보장이나 진단이 아니라 준비와 조율 기준으로 읽어야 합니다.",
] as const;

const stemByInput = new Map<string, HeavenlyStem>([
  ["甲", "甲"],
  ["乙", "乙"],
  ["丙", "丙"],
  ["丁", "丁"],
  ["戊", "戊"],
  ["己", "己"],
  ["庚", "庚"],
  ["辛", "辛"],
  ["壬", "壬"],
  ["癸", "癸"],
]);

const branchByInput = new Map<string, EarthlyBranch>([
  ["子", "子"],
  ["丑", "丑"],
  ["寅", "寅"],
  ["卯", "卯"],
  ["辰", "辰"],
  ["巳", "巳"],
  ["午", "午"],
  ["未", "未"],
  ["申", "申"],
  ["酉", "酉"],
  ["戌", "戌"],
  ["亥", "亥"],
]);

const diagnosticOnlyLabels = ["백호대살"] as const;

function unique<T>(values: readonly T[]): readonly T[] {
  return [...new Set(values)];
}

function parsePillarStem(pillar: string): HeavenlyStem {
  const stem = stemByInput.get(pillar.trim().slice(0, 1));

  if (stem === undefined) {
    throw new Error(`Invalid annual fortune day pillar stem: ${pillar}`);
  }

  return stem;
}

function parsePillarBranch(pillar: string | undefined): EarthlyBranch | undefined {
  if (pillar === undefined) {
    return undefined;
  }

  return branchByInput.get(pillar.trim().slice(-1));
}

function getElementsFromLabels(
  labels: readonly string[],
  suffix: "부족" | "과다",
): readonly FiveElement[] {
  const byLabel = {
    wood: `목 ${suffix}`,
    fire: `화 ${suffix}`,
    earth: `토 ${suffix}`,
    metal: `금 ${suffix}`,
    water: `수 ${suffix}`,
  } as const satisfies Record<FiveElement, string>;

  return (Object.keys(byLabel) as FiveElement[]).filter((element) =>
    labels.includes(byLabel[element]),
  );
}

function formatElementList(elements: readonly FiveElement[]): string {
  if (elements.length === 0) {
    return "없음";
  }

  return elements.map((element) => elementKo[element]).join("·");
}

function formatDateOnly(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function contextPlain(input: {
  readonly userContext: UserContextProfile;
  readonly domainLabel: string;
  readonly nouns: readonly string[];
}): string {
  const statusLabel = USER_LIFE_STATUS_LABELS[input.userContext.lifeStatus];
  const field =
    input.userContext.fieldLabel === undefined ||
    input.userContext.fieldLabel === null ||
    input.userContext.fieldLabel.trim().length === 0
      ? ""
      : ` ${input.userContext.fieldLabel.trim()} 분야를 기준으로`;

  return `${statusLabel}${field} ${input.domainLabel} 장면에서는 ${input.nouns.join(", ")} 같은 명사로 흐름을 번역합니다. 계산값은 이 정보로 바꾸지 않습니다.`;
}

function buildContextTranslationHints(
  userContext: UserContextProfile,
): AnnualFortuneEvidencePacket["contextTranslationHints"] {
  const byStatus: Record<
    UserLifeStatus,
    readonly {
      readonly domain: AnnualFortuneEvidencePacket["contextTranslationHints"][number]["domain"];
      readonly domainLabel: string;
      readonly nouns: readonly string[];
    }[]
  > = {
    student: [
      {
        domain: "study_certificate",
        domainLabel: "학업·자격증",
        nouns: ["과제", "발표", "시험", "전공", "교수", "팀플", "포트폴리오"],
      },
      {
        domain: "money",
        domainLabel: "돈·현실",
        nouns: ["용돈", "등록금", "생활비", "아르바이트"],
      },
      {
        domain: "relationship",
        domainLabel: "인간관계",
        nouns: ["친구", "동기", "팀플", "동아리"],
      },
    ],
    exam_certificate: [
      {
        domain: "study_certificate",
        domainLabel: "학업·자격증",
        nouns: ["시험", "모의고사", "오답노트", "실기", "자격증", "면접", "제출물"],
      },
      {
        domain: "health_rhythm",
        domainLabel: "몸·생활 리듬",
        nouns: ["수면", "식사", "집중력", "루틴", "회복"],
      },
    ],
    job_seeker: [
      {
        domain: "work",
        domainLabel: "일·성과",
        nouns: ["지원서", "면접", "포트폴리오", "결과 대기", "채용 공고", "스펙 정리"],
      },
      {
        domain: "money",
        domainLabel: "돈·현실",
        nouns: ["생활비", "준비 비용", "교통비", "고정비"],
      },
      {
        domain: "relationship",
        domainLabel: "인간관계",
        nouns: ["가족 기대", "주변 비교", "연락 부담"],
      },
    ],
    employee: [
      {
        domain: "work",
        domainLabel: "일·성과",
        nouns: ["상사", "동료", "프로젝트", "보고", "마감", "성과", "역할 분담", "회의"],
      },
      {
        domain: "money",
        domainLabel: "돈·현실",
        nouns: ["급여", "고정지출", "생활비", "정산", "계약", "관리비"],
      },
      {
        domain: "study_certificate",
        domainLabel: "학업·자격증",
        nouns: ["자격증", "업무 공부", "포트폴리오", "실무 정리"],
      },
    ],
    freelancer: [
      {
        domain: "work",
        domainLabel: "일·성과",
        nouns: ["클라이언트", "납기", "단가", "수정 요청", "계약", "작업물"],
      },
      {
        domain: "money",
        domainLabel: "돈·현실",
        nouns: ["정산", "세금", "수입 변동", "선금", "잔금"],
      },
    ],
    business_owner: [
      {
        domain: "work",
        domainLabel: "일·성과",
        nouns: ["고객", "매출", "계약", "직원", "외주", "재고", "운영 리스크"],
      },
      {
        domain: "money",
        domainLabel: "돈·현실",
        nouns: ["매출", "비용", "정산", "세금", "임대료", "현금흐름"],
      },
    ],
    resting: [
      {
        domain: "work",
        domainLabel: "일·성과",
        nouns: ["재진입 준비", "생활 리듬", "포트폴리오 정리", "회복"],
      },
      {
        domain: "money",
        domainLabel: "돈·현실",
        nouns: ["고정비", "생활비", "지출 관리"],
      },
      {
        domain: "relationship",
        domainLabel: "인간관계",
        nouns: ["가족 기대", "주변 시선", "관계 피로"],
      },
    ],
    other: [
      {
        domain: "work",
        domainLabel: "일·성과",
        nouns: ["현재 역할", "준비 분야", "결과물", "일정"],
      },
      {
        domain: "money",
        domainLabel: "돈·현실",
        nouns: ["생활비", "고정비", "정산", "지출 관리"],
      },
    ],
  };

  return byStatus[userContext.lifeStatus].map((hint) => ({
    domain: hint.domain,
    preferredSceneNouns: hint.nouns,
    plain: contextPlain({
      userContext,
      domainLabel: hint.domainLabel,
      nouns: hint.nouns,
    }),
  }));
}

function getBranchTenGod(
  dayMaster: HeavenlyStem,
  branch: EarthlyBranch,
): TenGod {
  const [mainHiddenStem] = hiddenStemsByBranch[branch];

  return getTenGodForStemPair(dayMaster, mainHiddenStem);
}

function traitToPlainText(trait: MbtiSourceTraitItem): string | null {
  return (
    trait.plainKo ??
    trait.strongLine ??
    trait.positiveUse ??
    trait.risk ??
    trait.label ??
    null
  );
}

function buildMbtiBasis(
  mbtiType: string | null | undefined,
): AnnualFortuneEvidencePacket["mbtiBasis"] {
  const profile = getMbtiSourceProfile(mbtiType);

  if (profile === null) {
    return {
      type: null,
      titleKo: null,
      archetype: null,
      summary:
        "MBTI 입력이 없거나 확인되지 않아 세운 흐름의 행동 발현은 일반적인 생활 장면 중심으로 해석합니다.",
      coreTraits: [],
      stressPattern: "입력된 MBTI 기준 스트레스 패턴 없음",
      decisionPattern: "입력된 MBTI 기준 의사결정 패턴 없음",
      workPattern: "입력된 MBTI 기준 일 처리 패턴 없음",
      relationshipPattern: "입력된 MBTI 기준 관계 반응 패턴 없음",
      growthPattern: "입력된 MBTI 기준 성장 패턴 없음",
      reportUseCase: "saeunReport",
      reportUseCases: [],
    };
  }

  const reportUseCases = getMbtiReportUseCase(profile.type, "saeunReport") ?? [];
  const traits = [
    ...(profile.traits?.identity ?? []),
    ...(profile.traits?.career ?? []),
    ...(profile.traits?.relationships ?? []),
    ...(profile.traits?.growth ?? []),
    ...(profile.traits?.risks ?? []),
  ]
    .map(traitToPlainText)
    .filter((value): value is string => value !== null && value.trim().length > 0);

  return {
    type: profile.type,
    titleKo: profile.titleKo,
    archetype: profile.archetype,
    summary: profile.oneLine,
    coreTraits: unique([...reportUseCases, ...traits]).slice(0, 6),
    stressPattern:
      profile.traits?.risks?.map(traitToPlainText).find(
        (value): value is string => value !== null,
      ) ?? "압박이 커질수록 익숙한 판단 습관이 강해질 수 있습니다.",
    decisionPattern:
      profile.traits?.thinkingStyle?.map(traitToPlainText).find(
        (value): value is string => value !== null,
      ) ?? "선택 연도의 흐름을 판단과 실행 방식으로 드러냅니다.",
    workPattern:
      [
        ...(profile.traits?.workplace ?? []),
        ...(profile.traits?.career ?? []),
      ]
        .map(traitToPlainText)
        .find((value): value is string => value !== null) ??
      "선택 연도의 흐름을 일 처리 속도와 역할 조율 방식으로 드러냅니다.",
    relationshipPattern:
      profile.traits?.relationships?.map(traitToPlainText).find(
        (value): value is string => value !== null,
      ) ?? "관계에서는 거리, 속도, 표현 방식으로 세운의 압박이 드러납니다.",
    growthPattern:
      profile.traits?.growth?.map(traitToPlainText).find(
        (value): value is string => value !== null,
      ) ?? "해당 연도의 반복 신호를 학습과 조율 기준으로 바꾸는 것이 중요합니다.",
    reportUseCase: "saeunReport",
    reportUseCases,
  };
}

function getYearAccessStatus(
  yearAccess: AnnualFortuneYearAccess,
): AnnualFortuneYearAccessStatus {
  if (yearAccess.mode === "new_year_preview" && yearAccess.isSelectable) {
    return "new_year_preview";
  }

  return yearAccess.isSelectable ? "selectable" : "locked";
}

function buildYearAccessPolicy(input: {
  readonly selectedYear: number;
  readonly currentDate: Date;
  readonly yearAccess: AnnualFortuneYearAccess;
}): AnnualFortuneEvidencePacket["yearAccessPolicy"] {
  const currentYear = input.currentDate.getFullYear();
  const status = getYearAccessStatus(input.yearAccess);
  const availableYearRange = {
    from: currentYear - 5,
    to: currentYear,
  };
  const policyLabel =
    "기본 조회 가능 연도는 과거 5년과 올해이며, 매년 12월 1일부터 다음 해 신년사주가 열립니다.";

  return {
    selectedYear: input.selectedYear,
    currentYear,
    status,
    reason: input.yearAccess.reason ?? null,
    isNewYearPreview: status === "new_year_preview",
    availableYearRange,
    policyLabel,
    notice:
      status === "locked"
        ? input.yearAccess.reason ?? "선택한 연도는 현재 세운 v1 조회 범위 밖입니다."
        : status === "new_year_preview"
          ? `${input.selectedYear}년은 신년사주 성격의 미리보기 흐름으로 제공합니다.`
          : `${input.selectedYear}년은 세운 v1 조회 범위 안에서 선택 가능합니다.`,
  };
}

function buildCurrentMajorFortune(input: {
  readonly targetYear: number;
  readonly person: AnnualPersonInput;
  readonly dayMaster: HeavenlyStem;
}): AnnualFortuneEvidencePacket["currentMajorFortune"] {
  const cycles = input.person.majorFortuneCycles;

  if (cycles === undefined || cycles.length === 0) {
    return null;
  }

  const matchingCycle = cycles.find(
    (cycle) => cycle.startYear <= input.targetYear && input.targetYear <= cycle.endYear,
  );

  if (matchingCycle === undefined) {
    return null;
  }

  const ageInCycle =
    matchingCycle.startAge + (input.targetYear - matchingCycle.startYear);
  const cycleAccess = getMajorFortuneCycleForYear({
    cycles,
    currentYear: input.targetYear,
    currentAge: ageInCycle,
  });
  const cycle = cycleAccess.currentCycle;
  const stemTenGod = getTenGodForStemPair(input.dayMaster, cycle.stem);
  const branchTenGod = getBranchTenGod(input.dayMaster, cycle.branch);

  return {
    ganji: cycle.ganji,
    stemTenGod,
    branchTenGod,
    yearRange: `${cycle.startYear}년~${cycle.endYear}년`,
    ageRange: `한국나이 ${cycle.startAge}세~${cycle.endAge}세`,
    keyTheme: `${cycle.ganji} 대운은 ${stemTenGod}·${branchTenGod}의 10년 배경 위에서 움직입니다.`,
  };
}

function buildAnnualFortuneCore(input: {
  readonly annualGanji: AnnualGanjiInfo;
  readonly dayMaster: HeavenlyStem;
  readonly stemTenGod: TenGod;
  readonly elementEffect: AnnualFortuneEvidencePacket["elementEffect"];
  readonly branchInteractions: readonly AnnualBranchInteraction[];
  readonly opportunitySignals: AnnualFortuneEvidencePacket["opportunitySignals"];
  readonly difficultySignals: AnnualFortuneEvidencePacket["difficultySignals"];
}): AnnualFortuneEvidencePacket["annualFortune"] {
  const branchTenGod = getBranchTenGod(input.dayMaster, input.annualGanji.branch);
  const elementFocus = unique([
    input.annualGanji.stemElement,
    input.annualGanji.branchElement,
  ]);
  const supportSignals = input.opportunitySignals.map((signal) => signal.plain);
  const frictionSignals = input.difficultySignals.map((signal) => signal.plain);

  return {
    year: input.annualGanji.year,
    ganji: input.annualGanji.ganji,
    stem: input.annualGanji.stem,
    branch: input.annualGanji.branch,
    stemTenGod: input.stemTenGod,
    branchTenGod,
    elementFocus,
    yearTheme: `${input.annualGanji.displayTitle} ${input.stemTenGod} 흐름`,
    supportSignals,
    frictionSignals,
    interpretation: `${input.annualGanji.displayTitle}은 ${input.elementEffect.plain} ${input.stemTenGod}은 선택 연도에 결과와 행동 기준을 드러내는 핵심 십성입니다.`,
    caution:
      input.branchInteractions.length > 0
        ? "원국과 맞물리는 지지 작용은 월별 체감과 생활 리듬에서 먼저 확인해야 합니다."
        : "큰 지지 작용이 약해도 월별 운영 기준과 생활 리듬은 별도로 점검해야 합니다.",
  };
}

function buildMajorAnnualCross(input: {
  readonly currentMajorFortune: AnnualFortuneEvidencePacket["currentMajorFortune"];
  readonly annualFortune: AnnualFortuneEvidencePacket["annualFortune"];
}): AnnualFortuneEvidencePacket["majorAnnualCross"] {
  if (input.currentMajorFortune === null) {
    return null;
  }

  return {
    majorGanji: input.currentMajorFortune.ganji,
    annualGanji: input.annualFortune.ganji,
    majorToAnnualRelation: `${input.currentMajorFortune.ganji} 대운의 장기 배경 위에 ${input.annualFortune.ganji} 세운이 단기 자극으로 올라옵니다.`,
    majorTenGodToAnnualTenGod: `${input.currentMajorFortune.stemTenGod} 대운 천간 흐름 위에 ${input.annualFortune.stemTenGod} 세운 천간 흐름이 겹칩니다.`,
    interpretation:
      "세운은 대운의 방향을 바꾸는 별도 운이 아니라, 현재 10년 배경 위에서 올해 특히 크게 체감되는 행동 기준입니다.",
    caution:
      "대운과 세운이 동시에 자극하는 주제는 결과를 확정하기보다 역할, 돈, 관계, 회복 기준을 먼저 좁혀 읽어야 합니다.",
  };
}

function buildNatalAnnualRelations(input: {
  readonly annualBranch: EarthlyBranch;
  readonly branchInteractions: readonly AnnualBranchInteraction[];
}): AnnualFortuneEvidencePacket["natalAnnualRelations"] {
  const supportSignals = input.branchInteractions
    .filter((interaction) => ["육합", "삼합", "반합"].includes(interaction.type))
    .map((interaction) => interaction.plain);
  const frictionSignals = input.branchInteractions
    .filter((interaction) => ["충", "해", "형", "파"].includes(interaction.type))
    .map((interaction) => interaction.plain);

  return {
    annualBranch: input.annualBranch,
    interactions: input.branchInteractions,
    supportSignals,
    frictionSignals,
    interpretation:
      input.branchInteractions.length === 0
        ? "선택 연도 지지는 원국 지지와 큰 합충형파해를 만들지 않아, 월별 운영과 십성 흐름을 더 중심에 둡니다."
        : "선택 연도 지지가 원국의 실제 지지와 맞물리는 지점만 관계·일정·생활 리듬의 근거로 사용합니다.",
    caution:
      frictionSignals.length > 0
        ? "충·해·형·파는 사건 확정이 아니라 익숙한 리듬이 흔들리는 지점으로 조심해서 읽습니다."
        : "합과 반합도 결과 보장이 아니라 사람, 일정, 역할이 묶이는 흐름으로만 읽습니다.",
  };
}

function buildMonthlyFortunes(input: {
  readonly dayMaster: HeavenlyStem;
  readonly seeds: AnnualFortuneEvidencePacket["monthlyFortuneSeeds"];
}): AnnualFortuneEvidencePacket["monthlyFortunes"] {
  return input.seeds.map((seed) => {
    const stemTenGod = getTenGodForStemPair(input.dayMaster, seed.monthGanji.stem);
    const branchTenGod = getBranchTenGod(input.dayMaster, seed.monthGanji.branch);
    const hasFriction = /충|해|형|파/u.test(seed.natalInteractionSummary);
    const hasSupport = /보완|합|반합|삼합|육합/u.test(seed.natalInteractionSummary);

    return {
      month: seed.month,
      label: seed.label,
      ganji: seed.monthGanji.ganji,
      stem: seed.monthGanji.stem,
      branch: seed.monthGanji.branch,
      stemTenGod,
      branchTenGod,
      monthTheme: `${seed.label} ${seed.monthGanji.ganji} ${stemTenGod} 흐름`,
      supportSignals: hasSupport ? [seed.natalInteractionSummary] : [],
      frictionSignals: hasFriction ? [seed.natalInteractionSummary] : [],
      actionHint: `${seed.label}은 달력월 기준으로 ${seed.elementFocus} 흐름을 생활 운영에 적용합니다.`,
      caution:
        seed.monthGanji.basis === "calendar_month_approximation"
          ? "달력월 기준 운영 가이드이므로 절기와 개인 일정에 따라 체감 시점은 달라질 수 있습니다."
          : "절기 기준 월운도 결과를 확정하지 않고 운영 기준으로만 사용합니다.",
      interpretation: seed.plain,
    };
  });
}

function buildDomainFlows(input: {
  readonly annualFortune: AnnualFortuneEvidencePacket["annualFortune"];
  readonly lifeAreaSignals: AnnualFortuneEvidencePacket["lifeAreaSignals"];
  readonly difficultySignals: AnnualFortuneEvidencePacket["difficultySignals"];
  readonly userContext: UserContextProfile;
}): AnnualFortuneEvidencePacket["domainFlows"] {
  const fieldLabel = input.userContext.fieldLabel?.trim();
  const contextLabel =
    fieldLabel === undefined || fieldLabel.length === 0
      ? USER_LIFE_STATUS_LABELS[input.userContext.lifeStatus]
      : `${USER_LIFE_STATUS_LABELS[input.userContext.lifeStatus]} · ${fieldLabel}`;
  const signalTexts = input.lifeAreaSignals.map((signal) => signal.plain);
  const difficultyTexts = input.difficultySignals.map((signal) => signal.plain);
  const buildFlow = (
    key: AnnualFortuneDomainFlowKey,
    focus: string,
    actionHint: string,
  ) => ({
    title: annualDomainFlowTitles[key],
    summary: `${input.annualFortune.yearTheme}을 ${contextLabel}의 ${focus} 장면으로 번역합니다.`,
    supportingSignals: signalTexts.slice(0, 3),
    frictionSignals: difficultyTexts.slice(0, 3),
    actionHint,
  });

  return {
    careerWork: buildFlow(
      "careerWork",
      "결과물, 역할, 프로젝트",
      "올해 드러나는 일은 결과물 단위와 책임 범위를 먼저 정리하세요.",
    ),
    moneyResource: buildFlow(
      "moneyResource",
      "돈, 정산, 현실 자원",
      "수익이나 지출을 단정하지 말고 계약, 정산일, 고정비 기준을 먼저 잡으세요.",
    ),
    relationshipLove: buildFlow(
      "relationshipLove",
      "관계 거리와 표현",
      "관계에서는 감정 결론보다 연락 주기, 약속, 말의 온도를 먼저 조율하세요.",
    ),
    healthRoutine: buildFlow(
      "healthRoutine",
      "수면, 식사, 회복 리듬",
      "몸 관련 해석은 진단이 아니라 일정 과밀과 회복 루틴 점검 기준으로 사용하세요.",
    ),
    socialFamily: buildFlow(
      "socialFamily",
      "가족, 사회적 역할, 주변 기대",
      "주변 기대가 커질수록 역할과 시간을 문장으로 분리해 두세요.",
    ),
    studyGrowth: buildFlow(
      "studyGrowth",
      "공부, 자격, 정리와 성장",
      "공부와 성장 과제는 큰 결심보다 월별 산출물과 복습 단위로 쪼개세요.",
    ),
  };
}

function buildRiskPatterns(input: {
  readonly difficultySignals: AnnualFortuneEvidencePacket["difficultySignals"];
  readonly natalAnnualRelations: AnnualFortuneEvidencePacket["natalAnnualRelations"];
}): AnnualFortuneEvidencePacket["riskPatterns"] {
  const difficultyItems = input.difficultySignals.slice(0, 3).map((signal) => ({
    title: signal.plain.split(" ").slice(0, 5).join(" "),
    summary: signal.plain,
    evidence: [signal.type, signal.severity],
    prevention: "확정 예측이 아니라 부담이 커지는 영역을 좁혀 관리 기준을 세웁니다.",
  }));

  return [
    ...difficultyItems,
    {
      title: "원국·세운 관계 점검",
      summary: input.natalAnnualRelations.caution,
      evidence: input.natalAnnualRelations.interactions.map(
        (interaction) => interaction.plain,
      ),
      prevention: "원국에 실제로 있는 지지와 맞물리는 작용만 생활 장면으로 해석합니다.",
    },
  ].slice(0, 4);
}

function buildActionGuides(input: {
  readonly domainFlows: AnnualFortuneEvidencePacket["domainFlows"];
  readonly annualFortune: AnnualFortuneEvidencePacket["annualFortune"];
  readonly monthlyFortunes: AnnualFortuneEvidencePacket["monthlyFortunes"];
}): AnnualFortuneEvidencePacket["actionGuides"] {
  return [
    {
      title: `${input.annualFortune.year}년 첫 기준`,
      action: input.annualFortune.caution,
      timingHint: input.annualFortune.interpretation,
    },
    ...Object.values(input.domainFlows).slice(0, 4).map((flow) => ({
      title: flow.title,
      action: flow.actionHint,
      timingHint: flow.summary,
    })),
    {
      title: "월별 운영 기준",
      action: "12개월 월운은 달력월 기준 운영 가이드로 보고, 월별 행동 기준을 작게 조정하세요.",
      timingHint: `${input.monthlyFortunes.length}개월 월운 seed를 기준으로 합니다.`,
    },
  ].slice(0, 6);
}

function buildSaeunBridgeSignals(input: {
  readonly annualFortune: AnnualFortuneEvidencePacket["annualFortune"];
  readonly currentMajorFortune: AnnualFortuneEvidencePacket["currentMajorFortune"];
  readonly majorAnnualCross: AnnualFortuneEvidencePacket["majorAnnualCross"];
  readonly natalAnnualRelations: AnnualFortuneEvidencePacket["natalAnnualRelations"];
  readonly domainFlows: AnnualFortuneEvidencePacket["domainFlows"];
  readonly monthlyFortunes: AnnualFortuneEvidencePacket["monthlyFortunes"];
}): readonly MyeongliSignal[] {
  const elementSignals: MyeongliSignal[] = input.annualFortune.elementFocus.map(
    (element) => ({
      id: `saeun-element-${element}`,
      kind: "element",
      label: `${elementKo[element]} 세운 흐름`,
      value: element,
      evidence: input.annualFortune.interpretation,
      weight: 2,
    }),
  );
  const interactionSignals: MyeongliSignal[] =
    input.natalAnnualRelations.interactions.map((interaction, index) => ({
      id: `saeun-interaction-${index}`,
      kind: "interaction",
      label: `${interaction.type} 작용`,
      value: interaction.branches.join(""),
      evidence: interaction.plain,
      weight: ["충", "형", "파", "해"].includes(interaction.type) ? 3 : 2,
    }));
  const majorSignals: MyeongliSignal[] =
    input.currentMajorFortune === null
      ? []
      : [
          {
            id: "saeun-current-major-fortune",
            kind: "fortuneCycle",
            label: "현재 대운 배경",
            value: input.currentMajorFortune.ganji,
            evidence: input.currentMajorFortune.keyTheme,
            weight: 2,
          },
          {
            id: "saeun-current-major-ten-god",
            kind: "tenGod",
            label: `${input.currentMajorFortune.stemTenGod} 대운`,
            value: input.currentMajorFortune.stemTenGod,
            evidence: input.currentMajorFortune.ageRange,
            weight: 2,
          },
        ];
  const crossSignals: MyeongliSignal[] =
    input.majorAnnualCross === null
      ? []
      : [
          {
            id: "saeun-major-annual-cross",
            kind: "fortuneCycle",
            label: "대운·세운 교차",
            value: `${input.majorAnnualCross.majorGanji}-${input.majorAnnualCross.annualGanji}`,
            evidence: input.majorAnnualCross.interpretation,
            weight: 3,
          },
          {
            id: "saeun-major-annual-ten-god-cross",
            kind: "tenGod",
            label: "대운·세운 십성 교차",
            value: input.majorAnnualCross.majorTenGodToAnnualTenGod,
            evidence: input.majorAnnualCross.caution,
            weight: 2,
          },
        ];
  const domainSignals: MyeongliSignal[] = Object.entries(input.domainFlows).map(
    ([key, flow]) => ({
      id: `saeun-domain-${key}`,
      kind: "fortuneCycle",
      label: flow.title,
      value: key,
      evidence: [flow.summary, flow.actionHint].join(" "),
      weight: 1,
    }),
  );
  const monthlySignals: MyeongliSignal[] = input.monthlyFortunes
    .map((month) => ({
      id: `saeun-month-${month.month}`,
      kind: "fortuneCycle",
      label: month.monthTheme,
      value: month.ganji,
      evidence: month.interpretation,
      weight: 1,
    }));

  return [
    {
      id: "saeun-annual-fortune",
      kind: "fortuneCycle",
      label: "선택 연도 세운",
      value: input.annualFortune.ganji,
      evidence: input.annualFortune.interpretation,
      weight: 3,
    },
    {
      id: "saeun-annual-ten-god",
      kind: "tenGod",
      label: `${input.annualFortune.stemTenGod} 세운`,
      value: input.annualFortune.stemTenGod,
      evidence: input.annualFortune.yearTheme,
      weight: 3,
    },
    {
      id: "saeun-annual-branch-ten-god",
      kind: "tenGod",
      label: `${input.annualFortune.branchTenGod} 세운 지지`,
      value: input.annualFortune.branchTenGod,
      evidence: input.annualFortune.caution,
      weight: 2,
    },
    ...elementSignals,
    ...majorSignals,
    ...crossSignals,
    ...interactionSignals,
    ...domainSignals,
    ...monthlySignals,
  ];
}

function buildMonthlyNatalInteractionSummary(input: {
  readonly monthGanji: AnnualMonthGanjiInfo;
  readonly missingElements: readonly FiveElement[];
  readonly heavyElements: readonly FiveElement[];
  readonly natalBranches: readonly EarthlyBranch[];
}): string {
  const monthElements = unique([
    input.monthGanji.stemElement,
    input.monthGanji.branchElement,
  ]);
  const fillsMissing = monthElements.filter((element) =>
    input.missingElements.includes(element),
  );
  const overloadsHeavy = unique([
    ...monthElements.filter((element) => input.heavyElements.includes(element)),
    ...monthElements
      .map((element) => getGeneratedElement(element))
      .filter((element) => input.heavyElements.includes(element)),
  ]);
  const interactions = getAnnualBranchInteractions({
    annualBranch: input.monthGanji.branch,
    natalBranches: input.natalBranches,
  });

  return [
    fillsMissing.length > 0
      ? `${formatElementList(fillsMissing)} 부족 보완`
      : "부족 오행 직접 보완 약함",
    overloadsHeavy.length > 0
      ? `${formatElementList(overloadsHeavy)} 과다 자극`
      : "과다 오행 자극 약함",
    interactions.length > 0
      ? `지지 ${interactions
          .slice(0, 2)
          .map((interaction) => `${interaction.branches.join("")} ${interaction.type}`)
          .join(", ")}`
      : "뚜렷한 지지 충·합·해는 약함",
  ].join(" / ");
}

function buildMonthlyFortuneSeeds(input: {
  readonly targetYear: number;
  readonly missingElements: readonly FiveElement[];
  readonly heavyElements: readonly FiveElement[];
  readonly natalBranches: readonly EarthlyBranch[];
}
): AnnualFortuneEvidencePacket["monthlyFortuneSeeds"] {
  return Array.from({ length: 12 }, (_, index) => {
    const month = index + 1;
    const monthGanji = getAnnualMonthGanjiInfo({
      year: input.targetYear,
      month,
    });
    const elementFocus = `${elementKo[monthGanji.stemElement]}·${elementKo[monthGanji.branchElement]}`;
    const natalInteractionSummary = buildMonthlyNatalInteractionSummary({
      monthGanji,
      missingElements: input.missingElements,
      heavyElements: input.heavyElements,
      natalBranches: input.natalBranches,
    });

    return {
      month,
      label: monthGanji.label,
      monthGanji,
      elementFocus,
      basis: monthGanji.basis,
      natalInteractionSummary,
      plain: `${monthGanji.label}은 ${monthGanji.ganji} 흐름을 달력월 기준으로 근사해 보는 월별 운영 가이드입니다. ${monthGanji.elementSummary}`,
    };
  });
}

function buildElementEffect(input: {
  readonly annualElements: readonly FiveElement[];
  readonly missingElements: readonly FiveElement[];
  readonly heavyElements: readonly FiveElement[];
}): AnnualFortuneEvidencePacket["elementEffect"] {
  const strengthens = unique(input.annualElements);
  const fillsMissing = strengthens.filter((element) =>
    input.missingElements.includes(element),
  );
  const directOverloads = strengthens.filter((element) =>
    input.heavyElements.includes(element),
  );
  const indirectOverloads = strengthens
    .map((element) => getGeneratedElement(element))
    .filter((element) => input.heavyElements.includes(element));
  const overloadsHeavy = unique([...directOverloads, ...indirectOverloads]);
  const fillText =
    fillsMissing.length > 0
      ? `${formatElementList(fillsMissing)} 부족을 채웁니다`
      : "부족한 오행을 직접 채우는 힘은 약합니다";
  const overloadText =
    overloadsHeavy.length > 0
      ? `${formatElementList(overloadsHeavy)} 과다를 직접 또는 간접으로 키울 수 있습니다`
      : "이미 무거운 오행을 크게 더하는 흐름은 약합니다";

  return {
    strengthens,
    fillsMissing,
    overloadsHeavy,
    plain: `${formatElementList(strengthens)} 기운이 들어와 ${fillText}. 동시에 ${overloadText}.`,
  };
}

function addSignal<T extends { readonly area?: string; readonly type?: string }>(
  signals: T[],
  signal: T,
): void {
  const key = signal.area ?? signal.type;

  if (key === undefined || signals.every((item) => (item.area ?? item.type) !== key)) {
    signals.push(signal);
  }
}

function buildLifeAreaSignals(input: {
  readonly stemTenGod: TenGod;
  readonly elementEffect: AnnualFortuneEvidencePacket["elementEffect"];
  readonly branchInteractions: readonly AnnualBranchInteraction[];
}): AnnualFortuneEvidencePacket["lifeAreaSignals"] {
  const signals: AnnualFortuneEvidencePacket["lifeAreaSignals"][number][] = [];

  if (input.stemTenGod === "식신" || input.stemTenGod === "상관") {
    addSignal(signals, {
      area: "work",
      strength: "high",
      plain: `${input.stemTenGod} 세운은 결과물, 표현, 실행물을 밖으로 꺼내는 흐름을 강하게 만듭니다.`,
    });
  }
  if (input.stemTenGod === "편재" || input.stemTenGod === "정재") {
    addSignal(signals, {
      area: "money",
      strength: "high",
      plain: `${input.stemTenGod} 세운은 돈, 자원, 거래, 현실 관리 이슈를 전면에 올립니다.`,
    });
  }
  if (input.stemTenGod === "편관" || input.stemTenGod === "정관") {
    addSignal(signals, {
      area: "work",
      strength: "high",
      plain: `${input.stemTenGod} 세운은 책임, 평가, 직업적 압박과 역할 조정을 크게 느끼게 합니다.`,
    });
  }
  if (input.stemTenGod === "편인" || input.stemTenGod === "정인") {
    addSignal(signals, {
      area: "study_certificate",
      strength: "high",
      plain: `${input.stemTenGod} 세운은 학습, 자격, 문서, 보호 자원을 확인하게 만드는 흐름입니다.`,
    });
  }
  if (input.elementEffect.fillsMissing.includes("fire")) {
    addSignal(signals, {
      area: "relationship",
      strength: "medium",
      plain: "화가 부족한 원국에 화가 들어오면 표현의 온도와 대인 노출이 살아날 수 있습니다.",
    });
  }
  if (input.elementEffect.fillsMissing.includes("water")) {
    addSignal(signals, {
      area: "health_rhythm",
      strength: "medium",
      plain: "수가 보완되면 감정 완충, 휴식, 흐름 조절의 체감이 살아날 수 있습니다.",
    });
  }
  if (input.elementEffect.overloadsHeavy.includes("earth")) {
    addSignal(signals, {
      area: "money",
      strength: "medium",
      plain: "토가 더 무거워지면 돈, 책임, 관리, 보관의 일이 같이 늘어날 수 있습니다.",
    });
  }
  if (
    input.branchInteractions.some((interaction) =>
      interaction.affectedPillars?.includes("month"),
    )
  ) {
    addSignal(signals, {
      area: "work",
      strength: "medium",
      plain: "월지가 세운 지지와 맞물리면 일, 사회적 리듬, 생활 운영 방식이 체감됩니다.",
    });
  }
  if (
    input.branchInteractions.some((interaction) =>
      interaction.affectedPillars?.includes("hour"),
    )
  ) {
    addSignal(signals, {
      area: "health_rhythm",
      strength: "medium",
      plain: "시지가 세운 지지와 맞물리면 습관, 회복, 미래 계획의 리듬을 조정하게 됩니다.",
    });
  }

  return signals;
}

function buildDifficultySignals(input: {
  readonly missingElements: readonly FiveElement[];
  readonly stemTenGod: TenGod;
  readonly elementEffect: AnnualFortuneEvidencePacket["elementEffect"];
  readonly branchInteractions: readonly AnnualBranchInteraction[];
}): AnnualFortuneEvidencePacket["difficultySignals"] {
  const signals: AnnualFortuneEvidencePacket["difficultySignals"][number][] = [];
  const unfilled = input.missingElements.filter(
    (element) => !input.elementEffect.fillsMissing.includes(element),
  );

  if (input.elementEffect.overloadsHeavy.length > 0) {
    addSignal(signals, {
      type: "overload",
      severity: "medium",
      plain: `${formatElementList(input.elementEffect.overloadsHeavy)} 과다가 더 무거워져 책임감과 관리 부담이 커질 수 있습니다.`,
    });
  }
  if (input.elementEffect.overloadsHeavy.includes("earth")) {
    addSignal(signals, {
      type: "money_responsibility",
      severity: "medium",
      plain: "토 과다가 자극되면 돈, 일, 책임, 현실 관리가 동시에 올라와 무겁게 느껴질 수 있습니다.",
    });
  }
  if (unfilled.length > 0) {
    addSignal(signals, {
      type: "missing_element_unfilled",
      severity: "low",
      plain: `${formatElementList(unfilled)} 부족은 그 해에도 자동으로 해결되기보다 의식적 보완이 필요합니다.`,
    });
  }
  if (input.stemTenGod === "편관" || input.stemTenGod === "정관") {
    addSignal(signals, {
      type: "pressure",
      severity: "medium",
      plain: `${input.stemTenGod}은 책임, 평가, 규칙의 압박을 만들 수 있습니다.`,
    });
  }
  if (
    input.branchInteractions.some((interaction) =>
      ["충", "해", "형", "파"].includes(interaction.type),
    )
  ) {
    addSignal(signals, {
      type: "conflict",
      severity: "medium",
      plain: "세운 지지가 원국 지지와 충·해·형·파로 맞물리면 익숙한 리듬을 바꾸는 사건이 생기기 쉽습니다.",
    });
  }
  if (
    input.branchInteractions.some(
      (interaction) =>
        ["충", "해", "형", "파"].includes(interaction.type) &&
        interaction.affectedPillars?.includes("day"),
    )
  ) {
    addSignal(signals, {
      type: "relationship_friction",
      severity: "medium",
      plain: "일지가 흔들리면 몸, 가까운 관계, 사적인 리듬에서 피로가 먼저 체감될 수 있습니다.",
    });
  }

  return signals;
}

function buildOpportunitySignals(input: {
  readonly stemTenGod: TenGod;
  readonly elementEffect: AnnualFortuneEvidencePacket["elementEffect"];
  readonly branchInteractions: readonly AnnualBranchInteraction[];
}): AnnualFortuneEvidencePacket["opportunitySignals"] {
  const signals: AnnualFortuneEvidencePacket["opportunitySignals"][number][] = [];

  if (input.stemTenGod === "식신" || input.stemTenGod === "상관") {
    addSignal(signals, {
      type: "expression",
      strength: "high",
      plain: `${input.stemTenGod}은 말, 결과물, 콘텐츠, 실행물을 밖으로 꺼낼 기회를 만듭니다.`,
    });
  }
  if (input.stemTenGod === "편재" || input.stemTenGod === "정재") {
    addSignal(signals, {
      type: "money",
      strength: "high",
      plain: `${input.stemTenGod}은 수익, 거래, 자원 관리의 기회를 키울 수 있습니다.`,
    });
  }
  if (input.stemTenGod === "편관" || input.stemTenGod === "정관") {
    addSignal(signals, {
      type: "career",
      strength: "medium",
      plain: `${input.stemTenGod}은 직업적 책임과 공식 역할을 정리할 기회를 줍니다.`,
    });
  }
  if (input.stemTenGod === "편인" || input.stemTenGod === "정인") {
    addSignal(signals, {
      type: "learning",
      strength: "medium",
      plain: `${input.stemTenGod}은 배움, 자격, 문서, 조언을 통해 기반을 다시 잡게 합니다.`,
    });
  }
  for (const element of input.elementEffect.fillsMissing) {
    addSignal(signals, {
      type: element === "fire" ? "expression" : "stability",
      strength: element === "fire" ? "high" : "medium",
      plain: `${elementKo[element]} 부족을 채우는 흐름은 평소 늦게 켜지던 영역을 활성화합니다.`,
    });
  }
  if (
    input.branchInteractions.some((interaction) =>
      ["육합", "삼합", "반합"].includes(interaction.type),
    )
  ) {
    addSignal(signals, {
      type: "movement",
      strength: "medium",
      plain: "합과 반합은 사람, 장소, 일정이 묶이면서 움직임이나 연결 기회를 만들 수 있습니다.",
    });
  }

  return signals;
}

function buildWarnings(labels: readonly string[]): readonly string[] {
  return labels.some((label) =>
    (diagnosticOnlyLabels as readonly string[]).includes(label),
  )
    ? ["diagnostic features excluded"]
    : [];
}

export function buildAnnualFortuneEvidence(input: {
  readonly targetYear: number;
  readonly currentDate: Date;
  readonly person: AnnualPersonInput;
}): AnnualFortuneEvidencePacket {
  const annualGanji = getAnnualGanjiInfo(input.targetYear);
  const yearAccess = getAnnualFortuneYearAccess({
    targetYear: input.targetYear,
    currentDate: input.currentDate,
  });
  const dayMaster = parsePillarStem(input.person.pillars.day);
  const natalBranches = [
    input.person.pillars.year,
    input.person.pillars.month,
    input.person.pillars.day,
    input.person.pillars.hour,
  ]
    .map(parsePillarBranch)
    .filter((branch): branch is EarthlyBranch => branch !== undefined);
  const missingElements = getElementsFromLabels(input.person.labels, "부족");
  const heavyElements = getElementsFromLabels(input.person.labels, "과다");
  const stemTenGod = getTenGodForStemPair(dayMaster, annualGanji.stem);
  const elementEffect = buildElementEffect({
    annualElements: [annualGanji.stemElement, annualGanji.branchElement],
    missingElements,
    heavyElements,
  });
  const branchInteractions = getAnnualBranchInteractions({
    annualBranch: annualGanji.branch,
    natalBranches,
  });
  const lifeAreaSignals = buildLifeAreaSignals({
    stemTenGod,
    elementEffect,
    branchInteractions,
  });
  const difficultySignals = buildDifficultySignals({
    missingElements,
    stemTenGod,
    elementEffect,
    branchInteractions,
  });
  const opportunitySignals = buildOpportunitySignals({
    stemTenGod,
    elementEffect,
    branchInteractions,
  });
  const currentMajorFortune = buildCurrentMajorFortune({
    targetYear: input.targetYear,
    person: input.person,
    dayMaster,
  });
  const annualFortune = buildAnnualFortuneCore({
    annualGanji,
    dayMaster,
    stemTenGod,
    elementEffect,
    branchInteractions,
    opportunitySignals,
    difficultySignals,
  });
  const natalAnnualRelations = buildNatalAnnualRelations({
    annualBranch: annualGanji.branch,
    branchInteractions,
  });
  const monthlyFortuneSeeds = buildMonthlyFortuneSeeds({
    targetYear: input.targetYear,
    missingElements,
    heavyElements,
    natalBranches,
  });
  const monthlyFortunes = buildMonthlyFortunes({
    dayMaster,
    seeds: monthlyFortuneSeeds,
  });
  const domainFlows = buildDomainFlows({
    annualFortune,
    lifeAreaSignals,
    difficultySignals,
    userContext: input.person.userContext,
  });
  const majorAnnualCross = buildMajorAnnualCross({
    currentMajorFortune,
    annualFortune,
  });
  const bridgePacket = buildMyeongliMbtiBridgePacket({
    mbtiType: input.person.mbti,
    productContext: "saeun",
    myeongliSignals: buildSaeunBridgeSignals({
      annualFortune,
      currentMajorFortune,
      majorAnnualCross,
      natalAnnualRelations,
      domainFlows,
      monthlyFortunes,
    }),
  });
  const bridgeEvidence = bridgePacket.isEmpty
    ? undefined
    : buildProductBridgeEvidence(bridgePacket, "saeun");

  return {
    productType: "annual_fortune",
    productVersion: "v1",
    selectedYear: input.targetYear,
    targetYear: input.targetYear,
    currentDate: formatDateOnly(input.currentDate),
    mode: yearAccess.mode,
    yearAccess,
    yearAccessPolicy: buildYearAccessPolicy({
      selectedYear: input.targetYear,
      currentDate: input.currentDate,
      yearAccess,
    }),
    personContext: {
      name: input.person.label,
      ...(input.person.birthDate === undefined
        ? {}
        : { birthDate: input.person.birthDate }),
      ...(input.person.gender === undefined ? {} : { gender: input.person.gender }),
      mbtiType: input.person.mbti ?? null,
      userContext: input.person.userContext,
    },
    baseSaju: {
      dayMaster,
      pillars: input.person.pillars,
      natalLabels: input.person.labels,
    },
    mbtiBasis: buildMbtiBasis(input.person.mbti),
    ...(bridgeEvidence === undefined ? {} : { bridgeEvidence }),
    currentMajorFortune,
    annualFortune,
    majorAnnualCross,
    natalAnnualRelations,
    monthlyFortunes,
    yearlyThemeSummary: {
      headline: annualFortune.yearTheme,
      summary: annualFortune.interpretation,
      keySignals: [
        ...annualFortune.supportSignals.slice(0, 2),
        ...annualFortune.frictionSignals.slice(0, 2),
      ],
    },
    domainFlows,
    riskPatterns: buildRiskPatterns({
      difficultySignals,
      natalAnnualRelations,
    }),
    actionGuides: buildActionGuides({
      domainFlows,
      annualFortune,
      monthlyFortunes,
    }),
    safetyNotes: annualSafetyNotes,
    annualGanji,
    userPillars: input.person.pillars,
    userContext: input.person.userContext,
    contextTranslationHints: buildContextTranslationHints(
      input.person.userContext,
    ),
    dayMaster,
    annualTenGod: {
      stemTenGod,
      branchMainElement: getBranchElement(annualGanji.branch),
      plain: `${annualGanji.displayTitle}의 천간 ${annualGanji.stem}은 ${dayMaster} 일간에게 ${stemTenGod}으로 들어옵니다.`,
    },
    elementEffect,
    branchInteractions,
    lifeAreaSignals,
    difficultySignals,
    opportunitySignals,
    monthlyFortuneSeeds,
    warnings: buildWarnings(input.person.labels),
  };
}
