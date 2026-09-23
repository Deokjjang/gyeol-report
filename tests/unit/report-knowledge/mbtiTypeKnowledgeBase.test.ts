import { getMbtiSourceProfile, type MbtiTraitArea } from "../../../src/lib/report-knowledge/mbti/sourceRuntimeAdapter";
import { describe, expect, it } from "vitest";

import {
  MBTI_TYPE_KNOWLEDGE_BASE,
  MBTI_TYPE_KNOWLEDGE_BY_TYPE,
} from "../../../src/lib/report-knowledge/mbtiTypeKnowledgeBase";
import { MBTI_TYPES } from "../../../src/lib/report-knowledge/mbtiKnowledgeTypes";
import type { MbtiTypeCode } from "../../../src/lib/report-knowledge/mbtiKnowledgeTypes";

function collectScenes(type: MbtiTypeCode): string {
  return (
    MBTI_TYPE_KNOWLEDGE_BY_TYPE.get(type)?.traitSeeds.flatMap((trait) =>
      trait.sceneSeeds,
    ) ?? []
  ).join("\n");
}

describe("REPORT-17 MBTI type knowledge base", () => {
  it("contains all 16 MBTI types", () => {
    expect(MBTI_TYPE_KNOWLEDGE_BASE.map((entry) => entry.type).sort()).toEqual(
      [...MBTI_TYPES].sort(),
    );
  });

  it("provides rich trait coverage for every type", () => {
    for (const entry of MBTI_TYPE_KNOWLEDGE_BASE) {
      const contexts = new Set(entry.traitSeeds.map((trait) => trait.context));
      const scenes = entry.traitSeeds.flatMap((trait) => trait.sceneSeeds);
      const switches = entry.traitSeeds.flatMap((trait) => trait.practicalSwitches);

      expect(entry.traitSeeds.length).toBeGreaterThanOrEqual(18);
      expect(contexts.size).toBeGreaterThanOrEqual(8);
      expect(scenes.length).toBeGreaterThanOrEqual(20);
      expect(switches.length).toBeGreaterThanOrEqual(10);
      expect(entry.relationshipNeeds.length).toBeGreaterThanOrEqual(3);
      expect(entry.compatibleTraitConditions.length).toBeGreaterThanOrEqual(3);
      expect(entry.frictionTraitConditions.length).toBeGreaterThanOrEqual(3);
    }
  });

  it.each(MBTI_TYPES)("%s uses source traits rather than letter-based generic copy", type => {
    const source = getMbtiSourceProfile(type)!;
    const entry = MBTI_TYPE_KNOWLEDGE_BY_TYPE.get(type)!;
    expect(entry.corePattern).toBe(source.summary?.identity ?? source.oneLine);
    for (const seed of entry.traitSeeds) {
      const [, owner, , area, id] = seed.sourceEvidenceId!.split(":");
      expect(owner).toBe(type);
      const trait = source.traits?.[area as MbtiTraitArea]?.find(t => t.id === id);
      expect(trait).toBeDefined();
      expect(seed.description).toBe(trait!.plainKo);
      expect(seed.sceneSeeds).toEqual([trait!.strongLine ?? trait!.plainKo]);
      expect(seed.risks).toEqual(trait!.risk ? [trait!.risk] : []);
    }
    expect(collectScenes(type)).not.toMatch(/core_identity 상황|번역이 밖으로 너무 늦거나/);
  });
});
