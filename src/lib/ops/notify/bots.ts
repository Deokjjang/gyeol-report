import "server-only";
import { createHash } from "node:crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import { runAdminActionAs, type AdminActionDeps } from "../admin/actions";
import { adminPinConfigured, adminPinMatches } from "../admin/config";
import { grantTickets } from "../admin/rpc";
import type { AuditEntry } from "../store";
import { EVENT_TICKET_DAYS, giftEventConfig, signupCampaignConfig } from "../config";
import { closeItem, editOps, itemFacts, kstDay, kstMonth, reconcileItem, renderOps, stats, type NotifyDeps } from "./flush";
import { campaignText, duplicateToRefund, esc, eventText, funnelText, hm, LINES, md, monthText, opsButtons, refundDoneLine, SIGNUP_PAUSE_DATA, SIGNUP_RESUME_DATA, signupButtons, signupSwitchText, statsText, won, type CampaignStats, type EventStats, type FunnelRow, type ItemFacts, type OrderFacts } from "./render";
import type { BotName } from "./telegram";

/**
 * 두 봇의 웹훅 처리(운영 Q 5·6부). 덕짱님 id(TELEGRAM_OWNER_ID)에서 온 메시지·버튼만 처리하고, 다른 사람 것은 답하지 않고 기록만 남긴다.
 * 같은 update(텔레그램 재전송)·같은 버튼 두 번은 한 번만 처리한다(update_id 기록 + 버튼 동작 잠금).
 * [환불]·[이용권 돌려주기]는 관리자 화면 비밀번호(ADMIN_ACTION_PIN)를 2분 안에 받아 시간 일정 비교로 대조한다(5번 틀리면 30분 잠금).
 */
export type BotDeps = NotifyDeps & {
  admin: AdminActionDeps;
  /** 봇이 관리자 작업을 할 때 쓰는 관리자 계정(ADMIN_USER_IDS 첫 번째). 없으면 버튼 작업을 하지 않는다. */
  adminId: string | null;
  audit(entry: AuditEntry): Promise<boolean>;
  db: SupabaseClient | null;
  env: Readonly<Record<string, string | undefined>>;
};
export const BOT_PIN_TTL_MS = 2 * 60_000;
export const BOT_PIN_MAX_FAILURES = 5;
export const BOT_PIN_LOCK_MS = 30 * 60_000;

type Tg = { update_id?: unknown; message?: TgMessage; callback_query?: { id?: string; from?: { id?: unknown }; data?: string; message?: TgMessage } };
type TgMessage = { message_id?: number; from?: { id?: unknown }; chat?: { id?: unknown; type?: string }; text?: string; reply_to_message?: { message_id?: number } };

const audit = (deps: BotDeps, action: string, target: string, detail: Record<string, unknown> = {}) =>
  deps.audit({ actor: "admin", actorUserId: deps.adminId, action, target, detail: { via: "telegram", ...detail } }).catch(() => false);
const send = (deps: BotDeps, bot: BotName, text: string, extra: Record<string, unknown> = {}) =>
  deps.tg.call(bot, "sendMessage", { chat_id: deps.tg.ownerId, text, parse_mode: "HTML", disable_web_page_preview: true, ...extra });
const toast = (deps: BotDeps, id: string | undefined, text = "") => id ? deps.tg.call("ops", "answerCallbackQuery", { callback_query_id: id, ...(text ? { text: text.slice(0, 190), show_alert: text.length > 60 } : {}) }) : Promise.resolve(null);

export async function handleUpdate(bot: BotName, raw: unknown, deps: BotDeps): Promise<string> {
  const u = (raw && typeof raw === "object" ? raw : {}) as Tg;
  const updateId = typeof u.update_id === "number" && Number.isSafeInteger(u.update_id) ? u.update_id : null;
  if (updateId === null) return "no_update_id";
  const seen = await deps.notify.call("seen", { bot, updateId });
  if (seen.ok === true && seen.fresh === false) return "duplicate";
  const from = String(u.callback_query?.from?.id ?? u.message?.from?.id ?? "");
  const chat = u.message ? String(u.message.chat?.id ?? "") : String(u.callback_query?.message?.chat?.id ?? from);
  if (!deps.tg.ownerId || from !== deps.tg.ownerId || chat !== deps.tg.ownerId) {
    await audit(deps, "bot_ignored", `telegram:${bot}`, { from: from ? createHash("sha256").update(from).digest("hex").slice(0, 12) : null, kind: u.callback_query ? "callback" : u.message ? "message" : "other" });
    return "ignored";
  }
  if (bot === "sales") return u.message?.text ? await salesCommand(deps, u.message.text) : "skip";
  if (u.callback_query) return await opsCallback(deps, u.callback_query);
  if (u.message?.text) return u.message.text.startsWith("/") ? await opsCommand(deps, u.message.text) : await opsPassword(deps, u.message);
  return "skip";
}

// ── 💳 매출 봇 명령 ──────────────────────────────────────────────
async function salesCommand(deps: BotDeps, text: string): Promise<string> {
  const cmd = text.trim().split(/[\s@]/)[0].toLowerCase(), now = deps.now();
  if (cmd === "/today" || cmd === "/yesterday") {
    const off = cmd === "/today" ? 0 : -1, range = kstDay(now, off);
    await send(deps, "sales", statsText(`${off === 0 ? "오늘" : "어제"}(${md(range.start)})`, await stats(deps.notify, range)));
    return cmd.slice(1);
  }
  if (cmd === "/month") {
    const m = kstMonth(now);
    const [cur, prev] = await Promise.all([stats(deps.notify, { start: m.start, end: m.end }), stats(deps.notify, { start: m.prevStart, end: m.prevEnd })]);
    await send(deps, "sales", monthText(`${m.month}월 누적(1~${m.day}일)`, cur, m.days, `지난달 같은 날짜까지(${m.prevMonth}/1~${m.prevMonth}/${m.day})`, prev));
    return "month";
  }
  if (cmd === "/event") {
    // 이벤트 기간과, 마지막 날 받은 이용권이 끝날 때(이벤트 끝 + 30일 — 2026-11-10 정정: 받은 날부터 30일)까지만 답한다.
    const cfg = giftEventConfig(deps.env), lastExpiry = Date.parse(cfg.end) + EVENT_TICKET_DAYS * 86_400_000;
    if (!(now < lastExpiry)) { await send(deps, "sales", "이벤트가 끝났어요"); return "event_over"; }
    const r = await deps.notify.call("event_stats", {});
    const e: EventStats = { issued: Number(r.issued) || 0, usedSelf: Number(r.usedSelf) || 0, gifted: Number(r.gifted) || 0, claimed: Number(r.claimed) || 0, available: Number(r.available) || 0,
      revoked: Number(r.revoked) || 0, expired: Number(r.expired) || 0, nextExpiry: typeof r.nextExpiry === "string" ? r.nextExpiry : null };
    await send(deps, "sales", eventText(e, `이벤트 ${md(cfg.start)}~${md(new Date(Date.parse(cfg.end) - 1000).toISOString())}`, `받은 날부터 ${EVENT_TICKET_DAYS}일`));
    return "event";
  }
  if (cmd === "/funnel") {
    // F: 알림이 아니라 명령 응답. 익명 집계(날짜 × 단계 × 유입)와 서버 기록(시험 계정 제외).
    const r = deps.funnel ? await deps.funnel.call("report", { days: 7 }) : { ok: false };
    if (r.ok !== true) { await send(deps, "sales", "퍼널 기록을 읽지 못했어요. 잠시 뒤 다시 시도해 주세요."); return "funnel_failed"; }
    await send(deps, "sales", funnelText({ today: String(r.today), from: String(r.from), rows: (Array.isArray(r.rows) ? r.rows : []) as FunnelRow[], server: (r.server ?? {}) as Record<string, number> }));
    return "funnel";
  }
  await send(deps, "sales", "명령: /today 오늘 · /yesterday 어제 · /month 이번 달 · /event 1+1 이용권 · /funnel 퍼널");
  return "help";
}

// ── 📮 처리 봇 ───────────────────────────────────────────────────
async function opsCommand(deps: BotDeps, text: string): Promise<string> {
  const cmd = text.trim().split(/[\s@]/)[0].toLowerCase();
  if (cmd === "/campaign") return await campaignCommand(deps);
  if (cmd !== "/pending") { await send(deps, "ops", "명령: /pending 버튼이 남은 처리 건 · /campaign 가입 이용권 현황"); return "help"; }
  const r = await deps.notify.call("pending", {});
  const items = Array.isArray(r.items) ? r.items as { id: number; kind: string; messageId: number | null; createdAt: string; orderCode: string | null; reason: string | null }[] : [];
  const failed = Array.isArray(r.failed) ? r.failed as { id: number; kind: string; bot: string; attempts: number; lastError: string | null; createdAt: string }[] : [];
  if (!items.length && !failed.length) { await send(deps, "ops", "남은 건이 없어요 ✅"); return "pending_empty"; }
  // 원래 메시지에 답장으로 하나씩(누르면 그 메시지로 간다).
  for (const it of items.slice(0, 20)) {
    const what = it.kind === "unpublished" ? "책이 안 나왔어요" : it.reason === "double_paid" ? "두 번 결제" : "책이 안 나오거나 안 열려요";
    await send(deps, "ops", `⏳ ${esc(what)} · ${esc(it.orderCode ?? "이용권 책")} · ${hm(it.createdAt)}`, it.messageId ? { reply_parameters: { message_id: it.messageId, allow_sending_without_reply: true } } : {});
  }
  if (failed.length) await send(deps, "ops", [`🚨 보내지 못한 알림 ${failed.length}건(10번 실패)`, ...failed.slice(0, 10).map(f => `· ${esc(f.kind)} · ${md(f.createdAt)} ${hm(f.createdAt)} · ${esc(f.lastError ?? "-")}`)].join("\n"));
  await send(deps, "ops", `남은 건 ${items.length}건${failed.length ? ` · 실패 알림 ${failed.length}건` : ""}`);
  return "pending";
}

type Parsed = { id: number; act: "rf" | "rg" | "gd" | "tk" | "cx"; target?: string };
function parseData(data: string | undefined): Parsed | null {
  const m = /^q:(\d{1,15}):(rf|rg|gd|tk|cx)(?::(GR-[2-9A-HJKMNP-Z]{4,6}))?$/.exec(data ?? "");
  return m ? { id: Number(m[1]), act: m[2] as Parsed["act"], target: m[3] } : null;
}
const reasonLabel = (f: ItemFacts) => f.item.kind === "unpublished" ? "미발행" : f.request?.reason === "double_paid" ? "두 번 결제" : "안 나옴·안 열림";

// ── F 가입 이용권(/campaign · [지급 멈춤] · [다시 켜기]) ──────────────────
const n0 = (v: unknown) => Number(v) || 0;
async function campaignCommand(deps: BotDeps): Promise<string> {
  const cfg = signupCampaignConfig(deps.env, deps.now());
  const r = deps.signup && cfg.valid ? await deps.signup.call("stats", { start: cfg.start }) : { ok: false };
  if (r.ok !== true) { await send(deps, "ops", "가입 이용권 현황을 읽지 못했어요. 잠시 뒤 다시 시도해 주세요."); return "campaign_failed"; }
  const c: CampaignStats = { on: r.on !== false, at: typeof r.at === "string" ? r.at : null, signupsToday: n0(r.signupsToday), signups: n0(r.signups), grantedToday: n0(r.grantedToday), granted: n0(r.granted),
    used: n0(r.used), available: n0(r.available), expired: n0(r.expired), booksStarted: n0(r.booksStarted), booksPublished: n0(r.booksPublished),
    avgCostUsd: r.avgCostUsd === null || r.avgCostUsd === undefined ? null : Number(r.avgCostUsd), costSample: n0(r.costSample) };
  await send(deps, "ops", campaignText(c, `${md(cfg.start)}~${md(new Date(cfg.endMs - 1000).toISOString())}`), { reply_markup: { inline_keyboard: signupButtons(c.on) } });
  return "campaign";
}
/** [지급 멈춤]·[다시 켜기]: 덕짱님 id만(웹훅 첫 관문), 돈이 오가지 않아 비밀번호 없음. 누른 메시지를 새 상태 한 줄 + 반대 버튼으로 바꾼다. */
async function signupSwitch(deps: BotDeps, q: NonNullable<Tg["callback_query"]>, on: boolean): Promise<string> {
  if (!deps.signup) { await toast(deps, q.id, "가입 이용권 저장소가 없어요."); return "signup_unavailable"; }
  const r = await deps.signup.call(on ? "resume" : "pause", { by: "telegram" });
  if (r.ok !== true) { await toast(deps, q.id, "바꾸지 못했어요. 잠시 뒤 다시 눌러 주세요."); return "signup_failed"; }
  await audit(deps, on ? "signup_grant_resumed" : "signup_grant_paused", "signup_grant", {});
  const at = typeof r.at === "string" ? new Date(r.at).toISOString() : new Date(deps.now()).toISOString();
  if (typeof q.message?.message_id === "number") await editOps(deps, q.message.message_id, { text: signupSwitchText(on, at), buttons: signupButtons(on) });
  await toast(deps, q.id, on ? "가입 이용권 지급을 다시 켰어요." : "가입 이용권 지급을 멈췄어요.");
  return on ? "signup_resumed" : "signup_paused";
}

async function opsCallback(deps: BotDeps, q: NonNullable<Tg["callback_query"]>): Promise<string> {
  if (q.data === SIGNUP_PAUSE_DATA || q.data === SIGNUP_RESUME_DATA) return await signupSwitch(deps, q, q.data === SIGNUP_RESUME_DATA);
  const p = parseData(q.data);
  if (!p) { await toast(deps, q.id); return "bad_data"; }
  const f = await itemFacts(deps.notify, p.id);
  if (!f || f.item.closedAt) { await toast(deps, q.id, "이미 처리된 건이에요."); return "closed"; }
  if (p.act === "cx") { await cancelPin(deps, f); await toast(deps, q.id, "취소했어요."); return "cancel"; }
  // 지금 보이는 버튼만 받는다(오래된 메시지·만든 버튼 방지).
  const allowed = opsButtons(f).find(b => b.act === p.act && (b.target ?? undefined) === p.target);
  if (!allowed) { await toast(deps, q.id, "지금은 할 수 없는 동작이에요. /pending 으로 다시 확인해 주세요."); return "not_allowed"; }
  if (!deps.adminId) { await toast(deps, q.id, "관리자 계정(ADMIN_USER_IDS)이 설정되지 않았어요."); return "no_admin"; }
  await audit(deps, "bot_button", f.order?.orderCode ?? f.ticket?.reportId ?? `notify:${f.item.id}`, { notificationId: f.item.id, act: p.act, target: p.target ?? null });
  if (p.act === "rf" || p.act === "tk") return await askPin(deps, f, p, q.id);
  if (p.act === "rg") return await regenerate(deps, f, q.id);
  return await guide(deps, f, q.id);
}

// 비밀번호 받기: 같은 메시지가 「… 비밀번호를 보내 주세요 (2분)」 + [취소]로 바뀌고, 답장 칸(ForceReply)을 띄운다.
async function askPin(deps: BotDeps, f: ItemFacts, p: Parsed, callbackId?: string): Promise<string> {
  if (!adminPinConfigured(deps.env)) { await toast(deps, callbackId, "관리자 비밀번호(ADMIN_ACTION_PIN)가 설정되지 않았어요."); return "pin_unset"; }
  const lock = await pinLockedUntil(deps);
  if (lock) { await toast(deps, callbackId, `비밀번호를 ${BOT_PIN_MAX_FAILURES}번 틀려 ${hm(new Date(lock).toISOString())}까지 잠겼어요.`); return "pin_locked"; }
  const target = targetOrder(f, p.target);
  const code = p.act === "tk" ? "이용권 책" : target?.orderCode ?? "-", amount = p.act === "tk" ? 0 : target?.amount ?? 0;
  const until = new Date(deps.now() + BOT_PIN_TTL_MS).toISOString();
  const set = await deps.notify.call("patch_state", { id: f.item.id, set: { pin: { act: p.act, ...(p.target ? { target: p.target } : {}), until, failures: 0 } } });
  if (set.ok !== true) { await toast(deps, callbackId, "이미 처리된 건이에요."); return "closed"; }
  const line = p.act === "tk" ? "이용권 1장 돌려주기 · 비밀번호를 보내 주세요 (2분)" : LINES.pinPrompt(code, amount);
  await editOps(deps, f.item.messageId, { text: esc(line), buttons: [[{ text: "취소", callback_data: `q:${f.item.id}:cx` }]] });
  const prompt = await deps.tg.call("ops", "sendMessage", { chat_id: deps.tg.ownerId, text: "비밀번호를 이 메시지에 답장으로 보내 주세요. 받자마자 지워요.", reply_markup: { force_reply: true, input_field_placeholder: "관리자 비밀번호" } });
  const promptId = prompt.ok ? (prompt.result as { message_id?: number }).message_id : undefined;
  if (promptId) await deps.notify.call("patch_state", { id: f.item.id, set: { pin: { act: p.act, ...(p.target ? { target: p.target } : {}), until, failures: 0, promptId } } });
  await toast(deps, callbackId);
  return "pin_asked";
}
async function cancelPin(deps: BotDeps, f: ItemFacts): Promise<void> {
  const pin = f.item.state.pin;
  await deps.notify.call("patch_state", { id: f.item.id, remove: ["pin"] });
  if (pin?.promptId) await deps.tg.call("ops", "deleteMessage", { chat_id: deps.tg.ownerId, message_id: pin.promptId });
  const g = await itemFacts(deps.notify, f.item.id);
  if (g) await editOps(deps, g.item.messageId, await renderOps(deps, g));
}
/** 최근 실패 시각(오름차순, 봇 전용 기록 bot_pin_failed). 기록을 못 읽으면 잠긴 것으로 본다. */
async function pinFailureTimes(deps: BotDeps): Promise<number[] | null> {
  if (!deps.db) return null;
  try {
    const since = new Date(deps.now() - BOT_PIN_LOCK_MS * 2).toISOString();
    const { data, error } = await deps.db.from("ops_audit_log").select("created_at").eq("action", "bot_pin_failed").gte("created_at", since).order("created_at", { ascending: true }).limit(50);
    return error || !data ? null : data.map(x => Date.parse(String(x.created_at))).filter(Number.isFinite);
  } catch { return null; }
}
/** 30분 안 5번 틀리면 5번째부터 30분 잠금. */
export function botPinLockedUntil(failures: readonly number[], now: number): number | null {
  const t = [...failures].sort((a, b) => a - b);
  let until = 0;
  for (let i = 0; i + BOT_PIN_MAX_FAILURES - 1 < t.length; i++) {
    const fifth = t[i + BOT_PIN_MAX_FAILURES - 1];
    if (fifth - t[i] <= BOT_PIN_LOCK_MS) until = Math.max(until, fifth + BOT_PIN_LOCK_MS);
  }
  return until > now ? until : null;
}
async function pinLockedUntil(deps: BotDeps): Promise<number | null> {
  const t = await pinFailureTimes(deps);
  if (!t) return deps.now() + BOT_PIN_LOCK_MS;
  return botPinLockedUntil(t, deps.now());
}

async function opsPassword(deps: BotDeps, m: TgMessage): Promise<string> {
  // 비밀번호 메시지는 받자마자 지운다(대조보다 먼저).
  if (m.message_id) await deps.tg.call("ops", "deleteMessage", { chat_id: deps.tg.ownerId, message_id: m.message_id });
  const w = await deps.notify.call("pin_waiting", {});
  const waiting = Array.isArray(w.items) ? w.items as { id: number; pin: { promptId?: number } }[] : [];
  const hit = waiting.find(x => x.pin?.promptId && x.pin.promptId === m.reply_to_message?.message_id) ?? (waiting.length === 1 ? waiting[0] : null);
  if (!hit) { await send(deps, "ops", "어느 건의 비밀번호인지 모르겠어요. 버튼을 다시 눌러 주세요."); return "pin_no_target"; }
  const f = await itemFacts(deps.notify, hit.id);
  const pin = f?.item.state.pin;
  if (!f || !pin || f.item.closedAt) return "pin_no_target";
  if (Date.parse(pin.until) < deps.now()) { await cancelPin(deps, f); await send(deps, "ops", "2분이 지나 취소했어요. 버튼을 다시 눌러 주세요."); return "pin_expired"; }
  const lock = await pinLockedUntil(deps);
  if (lock) { await cancelPin(deps, f); await send(deps, "ops", `비밀번호를 ${BOT_PIN_MAX_FAILURES}번 틀려 ${hm(new Date(lock).toISOString())}까지 잠겼어요.`); return "pin_locked"; }
  if (!adminPinMatches(m.text ?? "", deps.env)) {
    await audit(deps, "bot_pin_failed", `notify:${f.item.id}`, { act: pin.act });
    const after = await pinLockedUntil(deps);
    if (after) { await cancelPin(deps, f); await send(deps, "ops", `비밀번호를 ${BOT_PIN_MAX_FAILURES}번 틀려 30분 동안 잠겼어요.`); return "pin_locked_now"; }
    const times = await pinFailureTimes(deps) ?? [];
    const left = Math.max(BOT_PIN_MAX_FAILURES - times.filter(t => t > deps.now() - BOT_PIN_LOCK_MS).length, 0);
    await send(deps, "ops", `비밀번호가 맞지 않아요. ${left}번 더 틀리면 30분 동안 잠겨요.`, pin.promptId ? { reply_parameters: { message_id: pin.promptId, allow_sending_without_reply: true } } : {});
    return "pin_wrong";
  }
  if (pin.promptId) await deps.tg.call("ops", "deleteMessage", { chat_id: deps.tg.ownerId, message_id: pin.promptId });
  await deps.notify.call("patch_state", { id: f.item.id, remove: ["pin"] });
  const begin = await deps.notify.call("begin_action", { id: f.item.id, action: pin.act === "tk" ? "ticket" : "refund" });
  if (begin.ok !== true) return "busy";
  return pin.act === "tk" ? await ticketBack(deps, f) : await refund(deps, f, pin.target);
}

function targetOrder(f: ItemFacts, target?: string): { orderCode: string | null; amount: number; paymentOrderId: string } | null {
  if (target) { const d = f.duplicates.find(x => x.orderCode === target); return d ? { orderCode: d.orderCode, amount: d.amount, paymentOrderId: d.paymentOrderId } : null; }
  if (f.request?.reason === "double_paid") { const d = duplicateToRefund(f.duplicates); if (d) return { orderCode: d.orderCode, amount: d.amount, paymentOrderId: d.paymentOrderId }; }
  return f.order ? { orderCode: f.order.orderCode, amount: f.order.amount, paymentOrderId: f.order.paymentOrderId } : null;
}
async function restore(deps: BotDeps, f: ItemFacts, note: string): Promise<void> {
  await deps.notify.call("patch_state", { id: f.item.id, remove: ["working", "workingAt"] });
  const g = await itemFacts(deps.notify, f.item.id);
  if (g) { const m = await renderOps(deps, g); await editOps(deps, g.item.messageId, { text: `⚠️ ${esc(note)}\n${m.text}`, buttons: m.buttons }); }
}

/** [환불]: 기존 관리자 환불 그대로(전액·토스 취소 중복 방지 키·증정 이용권 회수·책 열람 차단). 미발행 건이면 먼저 자동 재시도를 멈춘다. */
async function refund(deps: BotDeps, f: ItemFacts, target?: string): Promise<string> {
  const t = targetOrder(f, target);
  if (!t?.orderCode) { await restore(deps, f, "환불할 주문을 찾지 못했어요."); return "refund_no_order"; }
  if (f.item.kind === "unpublished") await deps.notify.call("hold_retry", { paymentOrderId: t.paymentOrderId });
  const r = await runAdminActionAs("refund", { orderCode: t.orderCode, confirmCode: t.orderCode, reason: `처리 봇 · ${reasonLabel(f)}`, ackWarnings: true }, deps.adminId!, deps.admin);
  await audit(deps, "bot_refund", t.orderCode, { notificationId: f.item.id, status: r.status, ok: r.body.ok === true, state: r.body.state ?? null, code: r.body.code ?? null });
  if (r.body.ok === true && r.body.state === "done") {
    const o = (await deps.notify.call("order", { paymentOrderId: t.paymentOrderId })).order as OrderFacts | null;
    if (f.request?.status === "open") await deps.notify.call("resolve_request", { requestId: f.request.id, resolution: "refund" });
    await closeItem(deps, f, o ? refundDoneLine(o, o.refundedAt) : `✅ 환불 완료 ${won(t.amount)} · ${t.orderCode}`);
    return "refund_done";
  }
  if (r.body.state === "failed" || r.body.state === "requested" || r.body.state === "processing" || r.body.code === "TOSS_SECRET_MISSING") {
    // 환불 요청은 저장됐고 자동 재시도가 끝낸다. 끝나면 정리 크론이 이 메시지를 「✅ 환불 완료」로 바꾼다.
    await editOps(deps, f.item.messageId, { text: esc(LINES.refunding(t.orderCode)), buttons: [] });
    return "refund_pending";
  }
  await restore(deps, f, String(r.body.message ?? "환불하지 못했어요."));
  return "refund_rejected";
}
/** [다시 만들기]: 기존 관리자 재생성(결제 책 = 주문 화면, 이용권 책 = 이용권 Book 다시 만들기). 비밀번호는 묻지 않는다. */
async function regenerate(deps: BotDeps, f: ItemFacts, callbackId?: string): Promise<string> {
  const begin = await deps.notify.call("begin_action", { id: f.item.id, action: "regenerate" });
  if (begin.ok !== true) { await toast(deps, callbackId, "이미 처리 중이에요."); return "busy"; }
  const code = f.order?.orderCode ?? "이용권 책";
  const r = f.order?.orderCode ? await runAdminActionAs("regenerate", { orderCode: f.order.orderCode }, deps.adminId!, deps.admin)
    : f.ticket ? await runAdminActionAs("ticket-regenerate", { reportId: f.ticket.reportId }, deps.adminId!, deps.admin) : { status: 404, body: { ok: false, message: "대상을 찾지 못했어요." } };
  await audit(deps, "bot_regenerate", f.order?.orderCode ?? f.ticket?.reportId ?? `notify:${f.item.id}`, { notificationId: f.item.id, ok: r.body.ok === true, code: r.body.code ?? null });
  if (r.body.ok !== true) {
    await deps.notify.call("patch_state", { id: f.item.id, remove: ["working", "workingAt"] });
    await toast(deps, callbackId, String(r.body.message ?? "다시 만들기 요청이 거절됐어요."));
    return "regen_rejected";
  }
  if (!f.order && f.request?.status === "open") await deps.notify.call("resolve_request", { requestId: f.request.id, resolution: "regenerate" });
  await deps.notify.call("patch_state", { id: f.item.id, remove: ["regenFailed", "regenSawActive"], set: { workingAt: new Date(deps.now()).toISOString() } });
  await editOps(deps, f.item.messageId, { text: esc(LINES.regenerating(code)), buttons: [] });
  await toast(deps, callbackId, "다시 만들기를 요청했어요.");
  return "regen_started";
}
/** [안내]: 고객 책 카드에 안내 문구(+ 카카오톡 채널 버튼)를 보인다. */
async function guide(deps: BotDeps, f: ItemFacts, callbackId?: string): Promise<string> {
  if (!f.request) { await toast(deps, callbackId, "문의가 없는 건이에요."); return "guide_no_request"; }
  const begin = await deps.notify.call("begin_action", { id: f.item.id, action: "guide" });
  if (begin.ok !== true) { await toast(deps, callbackId, "이미 처리 중이에요."); return "busy"; }
  await deps.notify.call("resolve_request", { requestId: f.request.id, resolution: "guide" });
  await audit(deps, "bot_guide", f.order?.orderCode ?? f.ticket?.reportId ?? `notify:${f.item.id}`, { notificationId: f.item.id, requestId: f.request.id });
  await closeItem(deps, f, LINES.guided(f.order?.orderCode ?? "이용권 책", new Date(deps.now()).toISOString()));
  await toast(deps, callbackId, "안내를 보냈어요.");
  return "guided";
}
/** [이용권 돌려주기]: 기존 관리자 수동 지급(1장, 발급일 + 30일). 같은 메시지는 한 번만 지급(같은 key). */
async function ticketBack(deps: BotDeps, f: ItemFacts): Promise<string> {
  const user = f.ticket?.userId;
  if (!user) { await restore(deps, f, "이용권을 돌려줄 계정을 찾지 못했어요."); return "ticket_no_user"; }
  const r = await grantTickets(deps.db, user, { quantity: 1, sourceRef: `admin:ticket:${f.ticket!.reportId}:${f.item.id}`, key: `admin:bot-${f.item.id}` });
  await audit(deps, "grant_ticket", f.ticket!.reportId, { notificationId: f.item.id, userId: user, quantity: 1, ok: r.ok === true, ...(typeof r.grantId === "string" ? { grantId: r.grantId } : {}) });
  if (r.ok !== true) { await restore(deps, f, "이용권을 지급하지 못했어요."); return "ticket_failed"; }
  if (f.request?.status === "open") await deps.notify.call("resolve_request", { requestId: f.request.id, resolution: "ticket" });
  await closeItem(deps, f, LINES.ticketBack("이용권 책", new Date(deps.now()).toISOString()));
  return "ticket_back";
}

/** 버튼 동작 뒤 바로 한 번 정리(크론을 기다리지 않게). */
export async function reconcileOne(deps: BotDeps, id: number): Promise<string> {
  const f = await itemFacts(deps.notify, id);
  return f ? reconcileItem(deps, f) : "missing";
}
