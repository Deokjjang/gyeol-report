import { describe, expect, it } from "vitest";

import {
  MBTI_KNOWLEDGE_BASE,
  MBTI_KNOWLEDGE_BY_TYPE,
} from "../../../src/lib/report-knowledge/mbtiKnowledgeBase";
import { MBTI_TYPES } from "../../../src/lib/report-knowledge/mbtiKnowledgeTypes";

describe("mbti knowledge base", () => {
  it("contains all 16 MBTI types", () => {
    expect(MBTI_KNOWLEDGE_BASE.map((entry) => entry.type).sort()).toEqual(
      [...MBTI_TYPES].sort(),
    );
  });

  it("keeps ENTJ detailed for the current sample", () => {
    const entj = MBTI_KNOWLEDGE_BY_TYPE.get("ENTJ");

    expect(entj).toBeDefined();
    expect(entj?.functionStack).toEqual(["Te", "Ni", "Se", "Fi"]);
    expect(entj?.traitTags).toEqual(
      expect.arrayContaining([
        "achievement_drive",
        "efficiency_focus",
        "leadership",
        "control_need",
        "strategic_thinking",
        "direct_speech",
        "growth_orientation",
        "responsibility_pressure",
        "workplace_romance",
        "emotional_dryness",
      ]),
    );
    expect(entj?.riskTags).toEqual(
      expect.arrayContaining([
        "burnout_risk",
        "relationship_distance",
        "emotional_dryness",
        "control_need",
        "direct_speech",
      ]),
    );
  });

  it("keeps ISTJ stability and responsibility style", () => {
    const istj = MBTI_KNOWLEDGE_BY_TYPE.get("ISTJ");

    expect(istj?.summary).toContain("안정");
    expect(istj?.summary).toContain("책임");
    expect(istj?.traitTags).toEqual(
      expect.arrayContaining([
        "stability_need",
        "responsibility_pressure",
        "self_discipline",
      ]),
    );
  });

  it("keeps INFP emotion value internal style", () => {
    const infp = MBTI_KNOWLEDGE_BY_TYPE.get("INFP");

    expect(infp?.summary).toContain("감정");
    expect(infp?.summary).toContain("가치");
    expect(infp?.summary).toContain("내면");
    expect(infp?.traitTags).toEqual(
      expect.arrayContaining(["empathy_need", "growth_orientation"]),
    );
  });
});
