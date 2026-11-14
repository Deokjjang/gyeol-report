import { MODEL_OPTIONS, anthropicDriver } from "../llm/providers";
import { OFFICIAL_TARGET } from "./generation/policy";

/**
 * W4 Q0 AI 상태 확인(1분 크론 ops-notify): 작가 모델에 아주 작은 요청 1번 → 결과 분류 → ops_sales('health')가 멈춤·재개를 정한다.
 * - 요청: max_tokens 1, 작가와 같은 생각 설정(Sonnet 5.5 = thinking between_tools). 공식 문서(build-with-claude/thinking, 11-15 확인):
 *   between_tools는 Sonnet 5.5의 가장 낮은 생각 설정(「turns off up-front thinking」, effort high 이하)이고,
 *   max_tokens는 생각까지 포함한 엄격한 상한(「max_tokens, which includes all thinking … is enforced as a strict limit」) → 출력은 늘 1토큰 이하.
 * - 이 호출은 생성 기록(book_generation_runs)·비용 원장·실패율 경보에 들어가지 않는다(작가 경로·감독을 거치지 않음). 결과는 ops_settings 'ai_health' 한 행뿐.
 * - 비용(가격표 $2 입력 · $10 출력 / 100만 토큰): 1번 ≈ 입력 8토큰 + 출력 1토큰 ≈ $0.000026 → 한 달(43,200번) ≈ $1.1.
 */
export const AI_HEALTH = { maxTokens: 1, timeoutMs: 20_000, prompt: "ok" } as const;
/** Anthropic 잔액·결제(문서: 402 billing_error, 400 = 지출 한도 도달, 「credit balance is too low」). 작가 경로 watchFetch(sinks.ts)와 같이 쓴다. */
export const ANTHROPIC_CREDIT = /credit balance is too low|billing_error|spend limit/i;
/** Anthropic 인증·권한(문서: 401 authentication_error, 403 permission_error). */
export const ANTHROPIC_AUTH = /authentication_error|permission_error/;
/** 장애 표지(529 overloaded_error·500 api_error). */
const OUTAGE = /overloaded_error|api_error/;

export type HealthResult = "ok" | "billing" | "auth" | "outage" | "other";
export type HealthProbe = { status: number | null; body: string; error?: "timeout" | "network" | null; ms: number };

/**
 * 결과 분류(순수 함수). 잔액·인증이 장애보다 먼저 — 지출 상한 429·400도 본문으로 잔액으로 본다.
 * 장애 = 529·5xx·429·과부하·시간 초과·끊김(작가 연결 분류와 같은 범위). 그 밖의 4xx(요청 형식 오류·모델 없음 등) = other(멈추지도 열지도 않음).
 */
export function classifyHealth(p: HealthProbe): HealthResult {
  if (p.error) return "outage";
  const s = p.status ?? 0, body = p.body ?? "";
  if (s >= 200 && s < 300) return "ok";
  if (s === 402 || ANTHROPIC_CREDIT.test(body)) return "billing";
  if (s === 401 || s === 403 || ANTHROPIC_AUTH.test(body)) return "auth";
  if (s === 429 || s >= 500 || OUTAGE.test(body)) return "outage";
  return "other";
}

/** 작가 모델에 작은 요청 1번(스트림 없음). 키는 헤더로만 — 기록·로그에 남기지 않는다. 본문은 분류용으로 앞 2,000자만. */
export async function probeWriter(opts: { fetchImpl?: typeof fetch; apiKey: string; model?: string; timeoutMs?: number; now?: () => number }): Promise<HealthProbe> {
  const model = opts.model ?? OFFICIAL_TARGET.model, now = opts.now ?? Date.now, t0 = now();
  const thinking = (MODEL_OPTIONS[model] as { thinking?: unknown } | undefined)?.thinking;
  const body = JSON.stringify({ model, max_tokens: AI_HEALTH.maxTokens, messages: [{ role: "user", content: AI_HEALTH.prompt }], ...(thinking ? { thinking } : {}) });
  const abort = new AbortController();
  const timer = setTimeout(() => abort.abort(), opts.timeoutMs ?? AI_HEALTH.timeoutMs);
  try {
    const res = await (opts.fetchImpl ?? fetch)(anthropicDriver.endpoint, { method: "POST", headers: anthropicDriver.headers(opts.apiKey), body, signal: abort.signal, cache: "no-store" });
    const text = (await res.text().catch(() => "")).slice(0, 2_000);
    return { status: res.status, body: text, error: null, ms: now() - t0 };
  } catch (e) {
    return { status: null, body: "", error: abort.signal.aborted || (e as { name?: string })?.name === "AbortError" ? "timeout" : "network", ms: now() - t0 };
  } finally { clearTimeout(timer); }
}

export type SalesRpc = (action: string, data: Record<string, unknown>) => Promise<Record<string, unknown>>;
type Send = (text: string, extra?: Record<string, unknown>) => Promise<unknown>;
export type HealthChange = { changed: "paused" | "resumed" | "escalated"; reason: string; from: string | null; status: number | null; result: HealthResult };
export type HealthCycle = { result: HealthResult | "skipped"; status: number | null; ms: number; changed: HealthChange["changed"] | null };

/**
 * 한 번 확인: 요청 → 분류 → ops_sales('health') → 바뀌었으면(멈춤·재개·이유 올림) 처리 봇에 한 줄.
 * 같은 상태는 SQL이 changed=null로 돌려줘 다시 알리지 않는다. 키가 없으면 부르지 않는다(skipped — 판매 상태를 바꾸지 않음).
 */
export async function runAiHealth(deps: { rpc: SalesRpc; send: Send; probe?: () => Promise<HealthProbe>; apiKey?: string | null; fetchImpl?: typeof fetch; text: (c: HealthChange) => { text: string; extra?: Record<string, unknown> } }): Promise<HealthCycle> {
  const key = deps.apiKey ?? null;
  if (!deps.probe && !key) return { result: "skipped", status: null, ms: 0, changed: null };
  const p = deps.probe ? await deps.probe() : await probeWriter({ apiKey: key as string, fetchImpl: deps.fetchImpl });
  const result = classifyHealth(p);
  const r = await deps.rpc("health", { result, ...(p.status !== null ? { status: p.status } : {}) });
  const changed = r.ok === true && (r.changed === "paused" || r.changed === "resumed" || r.changed === "escalated") ? r.changed : null;
  if (changed) {
    const m = deps.text({ changed, reason: typeof r.reason === "string" ? r.reason : "", from: typeof r.from === "string" ? r.from : null, status: p.status, result });
    try { await deps.send(m.text, m.extra); } catch { /* 알림 실패는 무시(상태는 이미 바뀜 — /sales로 보인다) */ }
  }
  return { result, status: p.status, ms: p.ms, changed };
}

/**
 * 1분 크론(ops-notify, 운영 배포에서만) 한 번: 판매 스위치 저장소(ops_sales) + 처리 봇. 알림 한 줄에는 지금 상태 버튼(멈춤이면 [다시 열기])을 붙인다.
 * 실패는 삼킨다(크론의 다른 일을 막지 않음).
 */
export async function cronAiHealth(deps: { sales?: { call(action: string, data: Record<string, unknown>): Promise<Record<string, unknown>> } | null; tg: { configured(bot: "ops"): boolean; ownerId: string | null; call(bot: "ops", method: string, body: Record<string, unknown>): Promise<unknown> } },
  env: Record<string, string | undefined> = process.env, opts: { probe?: () => Promise<HealthProbe>; fetchImpl?: typeof fetch } = {}): Promise<HealthCycle | null> {
  try {
    const sales = deps.sales;
    if (!sales) return null;
    const { aiHealthText, salesButtons } = await import("./notify/render");
    return await runAiHealth({
      rpc: (a, d) => sales.call(a, d), apiKey: env.ANTHROPIC_API_KEY?.trim() || null, probe: opts.probe, fetchImpl: opts.fetchImpl,
      send: async (text, extra = {}) => deps.tg.configured("ops") && deps.tg.ownerId ? deps.tg.call("ops", "sendMessage", { chat_id: deps.tg.ownerId, text, parse_mode: "HTML", disable_web_page_preview: true, ...extra }) : null,
      text: c => ({ text: aiHealthText(c), extra: { reply_markup: { inline_keyboard: salesButtons(c.changed !== "resumed") } } }),
    });
  } catch { return null; }
}
