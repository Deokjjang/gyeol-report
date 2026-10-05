import { buildCanonicalNatalTable, type CanonicalNatalTableEvidence } from "../report-knowledge/natalTableEvidence";
import type { SajuCalcResult, FiveElement } from "../saju/types";
import { structureContext } from "./strength";
import { aggregateSemanticEvidence, type EvidenceAtom, type SupplementSemanticDefinition } from "./semanticCore";
import { RELATION_SEMANTICS, RELATIONS_WITHOUT_NATAL_PRODUCER, type FoundationRelation } from "./foundationRelations";
import { TWELVE_STAGE_SEMANTICS, type FoundationTwelveStage } from "./foundationTwelveStages";
import { SHINSAL_SEMANTICS, foundationMarkerKey, type FoundationMarker } from "./foundationShinsal";
import { applyFamilyDiminishingReturns, summarizeSupplementFamilies } from "./foundationShinsalFamilies";

export const SUPPLEMENT_FOUNDATION_VERSION = "semantic-supplement-13d-1c-v1" as const;
type CanonicalFact = {
  canonicalId: string;
  scope: "natal" | "transit" | "pair";
  certainty: "confirmed" | "conditional";
  provenance: readonly string[];
  involvedPillars: readonly string[];
  involvedCharacters: readonly string[];
  involvedSlots: readonly ("stem" | "branch")[];
};
export type NormalizedRelationFact = CanonicalFact & {
  relationType: FoundationRelation;
  canonicalFormationState: "present" | "formed" | "partial" | "unconfirmed" | "absent";
  targetElement?: FiveElement;
};
export type NormalizedStageFact = CanonicalFact & { stage: FoundationTwelveStage };
export type NormalizedMarkerFact = CanonicalFact & { featureId: string; basis: string };
export type FoundationSupplementInput = {
  relations: readonly NormalizedRelationFact[];
  stages: readonly NormalizedStageFact[];
  markers: readonly NormalizedMarkerFact[];
};
const lexical = (a: string, b: string) => a < b ? -1 : a > b ? 1 : 0;
const unique = (values: readonly string[]) => [...new Set(values)].sort();
const hasProof = (f: CanonicalFact) => f.scope === "natal" && f.certainty === "confirmed" && Boolean(f.canonicalId) && f.provenance.length > 0;

// Repeated references may add provenance, not a second contribution. Conflicting
// facts with one canonical identity remain unavailable instead of winning by order.
function distinctFacts<T extends CanonicalFact>(facts: readonly T[], semanticKey: (f: T) => string,
  reject: (f: CanonicalFact, reason: string) => void): T[] {
  const groups = new Map<string, T[]>();
  for (const fact of facts) {
    const group = groups.get(fact.canonicalId) ?? []; group.push(fact); groups.set(fact.canonicalId, group);
  }
  return [...groups.keys()].sort().flatMap(id => {
    const group = groups.get(id)!;
    const signature = (f: T) => JSON.stringify([semanticKey(f), f.scope, f.certainty, f.involvedPillars, f.involvedCharacters, f.involvedSlots]);
    if (new Set(group.map(signature)).size !== 1) { reject(group[0], "CONFLICTING_CANONICAL_FACT"); return []; }
    return [{ ...group[0], provenance: unique(group.flatMap(f => f.provenance)) }];
  });
}

function atom(id: string, sourceType: EvidenceAtom["sourceType"], sourceKey: string, definition: SupplementSemanticDefinition,
  facts: readonly CanonicalFact[], metadata: Record<string, unknown> = {}): EvidenceAtom {
  return {
    id, sourceType, sourceKey, kind: definition.kind, tier: definition.tier, strength: "MEDIUM", weight: definition.rawWeight,
    family: definition.family, axes: { ...definition.axes }, contexts: [...definition.contexts],
    easyMeaning: definition.easyMeaning, humanDescription: definition.humanDescription,
    ...(definition.positiveMeaning ? { positiveMeaning: definition.positiveMeaning } : {}),
    ...(definition.shadowMeaning ? { shadowMeaning: definition.shadowMeaning } : {}),
    dynamicTags: [...definition.dynamicTags], fortuneTags: { ...definition.fortuneTags },
    metadata: {
      ...metadata, rawWeight: definition.rawWeight, effectiveWeight: definition.rawWeight,
      contentPriority: definition.contentPriority, stablePriority: definition.stablePriority,
      canonicalIds: unique(facts.map(f => f.canonicalId)), provenance: unique(facts.flatMap(f => f.provenance)),
      involvedPillars: unique(facts.flatMap(f => f.involvedPillars)), involvedCharacters: unique(facts.flatMap(f => f.involvedCharacters)),
      involvedSlots: unique(facts.flatMap(f => f.involvedSlots)),
      ...(definition.image ? { image: definition.image } : {}), ...(definition.riskTags ? { riskTags: [...definition.riskTags] } : {}),
      scope: "natal", claimPolicy: "SUPPORT_ONLY", standaloneMainClaim: false, fortunePromotion: false,
    },
  };
}

/** Semantic projection of explicit upstream facts. No glyph pair scanning, new
 * formation rules, stage lookup, strength thresholds or fortune promotion. */
export function projectFoundationSupplement(input: FoundationSupplementInput) {
  const evidence: EvidenceAtom[] = [], suppressed: { canonicalId: string; reason: string }[] = [];
  const reject = (f: CanonicalFact, reason: string) => suppressed.push({ canonicalId: f.canonicalId, reason });
  for (const fact of distinctFacts(input.relations, f => JSON.stringify([f.relationType, f.canonicalFormationState, f.targetElement ?? null]), reject)) {
    if (!hasProof(fact)) { reject(fact, "UNCONFIRMED_OR_NON_NATAL_FACT"); continue; }
    if (!Object.hasOwn(RELATION_SEMANTICS, fact.relationType) ||
      !(fact.canonicalFormationState === "formed" || fact.canonicalFormationState === "present" || (fact.relationType === "BANHAP" && fact.canonicalFormationState === "partial"))) {
      reject(fact, "RELATION_NOT_CONFIRMED"); continue;
    }
    const id = `supplement:relation:${fact.canonicalId}`;
    evidence.push(atom(id, "relation", fact.relationType, RELATION_SEMANTICS[fact.relationType], [fact], {
      relationType: fact.relationType, canonicalRelationId: fact.canonicalId, canonicalFormationState: fact.canonicalFormationState,
      ...(fact.targetElement ? { targetElement: fact.targetElement } : {}),
      // Preserve position/character associations when upstream provides them.
      canonicalFact: { ...fact, provenance: [...fact.provenance] },
    }));
  }
  for (const fact of distinctFacts(input.stages, f => f.stage, reject)) {
    if (!hasProof(fact) || !Object.hasOwn(TWELVE_STAGE_SEMANTICS, fact.stage)) { reject(fact, "UNCONFIRMED_STAGE"); continue; }
    const id = `supplement:stage:${fact.canonicalId}`;
    evidence.push(atom(id, "twelve_stage", fact.stage, TWELVE_STAGE_SEMANTICS[fact.stage], [fact]));
  }
  const markers = new Map<FoundationMarker, NormalizedMarkerFact[]>();
  for (const fact of input.markers) {
    const key = foundationMarkerKey(fact.featureId);
    if (!key) { reject(fact, "NO_SUPPORTED_MARKER_IN_PHASE1C"); continue; }
    // Same unresolved legacy conflict as V4 evidencePolicy. Registry != permission.
    if (key === "MANGSIN" || fact.provenance.some(r => /MANGSINSAL|twelve_sinsal_mangsin/.test(r))) { reject(fact, "MANGSIN_CANONICAL_RULE_CONFLICT"); continue; }
    if (!hasProof(fact)) { reject(fact, "UNCONFIRMED_OR_NON_NATAL_FACT"); continue; }
    const group = markers.get(key) ?? []; group.push(fact); markers.set(key, group);
  }
  const markerAtoms = [...markers.keys()].sort().map(key => {
    const facts = markers.get(key)!;
    const sources = facts.map(f => ({ canonicalId: f.canonicalId, featureId: f.featureId, basis: f.basis,
      positions: unique(f.involvedPillars), characters: unique(f.involvedCharacters), slots: unique(f.involvedSlots), provenance: unique(f.provenance) }));
    const definition = SHINSAL_SEMANTICS[key];
    return atom(`supplement:marker:${key}`, definition.sourceType, key, definition, facts, {
      label: definition.label, aliases: unique(facts.map(f => f.featureId)),
      canonicalSources: [...new Map(sources.map(s => [JSON.stringify(s), s])).entries()].sort(([a], [b]) => lexical(a, b)).map(([, s]) => s),
    });
  });
  // Diminishing applies to marker families here, never retroactively to 1A/1B.
  evidence.push(...applyFamilyDiminishingReturns(markerAtoms));
  evidence.sort((a, b) => lexical(a.id, b.id));
  return { registryVersion: SUPPLEMENT_FOUNDATION_VERSION, evidence, ...aggregateSemanticEvidence(evidence),
    families: summarizeSupplementFamilies(evidence),
    suppressed: suppressed.sort((a, b) => lexical(a.canonicalId, b.canonicalId) || lexical(a.reason, b.reason)),
  };
}

/** Table adapter accepts producer results, not prose/labels as proof. Missing
 * facts stay missing, including trines/punishments absent from this natal API. */
export function adaptSupplementTable(table: CanonicalNatalTableEvidence): FoundationSupplementInput {
  const common = (id: string, positions: readonly string[], characters: readonly string[], slots: readonly ("stem" | "branch")[], refs: readonly string[]): CanonicalFact => ({
    canonicalId: id, scope: "natal", certainty: "confirmed", involvedPillars: positions,
    involvedCharacters: characters, involvedSlots: slots, provenance: [table.version, table.calendarVersion, ...refs],
  });
  const relations: NormalizedRelationFact[] = table.relations.flatMap(r => {
    const relationType = r.id.startsWith("natal:STEM_COMBINATION:") ? "STEM_HAP" : r.id.startsWith("natal:BRANCH_COMBINATION:") ? "YUKHAP" : r.id.startsWith("natal:BRANCH_CLASH:") ? "CHUNG" : undefined;
    return relationType ? [{ ...common(r.id, r.positions, r.participants, [relationType === "STEM_HAP" ? "stem" : "branch"], [`${table.version}:relations:${r.id}`]), relationType, canonicalFormationState: "present" }] : [];
  });
  for (const f of table.features.filter(f => f.id === "sinsal_wonjin")) {
    // Current extractor supplies existence but not the matched pair/positions.
    // Leave those empty instead of locating a new pair in the content layer.
    relations.push({ ...common(f.id, f.positions, [], ["branch"], f.evidenceIds), relationType: "WONJIN", canonicalFormationState: "present" });
  }
  const stages: NormalizedStageFact[] = table.pillars.flatMap(p => (p.twelveLifeStage ?? []).flatMap(stage => Object.hasOwn(TWELVE_STAGE_SEMANTICS, stage) ? [{
    ...common(`${p.columnId}:${stage}`, [p.columnId], p.earthlyBranch ? [p.earthlyBranch] : [], ["branch"], [`${table.version}:pillars:${p.columnId}:twelveLifeStage`]), stage: stage as FoundationTwelveStage,
  }] : []));
  const markers: NormalizedMarkerFact[] = table.features.filter(f => ["sinsal", "gwiin", "twelve_sinsal"].includes(f.category) && f.id !== "sinsal_wonjin").map(f => ({
    ...common(f.id, f.positions, [], [], [`${table.version}:features:${f.id}`, ...f.evidenceIds]), featureId: f.id, basis: f.basis,
  }));
  return { relations, stages, markers };
}

/** Opt-in 1C packet, intentionally NOT merged into the 1B profile or six writers.
 * Final multi-layer integration/ranking belongs to 13D-1D and later phases. */
export function buildFoundationSupplementFromCalculation(calculation: SajuCalcResult) {
  if (!structureContext(calculation).valid || !calculation.birthTimeContext)
    return { ok: false as const, error: "UNVERIFIED_CANONICAL_CHART" as const };
  const table = buildCanonicalNatalTable(calculation.birthTimeContext);
  if (!table) return { ok: false as const, error: "NATAL_TABLE_UNAVAILABLE" as const };
  return { ok: true as const, value: { ...projectFoundationSupplement(adaptSupplementTable(table)),
    limitations: ["MANGSIN_CANONICAL_RULE_CONFLICT", "WONJIN_MATCHED_PAIR_NOT_EXPOSED", ...RELATIONS_WITHOUT_NATAL_PRODUCER.map(type => `NO_NATAL_PRODUCER:${type}`)],
  } };
}
