import { hashReportAccessTokenSync } from "./reportAccessTokenHash";
import type {
  PersistedReportRecord,
  PersistedReportSnapshot,
  ReportAccessMode,
  ReportPersistenceStatus,
} from "./reportPersistenceTypes";

export type PaidReportLookupStore = {
  readonly findByAccessTokenHash: (
    accessTokenHash: string,
  ) => Promise<PersistedReportRecord | null>;
};

export type PaidReportSafeView = {
  readonly reportId: string;
  readonly status: ReportPersistenceStatus;
  readonly accessMode: ReportAccessMode;
  readonly reportSnapshot: PersistedReportSnapshot;
  readonly reportVersion: string;
  readonly calculationVersion: string;
  readonly locale: string;
  readonly createdAt: string;
  readonly updatedAt: string;
};

export type PaidReportLookupErrorCode =
  | "PAID_REPORT_LOOKUP_INVALID_TOKEN"
  | "PAID_REPORT_LOOKUP_NOT_FOUND"
  | "PAID_REPORT_LOOKUP_NOT_UNLOCKED";

export type PaidReportLookupResult =
  | {
      readonly ok: true;
      readonly view: PaidReportSafeView;
    }
  | {
      readonly ok: false;
      readonly error: {
        readonly code: PaidReportLookupErrorCode;
        readonly messageKo: string;
      };
    };

export type FindPaidReportByShareTokenInput = {
  readonly shareToken: string;
  readonly store: PaidReportLookupStore;
};

function createLookupFailure(
  code: PaidReportLookupErrorCode,
  messageKo: string,
): PaidReportLookupResult {
  return {
    ok: false,
    error: {
      code,
      messageKo,
    },
  };
}

function hasReportSnapshot(
  record: PersistedReportRecord,
): record is PersistedReportRecord & {
  readonly reportSnapshot: PersistedReportSnapshot;
} {
  return (
    typeof record.reportSnapshot === "object" &&
    record.reportSnapshot !== null &&
    typeof record.reportSnapshot.report === "object" &&
    record.reportSnapshot.report !== null
  );
}

function toSafeView(record: PersistedReportRecord): PaidReportSafeView {
  return {
    reportId: record.reportId,
    status: record.status,
    accessMode: record.accessMode,
    reportSnapshot: record.reportSnapshot,
    reportVersion: record.reportVersion,
    calculationVersion: record.calculationVersion,
    locale: record.locale,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}

function isPaidUnlockedReport(
  record: PersistedReportRecord,
  accessTokenHash: string,
): boolean {
  return (
    record.accessTokenHash === accessTokenHash &&
    record.accessMode === "paid" &&
    record.status === "paid_unlocked" &&
    record.payment?.paymentStatus === "paid" &&
    record.deletedAt === undefined &&
    hasReportSnapshot(record)
  );
}

export async function findPaidReportByShareToken(
  input: FindPaidReportByShareTokenInput,
): Promise<PaidReportLookupResult> {
  const hashResult = hashReportAccessTokenSync(input.shareToken);

  if (!hashResult.ok) {
    return createLookupFailure(
      "PAID_REPORT_LOOKUP_INVALID_TOKEN",
      "리포트 공유 링크 형식이 올바르지 않습니다.",
    );
  }

  const record = await input.store.findByAccessTokenHash(hashResult.hash);

  if (record === null || record.status === "deleted") {
    return createLookupFailure(
      "PAID_REPORT_LOOKUP_NOT_FOUND",
      "공유 리포트를 찾을 수 없습니다.",
    );
  }

  if (!isPaidUnlockedReport(record, hashResult.hash)) {
    return createLookupFailure(
      "PAID_REPORT_LOOKUP_NOT_UNLOCKED",
      "열람 가능한 유료 리포트가 아닙니다.",
    );
  }

  return {
    ok: true,
    view: toSafeView(record),
  };
}
