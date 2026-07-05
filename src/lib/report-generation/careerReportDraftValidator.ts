import {
  careerActionPlanLabels,
  type CareerReportDraft,
} from "./careerReportDraftTypes";

export type CareerReportDraftValidationResult = {
  readonly ok: boolean;
  readonly errors: readonly string[];
  readonly warnings: readonly string[];
  readonly value?: CareerReportDraft;
};

export type CareerReportDraftQualitySummary = {
  readonly hardClaimWarnings: number;
  readonly financialGuaranteeWarnings: number;
  readonly tickerWarnings: number;
  readonly buySellInstructionWarnings: number;
  readonly internalArtifactWarnings: number;
  readonly recommendedJobVarietyWarnings: number;
  readonly actionPlanWarnings: number;
  readonly safetyNoteWarnings: number;
};

export const DEFAULT_CAREER_REPORT_SAFETY_NOTES = [
  "이 리포트는 직업·커리어·돈·학업 성향과 가능성을 해석한 것이며, 특정 결과를 보장하지 않습니다.",
  "투자 관련 문장은 성향 기반 해석이며 금융 자문이나 매수·매도 지시가 아닙니다.",
  "이직·승진·창업·합격 같은 결과는 개인 선택과 환경에 따라 달라질 수 있습니다.",
] as const;

const hardClaimReplacements = [
  ["반드시", "대체로"],
  ["무조건", "조건이 맞으면"],
  ["합격합니다", "합격 가능성을 준비하는 흐름입니다"],
  ["불합격합니다", "보완이 필요한 흐름입니다"],
  ["이직합니다", "이직을 검토하기 쉬운 흐름입니다"],
  ["퇴사합니다", "퇴사 여부를 검토할 수 있는 흐름입니다"],
  ["승진합니다", "승진이나 역할 변화를 준비하기 쉬운 흐름입니다"],
  ["창업합니다", "창업이나 독립을 검토하기 쉬운 흐름입니다"],
  ["돈을 법니다", "돈이 움직이는 접점이 늘어날 수 있습니다"],
  ["투자 수익이 납니다", "투자 성향을 점검할 필요가 있습니다"],
  ["성공합니다", "성과를 볼 가능성이 커집니다"],
  ["망합니다", "손실을 줄이는 기준이 중요합니다"],
] as const;

const financialReplacements = [
  ["원금 보장", "원금 손실 가능성을 반드시 따로 검토해야 하는 제안"],
  ["수익 보장", "수익을 보장하지 않는 성향 해석"],
  ["반드시 오릅니다", "오를 수 있다고 단정할 수 없습니다"],
  ["무조건 오릅니다", "오를 수 있다고 단정할 수 없습니다"],
  ["이 종목", "개별 종목"],
  ["종목 추천", "성향 기반 투자 방식 안내"],
  ["레버리지 추천", "레버리지는 주의가 필요한 방식"],
] as const;

const buySellInstructionReplacements = [
  ["매수하세요", "매수·매도 판단은 별도 검토가 필요합니다"],
  ["매도하세요", "매수·매도 판단은 별도 검토가 필요합니다"],
] as const;

const internalForbiddenWords = [
  "evidence",
  "debug",
  "diagnostic-only",
  "schema",
  "fixture",
  "precomputed",
  "OPENAI_API_KEY",
  "Authorization",
] as const;

const tickerPattern = /\b(?:AAPL|TSLA|NVDA|MSFT|GOOGL|AMZN|005930|000660)\b/u;
const buySellPattern = /매수하세요|매도하세요/u;
const financialPattern =
  /원금 보장|수익 보장|반드시 오릅니다|무조건 오릅니다|투자 수익이 납니다|이 종목|종목 추천|레버리지 추천/u;
const hardClaimPattern =
  /반드시|무조건|합격합니다|불합격합니다|이직합니다|퇴사합니다|승진합니다|창업합니다|돈을 법니다|투자 수익이 납니다|성공합니다|망합니다/u;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function asStringArray(value: unknown): readonly string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

function replaceAllLiteral(value: string, from: string, to: string): string {
  return value.split(from).join(to);
}

export function sanitizeCareerReportVisibleText(text: string): string {
  let output = text;

  output = replaceAllLiteral(output, "흐름으로 읽힙니다", "기준으로 봅니다");

  for (const [from, to] of hardClaimReplacements) {
    output = replaceAllLiteral(output, from, to);
  }
  for (const [from, to] of financialReplacements) {
    output = replaceAllLiteral(output, from, to);
  }
  for (const [from, to] of buySellInstructionReplacements) {
    output = replaceAllLiteral(output, from, to);
  }

  output = output
    .replace(tickerPattern, "개별 종목")
    .replace(/\s+/gu, " ")
    .trim();

  for (const forbidden of internalForbiddenWords) {
    output = replaceAllLiteral(output, forbidden, "");
  }

  return output.replace(/\s+/gu, " ").trim();
}

function sanitizePersonAddressingText(text: string, personLabel: string): string {
  if (personLabel.trim().length === 0) {
    return text;
  }

  let output = text;
  const replacements = [
    [`${personLabel}님의`, "당신의"],
    [`${personLabel}님은`, "당신은"],
    [`${personLabel}님는`, "당신은"],
    [`${personLabel}님이`, "당신이"],
    [`${personLabel}님가`, "당신이"],
    [`${personLabel}님에게`, "당신에게"],
    [`${personLabel}의`, "당신의"],
    [`${personLabel}은`, "당신은"],
    [`${personLabel}는`, "당신은"],
    [`${personLabel}이`, "당신이"],
    [`${personLabel}가`, "당신이"],
    [`${personLabel}에게`, "당신에게"],
  ] as const;

  for (const [from, to] of replacements) {
    output = replaceAllLiteral(output, from, to);
  }

  return output;
}

function sanitizePersonAddressing(
  value: unknown,
  personLabel: string,
  key?: string,
): unknown {
  if (typeof value === "string") {
    return key === "personLabel" || key === "openingTitle"
      ? value
      : sanitizePersonAddressingText(value, personLabel);
  }
  if (Array.isArray(value)) {
    return value.map((item) => sanitizePersonAddressing(item, personLabel));
  }
  if (!isRecord(value)) {
    return value;
  }

  return Object.fromEntries(
    Object.entries(value).map(([entryKey, item]) => [
      entryKey,
      sanitizePersonAddressing(item, personLabel, entryKey),
    ]),
  );
}

function sanitizeValue(value: unknown): unknown {
  if (typeof value === "string") {
    return sanitizeCareerReportVisibleText(value);
  }
  if (Array.isArray(value)) {
    return value.map((item) => sanitizeValue(item));
  }
  if (!isRecord(value)) {
    return value;
  }

  return Object.fromEntries(
    Object.entries(value).map(([key, item]) => [key, sanitizeValue(item)]),
  );
}

function countPattern(value: unknown, pattern: RegExp): number {
  return pattern.test(JSON.stringify(value)) ? 1 : 0;
}

function countInternalArtifacts(value: unknown): number {
  const text = JSON.stringify(value).toLowerCase();

  return internalForbiddenWords.some((word) => text.includes(word.toLowerCase()))
    ? 1
    : 0;
}

function normalizeSafetyNotes(value: unknown): {
  readonly notes: readonly string[];
  readonly repaired: boolean;
  readonly warnings: readonly string[];
} {
  const warnings: string[] = [];
  let repaired = false;
  let notes = asStringArray(value)
    .map((note) => sanitizeCareerReportVisibleText(note))
    .filter((note) => note.length > 0);

  if (!Array.isArray(value)) {
    repaired = true;
    warnings.push("CAREER_REPORT_SAFETY_NOTES_REPAIRED");
    notes = [...DEFAULT_CAREER_REPORT_SAFETY_NOTES];
  }

  if (notes.length < 2) {
    repaired = true;
    warnings.push("CAREER_REPORT_SAFETY_NOTES_REPAIRED");
    notes = [
      ...notes,
      ...DEFAULT_CAREER_REPORT_SAFETY_NOTES,
    ].slice(0, Math.max(2, notes.length));
  }

  if (notes.length > 4) {
    repaired = true;
    warnings.push("CAREER_REPORT_SAFETY_NOTES_REPAIRED");
    notes = notes.slice(0, 4);
  }

  notes = notes.map((note, index) => {
    const sanitized = sanitizeCareerReportVisibleText(note);

    if (
      sanitized.length === 0 ||
      hardClaimPattern.test(sanitized) ||
      financialPattern.test(sanitized)
    ) {
      repaired = true;
      warnings.push(`CAREER_REPORT_SAFETY_NOTE_WARNING_${index + 1}`);
      return DEFAULT_CAREER_REPORT_SAFETY_NOTES[
        index % DEFAULT_CAREER_REPORT_SAFETY_NOTES.length
      ];
    }

    return sanitized;
  });

  return {
    notes,
    repaired,
    warnings: [...new Set(warnings)],
  };
}

function getArrayLength(value: unknown): number {
  return Array.isArray(value) ? value.length : 0;
}

function validateArrayLength(input: {
  readonly value: unknown;
  readonly name: string;
  readonly min?: number;
  readonly max?: number;
  readonly exact?: number;
  readonly errors: string[];
}): void {
  const length = getArrayLength(input.value);

  if (input.exact !== undefined && length !== input.exact) {
    input.errors.push(`${input.name}_INVALID_LENGTH`);
    return;
  }
  if (input.min !== undefined && length < input.min) {
    input.errors.push(`${input.name}_TOO_SHORT`);
  }
  if (input.max !== undefined && length > input.max) {
    input.errors.push(`${input.name}_TOO_LONG`);
  }
}

function hasAllActionPlanLabels(actionPlan: unknown): boolean {
  if (!Array.isArray(actionPlan)) {
    return false;
  }
  const labels = new Set(
    actionPlan
      .map((item) => (isRecord(item) ? item.label : undefined))
      .filter((label): label is string => typeof label === "string"),
  );

  return careerActionPlanLabels.every((label) => labels.has(label));
}

function hasRecommendedJobVariety(jobs: unknown): boolean {
  if (!Array.isArray(jobs)) {
    return false;
  }
  const titles = jobs
    .map((item) => (isRecord(item) ? item.title : undefined))
    .filter((title): title is string => typeof title === "string");

  return new Set(titles).size >= Math.min(6, titles.length);
}

export function validateCareerReportDraft(
  value: unknown,
): CareerReportDraftValidationResult {
  const originalHardClaimWarnings = countPattern(value, hardClaimPattern);
  const originalFinancialWarnings = countPattern(value, financialPattern);
  const originalTickerWarnings = countPattern(value, tickerPattern);
  const originalBuySellWarnings = countPattern(value, buySellPattern);
  const originalInternalWarnings = countInternalArtifacts(value);
  const sanitizedValue = sanitizeValue(value);
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!isRecord(sanitizedValue)) {
    return {
      ok: false,
      errors: ["CAREER_REPORT_DRAFT_NOT_OBJECT"],
      warnings,
    };
  }

  const sanitizedPersonLabel = isNonEmptyString(sanitizedValue.personLabel)
    ? sanitizedValue.personLabel
    : "";
  const sanitized = sanitizePersonAddressing(
    sanitizedValue,
    sanitizedPersonLabel,
  ) as Record<string, unknown>;

  if (sanitized.version !== "v1") {
    errors.push("CAREER_REPORT_VERSION_INVALID");
  }
  if (sanitized.productType !== "career_money_study") {
    errors.push("CAREER_REPORT_PRODUCT_TYPE_INVALID");
  }
  if (sanitized.productVersion !== "v1") {
    errors.push("CAREER_REPORT_PRODUCT_VERSION_INVALID");
  }

  const requiredStringFields = [
    "personLabel",
    "openingTitle",
    "openingSummary",
    "coreLine",
  ] as const;

  for (const field of requiredStringFields) {
    if (!isNonEmptyString(sanitized[field])) {
      errors.push(`CAREER_REPORT_${field}_MISSING`);
    }
  }

  for (const field of [
    "userContextSummary",
    "careerIdentity",
    "myeongliMbtiSummary",
    "moneyEarningStyle",
    "investmentAndSavingStyle",
    "studyCertificatePlan",
  ] as const) {
    if (!isRecord(sanitized[field])) {
      errors.push(`CAREER_REPORT_${field}_MISSING`);
    }
  }

  validateArrayLength({
    value: sanitized.recommendedJobs,
    name: "CAREER_REPORT_RECOMMENDED_JOBS",
    min: 8,
    max: 20,
    errors,
  });
  validateArrayLength({
    value: sanitized.unsuitableJobs,
    name: "CAREER_REPORT_UNSUITABLE_JOBS",
    min: 3,
    max: 8,
    errors,
  });
  validateArrayLength({
    value: sanitized.careerPaths,
    name: "CAREER_REPORT_CAREER_PATHS",
    min: 3,
    max: 6,
    errors,
  });
  validateArrayLength({
    value: sanitized.careerTiming,
    name: "CAREER_REPORT_CAREER_TIMING",
    min: 3,
    max: 8,
    errors,
  });
  validateArrayLength({
    value: sanitized.actionPlan,
    name: "CAREER_REPORT_ACTION_PLAN",
    exact: 6,
    errors,
  });

  if (!hasAllActionPlanLabels(sanitized.actionPlan)) {
    errors.push("CAREER_REPORT_ACTION_PLAN_LABELS_INVALID");
  }

  if (
    isRecord(sanitized.moneyEarningStyle) &&
    (asStringArray(sanitized.moneyEarningStyle.bestIncomeChannels).length < 3 ||
      asStringArray(sanitized.moneyEarningStyle.bestIncomeChannels).length > 8 ||
      asStringArray(sanitized.moneyEarningStyle.sideIncomeIdeas).length < 3 ||
      asStringArray(sanitized.moneyEarningStyle.sideIncomeIdeas).length > 8)
  ) {
    errors.push("CAREER_REPORT_MONEY_STYLE_CHANNELS_INVALID");
  }

  if (
    isRecord(sanitized.investmentAndSavingStyle) &&
    (!isNonEmptyString(sanitized.investmentAndSavingStyle.forbiddenNote) ||
      asStringArray(sanitized.investmentAndSavingStyle.suitablePatterns).length < 3 ||
      asStringArray(sanitized.investmentAndSavingStyle.suitablePatterns).length > 8 ||
      asStringArray(sanitized.investmentAndSavingStyle.cautionPatterns).length < 3 ||
      asStringArray(sanitized.investmentAndSavingStyle.cautionPatterns).length > 8)
  ) {
    errors.push("CAREER_REPORT_INVESTMENT_STYLE_INVALID");
  }

  if (!hasRecommendedJobVariety(sanitized.recommendedJobs)) {
    warnings.push("CAREER_REPORT_RECOMMENDED_JOB_VARIETY_WARNING");
  }

  const safety = normalizeSafetyNotes(sanitized.safetyNotes);

  if (safety.repaired) {
    warnings.push("CAREER_REPORT_SAFETY_NOTES_REPAIRED");
  }
  warnings.push(...safety.warnings);

  const normalized = {
    ...sanitized,
    safetyNotes: safety.notes,
  } as CareerReportDraft;

  if (originalHardClaimWarnings > 0) {
    warnings.push("CAREER_REPORT_HARD_CLAIM_SANITIZED");
  }
  if (originalFinancialWarnings > 0) {
    warnings.push("CAREER_REPORT_FINANCIAL_GUARANTEE_SANITIZED");
  }
  if (originalTickerWarnings > 0) {
    warnings.push("CAREER_REPORT_TICKER_SANITIZED");
  }
  if (originalBuySellWarnings > 0) {
    warnings.push("CAREER_REPORT_BUY_SELL_INSTRUCTION_SANITIZED");
  }
  if (originalInternalWarnings > 0) {
    warnings.push("CAREER_REPORT_INTERNAL_ARTIFACT_SANITIZED");
  }

  if (errors.length > 0) {
    return {
      ok: false,
      errors: [...new Set(errors)],
      warnings: [...new Set(warnings)],
    };
  }

  return {
    ok: true,
    errors: [],
    warnings: [...new Set(warnings)],
    value: normalized,
  };
}

export function assertValidCareerReportDraft(
  value: CareerReportDraft | undefined,
): CareerReportDraft {
  if (value === undefined) {
    throw new Error("Career report draft validation did not return a value.");
  }

  return value;
}

export function summarizeCareerReportDraftQuality(
  draft: CareerReportDraft,
): CareerReportDraftQualitySummary {
  return {
    hardClaimWarnings: countPattern(draft, hardClaimPattern),
    financialGuaranteeWarnings: countPattern(draft, financialPattern),
    tickerWarnings: countPattern(draft, tickerPattern),
    buySellInstructionWarnings: countPattern(draft, buySellPattern),
    internalArtifactWarnings: countInternalArtifacts(draft),
    recommendedJobVarietyWarnings: hasRecommendedJobVariety(
      draft.recommendedJobs,
    )
      ? 0
      : 1,
    actionPlanWarnings: hasAllActionPlanLabels(draft.actionPlan) ? 0 : 1,
    safetyNoteWarnings:
      draft.safetyNotes.length >= 2 && draft.safetyNotes.length <= 4 ? 0 : 1,
  };
}
