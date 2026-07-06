import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import {
  getReportProductKind,
  normalizeReportInputPayload,
  toCompatibilityGenerationInput,
  toSinglePersonGenerationInput,
  type CompatibilityReportInputPayload,
  type ReportInputPayload,
  type SinglePersonReportInputPayload,
} from "../../../src/lib/report-generation/reportInputAdapter";

const sourcePath = join(
  process.cwd(),
  "src/lib/report-generation/reportInputAdapter.ts",
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
  focusAreas: ["직업", "돈", "공부"],
} as const;

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

describe("report input adapter", () => {
  it("maps product keys to generation kinds", () => {
    expect(getReportProductKind("career_money_study")).toEqual({
      ok: true,
      value: "careerMoneyStudy",
    });
    expect(getReportProductKind("love_marriage_child")).toEqual({
      ok: true,
      value: "loveMarriageChild",
    });
    expect(getReportProductKind("major_fortune")).toEqual({
      ok: true,
      value: "majorFortune",
    });
    expect(getReportProductKind("annual_fortune")).toEqual({
      ok: true,
      value: "annualFortune",
    });
    expect(getReportProductKind("saju_mbti_compatibility")).toEqual({
      ok: true,
      value: "compatibility",
    });
  });

  it("normalizes career, love, and major single-person payloads", () => {
    const payloads: ReadonlyArray<SinglePersonReportInputPayload> = [
      makeSinglePayload(),
      makeSinglePayload({
        productKey: "love_marriage_child",
        productSlug: "love-marriage-child",
      }),
      makeSinglePayload({
        productKey: "major_fortune",
        productSlug: "major-fortune",
      }),
    ];

    const results = payloads.map((payload) =>
      toSinglePersonGenerationInput(payload),
    );

    expect(results).toMatchObject([
      {
        ok: true,
        value: {
          kind: "careerMoneyStudy",
          productKey: "career_money_study",
          productSlug: "career-money-study",
          productOptions: {},
        },
      },
      {
        ok: true,
        value: {
          kind: "loveMarriageChild",
          productKey: "love_marriage_child",
          productSlug: "love-marriage-child",
          productOptions: {},
        },
      },
      {
        ok: true,
        value: {
          kind: "majorFortune",
          productKey: "major_fortune",
          productSlug: "major-fortune",
          productOptions: {},
        },
      },
    ]);

    for (const result of results) {
      expect(result.ok).toBe(true);
      if (!result.ok) continue;
      expect(result.value.person).toMatchObject({
        calendarType: "solar",
        timezone: "Asia/Seoul",
        birthTimeUnknown: true,
        birthTime: "",
      });
      expect(result.value.userContext).toEqual(baseUserContext);
    }
  });

  it("keeps annual selectedYear in productOptions", () => {
    const result = normalizeReportInputPayload(
      makeSinglePayload({
        productKey: "annual_fortune",
        productSlug: "annual-fortune",
        productOptions: {
          selectedYear: "2026",
        },
      }),
    );

    expect(result).toEqual({
      ok: true,
      value: {
        kind: "annualFortune",
        productKey: "annual_fortune",
        productSlug: "annual-fortune",
        person: {
          ...basePerson,
          calendarType: "solar",
          timezone: "Asia/Seoul",
        },
        userContext: baseUserContext,
        productOptions: {
          selectedYear: "2026",
        },
      },
    });
  });

  it("normalizes compatibility A/B payloads", () => {
    const result = toCompatibilityGenerationInput(makeCompatibilityPayload());

    expect(result).toEqual({
      ok: true,
      value: {
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
      },
    });
  });

  it("rejects missing required single-person fields", () => {
    expect(
      normalizeReportInputPayload(
        makeSinglePayload({
          person: {
            ...basePerson,
            name: "",
          },
        }),
      ),
    ).toEqual({
      ok: false,
      error: "INVALID_PERSON_NAME",
    });

    expect(
      normalizeReportInputPayload(
        makeSinglePayload({
          person: {
            ...basePerson,
            birthDate: "",
          },
        }),
      ),
    ).toEqual({
      ok: false,
      error: "INVALID_PERSON_BIRTH_DATE",
    });
  });

  it("rejects annual payloads without selectedYear", () => {
    const result = normalizeReportInputPayload(
      makeSinglePayload({
        productKey: "annual_fortune",
        productSlug: "annual-fortune",
        productOptions: {},
      }) as ReportInputPayload,
    );

    expect(result).toEqual({
      ok: false,
      error: "SELECTED_YEAR_REQUIRED",
    });
  });

  it("rejects missing compatibility required fields", () => {
    expect(
      normalizeReportInputPayload({
        ...makeCompatibilityPayload(),
        relationshipType: "",
      }),
    ).toEqual({
      ok: false,
      error: "RELATIONSHIP_TYPE_REQUIRED",
    });

    expect(
      normalizeReportInputPayload(
        makeCompatibilityPayload({
          personB: {
            ...basePerson,
            name: "",
          },
        }),
      ),
    ).toEqual({
      ok: false,
      error: "INVALID_PERSON_NAME",
    });
  });

  it("keeps birthTime optional when birthTimeUnknown is true", () => {
    const result = normalizeReportInputPayload(
      makeSinglePayload({
        person: {
          ...basePerson,
          birthTime: "",
          birthTimeUnknown: true,
        },
      }),
    );

    expect(result).toMatchObject({
      ok: true,
      value: {
        person: {
          birthTime: "",
          birthTimeUnknown: true,
        },
      },
    });
  });

  it("rejects unknown product keys and slug mismatches", () => {
    expect(
      normalizeReportInputPayload({
        ...makeSinglePayload(),
        productKey: "unknown",
      }),
    ).toEqual({
      ok: false,
      error: "UNKNOWN_PRODUCT_KEY",
    });

    expect(
      normalizeReportInputPayload({
        ...makeSinglePayload(),
        productSlug: "annual-fortune",
      }),
    ).toEqual({
      ok: false,
      error: "INVALID_PRODUCT_SLUG",
    });
  });

  it("does not include removed input fields in normalized output", () => {
    const payload = {
      ...makeSinglePayload(),
      currentConcern: "이직",
      childPlan: "없음",
      hasChildren: "no",
      maritalStatus: "single",
    };

    const result = normalizeReportInputPayload(payload);

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(JSON.stringify(result.value)).not.toContain("currentConcern");
    expect(JSON.stringify(result.value)).not.toContain("childPlan");
    expect(JSON.stringify(result.value)).not.toContain("hasChildren");
    expect(JSON.stringify(result.value)).not.toContain("maritalStatus");
  });

  it("does not import writer, API, or persistence modules", () => {
    const forbiddenMarkers = [
      "openai",
      "fetch(",
      "src/app/api",
      "api/reports",
      "persistence",
      "Date.now",
    ];

    for (const marker of forbiddenMarkers) {
      expect(source).not.toContain(marker);
    }
  });
});
