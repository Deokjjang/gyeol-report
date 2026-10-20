import type { BookPage } from "../../app/dev/book-preview/bookTypes";
import type { CareerReleaseDraft } from "../interpretation-v4/careerReleaseContracts";

export function careerReaderHeadings(pages: BookPage[], edition: CareerReleaseDraft): BookPage[] {
  return pages.map(page => {
    if (page.kind !== "narrative") return page;
    const chapter = edition.chapters.find(c => page.id === (c.key === "core" ? "core" : `chapter-${c.key}`));
    return chapter ? { ...page, ...(chapter.key === "core" ? { title: chapter.title } : {}), paragraphs: page.paragraphs.map((p, i) => ({ ...p,
      ...(chapter.paragraphs[i] ? { heading: chapter.paragraphs[i].purpose } : {}) })) } : page;
  });
}
export function careerReaderContents(pages: BookPage[], edition: CareerReleaseDraft): BookPage[] {
  const entries = edition.chapters.flatMap(c => {
    const targetId = c.key === "core" ? "core" : `chapter-${c.key}`;
    const page = pages.findIndex(p => p.id === targetId || p.anchors?.includes(targetId));
    return page >= 0 ? [{ title: c.title, targetId, page }] : [];
  });
  return pages.map(p => p.kind === "contents" && p.id === "contents" ? { ...p, entries } : p);
}

/** Frozen generated headings only; no core, job inference or regeneration in a reader. */
export function careerRuleHeadings(pages: BookPage[], headings: readonly string[]): BookPage[] {
  return pages.map(page => page.kind === "narrative" && page.id === "chapter-direction"
    ? { ...page, paragraphs: page.paragraphs.map((p, i) => headings[i] ? { ...p, heading: headings[i] } : p) } : page);
}
