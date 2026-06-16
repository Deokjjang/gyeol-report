import { describe, expect, it } from "vitest";

import { buildCompatibilityMbtiBridge } from "../../../src/lib/report-knowledge/compatibilityMbtiBridge";
import { requireCompatibilityFixture } from "../../../src/lib/report-knowledge/compatibilityFixtureMatrix";

describe("REPORT-18A compatibility MBTI bridge", () => {
  it("produces speed and analysis contrast for ENTJ and INTP", () => {
    const fixture = requireCompatibilityFixture("deokmin-sodam-love");
    const bridge = buildCompatibilityMbtiBridge({
      personA: fixture.input.personA,
      personB: fixture.input.personB,
    });

    expect(bridge.pairLabel).toBe("ENTJ + INTP");
    expect(bridge.frictionRisks.join("\n")).toContain("조건과 원리 검증");
    expect(bridge.communicationNotes.join("\n")).toContain("ENTJ");
    expect(bridge.communicationNotes.join("\n")).toContain("INTP");
  });

  it("returns limited notes when one MBTI is missing", () => {
    const fixture = requireCompatibilityFixture("unknown-time-some");
    const bridge = buildCompatibilityMbtiBridge({
      personA: fixture.input.personA,
      personB: fixture.input.personB,
    });

    expect(bridge.pairLabel).toBe("INFP + MBTI 미입력");
    expect(bridge.communicationNotes.join("\n")).toContain("한쪽 MBTI");
  });

  it("does not recommend candidate MBTI types", () => {
    const fixture = requireCompatibilityFixture("deokmin-sodam-love");
    const bridge = buildCompatibilityMbtiBridge({
      personA: fixture.input.personA,
      personB: fixture.input.personB,
    });
    const text = JSON.stringify(bridge);

    expect(text).not.toContain("추천 유형");
    expect(text).not.toContain("후보 유형");
    expect(text).not.toContain("소울메이트");
  });
});
