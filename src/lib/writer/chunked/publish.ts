/**
 * AM2 — 세운·대운 발행(장 묶음 작가). 운영(⑦ 감독)과 개발 도구가 같은 함수(buildV5Snapshot → 여기)를 쓴다.
 *   입력 → 브리프(엔진·지식 DB 그대로) → 입력 정화(근거 카드·짝·설계도) → 브리프 검사(걸리면 작가를 부르지 않는다)
 *   → 묶음 병렬 작성(묶음마다 부분 저장) → 표면 정리 → 차단 검사 → 걸린 묶음 다시 쓰기(「걸린 문장 + 이유」, 최대 2회)
 *   → 장 사이 반복(뒤쪽 묶음 1회) → 그래도 걸린 문장 삭제(문단이 서는지 확인) → 서지 않으면 그 장(·key)만 결정론 대체 → 머리 문장·렌더 → Book.
 * 문장 수리(repair3)·뜻을 바꾸는 정리(시점 말·해 이름 치환)·LLM 검수는 쓰지 않는다. 문체 깃발은 점수로만 남긴다(meta.review.style).
 */
import type { ProductPreviewSnapshot } from "@/lib/report-generation/productPreviewSnapshot";
import type { ReportInputPayload } from "@/lib/report-generation/reportInputTypes";
import { resolveLlmConfig } from "@/lib/llm";
import { assembleV5Book, createV5Snapshot, type WriterMeta } from "../book";
import { keywordsOf, renderChapter, type BookChapter } from "../format";
import { chapterPreview, type ChapterPreview } from "../preview";
import { buildWriterPrompt } from "../prompt";
import type { PriorBooks } from "../prior";
import { deleteFlagged, type Deleted } from "../repair3";
import { mergeRuns, WRITER_TIME_BUDGET_MS, type ChapterSink, type WriterOptions, type WriterRun } from "../runner";
import { applySafetyNet, safetyFacts, sentenceViolation, writeKeyFill, type DraftChapter, type FinalChapter } from "../safety";
import { enforce, HINT, lintBook, tidyBook, type LintCtx, type LintFlag, type P6cRule } from "../safety/p6c";
import { orphanStart } from "../safety/p6e";
import { splitSentences } from "../safety/patterns";
import { briefFor, briefHash, chooseCover, factSheetFor, insertFixedLines, kstDate, lintContext, renderTerms, v4People, writerKnowledge, type V5BuildDeps } from "../publish";
import { BLOCK_RULES, blockFlags, briefCheck, crossRepeats, styleScoreOf, type BlockCtx, type ChunkFlag } from "./check";
import { buildIntake } from "./intake";
import { chunkPlan, chunkRules, CHUNK_PROMPT_VERSION, renderCard, type Chunk } from "./prompt";
import { concurrency, rewriteChunk, writeChunks, type ChunkLog } from "./run";

/** 다시 쓰기 최대 횟수(묶음마다). */
export const CHUNK_REWRITE_ROUNDS = 2;
/** 다시 쓰기 이유 한 줄: 검사가 단 힌트(대운·세운 시점 말은 「'지금'을 어떤 꼴로도 쓰지 않는다」 같은 고칠 말 포함) + 세부. */
const reasonOf = (f: ChunkFlag) => `${f.hint ?? HINT[f.rule as P6cRule] ?? f.rule}${f.detail ? ` (${f.detail})` : ""}`;
const chunkOf = (chunks: readonly Chunk[], f: { chapter: number }, heading: string) => chunks.find(c => c.parts.some(p => p.n === f.chapter && (!p.keys || p.keys.includes(heading))));

export async function buildChunkedSnapshot(a: { payload: ReportInputPayload; reportId: string; policyAt: string; sink: ChapterSink; recover?: boolean; deps?: V5BuildDeps; prior?: PriorBooks }): Promise<{ snapshot: ProductPreviewSnapshot; meta: WriterMeta; run: WriterRun | null }> {
  const deps = a.deps ?? {};
  const now = deps.now ?? (() => Date.now()), started = now();
  const { k, version: knowledgeVersion } = writerKnowledge();
  const brief = briefFor(a.payload, a.policyAt, a.prior, deps.ledgerView, k);
  const plan = buildWriterPrompt(brief, { knowledge: k }).chapters;
  const wish = ((a.payload as { productOptions?: { wish?: unknown } }).productOptions)?.wish;
  const intake = buildIntake(brief, k, plan, typeof wish === "string" ? wish : undefined);
  const facts = safetyFacts(brief);
  const issues = briefCheck(intake, facts.nicknames ?? []);
  const chunks = chunkPlan(intake);
  const system = { rules: chunkRules(intake.product), card: renderCard(intake) };
  const llm = resolveLlmConfig();
  const provider = deps.provider ?? llm.provider, model = deps.model ?? llm.model;
  const fallbackTarget = deps.fallback === undefined ? llm.fallback : deps.fallback;
  const fb = fallbackTarget && (fallbackTarget.provider !== provider || fallbackTarget.model !== model) ? fallbackTarget : null;
  const budget = deps.budgetMs ?? WRITER_TIME_BUDGET_MS;
  const sheet = factSheetFor(a.payload, a.policyAt, brief, k);
  const lctx: LintCtx = lintContext(brief, k, plan, a.prior?.sentences ?? [], undefined, sheet);
  const sink: ChapterSink = { save: c => { let preview: ChapterPreview | undefined; try { preview = chapterPreview(c, lctx, plan.find(p => p.n === c.n)); } catch { preview = undefined; } return a.sink.save({ ...c, total: plan.length, ...(preview ? { preview } : {}) }); }, load: () => a.sink.load() };
  const envCap = Number(process.env.LLM_MAX_OUTPUT_TOKENS);
  // 장 묶음은 같은 책의 묶음 6개가 접두부를 함께 쓰므로 캐시를 늘 켠다(LLM_PROMPT_CACHE와 무관, deps.cacheSystem=false만 끈다).
  const opts = (cap?: number): WriterOptions => ({ brief, provider: provider!, model: model!, sink, knowledge: k, ...(envCap > 0 ? { maxOutputTokens: envCap } : {}), cacheSystem: true, ...deps, budgetMs: budget - (now() - started), fallback: fb, ...(cap !== undefined ? { costCapUsd: cap } : {}) });

  const runs: WriterRun[] = [];
  let drafts = new Map<number, DraftChapter>(), texts = new Map<string, string>(), log: ChunkLog[] = [];
  const briefOk = issues.length === 0;
  if (!a.recover && model && briefOk) {
    try { const w = await writeChunks({ o: opts(), intake, chunks, plan, system, sink }); if (w.run) runs.push(w.run); drafts = w.drafts; texts = w.texts; log = w.log; }
    catch { drafts = new Map(); }
  }
  if (a.recover || !runs.length) { try { for (const s of await a.sink.load()) if (!drafts.has(s.n)) drafts.set(s.n, { chapter: s.chapter, source: s.source }); } catch { /* 결정론 작가로만 */ } }
  const run0 = runs.length ? mergeRuns(runs) : null;
  const live = Boolean(run0?.writer && !run0.stale);
  const spent = () => runs.reduce((x, r) => x + r.costUsd, 0);
  const capLeft = () => (deps.costCapUsd === undefined ? Infinity : deps.costCapUsd - spent());

  // 정리·검사(호출 0).
  const yearsToNext = (() => { const cd = brief.chart.currentDayun; const y = Number(brief.timeline?.entries.find(e => e.kind === "year")?.key) || brief.chart.thisYear.year; return cd?.next?.startYear ? cd.next.startYear - y : undefined; })();
  const bctx: BlockCtx = { intake, ...(brief.mbti ? { mbtiAnchor: new RegExp([brief.mbti.type, ...(k.mbti.get(brief.mbti.type as never)?.cognitiveFunctions ?? []).map(f => f.code)].join("|")) } : {}), ...(yearsToNext !== undefined ? { yearsToNextDayun: yearsToNext } : {}) };
  const build = () => { const net = applySafetyNet(brief, plan, drafts, { priorSentences: a.prior?.sentences ?? [], surfaceOnly: true }); const t = tidyBook(net.chapters, { ...lctx, surfaceOnly: true }); return { net, chapters: t.chapters, tidy: t.count }; };
  const inspect = (chs: readonly FinalChapter[]) => { const lint = lintBook(chs, lctx); return { lint, block: blockFlags(chs, lint, bctx).filter(f => chs.find(c => c.n === f.chapter)?.source !== "deterministic") }; };
  let cur = build(), seen = inspect(cur.chapters);
  const firstBlock = seen.block.length;
  const rounds: { round: number; chunks: string[]; flags: number }[] = [];
  /** 걸린 깃발을 묶음별로. */
  const byChunk = (flags: readonly ChunkFlag[]) => { const m = new Map<Chunk, ChunkFlag[]>(); for (const f of flags) { const h = cur.chapters.find(c => c.n === f.chapter)?.sections[f.section]?.heading ?? ""; const c = chunkOf(chunks, f, h); if (c) m.set(c, [...(m.get(c) ?? []), f]); } return m; };
  const previousOf = (c: Chunk) => c.parts.map(p => { const d = drafts.get(p.n); if (!d) return ""; return renderChapter(p.keys ? { ...d.chapter, sections: d.chapter.sections.filter(s => p.keys!.includes(s.heading)) } : d.chapter); }).filter(Boolean).join("\n\n");
  const rewrite = async (all: Map<Chunk, ChunkFlag[]>, round: number) => {
    // 주문 상한 안에서 깃발이 많은 묶음부터(묶음 하나 다시 쓰기 약 $0.05~0.08: 입력 캐시 + 출력 4천 자 + 생각).
    const fit = Math.floor(capLeft() / 0.08);
    const targets = new Map([...all].sort((x, y) => y[1].length - x[1].length).slice(0, Math.max(0, fit)));
    if (!live || !targets.size) return false;
    rounds.push({ round, chunks: [...targets.keys()].map(c => c.id), flags: [...targets.values()].reduce((x, v) => x + v.length, 0) });
    const queue = [...targets];
    await Promise.all(Array.from({ length: Math.min(concurrency(), queue.length) }, async () => { for (let next = queue.shift(); next; next = queue.shift()) { const [c, fs] = next;
      const r = await rewriteChunk({ o: opts(Math.max(0, capLeft())), intake, chunks, plan, system, sink, chunk: c, previous: previousOf(c), issues: fs.slice(0, 12).map(f => ({ sentence: f.sentence, reason: reasonOf(f) })), round, drafts });
      runs.push(r.run); log.push(r.log);
      if (r.text) { texts.set(c.id, r.text); for (const n of r.changed) { const d = drafts.get(n)!; await sink.save({ n, chapter: d.chapter, source: d.source }); } }
    } }));
    return true;
  };
  // 1) 차단 결함: 걸린 묶음을 다시 쓴다(최대 2회).
  for (let round = 1; round <= CHUNK_REWRITE_ROUNDS && seen.block.length; round++) {
    if (!(await rewrite(byChunk(seen.block), round))) break;
    cur = build(); seen = inspect(cur.chapters);
  }
  // 2) 장 사이 반복: 뒤쪽 묶음만 1회(다시 쓴 원고가 차단 결함을 새로 만들면 앞 원고로 되돌린다).
  const repeats = crossRepeats(cur.chapters);
  const repeatFirst = repeats.length;
  if (repeats.length) {
    const before = new Map(drafts), blockBefore = seen.block.length;
    const targets = byChunk(repeats.filter(f => !seen.block.some(b => b.chapter === f.chapter)));
    if (targets.size && await rewrite(targets, CHUNK_REWRITE_ROUNDS + 1)) {
      const next = build(), ns = inspect(next.chapters);
      if (ns.block.length > blockBefore) { drafts = before; cur = build(); seen = inspect(cur.chapters); rounds.push({ round: -1, chunks: ["repeat_reverted"], flags: ns.block.length }); }
      else { cur = next; seen = ns; }
    }
  }
  // 3) 그래도 걸린 문장은 지운다. 문단이 서지 않으면(기댄 다음 문장 · 마지막 문단 · 지운 뒤 고아 시작 · 한 문장만 남음) 그 장(·key)만 결정론으로.
  let chapters = cur.chapters;
  const del = deleteFlagged(chapters, seen.block.map(f => ({ ...f, rule: f.rule as P6cRule, hint: "" }) as LintFlag), BLOCK_RULES);
  chapters = del.chapters;
  const replaced: { chapter: number; key?: string; why: string }[] = [];
  const empty: { chapter: number; key: string }[] = [];
  const replace = (n: number, why: string, key?: string) => { if (replaced.some(r => r.chapter === n && r.key === key)) return; replaced.push({ chapter: n, ...(key ? { key } : {}), why }); };
  for (const d of del.deleted.filter(x => x.kept)) { const [n, si] = d.at.split(".").map(Number); const c = chapters.find(x => x.n === n); const h = c?.sections[si]?.heading; replace(n, `${d.rule}:${d.kept}`, c?.keys?.includes(h ?? "") ? h : undefined); }
  for (const d of del.deleted.filter(x => !x.kept)) {
    const [n, si, pi] = d.at.split(".").map(Number); const c = chapters.find(x => x.n === n), s = c?.sections[si]; if (!c || !s) continue;
    const p = s.paragraphs[pi] ?? "", ss = splitSentences(p);
    if ((p && ss[0] && orphanStart(ss[0].replace(/[⟪⟫]/g, ""))) || !s.paragraphs.length) replace(n, `${d.rule}:hole`, c.keys?.includes(s.heading) ? s.heading : undefined);
  }
  { const after = inspect(chapters); for (const f of after.block) { const c = chapters.find(x => x.n === f.chapter), h = c?.sections[f.section]?.heading; replace(f.chapter, `${f.rule}:left`, c?.keys?.includes(h ?? "") ? h : undefined); } }
  if (replaced.length) {
    chapters = chapters.map(c => {
      const keys = replaced.filter(r => r.chapter === c.n && r.key).map(r => r.key!), whole = replaced.some(r => r.chapter === c.n && !r.key);
      if (whole && !c.keys) return { ...c, sections: c.sections.map(s => ({ ...s, paragraphs: [] })) };
      for (const key of whole ? c.keys ?? [] : keys) empty.push({ chapter: c.n, key });
      return { ...c, sections: c.sections.map(s => (whole || keys.includes(s.heading) ? { ...s, paragraphs: [] } : s)) };
    });
    chapters = writeKeyFill(brief, plan, chapters, empty).map(c => (replaced.some(r => r.chapter === c.n && !r.key && !c.keys) ? { ...c, source: "deterministic" as const } : c));
  }
  // 결정론 장(작가가 못 쓴 장 · 대체한 장)도 사실·금지 규칙 문단은 뺀다(기존 안전망과 같은 규칙, 빈 key는 다시 결정론으로).
  { const lint = lintBook(chapters, lctx), det = new Set(chapters.filter(c => c.source === "deterministic" || replaced.some(r => r.chapter === c.n)).map(c => c.n));
    const e = enforce(chapters, lint.filter(f => det.has(f.chapter) && (!chapters.find(c => c.n === f.chapter)?.keys || replaced.some(r => r.chapter === f.chapter && (!r.key || chapters.find(c => c.n === f.chapter)?.sections[f.section]?.heading === r.key)) || chapters.find(c => c.n === f.chapter)?.source === "deterministic")));
    if (e.droppedParagraphs) chapters = writeKeyFill(brief, plan, e.chapters, e.emptyKeys); }
  const final = inspect(chapters);
  chapters = insertFixedLines(chapters, brief);
  const rendered = renderTerms(chapters, brief, k); chapters = rendered.chapters;

  // 표지·키워드(1장이 든 묶음의 원문). 사실·금지 규칙에 걸리면 엔진 값.
  const firstText = [...texts.entries()].find(([id]) => chunks.find(c => c.id === id)?.parts.some(p => p.n === 1))?.[1] ?? "";
  const writerCover = (firstText.split(/\n##\s/)[0].match(/^\s*\[표지\]\s*(.+?)\s*$/m)?.[1] ?? "").replace(/[*"“”]/g, "").trim();
  const avoid = brief.chart.avoidImages ?? [];
  const cover = chooseCover([{ line: writerCover, source: "writer" }], brief, avoid);
  const kwRaw = keywordsOf(firstText);
  const keywords = kwRaw && kwRaw.every(w => !sentenceViolation(w, facts) && !/(합격|결혼|이별|승진|이직|대박|부자|성공)/.test(w)) ? kwRaw : null;
  const run = runs.length ? mergeRuns(runs) : null;
  const byRule = (fs: readonly { rule: string }[]) => fs.reduce<Record<string, number>>((o, x) => ({ ...o, [x.rule]: (o[x.rule] ?? 0) + 1 }), {});
  const review: Record<string, unknown> = {
    mode: "chunked", version: CHUNK_PROMPT_VERSION, model: null, calls: 0, skipped: "chunked_no_review",
    briefCheck: { ok: briefOk, issues: issues.slice(0, 40) }, chunks: chunks.map(c => ({ id: c.id, parts: c.parts, chars: c.chars })), log,
    blockFirst: firstBlock, rounds, repeatFirst, deleted: del.deleted.filter((d: Deleted) => !d.kept), keptWithRecord: del.deleted.filter((d: Deleted) => d.kept), replaced,
    remainingHard: final.block.map(f => ({ at: `${f.chapter}.${f.section}.${f.paragraph}`, rule: f.rule, detail: f.detail ?? "", sentence: f.sentence.slice(0, 200) })),
    remainingRepeat: crossRepeats(chapters).map(f => ({ at: `${f.chapter}.${f.section}.${f.paragraph}`, rule: f.rule, detail: f.detail ?? "", sentence: f.sentence.slice(0, 160) })),
    style: styleScoreOf(final.lint), cover: { source: cover.source, firstProblem: cover.issue },
  };
  const report = { ...cur.net.report, metrics: { ...(cur.net.report.metrics as NonNullable<typeof cur.net.report.metrics>), p6c: { tidy: cur.tidy, flags: byRule(seen.lint), repairTargets: 0, repaired: 0, repairCalls: 0, redoCalls: 0, redoChapters: [], remaining: byRule(final.lint), removed: 0, droppedParagraphs: 0,
    dropped: [], cover: cover.source === "fallback" ? "fallback" as const : "writer" as const, cardFlags: final.lint.filter(f => f.card).map(f => `${f.chapter}.${f.section}.${f.card}:${f.rule}`), hanjaStripped: cur.tidy.hanja ?? 0, termsAnnotated: rendered.count, image: { line: cover.line, overlap: [], repairCalls: 0 } } } };
  const people = await (deps.people ?? v4People)(a.payload, a.policyAt);
  const { draft, evidence } = assembleV5Book({
    brief, plan, finals: chapters, report, payload: a.payload, generatedAt: a.policyAt, people, cover: cover.line, ...(brief.product === "annual_fortune" ? { keywords } : {}), image: cover.line, raw: run?.raw ?? [], ...(a.prior?.ledger ? { priorLedger: a.prior.ledger } : {}),
    badCards: new Set(final.lint.filter(f => f.card).map(f => `${f.chapter}.${f.section}.${f.card}`)), review, ...(deps.testRun || process.env.LLM_TEST_RUN === "1" ? { test: true } : {}),
    writer: run?.writer ?? null, fallback: run?.fallback ?? null, calls: run?.calls ?? [], tokens: { input: run?.usage.inputTokens ?? 0, cachedInput: run?.usage.cachedInputTokens ?? 0, output: run?.usage.outputTokens ?? 0 },
    costUsd: run?.costUsd ?? 0, durationMs: now() - started, briefHash: briefHash(brief), knowledgeVersion, promptVersion: CHUNK_PROMPT_VERSION, recovered: Boolean(a.recover), priorBooks: a.prior?.books ?? 0,
  });
  void kstDate; void (null as unknown as BookChapter);
  return { snapshot: createV5Snapshot({ reportId: a.reportId, createdAtIso: a.policyAt, draft, evidence }), meta: evidence.meta, run };
}
