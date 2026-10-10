import { COMPREHENSIVE_SECTIONS, type ComprehensiveSectionId as S, type ComprehensiveSectionPlan, type ComprehensivePlanInputs, type EditorialCandidate as C, type EditorialConflictEdge, type EditorialReservation, type EditorialSuppression, type SectionKind, type CandidatePlacement, type SectionSlot } from "./comprehensivePlanCore";
import { COMPREHENSIVE_SECTION_CONTRACTS as contracts, primarySectionEligible, sectionFit } from "./comprehensiveSectionContracts";
import { editorialOrder, editorialScore } from "./comprehensiveScoring";
import { editorialUnique } from "./comprehensiveCandidateAdapter";
import type { RenderabilityExclusion } from "./comprehensiveRenderability";

export function emptyEditorialSections(kinds: Record<S, SectionKind>, input: ComprehensivePlanInputs): Record<S, ComprehensiveSectionPlan> {
  return Object.fromEntries(COMPREHENSIVE_SECTIONS.map((s): [S, ComprehensiveSectionPlan] => {
    const c = contracts[s];
    return [s, { sectionId: s, purpose: c.purpose, sectionKind: kinds[s], primaryCandidateIds: [], supportingCandidateIds: [], placements: [], evidenceIds: [], traitArcIds: [], fusionIds: [], claimIds: [], resonanceIds: [], guidanceIds: [], explicitMbtiCandidateIds: [], allowExplicitMbti: input.mbti.available && c.maxExplicit > 0, preferredExplicitMbti: input.mbti.available && ["C2", "C3"].includes(s), maxExplicitMbti: input.mbti.available ? c.maxExplicit : 0,
      semanticThemes: [], emotionalIntent: [...c.emotions], emotionalScore: c.score, depthIntent: c.depth, estimatedNarrativeUnits: 0, ...(c.bridge ? { bridgeIntent: c.bridge } : {}), thirdInterpretations: [], factBombGroup: [], questionSlots: {},
      preferredConcreteTerms: s === "C8" ? ["돈", "수입", "재물", "남는 돈", "명예", "높은 직책", "승진", "리더 자리", "인정", "사업", "전문성", "실력", "성과"] : [], avoidTerms: s === "C8" ? ["역할과 이름", "사회적 자리", "재정적 성취", "좋은 흐름"] : [], forbidFortuneVocabulary: s === "C5" && kinds.C5 === "POSITIVE_POTENTIAL", context: structuredClone(input.guidance.context), coreGyeolRecall: s === "C10", diagnostics: { warnings: [], newThemes: [], compact: false } } satisfies ComprehensiveSectionPlan];
  })) as Record<S, ComprehensiveSectionPlan>;
}

/** Allocation uses reservations for the whole book. C1's proof/details are
 * deliberately filled after C4/C7/C8/C9, not greedily at the opening. */
export function allocateComprehensiveMaterials(rows: readonly C[], input: ComprehensivePlanInputs, kinds: Record<S, SectionKind>, reservations: EditorialReservation[], graph: readonly EditorialConflictEdge[], exclusions: readonly RenderabilityExclusion[] = []) {
  const sections = emptyEditorialSections(kinds, input), suppressed: EditorialSuppression[] = [];
  const byId = new Map(rows.map(c => [c.id, c]));
  const core = rows.find(c => c.sourceType === "CORE_GYEOL");
  const coreTheme = core?.broadTheme;
  const assigned = () => COMPREHENSIVE_SECTIONS.flatMap(s => sections[s].placements.map(p => ({ s, p, c: byId.get(p.candidateId)! })));
  const primary = () => assigned().filter(x => x.p.role === "PRIMARY");
  const edgeIndex = new Map<string, EditorialConflictEdge[]>();
  for (const e of graph) { const key = [e.left, e.right].sort().join("\u0000"); edgeIndex.set(key, [...(edgeIndex.get(key) ?? []), e]); }
  const conflicts = (a: C, b: C) => edgeIndex.get([a.id, b.id].sort().join("\u0000")) ?? [];
  const block = (c: C, s: S, reason: string) => { suppressed.push({ candidateId: c.id, sectionId: s, reason }); return false; };

  function place(c: C, s: S, role: CandidatePlacement["role"] = "PRIMARY", slot?: SectionSlot): boolean {
    const section = sections[s], used = assigned(), primaries = primary();
    const unavailable = exclusions.find(e => e.section === s && e.candidateId === c.id);
    if (unavailable) return block(c, s, `RENDERABILITY:${unavailable.reason}`);
    if (section.placements.some(p => p.candidateId === c.id)) return false;
    if (!sectionFit(c, s)) return false;
    if (s === "C6" && c.factBomb && used.some(x => x.s === s && x.c.factBomb && conflicts(c, x.c).some(e => e.kind === "SEMANTIC_DUPLICATE"))) return block(c, s, "SAME_FACT_BOMB_PROBLEM");
    if (role === "PRIMARY") {
      if (section.primaryCandidateIds.length >= contracts[s].maxPrimary || !primarySectionEligible(c, s, section.sectionKind)) return false;
      if (reservations.some(r => r.stage !== "RESERVE_TRAIT_ARC" && r.sectionId !== s && r.sectionId !== "C1" && byId.get(r.candidateId)?.broadTheme === c.broadTheme)) return block(c, s, "THEME_RESERVED_FOR_OTHER_SECTION");
      if (primaries.some(x => x.c.id === c.id)) return block(c, s, "EXACT_CANDIDATE_PRIMARY_ONCE");
      const themeUse = primaries.filter(x => x.c.broadTheme === c.broadTheme);
      if (themeUse.length >= (c.broadTheme === coreTheme ? 2 : 1)) return block(c, s, "THEME_PRIMARY_BUDGET");
      if (themeUse.some(x => x.s === s)) return block(c, s, "SAME_SECTION_THEME");
      for (const x of primaries) {
        const edges = conflicts(c, x.c);
        if (edges.some(e => ["CONTRADICTORY", "TENSION_RESOLVED", "FORTUNE_OVERLAP"].includes(e.kind))) return block(c, s, "CONFLICT_OR_FORTUNE_OVERLAP");
        if (edges.some(e => e.kind === "SEMANTIC_DUPLICATE") && !(c.broadTheme === coreTheme && x.s !== s && c.sourceType !== x.c.sourceType && (c.sourceType === "CORE_GYEOL" || x.c.sourceType === "CORE_GYEOL"))) return block(c, s, "SEMANTIC_DUPLICATE_PRIMARY");
        const arcRole = s === "C1" ? "INTRO" : s === "C6" ? "SHADOW" : s === "C4" ? "STRENGTH" : "APPLICATION";
        if (x.p.arcRoles.some(a => c.traitArcIds.includes(a.traitArcId) && a.role === arcRole)) return block(c, s, "ARC_ROLE_PRIMARY_ONCE");
      }
      // A reserved conditional interpretation owns the interaction; do not
      // repeat both atomic sides elsewhere as unconditional statements.
      if (graph.some(e => e.kind === "TENSION_RESOLVED" && (e.left === c.id || e.right === c.id) && e.resolvedBy.some(id => primaries.some(p => p.c.id === id)))) {
        if (!(s === "C6" && c.factBomb)) return block(c, s, "CONDITIONAL_STORY_OWNS_SIDES");
      }
    } else if (role === "SUPPORT") {
      // The renderer suppresses this identity restatement. Reject it before it
      // spends the shared support budget, so a separately proven shadow or
      // application can still be allocated later in the book.
      if (s === "C1" && core && c.sourceType === "PERSONAL_RESONANCE" && core.resonanceIds.includes(c.sourceId)
        && c.broadTheme === core.broadTheme && c.primaryAxes.every(a => core.primaryAxes.includes(a))) return block(c, s, "CORE_IDENTITY_ALREADY_INTRODUCED");
      if (section.supportingCandidateIds.length >= contracts[s].maxSupport) return false;
      if (used.some(x => x.p.role === "SUPPORT" && x.c.broadTheme === c.broadTheme)) return block(c, s, "THEME_SUPPORT_BUDGET");
      const linkedAdvice = c.sourceType === "GUIDANCE" && used.some(x => x.s === s && c.precursorIds.some(id => [x.c.sourceId, ...x.c.claimIds, ...x.c.resonanceIds, ...x.c.traitArcIds, ...x.c.fusionIds].includes(id)));
      if (used.some(x => x.s === s && x.c.broadTheme === c.broadTheme) && !linkedAdvice && !(s === "C1" && c.sourceType === "PERSONAL_RESONANCE" && core?.resonanceIds.includes(c.sourceId) && c.sourceText !== core.sourceText)) return block(c, s, "SUPPORT_ADDS_NO_NEW_VALUE");
      if (used.filter(x => conflicts(c, x.c).some(e => e.kind === "SEMANTIC_DUPLICATE")).length >= 2) return block(c, s, "DUPLICATE_THIRD_USE");
      if (used.some(x => conflicts(c, x.c).some(e => e.kind === "CONTRADICTORY" || e.kind === "TENSION_RESOLVED"))) return block(c, s, "CONTRADICTORY_SUPPORT");
    }
    const antecedents = used.filter(x => x.s !== "C10" && (c.precursorIds.includes(x.c.sourceId) || c.precursorIds.some(id => [...x.c.claimIds, ...x.c.resonanceIds, ...x.c.traitArcIds, ...x.c.fusionIds].includes(id))));
    if (role === "RECALL") {
      const priorProof = new Set(used.filter(x => x.s !== "C10").flatMap(x => x.c.underlyingEvidenceIds));
      const problemIntroduced = antecedents.length || used.some(x => x.c.guidanceIds.some(id => c.guidanceIds.includes(id)));
      if (!problemIntroduced || c.underlyingEvidenceIds.some(id => !priorProof.has(id))) return block(c, s, "C10_NEW_EVIDENCE_OR_UNINTRODUCED_PROBLEM");
      if (section.primaryCandidateIds.length >= 5 || section.placements.some(p => p.slots.includes(c.operatingRuleType!))) return block(c, s, "OPERATING_SLOT_BUDGET");
      if (section.placements.some(p => { const other = byId.get(p.candidateId)!; return other.broadTheme === c.broadTheme || conflicts(c, other).some(e => e.kind === "GUIDANCE_OVERLAP"); })) return block(c, s, "OPERATING_ADVICE_DUPLICATE");
    }
    const context = contracts[s].contexts.find(ctx => c.contexts.includes(ctx)) ?? c.contexts[0] ?? "identity";
    const roleForArc = s === "C1" ? "INTRO" : s === "C6" ? "SHADOW" : s === "C10" ? "GUIDANCE_RECALL" : s === "C4" ? "STRENGTH" : "APPLICATION";
    const p: CandidatePlacement = { candidateId: c.id, role, context, provenanceEvidenceIds: [...c.underlyingEvidenceIds], primaryEvidenceIds: [], supportEvidenceIds: [], provenanceOnlyEvidenceIds: [], presentationIntent: "HIDDEN",
      arcRoles: c.traitArcIds.map(traitArcId => ({ traitArcId, role: roleForArc })), slots: slot ? editorialUnique([slot, ...c.slots.filter(x => contracts[s].slots.includes(x))]) : c.slots.filter(x => contracts[s].slots.includes(x)),
      preferredAdvice: c.sourceType === "GUIDANCE", antecedentCandidateIds: editorialUnique(antecedents.map(x => x.c.id)),
      reuseIntent: role === "RECALL" ? "OPERATING_RULE_RECALL" : role === "SUPPORT" ? c.fortune ? "RESULT_ONLY" : "DIFFERENT_APPLICATION" : "FIRST_MEANING",
      ...(c.sourceType === "GUIDANCE" ? { guidanceRenderIntent: role === "RECALL" ? "OPERATING_RULE_RECALL" as const : s === "C9" ? "FULL_GUIDANCE" as const : "SHORT_GUIDANCE" as const } : {}) };
    section.placements.push(p);
    (role === "SUPPORT" ? section.supportingCandidateIds : section.primaryCandidateIds).push(c.id);
    return true;
  }
  const ranked = (s: S) => rows.slice().sort((a, b) => {
    const reserved = (c: C) => reservations.some(r => r.sectionId === s && r.candidateId === c.id && r.stage !== "RESERVE_TRAIT_ARC") ? 1 : 0;
    return reserved(b) - reserved(a) || editorialScore(b, s, primary().filter(x => x.c.broadTheme === b.broadTheme).length) - editorialScore(a, s, primary().filter(x => x.c.broadTheme === a.broadTheme).length) || editorialOrder(s)(a, b);
  });
  function fill(s: S) {
    for (const r of reservations.filter(r => r.sectionId === s && r.stage !== "RESERVE_TRAIT_ARC")) {
      const c = byId.get(r.candidateId); if (c) place(c, s);
    }
    const slots = contracts[s].slots;
    // Fill distinct question slots first, then the remaining diverse candidates.
    for (const slot of slots) {
      if (sections[s].placements.some(p => p.slots.includes(slot))) continue;
      for (const c of ranked(s).filter(c => c.slots.includes(slot))) if (place(c, s, "PRIMARY", slot)) break;
    }
    for (const c of ranked(s)) place(c, s);
  }
  // Reserve identities without exposing their source proof at this stage.
  if (core) place(core, "C1");
  if (!core) fill("C1");
  for (const s of ["C2", "C3", "C5", "C6"] as const) {
    for (const r of reservations.filter(r => r.sectionId === s && r.stage !== "RESERVE_TRAIT_ARC")) { const c = byId.get(r.candidateId); if (c) place(c, s); }
    fill(s);
  }
  for (const s of ["C4", "C7", "C8", "C9"] as const) fill(s);
  if (core) for (const c of ranked("C1").filter(c => c.resonanceIds.some(id => core.resonanceIds.includes(id)) && c.sourceType === "PERSONAL_RESONANCE" && !c.fortune && !c.factBomb)) place(c, "C1", "SUPPORT");

  // A narrow later question may legitimately apply an already-owned theme.
  // Preserve a real money/recovery application as support rather than leaving
  // the question empty or falsely counting it as a new primary theme.
  for (const s of ["C8", "C9"] as const) {
    const relevant = (c: C) => s === "C8" ? c.slots.includes("MONEY_STYLE") : c.elementComposite || c.strongYinYang || c.primaryAxes.includes("RECOVERY_NEED") || c.sourceType === "GUIDANCE" && c.operatingRuleType === "RECOVERY";
    if (sections[s].placements.some(p => relevant(byId.get(p.candidateId)!))) continue;
    for (const c of ranked(s).filter(c => c.primaryEligible && !c.factBomb && relevant(c) && primary().some(x => x.s !== s && x.c.broadTheme === c.broadTheme) && (c.sourceType !== "GUIDANCE" || s === "C9" && assigned().some(x => x.s !== "C9" && c.precursorIds.some(id => [x.c.sourceId, ...x.c.claimIds, ...x.c.resonanceIds, ...x.c.traitArcIds, ...x.c.fusionIds].includes(id)))))) {
      if (place(c, s, "SUPPORT")) break;
    }
  }

  // A strength already owned elsewhere may have a separately proven shadow.
  // Narrow work/recovery applications get their support slot first; optional
  // extra shadows cannot consume the only later application of that theme.
  for (const c of ranked("C6").filter(c => c.factBomb && c.primaryEligible && !primary().some(x => x.c.id === c.id) && primary().some(x => x.s !== "C6" && x.c.broadTheme === c.broadTheme))) {
    if (sections.C6.primaryCandidateIds.length + sections.C6.supportingCandidateIds.length >= 4) break;
    place(c, "C6", "SUPPORT");
  }

  // Result-only fortune recalls and arc applications require different context,
  // and never consume a second primary theme or repeat a term definition.
  for (const s of ["C7", "C8", "C9"] as const) {
    for (const c of ranked(s).filter(c => c.sourceType !== "GUIDANCE" && c.contexts.some(ctx => contracts[s].contexts.includes(ctx)) && (s !== "C9" || c.elementComposite || c.strongYinYang || c.primaryAxes.includes("RECOVERY_NEED")) && (!c.fortune || s === "C7" && c.claimCategory === "PEOPLE_LUCK" || s === "C8" && ["MONEY_FORTUNE", "HONOR", "HIGH_POSITION", "SUCCESS"].includes(c.claimCategory ?? "")) && primary().some(x => x.s !== s && x.c.id === c.id && x.p.context !== (contracts[s].contexts.find(ctx => c.contexts.includes(ctx)) ?? c.contexts[0])))) place(c, s, "SUPPORT");
  }
  // A failed or already-starved relation application gets an independently
  // grounded source even when its primary theme is owned by another chapter.
  // Keep all existing support/theme/conflict limits; do not promote weak proof.
  for (const s of ["C7", "C8", "C9"] as const) if ((s === "C7" || exclusions.some(e => e.section === s)) && !sections[s].placements.length) {
    for (const c of ranked(s).filter(c => c.primaryEligible && !c.factBomb && !c.fortune && c.sourceType !== "GUIDANCE"
      && (s !== "C9" || c.primaryAxes.includes("RECOVERY_NEED")))) {
      if (place(c, s, "SUPPORT")) break;
    }
  }
  // Optional advice belongs only beside an already introduced problem/trait.
  for (const s of ["C6", "C7", "C8", "C9"] as const) {
    const limit = s === "C6" || s === "C9" ? 2 : 1;
    for (const c of ranked(s).filter(c => c.sourceType === "GUIDANCE")) {
      if (sections[s].placements.filter(p => p.preferredAdvice).length >= limit) break;
      const local = sections[s].placements.map(p => byId.get(p.candidateId)!);
      if (local.some(x => c.precursorIds.includes(x.sourceId) || c.precursorIds.some(id => [...x.claimIds, ...x.resonanceIds, ...x.traitArcIds, ...x.fusionIds].includes(id)))) place(c, s, "SUPPORT");
    }
  }
  // Reading-order novelty, not allocation-order novelty. A re-used core theme
  // alone is compacted to support; it cannot masquerade as a new section.
  const seen = new Set<string>();
  for (const s of COMPREHENSIVE_SECTIONS.filter(s => s !== "C10")) {
    const section = sections[s], selected = section.primaryCandidateIds.map(id => byId.get(id)!);
    const fresh = selected.filter(c => !seen.has(c.broadTheme));
    if (s !== "C1" && selected.length && !fresh.length) {
      for (const c of selected) {
        section.placements = section.placements.filter(p => p.candidateId !== c.id); section.primaryCandidateIds = section.primaryCandidateIds.filter(id => id !== c.id);
        suppressed.push({ candidateId: c.id, sectionId: s, reason: "NOVELTY_COMPACTED" });
      }
      section.diagnostics.warnings.push("NO_NEW_THEME_COMPACTED"); section.diagnostics.compact = true;
      // Replan using unused themes after releasing the reused primaries.
      for (const c of ranked(s).filter(c => !seen.has(c.broadTheme))) place(c, s);
    }
    section.diagnostics.newThemes = editorialUnique(section.primaryCandidateIds.map(id => byId.get(id)!.broadTheme).filter(t => !seen.has(t)));
    section.primaryCandidateIds.forEach(id => seen.add(byId.get(id)!.broadTheme));
  }
  for (const c of rows.filter(c => c.sourceType === "GUIDANCE").sort((a, b) => Number(b.guidanceMerged) - Number(a.guidanceMerged) || editorialOrder("C10")(a, b))) place(c, "C10", "RECALL", c.operatingRuleType);
  for (const r of reservations) {
    r.status = sections[r.sectionId].placements.some(p => p.candidateId === r.candidateId || r.role === "GUIDANCE_RECALL" && p.arcRoles.some(a => byId.get(r.candidateId)?.traitArcIds.includes(a.traitArcId))) ? "FULFILLED" : "RELEASED";
    if (r.status === "RELEASED") r.reason = suppressed.find(x => x.candidateId === r.candidateId && x.sectionId === r.sectionId)?.reason ?? "BETTER_SECTION_FIT_OR_ROLE_RECALL_NOT_AVAILABLE";
  }
  return { sections, suppressed };
}
