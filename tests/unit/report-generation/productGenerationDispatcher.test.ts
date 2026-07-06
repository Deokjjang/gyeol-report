import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import {
  dispatchProductGenerationInput,
  getProductGenerationHandler,
  prepareProductGenerationFromPayload,
} from "../../../src/lib/report-generation/productGenerationDispatcher";
import type {
  CompatibilityReportInputPayload,
  ReportGenerationInput,
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

function makeNormalizedInput(kind: ReportProductKind): ReportGenerationInput {
  if (kind === "compatibility") {
    return {
      kind: "compatibility",
      productKey: "saju_mbti_compatibility",
      productSlug: "compatibility",
      relationshipType: "love",
      personA: {
        ...basePerson,
        name: "A",
        calendarType: "solar",
        timezone: "Asia/Seoul",
      },
      personB: {
        ...basePerson,
        name: "B",
        mbtiType: "INTP",
        calendarType: "solar",
        timezone: "Asia/Seoul",
      },
      productOptions: {},
    };
  }

  const productByKind = {
    careerMoneyStudy: {
      productKey: "career_money_study",
      productSlug: "career-money-study",
      productOptions: {},
    },
    loveMarriageChild: {
      productKey: "love_marriage_child",
      productSlug: "love-marriage-child",
      productOptions: {},
    },
    majorFortune: {
      productKey: "major_fortune",
      productSlug: "major-fortune",
      productOptions: {},
    },
    annualFortune: {
      productKey: "annual_fortune",
      productSlug: "annual-fortune",
      productOptions: {
        selectedYear: "2026",
      },
    },
  } as const;

  return {
    kind,
    ...productByKind[kind],
    person: {
      ...basePerson,
      calendarType: "solar",
      timezone: "Asia/Seoul",
    },
    userContext: baseUserContext,
  };
}

describe("product generation dispatcher", () => {
  it("has a handler for every product kind", () => {
    for (const kind of productKinds) {
      expect(typeof getProductGenerationHandler(kind)).toBe("function");
    }
  });

  it("returns not implemented for non-compatibility product handlers", async () => {
    for (const kind of productKinds.filter((kind) => kind !== "compatibility")) {
      const result = dispatchProductGenerationInput(makeNormalizedInput(kind));

      await expect(result).resolves.toEqual({
        ok: false,
        kind,
        error: {
          code: "PRODUCT_GENERATION_NOT_IMPLEMENTED",
          message: `Product generation is not implemented for ${kind}.`,
        },
      });
    }
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

  it("routes valid non-compatibility payloads to not implemented by kind", async () => {
    const payloads = [
      {
        payload: makeSinglePayload(),
        kind: "careerMoneyStudy",
      },
      {
        payload: makeSinglePayload({
          productKey: "love_marriage_child",
          productSlug: "love-marriage-child",
        }),
        kind: "loveMarriageChild",
      },
      {
        payload: makeSinglePayload({
          productKey: "major_fortune",
          productSlug: "major-fortune",
        }),
        kind: "majorFortune",
      },
      {
        payload: makeSinglePayload({
          productKey: "annual_fortune",
          productSlug: "annual-fortune",
          productOptions: {
            selectedYear: "2026",
          },
        }),
        kind: "annualFortune",
      },
    ] as const;

    for (const { payload, kind } of payloads) {
      await expect(prepareProductGenerationFromPayload(payload)).resolves.toMatchObject({
        ok: false,
        kind,
        error: {
          code: "PRODUCT_GENERATION_NOT_IMPLEMENTED",
        },
      });
    }
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
      "careerMoneyStudy: createNotImplementedHandler",
      "loveMarriageChild: createNotImplementedHandler",
      "compatibility: handleCompatibilityGeneration",
      "majorFortune: createNotImplementedHandler",
      "annualFortune: createNotImplementedHandler",
      "satisfies Record<ReportProductKind, ProductGenerationHandler>",
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
