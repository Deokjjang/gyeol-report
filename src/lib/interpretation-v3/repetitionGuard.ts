import { isComprehensiveV3Draft } from "./comprehensive";
import { isCareerV3Draft } from "./careerEditorial";
import { isLoveV3Draft } from "./loveEditorial";
import { isCompatibilityV3Draft } from "./compatibilityEditorial";
import { isMajorFortuneV3Draft } from "./majorFortuneEditorial";
import { isAnnualV3Draft } from "./annualEditorial";

import { narrativeSentences } from "./contentRevision";

/** Body only. Navigation, evidence chips and factual table labels intentionally
 * repeat for orientation and must not be counted as duplicated interpretation. */
export function narrativeParagraphs(draft: unknown): readonly string[] {
  if (isComprehensiveV3Draft(draft)) return [...draft.opening, ...draft.sections.flatMap(s => s.blocks)].flatMap(b => [...(b.paragraphs ?? [b.reading, b.why]), b.action]).concat(draft.patterns.flatMap(p => [p.why ?? "", p.repair]), draft.direction.split("\n\n")).filter(Boolean);
  if (isCareerV3Draft(draft) || isLoveV3Draft(draft) || isCompatibilityV3Draft(draft)) return draft.chapters.flatMap(c => c.scenes.flatMap(s => s.parts.map(p => p.text)));
  if (isMajorFortuneV3Draft(draft)) return [...draft.opening, ...(draft.horizon?.transitions ?? []).flatMap(t => t.paragraphs), ...draft.editorialSections.flatMap(s => s.paragraphs), ...draft.editorialYears.flatMap(y => y.paragraphs), ...draft.finale];
  if (isAnnualV3Draft(draft)) return [...draft.opening, ...draft.annualSections.flatMap(s => s.paragraphs), ...draft.editorialMonths.flatMap(m => [...m.paragraphs, ...m.segments.flatMap(s => s.paragraphs)]), ...draft.finale];
  return [];
}

export function auditNarrativeRepetition(paragraphs: readonly string[]) {
  const sentences = new Map<string, number>(), phrases = new Map<string, number>();
  for (const paragraph of paragraphs) for (const sentence of narrativeSentences(paragraph)) {
    sentences.set(sentence, (sentences.get(sentence) ?? 0) + 1);
    const words = sentence.split(/\s+/u);
    for (let length = 8; length <= 12; length++) for (let i = 0; i + length <= words.length; i++) {
      const key = words.slice(i, i + length).join(" ");
      phrases.set(key, (phrases.get(key) ?? 0) + 1);
    }
  }
  // Lexical scene-overlap alarm, not a semantic model or an automatic rewrite.
  // Manual review remains required for paraphrases with dissimilar vocabulary.
  const nearScenes: [number, number][] = [];
  const tokens = paragraphs.map(p => new Set(p.replace(/\d+|[.!?,‘’“”]/gu, "").split(/\s+/u).filter(w => w.length > 1)));
  for (let i = 0; i < tokens.length; i++) for (let j = i + 1; j < tokens.length; j++) {
    if (Math.min(tokens[i].size, tokens[j].size) < 15) continue;
    const intersection = [...tokens[i]].filter(t => tokens[j].has(t)).length;
    if (intersection / new Set([...tokens[i], ...tokens[j]]).size >= 0.8) nearScenes.push([i, j]);
  }
  return { exact: [...sentences].filter(([, n]) => n > 1), phrases: [...phrases].filter(([, n]) => n > 2), nearScenes };
}

export function repeatedFinalPunchlines(reports: readonly (readonly string[])[]): readonly string[] {
  const counts = new Map<string, number>();
  for (const report of reports) { const last = narrativeSentences(report.at(-1) ?? "").at(-1); if (last) counts.set(last, (counts.get(last) ?? 0) + 1); }
  return [...counts].filter(([, n]) => n > 1).map(([text]) => text);
}
