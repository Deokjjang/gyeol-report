import { describe, expect, it } from "vitest";
import { COMPREHENSIVE_SECTIONS, type ComprehensivePlanInputs, type EditorialCandidate as C, type EditorialConflictEdge, type ComprehensiveSectionId as S } from "../../../src/lib/interpretation-v4/comprehensivePlanCore";
import { allocateComprehensiveMaterials } from "../../../src/lib/interpretation-v4/comprehensiveAllocator";
import { reserveComprehensiveMaterials } from "../../../src/lib/interpretation-v4/comprehensiveReservation";
import { buildEditorialConflictGraph } from "../../../src/lib/interpretation-v4/comprehensiveConflictGraph";
import { collectComprehensiveCandidates } from "../../../src/lib/interpretation-v4/comprehensiveCandidateAdapter";
import { editorialOverlap, editorialScore } from "../../../src/lib/interpretation-v4/comprehensiveScoring";
import { filterEditorialCandidates } from "../../../src/lib/interpretation-v4/comprehensiveDiagnostics";
import { primarySectionEligible } from "../../../src/lib/interpretation-v4/comprehensiveSectionContracts";
import { finalizeEditorialSections, buildEditorialThemeBudget, assignEditorialOwnership } from "../../../src/lib/interpretation-v4/comprehensiveEvidenceOwnership";
import { editorialRow as row, schedulerInputs, schedulerPlan } from "./comprehensiveSchedulerFixtures";
import { myProfile } from "./fusionSemanticFixtures";
import { strong, marker } from "./claimFixtures";
import { buildYinYangEvidence } from "../../../src/lib/interpretation-v4/foundationYinYang";

const empty = schedulerInputs(myProfile([]), null, {});
function allocate(rows: C[], edges: EditorialConflictEdge[] = [], input: ComprehensivePlanInputs = empty) {
  const r = reserveComprehensiveMaterials(rows, input.mbti.available);
  return { ...allocateComprehensiveMaterials(rows, input, r.kinds, r.reservations, edges), reservations: r.reservations };
}
const split = { resolved: true, type: "BEFORE_AFTER_DECISION" as const, rationale: "existing conditional source", myeongliEvidenceIds: ["think"], mbtiSourceNodeIds: ["act"], sides: { myeongli: "before", mbti: "after" }, status: "CONDITIONAL_HYPOTHESIS" as const };
const fusion = (id: string, type: "REINFORCE" | "TENSION" | "COMPLEMENT", extra: Partial<C> = {}) => row(id, { sourceType: "FUSION", fusionType: type, fusionIds: [id], mbtiSourceNodeIds: ["explicit-mbti"], allowedSections: ["C2", "C3", "C7", "C8", "C9"], preferredSections: [type === "REINFORCE" ? "C2" : "C3"], ...(type === "TENSION" ? { conditionSplit: split, thirdInterpretationSource: id } : {}), ...extra });
const fortune = (id: string, families: string[], extra: Partial<C> = {}) => row(id, { sourceType: "CLAIM", claimIds: [id], claimLevel: 4, claimCategory: "MONEY_FORTUNE", fortune: true, fortuneFamilies: families, allowedSections: ["C5", "C8"], preferredSections: ["C5"], ...extra });
const shadow = (id: string, extra: Partial<C> = {}) => row(id, { sourceType: "CLAIM", factBomb: true, positiveValence: 0, negativeValence: 1, allowedSections: ["C6"], preferredSections: ["C6"], ...extra });

describe("section-specific allocations, reservations, fallback and budgets", () => {
  it("strong materials are reserved before broad C4 allocation; C1 details deferred", () => {
    const rows = [row("core", { sourceType: "CORE_GYEOL", allowedSections: ["C1"], preferredSections: ["C1"] }), fusion("confirm", "REINFORCE"), fusion("surprise", "TENSION"), fortune("wealth", ["WEALTH"]), shadow("direct"), shadow("overwork"), row("strength")];
    const r = allocate(rows, [], { ...empty, mbti: { ...empty.mbti, available: true } });
    for (const [s, id] of [["C1", "core"], ["C2", "confirm"], ["C3", "surprise"], ["C5", "wealth"], ["C6", "direct"]] as const) expect(r.sections[s].primaryCandidateIds).toContain(id);
    expect(r.reservations.slice(0, 6).map(r => r.sectionId)).toEqual(["C1", "C2", "C3", "C5", "C6", "C6"]);
  });
  it("C2 accepts two genuinely different reinforces but not two deep-reading echoes", () => {
    const rows = [fusion("goal", "REINFORCE", { primaryAxes: ["GOAL_DRIVE"] }), fusion("precision", "REINFORCE", { primaryAxes: ["PRECISION"] }), fusion("depth", "REINFORCE", { broadTheme: "goal", primaryAxes: ["GOAL_DRIVE"] })];
    const r = allocate(rows.map(c => ({ ...c, allowedSections: ["C2"] })), [], { ...empty, mbti: { ...empty.mbti, available: true } });
    expect(r.sections.C2.primaryCandidateIds).toHaveLength(2);
    expect(new Set(r.sections.C2.primaryCandidateIds.map(id => rows.find(c => c.id === id)!.broadTheme)).size).toBe(2);
  });
  it("C3 preserves resolved split + third source and uses complement fallback without inventing tension", () => {
    const tension = fusion("third", "TENSION"); const a = allocate([tension]); finalizeEditorialSections(a.sections, [tension], true);
    expect(a.sections.C3.thirdInterpretations[0]).toMatchObject({ conditionSplit: split, thirdInterpretationSource: "third" });
    const b = allocate([fusion("different", "COMPLEMENT")]); expect(b.sections.C3.sectionKind).toBe("COMPLEMENT_SURPRISE"); expect(b.sections.C3.primaryCandidateIds).toEqual(["different"]);
    const unresolved = fusion("unresolved", "TENSION", { conditionSplit: { ...split, resolved: false }, rank: "SUPPORT", primaryEligible: false });
    expect(primarySectionEligible(unresolved, "C3", "TENSION")).toBe(false);
  });
  it("C4 separates strength families and never makes bare amplifier a hero", () => {
    const rows = [row("analysis"), row("execution", { primaryAxes: ["INITIATIVE"] }), row("people", { primaryAxes: ["CARE"] }), row("same-analysis", { broadTheme: "analysis" })];
    const r = allocate(rows); expect(r.sections.C4.primaryCandidateIds.length).toBeLessThanOrEqual(3);
    expect(new Set(r.sections.C4.primaryCandidateIds.map(id => rows.find(c => c.id === id)!.broadTheme)).size).toBe(r.sections.C4.primaryCandidateIds.length);
    const p = schedulerPlan(schedulerInputs(myProfile([marker("CHEONEUL"), marker("DOHWA")]), null, {}));
    expect(Object.values(p.sections).flatMap(s => s.primaryCandidateIds)).toEqual([]);
  });
  it("C5 S08 composite precedes subordinate money/honor without laundering weak fortune", () => {
    const rows = [fortune("S08", ["WEALTH", "HONOR"], { compositeFortune: true }), fortune("M08", ["WEALTH"]), fortune("S04", ["HONOR"]), fortune("P01", ["HELPERS"], { claimCategory: "PEOPLE_LUCK" })];
    const graph = buildEditorialConflictGraph(rows, empty);
    const r = allocate(rows, graph.edges); expect(r.sections.C5.primaryCandidateIds).toEqual(["S08", "P01"]);
    expect(primarySectionEligible(fortune("weak", ["WEALTH"], { claimLevel: 2 }), "C5", "GOOD_FORTUNE")).toBe(false);
  });
  it("C5 can place money/honor/people but collapses duplicate helper/charm family", () => {
    const rows = [fortune("money", ["WEALTH"]), fortune("honor", ["HONOR"]), fortune("helper-a", ["HELPER"]), fortune("helper-b", ["HELPER"])];
    const r = allocate(rows, buildEditorialConflictGraph(rows, empty).edges); expect(r.sections.C5.primaryCandidateIds).toHaveLength(3);
    expect(r.sections.C5.primaryCandidateIds.filter(id => id.startsWith("helper"))).toHaveLength(1);
  });
  it("C5 no fortune remains positive potential with fortune wording forbidden", () => {
    const r = allocate([row("expert", { allowedSections: ["C5"], preferredSections: ["C5"] })]);
    expect(r.sections.C5.sectionKind).toBe("POSITIVE_POTENTIAL"); expect(r.sections.C5.forbidFortuneVocabulary).toBe(true);
  });
  it("C6 distinct 2–4 shadows, never a stubbornness list", () => {
    const rows = [shadow("stubborn"), shadow("sharp"), shadow("overwork"), shadow("stubborn-b", { broadTheme: "stubborn" }), shadow("fifth")];
    const r = allocate(rows); expect(r.sections.C6.primaryCandidateIds).toHaveLength(4); expect(r.sections.C6.primaryCandidateIds).not.toContain("stubborn-b");
  });
  it("F05/F06 cannot both be emitted as unconditional primary statements", () => {
    const rows = [shadow("F05_OVERTHINKING"), shadow("F06_TOO_FAST"), fusion("conditional", "TENSION")];
    const g = buildEditorialConflictGraph(rows, empty); expect(g.edges.some(e => e.kind === "TENSION_RESOLVED")).toBe(true);
    const r = allocate(rows, g.edges); expect(r.sections.C6.primaryCandidateIds.length).toBe(1);
    expect(r.sections.C3.primaryCandidateIds).toEqual(["conditional"]);
  });
  it("hard contradictory facts never survive as two primaries", () => {
    const rows = [row("fast"), row("slow")], graph: EditorialConflictEdge[] = [{ left: "fast", right: "slow", kind: "CONTRADICTORY", resolvedBy: [] }];
    const r = allocate(rows, graph); expect(r.sections.C4.primaryCandidateIds.length).toBe(1);
  });
  it("C7 allocates social/close/risk slots without partner archetypes", () => {
    const rows = [row("seen", { contexts: ["social"], primaryAxes: ["CHARISMA"], slots: ["OTHERS_SEE_ME"], allowedSections: ["C7"], preferredSections: ["C7"] }), row("close", { contexts: ["love"], primaryAxes: ["CARE"], slots: ["CLOSE_RELATION_CHANGE", "LOVE_STYLE"], allowedSections: ["C7"], preferredSections: ["C7"] }), shadow("risk", { contexts: ["social"], primaryAxes: ["BOUNDARY"], slots: ["RELATION_RISK"], allowedSections: ["C7"], preferredSections: ["C7"] })];
    const r = allocate(rows); finalizeEditorialSections(r.sections, rows, false);
    for (const slot of ["OTHERS_SEE_ME", "CLOSE_RELATION_CHANGE", "RELATION_RISK"] as const) expect(r.sections.C7.questionSlots[slot]).toHaveLength(1);
  });
  it("P01 is C5 primary and C7 result-only support, never a new definition", () => {
    const c = fortune("P01", ["HELPER"], { claimCategory: "PEOPLE_LUCK", allowedSections: ["C5", "C7"], contexts: ["identity", "social"] });
    const r = allocate([c]); expect(r.sections.C5.primaryCandidateIds).toEqual(["P01"]); expect(r.sections.C7.primaryCandidateIds).toEqual([]);
    expect(r.sections.C7.placements[0]?.reuseIntent).toBe("RESULT_ONLY");
  });
  it("C8 has work, money and current-context slots protected from general strengths", () => {
    const rows = [row("work", { allowedSections: ["C4", "C8"], preferredSections: ["C4"] }), row("money", { contexts: ["money"], slots: ["MONEY_STYLE"], allowedSections: ["C4", "C8"], preferredSections: ["C4"] }), row("third-strength")];
    const r = allocate(rows); finalizeEditorialSections(r.sections, rows, false);
    expect(r.sections.C8.questionSlots.WORK_STYLE).toContain("work"); expect(r.sections.C8.questionSlots.MONEY_STYLE).toContain("money"); expect(r.sections.C8.questionSlots.CURRENT_CONTEXT).toContain("work");
  });
  it("C9 element composite beats a five-element dictionary and balanced yin yang is not a story", () => {
    const rows = [row("composite", { elementComposite: true, contexts: ["recovery"], allowedSections: ["C9"], preferredSections: ["C9"], slots: ["ELEMENT_COMPOSITE"] }), row("recovery", { contexts: ["recovery"], allowedSections: ["C9"], preferredSections: ["C9"], slots: ["RECOVERY_STYLE"] })];
    const r = allocate(rows); expect(r.sections.C9.primaryCandidateIds).toContain("composite");
    const balanced = buildYinYangEvidence(4, 4); if (!balanced.ok) return expect.unreachable();
    const i = schedulerInputs(myProfile([balanced.value.evidence]), null, {});
    expect(collectComprehensiveCandidates(i).filter(c => c.evidenceIds.includes(balanced.value.evidence.id)).every(c => c.invalidReasons.length > 0)).toBe(true);
  });
  it("money reservation wins over a higher-scoring work variant of the same theme", () => {
    const money = row("money", { broadTheme: "REALITY", slots: ["MONEY_STYLE"], contexts: ["money"], allowedSections: ["C8"], specificity: .7 });
    const work = row("work", { broadTheme: "REALITY", allowedSections: ["C8"] });
    const r = allocate([work, money]); finalizeEditorialSections(r.sections, [work, money], false);
    expect(r.sections.C8.questionSlots.MONEY_STYLE).toEqual(["money"]);
    expect(r.reservations.filter(x => x.sectionId === "C8")).toHaveLength(1);
  });
  it("recovery-axis Fusion can serve C9 even when its original application is work", () => {
    const c = fusion("recover-after-work", "COMPLEMENT", { contexts: ["work"], primaryAxes: ["STABILITY", "RECOVERY_NEED"] });
    expect(primarySectionEligible(c, "C9", "RECOVERY_ENVIRONMENT")).toBe(true);
    const generic = fusion("work-only", "COMPLEMENT", { contexts: ["work", "recovery"], primaryAxes: ["DUTY"] });
    expect(primarySectionEligible(generic, "C9", "RECOVERY_ENVIRONMENT")).toBe(false);
  });
  it("support does not bypass an opposite fact-bomb conflict", () => {
    const strength = row("strength", { broadTheme: "other", allowedSections: ["C4"], preferredSections: ["C4"] });
    const a = shadow("F05_OVERTHINKING"), b = shadow("F06_TOO_FAST", { broadTheme: "other" });
    const rows = [strength, a, b, fusion("conditional", "TENSION")], graph = buildEditorialConflictGraph(rows, empty);
    const r = allocate(rows, graph.edges);
    const explained = Object.values(r.sections).flatMap(s => s.placements.map(p => p.candidateId));
    expect(explained.includes(a.id) && explained.includes(b.id)).toBe(false);
  });
  it("different shadow themes sharing the same source problem cannot double a fact bomb", () => {
    const a = shadow("money-scatter", { claimIds: ["M10"] }), b = shadow("opportunity-scatter", { claimIds: ["F08"] });
    const i = structuredClone(empty);
    i.guidance.problems.push({ id: "G29", problem: "OPPORTUNITY_HOPPING", humanProblemDescription: "existing source", semanticTheme: "OPPORTUNITY_HOPPING", contexts: ["money"], evidenceStrength: "MAIN", confidence: "HIGH", candidateStrategies: ["CAP_COMMITMENTS"], forbiddenStrategies: [], relatedProblemIds: [], sourceClaimIds: ["M10", "F08"], sourceResonanceIds: [], sourceTraitArcIds: [], sourceFusionIds: [], evidenceIds: [] });
    const graph = buildEditorialConflictGraph([a, b], i);
    expect(graph.edges.some(e => e.kind === "SEMANTIC_DUPLICATE")).toBe(true);
    expect(allocate([a, b], graph.edges, i).sections.C6.primaryCandidateIds).toHaveLength(1);
  });
  it("core theme may recur once, but each later section still needs a new theme", () => {
    const core = row("core", { sourceType: "CORE_GYEOL", allowedSections: ["C1"], preferredSections: ["C1"], broadTheme: "CORE" });
    const same = row("core-at-work", { broadTheme: "CORE", allowedSections: ["C8"], preferredSections: ["C8"] });
    const fresh = row("fresh-money", { slots: ["MONEY_STYLE"], allowedSections: ["C8"], preferredSections: ["C8"] });
    const r = allocate([core, same, fresh]), budget = buildEditorialThemeBudget(r.sections, [core, same, fresh]);
    expect(budget.find(x => x.theme === "CORE")?.primaryUses).toEqual(["C1", "C8"]);
    expect(r.sections.C8.diagnostics.newThemes).toContain("fresh-money");
  });
  it("C10 only recalls introduced strategies, no new root or unsupported theme", () => {
    const base = row("prior", { allowedSections: ["C4"], preferredSections: ["C4"] });
    const advice = row("advice", { sourceType: "GUIDANCE", guidanceIds: ["advice"], evidenceIds: base.evidenceIds, underlyingEvidenceIds: base.evidenceIds, myeongliEvidenceIds: base.evidenceIds, allowedSections: ["C10"], preferredSections: ["C10"], precursorIds: ["prior"], operatingRuleType: "THINKING", strategyIds: ["TIMEBOX_THINKING"] });
    const bad = row("unintroduced", { ...advice, id: "unintroduced", sourceId: "unintroduced", underlyingEvidenceIds: ["new"], operatingRuleType: "RECOVERY" });
    const r = allocate([base, advice, bad]); expect(r.sections.C10.primaryCandidateIds).toEqual(["advice"]);
    expect(r.suppressed.some(s => s.candidateId === "unintroduced" && s.reason === "C10_NEW_EVIDENCE_OR_UNINTRODUCED_PROBLEM")).toBe(true);
  });
  it("C10 five different rule slots, merged guidance wins over overlapping originals", () => {
    const slots = ["THINKING", "EXECUTION", "WORK_MONEY", "RELATIONSHIP", "RECOVERY"] as const;
    const base = row("prior", { allowedSections: ["C4"], preferredSections: ["C4"] });
    const rules = slots.map((slot, n) => row(`rule${n}`, { sourceType: "GUIDANCE", guidanceIds: [`rule${n}`], underlyingEvidenceIds: base.underlyingEvidenceIds, allowedSections: ["C10"], preferredSections: ["C10"], precursorIds: ["prior"], operatingRuleType: slot, strategyIds: [`strategy${n}`] }));
    expect(allocate([base, ...rules]).sections.C10.primaryCandidateIds).toHaveLength(5);
  });
  it("theme budgets and novelty shrink echoes instead of inventing new subject matter", () => {
    const rows = [row("deep", { broadTheme: "DEEP", allowedSections: ["C4"], preferredSections: ["C4"] }), row("deep-at-work", { broadTheme: "DEEP", allowedSections: ["C8"], preferredSections: ["C8"] })];
    const r = allocate(rows); const budget = buildEditorialThemeBudget(r.sections, rows);
    expect(budget[0].primaryUses).toHaveLength(1); expect(budget[0].supportUses.length).toBeLessThanOrEqual(1);
    expect(r.suppressed.some(x => ["THEME_PRIMARY_BUDGET", "THEME_RESERVED_FOR_OTHER_SECTION"].includes(x.reason))).toBe(true);
  });
  it("exact proof ownership, core allowance, first term definition only", () => {
    const rows = [row("alpha", { underlyingEvidenceIds: ["same", "other"], evidenceIds: ["same", "other"] }), row("beta", { underlyingEvidenceIds: ["same", "another"], evidenceIds: ["same", "another"], allowedSections: ["C8"], preferredSections: ["C8"] })];
    const r = allocate(rows), o = assignEditorialOwnership(r.sections, rows, empty);
    expect(o.evidenceOwnership.filter(e => e.evidenceId === "same")).toHaveLength(1);
    for (const e of o.evidenceOwnership) { expect(e.currentPrimaryUses).toBe(1); expect(e.currentSupportUses).toBeLessThanOrEqual(e.maxSupportUses); }
  });
  it("global explicit fusion max7, type caps and hidden presentation", () => {
    const sections = allocate([]).sections;
    const rows = Array.from({ length: 10 }, (_, n) => fusion(`fusion${n}`, n < 4 ? "REINFORCE" : n < 7 ? "TENSION" : "COMPLEMENT"));
    const targets: S[] = ["C2", "C2", "C7", "C8", "C3", "C3", "C9", "C1", "C4", "C6"];
    rows.forEach((c, n) => { const s = sections[targets[n]]; s.maxExplicitMbti = 2; s.primaryCandidateIds.push(c.id); s.placements.push({ candidateId: c.id, role: "PRIMARY", context: "identity", provenanceEvidenceIds: [], primaryEvidenceIds: [], supportEvidenceIds: [], provenanceOnlyEvidenceIds: [], presentationIntent: "HIDDEN", arcRoles: [], slots: [], preferredAdvice: false, antecedentCandidateIds: [], reuseIntent: "FIRST_MEANING" }); });
    const b = finalizeEditorialSections(sections, rows, true); expect(b.explicitTotal).toBeLessThanOrEqual(7); expect(b.explicit.REINFORCE).toBe(3); expect(b.explicit.TENSION).toBe(2); expect(Object.values(b.hidden).reduce((a, b) => a + b, 0)).toBeGreaterThan(0);
  });
  it.each(COMPREHENSIVE_SECTIONS)("%s contract always exists even for sparse sources", s => {
    const r = allocate([]); expect(r.sections[s].purpose).toBeTruthy(); expect(r.sections[s].primaryCandidateIds).toEqual([]);
  });
});

describe("editorial score, guards and context remain downstream-only", () => {
  it("weighted score is editorial, with exact repetition/evidence penalties", () => {
    const c = row("a"); expect(editorialScore(c, "C4") - editorialScore(c, "C4", 1)).toBe(20); expect(editorialScore(c, "C4") - editorialScore(c, "C4", 0, true)).toBe(50);
    const same = row("b", { broadTheme: c.broadTheme, underlyingEvidenceIds: c.underlyingEvidenceIds }); expect(editorialOverlap(c, same)).toBe(1);
    expect(editorialOverlap(c, row("other", { primaryAxes: ["CARE"] }))).toBe(0);
  });
  it.each(["LOW_GUIDANCE", "UNSUPPORTED_SPECIFICITY", "UNRESOLVED_CONTRADICTION", "FORBIDDEN_FORTUNE_PROMOTION", "AMPLIFIER_ONLY", "PRIOR_ONLY_FUSION", "UNSAFE_GUIDANCE"])("%s suppressed without changing source", reason => {
    const c = row("bad", { invalidReasons: [reason] }), before = JSON.stringify(c);
    const r = filterEditorialCandidates([c], empty); expect(r.eligible).toEqual([]); expect(r.suppressed.some(s => s.reason === reason)).toBe(true); expect(JSON.stringify(c)).toBe(before);
  });
  it("actual source annotations are resolved to node IDs, never annotation IDs as new proof", () => {
    const i = schedulerInputs(strong({ GOAL_DRIVE: 2, PRECISION: 2, LEADERSHIP: 2 }));
    const rows = collectComprehensiveCandidates(i).filter(c => c.sourceType === "FUSION"); expect(rows.length).toBeGreaterThan(0);
    const valid = filterEditorialCandidates(rows, i).eligible; expect(valid.length).toBeGreaterThan(0);
    for (const c of valid) expect(c.mbtiSourceNodeIds.every(id => i.mbti.sourceNodes.some(n => n.id === id && n.classification === "SCORING_SEMANTIC"))).toBe(true);
  });
  it("same person/different job only changes fit/advice, not traits or claim meanings", () => {
    const m = strong({ PRECISION: 2, STRUCTURE_STYLE: 2, ACTION_TEMPO: -2 });
    const a = schedulerInputs(m, "ISTJ", { detailJob: "출판 편집자" }), b = schedulerInputs(m, "ISTJ", {});
    const select = (i: ComprehensivePlanInputs) => collectComprehensiveCandidates(i).filter(c => c.sourceType !== "GUIDANCE").map(c => ({ id: c.id, text: c.sourceText, evidence: c.underlyingEvidenceIds }));
    expect(select(a)).toEqual(select(b));
    expect(a.guidance.context.workModes[0].mode).toBe("EDITORIAL_REVIEW"); expect(b.guidance.context.workModes[0].mode).toBe("GENERAL");
  });
});
