import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

function readFile(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

describe("toss webhook route source", () => {
  const sourcePath = "src/app/api/payments/toss/webhook/route.ts";

  it("exports POST handler", () => {
    const source = readFile(sourcePath);

    expect(source).toContain("export async function POST");
    expect(source).toContain('import { NextResponse } from "next/server";');
    expect(source).toContain(
      'import { requirePaymentEnabled } from "../../../../../lib/launchFlags";',
    );
  });

  it("returns disabled payment response", () => {
    const source = readFile(sourcePath);

    expect(source).toContain("PAYMENT_DISABLED");
    expect(source).toContain("ok: false");
    expect(source).toContain("messageKo");
    expect(source).toContain("requirePaymentEnabled()");
  });

  it("returns HTTP 503", () => {
    const source = readFile(sourcePath);

    expect(source).toContain("status: 503");
  });

  it("documents skeleton boundaries", () => {
    const source = readFile(sourcePath);
    const lowerSource = source.toLowerCase();

    expect(lowerSource).toContain("skeleton");
    expect(source).toContain("no provider signature verification");
    expect(source).toContain("does not mutate persistence");
    expect(source).toContain("report unlock");
  });

  it("does not parse provider payload yet", () => {
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
      "paid_unlocked",
      "accessMode",
      "paymentStatus",
      "report_snapshot",
    ];

    for (const marker of sideEffectMarkers) {
      expect(source).not.toContain(marker);
    }
  });
});
