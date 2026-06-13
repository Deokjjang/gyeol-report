import { describe, expect, it } from "vitest";

import {
  termsPolicyDescriptionKo,
  termsPolicyEffectiveDateKo,
  termsPolicySections,
} from "../../../src/lib/legal/termsPolicy";

describe("terms policy constants", () => {
  const policyCopy = [
    termsPolicyDescriptionKo,
    termsPolicyEffectiveDateKo,
    ...termsPolicySections.flatMap((section) => [
      section.titleKo,
      ...section.bodyKo,
    ]),
  ].join("\n");

  it("defines finalized paid digital report terms sections", () => {
    expect(termsPolicySections.map((section) => section.titleKo)).toEqual([
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
    ]);
  });

  it("contains exact business and product information", () => {
    const expectedMarkers = [
      "상호명: DVEM",
      "대표자명: 장덕민",
      "사업자등록번호: 184-27-02002",
      "사업장 주소: 인천광역시 연수구 인천타워대로 185, 10층 1001호 V206",
      "고객센터: 010-3156-8568",
      "이메일: support@dvem.ai",
      "통신판매업 신고번호: 신고 진행 중",
      "호스팅 제공자: Vercel Inc.",
      "상품명: 사주×MBTI 종합 리포트",
      "상품 유형: 입력값 기반 자동 생성 디지털 리포트",
      "정가: 1,290원",
      "런칭가 및 실제 결제금액: 990원",
      "제공 방식: 결제 후 온라인 열람",
      "상담 여부: 사람 상담 아님",
    ];

    for (const marker of expectedMarkers) {
      expect(policyCopy).toContain(marker);
    }
  });

  it("aligns service, input, payment, refund, privacy, and minor terms", () => {
    const expectedMarkers = [
      "결리포트는 사용자가 입력한 이름 또는 닉네임, 생년월일, 출생시간, 성별, MBTI 등을 바탕으로 자동 생성되는 디지털 리포트를 제공합니다.",
      "본 서비스는 사람에 의한 1:1 상담이 아니며, 의료·법률·투자 자문을 제공하지 않습니다.",
      "리포트는 자기이해와 참고 목적의 정보입니다.",
      "이용자는 리포트 생성을 위해 정확한 입력값을 제공해야 합니다.",
      "결제 전 확인 화면에서 입력값을 수정할 수 있습니다.",
      "유료 상품의 가격, 제공 방식, 생성 방식은 상품 페이지와 결제 직전 화면에 표시됩니다.",
      "결제 완료 후 리포트 생성 절차가 시작될 수 있습니다.",
      "리포트는 온라인 열람 방식으로 제공됩니다.",
      "생성 시작 전에는 취소 및 환불을 요청할 수 있습니다.",
      "생성 시작 후에는 단순 변심에 의한 환불이 제한될 수 있습니다.",
      "시스템 장애, 중복결제, 결과 미제공, 회사 귀책 오류가 확인되는 경우 재생성 또는 환불을 진행합니다.",
      "미성년자가 법정대리인 동의 없이 결제한 경우 본인 또는 법정대리인이 계약 취소를 요청할 수 있습니다.",
      "만 14세 미만은 현재 서비스 이용이 제한됩니다.",
      "만 19세 미만 미성년자는 결제 시 법정대리인 동의가 필요합니다.",
      "개인정보 처리에 관한 구체적인 내용은 개인정보처리방침에서 정합니다.",
    ];

    for (const marker of expectedMarkers) {
      expect(policyCopy).toContain(marker);
    }
  });

  it("defines copyright, prohibited use, liability, dispute, and effective date terms", () => {
    const expectedMarkers = [
      "리포트 화면, 서비스 구성, 문구, 디자인, 시스템에 관한 권리는 회사 또는 정당한 권리자에게 있습니다.",
      "이용자는 본인이 결제한 리포트를 개인적·비상업적 용도로 열람할 수 있습니다.",
      "대량 복제, 재판매, 스크래핑, 자동 수집, 상업적으로 이용할 수 없습니다.",
      "타인의 정보를 무단으로 입력하는 행위",
      "결제 수단을 부정하게 사용하는 행위",
      "서비스를 스크래핑, 자동 수집, 역공학하는 행위",
      "회사는 관련 법령상 허용되는 범위에서 서비스 이용과 관련한 책임을 부담합니다.",
      "회사의 고의 또는 중대한 과실로 인한 손해에 대해서는 관련 법령에 따라 책임을 부담합니다.",
      "리포트는 참고 목적의 정보이며, 이용자의 최종 의사결정에 대한 책임은 이용자에게 있습니다.",
      "서비스 이용, 결제, 환불, 재생성, 오류 문의는 고객센터 010-3156-8568 또는 support@dvem.ai로 접수할 수 있습니다.",
      "약관 변경 시 서비스 화면 또는 공지사항을 통해 안내합니다.",
      "시행일: 2026년 6월 14일",
    ];

    for (const marker of expectedMarkers) {
      expect(policyCopy).toContain(marker);
    }
  });

  it("removes draft wording and unsafe liability or refund copy", () => {
    const blockedMarkers = [
      "초안",
      "사전 안내용",
      "최종 약관이 아닙니다",
      "결제 기능 공개 전에",
      "추후 정리",
      "별도 안내로 정리됩니다",
      "출시 전",
      "어떠한 경우에도 환불 불가",
      "무조건 환불 불가",
      "전액 환불 불가",
      "회사는 책임지지 않습니다",
      "모든 손해에 대해 책임지지 않습니다",
      "회사 책임은 전부 면제됩니다",
      "적중률",
      "100% 보장",
      "운명 확정",
    ];

    for (const marker of blockedMarkers) {
      expect(policyCopy).not.toContain(marker);
    }

    expect(policyCopy).not.toContain("과세유형");
  });
});
