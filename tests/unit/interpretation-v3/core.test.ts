import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import ts from "typescript";
import { SAJU_FEATURE_TAXONOMY } from "../../../src/lib/report-knowledge/sajuFeatureTaxonomy";
import { SAJU_KNOWLEDGE_BASE, TEN_GODS } from "../../../src/lib/report-knowledge/sajuKnowledgeBase";
import { SHINSAL_METADATA, SHINSAL_RULES } from "../../../src/lib/saju/shinsalConstants";
import { MBTI_SOURCE_TYPES, MBTI_TRAIT_AREAS } from "../../../src/lib/report-knowledge/mbti/sourceRuntimeAdapter";
import { BRIDGE_SCENE_RULES } from "../../../src/lib/report-knowledge/bridge/interactionSceneRules";
import { ATOMIC_REGISTRY, ATOMIC_BY_ID, REVIEWED_COPY } from "../../../src/lib/interpretation-v3/atomicRegistry";
import { buildInventory, STRUCTURED_FAMILIES } from "../../../src/lib/interpretation-v3/inventory";
import { COMPOUND_RULES, TEN_GOD_PAIR_REVIEW, matchCompounds } from "../../../src/lib/interpretation-v3/compounds";
import { claimStrength, coverageWarnings, interpretV3, rankEvidence, renderDirective, validateV3Copy } from "../../../src/lib/interpretation-v3/engine";
import { adaptCalculation, adaptMbti, canonicalFeatureId, mergeEvidence, validateEvidence } from "../../../src/lib/interpretation-v3/evidence";
import { fuseMbti } from "../../../src/lib/interpretation-v3/fusion";
import { interpretCareerContext, contextScene, normalizeContext, LIFE_SCENES, RELATIONSHIP_SCENES } from "../../../src/lib/interpretation-v3/context";
import { lifestyleSuggestions } from "../../../src/lib/interpretation-v3/lifestyle";
import { DOMAINS, PRODUCTS, type Evidence } from "../../../src/lib/interpretation-v3/types";
import { STRUCTURED_ENUMS } from "../../../src/lib/interpretation-v3/structuredEnums";
import { EXTRACTOR_DIRECT_IDS, EXTRACTOR_SUPPLIED_IDS } from "../../../src/lib/interpretation-v3/featureCapabilities";
import { extractComputedSajuFeatures } from "../../../src/lib/report-knowledge/sajuComputedFeatureExtractor";
import { sexagenaryCycle, BRANCHES, specialPatternFeatureIdByAlias, sinsalFeatureIdByAlias, gwiinFeatureIdByAlias } from "../../../src/lib/report-knowledge/sajuFeatureExtractionRules";
import { calculateSaju } from "../../../src/lib/saju/calculateSaju";
import { renderV3Documents } from "./documentation";

const fact = (featureId: string, change: Partial<Evidence> = {}): Evidence => ({
  id: `person:natal:${featureId}`, featureId, kind: "ten_god", subject: "person", scope: "natal", value: "fixture-confirmed",
  sourceRefs: [`fixture:confirmed:${featureId}`], lineage: [`person:natal:${canonicalFeatureId(featureId)}`],
  certainty: "confirmed", salience: "direct", domains: DOMAINS, ...change,
});
const employee = normalizeContext({ lifeStatus: "employee", fieldLabel: "B2B 소프트웨어 영업기획", relationshipStatus: "single" });
const run = (evidence: readonly Evidence[], extra: Partial<Parameters<typeof interpretV3>[0]> = {}) => interpretV3({ evidence, product: "saju_mbti_full", subject: "person", context: employee, ...extra });

describe("V3 isolated common core", () => {
  it.each(STRUCTURED_ENUMS)("tracks every canonical $type discriminant", contract => {
    const source = ts.createSourceFile(contract.source, readFileSync(contract.source, "utf8"), ts.ScriptTarget.Latest, true);
    const declaration = source.statements.find((s): s is ts.TypeAliasDeclaration => ts.isTypeAliasDeclaration(s) && s.name.text === contract.type)!;
    expect(declaration).toBeDefined();
    const values = ts.isUnionTypeNode(declaration.type) ? declaration.type.types.flatMap(t => ts.isLiteralTypeNode(t) && ts.isStringLiteral(t.literal) ? [t.literal.text] : []) : [];
    expect(values.sort()).toEqual([...contract.values].sort());
  });
  it("inventories every category and every canonical catalog row, not examples", () => {
    const inventory = buildInventory(), ids = new Set(inventory.map(r => r.id));
    expect(ids.size).toBe(inventory.length);
    expect(STRUCTURED_FAMILIES).toHaveLength(48);
    for (const category of ["day_master", "day_pillar", "pillars", "season", "yin_yang", "elements", "hidden_stems", "ten_gods", "life_stages", "native_shinsal", "derived_features", "structure", "natal_relations", "expanded_relations", "wonjin_gwimun", "cross_person", "spouse_palace", "compatibility_layers", "major_cycles", "major_selection", "major_cross", "annual", "monthly", "month_relations", "precision", "mbti_types", "mbti_axes", "mbti_functions", "mbti_pairs", "mbti_bridge", "mbti_use_cases", "context", ...MBTI_TRAIT_AREAS.map(a => `mbti_traits_${a}`)]) expect(ids.has(`category:${category}`)).toBe(true);
    for (const f of SAJU_FEATURE_TAXONOMY) expect(ids.has(`feature:${f.id}`)).toBe(true);
    for (const k of SAJU_KNOWLEDGE_BASE) expect(ids.has(`knowledge:${k.id}`)).toBe(true);
    for (const native of Object.values(SHINSAL_METADATA)) expect(ids.has(`native:${native.code}`)).toBe(true);
    for (const rule of SHINSAL_RULES) expect(ids.has(`native:${rule.code}`)).toBe(true);
    expect(inventory.filter(r => r.id.startsWith("life-stage:"))).toHaveLength(12);
    for (const a of MBTI_SOURCE_TYPES) for (const b of MBTI_SOURCE_TYPES) expect(ids.has(`mbti-pair:${a}->${b}`)).toBe(true);
    for (const row of inventory) for (const key of ["name", "source", "producer", "shape", "availability", "coverage"] as const) expect(row[key], row.id).toBeTruthy();
  });
  it("audits the whole extractor capability domain, separating computed and supplied facts", () => {
    const computed = new Set<string>();
    // Domain sweep, not a fabricated customer's chart: every day pillar and
    // every branch is tested as a potential detection position.
    for (const dayPillar of sexagenaryCycle) for (const branch of BRANCHES) {
      const result = extractComputedSajuFeatures({ dayPillar, dayMaster: dayPillar[0], earthlyBranches: [branch] });
      for (const id of result.featureIds) computed.add(id);
    }
    expect([...computed].sort()).toEqual([...EXTRACTOR_DIRECT_IDS].sort());
    const supplied = extractComputedSajuFeatures({ excessiveElements: ["wood", "fire", "earth", "metal", "water"], missingElements: ["wood", "fire", "earth", "metal", "water"],
      tenGodSignals: TEN_GODS.map(tenGod => ({ tenGod, strength: "present" })), specialPatterns: [...specialPatternFeatureIdByAlias.keys()], existingSinsal: [...sinsalFeatureIdByAlias.keys()], existingGwiin: [...gwiinFeatureIdByAlias.keys()] });
    expect([...supplied.featureIds].sort()).toEqual([...EXTRACTOR_SUPPLIED_IDS].sort());
    expect(extractComputedSajuFeatures({ existingSinsal: ["없는 신살"], existingGwiin: ["없는 귀인"] }).featureIds).toEqual([]);
  });
  it("reuses every atomic source; all ten gods have the complete V3 contract", () => {
    for (const source of [...SAJU_FEATURE_TAXONOMY, ...SAJU_KNOWLEDGE_BASE]) expect(ATOMIC_BY_ID.has(source.id)).toBe(true);
    for (const god of TEN_GODS) {
      const material = ATOMIC_BY_ID.get(`ten_god_${god}`)!;
      expect(material.readiness).toBe("reviewed");
      for (const key of ["coreMeaning", "feltQuestions", "strength", "overuseRisk", "directives", "sourceRefs", "unsupportedClaimGuards"] as const) expect(material[key].length).toBeGreaterThan(0);
      expect(Object.keys(material.use).sort()).toEqual([...DOMAINS].sort());
    }
    expect(ATOMIC_REGISTRY).toHaveLength(195);
    for (const [id, lines] of Object.entries(REVIEWED_COPY)) expect(validateV3Copy(lines.join(" ")), id).toEqual([]);
  });
  it("reviews all 45 unordered ten-god pairs exactly once and executes only meaningful/tension rules", () => {
    expect(TEN_GOD_PAIR_REVIEW).toHaveLength(45);
    expect(new Set(TEN_GOD_PAIR_REVIEW.map(p => p.pair.slice().sort().join("+"))).size).toBe(45);
    for (const p of TEN_GOD_PAIR_REVIEW) {
      expect(p.judgment).toBeTruthy(); expect(p.sourceRefs).toHaveLength(2);
      const match = matchCompounds(p.pair.map(g => fact(`ten_god_${g}`)), "person");
      expect(match.some(m => m.rule.id === p.id)).toBe(p.classification !== "no-special-compound");
    }
    expect(TEN_GOD_PAIR_REVIEW.find(p => p.pair.includes("qi_sha") && p.pair.includes("shi_shen"))?.classification).toBe("meaningful");
    expect(TEN_GOD_PAIR_REVIEW.find(p => p.pair.includes("zheng_cai") && p.pair.includes("jie_cai"))?.classification).toBe("tension");
  });
  it.each(COMPOUND_RULES)("matches $id deterministically with complete provenance and requires every group", rule => {
    const facts = rule.allOf.map(g => fact(g[0], { kind: g[0].startsWith("mbti:") ? "mbti" : "ten_god" }));
    const matches = matchCompounds(facts, "person");
    expect(matches).toEqual(matchCompounds(facts, "person"));
    expect(matches).toEqual(matchCompounds([...facts].reverse(), "person"));
    expect(matches.find(m => m.rule.id === rule.id)?.evidence.map(e => e.id).sort()).toEqual(facts.map(e => e.id).sort());
    expect(matchCompounds(facts.slice(1), "person").some(m => m.rule.id === rule.id)).toBe(false);
  });
  it("does not combine people, unselected years or future flows into natal facts", () => {
    const a = fact("ten_god_shi_shen"), b = fact("ten_god_pian_cai", { subject: "personB" });
    expect(matchCompounds([a, b], "person")).toEqual([]);
    const flow = fact("ten_god_pian_cai", { scope: "annual", kind: "fortune", period: "2027" });
    expect(matchCompounds([a, flow], "person", "2026")).toEqual([]);
    expect(matchCompounds([a, flow], "person", "2027")).toHaveLength(1);
    const output = run([a, flow], { period: "2027", product: "annual_fortune" });
    expect(output.directives[0].headline).toContain("선택한 운의 구간");
    expect(output.facts).toEqual([a, flow]);
  });
  it("uses independent prominent corroboration, domain assertions, questions and suppression", () => {
    const a = fact("ten_god_shi_shen", { salience: "prominent" });
    expect(claimStrength([a], "career")).toBe("domain");
    expect(claimStrength([a, { ...a, id: "duplicate-adapter" }], "career")).toBe("domain");
    expect(claimStrength([a, fact("ten_god_pian_cai", { salience: "prominent" })], "career")).toBe("strong");
    expect(claimStrength([{ ...a, certainty: "conditional" }], "career")).toBe("question");
    expect(claimStrength([{ ...a, salience: "supporting" }], "career")).toBe("question");
    expect(claimStrength([{ ...a, certainty: "weak" }], "career")).toBe("suppressed");
    expect(claimStrength([{ ...a, domains: ["love"] }], "career")).toBe("suppressed");
    expect(run([{ ...a, certainty: "weak" }]).directives).toEqual([]);
    expect(run([{ ...a, certainty: "conditional" }]).directives[0].headline).toMatch(/\?$/);
  });
  it("preserves conflicting evidence as tension instead of a falsely unified conclusion", () => {
    const a = fact("ten_god_bijian", { conflictsWith: ["ten_god_zheng_cai"] }), b = fact("ten_god_zheng_cai");
    expect(claimStrength([a, b], "money")).toBe("tension");
    const r = run([a, b], { domain: "money" });
    expect(r.directives[0].strength).toBe("tension");
    expect(r.directives[0].headline).toContain("조정");
    expect(r.directives[0].evidenceRefs).toEqual(expect.arrayContaining([a.id, b.id]));
  });
  it("uses actual MBTI traits for all six interaction types and changes the same signal's expression", () => {
    const types = new Set<string>();
    for (const rule of BRIDGE_SCENE_RULES) {
      const evidence = [...rule.requires.allOf.map(g => fact(g[0])), ...adaptMbti(rule.mbti)];
      const fusion = fuseMbti(evidence, "person").find(f => f.id === `v3:mbti:${rule.id}`);
      expect(fusion, rule.id).toBeDefined(); if (fusion) types.add(fusion.type);
      for (const ref of fusion?.evidenceRefs ?? []) expect(evidence.some(e => e.id === ref)).toBe(true);
    }
    expect([...types].sort()).toEqual(["agreement", "amplification", "compensation", "context-switch", "expression", "tension"]);
    const natal = [fact("ten_god_zheng_guan")];
    const entj = run([...natal, ...adaptMbti("ENTJ")]), entp = run([...natal, ...adaptMbti("ENTP")]);
    expect(entj.directives.map(d => d.headline)).not.toEqual(entp.directives.map(d => d.headline));
    expect(fuseMbti([...natal, fact("mbti:ENTJ:type", { kind: "mbti" })], "person")).toEqual([]);
    expect(adaptMbti("모름")).toEqual([]);
  });
  it("maps every existing context and changes scenes, never natal facts", () => {
    const evidence = [fact("ten_god_zheng_cai")];
    const outputs = Object.keys(LIFE_SCENES).map(lifeStatus => run(evidence, { context: normalizeContext({ lifeStatus }) }));
    expect(new Set(outputs.map(r => r.directives[0].context)).size).toBe(8);
    for (const r of outputs) expect(r.facts).toEqual(evidence);
    for (const relationshipStatus of Object.keys(RELATIONSHIP_SCENES)) expect(contextScene(normalizeContext({ relationshipStatus }), true)).toBeTruthy();
    expect(normalizeContext({ lifeStatus: "unemployed" }).lifeStatus).toBe("resting");
    expect(normalizeContext({ lifeStatus: "job-seeker" }).lifeStatus).toBe("job_seeker");
    const sales = interpretCareerContext("B2B 소프트웨어 영업기획"), quality = interpretCareerContext("제조업 품질관리 책임자");
    expect(sales).toMatchObject({ industry: "software", roleFamily: "sales_operations", salesIntensity: "high" });
    expect(quality).toMatchObject({ industry: "manufacturing", roleFamily: "quality_operations", leadershipIntensity: "high" });
    expect(interpretCareerContext("hospitality").industry).toBe("unknown");
    expect(interpretCareerContext("미입력").analysisIntensity).toBe("unknown");
    const pair = [fact("ten_god_pian_cai"), fact("ten_god_zheng_cai")];
    const business = run(pair, { context: normalizeContext({ lifeStatus: "business_owner" }) });
    const employed = run(pair, { context: normalizeContext({ lifeStatus: "employee" }) });
    expect(business.directives[0].directive).toContain("계약·정산·반복 수익");
    expect(employed.directives[0].directive).toContain("보상·연봉·성과급");
  });
  it("promotes present positive markers and warns on relevant omitted attraction evidence", () => {
    const facts = [fact("sinsal_dohwa", { kind: "shinsal" }), fact("sinsal_hongyeom", { kind: "shinsal" })];
    const r = run(facts, { product: "love_marriage_child" });
    expect(r.directives).toHaveLength(2); expect(r.warnings).toEqual([]);
    for (const d of r.directives) { expect(d.headline).toMatch(/매력|힘이 있습니다/); expect(d.positiveUse).toBe(d.headline); }
    expect(coverageWarnings(facts, [], "love_marriage_child")).toHaveLength(2);
    expect(run(facts, { limit: 0 }).warnings).toHaveLength(2);
  });
  it("keeps full fact tables separate from product-specific narrative promotion", () => {
    const facts = [fact("ten_god_pian_cai", { domains: ["money"] }), fact("sinsal_dohwa", { domains: ["love"] })];
    expect(rankEvidence(facts, "career_money_study").map(e => e.featureId)).toEqual(["ten_god_pian_cai"]);
    expect(rankEvidence(facts, "love_marriage_child").map(e => e.featureId)).toEqual(["sinsal_dohwa"]);
    for (const product of PRODUCTS) expect(run(facts, { product }).facts).toEqual(facts);
  });
  it("never produces unsupported facts, admits unknown copy, or omits provenance", () => {
    expect(run([]).directives).toEqual([]);
    expect(run([fact("not_in_catalog")]).directives).toEqual([]);
    expect(run([fact("ten_god_shi_shen", { sourceRefs: [] })]).ok).toBe(false);
    expect(validateEvidence([fact("ten_god_fake")])).toContain("unknown-ten-god:person:natal:ten_god_fake");
    const e = fact("ten_god_shi_shen");
    const merged = mergeEvidence([e], [{ ...e, sourceRefs: ["second-adapter"], certainty: "conditional" }]);
    expect(merged).toHaveLength(1); expect(merged[0].certainty).toBe("conditional");
    for (const d of run([e]).directives) { expect(d.evidenceRefs).toEqual([e.id]); expect(d.sourceRefs).toContain(e.sourceRefs[0]); expect(d.professionalEvidence.length).toBeGreaterThan(0); }
  });
  it("uses only reliable weighted balance for lifestyle, not counts or unsupported useful elements", () => {
    const e = fact("element_water_missing", { kind: "element", value: { water: 0 } });
    expect(lifestyleSuggestions([e])).toEqual([]);
    const valid = { ...e, value: { element: "water", condition: "missing", method: "canonical-weighted", version: "canonical-fixture" } };
    expect(lifestyleSuggestions([valid])[0].choices).toContain("독서와 생각 정리");
    expect(lifestyleSuggestions([{ ...valid, certainty: "conditional" }])).toEqual([]);
    expect(lifestyleSuggestions([{ ...valid, scope: "monthly" }])).toEqual([]);
  });
  it("consumes existing weighted calculation labels without recalculation or unknown-hour advice", () => {
    const calc = calculateSaju({ birthDate: "1989-09-07", birthTime: "07:24", birthTimeUnknown: false, calendarType: "SOLAR", gender: "MALE", timezone: "Asia/Seoul" });
    const before = JSON.stringify(calc), evidence = adaptCalculation(calc);
    expect(validateEvidence(evidence)).toEqual([]);
    const balance = evidence.filter(e => e.kind === "element");
    expect(balance.length).toBe(calc.elements.labels.filter(l => /MISSING|STRONG/.test(l)).length);
    for (const e of balance) expect(e.sourceRefs.join(" ")).toContain("elements.weighted");
    expect(JSON.stringify(calc)).toBe(before);
    expect(lifestyleSuggestions(adaptCalculation({ ...calc, input: { ...calc.input, birthTimeUnknown: true } }))).toEqual([]);
    expect(lifestyleSuggestions(adaptCalculation({ ...calc, calculationVersion: undefined }))).toEqual([]);
  });
  it("keeps the complete documentation reproducible from the audited registry", () => {
    for (const [name, contents] of Object.entries(renderV3Documents())) expect(readFileSync(`docs/product/v3/${name}`, "utf8")).toBe(contents);
  });
  it("enforces the V3 tone, positive-use order and no event guarantees", () => {
    for (const text of ["가능성이 있습니다", "일 수도 있습니다", "로 볼 수 있습니다", "처럼 나타날 수 있습니다", "실제 경험과 비교", "단정할 수 없습니다", "참고 자료", "반드시 합격합니다", "2027년 결혼합니다", "수익이 보장됩니다", "노력하면 매력이 생깁니다", "열심히 하면 좋은 운이 올 수 있습니다", "100만원을 벌게 됩니다"]) expect(validateV3Copy(text).length, text).toBeGreaterThan(0);
    const d = run([fact("ten_god_shi_shen")]).directives[0], text = renderDirective(d);
    expect(text.indexOf(d.headline)).toBeLessThan(text.indexOf(d.directive));
    expect(text.indexOf(d.directive)).toBeLessThan(text.indexOf(d.rationale));
    expect(text.indexOf(d.rationale)).toBeLessThan(text.indexOf(d.professionalEvidence[0]));
  });
  it("has zero imports into production and zero provider/network clients in V3", () => {
    const files = (dir: string): string[] => readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? files(join(dir, e.name)) : /\.tsx?$/.test(e.name) ? [join(dir, e.name)] : []);
    for (const file of files("src")) {
      const source = readFileSync(file, "utf8");
      if (!file.includes("interpretation-v3/")) expect(source, file).not.toMatch(/(?:from|import\s*\().*["'][^"']*interpretation-v3/);
      else expect(source, file).not.toMatch(/\bfetch\s*\(|\bnew\s+OpenAI|from ["'](?:openai|@supabase)|process\.env/);
    }
    expect(fetch).not.toHaveBeenCalled();
  });
});
