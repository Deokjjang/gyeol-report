import { describe, expect, it } from "vitest";

import {
  COMPATIBILITY_FIXTURE_MATRIX,
  requireCompatibilityFixture,
} from "../../../src/lib/report-knowledge/compatibilityFixtureMatrix";

describe("REPORT-18A compatibility fixture matrix", () => {
  it("includes the deokmin sodam love fixture with expected pillars", () => {
    const fixture = requireCompatibilityFixture("deokmin-sodam-love");

    expect(fixture.input.personA.displayName).toBe("덕민");
    expect(fixture.input.personA.mbti).toBe("ENTJ");
    expect(fixture.input.personB.displayName).toBe("소담");
    expect(fixture.input.personB.mbti).toBe("INTP");
    expect(fixture.expectedPillars.personA).toEqual({
      year: "己卯",
      month: "辛未",
      day: "甲申",
      hour: "戊辰",
    });
    expect(fixture.expectedPillars.personB).toEqual({
      year: "丙子",
      month: "己亥",
      day: "丁丑",
      hour: "丁未",
    });
  });

  it("allows missing birth time and missing MBTI", () => {
    const fixture = requireCompatibilityFixture("unknown-time-some");

    expect(fixture.input.relationshipType).toBe("some");
    expect(fixture.input.personB.birthTimeKnown).toBe(false);
    expect(fixture.input.personB.birthTime).toBeNull();
    expect(fixture.input.personB.mbti).toBeNull();
  });

  it("covers all six v1 relationship types", () => {
    expect(
      new Set(COMPATIBILITY_FIXTURE_MATRIX.map((fixture) => fixture.input.relationshipType)),
    ).toEqual(
      new Set([
        "love",
        "marriage",
        "some",
        "friendship",
        "family",
        "business_work_partner",
      ]),
    );
  });

  it("includes family and business work partner category fixtures", () => {
    const family = requireCompatibilityFixture("family-unknown-mbti");
    const business = requireCompatibilityFixture("business-work-partner-sample");
    const marriage = requireCompatibilityFixture("deokmin-sodam-marriage");

    expect(family.input.relationshipType).toBe("family");
    expect(family.input.personA.mbti).toBeNull();
    expect(business.input.relationshipType).toBe("business_work_partner");
    expect(marriage.input.relationshipType).toBe("marriage");
    expect(marriage.expectedPillars.personA).toEqual(
      requireCompatibilityFixture("deokmin-sodam-love").expectedPillars.personA,
    );
  });
});
