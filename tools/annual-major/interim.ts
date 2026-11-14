/**
 * AM 7부 장애 대비 임시본 경로 시험(세운 1회, 대운 1회). 품질 판단 대상이 아니다.
 *   NODE_PATH=tools/llm/shim pnpm exec tsx tools/annual-major/interim.ts <annual|major> [--mock]
 * --mock: 공급자 응답만 시험 대역(tests/helpers/opsMocks: Anthropic 529 → OpenAI 원고, 해제 뒤 Anthropic 원고)으로 바꿔 같은 경로를 호출 0으로 돈다(7부 「먼저 가짜 작가로」).
 * 운영 감독 함수 그대로(superviseQueueJob → runLaneBatch). 저장소는 메모리(로컬 DB·운영 DB 모두 건드리지 않음), 재시도 대기는 가짜 시계로 건너뛴다.
 *   ① OPS_FORCE_ANTHROPIC_DOWN=1(개발 전용): 정식본 시도는 출력 전 실패(호출 0) → 2시간째 임시본(OpenAI gpt-6.1-terra, 실호출) 발행
 *   ② 플래그를 끄고 교체 레인 → 정식본(Anthropic Sonnet, 실호출)으로 바꾸고 임시본은 보관
 * 비용: OpenAI는 범위 am-interim(상한 $1), Anthropic은 am-final(상한 $8, 최종 생성과 같은 범위). 모두 tools/llm/budget.ts 원장에 남는다.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { normalizeReportInputPayload } from "../../src/lib/report-generation/reportInputAdapter";
import { runLaneBatch, superviseQueueJob, type Decision } from "../../src/lib/ops/generation/supervisor";
import { memorySink } from "../../src/lib/ops/generation/sinks";
import { ANTHROPIC_OVERLOADED, fakeClock, memoryOpsStore, mockAnthropic, mockOpenAiWithBody, routedFetch } from "../../tests/helpers/opsMocks";
import { mockTextFor } from "../../tests/helpers/v5Scenarios";
import { ensureScope } from "../llm/budget";
import { loadDevEnv } from "../llm/env";
import { OUT, cases } from "./final";

async function main() {
  const which = process.argv[2];
  if (which !== "annual" && which !== "major") { console.error("사용: interim.ts <annual|major>"); process.exit(2); }
  const mock = process.argv.includes("--mock");
  if (!mock) {
    loadDevEnv();
    if (!process.env.OPENAI_API_KEY || !process.env.ANTHROPIC_API_KEY) { console.error("OPENAI_API_KEY·ANTHROPIC_API_KEY가 .env.development.local에 있어야 한다(값은 출력하지 않음)"); process.exit(2); }
    ensureScope("am-interim", 1, "AM 7부 임시본 경로 시험(OpenAI)");
    ensureScope("am-final", 8, "AM 7부 최종 생성(대운·세운·4종, Anthropic)");
  }
  const c = cases().find(x => x.id === (which === "annual" ? "annual-1" : "major-1"))!;
  const policyAt = "2026-12-02T03:00:00.000Z";
  const n = normalizeReportInputPayload(c.payload as never, { now: () => new Date(policyAt) });
  if (!n.ok) throw new Error("payload");
  const env0 = process.env as Record<string, string | undefined>;
  delete env0.OPS_MOCK_WRITER;
  const clock = fakeClock(Date.parse(policyAt)), ops = memoryOpsStore(clock);
  const { text } = mockTextFor(n.value, policyAt), o = mockOpenAiWithBody([{ text }]);
  if (mock) env0.NODE_ENV = "test";
  else { env0.NODE_ENV = "development"; env0.OPS_FORCE_ANTHROPIC_DOWN = "1"; env0.LLM_BUDGET_SCOPE = "am-interim"; env0.LLM_BUDGET_RUN = "0.5"; env0.LLM_BUDGET_RUN_ID = `am-interim-${which}`; env0.LLM_BUDGET_STAGE = "AM 7부 임시본"; }
  const deps: Record<string, unknown> = { sleep: clock.sleep, ...(mock ? { fetchImpl: routedFetch(mockAnthropic([ANTHROPIC_OVERLOADED]), o), apiKey: "test-key" } : {}) };
  const env = { store: ops.store, now: clock.now, openAiKey: mock ? "sk-test" : env0.OPENAI_API_KEY, deps };
  const job = { reportId: `report_aminterim${which}0001`, origin: "paid" as const, originRef: `payment_order_aminterim_${which}`, payload: n.value, policyAt, sink: memorySink(), budgetMs: 480_000 };
  const log: string[] = [];
  const run = async () => (await superviseQueueJob(job, env, async (d: Decision) => { log.push(`${new Date(clock.now()).toISOString()} ${d.kind}${d.kind === "publish" ? `:${d.edition}` : ""}`); if (d.kind === "publish") ops.snapshots.set(job.reportId, d.snapshot); return { ok: true }; })).decision;
  let d = await run(), guard = 0;
  while (d.kind === "defer" && guard++ < 12) { clock.advanceTo(Date.parse(d.until)); d = await run(); }
  if (d.kind !== "publish" || d.edition !== "interim") { console.error(`임시본이 발행되지 않음: ${d.kind}`, log); process.exit(1); }
  const interimMeta = d.meta as { writer?: { provider: string; model: string }; costUsd: number; durationMs: number };
  // ② 장애 해제 → 교체 레인(정식본 Sonnet)
  if (mock) deps.fetchImpl = routedFetch(mockAnthropic([{ text }]), o);
  else { env0.OPS_FORCE_ANTHROPIC_DOWN = "0"; env0.LLM_BUDGET_SCOPE = "am-final"; env0.LLM_BUDGET_RUN = "0.6"; env0.LLM_BUDGET_RUN_ID = `am-interim-replace-${which}`; env0.LLM_BUDGET_STAGE = "AM 7부 정식본 교체"; }
  const next = ops.states.get(job.reportId)?.next_at;
  if (next) clock.advanceTo(Date.parse(next));
  const lane = await runLaneBatch(env, { maxJobs: 1 });
  const s = ops.states.get(job.reportId)!, snap = ops.snapshots.get(job.reportId) as { evidencePacket: { meta: { writer: { provider: string; model: string }; costUsd: number } } };
  const lines = [`# 임시본 경로 시험 · ${which}${mock ? " (가짜 공급자, 호출 0)" : ""}`, "", `- 결정 기록: ${log.join(" → ")}`, `- 임시본 작가 ${interimMeta.writer?.provider}/${interimMeta.writer?.model} · $${interimMeta.costUsd.toFixed(4)}`,
    `- 교체 레인 처리 ${lane.processed} · 상태 ${s.phase} · 보관한 판 ${JSON.stringify(ops.versions)} · 마지막 기록 ${(ops.runs.at(-1) as { outcome?: string })?.outcome}`,
    `- 교체 뒤 작가 ${snap.evidencePacket.meta.writer.provider}/${snap.evidencePacket.meta.writer.model} · $${snap.evidencePacket.meta.costUsd.toFixed(4)}`, ""];
  const outDir = mock ? join(process.env.AM_MOCK_OUT ?? join(OUT, "..", "annual-major-mock"), "interim") : join(OUT, "interim");
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, `${which}.md`), lines.join("\n"));
  const ok = s.phase === "official" && ops.versions.length === 1 && snap.evidencePacket.meta.writer.provider === "anthropic";
  console.log(lines.join("\n"), ok ? "PASS" : "FAIL");
  process.exit(ok ? 0 : 1);
}
void main().catch(e => { console.error(e); process.exit(1); });
