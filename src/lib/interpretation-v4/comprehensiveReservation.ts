import { COMPREHENSIVE_SECTION_CONTRACTS, primarySectionEligible } from "./comprehensiveSectionContracts";
import { editorialOrder, editorialOverlap } from "./comprehensiveScoring";
import type { ComprehensiveSectionId as S, EditorialCandidate, EditorialReservation, SectionKind } from "./comprehensivePlanCore";

export function reserveComprehensiveMaterials(rows: readonly EditorialCandidate[], mbtiAvailable: boolean) {
  const reservations: EditorialReservation[] = [];
  const kinds = Object.fromEntries(Object.entries(COMPREHENSIVE_SECTION_CONTRACTS).map(([s, c]) => [s, c.kind])) as Record<S, SectionKind>;
  kinds.C2 = mbtiAvailable ? "REINFORCE" : "MYEONGLI_CONFIRMATION";
  kinds.C3 = rows.some(c => c.primaryEligible && c.fusionType === "TENSION" && c.conditionSplit?.resolved) ? "TENSION" : rows.some(c => c.primaryEligible && c.fusionType === "COMPLEMENT") ? "COMPLEMENT_SURPRISE" : "MYEONGLI_COMPLEXITY";
  kinds.C5 = rows.some(c => c.primaryEligible && c.fortune && (c.claimLevel ?? 0) >= 3) ? "GOOD_FORTUNE" : "POSITIVE_POTENTIAL";
  const themeOwners = new Map<string, S>();
  const pick = (s: S, count: number, stage: string, predicate: (c: EditorialCandidate) => boolean = () => true) => {
    const selected: EditorialCandidate[] = [];
    for (const c of rows.filter(c => primarySectionEligible(c, s, kinds[s]) && predicate(c)).sort(editorialOrder(s))) {
      if (selected.length >= count) break;
      if (themeOwners.has(c.broadTheme) && themeOwners.get(c.broadTheme) !== s) continue;
      if (reservations.some(r => r.stage !== "RESERVE_TRAIT_ARC" && r.sectionId === s && rows.find(x => x.id === r.candidateId)?.broadTheme === c.broadTheme)) continue;
      if (selected.some(a => a.broadTheme === c.broadTheme || editorialOverlap(a, c) >= .7 - 1e-9 || s === "C5" && a.fortuneFamilies.some(f => c.fortuneFamilies.includes(f)))) continue;
      selected.push(c); themeOwners.set(c.broadTheme, s); reservations.push({ stage, candidateId: c.id, sectionId: s, status: "PLANNED" });
    }
  };
  pick("C1", 1, "RESERVE_CORE");
  pick("C2", 1, "RESERVE_REINFORCE");
  pick("C3", 1, "RESERVE_TENSION_OR_COMPLEMENT");
  pick("C5", kinds.C5 === "GOOD_FORTUNE" ? 3 : 1, "RESERVE_FORTUNE", c => kinds.C5 === "GOOD_FORTUNE" || !c.contexts.includes("money") && !c.contexts.includes("recovery") && !c.internalComplexity);
  pick("C6", 2, "RESERVE_FACT_BOMB");
  // Role reservations do not spend evidence or turn an application into a
  // second strength. Allocation may release them with an explicit reason.
  for (const c of rows.filter(c => c.sourceType === "TRAIT_ARC" && c.primaryEligible).sort(editorialOrder("C4")).slice(0, 6)) {
    for (const [s, role] of (c.arcRole === "SHADOW" ? [["C6", "SHADOW"]] : [["C4", "STRENGTH"], [c.contexts.includes("recovery") ? "C9" : "C8", "APPLICATION"], ["C10", "GUIDANCE_RECALL"]]) as [S, NonNullable<EditorialReservation["role"]>][]) reservations.push({ stage: "RESERVE_TRAIT_ARC", candidateId: c.id, sectionId: s, role, status: "PLANNED" });
  }
  // Narrow domains cannot borrow generic identity material. Protect them before
  // selecting broad strengths, so a rich opening cannot starve work/recovery.
  pick("C9", 1, "RESERVE_RECOVERY", c => c.elementComposite || c.strongYinYang);
  if (!reservations.some(r => r.sectionId === "C9" && r.stage === "RESERVE_RECOVERY")) pick("C9", 1, "RESERVE_RECOVERY");
  pick("C8", 1, "RESERVE_MONEY", c => c.slots.includes("MONEY_STYLE"));
  pick("C7", 1, "RESERVE_RELATION", c => c.slots.includes("LOVE_STYLE") || c.slots.includes("CLOSE_RELATION_CHANGE"));
  if (!reservations.some(r => r.sectionId === "C7" && r.stage === "RESERVE_RELATION")) pick("C7", 1, "RESERVE_RELATION");
  pick("C8", 1, "RESERVE_WORK", c => c.slots.includes("WORK_STYLE") && !reservations.some(r => r.candidateId === c.id));
  pick("C4", 2, "RESERVE_RESONANCE");
  return { reservations, kinds };
}
