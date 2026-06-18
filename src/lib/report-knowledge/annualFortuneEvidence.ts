import type {
  AnnualBranchInteraction,
  AnnualFortuneMode,
  AnnualFortuneYearAccess,
  AnnualGanjiInfo,
  AnnualMonthGanjiInfo,
  EarthlyBranch,
  FiveElement,
  HeavenlyStem,
  TenGod,
} from "./annualFortuneTypes";
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
  readonly targetYear: number;
  readonly currentDate: string;
  readonly mode: AnnualFortuneMode;
  readonly yearAccess: AnnualFortuneYearAccess;
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

  return {
    productType: "annual_fortune",
    productVersion: "v1",
    targetYear: input.targetYear,
    currentDate: formatDateOnly(input.currentDate),
    mode: yearAccess.mode,
    yearAccess,
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
    lifeAreaSignals: buildLifeAreaSignals({
      stemTenGod,
      elementEffect,
      branchInteractions,
    }),
    difficultySignals: buildDifficultySignals({
      missingElements,
      stemTenGod,
      elementEffect,
      branchInteractions,
    }),
    opportunitySignals: buildOpportunitySignals({
      stemTenGod,
      elementEffect,
      branchInteractions,
    }),
    monthlyFortuneSeeds: buildMonthlyFortuneSeeds({
      targetYear: input.targetYear,
      missingElements,
      heavyElements,
      natalBranches,
    }),
    warnings: buildWarnings(input.person.labels),
  };
}
