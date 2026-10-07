import { COMPREHENSIVE_SECTIONS, type ComprehensiveEditorialPlan as Plan, type ComprehensivePlanInputs, type ComprehensivePlanQualityAudit, type ComprehensiveSectionId as S, type EditorialConflictEdge } from "./comprehensivePlanCore";
import { COMPREHENSIVE_SECTION_CONTRACTS as contracts, primarySectionEligible, sectionFit } from "./comprehensiveSectionContracts";
import { editorialUnique } from "./comprehensiveCandidateAdapter";
import { emptyComprehensiveDiagnostics } from "./comprehensiveDiagnostics";

type AuditInput = Pick<Plan, "candidates" | "sections" | "evidenceOwnership" | "terminologyOwnership" | "themeBudget" | "fusionBudget" | "suppressedCandidates">;
export function auditComprehensivePlan(plan: AuditInput, input: ComprehensivePlanInputs, graph: readonly EditorialConflictEdge[]) {
  const d = emptyComprehensiveDiagnostics(), errors = d.hardErrors, warnings = d.warnings, byId = new Map(plan.candidates.map(c => [c.id, c]));
  const keys = Object.keys(plan.sections);
  if (keys.length !== 10 || COMPREHENSIVE_SECTIONS.some(s => !keys.includes(s))) errors.push("SECTION_CONTRACT_10_REQUIRED");
  const sections = COMPREHENSIVE_SECTIONS.map(s => plan.sections[s]).filter(Boolean);
  if (new Set(sections.map(s => s.sectionId)).size !== 10) errors.push("DUPLICATE_SECTION_ID");
  const used = sections.flatMap(s => s.placements.map(p => ({ s: s.sectionId, p, c: byId.get(p.candidateId) })));
  if (byId.size !== plan.candidates.length) errors.push("DUPLICATE_CANDIDATE_ID");
  const roots = new Set([...input.myeongli.evidence.map(e => e.id), ...input.mbti.sourceNodes.filter(n => n.classification === "SCORING_SEMANTIC").map(n => n.id)]);
  d.candidateCount = plan.candidates.length; d.assignedPrimaryCount = used.filter(x => x.p.role === "PRIMARY").length; d.assignedSupportCount = used.filter(x => x.p.role === "SUPPORT").length; d.suppressedCount = new Set(plan.suppressedCandidates.map(x => x.candidateId)).size;
  for (const section of sections) {
    const s = section.sectionId;
    if (!contracts[s]) { errors.push("INVALID_SECTION_ID"); continue; }
    d.sectionCoverage[s] = section.primaryCandidateIds.length; d.sectionNovelty[s] = section.diagnostics.newThemes;
    if (section.primaryCandidateIds.length > contracts[s].maxPrimary || section.supportingCandidateIds.length > contracts[s].maxSupport) errors.push(`SECTION_MAX:${s}`);
    if ([...section.primaryCandidateIds, ...section.supportingCandidateIds].some(id => !byId.has(id))) errors.push(`INVALID_CANDIDATE_REFERENCE:${s}`);
    if (new Set(section.placements.map(p => p.candidateId)).size !== section.placements.length) errors.push(`DUPLICATE_PLACEMENT:${s}`);
    const expectedPrimary = section.placements.filter(p => p.role !== "SUPPORT").map(p => p.candidateId);
    if (JSON.stringify(expectedPrimary) !== JSON.stringify(section.primaryCandidateIds) || JSON.stringify(section.placements.filter(p => p.role === "SUPPORT").map(p => p.candidateId)) !== JSON.stringify(section.supportingCandidateIds)) errors.push(`PLACEMENT_INDEX_MISMATCH:${s}`);
    if (section.explicitMbtiCandidateIds.length > section.maxExplicitMbti || !input.mbti.available && section.explicitMbtiCandidateIds.length) errors.push(`MBTI_BUDGET:${s}`);
    if (section.primaryCandidateIds.length < contracts[s].target[0]) warnings.push(`SPARSE_SECTION:${s}`);
    if (section.placements.filter(p => p.preferredAdvice).length > (s === "C6" || s === "C9" ? 2 : s === "C10" ? 5 : 1)) errors.push(`GUIDANCE_LIMIT:${s}`);
    for (const p of section.placements) {
      const c = byId.get(p.candidateId);
      if (!c) { errors.push(`INVALID_CANDIDATE:${p.candidateId}`); continue; }
      if (!sectionFit(c, s) || p.role === "PRIMARY" && !primarySectionEligible(c, s, section.sectionKind) || s === "C10" && (p.role !== "RECALL" || c.sourceType !== "GUIDANCE")) errors.push(`INVALID_SECTION_CONTRACT:${s}:${c.id}`);
      if (c.invalidReasons.length) errors.push(`SUPPRESSED_CANDIDATE_PLACED:${c.id}`);
      if (p.provenanceEvidenceIds.some(id => !roots.has(id)) || c.mbtiSourceNodeIds.some(id => !input.mbti.sourceNodes.some(n => n.id === id && n.classification === "SCORING_SEMANTIC"))) errors.push(`INVALID_EVIDENCE:${c.id}`);
      if (editorialUnique(p.provenanceEvidenceIds).join("|") !== editorialUnique(c.underlyingEvidenceIds).join("|")) errors.push(`PROVENANCE_LOSS:${c.id}`);
      if (editorialUnique([...p.primaryEvidenceIds, ...p.supportEvidenceIds, ...p.provenanceOnlyEvidenceIds]).join("|") !== editorialUnique(p.provenanceEvidenceIds).join("|")) errors.push(`EXPOSURE_PARTITION_LOSS:${c.id}`);
      const partition = [...p.primaryEvidenceIds, ...p.supportEvidenceIds, ...p.provenanceOnlyEvidenceIds];
      if (new Set(partition).size !== partition.length) errors.push(`EXPOSURE_PARTITION_OVERLAP:${c.id}`);
      if ([...p.primaryEvidenceIds, ...p.supportEvidenceIds, ...p.provenanceOnlyEvidenceIds].some(id => !p.provenanceEvidenceIds.includes(id))) errors.push(`INVALID_EXPOSURE_REF:${c.id}`);
      if (c.fortune && (!(c.claimLevel && c.claimLevel >= 2) || !c.claimIds.every(id => input.claims.candidates.some(x => x.id === id && x.diagnostics.primaryMyeongliGatePassed)))) errors.push(`FORBIDDEN_FORTUNE:${c.id}`);
      if (s === "C3" && c.fusionType === "TENSION" && (!c.conditionSplit?.resolved || !c.thirdInterpretationSource || !section.thirdInterpretations.some(t => t.candidateId === c.id))) errors.push(`C3_MISSING_SPLIT:${c.id}`);
      if (p.presentationIntent === "EXPLICIT" && (!c.mbtiSourceNodeIds.length || !input.mbti.available || !section.explicitMbtiCandidateIds.includes(c.id))) errors.push(`INVALID_EXPLICIT_MBTI:${c.id}`);
    }
  }
  for (const o of plan.evidenceOwnership) {
    const primaries = used.filter(x => x.p.primaryEvidenceIds.includes(o.evidenceId)), supports = used.filter(x => x.p.supportEvidenceIds.includes(o.evidenceId));
    if (primaries.length !== 1 || primaries[0]?.s !== o.primaryOwner || o.currentPrimaryUses !== primaries.length || supports.length > o.maxSupportUses || supports.length !== o.currentSupportUses || supports.some(x => !o.supportAllowed.includes(x.s))) d.evidenceReuseWarnings.push(o.evidenceId);
  }
  const exposureIds = used.flatMap(x => x.p.primaryEvidenceIds);
  if (new Set(exposureIds).size !== exposureIds.length) errors.push("EXACT_EVIDENCE_PRIMARY_TWICE");
  if (new Set(plan.evidenceOwnership.map(o => o.evidenceId)).size !== plan.evidenceOwnership.length) errors.push("DUPLICATE_EVIDENCE_OWNER");
  for (const id of used.flatMap(x => [...x.p.primaryEvidenceIds, ...x.p.supportEvidenceIds])) if (!plan.evidenceOwnership.some(o => o.evidenceId === id)) errors.push(`MISSING_OWNERSHIP:${id}`);
  if (d.evidenceReuseWarnings.length) errors.push("EXACT_EVIDENCE_OVERUSE");
  d.duplicateThemeWarnings = plan.themeBudget.filter(t => t.primaryUses.length > t.maxPrimaryUses || t.supportUses.length > t.maxSupportUses).map(t => t.theme);
  if (d.duplicateThemeWarnings.length) errors.push("THEME_OVERUSE");
  const prior = used.filter(x => x.s !== "C10" && x.c);
  const priorRoots = new Set(prior.flatMap(x => x.c!.underlyingEvidenceIds));
  for (const x of used.filter(x => x.s === "C10" && x.c)) {
    const c = x.c!;
    const antecedent = prior.some(y => c.precursorIds.includes(y.c!.sourceId) || c.precursorIds.some(id => [...y.c!.claimIds, ...y.c!.traitArcIds, ...y.c!.resonanceIds, ...y.c!.fusionIds].includes(id)) || y.c!.guidanceIds.some(id => c.guidanceIds.includes(id)));
    if (!antecedent || c.underlyingEvidenceIds.some(id => !priorRoots.has(id)) || x.p.primaryEvidenceIds.length || x.p.supportEvidenceIds.length) d.c10NewEvidenceViolations.push(c.id);
  }
  if (d.c10NewEvidenceViolations.length) errors.push("C10_NEW_EVIDENCE");
  const explainedIds = new Set(used.filter(x => x.p.role !== "RECALL").map(x => x.p.candidateId));
  const arcRoles = new Set<string>();
  for (const x of used.filter(x => x.p.role === "PRIMARY")) for (const a of x.p.arcRoles) {
    const key = `${a.traitArcId}:${a.role}`; if (arcRoles.has(key)) errors.push(`ARC_ROLE_REPEATED:${key}`); arcRoles.add(key);
  }
  for (const e of graph) if (["CONTRADICTORY", "TENSION_RESOLVED"].includes(e.kind) && explainedIds.has(e.left) && explainedIds.has(e.right)) d.unresolvedContradictions.push(`${e.left}|${e.right}`);
  const factBombs = plan.sections.C6?.factBombGroup ?? [];
  if (graph.some(e => e.kind === "SEMANTIC_DUPLICATE" && factBombs.includes(e.left) && factBombs.includes(e.right))) errors.push("REPEATED_FACT_BOMB_PROBLEM");
  if ((plan.sections.C6?.factBombGroup.length ?? 0) > 4) errors.push("FACT_BOMB_GROUP_LIMIT");
  if (d.unresolvedContradictions.length) errors.push("UNRESOLVED_CONTRADICTION_PLACED");
  const seen = new Set<string>(), noveltyFailures: S[] = [];
  for (const section of sections.filter(s => s.sectionId !== "C10")) {
    const themes = section.primaryCandidateIds.flatMap(id => byId.get(id)?.broadTheme ?? []);
    if (section.sectionId !== "C1" && themes.length && themes.every(t => seen.has(t))) noveltyFailures.push(section.sectionId);
    themes.forEach(t => seen.add(t));
  }
  if (noveltyFailures.length) errors.push("SECTION_NOVELTY_FAILURE");
  const termIds = plan.terminologyOwnership.map(t => t.termKey);
  d.terminologyDefinitionViolations = termIds.filter((id, n) => termIds.indexOf(id) !== n);
  if (d.terminologyDefinitionViolations.length) errors.push("TERM_DEFINED_TWICE");
  if (plan.terminologyOwnership.filter(t => t.definitionOwner).length > 14) warnings.push("HIGH_TERM_EXPOSURE");
  const explicit = used.filter(x => x.p.presentationIntent === "EXPLICIT").length;
  if (explicit > 7 || explicit !== plan.fusionBudget.explicitTotal) errors.push("EXPLICIT_MBTI_OVERUSE");
  for (const t of ["REINFORCE", "TENSION", "COMPLEMENT"] as const) if (plan.fusionBudget.explicit[t] > plan.fusionBudget.maxByType[t]) errors.push(`FUSION_BUDGET:${t}`);
  const early = plan.evidenceOwnership.filter(o => ["C1", "C2", "C3"].includes(o.primaryOwner)).length;
  const frontLoadingScore = plan.evidenceOwnership.length ? early / plan.evidenceOwnership.length : 0;
  if (frontLoadingScore > .4) warnings.push("FRONT_LOADING_ABOVE_TARGET");
  const domainBalance: Record<string, number> = {};
  for (const x of used.filter(x => x.p.role === "PRIMARY")) {
    const domain = ["C1", "C2", "C3"].includes(x.s) ? "identity" : ["C4", "C5"].includes(x.s) ? "strengthFortune" : x.s === "C7" ? "relationship" : x.s === "C8" ? "workMoney" : x.s === "C9" ? "recovery" : "shadow";
    domainBalance[domain] = (domainBalance[domain] ?? 0) + 1;
  }
  for (const [domain, count] of Object.entries(domainBalance)) { domainBalance[domain] = count / Math.max(1, d.assignedPrimaryCount); if (domainBalance[domain] > .6) warnings.push(`DOMAIN_IMBALANCE:${domain}`); }
  const positive = used.filter(x => x.p.role === "PRIMARY" && x.c && x.c.positiveValence > x.c.negativeValence).length;
  const negative = used.filter(x => x.p.role === "PRIMARY" && x.c && x.c.negativeValence > x.c.positiveValence).length;
  if (negative >= positive && negative) warnings.push("STRENGTH_SHOULD_EXCEED_SHADOW");
  if (input.guidance.context.workModes[0]?.mode === "GENERAL") warnings.push("GENERAL_WORK_CONTEXT");
  if (plan.sections.C5?.sectionKind === "POSITIVE_POTENTIAL") warnings.push("NO_VALID_FORTUNE_POTENTIAL_ONLY");
  if (plan.sections.C3?.sectionKind !== "TENSION") warnings.push("NO_RESOLVED_TENSION_FALLBACK");
  if (input.mbti.available && explicit < 4) warnings.push("EXPLICIT_MBTI_BELOW_TARGET_NO_PADDING");
  const emotionalValid = sections.length === 10 && sections.every(s => s.emotionalScore === contracts[s.sectionId]?.score && s.emotionalIntent.join("|") === contracts[s.sectionId]?.emotions.join("|"));
  if (!emotionalValid) errors.push("INVALID_EMOTIONAL_ARC");
  const sectionCount = (s: S) => plan.sections[s]?.primaryCandidateIds.length ?? 0;
  const q: ComprehensivePlanQualityAudit = { coreGyeolPresent: !!plan.sections.C1?.primaryCandidateIds.some(id => byId.get(id)?.sourceType === "CORE_GYEOL"), reinforceCoverage: sectionCount("C2"), tensionOrComplementCoverage: sectionCount("C3"), strengthCount: sectionCount("C4"), fortuneOrPotentialCount: sectionCount("C5"), factBombCount: plan.sections.C6?.factBombGroup.length ?? 0, relationCoverage: sectionCount("C7") > 0, workCoverage: !!plan.sections.C8?.questionSlots.WORK_STYLE?.length, moneyCoverage: !!plan.sections.C8?.questionSlots.MONEY_STYLE?.length, recoveryCoverage: !!plan.sections.C9?.placements.length, operatingRuleCount: sectionCount("C10"), unresolvedContradictions: d.unresolvedContradictions.length, semanticThemeOveruse: d.duplicateThemeWarnings, exactEvidenceOveruse: d.evidenceReuseWarnings, sectionNoveltyFailures: noveltyFailures, explicitMbtiCount: explicit, fusionCounts: plan.fusionBudget, frontLoadingScore, domainBalance, emotionalArcStatus: emotionalValid ? "VALID" : "INVALID", c10NewEvidenceViolations: d.c10NewEvidenceViolations.length, qualityWarnings: [] };
  d.warnings = editorialUnique([...warnings, ...sections.flatMap(s => s.diagnostics.warnings.map(w => `${s.sectionId}:${w}`))]);
  d.hardErrors = editorialUnique(errors); q.qualityWarnings = [...d.warnings];
  return { qualityAudit: q, diagnostics: d };
}
