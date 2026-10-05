import type { BookPage } from "./bookTypes";

/** Page numbers are derived after composition. Stable section IDs remain valid
 * if an adjacent short chapter is joined; no narrative sentence is deleted. */
export function composeBookNavigation(input: BookPage[]): BookPage[] {
  let appendix = 0;
  const original = input.map(p => { const id = p.id ?? `${p.kind}${"person" in p ? `-${p.person}` : p.kind === "appendix" ? `-${++appendix}` : ""}`;
    return { ...p, id, anchors: p.anchors ?? [id] }; });
  const grouped: BookPage[] = [];
  for (const p of original) {
    const previous = grouped.at(-1);
    const short = previous?.kind === "narrative" && (previous.paragraphs.reduce((n, v) => n + v.text.length, 0) < 260 || (p.kind === "narrative" && p.paragraphs.reduce((n, v) => n + v.text.length, 0) < 260));
    if (short && p.kind === "narrative" && previous.notes.length + p.notes.length <= 2) {
      const offset = previous.notes.length;
      previous.paragraphs = [...previous.paragraphs, ...p.paragraphs.map((v, i) => ({ ...v, ...(i === 0 ? { heading: p.title, anchorId: p.id } : {}), notes: v.notes.map(n => n + offset) }))];
      previous.notes = [...previous.notes, ...p.notes];
      previous.anchors = [...previous.anchors!, ...p.anchors];
    } else grouped.push(p);
  }
  // Joining two chapters can make a formerly useful definition redundant.
  // Keep every body sentence, remove only duplicate explanatory footnotes and
  // remap their superscripts against the final page, not the original sections.
  for (const page of grouped) if (page.kind === "narrative") {
    const retained = page.notes.map((note, i) => ({ note, old: i + 1 }))
      .filter(({ note }) => !page.paragraphs.some(p => p.text.includes(note.text)));
    const numbers = new Map(retained.map((n, i) => [n.old, i + 1]));
    page.notes = retained.map(n => n.note);
    page.paragraphs = page.paragraphs.map(p => ({ ...p, notes: p.notes.flatMap(n => numbers.has(n) ? [numbers.get(n)!] : []) }));
  }
  const front: BookPage = { kind: "contents", id: "contents", title: "이 책에서 만나게 될 이야기", entries: [] };
  const again: BookPage = { kind: "contents", id: "read-again", title: "다시 펼쳐보기", entries: [] };
  const pages: BookPage[] = [grouped[0], front, ...grouped.slice(1, -1), again, grouped.at(-1)!];
  const index = new Map(pages.flatMap((p, i) => [p.id!, ...(p.anchors ?? [])].map(id => [id, i] as const)));
  const relocate = (old: number) => index.get(original[old]?.id) ?? 0;
  for (const page of pages) {
    if (page.kind === "timeline") { page.years = page.years.map(y => ({ ...y, page: relocate(y.page) })); page.transitions = page.transitions.map(t => ({ ...t, page: relocate(t.page) })); }
    if (page.kind === "months") page.months = page.months.map(m => ({ ...m, page: relocate(m.page) }));
    if (page.kind === "pair") page.directions = page.directions.map(d => ({ ...d, page: relocate(d.page) }));
  }
  const entries = original.flatMap(p => ["cover", "contents", "back"].includes(p.kind) ? [] : [{ title: p.title.replaceAll("\n", " · "), targetId: p.id!, page: index.get(p.id!)! }]);
  front.entries = entries;
  again.entries = [{ title: "처음으로", targetId: pages[0].id!, page: 0 }, ...entries];
  return pages;
}
