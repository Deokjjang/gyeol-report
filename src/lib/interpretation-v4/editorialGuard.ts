import type { ComprehensiveNarrative, EditorialIssue } from "./narrativeTypes";

export const sentences = (text: string) => text.match(/[^.!?。]+[.!?。]+|[^.!?。]+$/g)?.map(s => s.trim()).filter(Boolean) ?? [];
export const sentenceKey = (text: string) => text.replace(/[\s\p{P}\p{S}]/gu, "");
export function narrativeText(report: ComprehensiveNarrative): string {
  return [report.headline, ...report.opening.map(b => b.text), ...report.sections.flatMap(s => [s.title, ...s.blocks.map(b => b.text)]), report.finalLine].join("\n\n");
}
/** Report-only QA: never delete a conflicting sentence silently to earn PASS. */
export function reviewNarrative(report: ComprehensiveNarrative): readonly EditorialIssue[] {
  const issues: EditorialIssue[] = [], seen = new Map<string, string>(), sceneIds = new Set<string>();
  const blocks = [...report.opening, ...report.sections.flatMap(s => s.blocks)];
  const families = new Map<string, string>(), themes = new Map<string, number>();
  for (const block of blocks) {
    const family = block.editorial?.sceneFamily, theme = block.editorial?.theme;
    if (family && families.has(family)) issues.push({ severity: "Minor", code: "SAME_SCENE_FAMILY", location: `${families.get(family)} / ${block.id}` });
    if (family) families.set(family, block.id);
    if (theme) themes.set(theme, (themes.get(theme) ?? 0) + 1);
  }
  for (const [theme, count] of themes) if (count > 2) issues.push({ severity: "Minor", code: "NEAR_SEMANTIC_REPETITION", location: theme });
  const positiveSection = report.sections.find(s => s.id === "fortune");
  if (positiveSection && positiveSection.blocks.flatMap(b => sentences(b.text)).length < 3)
    issues.push({ severity: "Minor", code: "WEAK_POSITIVE_SECTION", location: "fortune" });
  const text = narrativeText(report);
  for (const b of [...blocks, { id: "final", text: report.finalLine, scene: undefined }]) {
    for (const sentence of sentences(b.text)) {
      const key = sentenceKey(sentence);
      if (seen.has(key)) issues.push({ severity: "Major", code: "DUPLICATE_SENTENCE", location: `${seen.get(key)} / ${b.id}` });
      seen.set(key, b.id);
    }
    if (b.scene && sceneIds.has(b.scene)) issues.push({ severity: "Major", code: "REUSED_SCENE", location: b.id });
    if (b.scene) sceneIds.add(b.scene);
  }
  if (/KPI|최적화|내적 자원|구조적으로|메타인지|명리와 MBTI를 결합하면|두 체계가|원국 근거를 읽|이번 리포트에서는/.test(text))
    issues.push({ severity: "Major", code: "TECHNICAL_OR_META_COPY", location: "text" });
  if (/v4_structure:|ten_god_|sinsal_|gwiin_|day_pillar_|sourceRefs|confirmed\/calculated/.test(text))
    issues.push({ severity: "Blocker", code: "INTERNAL_SOURCE_EXPOSED", location: "text" });
  if (/수익.{0,10}보장|반드시.{0,8}(합격|성공|결혼)|\d{4}년.{0,8}결혼|(?:암|질병|죽음|사고)가 (?:옵니다|납니다|생깁니다)/.test(text))
    issues.push({ severity: "Blocker", code: "UNSUPPORTED_GUARANTEE", location: "text" });
  if ((text.match(/가능성이 있습니다|일 수도 있습니다/g) ?? []).length > 2)
    issues.push({ severity: "Major", code: "EXCESSIVE_HEDGE", location: "text" });
  const prose = blocks.filter(b => b.mode === "prose").length / Math.max(1, blocks.length);
  if (prose < 0.7) issues.push({ severity: "Major", code: "SEED_CARD_RHYTHM", location: "text" });
  const positive = blocks.filter(b => b.tone === "positive").reduce((n, b) => n + b.text.length, 0);
  const shadow = blocks.filter(b => b.tone === "shadow").reduce((n, b) => n + b.text.length, 0);
  if (positive <= shadow * 2) issues.push({ severity: "Major", code: "SHADOW_DOMINATES", location: "text" });
  if (blocks.filter(b => b.mode === "question").length > 5) issues.push({ severity: "Minor", code: "TOO_MANY_QUESTIONS", location: "text" });
  // Long verbatim phrases across paragraphs: exclude ordinary Korean endings.
  const phrases = new Map<string, string>();
  for (const b of blocks) {
    const normalized = sentenceKey(b.text);
    for (let i = 0; i <= normalized.length - 36; i++) {
      const phrase = normalized.slice(i, i + 36), previous = phrases.get(phrase);
      if (previous && previous !== b.id) { issues.push({ severity: "Major", code: "REPEATED_LONG_PHRASE", location: `${previous} / ${b.id}` }); break; }
      phrases.set(phrase, b.id);
    }
  }
  return issues;
}

/** Cohort QA is read-only and separate from generation. No names/punctuation exemption. */
export function reviewNarrativeCohort(reports: readonly { id: string; narrative: ComprehensiveNarrative }[]) {
  const exact = new Map<string, string>(), spans = new Map<string, string>();
  const headlines = new Set<string>(), endings = new Set<string>();
  const issues: EditorialIssue[] = [];
  for (const { id, narrative } of reports) {
    for (const [text, seen, code] of [[narrative.headline, headlines, "COHORT_HEADLINE"], [narrative.finalLine, endings, "COHORT_FINAL_LINE"]] as const) {
      const key = sentenceKey(text);
      if (seen.has(key)) issues.push({ severity: "Major", code, location: id });
      seen.add(key);
    }
    const blocks = [...narrative.opening, ...narrative.sections.flatMap(s => s.blocks), { id: "final", text: narrative.finalLine }];
    for (const block of blocks) {
      const location = `${id}/${block.id}`;
      for (const sentence of sentences(block.text)) {
        const key = sentenceKey(sentence), prior = exact.get(key);
        if (prior && !prior.startsWith(`${id}/`)) issues.push({ severity: "Major", code: "COHORT_EXACT_SENTENCE", location: `${prior} / ${location}` });
        else exact.set(key, location);
      }
      const words = block.text.split(/\s+/).map(sentenceKey).filter(Boolean);
      for (let i = 0; i <= words.length - 12; i++) {
        const key = words.slice(i, i + 12).join(" "), prior = spans.get(key);
        if (prior && !prior.startsWith(`${id}/`)) {
          issues.push({ severity: "Minor", code: "COHORT_LONG_SPAN", location: `${prior} / ${location}` }); break;
        }
        spans.set(key, location);
      }
    }
  }
  return issues;
}
