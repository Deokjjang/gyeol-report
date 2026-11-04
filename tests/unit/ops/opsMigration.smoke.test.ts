import { describe, expect, it } from "vitest";
import { opsSql } from "../../helpers/opsSql";
describe("p6d ops migration", () => {
  it("applies and answers basic actions", async () => {
    const h = await opsSql();
    expect((await h.rpc("ops_generation", "provider", {})).ok).toBe(true);
    expect((await h.rpc("ops_order", "summary", { orderCode: "GR-XXXX" })).ok).toBe(true);
  }, 120_000);
});
