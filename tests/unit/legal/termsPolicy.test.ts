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
    ]);
  });

  it("contains exact business and product information", () => {
    const expectedMarkers = [
      "결리포트는 DVEM이 운영합니다. 사업자 신원 및 고객 문의 정보는 사업자정보에서 확인할 수 있습니다.",
      "판매 상품: 사주×MBTI 종합 리포트, 직업·커리어·돈·학업 리포트, 연애·결혼·자녀 리포트, 궁합 리포트(4종). 대운 리포트와 세운 리포트는 판매를 잠시 멈췄으며",
      "궁합 리포트는 연애, 결혼, 부모·자식, 직장 동료, 상사·부하, 사업/협업, 친구/인간관계 카테고리를 포함합니다.",
      "상품 유형: 입력값 기반 자동 생성 디지털 리포트",
      "결제 금액: 상품 페이지와 결제 화면에 표시된 금액",
      "제공 방식: 결제 후 온라인 열람",
      "서비스 제공기간: 결제 완료 후 즉시 생성, 최대 24시간 이내 제공",
      "열람 가능 기간: v5부터 발행한 리포트는 회원 탈퇴, 삭제 요청, 서비스 종료 시까지 / v5 이전에 발행한 리포트는 처음 발행일로부터 90일",
    ];

    for (const marker of expectedMarkers) {
      expect(policyCopy).toContain(marker);
    }
    // 가격 숫자는 약관에 적지 않는다(상품 페이지·결제 화면 기준).
    expect(policyCopy).not.toMatch(/\d,\d{3}원/);
  });

  it("v5 최종3: AI 작성 고지, 참고 정보, 이용권 조항, 상대 동의, 서비스 종료 안내", () => {
    for (const marker of [
      "AI 작성 고지: 이 리포트는 명리 계산 결과와 MBTI 자료를 바탕으로 AI가 작성했어요.",
      "명리(사주)와 MBTI는 자기이해를 돕는 참고 정보이며, 리포트는 미래를 단정하거나",
      "유효기간: 이용권의 기한은 이용권에 표시된 날짜까지입니다(이번 이벤트 이용권은 2026년 11월 30일 23:59:59까지).",
      "선물 링크로 다른 회원에게 한 번 보낼 수 있으며, 받은 이용권의 기한은 처음 이용권에 표시된 날짜 그대로입니다. 받은 이용권은 다시 선물할 수 없습니다.",
      "이용권으로 만든 리포트는 환불하지 않으며, 계산 오류·결과 미제공 등 오류가 확인되면 다시 만들어 드립니다.",
      "이용권은 현금이나 다른 상품으로 바꿀 수 없고 환불되지 않습니다.",
      "부정한 방법",
      "다른 사람의 정보는 그 사람의 동의를 받은 뒤 입력해야 합니다.",
      "종료일 30일 전까지",
      "리포트 열람이 끝나는 날짜를 함께 안내합니다.",
    ]) expect(policyCopy).toContain(marker);
  });

  it("P 추가(2026-11-06): 회원만 결제, 이용권 기한·상품·환불해도 회수 안 함, 비회원·계정당 상한·친구 보너스 문구 없음", () => {
    for (const marker of [
      "리포트 결제는 카카오 또는 Google 계정으로 로그인한 회원만 할 수 있습니다.",
      "이용권으로 만들 수 있는 리포트는 사주×MBTI 종합, 직업·커리어·돈·학업, 연애·결혼·자녀, 궁합 리포트 4종입니다. 대운 리포트와 세운 리포트는 이용권으로 만들 수 없습니다.",
      "이용권을 준 결제가 환불되면 아직 쓰지 않은 그 이용권은 회수되고, 이미 쓴 이용권(그 이용권으로 만든 리포트)은 회수하지 않습니다.",
      "이용권으로 만든 리포트는 환불하지 않으며, 계산 오류·결과 미제공 등 오류가 확인되면 다시 만들어 드립니다.",
    ]) expect(policyCopy).toContain(marker);
    for (const blocked of ["비회원", "발급일로부터 30일", "아직 쓰지 않은 그 이용권은 회수됩니다", "계정당", "첫 결제", "보너스", "발급 당시 안내한 기간"]) expect(policyCopy).not.toContain(blocked);
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
      "리포트 생성 전에는 결제일로부터 7일 이내 취소 및 환불을 요청할 수 있습니다.",
      "리포트 생성이 시작되거나 결과가 제공된 이후에는 디지털 콘텐츠 특성상 단순 변심 환불(청약철회)은 되지 않습니다.",
      "미제공, 중복결제, 시스템 오류, 회사 귀책 오류가 확인되는 경우 환불 또는 재제공을 진행합니다.",
      "미성년자가 법정대리인 동의 없이 결제한 경우 본인 또는 법정대리인이 계약 취소를 요청할 수 있습니다.",
      "만 14세 미만은 서비스를 이용할 수 없습니다.",
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
      "이용자는 본인이 결제하거나 이용권으로 만든 리포트를 개인적·비상업적 용도로 열람할 수 있습니다.",
      "대량 복제, 재판매, 스크래핑, 자동 수집, 상업적으로 이용할 수 없습니다.",
      "타인의 정보를 동의 없이 입력하는 행위",
      "결제 수단을 부정하게 사용하는 행위",
      "서비스를 스크래핑, 자동 수집, 역공학하는 행위",
      "회사는 관련 법령상 허용되는 범위에서 서비스 이용과 관련한 책임을 부담합니다.",
      "회사의 고의 또는 중대한 과실로 인한 손해에 대해서는 관련 법령에 따라 책임을 부담합니다.",
      "리포트는 참고 목적의 정보이며, 이용자의 최종 의사결정에 대한 책임은 이용자에게 있습니다.",
      "서비스 이용, 결제, 환불, 재생성, 오류 문의는 고객센터 050-6664-8562 또는 support@gyeolreport.com로 접수할 수 있습니다.",
      "약관 변경 시 서비스 화면 또는 공지사항을 통해 안내합니다.",
      "시행일: ",
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
