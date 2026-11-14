/** 고객 화면용 주문 요약(P6d-ops 4). 브라우저에서도 쓴다(서버 전용 값 없음). */
import { getReportProduct } from "../../payment/reportProductCatalog";
import { CONCLUSION_DEADLINE_MS } from "../config";

export type OrderSummary = {
  orderCode: string; productType: string; amount: number; paymentStatus: string; createdAt: string; paidAt: string | null; refundedAt: string | null;
  reportId: string | null; receiptUrl: string | null; bookStatus: string | null; edition: string | null; refundState: string | null; openRequests: number;
};
export type PendingBook = { reportId: string; productType: string; state: string; createdAt: string; notBefore: string | null; displayName: string };
/**
 * 서재 문의 사유(운영 Q 2부). 확인 없이 바로 처리할 수 있는 두 사유만 사이트에서 접수하고, 계산 문의는 접수하지 않고 카카오톡 채널로 보낸다.
 * 옛 사유(calc_error·delayed·refund·other)로 이미 접수된 요청은 관리자 화면 라벨(format.ts)로 그대로 보인다.
 */
export const REQUEST_REASONS = ["not_open", "double_paid"] as const;
export type RequestReason = typeof REQUEST_REASONS[number];
export const isRequestReason = (v: unknown): v is RequestReason => REQUEST_REASONS.some(k => k === v);

/** 결제 뒤 30분 안이고 책이 아직 만들어지는 중(운영 Q 2부: 「안 나와요」 대신 「지금 만드는 중이에요」). */
export function orderStillMaking(o: Pick<OrderSummary, "bookStatus" | "paidAt" | "createdAt">, now = Date.now()): boolean {
  const at = Date.parse(o.paidAt ?? o.createdAt);
  return o.bookStatus !== "COMPLETED" && o.bookStatus !== "FAILED_REQUIRES_ATTENTION" && o.bookStatus !== "EXPIRED" && Number.isFinite(at) && now - at < CONCLUSION_DEADLINE_MS;
}
export function productLabel(key: string) { return getReportProduct(key)?.labelKo ?? "결리포트"; }
/**
 * W3 P2 30분 결론: 주문의 지금 상태. 결제 확인 뒤 30분 안에 책(ready)이 나오거나 자동 전액 환불(refunding → refunded)로 끝난다.
 * concluding = 생성이 멈췄거나(확인 필요·포기) 30분이 지났는데 아직 환불 요청 전 — 「결과 확인 중」.
 */
export type OrderBookState = "making" | "concluding" | "refunding" | "refunded" | "ready" | "expired";
export function orderBookState(o: Pick<OrderSummary, "paymentStatus" | "bookStatus" | "edition" | "refundState" | "paidAt" | "createdAt">, now = Date.now()): OrderBookState {
  if (o.paymentStatus === "refunded" || o.paymentStatus === "canceled" || o.refundState === "done") return "refunded";
  if (o.refundState === "requested" || o.refundState === "processing" || o.refundState === "failed") return "refunding";
  if (o.bookStatus === "EXPIRED") return "expired";
  if (o.bookStatus === "COMPLETED") return "ready";
  const at = Date.parse(o.paidAt ?? o.createdAt);
  if (o.bookStatus === "FAILED_REQUIRES_ATTENTION" || o.edition === "gave_up" || (Number.isFinite(at) && now - at >= CONCLUSION_DEADLINE_MS)) return "concluding";
  return "making";
}
export const ORDER_STATE_LABELS: Record<OrderBookState, string> = {
  making: "책 만드는 중", concluding: "결과 확인 중", refunding: "결제 취소 중", refunded: "결제 취소 완료", ready: "책 완성", expired: "열람 기간 종료",
};
/** 결제 완료 화면의 한 줄(상태별). 책 화면으로 곧 넘어간다. */
export const ORDER_STATE_LINES: Record<OrderBookState, string> = {
  making: "책을 쓰기 시작했어요. 보통 3분 안팎 걸려요. 잠시 뒤 책 만드는 화면으로 넘어가요.",
  concluding: "결과를 확인하고 있어요. 책을 드리지 못하면 결제는 자동으로 취소돼요.",
  refunding: "책을 끝까지 만들지 못해 결제를 취소하고 있어요.",
  refunded: "결제를 취소했어요. 결제수단에 따라 바로 또는 영업일 3~5일 안에 돌아가요.",
  ready: "책이 다 됐어요. 잠시 뒤 책을 펼쳐 드릴게요.",
  expired: "열람 기간이 끝난 리포트예요.",
};
/** 결제·환불·Book 상태를 고객 말로(결제 완료 화면·주문 카드). */
export function orderStatusLabel(o: Pick<OrderSummary, "paymentStatus" | "bookStatus" | "edition" | "refundState" | "paidAt" | "createdAt">, now = Date.now()): string {
  return ORDER_STATE_LABELS[orderBookState(o, now)];
}
export function seoulDateTime(iso: string | null) {
  if (!iso || !Number.isFinite(Date.parse(iso))) return "-";
  return new Intl.DateTimeFormat("ko-KR", { timeZone: "Asia/Seoul", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date(iso));
}
export const won = (n: number) => `${n.toLocaleString("ko-KR")}원`;
/** 서버가 고객에게 넘기는 값만 남긴다(구매자 이메일·계정 id·결제 키 제외). */
export function publicSummary(o: Record<string, unknown>): OrderSummary {
  return { orderCode: String(o.orderCode), productType: String(o.productType), amount: Number(o.amount), paymentStatus: String(o.paymentStatus), createdAt: String(o.createdAt),
    paidAt: (o.paidAt as string) ?? null, refundedAt: (o.refundedAt as string) ?? null, reportId: (o.reportId as string) ?? null, receiptUrl: (o.receiptUrl as string) ?? null,
    bookStatus: (o.bookStatus as string) ?? null, edition: (o.edition as string) ?? null, refundState: (o.refundState as string) ?? null, openRequests: Number(o.openRequests ?? 0) };
}
