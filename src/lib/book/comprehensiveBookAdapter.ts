import type { BookPage } from "../../app/dev/book-preview/bookTypes";

/** Data-only adapter. The reader still consumes the existing BookPage union.
 * Rule headings stay attached to their complete paragraph; no character slicing. */
export function comprehensiveRuleHeadings(pages: BookPage[], units: readonly { chapter: string; headings: readonly string[] }[]): BookPage[] {
  return pages.map(page => {
    if (page.kind !== "narrative") return page;
    const unit = units.find(u => page.id === `chapter-${u.chapter}`);
    if (!unit) return page;
    return { ...page, paragraphs: page.paragraphs.map((p, i) => ({ ...p,
      ...(unit.headings[i] && (i > 0 || unit.headings[i] !== page.title) ? { heading: unit.headings[i] } : {}) })) };
  });
}
/** Preserve the six existing invitation labels. A sparse recovery unit points
 * to the actual closing manual instead of manufacturing a blank recovery page.
 * Each invitation has its own stable target even when two share one page. */
export function comprehensiveProductContents(pages: BookPage[]): BookPage[] {
  const groups = [
    ["나를 읽는 두 가지 결", ["core"]],
    ["내가 가진 힘과 좋은 패", ["chapter-strengths", "chapter-fortune"]],
    ["사람 사이에서, 사랑 안에서", ["chapter-relationships"]],
    ["일과 돈에 드러나는 나", ["chapter-work"]],
    ["나를 지치게 하는 습관", ["chapter-shadow", "chapter-direction"]],
    ["이런 나를 오래 잘 쓰는 법", ["chapter-direction"]],
  ] as const;
  const hasRecovery = pages.some(p => p.id === "chapter-shadow" || p.anchors?.includes("chapter-shadow"));
  return pages.map(page => {
    if (!hasRecovery && page.kind === "narrative" && (page.id === "chapter-direction" || page.anchors?.includes("chapter-direction"))) {
      return { ...page, anchors: [...(page.anchors ?? []), "recovery-manual"], paragraphs: page.paragraphs.map((p, i) => i === 0 && !p.anchorId ? { ...p, anchorId: "recovery-manual" } : p) };
    }
    if (page.kind !== "contents" || page.id !== "contents") return page;
    const detail = pages.find(p => p.kind === "contents" && p.id === "read-again");
    if (!detail || detail.kind !== "contents") return page;
    return { ...page, entries: groups.flatMap(([title, ids]) => {
      const entry = ids.flatMap(id => detail.entries.find(e => e.targetId === id) ?? [])[0];
      return entry ? [{ ...entry, title, ...(!hasRecovery && title === "나를 지치게 하는 습관" ? { targetId: "recovery-manual" } : {}) }] : [];
    }) };
  });
}
