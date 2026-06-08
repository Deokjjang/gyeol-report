import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import type { ReportPersistenceAdapter } from "@/lib/persistence/reportPersistenceAdapter";
import {
  createPreviewReportPersistenceAdapter,
  createProductionReportPersistenceAdapter,
  createReportPersistenceRuntime,
  createReportPersistenceRuntimeFromEnv,
  REPORT_PERSISTENCE_MODE_ENV,
  SUPABASE_ANON_KEY_ENV,
  SUPABASE_URL_ENV,
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

  it("unset env uses preview memory mode", () => {
    const runtime = createReportPersistenceRuntimeFromEnv({});

    expect(runtime.ok).toBe(true);
    expect(runtime.mode).toBe("preview_memory");

    if (runtime.ok) {
      expectAdapter(runtime.adapter);
    }
  });

  it("explicit preview mode returns memory adapter", () => {
    const runtime = createReportPersistenceRuntime({ mode: "preview_memory" });
    const envRuntime = createReportPersistenceRuntimeFromEnv({
      REPORT_PERSISTENCE_MODE: "preview_memory",
    });

    expect(runtime.ok).toBe(true);
    expect(runtime.mode).toBe("preview_memory");
    expect(envRuntime.ok).toBe(true);
    expect(envRuntime.mode).toBe("preview_memory");

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

  it("supabase mode without env fails closed", () => {
    const runtime = createReportPersistenceRuntime({
      mode: "supabase",
    });
    const envRuntime = createReportPersistenceRuntimeFromEnv({
      REPORT_PERSISTENCE_MODE: "supabase",
    });
    const expectedFailure = {
      ok: false,
      mode: "supabase",
      code: "SUPABASE_REPORT_PERSISTENCE_UNAVAILABLE",
      messageKo: "Supabase report persistence is unavailable.",
    } as const;

    expect(runtime).toEqual(expectedFailure);
    expect(envRuntime).toEqual(expectedFailure);
  });

  it("supabase mode with partial env fails closed", () => {
    const urlOnly = createReportPersistenceRuntime({
      mode: "supabase",
      supabaseUrl: "https://example.supabase.co",
    });
    const keyOnly = createReportPersistenceRuntime({
      mode: "supabase",
      supabaseAnonKey: "test-anon-key",
    });
    const expectedFailure = {
      ok: false,
      mode: "supabase",
      code: "SUPABASE_REPORT_PERSISTENCE_UNAVAILABLE",
      messageKo: "Supabase report persistence is unavailable.",
    } as const;

    expect(urlOnly).toEqual(expectedFailure);
    expect(keyOnly).toEqual(expectedFailure);
  });

  it("supabase mode with fake env returns Supabase adapter runtime", () => {
    const runtime = createReportPersistenceRuntime({
      mode: "supabase",
      supabaseUrl: "https://example.supabase.co",
      supabaseAnonKey: "test-anon-key",
    });
    const envRuntime = createReportPersistenceRuntimeFromEnv({
      REPORT_PERSISTENCE_MODE: "supabase",
      SUPABASE_URL: "https://example.supabase.co",
      SUPABASE_ANON_KEY: "test-anon-key",
    });

    expect(runtime.ok).toBe(true);
    expect(runtime.mode).toBe("supabase");
    expect(envRuntime.ok).toBe(true);
    expect(envRuntime.mode).toBe("supabase");

    if (runtime.ok) {
      expectAdapter(runtime.adapter);
    }
  });

  it("createPreviewReportPersistenceAdapter returns adapter", () => {
    const adapter = createPreviewReportPersistenceAdapter();

    expectAdapter(adapter);
  });

  it("createProductionReportPersistenceAdapter returns adapter", () => {
    const adapter = createProductionReportPersistenceAdapter({
      supabaseUrl: "https://example.supabase.co",
      supabaseAnonKey: "test-anon-key",
    });

    expectAdapter(adapter);
  });

  it("source documents env-gated Supabase runtime mode", () => {
    const source = readSource("src/lib/persistence/reportPersistenceRuntime.ts");

    expect(REPORT_PERSISTENCE_MODE_ENV).toBe("REPORT_PERSISTENCE_MODE");
    expect(SUPABASE_URL_ENV).toBe("SUPABASE_URL");
    expect(SUPABASE_ANON_KEY_ENV).toBe("SUPABASE_ANON_KEY");
    expect(source).toContain("REPORT_PERSISTENCE_MODE");
    expect(source).toContain("preview_memory");
    expect(source).toContain("supabase");
    expect(source).toContain("SUPABASE_URL");
    expect(source).toContain("SUPABASE_ANON_KEY");
    expect(source).toContain("SUPABASE_REPORT_PERSISTENCE_UNAVAILABLE");
  });

  it("source avoids unsafe client and secret markers", () => {
    const source = readSource("src/lib/persistence/reportPersistenceRuntime.ts");
    const blockedMarkers = [
      "NEXT" + "_PUBLIC",
      "fetch" + "(",
      "service" + "_role",
      "SUPABASE" + "_SERVICE" + "_ROLE",
      "pass" + "word",
    ];

    for (const marker of blockedMarkers) {
      expect(source).not.toContain(marker);
    }
  });
});
