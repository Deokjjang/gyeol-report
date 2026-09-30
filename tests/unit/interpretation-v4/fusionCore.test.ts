import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { calculateSaju } from "../../../src/lib/saju/calculateSaju";
import { getMbtiSourceProfile, MBTI_SOURCE_TYPES } from "../../../src/lib/report-knowledge/mbti/sourceRuntimeAdapter";
import { SAJU_KNOWLEDGE_BASE } from "../../../src/lib/report-knowledge/sajuKnowledgeBase";
import { buildV4Evidence, evaluateEvidence } from "../../../src/lib/interpretation-v4/evidencePolicy";
import { buildMaterialRegistry, canonicalV4Feature, MATERIAL_BY_FEATURE, SEMANTIC_MEANINGS } from "../../../src/lib/interpretation-v4/materialRegistry";
import { FORTUNE_RULES, FUSION_RULES, semanticConnection } from "../../../src/lib/interpretation-v4/fusionRules";
import { buildFusionCore, interpretFusion } from "../../../src/lib/interpretation-v4/fusion";
import { V4_DOMAINS, type Observation } from "../../../src/lib/interpretation-v4/types";

// Explicit unit observations, not fabricated customer report text. End-to-end
// calculation fixtures below use calculateSaju and the actual canonical table.
function fact(feature: string, change: Partial<Observation> = {}): Observation {
  const god = feature.startsWith("ten_god_"), gap = feature === "distribution:output-low";
  return { id: `person:natal:${feature}`, feature, subject: "person", scope: "natal", certainty: "confirmed",
    method: gap ? "weighted-output-gap" : god ? "canonical-calculation" : "supported-derivation",
    substantial: true, completeChart: true, ...(god ? { weight: 1 } : gap ? { weight: 0 } : {}),
    sourceRefs: [`fixture:existing-rule:${feature}`], lineage: [`person:natal:${canonicalV4Feature(feature)}`], ...change };
}
const run = (features: readonly Observation[], mbti: string | null = "ENTJ") => interpretFusion({ observations: features, mbti });
const calculate = (birthDate = "1996-12-06", birthTime = "09:30") => calculateSaju({
  birthDate, birthTime, birthTimeUnknown: false, calendarType: "SOLAR", gender: "MALE", timezone: "Asia/Seoul",
});
const fortuneFeatures = ["ten_god_pian_cai", "ten_god_qi_sha", "twelve_sinsal_jangseong", "twelve_sinsal_banan"];
const allMajor = Object.keys(SEMANTIC_MEANINGS).map(id => fact(id));

describe("V4 Phase 1 evidence boundary", () => {
  it.each(["structure_jaeda_sinyak", "pattern_jaeda_sinyak", "structure:WEAK_DAYMASTER_WITH_STRONG_WEALTH", "structure_siksang_saengjae", "structure_salin_sangsaeng", "structure_gwansal_mixed", "banghap"])("suppresses unsupported %s, even marked substantial", feature => {
    const d = evaluateEvidence(fact(feature));
    expect(d.status).toBe("unsupported"); expect(d.usable).toBe(false);
    expect(run([fact(feature)]).fusions).toEqual([]);
    expect(run([fact(feature)]).fortuneComposites).toEqual([]);
  });
  it.each(["gwiin_mungok", "gwiin_bokseong", "gwiin_cheoneuiseong"])("does not turn DB-only %s into a fact", feature => {
    expect(evaluateEvidence(fact(feature)).status).toBe("db-only");
    expect(run([fact(feature)]).myeongli).toEqual([]);
  });
  it.each(["shinsal:MANGSINSAL", "shinsal:TWELVE_MANGSINSAL", "twelve_sinsal_mangsin", "twelve_sinsal_mangsin:day-reference", "sinsal_mangsin"])("quarantines mangsin %s", feature => {
    const d = evaluateEvidence(fact(feature));
    expect(d.status).toBe("ambiguous/conflicted"); expect(d.reasons).toContain("MANGSIN_CANONICAL_RULE_CONFLICT");
    expect(run([fact(feature)]).fusions).toEqual([]);
  });
  it("cannot conceal a mangsin source behind another label", () => {
    expect(evaluateEvidence(fact("sinsal_hyeonchim", { sourceRefs: ["shinsal:MANGSINSAL"] })).usable).toBe(false);
  });
  it.each([0.3, 0.6, 1, 1.3, 2])("does not confuse fractional weight %s with absent/excessive", weight => {
    const d = evaluateEvidence(fact("ten_god_pian_cai", { weight }));
    expect(d.status).toBe("confirmed/calculated");
    expect(d.strength).toBe(weight < 0.6 ? "weak" : "strong");
    expect(run([fact("ten_god_pian_cai", { weight })]).fusions.length).toBe(weight < 0.6 ? 0 : 1);
  });
  it.each([0, -1, NaN, Infinity])("rejects invalid/non-present ten-god weight %s", weight => {
    expect(evaluateEvidence(fact("ten_god_pian_cai", { weight })).usable).toBe(false);
  });
  it("never promotes supporting hidden stems without substantial support", () => {
    expect(evaluateEvidence(fact("ten_god_pian_cai", { weight: 0.8, substantial: false })).strength).toBe("weak");
  });
  it.each([
    { certainty: "conditional" as const }, { certainty: "weak" as const }, { sourceRefs: [] }, { lineage: [] },
    { method: "supplied" as const }, { scope: "monthly" as const, period: "2026-09" },
  ])("fails closed for uncertain/unproven/out-of-scope observations: %j", change => {
    expect(run([fact("sinsal_hyeonchim", change)]).fusions).toEqual([]);
  });
  it("keeps known derived gwimun available", () => {
    const d = evaluateEvidence(fact("sinsal_gwimun"));
    expect(d.status).toBe("derived-but-supported"); expect(d.usable).toBe(true);
    expect(run([fact("sinsal_gwimun")], "INTP").fusions[0].ruleId).toBe("intp-inquiry");
  });
  it("blocks low expression if time is unknown, weights are high, or the label was merely supplied", () => {
    for (const change of [{ completeChart: false }, { weight: 0.6 }, { method: "supplied" as const }, { certainty: "conditional" as const }]) {
      expect(run([fact("distribution:output-low", change)], "ENFP").fusions).toEqual([]);
    }
  });
  it("quarantines contradictory weights and low-output versus present-output evidence", () => {
    const a = fact("ten_god_pian_cai");
    expect(run([a, { ...a, id: "other-adapter", weight: 2 }]).fusions).toEqual([]);
    const r = run([fact("distribution:output-low"), fact("ten_god_shi_shen")], "ENFP");
    expect(r.fusions.some(f => f.kind === "complement")).toBe(false);
    expect(r.decisions.find(d => d.evidence.feature === "distribution:output-low")?.reasons).toContain("OUTPUT_GAP_CONTRADICTS_PRESENT_EVIDENCE");
  });
});

describe("V4 reviewed interpretation and fortune", () => {
  it("ENTJ + wealth/officer/needle produce three distinct overlap interpretations", () => {
    const r = run(["ten_god_pian_cai", "ten_god_qi_sha", "sinsal_hyeonchim"].map(f => fact(f)));
    expect(r.fusions.map(f => f.ruleId).sort()).toEqual(["entj-needle", "entj-pressure", "entj-wealth"]);
    for (const f of r.fusions) {
      expect(f.kind).toBe("overlap"); expect(f.strength).toBe("strong");
      expect(f.myeongliEvidence).toHaveLength(1); expect(f.mbtiEvidence.traitId).toBeTruthy();
      expect(f.sharedTheme).toBeTruthy(); expect(f.insightSeed).toBeTruthy(); expect(f.provenanceRefs.length).toBeGreaterThan(3);
    }
    expect(r.fusions.find(f => f.ruleId === "entj-needle")?.insightSeed).toContain("수정안");
  });
  it("ENFP expression complements a confirmed low-output distribution without upgrading natal strength", () => {
    const r = run([fact("distribution:output-low")], "ENFP");
    expect(r.fusions).toHaveLength(1);
    expect(r.fusions[0]).toMatchObject({ kind: "complement", strength: "supporting", ruleId: "enfp-expression" });
    expect(r.fusions[0].insightSeed).toContain("표정과 말");
    expect(r.fortuneComposites).toEqual([]);
  });
  it("deep solitude and extroverted behavior form a contrast, not a forced overlap", () => {
    const r = run([fact("twelve_sinsal_hwagae")], "ENFP");
    expect(r.fusions[0]).toMatchObject({ kind: "contrast", ruleId: "enfp-alone" });
    expect(r.fusions[0].insightSeed).toContain("모임");
    expect(run([fact("twelve_sinsal_hwagae"), fact("ten_god_pian_yin", { weight: 0.3 })], "ENFP").fusions.map(f => f.kind)).toEqual(["contrast"]);
  });
  it("unknown MBTI preserves standalone myeongli and fortune but creates no fusion", () => {
    for (const mbti of [null, "", "모름", "XXXX"]) {
      const r = run(fortuneFeatures.map(f => fact(f)), mbti);
      expect(r.fusions).toEqual([]); expect(r.myeongli.length).toBeGreaterThan(0);
      expect(r.fortuneComposites.some(c => c.ruleId === "wealth-and-name")).toBe(true);
      expect(Object.values(r.coverage.domains).every(c => c.state === "unknown-mbti")).toBe(true);
    }
  });
  it("same chart / different MBTI changes the actual behavior seed", () => {
    const facts = [fact("sinsal_hyeonchim")];
    const results = ["ENTJ", "ISTJ", "ESTP", "INFP"].map(type => run(facts, type).fusions);
    expect(new Set(results.map(fs => fs[0].insightSeed)).size).toBe(4);
    expect(new Set(results.map(fs => fs[0].mbtiEvidence.traitId)).size).toBe(4);
  });
  it("same MBTI / different chart changes theme and seed", () => {
    const a = run([fact("sinsal_hyeonchim")]), b = run([fact("ten_god_pian_cai")]);
    expect(a.fusions[0].sharedTheme).not.toBe(b.fusions[0].sharedTheme);
    expect(a.fusions[0].insightSeed).not.toBe(b.fusions[0].insightSeed);
  });
  it("preserves inferred money and marriage provenance, capped below strong", () => {
    for (const [type, feature, domain] of [["INTJ", "ten_god_zheng_cai", "money"], ["ISTJ", "ten_god_zheng_cai", "marriage"]] as const) {
      const f = interpretFusion({ observations: [fact(feature)], mbti: type, domains: [domain] }).fusions[0];
      expect(f).toMatchObject({ strength: "supporting", confidence: "derived", mbtiEvidence: { sourceCoverage: "inferred", provenance: "derived" } });
    }
  });
  it.each(FORTUNE_RULES)("requires every independent strong group for $id", rule => {
    const inputs = rule.allOf.map(group => fact(group[0]));
    expect(run(inputs).fortuneComposites.some(c => c.ruleId === rule.id)).toBe(true);
    for (let index = 0; index < inputs.length; index++) {
      expect(run(inputs.filter((_, i) => i !== index)).fortuneComposites.some(c => c.ruleId === rule.id)).toBe(false);
      expect(run(inputs.map((f, i) => i === index ? { ...f, substantial: false } : f)).fortuneComposites.some(c => c.ruleId === rule.id)).toBe(false);
    }
    const shared = inputs.map(f => ({ ...f, lineage: ["same-underlying-fact"] }));
    expect(run(shared).fortuneComposites.some(c => c.ruleId === rule.id)).toBe(false);
  });
  it("emits the direct wealth/name seed only with all four real supports", () => {
    const r = run(fortuneFeatures.map(f => fact(f)));
    expect(r.fortuneComposites.find(c => c.ruleId === "wealth-and-name")?.directCopySeed).toBe("돈과 이름을 같이 노려볼 만한 힘이 있습니다.");
    expect(r.fortuneComposites.find(c => c.ruleId === "recognized-place")?.directCopySeed).toContain("앞에 서고 인정받는");
  });
  it("does not mix subjects, alias votes, or natal and transit", () => {
    const inputs = fortuneFeatures.map(f => fact(f));
    expect(run(inputs.map((f, i) => i === 0 ? { ...f, subject: "personB" } : f)).fortuneComposites.some(c => c.ruleId === "wealth-and-name")).toBe(false);
    expect(run(inputs.map((f, i) => i === 0 ? { ...f, scope: "annual", period: "2027" } : f)).fortuneComposites.some(c => c.ruleId === "wealth-and-name")).toBe(false);
    const duplicates = [fact("gwiin_cheoneul"), fact("nobleman_cheoneul"), fact("shinsal:CHEON_EUL_GWIIN")];
    expect(run(duplicates, "ENFJ").fusions).toHaveLength(1);
    expect(run(duplicates).fortuneComposites).toEqual([]);
  });
  it("is invariant to observation order and does not mutate input", () => {
    const before = JSON.stringify(allMajor);
    expect(run(allMajor)).toEqual(run([...allMajor].reverse()));
    expect(JSON.stringify(allMajor)).toBe(before);
  });
  it("unrelated pairing false positives are zero across every type and mapped feature", () => {
    for (const type of MBTI_SOURCE_TYPES) for (const observation of allMajor) {
      const rules = FUSION_RULES.filter(r => r.type === type && r.features.includes(observation.feature));
      if (!rules.length) expect(run([observation], type).fusions, `${type}:${observation.feature}`).toEqual([]);
    }
  });
});

describe("V4 sources, coverage and actual calculation integration", () => {
  it("normalizes meanings with source references and unbound evidence strength", () => {
    const registry = buildMaterialRegistry();
    expect(new Set(registry.map(m => m.feature)).size).toBe(registry.length);
    for (const id of Object.keys(SEMANTIC_MEANINGS)) {
      const m = MATERIAL_BY_FEATURE.get(id)!;
      expect(m).toBeDefined(); expect(m.semanticTags.length).toBeGreaterThan(0);
      expect(m.positiveMeaning).toBeTruthy(); expect(m.shadowMeaning).toBeTruthy(); expect(m.imagery).toBeTruthy();
      expect(m.evidenceStrength).toBe("none"); expect(m.sourceRefs.length).toBeGreaterThan(0);
    }
    expect(registry.filter(m => m.feature.startsWith("day_pillar_"))).toHaveLength(60);
    for (const source of SAJU_KNOWLEDGE_BASE) expect(MATERIAL_BY_FEATURE.get(canonicalV4Feature(source.id))?.sourceRefs).toContain(`sajuKnowledgeBase:${source.id}`);
  });
  it.each(FUSION_RULES)("validates exact source trait, domains and semantic connection: $id", r => {
    const trait = getMbtiSourceProfile(r.type)?.traits?.[r.trait[0]]?.find(t => t.id === r.trait[1]);
    expect(trait?.plainKo).toBeTruthy();
    expect(semanticConnection(r.kind, r.myeongliTag, r.trait[2])).toBe(true);
    for (const feature of r.features) {
      const m = MATERIAL_BY_FEATURE.get(feature)!;
      expect(m.semanticTags).toContain(r.myeongliTag);
      for (const d of r.domains) expect(m.domains, `${r.id}:${feature}:${d}`).toContain(d);
    }
    expect(r.insightSeed).not.toMatch(/KPI|레버리지|원국 근거|프로비넌스|수익 보장|질병|죽음|반드시.*결혼|ENTJ는|INFP는/);
    if (r.kind === "complement") expect(r.trait[0]).not.toBe("growth");
  });
  it.each(MBTI_SOURCE_TYPES.flatMap(type => V4_DOMAINS.map(domain => ({ type, domain }))))("$type × $domain has a truthful result/empty policy", ({ type, domain }) => {
    const r = interpretFusion({ observations: allMajor, mbti: type, domains: [domain] });
    const coverage = r.coverage.domains[domain];
    expect(coverage.selected).toBe(r.fusions.length);
    if (!r.fusions.length) expect(["no-reviewed-rule", "no-matching-evidence"]).toContain(coverage.state);
    else expect(coverage.state).toBe("matched");
    expect(Object.values(r.coverage.sourceDomainCounts).every(n => n > 0)).toBe(true);
  });
  it("exposes thin source/legacy coverage instead of declaring every domain complete", () => {
    for (const type of ["ISTJ", "ISTP"]) {
      expect(run(allMajor, type).coverage.auditWarnings).toContain("THIN_SOURCE_LOVE");
      expect(run(allMajor, type).coverage.auditWarnings).toContain("THIN_SOURCE_COMMUNICATION");
    }
    expect(run(allMajor, "INTP").coverage.auditWarnings).toContain("THIN_LEGACY_FUSION");
    expect(FUSION_RULES.filter(r => r.type === "INTP").length).toBeGreaterThan(1);
    expect(run(allMajor, "ISTJ").coverage.domains["success/fortune"].state).toBe("no-reviewed-rule");
  });
  it.each([
    ["1996-12-06", "09:30", "ENTJ"], ["1994-11-18", "07:42", "ENFP"], ["1988-03-22", "14:10", "ISTJ"],
    ["1997-08-05", "12:00", "ISFP"], ["1992-12-14", "22:30", "INTP"], ["1985-06-30", "06:00", "INFJ"],
    ["2001-01-27", "18:20", "ESTP"],
  ])("consumes current production calculation unchanged: %s %s %s", (date, time, mbti) => {
    const calc = calculate(date, time), before = JSON.stringify(calc);
    const result = buildFusionCore({ calculation: calc, mbti });
    expect(result.myeongli.length).toBeGreaterThan(0);
    expect(result).toEqual(buildFusionCore({ calculation: calculate(date, time), mbti }));
    expect(JSON.stringify(calc)).toBe(before);
    expect(JSON.parse(JSON.stringify(result))).toEqual(result);
    for (const f of result.fusions) for (const d of f.myeongliEvidence) expect(d.evidence.sourceRefs.every(s => !s.startsWith("fixture:"))).toBe(true);
  });
  it("does not interpret missing birth time or legacy calculation as a proven gap", () => {
    const calc = calculateSaju({ birthDate: "1994-11-18", birthTimeUnknown: true, calendarType: "SOLAR", gender: "FEMALE", timezone: "Asia/Seoul" });
    expect(buildFusionCore({ calculation: calc, mbti: "ENFP" }).fusions.some(f => f.kind === "complement")).toBe(false);
    const legacy = { ...calculate(), calculationVersion: undefined, birthTimeContext: undefined };
    expect(buildFusionCore({ calculation: legacy, mbti: "ENTJ" }).fusions).toEqual([]);
  });
  it("uses actual derived gwimun and quarantines actual legacy mangsin without changing the calculator", () => {
    const samples = Array.from({ length: 24 }, (_, i) => calculate(`1994-${String(i % 12 + 1).padStart(2, "0")}-${i < 12 ? "09" : "18"}`));
    const decisions = samples.flatMap(c => buildV4Evidence(c).map(evaluateEvidence));
    expect(decisions.some(d => d.evidence.feature === "sinsal_gwimun" && d.usable)).toBe(true);
    expect(decisions.some(d => d.evidence.feature === "twelve_sinsal_mangsin" && d.status === "ambiguous/conflicted")).toBe(true);
    for (const d of decisions.filter(d => d.evidence.feature === "twelve_sinsal_mangsin")) expect(d.usable).toBe(false);
  });
  it("has no runtime consumer in V3 generation, public routes or paid delivery", () => {
    const files = (root: string): string[] => readdirSync(root, { withFileTypes: true }).flatMap(f => f.isDirectory() ? files(join(root, f.name)) : [join(root, f.name)]);
    for (const root of ["src/app", "src/lib/report-generation", "src/lib/interpretation-v3"]) {
      for (const path of files(root).filter(p => /\.tsx?$/.test(p))) expect(readFileSync(path, "utf8"), path).not.toMatch(/(?:from\s*|import\s*\()\s*["'][^"']*interpretation-v4/);
    }
    for (const path of files("src/lib/interpretation-v4")) expect(readFileSync(path, "utf8"), path).not.toMatch(/\bfetch\s*\(|\bnew\s+OpenAI|from ["'](?:openai|@supabase)|process\.env/);
  });
});
