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
import { HINT, lintBook, tidyBook, type LintCtx, type P6cRule } from "../safety/p6c";
import { dayunPhase } from "../safety/lint";
import { briefFor, briefHash, chooseCover, coverIssue, factSheetFor, insertFixedLines, kstDate, lintContext, renderTerms, v4People, writerKnowledge, type V5BuildDeps } from "../publish";
import { adjacentRepeats, adviceRepeats, blockFlags, briefCheck, crossRepeats, CUT_ONLY_RULES, endingCaps, NO_SENTENCE_RULES, PIGGYBACK_RULES, rxRepeats, styleScoreOf, type BlockCtx, type BriefCtx, type ChunkFlag } from "./check";
import { cutFlagged } from "./cut";
import { splitSentences } from "../safety/patterns";
import { buildIntake, WISH_MARK, type Intake } from "./intake";
import { chunkPlan, chunkRules, CHUNK_PROMPT_VERSION, renderCard, ruleCtxOf, type Chunk } from "./prompt";
import { concurrency, rewriteChunk, writeChunks, type ChunkLog } from "./run";

/** AM2-4 5부: 남아도 되는 깃발(허용 기록) — 경미·문체 상한·반복 신호(뜻 반복은 설계도 배분이 막는 몫, 글자 그대로 되풀이는 지운다). */
const ALLOW_RULES: ReadonlySet<string> = new Set(["head_repeat", "head_echo", "angle_name", "pointer_expand", "ending_cap", "advice_repeat", "chapter_repeat", "rep_adjacent", "must_miss"]);
const ALLOW_WHY: Readonly<Record<string, string>> = { head_echo: "경미(머리 문장과 같은 끝) — 다시 쓰기에 함께 넘겼으나 남음", angle_name: "경미(각도 이름) — 다시 쓰기에 함께 넘겼으나 남음", pointer_expand: "앞 달과 같은 뜻을 다시 풀어 씀 — 반복 신호", head_repeat: "경미(머리 문장 뒤 십성 되풀이) — 다시 쓰기에 함께 넘겼으나 남음", ending_cap: "끝말 상한 넘음 — 문체 기록", advice_repeat: "받는 틀·상투구 상한 — 문체 기록", chapter_repeat: "뜻이 비슷한 문장(글자 그대로 아님) — 설계도 집 장으로 막는 몫", rep_adjacent: "같은 소제목 안 비슷한 문장 — 뒤 문장을 지울 수 없는 자리(소제목이 빔)", must_miss: "핵심 관계를 다시 쓰기 2회 뒤에도 못 씀(문장 없는 깃발)" };
/** 엔진 표지 틀(AM2-4 5부): 그 해·그 10년 엔진 그림 줄 → 원국 그림 → 「YYYY년, 그림」 · 「앞으로 10년, 그림」. */
export function engineCoverOf(brief: Brief): string[] {
  const y = Number(brief.timeline?.entries.find(e => e.kind === "year" && brief.product === "annual_fortune")?.key) || brief.chart.thisYear.year;
  const yearImg = brief.product === "annual_fortune" ? brief.timeline?.entries.find(e => e.kind === "year")?.imageLine : brief.timeline?.entries.find(e => Number(e.key) === brief.chart.thisYear.year + 1)?.imageLine;
  const core = brief.chart.coreImage.line;
  return [yearImg, core, brief.product === "annual_fortune" ? `${y}년, ${core}` : `앞으로 10년, ${core}`, yearImg ? `${brief.product === "annual_fortune" ? `${y}년, ` : "앞으로 10년, "}${yearImg}` : undefined].filter((x): x is string => Boolean(x));
}
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
  const life = brief.timeline?.lifetime ?? [], ci = life.findIndex(x => x.current), birthYear = Number(brief.baseDate.slice(0, 4)) - brief.person.age;
  const prevEnd = ci > 0 ? life[ci - 1].endYear - birthYear : undefined;
  // 흐름 세기 끝값 검사(「가장 잔잔」): 반복 장 key만(세운 달 13 · 대운 해 10).
  const keyed = new Set(intake.chapters.flatMap(c => (c.keys ?? []).map(x => x.key)));
  const flows = new Map((brief.timeline?.entries ?? []).filter(e => keyed.has(e.key)).map(e => [e.key, { score: e.flow.score, ganji: e.ganji.hangul }] as const));
  return { intake, ...(brief.mbti ? { mbtiAnchor: new RegExp([brief.mbti.type, ...(k.mbti.get(brief.mbti.type as never)?.cognitiveFunctions ?? []).map(f => f.code)].join("|")), mbtiType: brief.mbti.type } : {}),
    ...(yearsToNext !== undefined ? { yearsToNextDayun: yearsToNext } : {}), dayPillar: brief.chart.pillars.day.hangul, flows,
    // key → 그 시기 관계 이름(공망 빼고, 「(반쯤)」 같은 꼬리 뗌, 두 글자 이상).
    // AM2-3 1-5: 카드·화면·검사가 같은 값 — 공망도 관계 이름으로 센다.
    keyRels: new Map((brief.timeline?.entries ?? []).filter(e => keyed.has(e.key)).map(e => [e.key, new Set(e.badges.map(x => x.label.replace(/\(.*\)$/, "").trim()).filter(x => x.length >= 2))] as const)),
    ...(prevEnd !== undefined ? { prevDayunEndAge: prevEnd } : {}), brief };
}
/** 브리프 검사 문맥(1-2·1-6): 음양 수 · 흐름 끝값 달(동률) · 화면 카드 글(배지·카드 줄·꼬리표). */
export function briefCtxFor(brief: Brief): BriefCtx {
  // 「가장 ~한 달」 줄(design/annual.ts)과 같은 범위: 1월 다리를 뺀 12 절기월.
  const months = (brief.timeline?.entries ?? []).filter(e => e.kind === "month" && !e.bridge);
  const name = (e: { label: string }) => e.label.split(" (")[0];
  const hi = Math.max(...months.map(e => e.flow.score)), lo = Math.min(...months.map(e => e.flow.score));
  const screen = (brief.timeline?.entries ?? []).flatMap(e => [
    { where: `${e.key} 이름`, text: e.label.replace(/ \(이 책을 쓴 해\)/, "") }, { where: `${e.key} 그림`, text: e.imageLine }, ...(e.todo ? [{ where: `${e.key} 할 일`, text: e.todo }] : []), ...(e.review ? [{ where: `${e.key} 돌아보기`, text: e.review }] : []),
    ...(e.caution ? [{ where: `${e.key} 살필 점`, text: e.caution }] : []), ...(e.good ? [{ where: `${e.key} 좋은 것`, text: e.good }] : []), ...e.badges.map(b2 => ({ where: `${e.key} 배지 ${b2.label}`, text: `${b2.label}${b2.with !== undefined ? `(${b2.with})` : ""} ${b2.line}` })),
  ]);
  return { yin: brief.chart.yinYang.yin, yang: brief.chart.yinYang.yang, ...(months.length ? { flowEnds: { high: months.filter(e => e.flow.score === hi).map(name), low: months.filter(e => e.flow.score === lo).map(name) } } : {}), screen, brief };
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
  const issues = briefCheck(intake, facts.nicknames ?? [], briefCtxFor(brief));
  const chunks = chunkPlan(intake);
  // AM2-4 4부: 규칙 블록은 입력 조건으로 조립(바람·MBTI·직업·연애 상태).
  const system = { rules: chunkRules(ruleCtxOf(intake)), card: renderCard(intake) };
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
  // AM2-4 1부: 달·해 카드는 화면(결정론 — 엔진 할 일·그림)이 맡는다. 작가가 카드 줄을 써도 쓰지 않는다.
  const noCard = (chs: readonly FinalChapter[]): FinalChapter[] => chs.map(c => ({ ...c, sections: c.sections.map(sec => { if (!sec.card) return sec; const { card: _c, ...rest } = sec; void _c; return rest; }) }));
  // AM2-4 5부 head_join(P3 판독 annual-1 경미 #5): 머리 문장(시스템) 바로 뒤 첫 문장의 「이 달은·이 해는」은 머리 문장과 겹친다 — 떼고 잇는다(뜻 그대로).
  const headJoin = (chs: readonly FinalChapter[]): FinalChapter[] => chs.map(c => (!c.keys ? c : { ...c, sections: c.sections.map(sec => (!c.keys!.includes(sec.heading) || !sec.paragraphs[0] || !/^이 (달|해)(은|는) \S/.test(sec.paragraphs[0]) ? sec : { ...sec, paragraphs: [sec.paragraphs[0].replace(/^이 (달|해)(은|는) /, ""), ...sec.paragraphs.slice(1)] })) }));
  const build = () => { const net = applySafetyNet(brief, plan, drafts, { priorSentences: a.prior?.sentences ?? [], surfaceOnly: true }); const t = tidyBook(headJoin(noCard(net.chapters)), { ...lctx, surfaceOnly: true }); return { net, chapters: t.chapters, tidy: t.count }; };
  // 차단(block)과 경미(minor: 그 묶음을 다른 까닭으로 다시 쓸 때만 함께 고친다)를 나눈다.
  const inspect = (chs: readonly FinalChapter[]) => { const lint = lintBook(chs, lctx), all = blockFlags(chs, lint, bctx).filter(f => chs.find(c => c.n === f.chapter)?.source !== "deterministic"); return { lint, block: all.filter(f => !PIGGYBACK_RULES.has(f.rule) && !CUT_ONLY_RULES.has(f.rule)), minor: all.filter(f => PIGGYBACK_RULES.has(f.rule) || CUT_ONLY_RULES.has(f.rule)), cutOnly: all.filter(f => CUT_ONLY_RULES.has(f.rule)) }; };
  /** 지울 수 있는 깃발(문장이 있는 것). 「반드시 쓸 것」 같은 문장 없는 깃발은 다시 쓰기로만. */
  const cuttable = (fs: readonly ChunkFlag[]) => fs.filter(f => !NO_SENTENCE_RULES.has(f.rule));
  let cur = build(), seen = inspect(cur.chapters);
  const firstBlock = seen.block.length;
  // AM2-4 5부 깃발 처리 기록: 잡은 깃발마다 다시 쓰기·지우기·허용 기록 가운데 하나(처리 없는 깃발 0).
  const normS = (t: string) => t.replace(/[^가-힣A-Za-z0-9]/g, "");
  const ledger = new Map<string, { rule: string; sentence: string; at: string }>();
  const note = (fs: readonly ChunkFlag[]) => { for (const f of fs) { const k2 = `${f.rule}|${normS(f.sentence)}`; if (!ledger.has(k2)) ledger.set(k2, { rule: f.rule, sentence: f.sentence, at: `${f.chapter}.${f.section}.${f.paragraph}` }); } };
  const cardValues = intake.lines.map(l => l.value);
  const repeatsOf = (chs: readonly FinalChapter[]) => [...crossRepeats(chs), ...adviceRepeats(chs), ...rxRepeats(chs, intake), ...endingCaps(chs), ...adjacentRepeats(chs, cardValues)];
  note([...seen.block, ...seen.minor, ...repeatsOf(cur.chapters)]);
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
  // AM2-4 5부: 표지는 1회만 다시 쓴다(그래도 안 맞으면 엔진 표지 틀). 반복·끝말 깃발은 그 묶음을 다른 까닭으로 다시 쓸 때만 함께 넘긴다(반복은 설계도 배분으로 막는다 — 되풀이 고침 판은 없다).
  for (let round = 1; round <= CHUNK_REWRITE_ROUNDS && (seen.block.length || (round === 1 && coverFlags().length)); round++) {
    const targets = byChunk([...seen.block, ...(round === 1 ? coverFlags() : [])]), minor = byChunk([...seen.minor, ...repeatsOf(cur.chapters)]);
    for (const [c, fs] of targets) targets.set(c, [...fs, ...(minor.get(c) ?? [])]);
    if (!(await rewrite(targets, round))) break;
    cur = build(); seen = inspect(cur.chapters); note([...seen.block, ...seen.minor, ...repeatsOf(cur.chapters)]);
  }
  // 2) AM2-4(덕짱님 결정 2026-11-12): 되풀이 고침 판은 뺐다(P3 두 권 모두 통째로 되돌려졌다 — 권당 약 $0.2). 반복은 설계도 배분(처방 사전 · 근거의 집 장)으로 막고, 남은 글자 그대로 되풀이는 지운다.
  const repeatFirst = repeatsOf(cur.chapters).length;
  // 3) 그래도 걸린 문장은 지운다(기대는 다음 문장 · 답을 잃은 수사 물음도 함께, 걸린 소제목은 설계도 소제목 틀로). 빈 소제목은 뺀다.
  //    지운 뒤에도 남은 결함은 그 문단만 뺀다(AM2-3 6-1: key·장을 결정론 글로 바꾸지 않는다).
  //    그래서 key·장이 비면 그 묶음만 한 번 더 다시 쓴다(덕짱님 결정 2026-11-12 「그 묶음 1회 더 → 그래도 비면 보류」). 그래도 비면 채움 표시 → 발행 관문이 보류한다.
  const headingFor = (n: number, si: number) => intake.chapters.find(c => c.n === n)?.sections?.[si]?.q ?? null;
  const droppedLeft: string[] = [];
  const cutAll = () => {
    // 이웃 문장 되풀이(같은 문장·같은 뜻 연속)는 다시 쓰기 뒤에도 남으면 뒤 문장을 지운다(뜻이 앞 문장에 있으니 지워도 빈자리가 없다).
    const verbatim = [...crossRepeats(cur.chapters).filter(f => /같은 구절|거의 같은 문장/.test(f.detail ?? "")), ...rxRepeats(cur.chapters, intake)];
    const r = cutFlagged(cur.chapters, [...cuttable(seen.block), ...seen.cutOnly, ...adjacentRepeats(cur.chapters, cardValues), ...verbatim], headingFor);
    const after = inspect(r.chapters), bad = new Set(cuttable(after.block).filter(f => f.paragraph >= 0).map(f => `${f.chapter}.${f.section}.${f.paragraph}`));
    const badHead = new Set(cuttable(after.block).filter(f => f.paragraph < 0).map(f => `${f.chapter}.${f.section}`));
    const chs = r.chapters.map(c => ({ ...c, sections: c.sections.flatMap((sec, si) => {
      if (badHead.has(`${c.n}.${si}`) && !c.keys?.includes(sec.heading)) { droppedLeft.push(`${c.n}.${si}:${sec.heading}`); return []; }
      const paragraphs = sec.paragraphs.filter((_p, pi) => { const k2 = `${c.n}.${si}.${pi}`; if (bad.has(k2)) droppedLeft.push(`${k2}:${sec.heading}`); return !bad.has(k2); });
      if (!paragraphs.length && !c.keys?.includes(sec.heading)) { droppedLeft.push(`${c.n}.${si}:${sec.heading}`); return []; }
      return [{ ...sec, paragraphs }];
    }) }));
    const emptyKeys = chs.flatMap(c => c.sections.filter(sec => c.keys?.includes(sec.heading) && !sec.paragraphs.length).map(sec => ({ chapter: c.n, key: sec.heading })));
    const emptyChapters = chs.filter(c => !c.keys && !c.sections.length).map(c => c.n);
    return { r, chapters: chs, emptyKeys, emptyChapters };
  };
  let cut0 = cutAll();
  let emptyRetry: string[] = [];
  if (cut0.emptyKeys.length || cut0.emptyChapters.length) {
    const targets = new Map<Chunk, ChunkFlag[]>();
    const push = (c: Chunk | undefined, f: ChunkFlag) => { if (c) targets.set(c, [...(targets.get(c) ?? []), f]); };
    for (const e of cut0.emptyKeys) push(chunkOf(chunks, { chapter: e.chapter }, e.key), { chapter: e.chapter, section: 0, paragraph: -3, rule: "emptied", sentence: `[${intake.chapters.flatMap(c => c.keys ?? []).find(k2 => k2.key === e.key)?.label ?? e.key}] 본문이 모두 빠짐`, hint: "걸린 문장을 지우다 이 자리가 비었다 — 아래 걸린 문장을 피해 카드 줄로 다시 쓴다" });
    for (const n of cut0.emptyChapters) push(chunks.find(c => c.parts.some(p => p.n === n && !p.keys)), { chapter: n, section: 0, paragraph: -3, rule: "emptied", sentence: `[${n}장] 본문이 모두 빠짐`, hint: "걸린 문장을 지우다 이 장이 비었다 — 아래 걸린 문장을 피해 다시 쓴다" });
    for (const [c, fs] of targets) targets.set(c, [...fs, ...seen.block.filter(f => chunkOf(chunks, f, cur.chapters.find(x => x.n === f.chapter)?.sections[f.section]?.heading ?? "") === c)]);
    if (targets.size && await rewrite(targets, CHUNK_REWRITE_ROUNDS + 2)) { cur = build(); seen = inspect(cur.chapters); note([...seen.block, ...seen.minor, ...repeatsOf(cur.chapters)]); emptyRetry = [...targets.keys()].map(c => c.id); cut0 = cutAll(); }
  }
  const cutR = cut0.r;
  let chapters: FinalChapter[] = cut0.chapters;
  const replaced: { chapter: number; key?: string; why: string }[] = [...cut0.emptyKeys.map(e => ({ chapter: e.chapter, key: e.key, why: "emptied" })), ...cut0.emptyChapters.map(n => ({ chapter: n, why: "chapter_emptied" }))];
  // 남은 빈 자리는 형식(렌더)만 맞춘다 — 결정론 글이 든 장은 발행 관문(policy judgeBuild)이 보류로 돌린다(keys_filled · deterministic).
  const empty = replaced.filter(r => r.key).map(r => ({ chapter: r.chapter, key: r.key! }));
  if (replaced.length) chapters = writeKeyFill(brief, plan, chapters, empty).map(c => (replaced.some(r => r.chapter === c.n && !r.key && !c.keys) ? { ...c, source: "deterministic" as const } : replaced.some(r => r.chapter === c.n && r.key) ? { ...c, reason: `keys_filled:${replaced.filter(r => r.chapter === c.n && r.key).map(r => r.key).join(",")}` } : c));
  const final = inspect(chapters);
  // 3-2 소망 원문은 렌더 단계에서 넣는다(작가는 «바람» 표시만 — 원문을 고칠 수 없다. P2 판독 annual-1: 1장은 원문, 9장은 「지금」을 뺀 꼴로 인용이 두 가지였다).
  const wishText = intake.wish ? `«${intake.wish}»` : "적어 주신 바람";
  chapters = chapters.map(c => ({ ...c, sections: c.sections.map(sec => ({ ...sec, heading: sec.heading.split(WISH_MARK).join(wishText), paragraphs: sec.paragraphs.map(p => p.split(WISH_MARK).join(wishText)) })) }));
  chapters = insertFixedLines(chapters, brief);
  const rendered = renderTerms(chapters, brief, k); chapters = rendered.chapters;

  // 표지·키워드(1장이 든 묶음의 원문 — 다시 쓴 원고 먼저, 없으면 첫 원고). 걸림 없는 작가 줄 → 걸림 없는 엔진 그림 → 덜 걸린 작가 줄.
  const latest = chunk1 ? texts.get(chunk1.id) ?? "" : "";
  const coverCands = [...new Set([coverOf(latest), coverOf(firstOrig)].filter(Boolean))];
  const cleanCover = coverCands.find(l => !coverIssue(l, brief, avoid));
  // AM2-4 5부: 1회 다시 써도 길이·규칙이 맞지 않으면 엔진 표지 틀(그 해·그 10년의 엔진 그림 → 원국 그림 → 「YYYY년, 그림」) 가운데 걸림 없는 첫 줄.
  const engineCover = engineCoverOf(brief).find(l => !coverIssue(l, brief, avoid));
  const cover: ReturnType<typeof chooseCover> = cleanCover ? { line: cleanCover, source: "writer", issue: null }
    : engineCover ? { line: engineCover, source: "fallback", issue: coverCands.length ? coverIssue(coverCands[0], brief, avoid)?.reason ?? null : "작가 표지 없음" }
    : chooseCover(coverCands.map(line => ({ line, source: "writer" as const })), brief, avoid);
  const kwRaw = keywordsOf(latest) ?? keywordsOf(firstOrig);
  const keywords = kwRaw && kwRaw.every(w => !sentenceViolation(w, facts) && !/(합격|결혼|이별|승진|이직|대박|부자|성공)/.test(w)) ? kwRaw : null;
  const run = runs.length ? mergeRuns(runs) : null;
  const byRule = (fs: readonly { rule: string }[]) => fs.reduce<Record<string, number>>((o, x) => ({ ...o, [x.rule]: (o[x.rule] ?? 0) + 1 }), {});
  // 깃발 처리 기록(5부): 지운 문장 → 지움, 원고에서 사라짐 → 다시 쓰기, 남음 → 허용 규칙이면 허용 기록, 아니면 처리 없음.
  const finalText = new Set(chapters.flatMap(c => c.sections.flatMap(sec => [sec.heading, ...sec.paragraphs.flatMap(p2 => splitSentences(p2))])).map(normS));
  const finalFlags = new Set([...final.block, ...final.minor, ...repeatsOf(chapters)].map(f => `${f.rule}|${normS(f.sentence)}`));
  const cutSet = new Set([...cutR.cut.map(c2 => normS(c2.sentence)), ...droppedLeft.map(d2 => normS(d2.replace(/^[^:]*:/, "")))]);
  const disposition = [...ledger].map(([k2, v]) => {
    const ns = normS(v.sentence), still = finalFlags.has(k2);
    const how: "rewrite" | "delete" | "allow" | "none" = v.rule === "cover" ? (cover.issue === null || cover.source === "fallback" ? "rewrite" : "none")
      : cutSet.has(ns) && !finalText.has(ns) ? "delete" : !still ? "rewrite" : ALLOW_RULES.has(v.rule) ? "allow" : "none";
    return { ...v, how, ...(how === "allow" ? { why: ALLOW_WHY[v.rule] ?? "문체 상한(허용 기록)" } : {}) }; });
  const dispCount = disposition.reduce<Record<string, number>>((o, d2) => ({ ...o, [d2.how]: (o[d2.how] ?? 0) + 1 }), {});
  const review: Record<string, unknown> = {
    mode: "chunked", version: CHUNK_PROMPT_VERSION, model: null, calls: 0, skipped: "chunked_no_review",
    briefCheck: { ok: briefOk, issues: issues.slice(0, 40) }, chunks: chunks.map(c => ({ id: c.id, parts: c.parts, chars: c.chars })), log,
    blockFirst: firstBlock, rounds, repeatFirst, deleted: cutR.cut, headingsReplaced: cutR.headings, droppedSections: [...cutR.droppedSections, ...droppedLeft], missed: cutR.missed.map(f => `${f.chapter}.${f.section}.${f.paragraph}:${f.rule}`), replaced, emptyRetry,
    remainingMinor: final.minor.map(f => ({ at: `${f.chapter}.${f.section}.${f.paragraph}`, rule: f.rule, sentence: f.sentence.slice(0, 160) })),
    remainingHard: final.block.map(f => ({ at: `${f.chapter}.${f.section}.${f.paragraph}`, rule: f.rule, detail: f.detail ?? "", sentence: f.sentence.slice(0, 200) })),
    remainingRepeat: repeatsOf(chapters).map(f => ({ at: `${f.chapter}.${f.section}.${f.paragraph}`, rule: f.rule, detail: f.detail ?? "", sentence: f.sentence.slice(0, 160) })),
    style: styleScoreOf(final.lint), cover: { source: cover.source, firstProblem: cover.issue },
    disposition: { counts: { rewrite: dispCount.rewrite ?? 0, delete: dispCount.delete ?? 0, allow: dispCount.allow ?? 0, none: dispCount.none ?? 0 }, allowed: disposition.filter(d2 => d2.how === "allow").map(d2 => ({ at: d2.at, rule: d2.rule, why: d2.why, sentence: d2.sentence.slice(0, 140) })), none: disposition.filter(d2 => d2.how === "none").map(d2 => ({ at: d2.at, rule: d2.rule, sentence: d2.sentence.slice(0, 160) })) },
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
