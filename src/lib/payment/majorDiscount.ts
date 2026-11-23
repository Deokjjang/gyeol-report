import "server-only";
/**
 * AM2-14 4부(덕짱님 결정 2026-11-23): 세운 → 대운 반값.
 * - 자격: 같은 계정(order_records.user_id)의, 결제 금액이 있고(payment_orders.amount > 0) 환불되지 않은(order_refunds 요청 · 처리 · 완료 없음)
 *   세운 2027 주문(신년판 판매 시작 FORTUNE_SALES_OPEN_AT 뒤 결제) 1건마다 대운 반값 1회. 기간 · 같은 사람 조건은 없다. 이용권 세운은 주문이 없어 자격이 아니다.
 * - 가격: 결제 준비(서버)에서만 — 대운 정가(카탈로그) × 0.5(10원 내림, majorHalfPriceKrw). 화면이 보낸 금액은 쓰지 않는다. 준비 단계는 예약하지 않는다(결제창을 닫고 다시 열어도 막히지 않는다).
 * - 소진: 승인 직전 문(confirmPaidReport salesGate — 토스 승인 · confirm_claim 전, 요청 금액 = 저장 금액일 때만)에서 세운 주문당 한 줄(major_discount_uses: PK annual_order_id · UNIQUE major_order_id)을
 *   이 대운 주문으로 원자 확정한다 — 새로 넣기(PK 충돌이면 진 쪽) 또는 비교 후 바꾸기(예전 대운 주문 id · 확정 시각이 그대로일 때만). 같은 자격 두 대운이 동시에 와도 하나만 승인.
 *   이 줄을 갈아 끼울 수 있는 때: 묶인 대운이 환불 · 취소 · 실패했거나, 결제 키 없이(승인 시작 전) HALF_CONFIRM_GUARD_MS, 결제 키가 남은 채 HALF_PAYMENT_KEY_HOLD_MS가 지남.
 * - 환불: 표에 쓰지 않고 읽을 때 판정한다. 대운 반값이 환불되면(30분 자동 환불 포함 — status refunded) 그 줄은 「안 씀」 → 자격이 돌아온다.
 *   세운이 환불(요청부터)되면 그 세운은 자격 목록에서 빠진다 → 안 쓴 자격은 없어지고, 이미 결제된 대운은 그대로.
 * 옛 SQL am_major_discount(AM 3부 — 7일 · 같은 사람 · 준비 예약)는 부르지 않는다(운영에 남아도 무해). migration 없음.
 */
import type { SupabaseClient } from "@supabase/supabase-js";
import { fortuneSalesOpenAtMs } from "../ops/config";
import { MAJOR_HALF_RATE, discountedAmount, majorHalfPriceKrw, reportPriceKrw } from "./reportProductCatalog";
export { discountedAmount };

/** 승인 문을 지난 대운 주문이 confirm_claim(결제 키 저장)까지 가는 동안 그 줄을 지키는 시간(confirm 선점 2분보다 길게). */
export const HALF_CONFIRM_GUARD_MS = 3 * 60_000;
/** 결제 키가 남은 채 승인되지 않은 대운(토스 승인 실패 · 회수 「주의」로 끝남)의 줄을 지키는 시간. 토스 승인 기한이 이보다 훨씬 짧아 그 뒤에는 결제될 수 없다. */
export const HALF_PAYMENT_KEY_HOLD_MS = 24 * 3_600_000;
export const HALF_REFUSED_CODE = "MAJOR_HALF_UNAVAILABLE";
export const HALF_AMOUNT_CODE = "MAJOR_AMOUNT_MISMATCH";

export type AnnualRow = { id: string; status: string; amount: number; paidAt: string | null; refund: string | null };
export type UseRow = { annualOrderId: string; majorOrderId: string; userId: string; reservedAt: string };
export type MajorRow = { id: string; status: string; paymentKey: boolean };
/** DB 손(운영 = service_role 표 읽기 · 쓰기, 시험 = 메모리 · PGlite). 쓰기는 한 줄 원자(넣기 · 비교 후 바꾸기)만. */
export type HalfPort = {
  annualOrders(userId: string): Promise<AnnualRow[]>;
  uses(annualIds: readonly string[]): Promise<UseRow[]>;
  majors(ids: readonly string[]): Promise<MajorRow[]>;
  insertUse(row: UseRow & { rate: number; amount: number; originalAmount: number }): Promise<"ok" | "conflict" | "error">;
  casUse(annualOrderId: string, expect: { majorOrderId: string; reservedAt: string }, set: { majorOrderId: string; reservedAt: string; rate: number; amount: number; originalAmount: number }): Promise<boolean>;
  orderOwner(orderId: string): Promise<string | null>;
  reportOrder(reportId: string): Promise<string | null>;
  input(orderId: string): Promise<Record<string, unknown> | null>;
};

const REFUNDING = new Set(["requested", "processing", "done"]);
const ENDED = new Set(["refunded", "canceled", "failed"]);
/** 자격이 되는 세운 주문(결제됨 · 금액 있음 · 환불 없음 · 2027판 판매 시작 뒤 결제), 오래된 것 먼저. */
export function eligibleAnnuals(rows: readonly AnnualRow[], openAtMs = fortuneSalesOpenAtMs()): AnnualRow[] {
  return rows.filter(r => r.status === "paid" && r.amount > 0 && !(r.refund && REFUNDING.has(r.refund)) && Number.isFinite(Date.parse(r.paidAt ?? "")) && Date.parse(r.paidAt!) >= openAtMs)
    .sort((a, b) => Date.parse(a.paidAt!) - Date.parse(b.paidAt!) || a.id.localeCompare(b.id));
}
/** 줄 하나의 상태: free(안 씀 · 갈아 끼울 수 있음) · used(결제된 대운) · inflight(승인 중 — 결제 키가 있거나 문을 지난 지 HALF_CONFIRM_GUARD_MS 안). */
export function halfUseState(u: UseRow | undefined, m: MajorRow | undefined, now: number): "free" | "used" | "inflight" {
  if (!u) return "free";
  if (m?.status === "paid") return "used";
  if (m && ENDED.has(m.status)) return "free";
  const age = now - Date.parse(u.reservedAt);
  if (m?.paymentKey) return age >= HALF_PAYMENT_KEY_HOLD_MS ? "free" : "inflight";
  return age >= HALF_CONFIRM_GUARD_MS ? "free" : "inflight";
}

async function snapshot(port: HalfPort, userId: string, now: number) {
  const annuals = eligibleAnnuals(await port.annualOrders(userId));
  const uses = annuals.length ? await port.uses(annuals.map(a => a.id)) : [];
  const majors = uses.length ? await port.majors(uses.map(u => u.majorOrderId)) : [];
  const useOf = new Map(uses.map(u => [u.annualOrderId, u])), majorOf = new Map(majors.map(m => [m.id, m]));
  return annuals.map(a => { const u = useOf.get(a.id); return { annual: a, use: u, state: halfUseState(u, u ? majorOf.get(u.majorOrderId) : undefined, now) }; });
}

export type HalfQuote = { ok: true; annualOrderId: string; amount: number; original: number; input: Record<string, unknown> | null } | { ok: false; code: string; message: string };
const MESSAGES: Readonly<Record<string, string>> = {
  LOGIN: "로그인한 뒤 내 세운 책에서 이어 주세요.",
  NONE: "대운 반값은 세운 「나의 2027」을 결제한 계정에서 쓸 수 있어요.",
  USED: "세운 주문 1건마다 대운 반값은 한 번이에요. 이 계정의 반값은 이미 썼어요.",
};
export const halfMessage = (code: string) => MESSAGES[code] ?? "대운 반값을 확인하지 못했어요. 잠시 뒤 다시 시도해 주세요.";

/**
 * 결제 준비 · 화면 표시용 판정(쓰기 없음): 이 계정에 안 쓴 자격이 있으면 반값. from = 세운 책 id(그 세운을 먼저 · 입력 미리 채우기) 또는 "annual"(아무 세운).
 * 금액 = 대운 정가 × 0.5(카탈로그 한 곳). 입력은 고른 세운 주문의 입력(보관 기간이 지나면 null — 미리 채우기만 빠진다).
 */
export async function quoteHalf(port: HalfPort, a: { userId: string | null; from?: string | null; now?: number }): Promise<HalfQuote> {
  if (!a.userId) return { ok: false, code: "LOGIN", message: halfMessage("LOGIN") };
  const now = a.now ?? Date.now();
  const list = await snapshot(port, a.userId, now);
  if (!list.length) return { ok: false, code: "NONE", message: halfMessage("NONE") };
  const want = a.from && /^report_[a-z0-9]{13,64}$/.test(a.from) ? await port.reportOrder(a.from) : null;
  const free = list.filter(x => x.state === "free"), pick = free.find(x => x.annual.id === want) ?? free[0];
  if (!pick) return { ok: false, code: "USED", message: halfMessage("USED") };
  const input = await port.input(want ?? pick.annual.id);
  return { ok: true, annualOrderId: pick.annual.id, amount: majorHalfPriceKrw(), original: reportPriceKrw("major_fortune"), input };
}

/**
 * 승인 직전 소진(원자): 이 대운 주문에 자격 한 줄을 확정한다. 이미 이 주문에 묶인 줄이면 확정 시각만 새로(같은 주문의 다시 승인 — 결과 화면 새로 고침).
 * 성공하면 true. 실패(자격 없음 · 다른 대운이 먼저 · 경쟁에서 짐)면 false → 승인하지 않는다(토스 승인을 부르지 않아 돈이 나가지 않는다).
 */
export async function consumeHalf(port: HalfPort, a: { userId: string; majorOrderId: string; now?: number }): Promise<boolean> {
  const now = a.now ?? Date.now(), at = new Date(now).toISOString();
  const set = { majorOrderId: a.majorOrderId, reservedAt: at, rate: MAJOR_HALF_RATE, amount: majorHalfPriceKrw(), originalAmount: reportPriceKrw("major_fortune") };
  for (let round = 0; round < 3; round++) {
    const list = await snapshot(port, a.userId, now);
    const mine = list.find(x => x.use?.majorOrderId === a.majorOrderId);
    if (mine?.use) return port.casUse(mine.annual.id, { majorOrderId: mine.use.majorOrderId, reservedAt: mine.use.reservedAt }, set);
    let lost = false;
    for (const x of list.filter(y => y.state === "free")) {
      if (!x.use) { const r = await port.insertUse({ annualOrderId: x.annual.id, userId: a.userId, ...set }); if (r === "ok") return true; if (r === "conflict") { lost = true; continue; } return false; }
      if (await port.casUse(x.annual.id, { majorOrderId: x.use.majorOrderId, reservedAt: x.use.reservedAt }, set)) return true;
      lost = true;
    }
    if (!lost) return false; // 안 쓴 자격이 없다
  }
  return false;
}

/**
 * 승인 직전 문(대운만 — 4종 · 세운 주문은 null로 그대로 지난다): 저장 금액이 정가면 통과, 반값이면 소진에 성공할 때만, 그 밖 금액은 거절.
 * 주문을 못 읽으면 막지 않는다(기존 승인 흐름과 같음 — 저장 금액 = 요청 금액 = 토스 금액 대조는 confirm_claim · 토스 응답이 한다).
 */
export async function majorHalfGate(order: { product_type?: unknown; status?: unknown; amount?: unknown; payment_order_id?: unknown } | null, port: HalfPort, now = Date.now()): Promise<string | null> {
  if (!order || order.product_type !== "major_fortune" || order.status !== "ready") return null;
  const amount = Number(order.amount), price = reportPriceKrw("major_fortune");
  if (amount === price) return null;
  if (amount !== majorHalfPriceKrw() || typeof order.payment_order_id !== "string") return HALF_AMOUNT_CODE;
  const owner = await port.orderOwner(order.payment_order_id);
  if (!owner) return HALF_REFUSED_CODE;
  return (await consumeHalf(port, { userId: owner, majorOrderId: order.payment_order_id, now })) ? null : HALF_REFUSED_CODE;
}
export const HALF_REFUSED_MESSAGE = "이 계정의 대운 반값을 이미 썼거나 쓸 수 없어요. 이 주문은 결제되지 않았어요. 대운 화면에서 다시 결제해 주세요.";
export const HALF_AMOUNT_MESSAGE = "결제 금액이 주문과 달라 결제를 승인하지 않았어요. 이 주문은 결제되지 않았어요.";

/** 운영 손: service_role 표 읽기 · 한 줄 원자 쓰기(PostgREST 한 문장 = 한 줄 잠금). */
export function createHalfPort(db: SupabaseClient | null): HalfPort {
  const none = async () => [] as never[];
  if (!db) return { annualOrders: none, uses: none, majors: none, insertUse: async () => "error", casUse: async () => false, orderOwner: async () => null, reportOrder: async () => null, input: async () => null };
  return {
    async annualOrders(userId) {
      const { data: recs } = await db.from("order_records").select("payment_order_id").eq("user_id", userId).limit(200);
      const ids = (recs ?? []).map(r => String(r.payment_order_id)); if (!ids.length) return [];
      const [{ data: orders }, { data: refunds }] = await Promise.all([
        db.from("payment_orders").select("payment_order_id,status,amount,paid_at").in("payment_order_id", ids).eq("product_type", "annual_fortune"),
        db.from("order_refunds").select("payment_order_id,state").in("payment_order_id", ids),
      ]);
      const ref = new Map((refunds ?? []).map(r => [String(r.payment_order_id), String(r.state)]));
      return (orders ?? []).map(o => ({ id: String(o.payment_order_id), status: String(o.status), amount: Number(o.amount), paidAt: (o.paid_at as string | null) ?? null, refund: ref.get(String(o.payment_order_id)) ?? null }));
    },
    async uses(ids) {
      const { data } = await db.from("major_discount_uses").select("annual_order_id,major_order_id,user_id,reserved_at").in("annual_order_id", [...ids]);
      return (data ?? []).map(u => ({ annualOrderId: String(u.annual_order_id), majorOrderId: String(u.major_order_id), userId: String(u.user_id), reservedAt: String(u.reserved_at) }));
    },
    async majors(ids) {
      const { data } = await db.from("payment_orders").select("payment_order_id,status,provider_payment_id").in("payment_order_id", [...ids]);
      return (data ?? []).map(m => ({ id: String(m.payment_order_id), status: String(m.status), paymentKey: Boolean(m.provider_payment_id) }));
    },
    async insertUse(r) {
      const { error } = await db.from("major_discount_uses").insert({ annual_order_id: r.annualOrderId, major_order_id: r.majorOrderId, user_id: r.userId, rate: r.rate, amount: r.amount, original_amount: r.originalAmount, reserved_at: r.reservedAt });
      return !error ? "ok" : error.code === "23505" ? "conflict" : "error";
    },
    async casUse(annualOrderId, expect, set) {
      const { data, error } = await db.from("major_discount_uses").update({ major_order_id: set.majorOrderId, reserved_at: set.reservedAt, rate: set.rate, amount: set.amount, original_amount: set.originalAmount })
        .eq("annual_order_id", annualOrderId).eq("major_order_id", expect.majorOrderId).eq("reserved_at", expect.reservedAt).select("annual_order_id");
      return !error && (data ?? []).length === 1;
    },
    async orderOwner(orderId) { const { data } = await db.from("order_records").select("user_id").eq("payment_order_id", orderId).maybeSingle(); return (data?.user_id as string | null) ?? null; },
    async reportOrder(reportId) { const { data } = await db.from("paid_report_snapshots").select("order_id").eq("report_id", reportId).eq("product_type", "annual_fortune").maybeSingle(); return (data?.order_id as string | null) ?? null; },
    async input(orderId) {
      const { data } = await db.from("report_input_snapshots").select("payload_json").eq("order_id", orderId).gt("expires_at", new Date().toISOString()).maybeSingle();
      const p = (data?.payload_json as { reportInputPayload?: Record<string, unknown> } | null)?.reportInputPayload; return p && typeof p === "object" ? p : null;
    },
  };
}
