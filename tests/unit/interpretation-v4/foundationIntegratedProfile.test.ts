import { describe, expect, it } from "vitest";
import { calculateSaju } from "../../../src/lib/saju/calculateSaju";
import { SEMANTIC_AXES, aggregateSemanticEvidence, type EvidenceAtom, type FoundationSynthesisCandidate } from "../../../src/lib/interpretation-v4/semanticCore";
import { buildFoundationProfile, type FoundationInput } from "../../../src/lib/interpretation-v4/foundationProfile";
import { buildNatalFoundationFromCalculation } from "../../../src/lib/interpretation-v4/foundationNatalProfile";
import { buildFoundationSupplementFromCalculation, projectFoundationSupplement } from "../../../src/lib/interpretation-v4/foundationSupplement";
import { NATAL_MARKER_ALIASES, type FoundationMarker } from "../../../src/lib/interpretation-v4/foundationShinsal";
import { TEN_GOD_SEMANTICS, type NormalizedTenGodStates, type TenGodFamily } from "../../../src/lib/interpretation-v4/foundationTenGods";
import { buildTenGodCandidates } from "../../../src/lib/interpretation-v4/foundationTenGodSynthesis";
import { buildIntegratedMyeongliProfile, integrateMyeongliFoundation, type IntegratedProfileResult } from "../../../src/lib/interpretation-v4/foundationIntegratedProfile";
import { buildMyeongliDebugView } from "../../../src/lib/interpretation-v4/foundationDiagnostics";
import { CONTENT_TIER_BASE, FAMILY_DIVERSITY_BONUS, SYNTHESIS_DEPTH_MULTIPLIER, SPECIFICITY_FACTOR, DUPLICATION_PENALTIES,
  normalizeContentScore, positionFactor, diversityMultiplier, independentFamilies, semanticOverlap, synthesisDepth, type InterpretationSeed,
  rankInterpretationCandidates } from "../../../src/lib/interpretation-v4/foundationRanking";
import { MYEONGLI_CONDITION_RULES, MYEONGLI_CONDITION_SPLITS, detectMyeongliTensions } from "../../../src/lib/interpretation-v4/foundationTension";
import { NARRATIVE_FIXTURES, fixtureInput } from "./narrativeFixtures";

const value = (r: IntegratedProfileResult) => { expect(r.ok, JSON.stringify(!r.ok && r.diagnostics.hardErrors)).toBe(true); if (!r.ok) return expect.unreachable(); return r.value; };
const normalizedAtom = (id: string, axes: EvidenceAtom["axes"], extra: Partial<EvidenceAtom> = {}): EvidenceAtom => ({
  id, sourceType: "ten_god", sourceKey: id, family: id, kind: "TRAIT", tier: "CORE", strength: "STRONG", weight: 1, axes,
  contexts: ["identity", "work"], easyMeaning: "주어진 일을 끝까지 살피는 힘", humanDescription: "작은 차이도 다시 살펴보는 편입니다.",
  metadata: { provenance: [`explicit-normalized-fixture:${id}`] }, ...extra,
});
const run = (evidence: EvidenceAtom[], synthesisCandidates: FoundationSynthesisCandidate[] = []) => value(integrateMyeongliFoundation({ evidence, synthesisCandidates }));
function elementInput(): FoundationInput {
  const element = (e: string): FoundationInput["elements"]["WOOD"] => ({ state: "BALANCED", weightedScore: 2, metadata: { provenance: [`explicit-normalized-fixture:${e}`] } });
  return { yinYang: { yinCount: 4, yangCount: 4 }, elements: {
    WOOD: element("WOOD"), FIRE: element("FIRE"), EARTH: element("EARTH"), METAL: element("METAL"), WATER: element("WATER"),
  } };
}
function elementFixture() {
  const input = elementInput(); input.elements.METAL = { ...input.elements.METAL, state: "STRONG", weightedScore: 5 };
  input.elements.WATER = { ...input.elements.WATER, state: "STRONG", weightedScore: 4 };
  input.elements.FIRE = { ...input.elements.FIRE, state: "WEAK", weightedScore: 1 };
  const p = buildFoundationProfile(input); expect(p.ok).toBe(true); if (!p.ok) return expect.unreachable();
  return p.value;
}
function markerAtoms(keys: FoundationMarker[]) {
  return projectFoundationSupplement({ relations: [], stages: [], markers: keys.map(key => {
    const featureId = Object.keys(NATAL_MARKER_ALIASES).find(id => NATAL_MARKER_ALIASES[id] === key)!;
    return { canonicalId: featureId, featureId, basis: "explicit-normalized-fixture", scope: "natal", certainty: "confirmed", provenance: [`explicit-normalized-fixture:${key}`], involvedPillars: [], involvedCharacters: [], involvedSlots: [] };
  }) }).evidence;
}
function godFixture(families: TenGodFamily[]) {
  const entries = Object.entries(TEN_GOD_SEMANTICS).filter(([, d]) => families.includes(d.family));
  const evidence = entries.map(([key, def]) => normalizedAtom(key, def.axes, { ...def, contexts: [...def.contexts], sourceKey: key }));
  const states: NormalizedTenGodStates = { families: {}, gods: {} };
  for (const family of families) states.families[family] = { state: "MEANINGFUL", evidenceIds: evidence.filter(e => e.family === family).map(e => e.id), provenance: [`explicit-normalized-fixture:${family}`] };
  return { evidence, synthesisCandidates: buildTenGodCandidates(states, evidence) };
}
const seed = (id: string, atoms: EvidenceAtom[], depth: InterpretationSeed["synthesisDepth"]): InterpretationSeed => ({
  id, source: depth >= 3 ? "SYNTHESIS" : "EVIDENCE", semanticTheme: "PRECISION_AND_STANDARDS", primaryAxes: ["PRECISION"],
  evidenceIds: atoms.map(e => e.id), humanDescription: "작은 차이와 그 이유를 함께 살핍니다.", synthesisDepth: depth,
});

describe("13D-1D immutable all-source integration / actual canonical fixtures", () => {
  it.each(NARRATIVE_FIXTURES)("$id: all available sources once, axes/proofs preserved, no MBTI input", fixture => {
    const calc = fixtureInput(fixture).calculation, before = structuredClone(calc);
    const natal = buildNatalFoundationFromCalculation(calc), supplement = buildFoundationSupplementFromCalculation(calc);
    expect(natal.ok && supplement.ok).toBe(true); if (!natal.ok || !supplement.ok) return;
    const p = value(buildIntegratedMyeongliProfile(calc)), atoms = [...natal.value.evidence, ...supplement.value.evidence];
    expect(p.evidence).toHaveLength(atoms.length);
    expect(new Set(p.evidence.map(e => e.id)).size).toBe(atoms.length);
    for (const e of atoms) expect(p.evidence.find(v => v.id === e.id)).toEqual(e);
    const ledger = aggregateSemanticEvidence([...atoms].sort((a, b) => a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
    expect(p.axes).toEqual(ledger.axes);
    expect(Object.keys(p.axes)).toHaveLength(36);
    expect([...p.dominantAxes, ...p.supportingAxes]).toHaveLength(36);
    for (const axis of SEMANTIC_AXES) {
      expect(p.contributions[axis]?.reduce((n, c) => n + c.effectiveContribution, 0) ?? 0).toBe(p.axes[axis]);
      for (const c of p.contributions[axis] ?? []) {
        const e = atoms.find(e => e.id === c.evidenceId)!;
        expect(c).toMatchObject({ axis, sourceType: e.sourceType, sourceKey: e.sourceKey, family: e.family, tier: e.tier, strength: e.strength,
          effectiveWeight: e.weight, effectiveContribution: e.weight === 0 ? 0 : e.axes[axis]! * e.weight, metadata: e.metadata });
        expect(c.rawContribution).toBe(c.rawWeight === 0 ? 0 : e.axes[axis]! * c.rawWeight);
        expect(c.canonicalConfidence).toBeUndefined();
      }
    }
    expect(buildIntegratedMyeongliProfile(calc)).toEqual({ ok: true, value: p });
    expect(buildMyeongliDebugView(p)).toEqual(buildMyeongliDebugView(value(buildIntegratedMyeongliProfile(calc))));
    expect(JSON.parse(JSON.stringify(p))).toEqual(p);
    expect(calc).toEqual(before);
    expect(buildNatalFoundationFromCalculation(calc)).toEqual(natal);
    expect(buildFoundationSupplementFromCalculation(calc)).toEqual(supplement);
    expect(p.humanPatternCandidates.length).toBeGreaterThan(0);
    expect(p.signatureCandidates.length).toBeLessThanOrEqual(5);
    expect(p.diagnostics.hardErrors).toEqual([]);
    expect(p.foundation.relations.every(e => ["STEM_HAP", "YUKHAP", "CHUNG", "WONJIN"].includes(e.sourceKey))).toBe(true);
    expect(p.evidence.some(e => e.sourceKey === "MANGSIN")).toBe(false);
  });
  it("all nine sources are actually covered by the real natal fixture cohort", () => {
    const types = new Set(NARRATIVE_FIXTURES.flatMap(f => value(buildIntegratedMyeongliProfile(fixtureInput(f).calculation)).evidence.map(e => e.sourceType)));
    expect([...types].sort()).toEqual(["yin_yang", "element", "heavenly_stem", "earthly_branch", "ten_god", "relation", "twelve_stage", "shinsal", "gwiin"].sort());
  });
  it("exact / approximate / unknown: confirmed data only, no guessed eighth character", () => {
    const base = { birthDate: "1996-12-06", birthTimeUnknown: false, calendarType: "SOLAR", gender: "MALE", timezone: "Asia/Seoul" } as const;
    const exact = value(buildIntegratedMyeongliProfile(calculateSaju({ ...base, birthTime: "14:15", birthTimePrecision: "exact" })));
    const approx = value(buildIntegratedMyeongliProfile(calculateSaju({ ...base, approximateBirthTimeSlot: "MISI", birthTimePrecision: "approximate" })));
    const unknown = value(buildIntegratedMyeongliProfile(calculateSaju({ ...base, birthTimeUnknown: true, birthTimePrecision: "unknown" })));
    expect(exact.axes).toEqual(approx.axes);
    expect(unknown.foundation.yinYang).toBeNull(); expect(unknown.foundation.elements).toBeNull();
    expect(unknown.foundation.twelveStages).toHaveLength(3);
    expect(unknown.evidence.some(e => e.metadata?.pillar === "hour")).toBe(false);
    expect(unknown.diagnostics.warnings.some(w => w.code === "INCOMPLETE_CHART_FOUNDATION_UNAVAILABLE")).toBe(true);
  });
  it("missing confidence is neutral; known confidence remains explicit, never fabricated", () => {
    const a = normalizedAtom("a", { PRECISION: 1 }), p = run([a]);
    expect(p.rankedCandidates[0].rankingFactors.confidenceFactor).toBe(1);
    expect(p.contributions.PRECISION![0].canonicalConfidence).toBeUndefined();
    expect(p.diagnostics.warnings).toContainEqual({ code: "CANONICAL_CONFIDENCE_UNAVAILABLE", evidenceIds: ["a"] });
    const known = run([{ ...a, metadata: { ...a.metadata, canonicalConfidence: 0.8 } }]);
    expect(known.contributions.PRECISION![0].canonicalConfidence).toBe(0.8);
    expect(known.rankedCandidates[0].rankingFactors.confidenceFactor).toBe(0.8);
    expect(known.rankedCandidates[0].rankingScore).toBeCloseTo(p.rankedCandidates[0].rankingScore * 0.8);
  });
  it("source/evidence order cannot change rankings, groups, tensions or debug representation", () => {
    const f = godFixture(["WEALTH", "RESOURCE", "PEER", "OFFICER", "OUTPUT"]), original = structuredClone(f);
    const p = value(integrateMyeongliFoundation(f));
    expect(value(integrateMyeongliFoundation({ evidence: [...f.evidence].reverse(), synthesisCandidates: [...f.synthesisCandidates].reverse() }))).toEqual(p);
    expect(f).toEqual(original);
    p.evidence[0].axes.PRECISION = 999;
    expect(f).toEqual(original);
  });
  it("explicit zero confidence is retained but cannot create a main claim or tension", () => {
    const a = normalizedAtom("zero", { ACTION_TEMPO: 3 }, { metadata: { provenance: ["normalized"], canonicalConfidence: 0 } });
    const p = run([a]);
    expect(p.axes.ACTION_TEMPO).toBe(3);
    expect(p.rankedCandidates[0]).toMatchObject({ rankingScore: 0, rank: "SUPPORT", mainEligible: false, signatureEligible: false });
    expect(p.contributions.ACTION_TEMPO![0].canonicalConfidence).toBe(0);
    expect(detectMyeongliTensions([a, normalizedAtom("slow", { ACTION_TEMPO: -2 })])).toEqual([]);
  });
});

describe("13D-1D content ranking, not chart strength or fortune", () => {
  it("single-source policy constants retain every requested multiplier", () => {
    expect(CONTENT_TIER_BASE.CORE).toMatchObject({ STRONG: 2, MEDIUM: 1.3 });
    expect(CONTENT_TIER_BASE.SUPPORT).toMatchObject({ STRONG: 1.2, MEDIUM: 0.8 });
    expect(CONTENT_TIER_BASE.AMPLIFIER.MEDIUM).toBe(0.5);
    expect(FAMILY_DIVERSITY_BONUS).toEqual([1, 1.15, 1.3, 1.4]);
    expect(SYNTHESIS_DEPTH_MULTIPLIER).toEqual({ 1: 0.7, 2: 1, 3: 1.2, 4: 1.35, 5: 1.5 });
    expect(SPECIFICITY_FACTOR).toEqual({ single: 0.8, pair: 1, composite: 1.1, contextual: 1.15 });
    expect(DUPLICATION_PENALTIES).toEqual([0, 0.15, 0.3, 0.5]);
    expect([1, 2, 3, 4, 9].map(diversityMultiplier)).toEqual([1, 1.15, 1.3, 1.4, 1.4]);
  });
  it("position reuses 1B normalization once, and does not multiply raw axes by five", () => {
    const positions = [5, 4, 2.5, 2].map((w, i) => normalizedAtom(String(i), { PRECISION: 2 }, { weight: w / 5, metadata: { provenance: ["normalized"], positionWeight: w } }));
    expect(positions.map(positionFactor)).toEqual([1, 0.8, 0.5, 0.4]);
    const p = run(positions), rows = p.contributions.PRECISION!;
    expect(rows.map(r => r.rawContribution)).toEqual([2, 2, 2, 2]);
    expect(rows.map(r => r.effectiveContribution)).toEqual([2, 1.6, 1, 0.8]);
    expect(p.rankedCandidates.map(c => c.rankingFactors.positionFactor)).toEqual([1, 0.8, 0.5, 0.4]);
  });
  it("family diversity counts independent families, not repeated markers or aliases", () => {
    const visibility = markerAtoms(["DOHWA", "NYEON"]);
    expect(independentFamilies(visibility)).toEqual(["VISIBILITY"]);
    const a = normalizedAtom("officer", { LEADERSHIP: 2 }, { family: "OFFICER" });
    const b = normalizedAtom("yang", { INITIATIVE: 2 }, { family: "visible_yin_yang" });
    expect(independentFamilies([a, ...markerAtoms(["JANGSEONG", "BANAN"]), b])).toHaveLength(3);
    const p = run(visibility), family = p.evidenceFamilies[0];
    expect(family.rawWeight).toBe(0.75); expect(family.effectiveWeight).toBe(0.625);
    expect(family.effectiveContribution.CHARISMA).toBe(0.5625);
  });
  it("levels 1 through 5 are independently rankable; 1B modifier/chain metadata reused", () => {
    const atoms = [normalizedAtom("a", { PRECISION: 1 }), normalizedAtom("b", { PRECISION: 1 }), normalizedAtom("c", { PRECISION: 1 })];
    const ranked = rankInterpretationCandidates(([1, 2, 3, 4, 5] as const).map(n => seed(`depth:${n}`, atoms.slice(0, n <= 2 ? 1 : n === 3 ? 2 : 3), n)), atoms).candidates;
    expect(ranked.map(c => c.synthesisDepth)).toEqual([5, 4, 3, 2, 1]);
    for (const c of ranked) expect(c.rankingFactors.synthesisDepthMultiplier).toBe(SYNTHESIS_DEPTH_MULTIPLIER[c.synthesisDepth]);
    const f = godFixture(["RESOURCE", "PEER", "OUTPUT"]);
    expect(synthesisDepth(f.synthesisCandidates.find(c => c.source === "TEN_GOD_CHAIN")!)).toBe(5);
    const pair = f.synthesisCandidates.find(c => c.source === "TEN_GOD_FAMILY_PAIR")!;
    expect(synthesisDepth({ ...pair, source: "DAY_MASTER_TEN_GOD", metadata: { priorityLevel: 4 } })).toBe(4);
  });
  it("precise-depth composite ranks above atomic metal/water; weak fire stays support", () => {
    const f = elementFixture(), p = value(integrateMyeongliFoundation(f));
    const pair = p.rankedCandidates.find(c => c.source === "SYNTHESIS" && c.semanticTheme === "PRECISE_DEEP_ANALYSIS")!;
    const metal = p.rankedCandidates.find(c => c.id === "single:foundation:element:METAL:STRONG")!;
    const water = p.rankedCandidates.find(c => c.id === "single:foundation:element:WATER:STRONG")!;
    expect(pair.rankingScore).toBeGreaterThan(metal.rankingScore);
    expect(pair.rankingScore).toBeGreaterThan(water.rankingScore);
    expect(p.rankedCandidates.indexOf(metal)).toBeLessThan(p.rankedCandidates.indexOf(water));
    expect(pair.signatureEligible).toBe(true);
    expect(p.rankedCandidates.find(c => c.id === "single:foundation:element:FIRE:WEAK")!.rank).toBe("SUPPORT");
    expect(p.humanPatternCandidates.find(c => c.id === pair.id)!.sourceDescription).toBe("작은 오류를 보는 눈과 그 오류가 왜 생겼는지 파고드는 성향이 같이 있습니다.");
    expect(p.axes).toEqual(aggregateSemanticEvidence([...f.evidence].sort((a, b) => a.id < b.id ? -1 : 1)).axes);
  });
  it.each([
    [["WEALTH", "RESOURCE"], "MONEY_AND_MEANING", "돈이 된다는 이유만으로 움직이지도 않고, 좋아한다는 이유만으로 현실을 무시하지도 않습니다."],
    [["PEER", "OFFICER"], "SELF_VS_RULE", "내 방식대로 하고 싶은 마음도 강한데 책임과 기준도 무시하지 못합니다."],
    [["RESOURCE", "PEER", "OUTPUT"], "LEARN_OWN_USE", "배운 것을 그대로 가지고 있기보다 자기 방식으로 이해한 뒤 실제로 써먹어야 만족하는 편입니다."],
  ] as const)("%s retains the existing human synthesis", (families, theme, text) => {
    const p = value(integrateMyeongliFoundation(godFixture([...families]))), c = p.rankedCandidates.find(c => c.source === "SYNTHESIS" && c.semanticTheme === theme)!;
    expect(c.rankingScore).toBeGreaterThan(Math.max(...p.rankedCandidates.filter(c => c.source === "EVIDENCE").map(c => c.rankingScore)));
    expect(p.humanPatternCandidates.find(h => h.id === c.id)).toMatchObject({ sourceDescription: text, patternType: theme === "LEARN_OWN_USE" ? "PROCESS" : "VALUE_CONFLICT" });
  });
  it("semantic near-duplicates are grouped/penalized, not removed or matched by text", () => {
    const atoms = [normalizedAtom("a", { PRECISION: 1 }), normalizedAtom("b", { PRECISION: 1 })];
    const seeds = ["a", "b", "c", "d", "e"].map(id => ({ ...seed(id, atoms, 3), humanDescription: `different literal ${id}` }));
    const p = rankInterpretationCandidates(seeds, atoms);
    expect(p.candidates).toHaveLength(5); expect(p.duplicateGroups).toHaveLength(1);
    expect(p.candidates.map(c => c.rankingFactors.duplicationPenalty)).toEqual([0, 0.15, 0.3, 0.5, 0.5]);
    expect(p.candidates[0].similarCandidateIds).toHaveLength(4);
    expect(semanticOverlap(p.candidates[0], p.candidates[1])).toBe(1);
    expect(p.candidates.every(c => c.semanticOverlapScore >= 0.7)).toBe(true);
  });
  it("original composite wins the identical shadow view, and opposite signals are not duplicates", () => {
    const p = value(integrateMyeongliFoundation(elementFixture()));
    const composite = p.rankedCandidates.find(c => c.source === "SYNTHESIS" && c.semanticTheme === "PRECISE_DEEP_ANALYSIS")!;
    const shadow = p.rankedCandidates.find(c => c.originCandidateId === composite.id)!;
    expect(composite.rankingScore).toBeGreaterThan(shadow.rankingScore);
    expect(composite.similarCandidateIds).toContain(shadow.id);
    const atoms = [normalizedAtom("fast", { ACTION_TEMPO: 2 }), normalizedAtom("slow", { ACTION_TEMPO: -2 })];
    const opposite = rankInterpretationCandidates(atoms.map(e => ({ ...seed(e.id, [e], 2), primaryAxes: ["ACTION_TEMPO"] })), atoms);
    expect(opposite.duplicateGroups).toEqual([]);
  });
  it("signature requires independent support; strong core can qualify without inventing a deeper structure", () => {
    const core = normalizedAtom("core", { PRECISION: 2, DEPTH: 1 }), support = normalizedAtom("support", { DEPTH: 2 }, { tier: "SUPPORT" });
    const input = { ...seed("core-with-support", [core, support], 2), source: "SYNTHESIS" as const, primaryAxes: ["PRECISION", "DEPTH"] as const };
    const rank = (atoms: EvidenceAtom[]) => rankInterpretationCandidates([{ ...input, primaryAxes: [...input.primaryAxes] }], atoms).candidates[0];
    expect(rank([core, support])).toMatchObject({ signatureEligible: true, rank: "SIGNATURE", synthesisDepth: 2 });
    expect(rank([core, { ...support, family: core.family }]).signatureEligible).toBe(false);
    expect(rank([core, { ...support, strength: "WEAK" }]).signatureEligible).toBe(false);
  });
  it("saturation is monotonic, bounded, sign-preserving, and does not overwrite sums", () => {
    const values = [-1e6, -10, -1, 0, 1, 10, 1e6], normalized = values.map(normalizeContentScore);
    expect(normalized).toEqual([...normalized].sort((a, b) => a - b));
    normalized.forEach((n, i) => { expect(Math.abs(n)).toBeLessThan(1); expect(Math.sign(n)).toBe(Math.sign(values[i])); });
    const p = run(Array.from({ length: 100 }, (_, i) => normalizedAtom(`same:${i}`, { PRECISION: 2 }, { family: "same" })));
    expect(p.axes.PRECISION).toBe(200); expect(p.normalizedAxes.PRECISION).toBeLessThan(1);
    expect(p.dominantAxes[0].familyDiversity).toBe(1);
  });
  it.each([{ keys: ["JANGSEONG", "BANAN"] }, { keys: ["HYEONCHIM", "GWIMUN"] }] satisfies { keys: FoundationMarker[] }[])("amplifier-only $keys cannot become Main/Signature", ({ keys }) => {
    const atoms = markerAtoms(keys), p = run(atoms);
    expect(p.signatureCandidates).toEqual([]); expect(p.mainCandidates).toEqual([]);
    expect(p.rankedCandidates.every(c => !c.signatureEligible && c.rank === "SUPPORT")).toBe(true);
    expect(p.diagnostics.amplifierOnlyCandidates.length).toBeGreaterThan(0);
    const ranked = rankInterpretationCandidates([seed("explicit-two-marker-composite", atoms, 3)], atoms).candidates[0];
    expect(ranked).toMatchObject({ signatureEligible: false, mainEligible: false, rank: "SUPPORT" });
  });
});

describe("13D-1D tensions / five human-pattern types", () => {
  it("+3 / -2.5 retains +0.5 net AND both magnitudes, including evidence references", () => {
    const a = normalizedAtom("fast", { ACTION_TEMPO: 3 }), b = normalizedAtom("slow", { ACTION_TEMPO: -2.5 });
    const p = run([a, b]), axis = p.dominantAxes.find(a => a.axis === "ACTION_TEMPO")!;
    expect(axis).toMatchObject({ netScore: 0.5, positiveMagnitude: 3, negativeMagnitude: 2.5, absoluteStrength: 5.5, familyDiversity: 2, positiveOrNegativeDirection: "positive" });
    expect(p.tensionCandidates[0]).toMatchObject({ axis: "ACTION_TEMPO", positiveSideEvidenceIds: ["fast"], negativeSideEvidenceIds: ["slow"], quality: "MAIN", positiveScore: 3, negativeScore: 2.5 });
    expect(p.tensionCandidates[0].confidence).toBeUndefined();
  });
  it.each(MYEONGLI_CONDITION_RULES)("$id: independent meaningful sources offer safe condition splits", rule => {
    const p = run([normalizedAtom("left", { [rule.left]: 2 }), normalizedAtom("right", { [rule.right]: 2 }, { contexts: ["stress"] })]);
    const t = p.tensionCandidates.find(t => t.id === `tension:${rule.id}`)!;
    expect(t).toMatchObject({ candidateConditionSplits: [...rule.splits], quality: "MAIN", sourceDescription: rule.description });
    expect(p.humanPatternCandidates.find(h => h.id === t.id)?.patternType).toBe("TENSION");
  });
  it("seven safe split types only; no weak-only, self-contradiction or guessed private context", () => {
    expect(new Set(MYEONGLI_CONDITION_RULES.flatMap(r => r.splits))).toEqual(new Set(MYEONGLI_CONDITION_SPLITS));
    expect(detectMyeongliTensions([normalizedAtom("one", { DEPTH: 2, ACTION_TEMPO: 2 })])).toEqual([]);
    const a = normalizedAtom("fast", { ACTION_TEMPO: 2 }), b = normalizedAtom("slow", { ACTION_TEMPO: -1 }, { strength: "WEAK" });
    expect(detectMyeongliTensions([a, b])).toEqual([]);
    expect(detectMyeongliTensions([a, { ...b, strength: "MEDIUM", tier: "AMPLIFIER", weight: 0.1 }])[0].quality).toBe("SUPPORT");
    expect(detectMyeongliTensions([a, { ...b, strength: "STRONG", family: a.family }])).toEqual([]);
  });
  it("strength/shadow uses registry strings, adds no advice and no extra axis contribution", () => {
    const f = elementFixture(), p = value(integrateMyeongliFoundation(f));
    const pair = p.strengthShadowPairs.find(x => x.semanticTheme === "PRECISE_DEEP_ANALYSIS")!;
    const original = f.synthesisCandidates.find(x => x.semanticTheme === "PRECISE_DEEP_ANALYSIS")!;
    expect(pair).toMatchObject({ strengthDescription: original.positiveMeaning, shadowDescription: original.shadowMeaning, evidenceIds: original.evidenceIds });
    expect(p.humanPatternCandidates.some(h => h.patternType === "STRENGTH_SHADOW")).toBe(true);
    expect(p.humanPatternCandidates.some(h => h.patternType === "COMPOSITE")).toBe(true);
  });
});

describe("13D-1D hard errors are not human tensions", () => {
  const cases: [string, (e: EvidenceAtom) => EvidenceAtom[]][] = [
    ["CONFLICTING_CANONICAL_STATE", e => [{ ...e, sourceType: "element", sourceKey: "METAL", metadata: { ...e.metadata, state: "STRONG" } }, { ...e, id: "conflict", sourceType: "element", sourceKey: "METAL", metadata: { ...e.metadata, state: "WEAK" } }]],
    ["UNKNOWN_SEMANTIC_AXIS", e => [{ ...e, axes: { UNKNOWN_AXIS: 1 } as EvidenceAtom["axes"] }]],
    ["DUPLICATE_EVIDENCE_ID_CONFLICT", e => [e, { ...e, weight: 2 }]],
    ["INVALID_FAMILY_MULTIPLIER", e => [{ ...e, metadata: { ...e.metadata, familyRank: 2, familyMultiplier: 1, rawWeight: 1, effectiveWeight: 1 } }]],
    ["IMPOSSIBLE_YIN_YANG_COUNT", e => [{ ...e, sourceType: "yin_yang", metadata: { ...e.metadata, yinCount: 7, yangCount: 7 } }]],
    ["MALFORMED_PROVENANCE", e => [{ ...e, metadata: { provenance: [] } }]],
    ["MALFORMED_PROVENANCE", e => [{ ...e, metadata: { provenance: { fake: true } } }]],
    ["INVALID_AXIS_CONTRIBUTION", e => [{ ...e, axes: { DEPTH: -1 } }]],
    ["INVALID_AXIS_CONTRIBUTION", e => [{ ...e, axes: { DEPTH: NaN } }]],
    ["INVALID_EVIDENCE_WEIGHT", e => [{ ...e, weight: Infinity }]],
    ["INVALID_CANONICAL_CONFIDENCE", e => [{ ...e, metadata: { ...e.metadata, canonicalConfidence: 2 } }]],
    ["INVALID_EVIDENCE_CLASSIFICATION", e => [{ ...e, tier: "UNKNOWN" as EvidenceAtom["tier"] }]],
    ["INVALID_EVIDENCE_CLASSIFICATION", e => [{ ...e, strength: "HIGH" as EvidenceAtom["strength"] }]],
    ["INVALID_POSITION_WEIGHT", e => [{ ...e, metadata: { ...e.metadata, positionWeight: 0 } }]],
  ];
  it.each(cases)("%s produces no partial profile or interpretation", (code, change) => {
    const r = integrateMyeongliFoundation({ evidence: change(normalizedAtom("a", { PRECISION: 1 })), synthesisCandidates: [] });
    expect(r.ok).toBe(false); if (r.ok) return;
    expect(r.diagnostics.hardErrors.some(e => e.code === code)).toBe(true); expect(r).not.toHaveProperty("value");
    expect(r.diagnostics.tensionCount).toBe(0);
  });
  it("missing synthesis refs fail; exact duplicate atoms coalesce without mutation", () => {
    const f = elementFixture(), c = f.synthesisCandidates[0];
    const r = integrateMyeongliFoundation({ evidence: f.evidence, synthesisCandidates: [{ ...c, evidenceIds: ["not-present"] }] });
    expect(r.ok).toBe(false); if (!r.ok) expect(r.diagnostics.hardErrors[0].code).toBe("MISSING_SYNTHESIS_EVIDENCE");
    expect(run([...f.evidence, ...f.evidence]).evidence).toHaveLength(f.evidence.length);
  });
  it("1C canonical relation identity cannot hide conflicting formation states behind different evidence IDs", () => {
    const fact = normalizedAtom("present", {}, { sourceType: "relation", sourceKey: "YUKHAP", metadata: {
      provenance: ["normalized:relation"], canonicalIds: ["pair:one"], canonicalRelationId: "pair:one", canonicalFormationState: "present",
    } });
    const r = integrateMyeongliFoundation({ evidence: [fact, { ...fact, id: "absent", metadata: { ...fact.metadata, canonicalFormationState: "absent" } }], synthesisCandidates: [] });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.diagnostics.hardErrors).toContainEqual({ code: "CONFLICTING_CANONICAL_STATE", evidenceIds: ["absent", "present"], detail: "relation:pair:one" });
  });
  it("unsupported relations and mangsin cannot enter via the normalized hook", () => {
    const unsupported = ["SAMHAP", "BANHAP", "HYEONG", "PA", "HAE"].map(k => normalizedAtom(k, {}, { sourceType: "relation", sourceKey: k }));
    unsupported.push(normalizedAtom("MANGSIN", {}, { sourceType: "shinsal", sourceKey: "MANGSIN" }));
    const p = run(unsupported);
    expect(p.evidence).toEqual([]); expect(p.rankedCandidates).toEqual([]);
    expect(p.diagnostics.suppressedEvidence).toHaveLength(6);
    expect(p.diagnostics.unsupportedCanonicalFeatures).toEqual(["SAMHAP", "BANHAP", "HYEONG", "PA", "HAE", "MANGSIN"]);
  });
  it("a synthesis depending on suppressed evidence is quarantined too, never partially promoted", () => {
    const f = elementFixture(), blocked = normalizedAtom("blocked", {}, { sourceType: "shinsal", sourceKey: "MANGSIN" });
    const p = run([...f.evidence, blocked], [{ ...f.synthesisCandidates[0], evidenceIds: [f.evidence[0].id, blocked.id] }]);
    expect(p.synthesisCandidates).toEqual([]);
    expect(p.diagnostics.suppressedEvidence.some(d => d.code === "SYNTHESIS_DEPENDS_ON_SUPPRESSED_EVIDENCE")).toBe(true);
    expect(p.rankedCandidates.every(c => !c.evidenceIds.includes(blocked.id))).toBe(true);
  });
  it("actual invalid calendar/contradictory element labels fail closed", () => {
    const calc = fixtureInput(NARRATIVE_FIXTURES[0]).calculation;
    calc.elements.labels = ["METAL_STRONG", "METAL_WEAK"];
    const r = buildIntegratedMyeongliProfile(calc); expect(r.ok).toBe(false);
    if (!r.ok) expect(r.diagnostics.hardErrors.some(e => e.code === "CONFLICTING_ELEMENT_LABELS")).toBe(true);
  });
});

describe("13D-1D internal debug / language / fortune safety", () => {
  it("full debug fields serialize and preserve all dynamic/fortune support without promotion", () => {
    const p = run(markerAtoms(["CHEONEUL", "JANGSEONG", "BANAN", "DOHWA", "JAEGO"]));
    expect(p.fortuneSignals.map(s => s.tag)).toEqual(expect.arrayContaining(["HELPER_LUCK", "VISIBLE_AUTHORITY", "POSITION", "FIRST_IMPRESSION", "ACCUMULATION"]));
    expect(p.fortuneSignals.every(s => s.promotion === "SUPPORT_ONLY")).toBe(true);
    const debug = buildMyeongliDebugView(p);
    for (const key of ["topAxes", "signatureCandidates", "mainCandidates", "supportCandidates", "tensions", "semanticThemes", "evidenceFamilies", "fortuneSignals", "dynamicSignals", "diagnostics"]) expect(debug).toHaveProperty(key);
    expect(JSON.parse(JSON.stringify(debug))).toEqual(debug);
    expect(p).not.toHaveProperty("claims"); expect(p).not.toHaveProperty("coreGyeol");
  });
  it("source prose keeps plain-language meanings and contains no strong fortune claims", () => {
    const profiles = [value(integrateMyeongliFoundation(elementFixture())), value(integrateMyeongliFoundation(godFixture(["PEER", "OUTPUT", "WEALTH", "OFFICER", "RESOURCE"]))),
      ...NARRATIVE_FIXTURES.map(f => value(buildIntegratedMyeongliProfile(fixtureInput(f).calculation)))];
    const text = profiles.flatMap(p => p.humanPatternCandidates.flatMap(h => [h.sourceDescription, h.positiveMeaning, h.shadowMeaning])).join(" ");
    expect(text).not.toMatch(/발현|상호작용|양상|사회적 지위|역할과 이름|내적 성찰|재정적 성취|경향성이 있습니다/);
    expect(text).not.toMatch(/재물운이 좋습니다|돈과 명예를 같이 노려볼 만한 패|사람복이 있습니다|높은 직책을 얻습니다|승진운이 있습니다|사업에 성공합니다/);
    const types = new Set(profiles.flatMap(p => p.humanPatternCandidates.map(h => h.patternType)));
    expect(types).toEqual(new Set(["COMPOSITE", "TENSION", "STRENGTH_SHADOW", "PROCESS", "VALUE_CONFLICT"]));
  });
});
