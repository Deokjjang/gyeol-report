import { afterEach, describe, expect, it, vi } from "vitest";
import { AUTO_IDLE, AUTO_INTERVAL, createCoverflowAuto } from "../../../../src/app/dev/book-preview/coverflowAuto";
afterEach(() => vi.useRealTimers());
describe("coverflow one-shot automatic rotation", () => {
  it("advances only after interval, never opens a book", () => {
    vi.useFakeTimers(); const advance = vi.fn(), auto = createCoverflowAuto(advance);
    auto.setActive(true); vi.advanceTimersByTime(AUTO_INTERVAL - 1); expect(advance).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1); expect(advance).toHaveBeenCalledTimes(1); expect(vi.getTimerCount()).toBe(1);
    auto.dispose(); expect(vi.getTimerCount()).toBe(0);
  });
  it.each(["arrow", "swipe", "keyboard", "side-book"])("%s pauses, then resumes after last interaction", () => {
    vi.useFakeTimers(); const advance = vi.fn(), auto = createCoverflowAuto(advance);
    auto.setActive(true); vi.advanceTimersByTime(6000); auto.interact();
    vi.advanceTimersByTime(AUTO_IDLE - 1); expect(advance).not.toHaveBeenCalled();
    auto.interact(); vi.advanceTimersByTime(AUTO_IDLE - 1); expect(advance).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1); expect(advance).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(AUTO_INTERVAL); expect(advance).toHaveBeenCalledTimes(2); auto.dispose();
  });
  it.each(["hidden tab", "reduced motion", "hover", "opened book"])("%s stops timer, reactivation starts only one", () => {
    vi.useFakeTimers(); const advance = vi.fn(), auto = createCoverflowAuto(advance);
    auto.setActive(true); vi.advanceTimersByTime(4000); auto.setActive(false);
    expect(vi.getTimerCount()).toBe(0); vi.advanceTimersByTime(60000); expect(advance).not.toHaveBeenCalled();
    auto.setActive(true); auto.setActive(true); expect(vi.getTimerCount()).toBe(1);
    vi.advanceTimersByTime(AUTO_INTERVAL); expect(advance).toHaveBeenCalledTimes(1); auto.dispose();
  });
  it("rapid manual actions never accumulate timers and unmount cancels", () => {
    vi.useFakeTimers(); const advance = vi.fn(), auto = createCoverflowAuto(advance);
    auto.setActive(true); for (let i = 0; i < 20; i++) auto.interact();
    expect(vi.getTimerCount()).toBe(1); auto.dispose(); auto.interact(); auto.setActive(false); auto.setActive(true);
    vi.advanceTimersByTime(60000); expect(advance).not.toHaveBeenCalled(); expect(vi.getTimerCount()).toBe(0);
  });
});
