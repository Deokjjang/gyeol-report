import { type ReactElement } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({
  set: vi.fn(), track: vi.fn(), prepare: vi.fn(),
  context: { share: { title: "김도윤님의 종합 리포트", description: "나만의 결을 발견합니다.", productSlug: "saju-mbti-full", url: "https://gyeolreport.com/r/gr_abcdefghijklmnopqrstuvwxyzABCDEF" } } as { reportId?: string; share?: { title: string; description: string; productSlug: string; url: string } },
}));
vi.mock("react", async original => ({ ...await original<typeof import("react")>(), useState: (initial?: unknown) => [initial, mocks.set], useRef: (current: unknown) => ({ current }) }));
vi.mock("../../../src/components/report/ReportShareProvider", () => ({ useReportShare: () => mocks.context, trackReportShare: mocks.track }));
vi.mock("../../../src/app/reports/shareActions", () => ({ prepareReportShare: mocks.prepare }));
import ReportShareActions from "../../../src/components/report/ReportShareActions";
const card = { ...mocks.context.share! };
afterEach(() => { vi.unstubAllGlobals(); vi.clearAllMocks(); mocks.context = { share: card }; });
async function click(index: number, navigator: object) {
  vi.stubGlobal("window", { location: { origin: "https://evil.example", pathname: "/reports/report_private", search: "?paymentKey=secret" } });
  vi.stubGlobal("navigator", navigator);
  const tree = ReportShareActions({});
  const actions = tree.props.children[1] as ReactElement<{ children: ReactElement<{ onClick: () => void }>[] }>;
  actions.props.children[index].props.onClick();
  for (let i = 0; i < 12; i++) await Promise.resolve();
}
describe("completed report sharing", () => {
  it("shares only the server-prepared opaque URL, never the address bar", async () => {
    const native = vi.fn().mockResolvedValue(undefined), copy = vi.fn();
    await click(1, { share: native, clipboard: { writeText: copy } });
    expect(native).toHaveBeenCalledWith({ title: card.title, text: card.description, url: card.url });
    expect(copy).not.toHaveBeenCalled();
    expect(mocks.track).toHaveBeenCalledWith("share_native", card.productSlug);
  });
  it("copies the same link when native sharing is unsupported", async () => {
    const copy = vi.fn().mockResolvedValue(undefined);
    await click(1, { clipboard: { writeText: copy } });
    expect(copy).toHaveBeenCalledWith(card.url);
    expect(mocks.set).toHaveBeenCalledWith("리포트 링크가 복사되었습니다.");
  });
  it("cancellation does not copy or count a share", async () => {
    const copy = vi.fn();
    await click(1, { share: vi.fn().mockRejectedValue({ name: "AbortError" }), clipboard: { writeText: copy } });
    expect(copy).not.toHaveBeenCalled(); expect(mocks.track).not.toHaveBeenCalled();
  });
  it("native failure falls back to copying", async () => {
    const copy = vi.fn().mockResolvedValue(undefined);
    await click(1, { share: vi.fn().mockRejectedValue(new Error("unavailable")), clipboard: { writeText: copy } });
    expect(copy).toHaveBeenCalledWith(card.url);
  });
  it("the dedicated copy button copies the opaque URL", async () => {
    const copy = vi.fn().mockResolvedValue(undefined);
    await click(2, { clipboard: { writeText: copy } });
    expect(copy).toHaveBeenCalledWith(card.url);
  });
  it("Kakao without its key falls back gracefully", async () => {
    const copy = vi.fn().mockResolvedValue(undefined);
    await click(0, { clipboard: { writeText: copy } });
    expect(copy).toHaveBeenCalledWith(card.url);
    expect(mocks.track).not.toHaveBeenCalledWith("share_kakao", expect.anything());
  });
  it("never copies an internal reportId when issuing a link fails", async () => {
    mocks.context = { reportId: "report_01234567890123456789012345678901" };
    mocks.prepare.mockResolvedValue({ ok: false });
    const copy = vi.fn();
    await click(2, { clipboard: { writeText: copy } });
    expect(copy).not.toHaveBeenCalled();
    expect(mocks.set).toHaveBeenCalledWith("공유 링크를 준비하지 못했습니다. 잠시 후 다시 시도해 주세요.");
  });
  it("prepares the first link and waits for a new user activation before native sharing", async () => {
    mocks.context = { reportId: "report_01234567890123456789012345678901" };
    mocks.prepare.mockResolvedValue({ ok: true, data: card });
    const share = vi.fn();
    await click(1, { share });
    expect(share).not.toHaveBeenCalled();
    expect(mocks.set).toHaveBeenCalledWith(card);
    expect(mocks.set).toHaveBeenCalledWith(expect.stringContaining("한 번 더"));
  });
});
