import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import {
  findPaidReportByShareToken,
  type PaidReportLookupResult,
  type PaidReportLookupStore,
} from "@/lib/persistence/paidReportLookupBoundary";
import { issueReportShareToken } from "@/lib/persistence/reportShareTokenIssuer";
import type {
  PersistedPaymentLinkage,
  PersistedReportRecord,
  ReportPaymentStatus,
} from "@/lib/persistence/reportPersistenceTypes";
import type { ReportOutput } from "@/lib/report/types";

const createdAt = "2026-01-01T00:00:00.000Z";
const updatedAt = "2026-01-01T00:01:00.000Z";
const paidAt = "2026-01-01T00:02:00.000Z";

const reportFixture: ReportOutput = {
  version: "v1",
  titleKo: "Paid lookup report",
  subtitleKo: "Safe view fixture",
  sections: [],
  notices: [],
};

type LookupCalls = {
  readonly accessTokenHashes: string[];
};

function expectIssuedToken(): Extract<
  ReturnType<typeof issueReportShareToken>,
  { ok: true }
> {
  const result = issueReportShareToken({ nowIso: createdAt });

  expect(result.ok).toBe(true);

  if (!result.ok) {
    throw new Error("Expected share token issue success.");
  }

  return result;
}

function createPayment(
  overrides: Partial<PersistedPaymentLinkage> = {},
): PersistedPaymentLinkage {
  return {
    orderId: "order_lookup_1",
    provider: "manual_test_provider",
    providerPaymentId: "provider_payment_lookup_1",
    paymentStatus: "paid",
    amount: 1290,
    currency: "KRW",
    paidAt,
    ...overrides,
  };
}

function createRecord(
  accessTokenHash: string,
  overrides: Partial<PersistedReportRecord> = {},
): PersistedReportRecord {
  return {
    reportId: "report_paidlookup1",
    createdAt,
    updatedAt,
    status: "paid_unlocked",
    reportVersion: "v1",
    calculationVersion: "saju-mbti-v1",
    locale: "ko-KR",
    accessMode: "paid",
    accessTokenHash,
    accessTokenCreatedAt: createdAt,
    accessTokenVersion: "v1",
    inputSnapshot: {
      birthDate: "1996-12-06",
      birthTime: "14:15",
      birthTimeUnknown: false,
      calendarType: "SOLAR",
      timezone: "Asia/Seoul",
      gender: "FEMALE",
      mbti: "ENTJ",
    },
    reportSnapshot: {
      report: reportFixture,
      reportVersion: "v1",
      renderVersion: "v1",
      createdAt,
    },
    payment: createPayment(),
    ...overrides,
  };
}

function createStore(record: PersistedReportRecord | null): {
  readonly store: PaidReportLookupStore;
  readonly calls: LookupCalls;
} {
  const calls: LookupCalls = {
    accessTokenHashes: [],
  };

  return {
    calls,
    store: {
      async findByAccessTokenHash(accessTokenHash) {
        calls.accessTokenHashes.push(accessTokenHash);

        return record;
      },
    },
  };
}

function expectLookupFailure(
  result: PaidReportLookupResult,
  code:
    | "PAID_REPORT_LOOKUP_INVALID_TOKEN"
    | "PAID_REPORT_LOOKUP_NOT_FOUND"
    | "PAID_REPORT_LOOKUP_NOT_UNLOCKED",
): void {
  expect(result.ok).toBe(false);

  if (result.ok) {
    return;
  }

  expect(result.error.code).toBe(code);
}

function createRecordWithoutReportSnapshot(
  accessTokenHash: string,
): PersistedReportRecord {
  return Object.fromEntries(
    Object.entries(createRecord(accessTokenHash)).filter(
      ([key]) => key !== "reportSnapshot",
    ),
  ) as unknown as PersistedReportRecord;
}

function readSource(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

describe("findPaidReportByShareToken", () => {
  it("hashes a valid share token and looks up by hash", async () => {
    const issued = expectIssuedToken();
    const record = createRecord(issued.issue.accessTokenHash);
    const { store, calls } = createStore(record);

    const result = await findPaidReportByShareToken({
      shareToken: issued.issue.shareToken,
      store,
    });

    expect(result.ok).toBe(true);
    expect(calls.accessTokenHashes).toEqual([issued.issue.accessTokenHash]);
  });

  it("returns a safe view for a paid unlocked report", async () => {
    const issued = expectIssuedToken();
    const record = createRecord(issued.issue.accessTokenHash);
    const { store } = createStore(record);

    const result = await findPaidReportByShareToken({
      shareToken: issued.issue.shareToken,
      store,
    });

    expect(result.ok).toBe(true);

    if (!result.ok) {
      throw new Error("Expected lookup success.");
    }

    expect(result.view).toEqual({
      reportId: record.reportId,
      status: "paid_unlocked",
      accessMode: "paid",
      reportSnapshot: record.reportSnapshot,
      reportVersion: record.reportVersion,
      calculationVersion: record.calculationVersion,
      locale: record.locale,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  });

  it("does not expose token, token hash, or provider payment id in safe view", async () => {
    const issued = expectIssuedToken();
    const record = createRecord(issued.issue.accessTokenHash);
    const { store } = createStore(record);

    const result = await findPaidReportByShareToken({
      shareToken: issued.issue.shareToken,
      store,
    });

    expect(result.ok).toBe(true);

    if (!result.ok) {
      throw new Error("Expected lookup success.");
    }

    const serializedView = JSON.stringify(result.view);

    expect(serializedView).not.toContain(issued.issue.shareToken);
    expect(serializedView).not.toContain(issued.issue.sharePath);
    expect(serializedView).not.toContain(record.accessTokenHash);
    expect(serializedView).not.toContain("share" + "Token");
    expect(serializedView).not.toContain("sharePath");
    expect(serializedView).not.toContain("access" + "TokenHash");
    expect(serializedView).not.toContain(record.payment?.providerPaymentId);
    expect(serializedView).not.toContain("providerPaymentId");
    expect(serializedView).not.toContain("deletedAt");
  });

  it("rejects empty and malformed tokens before lookup", async () => {
    const empty = createStore(null);
    const malformed = createStore(null);

    const emptyResult = await findPaidReportByShareToken({
      shareToken: "",
      store: empty.store,
    });
    const malformedResult = await findPaidReportByShareToken({
      shareToken: "not-a-report-share-token",
      store: malformed.store,
    });

    expectLookupFailure(emptyResult, "PAID_REPORT_LOOKUP_INVALID_TOKEN");
    expectLookupFailure(malformedResult, "PAID_REPORT_LOOKUP_INVALID_TOKEN");
    expect(empty.calls.accessTokenHashes).toEqual([]);
    expect(malformed.calls.accessTokenHashes).toEqual([]);
  });

  it("returns not found for a missing record", async () => {
    const issued = expectIssuedToken();
    const { store } = createStore(null);

    const result = await findPaidReportByShareToken({
      shareToken: issued.issue.shareToken,
      store,
    });

    expectLookupFailure(result, "PAID_REPORT_LOOKUP_NOT_FOUND");
  });

  it("rejects preview records", async () => {
    const issued = expectIssuedToken();
    const record = createRecord(issued.issue.accessTokenHash, {
      accessMode: "preview",
    });
    const { store } = createStore(record);

    const result = await findPaidReportByShareToken({
      shareToken: issued.issue.shareToken,
      store,
    });

    expectLookupFailure(result, "PAID_REPORT_LOOKUP_NOT_UNLOCKED");
  });

  it("rejects unpaid records", async () => {
    const issued = expectIssuedToken();
    const record = createRecord(issued.issue.accessTokenHash, {
      payment: createPayment({ paymentStatus: "pending" }),
    });
    const { store } = createStore(record);

    const result = await findPaidReportByShareToken({
      shareToken: issued.issue.shareToken,
      store,
    });

    expectLookupFailure(result, "PAID_REPORT_LOOKUP_NOT_UNLOCKED");
  });

  it("rejects refunded, canceled, or failed records", async () => {
    const rejectedStatuses = ["refunded", "failed", "canceled"] as const;

    for (const paymentStatus of rejectedStatuses) {
      const issued = expectIssuedToken();
      const record = createRecord(issued.issue.accessTokenHash, {
        payment: createPayment({
          paymentStatus: paymentStatus as unknown as ReportPaymentStatus,
        }),
      });
      const { store } = createStore(record);

      const result = await findPaidReportByShareToken({
        shareToken: issued.issue.shareToken,
        store,
      });

      expectLookupFailure(result, "PAID_REPORT_LOOKUP_NOT_UNLOCKED");
    }
  });

  it("rejects deleted records", async () => {
    const issued = expectIssuedToken();
    const statusDeleted = createRecord(issued.issue.accessTokenHash, {
      status: "deleted",
    });
    const deletedAtMarked = createRecord(issued.issue.accessTokenHash, {
      deletedAt: "2026-01-02T00:00:00.000Z",
    });

    const statusResult = await findPaidReportByShareToken({
      shareToken: issued.issue.shareToken,
      store: createStore(statusDeleted).store,
    });
    const deletedAtResult = await findPaidReportByShareToken({
      shareToken: issued.issue.shareToken,
      store: createStore(deletedAtMarked).store,
    });

    expectLookupFailure(statusResult, "PAID_REPORT_LOOKUP_NOT_FOUND");
    expectLookupFailure(deletedAtResult, "PAID_REPORT_LOOKUP_NOT_UNLOCKED");
  });

  it("rejects records without report snapshots", async () => {
    const issued = expectIssuedToken();
    const record = createRecordWithoutReportSnapshot(issued.issue.accessTokenHash);
    const { store } = createStore(record);

    const result = await findPaidReportByShareToken({
      shareToken: issued.issue.shareToken,
      store,
    });

    expectLookupFailure(result, "PAID_REPORT_LOOKUP_NOT_UNLOCKED");
  });

  it("keeps create report route disconnected from paid lookup boundary", () => {
    const routeSource = readSource("src/app/api/reports/create/route.ts");

    expect(routeSource).not.toContain("paidReportLookupBoundary");
    expect(routeSource).not.toContain("findPaidReportByShareToken");
  });

  it("source avoids payment, provider, secret-role, and unsafe print markers", () => {
    const source = readSource("src/lib/persistence/paidReportLookupBoundary.ts");
    const rejectedMarkers = [
      "/api/" + "payments",
      "/api/" + "reports/unlock",
      "check" + "out",
      "To" + "ss",
      "Kakao" + "Pay",
      "service" + "_role",
      "SUPABASE" + "_SERVICE" + "_ROLE",
      "console.log(" + "shareToken",
      "console.log(" + "accessTokenHash",
    ];

    for (const marker of rejectedMarkers) {
      expect(source).not.toContain(marker);
    }
  });
});
