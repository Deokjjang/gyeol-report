import {
  loveMarriageChildActionPlanLabels,
  type LoveMarriageChildReportDraft,
} from "./loveMarriageChildReportDraftTypes";

export type LoveMarriageChildReportDraftValidationResult = {
  readonly ok: boolean;
  readonly errors: readonly string[];
  readonly warnings: readonly string[];
  readonly value?: LoveMarriageChildReportDraft;
};

export const DEFAULT_LOVE_MARRIAGE_CHILD_REPORT_SAFETY_NOTES = [
  "이 리포트는 연애·결혼·자녀 역할 성향을 해석한 참고용 리포트이며, 결혼·이별·이혼을 예언하지 않습니다.",
  "자녀 파트는 실제 자녀의 사주, MBTI, 성향, 운명, 건강을 분석하지 않고 내가 부모가 되었을 때의 역할 방식만 다룹니다.",
  "이별·재회 파트는 상대의 복귀 여부나 재회 확률이 아니라 내 반복 패턴과 감정 처리 방식을 다룹니다.",
] as const;

const forbiddenExpressionPattern =
  /무조건 헤어짐|반드시 결혼|결혼 못한다|이혼한다|배우자복 없다|자식복 없다|임신|출산 확정|건강 진단|재회 확률|상대가 돌아온다/u;

const unsafeChildPattern =
  /childFortune|childDestiny|childAnalysis|자식복/u;

const unsafeBreakupReunionPattern =
  /reunionProbability|willBreakup|상대가 돌아온다|반드시 재회/u;

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

function serialized(value: unknown): string {
  return JSON.stringify(value);
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

  return loveMarriageChildActionPlanLabels.every((label) => labels.has(label));
}

function validateRequiredTextSection(input: {
  readonly draft: Record<string, unknown>;
  readonly field: string;
  readonly errors: string[];
}): void {
  const section = input.draft[input.field];

  if (!isRecord(section)) {
    input.errors.push(`LOVE_MARRIAGE_CHILD_REPORT_${input.field}_MISSING`);
    return;
  }

  for (const key of ["headline", "body"] as const) {
    if (!isNonEmptyString(section[key])) {
      input.errors.push(
        `LOVE_MARRIAGE_CHILD_REPORT_${input.field}_${key}_MISSING`,
      );
    }
  }
}

function validateArraySection(input: {
  readonly draft: Record<string, unknown>;
  readonly field: string;
  readonly errors: string[];
  readonly min?: number;
  readonly exact?: number;
}): void {
  const value = input.draft[input.field];

  if (!Array.isArray(value)) {
    input.errors.push(`LOVE_MARRIAGE_CHILD_REPORT_${input.field}_MISSING`);
    return;
  }

  if (input.exact !== undefined && value.length !== input.exact) {
    input.errors.push(`LOVE_MARRIAGE_CHILD_REPORT_${input.field}_INVALID_LENGTH`);
  }
  if (input.min !== undefined && value.length < input.min) {
    input.errors.push(`LOVE_MARRIAGE_CHILD_REPORT_${input.field}_TOO_SHORT`);
  }
}

export function validateLoveMarriageChildReportDraft(
  value: unknown,
): LoveMarriageChildReportDraftValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!isRecord(value)) {
    return {
      ok: false,
      errors: ["LOVE_MARRIAGE_CHILD_REPORT_DRAFT_NOT_OBJECT"],
      warnings,
    };
  }

  if (value.version !== "v1") {
    errors.push("LOVE_MARRIAGE_CHILD_REPORT_VERSION_INVALID");
  }
  if (value.productType !== "love_marriage_child") {
    errors.push("LOVE_MARRIAGE_CHILD_REPORT_PRODUCT_TYPE_INVALID");
  }
  if (value.productVersion !== "v1") {
    errors.push("LOVE_MARRIAGE_CHILD_REPORT_PRODUCT_VERSION_INVALID");
  }

  for (const field of ["personLabel", "headline", "openingSummary"] as const) {
    if (!isNonEmptyString(value[field])) {
      errors.push(`LOVE_MARRIAGE_CHILD_REPORT_${field}_MISSING`);
    }
  }

  for (const field of [
    "loveStyle",
    "attractionPattern",
    "loveStrengths",
    "loveFriction",
    "marriageRhythm",
    "householdMoneyAndRoleSplit",
    "conflictRecovery",
    "parentMode",
    "breakupReunionPattern",
  ] as const) {
    validateRequiredTextSection({
      draft: value,
      field,
      errors,
    });
  }

  validateArraySection({
    draft: value,
    field: "relationshipTimingHints",
    min: 1,
    errors,
  });
  validateArraySection({
    draft: value,
    field: "actionPlan",
    exact: loveMarriageChildActionPlanLabels.length,
    errors,
  });
  validateArraySection({
    draft: value,
    field: "riskManagement",
    min: 1,
    errors,
  });

  if (!hasAllActionPlanLabels(value.actionPlan)) {
    errors.push("LOVE_MARRIAGE_CHILD_REPORT_ACTION_PLAN_LABELS_INVALID");
  }

  const safetyNotes = asStringArray(value.safetyNotes);
  if (safetyNotes.length < 2) {
    errors.push("LOVE_MARRIAGE_CHILD_REPORT_SAFETY_NOTES_TOO_SHORT");
  }

  const text = serialized(value);
  if (forbiddenExpressionPattern.test(text)) {
    errors.push("LOVE_MARRIAGE_CHILD_REPORT_FORBIDDEN_EXPRESSION");
  }
  if (unsafeChildPattern.test(text)) {
    errors.push("LOVE_MARRIAGE_CHILD_REPORT_UNSAFE_CHILD_CLAIM");
  }
  if (unsafeBreakupReunionPattern.test(text)) {
    errors.push("LOVE_MARRIAGE_CHILD_REPORT_UNSAFE_BREAKUP_REUNION_CLAIM");
  }

  if (errors.length > 0) {
    return {
      ok: false,
      errors: [...new Set(errors)],
      warnings,
    };
  }

  return {
    ok: true,
    errors: [],
    warnings,
    value: value as unknown as LoveMarriageChildReportDraft,
  };
}

export function assertValidLoveMarriageChildReportDraft(
  value: LoveMarriageChildReportDraft | undefined,
): LoveMarriageChildReportDraft {
  if (value === undefined) {
    throw new Error(
      "Love marriage child report draft validation did not return a value.",
    );
  }

  return value;
}
