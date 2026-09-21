import { type ReactElement } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
const state = vi.hoisted(() => ({ set: vi.fn() }));
vi.mock("react", async (original) => ({ ...await original<typeof import("react")>(), useState: () => ["", state.set] }));
import ReportShareActions from "../../../src/components/report/ReportShareActions";

afterEach(() => { vi.unstubAllGlobals(); vi.clearAllMocks(); });

async function share(navigator: object) {
  vi.stubGlobal("window", { location: { origin: "https://gyeol.example", pathname: "/reports/report_public", search: "?paymentKey=secret&birthDate=1996-12-06", hash: "#report-readings" } });
  vi.stubGlobal("navigator", navigator);
  const tree = ReportShareActions({});
  const actions = tree.props.children[0] as ReactElement<{ children: ReactElement<{ onClick: () => void }>[] }>;
  actions.props.children[0].props.onClick();
  await Promise.resolve(); await Promise.resolve(); await Promise.resolve();
}

describe("completed report sharing", () => {
  it("shares the unchanged canonical report path without query payload or section state", async () => {
    const native = vi.fn().mockResolvedValue(undefined); const copy = vi.fn();
    await share({ share: native, clipboard: { writeText: copy } });
    expect(native).toHaveBeenCalledWith(expect.objectContaining({ url: "https://gyeol.example/reports/report_public" }));
    expect(copy).not.toHaveBeenCalled();
  });
  it("copies the same canonical path when native sharing is unavailable", async () => {
    const copy = vi.fn().mockResolvedValue(undefined);
    await share({ clipboard: { writeText: copy } });
    expect(copy).toHaveBeenCalledWith("https://gyeol.example/reports/report_public");
    expect(state.set).toHaveBeenCalledWith("리포트 링크가 복사되었습니다.");
  });
  it("does not copy or announce an error when a user cancels sharing", async () => {
    const error = Object.assign(new Error("cancelled"), { name: "AbortError" }); const copy = vi.fn();
    await share({ share: vi.fn().mockRejectedValue(error), clipboard: { writeText: copy } });
    expect(copy).not.toHaveBeenCalled(); expect(state.set).not.toHaveBeenCalled();
  });
  it("falls back to copy when the native share fails", async () => {
    const copy = vi.fn().mockResolvedValue(undefined);
    await share({ share: vi.fn().mockRejectedValue(new Error("unavailable")), clipboard: { writeText: copy } });
    expect(copy).toHaveBeenCalledWith("https://gyeol.example/reports/report_public");
  });
  it("handles a denied clipboard without an unhandled rejection or internal error", async () => {
    await share({ clipboard: { writeText: vi.fn().mockRejectedValue(new Error("secret denial")) } });
    expect(state.set).toHaveBeenCalledWith("자동 복사가 되지 않았습니다. 주소창의 리포트 주소를 복사해 주세요.");
  });
});
