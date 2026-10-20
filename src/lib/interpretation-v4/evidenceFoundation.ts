import type { ComprehensivePlanInputs } from "./comprehensivePlanCore";
import { canonicalV4Feature } from "./materialRegistry";
import { depthFeature } from "./materialDepth";
import type { MaterialPacket, NarrativeBlock, NarrativeProof, NarrativeSection } from "./narrativeTypes";

/** Production-neutral evidence inspection. Never identifies a person or changes a Book. */
export const EVIDENCE_FOUNDATION_REVISION = "v4-evidence-foundation-02" as const;

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

export type EvidenceBasis = "natal" | "mbti" | "fusion" | "period" | "input" | "editorial" | "unbound";
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
  readonly traces: readonly FoundationTrace[];
};

const unique = (values: readonly string[]): string[] =>
  [...new Set(values.filter(value => Boolean(value.trim())))].sort();

/** References must come from a producer's evaluated inventory. A spelling,
 * source URL or registry entry alone cannot create a computed observation. */
export type FoundationReference = {
  readonly id: string;
  readonly subject: string;
  readonly scope: "natal" | "current-context" | "major" | "annual" | "monthly" | "pair";
  readonly period?: string;
  readonly basis: "natal" | "mbti" | "fusion" | "period" | "input";
  readonly support: "calculated" | "derived" | "direct-source" | "conditional";
  readonly domains: readonly string[];
  readonly lineage: readonly string[];
  readonly sourceRefs: readonly string[];
  readonly dependencies: readonly string[];
};
export type FoundationTrace = {
  readonly location: string;
  readonly references: readonly FoundationReference[];
  /** Unresolved provenance is preserved, never silently promoted to evidence. */
  readonly unresolved: readonly string[];
};

function basis(proof: NarrativeProof, references: readonly FoundationReference[]): EvidenceBasis {
  if (references.some(r => r.basis === "fusion")) return "fusion";
  if (references.some(r => r.basis === "natal")) return "natal";
  if (references.some(r => r.basis === "mbti")) return "mbti";
  if (references.some(r => r.basis === "period")) return "period";
  if (references.some(r => r.basis === "input")) return "input";
  if (proof.features.length || proof.fusionIds.length || proof.seedIds.length || proof.sourceRefs.length) return "editorial";
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

export function inspectEvidenceFoundation(
  narrative: { readonly opening: readonly NarrativeBlock[]; readonly sections: readonly NarrativeSection[] },
  options: { readonly knownFeatures?: readonly string[]; readonly knownFusionIds?: readonly string[]; readonly references?: readonly FoundationReference[] } = {},
): EvidenceFoundationReport {
  const parts = [
    { id: "core", domain: "identity", blocks: narrative.opening },
    ...narrative.sections.map(s => ({ id: s.id, domain: s.domain, blocks: s.blocks })),
  ];
  const issues: EvidenceFoundationIssue[] = [];
  const traces: FoundationTrace[] = [];
  const referenceIndex = new Map<string, FoundationReference[]>();
  for (const ref of options.references ?? []) referenceIndex.set(ref.id, [...(referenceIndex.get(ref.id) ?? []), ref]);
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
      natal: 0, mbti: 0, fusion: 0, period: 0, input: 0, editorial: 0, unbound: 0,
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
      const declared = unique([...block.proof.features, ...block.proof.fusionIds, ...block.proof.sourceRefs]);
      const references = declared.flatMap(id => referenceIndex.get(id) ?? []);
      traces.push({ location, references, unresolved: declared.filter(id => !referenceIndex.has(id)) });
      const info = { basis: basis(block.proof, references) };
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
      rootedBlocks: counts.natal + counts.fusion + counts.mbti,
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
  return { version: EVIDENCE_FOUNDATION_REVISION, chapters, issues, traces };
}

type IndependenceInput = {
  readonly feature: string; readonly category: string; readonly lineage: readonly string[];
  readonly subject?: string; readonly scope?: string; readonly period?: string;
};
const canonicalSupport = (id: string) => depthFeature(canonicalV4Feature(id));
const canonicalLineage = (lineage: readonly string[]) => unique(lineage
  // Registry/source paths document knowledge, not separate observations.
  .filter(id => !/^(?:https?:|docs\/|src\/|calendar:|sajuKnowledgeBase:|sajuFeatureTaxonomy:|v4:)/.test(id))
  .map(id => {
    const boundary = id.indexOf(":natal:");
    return boundary < 0 ? canonicalSupport(id) : id.slice(0, boundary + 7) + canonicalSupport(id.slice(boundary + 7));
  }));

/** Same observation aliases and source ancestry never earn extra support.
 * Subject and period are part of identity, not inferred from the feature label. */
export function compareMaterialIndependence(first: IndependenceInput, second: IndependenceInput): "independent" | "dependent" | "unknown" {
  if (first.subject && second.subject && first.subject !== second.subject ||
      first.scope && second.scope && first.scope !== second.scope ||
      first.period && second.period && first.period !== second.period) return "independent";
  if (canonicalSupport(first.feature) === canonicalSupport(second.feature)) return "dependent";
  if (["dayMaster", "dayPillar"].includes(first.category) && ["dayMaster", "dayPillar"].includes(second.category)) return "dependent";
  const a = canonicalLineage(first.lineage), b = canonicalLineage(second.lineage);
  if (!a.length || !b.length) return "unknown";
  return a.some(ref => b.includes(ref)) ? "dependent" : "independent";
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

/** Reuse profiles already built by the product adapter. No calendar/profile
 * recomputation, source-text guessing or additional database query. */
export function buildFoundationReferences(
  profiles: Pick<ComprehensivePlanInputs, "myeongli" | "mbti" | "fusion">,
  subject = "person",
): FoundationReference[] {
  const refs: FoundationReference[] = [];
  const strings = (v: unknown): string[] => typeof v === "string" ? [v] : Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
  for (const atom of profiles.myeongli.evidence) {
    const m = atom.metadata ?? {};
    const ancestry = unique([...strings(m.canonicalAtomId), ...strings(m.canonicalIds), ...strings(m.canonicalRelationId)]);
    refs.push({ id: atom.id, subject, scope: "natal", basis: "natal", support: "derived", domains: atom.contexts,
      // Atom identity is the producer's observation; the knowledge path is provenance.
      lineage: (ancestry.length ? ancestry : [atom.id]).map(id => `${subject}:${id}`),
      sourceRefs: strings(m.provenance), dependencies: ancestry });
  }
  for (const node of profiles.mbti.sourceNodes) {
    if (node.classification !== "SCORING_SEMANTIC" || !node.sourcePath.startsWith("/traits/") || !node.sourcePath.endsWith("/plainKo") ||
      !["direct", "inferred"].includes(node.sourceCoverage ?? "")) continue;
    const annotation = profiles.mbti.annotations.find(a => a.sourceNodeId === node.id);
    refs.push({ id: node.id, subject, scope: "natal", basis: "mbti", support: node.sourceCoverage === "direct" ? "direct-source" : "derived",
      domains: annotation?.contexts ?? [], lineage: [`${subject}:${node.id}`],
      sourceRefs: [`docs/product/mbti/source/${node.mbtiType}.json${node.sourcePath}`], dependencies: [] });
  }
  const byId = new Map(refs.map(r => [r.id, r]));
  for (const f of [...profiles.fusion.reinforce, ...profiles.fusion.tensions, ...profiles.fusion.complements]) {
    const dependencies = unique([...f.myeongli.evidenceIds, ...f.mbti.sourceNodeIds]);
    // Missing dependencies cannot be made valid by a well-formed Fusion ID.
    if (!dependencies.length || dependencies.some(id => !byId.has(id))) continue;
    refs.push({ id: f.id, subject, scope: "natal", basis: "fusion", support: "conditional", domains: f.contexts,
      lineage: unique(dependencies.flatMap(id => byId.get(id)!.lineage)),
      sourceRefs: [profiles.fusion.version, profiles.fusion.registryVersion, ...(f.ruleId ? [f.ruleId] : [])], dependencies });
  }
  return refs.sort((a, b) => a.id.localeCompare(b.id));
}

export function materialFoundationReferences(packet: MaterialPacket): FoundationReference[] {
  return packet.selected.map(m => ({ id: m.feature, subject: packet.subject, scope: "natal", basis: "natal", support: "derived",
    domains: unique(m.material.seeds.flatMap(s => s.domains)), lineage: m.lineage, sourceRefs: m.sourceRefs,
    dependencies: m.evidence.map(d => d.evidence.id) }));
}
