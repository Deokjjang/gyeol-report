import { sentences, sentenceKey } from "./editorialGuard";
import type { NarrativeBlock, NarrativeSection } from "./narrativeTypes";

/** Read-only diagnostics. Never shortens/rewords output to make a gate green.
 * Human review owns meaning/coherence; these counters expose where to read. */
export function auditContent(report: { opening: readonly NarrativeBlock[]; sections: readonly NarrativeSection[] }) {
  const chapters = [{ id: "core", blocks: report.opening }, ...report.sections];
  const rootChapters = new Map<string, Set<string>>(), traitChapters = new Map<string, Set<string>>();
  const endingRuns: { chapter: string; count: number }[] = [];
  const metaphors = new Map<string, number>(), advice = new Map<string, number>();
  for (const chapter of chapters) {
    let formal = 0;
    for (const block of chapter.blocks) {
      for (const feature of block.proof.features) {
        const set = rootChapters.get(feature) ?? new Set<string>(); set.add(chapter.id); rootChapters.set(feature, set);
      }
      for (const source of block.proof.sourceRefs.filter(r => r.includes(":traits:") && (r.startsWith("mbti:") || r.startsWith("docs/product/mbti/source/")))) {
        const key = source.replace(/^docs\/product\/mbti\/source\/([A-Z]+)\.json:/, "mbti:$1:");
        const set = traitChapters.get(key) ?? new Set<string>(); set.add(chapter.id); traitChapters.set(key, set);
      }
      for (const sentence of sentences(block.text)) {
        formal = /(?:습니다|입니다)\.$/.test(sentence) ? formal + 1 : 0;
        if (formal === 3) endingRuns.push({ chapter: chapter.id, count: formal });
        if (/이미지|빗대|모습에 가까/.test(sentence)) { const key = sentenceKey(sentence); metaphors.set(key, (metaphors.get(key) ?? 0) + 1); }
        if (/하세요|해보세요|확인하세요|나눠보세요/.test(sentence)) { const key = sentenceKey(sentence); advice.set(key, (advice.get(key) ?? 0) + 1); }
      }
    }
  }
  return {
    chapterCount: chapters.length, evidenceDiversity: rootChapters.size, mbtiTraitDiversity: traitChapters.size,
    evidenceUse: [...rootChapters].map(([feature, used]) => ({ feature, chapters: [...used] })),
    traitUse: [...traitChapters].map(([trait, used]) => ({ trait, chapters: [...used] })),
    endingRuns, repeatedMetaphors: [...metaphors].filter(([, n]) => n > 1), repeatedAdvice: [...advice].filter(([, n]) => n > 1),
    thinChapters: chapters.filter(c => c.blocks.reduce((n, b) => n + sentences(b.text).length, 0) < 4).map(c => c.id),
    explicitMbtiChapters: chapters.filter(c => c.blocks.some(b => /\b[EI][NS][TF][JP]\b|MBTI/.test(b.text))).map(c => c.id),
    synthesisChapters: chapters.filter(c => c.blocks.some(b => b.proof.sourceRefs.some(r => r.startsWith("content-synthesis:")))).map(c => c.id),
  };
}
