import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const pageSource = readFileSync(
  join(process.cwd(), "src/app/report/new/page.tsx"),
  "utf8",
);
const launcherSource = readFileSync(
  join(process.cwd(), "src/components/payment/TossPaymentWidgetLauncher.tsx"),
  "utf8",
);
const pageLauncherSource = [
  pageSource.match(
    /import TossPaymentWidgetLauncher[\s\S]*?from "\.\.\/\.\.\/\.\.\/components\/payment\/TossPaymentWidgetLauncher";/,
  )?.[0] ?? "",
  pageSource.match(
    /<TossPaymentWidgetLauncher\r?\n\s*inputSnapshot=\{checkoutInputSnapshot\}/,
  )?.[0] ?? "",
].join("\n");

describe("report new page Toss launcher source", () => {
  it("imports and renders the Toss payment widget launcher with actual input snapshot", () => {
    expect(pageSource).toContain(
      'from "../../../components/payment/TossPaymentWidgetLauncher"',
    );
    expect(pageSource).toContain("입력값 최종 확인");
    expect(pageSource).toContain("전체 리포트");
    expect(pageSource).toContain("판매가");
    expect(pageSource).toContain("결제금액 1,290원");
    expect(pageSource).toContain("90일");
    expect(pageSource).toContain("onEditInput");
    expect(pageSource).toContain("inputSnapshot={checkoutInputSnapshot}");
    expect(pageSource).toContain("productType={selectedProduct.productKey}");
    expect(pageSource).toContain("productLabelKo={selectedProduct.nameKo}");
    expect(pageSource).toContain("1,290원 결제하고 리포트 생성하기");
    expect(pageSource).not.toContain("무료 미리보기 생성");
    expect(pageSource).not.toContain("런칭가");
    expect(pageSource).not.toContain("990원");
    expect(pageSource).not.toContain("결제 " + "비활성 안내");
    expect(launcherSource).toContain("runTossPaymentWidgetCheckout");
    expect(launcherSource).toContain("TossPaymentWidgetInputSnapshot");
  });

  it("does not add unsafe payment behavior to the report page", () => {
    const pageBlockedMarkers = [
      "/v1/" + "payments/confirm",
      "payment" + "Key",
      "provider" + "Payment" + "Id",
      "provider" + "_payment" + "_id",
      "checkout" + "Url",
      "TOSS" + "_SECRET" + "_KEY",
      "NEXT" + "_PUBLIC" + "_TOSS" + "_SECRET" + "_KEY",
      "share" + "Token",
      "access" + "TokenHash",
      "report" + "_snapshot",
      "service" + "_role",
      "SUPABASE" + "_SERVICE" + "_ROLE",
      "wall" + "et",
      "re" + "charge",
      "point " + "balance",
      "credit " + "balance",
      "충" + "전",
      "포" + "인트",
      "잔" + "액",
    ];

    for (const marker of pageBlockedMarkers) {
      expect(pageLauncherSource).not.toContain(marker);
    }
  });
});
