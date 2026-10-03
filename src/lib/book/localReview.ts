import "server-only";
import { randomUUID } from "node:crypto";
import { normalizeReportInputPayload } from "../report-generation/reportInputAdapter";
import { createCheckoutConsentEvidence } from "../payment/checkoutConsent";
import { getReportProduct } from "../payment/reportProductCatalog";
import { prepareTossCheckoutRequest } from "../payment/tossCheckoutRequestAdapter";
import { preparePaymentCheckoutSession } from "../payment/paymentCheckoutSessionBoundary";
import { readPublishedReport, runPaidReportJob } from "../payment/paidReportReliability";
import type { ReliabilityStore } from "../payment/paidReportReliabilityStore";
import { createProductPreviewSnapshot, type ProductPreviewSnapshotDraft } from "../report-generation/productPreviewSnapshot";
import { generateV4ShadowReport } from "../interpretation-v4/runtimeShadow";
import { validateBookPublication } from "./storedReport";
import { isRecord } from "../report-generation/productPublishGate";
import { publishLocalLibrary } from "../library/localReview";
import { publishedReportExpiresAt } from "../payment/paidProductReportFulfillment";

type LocalOrder = { expires: number; payload: unknown; createdAt: string; snapshot?: unknown; pending?: Promise<unknown> };
// Explicit local mock store for the SAME read/validation boundary, not another
// persistence implementation. Bounded, process-local, discarded on restart.
const local = globalThis as typeof globalThis & { __bookReviewOrders?: Map<string, LocalOrder> };
const orders = () => local.__bookReviewOrders ??= new Map();
const allowed = () => process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test";
const failure = (error: string) => ({ ok: false as const, error });
function live(id: string) { const row = orders().get(id); if (row && row.expires > Date.now()) return row; orders().delete(id); return null; }

export function validateLocalBookInput(payload: unknown, now = new Date()) {
  if (!allowed()) return failure("NOT_FOUND");
  const result = normalizeReportInputPayload(payload, { now: () => now });
  return result.ok ? { ok: true as const } : failure(result.error);
}
export function prepareLocalBook(request: unknown, now = new Date()) {
  if (!allowed()) return failure("NOT_FOUND");
  if (!isRecord(request) || request.provider !== "toss" || !isRecord(request.inputSnapshot)) return failure("필수 항목을 확인해 주세요.");
  const input = request.inputSnapshot, payload = input.reportInputPayload;
  if (!isRecord(payload) || payload.productKey !== request.productType || typeof input.birthDate !== "string" || typeof input.displayName !== "string") return failure("필수 항목을 확인해 주세요.");
  const validation = validateLocalBookInput(payload, now), product = getReportProduct(request.productType);
  if (!validation.ok) return validation;
  if (!product?.isPurchasable || !createCheckoutConsentEvidence(request.consent, input.birthDate, now)) return failure("필수 항목을 확인해 주세요.");
  // Never trust a client price or client-selected report version.
  const orderId = `book-local-${randomUUID()}`;
  const session = preparePaymentCheckoutSession({ paymentOrderId: orderId, providerOrderId: orderId, productType: product.productType, provider: "toss", amount: product.amount, currency: product.currency, status: "ready" });
  if (!session.ok) return failure("모의 주문을 확인할 수 없습니다.");
  const checkout = prepareTossCheckoutRequest({ checkoutSession: session.session, clientKey: "local-mock-not-a-provider-key", successUrl: "http://127.0.0.1/dev/book-flow", failUrl: "http://127.0.0.1/dev/book-flow", allowLocalhostRedirects: true });
  if (!checkout.ok) return failure("모의 주문을 확인할 수 없습니다.");
  for (const [id, row] of orders()) if (row.expires <= Date.now()) orders().delete(id);
  if (orders().size >= 50) return failure("검수 세션을 다시 시작해 주세요.");
  orders().set(orderId, { expires: Date.now() + 60 * 60_000, payload: JSON.parse(JSON.stringify(payload)), createdAt: now.toISOString() });
  return { ok: true as const, orderId, tossCheckoutRequest: checkout.draft };
}
export async function publishLocalBook(id: string) {
  if (!allowed()) return failure("NOT_FOUND");
  const row = live(id);
  if (!row) return failure("로컬 검수 주문을 찾을 수 없습니다.");
  if (!row.pending) row.pending = (async () => {
    const generated = await generateV4ShadowReport(row.payload, { evaluatedAt: row.createdAt, policyDate: row.createdAt });
    if (!generated.ok) return failure("입력 정보로 책을 생성하지 못했습니다.");
    const payload = row.payload as { productKey: Parameters<typeof createProductPreviewSnapshot>[0]["productKey"]; productSlug: Parameters<typeof createProductPreviewSnapshot>[0]["productSlug"] };
    const snapshot = createProductPreviewSnapshot({ reportId: id, createdAtIso: row.createdAt, productKey: payload.productKey, productSlug: payload.productSlug, draft: generated.draft as ProductPreviewSnapshotDraft, evidencePacket: generated.evidencePacket });
    if (!snapshot.ok) return failure("저장할 책을 확인하지 못했습니다.");
    const publishedAt = new Date().toISOString();
    row.snapshot = JSON.parse(JSON.stringify({ ...snapshot.value, createdAtIso: publishedAt, access: { mode: "paid", isPaid: true, isUnlocked: true } }));
    const read = await readLocalBook(id);
    if (read && isRecord(read)) publishLocalLibrary({ reportId: id, productType: String(read.productType), reportVersion: String(read.productVersion), publishedAt: String(read.createdAtIso), expiresAt: publishedReportExpiresAt(String(read.createdAtIso)), displayName: "", selectedYear: null, status: "available" });
    return read ? { ok: true as const, reportUrl: `/dev/book-flow/report/${id}` } : failure("책의 완전성을 확인하지 못했습니다.");
  })();
  return row.pending;
}
export async function readLocalBook(id: string) {
  if (!allowed()) return null;
  const row = live(id);
  if (!row?.snapshot) return null;
  const read = await readPublishedReport({ call: async (action, data) => action === "read_report" && data?.reportId === id
    ? { ok: true, status: "COMPLETED", snapshot: JSON.parse(JSON.stringify(row.snapshot)) }
    : { ok: false, code: "LOCAL_REVIEW_ONLY" } }, id, validateBookPublication);
  return read.ok && read.status === "COMPLETED" ? read.snapshot : null;
}
// Same paid worker + same V4 generator/validator; a coupon changes no content.
export async function runLocalBookJob(store: ReliabilityStore) {
  if (!allowed()) return failure("NOT_FOUND");
  return runPaidReportJob(store,{enabled:false,reason:"flag_disabled"},async payload=>
    generateV4ShadowReport(payload,{evaluatedAt:new Date().toISOString(),policyDate:new Date().toISOString()}),validateBookPublication);
}
