import { describe, expect, it } from "vitest";

import { buildAnnualFortuneEvidence } from "../../../src/lib/report-knowledge/annualFortuneEvidence";
import {
  ANNUAL_FORTUNE_FIXTURES,
  requireAnnualFortuneFixture,
} from "../../../src/lib/report-knowledge/annualFortuneFixtures";

function buildFromFixture(fixtureId: string) {
  const fixture = requireAnnualFortuneFixture(fixtureId);

  return buildAnnualFortuneEvidence({
    targetYear: fixture.targetYear,
    currentDate: new Date(`${fixture.currentDate}T00:00:00+09:00`),
    person: fixture.person,
  });
}

describe("annualFortuneEvidence", () => {
  it("builds Deokmin 2026 annual evidence with ganji, ten-god, and double element effect", () => {
    const packet = buildFromFixture("deokmin-2026-current");

    expect(packet.productType).toBe("annual_fortune");
    expect(packet.productVersion).toBe("v1");
    expect(packet.targetYear).toBe(2026);
    expect(packet.currentDate).toBe("2026-06-18");
    expect(packet.mode).toBe("current_year");
    expect(packet.annualGanji.ganji).toBe("丙午");
    expect(packet.dayMaster).toBe("甲");
    expect(packet.annualTenGod.stemTenGod).toBe("식신");
    expect(packet.elementEffect.fillsMissing).toContain("fire");
    expect(packet.elementEffect.overloadsHeavy).toContain("earth");
    expect(packet.elementEffect.plain).toContain("간접");
    expect(packet.lifeAreaSignals).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ area: "work", strength: "high" }),
        expect.objectContaining({ area: "money", strength: "medium" }),
      ]),
    );
    expect(packet.difficultySignals).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ type: "overload", severity: "medium" }),
        expect.objectContaining({
          type: "money_responsibility",
          severity: "medium",
        }),
      ]),
    );
    expect(packet.opportunitySignals).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ type: "expression", strength: "high" }),
      ]),
    );
    expect(packet.monthlyFortuneSeeds).toHaveLength(12);
    expect(packet.monthlyFortuneSeeds[0]).toMatchObject({
      month: 1,
      label: "1월",
      elementFocus: expect.any(String),
      monthGanji: expect.objectContaining({
        ganji: "庚寅",
        basis: "calendar_month_approximation",
      }),
    });
    expect(
      packet.monthlyFortuneSeeds.every(
        (seed) =>
          seed.monthGanji.ganji.length > 0 &&
          seed.elementFocus.length > 0 &&
          seed.monthGanji.basis === "calendar_month_approximation",
      ),
    ).toBe(true);
  });

  it("builds Deokmin 2021 annual review as 辛丑 정관 for 甲 day master", () => {
    const packet = buildFromFixture("deokmin-2021-review");

    expect(packet.mode).toBe("past_review");
    expect(packet.annualGanji.ganji).toBe("辛丑");
    expect(packet.annualTenGod.stemTenGod).toBe("정관");
    expect(packet.lifeAreaSignals).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ area: "work", strength: "high" }),
      ]),
    );
  });

  it("exports unique fixtures and applies 2027 access policy", () => {
    const ids = ANNUAL_FORTUNE_FIXTURES.map((fixture) => fixture.id);
    const locked = buildFromFixture("deokmin-2027-locked-before-december");
    const open = buildFromFixture("deokmin-2027-new-year-after-december");

    expect(new Set(ids).size).toBe(ids.length);
    expect(requireAnnualFortuneFixture("deokmin-2026-current").targetYear).toBe(2026);
    expect(locked.annualGanji.ganji).toBe("丁未");
    expect(locked.yearAccess).toMatchObject({
      isSelectable: false,
      mode: "locked_future",
    });
    expect(open.yearAccess).toMatchObject({
      isSelectable: true,
      mode: "new_year_preview",
    });
  });
});
