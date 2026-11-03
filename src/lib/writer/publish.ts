/**
 * v5 발행 조립(P3 C·F): 입력 → 브리프 → 작가(스트리밍 1회, 장 저장) → 안전망(결정론 보충) → v5 Book 스냅샷.
 * recover=true면 작가를 부르지 않고 저장된 장 + 결정론 작가로만 완성한다(회수 크론).
 * 어떤 단계가 실패해도 결정론 작가로 Book을 만든다. 만세력·MBTI 표만 기존 v4 계산을 빌리고, 실패하면 표 페이지 없이 낸다.
 */
import { createHash } from "node:crypto";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { BookPerson } from "@/app/dev/book-preview/bookTypes";
import { buildBrief, loadKnowledge, type Knowledge } from "@/lib/brief";
import { DEFAULT_KNOWLEDGE_ROOT } from "@/lib/brief/knowledge";
import { stableStringify } from "@/lib/brief/seed";
import type { Brief } from "@/lib/brief/schema";
import { generateV4ShadowReport } from "@/lib/interpretation-v4/runtimeShadow";
import { projectV4Tables, type V4RuntimeEvidence } from "@/lib/interpretation-v4/runtimeProjection";
import { resolveLlmConfig, type LlmProvider, type LlmTarget } from "@/lib/llm";
import { calculateCompatibilitySaju } from "@/lib/report-generation/compatibilityGenerationHandler";
import { normalizeReportInputPayload } from "@/lib/report-generation/reportInputAdapter";
import { buildCanonicalNatalTable, type CanonicalNatalTableEvidence } from "@/lib/report-knowledge/natalTableEvidence";
import { buildMbtiCommonProfileTableData } from "@/lib/report-tables/mbtiProfileTableData";
import { getMbtiSourceByType } from "@/lib/report-tables/mbtiSourceRegistry";
import type { MbtiCommonProfileTableData } from "@/lib/report-tables/types";
import type { SajuCalcResult } from "@/lib/saju/types";
import { birthTimeSlotLabel } from "@/lib/saju/birthTimePrecisionTypes";
import { SAJU_CALENDAR_VERSION } from "@/lib/saju/calendarVersion";
import type { ProductPreviewSnapshot } from "@/lib/report-generation/productPreviewSnapshot";
import type { ReportInputPayload } from "@/lib/report-generation/reportInputTypes";
import { withV5NatalRows } from "@/lib/report-tables/v5NatalRows";
import { analyzeChartDetections } from "@/lib/saju/detections";
import { assembleV5Book, createV5Snapshot, payloadToBriefInput, type WriterMeta } from "./book";
import { buildWriterPrompt, renderWriterBrief, WRITER_PROMPT_VERSION, type WriterChapter } from "./prompt";
import { materialTable } from "./prompt/materials";
import { redoChapters, runWriter, WRITER_TIME_BUDGET_MS, type ChapterSink, type WriterOptions, type WriterRun } from "./runner";
import { repairPass } from "./repair";
import { applySafetyNet, safetyFacts, sentenceViolation, type DraftChapter } from "./safety";
import { copyWindows, dayunPhase, MYEONGRI_PREFIX, NICKNAME_KEYS, type ElementPresence } from "./safety/lint";
import { enforce, lintBook, tidyBook, type LintCtx, type LintFlag } from "./safety/p6c";
import { matchJob, PROPS } from "@/lib/brief/props";
import type { PriorBooks } from "./prior";

let knowledgeCache: { k: Knowledge; version: string } | null = null;
/** 지식 DB와 그 내용 해시(Book 메타데이터의 지식 버전). */
export function writerKnowledge(root = DEFAULT_KNOWLEDGE_ROOT): { k: Knowledge; version: string } {
  if (knowledgeCache) return knowledgeCache;
  const h = createHash("sha256");
  const walk = (dir: string) => { for (const f of readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) { const p = join(dir, f.name); if (f.isDirectory()) { if (f.name !== "legacy") walk(p); } else if (f.name.endsWith(".json")) h.update(f.name).update(readFileSync(p)); } };
  walk(root);
  knowledgeCache = { k: loadKnowledge(root), version: `knowledge-v5:${h.digest("hex").slice(0, 12)}` };
  return knowledgeCache;
}

export const briefHash = (b: Brief) => createHash("sha256").update(stableStringify(b)).digest("hex").slice(0, 16);
/** KST 기준 날짜(YYYY-MM-DD). */
export const kstDate = (iso: string) => new Date(Date.parse(iso) + 9 * 3_600_000).toISOString().slice(0, 10);

/** 표만 쓰는 v4 근거 묶음: v4 원고 생성 없이 같은 계산(calculateSaju)·원국 표·MBTI 표만 만든다. */
function v4TableEvidence(payload: ReportInputPayload, policyAt: string): V4RuntimeEvidence | null {
  const n = normalizeReportInputPayload(payload, { now: () => new Date(policyAt) });
  if (!n.ok) return null;
  const input = n.value;
  const slots = input.kind === "compatibility" ? [["personA", input.personA], ["personB", input.personB]] as const : [["person", input.person]] as const;
  const calculations: Record<string, SajuCalcResult> = {}, natalTableEvidence: Record<string, CanonicalNatalTableEvidence> = {}, mbtiTables: Record<string, MbtiCommonProfileTableData | null> = {};
  for (const [slot, p] of slots) {
    const calc = calculateCompatibilitySaju(p), table = calc.birthTimeContext && buildCanonicalNatalTable(calc.birthTimeContext);
    if (!table) return null;
    const source = getMbtiSourceByType(p.mbtiType);
    calculations[slot] = calc; natalTableEvidence[slot] = table; mbtiTables[slot] = source ? buildMbtiCommonProfileTableData(source) : null;
  }
  return JSON.parse(JSON.stringify({ input, calculations, natalTableEvidence, mbtiTables })) as V4RuntimeEvidence;
}

/** 만세력·MBTI 표(BookPerson): 기존 v4 계산을 한 번 빌려 고정한다. 십이신살·신살/귀인·합충형파해 줄은 v5 엔진 결과로 바꾼다(P6).
 * v4 원고 생성이 입력을 거절하면(P6: 궁합 V4_COMPATIBILITY_GENERATION_FAILED) 표만 따로 만든다. 그마저 실패하면 빈 배열(표 페이지 없이 발행). */
export async function v4People(payload: ReportInputPayload, policyAt: string): Promise<BookPerson[]> {
  try {
    const v4 = await generateV4ShadowReport(payload, { evaluatedAt: policyAt, policyDate: policyAt });
    const evidence = v4.ok && v4.evidencePacket ? v4.evidencePacket as V4RuntimeEvidence : v4TableEvidence(payload, policyAt);
    if (!evidence) return [];
    const tables = projectV4Tables(evidence);
    const persons = payload.productKey === "saju_mbti_compatibility" ? [[payload.personA, "A", "personA"], [payload.personB, "B", "personB"]] as const : [[payload.person, "주인공", "person"]] as const;
    return persons.map(([p, role, slot], i) => ({ name: p.name, role, birth: p.birthDate, gender: p.gender, precision: p.birthTimeUnknown ? "unknown" : p.birthTimePrecision ?? "exact", time: p.birthTime ?? "", mbti: p.mbtiType ?? "",
      // 대략 시간대도 같은 줄 형식(P6: 대략 입력이 "정확 · "(빈 시각)으로 나왔다). 새 책은 현재 달력 기준 시간대 이름.
      timeLabel: p.birthTimeUnknown ? "출생시간 모름" : p.birthTimePrecision === "approximate" ? `대략 · ${birthTimeSlotLabel(p.approximateBirthTimeSlot, SAJU_CALENDAR_VERSION) ?? "입력 시간대"}` : `정확 · ${p.birthTime}`,
      table: withV5NatalRows(tables[i], analyzeChartDetections(evidence.calculations[slot])) }));
  } catch { return []; }
}

export type V5BuildDeps = Partial<Pick<WriterOptions, "stream" | "now" | "sleep" | "budgetMs" | "apiKey" | "fetchImpl" | "maxOutputTokens">> & {
  readonly provider?: LlmProvider; readonly model?: string; readonly people?: (payload: ReportInputPayload, policyAt: string) => Promise<BookPerson[]>;
  /** 대체 모델(P6b A-2). undefined면 환경 설정(LLM_FALLBACK, 기본 openai/gpt-6.1-terra), null이면 대체 없음. 키를 넣으면 그 키로 부른다. */
  readonly fallback?: (LlmTarget & { readonly apiKey?: string }) | null;
};

/** 검사 문맥(P6c): 브리프·지식 DB에서 고객 사실과 사전(그림 별명·직업 소품·MBTI 쉬운 이름·브리프 글 창)을 모은다. */
export function lintContext(brief: Brief, k: Knowledge, plan: readonly WriterChapter[], prior: readonly string[]): LintCtx {
  const f = safetyFacts(brief), compat = Boolean(brief.compatibility), c = brief.chart;
  const job = matchJob(brief.person.facts.job.detail);
  const status = brief.person.facts.job.status as keyof typeof PROPS.jobStatus;
  // 커리어 책은 일의 단계 장면(PRD·스프린트·지표·QA, E1)이 절마다의 근거라 세지 않는다. 장식 소품(props)만 장마다 1번(C4).
  const stages = Object.values(job?.stages ?? {}).flat(), career = brief.product === "career_money_study";
  const jobProps = compat ? [] : career ? (job?.props ?? PROPS.jobStatus[status] ?? []).filter(x => !stages.includes(x)) : [...(job?.props ?? PROPS.jobStatus[status] ?? []), ...stages];
  const ids = (re: RegExp) => new Set(plan.filter(ch => re.test(ch.id)).map(ch => ch.n));
  const table = materialTable(k), plain: Record<string, string> = {};
  for (const t of [brief.mbti?.type, brief.partner?.mbti?.type]) for (const fn of (t ? k.mbti.get(t)?.cognitiveFunctions : undefined) ?? []) { const v = table.plain.get(fn.easy); if (v && !plain[fn.code]) plain[fn.code] = v; }
  const cd = c.currentDayun;
  return {
    facts: f, jobDetail: brief.person.facts.job.detail, compat,
    schoolStage: brief.person.facts.job.class !== "student" ? "none" : brief.person.age < 19 ? "student" : "college",
    ...(compat ? {} : { yinYang: { yin: c.yinYang.yin, yang: c.yinYang.yang }, ...(c.elements.presence ? { presence: c.elements.presence as ElementPresence } : {}),
      ...(cd ? { dayunPhase: dayunPhase(c.thisYear.year - Number(cd.years.slice(0, 4))) } : {}),
      ...(c.stars ? { stars: { spouse: c.stars.spouse.where, child: c.stars.child.where } } : {}) }),
    coreImage: brief.compatibility?.pairImage.line ?? c.coreImage.line,
    nicknames: [...new Set([...[...k.features.values()].map(x => x.easyName), ...NICKNAME_KEYS])],
    // 작가가 본 글(재료로 바꾼 브리프)과 원문 브리프: 20자 넘게 이어 옮기면 고쳐 쓴다(A1).
    corpus: copyWindows([JSON.stringify(renderWriterBrief(brief, { knowledge: k })), JSON.stringify(renderWriterBrief(brief))]),
    prior, jobProps,
    noJobChapters: brief.product === "love_marriage_child" ? new Set(plan.map(ch => ch.n)) : ids(/^(love|family)$/),
    parentingChapters: brief.product === "love_marriage_child" ? ids(/^parenting$/) : new Set(), monthChapters: brief.product === "annual_fortune" ? ids(/^month$/) : new Set(),
    mbtiPlain: plain, periods: Object.fromEntries((brief.timeline?.entries ?? []).map(e => [e.key, e.period])),
  };
}

/** 표지 한 줄(P6c G): 16~26자, 설명문("~일주예요")·"명리학에서" 금지. 어기면 핵심 이미지. */
export function coverLineOf(raw: string | null, brief: Brief): { line: string; source: "writer" | "fallback" } {
  const fallback = brief.compatibility?.pairImage.line ?? brief.chart.coreImage.line;
  const v = (raw ?? "").replace(/^\[표지\]\s*/, "").replace(/[*"“”]/g, "").trim();
  const bad = !v || v.length < 16 || v.length > 26 || MYEONGRI_PREFIX.test(v) || /일주(예요|입니다|이에요)|(입니다|이에요|예요|해요)[.!]?$/.test(v) || sentenceViolation(v, safetyFacts(brief)) !== null;
  return bad ? { line: fallback, source: "fallback" } : { line: v, source: "writer" };
}

export async function buildV5Snapshot(a: { payload: ReportInputPayload; reportId: string; policyAt: string; sink: ChapterSink; recover?: boolean; deps?: V5BuildDeps; prior?: PriorBooks }): Promise<{ snapshot: ProductPreviewSnapshot; meta: WriterMeta; run: WriterRun | null }> {
  const deps = a.deps ?? {};
  const now = deps.now ?? (() => Date.now()), started = now();
  const { k, version: knowledgeVersion } = writerKnowledge();
  // 같은 고객의 이전 책이 쓴 장면은 고르지 않고, 이미 뜻을 푼 특성은 이 책에서 뜻을 다시 풀지 않는다(P6b E-1, P6c A3).
  const brief = buildBrief({ ...payloadToBriefInput(a.payload, kstDate(a.policyAt)), ...(a.prior?.scenes.length ? { excludeScenes: a.prior.scenes } : {}), ...(a.prior?.explained?.length ? { knownTraits: a.prior.explained } : {}) } as never, k);
  const plan = buildWriterPrompt(brief, { knowledge: k }).chapters;
  const llm = resolveLlmConfig();
  const provider = deps.provider ?? llm.provider, model = deps.model ?? llm.model;
  const fallbackTarget = deps.fallback === undefined ? llm.fallback : deps.fallback;
  const budget = deps.budgetMs ?? WRITER_TIME_BUDGET_MS;
  let run: WriterRun | null = null;
  let drafts = new Map<number, DraftChapter>();
  const envCap = Number(process.env.LLM_MAX_OUTPUT_TOKENS);
  const fb = fallbackTarget && (fallbackTarget.provider !== provider || fallbackTarget.model !== model) ? fallbackTarget : null;
  // 뒤 호출(재요청·수리)은 남은 시간 예산 안에서만.
  const opts = (): WriterOptions => ({ brief, provider: provider!, model: model!, sink: a.sink, knowledge: k, ...(envCap > 0 ? { maxOutputTokens: envCap } : {}), ...deps, budgetMs: budget - (now() - started), fallback: fb });
  if (!a.recover && model) {
    try { run = await runWriter(opts()); drafts = run.drafts; }
    catch { drafts = new Map(); }
  }
  if (a.recover || !run) { try { for (const s of await a.sink.load()) if (!drafts.has(s.n)) drafts.set(s.n, { chapter: s.chapter, source: s.source }); } catch { /* 저장소가 안 되면 결정론 작가로만 */ } }
  const net = (d: ReadonlyMap<number, DraftChapter>) => applySafetyNet(brief, plan, d, { priorSentences: a.prior?.sentences ?? [] });
  let { chapters: finals, report } = net(drafts);
  // (P6c I) 짧거나 빈 장만 1회 다시 요청하고, 그래도 모자라면 결정론 장.
  const redo = plan.filter(ch => { const f = finals.find(x => x.n === ch.n); return f?.source === "deterministic" && /^(missing|empty|too_short|keys)/.test(f.reason ?? ""); });
  let redoCalls = 0;
  if (run?.writer && redo.length && !run.stale) {
    try { const before = run.calls.length; run = await redoChapters(opts(), run, redo); redoCalls = run.calls.length - before; ({ chapters: finals, report } = net(run.drafts)); } catch { /* 재요청 실패: 결정론 장 그대로 */ }
  }
  // (P6c) 결정론 정리 → 검사 → 수리 1회(A5) → 그래도 걸리면 지운다.
  const lctx = lintContext(brief, k, plan, a.prior?.sentences ?? []);
  const tidy = tidyBook(finals, lctx);
  let chapters = tidy.chapters;
  const flags = lintBook(chapters, lctx);
  let repair = { targets: 0, applied: 0, calls: 0 };
  if (run?.writer && flags.some(f => chapters.find(c => c.n === f.chapter)?.source !== "deterministic") && !run.stale) {
    try { const before = run.calls.length; const r = await repairPass(opts(), run, brief, chapters, flags); run = r.run; chapters = r.chapters; repair = { targets: r.targets, applied: r.applied, calls: run.calls.length - before }; }
    catch { /* 수리 실패: 아래에서 걸린 문장을 지운다 */ }
  }
  const remaining = lintBook(tidyBook(chapters, lctx).chapters, lctx);
  const enforced = enforce(tidyBook(chapters, lctx).chapters, remaining);
  chapters = enforced.chapters;
  const byRule = (fs: readonly LintFlag[]) => fs.reduce<Record<string, number>>((o, x) => ({ ...o, [x.rule]: (o[x.rule] ?? 0) + 1 }), {});
  const cover = coverLineOf(run?.cover ?? null, brief);
  report = { ...report, metrics: { ...(report.metrics as NonNullable<typeof report.metrics>), p6c: { tidy: tidy.count, flags: byRule(flags), repairTargets: repair.targets, repaired: repair.applied, repairCalls: repair.calls, redoCalls, redoChapters: redo.map(c => c.n), remaining: byRule(remaining), removed: enforced.removed, droppedParagraphs: enforced.droppedParagraphs, cover: cover.source, cardFlags: remaining.filter(f => f.card).map(f => `${f.chapter}.${f.section}.${f.card}:${f.rule}`) } } };
  const people = await (deps.people ?? v4People)(a.payload, a.policyAt);
  const { draft, evidence } = assembleV5Book({
    brief, plan, finals: chapters, report, payload: a.payload, generatedAt: a.policyAt, people, cover: cover.line, badCards: new Set(remaining.filter(f => f.card).map(f => `${f.chapter}.${f.section}.${f.card}`)),
    writer: run?.writer ?? null, fallback: run?.fallback ?? null, calls: run?.calls ?? [],
    tokens: { input: run?.usage.inputTokens ?? 0, cachedInput: run?.usage.cachedInputTokens ?? 0, output: run?.usage.outputTokens ?? 0 },
    costUsd: run?.costUsd ?? 0, durationMs: now() - started, briefHash: briefHash(brief), knowledgeVersion, promptVersion: WRITER_PROMPT_VERSION, recovered: Boolean(a.recover), priorBooks: a.prior?.books ?? 0,
  });
  return { snapshot: createV5Snapshot({ reportId: a.reportId, createdAtIso: a.policyAt, draft, evidence }), meta: evidence.meta, run };
}
