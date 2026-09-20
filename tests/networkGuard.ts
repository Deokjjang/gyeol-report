import { beforeEach, vi } from "vitest";
// Every test must opt into a mock transport; accidental provider calls fail closed.
beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn(async () => { throw new Error("TEST_NETWORK_FORBIDDEN: use a mock transport"); }));
});
