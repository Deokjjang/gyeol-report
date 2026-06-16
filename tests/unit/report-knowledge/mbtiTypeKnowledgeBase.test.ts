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

  it("keeps INTP behavior concrete and non-generic", () => {
    const text = collectScenes("INTP");

    expect(text).toContain("원리상 어디가 안 맞는지");
    expect(text).toContain("혼자 자료를 찾아보고");
    expect(text).toContain("조건과 예외");
    expect(text).toContain("감정");
  });

  it("keeps ENTJ behavior concrete and distinct from INTP", () => {
    const text = collectScenes("ENTJ");

    expect(text).toContain("담당자, 기준, 마감선");
    expect(text).toContain("수익 모델");
    expect(text).toContain("위임 기준");
    expect(text).not.toContain("원리상 어디가 안 맞는지");
  });

  it("includes required style markers for INFP and ESTP", () => {
    expect(JSON.stringify(MBTI_TYPE_KNOWLEDGE_BY_TYPE.get("INFP"))).toContain(
      "마음이 납득",
    );
    expect(JSON.stringify(MBTI_TYPE_KNOWLEDGE_BY_TYPE.get("ESTP"))).toContain(
      "직접 부딪혀",
    );
  });
});
