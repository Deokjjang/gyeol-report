/**
 * v5 발행 조립(P3 C·F): 입력 → 브리프 → 작가(스트리밍 1회, 장 저장) → 안전망(결정론 보충) → v5 Book 스냅샷.
 * 최종판 0-1: 운영(⑦ 감독)과 개발 도구가 모두 이 함수(buildV5Snapshot)로 만든다. 작가는 한 번만 부르고, 작가 원고가 나오면 그 책은 완성본이 된다:
 *   검사 → 걸린 문장만 수리(1회) → 그래도 사실·금지 규칙이면 그 소제목만 재작성(1회) → 그래도면 그 소제목을 뺀다(장은 비우지 않는다).
 *   장·책을 버리고 다시 쓰는 경로는 없다. 예외는 API가 중간에 끊겨 빠진 장만 이어 쓰는 것(runner 이어쓰기, 감독의 다음 시도).
 * recover=true면 작가를 부르지 않고 저장된 장 + 결정론 작가로만 완성한다(회수 크론).
 * 어떤 단계가 실패해도 결정론 작가로 Book을 만든다. 만세력·MBTI 표만 기존 v4 계산을 빌리고, 실패하면 표 페이지 없이 낸다.
 */
import { thinSections } from "./safety/orphan";
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
import { completeText, runWriter, WRITER_TIME_BUDGET_MS, type ChapterSink, type WriterOptions, type WriterRun } from "./runner";
import { REPAIR_SYSTEM, REWRITE_SYSTEM } from "./repair";
import { deleteFlagged, REPAIR3_MAX_ITEMS, repair3MaxTokens, repair3Pass, repair3Prompt, repairItems, revertWorse, type AppliedRepair, type Deleted } from "./repair3";
import { guardReview, priorSummaryOf, REVIEW_MAX_INPUT_CHARS, REVIEW_SCHEMA, REVIEW_VERSION, reviewMaxTokens, reviewPrompt, type ReviewIssue } from "./review";
import { priceFor } from "@/lib/llm/prices";
import * as E from "./safety/p6e";
import { annotateChapter, termDictionary } from "./render";
import { WRITER_SYSTEM } from "./prompt/system";
import { applySafetyNet, safetyFacts, sentenceViolation, type DraftChapter } from "./safety";
import { copyWindows, dayunPhase, MYEONGRI_PREFIX, NICKNAME_KEYS, type ElementPresence } from "./safety/lint";
import { dropNoticeSentences, enforce, HARD_RULES, lintBook, tidyBook, type LintCtx, type LintFlag } from "./safety/p6c";
import { avoidOverlaps, COVER_MOTIFS, coverMotifs, iljuPhrasesFor } from "@/lib/brief/imageLedger";
import { CAREER_REQUIRED } from "@/lib/brief/design/career";
import { LOVE_REQUIRED } from "@/lib/brief/design/love";
import { allowedWindows, writeKeyFill, type FinalChapter } from "./safety";
import type { BookSection } from "./format";
import { buildFactSheet, type FactSheet } from "@/lib/factsheet/build";
import { factCtxOf } from "@/lib/factsheet/check";
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

/** 최종판3 5: 검수 모델(측정 결과로 정함, LLM_REVIEW_MODEL로 바꿀 수 있다). */
export const DEFAULT_REVIEW_MODEL = "claude-haiku-5-5";
export const reviewModelOf = (env: Readonly<Record<string, string | undefined>> = process.env) => (env.LLM_REVIEW_MODEL && /^claude-(haiku|sonnet)-5-5$/.test(env.LLM_REVIEW_MODEL) ? env.LLM_REVIEW_MODEL : DEFAULT_REVIEW_MODEL);
/** 최종판3 6: 시스템 프롬프트 캐시. 주문 간격이 5분 캐시 손익분기(시간당 약 3건)보다 촘촘할 때만 켠다(LLM_PROMPT_CACHE=on). 기본 끔. */
export const promptCacheOn = (env: Readonly<Record<string, string | undefined>> = process.env) => env.LLM_PROMPT_CACHE === "on";
/** 최악 비용(USD): 입력 글자 × 1.1토큰 × 입력 단가 + 출력 상한 × 출력 단가(Anthropic). 가격표에 없으면 무한대. */
export function worstUsd(model: string, inputChars: number, maxOut: number): number {
  const p = priceFor("anthropic", model); if (!p) return Infinity;
  return (Math.ceil(inputChars * 1.1) * p.input + maxOut * p.output) / 1e6;
}
export type V5BuildDeps = Partial<Pick<WriterOptions, "stream" | "now" | "sleep" | "budgetMs" | "apiKey" | "fetchImpl" | "maxOutputTokens" | "cache" | "costCapUsd" | "cacheSystem">> & {
  /** 최종판3 5: 검수 모델(없으면 reviewModelOf). testRun: 시험 생성 책(고객 원장에서 뺀다). */
  readonly reviewModel?: string; readonly testRun?: boolean;
  /** book:replay(최종판 0-3): 저장 원문으로만 다시 돌린다. 저장본이 없는 수리·재작성은 부르지 않고(호출 0), 걸린 소제목·문단도 빼지 않고 기록만 남긴다. */
  readonly replay?: boolean;
  /** 최종판 4 실질 결함 고침(tools/final/fix-sections.ts): 이 소제목들을 사유와 함께 재작성 대상에 더한다(검사 깃발과 같은 재작성 1회). 작가는 다시 부르지 않는다. */
  readonly rewriteSections?: readonly { readonly chapter: number; readonly section: number; readonly reason: string }[];
  /** 최종판2 1-1: replay·고침 도구가 이미지 대장에서 그 책 자신과 뒤 책을 뺀다. */
  readonly ledgerView?: import("@/lib/brief/imageLedger").LedgerView;
  readonly provider?: LlmProvider; readonly model?: string; readonly people?: (payload: ReportInputPayload, policyAt: string) => Promise<BookPerson[]>;
  /** 대체 모델(P6b A-2). undefined면 환경 설정(LLM_FALLBACK, 기본 openai/gpt-6.1-terra), null이면 대체 없음. 키를 넣으면 그 키로 부른다. */
  readonly fallback?: (LlmTarget & { readonly apiKey?: string }) | null;
};

/** 검사 문맥(P6c): 브리프·지식 DB에서 고객 사실과 사전(그림 별명·직업 소품·MBTI 쉬운 이름·브리프 글 창)을 모은다. */
export function lintContext(brief: Brief, k: Knowledge, plan: readonly WriterChapter[], prior: readonly string[], image?: string, sheet?: FactSheet): LintCtx {
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
      ...(cd ? { dayunPhase: dayunPhase(cd.phase ? cd.phase.yearIndex - 1 : c.thisYear.year - Number(cd.years.slice(0, 4))) } : {}),
      ...(c.stars ? { stars: { spouse: c.stars.spouse.where, child: c.stars.child.where } } : {}) }),
    coreImage: brief.compatibility?.pairImage.line ?? image ?? c.coreImage.line,
    nicknames: [...new Set([...[...k.features.values()].map(x => x.easyName), ...NICKNAME_KEYS])],
    // 작가가 본 글(재료로 바꾼 브리프)과 원문 브리프: 20자 넘게 이어 옮기면 고쳐 쓴다(A1).
    corpus: copyWindows([JSON.stringify(renderWriterBrief(brief, { knowledge: k })), JSON.stringify(renderWriterBrief(brief))]),
    prior, jobProps,
    noJobChapters: brief.product === "love_marriage_child" ? new Set(plan.map(ch => ch.n)) : ids(/^(love|family)$/),
    parentingChapters: brief.product === "love_marriage_child" ? ids(/^parenting$/) : new Set(), monthChapters: brief.product === "annual_fortune" ? ids(/^month$/) : new Set(),
    careerGroups: brief.product === "career_money_study",
    mbtiPlain: plain, periods: Object.fromEntries((brief.timeline?.entries ?? []).map(e => [e.key, e.period])),
    ...p6dContext(brief, plan),
    ...p6eContext(brief, k),
    ...final2Context(brief),
    ...(sheet ? { fact: factCtxOf(sheet, k, personNames(brief), { jobWords: compat ? [] : [...new Set([...(job?.props ?? []), ...stages, ...jobWordsOf(brief.person.facts.job.detail)])] }) } : {}),
  };
}

/** 사람마다 부르는 이름 꼴(전체 이름·부를 이름·성 뺀 이름). 궁합은 두 사람, 한 사람 책은 하나. */
export function personNames(brief: Brief): string[][] {
  const c = brief.compatibility, partner = brief.partner;
  const names = (full: string, call: string) => [...new Set([full, call.replace(/님$/, ""), full.length >= 3 ? full.slice(1) : ""].filter(n => n.length >= 2))];
  return c && partner ? [names(brief.person.name, c.a.callName), names(partner.person.name, c.b.callName)] : [names(brief.person.name, brief.person.callName)];
}

/** 최종판3 1: 주문 입력으로 만든 정답지(엔진 출력만). 발행·검수·수리가 같은 정답지를 쓴다. */
export const factSheetFor = (payload: ReportInputPayload, policyAt: string, brief: Brief, k: Knowledge): FactSheet => buildFactSheet(payloadToBriefInput(payload, kstDate(policyAt), policyAt) as never, brief, k);

/** 최종판2 검사 문맥: 궁합 사람별 성격표(1-3), 사람별 명식 글자(1-4), 같은 일주 이전 책 구절·피할 이미지 줄(1-1). */
function final2Context(brief: Brief): Partial<LintCtx> {
  const c = brief.compatibility, partner = brief.partner;
  const glyphs = (ch: Brief["chart"]) => new Set(Object.values(ch.pillars).flatMap(p => (p ? [...p.hangul] : [])));
  const names = (full: string, call: string) => [...new Set([full, call.replace(/님$/, ""), full.length >= 3 ? full.slice(1) : ""].filter(n => n.length >= 2))];
  const pillars = [brief.chart.pillars.day.hanja, ...(partner ? [partner.chart.pillars.day.hanja] : [])];
  return {
    iljuPhrases: iljuPhrasesFor(pillars, brief.ledgerView), avoidLines: brief.chart.avoidImages ?? [], baseDate: brief.baseDate,
    ...(c && partner ? {
      glyphPeople: [{ names: names(brief.person.name, c.a.callName), glyphs: glyphs(brief.chart) }, { names: names(partner.person.name, c.b.callName), glyphs: glyphs(partner.chart) }],
      ...(c.profiles?.length === 2 ? { profilePeople: c.profiles.map((p, i) => ({ names: i ? names(partner.person.name, c.b.callName) : names(brief.person.name, c.a.callName), codes: p, label: p.name.replace(/님$/, "") })) } : {}),
    } : { glyphPeople: [{ names: [], glyphs: glyphs(brief.chart) }] }),
  };
}

/** 궁합 장면 씨앗 who("끝 쪽 = 이름, 반대 끝 쪽 = 이름")를 차원 끝 키로 되읽는다(최종판 1-5 검사용). */
function sceneOwnersOf(brief: Brief, k: Knowledge): E.SceneOwner[] {
  const short = (x: string) => x.replace(/\s*편입니다\.?$/, " 편").replace(/입니다\.?$/, "").replace(/\.$/, "");
  const poles = new Map(k.ontology.dimensions.flatMap(d => [[short(d.poles.plus.description), `${d.id}+`], [short(d.poles.minus.description), `${d.id}-`]] as const));
  const out: E.SceneOwner[] = [];
  for (const c of brief.chapters) for (const m of [...c.materials, ...(c.sections ?? []).flatMap(x => x.materials)]) if (m.kind === "rel") for (const line of m.who ?? []) {
    // 「끝 = 사람, 끝 = 사람」(반대쪽) · 「끝 = 사람·사람(누가 더)」(같은 쪽) · 「끝 = 사람」(한 사람만), 최종판 4.
    const x = line.match(/^(.+) 쪽 = (.+), (.+) 쪽 = (.+)$/) ?? line.match(/^(.+) 쪽 = (.+)$/); if (!x) continue;
    for (const [poleText, names] of x.length > 3 && x[3] ? [[x[1], x[2]], [x[3], x[4]]] : [[x[1], x[2]]]) {
      const pole = poles.get(poleText!); if (!pole) continue;
      for (const name of names!.replace(/\(.*\)$/, "").split("·")) if (name.trim()) out.push({ name: name.trim(), pole });
    }
  }
  return out;
}
/** 렌더 브리프의 글을 지침(note·rule)과 재료(그 밖)로 나눠 모은다. */
function briefTexts(x: unknown, key = "", out: { guides: string[]; materials: string[] } = { guides: [], materials: [] }) {
  if (typeof x === "string") (key === "note" || key === "rule" || key === "rules" || key === "forbiddenFacts" || key === "forbidden" ? out.guides : out.materials).push(x);
  else if (Array.isArray(x)) for (const v of x) briefTexts(v, key, out);
  else if (x && typeof x === "object") for (const [k2, v] of Object.entries(x)) briefTexts(v, k2, out);
  return out;
}
/**
 * P6e 검사 문맥(최종판 1-1·1-4·1-5·1-6): 지침 창(시스템 지침 12자만 — 브리프 8자 창은 오탐이라 옮기지 않았다)·씨앗 꼬리표·용어 이름(뜻 공식)·
 * 신살 주인·MBTI 사람·자리별 십성, 궁합 사람별 오행 개수.
 */
function p6eContext(brief: Brief, k: Knowledge): Partial<LintCtx> {
  const t = briefTexts(renderWriterBrief(brief, { knowledge: k }));
  const c = brief.compatibility, partner = brief.partner;
  const OWN = /신살|귀인|십이운성/;
  const featureNames = (i: number) => new Set((brief.appendix?.[i]?.items ?? []).filter(x => OWN.test(x.group)).map(x => x.name.replace(/\s*\(.*$/, "").replace(/·.*$/, "").trim()).filter(n => n.length >= 2));
  const names = (full: string, call: string) => [...new Set([full, call.replace(/님$/, ""), full.length >= 3 ? full.slice(1) : ""].filter(n => n.length >= 2))];
  const table = materialTable(k);
  const fnNames = (type: string | undefined) => (type ? (k.mbti.get(type as never)?.cognitiveFunctions ?? []).map(f => table.plain.get(f.easy)).filter((x): x is string => Boolean(x)) : []);
  const esc = (x: string) => x.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const person = (type: string | undefined, name?: string): E.MbtiPerson[] => type ? [{ type, anchors: new RegExp([type, ...fnNames(type).map(esc)].join("|")), ...(name ? { name } : {}) }] : [];
  const pos = (ch: Brief["chart"]) => { const p = ch.positions; if (!p) return undefined; const { line: _l, ...rest } = p; void _l; return rest as E.PositionTenGods; };
  const terms = [...termDictionary(k).keys()].filter(x => x.length >= 2).sort((a, b) => b.length - a.length).map(esc);
  return {
    guide: E.guideWindows([WRITER_SYSTEM, REPAIR_SYSTEM, REWRITE_SYSTEM], t.materials),
    seedLabels: E.seedLabels(t.materials),
    termNames: new RegExp(`(?<![가-힣])(${terms.join("|")})(은|는|이란) [^.?!]{0,140}(뜻해요|뜻합니다|뜻이에요|뜻입니다|라는 뜻)`),
    ...(c && partner ? {
      owners: { names: [names(brief.person.name, c.a.callName), names(partner.person.name, c.b.callName)], features: [featureNames(0), featureNames(1)] },
      mbtiPeople: [...person(brief.mbti?.type, brief.person.name), ...person(partner.mbti?.type, partner.person.name)],
      ...(pos(brief.chart) && pos(partner.chart) ? { positionsBy: [{ name: brief.person.name, positions: pos(brief.chart)! }, { name: partner.person.name, positions: pos(partner.chart)! }] } : {}),
      sceneOwners: sceneOwnersOf(brief, k),
      ...(brief.chart.elements.presence && partner.chart.elements.presence ? { presenceBy: [{ name: brief.person.name, presence: brief.chart.elements.presence as ElementPresence }, { name: partner.person.name, presence: partner.chart.elements.presence as ElementPresence }] } : {}),
    } : { mbtiPeople: person(brief.mbti?.type), ...(pos(brief.chart) ? { positions: pos(brief.chart) } : {}) }),
  };
}

const CONDITIONAL_TITLE = /(된다면|되면|한다면)$/;
/** P6d 검사 문맥: 묶음 세기·궁합 두 사람 값·대운 안 몇 번째 해·시점·관계 수·소품·투자 장·세기 점수·카드 십성. */
function p6dContext(brief: Brief, plan: readonly WriterChapter[]): Partial<LintCtx> {
  const ids = (re: RegExp) => new Set(plan.filter(ch => re.test(ch.id)).map(ch => ch.n));
  const entries = brief.timeline?.entries ?? [];
  const c = brief.compatibility, partner = brief.partner;
  const names = (i: number) => new Set((brief.appendix?.[i]?.items ?? []).map(x => x.name.replace(/\s*\(.*$/, "").trim()).filter(Boolean));
  const flow: Record<string, { score: number; max: number; min: number }> = {};
  for (const kind of ["year", "month"] as const) { const es = entries.filter(e => e.kind === kind); if (es.length < 2) continue; const max = Math.max(...es.map(e => e.flow.score)), min = Math.min(...es.map(e => e.flow.score)); for (const e of es) flow[e.key] = { score: e.flow.score, max, min }; }
  const timelineBook = brief.product === "major_fortune" || brief.product === "annual_fortune";
  return {
    ...(c || !brief.chart.groups ? {} : { groupLevels: brief.chart.groups.levels }),
    ...(c && partner && brief.chart.groups && partner.chart.groups ? {
      groupLevelsBy: [{ name: c.a.callName.replace(/님$/, ""), levels: brief.chart.groups.levels }, { name: c.b.callName.replace(/님$/, ""), levels: partner.chart.groups.levels }],
      pair: { names: [c.a.callName, c.b.callName], features: [names(0), names(1)], groups: [brief.chart.groups.levels, partner.chart.groups.levels], lacking: [c.a.lacking, c.b.lacking], excess: [c.a.excess, c.b.excess], mbti: [c.a.mbti, c.b.mbti] },
      pairRelations: c.dayRelations.length,
    } : {}),
    yearIndex: Object.fromEntries(entries.filter(e => e.kind === "year" && e.dayun?.yearIndex).map(e => [e.key, { index: e.dayun!.yearIndex!, total: e.dayun!.total ?? 10 }])),
    strictTime: timelineBook, ...(brief.product === "annual_fortune" ? { calendarChapters: new Set(plan.map(ch => ch.n)) } : {}),
    relationCount: Object.fromEntries(entries.map(e => [e.key, e.badges.filter(b => b.kind !== "GONGMANG").length])),
    props: Object.keys(brief.usedProps ?? {}), investChapters: ids(/^invest/),
    allowed: allowedWindows(JSON.stringify(brief)), conditionalChapters: new Set(plan.filter(ch => CONDITIONAL_TITLE.test(ch.title.trim())).map(ch => ch.n)),
    // 최종판 1-3: 부모 역할 장은 장 전체가 가정형이라 자녀 규칙은 "이미 있다"고 단정하는 꼴만(P6e CHILD_EXIST).
    childChapters: new Set(plan.filter(ch => /^parent/.test(ch.id)).map(ch => ch.n)),
    flow, cardTenGod: Object.fromEntries(entries.map(e => [e.key, e.tenGod.stem])),
    requiredTerms: new Map(plan.flatMap(ch => { const r = (brief.product === "career_money_study" ? CAREER_REQUIRED : brief.product === "love_marriage_child" ? LOVE_REQUIRED : {})[ch.id]; return r ? [[ch.n, r.terms] as const] : []; })),
  };
}

/** 머리 문장 같은 첫 문장(작가가 직접 쓴 것): 결정론 머리 문장으로 바꾸기 전에 뗀다(P6d D). */
const WRITER_HEAD = /^(\d{4}년 )?[가-힣]{2}(\([一-鿿]{2}\))?(월)?(\([一-鿿]{2}月?\))?(은|는) [^.?!]{0,40}(하늘에|천간에)[^.?!]{0,40}(땅에|지지에)[^.?!]{0,20}[.!]/;
/**
 * 조립 직전 결정론 넣기(P6d D, 최종판 1-12·1-13): key마다 머리 문장, 마지막 장 끝에 책 한 줄 안내(면책·단서는 책에 한 번, P6e insertFixedLines).
 * 기준일은 본문에 넣지 않는다(표지·마지막 쪽 판 표기에만). 검사·수리 뒤에 넣어 작가가 바꾸지 못한다.
 */
export function insertFixedLines(chapters: readonly FinalChapter[], brief: Brief): FinalChapter[] {
  const heads = new Map((brief.timeline?.entries ?? []).map(e => [e.key, e.head]));
  const prepend = (s: BookSection, line: string): BookSection => ({ ...s, paragraphs: s.paragraphs.length ? [`${line} ${s.paragraphs[0]}`, ...s.paragraphs.slice(1)] : [line] });
  const notice = E.bookNotice(brief.product);
  return chapters.map((c, ci) => {
    let sections = c.sections.map(s => {
      const head = c.keys?.includes(s.heading) ? heads.get(s.heading) : undefined;
      if (!head) return s;
      const first = s.paragraphs[0] ?? "";
      const stripped = first.replace(WRITER_HEAD, "").trim();
      return prepend({ ...s, paragraphs: [stripped, ...s.paragraphs.slice(1)].filter(Boolean) }, head);
    });
    if (ci === chapters.length - 1 && sections.length && !sections.some(s => s.paragraphs.includes(notice))) {
      const last = sections[sections.length - 1];
      sections = [...sections.slice(0, -1), { ...last, paragraphs: [...last.paragraphs, notice] }];
    }
    return { ...c, sections, chars: sections.reduce((a, s) => a + s.paragraphs.join("").length, 0) };
  });
}

/** 렌더 단계 표기(최종판 1-6): 장마다 용어 첫 등장에 한자. 엔진 간지는 이 책 사람들의 것만. MBTI 약어는 붙이지 않는다(작가가 쓴다). */
export function renderTerms(chapters: readonly FinalChapter[], brief: Brief, k: Knowledge): { chapters: FinalChapter[]; count: number } {
  const dict = termDictionary(k);
  const ganji = new Set<string>();
  for (const ch of [brief.chart, brief.partner?.chart].filter((x): x is Brief["chart"] => Boolean(x))) {
    for (const p of Object.values(ch.pillars)) if (p) ganji.add(p.hangul);
    if (ch.currentDayun) { ganji.add(ch.currentDayun.ganji.hangul); if (ch.currentDayun.next) ganji.add(ch.currentDayun.next.ganji.hangul); }
    ganji.add(ch.thisYear.ganji.hangul);
  }
  for (const e of brief.timeline?.entries ?? []) ganji.add(e.ganji.hangul);
  for (const c of brief.timeline?.cycles ?? []) { const h = c.ganji.match(/[가-힣]{2}/)?.[0]; if (h) ganji.add(h); }
  let count = 0;
  const out = chapters.map(c => { const r = annotateChapter(c.sections, { dict, ganji }); count += r.count; return { ...c, sections: r.sections, chars: r.sections.reduce((a, s) => a + s.paragraphs.join("").length, 0) }; });
  return { chapters: out, count };
}

/**
 * 표지 한 줄 검사(P6c G + 최종판 1-7, 최종판2 1-1): 길이는 공백을 빼고 16~26자, 설명문·"명리학에서"·연차 금지, 사실 규칙, 피할 이미지(같은 일주 이전 책·같은 고객 다른 책의 이미지 줄)와 겹치지 않게.
 * level: hard = 쓸 수 없음(없음·설명문·연차·사실 규칙·30자 초과), avoid = 피할 이미지와 겹침, length = 길이만 벗어남(30자 이내면 작가 표지를 쓴다).
 */
export function coverIssue(raw: string | null, brief: Brief, avoid: readonly string[]): { reason: string; level: "hard" | "avoid" | "length" } | null {
  const v = (raw ?? "").replace(/^\[표지\]\s*/, "").replace(/[*"“”]/g, "").trim();
  if (!v) return { reason: "없음", level: "hard" };
  const n = v.replace(/\s/g, "").length;
  if (n > 30) return { reason: `길이 ${n}자(공백 뺌, 30자 초과)`, level: "hard" };
  if (MYEONGRI_PREFIX.test(v) || /일주(예요|입니다|이에요)|(입니다|이에요|예요|해요)[.!]?$/.test(v)) return { reason: "설명문", level: "hard" };
  // 연차·경력 햇수는 입력에 없다(P6c r1·r2: 문체 예시의 "영업 4년 차"를 따라 "서비스 기획 7년 차"를 지어냈다).
  if (/\d+ ?년 ?(차|째)|경력 \d+/.test(v)) return { reason: "연차", level: "hard" };
  if (sentenceViolation(v, safetyFacts(brief)) !== null) return { reason: "사실 규칙", level: "hard" };
  // 최종판3 2g: 종합 표지는 직업·나이 금지, 연애 표지는 직업 장소 금지, 같은 사람 이전 책 표지와 같은 모티프 계열 금지.
  if (brief.product === "saju_mbti_full") {
    const words = jobWordsOf(brief.person.facts.job.detail);
    const w = words.find(x => v.includes(x)) ?? v.match(/대표|사장|창업|직장인|개발자|회사원|사업가|스물|서른|마흔|쉰|\d+ ?(살|세)|\d0대/)?.[0];
    if (w) return { reason: `종합 표지에 직업·나이(${w})`, level: "hard" };
  }
  // 최종판3 12: 「현장 공정표 위에서도…」(인테리어 시공 대표 연애 표지)를 못 잡았다 — 장소 낱말에 현장, 입력 직업의 소품·낱말도 본다.
  if (brief.product === "love_marriage_child") { const w = v.match(/카페|가게|매장|사무실|회사|작업실|공방|점포|매대|주방|사업장|현장/)?.[0] ?? jobWordsOf(brief.person.facts.job.detail).find(x => x.length >= 2 && v.includes(x)); if (w) return { reason: `연애 표지에 직업 장소·소품(${w})`, level: "hard" }; }
  { const motifs = coverMotifs(v).filter(m => brief.ledgerNotes?.avoidCoverMotifs?.includes(m)); if (motifs.length) return { reason: `이전 책 표지와 같은 모티프(${motifs.map(m => `${m}: ${COVER_MOTIFS[m].source.replace(/\(\?<?[!=][^)]*\)/g, "").split("|").slice(0, 10).join("·")} 계열 낱말 금지`).join(" / ")}) — 다른 계열의 그림으로`, level: "avoid" }; }
  const hit = avoidOverlaps(v, avoid);
  if (hit.length) return { reason: `피할 이미지(${hit.slice(0, 2).join(" / ")})`, level: "avoid" };
  if (n < 16 || n > 26) return { reason: `길이 ${n}자(공백 뺌, 16~26자)`, level: "length" };
  return null;
}
/**
 * 입력 직업의 낱말(DB 소품·업무 단계 + 입력 글의 낱말). 최종판3 12: 「꽃집」만 넣으면 종합 표지 「꽃 앞에서…」를 못 잡았다(판독) —
 * 가게꼴 낱말(○○집·○○가게·○○샵·○○공방)은 앞 이름(꽃·빵·옷)도 넣는다.
 */
export function jobWordsOf(detail: string): string[] {
  const job = matchJob(detail), raw = detail.split(/[^가-힣A-Za-z]+/).filter(w => w.length >= 2);
  const roots = raw.flatMap(w => { const m = w.match(/^([가-힣]{1,4})(집|가게|샵|숍|공방)$/); return m ? [m[1]] : []; });
  return [...new Set([...(job?.props ?? []), ...Object.values(job?.stages ?? {}).flat(), ...raw, ...roots])];
}
export const coverProblem = (raw: string | null, brief: Brief, avoid: readonly string[]): string | null => coverIssue(raw, brief, avoid)?.reason ?? null;
/** 표지 고르기(최종판2 1-1): 작가가 고친 표지 → 작가 첫 표지 순으로, 걸린 정도가 가벼운 것. 엔진 기본 이미지는 작가 표지가 아예 없을 때(또는 모두 쓸 수 없을 때)만. */
export function chooseCover(candidates: readonly { line: string; source: "repaired" | "writer" }[], brief: Brief, avoid: readonly string[]): { line: string; source: "writer" | "repaired" | "fallback"; issue: string | null } {
  const rank = { none: 0, length: 1, avoid: 2, hard: 3 } as const;
  const scored = candidates.filter(c => c.line).map(c => ({ c, i: coverIssue(c.line, brief, avoid) })).sort((x, y) => rank[x.i?.level ?? "none"] - rank[y.i?.level ?? "none"]);
  const best = scored[0];
  if (best && best.i?.level !== "hard") return { line: best.c.line, source: best.c.source, issue: best.i?.reason ?? null };
  return { line: brief.compatibility?.pairImage.line ?? brief.chart.coreImage.line, source: "fallback", issue: best?.i?.reason ?? "작가 표지 없음" };
}
const clean = (raw: string | null) => (raw ?? "").replace(/^\[표지\]\s*/, "").replace(/[*"“”]/g, "").trim();

/** 표지 줄 수리(최종판 1-7 ③): 검사에 걸린 표지 줄 하나만 다시 쓰게 한다(호출 1회 이하). */
export const COVER_SYSTEM = `너는 결리포트 원고의 교정 작가다. 책 표지 한 줄(이 책의 핵심 이미지)을 다시 쓴다.
- 16~26자 한 줄, 명사로 끝나는 그림 한 줄. 설명문("~예요")·"명리학에서"·입력에 없는 연차·한자 금지.
- 피할 낱말(같은 일주의 다른 책이 이미 쓴 그림)은 쓰지 않는다. 핵심 뜻(일간·계절·오행의 결)과 이 고객 입력 하나를 엮어 새 그림으로.
- 출력: "[표지] 새 줄" 한 줄만.`;
/** 표지 줄 수리 지침(최종판3부터 따로 부르지 않고 수리 1회에 함께 넣는다 — 옛 Book replay·도구용으로 남김). */
export function coverPrompt(brief: Brief, line: string, problem: string, avoid: readonly string[]) {
  const f = brief.person.facts;
  // 최종판2 1-1: 핵심 뜻은 그림 없는 뜻(엔진 그림 줄을 주면 그 그림으로 돌아간다).
  return { system: COVER_SYSTEM, user: `핵심 뜻(chart.coreImage): ${brief.compatibility ? brief.compatibility.pairImage.meaning ?? brief.compatibility.pairImage.line : brief.chart.coreImage.meaning ?? brief.chart.coreImage.line}\n고객 입력: 직업 ${f.job.detail || "미입력"} · 관계 ${f.relationship} · 상품 ${brief.productTitle}\n피할 낱말: ${avoid.join(", ") || "없음"}\n지금 표지: ${line || "(없음)"}\n문제: ${problem}\n\n"[표지] 새 줄"로 돌려주세요.` };
}

export async function buildV5Snapshot(a: { payload: ReportInputPayload; reportId: string; policyAt: string; sink: ChapterSink; recover?: boolean; deps?: V5BuildDeps; prior?: PriorBooks }): Promise<{ snapshot: ProductPreviewSnapshot; meta: WriterMeta; run: WriterRun | null }> {
  const deps = a.deps ?? {};
  const now = deps.now ?? (() => Date.now()), started = now();
  const { k, version: knowledgeVersion } = writerKnowledge();
  // 같은 고객의 이전 책이 쓴 장면은 고르지 않고, 이미 뜻을 푼 특성은 이 책에서 뜻을 다시 풀지 않는다(P6b E-1, P6c A3).
  // 고객 원장(P6d F): 앞 책이 쓴 각도(Fusion·팩폭)와 MBTI 씨앗은 빼고, 앞 책 근거 항목은 쓰지 않은 것을 먼저 고른다.
  const pl = a.prior?.ledger;
  const brief = buildBrief({ ...payloadToBriefInput(a.payload, kstDate(a.policyAt), a.policyAt), ...(a.prior?.scenes.length ? { excludeScenes: a.prior.scenes } : {}), ...(a.prior?.explained?.length ? { knownTraits: a.prior.explained } : {}),
    ...(pl?.angles.length ? { excludeAngles: pl.angles } : {}), ...(pl?.seeds.length ? { excludeSeeds: pl.seeds } : {}), ...(pl?.evidence.length ? { priorEvidence: pl.evidence } : {}),
    ...(a.prior?.images?.length ? { priorImages: a.prior.images } : {}), ...(deps.ledgerView ? { ledgerView: deps.ledgerView } : {}),
    ...(a.prior?.actions?.length ? { priorActions: a.prior.actions } : {}), ...(a.prior?.covers?.length ? { priorCovers: a.prior.covers } : {}) } as never, k);
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
  const opts = (): WriterOptions => ({ brief, provider: provider!, model: model!, sink: a.sink, knowledge: k, ...(envCap > 0 ? { maxOutputTokens: envCap } : {}), cacheSystem: promptCacheOn(), ...deps, budgetMs: budget - (now() - started), fallback: fb });
  if (!a.recover && model) {
    try { run = await runWriter(opts()); drafts = run.drafts; }
    catch { drafts = new Map(); }
  }
  if (a.recover || !run) { try { for (const s of await a.sink.load()) if (!drafts.has(s.n)) drafts.set(s.n, { chapter: s.chapter, source: s.source }); } catch { /* 저장소가 안 되면 결정론 작가로만 */ } }
  const net = (d: ReadonlyMap<number, DraftChapter>) => applySafetyNet(brief, plan, d, { priorSentences: a.prior?.sentences ?? [] });
  // 최종판 0-1: 짧은 장도 작가 원고 그대로(장 재요청 없음). 결정론 장은 작가가 못 쓴(빠진) 장뿐 — 감독이 다음 시도에서 그 장만 이어 쓴다.
  const first = net(drafts), finals = first.chapters;
  let report = first.report;
  const live = Boolean(run?.writer && !run.stale);
  // 최종판3 4: 호출 수 고정(작가 1 · 검수 1 · 수리 1). 표지 문제는 따로 부르지 않고 수리 1회에 함께 넣는다.
  const avoid = brief.chart.avoidImages ?? [];
  const writerCover = clean(run?.cover ?? null);
  let image = writerCover, imageSource: "writer" | "repaired" | "fallback" = "writer";
  const firstProblem = coverProblem(image, brief, avoid);
  // 최종판3 1·3: 정답지(엔진 사실)로 문장을 대조한다. 검수·수리도 같은 정답지를 쓴다.
  const sheet = factSheetFor(a.payload, a.policyAt, brief, k);
  const lctx = lintContext(brief, k, plan, a.prior?.sentences ?? [], brief.compatibility ? undefined : image, sheet);
  const tidy = tidyBook(finals, lctx);
  let chapters = tidy.chapters;
  const flags = lintBook(chapters, lctx);
  const canCall = Boolean(run?.writer && !run.stale && (live || deps.replay));
  const capLeft = () => deps.costCapUsd === undefined ? Infinity : deps.costCapUsd - (run?.costUsd ?? 0);
  const review: Record<string, unknown> = { version: REVIEW_VERSION, model: null, calls: 0, kept: [], direct: [], dropped: [], skipped: null };
  // 검수 1회(정해진 7범주 JSON, 안전장치). 실패·형식 오류·예산 초과면 검수만 건너뛴다(발행은 막지 않는다).
  let issues: ReviewIssue[] = [];
  const priorLines = priorSummaryOf(a.prior?.sentences ?? [], (a.prior?.covers ?? []).map(c => `(이전 책 표지) ${c}`));
  const rpBase = reviewPrompt({ brief, sheet, k, chapters, cover: image, prior: priorLines });
  const flagged = flags.map(f => f.sentence).filter(Boolean);
  const rp = reviewPrompt({ brief, sheet, k, chapters, cover: image, prior: priorLines, machineFlagged: rpBase.numbered.filter(x => flagged.some(s => s.includes(x.text) || x.text.includes(s))).map(x => x.n) });
  const reviewModel = deps.reviewModel ?? reviewModelOf();
  const repairReserve = run?.writer ? worstUsd(run.writer.model, 12_000, repair3MaxTokens(6_000, REPAIR3_MAX_ITEMS, run.writer.model)) : 0;
  if (!canCall) review.skipped = "no_writer";
  else if (rp.chars > REVIEW_MAX_INPUT_CHARS) review.skipped = "input_cap";
  else if (worstUsd(reviewModel, rp.chars, reviewMaxTokens(reviewModel)) + repairReserve > capLeft()) review.skipped = "budget";
  else {
    try {
      const writer = run!.writer, before = run!.calls.length;
      const r = await completeText({ ...opts(), provider: "anthropic", model: reviewModel, fallback: null }, run!, rp.system, rp.user, reviewMaxTokens(reviewModel), "review", REVIEW_SCHEMA as unknown as Record<string, unknown>);
      run = { ...r.run, writer }; review.model = reviewModel; review.calls = run.calls.length - before;
      const g = r.text ? guardReview(r.text, rp.numbered, rp.ids, priorLines.lines.length, brief.product) : null;
      // 출력 상한에 닿아 끝났으면(생각이 상한을 다 쓴 경우 포함) 따로 적는다. length는 다시 부르지 않는다(같은 입력 재호출 금지).
      const ended = run.calls.slice(before).at(-1)?.finish;
      if (!g) review.skipped = ended === "length" ? "length" : r.text ? "format_error" : "call_failed";
      else { issues = [...g.kept]; review.kept = g.kept; review.direct = g.direct; review.dropped = g.dropped.slice(0, 80);
        // A(비문)는 수정 문장이 명리 용어·숫자를 새로 넣지 않았을 때만 그대로 바꾼다(호출 없음).
        const byN = new Map(rp.numbered.map(x => [x.n, x]));
        for (const d of g.direct) { const x = byN.get(d.s); if (!x) continue; const sec = chapters.find(c => c.n === x.chapter)?.sections[x.section]; const p = sec?.paragraphs[x.paragraph];
          if (sec && p !== undefined && p.includes(x.text)) (sec.paragraphs as string[])[x.paragraph] = p.replace(x.text, d.fix); } }
    } catch { review.skipped = "call_failed"; }
  }
  // 수리 1회(작가 모델): 결정론 깃발 + 검수 지적 + 표지 문제를 문장 단위로 한 번에. 예산이 모자라면 건너뛴다.
  const items = repairItems({ chapters, flags: lintBook(chapters, lctx), issues, numbered: rp.numbered, cover: firstProblem ? { line: image, problem: firstProblem } : null });
  let repair: { items: number; calls: number; applied: AppliedRepair[]; skipped: string | null } = { items: items.length, calls: 0, applied: [], skipped: null };
  let repairedCover = "";
  if (items.length && canCall) {
    const p0 = repair3Prompt(sheet, brief, chapters, items);
    if (worstUsd(run!.writer!.model, p0.user.length + p0.system.length, repair3MaxTokens(p0.chars, items.length, run!.writer!.model)) > capLeft()) repair.skipped = "budget";
    else try { const before = run!.calls.length; const r = await repair3Pass(opts(), run!, sheet, brief, chapters, items); run = r.run; chapters = r.chapters; repairedCover = r.cover ?? ""; repair = { items: items.length, calls: run.calls.length - before, applied: r.applied, skipped: r.text ? null : "call_failed" }; }
    catch { repair.skipped = "call_failed"; }
  } else if (items.length) repair.skipped = "no_writer";
  // 최종판2 1-1: 고친 표지 → 작가 첫 표지 순으로 덜 걸린 것. 엔진 기본 이미지는 작가 표지가 없을 때만.
  { const c = chooseCover([{ line: repairedCover, source: "repaired" }, { line: writerCover, source: "writer" }], brief, avoid); image = c.line; imageSource = c.source; }
  // 재검사: 수리본도 같은 검사(3번)를 지난다. 남은 사실·금지 깃발 문장만 지운다(지우면 문단이 깨지면 원문을 두고 기록).
  let fixed = tidyBook(chapters, lctx).chapters;
  let remaining = lintBook(fixed, lctx);
  // 최종판3 12: 수리가 정답지 검사에 새로 걸리게 만든 문장은 원문으로 되돌린다(검수 오탐 → 맞는 문장을 틀리게 고친 경우, 호출 0).
  const rv = revertWorse(fixed, repair.applied, remaining.filter(f => HARD_RULES.has(f.rule)));
  if (rv.reverted.length) { fixed = tidyBook(rv.chapters, lctx).chapters; remaining = lintBook(fixed, lctx); }
  const del = deps.replay ? { chapters: fixed, deleted: [] as Deleted[] } : deleteFlagged(fixed, remaining, HARD_RULES);
  fixed = del.chapters;
  remaining = lintBook(fixed, lctx);
  const dropped = { chapters: fixed, dropped: [] as { at: string; heading: string; rules: string[]; sentences: string[] }[], kept: [] };
  // 반복 장 key(대운 연도·세운 달)·결정론 장은 문단 단위로 뺀다(빈 key는 결정론 문단으로 채운다).
  const notices = deps.replay ? { chapters: dropped.chapters, removed: [], kept: [] } : dropNoticeSentences(dropped.chapters, remaining);
  const enforced = deps.replay ? { chapters: notices.chapters, removed: 0, droppedParagraphs: 0, emptyKeys: [] } : enforce(notices.chapters, remaining.filter(f => f.card || chapters.find(c => c.n === f.chapter)?.source === "deterministic" || Boolean(fixed.find(c => c.n === f.chapter)?.keys?.length)));
  chapters = writeKeyFill(brief, plan, enforced.chapters, enforced.emptyKeys);
  chapters = insertFixedLines(chapters, brief);
  const rendered = renderTerms(chapters, brief, k); chapters = rendered.chapters;
  const byRule = (fs: readonly LintFlag[]) => fs.reduce<Record<string, number>>((o, x) => ({ ...o, [x.rule]: (o[x.rule] ?? 0) + 1 }), {});
  // 최종 A-9: 삭제·정리 뒤 문장이 2개 이하로 남은 소제목을 기록한다(관리자 확인용, 동작은 바꾸지 않는다).
  const thin = thinSections(chapters);
  const reviewMeta = { ...review, ...(thin.length ? { thinSections: thin } : {}), repair: { items: repair.items, calls: repair.calls, skipped: repair.skipped, applied: repair.applied, reverted: rv.reverted }, deleted: del.deleted.filter(d => !d.kept), keptWithRecord: del.deleted.filter(d => d.kept),
    remainingHard: remaining.filter(f => HARD_RULES.has(f.rule) && f.paragraph >= 0 && !f.card).map(f => ({ at: `${f.chapter}.${f.section}.${f.paragraph}`, rule: f.rule, detail: f.detail ?? "", sentence: f.sentence.slice(0, 200) })), cover: { source: imageSource, firstProblem: firstProblem ?? null } };
  report = { ...report, metrics: { ...(report.metrics as NonNullable<typeof report.metrics>), p6c: { tidy: tidy.count, flags: byRule(flags), repairTargets: items.length, repaired: repair.applied.length, repairCalls: repair.calls, redoCalls: 0, redoChapters: [], remaining: byRule(remaining), removed: enforced.removed, droppedParagraphs: enforced.droppedParagraphs,
    dropped: remaining.filter(f => f.paragraph >= 0 && !f.card && HARD_RULES.has(f.rule)).map(f => ({ at: `${f.chapter}.${f.section}.${f.paragraph}`, rule: f.rule, ...(f.detail ? { detail: f.detail } : {}), sentence: f.sentence.slice(0, 200) })), cover: imageSource, cardFlags: remaining.filter(f => f.card).map(f => `${f.chapter}.${f.section}.${f.card}:${f.rule}`),
    rewriteTargets: 0, rewritten: 0, rewriteCalls: 0, droppedSections: dropped.dropped, hanjaStripped: tidy.count.hanja ?? 0, termsAnnotated: rendered.count,
    noticesRemoved: notices.removed, noticesKept: notices.kept, image: { line: image, overlap: firstProblem?.startsWith("피할") ? avoidOverlaps(writerCover, avoid) : [], repairCalls: 0, ...(firstProblem ? { firstProblem } : {}) } } } };
  const people = await (deps.people ?? v4People)(a.payload, a.policyAt);
  const { draft, evidence } = assembleV5Book({
    brief, plan, finals: chapters, report, payload: a.payload, generatedAt: a.policyAt, people, cover: image, ...(brief.compatibility ? {} : { image }), raw: run?.raw ?? [], ...(pl ? { priorLedger: pl } : {}), badCards: new Set(remaining.filter(f => f.card).map(f => `${f.chapter}.${f.section}.${f.card}`)),
    review: reviewMeta, ...(deps.testRun || process.env.LLM_TEST_RUN === "1" ? { test: true } : {}),
    writer: run?.writer ?? null, fallback: run?.fallback ?? null, calls: run?.calls ?? [],
    tokens: { input: run?.usage.inputTokens ?? 0, cachedInput: run?.usage.cachedInputTokens ?? 0, output: run?.usage.outputTokens ?? 0 },
    costUsd: run?.costUsd ?? 0, durationMs: now() - started, briefHash: briefHash(brief), knowledgeVersion, promptVersion: WRITER_PROMPT_VERSION, recovered: Boolean(a.recover), priorBooks: a.prior?.books ?? 0,
  });
  return { snapshot: createV5Snapshot({ reportId: a.reportId, createdAtIso: a.policyAt, draft, evidence }), meta: evidence.meta, run };
}
