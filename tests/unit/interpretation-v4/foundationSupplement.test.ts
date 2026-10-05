import { describe, expect, it } from "vitest";
import { calculateSaju } from "../../../src/lib/saju/calculateSaju";
import { buildCanonicalNatalTable } from "../../../src/lib/report-knowledge/natalTableEvidence";
import { SEMANTIC_AXES, aggregateSemanticEvidence, type EvidenceAtom } from "../../../src/lib/interpretation-v4/semanticCore";
import { RELATION_SEMANTICS, RELATIONS_WITHOUT_NATAL_PRODUCER, type FoundationRelation } from "../../../src/lib/interpretation-v4/foundationRelations";
import { TWELVE_STAGE_SEMANTICS } from "../../../src/lib/interpretation-v4/foundationTwelveStages";
import { SHINSAL_SEMANTICS, NATAL_MARKER_ALIASES, foundationMarkerKey, type FoundationMarker } from "../../../src/lib/interpretation-v4/foundationShinsal";
import { applyFamilyDiminishingReturns, summarizeSupplementFamilies } from "../../../src/lib/interpretation-v4/foundationShinsalFamilies";
import { projectFoundationSupplement, adaptSupplementTable, buildFoundationSupplementFromCalculation, type FoundationSupplementInput, type NormalizedRelationFact, type NormalizedMarkerFact } from "../../../src/lib/interpretation-v4/foundationSupplement";
import { buildNatalFoundationFromCalculation } from "../../../src/lib/interpretation-v4/foundationNatalProfile";
import { TEN_GOD_SEMANTICS } from "../../../src/lib/interpretation-v4/foundationTenGods";
import { NARRATIVE_FIXTURES, fixtureInput } from "./narrativeFixtures";

// Explicit normalized facts test semantic mapping, never pretend to be charts.
const fact = (canonicalId: string) => ({ canonicalId, scope: "natal" as const, certainty: "confirmed" as const,
  provenance: [`explicit-normalized-fixture:${canonicalId}`], involvedPillars: ["day", "month"],
  involvedCharacters: ["子", "丑"], involvedSlots: ["branch" as const] });
const relation = (relationType: FoundationRelation): NormalizedRelationFact => ({ ...fact(relationType), relationType, canonicalFormationState: "present" });
const marker = (key: FoundationMarker): NormalizedMarkerFact => {
  const featureId = Object.keys(NATAL_MARKER_ALIASES).find(id => NATAL_MARKER_ALIASES[id] === key)!;
  return { ...fact(featureId), featureId, basis: "explicit-normalized-fixture" };
};
const run = (input: Partial<FoundationSupplementInput>) => projectFoundationSupplement({ relations: [], stages: [], markers: [], ...input });
const base = { birthDate: "1996-12-06", birthTimeUnknown: false, calendarType: "SOLAR", gender: "MALE", timezone: "Asia/Seoul" } as const;
const exact = () => calculateSaju({ ...base, birthTime: "14:15", birthTimeUnknown: false, birthTimePrecision: "exact" });

describe("13D-1C explicit upstream relation/stage boundary", () => {
  it.each(Object.keys(RELATION_SEMANTICS) as FoundationRelation[])("%s keeps source positions/formation and dynamic semantics", type => {
    const input = relation(type), atom = run({ relations: [input] }).evidence[0];
    expect(atom).toMatchObject({ sourceType: "relation", sourceKey: type, kind: "DYNAMIC", tier: RELATION_SEMANTICS[type].tier,
      dynamicTags: [...RELATION_SEMANTICS[type].dynamicTags], metadata: { canonicalRelationId: input.canonicalId,
        canonicalFormationState: "present", involvedPillars: ["day", "month"], involvedCharacters: ["丑", "子"],
        involvedSlots: ["branch"], canonicalFact: input, claimPolicy: "SUPPORT_ONLY", standaloneMainClaim: false } });
  });
  it("matching glyphs alone cannot generate a trine or transform elements", () => {
    expect(run({}).evidence).toEqual([]);
    for (const type of ["SAMHAP", "BANHAP"] as const) for (const state of ["unconfirmed", "absent"] as const)
      expect(run({ relations: [{ ...relation(type), involvedCharacters: ["申", "子", "辰"], canonicalFormationState: state }] }).evidence).toEqual([]);
    expect(run({ relations: [{ ...relation("SAMHAP"), canonicalFormationState: "partial" }] }).evidence).toEqual([]);
    expect(run({ relations: [{ ...relation("BANHAP"), canonicalFormationState: "partial" }] }).evidence).toHaveLength(1);
    const transformed = run({ relations: [{ ...relation("SAMHAP"), canonicalFormationState: "formed", targetElement: "WATER" }] });
    expect(transformed.evidence[0].metadata?.targetElement).toBe("WATER");
    expect(Object.values(transformed.axes).every(v => v === 0)).toBe(true);
    expect(transformed.evidence[0].axes).toEqual({});
  });
  it("no raw-pair formation fallback, no unknown label parsing", () => {
    const table = buildCanonicalNatalTable(exact().birthTimeContext!)!;
    const stripped = { ...table, relations: [], features: table.features.filter(f => f.id !== "sinsal_wonjin") };
    expect(adaptSupplementTable(stripped).relations).toEqual([]);
    const unknown = { ...stripped, relations: [{ id: "unknown", label: "申子辰 삼합", positions: ["day", "month"], participants: ["申", "子", "辰"] }] };
    expect(adaptSupplementTable(unknown).relations).toEqual([]);
    expect(RELATIONS_WITHOUT_NATAL_PRODUCER).toEqual(["SAMHAP", "BANHAP", "HYEONG", "PA", "HAE"]);
  });
  it("coexistence of clash and binding is retained, never good/bad cancellation", () => {
    const p = run({ relations: [relation("CHUNG"), relation("STEM_HAP")] });
    expect(p.evidence).toHaveLength(2);
    expect(p.evidence.every(e => e.kind === "DYNAMIC")).toBe(true);
    expect(p.evidence.flatMap(e => e.dynamicTags!)).toEqual(expect.arrayContaining(["BINDING", "CHANGE_PRESSURE"]));
    expect(p.axes.ADAPTABILITY).toBe(0.5);
    expect(p).not.toHaveProperty("score");
  });
  it("duplicate canonical facts merge provenance; conflicting identity fails closed", () => {
    const a = relation("STEM_HAP"), b = { ...a, provenance: ["another-source"] };
    const p = run({ relations: [a, b] });
    expect(p).toEqual(run({ relations: [b, a] }));
    expect(p.evidence).toHaveLength(1);
    expect(p.evidence[0].metadata?.provenance).toEqual(["another-source", ...a.provenance]);
    const conflict = run({ relations: [a, { ...b, relationType: "CHUNG" }] });
    expect(conflict.evidence).toHaveLength(0);
    expect(conflict.suppressed).toEqual([{ canonicalId: a.canonicalId, reason: "CONFLICTING_CANONICAL_FACT" }]);
    const stage = { ...fact("day-stage"), stage: "장생" as const };
    expect(run({ stages: [stage, { ...stage, provenance: ["second-stage-source"] }] }).evidence).toHaveLength(1);
    expect(run({ stages: [stage, { ...stage, stage: "제왕" }] }).evidence).toHaveLength(0);
  });
  it("non-natal, unconfirmed or unproven facts cannot activate", () => {
    for (const change of [{ scope: "transit" as const }, { scope: "pair" as const }, { certainty: "conditional" as const }, { provenance: [] }, { canonicalId: "" }]) {
      const p = run({ relations: [{ ...relation("CHUNG"), ...change }], stages: [{ ...fact("stage"), stage: "장생", ...change }], markers: [{ ...marker("DOHWA"), ...change }] });
      expect(p.evidence).toHaveLength(0); expect(p.suppressed).toHaveLength(3);
    }
  });
  it("twelve stages never become personality heroes, disease/death or fate claims", () => {
    const stages = Object.keys(TWELVE_STAGE_SEMANTICS) as (keyof typeof TWELVE_STAGE_SEMANTICS)[];
    const p = run({ stages: stages.map(stage => ({ ...fact(stage), stage })) });
    expect(p.evidence).toHaveLength(12);
    for (const e of p.evidence) expect(e).toMatchObject({ tier: "AMPLIFIER", strength: "MEDIUM", metadata: { standaloneMainClaim: false, fortunePromotion: false } });
    expect(JSON.stringify(p)).not.toMatch(/질병|죽음|무덤|불행|반드시 성공/);
    expect(p).not.toHaveProperty("claims");
  });
});

describe("13D-1C alias dedup / family contribution ledger", () => {
  it("all native/extractor/12-shinsal aliases keep one atom and every canonical source", () => {
    const aliases = Object.keys(NATAL_MARKER_ALIASES).filter(id => NATAL_MARKER_ALIASES[id] === "YEOKMA");
    aliases.push("twelve_sinsal_yeokma:day-reference");
    const markers = aliases.map((featureId, i) => ({ ...fact(`source-${i}`), featureId, basis: `basis-${i}` }));
    const p = run({ markers });
    expect(p).toEqual(run({ markers: [...markers].reverse() }));
    expect(p.evidence).toHaveLength(1);
    expect(p.evidence[0]).toMatchObject({ sourceKey: "YEOKMA", metadata: { familyRank: 1, rawWeight: 0.5, effectiveWeight: 0.5 } });
    expect(p.evidence[0].metadata?.canonicalSources).toHaveLength(aliases.length);
    expect(p.evidence[0].metadata?.aliases).toEqual([...aliases].sort());
    expect(p.evidence[0].metadata?.provenance).toHaveLength(aliases.length);
    expect(run({ markers: [...markers, ...markers] })).toEqual(p);
  });
  it("all 27 registered identities are distinct; 26 activate, ambiguous mangsin does not", () => {
    const input = Object.keys(NATAL_MARKER_ALIASES).map(featureId => ({ ...fact(featureId), featureId, basis: "normalized" }));
    const p = run({ markers: input });
    expect(p.evidence).toHaveLength(26);
    expect(new Set(p.evidence.map(e => e.sourceKey)).size).toBe(26);
    expect(p.evidence.some(e => e.sourceKey === "MANGSIN")).toBe(false);
    expect(p.suppressed.every(s => s.reason === "MANGSIN_CANONICAL_RULE_CONFLICT")).toBe(true);
    expect(p).toEqual(run({ markers: [...input].reverse() }));
  });
  it("DB-only markers and mangsin aliases never bypass the evidence gate", () => {
    for (const featureId of ["gwiin_mungok", "gwiin_bokseong", "gwiin_cheoneui", "fictional:DOHWA", "도화살", "constructor", "__proto__"])
      expect(run({ markers: [{ ...fact(featureId), featureId, basis: "DB-only" }] }).evidence).toHaveLength(0);
    const disguised = { ...marker("DOHWA"), provenance: ["shinsal:TWELVE_MANGSINSAL"] };
    expect(run({ markers: [disguised] }).suppressed[0].reason).toBe("MANGSIN_CANONICAL_RULE_CONFLICT");
  });
  it.each([
    ["DOHWA", "NYEON"], ["JANGSEONG", "BANAN"], ["CHEONDEOK", "WOLDEOK"], ["GOSIN", "GWASUK"], ["GWIMUN", "HWAGAE"],
  ] as const)("%s + %s retains both atoms but halves the second contribution", (first, second) => {
    const p = run({ markers: [marker(second), marker(first)] });
    const a = p.evidence.find(e => e.sourceKey === first)!, b = p.evidence.find(e => e.sourceKey === second)!;
    expect(p.evidence).toHaveLength(2);
    expect(a.metadata).toMatchObject({ familyRank: 1, familyMultiplier: 1 });
    expect(b.metadata).toMatchObject({ familyRank: 2, familyMultiplier: 0.5 });
    expect(b.weight).toBe(Number(b.metadata?.rawWeight) * 0.5);
    const summary = p.families[0];
    expect(summary.evidenceIds).toHaveLength(2); expect(summary.semanticTheme).toBe(b.family);
    for (const axis of SEMANTIC_AXES) {
      const rawContribution = summary.rawContribution.contributions[axis]?.find(c => c.evidenceId === b.id);
      const effective = summary.effectiveContribution.contributions[axis]?.find(c => c.evidenceId === b.id);
      if (rawContribution) expect(effective!.weightedValue).toBe(rawContribution.weightedValue * 0.5);
    }
    expect(summary.rawFortuneTags).toEqual(summarizeSupplementFamilies(p.evidence.map(e => ({ ...e, weight: Number(e.metadata!.rawWeight) })))[0].effectiveFortuneTags);
  });
  it("four-plus ranks: 1/.5/.25/.1/.1, stable priority/tier/strength and idempotence", () => {
    const original = run({ markers: [marker("DOHWA")] }).evidence[0];
    const inputs = ["e", "c", "a", "d", "b"].map(id => ({ ...original, id, weight: 2, axes: { CHARISMA: 1, RELATION_STYLE: -1 }, metadata: { rawWeight: 2 } }));
    const before = structuredClone(inputs), output = applyFamilyDiminishingReturns(inputs);
    expect(output.map(e => e.id)).toEqual(["a", "b", "c", "d", "e"]);
    expect(output.map(e => e.metadata?.familyMultiplier)).toEqual([1, 0.5, 0.25, 0.1, 0.1]);
    expect(output.map(e => e.weight)).toEqual([2, 1, 0.5, 0.2, 0.2]);
    expect(output.map(e => e.metadata?.familyRank)).toEqual([1, 2, 3, 4, 5]);
    expect(aggregateSemanticEvidence(output).axes.RELATION_STYLE).toBeCloseTo(-3.9, 12);
    expect(applyFamilyDiminishingReturns([...inputs].reverse())).toEqual(output);
    expect(applyFamilyDiminishingReturns(output)).toEqual(output);
    expect(inputs).toEqual(before);
    const priority = inputs.map(e => ({ ...e, metadata: { ...e.metadata, stablePriority: e.id === "e" ? 10 : 0 } }));
    expect(applyFamilyDiminishingReturns(priority)[0].id).toBe("e");
    expect(applyFamilyDiminishingReturns([priority[0], { ...priority[1], tier: "SUPPORT" }])[0].id).toBe("c");
    expect(applyFamilyDiminishingReturns([priority[0], { ...priority[1], strength: "STRONG" }])[0].id).toBe("c");
  });
  it("no strong customer fortune claims, including multi-positive groups", () => {
    for (const keys of [["CHEONEUL"], ["JANGSEONG", "BANAN"], ["DOHWA", "HONGYEOM"], ["JAEGO"]] as FoundationMarker[][]) {
      const p = run({ markers: keys.map(marker) });
      expect(p).not.toHaveProperty("claims"); expect(p).not.toHaveProperty("synthesisCandidates");
      for (const e of p.evidence) expect(e.metadata).toMatchObject({ standaloneMainClaim: false, fortunePromotion: false, claimPolicy: "SUPPORT_ONLY" });
      expect(JSON.stringify(p)).not.toMatch(/사람복이 있습니다|명예운이 좋습니다|높은 직책을 얻습니다|이성운이 좋습니다|부자입니다|재물운이 좋습니다/);
    }
  });
});

describe("13D-1C canonical producer reuse and prior profile lock", () => {
  it.each(NARRATIVE_FIXTURES)("$id: canonical table parity, provenance, deterministic and immutable", fixture => {
    const calc = fixtureInput(fixture).calculation, before = structuredClone(calc);
    const prior = buildNatalFoundationFromCalculation(calc);
    const table = buildCanonicalNatalTable(calc.birthTimeContext!)!, input = adaptSupplementTable(table);
    const result = buildFoundationSupplementFromCalculation(calc);
    expect(result.ok).toBe(true); if (!result.ok) return;
    const p = result.value;
    expect(p).toMatchObject(projectFoundationSupplement(input));
    expect(buildFoundationSupplementFromCalculation(calc)).toEqual(result);
    expect(JSON.parse(JSON.stringify(result))).toEqual(result);
    expect(buildNatalFoundationFromCalculation(calc)).toEqual(prior);
    expect(calc).toEqual(before);
    expect(new Set(p.evidence.map(e => e.id)).size).toBe(p.evidence.length);
    expect(p.evidence.filter(e => e.sourceType === "twelve_stage")).toHaveLength(table.pillars.flatMap(p => p.twelveLifeStage ?? []).length);
    for (const e of p.evidence) {
      expect(e.metadata?.provenance).not.toHaveLength(0);
      expect(e.metadata).toMatchObject({ rawWeight: expect.any(Number), effectiveWeight: e.weight, canonicalIds: expect.any(Array), involvedPillars: expect.any(Array) });
      expect(e.strength).not.toBe("STRONG"); expect(e.tier).not.toBe("CORE");
      for (const id of e.metadata!.canonicalIds as string[]) {
        expect([...input.relations, ...input.stages, ...input.markers].some(f => f.canonicalId === id)).toBe(true);
      }
    }
    expect(aggregateSemanticEvidence(p.evidence)).toMatchObject({ axes: p.axes, contributions: p.contributions });
    expect(p.evidence.filter(e => e.sourceType === "relation").every(e => ["STEM_HAP", "YUKHAP", "CHUNG", "WONJIN"].includes(e.sourceKey))).toBe(true);
    const wonjin = p.evidence.find(e => e.sourceKey === "WONJIN");
    if (wonjin) expect(wonjin.metadata?.involvedCharacters).toEqual([]);
  });
  it("exact / approximate / unknown time never invents an hour or a time-specific marker", () => {
    const charts = [exact(), calculateSaju({ ...base, birthTimePrecision: "approximate", approximateBirthTimeSlot: "MISI" }),
      calculateSaju({ ...base, birthTimePrecision: "unknown", birthTimeUnknown: true })];
    charts.forEach((calc, index) => {
      const p = buildFoundationSupplementFromCalculation(calc); expect(p.ok).toBe(true); if (!p.ok) return;
      expect(p.value.evidence.filter(e => e.sourceType === "twelve_stage")).toHaveLength(index === 2 ? 3 : 4);
      if (index === 2) {
        expect(calc.pillars.hour).toBeUndefined();
        for (const e of p.value.evidence) expect(e.metadata?.involvedPillars).not.toContain("hour");
      }
    });
    expect(charts[1].input.birthTime).toBeUndefined();
    expect(buildFoundationSupplementFromCalculation(charts[0])).toEqual(buildFoundationSupplementFromCalculation(charts[1]));
  });
  it("invalid or mismatched canonical context cannot enter the adapter", () => {
    const missing = exact(); delete missing.birthTimeContext;
    expect(buildFoundationSupplementFromCalculation(missing)).toEqual({ ok: false, error: "UNVERIFIED_CANONICAL_CHART" });
    const mismatch = exact(); mismatch.pillars.day.stem = mismatch.pillars.day.stem === "甲" ? "乙" : "甲";
    expect(buildFoundationSupplementFromCalculation(mismatch).ok).toBe(false);
  });
  it("real birth-date coverage: all supported markers and twelve stages come from producers", () => {
    const found = new Set<string>(), stages = new Set<string>(), relations = new Set<string>();
    for (let year = 1984; year <= 1988; year++) for (let month = 1; month <= 12; month++) {
      const calc = calculateSaju({ ...base, birthDate: `${year}-${String(month).padStart(2, "0")}-18`, birthTime: "13:30", birthTimePrecision: "exact" });
      const table = buildCanonicalNatalTable(calc.birthTimeContext!)!, p = buildFoundationSupplementFromCalculation(calc);
      expect(p.ok).toBe(true); if (!p.ok) continue;
      const canonicalKeys = table.features.map(f => foundationMarkerKey(f.id));
      for (const e of p.value.evidence) {
        if (e.sourceType === "shinsal" || e.sourceType === "gwiin") { expect(canonicalKeys).toContain(e.sourceKey); found.add(e.sourceKey); }
        if (e.sourceType === "twelve_stage") stages.add(e.sourceKey);
        if (e.sourceType === "relation") relations.add(e.sourceKey);
      }
    }
    expect([...found].sort()).toEqual(Object.keys(SHINSAL_SEMANTICS).filter(k => k !== "MANGSIN").sort());
    expect(stages.size).toBe(12);
    expect([...relations].sort()).toEqual(["CHUNG", "STEM_HAP", "WONJIN", "YUKHAP"]);
  });
});

describe("13D-1C required cross-layer sanity, without a final profile integration", () => {
  const god = (key: "偏官" | "偏印"): EvidenceAtom => ({ id: `explicit:${key}`, sourceType: "ten_god", sourceKey: key,
    kind: "TRAIT", tier: "CORE", strength: "STRONG", weight: 1, ...TEN_GOD_SEMANTICS[key], contexts: [...TEN_GOD_SEMANTICS[key].contexts],
    metadata: { provenance: [`explicit-normalized-fixture:${key}`] } });
  it("A: meaningful authority core + two position amplifiers stays evidence-only", () => {
    const core = god("偏官"), p = run({ markers: [marker("JANGSEONG"), marker("BANAN")] });
    expect(core.axes.LEADERSHIP).toBe(2);
    expect(p.families[0].effectiveFortuneTags).toEqual({ POSITION: 0.25, RECOGNITION: 0.25, VISIBLE_AUTHORITY: 0.5 });
    expect(aggregateSemanticEvidence([core, ...p.evidence]).axes.LEADERSHIP).toBe(2.5);
    expect(p).not.toHaveProperty("claims");
  });
  it("B: indirect-resource depth + precision / guimun retains separate provenance", () => {
    const core = god("偏印"), p = run({ markers: [marker("HYEONCHIM"), marker("GWIMUN")] });
    expect(p.families.map(f => f.family)).toEqual(["DEEP_SENSITIVITY", "PRECISION"]);
    const totals = aggregateSemanticEvidence([core, ...p.evidence]);
    expect(totals.axes).toMatchObject({ PRECISION: 1, DEPTH: 2.5, PATTERN_SENSE: 2.5 });
    expect(JSON.stringify(p)).not.toMatch(/정신질환|귀신|환청/);
  });
  it("C: first-impression visibility differs from intimate charm", () => {
    const p = run({ markers: [marker("DOHWA"), marker("NYEON"), marker("HONGYEOM")] });
    expect(p.families).toHaveLength(2);
    expect(p.evidence.find(e => e.sourceKey === "NYEON")!.metadata?.familyMultiplier).toBe(0.5);
    expect(p.evidence.find(e => e.sourceKey === "HONGYEOM")!.metadata?.familyMultiplier).toBe(1);
    expect(p.evidence.find(e => e.sourceKey === "DOHWA")!.fortuneTags).toHaveProperty("FIRST_IMPRESSION");
    expect(p.evidence.find(e => e.sourceKey === "HONGYEOM")!.fortuneTags).toHaveProperty("INTIMATE_CHARM");
  });
});
