import type { TicketBundleId } from "./bundleCatalog";
export type BundleStatus = "READY" | "CONFIRMING" | "PAID_PENDING_GRANT" | "GRANTED" | "REFUND_PENDING" | "REFUNDED" | "FAILED";
export type BundleOrder = {
  orderId: string; bundleId: TicketBundleId; quantity: number; amount: number; currency: "KRW";
  provider: "toss"; providerOrderId: string; status: BundleStatus;
  requestedAt: string; paidAt: string | null; grantedAt: string | null; refundedAt: string | null;
  grantId: string | null; refundState: string;
};
export type BundleResult = {
  ok: boolean; code?: string; order?: BundleOrder; orders?: BundleOrder[];
  pending?: boolean; token?: string; alreadyPaid?: boolean; recovery?: boolean;
  paymentKey?: string; remaining?: number; consumed?: number; running?: number;
};
export type BundleStore = { call(action: string, userId: string, data?: Record<string, unknown>): Promise<BundleResult> };
