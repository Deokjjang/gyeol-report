import { describe, expect, it } from "vitest";

import { getTenGodForStemPair } from "../../../src/lib/report-knowledge/annualFortuneYearRules";
import {
  MAJOR_FORTUNE_FIXTURES,
} from "../../../src/lib/report-knowledge/majorFortuneFixtures";
import { getMajorFortuneCycleForYear } from "../../../src/lib/report-knowledge/majorFortuneRules";

describe("majorFortuneFixtures", () => {
  it("exports unique fixture ids", () => {
    const ids = MAJOR_FORTUNE_FIXTURES.map((fixture) => fixture.id);

    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has an active major cycle containing currentYear for every fixture", () => {
    for (const fixture of MAJOR_FORTUNE_FIXTURES) {
      const activeCycle = getMajorFortuneCycleForYear({
        cycles: fixture.person.majorFortuneCycles,
        currentYear: fixture.currentYear,
        currentAge: fixture.currentYear,
      }).currentCycle;

      expect(activeCycle.startYear).toBeLessThanOrEqual(fixture.currentYear);
      expect(activeCycle.endYear).toBeGreaterThanOrEqual(fixture.currentYear);
    }
  });

  it("covers every supported relationship status", () => {
    const statuses = new Set(
      MAJOR_FORTUNE_FIXTURES.map(
        (fixture) => fixture.person.userContext.relationshipStatus ?? "unknown",
      ),
    );

    expect(statuses).toEqual(
      new Set(["single", "dating", "married", "unknown"]),
    );
  });

  it("covers at least five different major ten-god outcomes", () => {
    const tenGods = new Set(
      MAJOR_FORTUNE_FIXTURES.map((fixture) => {
        const activeCycle = getMajorFortuneCycleForYear({
          cycles: fixture.person.majorFortuneCycles,
          currentYear: fixture.currentYear,
          currentAge: fixture.currentYear,
        }).currentCycle;
        const dayStem = fixture.person.pillars.day.slice(0, 1);

        return getTenGodForStemPair(
          dayStem as Parameters<typeof getTenGodForStemPair>[0],
          activeCycle.stem,
        );
      }),
    );

    expect(tenGods.size).toBeGreaterThanOrEqual(5);
  });

  it("does not leak Deokmin data into non-Deokmin fixtures", () => {
    for (const fixture of MAJOR_FORTUNE_FIXTURES.filter(
      (item) => item.id !== "deokmin-current-major-fortune",
    )) {
      expect(JSON.stringify(fixture)).not.toContain("덕민");
      expect(JSON.stringify(fixture)).not.toContain("개발·서비스 기획");
    }
  });
});
