import type { NarrativeBlock, NarrativeProof, NarrativeSection } from "./narrativeTypes";

/**
 * Pure, reader-independent evidence lineage inspection for V4 manuscript work.
 * No generation, personal data, database, scores, gates or stored snapshots change.
 * A reference is not assumed independent merely because it has a different ID.
 */
export type EvidenceFoundationIssue = {
  readonly code: "MISSING_PROOF" | "DUPLICATE_BLOCK_ID" | "EMPTY_NARRATIVE" | "REUSED_THEME_WITHOUT_NEW_SUPPORT";
  readonly location: string;
  readonly severity: "error" | "review";
};

export type EvidenceFoundationChapter = {
  readonly id: string;
  readonly blockCount: number;
  readonly supportedBlocks: number;
  readonly uniqueFeatures: readonly string[];
  readonly uniqueSeeds: readonly string[];
  readonly uniqueFusionIds: readonly string[];
  readonly uniqueSourceRefs: readonly string[];
};

const unique = (values: readonly string[]): readonly string[] => [...new Set(values.filter(Boolean))].sort();

const references = (p: NarrativeProof): readonly string[] =>
  unique([...p.features.map(v => `feature:${v}`), ...p.seedIds.map(v => `seed:${v}`),
    ...p.fusionIds.map(v => `fusion:${v}`), ...p.sourceRefs.map(v => `source:${v}`)]);

/** A root feature, not a rendering marker, is required for a feature-based claim. */
export function inspectEvidenceFoundation(
  narrative: { readonly opening: readonly NarrativeBlock[]; readonly sections: readonly NarrativeSection[] },
): { readonly chapters: readonly EvidenceFoundationChapter[]; readonly issues: readonly EvidenceFoundationIssue[] } {
  const parts = [{ id: "core", blocks: narrative.opening }, ...narrative.sections.map(s => ({ id: s.id, blocks: s.blocks }))];
  const issues: EvidenceFoundationIssue[] = [];
  const seen = new Set<string>();
  const chapters = parts.map(chapter => {
    const evidence = chapter.blocks.flatMap(b => [b.proof]);
    for (const block of chapter.blocks) {
      const location = `${chapter.id}/${block.id}`;
      if (seen.has(location)) issues.push({ code: "DUPLICATE_BLOCK_ID", location, severity: "error" });
      seen.add(location);
      if (!block.text.trim()) issues.push({ code: "EMPTY_NARRATIVE", location, severity: "error" });
      if (!references(block.proof).length) issues.push({ code: "MISSING_PROOF", location, severity: "review" });
    }
    return {
      id: chapter.id, blockCount: chapter.blocks.length,
      supportedBlocks: chapter.blocks.filter(b => references(b.proof).length > 0).length,
      uniqueFeatures: unique(evidence.flatMap(p => p.features)),
      uniqueSeeds: unique(evidence.flatMap(p => p.seedIds)),
      uniqueFusionIds: unique(evidence.flatMap(p => p.fusionIds)),
      uniqueSourceRefs: unique(evidence.flatMap(p => p.sourceRefs)),
    };
  });
  // Report-wide theme recurrence is a review signal, not an automatic blocker.
  // It cannot be used to suppress a legitimate repeated natal fact.
  const previous = new Map<string, { chapter: string; support: readonly string[] }>();
  for (const part of parts) for (const block of part.blocks) {
    const theme = block.editorial?.theme;
    if (!theme) continue;
    const support = references(block.proof).filter(v => !v.startsWith("source:content-role:") && !v.startsWith("source:v4-content-synthesis-"));
    const before = previous.get(theme);
    if (before && before.chapter !== part.id && support.length > 0 &&
      support.every(v => before.support.includes(v))) {
      issues.push({ code: "REUSED_THEME_WITHOUT_NEW_SUPPORT", location: `${part.id}/${block.id}`, severity: "review" });
    } else if (!before || support.some(v => !before.support.includes(v))) {
      previous.set(theme, { chapter: part.id, support });
    }
  }
  return { chapters, issues };
}
