import { readFileSync } from "node:fs";
import type { SupabaseClient } from "@supabase/supabase-js";
import { normalizeReportInputPayload } from "@/lib/report-generation/reportInputAdapter";
import type { RefundProvider } from "@/lib/payment/tossRefundClient";
import type { BotName, Telegram, TelegramResult } from "@/lib/ops/notify/telegram";
import { opsSql } from "./opsSql";
import { RAW_FULL } from "./v5Scenarios";

/** 운영 Q 시험 도우미: PGlite(운영 migration 적용) + 결제 심기 + 모의 텔레그램·토스. 외부 호출 0. */
export const OPS_Q_MIGRATION = "supabase/migrations/20261107100000_v5_ops_notify.sql";
/** 운영 Q 추가: 공유 실패 경보(표·함수·대기표 kind). */
export const OPS_SHARE_ALERT_MIGRATION = "supabase/migrations/20261107110000_v5_ops_share_alert.sql";
/** 메타 배포와 함께: 깨우기 트리거는 새 줄이 있을 때만 서버를 부른다. */
export const OPS_WAKE_MIGRATION = "supabase/migrations/20261109100000_v5_ops_wake_nonempty.sql";
/** 결제수단 긴급 수정과 같은 배포: 시험 계정(관리자·누나) 집계 제외·「시험」 표시. */
export const OPS_TEST_ACCOUNTS_MIGRATION = "supabase/migrations/20261110200000_v5_test_accounts.sql";
export type Call = { call(a: string, d?: Record<string, unknown>): Promise<Record<string, unknown>> };
export const inputOf = (name = "하람") => {
  const n = normalizeReportInputPayload({ ...RAW_FULL, person: { ...RAW_FULL.person, name } }, { now: () => new Date("2026-10-27T03:00:00.000Z") });
  if (!n.ok) throw new Error("payload");
  return n.value;
};
export const refundProvider: RefundProvider = {
  lookup: async i => ({ ok: true as const, payment: { paymentKey: i.paymentKey, orderId: i.providerOrderId, currency: "KRW" as const, totalAmount: i.originalAmount, balanceAmount: i.originalAmount, status: "DONE", method: "간편결제", isPartialCancelable: true, cancels: [] } }),
  cancel: async i => ({ ok: true as const, payment: { paymentKey: i.paymentKey, orderId: i.providerOrderId, currency: "KRW" as const, totalAmount: i.originalAmount, balanceAmount: 0, status: "CANCELED", method: "간편결제", isPartialCancelable: true,
    cancels: [{ transactionKey: "tx", cancelAmount: i.amount, cancelReason: i.cancelReason, cancelStatus: "DONE", canceledAt: new Date().toISOString() }] } }),
};

/** F(가입 이용권·퍼널): 운영과 같은 순서로 1+1·보상(final4·별칭 고침·perf) migration을 먼저 올린 뒤 운영 Q·시험 계정, 마지막에 F. */
export const FREE_BOOK_PRE_MIGRATIONS = ["supabase/migrations/20261106100000_v5_final4_event_comp.sql", "supabase/migrations/20261106200000_v5_deploy_gift_pending_alias.sql", "supabase/migrations/20261107090000_v5_perf_event_tickets.sql"];
export const FREE_BOOK_MIGRATION = "supabase/migrations/20261111090000_v5_free_book.sql";
export async function opsNotifySql(opts: { freeBook?: boolean } = {}) {
  const h = await opsSql();
  if (opts.freeBook) { await h.db.exec("reset role"); for (const f of FREE_BOOK_PRE_MIGRATIONS) await h.db.exec(readFileSync(f, "utf8")); await h.db.exec("set role service_role"); }
  const asOwner = async <T>(f: () => Promise<T>) => { await h.db.exec("reset role"); try { return await f(); } finally { await h.db.exec("set role service_role"); } };
  await asOwner(async () => { await h.db.exec(readFileSync(OPS_Q_MIGRATION, "utf8")); await h.db.exec(readFileSync(OPS_SHARE_ALERT_MIGRATION, "utf8")); await h.db.exec(readFileSync(OPS_WAKE_MIGRATION, "utf8")); await h.db.exec(readFileSync(OPS_TEST_ACCOUNTS_MIGRATION, "utf8")); if (opts.freeBook) await h.db.exec(readFileSync(FREE_BOOK_MIGRATION, "utf8")); });
  const one = <T = Record<string, unknown>>(sql: string, params: unknown[] = []) => asOwner(async () => (await h.db.query(sql, params)).rows[0] as T);
  const all = <T = Record<string, unknown>>(sql: string, params: unknown[] = []) => asOwner(async () => (await h.db.query(sql, params)).rows as T[]);
  const exec = (sql: string, params: unknown[] = []) => asOwner(async () => { await h.db.query(sql, params); });
  const rpcOf = (fn: string): Call => ({ call: (a, d = {}) => h.rpc(fn, a, d) });
  const order = rpcOf("ops_order"), notify = rpcOf("ops_notify"), recon = rpcOf("ops_recon");
  const audit = async (e: { actor: "admin" | "system"; actorUserId?: string | null; action: string; target: string; detail?: Record<string, unknown> }) => {
    await exec("insert into ops_audit_log(actor,actor_user_id,action,target,detail) values($1,$2,$3,$4,$5::jsonb)", [e.actor, e.actorUserId ?? null, e.action, e.target, JSON.stringify(e.detail ?? {})]); return true;
  };
  /** 결제 완료 주문 1건(회원). 입력 기록(report_input_snapshots)도 운영과 같은 모양. */
  async function pay(id: string, user: string | null, input: unknown = inputOf(), amount = 3900) {
    await h.paid.call("create_order", { paymentOrderId: id, providerOrderId: id, productType: "saju_mbti_full", provider: "toss", amount, inputSnapshot: { reportInputPayload: input } });
    await order.call("attach", { paymentOrderId: id, ...(user ? { userId: user } : {}), name: "회원", email: `${id}@example.com` });
    await exec("insert into report_input_snapshots(order_id,payload_json,expires_at) values($1,$2::jsonb,now()+interval '30 days') on conflict (order_id) do update set payload_json=excluded.payload_json",
      [id, JSON.stringify({ reportInputPayload: input })]);
    const claim = await h.paid.call("confirm_claim", { orderId: id, paymentKey: `k-${id}`, amount });
    const done = await h.paid.call("confirm_finish", { orderId: id, paymentKey: `k-${id}`, token: claim.token });
    if (done.ok !== true) throw new Error(`confirm_finish ${JSON.stringify(done)}`);
    return (await one<{ report_id: string; order_code: string }>("select po.report_id,x.order_code from payment_orders po join order_records x on x.payment_order_id=po.payment_order_id where po.payment_order_id=$1", [id]));
  }
  /** 책 완성(발행)으로 바꾼다. */
  const publish = (reportId: string, at = "now()") => exec(`update paid_report_snapshots set status='COMPLETED',published_at=${at},snapshot_json=coalesce(snapshot_json,'{}'::jsonb)||'{"productVersion":"v5"}'::jsonb where report_id=$1`, [reportId]);
  /** 서버 감사 로그 읽기 흉내(봇 비밀번호 실패 기록). */
  const auditDb = { from: () => {
    const q: Record<string, unknown> = {};
    const chain: Record<string, unknown> = {
      select: () => chain, order: () => chain, limit: () => chain,
      eq: (k: string, v: unknown) => { q[k] = v; return chain; }, gte: (_k: string, v: unknown) => { q.since = v; return chain; },
      then: (res: (v: unknown) => unknown, rej: (e: unknown) => unknown) => all<{ created_at: Date }>("select created_at from ops_audit_log where action=$1 and created_at>=$2 order by created_at", [q.action, q.since])
        .then(rows => ({ data: rows.map(r => ({ created_at: new Date(r.created_at).toISOString() })), error: null })).then(res, rej),
    };
    return chain;
  } } as unknown as SupabaseClient;
  return { ...h, asOwner, one, all, exec, rpcOf, order, notify, recon, audit, pay, publish, auditDb };
}

/** 모의 텔레그램: 호출을 기록하고 sendMessage마다 새 message_id를 준다. fail이 켜지면 모두 실패. */
export function fakeTelegram(ownerId = "777000111") {
  const calls: { bot: BotName; method: string; body: Record<string, unknown> }[] = [];
  let next = 1000;
  const tg: Telegram & { calls: typeof calls; fail: boolean; sent(bot?: BotName): { bot: BotName; text: string; markup: unknown; id: number }[] } = {
    ownerId, calls, fail: false,
    configured: () => true,
    async call(bot, method, body): Promise<TelegramResult> {
      calls.push({ bot, method, body });
      if (tg.fail) return { ok: false, code: "TG_502" };
      return method === "sendMessage" ? { ok: true, result: { message_id: ++next } } : { ok: true, result: true };
    },
    sent: bot => calls.map((c, i) => ({ c, i })).filter(({ c }) => c.method === "sendMessage" && (!bot || c.bot === bot))
      .map(({ c, i }) => ({ bot: c.bot, text: String(c.body.text), markup: c.body.reply_markup, id: 1001 + calls.slice(0, i).filter(x => x.method === "sendMessage").length })),
  };
  return tg;
}
