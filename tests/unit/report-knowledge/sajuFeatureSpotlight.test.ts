import { describe, expect, it } from "vitest";

import type {
  SelectedSajuFeatureEvidence,
  SelectedSajuFeatureEvidenceItem,
} from "../../../src/lib/report-knowledge/comprehensiveReportEvidenceTypes";
import { buildSajuFeatureSpotlight } from "../../../src/lib/report-knowledge/sajuFeatureSpotlight";
import { requireSajuFeatureEntry } from "../../../src/lib/report-knowledge/sajuFeatureTaxonomy";

function createFeatureItem(
  featureId: string,
  score: number,
): SelectedSajuFeatureEvidenceItem {
  const entry = requireSajuFeatureEntry(featureId);

  return {
    id: entry.id,
    labelKo: entry.labelKo,
    category: entry.category,
    polarity: entry.polarity,
    strength: score >= 90 ? "very_high" : "high",
    score,
    topics: entry.topics,
    summary: entry.summary,
    symbolicImage: entry.symbolicImage,
    positiveReading: entry.positiveReading,
    cautionReading: entry.cautionReading,
    practicalUse: entry.practicalUse,
    sceneSeeds: entry.sceneSeeds,
    phraseSeeds: entry.phraseSeeds,
    ...(entry.mbtiBridgeNeeds === undefined
      ? {}
      : { mbtiBridgeNeeds: entry.mbtiBridgeNeeds }),
  };
}

function buildSelectedEvidence(
  featureIds: readonly string[],
): readonly SelectedSajuFeatureEvidence[] {
  return [
    {
      chapterId: "saju_identity",
      features: featureIds.map((featureId, index) =>
        createFeatureItem(featureId, 100 - index),
      ),
    },
    {
      chapterId: "risk_and_growth",
      features: featureIds.map((featureId, index) =>
        createFeatureItem(featureId, 90 - index),
      ),
    },
  ];
}

function getGroup(
  spotlight: NonNullable<ReturnType<typeof buildSajuFeatureSpotlight>>,
  groupId: string,
) {
  const group = spotlight.groups.find((item) => item.groupId === groupId);

  if (group === undefined) {
    throw new Error(`missing spotlight group: ${groupId}`);
  }

  return group;
}

function requireSpotlight(
  spotlight: ReturnType<typeof buildSajuFeatureSpotlight>,
): NonNullable<ReturnType<typeof buildSajuFeatureSpotlight>> {
  if (spotlight === undefined) {
    throw new Error("missing spotlight");
  }

  return spotlight;
}

describe("Saju feature spotlight builder", () => {
  it("groups selected computed features into good fortune talent caution and balance", () => {
    const spotlight = buildSajuFeatureSpotlight({
      selectedEvidence: buildSelectedEvidence([
        "gwiin_cheoneul",
        "gwiin_jaego",
        "gwiin_amrok",
        "twelve_sinsal_jangseong",
        "sinsal_hyeonchim",
        "sinsal_wonjin",
        "sinsal_gongmang",
        "structure_jaeda_sinyak",
        "element_water_missing",
        "element_fire_missing",
        "structure_no_output",
      ]),
    });

    const requiredSpotlight = requireSpotlight(spotlight);

    expect(requiredSpotlight.title).toBe("이 사주에서 특히 눈에 띄는 기운");
    expect(
      getGroup(requiredSpotlight, "good_fortune").items.map(
        (item) => item.featureId,
      ),
    ).toEqual(
      expect.arrayContaining(["gwiin_cheoneul", "gwiin_jaego", "gwiin_amrok"]),
    );
    expect(
      getGroup(requiredSpotlight, "talent").items.map((item) => item.featureId),
    ).toEqual(
      expect.arrayContaining(["twelve_sinsal_jangseong", "sinsal_hyeonchim"]),
    );
    expect(
      getGroup(requiredSpotlight, "caution").items.map((item) => item.featureId),
    ).toEqual(
      expect.arrayContaining([
        "sinsal_wonjin",
        "sinsal_gongmang",
        "structure_jaeda_sinyak",
      ]),
    );
    expect(
      getGroup(requiredSpotlight, "balance").items.map((item) => item.featureId),
    ).toEqual(
      expect.arrayContaining([
        "element_water_missing",
        "element_fire_missing",
        "structure_no_output",
      ]),
    );
  });

  it("caps each spotlight group and does not show absent taxonomy-only features", () => {
    const spotlight = buildSajuFeatureSpotlight({
      selectedEvidence: buildSelectedEvidence([
        "gwiin_cheoneul",
        "gwiin_jaego",
        "gwiin_amrok",
        "gwiin_munchang",
        "gwiin_geumyeorok",
        "twelve_sinsal_jangseong",
        "sinsal_hyeonchim",
        "element_water_missing",
      ]),
    });
    const allItemIds = spotlight?.groups.flatMap((group) =>
      group.items.map((item) => item.featureId),
    ) ?? [];

    for (const group of spotlight?.groups ?? []) {
      expect(group.items.length).toBeLessThanOrEqual(3);
    }
    expect(allItemIds).not.toContain("sinsal_dohwa");
    expect(allItemIds).not.toContain("twelve_sinsal_banan");
  });

  it("does not show diagnostic-only features even when selected evidence contains them", () => {
    const spotlight = buildSajuFeatureSpotlight({
      selectedEvidence: buildSelectedEvidence([
        "gwiin_cheoneul",
        "twelve_sinsal_banan",
        "sinsal_baekho",
        "element_water_missing",
      ]),
    });
    const allItemIds = spotlight?.groups.flatMap((group) =>
      group.items.map((item) => item.featureId),
    ) ?? [];

    expect(allItemIds).toContain("gwiin_cheoneul");
    expect(allItemIds).toContain("element_water_missing");
    expect(allItemIds).not.toContain("twelve_sinsal_banan");
    expect(allItemIds).not.toContain("sinsal_baekho");
  });

  it("keeps spotlight text vivid and free of unsafe claims", () => {
    const spotlight = buildSajuFeatureSpotlight({
      selectedEvidence: buildSelectedEvidence([
        "twelve_sinsal_jangseong",
        "gwiin_cheoneul",
        "gwiin_jaego",
        "sinsal_hyeonchim",
        "element_water_missing",
      ]),
    });
    const serialized = JSON.stringify(spotlight);

    expect(serialized).toContain("중심을 잡는 장수의 별");
    expect(serialized).toContain("막힌 길에 손을 내미는 귀인");
    expect(serialized).toContain("돈과 자원을 담는 창고");
    expect(serialized).toContain("바늘처럼 정확한 판단");
    expect(serialized).toContain("냉각수가 부족한 엔진");
    expect(serialized).not.toContain("..");
    expect(serialized).not.toContain("기운 막힌");
    expect(serialized).not.toContain("100%");
    expect(serialized).not.toContain("반드시");
    expect(serialized).not.toContain("무조건");
    expect(serialized).not.toContain("운명 확정");
    expect(serialized).not.toContain("수익 보장");
    expect(serialized).not.toContain("치료");
    expect(serialized).not.toContain("진단");
  });
});
