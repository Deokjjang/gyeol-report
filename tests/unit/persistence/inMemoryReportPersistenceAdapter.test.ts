import { describe, expect, it } from "vitest";

import { createInMemoryReportPersistenceAdapter } from "@/lib/persistence/inMemoryReportPersistenceAdapter";
import type { PersistedReportRecord } from "@/lib/persistence/reportPersistenceTypes";

const createdAt = "2026-01-01T00:00:00.000Z";
const laterAt = "2026-01-02T00:00:00.000Z";

const minimalReport = {
  version: "v1",
  titleKo: "결리포트",
  subtitleKo: "사주와 MBTI로 읽는 나의 결",
  sections: [],
  notices: [],
} as const;

function createRecord(
  overrides: Partial<PersistedReportRecord> = {},
): PersistedReportRecord {
  return {
    reportId: "report_abcdefghijklmn",
    createdAt,
    updatedAt: createdAt,
    status: "generated",
    reportVersion: "v1",
    calculationVersion: "v1",
    locale: "ko",
    accessMode: "preview",
    accessTokenHash: "sha256:testhash",
    accessTokenCreatedAt: createdAt,
    accessTokenVersion: "v1",
    inputSnapshot: {
      birthDate: "2024-02-04",
      birthTime: "17:27",
      birthTimeUnknown: false,
      calendarType: "SOLAR",
      timezone: "Asia/Seoul",
      mbti: "ENTJ",
    },
    reportSnapshot: {
      report: minimalReport,
      reportVersion: "v1",
      renderVersion: "v1",
      createdAt,
    },
    ...overrides,
  };
}

describe("createInMemoryReportPersistenceAdapter", () => {
  it("creates and finds a report", async () => {
    const adapter = createInMemoryReportPersistenceAdapter();
    const record = createRecord();

    const createResult = await adapter.create({ record });
    const findResult = await adapter.find({ reportId: record.reportId });

    expect(createResult.ok).toBe(true);
    expect(findResult.ok).toBe(true);
    if (findResult.ok) {
      expect(findResult.record.reportId).toBe(record.reportId);
      expect(findResult.record.report).toEqual(minimalReport);
    }
  });

  it("rejects duplicate create", async () => {
    const adapter = createInMemoryReportPersistenceAdapter();
    const record = createRecord();

    await adapter.create({ record });
    const duplicateResult = await adapter.create({ record });

    expect(duplicateResult.ok).toBe(false);
    if (!duplicateResult.ok) {
      expect(duplicateResult.error.code).toBe(
        "REPORT_STORAGE_VALIDATION_FAILED",
      );
    }
  });

  it("updates allowed fields", async () => {
    const adapter = createInMemoryReportPersistenceAdapter();
    const record = createRecord();

    await adapter.create({ record });
    const updateResult = await adapter.update({
      reportId: record.reportId,
      patch: {
        status: "paid_unlocked",
        accessMode: "paid",
        updatedAt: laterAt,
      },
    });
    const findResult = await adapter.find({
      reportId: record.reportId,
      accessMode: "paid",
    });

    expect(updateResult.ok).toBe(true);
    if (updateResult.ok) {
      expect(updateResult.record.status).toBe("paid_unlocked");
      expect(updateResult.record.accessMode).toBe("paid");
      expect(updateResult.record.updatedAt).toBe(laterAt);
    }
    expect(findResult.ok).toBe(true);
  });

  it("rejects update for missing report", async () => {
    const adapter = createInMemoryReportPersistenceAdapter();
    const updateResult = await adapter.update({
      reportId: "report_missingmissing",
      patch: {
        updatedAt: laterAt,
      },
    });

    expect(updateResult.ok).toBe(false);
    if (!updateResult.ok) {
      expect(updateResult.error.code).toBe("REPORT_STORAGE_WRITE_FAILED");
    }
  });

  it("blocks paid find for preview record", async () => {
    const adapter = createInMemoryReportPersistenceAdapter();
    const record = createRecord();

    await adapter.create({ record });
    const findResult = await adapter.find({
      reportId: record.reportId,
      accessMode: "paid",
    });

    expect(findResult.ok).toBe(false);
    if (!findResult.ok) {
      expect(findResult.error.code).toBe("REPORT_ACCESS_DENIED");
    }
  });

  it("soft deletes report", async () => {
    const adapter = createInMemoryReportPersistenceAdapter();
    const record = createRecord();

    await adapter.create({ record });
    const deleteResult = await adapter.softDelete({
      reportId: record.reportId,
      deletedAt: laterAt,
    });
    const findResult = await adapter.find({ reportId: record.reportId });

    expect(deleteResult.ok).toBe(true);
    if (deleteResult.ok) {
      expect(deleteResult.record.status).toBe("deleted");
      expect(deleteResult.record.deletedAt).toBe(laterAt);
      expect(deleteResult.record.updatedAt).toBe(laterAt);
    }
    expect(findResult.ok).toBe(false);
    if (!findResult.ok) {
      expect(findResult.error.code).toBe("REPORT_DELETED");
    }
  });

  it("rejects repeated soft delete", async () => {
    const adapter = createInMemoryReportPersistenceAdapter();
    const record = createRecord();

    await adapter.create({ record });
    await adapter.softDelete({
      reportId: record.reportId,
      deletedAt: laterAt,
    });
    const secondDeleteResult = await adapter.softDelete({
      reportId: record.reportId,
      deletedAt: "2026-01-03T00:00:00.000Z",
    });

    expect(secondDeleteResult.ok).toBe(false);
    if (!secondDeleteResult.ok) {
      expect(secondDeleteResult.error.code).toBe("REPORT_ALREADY_DELETED");
    }
  });

  it("lists records with status and limit in stable order", async () => {
    const first = createRecord({
      reportId: "report_aaaaaaaaaaaaa",
      status: "generated",
    });
    const second = createRecord({
      reportId: "report_bbbbbbbbbbbbb",
      status: "paid_unlocked",
      accessMode: "paid",
    });
    const third = createRecord({
      reportId: "report_ccccccccccccc",
      status: "generated",
    });
    const adapter = createInMemoryReportPersistenceAdapter([
      first,
      second,
      third,
    ]);

    const allRecords = await adapter.list({});
    const generatedRecords = await adapter.list({ status: "generated" });
    const limitedRecords = await adapter.list({ limit: 2 });

    expect(allRecords.map((record) => record.reportId)).toEqual([
      first.reportId,
      second.reportId,
      third.reportId,
    ]);
    expect(generatedRecords.map((record) => record.reportId)).toEqual([
      first.reportId,
      third.reportId,
    ]);
    expect(limitedRecords.map((record) => record.reportId)).toEqual([
      first.reportId,
      second.reportId,
    ]);
  });

  it("uses last duplicate initial record", async () => {
    const first = createRecord({
      updatedAt: createdAt,
      status: "generated",
    });
    const second = createRecord({
      updatedAt: laterAt,
      status: "paid_unlocked",
      accessMode: "paid",
    });
    const adapter = createInMemoryReportPersistenceAdapter([first, second]);

    const findResult = await adapter.find({
      reportId: first.reportId,
      accessMode: "paid",
    });
    const listResult = await adapter.list({});

    expect(findResult.ok).toBe(true);
    expect(listResult).toHaveLength(1);
    expect(listResult[0]?.updatedAt).toBe(laterAt);
    expect(listResult[0]?.status).toBe("paid_unlocked");
  });
});
