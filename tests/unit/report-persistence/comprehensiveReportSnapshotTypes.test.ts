import { describe, expect, it } from "vitest";

import type { SaveComprehensiveReportSnapshotResult } from "../../../src/lib/report-persistence/comprehensiveReportSnapshotTypes";

describe("comprehensive report snapshot persistence types", () => {
  it("represents safe snapshot metadata only", () => {
    const result = {
      reportId: "report_snapshot_type_test",
      providerOrderId: "provider_order_snapshot_type_test",
      productType: "saju_mbti_full",
      snapshotVersion: "comprehensive_v1_draft",
      generationModel: "fixture-model",
      status: "generated",
      createdAt: "2026-06-12T00:00:00.000Z",
      updatedAt: "2026-06-12T00:00:01.000Z",
    } satisfies SaveComprehensiveReportSnapshotResult;
    const keys = Object.keys(result);

    expect(keys).toEqual([
      "reportId",
      "providerOrderId",
      "productType",
      "snapshotVersion",
      "generationModel",
      "status",
      "createdAt",
      "updatedAt",
    ]);
    expect(keys).not.toContain("reportSnapshot");
    expect(keys).not.toContain("providerPaymentId");
    expect(keys).not.toContain("inputSnapshot");
    expect(keys).not.toContain("shareToken");
    expect(keys).not.toContain("accessTokenHash");
  });
});
