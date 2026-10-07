import { afterAll, describe, expect, it } from "vitest";
import { createHash } from "node:crypto";
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { buildComprehensiveEditorialPlan, COMPREHENSIVE_EDITORIAL_STEPS } from "../../../src/lib/interpretation-v4/comprehensiveEditorialPlan";
import { COMPREHENSIVE_SECTIONS } from "../../../src/lib/interpretation-v4/comprehensivePlanCore";
import { COMPREHENSIVE_SECTION_CONTRACTS } from "../../../src/lib/interpretation-v4/comprehensiveSectionContracts";
import { auditComprehensivePlan } from "../../../src/lib/interpretation-v4/comprehensiveQualityAudit";
import { buildIntegratedMyeongliProfile } from "../../../src/lib/interpretation-v4/foundationIntegratedProfile";
import { schedulerInputs, schedulerPlan } from "./comprehensiveSchedulerFixtures";
import { myProfile } from "./fusionSemanticFixtures";
import { NARRATIVE_FIXTURES, fixtureInput } from "./narrativeFixtures";

const hash = (v: unknown) => createHash("sha256").update(JSON.stringify(v)).digest("hex");
const review: unknown[] = [];
afterAll(() => { if (process.env.EDITORIAL_REVIEW_EXPORT === "1") { mkdirSync("/tmp/gyeol-13d4-editorial", { recursive: true }); writeFileSync("/tmp/gyeol-13d4-editorial/review.json", JSON.stringify(review, null, 2)); } });

describe("13D-4 full read-only profile boundary", () => {
  const inputs = schedulerInputs(), plan = schedulerPlan(inputs);
  it("10 sections and 25 ordered stages, no prose/Book connection", () => {
    expect(Object.keys(plan.sections)).toEqual(COMPREHENSIVE_SECTIONS);
    expect(plan.debug.pipelineSteps).toEqual(COMPREHENSIVE_EDITORIAL_STEPS);
    expect(plan.debug.pipelineSteps).toHaveLength(25);
    expect(plan.coreGyeolId).toBe(inputs.resonance.bestCoreGyeol?.id);
    expect(plan.qualityAudit.coreGyeolPresent).toBe(true);
    expect(plan.reservations.slice(0, 1)[0].sectionId).toBe("C1");
    expect(plan.reservations.filter(r => r.stage === "RESERVE_FORTUNE").every(r => r.sectionId === "C5")).toBe(true);
    for (const [id, section] of Object.entries(plan.sections)) {
      expect(section.primaryCandidateIds.length).toBeLessThanOrEqual(COMPREHENSIVE_SECTION_CONTRACTS[id as keyof typeof plan.sections].maxPrimary);
      expect(section).not.toHaveProperty("paragraphs");
    }
  });
  it("deterministic and JSON-safe with all six profiles unchanged", () => {
    const before = hash(inputs);
    expect(schedulerPlan(inputs)).toEqual(plan); expect(hash(inputs)).toBe(before);
    expect(JSON.parse(JSON.stringify(plan))).toEqual(plan);
  });
  it("ownership and terminology are one-owner; provenance never inflated", () => {
    for (const c of plan.candidates) expect(c.independentEvidenceCount).toBe(new Set(c.underlyingEvidenceIds).size);
    expect(plan.evidenceOwnership.length).toBeGreaterThan(0);
    for (const o of plan.evidenceOwnership) { expect(o.currentPrimaryUses).toBe(1); expect(o.currentSupportUses).toBeLessThanOrEqual(o.maxSupportUses); }
    expect(new Set(plan.terminologyOwnership.map(t => t.termKey)).size).toBe(plan.terminologyOwnership.length);
    expect(plan.terminologyOwnership.filter(t => t.definitionOwner).length).toBeLessThanOrEqual(14);
    expect(plan.qualityAudit.exactEvidenceOveruse).toEqual([]);
    expect(plan.qualityAudit.semanticThemeOveruse).toEqual([]);
    expect(plan.qualityAudit.sectionNoveltyFailures).toEqual([]);
  });
  it("C1 contains core only, C5 fortune, C6 shadow, no generic operating rules", () => {
    const c1 = plan.sections.C1.primaryCandidateIds.map(id => plan.candidates.find(c => c.id === id)!);
    expect(c1).toHaveLength(1); expect(c1[0].sourceType).toBe("CORE_GYEOL");
    const c5 = plan.sections.C5.primaryCandidateIds.map(id => plan.candidates.find(c => c.id === id)!);
    expect(c5.length).toBeGreaterThan(0); expect(c5.every(c => c.fortune && c.claimLevel! >= 3)).toBe(true);
    expect(plan.sections.C6.factBombGroup).toEqual(plan.sections.C6.placements.filter(p => plan.candidates.find(c => c.id === p.candidateId)!.factBomb).map(p => p.candidateId));
    expect(plan.sections.C6.factBombGroup.length).toBeLessThanOrEqual(4);
    expect(plan.sections.C6.placements.filter(p => p.preferredAdvice).length).toBeLessThanOrEqual(2);
    for (const id of plan.sections.C10.primaryCandidateIds) { const c = plan.candidates.find(c => c.id === id)!; expect(c.sourceType).toBe("GUIDANCE"); expect(c.strategyIds?.length).toBeGreaterThan(0); }
    expect(plan.qualityAudit.c10NewEvidenceViolations).toBe(0);
  });
  it("C2 actual source only, C3 has a preserved third interpretation, explicit max7", () => {
    expect(plan.sections.C2.primaryCandidateIds.length).toBeGreaterThan(0);
    expect(plan.explicitMbtiBudget.count).toBeGreaterThan(0);
    for (const id of plan.sections.C2.primaryCandidateIds) { const c = plan.candidates.find(c => c.id === id)!; expect(c.fusionType).toBe("REINFORCE"); expect(c.mbtiSourceNodeIds.length).toBeGreaterThan(0); }
    for (const t of plan.sections.C3.thirdInterpretations) { expect(t.conditionSplit.resolved).toBe(true); expect(t.thirdInterpretationSource).toBeTruthy(); }
    expect(plan.fusionBudget.explicitTotal).toBeLessThanOrEqual(7); expect(plan.explicitMbtiBudget.count).toBe(plan.fusionBudget.explicitTotal);
    expect(plan.qualityAudit.unresolvedContradictions).toBe(0);
  });
  it("C8 source context and concrete terms, C10 recalls core, nine transition intents", () => {
    expect(plan.sections.C8.context.rawJobText).toBe("출판 편집자");
    expect(plan.sections.C8.preferredConcreteTerms).toContain("돈");
    expect(plan.sections.C10.coreGyeolRecall).toBe(true);
    expect(Object.values(plan.sections).filter(s => s.bridgeIntent)).toHaveLength(9);
    expect(plan.sections.C5.bridgeIntent).toBe("FORTUNE_TO_SHADOW");
    expect(plan.qualityAudit.emotionalArcStatus).toBe("VALID");
  });
  it("forged guidance and upstream diagnostics fail closed without mutating", () => {
    const bad = structuredClone(inputs); bad.guidance.topGuidance[0].customerAdvice = "invented";
    const r = buildComprehensiveEditorialPlan(bad); expect(r.ok).toBe(false);
    if (!r.ok) expect(r.diagnostics.hardErrors).toContain("STALE_OR_FORGED_GUIDANCE_PROFILE");
    const hard = structuredClone(inputs); hard.guidance.diagnostics.hardErrors.push("UNSAFE"); expect(buildComprehensiveEditorialPlan(hard).ok).toBe(false);
  });
  it("post-plan validator catches reference, ownership, section, split and C10 tampering", () => {
    const bad = structuredClone(plan); bad.sections.C1.primaryCandidateIds.push("missing");
    expect(auditComprehensivePlan(bad, inputs, bad.debug.conflictGraph).diagnostics.hardErrors).toContain("SECTION_MAX:C1");
    const owner = structuredClone(plan); owner.evidenceOwnership[0].currentPrimaryUses = 2;
    expect(auditComprehensivePlan(owner, inputs, owner.debug.conflictGraph).diagnostics.hardErrors).toContain("EXACT_EVIDENCE_OVERUSE");
    const proof = structuredClone(plan); proof.sections.C1.placements[0].provenanceEvidenceIds.push("nonexistent");
    expect(auditComprehensivePlan(proof, inputs, proof.debug.conflictGraph).diagnostics.hardErrors.some(e => e.startsWith("INVALID_EVIDENCE"))).toBe(true);
    const missing = structuredClone(plan); delete (missing.sections as Partial<typeof missing.sections>).C8;
    expect(auditComprehensivePlan(missing, inputs, missing.debug.conflictGraph).diagnostics.hardErrors).toContain("SECTION_CONTRACT_10_REQUIRED");
    const term = structuredClone(plan); term.terminologyOwnership.push({ ...term.terminologyOwnership[0], definitionOwner: "C8" });
    expect(auditComprehensivePlan(term, inputs, term.debug.conflictGraph).diagnostics.hardErrors).toContain("TERM_DEFINED_TWICE");
    const partition = structuredClone(plan), p = partition.sections.C1.placements[0];
    p.provenanceOnlyEvidenceIds.push(p.primaryEvidenceIds[0]);
    expect(auditComprehensivePlan(partition, inputs, partition.debug.conflictGraph).diagnostics.hardErrors.some(e => e.startsWith("EXPOSURE_PARTITION_OVERLAP"))).toBe(true);
    const recall = structuredClone(plan), advice = recall.candidates.find(c => c.sourceType === "GUIDANCE")!;
    advice.underlyingEvidenceIds = ["never-introduced"];
    recall.sections.C10.placements = [{ ...structuredClone(plan.sections.C1.placements[0]), candidateId: advice.id, role: "RECALL", primaryEvidenceIds: [], supportEvidenceIds: [], provenanceEvidenceIds: ["never-introduced"], provenanceOnlyEvidenceIds: ["never-introduced"] }];
    recall.sections.C10.primaryCandidateIds = [advice.id];
    expect(auditComprehensivePlan(recall, inputs, recall.debug.conflictGraph).diagnostics.hardErrors).toContain("C10_NEW_EVIDENCE");
  });
  it("MBTI unknown and genuinely sparse input are valid compact plans", () => {
    const unknown = schedulerPlan(schedulerInputs(undefined, null));
    expect(unknown.sections.C2.sectionKind).toBe("MYEONGLI_CONFIRMATION"); expect(unknown.explicitMbtiBudget.count).toBe(0);
    expect(unknown.candidates.every(c => !c.mbtiSourceNodeIds.length)).toBe(true);
    const empty = schedulerPlan(schedulerInputs(myProfile([]), null, {}));
    expect(empty.coreGyeolId).toBe(null); expect(empty.diagnostics.hardErrors).toEqual([]);
    expect(empty.sections.C5.sectionKind).toBe("POSITIVE_POTENTIAL"); expect(empty.sections.C5.forbidFortuneVocabulary).toBe(true);
    expect(empty.sections.C10.primaryCandidateIds).toEqual([]);
  });
});

describe("actual 12-person review cohort and isolation", () => {
  it.each(NARRATIVE_FIXTURES)("$id actual chart -> isolated plan", fixture => {
    const calculation = fixtureInput(fixture).calculation, natal = buildIntegratedMyeongliProfile(calculation);
    if (!natal.ok) return expect.unreachable(JSON.stringify(natal.diagnostics));
    const input = schedulerInputs(natal.value, fixture.mbti, fixture.context), before = hash({ input, calculation });
    const plan = schedulerPlan(input); expect(hash({ input, calculation })).toBe(before);
    expect(plan.diagnostics.hardErrors).toEqual([]); expect(plan.qualityAudit.sectionNoveltyFailures).toEqual([]);
    review.push({ fixture: fixture.id, name: fixture.name, mbti: fixture.mbti, context: input.guidance.context, core: input.resonance.bestCoreGyeol?.humanDescription ?? null,
      sections: Object.values(plan.sections).map(s => ({ ...s, sources: s.placements.map(p => { const c = plan.candidates.find(c => c.id === p.candidateId)!; return { id: c.id, source: c.sourceText, theme: c.broadTheme, role: p.role, traits: p.arcRoles, guidance: p.guidanceRenderIntent, proof: p.provenanceEvidenceIds }; }) })),
      candidates: plan.candidates, ownership: plan.evidenceOwnership, themes: plan.themeBudget, fusion: plan.fusionBudget, audit: plan.qualityAudit, diagnostics: plan.diagnostics,
      reservations: plan.reservations, suppressed: plan.suppressedCandidates, sourceAvailability: { reinforcement: input.fusion.reinforce.filter(c => c.strength !== "SUPPORT").length, resolvedTension: input.fusion.tensions.filter(c => c.conditionSplit?.resolved && c.strength !== "SUPPORT").length, guidance: input.guidance.topGuidance.length },
      checklist: ["C1 identity vs C2 confirmation", "C3 conditional discovery", "C4 distinct strengths", "C5 actual fortune", "C6 distinct shadows", "C7 social not partner prediction", "C8 work and money", "C9 composite not element list", "C10 antecedents only"] });
  }, 60000);
  it("scheduler is not consumed by prior layers, six products, UI, calculations or providers", () => {
    const modules = ["comprehensivePlanCore", "comprehensiveSectionContracts", "comprehensiveCandidateAdapter", "comprehensiveScoring", "comprehensiveConflictGraph", "comprehensiveReservation", "comprehensiveAllocator", "comprehensiveEvidenceOwnership", "comprehensiveDiagnostics", "comprehensiveQualityAudit", "comprehensiveEditorialPlan"];
    function walk(dir: string): string[] { return readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(join(dir, e.name)) : /\.tsx?$/.test(e.name) ? [join(dir, e.name)] : []); }
    for (const file of walk("src")) {
      // Product adapters may consume normalization/types; schedulers and core remain isolated.
      if (["comprehensiveProductAdapter", "careerProductSelection", "careerProductNarrative", "relationshipProductView", "relationshipProductNarrative"].some(n => file === `src/lib/interpretation-v4/${n}.ts`)) continue;
      const text = readFileSync(file, "utf8");
      if (modules.some(m => file === `src/lib/interpretation-v4/${m}.ts`)) expect(text).not.toMatch(/Math\.random|Date\.now|new Date|process\.env|fetch\(|calculateSaju\(|from ["'][^"']*(?:Composer|bookProjection|runtimeShadow|supabase|openai)/i);
      else if (!["narrativeSceneCore", "narrativeTitleCore", "comprehensiveNarrativeAdapter", "comprehensiveManuscriptCore", "comprehensiveSectionRenderer", "comprehensiveManuscriptValidator", "comprehensiveManuscriptRenderer", "narrativeMbtiReason", "narrativeMeaningSignature", "narrativePositiveReward", "narrativeTitleShort", "comprehensiveManuscriptPolish", "operatingRuleCore", "operatingRuleBuilder", "narrativeHumanFirst", "narrativeHumanSurface", "narrativeCausality", "narrativeRecovery"].some(m => file === `src/lib/interpretation-v4/${m}.ts`)) for (const m of modules) expect(text, file).not.toMatch(new RegExp(`["'][^"']*/${m}["']`));
    }
  });
});
