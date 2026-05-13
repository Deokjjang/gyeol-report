import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { POST as webhookPost } from "../../../src/app/api/payments/toss/webhook/route";
import { POST as unlockPost } from "../../../src/app/api/reports/unlock/route";

function readFile(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

describe("payment route skeleton runtime", () => {
  it("returns disabled response from Toss webhook POST", async () => {
    const response = await webhookPost();
    const body: unknown = await response.json();

    expect(response.status).toBe(503);
    expect(body).toEqual({
      ok: false,
      code: "PAYMENT_DISABLED",
      messageKo: "현재 결제 기능은 활성화되어 있지 않습니다.",
    });
  });

  it("returns disabled response from paid unlock POST", async () => {
    const response = await unlockPost();
    const body: unknown = await response.json();

    expect(response.status).toBe(503);
    expect(body).toEqual({
      ok: false,
      code: "PAID_UNLOCK_DISABLED",
      messageKo:
        "현재 유료 리포트 잠금 해제 기능은 활성화되어 있지 않습니다.",
    });
  });

  it("calls POST handlers without request objects", async () => {
    await expect(webhookPost()).resolves.toMatchObject({ status: 503 });
    await expect(unlockPost()).resolves.toMatchObject({ status: 503 });
  });

  it("keeps route sources free of implementation markers", () => {
    const routeSources = [
      readFile("src/app/api/payments/toss/webhook/route.ts"),
      readFile("src/app/api/reports/unlock/route.ts"),
    ];
    const markers = [
      "@supabase/supabase-js",
      "@tosspayments",
      "fetch(",
      "createClient",
      "process.env",
      "NEXT_PUBLIC",
      "paymentKey",
      "providerPaymentId",
      "access_token",
      "raw card",
    ];

    for (const source of routeSources) {
      for (const marker of markers) {
        expect(source).not.toContain(marker);
      }
    }
  });
});
