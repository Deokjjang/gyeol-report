/**
 * 생성 감독(P6d-ops 7). 책 생성 진입 함수(buildV5Snapshot)는 호출만 하고, deps로 모델·대체·fetch만 정한다.
 * - 정식본: Sonnet만(대체 모델 없음). 결정론 장이 하나라도 있으면 내보내지 않고 시간표대로 다시 시도한다.
 * - 임시본: Sonnet이 첫 실패부터 2시간 넘게 실패하고 OpenAI를 쓸 수 있을 때만 terra로, "임시본" 표시. 이후 교체 레인이 Sonnet 정식본으로 바꾼다.
 * - OpenAI 잔액 부족을 보면 OpenAI 경로를 끈다(llm_provider_switch).
 * - 모든 시도·비용·사유는 book_generation_runs에, 상태는 book_generation_state에.
 * 최종판 0-1: 작가 원고가 나오면 그 책은 완성본이 된다(짧은 장도 버리지 않음). 다시 시도하는 것은 출력 전 실패·중간 끊김뿐이고, 다음 시도는 저장된 장 다음부터 빠진 장만 이어 쓴다.
 * 최종판 0-6: 주문당 비용 상한(orderCostCap, 기본 $0.60) — 지난 시도들의 비용 합이 상한에 이르면 부르지 않고 보류(hold): 관리자 "지연" 목록에 사유(cost_cap)와 함께 남는다(자동 환불 없음).
 * 최종판 0-2: 교체 레인은 저장된 Book의 원문(meta.raw)을 저장소로 넘긴다(같은 입력이면 다시 부르지 않는다).
 */
import type { ReportInputPayload } from "../../report-generation/reportInputTypes";
import type { WriterMeta } from "../../writer/book";
import type { PriorBooks } from "../../writer/prior";
import type { buildV5Snapshot, V5BuildDeps } from "../../writer/publish";
import type { ChapterSink } from "../../writer/runner";
import type { RawEntry, WriterCache } from "../../writer/runner";
import { COST_HOLD_MS, deferUntil, INTERIM_TARGET, interimDue, judgeBuild, ladderOf, nextRetryAt, OFFICIAL_TARGET, orderCostCap, retryWindowMs, runSummary, spentOf, type BuildVerdict } from "./policy";
import { failureLine, type GenerationAlerts } from "./alerts";
import type { LadderStage } from "../../writer/runner";
import { chainCache, memorySink, opsChapterSink, opsRawCache, watchFetch, type OpsStore, type QuotaSeen } from "./sinks";
import { devForceAnthropicDown, devMockMode, devMockStream } from "./devMock";
import { devBudget } from "./devBudget";

export type GenerationEnv = {
  readonly store: OpsStore;
  readonly now?: () => number;
  /** 시험 주입(fetchImpl·sleep·people·budgetMs·stream). 모델·대체는 감독이 정한다. */
  readonly deps?: V5BuildDeps;
  readonly openAiKey?: string | null;
  readonly build?: typeof buildV5Snapshot;
  /** 최종판3 6: 호출 원문 저장소(ops_writer_raw RPC). 교체 레인이 lease 토큰으로 쓴다. */
  readonly raw?: OpsStore;
  /** F: 작가 호출이 잔액 부족·결제 문제로 실패했을 때 처리 봇 경보(ops_signup 'credit_alert', SQL이 1시간 1번만). 시험 주입이면 없음. */
  readonly creditAlert?: (code: "anthropic_credit" | "openai_quota") => Promise<unknown>;
  /** HOTFIX-W1 3부 3·6: 보류 즉시 알림·실패율 경보(처리 봇). 시험 주입이면 없음. */
  readonly alerts?: GenerationAlerts;
  /** HOTFIX-W1 6: 교체 레인 작가 시간 예산(크론 앞 단계가 쓴 시간을 뺀 값). 없으면 작가 기본 700초. */
  readonly laneBudgetMs?: () => number;
};
export type State = { phase: string; first_attempt_at: string; first_failure_at: string | null; failures: number; rejected_chapters: number[]; last_reason: string | null };
export type Decision =
  | { readonly kind: "publish"; readonly edition: "official" | "interim"; readonly snapshot: Record<string, unknown>; readonly meta: WriterMeta }
  | { readonly kind: "defer"; readonly until: string; readonly reason: string }
  | { readonly kind: "give_up"; readonly reason: string }
  /** 최종판 0-6: 주문당 비용 상한 — 부르지 않고 보류(관리자 지연 목록, 자동 환불 없음). */
  | { readonly kind: "hold"; readonly until: string; readonly reason: string }
  | { readonly kind: "stale"; readonly reason: string };
export type QueueJob = { readonly reportId: string; readonly origin: "paid" | "ticket"; readonly originRef: string; readonly payload: ReportInputPayload; readonly policyAt: string; readonly sink: ChapterSink; readonly prior?: PriorBooks; readonly budgetMs?: number ; readonly raw?: WriterCache | null };
type Built = Awaited<ReturnType<typeof buildV5Snapshot>>;

const ms = (iso: string | null | undefined) => (iso ? Date.parse(iso) : NaN);
const iso = (t: number) => new Date(t).toISOString();

async function loadBuild(env: GenerationEnv) { return env.build ?? (await import("../../writer/publish")).buildV5Snapshot; }

/** OpenAI를 쓸 수 있는가: 키가 있고, 잔액 부족으로 꺼지지 않았을 때. */
export async function openAiAvailable(env: GenerationEnv): Promise<boolean> {
  const key = env.openAiKey === undefined ? process.env.OPENAI_API_KEY : env.openAiKey;
  if (!key) return false;
  try { const r = await env.store.call("provider", {}); const p = (r.providers as Record<string, { disabledAt: string | null }> | undefined)?.openai; return r.ok === true && !p?.disabledAt; }
  catch { return false; }
}

/** 저장된 원문(meta.raw)을 읽기 전용 저장소로(교체 레인·재생성: 같은 입력이면 다시 부르지 않는다). */
export function rawCache(raw: readonly RawEntry[] | undefined, next?: WriterCache | null): WriterCache | null {
  if (!raw?.length) return next ?? null;
  const by = new Map(raw.map(e => [e.key, e]));
  return { get: k => by.get(k) ?? next?.get(k) ?? null, put: (e, m) => next?.put(e, m) };
}

/** 지난 시도 기록(최종판 0-6 비용 합, HOTFIX-W1 사다리). 읽기 실패면 빈 기록(상한은 이번 시도 안에서도 runner가 건다). */
type PriorRun = { cost_usd?: number | string | null; created_at?: string | null; calls?: unknown; lane?: string | null };
async function priorRuns(env: GenerationEnv, reportId: string): Promise<PriorRun[]> {
  try { const r = await env.store.call("state", { reportId }); return Array.isArray(r.runs) ? r.runs as PriorRun[] : []; } catch { return []; }
}
const productOf = (p: unknown) => { const k = (p as { productKey?: unknown } | null)?.productKey; return typeof k === "string" ? k : null; };
/** HOTFIX-W1: 작가 사다리 입력(지난 기록에서). end면 부르지 않는다. */
type Ladder = { startStage: LadderStage; exhaustedMaxTokens: number; end: boolean };

/** 한 번 만들어 판정한다(정식본=Sonnet, 임시본=terra). 예외는 실패로 본다. costCapUsd: 이번 시도가 더 쓸 수 있는 비용. */
async function attempt(env: GenerationEnv, job: { payload: ReportInputPayload; reportId: string; policyAt: string; sink: ChapterSink; prior?: PriorBooks; budgetMs?: number; costCapUsd?: number; stored?: readonly RawEntry[]; raw?: WriterCache | null; ladder?: Ladder }, lane: "official" | "interim") {
  const seen: QuotaSeen = {};
  // 운영 경로는 모델을 넘기지 않는다 → 정식본은 항상 Sonnet. 시험·측정 도구가 모델을 명시하면 그 모델로(대체 모델은 어느 쪽이든 없음).
  const injected = env.deps?.provider && env.deps?.model ? { provider: env.deps.provider, model: env.deps.model } : null;
  const target = lane === "interim" ? INTERIM_TARGET : injected ?? OFFICIAL_TARGET;
  const base = env.deps?.fetchImpl ?? ((...a: Parameters<typeof fetch>) => fetch(...a));
  // OPS_FORCE_ANTHROPIC_DOWN: 정식본(Anthropic) 시도만 출력 전 529로 실패시킨다(개발 전용). 임시본은 실제 호출.
  const mock = devMockMode() ?? (lane === "official" && devForceAnthropicDown() ? "fail" as const : null);
  // 개발 서버의 실제 호출은 예산 관문(tools/llm/budget.ts)을 지난다(최종판 0-5). 목업·시험 주입 stream이 있으면 그대로.
  const gate = mock || env.deps?.stream ? null : await devBudget(`${lane} ${job.reportId}`);
  // 최종판3 6: 저장된 Book 원문 → 이 주문의 운영 원문(받는 즉시 저장) → 개발 관문 순. 같은 입력이면 다시 부르지 않는다.
  const cache = rawCache(job.stored, chainCache(lane === "official" ? job.raw : null, gate?.cache ?? env.deps?.cache ?? null));
  const deps: V5BuildDeps = { ...env.deps, provider: target.provider, model: target.model, fallback: null, fetchImpl: watchFetch(base, seen),
    ...(job.budgetMs ? { budgetMs: job.budgetMs } : {}), ...(mock ? { stream: devMockStream(mock, job.payload, job.policyAt) } : gate ? { stream: gate.stream } : {}),
    ...(cache ? { cache } : {}), ...(job.costCapUsd !== undefined ? { costCapUsd: job.costCapUsd } : {}),
    ...(job.ladder ? { startStage: job.ladder.startStage, ...(job.ladder.exhaustedMaxTokens ? { exhaustedMaxTokens: job.ladder.exhaustedMaxTokens } : {}) } : {}) };
  const started = (env.now ?? Date.now)();
  let built: Built | null = null, verdict: BuildVerdict;
  try {
    built = await (await loadBuild(env))({ payload: job.payload, reportId: job.reportId, policyAt: job.policyAt, sink: job.sink, ...(job.prior ? { prior: job.prior } : {}), deps });
    verdict = judgeBuild(built);
  } catch (e) {
    verdict = { kind: "incomplete", reason: `build_exception:${e instanceof Error ? e.name : "unknown"}`, rejected: [], missing: [], preOutput: true };
  }
  if (seen.openaiQuota) { try { await env.store.call("provider_set", { provider: "openai", disabled: true, reason: "insufficient_quota" }); } catch { /* 다음 시도에서 다시 감지 */ } }
  if ((seen.anthropicCredit || seen.openaiQuota) && env.creditAlert) { try { await env.creditAlert(seen.anthropicCredit ? "anthropic_credit" : "openai_quota"); } catch { /* 경보 실패는 생성과 무관 */ } }
  const summary = built ? runSummary(built) : { provider: target.provider, model: target.model, costUsd: 0, durationMs: (env.now ?? Date.now)() - started, calls: [], chapters: [] };
  const reason = verdict.kind === "incomplete" ? `${lane}:${verdict.reason}${seen.openaiQuota ? ":openai_quota" : ""}${seen.anthropicCredit ? ":anthropic_credit" : ""}` : `${lane}:${verdict.kind}`;
  return { built, verdict, summary: { ...summary, provider: summary.provider ?? target.provider, model: summary.model ?? target.model }, reason, seen };
}

/**
 * 큐 작업 한 건(결제·이용권 공통). settle이 큐 쪽 동작(발행·보류·포기)을 하고 성공 여부를 돌려준다.
 * 기록은 settle 뒤에 남긴다(발행이 실제로 됐는지 보고 published/stale을 적는다).
 */
export async function superviseQueueJob(job: QueueJob, env: GenerationEnv, settle: (d: Decision) => Promise<{ ok: boolean; code?: string }>): Promise<{ decision: Decision; settled: { ok: boolean; code?: string } }> {
  const now = env.now ?? Date.now;
  const begun = await env.store.call("begin", { reportId: job.reportId, origin: job.origin, originRef: job.originRef });
  if (!begun.ok) return { decision: { kind: "stale", reason: "state_unavailable" }, settled: { ok: false, code: "STATE_UNAVAILABLE" } };
  const state = begun.state as State;
  const openAi = await openAiAvailable(env);
  const firstFailure = ms(state.first_failure_at);
  // 임시본 차례: 2시간이 지났고 직전 시도가 임시본 시도가 아닐 때(실패했으면 다음은 다시 Sonnet).
  const interim = interimDue({ phase: state.phase, firstFailureAt: Number.isFinite(firstFailure) ? firstFailure : null, now: now(), interimPossible: openAi }) && !String(state.last_reason ?? "").startsWith("interim:");
  // 최종판 0-1: 저장된 장은 버리지 않는다(빠진 장만 이어 쓴다). 0-6: 지난 시도 비용 합이 상한에 이르면 부르지 않고 보류.
  const sink = interim ? memorySink() : job.sink;
  const product = productOf(job.payload);
  const runs = await priorRuns(env, job.reportId);
  // HOTFIX-W1 2부 6: 주문당 상한은 작가를 포함한 모든 시도 비용 합(정상 1권 × 2.5, 상품별). 진행 중인 주문도 지난 시도 비용을 센다.
  const cap = orderCostCap(product), spentBefore = spentOf(runs as never);
  const lane = interim ? "interim" : "official";
  // HOTFIX-W1 2부 5: 지난 시도에서 생각 소진한 단계 다음부터(같은 단계·같은 한도 반복 금지). 2단까지 소진이면 부르지 않고 보류.
  const ladder = ladderOf(runs as never, interim ? INTERIM_TARGET.model : env.deps?.model ?? OFFICIAL_TARGET.model);
  const skip = ladder.end && lane === "official";
  const a = skip ? null : await attempt(env, { ...job, sink, costCapUsd: Math.max(0, cap - spentBefore), ladder }, lane);
  const spentNow = spentBefore + (a?.summary.costUsd ?? 0);
  let decision: Decision;
  if (!a) decision = { kind: "hold", until: iso(now() + COST_HOLD_MS), reason: `${lane}:thinking_exhausted_end 2단까지 생각 소진(누적 $${spentNow.toFixed(4)}) — 보류` };
  else if (a.verdict.kind === "stale") decision = { kind: "stale", reason: a.reason };
  else if (a.verdict.kind === "incomplete" && a.verdict.capped) decision = { kind: "hold", until: iso(now() + COST_HOLD_MS), reason: a.reason.includes("cost_cap 주문당") ? a.reason : `${lane}:cost_cap 주문당 비용 상한 $${cap} 도달(누적 $${spentNow.toFixed(4)}) — 보류` };
  else if (a.verdict.kind === "incomplete" && a.verdict.ladderEnd) decision = { kind: "hold", until: iso(now() + COST_HOLD_MS), reason: `${lane}:thinking_exhausted_end 생각 소진 — 더 큰 한도 없음(누적 $${spentNow.toFixed(4)}) — 보류` };
  else if (a.verdict.kind === "complete") decision = { kind: "publish", edition: interim ? "interim" : "official", snapshot: a.built!.snapshot as unknown as Record<string, unknown>, meta: a.built!.meta };
  else {
    const t = now(), first = Number.isFinite(firstFailure) ? firstFailure : t;
    const until = deferUntil({ firstFailureAt: first, failures: state.failures + 1, now: t, interimPossible: openAi && !a.seen.openaiQuota && state.phase === "pending" });
    decision = until === null ? { kind: "give_up", reason: a.reason } : { kind: "defer", until: iso(until), reason: a.reason };
  }
  // HOTFIX-W1 3부 4·5: 보류도 고객 대기에 상한 — 첫 실패 + 자동 환불 시간까지만(그 사이 덕짱님이 환불·다시 만들기를 고른다).
  // 기한이 지난 뒤 다시 잡히면(또 보류할 상황이면) 포기 → 자동 환불·이용권 환급. 고객 화면의 「N시간 안에 못 드리면 자동으로 환불돼요」가 늘 맞게.
  if (decision.kind === "hold") {
    const t0 = now(), first0 = Number.isFinite(firstFailure) ? firstFailure : t0, end = nextRetryAt(first0, 1, t0) === null ? null : first0 + retryWindowMs();
    decision = end === null ? { kind: "give_up", reason: decision.reason } : { ...decision, until: iso(end) };
  }
  const settled = decision.kind === "stale" ? { ok: false, code: "STALE_LEASE" } : await settle(decision);
  const t = now(), first = Number.isFinite(firstFailure) ? firstFailure : t;
  const failed = decision.kind === "defer" || decision.kind === "give_up" || decision.kind === "hold";
  const patch: Record<string, unknown> = !settled.ok ? {}
    : decision.kind === "publish" && decision.edition === "official" ? { phase: "official", officialAt: iso(t), rejected: [], nextAt: null }
    : decision.kind === "publish" ? { phase: "interim", interimAt: iso(t), rejected: [], nextAt: (() => { const n = nextRetryAt(first, Math.max(1, state.failures), t); return n === null ? null : iso(n); })() }
    : decision.kind === "defer" ? { firstFailureAt: iso(first), failuresInc: 1, nextAt: decision.until, rejected: [] }
    : decision.kind === "hold" ? { firstFailureAt: iso(first), failuresInc: 1, nextAt: decision.until, rejected: [] }
    : { phase: "gave_up", gaveUpAt: iso(t), firstFailureAt: iso(first), failuresInc: 1, nextAt: null };
  if (!failed || settled.ok) {
    const outcome = !settled.ok ? "stale" : decision.kind === "publish" ? "published" : decision.kind === "defer" || decision.kind === "hold" ? "deferred" : decision.kind === "give_up" ? "gave_up" : "stale";
    const reason = a ? a.reason : decision.kind === "hold" ? decision.reason : "official:skipped";
    try {
      await env.store.call("record", { reportId: job.reportId, run: { lane: interim ? "interim" : "queue", provider: a?.summary.provider ?? OFFICIAL_TARGET.provider, model: a?.summary.model ?? OFFICIAL_TARGET.model,
        edition: decision.kind === "publish" ? decision.edition : null, outcome, reason: settled.ok ? reason : `${reason}:${settled.code ?? "settle_failed"}`,
        costUsd: a?.summary.costUsd ?? 0, calls: a?.summary.calls ?? [], chapters: a?.summary.chapters ?? [], durationMs: a?.summary.durationMs ?? 0 }, state: patch });
    } catch { /* 기록 실패는 발행을 되돌리지 않는다 */ }
    // HOTFIX-W1 3부 3·6: 보류는 바로 알린다(환불 또는 대기 결정). 실패 기록 뒤 실패율 경보를 본다. 알림 실패는 생성과 무관.
    if (settled.ok && failed && env.alerts) {
      const v = a?.verdict.kind === "incomplete" ? a.verdict : null;
      const line = failureLine({ cls: decision.kind === "hold" && v?.capped ? "cost_cap" : v?.cls ?? (a ? "other" : "thinking_exhausted"), stage: v?.stage ?? (a ? null : 2), nextAt: decision.kind === "defer" ? decision.until : null, spentUsd: spentNow, capUsd: cap });
      if (decision.kind === "hold") {
        try { await env.alerts.hold({ reportId: job.reportId, origin: job.origin, originRef: job.originRef, product, line, why: v?.capped ? "주문 비용 상한 — 환불 판단 필요" : "생각 소진이 사다리 끝까지 — 환불 또는 대기 결정" }); } catch { /* 무시 */ }
      }
      try { await env.alerts.failed({ reportId: job.reportId, product }); } catch { /* 무시 */ }
    }
  }
  if (settled.ok && decision.kind === "publish" && decision.edition === "official" && job.origin === "paid") { try { await env.store.call("chapters_clear", { reportId: job.reportId }); } catch { /* 열람 기한 정리(purge)가 지운다 */ } }
  return { decision, settled };
}

type LaneJob = { reportId: string; origin: "paid" | "ticket"; token: string; phase: string; regenerate: boolean; firstFailureAt: string | null; failures: number; rejected: number[]; snapshot: Record<string, unknown> | null; regenRequestedAt?: string | null; regenFailures?: number };

/**
 * 교체 레인 한 건: 임시본 → Sonnet 정식본, 또는 관리자 재생성. 공개된 Book을 바꿀 때는 이전 Book을 보관한 뒤 바꾼다(lane_replace).
 * 입력은 저장된 Book 근거(evidencePacket.input·generatedAt)에서 다시 읽는다(v5 Book만).
 */
export async function runLaneJob(env: GenerationEnv): Promise<{ ok: boolean; empty?: boolean; reportId?: string; outcome?: string }> {
  const now = env.now ?? Date.now;
  const claimed = await env.store.call("lane_claim", {});
  if (!claimed.ok) return { ok: false };
  if (claimed.empty) return { ok: true, empty: true };
  const job = claimed.job as LaneJob;
  const lane = job.regenerate ? "regenerate" : "upgrade";
  const evidence = (job.snapshot?.evidencePacket ?? null) as { input?: ReportInputPayload; generatedAt?: string } | null;
  const release = (data: Record<string, unknown>) => env.store.call("lane_release", { reportId: job.reportId, token: job.token, ...data });
  if (job.snapshot?.productVersion !== "v5" || !evidence?.input || !evidence.generatedAt) {
    await release({ nextAt: null, clearRegenerate: true });
    await env.store.call("record", { reportId: job.reportId, run: { lane, outcome: "error", reason: `${lane}:not_v5_book` }, state: {} });
    return { ok: true, reportId: job.reportId, outcome: "error" };
  }
  const sink = opsChapterSink(env.store, job.reportId, job.token), laneRaw = env.raw ? opsRawCache(env.raw, job.reportId, job.token) : null;
  // 최종판 0-6: 교체 레인도 주문당 상한(재생성은 재생성 요청 뒤 시도만 센다). 0-2: 저장된 Book 원문은 저장소로. HOTFIX-W1: 상한은 상품별·작가 포함, 사다리도 같은 기간 기록으로.
  const since = lane === "regenerate" ? job.regenRequestedAt ?? null : null, runs = await priorRuns(env, job.reportId);
  const cap = orderCostCap(productOf(evidence.input)), spentBefore = spentOf(runs as never, since);
  const ladder = ladderOf(runs as never, env.deps?.model ?? OFFICIAL_TARGET.model, since);
  if (spentBefore >= cap || ladder.end) {
    await release(lane === "regenerate" ? { nextAt: null, clearRegenerate: true } : { nextAt: null });
    await env.store.call("record", { reportId: job.reportId, run: { lane, outcome: "deferred", reason: ladder.end ? `${lane}:thinking_exhausted_end 2단까지 생각 소진(누적 $${spentBefore.toFixed(4)}) — 보류` : `${lane}:cost_cap 주문당 비용 상한 $${cap} 도달(누적 $${spentBefore.toFixed(4)}) — 보류` }, state: {} });
    return { ok: true, reportId: job.reportId, outcome: "held" };
  }
  const stored = (job.snapshot?.evidencePacket as { meta?: { raw?: RawEntry[] } } | undefined)?.meta?.raw;
  const a = await attempt(env, { payload: evidence.input, reportId: job.reportId, policyAt: evidence.generatedAt, sink, raw: laneRaw, costCapUsd: Math.max(0, cap - spentBefore), ladder, ...(env.laneBudgetMs ? { budgetMs: env.laneBudgetMs() } : {}), ...(stored?.length ? { stored } : {}) }, "official");
  const runBase = { lane, provider: a.summary.provider, model: a.summary.model, costUsd: a.summary.costUsd, calls: a.summary.calls, chapters: a.summary.chapters, durationMs: a.summary.durationMs };
  if (a.verdict.kind === "stale") return { ok: true, reportId: job.reportId, outcome: "stale" };
  if (a.verdict.kind === "complete") {
    const r = await env.store.call("lane_replace", { reportId: job.reportId, token: job.token, snapshot: a.built!.snapshot, reason: lane === "regenerate" ? "admin_regenerate" : "official_upgrade" });
    await env.store.call("record", { reportId: job.reportId, run: { ...runBase, edition: "official", outcome: r.ok ? "replaced" : "stale", reason: r.ok ? a.reason : `${a.reason}:${String(r.code)}` }, state: {} });
    return { ok: true, reportId: job.reportId, outcome: r.ok ? "replaced" : "stale" };
  }
  const t = now();
  const rejected = a.verdict.kind === "incomplete" ? a.verdict.rejected : [];
  if (lane === "regenerate") {
    const since = ms(job.regenRequestedAt) || t;
    const next = nextRetryAt(since, (job.regenFailures ?? 0) + 1, t);
    await release(next === null ? { nextAt: null, clearRegenerate: true } : { nextAt: iso(next) });
    await env.store.call("record", { reportId: job.reportId, run: { ...runBase, outcome: next === null ? "gave_up" : "deferred", reason: a.reason }, state: { rejected } });
    return { ok: true, reportId: job.reportId, outcome: next === null ? "gave_up" : "deferred" };
  }
  const first = ms(job.firstFailureAt) || t;
  const next = nextRetryAt(first, job.failures + 1, t);
  await release({ nextAt: next === null ? null : iso(next) });
  // 24시간이 지나면 정식본 교체를 멈춘다(임시본은 그대로 열린다).
  await env.store.call("record", { reportId: job.reportId, run: { ...runBase, outcome: next === null ? "gave_up" : "deferred", reason: a.reason },
    state: { failuresInc: 1, rejected, nextAt: next === null ? null : iso(next), ...(next === null ? { gaveUpAt: iso(t) } : {}) } });
  return { ok: true, reportId: job.reportId, outcome: next === null ? "gave_up" : "deferred" };
}

export const LANE_LIMITS = { maxJobs: 2, claimWindowMs: 60_000 } as const;
/** 교체 레인 배치(운영 크론). 한 번에 2건, 새 claim은 1분 안에서만. */
export async function runLaneBatch(env: GenerationEnv, opts: { maxJobs?: number; claimWindowMs?: number } = {}) {
  const now = env.now ?? Date.now, started = now();
  let processed = 0;
  while (processed < (opts.maxJobs ?? LANE_LIMITS.maxJobs) && now() - started < (opts.claimWindowMs ?? LANE_LIMITS.claimWindowMs)) {
    const r = await runLaneJob(env);
    if (!r.ok) return { ok: false, processed, stop: "storage_error" };
    if (r.empty) return { ok: true, processed, stop: "empty" };
    processed++;
  }
  return { ok: true, processed, stop: "job_limit" };
}
