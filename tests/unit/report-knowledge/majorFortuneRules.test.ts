import { describe, expect, it } from "vitest";

import {
  getMajorFortuneCycleForYear,
  getMajorFortuneGanjiInfo,
  hydrateMajorFortuneCycle,
} from "../../../src/lib/report-knowledge/majorFortuneRules";

describe("majorFortuneRules", () => {
  it("parses major fortune ganji and maps element metadata", () => {
    const info = getMajorFortuneGanjiInfo("甲戌");

    expect(info).toMatchObject({
      stem: "甲",
      branch: "戌",
      stemElement: "wood",
      branchElement: "earth",
      stemYinYang: "yang",
      branchYinYang: "yang",
    });
  });

  it("hydrates major fortune cycle metadata", () => {
    const cycle = hydrateMajorFortuneCycle({
      index: 3,
      startAge: 24,
      endAge: 33,
      startYear: 2023,
      endYear: 2032,
      ganji: "甲戌",
    });

    expect(cycle.ganji).toBe("甲戌");
    expect(cycle.stem).toBe("甲");
    expect(cycle.branch).toBe("戌");
    expect(cycle.startAge).toBe(24);
    expect(cycle.endYear).toBe(2032);
  });

  it("selects current cycle with previous and next cycle", () => {
    const cycles = [
      hydrateMajorFortuneCycle({
        index: 1,
        startAge: 14,
        endAge: 23,
        startYear: 2013,
        endYear: 2022,
        ganji: "癸酉",
      }),
      hydrateMajorFortuneCycle({
        index: 2,
        startAge: 24,
        endAge: 33,
        startYear: 2023,
        endYear: 2032,
        ganji: "甲戌",
      }),
      hydrateMajorFortuneCycle({
        index: 3,
        startAge: 34,
        endAge: 43,
        startYear: 2033,
        endYear: 2042,
        ganji: "乙亥",
      }),
    ];

    const access = getMajorFortuneCycleForYear({
      cycles,
      currentYear: 2026,
      currentAge: 27,
    });

    expect(access.currentCycle.ganji).toBe("甲戌");
    expect(access.previousCycle?.ganji).toBe("癸酉");
    expect(access.nextCycle?.ganji).toBe("乙亥");
    expect(access.currentAge).toBe(27);
  });
});
