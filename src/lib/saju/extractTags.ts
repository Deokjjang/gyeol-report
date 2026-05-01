import type {
  ElementLabel,
  FiveElement,
  HeavenlyStem,
  SajuCalcResult,
  TenGod,
  YinYangLabel,
} from "./types";
import type { SajuTag, SajuTagCode, TenGodGroup } from "./tags";

type TagMeta = {
  code: SajuTagCode;
  labelKo: string;
  descriptionKo: string;
};

type ElementTagMeta = TagMeta & {
  element: FiveElement;
};

type TenGodGroupScore = Record<TenGodGroup, number>;

const DAY_MASTER_TAG_META: Record<HeavenlyStem, TagMeta> = {
  甲: {
    code: "DAY_MASTER_GAP_WOOD",
    labelKo: "갑목 일간",
    descriptionKo:
      "갑목은 큰 나무처럼 방향성과 성장 욕구를 상징하는 일간입니다.",
  },
  乙: {
    code: "DAY_MASTER_EUL_WOOD",
    labelKo: "을목 일간",
    descriptionKo:
      "을목은 풀과 덩굴처럼 유연한 성장성과 적응력을 상징하는 일간입니다.",
  },
  丙: {
    code: "DAY_MASTER_BYEONG_FIRE",
    labelKo: "병화 일간",
    descriptionKo:
      "병화는 태양처럼 드러나는 표현력과 확산성을 상징하는 일간입니다.",
  },
  丁: {
    code: "DAY_MASTER_JEONG_FIRE",
    labelKo: "정화 일간",
    descriptionKo:
      "정화는 촛불처럼 집중된 온기와 섬세한 감각을 상징하는 일간입니다.",
  },
  戊: {
    code: "DAY_MASTER_MU_EARTH",
    labelKo: "무토 일간",
    descriptionKo:
      "무토는 큰 산처럼 안정감과 중심을 잡는 힘을 상징하는 일간입니다.",
  },
  己: {
    code: "DAY_MASTER_GI_EARTH",
    labelKo: "기토 일간",
    descriptionKo:
      "기토는 밭의 흙처럼 수용성과 현실적인 조율을 상징하는 일간입니다.",
  },
  庚: {
    code: "DAY_MASTER_GYEONG_METAL",
    labelKo: "경금 일간",
    descriptionKo:
      "경금은 단단한 금속처럼 결단력과 기준 의식을 상징하는 일간입니다.",
  },
  辛: {
    code: "DAY_MASTER_SIN_METAL",
    labelKo: "신금 일간",
    descriptionKo:
      "신금은 보석처럼 정교한 감각과 선별력을 상징하는 일간입니다.",
  },
  壬: {
    code: "DAY_MASTER_IM_WATER",
    labelKo: "임수 일간",
    descriptionKo:
      "임수는 큰 물처럼 넓은 사고와 흐름을 읽는 힘을 상징하는 일간입니다.",
  },
  癸: {
    code: "DAY_MASTER_GYE_WATER",
    labelKo: "계수 일간",
    descriptionKo:
      "계수는 비와 안개처럼 섬세한 감수성과 축적을 상징하는 일간입니다.",
  },
};

const ELEMENT_TAG_META: Record<ElementLabel, ElementTagMeta> = {
  WOOD_STRONG: {
    code: "WOOD_STRONG",
    element: "WOOD",
    labelKo: "목 기운 강함",
    descriptionKo: "해당 오행이 비교적 강하게 작동합니다.",
  },
  WOOD_WEAK: {
    code: "WOOD_WEAK",
    element: "WOOD",
    labelKo: "목 기운 약함",
    descriptionKo: "해당 오행이 약하게 드러납니다.",
  },
  WOOD_MISSING: {
    code: "WOOD_MISSING",
    element: "WOOD",
    labelKo: "목 기운 없음",
    descriptionKo: "해당 오행이 거의 드러나지 않습니다.",
  },
  FIRE_STRONG: {
    code: "FIRE_STRONG",
    element: "FIRE",
    labelKo: "화 기운 강함",
    descriptionKo: "해당 오행이 비교적 강하게 작동합니다.",
  },
  FIRE_WEAK: {
    code: "FIRE_WEAK",
    element: "FIRE",
    labelKo: "화 기운 약함",
    descriptionKo: "해당 오행이 약하게 드러납니다.",
  },
  FIRE_MISSING: {
    code: "FIRE_MISSING",
    element: "FIRE",
    labelKo: "화 기운 없음",
    descriptionKo: "해당 오행이 거의 드러나지 않습니다.",
  },
  EARTH_STRONG: {
    code: "EARTH_STRONG",
    element: "EARTH",
    labelKo: "토 기운 강함",
    descriptionKo: "해당 오행이 비교적 강하게 작동합니다.",
  },
  EARTH_WEAK: {
    code: "EARTH_WEAK",
    element: "EARTH",
    labelKo: "토 기운 약함",
    descriptionKo: "해당 오행이 약하게 드러납니다.",
  },
  EARTH_MISSING: {
    code: "EARTH_MISSING",
    element: "EARTH",
    labelKo: "토 기운 없음",
    descriptionKo: "해당 오행이 거의 드러나지 않습니다.",
  },
  METAL_STRONG: {
    code: "METAL_STRONG",
    element: "METAL",
    labelKo: "금 기운 강함",
    descriptionKo: "해당 오행이 비교적 강하게 작동합니다.",
  },
  METAL_WEAK: {
    code: "METAL_WEAK",
    element: "METAL",
    labelKo: "금 기운 약함",
    descriptionKo: "해당 오행이 약하게 드러납니다.",
  },
  METAL_MISSING: {
    code: "METAL_MISSING",
    element: "METAL",
    labelKo: "금 기운 없음",
    descriptionKo: "해당 오행이 거의 드러나지 않습니다.",
  },
  WATER_STRONG: {
    code: "WATER_STRONG",
    element: "WATER",
    labelKo: "수 기운 강함",
    descriptionKo: "해당 오행이 비교적 강하게 작동합니다.",
  },
  WATER_WEAK: {
    code: "WATER_WEAK",
    element: "WATER",
    labelKo: "수 기운 약함",
    descriptionKo: "해당 오행이 약하게 드러납니다.",
  },
  WATER_MISSING: {
    code: "WATER_MISSING",
    element: "WATER",
    labelKo: "수 기운 없음",
    descriptionKo: "해당 오행이 거의 드러나지 않습니다.",
  },
};

const YIN_YANG_TAG_META: Record<
  YinYangLabel,
  TagMeta & { severity: SajuTag["severity"] }
> = {
  YIN_HEAVY: {
    code: "YIN_HEAVY",
    severity: "MEDIUM",
    labelKo: "음 기운 강함",
    descriptionKo: "음 기운이 상대적으로 강하게 드러나는 경향이 있습니다.",
  },
  YANG_HEAVY: {
    code: "YANG_HEAVY",
    severity: "MEDIUM",
    labelKo: "양 기운 강함",
    descriptionKo: "양 기운이 상대적으로 강하게 드러나는 경향이 있습니다.",
  },
  BALANCED: {
    code: "BALANCED",
    severity: "LOW",
    labelKo: "음양 균형",
    descriptionKo: "음과 양의 흐름이 비교적 균형에 가깝게 나타납니다.",
  },
};

const TEN_GOD_GROUP_ORDER: readonly TenGodGroup[] = [
  "PEER",
  "OUTPUT",
  "WEALTH",
  "OFFICER",
  "RESOURCE",
];

const TEN_GODS_BY_GROUP: Record<TenGodGroup, readonly TenGod[]> = {
  PEER: ["比肩", "劫財"],
  OUTPUT: ["食神", "傷官"],
  WEALTH: ["偏財", "正財"],
  OFFICER: ["偏官", "正官"],
  RESOURCE: ["偏印", "正印"],
};

const TEN_GOD_GROUP_TAG_META: Record<
  TenGodGroup,
  {
    strongCode: SajuTagCode;
    weakCode: SajuTagCode;
    labelKo: string;
    descriptionKo: string;
  }
> = {
  PEER: {
    strongCode: "TEN_GOD_PEER_STRONG",
    weakCode: "TEN_GOD_PEER_WEAK",
    labelKo: "비겁",
    descriptionKo: "비겁은 자기주장, 독립성, 동료성과 관련된 십성 그룹입니다.",
  },
  OUTPUT: {
    strongCode: "TEN_GOD_OUTPUT_STRONG",
    weakCode: "TEN_GOD_OUTPUT_WEAK",
    labelKo: "식상",
    descriptionKo: "식상은 표현, 생산성, 창작과 관련된 십성 그룹입니다.",
  },
  WEALTH: {
    strongCode: "TEN_GOD_WEALTH_STRONG",
    weakCode: "TEN_GOD_WEALTH_WEAK",
    labelKo: "재성",
    descriptionKo:
      "재성은 현실감각, 성과, 돈, 책임과 관련된 십성 그룹입니다.",
  },
  OFFICER: {
    strongCode: "TEN_GOD_OFFICER_STRONG",
    weakCode: "TEN_GOD_OFFICER_WEAK",
    labelKo: "관성",
    descriptionKo:
      "관성은 규칙, 책임, 압박, 역할 의식과 관련된 십성 그룹입니다.",
  },
  RESOURCE: {
    strongCode: "TEN_GOD_RESOURCE_STRONG",
    weakCode: "TEN_GOD_RESOURCE_WEAK",
    labelKo: "인성",
    descriptionKo: "인성은 회복, 학습, 보호, 수용과 관련된 십성 그룹입니다.",
  },
};

const BIRTH_TIME_UNKNOWN_NOTICE_KEYWORD = "출생시간을 모르면";

function createTag(tag: SajuTag): SajuTag {
  return tag;
}

function formatScore(value: number): string {
  return Number.isInteger(value) ? String(value) : String(Math.round(value * 100) / 100);
}

function getTenGodGroupScores(
  distribution: SajuCalcResult["tenGods"]["distribution"],
): TenGodGroupScore {
  const scores: TenGodGroupScore = {
    PEER: 0,
    OUTPUT: 0,
    WEALTH: 0,
    OFFICER: 0,
    RESOURCE: 0,
  };

  for (const group of TEN_GOD_GROUP_ORDER) {
    scores[group] = TEN_GODS_BY_GROUP[group].reduce(
      (sum, tenGod) => sum + distribution[tenGod],
      0,
    );
  }

  return scores;
}

function createDayMasterTag(dayMaster: HeavenlyStem): SajuTag {
  const meta = DAY_MASTER_TAG_META[dayMaster];

  return createTag({
    code: meta.code,
    category: "DAY_MASTER",
    severity: "INFO",
    confidence: "HIGH",
    labelKo: meta.labelKo,
    descriptionKo: meta.descriptionKo,
    evidence: [`dayMaster:${dayMaster}`],
  });
}

function createElementTag(
  label: ElementLabel,
  weighted: Record<FiveElement, number>,
): SajuTag {
  const meta = ELEMENT_TAG_META[label];

  return createTag({
    code: meta.code,
    category: "ELEMENT",
    severity: "MEDIUM",
    confidence: "HIGH",
    labelKo: meta.labelKo,
    descriptionKo: meta.descriptionKo,
    evidence: [`element:${meta.element}=${formatScore(weighted[meta.element])}`],
  });
}

function createYinYangTag(yinYang: SajuCalcResult["yinYang"]): SajuTag {
  const meta = YIN_YANG_TAG_META[yinYang.label];

  return createTag({
    code: meta.code,
    category: "YIN_YANG",
    severity: meta.severity,
    confidence: "HIGH",
    labelKo: meta.labelKo,
    descriptionKo: meta.descriptionKo,
    evidence: [`yinYang:yin=${yinYang.yin},yang=${yinYang.yang}`],
  });
}

function createTenGodGroupTags(scores: TenGodGroupScore): SajuTag[] {
  const tags: SajuTag[] = [];

  for (const group of TEN_GOD_GROUP_ORDER) {
    const score = scores[group];
    const meta = TEN_GOD_GROUP_TAG_META[group];
    const isStrong = score >= 2.5;
    const isWeak = score < 1;

    if (!isStrong && !isWeak) {
      continue;
    }

    const strengthLabel = isStrong ? "강함" : "약함";

    tags.push(
      createTag({
        code: isStrong ? meta.strongCode : meta.weakCode,
        category: "TEN_GOD",
        severity: "MEDIUM",
        confidence: "MEDIUM",
        labelKo: `${meta.labelKo} ${strengthLabel}`,
        descriptionKo: `${meta.descriptionKo} 이 기운은 ${strengthLabel}으로 나타날 수 있습니다.`,
        evidence: [`tenGodGroup:${group}=${formatScore(score)}`],
      }),
    );
  }

  return tags;
}

function createStrengthBalanceTags(scores: TenGodGroupScore): SajuTag[] {
  const supportScore = scores.PEER + scores.RESOURCE;
  const pressureScore = scores.WEALTH + scores.OFFICER + scores.OUTPUT;
  const evidence = [
    `strength:support=${formatScore(supportScore)},pressure=${formatScore(
      pressureScore,
    )}`,
  ];
  const tags: SajuTag[] = [];

  if (supportScore >= pressureScore + 1.5) {
    tags.push(
      createTag({
        code: "DAY_MASTER_RELATIVELY_STRONG",
        category: "STRENGTH_BALANCE",
        severity: "LOW",
        confidence: "MEDIUM",
        labelKo: "일간 지지 기운 우세",
        descriptionKo:
          "일간을 받쳐주는 기운이 상대적으로 더 크게 작동하는 구조로 볼 수 있습니다.",
        evidence,
      }),
    );
  } else if (pressureScore >= supportScore + 1.5) {
    tags.push(
      createTag({
        code: "DAY_MASTER_RELATIVELY_WEAK",
        category: "STRENGTH_BALANCE",
        severity: "MEDIUM",
        confidence: "MEDIUM",
        labelKo: "일간 부담 기운 우세",
        descriptionKo:
          "신약은 사람이 약하다는 뜻이 아니라, 일간을 받쳐주는 기운보다 감당해야 할 기운이 더 크게 작동한다는 뜻에 가깝습니다.",
        evidence,
      }),
    );
  } else {
    tags.push(
      createTag({
        code: "DAY_MASTER_BALANCED",
        category: "STRENGTH_BALANCE",
        severity: "LOW",
        confidence: "MEDIUM",
        labelKo: "일간 균형 경향",
        descriptionKo:
          "일간을 받치는 기운과 감당해야 할 기운이 비교적 균형에 가깝게 나타날 수 있습니다.",
        evidence,
      }),
    );
  }

  if (supportScore < 1) {
    tags.push(
      createTag({
        code: "SUPPORT_LOW",
        category: "STRENGTH_BALANCE",
        severity: "MEDIUM",
        confidence: "MEDIUM",
        labelKo: "지지 기운 낮음",
        descriptionKo:
          "일간을 받쳐주는 기운이 낮게 계산되는 구조적 경향으로 볼 수 있습니다.",
        evidence,
      }),
    );
  }

  if (pressureScore >= 4) {
    tags.push(
      createTag({
        code: "PRESSURE_HIGH",
        category: "STRENGTH_BALANCE",
        severity: "HIGH",
        confidence: "MEDIUM",
        labelKo: "부담 기운 높음",
        descriptionKo:
          "감당해야 할 기운이 높게 계산되어 책임과 표현 압력이 크게 느껴질 수 있는 구조입니다.",
        evidence,
      }),
    );
  }

  return tags;
}

function createRelationTags(relations: SajuCalcResult["relations"]): SajuTag[] {
  const tags: SajuTag[] = [];

  if (relations.stemCombinations.length > 0) {
    tags.push(
      createTag({
        code: "STEM_COMBINATION_PRESENT",
        category: "RELATION",
        severity: "LOW",
        confidence: "HIGH",
        labelKo: "천간합 있음",
        descriptionKo:
          "천간합은 겉으로 드러나는 기운끼리 연결되는 구조로 볼 수 있습니다.",
        evidence: [`relation:stemCombinations=${relations.stemCombinations.length}`],
      }),
    );
  }

  if (relations.branchCombinations.length > 0) {
    tags.push(
      createTag({
        code: "BRANCH_COMBINATION_PRESENT",
        category: "RELATION",
        severity: "LOW",
        confidence: "HIGH",
        labelKo: "지지합 있음",
        descriptionKo:
          "지지합은 환경과 내면 흐름이 서로 묶이는 구조로 볼 수 있습니다.",
        evidence: [
          `relation:branchCombinations=${relations.branchCombinations.length}`,
        ],
      }),
    );
  }

  if (relations.branchClashes.length > 0) {
    tags.push(
      createTag({
        code: "BRANCH_CLASH_PRESENT",
        category: "RELATION",
        severity: "MEDIUM",
        confidence: "HIGH",
        labelKo: "지지충 있음",
        descriptionKo:
          "지지충은 반드시 나쁜 일이 생긴다는 뜻이 아니라, 방향성의 긴장과 변화 민감성을 뜻할 수 있습니다.",
        evidence: [`relation:branchClashes=${relations.branchClashes.length}`],
      }),
    );
  }

  return tags;
}

function createBirthTimeTag(result: SajuCalcResult): SajuTag {
  if (result.input.birthTimeUnknown) {
    return createTag({
      code: "BIRTH_TIME_UNKNOWN",
      category: "BIRTH_TIME",
      severity: "MEDIUM",
      confidence: "HIGH",
      labelKo: "출생시간 모름",
      descriptionKo:
        "출생시간을 모르는 경우에는 시주를 제외한 구조 중심으로 볼 수 있습니다.",
      evidence: ["birthTime:unknown"],
    });
  }

  return createTag({
    code: "BIRTH_TIME_KNOWN",
    category: "BIRTH_TIME",
    severity: "INFO",
    confidence: "HIGH",
    labelKo: "출생시간 있음",
    descriptionKo: "출생시간이 있어 시주까지 포함한 구조로 볼 수 있습니다.",
    evidence: ["birthTime:known"],
  });
}

function createNoticeTags(notices: readonly string[]): SajuTag[] {
  const tags: SajuTag[] = [];

  for (const notice of notices) {
    if (notice.includes(BIRTH_TIME_UNKNOWN_NOTICE_KEYWORD)) {
      tags.push(
        createTag({
          code: "BIRTH_TIME_UNKNOWN_NOTICE",
          category: "NOTICE",
          severity: "LOW",
          confidence: "HIGH",
          labelKo: "출생시간 모름 안내",
          descriptionKo:
            "출생시간을 모르면 년·월·일주 중심으로 해석하는 안내가 필요합니다.",
          evidence: ["notice:BIRTH_TIME_UNKNOWN"],
        }),
      );
    }
  }

  return tags;
}

export function extractSajuTags(result: SajuCalcResult): SajuTag[] {
  const tenGodGroupScores = getTenGodGroupScores(result.tenGods.distribution);

  return [
    createDayMasterTag(result.dayMaster),
    ...result.elements.labels.map((label) =>
      createElementTag(label, result.elements.weighted),
    ),
    createYinYangTag(result.yinYang),
    ...createTenGodGroupTags(tenGodGroupScores),
    ...createStrengthBalanceTags(tenGodGroupScores),
    ...createRelationTags(result.relations),
    createBirthTimeTag(result),
    ...createNoticeTags(result.notices),
  ];
}
