import type { BookPage } from "../../app/dev/book-preview/bookTypes";
import type { PairReleaseDraft } from "../interpretation-v4/compatibilityReleaseContracts";
/** Saved reader metadata only; no recalculation or additional reader requests. */
export function compatibilityReaderPages(pages: BookPage[], edition: PairReleaseDraft): BookPage[] {
  return pages.map(p => {
    if (p.kind !== "narrative") return p;
    const c = edition.chapters.find(c => p.id === (c.key === "core" ? "core" : `chapter-${c.key}`));
    if (!c) return p;
    const paragraphs = p.paragraphs.map((paragraph, i) => ({ ...paragraph, ...(c.paragraphs[i] ? {
      heading: c.paragraphs[i].purpose, anchorId: `pair-${c.paragraphs[i].id.toLowerCase().replace(".", "-")}`,
    } : {}) }));
    return { ...p, title: c.title, paragraphs, anchors: [...new Set([p.id!, ...(p.anchors ?? []), ...paragraphs.flatMap(p => p.anchorId ?? [])])] };
  });
}
export function compatibilityReaderContents(pages: BookPage[], edition: PairReleaseDraft): BookPage[] {
  const entries = edition.chapters.flatMap(c => {
    const targetId = c.key === "core" ? "core" : `chapter-${c.key}`, page = pages.findIndex(p => p.id === targetId || p.anchors?.includes(targetId));
    return page >= 0 ? [{ title: c.title, targetId, page }] : [];
  });
  return pages.map(p => {
    if (p.kind !== "contents") return p;
    if (p.id === "contents") return { ...p, entries };
    if (p.id !== "read-again") return p;
    return { ...p, entries: p.entries.flatMap(entry => {
      const c = entries.find(c => c.targetId === entry.targetId), page = pages[entry.page];
      return c && page.kind === "narrative" ? [c, ...page.paragraphs.flatMap(p => p.heading && p.anchorId ? [{ title: p.heading, targetId: p.anchorId, page: entry.page }] : [])] : [entry];
    }) };
  });
}
