// F 후속 정정(2026-11-10): 결제 증정 이용권(kind='event') 기한 = 받은 날부터 30일.
// 새 발급(코드 eventTicketExpiresAt) + 이미 나간 이용권 늘리기(migration 20261111110000) — PGlite, 외부 호출 0.
import { createHash, randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { afterPaidOrder, readWallet } from "@/lib/ops/gift/service";
import { giftEventConfig } from "@/lib/ops/config";
import { opsNotifySql } from "../../helpers/opsNotify";

const FILE = readFileSync("supabase/migrations/20261111110000_v5_event_ticket_30d.sql", "utf8");
const BLOCK = FILE.slice(FILE.indexOf("do $$"), FILE.indexOf("end $$;") + "end $$;".length);
const DAY = 86_400_000;
const ON = { GIFT_EVENT_ENABLED: "1", GIFT_EVENT_START: "2026-01-01 00:00:00", GIFT_EVENT_END: "2030-12-31 23:59:59" };
const u = (n: number) => `00000000-0000-4000-8000-${String(n).padStart(12, "0")}`;
const hash = (n: number) => n.toString(16).padStart(64, "0");
const HASH = createHash("sha256").update("event-30d").digest("hex");
let h: Awaited<ReturnType<typeof opsNotifySql>>;
const gift = { call: (a: string, d: Record<string, unknown> = {}) => h.rpc("ops_gift", a, d) };
type Row = { id: string; status: string; created: string; exp: string };
const rowOf = (order: string) => h.one<Row>("select id,status,created_at::text created,expires_at::text exp from gift_rewards where source_order_id=$1", [order]);
const adjustments = () => h.all<{ row_key: string; old: string; new: string }>("select row_key,old_expires_at::text old,new_expires_at::text new from ticket_expiry_adjustments where reason='F_EVENT_TICKET_30D' order by id");
/** 옛 코드처럼 짧은 고정 기한(지금 + 5일)으로 1장을 내고, 받은 시각을 days일 앞으로 당긴다(받은 날 + 30일이 더 늦게 된다). */
async function oldTicket(order: string, user: string, daysAgo: number) {
  await h.pay(order, user);
  const cfg = { ...giftEventConfig(ON), ticketExpiresAt: new Date(Date.now() + 5 * DAY).toISOString() };
  expect((await afterPaidOrder(gift, order, cfg))?.issued).toMatchObject({ issued: true });
  await h.exec(`update gift_rewards set created_at=now()-interval '${daysAgo} days' where source_order_id=$1`, [order]);
  return rowOf(order);
}
const plus30 = (iso: string) => Date.parse(iso) + 30 * DAY;
/** migration 파일 전체(begin … commit)를 운영처럼 한 번에. */
const applyFile = () => h.asOwner(() => h.db.exec(FILE));

const A = u(901), B = u(902), C = u(903), D = u(904), E = u(905), FRIEND = u(906), SIGNUP = u(907), COMP = u(908);
beforeAll(async () => {
  h = await opsNotifySql({ freeBook: true });
  for (const id of [A, B, C, D, E, FRIEND, SIGNUP, COMP]) {
    await h.exec("insert into auth.users(id) values($1)", [id]);
    await h.exec("insert into account_contacts(user_id,full_name,email,email_source) values($1,'회원',$2,'typed')", [id, `${id.slice(-3)}@example.com`]);
    await h.exec("insert into account_profiles(user_id,display_name,provider) values($1,'회원','kakao')", [id]);
  }
}, 240_000);
afterAll(async () => { await h?.db.close(); });

describe("새로 나가는 결제 증정 이용권", () => {
  it("결제 1건 → 1장, 기한 = 받은 시각 + 30일(지갑·서재 기한도 같은 값)", async () => {
    await h.pay("e30-new", D);
    const before = Date.now();
    expect((await afterPaidOrder(gift, "e30-new", giftEventConfig(ON)))?.issued).toMatchObject({ issued: true });
    const r = await rowOf("e30-new");
    expect(Math.abs(Date.parse(r.exp) - plus30(r.created))).toBeLessThan(5_000);
    expect(Date.parse(r.exp)).toBeGreaterThanOrEqual(before + 30 * DAY - 1_000);
    expect(Date.parse((await readWallet(gift, D))!.expiresAt!)).toBe(Date.parse(r.exp));
  });
});

describe("이미 나간 이용권 늘리기(migration)", () => {
  let a: Row, b: Row, c: Row, e: Row, grantC: { id: string; exp: string }, signupExp: string, compExp: string, fresh: Row;
  beforeAll(async () => {
    a = await oldTicket("e30-a", A, 3); // 남은 이용권
    b = await oldTicket("e30-b", B, 1); // 선물 링크만 만들고 아직 안 받음
    expect(await gift.call("link_next", { userId: B, tokenHash: hash(301) })).toMatchObject({ ok: true, status: "gifted" });
    b = await rowOf("e30-b");
    c = await oldTicket("e30-c", C, 4); // 원장으로 옮겨 이미 책을 만든 장(운영 2장과 같은 꼴)
    expect(await gift.call("use_self", { userId: C, giftId: c.id })).toMatchObject({ ok: true, status: "used_self" });
    expect(await h.rpc("report_tickets", "redeem", C, { requestId: randomUUID(), inputHash: HASH, productType: "saju_mbti_full", reportId: `report_${randomUUID().replaceAll("-", "")}`, input: { a: 1 }, displayName: "검수" })).toMatchObject({ ok: true });
    c = await rowOf("e30-c");
    grantC = await h.one("select id,expires_at::text exp from report_ticket_grants where source_ref=$1", [`gift-self:${c.id}`]);
    e = await oldTicket("e30-e", E, 2); // 이미 받은 날 + 30일보다 늦은 기한(줄이지 않는지 보려고 손으로 늘림)
    await h.exec("update gift_rewards set expires_at=created_at+interval '40 days' where id=$1", [e.id]); e = await rowOf("e30-e");
    fresh = await rowOf("e30-new");
    // 가입(7일)·보상(11-30 고정 꼴) 이용권 — 손대지 않아야 한다.
    await h.exec("insert into gift_rewards(owner_user_id,kind,expires_at,created_at,product_scopes) values($1,'signup',now()+interval '6 days',now()-interval '1 day',array['saju_mbti_full'])", [SIGNUP]);
    await h.exec("insert into gift_rewards(owner_user_id,kind,expires_at,created_at) values($1,'comp',now()+interval '5 days',now()-interval '4 days')", [COMP]);
    signupExp = (await h.one<{ e: string }>("select expires_at::text e from gift_rewards where owner_user_id=$1", [SIGNUP])).e;
    compExp = (await h.one<{ e: string }>("select expires_at::text e from gift_rewards where owner_user_id=$1", [COMP])).e;
    await applyFile();
  }, 120_000);

  it("옛 기한 event 3장(남음·선물 링크·이미 씀)만 받은 날 + 30일로, 원래 기한은 기록표에", async () => {
    for (const [order, before] of [["e30-a", a], ["e30-b", b], ["e30-c", c]] as const) {
      const r = await rowOf(order);
      expect(Date.parse(r.exp)).toBe(plus30(r.created));
      expect(Date.parse(r.exp)).toBeGreaterThan(Date.parse(before.exp));
      expect(r.status).toBe(before.status);
    }
    const log = await adjustments();
    expect(log.map(l => l.row_key).sort()).toEqual([a.id, b.id, c.id].sort());
    for (const l of log) expect(Date.parse(l.new) - Date.parse(l.old)).toBeGreaterThan(20 * DAY);
  });
  it("줄이지 않는다·새 코드 발급분·가입·보상·원장은 그대로", async () => {
    expect((await rowOf("e30-e")).exp).toBe(e.exp);
    expect((await rowOf("e30-new")).exp).toBe(fresh.exp);
    expect((await h.one<{ e: string }>("select expires_at::text e from gift_rewards where owner_user_id=$1", [SIGNUP])).e).toBe(signupExp);
    expect((await h.one<{ e: string }>("select expires_at::text e from gift_rewards where owner_user_id=$1", [COMP])).e).toBe(compExp);
    expect((await h.one<{ exp: string }>("select expires_at::text exp from report_ticket_grants where id=$1", [grantC.id])).exp).toBe(grantC.exp);
  });
  it("화면 값: 서재 지갑·선물 받는 화면이 늘어난 기한을 보인다", async () => {
    expect(Date.parse((await readWallet(gift, A))!.expiresAt!)).toBe(Date.parse((await rowOf("e30-a")).exp));
    expect(Date.parse(String((await gift.call("peek", { tokenHash: hash(301), userId: FRIEND })).expiresAt))).toBe(Date.parse((await rowOf("e30-b")).exp));
  });
  it("다시 적용해도 바뀌는 행 0", async () => {
    await applyFile();
    expect(await adjustments()).toHaveLength(3);
  });
});

describe("멈춤 조건(아무것도 바꾸지 않음)", () => {
  it("기한이 지나 expired가 된 event 행이 있으면 F_EVENT_30D_STOP", async () => {
    const x = await oldTicket("e30-x", A, 10);
    await h.exec("update gift_rewards set expires_at=now()-interval '1 hour', status='expired' where id=$1", [x.id]);
    await expect(h.exec(BLOCK)).rejects.toThrow(/F_EVENT_30D_STOP expired=1/);
    expect((await rowOf("e30-x")).status).toBe("expired");
    expect(await adjustments()).toHaveLength(3);
    await h.exec("delete from gift_rewards where id=$1", [x.id]);
  });
  it("원장으로 옮겨져 아직 안 쓴 장(받은 선물)이 옛 기한이면 늘릴 수 없으므로 F_EVENT_30D_STOP", async () => {
    const y = await oldTicket("e30-y", A, 2);
    expect(await gift.call("link_next", { userId: A, tokenHash: hash(302) })).toMatchObject({ ok: true });
    expect(await gift.call("claim", { userId: FRIEND, tokenHash: hash(302) })).toMatchObject({ ok: true, status: "claimed" });
    await expect(h.exec(BLOCK)).rejects.toThrow(/F_EVENT_30D_STOP expired=0 ledger_left=1/);
    expect((await rowOf("e30-y")).exp).toBe(y.exp);
    expect(await adjustments()).toHaveLength(3);
  });
});
