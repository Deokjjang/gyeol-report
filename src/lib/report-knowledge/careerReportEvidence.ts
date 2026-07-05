import type {
  FiveElement,
  HeavenlyStem,
  TenGod,
} from "./annualFortuneTypes";
import {
  getAnnualGanjiInfo,
  getTenGodForStemPair,
} from "./annualFortuneYearRules";
import {
  buildMyeongliMbtiBridgePacket,
  buildProductBridgeEvidence,
  type MyeongliSignal,
} from "./bridge";
import { calculateSaju } from "../saju/calculateSaju";
import type {
  EarthlyBranch as SajuEarthlyBranch,
  Gender as SajuGender,
  HeavenlyStem as SajuHeavenlyStem,
  Pillar as SajuPillar,
  SajuCalcInput,
  SajuCalcResult,
  TenGod as SajuTenGod,
} from "../saju/types";
import type {
  CareerReportEvidencePacket,
  CareerReportFixturePerson,
  CareerReportManseRyeokPillarDetail,
  CareerReportMyeongliSignalInterpretation,
  CareerReportPillarKey,
  CareerSignal,
  InvestmentStyleArchetype,
  MoneyStyleArchetype,
  StudyStyleArchetype,
  WorkStyleArchetype,
} from "./careerReportTypes";
import type { UserLifeStatus } from "./userContextTypes";

type BuildCareerReportEvidenceInput = {
  readonly fixtureId?: string;
  readonly person: CareerReportFixturePerson;
};

type MbtiCareerProfile = CareerReportEvidencePacket["mbtiCareerBasis"];

type CareerMatrixQualitySummary = {
  readonly sameJobsAcrossAllFixturesWarnings: number;
  readonly specificStockTickerWarnings: number;
  readonly guaranteedReturnWarnings: number;
  readonly hardDeterministicClaimWarnings: number;
  readonly deokminLeakageWarnings: number;
};

const heavenlyStems = [
  "甲",
  "乙",
  "丙",
  "丁",
  "戊",
  "己",
  "庚",
  "辛",
  "壬",
  "癸",
] as const satisfies readonly HeavenlyStem[];

const elementLabels = {
  wood: "목",
  fire: "화",
  earth: "토",
  metal: "금",
  water: "수",
} as const satisfies Record<FiveElement, string>;

const allElements = [
  "wood",
  "fire",
  "earth",
  "metal",
  "water",
] as const satisfies readonly FiveElement[];

const allTenGods = [
  "비견",
  "겁재",
  "식신",
  "상관",
  "편재",
  "정재",
  "편관",
  "정관",
  "편인",
  "정인",
] as const satisfies readonly TenGod[];

const sajuTenGodLabels = {
  比肩: "비견",
  劫財: "겁재",
  食神: "식신",
  傷官: "상관",
  偏財: "편재",
  正財: "정재",
  偏官: "편관",
  正官: "정관",
  偏印: "편인",
  正印: "정인",
} as const satisfies Record<SajuTenGod, TenGod>;

const careerPillarKeys = [
  "year",
  "month",
  "day",
  "hour",
] as const satisfies readonly CareerReportPillarKey[];

const pillarPositionLabels = {
  year: "연",
  month: "월",
  day: "일",
  hour: "시",
} as const satisfies Record<CareerReportPillarKey, string>;

const twelveLifeStageByDayStem = {
  甲: {
    亥: "장생",
    子: "목욕",
    丑: "관대",
    寅: "건록",
    卯: "제왕",
    辰: "쇠",
    巳: "병",
    午: "사",
    未: "묘",
    申: "절",
    酉: "태",
    戌: "양",
  },
  乙: {
    午: "장생",
    巳: "목욕",
    辰: "관대",
    卯: "건록",
    寅: "제왕",
    丑: "쇠",
    子: "병",
    亥: "사",
    戌: "묘",
    酉: "절",
    申: "태",
    未: "양",
  },
  丙: {
    寅: "장생",
    卯: "목욕",
    辰: "관대",
    巳: "건록",
    午: "제왕",
    未: "쇠",
    申: "병",
    酉: "사",
    戌: "묘",
    亥: "절",
    子: "태",
    丑: "양",
  },
  丁: {
    酉: "장생",
    申: "목욕",
    未: "관대",
    午: "건록",
    巳: "제왕",
    辰: "쇠",
    卯: "병",
    寅: "사",
    丑: "묘",
    子: "절",
    亥: "태",
    戌: "양",
  },
  戊: {
    寅: "장생",
    卯: "목욕",
    辰: "관대",
    巳: "건록",
    午: "제왕",
    未: "쇠",
    申: "병",
    酉: "사",
    戌: "묘",
    亥: "절",
    子: "태",
    丑: "양",
  },
  己: {
    酉: "장생",
    申: "목욕",
    未: "관대",
    午: "건록",
    巳: "제왕",
    辰: "쇠",
    卯: "병",
    寅: "사",
    丑: "묘",
    子: "절",
    亥: "태",
    戌: "양",
  },
  庚: {
    巳: "장생",
    午: "목욕",
    未: "관대",
    申: "건록",
    酉: "제왕",
    戌: "쇠",
    亥: "병",
    子: "사",
    丑: "묘",
    寅: "절",
    卯: "태",
    辰: "양",
  },
  辛: {
    子: "장생",
    亥: "목욕",
    戌: "관대",
    酉: "건록",
    申: "제왕",
    未: "쇠",
    午: "병",
    巳: "사",
    辰: "묘",
    卯: "절",
    寅: "태",
    丑: "양",
  },
  壬: {
    申: "장생",
    酉: "목욕",
    戌: "관대",
    亥: "건록",
    子: "제왕",
    丑: "쇠",
    寅: "병",
    卯: "사",
    辰: "묘",
    巳: "절",
    午: "태",
    未: "양",
  },
  癸: {
    卯: "장생",
    寅: "목욕",
    丑: "관대",
    子: "건록",
    亥: "제왕",
    戌: "쇠",
    酉: "병",
    申: "사",
    未: "묘",
    午: "절",
    巳: "태",
    辰: "양",
  },
} as const satisfies Record<
  SajuHeavenlyStem,
  Record<SajuEarthlyBranch, string>
>;

const tenGodGroupSignals = [
  {
    label: "재성",
    targets: ["재성", "편재", "정재", "재다신약"],
  },
  {
    label: "관성",
    targets: ["관성", "편관", "정관"],
  },
  {
    label: "식상",
    targets: ["식상", "식신", "상관", "무식상"],
  },
  {
    label: "인성",
    targets: ["인성", "편인", "정인", "무인성"],
  },
  {
    label: "비겁",
    targets: ["비겁", "비견", "겁재"],
  },
] as const;

const hardClaimPatterns = [
  "반드시",
  "무조건",
  "합격합니다",
  "불합격합니다",
  "이직합니다",
  "퇴사합니다",
  "승진합니다",
  "창업합니다",
  "돈을 법니다",
  "투자 수익이 납니다",
  "성공합니다",
  "망합니다",
] as const;

const guaranteedReturnPatterns = [
  "반드시 오른다",
  "수익을 낸다",
  "원금 보장",
  "투자 수익이 납니다",
] as const;

const stockTickerPattern = /\b(?:AAPL|TSLA|NVDA|MSFT|GOOGL|AMZN|005930|000660)\b/u;

function unique<T>(values: readonly T[]): readonly T[] {
  return [...new Set(values)];
}

function includesAny(labels: readonly string[], targets: readonly string[]): boolean {
  return targets.some((target) => labels.some((label) => label.includes(target)));
}

function parseDayMaster(dayPillar: string): HeavenlyStem {
  const stem = dayPillar.slice(0, 1);

  if (!heavenlyStems.includes(stem as HeavenlyStem)) {
    throw new Error(`Invalid career report day pillar: ${dayPillar}`);
  }

  return stem as HeavenlyStem;
}

function getElementsFromLabels(
  labels: readonly string[],
  suffix: "과다" | "부족",
): readonly FiveElement[] {
  return allElements.filter((element) =>
    labels.some((label) => label.includes(`${elementLabels[element]} ${suffix}`)),
  );
}

function getTenGodFocus(labels: readonly string[]): readonly TenGod[] {
  const direct = allTenGods.filter((tenGod) =>
    labels.some((label) => label.includes(tenGod)),
  );
  const expanded: TenGod[] = [...direct];

  if (includesAny(labels, ["재성 강함", "재다신약"])) {
    expanded.push("편재", "정재");
  }
  if (includesAny(labels, ["관성 강함"])) {
    expanded.push("편관", "정관");
  }
  if (includesAny(labels, ["식상 과다", "무식상"])) {
    expanded.push("식신", "상관");
  }
  if (includesAny(labels, ["인성 강함", "무인성"])) {
    expanded.push("편인", "정인");
  }
  if (includesAny(labels, ["비겁 강함"])) {
    expanded.push("비견", "겁재");
  }

  return unique(expanded);
}

function buildDayMasterPlain(dayMaster: HeavenlyStem): string {
  const plainByStem = {
    甲: "甲 일간은 방향을 세우고 뻗어 나가려는 성향이 강합니다. 직업에서는 기준을 잡고 구조를 키우는 방식이 중요합니다.",
    乙: "乙 일간은 섬세하게 조율하고 연결하는 힘이 있습니다. 직업에서는 사람과 시스템 사이를 유연하게 잇는 방식이 중요합니다.",
    丙: "丙 일간은 드러내고 밝히는 힘이 있습니다. 직업에서는 존재감, 표현, 공개된 성과가 중요합니다.",
    丁: "丁 일간은 집중력과 세밀한 감각이 강합니다. 직업에서는 전문성, 완성도, 디테일이 중요합니다.",
    戊: "戊 일간은 현실을 버티고 구조를 만드는 힘이 있습니다. 직업에서는 운영, 관리, 책임 구획이 중요합니다.",
    己: "己 일간은 현실을 다듬고 안정시키는 힘이 있습니다. 직업에서는 관리, 조정, 실무 안정성이 중요합니다.",
    庚: "庚 일간은 기준을 세우고 잘라내는 힘이 있습니다. 직업에서는 판단, 실행, 경쟁력이 중요합니다.",
    辛: "辛 일간은 정교함과 선별력이 강합니다. 직업에서는 품질, 분석, 정확도가 중요합니다.",
    壬: "壬 일간은 정보와 흐름을 크게 읽는 힘이 있습니다. 직업에서는 이동성, 확장성, 전략적 관찰이 중요합니다.",
    癸: "癸 일간은 세밀한 정보와 적응력이 강합니다. 직업에서는 분석, 학습, 관계 속 조율이 중요합니다.",
  } as const satisfies Record<HeavenlyStem, string>;

  return plainByStem[dayMaster];
}

function buildMyeongliCareerBasis(input: {
  readonly dayMaster: HeavenlyStem;
  readonly labels: readonly string[];
}): CareerReportEvidencePacket["myeongliCareerBasis"] {
  const heavyElements = getElementsFromLabels(input.labels, "과다");
  const missingElements = getElementsFromLabels(input.labels, "부족");
  const tenGodFocus = getTenGodFocus(input.labels);
  const dominantElements = heavyElements.length > 0 ? heavyElements : [];
  const hasWealth = includesAny(input.labels, ["재성", "편재", "정재", "재다신약"]);
  const hasOfficer = includesAny(input.labels, ["관성", "편관", "정관"]);
  const hasExpression = includesAny(input.labels, ["식상", "식신", "상관"]);
  const hasResource = includesAny(input.labels, ["인성", "편인", "정인"]);
  const hasPeer = includesAny(input.labels, ["비겁", "비견", "겁재"]);
  const careerParts = [
    hasWealth
      ? "재성 흐름이 있어 돈, 자원, 계약, 현실 책임을 다루는 일에서 감각이 살아납니다."
      : undefined,
    hasOfficer
      ? "관성 흐름은 조직, 규칙, 평가, 책임 검증 안에서 역할을 얻기 쉽다는 근거입니다."
      : undefined,
    hasExpression
      ? "식상 흐름은 결과물, 표현, 콘텐츠, 포트폴리오처럼 밖으로 보이는 산출물과 연결됩니다."
      : undefined,
    hasResource
      ? "인성 흐름은 공부, 문서, 자격증, 연구, 지식 축적 쪽에서 힘을 줍니다."
      : undefined,
    hasPeer
      ? "비겁 흐름은 자기 기준, 경쟁, 협업, 독립성, 프리랜서형 자기 브랜드와 연결됩니다."
      : undefined,
    heavyElements.includes("earth")
      ? "토 과다는 운영, 구조화, 비용 관리에는 유리하지만 책임을 과하게 떠안는 위험도 만듭니다."
      : undefined,
  ].filter((part): part is string => part !== undefined);

  const moneyParts = [
    hasWealth
      ? "돈은 감으로 굴리기보다 계약, 정산, 비용, 자원 배치처럼 구조로 묶을 때 강합니다."
      : "돈은 큰 한 방보다 수입과 지출의 리듬을 일정하게 만드는 방식이 안정적입니다.",
    heavyElements.includes("earth")
      ? "토가 무거우면 부동산, 고정비, 장기 자산, 운영비처럼 현실 숫자를 오래 붙드는 감각이 중요합니다."
      : undefined,
    missingElements.includes("fire")
      ? "화 부족은 홍보, 노출, 속도감이 약해질 수 있으니 성과를 일부러 드러내는 장치가 필요합니다."
      : undefined,
    missingElements.includes("water")
      ? "수 부족은 회복, 정보 흐름, 유연성이 약해질 수 있어 돈과 일을 동시에 밀어붙일 때 과열을 조심해야 합니다."
      : undefined,
  ].filter((part): part is string => part !== undefined);

  const studyParts = [
    hasResource
      ? "공부는 문서, 자격증, 이론 정리, 깊은 분석으로 쌓을수록 힘이 납니다."
      : "공부는 추상적인 계획보다 실제 직무 산출물과 연결될 때 오래 갑니다.",
    hasExpression
      ? "식상이 있으면 배운 것을 포트폴리오, 발표, 콘텐츠로 꺼내야 실력이 보입니다."
      : undefined,
    includesAny(input.labels, ["무인성"])
      ? "무인성은 오래 앉아 이론만 붙드는 방식보다 목표, 시험 일정, 피드백 구조가 있어야 덜 흔들립니다."
      : undefined,
    includesAny(input.labels, ["무식상"])
      ? "무식상은 실력을 밖으로 보여주는 장치를 의식적으로 만들어야 포트폴리오와 면접에서 손해가 줄어듭니다."
      : undefined,
  ].filter((part): part is string => part !== undefined);

  return {
    dayMasterPlain: buildDayMasterPlain(input.dayMaster),
    dominantElements,
    missingElements,
    heavyElements,
    tenGodFocus,
    careerPlain: careerParts.join(" "),
    moneyPlain: moneyParts.join(" "),
    studyPlain: studyParts.join(" "),
  };
}

function normalizeMbtiType(type: string | null | undefined): string | null {
  if (type === undefined || type === null) {
    return null;
  }

  const normalized = type.trim().toUpperCase();

  return normalized.length === 4 ? normalized : null;
}

function buildMbtiCareerBasis(type: string | null | undefined): MbtiCareerProfile {
  const normalized = normalizeMbtiType(type);

  if (normalized === "ENTJ") {
    return {
      type: normalized,
      workStylePlain:
        "ENTJ는 전략, 구조, 결정, 목표, 효율을 중시합니다. 일에서는 방향을 잡고 기준을 세운 뒤 사람과 자원을 움직이는 방식이 강합니다.",
      strengthPlain:
        "리더십, 우선순위 판단, 실행 압박, 성과 기준 설정이 강점입니다.",
      riskPlain:
        "모호함을 오래 참기 어렵고, 감정 유지나 세부 회복 신호를 과소평가할 수 있습니다.",
      moneyBehaviorPlain:
        "돈은 규모, ROI, 성과형 보상, 투자 논리로 보려는 경향이 강합니다. 통제감이 커지면 공격적으로 움직일 위험이 있습니다.",
      studyPlain:
        "공부는 목표 기반, 시험 전략, 산출물 중심, 레버리지를 높이는 자격증일 때 효율이 올라갑니다.",
    };
  }
  if (normalized === "INTP") {
    return {
      type: normalized,
      workStylePlain:
        "INTP는 원리, 분석, 연구, 시스템 이해가 강합니다. 일에서는 깊게 파고 정확한 구조를 찾아내는 방식이 맞습니다.",
      strengthPlain: "복잡한 문제 분석, 모델링, 연구, 논리 검증이 강점입니다.",
      riskPlain:
        "완벽히 이해하기 전까지 실행을 미루거나 현실 마감과 소통을 늦출 수 있습니다.",
      moneyBehaviorPlain:
        "돈은 즉흥 확장보다 분석, 비교, 리스크 검토 뒤 움직이는 쪽이 맞습니다.",
      studyPlain:
        "공부는 깊은 연구, 원리 이해, 긴 호흡의 탐구형 학습이 잘 맞습니다.",
    };
  }
  if (normalized === "ENFP" || normalized === "ESFP") {
    return {
      type: normalized,
      workStylePlain:
        `${normalized}는 사람, 표현, 현장 반응, 새로운 시도를 통해 힘이 납니다. 일에서는 콘텐츠, 판매, 커뮤니티, 공개된 결과물에서 장점이 보입니다.`,
      strengthPlain:
        "사람을 끌어들이는 힘, 표현력, 빠른 반응, 아이디어 확장이 강점입니다.",
      riskPlain:
        "흥미가 떨어지면 마무리가 약해지고, 충동적 소비나 즉흥 결정이 늘어날 수 있습니다.",
      moneyBehaviorPlain:
        "돈은 사람과 기회가 움직이는 곳에서 접점이 생기지만, 지출 기준을 세우지 않으면 새는 돈이 커질 수 있습니다.",
      studyPlain:
        "공부는 발표, 피드백, 실습, 콘텐츠화처럼 밖으로 꺼내는 방식이 잘 맞습니다.",
    };
  }
  if (normalized === "ISTJ" || normalized === "ESTJ") {
    return {
      type: normalized,
      workStylePlain:
        `${normalized}는 질서, 책임, 반복 가능한 기준, 관리 체계를 중시합니다. 일에서는 규칙과 평가 기준이 있는 환경에서 안정성이 큽니다.`,
      strengthPlain:
        "절차 준수, 일정 관리, 책임감, 기록과 검증이 강점입니다.",
      riskPlain:
        "변수가 많은 환경에서는 보수적으로 굳거나 새 기회를 늦게 잡을 수 있습니다.",
      moneyBehaviorPlain:
        "돈은 월급, 고정비, 예산, 안정적 축적처럼 관리 가능한 구조가 잘 맞습니다.",
      studyPlain:
        "공부는 커리큘럼, 기출 반복, 체크리스트, 자격증형 준비에 강합니다.",
    };
  }
  if (normalized === "ISFP") {
    return {
      type: normalized,
      workStylePlain:
        "ISFP는 감각, 취향, 실제 결과물, 조용한 집중이 중요합니다. 일에서는 손에 잡히는 산출물과 자기 리듬이 맞아야 오래 갑니다.",
      strengthPlain:
        "디테일 감각, 결과물 완성, 취향 기반 선택, 현장 적응이 강점입니다.",
      riskPlain:
        "과도한 경쟁과 강한 통제 환경에서는 소진되거나 자기 표현이 줄어들 수 있습니다.",
      moneyBehaviorPlain:
        "돈은 큰 모험보다 자기 기술을 꾸준히 수익화하고 지출 리듬을 안정시키는 방식이 맞습니다.",
      studyPlain:
        "공부는 반복 실습, 포트폴리오 제작, 멘토 피드백이 있을 때 유지됩니다.",
    };
  }

  return {
    type: normalized,
    workStylePlain:
      "MBTI가 없거나 지원 범위 밖이면 명리 근거를 중심으로 직업·돈·학업 방향을 봅니다.",
    strengthPlain: "행동 성향 정보는 보조 근거로만 반영합니다.",
    riskPlain:
      "MBTI 정보가 없어도 사주 원국의 구조와 현재 상태 근거는 유지됩니다.",
    moneyBehaviorPlain:
      "돈 성향은 재성, 오행 과다부족, 현재 직업 상태를 중심으로 봅니다.",
    studyPlain: "학업 전략은 인성, 식상, 현재 준비 분야를 중심으로 봅니다.",
  };
}

function buildWorkStyleArchetypes(input: {
  readonly labels: readonly string[];
  readonly mbtiType: string | null | undefined;
  readonly lifeStatus: UserLifeStatus;
}): readonly WorkStyleArchetype[] {
  const result: WorkStyleArchetype[] = [];

  if (includesAny(input.labels, ["재성", "편재", "정재", "관성", "토 과다"])) {
    result.push("operator_planner", "manager_controller");
  }
  if (includesAny(input.labels, ["식상", "식신", "상관"])) {
    result.push("creator_expression", "builder_executor");
  }
  if (includesAny(input.labels, ["인성", "편인", "정인"])) {
    result.push("specialist_researcher");
  }
  if (includesAny(input.labels, ["비겁", "비견", "겁재"]) || input.lifeStatus === "freelancer") {
    result.push("independent_freelancer");
  }
  if (normalizeMbtiType(input.mbtiType) === "ENTJ") {
    result.push("system_architect", "manager_controller");
  }
  if (normalizeMbtiType(input.mbtiType) === "ENTP") {
    result.push("sales_networker");
  }

  return unique(result.length > 0 ? result : ["builder_executor"]);
}

function buildMoneyStyleArchetypes(
  labels: readonly string[],
): readonly MoneyStyleArchetype[] {
  const result: MoneyStyleArchetype[] = [];

  if (includesAny(labels, ["재성", "편재", "정재", "재다신약"])) {
    result.push("contract_project_income", "cost_control_first", "side_income_builder");
  }
  if (includesAny(labels, ["토 과다", "정재"])) {
    result.push("asset_accumulation", "salary_stability");
  }
  if (includesAny(labels, ["식상", "상관", "편재"])) {
    result.push("business_trade_income");
  }

  return unique(result.length > 0 ? result : ["salary_stability"]);
}

function buildInvestmentStyleArchetypes(
  labels: readonly string[],
): readonly InvestmentStyleArchetype[] {
  const result: InvestmentStyleArchetype[] = [
    "blue_chip_monthly_dca",
    "index_diversification",
    "avoid_leverage",
  ];

  if (includesAny(labels, ["토 과다", "정재", "재성"])) {
    result.push("long_term_accumulation", "cashflow_first");
  }
  if (includesAny(labels, ["토 과다"])) {
    result.push("real_asset_preference");
  }
  if (includesAny(labels, ["편재"])) {
    result.push("active_trading_caution");
  }

  return unique(result);
}

function buildStudyStyleArchetypes(
  labels: readonly string[],
): readonly StudyStyleArchetype[] {
  const result: StudyStyleArchetype[] = ["structured_curriculum"];

  if (includesAny(labels, ["인성", "편인", "정인"])) {
    result.push("certificate_based", "deep_research");
  }
  if (includesAny(labels, ["식상", "식신", "상관", "무식상"])) {
    result.push("portfolio_based", "mentor_feedback");
  }
  if (includesAny(labels, ["무인성"])) {
    result.push("avoid_cramming", "practice_repetition");
  }

  return unique(result);
}

function buildCombinedCareerProfile(input: {
  readonly myeongli: CareerReportEvidencePacket["myeongliCareerBasis"];
  readonly mbti: MbtiCareerProfile;
  readonly fieldLabel?: string | null;
  readonly lifeStatus: UserLifeStatus;
  readonly labels: readonly string[];
}): CareerReportEvidencePacket["combinedCareerProfile"] {
  const mbtiType = input.mbti.type;
  const workStyleArchetypes = buildWorkStyleArchetypes({
    labels: input.labels,
    mbtiType,
    lifeStatus: input.lifeStatus,
  });
  const moneyStyleArchetypes = buildMoneyStyleArchetypes(input.labels);
  const investmentStyleArchetypes = buildInvestmentStyleArchetypes(input.labels);
  const studyStyleArchetypes = buildStudyStyleArchetypes(input.labels);
  const hasDeokminLikeStructure =
    includesAny(input.labels, ["재다신약"]) &&
    includesAny(input.labels, ["무인성"]) &&
    includesAny(input.labels, ["무식상"]) &&
    mbtiType === "ENTJ";
  const headline = hasDeokminLikeStructure
    ? "운영형 기획자 / 전략형 PM / 수익 구조를 이해하는 서비스 기획"
    : workStyleArchetypes.includes("creator_expression")
      ? "결과물로 설득하는 표현형 커리어"
      : workStyleArchetypes.includes("specialist_researcher")
        ? "깊게 파고 증명하는 연구·자격형 커리어"
        : workStyleArchetypes.includes("independent_freelancer")
          ? "자기 기준과 결과물을 파는 독립형 커리어"
          : "책임과 기준을 정리하는 운영형 커리어";

  const tension = input.myeongli.missingElements.length > 0
    ? `다만 ${input.myeongli.missingElements
        .map((element) => elementLabels[element])
        .join("·")} 부족은 속도, 회복, 표현 장치를 의식적으로 보완해야 한다는 긴장을 만듭니다.`
    : "명리와 MBTI가 같은 방향을 가리킬 때는 실행 방식의 자신감이 올라갈 수 있습니다.";

  return {
    headline,
    plain:
      `명리는 자원과 구조, MBTI는 행동 스타일을 보여주는 보조 레이어입니다. ${input.myeongli.careerPlain} ${input.mbti.workStylePlain} ${tension}`,
    workStyleArchetypes,
    moneyStyleArchetypes,
    investmentStyleArchetypes,
    studyStyleArchetypes,
  };
}

function buildRecommendedJobs(input: {
  readonly labels: readonly string[];
  readonly fieldLabel?: string | null;
}): CareerReportEvidencePacket["recommendedJobs"] {
  if (
    includesAny(input.labels, ["재다신약", "편재", "정재"]) &&
    includesAny(input.labels, ["정관", "편관", "토 과다"])
  ) {
    return [
      {
        title: "서비스 기획자",
        fit: "high",
        reason: "요구사항, 일정, 비용, 성과 기준을 구조화하는 역할에서 강점이 살아납니다.",
        caution: "아이디어만 내고 권한 없는 책임을 떠안는 구조는 피해야 합니다.",
      },
      {
        title: "PM / PO",
        fit: "high",
        reason: "돈·자원·계약 감각과 조직 기준을 함께 다루는 일이 맞습니다.",
        caution: "결정권 없이 조율만 하는 자리는 소모가 커질 수 있습니다.",
      },
      {
        title: "프로젝트 매니저",
        fit: "high",
        reason: "일정, 역할, 예산, 리스크를 묶어 관리하는 힘이 필요합니다.",
        caution: "구두 지시와 모호한 범위는 기록으로 고정해야 합니다.",
      },
      {
        title: "사업개발",
        fit: "high",
        reason: "외부 기회, 계약, 수익화 접점을 현실 구조로 바꾸는 역할입니다.",
        caution: "조건이 불명확한 제휴나 돈거래는 불리해질 수 있습니다.",
      },
      {
        title: "전략기획",
        fit: "high",
        reason: "큰 방향을 숫자, 실행 구조, 운영 기준으로 바꾸는 일이 맞습니다.",
        caution: "현장 데이터 없이 추상 전략만 다루면 힘이 빠질 수 있습니다.",
      },
      {
        title: "운영기획",
        fit: "high",
        reason: "토 과다와 재성은 관리, 비용, 프로세스, 정산 구조에 강하게 반응합니다.",
        caution: "모든 잡무를 대신 떠안는 운영 담당자는 피해야 합니다.",
      },
      {
        title: "데이터 기반 기획",
        fit: "medium",
        reason: "감보다 숫자로 성과 기준을 잡을 때 설득력이 올라갑니다.",
        caution: "분석만 하고 제품 결정으로 연결하지 못하면 장점이 줄어듭니다.",
      },
      {
        title: "B2B 서비스 기획",
        fit: "high",
        reason: "계약, 정산, 고객 요구사항, 운영 안정성을 함께 다루는 분야입니다.",
        caution: "고객 요구를 모두 수용하는 구조는 손실을 키울 수 있습니다.",
      },
      {
        title: "핀테크/결제/정산 서비스 기획",
        fit: "high",
        reason: "돈의 흐름, 정산 기준, 리스크 통제가 직무 자체와 맞물립니다.",
        caution: "규정과 책임 범위를 정확히 확인해야 합니다.",
      },
      {
        title: "SaaS 운영/기획",
        fit: "medium",
        reason: "반복 운영, 지표, 고객 흐름, 비용 구조를 개선하는 일이 맞습니다.",
        caution: "반복 업무만 남고 개선 권한이 없는 자리는 피해야 합니다.",
      },
      {
        title: "커머스 운영기획",
        fit: "medium",
        reason: "상품, 비용, 정산, 고객 흐름을 현실적으로 관리하는 분야입니다.",
        caution: "매출 압박만 있고 기준 설계 권한이 없으면 소모됩니다.",
      },
      {
        title: "CRM/마케팅 오퍼레이션",
        fit: "medium",
        reason: "고객 데이터와 운영 루틴을 묶어 성과 기준을 만드는 일이 맞습니다.",
        caution: "감성 카피만 반복하는 마케팅은 장점이 덜 살아납니다.",
      },
      {
        title: "제품 운영 매니저",
        fit: "high",
        reason: "제품이 굴러가는 기준, 일정, 이슈, 성과를 끝까지 붙드는 역할입니다.",
        caution: "지원 조직처럼만 쓰이면 책임 대비 보상이 약해질 수 있습니다.",
      },
      {
        title: "정책/구조 설계형 기획",
        fit: "medium",
        reason: "UX 리서치 자체보다 정책, 권한, 비용, 운영 구조를 설계하는 쪽이 맞습니다.",
        caution: "사용자 감정 조사만 길게 하는 역할은 추진력이 약해질 수 있습니다.",
      },
      {
        title: "반복 단순 업무",
        fit: "low",
        reason: "구조를 바꾸거나 기준을 세울 여지가 적습니다.",
        caution: "성과 증명이 약해지고 답답함이 커질 수 있습니다.",
      },
    ];
  }

  if (includesAny(input.labels, ["식상", "식신", "상관"])) {
    return [
      {
        title: "콘텐츠 기획자",
        fit: "high",
        reason: "아이디어를 결과물과 공개 성과로 바꾸는 역할이 맞습니다.",
        caution: "마감과 수익 모델 없이 표현만 늘리면 소모됩니다.",
      },
      {
        title: "브랜드 콘텐츠 운영",
        fit: "high",
        reason: "표현, 반응, 판매 흐름을 함께 다루는 일이 강점입니다.",
        caution: "감정 반응에만 끌리면 비용 관리가 약해질 수 있습니다.",
      },
      {
        title: "교육 콘텐츠 사업",
        fit: "medium",
        reason: "지식을 상품화하고 반복 판매 구조를 만들 수 있습니다.",
        caution: "커리큘럼과 정산 기준을 먼저 잡아야 합니다.",
      },
      {
        title: "포트폴리오형 프리랜서",
        fit: "medium",
        reason: "보이는 결과물이 바로 영업 자산이 됩니다.",
        caution: "계약서 없이 움직이면 새는 돈이 커질 수 있습니다.",
      },
      {
        title: "반복 행정 업무",
        fit: "low",
        reason: "표현과 결과물의 장점이 잘 보이지 않습니다.",
        caution: "장기적으로 흥미가 빨리 떨어질 수 있습니다.",
      },
      {
        title: "퍼포먼스 마케팅",
        fit: "medium",
        reason: "표현과 숫자 반응을 함께 볼 수 있습니다.",
        caution: "단기 지표만 쫓으면 콘텐츠 완성도가 흔들립니다.",
      },
      {
        title: "커뮤니티 매니저",
        fit: "medium",
        reason: "사람의 반응과 콘텐츠 흐름을 연결할 수 있습니다.",
        caution: "감정 노동이 과해지면 회복 리듬이 무너질 수 있습니다.",
      },
      {
        title: "세일즈 콘텐츠 기획",
        fit: "high",
        reason: "말과 결과물을 매출 접점으로 연결하는 역할입니다.",
        caution: "성과 기준과 보상 구조를 명확히 해야 합니다.",
      },
    ];
  }

  if (includesAny(input.labels, ["인성", "편인", "정인"])) {
    return [
      {
        title: "데이터 분석가",
        fit: "high",
        reason: "자료를 모으고 구조화해 해석하는 힘이 살아납니다.",
        caution: "분석 결과를 실제 의사결정으로 연결해야 합니다.",
      },
      {
        title: "리서처",
        fit: "high",
        reason: "깊게 파고 문서화하는 방식이 맞습니다.",
        caution: "완성 전까지 공개를 미루면 기회가 늦어질 수 있습니다.",
      },
      {
        title: "자격 기반 전문직 준비",
        fit: "medium",
        reason: "시험, 커리큘럼, 문서형 실력 증명이 맞습니다.",
        caution: "공부만 길어지고 현장 경험이 부족해지지 않게 해야 합니다.",
      },
      {
        title: "기술 문서/매뉴얼 작성",
        fit: "medium",
        reason: "복잡한 지식을 정리해 전달하는 데 강점이 있습니다.",
        caution: "독자와 사용 장면을 놓치면 너무 이론적이 됩니다.",
      },
      {
        title: "즉흥 영업",
        fit: "low",
        reason: "깊은 준비 없이 빠르게 설득하는 방식은 부담이 큽니다.",
        caution: "즉흥성과 감정 압박이 커질 수 있습니다.",
      },
      {
        title: "정책 분석",
        fit: "medium",
        reason: "문서, 규정, 구조를 읽고 정리하는 데 맞습니다.",
        caution: "현실 실행과 연결해야 커리어 레버리지가 생깁니다.",
      },
      {
        title: "교육 설계",
        fit: "medium",
        reason: "지식을 커리큘럼으로 재구성하는 역할입니다.",
        caution: "수강자의 실제 결과물을 확인해야 합니다.",
      },
      {
        title: "품질 검수",
        fit: "medium",
        reason: "기준과 오류를 세밀하게 보는 힘을 쓸 수 있습니다.",
        caution: "검수만 반복하면 성장감이 약할 수 있습니다.",
      },
    ];
  }

  if (includesAny(input.labels, ["비겁", "비견", "겁재"])) {
    return [
      {
        title: "프리랜서 크리에이터",
        fit: "high",
        reason: "자기 기준과 결과물을 직접 시장에 내는 방식이 맞습니다.",
        caution: "가격, 범위, 수정 횟수를 정하지 않으면 손해가 커집니다.",
      },
      {
        title: "영상 편집자",
        fit: "high",
        reason: "손에 잡히는 결과물로 실력을 증명할 수 있습니다.",
        caution: "포트폴리오 없이 저가 작업만 반복하면 소모됩니다.",
      },
      {
        title: "1인 브랜드 운영",
        fit: "medium",
        reason: "자기 기준과 취향을 상품화할 여지가 있습니다.",
        caution: "협업 경계와 수익 구조를 명확히 해야 합니다.",
      },
      {
        title: "협업형 프로젝트",
        fit: "medium",
        reason: "동료와 경쟁이 자극이 될 수 있습니다.",
        caution: "돈과 역할을 섞으면 관계 피로가 커질 수 있습니다.",
      },
      {
        title: "강한 위계 조직의 단순 보조",
        fit: "low",
        reason: "자기 기준과 독립성이 눌릴 수 있습니다.",
        caution: "장기적으로 의욕이 떨어질 가능성이 큽니다.",
      },
      {
        title: "디자인/편집 운영",
        fit: "medium",
        reason: "취향과 반복 실무를 함께 쓸 수 있습니다.",
        caution: "기준 없는 수정 요청을 제한해야 합니다.",
      },
      {
        title: "커뮤니티 기반 판매",
        fit: "medium",
        reason: "관계와 자기 브랜드가 수익 접점이 될 수 있습니다.",
        caution: "친구 돈거래와 구두 약속은 피해야 합니다.",
      },
      {
        title: "포트폴리오형 취업",
        fit: "high",
        reason: "학벌보다 결과물과 실습 기록으로 설득할 수 있습니다.",
        caution: "마감과 제출 형식을 엄격히 관리해야 합니다.",
      },
    ];
  }

  return [
    {
      title: input.fieldLabel ?? "운영 실무",
      fit: "medium",
      reason: "현재 입력된 분야를 중심으로 구조화된 결과물을 만들 수 있습니다.",
      caution: "구체적인 산출물과 기준이 없으면 방향이 흐려질 수 있습니다.",
    },
    {
      title: "프로젝트 실무",
      fit: "medium",
      reason: "일정과 결과물을 붙들고 경험을 쌓기 좋습니다.",
      caution: "역할 범위를 문서로 확인해야 합니다.",
    },
    {
      title: "자격 기반 직무",
      fit: "medium",
      reason: "공부와 실무 증명을 연결할 수 있습니다.",
      caution: "자격증만 있고 포트폴리오가 없으면 약합니다.",
    },
    {
      title: "반복 단순 업무",
      fit: "low",
      reason: "성장 증거가 남기 어렵습니다.",
      caution: "장기적으로 커리어 설명력이 떨어질 수 있습니다.",
    },
    {
      title: "고객 운영",
      fit: "medium",
      reason: "사람과 프로세스를 함께 다루는 경험을 얻을 수 있습니다.",
      caution: "감정 노동이 과하면 회복 루틴을 먼저 잡아야 합니다.",
    },
    {
      title: "문서 기반 기획",
      fit: "medium",
      reason: "생각을 구조로 정리하는 힘을 키울 수 있습니다.",
      caution: "문서가 실행으로 이어져야 합니다.",
    },
    {
      title: "분석 보조",
      fit: "medium",
      reason: "데이터와 근거를 다루는 감각을 만들 수 있습니다.",
      caution: "분석 목표가 없으면 자료 정리에 머물 수 있습니다.",
    },
    {
      title: "현장 운영",
      fit: "medium",
      reason: "현실 문제를 바로 조정하는 경험이 됩니다.",
      caution: "몸과 일정 소모를 관리해야 합니다.",
    },
  ];
}

function buildCareerPaths(input: {
  readonly labels: readonly string[];
  readonly fieldLabel?: string | null;
}): CareerReportEvidencePacket["careerPaths"] {
  return [
    {
      label: "조직형 PM/기획 루트",
      fit: includesAny(input.labels, ["관성", "재성", "토 과다"]) ? "high" : "medium",
      plain:
        "조직 안에서 요구사항, 일정, 비용, 성과 기준을 정리하며 커리어 증거를 쌓는 길입니다.",
      examples: ["PM/PO", "서비스 기획", "운영기획", "전략기획"],
      risk: "권한 없이 책임만 커지는 구조는 피해야 합니다.",
    },
    {
      label: "외부 프로젝트·부업 루트",
      fit: includesAny(input.labels, ["편재", "식상"]) ? "high" : "medium",
      plain:
        "계약, 외부 프로젝트, 부업성 수익 접점을 만들 수 있지만 조건과 정산 기준이 먼저입니다.",
      examples: ["외주 기획", "콘텐츠 판매", "운영 컨설팅", "부업 프로젝트"],
      risk: "구두 약속과 애매한 돈거래가 손실을 만들 수 있습니다.",
    },
    {
      label: "전문성·자격 루트",
      fit: includesAny(input.labels, ["인성", "무인성"]) ? "medium" : "low",
      plain:
        "자격증, 문서화, 포트폴리오로 실력을 증명하는 길입니다.",
      examples: ["데이터 분석", "SQL", "재무·회계 기초", "PM 자격"],
      risk: "공부만 길어지고 실제 산출물이 없으면 약합니다.",
    },
  ];
}

function buildMoneyStrategies(
  labels: readonly string[],
): CareerReportEvidencePacket["moneyStrategies"] {
  return [
    {
      label: "계약·정산 기준 먼저 고정",
      fit: includesAny(labels, ["재성", "편재", "정재"]) ? "high" : "medium",
      plain:
        "돈은 크게 벌겠다는 감각보다 들어오고 나가는 조건을 먼저 고정할 때 안정성이 올라갑니다.",
      push: ["계약서", "정산일", "성과급 기준", "외부 프로젝트 조건"],
      avoid: ["구두 약속", "친구 돈거래", "조건 없는 협업", "감정적 소비"],
    },
    {
      label: "고정비와 현금흐름 관리",
      fit: includesAny(labels, ["토 과다", "정재"]) ? "high" : "medium",
      plain:
        "월급, 생활비, 구독, 관리비, 저축액을 분리하면 감정 소모가 줄어들 가능성이 큽니다.",
      push: ["월초 자동 분리", "고정비 점검", "현금흐름표", "비상금"],
      avoid: ["고정비 방치", "리뷰 없는 구독", "무리한 할부", "레버리지"],
    },
    {
      label: "부업성 수익 접점",
      fit: includesAny(labels, ["편재", "식상"]) ? "medium" : "low",
      plain:
        "외부 프로젝트, 인센티브, 부업성 수익화 가능성은 열릴 수 있지만 본업 기준을 흔들지 않는 범위가 중요합니다.",
      push: ["포트폴리오", "작은 유료 실험", "명확한 견적", "정산 기준"],
      avoid: ["공짜 노동", "즉흥 제안 수락", "범위 없는 외주", "무리한 확장"],
    },
  ];
}

function buildInvestmentProfile(
  labels: readonly string[],
): CareerReportEvidencePacket["investmentProfile"] {
  const preferred = buildInvestmentStyleArchetypes(labels);

  return {
    headline: "단기 투기보다 분산·적립·현금흐름 관리가 먼저입니다",
    preferred,
    plain:
      "이 구조는 감정으로 사고파는 단타보다 우량 자산을 매달 일정 금액으로 나누어 쌓고, 지수형 분산과 현금흐름 점검을 병행하는 쪽이 더 안정적으로 맞습니다. 편재가 강하게 작동하면 외부 프로젝트나 성과형 보상 접점은 늘어날 수 있지만, 레버리지와 몰빵은 불리해질 수 있습니다.",
    suitablePatterns: [
      "우량 자산 월 적립",
      "지수형 분산",
      "현금흐름 우선 관리",
      "투자 전 고정비 절감",
      "장기 적립형 포트폴리오",
    ],
    cautionPatterns: [
      "레버리지",
      "몰빵",
      "감정 단타",
      "구두 돈거래",
      "친구 돈거래",
      "확정 수익처럼 포장된 제안",
    ],
    disclaimer:
      "이 내용은 성향 기반 해석이며 금융 자문이 아닙니다. 실제 투자는 본인의 판단과 별도 검토가 필요합니다.",
  };
}

function buildStudyCertificateStrategy(input: {
  readonly labels: readonly string[];
  readonly fieldLabel?: string | null;
}): CareerReportEvidencePacket["studyCertificateStrategy"] {
  const isPlanningField = input.fieldLabel?.includes("기획") === true;
  const hasResource = includesAny(input.labels, ["인성", "편인", "정인"]);
  const hasExpression = includesAny(input.labels, ["식상", "식신", "상관"]);

  return {
    headline: hasResource
      ? "자격증과 문서형 실력 증명이 잘 맞습니다"
      : "공부는 결과물과 포트폴리오로 묶어야 힘이 납니다",
    plain:
      "학업은 오래 앉아 있는 시간보다 직무에서 설명 가능한 증거를 남기는 방식이 중요합니다. 시험이나 자격증은 일정과 오답 루틴으로 관리하고, 포트폴리오는 문제 정의, 실행 과정, 숫자 결과까지 남겨야 합니다.",
    recommendedFields: unique([
      isPlanningField ? "서비스 기획" : "현재 준비 분야",
      "데이터 분석",
      "SQL",
      "재무·회계 기초",
      "PM/PO 실무",
      hasResource ? "자격증형 커리큘럼" : "포트폴리오형 실습",
    ]),
    recommendedMethods: unique([
      "기출·오답 루틴",
      "주간 산출물",
      "포트폴리오 케이스 정리",
      hasExpression ? "발표와 피드백" : "문서화와 체크리스트",
      "실무 예제 반복",
    ]),
    avoidMethods: unique([
      "벼락치기",
      "요약만 읽고 끝내기",
      "결과물 없는 공부",
      "시험 일정 없는 장기 계획",
      "실무 연결 없는 자격증 수집",
    ]),
  };
}

function signal(
  type: CareerSignal["type"],
  strength: CareerSignal["strength"],
  title: string,
  plain: string,
): CareerSignal {
  return { type, strength, title, plain };
}

function buildWorkRiskWarnings(
  labels: readonly string[],
): readonly CareerSignal[] {
  return [
    includesAny(labels, ["토 과다", "재다신약"])
      ? signal(
          "career_risk",
          "high",
          "권한 없는 책임",
          "책임, 비용, 일정이 내 쪽으로 모이기 쉬우므로 역할 범위를 문서로 고정해야 합니다.",
        )
      : undefined,
    includesAny(labels, ["무식상", "화 부족"])
      ? signal(
          "career_risk",
          "medium",
          "성과 노출 부족",
          "실력이 있어도 밖으로 보이는 산출물이 부족하면 평가에서 손해를 볼 수 있습니다.",
        )
      : undefined,
    includesAny(labels, ["수 부족"])
      ? signal(
          "study_risk",
          "medium",
          "회복 루틴 부족",
          "정보와 감정 흐름이 막히면 과열되기 쉬우므로 휴식과 정리 시간을 일정처럼 잡아야 합니다.",
        )
      : undefined,
  ].filter((item): item is CareerSignal => item !== undefined);
}

function buildOpportunitySignals(
  labels: readonly string[],
): readonly CareerSignal[] {
  return [
    includesAny(labels, ["편재", "재성"])
      ? signal(
          "money_opportunity",
          "high",
          "외부 프로젝트 접점",
          "계약, 부업성 수익, 인센티브처럼 돈이 움직이는 접점이 늘어날 수 있습니다.",
        )
      : undefined,
    includesAny(labels, ["관성", "정관", "편관"])
      ? signal(
          "career_fit",
          "high",
          "역할 검증",
          "조직 안에서 책임과 평가 기준을 공식화할 때 성과를 볼 가능성이 커집니다.",
        )
      : undefined,
    includesAny(labels, ["식상", "식신", "상관", "무식상"])
      ? signal(
          "study_fit",
          "medium",
          "포트폴리오 증명",
          "공부와 실무를 결과물로 꺼내면 면접과 평가에서 설명력이 올라갑니다.",
        )
      : undefined,
  ].filter((item): item is CareerSignal => item !== undefined);
}

function buildTimingHints(input: {
  readonly dayMaster: HeavenlyStem;
  readonly labels: readonly string[];
}): readonly CareerSignal[] {
  const years = [2026, 2027, 2028, 2029, 2030];

  return years.map((year) => {
    const ganji = getAnnualGanjiInfo(year);
    const tenGod = getTenGodForStemPair(input.dayMaster, ganji.stem);

    if (year === 2026) {
      return signal(
        "timing_hint",
        "medium",
        "2026 새 기준과 산출물",
        `${year}년 ${ganji.ganji}은 ${tenGod} 흐름으로 새 역할의 기준과 첫 산출물을 잡기 쉬운 시기입니다.`,
      );
    }
    if (year === 2027) {
      return signal(
        "timing_hint",
        "medium",
        "2027 결과물·표현 압박",
        `${year}년 ${ganji.ganji}은 ${tenGod} 흐름으로 발표, 제안서, 결과물이 빨라질 수 있습니다.`,
      );
    }
    if (year === 2028) {
      return signal(
        "timing_hint",
        "high",
        "2028 외부 프로젝트·수익화",
        `${year}년 ${ganji.ganji}은 ${tenGod} 흐름이 강해 외부 프로젝트, 계약, 수익화 접점을 검토하기 쉬운 흐름입니다.`,
      );
    }
    if (year === 2029) {
      return signal(
        "timing_hint",
        "medium",
        "2029 정산·고정비·현금흐름",
        `${year}년 ${ganji.ganji}은 ${tenGod} 흐름으로 돈을 감보다 숫자로 고정하기 좋은 시기입니다.`,
      );
    }

    return signal(
      "timing_hint",
      "medium",
      "2030 구조 재배치",
      `${year}년 ${ganji.ganji}은 ${tenGod} 흐름으로 역할 경계, 직무 전환, 계약 조건을 다시 검토하기 쉬운 흐름입니다.`,
    );
  });
}

function buildSafetyNotes(): readonly string[] {
  return [
    "이 리포트는 직업·돈·학업 성향과 가능성을 해석한 것이며, 특정 결과를 보장하지 않습니다.",
    "투자 관련 문장은 성향 기반 해석이며 금융 자문이나 매수·매도 지시가 아닙니다.",
    "이직·승진·창업·합격 같은 결과는 개인 선택과 환경에 따라 달라질 수 있습니다.",
  ];
}

function buildCareerMyeongliSignals(input: {
  readonly dayMaster: HeavenlyStem;
  readonly labels: readonly string[];
  readonly myeongliCareerBasis: CareerReportEvidencePacket["myeongliCareerBasis"];
}): readonly MyeongliSignal[] {
  const signals: MyeongliSignal[] = [];
  const seen = new Set<string>();
  const basisEvidence = [
    input.myeongliCareerBasis.careerPlain,
    input.myeongliCareerBasis.moneyPlain,
    input.myeongliCareerBasis.studyPlain,
  ]
    .filter((plain) => plain.length > 0)
    .join(" ");
  const pushSignal = (signal: MyeongliSignal) => {
    const key = `${signal.kind}:${signal.label}:${signal.value ?? ""}`;

    if (!seen.has(key)) {
      seen.add(key);
      signals.push(signal);
    }
  };

  pushSignal({
    kind: "pillar",
    label: `${input.dayMaster}일간`,
    value: input.dayMaster,
    evidence: input.myeongliCareerBasis.dayMasterPlain,
  });

  for (const element of [
    ...input.myeongliCareerBasis.dominantElements,
    ...input.myeongliCareerBasis.heavyElements,
    ...input.myeongliCareerBasis.missingElements,
  ]) {
    pushSignal({
      kind: "element",
      label: elementLabels[element],
      value: element,
      evidence: basisEvidence,
    });
  }

  for (const tenGod of input.myeongliCareerBasis.tenGodFocus) {
    pushSignal({
      kind: "tenGod",
      label: tenGod,
      value: tenGod,
      evidence: basisEvidence,
    });
  }

  for (const group of tenGodGroupSignals) {
    if (includesAny(input.labels, group.targets)) {
      pushSignal({
        kind: "tenGod",
        label: group.label,
        value: group.label,
        evidence: basisEvidence,
      });
    }
  }

  for (const label of input.labels) {
    if (label.includes("귀인") || label === "금여록") {
      pushSignal({
        kind: "gwiin",
        label,
        value: label,
        evidence: label,
      });
      continue;
    }

    if (label.includes("살") || label === "공망") {
      pushSignal({
        kind: "shinsal",
        label,
        value: label,
        evidence: label,
      });
      continue;
    }

    if (
      label.includes("합") ||
      label.includes("충") ||
      label.includes("형") ||
      label.includes("파") ||
      label.includes("해")
    ) {
      pushSignal({
        kind: "interaction",
        label,
        value: label,
        evidence: label,
      });
    }
  }

  return signals;
}

function buildCareerBridgeEvidence(input: {
  readonly mbtiType: string | null | undefined;
  readonly dayMaster: HeavenlyStem;
  readonly labels: readonly string[];
  readonly myeongliCareerBasis: CareerReportEvidencePacket["myeongliCareerBasis"];
}): CareerReportEvidencePacket["bridgeEvidence"] {
  const bridgePacket = buildMyeongliMbtiBridgePacket({
    mbtiType: input.mbtiType,
    productContext: "careerMoneyStudy",
    myeongliSignals: buildCareerMyeongliSignals({
      dayMaster: input.dayMaster,
      labels: input.labels,
      myeongliCareerBasis: input.myeongliCareerBasis,
    }),
  });

  return buildProductBridgeEvidence(bridgePacket, "careerMoneyStudy");
}

function buildCareerSajuCalcInput(
  person: CareerReportFixturePerson,
): SajuCalcInput | null {
  if (person.birthDate === undefined) {
    return null;
  }

  const birthTime = person.birthTime?.trim();

  return {
    birthDate: person.birthDate,
    ...(birthTime === undefined || birthTime.length === 0
      ? {}
      : { birthTime }),
    birthTimeUnknown: birthTime === undefined || birthTime.length === 0,
    calendarType: "SOLAR",
    gender: toSajuGender(person.gender),
    timezone: "Asia/Seoul",
  };
}

function toSajuGender(gender: string | undefined): SajuGender {
  if (gender === "male") {
    return "MALE";
  }

  if (gender === "female") {
    return "FEMALE";
  }

  return "OTHER_OR_UNSPECIFIED";
}

function buildCareerManseRyeokPillars(
  person: CareerReportFixturePerson,
): readonly CareerReportManseRyeokPillarDetail[] {
  const sajuInput = buildCareerSajuCalcInput(person);

  if (sajuInput === null) {
    return [];
  }

  try {
    return buildCareerManseRyeokPillarsFromSaju(calculateSaju(sajuInput));
  } catch {
    return [];
  }
}

function buildCareerManseRyeokPillarsFromSaju(
  result: SajuCalcResult,
): readonly CareerReportManseRyeokPillarDetail[] {
  return careerPillarKeys
    .map((columnId) => {
      const pillar = result.pillars[columnId];

      if (pillar === undefined) {
        return null;
      }

      return buildCareerManseRyeokPillarDetail({
        columnId,
        pillar,
        result,
      });
    })
    .filter(
      (detail): detail is CareerReportManseRyeokPillarDetail =>
        detail !== null,
    );
}

function buildCareerManseRyeokPillarDetail(input: {
  readonly columnId: CareerReportPillarKey;
  readonly pillar: SajuPillar;
  readonly result: SajuCalcResult;
}): CareerReportManseRyeokPillarDetail {
  return {
    columnId: input.columnId,
    pillar: `${input.pillar.stem}${input.pillar.branch}`,
    heavenlyStem: input.pillar.stem,
    earthlyBranch: input.pillar.branch,
    tenGod: buildPillarTenGodLabels(input),
    hiddenStems: buildHiddenStemLabels(input),
    twelveLifeStage: [
      twelveLifeStageByDayStem[input.result.dayMaster][input.pillar.branch],
    ],
    twelveSinsal: buildShinsalLabels(input, "twelve"),
    sinsal: buildShinsalLabels(input, "sinsal"),
    gwiin: buildShinsalLabels(input, "gwiin"),
    interactions: buildPillarInteractionLabels({
      position: input.columnId,
      result: input.result,
    }),
  };
}

function buildPillarTenGodLabels(input: {
  readonly columnId: CareerReportPillarKey;
  readonly pillar: SajuPillar;
  readonly result: SajuCalcResult;
}): readonly string[] {
  const stemTenGod =
    input.columnId === "day"
      ? "비견"
      : toKoreanTenGod(input.result.tenGods.stems[input.columnId]);
  const branchTenGod = getMainHiddenStemTenGod(input);

  return uniqueValues([stemTenGod, branchTenGod]);
}

function getMainHiddenStemTenGod(input: {
  readonly pillar: SajuPillar;
  readonly result: SajuCalcResult;
}): TenGod | null {
  const mainEntry = input.result.tenGods.hiddenStems
    .filter((entry) => entry.branch === input.pillar.branch)
    .sort((first, second) => second.weight - first.weight)[0];

  return toKoreanTenGod(mainEntry?.tenGod);
}

function buildHiddenStemLabels(input: {
  readonly pillar: SajuPillar;
  readonly result: SajuCalcResult;
}): readonly string[] {
  return uniqueValues(
    input.result.tenGods.hiddenStems
      .filter((entry) => entry.branch === input.pillar.branch)
      .map((entry) =>
        [entry.stem, toKoreanTenGod(entry.tenGod)].filter(Boolean).join(" "),
      ),
  );
}

function buildShinsalLabels(
  input: {
    readonly columnId: CareerReportPillarKey;
    readonly result: SajuCalcResult;
  },
  target: "twelve" | "sinsal" | "gwiin",
): readonly string[] {
  return uniqueValues(
    input.result.shinsal
      .filter((item) => item.positions.includes(input.columnId))
      .filter((item) => {
        if (target === "twelve") {
          return item.category === "TWELVE_SHINSAL";
        }

        if (target === "gwiin") {
          return item.category === "NOBLE_HELP";
        }

        return (
          item.category !== "TWELVE_SHINSAL" &&
          item.category !== "NOBLE_HELP"
        );
      })
      .map((item) => item.labelKo),
  );
}

function buildPillarInteractionLabels(input: {
  readonly position: CareerReportPillarKey;
  readonly result: SajuCalcResult;
}): readonly string[] {
  return uniqueValues([
    ...input.result.relations.stemCombinations
      .filter((relation) => relationIncludesPosition(relation, input.position))
      .map((relation) => formatRelationLabel(relation, "천간합")),
    ...input.result.relations.branchCombinations
      .filter((relation) => relationIncludesPosition(relation, input.position))
      .map((relation) => formatRelationLabel(relation, "지지합")),
    ...input.result.relations.branchClashes
      .filter((relation) => relationIncludesPosition(relation, input.position))
      .map((relation) => formatRelationLabel(relation, "지지충")),
  ]);
}

function relationIncludesPosition(
  relation: string,
  position: CareerReportPillarKey,
): boolean {
  const [positions] = relation.split(":");

  return positions?.split("-").includes(position) ?? false;
}

function formatRelationLabel(relation: string, label: string): string {
  const [positions = "", pair = ""] = relation.split(":");
  const positionLabel = positions
    .split("-")
    .map((position) => pillarPositionLabels[position as CareerReportPillarKey])
    .filter(Boolean)
    .join("");

  return [positionLabel, label, pair].filter(Boolean).join(" ");
}

function toKoreanTenGod(tenGod: SajuTenGod | undefined): TenGod | null {
  return tenGod === undefined ? null : sajuTenGodLabels[tenGod];
}

function uniqueValues(values: readonly (string | null | undefined)[]): readonly string[] {
  return [...new Set(values.filter((value): value is string => Boolean(value)))];
}

function collectMyeongliTableSignalText(
  pillars: readonly CareerReportManseRyeokPillarDetail[],
): readonly string[] {
  return uniqueValues(
    pillars.flatMap((pillar) => [
      ...pillar.tenGod,
      ...pillar.hiddenStems,
      ...pillar.twelveLifeStage,
      ...pillar.twelveSinsal,
      ...pillar.sinsal,
      ...pillar.gwiin,
      ...pillar.interactions,
    ]),
  );
}

function hasMyeongliSignal(
  signals: readonly string[],
  targets: readonly string[],
): boolean {
  return targets.some((target) =>
    signals.some((signal) => signal.includes(target)),
  );
}

function presentMyeongliSignals(
  signals: readonly string[],
  targets: readonly string[],
): readonly string[] {
  return targets.filter((target) => hasMyeongliSignal(signals, [target]));
}

function joinSignalTerms(terms: readonly string[]): string {
  return terms.join("·");
}

function buildMyeongliSignalInterpretations(
  pillars: readonly CareerReportManseRyeokPillarDetail[],
): CareerReportEvidencePacket["myeongliSignalInterpretations"] {
  const signals = collectMyeongliTableSignalText(pillars);
  const interpretations: CareerReportMyeongliSignalInterpretation[] = [];
  const wealthTerms = presentMyeongliSignals(signals, ["편재", "정재"]);
  const officerTerms = presentMyeongliSignals(signals, ["정관", "편관"]);
  const nobleTerms = presentMyeongliSignals(signals, [
    "천을귀인",
    "월덕귀인",
    "천덕귀인",
  ]);

  if (wealthTerms.length > 0) {
    interpretations.push({
      label: joinSignalTerms(wealthTerms),
      basis: `${joinSignalTerms(wealthTerms)}가 만세력표에 보입니다.`,
      interpretation:
        "돈을 감으로 쓰기보다 계약, 정산, 고정비, 수익 구조, 자원 배치로 다룰 때 강점이 살아납니다.",
    });
  }

  if (officerTerms.length > 0) {
    interpretations.push({
      label: joinSignalTerms(officerTerms),
      basis: `${joinSignalTerms(officerTerms)}이 만세력표에 보입니다.`,
      interpretation:
        "조직, 책임, 평가, 기준이 있는 환경에서 역할이 커집니다. 다만 책임이 한쪽으로 몰리면 압박도 같이 커집니다.",
    });
  }

  if (hasMyeongliSignal(signals, ["현침살"])) {
    interpretations.push({
      label: "현침살",
      basis: "현침살이 만세력표에 보입니다.",
      interpretation:
        "판단과 말이 날카롭게 나오는 신호입니다. 직업에서는 분석력과 빠른 문제 지적이 되지만, 피드백이 차갑게 들리지 않게 기준과 표현을 분리해야 합니다.",
    });
  }

  if (nobleTerms.length > 0) {
    interpretations.push({
      label: joinSignalTerms(nobleTerms),
      basis: `${joinSignalTerms(nobleTerms)}이 만세력표에 보입니다.`,
      interpretation:
        "혼자 밀어붙이는 구조보다 좋은 상사, 멘토, 협업자, 완충 장치가 있을 때 일이 부드럽게 풀리는 근거로 씁니다.",
    });
  }

  if (hasMyeongliSignal(signals, ["화개"])) {
    interpretations.push({
      label: "화개",
      basis: "화개가 만세력표에 보입니다.",
      interpretation:
        "혼자 파고드는 몰입, 전문성, 문서형 공부와 연결됩니다. 공부와 자격증은 결과물을 포트폴리오로 남길 때 힘이 납니다.",
    });
  }

  if (hasMyeongliSignal(signals, ["천간합", "지지합", "지지충"])) {
    interpretations.push({
      label: "합충형파해",
      basis: signals
        .filter((signal) =>
          ["천간합", "지지합", "지지충"].some((target) =>
            signal.includes(target),
          ),
        )
        .join(" · "),
      interpretation:
        "관계와 환경을 그냥 밀어붙이기보다 조율해야 하는 지점입니다. 직장에서는 권한, 책임, 보고 라인을 먼저 맞추는 쪽이 안정적입니다.",
    });
  }

  return interpretations.slice(0, 6);
}

export function buildCareerReportEvidence(
  input: BuildCareerReportEvidenceInput,
): CareerReportEvidencePacket {
  const dayMaster = parseDayMaster(input.person.pillars.day);
  const myeongliCareerBasis = buildMyeongliCareerBasis({
    dayMaster,
    labels: input.person.labels,
  });
  const mbtiCareerBasis = buildMbtiCareerBasis(input.person.mbti);
  const combinedCareerProfile = buildCombinedCareerProfile({
    myeongli: myeongliCareerBasis,
    mbti: mbtiCareerBasis,
    fieldLabel: input.person.userContext.fieldLabel,
    lifeStatus: input.person.userContext.lifeStatus,
    labels: input.person.labels,
  });
  const recommendedJobs = buildRecommendedJobs({
    labels: input.person.labels,
    fieldLabel: input.person.userContext.fieldLabel,
  });
  const careerPaths = buildCareerPaths({
    labels: input.person.labels,
    fieldLabel: input.person.userContext.fieldLabel,
  });
  const moneyStrategies = buildMoneyStrategies(input.person.labels);
  const investmentProfile = buildInvestmentProfile(input.person.labels);
  const studyCertificateStrategy = buildStudyCertificateStrategy({
    labels: input.person.labels,
    fieldLabel: input.person.userContext.fieldLabel,
  });
  const workRiskWarnings = buildWorkRiskWarnings(input.person.labels);
  const opportunitySignals = buildOpportunitySignals(input.person.labels);
  const timingHints = buildTimingHints({
    dayMaster,
    labels: input.person.labels,
  });
  const bridgeEvidence = buildCareerBridgeEvidence({
    mbtiType: input.person.mbti,
    dayMaster,
    labels: input.person.labels,
    myeongliCareerBasis,
  });
  const manseRyeokPillars = buildCareerManseRyeokPillars(input.person);

  return {
    productType: "career_money_study",
    productVersion: "v1",
    personLabel: input.person.label,
    userContext: input.person.userContext,
    dayMaster,
    userPillars: input.person.pillars,
    manseRyeokPillars,
    myeongliSignalInterpretations:
      buildMyeongliSignalInterpretations(manseRyeokPillars),
    natalLabels: input.person.labels,
    mbtiType: normalizeMbtiType(input.person.mbti),
    myeongliCareerBasis,
    mbtiCareerBasis,
    combinedCareerProfile,
    recommendedJobs,
    careerPaths,
    moneyStrategies,
    investmentProfile,
    studyCertificateStrategy,
    workRiskWarnings,
    opportunitySignals,
    timingHints,
    bridgeEvidence,
    safetyNotes: buildSafetyNotes(),
  };
}

function countPatternInText(
  packets: readonly CareerReportEvidencePacket[],
  patterns: readonly string[],
): number {
  const text = packets.map(serializeQualityCheckedPacket).join("\n");

  return patterns.some((pattern) => text.includes(pattern)) ? 1 : 0;
}

function hasStockTicker(packets: readonly CareerReportEvidencePacket[]): boolean {
  return stockTickerPattern.test(packets.map(serializeQualityCheckedPacket).join("\n"));
}

function serializeQualityCheckedPacket(packet: CareerReportEvidencePacket): string {
  return JSON.stringify(packet, (key, value: unknown) =>
    key === "bridgeEvidence" ? undefined : value,
  );
}

export function summarizeCareerReportEvidenceMatrixQuality(
  packets: readonly CareerReportEvidencePacket[],
): CareerMatrixQualitySummary {
  const jobSignatures = packets.map((packet) =>
    packet.recommendedJobs
      .slice(0, 5)
      .map((job) => job.title)
      .join("|"),
  );
  const sameJobsAcrossAllFixturesWarnings =
    new Set(jobSignatures).size <= 1 && packets.length > 1 ? 1 : 0;
  const deokminLeakageWarnings = packets
    .filter((packet) => packet.personLabel !== "덕민")
    .some((packet) =>
      serializeQualityCheckedPacket(packet).includes("덕민") ||
      serializeQualityCheckedPacket(packet).includes("개발·서비스 기획"),
    )
    ? 1
    : 0;

  return {
    sameJobsAcrossAllFixturesWarnings,
    specificStockTickerWarnings: hasStockTicker(packets) ? 1 : 0,
    guaranteedReturnWarnings: countPatternInText(
      packets,
      guaranteedReturnPatterns,
    ),
    hardDeterministicClaimWarnings: countPatternInText(
      packets,
      hardClaimPatterns,
    ),
    deokminLeakageWarnings,
  };
}
