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

const impactAreaByPillar = {
  year: "love_family",
  month: "work",
  day: "relationship",
  hour: "health",
} as const satisfies Record<
  "year" | "month" | "day" | "hour",
  "work" | "relationship" | "love_family" | "health"
>;

const plainTypeByInteraction = {
  충: "굳어 있던 배치가 부딪혀 바뀌는 장면",
  육합: "사람·일정·역할이 실제로 묶이는 장면",
  삼합: "한 방향의 흐름이 크게 모이는 장면",
  반합: "특정 흐름이 절반쯤 모여 힘을 얻는 장면",
  형: "겉으로 참고 있지만 안쪽 압박이 쌓이는 장면",
  파: "기존 방식이 깨지며 다시 조정되는 장면",
  해: "큰 충돌은 아니지만 피로와 누수가 쌓이는 장면",
  원진: "가깝지만 미묘하게 어긋나는 감정 피로",
  귀문: "생각이 한 방향으로 깊게 꽂히거나 예민한 판단이 강해지는 장면",
} as const;

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

  if (normalized === "unknown") {
    return [
      "연애·가족 영역에서는 감정 자체보다 생활 반경, 만남 주기, 연락 방식, 역할 분담이 더 중요해지는 흐름입니다.",
      "관계는 특정 상태를 단정하기보다 일, 커뮤니티, 소개, 가족 일정처럼 반복되는 현실 접점에서 해석합니다.",
    ];
  }

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
  return [
    `${label}: 연애 상태가 입력되지 않았으므로 솔로, 연애 중, 기혼으로 단정하지 않습니다.`,
    "연애·가족 해석은 가족, 가까운 관계, 생활 반경 안의 만남 가능성 정도로만 번역합니다.",
  ];
}

function buildLifeStageContext(input: {
  readonly currentAge: number;
  readonly currentCycle: MajorFortuneCycle;
  readonly userContext: UserContextProfile;
}): MajorFortuneEvidencePacket["lifeStageContext"] {
  const startAge = input.currentCycle.startAge;
  const endAge = input.currentCycle.endAge;
  const fieldLabel = input.userContext.fieldLabel ?? "현재 분야";

  if (startAge <= 19 || input.currentAge < 20) {
    return {
      label: "10대 학업·생활 기준 형성기",
      relevantThemes: [
        "학교와 시험 리듬",
        "가족 규칙",
        "친구 관계",
        "공부 습관",
      ],
      suppressedThemes: [
        "결혼 판단",
        "장기 자산 확장",
        "직장 권한 경쟁",
      ],
      plain:
        "이 나이대에서는 직업·결혼 단정보다 학교, 시험, 친구, 가족 규칙, 생활 리듬을 중심으로 대운을 번역합니다.",
    };
  }

  if (startAge <= 30 && endAge >= 33) {
    return {
      label: "20대 후반~30대 중반 전환기",
      relevantThemes: [
        "커리어 기준 확립",
        "이직·직무 전환 검토",
        "연봉·외부 프로젝트·수익화 접점",
        "연애·결혼 가능성 검토",
        "독립·주거·생활비",
        "장기 건강 루틴",
      ],
      suppressedThemes: [
        "은퇴 이후 정리",
        "미성년 학업 중심 해석",
      ],
      plain: `${fieldLabel} 기준으로는 커리어 증명, 수익화 접점, 장기 관계와 독립 비용을 함께 보는 전환기입니다.`,
    };
  }

  if (startAge >= 40 || input.currentAge >= 40) {
    return {
      label: "40대 이후 역할 통합기",
      relevantThemes: [
        "역할 권한 정리",
        "가족 책임",
        "자산 관리",
        "건강 루틴",
        "커리어 영향력",
      ],
      suppressedThemes: [
        "초기 취업 적응",
        "미성년 학업 중심 해석",
      ],
      plain:
        "이 나이대에서는 이미 쌓인 역할, 가족 책임, 자산 관리, 건강 루틴을 어떻게 재배치할지가 중요합니다.",
    };
  }

  return {
    label: "성인기 역할 조정기",
    relevantThemes: [
      "직업 방향",
      "돈의 기준",
      "관계 경계",
      "생활 루틴",
    ],
    suppressedThemes: [
      "미성년 학업 중심 해석",
    ],
    plain:
      "현재 나이대에서는 직업, 돈, 관계, 생활 리듬을 동시에 조정하는 방식으로 대운을 번역합니다.",
  };
}

function getImpactArea(
  interaction: Pick<
    MajorFortuneEvidencePacket["branchInteractions"][number],
    "type" | "affectedPillars"
  >,
): "work" | "money" | "relationship" | "love_family" | "study" | "health" | "identity" {
  const primaryPillar = interaction.affectedPillars?.[0];

  if (primaryPillar !== undefined) {
    return impactAreaByPillar[primaryPillar];
  }
  if (interaction.type === "형" || interaction.type === "해") {
    return "health";
  }
  if (interaction.type === "육합" || interaction.type === "삼합" || interaction.type === "반합") {
    return "relationship";
  }

  return "identity";
}

function formatHiddenStem(
  dayMaster: HeavenlyStem,
  stem: HeavenlyStem,
): string {
  return `${stem}(${getTenGodForStemPair(dayMaster, stem)})`;
}

function getAuxiliaryStarPlain(label: string): {
  readonly plain: string;
  readonly caution: string | null;
} {
  if (label.includes("천을귀인")) {
    return {
      plain: "막혔을 때 도움을 주는 사람, 제도, 조언이 들어올 수 있는 보호 장치입니다.",
      caution: null,
    };
  }
  if (label.includes("재고귀인")) {
    return {
      plain: "돈과 현실 자원이 바로 드러나기보다 창고처럼 모였다가 쓰이는 구조입니다.",
      caution: "쌓인 자원은 기준 없이 열면 책임과 비용으로도 보일 수 있습니다.",
    };
  }
  if (label.includes("금여록")) {
    return {
      plain: "생활 안정감, 대우, 품위, 관계에서 받는 신뢰를 현실 기반으로 쓰는 신호입니다.",
      caution: null,
    };
  }
  if (label.includes("현침살")) {
    return {
      plain: "말, 판단, 분석이 날카롭게 들어가는 장면으로 나타날 수 있습니다.",
      caution: "비판이 빨라지면 관계 피로가 쌓일 수 있어 표현 수위를 조절해야 합니다.",
    };
  }
  if (label.includes("홍염살")) {
    return {
      plain: "사람에게 보이는 매력과 존재감이 생기는 신호입니다.",
      caution: "관계에서는 호감과 실제 책임을 구분해야 합니다.",
    };
  }
  if (label.includes("귀문관살")) {
    return {
      plain: plainTypeByInteraction.귀문,
      caution: "생각이 깊어지는 만큼 혼자 결론을 고정하지 않는 장치가 필요합니다.",
    };
  }
  if (label.includes("원진살")) {
    return {
      plain: plainTypeByInteraction.원진,
      caution: "가까운 관계일수록 말하지 않은 기대가 쌓이지 않게 해야 합니다.",
    };
  }
  if (label.includes("공망")) {
    return {
      plain: "기대했던 자리가 비거나, 바로 채워지지 않는 공백을 운영해야 하는 신호입니다.",
      caution: "비어 있는 시간을 실패로 단정하지 말고 재정비 구간으로 써야 합니다.",
    };
  }
  if (label.includes("화개살")) {
    return {
      plain: "혼자 정리하고 깊게 파고드는 시간이 필요한 신호입니다.",
      caution: "고립이 길어지면 실행 속도가 늦어질 수 있습니다.",
    };
  }
  if (label.includes("양인살")) {
    return {
      plain: "버티는 힘과 밀어붙이는 힘이 강해지는 신호입니다.",
      caution: "힘으로 밀기보다 기준을 먼저 세워야 충돌을 줄일 수 있습니다.",
    };
  }

  return {
    plain: `${label}은 대운 해석에서 생활 장면으로만 조심스럽게 참고합니다.`,
    caution: null,
  };
}

function buildMyeongliLayers(input: {
  readonly currentCycle: MajorFortuneCycle;
  readonly dayMaster: HeavenlyStem;
  readonly natalLabels: readonly string[];
  readonly elementEffect: MajorFortuneEvidencePacket["elementEffect"];
  readonly branchInteractions: MajorFortuneEvidencePacket["branchInteractions"];
}): MajorFortuneEvidencePacket["myeongliLayers"] {
  const hiddenStems = hiddenStemsByBranch[input.currentCycle.branch].map((stem) =>
    formatHiddenStem(input.dayMaster, stem),
  );
  const annualStemTenGodsInCycle = Array.from(
    { length: input.currentCycle.endYear - input.currentCycle.startYear + 1 },
    (_, index) => {
      const year = input.currentCycle.startYear + index;
      const annualGanji = getAnnualGanjiInfo(year);
      const tenGod = getTenGodForStemPair(input.dayMaster, annualGanji.stem);

      return {
        year,
        stem: annualGanji.stem,
        tenGod,
        plain: `${year}년 천간 ${annualGanji.stem}은 ${input.dayMaster} 일간에게 ${tenGod}으로 작용해 그해의 행동 방식과 압박 지점을 바꿉니다.`,
      };
    },
  );
  const interactions = input.branchInteractions.map((interaction) => ({
    type: interaction.type,
    plainType: plainTypeByInteraction[interaction.type],
    plain: interaction.plain,
    impactArea: getImpactArea(interaction),
  }));
  const auxiliaryStarsLayer = input.natalLabels
    .filter((label) =>
      /살|귀인|공망|금여록/u.test(label) && !label.includes("백호대살"),
    )
    .slice(0, 8)
    .map((label) => {
      const mapped = getAuxiliaryStarPlain(label);

      return {
        label,
        plain: mapped.plain,
        caution: mapped.caution,
      };
    });

  return {
    tenGodLayer: {
      majorStemTenGod: getTenGodForStemPair(input.dayMaster, input.currentCycle.stem),
      annualStemTenGodsInCycle,
      plain: `${input.currentCycle.ganji} 대운의 천간 ${input.currentCycle.stem}은 ${input.dayMaster} 일간에게 ${getTenGodForStemPair(input.dayMaster, input.currentCycle.stem)}입니다. 대운의 십성은 10년 동안 반복되는 역할과 현실 감각을 봅니다.`,
    },
    elementLayer: {
      majorElements: input.elementEffect.strengthens.map((element) => elementKo[element]),
      fillMissing: input.elementEffect.fillsMissing.map((element) => elementKo[element]),
      overloadHeavy: input.elementEffect.overloadsHeavy.map((element) => elementKo[element]),
      plain: input.elementEffect.plain,
    },
    branchInteractionLayer: {
      interactions,
      plain:
        interactions.length === 0
          ? "대운 지지가 원국 지지와 크게 부딪히거나 묶이는 신호는 약합니다."
          : "대운 지지는 원국의 지지와 맞물리며 일, 관계, 생활 리듬의 장기 배치를 바꿉니다.",
    },
    hiddenStemLayer: {
      majorBranchHiddenStems: hiddenStems,
      plain: `${input.currentCycle.branch} 지장간은 ${hiddenStems.join("·")}입니다. 겉으로는 ${elementKo[input.currentCycle.branchElement]}이지만 안쪽에는 숨은 십성이 섞여 있어 현실 책임 안에 돈, 방향, 회복 이슈가 같이 들어옵니다.`,
    },
    twelveStageLayer: null,
    auxiliaryStarsLayer,
  };
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
  const tenGodTheme =
    input.majorTenGod === "편재" || input.majorTenGod === "정재"
      ? {
          label: "돈과 자원 운용",
          metaphor: "흩어진 자원과 계약을 실제 판으로 묶는 테마",
          plain: `${input.majorTenGod} 대운은 ${field}에서 돈, 자원, 계약, 현실 기반, 외부 프로젝트, 비용 구조를 장기적으로 다루는 힘을 키웁니다.`,
          concreteImplications: [
            "수익 자체보다 어떤 자원을 어디에 쓰고 어떤 계약을 줄일지 정하는 장면이 반복될 수 있습니다.",
            "외부 프로젝트, 거래, 정산, 비용 구조처럼 돈이 움직이는 접점이 커질 수 있습니다.",
          ],
          strategy:
            "돈이 움직이는 접점은 열어 두되 계약, 정산, 비용 기준은 숫자로 먼저 고정하세요.",
        }
      : input.majorTenGod === "편관" || input.majorTenGod === "정관"
        ? {
            label: "규칙과 책임 검증",
            metaphor: "흩어진 역할을 평가 가능한 공식 기준으로 바꾸는 테마",
            plain: `${input.majorTenGod} 대운은 ${field}에서 직장 질서, 책임 검증, 평가, 규칙, 역할 검증이 장기 과제로 들어오는 배경입니다.`,
            concreteImplications: [
              "권한보다 책임과 평가 기준이 먼저 들어오며 역할을 증명해야 하는 장면이 반복될 수 있습니다.",
              "승진 단정보다 보고 체계, 규정, 평가표, 공식 책임의 언어를 익히는 것이 중요합니다.",
            ],
            strategy:
              "규칙과 평가를 피하기보다 책임 범위와 검증 기준을 공식 문서로 남기세요.",
          }
        : input.majorTenGod === "식신" || input.majorTenGod === "상관"
          ? {
              label: "결과물과 표현 확장",
              metaphor: "머릿속 생각을 공개된 결과물로 꺼내는 테마",
              plain: `${input.majorTenGod} 대운은 ${field}에서 결과물, 표현, 포트폴리오, 콘텐츠, 말과 성과, 공개된 결과가 장기적으로 중요해지는 배경입니다.`,
              concreteImplications: [
                "기획이나 생각만으로 끝내기보다 밖에서 확인 가능한 산출물을 쌓아야 흐름을 쓸 수 있습니다.",
                "발표, 콘텐츠, 포트폴리오, 실적 기록처럼 보이는 결과가 반복 과제가 됩니다.",
              ],
              strategy:
                "아이디어보다 공개 가능한 결과물 단위로 쪼개고, 포트폴리오와 기록을 꾸준히 남기세요.",
            }
          : input.majorTenGod === "편인" || input.majorTenGod === "정인"
            ? {
                label: "공부와 회복 기반",
                metaphor: "흩어진 경험을 지식과 문서 기반으로 다시 저장하는 테마",
                plain: `${input.majorTenGod} 대운은 ${field}에서 공부, 자격증, 문서, 회복, 재정비, 지식 축적을 장기 기반으로 삼게 합니다.`,
                concreteImplications: [
                  "바로 확장하기보다 자격, 자료, 문서, 멘토링, 회복 루틴을 쌓는 장면이 반복될 수 있습니다.",
                  "공부와 쉼이 늦어지면 판단이 흐려지므로 재정비 시간을 구조 안에 넣어야 합니다.",
                ],
                strategy:
                  "무리한 확장보다 공부, 자격증, 회복 루틴, 문서 기반을 먼저 보강하세요.",
              }
            : {
                label: "자기 기준과 협업 경계",
                metaphor: "내 방식과 사람 사이의 경계를 다시 그리는 테마",
                plain: `${input.majorTenGod} 대운은 ${field}에서 경쟁, 자기 기준, 동료, 독립성, 협업과 충돌이 장기적으로 드러나는 배경입니다.`,
                concreteImplications: [
                  "혼자 밀어야 하는 일과 사람과 나눠야 하는 일이 자주 충돌할 수 있습니다.",
                  "독립성과 협업의 균형을 잡지 못하면 동료, 친구, 경쟁자와의 경계가 흐려질 수 있습니다.",
                ],
                strategy:
                  "내 기준으로 밀 일과 협업할 일을 분리하고, 역할과 보상 기준을 먼저 합의하세요.",
              };

  return [
    tenGodTheme,
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
  type StrongYearLikelyArea =
    MajorFortuneEvidencePacket["strongYearsWithinCycle"][number]["likelyArea"];

  function getLikelyArea(params: {
    readonly annualTenGod: TenGod;
    readonly interactions: readonly AnnualBranchInteraction[];
  }): StrongYearLikelyArea {
    if (params.annualTenGod === "편재" || params.annualTenGod === "정재") {
      return "돈·외부기회";
    }
    if (params.annualTenGod === "식신" || params.annualTenGod === "상관") {
      return "일·성과";
    }
    if (
      (params.annualTenGod === "편관" || params.annualTenGod === "정관") &&
      params.interactions.some((interaction) => interaction.type === "충")
    ) {
      return "전환";
    }
    if (params.annualTenGod === "편관" || params.annualTenGod === "정관") {
      return "일·성과";
    }
    if (params.annualTenGod === "편인" || params.annualTenGod === "정인") {
      return "학업·자격증";
    }
    if (params.annualTenGod === "비견" || params.annualTenGod === "겁재") {
      return "관계";
    }
    if (
      params.interactions.some((interaction) =>
        ["형", "해", "파"].includes(interaction.type),
      )
    ) {
      return "몸·생활";
    }

    return "일·성과";
  }

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
      const annualTenGod = getTenGodForStemPair(input.dayMaster, annualGanji.stem);
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

      const likelyArea = getLikelyArea({
        annualTenGod,
        interactions,
      });
      const area =
        likelyArea === "돈·외부기회"
          ? "돈·현실"
          : likelyArea === "관계" || likelyArea === "연애·가족"
            ? "관계·생활 리듬"
            : likelyArea === "몸·생활"
              ? "몸·생활 리듬"
              : likelyArea;
      const headline =
        year === input.currentCycle.startYear
          ? "대운이 바뀌며 현실 구조를 새로 까는 해"
          : annualTenGod === input.majorTenGod
            ? `${input.majorTenGod} 테마가 강하게 겹치는 해`
            : interactions.some((interaction) => interaction.type === "충")
              ? "이미 깔린 구조와 새 책임이 부딪히는 해"
              : "대운의 장기 테마가 선명해지는 해";
      const pushStrategy =
        year === input.currentCycle.startYear
          ? "프로젝트 기준, 문서화, 포트폴리오, 운영 체계"
          : annualTenGod === "상관"
            ? "발표, 결과물, 서비스 개선안, 눈에 보이는 산출물"
            : annualTenGod === "식신"
              ? "결과물, 포트폴리오, 콘텐츠, 반복 생산 루틴"
              : annualTenGod === "편재"
                ? "외부 프로젝트, 계약, 부업성 수익, 자원 배치"
                : annualTenGod === "정재"
                  ? "고정비 절감, 정산, 계약 안정화, 현금흐름 관리"
                  : likelyArea === "돈·외부기회"
          ? "외부 프로젝트, 계약, 정산 기준, 비용 구조 단순화"
          : likelyArea === "관계" || likelyArea === "연애·가족"
            ? "역할 조율, 연락 방식 정리, 가족·동료와의 일정 합의"
            : likelyArea === "학업·자격증"
              ? "자격증, 문서 기반 공부, 포트폴리오, 재정비 루틴"
              : likelyArea === "몸·생활"
                ? "수면, 식사, 회복 시간, 일정 과밀 완화"
                : likelyArea === "전환"
                  ? "직장 구조, 역할 경계, 계약 조건, 생활 루틴 재배치"
            : "프로젝트 기준, 문서화, 포트폴리오, 운영 체계";
      const reduceStrategy =
        year === input.currentCycle.startYear
          ? "권한 없는 책임, 끝없는 일정 추가, 기록 없는 구두 지시"
          : annualTenGod === "상관"
            ? "과로, 즉흥적 말싸움, 회복 없는 마감"
            : annualTenGod === "식신"
              ? "완성 없이 벌리는 산출물, 보여주기식 실행"
              : annualTenGod === "편재"
                ? "감으로 하는 투자, 애매한 돈거래, 구두 약속"
                : annualTenGod === "정재"
                  ? "과도한 보수성, 검토만 하다 놓치는 기회"
                  : likelyArea === "돈·외부기회"
          ? "감으로 하는 투자, 애매한 돈거래, 구두 약속"
          : likelyArea === "관계" || likelyArea === "연애·가족"
            ? "말하지 않은 기대, 무리한 대신 처리, 애매한 약속"
            : likelyArea === "학업·자격증"
              ? "공부만 길어지고 결과물이 남지 않는 방식"
              : likelyArea === "몸·생활"
                ? "수면을 줄이는 몰아치기, 식사 누락, 회복 없는 일정"
                : likelyArea === "전환"
                  ? "권한 없는 책임 확대, 충돌을 미루는 결정, 조건 없는 수락"
            : "권한 없는 책임, 끝없는 일정 추가, 기록 없는 구두 지시";

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
        headline,
        whyStrong: reasons.join(" / "),
        likelyArea,
        pushStrategy,
        reduceStrategy,
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

function buildTimelineRowCopy(params: {
  readonly year: number;
  readonly annualGanji: string;
  readonly annualTenGod: TenGod;
  readonly currentCycle: MajorFortuneCycle;
  readonly keyInteraction?: AnnualBranchInteraction;
  readonly hasCaution: boolean;
}): { readonly oneLine: string; readonly strategy: string } {
  const prefix = `${params.year}년 ${params.annualGanji}:`;

  if (params.currentCycle.ganji === "戊辰") {
    if (params.year === 2026) {
      return {
        oneLine:
          `${prefix} 새 대운의 문이 열리고 세운 丙午가 속도와 노출을 올립니다. 일을 벌리기 전 책임 범위를 좁혀야 첫해의 압박이 덜 쌓입니다.`,
        strategy:
          "새 역할을 바로 떠안기보다 담당 범위, 비용 기준, 보고 라인을 먼저 작게 고정하세요.",
      };
    }
    if (params.year === 2027) {
      return {
        oneLine:
          `${prefix} 상관 흐름이 들어와 결과물, 표현, 성과 압박이 빨라질 수 있습니다. 말과 산출물이 빨라지는 대신 체력과 일정이 같이 눌릴 수 있습니다.`,
        strategy:
          "발표, 보고, 결과물은 속도를 내되 수면과 마감 여유를 먼저 확보하세요.",
      };
    }
    if (params.year === 2028) {
      return {
        oneLine:
          `${prefix} 대운 戊와 세운 戊가 겹치는 편재 강화 해입니다. 외부 프로젝트, 계약, 부업성 수익, 자원 이동 접점이 커질 수 있습니다.`,
        strategy:
          "밀어볼 것은 외부 프로젝트와 계약이고, 줄일 것은 감으로 하는 투자와 구두 돈거래입니다.",
      };
    }
    if (params.year === 2029) {
      return {
        oneLine:
          `${prefix} 정재 흐름이라 수입, 지출, 정산, 고정비를 숫자로 정리하기 좋습니다. 안정적 관리에는 유리하지만 과도한 보수성은 기회를 줄일 수 있습니다.`,
        strategy:
          "월별 고정비와 정산 기준은 세밀하게 잡고, 검증된 기회는 너무 늦게 닫지 마세요.",
      };
    }
    if (params.year === 2030) {
      return {
        oneLine:
          `${prefix} 辰戌 충이 강해져 기존 구조와 새 책임이 부딪히는 해입니다. 직장 구조, 관계 역할, 생활 루틴의 재배치가 크게 체감될 수 있습니다.`,
        strategy:
          "충돌을 미루지 말고 역할, 계약, 거주·생활 루틴의 재배치안을 먼저 써 보세요.",
      };
    }
    if (params.year === 2031) {
      return {
        oneLine:
          `${prefix} 정관 흐름이라 규칙, 평가, 직장 질서, 책임 검증이 강해질 수 있습니다. 커리어 기준을 공식화하기 좋은 해입니다.`,
        strategy:
          "업무 기준, 평가 근거, 직무 설명을 문서화해 내 역할을 공식 언어로 남기세요.",
      };
    }
    if (params.year === 2032) {
      return {
        oneLine:
          `${prefix} 편인 흐름이라 공부, 회복, 방향 재검토, 내면 정리가 중요해집니다. 무리한 확장보다 재정비가 유리합니다.`,
        strategy:
          "새 판을 벌리기보다 공부, 회복, 포트폴리오 정리로 다음 선택의 근거를 만드세요.",
      };
    }
    if (params.year === 2033) {
      return {
        oneLine:
          `${prefix} 정인 흐름에 토 압박이 겹쳐 안정과 회복을 원하지만 현실 부담도 같이 커질 수 있습니다. 자격증, 문서, 기반 정리에 유리합니다.`,
        strategy:
          "자격증, 계약 문서, 업무 매뉴얼처럼 오래 남는 기반을 정리하고 과로 루틴은 줄이세요.",
      };
    }
    if (params.year === 2034) {
      return {
        oneLine:
          `${prefix} 비견 흐름으로 자기 기준이 다시 강해집니다. 독립성, 자기 방향, 경쟁심이 올라가며 남의 기준을 그대로 따르기 어려워질 수 있습니다.`,
        strategy:
          "독립적으로 밀 영역과 협업해야 할 영역을 나눠 불필요한 경쟁을 줄이세요.",
      };
    }
    if (params.year === 2035) {
      return {
        oneLine:
          `${prefix} 겁재 흐름으로 다음 대운 전 관계, 돈, 역할 경계를 정리해야 합니다. 사람과 돈이 섞이면 피로가 커질 수 있습니다.`,
        strategy:
          "돈거래, 역할 분담, 관계 기대치를 정리하고 다음 대운에 가져갈 사람과 기준만 남기세요.",
      };
    }
  }

  if (params.annualTenGod === "편재" || params.annualTenGod === "정재") {
    return {
      oneLine:
        `${prefix} ${params.annualTenGod} 흐름이 강해져 돈, 계약, 정산, 자원 이동을 현실적으로 다루는 해입니다.`,
      strategy:
        "수익 접점은 열어 두되 투자, 계약, 정산 조건은 숫자로 먼저 고정하세요.",
    };
  }
  if (params.annualTenGod === "식신" || params.annualTenGod === "상관") {
    return {
      oneLine:
        `${prefix} ${params.annualTenGod} 흐름으로 결과물, 표현, 발표, 생산성이 밖으로 드러나는 해입니다.`,
      strategy:
        "아이디어보다 눈에 보이는 결과물, 보고서, 포트폴리오 단위로 남기세요.",
    };
  }
  if (params.annualTenGod === "편관" || params.annualTenGod === "정관") {
    return {
      oneLine:
        `${prefix} ${params.annualTenGod} 흐름으로 규칙, 평가, 책임 검증이 강해질 수 있는 해입니다.`,
      strategy:
        "직장 질서와 평가 기준을 감으로 넘기지 말고 공식 기록으로 남기세요.",
    };
  }
  if (params.annualTenGod === "편인" || params.annualTenGod === "정인") {
    return {
      oneLine:
        `${prefix} ${params.annualTenGod} 흐름으로 공부, 회복, 자료 정리, 방향 재검토가 중요해지는 해입니다.`,
      strategy:
        "무리한 확장보다 자격증, 공부, 회복 루틴, 문서 기반을 보강하세요.",
    };
  }

  return {
    oneLine:
      `${prefix} ${params.annualTenGod} 흐름으로 자기 기준과 사람 사이의 균형을 다시 맞추는 해입니다.`,
    strategy:
      "독립적으로 밀어야 할 일과 사람과 나눠야 할 일을 분리하세요.",
  };
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
          ? `${input.currentCycle.ganji} 대운의 ${elementKo[input.currentCycle.branchElement]} 책임이 ${annualGanji.ganji} 세운에서도 구체화됨`
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

function buildMajorFortuneTimelineRows(input: {
  readonly currentYear: number;
  readonly currentAge: number;
  readonly currentCycle: MajorFortuneCycle;
  readonly dayMaster: HeavenlyStem;
  readonly natalBranches: readonly EarthlyBranch[];
  readonly strongYears: MajorFortuneEvidencePacket["strongYearsWithinCycle"];
}): MajorFortuneEvidencePacket["majorFortuneTimelineRows"] {
  const strongYearSet = new Set(input.strongYears.map((year) => year.year));

  return Array.from(
    { length: input.currentCycle.endYear - input.currentCycle.startYear + 1 },
    (_, index) => {
      const year = input.currentCycle.startYear + index;
      const yearIndexInCycle = index + 1;
      const annualGanji = getAnnualGanjiInfo(year);
      const annualTenGod = getTenGodForStemPair(input.dayMaster, annualGanji.stem);
      const interactions = getAnnualBranchInteractions({
        annualBranch: annualGanji.branch,
        natalBranches: [input.currentCycle.branch, ...input.natalBranches],
      });
      const keyInteraction = interactions[0];
      const phase = getCycleYearPhase(yearIndexInCycle);
      const isCurrentYear = year === input.currentYear;
      const isCycleStartYear = year === input.currentCycle.startYear;
      const isCycleEndYear = year === input.currentCycle.endYear;
      const isStrongYear = strongYearSet.has(year);
      const hasCaution = interactions.some((interaction) =>
        ["충", "형", "파", "해"].includes(interaction.type),
      );
      const badges = [
        isCurrentYear ? "올해" : undefined,
        isCycleStartYear ? "전환" : undefined,
        isStrongYear ? "강함" : undefined,
        hasCaution ? "주의" : undefined,
        isCycleEndYear ? "정리" : undefined,
      ].filter(
        (
          badge,
        ): badge is "올해" | "전환" | "강함" | "주의" | "정리" =>
          badge !== undefined,
      );
      const keyInteractionLabel =
        keyInteraction === undefined
          ? null
          : `${keyInteraction.type}: ${plainTypeByInteraction[keyInteraction.type]}`;
      const rowCopy = buildTimelineRowCopy({
        year,
        annualGanji: annualGanji.ganji,
        annualTenGod,
        currentCycle: input.currentCycle,
        keyInteraction,
        hasCaution,
      });

      return {
        year,
        ageLabel: `${input.currentAge + (year - input.currentYear)}세`,
        ageBasisLabel: "대운표 기준 나이",
        yearIndexInCycle,
        phase,
        isCurrentYear,
        isCycleStartYear,
        isCycleEndYear,
        badges,
        majorGanji: input.currentCycle.ganji,
        annualGanji: annualGanji.ganji,
        annualTenGodLabel: annualTenGod,
        keyInteractionLabel,
        oneLine: rowCopy.oneLine,
        strategy: rowCopy.strategy,
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

export interface MajorFortuneEvidenceMatrixQualitySummary {
  readonly matrixSimilarityWarnings: number;
  readonly fixtureLeakageWarnings: number;
  readonly relationshipHintWarnings: number;
  readonly likelyAreaDiversityWarnings: number;
  readonly technicalTermLeakageWarnings: number;
}

function countDuplicateValues(values: readonly string[], limit: number): number {
  const counts = new Map<string, number>();

  for (const value of values) {
    const normalized = value.trim();

    if (normalized.length === 0) {
      continue;
    }
    counts.set(normalized, (counts.get(normalized) ?? 0) + 1);
  }

  return [...counts.values()].filter((count) => count > limit).length;
}

function collectMajorFortuneEvidenceVisibleText(
  evidence: MajorFortuneEvidencePacket,
): readonly string[] {
  return [
    evidence.personLabel,
    evidence.majorCycleBasis.displayLabel,
    evidence.majorCycleBasis.explanation,
    evidence.cyclePosition.positionLabel,
    evidence.cyclePosition.progressLabel,
    evidence.calculationBasis.displayLabel,
    evidence.calculationBasis.explanation,
    evidence.calculationBasis.ageBasisLabel,
    evidence.calculationBasis.note,
    evidence.majorTenGod.plain,
    evidence.elementEffect.plain,
    ...evidence.branchInteractions.map((interaction) => interaction.plain),
    ...evidence.lifeAreaSignals.map((signal) => signal.plain),
    ...evidence.difficultySignals.map((signal) => signal.plain),
    ...evidence.opportunitySignals.map((signal) => signal.plain),
    ...evidence.transitionSignals.map((signal) => signal.plain),
    evidence.previousToCurrentShift.plain,
    ...evidence.previousToCurrentShift.whatChanged,
    evidence.decadeArchetype.label,
    evidence.decadeArchetype.metaphor,
    evidence.decadeArchetype.plain,
    ...evidence.strategicThemes.flatMap((theme) => [
      theme.label,
      theme.metaphor,
      theme.plain,
      theme.strategy,
      ...theme.concreteImplications,
    ]),
    ...evidence.longRangeRisks.flatMap((risk) => [
      risk.label,
      risk.plain,
      risk.prevention,
    ]),
    ...evidence.longRangeOpportunities.flatMap((opportunity) => [
      opportunity.label,
      opportunity.plain,
      opportunity.action,
    ]),
    ...evidence.relationshipStatusTranslationHints,
    evidence.lifeStageContext.label,
    evidence.lifeStageContext.plain,
    ...evidence.lifeStageContext.relevantThemes,
    ...evidence.lifeStageContext.suppressedThemes,
    evidence.myeongliLayers.tenGodLayer.plain,
    ...evidence.myeongliLayers.tenGodLayer.annualStemTenGodsInCycle.map(
      (item) => item.plain,
    ),
    evidence.myeongliLayers.elementLayer.plain,
    evidence.myeongliLayers.branchInteractionLayer.plain,
    ...evidence.myeongliLayers.branchInteractionLayer.interactions.flatMap(
      (interaction) => [interaction.plainType, interaction.plain],
    ),
    evidence.myeongliLayers.hiddenStemLayer.plain,
    ...evidence.myeongliLayers.auxiliaryStarsLayer.flatMap((star) => [
      star.label,
      star.plain,
      star.caution ?? "",
    ]),
    ...evidence.strongYearsWithinCycle.flatMap((year) => [
      year.reason,
      year.area,
      year.action,
      year.headline,
      year.whyStrong,
      year.likelyArea,
      year.pushStrategy,
      year.reduceStrategy,
    ]),
    ...evidence.majorFortuneTimelineRows.flatMap((row) => [
      row.ageLabel ?? "",
      row.ageBasisLabel ?? "",
      row.annualTenGodLabel,
      row.keyInteractionLabel ?? "",
      row.oneLine,
      row.strategy,
    ]),
    ...evidence.cycleYearTimeline.flatMap((year) => [
      year.headline,
      year.annualElementFocus,
      year.roleOfYearInCycle,
      year.plainInterpretation,
      year.strategicFocus,
      year.whyItMatters,
    ]),
  ];
}

function hasRelationshipHintProblem(
  evidence: MajorFortuneEvidencePacket,
): boolean {
  const text = evidence.relationshipStatusTranslationHints.join("\n");
  const status = evidence.userContext.relationshipStatus ?? "unknown";

  if (status === "unknown") {
    return !/(생활 반경|연락 방식|역할 분담|현실 접점)/u.test(text);
  }
  if (status === "single") {
    return !/(일|스터디|커뮤니티|소개|생활 반경)/u.test(text);
  }
  if (status === "dating") {
    return !/(일정|연락|생활 균형|생활 리듬)/u.test(text);
  }
  if (status === "married") {
    return !/(가족|배우자|분담|생활비)/u.test(text);
  }

  return !/(미입력|단정하지)/u.test(text);
}

export function summarizeMajorFortuneEvidenceMatrixQuality(
  evidencePackets: readonly MajorFortuneEvidencePacket[],
): MajorFortuneEvidenceMatrixQualitySummary {
  const timelineLines = evidencePackets.flatMap((evidence) =>
    evidence.majorFortuneTimelineRows.map((row) => row.oneLine),
  );
  const allVisibleText = evidencePackets
    .flatMap(collectMajorFortuneEvidenceVisibleText)
    .join("\n");
  const nonDeokminVisibleText = evidencePackets
    .filter((evidence) => evidence.personLabel !== "덕민")
    .flatMap(collectMajorFortuneEvidenceVisibleText)
    .join("\n");
  const likelyAreas = new Set(
    evidencePackets.flatMap((evidence) =>
      evidence.strongYearsWithinCycle.map((year) => year.likelyArea),
    ),
  );

  return {
    matrixSimilarityWarnings: countDuplicateValues(timelineLines, 2),
    fixtureLeakageWarnings: /덕민|개발·서비스 기획/u.test(nonDeokminVisibleText)
      ? 1
      : 0,
    relationshipHintWarnings: evidencePackets.filter(hasRelationshipHintProblem)
      .length,
    likelyAreaDiversityWarnings: likelyAreas.size < 3 ? 1 : 0,
    technicalTermLeakageWarnings: /백호대살|diagnostic-only|진단용|debug|evidence/u.test(
      allVisibleText,
    )
      ? 1
      : 0,
  };
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
  const lifeStageContext = buildLifeStageContext({
    currentAge,
    currentCycle: cycleAccess.currentCycle,
    userContext: input.person.userContext,
  });
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
  const strongYearsWithinCycle = buildStrongYearsWithinCycle({
    currentCycle: cycleAccess.currentCycle,
    dayMaster,
    majorTenGod,
    natalBranches,
    elementEffect,
  });
  const myeongliLayers = buildMyeongliLayers({
    currentCycle: cycleAccess.currentCycle,
    dayMaster,
    natalLabels: input.person.labels,
    elementEffect,
    branchInteractions,
  });
  const majorFortuneTimelineRows = buildMajorFortuneTimelineRows({
    currentYear: input.currentYear,
    currentAge,
    currentCycle: cycleAccess.currentCycle,
    dayMaster,
    natalBranches,
    strongYears: strongYearsWithinCycle,
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
    lifeStageContext,
    myeongliLayers,
    strongYearsWithinCycle,
    majorFortuneTimelineRows,
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
