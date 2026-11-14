import "server-only";
import type { OpsStore } from "../generation/sinks";
import { generationLineOf } from "../generation/alerts";
import { BOTS, messageIdOf, OPS_PUBLIC_ORIGIN, WAKE_PATH, webhookPath, webhookSecret, type BotName, type Telegram, type TelegramConfig } from "./telegram";
import { apiCreditText, bookComplete, esc, LINES, opsMessage, refundDoneLine, salesPaymentText, salesRefundText, shareFailedText, signupButtons, signupSurgeText, type ItemFacts, type Message, type OrderFacts, type Stats } from "./render";

/**
 * 알림 통로(운영 Q 4부). 대기표(ops_notifications)를 비우고, 처리 봇 메시지를 그때의 상태로 정리한다.
 * - 깨우기(pg_net → /api/ops/notify-wake)와 1분 예비 크론(/api/internal/ops-notify)이 같은 함수를 부른다. 같은 줄은 DB가 잠가 한 번만 보낸다.
 * - 알림 실패는 대기표에만 남는다(결제·발행·환불과 무관).
 */
type Env = Readonly<Record<string, string | undefined>>;
export type NotifyDeps = {
  notify: OpsStore;
  /** HOTFIX-W1 3부 1·2: 생성 기록(실패 한 줄)·다시 만들기 판단. 없으면(시험) 줄 없이. */
  generation?: OpsStore;
  tg: Telegram;
  now(): number;
  /** 결제수단(토스 결제 조회 API). 못 읽으면 null — 메시지는 그대로 보낸다. */
  paymentMethod(paymentKey: string | null, providerOrderId: string | null): Promise<string | null>;
  /** 운영 설정 읽기(ops_settings, 웹훅 기록). */
  setting(key: string): Promise<Record<string, unknown> | null>;
  putSetting(key: string, value: Record<string, unknown>): Promise<boolean>;
  /** 시험 계정 id(testAccountIds). 있으면 1분 크론이 DB 목록(ops_settings 'test_accounts')을 이 값으로 맞춘다. */
  testAccounts?: readonly string[];
  /** F: 가입 이용권(ops_signup — 급증 경보 확인·/campaign·[지급 멈춤]) · 퍼널(ops_funnel — /funnel). 없으면 그 기능만 쉰다. */
  signup?: OpsStore;
  funnel?: OpsStore;
  /** W3 P0: 4종 판매 중지 스위치(ops_sales — /sales·[4종 멈춤]·[다시 열기]). 없으면 그 기능만 쉰다. */
  sales?: OpsStore;
};
/** F 가입 급증 경보 기준: 최근 60분 신규 가입(시험 계정 제외) 20건 이상. */
export const SIGNUP_SURGE_THRESHOLD = 20;

// ── 한국 날짜 구간 ───────────────────────────────────────────────
const KST_OFFSET = 9 * 3_600_000;
const kstParts = (ms: number) => { const d = new Date(ms + KST_OFFSET); return { y: d.getUTCFullYear(), m: d.getUTCMonth(), d: d.getUTCDate() }; };
const kstMidnight = (y: number, m: number, d: number) => Date.UTC(y, m, d) - KST_OFFSET;
export function kstDay(now: number, offsetDays = 0): { start: string; end: string } {
  const p = kstParts(now), s = kstMidnight(p.y, p.m, p.d + offsetDays);
  return { start: new Date(s).toISOString(), end: new Date(s + 86_400_000).toISOString() };
}
/** 이번 달 1일 ~ 지금, 지난달 1일 ~ 지난달 같은 날짜·시각(지난달에 그 날짜가 없으면 말일 끝). */
export function kstMonth(now: number): { start: string; end: string; days: number; prevStart: string; prevEnd: string; month: number; prevMonth: number; day: number } {
  const p = kstParts(now), start = kstMidnight(p.y, p.m, 1), prevStart = kstMidnight(p.y, p.m - 1, 1);
  const prevLast = new Date(Date.UTC(p.y, p.m, 0)).getUTCDate();
  const prevEnd = p.d > prevLast ? kstMidnight(p.y, p.m - 1, prevLast + 1) : prevStart + (now - start);
  return { start: new Date(start).toISOString(), end: new Date(now).toISOString(), days: p.d, prevStart: new Date(prevStart).toISOString(), prevEnd: new Date(prevEnd).toISOString(),
    month: p.m + 1, prevMonth: ((p.m + 11) % 12) + 1, day: p.d };
}
const num = (v: unknown) => Number(v) || 0;
export async function stats(notify: OpsStore, range: { start: string; end: string }): Promise<Stats> {
  const r = await notify.call("stats", range);
  return { payCount: num(r.payCount), paySum: num(r.paySum), refundCount: num(r.refundCount), refundSum: num(r.refundSum), newCount: num(r.newCount), repeatCount: num(r.repeatCount),
    byProduct: Array.isArray(r.byProduct) ? (r.byProduct as Stats["byProduct"]) : [] };
}
export async function itemFacts(notify: OpsStore, id: number, generation?: OpsStore): Promise<ItemFacts | null> {
  const r = await notify.call("item", { id });
  if (r.ok !== true || !r.item) return null;
  const item = r.item as ItemFacts["item"];
  const facts: ItemFacts = { item: { ...item, state: (item.state ?? {}) as ItemFacts["item"]["state"] }, request: (r.request ?? null) as ItemFacts["request"], order: (r.order ?? null) as OrderFacts | null,
    ticket: (r.ticket ?? null) as ItemFacts["ticket"], duplicates: Array.isArray(r.duplicates) ? r.duplicates as ItemFacts["duplicates"] : [], regenFailedBefore: r.regenFailedBefore === true,
    failed: (r.failed ?? null) as ItemFacts["failed"] };
  // HOTFIX-W1 3부 1: 「책이 안 나왔어요」에 실패 한 줄(생성 기록 읽기 실패면 줄 없이).
  const reportId = facts.order?.reportId ?? facts.ticket?.reportId ?? null;
  if (generation && item.kind === "unpublished" && reportId) {
    try {
      const g = await generation.call("state", { reportId });
      facts.genLine = generationLineOf(Array.isArray(g.runs) ? g.runs as never : [], (g.state ?? null) as never, facts.order?.productType ?? facts.ticket?.productType ?? null);
    } catch { /* 줄 없이 */ }
  }
  return facts;
}
const markup = (m: Message) => ({ inline_keyboard: m.buttons });

// ── 대기표 비우기 ────────────────────────────────────────────────
type Claimed = { id: number; kind: string; bot: BotName; payload: Record<string, unknown>; attempts: number };
async function build(deps: NotifyDeps, x: Claimed): Promise<Message> {
  if (x.kind === "payment" || x.kind === "refund") {
    const r = await deps.notify.call("order", { paymentOrderId: x.payload.paymentOrderId });
    const o = r.order as OrderFacts | null;
    if (!o) throw new Error("ORDER_MISSING");
    const today = await stats(deps.notify, kstDay(deps.now()));
    return x.kind === "payment" ? { text: salesPaymentText(o, await deps.paymentMethod(o.paymentKey, o.providerOrderId), today), buttons: [] } : { text: salesRefundText(o, today), buttons: [] };
  }
  // 공유 실패 경보: 대기표 줄의 숫자만으로 그린다(버튼 없음 → 보내면 바로 닫힘).
  if (x.kind === "share_failed") return { text: shareFailedText(x.payload), buttons: [] };
  // F: 가입 급증 경보([지급 멈춤]·[다시 켜기] — 그 순간 상태)·API 잔액 경보(버튼 없음).
  if (x.kind === "signup_surge") return { text: signupSurgeText(x.payload), buttons: signupButtons(x.payload.on !== false) };
  if (x.kind === "api_credit") return { text: apiCreditText(x.payload), buttons: [] };
  const f = await itemFacts(deps.notify, x.id, deps.generation);
  if (!f) throw new Error("ITEM_MISSING");
  return renderOps(deps, f);
}
/** 처리 봇 메시지(버튼 포함)를 지금 사실로 그린다. 결제수단은 그릴 때마다 토스 결제 조회로 읽고 DB에 저장하지 않는다(다시 그릴 때 「확인 못 함」으로 바뀌지 않게). */
export async function renderOps(deps: NotifyDeps, f: ItemFacts): Promise<Message> {
  return opsMessage(f, f.order ? await deps.paymentMethod(f.order.paymentKey, f.order.providerOrderId) : null, deps.now());
}
export async function flushNotifications(deps: NotifyDeps, limit = 20): Promise<{ sent: number; failed: number; skipped?: string }> {
  if (!deps.tg.ownerId || !BOTS.some(b => deps.tg.configured(b))) return { sent: 0, failed: 0, skipped: "TELEGRAM_UNSET" };
  const c = await deps.notify.call("claim", { limit });
  const items = Array.isArray(c.items) ? c.items as Claimed[] : [];
  let sent = 0, failed = 0;
  for (const x of items) {
    let code = "FAILED";
    try {
      if (!deps.tg.configured(x.bot)) code = "TELEGRAM_UNSET";
      else {
        const m = await build(deps, x);
        const r = await deps.tg.call(x.bot, "sendMessage", { chat_id: deps.tg.ownerId, text: m.text, parse_mode: "HTML", disable_web_page_preview: true, ...(m.buttons.length ? { reply_markup: markup(m) } : {}) });
        if (r.ok) { await deps.notify.call("sent", { id: x.id, messageId: messageIdOf(r), closed: m.buttons.length === 0 }); sent++; continue; }
        code = r.code;
      }
    } catch (e) { code = (e as Error)?.message?.slice(0, 60) || "BUILD_FAILED"; }
    await deps.notify.call("failed", { id: x.id, error: code });
    failed++;
  }
  return { sent, failed };
}

// ── 처리 봇 메시지 정리(관리자 화면·자동 처리·자동 완성까지) ───────────────────
export async function editOps(deps: NotifyDeps, messageId: number | null, m: Message): Promise<boolean> {
  if (!messageId) return false;
  const r = await deps.tg.call("ops", "editMessageText", { chat_id: deps.tg.ownerId, message_id: messageId, text: m.text, parse_mode: "HTML", disable_web_page_preview: true, reply_markup: markup(m) });
  return r.ok || /message is not modified/i.test(r.code);
}
/** 한 줄로 바꾸고 버튼을 지운다. DB에서 먼저 닫아(한 번만) 텔레그램을 고친다. */
export async function closeItem(deps: NotifyDeps, f: ItemFacts, line: string, set: Record<string, unknown> = {}): Promise<boolean> {
  const c = await deps.notify.call("close", { id: f.item.id, line, set });
  if (c.ok !== true) return false;
  await editOps(deps, f.item.messageId, { text: esc(line), buttons: [] });
  return true;
}
const codeOf = (f: ItemFacts) => f.order?.orderCode ?? (f.ticket ? "이용권 책" : "-");
const after = (iso: string | null | undefined, at: number) => { const t = Date.parse(iso ?? ""); return Number.isFinite(t) && t > at; };
/** 다시 만들기가 끝났는지: 정식본 교체(official_at이 누른 뒤) 또는 처음 발행(published_at이 누른 뒤). */
export function regenOutcome(f: ItemFacts, now: number): "done" | "failed" | "active" | "waiting" {
  const st = f.item.state, at = Date.parse(st.workingAt ?? "");
  if (!Number.isFinite(at)) return "waiting";
  const book = f.order?.book ?? f.ticket?.book ?? null, gen = f.order?.gen ?? f.ticket?.gen ?? null, job = f.order?.job ?? null;
  if (after(gen?.officialAt, at) || (bookComplete(book) && after(book?.publishedAt, at))) return "done";
  if (after(gen?.gaveUpAt, at)) return "failed";
  if (st.regenSawActive && !gen?.regenerateRequestedAt && (!job || job.status !== "QUEUED" && job.status !== "RUNNING" && job.status !== "RETRYING")) return "failed";
  if (st.regenSawActive && job?.status === "FAILED_REQUIRES_ATTENTION") return "failed";
  if (now - at > 3 * 3_600_000) return "failed";
  return gen?.regenerateRequestedAt || (job && ["QUEUED", "RUNNING", "RETRYING"].includes(job.status ?? "")) ? "active" : "waiting";
}
export async function reconcileItem(deps: NotifyDeps, f: ItemFacts): Promise<string> {
  const st = f.item.state, o = f.order, now = deps.now(), nowIso = new Date(now).toISOString();
  if (f.item.closedAt) return "closed";
  if (o && (o.status === "refunded" || o.status === "canceled")) return await closeItem(deps, f, refundDoneLine(o, o.refundedAt)) ? "refund" : "skip";
  if (st.pin && Date.parse(st.pin.until) < now) {
    await deps.notify.call("patch_state", { id: f.item.id, remove: ["pin"] });
    if (st.pin.promptId) await deps.tg.call("ops", "deleteMessage", { chat_id: deps.tg.ownerId, message_id: st.pin.promptId });
    const g = await itemFacts(deps.notify, f.item.id, deps.generation);
    if (g) await editOps(deps, g.item.messageId, await renderOps(deps, g));
    return "pin_expired";
  }
  if (f.request?.status === "done" && !st.working) {
    const res = f.request.resolution;
    if (res === "regenerate") {
      await deps.notify.call("patch_state", { id: f.item.id, set: { working: "regenerate", workingAt: f.request.resolvedAt ?? nowIso } });
      await editOps(deps, f.item.messageId, { text: esc(LINES.regenerating(codeOf(f))), buttons: [] });
      return "regen_tracking";
    }
    if (res === "refund") { await editOps(deps, f.item.messageId, { text: esc(LINES.refunding(codeOf(f))), buttons: [] }); await deps.notify.call("patch_state", { id: f.item.id, set: { working: "refund", workingAt: nowIso } }); return "refunding"; }
    if (res === "ticket") return await closeItem(deps, f, LINES.ticketBack(codeOf(f), f.request.resolvedAt ?? nowIso)) ? "ticket" : "skip";
    return await closeItem(deps, f, LINES.guided(codeOf(f), f.request.resolvedAt ?? nowIso)) ? "guide" : "skip";
  }
  if (st.working === "regenerate") {
    const out = regenOutcome(f, now);
    if (out === "done") return await closeItem(deps, f, LINES.regenerated(codeOf(f), nowIso)) ? "regenerated" : "skip";
    if (out === "failed") {
      await deps.notify.call("patch_state", { id: f.item.id, remove: ["working", "workingAt", "regenSawActive"], set: { regenFailed: true } });
      const g = await itemFacts(deps.notify, f.item.id, deps.generation);
      if (g) await editOps(deps, g.item.messageId, await renderOps(deps, g));
      return "regen_failed";
    }
    if (out === "active" && !st.regenSawActive) await deps.notify.call("patch_state", { id: f.item.id, set: { regenSawActive: true } });
    return out;
  }
  if (f.item.kind === "unpublished" && !st.working && bookComplete(o?.book ?? null)) return await closeItem(deps, f, LINES.autoDone(codeOf(f), nowIso)) ? "auto_done" : "skip";
  return "open";
}
export async function reconcileOpen(deps: NotifyDeps, max = 30): Promise<Record<string, number>> {
  if (!deps.tg.configured("ops")) return { skipped: 1 };
  const r = await deps.notify.call("open_items", {});
  const ids = (Array.isArray(r.ids) ? r.ids as number[] : []).slice(0, max), out: Record<string, number> = {};
  for (const id of ids) {
    try { const f = await itemFacts(deps.notify, id); if (!f) continue; const k = await reconcileItem(deps, f); out[k] = (out[k] ?? 0) + 1; }
    catch { out.error = (out.error ?? 0) + 1; }
  }
  return out;
}

// ── 텔레그램 설정 자동화(운영 배포에서만) ─────────────────────────────
export const BOT_COMMANDS: Record<BotName, { command: string; description: string }[]> = {
  sales: [{ command: "today", description: "오늘 매출" }, { command: "yesterday", description: "어제 매출" }, { command: "month", description: "이번 달 누적·지난달 비교" }, { command: "event", description: "1+1 증정 이용권 현황" },
    { command: "funnel", description: "퍼널(오늘·7일·유입별)" }],
  ops: [{ command: "pending", description: "버튼이 남은 처리 건" }, { command: "campaign", description: "가입 이용권 현황·지급 멈춤" }, { command: "sales", description: "4종 판매 멈춤·다시 열기" }],
};
/**
 * 두 봇의 웹훅이 우리 주소로 맞는지 보고, 없거나 다르거나 배포가 바뀌었으면 다시 설정한다(setWebhook + setMyCommands). 깨우기 주소도 DB에 적는다.
 * full=false면 배포 id가 같을 때 텔레그램을 부르지 않는다(1분 크론). 토큰은 텔레그램 API 주소에만 쓰고 밖으로 내보내지 않는다.
 */
export async function ensureWebhooks(deps: NotifyDeps, config: TelegramConfig, deploymentId: string, full: boolean): Promise<Record<string, string>> {
  const out: Record<string, string> = {};
  await deps.putSetting("notify_wake_url", { url: `${OPS_PUBLIC_ORIGIN}${WAKE_PATH}` });
  const saved = { ...(await deps.setting("telegram_webhook") ?? {}) } as Record<string, unknown>;
  for (const bot of BOTS) {
    const token = config.tokens[bot];
    if (!token) { out[bot] = "unset"; continue; }
    const want = `${OPS_PUBLIC_ORIGIN}${webhookPath(bot)}`;
    let reset = saved[bot] !== deploymentId;
    if (!reset && full) {
      const info = await deps.tg.call(bot, "getWebhookInfo", {});
      const r = info.ok ? info.result as { url?: string; last_error_message?: string } : null;
      reset = !r || r.url !== want || /401|403|Unauthorized|Forbidden/i.test(r.last_error_message ?? "");
    }
    if (!reset) { out[bot] = "ok"; continue; }
    const set = await deps.tg.call(bot, "setWebhook", { url: want, secret_token: webhookSecret(token), allowed_updates: ["message", "callback_query"], max_connections: 5 });
    const cmd = await deps.tg.call(bot, "setMyCommands", { commands: BOT_COMMANDS[bot] });
    out[bot] = set.ok && cmd.ok ? "set" : `fail:${set.ok ? "" : set.code}${cmd.ok ? "" : ` ${cmd.code}`}`.slice(0, 80);
    if (set.ok && cmd.ok) saved[bot] = deploymentId;
  }
  await deps.putSetting("telegram_webhook", saved);
  return out;
}

/** 1분 크론 한 바퀴: 미발행 감지 → 보내기 → 정리 → 12시간 재알림 → (재알림) 보내기. 각 단계 실패는 다음 단계를 막지 않는다. */
export async function runNotifyCycle(deps: NotifyDeps, opts: { webhooks?: { config: TelegramConfig; deploymentId: string; full: boolean } | null; purge?: boolean } = {}): Promise<Record<string, unknown>> {
  const out: Record<string, unknown> = {};
  const step = async (name: string, f: () => Promise<unknown>) => { try { out[name] = await f(); } catch { out[name] = "error"; } };
  if (opts.webhooks) await step("webhooks", () => ensureWebhooks(deps, opts.webhooks!.config, opts.webhooks!.deploymentId, opts.webhooks!.full));
  // 집계(ops_notify 'stats')와 「시험」 표시가 읽는 시험 계정 목록. 같은 값이면 DB가 고치지 않는다.
  if (deps.testAccounts?.length) await step("testAccounts", () => deps.putSetting("test_accounts", { ids: [...deps.testAccounts!] }));
  await step("unpublished", async () => (await deps.notify.call("scan_unpublished", {})).added ?? 0);
  if (deps.signup) await step("signupSurge", async () => (await deps.signup!.call("surge_check", { threshold: SIGNUP_SURGE_THRESHOLD })).alerted === true);
  await step("flush", () => flushNotifications(deps));
  await step("reconcile", () => reconcileOpen(deps));
  await step("remind", async () => (await deps.notify.call("remind", {})).reminded ?? 0);
  if (Number(out.remind) > 0) await step("flush2", () => flushNotifications(deps, 5));
  if (opts.purge) await step("purge", async () => (await deps.notify.call("purge", {})).ok === true);
  return out;
}

// ── 결제수단(토스 결제 조회) ─────────────────────────────────────────
/** 토스 결제 조회 GET /v1/payments/{paymentKey}. 승인 경로와 무관한 읽기만. 주문번호가 다르면 버린다. */
export function tossPaymentMethodReader(env: Env = process.env, fetchImpl: typeof fetch = fetch, timeoutMs = 5_000) {
  const secret = env.TOSS_PAYMENTS_SECRET_KEY;
  return async (paymentKey: string | null, providerOrderId: string | null): Promise<string | null> => {
    if (!secret || !paymentKey || !/^[A-Za-z0-9_-]{6,200}$/.test(paymentKey)) return null;
    const abort = new AbortController(), timer = setTimeout(() => abort.abort(), timeoutMs);
    try {
      const r = await fetchImpl(`https://api.tosspayments.com/v1/payments/${encodeURIComponent(paymentKey)}`, { headers: { Authorization: `Basic ${Buffer.from(`${secret}:`).toString("base64")}` }, cache: "no-store", redirect: "error", signal: abort.signal });
      if (!r.ok) return null;
      const p = await r.json() as { orderId?: unknown; method?: unknown; easyPay?: unknown };
      if (providerOrderId && p.orderId !== providerOrderId) return null;
      const { methodLabel } = await import("./render");
      return methodLabel(p);
    } catch { return null; } finally { clearTimeout(timer); }
  };
}
