import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { persistPaidFullReport } from "@/lib/persistence/paidReportStorageBoundary";
import type {
  CreatePersistedReportInput,
  DeletePersistedReportInput,
  FindPersistedReportInput,
  ListPersistedReportsInput,
  ReportPersistenceAdapter,
  UpdatePersistedReportInput,
} from "@/lib/persistence/reportPersistenceAdapter";
import type {
  PersistedPaymentLinkage,
  PersistedReportRecord,
  PublicReportResult,
  ReportPaymentStatus,
} from "@/lib/persistence/reportPersistenceTypes";
import type { ReportOutput } from "@/lib/report/types";

const createdAt = "2026-01-01T00:00:00.000Z";
const paidAt = "2026-01-01T00:01:00.000Z";

const minimalReport: ReportOutput = {
  version: "v1",
  titleKo: "Paid report",
  subtitleKo: "Paid full report",
  sections: [],
  notices: [],
};

type AdapterCalls = {
  readonly createInputs: CreatePersistedReportInput[];
};

function createPayment(
  overrides: Partial<PersistedPaymentLinkage> = {},
): PersistedPaymentLinkage {
  return {
    orderId: "order_paid_boundary_1",
    provider: "manual_test_provider",
    providerPaymentId: "provider_paid_boundary_1",
    paymentStatus: "paid",
    amount: 990,
    currency: "KRW",
    paidAt,
    ...overrides,
  };
}

function createRecord(
  overrides: Partial<PersistedReportRecord> = {},
): PersistedReportRecord {
  return {
    reportId: "report_paidboundary1",
    createdAt,
    updatedAt: createdAt,
    status: "paid_unlocked",
    reportVersion: "v1",
    calculationVersion: "saju-mbti-v1",
    locale: "ko-KR",
    accessMode: "paid",
    accessTokenHash: "sha256:paidboundaryhash",
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
      report: minimalReport,
      reportVersion: "v1",
      renderVersion: "v1",
      createdAt,
    },
    payment: createPayment(),
    ...overrides,
  };
}

function createAdapter(): {
  readonly adapter: ReportPersistenceAdapter;
  readonly calls: AdapterCalls;
} {
  const calls: AdapterCalls = {
    createInputs: [],
  };

  const adapter: ReportPersistenceAdapter = {
    async create(input) {
      calls.createInputs.push(input);

      return {
        ok: true,
        record: input.record,
      };
    },
    async update(input: UpdatePersistedReportInput) {
      throw new Error(`Unexpected update call: ${input.reportId}`);
    },
    async find(input: FindPersistedReportInput): Promise<PublicReportResult> {
      throw new Error(`Unexpected find call: ${input.reportId}`);
    },
    async softDelete(input: DeletePersistedReportInput) {
      throw new Error(`Unexpected softDelete call: ${input.reportId}`);
    },
    async list(input: ListPersistedReportsInput) {
      void input;

      return [];
    },
  };

  return { adapter, calls };
}

function expectFailureCode(
  result: Awaited<ReturnType<typeof persistPaidFullReport>>,
  code:
    | "PAID_REPORT_STORAGE_REQUIRES_PAID_ACCESS"
    | "PAID_REPORT_STORAGE_REQUIRES_COMPLETED_PAYMENT"
    | "PAID_REPORT_STORAGE_REQUIRES_PAYMENT_METADATA"
    | "PAID_REPORT_STORAGE_REQUIRES_PAYMENT_AMOUNT"
    | "PAID_REPORT_STORAGE_REQUIRES_PAYMENT_CURRENCY"
    | "PAID_REPORT_STORAGE_REQUIRES_PAID_TIMESTAMP",
): void {
  expect(result.ok).toBe(false);

  if (result.ok) {
    return;
  }

  expect(result.error.code).toBe(code);
}

function readSource(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

describe("persistPaidFullReport", () => {
  it("persists a valid paid full report exactly once", async () => {
    const record = createRecord();
    const { adapter, calls } = createAdapter();

    const result = await persistPaidFullReport({ adapter, record });

    expect(result.ok).toBe(true);
    expect(calls.createInputs).toEqual([{ record }]);

    if (result.ok) {
      expect(result.record).toEqual(record);
    }
  });

  it("rejects preview access before adapter create", async () => {
    const record = createRecord({ accessMode: "preview" });
    const { adapter, calls } = createAdapter();

    const result = await persistPaidFullReport({ adapter, record });

    expectFailureCode(result, "PAID_REPORT_STORAGE_REQUIRES_PAID_ACCESS");
    expect(calls.createInputs).toEqual([]);
  });

  it("rejects missing payment status before adapter create", async () => {
    const record = createRecord({
      payment: createPayment({
        paymentStatus: undefined as unknown as ReportPaymentStatus,
      }),
    });
    const { adapter, calls } = createAdapter();

    const result = await persistPaidFullReport({ adapter, record });

    expectFailureCode(result, "PAID_REPORT_STORAGE_REQUIRES_COMPLETED_PAYMENT");
    expect(calls.createInputs).toEqual([]);
  });

  it("rejects non-paid payment status before adapter create", async () => {
    const record = createRecord({
      payment: createPayment({ paymentStatus: "pending" }),
    });
    const { adapter, calls } = createAdapter();

    const result = await persistPaidFullReport({ adapter, record });

    expectFailureCode(result, "PAID_REPORT_STORAGE_REQUIRES_COMPLETED_PAYMENT");
    expect(calls.createInputs).toEqual([]);
  });

  it("rejects missing payment identifiers before adapter create", async () => {
    const record = createRecord({
      payment: createPayment({ providerPaymentId: "" }),
    });
    const { adapter, calls } = createAdapter();

    const result = await persistPaidFullReport({ adapter, record });

    expectFailureCode(result, "PAID_REPORT_STORAGE_REQUIRES_PAYMENT_METADATA");
    expect(calls.createInputs).toEqual([]);
  });

  it("rejects missing payment amount or currency before adapter create", async () => {
    const missingAmount = createRecord({
      payment: createPayment({ amount: undefined as unknown as number }),
    });
    const missingCurrency = createRecord({
      payment: createPayment({ currency: "" }),
    });
    const amountAdapter = createAdapter();
    const currencyAdapter = createAdapter();

    const amountResult = await persistPaidFullReport({
      adapter: amountAdapter.adapter,
      record: missingAmount,
    });
    const currencyResult = await persistPaidFullReport({
      adapter: currencyAdapter.adapter,
      record: missingCurrency,
    });

    expectFailureCode(amountResult, "PAID_REPORT_STORAGE_REQUIRES_PAYMENT_AMOUNT");
    expectFailureCode(
      currencyResult,
      "PAID_REPORT_STORAGE_REQUIRES_PAYMENT_CURRENCY",
    );
    expect(amountAdapter.calls.createInputs).toEqual([]);
    expect(currencyAdapter.calls.createInputs).toEqual([]);
  });

  it("rejects missing paid timestamp before adapter create", async () => {
    const record = createRecord({
      payment: createPayment({ paidAt: undefined }),
    });
    const { adapter, calls } = createAdapter();

    const result = await persistPaidFullReport({ adapter, record });

    expectFailureCode(result, "PAID_REPORT_STORAGE_REQUIRES_PAID_TIMESTAMP");
    expect(calls.createInputs).toEqual([]);
  });

  it("does not expose plaintext access token", async () => {
    const record = createRecord();
    const { adapter } = createAdapter();

    const result = await persistPaidFullReport({ adapter, record });
    const serializedResult = JSON.stringify(result);

    expect(serializedResult).not.toContain("rpat_");
    expect(serializedResult).not.toContain("plainText");
    expect(serializedResult).not.toContain("plaintext");
  });

  it("keeps create report route disconnected from paid storage boundary", () => {
    const routeSource = readSource("src/app/api/reports/create/route.ts");

    expect(routeSource).toContain("preview_memory");
    expect(routeSource).not.toContain("paidReportStorageBoundary");
    expect(routeSource).not.toContain("persistPaidFullReport");
  });

  it("does not introduce payment provider API or secret-role strings", () => {
    const boundarySource = readSource(
      "src/lib/persistence/paidReportStorageBoundary.ts",
    );
    const routeSource = readSource("src/app/api/reports/create/route.ts");
    const combinedSource = `${boundarySource}\n${routeSource}`;
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
      expect(combinedSource).not.toContain(marker);
    }
  });
});
