import { TICKET_BUNDLES } from "./bundleCatalog";
import { REPORT_PRICE_KRW } from "../payment/reportProductCatalog";
import { bookForProduct } from "../book/product";
import type { BundleStatus } from "./bundleTypes";

// Approval requires a reviewed code change, never an env/query/browser override.
export const BUNDLE_PURCHASE_POLICY_VERSION: string | null = null;
export const MOCK_BUNDLE_POLICY = "local-bundle-review-v1";
export const BUNDLE_PURCHASE_FIELDS = ["product", "digitalDelivery", "purchasePolicy"] as const;
export const bundleEditions = () => TICKET_BUNDLES.map(b => ({ ...b, regular: b.quantity * REPORT_PRICE_KRW, saving: b.quantity * REPORT_PRICE_KRW - b.amount, unit: b.amount / b.quantity }));
export const bundleStatusText: Record<BundleStatus, string> = {
  READY: "결제 준비", CONFIRMING: "결제 확인 중", PAID_PENDING_GRANT: "결제 완료 · 이용권 지급 확인 중", GRANTED: "이용권 지급 완료",
  REFUND_PENDING: "환불 처리 확인 중", REFUNDED: "환불 완료", FAILED: "결제가 완료되지 않았습니다.",
};
export function safeBookProduct(value: unknown): string | null { return typeof value === "string" && bookForProduct(value) ? value : null; }
export const bundlePendingKey = "gyeol-bundle-pending-v1";
export const bundleReturnKey = "gyeol-bundle-book-return-v1";
export const receiptMethodKey = (product: string) => `gyeol-book-method-v1:${product}`;
export function validBundleConsent(value: unknown, version: string | null) {
  if (!version || !value || typeof value !== "object" || Array.isArray(value)) return false;
  const v = value as Record<string, unknown>;
  return Object.keys(v).length === 4 && v.version === version && BUNDLE_PURCHASE_FIELDS.every(k => v[k] === true);
}
export function ticketEventLabel(event: string, reason: string) {
  if (event === "REDEEM") return "책 발행 · 1장 사용";
  if (event === "REVERSAL") return "발행 실패 · 이용권 복구";
  if (event === "EXPIRE") return "이용권 만료";
  if (event === "REFUND") return "구매 환불 · 미사용 이용권 회수";
  if (event !== "GRANT") return "이용권 내역";
  if (reason.startsWith("PAID_BUNDLE_")) return "유료 구매 지급";
  if (reason.includes("REFERRAL")) return "친구 추천 지급";
  if (reason.includes("CAMPAIGN")) return "이벤트 지급";
  if (reason.includes("WELCOME")) return "가입 지급";
  return "이용권 지급";
}
