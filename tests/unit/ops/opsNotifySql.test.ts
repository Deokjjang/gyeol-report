// 운영 Q(PGlite): 알림 대기표·트리거 5종(결제·환불 경로별·문의·미발행)·재전송·10회 실패·문의 접수 규칙·두 번 결제 판정·열람 기록·카드 결과·공유 실패 경보. 외부 호출 0.
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { processRefunds } from "@/lib/ops/orders/refund";
import { inputOf, opsNotifySql, refundProvider as provider, type Call } from "../../helpers/opsNotify";
import { TICKET_A as A, TICKET_B as B } from "../../helpers/ticketPublicationSql";

type H = Awaited<ReturnType<typeof opsNotifySql>>;
let h: H, order: Call, recon: Call, notify: Call;
const other = inputOf("다른이");
const one = <T = Record<string, unknown>>(sql: string, params: unknown[] = []) => h.one<T>(sql, params);
const all = <T = Record<string, unknown>>(sql: string, params: unknown[] = []) => h.all<T>(sql, params);
const exec = (sql: string, params: unknown[] = []) => h.exec(sql, params);
const audit = (e: Parameters<H["audit"]>[0]) => h.audit(e);
const pay = (id: string, user: string | null, input: unknown = inputOf(), amount = 3900) => h.pay(id, user, input, amount);
const rows = (kind?: string) => all<{ id: number; kind: string; bot: string; dedupe_key: string; payload: Record<string, unknown> }>(
  `select id,kind,bot,dedupe_key,payload from ops_notifications ${kind ? "where kind=$1" : ""} order by id`, kind ? [kind] : []);

beforeAll(async () => {
  h = await opsNotifySql();
  order = h.order; recon = h.recon; notify = h.notify;
}, 120_000);
afterAll(async () => { await h?.db.close(); });

describe("트리거: 결제·환불·문의는 대기표에 넣기만 한다", () => {
  it("결제 완료 → 매출 「결제」 1줄(같은 주문은 한 번만), 내용은 id만", async () => {
    await pay("po-q-1", A);
    const r = await rows("payment");
    expect(r.filter(x => x.payload.paymentOrderId === "po-q-1")).toEqual([expect.objectContaining({ bot: "sales", dedupe_key: "pay:po-q-1", payload: { paymentOrderId: "po-q-1" } })]);
    await exec("update payment_orders set updated_at=now() where payment_order_id='po-q-1'");
    expect((await rows("payment")).filter(x => x.payload.paymentOrderId === "po-q-1")).toHaveLength(1);
  });
  it("관리자 환불(환불 완료 처리) → 매출 「환불」", async () => {
    await pay("po-q-2", A);
    const req = await order.call("refund_request", { paymentOrderId: "po-q-2", source: "admin", reason: "시험", actorUserId: A, capCount: 5, capAmount: 50000,
      dayStart: new Date(Date.now() - 86_400_000).toISOString(), dayEnd: new Date(Date.now() + 86_400_000).toISOString() });
    expect(req.ok).toBe(true);
    await processRefunds({ order, audit }, provider, { paymentOrderId: "po-q-2" });
    expect((await one<{ status: string }>("select status from payment_orders where payment_order_id='po-q-2'")).status).toBe("refunded");
    expect((await rows("refund")).map(x => x.dedupe_key)).toContain("refund:po-q-2");
  });
  it("외부 환불 기록(토스 콘솔 직접 취소를 관리자가 기록) → 매출 「환불」", async () => {
    await pay("po-q-3", A);
    const r = await recon.call("external_refund", { paymentOrderId: "po-q-3", adminUserId: A, amount: 3900, canceledAt: new Date().toISOString() });
    expect(r.ok).toBe(true);
    expect((await rows("refund")).map(x => x.dedupe_key)).toContain("refund:po-q-3");
  });
  it("대기표 넣기가 실패해도 결제·환불 상태 변경은 그대로 진행된다", async () => {
    await exec("alter table ops_notifications add constraint q_test_block check(kind<>'payment') not valid");
    try {
      await pay("po-q-4", A);
      expect((await one<{ status: string }>("select status from payment_orders where payment_order_id='po-q-4'")).status).toBe("paid");
      expect((await rows("payment")).map(x => x.dedupe_key)).not.toContain("pay:po-q-4");
    } finally { await exec("alter table ops_notifications drop constraint q_test_block"); }
    // 1분 크론의 「누락 보충」이 다시 넣는다(같은 키는 한 번만).
    expect((await notify.call("scan_unpublished")).swept).toBe(1);
    expect((await notify.call("scan_unpublished")).swept).toBe(0);
    expect((await rows("payment")).map(x => x.dedupe_key)).toContain("pay:po-q-4");
  });
  it("누락 보충은 환불·문의도 다시 넣고, 알림 시작 전 결제는 넣지 않는다(첫 배포 때 옛 주문 알림 0)", async () => {
    await pay("po-q-4b", A);
    await exec("delete from ops_notifications where dedupe_key='pay:po-q-4b' or dedupe_key='refund:po-q-3'");
    await exec("update payment_orders set paid_at=(select (value->>'at')::timestamptz-interval '1 minute' from ops_settings where key='notify_since') where payment_order_id='po-q-4b'");
    expect((await notify.call("scan_unpublished")).swept).toBe(1);
    const keys = (await rows()).map(x => x.dedupe_key);
    expect(keys).toContain("refund:po-q-3");
    expect(keys).not.toContain("pay:po-q-4b");
  });
  it("ready → canceled(결제 전 취소)는 환불 알림이 아니다", async () => {
    await h.paid.call("create_order", { paymentOrderId: "po-q-5", providerOrderId: "po-q-5", productType: "saju_mbti_full", provider: "toss", amount: 3900, inputSnapshot: {} });
    await exec("update payment_orders set status='canceled',canceled_at=now() where payment_order_id='po-q-5'");
    expect((await rows()).map(x => x.dedupe_key)).not.toContain("refund:po-q-5");
  });
});

describe("미발행 감지", () => {
  it("결제 뒤 30분이 지나도 책이 없으면 처리 봇 「미발행」, 주문당 1번(3일보다 오래된 주문은 보지 않는다)", async () => {
    await pay("po-q-6", A);
    await exec("update payment_orders set paid_at=now()-interval '40 minutes' where payment_order_id='po-q-6'");
    await pay("po-q-7", A);
    await exec("update payment_orders set paid_at=now()-interval '5 days' where payment_order_id='po-q-7'");
    expect((await notify.call("scan_unpublished")).ok).toBe(true);
    await notify.call("scan_unpublished");
    const keys = (await rows("unpublished")).map(x => x.dedupe_key);
    expect(keys.filter(k => k === "unpub:po-q-6")).toHaveLength(1);
    expect(keys).not.toContain("unpub:po-q-7");
    expect(keys).not.toContain("unpub:po-q-1");
  });
});

describe("대기표 비우기: 잡기·보냄·재전송·10회 실패", () => {
  it("잡은 줄은 90초 동안 다시 잡히지 않고, 보낸 줄은 다시 나오지 않는다", async () => {
    const a = (await notify.call("claim", { limit: 50 })).items as { id: number }[];
    expect(a.length).toBeGreaterThan(0);
    const b = (await notify.call("claim", { limit: 50 })).items as unknown[];
    expect(b).toEqual([]);
    for (const x of a) expect((await notify.call("sent", { id: x.id, messageId: 100 + x.id, closed: true })).ok).toBe(true);
    expect((await notify.call("sent", { id: a[0].id, messageId: 1 })).ok).toBe(false);
  });
  it("실패하면 간격을 늘려 다시 보내고(1·2·4…분, 최대 60분), 10번 실패하면 남겨 두고 처리 봇 경고를 넣는다", async () => {
    await exec("insert into ops_notifications(kind,bot,dedupe_key,payload) values('payment','sales','pay:fail-test','{\"paymentOrderId\":\"x\"}')");
    const id = (await one<{ id: number }>("select id from ops_notifications where dedupe_key='pay:fail-test'")).id;
    const gaps: number[] = [];
    for (let i = 0; i < 10; i++) {
      await exec("update ops_notifications set next_attempt_at=now()-interval '1 second',locked_until=null where id=$1", [id]);
      const r = await notify.call("failed", { id, error: "TELEGRAM_502" });
      expect(r.attempts).toBe(i + 1);
      gaps.push((await one<{ m: number }>("select round(extract(epoch from next_attempt_at-now())/60)::int m from ops_notifications where id=$1", [id])).m);
    }
    expect(gaps).toEqual([1, 2, 4, 8, 16, 32, 60, 60, 60, 60]);
    const left = await one<{ sent_at: string | null; attempts: number; last_error: string }>("select sent_at,attempts,last_error from ops_notifications where id=$1", [id]);
    expect(left).toEqual({ sent_at: null, attempts: 10, last_error: "TELEGRAM_502" });
    await exec("update ops_notifications set next_attempt_at=now()-interval '1 second' where id=$1", [id]);
    expect(((await notify.call("claim", { limit: 50 })).items as { id: number }[]).map(x => x.id)).not.toContain(id);
    expect((await rows("notify_failed")).map(x => x.dedupe_key)).toEqual([`nfail:${id}`]);
    const pending = await notify.call("pending");
    expect((pending.failed as { id: number }[]).map(x => x.id)).toContain(id);
  });
});

describe("문의 접수(서재)", () => {
  it("결제 30분 안·만드는 중이면 「안 나옴」을 접수하지 않는다(MAKING)", async () => {
    await pay("po-q-8", B);
    expect(await notify.call("submit", { userId: B, paymentOrderId: "po-q-8", reason: "not_open", device: "아이폰 사파리" })).toEqual({ ok: false, code: "MAKING" });
  });
  it("접수: 기기 정보 + 처리 봇 「문의」, 주문마다 열린 요청 1개", async () => {
    await exec("update payment_orders set paid_at=now()-interval '2 hours' where payment_order_id='po-q-8'");
    const r = await notify.call("submit", { userId: B, paymentOrderId: "po-q-8", reason: "not_open", device: "아이폰 사파리" });
    expect(r.ok).toBe(true);
    const q = await one<{ device: string; reason: string; status: string; memo: string }>("select device,reason,status,memo from order_requests where id=$1", [r.id]);
    expect(q).toEqual({ device: "아이폰 사파리", reason: "not_open", status: "open", memo: "" });
    expect((await rows("request")).map(x => x.dedupe_key)).toContain(`req:${r.id}`);
    expect(await notify.call("submit", { userId: B, paymentOrderId: "po-q-8", reason: "not_open" })).toEqual({ ok: false, code: "ALREADY_OPEN" });
  });
  it("두 번 결제: 같은 계정·상품·입력·24시간 안 2건 이상이면 접수, 아니면 NO_DOUBLE", async () => {
    await pay("po-q-9", B, other);
    expect(await notify.call("submit", { userId: B, paymentOrderId: "po-q-9", reason: "double_paid" })).toEqual({ ok: false, code: "NO_DOUBLE" });
    await pay("po-q-10", B, other);
    const d = await one<{ d: { paymentOrderId: string }[] }>("select ops_notify_duplicates('po-q-10') d");
    expect(d.d.map(x => x.paymentOrderId)).toEqual(["po-q-9", "po-q-10"]);
    expect((await notify.call("submit", { userId: B, paymentOrderId: "po-q-10", reason: "double_paid" })).ok).toBe(true);
    // 다른 입력(po-q-8)·24시간 넘게 떨어진 결제는 같은 결제로 보지 않는다.
    await exec("update payment_orders set paid_at=now()-interval '30 hours' where payment_order_id='po-q-9'");
    expect(((await one<{ d: unknown[] }>("select ops_notify_duplicates('po-q-10') d")).d)).toHaveLength(1);
  });
  it("계정당 하루 3건까지", async () => {
    for (const id of ["po-q-11", "po-q-12"]) {
      await pay(id, B, inputOf(id));
      await exec("update payment_orders set paid_at=now()-interval '2 hours' where payment_order_id=$1", [id]);
    }
    expect((await notify.call("submit", { userId: B, paymentOrderId: "po-q-11", reason: "not_open" })).ok).toBe(true);
    expect(await notify.call("submit", { userId: B, paymentOrderId: "po-q-12", reason: "not_open" })).toEqual({ ok: false, code: "DAILY_LIMIT" });
  });
  it("사유는 둘만(계산 문의는 접수하지 않는다)", async () => {
    expect(await notify.call("submit", { userId: A, paymentOrderId: "po-q-1", reason: "calc_error" })).toEqual({ ok: false, code: "REASON_INVALID" });
    expect(await notify.call("submit", { userId: A, paymentOrderId: "po-q-1", reason: "refund" })).toEqual({ ok: false, code: "REASON_INVALID" });
  });
});

describe("열람 기록", () => {
  it("첫 열람 시각·횟수, 같은 기기 30분 안 재열람은 1번", async () => {
    const rid = (await one<{ report_id: string }>("select report_id from payment_orders where payment_order_id='po-q-1'")).report_id;
    const dev1 = "0123456789abcdef", dev2 = "fedcba9876543210";
    await notify.call("record_view", { reportId: rid, device: dev1 });
    await notify.call("record_view", { reportId: rid, device: dev1 });
    expect((await one<{ view_count: number; payment_order_id: string }>("select view_count,payment_order_id from report_views where report_id=$1", [rid]))).toEqual({ view_count: 1, payment_order_id: "po-q-1" });
    await notify.call("record_view", { reportId: rid, device: dev2 });
    await exec("update report_views set last_counted_at=now()-interval '31 minutes' where report_id=$1", [rid]);
    await notify.call("record_view", { reportId: rid, device: dev2 });
    expect((await one<{ view_count: number }>("select view_count from report_views where report_id=$1", [rid])).view_count).toBe(3);
    expect((await notify.call("record_view", { reportId: "x", device: dev1 })).ok).toBe(false);
  });
});

describe("처리 상태·카드 결과·관리자 요청함", () => {
  it("버튼 동작은 한 번만(begin_action), 정리된 메시지는 거절", async () => {
    const id = (await one<{ id: number }>("select id from ops_notifications where kind='request' order by id limit 1")).id;
    await exec("update ops_notifications set sent_at=now(),message_id=7 where id=$1", [id]);
    expect((await notify.call("begin_action", { id, action: "refund" })).ok).toBe(true);
    expect((await notify.call("begin_action", { id, action: "refund" })).ok).toBe(false);
    expect((await notify.call("close", { id, line: "✅ 안내 보냄" })).ok).toBe(true);
    expect((await notify.call("close", { id, line: "다시" })).ok).toBe(false);
    expect((await notify.call("begin_action", { id, action: "guide" })).ok).toBe(false);
  });
  it("처리 봇이 처리하면 요청이 처리 완료 + 방법·시각, 카드 결과에 7일 동안 보인다", async () => {
    const q = await one<{ id: string }>("select id from order_requests where payment_order_id='po-q-8'");
    expect((await notify.call("resolve_request", { requestId: q.id, resolution: "guide" })).ok).toBe(true);
    const res = (await notify.call("card_results", { userId: B })).results as { paymentOrderId: string; resolution: string | null; status: string }[];
    expect(res.find(x => x.paymentOrderId === "po-q-8")).toMatchObject({ status: "done", resolution: "guide" });
    await exec("update order_requests set resolved_at=now()-interval '8 days' where id=$1", [q.id]);
    const later = (await notify.call("card_results", { userId: B })).results as { paymentOrderId: string }[];
    expect(later.map(x => x.paymentOrderId)).not.toContain("po-q-8");
  });
  it("관리자 화면 환불(자동 처리)은 처리 방법 refund로 남는다", async () => {
    await exec("update payment_orders set paid_at=now()-interval '2 hours' where payment_order_id='po-q-6'");
    const s = await notify.call("submit", { userId: A, paymentOrderId: "po-q-6", reason: "not_open" });
    expect(s.ok).toBe(true);
    const req = await order.call("refund_request", { paymentOrderId: "po-q-6", source: "admin", reason: "시험", actorUserId: A, capCount: 9, capAmount: 99999,
      dayStart: new Date(Date.now() - 86_400_000).toISOString(), dayEnd: new Date(Date.now() + 86_400_000).toISOString() });
    expect(req.ok).toBe(true);
    await processRefunds({ order, audit }, provider, { paymentOrderId: "po-q-6" });
    expect(await one("select status,resolution,resolved_by from order_requests where id=$1", [s.id])).toEqual({ status: "done", resolution: "refund", resolved_by: "auto" });
  });
  it("관리자 요청함이 새 사유·이용권 책 요청(주문 없음)도 보여 준다", async () => {
    await exec("insert into order_requests(report_id,user_id,reason,device) values('report_ticketbook0000000001',$1,'not_open','안드로이드 크롬')", [A]);
    const r = await h.rpc("ops_admin", "requests", { status: "open" });
    const list = r.requests as { orderCode: string | null; reportId: string | null; reason: string; device: string | null }[];
    expect(list).toEqual(expect.arrayContaining([expect.objectContaining({ orderCode: null, reportId: "report_ticketbook0000000001", reason: "not_open", device: "안드로이드 크롬" })]));
    const done = await h.rpc("ops_admin", "requests", { status: "done" });
    expect((done.requests as { resolution: string }[]).map(x => x.resolution)).toEqual(expect.arrayContaining(["guide", "refund"]));
  });
  it("크론 전용 동작도 SQL 오류 없이 돈다: 오래된 기록 정리(purge)·미발행 환불 때 자동 재시도 멈춤(hold_retry)", async () => {
    expect(await notify.call("purge")).toEqual({ ok: true });
    await pay("po-q-hold", A);
    const held = await notify.call("hold_retry", { paymentOrderId: "po-q-hold" });
    const jobs = await all<{ last_error_code: string | null }>("select last_error_code from report_generation_jobs where order_id='po-q-hold' and status in ('QUEUED','RETRYING')");
    expect(held).toEqual({ ok: true, held: jobs.length });
    expect(jobs.every(j => j.last_error_code === "REFUND_HOLD")).toBe(true);
  });
  it("12시간 동안 손대지 않은 건은 1번만 다시 알린다", async () => {
    await exec("update ops_notifications set sent_at=now()-interval '13 hours',message_id=coalesce(message_id,9) where kind in ('request','unpublished') and closed_at is null");
    const r1 = await notify.call("remind");
    expect(r1.reminded).toBeGreaterThan(0);
    expect((await notify.call("remind")).reminded).toBe(0);
    expect((await rows("reminder")).filter(x => x.dedupe_key.startsWith("remind:2")).length).toBe(1);
  });
  it("텔레그램이 같은 update를 다시 보내면 두 번째는 fresh=false", async () => {
    expect(await notify.call("seen", { bot: "ops", updateId: 555 })).toEqual({ ok: true, fresh: true });
    expect(await notify.call("seen", { bot: "ops", updateId: 555 })).toEqual({ ok: true, fresh: false });
  });
  it("운영 설정은 깨우기 주소(https·/api/)와 웹훅 기록만 쓸 수 있다", async () => {
    expect((await one<{ r: boolean }>("select ops_notify_put_setting('notify_wake_url','{\"url\":\"https://www.gyeolreport.com/api/ops/notify-wake\"}'::jsonb) r")).r).toBe(true);
    expect((await one<{ r: boolean }>("select ops_notify_put_setting('notify_wake_url','{\"url\":\"http://evil.example/api/x\"}'::jsonb) r")).r).toBe(false);
    expect((await one<{ r: boolean }>("select ops_notify_put_setting('profile_launch_at','{}'::jsonb) r")).r).toBe(false);
    // 주소가 있어도 pg_net이 없는 DB(PGlite)에서는 넣기가 그대로 된다.
    await exec("insert into ops_notifications(kind,bot,dedupe_key) values('reminder','ops','remind:wake-test')");
    expect((await rows("reminder")).map(x => x.dedupe_key)).toContain("remind:wake-test");
  });
  it("깨우기 호출 수 제한(분당)", async () => {
    let last: Record<string, unknown> = {};
    for (let i = 0; i < 4; i++) last = await notify.call("wake", { max: 3 });
    expect(last).toMatchObject({ allowed: false, calls: 4 });
  });
  it("깨우기 트리거는 새 줄이 들어온 문장에서만 서버를 부른다(0줄 넣기·크론의 빈 보충은 안 부름)", async () => {
    // pg_net 대신 같은 이름의 가짜 함수(부른 주소를 표에 남김). 이 시험 안에서만 둔다.
    await exec("create schema net");
    await exec("create table net.calls(id serial primary key, url text)");
    await exec(`create function net.http_post(url text, body jsonb default '{}', params jsonb default '{}', headers jsonb default '{}', timeout_milliseconds integer default 5000)
        returns bigint language sql as $$ insert into net.calls(url) values(url) returning id::bigint $$`);
    try {
      await exec("select ops_notify_put_setting('notify_wake_url','{\"url\":\"https://www.gyeolreport.com/api/ops/notify-wake\"}'::jsonb)");
      const calls = async () => (await one<{ n: number }>("select count(*)::int n from net.calls")).n;
      await exec("insert into ops_notifications(kind,bot,dedupe_key) values('reminder','ops','remind:wake-1')");
      expect(await calls()).toBe(1);
      // 같은 키(on conflict do nothing → 0줄)
      await exec("insert into ops_notifications(kind,bot,dedupe_key) values('reminder','ops','remind:wake-1') on conflict (dedupe_key) do nothing");
      expect(await calls()).toBe(1);
      // 1분 크론: 앞 시험이 남긴 미발행 주문은 첫 번에 넣고(새 줄 → 1번), 넣을 것이 없는 두 번째는 0번(예전엔 두 문장 = 2번)
      const first = await notify.call("scan_unpublished");
      const afterFirst = await calls();
      expect(afterFirst).toBe(1 + (Number(first.added) > 0 ? 1 : 0) + (Number(first.swept) > 0 ? 1 : 0));
      expect(await notify.call("scan_unpublished")).toMatchObject({ added: 0, swept: 0 });
      expect(await calls()).toBe(afterFirst);
      // 여러 줄을 한 문장에 넣으면 1번
      await exec("insert into ops_notifications(kind,bot,dedupe_key) values('reminder','ops','remind:wake-2'),('reminder','ops','remind:wake-3')");
      expect(await calls()).toBe(afterFirst + 1);
      expect((await one<{ url: string }>("select url from net.calls order by id desc limit 1")).url).toBe("https://www.gyeolreport.com/api/ops/notify-wake");
    } finally { await exec("drop schema net cascade"); }
  });
});

// 운영 Q 추가(공유 재발 방지): 공유 API 4xx·5xx가 10분 안에 3번 이상이면 처리 봇 「🚨 공유 실패 N건」 1줄. 같은 원인(상태 코드 + 책 버전)은 1시간에 1번.
describe("공유 실패 경보", () => {
  // 서버(service_role)가 부르는 그대로 — 권한(표·순서·함수 실행)까지 본다.
  const fail = async (status: number, report: string | null = null) => (await h.db.query<{ r: Record<string, unknown> }>("select public.ops_share_failure($1::integer,$2::text) r", [status, report])).rows[0].r;
  const alerts = () => rows("share_failed");
  it("3번째 실패에서 1줄(상태 코드·책 버전만, 책 id 없음), 같은 원인은 1시간 안에 다시 보내지 않고 새 원인은 보낸다", async () => {
    const { report_id: v5 } = await pay("po-share-alert", A);
    await h.publish(v5);
    expect(await fail(403, v5)).toEqual({ ok: true, alerted: false, count: 1 });
    expect(await fail(404, v5)).toEqual({ ok: true, alerted: false, count: 2 });
    expect(await fail(503)).toEqual({ ok: true, alerted: true, count: 3 });
    const [a] = await alerts();
    expect(a).toMatchObject({ bot: "ops", payload: { count: 3, windowMinutes: 10, keys: ["403:v5", "404:v5", "503:unknown"],
      causes: [{ status: 403, version: "v5", count: 1 }, { status: 404, version: "v5", count: 1 }, { status: 503, version: "unknown", count: 1 }] } });
    expect(JSON.stringify(a.payload)).not.toContain(v5);
    expect((await all<{ column_name: string }>("select column_name from information_schema.columns where table_name='ops_share_failures' order by ordinal_position")).map(c => c.column_name)).toEqual(["id", "at", "status", "version"]);
    // 같은 원인만 또 → 보내지 않음. 새 원인(500) → 1줄 더.
    expect(await fail(403, v5)).toMatchObject({ alerted: false, count: 4 });
    expect(await fail(500)).toMatchObject({ alerted: true, count: 5 });
    expect(await alerts()).toHaveLength(2);
    // 1시간 뒤(경보는 61분 전, 실패는 11분 전으로 옮김): 10분 창에 다시 3번이 모여야 같은 원인도 다시 보낸다.
    await exec("update ops_notifications set created_at=created_at-interval '61 minutes' where kind='share_failed'");
    await exec("update ops_share_failures set at=at-interval '11 minutes'");
    expect(await fail(403, v5)).toMatchObject({ alerted: false, count: 1 });
    expect(await fail(403, v5)).toMatchObject({ alerted: false, count: 2 });
    expect(await fail(403, v5)).toMatchObject({ alerted: true, count: 3 });
    expect((await alerts()).at(-1)!.payload).toMatchObject({ count: 3, keys: ["403:v5"] });
  });
  it("상태 코드 400~599만, 하루 지난 기록은 지운다, 없는 책·이상한 id는 버전 모름", async () => {
    expect(await fail(200)).toEqual({ ok: false, code: "STATUS" });
    expect(await fail(399)).toEqual({ ok: false, code: "STATUS" });
    await exec("update ops_share_failures set at=now()-interval '25 hours'");
    await fail(404, "report_not_a_real_book_000000");
    await fail(404, "x");
    expect(await all("select status,version from ops_share_failures order by id")).toEqual([{ status: 404, version: "unknown" }, { status: 404, version: "unknown" }]);
  });
  it("익명·로그인 사용자는 기록 함수를 부를 수 없다(서버 service_role만)", async () => {
    const grants = await all<{ grantee: string }>("select grantee from information_schema.routine_privileges where routine_name='ops_share_failure' order by grantee");
    expect(grants.map(g => g.grantee).filter(g => ["anon", "authenticated", "PUBLIC"].includes(g))).toEqual([]);
  });
});

describe("시험 계정(관리자·누나): 집계 제외, 알림은 「시험」 표시(2026-11-10)", () => {
  const SISTER = "d0dd2e4e-38cf-49b5-8dea-7a35ee54dd55";
  const put = async (v: unknown) => (await one<{ r: boolean }>("select ops_notify_put_setting('test_accounts',$1::jsonb) r", [JSON.stringify(v)])).r;
  const isTest = async (u: string | null) => (await one<{ r: boolean }>("select ops_test_user($1::uuid) r", [u])).r;
  it("처음 값은 누나 계정 하나, 서버는 uuid 배열(소문자·20개까지)만 쓸 수 있다", async () => {
    expect((await one<{ value: unknown }>("select value from ops_settings where key='test_accounts'")).value).toEqual({ ids: [SISTER] });
    expect([await isTest(SISTER), await isTest(A), await isTest(null)]).toEqual([true, false, false]);
    for (const bad of [{}, { ids: "x" }, { ids: [1] }, { ids: ["not-a-uuid"] }, { ids: [SISTER.toUpperCase()] }, { ids: Array.from({ length: 21 }, () => A) }, []]) expect(await put(bad)).toBe(false);
    expect(await put({ ids: [A, SISTER] })).toBe(true);
    expect([await isTest(SISTER), await isTest(A), await isTest(B)]).toEqual([true, true, false]);
  });
  it("매출 통계(stats)는 시험 계정의 결제·환불을 빼고, 주문 사실에는 test 표시", async () => {
    await put({ ids: [SISTER] });
    const day = { start: new Date(Date.now() - 3_600_000).toISOString(), end: new Date(Date.now() + 3_600_000).toISOString() };
    const before = await notify.call("stats", day);
    await pay("po-t-1", B, inputOf("시험"), 12_000);
    const counted = await notify.call("stats", day);
    expect([Number(counted.payCount) - Number(before.payCount), Number(counted.paySum) - Number(before.paySum)]).toEqual([1, 12_000]);
    expect(((await notify.call("order", { paymentOrderId: "po-t-1" })).order as { test: boolean }).test).toBe(false);
    expect(await put({ ids: [B, SISTER] })).toBe(true);
    const excluded = await notify.call("stats", day);
    // B의 이 구간 결제(앞 시험들 것 포함)가 모두 빠진다.
    const b = await one<{ n: number; s: number }>("select count(*)::int n,coalesce(sum(amount),0)::int s from payment_orders where status in ('paid','refunded') and paid_at>=$1 and paid_at<$2 and ops_order_user(payment_order_id)=$3",
      [day.start, day.end, B]);
    expect(b.n).toBeGreaterThanOrEqual(1);
    expect([Number(excluded.payCount), Number(excluded.paySum)]).toEqual([Number(counted.payCount) - b.n, Number(counted.paySum) - b.s]);
    expect(((await notify.call("order", { paymentOrderId: "po-t-1" })).order as { test: boolean }).test).toBe(true);
    // 환불도 빠진다(외부 환불 기록 경로).
    const r = await recon.call("external_refund", { paymentOrderId: "po-t-1", adminUserId: A, amount: 12_000, canceledAt: new Date().toISOString() });
    expect(r.ok).toBe(true);
    const afterRefund = await notify.call("stats", day);
    expect([afterRefund.refundCount, afterRefund.refundSum]).toEqual([excluded.refundCount, excluded.refundSum]);
    // 알림 자체는 그대로 대기표에 들어간다(보낼 때 「시험」 표시).
    expect((await rows()).map(x => x.dedupe_key)).toEqual(expect.arrayContaining(["pay:po-t-1", "refund:po-t-1"]));
    await put({ ids: [SISTER] });
  });
  it("이용권 책 사실에도 test 표시, 판정 함수는 서버(service_role)만", async () => {
    expect((await one<{ d: string }>("select pg_get_functiondef('ops_notify_ticket(text)'::regprocedure) d")).d).toContain("'test',public.ops_test_user(v_rr.user_id)");
    const grants = await all<{ grantee: string }>("select grantee from information_schema.routine_privileges where routine_name='ops_test_user' order by grantee");
    expect(grants.map(g => g.grantee).filter(g => ["anon", "authenticated", "PUBLIC"].includes(g))).toEqual([]);
  });
});
