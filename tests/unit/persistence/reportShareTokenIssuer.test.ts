import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import {
  issueReportShareToken,
  REPORT_SHARE_TOKEN_VERSION,
} from "@/lib/persistence/reportShareTokenIssuer";
import { buildReportPersistencePayload } from "@/lib/report/reportPersistencePayload";
import type { ReportOutput } from "@/lib/report/types";

const nowIso = "2026-01-01T00:00:00.000Z";
const reportFixture: ReportOutput = {
  version: "v1",
  titleKo: "Share test report",
  subtitleKo: "Share token issuer test",
  sections: [],
  notices: [],
};

function readSource(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

function expectIssuedToken(): Extract<
  ReturnType<typeof issueReportShareToken>,
  { ok: true }
> {
  const result = issueReportShareToken({ nowIso });

  expect(result.ok).toBe(true);

  if (!result.ok) {
    throw new Error("Expected share token issue success.");
  }

  return result;
}

describe("issueReportShareToken", () => {
  it("issues a URL-safe share token and path", () => {
    const result = expectIssuedToken();

    expect(result.issue.shareToken.length).toBeGreaterThan(0);
    expect(result.issue.sharePath).toBe(`/r/${result.issue.shareToken}`);
    expect(result.issue.sharePath.startsWith("/r/")).toBe(true);
    expect(result.issue.sharePath).toContain(result.issue.shareToken);
    expect(result.issue.shareToken).toMatch(/^rpat_[a-z0-9]+$/);
  });

  it("returns hash metadata without making token equal to hash", () => {
    const result = expectIssuedToken();

    expect(result.issue.accessTokenHash).toMatch(/^sha256:[a-f0-9]+$/);
    expect(result.issue.shareToken).not.toBe(result.issue.accessTokenHash);
    expect(result.issue.accessTokenHash).not.toContain(result.issue.shareToken);
    expect(result.issue.accessTokenCreatedAt).toBe(nowIso);
    expect(result.issue.accessTokenVersion).toBe(REPORT_SHARE_TOKEN_VERSION);
  });

  it("issues different tokens", () => {
    const first = expectIssuedToken();
    const second = expectIssuedToken();

    expect(first.issue.shareToken).not.toBe(second.issue.shareToken);
    expect(first.issue.accessTokenHash).not.toBe(second.issue.accessTokenHash);
  });

  it("passes only hash metadata into persistence payload", () => {
    const issued = expectIssuedToken();
    const payloadResult = buildReportPersistencePayload({
      birthDate: "1996-12-06",
      birthTime: "14:15",
      birthTimeUnknown: false,
      calendarType: "SOLAR",
      timezone: "Asia/Seoul",
      gender: "FEMALE",
      mbti: "ENTJ",
      report: reportFixture,
      nowIso,
      accessTokenIssue: {
        accessTokenHash: issued.issue.accessTokenHash,
        accessTokenCreatedAt: issued.issue.accessTokenCreatedAt,
        accessTokenVersion: issued.issue.accessTokenVersion,
      },
    });

    expect(payloadResult.ok).toBe(true);

    if (!payloadResult.ok) {
      throw new Error("Expected payload build success.");
    }

    const serializedSnapshot = JSON.stringify({
      inputSnapshot: payloadResult.inputSnapshot,
      reportSnapshot: payloadResult.reportSnapshot,
    });
    const serializedRecord = JSON.stringify(payloadResult.input.record);

    expect(payloadResult.input.record.accessTokenHash).toBe(
      issued.issue.accessTokenHash,
    );
    expect(payloadResult.input.record.accessTokenCreatedAt).toBe(
      issued.issue.accessTokenCreatedAt,
    );
    expect(payloadResult.input.record.accessTokenVersion).toBe(
      issued.issue.accessTokenVersion,
    );
    expect(serializedSnapshot).not.toContain(issued.issue.shareToken);
    expect(serializedSnapshot).not.toContain("share" + "Token");
    expect(serializedSnapshot).not.toContain("access" + "Token");
    expect(serializedSnapshot).not.toContain("/r/");
    expect(serializedRecord).not.toContain(issued.issue.shareToken);
    expect(serializedRecord).not.toContain(issued.issue.sharePath);
  });

  it("keeps preview route and paid smoke disconnected from share-token output", () => {
    const routeSource = readSource("src/app/api/reports/create/route.ts");
    const paidSmokeSource = readSource(
      "scripts/smoke_supabase_paid_report_storage.ts",
    );

    expect(routeSource).not.toContain("share" + "Token");
    expect(routeSource).not.toContain("sharePath");
    expect(routeSource).not.toContain("/r/");
    expect(paidSmokeSource).not.toContain("share" + "Token");
    expect(paidSmokeSource).not.toContain("sharePath");
    expect(paidSmokeSource).not.toContain("/r/");
  });

  it("source avoids payment, provider, and secret-role markers", () => {
    const source = readSource("src/lib/persistence/reportShareTokenIssuer.ts");
    const rejectedMarkers = [
      "/api/" + "payments",
      "/api/" + "reports/unlock",
      "check" + "out",
      "To" + "ss",
      "Kakao" + "Pay",
      "service" + "_role",
      "SUPABASE" + "_SERVICE" + "_ROLE",
    ];

    for (const marker of rejectedMarkers) {
      expect(source).not.toContain(marker);
    }
  });
});
