import { POLICY_EFFECTIVE_DATE_KO, POLICY_HISTORY } from "./policyVersions";

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
  "ticket_report",
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
    handlingKo:
      "리포트 생성 전에는 결제일로부터 7일 이내 취소 및 환불을 요청할 수 있습니다.",
  },
  {
    id: "generation_started",
    statusKo: "생성 시작 후",
    handlingKo:
      "생성이 시작되면 디지털 콘텐츠 특성상 단순 변심 환불(청약철회)은 되지 않습니다. 결제 직전 화면에서 이 내용을 확인하고 동의한 뒤 결제합니다.",
  },
  {
    id: "generated",
    statusKo: "결과 생성 완료",
    handlingKo:
      "결과가 생성되어 온라인 열람이 가능해진 뒤에도 단순 변심 환불(청약철회)은 되지 않습니다.",
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
  {
    id: "ticket_report",
    statusKo: "이용권으로 만든 리포트",
    handlingKo:
      "이용권으로 만든 리포트는 결제한 리포트와 같은 상품이지만 환불 대상이 아닙니다. 계산 오류·결과 미제공·시스템 장애 등 오류가 확인되면 다시 만들어 드리거나 이용권을 다시 드립니다. 이용권은 무상 증정이므로 현금으로 바꾸거나 환불할 수 없습니다. 결제가 환불되면 그 결제로 받은 아직 쓰지 않은 이용권(받지 않은 선물 포함)은 회수됩니다.",
  },
] as const satisfies readonly RefundPolicyStateRow[];

export const refundPolicyRequiredNotices = [
  "리포트 생성 전에는 결제일로부터 7일 이내 취소 및 환불을 요청할 수 있습니다.",
  "리포트 생성이 시작되거나 결과가 제공된 이후에는 디지털 콘텐츠 특성상 단순 변심 환불(청약철회)은 되지 않습니다.",
  "미제공, 중복결제, 시스템 오류, 회사 귀책 오류가 확인되는 경우 환불 또는 재제공을 진행합니다.",
  "환불이 확정된 경우 관련 법령에 따라 환급 절차를 진행합니다.",
  "미성년자가 법정대리인 동의 없이 결제한 경우 본인 또는 법정대리인이 계약 취소를 요청할 수 있습니다.",
  "이용권으로 만든 리포트는 환불하지 않으며, 오류가 확인되면 다시 만들어 드리거나 이용권을 다시 드립니다.",
] as const;

export const refundPolicySupportRequestGuidanceKo =
  "환불 또는 재생성 요청 시 결제일시, 결제금액, 입력한 이름 또는 닉네임, 오류 내용을 함께 보내주세요. 이용권으로 만든 리포트는 리포트 주소를 함께 보내주세요.";

export const prePaymentRefundNoticeKo =
  "리포트 생성 전에는 결제일로부터 7일 이내 환불 가능하며, 생성이 시작되면 디지털 콘텐츠 특성상 단순 변심 환불은 되지 않습니다. 미제공·중복결제·시스템 오류는 환불 또는 재제공합니다. 이용권으로 만든 리포트는 환불 대신 다시 만들어 드리거나 이용권을 다시 드립니다.";

/** 시행일·변경 이력(약관 「시행일」 절과 같은 모양). 환불정책 화면 두 곳(/refund 예전 화면, 책 화면의 정책 문서)이 그대로 그린다. */
export const refundPolicyEffectiveDateKo = POLICY_EFFECTIVE_DATE_KO;
export const refundPolicyHistoryLinesKo: readonly string[] = [`시행일: ${refundPolicyEffectiveDateKo}`, ...POLICY_HISTORY.refund.map(line => `변경 이력: ${line}`)];
