import { type ReactElement } from "react";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({ set: vi.fn(), track: vi.fn() }));
vi.mock("react", async original => ({ ...await original<typeof import("react")>(), useState: (initial?: unknown) => [initial, mocks.set], useRef: (current: unknown) => ({ current }) }));
vi.mock("../../../src/app/reports/shareActions", () => ({ prepareReportShare: vi.fn() }));
const card = { title: "홍길동님의 대운 리포트", description: "삶의 큰 흐름 속 나의 결.", productSlug: "major-fortune", url: "https://gyeolreport.com/r/gr_" + "a".repeat(32) };
vi.mock("../../../src/components/report/ReportShareProvider", () => ({ useReportShare: () => ({ share: card }), trackReportShare: mocks.track }));
let Component: typeof import("../../../src/components/report/ReportShareActions").default;
beforeAll(async () => {
  vi.stubEnv("NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY", "public-test-key");
  Component = (await import("../../../src/components/report/ReportShareActions")).default;
});
afterEach(() => { vi.unstubAllGlobals(); vi.clearAllMocks(); });
describe("Kakao configured SDK", () => {
  it("initializes once without login, sends only the approved card fields", async () => {
    let ready = false;
    const init = vi.fn(() => { ready = true; });
    const sendDefault = vi.fn();
    const copy = vi.fn();
    vi.stubGlobal("window", { Kakao: { init, isInitialized: () => ready, Share: { sendDefault } } });
    vi.stubGlobal("navigator", { clipboard: { writeText: copy } });
    const tree = Component({});
    const actions = tree.props.children[1] as ReactElement<{ children: ReactElement<{ onClick: () => void }>[] }>;
    actions.props.children[0].props.onClick();
    for (let i = 0; i < 10; i++) await Promise.resolve();
    actions.props.children[0].props.onClick();
    for (let i = 0; i < 10; i++) await Promise.resolve();
    expect(init).toHaveBeenCalledTimes(1);
    expect(init).toHaveBeenCalledWith("public-test-key");
    expect(sendDefault).toHaveBeenCalledWith(expect.objectContaining({ content: expect.objectContaining({ title: card.title, imageUrl: "https://gyeolreport.com/brand/gyeol-report-og.png", link: { webUrl: card.url, mobileWebUrl: card.url } }), buttons: [{ title: "리포트 보기", link: { webUrl: card.url, mobileWebUrl: card.url } }] }));
    expect(copy).not.toHaveBeenCalled();
    expect(mocks.track).toHaveBeenCalledWith("share_kakao", "major-fortune");
  });
  it("failed SDK initialization copies the same URL without breaking the page", async () => {
    const copy = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("window", { Kakao: { init: () => { throw new Error("bad key"); }, isInitialized: () => false } });
    vi.stubGlobal("navigator", { clipboard: { writeText: copy } });
    const tree = Component({});
    const actions = tree.props.children[1] as ReactElement<{ children: ReactElement<{ onClick: () => void }>[] }>;
    actions.props.children[0].props.onClick();
    for (let i = 0; i < 10; i++) await Promise.resolve();
    expect(copy).toHaveBeenCalledWith(card.url);
    expect(mocks.track).toHaveBeenCalledWith("share_copy", "major-fortune");
  });
});
