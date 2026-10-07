import type { BookPage } from "../../app/dev/book-preview/bookTypes";

/** Frozen generated headings only; no core, job inference or regeneration in a reader. */
export function careerRuleHeadings(pages: BookPage[], headings: readonly string[]): BookPage[] {
  return pages.map(page => page.kind === "narrative" && page.id === "chapter-direction"
    ? { ...page, paragraphs: page.paragraphs.map((p, i) => headings[i] ? { ...p, heading: headings[i] } : p) } : page);
}
