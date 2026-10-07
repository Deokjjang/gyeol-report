import type { ComprehensiveManuscriptDraft, RenderedComprehensiveSection } from "./comprehensiveManuscriptCore";
import { humanDescriptiveness } from "./narrativeValidator";

/** Supplementary role audit. The legacy block-count score is intentionally retained for comparison. */
export function positiveRewardDepth(section: RenderedComprehensiveSection) {
  const rows = section.blocks.map(block => {
    const meaning = block.sentences.some(s => ["DIRECT_CLAIM", "GOOD_RESULT", "FUSION"].includes(s.role) && s.evidenceIds.length > 0);
    const why = block.sentences.some(s => s.role === "MYEONGLI_REASON" && s.evidenceIds.length > 0);
    const value = block.sentences.some(s => ["CLOSER", "LIFE_SCENE"].includes(s.role) && s.evidenceIds.length > 0 && s.text.length >= 18
      && !/강점이 있습니다|근거가 있습니다|보조합니다|힘을 보탭니다/.test(s.text));
    return { blockId: block.id, meaning, why, value, score: Number(meaning) * 30 + Number(why) * 30 + Number(value) * 40 };
  });
  return { rows, score: rows.length ? Math.round(rows.reduce((n, r) => n + r.score, 0) / rows.length) : 0 };
}

export function auditManuscriptQuality(draft: ComprehensiveManuscriptDraft) {
  const sections = Object.values(draft.sections);
  const sentences = sections.flatMap(s => s.blocks.flatMap(b => b.sentences));
  const occurrences = (pattern: RegExp) => sentences.filter(s => pattern.test(s.text)).map(s => ({ id: s.id, text: s.text }));
  const count = (text: string) => draft.fullText.split(text).length - 1;
  return {
    meta: { auxiliary: count("보조합니다"), contributes: count("힘을 보탭니다"), strengthLabel: count("강점이 있습니다"), evidenceLabel: count("근거가 있습니다"), asReading: count("로 봅니다") },
    technicalMbti: occurrences(/\b(?:Fe|Fi|Te|Ti|Ne|Ni|Se|Si)\b/i),
    longTitles: sections.filter(s => s.title.length > 40).map(s => ({ section: s.sectionId, title: s.title, length: s.title.length })),
    lowHumanSentences: sentences.filter(s => ["DIRECT_CLAIM", "GOOD_RESULT", "CONTRAST", "FUSION", "ACTION"].includes(s.role))
      .map(s => ({ id: s.id, role: s.role, text: s.text, score: humanDescriptiveness(s.text, true) })).filter(s => s.score < 85),
    positiveReward: { C4: positiveRewardDepth(draft.sections.C4), C5: positiveRewardDepth(draft.sections.C5), legacyBlockCount: draft.validation.scores.PositiveReward },
    operatingRules: { eligible: draft.debug.operatingRules?.eligible.length ?? 0, rendered: draft.sections.C10.operatingRules?.length ?? 0,
      types: draft.sections.C10.operatingRules?.map(r => r.source?.mergedSourceTypes ?? []) ?? [] },
    meaningSuppressions: draft.diagnostics.suppressed.filter(s => s.reasons.includes("SEMANTIC_SAME_ROLE")),
  };
}
