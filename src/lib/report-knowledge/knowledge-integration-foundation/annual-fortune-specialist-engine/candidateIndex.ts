import { hash, canonicalJson } from "../sourceReader";
import { isRecord } from "../normalization";
import type { ProductSpecialistFoundation } from "../product-specialist-foundation/binderIntegration";
import type { AnnualCandidate, ResearchKind } from "./types";
const kinds: Record<string, ResearchKind> = { annualCoreResearch: "ANNUAL_CORE", annualTenGodResearch: "ANNUAL_TEN_GOD", monthlyTenGodResearch: "MONTHLY_TEN_GOD", monthlyElementResearch: "MONTHLY_ELEMENT", monthMatrix: "MONTH_QUESTION", timeBoundaryResearch: "TIME_BOUNDARY", interactionResearch: "TEMPORAL_RELATION_SCOPE", relationPracticeResearch: "RELATION_APPLICATION", domainResearch: "LIFE_DOMAIN_APPLICATION", informationResearch: "CROSS_MONTH_INFORMATION", yearMonthConnectionResearch: "YEAR_MONTH_CONNECTION", observedApplicationResearch: "OBSERVED_CASE_RESEARCH" };
export class AnnualSpecialistIndex {
  readonly candidates = new Map<string, AnnualCandidate>();
  readonly byKind = new Map<ResearchKind, AnnualCandidate[]>();
  readonly byOriginalId = new Map<string, AnnualCandidate>();
  readonly registry;
  constructor(readonly foundation: ProductSpecialistFoundation) {
    this.registry = [...foundation.catalog.candidates.values()].filter(c => c.record.family === "annual-fortune-product-research");
    for (const c of foundation.catalog.search("annual_fortune", null)) {
      const raw = foundation.catalog.raw.get(c.record.catalogKey), name = c.record.locator.file.split("/").at(-1)!.replace(/\.ts$/, ""), kind = kinds[name];
      if (!kind || !isRecord(raw) || raw.productKey !== "annual_fortune" || raw.approvedForCustomer !== false || raw.connectedToRuntime !== false) throw Error("ORIGINAL_ANNUAL_RESEARCH_REQUIRED");
      const original = foundation.overlays.get(c.record.catalogKey)!.candidate, candidate = structuredClone(original);
      // Retain every native condition, including declarations the old adapter
      // did not ingest. Natural language never becomes an inferred predicate.
      for (const field of ["requires", "monthlyGate", "annualGate", "natalRequired", "elementRequired", "requiredFacts", "participants", "counterexample", "disallowed", "sourceObservation", "requiredRole", "scope", "window", "condition"]) if (raw[field] !== undefined && !candidate.requirement.unresolvedConditions.some(r => r.field === "/" + field)) candidate.requirement.unresolvedConditions.push({ field: "/" + field, original: raw[field] });
      if (candidate.requirement.unresolvedConditions.length) candidate.requirement.applicabilityState = candidate.requirement.sourceRequirements.some(s => s.selector) ? "PARTIALLY_CHECKABLE" : "CONTRACT_NOT_MACHINE_CHECKABLE";
      const row: AnnualCandidate = { catalogKey: c.record.catalogKey, originalResearchId: c.record.originalId, researchKind: kind, original: raw, candidate, originalRequirementHash: hash(canonicalJson(original.requirement)), bindingRequirementHash: hash(canonicalJson(candidate.requirement)), customerApproved: false };
      this.candidates.set(row.catalogKey, row); this.byOriginalId.set(row.originalResearchId, row); this.byKind.set(kind, [...(this.byKind.get(kind) ?? []), row]);
    }
  }
}
