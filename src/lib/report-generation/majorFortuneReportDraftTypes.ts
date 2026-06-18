export type MajorFortuneDomainLabel =
  | "일·성과"
  | "돈·현실"
  | "인간관계"
  | "연애·가족"
  | "학업·자격증"
  | "몸·생활 리듬";

export type MajorFortuneKeySignalType =
  | "opportunity"
  | "difficulty"
  | "mixed"
  | "transition"
  | "caution";

export type MajorFortunePhase = "early" | "middle" | "late";

export interface MajorFortuneReportDraft {
  readonly version: "v1";
  readonly productType: "major_fortune";
  readonly productVersion: "v1";
  readonly personLabel: string;
  readonly openingTitle: string;
  readonly openingSummary: string;
  readonly coreLine: string;
  readonly userContextSummary: {
    readonly lifeStatusLabel: string;
    readonly fieldLabel: string | null;
    readonly translationNote: string;
  };
  readonly cycleSummary: {
    readonly ganji: string;
    readonly displayTitle: string;
    readonly ageRangeLabel: string;
    readonly yearRangeLabel: string;
    readonly stemLabel: string;
    readonly branchLabel: string;
    readonly elementLabel: string;
    readonly tenGodLabel: string;
    readonly basisLabel: string;
  };
  readonly flowIndexSummary: {
    readonly flowIndex: number;
    readonly flowTypeLabel: string;
    readonly flowIndexCaution: string;
  };
  readonly decadeCards: readonly {
    readonly label: MajorFortuneDomainLabel;
    readonly index: number;
    readonly headline: string;
    readonly body: string;
  }[];
  readonly keySignals: readonly {
    readonly type: MajorFortuneKeySignalType;
    readonly title: string;
    readonly body: string;
    readonly evidenceLabel: string;
  }[];
  readonly majorStructure: {
    readonly ganjiExplanation: string;
    readonly tenGodExplanation: string;
    readonly elementEffectExplanation: string;
    readonly branchInteractionExplanation: string;
    readonly transitionExplanation: string;
  };
  readonly cycleChapters: readonly {
    readonly title: string;
    readonly headline: string;
    readonly body: string;
    readonly likelyScenes: readonly string[];
    readonly practicalAdvice: readonly string[];
  }[];
  readonly phaseTimeline: readonly {
    readonly phase: MajorFortunePhase;
    readonly label: string;
    readonly headline: string;
    readonly body: string;
    readonly advice: string;
  }[];
  readonly strongYears: readonly {
    readonly year: number;
    readonly ganji: string;
    readonly headline: string;
    readonly body: string;
    readonly advice: string;
  }[];
  readonly finalAdvice: readonly {
    readonly label: MajorFortuneDomainLabel;
    readonly body: string;
  }[];
  readonly safetyNotes: readonly string[];
}

export const majorFortuneDomainLabels = [
  "일·성과",
  "돈·현실",
  "인간관계",
  "연애·가족",
  "학업·자격증",
  "몸·생활 리듬",
] as const satisfies readonly MajorFortuneDomainLabel[];

const stringSchema = { type: "string" } as const;
const nullableStringSchema = { type: ["string", "null"] } as const;
const numberSchema = { type: "number" } as const;
const stringArraySchema = {
  type: "array",
  items: stringSchema,
} as const;

const domainLabelSchema = {
  type: "string",
  enum: majorFortuneDomainLabels,
} as const;

const userContextSummarySchema = {
  type: "object",
  additionalProperties: false,
  required: ["lifeStatusLabel", "fieldLabel", "translationNote"],
  properties: {
    lifeStatusLabel: stringSchema,
    fieldLabel: nullableStringSchema,
    translationNote: stringSchema,
  },
} as const;

const cycleSummarySchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "ganji",
    "displayTitle",
    "ageRangeLabel",
    "yearRangeLabel",
    "stemLabel",
    "branchLabel",
    "elementLabel",
    "tenGodLabel",
    "basisLabel",
  ],
  properties: {
    ganji: stringSchema,
    displayTitle: stringSchema,
    ageRangeLabel: stringSchema,
    yearRangeLabel: stringSchema,
    stemLabel: stringSchema,
    branchLabel: stringSchema,
    elementLabel: stringSchema,
    tenGodLabel: stringSchema,
    basisLabel: stringSchema,
  },
} as const;

const flowIndexSummarySchema = {
  type: "object",
  additionalProperties: false,
  required: ["flowIndex", "flowTypeLabel", "flowIndexCaution"],
  properties: {
    flowIndex: numberSchema,
    flowTypeLabel: stringSchema,
    flowIndexCaution: stringSchema,
  },
} as const;

const decadeCardSchema = {
  type: "object",
  additionalProperties: false,
  required: ["label", "index", "headline", "body"],
  properties: {
    label: domainLabelSchema,
    index: numberSchema,
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
      enum: ["opportunity", "difficulty", "mixed", "transition", "caution"],
    },
    title: stringSchema,
    body: stringSchema,
    evidenceLabel: stringSchema,
  },
} as const;

const majorStructureSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "ganjiExplanation",
    "tenGodExplanation",
    "elementEffectExplanation",
    "branchInteractionExplanation",
    "transitionExplanation",
  ],
  properties: {
    ganjiExplanation: stringSchema,
    tenGodExplanation: stringSchema,
    elementEffectExplanation: stringSchema,
    branchInteractionExplanation: stringSchema,
    transitionExplanation: stringSchema,
  },
} as const;

const cycleChapterSchema = {
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

const phaseTimelineSchema = {
  type: "object",
  additionalProperties: false,
  required: ["phase", "label", "headline", "body", "advice"],
  properties: {
    phase: {
      type: "string",
      enum: ["early", "middle", "late"],
    },
    label: stringSchema,
    headline: stringSchema,
    body: stringSchema,
    advice: stringSchema,
  },
} as const;

const strongYearSchema = {
  type: "object",
  additionalProperties: false,
  required: ["year", "ganji", "headline", "body", "advice"],
  properties: {
    year: numberSchema,
    ganji: stringSchema,
    headline: stringSchema,
    body: stringSchema,
    advice: stringSchema,
  },
} as const;

const finalAdviceSchema = {
  type: "object",
  additionalProperties: false,
  required: ["label", "body"],
  properties: {
    label: domainLabelSchema,
    body: stringSchema,
  },
} as const;

export const majorFortuneReportDraftJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "version",
    "productType",
    "productVersion",
    "personLabel",
    "openingTitle",
    "openingSummary",
    "coreLine",
    "userContextSummary",
    "cycleSummary",
    "flowIndexSummary",
    "decadeCards",
    "keySignals",
    "majorStructure",
    "cycleChapters",
    "phaseTimeline",
    "strongYears",
    "finalAdvice",
    "safetyNotes",
  ],
  properties: {
    version: { type: "string", enum: ["v1"] },
    productType: { type: "string", enum: ["major_fortune"] },
    productVersion: { type: "string", enum: ["v1"] },
    personLabel: stringSchema,
    openingTitle: stringSchema,
    openingSummary: stringSchema,
    coreLine: stringSchema,
    userContextSummary: userContextSummarySchema,
    cycleSummary: cycleSummarySchema,
    flowIndexSummary: flowIndexSummarySchema,
    decadeCards: {
      type: "array",
      items: decadeCardSchema,
    },
    keySignals: {
      type: "array",
      items: keySignalSchema,
    },
    majorStructure: majorStructureSchema,
    cycleChapters: {
      type: "array",
      items: cycleChapterSchema,
    },
    phaseTimeline: {
      type: "array",
      items: phaseTimelineSchema,
    },
    strongYears: {
      type: "array",
      items: strongYearSchema,
    },
    finalAdvice: {
      type: "array",
      items: finalAdviceSchema,
    },
    safetyNotes: stringArraySchema,
  },
} as const;

export function getMajorFortuneReportDraftSchemaTopLevelKeys(): readonly string[] {
  return Object.keys(majorFortuneReportDraftJsonSchema.properties);
}
