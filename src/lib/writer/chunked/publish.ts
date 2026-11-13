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
import { keywordsOf, type BookChapter } from "../format";
import { chapterPreview, type ChapterPreview } from "../preview";
import { buildWriterPrompt } from "../prompt";
import type { PriorBooks } from "../prior";
import { mergeRuns, WRITER_TIME_BUDGET_MS, type ChapterSink, type WriterOptions, type WriterRun } from "../runner";
import { applySafetyNet, safetyFacts, sentenceViolation, writeKeyFill, type DraftChapter, type FinalChapter } from "../safety";
import { HINT, lintBook, tidyBook, type LintCtx, type P6cRule } from "../safety/p6c";
import { dayunPhase } from "../safety/lint";
import { briefFor, briefHash, chooseCover, coverIssue, factSheetFor, insertFixedLines, kstDate, lintContext, renderTerms, v4People, writerKnowledge, type V5BuildDeps } from "../publish";
import { adjacentRepeats, adviceRepeats, adviceSentenceAt, am26Flags, blockFlags, BLOCK_RULES, briefCheck, crossRepeats, CUT_ONLY_RULES, endingCaps, FIX_BOUNDARY, FIX_RULES, MINOR_RULES, NO_SENTENCE_RULES, PIGGYBACK_RULES, rxRepeats, styleScoreOf, valueFlags, type BlockCtx, type BriefCtx, type ChunkFlag } from "./check";
import { antecedentIssues, leanOnCut, claimIssues, dayunOrderIssues, DET_RULES, detFix, exemptOf, factIssues, lengthIssue, RECORD_ONLY, REWRITE_BOUNDARY } from "./accept";
import { presumedPartner } from "../safety/lint";
import { relName } from "@/lib/brief/core";
import { cutFlagged } from "./cut";
import { splitSentences } from "../safety/patterns";
import { buildIntake, KEY_TARGET, keyLabelOf, WISH_MARK, type Intake } from "./intake";
import { chunkPlan, chunkRules, CHUNK_PROMPT_VERSION, chunkUser, renderCard, ruleCtxOf, type Chunk, type ParaTarget } from "./prompt";
import { concurrency, replaceParagraphs, writeChunks, type ChunkLog, type ParaLock } from "./run";

/** AM2-4 5부: 남아도 되는 깃발(허용 기록) — 경미·문체 상한·반복 신호(뜻 반복은 설계도 배분이 막는 몫, 글자 그대로 되풀이는 지운다). */
// AM2-6 5부(덕짱님 지시): chapter_repeat 「설계도 집 장으로 막는 몫」 · ending_cap 「문체 기록」 · head_echo · advice_repeat(한 소제목 안) · rep_adjacent 「소제목이 빔」은 허용으로 끝내지 않는다 — FIX_RULES(문단 교체 대상)로 옮겼다.
const ALLOW_RULES: ReadonlySet<string> = new Set(["head_repeat", "angle_name", "pointer_expand", "advice_repeat", "rx_repeat"]);
const ALLOW_WHY: Readonly<Record<string, string>> = { head_echo: "경미(머리 문장과 같은 끝) — 다시 쓰기에 함께 넘겼으나 남음", angle_name: "경미(각도 이름) — 다시 쓰기에 함께 넘겼으나 남음", pointer_expand: "앞 달과 같은 뜻을 다시 풀어 씀 — 반복 신호", head_repeat: "경미(머리 문장 뒤 십성 되풀이) — 다시 쓰기에 함께 넘겼으나 남음", ending_cap: "끝말 상한 넘음 — 문체 기록", advice_repeat: "받는 틀·상투구 상한 — 문체 기록", chapter_repeat: "뜻이 비슷한 문장(글자 그대로 아님) — 설계도 집 장으로 막는 몫", rep_adjacent: "같은 소제목 안 비슷한 문장 — 뒤 문장을 지울 수 없는 자리(소제목이 빔)", rx_repeat: "같은 처방 종류 되풀이 — 경미, 점수로 기록(지우지 않음)", screen_repeat: "화면 사실 되풀이 — 경미, 점수로 기록(지우지 않음)" };
/** 엔진 표지 틀(AM2-4 5부): 그 해·그 10년 엔진 그림 줄 → 원국 그림 → 「YYYY년, 그림」 · 「앞으로 10년, 그림」. */
export function engineCoverOf(brief: Brief): string[] {
  const y = Number(brief.timeline?.entries.find(e => e.kind === "year" && brief.product === "annual_fortune")?.key) || brief.chart.thisYear.year;
  const yearImg = brief.product === "annual_fortune" ? brief.timeline?.entries.find(e => e.kind === "year")?.imageLine : brief.timeline?.entries.find(e => Number(e.key) === brief.chart.thisYear.year + 1)?.imageLine;
  const core = brief.chart.coreImage.line;
  return [yearImg, core, brief.product === "annual_fortune" ? `${y}년, ${core}` : `앞으로 10년, ${core}`, yearImg ? `${brief.product === "annual_fortune" ? `${y}년, ` : "앞으로 10년, "}${yearImg}` : undefined].filter((x): x is string => Boolean(x));
}
/** AM2-7 2부: 대략 시각(시간대 질문) 값 → 고객 말(「진시」). */
export const slotKo = (v: string) => ({ JASI: "자시", CHUKSI: "축시", INSI: "인시", MYOSI: "묘시", JINSI: "진시", SASI: "사시", OSI: "오시", MISI: "미시", SINSI: "신시", YUSI: "유시", SULSI: "술시", HAESI: "해시" } as Record<string, string>)[v] ?? v;
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
  const slotRaw = (a.payload as { person?: { approximateBirthTimeSlot?: string; birthTimePrecision?: string } }).person;
  const intake = buildIntake(brief, k, plan, typeof wish === "string" ? wish : undefined, slotRaw?.birthTimePrecision === "approximate" && slotRaw.approximateBirthTimeSlot ? { timeSlot: slotKo(slotRaw.approximateBirthTimeSlot) } : {});
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
  // AM2-5 2부: 세운·대운은 카드 줄을 작가가 쓰지 않는다(화면 결정론) — 카드 검사(card_missing 30곳 등 의미 없는 값)를 끈다.
  const lctx0: LintCtx = { ...lintContext(brief, k, plan, a.prior?.sentences ?? [], undefined, sheet), noCards: true };
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
  const year0 = Number(brief.timeline?.entries.find(e => e.kind === "year")?.key) || brief.chart.thisYear.year;
  // AM2-4 1부: 달·해 카드는 화면(결정론 — 엔진 할 일·그림)이 맡는다. 작가가 카드 줄을 써도 쓰지 않는다.
  const noCard = (chs: readonly FinalChapter[]): FinalChapter[] => chs.map(c => ({ ...c, sections: c.sections.map(sec => { if (!sec.card) return sec; const { card: _c, ...rest } = sec; void _c; return rest; }) }));
  // AM2-4 5부 head_join(P3 판독 annual-1 경미 #5): 머리 문장(시스템) 바로 뒤 첫 문장의 「이 달은·이 해는」은 머리 문장과 겹친다 — 떼고 잇는다(뜻 그대로).
  const headJoin = (chs: readonly FinalChapter[]): FinalChapter[] => chs.map(c => (!c.keys ? c : { ...c, sections: c.sections.map(sec => (!c.keys!.includes(sec.heading) || !sec.paragraphs[0] || !/^이 (달|해)(은|는) \S/.test(sec.paragraphs[0]) ? sec : { ...sec, paragraphs: [sec.paragraphs[0].replace(/^이 (달|해)(은|는) /, ""), ...sec.paragraphs.slice(1)] })) }));
  // AM2-5 2부 month_label(P4 판독 세운 경계 #5 「임인월과 계묘월에는」 — 이 장만 간지 이름이라 몇 월인지 모른다): 세운 책의 맨 간지 달 이름에 달 이름표를 붙인다(뜻 그대로, 표기만).
  const monthLabel = new Map<string, string>((brief.timeline?.entries ?? []).filter(e => e.kind === "month").map(e => [`${e.ganji.hangul}월`, keyLabelOf(e)]));
  const labelMonths = (chs: readonly FinalChapter[]): FinalChapter[] => brief.product !== "annual_fortune" ? [...chs] : chs.map(c => ({ ...c, sections: c.sections.map(sec => ({ ...sec, paragraphs: sec.paragraphs.map(p2 => p2.replace(/(?<![가-힣·] ?)(?<!\d월 · )(?<![가-힣])([갑을병정무기경신임계][자축인묘진사오미신유술해]월)(?!\s?·)/g, (m0: string, g: string, off: number, all: string) => (monthLabel.has(g) && !/\d월 ?· ?$/.test(all.slice(Math.max(0, off - 8), off)) ? monthLabel.get(g)! : m0))) })) }));
  // AM2-6 4부 이름 부르기: 정해진 장(세운 1·10장, 대운 1·9장 — 첫 장 · 끝 장)의 첫 문단 밖의 이름은 「당신」으로(뜻 그대로, 표기만).
  const callName = brief.person.callName, lastN = Math.max(...plan.map(p2 => p2.n));
  // AM2-7: 성 뺀 이름(「서윤 씨」)도 「당신」으로 — 검사(name_call)와 같은 이름 꼴.
  const nameAlt = [...new Set([callName, callName.replace(/(님|씨)$/, ""), brief.person.name, brief.person.name.length >= 3 ? brief.person.name.slice(1) : ""].filter(n2 => n2 && n2.length >= 2))].sort((p1, p2) => p2.length - p1.length).map(n2 => n2.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
  const unname = (chs: readonly FinalChapter[]): FinalChapter[] => !callName || callName.length < 2 ? [...chs] : chs.map(c => ({ ...c, sections: c.sections.map((sec, si) => ({ ...sec, paragraphs: sec.paragraphs.map((p2, pi) => ((c.n === 1 || c.n === lastN) && si === 0 && pi === 0) ? p2
    : p2.replace(new RegExp(`(?<![가-힣])(?:${nameAlt})\\s?(?:님|씨)?(은|는|이|가|을|를|과|와|의|에게|도|만|처럼)?(?![가-힣])`, "g"), (_m, j?: string) => `당신${j ? ({ 은: "은", 는: "은", 이: "이", 가: "이", 을: "을", 를: "을", 과: "과", 와: "과" } as Record<string, string>)[j] ?? j : ""}`)) })) }));
  // AM2-7 5부 1: 본문 꺾쇠 〈 〉는 렌더에서 걷는다(P6 — 지시문 자리표시를 작가가 서식으로 읽었다, 26곳).
  const unbracket = (chs: readonly FinalChapter[]): FinalChapter[] => chs.map(c => ({ ...c, sections: c.sections.map(sec => ({ ...sec, heading: sec.heading.replace(/[〈〉]/g, ""), paragraphs: sec.paragraphs.map(p2 => p2.replace(/[〈〉]/g, "")) })) }));
  const build = () => { const net = applySafetyNet(brief, plan, drafts, { priorSentences: a.prior?.sentences ?? [], surfaceOnly: true }); const t = tidyBook(unname(labelMonths(headJoin(unbracket(noCard(net.chapters))))), { ...lctx, surfaceOnly: true }); return { net, chapters: t.chapters, tidy: t.count }; };
  // 차단(block)과 경미(minor: 그 묶음을 다른 까닭으로 다시 쓸 때만 함께 고친다)를 나눈다.
  // AM2-6 3부 presumed_partner: 고객이 적은 바람 원문 안의 말(「좋아하는 사람」)은 입력 밖 연인이 아니다.
  const wishWord = (f: ChunkFlag) => f.rule === "presumed_partner" && Boolean(intake.wish) && (() => { const m = presumedPartner(f.sentence, brief.person.facts.relationship); return Boolean(m && intake.wish!.includes(m)); })();
  // AM2-6 5부: 차단(교체 → 그래도면 지우기) · 교체 대상(경계 · 고객이 알아챌 경미 — 교체만, 지우지 않음) · 경미(다른 까닭으로 고칠 때만 함께).
  const inspect = (chs: readonly FinalChapter[]) => { const lint = lintBook(chs, lctx), all = blockFlags(chs, lint, bctx).filter(f => chs.find(c => c.n === f.chapter)?.source !== "deterministic" && !wishWord(f));
    return { lint, block: all.filter(f => !PIGGYBACK_RULES.has(f.rule) && !CUT_ONLY_RULES.has(f.rule) && !FIX_RULES.has(f.rule)), minor: all.filter(f => (PIGGYBACK_RULES.has(f.rule) || CUT_ONLY_RULES.has(f.rule)) && !FIX_RULES.has(f.rule)), fix: all.filter(f => FIX_RULES.has(f.rule)) }; };
  const tierOf = (f: ChunkFlag) => (FIX_BOUNDARY.has(f.rule) ? 1 : FIX_RULES.has(f.rule) ? 2 : PIGGYBACK_RULES.has(f.rule) || CUT_ONLY_RULES.has(f.rule) || MINOR_RULES.has(f.rule) ? 3 : 0);
  /** 지울 수 있는 깃발(문장이 있는 것). 「반드시 쓸 것」 같은 문장 없는 깃발은 다시 쓰기로만. */
  const cuttable = (fs: readonly ChunkFlag[]) => fs.filter(f => !NO_SENTENCE_RULES.has(f.rule) && f.paragraph >= -1);
  let cur = build(), seen = inspect(cur.chapters);
  const firstBlock = seen.block.length;
  // AM2-4 5부 깃발 처리 기록: 잡은 깃발마다 다시 쓰기·지우기·허용 기록·남김 가운데 하나(처리 없는 깃발 0).
  const normS = (t: string) => t.replace(/[^가-힣A-Za-z0-9]/g, "");
  const ledger = new Map<string, { rule: string; sentence: string; at: string }>();
  const note = (fs: readonly ChunkFlag[]) => { for (const f of fs) { const k2 = `${f.rule}|${normS(f.sentence)}`; if (!ledger.has(k2)) ledger.set(k2, { rule: f.rule, sentence: f.sentence, at: `${f.chapter}.${f.section}.${f.paragraph}` }); } };
  const cardValues = intake.lines.map(l => l.value);
  // AM2-5 2부: 시스템 머리 문장은 반복 집계·끝말 상한에서 뺀다(P4 대운 남은 반복 12 가운데 10이 머리 문장).
  const heads = new Set(intake.chapters.flatMap(c => (c.keys ?? []).map(k2 => normS(k2.head))).filter(Boolean));
  // AM2-7 1부 6: 장 자기 핵심 주장 · 배정된 달 목록 · 가리키기 말은 되풀이가 아니다.
  const ownTexts = new Map(intake.chapters.map(c => [c.n, [...c.claims, ...(c.sections ?? []).flatMap(sp => [...sp.claims, sp.pointer ?? ""]), ...(c.keys ?? []).flatMap(k2 => [k2.pointer ?? "", ...k2.claims])].filter(Boolean)] as const));
  const repeatsOf = (chs: readonly FinalChapter[]) => [...crossRepeats(chs, heads, n => ownTexts.get(n) ?? []), ...adviceRepeats(chs), ...rxRepeats(chs, intake), ...endingCaps(chs, heads), ...adjacentRepeats(chs, cardValues), ...valueFlags(chs)];
  /** 교체 대상 전부(본문 검사의 경계 · 경미 + 반복 집계 가운데 교체 대상). */
  const fixOf = (chs: readonly FinalChapter[], s0: { fix: readonly ChunkFlag[] } = inspect(chs)) => [...s0.fix, ...repeatsOf(chs).filter(f => FIX_RULES.has(f.rule))];
  note([...seen.block, ...seen.minor, ...fixOf(cur.chapters, seen), ...repeatsOf(cur.chapters)]);
  const rounds: { round: number; chunks: string[]; flags: number; targets: number }[] = [];
  const headingOf = (chs: readonly FinalChapter[], f: { chapter: number; section: number }) => chs.find(c => c.n === f.chapter)?.sections[f.section]?.heading ?? "";
  /** 걸린 깃발을 묶음별로. */
  const byChunk = (flags: readonly ChunkFlag[]) => { const m = new Map<Chunk, ChunkFlag[]>(); for (const f of flags) { const c = chunkOf(chunks, f, headingOf(cur.chapters, f)); if (c) m.set(c, [...(m.get(c) ?? []), f]); } return m; };
  // AM2-5 2부 문단 교체: 깃발 → 고칠 자리(원고의 문단, 반드시 쓸 것·빈 자리·짧은 key는 그 key 전체). 같은 자리의 깃발은 함께, key 전체 자리가 있으면 그 key의 문단 자리는 합친다.
  const bareS = (t: string) => normS(t.replace(/[⟪⟫]/g, ""));
  const holds = (raw: string, sen: string) => { const r = bareS(raw), x2 = bareS(sen); return x2.length > 0 && (r.includes(x2) || (x2.length >= 24 && (r.includes(x2.slice(0, 12)) && r.includes(x2.slice(-12))))); };
  const targetsOf = (fs: readonly ChunkFlag[]): ParaTarget[] => {
    const out = new Map<string, ParaTarget>();
    const put = (t: ParaTarget, issue?: { sentence: string; reason: string; rule?: string }) => { const had = out.get(t.id); out.set(t.id, { ...(had ?? t), issues: [...(had?.issues ?? []), ...(issue ? [issue] : [])] }); };
    for (const f of fs) {
      if (f.paragraph === -2 || f.paragraph === -1) continue; // 표지는 따로, 소제목은 지우기 단계에서 설계도 틀로.
      const h = headingOf(cur.chapters, f), d = drafts.get(f.chapter); if (!d) continue;
      const si = d.chapter.sections.findIndex(s2 => s2.heading === h); if (si < 0) continue;
      const sec = d.chapter.sections[si], isKey = Boolean(plan.find(p2 => p2.n === f.chapter)?.keys?.includes(h));
      const issue = { sentence: f.sentence, reason: reasonOf(f), rule: f.rule };
      if (f.paragraph < 0 || !sec.paragraphs.length) { put({ id: `${f.chapter}.${si}.*`, chapter: f.chapter, section: si, heading: h, index: "*", text: sec.paragraphs.join("\n\n"), issues: [] }, issue); continue; }
      const pi = sec.paragraphs.findIndex(p2 => holds(p2, f.sentence)), idx = pi >= 0 ? pi : Math.min(f.paragraph, sec.paragraphs.length - 1);
      if (isKey && out.has(`${f.chapter}.${si}.*`)) { put(out.get(`${f.chapter}.${si}.*`)!, issue); continue; }
      put({ id: `${f.chapter}.${si}.${idx}`, chapter: f.chapter, section: si, heading: h, index: idx, text: sec.paragraphs[idx] ?? "", issues: [] }, issue);
    }
    // key 전체 자리가 생긴 key의 문단 자리는 그 자리로 합친다(같은 key를 두 번 바꾸지 않게).
    for (const t of [...out.values()].filter(x2 => x2.index !== "*")) { const whole = out.get(`${t.chapter}.${t.section}.*`); if (whole) { out.delete(t.id); out.set(whole.id, { ...whole, issues: [...whole.issues, ...t.issues] }); } }
    return [...out.values()].map(t => ({ ...t, issues: t.issues.slice(0, 6) }));
  };
  const reverted: { at: string; rule: string; sentence: string }[] = [];
  // AM2-7 1부: 문단째 받거나 문단째 버린다(문장 잠금 · 첫 원고 문장 되살림 없음). 받는 조건은 모두 결정론(accept.ts).
  const relNames = [...new Set((brief.timeline?.entries ?? []).flatMap(e => e.badges.map(b2 => relName(b2.label))))];
  const locks: { at: string; kind: string; detail: string; round: number }[] = [];
  const cardText = `${system.card}\n${chunks.map(c => chunkUser(intake, c)).join("\n")}`;
  const life = (brief.timeline?.lifetime ?? []).map(c => ({ ganji: c.ganji, startYear: c.startYear, endYear: c.endYear }));
  const baseY = Number(brief.baseDate.slice(0, 4));
  const tenRef = brief.product === "major_fortune" ? { start: baseY + 1, end: baseY + 10 } : (() => { const cyc = life.find(c => c.startYear <= year0 && year0 <= c.endYear); return cyc ? { start: cyc.startYear, end: cyc.endYear } : null; })();
  const BOUND = new Set([...FIX_BOUNDARY, ...REWRITE_BOUNDARY]);
  /** 차단(기록만 · 결정론 고침 몫 빼고)과 경계 깃발. */
  const hardOf = (fs: readonly ChunkFlag[]) => fs.filter(f => !RECORD_ONLY.has(f.rule) && !DET_RULES.has(f.rule));
  // 점수(새 차단 · 차단+경계 수)는 결정론 고침 몫(이름 · 정도말 · 칸 이름)도 센다 — 그것을 고친 것도 줄어든 것이다.
  const scoreOf = (chs: readonly FinalChapter[]) => { const s0 = inspect(chs), fx = fixOf(chs, s0); const hard = [...s0.block, ...s0.minor].filter(f => !RECORD_ONLY.has(f.rule) && (BLOCK_RULES.has(f.rule) || DET_RULES.has(f.rule) || !s0.minor.includes(f))), bound = fx.filter(f => BOUND.has(f.rule));
    const by = new Map<string, number>(); for (const f of hard) { const k2 = `${f.rule}|${f.chapter}|${headingOf(chs, f)}`; by.set(k2, (by.get(k2) ?? 0) + 1); } return { by, total: hard.length + bound.length }; };
  const planOf = (n: number) => intake.chapters.find(c => c.n === n);
  /** 소제목 핵심(반드시 쓸 것 · 둘째 핵심 이름 · 핵심 주장 글)과 분량 하한. */
  const coreOf2 = (n: number, heading: string, si: number) => { const pl = planOf(n), kp = pl?.keys?.find(k2 => k2.key === heading), sp = !kp ? pl?.sections?.[si] : undefined;
    const names = kp ? [...(kp.must ?? []).filter(m => m.what !== "대운과 겹침").map(m => m.what.replace(/ 반합$/, "")), ...(kp.links ?? []).filter(l => l.kind === "second" && l.rel).map(l => l.rel!.replace(/ 반합$/, ""))] : [];
    const claims = sp ? (sp.claimIds ?? []).map(id => { const l = intake.lines.find(x2 => x2.id === id); return l ? `${l.value} ${l.meaning}` : ""; }) : [];
    const min = kp ? (kp.depth === "short" ? KEY_TARGET.short[0] : kp.depth === "deep" ? KEY_TARGET.deep[0] : pl!.target[0]) : pl?.sections?.length ? pl.target[0] / pl.sections.length : 0;
    return { names, claims, min }; };
  /** 문단(또는 key 전체) 바꿈 하나를 받을지(1부 3). before/after = 그 자리 문단들. */
  const acceptOne = (t: { chapter: number; section: number; heading: string; index: number | "*" }, before: readonly string[], after: readonly string[], rules: readonly string[]): string[] => {
    const d = drafts.get(t.chapter); const sec = d?.chapter.sections[t.section]; if (!d || !sec) return ["자리 없음"];
    const paras = t.index === "*" ? [...after] : sec.paragraphs.map((p0, i) => (i === t.index ? after.join(" ") : p0));
    const why: string[] = [];
    const bT = before.join("\n"), aT = after.join("\n");
    why.push(...factIssues(bT, aT, relNames, cardText, exemptOf(rules)));
    const ordB = new Set(dayunOrderIssues(bT, life, tenRef)); why.push(...dayunOrderIssues(aT, life, tenRef).filter(x2 => !ordB.has(x2)));
    // 지시어: 바꾼 문단(앞 문단 기준)과 바로 다음 문단(바꾼 문단 기준).
    const idx = t.index === "*" ? 0 : t.index, prevP = idx > 0 ? sec.paragraphs[idx - 1] : sec.heading, nextP = t.index === "*" ? undefined : sec.paragraphs[idx + 1];
    const anB = new Set([...antecedentIssues(before.join(" "), prevP), ...(nextP ? antecedentIssues(nextP, before.join(" ")) : [])]);
    why.push(...[...antecedentIssues(after.join(" "), prevP), ...(nextP ? antecedentIssues(nextP, after.join(" ")) : [])].filter(x2 => !anB.has(x2)));
    const core = coreOf2(t.chapter, sec.heading, t.section);
    why.push(...claimIssues(sec.paragraphs.join(" "), paras.join(" "), core.names, core.claims));
    // 분량: key는 key 본문, 소제목은 장 전체(설계 분량이 장 단위다).
    { const isKey = Boolean(planOf(t.chapter)?.keys); const chText = (ps: readonly string[]) => d.chapter.sections.map((s2, si) => (si === t.section ? ps : s2.paragraphs).join("")).join("");
      const li = isKey ? lengthIssue(sec.paragraphs.join(""), paras.join(""), core.min) : lengthIssue(chText(sec.paragraphs), chText(paras), planOf(t.chapter)?.target[0] ?? 0); if (li) why.push(li); }
    if (why.length) return why;
    // 책 전체 다시 검사: 새 차단 0 · 차단+경계 수 줄어듦.
    const s1 = scoreOf(cur.chapters);
    const save = drafts.get(t.chapter)!;
    drafts.set(t.chapter, { ...save, chapter: { ...save.chapter, sections: save.chapter.sections.map((s2, si) => (si === t.section ? { ...s2, paragraphs: paras } : s2)) } });
    const s2 = scoreOf(build().chapters); drafts.set(t.chapter, save);
    // 결정론 고침 몫(이름 · 정도말 · 칸 이름 · 중립 꼴이 있는 전제 말)은 다음 결정론 단계가 고친다 — 새 차단으로 버리지 않는다.
    for (const [k2, n2] of s2.by) if (n2 > (s1.by.get(k2) ?? 0) && !DET_RULES.has(k2.split("|")[0])) why.push(`새 차단 ${k2.split("|")[0]}`);
    if (!why.length && s2.total >= s1.total) why.push(`차단+경계 ${s1.total} → ${s2.total}(줄지 않음)`);
    return why;
  };
  const lock: ParaLock = (t, before, after) => { const rules = t.issues.map(i => (i as { rule?: string }).rule ?? "");
    const why = acceptOne(t, before, after, rules);
    if (!why.length) { cur = build(); seen = inspect(cur.chapters); return { paragraphs: after, notes: [] }; }
    return { paragraphs: before, notes: [{ at: t.id, kind: "rejected", detail: why.slice(0, 4).join(" · ") }] }; };
  /** 1부 5: 결정론 고침(이름 부르기 · 정도말 · 칸 이름 머리말) — 다시 쓰기에 보내지 않고, 고친 뒤 받는 조건을 돈다. */
  const detLog: { at: string; rule: string; from: string; to: string; ok: boolean; why?: string }[] = [];
  const smallOf = (n: number, h: string) => { const kp = planOf(n)?.keys?.find(k2 => k2.key === h); return kp ? kp.lines.flatMap(id => [...(intake.lines.find(l => l.id === id)?.meaning ?? "").matchAll(/작은 ([가-힣]{2,})/g)].map(m => m[1])) : []; };
  const detTried = new Set<string>();
  const detPass = () => {
    const fs = [...seen.block, ...seen.minor, ...fixOf(cur.chapters, seen)].filter(f => (DET_RULES.has(f.rule) || f.rule === "input_premise" || f.rule === "time_deictic" || f.rule === "calendar_month") && f.paragraph >= 0 && !detTried.has(`${f.rule}|${normS(f.sentence)}`));
    for (const f of fs) detTried.add(`${f.rule}|${normS(f.sentence)}`);
    for (const f of fs) {
      const h = headingOf(cur.chapters, f), d = drafts.get(f.chapter); if (!d) continue; const si = d.chapter.sections.findIndex(s2 => s2.heading === h); if (si < 0) continue;
      const sec = d.chapter.sections[si], pi = sec.paragraphs.findIndex(p2 => holds(p2, f.sentence)); if (pi < 0) continue;
      const ss = splitSentences(sec.paragraphs[pi]); let changed = false;
      const out = ss.map(x2 => { if (!holds(x2, f.sentence)) return x2; const y = detFix(x2, f.rule, { callName: brief.person.callName, name: brief.person.name, small: smallOf(f.chapter, h), ...(intake.inputs ? { inputs: intake.inputs } : {}), ...(lctx.monthNames ? { months: lctx.monthNames } : {}), ...(lctx.bookYear ? { year: lctx.bookYear } : {}) }); if (y) { changed = true; return y; } return x2; });
      if (!changed) continue;
      const after = [out.join(" ")], why = acceptOne({ chapter: f.chapter, section: si, heading: h, index: pi }, [sec.paragraphs[pi]], after, [f.rule]);
      detLog.push({ at: `${f.chapter}.${si}.${pi}`, rule: f.rule, from: f.sentence.slice(0, 120), to: out.join(" ").slice(0, 120), ok: !why.length, ...(why.length ? { why: why.join(" · ") } : {}) });
      if (!why.length) { drafts.set(f.chapter, { ...d, chapter: { ...d.chapter, sections: d.chapter.sections.map((s2, j) => (j === si ? { ...s2, paragraphs: s2.paragraphs.map((p2, q) => (q === pi ? after[0] : p2)) } : s2)) } }); cur = build(); seen = inspect(cur.chapters); }
    }
  };
  const coverNew: string[] = [];
  const blockKeys = (fs: readonly ChunkFlag[], chs: readonly FinalChapter[], t: ParaTarget, text: readonly string[]) => new Set(fs.filter(f => f.chapter === t.chapter && headingOf(chs, f) === t.heading && (f.paragraph < 0 || text.some(x2 => holds(x2, f.sentence)))).map(f => `${f.rule}|${bareS(f.sentence)}`));
  // P6 annual-1: 소제목 단위 깃발(claim_months 「3.1 달 목록에 … 빠짐」)은 문단 하나를 바꿔도 생긴다 — 문단 교체 뒤에도 새로 생겼는지 본다(예전에는 「*」 교체에서만).
  const rewrite = async (all: Map<Chunk, ChunkFlag[]>, round: number, withCover = false) => {
    // 주문 상한 안에서 깃발이 많은 묶음부터(묶음 하나 다시 쓰기 어림 $0.05 — 문단 교체는 출력이 짧아 그보다 싸다).
    const fit = Math.floor(capLeft() / REWRITE_EST_USD);
    // AM2-6 5부: 차단 → 경계 → 고객이 알아챌 경미 순(묶음 안에서도, 묶음 사이에서도).
    const minTier = (fs: readonly ChunkFlag[]) => Math.min(...fs.map(tierOf), 9);
    const targets = new Map([...all].map(([c, fs]) => [c, [...fs].sort((p1, p2) => tierOf(p1) - tierOf(p2))] as const).sort((x, y) => minTier(x[1]) - minTier(y[1]) || y[1].length - x[1].length).slice(0, Math.max(0, fit)));
    if (!live || !targets.size) return false;
    const before = { chapters: cur.chapters, block: hardOf(seen.block) };
    const applied: { target: ParaTarget; before: readonly string[]; after: readonly string[] }[] = [];
    const plans = [...targets].map(([c, fs]) => ({ c, fs, ts: targetsOf(fs.slice(0, 16)) })).filter(x2 => x2.ts.length || (withCover && x2.c === chunk1));
    rounds.push({ round, chunks: plans.map(x2 => x2.c.id), flags: plans.reduce((x, v) => x + v.fs.length, 0), targets: plans.reduce((x, v) => x + v.ts.length, 0) });
    const queue = [...plans];
    await Promise.all(Array.from({ length: Math.min(concurrency(), queue.length) }, async () => { for (let next = queue.shift(); next; next = queue.shift()) { const { c, ts } = next;
      const cov = withCover && c === chunk1 ? coverFlags()[0] : undefined;
      const r = await replaceParagraphs({ o: opts(Math.max(0, capLeft())), intake, chunks, plan, system, sink, chunk: c, targets: ts, round, drafts, lock, ...(cov ? { cover: { line: cov.sentence.replace(/^\[표지\]\s*/, ""), reason: cov.hint ?? "" } } : {}) });
      runs.push(r.run); log.push(r.log); applied.push(...r.applied); locks.push(...r.locks.map(l2 => ({ ...l2, round })));
      if (r.cover) coverNew.push(r.cover.replace(/[*"“”]/g, "").trim());
      for (const n of r.changed) { const d = drafts.get(n)!; await sink.save({ n, chapter: d.chapter, source: d.source }); }
    } }));
    // 교체 문단이 차단을 새로 만들면 그 문단만 원래대로(기록).
    cur = build(); seen = inspect(cur.chapters);
    const nowFlags = hardOf(seen.block);
    let back = 0;
    for (const ap of applied) {
      const was = blockKeys(before.block, before.chapters, ap.target, ap.before), now = blockKeys(nowFlags, cur.chapters, ap.target, ap.after);
      // P6 annual-1: 차단(chapter_ref)을 고친 교체가 알림(chapter_repeat)을 새로 만들었다고 되돌리면 차단이 남는다 — 고친 것보다 가볍지 않은 새 깃발만 되돌림 까닭.
      const tierR = (k2: string) => tierOf({ rule: k2.split("|")[0] } as ChunkFlag);
      const fixedTier = Math.min(...[...was].filter(k2 => !now.has(k2)).map(tierR), 9);
      const fresh = [...now].filter(k2 => !was.has(k2) && tierR(k2) <= fixedTier);
      if (!fresh.length) continue;
      const d = drafts.get(ap.target.chapter)!; const sec = d.chapter.sections[ap.target.section];
      const paragraphs = ap.target.index === "*" ? [...ap.before] : sec.paragraphs.map((p2, i) => (i === ap.target.index ? ap.before[0] : p2));
      drafts.set(ap.target.chapter, { ...d, chapter: { ...d.chapter, sections: d.chapter.sections.map((s2, si) => (si === ap.target.section ? { ...s2, paragraphs } : s2)) } });
      for (const k2 of fresh) reverted.push({ at: ap.target.id, rule: k2.split("|")[0], sentence: nowFlags.find(f => `${f.rule}|${bareS(f.sentence)}` === k2)?.sentence.slice(0, 160) ?? "" });
      back++;
    }
    if (back) { cur = build(); seen = inspect(cur.chapters); }
    note([...seen.block, ...seen.minor, ...fixOf(cur.chapters, seen), ...repeatsOf(cur.chapters)]);
    return true;
  };
  // 표지 줄(1장이 든 묶음 맨 앞): 길이·피할 낱말·사실 규칙에 걸리면 그 묶음 다시 쓰기에 함께 넣는다.
  const chunk1 = chunks.find(c => c.parts.some(p => p.n === 1));
  const coverOf = (t: string) => (t.split(/\n##\s/)[0].match(/^\s*\[표지\]\s*(.+?)\s*$/m)?.[1] ?? "").replace(/[*"“”]/g, "").trim();
  const avoid = brief.chart.avoidImages ?? [];
  const firstOrig = chunk1 ? texts.get(chunk1.id) ?? "" : "";
  const coverFlags = (): ChunkFlag[] => {
    const line = coverNew.at(-1) ?? (chunk1 ? coverOf(texts.get(chunk1.id) ?? "") : ""); const i = line ? coverIssue(line, brief, avoid) : null;
    return i ? [{ chapter: 1, section: 0, paragraph: -2, rule: "cover", sentence: `[표지] ${line}`, hint: `표지 줄: ${i.reason} — 12~26자(공백 빼고) 한 줄, 명사로 끝나는 그 사람의 그림(「…의 그림」 같은 채움말 없이)` }] : [];
  };
  // 1) 차단 결함(+ 표지): 걸린 자리만 문단 교체(최대 2회). 경미(반복·끝말·화면 되풀이)는 그 묶음을 다른 까닭으로 고칠 때만 함께 넘긴다.
  // AM2-7 1부: 결정론 고침 먼저 → 다시 쓰기는 차단(기록만 · 결정론 몫 빼고) + 경계 일부(must_bare)만, 문단째 받거나 버린다(최대 2회).
  detPass();
  const triggersOf = () => [...hardOf(seen.block), ...fixOf(cur.chapters, seen).filter(f => REWRITE_BOUNDARY.has(f.rule))];
  for (let round = 1; round <= CHUNK_REWRITE_ROUNDS && (triggersOf().length || (round === 1 && coverFlags().length)); round++) {
    const withCover = round === 1 && coverFlags().length > 0;
    const targets = byChunk(triggersOf());
    if (withCover && chunk1 && !targets.has(chunk1)) targets.set(chunk1, []);
    if (!(await rewrite(targets, round, withCover))) break;
    detPass();
  }
  const repeatFirst = repeatsOf(cur.chapters).length;
  // 2) AM2-5 2부 지우기는 차단 결함에만. 지우면 핵심 주장 · 반드시 쓸 것 · 다음 문장이 가리키는 대상이 빠지는 자리는 지우지 않고 문단 교체로 넘긴다(1회). 그래도 남으면 그 문장을 남긴다(남은 차단으로 기록).
  const headingFor = (n: number, si: number) => intake.chapters.find(c => c.n === n)?.sections?.[si]?.q ?? null;
  const mustMissing = (chs: readonly FinalChapter[]) => new Set(inspect(chs).block.filter(f => f.rule === "must_miss").map(f => `${f.chapter}|${headingOf(chs, f)}`));
  // 절의 핵심 주장 달 목록(둘 이상)이 지우기 전에는 있고 뒤에는 빠지는 자리.
  const claimMonths = new Map(intake.chapters.flatMap(c => (c.sections ?? []).map((sp, si) => [`${c.n}.${si}`, [...new Set((sp.claimIds ?? []).flatMap(id => [...(`${intake.lines.find(l => l.id === id)?.meaning ?? ""}`).matchAll(/(?:2028년 )?(?:1[0-2]|[1-9])월 · [갑을병정무기경신임계][자축인묘진사오미신유술해]월/g)].map(m => m[0])))]] as const)).filter(([, ms]) => ms.length >= 2));
  const claimLost = (from: readonly FinalChapter[], to: readonly FinalChapter[]) => [...claimMonths].filter(([at, ms]) => { const [n, si] = at.split(".").map(Number); const txt = (chs: readonly FinalChapter[]) => (chs.find(c => c.n === n)?.sections[si]?.paragraphs ?? []).join(" "); return ms.every(m => txt(from).includes(m)) && !ms.every(m => txt(to).includes(m)); }).map(([at]) => at);
  const flagKey = (f: ChunkFlag) => `${f.rule}|${f.chapter}.${f.section}.${f.paragraph}|${normS(f.sentence)}`;
  const kept = new Set<string>();
  const cutPass = () => {
    const hard = cuttable(hardOf(seen.block)).filter(f => !kept.has(flagKey(f)));
    const r = cutFlagged(cur.chapters, hard, headingFor);
    const lostMust = new Set([...mustMissing(r.chapters)].filter(k2 => !mustMissing(cur.chapters).has(k2)));
    const lostClaim = new Set(claimLost(cur.chapters, r.chapters));
    const leanAt = new Set(r.cut.filter(c2 => c2.why !== "flagged").map(c2 => c2.at));
    // AM2-6 5부: 처방 문장을 지워 그 장에 처방이 없어지면(결과 문장만 남음 — P5 세운 10.2) · 앞말을 지워 가리키는 말이 고아가 되면(9.1 「두 소망」) 지우지 않고 교체로.
    const rxLeft = (chs: readonly FinalChapter[], n: number) => adviceSentenceAt(chs, n).length;
    const rxLost = new Set(hard.filter(f => f.paragraph >= 0 && rxLeft(cur.chapters, f.chapter) > 0 && rxLeft(r.chapters, f.chapter) === 0).map(f => f.chapter));
    const orphanBefore = new Set(am26Flags(cur.chapters, bctx).filter(f => f.rule === "orphan_deictic").map(f => `${f.chapter}.${f.section}`));
    const orphanNew = new Set(am26Flags(r.chapters, bctx).filter(f => f.rule === "orphan_deictic").map(f => `${f.chapter}.${f.section}`).filter(k2 => !orphanBefore.has(k2)));
    // AM2-7 1부 7: 지운 뒤 지시어 앞말 검사(accept.ts)를 다시 돈다 — 새 고아가 생기는 소제목의 지우기는 하지 않는다.
    const secText = (chs: readonly FinalChapter[], n: number, h: string) => chs.find(c => c.n === n)?.sections.find(s2 => s2.heading === h);
    const anOf = (sec: { heading: string; paragraphs: readonly string[] } | undefined) => new Set((sec?.paragraphs ?? []).flatMap((p2, i) => antecedentIssues(p2, i ? sec!.paragraphs[i - 1] : sec!.heading)));
    const anNew = new Set(hard.filter(f => { const h = headingOf(cur.chapters, f), b0 = anOf(secText(cur.chapters, f.chapter, h)); return [...anOf(secText(r.chapters, f.chapter, h))].some(x2 => !b0.has(x2)); }).map(f => `${f.chapter}.${f.section}`));
    // AM2-7 재현(R7 major-p5 9.0 — 다시 쓰기는 「대운 이름을 잃는다」며 버렸는데 지우기가 그 문장을 통째로 지웠다): 장의 유일한 대운 이름 · 간지 해를 지우는 지우기는 하지 않는다.
    const factOnly = new Set(hard.filter(f => { const names = [...f.sentence.matchAll(/([갑을병정무기경신임계][자축인묘진사오미신유술해]) 대운|20\d\d년 [갑을병정무기경신임계][자축인묘진사오미신유술해]년/g)].map(m => m[0]); if (!names.length) return false;
      const rest = (r.chapters.find(c => c.n === f.chapter)?.sections ?? []).flatMap(s2 => s2.paragraphs).join(" "); return names.some(nm => !rest.includes(nm)); }).map(f => `${f.chapter}.${f.section}.${f.paragraph}`));
    // AM2-7 재현(R7 major-p6b 6.2 ¶2): 지운 문장이 낸 말(「반경」)을 같은 문단 뒤 문장이 받으면 지우지 않는다.
    const paraAt = (f: ChunkFlag) => { const ps = secText(cur.chapters, f.chapter, headingOf(cur.chapters, f))?.paragraphs ?? []; return { p: ps[f.paragraph] ?? "", prev: f.paragraph > 0 ? ps[f.paragraph - 1] ?? "" : headingOf(cur.chapters, f) }; };
    const leanNew = new Set(hard.filter(f => f.paragraph >= 0 && (() => { const { p, prev } = paraAt(f); return leanOnCut(p, f.sentence, prev).length > 0; })()).map(f => `${f.chapter}.${f.section}.${f.paragraph}`));
    const unsafe = hard.filter(f => f.paragraph >= 0 && (leanNew.has(`${f.chapter}.${f.section}.${f.paragraph}`) || factOnly.has(`${f.chapter}.${f.section}.${f.paragraph}`) ||lostMust.has(`${f.chapter}|${headingOf(cur.chapters, f)}`) || lostClaim.has(`${f.chapter}.${f.section}`) || leanAt.has(`${f.chapter}.${f.section}.${f.paragraph}`) || rxLost.has(f.chapter) || orphanNew.has(`${f.chapter}.${f.section}`) || anNew.has(`${f.chapter}.${f.section}`)));
    return { r, unsafe };
  };
  let pass = cutPass();
  let unsafeRound: string[] = [];
  if (pass.unsafe.length && live) {
    const t0 = byChunk(pass.unsafe);
    if (await rewrite(t0, CHUNK_REWRITE_ROUNDS + 1)) { unsafeRound = [...t0.keys()].map(c => c.id); pass = cutPass(); }
  }
  for (const f of pass.unsafe) kept.add(flagKey(f));
  if (pass.unsafe.length) pass = cutPass();
  // 지운 뒤에도 남은 차단 결함은 그 문단만 뺀다 — 단, 빼면 반드시 쓸 것·핵심 주장이 빠지는 문단은 남긴다(남은 차단).
  const droppedLeft: string[] = [];
  const dropBad = (r: ReturnType<typeof cutFlagged>) => {
    const after = inspect(r.chapters), left = cuttable(hardOf(after.block)).filter(f => !kept.has(flagKey(f)));
    const bad = new Set(left.filter(f => f.paragraph >= 0).map(f => `${f.chapter}.${f.section}.${f.paragraph}`));
    const badHead = new Set(left.filter(f => f.paragraph === -1).map(f => `${f.chapter}.${f.section}`));
    const drop = (keep: ReadonlySet<string>) => r.chapters.map(c => ({ ...c, sections: c.sections.flatMap((sec, si) => {
      if (badHead.has(`${c.n}.${si}`) && !c.keys?.includes(sec.heading) && !keep.has(`${c.n}.${si}`)) return [];
      const paragraphs = sec.paragraphs.filter((_p, pi) => !bad.has(`${c.n}.${si}.${pi}`) || keep.has(`${c.n}.${si}.${pi}`));
      if (!paragraphs.length && !c.keys?.includes(sec.heading)) return [];
      return [{ ...sec, paragraphs }];
    }) }));
    // AM2-7 1부 7: 지우고도 남은 차단은 문단째 빼지 않는다(핵심 · 앞말을 잃는다) — 그 자리는 발행 보류(generation_hold)로 넘긴다.
    const chs = drop(new Set([...bad, ...[...badHead]]));
    const lostM = new Set([...mustMissing(chs)].filter(k2 => !mustMissing(r.chapters).has(k2))), lostC = new Set(claimLost(r.chapters, chs));
    const keepSet = new Set([...bad].filter(at => { const [n, si] = at.split(".").map(Number); return lostM.has(`${n}|${r.chapters.find(c => c.n === n)?.sections[si]?.heading ?? ""}`) || lostC.has(`${n}.${si}`); }));
    void lostM; void lostC; void keepSet;
    for (const f of left) kept.add(flagKey(f));
    const emptyKeys = chs.flatMap(c => c.sections.filter(sec => c.keys?.includes(sec.heading) && !sec.paragraphs.length).map(sec => ({ chapter: c.n, key: sec.heading })));
    const emptyChapters = chs.filter(c => !c.keys && !c.sections.length).map(c => c.n);
    return { chapters: chs, emptyKeys, emptyChapters };
  };
  let cut0 = { r: pass.r, ...dropBad(pass.r) };
  let emptyRetry: string[] = [];
  if (cut0.emptyKeys.length || cut0.emptyChapters.length) {
    const fs = [...cut0.emptyKeys.map(e => ({ chapter: e.chapter, section: cur.chapters.find(c => c.n === e.chapter)?.sections.findIndex(sec => sec.heading === e.key) ?? 0, paragraph: -3, rule: "emptied", sentence: `[${intake.chapters.flatMap(c => c.keys ?? []).find(k2 => k2.key === e.key)?.label ?? e.key}] 본문이 모두 빠짐`, hint: "걸린 문장을 지우다 이 자리가 비었다 — 아래 걸린 문장을 피해 카드 줄·연결 고리로 다시 쓴다" }) as ChunkFlag)];
    const t0 = byChunk([...fs, ...seen.block.filter(f => cut0.emptyKeys.some(e => e.chapter === f.chapter && headingOf(cur.chapters, f) === e.key))]);
    if (t0.size && await rewrite(t0, CHUNK_REWRITE_ROUNDS + 2)) { emptyRetry = [...t0.keys()].map(c => c.id); pass = cutPass(); cut0 = { r: pass.r, ...dropBad(pass.r) }; }
  }
  const cutR = cut0.r;
  let chapters: FinalChapter[] = cut0.chapters;
  const replaced: { chapter: number; key?: string; why: string }[] = [...cut0.emptyKeys.map(e => ({ chapter: e.chapter, key: e.key, why: "emptied" })), ...cut0.emptyChapters.map(n => ({ chapter: n, why: "chapter_emptied" }))];
  // 남은 빈 자리는 형식(렌더)만 맞춘다 — 결정론 글이 든 장은 발행 관문(policy judgeBuild)이 보류로 돌린다(keys_filled · deterministic).
  const empty = replaced.filter(r => r.key).map(r => ({ chapter: r.chapter, key: r.key! }));
  if (replaced.length) chapters = writeKeyFill(brief, plan, chapters, empty).map(c => (replaced.some(r => r.chapter === c.n && !r.key && !c.keys) ? { ...c, source: "deterministic" as const } : replaced.some(r => r.chapter === c.n && r.key) ? { ...c, reason: `keys_filled:${replaced.filter(r => r.chapter === c.n && r.key).map(r => r.key).join(",")}` } : c));
  // P6 annual-1: 문단 하나로 온 달·해 key는 문장 경계에서 둘로(형식만, 글자 그대로).
  chapters = splitKeyParagraphs(chapters, plan, brief.mbti?.type ?? null);
  const final = inspect(chapters);
  // AM2-7 1부 7: 고칠 수 없는 차단이 남으면 그 장을 발행 보류(generation_hold) — judgeBuild가 정식본으로 내보내지 않는다.
  // 분량(key_len)은 참고 지표다(CLAUDE.md 품질 하한선) — 다시 쓰기는 부르되 보류 사유로 세지 않는다.
  const holdLeft = hardOf(final.block).filter(f => f.rule !== "key_len");
  if (holdLeft.length) { const byCh = new Map<number, string[]>(); for (const f of holdLeft) byCh.set(f.chapter, [...new Set([...(byCh.get(f.chapter) ?? []), f.rule])]);
    chapters = chapters.map(c => (byCh.has(c.n) ? { ...c, reason: `${c.reason ? `${c.reason};` : ""}generation_hold:${byCh.get(c.n)!.join(",")}` } : c)); }
  // AM2-5 2부: 남은 반복·끝말 집계는 시스템 머리 문장을 넣기 전 원고로(머리 문장은 heads로도 뺀다).
  const finalRepeats = repeatsOf(chapters);
  const finalFix = fixOf(chapters, final);
  // 3-2 소망 원문은 렌더 단계에서 넣는다(작가는 «바람» 표시만 — 원문을 고칠 수 없다. P2 판독 annual-1: 1장은 원문, 9장은 「지금」을 뺀 꼴로 인용이 두 가지였다).
  // AM2-5 P5 자동 점검(세운 annual-1 — 연결 고리의 「적어 준 바람의 … 쪽」을 작가가 «바람»으로 옮겨 바람 원문이 7장에 여섯 번 통째로 들어갔다): 원문은 책에서 처음 한 번만, 그 뒤는 「적어 준 바람」.
  let wishSeen = false;
  // AM2-6 3부: 원문 «…» 뒤 조사는 원문 끝 글자로 고른다(작가는 「«바람»이라는」처럼 받침 있는 꼴로 쓴다 — 원문 끝이 「요」면 「라는」).
  const wishJosa = (w: string, rest: string) => fitJosa(w.replace(/[^가-힣]/g, "").slice(-1), rest);
  const wishOnce = (t: string) => t.split(WISH_MARK).reduce((acc, part, i) => { if (i === 0) return part; const raw = intake.wish && !wishSeen; const w = raw ? `«${intake.wish}»` : "적어 준 바람"; wishSeen = true; return `${acc}${w}${raw ? wishJosa(intake.wish!, part) : part}`; }, "");
  chapters = chapters.map(c => ({ ...c, sections: c.sections.map(sec => ({ ...sec, heading: sec.heading.split(WISH_MARK).join("적어 준 바람"), paragraphs: sec.paragraphs.map(p => wishOnce(p)) })) }));
  chapters = insertFixedLines(chapters, brief);
  const rendered = renderTerms(chapters, brief, k); chapters = rendered.chapters;

  // 표지·키워드(1장이 든 묶음의 원문 — 다시 쓴 원고 먼저, 없으면 첫 원고). 걸림 없는 작가 줄 → 걸림 없는 엔진 그림 → 덜 걸린 작가 줄.
  const latest = chunk1 ? texts.get(chunk1.id) ?? "" : "";
  const coverCands = [...new Set([...[...coverNew].reverse(), coverOf(latest), coverOf(firstOrig)].filter(Boolean))];
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
  const finalFlags = new Set([...final.block, ...final.minor, ...finalFix, ...finalRepeats].map(f => `${f.rule}|${normS(f.sentence)}`));
  const keptS = new Set([...kept].map(k2 => k2.split("|").slice(2).join("|")));
  const cutSet = new Set([...cutR.cut.map(c2 => normS(c2.sentence)), ...droppedLeft.map(d2 => normS(d2.replace(/^[^:]*:/, "")))]);
  const disposition = [...ledger].map(([k2, v]) => {
    const ns = normS(v.sentence), still = finalFlags.has(k2);
    // AM2-5 2부: 경미 깃발은 지우지 않는다(점수로 기록 = 허용). 차단인데 지우면 핵심·반드시 쓸 것·가리키는 대상이 빠지는 문장은 남김(남은 차단).
    // AM2-6 5부: 교체 대상(경계 · 고객이 알아챌 경미)은 허용으로 끝내지 않는다 — 교체 뒤에도 남으면 「남음(교체 대상)」으로 따로 센다.
    const how: "rewrite" | "delete" | "allow" | "keep" | "left" | "none" = v.rule === "cover" ? (cover.issue === null || cover.source === "fallback" ? "rewrite" : "none")
      : cutSet.has(ns) && !finalText.has(ns) ? "delete" : !still ? "rewrite" : FIX_RULES.has(v.rule) ? "left" : keptS.has(ns) || NO_SENTENCE_RULES.has(v.rule) || v.rule === "key_len" ? "keep" : ALLOW_RULES.has(v.rule) || MINOR_RULES.has(v.rule) ? "allow" : "none";
    return { ...v, how, ...(how === "allow" ? { why: ALLOW_WHY[v.rule] ?? "경미 — 점수로만 기록(지우기는 차단 결함에만, AM2-5 2부)" } : how === "keep" ? { why: "차단이지만 지우면 그 자리의 핵심 주장·반드시 쓸 것·가리키는 대상이 빠진다 — 문단 교체 뒤에도 남아 남은 차단으로 기록" } : how === "left" ? { why: "교체 대상(경계 · 고객이 알아챌 경미) — 문단 교체 뒤에도 남음(지우지 않는다)" } : {}) }; });
  const dispCount = disposition.reduce<Record<string, number>>((o, d2) => ({ ...o, [d2.how]: (o[d2.how] ?? 0) + 1 }), {});
  const review: Record<string, unknown> = {
    mode: "chunked", version: CHUNK_PROMPT_VERSION, model: null, calls: 0, skipped: "chunked_no_review",
    briefCheck: { ok: briefOk, issues: issues.slice(0, 40) }, chunks: chunks.map(c => ({ id: c.id, parts: c.parts, chars: c.chars })), log,
    blockFirst: firstBlock, rounds, repeatFirst, reverted, unsafeRound, deleted: cutR.cut, headingsReplaced: cutR.headings, droppedSections: [...cutR.droppedSections, ...droppedLeft], missed: cutR.missed.map(f => `${f.chapter}.${f.section}.${f.paragraph}:${f.rule}`), replaced, emptyRetry,
    remainingMinor: final.minor.map(f => ({ at: `${f.chapter}.${f.section}.${f.paragraph}`, rule: f.rule, sentence: f.sentence.slice(0, 160) })),
    remainingHard: final.block.map(f => ({ at: `${f.chapter}.${f.section}.${f.paragraph}`, rule: f.rule, detail: f.detail ?? "", sentence: f.sentence.slice(0, 200) })),
    remainingRepeat: finalRepeats.map(f => ({ at: `${f.chapter}.${f.section}.${f.paragraph}`, rule: f.rule, detail: f.detail ?? "", sentence: f.sentence.slice(0, 160) })),
    style: styleScoreOf(final.lint), cover: { source: cover.source, firstProblem: cover.issue },
    hold: holdLeft.map(f => ({ at: `${f.chapter}.${f.section}.${f.paragraph}`, rule: f.rule, sentence: f.sentence.slice(0, 160) })), det: detLog,
    remainingFix: finalFix.map(f => ({ at: `${f.chapter}.${f.section}.${f.paragraph}`, rule: f.rule, detail: f.detail ?? "", sentence: f.sentence.slice(0, 160) })), locks,
    disposition: { counts: { rewrite: dispCount.rewrite ?? 0, delete: dispCount.delete ?? 0, allow: dispCount.allow ?? 0, keep: dispCount.keep ?? 0, left: dispCount.left ?? 0, none: dispCount.none ?? 0 }, kept: disposition.filter(d2 => d2.how === "keep").map(d2 => ({ at: d2.at, rule: d2.rule, sentence: d2.sentence.slice(0, 140) })), left: disposition.filter(d2 => d2.how === "left").map(d2 => ({ at: d2.at, rule: d2.rule, sentence: d2.sentence.slice(0, 140) })), allowed: disposition.filter(d2 => d2.how === "allow").map(d2 => ({ at: d2.at, rule: d2.rule, why: d2.why, sentence: d2.sentence.slice(0, 140) })), none: disposition.filter(d2 => d2.how === "none").map(d2 => ({ at: d2.at, rule: d2.rule, sentence: d2.sentence.slice(0, 160) })) },
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

/** 앞말 끝 글자에 맞춘 조사(받침 있음 ↔ 없음). 「이라는/라는 · 이라고/라고 · 이에요/예요 · 은/는 · 이/가 · 을/를 · 과/와 · 으로/로 · 이란/란 · 이라/라」. */
export function fitJosa(last: string, rest: string): string {
  if (!last) return rest;
  const code = last.charCodeAt(0) - 0xac00; if (code < 0 || code > 11171) return rest;
  const jong = code % 28, batchim = jong !== 0, rieul = jong === 8;
  const PAIRS: readonly (readonly [string, string])[] = [["이라는", "라는"], ["이라고", "라고"], ["이에요", "예요"], ["이었", "였"], ["이란", "란"], ["이라", "라"], ["으로", "로"], ["은", "는"], ["이", "가"], ["을", "를"], ["과", "와"]];
  for (const [withB, noB] of PAIRS) {
    const single = withB.length === 1;
    const re = (w: string) => new RegExp(`^${w}${single ? "(?=[\\s.,!?」』)]|$)" : ""}`);
    if (re(withB).test(rest) || re(noB).test(rest)) { const cur = re(withB).test(rest) ? withB : noB; const want = withB === "으로" ? (batchim && !rieul ? "으로" : "로") : batchim ? withB : noB; return want + rest.slice(cur.length); }
  }
  return rest;
}

/**
 * P6 annual-1(2026-11-12): 달 key · 짧게 해 key는 문단 2개인데, 작가가 문단 하나로 쓴 key는 문단 교체로 나눌 수 없다(13 key 가운데 11).
 * 문장 4개 이상인 한 문단 key를 문장 경계에서 둘로 나눈다(글자는 그대로 — 형식만). 둘째 문단은 장면(「…라면」) · 짝(유형 이름) · 「한편」 문장에서 열고,
 * 없으면 두 문단 길이가 가장 비슷한 자리에서. 문단마다 문장 2개 이상. 핵심 문장 표시 ⟪…⟫ 안에서는 나누지 않는다.
 */
export function splitKeyParagraphs(chapters: readonly FinalChapter[], plan: readonly { n: number; keys?: readonly string[] }[], mbti: string | null): FinalChapter[] {
  const opens = (s: string) => /라면[,]? |라면$|^한편/.test(s) || Boolean(mbti && s.includes(mbti));
  return chapters.map(c => {
    const keys = new Set([...(c.keys ?? []), ...(plan.find(p => p.n === c.n)?.keys ?? [])]);
    if (!keys.size) return c;
    let changed = false;
    const sections = c.sections.map(s => {
      const ps = s.paragraphs.filter(p => p.trim());
      if (!keys.has(s.heading) || ps.length !== 1) return s;
      const ss = splitSentences(ps[0]);
      if (ss.length < 4) return s;
      const ok = (i: number) => { const a = ss.slice(0, i).join(" "); return (a.match(/⟪/g) ?? []).length === (a.match(/⟫/g) ?? []).length; };
      const cand = Array.from({ length: ss.length - 3 }, (_, j) => j + 2).filter(ok);
      if (!cand.length) return s;
      const len = (i: number) => Math.abs(ss.slice(0, i).join(" ").length - ss.slice(i).join(" ").length);
      const at = cand.find(i => opens(ss[i])) ?? [...cand].sort((x, y) => len(x) - len(y))[0];
      changed = true;
      return { ...s, paragraphs: [ss.slice(0, at).join(" "), ss.slice(at).join(" ")] };
    });
    return changed ? { ...c, sections } : c;
  });
}

