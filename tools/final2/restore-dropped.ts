/**
 * 빠진 소제목 되살리기(최종판2 4, 호출 0): 발행 때 검사에 걸려 빠진 소제목(meta p6c.droppedSections)을, 그때 받은 재작성 원문(meta.raw의 rewrite)으로
 * 지금 정리·검사(고친 후처리)를 다시 거쳐 그 자리에 되돌린다. 작가·수리·재작성은 다시 부르지 않는다(원장 변화 0).
 *   NODE_PATH=tools/llm/shim pnpm exec tsx tools/final2/restore-dropped.ts <reportId> [--publish]
 * - 되살린 소제목에 사실·금지 깃발이 남으면 발행본을 바꾸지 않는다.
 * - 한자 표기는 장마다 첫 등장 한 번(렌더 규칙), 책 끝 고지 한 줄은 마지막 소제목 끝으로 옮긴다.
 * - --publish: 이전 판은 book_snapshot_versions(previous), 기록은 book_generation_runs(regenerate, $0).
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { withKeySpan, type V5BookDraft } from "../../src/lib/writer/book";
import { buildWriterPrompt } from "../../src/lib/writer/prompt";
import { lintContext, renderTerms, writerKnowledge } from "../../src/lib/writer/publish";
import { parseRewrite } from "../../src/lib/writer/repair";
import type { FinalChapter } from "../../src/lib/writer/safety";
import { HARD_RULES, tidyBook } from "../../src/lib/writer/safety/p6c";
import { loadDevEnv, ROOT } from "../llm/env";
import { briefOfSnap, lintStored, loadSnap, manuscript } from "../final/replay";

const sql = (q: string) => execFileSync("docker", ["exec", "-i", "supabase_db_gyeol-report", "psql", "-U", "postgres", "-At", "-v", "ON_ERROR_STOP=1"], { input: q, encoding: "utf8" }).trim();
const norm = (s: string) => s.replace(/[\s?？.]/g, "");

async function main() {
  const reportId = process.argv[2], publish = process.argv.includes("--publish");
  if (!/^report_[a-z0-9]+$/.test(reportId ?? "")) { console.error("사용: restore-dropped.ts <reportId> [--publish]"); process.exit(2); }
  loadDevEnv();
  const { snap } = await loadSnap(reportId);
  const meta = snap.evidencePacket.meta! as typeof snap.evidencePacket.meta & { fixes?: unknown[] };
  const p6c = (meta.safety.metrics?.p6c ?? {}) as { droppedSections?: { at: string; heading: string; rules: string[] }[] };
  const dropped = p6c.droppedSections ?? [];
  if (!dropped.length) { console.log("빠진 소제목 없음"); return; }
  const rewrites = (meta.raw ?? []).filter(e => e.kind === "rewrite").flatMap(e => [...parseRewrite(e.text).values()]);
  const brief = briefOfSnap(snap), { k } = writerKnowledge(), plan = buildWriterPrompt(brief, { knowledge: k }).chapters, ctx = lintContext(brief, k, plan, []);
  const d = snap.draft as V5BookDraft & { finalLine: string };
  let chapters = d.chapters.map(c => ({ ...c, sections: c.sections.map(s => ({ ...s, paragraphs: [...s.paragraphs] })) }));
  const restored: string[] = [];
  // 뒤 자리부터 넣어야 앞 자리 번호가 바뀌지 않는다.
  for (const x of [...dropped].sort((a, b) => b.at.localeCompare(a.at, undefined, { numeric: true }))) {
    const [cn, si] = x.at.split(".").map(Number);
    const src = rewrites.find(r => norm(r.heading) === norm(x.heading));
    if (!src) { console.error(`${x.at} 「${x.heading}」: 재작성 원문이 없다 — 되살리지 않는다`); continue; }
    const ch = chapters.find(c => c.n === cn)!;
    const fin: FinalChapter = { n: cn, id: ch.id, title: ch.title, source: "writer", chars: 0, sections: [{ heading: src.heading, paragraphs: src.paragraphs }] };
    const tidied = tidyBook([fin], ctx).chapters[0];
    const rendered = renderTerms([tidied], brief, k).chapters[0].sections[0];
    const sec = withKeySpan(rendered);
    // 책 끝 고지는 마지막 소제목 끝에 한 번(insertFixedLines): 지금 위치에서 떼고 마지막 소제목으로 옮긴다.
    const sections = [...ch.sections.slice(0, si), sec, ...ch.sections.slice(si)].map(s => {
      const i = s.paragraphs.indexOf(d.finalLine); if (i < 0) return s;
      const spans = (s as { keySpans?: unknown[] }).keySpans;
      return { ...s, paragraphs: s.paragraphs.filter((_, j) => j !== i), ...(spans ? { keySpans: spans.filter((_, j) => j !== i) } : {}) };
    });
    const isLastChapter = cn === Math.max(...chapters.map(c => c.n));
    if (isLastChapter || ch.sections.some(s => s.paragraphs.includes(d.finalLine))) {
      const last = sections[sections.length - 1] as { paragraphs: string[]; keySpans?: unknown[] };
      sections[sections.length - 1] = { ...last, paragraphs: [...last.paragraphs, d.finalLine], ...(last.keySpans ? { keySpans: [...last.keySpans, null] } : {}) } as never;
    }
    // 한자 표기는 장마다 첫 등장 한 번.
    const seen = new Set<string>(), once = (t: string) => t.replace(/([가-힣]+)\(([一-龥]+)\)/g, (all, ko: string, hz: string) => { const key = `${ko}|${hz}`; if (seen.has(key)) return ko; seen.add(key); return all; });
    chapters = chapters.map(c => c.n !== cn ? c : { ...c, sections: sections.map(s => ({ ...s, paragraphs: s.paragraphs.map(once) })) }) as typeof chapters;
    restored.push(`${cn}.${si + 1} 「${src.heading}」(빠진 사유 ${x.rules.join(",")})`);
  }
  if (!restored.length) { console.error("되살린 소제목 없음"); process.exit(3); }
  const chars = (c: (typeof chapters)[number]) => c.sections.reduce((a, s) => a + s.paragraphs.join("").length, 0);
  const next = { ...snap, draft: { ...d, chapters }, evidencePacket: { ...snap.evidencePacket, meta: { ...meta, chapters: meta.chapters.map(m => { const c = chapters.find(x => x.n === m.n); return c ? { ...m, chars: chars(c) } : m; }),
    fixes: [...(meta.fixes ?? []), { at: new Date().toISOString(), kind: "restore_dropped", sections: restored, costUsd: 0, note: "발행 때 받은 재작성 원문 + 고친 정리(호출 0)" }] } } } as typeof snap;
  const left = lintStored(next).flags.filter(f => HARD_RULES.has(f.rule) && f.sentence !== d.finalLine && dropped.some(x => x.at === `${f.chapter}.${f.section}`));
  console.log(`되살림: ${restored.join(" · ")} · 되살린 소제목의 사실·금지 깃발 ${left.length}`);
  if (left.length) { console.error(left.map(f => `${f.chapter}.${f.section} ${f.rule}: ${f.sentence.slice(0, 100)}`).join("\n")); process.exit(5); }
  const out = join(ROOT, ".cache/fix"); mkdirSync(out, { recursive: true });
  writeFileSync(join(out, `${reportId}.restored.md`), manuscript(next.draft as never));
  if (!publish) return;
  const snapJson = JSON.stringify(next).replace(/\$snap\$/g, "");
  const reason = `final2: 빠진 소제목 되살림 ${restored.length}(호출 0, 고친 정리)`.slice(0, 200);
  console.log(sql(`begin;
insert into public.book_snapshot_versions(report_id,edition,snapshot_json,reason) select report_id,'previous',snapshot_json,'final2: 빠진 소제목 되살림 전' from public.paid_report_snapshots where report_id='${reportId}';
update public.paid_report_snapshots set snapshot_json=jsonb_set($snap$${snapJson}$snap$::jsonb,'{createdAtIso}',coalesce(snapshot_json->'createdAtIso',to_jsonb(published_at))) where report_id='${reportId}';
insert into public.book_generation_runs(report_id,lane,provider,model,edition,outcome,reason,cost_usd,duration_ms) values('${reportId}','regenerate','anthropic','${meta.writer?.model ?? "claude-sonnet-5-5"}','official','replaced','${reason}',0,0);
commit;
select 'published '||count(*) from public.book_snapshot_versions where report_id='${reportId}';`));
}
void main().catch(e => { console.error(String(e instanceof Error ? e.stack : e)); process.exit(1); });
