import { GYEOL_KOREAN_NARRATIVE_CORE_VERSION, type NarrativeRequest } from "./narrativeCore";

/** FNV-1a over UTF-16 code units; editorial selection only, not a security hash. */
export function narrativeHash(text: string): number {
  let hash = 2166136261;
  for (let i = 0; i < text.length; i++) hash = Math.imul(hash ^ text.charCodeAt(i), 16777619);
  return hash >>> 0;
}
export function narrativeSeed(request: NarrativeRequest, role: string, occurrence = 0): string {
  return JSON.stringify([request.reportStableKey, request.engineVersion ?? GYEOL_KOREAN_NARRATIVE_CORE_VERSION,
    request.sectionId, request.source.id, role, request.occurrenceIndex ?? 0, occurrence]);
}
export function stableVariants<T>(items: readonly T[], seed: string): T[] {
  if (!items.length) return [];
  const start = narrativeHash(seed) % items.length;
  return [...items.slice(start), ...items.slice(0, start)];
}
export function normalizeNarrativeText(text: string): string {
  return text.normalize("NFC").replace(/\r\n?/g, "\n").replace(/\s+/g, " ")
    .replace(/\s+([.,?])/g, "$1").replace(/\.{2,}/g, ".").trim();
}
/** Spaces and punctuation excluded; no truncation, UTF-16 Hangul code points. */
export function sentenceLength(text: string): number { return [...text.replace(/[\p{P}\p{Z}\s]/gu, "")].length; }
export function sentenceLengthClass(text: string): "S" | "M" | "L" {
  const n = sentenceLength(text); return n <= 18 ? "S" : n <= 40 ? "M" : "L";
}
