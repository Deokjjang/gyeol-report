import { BAND_ORDER, type FusionSide } from "./fusionCore";
import { RELATIONSHIP_AXES, type RelationshipView } from "./relationshipProductView";
import type { PairEvidence } from "./compatibilityEvidence";
import type { SemanticAxis } from "./semanticCore";
import type { composeCompatibilityNarrative } from "./compatibilityComposer";

type CanonicalPair = Extract<ReturnType<typeof composeCompatibilityNarrative>, { ok: true }>;
type PersonAxis = { axis: SemanticAxis; direction: 1 | -1; band: FusionSide["band"]; evidence: string[]; system: string[] };
export type PairComparison = { tag: "SHARED" | "FRICTION" | "CONTEXTUAL"; axis: SemanticAxis; personA: PersonAxis; personB: PersonAxis };

function personAxes(view: RelationshipView): PersonAxis[] {
  return RELATIONSHIP_AXES.flatMap(axis => {
    const rows = view.sides.filter(s => s.axis === axis);
    if (!rows.length) return [];
    // Reuse normalized bands, never compare raw scores or add A/B axes.
    const strongest = rows.reduce((a, b) => BAND_ORDER[a.band] >= BAND_ORDER[b.band] ? a : b).band;
    return ([1, -1] as const).flatMap(direction => {
      const matched = rows.filter(s => s.band === strongest && s.direction === direction);
      return matched.length ? [{ axis, direction, band: strongest, evidence: [...new Set(matched.flatMap(s => s.exactEvidenceIds))].sort(), system: [...new Set(matched.map(s => s.system))].sort() }] : [];
    });
  });
}

/** Relationship interpretation tags, NOT a second compatibility calculation.
 * Two licensed individual sides are mandatory. Complement stays the existing
 * pair element/harmony result; notablePairs remains an isolated pair reference. */
export function projectCompatibilityPairView(a: RelationshipView, b: RelationshipView, canonical: CanonicalPair) {
  const personA = personAxes(a), personB = personAxes(b), comparisons: PairComparison[] = [];
  for (const axis of RELATIONSHIP_AXES) {
    const left = personA.filter(v => v.axis === axis), right = personB.filter(v => v.axis === axis);
    if (!left.length || !right.length) continue;
    for (const x of left) for (const y of right) {
      if (!x.evidence.length || !y.evidence.length || x.band === "SUPPORT" || y.band === "SUPPORT") continue;
      comparisons.push({ tag: left.length > 1 || right.length > 1 ? "CONTEXTUAL" : x.direction === y.direction ? "SHARED" : "FRICTION", axis, personA: x, personB: y });
    }
  }
  const evidence: PairEvidence = canonical.evidence;
  return { category: evidence.category, roles: evidence.roles, persons: { personA, personB }, comparisons,
    sharedGround: comparisons.filter(c => c.tag === "SHARED"), friction: comparisons.filter(c => c.tag === "FRICTION"),
    communication: comparisons.filter(c => c.axis === "COMMUNICATION_STYLE"),
    closeness: comparisons.filter(c => ["RELATION_STYLE", "AUTONOMY", "BOUNDARY", "RECOVERY_NEED"].includes(c.axis)),
    complement: { tag: "COMPLEMENTARY" as const, element: canonical.selection.element, harmony: canonical.selection.harmony },
    pairReference: canonical.mbtiPairBasis, canonicalIndex: canonical.compatibilityIndex,
    canonicalDirections: evidence.directions, canonicalRelationIds: evidence.relations.map(r => r.identity) };
}
export type CompatibilityPairView = ReturnType<typeof projectCompatibilityPairView>;
