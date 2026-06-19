import type {
  AnnualBranchInteraction,
  EarthlyBranch,
  FiveElement,
  HeavenlyStem,
  TenGod,
} from "./annualFortuneTypes";
import {
  getAnnualBranchInteractions,
  getAnnualGanjiInfo,
  getGeneratedElement,
  getTenGodForStemPair,
} from "./annualFortuneYearRules";
import {
  getMajorFortuneCycleForYear,
} from "./majorFortuneRules";
import type {
  MajorFortuneCycleBasis,
  MajorFortuneCycle,
  MajorFortuneEvidencePacket,
  MajorFortuneSignal,
} from "./majorFortuneTypes";
import {
  USER_RELATIONSHIP_STATUS_LABELS,
  type UserContextProfile,
  type UserRelationshipStatus,
} from "./userContextTypes";

type MajorPersonInput = {
  readonly label: string;
  readonly birthDate?: string;
  readonly gender?: string;
  readonly pillars: {
    readonly year: string;
    readonly month: string;
    readonly day: string;
    readonly hour?: string;
  };
  readonly labels: readonly string[];
  readonly userContext: UserContextProfile;
  readonly majorFortuneCycleBasis?: MajorFortuneCycleBasis;
  readonly majorFortuneCycles: readonly MajorFortuneCycle[];
};

const elementKo = {
  wood: "목",
  fire: "화",
  earth: "토",
  metal: "금",
  water: "수",
} as const satisfies Record<FiveElement, string>;

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

const controllingElement = {
  wood: "earth",
  earth: "water",
  water: "fire",
  fire: "metal",
  metal: "wood",
} as const satisfies Record<FiveElement, FiveElement>;

function unique<T>(values: readonly T[]): readonly T[] {
  return [...new Set(values)];
}

function parsePillarStem(pillar: string): HeavenlyStem {
  const stem = stemByInput.get(pillar.trim().slice(0, 1));

  if (stem === undefined) {
    throw new Error(`Invalid major fortune day pillar stem: ${pillar}`);
  }

  return stem;
}

function parsePillarBranch(pillar: string | undefined): EarthlyBranch | undefined {
  if (pillar === undefined) {
    return undefined;
  }

  return branchByInput.get(pillar.trim().slice(-1));
}

function getCurrentAge(input: {
  readonly birthDate?: string;
  readonly currentYear: number;
}): number {
  if (input.birthDate === undefined) {
    return input.currentYear;
  }

  const birthYear = Number(input.birthDate.slice(0, 4));

  if (!Number.isFinite(birthYear)) {
    return input.currentYear;
  }

  return input.currentYear - birthYear;
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
  return elements.length === 0
    ? "없음"
    : elements.map((element) => elementKo[element]).join("·");
}

function getMajorCycleBasisDisplayLabel(
  basisType: MajorFortuneCycleBasis,
): string {
  if (basisType === "manse_engine_major_fortune_table") {
    return "만세력 대운표 기준";
  }
  if (basisType === "user_supplied_major_fortune_table") {
    return "입력된 대운표 기준";
  }

  return "개발용 사전 계산 대운표 기준";
}

function buildMajorCycleBasis(
  basisType: MajorFortuneCycleBasis | undefined,
): MajorFortuneEvidencePacket["majorCycleBasis"] {
  const normalizedBasis = basisType ?? "fixture_precomputed_for_dev_only";
  const displayLabel = getMajorCycleBasisDisplayLabel(normalizedBasis);

  return {
    basisType: normalizedBasis,
    displayLabel,
    explanation:
      normalizedBasis === "manse_engine_major_fortune_table"
        ? "이 대운 구간은 만세력 대운표에서 선택한 기준연도에 실제로 걸린 대운을 읽은 것입니다."
        : normalizedBasis === "user_supplied_major_fortune_table"
          ? "이 대운 구간은 사용자가 검증해 입력한 대운표를 기준으로 잡았습니다."
          : "이 대운 구간은 개발 검증용 사전 계산 대운표를 기준으로 잡았습니다.",
  };
}

function buildCyclePosition(input: {
  readonly currentYear: number;
  readonly currentCycle: MajorFortuneCycle;
}): MajorFortuneEvidencePacket["cyclePosition"] {
  const yearIndexInCycle =
    input.currentYear - input.currentCycle.startYear + 1;
  const progressLabel =
    yearIndexInCycle <= 3
      ? "진입기"
      : yearIndexInCycle <= 7
        ? "정착·반복기"
        : "정리·전환기";

  return {
    cycleIndex: input.currentCycle.index,
    yearIndexInCycle,
    positionLabel: `${input.currentYear}년 기준 ${yearIndexInCycle}년차`,
    progressLabel,
  };
}

function buildPreviousToCurrentShift(input: {
  readonly previousCycle?: MajorFortuneCycle;
  readonly currentCycle: MajorFortuneCycle;
  readonly elementEffect: MajorFortuneEvidencePacket["elementEffect"];
}): MajorFortuneEvidencePacket["previousToCurrentShift"] {
  const whatChanged = [
    input.previousCycle === undefined
      ? "이전 대운 정보가 없어 이번 대운 자체의 구조를 중심으로 봅니다."
      : `${input.previousCycle.ganji}의 ${elementKo[input.previousCycle.stemElement]}·${elementKo[input.previousCycle.branchElement]} 배경에서 ${input.currentCycle.ganji}의 ${elementKo[input.currentCycle.stemElement]}·${elementKo[input.currentCycle.branchElement]} 배경으로 바뀝니다.`,
    input.elementEffect.fillsMissing.length > 0
      ? `${formatElementList(input.elementEffect.fillsMissing)} 부족을 장기적으로 보완하는 쪽이 열립니다.`
      : "부족한 오행을 직접 채우기보다 기존 구조를 다시 배치하는 쪽이 강합니다.",
    input.elementEffect.overloadsHeavy.length > 0
      ? `${formatElementList(input.elementEffect.overloadsHeavy)} 과다로 책임과 현실 압박이 쌓이지 않게 관리해야 합니다.`
      : "과다 오행을 더 무겁게 만드는 압박은 상대적으로 제한적입니다.",
  ];

  return {
    previousGanji: input.previousCycle?.ganji,
    currentGanji: input.currentCycle.ganji,
    plain:
      input.previousCycle === undefined
        ? `${input.currentCycle.ganji} 대운은 이전 구간보다 현재 10년의 구조를 먼저 읽어야 합니다.`
        : `${input.previousCycle.ganji} 대운에서 ${input.currentCycle.ganji} 대운으로 넘어오며 인생 배경의 무게중심이 바뀝니다.`,
    whatChanged,
  };
}

function buildDecadeArchetype(input: {
  readonly currentCycle: MajorFortuneCycle;
  readonly majorTenGod: TenGod;
  readonly elementEffect: MajorFortuneEvidencePacket["elementEffect"];
}): MajorFortuneEvidencePacket["decadeArchetype"] {
  if (input.currentCycle.stemElement === "earth" || input.currentCycle.branchElement === "earth") {
    return {
      label: "현실 구조 재편형",
      metaphor: "흙더미를 다시 설계도로 바꾸는 10년",
      plain: `${input.currentCycle.ganji} 대운은 해야 할 일, 관리할 일, 책임질 일을 흙처럼 쌓아 두기보다 구조로 다시 짜야 하는 배경입니다.`,
    };
  }
  if (input.majorTenGod === "식신" || input.majorTenGod === "상관") {
    return {
      label: "결과물 확장형",
      metaphor: "머릿속 생각을 바깥 결과물로 꺼내는 10년",
      plain: `${input.currentCycle.ganji} 대운은 말, 생산성, 콘텐츠, 실행물을 반복해서 바깥으로 내보내는 배경입니다.`,
    };
  }

  return {
    label: "역할 재정렬형",
    metaphor: "내 자리를 다시 잡고 오래 버틸 구조를 만드는 10년",
    plain: `${input.currentCycle.ganji} 대운은 한 번의 사건보다 역할과 기준이 계속 재배치되는 장기 배경입니다.`,
  };
}

function getRelationshipStatusHints(
  status: UserRelationshipStatus | null | undefined,
): readonly string[] {
  const normalized = status ?? "unknown";
  const label = USER_RELATIONSHIP_STATUS_LABELS[normalized];

  if (normalized === "single") {
    return [
      `${label}: 일, 스터디, 커뮤니티, 소개처럼 생활 반경 안에서 역할이 겹치는 사람과 가까워지는 흐름을 봅니다.`,
      "운명적 만남을 단정하지 말고 만남이 생기는 경로와 생활 리듬을 중심으로 해석합니다.",
    ];
  }
  if (normalized === "dating") {
    return [
      `${label}: 만남 주기, 연락 빈도, 일과 생활 균형이 관계 체감에 크게 작용합니다.`,
      "감정만이 아니라 일정과 역할 조율이 관계 안정성의 핵심입니다.",
    ];
  }
  if (normalized === "married") {
    return [
      `${label}: 배우자와 가족 책임, 생활비, 집안 일정, 역할 분담을 중심으로 해석합니다.`,
      "관계 운은 생활 운영과 현실 책임의 배분으로 체감될 수 있습니다.",
    ];
  }
  if (normalized === "complicated") {
    return [
      `${label}: 미정리 관계, 거리 조절, 연락 패턴, 애매한 기대치를 중심으로 해석합니다.`,
      "확정된 관계로 단정하지 않고 정리와 경계 설정을 우선합니다.",
    ];
  }

  return [
    `${label}: 연애 상태가 입력되지 않았으므로 솔로, 연애 중, 기혼으로 단정하지 않습니다.`,
    "연애·가족 해석은 가족, 가까운 관계, 생활 반경 안의 만남 가능성 정도로만 번역합니다.",
  ];
}

export function buildMajorFortuneElementEffect(params: {
  readonly currentCycle: MajorFortuneCycle;
  readonly natalLabels: readonly string[];
  readonly dayMaster: HeavenlyStem;
}): MajorFortuneEvidencePacket["elementEffect"] {
  const cycleElements = unique([
    params.currentCycle.stemElement,
    params.currentCycle.branchElement,
  ]);
  const missingElements = getElementsFromLabels(params.natalLabels, "부족");
  const heavyElements = getElementsFromLabels(params.natalLabels, "과다");
  const fillsMissing = cycleElements.filter((element) =>
    missingElements.includes(element),
  );
  const directOverloads = cycleElements.filter((element) =>
    heavyElements.includes(element),
  );
  const indirectOverloads = cycleElements
    .map((element) => getGeneratedElement(element))
    .filter((element) => heavyElements.includes(element));
  const overloadsHeavy = unique([...directOverloads, ...indirectOverloads]);
  const regulatesHeavy = cycleElements
    .map((element) => controllingElement[element])
    .filter((element) => heavyElements.includes(element));
  const fillText =
    fillsMissing.length > 0
      ? `${formatElementList(fillsMissing)} 부족을 장기적으로 보완합니다`
      : "부족한 오행을 직접 채우는 힘은 약합니다";
  const overloadText =
    overloadsHeavy.length > 0
      ? `${formatElementList(overloadsHeavy)} 과다를 직접 또는 간접으로 더 무겁게 만들 수 있습니다`
      : "이미 무거운 오행을 크게 더하는 흐름은 약합니다";
  const regulationText =
    regulatesHeavy.length > 0
      ? `다만 ${formatElementList(regulatesHeavy)} 과다를 제어하는 작용도 함께 봅니다`
      : "과다 오행을 직접 제어하는 흐름은 제한적입니다";

  return {
    strengthens: cycleElements,
    fillsMissing,
    overloadsHeavy,
    plain: `${params.currentCycle.ganji} 대운은 ${formatElementList(cycleElements)} 기운을 10년 배경으로 강화합니다. ${fillText}. 동시에 ${overloadText}. ${regulationText}.`,
  };
}

export function getMajorFortuneBranchInteractions(params: {
  readonly majorBranch: EarthlyBranch;
  readonly natalBranches: readonly EarthlyBranch[];
}): MajorFortuneEvidencePacket["branchInteractions"] {
  return getAnnualBranchInteractions({
    annualBranch: params.majorBranch,
    natalBranches: params.natalBranches,
  }).map((interaction: AnnualBranchInteraction) => ({
    type: interaction.type,
    branches: interaction.branches,
    affectedPillars: interaction.affectedPillars,
    plain: interaction.plain.replace(/세운/gu, "대운"),
  }));
}

function addSignal(signals: MajorFortuneSignal[], signal: MajorFortuneSignal): void {
  if (signals.every((item) => item.type !== signal.type)) {
    signals.push(signal);
  }
}

function buildLifeAreaSignals(input: {
  readonly userContext: UserContextProfile;
  readonly stemTenGod: TenGod;
  readonly elementEffect: MajorFortuneEvidencePacket["elementEffect"];
  readonly branchInteractions: MajorFortuneEvidencePacket["branchInteractions"];
}): readonly MajorFortuneSignal[] {
  const signals: MajorFortuneSignal[] = [];
  const field = input.userContext.fieldLabel ?? "현재 분야";

  addSignal(signals, {
    type: "career_shift",
    strength: "high",
    plain: `${field} 안에서 프로젝트 방향, 역할, 성과 기준이 10년 단위로 재배치되는 배경입니다.`,
  });
  if (input.elementEffect.overloadsHeavy.includes("earth")) {
    addSignal(signals, {
      type: "money_responsibility",
      strength: "high",
      plain: "토 과다가 자극되면 급여, 고정지출, 계약, 장기 자산 관리처럼 현실 숫자의 책임이 커집니다.",
    });
  }
  if (
    input.branchInteractions.some((interaction) =>
      interaction.affectedPillars?.includes("day"),
    )
  ) {
    addSignal(signals, {
      type: "relationship_restructure",
      strength: "medium",
      plain: "일지가 대운 지지와 맞물리면 가까운 관계와 사적인 리듬을 장기적으로 다시 정리하게 됩니다.",
    });
  }
  if (
    input.branchInteractions.some((interaction) =>
      interaction.affectedPillars?.includes("month"),
    )
  ) {
    addSignal(signals, {
      type: "career_shift",
      strength: "high",
      plain: "월지가 대운 지지와 맞물려 일, 조직, 사회적 리듬의 방향 전환이 장기 배경으로 깔립니다.",
    });
  }
  if (input.elementEffect.fillsMissing.includes("water")) {
    addSignal(signals, {
      type: "health_rhythm",
      strength: "medium",
      plain: "수 부족이 보완되면 휴식, 회복, 감정 완충, 장기 리듬 조절이 살아날 수 있습니다.",
    });
  }
  if (input.stemTenGod === "편인" || input.stemTenGod === "정인") {
    addSignal(signals, {
      type: "study_certificate",
      strength: "medium",
      plain: `${input.stemTenGod} 대운은 공부, 자격, 문서, 조언 체계를 장기 기반으로 삼게 합니다.`,
    });
  }
  addSignal(signals, {
    type: "identity_change",
    strength: "medium",
    plain: "대운은 단기 사건보다 '내가 어떤 역할로 살아갈지'를 바꾸는 장기 배경입니다.",
  });

  return signals;
}

function buildDifficultySignals(input: {
  readonly stemTenGod: TenGod;
  readonly elementEffect: MajorFortuneEvidencePacket["elementEffect"];
  readonly branchInteractions: MajorFortuneEvidencePacket["branchInteractions"];
}): readonly MajorFortuneSignal[] {
  const signals: MajorFortuneSignal[] = [];

  if (input.elementEffect.overloadsHeavy.length > 0) {
    addSignal(signals, {
      type: "money_responsibility",
      strength: "medium",
      plain: `${formatElementList(input.elementEffect.overloadsHeavy)} 과다가 장기적으로 무거워져 책임, 돈, 관리 부담이 누적될 수 있습니다.`,
    });
  }
  if (input.stemTenGod === "편관" || input.stemTenGod === "정관") {
    addSignal(signals, {
      type: "career_shift",
      strength: "medium",
      plain: `${input.stemTenGod} 대운은 평가, 규칙, 공식 책임이 늘어나는 압박으로 체감될 수 있습니다.`,
    });
  }
  if (
    input.branchInteractions.some((interaction) =>
      ["충", "해", "형", "파"].includes(interaction.type),
    )
  ) {
    addSignal(signals, {
      type: "relationship_restructure",
      strength: "medium",
      plain: "대운 지지의 충·해·형·파는 익숙한 관계, 생활 리듬, 사회적 위치를 다시 조정하게 만듭니다.",
    });
  }
  addSignal(signals, {
    type: "health_rhythm",
    strength: "low",
    plain: "10년 단위 변화는 몸의 회복 속도와 생활 리듬에도 누적 압박으로 나타날 수 있습니다.",
  });

  return signals;
}

function buildOpportunitySignals(input: {
  readonly stemTenGod: TenGod;
  readonly elementEffect: MajorFortuneEvidencePacket["elementEffect"];
  readonly branchInteractions: MajorFortuneEvidencePacket["branchInteractions"];
}): readonly MajorFortuneSignal[] {
  const signals: MajorFortuneSignal[] = [];

  if (input.stemTenGod === "식신" || input.stemTenGod === "상관") {
    addSignal(signals, {
      type: "career_shift",
      strength: "high",
      plain: `${input.stemTenGod} 대운은 결과물, 표현, 콘텐츠, 실행물을 장기적으로 밖으로 꺼낼 기회를 줍니다.`,
    });
  }
  if (input.stemTenGod === "편재" || input.stemTenGod === "정재") {
    addSignal(signals, {
      type: "money_responsibility",
      strength: "high",
      plain: `${input.stemTenGod} 대운은 돈, 자원, 거래, 장기 현실 기반을 만들 기회를 줍니다.`,
    });
  }
  for (const element of input.elementEffect.fillsMissing) {
    addSignal(signals, {
      type: element === "water" ? "health_rhythm" : "stability",
      strength: "medium",
      plain: `${elementKo[element]} 부족을 보완하는 대운은 평소 늦게 켜지던 기능을 장기적으로 훈련하게 합니다.`,
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
      plain: "합과 반합은 사람, 장소, 조직, 일정이 묶이며 장기 이동 기회를 만들 수 있습니다.",
    });
  }
  addSignal(signals, {
    type: "identity_change",
    strength: "medium",
    plain: "현재 대운은 직업과 생활 선택을 통해 자기 정체성을 다시 세울 기회를 줍니다.",
  });

  return signals;
}

function buildStrategicThemes(input: {
  readonly userContext: UserContextProfile;
  readonly currentCycle: MajorFortuneCycle;
  readonly majorTenGod: TenGod;
  readonly elementEffect: MajorFortuneEvidencePacket["elementEffect"];
  readonly relationshipHints: readonly string[];
}): MajorFortuneEvidencePacket["strategicThemes"] {
  const field = input.userContext.fieldLabel ?? "현재 분야";

  return [
    {
      label: "역할과 책임의 설계",
      metaphor: "흙더미처럼 쌓이는 일을 설계도로 다시 나누는 테마",
      plain: `${input.currentCycle.ganji} 대운은 ${field}에서 맡을 일과 맡지 않을 일을 구분하지 않으면 책임이 먼저 들어오는 구조로 체감될 수 있습니다.`,
      concreteImplications: [
        "직급이나 권한보다 프로젝트 방향 정리, 문서화, 일정 조율이 먼저 늘어날 수 있습니다.",
        "상사와 실무자 사이에서 기준을 번역하는 위치가 반복될 수 있습니다.",
      ],
      strategy:
        "초반부터 책임 범위, 마감 기준, 결정권자를 문서로 남겨야 소모를 줄일 수 있습니다.",
    },
    {
      label: "돈과 현실 구조",
      metaphor: "새는 돈을 막고 현실 숫자를 단순화하는 테마",
      plain:
        input.elementEffect.overloadsHeavy.includes("earth")
          ? "토가 무거워지면 수입 자체보다 고정지출, 계약, 정산, 장기 비용을 관리하는 능력이 중요해집니다."
          : "현실 구조를 크게 늘리기보다 돈과 시간의 반복 지출을 단순화하는 쪽이 맞습니다.",
      concreteImplications: [
        "생활비, 관리비, 구독, 계약 조건처럼 반복 비용을 먼저 분리해야 합니다.",
        "무리한 확장보다 새는 돈과 책임 비용을 줄이는 전략이 유리합니다.",
      ],
      strategy:
        "큰 투자보다 월별 고정비, 계약, 정산 기준을 먼저 정리하는 전략을 잡으세요.",
    },
    {
      label: "관계와 생활 반경",
      metaphor: "사람과 일정이 실제 역할로 묶이는 테마",
      plain: input.relationshipHints.join(" "),
      concreteImplications: [
        "가까운 관계는 감정보다 일정, 연락 빈도, 역할 기대치 때문에 체감이 달라질 수 있습니다.",
        "가족이나 가까운 사람의 문제를 대신 수습하는 장면은 경계 설정이 필요합니다.",
      ],
      strategy:
        "관계에서는 좋은 말보다 만나는 주기, 연락 방식, 맡을 역할을 현실적으로 맞추세요.",
    },
  ];
}

function buildLongRangeRisks(input: {
  readonly elementEffect: MajorFortuneEvidencePacket["elementEffect"];
  readonly branchInteractions: MajorFortuneEvidencePacket["branchInteractions"];
}): MajorFortuneEvidencePacket["longRangeRisks"] {
  return [
    {
      label: "책임 과적",
      plain:
        input.elementEffect.overloadsHeavy.length > 0
          ? `${formatElementList(input.elementEffect.overloadsHeavy)} 과다가 자극되어 할 일과 관리할 일이 누적될 수 있습니다.`
          : "큰 문제가 아니어도 반복 업무와 생활 책임이 천천히 쌓일 수 있습니다.",
      prevention:
        "책임이 들어올 때마다 기록, 범위, 담당자를 먼저 정해야 장기 소모를 줄일 수 있습니다.",
    },
    {
      label: "관계 경계 흐림",
      plain:
        input.branchInteractions.length > 0
          ? "대운 지지가 원국 지지와 맞물리며 가까운 관계, 조직, 가족 역할이 다시 흔들릴 수 있습니다."
          : "사람과 일정이 반복되며 애매한 부탁이나 기대가 누적될 수 있습니다.",
      prevention:
        "거절보다 먼저 가능한 범위와 시간을 짧게 말하는 습관이 필요합니다.",
    },
  ];
}

function buildLongRangeOpportunities(input: {
  readonly userContext: UserContextProfile;
  readonly majorTenGod: TenGod;
  readonly elementEffect: MajorFortuneEvidencePacket["elementEffect"];
}): MajorFortuneEvidencePacket["longRangeOpportunities"] {
  const field = input.userContext.fieldLabel ?? "현재 분야";

  return [
    {
      label: "운영 기준 확보",
      plain: `${input.majorTenGod} 대운의 핵심은 ${field}에서 반복되는 일을 내 기준으로 정리하는 능력을 키우는 데 있습니다.`,
      action:
        "말로 처리하던 기준을 문서, 체크리스트, 일정표, 회고 기록으로 남기세요.",
    },
    {
      label: "부족 기능 훈련",
      plain:
        input.elementEffect.fillsMissing.length > 0
          ? `${formatElementList(input.elementEffect.fillsMissing)} 부족을 보완하며 평소 늦게 켜지던 기능을 훈련할 수 있습니다.`
          : "부족을 직접 채우는 대운은 아니어도 반복 압박을 통해 필요한 기능을 훈련하게 됩니다.",
      action:
        "한 번에 바꾸려 하지 말고 10년 동안 반복할 수 있는 작고 안정적인 루틴을 만드세요.",
    },
  ];
}

function buildTransitionSignals(input: {
  readonly currentCycle: MajorFortuneCycle;
  readonly previousCycle?: MajorFortuneCycle;
  readonly nextCycle?: MajorFortuneCycle;
}): MajorFortuneEvidencePacket["transitionSignals"] {
  return [
    input.previousCycle === undefined
      ? undefined
      : {
          type: "previous_to_current" as const,
          plain: `${input.previousCycle.ganji} 대운에서 ${input.currentCycle.ganji} 대운으로 넘어오며 ${elementKo[input.previousCycle.stemElement]}·${elementKo[input.previousCycle.branchElement]} 배경이 ${elementKo[input.currentCycle.stemElement]}·${elementKo[input.currentCycle.branchElement]} 배경으로 바뀌었습니다.`,
        },
    input.nextCycle === undefined
      ? undefined
      : {
          type: "current_to_next" as const,
          plain: `${input.currentCycle.ganji} 대운 다음에는 ${input.nextCycle.ganji} 대운으로 넘어가며 장기 배경이 다시 전환됩니다.`,
        },
  ].filter(
    (
      signal,
    ): signal is MajorFortuneEvidencePacket["transitionSignals"][number] =>
      signal !== undefined,
  );
}

function buildStrongYearsWithinCycle(input: {
  readonly currentCycle: MajorFortuneCycle;
  readonly dayMaster: HeavenlyStem;
  readonly majorTenGod: TenGod;
  readonly natalBranches: readonly EarthlyBranch[];
  readonly elementEffect: MajorFortuneEvidencePacket["elementEffect"];
}): MajorFortuneEvidencePacket["strongYearsWithinCycle"] {
  return Array.from(
    {
      length: input.currentCycle.endYear - input.currentCycle.startYear + 1,
    },
    (_, index) => input.currentCycle.startYear + index,
  )
    .map((year) => {
      const annualGanji = getAnnualGanjiInfo(year);
      const reasons: string[] = [];

      if (
        annualGanji.stemElement === input.currentCycle.stemElement ||
        annualGanji.branchElement === input.currentCycle.branchElement
      ) {
        reasons.push("대운의 오행이 다시 반복되어 10년 테마가 더 크게 켜짐");
      }
      if (
        getTenGodForStemPair(input.dayMaster, annualGanji.stem) ===
        input.majorTenGod
      ) {
        reasons.push(`${input.majorTenGod} 테마가 세운에서도 반복되어 같은 과제가 겹침`);
      }
      if (annualGanji.branch === input.currentCycle.branch) {
        reasons.push("대운 지지와 같은 지지가 들어와 현실 체감이 강해짐");
      }
      const interactions = getAnnualBranchInteractions({
        annualBranch: annualGanji.branch,
        natalBranches: [input.currentCycle.branch, ...input.natalBranches],
      });
      if (interactions.length > 0) {
        reasons.push(
          `${interactions.map((interaction) => interaction.type).join("·")} 작용으로 관계, 일, 생활 리듬이 실제 조정됨`,
        );
      }
      if (input.elementEffect.fillsMissing.includes(annualGanji.stemElement)) {
        reasons.push(`${elementKo[annualGanji.stemElement]} 부족을 보완하는 힘이 겹침`);
      }
      if (input.elementEffect.overloadsHeavy.includes(annualGanji.branchElement)) {
        reasons.push(`${elementKo[annualGanji.branchElement]} 과다 압박이 현실 책임으로 커질 수 있음`);
      }

      const area = reasons.some((reason) => reason.includes("돈") || reason.includes("현실"))
        ? "돈·현실"
        : interactions.length > 0
          ? "관계·생활 리듬"
          : "일·성과";

      return {
        year,
        ganji: annualGanji.ganji,
        reason: reasons.join(" / "),
        area,
        action:
          area === "돈·현실"
            ? "고정비, 계약, 정산 기준을 먼저 정리하세요."
            : area === "관계·생활 리듬"
              ? "관계와 일정의 역할 경계를 짧게 확인하세요."
              : "프로젝트 기준과 책임 범위를 문서로 남기세요.",
      };
    })
    .filter((item) => item.reason.length > 0)
    .slice(0, 5);
}

function getCycleYearPhase(yearIndexInCycle: number): "early" | "middle" | "late" {
  if (yearIndexInCycle <= 3) {
    return "early";
  }
  if (yearIndexInCycle <= 7) {
    return "middle";
  }

  return "late";
}

function buildCycleYearTimeline(input: {
  readonly currentCycle: MajorFortuneCycle;
  readonly dayMaster: HeavenlyStem;
  readonly majorTenGod: TenGod;
  readonly natalBranches: readonly EarthlyBranch[];
  readonly elementEffect: MajorFortuneEvidencePacket["elementEffect"];
}): MajorFortuneEvidencePacket["cycleYearTimeline"] {
  return Array.from(
    {
      length: input.currentCycle.endYear - input.currentCycle.startYear + 1,
    },
    (_, index) => {
      const year = input.currentCycle.startYear + index;
      const yearIndexInCycle = index + 1;
      const annualGanji = getAnnualGanjiInfo(year);
      const annualTenGod = getTenGodForStemPair(input.dayMaster, annualGanji.stem);
      const interactions = getAnnualBranchInteractions({
        annualBranch: annualGanji.branch,
        natalBranches: [input.currentCycle.branch, ...input.natalBranches],
      });
      const relationParts = [
        annualGanji.stemElement === input.currentCycle.stemElement ||
        annualGanji.branchElement === input.currentCycle.branchElement
          ? "대운의 현실 과제가 다시 켜짐"
          : undefined,
        annualTenGod === input.majorTenGod
          ? `${input.majorTenGod} 테마가 반복되어 같은 방식의 역할이 겹침`
          : undefined,
        interactions.length > 0
          ? `${interactions.map((interaction) => interaction.type).join("·")} 작용으로 실제 관계와 환경을 조정`
          : undefined,
        input.elementEffect.fillsMissing.includes(annualGanji.stemElement)
          ? `${elementKo[annualGanji.stemElement]} 부족을 보완`
          : undefined,
        input.elementEffect.overloadsHeavy.includes(annualGanji.branchElement)
          ? `${elementKo[annualGanji.branchElement]} 과다 압박을 자극`
          : undefined,
      ].filter((part): part is string => part !== undefined);
      const phase = getCycleYearPhase(yearIndexInCycle);
      const roleOfYearInCycle =
        phase === "early"
          ? yearIndexInCycle === 1
            ? "새 대운 진입, 현실 구조를 다시 까는 해"
            : "새 역할과 기준을 시험하는 해"
          : phase === "middle"
            ? "반복되는 책임이 실제 구조로 굳는 해"
            : "다음 대운을 준비하며 정리와 선택이 중요해지는 해";
      const relationToMajorCycle =
        relationParts.length === 0
          ? "큰 충돌보다 대운의 기본 과제를 운영하는 해"
          : relationParts.join(" / ");
      const strategicFocus =
        phase === "early"
          ? "책임 범위와 생활 기준을 초반부터 작게라도 정리하기"
          : phase === "middle"
            ? "반복되는 역할을 시스템과 기록으로 고정하기"
            : "성과, 비용, 관계 경계를 정리해 다음 구간 준비하기";
      const whyItMatters =
        yearIndexInCycle === 1
          ? "첫해에 잡은 기준이 이후 10년의 운영 방식으로 반복되기 쉽기 때문입니다."
          : relationToMajorCycle;

      return {
        year,
        ganji: annualGanji.ganji,
        yearIndexInCycle,
        phase,
        headline: roleOfYearInCycle,
        annualElementFocus: `${elementKo[annualGanji.stemElement]}·${elementKo[annualGanji.branchElement]}`,
        roleOfYearInCycle,
        plainInterpretation: `${year}년 ${annualGanji.ganji}은 ${input.currentCycle.ganji} 대운의 ${yearIndexInCycle}년차입니다. ${relationToMajorCycle}.`,
        strategicFocus,
        whyItMatters,
      };
    },
  );
}

function buildCalculationBasis(
  currentYear: number,
  majorCycleBasis: MajorFortuneEvidencePacket["majorCycleBasis"],
): MajorFortuneEvidencePacket["calculationBasis"] {
  return {
    basisType: majorCycleBasis.basisType,
    displayLabel: majorCycleBasis.displayLabel,
    explanation: majorCycleBasis.explanation,
    ageBasisLabel: "표기 나이는 대운표 기준 나이입니다.",
    note:
      `현재 리포트에서는 ${currentYear}년을 기준으로 현재 위치한 대운을 읽습니다.`,
  };
}

function buildWarnings(input: {
  readonly labels: readonly string[];
  readonly cycleBasis?: string;
}): readonly string[] {
  return [
    input.cycleBasis === "fixture_precomputed_for_dev_only"
      ? "major fortune cycles use dev-only fixture basis; exact start-age algorithm is not implemented in DAEUN-03B"
      : undefined,
    input.labels.includes("백호대살")
      ? "diagnostic features excluded"
      : undefined,
  ].filter((warning): warning is string => warning !== undefined);
}

export function buildMajorFortuneEvidence(input: {
  readonly fixtureId?: string;
  readonly currentYear: number;
  readonly person: MajorPersonInput;
}): MajorFortuneEvidencePacket {
  const currentAge = getCurrentAge({
    birthDate: input.person.birthDate,
    currentYear: input.currentYear,
  });
  const cycleAccess = getMajorFortuneCycleForYear({
    cycles: input.person.majorFortuneCycles,
    currentYear: input.currentYear,
    currentAge,
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
  const majorTenGod = getTenGodForStemPair(
    dayMaster,
    cycleAccess.currentCycle.stem,
  );
  const elementEffect = buildMajorFortuneElementEffect({
    currentCycle: cycleAccess.currentCycle,
    natalLabels: input.person.labels,
    dayMaster,
  });
  const branchInteractions = getMajorFortuneBranchInteractions({
    majorBranch: cycleAccess.currentCycle.branch,
    natalBranches,
  });
  const majorCycleBasis = buildMajorCycleBasis(
    input.person.majorFortuneCycleBasis,
  );
  const cyclePosition = buildCyclePosition({
    currentYear: input.currentYear,
    currentCycle: cycleAccess.currentCycle,
  });
  const relationshipStatusTranslationHints = getRelationshipStatusHints(
    input.person.userContext.relationshipStatus,
  );
  const previousToCurrentShift = buildPreviousToCurrentShift({
    previousCycle: cycleAccess.previousCycle,
    currentCycle: cycleAccess.currentCycle,
    elementEffect,
  });
  const decadeArchetype = buildDecadeArchetype({
    currentCycle: cycleAccess.currentCycle,
    majorTenGod,
    elementEffect,
  });
  const strategicThemes = buildStrategicThemes({
    userContext: input.person.userContext,
    currentCycle: cycleAccess.currentCycle,
    majorTenGod,
    elementEffect,
    relationshipHints: relationshipStatusTranslationHints,
  });
  const longRangeRisks = buildLongRangeRisks({
    elementEffect,
    branchInteractions,
  });
  const longRangeOpportunities = buildLongRangeOpportunities({
    userContext: input.person.userContext,
    majorTenGod,
    elementEffect,
  });

  return {
    productType: "major_fortune",
    productVersion: "v1",
    personLabel: input.person.label,
    userContext: input.person.userContext,
    currentYear: input.currentYear,
    currentAge,
    dayMaster,
    userPillars: input.person.pillars,
    natalLabels: input.person.labels,
    currentCycle: cycleAccess.currentCycle,
    previousCycle: cycleAccess.previousCycle,
    nextCycle: cycleAccess.nextCycle,
    majorCycleBasis,
    cyclePosition,
    calculationBasis: buildCalculationBasis(input.currentYear, majorCycleBasis),
    majorTenGod: {
      stemTenGod: majorTenGod,
      plain: `${cycleAccess.currentCycle.ganji} 대운의 천간 ${cycleAccess.currentCycle.stem}은 ${dayMaster} 일간에게 ${majorTenGod}으로 작용합니다.`,
    },
    elementEffect,
    branchInteractions,
    lifeAreaSignals: buildLifeAreaSignals({
      userContext: input.person.userContext,
      stemTenGod: majorTenGod,
      elementEffect,
      branchInteractions,
    }),
    difficultySignals: buildDifficultySignals({
      stemTenGod: majorTenGod,
      elementEffect,
      branchInteractions,
    }),
    opportunitySignals: buildOpportunitySignals({
      stemTenGod: majorTenGod,
      elementEffect,
      branchInteractions,
    }),
    transitionSignals: buildTransitionSignals({
      currentCycle: cycleAccess.currentCycle,
      previousCycle: cycleAccess.previousCycle,
      nextCycle: cycleAccess.nextCycle,
    }),
    previousToCurrentShift,
    decadeArchetype,
    strategicThemes,
    longRangeRisks,
    longRangeOpportunities,
    relationshipStatusTranslationHints,
    strongYearsWithinCycle: buildStrongYearsWithinCycle({
      currentCycle: cycleAccess.currentCycle,
      dayMaster,
      majorTenGod,
      natalBranches,
      elementEffect,
    }),
    cycleYearTimeline: buildCycleYearTimeline({
      currentCycle: cycleAccess.currentCycle,
      dayMaster,
      majorTenGod,
      natalBranches,
      elementEffect,
    }),
    warnings: buildWarnings({
      labels: input.person.labels,
      cycleBasis: input.person.majorFortuneCycleBasis,
    }),
  };
}
