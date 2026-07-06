import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { createInMemoryReportPersistenceAdapter } from "@/lib/persistence/inMemoryReportPersistenceAdapter";
import {
  createReportPersistenceRuntime,
  PREVIEW_REPORT_PERSISTENCE_ADAPTER_GLOBAL_KEY,
} from "@/lib/persistence/reportPersistenceRuntime";
import type { PersistedReportRecord } from "@/lib/persistence/reportPersistenceTypes";
import {
  createProductPreviewSnapshot,
  type ProductPreviewSnapshot,
  type ProductPreviewSnapshotDraft,
} from "@/lib/report-generation/productPreviewSnapshot";

const sourcePath = join(
  process.cwd(),
  "src/lib/persistence/inMemoryReportPersistenceAdapter.ts",
);
const source = readFileSync(sourcePath, "utf8");
const runtimeSourcePath = join(
  process.cwd(),
  "src/lib/persistence/reportPersistenceRuntime.ts",
);
const runtimeSource = readFileSync(runtimeSourcePath, "utf8");

const createdAt = "2026-01-01T00:00:00.000Z";
const laterAt = "2026-01-02T00:00:00.000Z";

const minimalReport = {
  version: "v1",
  titleKo: "결리포트",
  subtitleKo: "사주와 MBTI로 읽는 나의 결",
  sections: [],
  notices: [],
} as const;

const compatibilityDraft = {
  version: "compatibility_v1_draft",
  productType: "saju_mbti_compatibility",
  productVersion: "1.0",
  relationshipType: "love",
  personALabel: "A",
  personBLabel: "B",
  openingTitle: "A님과 B님의 궁합",
  openingSummary: "요약",
  coreLine: "핵심",
  scoreSummary: {
    totalScore: 70,
    scoreLabel: "조율형",
    scoreCaution: "참고값",
    breakdown: {
      attraction: 70,
      communication: 70,
      lifestyleRhythm: 70,
      conflictRecovery: 70,
      longTermStability: 70,
      growthComplement: 70,
    },
  },
  chartComparison: {
    personA: {},
    personB: {},
  },
  keyCompatibilityPoints: {
    attractionPoints: ["끌림"],
    strengthPoints: ["강점"],
    frictionPoints: ["마찰"],
    relationshipRules: ["규칙"],
  },
  relationshipAnalysis: {
    connectionSummary: "연결",
    firstImpression: "첫인상",
    stayingPower: "지속력",
    frictionPoints: ["마찰"],
    categoryReading: "관계 해석",
    aToBFatigue: "A 피로",
    bToAFatigue: "B 피로",
    communicationRecovery: "회복",
    roleMoneyLifeRhythm: "생활",
    categorySpecificAdvice: ["조언"],
    timingCautions: ["타이밍"],
    repairStrategy: ["유지"],
    riskManagement: ["리스크"],
  },
  chapters: [],
  finalAdvice: ["조언"],
  safetyNotes: ["안내"],
} as ProductPreviewSnapshotDraft;

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

function createProductPreview(): ProductPreviewSnapshot {
  const result = createProductPreviewSnapshot({
    reportId: "report_productpreview",
    createdAtIso: createdAt,
    productKey: "saju_mbti_compatibility",
    productSlug: "compatibility",
    draft: compatibilityDraft,
  });

  if (!result.ok) {
    throw new Error(`Product preview fixture failed: ${result.error}`);
  }

  return result.value;
}

function createProductPreviewRecord(): PersistedReportRecord {
  return createRecord({
    reportId: "report_productpreview",
    reportVersion: "product_preview_v1",
    reportSnapshot: {
      snapshotKind: "product_preview",
      productPreview: createProductPreview(),
      report: minimalReport,
      reportVersion: "product_preview_v1",
      renderVersion: "product_preview_v1",
      createdAt,
    },
  });
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
      expect(findResult.record.snapshotKind).toBe(
        "comprehensive_report_output",
      );
      if (findResult.record.snapshotKind === "comprehensive_report_output") {
        expect(findResult.record.report).toEqual(minimalReport);
      }
    }
  });

  it("normalizes legacy comprehensive snapshots without snapshotKind", async () => {
    const adapter = createInMemoryReportPersistenceAdapter();
    const record = createRecord();

    expect(record.reportSnapshot.snapshotKind).toBeUndefined();

    await adapter.create({ record });
    const findResult = await adapter.find({ reportId: record.reportId });

    expect(findResult.ok).toBe(true);
    if (findResult.ok) {
      expect(findResult.record.snapshotKind).toBe(
        "comprehensive_report_output",
      );
    }
  });

  it("creates and finds a product preview snapshot", async () => {
    const adapter = createInMemoryReportPersistenceAdapter();
    const record = createProductPreviewRecord();

    const createResult = await adapter.create({ record });
    const findResult = await adapter.find({ reportId: record.reportId });

    expect(createResult.ok).toBe(true);
    expect(findResult.ok).toBe(true);
    if (findResult.ok) {
      expect(findResult.record.reportId).toBe(record.reportId);
      expect(findResult.record.snapshotKind).toBe("product_preview");
      if (findResult.record.snapshotKind === "product_preview") {
        expect(findResult.record.productPreview).toEqual(
          record.reportSnapshot.productPreview,
        );
        expect(findResult.record).not.toHaveProperty("report");
      }
    }
  });

  it("shares product preview snapshots across preview-memory runtime instances", async () => {
    const firstRuntime = createReportPersistenceRuntime({
      mode: "preview_memory",
    });
    const secondRuntime = createReportPersistenceRuntime({
      mode: "preview_memory",
    });
    const record = createProductPreviewRecord();

    expect(firstRuntime.ok).toBe(true);
    expect(secondRuntime.ok).toBe(true);

    if (!firstRuntime.ok || !secondRuntime.ok) {
      throw new Error("Preview memory runtime fixture failed.");
    }

    await firstRuntime.adapter.create({ record });
    const findResult = await secondRuntime.adapter.find({
      reportId: record.reportId,
    });

    expect(findResult.ok).toBe(true);
    if (findResult.ok) {
      expect(findResult.record.snapshotKind).toBe("product_preview");
      if (findResult.record.snapshotKind === "product_preview") {
        expect(findResult.record.productPreview.reportId).toBe(record.reportId);
      }
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

  it("can return existing record for duplicate create when configured", async () => {
    const adapter = createInMemoryReportPersistenceAdapter([], {
      duplicateCreateMode: "return_existing",
    });
    const record = createRecord();

    await adapter.create({ record });
    const duplicateResult = await adapter.create({
      record: {
        ...record,
        updatedAt: laterAt,
      },
    });

    expect(duplicateResult.ok).toBe(true);
    if (duplicateResult.ok) {
      expect(duplicateResult.record.updatedAt).toBe(createdAt);
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

  it("does not import Supabase, payment, or API routes", () => {
    expect(source).not.toContain("supabase");
    expect(source).not.toContain("payment");
    expect(source).not.toContain("api/reports");
  });

  it("keeps preview-memory runtime on a unique globalThis store", () => {
    expect(runtimeSource).toContain("globalThis");
    expect(runtimeSource).toContain(PREVIEW_REPORT_PERSISTENCE_ADAPTER_GLOBAL_KEY);
    expect(PREVIEW_REPORT_PERSISTENCE_ADAPTER_GLOBAL_KEY).toBe(
      "__gyeol_report_preview_persistence_adapter_v1__",
    );
  });
});
