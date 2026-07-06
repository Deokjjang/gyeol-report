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

export interface MajorFortuneDraftFlowSection {
  readonly title: string;
  readonly summary: string;
  readonly supportingSignals: readonly string[];
  readonly frictionSignals: readonly string[];
  readonly actionHint: string;
}

export interface MajorFortuneReportDraft {
  readonly version: "v1";
  readonly productType: "major_fortune";
  readonly productVersion: "v1";
  readonly personLabel: string;
  readonly headline?: string;
  readonly openingTitle: string;
  readonly openingSummary: string;
  readonly coreLine: string;
  readonly userContextSummary: {
    readonly lifeStatusLabel: string;
    readonly fieldLabel: string | null;
    readonly relationshipStatusLabel: string | null;
    readonly translationNote: string;
  };
  readonly cycleSummary: {
    readonly ganji: string;
    readonly displayTitle: string;
    readonly cycleIndexLabel: string;
    readonly currentPositionLabel: string;
    readonly ageRangeLabel: string;
    readonly yearRangeLabel: string;
    readonly stemLabel: string;
    readonly branchLabel: string;
    readonly elementLabel: string;
    readonly tenGodLabel: string;
    readonly basisLabel: string;
  };
  readonly calculationBasis: {
    readonly basisType:
      | "manse_engine_major_fortune_table"
      | "user_supplied_major_fortune_table"
      | "fixture_precomputed_for_dev_only";
    readonly displayLabel: string;
    readonly explanation: string;
    readonly ageBasisLabel: string;
    readonly note: string;
  };
  readonly previousToCurrentShift: {
    readonly previousGanji: string | null;
    readonly currentGanji: string;
    readonly plain: string;
    readonly whatChanged: readonly string[];
  };
  readonly decadeArchetype: {
    readonly label: string;
    readonly metaphor: string;
    readonly plain: string;
  };
  readonly flowIndexSummary: {
    readonly flowIndex: number;
    readonly flowTypeLabel: string;
    readonly flowIndexCaution: string;
  };
  readonly bigThemes: readonly {
    readonly title: string;
    readonly metaphor: string;
    readonly body: string;
    readonly likelyScenes: readonly string[];
    readonly strategy: string;
  }[];
  readonly myeongliLayers: {
    readonly tenGodLayer: {
      readonly majorStemTenGod: string;
      readonly annualStemTenGodsInCycle: readonly {
        readonly year: number;
        readonly stem: string;
        readonly tenGod: string;
        readonly plain: string;
      }[];
      readonly plain: string;
    };
    readonly elementLayer: {
      readonly majorElements: readonly string[];
      readonly fillMissing: readonly string[];
      readonly overloadHeavy: readonly string[];
      readonly plain: string;
    };
    readonly branchInteractionLayer: {
      readonly interactions: readonly {
        readonly year: number | null;
        readonly type:
          | "충"
          | "육합"
          | "삼합"
          | "반합"
          | "형"
          | "파"
          | "해"
          | "원진"
          | "귀문";
        readonly plainType: string;
        readonly plain: string;
        readonly impactArea:
          | "work"
          | "money"
          | "relationship"
          | "love_family"
          | "study"
          | "health"
          | "identity";
      }[];
      readonly plain: string;
    };
    readonly hiddenStemLayer: {
      readonly majorBranchHiddenStems: readonly string[];
      readonly plain: string;
    };
    readonly twelveStageLayer: {
      readonly label: string;
      readonly plain: string;
    } | null;
    readonly auxiliaryStarsLayer: readonly {
      readonly label: string;
      readonly plain: string;
      readonly caution: string | null;
    }[];
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
    readonly whyStrong: string;
    readonly likelyArea:
      | "일·성과"
      | "돈·외부기회"
      | "돈·현실관리"
      | "관계"
      | "연애·가족"
      | "몸·생활"
      | "학업·자격증"
      | "전환";
    readonly pushStrategy: string;
    readonly reduceStrategy: string;
  }[];
  readonly majorFortuneTimelineRows: readonly {
    readonly year: number;
    readonly ageLabel: string | null;
    readonly ageBasisLabel: string | null;
    readonly yearIndexInCycle: number;
    readonly phase: MajorFortunePhase;
    readonly isCurrentYear: boolean;
    readonly isCycleStartYear: boolean;
    readonly isCycleEndYear: boolean;
    readonly badges: readonly ("올해" | "전환" | "강함" | "주의" | "정리")[];
    readonly majorGanji: string;
    readonly annualGanji: string;
    readonly annualTenGodLabel: string;
    readonly keyInteractionLabel: string | null;
    readonly oneLine: string;
    readonly strategy: string;
  }[];
  readonly cycleYearTimeline: readonly {
    readonly year: number;
    readonly ganji: string;
    readonly yearIndexInCycle: number;
    readonly phase: MajorFortunePhase;
    readonly headline: string;
    readonly roleOfYearInCycle: string;
    readonly plainInterpretation: string;
    readonly strategicFocus: string;
    readonly whyItMatters: string;
  }[];
  readonly currentCycleSummary?: string;
  readonly tenYearTheme?: string;
  readonly timelineReading?: string;
  readonly annualCrossReading?: string;
  readonly careerWorkFlow?: MajorFortuneDraftFlowSection;
  readonly moneyResourceFlow?: MajorFortuneDraftFlowSection;
  readonly relationshipFlow?: MajorFortuneDraftFlowSection;
  readonly healthRoutineFlow?: MajorFortuneDraftFlowSection;
  readonly mbtiExpression?: string;
  readonly riskManagement?: readonly string[];
  readonly actionPlan?: readonly string[];
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
const nullableNumberSchema = { type: ["number", "null"] } as const;
const numberSchema = { type: "number" } as const;
const booleanSchema = { type: "boolean" } as const;
const stringArraySchema = {
  type: "array",
  items: stringSchema,
} as const;

const launchFlowSectionSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "title",
    "summary",
    "supportingSignals",
    "frictionSignals",
    "actionHint",
  ],
  properties: {
    title: stringSchema,
    summary: stringSchema,
    supportingSignals: stringArraySchema,
    frictionSignals: stringArraySchema,
    actionHint: stringSchema,
  },
} as const;

const domainLabelSchema = {
  type: "string",
  enum: majorFortuneDomainLabels,
} as const;

const userContextSummarySchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "lifeStatusLabel",
    "fieldLabel",
    "relationshipStatusLabel",
    "translationNote",
  ],
  properties: {
    lifeStatusLabel: stringSchema,
    fieldLabel: nullableStringSchema,
    relationshipStatusLabel: nullableStringSchema,
    translationNote: stringSchema,
  },
} as const;

const cycleSummarySchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "ganji",
    "displayTitle",
    "cycleIndexLabel",
    "currentPositionLabel",
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
    cycleIndexLabel: stringSchema,
    currentPositionLabel: stringSchema,
    ageRangeLabel: stringSchema,
    yearRangeLabel: stringSchema,
    stemLabel: stringSchema,
    branchLabel: stringSchema,
    elementLabel: stringSchema,
    tenGodLabel: stringSchema,
    basisLabel: stringSchema,
  },
} as const;

const calculationBasisSchema = {
  type: "object",
  additionalProperties: false,
  required: ["basisType", "displayLabel", "explanation", "ageBasisLabel", "note"],
  properties: {
    basisType: {
      type: "string",
      enum: [
        "manse_engine_major_fortune_table",
        "user_supplied_major_fortune_table",
        "fixture_precomputed_for_dev_only",
      ],
    },
    displayLabel: stringSchema,
    explanation: stringSchema,
    ageBasisLabel: stringSchema,
    note: stringSchema,
  },
} as const;

const previousToCurrentShiftSchema = {
  type: "object",
  additionalProperties: false,
  required: ["previousGanji", "currentGanji", "plain", "whatChanged"],
  properties: {
    previousGanji: nullableStringSchema,
    currentGanji: stringSchema,
    plain: stringSchema,
    whatChanged: stringArraySchema,
  },
} as const;

const decadeArchetypeSchema = {
  type: "object",
  additionalProperties: false,
  required: ["label", "metaphor", "plain"],
  properties: {
    label: stringSchema,
    metaphor: stringSchema,
    plain: stringSchema,
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

const bigThemeSchema = {
  type: "object",
  additionalProperties: false,
  required: ["title", "metaphor", "body", "likelyScenes", "strategy"],
  properties: {
    title: stringSchema,
    metaphor: stringSchema,
    body: stringSchema,
    likelyScenes: stringArraySchema,
    strategy: stringSchema,
  },
} as const;

const timelineBadgeSchema = {
  type: "string",
  enum: ["올해", "전환", "강함", "주의", "정리"],
} as const;

const timelineBadgesSchema = {
  type: "array",
  items: timelineBadgeSchema,
} as const;

const majorTimelineRowSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "year",
    "ageLabel",
    "ageBasisLabel",
    "yearIndexInCycle",
    "phase",
    "isCurrentYear",
    "isCycleStartYear",
    "isCycleEndYear",
    "badges",
    "majorGanji",
    "annualGanji",
    "annualTenGodLabel",
    "keyInteractionLabel",
    "oneLine",
    "strategy",
  ],
  properties: {
    year: numberSchema,
    ageLabel: nullableStringSchema,
    ageBasisLabel: nullableStringSchema,
    yearIndexInCycle: numberSchema,
    phase: {
      type: "string",
      enum: ["early", "middle", "late"],
    },
    isCurrentYear: booleanSchema,
    isCycleStartYear: booleanSchema,
    isCycleEndYear: booleanSchema,
    badges: timelineBadgesSchema,
    majorGanji: stringSchema,
    annualGanji: stringSchema,
    annualTenGodLabel: stringSchema,
    keyInteractionLabel: nullableStringSchema,
    oneLine: stringSchema,
    strategy: stringSchema,
  },
} as const;

const annualStemTenGodSchema = {
  type: "object",
  additionalProperties: false,
  required: ["year", "stem", "tenGod", "plain"],
  properties: {
    year: numberSchema,
    stem: stringSchema,
    tenGod: stringSchema,
    plain: stringSchema,
  },
} as const;

const myeongliBranchInteractionSchema = {
  type: "object",
  additionalProperties: false,
  required: ["year", "type", "plainType", "plain", "impactArea"],
  properties: {
    year: nullableNumberSchema,
    type: {
      type: "string",
      enum: ["충", "육합", "삼합", "반합", "형", "파", "해", "원진", "귀문"],
    },
    plainType: stringSchema,
    plain: stringSchema,
    impactArea: {
      type: "string",
      enum: [
        "work",
        "money",
        "relationship",
        "love_family",
        "study",
        "health",
        "identity",
      ],
    },
  },
} as const;

const auxiliaryStarSchema = {
  type: "object",
  additionalProperties: false,
  required: ["label", "plain", "caution"],
  properties: {
    label: stringSchema,
    plain: stringSchema,
    caution: nullableStringSchema,
  },
} as const;

const twelveStageLayerSchema = {
  type: ["object", "null"],
  additionalProperties: false,
  required: ["label", "plain"],
  properties: {
    label: stringSchema,
    plain: stringSchema,
  },
} as const;

const myeongliLayersSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "tenGodLayer",
    "elementLayer",
    "branchInteractionLayer",
    "hiddenStemLayer",
    "twelveStageLayer",
    "auxiliaryStarsLayer",
  ],
  properties: {
    tenGodLayer: {
      type: "object",
      additionalProperties: false,
      required: ["majorStemTenGod", "annualStemTenGodsInCycle", "plain"],
      properties: {
        majorStemTenGod: stringSchema,
        annualStemTenGodsInCycle: {
          type: "array",
          items: annualStemTenGodSchema,
        },
        plain: stringSchema,
      },
    },
    elementLayer: {
      type: "object",
      additionalProperties: false,
      required: ["majorElements", "fillMissing", "overloadHeavy", "plain"],
      properties: {
        majorElements: stringArraySchema,
        fillMissing: stringArraySchema,
        overloadHeavy: stringArraySchema,
        plain: stringSchema,
      },
    },
    branchInteractionLayer: {
      type: "object",
      additionalProperties: false,
      required: ["interactions", "plain"],
      properties: {
        interactions: {
          type: "array",
          items: myeongliBranchInteractionSchema,
        },
        plain: stringSchema,
      },
    },
    hiddenStemLayer: {
      type: "object",
      additionalProperties: false,
      required: ["majorBranchHiddenStems", "plain"],
      properties: {
        majorBranchHiddenStems: stringArraySchema,
        plain: stringSchema,
      },
    },
    twelveStageLayer: twelveStageLayerSchema,
    auxiliaryStarsLayer: {
      type: "array",
      items: auxiliaryStarSchema,
    },
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
  required: [
    "year",
    "ganji",
    "headline",
    "body",
    "advice",
    "whyStrong",
    "likelyArea",
    "pushStrategy",
    "reduceStrategy",
  ],
  properties: {
    year: numberSchema,
    ganji: stringSchema,
    headline: stringSchema,
    body: stringSchema,
    advice: stringSchema,
    whyStrong: stringSchema,
    likelyArea: {
      type: "string",
      enum: [
        "일·성과",
        "돈·외부기회",
        "돈·현실관리",
        "관계",
        "연애·가족",
        "몸·생활",
        "학업·자격증",
        "전환",
      ],
    },
    pushStrategy: stringSchema,
    reduceStrategy: stringSchema,
  },
} as const;

const cycleYearTimelineSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "year",
    "ganji",
    "yearIndexInCycle",
    "phase",
    "headline",
    "roleOfYearInCycle",
    "plainInterpretation",
    "strategicFocus",
    "whyItMatters",
  ],
  properties: {
    year: numberSchema,
    ganji: stringSchema,
    yearIndexInCycle: numberSchema,
    phase: {
      type: "string",
      enum: ["early", "middle", "late"],
    },
    headline: stringSchema,
    roleOfYearInCycle: stringSchema,
    plainInterpretation: stringSchema,
    strategicFocus: stringSchema,
    whyItMatters: stringSchema,
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
    "headline",
    "openingTitle",
    "openingSummary",
    "coreLine",
    "userContextSummary",
    "cycleSummary",
    "calculationBasis",
    "previousToCurrentShift",
    "decadeArchetype",
    "flowIndexSummary",
    "bigThemes",
    "myeongliLayers",
    "decadeCards",
    "keySignals",
    "majorStructure",
    "cycleChapters",
    "phaseTimeline",
    "strongYears",
    "majorFortuneTimelineRows",
    "cycleYearTimeline",
    "currentCycleSummary",
    "tenYearTheme",
    "timelineReading",
    "annualCrossReading",
    "careerWorkFlow",
    "moneyResourceFlow",
    "relationshipFlow",
    "healthRoutineFlow",
    "mbtiExpression",
    "riskManagement",
    "actionPlan",
    "finalAdvice",
    "safetyNotes",
  ],
  properties: {
    version: { type: "string", enum: ["v1"] },
    productType: { type: "string", enum: ["major_fortune"] },
    productVersion: { type: "string", enum: ["v1"] },
    personLabel: stringSchema,
    headline: stringSchema,
    openingTitle: stringSchema,
    openingSummary: stringSchema,
    coreLine: stringSchema,
    userContextSummary: userContextSummarySchema,
    cycleSummary: cycleSummarySchema,
    calculationBasis: calculationBasisSchema,
    previousToCurrentShift: previousToCurrentShiftSchema,
    decadeArchetype: decadeArchetypeSchema,
    flowIndexSummary: flowIndexSummarySchema,
    bigThemes: {
      type: "array",
      items: bigThemeSchema,
    },
    myeongliLayers: myeongliLayersSchema,
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
    majorFortuneTimelineRows: {
      type: "array",
      items: majorTimelineRowSchema,
    },
    cycleYearTimeline: {
      type: "array",
      items: cycleYearTimelineSchema,
    },
    currentCycleSummary: stringSchema,
    tenYearTheme: stringSchema,
    timelineReading: stringSchema,
    annualCrossReading: stringSchema,
    careerWorkFlow: launchFlowSectionSchema,
    moneyResourceFlow: launchFlowSectionSchema,
    relationshipFlow: launchFlowSectionSchema,
    healthRoutineFlow: launchFlowSectionSchema,
    mbtiExpression: stringSchema,
    riskManagement: stringArraySchema,
    actionPlan: stringArraySchema,
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
