import "server-only";
import { createHash, randomUUID } from "node:crypto";
import { generateReportSnapshot, type ProductGenerator } from "../payment/paidReportReliability";
import { generateV4ShadowReport } from "../interpretation-v4/runtimeShadow";
import { validateV4Publication } from "../interpretation-v4/runtimeProjection";
import { getReportProduct } from "../payment/reportProductCatalog";
import { createAnnualCommerceAcceptance } from "../payment/annualPurchasePolicy";
import { normalizeReportInputPayload } from "../report-generation/reportInputAdapter";
import { purchaseMetadata } from "../library/model";
import { isRecord } from "../report-generation/productPublishGate";
import type { CheckoutConsentEvidence } from "../payment/checkoutConsent";
export type TicketResult = { ok: boolean; code?: string; state?: string; reportId?: string; [key: string]: unknown };
export type TicketStore = { call(action: string, user: string, data?: Record<string, unknown>): Promise<TicketResult> };
export const disabledTicketWriter = { enabled: false as const, reason: "flag_disabled" as const };
export const ticketFailure = (code: string): TicketResult => ({ ok: false, code });

// Internal/dev entry only. Account identity is supplied by the verified server
// session, NEVER by a request field. Production routes do not import this flow.
export async function redeemReportTicket(store: TicketStore, user: string, requestId: string, payload: unknown,
  options: { local?: boolean; now?: Date; generate?: ProductGenerator; consentEvidence?: CheckoutConsentEvidence } = {}): Promise<TicketResult> {
  if (!["test", "development"].includes(process.env.NODE_ENV)) return ticketFailure("NOT_FOUND");
  const now = options.now ?? new Date();
  if (!/^[a-zA-Z0-9_-]{16,100}$/.test(requestId) || !isRecord(payload) || !getReportProduct(payload.productKey)?.isPurchasable) return ticketFailure("INVALID_INPUT");
  const normalized = normalizeReportInputPayload(payload, { now: () => now });
  if (!normalized.ok) return ticketFailure("INVALID_INPUT");
  const hash = createHash("sha256").update(JSON.stringify(payload)).digest("hex");
  let reserved: TicketResult;
  try {
    reserved = await store.call("redeem", user, { requestId, inputHash: hash, productType: payload.productKey,
      reportId: options.local ? `book-local-${randomUUID()}` : `report_${randomUUID().replaceAll("-", "")}`,
      input: payload, consentEvidence: options.consentEvidence ?? null, ...purchaseMetadata(payload) });
  } catch { return ticketFailure("STORAGE_UNAVAILABLE"); }
  if (!reserved.ok || !reserved.fresh) return reserved;
  const origin = { redemptionId: reserved.redemptionId, token: reserved.token };
  const reverse = async (reason: string) => {
    try { return await store.call("reverse", user, { ...origin, reason }); }
    catch { return { ok: true, state: "RUNNING", reportId: reserved.reportId }; }
  };
  let publication;
  try {
    const createdAt = String(reserved.createdAt);
    const generate = options.generate ?? (async (input: unknown) => generateV4ShadowReport(input, { evaluatedAt: createdAt, policyDate: now.toISOString() }));
    const year = isRecord(payload.productOptions) ? Number(payload.productOptions.selectedYear) : NaN;
    publication = await generateReportSnapshot({ payload, product_type: String(payload.productKey), report_id: String(reserved.reportId), created_at: createdAt },
      disabledTicketWriter, "deterministic_fallback", generate, validateV4Publication,
      payload.productKey === "annual_fortune" ? createAnnualCommerceAcceptance(year, now) : undefined);
  } catch { return reverse("GENERATION_EXCEPTION"); }
  if (!publication.success) return reverse(publication.stage === "validation" ? "PUBLISH_REJECTED" : "GENERATION_FAILED");
  try {
    const result = await store.call("publish", user, { ...origin, snapshot: publication.snapshot, gateVersion: publication.gateVersion });
    return result.ok ? result : reverse(result.code === "PUBLISH_REJECTED" ? "PUBLISH_REJECTED" : "PERSISTENCE_REJECTED");
  } catch {
    // Unknown commit outcome: reversal itself locks/checks durable publication.
    // If publication committed, it returns COMPLETED and cannot restore a ticket.
    return reverse("PERSISTENCE_INTERRUPTED");
  }
}
