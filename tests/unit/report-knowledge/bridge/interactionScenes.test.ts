import * as mbtiSource from "../../../../src/lib/report-knowledge/mbti/sourceRuntimeAdapter";
import { describe, expect, it, vi } from "vitest";
import { BRIDGE_SCENE_RULES } from "../../../../src/lib/report-knowledge/bridge/interactionSceneRules";
import { BRIDGE_SCENE_CONTEXTS, buildBridgeInteractionScenes, formatBridgeScene, formatProductBridgeScenes, sceneCoversInteraction } from "../../../../src/lib/report-knowledge/bridge/interactionScenes";
import { getMbtiSourceProfile, MBTI_SOURCE_TYPES } from "../../../../src/lib/report-knowledge/mbti/sourceRuntimeAdapter";
import { buildMyeongliMbtiBridgePacket, buildProductBridgeEvidence } from "../../../../src/lib/report-knowledge/bridge";
import { interactionKey } from "../../../../src/lib/report-knowledge/bridge/factConditions";
import type { BridgeProductContext } from "../../../../src/lib/report-knowledge/bridge/types";

const scenes = (mbtiType: string, ids: readonly string[], productContext: BridgeProductContext = "general") =>
  buildBridgeInteractionScenes({ mbtiType, factIds: new Set(ids), productContext });

describe("Bridge v2 reviewed scenes", () => {
  it.each(BRIDGE_SCENE_RULES)("$id needs every declared fact and real source trait", rule => {
    const ids = rule.requires.allOf.map(group => group[0]);
    const result = scenes(rule.mbti, ids).find(scene => scene.ruleId === rule.id);
    expect(result).toBeDefined(); if (!result) return;
    expect(result.myeongliEvidenceIds.every(id => ids.includes(id))).toBe(true);
    for (const basis of result.mbtiBasis) {
      const trait = getMbtiSourceProfile(rule.mbti)?.traits?.[basis.area]?.find(t => t.id === basis.traitId);
      expect(trait?.plainKo).toBe(basis.reading);
      expect(result.mbtiEvidenceIds).toContain(basis.evidenceId);
    }
    for (const id of ids) expect(scenes(rule.mbti, ids.filter(value => value !== id)).some(s => s.ruleId === rule.id)).toBe(false);
    expect(formatBridgeScene(result)).not.toMatch(/fallback|placeholder|validator|writer|candidate|internal|mock|N번째|반복 압박/iu);
    expect(result.scene.length).toBeGreaterThan(40);
    expect(result.practice).not.toBe(result.risk);
    expect(scenes(rule.mbti, ids)).toEqual(scenes(rule.mbti, ids));
  });
  it("covers all 16 types and six reviewed types of interaction without inventing no-input scenes", () => {
    expect(new Set(BRIDGE_SCENE_RULES.map(r => r.mbti))).toEqual(new Set(MBTI_SOURCE_TYPES));
    expect(new Set(BRIDGE_SCENE_RULES.map(r => r.type))).toEqual(new Set(["agreement", "tension", "expression", "compensation", "amplification", "context-switch"]));
    expect(scenes("", ["ten_god_zheng_cai", "sinsal_dohwa"])).toEqual([]);
    expect(scenes("ISFJ", [])).toEqual([]);
    expect(scenes("ENTJ", ["분석", "돈", "관계", "MBTI"])).toEqual([]);
  });
  it("tension needs both sides: change/reliability is not attributed to every J type", () => {
    const a = scenes("ISTJ", ["sinsal_yeokma"]);
    expect(a.find(s => s.ruleId === "istj-change-record")?.interactionType).toBe("tension");
    expect(a[0].mbtiBasis[0].traitId).toBe("past_data_decision");
    expect(scenes("ESTJ", ["sinsal_yeokma"])).toEqual([]);
  });
  it("context switch preserves two actual domain traits and concrete scenes", () => {
    const scene = scenes("ENTJ", ["ten_god_zheng_guan"]).find(s => s.ruleId === "entj-work-home-switch")!;
    expect(scene.mbtiBasis.map(b => b.area)).toEqual(["career", "love"]);
    expect(scene.scene).toContain("회사"); expect(scene.scene).toContain("집");
    expect(scene.interactionType).toBe("context-switch");
  });
  it("only selects excessive earth / missing water with their exact state", () => {
    expect(scenes("ESTJ", ["element_earth"]).some(s => s.ruleId === "estj-household-space")).toBe(false);
    expect(scenes("ESTJ", ["element_earth:excess"]).some(s => s.ruleId === "estj-household-space")).toBe(true);
    expect(scenes("ENTJ", ["element_water"]).some(s => s.ruleId === "entj-water-pause")).toBe(false);
    expect(scenes("ENTJ", ["element_water_missing"]).some(s => s.ruleId === "entj-water-pause")).toBe(true);
    expect(scenes("ENTJ", ["element_water_missing", "element_water"]).some(s => s.ruleId === "entj-water-pause")).toBe(false);
    expect(scenes("ESTJ", ["element_earth:excess", "element_earth_missing"]).some(s => s.ruleId === "estj-household-space")).toBe(false);
  });
  it("removing one fact preserves an unrelated interaction byte for byte", () => {
    const before = scenes("INTJ", ["ten_god_pian_yin", "sinsal_hongyeom"]);
    const after = scenes("INTJ", ["ten_god_pian_yin"]);
    expect(after).toEqual(before.filter(scene => scene.ruleId !== "intj-affection-contrast"));
  });
  it("missing source trait fails closed, with no generic replacement", () => {
    const profile = getMbtiSourceProfile("ISFJ")!;
    const spy = vi.spyOn(mbtiSource, "getMbtiSourceProfile").mockReturnValue({ ...profile, traits: {} });
    try { expect(scenes("ISFJ", ["ten_god_zheng_yin", "ten_god_qi_sha"])).toEqual([]); }
    finally { spy.mockRestore(); }
  });
  it("routes scenes by product context; flow scenes are explicitly not natal personality claims", () => {
    const ids = BRIDGE_SCENE_RULES.flatMap(r => r.requires.allOf.flat());
    for (const productContext of Object.keys(BRIDGE_SCENE_CONTEXTS) as BridgeProductContext[]) for (const type of MBTI_SOURCE_TYPES) {
      const found = scenes(type, ids, productContext);
      for (const scene of found) expect(scene.contexts.some(c => BRIDGE_SCENE_CONTEXTS[productContext].includes(c as never))).toBe(true);
      expect(new Set(found.map(interactionKey)).size).toBe(found.length);
    }
    const packet = buildMyeongliMbtiBridgePacket({ mbtiType: "INTP", productContext: "daeun", myeongliSignals: [{ kind: "tenGod", label: "식신" }] });
    expect(packet.evidences[0].scenes?.[0].factScope).toBe("fortune-flow");
    expect(formatProductBridgeScenes(buildProductBridgeEvidence(packet, "daeun"))).toContain("선택한 운의 신호");
    expect(scenes("INTJ", ["sinsal_hongyeom"], "careerMoneyStudy")).toEqual([]);
  });
  it("dedup only removes a covered fact/trait/context, never unrelated evidence", () => {
    const scene = scenes("ISTJ", ["ten_god_zheng_guan"])[0];
    expect(sceneCoversInteraction(scene, { ...scene, contexts: ["love_relationship"] })).toBe(true);
    expect(sceneCoversInteraction(scene, { ...scene, contexts: ["money_asset"] })).toBe(false);
    expect(sceneCoversInteraction(scene, { ...scene, interactionType: "tension" })).toBe(false);
    expect(sceneCoversInteraction(scene, { ...scene, myeongliEvidenceIds: ["sinsal_dohwa"] })).toBe(false);
    expect(sceneCoversInteraction(scene, { ...scene, mbtiEvidenceIds: ["mbti:ENTJ:traits:love:planned_intense_romance"] })).toBe(false);
    const packet = buildMyeongliMbtiBridgePacket({ mbtiType: "ISTJ", productContext: "loveMarriageChild", myeongliSignals: [{ kind: "tenGod", label: "정관" }] });
    for (const evidence of packet.evidences) for (const s of evidence.scenes ?? []) {
      expect(evidence.interactions?.filter(i => i.interactionId === s.interactionId)).toHaveLength(1);
      expect(evidence.interactions?.filter(i => i.interactionId !== s.interactionId && sceneCoversInteraction(s, i))).toEqual([]);
    }
  });
});
