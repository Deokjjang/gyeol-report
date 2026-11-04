/**
 * 최종판 4 실질 결함 고침: 발행된 궁합 책에서 "브리프가 틀린 장면 주인을 준 소제목"만 다시 쓴다(사유 기록).
 *   NODE_PATH=tools/llm/shim pnpm exec tsx tools/final/fix-sections.ts <reportId> --list            (대상만, 호출 0)
 *   NODE_PATH=tools/llm/shim pnpm exec tsx tools/final/fix-sections.ts <reportId> --budget <USD> [--publish]
 * - 대상: 발행 당시 작가에게 간 브리프(.cache/writer/<작가 호출 키>.json의 user)와 지금 브리프(최종판 1-5 주인 규칙 수정 뒤)의
 *   rel.who가 다른 소제목. 다른 소제목·장은 그대로 둔다.
 * - 같은 발행 함수(buildV5Snapshot): 작가 원고는 저장 원문(작가 다시 부르지 않음), 저장된 수리·표지 원문은 같은 입력 해시면 그대로,
 *   재작성(소제목) 1회만 새로 부른다(예산 관문 · 주문당 상한 $0.60 남은 몫).
 * - --publish: 로컬 DB 발행본을 바꾸고 이전 판을 book_snapshot_versions(previous)에, 비용을 book_generation_runs(regenerate)에 남긴다.
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { streamCompletion } from "../../src/lib/llm";
import { orderCostCap } from "../../src/lib/ops/generation/policy";
import { rawCache } from "../../src/lib/ops/generation/supervisor";
import { renderWriterBrief } from "../../src/lib/writer/prompt";
import { buildV5Snapshot, writerKnowledge } from "../../src/lib/writer/publish";
import { budgetArg, budgetGate, ensureScope } from "../llm/budget";
import { loadDevEnv, ROOT } from "../llm/env";
import { briefOfSnap, loadSnap, manuscript } from "./replay";

type RelMat = { kind: string; topic?: string; scene?: string; who?: string[] };
type BriefJson = { chapters?: { title?: string; sections?: { q?: string; materials?: RelMat[] }[] }[] };
const sql = (q: string) => execFileSync("docker", ["exec", "-i", "supabase_db_gyeol-report", "psql", "-U", "postgres", "-At", "-v", "ON_ERROR_STOP=1"], { input: q, encoding: "utf8" }).trim();

async function main() {
  const argv = process.argv.slice(2), reportId = argv[0];
  if (!/^report_[a-z0-9]+$/.test(reportId ?? "")) { console.error("사용: fix-sections.ts <reportId> --budget <USD> [--publish]"); process.exit(2); }
  const list = argv.includes("--list"), budget = list ? 0 : budgetArg(process.argv), publish = argv.includes("--publish");
  loadDevEnv();
  const { snap } = await loadSnap(reportId);
  const meta = snap.evidencePacket.meta!, raw = meta.raw ?? [];
  const firstKey = meta.calls.find(c => c.kind === "first")?.key;
  const stored = firstKey ? join(ROOT, ".cache/writer", `${firstKey}.json`) : "";
  if (!stored || !existsSync(stored)) { console.error(`발행 당시 브리프 원문이 없다(${stored})`); process.exit(3); }
  const oldBrief = JSON.parse((JSON.parse(readFileSync(stored, "utf8")) as { user: string }).user.replace(/^[\s\S]*?```json\n/, "").replace(/\n```[\s\S]*$/, "")) as BriefJson;
  const { k } = writerKnowledge(), newBrief = renderWriterBrief(briefOfSnap(snap), { knowledge: k }) as BriefJson;
  // 소제목마다 rel.who 비교(같은 장면이어야 한다: 장면 선택은 주인 규칙과 무관).
  const targets: { chapter: number; section: number; reason: string }[] = [], notes: string[] = [];
  (oldBrief.chapters ?? []).forEach((ch, ci) => (ch.sections ?? []).forEach((sec, si) => {
    const nsec = newBrief.chapters?.[ci]?.sections?.[si];
    const olds = (sec.materials ?? []).filter(m => m.kind === "rel"), news = (nsec?.materials ?? []).filter(m => m.kind === "rel");
    const diffs = olds.flatMap((m, i) => {
      const n = news[i]; if (!n || n.scene !== m.scene) throw new Error(`${ci + 1}장 ${si + 1}절: 장면이 다르다(${m.scene} ↔ ${n?.scene}) — 브리프가 발행 때와 달라졌다`);
      return JSON.stringify(m.who ?? []) === JSON.stringify(n.who ?? []) ? [] : [{ was: (m.who ?? []).join(" / ") || "(없음)", now: (n.who ?? []).join(" / ") || "(정하지 않음 — 두 사람 값이 0에 가깝다)" }];
    });
    if (!diffs.length) return;
    const reason = `브리프의 장면 주인이 틀렸었다(값과 반대이거나 근거 없음). 고친 주인: ${diffs.map(d => d.now).join(" / ")}. 이 소제목에서 두 사람의 행동을 이 주인과 materials대로만 쓰고, 고친 주인에 없는 사람 귀속(예: 예전 "${diffs[0].was.slice(0, 60)}")은 쓰지 않는다. 문체·길이·다른 내용은 지금 글을 따른다.`;
    targets.push({ chapter: ci + 1, section: si, reason });
    notes.push(`- ${ci + 1}.${si + 1} 「${sec.q ?? ""}」\n  - 예전: ${diffs.map(d => d.was).join(" / ")}\n  - 지금: ${diffs.map(d => d.now).join(" / ")}`);
  }));
  console.log(`재작성 대상 소제목 ${targets.length}:\n${notes.join("\n")}`);
  if (!targets.length || list) return;

  ensureScope("final", 1.5, "최종판 명령 전체 합계 상한(덕짱님 지시 2026-11-04)");
  const gate = budgetGate({ scope: "final", run: `fix-${reportId}`, runBudget: budget, stage: `최종판 4 궁합 장면 주인 고침 · 소제목 재작성 ${targets.length}` });
  const writerRaw = raw.filter(e => e.kind === "first");
  const zero = { inputTokens: 0, cachedInputTokens: 0, outputTokens: 0 };
  // 작가 호출은 저장 원문(브리프가 바뀌어 입력 해시가 달라도), 그 밖(수리·재작성·표지)은 관문을 지난다.
  const stream: typeof streamCompletion = async input => {
    if (input.system.startsWith("너는 결리포트의 작가다")) {
      const e = writerRaw.shift();
      if (e) { input.onText?.(e.text); return { text: e.text, finishReason: e.finish, usage: zero, costUsd: 0, requestId: "stored" }; }
      return { text: "", finishReason: "error", usage: zero, costUsd: 0, requestId: null, error: { code: "no_writer_call", message: "작가는 다시 부르지 않는다" } };
    }
    return gate.stream(input);
  };
  const stored2 = rawCache(raw);
  const cache = { get: async (key: string) => (await stored2?.get(key)) ?? (await gate.cache.get(key)), put: (e: Parameters<typeof gate.cache.put>[0], m: Parameters<typeof gate.cache.put>[1]) => gate.cache.put(e, m) };
  const spent = Number(sql(`select coalesce(sum(cost_usd),0) from public.book_generation_runs where report_id='${reportId}'`)), cap = orderCostCap();
  const sink = { async save() { return true; }, async load() { return []; } };
  const writer = meta.writer;
  const built = await buildV5Snapshot({ payload: snap.evidencePacket.input, reportId, policyAt: snap.evidencePacket.generatedAt, sink: sink as never,
    deps: { provider: (writer?.provider ?? "anthropic") as never, model: writer?.model ?? "claude-sonnet-5-5", fallback: null, stream, cache: cache as never, costCapUsd: Math.max(0, cap - spent), rewriteSections: targets,
      people: async () => (snap.evidencePacket as unknown as { people: never[] }).people ?? [] } });
  const p6c = built.meta.safety.metrics?.p6c as Record<string, unknown> | undefined;
  const paid = gate.runSpent();
  const out = join(ROOT, ".cache/fix"); mkdirSync(out, { recursive: true });
  writeFileSync(join(out, `${reportId}.snapshot.json`), JSON.stringify(built.snapshot));
  writeFileSync(join(out, `${reportId}.final.md`), manuscript(built.snapshot.draft as never));
  const summary = { reportId, targets: targets.length, rewritten: p6c?.rewritten, rewriteTargets: p6c?.rewriteTargets, droppedSections: (p6c?.droppedSections as unknown[] | undefined)?.length ?? 0, remaining: p6c?.remaining, paidUsd: Number(paid.toFixed(6)), orderSpentBefore: spent, cap,
    calls: built.meta.calls.map(c => `${c.kind}${c.requestId === "stored" || c.cached ? "(저장본)" : ""}`) };
  console.log(JSON.stringify(summary));
  writeFileSync(join(ROOT, "docs/v5/final", `fix-sections-${reportId}.md`), `# 궁합 장면 주인 고침 — ${reportId}\n\n사유: 최종판 1-5 장면 주인 규칙 결함(같은 쪽 두 사람 가운데 낮은 사람을 반대 끝으로 적음). 발행 당시 브리프와 지금 브리프의 rel.who가 다른 소제목만 재작성(작가 다시 부르지 않음).\n\n${notes.join("\n")}\n\n결과: ${JSON.stringify(summary)}\n`);
  if (!publish) return;
  if (!p6c?.rewritten) { console.error("재작성이 적용되지 않았다 — 발행본을 바꾸지 않는다"); process.exit(4); }
  const snapJson = JSON.stringify(built.snapshot).replace(/\$snap\$/g, "");
  console.log(sql(`begin;
insert into public.book_snapshot_versions(report_id,edition,snapshot_json,reason) select report_id,'previous',snapshot_json,'final:fix-owners 궁합 장면 주인 고침 전(소제목 ${targets.length}개 재작성)' from public.paid_report_snapshots where report_id='${reportId}';
update public.paid_report_snapshots set snapshot_json=jsonb_set($snap$${snapJson}$snap$::jsonb,'{createdAtIso}',coalesce(snapshot_json->'createdAtIso',to_jsonb(published_at))) where report_id='${reportId}';
insert into public.book_generation_runs(report_id,lane,provider,model,edition,outcome,reason,cost_usd,duration_ms) values('${reportId}','regenerate','anthropic','${writer?.model ?? "claude-sonnet-5-5"}','official','replaced','final:fix-owners 소제목 ${targets.length}개 재작성(장면 주인 규칙 결함)',${paid.toFixed(8)},0);
commit;
select 'published '||count(*) from public.book_snapshot_versions where report_id='${reportId}';`));
}
void main().catch(e => { console.error(String(e instanceof Error ? e.stack : e)); process.exit(1); });
