import { GYEOL_BUSINESS_INFO } from "./businessInfo";
import {
  prePaymentRefundNoticeKo,
  refundPolicyRequiredNotices,
} from "./refundPolicy";

export type TermsPolicySection = {
  readonly titleKo: string;
  readonly bodyKo: readonly string[];
};

export const termsPolicyEffectiveDateKo = "2026년 6월 14일";

export const termsPolicyDescriptionKo =
  "결리포트 유료 디지털 리포트 서비스의 이용 기준입니다.";

export const termsPolicySections = [
  {
    titleKo: "목적",
    bodyKo: [
      "본 약관은 DVEM이 운영하는 결리포트 서비스의 이용조건, 유료 디지털 리포트 제공, 결제, 환불, 이용자의 권리와 의무를 정합니다.",
    ],
  },
  {
    titleKo: "사업자 정보",
    bodyKo: [
      `상호명: ${GYEOL_BUSINESS_INFO.businessName}`,
      `대표자명: ${GYEOL_BUSINESS_INFO.representativeKo}`,
      `사업자등록번호: ${GYEOL_BUSINESS_INFO.businessRegistrationNumber}`,
      `사업장 주소: ${GYEOL_BUSINESS_INFO.businessAddressKo}`,
      `고객센터: ${GYEOL_BUSINESS_INFO.customerServicePhone}`,
      `이메일: ${GYEOL_BUSINESS_INFO.supportContactEmail}`,
      `통신판매업 신고번호: ${GYEOL_BUSINESS_INFO.mailOrderSalesRegistrationNumber}`,
      `호스팅 제공자: ${GYEOL_BUSINESS_INFO.hostingProvider}`,
    ],
  },
  {
    titleKo: "서비스의 성격",
    bodyKo: [
      "결리포트는 사용자가 입력한 이름 또는 닉네임, 생년월일, 출생시간, 성별, MBTI 등을 바탕으로 자동 생성되는 디지털 리포트를 제공합니다.",
      "본 서비스는 사람에 의한 1:1 상담이 아니며, 의료·법률·투자 자문을 제공하지 않습니다.",
      "리포트는 자기이해와 참고 목적의 정보입니다.",
    ],
  },
  {
    titleKo: "상품 및 제공 방식",
    bodyKo: [
      "판매 상품: 사주×MBTI 종합 리포트, 직업·커리어·돈·학업 리포트, 연애·결혼·자녀 리포트, 궁합 리포트, 대운 리포트, 세운 리포트",
      "궁합 리포트는 love, marriage, parentChild, coworker, managerReport, businessPartner, friendship 카테고리를 포함합니다.",
      "상품 유형: 입력값 기반 자동 생성 디지털 리포트",
      "실제 결제금액: 상품별 1,290원",
      "제공 방식: 결제 후 온라인 열람",
      "서비스 제공기간: 결제 완료 후 즉시 생성, 최대 24시간 이내 제공",
      "열람 가능 기간: 생성일로부터 90일",
      "상담 여부: 사람 상담 아님",
    ],
  },
  {
    titleKo: "회원 또는 이용자 입력정보",
    bodyKo: [
      "이용자는 리포트 생성을 위해 정확한 입력값을 제공해야 합니다.",
      "입력값이 다르거나 부정확한 경우 결과 내용이 달라질 수 있습니다.",
      "결제 전 확인 화면에서 입력값을 수정할 수 있습니다.",
      "생성 시작 후 이용자의 입력 오류로 인한 단순 재생성 또는 환불은 제한될 수 있습니다.",
    ],
  },
  {
    titleKo: "결제 및 유료 서비스",
    bodyKo: [
      "유료 상품의 가격, 제공 방식, 생성 방식은 상품 페이지와 결제 직전 화면에 표시됩니다.",
      "이용자는 결제 직전 화면에서 입력값, 상품명, 가격, 제공 방식, 환불 안내, 약관 및 개인정보 처리 기준을 확인한 뒤 결제를 진행합니다.",
      "결제 완료 후 리포트 생성 절차가 시작될 수 있습니다.",
    ],
  },
  {
    titleKo: "리포트 생성 및 열람",
    bodyKo: [
      "리포트는 결제 완료 후 입력값을 기준으로 자동 생성됩니다.",
      "리포트는 온라인 열람 방식으로 제공됩니다.",
      "시스템 장애나 결과 미제공이 확인되는 경우 회사는 재처리, 재생성 또는 환불 절차를 안내합니다.",
    ],
  },
  {
    titleKo: "청약철회 및 환불",
    bodyKo: [
      refundPolicyRequiredNotices[0],
      refundPolicyRequiredNotices[1],
      refundPolicyRequiredNotices[2],
      refundPolicyRequiredNotices[4],
      prePaymentRefundNoticeKo,
    ],
  },
  {
    titleKo: "미성년자 이용",
    bodyKo: [
      "만 19세 미만 미성년자는 결제 시 법정대리인 동의가 필요합니다.",
      "법정대리인 동의 없는 미성년자 계약은 본인 또는 법정대리인이 취소할 수 있습니다.",
    ],
  },
  {
    titleKo: "만 14세 미만 이용 제한",
    bodyKo: [
      "만 14세 미만은 현재 서비스 이용이 제한됩니다.",
      "회사는 현재 만 14세 미만 이용자의 법정대리인 동의 확인 절차를 제공하지 않습니다.",
    ],
  },
  {
    titleKo: "개인정보 처리",
    bodyKo: [
      "개인정보 처리에 관한 구체적인 내용은 개인정보처리방침에서 정합니다.",
      "리포트 생성을 위해 이름 또는 닉네임, 생년월일, 출생시간, 성별, MBTI 등이 처리될 수 있습니다.",
    ],
  },
  {
    titleKo: "저작권 및 이용범위",
    bodyKo: [
      "리포트 화면, 서비스 구성, 문구, 디자인, 시스템에 관한 권리는 회사 또는 정당한 권리자에게 있습니다.",
      "이용자는 본인이 결제한 리포트를 개인적·비상업적 용도로 열람할 수 있습니다.",
      "회사의 사전 동의 없이 리포트를 대량 복제, 재판매, 스크래핑, 자동 수집, 상업적으로 이용할 수 없습니다.",
    ],
  },
  {
    titleKo: "금지행위",
    bodyKo: [
      "타인의 정보를 무단으로 입력하는 행위",
      "허위 정보 또는 부정확한 정보를 고의로 입력하는 행위",
      "결제 수단을 부정하게 사용하는 행위",
      "서비스 결과물을 무단 재판매하거나 대량 복제하는 행위",
      "서비스를 스크래핑, 자동 수집, 역공학하는 행위",
      "서비스 운영을 방해하는 행위",
    ],
  },
  {
    titleKo: "서비스 변경·중단",
    bodyKo: [
      "회사는 서비스 운영상 필요한 경우 서비스의 전부 또는 일부를 변경하거나 중단할 수 있습니다.",
      "유료 결제와 관련된 중요한 변경이 있는 경우 서비스 화면 또는 공지사항을 통해 안내합니다.",
    ],
  },
  {
    titleKo: "면책 및 책임 제한",
    bodyKo: [
      "회사는 관련 법령상 허용되는 범위에서 서비스 이용과 관련한 책임을 부담합니다.",
      "회사의 고의 또는 중대한 과실로 인한 손해에 대해서는 관련 법령에 따라 책임을 부담합니다.",
      "리포트는 참고 목적의 정보이며, 이용자의 최종 의사결정에 대한 책임은 이용자에게 있습니다.",
    ],
  },
  {
    titleKo: "고객 문의 및 분쟁 처리",
    bodyKo: [
      `서비스 이용, 결제, 환불, 재생성, 오류 문의는 고객센터 ${GYEOL_BUSINESS_INFO.customerServicePhone} 또는 ${GYEOL_BUSINESS_INFO.supportContactEmail}로 접수할 수 있습니다.`,
      "회사는 접수된 문의를 확인한 뒤 서비스 운영 기준과 관련 법령에 따라 처리합니다.",
    ],
  },
  {
    titleKo: "약관 변경",
    bodyKo: [
      "약관 변경 시 서비스 화면 또는 공지사항을 통해 안내합니다.",
      "변경된 약관은 안내된 시행일부터 적용됩니다.",
    ],
  },
  {
    titleKo: "시행일",
    bodyKo: [`시행일: ${termsPolicyEffectiveDateKo}`],
  },
] as const satisfies readonly TermsPolicySection[];
