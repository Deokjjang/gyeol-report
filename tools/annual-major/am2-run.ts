/**
 * AM2 실호출(단계별 상한, 덕짱님 지시). 운영과 같은 발행 함수(buildV5Snapshot → 장 묶음). 모든 호출은 tools/llm/budget.ts를 지난다.
 *   AM2_CHUNK_CONCURRENCY=2 NODE_PATH=tools/llm/shim pnpm exec tsx tools/annual-major/am2-run.ts --stage P --budget 1 --case annual-1 --case major-1
 * 단계: P 시범(am2-P $1.0) · E 평가(am2-E $6.0) · F 고침(am2-F $2.0) · I 임시본 OpenAI(am2-I $0.3).
 * 책마다 시작 관문(남은 예산 < 예상 비용이면 시작하지 않음). 결과(git 밖): ~/Desktop/gyeol-review/annual-major-02/<stage>-<case>/{snapshot.json, book.md, check.md}.
 * 가상 인물만(고객 원고 아님).
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { memorySink } from "../../src/lib/ops/generation/sinks";
import { orderCostCap } from "../../src/lib/ops/generation/policy";
import { buildV5Snapshot } from "../../src/lib/writer/publish";
import { projectV5Book, validateV5Publication, type V5BookDraft, type V5Evidence } from "../../src/lib/writer/book";
import { styleScore } from "../../src/lib/writer/safety/style";
import type { FinalChapter } from "../../src/lib/writer/safety";
import { budgetArg, budgetGate, ensureScope, readLedger, startGate } from "../llm/budget";
import { loadDevEnv } from "../llm/env";
import { manuscript } from "../final/replay";
import { cases } from "./final";
import { concurrency } from "../../src/lib/writer/chunked/run";
import { devMockStream } from "../../src/lib/ops/generation/devMock";

export const OUT2 = join(homedir(), "Desktop", "gyeol-review", "annual-major-02");
const STAGES = { P: { scope: "am2-P", cap: 1.0, provider: "anthropic", model: "claude-sonnet-5-5", note: "AM2 P 시범(세운 1 + 대운 1)" }, E: { scope: "am2-E", cap: 6.0, provider: "anthropic", model: "claude-sonnet-5-5", note: "AM2 E 평가(개발 10 + 숨긴 4)" }, F: { scope: "am2-F", cap: 2.0, provider: "anthropic", model: "claude-sonnet-5-5", note: "AM2 F 고침(걸린 묶음만)" }, I: { scope: "am2-I", cap: 0.3, provider: "openai", model: "gpt-6.1-terra", note: "AM2 임시본(OpenAI) 경로 확인" } } as const;
/** 숨긴 세트(덕짱님 지정 4명). 개발 중에는 만들지 않는다 — E 단계에서만 쓴다. */
export const HIDDEN: readonly { id: string; product: "annual" | "major"; note: string; payload: () => unknown }[] = [];

function checkMd(id: string, note: string, snap: { productType: string; draft: unknown; evidencePacket: unknown }): string {
  const d = snap.draft as V5BookDraft, e = snap.evidencePacket as V5Evidence, m = e.meta, r = m.review as Record<string, unknown>;
  const finals = d.chapters.map(ch => ({ n: ch.n, id: ch.id, title: ch.title, source: "writer", chars: 0, sections: ch.sections.map(s => ({ heading: s.heading, paragraphs: [...s.paragraphs] })), ...(ch.keys ? { keys: ch.keys } : {}) })) as FinalChapter[];
  const st = styleScore(finals), chars = d.chapters.reduce((a, ch) => a + ch.sections.reduce((b, s) => b + s.paragraphs.join("").length, 0), 0);
  const v = validateV5Publication(snap.productType, snap.draft, snap.evidencePacket);
  const log = (r.log ?? []) as { id: string; kind: string; round: number; chars: number; finish: string | null; costUsd: number; ms: number; reason?: string }[];
  const calls = m.calls.map(c => `${c.kind}:${c.finish}${c.hidden ? `(생각 ${JSON.stringify(c.hidden)})` : ""} in ${c.usage.inputTokens}/캐시 ${c.usage.cachedInputTokens} out ${c.usage.outputTokens} $${(c.costUsd ?? 0).toFixed(4)} ${Math.round(c.ms / 1000)}초`);
  return [`# ${id} 점검표`, "", `- 입력: ${note}`, `- 형식 검사 ${v.ok ? "OK" : v.errors.join(",")} · 장 ${d.chapters.length} · 본문 ${chars}자 · 소요 ${Math.round(m.durationMs / 1000)}초 · 비용 $${m.costUsd.toFixed(4)} · 호출 ${m.calls.length}`,
    `- 장별 글자: ${d.chapters.map(ch => `${ch.n}장 ${ch.sections.reduce((b, s) => b + s.paragraphs.join("").length, 0)}`).join(" · ")}`,
    `- 토큰: 입력 ${m.tokens.input}(캐시 읽기 ${m.tokens.cachedInput}) · 출력 ${m.tokens.output}`,
    `- 브리프 검사 ${(r.briefCheck as { ok: boolean })?.ok ? "OK" : "FAIL"} · 첫 차단 결함 ${r.blockFirst} · 다시 쓰기 ${JSON.stringify(r.rounds)} · 지운 문장 ${(r.deleted as unknown[])?.length ?? 0} · 결정론 대체 ${JSON.stringify(r.replaced)} · 남은 차단 ${(r.remainingHard as unknown[])?.length ?? 0} · 장 사이 반복(첫 ${r.repeatFirst} · 남음 ${(r.remainingRepeat as unknown[])?.length ?? 0})`,
    `- 문체 점수(고치지 않음): ${JSON.stringify(r.style)} · 반복률 ${st.repeatRate}% · 문장 시작 다양성 ${st.startDiversity}% · 리듬 평균 ${st.rhythm.meanLen}자`,
    `- 표지: ${(d as { coverLine?: string }).coverLine ?? ""} (${JSON.stringify(r.cover)})`, ...((d as { annual?: { keywords: string[]; keywordSource?: string } }).annual ? [`- 키워드: ${(d as unknown as { annual: { keywords: string[]; keywordSource?: string } }).annual.keywords.join(" · ")}(${(d as unknown as { annual: { keywordSource?: string } }).annual.keywordSource})`] : []),
    "", "## 묶음 기록", ...log.map(x => `- ${x.id} ${x.kind}${x.round ? ` #${x.round}` : ""}: ${x.chars}자 · ${x.finish} · $${x.costUsd.toFixed(4)} · ${Math.round(x.ms / 1000)}초${x.reason ? ` · ${x.reason}` : ""}`),
    "", "## 호출", ...calls.map(c => `- ${c}`),
    "", "## 남은 차단 결함", ...((r.remainingHard ?? []) as { at: string; rule: string; sentence: string }[]).map(x => `- ${x.at} ${x.rule}: ${x.sentence}`),
    "", "## 지운 문장", ...((r.deleted ?? []) as { at: string; rule: string; sentence: string }[]).map(x => `- ${x.at} ${x.rule}: ${x.sentence}`), ""].join("\n");
}

async function main() {
  const argv = process.argv.slice(2), stage = (argv[argv.indexOf("--stage") + 1] ?? "") as keyof typeof STAGES, budget = budgetArg(argv);
  const ids = argv.flatMap((a, i) => (a === "--case" ? [argv[i + 1]] : []));
  const S = STAGES[stage]; if (!S) { console.error("--stage P|E|F|I"); process.exit(2); }
  if (argv.includes("--mock") && !process.env.LLM_CACHE_DIR) { console.error("--mock은 LLM_CACHE_DIR(임시 폴더)와 함께"); process.exit(2); }
  loadDevEnv();
  ensureScope(S.scope, S.cap, S.note);
  const all = [...cases().filter(c => c.product !== "launch").map(c => ({ id: c.id, note: c.note, payload: c.payload })), ...HIDDEN.map(h => ({ id: h.id, note: h.note, payload: h.payload() }))];
  const list = all.filter(c => ids.includes(c.id));
  if (!list.length) { console.error("--case가 없습니다"); process.exit(2); }
  mkdirSync(OUT2, { recursive: true });
  for (const c of list) {
    if (!startGate({ scope: S.scope, runBudget: budget, books: 1 }).ok) { console.error(`예산 관문: ${c.id} 시작하지 않음 — 멈춘다`); process.exit(3); }
    // 관문은 대기 중 호출의 최악 비용(묶음 호출 하나 약 $0.18, 캐시 없음 가정)을 미리 센다 → 첫 묶음 + 병렬 수만큼의 여유가 없으면 책 중간 거절이 날 수 있어 시작하지 않는다.
    { const l = readLedger(), spentNow = l.calls.filter(x => x.scope === S.scope).reduce((a, x) => a + x.costUsd, 0), need = 0.18 * (1 + concurrency());
      if (S.cap - spentNow < need && !argv.includes("--mock")) { console.error(`예산 여유 부족: 남은 $${(S.cap - spentNow).toFixed(4)} < 병렬 대기 최악 $${need.toFixed(2)} — ${c.id} 시작하지 않고 멈춘다(덕짱님 확인)`); process.exit(3); } }
    const at = "2026-12-02T03:00:00.000Z";
    // --mock: 가짜 작가(호출 0)로 도구·관문 흐름만 시험(LLM_CACHE_DIR을 임시 폴더로 두고 돌린다 — 실제 원장에 남기지 않게).
    const gate = budgetGate({ scope: S.scope, run: `am2-${stage}-${c.id}`, runBudget: budget, stage: `AM2 ${stage}`, ...(argv.includes("--mock") ? { inner: devMockStream("ok", c.payload as never, at) } : {}) });
    const built = await buildV5Snapshot({ payload: c.payload as never, reportId: `report_am2${stage.toLowerCase()}${c.id.replace(/[^a-z0-9]/g, "")}00000`, policyAt: at, sink: memorySink() as never,
      deps: { provider: S.provider, model: S.model, fallback: null, stream: gate.stream, cache: gate.cache, costCapUsd: orderCostCap(), testRun: true } });
    const snap = built.snapshot as unknown as { productType: string; draft: unknown; evidencePacket: unknown };
    const dir = join(OUT2, `${stage}-${c.id}`); mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, "snapshot.json"), JSON.stringify(snap));
    writeFileSync(join(dir, "book.md"), manuscript(snap.draft as V5BookDraft));
    writeFileSync(join(dir, "check.md"), checkMd(c.id, c.note, snap));
    void projectV5Book(snap as never, "2026-12-02");
    const m = (snap.evidencePacket as V5Evidence).meta;
    console.log(`${c.id}: $${m.costUsd.toFixed(4)} · ${Math.round(m.durationMs / 1000)}초 · 호출 ${m.calls.length} · 거절 ${gate.refusals().length} · 남은 차단 ${((m.review as { remainingHard?: unknown[] }).remainingHard ?? []).length} · ${dir}`);
    if (gate.refusals().length) { console.error(`거절: ${gate.refusals().join(" / ")} — 멈춘다`); process.exit(4); }
  }
  const l = readLedger(); console.log(`범위 ${S.scope} 누적 $${l.calls.filter(x => x.scope === S.scope).reduce((a, x) => a + x.costUsd, 0).toFixed(4)} / 상한 $${S.cap}`);
}
if (process.argv[1]?.endsWith("am2-run.ts")) void main().catch(e => { console.error(e); process.exit(1); });
