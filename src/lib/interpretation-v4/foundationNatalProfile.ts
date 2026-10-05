import { PILLAR_KEYS } from "../saju/birthTimePrecisionTypes";
import type { SajuCalcResult, TenGod } from "../saju/types";
import { buildFoundationFromCalculation, type FoundationSemanticProfile } from "./foundationProfile";
import { EARTHLY_BRANCH_SEMANTICS, HEAVENLY_STEM_SEMANTICS, NATAL_FOUNDATION_VERSION, PILLAR_CONTENT_WEIGHTS, effectivePositionWeight, type NatalSemanticDefinition } from "./foundationPillars";
import { TEN_GOD_FAMILIES, TEN_GOD_FAMILY_SEMANTICS, TEN_GOD_SEMANTICS, type NormalizedTenGodStates, type TenGodFamily } from "./foundationTenGods";
import { buildTenGodCandidates } from "./foundationTenGodSynthesis";
import { aggregateSemanticEvidence, type EvidenceAtom, type FoundationResult, type FoundationSynthesisCandidate, type SemanticAxis } from "./semanticCore";
import { structureContext } from "./strength";
import { buildMyeongliStructure } from "./structureEvidence";
import type { StructureId } from "./structureTypes";

export type NatalFamilyGroup = {
  family: TenGodFamily;
  members: { god: TenGod; evidenceIds: string[]; occurrenceCount: number; canonicalWeight: number }[];
  evidenceIds: string[];
  /** Counts/weights are an audit ledger only, never an intensity detector. */
  occurrenceCount: number;
  canonicalWeight: number;
  normalizedState?: NormalizedTenGodStates["families"][TenGodFamily];
  humanDescription: string; positiveMeaning: string; shadowMeaning: string;
};
export type NatalFoundationProfile = ReturnType<typeof aggregateSemanticEvidence> & {
  registryVersion: typeof NATAL_FOUNDATION_VERSION;
  foundation?: FoundationSemanticProfile;
  foundationUnavailable?: "INCOMPLETE_CHART";
  evidence: EvidenceAtom[];
  synthesisCandidates: FoundationSynthesisCandidate[];
  families: NatalFamilyGroup[];
  states: NormalizedTenGodStates;
  limitations: readonly string[];
};

function meaning(definition: NatalSemanticDefinition) {
  return {
    axes: { ...definition.axes }, contexts: [...definition.contexts], family: definition.family,
    easyMeaning: definition.easyMeaning, humanDescription: definition.humanDescription,
    positiveMeaning: definition.positiveMeaning, shadowMeaning: definition.shadowMeaning,
  };
}

/** Position-preserving atoms. Canonical hidden-stem weights are reused exactly;
 * the day stem is not counted a second time as its own 比肩. */
function natalAtoms(calculation: SajuCalcResult, context: ReturnType<typeof structureContext>): EvidenceAtom[] {
  const evidence: EvidenceAtom[] = [];
  for (const pillar of PILLAR_KEYS) {
    const value = calculation.pillars[pillar];
    if (!value) continue;
    for (const slot of ["stem", "branch"] as const) {
      const key = value[slot], dayMaster = pillar === "day" && slot === "stem";
      const definition = slot === "stem" ? HEAVENLY_STEM_SEMANTICS[value.stem] : EARTHLY_BRANCH_SEMANTICS[value.branch];
      evidence.push({
        id: `natal:${pillar}:${slot}:${key}`, sourceType: slot === "stem" ? "heavenly_stem" : "earthly_branch", sourceKey: key,
        kind: "TRAIT", tier: dayMaster ? "CORE" : "SUPPORT", strength: dayMaster ? "STRONG" : "MEDIUM",
        weight: effectivePositionWeight(pillar, slot), ...meaning(definition),
        metadata: {
          pillar, slot, isDayMaster: dayMaster, positionWeight: PILLAR_CONTENT_WEIGHTS[pillar][slot],
          effectiveWeight: effectivePositionWeight(pillar, slot), importanceOnly: true,
          ...(slot === "stem" ? { image: HEAVENLY_STEM_SEMANTICS[value.stem].image } : {}),
          provenance: [`SajuCalcResult:pillars:${pillar}:${slot}:${key}`],
          birthTimePrecision: calculation.birthTimeContext?.birthTimePrecision,
        },
      });
    }
  }
  for (const atom of context.atoms) {
    const slot = atom.location === "visible" ? "stem" : "branch";
    const effectiveWeight = effectivePositionWeight(atom.position, slot) * atom.weight;
    evidence.push({
      id: `natal:ten-god:${atom.id}`, sourceType: "ten_god", sourceKey: atom.god, kind: "TRAIT",
      tier: atom.location === "visible" ? "CORE" : "SUPPORT", strength: "MEDIUM", weight: effectiveWeight,
      ...meaning(TEN_GOD_SEMANTICS[atom.god]),
      metadata: {
        pillar: atom.position, slot, stem: atom.stem, branch: calculation.pillars[atom.position]?.branch,
        location: atom.location, canonicalAtomId: atom.id, canonicalWeight: atom.weight,
        positionWeight: PILLAR_CONTENT_WEIGHTS[atom.position][slot], effectiveWeight,
        isDayMaster: false, provenance: [...atom.provenance], importanceOnly: true,
      },
    });
  }
  return evidence;
}

const HEAVY_IDS: Record<TenGodFamily, StructureId> = {
  PEER: "peerHeavy", OUTPUT: "outputHeavy", WEALTH: "wealthHeavy", OFFICER: "officerHeavy", RESOURCE: "resourceHeavy",
};

/** Only existing versioned Phase2 strong-confidence results are promoted here.
 * The legacy weighted-count structureAnalysis is deliberately not read.
 * No current producer supplies individual-god intensity or a helpful SUPPORT
 * family state: those remain absent, not inferred from presence or quantity. */
function verifiedStates(calculation: SajuCalcResult, evidence: readonly EvidenceAtom[]): NormalizedTenGodStates {
  const layer = buildMyeongliStructure(calculation);
  const states: NormalizedTenGodStates = { families: {}, gods: {} };
  if (!layer.completeChart) return states;
  const evidenceIds = new Set(evidence.map(atom => atom.id));
  for (const family of TEN_GOD_FAMILIES) {
    const candidate = layer.candidates.find(c => c.id === HEAVY_IDS[family] && c.confidence === "strong");
    if (!candidate) continue;
    const ids = candidate.supportingEvidence.filter(atom => TEN_GOD_SEMANTICS[atom.god].family === family)
      .map(atom => `natal:ten-god:${atom.id}`).sort();
    if (!ids.length || !ids.every(id => evidenceIds.has(id))) continue;
    states.families[family] = { state: "HIGH", evidenceIds: ids, provenance: [...candidate.provenance] };
  }
  const strength = layer.strength;
  const dayMaster = evidence.find(atom => atom.metadata?.isDayMaster === true);
  if (dayMaster && strength.confidence !== "uncertain" &&
    (strength.level === "balanced" || strength.confidence === "strong")) {
    states.dayMaster = {
      state: strength.level === "balanced" ? "BALANCED" : strength.level === "strong" || strength.level === "veryStrong" ? "STRONG" : "WEAK",
      evidenceIds: [dayMaster.id], provenance: [...strength.provenance],
    };
  }
  return states;
}

export function groupTenGodEvidence(evidence: readonly EvidenceAtom[], states: NormalizedTenGodStates): NatalFamilyGroup[] {
  return TEN_GOD_FAMILIES.map(family => {
    const definition = TEN_GOD_FAMILY_SEMANTICS[family];
    const members = definition.members.map(god => {
      const atoms = evidence.filter(atom => atom.sourceType === "ten_god" && atom.sourceKey === god);
      return { god, evidenceIds: atoms.map(a => a.id), occurrenceCount: atoms.length,
        canonicalWeight: atoms.reduce((sum, atom) => sum + (typeof atom.metadata?.canonicalWeight === "number" ? atom.metadata.canonicalWeight : 0), 0) };
    });
    return {
      family, members, evidenceIds: members.flatMap(m => m.evidenceIds),
      occurrenceCount: members.reduce((n, m) => n + m.occurrenceCount, 0),
      canonicalWeight: members.reduce((n, m) => n + m.canonicalWeight, 0),
      ...(states.families[family] ? { normalizedState: states.families[family] } : {}),
      humanDescription: definition.humanDescription, positiveMeaning: definition.positiveMeaning, shadowMeaning: definition.shadowMeaning,
    };
  });
}

function pillarCandidates(evidence: readonly EvidenceAtom[]): FoundationSynthesisCandidate[] {
  return evidence.filter(atom => atom.sourceType === "heavenly_stem" || atom.sourceType === "earthly_branch").map(atom => {
    const level = atom.tier === "CORE" && atom.strength === "STRONG" ? 2 : 1;
    return {
      id: `${atom.id}:meaning`, source: atom.sourceType === "heavenly_stem" ? "STEM" : "BRANCH",
      semanticTheme: atom.family, evidenceIds: [atom.id], primaryAxes: Object.keys(atom.axes) as SemanticAxis[],
      contexts: [...atom.contexts], humanDescription: atom.humanDescription!, positiveMeaning: atom.positiveMeaning,
      shadowMeaning: atom.shadowMeaning, strength: level === 2 ? "MAIN" : "SUPPORT",
      exclusivityGroup: atom.family, priority: level * 10,
      metadata: { priorityLevel: level, provenance: atom.metadata?.provenance, promotion: "INTERNAL_ONLY" },
    };
  });
}

/** Opt-in foundation adapter only. No writer, MBTI, product, or Book consumer.
 * Unknown hours keep confirmed three-pillar atoms, but never synthesize a full
 * eight-character 1A profile or strong hour-dependent ten-god candidates. */
export function buildNatalFoundationFromCalculation(calculation: SajuCalcResult):
  FoundationResult<NatalFoundationProfile> | { ok: false; error: "UNVERIFIED_CANONICAL_CHART" } {
  const context = structureContext(calculation);
  if (!context.valid) return { ok: false, error: "UNVERIFIED_CANONICAL_CHART" };
  const foundation = buildFoundationFromCalculation(calculation);
  if (!foundation.ok && foundation.error !== "INCOMPLETE_CHART") return foundation;
  const natal = natalAtoms(calculation, context);
  const states = verifiedStates(calculation, natal);
  const evidence = [...(foundation.ok ? foundation.value.evidence : []), ...natal];
  const synthesisCandidates = [
    ...(foundation.ok ? foundation.value.synthesisCandidates : []), ...pillarCandidates(natal), ...buildTenGodCandidates(states, natal),
  ].sort((a, b) => b.priority - a.priority || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
  return { ok: true, value: {
    registryVersion: NATAL_FOUNDATION_VERSION, ...aggregateSemanticEvidence(evidence), evidence, states, synthesisCandidates,
    families: groupTenGodEvidence(natal, states),
    ...(foundation.ok ? { foundation: foundation.value } : { foundationUnavailable: "INCOMPLETE_CHART" as const }),
    limitations: ["INDIVIDUAL_GOD_INTENSITY_UNAVAILABLE", "FAMILY_SUPPORT_STATE_UNAVAILABLE", "NO_NEW_STRENGTH_THRESHOLDS",
      ...(!context.complete ? ["INCOMPLETE_CHART_STRENGTH_SUPPRESSED"] : [])],
  } };
}
