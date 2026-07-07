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
      "GYEOL_BUSINESS_INFO.representativeKo",
      "GYEOL_BUSINESS_INFO.businessRegistrationNumber",
      'businessName: "DVEM"',
      'representativeKo: "장덕민"',
      'businessRegistrationNumber: "184-27-02002"',
      "판매 상품: 사주×MBTI 종합 리포트, 직업·커리어·돈·학업 리포트, 연애·결혼·자녀 리포트, 궁합 리포트, 대운 리포트, 세운 리포트",
      "궁합 리포트는 love, marriage, parentChild, coworker, managerReport, businessPartner, friendship 카테고리를 포함합니다.",
      "상품 유형: 입력값 기반 자동 생성 디지털 리포트",
      "실제 결제금액: 상품별 1,290원",
      "제공 방식: 결제 후 온라인 열람",
      "서비스 제공기간: 결제 완료 후 즉시 생성, 최대 24시간 이내 제공",
      "열람 가능 기간: 생성일로부터 90일",
      "상담 여부: 사람 상담 아님",
      "자동 생성되는 디지털 리포트를 제공합니다",
      "의료·법률·투자 자문을 제공하지 않습니다",
      "결제 전 확인 화면에서 입력값을 수정할 수 있습니다",
      "생성 시작 후 이용자의 입력 오류로 인한 단순 재생성 또는 환불은 제한될 수 있습니다",
      "리포트 생성 전에는 결제일로부터 7일 이내 취소 및 환불을 요청할 수 있습니다",
      "미제공, 중복결제, 시스템 오류, 회사 귀책 오류가 확인되는 경우 환불 또는 재제공을 진행합니다",
      "회사의 고의 또는 중대한 과실로 인한 손해에 대해서는 관련 법령에 따라 책임을 부담합니다",
      'termsPolicyEffectiveDateKo = "2026년 6월 14일"',
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
      readSource("src/app/legal/privacy/page.tsx"),
      readSource("src/lib/legal/privacyPolicy.ts"),
      readSource("src/lib/legal/businessInfo.ts"),
    ].join("\n");
    const expectedMarkers = [
      "개인정보처리방침",
      "수집하는 개인정보 항목",
      "수집·이용 목적",
      "보유 및 이용기간",
      "결제 처리",
      "리포트 생성",
      "고객 문의 대응",
      "처리위탁 또는 외부 서비스 이용",
      "국외 처리 또는 국외 이전 가능성",
      "만 14세 미만 이용 제한",
      "미성년자 안내",
      "민감정보 수집 제한",
      "이용자의 권리",
      "개인정보 문의처",
      "이름 또는 닉네임",
      "생년월일",
      "출생시간",
      "성별",
      "MBTI",
      "결제 거래정보",
      "리포트 생성 및 열람 정보",
      "리포트 생성일로부터 90일",
      "생성된 리포트는 생성일로부터 90일간 온라인으로 열람할 수 있습니다",
      "90일 이후 리포트와 리포트 입력정보는 순차적으로 삭제될 수 있습니다",
      "결제·계약·청약철회·환불·분쟁 처리 관련 기록은 관련 법령에 따라 별도 보관될 수 있습니다",
      "접속기록",
      "고객 문의 정보",
      "토스페이먼츠",
      "Supabase",
      "OpenAI API",
      "호스팅 제공자",
      "국외에서 제공될 수 있습니다",
      "회사는 주민등록번호를 수집하지 않습니다",
      "만 14세 미만은 현재 버전에서 서비스를 이용할 수 없습니다",
      "만 19세 미만 미성년자는 결제 시 법정대리인 동의가 필요하며",
      "본 서비스는 건강정보, 질병정보, 정신질환 정보, 정치적 견해, 종교",
      "고객센터",
      "010-3156-8568",
      "support@dvem.ai",
      "GYEOL_BUSINESS_INFO.hostingProvider",
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
      readSource("src/app/legal/refund/page.tsx"),
      readSource("src/lib/legal/refundPolicy.ts"),
    ].join("\n");
    const expectedMarkers = [
      "상품 유형",
      "무형재화/자동 생성 디지털 콘텐츠",
      "판매 상품",
      "사주×MBTI 종합, 직업·커리어·돈·학업, 연애·결혼·자녀, 궁합, 대운, 세운 리포트",
      "실제 결제금액",
      "1,290원",
      "서비스 제공기간",
      "열람 가능 기간",
      "환불 가능 시점",
      "환불 제한",
      "장애·중복결제·결과 미제공 처리",
      "입력값 오류 처리",
      "미성년자 취소 안내",
      "문의 방법",
      "처리 기준",
      "리포트 생성 전에는 결제일로부터 7일 이내 취소 및 환불을 요청할 수 있습니다",
      "리포트 생성이 시작되거나 결과가 제공된 이후에는 디지털 콘텐츠 특성상 단순 변심에 의한 환불이 제한될 수 있습니다",
      "미제공, 중복결제, 시스템 오류, 회사 귀책 오류가 확인되는 경우 환불 또는 재제공을 진행합니다",
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
