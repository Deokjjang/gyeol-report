import React, { type ReactNode, type ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
const hooks = vi.hoisted(() => ({ slots: [] as unknown[], index: 0, effects: [] as (() => void | (() => void))[] }));
const browser = vi.hoisted(() => ({ copy: vi.fn(), event: vi.fn() }));
vi.mock("react", async original => ({ ...await original<typeof import("react")>(),
  useState: (initial: unknown) => { const i = hooks.index++; if (!(i in hooks.slots)) hooks.slots[i] = initial; return [hooks.slots[i], (v: unknown) => { hooks.slots[i] = typeof v === "function" ? v(hooks.slots[i]) : v; }]; },
  useRef: (initial: unknown) => { const i = hooks.index++; if (!(i in hooks.slots)) hooks.slots[i] = { current: initial }; return hooks.slots[i]; },
  useEffect: (fn: () => void | (() => void)) => { hooks.effects.push(fn); },
}));
vi.mock("../../../src/components/growth/LaunchCountdown", () => ({ useLaunchEvent: () => ({ view: null, remaining: null }) }));
vi.mock("../../../src/lib/book/shareEvents", () => ({ bookShareEvent: browser.event }));
vi.mock("../../../src/lib/sharing/shareBrowser", async original => ({ ...await original<typeof import("../../../src/lib/sharing/shareBrowser")>(), copyShareLink: browser.copy }));
import { BookShareActions } from "../../../src/components/book/BookShareActions";
import { BookEventNotice } from "../../../src/components/book/BookEventNotice";
import { BookPublishingVisual } from "../../../src/components/report/BookPublishingVisual";
import ReportLoading from "../../../src/app/reports/[reportId]/loading";
import { projectBookShare } from "../../../src/lib/book/shareModel";
import { LAUNCH_START, LAUNCH_END, type LaunchEventView } from "../../../src/lib/growth/launchEvent";
const model = projectBookShare({ productType: "annual_fortune", selectedYear: "2027", names: "김 하늘 & 별", shareUrl: `https://gyeolreport.com/r/gr_${"a".repeat(32)}`, publishedAt: "2026-10-12T00:00:00Z", expiresAt: "2027-01-10T00:00:00Z" })!;
const owner = { reportId: "report_private" };
function find(n: ReactNode, predicate: (e: ReactElement<Record<string, unknown>>) => boolean): ReactElement<Record<string, unknown>>[] {
  if (Array.isArray(n)) return n.flatMap(v => find(v, predicate));
  if (!React.isValidElement<Record<string, unknown>>(n)) return [];
  return [...(predicate(n) ? [n] : []), ...find(n.props.children as ReactNode, predicate)];
}
function render(props = { owner, local: true }) { hooks.index = 0; hooks.effects = []; return BookShareActions(props); }
function click(tree: ReactNode, label: string) { const b = find(tree, e => e.props["aria-label"] === label)[0]; (b.props.onClick as () => void)(); }
function status(tree: ReactNode) { return find(tree, e => e.props.role === "status")[0].props.children; }
const flush = async () => { for (let i = 0; i < 30; i++) await Promise.resolve(); };
beforeEach(() => { hooks.slots = []; hooks.index = 0; hooks.effects = []; vi.stubGlobal("navigator", {}); vi.stubGlobal("window", {}); browser.copy.mockReset().mockResolvedValue(true); browser.event.mockClear(); vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify({ model })))); });
afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); });
describe("Book share gestures and status", () => {
  it("prepares once, preserves second gesture, clears preparation on actual share", async () => {
    const share = vi.fn(async () => {}); vi.stubGlobal("navigator", { share });
    click(render(), "시스템 공유"); await flush(); expect(share).not.toHaveBeenCalled(); expect(status(render())).toContain("한 번 더");
    click(render(), "시스템 공유"); await flush(); expect(share).toHaveBeenCalledOnce(); expect(status(render())).toBe("공유했습니다."); expect(fetch).toHaveBeenCalledOnce();
  });
  it("Kakao opens the same personalized card after preparation without false completion", async () => {
    const sendDefault = vi.fn(); vi.stubGlobal("window", { Kakao: { isInitialized: () => true, Share: { sendDefault } } });
    click(render(), "카카오톡으로 책 공유"); await flush(); expect(status(render())).toContain("한 번 더");
    click(render(), "카카오톡으로 책 공유"); await flush(); expect(sendDefault).toHaveBeenCalledOnce(); expect(status(render())).toBe("카카오톡 공유창을 열었습니다."); expect(fetch).toHaveBeenCalledOnce();
    expect(sendDefault.mock.calls[0][0].content.title).toContain("님의 책이 도착했습니다.");
  });
  it("cancel clears preparation quietly; unsupported native falls back to the same copy", async () => {
    vi.stubGlobal("navigator", { share: async () => { throw { name: "AbortError" }; } });
    click(render(), "시스템 공유"); await flush(); click(render(), "시스템 공유"); await flush(); expect(status(render())).toBe(""); expect(browser.copy).not.toHaveBeenCalled();
    vi.stubGlobal("navigator", {}); click(render(), "시스템 공유"); await flush(); expect(browser.copy).toHaveBeenCalledWith(model.shareUrl); expect(status(render())).toBe("복사됨");
  });
  it("failed copy offers the same manual link; failed authorization removes actions", async () => {
    browser.copy.mockResolvedValue(false); click(render(), "공유 링크 복사"); await flush(); expect(status(render())).toContain("자동 복사에 실패");
    expect(find(render(), e => e.props["aria-label"] === "복사할 공유 링크")[0].props.value).toBe(model.shareUrl);
    hooks.slots = []; vi.mocked(fetch).mockResolvedValue(new Response("{}", { status: 403 })); click(render(), "공유 링크 복사"); await flush(); expect(find(render(), e => e.type === "button")).toHaveLength(0);
  });
  it("rapid clicks cannot issue duplicate share requests", async () => {
    let resolve!: (v: Response) => void; vi.mocked(fetch).mockReturnValue(new Promise(r => { resolve = r; }));
    const tree = render(); click(tree, "공유 링크 복사"); click(tree, "공유 링크 복사"); expect(fetch).toHaveBeenCalledOnce(); resolve(new Response(JSON.stringify({ model }))); await flush();
  });
});
describe("server event copy and closed policy", () => {
  const view: LaunchEventView = { state: "ACTIVE", serverNow: "2026-10-12T00:00:00Z", startsAt: LAUNCH_START, endsAt: LAUNCH_END, campaignAvailable: true, referralAvailable: true, inviterAvailable: true, budgetApproved: true, campaignSlug: "launch-local" };
  it.each(["SCHEDULED", "PAUSED", "ENDED", "UNAVAILABLE"])("%s leaves no event paragraph", state => {
    expect(renderToStaticMarkup(<BookEventNotice view={state === "UNAVAILABLE" ? null : { ...view, state: state as LaunchEventView["state"] }} remaining={10000} />)).toBe("");
  });
  it.each(["ACTIVE"])("%s shows the closed complete conditions", state => {
    const html = renderToStaticMarkup(<BookEventNotice view={{ ...view, state: state as LaunchEventView["state"] }} remaining={10000} />);
    expect(html).toContain("무료 이용권 참여 조건 보기"); expect(html).not.toMatch(/<details[^>]*open/); expect(html).toContain("11월 1일 0시"); expect(html).toContain("광고·친구 초대 중복 불가"); expect(html).toContain("처리 지연");
    expect(html.includes("내 책의 초대 링크로")).toBe(state === "ACTIVE");
    expect(html).not.toMatch(/KST|\+09:00|T15:00:00Z/);
  });
  it("deadline and uncertain availability never promise a reward", () => {
    for (const props of [{ view, remaining: 0 }, { view: { ...view, referralAvailable: false }, remaining: 1000 }, { view, remaining: null }]) expect(renderToStaticMarkup(<BookEventNotice {...props} />)).not.toContain("내 책의 초대 링크로");
  });
});
describe("decorative publishing lifecycle", () => {
  it("loops only four non-complete stages, pauses hidden/reduced motion, cleans timers", () => {
    vi.useFakeTimers(); const doc = Object.assign(new EventTarget(), { hidden: false }); const motion = Object.assign(new EventTarget(), { matches: false }); vi.stubGlobal("document", doc); vi.stubGlobal("matchMedia", () => motion);
    const component = BookPublishingVisual({ animate: true }).type as () => ReactElement;
    const renderAnimation = () => { hooks.index = 0; hooks.effects = []; return renderToStaticMarkup(component()); };
    expect(renderAnimation()).toContain('data-publishing="preparing"'); const cleanup = hooks.effects[0]();
    for (const state of ["composing", "binding", "covering", "preparing", "composing"]) { vi.advanceTimersByTime(1400); expect(renderAnimation()).toContain(`data-publishing="${state}"`); }
    doc.hidden = true; doc.dispatchEvent(new Event("visibilitychange")); expect(vi.getTimerCount()).toBe(0);
    doc.hidden = false; doc.dispatchEvent(new Event("visibilitychange")); expect(vi.getTimerCount()).toBe(1);
    motion.matches = true; motion.dispatchEvent(new Event("change")); expect(vi.getTimerCount()).toBe(0); cleanup?.(); expect(vi.getTimerCount()).toBe(0);
  });
  it("reopening uses static paper without payment or generation claims or personal data", () => {
    const html = renderToStaticMarkup(<ReportLoading />); expect(html).toContain("책장을 펼치고 있습니다."); expect(html).toContain("잠시만 기다려 주세요."); expect(html).toContain("GYEOL REPORT"); expect(html).not.toMatch(/결제|생성|미리보기|님의|ISSUE|<svg/); expect(hooks.effects).toHaveLength(0);
  });
});
