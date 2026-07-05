import type {
  EarthlyBranch,
  HeavenlyStem,
  TenGod,
} from "./annualFortuneTypes";
import {
  buildMyeongliMbtiBridgePacket,
  buildProductBridgeEvidence,
  type MyeongliSignal,
} from "./bridge";
import {
  getMbtiReportUseCase,
  getMbtiTraitArea,
  type MbtiSourceTraitItem,
} from "./mbti";
import type {
  LoveMarriageChildBridgeEvidence,
  LoveMarriageChildFullPillarEvidence,
  LoveMarriageChildGender,
  LoveMarriageChildMbtiTraitEvidence,
  LoveMarriageChildReportEvidencePacket,
  LoveMarriageChildSajuSignal,
  LoveMarriageChildSignalStrength,
  LoveMarriageChildSignalTone,
  LoveMarriageChildSpousePalaceSignal,
  LoveMarriageChildTenGodSignal,
} from "./loveMarriageChildReportTypes";
import {
  LOVE_MARRIAGE_CHILD_FORBIDDEN_EXPRESSIONS,
} from "./loveMarriageChildReportTypes";
import type { UserRelationshipStatus } from "./userContextTypes";

export interface LoveMarriageChildSajuEvidenceInput {
  readonly dayMaster?: HeavenlyStem;
  readonly dayPillar: string;
  readonly dayBranch?: EarthlyBranch;
  readonly fullPillars?: readonly LoveMarriageChildFullPillarEvidence[];
  readonly labels?: readonly string[];
  readonly tenGods?: readonly TenGod[];
  readonly sinsal?: readonly string[];
  readonly gwiin?: readonly string[];
  readonly interactions?: readonly string[];
}

export interface BuildLoveMarriageChildReportEvidenceInput {
  readonly name: string;
  readonly gender?: LoveMarriageChildGender | null;
  readonly mbtiType?: string | null;
  readonly relationshipStatus?: UserRelationshipStatus | null;
  readonly saju: LoveMarriageChildSajuEvidenceInput;
}

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

const earthlyBranches = [
  "子",
  "丑",
  "寅",
  "卯",
  "辰",
  "巳",
  "午",
  "未",
  "申",
  "酉",
  "戌",
  "亥",
] as const satisfies readonly EarthlyBranch[];

const tenGods = [
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

const wealthGods = ["편재", "정재"] as const satisfies readonly TenGod[];
const officerGods = ["편관", "정관"] as const satisfies readonly TenGod[];
const outputGods = ["식신", "상관"] as const satisfies readonly TenGod[];
const resourceGods = ["편인", "정인"] as const satisfies readonly TenGod[];
const peerGods = ["비견", "겁재"] as const satisfies readonly TenGod[];

const defaultSafetyNotes = [
  "이 리포트는 확정 결혼, 이별, 이혼을 예언하지 않습니다.",
  "배우자복이나 자식복을 낙인처럼 단정하지 않습니다.",
  "임신, 출산, 건강 관련 진단이나 예측을 제공하지 않습니다.",
  "이별·재회 고민은 상대의 미래가 아니라 내 반복 패턴과 감정 처리까지만 다룹니다.",
  "자녀 파트는 실제 자녀의 사주나 MBTI가 아니라 내가 부모가 되었을 때의 역할 방식을 다룹니다.",
] as const;

export function buildLoveMarriageChildReportEvidence(
  input: BuildLoveMarriageChildReportEvidenceInput,
): LoveMarriageChildReportEvidencePacket {
  const dayMaster = input.saju.dayMaster ?? parseDayMaster(input.saju.dayPillar);
  const dayBranch = input.saju.dayBranch ?? parseDayBranch(input.saju.dayPillar);
  const fullPillars = normalizeFullPillars(input.saju.fullPillars ?? []);
  const labels = uniqueValues([
    ...(input.saju.labels ?? []),
    ...(input.saju.sinsal ?? []),
    ...(input.saju.gwiin ?? []),
    ...(input.saju.interactions ?? []),
    ...fullPillars.flatMap((pillar) => [
      pillar.stemTenGod ?? "",
      pillar.branchTenGod ?? "",
      ...(pillar.sinsal ?? []),
      ...(pillar.gwiin ?? []),
      ...(pillar.interactions ?? []),
    ]),
  ]);
  const activeTenGods = collectTenGods(input.saju, labels);
  const spousePalaceSignal = buildSpousePalaceSignal({
    dayBranch,
    dayPillar: input.saju.dayPillar,
  });
  const loveTenGodSignals = buildTenGodSignals(activeTenGods, "love");
  const marriageTenGodSignals = buildTenGodSignals(activeTenGods, "marriage");
  const parentingTenGodSignals = buildTenGodSignals(activeTenGods, "parenting");
  const attractionSignals = buildAttractionSignals(labels);
  const conflictSignals = buildConflictSignals(labels);
  const supportSignals = buildSupportSignals(labels);
  const relationInteractionSignals = buildRelationInteractionSignals(
    labels,
    fullPillars,
  );
  const myeongliSignals = buildBridgeSignals({
    dayMaster,
    dayPillar: input.saju.dayPillar,
    spousePalaceSignal,
    loveTenGodSignals,
    marriageTenGodSignals,
    parentingTenGodSignals,
    attractionSignals,
    conflictSignals,
    supportSignals,
    relationInteractionSignals,
  });
  const bridgePacket = buildMyeongliMbtiBridgePacket({
    mbtiType: input.mbtiType,
    productContext: "loveMarriageChild",
    myeongliSignals,
  });
  const bridgeEvidence = buildProductBridgeEvidence(
    bridgePacket,
    "loveMarriageChild",
  ) as LoveMarriageChildBridgeEvidence;

  return {
    productType: "love_marriage_child",
    productVersion: "v1",
    personContext: {
      name: input.name,
      gender: input.gender ?? null,
      mbtiType: input.mbtiType ?? null,
      relationshipStatus: input.relationshipStatus ?? null,
    },
    sajuBasis: {
      dayMaster,
      dayPillar: input.saju.dayPillar,
      dayBranch,
      fullPillars,
      spousePalaceSignal,
      loveTenGodSignals,
      marriageTenGodSignals,
      parentingTenGodSignals,
      attractionSignals,
      conflictSignals,
      supportSignals,
      relationInteractionSignals,
    },
    mbtiBasis: buildMbtiBasis(input.mbtiType),
    bridgeEvidence,
    timingHints: buildTimingHints({
      conflictSignals,
      supportSignals,
      relationInteractionSignals,
    }),
    safetyNotes: [...defaultSafetyNotes],
  };
}

function normalizeFullPillars(
  pillars: readonly LoveMarriageChildFullPillarEvidence[],
): readonly LoveMarriageChildFullPillarEvidence[] {
  const validPillarChars = collectValidPillarChars(pillars);

  return pillars.map((pillar) => ({
    ...pillar,
    hiddenStems: [...(pillar.hiddenStems ?? [])],
    twelveLifeStage: [...(pillar.twelveLifeStage ?? [])],
    twelveSinsal: [...(pillar.twelveSinsal ?? [])],
    sinsal: [...(pillar.sinsal ?? [])],
    gwiin: [...(pillar.gwiin ?? [])],
    interactions: filterInteractionLabelsForPillars(
      pillar.interactions ?? [],
      validPillarChars,
    ),
  }));
}

function collectValidPillarChars(
  pillars: readonly LoveMarriageChildFullPillarEvidence[],
): {
  readonly stems: ReadonlySet<string>;
  readonly branches: ReadonlySet<string>;
} {
  return {
    stems: new Set(pillars.map((pillar) => pillar.stem)),
    branches: new Set(pillars.map((pillar) => pillar.branch)),
  };
}

function filterInteractionLabelsForPillars(
  labels: readonly string[],
  validPillarChars: {
    readonly stems: ReadonlySet<string>;
    readonly branches: ReadonlySet<string>;
  },
): readonly string[] {
  if (
    validPillarChars.stems.size === 0 &&
    validPillarChars.branches.size === 0
  ) {
    return [...labels];
  }

  return labels.filter((label) =>
    isInteractionLabelSupportedByPillars(label, validPillarChars),
  );
}

function isInteractionLabelSupportedByPillars(
  label: string,
  validPillarChars: {
    readonly stems: ReadonlySet<string>;
    readonly branches: ReadonlySet<string>;
  },
): boolean {
  const stemChars = heavenlyStems.filter((stem) => label.includes(stem));
  const branchChars = earthlyBranches.filter((branch) => label.includes(branch));

  return (
    stemChars.every((stem) => validPillarChars.stems.has(stem)) &&
    branchChars.every((branch) => validPillarChars.branches.has(branch))
  );
}

function parseDayMaster(dayPillar: string): HeavenlyStem {
  const stem = dayPillar.trim().slice(0, 1);

  if ((heavenlyStems as readonly string[]).includes(stem)) {
    return stem as HeavenlyStem;
  }

  throw new Error(`Invalid love marriage child day pillar: ${dayPillar}`);
}

function parseDayBranch(dayPillar: string): EarthlyBranch {
  const branch = dayPillar.trim().slice(1, 2);

  if ((earthlyBranches as readonly string[]).includes(branch)) {
    return branch as EarthlyBranch;
  }

  throw new Error(`Invalid love marriage child day branch: ${dayPillar}`);
}

function uniqueValues(values: readonly string[]): readonly string[] {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}

function hasAnyLabel(
  labels: readonly string[],
  aliases: readonly string[],
): boolean {
  return labels.some((label) => aliases.some((alias) => label.includes(alias)));
}

function collectTenGods(
  input: LoveMarriageChildSajuEvidenceInput,
  labels: readonly string[],
): readonly TenGod[] {
  return uniqueValues([
    ...(input.tenGods ?? []),
    ...tenGods.filter((tenGod) => hasAnyLabel(labels, [tenGod])),
  ]).filter((tenGod): tenGod is TenGod =>
    (tenGods as readonly string[]).includes(tenGod),
  );
}

function buildTenGodSignals(
  activeTenGods: readonly TenGod[],
  context: "love" | "marriage" | "parenting",
): readonly LoveMarriageChildTenGodSignal[] {
  return activeTenGods.flatMap((tenGod) => {
    const signal = createTenGodSignal(tenGod, context);

    return signal === null ? [] : [signal];
  });
}

function createTenGodSignal(
  tenGod: TenGod,
  context: "love" | "marriage" | "parenting",
): LoveMarriageChildTenGodSignal | null {
  if ((wealthGods as readonly TenGod[]).includes(tenGod)) {
    return signalForTenGod({
      tenGod,
      label: tenGod,
      tone: "support",
      context,
      plain:
        context === "parenting"
          ? "현실 감각과 자원 배분 기준으로 돌봄 환경을 정리하는 신호입니다."
          : "관계에서 생활 감각, 책임, 돈과 자원 기준을 확인하려는 신호입니다.",
    });
  }

  if ((officerGods as readonly TenGod[]).includes(tenGod)) {
    return signalForTenGod({
      tenGod,
      label: tenGod,
      tone: "mixed",
      context,
      plain:
        context === "love"
          ? "약속, 기준, 책임을 중요하게 보지만 평가가 빨라지면 압박이 커질 수 있습니다."
          : "관계와 가족 역할에서 책임, 질서, 평가 기준을 세우는 신호입니다.",
    });
  }

  if ((outputGods as readonly TenGod[]).includes(tenGod)) {
    return signalForTenGod({
      tenGod,
      label: tenGod,
      tone: "support",
      context,
      plain:
        "마음이 말, 행동, 결과물로 드러나는 방식입니다. 애정 표현과 양육 역할을 실제 행동으로 보여주는 쪽에 가깝습니다.",
    });
  }

  if ((resourceGods as readonly TenGod[]).includes(tenGod)) {
    return signalForTenGod({
      tenGod,
      label: tenGod,
      tone: "support",
      context,
      plain:
        "정서적 안전감, 보호, 배움과 돌봄의 언어를 관계 안에서 중요하게 보는 신호입니다.",
    });
  }

  if ((peerGods as readonly TenGod[]).includes(tenGod)) {
    return signalForTenGod({
      tenGod,
      label: tenGod,
      tone: "mixed",
      context,
      plain:
        "독립성, 동등성, 자존심이 관계에서 강하게 작동합니다. 좋게 쓰면 대등하고, 과하면 경쟁처럼 느껴질 수 있습니다.",
    });
  }

  return null;
}

function signalForTenGod(input: {
  readonly tenGod: TenGod;
  readonly label: string;
  readonly context: "love" | "marriage" | "parenting";
  readonly tone: LoveMarriageChildSignalTone;
  readonly plain: string;
}): LoveMarriageChildTenGodSignal {
  return {
    tenGod: input.tenGod,
    label: input.label,
    plain: input.plain,
    strength: input.context === "love" ? "medium" : "high",
    tone: input.tone,
    basis: `${input.tenGod}이 입력 명리 근거에 포함됩니다.`,
  };
}

function buildSpousePalaceSignal(input: {
  readonly dayBranch: EarthlyBranch;
  readonly dayPillar: string;
}): LoveMarriageChildSpousePalaceSignal {
  return {
    dayBranch: input.dayBranch,
    label: "일지/배우자궁",
    plain:
      "일지는 가까운 관계에서 반복되는 반응과 생활 기준을 보는 자리입니다. 결혼 여부나 배우자복을 단정하지 않고 관계 운영 기준으로만 씁니다.",
    strength: "medium",
    tone: "mixed",
    basis: `${input.dayPillar}의 일지 ${input.dayBranch} 기준`,
  };
}

function buildAttractionSignals(
  labels: readonly string[],
): readonly LoveMarriageChildSajuSignal[] {
  return [
    hasAnyLabel(labels, ["도화", "도화살"])
      ? createSajuSignal({
          label: "도화",
          plain:
            "사람 앞에서 시선이 모이는 방식입니다. 호감과 존재감으로만 해석하고 성적 단정은 하지 않습니다.",
          tone: "support",
          basis: "도화가 입력 명리 근거에 포함됩니다.",
        })
      : null,
    hasAnyLabel(labels, ["홍염", "홍염살"])
      ? createSajuSignal({
          label: "홍염",
          plain:
            "가까워질수록 분위기와 말투가 매력으로 느껴지는 신호입니다. 관계 표현성으로만 다룹니다.",
          tone: "support",
          basis: "홍염이 입력 명리 근거에 포함됩니다.",
        })
      : null,
  ].filter((item): item is LoveMarriageChildSajuSignal => item !== null);
}

function buildConflictSignals(
  labels: readonly string[],
): readonly LoveMarriageChildSajuSignal[] {
  return [
    hasAnyLabel(labels, ["현침", "현침살"])
      ? createSajuSignal({
          label: "현침",
          plain:
            "말과 판단이 날카롭게 나올 수 있어, 관계에서는 피드백 방식과 단어 선택이 갈등의 핵심이 됩니다.",
          tone: "friction",
          basis: "현침이 입력 명리 근거에 포함됩니다.",
        })
      : null,
    hasAnyLabel(labels, ["화개", "화개살"])
      ? createSajuSignal({
          label: "화개",
          plain:
            "혼자 정리하는 시간과 깊이가 필요합니다. 관계에서는 거리감이 아니라 회복 리듬으로 설명해야 합니다.",
          tone: "mixed",
          basis: "화개가 입력 명리 근거에 포함됩니다.",
        })
      : null,
    hasAnyLabel(labels, ["원진", "원진살", "귀문", "귀문관살"])
      ? createSajuSignal({
          label: "미묘한 피로 신호",
          plain:
            "작은 말투와 반응 차이가 오래 남기 쉬워, 감정이 작을 때 바로 이름 붙이는 방식이 필요합니다.",
          tone: "friction",
          basis: "원진/귀문 계열 신호가 입력 명리 근거에 포함됩니다.",
        })
      : null,
  ].filter((item): item is LoveMarriageChildSajuSignal => item !== null);
}

function buildSupportSignals(
  labels: readonly string[],
): readonly LoveMarriageChildSajuSignal[] {
  return [
    hasAnyLabel(labels, ["천을귀인", "월덕귀인", "천덕귀인"])
      ? createSajuSignal({
          label: "귀인",
          plain:
            "관계가 막힐 때 조언자, 완충자, 협업 구조를 통해 부드럽게 풀리는 신호입니다.",
          tone: "support",
          basis: "귀인 신호가 입력 명리 근거에 포함됩니다.",
        })
      : null,
    hasAnyLabel(labels, ["문창귀인", "학당귀인", "태극귀인"])
      ? createSajuSignal({
          label: "배움형 완충",
          plain:
            "감정만으로 풀기보다 대화, 기록, 배움의 방식으로 관계를 정리할 때 안정됩니다.",
          tone: "support",
          basis: "문서·배움 계열 귀인이 입력 명리 근거에 포함됩니다.",
        })
      : null,
  ].filter((item): item is LoveMarriageChildSajuSignal => item !== null);
}

function buildRelationInteractionSignals(
  labels: readonly string[],
  fullPillars: readonly LoveMarriageChildFullPillarEvidence[],
): readonly LoveMarriageChildSajuSignal[] {
  const validPillarChars = collectValidPillarChars(fullPillars);
  const interactionLabels = filterInteractionLabelsForPillars(
    labels.filter((label) =>
      ["합", "충", "형", "파", "해", "원진"].some((keyword) =>
        label.includes(keyword),
      ),
    ),
    validPillarChars,
  );

  return interactionLabels.map((label) =>
    createSajuSignal({
      label,
      plain:
        "관계의 파국이 아니라 생활 기준, 거리, 속도, 말투를 조율해야 하는 지점으로 씁니다.",
      tone: "mixed",
      basis: `${label}이 입력 명리 근거에 포함됩니다.`,
    }),
  );
}

function createSajuSignal(input: {
  readonly label: string;
  readonly plain: string;
  readonly tone: LoveMarriageChildSignalTone;
  readonly strength?: LoveMarriageChildSignalStrength;
  readonly basis?: string;
}): LoveMarriageChildSajuSignal {
  return {
    label: input.label,
    plain: input.plain,
    tone: input.tone,
    strength: input.strength ?? "medium",
    basis: input.basis ?? null,
  };
}

function buildMbtiBasis(
  mbtiType: string | null | undefined,
): LoveMarriageChildReportEvidencePacket["mbtiBasis"] {
  return {
    reportUseCases:
      getMbtiReportUseCase(mbtiType, "loveMarriageChildReport") ?? [],
    loveTraits: getMbtiTraits(mbtiType, "love"),
    marriageTraits: getMbtiTraits(mbtiType, "marriage"),
    parentingTraits: getMbtiTraits(mbtiType, "parenting"),
    childRoleTraits: getMbtiTraits(mbtiType, "child"),
    relationshipTraits: getMbtiTraits(mbtiType, "relationships"),
    communicationTraits: getMbtiTraits(mbtiType, "communication"),
    risks: getMbtiTraits(mbtiType, "risks"),
    growth: getMbtiTraits(mbtiType, "growth"),
  };
}

function getMbtiTraits(
  mbtiType: string | null | undefined,
  area:
    | "love"
    | "marriage"
    | "parenting"
    | "child"
    | "relationships"
    | "communication"
    | "risks"
    | "growth",
): readonly LoveMarriageChildMbtiTraitEvidence[] {
  return (getMbtiTraitArea(mbtiType, area) ?? []).flatMap((trait) => {
    const normalized = normalizeMbtiTrait(trait);

    return normalized === null ? [] : [normalized];
  });
}

function normalizeMbtiTrait(
  trait: MbtiSourceTraitItem,
): LoveMarriageChildMbtiTraitEvidence | null {
  const label = trait.label ?? trait.id ?? null;
  const plain = trait.plainKo ?? trait.strongLine ?? trait.positiveUse ?? null;

  if (label === null || plain === null) {
    return null;
  }

  return {
    id: trait.id ?? null,
    label,
    plain,
    risk: trait.risk ?? null,
    growth: trait.positiveUse ?? null,
  };
}

function buildBridgeSignals(input: {
  readonly dayMaster: HeavenlyStem;
  readonly dayPillar: string;
  readonly spousePalaceSignal: LoveMarriageChildSpousePalaceSignal;
  readonly loveTenGodSignals: readonly LoveMarriageChildTenGodSignal[];
  readonly marriageTenGodSignals: readonly LoveMarriageChildTenGodSignal[];
  readonly parentingTenGodSignals: readonly LoveMarriageChildTenGodSignal[];
  readonly attractionSignals: readonly LoveMarriageChildSajuSignal[];
  readonly conflictSignals: readonly LoveMarriageChildSajuSignal[];
  readonly supportSignals: readonly LoveMarriageChildSajuSignal[];
  readonly relationInteractionSignals: readonly LoveMarriageChildSajuSignal[];
}): readonly MyeongliSignal[] {
  return [
    {
      id: "day_master",
      kind: "pillar",
      label: "일간",
      value: input.dayMaster,
      evidence: `${input.dayPillar} 기준`,
      weight: 1,
    },
    ...[
      ...input.loveTenGodSignals,
      ...input.marriageTenGodSignals,
      ...input.parentingTenGodSignals,
    ].map((signal) => toBridgeSignal(signal, "tenGod")),
    toBridgeSignal(input.spousePalaceSignal, "pillar"),
    ...input.attractionSignals.map((signal) => toBridgeSignal(signal, "shinsal")),
    ...input.conflictSignals.map((signal) => toBridgeSignal(signal, "shinsal")),
    ...input.supportSignals.map((signal) => toBridgeSignal(signal, "gwiin")),
    ...input.relationInteractionSignals.map((signal) =>
      toBridgeSignal(signal, "interaction"),
    ),
  ];
}

function toBridgeSignal(
  signal: LoveMarriageChildSajuSignal,
  kind: MyeongliSignal["kind"],
): MyeongliSignal {
  return {
    id: signal.label,
    kind,
    label: signal.label,
    value: signal.plain,
    evidence: signal.basis ?? undefined,
    weight: signal.strength === "high" ? 1 : 0.7,
  };
}

function buildTimingHints(input: {
  readonly conflictSignals: readonly LoveMarriageChildSajuSignal[];
  readonly supportSignals: readonly LoveMarriageChildSajuSignal[];
  readonly relationInteractionSignals: readonly LoveMarriageChildSajuSignal[];
}): readonly LoveMarriageChildReportEvidencePacket["timingHints"][number][] {
  const hints: LoveMarriageChildReportEvidencePacket["timingHints"][number][] = [];

  if (
    input.conflictSignals.length > 0 ||
    input.relationInteractionSignals.length > 0
  ) {
    hints.push({
      label: "관계 점검",
      headline: "감정이 커지기 전 기준을 먼저 맞춥니다",
      body:
        "갈등 신호는 이별 예언이 아니라 말투, 속도, 생활 기준을 조율해야 하는 타이밍으로 씁니다.",
      push: ["생활 기준 이름 붙이기", "말투보다 상황 단위로 대화하기"],
      avoid: ["상대 성격 단정", "관계 결론을 서두르기"],
    });
  }

  if (input.supportSignals.length > 0) {
    hints.push({
      label: "관계 완충",
      headline: "혼자 결론내기보다 조율자를 활용합니다",
      body:
        "귀인과 완충 신호는 좋은 사람, 조언자, 대화 구조를 통해 관계 피로를 낮추는 기준입니다.",
      push: ["조언 요청", "대화 기록", "중간 조율"],
      avoid: ["혼자 판단하기", "감정이 쌓인 뒤 폭발하기"],
    });
  }

  return hints;
}

export const LOVE_MARRIAGE_CHILD_DEFAULT_SAFETY_NOTES = defaultSafetyNotes;
export const LOVE_MARRIAGE_CHILD_EVIDENCE_FORBIDDEN_EXPRESSIONS =
  LOVE_MARRIAGE_CHILD_FORBIDDEN_EXPRESSIONS;
