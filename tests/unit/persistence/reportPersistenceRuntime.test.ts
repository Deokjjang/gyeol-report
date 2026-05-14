import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import type { ReportPersistenceAdapter } from "@/lib/persistence/reportPersistenceAdapter";
import {
  createPreviewReportPersistenceAdapter,
  createProductionReportPersistenceAdapter,
  createReportPersistenceRuntime,
} from "@/lib/persistence/reportPersistenceRuntime";

function expectAdapter(adapter: ReportPersistenceAdapter): void {
  expect(adapter.create).toBeTypeOf("function");
  expect(adapter.update).toBeTypeOf("function");
  expect(adapter.find).toBeTypeOf("function");
  expect(adapter.softDelete).toBeTypeOf("function");
  expect(adapter.list).toBeTypeOf("function");
}

function readSource(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

describe("report persistence runtime", () => {
  it("default runtime uses preview memory mode", () => {
    const runtime = createReportPersistenceRuntime();

    expect(runtime.ok).toBe(true);
    expect(runtime.mode).toBe("preview_memory");

    if (runtime.ok) {
      expectAdapter(runtime.adapter);
    }
  });

  it("explicit preview mode returns memory adapter", () => {
    const runtime = createReportPersistenceRuntime({ mode: "preview_memory" });

    expect(runtime.ok).toBe(true);
    expect(runtime.mode).toBe("preview_memory");

    if (runtime.ok) {
      expectAdapter(runtime.adapter);
    }
  });

  it("disabled mode fails closed", () => {
    const runtime = createReportPersistenceRuntime({ mode: "disabled" });

    expect(runtime).toEqual({
      ok: false,
      mode: "disabled",
      code: "PERSISTENCE_DISABLED",
      messageKo: "Report persistence runtime is disabled.",
    });
  });

  it("production mode without config fails closed", () => {
    const runtime = createReportPersistenceRuntime({
      mode: "production_supabase",
    });

    expect(runtime).toEqual({
      ok: false,
      mode: "production_supabase",
      code: "PRODUCTION_PERSISTENCE_NOT_CONFIGURED",
      messageKo: "Production persistence is not configured.",
    });
  });

  it("production mode with partial config fails closed", () => {
    const urlOnly = createReportPersistenceRuntime({
      mode: "production_supabase",
      supabaseUrl: "https://example.supabase.co",
    });
    const roleOnly = createReportPersistenceRuntime({
      mode: "production_supabase",
      serviceRoleKey: "test-role-key",
    });
    const expectedFailure = {
      ok: false,
      mode: "production_supabase",
      code: "PRODUCTION_PERSISTENCE_NOT_CONFIGURED",
      messageKo: "Production persistence is not configured.",
    } as const;

    expect(urlOnly).toEqual(expectedFailure);
    expect(roleOnly).toEqual(expectedFailure);
  });

  it("production mode with config returns Supabase adapter runtime", async () => {
    const runtime = createReportPersistenceRuntime({
      mode: "production_supabase",
      supabaseUrl: "https://example.supabase.co",
      serviceRoleKey: "test-role-key",
    });

    expect(runtime.ok).toBe(true);
    expect(runtime.mode).toBe("production_supabase");

    if (!runtime.ok) {
      throw new Error("Expected production runtime success.");
    }

    expectAdapter(runtime.adapter);

    const result = await runtime.adapter.find({
      reportId: "report_test_123",
    });

    expect(result.ok).toBe(false);

    if (!result.ok) {
      expect(result.error.code).toBe("REPORT_STORAGE_ERROR");
      expect(result.error.messageKo).toContain(
        "Supabase report persistence adapter is a skeleton",
      );
    }
  });

  it("createPreviewReportPersistenceAdapter returns adapter", () => {
    const adapter = createPreviewReportPersistenceAdapter();

    expectAdapter(adapter);
  });

  it("createProductionReportPersistenceAdapter returns adapter", () => {
    const adapter = createProductionReportPersistenceAdapter({
      supabaseUrl: "https://example.supabase.co",
      serviceRoleKey: "test-role-key",
    });

    expectAdapter(adapter);
  });

  it("source avoids env SDK and network markers", () => {
    const source = readSource("src/lib/persistence/reportPersistenceRuntime.ts");
    const blockedMarkers = [
      "@" + "supabase/supabase-js",
      "process" + ".env",
      "NEXT" + "_PUBLIC",
      "fetch" + "(",
      "create" + "Client",
      "service" + "_role",
      "pass" + "word",
    ];

    for (const marker of blockedMarkers) {
      expect(source).not.toContain(marker);
    }
  });
});
