import { COMPATIBILITY_REPORT_CHAPTER_IDS } from "./compatibilityReportDraftTypes";

const stringArraySchema = {
  type: "array",
  items: { type: "string", minLength: 1 },
} as const;

const scoreSchema = {
  type: "integer",
  minimum: 35,
  maximum: 95,
} as const;

const chartSummarySchema = {
  type: "object",
  additionalProperties: true,
  required: [
    "role",
    "displayName",
    "birthTimeConfidence",
    "pillars",
    "dayMaster",
    "dayPillar",
    "featureIds",
    "featureLabels",
    "diagnosticFeatureLabels",
  ],
  properties: {
    role: { type: "string", enum: ["personA", "personB"] },
    displayName: { type: "string", minLength: 1 },
    mbti: { type: "string" },
    birthTimeConfidence: { type: "string", enum: ["known", "unknown"] },
    pillars: {
      type: "object",
      additionalProperties: false,
      required: ["year", "month", "day"],
      properties: {
        year: { type: "string", minLength: 1 },
        month: { type: "string", minLength: 1 },
        day: { type: "string", minLength: 1 },
        hour: { type: "string" },
      },
    },
    dayMaster: { type: "string", minLength: 1 },
    dayPillar: { type: "string", minLength: 1 },
    featureIds: stringArraySchema,
    featureLabels: stringArraySchema,
    diagnosticFeatureLabels: stringArraySchema,
  },
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
    title: { type: "string", minLength: 1 },
    headline: { type: "string", minLength: 1 },
    body: { type: "string", minLength: 1 },
    directHitScenes: {
      type: "array",
      minItems: 1,
      items: { type: "string", minLength: 1 },
    },
    practicalAdvice: {
      type: "array",
      items: { type: "string", minLength: 1 },
    },
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
    "chapters",
    "finalAdvice",
    "safetyNotes",
  ],
  properties: {
    version: { type: "string", const: "compatibility_v1_draft" },
    productType: { type: "string", const: "saju_mbti_compatibility" },
    productVersion: { type: "string", const: "1.0" },
    relationshipType: {
      type: "string",
      enum: ["love", "some", "marriage", "friendship"],
    },
    personALabel: { type: "string", minLength: 1 },
    personBLabel: { type: "string", minLength: 1 },
    openingTitle: { type: "string", minLength: 1 },
    openingSummary: { type: "string", minLength: 1 },
    coreLine: { type: "string", minLength: 1 },
    scoreSummary: {
      type: "object",
      additionalProperties: false,
      required: ["totalScore", "scoreLabel", "scoreCaution", "breakdown"],
      properties: {
        totalScore: scoreSchema,
        scoreLabel: { type: "string", minLength: 1 },
        scoreCaution: { type: "string", minLength: 1 },
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
        personA: chartSummarySchema,
        personB: chartSummarySchema,
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
    chapters: {
      type: "array",
      minItems: 8,
      items: chapterSchema,
    },
    finalAdvice: {
      type: "array",
      minItems: 3,
      items: { type: "string", minLength: 1 },
    },
    safetyNotes: {
      type: "array",
      minItems: 1,
      items: { type: "string", minLength: 1 },
    },
  },
} as const;

export function getCompatibilityReportDraftSchemaTopLevelKeys(): readonly string[] {
  return Object.keys(compatibilityReportDraftJsonSchema.properties);
}
