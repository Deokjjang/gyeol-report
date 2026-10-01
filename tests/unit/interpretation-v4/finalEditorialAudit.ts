import { sentenceKey, sentences, narrativeText, reviewNarrative } from "../../../src/lib/interpretation-v4/editorialGuard";
import type { ComprehensiveNarrative } from "../../../src/lib/interpretation-v4/narrativeTypes";

export type AuditReport = { id: string; product: string; golden?: string; narrative: Omit<ComprehensiveNarrative, "version"> };
/** Deliberately excludes prose only. Freeze calculation, selection and every block's proof. */
export function editorialInvariant(packet: Record<string, unknown>, narrative: AuditReport["narrative"]) {
  const keys = ["evidence", "materials", "persons", "directions", "mbtiPairBasis", "selection", "studyBasis", "mbtiBasis", "behaviorBasis", "completeness"];
  return {
    source: Object.fromEntries(keys.filter(k => k in packet).map(k => [k, packet[k]])),
    proofs: [...narrative.opening, ...narrative.sections.flatMap(s => s.blocks)].map(b => ({ id: b.id, proof: b.proof })),
  };
}
/** Diagnostic candidates, not automatic quality verdicts. Never edits customer prose. */
export function auditEditorial(reports: readonly AuditReport[]) {
  const occurrences = new Map<string, { text: string; locations: string[]; products: string[] }>();
  const spans = new Map<string, Set<string>>();
  const diagnostics = reports.map(r => {
    const blocks = [...r.narrative.opening, ...r.narrative.sections.flatMap(s => s.blocks)];
    const all = [...blocks, { id: "final-line", text: r.narrative.finalLine }];
    for (const b of all) {
      for (const text of sentences(b.text)) {
        const key = sentenceKey(text), entry = occurrences.get(key) ?? { text, locations: [], products: [] };
        entry.locations.push(`${r.id}/${b.id}`); entry.products.push(r.product); occurrences.set(key, entry);
      }
      const words = b.text.split(/\s+/).map(sentenceKey);
      for (let i = 0; i <= words.length - 12; i++) {
        const key = words.slice(i, i + 12).join(" "), locations = spans.get(key) ?? new Set<string>();
        locations.add(`${r.id}/${b.id}`); spans.set(key, locations);
      }
    }
    const adjacent = blocks.slice(1).flatMap((b, i) => {
      const a = blocks[i], tokens = (s: string) => new Set(s.split(/\s+/).map(sentenceKey).filter(w => w.length > 2));
      const x = tokens(a.text), y = tokens(b.text), common = [...x].filter(w => y.has(w)).length;
      const ratio = common / Math.max(1, Math.min(x.size, y.size));
      return ratio >= 0.3 || (a.editorial?.theme && a.editorial.theme === b.editorial?.theme)
        ? [{ from: a.id, to: b.id, sharedTokens: common, ratio }] : [];
    });
    const text = narrativeText(r.narrative), counts = Object.fromEntries(["positive", "shadow", "direction", "observation"].map(tone => [tone, blocks.filter(b => b.tone === tone).reduce((n, b) => n + b.text.length, 0)]));
    return { id: r.id, product: r.product, length: text.length, issues: reviewNarrative(r.narrative), adjacent,
      counts, starts: Object.fromEntries(["당신은", "이 사람은", "올해는", "이 달은", "둘은", "한편", "그런데"].map(s => [s, sentences(text).filter(t => t.startsWith(s)).length])),
      scenes: blocks.filter(b => b.scene || b.editorial?.sceneFamily).map(b => ({ id: b.id, scene: b.editorial?.sceneFamily ?? b.scene })),
      finale: r.narrative.finalLine };
  });
  const exact = [...occurrences.values()].filter(v => v.locations.length > 1);
  const crossProduct = exact.filter(v => new Set(v.products).size > 1);
  // Group overlapping spans by location set, otherwise one copied paragraph creates dozens of candidates.
  const grouped = new Map<string, { phrase: string; locations: string[] }>();
  for (const [phrase, locs] of spans) if (locs.size > 1) {
    const locations = [...locs].sort(), key = locations.join("|");
    if (!grouped.has(key)) grouped.set(key, { phrase, locations });
  }
  return { diagnostics, exact, crossProduct, longSpans: [...grouped.values()],
    summary: { reports: reports.length, withinReportIssues: diagnostics.reduce((n, d) => n + d.issues.length, 0),
      repeatedSentences: exact.length, crossProductSentences: crossProduct.length, longSpanGroups: grouped.size } };
}
