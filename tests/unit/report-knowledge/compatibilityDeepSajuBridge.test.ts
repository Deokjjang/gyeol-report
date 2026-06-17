import { describe, expect, it } from "vitest";

import { buildCompatibilityEvidencePacketFromFixtureId } from "../../../src/lib/report-knowledge/compatibilityEvidenceBuilder";
import { buildCompatibilityDeepSajuBridge } from "../../../src/lib/report-knowledge/compatibilityDeepSajuBridge";

describe("REPORT-18F compatibility deep Saju bridge", () => {
  it("builds diversified deep notes for deokmin and sodam", () => {
    const packet = buildCompatibilityEvidencePacketFromFixtureId("deokmin-sodam-love");
    const bridge = buildCompatibilityDeepSajuBridge({
      personA: packet.personAChartSummary,
      personB: packet.personBChartSummary,
    });
    const layers = new Set(bridge.notes.map((note) => note.layer));
    const text = JSON.stringify(bridge);

    expect(bridge.notes.length).toBeGreaterThanOrEqual(5);
    expect([...layers]).toEqual(
      expect.arrayContaining([
        "day_master_relation",
        "cross_ten_god",
        "element_complement",
        "combined_element_climate",
        "branch_trine",
      ]),
    );
    expect(text).toContain("갑목");
    expect(text).toContain("정화");
    expect(text).toContain("상관");
    expect(text).toContain("정인");
    expect(text).toContain("mutual element complement");
    expect(text).toContain("토 7");
    expect(text).toContain("亥卯未");
    expect(text).toContain("申子辰");
    expect(text).toContain("丑未");
    expect(text).toContain("申亥");
    expect(text).not.toContain("백호대살");
  });

  it("groups notes by attraction, friction, lifestyle, and communication", () => {
    const packet = buildCompatibilityEvidencePacketFromFixtureId("deokmin-sodam-love");
    const bridge = packet.deepSajuBridge;

    expect(bridge?.attractionNotes.length).toBeGreaterThan(0);
    expect(bridge?.frictionNotes.length).toBeGreaterThan(0);
    expect(bridge?.lifestyleNotes.length).toBeGreaterThan(0);
    expect(bridge?.communicationNotes.length).toBeGreaterThan(0);
  });
});
