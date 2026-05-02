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

function stringifyNumber(value: number): string {
  return String(value);
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
  const { labels } = input.saju.elements;

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

function createTenGodsBlock(input: ReportInput): ReportBlock {
  const { distribution } = input.saju.tenGods;

  return {
    kind: "KEY_VALUE",
    keyValues: [
      { keyKo: "비견", valueKo: stringifyNumber(distribution.比肩) },
      { keyKo: "겁재", valueKo: stringifyNumber(distribution.劫財) },
      { keyKo: "식신", valueKo: stringifyNumber(distribution.食神) },
      { keyKo: "상관", valueKo: stringifyNumber(distribution.傷官) },
      { keyKo: "편재", valueKo: stringifyNumber(distribution.偏財) },
      { keyKo: "정재", valueKo: stringifyNumber(distribution.正財) },
      { keyKo: "편관", valueKo: stringifyNumber(distribution.偏官) },
      { keyKo: "정관", valueKo: stringifyNumber(distribution.正官) },
      { keyKo: "편인", valueKo: stringifyNumber(distribution.偏印) },
      { keyKo: "정인", valueKo: stringifyNumber(distribution.正印) },
    ],
  };
}

function createAdvancedPatternsBlock(input: ReportInput): ReportBlock {
  const labels = input.sajuTags
    .filter((tag) => tag.category === "ADVANCED_PATTERN")
    .map((tag) => tag.labelKo);

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
  const itemsKo = input.sajuTags
    .filter((tag) => tag.category === "SHINSAL")
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
      ],
    }),
    createSection({
      id: "ELEMENTS",
      level: "PAID_FULL",
      titleKo: "오행",
      summaryKo:
        "오행은 목·화·토·금·수의 분포를 통해 에너지의 방향을 봅니다.",
      blocks: [createElementsBlock(input)],
    }),
    createSection({
      id: "TEN_GODS",
      level: "PAID_FULL",
      titleKo: "십성",
      summaryKo: "십성은 일간을 기준으로 관계되는 기운을 분류한 구조입니다.",
      blocks: [createTenGodsBlock(input)],
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
      "출생정보와 해석 결과는 자기이해용 참고자료입니다.",
    ]),
  };
}
