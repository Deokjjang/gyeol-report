import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

function readSource(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

const legalSources = [
  readSource("src/lib/legal/businessInfo.ts"),
  readSource("src/lib/legal/termsPolicy.ts"),
  readSource("src/lib/legal/privacyPolicy.ts"),
  readSource("src/lib/legal/refundPolicy.ts"),
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
      "support@gyeolreport.com",
      "https://www.gyeolreport.com",
      "2026-인천연수구-2118",
      "050-6664-8562",
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
      "src/app/business/page.tsx",
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
    const termsSource = [
      readSource("src/app/legal/terms/page.tsx"),
      readSource("src/app/terms/page.tsx"),
      readSource("src/lib/legal/termsPolicy.ts"),
      readSource("src/lib/legal/refundPolicy.ts"),
      readSource("src/lib/legal/businessInfo.ts"),
    ].join("\n");
    const expectedMarkers = [
      "목적",
      "사업자 정보",
      "서비스의 성격",
      "상품 및 제공 방식",
      "회원 또는 이용자 입력정보",
      "결제 및 유료 서비스",
      "이용권",
      "리포트 생성 및 열람",
      "청약철회 및 환불",
      "미성년자 이용",
      "만 14세 미만 이용 제한",
      "개인정보 처리",
      "저작권 및 이용범위",
      "금지행위",
      "서비스 변경·중단",
      "면책 및 책임 제한",
      "고객 문의 및 분쟁 처리",
      "약관 변경",
      "시행일",
      "GYEOL_BUSINESS_INFO.businessName",
      'businessName: "DVEM"',
      'representativeKo: "장덕민"',
      'businessRegistrationNumber: "184-27-02002"',
      "판매 상품: 사주×MBTI 종합 리포트, 직업·커리어·돈·학업 리포트, 연애·결혼·자녀 리포트, 궁합 리포트(4종)",
      "궁합 리포트는 연애, 결혼, 부모·자식, 직장 동료, 상사·부하, 사업/협업, 친구/인간관계 카테고리를 포함합니다.",
      "상품 유형: 입력값 기반 자동 생성 디지털 리포트",
      "결제 금액: 상품 페이지와 결제 화면에 표시된 금액",
      "제공 방식: 결제 후 온라인 열람",
      "서비스 제공기간: 결제 완료 후 보통 몇 분 안에 제공하며, 30분 안에 제공하지 못하면 이용자가 요청하지 않아도 자동으로 전액 환불합니다",
      "열람 가능 기간: v5부터 발행한 리포트는 회원 탈퇴, 삭제 요청, 서비스 종료 시까지 / v5 이전에 발행한 리포트는 처음 발행일로부터 90일",
      "자동 생성되는 디지털 리포트를 제공합니다",
      "의료·법률·투자 자문을 제공하지 않습니다",
      "결제 전 확인 화면에서 입력값을 수정할 수 있습니다",
      "생성 시작 후 이용자의 입력 오류로 인한 단순 재생성 또는 환불은 제한될 수 있습니다",
      "리포트 생성 전에는 결제일로부터 7일 이내 취소 및 환불을 요청할 수 있습니다",
      "결제 완료 후 30분 안에 리포트를 제공하지 못하면 요청하지 않아도 자동으로 전액 환불합니다. 중복결제, 시스템 오류, 회사 귀책 오류가 확인되는 경우 환불 또는 재제공을 진행합니다",
      "회사의 고의 또는 중대한 과실로 인한 손해에 대해서는 관련 법령에 따라 책임을 부담합니다",
      "termsPolicyEffectiveDateKo = POLICY_EFFECTIVE_DATE_KO",
    ];

    for (const marker of expectedMarkers) {
      expect(termsSource).toContain(marker);
    }

    const removedMarkers = [
      "초안",
      "사전 안내용",
      "최종 약관이 아닙니다",
      "결제 기능 공개 전에",
      "추후 정리",
      "별도 안내로 정리됩니다",
      "출시 전",
      "회사는 책임지지 않습니다",
      "과세유형",
    ];

    for (const marker of removedMarkers) {
      expect(termsSource).not.toContain(marker);
    }
  });

  it("contains required privacy content", () => {
    const privacySource = [
      readSource("src/app/privacy/page.tsx"),
      readSource("src/app/legal/privacy/page.tsx"),
      readSource("src/lib/legal/privacyPolicy.ts"),
      readSource("src/lib/legal/businessInfo.ts"),
    ].join("\n");
    const expectedMarkers = [
      "개인정보처리방침",
      // v5 최종3: 법정 필수 항목(번호 붙은 절)과 실제 쓰는 외부 서비스·버전별 보유 기간.
      "1. 개인정보의 처리 목적",
      "2. 처리하는 개인정보 항목",
      "3. 개인정보의 보유 기간",
      "4. 개인정보의 파기 절차와 방법",
      "5. 개인정보의 제3자 제공",
      "6. 개인정보 처리 위탁",
      "7. 개인정보의 국외 이전",
      "8. 정보주체의 권리와 행사 방법",
      "10. 자동 수집 장치(쿠키 등)의 설치·운영과 거부",
      "11. 개인정보의 안전성 확보 조치",
      "12. 개인정보 보호책임자",
      "14. 권익침해 구제 방법",
      "16. 방침의 변경과 시행일",
      "개인정보 문의처",
      "이름 또는 닉네임",
      "생년월일",
      "출생시간",
      "성별",
      "MBTI",
      "처음 발행일로부터 90일",
      "회원 탈퇴, 삭제 요청, 서비스 종료 시까지",
      "토스페이먼츠",
      "Supabase",
      "Anthropic",
      "Vercel Inc.",
      "회사는 주민등록번호를 수집하지 않습니다",
      "만 14세 미만은 서비스를 이용할 수 없습니다",
      "만 19세 미만 미성년자는 결제 시 법정대리인 동의가 필요하며",
      "회사는 건강정보, 질병정보, 정신질환 정보",
      "고객센터",
      "050-6664-8562",
      "support@gyeolreport.com",
      "GYEOL_BUSINESS_INFO.supportContactEmail",
      "GYEOL_BUSINESS_INFO.customerServicePhone",
    ];

    for (const marker of expectedMarkers) {
      expect(privacySource).toContain(marker);
    }
  });

  it("keeps privacy and pre-payment product copy safe", () => {
    const privacySources = [
      readSource("src/app/privacy/page.tsx"),
      readSource("src/app/legal/privacy/page.tsx"),
      readSource("src/lib/legal/privacyPolicy.ts"),
      readSource("src/components/payment/DevTossCheckoutLauncher.tsx"),
    ].join("\n");
    const blockedMarkers = [
      "적중률",
      "100% 맞춤",
      "보장",
      "반드시 성공",
      "운명 확정",
      "정신질환 분석",
      "우울증 분석",
      "불안장애 분석",
      "투자 추천",
    ];

    for (const marker of blockedMarkers) {
      expect(privacySources).not.toContain(marker);
    }
  });

  it("contains required refund content", () => {
    const refundSource = [
      readSource("src/app/refund/page.tsx"),
      readSource("src/app/legal/refund/page.tsx"),
      readSource("src/lib/legal/refundPolicy.ts"),
    ].join("\n");
    const expectedMarkers = [
      "환불 가능 시점",
      'href="/terms"',
      "refundPolicyStateRows",
      "문의 방법",
      "처리 기준",
      "리포트 생성 전에는 결제일로부터 7일 이내 취소 및 환불을 요청할 수 있습니다",
      "리포트 생성이 시작되거나 결과가 제공된 이후에는 디지털 콘텐츠 특성상 단순 변심 환불(청약철회)은 되지 않습니다",
      "이용권으로 만든 리포트는 환불하지 않으며, 30분 안에 제공하지 못하면 이용권을 자동으로 돌려드리고, 오류가 확인되면 다시 만들어 드리거나 이용권을 다시 드립니다",
      "결제 완료 후 30분 안에 리포트를 제공하지 못하면 요청하지 않아도 자동으로 전액 환불합니다. 중복결제, 시스템 오류, 회사 귀책 오류가 확인되는 경우 환불 또는 재제공을 진행합니다",
      "환불이 확정된 경우 관련 법령에 따라 환급 절차를 진행합니다",
      "미성년자가 법정대리인 동의 없이 결제한 경우 본인 또는 법정대리인이 계약 취소를 요청할 수 있습니다",
      "환불 또는 재생성 요청 시 결제일시, 결제금액, 입력한 이름 또는 닉네임, 오류 내용을 함께 보내주세요",
      "GYEOL_BUSINESS_INFO.customerServicePhone",
      "GYEOL_BUSINESS_INFO.supportContactEmail",
    ];

    for (const marker of expectedMarkers) {
      expect(refundSource).toContain(marker);
    }
  });

  it("keeps refund copy safe and non-absolute", () => {
    const refundSources = [
      readSource("src/app/refund/page.tsx"),
      readSource("src/app/legal/refund/page.tsx"),
      readSource("src/lib/legal/refundPolicy.ts"),
      readSource("src/components/payment/DevTossCheckoutLauncher.tsx"),
    ].join("\n");
    const blockedMarkers = [
      "어떠한 경우에도 환불 불가",
      "무조건 환불 불가",
      "전액 환불 불가",
      "회사는 책임지지 않습니다",
      "진단",
      "치료",
      "적중률",
      "100%",
      "보장",
      "반드시",
      "운명 확정",
    ];

    for (const marker of blockedMarkers) {
      expect(refundSources).not.toContain(marker);
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
