import "server-only";
import { createHash, randomUUID } from "node:crypto";
import { normalizeReportInputPayload } from "../report-generation/reportInputAdapter";
import { purchaseMetadata } from "../library/model";
import type { CheckoutConsentEvidence } from "../payment/checkoutConsent";
import type { TicketResult } from "./service";
import { productOnSale, SALES_CLOSED_CODE, TICKET_PRODUCT_CODE, ticketProductAllowed } from "../ops/config";

export type TicketPublicationStore = { call(action: string, user: string | null, data?: Record<string, unknown>): Promise<TicketResult> };
export const validTicketRequestId = (id: unknown): id is string => typeof id === "string" && /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(id);

// Normalization is the existing six-product contract. Its ordered, stripped
// value is both the durable payload and the idempotency identity, never raw JSON.
export async function enqueueTicketPublication(store: TicketPublicationStore, user: string, requestId: string, payload: unknown, consent: CheckoutConsentEvidence, now: Date): Promise<TicketResult> {
  if (!validTicketRequestId(requestId)) return { ok: false, code: "INVALID_INPUT" };
  const normalized = normalizeReportInputPayload(payload, { now: () => now });
  if (!normalized.ok) return { ok: false, code: "INVALID_INPUT" };
  const input = normalized.value;
  // P6d-ops 1: 판매를 닫은 상품(대운·세운)은 이용권으로도 새로 만들 수 없다(이미 발행된 Book 열람은 그대로).
  if (!productOnSale(input.productKey)) return { ok: false, code: SALES_CLOSED_CODE };
  if (!ticketProductAllowed(input.productKey)) return { ok: false, code: TICKET_PRODUCT_CODE };
  try {
    return await store.call("enqueue", user, { requestId: requestId.toLowerCase(), input, productType: input.productKey,
      inputHash: createHash("sha256").update(JSON.stringify(input)).digest("hex"),
      reportId: `report_${randomUUID().replaceAll("-", "")}`, policyAt: now.toISOString(),
      consentEvidence: consent, ...purchaseMetadata(input) });
  } catch { return { ok: false, code: "STORAGE_UNAVAILABLE" }; }
}
