import { readFileSync, writeFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { SHINSAL_METADATA, SHINSAL_RULES } from "../../../src/lib/saju/shinsalConstants";
import { detectShinsal } from "../../../src/lib/saju/shinsal";
import { SAJU_FEATURE_TAXONOMY } from "../../../src/lib/report-knowledge/sajuFeatureTaxonomy";
import { SAJU_KNOWLEDGE_BASE } from "../../../src/lib/report-knowledge/sajuKnowledgeBase";
import { SAJU_DAY_PILLAR_FEATURES } from "../../../src/lib/report-knowledge/sajuDayPillarKnowledge";
import { extractComputedSajuFeatures } from "../../../src/lib/report-knowledge/sajuComputedFeatureExtractor";
import { relationPairs } from "../../../src/lib/report-knowledge/sajuFeatureExtractionRules";
import { getMbtiSourceProfile, MBTI_SOURCE_TYPES, MBTI_TRAIT_AREAS, MBTI_REPORT_USE_CASE_KEYS } from "../../../src/lib/report-knowledge/mbti/sourceRuntimeAdapter";
import { BRIDGE_SCENE_RULES } from "../../../src/lib/report-knowledge/bridge/interactionSceneRules";
import { FUSION_KNOWLEDGE_BASE } from "../../../src/lib/report-knowledge/fusionKnowledgeBase";
import { ATOMIC_REGISTRY } from "../../../src/lib/interpretation-v3/atomicRegistry";
import { COMPOUND_RULES, TEN_GOD_PAIR_REVIEW } from "../../../src/lib/interpretation-v3/compounds";
import { EXTRACTOR_DIRECT_IDS, EXTRACTOR_SUPPLIED_IDS } from "../../../src/lib/interpretation-v3/featureCapabilities";
import type { SajuKnowledgeEntry, SajuKnowledgeTopic } from "../../../src/lib/report-knowledge/sajuKnowledgeTypes";

const baseSha = "5f71a7d0ff8ac4481e09a3f90049448035eb2aed";
const topicForDomain = {
  personality: "personality", strengths: "strengths", weaknesses: "weaknesses", moneySuccess: "money_asset",
  career: "work_career", study: "study_growth", love: "love_relationship", relationships: "human_relations",
} as const satisfies Record<string, SajuKnowledgeTopic>;
const strings = (value: unknown): string[] => typeof value === "string" ? [value] : Array.isArray(value)
  ? value.flatMap(strings) : value && typeof value === "object" ? Object.values(value).flatMap(strings) : [];
const count = (value: unknown) => new Set(strings(value).filter(s => s.trim())).size;
const generic = (s: string) => /은 이 주제에서|를 잘 쓰면 장점이 선명|가 과해지면 긴장이나 거리감|를 생활 속 기준으로 조절/.test(s);

function featureRow(id: string) {
  const f = SAJU_FEATURE_TAXONOMY.find(f => f.id === id);
  const k: SajuKnowledgeEntry | undefined = SAJU_KNOWLEDGE_BASE.find(k => k.id === id);
  const a = ATOMIC_REGISTRY.find(a => a.id === id);
  const domainMaterial = Object.fromEntries(Object.entries(topicForDomain).map(([domain, topic]) => {
    const text = strings(k?.topicInterpretations?.[topic]);
    return [domain, { strings: count(text), templatedStrings: text.filter(generic).length }];
  }));
  return {
    id, label: f?.labelKo ?? k?.labelKo ?? a?.name, category: f?.category ?? k?.category ?? "native-shinsal",
    sourceRefs: a?.sourceRefs ?? [],
    extractor: EXTRACTOR_DIRECT_IDS.includes(id) ? "direct" : EXTRACTOR_SUPPLIED_IDS.includes(id) ? "requires-upstream-fact" : "not-listed-in-extractor",
    atomicReadiness: a?.readiness ?? null, image: f?.symbolicImage ?? k?.coreImageKo ?? null,
    taxonomyTopics: f?.topics ?? [], sharedSceneSeeds: f?.sceneSeeds.length ?? 0,
    domainMaterial,
    hints: { career: count(k?.careerHints), money: count(k?.moneyHints), dayPillar: count(k?.dayPillarHints),
      pairMatching: count(k?.matchingHints), familyNotMarriage: count(k?.topicInterpretations?.family_independence),
      environmentNotTimedFortune: count(k?.topicInterpretations?.environment_luck) },
    // No dedicated marriage/pair/period slots in the atomic schema. Product
    // composers can supply them; a zero here does NOT mean an empty report.
    dedicatedMarriage: false, dedicatedCompatibility: false, dedicatedTimedFortune: false,
  };
}

function buildAudit() {
  const featureIds = [...new Set([...SAJU_FEATURE_TAXONOMY.map(f => f.id), ...SAJU_KNOWLEDGE_BASE.map(k => k.id), ...ATOMIC_REGISTRY.map(a => a.id)])].sort();
  const mbti = MBTI_SOURCE_TYPES.map(type => {
    const p = getMbtiSourceProfile(type)!;
    const areas = Object.fromEntries(MBTI_TRAIT_AREAS.map(area => {
      const traits = p.traits?.[area] ?? [];
      return [area, { count: traits.length, direct: traits.filter(t => t.sourceCoverage === "direct").length,
        inferred: traits.filter(t => t.sourceCoverage === "inferred").length,
        missingFields: traits.flatMap(t => ["id", "label", "plainKo", "strongLine", "positiveUse", "risk", "matchingMyeongliSignals", "productDomains", "sourceCoverage"].filter(key => !count(t[key])).map(key => `${t.id}:${key}`)),
        ids: traits.map(t => t.id) }];
    }));
    return { type, source: `docs/product/mbti/source/${type}.json`, axes: p.preferenceAxes, functionStack: p.functionStack,
      summaryFields: Object.keys(p.summary ?? {}), closeKeywords: count(p.closeKeywords), farKeywords: count(p.farKeywords),
      areas, pairs: p.relationshipHints?.notablePairs?.map(pair => ({ withType: pair.withType, sourceCoverage: pair.sourceCoverage,
        complete: [pair.sharedGround, pair.friction, pair.positiveInfluence, pair.lovePattern, pair.marriagePattern, pair.repairStrategy, pair.reportLine].every(value => count(value) > 0) })) ?? [],
      bridgeHints: p.myeongliBridgeHints?.length ?? 0,
      useCases: Object.fromEntries(MBTI_REPORT_USE_CASE_KEYS.map(key => [key, p.reportUseCases?.[key]?.length ?? 0])),
      sceneRules: BRIDGE_SCENE_RULES.filter(r => r.mbti === type).map(r => ({ id: r.id, type: r.type, contexts: r.contexts, requires: r.requires, traits: r.traits })),
    };
  });
  return {
    version: "v4-phase-0-source-audit-1", baseSha,
    interpretation: "Counts measure source slots, not accuracy or narrative quality. Taxonomy is not proof of calculation; direct means extractor capability, not verified classical strength. Product copy remains separately reviewed in ENGINE_AND_KNOWLEDGE_AUDIT.md.",
    totals: { taxonomy: SAJU_FEATURE_TAXONOMY.length, knowledge: SAJU_KNOWLEDGE_BASE.length, atomic: ATOMIC_REGISTRY.length,
      reviewedAtomic: ATOMIC_REGISTRY.filter(a => a.readiness === "reviewed").length,
      dayPillars: SAJU_DAY_PILLAR_FEATURES.length, nativeCodes: Object.keys(SHINSAL_METADATA).length, nativeRules: SHINSAL_RULES.length,
      mbtiTypes: mbti.length, mbtiTraits: mbti.reduce((sum, p) => sum + Object.values(p.areas).reduce((n, a) => n + a.count, 0), 0),
      sceneRules: BRIDGE_SCENE_RULES.length, fusionKnowledge: FUSION_KNOWLEDGE_BASE.length,
      compoundRules: COMPOUND_RULES.length, tenGodPairReviews: TEN_GOD_PAIR_REVIEW.length },
    nativeRules: SHINSAL_RULES.map(rule => ({ code: rule.code, label: SHINSAL_METADATA[rule.code].labelKo, kind: rule.source.kind,
      rule: rule.source, monthlyTransit: !["BRANCH_ONLY", "STEM_BRANCH_PAIR"].includes(rule.source.kind) })),
    features: featureIds.map(featureRow), mbti,
    fusionKnowledge: FUSION_KNOWLEDGE_BASE.map(r => ({ id: r.id, kind: r.kind, interactionType: r.interactionType, topic: r.topic,
      mbtiTypes: r.mbtiTypes ?? [], requires: r.requires, availability: r.availability ?? "predicate-required" })),
    compounds: COMPOUND_RULES.map(r => ({ id: r.id, allOf: r.allOf, domains: r.domains, kind: r.kind })),
  };
}

describe("V4 Phase 0 source audit (no production engine changes)", () => {
  it("reproduces the complete machine-readable inventory from current registries", () => {
    const audit = buildAudit();
    expect(audit.totals.dayPillars).toBe(60);
    expect(new Set(audit.features.map(f => f.id)).size).toBe(audit.features.length);
    if (process.env.V4_AUDIT_EXPORT) {
      // Explicit local audit artifact only; normal tests never write to docs.
      expect(process.env.V4_AUDIT_EXPORT).toBe("/tmp/gyeol-v4-audit-data.json");
      writeFileSync(process.env.V4_AUDIT_EXPORT, JSON.stringify(audit, null, 2) + "\n");
    } else {
      expect(audit).toEqual(JSON.parse(readFileSync("docs/product/v4/AUDIT_DATA.json", "utf8")));
    }
  });
  it.each(MBTI_SOURCE_TYPES)("%s has valid axes, stack, all domains, full pair and use-case data", type => {
    const p = getMbtiSourceProfile(type)!;
    expect(Object.values(p.preferenceAxes ?? {}).join("")).toBe(type);
    expect(Object.keys(p.functionStack ?? {})).toHaveLength(4);
    expect(Object.keys(p.summary ?? {})).toEqual(["identity", "strength", "risk", "growthStrategy"]);
    expect(count(p.closeKeywords)).toBeGreaterThan(5);
    expect(count(p.farKeywords)).toBeGreaterThan(5);
    for (const area of MBTI_TRAIT_AREAS) {
      const traits = p.traits?.[area] ?? [];
      expect(traits.length).toBeGreaterThan(0);
      expect(new Set(traits.map(t => t.id)).size).toBe(traits.length);
      for (const trait of traits) for (const key of ["id", "label", "plainKo", "strongLine", "positiveUse", "risk", "matchingMyeongliSignals", "productDomains", "sourceCoverage"])
        expect(count(trait[key]), `${type}:${area}:${trait.id}:${key}`).toBeGreaterThan(0);
    }
    expect(new Set(p.relationshipHints?.notablePairs?.map(p => p.withType)).size).toBe(16);
    for (const key of MBTI_REPORT_USE_CASE_KEYS) expect(p.reportUseCases?.[key]?.length).toBeGreaterThan(0);
  });
  it.each(relationPairs.gwimun)("actually calculates gwimun from %s/%s", (a, b) => {
    const result = extractComputedSajuFeatures({ earthlyBranches: [a, b] });
    expect(result.featureIds).toContain("sinsal_gwimun");
    expect(result.details).toContainEqual({ featureId: "sinsal_gwimun", source: "branch", matchedBy: "gwimun:pair", confidence: "computed" });
  });
  it("does not infer gwimun without its branch pair", () => {
    expect(extractComputedSajuFeatures({ earthlyBranches: ["자", "축"] }).featureIds).not.toContain("sinsal_gwimun");
  });
  it("records the unresolved same-anchor mangsin rule conflict without blessing either rule", () => {
    // Phase 0 characterization only. A later canonical-rule review must update
    // this finding explicitly; silently merging the two labels loses evidence.
    const detections = detectShinsal({
      year: { stem: "乙", branch: "亥" },
      month: { stem: "甲", branch: "申" },
      day: { stem: "丙", branch: "寅" },
    });
    expect(detections.filter(d => d.code === "MANGSINSAL").map(d => d.positions)).toEqual([["month"]]);
    expect(detections.filter(d => d.code === "TWELVE_MANGSINSAL").map(d => d.positions)).toEqual([["day"]]);
  });
  it("every authored bridge references real source traits", () => {
    for (const r of BRIDGE_SCENE_RULES) {
      expect(r.requires.allOf.length).toBeGreaterThan(0);
      for (const [area, id] of r.traits) expect(getMbtiSourceProfile(r.mbti)?.traits?.[area]?.some(t => t.id === id), `${r.id}:${id}`).toBe(true);
    }
  });
});
