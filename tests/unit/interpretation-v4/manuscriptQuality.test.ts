import { beforeAll, describe, expect, it } from "vitest";
import { HUMAN_OUTCOMES, MBTI_HUMAN_BEHAVIORS, humanOutcome, mbtiHumanBehavior } from "../../../src/lib/interpretation-v4/narrativeHumanOutcome";
import { BEHAVIOR_FAMILIES, meaningSignature, repeatedMeaning } from "../../../src/lib/interpretation-v4/narrativeMeaningSignature";
import { MBTI_REASON_FAMILIES, humanMbtiReason, visibleMbtiDomainRank } from "../../../src/lib/interpretation-v4/narrativeMbtiReason";
import { GUIDANCE_SHORT_TITLES } from "../../../src/lib/interpretation-v4/operatingRuleRegistry";
import { SEMANTIC_SHORT_TITLES } from "../../../src/lib/interpretation-v4/narrativeTitleShort";
import { buildOperatingRules, mergeOperatingRules } from "../../../src/lib/interpretation-v4/operatingRuleBuilder";
import { planFortuneReasons, fortuneSupportAxes, fortuneSupportReason } from "../../../src/lib/interpretation-v4/narrativePositiveReward";
import { auditManuscriptQuality, positiveRewardDepth } from "../../../src/lib/interpretation-v4/manuscriptQualityAudit";
import { validateComprehensiveManuscript } from "../../../src/lib/interpretation-v4/comprehensiveManuscriptValidator";
import { renderComprehensiveManuscript } from "../../../src/lib/interpretation-v4/comprehensiveManuscriptRenderer";
import { buildIntegratedMyeongliProfile } from "../../../src/lib/interpretation-v4/foundationIntegratedProfile";
import { freshNarrativeMemory } from "../../../src/lib/interpretation-v4/narrativeMemory";
import { normalizeGuidanceContext } from "../../../src/lib/interpretation-v4/guidanceContext";
import type { ManuscriptInput, ComprehensiveManuscriptDraft } from "../../../src/lib/interpretation-v4/comprehensiveManuscriptCore";
import type { SemanticAxis } from "../../../src/lib/interpretation-v4/semanticCore";
import { NARRATIVE_FIXTURES, fixtureInput } from "./narrativeFixtures";
import { schedulerInputs, schedulerPlan } from "./comprehensiveSchedulerFixtures";

describe("13D-6A closed language registries", () => {
  it("covers all 36 axes with distinct signed behavior, not inferred opposites", () => {
    expect(Object.keys(HUMAN_OUTCOMES)).toHaveLength(36);
    expect(Object.keys(MBTI_HUMAN_BEHAVIORS)).toEqual(Object.keys(HUMAN_OUTCOMES));
    for (const axis of Object.keys(HUMAN_OUTCOMES) as SemanticAxis[]) {
      expect(humanOutcome(axis, 1)).toBeTruthy(); expect(mbtiHumanBehavior(axis, 1)).toBeTruthy();
      expect(humanOutcome(axis, 0)).toBeUndefined();
      expect(mbtiHumanBehavior(axis, 0)).toBeUndefined();
      if (HUMAN_OUTCOMES[axis].length === 1) expect(humanOutcome(axis, -1)).toBeUndefined();
      else expect(humanOutcome(axis, -1)).not.toBe(humanOutcome(axis, 1));
      expect(mbtiHumanBehavior(axis, 1)).not.toBe(humanOutcome(axis, 1));
    }
  });
  it("has typed behavior families and complete short titles", () => {
    expect(new Set(BEHAVIOR_FAMILIES).size).toBeGreaterThanOrEqual(23);
    expect(Object.keys(GUIDANCE_SHORT_TITLES)).toHaveLength(25);
    for (const titles of Object.values(SEMANTIC_SHORT_TITLES)) expect(titles.length).toBeGreaterThanOrEqual(2);
    for (const title of [...Object.values(GUIDANCE_SHORT_TITLES), ...Object.values(SEMANTIC_SHORT_TITLES).flat()]) expect(title.length).toBeLessThanOrEqual(40);
  });
  it("C8 prefers real work over study and never uses parental source as customer reason", () => {
    expect(MBTI_REASON_FAMILIES).toHaveLength(6);
    expect(visibleMbtiDomainRank("WORK", "C8", "work")).toBeGreaterThan(visibleMbtiDomainRank("STUDY", "C8", "work"));
    expect(visibleMbtiDomainRank("PARENTS", "C2", "identity")).toBe(-1);
    expect(visibleMbtiDomainRank("CHILDREN", "C7", "social")).toBe(-1);
    expect(visibleMbtiDomainRank("MYEONGLI_BRIDGE_HINT", "C2", "identity")).toBe(-1);
  });
  it("does not reinterpret unemployed as job seeker or engagement as married", () => {
    const r = normalizeGuidanceContext({ jobStatus: "unemployed", relationshipStatus: "marriage_preparing" });
    expect(r.ok && r.value.lifeStatus).toBe("OTHER");
    expect(r.ok && r.value.relationshipStatus).toBe("OTHER");
    expect(normalizeGuidanceContext({ jobStatus: "freelancer", detailJob: "" }).ok).toBe(true);
  });
});

describe("actual calculated manuscript: reason and operating-rule proof", () => {
  let input: ManuscriptInput, draft: ComprehensiveManuscriptDraft;
  beforeAll(() => {
    const f = NARRATIVE_FIXTURES[0], natal = buildIntegratedMyeongliProfile(fixtureInput(f).calculation);
    if (!natal.ok) throw new Error("fixture calculation failed");
    const profiles = schedulerInputs(natal.value, f.mbti, f.context);
    input = { profiles, plan: schedulerPlan(profiles), reportStableKey: f.id };
    const r = renderComprehensiveManuscript(input);
    if (!r.ok) throw new Error(r.error);
    draft = r.draft;
  }, 60000);
  it("signed annotation, actual scoring node and domain are mandatory", () => {
    const absent = structuredClone(input.profiles); absent.mbti.annotations = [];
    for (const f of [...input.profiles.fusion.reinforce, ...input.profiles.fusion.tensions, ...input.profiles.fusion.complements]) {
      const reason = humanMbtiReason(input.profiles, f, "C8", freshNarrativeMemory());
      if (!reason) continue;
      expect(f.mbti.sourceNodeIds).toContain(reason.nodeId);
      expect(input.profiles.mbti.annotations.some(a => a.sourceNodeId === reason.nodeId && a.annotationConfidence !== "REFERENCE_ONLY" && (a.axes[reason.axis] ?? 0) * reason.direction > 0)).toBe(true);
      expect(reason.text).not.toMatch(/\b(?:Fe|Fi|Te|Ti|Ne|Ni|Se|Si)\b/i);
      if (f.type === "TENSION") expect(reason.text).not.toMatch(/비슷하게|닮아|에서도|역시/);
      expect(humanMbtiReason(absent, f, "C8", freshNarrativeMemory())).toBeUndefined();
    }
  });
  it("same-role meaning suppresses; a strength-to-shadow arc is not a duplicate", () => {
    const p = input.plan.sections.C4.placements[0], c = input.plan.candidates.find(c => c.id === p.candidateId)!;
    const strength = meaningSignature(c, "C4", p);
    expect(repeatedMeaning(strength, [strength])).toEqual(strength);
    expect(repeatedMeaning({ ...strength, traitArcRole: "SHADOW" }, [strength])).toBeUndefined();
    expect(repeatedMeaning({ ...strength, traitArcRole: "GUIDANCE_RECALL" }, [strength])).toBeUndefined();
  });
  it("fortune reasons come only from the selected Claim and independent families", () => {
    for (const c of input.plan.candidates.filter(c => c.fortune)) {
      const plan = planFortuneReasons(c, input.profiles);
      const ids = [...plan.primaryReasonEvidenceIds, ...plan.secondaryReasonEvidenceIds];
      expect(ids.every(id => c.myeongliEvidenceIds.includes(id))).toBe(true);
      const roots = ids.map(id => input.profiles.myeongli.evidence.find(e => e.id === id)!.family);
      expect(new Set(roots).size).toBe(roots.length);
      if (c.sourceId === "S08_MONEY_AND_HONOR" && ids.length === 2) expect(roots).toEqual(["WEALTH", "OFFICER"]);
      else for (const id of plan.secondaryReasonEvidenceIds) {
        const e = input.profiles.myeongli.evidence.find(e => e.id === id)!;
        expect(fortuneSupportAxes(c).some(axis => (e.axes[axis] ?? 0) > 0)).toBe(true);
        expect(fortuneSupportReason(e,c)).toBeTruthy();
        if (c.fortuneFamilies.includes("CHARM_VISIBILITY")) expect(fortuneSupportReason(e,c)).not.toMatch(/작은 틀림|빠진 조건/);
      }
    }
  });
  it("operating rules require actually introduced evidence, no padding for empty source", () => {
    const result = buildOperatingRules(input, draft);
    expect(result.selected.length).toBeGreaterThanOrEqual(3); expect(result.selected.length).toBeLessThanOrEqual(5);
    const prior = Object.values(draft.sections).filter(s => s.sectionId !== "C10");
    for (const rule of result.eligible) {
      expect(rule.introducedInSection.length).toBeGreaterThan(0);
      expect(rule.evidenceIds.every(id => prior.some(s => s.evidenceIds.includes(id)))).toBe(true);
      expect(rule.antecedentCandidateIds.every(id => prior.some(s => s.sourceCandidateIds.includes(id)))).toBe(true);
    }
    const empty = structuredClone(draft);
    for (const s of Object.values(empty.sections)) { s.sourceCandidateIds = []; s.evidenceIds = []; }
    expect(buildOperatingRules(input, empty).eligible).toEqual([]);
    const weak = structuredClone(input);
    for (const c of weak.plan.candidates) c.confidence = 0.1;
    expect(buildOperatingRules(weak, draft).eligible).toEqual([]);
  });
  it("Guidance wins a duplicate switch but retains both provenance paths", () => {
    const source = buildOperatingRules(input, draft).eligible[0];
    const a = { ...source, id: "switch", sourceType: "TENSION_SWITCH" as const, sourceGuidanceIds: [], sourceFusionIds: ["actual-switch"], mergedSourceTypes: ["TENSION_SWITCH" as const] };
    const b = { ...source, id: "guidance", sourceType: "GUIDANCE" as const, sourceGuidanceIds: ["GS16"], sourceFusionIds: [], mergedSourceTypes: ["GUIDANCE" as const] };
    const merged = mergeOperatingRules([a, b]);
    expect(merged).toHaveLength(1); expect(merged[0].sourceType).toBe("GUIDANCE");
    expect(merged[0].sourceFusionIds).toContain("actual-switch"); expect(merged[0].sourceGuidanceIds).toContain("GS16");
  });
  it("an actual charm Claim can be used only with introduced expression support", () => {
    const f = NARRATIVE_FIXTURES[3], natal = buildIntegratedMyeongliProfile(fixtureInput(f).calculation);
    if (!natal.ok) return expect.unreachable("actual fixture calculation");
    const profiles = schedulerInputs(natal.value, f.mbti, f.context);
    const candidateInput = { profiles, plan: schedulerPlan(profiles), reportStableKey: f.id };
    const rendered = renderComprehensiveManuscript(candidateInput);
    if (!rendered.ok) return expect.unreachable(rendered.error);
    const rules = buildOperatingRules(candidateInput, rendered.draft).eligible.filter(r => r.mergedSourceTypes.includes("FORTUNE_OPPORTUNITY"));
    expect(rules.length).toBeGreaterThan(0);
    for (const r of rules) {
      const claims = candidateInput.plan.candidates.filter(c => r.antecedentCandidateIds.includes(c.id) && c.fortune);
      expect(claims.some(c => rendered.draft.sections.C5.sourceCandidateIds.includes(c.id))).toBe(true);
      expect(profiles.myeongli.evidence.some(e => r.evidenceIds.includes(e.id) && (e.axes.EXPRESSION ?? 0) > 0)).toBe(true);
    }
    const absent = structuredClone(rendered.draft);
    const expression = candidateInput.plan.candidates.filter(c => c.primaryAxes.includes("EXPRESSION")).map(c => c.id);
    for (const s of Object.values(absent.sections)) s.sourceCandidateIds = s.sourceCandidateIds.filter(id => !expression.includes(id));
    expect(buildOperatingRules(candidateInput, absent).eligible.some(r => r.mergedSourceTypes.includes("FORTUNE_OPPORTUNITY"))).toBe(false);
    expect(buildOperatingRules(input, draft).eligible.some(r => r.meaningKey === "PEOPLE_HELP")).toBe(false); // P01 is only Level 3 here.
  }, 60000);
  it("tampering cannot add a new C10 evidence or change an action", () => {
    const d = structuredClone(draft);
    d.sections.C10.evidenceIds.push("invented");
    d.sections.C10.operatingRules![0].source!.ruleText = "unsupported action";
    expect(validateComprehensiveManuscript(input, d).hardViolations.map(x => x.code)).toEqual(expect.arrayContaining(["UNSUPPORTED_OPERATING_RULE", "C10_NEW_EVIDENCE"]));
    const missing = structuredClone(draft); delete missing.sections.C10.operatingRules![0].source;
    expect(validateComprehensiveManuscript(input, missing).hardViolations.some(x => x.code === "MISSING_OPERATING_RULE_SOURCE")).toBe(true);
  });
  it("records real depth separately; extra empty blocks cannot improve quality", () => {
    const s = structuredClone(draft.sections.C5), full = positiveRewardDepth(s);
    expect(full.rows.every(r => r.meaning && r.why && r.value)).toBe(true);
    const sparse = structuredClone(s); sparse.blocks = sparse.blocks.map(b => ({ ...b, sentences: b.sentences.filter(s => s.role === "GOOD_RESULT") }));
    expect(positiveRewardDepth(sparse).score).toBeLessThan(full.score);
    expect(auditManuscriptQuality(draft).technicalMbti).toEqual([]);
  });
  it("reports sentence-level low scores rather than relaxing the original human metric", () => {
    const audit = auditManuscriptQuality(draft);
    expect(audit.lowHumanSentences.length).toBeGreaterThan(0);
    expect(audit.meta.auxiliary).toBe(0); expect(audit.meta.contributes).toBe(0);
    expect(audit.longTitles).toEqual([]);
  });
});
