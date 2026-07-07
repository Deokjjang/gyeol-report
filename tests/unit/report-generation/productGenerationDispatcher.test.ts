import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import {
  createProductGenerationDispatcherOptionsFromWriterRuntime,
  getProductGenerationHandler,
  prepareProductGenerationFromPayload,
} from "../../../src/lib/report-generation/productGenerationDispatcher";
import type {
  CompatibilityReportInputPayload,
  ReportProductKind,
  SinglePersonReportInputPayload,
} from "../../../src/lib/report-generation/reportInputAdapter";

const sourcePath = join(
  process.cwd(),
  "src/lib/report-generation/productGenerationDispatcher.ts",
);
const source = readFileSync(sourcePath, "utf8");

const basePerson = {
  name: "김도윤",
  birthDate: "1990-03-14",
  birthTime: "",
  birthTimeUnknown: true,
  approximateBirthTimeSlot: "",
  gender: "MALE",
  mbtiType: "ENTJ",
} as const;

const baseUserContext = {
  relationshipStatus: "single",
  jobStatus: "employee",
  detailJob: "서비스 기획자",
  focusAreas: ["직업", "돈"],
} as const;

const productKinds: readonly ReportProductKind[] = [
  "careerMoneyStudy",
  "loveMarriageChild",
  "compatibility",
  "majorFortune",
  "annualFortune",
  "comprehensiveV2",
];

function makeSinglePayload(
  override: Partial<SinglePersonReportInputPayload> = {},
): SinglePersonReportInputPayload {
  return {
    productKey: "career_money_study",
    productSlug: "career-money-study",
    person: basePerson,
    userContext: baseUserContext,
    productOptions: {},
    ...override,
  };
}

function makeCompatibilityPayload(
  override: Partial<CompatibilityReportInputPayload> = {},
): CompatibilityReportInputPayload {
  return {
    productKey: "saju_mbti_compatibility",
    productSlug: "compatibility",
    relationshipType: "love",
    personA: {
      ...basePerson,
      name: "A",
    },
    personB: {
      ...basePerson,
      name: "B",
      mbtiType: "INTP",
    },
    ...override,
  };
}

describe("product generation dispatcher", () => {
  it("has a handler for every product kind", () => {
    for (const kind of productKinds) {
      expect(typeof getProductGenerationHandler(kind)).toBe("function");
    }
  });

  it("does not leave configured product handlers disconnected", () => {
    expect(source).not.toContain("createNotImplementedHandler");
    expect(productKinds).toEqual([
      "careerMoneyStudy",
      "loveMarriageChild",
      "compatibility",
      "majorFortune",
      "annualFortune",
      "comprehensiveV2",
    ]);
  });

  it("maps adapter invalid results to INVALID_REPORT_INPUT", async () => {
    const result = await prepareProductGenerationFromPayload({
      ...makeSinglePayload(),
      productKey: "unknown",
    });

    expect(result).toEqual({
      ok: false,
      error: {
        code: "INVALID_REPORT_INPUT",
        message: "Invalid report input: UNKNOWN_PRODUCT_KEY",
      },
    });
  });

  it("routes valid career money study payloads to generated draft output", async () => {
    const result = await prepareProductGenerationFromPayload(makeSinglePayload());

    expect(result).toMatchObject({
      ok: true,
      kind: "careerMoneyStudy",
      draft: {
        version: "v1",
        productType: "career_money_study",
        productVersion: "v1",
        personLabel: "김도윤",
      },
      evidencePacket: {
        productType: "career_money_study",
        productVersion: "v1",
        personLabel: "김도윤",
        userContext: {
          lifeStatus: "employee",
          fieldLabel: "서비스 기획자",
          relationshipStatus: "single",
        },
      },
    });
  });

  it("routes valid love marriage child payloads to generated draft output", async () => {
    const result = await prepareProductGenerationFromPayload(
      makeSinglePayload({
        productKey: "love_marriage_child",
        productSlug: "love-marriage-child",
      }),
    );

    expect(result).toMatchObject({
      ok: true,
      kind: "loveMarriageChild",
      draft: {
        version: "v1",
        productType: "love_marriage_child",
        productVersion: "v1",
      },
      evidencePacket: {
        productType: "love_marriage_child",
        productVersion: "v1",
        personContext: {
          relationshipStatus: "single",
        },
      },
    });
  });

  it("routes valid major fortune payloads to generated draft output", async () => {
    const result = await prepareProductGenerationFromPayload(
      makeSinglePayload({
        productKey: "major_fortune",
        productSlug: "major-fortune",
      }),
    );

    expect(result).toMatchObject({
      ok: true,
      kind: "majorFortune",
      draft: {
        version: "v1",
        productType: "major_fortune",
        productVersion: "v1",
        personLabel: "김도윤",
      },
      evidencePacket: {
        productType: "major_fortune",
        productVersion: "v1",
        personLabel: "김도윤",
        userContext: {
          lifeStatus: "employee",
          fieldLabel: "서비스 기획자",
          relationshipStatus: "single",
        },
      },
    });
  });

  it("routes valid annual fortune payloads to generated draft output", async () => {
    const result = await prepareProductGenerationFromPayload(
      makeSinglePayload({
        productKey: "annual_fortune",
        productSlug: "annual-fortune",
        productOptions: {
          selectedYear: "2026",
        },
      }),
    );

    expect(result).toMatchObject({
      ok: true,
      kind: "annualFortune",
      draft: {
        version: "v1",
        productType: "annual_fortune",
        productVersion: "v1",
        targetYear: 2026,
        personLabel: "김도윤",
      },
      evidencePacket: {
        productType: "annual_fortune",
        productVersion: "v1",
        selectedYear: 2026,
        personContext: {
          name: "김도윤",
          userContext: {
            lifeStatus: "employee",
            fieldLabel: "서비스 기획자",
            relationshipStatus: "single",
          },
        },
      },
    });
  });

  it("routes valid comprehensive V2 payloads to generated draft output", async () => {
    const result = await prepareProductGenerationFromPayload(
      makeSinglePayload({
        productKey: "saju_mbti_full",
        productSlug: "saju-mbti-full",
        productOptions: {},
      }),
    );

    expect(result).toMatchObject({
      ok: true,
      kind: "comprehensiveV2",
      draft: {
        version: "comprehensive_v2_draft",
        productType: "saju_mbti_full",
        productVersion: "v2",
      },
      evidencePacket: {
        productKey: "saju_mbti_full",
        productSlug: "saju-mbti-full",
        productType: "saju_mbti_full",
        mbtiType: "ENTJ",
      },
    });
  });

  it("keeps annual selectedYear validation in the adapter path", async () => {
    const result = await prepareProductGenerationFromPayload(
      makeSinglePayload({
        productKey: "annual_fortune",
        productSlug: "annual-fortune",
        productOptions: {},
      }),
    );

    expect(result).toEqual({
      ok: false,
      error: {
        code: "INVALID_REPORT_INPUT",
        message: "Invalid report input: SELECTED_YEAR_REQUIRED",
      },
    });
  });

  it("maps enabled writer runtime to every product handler option", () => {
    const options = createProductGenerationDispatcherOptionsFromWriterRuntime({
      enabled: true,
      config: {
        enabled: true,
        apiKey: "test-key",
        model: "test-model",
      },
    });

    expect(options.careerMoneyStudy?.writer).toEqual({
      enabled: true,
      config: {
        enabled: true,
        apiKey: "test-key",
        model: "test-model",
      },
    });
    expect(options.loveMarriageChild?.writer).toEqual(
      options.careerMoneyStudy?.writer,
    );
    expect(options.compatibility?.writer).toEqual(
      options.careerMoneyStudy?.writer,
    );
    expect(options.majorFortune?.writer).toEqual(
      options.careerMoneyStudy?.writer,
    );
    expect(options.annualFortune?.writer).toEqual(
      options.careerMoneyStudy?.writer,
    );
    expect(options.comprehensiveV2?.writer).toEqual(
      options.careerMoneyStudy?.writer,
    );
  });

  it("maps disabled writer runtime to safe fallback handler options", () => {
    const options = createProductGenerationDispatcherOptionsFromWriterRuntime({
      enabled: false,
      reason: "flag_disabled",
    });

    expect(options).toMatchObject({
      careerMoneyStudy: { writer: { enabled: false } },
      loveMarriageChild: { writer: { enabled: false } },
      compatibility: { writer: { enabled: false } },
      majorFortune: { writer: { enabled: false } },
      annualFortune: { writer: { enabled: false } },
      comprehensiveV2: { writer: { enabled: false } },
    });
  });

  it("routes valid compatibility payloads to generated draft output", async () => {
    const result = await prepareProductGenerationFromPayload(makeCompatibilityPayload());

    expect(result).toMatchObject({
      ok: true,
      kind: "compatibility",
      draft: {
        version: "compatibility_v1_draft",
        productType: "saju_mbti_compatibility",
        productVersion: "1.0",
        relationshipType: "love",
      },
      evidencePacket: {
        productType: "saju_mbti_compatibility",
        relationshipType: "love",
      },
    });
  });

  it("keeps product kind handler mapping explicit in source", () => {
    const requiredMarkers = [
      "careerMoneyStudy: handleCareerMoneyStudyGeneration",
      "loveMarriageChild: handleLoveMarriageChildGeneration",
      "compatibility: handleCompatibilityGeneration",
      "majorFortune: handleMajorFortuneGeneration",
      "annualFortune: handleAnnualFortuneGeneration",
      "comprehensiveV2: handleComprehensiveV2Generation",
      "satisfies Record<ReportProductKind, ProductGenerationHandler>",
      "createProductGenerationDispatcherOptionsFromWriterRuntime",
      "disableWriterForKind",
    ];

    for (const marker of requiredMarkers) {
      expect(source).toContain(marker);
    }
  });

  it("does not include disallowed runtime dependencies", () => {
    const forbiddenMarkers = [
      "openai",
      "fetch",
      "api/reports",
      "persistence",
      "supabase",
      "Date.now",
    ];

    for (const marker of forbiddenMarkers) {
      expect(source).not.toContain(marker);
    }
  });
});
