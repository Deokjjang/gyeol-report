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

describe("supabase report persistence SDK client skeleton", () => {
  it("exports skeleton status", () => {
    expect(SUPABASE_REPORT_PERSISTENCE_SDK_CLIENT_STATUS).toBe("skeleton");
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
    const roleOnlyClient = createSupabaseReportPersistenceSdkClient({
      serviceRoleKey: "test-role-key",
    });

    const urlOnlyResult = await urlOnlyClient.findReportById("report_test_123");
    const roleOnlyResult =
      await roleOnlyClient.findReportById("report_test_123");

    expectUnavailableResult(urlOnlyResult);
    expectUnavailableResult(roleOnlyResult);
  });

  it("full config still returns unavailable query client in skeleton mode", async () => {
    const client = createSupabaseReportPersistenceSdkClient({
      supabaseUrl: "https://example.supabase.co",
      serviceRoleKey: "test-role-key",
    });
    const result = await client.findReportById("report_test_123");

    expectUnavailableResult(result);
  });

  it("source avoids real Supabase env and network markers", () => {
    const source = readSource(
      "src/lib/persistence/supabaseReportPersistenceSdkClient.ts",
    );
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
