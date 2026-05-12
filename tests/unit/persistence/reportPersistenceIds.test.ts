import { describe, expect, it } from "vitest";

import {
  createReportAccessToken,
  createReportId,
  isValidReportAccessToken,
  isValidReportId,
} from "@/lib/persistence/reportPersistenceIds";

describe("report persistence ids", () => {
  it("creates valid report id", () => {
    const id = createReportId();

    expect(id.startsWith("report_")).toBe(true);
    expect(id.length).toBeGreaterThanOrEqual(20);
    expect(isValidReportId(id)).toBe(true);
    expect(id).toMatch(/^report_[a-z0-9]+$/);
  });

  it("creates valid access token", () => {
    const token = createReportAccessToken();

    expect(token.startsWith("rpat_")).toBe(true);
    expect(token.length).toBeGreaterThanOrEqual(32);
    expect(isValidReportAccessToken(token)).toBe(true);
    expect(token).toMatch(/^rpat_[a-z0-9]+$/);
  });

  it("creates different values across calls", () => {
    const ids = Array.from({ length: 20 }, () => createReportId());
    const tokens = Array.from({ length: 20 }, () => createReportAccessToken());

    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(tokens).size).toBe(tokens.length);
  });

  it("rejects invalid report ids", () => {
    const invalidIds = [
      "",
      "report_",
      "REPORT_abc1234567890",
      "report_abc-1234567890",
      "report_abc",
      "rpat_abcdefghijklmnopqrstuvwxyz123",
    ];

    for (const id of invalidIds) {
      expect(isValidReportId(id)).toBe(false);
    }
  });

  it("rejects invalid access tokens", () => {
    const invalidTokens = [
      "",
      "rpat_",
      "RPAT_abcdefghijklmnopqrstuvwxyz123",
      "rpat_abc-abcdefghijklmnopqrstuvwxyz",
      "rpat_abc",
      "report_abcdefghijklmnopqrstuvwxyz123",
    ];

    for (const token of invalidTokens) {
      expect(isValidReportAccessToken(token)).toBe(false);
    }
  });

  it("validators are deterministic", () => {
    const id = "report_abcdefghijklmn";
    const token = "rpat_abcdefghijklmnopqrstuvwxyz1";

    expect(isValidReportId(id)).toBe(isValidReportId(id));
    expect(isValidReportAccessToken(token)).toBe(
      isValidReportAccessToken(token),
    );
  });
});
