import { describe, expect, it } from "vitest";
import { calculateSaju } from "../../../src/lib/saju/calculateSaju";
import { PILLAR_KEYS } from "../../../src/lib/saju/birthTimePrecisionTypes";
import { HEAVENLY_STEMS, EARTHLY_BRANCHES } from "../../../src/lib/saju/constants";
import { SEMANTIC_AXES, aggregateSemanticEvidence } from "../../../src/lib/interpretation-v4/semanticCore";
import { HEAVENLY_STEM_SEMANTICS as stems, EARTHLY_BRANCH_SEMANTICS as branches, PILLAR_CONTENT_WEIGHTS, effectivePositionWeight } from "../../../src/lib/interpretation-v4/foundationPillars";
import { TEN_GOD_SEMANTICS as gods, TEN_GOD_FAMILIES, TEN_GOD_FAMILY_SEMANTICS } from "../../../src/lib/interpretation-v4/foundationTenGods";
import { buildNatalFoundationFromCalculation } from "../../../src/lib/interpretation-v4/foundationNatalProfile";
import { buildFoundationFromCalculation } from "../../../src/lib/interpretation-v4/foundationProfile";
import { buildMyeongliStructure } from "../../../src/lib/interpretation-v4/structureEvidence";
import { collectStructureAtoms } from "../../../src/lib/interpretation-v4/strength";
import { NARRATIVE_FIXTURES, fixtureInput } from "./narrativeFixtures";

describe("13D-1B exact semantic contracts, not new calculation rules", () => {
  it("10 stems / 12 branches / 10 gods, only existing 36 axes", () => {
    expect(Object.keys(stems)).toEqual([...HEAVENLY_STEMS]);
    expect(Object.keys(branches)).toEqual([...EARTHLY_BRANCHES]);
    expect(Object.keys(gods)).toHaveLength(10);
    expect(SEMANTIC_AXES).toHaveLength(36);
    for (const def of [...Object.values(stems), ...Object.values(branches), ...Object.values(gods)]) {
      for (const key of Object.keys(def.axes)) expect(SEMANTIC_AXES).toContain(key);
      for (const field of ["easyMeaning", "humanDescription", "positiveMeaning", "shadowMeaning"] as const) expect(def[field].length).toBeGreaterThan(8);
    }
    for (const stem of Object.values(stems)) expect(stem.image.length).toBeGreaterThan(5);
    expect(stems.癸.axes.ENERGY_DIRECTION).toBe(-2);
    expect(stems.癸.axes).not.toHaveProperty("INWARDNESS");
  });
  it.each([
    ["甲", { ACTION_TEMPO: 1, CHANGE_ORIENTATION: 1, INITIATIVE: 2, GOAL_DRIVE: 2, EXPANSION: 3, PERSISTENCE: 2, AUTONOMY: 1 }],
    ["乙", { STRUCTURE_STYLE: -1, COMMUNICATION_STYLE: -1, ADAPTABILITY: 3, PERSISTENCE: 2, SOCIAL_ATTUNEMENT: 2, EXPANSION: 2, CARE: 1 }],
    ["丙", { ENERGY_DIRECTION: 3, ACTION_TEMPO: 2, EXPRESSION: 3, CHARISMA: 3, INITIATIVE: 2, SOCIAL_ATTUNEMENT: 1 }],
    ["丁", { ENERGY_DIRECTION: 1, EXPRESSION: 2, CARE: 2, PRECISION: 2, PERSISTENCE: 2, SOCIAL_ATTUNEMENT: 1 }],
    ["戊", { ACTION_TEMPO: -1, CHANGE_ORIENTATION: -2, STABILITY: 3, PERSISTENCE: 3, DUTY: 2, PRACTICALITY: 2, BOUNDARY: 2 }],
    ["己", { CARE: 2, PRACTICALITY: 2, STABILITY: 2, ADAPTABILITY: 2, RESOURCE_SENSE: 1, SOCIAL_ATTUNEMENT: 1 }],
    ["庚", { DECISION_STYLE: 3, COMMUNICATION_STYLE: 3, ACTION_TEMPO: 2, PRECISION: 2, BOUNDARY: 3, DUTY: 1 }],
    ["辛", { COMMUNICATION_STYLE: 1, PRECISION: 3, BOUNDARY: 2, EXPRESSION: 1, CHARISMA: 1, SOCIAL_ATTUNEMENT: 1 }],
    ["壬", { CHANGE_ORIENTATION: 2, ADAPTABILITY: 3, OPPORTUNITY_SENSE: 2, PATTERN_SENSE: 2, EXPANSION: 2, CURIOSITY: 1 }],
    ["癸", { ENERGY_DIRECTION: -2, ACTION_TEMPO: -2, DEPTH: 3, SOCIAL_ATTUNEMENT: 2, PATTERN_SENSE: 2, LEARNING: 2 }],
  ] as const)("stem %s mapping", (key, expected) => expect(stems[key].axes).toEqual(expected));
  it.each([
    ["子", { CHANGE_ORIENTATION: 1, DEPTH: 1, PATTERN_SENSE: 1, RECOVERY_NEED: 1 }],
    ["丑", { ACTION_TEMPO: -1, STABILITY: 2, RESOURCE_SENSE: 2, PERSISTENCE: 2 }],
    ["寅", { CHANGE_ORIENTATION: 1, INITIATIVE: 2, EXPANSION: 2, GOAL_DRIVE: 1 }],
    ["卯", { ADAPTABILITY: 2, SOCIAL_ATTUNEMENT: 1, EXPANSION: 1, CARE: 1 }],
    ["辰", { RESOURCE_SENSE: 1, CHANGE_ORIENTATION: 1, PATTERN_SENSE: 1, STABILITY: 1 }],
    ["巳", { STRATEGY: 1, EXPRESSION: 1, INITIATIVE: 1, PRECISION: 1 }],
    ["午", { ENERGY_DIRECTION: 2, EXPRESSION: 2, CHARISMA: 2, INITIATIVE: 1 }],
    ["未", { CARE: 1, STABILITY: 1, RESOURCE_SENSE: 1, SOCIAL_ATTUNEMENT: 1 }],
    ["申", { DECISION_STYLE: 1, CHANGE_ORIENTATION: 1, PRECISION: 2, STRATEGY: 1 }],
    ["酉", { STRUCTURE_STYLE: 1, PRECISION: 2, BOUNDARY: 1, CHARISMA: 1 }],
    ["戌", { DUTY: 2, BOUNDARY: 2, STABILITY: 1, PERSISTENCE: 1 }],
    ["亥", { DEPTH: 2, CURIOSITY: 1, ADAPTABILITY: 1, RECOVERY_NEED: 1 }],
  ] as const)("branch %s mapping", (key, expected) => expect(branches[key].axes).toEqual(expected));
  it.each([
    ["比肩", { AUTONOMY: 2, PERSISTENCE: 1, BOUNDARY: 1, COMPETITION: 1 }],
    ["劫財", { COMPETITION: 2, EXPANSION: 1, INITIATIVE: 1 }],
    ["食神", { CREATION: 2, EXPRESSION: 2, CARE: 1 }],
    ["傷官", { CHANGE_ORIENTATION: 1, EXPRESSION: 2, CURIOSITY: 1, PRECISION: 1, AUTONOMY: 1 }],
    ["正財", { RESOURCE_SENSE: 2, PRACTICALITY: 2, STABILITY: 2, DUTY: 1 }],
    ["偏財", { OPPORTUNITY_SENSE: 2, RESOURCE_SENSE: 2, EXPANSION: 1, ADAPTABILITY: 1 }],
    ["正官", { STRUCTURE_STYLE: 2, DUTY: 2, STATUS_DRIVE: 2, BOUNDARY: 1 }],
    ["偏官", { DECISION_STYLE: 1, DUTY: 2, LEADERSHIP: 2, GOAL_DRIVE: 1 }],
    ["正印", { LEARNING: 2, CARE: 2, STABILITY: 1, MEANING: 1 }],
    ["偏印", { DEPTH: 2, CURIOSITY: 2, PATTERN_SENSE: 2, AUTONOMY: 1 }],
  ] as const)("god %s mapping", (key, expected) => expect(gods[key].axes).toEqual(expected));
  it("5 families retain both distinct gods; no aliases counted twice", () => {
    expect(TEN_GOD_FAMILIES).toHaveLength(5);
    const members = TEN_GOD_FAMILIES.flatMap(f => TEN_GOD_FAMILY_SEMANTICS[f].members);
    expect(new Set(members).size).toBe(10);
    expect(members).toHaveLength(10);
    for (const family of TEN_GOD_FAMILIES) {
      expect(TEN_GOD_FAMILY_SEMANTICS[family].members).toHaveLength(2);
      for (const god of TEN_GOD_FAMILY_SEMANTICS[family].members) expect(gods[god].family).toBe(family);
    }
  });
  it("8 raw weights and stable effective weights; day master highest", () => {
    expect(PILLAR_CONTENT_WEIGHTS).toEqual({ day: { stem: 5, branch: 4 }, month: { stem: 4, branch: 4 }, hour: { stem: 2.5, branch: 2.5 }, year: { stem: 2, branch: 2 } });
    expect(effectivePositionWeight("day", "stem")).toBe(1);
    expect(effectivePositionWeight("day", "stem")).toBeGreaterThan(effectivePositionWeight("year", "stem"));
    expect(effectivePositionWeight("day", "branch")).toBeGreaterThanOrEqual(effectivePositionWeight("hour", "branch"));
    for (const slot of ["stem", "branch"] as const) expect(effectivePositionWeight("month", slot)).toBeGreaterThan(effectivePositionWeight("year", slot));
  });
});

const base = { birthDate: "1996-12-06", calendarType: "SOLAR", gender: "MALE", timezone: "Asia/Seoul" } as const;
describe("13D-1B actual canonical chart adapter", () => {
  it.each(NARRATIVE_FIXTURES)("$id: immutable, position-preserving, deterministic integrated profile", fixture => {
    const calc = fixtureInput(fixture).calculation, before = JSON.stringify(calc);
    const result = buildNatalFoundationFromCalculation(calc);
    expect(result.ok).toBe(true); if (!result.ok) return;
    const p = result.value, canonicalAtoms = collectStructureAtoms(calc.pillars);
    expect(JSON.parse(JSON.stringify(p))).toEqual(p);
    expect(buildNatalFoundationFromCalculation(calc)).toEqual(result);
    expect(new Set(p.evidence.map(e => e.id)).size).toBe(p.evidence.length);
    expect(new Set(p.synthesisCandidates.map(c => c.id)).size).toBe(p.synthesisCandidates.length);
    const atomicIds = new Set(p.evidence.map(e => e.id));
    for (const candidate of p.synthesisCandidates) for (const id of candidate.evidenceIds) expect(atomicIds.has(id)).toBe(true);
    for (const pillar of PILLAR_KEYS) for (const slot of ["stem", "branch"] as const) {
      const atom = p.evidence.find(e => e.id === `natal:${pillar}:${slot}:${calc.pillars[pillar]?.[slot]}`);
      if (!calc.pillars[pillar]) { expect(atom).toBeUndefined(); continue; }
      expect(atom).toMatchObject({ sourceKey: calc.pillars[pillar]![slot], weight: effectivePositionWeight(pillar, slot),
        metadata: { pillar, slot, isDayMaster: pillar === "day" && slot === "stem", positionWeight: PILLAR_CONTENT_WEIGHTS[pillar][slot], effectiveWeight: effectivePositionWeight(pillar, slot) } });
      if (slot === "branch") expect(atom!.tier).toBe("SUPPORT");
      expect(atom!.metadata!.provenance).toHaveLength(1);
    }
    const tenGods = p.evidence.filter(e => e.sourceType === "ten_god");
    expect(tenGods).toHaveLength(canonicalAtoms.length);
    for (const canonical of canonicalAtoms) {
      const atom = tenGods.find(e => e.id === `natal:ten-god:${canonical.id}`)!;
      expect(atom).toMatchObject({ sourceKey: canonical.god, metadata: { pillar: canonical.position, stem: canonical.stem, location: canonical.location, canonicalWeight: canonical.weight, provenance: [...canonical.provenance] } });
      expect(atom.weight).toBe(canonical.weight * effectivePositionWeight(canonical.position, canonical.location === "visible" ? "stem" : "branch"));
    }
    expect(tenGods.some(a => a.metadata?.pillar === "day" && a.metadata?.location === "visible")).toBe(false);
    expect(p.families.flatMap(f => f.evidenceIds).sort()).toEqual(tenGods.map(a => a.id).sort());
    for (const family of p.families) expect(family.members).toHaveLength(2);
    const totals = aggregateSemanticEvidence(p.evidence);
    expect(p.axes).toEqual(totals.axes);
    for (const axis of SEMANTIC_AXES) {
      expect(p.axes[axis]).toBe(p.contributions[axis]?.reduce((sum, c) => sum + c.weightedValue, 0) ?? 0);
      for (const contribution of p.contributions[axis] ?? []) {
        const atom = p.evidence.find(e => e.id === contribution.evidenceId)!;
        expect(contribution).toMatchObject({ sourceType: atom.sourceType, sourceKey: atom.sourceKey, rawValue: atom.axes[axis], weightedValue: atom.weight === 0 ? 0 : atom.axes[axis]! * atom.weight });
      }
    }
    const old = buildFoundationFromCalculation(calc);
    if (old.ok) expect(p.foundation).toEqual(old.value);
    else { expect(p.foundation).toBeUndefined(); expect(p.foundationUnavailable).toBe("INCOMPLETE_CHART"); expect(p.states).toEqual({ families: {}, gods: {} }); }
    expect(JSON.stringify(calc)).toBe(before);
  });
  it("reuses Phase2 strong-confidence states only, never supported/uncertain as HIGH", () => {
    let promoted = 0;
    for (const fixture of NARRATIVE_FIXTURES) {
      const calc = fixtureInput(fixture).calculation, layer = buildMyeongliStructure(calc), result = buildNatalFoundationFromCalculation(calc);
      expect(result.ok).toBe(true); if (!result.ok) continue;
      const { states } = result.value;
      for (const family of TEN_GOD_FAMILIES) {
        const match = layer.candidates.find(c => c.id === `${family.toLowerCase()}Heavy` && c.confidence === "strong");
        if (match && layer.completeChart) {
          promoted++;
          expect(states.families[family]).toMatchObject({ state: "HIGH", provenance: match.provenance });
        } else expect(states.families[family]).toBeUndefined();
      }
      if (layer.strength.confidence === "uncertain" || !layer.completeChart || (layer.strength.level !== "balanced" && layer.strength.confidence !== "strong")) expect(states.dayMaster).toBeUndefined();
      if (states.dayMaster) expect(states.dayMaster.provenance).toEqual(layer.strength.provenance);
      expect(states.gods).toEqual({});
      expect(Object.values(states.families).every(s => s.state === "HIGH")).toBe(true);
    }
    expect(promoted).toBeGreaterThan(0);
  });
  it("legacy numeric counts/scores never activate new intensity or day-master modifiers", () => {
    const calc = fixtureInput(NARRATIVE_FIXTURES[0]).calculation, original = buildNatalFoundationFromCalculation(calc);
    for (const god of Object.keys(calc.tenGods.distribution) as (keyof typeof calc.tenGods.distribution)[]) calc.tenGods.distribution[god] = 999;
    if (calc.structureAnalysis) {
      // The legacy result is intentionally quarantined, independent of value.
      Object.assign(calc.structureAnalysis, { dayMasterStrength: "STRONG", strengthScore: 999 });
    }
    expect(buildNatalFoundationFromCalculation(calc)).toEqual(original);
  });
  it("exact/approx share the confirmed pillars; unknown adds no hour/strength", () => {
    const exact = calculateSaju({ ...base, birthTime: "14:15", birthTimeUnknown: false, birthTimePrecision: "exact" });
    const approx = calculateSaju({ ...base, approximateBirthTimeSlot: "MISI", birthTimePrecision: "approximate", birthTimeUnknown: false });
    const unknown = calculateSaju({ ...base, birthTimePrecision: "unknown", birthTimeUnknown: true });
    const a = buildNatalFoundationFromCalculation(exact), b = buildNatalFoundationFromCalculation(approx), c = buildNatalFoundationFromCalculation(unknown);
    expect(a.ok && b.ok && c.ok).toBe(true); if (!a.ok || !b.ok || !c.ok) return;
    expect(a.value.axes).toEqual(b.value.axes);
    expect(approx.input.birthTime).toBeUndefined();
    expect(c.value.evidence.filter(e => e.sourceType === "heavenly_stem")).toHaveLength(3);
    expect(c.value.evidence.some(e => e.metadata?.pillar === "hour")).toBe(false);
    expect(c.value.states).toEqual({ families: {}, gods: {} });
    expect(c.value.synthesisCandidates.some(e => e.source === "DAY_MASTER_TEN_GOD")).toBe(false);
  });
  it("missing or inconsistent canonical source fails closed", () => {
    const calc = fixtureInput(NARRATIVE_FIXTURES[0]).calculation;
    delete calc.birthTimeContext;
    expect(buildNatalFoundationFromCalculation(calc)).toEqual({ ok: false, error: "UNVERIFIED_CANONICAL_CHART" });
    const mismatch = fixtureInput(NARRATIVE_FIXTURES[0]).calculation;
    mismatch.pillars.day.stem = mismatch.pillars.day.stem === "甲" ? "乙" : "甲";
    expect(buildNatalFoundationFromCalculation(mismatch)).toEqual({ ok: false, error: "UNVERIFIED_CANONICAL_CHART" });
  });
});
