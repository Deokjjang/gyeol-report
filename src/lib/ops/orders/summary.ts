/** 고객 화면용 주문 요약(P6d-ops 4). 브라우저에서도 쓴다(서버 전용 값 없음). */
import { getReportProduct } from "../../payment/reportProductCatalog";

export type OrderSummary = {
  orderCode: string; productType: string; amount: number; paymentStatus: string; createdAt: string; paidAt: string | null; refundedAt: string | null;
  reportId: string | null; receiptUrl: string | null; bookStatus: string | null; edition: string | null; refundState: string | null; openRequests: number;
};
export type PendingBook = { reportId: string; productType: string; state: string; createdAt: string; notBefore: string | null; displayName: string };
export const REQUEST_REASONS = [["calc_error", "계산이 이상해요"], ["not_open", "책이 열리지 않아요"], ["delayed", "제본이 너무 오래 걸려요"], ["refund", "환불을 원해요"], ["other", "기타 문의"]] as const;
export type RequestReason = typeof REQUEST_REASONS[number][0];
export const isRequestReason = (v: unknown): v is RequestReason => REQUEST_REASONS.some(([k]) => k === v);

export function productLabel(key: string) { return getReportProduct(key)?.labelKo ?? "결리포트"; }
/** 결제·환불·Book 상태를 고객 말로. 정식본이 나오기 전 Book은 모두 "제본 중". */
export function orderStatusLabel(o: Pick<OrderSummary, "paymentStatus" | "bookStatus" | "edition" | "refundState">): string {
  if (o.paymentStatus === "refunded") return "환불 완료";
  if (o.paymentStatus === "canceled") return "결제 취소";
  if (o.refundState === "requested" || o.refundState === "processing" || o.refundState === "failed") return "환불 처리 중";
  if (o.bookStatus === "EXPIRED") return "열람 기간 종료";
  if (o.bookStatus === "COMPLETED") return o.edition === "interim" ? "임시본 공개 · 정식본 준비 중" : "책 완성";
  return "제본 중";
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
