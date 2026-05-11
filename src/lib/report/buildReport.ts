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

const PILLAR_POSITION_LABELS: Readonly<Record<string, string>> = {
  year: "년주",
  month: "월주",
  day: "일주",
  hour: "시주",
};

const SHINSAL_NARRATIVE_TEXTS: Readonly<Record<string, string>> = {
  SHINSAL_HYEONCHIMSAL:
    "현침살이 보여, 남들이 놓치는 작은 차이를 빠르게 포착하는 예리함이 드러납니다.",
  SHINSAL_HONGYEOMSAL:
    "홍염살은 은근히 시선이 가는 매력과 감정 표현의 존재감을 더합니다.",
  SHINSAL_BAEKHODAESAL:
    "백호대살은 강한 집중력과 밀어붙이는 힘이 크게 작동할 수 있음을 보여줍니다.",
  SHINSAL_MANGSINSAL:
    "망신살은 사회적 노출과 평판에 민감하게 반응하는 흐름을 보여줍니다.",
  SHINSAL_YEOKMASAL:
    "역마살은 한곳에 고정되기보다 이동과 변화 속에서 에너지가 살아나는 흐름을 보여줍니다.",
  SHINSAL_DOHWASAL:
    "도화살은 사람들의 시선을 끌고 관계 안에서 감정 반응을 일으키는 매력을 더합니다.",
  SHINSAL_HWAGAE:
    "화개는 혼자 깊이 파고들 때 살아나는 예술성, 몰입, 내면의 깊이를 보여줍니다.",
  SHINSAL_GOSINSAL:
    "고신살은 관계 안에서도 자기만의 거리와 독립성을 지키려는 흐름을 보여줍니다.",
  SHINSAL_GWASUKSAL:
    "과숙살은 쉽게 기대기보다 스스로를 보호하고 신중하게 관계를 여는 흐름을 보여줍니다.",
  SHINSAL_CHEON_EUL_GWIIN:
    "천을귀인은 어려운 상황에서도 도움의 통로나 완충 장치가 생기기 쉬운 구조로 읽을 수 있습니다.",
  SHINSAL_TAEGEUK_GWIIN:
    "태극귀인은 복잡한 상황을 큰 흐름에서 정리하고 균형을 잡으려는 힘을 더합니다.",
  SHINSAL_MUN_CHANG_GWIIN:
    "문창귀인은 말, 글, 학습, 문서화에서 강점이 드러날 수 있는 지적 신호입니다.",
  SHINSAL_HAK_DANG_GWIIN:
    "학당귀인은 배움의 지속성과 체계적으로 익혀가는 힘을 보여주는 신호입니다.",
  SHINSAL_WOL_DEOK_GWIIN:
    "월덕귀인은 관계 안에서 분위기를 부드럽게 만들고 갈등을 완충하는 힘으로 읽을 수 있습니다.",
  SHINSAL_CHEON_DEOK_GWIIN:
    "천덕귀인은 안정감과 보호적 흐름이 더해져 위기에서 급격히 흔들리지 않도록 돕는 신호입니다.",
  SHINSAL_TWELVE_GEOPSAL:
    "겁살은 외부 압박이나 급한 변화 앞에서 반응 속도와 방어 본능이 올라오는 흐름을 보여줍니다.",
  SHINSAL_TWELVE_JAESAL:
    "재살은 경쟁과 견제, 환경적 부담 속에서 스스로를 지키며 대응하는 방식을 보여줍니다.",
  SHINSAL_TWELVE_CHEONSAL:
    "천살은 개인의 의지만으로 움직이기보다 큰 흐름과 외부 조건을 읽는 감각을 더합니다.",
  SHINSAL_TWELVE_JISAL:
    "지살은 활동 반경이 넓어지고 환경을 바꾸며 기회를 찾는 흐름을 보여줍니다.",
  SHINSAL_TWELVE_NYEONSAL:
    "년살은 사람들과의 접점에서 주목을 받거나 인상이 강하게 남는 흐름을 더합니다.",
  SHINSAL_TWELVE_WOLSAL:
    "월살은 막힘을 느끼는 상황에서 관점을 바꾸고 다시 회복하는 방식을 보여줍니다.",
  SHINSAL_TWELVE_MANGSINSAL:
    "망신살은 사회적 노출과 평판에 민감하게 반응하며, 말과 행동의 파급력을 의식하게 만듭니다.",
  SHINSAL_TWELVE_JANGSEONGSAL:
    "장성살은 앞에서 이끌고 책임을 지려는 힘이 강해지는 흐름을 보여줍니다.",
  SHINSAL_TWELVE_BANANSAL:
    "반안살은 안정된 기반을 만들고 성취를 정리해 가려는 흐름을 보여줍니다.",
  SHINSAL_TWELVE_YEOKMASAL:
    "역마살은 이동과 변화 속에서 에너지가 살아나고 활동 반경이 넓어지는 흐름을 보여줍니다.",
  SHINSAL_TWELVE_YUKHAESAL:
    "육해살은 관계나 환경 속에서 소모가 생길 때 조율과 거리감이 중요해지는 흐름을 보여줍니다.",
  SHINSAL_TWELVE_HWAGAE:
    "화개살은 혼자 깊이 몰입하고 의미를 정리하는 과정에서 내면의 깊이가 살아나는 흐름을 보여줍니다.",
};

const SHINSAL_DISPLAY_LIMIT = 10;
const SHINSAL_LIMIT_NOTICE =
  "그 밖의 신살 신호도 함께 감지되지만, 리포트에서는 해석 영향이 큰 신호를 중심으로 정리했습니다.";

function formatSajuTagLabel(value: string): string {
  return SAJU_TAG_DISPLAY_LABELS[value] ?? value;
}

function formatScore(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function formatPositionPair(value: string): string {
  const [left, right] = value.split("-");

  return `${PILLAR_POSITION_LABELS[left] ?? left}와 ${
    PILLAR_POSITION_LABELS[right] ?? right
  }`;
}

function formatRelationItem(
  labelKo: string,
  value: string,
  signalKo: string,
): string {
  const [positionPair, relationPair] = value.split(":");

  if (!positionPair || !relationPair) {
    return `${labelKo}: ${value}`;
  }

  return `${labelKo}: ${formatPositionPair(positionPair)} 사이의 ${relationPair} ${signalKo} 신호`;
}

function removeLeadingLabel(text: string, label: string): string {
  const prefix = `${label}은 `;
  const alternatePrefix = `${label}는 `;

  if (text.startsWith(prefix)) {
    return text.slice(prefix.length);
  }
  if (text.startsWith(alternatePrefix)) {
    return text.slice(alternatePrefix.length);
  }

  return text;
}

function formatShinsalNarrative(tag: {
  code: string;
  labelKo: string;
  descriptionKo: string;
}): string {
  return (
    SHINSAL_NARRATIVE_TEXTS[tag.code] ??
    `${tag.labelKo}: ${removeLeadingLabel(tag.descriptionKo, tag.labelKo)}`
  );
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

function normalizeShinsalDisplayGroup(itemKo: string): string {
  if (itemKo.includes("천을귀인")) {
    return "천을귀인";
  }
  if (itemKo.includes("월덕귀인")) {
    return "월덕귀인";
  }
  if (itemKo.includes("천덕귀인")) {
    return "천덕귀인";
  }
  if (itemKo.includes("태극귀인")) {
    return "태극귀인";
  }
  if (itemKo.includes("문창귀인")) {
    return "문창귀인";
  }
  if (itemKo.includes("학당귀인")) {
    return "학당귀인";
  }
  if (itemKo.includes("현침살")) {
    return "현침살";
  }
  if (itemKo.includes("백호대살")) {
    return "백호대살";
  }
  if (itemKo.includes("역마살") || itemKo.includes("역마")) {
    return "역마";
  }
  if (itemKo.includes("화개살") || itemKo.includes("화개")) {
    return "화개";
  }
  if (itemKo.includes("지살")) {
    return "지살";
  }
  if (
    itemKo.includes("도화살") ||
    itemKo.includes("도화") ||
    itemKo.includes("년살") ||
    itemKo.includes("홍염살") ||
    itemKo.includes("홍염")
  ) {
    return "매력/주목";
  }

  return "기타";
}

function getShinsalDisplayPriority(group: string): number {
  switch (group) {
    case "천을귀인":
      return 0;
    case "월덕귀인":
      return 1;
    case "천덕귀인":
      return 2;
    case "태극귀인":
      return 3;
    case "문창귀인":
      return 4;
    case "학당귀인":
      return 5;
    case "현침살":
      return 6;
    case "백호대살":
      return 7;
    case "역마":
      return 8;
    case "화개":
      return 9;
    case "지살":
      return 10;
    case "매력/주목":
      return 11;
    default:
      return 12;
  }
}

function selectVisibleShinsalItems(itemsKo: readonly string[]): string[] {
  const indexed = itemsKo.map((text, index) => ({
    text,
    index,
    group: normalizeShinsalDisplayGroup(text),
  }));
  const selected: string[] = [];
  const seen = new Set<string>();

  indexed.sort((left, right) => {
    const diff =
      getShinsalDisplayPriority(left.group) -
      getShinsalDisplayPriority(right.group);

    return diff === 0 ? left.index - right.index : diff;
  });

  for (const item of indexed) {
    if (seen.has(item.group)) {
      continue;
    }
    seen.add(item.group);
    selected.push(item.text);
  }

  const limited = selected.slice(0, SHINSAL_DISPLAY_LIMIT);

  if (selected.length > SHINSAL_DISPLAY_LIMIT) {
    limited.push(SHINSAL_LIMIT_NOTICE);
  }

  return limited;
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

function buildTenGodsSummaryFromStructure(
  structureAnalysis: NonNullable<ReportInput["structureAnalysis"]>,
): string {
  const strengthLabel = structureAnalysis.dayMasterStrength.labelKo;
  const patternLabels = structureAnalysis.patterns
    .slice(0, 2)
    .map((pattern) => pattern.labelKo);

  if (patternLabels.length > 0) {
    return `십성 묶음으로 보면 이 사주는 ${strengthLabel} 흐름 위에 ${patternLabels.join(", ")} 신호가 함께 보입니다. 자기 기준과 학습·분석의 힘은 강하게 살아나지만, 재성·관성처럼 현실 성과와 역할을 다루는 기운도 함께 확인해야 합니다.`;
  }

  return `십성 묶음으로 보면 이 사주는 ${strengthLabel} 흐름을 중심으로 해석할 수 있습니다. 특정 한 기운만 보기보다 비겁·인성·식상·재성·관성의 균형을 함께 보는 편이 적절합니다.`;
}

function buildTenGodsPointItems(
  structureAnalysis: NonNullable<ReportInput["structureAnalysis"]>,
): string[] {
  const evidence = structureAnalysis.dayMasterStrength.evidence;
  const pointLabels = [
    {
      keyKo: "비겁",
      bodyKo: "자기 기준, 독립성, 경쟁심, 직접 밀고 나가는 힘을 봅니다.",
    },
    {
      keyKo: "인성",
      bodyKo: "학습, 분석, 보호 본능, 생각을 정리하는 힘을 봅니다.",
    },
    {
      keyKo: "식상",
      bodyKo: "표현, 생산, 말과 결과물로 자신을 드러내는 방식을 봅니다.",
    },
    {
      keyKo: "재성",
      bodyKo: "현실 감각, 성과, 자원 관리, 결과 의식을 봅니다.",
    },
    {
      keyKo: "관성",
      bodyKo: "책임, 기준, 평가, 역할 의식을 봅니다.",
    },
  ] as const;
  const items: string[] = [];

  for (const point of pointLabels) {
    const item = evidence.find((entry) => entry.keyKo === point.keyKo);

    if (item) {
      items.push(`${point.keyKo} ${item.valueKo}: ${point.bodyKo}`);
    }
  }

  return items;
}

function createTenGodsStructureBlocks(
  structureAnalysis: NonNullable<ReportInput["structureAnalysis"]>,
): ReportBlock[] {
  return [
    {
      kind: "KEY_VALUE",
      titleKo: "십성 묶음",
      keyValues: structureAnalysis.dayMasterStrength.evidence.map((item) => ({
        keyKo: item.keyKo,
        valueKo: item.valueKo,
      })),
    },
    {
      kind: "PARAGRAPH",
      titleKo: "십성 종합",
      bodyKo: buildTenGodsSummaryFromStructure(structureAnalysis),
    },
    {
      kind: "BULLET_LIST",
      titleKo: "십성 해석 포인트",
      itemsKo: buildTenGodsPointItems(structureAnalysis),
    },
  ];
}

function createTenGodsBlocks(input: ReportInput): ReportBlock[] {
  const blocks = [createTenGodsBlock(input)];

  if (input.structureAnalysis) {
    blocks.push(...createTenGodsStructureBlocks(input.structureAnalysis));
  } else {
    blocks.push(createTenGodsInterpretationBlock());
  }

  return blocks;
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

function createDayMasterBlocks(input: ReportInput): ReportBlock[] {
  const blocks: ReportBlock[] = [
    {
      kind: "HIGHLIGHT",
      titleKo: "일간",
      bodyKo: `${input.saju.dayMaster} 일간`,
    },
  ];
  const lookup = input.dayPillarProfile;

  if (!lookup?.ok) {
    blocks.push(createDayMasterInterpretationBlock(input));
    return blocks;
  }

  const { profile } = lookup;

  blocks.push(
    {
      kind: "KEY_VALUE",
      titleKo: "일주",
      keyValues: [
        {
          keyKo: "일주",
          valueKo: profile.nameKo,
        },
        {
          keyKo: "이미지",
          valueKo: profile.imageKo,
        },
      ],
    },
    {
      kind: "PARAGRAPH",
      titleKo: "일주 핵심",
      bodyKo: profile.coreSummaryKo,
    },
    {
      kind: "PARAGRAPH",
      titleKo: "일주 구조",
      bodyKo: profile.structureKo,
    },
    {
      kind: "BULLET_LIST",
      titleKo: "강점",
      itemsKo: profile.strengthItems.map(
        (item) => `${item.titleKo}: ${item.bodyKo}`,
      ),
    },
    {
      kind: "BULLET_LIST",
      titleKo: "주의할 흐름",
      itemsKo: profile.cautionItems.map(
        (item) => `${item.titleKo}: ${item.bodyKo}`,
      ),
    },
    {
      kind: "BULLET_LIST",
      titleKo: "활용 방향",
      itemsKo: profile.developmentItems.map(
        (item) => `${item.titleKo}: ${item.bodyKo}`,
      ),
    },
  );

  return blocks;
}

function createAdvancedPatternsFallbackBlock(input: ReportInput): ReportBlock {
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

function createAdvancedPatternsBlocks(input: ReportInput): ReportBlock[] {
  const structureAnalysis = input.structureAnalysis;

  if (!structureAnalysis) {
    return [createAdvancedPatternsFallbackBlock(input)];
  }

  const blocks: ReportBlock[] = [
    {
      kind: "HIGHLIGHT",
      titleKo: "신강신약",
      bodyKo: `${structureAnalysis.dayMasterStrength.labelKo}: ${structureAnalysis.dayMasterStrength.summaryKo}`,
    },
    {
      kind: "KEY_VALUE",
      titleKo: "구조 근거",
      keyValues: structureAnalysis.dayMasterStrength.evidence.map((item) => ({
        keyKo: item.keyKo,
        valueKo: item.valueKo,
      })),
    },
    {
      kind: "PARAGRAPH",
      titleKo: structureAnalysis.summary.titleKo,
      bodyKo: structureAnalysis.summary.bodyKo,
    },
  ];

  if (structureAnalysis.patterns.length > 0) {
    blocks.push({
      kind: "BULLET_LIST",
      titleKo: "구조 후보",
      itemsKo: structureAnalysis.patterns.map(
        (pattern) => `${pattern.labelKo}: ${pattern.summaryKo}`,
      ),
    });
  } else {
    blocks.push({
      kind: "PARAGRAPH",
      titleKo: "구조 후보",
      bodyKo:
        "현재 계산된 신호만으로는 특정 구조 하나를 강하게 잡기보다 전체 균형을 함께 보는 편이 적절합니다.",
    });
  }

  if (structureAnalysis.notices.length > 0) {
    blocks.push({
      kind: "BULLET_LIST",
      titleKo: "해석 기준",
      itemsKo: [...structureAnalysis.notices],
    });
  }

  return blocks;
}

function createShinsalBlock(input: ReportInput): ReportBlock {
  const shinsalTags = input.sajuTags.filter((tag) => tag.category === "SHINSAL");
  const itemsKo = selectVisibleShinsalItems(
    dedupeTagsByCode(shinsalTags).map(formatShinsalNarrative),
  );

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
    ...relations.stemCombinations.map((value) =>
      formatRelationItem("천간합", value, "합"),
    ),
    ...relations.branchCombinations.map((value) =>
      formatRelationItem("지지합", value, "합"),
    ),
    ...relations.branchClashes.map((value) =>
      formatRelationItem("지지충", value, "충"),
    ),
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
      blocks: createDayMasterBlocks(input),
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
      blocks: createTenGodsBlocks(input),
    }),
    createSection({
      id: "ADVANCED_PATTERNS",
      level: "PAID_FULL",
      titleKo: "고급 구조 후보",
      summaryKo: "고급 구조 후보는 단정이 아니라 해석을 위한 신호입니다.",
      blocks: createAdvancedPatternsBlocks(input),
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
