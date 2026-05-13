import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import {
  createSupabaseReportPersistenceAdapter,
  SUPABASE_REPORT_PERSISTENCE_ADAPTER_STATUS,
} from "@/lib/persistence/supabaseReportPersistenceAdapter";
import type {
  CreatePersistedReportInput,
  DeletePersistedReportInput,
  FindPersistedReportInput,
  ListPersistedReportsInput,
  ReportPersistenceDeleteResult,
  ReportPersistenceWriteResult,
  UpdatePersistedReportInput,
} from "@/lib/persistence/reportPersistenceAdapter";
import type {
  PersistedReportRecord,
  PublicReportResult,
} from "@/lib/persistence/reportPersistenceTypes";
import type { ReportOutput } from "@/lib/report/types";

const createdAt = "2026-01-01T00:00:00.000Z";
const laterAt = "2026-01-02T00:00:00.000Z";
const skeletonMarker =
  "Supabase report persistence adapter is a skeleton and is not connected yet.";

const minimalReport: ReportOutput = {
  version: "v1",
  titleKo: "결리포트",
  subtitleKo: "테스트 리포트",
  sections: [],
  notices: [],
};

function createRecord(): PersistedReportRecord {
  return {
    reportId: "report_supabase_test",
    createdAt,
    updatedAt: createdAt,
    status: "generated",
    reportVersion: "v1",
    calculationVersion: "v1",
    locale: "ko",
    accessMode: "preview",
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
  };
}

type SkeletonFailureResult =
  | ReportPersistenceWriteResult
  | ReportPersistenceDeleteResult
  | PublicReportResult;

function expectSkeletonFailure(result: SkeletonFailureResult): void {
  expect(result.ok).toBe(false);

  if (!result.ok) {
    expect(result.error.messageKo).toContain(skeletonMarker);
  }
}

function readSource(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

describe("createSupabaseReportPersistenceAdapter", () => {
  it("exports skeleton status", () => {
    expect(SUPABASE_REPORT_PERSISTENCE_ADAPTER_STATUS).toBe("skeleton");
    expect(createSupabaseReportPersistenceAdapter).toBeTypeOf("function");
  });

  it("returns all adapter methods", () => {
    const adapter = createSupabaseReportPersistenceAdapter();

    expect(adapter.create).toBeTypeOf("function");
    expect(adapter.update).toBeTypeOf("function");
    expect(adapter.find).toBeTypeOf("function");
    expect(adapter.softDelete).toBeTypeOf("function");
    expect(adapter.list).toBeTypeOf("function");
  });

  it("returns skeleton failures or no records", async () => {
    const adapter = createSupabaseReportPersistenceAdapter();
    const record = createRecord();
    const createInput: CreatePersistedReportInput = { record };
    const updateInput: UpdatePersistedReportInput = {
      reportId: record.reportId,
      patch: { updatedAt: laterAt },
    };
    const findInput: FindPersistedReportInput = {
      reportId: record.reportId,
      accessToken: "rpat_abcdefghijklmnopqrstuvwxyz1",
    };
    const deleteInput: DeletePersistedReportInput = {
      reportId: record.reportId,
      deletedAt: laterAt,
    };
    const listInput: ListPersistedReportsInput = {};

    const createResult = await adapter.create(createInput);
    const updateResult = await adapter.update(updateInput);
    const findResult = await adapter.find(findInput);
    const deleteResult = await adapter.softDelete(deleteInput);
    const listResult = await adapter.list(listInput);

    expectSkeletonFailure(createResult);
    expectSkeletonFailure(updateResult);
    expectSkeletonFailure(findResult);
    expectSkeletonFailure(deleteResult);
    expect(listResult).toEqual([]);
  });

  it("accepts config without enabling persistence", async () => {
    const adapter = createSupabaseReportPersistenceAdapter({
      projectUrl: "https://example.supabase.co",
      serviceRoleKey: "test-service-role-key",
      schema: "public",
      tableName: "reports",
    });
    const record = createRecord();

    const createResult = await adapter.create({ record });
    const findResult = await adapter.find({ reportId: record.reportId });
    const listResult = await adapter.list({});

    expectSkeletonFailure(createResult);
    expectSkeletonFailure(findResult);
    expect(listResult).toEqual([]);
  });

  it("source omits blocked implementation markers", () => {
    const sourceText = readSource(
      "src/lib/persistence/supabaseReportPersistenceAdapter.ts",
    );
    const blockedMarkers = [
      "@" + "supabase/supabase-js",
      "process" + ".env",
      "fetch" + "(",
      "console" + ".",
    ];

    for (const marker of blockedMarkers) {
      expect(sourceText).not.toContain(marker);
    }

    const lowerSourceText = sourceText.toLowerCase();

    expect(sourceText).toContain("skeleton");
    expect(sourceText).toContain("not connected yet");
    expect(lowerSourceText).toContain("plaintext access tokens");
  });
});
