import React, { type ReactNode, type ReactElement } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
const hooks = vi.hoisted(() => ({ slots: [] as unknown[], index: 0, effects: [] as (() => void | (() => void))[] }));
vi.mock("react", async original => ({ ...await original<typeof import("react")>(),
  useState: (initial: unknown) => { const i = hooks.index++; if (!(i in hooks.slots)) hooks.slots[i] = typeof initial === "function" ? initial() : initial; return [hooks.slots[i], (v: unknown) => { hooks.slots[i] = typeof v === "function" ? v(hooks.slots[i]) : v; }]; },
  useRef: (initial: unknown) => { const i = hooks.index++; if (!(i in hooks.slots)) hooks.slots[i] = { current: initial }; return hooks.slots[i]; },
  useEffect: (fn: () => void | (() => void)) => { hooks.effects.push(fn); },
}));
vi.mock("../../../src/lib/analytics/client", () => ({ interaction: vi.fn() }));
vi.mock("../../../src/components/growth/LaunchCountdown", () => ({ LaunchCountdown: () => null, useLaunchEvent: () => ({ view: null, remaining: null }) }));
import { BookShelf } from "../../../src/components/book/BookShelf";
import { BookReading } from "../../../src/components/book/BookReading";
import type { BookData } from "../../../src/app/dev/book-preview/bookTypes";
import { projectBookShare } from "../../../src/lib/book/shareModel";
import { moveReadingGesture, readingGestureDirection, type ReadingGesture } from "../../../src/components/book/readingGesture";
function nodes(n: ReactNode, predicate: (e: ReactElement<Record<string, unknown>>) => boolean): ReactElement<Record<string, unknown>>[] {
  if (Array.isArray(n)) return n.flatMap(v => nodes(v, predicate));
  if (!React.isValidElement<Record<string, unknown>>(n)) return [];
  return [...(predicate(n) ? [n] : []), ...nodes(n.props.children as ReactNode, predicate)];
}
function fire(tree: ReactNode, name: string, event: unknown) {
  const target = nodes(tree, e => typeof e.props[name] === "function" && e.type === "section")[0];
  (target.props[name] as (event: unknown) => void)(event);
}
let cleanups: (() => void)[];
let motion: EventTarget & { matches: boolean }, hover: EventTarget & { matches: boolean };
let selected: Selection | null;
beforeEach(() => {
  hooks.slots = []; cleanups = []; hooks.index = 0; selected = null; vi.useFakeTimers();
  motion = Object.assign(new EventTarget(), { matches: false }); hover = Object.assign(new EventTarget(), { matches: false });
  vi.stubGlobal("matchMedia", (query: string) => query.includes("reduced-motion") ? motion : hover);
  vi.stubGlobal("document", Object.assign(new EventTarget(), { hidden: false, documentElement: { clientWidth: 390 }, getElementById: () => null }));
  vi.stubGlobal("window", Object.assign(new EventTarget(), { getSelection: () => selected, visualViewport: { scale: 1 }, location: { assign: vi.fn() }, scrollY: 0, scrollTo: vi.fn() }));
});
afterEach(() => { cleanups.forEach(c => c()); vi.useRealTimers(); vi.unstubAllGlobals(); });
function renderShelf() { hooks.index = 0; hooks.effects = []; return BookShelf({ inputPath: "/reports/new", year: 2026 }); }
function mountShelf() { const tree = renderShelf(); cleanups = hooks.effects.map(f => f()).filter((v): v is () => void => typeof v === "function"); return tree; }
const centered = () => nodes(renderShelf(), e => e.props["data-center"] === true)[0].props["aria-label"];
const pointer = (x: number, y = 200, extra = {}) => ({ isPrimary: true, pointerType: "touch", pointerId: 3, clientX: x, clientY: y, timeStamp: 100, ...extra });
describe("actual BookShelf handlers and timer lifecycle", () => {
  it("starts on touch-only devices, cycles all six at 4500ms, and disposes on unmount", () => {
    mountShelf(); const titles = new Set<unknown>();
    for (let i = 0; i < 6; i++) { titles.add(centered()); vi.advanceTimersByTime(4499); expect(centered()).toBe([...titles].at(-1)); vi.advanceTimersByTime(1); }
    expect(titles.size).toBe(6); expect(centered()).toContain("나라는 사람");
    cleanups.forEach(c => c()); expect(vi.getTimerCount()).toBe(0); cleanups = [];
  });
  it("ignores synthetic mouse hover on touch devices; touch selection waits 8500ms", () => {
    const tree = mountShelf(); fire(tree, "onPointerEnter", pointer(260, 200, { pointerType: "mouse" }));
    vi.advanceTimersByTime(4500); expect(centered()).toContain("내가 잘되는 방식");
    const current = renderShelf(); fire(current, "onPointerDown", pointer(280)); fire(current, "onPointerUp", pointer(100));
    expect(centered()).toContain("내 사랑 이야기");
    vi.advanceTimersByTime(8499); expect(centered()).toContain("내 사랑 이야기"); vi.advanceTimersByTime(1); expect(centered()).toContain("우리라는 사이");
    const center = nodes(renderShelf(), e => e.props["data-center"] === true)[0]; (center.props.onClick as () => void)(); expect(window.location.assign).not.toHaveBeenCalled();
    const releaseClick = { detail: 1, preventDefault: vi.fn(), stopPropagation: vi.fn() };
    fire(renderShelf(), "onClickCapture", releaseClick); expect(releaseClick.preventDefault).toHaveBeenCalledOnce();
    const keyboardClick = { detail: 0, preventDefault: vi.fn(), stopPropagation: vi.fn() };
    fire(renderShelf(), "onClickCapture", keyboardClick); expect(keyboardClick.preventDefault).not.toHaveBeenCalled();
  });
  it("hover pauses only real fine pointers; visibility and media changes never duplicate timers", () => {
    hover.matches = true; const tree = mountShelf(); fire(tree, "onPointerEnter", pointer(260, 200, { pointerType: "mouse" }));
    expect(vi.getTimerCount()).toBe(0); Object.assign(document, { hidden: true }); document.dispatchEvent(new Event("visibilitychange"));
    Object.assign(document, { hidden: false }); document.dispatchEvent(new Event("visibilitychange")); expect(vi.getTimerCount()).toBe(1);
    motion.matches = true; motion.dispatchEvent(new Event("change")); expect(vi.getTimerCount()).toBe(0);
    motion.matches = false; motion.dispatchEvent(new Event("change")); motion.dispatchEvent(new Event("change")); expect(vi.getTimerCount()).toBe(1);
    fire(renderShelf(), "onPointerDown", pointer(260)); fire(renderShelf(), "onPointerCancel", {}); expect(vi.getTimerCount()).toBe(1);
  });
  it("vertical movement and wrong pointer IDs never select a book", () => {
    const tree = mountShelf(); fire(tree, "onPointerDown", pointer(260)); fire(tree, "onPointerMove", pointer(250, 250)); fire(tree, "onPointerUp", pointer(80, 260)); expect(centered()).toContain("나라는 사람");
    fire(tree, "onPointerDown", pointer(260)); fire(tree, "onPointerUp", pointer(80, 200, { pointerId: 9 })); expect(centered()).toContain("나라는 사람");
  });
});
const data: BookData = { bookId: "full", title: "검수 책", names: "가상 인물", people: [], context: [], share: { title: "책", description: "검수" }, readingDate: "2026-10-20", pages: [
  { id: "cover", kind: "cover", title: "표지", names: "가상 인물", headline: "시작" },
  { id: "chapter", kind: "narrative", title: "본문", paragraphs: [{ text: "선택해서 복사할 수 있는 본문", notes: [] }], notes: [] },
  { id: "back", kind: "back", title: "끝", finalLine: "마지막 문장" },
] };
const share = projectBookShare({ productType: "saju_mbti_full", names: "가상 인물", shareUrl: "https://gyeolreport.com/r/gr_" + "a".repeat(32), publishedAt: "2026-10-20T00:00:00Z", expiresAt: "2027-01-18T00:00:00Z" })!;
function renderReader() { hooks.index = 0; hooks.effects = []; return BookReading({ data, share }); }
function page() { return nodes(renderReader(), e => e.props["data-page-number"] !== undefined)[0].props["data-page-number"]; }
const textTarget = { closest: () => null, scrollWidth: 200, clientWidth: 200, parentElement: null } as unknown as Element;
function readPointer(x: number, y = 240, at = 100, extra = {}) { return pointer(x, y, { timeStamp: at, target: textTarget, currentTarget: textTarget, ...extra }); }
describe("actual BookReading pointer handlers", () => {
  it("text-area left/right, slow drag, page boundaries and transition guard keep the same URL", () => {
    let tree = renderReader(); fire(tree, "onPointerDown", readPointer(280)); fire(tree, "onPointerMove", readPointer(240, 240, 200)); fire(tree, "onPointerUp", readPointer(80, 240, 1000)); expect(page()).toBe(2);
    tree = renderReader(); fire(tree, "onPointerDown", readPointer(280)); fire(tree, "onPointerUp", readPointer(80)); expect(page()).toBe(2);
    vi.advanceTimersByTime(510); tree = renderReader(); fire(tree, "onPointerDown", readPointer(80)); fire(tree, "onPointerUp", readPointer(280)); expect(page()).toBe(1);
    vi.advanceTimersByTime(510); tree = renderReader(); fire(tree, "onPointerDown", readPointer(80)); fire(tree, "onPointerUp", readPointer(280)); expect(page()).toBe(1); expect(window.location.assign).not.toHaveBeenCalled();
  });
  it("edge navigation, multi-touch, controls, selection, scroll and cancel never turn", () => {
    const tree = renderReader();
    for (const extra of [{ clientX: 10 }, { isPrimary: false }, { target: { closest: () => ({}) } }]) { fire(tree, "onPointerDown", readPointer(280, 240, 100, extra)); fire(tree, "onPointerUp", readPointer(80)); expect(page()).toBe(1); }
    fire(tree, "onPointerDown", readPointer(280)); fire(tree, "onPointerUp", readPointer(80, 240, 200, { pointerId: 4 })); expect(page()).toBe(1);
    fire(tree, "onPointerDown", readPointer(280)); fire(tree, "onPointerCancel", {}); fire(tree, "onPointerUp", readPointer(80)); expect(page()).toBe(1);
    // P5: 문서 자체가 스크롤한다 — 창 스크롤이 손 떼기 전 제스처를 지운다.
    hooks.effects.forEach(f => f()); fire(tree, "onPointerDown", readPointer(280)); window.dispatchEvent(new Event("scroll")); fire(tree, "onPointerUp", readPointer(80)); expect(page()).toBe(1);
    selected = { isCollapsed: false, toString: () => "선택" } as Selection; fire(tree, "onPointerDown", readPointer(280)); fire(tree, "onPointerUp", readPointer(80)); expect(page()).toBe(1);
  });
  it("dragging an excluded control suppresses only its release click; a fresh tap still works", () => {
    const tree = renderReader(), control = { closest: () => ({}) } as unknown as Element;
    fire(tree, "onPointerDown", readPointer(280, 240, 100, { target: control }));
    fire(tree, "onPointerUp", readPointer(80, 240, 300, { target: control }));
    const click = { detail: 1, clientX: 80, clientY: 240, timeStamp: 301, preventDefault: vi.fn(), stopPropagation: vi.fn() };
    fire(tree, "onClickCapture", click); expect(click.preventDefault).toHaveBeenCalledOnce(); expect(page()).toBe(1);
    const tap = { ...click, timeStamp: 310, preventDefault: vi.fn(), stopPropagation: vi.fn() };
    fire(tree, "onClickCapture", tap); expect(tap.preventDefault).not.toHaveBeenCalled();
  });
  it("vertical-first and stationary long press cannot become a horizontal page turn", () => {
    for (const trajectory of [[[278, 300, 200], [80, 300, 300]], [[278, 240, 800], [80, 240, 900]]]) {
      const start: ReadingGesture = { x: 280, y: 240, startedAt: 100, intent: "pending" };
      for (const [x, y, t] of trajectory) moveReadingGesture(start, x, y, t);
      expect(readingGestureDirection(start, 80, 240, 1000, false)).toBe(0);
    }
  });
});
