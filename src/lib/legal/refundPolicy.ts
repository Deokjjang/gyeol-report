export const refundPolicyStates = [
  "before_payment",
  "paid_before_generation",
  "generation_started",
  "generated",
  "generation_failed",
  "duplicate_payment",
  "system_error",
  "wrong_input",
  "minor_cancellation",
  "company_fault",
] as const;

export type RefundPolicyStateId = (typeof refundPolicyStates)[number];

export type RefundPolicyStateRow = {
  readonly id: RefundPolicyStateId;
  readonly statusKo: string;
  readonly handlingKo: string;
};

export const refundPolicyStateRows = [
  {
    id: "before_payment",
    statusKo: "결제 전",
    handlingKo: "자유 취소",
  },
  {
    id: "paid_before_generation",
    statusKo: "결제 완료 후, 생성 시작 전",
    handlingKo: "생성 시작 전에는 취소 및 환불을 요청할 수 있습니다.",
  },
  {
    id: "generation_started",
    statusKo: "생성 시작 후",
    handlingKo:
      "생성 시작 후에는 단순 변심에 의한 환불이 제한될 수 있습니다.",
  },
  {
    id: "generated",
    statusKo: "결과 생성 완료",
    handlingKo:
      "결과가 생성되어 온라인 열람이 가능해진 뒤에는 단순 변심에 의한 환불이 제한될 수 있습니다.",
  },
  {
    id: "generation_failed",
    statusKo: "결과 미제공",
    handlingKo:
      "결과 미제공이 확인되는 경우 재생성 또는 전액 환불을 진행합니다.",
  },
  {
    id: "duplicate_payment",
    statusKo: "중복결제",
    handlingKo: "중복결제가 확인되는 경우 전액 환불을 진행합니다.",
  },
  {
    id: "system_error",
    statusKo: "시스템 장애",
    handlingKo:
      "시스템 장애가 확인되는 경우 재처리, 재생성 또는 환불을 진행합니다.",
  },
  {
    id: "wrong_input",
    statusKo: "잘못된 입력값",
    handlingKo:
      "결제 전 확인 화면에서 수정할 수 있습니다. 생성 시작 후 입력 오류로 인한 단순 재생성 또는 환불은 제한될 수 있습니다.",
  },
  {
    id: "minor_cancellation",
    statusKo: "미성년자 법정 취소",
    handlingKo:
      "미성년자가 법정대리인 동의 없이 결제한 경우 본인 또는 법정대리인이 계약 취소를 요청할 수 있습니다.",
  },
  {
    id: "company_fault",
    statusKo: "회사 귀책 오류",
    handlingKo:
      "회사 귀책 오류가 확인되는 경우 재생성 또는 환불을 진행합니다.",
  },
] as const satisfies readonly RefundPolicyStateRow[];

export const refundPolicyRequiredNotices = [
  "생성 시작 전에는 취소 및 환불을 요청할 수 있습니다.",
  "생성 시작 후에는 단순 변심에 의한 환불이 제한될 수 있습니다.",
  "시스템 장애, 중복결제, 결과 미제공, 회사 귀책 오류가 확인되는 경우 재생성 또는 환불을 진행합니다.",
  "환불이 확정된 경우 관련 법령에 따라 환급 절차를 진행합니다.",
  "미성년자가 법정대리인 동의 없이 결제한 경우 본인 또는 법정대리인이 계약 취소를 요청할 수 있습니다.",
] as const;

export const refundPolicySupportRequestGuidanceKo =
  "환불 또는 재생성 요청 시 결제일시, 결제금액, 입력한 이름 또는 닉네임, 오류 내용을 함께 보내주세요.";

export const prePaymentRefundNoticeKo =
  "생성 시작 후 단순 변심에 의한 환불이 제한될 수 있으며, 장애·중복결제·결과 미제공·법령상 취소 사유는 예외입니다.";
