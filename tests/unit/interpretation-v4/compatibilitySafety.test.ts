import contentBaseline from "./contentRebuildBaseline.json";
import { createHash } from "node:crypto";
import { describe, it, expect } from "vitest";
import { writeFileSync, mkdirSync } from "node:fs";
import { composeCompatibilityNarrative } from "../../../src/lib/interpretation-v4/compatibilityComposer";
import { compatibilityCharacter } from "../../../src/lib/interpretation-v4/compatibilityCharacters";
import { compatibilityHarmony, compatibilityGoodCards } from "../../../src/lib/interpretation-v4/compatibilityHarmony";
import { composeLoveNarrative } from "../../../src/lib/interpretation-v4/loveComposer";
import { narrativeText } from "../../../src/lib/interpretation-v4/editorialGuard";
import { MBTI_TYPES, COMPATIBILITY_RELATIONSHIP_TYPES } from "../../../src/lib/report-generation/reportInputTypes";
import { getCrossTenGodRelation } from "../../../src/lib/report-knowledge/compatibilityRelationRules";
import { COMPATIBILITY_NARRATIVE_FIXTURES as fixtures } from "./compatibilityFixtures";
import { loveInputs } from "./loveFixtures";

// Reviewed Phase 7A prose; original Phase 5B and immutable evidence/proof hashes
// remain in finalEditorialBaseline.json. Comprehensive/Career
// hashes remain independently frozen in careerSafety/loveSafety respectively.
const LOVE_HASHES = Object.entries(contentBaseline.rows).filter(([id]) => id.startsWith("love-")).sort(([a], [b]) => a.localeCompare(b)).map(([, row]) => row.after);
const must = (payload: unknown) => { const r = composeCompatibilityNarrative(payload); expect(r.ok).toBe(true); if (!r.ok) return null!; return r; };

describe("Compatibility isolation, evidence and directionality", () => {
  it.each(loveInputs().map((f, i) => ({ ...f, hash: LOVE_HASHES[i] })))("$fixture.id: Love full narrative hash unchanged", ({ input, hash }) => {
    const r = composeLoveNarrative(input); expect(r.ok).toBe(true); if (!r.ok) return;
    expect(createHash("sha256").update(JSON.stringify(r.narrative)).digest("hex")).toBe(hash);
  });
  it.each(fixtures)("$id: swap preserves symmetric facts, reverses target-viewer meaning", ({ payload }) => {
    const inputBefore = JSON.stringify(payload), r = must(payload), s = must({ ...payload, personA: payload.personB, personB: payload.personA });
    expect(JSON.stringify(payload)).toBe(inputBefore);
    expect(s.evidence.invariant).toEqual(r.evidence.invariant);
    expect(s.selection.harmony).toBe(r.selection.harmony);
    expect(s.selection.tension).toBe(r.selection.tension);
    for (const relation of r.evidence.relations) {
      expect(new Set(relation.refs.map(ref => ref.person)).size).toBe(2);
      for (const ref of relation.refs) expect(["year", "month", "day", "hour"]).toContain(ref.position);
    }
    expect(r.directions.aToB.subjectPerson).toBe(s.directions.bToA.subjectPerson);
    expect(r.directions.aToB.targetPerson).toBe(s.directions.bToA.targetPerson);
    expect(r.directions.aToB.receivedTenGod).toEqual(s.directions.bToA.receivedTenGod);
    expect(r.directions.bToA.receivedTenGod).toEqual(s.directions.aToB.receivedTenGod);
    for (const direction of Object.values(r.evidence.directions)) {
      const god = direction.receivedTenGod!;
      expect(god).toEqual(getCrossTenGodRelation({ viewerDayStem: god.viewerDayStem, targetDayStem: god.targetDayStem }));
    }
    if (!["parentChild", "managerReport"].includes(payload.relationshipType)) {
      expect(r.directions.aToB.block.text).toBe(s.directions.bToA.block.text);
      expect(r.directions.bToA.block.text).toBe(s.directions.aToB.block.text);
    } else {
      const roleA = payload.relationshipType === "parentChild" ? "부모" : "상사";
      const roleB = payload.relationshipType === "parentChild" ? "자녀" : "팀원";
      expect(s.directions.aToB.block.text).toContain(`${roleA} ${payload.personB.name}님`);
      expect(s.directions.aToB.block.text).toContain(`${roleB} ${payload.personA.name}님`);
      expect(s.narrative.finalLine).toContain(`${roleA} ${payload.personB.name}님`);
    }
    expect(r.directions.aToB.block.text).not.toBe(r.directions.bToA.block.text);
  });
  it("same pair across seven categories changes opening, scenes, both directions and final", () => {
    const reports = COMPATIBILITY_RELATIONSHIP_TYPES.map(relationshipType => must({ ...fixtures[0].payload, relationshipType }));
    for (const read of [(r: typeof reports[number]) => narrativeText(r.narrative).slice(0, 700), (r: typeof reports[number]) => r.narrative.finalLine,
      (r: typeof reports[number]) => r.directions.aToB.block.text, (r: typeof reports[number]) => r.directions.bToA.block.text])
      expect(new Set(reports.map(read)).size).toBe(7);
    expect(reports.every(r => JSON.stringify(r.evidence.invariant) === JSON.stringify(reports[0].evidence.invariant))).toBe(true);
    if (process.env.V4_PHASE5C_EXPORT === "1") writeFileSync("/tmp/gyeol-v4-phase5c/category-counterfactual.json", JSON.stringify(reports.map(r => ({ category: r.narrative.category, opening: narrativeText(r.narrative).slice(0, 800), directions: r.directions, final: r.narrative.finalLine })), null, 2));
  });
  it("MBTI pair source fields retain both viewpoints; no arbitrary score/grade key anywhere in V4 output", () => {
    for (const { payload } of fixtures) {
      const r = must(payload);
      expect(r.mbtiPairBasis.length).toBeGreaterThan(0);
      for (const pair of r.mbtiPairBasis) {
        expect(pair.sourceRef).toContain(`/${pair.sourceType}.json:`);
        for (const key of ["sharedGround", "friction", "positiveInfluence", "repairStrategy"] as const) expect(pair[key].length).toBeGreaterThan(0);
      }
      const visit = (v: unknown): void => { if (!v || typeof v !== "object") return; for (const [key, value] of Object.entries(v)) { expect(key).not.toMatch(/score|grade|rating|rank|percent/i); visit(value); } };
      visit(r);
      for (const p of Object.values(r.persons)) {
        if (p.fusion) expect(p.materials.fusions).toContainEqual(p.fusion);
        expect(p.core.length).toBeGreaterThan(0); expect(p.strength.length).toBeGreaterThan(0); expect(p.shadow.length).toBeGreaterThan(0);
      }
    }
  });
  it("suppress removed relations/markers/fusions, not just their source labels", () => {
    const r = must(fixtures[0].payload);
    const barePerson = (p: typeof r.evidence.persons.personA) => ({ ...p, materials: { ...p.materials, selected: p.materials.selected.filter(m => ["dayMaster", "dayPillar"].includes(m.material.category)), fusions: [], fortuneComposites: [], symbolicElements: [] } });
    const a = compatibilityCharacter(barePerson(r.evidence.persons.personA))!, b = compatibilityCharacter(barePerson(r.evidence.persons.personB))!;
    expect(a.fusion).toBeNull(); expect(a.style).toBe("natal");
    expect(compatibilityGoodCards(r.evidence, a, b)).toEqual([]);
    const relation = compatibilityHarmony({ ...r.evidence, relations: [] }, a, b);
    expect(relation.harmonic).toBeNull(); expect(relation.friction).toBeNull();
    for (const { payload } of fixtures) {
      const result = must(payload);
      const features = result.narrative.sections.flatMap(s => s.blocks).flatMap(b => b.proof.features);
      expect(features.join(" ")).not.toMatch(/mangsin|mungok|bokseong|cheoneuiseong/);
      expect(narrativeText(result.narrative)).not.toMatch(/원진|천간합|방합|형살|지지파/);
    }
  });
  it.each(MBTI_TYPES)("%s: all categories work with evidence-gated fallback and unknown policy", mbtiType => {
    for (const relationshipType of COMPATIBILITY_RELATIONSHIP_TYPES) {
      const r = must({ ...fixtures[0].payload, relationshipType, personA: { ...fixtures[0].payload.personA, mbtiType } });
      expect(r.editorial.filter(i => i.severity !== "Minor"), `${mbtiType}/${relationshipType}`).toEqual([]);
      if (!mbtiType) { expect(r.persons.personA.fusion).toBeNull(); expect(r.persons.personA.materials.fusions).toEqual([]); expect(r.mbtiPairBasis).toEqual([]); }
      expect(narrativeText(r.narrative)).not.toMatch(/자녀는.*(?:성공|천재|직업)|반드시 결혼|운명적 배우자|연애 점수/);
    }
  });
  it("same saju/different MBTI and same MBTI/different saju are genuine character counterfactuals", () => {
    const base = fixtures[0].payload, original = must(base);
    const changedMbti = ["ENTJ", "ISFP", "ENFP"].map(mbtiType => must({ ...base, personA: { ...base.personA, mbtiType } }));
    for (const r of changedMbti) { expect(r.evidence.invariant).toEqual(original.evidence.invariant); expect(r.persons.personA.style).not.toBe(original.persons.personA.style); expect(r.narrative.opening).not.toEqual(original.narrative.opening); }
    const changedSaju = [fixtures[2].payload.personA, fixtures[4].payload.personA, fixtures[7].payload.personB].map(p => must({ ...base, personA: { ...p, name: base.personA.name, mbtiType: base.personA.mbtiType } }));
    for (const r of changedSaju) { expect(r.persons.personA.materials.selected).not.toEqual(original.persons.personA.materials.selected); expect(r.narrative.sections.find(s => s.id === "fortune")).not.toEqual(original.narrative.sections.find(s => s.id === "fortune")); expect(r.evidence.invariant).not.toEqual(original.evidence.invariant); }
    // A different date can keep the same day stem; never invent a changed god.
    expect(changedSaju.some(r => JSON.stringify(r.directions.aToB.receivedTenGod) !== JSON.stringify(original.directions.aToB.receivedTenGod))).toBe(true);
    if (process.env.V4_PHASE5C_EXPORT === "1") { mkdirSync("/tmp/gyeol-v4-phase5c", { recursive: true }); writeFileSync("/tmp/gyeol-v4-phase5c/person-counterfactual.json", JSON.stringify([...changedMbti, ...changedSaju].map(r => ({ persons: r.persons, directions: r.directions, final: r.narrative.finalLine })), null, 2)); }
  });
  it("all three time precisions preserve partial evidence and no inferred missing hour", () => {
    for (const { payload } of fixtures) {
      const r = must(payload);
      for (const p of Object.values(r.evidence.persons)) if (p.precision === "unknown") {
        expect(p.materials.symbolicElements).toEqual([]);
        expect(r.evidence.relations.flatMap(f => f.refs).filter(ref => ref.person === (p.personId === r.persons.personA.personId ? "personA" : "personB"))).not.toEqual(expect.arrayContaining([expect.objectContaining({ position: "hour" })]));
      }
    }
  });
  it("no forced ESFJ Fusion on the adjacent real chart; both unknown still deliver natal prose", () => {
    const base = fixtures[0].payload;
    const missing = must({ ...base, personB: { ...base.personB, birthDate: "1995-04-09" } });
    expect(missing.persons.personB.fusion).toBeNull(); expect(missing.persons.personB.style).toBe("natal");
    const unknown = must({ ...base, personA: { ...base.personA, mbtiType: "" }, personB: { ...base.personB, mbtiType: "" } });
    expect(unknown.mbtiPairBasis).toEqual([]); expect(narrativeText(unknown.narrative).length).toBeGreaterThan(2200);
    expect(narrativeText(unknown.narrative)).not.toMatch(/정보가 부족|MBTI가 없|ENTJ|ESFJ/);
  });
  it("rejects legacy role-less/new invalid input without migrating existing snapshots", () => {
    const base = fixtures[0].payload;
    for (const payload of [null, {}, { ...base, compatibilityRoleVersion: undefined }, { ...base, relationshipType: "reunion" }, { ...base, personA: { ...base.personA, name: "" } }])
      expect(composeCompatibilityNarrative(payload)).toMatchObject({ ok: false });
  });
  it("same day pillar is a shared observation, not two duplicated individual readings", () => {
    for (const relationshipType of COMPATIBILITY_RELATIONSHIP_TYPES) {
      const base = fixtures[0].payload;
      const r = must({ ...base, relationshipType, personB: { ...base.personA, name: "다른사람" } });
      expect(r.editorial.filter(i => i.severity !== "Minor"), relationshipType).toEqual([]);
      expect(r.narrative.sections.flatMap(s => s.blocks).filter(b => b.id === "shared-natal")).toHaveLength(1);
    }
  });
});
