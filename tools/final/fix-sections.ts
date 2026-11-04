/**
 * 최종판 4·5 실질 결함 고침: 발행된 책에서 결함 소제목만 다시 쓴다(사유 기록). 자동 대상 = 궁합 "브리프가 틀린 장면 주인을 준 소제목", 수동 대상 = --section <장>.<소제목> --reason <사유>.
 *   NODE_PATH=tools/llm/shim pnpm exec tsx tools/final/fix-sections.ts <reportId> --list            (대상만, 호출 0)
 *   NODE_PATH=tools/llm/shim pnpm exec tsx tools/final/fix-sections.ts <reportId> --budget <USD> [--publish]
 * - 대상: 발행 당시 작가에게 간 브리프(.cache/writer/<작가 호출 키>.json의 user)와 지금 브리프(최종판 1-5 주인 규칙 수정 뒤)의
 *   rel.who가 다른 소제목. 다른 소제목·장은 그대로 둔다.
 * - 같은 발행 함수(buildV5Snapshot): 작가 원고는 저장 원문(작가 다시 부르지 않음), 저장된 수리·표지 원문은 같은 입력 해시면 그대로,
 *   재작성(소제목) 1회만 새로 부른다(예산 관문 · 주문당 상한 $0.60 남은 몫).
 * - --splice: 발행본은 그대로 두고 결함 소제목만 이번 결과로 바꾼다(고침 원문은 meta.raw에 덧붙이고 meta.fixes에 기록).
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
import { HARD_RULES } from "../../src/lib/writer/safety/p6c";
import { budgetArg, budgetGate, ensureScope } from "../llm/budget";
import { loadDevEnv, ROOT } from "../llm/env";
import { briefOfSnap, lintStored, loadSnap, manuscript } from "./replay";

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
  // 수동 대상: --section <장>.<소제목(1부터)> --reason "<사유>"(판정에서 찾은 실질 결함, 사유를 기록한다).
  argv.forEach((a, i) => {
    if (a !== "--section") return;
    const m = (argv[i + 1] ?? "").match(/^(\d+)\.(\d+)$/), r = argv[argv.indexOf("--reason", i)  + 1];
    if (!m || !r) throw new Error("--section <장>.<소제목> --reason <사유>");
    targets.push({ chapter: Number(m[1]), section: Number(m[2]) - 1, reason: r });
    notes.push(`- ${m[1]}.${m[2]} (수동) 사유: ${r}`);
  });
  const kind = argv.includes("--section") ? "판정 실질 결함" : argv.includes("--relint") ? "새 검사(자녀 단정·조건 안내)" : "궁합 장면 주인 규칙 결함";
  console.log(`재작성 대상 소제목 ${targets.length}:\n${notes.join("\n")}`);
  // --relint: 강제 대상 없이 새 검사로만(걸린 문장 수리 → 남으면 그 소제목 재작성, 0-1 구조 그대로).
  const relint = argv.includes("--relint");
  if ((!targets.length && !relint) || list) return;

  ensureScope("final", 1.5, "최종판 명령 전체 합계 상한(덕짱님 지시 2026-11-04)");
  const gate = budgetGate({ scope: "final", run: `fix-${reportId}`, runBudget: budget, stage: `최종판 4·5 실질 결함 고침(${kind}) · 소제목 재작성 ${targets.length}` });
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
  writeFileSync(join(ROOT, "docs/v5/final", `fix-sections-${reportId}.md`), `# 실질 결함 고침(${kind}) — ${reportId}\n\n작가는 다시 부르지 않고 아래 소제목만 같은 발행 함수로 재작성했다.\n\n${notes.join("\n")}\n\n결과: ${JSON.stringify(summary)}\n`);
  const hardLeft = Object.keys((p6c?.remaining as Record<string, number> | undefined) ?? {}).filter(r => HARD_RULES.has(r as never));
  if (!p6c?.rewritten && !p6c?.repaired) { console.error("수리·재작성이 적용되지 않았다 — 발행본을 바꾸지 않는다"); process.exit(4); }
  if (hardLeft.length) console.log(`남은 사실·금지 깃발 ${hardLeft.join(",")} — 그 소제목은 발행 함수가 뺐다(droppedSections)`);
  // --splice: 발행본은 그대로 두고 결함이 있던 소제목만 이번 결과로 바꾼다(결함만 고친다). 대상 = 강제 대상 + 발행본에서 사실·금지 깃발이 걸린 소제목.
  // 수리를 다시 부르면 생성 때의 수리·재작성과 다른 문장이 나와 대상 밖 소제목까지 바뀐다(장덕민 연애 1.2가 생성 때 재작성 전 원문으로 돌아감).
  let finalSnap = built.snapshot as unknown as typeof snap;
  if (argv.includes("--splice")) {
    const keys = new Set([...targets.map(t => `${t.chapter}.${t.section}`), ...lintStored(snap).flags.filter(f => HARD_RULES.has(f.rule) && f.sentence !== (snap.draft as { finalLine?: string }).finalLine).map(f => `${f.chapter}.${f.section}`)]);
    const next = built.snapshot.draft as unknown as typeof snap.draft;
    const chapters = snap.draft.chapters.map(c => {
      const n = next.chapters.find(x => x.n === c.n)!;
      if (![...keys].some(k => k.startsWith(`${c.n}.`))) return c;
      if (n.sections.length !== c.sections.length) throw new Error(`${c.n}장 소제목 수가 다르다(${c.sections.length} → ${n.sections.length}) — 이어 붙이지 않는다`);
      // 한자 표기는 장마다 첫 등장 한 번(최종판 1-6): 이어 붙인 소제목과 원래 소제목에 같은 용어 표기가 겹치면 뒤의 것을 뺀다.
      const seen = new Set<string>(), once = (t: string) => t.replace(/([가-힣]+)\(([一-龥]+)\)/g, (all, ko: string, hz: string) => { const key = `${ko}|${hz}`; if (seen.has(key)) return ko; seen.add(key); return all; });
      return { ...c, sections: c.sections.map((x, i) => keys.has(`${c.n}.${i}`) ? n.sections[i] : x).map(x => ({ ...x, heading: x.heading, paragraphs: x.paragraphs.map(once) })) };
    });
    const known = new Set((meta.raw ?? []).map(e => e.key)), added = (built.meta.raw ?? []).filter(e => !known.has(e.key) && e.kind !== "first");
    finalSnap = { ...snap, draft: { ...snap.draft, chapters }, evidencePacket: { ...snap.evidencePacket, meta: { ...meta, raw: [...(meta.raw ?? []), ...added],
      fixes: [...((meta as { fixes?: unknown[] }).fixes ?? []), { at: new Date().toISOString(), kind, sections: [...keys].map(k => k.replace(/\.(\d+)$/, (_m, i) => `.${Number(i) + 1}`)), costUsd: Number(paid.toFixed(6)), raw: added.map(e => e.key) }] } as never } };
    const left = lintStored(finalSnap).flags.filter(f => HARD_RULES.has(f.rule) && f.sentence !== (snap.draft as { finalLine?: string }).finalLine);
    console.log(`이어 붙임: 소제목 ${[...keys].join(", ")} · 남은 사실·금지 깃발 ${left.length}`);
    if (left.length) { console.error(left.map(f => `${f.chapter}.${f.section} ${f.rule}: ${f.sentence.slice(0, 100)}`).join("\n")); process.exit(5); }
    writeFileSync(join(out, `${reportId}.spliced.md`), manuscript(finalSnap.draft as never));
  }
  if (!publish) return;
  const snapJson = JSON.stringify(finalSnap).replace(/\$snap\$/g, "");
  console.log(sql(`begin;
insert into public.book_snapshot_versions(report_id,edition,snapshot_json,reason) select report_id,'previous',snapshot_json,'final:fix 고침 전(${kind}, 소제목 ${targets.length ? `${targets.length}개` : "검사에 걸린 것"} 재작성)' from public.paid_report_snapshots where report_id='${reportId}';
update public.paid_report_snapshots set snapshot_json=jsonb_set($snap$${snapJson}$snap$::jsonb,'{createdAtIso}',coalesce(snapshot_json->'createdAtIso',to_jsonb(published_at))) where report_id='${reportId}';
insert into public.book_generation_runs(report_id,lane,provider,model,edition,outcome,reason,cost_usd,duration_ms) values('${reportId}','regenerate','anthropic','${writer?.model ?? "claude-sonnet-5-5"}','official','replaced','final:fix 소제목 ${targets.length ? `${targets.length}개` : "검사에 걸린 것"} 재작성(${kind})',${paid.toFixed(8)},0);
commit;
select 'published '||count(*) from public.book_snapshot_versions where report_id='${reportId}';`));
}
void main().catch(e => { console.error(String(e instanceof Error ? e.stack : e)); process.exit(1); });
