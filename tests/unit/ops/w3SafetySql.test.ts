// W3 P0 안전장치 — migration 20261114100000(PGlite, 외부 호출 0): 4종 판매 중지 스위치(ops_sales)·Anthropic 경보 쿨다운·SQL 직접 조작 감사 트리거,
// 처리 봇 /sales·[4종 멈춤]·[다시 열기], 연결 오류 자동 멈춤(실제 SQL로).
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
vi.mock("@/lib/ops/admin/actions", () => ({ runAdminActionAs: async () => ({ status: 200, body: { ok: true } }), defaultAdminDeps: () => ({}) }));
import { readFileSync } from "node:fs";
import { handleUpdate, type BotDeps } from "@/lib/ops/notify/bots";
import { BOT_COMMANDS } from "@/lib/ops/notify/flush";
import { anthropicAlarm, createGenerationAlerts, maybeAutoPause, type RunLite } from "@/lib/ops/generation/alerts";
import type { SupabaseClient } from "@supabase/supabase-js";
import { readSalesPause, resetSalesPauseCache } from "@/lib/ops/salesPause";
import { fakeTelegram, opsNotifySql } from "../../helpers/opsNotify";
import { TICKET_A as A } from "../../helpers/ticketPublicationSql";

const MIGRATION = "supabase/migrations/20261114100000_v5_w3_safety.sql";
let h: Awaited<ReturnType<typeof opsNotifySql>>, tg: ReturnType<typeof fakeTelegram>, deps: BotDeps, upd = 1;
const OWNER = "777000111";
const sales = { call: (a: string, d: Record<string, unknown> = {}) => h.rpc("ops_sales", a, d) };
const cb = (data: string, from = OWNER, messageId = 1) => ({ update_id: upd++, callback_query: { id: `cq-${upd}`, from: { id: Number(from) }, data, message: { message_id: messageId, chat: { id: Number(from) } } } });
const msg = (text: string) => ({ update_id: upd++, message: { message_id: 70_000 + upd, from: { id: Number(OWNER) }, chat: { id: Number(OWNER), type: "private" }, text } });
const auditOf = (action: string) => h.all<{ actor: string; action: string; target: string; detail: Record<string, unknown> }>("select actor,action,target,detail from ops_audit_log where action=$1 order by id", [action]);
const pausedNow = async () => (await sales.call("status")).on === true;
/** 앱 경로 흉내: PostgREST처럼 session_user = authenticator, 역할 = service_role. */
async function asApi<T>(f: () => Promise<T>): Promise<T> {
  await h.db.exec("reset role; set session authorization authenticator; set role service_role");
  // PGlite는 reset session authorization으로 처음 세션(postgres)에 돌아가지 않는다 — 이름으로 되돌린다.
  try { return await f(); } finally { await h.db.exec("set session authorization postgres"); await h.db.exec("set role service_role"); }
}

beforeAll(async () => {
  h = await opsNotifySql({ freeBook: true });
  await h.asOwner(async () => {
    await h.db.exec(readFileSync(MIGRATION, "utf8"));
    await h.db.exec("do $$ begin if not exists(select 1 from pg_roles where rolname='authenticator') then create role authenticator noinherit; end if; end $$; grant service_role to authenticator;");
  });
  tg = fakeTelegram(OWNER);
  deps = { notify: h.notify, signup: h.rpcOf("ops_signup"), sales, tg, now: () => Date.now(), paymentMethod: async () => null, setting: async () => null, putSetting: async () => true,
    admin: {} as BotDeps["admin"], adminId: A, audit: e => h.audit(e), db: h.auditDb, env: {} };
}, 240_000);
afterAll(async () => { await h?.db.close(); });

describe("ops_sales 스위치", () => {
  it("행이 없으면 판매 중. pause → 바뀜 + 감사 한 줄, 같은 pause 다시 → changed=false(감사 없음), resume → 감사 한 줄", async () => {
    expect(await sales.call("status")).toMatchObject({ ok: true, on: false });
    const p = await sales.call("pause", { by: "telegram", reason: "manual", actorUserId: A });
    expect(p).toMatchObject({ ok: true, on: true, changed: true, by: "telegram", reason: "manual" });
    expect(await sales.call("pause", { by: "auto", reason: "connection" })).toMatchObject({ ok: true, on: true, changed: false, by: "telegram" });
    expect(await auditOf("sales_paused")).toEqual([{ actor: "admin", action: "sales_paused", target: "sales_pause", detail: { by: "telegram", reason: "manual", detail: {} } }]);
    expect(await sales.call("resume", { by: "telegram" })).toMatchObject({ ok: true, on: false, changed: true });
    expect(await sales.call("resume", { by: "telegram" })).toMatchObject({ changed: false });
    expect((await auditOf("sales_resumed")).length).toBe(1);
    expect(await sales.call("nope")).toMatchObject({ ok: false, code: "UNKNOWN_ACTION" });
  });
  it("자동 멈춤은 actor=system으로 남는다. 이상한 by·reason 글자는 지운다", async () => {
    expect(await sales.call("pause", { by: "auto", reason: "connection; drop table x" })).toMatchObject({ changed: true, reason: "connection drop table x" });
    expect((await auditOf("sales_paused")).at(-1)).toMatchObject({ actor: "system", detail: { by: "auto" } });
    await sales.call("resume", { by: "telegram" });
  });
  it("service_role은 ops_settings에 직접 못 쓴다(쓰기는 ops_sales만)", async () => {
    await expect(asApi(() => h.db.query("insert into ops_settings(key,value) values('sales_pause','{\"on\":true}')"))).rejects.toThrow();
    expect(await pausedNow()).toBe(false);
  });
});

describe("Anthropic 잔액/인증 경보(alarm)", () => {
  it("첫 경보 → alerted + 판매 멈춤, 1시간 안 다시 → RECENT(쿨다운은 OpenAI api_credit과 따로), 이미 멈춘 상태면 paused=false", async () => {
    await h.exec("insert into ops_notifications(kind,bot,dedupe_key,payload) values('api_credit','ops','credit:x','{}')");
    const first = await sales.call("alarm", { code: "anthropic_credit" });
    expect(first).toMatchObject({ ok: true, alerted: true, paused: true, on: true });
    expect(await sales.call("status")).toMatchObject({ on: true, by: "auto", reason: "anthropic_credit" });
    expect(await sales.call("alarm", { code: "anthropic_auth" })).toMatchObject({ ok: true, alerted: false, code: "RECENT" });
    expect((await auditOf("anthropic_alarm")).length).toBe(1);
    await sales.call("resume", { by: "telegram" });
    // 1시간 지나면 다시 경보. 손으로 멈춰 둔 상태면 경보만(paused=false).
    await h.exec("update ops_settings set value=jsonb_set(value,'{at}',to_jsonb(now()-interval '61 minutes')) where key='anthropic_alarm'");
    await sales.call("pause", { by: "telegram", reason: "manual" });
    expect(await sales.call("alarm", { code: "anthropic_auth" })).toMatchObject({ alerted: true, paused: false });
    expect(await sales.call("alarm", { code: "" })).toMatchObject({ ok: false, code: "INVALID" });
    await sales.call("resume", { by: "telegram" });
  });
  it("anthropicAlarm(): 경보가 나면 처리 봇에 「🚨 Anthropic 잔액/인증 — 모든 생성 실패 중」 + [다시 열기], RECENT면 보내지 않는다", async () => {
    await h.exec("update ops_settings set value=jsonb_set(value,'{at}',to_jsonb(now()-interval '61 minutes')) where key='anthropic_alarm'");
    const sent: { text: string; extra?: Record<string, unknown> }[] = [];
    const send = async (text: string, extra?: Record<string, unknown>) => { sent.push({ text, extra }); };
    const rpc = (a: string, d: Record<string, unknown>) => sales.call(a, d);
    expect(await anthropicAlarm(rpc, send, "anthropic_credit")).toBe(true);
    expect(sent[0].text).toContain("🚨 <b>Anthropic 잔액/인증 — 모든 생성 실패 중</b>");
    expect(sent[0].text).toContain("4종 판매를 자동으로 멈췄어요");
    expect(sent[0].extra).toEqual({ reply_markup: { inline_keyboard: [[{ text: "다시 열기", callback_data: "sl:resume" }]] } });
    expect(await anthropicAlarm(rpc, send, "anthropic_credit")).toBe(false);
    expect(sent).toHaveLength(1);
    await sales.call("resume", { by: "telegram" });
  });
});

describe("연결 오류 자동 멈춤(maybeAutoPause, 실제 SQL)", () => {
  const run = (id: string, minAgo: number, cls = "connection", outcome = "deferred"): RunLite => ({ report_id: id, outcome, created_at: new Date(Date.now() - minAgo * 60_000).toISOString(), calls: [{ kind: "first", cls }], product: "saju_mbti_full" });
  it("다시 연 뒤의 연결 실패 주문만 센다: 3건이 되면 한 번 멈추고 알림 1번, 겹쳐 불러도 1번", async () => {
    const sent: string[] = [];
    const send = async (t: string) => { sent.push(t); };
    const rpc = (a: string, d: Record<string, unknown>) => sales.call(a, d);
    // 방금 다시 열었다(위 시험). 다시 열기 전 실패는 세지 않는다.
    await h.exec("update ops_settings set value=jsonb_set(value,'{at}',to_jsonb(now()-interval '4 minutes')) where key='sales_pause'");
    const before = [run("r1", 8), run("r2", 7), run("r3", 6)];
    expect(await maybeAutoPause(rpc, send, before, Date.now())).toBe(false);
    const after = [...before, run("a1", 3), run("a1", 2.5), run("a2", 2), run("think", 1, "thinking_exhausted"), run("ok", 1, "connection", "published")];
    expect(await maybeAutoPause(rpc, send, after, Date.now())).toBe(false);
    const three = [...after, run("a3", 0.5)];
    const [x, y] = await Promise.all([maybeAutoPause(rpc, send, three, Date.now()), maybeAutoPause(rpc, send, three, Date.now())]);
    expect([x, y].filter(Boolean)).toHaveLength(1);
    expect(sent).toHaveLength(1);
    expect(sent[0]).toContain("🚨 <b>4종 판매 자동 멈춤</b> · 연결 오류로 실패한 주문 3건(최근 10분)");
    expect(await sales.call("status")).toMatchObject({ on: true, by: "auto", reason: "connection" });
    // 멈춘 동안 더 실패해도 다시 알리지 않는다. 다시 여는 것은 버튼으로만.
    expect(await maybeAutoPause(rpc, send, [...three, run("a4", 0.2)], Date.now())).toBe(false);
  });
});

describe("자동 멈춤 시뮬레이션(실패 기록 → createGenerationAlerts.failed → ops_sales → 처리 봇)", () => {
  /** 서비스 롤 DB 대역: 알림 모듈이 쓰는 질의(book_generation_runs·paid_report_snapshots 읽기, rpc)만 PGlite로. */
  const fakeDb = {
    from: (table: string) => {
      const q: { gte?: string; ids?: string[] } = {};
      const chain = {
        select: () => chain, order: () => chain, limit: () => chain,
        gte: (_k: string, v: string) => { q.gte = v; return chain; }, in: (_k: string, v: string[]) => { q.ids = v; return chain; },
        then: (res: (v: unknown) => unknown, rej: (e: unknown) => unknown) => (table === "book_generation_runs"
          ? h.all("select report_id,outcome,created_at,calls from book_generation_runs where created_at>=$1 order by id", [q.gte])
          : h.all("select report_id,product_type from paid_report_snapshots where report_id = any($1)", [q.ids])).then(rows => ({ data: rows, error: null })).then(res, rej),
      };
      return chain;
    },
    rpc: async (fn: string, args: { p_action: string; p_data: Record<string, unknown> }) => ({ data: await h.rpc(fn, args.p_action, args.p_data), error: null }),
  } as unknown as SupabaseClient;
  it("529 연결 실패 주문 3건(10분) → 세 번째 기록에서 4종 판매 자동 멈춤 + 알림 1번, 생각 소진은 세지 않는다", async () => {
    await sales.call("resume", { by: "telegram" });
    await h.exec("update ops_settings set value=jsonb_set(value,'{at}',to_jsonb(now()-interval '30 minutes')) where key='sales_pause'");
    const sent: { text: string; extra?: Record<string, unknown> }[] = [];
    const alerts = createGenerationAlerts(fakeDb, async (text, extra) => { sent.push({ text, extra }); });
    const fail = async (n: number, cls: string) => {
      const o = await h.pay(`w3-sim-${n}`, null);
      await h.exec("insert into book_generation_runs(report_id,lane,provider,model,outcome,reason,calls) values($1,'queue','anthropic','claude-sonnet-5-5','deferred','official:incomplete',$2::jsonb)",
        [o.report_id, JSON.stringify([{ kind: "first", error: cls === "connection" ? "http_529" : null, cls }])]);
      await alerts.failed({ reportId: o.report_id, product: "saju_mbti_full" });
    };
    await fail(1, "connection"); await fail(2, "thinking_exhausted"); await fail(3, "connection");
    expect(await pausedNow()).toBe(false);
    await fail(4, "connection");
    expect(await sales.call("status")).toMatchObject({ on: true, by: "auto", reason: "connection" });
    const auto = sent.filter(m => m.text.includes("4종 판매 자동 멈춤"));
    expect(auto).toHaveLength(1);
    expect(auto[0].text).toContain("연결 오류로 실패한 주문 3건(최근 10분)");
    expect(auto[0].extra).toEqual({ reply_markup: { inline_keyboard: [[{ text: "다시 열기", callback_data: "sl:resume" }]] } });
    await fail(5, "connection");
    expect(sent.filter(m => m.text.includes("4종 판매 자동 멈춤"))).toHaveLength(1);
    expect((await auditOf("sales_paused")).at(-1)).toMatchObject({ actor: "system", detail: { by: "auto", reason: "connection", detail: { count: 3, windowMin: 10 } } });
    await sales.call("resume", { by: "telegram" });
  });
});

describe("처리 봇 /sales · [4종 멈춤] · [다시 열기]", () => {
  it("명령 목록에 /sales가 있다", () => { expect(BOT_COMMANDS.ops.map(c => c.command)).toContain("sales"); });
  it("/sales → 지금 상태 + 반대 버튼, [다시 열기] → 판매 중 + 감사(by telegram, 관리자 id), 다른 사람은 무시", async () => {
    await sales.call("pause", { by: "auto", reason: "connection" });
    expect(await handleUpdate("ops", msg("/sales"), deps)).toBe("sales");
    const status = tg.sent("ops").at(-1)!;
    expect(status.text).toMatch(/^⏸ <b>4종 판매 멈춤<\/b> · \d{2}\/\d{2} \d{2}:\d{2} · 자동 · 연결 오류 연속/);
    expect(status.markup).toEqual({ inline_keyboard: [[{ text: "다시 열기", callback_data: "sl:resume" }]] });
    expect(await handleUpdate("ops", cb("sl:resume", "123456"), deps)).toBe("ignored");
    expect(await pausedNow()).toBe(true);
    expect(await handleUpdate("ops", cb("sl:resume", OWNER, status.id), deps)).toBe("sales_resumed");
    expect(await pausedNow()).toBe(false);
    const edit = tg.calls.filter(c => c.method === "editMessageText").at(-1)!;
    expect(edit.body).toMatchObject({ message_id: status.id, reply_markup: { inline_keyboard: [[{ text: "4종 멈춤", callback_data: "sl:pause" }]] } });
    expect(String(edit.body.text)).toMatch(/^▶️ <b>4종 판매 중<\/b>/);
    const resumed = (await h.all<{ actor_user_id: string; detail: Record<string, unknown> }>("select actor_user_id,detail from ops_audit_log where action='sales_resumed' order by id desc limit 1"))[0];
    expect(resumed).toMatchObject({ actor_user_id: A, detail: { by: "telegram" } });
    expect(await handleUpdate("ops", cb("sl:pause", OWNER, status.id), deps)).toBe("sales_paused");
    expect(await pausedNow()).toBe(true);
    expect(await handleUpdate("ops", cb("sl:pause", OWNER, status.id), deps)).toBe("sales_paused");
    expect(tg.calls.filter(c => c.method === "answerCallbackQuery").at(-1)!.body).toMatchObject({ text: "이미 멈춰 있어요." });
    await handleUpdate("ops", cb("sl:resume", OWNER, status.id), deps);
  });
  it("스위치 저장소가 실패하면 상태를 바꾸지 않고 감사에 sales_switch_failed", async () => {
    const broken = { ...deps, sales: { call: async () => ({ ok: false, code: "STORAGE_FAILED" }) } };
    expect(await handleUpdate("ops", cb("sl:pause"), broken)).toBe("sales_switch_failed");
    expect(await pausedNow()).toBe(false);
    expect((await auditOf("sales_switch_failed")).at(-1)).toMatchObject({ detail: { via: "telegram", want: "pause", code: "STORAGE_FAILED" } });
  });
  it("readSalesPause(): 실제 SQL 상태를 읽는다. 저장소가 실패·시간 초과면 null(판매 계속)", async () => {
    resetSalesPauseCache();
    expect(await readSalesPause({ store: sales })).toMatchObject({ on: false });
    await sales.call("pause", { by: "telegram" });
    expect(await readSalesPause({ store: sales })).toMatchObject({ on: true, by: "telegram" });
    await sales.call("resume", { by: "telegram" });
    expect(await readSalesPause({ store: { call: async () => ({ ok: false }) } })).toBeNull();
  });
});

describe("SQL 직접 조작 감사 트리거(ops_audit_sql)", () => {
  const sqlRows = () => h.all<{ action: string; target: string; detail: Record<string, unknown> }>("select action,target,detail from ops_audit_log where action like 'sql_%' order by id");
  it("돈·책 표 13개 중 있는 표마다 트리거가 붙는다", async () => {
    const t = await h.all<{ tbl: string }>("select c.relname tbl from pg_trigger g join pg_class c on c.oid=g.tgrelid where g.tgname='ops_audit_sql' order by 1");
    expect(t.map(r => r.tbl)).toEqual(expect.arrayContaining(["book_generation_state", "gift_rewards", "ops_settings", "order_records", "order_refunds", "paid_report_snapshots", "payment_orders", "report_generation_jobs", "report_ticket_grants", "report_ticket_ledger", "report_ticket_redemptions"]));
  });
  it("CLI·편집기(session_user postgres)의 변경은 행마다 sql_* 한 줄(표·바뀐 칸·세션), 앱 경로(authenticator·service_role)는 조용", async () => {
    const order = await h.pay("w3-audit-1", null);
    const n0 = (await sqlRows()).length;
    // 앱 경로: SECURITY DEFINER 함수 안(current_user = postgres)이어도 session_user가 authenticator면 기록 없음.
    await asApi(async () => { await sales.call("pause", { by: "telegram" }); await sales.call("resume", { by: "telegram" }); });
    expect((await sqlRows()).length).toBe(n0);
    // 직접 SQL(소유자 세션) — 행 1개 바꾸면 1줄, 바뀐 칸 이름만(값 없음).
    await h.exec("update order_records set legacy=legacy where order_code=$1", [order.order_code]);
    await h.exec("update paid_report_snapshots set expires_at=expires_at+interval '1 day', gate_version=coalesce(gate_version,'바뀜') where report_id=$1", [order.report_id]);
    const rows = (await sqlRows()).slice(n0);
    expect(rows.map(r => [r.action, r.target])).toEqual([["sql_update", `order_records:${order.order_code}`], ["sql_update", `paid_report_snapshots:${order.report_id}`]]);
    expect(rows[1].detail).toMatchObject({ via: "sql", table: "paid_report_snapshots", session: "postgres", cols: expect.arrayContaining(["gate_version"]) });
    expect(JSON.stringify(rows)).not.toContain("바뀜");
  });
  it("감사 쓰기가 실패해도 원래 조작은 막지 않는다(WARNING만)", async () => {
    await h.asOwner(async () => {
      await h.db.exec("alter table ops_audit_log add constraint w3_block check(action not like 'sql_%') not valid");
      try { await h.db.query("update ops_settings set updated_at=now() where key='signup_grant'"); }
      finally { await h.db.exec("alter table ops_audit_log drop constraint w3_block"); }
    });
    expect((await h.one<{ n: number }>("select count(*)::int n from ops_settings where key='signup_grant'")).n).toBe(1);
  });
});
