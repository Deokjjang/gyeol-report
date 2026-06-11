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

  it("expands every type with function stack topic data phrases and bridge data", () => {
    for (const entry of MBTI_KNOWLEDGE_BASE) {
      expect(entry.functionStack.length).toBe(4);
      expect(entry.functionProfile).toBeDefined();
      expect(entry.topicInterpretations?.personality).toBeDefined();
      expect(entry.topicInterpretations?.strengths).toBeDefined();
      expect(entry.topicInterpretations?.weaknesses).toBeDefined();
      expect(entry.topicInterpretations?.work_career).toBeDefined();
      expect(entry.topicInterpretations?.money_asset).toBeDefined();
      expect(entry.topicInterpretations?.love_relationship).toBeDefined();
      expect(entry.topicInterpretations?.human_relations).toBeDefined();
      expect(entry.topicInterpretations?.family_independence).toBeDefined();
      expect(entry.topicInterpretations?.study_growth).toBeDefined();
      expect(entry.topicInterpretations?.final_advice).toBeDefined();
      expect(entry.phraseSeeds.analytical.length).toBeGreaterThanOrEqual(3);
      expect(entry.phraseSeeds.conversational.length).toBeGreaterThanOrEqual(3);
      expect(entry.phraseSeeds.caution.length).toBeGreaterThanOrEqual(2);
      expect(entry.phraseSeeds.advice.length).toBeGreaterThanOrEqual(2);
      expect(entry.relationshipPreferences.needs.length).toBeGreaterThan(0);
      expect(entry.sajuBridgeTags.length).toBeGreaterThan(0);
      expect(entry.sajuBridge?.likelySajuResonance?.length).toBeGreaterThan(0);
      expect(entry.workStyleKo?.length).toBeGreaterThan(0);
      expect(entry.moneyStyleKo?.length).toBeGreaterThan(0);
      expect(entry.loveStyleKo?.length).toBeGreaterThan(0);
      expect(entry.relationshipStyleKo?.length).toBeGreaterThan(0);
      expect(entry.growthAdviceKo?.length).toBeGreaterThan(0);
    }
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
        "money_orientation",
        "authority_orientation",
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
    expect(entj?.sajuBridge?.likelySajuResonance?.join(" ")).toContain("재성 강세");
    expect(entj?.sajuBridge?.likelySajuResonance?.join(" ")).toContain("현침살");
    expect(entj?.loveStyleKo?.join(" ")).toContain("성장");
    expect(entj?.loveStyleKo?.join(" ")).toContain("일터");
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
        "precision_skill",
      ]),
    );
    expect(JSON.stringify(istj)).toContain("신뢰");
    expect(JSON.stringify(istj)).toContain("규칙");
    expect(JSON.stringify(istj)).toContain("안정 자산");
  });

  it("keeps INFP emotion value internal style", () => {
    const infp = MBTI_KNOWLEDGE_BY_TYPE.get("INFP");

    expect(infp?.summary).toContain("감정");
    expect(infp?.summary).toContain("가치");
    expect(infp?.summary).toContain("내면");
    expect(infp?.traitTags).toEqual(
      expect.arrayContaining([
        "empathy_need",
        "growth_orientation",
        "emotional_depth",
        "relationship_sensitivity",
        "flexibility_need",
      ]),
    );
    expect(infp?.riskTags).toContain("expression_weakness");
    expect(JSON.stringify(infp)).toContain("감성형");
  });

  it("keeps ENFP and INTJ meaningful for expression possibility strategy and independence", () => {
    const enfp = MBTI_KNOWLEDGE_BY_TYPE.get("ENFP");
    const intj = MBTI_KNOWLEDGE_BY_TYPE.get("INTJ");

    expect(JSON.stringify(enfp)).toContain("가능성");
    expect(JSON.stringify(enfp)).toContain("표현");
    expect(enfp?.traitTags).toEqual(
      expect.arrayContaining(["public_presence", "growth_orientation"]),
    );
    expect(JSON.stringify(intj)).toContain("전략");
    expect(JSON.stringify(intj)).toContain("독립성");
    expect(intj?.traitTags).toEqual(
      expect.arrayContaining(["strategic_thinking", "independence"]),
    );
  });
});
