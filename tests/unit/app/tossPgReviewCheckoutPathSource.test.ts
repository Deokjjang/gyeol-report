import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

function readSource(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

const homePathSource = [
  readSource("src/app/page.tsx"),
  readSource("src/app/products/page.tsx"),
  readSource("src/components/product/ProductGrid.tsx"),
  readSource("src/components/product/ProductTile.tsx"),
  readSource("src/lib/product/gyeolProducts.ts"),
].join("\n");

const productDetailSource = [
  readSource("src/app/products/saju-mbti-full/page.tsx"),
  readSource("src/lib/product/gyeolProducts.ts"),
].join("\n");
const reportNewSource = readSource("src/app/report/new/page.tsx");
const checkoutLauncherSource = readSource(
  "src/components/payment/DevTossCheckoutLauncher.tsx",
);
const successPageSource = readSource(
  "src/app/payments/toss/success/page.tsx",
);
const resultPageSource = readSource("src/app/reports/[reportId]/page.tsx");
const footerSource = [
  readSource("src/components/legal/BusinessFooter.tsx"),
  readSource("src/lib/legal/businessInfo.ts"),
].join("\n");

describe("Toss PG review checkout path source", () => {
  it("keeps the homepage and product pages connected to the report start path", () => {
    expect(homePathSource).toContain("GYEOL_HOME_PRODUCT_GRID");
    expect(homePathSource).toContain("상품 목록");
    expect(homePathSource).toContain("사주×MBTI 종합 리포트");
    expect(homePathSource).toContain('href: "/report/new?product=saju-mbti-full"');
    expect(homePathSource).toContain("href={product.href}");
    expect(homePathSource).toContain("const PRODUCT_PRICE_KO = \"1,290원\"");
    expect(homePathSource).toContain("priceLabelKo: PRODUCT_PRICE_KO");
    expect(homePathSource).toContain("retentionKo");
    expect(homePathSource).toContain("결제하고 리포트 생성하기");

    expect(productDetailSource).toContain('href="/report/new?product=saju-mbti-full"');
    expect(productDetailSource).toContain("상품명");
    expect(productDetailSource).toContain("판매가");
    expect(productDetailSource).toContain("결제금액 1,290원");
    expect(productDetailSource).toContain("90일");
    expect(productDetailSource).toContain("결제 후 온라인 리포트 생성/열람");
    expect(productDetailSource).toContain("자동 생성 디지털 리포트");
  });

  it("keeps the report input and pre-payment review capture-ready", () => {
    const combinedSource = [reportNewSource, checkoutLauncherSource].join("\n");
    const requiredMarkers = [
      "입력값 최종 확인",
      "이름",
      "생년월일",
      "출생시간",
      "성별",
      "MBTI",
      "결제 직전 확인",
      "상품명",
      "사주×MBTI 종합 리포트",
      "판매가",
      "총 결제금액",
      "1,290원",
      "90일",
      "결제 후 온라인 열람",
      "자동 생성 디지털 리포트",
      "생성 시작 후 단순 변심",
      "이용약관",
      "개인정보처리방침",
      "환불정책",
      "사업자정보",
      "만 14세",
      "법정대리인",
      "1,290원 결제하고 리포트 생성하기",
      "Toss 결제창 여는 중...",
    ];

    for (const marker of requiredMarkers) {
      expect(combinedSource).toContain(marker);
    }
  });

  it("keeps success and result pages ready for capture", () => {
    expect(successPageSource).toContain("결제 정보 확인 완료");
    expect(successPageSource).toContain(
      "결제 승인과 리포트 생성 처리는 서버 설정이 켜진 뒤 진행됩니다.",
    );
    expect(successPageSource).toContain("결제 승인 처리 중");
    expect(successPageSource).toContain("confirmTossPayment");
    expect(successPageSource).toContain("fulfillPaidProductReport");
    expect(successPageSource).toContain("다른 리포트 보기");
    expect(successPageSource).toContain("/report/new");
    expect(successPageSource).not.toContain("/api/payments/toss/confirm");

    expect(resultPageSource).toContain("사주×MBTI 종합 리포트");
    expect(resultPageSource).toContain("리포트 본문");
    expect(resultPageSource).toContain("리포트 준비 완료");
    expect(resultPageSource).toContain(
      "결제가 완료되었고 리포트가 생성되었습니다.",
    );
  });

  it("keeps footer business and policy links visible for review captures", () => {
    const requiredMarkers = [
      "사업자 정보",
      "상호명",
      "DVEM",
      "대표",
      "장덕민",
      "사업자등록번호",
      "184-27-02002",
      "통신판매업 신고번호",
      "신고 진행 중",
      "사업장 주소",
      "고객센터",
      "010-3156-8568",
      "이메일",
      "support@dvem.ai",
      "/terms",
      "/privacy",
      "/refund",
      "/business",
      "이용약관",
      "개인정보처리방침",
      "환불정책",
      "사업자정보",
    ];

    for (const marker of requiredMarkers) {
      expect(footerSource).toContain(marker);
    }
  });
});
