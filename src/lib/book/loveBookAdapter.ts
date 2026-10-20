import type { BookPage } from "../../app/dev/book-preview/bookTypes";
import type { LoveReleaseDraft } from "../interpretation-v4/loveReleaseContracts";
/** Saved metadata only. Never rerun an editor, core or relationship inference. */
export function loveReaderPages(pages: BookPage[], edition: LoveReleaseDraft): BookPage[] {
  const fortune = pages.find(p => p.id === "chapter-fortune"), direction = pages.find(p => p.id === "chapter-direction");
  const combined = fortune?.kind === "narrative" && direction?.kind === "narrative" ? { ...direction,
    paragraphs: [...fortune.paragraphs, ...direction.paragraphs.map(p => ({ ...p, notes: p.notes.map(n => n + fortune.notes.length) }))],
    notes: [...fortune.notes, ...direction.notes], anchors: [...new Set(["chapter-direction", "chapter-fortune", ...(fortune.anchors ?? []), ...(direction.anchors ?? [])])] } : direction;
  return pages.filter(p => p.id !== "chapter-fortune").map(page => {
    const p = page.id === "chapter-direction" && combined ? combined : page;
    if (p.kind !== "narrative") return p;
    const c = edition.chapters.find(c => p.id === (c.key === "core" ? "core" : `chapter-${c.key}`));
    if (!c) return p;
    const paragraphs = p.paragraphs.map((paragraph, i) => ({ ...paragraph, ...(c.paragraphs[i] ? {
      heading: c.paragraphs[i].purpose, anchorId: `love-${c.paragraphs[i].id.toLowerCase().replace(".", "-")}`,
    } : {}) }));
    return { ...p, title: c.title, paragraphs, anchors: [...new Set([p.id!, ...(p.anchors ?? []), ...paragraphs.flatMap(p => p.anchorId ?? [])])] };
  });
}
export function loveReaderContents(pages: BookPage[], edition: LoveReleaseDraft): BookPage[] {
  const entries = edition.chapters.flatMap(c => {
    const targetId = c.key === "core" ? "core" : `chapter-${c.key}`, page = pages.findIndex(p => p.id === targetId || p.anchors?.includes(targetId));
    return page >= 0 ? [{ title: c.title, targetId, page }] : [];
  });
  return pages.map(p => {
    if (p.kind !== "contents") return p;
    if (p.id === "contents") return { ...p, entries };
    if (p.id !== "read-again") return p;
    return { ...p, entries: p.entries.flatMap(entry => {
      const chapter = entries.find(c => c.targetId === entry.targetId), page = pages[entry.page];
      return chapter && page.kind === "narrative" ? [chapter, ...page.paragraphs.flatMap(paragraph => paragraph.heading && paragraph.anchorId
        ? [{ title: paragraph.heading, targetId: paragraph.anchorId, page: entry.page }] : [])] : [entry];
    }) };
  });
}
