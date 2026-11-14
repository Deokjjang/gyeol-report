// F 처리 봇·매출 봇: 가입 급증 경보(20건/60분·1시간 1번)·[지급 멈춤]·[다시 켜기]·다른 사용자 무시·멈춤 중 미지급, /campaign, /funnel, API 잔액 경보. PGlite + 모의 텔레그램(외부 호출 0).
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
vi.mock("@/lib/ops/admin/actions", () => ({ runAdminActionAs: async () => ({ status: 200, body: { ok: true } }), defaultAdminDeps: () => ({}) }));
import { handleUpdate, type BotDeps } from "@/lib/ops/notify/bots";
import { BOT_COMMANDS, flushNotifications, runNotifyCycle, SIGNUP_SURGE_THRESHOLD } from "@/lib/ops/notify/flush";
import { apiCreditText, campaignText, funnelText, signupSurgeText } from "@/lib/ops/notify/render";
import { grantSignupTicket } from "@/lib/ops/gift/service";
import { liveTestAccountIds, resetLiveTestAccounts, SISTER_TEST_USER_ID, TEST_TABLE_TTL_MS } from "@/lib/ops/notify/deps";
import { fakeTelegram, opsNotifySql } from "../../helpers/opsNotify";
import { TICKET_A as A } from "../../helpers/ticketPublicationSql";

let h: Awaited<ReturnType<typeof opsNotifySql>>, tg: ReturnType<typeof fakeTelegram>, deps: BotDeps, upd = 1;
const OWNER = "777000111";
const START = new Date(Date.now() - 3_600_000).toISOString();
const env = { GIFT_EVENT_ENABLED: "1", SIGNUP_CAMPAIGN_START: START, GIFT_EVENT_END: new Date(Date.now() + 86_400_000).toISOString(), REPORT_ADMIN_SECRET: "test-secret" };
const cb = (data: string, from = OWNER, messageId = 1) => ({ update_id: upd++, callback_query: { id: `cq-${upd}`, from: { id: Number(from) }, data, message: { message_id: messageId, chat: { id: Number(from) } } } });
const msg = (text: string, from = OWNER) => ({ update_id: upd++, message: { message_id: 60_000 + upd, from: { id: Number(from) }, chat: { id: Number(from), type: "private" }, text } });
const u = (n: number) => `00000000-0000-4000-8000-${String(n).padStart(12, "0")}`;
async function joined(id: string) {
  await h.exec("insert into auth.users(id) values($1) on conflict do nothing", [id]);
  await h.exec("insert into account_profiles(user_id,display_name,provider) values($1,'회원','kakao') on conflict do nothing", [id]);
  await h.exec("insert into account_contacts(user_id,full_name,email,email_source) values($1,'회원',$2,'typed') on conflict do nothing", [id, `${id.slice(-4)}@example.com`]);
}
const lastSent = (bot: "ops" | "sales") => tg.sent(bot).at(-1)!;
const signupOn = async () => (await h.one<{ is_on: boolean }>("select (value->>'on')::boolean is_on from ops_settings where key='signup_grant'")).is_on;

beforeAll(async () => {
  h = await opsNotifySql({ freeBook: true });
  tg = fakeTelegram(OWNER);
  deps = { notify: h.notify, signup: h.rpcOf("ops_signup"), funnel: h.rpcOf("ops_funnel"), tg, now: () => Date.now(), paymentMethod: async () => null, setting: async () => null, putSetting: async () => true,
    admin: {} as BotDeps["admin"], adminId: A, audit: e => h.audit(e), db: h.auditDb, env };
}, 240_000);
afterAll(async () => { await h?.db.close(); });

describe("가입 급증 경보(처리 봇)", () => {
  it(`기준 ${SIGNUP_SURGE_THRESHOLD}건/60분 미만이면 경보 없음, 이상이면 「🚨 가입 급증 N건 (최근 1시간) · 오늘 지급 N장」 [지급 멈춤] 1번, 1시간 안에는 다시 없음`, async () => {
    for (let i = 0; i < SIGNUP_SURGE_THRESHOLD - 1; i++) await joined(u(1000 + i));
    expect((await runNotifyCycle(deps)).signupSurge).toBe(false);
    await joined(u(1100));
    await grantSignupTicket(deps.signup!, { id: u(1100), provider: "kakao", providerUserId: "1100" }, env);
    expect((await runNotifyCycle(deps)).signupSurge).toBe(true);
    const sent = tg.sent("ops").filter(m => m.text.includes("가입 급증"));
    expect(sent).toHaveLength(1);
    expect(sent[0].text).toBe("🚨 <b>가입 급증 20건</b> (최근 1시간) · 오늘 지급 1장");
    expect(sent[0].markup).toEqual({ inline_keyboard: [[{ text: "지급 멈춤", callback_data: "sg:pause" }]] });
    await joined(u(1101));
    expect((await runNotifyCycle(deps)).signupSurge).toBe(false);
    expect(tg.sent("ops").filter(m => m.text.includes("가입 급증"))).toHaveLength(1);
  });
  it("다른 사용자가 [지급 멈춤]을 누르면 무시(답 없음·상태 그대로)", async () => {
    const before = tg.calls.length;
    expect(await handleUpdate("ops", cb("sg:pause", "123456"), deps)).toBe("ignored");
    expect(tg.calls.length).toBe(before);
    expect(await signupOn()).toBe(true);
  });
  it("덕짱님이 [지급 멈춤] → 「⏸ 가입 이용권 지급 멈춤 · 시각」 [다시 켜기]로 바뀌고 비밀번호는 묻지 않는다. 멈춤 중 신규 가입은 미지급·팝업 없음", async () => {
    const msgId = tg.sent("ops").find(m => m.text.includes("가입 급증"))!.id;
    expect(await handleUpdate("ops", cb("sg:pause", OWNER, msgId), deps)).toBe("signup_paused");
    expect(await signupOn()).toBe(false);
    const edit = [...tg.calls].reverse().find(c => c.method === "editMessageText" && c.body.message_id === msgId)!.body;
    expect(String(edit.text)).toMatch(/^⏸ <b>가입 이용권 지급 멈춤<\/b> · \d{2}\/\d{2} \d{2}:\d{2}$/);
    expect(edit.reply_markup).toEqual({ inline_keyboard: [[{ text: "다시 켜기", callback_data: "sg:resume" }]] });
    expect(tg.calls.some(c => c.method === "sendMessage" && /비밀번호/.test(String(c.body.text)))).toBe(false);
    const NEW = u(1200); await joined(NEW);
    expect(await grantSignupTicket(deps.signup!, { id: NEW, provider: "google", providerUserId: "g-1200" }, env)).toMatchObject({ issued: false, code: "PAUSED" });
    expect(await deps.signup!.call("state", { userId: NEW })).toMatchObject({ on: false, mine: null });
    // 감사 기록(누가·언제, 텔레그램).
    expect((await h.one<{ n: number }>("select count(*)::int n from ops_audit_log where action='signup_grant_paused'")).n).toBe(1);
  });
  it("[다시 켜기] → 다시 지급, 메시지는 「▶️ … 다시 켬」 [지급 멈춤]", async () => {
    const msgId = tg.sent("ops").find(m => m.text.includes("가입 급증"))!.id;
    expect(await handleUpdate("ops", cb("sg:resume", OWNER, msgId), deps)).toBe("signup_resumed");
    expect(await signupOn()).toBe(true);
    const edit = [...tg.calls].reverse().find(c => c.method === "editMessageText" && c.body.message_id === msgId)!.body;
    expect(String(edit.text)).toMatch(/^▶️ <b>가입 이용권 지급 다시 켬<\/b>/);
    expect(edit.reply_markup).toEqual({ inline_keyboard: [[{ text: "지급 멈춤", callback_data: "sg:pause" }]] });
    expect(await grantSignupTicket(deps.signup!, { id: u(1200), provider: "google", providerUserId: "g-1200" }, env)).toMatchObject({ issued: true });
  });
});

describe("/campaign · /funnel · API 잔액 경보", () => {
  it("/campaign: 지급 상태·오늘·누적 가입·지급·사용·무료로 만든 책·추정 생성비 + 버튼", async () => {
    await joined(u(1300));
    const a = await h.pay("fb-cost-a", u(1300)), b = await h.pay("fb-cost-b", u(1300));
    await h.exec("insert into book_generation_runs(report_id,lane,provider,model,edition,outcome,reason,cost_usd) values($1,'queue','anthropic','m','official','published','ok',0.2),($2,'queue','anthropic','m','official','published','ok',0.1),($2,'queue','anthropic','m','official','published','ok',0.2)", [a.report_id, b.report_id]);
    expect(await handleUpdate("ops", msg("/campaign"), deps)).toBe("campaign");
    const m = lastSent("ops");
    expect(m.text).toMatch(/^🎟 <b>가입 이용권<\/b> · 지급 켜짐 · /);
    expect(m.text).toContain("오늘 신규 가입");
    expect(m.text).toMatch(/누적 신규 가입 \d+ · 지급 2 · 사용 0 · 남음 2 · 만료 0/);
    expect(m.text).toContain("무료로 만든 책 0권(발행 0)");
    expect(m.text).toContain("권당 실측 평균 $0.25");
    expect(m.markup).toEqual({ inline_keyboard: [[{ text: "지급 멈춤", callback_data: "sg:pause" }]] });
    expect(BOT_COMMANDS.ops.map(c => c.command)).toEqual(["pending", "campaign", "sales"]); // W3 P0: /sales(4종 판매 멈춤·다시 열기)
  });
  it("/funnel: 오늘·7일 단계별 숫자와 전환율, 유입별 「랜딩 → 가입 → 무료 책 → 결제」 한 줄(메타·X), 서버 기록(명령 응답 — 알림 아님)", async () => {
    for (const [step, source, n] of [["land", "meta", 10], ["free_view", "meta", 10], ["login_new", "meta", 4], ["signup_grant", "meta", 4], ["free_book", "meta", 2], ["paid", "meta", 1],
      ["land", "x", 5], ["free_view", "x", 5], ["login_new", "x", 1], ["land", "direct", 3], ["home_view", "direct", 3]] as const)
      for (let i = 0; i < n; i++) await h.rpc("ops_funnel", "hit", { step, source, campaign: "free_book_1111", content: "card_a" });
    expect(await handleUpdate("sales", msg("/funnel"), deps)).toBe("funnel");
    const t = lastSent("sales").text;
    expect(t).toContain("/free 조회 15");
    expect(t).toContain("신규 가입 5 (33%)");
    expect(t).toContain("메타 · 랜딩 10 → 가입 4 (40%) → 무료 책 2 (50%) → 결제 1 (50%)");
    expect(t).toContain("X · 랜딩 5 → 가입 1 (20%) → 무료 책 0 (0%) → 결제 0");
    expect(t).toContain("직접 · 랜딩 3 → 가입 0 (0%) → 무료 책 0 → 결제 0");
    expect(t.indexOf("메타 · 랜딩")).toBeLessThan(t.indexOf("X · 랜딩"));
    expect(t).toMatch(/7일 신규 가입 \d+ · 가입 이용권 \d+ · 무료 책 \d+ · 주문/);
    expect(t).toMatch(/서버 기록\(시험 계정 제외\)/);
    expect(BOT_COMMANDS.sales.map(c => c.command)).toContain("funnel");
  });
  it("API 잔액 경보: 「🚨 생성 실패: API 잔액 확인 필요」 1시간 1번(버튼 없음)", async () => {
    await deps.signup!.call("credit_alert", { code: "anthropic_credit" });
    await deps.signup!.call("credit_alert", { code: "anthropic_credit" });
    await flushNotifications(deps);
    const sent = tg.sent("ops").filter(m => m.text.includes("API 잔액 확인 필요"));
    expect(sent).toHaveLength(1);
    expect(sent[0].text.split("\n")[0]).toBe("🚨 <b>생성 실패: API 잔액 확인 필요</b>");
    expect(sent[0].markup).toBeUndefined();
  });
  it("문구 함수", () => {
    expect(signupSurgeText({ count: 23, grantedToday: 17 })).toBe("🚨 <b>가입 급증 23건</b> (최근 1시간) · 오늘 지급 17장");
    expect(apiCreditText({ code: "openai_quota" })).toContain("OpenAI");
    expect(campaignText({ on: false, at: "2026-11-11T05:00:00Z", signupsToday: 1, signups: 2, grantedToday: 1, granted: 2, used: 1, available: 1, expired: 0, booksStarted: 1, booksPublished: 1, avgCostUsd: null, costSample: 0 }, "11/11~11/30"))
      .toMatch(/^🎟 <b>가입 이용권<\/b> · ⏸ 지급 멈춤\(11\/11 14:00\)/);
    expect(funnelText({ today: "2026-11-11", from: "2026-11-05", rows: [], server: {} })).toContain("아직 기록이 없어요");
  });
});

describe("F 후속: 서버의 시험 계정 목록 = env(관리자·누나 계정) + DB 「시험 계정 표」(60초 캐시)", () => {
  it("표의 계정을 더하고, 60초 안에는 다시 읽지 않으며, 읽기 실패면 직전 값을 쓴다(처음이면 env 목록만)", async () => {
    resetLiveTestAccounts();
    const ADMIN = "00000000-0000-4000-8000-00000000a0a0", T1 = "00000000-0000-4000-8000-000000000071", T2 = "00000000-0000-4000-8000-000000000072";
    const e = { ADMIN_USER_IDS: ADMIN };
    let reads = 0; const read = (ids: string[] | null) => async () => { reads++; return ids; };
    const first = await liveTestAccountIds(e, 1_000, read([T1.toUpperCase()]));
    expect([...first].sort()).toEqual([ADMIN, SISTER_TEST_USER_ID, T1].sort());
    expect([...await liveTestAccountIds(e, 1_000 + TEST_TABLE_TTL_MS - 1, read([T2]))]).not.toContain(T2);
    expect(reads).toBe(1);
    const fresh = await liveTestAccountIds(e, 1_000 + TEST_TABLE_TTL_MS, read([T2]));
    expect(fresh.has(T2)).toBe(true); expect(fresh.has(T1)).toBe(false);
    expect((await liveTestAccountIds(e, 1_000 + 2 * TEST_TABLE_TTL_MS, read(null))).has(T2)).toBe(true);
    resetLiveTestAccounts();
    expect([...await liveTestAccountIds(e, 5_000, read(null))].sort()).toEqual([ADMIN, SISTER_TEST_USER_ID].sort());
    resetLiveTestAccounts();
  });
});
