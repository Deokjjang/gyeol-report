import type { ProductSpecialistFoundation } from "../product-specialist-foundation/binderIntegration";
import { canonicalJson, hash } from "../sourceReader";
import { isRecord } from "../normalization";
import type { MajorCandidate, ResearchKind } from "./types";
import { adaptMajorRequirements } from "./requirementAdapter";
const kinds: Readonly<Record<string, ResearchKind>> = { cycleResearch: "CYCLE_STRUCTURE", tenGodResearch: "TEN_GOD_LONG_TERM", cycleDevelopmentResearch: "CYCLE_DEVELOPMENT", phaseResearch: "EDITORIAL_PHASE", transitionResearch: "TRANSITION_POLICY", interactionResearch: "TEMPORAL_INTERACTION", yearMatrix: "YEAR_SLOT_QUESTION", comparisonResearch: "YEAR_COMPARISON", domainResearch: "LIFE_DOMAIN_APPLICATION", observedPeriodResearch: "OBSERVED_FIXTURE_RESEARCH" };
export class MajorSpecialistIndex {
  readonly candidates = new Map<string, MajorCandidate>();
  readonly byKind = new Map<ResearchKind, string[]>();
  readonly byOriginalId = new Map<string, string>();
  readonly registry;
  readonly applicableCandidates;
  constructor(readonly foundation: ProductSpecialistFoundation) {
    this.registry = [...foundation.catalog.candidates.values()].filter(c => c.record.family === "major-fortune-product-research");
    this.applicableCandidates = foundation.catalog.search("major_fortune", null);
    for (const c of this.applicableCandidates) {
      const name = c.record.locator.file.split("/").at(-1)!.replace(/\.ts$/, ""), researchKind = kinds[name];
      const raw = foundation.catalog.raw.get(c.record.catalogKey);
      if (!researchKind || !isRecord(raw) || raw.productKey !== "major_fortune" || raw.approvedForCustomer !== false || raw.connectedToRuntime !== false) throw Error("ORIGINAL_MAJOR_RESEARCH_SHAPE_REQUIRED");
      const native = foundation.overlays.get(c.record.catalogKey)!.candidate, original = adaptMajorRequirements(native, raw);
      // The original Binder already has an explicit dayun/god selector. Natural
      // language prerequisites absent from its normalizer are retained here and
      // block applicability; no inferred predicates or documentary AND groups.
      const sourceRoles: MajorCandidate["sourceRoles"] = Object.entries(raw).filter(([field]) => ["sourceRefs", "requires", "natalRequired", "elementRequired", "requiredFacts", "formation", "counterconditions", "sourceObservation", "inheritedRole", "sourceVersion", "window"].includes(field)).map(([field, value]) => ({ field, value, role: field === "sourceRefs" || field === "inheritedRole" || field === "sourceVersion" ? "SOURCE_REFERENCE" : field === "sourceObservation" ? "COMPARISON_SOURCE" : "ACTUAL_REQUIRED_EVIDENCE", machineCheckable: false }));
      const row: MajorCandidate = { catalogKey: c.record.catalogKey, originalResearchId: c.record.originalId, researchKind, original: raw, locator: c.record.locator, bindingCandidate: original, originalRequirementHash: hash(canonicalJson(native.requirement)), bindingRequirementHash: hash(canonicalJson(original.requirement)), sourceRoles, customerApproved: false };
      this.candidates.set(row.catalogKey, row);
      this.byOriginalId.set(row.originalResearchId, row.catalogKey);
      this.byKind.set(researchKind, [...(this.byKind.get(researchKind) ?? []), row.catalogKey]);
    }
  }
}
