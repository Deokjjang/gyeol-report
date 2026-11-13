/**
 * 생성 운영 알림(HOTFIX-W1 3부 1·3·6). 문구 만들기는 순수 함수(시험), 보내기는 처리 봇(📮)으로 바로(대기표 종류를 늘리지 않으려 — migration 없음).
 * - 보류 즉시 알림: 「보류 — 환불 또는 대기 결정 필요」 + 실패 한 줄 + 관리자 주문 화면 주소.
 * - 실패율 경보: 같은 상품에서 1시간 안에 생각 소진 2건 이상, 또는 그날(KST) 실패율이 선을 넘으면 「판매 일시 중지 검토」. 판매는 멈추지 않는다(결정은 덕짱님).
 *   상태를 따로 저장하지 않고 「이번 기록으로 선을 막 넘었을 때」만 보낸다(같은 경보를 매번 다시 보내지 않게).
 */
import type { SupabaseClient } from "@supabase/supabase-js";
import type { CallLog } from "../../writer/runner";
import { exhaustedCall, orderCostCap, spentOf } from "./policy";

const won = (usd: number) => `$${usd.toFixed(2)}`;
const KST = 9 * 3_600_000;
export const hmKst = (iso: string | number | null | undefined) => {
  const t = typeof iso === "number" ? iso : iso ? Date.parse(iso) : NaN;
  if (!Number.isFinite(t)) return "-";
  const d = new Date(t + KST);
  return `${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")} ${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}`;
};
const esc = (s: string) => s.replace(/[&<>]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c]!);

export const CLASS_LABEL: Readonly<Record<string, string>> = { thinking_exhausted: "생각 소진", connection: "연결", other: "기타", cost_cap: "비용 상한" };
const PRODUCT_LABEL: Readonly<Record<string, string>> = { saju_mbti_full: "종합", career_money_study: "커리어·돈·공부", love_marriage_child: "연애·결혼·자녀", saju_mbti_compatibility: "궁합", major_fortune: "대운", annual_fortune: "세운" };
export const productLabel = (p: string | null | undefined) => PRODUCT_LABEL[p ?? ""] ?? (p || "상품 미상");

/** 실패 한 줄(3부 1): 실패 분류 · 몇 단 · 다음 자동 시도 시각 · 지금까지 쓴 비용. */
export function failureLine(a: { cls?: string | null; stage?: number | null; nextAt?: string | number | null; spentUsd: number; capUsd?: number }): string {
  const cls = CLASS_LABEL[a.cls ?? ""] ?? "기타";
  const stage = a.stage ? `${a.stage}단` : "단계 없음";
  const next = a.nextAt ? `다음 자동 시도 ${hmKst(a.nextAt)}` : "다음 자동 시도 없음";
  return `${cls} · ${stage} · ${next} · 지금까지 ${won(a.spentUsd)}${a.capUsd ? `(상한 ${won(a.capUsd)})` : ""}`;
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

/** 보류 즉시 알림(3부 3). */
export function holdText(a: { orderCode: string | null; origin: "paid" | "ticket"; product: string | null; line: string; why: string; test?: boolean }): string {
  return [`${a.test ? "🧪 시험(집계 제외) · " : ""}⏸ <b>보류 — 환불 또는 대기 결정 필요</b> · ${esc(a.orderCode ?? (a.origin === "ticket" ? "이용권 책" : "-"))}`,
    `${esc(productLabel(a.product))} · ${esc(a.why)}`, esc(a.line),
    a.orderCode ? ADMIN_ORDER_URL(a.orderCode) : ADMIN_DELAYED_URL].join("\n");
}

/** 실패율 경보 선(3부 6, 결정 대기 — 기본값). */
export const RATE_ALERT = { exhaustedPerHour: 2, dayFailRate: 0.3, dayMinFails: 3 } as const;
export type RunLite = { readonly report_id: string; readonly outcome: string; readonly created_at: string; readonly calls?: unknown; readonly product: string | null };
const failedOutcome = (o: string) => o === "deferred" || o === "gave_up";
const counted = (o: string) => failedOutcome(o) || o === "published" || o === "replaced";
const thinkingRun = (r: RunLite) => Array.isArray(r.calls) && (r.calls as { cls?: string }[]).some(c => c?.cls === "thinking_exhausted");

/**
 * 이번 기록(latest)으로 선을 막 넘었는지(3부 6). runs: 최근 기록(latest 포함, 상품 붙임). dayStart: 그날 KST 0시(ms).
 * 1시간 생각 소진: latest가 생각 소진이고 1시간 안 생각 소진 수가 정확히 기준값이 됐을 때. 하루 실패율: latest가 실패이고, 넣기 전엔 선 아래·넣은 뒤 선 위일 때.
 */
export function rateAlert(runs: readonly RunLite[], latest: RunLite, now: number, dayStart: number): string | null {
  const same = runs.filter(r => r.product === latest.product);
  const reasons: string[] = [];
  if (thinkingRun(latest)) {
    const hour = same.filter(r => thinkingRun(r) && now - Date.parse(r.created_at) <= 3_600_000).length;
    if (hour === RATE_ALERT.exhaustedPerHour) reasons.push(`최근 1시간 생각 소진 ${hour}건`);
  }
  if (failedOutcome(latest.outcome)) {
    const day = same.filter(r => counted(r.outcome) && Date.parse(r.created_at) >= dayStart);
    const fails = day.filter(r => failedOutcome(r.outcome)).length, total = day.length;
    const before = { fails: fails - 1, total: total - 1 };
    const over = (f: number, t: number) => f >= RATE_ALERT.dayMinFails && t > 0 && f / t > RATE_ALERT.dayFailRate;
    if (over(fails, total) && !over(before.fails, before.total)) reasons.push(`오늘 실패율 ${Math.round((fails / total) * 100)}%(실패 ${fails} / 시도 ${total})`);
  }
  if (!reasons.length) return null;
  return [`🚨 <b>판매 일시 중지 검토</b> · ${esc(productLabel(latest.product))}`, ...reasons.map(esc), "판매는 자동으로 멈추지 않아요. 지연 목록: " + ADMIN_DELAYED_URL].join("\n");
}

export type GenerationAlerts = {
  /** 보류가 정해지면 바로(3부 3). */
  hold(a: { reportId: string; origin: "paid" | "ticket"; originRef: string; product: string | null; line: string; why: string }): Promise<void>;
  /** 실패 기록 뒤(3부 6). */
  failed(a: { reportId: string; product: string | null }): Promise<void>;
};

/** 운영 알림(서비스 롤 DB + 처리 봇). 실패는 삼킨다(알림이 생성·발행을 막지 않는다). */
export function createGenerationAlerts(db: SupabaseClient, send: (text: string) => Promise<unknown>, now: () => number = Date.now): GenerationAlerts {
  const orderCodeOf = async (paymentOrderId: string) => {
    try { const { data } = await db.from("order_records").select("order_code").eq("payment_order_id", paymentOrderId).maybeSingle(); return typeof data?.order_code === "string" ? data.order_code : null; } catch { return null; }
  };
  return {
    async hold(a) {
      try {
        const code = a.origin === "paid" ? await orderCodeOf(a.originRef) : null;
        await send(holdText({ orderCode: code, origin: a.origin, product: a.product, line: a.line, why: a.why }));
      } catch { /* 알림 실패는 무시 */ }
    },
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
        if (text) await send(text);
      } catch { /* 알림 실패는 무시 */ }
    },
  };
}

/** 운영 처리 봇으로 보내기(토큰·주인 id는 telegram.ts 안에서만). */
export async function opsBotSender(): Promise<(text: string) => Promise<unknown>> {
  const { createTelegram } = await import("../notify/telegram");
  const tg = createTelegram();
  return async (text: string) => (tg.configured("ops") && tg.ownerId ? tg.call("ops", "sendMessage", { chat_id: tg.ownerId, text, parse_mode: "HTML", disable_web_page_preview: true }) : null);
}
