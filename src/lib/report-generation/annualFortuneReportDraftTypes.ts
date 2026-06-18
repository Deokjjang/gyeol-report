import type { AnnualFortuneMode } from "../report-knowledge/annualFortuneTypes";

export type AnnualFortuneReportMode = Exclude<
  AnnualFortuneMode,
  "locked_future"
>;

export type AnnualFortuneFlowCardLabel =
  | "일·성과"
  | "돈·현실"
  | "인간관계"
  | "연애·가족"
  | "학업·자격증"
  | "몸·생활 리듬";

export type AnnualFortuneKeySignalType =
  | "opportunity"
  | "difficulty"
  | "mixed"
  | "recovery"
  | "caution";

export interface AnnualFortuneReportDraft {
  readonly version: "v1";
  readonly productType: "annual_fortune";
  readonly productVersion: "v1";
  readonly targetYear: number;
  readonly mode: AnnualFortuneReportMode;
  readonly personLabel: string;
  readonly openingTitle: string;
  readonly openingSummary: string;
  readonly coreLine: string;
  readonly yearSummary: {
    readonly ganji: string;
    readonly displayTitle: string;
    readonly elementLabel: string;
    readonly tenGodLabel: string;
    readonly modeLabel: string;
    readonly yearTone: string;
  };
  readonly scoreSummary: {
    readonly flowIndex: number;
    readonly flowTypeLabel: string;
    readonly flowIndexCaution: string;
  };
  readonly flowCards: readonly {
    readonly label: AnnualFortuneFlowCardLabel | string;
    readonly score: number;
    readonly headline: string;
    readonly body: string;
  }[];
  readonly keySignals: readonly {
    readonly type: AnnualFortuneKeySignalType;
    readonly title: string;
    readonly body: string;
    readonly evidenceLabel: string;
  }[];
  readonly annualStructure: {
    readonly ganjiExplanation: string;
    readonly tenGodExplanation: string;
    readonly elementEffectExplanation: string;
    readonly branchInteractionExplanation: string;
  };
  readonly chapters: readonly {
    readonly title: string;
    readonly headline: string;
    readonly body: string;
    readonly likelyScenes: readonly string[];
    readonly practicalAdvice: readonly string[];
  }[];
  readonly monthlyFlow: readonly {
    readonly month: number;
    readonly label: string;
    readonly headline: string;
    readonly elementFocus: string | null;
    readonly body: string;
    readonly advice: string;
  }[];
  readonly finalAdvice: readonly string[];
  readonly safetyNotes: readonly string[];
}

export function isAnnualFortuneReportMode(
  value: unknown,
): value is AnnualFortuneReportMode {
  return (
    value === "past_review" ||
    value === "current_year" ||
    value === "new_year_preview"
  );
}

const stringSchema = { type: "string" } as const;
const nullableStringSchema = { type: ["string", "null"] } as const;
const numberSchema = { type: "number" } as const;
const stringArraySchema = {
  type: "array",
  items: stringSchema,
} as const;

const flowCardSchema = {
  type: "object",
  additionalProperties: false,
  required: ["label", "score", "headline", "body"],
  properties: {
    label: stringSchema,
    score: numberSchema,
    headline: stringSchema,
    body: stringSchema,
  },
} as const;

const keySignalSchema = {
  type: "object",
  additionalProperties: false,
  required: ["type", "title", "body", "evidenceLabel"],
  properties: {
    type: {
      type: "string",
      enum: ["opportunity", "difficulty", "mixed", "recovery", "caution"],
    },
    title: stringSchema,
    body: stringSchema,
    evidenceLabel: stringSchema,
  },
} as const;

const chapterSchema = {
  type: "object",
  additionalProperties: false,
  required: ["title", "headline", "body", "likelyScenes", "practicalAdvice"],
  properties: {
    title: stringSchema,
    headline: stringSchema,
    body: stringSchema,
    likelyScenes: stringArraySchema,
    practicalAdvice: stringArraySchema,
  },
} as const;

const monthlyFlowSchema = {
  type: "object",
  additionalProperties: false,
  required: ["month", "label", "headline", "elementFocus", "body", "advice"],
  properties: {
    month: numberSchema,
    label: stringSchema,
    headline: stringSchema,
    elementFocus: nullableStringSchema,
    body: stringSchema,
    advice: stringSchema,
  },
} as const;

export const annualFortuneReportDraftJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "version",
    "productType",
    "productVersion",
    "targetYear",
    "mode",
    "personLabel",
    "openingTitle",
    "openingSummary",
    "coreLine",
    "yearSummary",
    "scoreSummary",
    "flowCards",
    "keySignals",
    "annualStructure",
    "chapters",
    "monthlyFlow",
    "finalAdvice",
    "safetyNotes",
  ],
  properties: {
    version: { type: "string", enum: ["v1"] },
    productType: { type: "string", enum: ["annual_fortune"] },
    productVersion: { type: "string", enum: ["v1"] },
    targetYear: numberSchema,
    mode: {
      type: "string",
      enum: ["past_review", "current_year", "new_year_preview"],
    },
    personLabel: stringSchema,
    openingTitle: stringSchema,
    openingSummary: stringSchema,
    coreLine: stringSchema,
    yearSummary: {
      type: "object",
      additionalProperties: false,
      required: [
        "ganji",
        "displayTitle",
        "elementLabel",
        "tenGodLabel",
        "modeLabel",
        "yearTone",
      ],
      properties: {
        ganji: stringSchema,
        displayTitle: stringSchema,
        elementLabel: stringSchema,
        tenGodLabel: stringSchema,
        modeLabel: stringSchema,
        yearTone: stringSchema,
      },
    },
    scoreSummary: {
      type: "object",
      additionalProperties: false,
      required: ["flowIndex", "flowTypeLabel", "flowIndexCaution"],
      properties: {
        flowIndex: numberSchema,
        flowTypeLabel: stringSchema,
        flowIndexCaution: stringSchema,
      },
    },
    flowCards: {
      type: "array",
      items: flowCardSchema,
    },
    keySignals: {
      type: "array",
      items: keySignalSchema,
    },
    annualStructure: {
      type: "object",
      additionalProperties: false,
      required: [
        "ganjiExplanation",
        "tenGodExplanation",
        "elementEffectExplanation",
        "branchInteractionExplanation",
      ],
      properties: {
        ganjiExplanation: stringSchema,
        tenGodExplanation: stringSchema,
        elementEffectExplanation: stringSchema,
        branchInteractionExplanation: stringSchema,
      },
    },
    chapters: {
      type: "array",
      items: chapterSchema,
    },
    monthlyFlow: {
      type: "array",
      items: monthlyFlowSchema,
    },
    finalAdvice: stringArraySchema,
    safetyNotes: stringArraySchema,
  },
} as const;

export function getAnnualFortuneReportDraftSchemaTopLevelKeys(): readonly string[] {
  return Object.keys(annualFortuneReportDraftJsonSchema.properties);
}
