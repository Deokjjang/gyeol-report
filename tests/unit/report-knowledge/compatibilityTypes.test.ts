import { describe, expect, it } from "vitest";

import { requireCompatibilityFixture } from "../../../src/lib/report-knowledge/compatibilityFixtureMatrix";

describe("REPORT-18A compatibility types", () => {
  it("uses the saju mbti compatibility product contract", () => {
    const fixture = requireCompatibilityFixture("deokmin-sodam-love");

    expect(fixture.input.productType).toBe("saju_mbti_compatibility");
    expect(fixture.input.productVersion).toBe("1.0");
    expect(fixture.input.relationshipType).toBe("love");
    expect(fixture.input.personA.birthTimeKnown).toBe(true);
    expect(fixture.input.personB.mbti).toBe("INTP");
  });
});
