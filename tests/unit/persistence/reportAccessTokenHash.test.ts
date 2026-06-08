import { describe, expect, it } from "vitest";
import {
  hashReportAccessToken,
  hashReportAccessTokenSync,
  verifyReportAccessTokenHash,
} from "@/lib/persistence/reportAccessTokenHash";

const validToken = "rpat_abcdefghijklmnopqrstuvwxyz1";
const otherValidToken = "rpat_abcdefghijklmnopqrstuvwxyz2";

const invalidTokens = [
  "",
  "rpat_",
  "rpat_abc",
  "RPAT_abcdefghijklmnopqrstuvwxyz1",
  "rpat_abc-abcdefghijklmnopqrst",
  "report_abcdefghijklmnopqrstuvwxyz1",
] as const;

describe("report access token hash utility", () => {
  it("hashes a valid report access token", async () => {
    const result = await hashReportAccessToken(validToken);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.hash.startsWith("sha256:")).toBe(true);
      expect(result.hash.length).toBeGreaterThan("sha256:".length);
      expect(result.hash).toMatch(/^sha256:[a-f0-9]+$/);
    }
  });

  it("hash is deterministic", async () => {
    const first = await hashReportAccessToken(validToken);
    const second = await hashReportAccessToken(validToken);

    expect(first.ok).toBe(true);
    expect(second.ok).toBe(true);
    if (first.ok && second.ok) {
      expect(first.hash).toBe(second.hash);
    }
  });

  it("sync hash matches async hash for payload construction", async () => {
    const asyncResult = await hashReportAccessToken(validToken);
    const syncResult = hashReportAccessTokenSync(validToken);

    expect(asyncResult.ok).toBe(true);
    expect(syncResult.ok).toBe(true);

    if (asyncResult.ok && syncResult.ok) {
      expect(syncResult.hash).toBe(asyncResult.hash);
      expect(syncResult.hash).not.toContain(validToken);
    }
  });

  it("different tokens produce different hashes", async () => {
    const first = await hashReportAccessToken(validToken);
    const second = await hashReportAccessToken(otherValidToken);

    expect(first.ok).toBe(true);
    expect(second.ok).toBe(true);
    if (first.ok && second.ok) {
      expect(first.hash).not.toBe(second.hash);
    }
  });

  it("rejects invalid token format", async () => {
    for (const token of invalidTokens) {
      const result = await hashReportAccessToken(token);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.code).toBe("INVALID_REPORT_ACCESS_TOKEN");
      }
    }
  });

  it("verifies matching hash", async () => {
    const result = await hashReportAccessToken(validToken);

    expect(result.ok).toBe(true);
    if (!result.ok) {
      throw new Error("Expected valid token hash");
    }

    await expect(
      verifyReportAccessTokenHash(validToken, result.hash),
    ).resolves.toBe(true);
  });

  it("rejects non-matching hash", async () => {
    const result = await hashReportAccessToken(validToken);

    expect(result.ok).toBe(true);
    if (!result.ok) {
      throw new Error("Expected valid token hash");
    }

    await expect(
      verifyReportAccessTokenHash(otherValidToken, result.hash),
    ).resolves.toBe(false);
  });

  it("rejects invalid token during verify", async () => {
    await expect(
      verifyReportAccessTokenHash("rpat_abc", "sha256:abc"),
    ).resolves.toBe(false);
  });

  it("returns unavailable when Web Crypto digest is missing", async () => {
    const originalDescriptor = Object.getOwnPropertyDescriptor(
      globalThis,
      "crypto",
    );

    try {
      Object.defineProperty(globalThis, "crypto", {
        configurable: true,
        value: {},
      });

      const result = await hashReportAccessToken(validToken);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.code).toBe("TOKEN_HASH_UNAVAILABLE");
      }
    } finally {
      if (originalDescriptor) {
        Object.defineProperty(globalThis, "crypto", originalDescriptor);
      }
    }
  });
});
