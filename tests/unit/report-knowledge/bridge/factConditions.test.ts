import { describe, expect, it } from "vitest";
import { findFusionRules } from "../../../../src/lib/report-knowledge/knowledgeSelectors";
import { FUSION_KNOWLEDGE_BASE } from "../../../../src/lib/report-knowledge/fusionKnowledgeBase";
import { fusionFactIds } from "../../../../src/lib/report-knowledge/fusionFactContext";
import { SAJU_DAY_PILLAR_KNOWLEDGE } from "../../../../src/lib/report-knowledge/sajuDayPillarKnowledge";
import { SAJU_KNOWLEDGE_BY_ID, FIVE_ELEMENTS } from "../../../../src/lib/report-knowledge/sajuKnowledgeBase";
import { matchFactCondition, interactionKey, hasGroundedInteractionReferences } from "../../../../src/lib/report-knowledge/bridge/factConditions";
import { normalizeBridgeSignals, selectMatchedBridgeHints } from "../../../../src/lib/report-knowledge/bridge/bridgeHintSelection";
import { buildMyeongliMbtiBridgePacket, buildProductBridgeEvidence } from "../../../../src/lib/report-knowledge/bridge";
import { scoreSajuMbtiBridgeEvidence } from "../../../../src/lib/report-knowledge/sajuMbtiBridgeScorer";
import { selectMbtiKnowledge } from "../../../../src/lib/report-knowledge/mbtiKnowledgeSelector";
import type { ComputedSajuFacts } from "../../../../src/lib/report-knowledge/sajuComputedFactsTypes";

const facts: ComputedSajuFacts = {
  dayMaster: "정", dayPillar: "정축", fiveElementCounts: { wood: 1, fire: 2, earth: 3, metal: 1, water: 1 },
  excessiveElements: ["earth"], missingElements: [], tenGodSignals: [{ tenGod: "qi_sha", strength: "present" }],
  specialPatterns: [], sinsal: ["hyeonchim"], gwiin: [],
};
const select = (computedFacts: ComputedSajuFacts = facts) => findFusionRules({ sajuEntryIds: [], mbtiType: "ENTJ", computedFacts });

describe("Fusion exact fact predicates", () => {
  it("permanent P0: Jeongchuk + ENTJ + precision tags cannot select Gapsin", () => {
    const raw = findFusionRules({ mbtiType: "ENTJ", sajuEntryIds: ["sinsal_hyeonchim", "ten_god_qi_sha", "element_earth_excess"] });
    expect(raw.some((r) => r.sajuEntryIds.includes("day_pillar_gapsin"))).toBe(false);
    expect(select().some((r) => r.sajuEntryIds.includes("day_pillar_gapsin"))).toBe(false);
    const positive = select({ ...facts, dayPillar: "갑신", dayMaster: "갑" });
    expect(positive.map((r) => r.id)).toContain("fusion_gapsin_entj_leadership_control");
    expect(findFusionRules({ mbtiType: "ENTJ", sajuEntryIds: ["day_master_gabmok"] }).some((r) => r.id === "fusion_gapsin_entj_leadership_control")).toBe(false);
  });
  it("all 60 pillars cannot select another pillar even with ALL unrelated dictionary tags", () => {
    expect(SAJU_DAY_PILLAR_KNOWLEDGE).toHaveLength(60);
    const others = [...SAJU_KNOWLEDGE_BY_ID.values()].filter((entry) => !["day_pillar", "day_master"].includes(entry.category)).map((e) => e.id);
    for (const pillar of SAJU_DAY_PILLAR_KNOWLEDGE) {
      const rules = findFusionRules({ mbtiType: "ENTJ", sajuEntryIds: [pillar.id, ...others] });
      for (const rule of rules) {
        const requiredPillars = rule.requires.allOf.flat().filter((id) => SAJU_KNOWLEDGE_BY_ID.get(id)?.category === "day_pillar");
        for (const id of requiredPillars) expect(id, `${pillar.id}: ${rule.id}`).toBe(pillar.id);
      }
    }
  });
  it.each(FIVE_ELEMENTS)("%s shortage/excess cannot acquire the opposite state", (element) => {
    for (const missing of [true, false]) {
      const f = { ...facts, fiveElementCounts: { ...facts.fiveElementCounts, [element]: missing ? 0 : 5 }, excessiveElements: missing ? [] : [element], missingElements: missing ? [element] : [] };
      const ids = fusionFactIds([], f);
      expect(ids.has(`element_${element}_missing`)).toBe(missing);
      expect(ids.has(`element_${element}:excess`)).toBe(!missing);
      for (const r of select(f)) expect(matchFactCondition(r.requires, ids)).not.toBeNull();
      if (element === "earth") expect(select(f).some((r) => r.id === "fusion_earth_excess_entj_reality")).toBe(!missing);
    }
  });
  it("presence/weakness/absence do not prove strong wealth or officer facts", () => {
    for (const god of ["pian_cai", "zheng_cai", "qi_sha", "zheng_guan", "shi_shen", "zheng_yin", "bijian"] as const) {
      for (const strength of ["missing", "weak", "present", "strong", "excessive"] as const) {
        const f = { ...facts, tenGodSignals: [{ tenGod: god, strength }] };
        expect(fusionFactIds([], f).has(`ten_god_${god}:strong`)).toBe(["strong", "excessive"].includes(strength));
        if (god === "pian_cai" || god === "zheng_cai") expect(select(f).some((r) => r.id === "fusion_wealth_strong_entj_achievement")).toBe(["strong", "excessive"].includes(strength));
      }
    }
  });
  it("conflicting element states and forged dictionary IDs cannot overrule computed facts", () => {
    expect(fusionFactIds(["element_water", "element_water_missing"]).size).toBe(0);
    const rules = findFusionRules({ mbtiType: "ENTJ", sajuEntryIds: ["day_pillar_gapsin", "sinsal_hongyeom"], computedFacts: facts });
    expect(rules.some((r) => r.id === "fusion_hongyeom_entj_charisma")).toBe(false);
    expect(rules.some((r) => r.id === "fusion_gapsin_entj_leadership_control")).toBe(false);
  });
  it("explicit absent/weak measurements override contradictory structure labels", () => {
    const ids = fusionFactIds([], { ...facts, specialPatterns: ["jaeda_sinyak", "no_resource"], tenGodSignals: [
      { tenGod: "pian_cai", strength: "missing" }, { tenGod: "zheng_cai", strength: "weak" }, { tenGod: "zheng_yin", strength: "weak" },
    ] });
    expect(ids.has("pattern_jaeda_sinyak")).toBe(false);
    expect(ids.has("pattern_no_resource")).toBe(false);
    const conflicting = [{ tenGod: "qi_sha", strength: "missing" }, { tenGod: "qi_sha", strength: "strong" }] as const;
    for (const signals of [conflicting, [...conflicting].reverse()]) expect(fusionFactIds([], { ...facts, tenGodSignals: signals }).has("ten_god_qi_sha:strong")).toBe(false);
  });
  it("removing a feature changes only interactions depending on that feature", () => {
    const before = select(); const after = select({ ...facts, sinsal: [] });
    expect(before.filter((r) => !after.some((a) => a.id === r.id)).every((r) => r.match?.myeongliEvidenceIds.includes("sinsal_hyeonchim"))).toBe(true);
    expect(before.some((r) => r.id === "fusion_hyeonchim_entj_direct_speech")).toBe(true);
    expect(after.some((r) => r.sajuEntryIds.includes("sinsal_hyeonchim"))).toBe(false);
  });
  it.each(["sinsal_hyeonchim", "sinsal_dohwa", "sinsal_hongyeom", "sinsal_yeokma", "nobleman_munchang", "nobleman_cheoneul"])("absent %s cannot acquire a feature-specific rule", (featureId) => {
    for (const type of ["ENTJ", "INTP", "ISFJ", "ENFP"] as const) {
      const rules = findFusionRules({ mbtiType: type, sajuEntryIds: ["element_earth", "ten_god_pian_cai"] });
      expect(rules.every((rule) => !rule.match?.myeongliEvidenceIds.includes(featureId))).toBe(true);
      expect(rules.every((rule) => !rule.requires.allOf.some((group) => group.length === 1 && group[0] === featureId))).toBe(true);
    }
  });
  it("all rules have nonempty explicit AND/OR predicates, never a tag fallback", () => {
    for (const r of FUSION_KNOWLEDGE_BASE) {
      expect(r.requires.allOf.length).toBeGreaterThan(0);
      expect(matchFactCondition(r.requires, new Set())).toBeNull();
    }
    expect(matchFactCondition({ allOf: [["a", "b"], ["c"]], noneOf: ["d"] }, new Set(["a", "c"]))).toEqual(["a", "c"]);
    expect(matchFactCondition({ allOf: [["a"], ["c"]] }, new Set(["a"]))).toBeNull();
  });
});

describe("source-linked Bridge and scene safety", () => {
  it("no signal / unrelated text / wrong kind / missing feature return no hints", () => {
    for (const signals of [[], [{ kind: "fortuneCycle" as const, label: "편재" }], [{ kind: "shinsal" as const, label: "현침살 없음" }], [{ kind: "tenGod" as const, label: "무인성", value: "재성 strong 분석" }]]) {
      const p = buildMyeongliMbtiBridgePacket({ mbtiType: "ENTJ", productContext: "careerMoneyStudy", myeongliSignals: signals });
      expect(p.evidences).toEqual([]);
    }
    expect(normalizeBridgeSignals([{ kind: "tenGod", label: "정관", value: "편재" }])).toEqual([]);
  });
  it("three, thirty, or repeated signals cannot force high intensity or duplicate interactions", () => {
    const signal = { kind: "shinsal" as const, label: "현침살" };
    const build = (n: number) => buildMyeongliMbtiBridgePacket({ mbtiType: "ENTJ", productContext: "careerMoneyStudy", myeongliSignals: Array.from({length:n},()=>signal) });
    expect(build(30)).toEqual(build(1));
    expect(build(3).evidences[0].intensity).not.toBe("high");
    const p = buildProductBridgeEvidence(build(3), "careerMoneyStudy");
    const ids = [...p.primaryEvidence, ...p.supportingEvidence, ...p.cautionEvidence].map((e) => e.evidenceId);
    expect(new Set(ids).size).toBe(ids.length);
  });
  it("agreement/tension/amplification require the declared actual facts", () => {
    const rules = select({ ...facts, missingElements: ["fire"], fiveElementCounts: { ...facts.fiveElementCounts, fire: 0 } });
    for (const type of ["agreement", "tension", "amplification"]) expect(rules.some((r) => r.match?.interactionType === type)).toBe(true);
    for (const r of rules) expect(r.match?.myeongliEvidenceIds.length).toBeGreaterThan(0);
  });
  it("compensation uses ENFP recurring-income source and actual Zheng Cai, not an invented weakness", () => {
    const matches = selectMatchedBridgeHints({ mbtiType: "ENFP", productContext: "careerMoneyStudy", factIds: new Set(["ten_god_zheng_cai"]) });
    const compensation = matches.find((m) => m.interaction.interactionType === "compensation");
    expect(compensation?.interaction.mbtiEvidenceIds).toContain("mbti:ENFP:traits:money:recurring_income_anchor");
    expect(compensation?.interaction.myeongliEvidenceIds).toEqual(["ten_god_zheng_cai"]);
    expect(selectMatchedBridgeHints({ mbtiType: "ENFP", productContext: "careerMoneyStudy", factIds: new Set() })).toEqual([]);
  });
  it("dedup key ignores order but preserves context and direction of meaning", () => {
    const traces = select().flatMap((r) => r.match ? [r.match] : []);
    const a = traces[0]; expect(a).toBeDefined();
    expect(interactionKey(a)).toBe(interactionKey({ ...a, myeongliEvidenceIds: [...a.myeongliEvidenceIds].reverse() }));
    expect(interactionKey(a)).not.toBe(interactionKey({ ...a, contexts: ["other"] }));
  });
  it("reference validator rejects a missing feature or another type's trait", () => {
    const trace = select()[0].match!;
    const facts = new Set(trace.myeongliEvidenceIds);
    const traits = new Set(trace.mbtiEvidenceIds);
    expect(hasGroundedInteractionReferences(trace, facts, traits)).toBe(true);
    expect(hasGroundedInteractionReferences(trace, new Set(), traits)).toBe(false);
    expect(hasGroundedInteractionReferences({ ...trace, mbtiEvidenceIds: ["mbti:INTP:foreign"] }, facts, traits)).toBe(false);
  });
  it("scene never substitutes an unrelated or another type's trait", () => {
    const full = selectMbtiKnowledge({ mbti: "INTP", contexts: [], productType: "comprehensive" })!;
    const input = { productType: "comprehensive" as const, selectedMbtiKnowledge: full, computedFeatureIds: ["structure_no_resource"] };
    expect(scoreSajuMbtiBridgeEvidence(input)).toHaveLength(1);
    expect(scoreSajuMbtiBridgeEvidence({ ...input, selectedMbtiKnowledge: { ...full, selectedTraits: full.selectedTraits.filter((t) => t.id !== "mbti_intp_core_identity_2") } })).toEqual([]);
    expect(scoreSajuMbtiBridgeEvidence({ ...input, computedFeatureIds: [] })).toEqual([]);
  });
});
