import "server-only";
import { NextResponse, type NextRequest } from "next/server";
import { createTossRefundProvider, type RefundProvider } from "../../payment/tossRefundClient";
import { createPaidReportReliabilityStore, type ReliabilityStore } from "../../payment/paidReportReliabilityStore";
import { opsSameOrigin } from "../origin";
import { processRefunds } from "../orders/refund";
import { createOpsStores, type OpsStores } from "../store";
import { adminSession, type AdminSession } from "./access";
import { ADMIN_PIN_LOCK_MS, ADMIN_PIN_MAX_FAILURES, ADMIN_PIN_WINDOW_MS, adminPinConfigured, adminPinLockedUntil, adminPinMatches, adminRefundCaps, kstDayRange } from "./config";
import { adminRefundsBetween, buyerPhones, orderDetail, parseSearch, pinFailures, searchOrders, type OrderDetail } from "./data";
import { ordersCsv } from "./exportCsv";
import { kst, ORDER_CODE_RE, UUID_RE, won } from "./format";
import { adminRpc, compRpc, grantTickets, reconRpc, type Json } from "./rpc";
import { compConfig, compSyncArgs } from "../config";
import { regenerateNowCheck } from "../generation/policy";
import { lookupToss, lookupTossMany, TOSS_BATCH_LIMIT, TOSS_ERROR_LABEL, type TossStatus } from "./toss";

/**
 * 관리자 작업(POST /api/admin/orders/[action]). 매번 같은 출처 + 관리자(ADMIN_USER_IDS) + 로그인 12시간 이내를 다시 확인하고, 모든 작업은 감사 로그에 남긴다.
 * 대상 주문의 결제·Book·계정 정보는 화면이 보낸 값이 아니라 서버가 주문코드로 다시 읽은 값만 쓴다.
 * 환불·이용권 지급·내보내기는 관리자 PIN(ADMIN_ACTION_PIN)을 다시 입력해야 한다(15분 안 5번 틀리면 15분 잠금).
 */
export const ADMIN_ACTIONS = ["regenerate", "ticket-regenerate", "grant", "refund", "request-done", "provider-enable", "export", "reveal", "refund-warnings", "toss-check", "toss-check-batch", "external-refund", "comp-designate"] as const;
export type AdminActionName = (typeof ADMIN_ACTIONS)[number];
export const PIN_ACTIONS: readonly AdminActionName[] = ["refund", "grant", "export", "external-refund", "comp-designate"];
export const ADMIN_BODY_LIMIT = 4096;
export const REFUND_REASON_MAX = 200;
export const REQUEST_NOTE_MAX = 500;
export const EXPORT_LIMIT = 200;

type Env = Readonly<Record<string, string | undefined>>;
export type AdminActionDeps = {
  env: Env;
  now(): number;
  sameOrigin(request: Request): boolean;
  session(request: NextRequest): Promise<AdminSession>;
  stores(): OpsStores;
  reliability(): ReliabilityStore;
  /** 토스 비밀키가 없으면 null(환불은 'requested'로 남고 cron이 다시 시도한다). */
  refundProvider(): RefundProvider | null;
  uuid(): string;
};

export function defaultAdminDeps(env: Env = process.env): AdminActionDeps {
  return {
    env, now: () => Date.now(),
    sameOrigin: request => opsSameOrigin(request, env),
    session: request => adminSession(request),
    stores: () => createOpsStores(env),
    reliability: () => createPaidReportReliabilityStore(env as NodeJS.ProcessEnv),
    refundProvider: () => env.TOSS_PAYMENTS_SECRET_KEY ? createTossRefundProvider(env.TOSS_PAYMENTS_SECRET_KEY, fetch) : null,
    uuid: () => crypto.randomUUID(),
  };
}

const NO_STORE = { "Cache-Control": "no-store" };
const reply = (body: Json, status = 200) => NextResponse.json(body, { status, headers: NO_STORE });
const no = (status: number, code: string, message: string, extra: Json = {}) => reply({ ok: false, code, message, ...extra }, status);
const isAction = (v: string): v is AdminActionName => (ADMIN_ACTIONS as readonly string[]).includes(v);
const str = (v: unknown) => typeof v === "string" ? v : "";

type Ctx = { action: AdminActionName; body: Json; adminId: string; stores: OpsStores; deps: AdminActionDeps };

export async function handleAdminAction(request: NextRequest, action: string, deps: AdminActionDeps): Promise<NextResponse> {
  if (!isAction(action)) return no(404, "NOT_FOUND", "없는 작업이에요.");
  if (!deps.sameOrigin(request)) return no(403, "FORBIDDEN", "허용되지 않은 요청이에요.");
  const declared = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(declared) && declared > ADMIN_BODY_LIMIT) return no(413, "BODY_TOO_LARGE", "요청이 너무 커요.");
  if (!(request.headers.get("content-type") ?? "").toLowerCase().startsWith("application/json")) return no(415, "JSON_REQUIRED", "JSON 요청만 받아요.");
  const session = await deps.session(request);
  if (session.status === "none" || !session.userId) return session.finish(no(403, "FORBIDDEN", "허용되지 않은 요청이에요."));
  if (session.status === "expired") return session.finish(no(401, "ADMIN_SESSION_EXPIRED", "관리자 로그인 시간이 지났어요. 다시 로그인해 주세요."));
  let body: Json;
  try {
    const text = await request.text();
    if (new TextEncoder().encode(text).length > ADMIN_BODY_LIMIT) return session.finish(no(413, "BODY_TOO_LARGE", "요청이 너무 커요."));
    const parsed: unknown = JSON.parse(text || "{}");
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return session.finish(no(400, "BODY_INVALID", "요청 형식이 맞지 않아요."));
    body = parsed as Json;
  } catch { return session.finish(no(400, "BODY_INVALID", "요청 형식이 맞지 않아요.")); }
  const stores = deps.stores();
  if (!stores.db) return session.finish(no(503, "STORAGE_UNAVAILABLE", "저장소에 연결하지 못했어요."));
  const ctx: Ctx = { action, body, adminId: session.userId, stores, deps };
  try {
    const res = (PIN_ACTIONS.includes(action) ? await checkPin(ctx) : null) ?? await RUNNERS[action](ctx);
    if (res.status >= 400) await auditRejected(ctx, res);
    return session.finish(res);
  } catch { return session.finish(no(500, "ACTION_FAILED", "처리하지 못했어요. 잠시 뒤 다시 시도해 주세요.")); }
}
/** W3 P0: 관리자 세션이 확인된 뒤의 거절(409 NOT_REGENERATABLE·상한·PIN 잠금 등)도 감사에 남긴다. PIN 틀림은 admin_pin_failed로 이미 남는다. 감사 실패는 응답을 바꾸지 않는다. */
async function auditRejected(ctx: Ctx, res: NextResponse): Promise<void> {
  try {
    const b = await res.clone().json().catch(() => ({})) as Json;
    const code = typeof b.code === "string" ? b.code.slice(0, 40) : null;
    if (code === "ADMIN_PIN_INVALID") return;
    const order = str(ctx.body.orderCode).toUpperCase(), report = str(ctx.body.reportId);
    await audit(ctx, "admin_rejected", ORDER_CODE_RE.test(order) ? order : /^report_[a-f0-9]{32}$/.test(report) ? report : `admin:${ctx.action}`, { action: ctx.action, status: res.status, code });
  } catch { /* 감사 실패는 무시 */ }
}

const RUNNERS: Record<AdminActionName, (ctx: Ctx) => Promise<NextResponse>> = { regenerate, "ticket-regenerate": ticketRegenerate, grant, refund, "request-done": requestDone,
  "provider-enable": providerEnable, export: exportOrders, reveal, "refund-warnings": refundWarnings, "toss-check": tossCheck, "toss-check-batch": tossCheckBatch,
  "external-refund": externalRefund, "comp-designate": compDesignate };
/** 처리 봇이 부르는 같은 관리자 작업(운영 Q 6부: 새 환불·재생성 로직을 만들지 않는다). */
export const BOT_ADMIN_ACTIONS = ["refund", "regenerate", "ticket-regenerate"] as const satisfies readonly AdminActionName[];
/**
 * 처리 봇(텔레그램)용 진입점. 화면 요청 검사(같은 출처·관리자 세션·화면 PIN)는 봇 쪽 검사가 대신한다:
 * 덕짱님 텔레그램 id + 웹훅 비밀값 + (환불만) 같은 ADMIN_ACTION_PIN 대조·잠금. 작업 본문·하루 상한·감사 로그는 화면과 같다.
 */
export async function runAdminActionAs(action: (typeof BOT_ADMIN_ACTIONS)[number], body: Json, adminId: string, deps: AdminActionDeps): Promise<{ status: number; body: Json }> {
  const stores = deps.stores();
  if (!stores.db) return { status: 503, body: { ok: false, code: "STORAGE_UNAVAILABLE", message: "저장소에 연결하지 못했어요." } };
  try {
    const res = await RUNNERS[action]({ action, body, adminId, stores, deps });
    return { status: res.status, body: await res.json() as Json };
  } catch { return { status: 500, body: { ok: false, code: "ACTION_FAILED", message: "처리하지 못했어요. 잠시 뒤 다시 시도해 주세요." } }; }
}

/** PIN 확인: 설정 없음 → 꺼짐, 잠금 중 → 429, 틀림 → 403 + 감사 로그(admin_pin_failed). 기록을 못 읽으면 막는다. */
async function checkPin(ctx: Ctx): Promise<NextResponse | null> {
  const { env } = ctx.deps;
  if (!adminPinConfigured(env)) return no(503, "ADMIN_PIN_UNSET", "관리자 PIN(ADMIN_ACTION_PIN)이 설정되지 않아 환불·이용권 지급·내보내기를 쓸 수 없어요.");
  const pin = ctx.body.pin;
  if (typeof pin !== "string" || !pin) return no(400, "PIN_REQUIRED", "관리자 PIN을 입력해 주세요.");
  const now = ctx.deps.now();
  const failures = await pinFailures(ctx.stores.db, ctx.adminId, new Date(now - ADMIN_PIN_WINDOW_MS - ADMIN_PIN_LOCK_MS).toISOString());
  if (!failures) return no(503, "PIN_CHECK_FAILED", "PIN 기록을 확인하지 못했어요. 잠시 뒤 다시 시도해 주세요.");
  const until = adminPinLockedUntil(failures, now);
  if (until) return no(429, "ADMIN_PIN_LOCKED", `PIN을 ${ADMIN_PIN_MAX_FAILURES}번 틀려 ${kst(new Date(until).toISOString())}까지 잠겼어요.`);
  if (adminPinMatches(pin, env)) return null;
  const code = str(ctx.body.orderCode).toUpperCase();
  await audit(ctx, "admin_pin_failed", ORDER_CODE_RE.test(code) ? code : `admin:${ctx.action}`, { action: ctx.action });
  const recent = failures.filter(t => t > now - ADMIN_PIN_WINDOW_MS).length + 1, left = Math.max(ADMIN_PIN_MAX_FAILURES - recent, 0);
  return no(403, "ADMIN_PIN_INVALID", left > 0 ? `PIN이 맞지 않아요. ${left}번 더 틀리면 15분 동안 잠겨요.` : "PIN이 맞지 않아요. 15분 동안 PIN 작업이 잠겨요.");
}

async function loadOrder(ctx: Ctx): Promise<{ ok: true; detail: OrderDetail } | { ok: false; response: NextResponse }> {
  const code = str(ctx.body.orderCode).toUpperCase();
  if (!ORDER_CODE_RE.test(code)) return { ok: false, response: no(400, "ORDER_CODE_INVALID", "주문코드를 확인해 주세요.") };
  const d = await orderDetail(ctx.stores.db, code);
  if (!d.ok) return { ok: false, response: d.code === "ORDER_NOT_FOUND" ? no(404, "ORDER_NOT_FOUND", "주문을 찾지 못했어요.") : no(503, d.code, "주문을 읽지 못했어요.") };
  return { ok: true, detail: d.value };
}
const audit = (ctx: Ctx, action: string, target: string, detail: Json) => ctx.stores.audit({ actor: "admin", actorUserId: ctx.adminId, action, target, detail });

/** 그 주문의 처리 전 고객 요청을 처리 완료로 바꾸고 자동 메모(동작·시각)를 남긴다(DB가 감사 로그도 쓴다). 실패해도 본 작업은 그대로다. */
async function autoClose(ctx: Ctx, paymentOrderId: string, label: string): Promise<number> {
  try { const r = await reconRpc(ctx.stores.db, "autoclose", { paymentOrderId, label }); return r.ok === true ? Number(r.closed ?? 0) || 0 : 0; } catch { return 0; }
}
const closedNote = (n: number) => n > 0 ? ` 처리 전 고객 요청 ${n}건을 처리 완료로 바꿨어요.` : "";

/** 환불 경고(P6e-ops 3): 이 주문의 이벤트 이용권이 이미 쓰였거나 친구 보너스가 나갔는지. 안 쓴 이용권은 환불 때 회수되고, 쓴 것·나간 보너스는 회수하지 않는다(정책 그대로). */
export type RefundWarnings = { giftUsed: { status: string; at: string | null }[]; giftPendingRevoked: number; bonusSent: boolean };
export const hasRefundWarnings = (w: RefundWarnings) => w.giftUsed.length > 0 || w.bonusSent;
async function loadWarnings(ctx: Ctx, paymentOrderId: string): Promise<RefundWarnings | null> {
  const r = await reconRpc(ctx.stores.db, "refund_warnings", { paymentOrderId });
  if (r.ok !== true) return null;
  const used = Array.isArray(r.giftUsed) ? r.giftUsed.filter((x): x is Json => !!x && typeof x === "object").map(x => ({ status: str(x.status), at: typeof x.at === "string" ? x.at : null })) : [];
  return { giftUsed: used, giftPendingRevoked: Number(r.giftPendingRevoked ?? 0) || 0, bonusSent: r.bonusSent === true };
}
async function refundWarnings(ctx: Ctx): Promise<NextResponse> {
  const l = await loadOrder(ctx);
  if (!l.ok) return l.response;
  const w = await loadWarnings(ctx, l.detail.order.paymentOrderId);
  return w ? reply({ ok: true, warnings: w, hasWarnings: hasRefundWarnings(w) }) : no(503, "WARNINGS_CHECK_FAILED", "이벤트 이용권 상태를 확인하지 못했어요. 잠시 뒤 다시 시도해 주세요.");
}

/** 재생성: 공개 전 실패(확인 필요)면 기존 admin_retry, 공개된 Book이면 교체 레인(ops_generation 'regenerate'). */
async function regenerate(ctx: Ctx): Promise<NextResponse> {
  const l = await loadOrder(ctx);
  if (!l.ok) return l.response;
  const { order, book, job } = l.detail;
  const reportId = order.reportId;
  if (!reportId) return no(409, "NO_BOOK", "이 주문에는 Book이 없어요.");
  if (order.status !== "paid") return no(409, "ORDER_NOT_PAID", "결제 완료 주문만 다시 만들 수 있어요.");
  const published = book?.status === "COMPLETED";
  const unpublished = !book?.publishedAt && !published;
  let mode: "retry" | "replace" | "retry_now", r: Json;
  if (job?.status === "FAILED_REQUIRES_ATTENTION" && unpublished) { mode = "retry"; r = await ctx.deps.reliability().call("admin_retry", { reportId }); }
  else if (published) { mode = "replace"; r = await ctx.stores.generation.call("regenerate", { reportId }); }
  else if (unpublished && (job?.status === "RETRYING" || job?.status === "QUEUED")) {
    // HOTFIX-W1 3부 2: 만드는 중(다음 시도 대기·보류)이어도 비용 상한 안이면 다음 사다리 단계로 바로 1회 — 결제 큐 다음 시도 시각을 지금으로(1분 크론이 집는다).
    if (str(job.last_error_code) === "REFUND_HOLD" || l.detail.refund) return no(409, "REFUND_IN_PROGRESS", "환불 처리 중인 주문이라 다시 만들 수 없어요.");
    const pre = regenerateNowCheck({ runs: l.detail.runs as never, product: str(order.productType) || null });
    if (!pre.ok) { await audit(ctx, "admin_retry_now", order.orderCode, { reportId, ok: false, code: pre.code }); return no(409, pre.code, pre.message); }
    const db = ctx.stores.db;
    if (!db) return no(503, "STORAGE_UNAVAILABLE", "저장소에 연결하지 못했어요.");
    const { data, error } = await db.from("report_generation_jobs").update({ next_retry_at: new Date().toISOString() }).eq("report_id", reportId).in("status", ["RETRYING", "QUEUED"]).select("job_id");
    mode = "retry_now"; r = !error && data?.length ? { ok: true, stage: pre.stage, leftUsd: pre.leftUsd } : { ok: false, code: error ? "STORAGE_FAILED" : "JOB_STATE_CHANGED" };
  }
  else return no(409, "NOT_REGENERATABLE", "아직 생성 중이거나 다시 만들 수 없는 상태예요.");
  const ok = r.ok === true;
  await audit(ctx, mode === "retry" ? "admin_retry" : mode === "retry_now" ? "admin_retry_now" : "admin_regenerate", order.orderCode, { reportId, ok, ...(ok ? {} : { code: str(r.code) || "FAILED" }), ...(mode === "retry_now" && ok ? { stage: r.stage, leftUsd: r.leftUsd } : {}) });
  const closed = ok ? await autoClose(ctx, order.paymentOrderId, "재생성 요청") : 0;
  const done = mode === "retry" ? "결제 큐에 다시 넣었어요." : mode === "retry_now" ? `1분 안에 ${String(r.stage)}단으로 다시 시도해요(남은 상한 ` + "$" + `${Number(r.leftUsd).toFixed(2)}).` : "정식본 교체를 요청했어요. 다음 교체 레인에서 처리돼요.";
  return ok ? reply({ ok: true, mode, closedRequests: closed, message: `${done}${closedNote(closed)}` })
    : no(409, str(r.code) || "REGENERATE_FAILED", "다시 만들기 요청이 거절됐어요.");
}

/** 이용권 지급(회원 주문만, 1~3장). requestId(UUID)를 같이 보내면 두 번 눌러도 한 번만 지급된다. */
async function grant(ctx: Ctx): Promise<NextResponse> {
  const quantity = ctx.body.quantity;
  if (typeof quantity !== "number" || !Number.isInteger(quantity) || quantity < 1 || quantity > 3) return no(400, "QUANTITY_INVALID", "1~3장만 줄 수 있어요.");
  const l = await loadOrder(ctx);
  if (!l.ok) return l.response;
  const { order } = l.detail;
  if (!order.userId) return no(409, "GUEST_ORDER", "비회원 주문이라 이용권을 줄 계정이 없어요.");
  const id = UUID_RE.test(str(ctx.body.requestId)) ? str(ctx.body.requestId).toLowerCase() : ctx.deps.uuid();
  const r = await grantTickets(ctx.stores.db, order.userId, { quantity, sourceRef: `admin:${order.orderCode}:${id}`, key: `admin:${id}` });
  const ok = r.ok === true;
  await audit(ctx, "grant_ticket", order.orderCode, { userId: order.userId, quantity, requestId: id, ok, ...(typeof r.grantId === "string" ? { grantId: r.grantId } : {}), ...(ok ? {} : { code: str(r.code) || "FAILED" }) });
  const closed = ok ? await autoClose(ctx, order.paymentOrderId, "이용권 지급") : 0;
  return ok ? reply({ ok: true, quantity, closedRequests: closed, message: `이용권 ${quantity}장을 지급했어요.${closedNote(closed)}` }) : no(409, str(r.code) || "GRANT_FAILED", "이용권을 지급하지 못했어요.");
}

/**
 * 이용권 Book 다시 만들기(최종3): 이용권으로 만든 책은 환불하지 않고, 오류가 확인되면 다시 만든다(상품 가치는 결제한 책과 같다).
 * 주문(주문코드)이 없어 Book 주소 또는 ID(report_…)로 찾는다. 공개된 이용권 Book만 — 결제 Book은 주문 화면의 재생성을 쓴다.
 */
export const TICKET_REPORT_ID_RE = /report_[a-z0-9_-]{13,80}/i;
async function ticketRegenerate(ctx: Ctx): Promise<NextResponse> {
  const reportId = str(ctx.body.reportId).match(TICKET_REPORT_ID_RE)?.[0] ?? "";
  if (!reportId) return no(400, "REPORT_ID_INVALID", "Book 주소 또는 ID(report_…)를 확인해 주세요.");
  const db = ctx.stores.db;
  if (!db) return no(503, "STORAGE_UNAVAILABLE", "저장소에 연결하지 못했어요.");
  const { data, error } = await db.from("paid_report_snapshots").select("status,ticket_redemption_id").eq("report_id", reportId).maybeSingle();
  if (error) return no(503, "STORAGE_FAILED", "Book을 읽지 못했어요.");
  if (!data || !data.ticket_redemption_id) return no(404, "TICKET_BOOK_NOT_FOUND", "이용권으로 만든 Book을 찾지 못했어요. 결제한 Book은 주문 화면에서 다시 만들어 주세요.");
  if (data.status !== "COMPLETED") return no(409, "NOT_REGENERATABLE", "공개된 Book만 다시 만들 수 있어요(만드는 중이거나 실패한 이용권은 자동으로 복구돼요).");
  const r = await ctx.stores.generation.call("regenerate", { reportId });
  const ok = r.ok === true;
  await audit(ctx, "admin_regenerate", reportId, { reportId, origin: "ticket", ok, ...(ok ? {} : { code: str(r.code) || "FAILED" }) });
  return ok ? reply({ ok: true, mode: "replace", message: "이용권 Book 정식본 교체를 요청했어요. 다음 교체 레인에서 처리돼요." })
    : no(409, str(r.code) || "REGENERATE_FAILED", "다시 만들기 요청이 거절됐어요.");
}

/** 환불(2단계 확인): 사유(1~200자) + 주문코드를 그대로 다시 입력해야 한다. 요청 저장 → 그 1건을 바로 처리. */
async function refund(ctx: Ctx): Promise<NextResponse> {
  const reason = str(ctx.body.reason).trim(), confirm = str(ctx.body.confirmCode);
  if (!reason) return no(400, "REASON_REQUIRED", "환불 사유를 적어 주세요.");
  if (reason.length > REFUND_REASON_MAX) return no(400, "REASON_TOO_LONG", `환불 사유는 ${REFUND_REASON_MAX}자까지예요.`);
  if (!confirm || confirm !== str(ctx.body.orderCode)) return no(400, "CONFIRM_MISMATCH", "확인용 주문코드가 맞지 않아요.");
  const l = await loadOrder(ctx);
  if (!l.ok) return l.response;
  const { order } = l.detail;
  if (confirm !== order.orderCode) return no(400, "CONFIRM_MISMATCH", "확인용 주문코드가 맞지 않아요.");
  if (order.status !== "paid") return no(409, "NOT_REFUNDABLE", "결제 완료 주문만 환불할 수 있어요.");
  // 이미 쓴 이벤트 이용권·나간 친구 보너스가 있으면 확인(ackWarnings)해야 진행한다. 이미 환불 기록이 있는 재시도는 다시 묻지 않는다.
  if (!l.detail.refund) {
    const warnings = await loadWarnings(ctx, order.paymentOrderId);
    if (!warnings) return no(503, "WARNINGS_CHECK_FAILED", "이벤트 이용권 상태를 확인하지 못했어요. 잠시 뒤 다시 시도해 주세요.");
    if (hasRefundWarnings(warnings) && ctx.body.ackWarnings !== true) return no(409, "REFUND_WARNINGS", "이 주문으로 받은 이벤트 이용권이 이미 쓰였거나 친구 보너스가 나갔어요. 내용을 확인한 뒤 다시 진행해 주세요.", { warnings });
  }
  // 하루 상한(한국 날짜, 관리자 환불만, 상태 무관). 이미 환불 기록이 있는 주문(재시도)은 새 환불이 아니라 세지 않는다.
  const caps = adminRefundCaps(ctx.deps.env), day = kstDayRange(ctx.deps.now());
  if (!l.detail.refund) {
    const today = await adminRefundsBetween(ctx.stores.db, day.start, day.end);
    if (!today) return no(503, "REFUND_CAP_CHECK_FAILED", "오늘 환불 한도를 확인하지 못했어요. 잠시 뒤 다시 시도해 주세요.");
    if (today.count + 1 > caps.count || today.amount + order.amount > caps.amount) {
      await audit(ctx, "refund_blocked_cap", order.orderCode, { amount: order.amount, todayCount: today.count, todayAmount: today.amount, maxCount: caps.count, maxAmount: caps.amount });
      return no(429, "REFUND_DAILY_CAP", `오늘 관리자 환불 한도(${caps.count}건 · ${won(caps.amount)})를 넘어요. 오늘 ${today.count}건 · ${won(today.amount)} 처리했어요.`);
    }
  }
  // DB가 같은 상한을 잠금 안에서 다시 센다(동시 요청 방지).
  const req = await ctx.stores.order.call("refund_request", { paymentOrderId: order.paymentOrderId, source: "admin", reason, actorUserId: ctx.adminId, capCount: caps.count, capAmount: caps.amount, dayStart: day.start, dayEnd: day.end });
  if (req.code === "REFUND_DAILY_CAP") {
    await audit(ctx, "refund_blocked_cap", order.orderCode, { amount: order.amount, todayCount: Number(req.todayCount ?? 0), todayAmount: Number(req.todayAmount ?? 0), maxCount: caps.count, maxAmount: caps.amount, by: "db" });
    return no(429, "REFUND_DAILY_CAP", `오늘 관리자 환불 한도(${caps.count}건 · ${won(caps.amount)})를 넘어요.`);
  }
  await audit(ctx, "refund_request", order.orderCode, { paymentOrderId: order.paymentOrderId, amount: order.amount, reason, ok: req.ok === true, ...(req.ok === true ? { state: str(req.state), fresh: req.fresh === true } : { code: str(req.code) || "FAILED" }) });
  if (req.ok !== true) return no(409, str(req.code) || "REFUND_REQUEST_FAILED", "환불 요청을 저장하지 못했어요.");
  const provider = ctx.deps.refundProvider();
  if (!provider) return no(503, "TOSS_SECRET_MISSING", "환불 요청은 저장했지만 결제 비밀키가 설정되지 않아 지금 처리하지 못했어요. 자동 재시도가 처리해요.", { state: "requested" });
  const done = await processRefunds({ order: ctx.stores.order, audit: e => ctx.stores.audit(e) }, provider, { paymentOrderId: order.paymentOrderId });
  const result = done[0];
  if (!result) return reply({ ok: true, state: str(req.state) || "requested", message: "이미 처리 중이거나 끝난 환불이에요." });
  return result.state === "done" ? reply({ ok: true, state: "done", message: "환불을 마쳤어요." })
    : no(502, result.code ?? "REFUND_FAILED", "토스 취소가 끝나지 않았어요. 5분 뒤 같은 키로 자동 재시도해요.", { state: "failed" });
}

/** 문의 처리 완료(메모 500자까지). */
async function requestDone(ctx: Ctx): Promise<NextResponse> {
  const id = str(ctx.body.id), note = str(ctx.body.note).trim(), code = str(ctx.body.orderCode).toUpperCase();
  if (!UUID_RE.test(id)) return no(400, "REQUEST_ID_INVALID", "요청 id를 확인해 주세요.");
  if (note.length > REQUEST_NOTE_MAX) return no(400, "NOTE_TOO_LONG", `메모는 ${REQUEST_NOTE_MAX}자까지예요.`);
  const r = await adminRpc(ctx.stores.db, "request_done", { id, note });
  const ok = r.ok === true;
  await audit(ctx, "request_done", ORDER_CODE_RE.test(code) ? code : id, { requestId: id, ok, ...(note ? { note } : {}) });
  return ok ? reply({ ok: true, message: "처리 완료로 바꿨어요." }) : no(409, "REQUEST_NOT_OPEN", "이미 처리됐거나 없는 요청이에요.");
}

/** OpenAI(임시본) 경로 다시 켜기. */
async function providerEnable(ctx: Ctx): Promise<NextResponse> {
  const r = await ctx.stores.generation.call("provider_set", { provider: "openai", disabled: false });
  const ok = r.ok === true;
  await audit(ctx, "provider_enable", "llm_provider:openai", { ok });
  return ok ? reply({ ok: true, message: "OpenAI 경로를 다시 켰어요." }) : no(503, str(r.code) || "PROVIDER_SET_FAILED", "스위치를 바꾸지 못했어요.");
}

/** 현재 검색 결과 CSV(최대 200건). 이메일·전화는 가린 값만. PIN 필요, 감사 로그. */
async function exportOrders(ctx: Ctx): Promise<NextResponse> {
  const filters = parseSearch({ q: str(ctx.body.q), product: str(ctx.body.product), from: str(ctx.body.from), to: str(ctx.body.to) });
  const r = await searchOrders(ctx.stores.db, filters, EXPORT_LIMIT);
  if (!r.ok) return no(503, r.code, "주문을 읽지 못했어요.");
  const csv = ordersCsv(r.value, await buyerPhones(ctx.stores.db, r.value.map(o => o.paymentOrderId)));
  await audit(ctx, "orders_export", "orders:export", { count: r.value.length, filters });
  const stamp = kst(new Date(ctx.deps.now()).toISOString()).replace(/\D/g, "").slice(0, 12);
  return new NextResponse(csv, { status: 200, headers: { ...NO_STORE, "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="gyeol-orders-${stamp}.csv"` } });
}

/** 가린 이메일·전화 보기(PIN 없음). 감사 로그(pii_view)를 남기지 못하면 보이지 않는다. */
async function reveal(ctx: Ctx): Promise<NextResponse> {
  const field = ctx.body.field;
  if (field !== "email" && field !== "phone") return no(400, "FIELD_INVALID", "보기 항목을 확인해 주세요.");
  const l = await loadOrder(ctx);
  if (!l.ok) return l.response;
  const { order } = l.detail;
  const value = str(field === "email" ? order.buyerEmail : order.buyerPhone);
  if (!value) return no(404, "PII_EMPTY", "값이 없어요.");
  if (!await audit(ctx, "pii_view", order.orderCode, { field })) return no(503, "AUDIT_FAILED", "기록을 남기지 못해 보여 줄 수 없어요.");
  return reply({ ok: true, field, value });
}

const TOSS_DONE = "토스도 결제 완료(DONE)예요. 우리 기록과 같아요.";
function tossMessage(st: TossStatus, dbStatus: string): string {
  if (st.kind === "done") return TOSS_DONE;
  if (st.kind === "canceled") return dbStatus === "paid" ? "토스는 취소(CANCELED)인데 우리 기록은 결제 완료예요. 아래에서 '외부 환불로 기록'할 수 있어요." : "토스도 취소(CANCELED)이고 우리 기록도 환불이에요. 일치해요.";
  if (st.kind === "partial") return `토스에서 일부만 취소됐어요(남은 금액 ${won(st.balanceAmount)}). 자동으로 기록하지 않아요 — 토스 상점관리자에서 확인해 주세요.`;
  return TOSS_ERROR_LABEL[st.code] ?? `확인하지 못했어요(${st.code}).`;
}
const tossBlocked = (ctx: Ctx) => { const p = ctx.deps.refundProvider(); return p ? { provider: p } : { response: no(503, "TOSS_SECRET_MISSING", "토스 비밀키가 설정되지 않아 확인할 수 없어요.") }; };

/** 토스 상태 확인(1건, 조회 API만). 취소는 호출하지 않는다. */
async function tossCheck(ctx: Ctx): Promise<NextResponse> {
  const l = await loadOrder(ctx);
  if (!l.ok) return l.response;
  const { order } = l.detail;
  const b = tossBlocked(ctx);
  if (!b.provider) return b.response;
  const st = await lookupToss(b.provider, { paymentKey: str(order.paymentKey), providerOrderId: str(order.providerOrderId), amount: Number(order.amount) }, new Date(ctx.deps.now()));
  await audit(ctx, "toss_check", order.orderCode, { result: st.kind, dbStatus: order.status, ...(st.kind === "error" ? { code: st.code } : {}) });
  return reply({ ok: true, toss: st, dbStatus: order.status, mismatch: st.kind === "canceled" && order.status === "paid", message: tossMessage(st, order.status) });
}

/** 기존 주문 일괄 확인(결제 완료로 남은 토스 주문, 한 번에 20건 · 커서로 이어서). 결과는 저장하지 않고 감사 로그에 건수만 남긴다. */
async function tossCheckBatch(ctx: Ctx): Promise<NextResponse> {
  const b = tossBlocked(ctx);
  if (!b.provider) return b.response;
  const scope = ctx.body.scope === "all" ? "all" : "legacy";
  const afterAt = str(ctx.body.afterAt), afterId = str(ctx.body.afterId);
  if ((afterAt && !Number.isFinite(Date.parse(afterAt))) || afterId.length > 120) return no(400, "CURSOR_INVALID", "이어서 확인할 위치가 올바르지 않아요.");
  const t = await reconRpc(ctx.stores.db, "toss_targets", { scope, limit: TOSS_BATCH_LIMIT, ...(afterAt ? { afterAt, afterId } : {}) });
  if (t.ok !== true) return no(503, str(t.code) || "TARGETS_FAILED", "확인할 주문을 읽지 못했어요.");
  const targets = (Array.isArray(t.targets) ? t.targets : []).filter((x): x is Json => !!x && typeof x === "object")
    .map(x => ({ orderCode: str(x.orderCode), paymentOrderId: str(x.paymentOrderId), createdAt: str(x.createdAt), paymentKey: str(x.paymentKey), providerOrderId: str(x.providerOrderId), amount: Number(x.amount) }));
  const checked = await lookupTossMany(b.provider, targets);
  const rows = checked.map(({ target, status }) => ({ orderCode: target.orderCode, amount: target.amount, result: status.kind,
    ...(status.kind === "canceled" ? { canceledAt: status.canceledAt } : {}), ...(status.kind === "error" ? { code: status.code, label: TOSS_ERROR_LABEL[status.code] ?? status.code } : {}) }));
  const count = (k: string) => rows.filter(r => r.result === k).length;
  await audit(ctx, "toss_check_batch", "orders:toss-check", { scope, checked: rows.length, done: count("done"), canceled: count("canceled"), partial: count("partial"), errors: count("error") });
  const last = targets.at(-1);
  return reply({ ok: true, scope, total: Number(t.total ?? 0) || 0, checked: rows.length, rows, next: t.more === true && last ? { afterAt: last.createdAt, afterId: last.paymentOrderId } : null,
    message: `${rows.length}건 확인: 일치 ${count("done")} · 토스 취소(우리는 결제 완료) ${count("canceled")} · 일부 취소 ${count("partial")} · 확인 실패 ${count("error")}` });
}

/** 외부 환불 기록(PIN): 서버가 토스를 다시 조회해 전액 취소(CANCELED)일 때만, 결제 완료 주문을 환불로 바꿔 기록한다. 취소 API는 호출하지 않는다. */
async function externalRefund(ctx: Ctx): Promise<NextResponse> {
  const l = await loadOrder(ctx);
  if (!l.ok) return l.response;
  const { order } = l.detail;
  if (str(ctx.body.confirmCode) !== order.orderCode) return no(400, "CONFIRM_MISMATCH", "확인용 주문코드가 맞지 않아요.");
  if (order.status !== "paid") return no(409, "NOT_PAID", "결제 완료로 남은 주문만 외부 환불로 기록할 수 있어요.");
  const b = tossBlocked(ctx);
  if (!b.provider) return b.response;
  const st = await lookupToss(b.provider, { paymentKey: str(order.paymentKey), providerOrderId: str(order.providerOrderId), amount: Number(order.amount) }, new Date(ctx.deps.now()));
  if (st.kind !== "canceled" || st.balanceAmount !== 0) {
    await audit(ctx, "external_refund_blocked", order.orderCode, { toss: st.kind, ...(st.kind === "error" ? { code: st.code } : {}) });
    return no(409, "TOSS_NOT_CANCELED", `토스가 전액 취소로 확인되지 않아 기록하지 않았어요. ${tossMessage(st, order.status)}`);
  }
  const r = await reconRpc(ctx.stores.db, "external_refund", { paymentOrderId: order.paymentOrderId, adminUserId: ctx.adminId, amount: order.amount, ...(st.canceledAt ? { canceledAt: st.canceledAt } : {}) });
  const ok = r.ok === true;
  await audit(ctx, "external_refund", order.orderCode, { ok, amount: order.amount, tossCanceledAt: st.canceledAt, ...(ok ? { giftRevoked: r.giftRevoked === true } : { code: str(r.code) || "FAILED" }) });
  return ok ? reply({ ok: true, message: `외부 환불로 기록했어요(토스 취소 ${kst(st.canceledAt)}). 이 Book은 더 이상 열리지 않고, 처리 전 고객 요청은 자동 처리 완료로 바뀌었어요.` })
    : no(409, str(r.code) || "EXTERNAL_REFUND_FAILED", "외부 환불로 기록하지 못했어요.");
}

/** 보상 A 지정(PIN): 주문코드 또는 토스 주문번호로 환불 완료 주문을 찾아 그 계정을 지정한다. 켜져 있고 가입 정보가 끝난 계정이면 바로 지급까지. */
const PROVIDER_ORDER_RE = /^[A-Za-z0-9_=-]{6,64}$/;
async function compDesignate(ctx: Ctx): Promise<NextResponse> {
  const q = str(ctx.body.query).trim();
  if (!q) return no(400, "QUERY_REQUIRED", "주문코드 또는 토스 주문번호를 입력해 주세요.");
  const code = q.toUpperCase();
  const data: Json = ORDER_CODE_RE.test(code) ? { orderCode: code } : PROVIDER_ORDER_RE.test(q) ? { providerOrderId: q } : {};
  if (!data.orderCode && !data.providerOrderId) return no(400, "QUERY_INVALID", "주문코드(GR-XXXX) 또는 토스 주문번호 형식이 아니에요.");
  const r = await compRpc(ctx.stores.db, "designate", { ...data, adminUserId: ctx.adminId });
  const target = typeof r.orderCode === "string" && ORDER_CODE_RE.test(r.orderCode) ? r.orderCode : ORDER_CODE_RE.test(code) ? code : "comp:designate";
  if (r.ok !== true) {
    await audit(ctx, "comp_designate", target, { ok: false, code: str(r.code) || "FAILED" });
    const why: Record<string, [number, string]> = {
      ORDER_NOT_FOUND: [404, "주문을 찾지 못했어요."], NOT_REFUNDED: [409, `환불 완료 주문만 보상 A로 지정할 수 있어요(지금: ${str(r.status) || "확인 불가"}). 외부에서 환불했다면 먼저 토스 상태 확인 → 외부 환불 기록을 해 주세요.`],
      NO_ACCOUNT: [409, "이 주문에 연결된 계정을 찾지 못했어요(비회원 주문·이메일 불일치)."],
    };
    const [status, message] = why[str(r.code)] ?? [409, "지정하지 못했어요."];
    return no(status, str(r.code) || "DESIGNATE_FAILED", message);
  }
  const userId = str(r.userId), cfg = compConfig(ctx.deps.env);
  let state = "off";
  if (cfg.enabled) {
    const s2 = await compRpc(ctx.stores.db, "sync", { userId, ...compSyncArgs(cfg, true) });
    state = s2.ok === true ? str(s2.state) : "sync_failed";
  }
  await audit(ctx, "comp_designate", str(r.orderCode), { ok: true, userId, already: r.already === true, state });
  const tail = state === "granted" ? "이용권을 지급했어요." : state === "waiting_profile" ? "가입 정보를 입력하면 이용권이 들어가요." : state === "off" ? "보상 이용권이 꺼져 있어(COMP_ENABLED) 켠 뒤에 지급돼요." : "지급 확인에 실패했어요. 고객이 서재를 열면 다시 시도해요.";
  return reply({ ok: true, state, already: r.already === true, message: `${r.already === true ? "이미 보상 A로 지정된 계정이에요. " : "보상 A로 지정했어요. "}${tail}` });
}
