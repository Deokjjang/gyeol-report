import { describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { NARRATIVE_FIXTURES, fixtureInput } from "./narrativeFixtures";
import { careerInputs } from "./careerFixtures";
import { COMPATIBILITY_NARRATIVE_FIXTURES as pairs } from "./compatibilityFixtures";
import { MAJOR_NARRATIVE_FIXTURES, MAJOR_EVALUATED_AT } from "./majorFixtures";
import { ANNUAL_NARRATIVE_FIXTURES } from "./annualFixtures";
import { RUNTIME_FIXTURES, SHADOW_CLOCK } from "./runtimeFixtures";
import { buildMyeongliMaterialPacket } from "../../../src/lib/interpretation-v4/materialPacket";
import { MATERIAL_BY_FEATURE } from "../../../src/lib/interpretation-v4/materialRegistry";
import { assertionPermission, buildContentEvidencePool } from "../../../src/lib/interpretation-v4/contentEvidence";
import { plannedAssertion } from "../../../src/lib/interpretation-v4/assertionCopy";
import { rhythmReading, elementCharacter } from "../../../src/lib/interpretation-v4/productRhythm";
import { composeComprehensiveNarrative } from "../../../src/lib/interpretation-v4/comprehensiveComposer";
import { composeCareerNarrative } from "../../../src/lib/interpretation-v4/careerComposer";
import { composeLoveNarrative } from "../../../src/lib/interpretation-v4/loveComposer";
import { composeCompatibilityNarrative } from "../../../src/lib/interpretation-v4/compatibilityComposer";
import { buildCompatibilityIndex, COMPATIBILITY_INDEX_PROFILES } from "../../../src/lib/interpretation-v4/compatibilityIndex";
import { composeMajorFortuneNarrative } from "../../../src/lib/interpretation-v4/majorComposer";
import { composeAnnualFortuneNarrative } from "../../../src/lib/interpretation-v4/annualComposer";
import { friendlyTransition } from "../../../src/lib/interpretation-v4/periodPlanner";
import { generateV4ShadowReport } from "../../../src/lib/interpretation-v4/runtimeShadow";
import { validateV4Publication, v4Digest, type V4RuntimeEvidence } from "../../../src/lib/interpretation-v4/runtimeProjection";
import { narrativeText } from "../../../src/lib/interpretation-v4/editorialGuard";

const poolAt = (index: number) => { const input = fixtureInput(NARRATIVE_FIXTURES[index]); return { input, pool: buildContentEvidencePool(input.calculation, buildMyeongliMaterialPacket(input)) }; };
describe("Phase13B planner permissions and observed rhythms", () => {
  it("aliases cannot upgrade one source; unsupported roots cannot grant a claim", () => {
    const { pool } = poolAt(1), root = pool.materials.find(m => m.material.category !== "structure")!;
    expect(assertionPermission([root, root], null).assertion).toBe("MEDIUM");
    const unsupported = { ...root, evidence: root.evidence.map(d => ({ ...d, usable: false, strength: "none" as const })) };
    expect(assertionPermission([unsupported], null).assertion).toBe("WEAK");
    expect(plannedAssertion({ id: "x", domain: "identity", roots: [], fusion: null, consideredFusionIds: [], reasons: [], assertion: "WEAK", theme: "wealth", independentFeatures: [] })).toBeNull();
  });
  it.each(NARRATIVE_FIXTURES)("$id: assertion permission precedes writing, held evidence stays held", f => {
    const r = composeComprehensiveNarrative(fixtureInput(f)); expect(r.ok).toBe(true); if (!r.ok) return;
    for (const plan of r.contentPlan.chapters) {
      expect(["STRONG", "MEDIUM", "WEAK"]).toContain(plan.assertion);
      const roots = plan.features.map(feature => r.materials.selected.find(m => m.feature === feature)!);
      expect(assertionPermission(roots, null).assertion).toBe(plan.assertion);
      if (plan.assertion === "STRONG" && plan.independentFeatures.length < 2) {
        expect(roots.some(m => m.material.category === "structure" && plan.theme &&
          MATERIAL_BY_FEATURE.get(m.feature)?.semanticTags.includes(plan.theme))).toBe(true);
      }
      expect(roots.every(m => m.evidence.every(d => d.usable && d.strength === "strong"))).toBe(true);
    }
    expect(r.contentAudit.evidenceDiversity).toBeGreaterThan(5);
    expect(r.contentAudit.semanticUse).toBeDefined();
    expect(r.contentAudit.endingRuns).toEqual([]);
    expect(narrativeText(r.narrative)).not.toContain("의 결이 겹치는");
  });
  it.each([[11, "ENFP", "tension"], [11, "ISTJ", "reinforce"], [1, "INTJ", "tension"], [1, "ENFP", "reinforce"]] as const)("chart %i + %s: %s, not yin=I or yang=E", (index, mbti, kind) => {
    const { input, pool } = poolAt(index), r = rhythmReading({ ...input, mbti }, pool, "comprehensive");
    expect(r?.relation).toBe(kind); expect(r?.block.proof.sourceRefs).toContain("visible-characters-unweighted");
    expect(r?.block.proof.features.length).toBeGreaterThan(0);
  });
  it("unknown hour cannot establish polarity excess; unknown MBTI is not inferred", () => {
    const partial = poolAt(2); expect(rhythmReading(partial.input, partial.pool, "love")).toBeNull();
    const unknown = poolAt(11), r = rhythmReading(unknown.input, unknown.pool, "comprehensive");
    expect(r?.relation).toBe("natal"); expect(r?.block.text).not.toMatch(/MBTI|[EI][NS][TF][JP]/);
    expect(elementCharacter(partial.pool)).toBeNull();
    expect(elementCharacter(poolAt(1).pool)?.block.proof.sourceRefs.some(r => r.startsWith("natal-element:"))).toBe(true);
  });
  it.each(careerInputs())("$fixture.id: three ranked grounded directions and 2–3 draining environments", ({ input }) => {
    const r = composeCareerNarrative(input); expect(r.ok).toBe(true); if (!r.ok) return;
    expect(r.narrative.recommendations).toHaveLength(3);
    r.narrative.recommendations.forEach((v, i) => { expect(v.reason).toContain(`${i + 1}순위`); expect(v.proof.features.length).toBeGreaterThan(0); expect(v.roleExamples.length).toBeGreaterThan(0); });
    expect(r.narrative.avoidEnvironments.length).toBeGreaterThanOrEqual(2); expect(r.narrative.avoidEnvironments.length).toBeLessThanOrEqual(3);
    if (!input.mbti) expect(r.narrative.recommendations.flatMap(v => v.proof.sourceRefs).join()).not.toContain("mbti:");
  });
  it("Love meeting environment is conditional for established relationships", () => {
    const base = fixtureInput(NARRATIVE_FIXTURES[1]);
    for (const relationshipStatus of ["single", "some", "dating", "marriage_preparing", "married", ""] as const) {
      const r = composeLoveNarrative({ ...base, context: { ...base.context, relationshipStatus } });
      expect(r.ok).toBe(true); if (!r.ok) continue;
      const text = narrativeText(r.narrative); expect(text).not.toMatch(/반드시.*배우자|솔로 탈출|운명의 장소/);
      const meeting = r.narrative.sections.find(s => s.id === "balance")?.blocks.find(b => b.id === "love-meeting-environment");
      expect(meeting).toBeDefined();
      expect(meeting?.proof.features.length).toBeGreaterThan(0);
      expect(meeting?.proof.sourceRefs).toContain("v4:love-symbolic-partner");
      expect(meeting?.text.startsWith("지금 가까운 사람과도 ")).toBe(["dating", "marriage_preparing", "married"].includes(relationshipStatus));
    }
  });
  it("product-specific MBTI routing cannot borrow work prose for Love or romance for Career", () => {
    const love = composeLoveNarrative(fixtureInput(NARRATIVE_FIXTURES[2]));
    const career = composeCareerNarrative(careerInputs()[0].input);
    if (!love.ok || !career.ok) throw Error("fixture");
    const loveSynthesis = [...love.narrative.opening, ...love.narrative.sections.flatMap(s => s.blocks)].filter(b => b.id.includes("synthesis"));
    const careerSynthesis = [...career.narrative.opening, ...career.narrative.sections.flatMap(s => s.blocks)].filter(b => b.id.includes("synthesis"));
    expect(loveSynthesis.map(b => b.text).join(" ")).not.toMatch(/동료|퇴근|업무|일에서 같은 장점/);
    expect(careerSynthesis.map(b => b.text).join(" ")).not.toMatch(/데이트|연애|좋아하는 사람|마음의 문/);
  });
});

describe("Source-bound entertainment index; legacy scoreless snapshots remain valid", () => {
  it.each(pairs)("$id: deterministic, bounded, additive and symmetric on A/B swap", ({ payload }) => {
    const r = composeCompatibilityNarrative(payload), swapped = composeCompatibilityNarrative({ ...payload, personA: payload.personB, personB: payload.personA });
    expect(r.ok && swapped.ok).toBe(true); if (!r.ok || !swapped.ok) return;
    const score = r.compatibilityIndex;
    expect(buildCompatibilityIndex(r.evidence)).toEqual(score);
    expect(score.total).toBe(score.scores.reduce((n, v) => n + v.value, 0));
    expect(score.scores.map(s => s.max)).toEqual([30, 35, 25, 10]);
    expect(score.scores.every(s => s.value >= 0 && s.value <= s.max && Number.isInteger(s.value))).toBe(true);
    expect(swapped.compatibilityIndex.scores.map(s => s.value)).toEqual(score.scores.map(s => s.value));
    expect(score.notice).toBe("명리와 MBTI를 바탕으로 한 엔터테인먼트 해석입니다.");
    expect(score.scores.flatMap(s => s.factors).every(f => f.value === 0 || f.sources.length)).toBe(true);
  });
  it("seven category profiles affect the same pair, not a fixed 67", () => {
    const r = composeCompatibilityNarrative(pairs[0].payload); if (!r.ok) throw Error("fixture");
    const values = Object.keys(COMPATIBILITY_INDEX_PROFILES).map(category => buildCompatibilityIndex({ ...r.evidence, category: category as keyof typeof COMPATIBILITY_INDEX_PROFILES }).total);
    expect(new Set(values).size).toBeGreaterThan(3);
    const cohort = pairs.map(p => composeCompatibilityNarrative(p.payload)).flatMap(r => r.ok ? [r.compatibilityIndex.total] : []);
    expect(Math.max(...cohort) - Math.min(...cohort)).toBeGreaterThan(10);
  });
  it("absent MBTI/hour has neutral coverage, not invented harmony", () => {
    const p = pairs[0].payload;
    const r = composeCompatibilityNarrative({ ...p, personA: { ...p.personA, mbtiType: "", birthTime: "", birthTimeUnknown: true, birthTimePrecision: "unknown" }, personB: { ...p.personB, mbtiType: "" } });
    expect(r.ok).toBe(true); if (!r.ok) return;
    expect(r.compatibilityIndex.scores[2]).toMatchObject({ value: 13, factors: [] });
    expect(r.compatibilityIndex.scores[0].factors.map(f => f.factor)).not.toContain("음양 리듬 보완");
    expect(r.compatibilityIndex.limitations.join()).toContain("중립");
  });
  it("a real INTP/ESFJ pair has a two-way loop and a specific repair", () => {
    const r = composeCompatibilityNarrative(pairs[0].payload); if (!r.ok) throw Error("fixture");
    const text = narrativeText(r.narrative); expect(text).toContain("조용해질수록"); expect(text).toContain("정한 대화 시간까지");
    expect(r.directions.aToB.receivedTenGod).not.toEqual(r.directions.bToA.receivedTenGod);
  });
  it("publication verifies present index but accepts a previous scoreless packet", async () => {
    const r = await generateV4ShadowReport(RUNTIME_FIXTURES[3].payload, SHADOW_CLOCK); if (!r.ok) throw Error("fixture");
    const e = structuredClone(r.evidencePacket) as V4RuntimeEvidence;
    if (e.composition.product !== "saju_mbti_compatibility") throw Error("fixture");
    e.composition.result.compatibilityIndex.total++;
    expect(validateV4Publication(e.composition.product, r.draft, e).errors).toContain("V4_PAIR_INDEX_INVALID");
    Reflect.deleteProperty(e.composition.result, "compatibilityIndex");
    const legacy = { ...e }; Reflect.deleteProperty(legacy, "contentDigest");
    expect(validateV4Publication(e.composition.product, r.draft, { ...legacy, contentDigest: v4Digest(legacy) })).toEqual({ ok: true, errors: [] });
  });
});

describe("Daeun-first and annual time-map density without calendar edits", () => {
  it.each(MAJOR_NARRATIVE_FIXTURES)("$id: 14 years, 2–4 deep years, next cycle, distant context", async f => {
    const r = await composeMajorFortuneNarrative(f.payload, MAJOR_EVALUATED_AT); if (!r.ok) throw Error("fixture");
    expect(r.years).toHaveLength(14); expect(r.years.filter(y => y.timePosition === "future")).toHaveLength(10);
    const high = r.years.filter(y => y.importance === "HIGH"); expect(high.length).toBeGreaterThanOrEqual(2); expect(high.length).toBeLessThanOrEqual(4);
    expect(high.every(y => y.blocks.length >= 4)).toBe(true);
    if (r.transitions.some(t => t.year >= r.evidence.currentYear)) expect(r.narrative.sections.some(s => s.id === "next-cycle")).toBe(true);
    const later = r.years.filter(y => y.year >= r.evidence.currentYear + 3).flatMap(y => y.blocks.filter(b => /scene|character/.test(b.id))).map(b => b.text).join(" ");
    expect(later).not.toMatch(/고객|현재 회사|상품|재구매|학기|전공|졸업/);
    expect(r.years.every(y => y.proof.sourceRefs.length && y.age !== undefined)).toBe(true);
  });
  it.each(ANNUAL_NARRATIVE_FIXTURES)("$id: map, 12 ordered months, actions, selective MBTI and time-aware density", async f => {
    const r = await composeAnnualFortuneNarrative(f.payload, f.clock); if (!r.ok) throw Error("fixture");
    expect(r.months.map(m => m.month)).toEqual(Array.from({ length: 12 }, (_, i) => i + 1));
    expect(r.yearMap.length).toBeGreaterThan(2);
    expect(r.months.every(m => m.action.action && m.action.avoid && m.provenance.includes("annual-month-jie-kst-v2"))).toBe(true);
    expect(r.months.filter(m => m.behavior).length).toBeLessThanOrEqual(3);
    for (const plan of r.contentPlan.chapters) if (plan.assertion === "STRONG" && plan.independentFeatures.length < 2) {
      expect(plan.features.some(feature => r.materials.selected.some(m => m.feature === feature &&
        m.material.category === "structure" && plan.theme && MATERIAL_BY_FEATURE.get(feature)?.semanticTags.includes(plan.theme)))).toBe(true);
    }
    for (const m of r.months) {
      expect(m.boundary.segments.map(s => s.start)).toEqual(m.focus ? r.evidence.months[m.month - 1].segments.map(s => s.startKst) : []);
      if (m.plan.depth === "brief") expect(m.blocks.length).toBeLessThanOrEqual(4);
      if (m.time === "current") expect(m.plan.depth).toBe("current");
    }
  });
  it("Oct 1 can share September's Jie pillar; the next exact boundary remains visible", async () => {
    const f = ANNUAL_NARRATIVE_FIXTURES[0], r = await composeAnnualFortuneNarrative(f.payload, f.clock); if (!r.ok) throw Error("fixture");
    const sep = r.months[8], oct = r.months[9];
    expect(oct.focus.monthPillar).toEqual(sep.focus.monthPillar);
    expect(oct.boundary.segments.length).toBeGreaterThan(1);
    expect(oct.boundary.explanation).toContain("달력의 1일");
    expect(oct.boundary.segments[0].ganji).not.toBe(oct.boundary.segments.at(-1)!.ganji);
    expect(friendlyTransition("2031-06-01 21:59 ~ 2031-10-01 20:00")).toBe("2031년 여름~가을 무렵");
  });
});
