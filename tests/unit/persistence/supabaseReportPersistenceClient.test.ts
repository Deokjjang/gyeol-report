import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { createUnavailableSupabaseReportPersistenceQueryClient } from "@/lib/persistence/supabaseReportPersistenceClient";
import type { SupabaseReportRow } from "@/lib/persistence/supabaseReportPersistenceMapper";

const unavailableResult = {
  ok: false,
  code: "DB_UNAVAILABLE",
  messageKo: "Supabase reports query client is not connected.",
} as const;

function createRowFixture(): SupabaseReportRow {
  return {
    report_id: "report_test_123",
    status: "generated",
    access_mode: "preview",
    input_snapshot: {
      birthDate: "1996-12-06",
      birthTime: "14:15",
      birthTimeUnknown: false,
      calendarType: "SOLAR",
      timezone: "Asia/Seoul",
    },
    report_snapshot: {
      sections: [],
    },
    report_version: "v1",
    calculation_version: "v1",
    locale: "ko-KR",
    access_token_hash: "sha256:testhash",
    access_token_created_at: "2026-01-01T00:00:00.000Z",
    access_token_rotated_at: null,
    access_token_version: "v1",
    payment_order_id: null,
    payment_provider: null,
    payment_provider_payment_id: null,
    payment_status: null,
    payment_amount: null,
    payment_currency: null,
    payment_paid_at: null,
    payment_refunded_at: null,
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-01-01T00:00:00.000Z",
    deleted_at: null,
  };
}

function readSource(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

describe("supabase report persistence query client", () => {
  it("returns DB_UNAVAILABLE from unavailable insert", async () => {
    const client = createUnavailableSupabaseReportPersistenceQueryClient();
    const result = await client.insertReport(createRowFixture());

    expect(result).toEqual(unavailableResult);
  });

  it("returns DB_UNAVAILABLE from unavailable update", async () => {
    const client = createUnavailableSupabaseReportPersistenceQueryClient();
    const result = await client.updateReport("report_test", {
      updated_at: "2026-01-01T00:00:00.000Z",
    });

    expect(result).toEqual(unavailableResult);
  });

  it("returns DB_UNAVAILABLE from unavailable find", async () => {
    const client = createUnavailableSupabaseReportPersistenceQueryClient();
    const result = await client.findReportById("report_test");

    expect(result).toEqual(unavailableResult);
  });

  it("returns DB_UNAVAILABLE from unavailable list", async () => {
    const client = createUnavailableSupabaseReportPersistenceQueryClient();
    const result = await client.listReports({ limit: 10 });

    expect(result).toEqual(unavailableResult);
  });

  it("source avoids real Supabase client env and network markers", () => {
    const source = readSource(
      "src/lib/persistence/supabaseReportPersistenceClient.ts",
    );
    const blockedMarkers = [
      "@supabase/supabase-js",
      "process.env",
      "NEXT_PUBLIC",
      "fetch(",
      "createClient",
      "service" + "_role",
      "SUPABASE" + "_SERVICE" + "_ROLE",
      "pass" + "word",
    ];

    for (const marker of blockedMarkers) {
      expect(source).not.toContain(marker);
    }
  });
});
