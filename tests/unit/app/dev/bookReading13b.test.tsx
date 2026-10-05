import { renderToStaticMarkup } from "react-dom/server";
import { beforeAll, describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { RUNTIME_FIXTURES, SHADOW_CLOCK } from "../../interpretation-v4/runtimeFixtures";
import { generateV4ShadowReport } from "../../../../src/lib/interpretation-v4/runtimeShadow";
import { projectBook } from "../../../../src/app/dev/book-preview/bookProjection";
import { composeBookNavigation } from "../../../../src/app/dev/book-preview/bookNavigation";
import { BookReader } from "../../../../src/app/dev/book-preview/BookReader";
import { canStartReadingGesture, readingGestureDirection, hasReadingSelection } from "../../../../src/components/book/readingGesture";
import type { V4RuntimeEvidence } from "../../../../src/lib/interpretation-v4/runtimeProjection";
import type { BookData, BookPage } from "../../../../src/app/dev/book-preview/bookTypes";
const books = new Map<string, BookData>();
beforeAll(async () => {
  for (const f of RUNTIME_FIXTURES) {
    const r = await generateV4ShadowReport(f.payload, SHADOW_CLOCK); expect(r.ok).toBe(true); if (!r.ok) continue;
    books.set(f.id, projectBook(r.evidencePacket as V4RuntimeEvidence)!);
  }
});
describe("Phase13B stable chapter navigation and complete presentation", () => {
  it.each(RUNTIME_FIXTURES)("$id: front and end navigation share real targets and numbers", ({ id }) => {
    const b = books.get(id)!;
    expect(b.pages[1]).toMatchObject({ kind: "contents", title: "이 책에서 만나게 될 이야기" });
    expect(b.pages.at(-2)).toMatchObject({ kind: "contents", title: "다시 펼쳐보기" });
    const front = b.pages[1], end = b.pages.at(-2)!;
    if (front.kind !== "contents" || end.kind !== "contents") return;
    expect(end.entries.slice(1)).toEqual(front.entries);
    expect(new Set(front.entries.map(e => e.targetId)).size).toBe(front.entries.length);
    front.entries.forEach(e => expect(b.pages[e.page].anchors).toContain(e.targetId));
    expect(new Set(b.pages.map(p => p.id)).size).toBe(b.pages.length);
    for (const p of b.pages) if (p.kind === "narrative") {
      expect(p.paragraphs.length > 1 || (p.paragraphs[0]?.text.match(/[.!?。]/g)?.length ?? 0) >= 2).toBe(true);
      expect(p.notes.length).toBeLessThanOrEqual(2);
    }
    const appendix = b.pages.filter(p => p.kind === "appendix");
    expect(appendix.length).toBeLessThan(b.pages.filter(p => p.kind === "narrative").length);
    for (const p of appendix) {
      const hidden = p.items.filter(i => i.group === "지장간");
      expect(hidden.every(i => !i.meaning.includes("지지 안에 함께 담긴"))).toBe(true);
      const html = renderToStaticMarkup(<BookReader data={b} page={p} onPage={() => {}} onNote={() => {}} onShare={() => {}} />);
      expect(html.split("지장간은 지지 안에 담긴 천간입니다").length - 1).toBe(hidden.length ? 1 : 0);
      const stages = p.items.filter(i => i.group === "십이운성");
      if (stages.length && new Set(stages.map(i => i.meaning)).size === 1) {
        expect(html.split(stages[0].meaning).length - 1).toBe(1);
        stages.forEach(stage => expect(html).toContain(stage.name));
      }
    }
  });
  it("short chapters join without losing text, original heading, anchor or note numbering", () => {
    const input: BookPage[] = [
      { kind: "cover", title: "표지", names: "서윤", headline: "표지" },
      { kind: "narrative", id: "core", title: "처음", paragraphs: [{ text: "첫 문장. 둘째 문장.", notes: [1] }], notes: [{ name: "甲", text: "새로 시작하는 힘" }] },
      { kind: "narrative", id: "work", title: "일", paragraphs: [{ text: "일의 문장. 다른 장면.", notes: [1] }], notes: [{ name: "乙", text: "방향을 바꾸는 힘" }] },
      { kind: "back", title: "끝", finalLine: "끝 문장" },
    ];
    const original = JSON.stringify(input), pages = composeBookNavigation(input), narrative = pages.find(p => p.kind === "narrative")!;
    expect(JSON.stringify(input)).toBe(original);
    expect(narrative.paragraphs.map(p => p.text)).toEqual(["첫 문장. 둘째 문장.", "일의 문장. 다른 장면."]);
    expect(narrative.paragraphs[1]).toMatchObject({ heading: "일", anchorId: "work", notes: [2] });
    expect(narrative.anchors).toEqual(["core", "work"]);
    const toc = pages[1]; if (toc.kind !== "contents") return;
    expect(toc.entries.map(e => e.targetId)).toEqual(["core", "work"]);
    expect(toc.entries[0].page).toBe(toc.entries[1].page);
  });
  it("old scoreless / no-ID Book data remains renderable", () => {
    const b = books.get("comprehensive")!;
    const old: BookPage = { kind: "narrative", title: "저장된 장", paragraphs: [{ text: "저장된 본문입니다.", notes: [] }], notes: [] };
    expect(renderToStaticMarkup(<BookReader data={b} page={old} onPage={() => {}} onNote={() => {}} onShare={() => {}} />)).toContain("저장된 본문입니다.");
  });
});
describe("Text selection owns text; only deliberate empty-margin movement turns", () => {
  const start = { x: 260, y: 240, startedAt: 100 };
  it.each([[100, 240, 250, false, 1], [360, 245, 250, false, -1], [120, 350, 250, false, 0], [250, 500, 250, false, 0], [100, 240, 700, false, 0], [100, 240, 250, true, 0], [215, 240, 250, false, 0]] as const)("move %i/%i at %i; selected=%s → %i", (x, y, t, selected, expected) => {
    expect(readingGestureDirection(start, x, y, t, selected)).toBe(expected);
  });
  it("paragraphs, controls and existing selections never begin swipe", () => {
    const text = { closest: (selector: string) => selector.includes("p,") ? {} : null } as Element;
    const margin = { closest: () => null } as unknown as Element;
    expect(canStartReadingGesture(text, false)).toBe(false);
    expect(canStartReadingGesture(margin, true)).toBe(false);
    expect(canStartReadingGesture(margin, false)).toBe(true);
    expect(hasReadingSelection({ isCollapsed: false, toString: () => "선택한 문장" } as Selection)).toBe(true);
    expect(hasReadingSelection(null)).toBe(false);
  });
});
