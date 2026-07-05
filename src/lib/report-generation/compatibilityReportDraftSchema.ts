import { COMPATIBILITY_REPORT_CHAPTER_IDS } from "./compatibilityReportDraftTypes";

const stringArraySchema = {
  type: "array",
  items: { type: "string" },
} as const;

const scoreSchema = {
  type: "number",
} as const;

const chapterSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "id",
    "title",
    "headline",
    "body",
    "directHitScenes",
    "practicalAdvice",
  ],
  properties: {
    id: {
      type: "string",
      enum: COMPATIBILITY_REPORT_CHAPTER_IDS,
    },
    title: { type: "string" },
    headline: { type: "string" },
    body: { type: "string" },
    directHitScenes: {
      type: "array",
      items: { type: "string" },
    },
    practicalAdvice: {
      type: "array",
      items: { type: "string" },
    },
  },
} as const;

const relationshipAnalysisSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "connectionSummary",
    "firstImpression",
    "stayingPower",
    "frictionPoints",
    "categoryReading",
    "aToBFatigue",
    "bToAFatigue",
    "communicationRecovery",
    "roleMoneyLifeRhythm",
    "categorySpecificAdvice",
    "timingCautions",
    "repairStrategy",
    "riskManagement",
  ],
  properties: {
    connectionSummary: { type: "string" },
    firstImpression: { type: "string" },
    stayingPower: { type: "string" },
    frictionPoints: stringArraySchema,
    categoryReading: { type: "string" },
    aToBFatigue: { type: "string" },
    bToAFatigue: { type: "string" },
    communicationRecovery: { type: "string" },
    roleMoneyLifeRhythm: { type: "string" },
    categorySpecificAdvice: stringArraySchema,
    timingCautions: stringArraySchema,
    repairStrategy: stringArraySchema,
    riskManagement: stringArraySchema,
  },
} as const;

export const compatibilityReportDraftJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "version",
    "productType",
    "productVersion",
    "relationshipType",
    "personALabel",
    "personBLabel",
    "openingTitle",
    "openingSummary",
    "coreLine",
    "scoreSummary",
    "chartComparison",
    "keyCompatibilityPoints",
    "relationshipAnalysis",
    "chapters",
    "finalAdvice",
    "safetyNotes",
  ],
  properties: {
    version: { type: "string", enum: ["compatibility_v1_draft"] },
    productType: { type: "string", enum: ["saju_mbti_compatibility"] },
    productVersion: { type: "string", enum: ["1.0"] },
    relationshipType: {
      type: "string",
      enum: [
        "love",
        "marriage",
        "parentChild",
        "coworker",
        "managerReport",
        "businessPartner",
        "friendship",
      ],
    },
    personALabel: { type: "string" },
    personBLabel: { type: "string" },
    openingTitle: { type: "string" },
    openingSummary: { type: "string" },
    coreLine: { type: "string" },
    scoreSummary: {
      type: "object",
      additionalProperties: false,
      required: ["totalScore", "scoreLabel", "scoreCaution", "breakdown"],
      properties: {
        totalScore: scoreSchema,
        scoreLabel: { type: "string" },
        scoreCaution: { type: "string" },
        breakdown: {
          type: "object",
          additionalProperties: false,
          required: [
            "attraction",
            "communication",
            "lifestyleRhythm",
            "conflictRecovery",
            "longTermStability",
            "growthComplement",
          ],
          properties: {
            attraction: scoreSchema,
            communication: scoreSchema,
            lifestyleRhythm: scoreSchema,
            conflictRecovery: scoreSchema,
            longTermStability: scoreSchema,
            growthComplement: scoreSchema,
          },
        },
      },
    },
    chartComparison: {
      type: "object",
      additionalProperties: false,
      required: ["personA", "personB"],
      properties: {
        personA: { type: "string" },
        personB: { type: "string" },
      },
    },
    keyCompatibilityPoints: {
      type: "object",
      additionalProperties: false,
      required: [
        "attractionPoints",
        "strengthPoints",
        "frictionPoints",
        "relationshipRules",
      ],
      properties: {
        attractionPoints: stringArraySchema,
        strengthPoints: stringArraySchema,
        frictionPoints: stringArraySchema,
        relationshipRules: stringArraySchema,
      },
    },
    relationshipAnalysis: relationshipAnalysisSchema,
    chapters: {
      type: "array",
      items: chapterSchema,
    },
    finalAdvice: {
      type: "array",
      items: { type: "string" },
    },
    safetyNotes: {
      type: "array",
      items: { type: "string" },
    },
  },
} as const;

export function getCompatibilityReportDraftSchemaTopLevelKeys(): readonly string[] {
  return Object.keys(compatibilityReportDraftJsonSchema.properties);
}
