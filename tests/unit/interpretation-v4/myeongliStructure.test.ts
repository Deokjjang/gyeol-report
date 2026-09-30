import { describe, expect, it } from "vitest";
import { calculateSaju } from "../../../src/lib/saju/calculateSaju";
import { analyzeFullTenGods } from "../../../src/lib/saju/analyze";
import { STRUCTURE_RULES } from "../../../src/lib/interpretation-v4/structureRules";
import { STRUCTURE_MATERIALS } from "../../../src/lib/interpretation-v4/structureMaterials";
import { analyzeV4Strength, collectStructureAtoms, strengthFromPillars, sumWeight } from "../../../src/lib/interpretation-v4/strength";
import { buildMyeongliStructure } from "../../../src/lib/interpretation-v4/structureEvidence";
import { buildV4Evidence, evaluateEvidence } from "../../../src/lib/interpretation-v4/evidencePolicy";
import { buildFusionCore, interpretFusion } from "../../../src/lib/interpretation-v4/fusion";
import { MATERIAL_BY_FEATURE } from "../../../src/lib/interpretation-v4/materialRegistry";
import type { PillarSet } from "../../../src/lib/saju/analyze";
import type { DaymasterLevel, StructureId } from "../../../src/lib/interpretation-v4/structureTypes";

const calc = (date: string, time = "09:30") => calculateSaju({ birthDate: date, birthTime: time, birthTimeUnknown: false, calendarType: "SOLAR", gender: "MALE", timezone: "Asia/Seoul" });
const unknown = (date: string) => calculateSaju({ birthDate: date, birthTimeUnknown: true, calendarType: "SOLAR", gender: "MALE", timezone: "Asia/Seoul" });
const fixtures: readonly [StructureId, string, string][] = [
  ["wealthHeavyWeakDaymaster", "1984-03-18", "05:30"], ["outputCreatesWealth", "1984-01-18", "05:30"],
  ["wealthCreatesOfficer", "1990-03-18", "01:30"], ["officerResourceFlow", "1984-09-27", "13:30"],
  ["killingResourceFlow", "1984-07-27", "15:30"], ["hurtingOfficerMeetsOfficer", "1999-12-06", "01:30"],
  ["mixedOfficers", "1986-01-18", "15:30"],
];
// Deliberate mechanism ablations only; never presented as real birth fixtures.
function synthetic(pillars: PillarSet) {
  const base = calc("1994-11-18");
  return { ...base, pillars, dayMaster: pillars.day.stem, tenGods: analyzeFullTenGods(pillars),
    birthTimeContext: { ...base.birthTimeContext!, confirmed: pillars, candidates: {
      year: [pillars.year], month: [pillars.month], day: [pillars.day], hour: pillars.hour ? [pillars.hour] : [],
    } } };
}

describe("V4 strength: season, roots, exposure and hidden support", () => {
  it.each([
    ["veryWeak", "1986-06-18", "09:30"], ["weak", "1985-05-06", "09:30"], ["balanced", "1984-03-06", "09:30"],
    ["strong", "1984-10-06", "17:30"], ["veryStrong", "1987-05-18", "09:30"],
  ] as const)("actual %s: %s %s", (level, date, time) => {
    const result = analyzeV4Strength(calc(date, time));
    expect(result.level).toBe(level);
    expect(result.confidence).toBe(level === "balanced" ? "supported" : "strong");
    expect(result.supportingEvidence.length + result.weakeningEvidence.length).toBeGreaterThan(4);
    expect(result.provenance.length).toBeGreaterThan(4);
    expect(result).not.toHaveProperty("score");
  });
  it("retains conflicting/borderline dimensions as balanced/uncertain", () => {
    const r = analyzeV4Strength(calc("1985-05-18", "17:30"));
    expect(r).toMatchObject({ level: "balanced", confidence: "uncertain" });
    expect(r.reasons).toContain("BOUNDARY_OR_CONTRADICTORY_DIMENSIONS");
  });
  it("reads actual pillar positions without double counting branch elements or the day stem", () => {
    const c = calc("1984-03-18", "05:30"), atoms = collectStructureAtoms(c.pillars);
    expect(atoms.some(a => a.id.startsWith("day:visible"))).toBe(false);
    expect(sumWeight(atoms)).toBeCloseTo(Object.values(c.tenGods.distribution).reduce((sum, n) => sum + n, 0));
    expect(new Set(atoms.map(a => a.id)).size).toBe(atoms.length);
    expect(atoms.filter(a => a.location === "visible")).toHaveLength(3);
  });
  it("ignores legacy heuristic score/distribution labels and preserves deterministic pillars", () => {
    const c = calc("1986-06-18"), expected = buildMyeongliStructure(c);
    const edited = structuredClone(c);
    edited.structureAnalysis.dayMasterStrength.level = "VERY_STRONG";
    edited.structureAnalysis.dayMasterStrength.score = 999;
    edited.tenGods.distribution.比肩 = 999;
    expect(buildMyeongliStructure(edited)).toEqual(expected);
    expect(strengthFromPillars(c.pillars)).toEqual(strengthFromPillars(structuredClone(c.pillars)));
  });
  it("the same weighted totals do not override a changed month-root relationship", () => {
    const p: PillarSet = { year: { stem: "丁", branch: "巳" }, month: { stem: "壬", branch: "子" }, day: { stem: "甲", branch: "午" }, hour: { stem: "戊", branch: "戌" } };
    const swapped = { ...p, year: p.month, month: p.year };
    expect(analyzeFullTenGods(p).distribution).toEqual(analyzeFullTenGods(swapped).distribution);
    expect(strengthFromPillars(p).level).not.toBe(strengthFromPillars(swapped).level);
  });
  it.each(["1984-03-18", "1986-06-18", "1987-05-18", "1999-12-06", "1984-08-18"])("unknown time cannot assert absence or a strong structure: %s", date => {
    const c = unknown(date), result = buildMyeongliStructure(c);
    expect(result.completeChart).toBe(false);
    expect(result.strength.confidence).not.toBe("strong");
    expect(result.strength.hourSensitivity.evaluated).toBeGreaterThanOrEqual(12);
    expect(result.candidates.some(c => c.confidence === "strong" || ["noResource", "noOutput", "wealthHeavyWeakDaymaster"].includes(c.id))).toBe(false);
    expect(buildFusionCore({ calculation: c, mbti: "ENTJ" }).fusions.some(f => f.myeongliEvidence.some(d => d.evidence.structure))).toBe(false);
  });
  it("suppresses daymaster claims when canonical context/version is missing or mismatched", () => {
    const c = calc("1986-06-18");
    for (const broken of [{ ...c, calculationVersion: undefined }, { ...c, birthTimeContext: undefined }, { ...c, dayMaster: "甲" as const }, { ...c, input: { ...c.input, birthTime: "11:30" } }]) {
      expect(analyzeV4Strength(broken)).toMatchObject({ level: "balanced", confidence: "uncertain" });
      expect(buildMyeongliStructure(broken).candidates).toEqual([]);
    }
  });
});

describe("V4 meaningful structures, not two labels coexisting", () => {
  it.each([
    ["outputCreatesWealth", "1985-05-06", "07:30", "COEXISTENCE_WITHOUT_CONNECTION"],
    ["outputCreatesWealth", "1984-01-18", "13:30", "RESOURCE_RESTRAINS_OUTPUT"],
    ["wealthCreatesOfficer", "1984-02-06", "01:30", "COEXISTENCE_WITHOUT_CONNECTION"],
    ["wealthCreatesOfficer", "1986-06-06", "11:30", "MIXED_OFFICER_OR_HURTING_OFFICER"],
    ["officerResourceFlow", "1984-12-18", "03:30", "COEXISTENCE_WITHOUT_CONNECTION"],
    ["officerResourceFlow", "1984-03-06", "03:30", "WEALTH_RESTRAINS_RESOURCE"],
    ["killingResourceFlow", "1986-05-06", "07:30", "COEXISTENCE_WITHOUT_CONNECTION"],
    ["killingResourceFlow", "1984-05-06", "19:30", "OUTPUT_INTERFERENCE"],
    ["hurtingOfficerMeetsOfficer", "1991-05-06", "13:30", "NO_EXPOSED_CONTROL_PATH"],
    ["hurtingOfficerMeetsOfficer", "1994-02-06", "07:30", "RESOURCE_OR_WEALTH_MEDIATION"],
    ["mixedOfficers", "1986-01-18", "07:30", "NOT_BOTH_EXPOSED_ROOTED"],
    ["mixedOfficers", "1991-11-18", "15:30", "RESOURCE_OR_OUTPUT_MEDIATION"],
    ["wealthHeavyWeakDaymaster", "1995-12-06", "05:30", "WEALTH_NOT_DOMINANT"],
  ])("actual false-positive barrier: %s %s %s", (id, date, time, reason) => {
    const r = buildMyeongliStructure(calc(date, time));
    expect(r.candidates.some(s => s.id === id)).toBe(false);
    expect(r.assessments.find(s => s.id === id)?.reasons).toContain(reason);
    expect(buildFusionCore({ calculation: calc(date, time), mbti: "ENTJ" }).decisions.filter(d => d.evidence.feature === `v4_structure:${id}`).some(d => d.usable)).toBe(false);
  });
  it.each(fixtures)("actual strong %s: %s %s", (id, date, time) => {
    const c = calc(date, time), before = JSON.stringify(c), layer = buildMyeongliStructure(c);
    const s = layer.candidates.find(s => s.id === id)!;
    expect(s, `${id}: ${JSON.stringify(layer.assessments)}`).toBeDefined();
    expect(s.confidence).toBe("strong");
    expect(s.supportingEvidence.length).toBeGreaterThan(2);
    expect(new Set(s.supportingEvidence.map(a => a.position)).size).toBeGreaterThan(1);
    expect(s.provenance).toContain(`v4:structure-rule:${id}`);
    expect(JSON.stringify(c)).toBe(before);
    expect(JSON.parse(JSON.stringify(layer))).toEqual(layer);
  });
  it("wealth-heavy but strong is not wealth-heavy weak", () => {
    const r = buildMyeongliStructure(calc("1985-03-06", "23:30"));
    expect(r.strength.level).toBe("strong");
    expect(r.candidates.some(c => c.id === "wealthHeavy")).toBe(true);
    expect(r.candidates.some(c => c.id === "wealthHeavyWeakDaymaster")).toBe(false);
  });
  it.each(["1984-01-06", "1984-01-18", "1985-05-18", "1990-11-18"])("boundary fixture is not promoted to wealth-heavy weakness: %s", date => {
    const r = buildMyeongliStructure(calc(date, "17:30"));
    expect(r.strength.confidence).toBe("uncertain");
    expect(r.strength.level).toBe("balanced");
    expect(r.candidates.some(s => s.id === "wealthHeavyWeakDaymaster")).toBe(false);
  });
  it("weak hidden output and wealth do not become a generation structure", () => {
    const c = synthetic({ year: { stem: "壬", branch: "寅" }, month: { stem: "癸", branch: "卯" }, day: { stem: "甲", branch: "子" }, hour: { stem: "甲", branch: "亥" } });
    expect(c.tenGods.distribution.食神).toBeGreaterThan(0);
    expect(c.tenGods.distribution.偏財).toBeGreaterThan(0);
    const r = buildMyeongliStructure(c);
    expect(r.candidates.some(c => c.id === "outputCreatesWealth")).toBe(false);
    expect(r.assessments.find(a => a.id === "outputCreatesWealth")?.reasons).toContain("INSUFFICIENT_INDEPENDENT_GROUP_SUPPORT");
  });
  it("officer and killing resource paths retain distinct gods and reach the daymaster", () => {
    for (const [id, date, time] of fixtures.filter(f => f[0].endsWith("ResourceFlow"))) {
      const r = buildMyeongliStructure(calc(date, time)).candidates.find(s => s.id === id)!;
      const from = r.supportingEvidence.find(a => a.id === r.connections[0].from)!;
      expect(from.god).toBe(id === "officerResourceFlow" ? "正官" : "偏官");
      expect(r.connections[1].kind).toBe("resourceToDaymaster");
      expect(r.connections[1].from).toBe(r.connections[0].to);
    }
  });
  it("tension requires actual exposed control rather than hidden co-presence", () => {
    const r = buildMyeongliStructure(calc("1999-12-06", "01:30")).candidates.find(c => c.id === "hurtingOfficerMeetsOfficer")!;
    expect(r.connections[0].kind).toBe("control");
    for (const id of [r.connections[0].from, r.connections[0].to]) expect(r.supportingEvidence.find(a => a.id === id)?.location).toBe("visible");
  });
  it.each(STRUCTURE_RULES)("material covers all requested uses without a score: $id", rule => {
    const m = STRUCTURE_MATERIALS[rule.id];
    for (const field of ["identity", "strengths", "weaknesses", "workMoney", "loveRelationships", "successFortune", "imagery"] as const) expect(m[field].length).toBeGreaterThan(8);
    expect(MATERIAL_BY_FEATURE.get(`v4_structure:${rule.id}`)?.evidenceStrength).toBe("none");
    expect(JSON.stringify(m)).not.toMatch(/KPI|레버리지|반드시.*(?:결혼|부자)|질병|죽음/);
    expect(rule.minimum).toBeTruthy(); expect(rule.connection).toBeTruthy(); expect(rule.suppress.length).toBeGreaterThan(0);
  });
});

describe("Phase 1 connection remains gated", () => {
  it("strong structure enables an actual ENTJ overlap, not just a feature chip", () => {
    const r = buildFusionCore({ calculation: calc("1984-03-18", "05:30"), mbti: "ENTJ" });
    const f = r.fusions.find(f => f.ruleId === "entj-wealth-pressure-structure")!;
    expect(f).toMatchObject({ kind: "overlap", strength: "strong", mbtiEvidence: { traitId: "high_earning_orientation" } });
    expect(f.insightSeed).toContain("쉬는 날");
    expect(r.structureMaterials.find(m => m.candidate.id === "wealthHeavyWeakDaymaster")?.fusionRefs).toContain(f.ruleId);
  });
  it("supported and forged structures cannot become overlap/fortune heroes", () => {
    const good = buildV4Evidence(calc("1984-03-18", "05:30")).find(e => e.feature === "v4_structure:wealthHeavyWeakDaymaster")!;
    for (const e of [{ ...good, structure: undefined }, { ...good, method: "supplied" as const }, { ...good, completeChart: false },
      { ...good, substantial: false }, { ...good, structure: { ...good.structure!, confidence: "supported" as const } }, { ...good, scope: "annual" as const, period: "2026" }]) {
      expect(evaluateEvidence(e).usable).toBe(false);
      const r = interpretFusion({ observations: [e], mbti: "ENTJ" });
      expect(r.fusions).toEqual([]); expect(r.fortuneComposites).toEqual([]);
    }
  });
  it("same chart with different MBTI changes fusion but not the structure layer", () => {
    const c = calc("1999-12-06", "01:30"), a = buildFusionCore({ calculation: c, mbti: "ENTP" }), b = buildFusionCore({ calculation: c, mbti: "ISFJ" });
    expect(a.structureLayer).toEqual(b.structureLayer);
    expect(a.fusions.some(f => f.ruleId === "entp-question-authority-structure")).toBe(true);
    expect(b.fusions.some(f => f.ruleId === "entp-question-authority-structure")).toBe(false);
  });
  it("unknown MBTI keeps standalone strong structure materials without fusion", () => {
    const r = buildFusionCore({ calculation: calc("1984-03-18", "05:30"), mbti: null });
    expect(r.fusions).toEqual([]);
    expect(r.myeongli.some(m => m.material.feature === "v4_structure:wealthHeavyWeakDaymaster")).toBe(true);
  });
  it.each([
    ["ambition-with-place", "1986-06-18", "19:30"], ["created-value-accumulates", "1984-03-18", "13:30"],
  ])("actual structure/marker composite %s requires each independent strong anchor", (id, date, time) => {
    const c = calc(date, time), full = buildFusionCore({ calculation: c, mbti: "ENTJ" });
    const composite = full.fortuneComposites.find(f => f.ruleId === id)!;
    expect(composite).toBeDefined();
    expect(composite.supportingEvidence.some(d => d.evidence.structure)).toBe(true);
    const observations = composite.supportingEvidence.map(d => d.evidence);
    for (let i = 0; i < observations.length; i++) {
      const removed = interpretFusion({ observations: observations.filter((_, j) => i !== j), mbti: "ENTJ" });
      expect(removed.fortuneComposites.some(f => f.ruleId === id)).toBe(false);
      const weak = interpretFusion({ observations: observations.map((e, j) => i === j ? { ...e, substantial: false } : e), mbti: "ENTJ" });
      expect(weak.fortuneComposites.some(f => f.ruleId === id)).toBe(false);
    }
    const sharedLineage = interpretFusion({ observations: observations.map(e => ({ ...e, lineage: ["same-source"] })), mbti: "ENTJ" });
    expect(sharedLineage.fortuneComposites.some(f => f.ruleId === id)).toBe(false);
  });
  it("strength levels form a bounded label contract, never a numeric customer score", () => {
    const levels: DaymasterLevel[] = ["veryWeak", "weak", "balanced", "strong", "veryStrong"];
    for (const [, date, time] of fixtures) expect(levels).toContain(analyzeV4Strength(calc(date, time)).level);
  });
});
