import type {
  ReportBlock,
  ReportInput,
  ReportOutput,
  ReportSection,
} from "./types";

function createSection(section: ReportSection): ReportSection {
  return section;
}

function unique(values: readonly string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const value of values) {
    if (!seen.has(value)) {
      seen.add(value);
      result.push(value);
    }
  }

  return result;
}

const SAJU_TAG_DISPLAY_LABELS: Readonly<Record<string, string>> = {
  FIRE_STRONG: "화 기운 강함",
  METAL_STRONG: "금 기운 강함",
  WATER_WEAK: "수 기운 약함",
  WATER_STRONG: "수 기운 강함",
  EARTH_STRONG: "토 기운 강함",
  YIN_HEAVY: "음 기운 우세",
  YANG_HEAVY: "양 기운 우세",
  TEN_GOD_OUTPUT_STRONG: "식상 강함",
  TEN_GOD_RESOURCE_WEAK: "인성 약함",
  WEALTH_OVERLOAD: "재성 과다 후보",
  OFFICER_PRESSURE_HIGH: "관성 압박 후보",
  BRANCH_CLASH_PRESENT: "지지충 신호",
  WEAK_DAYMASTER_WITH_STRONG_WEALTH: "재다신약 후보",
};

function formatSajuTagLabel(value: string): string {
  return SAJU_TAG_DISPLAY_LABELS[value] ?? value;
}

function formatScore(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function dedupeTagsByCode<T extends { code: string }>(tags: readonly T[]): T[] {
  const seen = new Set<string>();
  const result: T[] = [];

  for (const tag of tags) {
    if (seen.has(tag.code)) {
      continue;
    }
    seen.add(tag.code);
    result.push(tag);
  }

  return result;
}

function createSajuCoreBlock(input: ReportInput): ReportBlock {
  const { pillars } = input.saju;

  return {
    kind: "KEY_VALUE",
    keyValues: [
      {
        keyKo: "년주",
        valueKo: `${pillars.year.stem}${pillars.year.branch}`,
      },
      {
        keyKo: "월주",
        valueKo: `${pillars.month.stem}${pillars.month.branch}`,
      },
      {
        keyKo: "일주",
        valueKo: `${pillars.day.stem}${pillars.day.branch}`,
      },
      {
        keyKo: "시주",
        valueKo: pillars.hour
          ? `${pillars.hour.stem}${pillars.hour.branch}`
          : "모름",
      },
    ],
  };
}

function createElementsBlock(input: ReportInput): ReportBlock {
  const labels = input.saju.elements.labels.map(formatSajuTagLabel);

  if (labels.length > 0) {
    return {
      kind: "BULLET_LIST",
      titleKo: "오행 특징",
      itemsKo: [...labels],
    };
  }

  return {
    kind: "PARAGRAPH",
    bodyKo: "두드러지는 오행 편중이 크게 감지되지 않았습니다.",
  };
}

function createElementsInterpretationBlock(): ReportBlock {
  return {
    kind: "PARAGRAPH",
    titleKo: "오행 흐름",
    bodyKo:
      "이 구조에서는 화와 금의 신호가 비교적 두드러지고, 수 기운은 약하게 표시됩니다. 추진력과 판단의 선명함은 장점이 될 수 있으나, 감정 회복·휴식·유연한 조율을 의식적으로 보완하는 편이 좋습니다.",
  };
}

function createTenGodsBlock(input: ReportInput): ReportBlock {
  const { distribution } = input.saju.tenGods;

  return {
    kind: "KEY_VALUE",
    keyValues: [
      { keyKo: "비견", valueKo: formatScore(distribution.比肩) },
      { keyKo: "겁재", valueKo: formatScore(distribution.劫財) },
      { keyKo: "식신", valueKo: formatScore(distribution.食神) },
      { keyKo: "상관", valueKo: formatScore(distribution.傷官) },
      { keyKo: "편재", valueKo: formatScore(distribution.偏財) },
      { keyKo: "정재", valueKo: formatScore(distribution.正財) },
      { keyKo: "편관", valueKo: formatScore(distribution.偏官) },
      { keyKo: "정관", valueKo: formatScore(distribution.正官) },
      { keyKo: "편인", valueKo: formatScore(distribution.偏印) },
      { keyKo: "정인", valueKo: formatScore(distribution.正印) },
    ],
  };
}

function createTenGodsInterpretationBlock(): ReportBlock {
  return {
    kind: "PARAGRAPH",
    titleKo: "십성 흐름",
    bodyKo:
      "편인과 비견의 점수가 상대적으로 높게 나타나 자기 기준, 학습성, 독립적 판단이 강하게 작동할 수 있습니다. 재성과 관성도 함께 존재하므로 현실 책임과 성과 압박을 동시에 의식하는 구조로 볼 수 있습니다.",
  };
}

function createDayMasterInterpretationBlock(input: ReportInput): ReportBlock {
  if (input.saju.pillars.day.stem === "丙") {
    return {
      kind: "PARAGRAPH",
      titleKo: "일간 해석",
      bodyKo:
        "丙 일간은 밝게 드러나는 화의 성질을 기준으로 자신을 표현합니다. 전체 구조에서는 추진력과 표현성이 장점으로 작동할 수 있지만, 주변 기운이 강할수록 속도 조절과 감정 소모 관리가 중요합니다.",
    };
  }

  return {
    kind: "PARAGRAPH",
    titleKo: "일간 해석",
    bodyKo:
      "일간은 사주에서 나를 대표하는 기준점이며, 주변 기운과의 관계 속에서 성향과 대응 방식이 달라질 수 있습니다.",
  };
}

function createAdvancedPatternsBlock(input: ReportInput): ReportBlock {
  const labels = input.sajuTags
    .filter((tag) => tag.category === "ADVANCED_PATTERN")
    .map((tag) => formatSajuTagLabel(tag.labelKo || tag.code));

  if (labels.length > 0) {
    return {
      kind: "BULLET_LIST",
      titleKo: "구조 후보",
      itemsKo: labels,
    };
  }

  return {
    kind: "PARAGRAPH",
    bodyKo: "현재 기준에서 강하게 표시할 고급 구조 후보는 없습니다.",
  };
}

function createShinsalBlock(input: ReportInput): ReportBlock {
  const shinsalTags = input.sajuTags.filter((tag) => tag.category === "SHINSAL");
  const itemsKo = dedupeTagsByCode(shinsalTags)
    .map((tag) => `${tag.labelKo}: ${tag.descriptionKo}`);

  if (itemsKo.length > 0) {
    return {
      kind: "BULLET_LIST",
      titleKo: "감지된 신살·귀인",
      itemsKo,
    };
  }

  return {
    kind: "PARAGRAPH",
    bodyKo: "현재 기준에서 강하게 표시할 신살·귀인 신호는 없습니다.",
  };
}

function createRelationsBlock(input: ReportInput): ReportBlock {
  const { relations } = input.saju;
  const itemsKo = [
    ...relations.stemCombinations.map((value) => `천간합: ${value}`),
    ...relations.branchCombinations.map((value) => `지지합: ${value}`),
    ...relations.branchClashes.map((value) => `지지충: ${value}`),
  ];

  if (itemsKo.length > 0) {
    return {
      kind: "BULLET_LIST",
      titleKo: "합·충 신호",
      itemsKo,
    };
  }

  return {
    kind: "PARAGRAPH",
    bodyKo: "뚜렷한 합·충 신호가 감지되지 않았습니다.",
  };
}

function createBridgeBlock(input: ReportInput): ReportBlock {
  if (input.bridgeSignals.length > 0) {
    return {
      kind: "BULLET_LIST",
      titleKo: "겹침과 차이",
      itemsKo: input.bridgeSignals.map((signal) => signal.titleKo),
    };
  }

  return {
    kind: "PARAGRAPH",
    bodyKo: "현재 기준에서 강하게 연결되는 사주×MBTI 신호는 없습니다.",
  };
}

function createSajuMbtiSuggestionBlocks(input: ReportInput): ReportBlock[] {
  const suggestion = input.mbtiSuggestion;

  if (!suggestion) {
    return [
      {
        kind: "PARAGRAPH",
        bodyKo: "현재 기준에서 사주 기반 MBTI 보정 정보를 만들 수 없습니다.",
      },
    ];
  }

  const blocks: ReportBlock[] = [
    {
      kind: "HIGHLIGHT",
      titleKo: "입력 MBTI와 사주 기반 후보 비교",
      bodyKo: suggestion.comparison.summaryKo,
    },
  ];
  const isHighTension = suggestion.comparison.tensionAxes.length >= 2;

  if (suggestion.typeSuggestion && isHighTension) {
    blocks.push({
      kind: "PARAGRAPH",
      titleKo: "사주 기반 성향 후보",
      bodyKo:
        "입력한 MBTI와 다른 축이 여러 개 보여, 하나의 유형명으로 단정하기보다 축별 차이를 중심으로 보는 편이 적절합니다.",
    });
  } else if (suggestion.typeSuggestion) {
    blocks.push({
      kind: "KEY_VALUE",
      titleKo: "사주 기반 후보 유형",
      keyValues: [
        {
          keyKo: "후보 MBTI",
          valueKo: suggestion.typeSuggestion.suggestedType,
        },
        {
          keyKo: "신뢰도",
          valueKo: suggestion.typeSuggestion.confidence,
        },
      ],
    });
  } else {
    blocks.push({
      kind: "PARAGRAPH",
      titleKo: "후보 유형",
      bodyKo: "현재 태그만으로는 하나의 MBTI 후보 유형까지 좁히지 않습니다.",
    });
  }

  if (suggestion.axisSuggestions.length > 0) {
    blocks.push({
      kind: "BULLET_LIST",
      titleKo: "축별 사주 신호",
      itemsKo: suggestion.axisSuggestions.map(
        (item) => `${item.axis} → ${item.suggestedSide}: ${item.summaryKo}`,
      ),
    });
  }

  if (suggestion.notices.length > 0) {
    blocks.push({
      kind: "BULLET_LIST",
      titleKo: "해석 기준",
      itemsKo: [...suggestion.notices],
    });
  }

  return blocks;
}

export function buildReport(input: ReportInput): ReportOutput {
  const sections: ReportSection[] = [
    createSection({
      id: "INTRO",
      level: "FREE_PREVIEW",
      titleKo: "리포트 개요",
      summaryKo:
        "이 리포트는 사주 구조와 MBTI 자기인식을 함께 살펴보는 자기이해용 콘텐츠입니다.",
      blocks: [
        {
          kind: "PARAGRAPH",
          bodyKo:
            "사주는 생년월일시를 기준으로 기운의 구조를 살피고, MBTI는 스스로 인식하는 사고·판단·관계 방식을 정리하는 도구로 사용합니다.",
        },
      ],
    }),
    createSection({
      id: "SAJU_CORE",
      level: "FREE_PREVIEW",
      titleKo: "사주 기본 구조",
      summaryKo: "사주의 기본 뼈대인 년주·월주·일주·시주입니다.",
      blocks: [createSajuCoreBlock(input)],
    }),
    createSection({
      id: "DAY_MASTER",
      level: "FREE_PREVIEW",
      titleKo: "일간",
      summaryKo: "일간은 사주에서 나를 대표하는 기준점입니다.",
      blocks: [
        {
          kind: "HIGHLIGHT",
          titleKo: "일간",
          bodyKo: `${input.saju.dayMaster} 일간`,
        },
        createDayMasterInterpretationBlock(input),
      ],
    }),
    createSection({
      id: "ELEMENTS",
      level: "PAID_FULL",
      titleKo: "오행",
      summaryKo:
        "오행은 목·화·토·금·수의 분포를 통해 에너지의 방향을 봅니다.",
      blocks: [createElementsBlock(input), createElementsInterpretationBlock()],
    }),
    createSection({
      id: "TEN_GODS",
      level: "PAID_FULL",
      titleKo: "십성",
      summaryKo: "십성은 일간을 기준으로 관계되는 기운을 분류한 구조입니다.",
      blocks: [createTenGodsBlock(input), createTenGodsInterpretationBlock()],
    }),
    createSection({
      id: "ADVANCED_PATTERNS",
      level: "PAID_FULL",
      titleKo: "고급 구조 후보",
      summaryKo: "고급 구조 후보는 단정이 아니라 해석을 위한 신호입니다.",
      blocks: [createAdvancedPatternsBlock(input)],
    }),
    createSection({
      id: "SHINSAL",
      level: "PAID_FULL",
      titleKo: "신살·귀인",
      summaryKo:
        "신살과 귀인은 사주 구조 안에서 특정 성향과 보조 흐름을 읽기 위한 참고 신호입니다.",
      blocks: [createShinsalBlock(input)],
    }),
    createSection({
      id: "RELATIONS",
      level: "PAID_FULL",
      titleKo: "합과 충",
      summaryKo: "합과 충은 기운 사이의 연결과 긴장을 보는 참고 신호입니다.",
      blocks: [createRelationsBlock(input)],
    }),
    createSection({
      id: "MBTI_PROFILE",
      level: "FREE_PREVIEW",
      titleKo: "MBTI 프로필",
      summaryKo:
        "MBTI는 스스로 인식하는 사고와 판단 방식을 정리하는 보조 축입니다.",
      blocks: [
        {
          kind: "HIGHLIGHT",
          titleKo: "MBTI",
          bodyKo: input.mbti.type,
        },
        {
          kind: "BULLET_LIST",
          titleKo: "주요 자기인식 특성",
          itemsKo: input.mbti.traits
            .map((trait) => trait.labelKo)
            .slice(0, 6),
        },
      ],
    }),
    createSection({
      id: "SAJU_MBTI_BRIDGE",
      level: "PAID_FULL",
      titleKo: "사주×MBTI 연결",
      summaryKo:
        "사주 구조와 MBTI 자기인식이 겹치거나 어긋나는 지점을 정리합니다.",
      blocks: [createBridgeBlock(input)],
    }),
    createSection({
      id: "SAJU_MBTI_SUGGESTION",
      level: "PAID_FULL",
      titleKo: "사주 기반 MBTI 보정",
      summaryKo:
        "입력한 MBTI를 존중하되, 사주 구조에서 다르게 읽히는 성향 축이 있는지 비교합니다.",
      blocks: createSajuMbtiSuggestionBlocks(input),
    }),
    createSection({
      id: "ACTION_GUIDE",
      level: "PAID_FULL",
      titleKo: "활용 가이드",
      summaryKo: "해석은 단정이 아니라 자기이해와 선택을 돕기 위한 참고입니다.",
      blocks: [
        {
          kind: "BULLET_LIST",
          titleKo: "활용 가이드",
          itemsKo: [
            "강하게 나온 기질은 장점과 부담을 함께 봅니다.",
            "부족하게 나온 기운은 결핍이 아니라 의식적으로 보완할 영역으로 봅니다.",
            "MBTI와 사주가 겹치는 부분은 반복되는 자기 패턴으로 점검합니다.",
          ],
        },
      ],
    }),
    createSection({
      id: "DISCLAIMER",
      level: "FREE_PREVIEW",
      titleKo: "안내",
      summaryKo: "본 리포트는 자기이해용 콘텐츠입니다.",
      blocks: [
        {
          kind: "WARNING",
          bodyKo:
            "본 리포트는 운세의 단정, 질병·투자·법률·결혼 판단, 미래 사건 예측을 제공하지 않습니다.",
        },
      ],
    }),
  ];

  return {
    version: "v1",
    titleKo: "결리포트",
    subtitleKo: "사주와 MBTI로 읽는 나의 결",
    sections,
    notices: unique([
      ...input.saju.notices,
      ...(input.mbtiSuggestion?.notices ?? []),
      "출생정보와 해석 결과는 자기이해용 참고자료입니다.",
    ]),
  };
}
