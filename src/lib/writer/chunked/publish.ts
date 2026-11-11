/**
 * AM2 — 세운·대운 발행(장 묶음 작가). 운영(⑦ 감독)과 개발 도구가 같은 함수(buildV5Snapshot → 여기)를 쓴다.
 *   입력 → 브리프(엔진·지식 DB 그대로) → 입력 정화(근거 카드·짝·설계도) → 브리프 검사(걸리면 작가를 부르지 않는다)
 *   → 묶음 병렬 작성(묶음마다 부분 저장) → 표면 정리 → 차단 검사 → 걸린 묶음 다시 쓰기(「걸린 문장 + 이유」, 최대 2회)
 *   → 장 사이 반복(뒤쪽 묶음 1회) → 그래도 걸린 문장 삭제(문단이 서는지 확인) → 서지 않으면 그 장(·key)만 결정론 대체 → 머리 문장·렌더 → Book.
 * 문장 수리(repair3)·뜻을 바꾸는 정리(시점 말·해 이름 치환)·LLM 검수는 쓰지 않는다. 문체 깃발은 점수로만 남긴다(meta.review.style).
 */
import type { Brief } from "@/lib/brief/schema";
import type { Knowledge } from "@/lib/brief/knowledge";
import type { ProductPreviewSnapshot } from "@/lib/report-generation/productPreviewSnapshot";
import type { ReportInputPayload } from "@/lib/report-generation/reportInputTypes";
import { resolveLlmConfig } from "@/lib/llm";
import { assembleV5Book, createV5Snapshot, type WriterMeta } from "../book";
import { keywordsOf, renderChapter, type BookChapter } from "../format";
import { chapterPreview, type ChapterPreview } from "../preview";
import { buildWriterPrompt } from "../prompt";
import type { PriorBooks } from "../prior";
import { mergeRuns, WRITER_TIME_BUDGET_MS, type ChapterSink, type WriterOptions, type WriterRun } from "../runner";
import { applySafetyNet, safetyFacts, sentenceViolation, writeKeyFill, type DraftChapter, type FinalChapter } from "../safety";
import { enforce, HINT, lintBook, tidyBook, type LintCtx, type P6cRule } from "../safety/p6c";
import { dayunPhase } from "../safety/lint";
import { briefFor, briefHash, chooseCover, coverIssue, factSheetFor, insertFixedLines, kstDate, lintContext, renderTerms, v4People, writerKnowledge, type V5BuildDeps } from "../publish";
import { adviceRepeats, blockFlags, briefCheck, crossRepeats, PIGGYBACK_RULES, styleScoreOf, type BlockCtx, type ChunkFlag } from "./check";
import { cutFlagged } from "./cut";
import { buildIntake, type Intake } from "./intake";
import { chunkPlan, chunkRules, CHUNK_PROMPT_VERSION, renderCard, type Chunk } from "./prompt";
import { concurrency, rewriteChunk, writeChunks, type ChunkLog } from "./run";

/** 다시 쓰기 최대 횟수(묶음마다). */
export const CHUNK_REWRITE_ROUNDS = 2;
/** 묶음 하나 다시 쓰기 어림 비용(주문 상한 안 다시 쓰기 수를 정한다). */
export const REWRITE_EST_USD = 0.05;
/** 다시 쓰기 이유 한 줄: 검사가 단 힌트(대운·세운 시점 말은 「'지금'을 어떤 꼴로도 쓰지 않는다」 같은 고칠 말 포함) + 세부. */
const reasonOf = (f: ChunkFlag) => `${f.hint ?? HINT[f.rule as P6cRule] ?? f.rule}${f.detail ? ` (${f.detail})` : ""}`;
const chunkOf = (chunks: readonly Chunk[], f: { chapter: number }, heading: string) => chunks.find(c => c.parts.some(p => p.n === f.chapter && (!p.keys || p.keys.includes(heading))));

/** 차단 검사 문맥(운영·도구 공통): 대운까지 남은 해 · MBTI 단서 · 일주 · key 흐름 세기. */
export function blockCtxFor(brief: Brief, k: Knowledge, intake: Intake): BlockCtx {
  const cd = brief.chart.currentDayun, y = Number(brief.timeline?.entries.find(e => e.kind === "year")?.key) || brief.chart.thisYear.year;
  const yearsToNext = cd?.next?.startYear ? cd.next.startYear - y : undefined;
  // 흐름 세기 끝값 검사(「가장 잔잔」): 반복 장 key만(세운 달 13 · 대운 해 10).
  const keyed = new Set(intake.chapters.flatMap(c => (c.keys ?? []).map(x => x.key)));
  const flows = new Map((brief.timeline?.entries ?? []).filter(e => keyed.has(e.key)).map(e => [e.key, { score: e.flow.score, ganji: e.ganji.hangul }] as const));
  return { intake, ...(brief.mbti ? { mbtiAnchor: new RegExp([brief.mbti.type, ...(k.mbti.get(brief.mbti.type as never)?.cognitiveFunctions ?? []).map(f => f.code)].join("|")), mbtiType: brief.mbti.type } : {}),
    ...(yearsToNext !== undefined ? { yearsToNextDayun: yearsToNext } : {}), dayPillar: brief.chart.pillars.day.hangul, flows,
    // key → 그 시기 관계 이름(공망 빼고, 「(반쯤)」 같은 꼬리 뗌, 두 글자 이상).
    keyRels: new Map((brief.timeline?.entries ?? []).filter(e => keyed.has(e.key)).map(e => [e.key, new Set(e.badges.filter(x => x.kind !== "GONGMANG").map(x => x.label.replace(/\(.*\)$/, "").trim()).filter(x => x.length >= 2))] as const)) };
}

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
  const lctx0: LintCtx = lintContext(brief, k, plan, a.prior?.sentences ?? [], undefined, sheet);
  // 세운 책의 대운 위치 검사도 책의 해 기준(입력 정화 shiftPhase와 같은 값).
  const shift = brief.product === "annual_fortune" ? (Number(brief.timeline?.entries.find(e => e.kind === "year")?.key) || brief.chart.thisYear.year) - brief.chart.thisYear.year : 0;
  const cdp = brief.chart.currentDayun?.phase;
  const lctx: LintCtx = shift > 0 && cdp && cdp.yearIndex - 1 + shift <= 9 ? { ...lctx0, dayunPhase: dayunPhase(cdp.yearIndex - 1 + shift) } : lctx0;
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
  const bctx = blockCtxFor(brief, k, intake);
  const build = () => { const net = applySafetyNet(brief, plan, drafts, { priorSentences: a.prior?.sentences ?? [], surfaceOnly: true }); const t = tidyBook(net.chapters, { ...lctx, surfaceOnly: true }); return { net, chapters: t.chapters, tidy: t.count }; };
  // 차단(block)과 경미(minor: 그 묶음을 다른 까닭으로 다시 쓸 때만 함께 고친다)를 나눈다.
  const inspect = (chs: readonly FinalChapter[]) => { const lint = lintBook(chs, lctx), all = blockFlags(chs, lint, bctx).filter(f => chs.find(c => c.n === f.chapter)?.source !== "deterministic"); return { lint, block: all.filter(f => !PIGGYBACK_RULES.has(f.rule)), minor: all.filter(f => PIGGYBACK_RULES.has(f.rule)) }; };
  let cur = build(), seen = inspect(cur.chapters);
  const firstBlock = seen.block.length;
  const rounds: { round: number; chunks: string[]; flags: number }[] = [];
  /** 걸린 깃발을 묶음별로. */
  const byChunk = (flags: readonly ChunkFlag[]) => { const m = new Map<Chunk, ChunkFlag[]>(); for (const f of flags) { const h = cur.chapters.find(c => c.n === f.chapter)?.sections[f.section]?.heading ?? ""; const c = chunkOf(chunks, f, h); if (c) m.set(c, [...(m.get(c) ?? []), f]); } return m; };
  const previousOf = (c: Chunk) => c.parts.map(p => { const d = drafts.get(p.n); if (!d) return ""; return renderChapter(p.keys ? { ...d.chapter, sections: d.chapter.sections.filter(s => p.keys!.includes(s.heading)) } : d.chapter); }).filter(Boolean).join("\n\n");
  const rewrite = async (all: Map<Chunk, ChunkFlag[]>, round: number) => {
    // 주문 상한 안에서 깃발이 많은 묶음부터. 묶음 하나 다시 쓰기 어림 $0.05(P 시범 실측 $0.029~0.048, 덕짱님 결정 2026-11-11 — 예전 어림 $0.08은 회차당 2묶음만 허용해 결정론 대체로 갔다).
    const fit = Math.floor(capLeft() / REWRITE_EST_USD);
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
  // 표지 줄(1장이 든 묶음 맨 앞): 길이·피할 낱말·사실 규칙에 걸리면 그 묶음 다시 쓰기에 함께 넣는다(P 시범: 두 책 모두 13자로 16~26자 미달).
  const chunk1 = chunks.find(c => c.parts.some(p => p.n === 1));
  const coverOf = (t: string) => (t.split(/\n##\s/)[0].match(/^\s*\[표지\]\s*(.+?)\s*$/m)?.[1] ?? "").replace(/[*"“”]/g, "").trim();
  const avoid = brief.chart.avoidImages ?? [];
  const firstOrig = chunk1 ? texts.get(chunk1.id) ?? "" : "";
  const coverFlags = (): ChunkFlag[] => {
    const line = chunk1 ? coverOf(texts.get(chunk1.id) ?? "") : ""; const i = line ? coverIssue(line, brief, avoid) : null;
    return i ? [{ chapter: 1, section: 0, paragraph: -2, rule: "cover", sentence: `[표지] ${line}`, hint: `표지 줄: ${i.reason} — 16~26자(공백 빼고) 한 줄, 명사로 끝나는 그림` }] : [];
  };
  // 1) 차단 결함(+ 표지): 걸린 묶음을 다시 쓴다(최대 2회).
  for (let round = 1; round <= CHUNK_REWRITE_ROUNDS && (seen.block.length || coverFlags().length); round++) {
    const targets = byChunk([...seen.block, ...coverFlags()]), minor = byChunk(seen.minor);
    for (const [c, fs] of targets) targets.set(c, [...fs, ...(minor.get(c) ?? [])]);
    if (!(await rewrite(targets, round))) break;
    cur = build(); seen = inspect(cur.chapters);
  }
  // 2) 장 사이 반복: 뒤쪽 묶음만 1회(다시 쓴 원고가 차단 결함을 새로 만들면 앞 원고로 되돌린다).
  // 장·key 사이 반복 + 같은 처방·상투구(P2 판독 경미 대부분) — 뒤쪽 묶음 1회 다시 쓰기.
  const repeatsOf = (chs: readonly FinalChapter[]) => [...crossRepeats(chs), ...adviceRepeats(chs)];
  const repeats = repeatsOf(cur.chapters);
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
  // 3) 그래도 걸린 문장은 지운다(기대는 다음 문장 · 답을 잃은 수사 물음도 함께, 걸린 소제목은 설계도 소제목 틀로). 빈 소제목은 뺀다.
  //    빈 key · 지운 뒤에도 남은 key 결함만 그 key를 결정론으로, 일반 장은 그 소제목을 뺀다. 장이 다 비었을 때만 장 전체 결정론.
  //    (P 시범: 한 낱말 결함으로 장 통째를 결정론 대체로 보냈고, 그 대체 글이 세운 차단 25 가운데 13이었다.)
  const headingFor = (n: number, si: number) => intake.chapters.find(c => c.n === n)?.sections?.[si]?.q ?? null;
  const cutR = cutFlagged(cur.chapters, seen.block, headingFor);
  let chapters = cutR.chapters;
  const replaced: { chapter: number; key?: string; why: string }[] = cutR.emptyKeys.map(e => ({ chapter: e.chapter, key: e.key, why: "emptied" }));
  const droppedLeft: string[] = [];
  { const after = inspect(chapters);
    const keysLeft = new Map<number, Set<string>>(), secsLeft = new Map<number, Set<number>>();
    for (const f of after.block) { const c = chapters.find(x => x.n === f.chapter), h = c?.sections[f.section]?.heading ?? ""; if (!c) continue;
      if (c.keys?.includes(h)) { keysLeft.set(c.n, (keysLeft.get(c.n) ?? new Set()).add(h)); if (!replaced.some(r => r.chapter === c.n && r.key === h)) replaced.push({ chapter: c.n, key: h, why: `${f.rule}:left` }); }
      else secsLeft.set(c.n, (secsLeft.get(c.n) ?? new Set()).add(f.section)); }
    chapters = chapters.map(c => ({ ...c, sections: c.sections.flatMap((s, si) => {
      if (keysLeft.get(c.n)?.has(s.heading)) return [{ ...s, paragraphs: [] }];
      if (secsLeft.get(c.n)?.has(si)) { droppedLeft.push(`${c.n}.${si}:${s.heading}`); return []; }
      return [s];
    }) })); }
  for (const c of chapters) if (!c.keys && !c.sections.length) replaced.push({ chapter: c.n, why: "chapter_emptied" });
  const empty = replaced.filter(r => r.key).map(r => ({ chapter: r.chapter, key: r.key! }));
  if (replaced.length) chapters = writeKeyFill(brief, plan, chapters, empty).map(c => (replaced.some(r => r.chapter === c.n && !r.key && !c.keys) ? { ...c, source: "deterministic" as const } : c));
  // 결정론 장(작가가 못 쓴 장 · 대체한 장)도 사실·금지 규칙 문단은 뺀다(기존 안전망과 같은 규칙, 빈 key는 다시 결정론으로).
  { const lint = lintBook(chapters, lctx), det = new Set(chapters.filter(c => c.source === "deterministic" || replaced.some(r => r.chapter === c.n)).map(c => c.n));
    const e = enforce(chapters, lint.filter(f => det.has(f.chapter) && (!chapters.find(c => c.n === f.chapter)?.keys || replaced.some(r => r.chapter === f.chapter && (!r.key || chapters.find(c => c.n === f.chapter)?.sections[f.section]?.heading === r.key)) || chapters.find(c => c.n === f.chapter)?.source === "deterministic")));
    if (e.droppedParagraphs) chapters = writeKeyFill(brief, plan, e.chapters, e.emptyKeys); }
  const final = inspect(chapters);
  chapters = insertFixedLines(chapters, brief);
  const rendered = renderTerms(chapters, brief, k); chapters = rendered.chapters;

  // 표지·키워드(1장이 든 묶음의 원문 — 다시 쓴 원고 먼저, 없으면 첫 원고). 걸림 없는 작가 줄 → 걸림 없는 엔진 그림 → 덜 걸린 작가 줄.
  const latest = chunk1 ? texts.get(chunk1.id) ?? "" : "";
  const coverCands = [...new Set([coverOf(latest), coverOf(firstOrig)].filter(Boolean))];
  const cleanCover = coverCands.find(l => !coverIssue(l, brief, avoid));
  const engineCover = brief.chart.coreImage.line;
  const cover: ReturnType<typeof chooseCover> = cleanCover ? { line: cleanCover, source: "writer", issue: null }
    : !coverIssue(engineCover, brief, avoid) ? { line: engineCover, source: "fallback", issue: coverCands.length ? coverIssue(coverCands[0], brief, avoid)?.reason ?? null : "작가 표지 없음" }
    : chooseCover(coverCands.map(line => ({ line, source: "writer" as const })), brief, avoid);
  const kwRaw = keywordsOf(latest) ?? keywordsOf(firstOrig);
  const keywords = kwRaw && kwRaw.every(w => !sentenceViolation(w, facts) && !/(합격|결혼|이별|승진|이직|대박|부자|성공)/.test(w)) ? kwRaw : null;
  const run = runs.length ? mergeRuns(runs) : null;
  const byRule = (fs: readonly { rule: string }[]) => fs.reduce<Record<string, number>>((o, x) => ({ ...o, [x.rule]: (o[x.rule] ?? 0) + 1 }), {});
  const review: Record<string, unknown> = {
    mode: "chunked", version: CHUNK_PROMPT_VERSION, model: null, calls: 0, skipped: "chunked_no_review",
    briefCheck: { ok: briefOk, issues: issues.slice(0, 40) }, chunks: chunks.map(c => ({ id: c.id, parts: c.parts, chars: c.chars })), log,
    blockFirst: firstBlock, rounds, repeatFirst, deleted: cutR.cut, headingsReplaced: cutR.headings, droppedSections: [...cutR.droppedSections, ...droppedLeft], missed: cutR.missed.map(f => `${f.chapter}.${f.section}.${f.paragraph}:${f.rule}`), replaced,
    remainingMinor: final.minor.map(f => ({ at: `${f.chapter}.${f.section}.${f.paragraph}`, rule: f.rule, sentence: f.sentence.slice(0, 160) })),
    remainingHard: final.block.map(f => ({ at: `${f.chapter}.${f.section}.${f.paragraph}`, rule: f.rule, detail: f.detail ?? "", sentence: f.sentence.slice(0, 200) })),
    remainingRepeat: repeatsOf(chapters).map(f => ({ at: `${f.chapter}.${f.section}.${f.paragraph}`, rule: f.rule, detail: f.detail ?? "", sentence: f.sentence.slice(0, 160) })),
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
