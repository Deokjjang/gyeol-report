import React, { type ReactNode, type ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
const hooks = vi.hoisted(() => ({ slots: [] as unknown[], index: 0, effects: [] as (() => void | (() => void))[] }));
const browser = vi.hoisted(() => ({ copy: vi.fn(), event: vi.fn() }));
vi.mock("react", async original => ({ ...await original<typeof import("react")>(),
  useState: (initial: unknown) => { const i = hooks.index++; if (!(i in hooks.slots)) hooks.slots[i] = initial; return [hooks.slots[i], (v: unknown) => { hooks.slots[i] = typeof v === "function" ? v(hooks.slots[i]) : v; }]; },
  useRef: (initial: unknown) => { const i = hooks.index++; if (!(i in hooks.slots)) hooks.slots[i] = { current: initial }; return hooks.slots[i]; },
  useEffect: (fn: () => void | (() => void)) => { hooks.effects.push(fn); },
  useCallback: (fn: unknown) => fn,
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
// hotfix-share(2026-11-06): 링크는 공유 칸이 열릴 때 미리 받고, 누른 순간의 복사·카카오·공유하기는 await 없이 바로 부른다
// (아이폰 사파리는 fetch 뒤의 클립보드 쓰기를 막는다). 어떤 실패에도 버튼은 남고, 실제로 된 경우에만 된 것처럼 말한다.
describe("Book share gestures and status", () => {
  const buttons = (tree: ReactNode) => find(tree, e => e.type === "button");
  /** 공유 칸이 열림 → 미리 받기 effect 실행 → 응답 반영. */
  async function open(props?: Parameters<typeof render>[0]) { render(props); for (const effect of hooks.effects) effect(); await flush(); return render(props); }
  it("prefetches once when the share section opens; buttons stay visible but locked while preparing", async () => {
    const first = render();
    expect(buttons(first)).toHaveLength(3); expect(buttons(first).every(b => b.props.disabled === true)).toBe(true); expect(status(first)).toBe("공유 링크를 준비하고 있어요.");
    const ready = await open();
    expect(fetch).toHaveBeenCalledOnce(); expect(buttons(ready).every(b => b.props.disabled === false)).toBe(true); expect(status(ready)).toBe("");
    expect(browser.event).toHaveBeenCalledWith("report_share_created", model.productType, true);
  });
  it("native share runs inside the click (no await before it); only a completed share says so", async () => {
    const share = vi.fn(async () => {}); vi.stubGlobal("navigator", { share });
    click(await open(), "시스템 공유");
    expect(share).toHaveBeenCalledOnce(); expect(share).toHaveBeenCalledWith({ title: model.displayTitle, text: "한 권 펼쳐보세요.", url: model.shareUrl });
    await flush(); expect(status(render())).toBe("공유했어요."); expect(fetch).toHaveBeenCalledOnce();
  });
  it("Kakao sends the prefetched link inside the click without claiming completion", async () => {
    const sendDefault = vi.fn(); vi.stubGlobal("window", { Kakao: { isInitialized: () => true, Share: { sendDefault } } });
    click(await open(), "카카오톡으로 책 공유");
    expect(sendDefault).toHaveBeenCalledOnce(); expect(status(render())).toBe("카카오톡을 여는 중이에요.");
    const card = sendDefault.mock.calls[0][0];
    expect(card.content.title).toContain("님의 책이 도착했습니다."); expect(card.content.link).toEqual({ mobileWebUrl: model.shareUrl, webUrl: model.shareUrl });
    expect(card.buttons[0].link).toEqual({ mobileWebUrl: model.shareUrl, webUrl: model.shareUrl });
  });
  it("missing or failing Kakao SDK falls back to native share, then to copy, still inside the click", async () => {
    const share = vi.fn(async () => {}); vi.stubGlobal("navigator", { share });
    click(await open(), "카카오톡으로 책 공유"); expect(share).toHaveBeenCalledOnce();
    vi.stubGlobal("navigator", {}); vi.stubGlobal("window", { Kakao: { isInitialized: () => true, Share: { sendDefault: () => { throw new Error("sdk"); } } } });
    click(render(), "카카오톡으로 책 공유"); expect(browser.copy).toHaveBeenCalledWith(model.shareUrl);
    await flush(); expect(status(render())).toBe("링크를 복사했어요.");
  });
  it("cancel is quiet; without Web Share the same link is copied inside the click", async () => {
    vi.stubGlobal("navigator", { share: async () => { throw new DOMException("cancel", "AbortError"); } });
    click(await open(), "시스템 공유"); await flush(); expect(status(render())).toBe(""); expect(browser.copy).not.toHaveBeenCalled();
    expect(find(render(), e => e.props["aria-label"] === "복사할 공유 링크")).toHaveLength(0);
    vi.stubGlobal("navigator", {}); click(render(), "시스템 공유"); expect(browser.copy).toHaveBeenCalledWith(model.shareUrl);
    await flush(); expect(status(render())).toBe("링크를 복사했어요.");
  });
  it("copy is called inside the click; failure shows the selectable link and never a success message", async () => {
    click(await open(), "공유 링크 복사"); expect(browser.copy).toHaveBeenCalledWith(model.shareUrl);
    await flush(); expect(status(render())).toBe("링크를 복사했어요."); expect(browser.event).toHaveBeenCalledWith("report_share_copy", model.productType, true);
    browser.copy.mockResolvedValue(false); click(render(), "공유 링크 복사"); await flush();
    expect(status(render())).toBe("길게 눌러 복사해 주세요.");
    const field = find(render(), e => e.props["aria-label"] === "복사할 공유 링크")[0];
    expect(field.props.value).toBe(model.shareUrl); expect(field.props.readOnly).toBe(true);
    expect(JSON.stringify(status(render()))).not.toContain("복사했어요");
  });
  it.each([403, 404, 503])("failed preparation (%i) keeps all buttons; pressing again re-prepares, never copies a missing link", async code => {
    vi.mocked(fetch).mockResolvedValue(new Response("{}", { status: code }));
    const tree = await open();
    expect(buttons(tree)).toHaveLength(3); expect(buttons(tree).every(b => b.props.disabled === false)).toBe(true);
    expect(status(tree)).toBe(code === 403 ? "공유하려면 이 책을 산 계정으로 로그인하고 약관 동의를 마쳐 주세요." : "공유 링크를 만들지 못했어요. 버튼을 다시 눌러 주세요.");
    vi.mocked(fetch).mockResolvedValue(new Response(JSON.stringify({ model })));
    click(tree, "공유 링크 복사"); expect(fetch).toHaveBeenCalledTimes(2); expect(browser.copy).not.toHaveBeenCalled();
    await flush(); click(render(), "공유 링크 복사"); expect(browser.copy).toHaveBeenCalledWith(model.shareUrl);
  });
  it("rapid clicks while preparing cannot issue duplicate share requests", async () => {
    let resolve!: (v: Response) => void; vi.mocked(fetch).mockReturnValue(new Promise(r => { resolve = r; }));
    const tree = render(); for (const effect of hooks.effects) effect();
    click(tree, "공유 링크 복사"); click(tree, "공유 링크 복사"); expect(fetch).toHaveBeenCalledOnce(); expect(browser.copy).not.toHaveBeenCalled();
    resolve(new Response(JSON.stringify({ model }))); await flush(); expect(status(render())).toBe("");
  });
  it("a recipient's shared view is ready immediately (no request) and copies the same link", async () => {
    const props = { model, local: true } as unknown as Parameters<typeof render>[0];
    const tree = await open(props); expect(fetch).not.toHaveBeenCalled(); expect(buttons(tree).every(b => b.props.disabled === false)).toBe(true);
    click(tree, "공유 링크 복사"); expect(browser.copy).toHaveBeenCalledWith(model.shareUrl);
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
  // v5 최종 2-1 #7(34f65006 이식): 책 만드는 동작은 진행 표시 자체라 동작 줄이기 설정에서도 멈추지 않는다. 숨은 탭에서만 멈춘다.
  it("loops only four non-complete stages, pauses only while hidden (not under reduced motion), cleans timers", () => {
    vi.useFakeTimers(); const doc = Object.assign(new EventTarget(), { hidden: false }); const motion = Object.assign(new EventTarget(), { matches: false }); vi.stubGlobal("document", doc); vi.stubGlobal("matchMedia", () => motion);
    const component = BookPublishingVisual({ animate: true }).type as () => ReactElement;
    const renderAnimation = () => { hooks.index = 0; hooks.effects = []; return renderToStaticMarkup(component()); };
    expect(renderAnimation()).toContain('data-publishing="preparing"'); const cleanup = hooks.effects[0]();
    for (const state of ["composing", "binding", "covering", "preparing", "composing"]) { vi.advanceTimersByTime(1400); expect(renderAnimation()).toContain(`data-publishing="${state}"`); }
    doc.hidden = true; doc.dispatchEvent(new Event("visibilitychange")); expect(vi.getTimerCount()).toBe(0);
    doc.hidden = false; doc.dispatchEvent(new Event("visibilitychange")); expect(vi.getTimerCount()).toBe(1);
    motion.matches = true; motion.dispatchEvent(new Event("change")); expect(vi.getTimerCount()).toBe(1); cleanup?.(); expect(vi.getTimerCount()).toBe(0);
  });
  it("reopening uses static paper without payment or generation claims or personal data", () => {
    const html = renderToStaticMarkup(<ReportLoading />); expect(html).toContain("책장을 펼치고 있습니다."); expect(html).toContain("잠시만 기다려 주세요."); expect(html).toContain("GYEOL REPORT"); expect(html).not.toMatch(/결제|생성|미리보기|님의|ISSUE|<svg/); expect(hooks.effects).toHaveLength(0);
  });
});
