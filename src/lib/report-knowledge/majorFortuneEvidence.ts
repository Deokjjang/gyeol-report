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
  MajorFortuneCycle,
  MajorFortuneEvidencePacket,
  MajorFortuneSignal,
} from "./majorFortuneTypes";
import type { UserContextProfile } from "./userContextTypes";

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
  readonly majorFortuneCycleBasis?: "fixture_precomputed";
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
        reasons.push("대운 오행을 반복하거나 강화");
      }
      if (
        getTenGodForStemPair(input.dayMaster, annualGanji.stem) ===
        input.majorTenGod
      ) {
        reasons.push(`대운 천간 십성 ${input.majorTenGod} 흐름 반복`);
      }
      if (annualGanji.branch === input.currentCycle.branch) {
        reasons.push("대운 지지와 같은 지지가 들어옴");
      }
      if (
        getAnnualBranchInteractions({
          annualBranch: annualGanji.branch,
          natalBranches: [input.currentCycle.branch, ...input.natalBranches],
        }).length > 0
      ) {
        reasons.push("대운 지지 또는 원국 지지와 강한 지지 작용");
      }

      return {
        year,
        ganji: annualGanji.ganji,
        reason: reasons.join(" / "),
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
          ? "대운 오행을 반복하거나 강화"
          : undefined,
        annualTenGod === input.majorTenGod
          ? `대운 십성 ${input.majorTenGod} 테마 반복`
          : undefined,
        interactions.length > 0
          ? "대운 지지 또는 원국 지지와 강한 작용"
          : undefined,
      ].filter((part): part is string => part !== undefined);
      const phase = getCycleYearPhase(yearIndexInCycle);
      const phaseText =
        phase === "early" ? "진입과 적응" : phase === "middle" ? "반복과 고착" : "정리와 전환";
      const relationToMajorCycle =
        relationParts.length === 0 ? "대운 배경을 완만하게 통과" : relationParts.join(" / ");

      return {
        year,
        ganji: annualGanji.ganji,
        yearIndexInCycle,
        phase,
        headline: `${phaseText}의 ${yearIndexInCycle}년차`,
        annualElementFocus: `${elementKo[annualGanji.stemElement]}·${elementKo[annualGanji.branchElement]}`,
        relationToMajorCycle,
        plain: `${year}년 ${annualGanji.ganji}은 ${input.currentCycle.ganji} 대운의 ${yearIndexInCycle}년차로, ${relationToMajorCycle} 흐름을 봅니다.`,
      };
    },
  );
}

function buildCalculationBasis(
  currentYear: number,
): MajorFortuneEvidencePacket["calculationBasis"] {
  return {
    basisType: "precomputed_major_fortune_table",
    displayLabel: "사전 계산된 대운표 기준",
    explanation:
      "이 대운 구간은 입력된 만세력의 대운표를 기준으로 잡았습니다.",
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
    input.cycleBasis === "fixture_precomputed"
      ? "major fortune cycles use fixture_precomputed basis; exact start-age algorithm is not implemented in DAEUN-01"
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
    calculationBasis: buildCalculationBasis(input.currentYear),
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
    strongYearsWithinCycle: buildStrongYearsWithinCycle({
      currentCycle: cycleAccess.currentCycle,
      dayMaster,
      majorTenGod,
      natalBranches,
    }),
    cycleYearTimeline: buildCycleYearTimeline({
      currentCycle: cycleAccess.currentCycle,
      dayMaster,
      majorTenGod,
      natalBranches,
    }),
    warnings: buildWarnings({
      labels: input.person.labels,
      cycleBasis: input.person.majorFortuneCycleBasis,
    }),
  };
}
