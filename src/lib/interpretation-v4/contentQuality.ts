import { sentences, sentenceKey } from "./editorialGuard";
import type { NarrativeBlock, NarrativeSection } from "./narrativeTypes";

export const SEMANTIC_FAMILIES = {
  inquiry: /이유를 (?:찾|묻)|깊게 파|납득|다시 생각|혼자 정리|오래 (?:생각|붙들)/,
  reusedExperience: /해본 것을 다음 선택|경험을.*다시 쓰|다음 선택에.*감각/,
  authority: /책임.*권한|결정권|판단.*맡/,
  precision: /오류|빈틈|틀린.*(?:찾|고치)/,
  care: /먼저 챙|필요한 것.*기억|말하지 않은/,
} as const;

/** Read-only diagnostics. Never shortens/rewords output to make a gate green.
 * Human review owns meaning/coherence; these counters expose where to read. */
export function auditContent(report: { opening: readonly NarrativeBlock[]; sections: readonly NarrativeSection[] }) {
  const chapters = [{ id: "core", blocks: report.opening }, ...report.sections];
  const rootChapters = new Map<string, Set<string>>(), traitChapters = new Map<string, Set<string>>();
  const endingRuns: { chapter: string; count: number }[] = [];
  const metaphors = new Map<string, number>(), advice = new Map<string, number>();
  const semantic = new Map<string, { sentences: number; chapters: Set<string> }>();
  const hedgeChapters: { chapter: string; count: number }[] = [];
  for (const chapter of chapters) {
    let formal = 0;
    let hedges = 0;
    for (const block of chapter.blocks) {
      for (const feature of block.proof.features) {
        const set = rootChapters.get(feature) ?? new Set<string>(); set.add(chapter.id); rootChapters.set(feature, set);
      }
      for (const source of block.proof.sourceRefs.filter(r => r.includes(":traits:") && (r.startsWith("mbti:") || r.startsWith("docs/product/mbti/source/")))) {
        const key = source.replace(/^docs\/product\/mbti\/source\/([A-Z]+)\.json:/, "mbti:$1:");
        const set = traitChapters.get(key) ?? new Set<string>(); set.add(chapter.id); traitChapters.set(key, set);
      }
      for (const sentence of sentences(block.text)) {
        for (const [family, pattern] of Object.entries(SEMANTIC_FAMILIES)) if (pattern.test(sentence)) {
          const use = semantic.get(family) ?? { sentences: 0, chapters: new Set<string>() };
          use.sentences++; use.chapters.add(chapter.id); semantic.set(family, use);
        }
        if (/살펴볼 만|여지가 있|떠올려볼 수|기대할 만|생각해볼 수/.test(sentence)) hedges++;
        formal = /(?:습니다|입니다)\.$/.test(sentence) ? formal + 1 : 0;
        if (formal === 3) endingRuns.push({ chapter: chapter.id, count: formal });
        if (/이미지|빗대|모습에 가까/.test(sentence)) { const key = sentenceKey(sentence); metaphors.set(key, (metaphors.get(key) ?? 0) + 1); }
        if (/하세요|해보세요|확인하세요|나눠보세요/.test(sentence)) { const key = sentenceKey(sentence); advice.set(key, (advice.get(key) ?? 0) + 1); }
      }
    }
    if (hedges > 1) hedgeChapters.push({ chapter: chapter.id, count: hedges });
  }
  return {
    chapterCount: chapters.length, evidenceDiversity: rootChapters.size, mbtiTraitDiversity: traitChapters.size,
    evidenceUse: [...rootChapters].map(([feature, used]) => ({ feature, chapters: [...used] })),
    traitUse: [...traitChapters].map(([trait, used]) => ({ trait, chapters: [...used] })),
    endingRuns, repeatedMetaphors: [...metaphors].filter(([, n]) => n > 1), repeatedAdvice: [...advice].filter(([, n]) => n > 1),
    semanticUse: [...semantic].map(([family, use]) => ({ family, sentences: use.sentences, chapters: [...use.chapters] })),
    semanticReview: [...semantic].filter(([, use]) => use.chapters.size > Math.max(3, chapters.length / 2)).map(([family]) => family),
    hedgeChapters,
    thinChapters: chapters.filter(c => c.blocks.reduce((n, b) => n + sentences(b.text).length, 0) < 4).map(c => c.id),
    explicitMbtiChapters: chapters.filter(c => c.blocks.some(b => /\b[EI][NS][TF][JP]\b|MBTI/.test(b.text))).map(c => c.id),
    synthesisChapters: chapters.filter(c => c.blocks.some(b => b.proof.sourceRefs.some(r => r.startsWith("content-synthesis:")))).map(c => c.id),
  };
}
