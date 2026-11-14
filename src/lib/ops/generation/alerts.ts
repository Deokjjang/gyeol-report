/**
 * 생성 운영 알림(HOTFIX-W1 3부 1·3·6, W3 P2). 문구 만들기는 순수 함수(시험), 보내기는 처리 봇(📮)으로 바로(대기표 종류를 늘리지 않으려 — migration 없음).
 * - W3 P2: 보류 알림은 없앴다(보류 상태가 없다). 결론(자동 환불·이용권 반환)마다 「↩️ 자동 환불 · GR-… · 사유 · 비용」 한 줄, 그날 자동 결론이 선(3건)을 막 넘으면 경보 1번.
 * - 실패율 경보: 같은 상품에서 1시간 안에 생각 소진 2건 이상, 또는 그날(KST) 실패율이 선을 넘으면 「판매 일시 중지 검토」 + [4종 멈춤] 버튼. 이 경보로는 멈추지 않는다.
 *   상태를 따로 저장하지 않고 「이번 기록으로 선을 막 넘었을 때」만 보낸다(같은 경보를 매번 다시 보내지 않게).
 * - W3 P0 자동 멈춤: 연결 오류(429·5xx·529·과부하·끊김·시간 초과 — 작가 호출 cls=connection)로 실패한 주문이 10분 안에 3건이면 4종 판매를 멈추고 알린다.
 *   마지막으로 다시 연 뒤의 실패만 센다. 다시 여는 것은 처리 봇 버튼으로만. 생각 소진 등 다른 실패는 위 경보(알림)만.
 * - W3 P0 Anthropic 잔액/인증 경보: 1시간 1번(OpenAI 잔액 경보 api_credit과 쿨다운 따로) + 판매 자동 멈춤(ops_sales 'alarm').
 */
import type { SupabaseClient } from "@supabase/supabase-js";
import type { CallLog } from "../../writer/runner";
import { exhaustedCall, orderCostCap, spentOf } from "./policy";
import type { OpsStore } from "./sinks";
import { anthropicAlarmText, salesAutoPauseText, salesButtons } from "../notify/render";

const won = (usd: number) => `$${usd.toFixed(2)}`;
const KST = 9 * 3_600_000;
export const hmKst = (iso: string | number | null | undefined) => {
  const t = typeof iso === "number" ? iso : iso ? Date.parse(iso) : NaN;
  if (!Number.isFinite(t)) return "-";
  const d = new Date(t + KST);
  return `${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")} ${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}`;
};
const esc = (s: string) => s.replace(/[&<>]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c]!);

export const CLASS_LABEL: Readonly<Record<string, string>> = { thinking_exhausted: "생각 소진", connection: "연결", other: "기타", cost_cap: "비용 상한", check: "검사 탈락", credit_auth: "잔액·인증", deadline: "시간 끝" };
const PRODUCT_LABEL: Readonly<Record<string, string>> = { saju_mbti_full: "종합", career_money_study: "커리어·돈·공부", love_marriage_child: "연애·결혼·자녀", saju_mbti_compatibility: "궁합", major_fortune: "대운", annual_fortune: "세운" };
export const productLabel = (p: string | null | undefined) => PRODUCT_LABEL[p ?? ""] ?? (p || "상품 미상");

/** 실패 한 줄(3부 1): 실패 분류 · 몇 단 · 다음 자동 시도 시각 · 지금까지 쓴 비용. */
export function failureLine(a: { cls?: string | null; stage?: number | null; nextAt?: string | number | null; spentUsd: number; capUsd?: number }): string {
  const cls = CLASS_LABEL[a.cls ?? ""] ?? "기타";
  // W3 P2: 단계(1단·2단)는 생각 소진일 때만 뜻이 있다 — 연결 오류에 「1단」을 붙이지 않는다.
  const stage = a.cls === "thinking_exhausted" ? (a.stage ? ` · ${a.stage}단` : " · 단계 없음") : "";
  const next = a.nextAt ? `다음 자동 시도 ${hmKst(a.nextAt)}` : "다음 자동 시도 없음";
  return `${cls}${stage} · ${next} · 지금까지 ${won(a.spentUsd)}${a.capUsd ? `(상한 ${won(a.capUsd)})` : ""}`;
}

/**
 * 지난 기록으로 실패 한 줄을 만든다(3부 1, 30분 「책이 안 나왔어요」 알림에 붙인다). 마지막 실패 시도의 마지막 작가 호출로 분류·단계를 정한다.
 * 옛 기록(분류 없음)은 length + 글자 0이면 생각 소진(옛 한도 = 0단).
 */
export function generationLineOf(runs: readonly { outcome?: string; cost_usd?: number | string | null; created_at?: string | null; calls?: unknown; reason?: string | null }[], state: { next_at?: string | null } | null, product: string | null): string | null {
  const failed = [...runs].reverse().find(r => r.outcome === "deferred" || r.outcome === "gave_up");
  if (!failed) return null;
  const calls = (Array.isArray(failed.calls) ? failed.calls : []) as Partial<CallLog>[];
  const w = [...calls].reverse().find(c => c.kind === "first" || c.kind === "continuation" || c.kind === "retry" || c.kind === "fallback");
  const ex = w ? exhaustedCall(w) : null;
  const capHit = /cost_cap/.test(failed.reason ?? "") || w?.error === "cost_cap";
  const cls = capHit ? "cost_cap" : ex || /thinking_exhausted/.test(failed.reason ?? "") ? "thinking_exhausted" : w?.cls ?? (w?.error ? "connection" : "other");
  const stage = ex ? ex.stage : w?.stage ?? null;
  const line = failureLine({ cls, stage: stage || null, nextAt: state?.next_at ?? null, spentUsd: spentOf(runs as never), capUsd: orderCostCap(product) });
  return ex && ex.stage === 0 ? line.replace("단계 없음", "옛 한도") : line;
}

export const ADMIN_ORDER_URL = (code: string) => `https://www.gyeolreport.com/admin/orders/${encodeURIComponent(code)}`;
export const ADMIN_DELAYED_URL = "https://www.gyeolreport.com/admin/orders?tab=delayed";

/** 실패율 경보 선(3부 6, 결정 대기 — 기본값). */
export const RATE_ALERT = { exhaustedPerHour: 2, dayFailRate: 0.3, dayMinFails: 3 } as const;
export type RunLite = { readonly report_id: string; readonly outcome: string; readonly created_at: string; readonly calls?: unknown; readonly product: string | null };
const failedOutcome = (o: string) => o === "deferred" || o === "gave_up";
const counted = (o: string) => failedOutcome(o) || o === "published" || o === "replaced";
const thinkingRun = (r: RunLite) => Array.isArray(r.calls) && (r.calls as { cls?: string }[]).some(c => c?.cls === "thinking_exhausted");

/**
 * 이번 기록(latest)으로 선을 막 넘었는지(3부 6). runs: 최근 기록(latest 포함, 상품 붙임). dayStart: 그날 KST 0시(ms).
 * W3 P2: 모두 주문(책) 단위로 센다 — 한 주문의 시도 여러 번은 1건(예전에는 시도 수라 한 주문의 재시도 3번에 경보가 떴다).
 * 1시간 생각 소진: latest가 생각 소진이고 1시간 안 생각 소진 주문 수가 정확히 기준값이 됐을 때.
 * 하루 실패율: latest가 실패이고, 그날 주문 중 실패가 있었던 주문의 비율이 이번 기록으로 막 선을 넘었을 때(그 주문이 이미 실패로 세어졌으면 새로 넘지 않는다).
 */
export function rateAlert(runs: readonly RunLite[], latest: RunLite, now: number, dayStart: number): string | null {
  const same = runs.filter(r => r.product === latest.product);
  const reasons: string[] = [];
  const orders = (rs: readonly RunLite[]) => new Set(rs.map(r => r.report_id)).size;
  if (thinkingRun(latest)) {
    const hourRuns = same.filter(r => thinkingRun(r) && now - Date.parse(r.created_at) <= 3_600_000);
    const hour = orders(hourRuns), before = orders(hourRuns.filter(r => r !== latest));
    if (hour === RATE_ALERT.exhaustedPerHour && before < hour) reasons.push(`최근 1시간 생각 소진 ${hour}건`);
  }
  if (failedOutcome(latest.outcome)) {
    const day = same.filter(r => counted(r.outcome) && Date.parse(r.created_at) >= dayStart);
    const failedOrders = new Set(day.filter(r => failedOutcome(r.outcome)).map(r => r.report_id));
    const fails = failedOrders.size, total = orders(day);
    const wasFailed = day.some(r => r !== latest && r.report_id === latest.report_id && failedOutcome(r.outcome));
    const before = wasFailed ? { fails, total } : { fails: fails - 1, total: day.some(r => r !== latest && r.report_id === latest.report_id) ? total : total - 1 };
    const over = (f: number, t: number) => f >= RATE_ALERT.dayMinFails && t > 0 && f / t > RATE_ALERT.dayFailRate;
    if (over(fails, total) && !over(before.fails, before.total)) reasons.push(`오늘 실패율 ${Math.round((fails / total) * 100)}%(실패 ${fails} / 시도 ${total})`);
  }
  if (!reasons.length) return null;
  return [`🚨 <b>판매 일시 중지 검토</b> · ${esc(productLabel(latest.product))}`, ...reasons.map(esc), "이 경보로는 판매가 멈추지 않아요(연결 오류 연속만 자동 멈춤). 멈추려면 [4종 멈춤]. 지연 목록: " + ADMIN_DELAYED_URL].join("\n");
}

/** W3 P0 자동 멈춤 선: 연결 오류로 실패한 주문(책) 수 / 창. */
export const AUTO_PAUSE = { connectionOrders: 3, windowMs: 10 * 60_000 } as const;
/** 연결 오류로 실패한 시도인가: 실패(deferred·gave_up)이고 작가 호출 중 하나가 연결 분류(cls=connection). */
export const connectionRun = (r: RunLite) => failedOutcome(r.outcome) && Array.isArray(r.calls) && (r.calls as { cls?: string }[]).some(c => c?.cls === "connection");
/**
 * 자동 멈춤을 걸 때인가(순수 함수). since = max(지금 − 10분, 마지막으로 다시 연 시각). 주문 수는 책(report_id) 단위로 센다(한 주문의 시도 여러 번은 1건).
 */
export function autoPauseCheck(runs: readonly RunLite[], now: number, resumedAt: number | null = null): { pause: boolean; count: number; products: string[] } {
  const since = Math.max(now - AUTO_PAUSE.windowMs, resumedAt ?? -Infinity);
  const hit = runs.filter(r => connectionRun(r) && Date.parse(r.created_at) >= since && Date.parse(r.created_at) <= now);
  const ids = new Map<string, string | null>();
  for (const r of hit) ids.set(r.report_id, r.product);
  const products = [...new Set([...ids.values()].map(productLabel))];
  return { pause: ids.size >= AUTO_PAUSE.connectionOrders, count: ids.size, products };
}
type SalesRpc = (action: string, data: Record<string, unknown>) => Promise<Record<string, unknown>>;
const salesRpcOf = (db: SupabaseClient): SalesRpc => async (action, data) => {
  const { data: r, error } = await db.rpc("ops_sales", { p_action: action, p_data: data });
  return !error && r && typeof r === "object" ? r as Record<string, unknown> : { ok: false };
};
type Send = (text: string, extra?: Record<string, unknown>) => Promise<unknown>;
const resumeKeyboard = { reply_markup: { inline_keyboard: salesButtons(true) } };
/** 자동 멈춤: 선을 넘었고 지금 판매 중이면 멈춘다(SQL이 바뀔 때만 changed — 여러 워커가 겹쳐도 알림 1번). */
export async function maybeAutoPause(rpc: SalesRpc, send: Send, runs: readonly RunLite[], now: number): Promise<boolean> {
  const st = await rpc("status", {});
  if (st.ok !== true || st.on === true) return false;
  const resumedAt = typeof st.at === "string" ? Date.parse(st.at) : NaN;
  const c = autoPauseCheck(runs, now, Number.isFinite(resumedAt) ? resumedAt : null);
  if (!c.pause) return false;
  const r = await rpc("pause", { by: "auto", reason: "connection", detail: { count: c.count, windowMin: AUTO_PAUSE.windowMs / 60_000 } });
  if (r.ok !== true || r.changed !== true) return false;
  await send(salesAutoPauseText({ count: c.count, windowMin: AUTO_PAUSE.windowMs / 60_000, products: c.products }), resumeKeyboard);
  return true;
}
/** Anthropic 잔액/인증 경보 + 판매 자동 멈춤(1시간 1번은 SQL이 정한다). */
export async function anthropicAlarm(rpc: SalesRpc, send: Send, code: "anthropic_credit" | "anthropic_auth"): Promise<boolean> {
  const r = await rpc("alarm", { code });
  if (r.ok !== true || r.alerted !== true) return false;
  await send(anthropicAlarmText({ code, paused: r.paused === true }), resumeKeyboard);
  return true;
}
/**
 * 작가 호출 잔액·인증 경보 받는 곳(감독 creditAlert). Anthropic은 위 경보(판매 멈춤 포함), OpenAI는 예전 그대로 처리 봇 대기표(api_credit, 1시간 1번).
 */
export function creditAlerter(db: SupabaseClient, send: Send, signup?: OpsStore | null) {
  const rpc = salesRpcOf(db);
  return async (code: string): Promise<unknown> => {
    if (code === "anthropic_credit" || code === "anthropic_auth") return anthropicAlarm(rpc, send, code);
    return signup ? signup.call("credit_alert", { code }) : null;
  };
}

export type GenerationAlerts = {
  /** 실패 기록 뒤(3부 6) — 실패율 경보·연결 오류 자동 멈춤. */
  failed(a: { reportId: string; product: string | null }): Promise<void>;
};

/** W3 P2 결론 한 줄 재료(결제 자동 환불 · 이용권 반환 · 마감 청소). */
export type ConclusionNote = { readonly origin: "paid" | "ticket"; readonly reportId: string; readonly paymentOrderId: string | null; readonly product: string | null; readonly cls: string | null; readonly spentUsd: number; readonly reason?: string; readonly sweep?: boolean };
/** 하루 자동 결론(환불 + 이용권 반환) 경보 선(오판 방지): 그날 KST 이 수에 막 닿으면 한 번. */
export const AUTO_CONCLUSION_DAILY_ALERT = 3;
/** 「↩️ 자동 환불 · GR-… · 종합 · 생각 소진 · $0.71」 / 「↩️ 이용권 반환 · 이용권 책 · …」. */
export function conclusionText(n: ConclusionNote, orderCode: string | null): string {
  const what = n.origin === "paid" ? "자동 환불" : "이용권 반환";
  const why = CLASS_LABEL[n.cls ?? ""] ?? (n.cls || "기타");
  return `↩️ <b>${what}</b> · ${esc(orderCode ?? (n.origin === "ticket" ? "이용권 책" : "-"))} · ${esc(productLabel(n.product))} · ${esc(why)}${n.sweep ? " · 마감 청소" : ""} · ${won(n.spentUsd)}`;
}
export function dailyConclusionText(count: number): string {
  return [`🚨 <b>오늘 자동 결론 ${count}건</b>(자동 환불 + 이용권 반환)`, "같은 원인이 겹치는지 확인해 주세요. 계속 늘면 [4종 멈춤]을 눌러 주세요.", ADMIN_DELAYED_URL].join("\n");
}
/** 결론 한 줄 + (그날 자동 결론이 선에 막 닿으면) 경보. 실패는 삼킨다. */
export async function conclusionAlert(db: SupabaseClient, send: Send, n: ConclusionNote, now: () => number = Date.now): Promise<void> {
  try {
    let code: string | null = null;
    if (n.paymentOrderId) { const { data } = await db.from("order_records").select("order_code").eq("payment_order_id", n.paymentOrderId).maybeSingle(); code = typeof data?.order_code === "string" ? data.order_code : null; }
    await send(conclusionText(n, code));
    const t = now(), d = new Date(t + KST), dayStart = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()) - KST).toISOString();
    const [{ count: refunds }, { count: returns }] = await Promise.all([
      db.from("order_refunds").select("payment_order_id", { count: "exact", head: true }).eq("source", "auto").gte("created_at", dayStart),
      db.from("report_ticket_ledger").select("id", { count: "exact", head: true }).eq("event_type", "REVERSAL").gte("created_at", dayStart),
    ]);
    const total = (refunds ?? 0) + (returns ?? 0);
    if (total === AUTO_CONCLUSION_DAILY_ALERT) await send(dailyConclusionText(total));
  } catch { /* 알림 실패는 무시 */ }
}

/** 운영 알림(서비스 롤 DB + 처리 봇). 실패는 삼킨다(알림이 생성·발행을 막지 않는다). */
export function createGenerationAlerts(db: SupabaseClient, send: Send, now: () => number = Date.now): GenerationAlerts {
  return {
    async failed(a) {
      try {
        const t = now(), d = new Date(t + KST), dayStart = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()) - KST;
        const { data: runs } = await db.from("book_generation_runs").select("report_id,outcome,created_at,calls").gte("created_at", new Date(Math.min(dayStart, t - 3_600_000)).toISOString()).order("id", { ascending: true }).limit(500);
        if (!runs?.length) return;
        const ids = [...new Set(runs.map(r => String(r.report_id)))];
        const { data: snaps } = await db.from("paid_report_snapshots").select("report_id,product_type").in("report_id", ids);
        const prod = new Map((snaps ?? []).map(s => [String(s.report_id), typeof s.product_type === "string" ? s.product_type : null]));
        const lite: RunLite[] = runs.map(r => ({ report_id: String(r.report_id), outcome: String(r.outcome), created_at: String(r.created_at), calls: r.calls, product: prod.get(String(r.report_id)) ?? null }));
        const latest = [...lite].reverse().find(r => r.report_id === a.reportId);
        if (!latest) return;
        const text = rateAlert(lite, { ...latest, product: latest.product ?? a.product }, t, dayStart);
        if (text) await send(text, { reply_markup: { inline_keyboard: salesButtons(false) } });
        // W3 P0: 연결 오류 연속이면 4종 자동 멈춤(다시 열기는 버튼으로만).
        if (connectionRun({ ...latest, product: latest.product ?? a.product })) { try { await maybeAutoPause(salesRpcOf(db), send, lite, t); } catch { /* 무시 */ } }
      } catch { /* 알림 실패는 무시 */ }
    },
  };
}

/** 운영 처리 봇으로 보내기(토큰·주인 id는 telegram.ts 안에서만). */
export async function opsBotSender(): Promise<Send> {
  const { createTelegram } = await import("../notify/telegram");
  const tg = createTelegram();
  return async (text: string, extra: Record<string, unknown> = {}) => (tg.configured("ops") && tg.ownerId ? tg.call("ops", "sendMessage", { chat_id: tg.ownerId, text, parse_mode: "HTML", disable_web_page_preview: true, ...extra }) : null);
}
