import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import type { SupabaseReportQueryResult } from "@/lib/persistence/supabaseReportPersistenceClient";
import {
  createSupabaseReportPersistenceSdkClient,
  SUPABASE_REPORT_PERSISTENCE_SDK_CLIENT_STATUS,
} from "@/lib/persistence/supabaseReportPersistenceSdkClient";

const unavailableResult = {
  ok: false,
  code: "DB_UNAVAILABLE",
  messageKo: "Supabase reports query client is not connected.",
} as const;

function expectUnavailableResult<T>(
  result: SupabaseReportQueryResult<T>,
): void {
  expect(result).toEqual(unavailableResult);
}

function readSource(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

describe("supabase report persistence SDK client", () => {
  it("exports SDK-ready status", () => {
    expect(SUPABASE_REPORT_PERSISTENCE_SDK_CLIENT_STATUS).toBe("sdk_ready");
  });

  it("missing config returns unavailable query client", async () => {
    const client = createSupabaseReportPersistenceSdkClient();
    const result = await client.findReportById("report_test_123");

    expectUnavailableResult(result);
  });

  it("partial config returns unavailable query client", async () => {
    const urlOnlyClient = createSupabaseReportPersistenceSdkClient({
      supabaseUrl: "https://example.supabase.co",
    });
    const keyOnlyClient = createSupabaseReportPersistenceSdkClient({
      supabaseAnonKey: "test-anon-key",
    });

    const urlOnlyResult = await urlOnlyClient.findReportById("report_test_123");
    const keyOnlyResult =
      await keyOnlyClient.findReportById("report_test_123");

    expectUnavailableResult(urlOnlyResult);
    expectUnavailableResult(keyOnlyResult);
  });

  it("full fake config constructs SDK query client without immediate network", () => {
    const client = createSupabaseReportPersistenceSdkClient({
      supabaseUrl: "https://example.supabase.co",
      supabaseAnonKey: "test-anon-key",
    });

    expect(client.insertReport).toBeTypeOf("function");
    expect(client.updateReport).toBeTypeOf("function");
    expect(client.findReportById).toBeTypeOf("function");
    expect(client.listReports).toBeTypeOf("function");
  });

  it("source uses Supabase SDK with anon-key boundary only", () => {
    const source = readSource(
      "src/lib/persistence/supabaseReportPersistenceSdkClient.ts",
    );
    const blockedMarkers = [
      "process" + ".env",
      "NEXT" + "_PUBLIC",
      "service" + "_role",
      "SUPABASE" + "_SERVICE" + "_ROLE",
      "pass" + "word",
    ];

    expect(source).toContain("@supabase/supabase-js");
    expect(source).toContain("createClient");
    expect(source).toContain("supabaseAnonKey");

    for (const marker of blockedMarkers) {
      expect(source).not.toContain(marker);
    }
  });
});
