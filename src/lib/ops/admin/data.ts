import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { withDeadline } from "../../network/withDeadline";
import { ALL_PRODUCTS } from "../config";
import { OPS_RPC_TIMEOUT_MS, type OpsStores } from "../store";
import { adminRpc, compRpc, type Json } from "./rpc";

/** 관리자 화면 읽기(ops_admin 결과 모양 = supabase/migrations/20261104100000_v5_p6d_ops.sql). */
export type OrderRow = {
  orderCode: string; paymentOrderId: string; providerOrderId: string | null; productType: string; amount: number; paymentStatus: string;
  createdAt: string; paidAt: string | null; reportId: string | null; buyerName: string | null; buyerEmail: string | null; userId: string | null; legacy: boolean;
  bookStatus: string | null; edition: string | null; failures: number | null; lastReason: string | null; jobStatus: string | null; refundState: string | null; openRequests: number;
};
export type TicketDelay = { redemptionId: string; reportId: string | null; productType: string; state: string; createdAt: string; notBefore: string | null; failures: number | null; lastReason: string | null };
export type RequestRow = { id: string; orderCode: string | null; reportId?: string | null; device?: string | null; resolution?: string | null; reason: string; memo: string; status: string; createdAt: string; productType: string; paymentStatus: string; buyerName: string | null; adminNote?: string | null; resolvedAt?: string | null; resolvedBy?: "admin" | "auto" | null };
export type MemberRow = { userId: string; joinedAt: string; lastLoginAt: string | null; emailSecured: boolean; orders: number; upgradeState: string | null };
export type MemberSummary = { total: number; emailSecured: number; emailMissing: number; withOrders: number; profileDone: number; eligible: number; members: MemberRow[] };
export type ProviderState = Record<string, { disabledAt: string | null; reason: string | null }>;
export type OrderDetail = {
  order: Json & { orderCode: string; paymentOrderId: string; status: string; amount: number; reportId: string | null; userId: string | null };
  input: Json | null; book: Json | null; job: Json | null; attempts: Json[]; state: Json | null; runs: Json[]; versions: Json[]; requests: Json[]; refund: Json | null; audit: Json[];
};
export type Loaded<T> = { ok: true; value: T } | { ok: false; code: string };

const list = (v: unknown): Json[] => Array.isArray(v) ? v.filter((x): x is Json => !!x && typeof x === "object") : [];
const obj = (v: unknown): Json | null => v && typeof v === "object" && !Array.isArray(v) ? v as Json : null;
const fail = (r: Json): { ok: false; code: string } => ({ ok: false, code: typeof r.code === "string" ? r.code : "STORAGE_FAILED" });

export type SearchFilters = { q: string; product: string; from: string; to: string };
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";
/** GET 검색 조건: 검색어 100자, 상품은 알려진 키만, 날짜는 한국 날짜(YYYY-MM-DD, 끝 날짜 포함). */
export function parseSearch(params: Record<string, string | string[] | undefined>): SearchFilters {
  const date = (v: string) => DATE.test(v) && Number.isFinite(Date.parse(`${v}T00:00:00+09:00`)) ? v : "";
  const product = one(params.product);
  return { q: one(params.q).trim().slice(0, 100), product: (ALL_PRODUCTS as readonly string[]).includes(product) ? product : "", from: date(one(params.from)), to: date(one(params.to)) };
}
export function searchRpcData(f: SearchFilters, limit = 50): Json {
  return {
    ...(f.q ? { q: f.q } : {}), ...(f.product ? { product: f.product } : {}),
    ...(f.from ? { from: new Date(`${f.from}T00:00:00+09:00`).toISOString() } : {}),
    ...(f.to ? { to: new Date(Date.parse(`${f.to}T00:00:00+09:00`) + 86_400_000).toISOString() } : {}),
    limit,
  };
}

export async function searchOrders(db: SupabaseClient | null, f: SearchFilters, limit = 50): Promise<Loaded<OrderRow[]>> {
  const r = await adminRpc(db, "search", searchRpcData(f, limit));
  return r.ok === true ? { ok: true, value: list(r.orders) as OrderRow[] } : fail(r);
}
export async function delayedOrders(db: SupabaseClient | null): Promise<Loaded<{ orders: OrderRow[]; tickets: TicketDelay[] }>> {
  const r = await adminRpc(db, "delayed");
  return r.ok === true ? { ok: true, value: { orders: list(r.orders) as OrderRow[], tickets: list(r.tickets) as TicketDelay[] } } : fail(r);
}
export async function requestInbox(db: SupabaseClient | null, status: "open" | "done"): Promise<Loaded<RequestRow[]>> {
  const r = await adminRpc(db, "requests", { status });
  return r.ok === true ? { ok: true, value: list(r.requests) as RequestRow[] } : fail(r);
}
export async function orderDetail(db: SupabaseClient | null, orderCode: string): Promise<Loaded<OrderDetail>> {
  const r = await adminRpc(db, "detail", { orderCode });
  const order = obj(r.order);
  if (r.ok !== true || !order) return fail(r);
  return { ok: true, value: { order: order as OrderDetail["order"], input: obj(r.input), book: obj(r.book), job: obj(r.job), attempts: list(r.attempts), state: obj(r.state),
    runs: list(r.runs), versions: list(r.versions), requests: list(r.requests), refund: obj(r.refund), audit: list(r.audit) } };
}
export async function providerState(stores: Pick<OpsStores, "generation">): Promise<Loaded<ProviderState>> {
  const r = await stores.generation.call("provider", {});
  return r.ok === true ? { ok: true, value: (obj(r.providers) ?? {}) as ProviderState } : fail(r);
}

/** 기존 가입자 현황. 최근 로그인이 비어 있으면(공급자 사실 기록 전 가입자) auth 사용자 목록의 마지막 로그인으로 채운다(실패해도 그대로). */
export async function legacyMembers(db: SupabaseClient | null, limit = 30): Promise<Loaded<MemberSummary>> {
  const r = await adminRpc(db, "legacy_members", { limit });
  if (r.ok !== true) return fail(r);
  const n = (v: unknown) => typeof v === "number" ? v : Number(v) || 0;
  const members = list(r.members) as MemberRow[];
  if (db && members.some(m => !m.lastLoginAt)) {
    try {
      const res = await withDeadline(async () => await db.auth.admin.listUsers({ page: 1, perPage: 1000 }), OPS_RPC_TIMEOUT_MS);
      const seen = new Map((res.data?.users ?? []).map(u => [u.id, u.last_sign_in_at ?? null]));
      for (const m of members) if (!m.lastLoginAt) m.lastLoginAt = seen.get(m.userId) ?? null;
    } catch { /* 보강 실패: 원래 값으로 보인다 */ }
  }
  return { ok: true, value: { total: n(r.total), emailSecured: n(r.emailSecured), emailMissing: n(r.emailMissing), withOrders: n(r.withOrders), profileDone: n(r.profileDone), eligible: n(r.eligible), members } };
}

export type CompTierKey = "A" | "B";
export type CompCount = { total: number; granted: number; ready: number; waitingProfile: number; used: number };
export type CompMember = { userId: string; tier: CompTierKey; orderCode: string | null; email: string | null; lastLoginAt: string | null; state: "granted" | "ready" | "waiting_profile";
  grantedAt: string | null; expiresAt: string | null; quantity: number; usedTickets: number; ticketLots: number; usedGifts: number; giftLots: number };
export type CompSummary = { counts: Record<CompTierKey, CompCount>; members: CompMember[] };
/** 기존 가입자 탭의 보상 이용권 현황(등급별 인원·지급·사용). ops_comp 'admin'. */
export async function compSummary(db: SupabaseClient | null, limit = 100): Promise<Loaded<CompSummary>> {
  const r = await compRpc(db, "admin", { limit });
  const c = obj(r.counts);
  if (r.ok !== true || !c) return fail(r);
  const n = (v: unknown) => typeof v === "number" ? v : Number(v) || 0;
  const one = (v: unknown): CompCount => { const o = obj(v) ?? {}; return { total: n(o.total), granted: n(o.granted), ready: n(o.ready), waitingProfile: n(o.waitingProfile), used: n(o.used) }; };
  return { ok: true, value: { counts: { A: one(c.A), B: one(c.B) }, members: list(r.members) as CompMember[] } };
}

/** 표 직접 읽기(service_role, 10초 상한). 실패하면 null — 호출 쪽이 막을지(안전 검사) 비울지(표시) 정한다. */
async function rows<T>(query: (signal: AbortSignal) => PromiseLike<{ data: unknown; error: unknown }>): Promise<T[] | null> {
  try {
    const r = await withDeadline(async signal => await query(signal), OPS_RPC_TIMEOUT_MS);
    return !r.error && Array.isArray(r.data) ? r.data as T[] : null;
  } catch { return null; }
}

export type ActivityRow = { id: number; actor: string; actor_user_id: string | null; action: string; target: string; created_at: string };
export const ACTIVITY_SYSTEM_ACTIONS = ["refund_done", "refund_failed", "refund_blocked_cap", "auto_refund_requested", "request_auto_done"] as const;
/** "최근 관리자 동작" 패널(메일 알림 대신): 관리자 동작 + 환불 결과(시스템) 최근 20건, 최신순. */
export async function recentActivity(db: SupabaseClient | null, limit = 20): Promise<ActivityRow[] | null> {
  if (!db) return null;
  return rows<ActivityRow>(signal => db.from("ops_audit_log").select("id,actor,actor_user_id,action,target,created_at")
    .or(`actor.eq.admin,action.in.(${ACTIVITY_SYSTEM_ACTIONS.join(",")})`).order("id", { ascending: false }).limit(limit).abortSignal(signal));
}
/** PIN 실패 시각(오름차순, since 이후). */
export async function pinFailures(db: SupabaseClient | null, adminId: string, since: string): Promise<number[] | null> {
  if (!db) return null;
  const r = await rows<{ created_at: string }>(signal => db.from("ops_audit_log").select("created_at").eq("action", "admin_pin_failed").eq("actor_user_id", adminId)
    .gte("created_at", since).order("created_at", { ascending: true }).limit(100).abortSignal(signal));
  return r ? r.map(x => Date.parse(x.created_at)).filter(Number.isFinite) : null;
}
/** 오늘(한국 날짜) 관리자 환불(상태 무관). 자동 환불은 세지 않는다. */
export async function adminRefundsBetween(db: SupabaseClient | null, start: string, end: string): Promise<{ count: number; amount: number } | null> {
  if (!db) return null;
  const r = await rows<{ amount: number }>(signal => db.from("order_refunds").select("amount").eq("source", "admin").gte("created_at", start).lt("created_at", end).limit(1000).abortSignal(signal));
  return r ? { count: r.length, amount: r.reduce((n, x) => n + (Number(x.amount) || 0), 0) } : null;
}
/** 내보내기용 구매자 전화(검색 결과에는 없다). 실패하면 빈 값. */
export async function buyerPhones(db: SupabaseClient | null, paymentOrderIds: readonly string[]): Promise<Map<string, string | null>> {
  if (!db || paymentOrderIds.length === 0) return new Map();
  const r = await rows<{ payment_order_id: string; buyer_phone: string | null }>(signal => db.from("order_records").select("payment_order_id,buyer_phone").in("payment_order_id", [...paymentOrderIds]).abortSignal(signal));
  return new Map((r ?? []).map(x => [x.payment_order_id, x.buyer_phone]));
}
