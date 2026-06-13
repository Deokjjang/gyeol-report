import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

function readAppFile(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

const policyPageSources = [
  readAppFile("src/app/terms/page.tsx"),
  readAppFile("src/app/privacy/page.tsx"),
  readAppFile("src/app/refund/page.tsx"),
] as const;

describe("policy page sources", () => {
  it("terms page contains finalized paid-service terms markers", () => {
    const source = [
      readAppFile("src/app/terms/page.tsx"),
      readAppFile("src/app/legal/terms/page.tsx"),
      readAppFile("src/lib/legal/termsPolicy.ts"),
      readAppFile("src/lib/legal/refundPolicy.ts"),
      readAppFile("src/lib/legal/businessInfo.ts"),
    ].join("\n");
    const expectedMarkers = [
      "이용약관",
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
      'businessName: "DVEM"',
      "사주×MBTI 종합 리포트",
      "입력값 기반 자동 생성 디지털 리포트",
      "정가: 1,290원",
      "런칭가 및 실제 결제금액: 990원",
      "결제 후 온라인 열람",
      "의료·법률·투자 자문을 제공하지 않습니다",
      "생성 시작 전에는 취소 및 환불을 요청할 수 있습니다",
      "회사의 고의 또는 중대한 과실",
      'termsPolicyEffectiveDateKo = "2026년 6월 14일"',
      "support@dvem.ai",
      "홈으로 돌아가기",
      'href="/"',
    ];

    for (const marker of expectedMarkers) {
      expect(source).toContain(marker);
    }
  });

  it("privacy page contains required policy placeholder markers", () => {
    const source = [
      readAppFile("src/app/privacy/page.tsx"),
      readAppFile("src/lib/legal/privacyPolicy.ts"),
      readAppFile("src/lib/legal/businessInfo.ts"),
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
      "접속기록",
      "고객 문의 정보",
      "토스페이먼츠",
      "Supabase",
      "OpenAI API",
      "국외에서 제공될 수 있습니다",
      "회사는 주민등록번호를 수집하지 않습니다",
      "만 14세 미만은 현재 버전에서 서비스를 이용할 수 없습니다",
      "법정대리인 동의가 필요하며",
      "본 서비스는 건강정보, 질병정보, 정신질환 정보",
      "010-3156-8568",
      "support@dvem.ai",
      "홈으로 돌아가기",
      'href="/"',
    ];

    for (const marker of expectedMarkers) {
      expect(source).toContain(marker);
    }
  });

  it("privacy and pre-payment copy avoids unsafe product claims", () => {
    const source = [
      readAppFile("src/app/privacy/page.tsx"),
      readAppFile("src/lib/legal/privacyPolicy.ts"),
      readAppFile("src/components/payment/DevTossCheckoutLauncher.tsx"),
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
      expect(source).not.toContain(marker);
    }
  });

  it("refund page contains required policy placeholder markers", () => {
    const source = [
      readAppFile("src/app/refund/page.tsx"),
      readAppFile("src/lib/legal/businessInfo.ts"),
      readAppFile("src/lib/legal/refundPolicy.ts"),
    ].join("\n");
    const expectedMarkers = [
      "환불정책",
      "상품 유형",
      "환불 가능 시점",
      "환불 제한 시점",
      "장애·중복결제·결과 미제공 처리",
      "입력값 오류 처리",
      "미성년자 취소 안내",
      "문의 방법",
      "처리 기준",
      "생성 시작 전에는 취소 및 환불을 요청할 수 있습니다",
      "생성 시작 후에는 단순 변심에 의한 환불이 제한될 수 있습니다",
      "시스템 장애, 중복결제, 결과 미제공, 회사 귀책 오류가 확인되는 경우 재생성 또는 환불을 진행합니다",
      "환불 또는 재생성 요청 시 결제일시, 결제금액, 입력한 이름 또는 닉네임, 오류 내용을 함께 보내주세요",
      "010-3156-8568",
      "support@dvem.ai",
      "홈으로 돌아가기",
      'href="/"',
    ];

    for (const marker of expectedMarkers) {
      expect(source).toContain(marker);
    }
  });

  it("refund and pre-payment policy copy avoids absolute no-refund wording", () => {
    const source = [
      readAppFile("src/app/refund/page.tsx"),
      readAppFile("src/lib/legal/refundPolicy.ts"),
      readAppFile("src/components/payment/DevTossCheckoutLauncher.tsx"),
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
      expect(source).not.toContain(marker);
    }
  });

  it("policy pages avoid final legal wording", () => {
    const blockedMarkers = [
      "초안",
      "사전 안내용",
      "최종 약관이 아닙니다",
      "결제 기능 공개 전에",
      "추후 정리",
      "별도 안내로 정리됩니다",
      "어떠한 경우에도 환불 불가",
      "무조건 환불 불가",
      "회사는 책임지지 않습니다",
      "최종 확정",
      "법률 자문",
      "보장합니다",
    ];

    for (const source of policyPageSources) {
      for (const marker of blockedMarkers) {
        expect(source).not.toContain(marker);
      }
    }
  });

  it("policy pages do not include payment implementation markers", () => {
    const blockedMarkers = [
      "createPayment",
      "confirmPayment",
      "TossPayments",
      "Paddle",
      "fetch(",
      "process.env",
    ];

    for (const source of policyPageSources) {
      for (const marker of blockedMarkers) {
        expect(source).not.toContain(marker);
      }
    }
  });
});
