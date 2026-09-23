import { scoreCompatibility } from "../../../src/lib/report-knowledge/compatibilityScoreEngine";
import { buildCompatibilityEvidencePacketFromFixture } from "../../../src/lib/report-knowledge/compatibilityEvidenceBuilder";
import { describe, expect, it } from "vitest";
import { MBTI_SOURCE_TYPES, MBTI_REPORT_USE_CASE_KEYS, MBTI_PRODUCT_TRAIT_AREAS, getMbtiProductTraits, getMbtiSourceProfile, getMbtiRelationshipPair, getMbtiFortuneBasis } from "../../../src/lib/report-knowledge/mbti/sourceRuntimeAdapter";
import { MBTI_BRIDGE_TRAIT_ALIASES, requireMbtiTypeKnowledge } from "../../../src/lib/report-knowledge/mbtiTypeKnowledgeBase";
import { getMbtiKnowledge } from "../../../src/lib/report-knowledge/knowledgeSelectors";
import { buildCompatibilityMbtiBridge } from "../../../src/lib/report-knowledge/compatibilityMbtiBridge";
import { requireCompatibilityFixture } from "../../../src/lib/report-knowledge/compatibilityFixtureMatrix";
import { validateMbtiKnowledgeDensity } from "../../../src/lib/report-knowledge/knowledgeValidators";
import { MBTI_KNOWLEDGE_BASE } from "../../../src/lib/report-knowledge/mbtiKnowledgeBase";

describe("existing source assets routed by report purpose", () => {
  it.each(MBTI_SOURCE_TYPES)("%s: six routes retain exact source ownership", type => {
    const source = getMbtiSourceProfile(type)!;
    for (const product of MBTI_REPORT_USE_CASE_KEYS) {
      const selected = getMbtiProductTraits(type, product, 2);
      expect(new Set(selected.map(t=>t.area))).toEqual(new Set(MBTI_PRODUCT_TRAIT_AREAS[product]));
      expect(new Set(selected.map(t=>t.evidenceId)).size).toBe(selected.length);
      for (const item of selected) {
        expect(source.traits![item.area]).toContain(item.trait);
        expect(item.evidenceId).toBe(`mbti:${type}:traits:${item.area}:${item.trait.id}`);
      }
    }
    const knowledge = getMbtiKnowledge(type);
    expect(knowledge.functionStack).toEqual(Object.values(source.functionStack!));
    expect(knowledge.summary).toBe(source.summary!.identity);
    expect(knowledge.topicInterpretations!.study_growth!.summary).toContain(source.traits!.study![0].plainKo);
    expect(knowledge.topicInterpretations!.money_asset!.summary).toContain(source.traits!.investment![0].plainKo);
    expect(knowledge.topicInterpretations!.love_relationship!.summary).toContain(source.traits!.marriage![0].plainKo);
  });
  it.each([null, undefined, "", "INVALID"])("missing/invalid %s never infers a type", type => {
    expect(getMbtiSourceProfile(type)).toBeNull();
    for (const product of MBTI_REPORT_USE_CASE_KEYS) expect(getMbtiProductTraits(type,product)).toEqual([]);
    for (const product of ["daeunReport","saeunReport"] as const) {
      const basis=getMbtiFortuneBasis(type,product);
      expect(basis.type).toBeNull(); expect(basis.coreTraits).toEqual([]); expect(basis.reportUseCases).toEqual([]);
    }
  });
  it("keeps the six authored Bridge identities without a second personality database", () => {
    expect(MBTI_BRIDGE_TRAIT_ALIASES).toHaveLength(6);
    for (const alias of MBTI_BRIDGE_TRAIT_ALIASES) {
      const seed=requireMbtiTypeKnowledge(alias.type).traitSeeds.find(t=>t.id===alias.id)!;
      expect(seed.sourceEvidenceId).toBe(`mbti:${alias.type}:traits:${alias.area}:${alias.trait}`);
      expect(seed.description).toBe(getMbtiSourceProfile(alias.type)!.traits![alias.area]!.find(t=>t.id===alias.trait)!.plainKo);
    }
  });
  it.each(MBTI_SOURCE_TYPES)("%s: directional pair data works with all sixteen partners", sourceType => {
    const fixture=requireCompatibilityFixture("deokmin-sodam-love");
    for (const targetType of MBTI_SOURCE_TYPES) {
      const a={...fixture.input.personA,mbti:sourceType}, b={...fixture.input.personB,mbti:targetType};
      const forward=buildCompatibilityMbtiBridge({personA:a,personB:b});
      const reverse=buildCompatibilityMbtiBridge({personA:b,personB:a});
      expect(forward.sharedTraits).toEqual(reverse.sharedTraits);
      expect(forward.frictionRisks).toEqual(reverse.frictionRisks);
      expect(forward.communicationNotes).toEqual([...reverse.communicationNotes].reverse());
      expect(forward.frictionRisks).toContain(getMbtiRelationshipPair(sourceType,targetType)!.friction[0]);
      expect(forward.frictionRisks).toContain(getMbtiRelationshipPair(targetType,sourceType)!.friction[0]);
    }
  });
  it("a type label alone cannot change the score or double-count two source views", () => {
    const packet=buildCompatibilityEvidencePacketFromFixture(requireCompatibilityFixture("deokmin-sodam-love"));
    const scoreInput={sajuBridge:packet.sajuBridge,deepSajuBridge:packet.deepSajuBridge,mbtiBridge:packet.mbtiBridge,
      relationshipType:"love" as const,birthTimeConfidence:{personA:"known" as const,personB:"known" as const}};
    expect(packet.mbtiBridge.evidenceItems.reduce((sum,item)=>sum+item.scoreImpact,0)).toBe(1);
    expect(scoreCompatibility(scoreInput)).toEqual(scoreCompatibility({...scoreInput,mbtiBridge:{...packet.mbtiBridge,pairLabel:"ISFJ + ENFP"}}));
  });
  it("density validation rejects another type's identity and function stack", () => {
    const entries=MBTI_KNOWLEDGE_BASE.map(entry=>entry.type!=="ISFJ"?entry:{...entry,summary:getMbtiKnowledge("ENFP").summary,functionStack:getMbtiKnowledge("ENFP").functionStack});
    const result=validateMbtiKnowledgeDensity(entries);
    expect(result.ok).toBe(false);
    expect(result.errors).toContain("mbti ISFJ identity differs from source.");
    expect(result.errors).toContain("mbti ISFJ function stack differs from source.");
  });
});
