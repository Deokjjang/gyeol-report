import {
  majorFortuneDomainLabels,
  type MajorFortuneDraftFlowSection,
  type MajorFortuneDomainLabel,
  type MajorFortunePhase,
  type MajorFortuneReportDraft,
} from "./majorFortuneReportDraftTypes";

export type MajorFortuneReportDraftValidationResult = {
  readonly ok: boolean;
  readonly errors: readonly string[];
  readonly warnings: readonly string[];
  readonly value?: MajorFortuneReportDraft;
};

export type MajorFortuneDraftQualitySummary = {
  readonly hardClaimWarnings: number;
  readonly internalArtifactWarnings: number;
  readonly repeatedTerminologyWarnings: number;
  readonly annualToneWarnings: number;
  readonly decadeToneWarnings: number;
  readonly strongYearReasonWarnings: number;
  readonly cycleYearTimelineCount: number;
  readonly missingCycleYearWarnings: number;
  readonly cycleIndexLeakWarnings: number;
  readonly technicalTermWithoutExplanationWarnings: number;
  readonly smallEventOverfocusWarnings: number;
  readonly wrongCycleBasisWarnings: number;
  readonly genericTimelineWarnings: number;
  readonly repeatedSummaryWarnings: number;
  readonly weakStrategyWarnings: number;
  readonly relationshipStatusMisuseWarnings: number;
  readonly strongYearTitleRepeatWarnings: number;
  readonly repeatedThemeWarnings: number;
  readonly repeatedStrategyWarnings: number;
  readonly emptyMyeongliBasisWarnings: number;
  readonly duplicateBigThemeWarnings: number;
  readonly duplicateBigThemeDomainWarnings: number;
  readonly duplicateStrongYearPushWarnings: number;
  readonly duplicateStrongYearReduceWarnings: number;
  readonly duplicateTopPushWarnings: number;
  readonly duplicateTopReduceWarnings: number;
  readonly shortStrategyBodyWarnings: number;
  readonly unknownStatusExposureWarnings: number;
  readonly weakSpecificityWarnings: number;
  readonly unknownRelationshipPillWarnings: number;
  readonly slashSeparatedWhyStrongWarnings: number;
  readonly duplicateStrongYearHeadlineWarnings: number;
  readonly weakAuxiliaryStarWarnings: number;
  readonly timelineSpacingWarnings: number;
  readonly ageBasisRepetitionWarnings: number;
};

export const DEFAULT_MAJOR_FORTUNE_SAFETY_NOTES = [
  "이 리포트는 대운의 10년 배경과 반복 패턴을 해석한 것이며, 특정 사건을 단정하지 않습니다.",
  "강하게 체감될 수 있는 해는 가능성이 두드러지는 시기를 뜻하며, 결과를 보장하지 않습니다.",
  "연애·관계·돈·직업 해석은 제공된 입력값과 명리 근거를 바탕으로 한 방향성 해석입니다.",
  "건강 관련 문장은 생활 리듬과 자기관리 관점으로만 읽고, 의학적 진단으로 사용하지 마세요.",
] as const;

const hardClaimReplacements = [
  ["반드시", "대체로"],
  ["무조건", "상황에 따라"],
  ["합격합니다", "합격 가능성을 준비하는 흐름입니다"],
  ["불합격합니다", "결과 확인 전까지 보완이 필요한 흐름입니다"],
  ["이직합니다", "이직을 검토하는 흐름으로 나타날 수 있습니다"],
  ["퇴사합니다", "퇴사 여부를 검토하는 흐름으로 나타날 수 있습니다"],
  ["승진합니다", "승진이나 역할 변화를 준비하는 흐름으로 나타날 수 있습니다"],
  ["돈을 법니다", "돈의 흐름을 만들 가능성이 있습니다"],
  ["병이 생깁니다", "몸의 리듬을 살펴야 하는 흐름입니다"],
  ["결혼합니다", "관계를 공식화할지 검토하는 흐름으로 나타날 수 있습니다"],
  ["헤어집니다", "관계의 거리와 기준을 다시 보게 될 수 있습니다"],
  ["망합니다", "손실을 줄이는 기준이 중요합니다"],
  ["성공합니다", "성과로 이어질 가능성을 준비하는 흐름입니다"],
] as const;

const internalForbiddenWords = [
  "evidence",
  "debug",
  "diagnostic-only",
  "진단용",
  "schema",
  "fixture",
  "precomputed",
  "백호대살",
] as const;

const deterministicForbiddenExpressions = [
  "특정 사건/날짜 예언",
  "질병/사고/사망 예언",
  "사망 예언",
  "투자 수익 보장",
  "수익 보장",
  "합격 확정",
  "승진 확정",
  "이직 확정",
  "결혼 확정",
  "이혼 확정",
  "공포 조장",
] as const;

const stemDayMasterReplacements = [
  ["甲일간", "甲(갑목) 일간"],
  ["甲 일간", "甲(갑목) 일간"],
  ["乙일간", "乙(을목) 일간"],
  ["乙 일간", "乙(을목) 일간"],
  ["丙일간", "丙(병화) 일간"],
  ["丙 일간", "丙(병화) 일간"],
  ["丁일간", "丁(정화) 일간"],
  ["丁 일간", "丁(정화) 일간"],
  ["戊일간", "戊(무토) 일간"],
  ["戊 일간", "戊(무토) 일간"],
  ["己일간", "己(기토) 일간"],
  ["己 일간", "己(기토) 일간"],
  ["庚일간", "庚(경금) 일간"],
  ["庚 일간", "庚(경금) 일간"],
  ["辛일간", "辛(신금) 일간"],
  ["辛 일간", "辛(신금) 일간"],
  ["壬일간", "壬(임수) 일간"],
  ["壬 일간", "壬(임수) 일간"],
  ["癸일간", "癸(계수) 일간"],
  ["癸 일간", "癸(계수) 일간"],
] as const;

const repeatedTerms = [
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
  "충",
  "형",
  "해",
  "파",
  "육합",
  "삼합",
  "반합",
] as const;

const phaseOrder = ["early", "middle", "late"] as const satisfies readonly MajorFortunePhase[];

const timelineYearDetailFields = [
  "myeongliSummary",
  "daeunAnnualRelation",
  "natalAnnualRelation",
  "careerWork",
  "moneyResource",
  "relationshipLove",
  "healthRoutine",
  "socialFamily",
  "studyGrowth",
  "mbtiExpression",
  "caution",
  "actionStandard",
] as const;

const annualTonePhrases = [
  "올해",
  "이번 해",
  "2026년에는",
  "올해는",
  "월별",
  "1월",
  "2월",
] as const;

const decadeToneMarkers = [
  "이 대운",
  "이 10년",
  "이 구간",
  "반복",
  "초반",
  "중반",
  "후반",
  "나이 구간",
  "연도 구간",
  "이전 대운",
  "다음 대운",
] as const;

const strongYearReasonMarkers = [
  "오행",
  "십성",
  "대운",
  "원국",
  "지지",
  "천간",
  "충",
  "합",
  "형",
  "파",
  "부족",
  "과다",
  "반복",
  "강화",
] as const;

const technicalTermPlainMarkers = [
  "즉",
  "쉽게 말해",
  "비유하면",
  "말하자면",
  "힘",
  "기준",
  "작용",
  "배경",
  "흐름",
  "테마",
  "구조",
  "역할",
  "장면",
] as const;

const technicalTerms = [
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
  "충",
  "형",
  "해",
  "파",
  "육합",
  "삼합",
  "반합",
] as const;

const smallEventMarkers = [
  "오늘",
  "내일",
  "이번 주",
  "이번 달",
  "1월",
  "2월",
  "3월",
  "4월",
  "5월",
  "6월",
  "7월",
  "8월",
  "9월",
  "10월",
  "11월",
  "12월",
] as const;

const genericTimelinePhrases = [
  "대운 지지 또는 원국 지지와 강한 작용",
  "대운의 장기 과제 위에",
  "역할, 돈, 관계의 우선순위를 다시 잡아야 하는 해",
  "흐름을 봅니다",
] as const;

const repeatedStrategyLimit = 3;
const repeatedStrongYearStrategyLimit = 1;

const relationshipKnownClaimPhrases = [
  "솔로탈출",
  "애인",
  "배우자",
  "결혼",
] as const;

const unknownRelationshipExposurePhrases = [
  "관계 상태가 미입력",
  "연애 상태가 입력되지",
  "관계 상태 미입력",
  "연애 상태 미입력",
  "미입력이므로",
  "입력되지 않아",
] as const;

const specificityMarkers = [
  "프로젝트",
  "계약",
  "연봉",
  "외부 프로젝트",
  "수익화",
  "연애",
  "결혼",
  "독립",
  "주거",
  "생활비",
  "포트폴리오",
  "보고",
  "문서",
  "일정",
  "연락",
  "가족",
  "수면",
  "식사",
] as const;

const weakAuxiliaryStarPhrases = [
  "생활 장면으로만 조심스럽게 참고합니다",
  "조심스럽게 참고합니다",
] as const;

const weakStrategyPhrases = [
  "조심하세요",
  "잘 활용하세요",
  "노력하세요",
  "좋은 흐름입니다",
] as const;

const repeatedThemeWords = [
  "책임",
  "정리",
  "관리",
  "구조",
  "문서화",
  "일정",
  "고정지출",
] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isStringArray(value: unknown): value is readonly string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isTimelineYearDetail(
  value: unknown,
): value is MajorFortuneReportDraft["majorFortuneTimelineRows"][number]["yearDetail"] {
  return (
    isRecord(value) &&
    timelineYearDetailFields.every((field) => typeof value[field] === "string")
  );
}

function isNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isBoolean(value: unknown): value is boolean {
  return typeof value === "boolean";
}

function isDomainLabel(value: unknown): value is MajorFortuneDomainLabel {
  return (
    typeof value === "string" &&
    majorFortuneDomainLabels.includes(value as MajorFortuneDomainLabel)
  );
}

function isPhase(value: unknown): value is MajorFortunePhase {
  return value === "early" || value === "middle" || value === "late";
}

function clampIndex(index: number): number {
  return Math.max(0, Math.min(100, Math.round(index)));
}

export function getMajorFortuneBasisDisplayLabel(basis: string): string {
  if (basis === "manse_engine_major_fortune_table") {
    return "만세력 대운표 기준";
  }
  if (basis === "user_supplied_major_fortune_table") {
    return "입력된 대운표 기준";
  }
  if (basis === "fixture_precomputed_for_dev_only") {
    return "개발용 사전 계산 대운표 기준";
  }
  if (
    basis === "fixture_precomputed" ||
    basis === "precomputed" ||
    basis.toLowerCase().includes("precomputed") ||
    basis.toLowerCase().includes("fixture")
  ) {
    return "개발용 사전 계산 대운표 기준";
  }

  return sanitizeMajorFortuneVisibleText(basis);
}

export function sanitizeMajorFortuneVisibleText(text: string): string {
  let sanitized = text;

  for (const [from, to] of hardClaimReplacements) {
    sanitized = sanitized.split(from).join(to);
  }
  for (const [from, to] of stemDayMasterReplacements) {
    sanitized = sanitized.split(from).join(to);
  }
  for (const term of repeatedTerms) {
    sanitized = sanitized.replace(
      new RegExp(`${term}\\(${term},\\s*([^)]+)\\)`, "gu"),
      `${term}: $1`,
    );
  }

  sanitized = sanitized
    .replace(
      /([子丑寅卯辰巳午未申酉戌亥]{2}\s*(?:충|육합|삼합|반합|해|형|파))\(\1,\s*([^)]+)\)/gu,
      "$1: $2",
    )
    .replace(
      /([子丑寅卯辰巳午未申酉戌亥]{2}\s*(?:충|육합|삼합|반합|해|형|파))\((?:충|육합|삼합|반합|해|형|파),\s*([^)]+)\)/gu,
      "$1: $2",
    )
    .replace(
      /([子丑寅卯辰巳午未申酉戌亥]{2}\s*(?:충|육합|삼합|반합|해|형|파))\(([^)]+)\)/gu,
      "$1: $2",
    )
    .replace(/장면\s+생각이/gu, "장면입니다. 생각이")
    .replace(/장면\s+관계/gu, "장면입니다. 관계")
    .replace(/장면\s+돈/gu, "장면입니다. 돈");

  for (const word of internalForbiddenWords) {
    sanitized = sanitized.replace(new RegExp(word, "giu"), "");
  }

  return sanitized.replace(/\s{2,}/gu, " ").trim();
}

function sanitizeStringArray(values: readonly string[]): readonly string[] {
  return values.map(sanitizeMajorFortuneVisibleText);
}

function includesHardClaimOrInternalWord(value: string): boolean {
  return (
    hardClaimReplacements.some(([from]) => value.includes(from)) ||
    internalForbiddenWords.some((word) =>
      value.toLowerCase().includes(word.toLowerCase()),
    )
  );
}

function normalizeMajorFortuneSafetyNotes(value: unknown): readonly string[] {
  if (!Array.isArray(value)) {
    return DEFAULT_MAJOR_FORTUNE_SAFETY_NOTES;
  }

  const normalized = value
    .filter((item): item is string => typeof item === "string")
    .map(sanitizeMajorFortuneVisibleText)
    .filter((item) => item.length > 0);

  if (normalized.length === 0) {
    return DEFAULT_MAJOR_FORTUNE_SAFETY_NOTES;
  }

  const repaired = [...normalized];
  for (const fallback of DEFAULT_MAJOR_FORTUNE_SAFETY_NOTES) {
    if (repaired.length >= 2) {
      break;
    }
    if (!repaired.includes(fallback)) {
      repaired.push(fallback);
    }
  }

  return repaired.slice(0, 4);
}

function getMajorFortuneSafetyNotesRepairSummary(input: {
  readonly rawSafetyNotes: unknown;
  readonly repairedSafetyNotes: readonly string[];
}): { readonly warningCount: number; readonly repaired: boolean } {
  let warningCount = 0;

  if (!Array.isArray(input.rawSafetyNotes)) {
    warningCount += 1;
  } else {
    if (input.rawSafetyNotes.length < 2 || input.rawSafetyNotes.length > 4) {
      warningCount += 1;
    }
    for (const item of input.rawSafetyNotes) {
      if (typeof item !== "string" || item.trim().length === 0) {
        warningCount += 1;
        continue;
      }
      if (includesHardClaimOrInternalWord(item)) {
        warningCount += 1;
      }
    }
  }

  const rawComparable = Array.isArray(input.rawSafetyNotes)
    ? input.rawSafetyNotes.filter((item): item is string => typeof item === "string")
    : [];
  const repaired =
    warningCount > 0 ||
    JSON.stringify(rawComparable) !== JSON.stringify(input.repairedSafetyNotes);

  return {
    warningCount,
    repaired,
  };
}

function sanitizeUserContextSummary(
  summary: MajorFortuneReportDraft["userContextSummary"],
): MajorFortuneReportDraft["userContextSummary"] {
  return {
    lifeStatusLabel: sanitizeMajorFortuneVisibleText(summary.lifeStatusLabel),
    fieldLabel:
      summary.fieldLabel === null
        ? null
        : sanitizeMajorFortuneVisibleText(summary.fieldLabel),
    relationshipStatusLabel:
      summary.relationshipStatusLabel === null
        ? null
        : sanitizeMajorFortuneVisibleText(summary.relationshipStatusLabel),
    translationNote: sanitizeMajorFortuneVisibleText(summary.translationNote),
  };
}

function sanitizeCalculationBasis(
  basis: MajorFortuneReportDraft["calculationBasis"],
): MajorFortuneReportDraft["calculationBasis"] {
  return {
    basisType: basis.basisType,
    displayLabel: getMajorFortuneBasisDisplayLabel(basis.displayLabel),
    explanation: sanitizeMajorFortuneVisibleText(basis.explanation),
    ageBasisLabel: sanitizeMajorFortuneVisibleText(basis.ageBasisLabel),
    note: sanitizeMajorFortuneVisibleText(basis.note),
  };
}

type MajorFortuneBigThemeDomain =
  | "money_resource"
  | "work_role"
  | "relationship_life"
  | "study_growth"
  | "health_rhythm"
  | "identity_transition";

const bigThemeDomainKeywords = {
  money_resource: [
    "돈",
    "자원",
    "계약",
    "정산",
    "비용",
    "고정비",
    "수익",
    "투자",
    "현금흐름",
    "외부 프로젝트",
  ],
  work_role: [
    "역할",
    "책임",
    "직무",
    "프로젝트",
    "문서화",
    "보고",
    "운영",
    "기준",
    "성과",
    "조직",
  ],
  relationship_life: [
    "관계",
    "연애",
    "가족",
    "연락",
    "만남",
    "생활 반경",
    "역할 분담",
    "경계",
  ],
  study_growth: [
    "학업",
    "자격증",
    "공부",
    "포트폴리오",
    "학습",
    "매뉴얼",
  ],
  health_rhythm: ["몸", "수면", "식사", "회복", "생활 리듬", "과로"],
  identity_transition: ["전환", "독립", "자기 기준", "방향", "재배치"],
} as const satisfies Record<MajorFortuneBigThemeDomain, readonly string[]>;

export function classifyMajorFortuneBigThemeDomain(
  theme: MajorFortuneReportDraft["bigThemes"][number],
): MajorFortuneBigThemeDomain {
  const text = [
    theme.title,
    theme.metaphor,
    ...theme.likelyScenes,
    theme.strategy,
  ].join("\n");
  const priority: readonly MajorFortuneBigThemeDomain[] = [
    "money_resource",
    "work_role",
    "relationship_life",
    "health_rhythm",
    "study_growth",
    "identity_transition",
  ];
  const scores = priority.map((domain) => ({
    domain,
    score: bigThemeDomainKeywords[domain].reduce(
      (count, keyword) => count + (text.includes(keyword) ? 1 : 0),
      0,
    ),
  }));
  const [best] = scores.sort((a, b) => b.score - a.score);

  return best?.score === 0 || best === undefined
    ? "identity_transition"
    : best.domain;
}

function buildRelationshipLifeBoundaryFallbackTheme(
  relationshipStatusLabel: string | null,
): MajorFortuneReportDraft["bigThemes"][number] {
  const body =
    relationshipStatusLabel === "솔로"
      ? "이 대운은 돈과 일만이 아니라 가까운 관계와 생활 리듬에도 현실 책임을 붙일 수 있습니다. 연애·가족·가까운 관계에서는 감정 자체보다 일·커뮤니티·소개·반복 접점처럼 실제 생활에서 이어지는 만남과 역할 조율이 중요해질 가능성이 큽니다. 관계를 넓히는 것보다 오래 갈 수 있는 생활 구조를 만드는 쪽이 덜 소모적입니다."
      : relationshipStatusLabel === "연애 중"
        ? "이 대운은 돈과 일만이 아니라 가까운 관계와 생활 리듬에도 현실 책임을 붙일 수 있습니다. 연애·가족·가까운 관계에서는 감정 자체보다 일정, 연락, 돈, 생활 리듬을 어떻게 맞출지가 중요해질 가능성이 큽니다. 관계를 넓히는 것보다 오래 갈 수 있는 생활 구조를 만드는 쪽이 덜 소모적입니다."
        : relationshipStatusLabel === "기혼"
          ? "이 대운은 돈과 일만이 아니라 가까운 관계와 생활 리듬에도 현실 책임을 붙일 수 있습니다. 가족 관계에서는 가족 비용, 집안 역할, 배우자와의 책임 분담처럼 실제 생활 구조를 맞추는 일이 중요해질 가능성이 큽니다. 관계를 넓히는 것보다 오래 갈 수 있는 생활 구조를 만드는 쪽이 덜 소모적입니다."
          : "이 대운은 돈과 일만이 아니라 가까운 관계와 생활 리듬에도 현실 책임을 붙일 수 있습니다. 연애·가족·가까운 관계에서는 감정 자체보다 만남 주기, 연락 방식, 역할 분담이 중요해질 가능성이 큽니다. 관계를 넓히는 것보다 오래 갈 수 있는 생활 구조를 만드는 쪽이 덜 소모적입니다.";

  return {
    title: "생활 리듬과 관계 경계",
    metaphor: "사람과 일정이 실제 역할로 묶이는 테마",
    body,
    likelyScenes: [
      "만남 주기와 연락 방식을 현실적으로 맞추는 장면",
      "가족·연인·가까운 사람과 맡을 역할을 다시 나누는 장면",
      "일정 과밀과 관계 피로를 동시에 줄이는 장면",
    ],
    strategy:
      "관계에서는 좋은 말보다 만나는 주기, 연락 방식, 맡을 역할을 현실적으로 맞추세요.",
  };
}

function repairMajorFortuneBigThemes(
  themes: readonly MajorFortuneReportDraft["bigThemes"][number][],
  relationshipStatusLabel: string | null,
): readonly MajorFortuneReportDraft["bigThemes"][number][] {
  if (themes.length !== 3) {
    return themes;
  }

  const moneyThemeIndexes = themes
    .map((theme, index) => ({
      index,
      domain: classifyMajorFortuneBigThemeDomain(theme),
    }))
    .filter((item) => item.domain === "money_resource")
    .map((item) => item.index);

  if (moneyThemeIndexes.length < 2) {
    return themes;
  }

  const replacementIndex = moneyThemeIndexes[1] ?? moneyThemeIndexes[0];
  const replacement =
    buildRelationshipLifeBoundaryFallbackTheme(relationshipStatusLabel);

  return themes.map((theme, index) =>
    index === replacementIndex ? replacement : theme,
  );
}

function sanitizeOptionalString(
  value: unknown,
  fallback: string,
): string {
  return sanitizeMajorFortuneVisibleText(
    typeof value === "string" ? value : fallback,
  );
}

function sanitizeOptionalStringArray(
  value: unknown,
  fallback: readonly string[],
): readonly string[] {
  if (!Array.isArray(value)) {
    return sanitizeStringArray(fallback);
  }

  const normalized = value
    .filter((item): item is string => typeof item === "string")
    .filter((item) => item.trim().length > 0);

  return sanitizeStringArray(normalized);
}

function sanitizeLaunchFlowSection(
  value: unknown,
  fallback: MajorFortuneDraftFlowSection,
): MajorFortuneDraftFlowSection {
  if (!isRecord(value)) {
    return {
      title: sanitizeMajorFortuneVisibleText(fallback.title),
      summary: sanitizeMajorFortuneVisibleText(fallback.summary),
      supportingSignals: sanitizeStringArray(fallback.supportingSignals),
      frictionSignals: sanitizeStringArray(fallback.frictionSignals),
      actionHint: sanitizeMajorFortuneVisibleText(fallback.actionHint),
    };
  }

  return {
    title: sanitizeOptionalString(value.title, fallback.title),
    summary: sanitizeOptionalString(value.summary, fallback.summary),
    supportingSignals: sanitizeOptionalStringArray(
      value.supportingSignals,
      fallback.supportingSignals,
    ),
    frictionSignals: sanitizeOptionalStringArray(
      value.frictionSignals,
      fallback.frictionSignals,
    ),
    actionHint: sanitizeOptionalString(value.actionHint, fallback.actionHint),
  };
}

function sanitizeTimelineYearDetail(
  value: unknown,
): MajorFortuneReportDraft["majorFortuneTimelineRows"][number]["yearDetail"] {
  const fallback = {
    myeongliSummary:
      "그 해의 간지와 십성은 대운 안에서 어떤 장면이 강조되는지 보는 기준입니다.",
    daeunAnnualRelation:
      "대운의 장기 배경 위에 연운의 단기 자극이 올라오는 해로 해석합니다.",
    natalAnnualRelation:
      "원국과 세운의 작용은 생활 리듬, 역할, 관계 조율의 장면으로 풀어 읽습니다.",
    careerWork:
      "직업·일에서는 맡은 역할과 성과 기준을 먼저 좁혀야 합니다.",
    moneyResource:
      "돈·자원에서는 지출, 계약, 정산 기준을 감이 아니라 숫자로 확인합니다.",
    relationshipLove:
      "관계·연애에서는 감정보다 연락, 거리, 약속 기준이 체감에 크게 작동합니다.",
    healthRoutine:
      "건강관리·생활 리듬에서는 수면, 식사, 회복 시간을 일정처럼 고정합니다.",
    socialFamily:
      "사회·가족에서는 누가 어떤 역할을 맡는지 먼저 합의해야 피로가 줄어듭니다.",
    studyGrowth:
      "공부·성장에서는 배운 내용을 문서, 자격, 포트폴리오처럼 남기는 방식이 좋습니다.",
    mbtiExpression:
      "MBTI는 이 해의 흐름이 판단 속도와 실행 방식으로 드러나는 방식을 보조합니다.",
    caution:
      "주의할 점은 특정 사건 예언이 아니라 반복되는 피로와 과부하 관리입니다.",
    actionStandard:
      "실행 기준은 올해 한 가지 역할, 한 가지 돈 기준, 한 가지 회복 루틴을 먼저 고정하는 것입니다.",
  } satisfies MajorFortuneReportDraft["majorFortuneTimelineRows"][number]["yearDetail"];

  if (!isRecord(value)) {
    return fallback;
  }

  return {
    myeongliSummary: sanitizeOptionalString(value.myeongliSummary, fallback.myeongliSummary),
    daeunAnnualRelation: sanitizeOptionalString(value.daeunAnnualRelation, fallback.daeunAnnualRelation),
    natalAnnualRelation: sanitizeOptionalString(value.natalAnnualRelation, fallback.natalAnnualRelation),
    careerWork: sanitizeOptionalString(value.careerWork, fallback.careerWork),
    moneyResource: sanitizeOptionalString(value.moneyResource, fallback.moneyResource),
    relationshipLove: sanitizeOptionalString(value.relationshipLove, fallback.relationshipLove),
    healthRoutine: sanitizeOptionalString(value.healthRoutine, fallback.healthRoutine),
    socialFamily: sanitizeOptionalString(value.socialFamily, fallback.socialFamily),
    studyGrowth: sanitizeOptionalString(value.studyGrowth, fallback.studyGrowth),
    mbtiExpression: sanitizeOptionalString(value.mbtiExpression, fallback.mbtiExpression),
    caution: sanitizeOptionalString(value.caution, fallback.caution),
    actionStandard: sanitizeOptionalString(value.actionStandard, fallback.actionStandard),
  };
}

function findFinalAdviceBody(
  draft: MajorFortuneReportDraft,
  label: MajorFortuneDomainLabel,
  fallback: string,
): string {
  return draft.finalAdvice.find((advice) => advice.label === label)?.body ?? fallback;
}

function buildFallbackLaunchFlowSection(input: {
  readonly title: string;
  readonly summary: string;
  readonly support: readonly string[];
  readonly friction: readonly string[];
  readonly action: string;
}): MajorFortuneDraftFlowSection {
  return {
    title: input.title,
    summary: input.summary,
    supportingSignals: input.support,
    frictionSignals: input.friction,
    actionHint: input.action,
  };
}

function sanitizeDraft(draft: MajorFortuneReportDraft): MajorFortuneReportDraft {
  const sanitizedUserContextSummary = sanitizeUserContextSummary(
    draft.userContextSummary,
  );
  const sanitizedBigThemes = repairMajorFortuneBigThemes(
    draft.bigThemes.map((theme) => ({
      title: sanitizeMajorFortuneVisibleText(theme.title),
      metaphor: sanitizeMajorFortuneVisibleText(theme.metaphor),
      body: sanitizeMajorFortuneVisibleText(theme.body),
      likelyScenes: sanitizeStringArray(theme.likelyScenes),
      strategy: sanitizeMajorFortuneVisibleText(theme.strategy),
    })),
    sanitizedUserContextSummary.relationshipStatusLabel,
  );
  const cycleSummaryText = `${draft.cycleSummary.displayTitle}은 ${draft.cycleSummary.yearRangeLabel}에 반복되는 ${draft.cycleSummary.tenGodLabel} 흐름입니다.`;
  const firstTimeline = draft.cycleYearTimeline[0];
  const annualFallback =
    firstTimeline === undefined
      ? `${draft.cycleSummary.currentPositionLabel} 기준으로 올해 세운과 현재 대운을 함께 봅니다.`
      : `${firstTimeline.year}년 ${firstTimeline.ganji}: ${firstTimeline.plainInterpretation}`;
  const supportSignals = [
    draft.decadeArchetype.plain,
    draft.majorStructure.tenGodExplanation,
    draft.majorStructure.elementEffectExplanation,
  ];
  const frictionSignals = [
    draft.majorStructure.branchInteractionExplanation,
    ...draft.keySignals
      .filter((signal) => signal.type === "difficulty" || signal.type === "caution")
      .map((signal) => signal.body),
  ];

  return {
    version: "v1",
    productType: "major_fortune",
    productVersion: "v1",
    personLabel: sanitizeMajorFortuneVisibleText(draft.personLabel),
    headline: sanitizeOptionalString(draft.headline, draft.openingTitle),
    openingTitle: sanitizeMajorFortuneVisibleText(draft.openingTitle),
    openingSummary: sanitizeMajorFortuneVisibleText(draft.openingSummary),
    coreLine: sanitizeMajorFortuneVisibleText(draft.coreLine),
    userContextSummary: sanitizedUserContextSummary,
    cycleSummary: {
      ganji: sanitizeMajorFortuneVisibleText(draft.cycleSummary.ganji),
      displayTitle: sanitizeMajorFortuneVisibleText(
        draft.cycleSummary.displayTitle,
      ),
      cycleIndexLabel: sanitizeMajorFortuneVisibleText(
        draft.cycleSummary.cycleIndexLabel,
      ),
      currentPositionLabel: sanitizeMajorFortuneVisibleText(
        draft.cycleSummary.currentPositionLabel,
      ),
      ageRangeLabel: sanitizeMajorFortuneVisibleText(
        draft.cycleSummary.ageRangeLabel,
      ),
      yearRangeLabel: sanitizeMajorFortuneVisibleText(
        draft.cycleSummary.yearRangeLabel,
      ),
      stemLabel: sanitizeMajorFortuneVisibleText(draft.cycleSummary.stemLabel),
      branchLabel: sanitizeMajorFortuneVisibleText(
        draft.cycleSummary.branchLabel,
      ),
      elementLabel: sanitizeMajorFortuneVisibleText(
        draft.cycleSummary.elementLabel,
      ),
      tenGodLabel: sanitizeMajorFortuneVisibleText(
        draft.cycleSummary.tenGodLabel,
      ),
      basisLabel: getMajorFortuneBasisDisplayLabel(
        draft.cycleSummary.basisLabel,
      ),
    },
    calculationBasis: sanitizeCalculationBasis(draft.calculationBasis),
    previousToCurrentShift: {
      previousGanji:
        draft.previousToCurrentShift.previousGanji === null
          ? null
          : sanitizeMajorFortuneVisibleText(
              draft.previousToCurrentShift.previousGanji,
            ),
      currentGanji: sanitizeMajorFortuneVisibleText(
        draft.previousToCurrentShift.currentGanji,
      ),
      plain: sanitizeMajorFortuneVisibleText(draft.previousToCurrentShift.plain),
      whatChanged: sanitizeStringArray(
        draft.previousToCurrentShift.whatChanged,
      ),
    },
    decadeArchetype: {
      label: sanitizeMajorFortuneVisibleText(draft.decadeArchetype.label),
      metaphor: sanitizeMajorFortuneVisibleText(
        draft.decadeArchetype.metaphor,
      ),
      plain: sanitizeMajorFortuneVisibleText(draft.decadeArchetype.plain),
    },
    flowIndexSummary: {
      flowIndex: clampIndex(draft.flowIndexSummary.flowIndex),
      flowTypeLabel: sanitizeMajorFortuneVisibleText(
        draft.flowIndexSummary.flowTypeLabel,
      ),
      flowIndexCaution: sanitizeMajorFortuneVisibleText(
        draft.flowIndexSummary.flowIndexCaution,
      ),
    },
    bigThemes: sanitizedBigThemes,
    myeongliLayers: {
      tenGodLayer: {
        majorStemTenGod: sanitizeMajorFortuneVisibleText(
          draft.myeongliLayers.tenGodLayer.majorStemTenGod,
        ),
        annualStemTenGodsInCycle:
          draft.myeongliLayers.tenGodLayer.annualStemTenGodsInCycle.map(
            (item) => ({
              year: item.year,
              stem: sanitizeMajorFortuneVisibleText(item.stem),
              tenGod: sanitizeMajorFortuneVisibleText(item.tenGod),
              plain: sanitizeMajorFortuneVisibleText(item.plain),
            }),
          ),
        plain: sanitizeMajorFortuneVisibleText(
          draft.myeongliLayers.tenGodLayer.plain,
        ),
      },
      elementLayer: {
        majorElements: sanitizeStringArray(
          draft.myeongliLayers.elementLayer.majorElements,
        ),
        fillMissing: sanitizeStringArray(
          draft.myeongliLayers.elementLayer.fillMissing,
        ),
        overloadHeavy: sanitizeStringArray(
          draft.myeongliLayers.elementLayer.overloadHeavy,
        ),
        plain: sanitizeMajorFortuneVisibleText(
          draft.myeongliLayers.elementLayer.plain,
        ),
      },
      branchInteractionLayer: {
        interactions:
          draft.myeongliLayers.branchInteractionLayer.interactions.map(
            (interaction) => ({
              year: interaction.year,
              type: interaction.type,
              plainType: sanitizeMajorFortuneVisibleText(
                interaction.plainType,
              ),
              plain: sanitizeMajorFortuneVisibleText(interaction.plain),
              impactArea: interaction.impactArea,
            }),
          ),
        plain: sanitizeMajorFortuneVisibleText(
          draft.myeongliLayers.branchInteractionLayer.plain,
        ),
      },
      hiddenStemLayer: {
        majorBranchHiddenStems: sanitizeStringArray(
          draft.myeongliLayers.hiddenStemLayer.majorBranchHiddenStems,
        ),
        plain: sanitizeMajorFortuneVisibleText(
          draft.myeongliLayers.hiddenStemLayer.plain,
        ),
      },
      twelveStageLayer:
        draft.myeongliLayers.twelveStageLayer === null
          ? null
          : {
              label: sanitizeMajorFortuneVisibleText(
                draft.myeongliLayers.twelveStageLayer.label,
              ),
              plain: sanitizeMajorFortuneVisibleText(
                draft.myeongliLayers.twelveStageLayer.plain,
              ),
            },
      auxiliaryStarsLayer: draft.myeongliLayers.auxiliaryStarsLayer
        .filter((star) => !star.label.includes("백호대살"))
        .map((star) => ({
          label: sanitizeMajorFortuneVisibleText(star.label),
          plain: sanitizeMajorFortuneVisibleText(star.plain),
          caution:
            star.caution === null
              ? null
              : sanitizeMajorFortuneVisibleText(star.caution),
        }))
        .filter(
          (star) =>
            star.plain.length >= 24 &&
            !weakAuxiliaryStarPhrases.some((phrase) =>
              star.plain.includes(phrase),
            ),
        )
        .slice(0, 5),
    },
    decadeCards: draft.decadeCards.map((card) => ({
      label: card.label,
      index: clampIndex(card.index),
      headline: sanitizeMajorFortuneVisibleText(card.headline),
      body: sanitizeMajorFortuneVisibleText(card.body),
    })),
    keySignals: draft.keySignals.map((signal) => ({
      type: signal.type,
      title: sanitizeMajorFortuneVisibleText(signal.title),
      body: sanitizeMajorFortuneVisibleText(signal.body),
      evidenceLabel: sanitizeMajorFortuneVisibleText(signal.evidenceLabel),
    })),
    majorStructure: {
      ganjiExplanation: sanitizeMajorFortuneVisibleText(
        draft.majorStructure.ganjiExplanation,
      ),
      tenGodExplanation: sanitizeMajorFortuneVisibleText(
        draft.majorStructure.tenGodExplanation,
      ),
      elementEffectExplanation: sanitizeMajorFortuneVisibleText(
        draft.majorStructure.elementEffectExplanation,
      ),
      branchInteractionExplanation: sanitizeMajorFortuneVisibleText(
        draft.majorStructure.branchInteractionExplanation,
      ),
      transitionExplanation: sanitizeMajorFortuneVisibleText(
        draft.majorStructure.transitionExplanation,
      ),
    },
    cycleChapters: draft.cycleChapters.map((chapter) => ({
      title: sanitizeMajorFortuneVisibleText(chapter.title),
      headline: sanitizeMajorFortuneVisibleText(chapter.headline),
      body: sanitizeMajorFortuneVisibleText(chapter.body),
      likelyScenes: sanitizeStringArray(chapter.likelyScenes),
      practicalAdvice: sanitizeStringArray(chapter.practicalAdvice),
    })),
    phaseTimeline: draft.phaseTimeline.map((phase) => ({
      phase: phase.phase,
      label: sanitizeMajorFortuneVisibleText(phase.label),
      headline: sanitizeMajorFortuneVisibleText(phase.headline),
      body: sanitizeMajorFortuneVisibleText(phase.body),
      advice: sanitizeMajorFortuneVisibleText(phase.advice),
    })),
    strongYears: draft.strongYears.slice(0, 5).map((year) => ({
      year: year.year,
      ganji: sanitizeMajorFortuneVisibleText(year.ganji),
      headline: sanitizeMajorFortuneVisibleText(year.headline),
      body: sanitizeMajorFortuneVisibleText(year.body),
      advice: sanitizeMajorFortuneVisibleText(year.advice),
      whyStrong: sanitizeMajorFortuneVisibleText(year.whyStrong),
      likelyArea: year.likelyArea,
      pushStrategy: sanitizeMajorFortuneVisibleText(year.pushStrategy),
      reduceStrategy: sanitizeMajorFortuneVisibleText(year.reduceStrategy),
    })),
    majorFortuneTimelineRows: draft.majorFortuneTimelineRows.map((row, index) => ({
      year: row.year,
      ageLabel:
        row.ageLabel === null ? null : sanitizeMajorFortuneVisibleText(row.ageLabel),
      ageBasisLabel:
        index > 0 || row.ageBasisLabel === null
          ? null
          : sanitizeMajorFortuneVisibleText(row.ageBasisLabel),
      yearIndexInCycle: row.yearIndexInCycle,
      phase: row.phase,
      isCurrentYear: row.isCurrentYear,
      isCycleStartYear: row.isCycleStartYear,
      isCycleEndYear: row.isCycleEndYear,
      badges: row.badges,
      majorGanji: sanitizeMajorFortuneVisibleText(row.majorGanji),
      annualGanji: sanitizeMajorFortuneVisibleText(row.annualGanji),
      annualTenGodLabel: sanitizeMajorFortuneVisibleText(
        row.annualTenGodLabel,
      ),
      keyInteractionLabel:
        row.keyInteractionLabel === null
          ? null
          : sanitizeMajorFortuneVisibleText(row.keyInteractionLabel),
      oneLine: sanitizeMajorFortuneVisibleText(row.oneLine),
      strategy: sanitizeMajorFortuneVisibleText(row.strategy),
      yearDetail: sanitizeTimelineYearDetail(row.yearDetail),
    })),
    cycleYearTimeline: draft.cycleYearTimeline.map((year) => ({
      year: year.year,
      ganji: sanitizeMajorFortuneVisibleText(year.ganji),
      yearIndexInCycle: year.yearIndexInCycle,
      phase: year.phase,
      headline: sanitizeMajorFortuneVisibleText(year.headline),
      roleOfYearInCycle: sanitizeMajorFortuneVisibleText(
        year.roleOfYearInCycle,
      ),
      plainInterpretation: sanitizeMajorFortuneVisibleText(
        year.plainInterpretation,
      ),
      strategicFocus: sanitizeMajorFortuneVisibleText(year.strategicFocus),
      whyItMatters: sanitizeMajorFortuneVisibleText(year.whyItMatters),
    })),
    currentCycleSummary: sanitizeOptionalString(
      draft.currentCycleSummary,
      cycleSummaryText,
    ),
    tenYearTheme: sanitizeOptionalString(
      draft.tenYearTheme,
      draft.decadeArchetype.plain,
    ),
    timelineReading: sanitizeOptionalString(
      draft.timelineReading,
      draft.cycleYearTimeline
        .map((year) => `${year.year}년 ${year.ganji}: ${year.strategicFocus}`)
        .join("\n"),
    ),
    annualCrossReading: sanitizeOptionalString(
      draft.annualCrossReading,
      annualFallback,
    ),
    careerWorkFlow: sanitizeLaunchFlowSection(
      draft.careerWorkFlow,
      buildFallbackLaunchFlowSection({
        title: "직업·일 흐름",
        summary: findFinalAdviceBody(
          draft,
          "일·성과",
          "일에서는 역할, 책임, 기준을 문서로 정리하는 흐름이 중요합니다.",
        ),
        support: supportSignals,
        friction: frictionSignals,
        action: findFinalAdviceBody(
          draft,
          "일·성과",
          "프로젝트·보고·문서화는 중간 점검 기준을 먼저 잡아 두세요.",
        ),
      }),
    ),
    moneyResourceFlow: sanitizeLaunchFlowSection(
      draft.moneyResourceFlow,
      buildFallbackLaunchFlowSection({
        title: "돈·자원 흐름",
        summary: findFinalAdviceBody(
          draft,
          "돈·현실",
          "돈은 수입 기대보다 고정비, 계약, 정산 기준을 먼저 봐야 합니다.",
        ),
        support: supportSignals,
        friction: frictionSignals,
        action: findFinalAdviceBody(
          draft,
          "돈·현실",
          "급여·생활비·정산·계약은 월초에 분리해 두세요.",
        ),
      }),
    ),
    relationshipFlow: sanitizeLaunchFlowSection(
      draft.relationshipFlow,
      buildFallbackLaunchFlowSection({
        title: "관계·연애 흐름",
        summary: findFinalAdviceBody(
          draft,
          "인간관계",
          "관계에서는 감정만이 아니라 연락, 거리, 역할 기준을 조율해야 합니다.",
        ),
        support: supportSignals,
        friction: frictionSignals,
        action: findFinalAdviceBody(
          draft,
          "연애·가족",
          "연인·가족·부모와의 약속은 시간과 역할을 먼저 맞춰 두세요.",
        ),
      }),
    ),
    healthRoutineFlow: sanitizeLaunchFlowSection(
      draft.healthRoutineFlow,
      buildFallbackLaunchFlowSection({
        title: "건강관리·생활 리듬",
        summary: findFinalAdviceBody(
          draft,
          "몸·생활 리듬",
          "생활 리듬은 대운 압박을 오래 버티는 기본 운영 장치입니다.",
        ),
        support: supportSignals,
        friction: frictionSignals,
        action: findFinalAdviceBody(
          draft,
          "몸·생활 리듬",
          "수면·식사·회복 시간을 일정처럼 고정하세요.",
        ),
      }),
    ),
    mbtiExpression: sanitizeOptionalString(
      draft.mbtiExpression,
      "MBTI는 대운의 장기 흐름이 실제 판단 속도, 실행 방식, 관계 조율로 드러나는 방식을 보조합니다.",
    ),
    riskManagement: sanitizeOptionalStringArray(
      draft.riskManagement,
      [
        ...frictionSignals,
        "특정 사건을 단정하기보다 반복되는 피로와 책임 과부하를 먼저 관리하세요.",
      ],
    ).slice(0, 6),
    actionPlan: sanitizeOptionalStringArray(
      draft.actionPlan,
      [
        ...draft.finalAdvice.map((advice) => advice.body),
        "올해 세운에서 먼저 움직이는 영역을 기록하고 다음 달 실행 기준으로 옮기세요.",
      ],
    ).slice(0, 8),
    finalAdvice: draft.finalAdvice.map((advice) => ({
      label: advice.label,
      body: sanitizeMajorFortuneVisibleText(advice.body),
    })),
    safetyNotes: normalizeMajorFortuneSafetyNotes(
      (draft as { readonly safetyNotes?: unknown }).safetyNotes,
    ),
  };
}

function hasDraftShape(value: unknown): value is MajorFortuneReportDraft {
  if (!isRecord(value)) {
    return false;
  }

  const draft = value as Partial<MajorFortuneReportDraft>;

  return (
    draft.version === "v1" &&
    draft.productType === "major_fortune" &&
    draft.productVersion === "v1" &&
    typeof draft.personLabel === "string" &&
    typeof draft.openingTitle === "string" &&
    typeof draft.openingSummary === "string" &&
    typeof draft.coreLine === "string" &&
    isRecord(draft.userContextSummary) &&
    typeof draft.userContextSummary.lifeStatusLabel === "string" &&
    (typeof draft.userContextSummary.fieldLabel === "string" ||
      draft.userContextSummary.fieldLabel === null) &&
    (typeof draft.userContextSummary.relationshipStatusLabel === "string" ||
      draft.userContextSummary.relationshipStatusLabel === null) &&
    typeof draft.userContextSummary.translationNote === "string" &&
    isRecord(draft.cycleSummary) &&
    typeof draft.cycleSummary.ganji === "string" &&
    typeof draft.cycleSummary.displayTitle === "string" &&
    typeof draft.cycleSummary.cycleIndexLabel === "string" &&
    typeof draft.cycleSummary.currentPositionLabel === "string" &&
    typeof draft.cycleSummary.ageRangeLabel === "string" &&
    typeof draft.cycleSummary.yearRangeLabel === "string" &&
    typeof draft.cycleSummary.stemLabel === "string" &&
    typeof draft.cycleSummary.branchLabel === "string" &&
    typeof draft.cycleSummary.elementLabel === "string" &&
    typeof draft.cycleSummary.tenGodLabel === "string" &&
    typeof draft.cycleSummary.basisLabel === "string" &&
    isRecord(draft.calculationBasis) &&
    (draft.calculationBasis.basisType === "manse_engine_major_fortune_table" ||
      draft.calculationBasis.basisType === "user_supplied_major_fortune_table" ||
      draft.calculationBasis.basisType === "fixture_precomputed_for_dev_only") &&
    typeof draft.calculationBasis.displayLabel === "string" &&
    typeof draft.calculationBasis.explanation === "string" &&
    typeof draft.calculationBasis.ageBasisLabel === "string" &&
    typeof draft.calculationBasis.note === "string" &&
    isRecord(draft.previousToCurrentShift) &&
    (typeof draft.previousToCurrentShift.previousGanji === "string" ||
      draft.previousToCurrentShift.previousGanji === null) &&
    typeof draft.previousToCurrentShift.currentGanji === "string" &&
    typeof draft.previousToCurrentShift.plain === "string" &&
    isStringArray(draft.previousToCurrentShift.whatChanged) &&
    isRecord(draft.decadeArchetype) &&
    typeof draft.decadeArchetype.label === "string" &&
    typeof draft.decadeArchetype.metaphor === "string" &&
    typeof draft.decadeArchetype.plain === "string" &&
    isRecord(draft.flowIndexSummary) &&
    isNumber(draft.flowIndexSummary.flowIndex) &&
    typeof draft.flowIndexSummary.flowTypeLabel === "string" &&
    typeof draft.flowIndexSummary.flowIndexCaution === "string" &&
    Array.isArray(draft.bigThemes) &&
    draft.bigThemes.every(
      (theme) =>
        isRecord(theme) &&
        typeof theme.title === "string" &&
        typeof theme.metaphor === "string" &&
        typeof theme.body === "string" &&
        isStringArray(theme.likelyScenes) &&
        typeof theme.strategy === "string",
    ) &&
    isRecord(draft.myeongliLayers) &&
    isRecord(draft.myeongliLayers.tenGodLayer) &&
    typeof draft.myeongliLayers.tenGodLayer.majorStemTenGod === "string" &&
    Array.isArray(
      draft.myeongliLayers.tenGodLayer.annualStemTenGodsInCycle,
    ) &&
    draft.myeongliLayers.tenGodLayer.annualStemTenGodsInCycle.every(
      (item) =>
        isRecord(item) &&
        isNumber(item.year) &&
        typeof item.stem === "string" &&
        typeof item.tenGod === "string" &&
        typeof item.plain === "string",
    ) &&
    typeof draft.myeongliLayers.tenGodLayer.plain === "string" &&
    isRecord(draft.myeongliLayers.elementLayer) &&
    isStringArray(draft.myeongliLayers.elementLayer.majorElements) &&
    isStringArray(draft.myeongliLayers.elementLayer.fillMissing) &&
    isStringArray(draft.myeongliLayers.elementLayer.overloadHeavy) &&
    typeof draft.myeongliLayers.elementLayer.plain === "string" &&
    isRecord(draft.myeongliLayers.branchInteractionLayer) &&
    Array.isArray(draft.myeongliLayers.branchInteractionLayer.interactions) &&
    draft.myeongliLayers.branchInteractionLayer.interactions.every(
      (interaction) =>
        isRecord(interaction) &&
        (isNumber(interaction.year) || interaction.year === null) &&
        typeof interaction.type === "string" &&
        typeof interaction.plainType === "string" &&
        typeof interaction.plain === "string" &&
        typeof interaction.impactArea === "string",
    ) &&
    typeof draft.myeongliLayers.branchInteractionLayer.plain === "string" &&
    isRecord(draft.myeongliLayers.hiddenStemLayer) &&
    isStringArray(draft.myeongliLayers.hiddenStemLayer.majorBranchHiddenStems) &&
    typeof draft.myeongliLayers.hiddenStemLayer.plain === "string" &&
    (draft.myeongliLayers.twelveStageLayer === null ||
      (isRecord(draft.myeongliLayers.twelveStageLayer) &&
        typeof draft.myeongliLayers.twelveStageLayer.label === "string" &&
        typeof draft.myeongliLayers.twelveStageLayer.plain === "string")) &&
    Array.isArray(draft.myeongliLayers.auxiliaryStarsLayer) &&
    draft.myeongliLayers.auxiliaryStarsLayer.every(
      (star) =>
        isRecord(star) &&
        typeof star.label === "string" &&
        typeof star.plain === "string" &&
        (typeof star.caution === "string" || star.caution === null),
    ) &&
    Array.isArray(draft.decadeCards) &&
    draft.decadeCards.every(
      (card) =>
        isRecord(card) &&
        isDomainLabel(card.label) &&
        isNumber(card.index) &&
        typeof card.headline === "string" &&
        typeof card.body === "string",
    ) &&
    Array.isArray(draft.keySignals) &&
    isRecord(draft.majorStructure) &&
    typeof draft.majorStructure.ganjiExplanation === "string" &&
    typeof draft.majorStructure.tenGodExplanation === "string" &&
    typeof draft.majorStructure.elementEffectExplanation === "string" &&
    typeof draft.majorStructure.branchInteractionExplanation === "string" &&
    typeof draft.majorStructure.transitionExplanation === "string" &&
    Array.isArray(draft.cycleChapters) &&
    Array.isArray(draft.phaseTimeline) &&
    draft.phaseTimeline.every((phase) => isRecord(phase) && isPhase(phase.phase)) &&
    Array.isArray(draft.strongYears) &&
    draft.strongYears.every(
      (year) =>
        isRecord(year) &&
        isNumber(year.year) &&
        typeof year.ganji === "string" &&
        typeof year.headline === "string" &&
        typeof year.body === "string" &&
        typeof year.advice === "string" &&
        typeof year.whyStrong === "string" &&
        typeof year.likelyArea === "string" &&
        typeof year.pushStrategy === "string" &&
        typeof year.reduceStrategy === "string",
    ) &&
    Array.isArray(draft.majorFortuneTimelineRows) &&
    draft.majorFortuneTimelineRows.every(
      (row) =>
        isRecord(row) &&
        isNumber(row.year) &&
        (typeof row.ageLabel === "string" || row.ageLabel === null) &&
        (typeof row.ageBasisLabel === "string" || row.ageBasisLabel === null) &&
        isNumber(row.yearIndexInCycle) &&
        isPhase(row.phase) &&
        isBoolean(row.isCurrentYear) &&
        isBoolean(row.isCycleStartYear) &&
        isBoolean(row.isCycleEndYear) &&
        isStringArray(row.badges) &&
        typeof row.majorGanji === "string" &&
        typeof row.annualGanji === "string" &&
        typeof row.annualTenGodLabel === "string" &&
        (typeof row.keyInteractionLabel === "string" ||
          row.keyInteractionLabel === null) &&
        typeof row.oneLine === "string" &&
        typeof row.strategy === "string" &&
        isTimelineYearDetail(row.yearDetail),
    ) &&
    Array.isArray(draft.cycleYearTimeline) &&
    draft.cycleYearTimeline.every(
      (year) =>
        isRecord(year) &&
        isNumber(year.year) &&
        typeof year.ganji === "string" &&
        isNumber(year.yearIndexInCycle) &&
        isPhase(year.phase) &&
        typeof year.headline === "string" &&
        typeof year.roleOfYearInCycle === "string" &&
        typeof year.plainInterpretation === "string" &&
        typeof year.strategicFocus === "string" &&
        typeof year.whyItMatters === "string",
    ) &&
    Array.isArray(draft.finalAdvice) &&
    draft.finalAdvice.every(
      (advice) =>
        isRecord(advice) &&
        isDomainLabel(advice.label) &&
        typeof advice.body === "string",
    )
  );
}

function collectVisibleStrings(draft: MajorFortuneReportDraft): readonly string[] {
  return [
    draft.personLabel,
    draft.headline ?? "",
    draft.openingTitle,
    draft.openingSummary,
    draft.coreLine,
    draft.userContextSummary.lifeStatusLabel,
    draft.userContextSummary.fieldLabel ?? "",
    draft.userContextSummary.relationshipStatusLabel ?? "",
    draft.userContextSummary.translationNote,
    ...Object.values(draft.cycleSummary),
    draft.calculationBasis.displayLabel,
    draft.calculationBasis.explanation,
    draft.calculationBasis.ageBasisLabel,
    draft.calculationBasis.note,
    draft.previousToCurrentShift.previousGanji ?? "",
    draft.previousToCurrentShift.currentGanji,
    draft.previousToCurrentShift.plain,
    ...draft.previousToCurrentShift.whatChanged,
    draft.decadeArchetype.label,
    draft.decadeArchetype.metaphor,
    draft.decadeArchetype.plain,
    draft.flowIndexSummary.flowTypeLabel,
    draft.flowIndexSummary.flowIndexCaution,
    ...draft.bigThemes.flatMap((theme) => [
      theme.title,
      theme.metaphor,
      theme.body,
      ...theme.likelyScenes,
      theme.strategy,
    ]),
    draft.myeongliLayers.tenGodLayer.majorStemTenGod,
    draft.myeongliLayers.tenGodLayer.plain,
    ...draft.myeongliLayers.tenGodLayer.annualStemTenGodsInCycle.flatMap(
      (item) => [item.stem, item.tenGod, item.plain],
    ),
    ...draft.myeongliLayers.elementLayer.majorElements,
    ...draft.myeongliLayers.elementLayer.fillMissing,
    ...draft.myeongliLayers.elementLayer.overloadHeavy,
    draft.myeongliLayers.elementLayer.plain,
    draft.myeongliLayers.branchInteractionLayer.plain,
    ...draft.myeongliLayers.branchInteractionLayer.interactions.flatMap(
      (interaction) => [
        interaction.type,
        interaction.plainType,
        interaction.plain,
        interaction.impactArea,
      ],
    ),
    ...draft.myeongliLayers.hiddenStemLayer.majorBranchHiddenStems,
    draft.myeongliLayers.hiddenStemLayer.plain,
    draft.myeongliLayers.twelveStageLayer?.label ?? "",
    draft.myeongliLayers.twelveStageLayer?.plain ?? "",
    ...draft.myeongliLayers.auxiliaryStarsLayer.flatMap((star) => [
      star.label,
      star.plain,
      star.caution ?? "",
    ]),
    ...draft.decadeCards.flatMap((card) => [
      card.label,
      card.headline,
      card.body,
    ]),
    ...draft.keySignals.flatMap((signal) => [
      signal.title,
      signal.body,
      signal.evidenceLabel,
    ]),
    ...Object.values(draft.majorStructure),
    ...draft.cycleChapters.flatMap((chapter) => [
      chapter.title,
      chapter.headline,
      chapter.body,
      ...chapter.likelyScenes,
      ...chapter.practicalAdvice,
    ]),
    ...draft.phaseTimeline.flatMap((phase) => [
      phase.label,
      phase.headline,
      phase.body,
      phase.advice,
    ]),
    ...draft.strongYears.flatMap((year) => [
      year.ganji,
      year.headline,
      year.body,
      year.advice,
      year.whyStrong,
      year.likelyArea,
      year.pushStrategy,
      year.reduceStrategy,
    ]),
    ...draft.majorFortuneTimelineRows.flatMap((row) => [
      row.ageLabel ?? "",
      row.ageBasisLabel ?? "",
      ...row.badges,
      row.majorGanji,
      row.annualGanji,
      row.annualTenGodLabel,
      row.keyInteractionLabel ?? "",
      row.oneLine,
      row.strategy,
      ...timelineYearDetailFields.map((field) => row.yearDetail[field]),
    ]),
    ...draft.cycleYearTimeline.flatMap((year) => [
      year.ganji,
      year.headline,
      year.roleOfYearInCycle,
      year.plainInterpretation,
      year.strategicFocus,
      year.whyItMatters,
    ]),
    draft.currentCycleSummary ?? "",
    draft.tenYearTheme ?? "",
    draft.timelineReading ?? "",
    draft.annualCrossReading ?? "",
    ...[
      draft.careerWorkFlow,
      draft.moneyResourceFlow,
      draft.relationshipFlow,
      draft.healthRoutineFlow,
    ].flatMap((flow) =>
      flow === undefined
        ? []
        : [
            flow.title,
            flow.summary,
            ...flow.supportingSignals,
            ...flow.frictionSignals,
            flow.actionHint,
          ],
    ),
    draft.mbtiExpression ?? "",
    ...(draft.riskManagement ?? []),
    ...(draft.actionPlan ?? []),
    ...draft.finalAdvice.flatMap((advice) => [advice.label, advice.body]),
    ...draft.safetyNotes,
  ];
}

function collectInterpretiveStrings(
  draft: MajorFortuneReportDraft,
): readonly string[] {
  return [
    draft.openingTitle,
    draft.openingSummary,
    draft.coreLine,
    draft.userContextSummary.translationNote,
    draft.previousToCurrentShift.plain,
    ...draft.previousToCurrentShift.whatChanged,
    draft.decadeArchetype.plain,
    ...draft.bigThemes.flatMap((theme) => [
      theme.body,
      ...theme.likelyScenes,
      theme.strategy,
    ]),
    ...draft.decadeCards.flatMap((card) => [card.headline, card.body]),
    ...draft.keySignals.flatMap((signal) => [
      signal.title,
      signal.body,
      signal.evidenceLabel,
    ]),
    ...Object.values(draft.majorStructure),
    ...draft.cycleChapters.flatMap((chapter) => [
      chapter.headline,
      chapter.body,
      ...chapter.likelyScenes,
      ...chapter.practicalAdvice,
    ]),
    ...draft.phaseTimeline.flatMap((phase) => [
      phase.headline,
      phase.body,
      phase.advice,
    ]),
    ...draft.strongYears.flatMap((year) => [
      year.headline,
      year.body,
      year.advice,
      year.whyStrong,
      year.pushStrategy,
      year.reduceStrategy,
    ]),
    ...draft.majorFortuneTimelineRows.flatMap((row) => [
      row.oneLine,
      row.strategy,
      ...timelineYearDetailFields.map((field) => row.yearDetail[field]),
    ]),
    ...draft.cycleYearTimeline.flatMap((year) => [
      year.headline,
      year.roleOfYearInCycle,
      year.plainInterpretation,
      year.strategicFocus,
      year.whyItMatters,
    ]),
    draft.currentCycleSummary ?? "",
    draft.tenYearTheme ?? "",
    draft.timelineReading ?? "",
    draft.annualCrossReading ?? "",
    ...[
      draft.careerWorkFlow,
      draft.moneyResourceFlow,
      draft.relationshipFlow,
      draft.healthRoutineFlow,
    ].flatMap((flow) =>
      flow === undefined
        ? []
        : [
            flow.summary,
            ...flow.supportingSignals,
            ...flow.frictionSignals,
            flow.actionHint,
          ],
    ),
    draft.mbtiExpression ?? "",
    ...(draft.riskManagement ?? []),
    ...(draft.actionPlan ?? []),
    ...draft.finalAdvice.map((advice) => advice.body),
  ];
}

function countOccurrences(text: string, phrase: string): number {
  return phrase.length === 0 ? 0 : text.split(phrase).length - 1;
}

function countRepeatedTerminologyWarnings(visibleText: string): number {
  const repeatedTermPattern = new RegExp(
    `(${repeatedTerms.join("|")})\\(\\1,`,
    "gu",
  );
  const branchPattern =
    /[子丑寅卯辰巳午未申酉戌亥]{2}\s*(?:충|육합|삼합|반합|해|형|파)\(/gu;

  return (
    (visibleText.match(repeatedTermPattern)?.length ?? 0) +
    (visibleText.match(branchPattern)?.length ?? 0)
  );
}

function countAnnualToneWarnings(visibleText: string): number {
  const occurrences = annualTonePhrases.reduce(
    (count, phrase) => count + countOccurrences(visibleText, phrase),
    0,
  );

  return occurrences > 2 ? occurrences - 2 : 0;
}

function countDecadeToneWarnings(visibleText: string): number {
  const markerCount = decadeToneMarkers.filter((marker) =>
    visibleText.includes(marker),
  ).length;

  return markerCount >= 4 ? 0 : 4 - markerCount;
}

function countStrongYearReasonWarnings(
  draft: MajorFortuneReportDraft,
): number {
  return draft.strongYears.filter((year) => {
    const text = [
      year.headline,
      year.body,
      year.advice,
      year.whyStrong,
      year.pushStrategy,
      year.reduceStrategy,
    ].join("\n");

    return !strongYearReasonMarkers.some((marker) => text.includes(marker));
  }).length;
}

function expectedCycleYearPhase(
  yearIndexInCycle: number,
): MajorFortunePhase | undefined {
  if (yearIndexInCycle >= 1 && yearIndexInCycle <= 3) {
    return "early";
  }
  if (yearIndexInCycle >= 4 && yearIndexInCycle <= 7) {
    return "middle";
  }
  if (yearIndexInCycle >= 8 && yearIndexInCycle <= 10) {
    return "late";
  }

  return undefined;
}

function parseYearRangeLabel(
  yearRangeLabel: string,
): { readonly startYear: number; readonly endYear: number } | undefined {
  const match = /(\d{4})년\s*~\s*(\d{4})년/u.exec(yearRangeLabel);

  if (match === null) {
    return undefined;
  }

  return {
    startYear: Number(match[1]),
    endYear: Number(match[2]),
  };
}

function parseCurrentYearFromPosition(positionLabel: string): number | undefined {
  const match = /(\d{4})년/u.exec(positionLabel);

  return match === null ? undefined : Number(match[1]);
}

function countWrongCycleBasisWarnings(draft: MajorFortuneReportDraft): number {
  const range = parseYearRangeLabel(draft.cycleSummary.yearRangeLabel);
  const currentYear = parseCurrentYearFromPosition(
    draft.cycleSummary.currentPositionLabel,
  );

  if (range === undefined || currentYear === undefined) {
    return 1;
  }

  return range.startYear <= currentYear && currentYear <= range.endYear ? 0 : 1;
}

function countMissingCycleYearWarnings(
  draft: MajorFortuneReportDraft,
): number {
  let warnings = 0;
  const timeline = draft.cycleYearTimeline;
  const timelineRows = draft.majorFortuneTimelineRows;

  if (timeline.length !== 10) {
    warnings += 1;
  }
  if (timelineRows.length !== 10) {
    warnings += 1;
  }

  const range = parseYearRangeLabel(draft.cycleSummary.yearRangeLabel);

  for (const [index, item] of timeline.entries()) {
    const expectedIndex = index + 1;
    const expectedPhase = expectedCycleYearPhase(expectedIndex);

    if (item.yearIndexInCycle !== expectedIndex) {
      warnings += 1;
    }
    if (expectedPhase !== undefined && item.phase !== expectedPhase) {
      warnings += 1;
    }
    if (range !== undefined && item.year !== range.startYear + index) {
      warnings += 1;
    }
  }

  if (
    range !== undefined &&
    (timeline[0]?.year !== range.startYear ||
      timeline[timeline.length - 1]?.year !== range.endYear)
  ) {
    warnings += 1;
  }
  for (const [index, row] of timelineRows.entries()) {
    const expectedIndex = index + 1;

    if (row.yearIndexInCycle !== expectedIndex) {
      warnings += 1;
    }
    if (range !== undefined && row.year !== range.startYear + index) {
      warnings += 1;
    }
    if (row.majorGanji !== draft.cycleSummary.ganji) {
      warnings += 1;
    }
    if (row.annualGanji.trim().length === 0 || row.oneLine.trim().length === 0) {
      warnings += 1;
    }
  }

  return warnings;
}

function countGenericTimelineWarnings(draft: MajorFortuneReportDraft): number {
  const cycleWarnings = draft.cycleYearTimeline.reduce((count, year) => {
    const text = [
      year.headline,
      year.roleOfYearInCycle,
      year.plainInterpretation,
      year.strategicFocus,
      year.whyItMatters,
    ].join("\n");

    return (
      count +
      genericTimelinePhrases.reduce(
        (innerCount, phrase) => innerCount + countOccurrences(text, phrase),
        0,
      )
    );
  }, 0);
  const rowWarnings = draft.majorFortuneTimelineRows.reduce((count, row) => {
    const text = [row.oneLine, row.strategy].join("\n");

    return (
      count +
      genericTimelinePhrases.reduce(
        (innerCount, phrase) => innerCount + countOccurrences(text, phrase),
        0,
      )
    );
  }, 0);

  return cycleWarnings + rowWarnings;
}

function getCycleOrdinal(cycleIndexLabel: string): number | undefined {
  const match = /(\d+)/u.exec(cycleIndexLabel);

  return match === null ? undefined : Number(match[1]);
}

function countCycleIndexLeakWarnings(draft: MajorFortuneReportDraft): number {
  const cycleOrdinal = getCycleOrdinal(draft.cycleSummary.cycleIndexLabel);

  if (cycleOrdinal === undefined) {
    return 0;
  }

  const leakedFlowIndex =
    draft.flowIndexSummary.flowIndex === cycleOrdinal ? 1 : 0;
  const leakedCardIndexes = draft.decadeCards.filter(
    (card) => card.index === cycleOrdinal,
  ).length;

  return leakedFlowIndex + leakedCardIndexes;
}

function countTechnicalTermWithoutExplanationWarnings(
  visibleText: string,
): number {
  const sentences = visibleText.split(/[.!?。！？\n]/u);

  return sentences.filter((sentence) => {
    if (sentence.trim().length < 12) {
      return false;
    }

    const warningTerms = technicalTerms.filter((term) => term.length > 1);
    const hasTechnicalTerm = warningTerms.some((term) =>
      sentence.includes(term),
    );

    if (!hasTechnicalTerm) {
      return false;
    }

    const hasPlainExplanation =
      sentence.includes(":") ||
      technicalTermPlainMarkers.some((marker) => sentence.includes(marker));

    return !hasPlainExplanation;
  }).length;
}

function countSmallEventOverfocusWarnings(visibleText: string): number {
  const smallEventCount = smallEventMarkers.reduce(
    (count, marker) => count + countOccurrences(visibleText, marker),
    0,
  );

  return smallEventCount > 3 ? smallEventCount - 3 : 0;
}

function countRepeatedSummaryWarnings(visibleText: string): number {
  const normalizedSentences = visibleText
    .split(/[.!?。！？\n]/u)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 18);
  const counts = new Map<string, number>();

  for (const sentence of normalizedSentences) {
    counts.set(sentence, (counts.get(sentence) ?? 0) + 1);
  }

  return [...counts.values()].filter((count) => count > 5).length;
}

function countWeakStrategyWarnings(visibleText: string): number {
  return weakStrategyPhrases.reduce(
    (count, phrase) => count + countOccurrences(visibleText, phrase),
    0,
  );
}

function countRelationshipStatusMisuseWarnings(
  draft: MajorFortuneReportDraft,
  visibleText: string,
): number {
  if (draft.userContextSummary.relationshipStatusLabel !== "미입력") {
    return 0;
  }

  return relationshipKnownClaimPhrases.reduce(
    (count, phrase) => count + countOccurrences(visibleText, phrase),
    0,
  );
}

function countUnknownStatusExposureWarnings(
  draft: MajorFortuneReportDraft,
  interpretiveText: string,
): number {
  if (draft.userContextSummary.relationshipStatusLabel !== "미입력") {
    return 0;
  }

  return unknownRelationshipExposurePhrases.reduce(
    (count, phrase) => count + countOccurrences(interpretiveText, phrase),
    0,
  );
}

function countShortStrategyBodyWarnings(draft: MajorFortuneReportDraft): number {
  return draft.finalAdvice.filter((advice) => {
    const body = advice.body.trim();

    return body.length < 16;
  }).length;
}

function countWeakSpecificityWarnings(draft: MajorFortuneReportDraft): number {
  return draft.finalAdvice.filter((advice) => {
    const body = advice.body;
    const markerCount = specificityMarkers.filter((marker) =>
      body.includes(marker),
    ).length;

    return body.length < 90 && markerCount === 0;
  }).length;
}

function countStrongYearTitleRepeatWarnings(
  draft: MajorFortuneReportDraft,
): number {
  return draft.strongYears.filter((year) =>
    year.headline.includes("특히 강하게 체감될 수 있는 해 TOP 5"),
  ).length;
}

function countSlashSeparatedWhyStrongWarnings(
  draft: MajorFortuneReportDraft,
): number {
  return draft.strongYears.filter(
    (year) => (year.whyStrong.match(/\s\/\s/gu)?.length ?? 0) > 1,
  ).length;
}

function countDuplicateStrongYearHeadlineWarnings(
  draft: MajorFortuneReportDraft,
): number {
  const counts = new Map<string, number>();

  for (const year of draft.strongYears) {
    const headline = year.headline.trim();

    if (headline.length === 0) {
      continue;
    }
    counts.set(headline, (counts.get(headline) ?? 0) + 1);
  }

  return [...counts.values()].reduce(
    (total, count) => (count > 1 ? total + count - 1 : total),
    0,
  );
}

function countUnknownRelationshipPillWarnings(
  draft: MajorFortuneReportDraft,
): number {
  const label = draft.userContextSummary.relationshipStatusLabel ?? "";

  return /관계 상태 미입력|연애 상태 미입력|관계 상태가 미입력|연애 상태가 미입력/u.test(
    label,
  )
    ? 1
    : 0;
}

function countWeakAuxiliaryStarWarnings(draft: MajorFortuneReportDraft): number {
  return draft.myeongliLayers.auxiliaryStarsLayer.filter((star) =>
    weakAuxiliaryStarPhrases.some((phrase) => star.plain.includes(phrase)),
  ).length;
}

function countRepeatedThemeWarnings(visibleText: string): number {
  return repeatedThemeWords.reduce((count, word) => {
    const occurrences = countOccurrences(visibleText, word);

    return occurrences > 48 ? count + (occurrences - 48) : count;
  }, 0);
}

function countRepeatedStrategyWarnings(
  draft: MajorFortuneReportDraft,
): number {
  const counts = new Map<string, number>();

  for (const row of draft.majorFortuneTimelineRows) {
    const strategy = row.strategy.trim();

    if (strategy.length === 0) {
      continue;
    }
    counts.set(strategy, (counts.get(strategy) ?? 0) + 1);
  }

  return [...counts.values()].reduce(
    (total, count) =>
      count > repeatedStrategyLimit ? total + count - repeatedStrategyLimit : total,
    0,
  );
}

function countRepeatedStrongYearStrategyWarnings(
  strategies: readonly string[],
): number {
  const counts = new Map<string, number>();

  for (const strategy of strategies) {
    const normalized = strategy.trim();

    if (normalized.length === 0) {
      continue;
    }
    counts.set(normalized, (counts.get(normalized) ?? 0) + 1);
  }

  return [...counts.values()].reduce(
    (total, count) =>
      count > repeatedStrongYearStrategyLimit
        ? total + count - repeatedStrongYearStrategyLimit
        : total,
    0,
  );
}

function countEmptyMyeongliBasisWarnings(
  draft: MajorFortuneReportDraft,
): number {
  const layers = draft.myeongliLayers;
  const hasTenGod = layers.tenGodLayer.plain.trim().length > 0;
  const hasElement = layers.elementLayer.plain.trim().length > 0;
  const hasBranch =
    layers.branchInteractionLayer.plain.trim().length > 0 ||
    layers.branchInteractionLayer.interactions.length > 0;
  const hasHiddenStem = layers.hiddenStemLayer.plain.trim().length > 0;

  return hasTenGod && hasElement && hasBranch && hasHiddenStem ? 0 : 1;
}

function countDuplicateNormalizedValues(values: readonly string[]): number {
  const counts = new Map<string, number>();

  for (const value of values) {
    const normalized = value.replace(/\s+/gu, " ").trim();

    if (normalized.length === 0) {
      continue;
    }
    counts.set(normalized, (counts.get(normalized) ?? 0) + 1);
  }

  return [...counts.values()].reduce(
    (total, count) => (count > 1 ? total + count - 1 : total),
    0,
  );
}

function countDuplicateBigThemeDomainWarnings(
  draft: MajorFortuneReportDraft,
): number {
  const moneyThemeCount =
    draft.bigThemes.length === 3
      ? draft.bigThemes.filter(
          (theme) =>
            classifyMajorFortuneBigThemeDomain(theme) === "money_resource",
        ).length
      : 0;

  return (
    (moneyThemeCount > 1 ? moneyThemeCount - 1 : 0) +
    countDuplicateNormalizedValues(draft.bigThemes.map((theme) => theme.title)) +
    countDuplicateNormalizedValues(
      draft.bigThemes.map((theme) => theme.metaphor),
    )
  );
}

function countDuplicateBigThemeWarnings(draft: MajorFortuneReportDraft): number {
  return countDuplicateBigThemeDomainWarnings(draft);
}

function countTimelineSpacingWarnings(visibleText: string): number {
  return (visibleText.match(/(?:대운|세운)[甲乙丙丁戊己庚辛壬癸]/gu)?.length ?? 0);
}

function countAgeBasisRepetitionWarnings(draft: MajorFortuneReportDraft): number {
  const count = draft.majorFortuneTimelineRows.filter(
    (row) => row.ageBasisLabel !== null && row.ageBasisLabel.trim().length > 0,
  ).length;

  return count > 1 ? count - 1 : 0;
}

export function summarizeMajorFortuneDraftQuality(
  draft: MajorFortuneReportDraft,
): MajorFortuneDraftQualitySummary {
  const visibleText = collectVisibleStrings(draft).join("\n");
  const interpretiveText = collectInterpretiveStrings(draft).join("\n");
  const hardClaimWarnings = hardClaimReplacements.reduce(
    (count, [phrase]) => count + countOccurrences(visibleText, phrase),
    0,
  );
  const internalArtifactWarnings = internalForbiddenWords.reduce(
    (count, word) =>
      count + countOccurrences(visibleText.toLowerCase(), word.toLowerCase()),
    0,
  );
  const repeatedTerminologyWarnings =
    countRepeatedTerminologyWarnings(visibleText);
  const annualToneWarnings = countAnnualToneWarnings(visibleText);
  const decadeToneWarnings = countDecadeToneWarnings(visibleText);
  const strongYearReasonWarnings = countStrongYearReasonWarnings(draft);
  const missingCycleYearWarnings = countMissingCycleYearWarnings(draft);
  const cycleIndexLeakWarnings = countCycleIndexLeakWarnings(draft);
  const technicalTermWithoutExplanationWarnings =
    countTechnicalTermWithoutExplanationWarnings(visibleText);
  const smallEventOverfocusWarnings =
    countSmallEventOverfocusWarnings(visibleText);
  const wrongCycleBasisWarnings = countWrongCycleBasisWarnings(draft);
  const genericTimelineWarnings = countGenericTimelineWarnings(draft);
  const repeatedSummaryWarnings = countRepeatedSummaryWarnings(visibleText);
  const weakStrategyWarnings = countWeakStrategyWarnings(visibleText);
  const relationshipStatusMisuseWarnings =
    countRelationshipStatusMisuseWarnings(draft, visibleText);
  const strongYearTitleRepeatWarnings =
    countStrongYearTitleRepeatWarnings(draft);
  const repeatedThemeWarnings = countRepeatedThemeWarnings(visibleText);
  const repeatedStrategyWarnings = countRepeatedStrategyWarnings(draft);
  const emptyMyeongliBasisWarnings = countEmptyMyeongliBasisWarnings(draft);
  const duplicateBigThemeWarnings = countDuplicateBigThemeWarnings(draft);
  const duplicateBigThemeDomainWarnings =
    countDuplicateBigThemeDomainWarnings(draft);
  const duplicateStrongYearPushWarnings =
    countRepeatedStrongYearStrategyWarnings(
      draft.strongYears.map((year) => year.pushStrategy),
    );
  const duplicateStrongYearReduceWarnings =
    countRepeatedStrongYearStrategyWarnings(
      draft.strongYears.map((year) => year.reduceStrategy),
    );
  const duplicateTopPushWarnings = duplicateStrongYearPushWarnings;
  const duplicateTopReduceWarnings = duplicateStrongYearReduceWarnings;
  const shortStrategyBodyWarnings = countShortStrategyBodyWarnings(draft);
  const unknownStatusExposureWarnings = countUnknownStatusExposureWarnings(
    draft,
    interpretiveText,
  );
  const weakSpecificityWarnings = countWeakSpecificityWarnings(draft);
  const unknownRelationshipPillWarnings =
    countUnknownRelationshipPillWarnings(draft);
  const slashSeparatedWhyStrongWarnings =
    countSlashSeparatedWhyStrongWarnings(draft);
  const duplicateStrongYearHeadlineWarnings =
    countDuplicateStrongYearHeadlineWarnings(draft);
  const weakAuxiliaryStarWarnings = countWeakAuxiliaryStarWarnings(draft);
  const timelineSpacingWarnings = countTimelineSpacingWarnings(visibleText);
  const ageBasisRepetitionWarnings = countAgeBasisRepetitionWarnings(draft);

  return {
    hardClaimWarnings,
    internalArtifactWarnings,
    repeatedTerminologyWarnings,
    annualToneWarnings,
    decadeToneWarnings,
    strongYearReasonWarnings,
    cycleYearTimelineCount: draft.cycleYearTimeline.length,
    missingCycleYearWarnings,
    cycleIndexLeakWarnings,
    technicalTermWithoutExplanationWarnings,
    smallEventOverfocusWarnings,
    wrongCycleBasisWarnings,
    genericTimelineWarnings,
    repeatedSummaryWarnings,
    weakStrategyWarnings,
    relationshipStatusMisuseWarnings,
    strongYearTitleRepeatWarnings,
    repeatedThemeWarnings,
    repeatedStrategyWarnings,
    emptyMyeongliBasisWarnings,
    duplicateBigThemeWarnings,
    duplicateBigThemeDomainWarnings,
    duplicateStrongYearPushWarnings,
    duplicateStrongYearReduceWarnings,
    duplicateTopPushWarnings,
    duplicateTopReduceWarnings,
    shortStrategyBodyWarnings,
    unknownStatusExposureWarnings,
    weakSpecificityWarnings,
    unknownRelationshipPillWarnings,
    slashSeparatedWhyStrongWarnings,
    duplicateStrongYearHeadlineWarnings,
    weakAuxiliaryStarWarnings,
    timelineSpacingWarnings,
    ageBasisRepetitionWarnings,
  };
}

function validateDomainSet(
  values: readonly MajorFortuneDomainLabel[],
  errors: string[],
  errorCode: string,
): void {
  const missing = majorFortuneDomainLabels.filter(
    (label) => !values.includes(label),
  );
  const hasDuplicates = new Set(values).size !== values.length;

  if (missing.length > 0 || hasDuplicates) {
    errors.push(errorCode);
  }
}

function isBlankText(value: string | undefined): boolean {
  return value === undefined || value.trim().length === 0;
}

function validateLaunchFlowSection(
  flow: MajorFortuneDraftFlowSection | undefined,
  errors: string[],
  errorCode: string,
): void {
  if (flow === undefined) {
    errors.push(`${errorCode}:missing`);
    return;
  }
  if (
    isBlankText(flow.title) ||
    isBlankText(flow.summary) ||
    isBlankText(flow.actionHint)
  ) {
    errors.push(`${errorCode}:text`);
  }
  if (flow.supportingSignals.length === 0) {
    errors.push(`${errorCode}:supportingSignals`);
  }
  if (flow.frictionSignals.length === 0) {
    errors.push(`${errorCode}:frictionSignals`);
  }
}

function validateLaunchContract(
  draft: MajorFortuneReportDraft,
  errors: string[],
): void {
  const requiredTextSections = [
    ["headline", draft.headline],
    ["currentCycleSummary", draft.currentCycleSummary],
    ["tenYearTheme", draft.tenYearTheme],
    ["timelineReading", draft.timelineReading],
    ["annualCrossReading", draft.annualCrossReading],
    ["mbtiExpression", draft.mbtiExpression],
  ] as const;

  for (const [fieldName, value] of requiredTextSections) {
    if (isBlankText(value)) {
      errors.push(`MAJOR_FORTUNE_LAUNCH_SECTION_MISSING:${fieldName}`);
    }
  }

  validateLaunchFlowSection(
    draft.careerWorkFlow,
    errors,
    "MAJOR_FORTUNE_DOMAIN_FLOW_INVALID:careerWorkFlow",
  );
  validateLaunchFlowSection(
    draft.moneyResourceFlow,
    errors,
    "MAJOR_FORTUNE_DOMAIN_FLOW_INVALID:moneyResourceFlow",
  );
  validateLaunchFlowSection(
    draft.relationshipFlow,
    errors,
    "MAJOR_FORTUNE_DOMAIN_FLOW_INVALID:relationshipFlow",
  );
  validateLaunchFlowSection(
    draft.healthRoutineFlow,
    errors,
    "MAJOR_FORTUNE_DOMAIN_FLOW_INVALID:healthRoutineFlow",
  );

  if ((draft.riskManagement ?? []).length < 2) {
    errors.push("MAJOR_FORTUNE_RISK_MANAGEMENT_INVALID");
  }
  if ((draft.actionPlan ?? []).length < 3) {
    errors.push("MAJOR_FORTUNE_ACTION_PLAN_INVALID");
  }
}

function validateArrayLengths(
  draft: MajorFortuneReportDraft,
  errors: string[],
): void {
  if (draft.decadeCards.length !== majorFortuneDomainLabels.length) {
    errors.push("MAJOR_FORTUNE_DECADE_CARDS_INVALID");
  }
  validateDomainSet(
    draft.decadeCards.map((card) => card.label),
    errors,
    "MAJOR_FORTUNE_DECADE_CARD_DOMAINS_INVALID",
  );
  if (draft.bigThemes.length < 3 || draft.bigThemes.length > 5) {
    errors.push("MAJOR_FORTUNE_BIG_THEMES_INVALID");
  }
  for (const [index, theme] of draft.bigThemes.entries()) {
    if (theme.likelyScenes.length < 2 || theme.likelyScenes.length > 4) {
      errors.push(`MAJOR_FORTUNE_BIG_THEME_SCENES_INVALID:${index}`);
    }
  }
  if (draft.cycleChapters.length < 6 || draft.cycleChapters.length > 10) {
    errors.push("MAJOR_FORTUNE_CHAPTER_COUNT_INVALID");
  }
  for (const [index, chapter] of draft.cycleChapters.entries()) {
    if (chapter.likelyScenes.length < 2 || chapter.likelyScenes.length > 4) {
      errors.push(`MAJOR_FORTUNE_LIKELY_SCENES_INVALID:${index}`);
    }
    if (
      chapter.practicalAdvice.length < 2 ||
      chapter.practicalAdvice.length > 4
    ) {
      errors.push(`MAJOR_FORTUNE_PRACTICAL_ADVICE_INVALID:${index}`);
    }
  }
  if (draft.phaseTimeline.length !== 3) {
    errors.push("MAJOR_FORTUNE_PHASE_TIMELINE_INVALID");
  }
  if (
    draft.phaseTimeline.length === 3 &&
    !phaseOrder.every((phase, index) => draft.phaseTimeline[index]?.phase === phase)
  ) {
    errors.push("MAJOR_FORTUNE_PHASE_TIMELINE_ORDER_INVALID");
  }
  if (draft.strongYears.length < 3 || draft.strongYears.length > 5) {
    errors.push("MAJOR_FORTUNE_STRONG_YEARS_INVALID");
  }
  if (draft.cycleYearTimeline.length !== 10) {
    errors.push("MAJOR_FORTUNE_CYCLE_YEAR_TIMELINE_INVALID");
  }
  if (draft.majorFortuneTimelineRows.length !== 10) {
    errors.push("MAJOR_FORTUNE_TIMELINE_ROWS_INVALID");
  }
  if (!draft.majorFortuneTimelineRows.some((row) => row.isCurrentYear)) {
    errors.push("MAJOR_FORTUNE_TIMELINE_CURRENT_YEAR_MISSING");
  }
  if (countMissingCycleYearWarnings(draft) > 0) {
    errors.push("MAJOR_FORTUNE_CYCLE_YEAR_TIMELINE_MISSING_YEARS");
  }
  if (draft.finalAdvice.length !== majorFortuneDomainLabels.length) {
    errors.push("MAJOR_FORTUNE_FINAL_ADVICE_INVALID");
  }
  validateDomainSet(
    draft.finalAdvice.map((advice) => advice.label),
    errors,
    "MAJOR_FORTUNE_FINAL_ADVICE_DOMAINS_INVALID",
  );
  if (draft.safetyNotes.length < 2 || draft.safetyNotes.length > 4) {
    errors.push("MAJOR_FORTUNE_SAFETY_NOTES_INVALID");
  }
  validateLaunchContract(draft, errors);
}

export function validateMajorFortuneReportDraft(
  draft: unknown,
): MajorFortuneReportDraftValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!hasDraftShape(draft)) {
    return {
      ok: false,
      errors: ["MAJOR_FORTUNE_SCHEMA_INVALID"],
      warnings,
    };
  }

  const sanitizedDraft = sanitizeDraft(draft);
  const safetyNotesRepairSummary = getMajorFortuneSafetyNotesRepairSummary({
    rawSafetyNotes: (draft as { readonly safetyNotes?: unknown }).safetyNotes,
    repairedSafetyNotes: sanitizedDraft.safetyNotes,
  });
  validateArrayLengths(sanitizedDraft, errors);

  const visibleText = collectVisibleStrings(sanitizedDraft).join("\n");
  for (const word of internalForbiddenWords) {
    if (visibleText.toLowerCase().includes(word.toLowerCase())) {
      errors.push(`MAJOR_FORTUNE_INTERNAL_WORD_VISIBLE:${word}`);
    }
  }
  for (const expression of deterministicForbiddenExpressions) {
    if (visibleText.includes(expression)) {
      errors.push(`MAJOR_FORTUNE_FORBIDDEN_EXPRESSION:${expression}`);
    }
  }
  const quality = summarizeMajorFortuneDraftQuality(sanitizedDraft);

  if (safetyNotesRepairSummary.warningCount > 0) {
    warnings.push(
      `MAJOR_FORTUNE_SAFETY_NOTE_WARNING:${safetyNotesRepairSummary.warningCount}`,
    );
  }
  if (safetyNotesRepairSummary.repaired) {
    warnings.push("MAJOR_FORTUNE_SAFETY_NOTES_REPAIRED");
  }

  if (quality.annualToneWarnings > 0) {
    warnings.push(`MAJOR_FORTUNE_ANNUAL_TONE_WARNING:${quality.annualToneWarnings}`);
  }
  if (quality.decadeToneWarnings > 0) {
    warnings.push(`MAJOR_FORTUNE_DECADE_TONE_WARNING:${quality.decadeToneWarnings}`);
  }
  if (quality.strongYearReasonWarnings > 0) {
    warnings.push(
      `MAJOR_FORTUNE_STRONG_YEAR_REASON_WARNING:${quality.strongYearReasonWarnings}`,
    );
  }
  if (quality.cycleIndexLeakWarnings > 0) {
    warnings.push(
      `MAJOR_FORTUNE_CYCLE_INDEX_LEAK_WARNING:${quality.cycleIndexLeakWarnings}`,
    );
  }
  if (quality.technicalTermWithoutExplanationWarnings > 0) {
    warnings.push(
      `MAJOR_FORTUNE_TECHNICAL_TERM_WARNING:${quality.technicalTermWithoutExplanationWarnings}`,
    );
  }
  if (quality.smallEventOverfocusWarnings > 0) {
    warnings.push(
      `MAJOR_FORTUNE_SMALL_EVENT_OVERFOCUS_WARNING:${quality.smallEventOverfocusWarnings}`,
    );
  }
  if (quality.wrongCycleBasisWarnings > 0) {
    warnings.push(
      `MAJOR_FORTUNE_WRONG_CYCLE_BASIS_WARNING:${quality.wrongCycleBasisWarnings}`,
    );
  }
  if (quality.genericTimelineWarnings > 0) {
    warnings.push(
      `MAJOR_FORTUNE_GENERIC_TIMELINE_WARNING:${quality.genericTimelineWarnings}`,
    );
  }
  if (quality.repeatedSummaryWarnings > 0) {
    warnings.push(
      `MAJOR_FORTUNE_REPEATED_SUMMARY_WARNING:${quality.repeatedSummaryWarnings}`,
    );
  }
  if (quality.weakStrategyWarnings > 0) {
    warnings.push(
      `MAJOR_FORTUNE_WEAK_STRATEGY_WARNING:${quality.weakStrategyWarnings}`,
    );
  }
  if (quality.relationshipStatusMisuseWarnings > 0) {
    warnings.push(
      `MAJOR_FORTUNE_RELATIONSHIP_STATUS_MISUSE_WARNING:${quality.relationshipStatusMisuseWarnings}`,
    );
  }
  if (quality.strongYearTitleRepeatWarnings > 0) {
    warnings.push(
      `MAJOR_FORTUNE_STRONG_YEAR_TITLE_REPEAT_WARNING:${quality.strongYearTitleRepeatWarnings}`,
    );
  }
  if (quality.repeatedThemeWarnings > 0) {
    warnings.push(
      `MAJOR_FORTUNE_REPEATED_THEME_WARNING:${quality.repeatedThemeWarnings}`,
    );
  }
  if (quality.repeatedStrategyWarnings > 0) {
    warnings.push(
      `MAJOR_FORTUNE_REPEATED_STRATEGY_WARNING:${quality.repeatedStrategyWarnings}`,
    );
  }
  if (quality.emptyMyeongliBasisWarnings > 0) {
    warnings.push(
      `MAJOR_FORTUNE_EMPTY_MYEONGLI_BASIS_WARNING:${quality.emptyMyeongliBasisWarnings}`,
    );
  }
  if (quality.duplicateBigThemeWarnings > 0) {
    warnings.push(
      `MAJOR_FORTUNE_DUPLICATE_BIG_THEME_WARNING:${quality.duplicateBigThemeWarnings}`,
    );
  }
  if (quality.duplicateStrongYearPushWarnings > 0) {
    warnings.push(
      `MAJOR_FORTUNE_DUPLICATE_STRONG_YEAR_PUSH_WARNING:${quality.duplicateStrongYearPushWarnings}`,
    );
    warnings.push(
      `MAJOR_FORTUNE_DUPLICATE_TOP_PUSH_WARNING:${quality.duplicateTopPushWarnings}`,
    );
  }
  if (quality.duplicateStrongYearReduceWarnings > 0) {
    warnings.push(
      `MAJOR_FORTUNE_DUPLICATE_STRONG_YEAR_REDUCE_WARNING:${quality.duplicateStrongYearReduceWarnings}`,
    );
    warnings.push(
      `MAJOR_FORTUNE_DUPLICATE_TOP_REDUCE_WARNING:${quality.duplicateTopReduceWarnings}`,
    );
  }
  if (quality.shortStrategyBodyWarnings > 0) {
    warnings.push(
      `MAJOR_FORTUNE_SHORT_STRATEGY_BODY_WARNING:${quality.shortStrategyBodyWarnings}`,
    );
  }
  if (quality.unknownStatusExposureWarnings > 0) {
    warnings.push(
      `MAJOR_FORTUNE_UNKNOWN_STATUS_EXPOSURE_WARNING:${quality.unknownStatusExposureWarnings}`,
    );
  }
  if (quality.weakSpecificityWarnings > 0) {
    warnings.push(
      `MAJOR_FORTUNE_WEAK_SPECIFICITY_WARNING:${quality.weakSpecificityWarnings}`,
    );
  }
  if (quality.unknownRelationshipPillWarnings > 0) {
    warnings.push(
      `MAJOR_FORTUNE_UNKNOWN_RELATIONSHIP_PILL_WARNING:${quality.unknownRelationshipPillWarnings}`,
    );
  }
  if (quality.slashSeparatedWhyStrongWarnings > 0) {
    warnings.push(
      `MAJOR_FORTUNE_SLASH_SEPARATED_WHY_STRONG_WARNING:${quality.slashSeparatedWhyStrongWarnings}`,
    );
  }
  if (quality.duplicateStrongYearHeadlineWarnings > 0) {
    warnings.push(
      `MAJOR_FORTUNE_DUPLICATE_STRONG_YEAR_HEADLINE_WARNING:${quality.duplicateStrongYearHeadlineWarnings}`,
    );
  }
  if (quality.weakAuxiliaryStarWarnings > 0) {
    warnings.push(
      `MAJOR_FORTUNE_WEAK_AUXILIARY_STAR_WARNING:${quality.weakAuxiliaryStarWarnings}`,
    );
  }
  if (quality.timelineSpacingWarnings > 0) {
    warnings.push(
      `MAJOR_FORTUNE_TIMELINE_SPACING_WARNING:${quality.timelineSpacingWarnings}`,
    );
  }
  if (quality.ageBasisRepetitionWarnings > 0) {
    warnings.push(
      `MAJOR_FORTUNE_AGE_BASIS_REPETITION_WARNING:${quality.ageBasisRepetitionWarnings}`,
    );
  }

  return errors.length === 0
    ? { ok: true, errors: [], warnings, value: sanitizedDraft }
    : { ok: false, errors, warnings };
}

export function assertValidMajorFortuneReportDraft(
  draft: unknown,
): MajorFortuneReportDraft {
  const result = validateMajorFortuneReportDraft(draft);

  if (!result.ok || result.value === undefined) {
    throw new Error(
      `Major fortune report draft is invalid: ${result.errors.join("; ")}`,
    );
  }

  return result.value;
}
