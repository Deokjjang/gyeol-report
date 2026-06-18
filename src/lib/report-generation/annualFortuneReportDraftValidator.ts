import {
  isAnnualFortuneReportMode,
  type AnnualFortuneReportDraft,
  type AnnualFortuneReportMode,
} from "./annualFortuneReportDraftTypes";

export type AnnualFortuneReportDraftValidationResult = {
  readonly ok: boolean;
  readonly errors: readonly string[];
  readonly warnings: readonly string[];
  readonly value?: AnnualFortuneReportDraft;
};

export type AnnualFortuneDraftQualitySummary = {
  readonly vagueCopyWarnings: number;
  readonly hardClaimWarnings: number;
  readonly internalArtifactWarnings: number;
  readonly rawEnglishSignalLabelWarnings: number;
  readonly repeatedTermWarnings: number;
  readonly genericFinalAdviceLabelWarnings: number;
  readonly finalAdviceDomainMismatchWarnings: number;
  readonly monthlyEvidenceMissingWarnings: number;
  readonly domainContextOverreachWarnings: number;
};

type AnnualFortuneLegacyScoreSummary = {
  readonly totalScore: number;
  readonly scoreLabel: string;
  readonly scoreCaution: string;
};

type AnnualFortuneScoreSummaryInput =
  | AnnualFortuneReportDraft["scoreSummary"]
  | AnnualFortuneLegacyScoreSummary;

type AnnualFortuneMonthlyFlowInput = Omit<
  AnnualFortuneReportDraft["monthlyFlow"][number],
  "monthGanji" | "monthlyBasis" | "natalInteractionSummary"
> &
  Partial<
    Pick<
      AnnualFortuneReportDraft["monthlyFlow"][number],
      "monthGanji" | "monthlyBasis" | "natalInteractionSummary"
    >
  >;

type AnnualFortuneReportDraftInput = Omit<
  AnnualFortuneReportDraft,
  "scoreSummary" | "userContextSummary" | "monthlyFlow"
> & {
  readonly scoreSummary: AnnualFortuneScoreSummaryInput;
  readonly userContextSummary?: AnnualFortuneReportDraft["userContextSummary"];
  readonly monthlyFlow: readonly AnnualFortuneMonthlyFlowInput[];
};

const hardClaimReplacements = [
  ["반드시", "흐름상"],
  ["무조건", "대체로"],
  ["합격합니다", "합격 가능성을 준비하게 됩니다"],
  ["불합격합니다", "결과 확인 전까지 보완이 필요합니다"],
  ["이직합니다", "이직을 검토하는 흐름으로 나타날 수 있습니다"],
  ["퇴사합니다", "퇴사를 고민하는 흐름으로 나타날 수 있습니다"],
  ["승진합니다", "승진이나 역할 확대를 준비하는 흐름이 생길 수 있습니다"],
  ["돈을 법니다", "돈의 흐름을 만들 기회가 생길 수 있습니다"],
  ["병이 생깁니다", "몸의 리듬을 더 살피는 흐름이 생길 수 있습니다"],
  ["결혼합니다", "관계를 공식화할지를 검토하는 흐름이 생길 수 있습니다"],
  ["헤어집니다", "관계의 거리와 기준을 다시 보게 될 수 있습니다"],
] as const;

const awkwardKoreanReplacements = [
  ["파트너십가", "파트너십이"],
  ["관리 부담가", "관리 부담이"],
  ["표현의 온도이", "표현의 온도가"],
  ["기준 정리이", "기준 정리가"],
  ["정화을", "정화를"],
  ["무토은", "무토는"],
  ["계수은", "계수는"],
] as const;

const repeatedTermReplacements = [
  ["식신(식신, 말·결과물·생산성)", "식신: 말·결과물·생산성"],
  ["상관(상관, 말·결과물·생산성)", "상관: 말·결과물·생산성"],
  ["甲 일간(갑 일간)", "甲(갑목) 일간"],
  ["乙 일간(을 일간)", "乙(을목) 일간"],
  ["丙 일간(병 일간)", "丙(병화) 일간"],
  ["丁 일간(정 일간)", "丁(정화) 일간"],
  ["戊 일간(무 일간)", "戊(무토) 일간"],
  ["己 일간(기 일간)", "己(기토) 일간"],
  ["庚 일간(경 일간)", "庚(경금) 일간"],
  ["辛 일간(신 일간)", "辛(신금) 일간"],
  ["壬 일간(임 일간)", "壬(임수) 일간"],
  ["癸 일간(계 일간)", "癸(계수) 일간"],
  ["토 과다(흙이 무거움)", "토 과다: 현실·책임·관리의 기운이 무거운 구조"],
] as const;

const finalAdviceBodyPrefixes = [
  "실행 기준",
  "일·성과",
  "돈·현실",
  "인간관계",
  "연애·가족",
  "학업·자격증",
  "몸·생활 리듬",
  "올해 운영법",
] as const;

const rawEnglishSignalLabels = [
  "opportunity",
  "difficulty",
  "mixed",
  "recovery",
  "caution",
] as const;

const internalForbiddenWords = [
  "evidence",
  "debug",
  "diagnostic-only",
  "진단용",
  "schema",
  "fixture",
] as const;

const modeToneMarkers = {
  past_review: ["그해", "회고", "그 시기", "왜", "흔들렸", "압박", "반복"],
  current_year: [
    "올해",
    "지금부터",
    "준비",
    "활용",
    "조율",
    "손실을 줄이",
    "흐름을 쓰",
    "상반기",
    "하반기",
  ],
  new_year_preview: ["신년", "준비", "활용", "기회", "조심", "흐름을 쓰"],
} as const satisfies Record<AnnualFortuneReportMode, readonly string[]>;

const pastReviewToneMarkers = modeToneMarkers.past_review;

const vagueAnnualFortunePhrases = [
  "책임이 커질 수 있습니다",
  "관계가 흔들릴 수 있습니다",
  "기회가 올 수 있습니다",
  "돈 문제가 생길 수 있습니다",
  "조심해야 합니다",
  "좋은 흐름입니다",
  "나쁜 흐름입니다",
] as const;

const concreteSceneMarkers = [
  "직장",
  "가족",
  "돈",
  "시험",
  "자격증",
  "승진",
  "이직",
  "관계",
  "연락",
  "일정",
  "계약",
  "성과",
  "결과물",
  "생활비",
  "부모",
  "동료",
  "상사",
  "프로젝트",
] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isStringArray(value: unknown): value is readonly string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function clampScore(score: number): number {
  return Math.max(0, Math.min(100, Math.round(score)));
}

export function sanitizeAnnualFortuneKoreanCopy(text: string): string {
  const normalized = [
    ...repeatedTermReplacements,
    ...awkwardKoreanReplacements,
    ...hardClaimReplacements,
  ]
    .reduce((current, [from, to]) => current.split(from).join(to), text)
    .replace(/卯午 파\(파,\s*[^)]+\)/gu, "卯午 파: 기존 방식이 깨지며 다시 조정되는 흐름")
    .replace(/午未 육합\(육합,\s*[^)]+\)/gu, "午未 육합: 실제 약속과 움직임이 묶이는 흐름")
    .replace(/식신\(식신,\s*([^)]+)\)/gu, "식신: $1")
    .replace(/상관\(상관,\s*([^)]+)\)/gu, "상관: $1")
    .replace(/파\(파,\s*([^)]+)\)/gu, "파: $1")
    .replace(/육합\(육합,\s*([^)]+)\)/gu, "육합: $1")
    .replace(/생\(생,\s*낳아줌\)/gu, "생: 기운을 보태는 작용")
    .replace(/甲 일간\(갑 일간\)/gu, "甲(갑목) 일간")
    .replace(/([식상정편비겁재관인]{2})\(\1,\s*([^)]+)\)/gu, "$1: $2")
    .replace(/\b(Partner|Family) ([AB])을/g, "$1 $2를")
    .replace(/\b(Partner|Family) ([AB])은/g, "$1 $2는")
    .replace(/\b(Partner|Family) ([AB])이/g, "$1 $2가");

  return internalForbiddenWords
    .reduce(
      (current, word) => current.replace(new RegExp(word, "giu"), ""),
      normalized,
    )
    .replace(/\s{2,}/g, " ")
    .trim();
}

export function sanitizeAnnualFortuneVisibleText(text: string): string {
  return sanitizeAnnualFortuneKoreanCopy(text);
}

function sanitizeStringArray(values: readonly string[]): readonly string[] {
  return values.map(sanitizeAnnualFortuneKoreanCopy);
}

function stripAnnualFinalAdvicePrefix(text: string): string {
  let sanitized = sanitizeAnnualFortuneKoreanCopy(text);

  for (const prefix of finalAdviceBodyPrefixes) {
    const marker = `${prefix}:`;

    if (sanitized.startsWith(marker)) {
      sanitized = sanitized.slice(marker.length).trim();
    }
  }

  return sanitized;
}

export type AnnualAdviceDomainLabel =
  | "일·성과"
  | "돈·현실"
  | "인간관계"
  | "연애·가족"
  | "학업·자격증"
  | "몸·생활 리듬"
  | "올해 운영법";

export function inferAnnualAdviceDomain(body: string): AnnualAdviceDomainLabel {
  const text = sanitizeAnnualFortuneKoreanCopy(body);
  const rules: readonly {
    readonly label: AnnualAdviceDomainLabel;
    readonly keywords: readonly string[];
    readonly priority: number;
  }[] = [
    {
      label: "몸·생활 리듬",
      keywords: ["수면", "식사", "피로", "회복", "컨디션", "휴식", "몸", "일정 과밀"],
      priority: 1,
    },
    {
      label: "학업·자격증",
      keywords: [
        "시험",
        "자격증",
        "공부",
        "오답",
        "요약",
        "발표",
        "포트폴리오",
        "실기",
        "업무 공부",
        "실무 정리",
      ],
      priority: 2,
    },
    {
      label: "돈·현실",
      keywords: ["돈", "급여", "생활비", "정산", "계약", "지출", "고정비", "관리비", "비용", "예산"],
      priority: 3,
    },
    {
      label: "연애·가족",
      keywords: ["연인", "연애", "가족", "부모", "집안", "만남", "약속", "가족 일정"],
      priority: 4,
    },
    {
      label: "일·성과",
      keywords: [
        "직장",
        "상사",
        "동료",
        "프로젝트",
        "보고",
        "마감",
        "성과",
        "업무",
        "서비스 기획",
        "개발 결과물",
        "회의",
      ],
      priority: 5,
    },
    {
      label: "인간관계",
      keywords: ["친구", "연락", "메시지", "오해", "관계", "거리감", "말투", "대화"],
      priority: 6,
    },
  ];
  const ranked = rules
    .map((rule) => ({
      label: rule.label,
      priority: rule.priority,
      matches: rule.keywords.filter((keyword) => text.includes(keyword))
        .length,
    }))
    .filter((rule) => rule.matches > 0)
    .sort((first, second) => {
      if (first.matches !== second.matches) {
        return second.matches - first.matches;
      }

      return first.priority - second.priority;
    });

  return ranked[0]?.label ?? "올해 운영법";
}

function normalizeOptionalMonthlyText(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const sanitized = sanitizeAnnualFortuneKoreanCopy(value);

  return sanitized.length === 0 ? null : sanitized;
}

function normalizeMonthlyBasis(value: unknown): string | null {
  const sanitized = normalizeOptionalMonthlyText(value);

  return sanitized ?? "달력월 기준 운영 가이드";
}

function hasNewScoreSummary(
  value: AnnualFortuneScoreSummaryInput,
): value is AnnualFortuneReportDraft["scoreSummary"] {
  return "flowIndex" in value;
}

function sanitizeScoreSummary(
  scoreSummary: AnnualFortuneScoreSummaryInput,
): AnnualFortuneReportDraft["scoreSummary"] {
  if (hasNewScoreSummary(scoreSummary)) {
    return {
      flowIndex: clampScore(scoreSummary.flowIndex),
      flowTypeLabel: sanitizeAnnualFortuneKoreanCopy(
        scoreSummary.flowTypeLabel,
      ),
      flowIndexCaution: sanitizeAnnualFortuneKoreanCopy(
        scoreSummary.flowIndexCaution,
      ),
    };
  }

  return {
    flowIndex: clampScore(scoreSummary.totalScore),
    flowTypeLabel: sanitizeAnnualFortuneKoreanCopy(scoreSummary.scoreLabel),
    flowIndexCaution: sanitizeAnnualFortuneKoreanCopy(
      scoreSummary.scoreCaution,
    ),
  };
}

function sanitizeUserContextSummary(
  summary: AnnualFortuneReportDraftInput["userContextSummary"],
): AnnualFortuneReportDraft["userContextSummary"] {
  if (summary === undefined) {
    return {
      lifeStatusLabel: "기타",
      fieldLabel: null,
      translationNote:
        "현재 상태와 분야 정보가 충분하지 않아 전체 흐름 장면으로 해석했습니다.",
    };
  }

  const fieldLabel =
    summary.fieldLabel === null
      ? null
      : sanitizeAnnualFortuneKoreanCopy(summary.fieldLabel);

  return {
    lifeStatusLabel: sanitizeAnnualFortuneKoreanCopy(summary.lifeStatusLabel),
    fieldLabel:
      fieldLabel === null || fieldLabel.trim().length === 0
        ? null
        : fieldLabel,
    translationNote: sanitizeAnnualFortuneKoreanCopy(summary.translationNote),
  };
}

function sanitizeDraft(draft: AnnualFortuneReportDraftInput): AnnualFortuneReportDraft {
  return {
    version: draft.version,
    productType: draft.productType,
    productVersion: draft.productVersion,
    targetYear: draft.targetYear,
    mode: draft.mode,
    personLabel: sanitizeAnnualFortuneKoreanCopy(draft.personLabel),
    userContextSummary: sanitizeUserContextSummary(draft.userContextSummary),
    openingTitle: sanitizeAnnualFortuneKoreanCopy(draft.openingTitle),
    openingSummary: sanitizeAnnualFortuneKoreanCopy(draft.openingSummary),
    coreLine: sanitizeAnnualFortuneKoreanCopy(draft.coreLine),
    yearSummary: {
      ganji: sanitizeAnnualFortuneKoreanCopy(draft.yearSummary.ganji),
      displayTitle: sanitizeAnnualFortuneKoreanCopy(draft.yearSummary.displayTitle),
      elementLabel: sanitizeAnnualFortuneKoreanCopy(draft.yearSummary.elementLabel),
      tenGodLabel: sanitizeAnnualFortuneKoreanCopy(draft.yearSummary.tenGodLabel),
      modeLabel: sanitizeAnnualFortuneKoreanCopy(draft.yearSummary.modeLabel),
      yearTone: sanitizeAnnualFortuneKoreanCopy(draft.yearSummary.yearTone),
    },
    scoreSummary: sanitizeScoreSummary(draft.scoreSummary),
    flowCards: draft.flowCards.map((card) => ({
      label: sanitizeAnnualFortuneKoreanCopy(card.label),
      score: clampScore(card.score),
      headline: sanitizeAnnualFortuneKoreanCopy(card.headline),
      body: sanitizeAnnualFortuneKoreanCopy(card.body),
    })),
    keySignals: draft.keySignals.map((signal) => ({
      ...signal,
      title: sanitizeAnnualFortuneKoreanCopy(signal.title),
      body: sanitizeAnnualFortuneKoreanCopy(signal.body),
      evidenceLabel: sanitizeAnnualFortuneKoreanCopy(signal.evidenceLabel),
    })),
    annualStructure: {
      ganjiExplanation: sanitizeAnnualFortuneKoreanCopy(
        draft.annualStructure.ganjiExplanation,
      ),
      tenGodExplanation: sanitizeAnnualFortuneKoreanCopy(
        draft.annualStructure.tenGodExplanation,
      ),
      elementEffectExplanation: sanitizeAnnualFortuneKoreanCopy(
        draft.annualStructure.elementEffectExplanation,
      ),
      branchInteractionExplanation: sanitizeAnnualFortuneKoreanCopy(
        draft.annualStructure.branchInteractionExplanation,
      ),
    },
    chapters: draft.chapters.map((chapter) => ({
      title: sanitizeAnnualFortuneKoreanCopy(chapter.title),
      headline: sanitizeAnnualFortuneKoreanCopy(chapter.headline),
      body: sanitizeAnnualFortuneKoreanCopy(chapter.body),
      likelyScenes: sanitizeStringArray(chapter.likelyScenes),
      practicalAdvice: sanitizeStringArray(chapter.practicalAdvice),
    })),
    monthlyFlow: draft.monthlyFlow.map((flow) => ({
      month: flow.month,
      label: sanitizeAnnualFortuneKoreanCopy(flow.label),
      headline: sanitizeAnnualFortuneKoreanCopy(flow.headline),
      monthGanji: normalizeOptionalMonthlyText(flow.monthGanji),
      monthlyBasis: normalizeMonthlyBasis(flow.monthlyBasis),
      elementFocus: normalizeOptionalMonthlyText(flow.elementFocus),
      natalInteractionSummary: normalizeOptionalMonthlyText(
        flow.natalInteractionSummary,
      ),
      body: sanitizeAnnualFortuneKoreanCopy(flow.body),
      advice: sanitizeAnnualFortuneKoreanCopy(flow.advice),
    })),
    finalAdvice: draft.finalAdvice.map(stripAnnualFinalAdvicePrefix),
    safetyNotes: sanitizeStringArray(draft.safetyNotes),
  };
}

function hasScoreSummaryShape(
  value: unknown,
): value is AnnualFortuneScoreSummaryInput {
  if (!isRecord(value)) {
    return false;
  }

  return (
    (isNumber(value.flowIndex) &&
      typeof value.flowTypeLabel === "string" &&
      typeof value.flowIndexCaution === "string") ||
    (isNumber(value.totalScore) &&
      typeof value.scoreLabel === "string" &&
      typeof value.scoreCaution === "string")
  );
}

function hasDraftShape(value: unknown): value is AnnualFortuneReportDraftInput {
  if (!isRecord(value)) {
    return false;
  }

  const draft = value as Partial<AnnualFortuneReportDraft>;

  return (
    draft.version === "v1" &&
    draft.productType === "annual_fortune" &&
    draft.productVersion === "v1" &&
    isNumber(draft.targetYear) &&
    isAnnualFortuneReportMode(draft.mode) &&
    typeof draft.personLabel === "string" &&
    typeof draft.openingTitle === "string" &&
    typeof draft.openingSummary === "string" &&
    typeof draft.coreLine === "string" &&
    isRecord(draft.yearSummary) &&
    typeof draft.yearSummary.ganji === "string" &&
    typeof draft.yearSummary.displayTitle === "string" &&
    typeof draft.yearSummary.elementLabel === "string" &&
    typeof draft.yearSummary.tenGodLabel === "string" &&
    typeof draft.yearSummary.modeLabel === "string" &&
    typeof draft.yearSummary.yearTone === "string" &&
    hasScoreSummaryShape(draft.scoreSummary) &&
    Array.isArray(draft.flowCards) &&
    Array.isArray(draft.keySignals) &&
    isRecord(draft.annualStructure) &&
    typeof draft.annualStructure.ganjiExplanation === "string" &&
    typeof draft.annualStructure.tenGodExplanation === "string" &&
    typeof draft.annualStructure.elementEffectExplanation === "string" &&
    typeof draft.annualStructure.branchInteractionExplanation === "string" &&
    Array.isArray(draft.chapters) &&
    Array.isArray(draft.monthlyFlow) &&
    isStringArray(draft.finalAdvice) &&
    isStringArray(draft.safetyNotes)
  );
}

function collectVisibleStrings(draft: AnnualFortuneReportDraft): readonly string[] {
  return [
    draft.openingTitle,
    draft.openingSummary,
    draft.coreLine,
    draft.userContextSummary.lifeStatusLabel,
    draft.userContextSummary.fieldLabel ?? "",
    draft.userContextSummary.translationNote,
    draft.yearSummary.ganji,
    draft.yearSummary.displayTitle,
    draft.yearSummary.elementLabel,
    draft.yearSummary.tenGodLabel,
    draft.yearSummary.modeLabel,
    draft.yearSummary.yearTone,
    draft.scoreSummary.flowTypeLabel,
    draft.scoreSummary.flowIndexCaution,
    ...draft.flowCards.flatMap((card) => [
      card.label,
      card.headline,
      card.body,
    ]),
    ...draft.keySignals.flatMap((signal) => [
      signal.title,
      signal.body,
      signal.evidenceLabel,
    ]),
    draft.annualStructure.ganjiExplanation,
    draft.annualStructure.tenGodExplanation,
    draft.annualStructure.elementEffectExplanation,
    draft.annualStructure.branchInteractionExplanation,
    ...draft.chapters.flatMap((chapter) => [
      chapter.title,
      chapter.headline,
      chapter.body,
      ...chapter.likelyScenes,
      ...chapter.practicalAdvice,
    ]),
    ...draft.monthlyFlow.flatMap((flow) => [
      flow.label,
      flow.headline,
      flow.monthGanji ?? "",
      flow.monthlyBasis ?? "",
      flow.elementFocus ?? "",
      flow.natalInteractionSummary ?? "",
      flow.body,
      flow.advice,
    ]),
    ...draft.finalAdvice,
    ...draft.safetyNotes,
  ];
}

function splitVisibleSentences(text: string): readonly string[] {
  return text
    .split(/(?<=[.!?。！？]|다\.|요\.|니다\.)\s+/u)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 0);
}

function countOccurrences(text: string, phrase: string): number {
  return phrase.length === 0 ? 0 : text.split(phrase).length - 1;
}

function containsConcreteSceneMarker(sentence: string): boolean {
  return concreteSceneMarkers.some((marker) => sentence.includes(marker));
}

function countRepeatedTerminologyWarnings(visibleText: string): number {
  const patterns = [
    /식신\(식신,/gu,
    /상관\(상관,/gu,
    /파\(파,/gu,
    /육합\(육합,/gu,
    /생\(생,/gu,
    /甲 일간\(갑 일간\)/gu,
  ];

  return patterns.reduce(
    (count, pattern) => count + (visibleText.match(pattern)?.length ?? 0),
    0,
  );
}

function countMonthlyEvidenceMissingWarnings(
  draft: AnnualFortuneReportDraft,
): number {
  return draft.monthlyFlow.filter(
    (flow) =>
      flow.monthGanji === null ||
      flow.monthlyBasis === null ||
      flow.elementFocus === null ||
      flow.natalInteractionSummary === null,
  ).length;
}

function countDomainContextOverreachWarnings(
  draft: AnnualFortuneReportDraft,
): number {
  const overreachRules: readonly {
    readonly label: string;
    readonly forbidden: readonly string[];
  }[] = [
    {
      label: "연애·가족",
      forbidden: ["상사", "동료", "프로젝트", "보고", "마감", "서비스 기획"],
    },
    {
      label: "몸·생활 리듬",
      forbidden: ["상사", "동료", "프로젝트", "역할 분담", "보고"],
    },
    {
      label: "학업·자격증",
      forbidden: ["생활비", "정산", "관리비", "가족 일정"],
    },
  ];

  return draft.flowCards.filter((card) => {
    const rule = overreachRules.find((item) => item.label === card.label);

    if (rule === undefined) {
      return false;
    }

    const text = `${card.headline}\n${card.body}`;

    return rule.forbidden.some((keyword) => text.includes(keyword));
  }).length;
}

function countFinalAdviceDomainMismatchWarnings(
  draft: AnnualFortuneReportDraft,
): number {
  return draft.finalAdvice.filter((advice) => {
    const explicitLabel = finalAdviceBodyPrefixes.find((prefix) =>
      advice.startsWith(`${prefix}:`),
    );

    return (
      explicitLabel !== undefined &&
      explicitLabel !== inferAnnualAdviceDomain(advice)
    );
  }).length;
}

export function summarizeAnnualFortuneDraftQuality(
  draft: AnnualFortuneReportDraft,
): AnnualFortuneDraftQualitySummary {
  const visibleText = collectVisibleStrings(draft).join("\n");
  const visibleSentences = splitVisibleSentences(visibleText);
  const vagueCopyWarnings = visibleSentences.filter((sentence) =>
    vagueAnnualFortunePhrases.some((phrase) => sentence.includes(phrase)) &&
    !containsConcreteSceneMarker(sentence),
  ).length;
  const hardClaimWarnings = hardClaimReplacements.reduce(
    (count, [phrase]) => count + countOccurrences(visibleText, phrase),
    0,
  );
  const internalArtifactWarnings = internalForbiddenWords.reduce(
    (count, phrase) =>
      count + countOccurrences(visibleText.toLowerCase(), phrase.toLowerCase()),
    0,
  );
  const rawEnglishSignalLabelWarnings = rawEnglishSignalLabels.reduce(
    (count, label) =>
      count + countOccurrences(visibleText.toLowerCase(), label.toLowerCase()),
    0,
  );
  const repeatedTermWarnings = repeatedTermReplacements.reduce(
    (count, [phrase]) => count + countOccurrences(visibleText, phrase),
    countRepeatedTerminologyWarnings(visibleText),
  );
  const genericFinalAdviceLabelWarnings = draft.finalAdvice.filter((advice) =>
    finalAdviceBodyPrefixes.some((prefix) => advice.startsWith(`${prefix}:`)),
  ).length;
  const finalAdviceDomainMismatchWarnings =
    countFinalAdviceDomainMismatchWarnings(draft);
  const monthlyEvidenceMissingWarnings =
    countMonthlyEvidenceMissingWarnings(draft);
  const domainContextOverreachWarnings =
    countDomainContextOverreachWarnings(draft);

  return {
    vagueCopyWarnings,
    hardClaimWarnings,
    internalArtifactWarnings,
    rawEnglishSignalLabelWarnings,
    repeatedTermWarnings,
    genericFinalAdviceLabelWarnings,
    finalAdviceDomainMismatchWarnings,
    monthlyEvidenceMissingWarnings,
    domainContextOverreachWarnings,
  };
}

function validateArrayLengths(
  draft: AnnualFortuneReportDraft,
  errors: string[],
): void {
  if (draft.chapters.length < 6 || draft.chapters.length > 10) {
    errors.push("ANNUAL_FORTUNE_CHAPTER_COUNT_INVALID");
  }
  for (const [index, chapter] of draft.chapters.entries()) {
    if (chapter.likelyScenes.length < 2 || chapter.likelyScenes.length > 4) {
      errors.push(`ANNUAL_FORTUNE_LIKELY_SCENES_INVALID:${index}`);
    }
    if (
      chapter.practicalAdvice.length < 2 ||
      chapter.practicalAdvice.length > 4
    ) {
      errors.push(`ANNUAL_FORTUNE_PRACTICAL_ADVICE_INVALID:${index}`);
    }
  }
  if (draft.monthlyFlow.length !== 12) {
    errors.push("ANNUAL_FORTUNE_MONTHLY_FLOW_INVALID");
  }
  if (draft.finalAdvice.length < 4 || draft.finalAdvice.length > 7) {
    errors.push("ANNUAL_FORTUNE_FINAL_ADVICE_INVALID");
  }
  if (draft.safetyNotes.length < 2 || draft.safetyNotes.length > 4) {
    errors.push("ANNUAL_FORTUNE_SAFETY_NOTES_INVALID");
  }
}

function validateModeTone(
  draft: AnnualFortuneReportDraft,
  visibleText: string,
  errors: string[],
): void {
  const markers = modeToneMarkers[draft.mode];

  if (!markers.some((marker) => visibleText.includes(marker))) {
    errors.push(`ANNUAL_FORTUNE_MODE_TONE_MISSING:${draft.mode}`);
  }

  if (draft.mode === "current_year") {
    const currentMarkerCount = modeToneMarkers.current_year.filter((marker) =>
      visibleText.includes(marker),
    ).length;
    const pastMarkerCount = pastReviewToneMarkers.filter((marker) =>
      visibleText.includes(marker),
    ).length;

    if (pastMarkerCount >= 3 && currentMarkerCount < 2) {
      errors.push("ANNUAL_FORTUNE_CURRENT_YEAR_TONE_REVIEW_ONLY");
    }
  }
}

function validateCurrentYearCoreTone(
  draft: AnnualFortuneReportDraft,
  errors: string[],
): void {
  if (draft.mode !== "current_year") {
    return;
  }

  const coreToneText = [
    draft.openingSummary,
    draft.coreLine,
    draft.yearSummary.yearTone,
  ].join("\n");
  const currentMarkerCount = modeToneMarkers.current_year.filter((marker) =>
    coreToneText.includes(marker),
  ).length;
  const pastMarkerCount = pastReviewToneMarkers.filter((marker) =>
    coreToneText.includes(marker),
  ).length;

  if (pastMarkerCount >= 3 && currentMarkerCount < 2) {
    errors.push("ANNUAL_FORTUNE_CURRENT_YEAR_TONE_REVIEW_ONLY");
  }
}

export function validateAnnualFortuneReportDraft(
  draft: unknown,
): AnnualFortuneReportDraftValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!hasDraftShape(draft)) {
    return {
      ok: false,
      errors: ["ANNUAL_FORTUNE_SCHEMA_INVALID"],
      warnings,
    };
  }

  const sanitizedDraft = sanitizeDraft(draft);
  validateArrayLengths(sanitizedDraft, errors);

  const visibleText = collectVisibleStrings(sanitizedDraft).join("\n");
  validateModeTone(sanitizedDraft, visibleText, errors);
  validateCurrentYearCoreTone(sanitizedDraft, errors);
  const quality = summarizeAnnualFortuneDraftQuality(sanitizedDraft);

  if (quality.vagueCopyWarnings > 0) {
    warnings.push(
      `ANNUAL_FORTUNE_VAGUE_COPY_WARNING:${quality.vagueCopyWarnings}`,
    );
  }

  for (const word of internalForbiddenWords) {
    if (visibleText.toLowerCase().includes(word.toLowerCase())) {
      errors.push(`ANNUAL_FORTUNE_INTERNAL_WORD_VISIBLE:${word}`);
    }
  }

  return errors.length === 0
    ? { ok: true, errors: [], warnings, value: sanitizedDraft }
    : { ok: false, errors, warnings };
}

export function assertValidAnnualFortuneReportDraft(
  draft: unknown,
): AnnualFortuneReportDraft {
  const result = validateAnnualFortuneReportDraft(draft);

  if (!result.ok || result.value === undefined) {
    throw new Error(
      `Annual fortune report draft is invalid: ${result.errors.join("; ")}`,
    );
  }

  return result.value;
}
