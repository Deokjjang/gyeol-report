import { COMPREHENSIVE_REPORT_SECTION_IDS } from "../report-knowledge/reportSectionSchema";

export const comprehensiveReportDraftJsonSchema = {
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
    productType: {
      type: "string",
      const: "saju_mbti_full",
    },
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
    safetyNotes: {
      type: "array",
      items: {
        type: "string",
      },
    },
  },
} as const;
