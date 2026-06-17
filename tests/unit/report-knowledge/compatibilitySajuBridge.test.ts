import { describe, expect, it } from "vitest";

import { buildCompatibilityEvidencePacketFromFixtureId } from "../../../src/lib/report-knowledge/compatibilityEvidenceBuilder";

describe("REPORT-18A compatibility Saju bridge", () => {
  it("detects shared good fortune features for deokmin and sodam", () => {
    const packet = buildCompatibilityEvidencePacketFromFixtureId("deokmin-sodam-love");

    expect(packet.sajuBridge.sharedFeatureLabels).toContain("천을귀인");
    expect(packet.sajuBridge.sharedFeatureLabels).toContain("재고귀인");
    expect(packet.sajuBridge.moneyLifestyleNotes.join("\n")).toContain("재고귀인");
  });

  it("keeps distinct day pillars visible in attraction evidence", () => {
    const packet = buildCompatibilityEvidencePacketFromFixtureId("deokmin-sodam-love");

    expect(packet.sajuBridge.attractionNotes.join("\n")).toContain("갑신");
    expect(packet.sajuBridge.attractionNotes.join("\n")).toContain("정축");
  });

  it("lowers hour-pillar confidence when birth time is unknown", () => {
    const packet = buildCompatibilityEvidencePacketFromFixtureId("unknown-time-some");

    expect(packet.warnings).toContain("personB birth time unknown");
    expect(packet.sajuBridge.longTermNotes.join("\n")).toContain("출생시간");
  });

  it("does not use diagnostic-only baekho as confirmed evidence", () => {
    const packet = buildCompatibilityEvidencePacketFromFixtureId("deokmin-sodam-love");
    const evidenceText = JSON.stringify(packet.sajuBridge.evidenceItems);

    expect(packet.personBChartSummary.diagnosticFeatureLabels).toContain("백호대살");
    expect(evidenceText).not.toContain("백호대살");
  });

  it("attaches deep saju bridge evidence without diagnostic-only terms", () => {
    const packet = buildCompatibilityEvidencePacketFromFixtureId("deokmin-sodam-love");
    const layers = [
      ...new Set(
        packet.sajuBridge.deepSajuBridge.notes.map((note) => note.layer),
      ),
    ];

    expect(layers).toEqual(
      expect.arrayContaining([
        "day_master_relation",
        "cross_ten_god",
        "element_complement",
        "combined_element_climate",
        "branch_trine",
      ]),
    );
    expect(JSON.stringify(packet.sajuBridge.deepSajuBridge)).not.toContain(
      "백호대살",
    );
  });
});
