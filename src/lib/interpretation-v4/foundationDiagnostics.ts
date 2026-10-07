import { BIPOLAR_AXES, SEMANTIC_AXES, type EvidenceAtom, type FoundationSynthesisCandidate } from "./semanticCore";
import { FAMILY_DIMINISHING_MULTIPLIERS } from "./foundationShinsalFamilies";
import { RELATIONS_WITHOUT_NATAL_PRODUCER } from "./foundationRelations";
import { lexical, positionFactor, sortedUnique } from "./foundationRanking";
import type { MyeongliSemanticProfile } from "./foundationIntegratedProfile";

export type ProfileDiagnostic = { code: string; evidenceIds: string[]; detail?: string };
export type MyeongliProfileDiagnostics = {
  unsupportedCanonicalFeatures: string[]; suppressedEvidence: ProfileDiagnostic[];
  duplicateGroups: { id: string; candidateIds: string[] }[];
  tensionCount: number; signatureCandidateCount: number; mainCandidateCount: number; supportCandidateCount: number;
  amplifierOnlyCandidates: string[]; warnings: ProfileDiagnostic[]; hardErrors: ProfileDiagnostic[];
};
export const UNSUPPORTED_PROFILE_FEATURES = [...RELATIONS_WITHOUT_NATAL_PRODUCER, "MANGSIN"] as const;
export const hasProvenance = (value: unknown) => typeof value === "string" ? value.trim().length > 0 :
  Array.isArray(value) && value.length > 0 && value.every(v => typeof v === "string" && v.trim().length > 0);
const fingerprint = (value: unknown): string => {
  if (Array.isArray(value)) return `[${value.map(fingerprint).join(",")}]`;
  if (value && typeof value === "object") return `{${Object.entries(value).filter(([, v]) => v !== undefined).sort(([a], [b]) => lexical(a, b)).map(([k, v]) => `${JSON.stringify(k)}:${fingerprint(v)}`).join(",")}}`;
  return JSON.stringify(value) ?? "undefined";
};
export const stableDiagnostics = (items: readonly ProfileDiagnostic[]) => [...new Map(items.map(d => {
  const normalized = { ...d, evidenceIds: sortedUnique(d.evidenceIds) }; return [fingerprint(normalized), normalized];
})).values()].sort((a, b) => lexical(a.code, b.code) || lexical(a.evidenceIds.join("|"), b.evidenceIds.join("|")) || lexical(a.detail ?? "", b.detail ?? ""));

/** Typed internal boundary; malformed normalized fixtures return a hard diagnostic
 * and no profile. Conflicting sources must not become human tensions. */
export function inspectIntegratedSources(input: readonly EvidenceAtom[], synthesis: readonly FoundationSynthesisCandidate[]) {
  const hardErrors: ProfileDiagnostic[] = [], warnings: ProfileDiagnostic[] = [], suppressedEvidence: ProfileDiagnostic[] = [];
  const evidence: EvidenceAtom[] = [], byId = new Map<string, EvidenceAtom>(), states = new Map<string, { value: string; id: string }>();
  const hard = (code: string, ids: string[], detail?: string) => hardErrors.push({ code, evidenceIds: ids, ...(detail ? { detail } : {}) });
  for (const e of input) {
    const m = e.metadata ?? {};
    if ((e.sourceType === "relation" && (RELATIONS_WITHOUT_NATAL_PRODUCER as readonly string[]).includes(e.sourceKey)) || e.sourceKey === "MANGSIN" || /MANGSINSAL|twelve_sinsal_mangsin/.test(fingerprint(m.provenance))) {
      suppressedEvidence.push({ code: e.sourceKey === "MANGSIN" || /MANGSINSAL|twelve_sinsal_mangsin/.test(fingerprint(m.provenance)) ? "MANGSIN_CANONICAL_RULE_CONFLICT" : "UNSUPPORTED_CANONICAL_FEATURE", evidenceIds: [e.id] });
      continue;
    }
    const old = byId.get(e.id);
    if (old) { if (fingerprint(old) !== fingerprint(e)) hard("DUPLICATE_EVIDENCE_ID_CONFLICT", [e.id]); continue; }
    byId.set(e.id, e); evidence.push(e);
    if (!e.id || !e.family || !e.sourceKey) hard("MALFORMED_EVIDENCE_IDENTITY", [e.id]);
    if (!["CORE", "SUPPORT", "AMPLIFIER"].includes(e.tier) || !["WEAK", "MEDIUM", "STRONG"].includes(e.strength) ||
      !["yin_yang", "element", "heavenly_stem", "earthly_branch", "ten_god", "relation", "twelve_stage", "shinsal", "gwiin"].includes(e.sourceType)) hard("INVALID_EVIDENCE_CLASSIFICATION", [e.id]);
    if (!hasProvenance(m.provenance)) hard("MALFORMED_PROVENANCE", [e.id]);
    if (!Number.isFinite(e.weight) || e.weight < 0) hard("INVALID_EVIDENCE_WEIGHT", [e.id]);
    if (typeof m.rawWeight !== "undefined" && (typeof m.rawWeight !== "number" || !Number.isFinite(m.rawWeight) || m.rawWeight < 0)) hard("INVALID_RAW_WEIGHT", [e.id]);
    if (m.canonicalConfidence === undefined) warnings.push({ code: "CANONICAL_CONFIDENCE_UNAVAILABLE", evidenceIds: [e.id] });
    else if (typeof m.canonicalConfidence !== "number" || !Number.isFinite(m.canonicalConfidence) || m.canonicalConfidence < 0 || m.canonicalConfidence > 1) hard("INVALID_CANONICAL_CONFIDENCE", [e.id]);
    if (m.positionWeight !== undefined && (typeof m.positionWeight !== "number" || ![2, 2.5, 4, 5].includes(m.positionWeight))) hard("INVALID_POSITION_WEIGHT", [e.id]);
    if (!Number.isFinite(positionFactor(e)) || positionFactor(e) <= 0 || positionFactor(e) > 1) hard("INVALID_POSITION_FACTOR", [e.id]);
    if (m.familyMultiplier !== undefined || m.familyRank !== undefined) {
      const rank = m.familyRank, multiplier = m.familyMultiplier, raw = m.rawWeight;
      if (typeof rank !== "number" || !Number.isInteger(rank) || rank < 1 || multiplier !== FAMILY_DIMINISHING_MULTIPLIERS[Math.min((rank as number) - 1, 3)] ||
        typeof raw !== "number" || typeof multiplier !== "number" || raw * multiplier !== e.weight || m.effectiveWeight !== e.weight) hard("INVALID_FAMILY_MULTIPLIER", [e.id]);
    }
    for (const [axis, value] of Object.entries(e.axes)) {
      if (!(SEMANTIC_AXES as readonly string[]).includes(axis)) hard("UNKNOWN_SEMANTIC_AXIS", [e.id], axis);
      if (!Number.isFinite(value) || (!(BIPOLAR_AXES as readonly string[]).includes(axis) && value < 0)) hard("INVALID_AXIS_CONTRIBUTION", [e.id], axis);
    }
    if (e.sourceType === "yin_yang") {
      const yin = m.yinCount, yang = m.yangCount;
      if (typeof yin !== "number" || typeof yang !== "number" || !Number.isInteger(yin) || !Number.isInteger(yang) || yin < 0 || yang < 0 || yin + yang !== 8) hard("IMPOSSIBLE_YIN_YANG_COUNT", [e.id]);
    }
    // 1B uses canonicalAtomId, while 1C retains canonicalIds and relation
    // formation state. Different evidence IDs must not hide one fact's conflict.
    const canonicalIds = [m.canonicalAtomId, m.canonicalRelationId, ...(Array.isArray(m.canonicalIds) ? m.canonicalIds : [])]
      .filter((id): id is string => typeof id === "string" && id.length > 0);
    const identities = e.sourceType === "element" ? [`element:${e.sourceKey}`] : e.sourceType === "yin_yang" ? ["yin_yang"] :
      sortedUnique(canonicalIds).map(id => `${e.sourceType}:${id}`);
    const state = fingerprint([e.sourceKey, m.state, m.canonicalFormationState,
      ...(e.sourceType === "yin_yang" ? [m.yinCount, m.yangCount] : [])]);
    for (const identity of identities) {
      const previous = states.get(identity);
      if (previous && previous.value !== state) hard("CONFLICTING_CANONICAL_STATE", [previous.id, e.id], identity);
      else states.set(identity, { value: state, id: e.id });
    }
  }
  const synthesisById = new Map<string, FoundationSynthesisCandidate>();
  const retainedSynthesis: FoundationSynthesisCandidate[] = [];
  for (const s of synthesis) {
    const old = synthesisById.get(s.id);
    if (old) { if (fingerprint(old) !== fingerprint(s)) hard("DUPLICATE_SYNTHESIS_ID_CONFLICT", s.evidenceIds, s.id); continue; }
    synthesisById.set(s.id, s);
    const missing = s.evidenceIds.filter(id => !byId.has(id));
    if (!s.evidenceIds.length || missing.length) {
      if (missing.length && missing.every(id => suppressedEvidence.some(d => d.evidenceIds.includes(id))))
        suppressedEvidence.push({ code: "SYNTHESIS_DEPENDS_ON_SUPPRESSED_EVIDENCE", evidenceIds: [...s.evidenceIds], detail: s.id });
      else hard("MISSING_SYNTHESIS_EVIDENCE", missing, s.id);
      continue;
    }
    for (const axis of s.primaryAxes) if (!(SEMANTIC_AXES as readonly string[]).includes(axis)) hard("UNKNOWN_SEMANTIC_AXIS", s.evidenceIds, axis);
    retainedSynthesis.push(s);
  }
  return { evidence: structuredClone(evidence.sort((a, b) => lexical(a.id, b.id))),
    synthesisCandidates: structuredClone(retainedSynthesis.sort((a, b) => lexical(a.id, b.id))),
    hardErrors: stableDiagnostics(hardErrors), warnings: stableDiagnostics(warnings), suppressedEvidence: stableDiagnostics(suppressedEvidence) };
}

/** Internal serializable inspector contract only: no route/component/Book packet. */
export function buildMyeongliDebugView(profile: MyeongliSemanticProfile) {
  return structuredClone({ version: profile.version, topAxes: profile.dominantAxes,
    signatureCandidates: profile.signatureCandidates, mainCandidates: profile.mainCandidates, supportCandidates: profile.supportCandidates,
    tensions: profile.tensionCandidates, humanPatterns: profile.humanPatternCandidates, semanticThemes: profile.semanticThemes,
    evidenceFamilies: profile.evidenceFamilies, fortuneSignals: profile.fortuneSignals, dynamicSignals: profile.dynamicSignals,
    diagnostics: profile.diagnostics });
}
