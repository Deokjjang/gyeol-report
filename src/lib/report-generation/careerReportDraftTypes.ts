export type CareerActionPlanLabel =
  | "직업"
  | "커리어"
  | "돈"
  | "투자·저축"
  | "학업·자격증"
  | "포트폴리오";

export const careerActionPlanLabels = [
  "직업",
  "커리어",
  "돈",
  "투자·저축",
  "학업·자격증",
  "포트폴리오",
] as const satisfies readonly CareerActionPlanLabel[];

export interface CareerReportDraft {
  readonly version: "v1";
  readonly productType: "career_money_study";
  readonly productVersion: "v1";
  readonly personLabel: string;
  readonly openingTitle: string;
  readonly openingSummary: string;
  readonly coreLine: string;
  readonly userContextSummary: {
    readonly lifeStatusLabel: string;
    readonly fieldLabel: string | null;
    readonly relationshipStatusLabel: string | null;
    readonly contextNote: string;
  };
  readonly careerIdentity: {
    readonly headline: string;
    readonly archetypeLabel: string;
    readonly body: string;
    readonly strongestFit: string;
    readonly biggestRisk: string;
  };
  readonly myeongliMbtiSummary: {
    readonly myeongliCore: string;
    readonly mbtiCore: string;
    readonly combinedReading: string;
    readonly alignment: "aligned" | "mixed" | "tension" | "unknown";
    readonly tensionNote: string | null;
  };
  readonly recommendedJobs: readonly {
    readonly title: string;
    readonly fit: "high" | "medium" | "low";
    readonly tagline: string;
    readonly reason: string;
    readonly caution: string;
    readonly exampleFields: readonly string[];
  }[];
  readonly unsuitableJobs: readonly {
    readonly title: string;
    readonly reason: string;
    readonly warning: string;
  }[];
  readonly careerPaths: readonly {
    readonly label: string;
    readonly fit: "high" | "medium" | "low";
    readonly headline: string;
    readonly body: string;
    readonly push: readonly string[];
    readonly avoid: readonly string[];
  }[];
  readonly moneyEarningStyle: {
    readonly headline: string;
    readonly body: string;
    readonly bestIncomeChannels: readonly string[];
    readonly riskyIncomeChannels: readonly string[];
    readonly sideIncomeIdeas: readonly string[];
  };
  readonly investmentAndSavingStyle: {
    readonly headline: string;
    readonly body: string;
    readonly suitablePatterns: readonly string[];
    readonly cautionPatterns: readonly string[];
    readonly forbiddenNote: string;
  };
  readonly careerTiming: readonly {
    readonly year: number;
    readonly label: string;
    readonly headline: string;
    readonly body: string;
    readonly push: readonly string[];
    readonly avoid: readonly string[];
  }[];
  readonly studyCertificatePlan: {
    readonly headline: string;
    readonly body: string;
    readonly recommendedCertificates: readonly string[];
    readonly recommendedStudyMethods: readonly string[];
    readonly portfolioStrategy: readonly string[];
    readonly avoidStudyPatterns: readonly string[];
  };
  readonly actionPlan: readonly {
    readonly label: CareerActionPlanLabel;
    readonly headline: string;
    readonly body: string;
    readonly firstAction: string;
  }[];
  readonly riskWarnings: readonly {
    readonly title: string;
    readonly body: string;
    readonly prevention: string;
  }[];
  readonly safetyNotes: readonly string[];
}

const stringSchema = { type: "string" } as const;
const numberSchema = { type: "number" } as const;
const nullableStringSchema = { type: ["string", "null"] } as const;
const stringArraySchema = {
  type: "array",
  items: stringSchema,
} as const;

const fitSchema = {
  type: "string",
  enum: ["high", "medium", "low"],
} as const;

const userContextSummarySchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "lifeStatusLabel",
    "fieldLabel",
    "relationshipStatusLabel",
    "contextNote",
  ],
  properties: {
    lifeStatusLabel: stringSchema,
    fieldLabel: nullableStringSchema,
    relationshipStatusLabel: nullableStringSchema,
    contextNote: stringSchema,
  },
} as const;

const careerIdentitySchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "headline",
    "archetypeLabel",
    "body",
    "strongestFit",
    "biggestRisk",
  ],
  properties: {
    headline: stringSchema,
    archetypeLabel: stringSchema,
    body: stringSchema,
    strongestFit: stringSchema,
    biggestRisk: stringSchema,
  },
} as const;

const myeongliMbtiSummarySchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "myeongliCore",
    "mbtiCore",
    "combinedReading",
    "alignment",
    "tensionNote",
  ],
  properties: {
    myeongliCore: stringSchema,
    mbtiCore: stringSchema,
    combinedReading: stringSchema,
    alignment: {
      type: "string",
      enum: ["aligned", "mixed", "tension", "unknown"],
    },
    tensionNote: nullableStringSchema,
  },
} as const;

const recommendedJobSchema = {
  type: "object",
  additionalProperties: false,
  required: ["title", "fit", "tagline", "reason", "caution", "exampleFields"],
  properties: {
    title: stringSchema,
    fit: fitSchema,
    tagline: stringSchema,
    reason: stringSchema,
    caution: stringSchema,
    exampleFields: stringArraySchema,
  },
} as const;

const unsuitableJobSchema = {
  type: "object",
  additionalProperties: false,
  required: ["title", "reason", "warning"],
  properties: {
    title: stringSchema,
    reason: stringSchema,
    warning: stringSchema,
  },
} as const;

const careerPathSchema = {
  type: "object",
  additionalProperties: false,
  required: ["label", "fit", "headline", "body", "push", "avoid"],
  properties: {
    label: stringSchema,
    fit: fitSchema,
    headline: stringSchema,
    body: stringSchema,
    push: stringArraySchema,
    avoid: stringArraySchema,
  },
} as const;

const moneyEarningStyleSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "headline",
    "body",
    "bestIncomeChannels",
    "riskyIncomeChannels",
    "sideIncomeIdeas",
  ],
  properties: {
    headline: stringSchema,
    body: stringSchema,
    bestIncomeChannels: stringArraySchema,
    riskyIncomeChannels: stringArraySchema,
    sideIncomeIdeas: stringArraySchema,
  },
} as const;

const investmentAndSavingStyleSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "headline",
    "body",
    "suitablePatterns",
    "cautionPatterns",
    "forbiddenNote",
  ],
  properties: {
    headline: stringSchema,
    body: stringSchema,
    suitablePatterns: stringArraySchema,
    cautionPatterns: stringArraySchema,
    forbiddenNote: stringSchema,
  },
} as const;

const careerTimingSchema = {
  type: "object",
  additionalProperties: false,
  required: ["year", "label", "headline", "body", "push", "avoid"],
  properties: {
    year: numberSchema,
    label: stringSchema,
    headline: stringSchema,
    body: stringSchema,
    push: stringArraySchema,
    avoid: stringArraySchema,
  },
} as const;

const studyCertificatePlanSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "headline",
    "body",
    "recommendedCertificates",
    "recommendedStudyMethods",
    "portfolioStrategy",
    "avoidStudyPatterns",
  ],
  properties: {
    headline: stringSchema,
    body: stringSchema,
    recommendedCertificates: stringArraySchema,
    recommendedStudyMethods: stringArraySchema,
    portfolioStrategy: stringArraySchema,
    avoidStudyPatterns: stringArraySchema,
  },
} as const;

const actionPlanSchema = {
  type: "object",
  additionalProperties: false,
  required: ["label", "headline", "body", "firstAction"],
  properties: {
    label: {
      type: "string",
      enum: careerActionPlanLabels,
    },
    headline: stringSchema,
    body: stringSchema,
    firstAction: stringSchema,
  },
} as const;

const riskWarningSchema = {
  type: "object",
  additionalProperties: false,
  required: ["title", "body", "prevention"],
  properties: {
    title: stringSchema,
    body: stringSchema,
    prevention: stringSchema,
  },
} as const;

export const careerReportDraftJsonSchema = {
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
    "careerIdentity",
    "myeongliMbtiSummary",
    "recommendedJobs",
    "unsuitableJobs",
    "careerPaths",
    "moneyEarningStyle",
    "investmentAndSavingStyle",
    "careerTiming",
    "studyCertificatePlan",
    "actionPlan",
    "riskWarnings",
    "safetyNotes",
  ],
  properties: {
    version: { type: "string", enum: ["v1"] },
    productType: { type: "string", enum: ["career_money_study"] },
    productVersion: { type: "string", enum: ["v1"] },
    personLabel: stringSchema,
    openingTitle: stringSchema,
    openingSummary: stringSchema,
    coreLine: stringSchema,
    userContextSummary: userContextSummarySchema,
    careerIdentity: careerIdentitySchema,
    myeongliMbtiSummary: myeongliMbtiSummarySchema,
    recommendedJobs: {
      type: "array",
      items: recommendedJobSchema,
    },
    unsuitableJobs: {
      type: "array",
      items: unsuitableJobSchema,
    },
    careerPaths: {
      type: "array",
      items: careerPathSchema,
    },
    moneyEarningStyle: moneyEarningStyleSchema,
    investmentAndSavingStyle: investmentAndSavingStyleSchema,
    careerTiming: {
      type: "array",
      items: careerTimingSchema,
    },
    studyCertificatePlan: studyCertificatePlanSchema,
    actionPlan: {
      type: "array",
      items: actionPlanSchema,
    },
    riskWarnings: {
      type: "array",
      items: riskWarningSchema,
    },
    safetyNotes: stringArraySchema,
  },
} as const;

export function getCareerReportDraftSchemaTopLevelKeys(): readonly string[] {
  return Object.keys(careerReportDraftJsonSchema.properties);
}
