/**
 * 예산 관문(최종판 0-5). 개발용 유료 LLM 호출은 모두 이 파일 한 곳을 지난다.
 *  - 원장: .cache/llm-ledger.json(범위별 상한·누적·호출·입력 해시) + docs/v5/api-cost-log.md(한 호출 = 한 줄, 누적 합계).
 *  - 범위(scope) 상한: 처음 만들 때 정한 상한(최종판 "final" = $1.50, 덕짱님 지시). 상한 올리기는 덕짱님이 채팅에서 승인한 경우만(CLAUDE.md "비용").
 *  - 실행마다 예산(--budget, 개발 서버는 LLM_BUDGET_RUN) 필수. 누적이 범위 상한이나 실행 예산을 넘게 되는 호출은 부르기 전에 거절한다(최악 비용 = 입력 + 출력 상한).
 *  - 시작 전 예상 비용(권당 실측 최대 × 1.3 × 권 수)을 출력하고, 남은 예산보다 크면 시작하지 않는다(startGate).
 *  - 원문 저장소(.cache/writer/<입력 해시>.json): 같은 입력은 다시 부르지 않고 저장본을 쓴다. 저장본이 없는데 원장에 같은 입력 해시가 있으면 재생성으로 보고 거절한다.
 * 운영(⑦ 감독)은 이 파일을 쓰지 않는다(주문당 상한 0-6은 감독이 건다). 개발 서버(next dev)는 LLM_BUDGET_SCOPE가 있을 때 감독이 이 관문을 끼운다.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { computeCostUsd, priceFor, streamCompletion, type StreamCompletionInput, type StreamCompletionResult } from "../../src/lib/llm";
import type { RawEntry, WriterCache } from "../../src/lib/writer/runner";
import { ROOT } from "./env";

/** 경로(시험은 LLM_CACHE_DIR·LLM_COST_LOG로 임시 폴더를 쓴다 — 실제 원장을 건드리지 않게). */
const cacheDir = () => process.env.LLM_CACHE_DIR ?? join(ROOT, ".cache");
const ledgerFile = () => join(cacheDir(), "llm-ledger.json");
const rawDir = () => join(cacheDir(), "writer");
const costLog = () => process.env.LLM_COST_LOG ?? join(ROOT, "docs/v5/api-cost-log.md");
/** 권당 실측 최대(USD): P6e Sonnet 5.5 작가 + 수리 + 재작성 최대 $0.2560(권태오 r4). 시작 전 예상 = 이 값 × 1.3 × 권 수. */
export const MEASURED_MAX_PER_BOOK = 0.256;
/** 장 하나만 만들 때(시험 1장·장 단위 재생성) 예상: 권당 최대 ÷ 장 수(9) × 2(여유). */
export const MEASURED_MAX_PER_CHAPTER = 0.06;

/**
 * pending(최종판2 0): 부르기 직전에 최악 비용으로 먼저 적는 줄. 호출이 끝나면 실제 토큰·비용으로 바꾼다.
 * 프로세스가 스트림 도중에 죽으면(서버 재시작·시간 초과) 이 줄이 남아 최악 비용으로 누적에 잡힌다(실제 과금은 콘솔과 대조, --audit).
 */
export type LedgerCall = { readonly at: string; readonly scope: string; readonly run: string; readonly stage: string; readonly kind: string; readonly provider: string; readonly model: string;
  readonly input: number; readonly cachedInput: number; readonly output: number; readonly costUsd: number; readonly finish: string; readonly requestId: string | null; readonly key: string | null;
  readonly id?: string; readonly pending?: boolean };
export type Ledger = { version: 1; scopes: Record<string, { cap: number; createdAt: string; note: string }>; calls: LedgerCall[]; refusals: { at: string; scope: string; run: string; stage: string; reason: string; key: string | null }[] };

export function readLedger(): Ledger {
  if (!existsSync(ledgerFile())) return { version: 1, scopes: {}, calls: [], refusals: [] };
  return JSON.parse(readFileSync(ledgerFile(), "utf8")) as Ledger;
}
function writeLedger(l: Ledger) { mkdirSync(cacheDir(), { recursive: true }); writeFileSync(ledgerFile(), JSON.stringify(l, null, 1)); }
export const spent = (l: Ledger, scope: string, run?: string) => l.calls.filter(c => c.scope === scope && (!run || c.run === run)).reduce((a, c) => a + c.costUsd, 0);

/** 범위를 만든다(이미 있으면 상한을 바꾸지 않는다: 상한 올리기는 승인 뒤 손으로). */
export function ensureScope(scope: string, cap: number, note: string): { cap: number } {
  const l = readLedger();
  if (!l.scopes[scope]) { l.scopes[scope] = { cap, createdAt: new Date().toISOString(), note }; writeLedger(l); }
  return { cap: l.scopes[scope].cap };
}

const kst = () => new Date(Date.now() + 9 * 3_600_000).toISOString().slice(0, 16).replace("T", " ");
function appendCostRow(c: LedgerCall) {
  let text = readFileSync(costLog(), "utf8");
  const tableEnd = text.indexOf("\n누적 합계");
  let cum = Number(text.match(/누적 합계: \*\*\$([\d.]+)\*\*/)?.[1] ?? 0);
  cum += c.costUsd;
  const row = `| ${kst()} | ${c.stage}${c.kind !== "first" ? ` ${c.kind}` : ""} | ${c.provider}/${c.model} | ${c.input} | ${c.cachedInput} | ${c.output} | ${c.costUsd.toFixed(8)} | ${c.finish} | ${c.requestId ?? "-"} | ${cum.toFixed(8)} |`;
  text = text.slice(0, tableEnd) + "\n" + row + text.slice(tableEnd);
  writeFileSync(costLog(), text.replace(/누적 합계: \*\*\$[\d.]+\*\*/, `누적 합계: **$${cum.toFixed(8)}**`));
}

/** 이 호출의 최악 비용(입력 전부 + 출력 상한, 캐시 할인 없음). 가격표에 없으면 Infinity(거절). */
export function worstCost(i: Pick<StreamCompletionInput, "provider" | "model" | "system" | "user" | "maxOutputTokens">): number {
  const p = priceFor(i.provider, i.model); if (!p) return Infinity;
  const inputTokens = Math.ceil((i.system.length + i.user.length) * 1.1);
  return (inputTokens * p.input + i.maxOutputTokens * p.output) / 1e6;
}

export type GateOptions = { readonly scope: string; readonly run: string; readonly runBudget: number; readonly stage: string; readonly inner?: typeof streamCompletion };
export type Gate = { readonly stream: typeof streamCompletion; readonly cache: WriterCache; readonly runSpent: () => number; readonly refusals: () => readonly string[] };

/** 관문: 원문 저장소 + 상한 검사 + 원장·비용 기록을 붙인 stream. 같은 입력 해시는 cache.get이 먼저 돌려준다(runner가 부르지 않는다). */
export function budgetGate(o: GateOptions): Gate {
  if (!(o.runBudget > 0)) throw new Error("실행 예산(--budget)이 없습니다");
  const inner = o.inner ?? streamCompletion;
  const refused: string[] = [];
  let pendingKey: string | null = null;
  // 호출 종류는 지침 머리로 안다(작가·수리·소제목 재작성·표지 수리).
  const kindOf = (i: StreamCompletionInput) => i.system.startsWith("너는 결리포트의 작가다") ? (/남은 장만 이어서/.test(i.user) ? "continuation" : "first") : i.system.includes("[S번호]") ? "rewrite" : i.system.includes("표지 한 줄") ? "cover" : "repair";
  const refuse = (reason: string): StreamCompletionResult => {
    const l = readLedger(); l.refusals.push({ at: new Date().toISOString(), scope: o.scope, run: o.run, stage: o.stage, reason, key: pendingKey }); writeLedger(l);
    refused.push(reason);
    return { text: "", finishReason: "error", usage: { inputTokens: 0, cachedInputTokens: 0, outputTokens: 0 }, costUsd: 0, requestId: null, error: { code: "budget_refused", message: reason } };
  };
  const cache: WriterCache = {
    get(key) { const f = join(rawDir(), `${key}.json`); return existsSync(f) ? (JSON.parse(readFileSync(f, "utf8")) as { entry: RawEntry }).entry : null; },
    put(entry, meta) { mkdirSync(rawDir(), { recursive: true }); writeFileSync(join(rawDir(), `${entry.key}.json`), JSON.stringify({ entry, at: new Date().toISOString(), scope: o.scope, run: o.run, stage: o.stage, system: meta.system, user: meta.user }, null, 1)); },
  };
  // runner는 get이 비면 곧바로 stream을 부른다: 그 키를 기억했다가 원장 중복 검사에 쓴다.
  const wrappedCache: WriterCache = { get: k => { pendingKey = k; return cache.get(k); }, put: (e, m) => cache.put(e, m) };
  const stream: typeof streamCompletion = async input => {
    const l = readLedger(), sc = l.scopes[o.scope];
    if (!sc) return refuse(`범위 없음: ${o.scope}`);
    // 같은 입력 해시 재생성 거절: 원고(출력)나 비용이 난 호출만 센다. 출력 0·비용 0인 실패(401 등 요청 거절)는 다시 불러도 재생성이 아니다.
    if (pendingKey && l.calls.some(c => c.key === pendingKey && !c.pending && (c.output > 0 || c.costUsd > 0)) && !existsSync(join(rawDir(), `${pendingKey}.json`))) return refuse(`같은 입력 해시 재생성 거절(${pendingKey})`);
    const worst = worstCost(input), s = spent(l, o.scope), r = spent(l, o.scope, o.run);
    if (s + worst > sc.cap) return refuse(`범위 상한 초과 예상: 누적 $${s.toFixed(4)} + 이 호출 최악 $${worst.toFixed(4)} > 상한 $${sc.cap}`);
    if (r + worst > o.runBudget) return refuse(`실행 예산 초과 예상: 이번 실행 $${r.toFixed(4)} + 이 호출 최악 $${worst.toFixed(4)} > 예산 $${o.runBudget}`);
    // 부르기 전에 최악 비용으로 먼저 적는다(도중에 죽어도 원장에 남는다).
    const id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`, key = pendingKey;
    const startedAt = new Date().toISOString();
    { const lp = readLedger(); lp.calls.push({ at: startedAt, scope: o.scope, run: o.run, stage: o.stage, kind: kindOf(input), provider: input.provider, model: input.model, input: 0, cachedInput: 0, output: 0, costUsd: worst, finish: "pending", requestId: null, key, id, pending: true }); writeLedger(lp); }
    const res = await inner(input);
    const cost = res.costUsd ?? computeCostUsd(input.provider, input.model, res.usage) ?? 0;
    const call: LedgerCall = { at: startedAt, scope: o.scope, run: o.run, stage: o.stage, kind: kindOf(input), provider: input.provider, model: input.model,
      input: res.usage.inputTokens, cachedInput: res.usage.cachedInputTokens, output: res.usage.outputTokens, costUsd: cost, finish: res.error ? `${res.finishReason}:${res.error.code}` : res.finishReason, requestId: res.requestId, key, id };
    const l2 = readLedger(); const at = l2.calls.findIndex(c => c.id === id); if (at >= 0) l2.calls[at] = call; else l2.calls.push(call); writeLedger(l2);
    try { appendCostRow(call); } catch { /* 표 기록 실패는 원장이 남는다 */ }
    pendingKey = null;
    return res;
  };
  return { stream, cache: wrappedCache, runSpent: () => spent(readLedger(), o.scope, o.run), refusals: () => refused };
}

/** 시작 관문: 예상 비용(권당 실측 최대 × 1.3 × 권 수, 또는 장 단위)을 출력하고, 남은 예산(범위·실행 중 작은 쪽)보다 크면 false. */
export function startGate(a: { scope: string; runBudget: number; books?: number; chapters?: number; log?: (s: string) => void }): { ok: boolean; expected: number; remaining: number } {
  const l = readLedger(), sc = l.scopes[a.scope];
  const expected = Math.round(((a.books ?? 0) * MEASURED_MAX_PER_BOOK + (a.chapters ?? 0) * MEASURED_MAX_PER_CHAPTER) * 1.3 * 1e4) / 1e4;
  const remaining = sc ? Math.min(sc.cap - spent(l, a.scope), a.runBudget) : 0;
  (a.log ?? console.log)(`예산 관문: 범위 ${a.scope} 상한 $${sc?.cap ?? "없음"} · 누적 $${sc ? spent(l, a.scope).toFixed(4) : "0"} · 이번 실행 예산 $${a.runBudget} · 예상 $${expected} · 남은 $${remaining.toFixed(4)}`);
  return { ok: Boolean(sc) && expected <= remaining, expected, remaining };
}

/** --budget 인자(필수). */
export function budgetArg(argv: readonly string[]): number {
  const i = argv.indexOf("--budget"); const v = i >= 0 ? Number(argv[i + 1]) : NaN;
  if (!(v > 0)) { console.error("거절: 실행마다 --budget <USD>가 필요합니다(최종판 0-5)."); process.exit(2); }
  return v;
}

if (process.argv[1] && process.argv[1].endsWith("budget.ts")) {
  const l = readLedger();
  for (const [name, sc] of Object.entries(l.scopes)) console.log(`${name}: 상한 $${sc.cap} · 누적 $${spent(l, name).toFixed(6)} · 호출 ${l.calls.filter(c => c.scope === name).length} · 끝나지 않은 호출 ${l.calls.filter(c => c.scope === name && c.pending).length} · 거절 ${l.refusals.filter(r => r.scope === name).length}`);
  if (!Object.keys(l.scopes).length) console.log("원장이 비어 있습니다.");
  for (const c of l.calls.filter(x => x.pending)) console.log(`끝나지 않은 호출(최악 비용으로 셈): ${c.at} ${c.stage} ${c.kind} $${c.costUsd.toFixed(4)}`);
  if (process.argv.includes("--audit")) void import("./audit").then(m => m.audit(l));
}
