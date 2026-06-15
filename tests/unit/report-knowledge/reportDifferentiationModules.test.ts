import { describe, expect, it } from "vitest";

import { buildComprehensiveReportEvidencePacketFromComputedFacts } from "../../../src/lib/report-knowledge/comprehensiveReportEvidenceInputBuilder";
import { buildReportDifferentiationModules } from "../../../src/lib/report-knowledge/reportDifferentiationModules";
import {
  getReportQualityFixtureById,
  getReportSmokeFixture,
} from "../../../src/lib/report-knowledge/reportQualityFixtureMatrix";

function buildModulesForFixture(fixtureId: string) {
  const fixture = getReportQualityFixtureById(fixtureId);

  if (fixture === undefined) {
    throw new Error(`missing fixture: ${fixtureId}`);
  }

  const { packet } = buildComprehensiveReportEvidencePacketFromComputedFacts({
    mbtiType: fixture.mbti,
    sajuFacts: fixture.sajuFacts,
  });

  return {
    packet,
    modules: buildReportDifferentiationModules({
      selectedSajuFeatureEvidence: packet.selectedSajuFeatureEvidence,
      sajuFeatureSpotlight: packet.sajuFeatureSpotlight,
      sajuSignatureScenes: packet.sajuSignatureScenes,
      mbtiType: fixture.mbti,
    }),
  };
}

describe("report differentiation modules", () => {
  it("builds capped modules from selected evidence spotlight and signature scenes", () => {
    const fixture = getReportSmokeFixture("deokmin");
    const { packet } = buildComprehensiveReportEvidencePacketFromComputedFacts({
      mbtiType: fixture.mbti,
      sajuFacts: fixture.sajuFacts,
    });
    const modules = buildReportDifferentiationModules({
      selectedSajuFeatureEvidence: packet.selectedSajuFeatureEvidence,
      sajuFeatureSpotlight: packet.sajuFeatureSpotlight,
      sajuSignatureScenes: packet.sajuSignatureScenes,
      mbtiType: fixture.mbti,
    });
    const moduleIds = modules.map((reportModule) => reportModule.moduleId);

    expect(modules.length).toBeLessThanOrEqual(5);
    expect(moduleIds).toEqual(
      expect.arrayContaining([
        "saju_weapon",
        "saju_trap",
        "daily_scene",
        "switch_action",
        "relationship_needs",
      ]),
    );
    for (const reportModule of modules) {
      expect(reportModule.items.length).toBeLessThanOrEqual(3);
      for (const item of reportModule.items) {
        expect(item.sourceFeatureIds.length).toBeGreaterThan(0);
      }
    }
  });

  it("does not display absent feature ids in module items", () => {
    const { packet, modules } = buildModulesForFixture("money-resource-estp");
    const selectedFeatureIds = new Set(
      packet.selectedSajuFeatureEvidence?.flatMap((chapter) =>
        chapter.features.map((feature) => feature.id),
      ) ?? [],
    );

    for (const reportModule of modules) {
      for (const item of reportModule.items) {
        for (const featureId of item.sourceFeatureIds) {
          expect(selectedFeatureIds.has(featureId)).toBe(true);
        }
      }
    }
  });

  it("builds useful modules for non-ENTJ fixtures", () => {
    const { modules } = buildModulesForFixture("money-resource-estp");
    const serialized = JSON.stringify(modules);

    expect(modules.length).toBeGreaterThanOrEqual(3);
    expect(serialized).toContain("내 사주의 무기");
    expect(serialized).toContain("반복되는 함정");
    expect(serialized).toContain("바꾸는 스위치");
    expect(serialized).not.toContain("ISFP, INFP, INTP");
    expect(serialized).not.toContain("MBTI 예시");
  });

  it("adds differentiation modules to the evidence packet", () => {
    const fixture = getReportSmokeFixture("deokmin");
    const { packet } = buildComprehensiveReportEvidencePacketFromComputedFacts({
      mbtiType: fixture.mbti,
      sajuFacts: fixture.sajuFacts,
    });

    expect(packet.reportDifferentiationModules?.map((module) => module.moduleId)).toEqual(
      expect.arrayContaining(["saju_weapon", "daily_scene", "switch_action"]),
    );
    expect(packet.reportDifferentiationModules?.length ?? 0).toBeLessThanOrEqual(5);
  });
});
