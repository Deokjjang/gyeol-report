import { careerSignalMatches, selectCareerMbti, selectCareerRoles, selectCareerJobs, selectCareerAvoid, traitText, type CareerMbtiSelection } from "./careerEvidenceSelection";
import { contextualTenGodReading, selectReportActivity } from "./reportContextScenes";
import type {
  EarthlyBranch,
  FiveElement,
  HeavenlyStem,
  TenGod,
} from "./annualFortuneTypes";
import {
  getAnnualGanjiInfo,
  getAnnualFortuneCurrentYear,
  getAnnualBranchInteractions,
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
  readonly calculatedSaju?: SajuCalcResult;
  readonly referenceDate?: Date;
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
  return targets.some((target) => careerSignalMatches(labels, target));
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
    careerSignalMatches(labels, tenGod),
  );
  return direct;
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
  return selectCareerMbti(type, []).profile?.type ?? null;
}

function buildMbtiCareerBasis(mbti: CareerMbtiSelection): MbtiCareerProfile {
  if (!mbti.profile) return {
    type: null, workStylePlain: "MBTI는 입력하지 않아 행동 유형을 추정하지 않습니다.",
    strengthPlain: "원국에서 확인된 역할과 환경을 중심으로 비교합니다.",
    riskPlain: "실제 업무 경험을 함께 확인해 적합도를 판단하세요.",
    moneyBehaviorPlain: "유형별 소비 성향 대신 자신의 지출 기록을 기준으로 점검하세요.",
    studyPlain: "학습 방식은 원국 근거와 실제 학습 경험을 함께 살펴봅니다.",
  };
  return {
    type: mbti.profile.type,
    workStylePlain: `${mbti.profile.type}: ${traitText(mbti.career, "plainKo").slice(0, 2).join(" ")} ${traitText(mbti.workplace, "plainKo")[0] ?? ""}`,
    strengthPlain: traitText(mbti.career, "positiveUse").join(" "),
    riskPlain: traitText(mbti.workplace, "risk").join(" "),
    moneyBehaviorPlain: traitText(mbti.money, "plainKo").join(" "),
    studyPlain: traitText(mbti.study, "plainKo").join(" "),
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

function buildInvestmentStyleArchetypes(labels: readonly string[]): readonly InvestmentStyleArchetype[] {
  return includesAny(labels, ["편재"])
    ? ["cashflow_first", "active_trading_caution", "avoid_leverage"]
    : ["cashflow_first", "long_term_accumulation", "avoid_leverage"];
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
  const headline = workStyleArchetypes.includes("creator_expression")
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
      `명리는 자원과 구조, MBTI는 행동 스타일을 보여주는 보조 레이어입니다. ${input.mbti.strengthPlain} ${tension} 선호하는 작업 방식과 실제 맡게 될 책임을 함께 비교하세요.`,
    workStyleArchetypes,
    moneyStyleArchetypes,
    investmentStyleArchetypes,
    studyStyleArchetypes,
  };
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

function buildInvestmentProfile(labels: readonly string[], mbti: CareerMbtiSelection): CareerReportEvidencePacket["investmentProfile"] {
  const wealth = includesAny(labels, ["정재", "편재"]);
  return {
    headline: "결정 속도와 손실 대응 기준을 분리합니다",
    preferred: buildInvestmentStyleArchetypes(labels),
    plain: `${traitText(mbti.investment, "plainKo").join(" ") || "투자 성향을 유형으로 추정하지 않고 실제 의사결정 기록을 살펴봅니다."} ${wealth ? "재성 신호는 자원의 대가를 비교하는 관점이며 실제 투자 능력을 뜻하지 않습니다." : "원국만으로 투자 능력이나 감당할 수 있는 손실을 판단하지 않습니다."}`,
    suitablePatterns: ["결정 이유와 재검토 조건을 함께 기록", "생활에 필요한 자금과 위험 한도 분리", "손실 때도 유지할 판단 기준 사전 설정"],
    cautionPatterns: [...traitText(mbti.investment, "risk"), "손실을 만회하려고 한도를 늘리는 결정", "검증되지 않은 고수익 제안"],
    disclaimer: "이 내용은 성향 기반 해석이며 금융 자문이 아닙니다. 실제 투자는 본인의 판단과 별도 검토가 필요합니다.",
  };
}

function buildStudyCertificateStrategy(input: {
  readonly labels: readonly string[]; readonly fieldLabel?: string | null;
  readonly mbti: CareerMbtiSelection;
}): CareerReportEvidencePacket["studyCertificateStrategy"] {
  const resource = includesAny(input.labels, ["인성", "편인", "정인"]);
  const expression = includesAny(input.labels, ["식상", "식신", "상관"]);
  const precise = includesAny(input.labels, ["현침", "문창"]);
  const angle = resource ? "인성 신호는 개념과 자료를 쌓는 학습으로 읽습니다. 이해한 내용을 기준표로 정리하고 시험에서는 적용 문제로 검증하세요."
    : expression ? "식상 신호는 배운 내용을 설명하거나 제작하는 학습으로 읽습니다. 짧은 발표나 포트폴리오에서 이해의 빈틈을 확인하세요."
    : "원국만으로 학습 능력을 단정하지 않습니다. 읽기와 직접 풀기를 비교해 실제로 남는 방식을 고르세요.";
  return {
    headline: input.mbti.study[0]?.label ?? (resource ? "개념을 적용 문제로 연결하는 공부" : "작은 결과물로 확인하는 공부"),
    plain: `${angle} ${traitText(input.mbti.study, "plainKo").join(" ")}${precise ? ` ${["문창", "현침"].filter((label) => includesAny(input.labels, [label])).join("·")} 신호는 문장이나 풀이의 세부를 검토하는 방식과 연결해 볼 수 있습니다.` : ""}`,
    recommendedFields: [input.fieldLabel || "관심 직무의 기초 과목", resource ? "개념·사례 비교" : "실습형 과제", expression ? "발표·제작 과제" : "적용 문제 풀이"],
    recommendedMethods: [...traitText(input.mbti.study, "positiveUse"), resource ? "이론별 적용 사례 대조" : "작은 과제 완성 후 피드백", expression ? "배운 내용을 다른 사람에게 설명" : "틀린 판단의 근거를 다시 확인", precise ? "풀이와 문서의 세부 검토" : "실제 학습 결과로 계획 조정"],
    avoidMethods: [...traitText(input.mbti.study, "risk"), "시험 요건 확인 없는 자격증 수집", "검증 없이 익숙한 풀이만 반복", "휴식 없이 학습 시간만 늘리기"],
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
  readonly dayMaster: HeavenlyStem; readonly pillars: CareerReportFixturePerson["pillars"];
  readonly referenceDate?: Date;
}): readonly CareerSignal[] {
  // Preserve the existing five-row career horizon; annual commerce has a separate policy.
  const currentYear = getAnnualFortuneCurrentYear(input.referenceDate);
  const angles: Record<TenGod, { title: string; plain: string; push: readonly string[]; avoid: readonly string[] }> = {
    비견: { title: "자기 기준과 협업 범위", plain: "동료와 역할이 겹칠 때 기여 범위를 설명하는 쪽을 점검하세요.", push: ["기여 범위 합의", "협업 분담 확인", "자기 성과 기록"], avoid: ["기준 없는 경쟁", "기여 혼동", "일방적 역할 확대"] },
    겁재: { title: "공동 자원과 배분 기준", plain: "함께 쓰는 비용과 성과의 배분 기준을 먼저 점검하세요.", push: ["공동 비용 기록", "보상 기준 확인", "협업 한도 설정"], avoid: ["모호한 공동 지출", "비교에 따른 지출", "구두 배분 약속"] },
    식신: { title: "꾸준히 완성하는 결과물", plain: "익힌 기술을 실제 결과물로 이어가는 과정을 점검하세요.", push: ["완성한 작업 축적", "제작 과정 개선", "사용자 피드백"], avoid: ["완성 없는 반복", "품질 기준 생략", "과정만 설명하기"] },
    상관: { title: "제안과 표현의 전달 방식", plain: "개선 제안을 상대가 검토할 수 있는 근거로 바꾸는 쪽을 점검하세요.", push: ["제안 근거 정리", "발표와 피드백", "개선안 실험"], avoid: ["근거 없는 비판", "합의 없는 변경", "전달 방식 생략"] },
    편재: { title: "외부 접점과 거래 조건", plain: "새 접점은 수익 예고가 아닙니다. 제안의 범위와 회수 조건을 점검하세요.", push: ["제안 범위 비교", "거래 조건 확인", "투입 한도 설정"], avoid: ["매출만 보는 계약", "회수 조건 생략", "기회 과대평가"] },
    정재: { title: "지속 수입과 비용의 균형", plain: "확정된 대가와 반복 비용을 분리해 유지 가능한 업무량을 점검하세요.", push: ["반복 비용 확인", "정산 일정 기록", "업무량과 대가 비교"], avoid: ["비용 누락", "정산 미루기", "과도한 고정 지출"] },
    편관: { title: "부담과 대응 권한", plain: "압박을 성과로 단정하지 않고 부담에 대응할 권한이 있는지 점검하세요.", push: ["대응 권한 확인", "업무 우선순위", "지원 요청 기준"], avoid: ["혼자 감당하기", "한도 없는 책임", "긴급 업무 상시화"] },
    정관: { title: "역할과 평가 기준", plain: "승진을 예고하기보다 평가 기준과 실제 역할의 일치를 점검하세요.", push: ["평가 기준 확인", "역할 명문화", "책임 범위 조율"], avoid: ["직함만 따르기", "모호한 승인선", "평가 기준 오해"] },
    편인: { title: "새 관점의 검증", plain: "다른 방법을 탐구하되 실제 과제에 적용해 유효성을 점검하세요.", push: ["대안 비교", "작은 적용 실험", "학습 근거 확인"], avoid: ["검증 없는 해석", "준비만 반복", "피드백 단절"] },
    정인: { title: "기초 지식과 지원 활용", plain: "문서와 학습 자원을 실제 업무 판단에 연결하는 쪽을 점검하세요.", push: ["기초 개념 정리", "검토자 피드백", "문서와 사례 대조"], avoid: ["자료만 수집", "권위만 신뢰", "적용 없는 암기"] },
  };
  const natalBranches = [input.pillars.year, input.pillars.month, input.pillars.day, input.pillars.hour]
    .filter((p): p is string => typeof p === "string" && /^[甲乙丙丁戊己庚辛壬癸][子丑寅卯辰巳午未申酉戌亥]$/u.test(p))
    .map((p) => p[1] as EarthlyBranch);
  return Array.from({ length: 5 }, (_, i) => {
    const year = currentYear + i;
    const ganji = getAnnualGanjiInfo(year);
    const tenGod = getTenGodForStemPair(input.dayMaster, ganji.stem);
    const angle = angles[tenGod];
    const interactions = getAnnualBranchInteractions({ annualBranch: ganji.branch, natalBranches })
      .map((r) => `${r.branches.join("·")} ${r.type}`);
    return { type: "timing_hint", strength: "medium", title: `${year} ${angle.title}`,
      plain: `${year}년 ${ganji.ganji}의 천간 ${ganji.stem}은 ${input.dayMaster} 일간에 ${tenGod}입니다. ${angle.plain}${interactions.length ? ` 원국 지지와의 ${interactions.join(", ")}도 함께 살펴보되, 사건이나 성과를 확정하는 근거로 보지 않습니다.` : " 원국 지지와의 주요 합충형파해가 확인되지 않아 특정 사건을 덧붙이지 않습니다."}`,
      evidenceIds: [`annual:${year}:${ganji.ganji}`, `day-master:${input.dayMaster}`],
      yearBasis: { year, ganji: ganji.ganji, tenGod, interactions, push: angle.push, avoid: angle.avoid } };
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
  const mbti = selectCareerMbti(input.person.mbti, input.person.labels);
  const mbtiCareerBasis = buildMbtiCareerBasis(mbti);
  const roles = selectCareerRoles(input.person.labels);
  const combinedCareerProfile = buildCombinedCareerProfile({
    myeongli: myeongliCareerBasis,
    mbti: mbtiCareerBasis,
    fieldLabel: input.person.userContext.fieldLabel,
    lifeStatus: input.person.userContext.lifeStatus,
    labels: input.person.labels,
  });
  const activity = selectReportActivity(input.person.userContext);
  const contextGod = myeongliCareerBasis.tenGodFocus[0];
  const recommendedJobs = selectCareerJobs(input.person.labels, mbti, roles, input.person.userContext);
  const careerPaths = buildCareerPaths({
    labels: input.person.labels,
    fieldLabel: input.person.userContext.fieldLabel,
  });
  const moneyStrategies = buildMoneyStrategies(input.person.labels).map((strategy, index) => ({
    ...strategy,
    plain: `${strategy.plain} ${traitText(mbti.money, "plainKo")[index] ?? ""}`.trim(),
    push: [...strategy.push, ...traitText(mbti.money.slice(index, index + 1), "positiveUse")],
    avoid: [...strategy.avoid, ...traitText(mbti.money.slice(index, index + 1), "risk")],
  }));
  const investmentProfile = buildInvestmentProfile(input.person.labels, mbti);
  const studyBase = buildStudyCertificateStrategy({
    mbti,
    labels: input.person.labels,
    fieldLabel: input.person.userContext.fieldLabel,
  });
  const studyCertificateStrategy = { ...studyBase, recommendedFields: activity.id === "general" ? studyBase.recommendedFields
    : [...activity.fields, ...studyBase.recommendedFields.filter(f => f !== input.person.userContext.fieldLabel)] };
  const workRiskWarnings = [...selectCareerAvoid(mbti), ...buildWorkRiskWarnings(input.person.labels)];
  const opportunitySignals = [
    ...buildOpportunitySignals(input.person.labels),
    ...[
      { signals: ["역마"], title: "이동과 업무 인수인계", plain: "역마 신호는 변화하는 접점을 살펴보는 관점입니다. 이동 자체를 직업 적성으로 단정하기보다 업무 전환 때 기록과 인수인계를 남길 수 있는지 보세요." },
      { signals: ["도화", "홍염"], title: "사람과 만나는 표현 방식", plain: "사람에게 보이는 표현과 반응을 점검하는 관점입니다. 설득 역할을 비교하되 감정노동이나 영업 능력을 확정하지 않습니다." },
      { signals: ["천을귀인", "월덕귀인", "천덕귀인"], title: "도움을 구하는 업무 구조", plain: "확인된 귀인 신호는 조언과 검토를 구하는 환경으로 연결합니다. 혼자 판단하기 전에 질문할 창구와 피드백 기회를 확인하세요." },
    ].flatMap((item) => {
      const matched = item.signals.filter((s) => includesAny(input.person.labels, [s]));
      return matched.length ? [{ type: "career_fit" as const, strength: "medium" as const,
        title: item.title, plain: item.plain, evidenceIds: matched.map((s) => `natal:${s}`) }] : [];
    }),
  ];
  const timingHints = buildTimingHints({
    dayMaster,
    pillars: input.person.pillars,
    referenceDate: input.referenceDate,
  });
  const bridgeEvidence = buildCareerBridgeEvidence({
    mbtiType: input.person.mbti,
    dayMaster,
    labels: input.person.labels,
    myeongliCareerBasis,
  });
  const manseRyeokPillars = input.calculatedSaju
    ? buildCareerManseRyeokPillarsFromSaju(input.calculatedSaju)
    : buildCareerManseRyeokPillars(input.person);

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
    mbtiSourceSelection: { type: mbti.profile?.type ?? null,
      traitIds: Object.fromEntries((["career", "workplace", "money", "investment", "study"] as const).map((area) => [area, mbti[area].flatMap((t) => t.id ? [t.id] : [])])),
      reportUseCases: mbti.reportUseCases },
    ...(input.calculatedSaju ? { elementCounts: {
      wood: input.calculatedSaju.elements.visible.WOOD, fire: input.calculatedSaju.elements.visible.FIRE,
      earth: input.calculatedSaju.elements.visible.EARTH, metal: input.calculatedSaju.elements.visible.METAL,
      water: input.calculatedSaju.elements.visible.WATER,
    } } : {}),
    natalLabels: input.person.labels,
    mbtiType: normalizeMbtiType(input.person.mbti),
    myeongliCareerBasis,
    mbtiCareerBasis,
    combinedCareerProfile: { ...combinedCareerProfile, plain: combinedCareerProfile.plain + (contextGod
      ? ` ${contextualTenGodReading(input.person.userContext, contextGod, "scene")}` : "") },
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
