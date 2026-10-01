import { beforeEach, vi } from "vitest";
// Next resolves this poison-pill import at build time. Unit tests render both
// server route presentations in Node; the production build retains the boundary.
vi.mock("server-only", () => ({}));
// Every test must opt into a mock transport; accidental provider calls fail closed.
beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn(async () => { throw new Error("TEST_NETWORK_FORBIDDEN: use a mock transport"); }));
});
