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

  it("keeps home page scoped to review-ready product CTA without paid overclaim", () => {
    const source = readFile("src/app/page.tsx");
    const expectedMarkers = [
      "ProductGrid",
      "GYEOL_HOME_PRODUCT_GRID",
      "사주×MBTI 종합 리포트",
      "입력한 생년월일과 MBTI를 바탕으로 명리 구조와 행동 패턴",
      "상담이 아닌 참고용 리포트",
      "결제 후 온라인 열람",
      "자동 생성 디지털 리포트",
      "1,290원 결제하고 리포트 생성하기",
      "90일간 열람",
    ];
    const activePurchaseMarkers = [
      "결제" + "하기",
      "구매" + "하기",
      "바로 " + "결제",
      "유료 " + "결제 시작",
    ];

    for (const marker of expectedMarkers) {
      expect(source).toContain(marker);
    }

    for (const marker of activePurchaseMarkers) {
      expect(source).not.toContain(marker);
    }
    expect(source).not.toContain("현재 구매 가능한 " + "상품 1개");
    expect(source).not.toContain("이용 " + "흐름");
  });

  it("keeps report new page safe checkout preparation copy visible", () => {
    const source = readFile("src/app/report/new/page.tsx");
    const expectedMarkers = [
      "입력값 최종 확인",
      "전체 리포트",
      "결제금액 1,290원",
      "1,290원 결제하고 리포트 생성하기",
      "리포트 생성을 위해 필요한 정보를 먼저 입력해 주세요.",
      "inputSnapshot={checkoutInputSnapshot}",
      "onEditInput",
      "TossPaymentWidgetLauncher",
    ];

    for (const marker of expectedMarkers) {
      expect(source).toContain(marker);
    }

    expect(source).not.toContain("무료 미리보기 생성");
    expect(source).not.toContain(
      "전체 리포트 영역은 " + "정식 결제 연동 이후 제공됩니다.",
    );
    expect(source).not.toContain("결제 " + "비활성 안내");
    expect(source).not.toContain(
      "현재 실제 결제는 아직 " + "활성화되어 있지 않습니다.",
    );
  });

  it("keeps report new page scoped to checkout preparation only", () => {
    const source = readFile("src/app/report/new/page.tsx");
    const expectedCheckoutMarkers = [
      "TossPaymentWidgetLauncher",
      "checkoutInputSnapshot",
      "productType={selectedProduct.productKey}",
    ];
    const paymentFlowMarkers = [
      "/api/reports/un" + "lock",
      "payment" + "Key",
      "provider" + "Payment" + "Id",
      "To" + "ss" + "Payments",
      "/v1/" + "payments/confirm",
      "mark" + "Paid",
      "share" + "Token",
    ];

    for (const marker of expectedCheckoutMarkers) {
      expect(source).toContain(marker);
    }

    for (const marker of paymentFlowMarkers) {
      expect(source).not.toContain(marker);
    }

    expect(source).not.toContain('fetch("/api/reports/create"');
    expect(source).not.toContain("/api/reports/mock-paid-complete");
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
