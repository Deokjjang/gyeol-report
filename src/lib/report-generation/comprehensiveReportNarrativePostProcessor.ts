import type {
  ComprehensiveReportV2Chapter,
  ComprehensiveReportV2Draft,
} from "./comprehensiveReportDraftTypes";

export type ComprehensiveReportFinalMessageNormalizerResult<T> = {
  readonly draft: T;
  readonly normalized: boolean;
};

const finalMessagePracticalMarkers = [
  "일",
  "관계",
  "돈",
  "회복",
  "표현",
  "기준",
  "루틴",
  "실천",
] as const;

const finalMessageActionMarkers = [
  "오늘",
  "첫째",
  "둘째",
  "셋째",
  "하나",
  "질문",
  "계좌",
  "쉬는 시간",
] as const;
const unsafeFinalAdviceMarkers = [
  "절대",
  "100%",
  "보장",
  "운명 확정",
  "진단",
  "치료",
  "우울증",
  "불안장애",
  "정신질환",
  "투자 추천",
  "법률 자문",
] as const;

function countDistinctMarkers(text: string, markers: readonly string[]): number {
  return markers.filter((marker) => text.includes(marker)).length;
}

function isComprehensiveReportV2DraftLike(
  value: unknown,
): value is ComprehensiveReportV2Draft {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }

  const candidate = value as {
    readonly version?: unknown;
    readonly productType?: unknown;
    readonly profileTable?: unknown;
    readonly chapters?: unknown;
  };

  return (
    candidate.version === "comprehensive_v2_draft" &&
    candidate.productType === "saju_mbti_full" &&
    typeof candidate.profileTable === "object" &&
    candidate.profileTable !== null &&
    Array.isArray(candidate.chapters)
  );
}

function getFinalMessageText(
  chapter: ComprehensiveReportV2Chapter,
  finalAdvice: string,
): string {
  return [
    chapter.headline,
    ...chapter.hitReadingLines,
    chapter.body,
    ...chapter.solutionLines,
    ...chapter.keyPhrases,
    finalAdvice,
  ].join("\n");
}

function needsFinalMessageNormalization(input: {
  readonly chapter: ComprehensiveReportV2Chapter;
  readonly finalAdvice: string;
}): boolean {
  const text = getFinalMessageText(input.chapter, input.finalAdvice);

  return (
    [
      ...input.chapter.hitReadingLines,
      input.chapter.body,
      ...input.chapter.solutionLines,
      ...input.chapter.keyPhrases,
    ].join("\n").trim().length < 650 ||
    input.finalAdvice.trim().length < 40 ||
    input.chapter.solutionLines.length < 4 ||
    countDistinctMarkers(text, finalMessagePracticalMarkers) < 3 ||
    countDistinctMarkers(text, finalMessageActionMarkers) < 3
  );
}

function buildProfilePhrase(profileTable: ComprehensiveReportV2Draft["profileTable"]): string {
  const primary = [
    profileTable.dayMaster,
    profileTable.dayPillar,
    profileTable.mbti,
  ].filter((value): value is string => typeof value === "string" && value.length > 0);
  const elements = [
    ...profileTable.excessiveElements,
    ...profileTable.missingElements,
  ].filter((value) => value.length > 0);

  return [
    primary.length > 0 ? `${primary.join(", ")} 기준으로 보면` : undefined,
    elements.length > 0 ? `${elements.join(", ")} 흐름까지 함께 보면` : undefined,
  ]
    .filter((value): value is string => value !== undefined)
    .join(" ");
}

function buildClosingParagraph(input: ComprehensiveReportV2Draft): string {
  const profilePhrase = buildProfilePhrase(input.profileTable);
  const prefix = profilePhrase.length > 0 ? `${profilePhrase}, ` : "";

  return [
    `${prefix}마지막 핵심은 더 세게 밀어붙이라는 말이 아닙니다.`,
    "덕민님에게 필요한 것은 방향성은 살리되, 회복과 표현을 일정 안에 넣고, 일·관계·돈의 기준을 스스로 닳지 않는 방식으로 다시 세우는 일입니다.",
    "일에서는 맡을 일과 버릴 일을 먼저 나누고, 관계에서는 상대가 말하는 감정을 바로 해결하려 들기보다 한 번 되받아 주는 시간이 필요합니다.",
    "돈에서는 벌 계획만큼 지키는 규칙이 중요하고, 회복에서는 기분이 좋아질 때까지 기다리기보다 쉬는 장치를 먼저 넣어야 합니다.",
    "오늘부터는 첫째, 쉬는 시간 하나를 일정에 먼저 넣고 밤에는 생각을 기록한 뒤 닫아 주세요.",
    "둘째, 중요한 관계 대화 전에는 결론보다 질문 하나를 먼저 꺼내 주세요.",
    "셋째, 돈은 쓰는 계좌와 지키는 계좌를 나누고 작은 방어 규칙 하나를 고정해 보세요.",
    "여기에 일주일에 한 번은 일정, 관계, 돈, 회복을 따로 점검해 어느 한쪽이 과열되지 않았는지 확인해 보세요.",
    "이 작은 실행이 쌓이면 성과를 내는 힘은 유지하면서도 관계와 회복이 같이 버티는 흐름으로 바뀔 수 있습니다.",
  ].join(" ");
}

void buildClosingParagraph;

function firstNonEmpty(values: readonly (string | undefined)[]): string | undefined {
  return values.find((value): value is string => typeof value === "string" && value.trim().length > 0);
}

function uniqueNonEmpty(values: readonly (string | undefined)[]): readonly string[] {
  return [...new Set(values.filter((value): value is string => typeof value === "string").map((value) => value.trim()).filter(Boolean))];
}

function toFeatureFlowTopic(
  value: string | undefined,
  fallback: string,
): string {
  const normalized = value?.trim();

  if (normalized === undefined || normalized.length === 0) {
    return fallback;
  }

  return normalized.endsWith("흐름") ? normalized : `${normalized} 흐름`;
}

function buildEvidenceClosingFeatureLabels(
  draft: ComprehensiveReportV2Draft,
): readonly string[] {
  return uniqueNonEmpty([
    draft.profileTable.dayPillar,
    draft.profileTable.dayMaster,
    ...(draft.profileTable.gwiinGilshin ?? draft.profileTable.gwiin ?? []),
    ...(draft.profileTable.majorSinsal ?? draft.profileTable.sinsal ?? []),
    ...(draft.profileTable.specialPatterns ?? []),
    ...(draft.profileTable.missingElements ?? []),
    ...(draft.profileTable.excessiveElements ?? []),
  ]).slice(0, 5);
}

function buildEvidenceClosingSolutionLines(
  draft: ComprehensiveReportV2Draft,
): readonly string[] {
  const labels = buildEvidenceClosingFeatureLabels(draft);
  const gwiin = firstNonEmpty(draft.profileTable.gwiinGilshin ?? draft.profileTable.gwiin);
  const moneyFeature = firstNonEmpty([
    ...(draft.profileTable.gwiinGilshin ?? draft.profileTable.gwiin ?? []),
    ...(draft.profileTable.tenGodSummary ?? []),
  ]);
  const communicationFeature = firstNonEmpty([
    ...(draft.profileTable.majorSinsal ?? draft.profileTable.sinsal ?? []),
    draft.profileTable.mbti,
  ]);
  const recoveryFeature = firstNonEmpty(draft.profileTable.missingElements);
  const requestTopic = toFeatureFlowTopic(gwiin ?? labels[0], "도움의 흐름");
  const moneyTopic = toFeatureFlowTopic(moneyFeature ?? labels[1], "자원 관리 흐름");
  const communicationTopic = toFeatureFlowTopic(
    communicationFeature,
    "빠른 판단 흐름",
  );
  const recoveryTopic = toFeatureFlowTopic(recoveryFeature, "회복 루틴 흐름");

  return [
    `오늘부터는 막힌 일을 안에서 오래 붙잡기보다, ${requestTopic}을 살리듯 필요한 도움을 한 문장으로 요청하세요.`,
    `돈은 생활비, 저축, 자기계발, 비상금으로 나눠 ${moneyTopic}이 살아날 자리를 정하세요.`,
    `관계에서는 결론보다 먼저 상대 말을 한 문장으로 받아주세요. ${communicationTopic}은 말의 온도를 조절할 때 강점으로 바뀝니다.`,
    `잠들기 전에는 기록으로 머리를 비우고, 침대에서는 문제 해결을 멈추세요. ${recoveryTopic}을 위해 오래 가는 차단 장치가 필요합니다.`,
  ];
}

function buildEvidenceClosingParagraph(draft: ComprehensiveReportV2Draft): string {
  const labels = buildEvidenceClosingFeatureLabels(draft);
  const primary = labels[0] ?? draft.profileTable.dayPillar ?? draft.profileTable.dayMaster ?? "이 사주";
  const support = labels[1] ?? "좋은 흐름";
  const caution = labels[2] ?? "주의할 흐름";
  const balance = labels[3] ?? "보완할 지점";
  const primaryTopic = toFeatureFlowTopic(primary, "이 사주 흐름");
  const supportTopic = toFeatureFlowTopic(support, "좋은 흐름");
  const cautionTopic = toFeatureFlowTopic(caution, "주의할 흐름");
  const balanceTopic = toFeatureFlowTopic(balance, "보완할 흐름");

  return [
    `이 리포트의 마지막 핵심은 더 세게 밀어붙이는 것이 아니라, ${primaryTopic}을 오래 쓰는 운영법을 만드는 일입니다.`,
    `${supportTopic}: 필요한 것을 정확히 요청하고 자리를 정할 때 더 잘 살아납니다.`,
    `${cautionTopic}: 말과 책임의 온도를 조절할 때 강점으로 바뀝니다.`,
    `${balanceTopic}: 일, 관계, 돈, 회복을 따로 보지 말고 하나의 루틴으로 묶어야 합니다.`,
    ...buildEvidenceClosingSolutionLines(draft),
  ].join(" ");
}

function normalizeFinalMessageChapter(
  draft: ComprehensiveReportV2Draft,
  chapter: ComprehensiveReportV2Chapter,
): ComprehensiveReportV2Chapter {
  const closingParagraph = buildEvidenceClosingParagraph(draft);
  const requiredSolutionLines = [
    "오늘부터 쉬는 시간 하나를 일정에 먼저 넣고 밤에는 기록으로 생각을 닫아 주세요.",
    "중요한 관계 대화 전에는 결론보다 질문 하나를 먼저 꺼내 주세요.",
    "돈은 쓰는 계좌와 지키는 계좌를 나누고 작은 방어 규칙 하나를 고정하세요.",
    "일에서는 맡을 일과 버릴 일을 나눠 기준을 문장으로 정리하세요.",
  ];
  void requiredSolutionLines;

  return {
    ...chapter,
    headline:
      chapter.headline.trim().length >= 12
        ? chapter.headline
        : "오래 가는 방식을 남기는 마지막 정리",
    body: `${chapter.body.trim()}\n\n${closingParagraph}`.trim(),
    solutionLines:
      chapter.solutionLines.length >= 4
        ? chapter.solutionLines
        : [
            ...chapter.solutionLines,
            ...buildEvidenceClosingSolutionLines(draft).slice(
              0,
              4 - chapter.solutionLines.length,
            ),
          ],
  };
}

function normalizeFinalAdvice(finalAdvice: string): string {
  if (unsafeFinalAdviceMarkers.some((marker) => finalAdvice.includes(marker))) {
    return finalAdvice;
  }

  return finalAdvice.trim().length >= 40
    ? finalAdvice
    : "방향성은 살리되 일, 관계, 돈, 회복의 기준을 오래 가는 방식으로 다시 세우세요.";
}

export function normalizeComprehensiveReportFinalMessage<T>(
  draft: T,
): ComprehensiveReportFinalMessageNormalizerResult<T> {
  if (!isComprehensiveReportV2DraftLike(draft)) {
    return {
      draft,
      normalized: false,
    };
  }

  const finalChapter = draft.chapters.find(
    (chapter) => chapter.chapterId === "final_message",
  );

  if (finalChapter === undefined) {
    return {
      draft,
      normalized: false,
    };
  }
  if (!needsFinalMessageNormalization({
    chapter: finalChapter,
    finalAdvice: draft.finalAdvice,
  })) {
    return {
      draft,
      normalized: false,
    };
  }

  return {
    draft: {
      ...draft,
      finalAdvice: normalizeFinalAdvice(draft.finalAdvice),
      chapters: draft.chapters.map((chapter) =>
        chapter.chapterId === "final_message"
          ? normalizeFinalMessageChapter(draft, chapter)
          : chapter,
      ),
    } as T,
    normalized: true,
  };
}
