/**
 * 최종판3 12 고침: 판정에서 찾은 차단 문장만 고친다(그 소제목 안의 그 문장만 — 다른 문장·소제목·장은 그대로).
 *   NODE_PATH=tools/llm/shim pnpm exec tsx tools/final3/fix-book.ts <reportId> [--items <json>] [--cover-fallback "<사유>"] --budget <USD> [--publish] [--dry]
 * 순서(호출은 최대 1회):
 *   1) 결정론(호출 0): 처방 종류 이름만 말하는 문장(「처방은 지출 한도입니다.」)을 지우고, 렌더 겹침(「배우는 힘인 배우는 힘」)을 하나로 줄인다.
 *      --cover-fallback이면 표지를 엔진 기본 이미지(브리프 coreImage)로 바꾼다(1장 첫 소제목이 표지와 같으면 같이).
 *   2) 지금 검사(정답지 대조 포함)에 걸린 사실·금지 문장 + --items(판정 사람 판독: {chapter, section(1부터), sentence, problem}) → 문장 단위 수리 1회(작가 모델, 예산 관문).
 *   3) 다시 검사 → 남은 사실·금지 문장은 지운다(deleteFlagged). 열람 검사(projectV5Book) 통과를 확인한다.
 *   4) --publish: 로컬 DB 발행본을 바꾸고 이전 판을 book_snapshot_versions(previous)에, 비용을 book_generation_runs(regenerate)에 남긴다. meta.fixes에 전후를 적는다.
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { budgetArg, budgetGate, ensureScope } from "../llm/budget";
import { loadDevEnv, ROOT } from "../llm/env";
import { briefOfSnap, factSheetOfSnap, lintStored, loadSnap, manuscript } from "../final/replay";
import { buildWriterPrompt } from "../../src/lib/writer/prompt";
import { coverIssue, lintContext, writerKnowledge } from "../../src/lib/writer/publish";
import { applyRepair3, deleteFlagged, parseRepair3, repair3MaxTokens, repair3Prompt, repairItems, revertWorse, type AppliedRepair, type RepairItem } from "../../src/lib/writer/repair3";
import { HARD_RULES, lintBook, tidyBook } from "../../src/lib/writer/safety/p6c";
import { splitSentences } from "../../src/lib/writer/safety/patterns";
import type { FinalChapter } from "../../src/lib/writer/safety";
import { projectV5Book } from "../../src/lib/writer/book";
import { rawKey } from "../../src/lib/writer/runner";
import { PRESCRIPTION_LABEL, collapseRenderDup } from "../../src/lib/factsheet/check";

const sql = (q: string) => execFileSync("docker", ["exec", "-i", "supabase_db_gyeol-report", "psql", "-U", "postgres", "-At", "-v", "ON_ERROR_STOP=1"], { input: q, encoding: "utf8" }).trim();
type Manual = { chapter: number; section: number; sentence: string; problem: string };

async function main() {
  const argv = process.argv.slice(2), reportId = argv[0];
  if (!/^report_[a-z0-9]+$/.test(reportId ?? "")) { console.error("사용: fix-book.ts <reportId> [--items <json>] [--cover-fallback <사유>] --budget <USD> [--publish] [--dry]"); process.exit(2); }
  const dry = argv.includes("--dry"), publish = argv.includes("--publish"), budget = dry ? 0 : budgetArg(process.argv);
  const itemsPath = argv[argv.indexOf("--items") + 1], coverWhy = argv.includes("--cover-fallback") ? argv[argv.indexOf("--cover-fallback") + 1] : null;
  // --cover-repair "<문제>": 표지를 같은 수리 호출 안에서 다시 쓴다(규칙에 걸리면 엔진 기본 이미지).
  const coverFix = argv.includes("--cover-repair") ? argv[argv.indexOf("--cover-repair") + 1] : null;
  const manual: Manual[] = argv.includes("--items") ? JSON.parse(readFileSync(itemsPath, "utf8")) : [];
  loadDevEnv();
  const { snap } = await loadSnap(reportId);
  const meta = snap.evidencePacket.meta!, d = snap.draft as typeof snap.draft & { coverLine?: string; coreImage?: { line: string }; finalLine?: string };
  const brief = briefOfSnap(snap), { k } = writerKnowledge(), plan = buildWriterPrompt(brief, { knowledge: k }).chapters, sheet = factSheetOfSnap(snap, brief);
  const lctx = lintContext(brief, k, plan, [], undefined, sheet);
  let chapters: FinalChapter[] = d.chapters.map(c => ({ n: c.n, id: c.id, title: c.title, source: "writer", chars: 0, sections: c.sections.map(x => ({ heading: x.heading, paragraphs: [...x.paragraphs] })), ...(c.keys ? { keys: c.keys } : {}) }) as FinalChapter);
  const det: { at: string; before: string; after: string; why: string }[] = [];
  // 1) 결정론.
  chapters = chapters.map(c => ({ ...c, sections: c.sections.map((s, si) => ({ ...s, paragraphs: s.paragraphs.map((p, pi) => {
    const ss = splitSentences(p), keep = ss.filter(x => { if (PRESCRIPTION_LABEL.test(x)) { det.push({ at: `${c.n}.${si}.${pi}`, before: x, after: "(삭제)", why: "처방 종류 이름 노출" }); return false; } return true; });
    let out = keep.length === ss.length ? p : keep.join(" ");
    const col = collapseRenderDup(out); if (col !== out) { det.push({ at: `${c.n}.${si}.${pi}`, before: out, after: col, why: "렌더 겹침(「X인 X」)" }); out = col; }
    return out;
  }) })) }));
  let cover = d.coverLine ?? d.coreImage?.line ?? "";
  const oldCover = cover;
  if (coverWhy) {
    const next = brief.chart.coreImage.line;
    det.push({ at: "cover", before: cover, after: next, why: `표지: ${coverWhy} → 엔진 기본 이미지` });
    if (chapters[0]?.sections[0]?.heading === cover) chapters[0] = { ...chapters[0], sections: chapters[0].sections.map((s, i) => (i === 0 ? { ...s, heading: next } : s)) };
    cover = next;
  }
  // 1-2) 발행 때 수리가 지금 검사에 걸리면 그 수리 전 원문으로 되돌린다(호출 0) — 판독: 검수 오탐(음양 2:6 거꾸로) → 수리가 맞는 문장을 틀리게 고침.
  let tidy = tidyBook(chapters, lctx).chapters;
  const prior = ((meta as { review?: { repair?: { applied?: AppliedRepair[] } } }).review?.repair?.applied ?? []);
  const back = revertWorse(tidy, prior, lintBook(tidy, lctx).filter(f => HARD_RULES.has(f.rule) && f.sentence !== d.finalLine));
  for (const x of back.reverted) det.push({ at: x.at, before: x.after, after: x.before, why: `발행 때 수리가 검사(${x.rule})에 걸림 → 수리 전 원문` });
  if (back.reverted.length) tidy = tidyBook(back.chapters, lctx).chapters;
  // --sync-heading: 1장 첫 소제목을 표지 한 줄과 맞춘다(종합 「나를 한 줄로」, 호출 0).
  if (argv.includes("--sync-heading") && tidy[0]?.sections[0] && tidy[0].sections[0].heading !== cover) {
    det.push({ at: "1.0.heading", before: tidy[0].sections[0].heading, after: cover, why: "1장 첫 소제목 = 표지 한 줄" });
    tidy = [{ ...tidy[0], sections: tidy[0].sections.map((s, i) => (i === 0 ? { ...s, heading: cover } : s)) }, ...tidy.slice(1)];
  }
  // 2) 수리 항목: 지금 검사의 사실·금지 깃발 + 사람 판독 항목.
  const hard = lintBook(tidy, lctx).filter(f => HARD_RULES.has(f.rule) && f.sentence !== d.finalLine);
  const items: RepairItem[] = repairItems({ chapters: tidy, flags: hard, issues: [], numbered: [] });
  for (const m of manual) {
    const ch = tidy.find(c => c.n === m.chapter), sec = ch?.sections[m.section - 1];
    const pi = sec?.paragraphs.findIndex(p => p.includes(m.sentence)) ?? -1;
    if (!sec || pi < 0) { console.error(`찾지 못함: ${m.chapter}.${m.section} 「${m.sentence.slice(0, 40)}」`); process.exit(3); }
    const original = splitSentences(sec.paragraphs[pi]).find(x => x.includes(m.sentence)) ?? m.sentence;
    const had = items.find(it => it.chapter === m.chapter && it.section === m.section - 1 && it.original === original);
    if (had) had.problems.push(m.problem); else items.push({ id: items.length + 1, kind: "sentence", chapter: m.chapter, section: m.section - 1, paragraph: pi, original, problems: [m.problem], source: ["review"] });
  }
  if (coverFix) items.push({ id: items.length + 1, kind: "cover", chapter: 0, section: 0, paragraph: -1, original: cover, problems: [`표지: ${coverFix}. 공백 빼고 16~26자, 명사로 끝나는 그림 한 줄, 직업·직업 장소·업무 소품·나이 금지`], source: ["cover"] });
  console.log(`결정론 ${det.length} · 수리 항목 ${items.length}(검사 ${hard.length} · 판독 ${manual.length}${coverFix ? " · 표지 1" : ""})`);
  for (const x of det) console.log(`  [결정론] ${x.at} ${x.why}: 「${x.before.slice(0, 80)}」 → 「${x.after.slice(0, 80)}」`);
  for (const it of items) console.log(`  [R${it.id}] ${it.chapter}.${it.section + 1}.${it.paragraph} 「${it.original.slice(0, 90)}」 — ${it.problems.join(" / ").slice(0, 160)}`);
  let fixed = tidy, applied: ReturnType<typeof applyRepair3>["applied"] = [], cost = 0, rawEntry: Record<string, unknown> | null = null;
  const model = meta.writer?.model ?? "claude-sonnet-5-5";
  if (items.length) {
    const p = repair3Prompt(sheet, brief, tidy, items), maxTokens = repair3MaxTokens(p.chars, items.length, model);
    if (dry) { console.log(`(dry) 수리 입력 ${p.system.length + p.user.length}자 · max_tokens ${maxTokens}`); return; }
    ensureScope("final3", 4.0, "최종판3 명령 전체 합계 상한(덕짱님 지시 2026-11-05)");
    const gate = budgetGate({ scope: "final3", run: `fix-${reportId}`, runBudget: budget, stage: `최종판3 12 차단 문장 고침 · 문장 ${items.length}` });
    const key = rawKey(model, p.system, p.user), hit = await gate.cache.get(key);
    let text = hit?.text ?? "";
    if (!hit) {
      const r = await gate.stream({ provider: "anthropic", model, system: p.system, user: p.user, maxOutputTokens: maxTokens, timeoutMs: 300_000 });
      text = r.text; cost = r.costUsd ?? 0;
      if (!r.text) { console.error(`수리 호출 실패: ${r.finishReason} ${r.error?.code ?? ""}`); process.exit(4); }
      await gate.cache.put({ key, kind: "repair", provider: "anthropic", model, finish: r.finishReason, text: r.text, costUsd: cost }, { system: p.system, user: p.user });
    }
    rawEntry = { key, kind: "repair", provider: "anthropic", model, finish: "complete", text, costUsd: cost };
    const a = applyRepair3(tidy, items, parseRepair3(text)); fixed = a.chapters; applied = a.applied;
    if (coverFix) {
      const c = a.cover ?? "", iss = coverIssue(c, brief, brief.chart.avoidImages ?? []);
      const next = c && (!iss || iss.level === "length") ? c : brief.chart.coreImage.line;
      det.push({ at: "cover", before: cover, after: next, why: `표지 수리: ${coverFix}${next === c ? "" : ` → 수리 표지 「${c}」가 ${iss?.reason ?? "없음"}라 엔진 기본 이미지`}` });
      if (fixed[0]?.sections[0]?.heading === cover) fixed = [{ ...fixed[0], sections: fixed[0].sections.map((s, i) => (i === 0 ? { ...s, heading: next } : s)) }, ...fixed.slice(1)];
      cover = next;
    }
  }
  // 3) 다시 검사 → 남은 사실·금지 문장은 지운다.
  let re = tidyBook(fixed, lctx).chapters, left = lintBook(re, lctx).filter(f => HARD_RULES.has(f.rule) && f.sentence !== d.finalLine);
  const rv = revertWorse(re, applied, left);
  if (rv.reverted.length) { re = tidyBook(rv.chapters, lctx).chapters; left = lintBook(re, lctx).filter(f => HARD_RULES.has(f.rule) && f.sentence !== d.finalLine); }
  for (const x of rv.reverted) console.log(`  되돌림 ${x.at} ${x.rule}: 「${x.after.slice(0, 80)}」 → 원문 「${x.before.slice(0, 80)}」`);
  const del = deleteFlagged(re, left, HARD_RULES);
  const finalChapters = del.chapters;
  const chaptersOut = d.chapters.map(c => { const n = finalChapters.find(x => x.n === c.n)!; return { ...c, sections: c.sections.map((s, i) => ({ ...s, heading: n.sections[i].heading, paragraphs: n.sections[i].paragraphs })) }; });
  const fix = { at: new Date().toISOString(), kind: "final3_block_fix", deterministic: det, items: items.map(it => ({ at: `${it.chapter}.${it.section}.${it.paragraph}`, original: it.original, problems: it.problems })), applied, reverted: rv.reverted, deleted: del.deleted, costUsd: Number(cost.toFixed(6)), ...(rawEntry ? { raw: [rawEntry.key] } : {}) };
  const next = { ...snap, draft: { ...d, chapters: chaptersOut, ...(cover !== oldCover ? { coverLine: cover, ...(d.coreImage ? { coreImage: { ...d.coreImage, line: cover } } : {}) } : {}) },
    evidencePacket: { ...snap.evidencePacket, meta: { ...meta, raw: [...(meta.raw ?? []), ...(rawEntry ? [rawEntry] : [])], chapters: meta.chapters.map(c => ({ ...c, chars: (finalChapters.find(x => x.n === c.n)?.sections.flatMap(s => s.paragraphs).join("").length) ?? c.chars })),
      fixes: [...((meta as { fixes?: unknown[] }).fixes ?? []), fix] } as never } } as typeof snap;
  const after = lintStored(next).flags.filter(f => HARD_RULES.has(f.rule) && f.sentence !== d.finalLine);
  if (!projectV5Book(next as never)) { console.error("열람 검사(projectV5Book) 실패 — 발행본을 바꾸지 않는다"); process.exit(5); }
  const out = join(ROOT, ".cache/final3/fix"); mkdirSync(out, { recursive: true });
  writeFileSync(join(out, `${reportId}.json`), JSON.stringify(fix, null, 1)); writeFileSync(join(out, `${reportId}.md`), manuscript(next.draft as never));
  console.log(JSON.stringify({ reportId, deterministic: det.length, items: items.length, applied: applied.length, deleted: del.deleted.length, leftHard: after.length, costUsd: Number(cost.toFixed(6)) }));
  for (const a of applied) console.log(`  수리 ${a.at}: 「${a.before.slice(0, 90)}」 → 「${a.after.slice(0, 90)}」`);
  for (const x of del.deleted) console.log(`  지움 ${x.at} ${x.rule}${x.kept ? `(남김: ${x.kept})` : ""}: ${x.sentence.slice(0, 90)}`);
  if (after.length) { console.error(after.map(f => `남음 ${f.chapter}.${f.section} ${f.rule}: ${f.sentence.slice(0, 100)}`).join("\n")); process.exit(6); }
  if (!publish) return;
  const snapJson = JSON.stringify(next).replace(/\$snap\$/g, "");
  console.log(sql(`begin;
insert into public.book_snapshot_versions(report_id,edition,snapshot_json,reason) select report_id,'previous',snapshot_json,'final3:fix 차단 문장 고침 전(결정론 ${det.length}, 수리 ${items.length})' from public.paid_report_snapshots where report_id='${reportId}';
update public.paid_report_snapshots set snapshot_json=jsonb_set($snap$${snapJson}$snap$::jsonb,'{createdAtIso}',coalesce(snapshot_json->'createdAtIso',to_jsonb(published_at))) where report_id='${reportId}';
insert into public.book_generation_runs(report_id,lane,provider,model,edition,outcome,reason,cost_usd,duration_ms) values('${reportId}','regenerate','anthropic','${model}','official','replaced','final3:fix 차단 문장 ${items.length}개 수리 + 결정론 ${det.length}',${cost.toFixed(8)},0);
commit;
select 'published '||count(*) from public.book_snapshot_versions where report_id='${reportId}';`));
}
void main().catch(e => { console.error(String(e instanceof Error ? e.stack ?? e.message : e)); process.exit(1); });
