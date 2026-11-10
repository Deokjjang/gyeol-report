// F(2026-11-11) 가입 이용권·멈춤 장치·퍼널 집계 — migration 20261111090000(PGlite, 외부 호출 0).
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { readWallet } from "@/lib/ops/gift/service";
import { opsNotifySql } from "../../helpers/opsNotify";

let h: Awaited<ReturnType<typeof opsNotifySql>>;
const u = (n: number) => `00000000-0000-4000-8000-${String(n).padStart(12, "0")}`;
const hash = (n: number) => n.toString(16).padStart(64, "0");
const FOUR = ["saju_mbti_full", "career_money_study", "love_marriage_child", "saju_mbti_compatibility"];
const iso = (ms: number) => new Date(ms).toISOString();
const win = () => ({ start: iso(Date.now() - 3_600_000), end: iso(Date.now() + 86_400_000), days: 7, products: FOUR });
const signup = { call: (a: string, d: Record<string, unknown> = {}) => h.rpc("ops_signup", a, d) };
const gift = { call: (a: string, d: Record<string, unknown> = {}) => h.rpc("ops_gift", a, d) };
const funnel = { call: (a: string, d: Record<string, unknown> = {}) => h.rpc("ops_funnel", a, d) };
/** 가입을 마친 계정(동의 시각·정보 시각을 정할 수 있다). */
async function joined(id: string, at = "now()") {
  await h.exec("insert into auth.users(id) values($1) on conflict do nothing", [id]);
  await h.exec(`insert into account_profiles(user_id,display_name,provider,created_at) values($1,'회원','kakao',${at}) on conflict do nothing`, [id]);
  await h.exec(`insert into account_contacts(user_id,full_name,email,email_source,completed_at) values($1,'회원',$2,'typed',${at}) on conflict do nothing`, [id, `${id.slice(-4)}@example.com`]);
}

beforeAll(async () => { h = await opsNotifySql({ freeBook: true }); }, 240_000);
afterAll(async () => { await h?.db.close(); });

describe("가입 이용권 지급(grant)", () => {
  it("신규 가입 → 1장(받은 시각 + 7일, 출시 4종). 같은 요청이 두 번 와도 1장", async () => {
    const A = u(701); await joined(A);
    const first = await signup.call("grant", { userId: A, providerHash: hash(701), ...win() });
    expect(first).toMatchObject({ ok: true, issued: true, status: "available" });
    const again = await Promise.all([signup.call("grant", { userId: A, providerHash: hash(701), ...win() }), signup.call("grant", { userId: A, providerHash: hash(701), ...win() })]);
    for (const r of again) expect(r).toMatchObject({ ok: true, issued: false, code: "ALREADY_ISSUED" });
    const rows = await h.all<{ kind: string; product_scopes: string[]; gift_only: boolean; days: number }>("select kind,product_scopes,gift_only,round(extract(epoch from expires_at-created_at)/86400)::int days from gift_rewards where owner_user_id=$1", [A]);
    expect(rows).toEqual([{ kind: "signup", product_scopes: FOUR, gift_only: false, days: 7 }]);
    expect((await h.one<{ n: number }>("select count(*)::int n from signup_grant_hashes")).n).toBe(1);
  });
  it("기존 회원(시작 전에 동의·가입 정보를 마친 계정)은 주지 않는다", async () => {
    const OLD = u(702); await joined(OLD, "now()-interval '3 days'");
    expect(await signup.call("grant", { userId: OLD, providerHash: hash(702), ...win() })).toMatchObject({ issued: false, code: "EXISTING_MEMBER" });
    const LATE = u(703); await joined(LATE); await h.exec("update account_profiles set created_at=now()-interval '2 days' where user_id=$1", [LATE]);
    expect(await signup.call("grant", { userId: LATE, providerHash: hash(703), ...win() })).toMatchObject({ issued: false, code: "EXISTING_MEMBER" });
  });
  it("탈퇴 후 같은 제공자 id로 다시 가입(새 계정 id, 같은 해시) → 주지 않는다. 원문 id·이메일은 기록에 없다", async () => {
    const AGAIN = u(704); await joined(AGAIN);
    expect(await signup.call("grant", { userId: AGAIN, providerHash: hash(701), ...win() })).toMatchObject({ issued: false, code: "ALREADY_RECEIVED" });
    const cols = await h.all<{ column_name: string }>("select column_name from information_schema.columns where table_schema='public' and table_name='signup_grant_hashes' order by ordinal_position");
    expect(cols.map(c => c.column_name)).toEqual(["hash", "granted_at"]);
  });
  it("가입 정보를 아직 안 마쳤거나 기간 밖이거나 값이 틀리면 주지 않는다", async () => {
    const NOPROFILE = u(705); await h.exec("insert into auth.users(id) values($1)", [NOPROFILE]); await h.exec("insert into account_profiles(user_id,display_name,provider) values($1,'회원','google')", [NOPROFILE]);
    expect(await signup.call("grant", { userId: NOPROFILE, providerHash: hash(705), ...win() })).toMatchObject({ issued: false, code: "PROFILE_REQUIRED" });
    const B = u(706); await joined(B);
    expect(await signup.call("grant", { userId: B, providerHash: hash(706), ...win(), start: iso(Date.now() + 3_600_000), end: iso(Date.now() + 7_200_000) })).toMatchObject({ issued: false, code: "NOT_IN_PERIOD" });
    expect(await signup.call("grant", { userId: B, providerHash: hash(706), ...win(), start: iso(Date.now() - 7_200_000), end: iso(Date.now() - 3_600_000) })).toMatchObject({ issued: false, code: "NOT_IN_PERIOD" });
    expect(await signup.call("grant", { userId: B, providerHash: "abc", ...win() })).toMatchObject({ ok: false, code: "INVALID" });
    expect(await signup.call("grant", { userId: B, providerHash: hash(706), ...win(), products: ["major_fortune", "x"] })).toMatchObject({ ok: false, code: "INVALID" });
    expect((await h.one<{ n: number }>("select count(*)::int n from gift_rewards where owner_user_id=$1", [B])).n).toBe(0);
  });
  it("멈춤(pause): 꺼짐이면 지급하지 않고, 다시 켜면(resume) 준다. 상태는 DB 설정값", async () => {
    const C = u(707); await joined(C);
    expect(await signup.call("pause", { by: "telegram" })).toMatchObject({ ok: true, on: false });
    expect(await signup.call("status")).toMatchObject({ ok: true, on: false });
    expect(await signup.call("grant", { userId: C, providerHash: hash(707), ...win() })).toMatchObject({ issued: false, code: "PAUSED" });
    expect(await signup.call("state", { userId: C })).toMatchObject({ on: false, mine: null });
    expect(await signup.call("resume", { by: "telegram" })).toMatchObject({ ok: true, on: true });
    expect(await signup.call("grant", { userId: C, providerHash: hash(707), ...win() })).toMatchObject({ issued: true });
    expect(await signup.call("state", { userId: C })).toMatchObject({ on: true, mine: { status: "available" } });
  });
});

describe("선물·양도 불가와 사용 범위", () => {
  const D = u(711);
  beforeAll(async () => { await joined(D); await signup.call("grant", { userId: D, providerHash: hash(711), ...win() }); });
  it("서재: 가입 이용권만 있으면 선물 가능 0장(버튼 없음), 전체 장수·기한에는 센다", async () => {
    const w = await readWallet(gift, D);
    expect(w).toMatchObject({ ledger: 0, giftable: 0, usable: 1, total: 1, giftExpiresAt: null });
    expect(Date.parse(w!.expiresAt!)).toBeGreaterThan(Date.now() + 6 * 86_400_000);
  });
  it("서버 선물 API: 선물하기 창(link_next)은 NO_GIFTABLE, 장 지정 링크(link)는 GIFT_NOT_GIFTABLE, 표도 막는다", async () => {
    expect(await gift.call("link_next", { userId: D, tokenHash: hash(9001) })).toMatchObject({ ok: false, code: "NO_GIFTABLE" });
    const id = (await h.one<{ id: string }>("select id from gift_rewards where owner_user_id=$1", [D])).id;
    expect(await gift.call("link", { userId: D, giftId: id, tokenHash: hash(9002) })).toMatchObject({ ok: false, code: "GIFT_NOT_GIFTABLE" });
    await expect(h.exec("update gift_rewards set status='gifted',token_hash=$2 where id=$1", [id, hash(9003)])).rejects.toThrow(/gift_rewards_signup_not_giftable/);
  });
  it("다른 이용권(1+1·보상)은 그대로 선물할 수 있고, 가입 이용권은 남는다", async () => {
    await h.exec("insert into gift_rewards(owner_user_id,kind,expires_at) values($1,'comp',now()+interval '20 days')", [D]);
    expect(await readWallet(gift, D)).toMatchObject({ giftable: 1, total: 2 });
    expect(await gift.call("link_next", { userId: D, tokenHash: hash(9004) })).toMatchObject({ ok: true, status: "gifted" });
    expect((await h.one<{ status: string }>("select status from gift_rewards where owner_user_id=$1 and kind='signup'", [D])).status).toBe("available");
  });
  it("대운·세운에는 쓸 수 없고(옮기지 않음), 출시 4종에는 쓴다 — 원장 이유 SIGNUP_FREE·범위 4종", async () => {
    expect(await gift.call("spend", { userId: D, productType: "major_fortune", requestId: "r-major" })).toMatchObject({ ok: true, moved: false });
    expect(await gift.call("spend", { userId: D, productType: "annual_fortune", requestId: "r-annual" })).toMatchObject({ ok: true, moved: false });
    expect(await gift.call("spend", { userId: D, productType: "love_marriage_child", requestId: "r-love" })).toMatchObject({ ok: true, moved: true });
    const g = await h.one<{ reason: string; product_scopes: string[]; days: number }>("select reason,product_scopes,round(extract(epoch from expires_at-now())/86400)::int days from report_ticket_grants where user_id=$1", [D]);
    expect(g).toMatchObject({ reason: "SIGNUP_FREE", product_scopes: FOUR, days: 7 });
  });
  it("기한 7일이 지나면 쓰지 못하고 센 장수에서도 빠진다", async () => {
    const E = u(712); await joined(E); await signup.call("grant", { userId: E, providerHash: hash(712), ...win() });
    await h.exec("update gift_rewards set expires_at=now()-interval '1 second' where owner_user_id=$1 and kind='signup'", [E]);
    expect(await gift.call("spend", { userId: E, productType: "saju_mbti_full", requestId: "r-exp" })).toMatchObject({ moved: false });
    expect(await readWallet(gift, E)).toMatchObject({ total: 0, usable: 0 });
    expect(await signup.call("state", { userId: E })).toMatchObject({ mine: { status: "expired" } });
  });
});

describe("멈춤 장치 경보·현황", () => {
  it("최근 60분 신규 가입(시험 계정 제외) 20건 이상이면 경보 1건, 1시간 안에는 다시 안 보낸다", async () => {
    await h.exec("delete from ops_notifications where kind='signup_surge'");
    const base = 800;
    // 시험 계정 5명 + 일반 14명 = 지금까지 일반 신규 가입은 (위 describe의 가입 수와 합쳐) 기준 미만이 되도록 확인부터.
    const tests = [u(base), u(base + 1), u(base + 2), u(base + 3), u(base + 4)];
    await h.rpc("ops_notify_put_setting", "test_accounts", { ids: tests });
    for (const t of tests) await joined(t);
    const before = await signup.call("surge_check", { threshold: 20 });
    expect(before.alerted).toBe(false);
    const need = 20 - Number(before.count);
    for (let i = 0; i < need; i++) await joined(u(base + 10 + i));
    const r = await signup.call("surge_check", { threshold: 20 });
    expect(r).toMatchObject({ alerted: true, count: 20 });
    expect(await signup.call("surge_check", { threshold: 20 })).toMatchObject({ alerted: false, code: "RECENT" });
    const rows = await h.all<{ kind: string; bot: string; payload: Record<string, unknown> }>("select kind,bot,payload from ops_notifications where kind='signup_surge'");
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ bot: "ops", payload: { count: 20, on: true } });
    // 1시간이 지나면 다시 보낼 수 있다.
    await h.exec("update ops_notifications set created_at=now()-interval '61 minutes' where kind='signup_surge'");
    expect(await signup.call("surge_check", { threshold: 20 })).toMatchObject({ alerted: true });
  });
  it("API 잔액 경보는 1시간에 1번", async () => {
    expect(await signup.call("credit_alert", { code: "anthropic_credit" })).toMatchObject({ alerted: true });
    expect(await signup.call("credit_alert", { code: "anthropic_credit" })).toMatchObject({ alerted: false, code: "RECENT" });
    expect((await h.one<{ payload: { code: string } }>("select payload from ops_notifications where kind='api_credit'")).payload.code).toBe("anthropic_credit");
  });
  it("/campaign 현황: 시험 계정은 가입·지급에서 빠진다", async () => {
    const T = u(800); await signup.call("grant", { userId: T, providerHash: hash(800), ...win() });
    const s = await signup.call("stats", { start: win().start });
    const granted = (await h.one<{ n: number }>("select count(*)::int n from gift_rewards where kind='signup' and not ops_test_user(owner_user_id)")).n;
    expect(s).toMatchObject({ ok: true, on: true, granted, grantedToday: granted, used: 1 });
    expect(Number(s.signups)).toBe((await h.one<{ n: number }>("select count(*)::int n from account_contacts c join account_profiles p using(user_id) where c.completed_at>=$1 and p.created_at>=$1 and not ops_test_user(c.user_id)", [win().start])).n);
  });
});

describe("퍼널 익명 집계", () => {
  it("단계 목록만 받고, 유입 값은 소문자·숫자·_·-만(아니면 '-'), 같은 칸은 +1. 사용자 id·IP·쿠키 칸이 없다", async () => {
    expect(await funnel.call("hit", { step: "free_view", source: "meta", campaign: "free_book_1111" })).toEqual({ ok: true });
    expect(await funnel.call("hit", { step: "free_view", source: "META", campaign: "free_book_1111" })).toEqual({ ok: true });
    expect(await funnel.call("hit", { step: "free_view", source: "x<script>", campaign: "" })).toEqual({ ok: true });
    expect(await funnel.call("hit", { step: "drop_table", source: "meta" })).toMatchObject({ ok: false, code: "STEP" });
    const rows = await h.all<{ step: string; source: string; campaign: string; n: number }>("select step,source,campaign,n from funnel_daily order by source");
    expect(rows).toEqual([{ step: "free_view", source: "-", campaign: "-", n: 1 }, { step: "free_view", source: "meta", campaign: "free_book_1111", n: 2 }]);
    const cols = await h.all<{ column_name: string }>("select column_name from information_schema.columns where table_schema='public' and table_name='funnel_daily' order by ordinal_position");
    expect(cols.map(c => c.column_name)).toEqual(["day", "step", "source", "campaign", "n"]);
  });
  it("report: 최근 7일 행 + 서버 기록(시험 계정 제외)", async () => {
    const r = await funnel.call("report", { days: 7 });
    expect(r).toMatchObject({ ok: true });
    expect((r.rows as unknown[]).length).toBeGreaterThan(0);
    expect(r.server).toMatchObject({ grantsToday: expect.any(Number), signupsToday: expect.any(Number), ordersToday: 0, paidToday: 0 });
  });
});

describe("매출 봇 /event: 시험 계정 이용권을 뺀다", () => {
  it("1+1 이용권 중 시험 계정 것은 집계에서 빠진다", async () => {
    const before = await h.notify.call("event_stats", {});
    await h.exec("alter table gift_rewards drop constraint gift_rewards_source_kind_check");
    await h.exec("insert into gift_rewards(owner_user_id,kind,expires_at) values($1,'event',now()+interval '10 days'),($2,'event',now()+interval '10 days')", [u(800), u(711)]);
    const after = await h.notify.call("event_stats", {});
    expect(Number(after.issued) - Number(before.issued)).toBe(1);
  });
});

describe("F 후속 「시험 계정 표」(ops_test_accounts, migration 20261111100000)", () => {
  it("표에 넣으면 ops_test_user가 참(설정값 목록과 별개) → /campaign·/funnel 서버 기록·/event에서 빠지고, 빼면 바로 돌아온다", async () => {
    const id = u(900); await joined(id);
    expect(await signup.call("grant", { userId: id, providerHash: hash(900), ...win() })).toMatchObject({ ok: true, issued: true });
    const stats = async () => signup.call("stats", { start: iso(Date.now() - 3_600_000) });
    const server = async () => (await funnel.call("report", { days: 7 })).server as Record<string, number>;
    const before = await stats(), beforeServer = await server();
    expect((await h.one<{ r: boolean }>("select ops_test_user($1) r", [id])).r).toBe(false);
    await h.exec("insert into public.ops_test_accounts(user_id,note) values($1,'덕짱님 시험')", [id]);
    expect((await h.one<{ r: boolean }>("select ops_test_user($1) r", [id])).r).toBe(true);
    const after = await stats(), afterServer = await server();
    expect(Number(before.granted) - Number(after.granted)).toBe(1); expect(Number(before.signups) - Number(after.signups)).toBe(1);
    expect(beforeServer.signups - afterServer.signups).toBe(1); expect(beforeServer.grants - afterServer.grants).toBe(1);
    // 설정값(크론이 env로 덮어쓰는 목록)을 바꿔도 표의 계정은 그대로 시험 계정이다.
    const saved = (await h.one<{ v: { ids: string[] } | null }>("select value v from ops_settings where key='test_accounts'")).v ?? { ids: [] };
    await h.rpc("ops_notify_put_setting", "test_accounts", { ids: [] });
    expect((await h.one<{ r: boolean }>("select ops_test_user($1) r", [id])).r).toBe(true);
    await h.rpc("ops_notify_put_setting", "test_accounts", saved);
    await h.exec("delete from public.ops_test_accounts where user_id=$1", [id]);
    expect((await h.one<{ r: boolean }>("select ops_test_user($1) r", [id])).r).toBe(false);
    expect(Number((await stats()).granted)).toBe(Number(before.granted));
  });
  it("서버(service_role)는 읽기만, 화면 역할(anon·authenticated)은 읽지도 못한다. 없는 계정 id는 넣을 수 없다(auth.users 참조)", async () => {
    const grants = await h.all<{ grantee: string; privilege_type: string }>("select grantee,privilege_type from information_schema.role_table_grants where table_schema='public' and table_name='ops_test_accounts' and grantee in ('anon','authenticated','service_role') order by 1,2");
    expect(grants).toEqual([{ grantee: "service_role", privilege_type: "SELECT" }]);
    await expect(h.exec("insert into public.ops_test_accounts(user_id) values($1)", [u(901)])).rejects.toThrow(/foreign key|violates/);
    expect((await h.one<{ rls: boolean }>("select relrowsecurity rls from pg_class where oid='public.ops_test_accounts'::regclass")).rls).toBe(true);
  });
  it("배포 확인값(funnel_daily source 'deploycheck')은 이 migration이 지운다 — 다른 행은 그대로", async () => {
    await funnel.call("hit", { step: "free_view", source: "deploycheck", campaign: "f_deploy_check" });
    await funnel.call("hit", { step: "free_view", source: "meta", campaign: "free_book_1111" });
    const sql = (await import("node:fs")).readFileSync("supabase/migrations/20261111100000_v5_test_account_table.sql", "utf8");
    const cleanup = sql.slice(sql.lastIndexOf("do $$ begin"), sql.lastIndexOf("commit;"));
    await h.exec(cleanup);
    expect((await h.one<{ n: number }>("select count(*)::int n from funnel_daily where source='deploycheck'")).n).toBe(0);
    expect((await h.one<{ n: number }>("select count(*)::int n from funnel_daily where source='meta' and campaign='free_book_1111'")).n).toBeGreaterThan(0);
  });
});
