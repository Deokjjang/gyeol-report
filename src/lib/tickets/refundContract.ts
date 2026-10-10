// Business arithmetic, not a statutory eligibility decision. Stored purchase facts only.
export const refundReasons = { UNUSED: "남은 유료 이용권", STATUTORY: "법정 청약철회 검토", SERVICE_FAILURE: "서비스 미제공·하자", DUPLICATE_PAYMENT: "중복 결제", OTHER: "기타 개별 검토" } as const;
export type RefundReason = keyof typeof refundReasons;
export type RefundState = "REQUESTED" | "HELD" | "REVIEW_REQUIRED" | "APPROVED" | "PG_CANCEL_PENDING" | "PG_CANCEL_CONFIRMED" | "LEDGER_SETTLED" | "COMPLETED" | "WITHDRAWN" | "MANUAL_SETTLEMENT_REQUIRED" | "FAILED_REQUIRES_ATTENTION";
export type RefundView = { requestId: string; state: RefundState; reasonCode: RefundReason; amount: number | null; quantity: number | null; partial: boolean | null; createdAt: string; updatedAt: string; canWithdraw: boolean };
export type RefundQuote = { bundleOrderId: string; purchased: number; paidAmount: number; unitPrice: number | null; used: number; remaining: number; pending: number; refunded: number; estimate: number | null; reviewRequired: boolean; held: boolean; quotedAt: string };
export type RefundResult = { ok: boolean; code?: string; quote?: RefundQuote; refund?: RefundView | null; intent?: RefundIntent };
// Server-only facts. Never serialize intent to a customer response.
export type RefundIntent = { paymentKey: string; providerOrderId: string; originalAmount: number; amount: number; quantity: number; idempotencyKey: string; cancelReason: string; firstAttemptAt: string; token: string; canPost: boolean };
export interface RefundStore { call(action: string, userId: string, data: Record<string, unknown>): Promise<RefundResult> }
export function proportionalRefund(amount: number, granted: number, unused: number): number | null {
  if (![amount, granted, unused].every(Number.isSafeInteger) || amount<=0 || granted<=0 || unused<0 || unused>granted) return null;
  const a=BigInt(amount), g=BigInt(granted);
  return a%g===BigInt(0) ? Number((a/g)*BigInt(unused)) : null;
}
export const refundStateText: Record<RefundState, string> = {
  REQUESTED: "요청을 접수했습니다.", HELD: "이용권 사용을 일시 중지했습니다.", REVIEW_REQUIRED: "환불 금액과 결제 상태를 확인 중입니다.",
  APPROVED: "환불 금액 확인을 마쳤습니다. 결제 취소 전입니다.", PG_CANCEL_PENDING: "결제 취소 결과를 확인 중입니다.",
  PG_CANCEL_CONFIRMED: "결제 취소가 확인되었습니다. 이용권 정산 중입니다.", LEDGER_SETTLED: "이용권 정산을 마쳤습니다. 최종 확인 중입니다.",
  COMPLETED: "검증된 환불 처리가 완료되었습니다.", WITHDRAWN: "환불 요청을 철회했습니다.",
  MANUAL_SETTLEMENT_REQUIRED: "고객센터에서 개별 확인 중입니다.", FAILED_REQUIRES_ATTENTION: "처리 내역을 고객센터에서 확인 중입니다.",
};
export const refundPolicyCopy = "구매 당시 실제 결제금액을 지급 수량으로 나눈 단가로, 해당 구매의 미사용 유료 이용권을 비례 환불합니다. 사용분에 정상가를 소급 적용하거나 할인을 회수하지 않습니다. 무료 이용권은 금전 환불 대상이 아닙니다.";
export const refundRightsCopy = "법정 청약철회, 미제공·하자, 중복 결제 등은 별도 검토하며 법정 권리가 우선합니다. 환불 가능 기간·유효기간 고지·결제수단별 처리 기준은 최종 승인 대기 중입니다.";
