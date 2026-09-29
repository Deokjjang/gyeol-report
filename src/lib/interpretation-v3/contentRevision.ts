/** Opt-in editorial revision. Missing markers replay the frozen stored copy. */
export const CONTENT_REVISION = "content-robustness-1" as const;
export function hasContentRevision(value: unknown): boolean {
  return !!value && typeof value === "object" && "contentRevision" in value && value.contentRevision === CONTENT_REVISION;
}
export function withContentRevision<T>(draft: T): T & { contentRevision: typeof CONTENT_REVISION } {
  return { ...draft, contentRevision: CONTENT_REVISION };
}

export const narrativeSentences = (text: string): string[] => (text.match(/[^.!?]+[.!?]+[”’]?|[^.!?]+$/gu) ?? []).map(s => s.replace(/\s+/gu, " ").trim()).filter(Boolean);
/** Per-report editorial selection; no paraphrasing or replacement evidence. */
export function sentenceSelection() {
  const seen = new Set<string>();
  return (paragraph: string): string => narrativeSentences(paragraph).filter(sentence => {
    if (seen.has(sentence)) return false;
    seen.add(sentence); return true;
  }).join(" ");
}
