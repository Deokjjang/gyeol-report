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
  readSource("src/app/business/page.tsx"),
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
      "사업자정보",
      "이용약관",
      "개인정보처리방침",
      "환불정책",
      "DVEM",
      "장덕민",
      "184-27-02002",
      "인천광역시 연수구 인천타워대로 185, 10층 1001호 V206",
      "support@dvem.ai",
      "https://www.gyeolreport.com",
      "신고 진행 중",
      "010-3156-8568",
      "통신판매업 신고번호",
      "호스팅 제공자",
      "Vercel Inc.",
    ];

    for (const marker of expectedMarkers) {
      expect(legalSources).toContain(marker);
    }
  });

  it("keeps business info page focused on essential review fields", () => {
    const businessInfoSource = readSource(
      "src/app/legal/business-info/page.tsx",
    );
    const expectedMarkers = [
      "상호명",
      "서비스명",
      "대표자명",
      "사업자등록번호",
      "통신판매업 신고번호",
      "사업장 주소",
      "홈페이지",
      "고객센터",
      "이메일",
      "호스팅 제공자",
      "GYEOL_BUSINESS_INFO.supportContactEmail",
      "GYEOL_BUSINESS_INFO.hostingProvider",
    ];
    const removedMarkers = [
      "과세유형",
      "일반과세자",
      "개인정보보호 책임자",
      "공식 문의",
      "고객지원",
    ];

    for (const marker of expectedMarkers) {
      expect(businessInfoSource).toContain(marker);
    }

    for (const marker of removedMarkers) {
      expect(businessInfoSource).not.toContain(marker);
    }
  });

  it("contains root business page for review navigation", () => {
    const businessSource = readSource("src/app/business/page.tsx");
    const expectedMarkers = [
      "사업자 정보",
      "상호명",
      "대표자명",
      "사업자등록번호",
      "사업장 주소",
      "고객센터",
      "이메일",
      "통신판매업 신고번호",
      "호스팅 제공자",
    ];

    for (const marker of expectedMarkers) {
      expect(businessSource).toContain(marker);
    }

    expect(businessSource).not.toContain("과세유형");
  });

  it("contains required terms content", () => {
    const termsSource = readSource("src/app/legal/terms/page.tsx");
    const expectedMarkers = [
      "서비스",
      "유료 상품과 결제",
      "리포트 제공",
      "이용자의 책임",
      "해석의 한계",
      "환불 및 문의",
      "자기이해용 디지털 리포트",
      "런칭가 990원",
      "결제 승인 및 서버 확인 이후 온라인 열람",
      "타인의 정보를 무단으로 입력하면 안 됩니다",
      "의학, 법률, 투자, 심리진단, 미래 사건 예측을 보장하지 않습니다",
      "보장하지 않습니다",
      "GYEOL_BUSINESS_INFO.supportContactEmail",
    ];

    for (const marker of expectedMarkers) {
      expect(termsSource).toContain(marker);
    }

    const removedMarkers = ["서비스 제공자", "서비스 변경/중단", "책임 제한"];

    for (const marker of removedMarkers) {
      expect(termsSource).not.toContain(marker);
    }
  });

  it("contains required privacy content", () => {
    const privacySource = readSource("src/app/legal/privacy/page.tsx");
    const expectedMarkers = [
      "처리 목적",
      "수집 항목",
      "보관 기간",
      "결제 처리",
      "외부 서비스",
      "이용자 권리와 문의",
      "리포트 제공, 고객 문의, 결제/환불 처리, 부정 이용 방지",
      "생년월일",
      "출생시간",
      "성별",
      "MBTI",
      "시간대",
      "서비스 이용 기록",
      "주문/결제 식별 정보",
      "Toss Payments",
      "결제 처리: Toss Payments",
      "카드번호 등 민감한 결제수단 정보를 직접 저장하지 않습니다",
      "개인정보보호 책임자",
      "호스팅 제공자",
      "GYEOL_BUSINESS_INFO.hostingProvider",
      "GYEOL_BUSINESS_INFO.supportContactEmail",
      "GYEOL_BUSINESS_INFO.privacyOfficerName",
    ];

    for (const marker of expectedMarkers) {
      expect(privacySource).toContain(marker);
    }
  });

  it("contains required refund content", () => {
    const refundSource = readSource("src/app/legal/refund/page.tsx");
    const expectedMarkers = [
      "상품 성격",
      "취소 가능 시점",
      "환불 제한",
      "오류/중복 결제 처리",
      "문의",
      "디지털 콘텐츠",
      "결제 승인 전 또는 리포트 생성 전에는 취소가 가능할 수 있습니다",
      "단순 변심 환불이 제한될 수 있습니다",
      "중복 결제",
      "시스템 오류",
      "리포트 미제공",
      "제한될 수 있습니다",
      "확인 후 취소 또는 환불을 지원합니다",
      "GYEOL_BUSINESS_INFO.supportContactEmail",
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

  it("does not keep old customer phone placeholders", () => {
    const businessAndFooterSources = [
      readSource("src/lib/legal/businessInfo.ts"),
      readSource("src/components/legal/BusinessFooter.tsx"),
      readSource("src/app/legal/business-info/page.tsx"),
    ].join("\n");
    const blockedMarkers = [
      "고객센터 전화번호: " + "준비 " + "중",
      'customerServicePhone: "' + "준비 " + '중"',
    ];

    for (const marker of blockedMarkers) {
      expect(businessAndFooterSources).not.toContain(marker);
    }
  });
});
