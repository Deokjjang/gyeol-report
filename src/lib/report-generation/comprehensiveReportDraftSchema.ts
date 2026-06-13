import { COMPREHENSIVE_REPORT_SECTION_IDS } from "../report-knowledge/reportSectionSchema";
import { COMPREHENSIVE_REPORT_V2_CHAPTER_IDS } from "./comprehensiveReportDraftTypes";

const productTypeSchema = {
  type: "string",
  const: "saju_mbti_full",
} as const;

const safetyNotesSchema = {
  type: "array",
  items: {
    type: "string",
  },
} as const;

const stringArraySchema = {
  type: "array",
  items: {
    type: "string",
  },
} as const;

const optionalPillarSchema = {
  type: "string",
  minLength: 1,
  maxLength: 20,
} as const;

export const comprehensiveReportV1DraftJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "version",
    "productType",
    "tone",
    "openingTitle",
    "openingSummary",
    "coreLine",
    "sections",
    "finalAdvice",
    "safetyNotes",
  ],
  properties: {
    version: {
      type: "string",
      const: "comprehensive_v1_draft",
    },
    productType: productTypeSchema,
    tone: {
      type: "array",
      minItems: 1,
      items: {
        type: "string",
        enum: ["saju_first", "conversational", "direct", "warm", "cautionary"],
      },
    },
    openingTitle: {
      type: "string",
      minLength: 1,
      maxLength: 120,
    },
    openingSummary: {
      type: "string",
      minLength: 1,
      maxLength: 800,
    },
    coreLine: {
      type: "string",
      minLength: 1,
      maxLength: 240,
    },
    sections: {
      type: "array",
      minItems: COMPREHENSIVE_REPORT_SECTION_IDS.length,
      items: {
        type: "object",
        additionalProperties: false,
        required: [
          "sectionId",
          "titleKo",
          "oneLine",
          "body",
          "evidenceSummary",
          "sajuTermsUsed",
          "mbtiTermsUsed",
          "cautionLevel",
        ],
        properties: {
          sectionId: {
            type: "string",
            enum: COMPREHENSIVE_REPORT_SECTION_IDS,
          },
          titleKo: {
            type: "string",
            minLength: 1,
          },
          oneLine: {
            type: "string",
            minLength: 1,
            maxLength: 180,
          },
          body: {
            type: "string",
            minLength: 1,
            maxLength: 2400,
          },
          evidenceSummary: {
            type: "array",
            items: {
              type: "string",
            },
          },
          sajuTermsUsed: {
            type: "array",
            items: {
              type: "string",
            },
          },
          mbtiTermsUsed: {
            type: "array",
            items: {
              type: "string",
            },
          },
          cautionLevel: {
            type: "string",
            enum: ["low", "medium", "high"],
          },
        },
      },
    },
    finalAdvice: {
      type: "string",
      minLength: 1,
      maxLength: 1200,
    },
    safetyNotes: safetyNotesSchema,
  },
} as const;

export const comprehensiveReportV2DraftJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "version",
    "productType",
    "openingTitle",
    "openingSummary",
    "coreLine",
    "profileTable",
    "chapters",
    "finalAdvice",
    "safetyNotes",
  ],
  properties: {
    version: {
      type: "string",
      const: "comprehensive_v2_draft",
    },
    productType: productTypeSchema,
    openingTitle: {
      type: "string",
      minLength: 1,
      maxLength: 120,
    },
    openingSummary: {
      type: "string",
      minLength: 1,
      maxLength: 1000,
    },
    coreLine: {
      type: "string",
      minLength: 1,
      maxLength: 260,
    },
    profileTable: {
      type: "object",
      additionalProperties: false,
      required: [
        "fiveElementSummary",
        "excessiveElements",
        "missingElements",
        "tenGodSummary",
        "specialPatterns",
        "sinsal",
        "gwiin",
        "mbti",
      ],
      properties: {
        yearPillar: optionalPillarSchema,
        monthPillar: optionalPillarSchema,
        dayPillar: optionalPillarSchema,
        hourPillar: optionalPillarSchema,
        dayMaster: optionalPillarSchema,
        fiveElementSummary: stringArraySchema,
        excessiveElements: stringArraySchema,
        missingElements: stringArraySchema,
        tenGodSummary: stringArraySchema,
        specialPatterns: stringArraySchema,
        sinsal: stringArraySchema,
        gwiin: stringArraySchema,
        mbti: {
          type: "string",
          minLength: 1,
          maxLength: 16,
        },
      },
    },
    chapters: {
      type: "array",
      minItems: COMPREHENSIVE_REPORT_V2_CHAPTER_IDS.length,
      maxItems: COMPREHENSIVE_REPORT_V2_CHAPTER_IDS.length,
      items: {
        type: "object",
        additionalProperties: false,
        required: [
          "chapterId",
          "titleKo",
          "headline",
          "body",
          "keyPhrases",
          "sajuTermsUsed",
          "mbtiTermsUsed",
        ],
        properties: {
          chapterId: {
            type: "string",
            enum: COMPREHENSIVE_REPORT_V2_CHAPTER_IDS,
          },
          titleKo: {
            type: "string",
            minLength: 1,
            maxLength: 80,
          },
          headline: {
            type: "string",
            minLength: 1,
            maxLength: 220,
          },
          body: {
            type: "string",
            minLength: 1,
            maxLength: 5000,
          },
          keyPhrases: {
            type: "array",
            minItems: 1,
            maxItems: 8,
            items: {
              type: "string",
            },
          },
          sajuTermsUsed: {
            type: "array",
            items: {
              type: "string",
            },
          },
          mbtiTermsUsed: {
            type: "array",
            items: {
              type: "string",
            },
          },
        },
      },
    },
    finalAdvice: {
      type: "string",
      minLength: 1,
      maxLength: 1600,
    },
    safetyNotes: safetyNotesSchema,
  },
} as const;

export const openAIComprehensiveReportV2NarrativeDraftJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "version",
    "productType",
    "openingTitle",
    "openingSummary",
    "coreLine",
    "chapters",
    "finalAdvice",
    "safetyNotes",
  ],
  properties: {
    version: {
      type: "string",
      const: "comprehensive_v2_draft",
    },
    productType: productTypeSchema,
    openingTitle: {
      type: "string",
      minLength: 1,
      maxLength: 120,
    },
    openingSummary: {
      type: "string",
      minLength: 1,
      maxLength: 1000,
    },
    coreLine: {
      type: "string",
      minLength: 1,
      maxLength: 260,
    },
    chapters: comprehensiveReportV2DraftJsonSchema.properties.chapters,
    finalAdvice: {
      type: "string",
      minLength: 1,
      maxLength: 1600,
    },
    safetyNotes: safetyNotesSchema,
  },
} as const;

export const comprehensiveReportDraftJsonSchema =
  openAIComprehensiveReportV2NarrativeDraftJsonSchema;
