import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

function readFile(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

describe("paid unlock route source", () => {
  const sourcePath = "src/app/api/reports/unlock/route.ts";

  it("exports POST handler", () => {
    const source = readFile(sourcePath);

    expect(source).toContain("export async function POST");
    expect(source).toContain('import { NextResponse } from "next/server";');
    expect(source).toContain(
      'import { requirePaidUnlockEnabled } from "../../../../lib/launchFlags";',
    );
  });

  it("returns disabled paid unlock response", () => {
    const source = readFile(sourcePath);

    expect(source).toContain("PAID_UNLOCK_DISABLED");
    expect(source).toContain("ok: false");
    expect(source).toContain("messageKo");
    expect(source).toContain("requirePaidUnlockEnabled()");
  });

  it("returns HTTP 503", () => {
    const source = readFile(sourcePath);

    expect(source).toContain("status: 503");
  });

  it("documents skeleton boundaries", () => {
    const source = readFile(sourcePath);
    const lowerSource = source.toLowerCase();

    expect(lowerSource).toContain("skeleton");
    expect(source).toContain("no provider payment verification");
    expect(source).toContain("does not mutate persistence");
    expect(source).toContain("perform report unlock");
    expect(source).toContain("issue plaintext access token");
  });

  it("does not parse request body yet", () => {
    const source = readFile(sourcePath);
    const parseMarkers = [
      "request.json",
      "request.text",
      "request.formData",
      "await request",
      "Request",
      "NextRequest",
    ];

    for (const marker of parseMarkers) {
      expect(source).not.toContain(marker);
    }
  });

  it("avoids implementation markers", () => {
    const source = readFile(sourcePath);
    const implementationMarkers = [
      "@supabase/supabase-js",
      "@tosspayments",
      "fetch(",
      "createClient",
      "process.env",
      "NEXT_PUBLIC",
      "SECRET",
      "KEY",
      "TOKEN",
      "paymentKey",
      "providerPaymentId",
      "access_token",
      "raw card",
      "paid_unlocked",
      "accessMode",
      "paymentStatus",
    ];

    for (const marker of implementationMarkers) {
      expect(source).not.toContain(marker);
    }
  });

  it("avoids side-effect markers", () => {
    const source = readFile(sourcePath);
    const sideEffectMarkers = [
      "insert",
      "update",
      "delete",
      "upsert",
      "report_snapshot",
      "payment_order_id",
      "payment_provider_payment_id",
      "access_token_hash",
    ];

    for (const marker of sideEffectMarkers) {
      expect(source).not.toContain(marker);
    }
  });
});
