import "server-only";
import { createHash, randomUUID } from "node:crypto";
import { normalizeReportInputPayload } from "../report-generation/reportInputAdapter";
import { purchaseMetadata } from "../library/model";
import type { CheckoutConsentEvidence } from "../payment/checkoutConsent";
import type { TicketResult } from "./service";

export type TicketPublicationStore = { call(action: string, user: string | null, data?: Record<string, unknown>): Promise<TicketResult> };
export const validTicketRequestId = (id: unknown): id is string => typeof id === "string" && /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(id);

// Normalization is the existing six-product contract. Its ordered, stripped
// value is both the durable payload and the idempotency identity, never raw JSON.
export async function enqueueTicketPublication(store: TicketPublicationStore, user: string, requestId: string, payload: unknown, consent: CheckoutConsentEvidence, now: Date): Promise<TicketResult> {
  if (!validTicketRequestId(requestId)) return { ok: false, code: "INVALID_INPUT" };
  const normalized = normalizeReportInputPayload(payload, { now: () => now });
  if (!normalized.ok) return { ok: false, code: "INVALID_INPUT" };
  const input = normalized.value;
  try {
    return await store.call("enqueue", user, { requestId: requestId.toLowerCase(), input, productType: input.productKey,
      inputHash: createHash("sha256").update(JSON.stringify(input)).digest("hex"),
      reportId: `report_${randomUUID().replaceAll("-", "")}`, policyAt: now.toISOString(),
      consentEvidence: consent, ...purchaseMetadata(input) });
  } catch { return { ok: false, code: "STORAGE_UNAVAILABLE" }; }
}
