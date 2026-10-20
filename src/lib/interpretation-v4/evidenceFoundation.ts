import type { MaterialPacket, NarrativeBlock, NarrativeProof, NarrativeSection } from "./narrativeTypes";

/** Production-neutral evidence inspection. Never identifies a person or changes a Book. */
export const EVIDENCE_FOUNDATION_REVISION = "v4-evidence-foundation-01" as const;

export type EvidenceFoundationIssueCode =
  | "DUPLICATE_CHAPTER_ID" | "DUPLICATE_BLOCK_ID" | "EMPTY_NARRATIVE"
  | "MISSING_PROOF" | "SEED_WITHOUT_ROOT" | "GENERIC_REFERENCE_ONLY"
  | "UNKNOWN_FEATURE_REFERENCE" | "UNKNOWN_FUSION_REFERENCE"
  | "REUSED_THEME_WITHOUT_NEW_SUPPORT";

export type EvidenceFoundationIssue = {
  readonly code: EvidenceFoundationIssueCode;
  readonly location: string;
  readonly severity: "error" | "review";
};

export type EvidenceBasis = "natal" | "fusion" | "period" | "input" | "editorial" | "unbound";
export type EvidenceFoundationChapter = {
  readonly id: string;
  readonly domain: string;
  readonly blockCount: number;
  readonly supportedBlocks: number;
  readonly rootedBlocks: number;
  readonly contextualBlocks: number;
  readonly basisCounts: Readonly<Record<EvidenceBasis, number>>;
  readonly uniqueFeatures: readonly string[];
  readonly uniqueSeeds: readonly string[];
  readonly uniqueFusionIds: readonly string[];
  readonly uniqueSourceRefs: readonly string[];
};

export type EvidenceFoundationReport = {
  readonly version: typeof EVIDENCE_FOUNDATION_REVISION;
  readonly chapters: readonly EvidenceFoundationChapter[];
  readonly issues: readonly EvidenceFoundationIssue[];
};

const unique = (values: readonly string[]): string[] =>
  [...new Set(values.filter(value => Boolean(value.trim())))].sort();

const hasPrefix = (text: string, values: readonly string[]) =>
  values.some(prefix => text.startsWith(prefix));

// A source URL, editorial label or scene marker is provenance, NOT proof of a
// computed natal fact. These prefixes denote a structured, time-bound claim.
const PERIOD_FACT_REFS = [
  "period-ten-god:", "period-element:", "dayun-cycle:", "content-period:",
  "content-relation:", "compatibilityRelationRules:", "period-relation:",
  "annual-month:", "jie:", "natal-element:",
] as const;
const INPUT_FACT_REFS = ["input:", "user-context:"] as const;

function basis(proof: NarrativeProof): EvidenceBasis {
  if (proof.fusionIds.length) return "fusion";
  if (proof.features.length) return "natal";
  if (proof.sourceRefs.some(ref => hasPrefix(ref, PERIOD_FACT_REFS))) return "period";
  if (proof.sourceRefs.some(ref => hasPrefix(ref, INPUT_FACT_REFS))) return "input";
  if (proof.seedIds.length || proof.sourceRefs.length) return "editorial";
  return "unbound";
}

function semanticSupport(proof: NarrativeProof): readonly string[] {
  // Seed IDs and opaque source refs explain where prose came from. Neither
  // constitutes an independent personality/relationship observation.
  return unique([
    ...proof.features.map(id => "feature:" + id),
    ...proof.fusionIds.map(id => "fusion:" + id),
  ]);
}

const evidenceByBlock = (block: NarrativeBlock) => ({
  basis: basis(block.proof),
  support: semanticSupport(block.proof),
});

export function inspectEvidenceFoundation(
  narrative: { readonly opening: readonly NarrativeBlock[]; readonly sections: readonly NarrativeSection[] },
  options: { readonly knownFeatures?: readonly string[]; readonly knownFusionIds?: readonly string[] } = {},
): EvidenceFoundationReport {
  const parts = [
    { id: "core", domain: "identity", blocks: narrative.opening },
    ...narrative.sections.map(s => ({ id: s.id, domain: s.domain, blocks: s.blocks })),
  ];
  const issues: EvidenceFoundationIssue[] = [];
  const chapterIds = new Set<string>();
  const knownFeatures = options.knownFeatures ? new Set(options.knownFeatures) : null;
  const knownFusions = options.knownFusionIds ? new Set(options.knownFusionIds) : null;
  const chapters = parts.map(part => {
    if (chapterIds.has(part.id)) issues.push({
      code: "DUPLICATE_CHAPTER_ID", location: part.id, severity: "error",
    });
    chapterIds.add(part.id);
    const seen = new Set<string>();
    const counts: Record<EvidenceBasis, number> = {
      natal: 0, fusion: 0, period: 0, input: 0, editorial: 0, unbound: 0,
    };
    for (const block of part.blocks) {
      const location = part.id + "/" + block.id;
      if (seen.has(block.id)) issues.push({
        code: "DUPLICATE_BLOCK_ID", location, severity: "error",
      });
      seen.add(block.id);
      if (!block.text.trim()) issues.push({
        code: "EMPTY_NARRATIVE", location, severity: "error",
      });
      const info = evidenceByBlock(block);
      counts[info.basis]++;
      if (info.basis === "unbound") issues.push({
        code: "MISSING_PROOF", location, severity: "review",
      });
      if (info.basis === "editorial") issues.push({
        code: block.proof.seedIds.length ? "SEED_WITHOUT_ROOT" : "GENERIC_REFERENCE_ONLY",
        location, severity: "review",
      });
      if (knownFeatures && block.proof.features.some(id => !knownFeatures.has(id))) issues.push({
        code: "UNKNOWN_FEATURE_REFERENCE", location, severity: "review",
      });
      if (knownFusions && block.proof.fusionIds.some(id => !knownFusions.has(id))) issues.push({
        code: "UNKNOWN_FUSION_REFERENCE", location, severity: "review",
      });
    }
    const evidence = part.blocks.map(block => block.proof);
    return {
      id: part.id,
      domain: part.domain,
      blockCount: part.blocks.length,
      supportedBlocks: part.blocks.length - counts.unbound - counts.editorial,
      rootedBlocks: counts.natal + counts.fusion,
      contextualBlocks: counts.period + counts.input,
      basisCounts: counts,
      uniqueFeatures: unique(evidence.flatMap(p => p.features)),
      uniqueSeeds: unique(evidence.flatMap(p => p.seedIds)),
      uniqueFusionIds: unique(evidence.flatMap(p => p.fusionIds)),
      uniqueSourceRefs: unique(evidence.flatMap(p => p.sourceRefs)),
    };
  });

  // Repeat alerts require the same semantic theme, question/domain and root
  // support. A new domain or scene family may legitimately apply the same fact.
  const previous = new Map<string, readonly string[]>();
  for (const part of parts) for (const block of part.blocks) {
    const theme = block.editorial?.theme;
    if (!theme) continue;
    const support = semanticSupport(block.proof);
    if (!support.length) continue;
    const identity = part.domain + ":" + theme + ":" + (block.editorial?.sceneFamily ?? "");
    const before = previous.get(identity);
    if (before && support.every(key => before.includes(key))) {
      issues.push({
        code: "REUSED_THEME_WITHOUT_NEW_SUPPORT",
        location: part.id + "/" + block.id,
        severity: "review",
      });
    } else if (!before || support.some(key => !before.includes(key))) {
      previous.set(identity, support);
    }
  }
  return { version: EVIDENCE_FOUNDATION_REVISION, chapters, issues };
}

/** Independent support must be proven, never assumed from different labels. */
export function compareMaterialIndependence(
  first: { readonly feature: string; readonly category: string; readonly lineage: readonly string[] },
  second: { readonly feature: string; readonly category: string; readonly lineage: readonly string[] },
): "independent" | "dependent" | "unknown" {
  if (first.feature === second.feature) return "dependent";
  const sameDayBasis = ["dayMaster", "dayPillar"].includes(first.category) &&
    ["dayMaster", "dayPillar"].includes(second.category);
  if (sameDayBasis) return "dependent";
  const firstLineage = unique(first.lineage), secondLineage = unique(second.lineage);
  if (!firstLineage.length || !secondLineage.length) return "unknown";
  return firstLineage.some(ref => secondLineage.includes(ref)) ? "dependent" : "independent";
}

/** Trace knowledge availability separately from whether prose reused it. */
export function inspectMaterialCoverage(
  narrative: { readonly opening: readonly NarrativeBlock[]; readonly sections: readonly NarrativeSection[] },
  packet: Pick<MaterialPacket, "selected" | "held" | "fusions">,
) {
  const used = [
    ...narrative.opening,
    ...narrative.sections.flatMap(s => s.blocks),
  ];
  const referencedFeatures = unique(used.flatMap(b => b.proof.features));
  const referencedFusions = unique(used.flatMap(b => b.proof.fusionIds));
  const selected = new Set(packet.selected.map(m => m.feature));
  const held = new Set(packet.held.map(m => m.feature));
  const fusion = new Set(packet.fusions.map(f => f.ruleId));
  return {
    version: EVIDENCE_FOUNDATION_REVISION,
    selectedCount: selected.size,
    heldCount: held.size,
    realizedSelected: referencedFeatures.filter(id => selected.has(id)),
    unusedSelected: [...selected].filter(id => !referencedFeatures.includes(id)).sort(),
    referencedHeld: referencedFeatures.filter(id => held.has(id)),
    outsidePacketFeatures: referencedFeatures.filter(id => !selected.has(id) && !held.has(id)),
    availableFusionCount: fusion.size,
    realizedFusion: referencedFusions.filter(id => fusion.has(id)),
    unusedFusion: [...fusion].filter(id => !referencedFusions.includes(id)).sort(),
    outsidePacketFusion: referencedFusions.filter(id => !fusion.has(id)),
  };
}
