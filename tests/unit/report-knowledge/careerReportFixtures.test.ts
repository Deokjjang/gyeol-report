import { describe, expect, it } from "vitest";

import {
  CAREER_REPORT_FIXTURES,
  requireCareerReportFixture,
} from "../../../src/lib/report-knowledge/careerReportFixtures";

describe("careerReportFixtures", () => {
  it("exports unique fixture ids", () => {
    const ids = CAREER_REPORT_FIXTURES.map((fixture) => fixture.id);

    expect(new Set(ids).size).toBe(ids.length);
  });

  it("includes the Deokmin career fixture", () => {
    const fixture = requireCareerReportFixture("deokmin-career");

    expect(fixture.person).toMatchObject({
      label: "덕민",
      mbti: "ENTJ",
      userContext: {
        lifeStatus: "employee",
        fieldLabel: "개발·서비스 기획",
        relationshipStatus: "unknown",
      },
      pillars: {
        year: "己卯",
        month: "辛未",
        day: "甲申",
        hour: "戊辰",
      },
    });
    expect(fixture.person.labels).toContain("재다신약");
    expect(fixture.person.labels).not.toContain("백호대살");
  });

  it("has at least five fixtures with MBTI and life-status diversity", () => {
    const mbtiTypes = new Set(
      CAREER_REPORT_FIXTURES.map((fixture) => fixture.person.mbti ?? "unknown"),
    );
    const lifeStatuses = new Set(
      CAREER_REPORT_FIXTURES.map(
        (fixture) => fixture.person.userContext.lifeStatus,
      ),
    );

    expect(CAREER_REPORT_FIXTURES.length).toBeGreaterThanOrEqual(5);
    expect(mbtiTypes.size).toBeGreaterThanOrEqual(5);
    expect(lifeStatuses.size).toBeGreaterThanOrEqual(4);
  });

  it("does not include interestArea in fixture context", () => {
    expect(JSON.stringify(CAREER_REPORT_FIXTURES)).not.toContain("interestArea");
  });
});
