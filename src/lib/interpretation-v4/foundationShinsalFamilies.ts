import { aggregateSemanticEvidence, type EvidenceAtom, type FortuneTag } from "./semanticCore";
import { SHINSAL_SEMANTICS, type FoundationMarker } from "./foundationShinsal";

/** Derived from the one registry, so a marker cannot silently change family. */
export const SHINSAL_FAMILIES = Object.fromEntries(
  [...new Set(Object.values(SHINSAL_SEMANTICS).map(d => d.family))].sort().map(family => [family,
    (Object.keys(SHINSAL_SEMANTICS) as FoundationMarker[]).filter(key => SHINSAL_SEMANTICS[key].family === family).sort(),
  ]),
) as Readonly<Record<string, readonly FoundationMarker[]>>;
export const FAMILY_DIMINISHING_MULTIPLIERS = [1, 0.5, 0.25, 0.1] as const;
const lexical = (a: string, b: string) => a < b ? -1 : a > b ? 1 : 0;
const strength = { STRONG: 3, MEDIUM: 2, WEAK: 1 }, tier = { CORE: 3, SUPPORT: 2, AMPLIFIER: 1 };
const numberMeta = (e: EvidenceAtom, key: string, fallback = 0): number =>
  typeof e.metadata?.[key] === "number" && Number.isFinite(e.metadata[key]) ? e.metadata[key] as number : fallback;

/** One content-weight policy. Presence and raw signatures never disappear.
 * Stable source priority wins before lexical ID; insertion order never ranks.
 * Idempotent: an already-diminished atom uses its original rawWeight again. */
export function applyFamilyDiminishingReturns(evidence: readonly EvidenceAtom[]): EvidenceAtom[] {
  const ordered = [...evidence].sort((a, b) => lexical(a.family, b.family) || strength[b.strength] - strength[a.strength] ||
    tier[b.tier] - tier[a.tier] || numberMeta(b, "contentPriority") - numberMeta(a, "contentPriority") ||
    numberMeta(b, "stablePriority") - numberMeta(a, "stablePriority") || lexical(a.id, b.id));
  const ranks = new Map<string, number>();
  return ordered.map(atom => {
    const familyRank = (ranks.get(atom.family) ?? 0) + 1; ranks.set(atom.family, familyRank);
    const multiplier = FAMILY_DIMINISHING_MULTIPLIERS[Math.min(familyRank - 1, 3)];
    const rawWeight = numberMeta(atom, "rawWeight", atom.weight), effectiveWeight = rawWeight * multiplier;
    return { ...atom, weight: effectiveWeight, metadata: { ...atom.metadata, rawWeight, effectiveWeight, familyRank,
      familyMultiplier: multiplier, diminishingPolicy: "family-1-0.5-0.25-0.1-v1" } };
  });
}

/** Diagnostic signals, not a Claim or scheduler output. */
export function summarizeSupplementFamilies(evidence: readonly EvidenceAtom[]) {
  return [...new Set(evidence.map(e => e.family))].sort().map(family => {
    const atoms = evidence.filter(e => e.family === family).sort((a, b) => lexical(a.id, b.id));
    const raw = atoms.map(e => ({ ...e, weight: numberMeta(e, "rawWeight", e.weight) }));
    const tags = (xs: readonly EvidenceAtom[]) => {
      const output: Partial<Record<FortuneTag, number>> = {};
      for (const atom of xs) for (const tag of Object.keys(atom.fortuneTags ?? {}).sort() as FortuneTag[])
        output[tag] = (output[tag] ?? 0) + atom.fortuneTags![tag]! * atom.weight;
      return output;
    };
    return { family, semanticTheme: family, evidenceIds: atoms.map(e => e.id),
      rawContribution: aggregateSemanticEvidence(raw), effectiveContribution: aggregateSemanticEvidence(atoms),
      rawFortuneTags: tags(raw), effectiveFortuneTags: tags(atoms),
      dynamicTags: [...new Set(atoms.flatMap(e => e.dynamicTags ?? []))].sort(),
    };
  });
}
