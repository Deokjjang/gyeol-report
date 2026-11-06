// 운영 Q 5·6부: 매출 봇·처리 봇(PGlite + 모의 텔레그램·토스). ★ 규칙 · 비밀번호 성공·실패·잠금·만료 · 중복 클릭·중복 update · 다른 사용자 무시
// · 관리자 화면 처리·자동 완성·다시 실패 정리 · 매출 알림 문구 · 웹훅 비밀값. 실제 텔레그램·토스·작가 호출 0.
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
const admin = vi.hoisted(() => ({ calls: [] as { action: string; body: Record<string, unknown> }[], impl: null as null | ((action: string, body: Record<string, unknown>) => Promise<{ status: number; body: Record<string, unknown> }>) }));
vi.mock("@/lib/ops/admin/actions", () => ({
  runAdminActionAs: async (action: string, body: Record<string, unknown>) => { admin.calls.push({ action, body }); return admin.impl ? admin.impl(action, body) : { status: 200, body: { ok: true } }; },
  defaultAdminDeps: () => ({}),
}));
vi.mock("@/lib/ops/admin/rpc", () => ({ grantTickets: async () => ({ ok: true, grantId: "g-1" }) }));
import { processRefunds } from "@/lib/ops/orders/refund";
import { handleUpdate, botPinLockedUntil, BOT_PIN_LOCK_MS, type BotDeps } from "@/lib/ops/notify/bots";
import { ensureWebhooks, flushNotifications, kstMonth, reconcileOpen, runNotifyCycle } from "@/lib/ops/notify/flush";
import { duplicateToRefund, methodLabel, opsButtons, salesPaymentText, sourceWord, uaSummary, type ItemFacts, type OrderFacts } from "@/lib/ops/notify/render";
import { webhookSecret, webhookSecretMatches, telegramConfig } from "@/lib/ops/notify/telegram";
import { fakeTelegram, inputOf, opsNotifySql, refundProvider } from "../../helpers/opsNotify";
import { TICKET_A as A } from "../../helpers/ticketPublicationSql";

type H = Awaited<ReturnType<typeof opsNotifySql>>;
let h: H, tg: ReturnType<typeof fakeTelegram>, deps: BotDeps, upd = 1;
const OWNER = "777000111", PIN = "4321";
const env = { ADMIN_ACTION_PIN: PIN, GIFT_EVENT_ENABLED: "1" };
const cb = (data: string, from = OWNER) => ({ update_id: upd++, callback_query: { id: `cq-${upd}`, from: { id: Number(from) }, data, message: { message_id: 1, chat: { id: Number(from) } } } });
const msg = (text: string, extra: Record<string, unknown> = {}, from = OWNER) => ({ update_id: upd++, message: { message_id: 50_000 + upd, from: { id: Number(from) }, chat: { id: Number(from), type: "private" }, text, ...extra } });
const item = (key: string) => h.one<{ id: number; message_id: number; closed_line: string | null; state: Record<string, unknown> }>("select id,message_id,closed_line,state from ops_notifications where dedupe_key=$1", [key]);
const lastEdit = (messageId: number) => [...tg.calls].reverse().find(c => c.method === "editMessageText" && c.body.message_id === messageId)?.body;

beforeAll(async () => {
  h = await opsNotifySql();
  tg = fakeTelegram(OWNER);
  deps = { notify: h.notify, tg, now: () => Date.now(), paymentMethod: async () => "카카오페이", setting: async () => null, putSetting: async () => true,
    admin: {} as BotDeps["admin"], adminId: A, audit: e => h.audit(e), db: h.auditDb, env };
  // 관리자 환불(대역): 기존 관리자 환불과 같은 SQL 경로(refund_request → 토스 취소 대역 → refund_finish)를 그대로 탄다.
  admin.impl = async (action, body) => {
    if (action !== "refund") return { status: 200, body: { ok: true } };
    const po = await h.one<{ payment_order_id: string }>("select payment_order_id from order_records where order_code=$1", [body.orderCode]);
    const day = { dayStart: new Date(Date.now() - 86_400_000).toISOString(), dayEnd: new Date(Date.now() + 86_400_000).toISOString() };
    const r = await h.order.call("refund_request", { paymentOrderId: po.payment_order_id, source: "admin", reason: String(body.reason), actorUserId: A, capCount: 9, capAmount: 99_999, ...day });
    if (r.ok !== true) return { status: 409, body: { ok: false, code: r.code, message: "환불 요청을 저장하지 못했어요." } };
    await processRefunds({ order: h.order, audit: e => h.audit(e) }, refundProvider, { paymentOrderId: po.payment_order_id });
    return { status: 200, body: { ok: true, state: "done" } };
  };
}, 120_000);
afterAll(async () => { await h?.db.close(); });
beforeEach(() => { admin.calls.length = 0; });

describe("★ 추천 규칙(순수 함수)", () => {
  const base = (o: Partial<OrderFacts> = {}, extra: Partial<ItemFacts> = {}): ItemFacts => ({
    item: { id: 9, kind: "request", bot: "ops", payload: {}, state: {}, messageId: 1, createdAt: "", sentAt: "", closedAt: null, closedLine: null, attempts: 0, lastError: null },
    request: { id: "r", reason: "not_open", status: "open", resolution: null, resolvedBy: null, resolvedAt: null, createdAt: "", device: null, paymentOrderId: "p", reportId: null },
    order: { paymentOrderId: "p", orderCode: "GR-F5C7", productType: "saju_mbti_full", amount: 3900, status: "paid", createdAt: "", paidAt: "2026-11-06T05:05:00Z", refundedAt: null, reportId: "report_x",
      paymentKey: null, providerOrderId: null, hasAccount: true, firstPaid: true, accountPaid: 1, accountRefunded: 0, source: {}, book: { status: "COMPLETED", publishedAt: "2026-11-06T05:10:00Z" },
      job: null, gen: null, views: 0, gift: { status: "available", kind: "event" }, refund: null, ...o },
    ticket: null, duplicates: [], regenFailedBefore: false, failed: null, ...extra,
  });
  const star = (f: ItemFacts) => opsButtons(f).filter(b => b.star).map(b => b.label);
  it("안 열림 + 책 완성 + 열람 0회 → ★환불, 열람 1회 이상 → ★안내", () => {
    expect(star(base())).toEqual(["환불"]);
    expect(opsButtons(base()).map(b => b.label)).toEqual(["환불", "다시 만들기", "안내"]);
    expect(star(base({ views: 2 }))).toEqual(["안내"]);
  });
  it("안 나옴(미완성) → ★다시 만들기, 덕짱님이 누른 다시 만들기가 이미 실패했으면 ★환불", () => {
    expect(star(base({ book: { status: "RETRYING", publishedAt: null } }))).toEqual(["다시 만들기"]);
    expect(star(base({ book: { status: "RETRYING", publishedAt: null } }, { regenFailedBefore: true }))).toEqual(["환불"]);
    expect(opsButtons({ ...base(), item: { ...base().item, state: { regenFailed: true } } }).map(b => `${b.star ? "★" : ""}${b.label}`)).toEqual(["★환불"]);
  });
  it("미발행(30분) → ★다시 만들기 · 환불", () => {
    const f = { ...base({ book: null }), item: { ...base().item, kind: "unpublished" }, request: null };
    expect(opsButtons(f).map(b => `${b.star ? "★" : ""}${b.label}`)).toEqual(["★다시 만들기", "환불"]);
  });
  it("두 번 결제 → 열람이 적은 쪽, 같으면 나중 결제 ★환불", () => {
    const d = (code: string, at: string, views: number) => ({ paymentOrderId: code, orderCode: code, amount: 3900, paidAt: at, reportId: null, views });
    expect(duplicateToRefund([d("GR-AAAA", "2026-11-06T05:05:00Z", 2), d("GR-BBBB", "2026-11-06T05:06:00Z", 0)])?.orderCode).toBe("GR-BBBB");
    expect(duplicateToRefund([d("GR-AAAA", "2026-11-06T05:05:00Z", 0), d("GR-BBBB", "2026-11-06T05:06:00Z", 0)])?.orderCode).toBe("GR-BBBB");
    expect(duplicateToRefund([d("GR-AAAA", "2026-11-06T05:05:00Z", 0), d("GR-BBBB", "2026-11-06T05:06:00Z", 3)])?.orderCode).toBe("GR-AAAA");
    const f = base({}, { request: { ...base().request!, reason: "double_paid" }, duplicates: [d("GR-AAAA", "2026-11-06T05:05:00Z", 2), d("GR-BBBB", "2026-11-06T05:06:00Z", 0)] });
    expect(opsButtons(f)[0]).toMatchObject({ label: "GR-BBBB 환불", star: true, target: "GR-BBBB" });
  });
  it("이용권으로 만든 책 → [환불] 대신 [이용권 돌려주기]", () => {
    const f = { ...base(), order: null, ticket: { reportId: "report_t", productType: "saju_mbti_full", createdAt: "", state: "DONE", userId: A, book: { status: "COMPLETED", publishedAt: "x" }, gen: null, views: 0, accountPaid: 0, accountRefunded: 0 } };
    expect(opsButtons(f).map(b => `${b.star ? "★" : ""}${b.label}`)).toEqual(["★이용권 돌려주기", "다시 만들기", "안내"]);
  });
});

describe("문구 도우미", () => {
  it("결제수단·출처·기기 요약", () => {
    expect(methodLabel({ method: "간편결제", easyPay: { provider: "카카오페이" } })).toBe("카카오페이");
    expect(methodLabel({ method: "카드" })).toBe("카드");
    expect(sourceWord({ utm_source: "instagram", utm_medium: "paid_social" })).toBe("인스타 광고");
    expect(sourceWord({ utm_source: "instagram" })).toBe("인스타");
    expect(sourceWord({})).toBeNull();
    expect(uaSummary("Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1")).toBe("아이폰 사파리");
    expect(uaSummary("Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Mobile Safari/537.36 KAKAOTALK 10.8.5")).toBe("안드로이드 카카오톡");
    expect(uaSummary("")).toBeNull();
  });
  it("매출 결제 문구: 금액 쉼표·KST·신규/재구매·오늘 합계, HTML escape", () => {
    const o = { amount: 3900, productType: "saju_mbti_full", paidAt: "2026-11-06T05:05:00Z", firstPaid: true, source: { utm_source: "instagram", utm_medium: "cpc" } } as unknown as OrderFacts;
    expect(salesPaymentText(o, "카카오<페이>", { payCount: 5, paySum: 19500, refundCount: 0, refundSum: 0, newCount: 4, repeatCount: 1, byProduct: [] }))
      .toBe("💳 <b>3,900원</b> · 나라는 사람\n카카오&lt;페이&gt; · 신규 · 14:05 · 인스타 광고\n오늘 5건 · 19,500원");
  });
  it("지난달 같은 날짜까지 구간(31일 → 지난달 말일까지)", () => {
    const m = kstMonth(Date.parse("2026-12-31T12:00:00+09:00"));
    expect([m.start, m.prevStart, m.prevEnd, m.days]).toEqual(["2026-11-30T15:00:00.000Z", "2026-10-31T15:00:00.000Z", "2026-11-30T15:00:00.000Z", 31]);
  });
});

describe("매출 봇: 결제·환불 알림", () => {
  it("결제 1건 → 💳 금액·상품·결제수단·신규·시각·오늘 합계(버튼 없음, 정리 완료로 남는다)", async () => {
    await h.pay("po-b-1", A);
    const r = await flushNotifications(deps);
    expect(r.failed).toBe(0);
    const t = tg.sent("sales").at(-1)!.text;
    expect(t).toMatch(/^💳 <b>3,900원<\/b> · 나라는 사람\n카카오페이 · 신규 · \d{2}:\d{2}\n오늘 1건 · 3,900원$/);
    expect((await item("pay:po-b-1")).closed_line).toBeNull();
  });
  it("텔레그램이 실패하면 재전송 대기(시도 1·마지막 오류), 결제 상태는 그대로", async () => {
    await h.pay("po-b-2", A);
    tg.fail = true;
    const r = await flushNotifications(deps);
    tg.fail = false;
    expect(r.failed).toBeGreaterThan(0);
    expect(await h.one("select attempts,last_error,sent_at from ops_notifications where dedupe_key='pay:po-b-2'")).toEqual({ attempts: 1, last_error: "TG_502", sent_at: null });
    expect((await h.one<{ status: string }>("select status from payment_orders where payment_order_id='po-b-2'")).status).toBe("paid");
    await h.exec("update ops_notifications set next_attempt_at=now() where dedupe_key='pay:po-b-2'");
    await flushNotifications(deps);
    expect(tg.sent("sales").at(-1)!.text).toContain("재구매");
  });
  it("공유 실패 경보 → 처리 봇 「🚨 공유 실패 N건」(상태 코드·책 버전, 버튼 없음, 보내면 바로 닫힘)", async () => {
    await h.exec("insert into ops_notifications(kind,bot,dedupe_key,payload) values('share_failed','ops','sharefail:test',$1::jsonb)",
      [JSON.stringify({ count: 3, windowMinutes: 10, keys: ["404:v5", "503:unknown"], causes: [{ status: 404, version: "v5", count: 2 }, { status: 503, version: "unknown", count: 1 }] })]);
    expect((await flushNotifications(deps)).failed).toBe(0);
    const sent = tg.calls.filter(c => c.method === "sendMessage" && String(c.body.text).includes("공유 실패")).at(-1)!;
    expect(sent.body.text).toBe("🚨 <b>공유 실패 3건</b> · 최근 10분\n404 · v5 · 2건\n503 · 버전 모름 · 1건");
    expect(sent.body.reply_markup).toBeUndefined();
    expect(await h.one("select sent_at is not null s, closed_at is not null c from ops_notifications where dedupe_key='sharefail:test'")).toEqual({ s: true, c: true });
  });
  it("토큰·덕짱님 id가 없으면 보내지 않고 대기표에 남긴다", async () => {
    const r = await flushNotifications({ ...deps, tg: { ...tg, ownerId: null, configured: () => false } });
    expect(r.skipped).toBe("TELEGRAM_UNSET");
  });
});

describe("처리 봇: 문의 → ★환불 → 비밀번호 → 환불 완료 → 매출 봇 환불 알림", () => {
  let code = "", id = 0, messageId = 0;
  it("문의 접수 메시지(4줄 + ★버튼)", async () => {
    const p = await h.pay("po-b-3", A);
    code = p.order_code;
    await h.publish(p.report_id);
    await h.exec("update payment_orders set paid_at=now()-interval '2 hours' where payment_order_id='po-b-3'");
    const s = await h.notify.call("submit", { userId: A, paymentOrderId: "po-b-3", reason: "not_open", device: "아이폰 사파리" });
    expect(s.ok).toBe(true);
    await flushNotifications(deps);
    const it0 = await item(`req:${s.id}`);
    id = it0.id; messageId = it0.message_id;
    const sent = tg.sent("ops").at(-1)!;
    expect(sent.text.split("\n")).toEqual([`📮 <b>책이 안 열려요</b> · ${code}`, expect.stringMatching(/^나라는 사람 · 3,900원 · 카카오페이 · \d{2}\/\d{2} \d{2}:\d{2}$/),
      "책 완성 · 열람 0회 · 아이폰 사파리", "이 계정 결제 3 · 환불 0 · 이 결제 증정 이용권 없음"]);
    expect(sent.markup).toEqual({ inline_keyboard: [[{ text: "★환불", callback_data: `q:${id}:rf` }, { text: "다시 만들기", callback_data: `q:${id}:rg` }, { text: "안내", callback_data: `q:${id}:gd` }]] });
  });
  it("다른 사람이 누르면 응답 없이 기록만", async () => {
    const before = tg.calls.length;
    expect(await handleUpdate("ops", cb(`q:${id}:rf`, "123456"), deps)).toBe("ignored");
    expect(tg.calls.length).toBe(before);
    expect((await h.one<{ n: number }>("select count(*)::int n from ops_audit_log where action='bot_ignored'")).n).toBe(1);
    expect(await handleUpdate("ops", msg("/today", {}, "123456"), deps)).toBe("ignored");
  });
  it("[환불] → 같은 메시지가 「… 환불 · 비밀번호를 보내 주세요 (2분)」 + [취소], 답장 칸(ForceReply)", async () => {
    expect(await handleUpdate("ops", cb(`q:${id}:rf`), deps)).toBe("pin_asked");
    expect(lastEdit(messageId)).toMatchObject({ text: `${code} 3,900원 환불 · 비밀번호를 보내 주세요 (2분)`, reply_markup: { inline_keyboard: [[{ text: "취소", callback_data: `q:${id}:cx` }]] } });
    const prompt = tg.calls.at(-2)!;
    expect(prompt.body.reply_markup).toMatchObject({ force_reply: true });
    expect((await item(`req:${(await h.one<{ id: string }>("select id from order_requests where payment_order_id='po-b-3'")).id}`)).state).toMatchObject({ pin: { act: "rf" } });
  });
  it("틀린 비밀번호: 받자마자 지우고(대조보다 먼저) 남은 횟수 안내, 환불은 안 한다", async () => {
    const m = msg("0000");
    expect(await handleUpdate("ops", m, deps)).toBe("pin_wrong");
    const del = tg.calls.findIndex(c => c.method === "deleteMessage" && c.body.message_id === m.message.message_id);
    expect(del).toBeGreaterThan(-1);
    expect(tg.calls.slice(del + 1).some(c => c.method === "sendMessage" && String(c.body.text).includes("4번 더 틀리면 30분 동안 잠겨요"))).toBe(true);
    expect(admin.calls).toEqual([]);
  });
  it("맞는 비밀번호 → 기존 관리자 환불 1번 → 「✅ 환불 완료 3,900원 · GR · 시각」, 요청 처리 완료·방법 refund, 매출 봇 ↩️ 환불", async () => {
    const m = msg(PIN);
    expect(await handleUpdate("ops", m, deps)).toBe("refund_done");
    expect(tg.calls.some(c => c.method === "deleteMessage" && c.body.message_id === m.message.message_id)).toBe(true);
    expect(admin.calls).toEqual([{ action: "refund", body: expect.objectContaining({ orderCode: code, confirmCode: code, ackWarnings: true }) }]);
    const done = await h.one<{ closed_line: string }>("select closed_line from ops_notifications where id=$1", [id]);
    expect(done.closed_line).toMatch(new RegExp(`^✅ 환불 완료 3,900원 · ${code} · \\d{2}:\\d{2}$`));
    expect(lastEdit(messageId)).toMatchObject({ reply_markup: { inline_keyboard: [] } });
    expect(await h.one("select status,resolution from order_requests where payment_order_id='po-b-3'")).toEqual({ status: "done", resolution: "refund" });
    await flushNotifications(deps);
    expect(tg.sent("sales").at(-1)!.text).toMatch(new RegExp(`^↩️ 환불 <b>3,900원</b> · 나라는 사람 · ${code}\\n오늘 순매출 `));
  });
  it("같은 버튼을 다시 누르거나 텔레그램이 같은 update를 다시 보내도 한 번만", async () => {
    expect(await handleUpdate("ops", cb(`q:${id}:rf`), deps)).toBe("closed");
    const u = cb(`q:${id}:gd`);
    expect(await handleUpdate("ops", u, deps)).toBe("closed");
    expect(await handleUpdate("ops", u, deps)).toBe("duplicate");
    expect(admin.calls).toEqual([]);
  });
});

describe("처리 봇: 비밀번호 잠금·만료", () => {
  let id = 0;
  beforeAll(async () => {
    const p = await h.pay("po-b-4", A, inputOf("넷째"));
    await h.publish(p.report_id);
    await h.exec("update payment_orders set paid_at=now()-interval '2 hours' where payment_order_id='po-b-4'");
    const s = await h.notify.call("submit", { userId: A, paymentOrderId: "po-b-4", reason: "not_open" });
    await flushNotifications(deps);
    id = (await item(`req:${s.id}`)).id;
  });
  it("2분이 지나면 무효(다시 버튼을 눌러야 한다)", async () => {
    await handleUpdate("ops", cb(`q:${id}:rf`), deps);
    await h.exec("update ops_notifications set state=jsonb_set(state,'{pin,until}',to_jsonb((now()-interval '1 second')::text)) where id=$1", [id]);
    expect(await handleUpdate("ops", msg(PIN), deps)).toBe("pin_expired");
    expect(admin.calls).toEqual([]);
    // 원래 메시지로 돌아갈 때도 결제수단이 그대로(「확인 못 함」으로 바뀌지 않음).
    const back = tg.calls.filter(c => c.method === "editMessageText").at(-1)!;
    expect(String(back.body.text)).toContain("카카오페이");
    expect((await item(`req:${(await h.one<{ id: string }>("select id from order_requests where payment_order_id='po-b-4'")).id}`)).state.pin).toBeUndefined();
  });
  it("5번 틀리면 30분 잠금 — 맞는 비밀번호도 받지 않는다", async () => {
    // 감사 로그는 지울 수 없다(append-only) — 앞 시험의 실패 기록까지 30분 안 실패로 센다.
    const before = (await h.one<{ n: number }>("select count(*)::int n from ops_audit_log where action='bot_pin_failed' and created_at>now()-interval '30 minutes'")).n;
    await handleUpdate("ops", cb(`q:${id}:rf`), deps);
    const outs: string[] = [];
    for (let i = before; i < 5; i++) { if (i > before) await handleUpdate("ops", cb(`q:${id}:rf`), deps); outs.push(await handleUpdate("ops", msg(`99${i}`), deps)); }
    expect(outs).toEqual([...Array(4 - before).fill("pin_wrong"), "pin_locked_now"]);
    expect(await handleUpdate("ops", cb(`q:${id}:rf`), deps)).toBe("pin_locked");
    expect(admin.calls).toEqual([]);
    const t0 = Date.now();
    expect(botPinLockedUntil([t0, t0 + 1, t0 + 2, t0 + 3, t0 + 4], t0 + 10)).toBe(t0 + 4 + BOT_PIN_LOCK_MS);
    expect(botPinLockedUntil([t0, t0 + 1, t0 + 2, t0 + 3], t0 + 10)).toBeNull();
    expect(botPinLockedUntil([t0, t0 + 1, t0 + 2, t0 + 3, t0 + BOT_PIN_LOCK_MS + 5], t0 + BOT_PIN_LOCK_MS + 10)).toBeNull();
  });
  it("[다시 만들기]는 비밀번호 없이 기존 재생성 1번(두 번 눌러도 한 번) → 「⏳ 다시 만드는 중」", async () => {
    expect(await handleUpdate("ops", cb(`q:${id}:rg`), deps)).toBe("regen_started");
    expect(await handleUpdate("ops", cb(`q:${id}:rg`), deps)).toBe("busy");
    expect(admin.calls.map(c => c.action)).toEqual(["regenerate"]);
  });
  it("다시 만들기가 끝나면 「✅ 다시 만들었어요」, 실패하면 「⚠️ 다시 실패」 + [★환불]", async () => {
    // 정식본 교체가 누른 뒤에 끝남(official_at) → 다시 만들었어요
    await h.exec("insert into book_generation_state(report_id,origin,origin_ref,phase,official_at,updated_at) select report_id,'paid',payment_order_id,'official',now()+interval '1 second',now() from payment_orders where payment_order_id='po-b-4' on conflict (report_id) do update set official_at=excluded.official_at");
    const r = await reconcileOpen(deps);
    expect(r.regenerated).toBe(1);
    expect((await h.one<{ closed_line: string }>("select closed_line from ops_notifications where id=$1", [id])).closed_line).toMatch(/^✅ 다시 만들었어요 · GR-/);
  });
});

describe("처리 봇: 관리자 화면 처리·자동 완성도 똑같이 정리", () => {
  it("관리자 화면 「처리 완료」 → 「✅ 안내 보냄」, 고객 카드에는 안내", async () => {
    const p = await h.pay("po-b-5", A, inputOf("다섯"));
    await h.publish(p.report_id);
    await h.exec("update payment_orders set paid_at=now()-interval '2 hours' where payment_order_id='po-b-5'");
    const s = await h.notify.call("submit", { userId: A, paymentOrderId: "po-b-5", reason: "not_open" });
    await flushNotifications(deps);
    await h.rpc("ops_admin", "request_done", { id: s.id, note: "" });
    await reconcileOpen(deps);
    expect((await h.one<{ closed_line: string }>("select n.closed_line from ops_notifications n where n.dedupe_key=$1", [`req:${s.id}`])).closed_line).toMatch(/^✅ 안내 보냄 · GR-/);
    expect(await h.one("select resolution,resolved_by from order_requests where id=$1", [s.id])).toEqual({ resolution: "guide", resolved_by: "admin" });
  });
  it("미발행 → 그 사이 자동으로 완성되면 「✅ 자동으로 완성됐어요」", async () => {
    const p = await h.pay("po-b-6", A, inputOf("여섯"));
    await h.exec("update payment_orders set paid_at=now()-interval '40 minutes' where payment_order_id='po-b-6'");
    const cycle = await runNotifyCycle(deps);
    expect(cycle.unpublished).toBeGreaterThanOrEqual(1);
    const sent = tg.sent("ops").at(-1)!;
    expect(sent.text).toMatch(/^🚨 <b>책이 안 나왔어요<\/b> · GR-.+\n나라는 사람 · 결제 \d{2}:\d{2} · 4\d분 지남 · /);
    await h.publish(p.report_id);
    await reconcileOpen(deps);
    expect((await h.one<{ closed_line: string }>("select closed_line from ops_notifications where dedupe_key='unpub:po-b-6'")).closed_line).toMatch(/^✅ 자동으로 완성됐어요 · GR-/);
  });
  it("관리자 화면에서 환불한 미발행 건 → 「✅ 환불 완료」로 정리, 매출 봇 환불 알림", async () => {
    await h.pay("po-b-7", A, inputOf("일곱"));
    await h.exec("update payment_orders set paid_at=now()-interval '40 minutes' where payment_order_id='po-b-7'");
    await runNotifyCycle(deps);
    const code = (await h.one<{ order_code: string }>("select order_code from order_records where payment_order_id='po-b-7'")).order_code;
    await admin.impl!("refund", { orderCode: code, reason: "관리자 화면" });
    await runNotifyCycle(deps);
    expect((await h.one<{ closed_line: string }>("select closed_line from ops_notifications where dedupe_key='unpub:po-b-7'")).closed_line).toMatch(new RegExp(`^✅ 환불 완료 3,900원 · ${code}`));
    expect(tg.sent("sales").some(m => m.text.startsWith(`↩️ 환불 <b>3,900원</b> · 나라는 사람 · ${code}`))).toBe(true);
  });
});

describe("매출 봇 명령·웹훅", () => {
  it("/today·/yesterday·/month·/event(11/30 뒤 「이벤트가 끝났어요」)", async () => {
    expect(await handleUpdate("sales", msg("/today"), deps)).toBe("today");
    const t = tg.sent("sales").at(-1)!.text;
    expect(t).toMatch(/^📊 <b>오늘\(\d{2}\/\d{2}\)<\/b>\n결제 \d+건 · [\d,]+원\n환불 \d+건 · [\d,]+원\n순매출 <b>[\d,]+원<\/b>\n상품별: 나라는 사람 \d+건 [\d,]+원\n신규 \d+ · 재구매 \d+$/);
    expect(await handleUpdate("sales", msg("/yesterday"), deps)).toBe("yesterday");
    expect(await handleUpdate("sales", msg("/month"), deps)).toBe("month");
    expect(tg.sent("sales").at(-1)!.text).toContain("지난달 같은 날짜까지");
    expect(await handleUpdate("sales", msg("/event"), { ...deps, now: () => Date.parse("2026-11-10T12:00:00+09:00") })).toBe("event");
    expect(tg.sent("sales").at(-1)!.text).toMatch(/^🎁 <b>1\+1 증정 이용권<\/b> · 이벤트 11\/06~11\/16 · 이용권 11\/30까지\n발급 /);
    expect(await handleUpdate("sales", msg("/event"), { ...deps, now: () => Date.parse("2026-12-01T00:00:00+09:00") })).toBe("event_over");
    expect(tg.sent("sales").at(-1)!.text).toBe("이벤트가 끝났어요");
  });
  it("웹훅 비밀값 = 봇 토큰 HMAC(별도 환경변수 없음), 다르면 거절", () => {
    const cfg = telegramConfig({ TELEGRAM_SALES_BOT_TOKEN: "12345678:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", TELEGRAM_OPS_BOT_TOKEN: "87654321:BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB", TELEGRAM_OWNER_ID: OWNER });
    const secret = webhookSecret("12345678:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
    expect(secret).toMatch(/^[a-f0-9]{64}$/);
    expect(webhookSecretMatches("sales", secret, cfg)).toBe(true);
    expect(webhookSecretMatches("ops", secret, cfg)).toBe(false);
    expect(webhookSecretMatches("sales", null, cfg)).toBe(false);
  });
  it("배포가 바뀌면 두 봇 웹훅(우리 주소·비밀값)과 명령 메뉴를 설정하고, 같은 배포면 다시 부르지 않는다", async () => {
    const cfg = telegramConfig({ TELEGRAM_SALES_BOT_TOKEN: "12345678:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", TELEGRAM_OPS_BOT_TOKEN: "87654321:BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB", TELEGRAM_OWNER_ID: OWNER });
    const saved: Record<string, Record<string, unknown>> = {};
    const d = { ...deps, setting: async (k: string) => saved[k] ?? null, putSetting: async (k: string, v: Record<string, unknown>) => { saved[k] = v; return true; } };
    tg.calls.length = 0;
    expect(await ensureWebhooks(d, cfg, "dpl_1", false)).toEqual({ sales: "set", ops: "set" });
    expect(tg.calls.filter(c => c.method === "setWebhook").map(c => [c.bot, c.body.url, c.body.secret_token])).toEqual([
      ["sales", "https://www.gyeolreport.com/api/telegram/sales", webhookSecret("12345678:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA")],
      ["ops", "https://www.gyeolreport.com/api/telegram/ops", webhookSecret("87654321:BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB")]]);
    expect(tg.calls.find(c => c.method === "setMyCommands" && c.bot === "sales")?.body.commands).toEqual(expect.arrayContaining([{ command: "today", description: "오늘 매출" }]));
    expect(saved.notify_wake_url).toEqual({ url: "https://www.gyeolreport.com/api/ops/notify-wake" });
    tg.calls.length = 0;
    expect(await ensureWebhooks(d, cfg, "dpl_1", false)).toEqual({ sales: "ok", ops: "ok" });
    expect(tg.calls).toEqual([]);
  });
});
