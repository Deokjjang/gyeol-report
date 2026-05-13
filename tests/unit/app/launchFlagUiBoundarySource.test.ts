import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

function readFile(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

describe("launch flag UI boundary source", () => {
  it("locks launch flag utility paid defaults as disabled", () => {
    const source = readFile("src/lib/launchFlags.ts");
    const expectedMarkers = [
      "PAYMENT_ENABLED: false",
      "PAID_UNLOCK_ENABLED: false",
      "PUBLIC_PAID_LAUNCH_ENABLED: false",
      "INTERNAL_PREVIEW_ENABLED: true",
      "PAYMENT_DISABLED",
      "PAID_UNLOCK_DISABLED",
      "PUBLIC_PAID_LAUNCH_DISABLED",
    ];

    for (const marker of expectedMarkers) {
      expect(source).toContain(marker);
    }
  });

  it("keeps home page no-payment preview copy visible", () => {
    const source = readFile("src/app/page.tsx");
    const expectedMarkers = [
      "결제 없는 미리보기",
      "현재는 실제 결제 없이 리포트 미리보기만 제공합니다.",
      "정식 결제 및 전체 리포트 잠금 해제는 추후 제공 예정입니다.",
    ];
    const activePurchaseMarkers = [
      "결제하기",
      "구매하기",
      "바로 결제",
      "유료 결제 시작",
    ];

    for (const marker of expectedMarkers) {
      expect(source).toContain(marker);
    }

    for (const marker of activePurchaseMarkers) {
      expect(source).not.toContain(marker);
    }
  });

  it("keeps report new page inactive payment copy visible", () => {
    const source = readFile("src/app/report/new/page.tsx");
    const normalizedSource = source.replace(/\s+/g, " ");
    const expectedMarkers = [
      "결제 비활성 안내",
      "현재 실제 결제는 아직 활성화되어 있지 않습니다.",
      "전체 리포트 결제 및 잠금 해제 기능은 정식 결제 연동 이후 제공됩니다.",
      "정식 결제 연동 후 제공 예정",
    ];

    for (const marker of expectedMarkers) {
      expect(source).toContain(marker);
    }

    expect(normalizedSource).toContain(
      "현재 화면은 개발용 전체 미리보기 모드입니다.",
    );
  });

  it("keeps report new page from starting payment flow", () => {
    const source = readFile("src/app/report/new/page.tsx");
    const paymentFlowMarkers = [
      "/api/payments",
      "/api/reports/unlock",
      "paymentKey",
      "providerPaymentId",
      "Toss",
      "checkout",
    ];

    for (const marker of paymentFlowMarkers) {
      expect(source).not.toContain(marker);
    }

    expect(source).toContain('fetch("/api/reports/create"');
  });

  it("keeps runtime launch flags out of UI until a wiring task", () => {
    const sources = [
      readFile("src/app/page.tsx"),
      readFile("src/app/report/new/page.tsx"),
    ];
    const importMarkers = [
      "launchFlags",
      "resolveLaunchFlags",
      "isPaymentEnabled",
      "requirePaymentEnabled",
    ];

    for (const source of sources) {
      for (const marker of importMarkers) {
        expect(source).not.toContain(marker);
      }
    }
  });

  it("keeps home and report new source free of paid launch overclaims", () => {
    const combinedSource = [
      readFile("src/app/page.tsx"),
      readFile("src/app/report/new/page.tsx"),
    ].join("\n");
    const overclaimMarkers = [
      "유료 출시 준비 완료",
      "결제 연동 완료",
      "paid launch ready",
      "payment enabled",
    ];

    for (const marker of overclaimMarkers) {
      expect(combinedSource).not.toContain(marker);
    }
  });
});
