import { COMPREHENSIVE_SECTIONS, type ComprehensivePlanInputs, type ComprehensiveSectionPlan, type ComprehensiveSectionId as S, type EditorialCandidate as C, type EvidenceOwnership, type TerminologyOwnership, type SemanticThemeBudget, type FusionBudget } from "./comprehensivePlanCore";
import { COMPREHENSIVE_SECTION_CONTRACTS as contracts } from "./comprehensiveSectionContracts";
import { editorialUnique } from "./comprehensiveCandidateAdapter";

/** Own the *explanation* of an exact source, not the underlying truth. Complete
 * proof remains on candidates/placements even when only its result is recalled.
 * Source chains (claim -> resonance -> arc) never become new evidence IDs. */
export function assignEditorialOwnership(sections: Record<S, ComprehensiveSectionPlan>, rows: readonly C[], input: ComprehensivePlanInputs) {
  const byId = new Map(rows.map(c => [c.id, c]));
  const atoms = new Map(input.myeongli.evidence.map(e => [e.id, e]));
  const coreIds = new Set(rows.find(c => c.sourceType === "CORE_GYEOL")?.underlyingEvidenceIds ?? []);
  const owned = new Map<string, EvidenceOwnership>();
  const ownerPriority: S[] = ["C2", "C3", "C5", "C6", "C4", "C7", "C8", "C9", "C1"];
  // C1 gets a small identity anchor, not every dependency of CoreGyeol. The
  // remaining strong sources belong to their detailed reserved sections.
  const core = sections.C1.placements.find(p => p.role === "PRIMARY");
  if (core) {
    const identity = core.provenanceEvidenceIds.filter(id => atoms.has(id)).sort((a, b) => {
      const prefer = (id: string) => ["yin_yang", "element", "heavenly_stem", "earthly_branch"].includes(atoms.get(id)!.sourceType) ? 1 : 0;
      return prefer(b) - prefer(a) || a.localeCompare(b);
    })[0];
    if (identity) { core.primaryEvidenceIds.push(identity); owned.set(identity, { evidenceId: identity, primaryOwner: "C1", supportAllowed: [], maxPrimaryUses: 1, maxSupportUses: 2, currentPrimaryUses: 1, currentSupportUses: 0 }); }
  }
  for (const s of ownerPriority) for (const p of sections[s].placements.filter(p => p.role === "PRIMARY")) {
    const c = byId.get(p.candidateId)!;
    const newRoots = c.underlyingEvidenceIds.filter(id => !owned.has(id)).sort((a, b) => {
      const quality = (id: string) => { const e = atoms.get(id); return e ? (e.tier === "CORE" ? 4 : e.tier === "SUPPORT" ? 3 : 1) + (e.strength === "STRONG" ? 1 : 0) : 2; };
      return quality(b) - quality(a) || a.localeCompare(b);
    });
    const selectedFamilies = new Set(p.primaryEvidenceIds.map(id => atoms.get(id)?.family ?? id));
    for (const id of newRoots) {
      if (p.primaryEvidenceIds.length >= 2) break;
      const family = atoms.get(id)?.family ?? id;
      if (selectedFamilies.has(family)) continue;
      selectedFamilies.add(family); p.primaryEvidenceIds.push(id);
      owned.set(id, { evidenceId: id, primaryOwner: s, supportAllowed: [], maxPrimaryUses: 1, maxSupportUses: coreIds.has(id) ? 2 : 1, currentPrimaryUses: 1, currentSupportUses: 0 });
    }
  }
  for (const s of COMPREHENSIVE_SECTIONS.filter(s => s !== "C10")) for (const p of sections[s].placements) {
    for (const id of p.provenanceEvidenceIds) {
      const o = owned.get(id);
      if (!o || o.primaryOwner === s || p.primaryEvidenceIds.includes(id) || p.supportEvidenceIds.length >= 1) continue;
      if (o.currentSupportUses >= o.maxSupportUses || o.supportAllowed.includes(s)) continue;
      p.supportEvidenceIds.push(id); o.supportAllowed.push(s); o.currentSupportUses++;
    }
    p.provenanceOnlyEvidenceIds = p.provenanceEvidenceIds.filter(id => !p.primaryEvidenceIds.includes(id) && !p.supportEvidenceIds.includes(id));
  }
  // Manual recalls results/strategies, never another technical definition.
  for (const p of sections.C10.placements) p.provenanceOnlyEvidenceIds = [...p.provenanceEvidenceIds];
  const terminology = new Map<string, TerminologyOwnership>();
  for (const s of COMPREHENSIVE_SECTIONS) for (const p of sections[s].placements) for (const id of p.primaryEvidenceIds) {
    const atom = atoms.get(id); if (!atom) continue;
    const termKey = `${atom.sourceType}:${atom.sourceKey}`;
    const entry = terminology.get(termKey);
    if (entry) entry.evidenceIds = editorialUnique([...entry.evidenceIds, id]);
    else terminology.set(termKey, { termKey, evidenceIds: [id], ...(terminology.size < 14 ? { definitionOwner: s } : {}), maxDefinitions: 1, recallAllowed: true });
  }
  return { evidenceOwnership: [...owned.values()].sort((a, b) => a.evidenceId.localeCompare(b.evidenceId)), terminologyOwnership: [...terminology.values()] };
}

export function finalizeEditorialSections(sections: Record<S, ComprehensiveSectionPlan>, rows: readonly C[], mbtiAvailable: boolean) {
  const byId = new Map(rows.map(c => [c.id, c]));
  const budget: FusionBudget = { explicit: { REINFORCE: 0, TENSION: 0, COMPLEMENT: 0 }, hidden: { REINFORCE: 0, TENSION: 0, COMPLEMENT: 0 }, explicitTotal: 0, maxExplicitTotal: 7, maxByType: { REINFORCE: 3, TENSION: 2, COMPLEMENT: 3 } };
  const explicitIds = new Set<string>();
  for (const s of ["C2", "C3", "C7", "C8", "C9", "C1"] as const) for (const p of sections[s].placements) {
    const c = byId.get(p.candidateId)!;
    if (!mbtiAvailable || !c.fusionType || !c.mbtiSourceNodeIds.length || p.role !== "PRIMARY" || explicitIds.has(c.sourceId)) continue;
    if (sections[s].explicitMbtiCandidateIds.length >= sections[s].maxExplicitMbti || budget.explicitTotal >= 7 || budget.explicit[c.fusionType] >= budget.maxByType[c.fusionType]) continue;
    sections[s].explicitMbtiCandidateIds.push(c.id); p.presentationIntent = "EXPLICIT"; explicitIds.add(c.sourceId); budget.explicit[c.fusionType]++; budget.explicitTotal++;
  }
  for (const s of COMPREHENSIVE_SECTIONS) {
    const section = sections[s], candidates = section.placements.map(p => byId.get(p.candidateId)!);
    section.semanticThemes = editorialUnique(candidates.map(c => c.broadTheme));
    section.evidenceIds = editorialUnique(section.placements.flatMap(p => [...p.primaryEvidenceIds, ...p.supportEvidenceIds]));
    for (const key of ["traitArcIds", "fusionIds", "claimIds", "resonanceIds", "guidanceIds"] as const) section[key] = editorialUnique(candidates.flatMap(c => c[key]));
    for (const p of section.placements) {
      const c = byId.get(p.candidateId)!;
      if (c.fusionType && p.presentationIntent === "HIDDEN") budget.hidden[c.fusionType]++;
      for (const slot of p.slots) section.questionSlots[slot] = editorialUnique([...(section.questionSlots[slot] ?? []), c.id]);
      if (s === "C3" && c.conditionSplit?.resolved && c.thirdInterpretationSource) section.thirdInterpretations.push({ candidateId: c.id, sideA: c.conditionSplit.sides?.myeongli ?? "MYEONGLI_SIDE", sideB: c.conditionSplit.sides?.mbti ?? "MBTI_SIDE", conditionSplit: structuredClone(c.conditionSplit), thirdInterpretationSource: c.thirdInterpretationSource });
    }
    if (s === "C6") section.factBombGroup = section.placements.filter(p => byId.get(p.candidateId)!.factBomb).map(p => p.candidateId);
    if (s === "C5" && candidates.some(c => c.fortune && c.claimLevel === 4 && c.independentFamilies.length > 1)) section.depthIntent = "DEEP";
    const count = section.primaryCandidateIds.length;
    section.estimatedNarrativeUnits = count ? Math.min(contracts[s].units[1], Math.max(contracts[s].units[0], s === "C6" ? Math.ceil(count / 2) : count)) : section.supportingCandidateIds.length ? 1 : 0;
    if (s === "C10") section.estimatedNarrativeUnits = count;
    if (count < contracts[s].target[0]) { section.diagnostics.compact = true; section.diagnostics.warnings.push("EVIDENCE_LIMITED_NO_PADDING"); }
  }
  return budget;
}

export function buildEditorialThemeBudget(sections: Record<S, ComprehensiveSectionPlan>, rows: readonly C[]): SemanticThemeBudget[] {
  const byId = new Map(rows.map(c => [c.id, c])), coreTheme = rows.find(c => c.sourceType === "CORE_GYEOL")?.broadTheme;
  const themes = new Map<string, SemanticThemeBudget>();
  for (const s of COMPREHENSIVE_SECTIONS) for (const p of sections[s].placements) {
    const c = byId.get(p.candidateId)!, theme = c.broadTheme;
    if (!themes.has(theme)) themes.set(theme, { theme, core: theme === coreTheme, maxPrimaryUses: theme === coreTheme ? 2 : 1, maxSupportUses: 1, primaryUses: [], supportUses: [], recallUses: [] });
    themes.get(theme)![p.role === "RECALL" ? "recallUses" : p.role === "SUPPORT" ? "supportUses" : "primaryUses"].push(s);
  }
  return [...themes.values()].sort((a, b) => a.theme.localeCompare(b.theme));
}
