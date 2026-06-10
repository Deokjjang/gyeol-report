import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

function readSource(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

const legalSources = [
  readSource("src/lib/legal/businessInfo.ts"),
  readSource("src/components/legal/BusinessFooter.tsx"),
  readSource("src/components/legal/LegalPageLayout.tsx"),
  readSource("src/app/legal/page.tsx"),
  readSource("src/app/legal/business-info/page.tsx"),
  readSource("src/app/legal/terms/page.tsx"),
  readSource("src/app/legal/privacy/page.tsx"),
  readSource("src/app/legal/refund/page.tsx"),
].join("\n");

describe("legal page sources", () => {
  it("contains required legal and business page markers", () => {
    const expectedMarkers = [
      "사업자 정보",
      "이용약관",
      "개인정보처리방침",
      "환불/취소 정책",
      "DVEM",
      "장덕민",
      "184-27-02002",
      "22009",
      "인천광역시 연수구 인천타워대로 185, 10층 1001호 V206",
      "official@dvem.ai",
      "support@dvem.ai",
      "https://www.gyeolreport.com",
      "신고 진행 중",
      "준비 중",
    ];

    for (const marker of expectedMarkers) {
      expect(legalSources).toContain(marker);
    }
  });

  it("contains required terms content", () => {
    const termsSource = readSource("src/app/legal/terms/page.tsx");
    const expectedMarkers = [
      "목적",
      "서비스 제공자",
      "서비스 내용",
      "유료 상품 및 결제",
      "리포트 제공 방식",
      "이용자의 책임",
      "사주·MBTI 해석의 한계",
      "금지행위",
      "서비스 변경/중단",
      "책임 제한",
      "문의",
      "자기이해용",
      "의학, 법률, 투자",
      "실제 유료 제공은 결제 승인 및 서버 확인 이후",
      "보장하지 않습니다",
    ];

    for (const marker of expectedMarkers) {
      expect(termsSource).toContain(marker);
    }
  });

  it("contains required privacy content", () => {
    const privacySource = readSource("src/app/legal/privacy/page.tsx");
    const expectedMarkers = [
      "개인정보 처리 목적",
      "수집하는 개인정보 항목",
      "개인정보 보유 및 이용 기간",
      "결제 처리",
      "제3자 제공 및 처리위탁",
      "개인정보 파기",
      "이용자의 권리",
      "개인정보 보호 문의",
      "변경 고지",
      "생년월일",
      "출생시간",
      "성별",
      "MBTI",
      "시간대",
      "서비스 이용 기록",
      "결제 처리에 필요한 주문/결제 식별 정보",
      "결제대행사",
      "Toss Payments",
      "카드번호 등 민감한 결제수단 정보를 직접 저장하지 않습니다",
    ];

    for (const marker of expectedMarkers) {
      expect(privacySource).toContain(marker);
    }
  });

  it("contains required refund content", () => {
    const refundSource = readSource("src/app/legal/refund/page.tsx");
    const expectedMarkers = [
      "상품 성격",
      "결제 취소 가능 시점",
      "리포트 생성 후 환불 제한",
      "오류/중복 결제 처리",
      "환불 요청 방법",
      "처리 기간",
      "문의",
      "디지털 콘텐츠",
      "제한될 수 있습니다",
      "확인 후 취소 또는 환불을 지원합니다",
      "관련 법령",
    ];

    for (const marker of expectedMarkers) {
      expect(refundSource).toContain(marker);
    }
  });

  it("does not include payment implementation or secret markers", () => {
    const blockedMarkers = [
      "TOSS" + "_SECRET" + "_KEY",
      "SUPABASE" + "_SERVICE" + "_ROLE",
      "payment" + "Key",
      "provider" + "Payment" + "Id",
      "access" + "TokenHash",
      "share" + "Token",
      "/v1/" + "payments/confirm",
      "mark" + "Paid",
      "service" + "_role",
    ];

    for (const marker of blockedMarkers) {
      expect(legalSources).not.toContain(marker);
    }
  });
});
