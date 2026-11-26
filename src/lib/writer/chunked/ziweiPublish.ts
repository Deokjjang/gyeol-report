/**
 * ZW-2 — 자미 책 「나의 열두 서가」 발행(운영 감독 · 개발 도구 공통 진입점: publish.ts buildV5Snapshot이 ziwei_full이면 여기로).
 * 흐름(세운 · 대운 장 묶음 작가와 같은 30분 흐름): 명반 계산(1회, 스냅샷에 저장) → 브리프 → 설계도 → 묶음 6개 병렬 작가 → 검사(ziweiCheck)
 *   → 차단 깃발이 든 문단만 1회 교체(같은 접두부) → 그래도 남은 차단 문장은 지운다 → 표지 · 장 정리 → 스냅샷.
 * 결정론 대체본은 고객에게 내보내지 않는다(빈 장 · 빈 소제목이 남으면 review.hold — 발행 관문이 보류한다).
 */
import { createHash } from "node:crypto";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { resolveLlmConfig } from "@/lib/llm";
import type { ProductPreviewSnapshot } from "@/lib/report-generation/productPreviewSnapshot";
import type { ReportInputPayload, SinglePersonReportInputPayload } from "@/lib/report-generation/reportInputTypes";
import { BIRTH_TIME_SLOT_DEFINITIONS } from "@/lib/saju/birthTimePrecisionTypes";
import { buildZiweiBrief, ZIWEI_BRIEF_VERSION, type ZiweiPerson } from "@/lib/ziwei/brief";
import { buildZiweiDesign } from "@/lib/ziwei/design";
import { loadZiweiKnowledge } from "@/lib/ziwei/knowledge";
import { ziweiSnapshotPart } from "@/lib/ziwei/snapshot";
import { STAR_NAMES } from "@/lib/ziwei/ids";
import { BOOK_EDITION, withKeySpan, type V5Chapter, type WriterMeta } from "../book";
import type { WriterChapter } from "../prompt";
import { chunkBudget, mergeRuns, WRITER_TIME_BUDGET_MS, type ChapterSink, type WriterOptions, type WriterRun } from "../runner";
import type { DraftChapter, FinalChapter } from "../safety";
import { kstDate, writerKnowledge, type V5BuildDeps } from "../publish";
import { chunkPlan, renderCard, type Chunk, type ParaTarget } from "./prompt";
import { replaceParagraphs, writeChunks, type ChunkLog } from "./run";
import { buildZiweiIntake, ziweiRuleCtxOf, ziweiRules, ZIWEI_PROMPT_VERSION } from "./ziwei";
import { inspectZiwei, splitZ, type ZFlag } from "./ziweiCheck";
import { createZiweiSnapshot, ZIWEI_DRAFT_VERSION, ZIWEI_EVIDENCE_VERSION, type ZiweiBookDraft, type ZiweiEvidence } from "../ziweiBook";

export const ZIWEI_BOOK_TITLE = "나의 열두 서가";
export const ZIWEI_FINAL_LINE = "열두 칸 어디를 펼쳐도, 그 칸에 앉은 별은 당신 편이에요.";
export type ZiweiReview = {
  readonly first: readonly ZFlag[]; readonly final: readonly ZFlag[]; readonly rounds: number; readonly replaced: number; readonly reverted: number;
  readonly cut: readonly { readonly at: string; readonly rule: string; readonly sentence: string }[]; readonly hold: readonly string[]; readonly log: readonly ChunkLog[]; readonly cover: { readonly line: string; readonly source: "writer" | "engine" };
};

let zwKnowledgeVersion: string | null = null;
/** 자미 DB 내용 해시(Book 메타 — 4종 · 세운 · 대운 지식 해시와 따로). */
export function ziweiKnowledgeVersion(): string {
  if (zwKnowledgeVersion) return zwKnowledgeVersion;
  const dir = join(process.cwd(), "src/data/knowledge-v5/ziwei"), h = createHash("sha256");
  for (const f of readdirSync(dir).filter(x => x.endsWith(".json")).sort()) h.update(f).update(readFileSync(join(dir, f)));
  zwKnowledgeVersion = `ziwei-kb:${h.digest("hex").slice(0, 12)}`;
  return zwKnowledgeVersion;
}
const REL_KO: Readonly<Record<string, string>> = { single: "솔로", some: "썸", dating: "연애 중", marriage_preparing: "결혼 준비 중", married: "기혼" };
const JOB_KO: Readonly<Record<string, string>> = { student: "학생", job_seeker: "구직 중", employee: "직장인", freelancer: "프리랜서", self_employed: "자영업", business_owner: "사업", homemaker: "살림 · 육아", unemployed: "쉬는 중", other: "기타" };
/** 표지 줄 검사(공백 빼고 12~26자, 명사로 끝 — 동사 · 형용사 끝 금지, 금지 낱말 없음). */
export function ziweiCoverOk(line: string): boolean {
  const t = line.replace(/\s/g, "");
  return t.length >= 12 && t.length <= 26 && !/(다|요|니다|까|죠)[.!?]?$/.test(line.trim()) && !/[.!?]$/.test(line.trim()) && !/살성|학파|iztro|운명|팔자/.test(line);
}

/** 작가 입력 조립(빌더 · 가짜 작가 공통, 결정론): 명반 → 브리프 → 설계도 → Intake · 묶음 · 시스템 블록 · 장 목록. */
export function ziweiPlanFor(payload: ReportInputPayload, policyAt: string) {
  const p = payload as SinglePersonReportInputPayload, asOf = kstDate(policyAt);
  const part = ziweiSnapshotPart(p.person, asOf);
  const kb = loadZiweiKnowledge(), { k } = writerKnowledge();
  const children = (p.productOptions as { children?: "has" | "none" } | undefined)?.children;
  const slot = BIRTH_TIME_SLOT_DEFINITIONS.find(x => x.value === p.person.approximateBirthTimeSlot);
  const person: ZiweiPerson = { name: p.person.name, gender: p.person.gender as ZiweiPerson["gender"], mbti: (p.person.mbtiType || null) as ZiweiPerson["mbti"],
    relationshipStatus: p.userContext.relationshipStatus, jobStatus: p.userContext.jobStatus, detailJob: p.userContext.detailJob, ...(children ? { children } : {}),
    precision: part.chart.birth.precision, ...(part.chart.birth.precision === "approximate" && slot ? { slotLabel: slot.nameKo } : {}) };
  const brief = buildZiweiBrief({ chart: part.chart, kb, k, person, asOf });
  const design = buildZiweiDesign(brief), intake = buildZiweiIntake(brief, design), chunks = chunkPlan(intake);
  const system = { rules: ziweiRules(ziweiRuleCtxOf(brief, intake)), card: renderCard(intake) };
  const plan: WriterChapter[] = design.chapters.map(c => ({ n: c.n, id: c.id, title: c.title, question: c.question, role: "ZIWEI", targetChars: c.target, subheadings: [c.sections.length, c.sections.length] as const, useName: c.n === 1 || c.n === 9, materials: [] }));
  return { p, asOf, part, person, children, slot, brief, design, intake, chunks, system, plan };
}

export async function buildZiweiSnapshot(a: { payload: ReportInputPayload; reportId: string; policyAt: string; sink: ChapterSink; recover?: boolean; deps?: V5BuildDeps }): Promise<{ snapshot: ProductPreviewSnapshot; meta: WriterMeta; run: WriterRun | null; review: ZiweiReview }> {
  const deps = a.deps ?? {}, now = deps.now ?? (() => Date.now()), started = now();
  const { p, asOf, part, person, children, slot, brief, design, intake, chunks, system, plan } = ziweiPlanFor(a.payload, a.policyAt);
  const llm = resolveLlmConfig();
  const provider = deps.provider ?? llm.provider, model = deps.model ?? llm.model;
  const fallbackTarget = deps.fallback === undefined ? llm.fallback : deps.fallback;
  const fb = fallbackTarget && (fallbackTarget.provider !== provider || fallbackTarget.model !== model) ? fallbackTarget : null;
  const budgetMs = deps.budgetMs ?? WRITER_TIME_BUDGET_MS;
  const sink: ChapterSink = { save: c => a.sink.save({ ...c, total: plan.length }), load: () => a.sink.load() };
  const opts = (): WriterOptions => ({ brief: undefined as never, plan, provider: provider!, model: model!, sink, cacheSystem: true, ...deps, budgetMs: budgetMs - (now() - started), fallback: fb });
  const runs: WriterRun[] = [], log: ChunkLog[] = [];
  let drafts = new Map<number, DraftChapter>(), texts = new Map<string, string>();
  const costPot = chunkBudget(deps.costCapUsd);
  if (!a.recover && model) {
    try { const w = await writeChunks({ o: opts(), intake, chunks, plan, system, sink, budget: costPot, ...(deps.secondPass ? { retryTodo: true } : {}) }); if (w.run) runs.push(w.run); drafts = w.drafts; texts = w.texts; log.push(...w.log); }
    catch { drafts = new Map(); }
  }
  if (a.recover || !runs.length) { try { for (const s of await a.sink.load()) if (!drafts.has(s.n)) drafts.set(s.n, { chapter: s.chapter, source: s.source }); } catch { /* 저장본 없음 */ } }

  // ---- 정리 · 검사 ----
  const callName = person.name.trim(), alt = [...new Set([callName, callName.length >= 3 ? callName.slice(1) : ""].filter(n => n.length >= 2))].sort((x, y) => y.length - x.length).map(n => n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
  const unname = (t: string) => (alt ? t.replace(new RegExp(`(?<![가-힣])(?:${alt})\\s?(?:님|씨)?(에게는|에게도|에게|은|는|이|가|을|를|과|와|의|도|만|처럼)?(?![가-힣])`, "g"), (_m, j?: string) => `당신${j ? ({ 은: "은", 는: "은", 이: "이", 가: "이", 을: "을", 를: "을", 과: "과", 와: "과" } as Record<string, string>)[j] ?? j : ""}`) : t);
  const build = (): FinalChapter[] => design.chapters.map(c => {
    const d = drafts.get(c.n);
    const sections = (d?.chapter.sections ?? []).map((s, si) => ({ ...s, heading: s.heading.replace(/[〈〉]/g, ""), paragraphs: s.paragraphs.map((t, pi) => { const t1 = t.replace(/[〈〉]/g, ""); return (c.n === 1 || c.n === 9) && si === 0 && pi === 0 ? t1 : unname(t1); }) }));
    return { n: c.n, id: c.id, title: c.title, sections, source: d?.source ?? "writer", chars: sections.reduce((x, s) => x + s.paragraphs.join("").length, 0) };
  });
  const ctx = { brief, design, intake };
  let chs = build();
  const first = inspectZiwei(chs, ctx);
  const block = (fs: readonly ZFlag[]) => fs.filter(f => f.branch !== null);
  let rounds = 0, replaced = 0, reverted = 0;
  const live = runs.some(r => r.writer) && !deps.replay;
  const chunkOf = (n: number): Chunk | undefined => chunks.find(c => c.parts.some(x => x.n === n));
  // ---- 걸린 문단 교체 1회(묶음마다 한 호출) ----
  if (live && block(first).some(f => f.paragraph >= 0)) {
    rounds = 1;
    const byChunk = new Map<Chunk, ParaTarget[]>();
    for (const f of block(first).filter(x => x.paragraph >= 0)) {
      const d = drafts.get(f.chapter), sec = d?.chapter.sections[f.section], c = chunkOf(f.chapter); if (!d || !sec || !c) continue;
      const id = `${f.chapter}.${f.section}.${f.paragraph}`, list = byChunk.get(c) ?? [];
      const had = list.find(t => t.id === id);
      if (had) (had.issues as { sentence: string; reason: string }[]).push({ sentence: f.sentence, reason: f.detail });
      else list.push({ id, chapter: f.chapter, section: f.section, heading: sec.heading, index: f.paragraph, text: sec.paragraphs[f.paragraph] ?? "", issues: [{ sentence: f.sentence, reason: f.detail }] });
      byChunk.set(c, list);
    }
    const before = new Map([...drafts].map(([n, d]) => [n, d] as const));
    await Promise.all([...byChunk].map(async ([chunk, targets]) => {
      try { const r = await replaceParagraphs({ o: opts(), intake, chunks, plan, system, sink, chunk, targets: targets.map(t => ({ ...t, issues: t.issues.slice(0, 6) })), round: 1, drafts, budget: costPot }); runs.push(r.run); log.push(r.log); replaced += r.applied.length; }
      catch { /* 교체 실패 — 지우기 단계가 맡는다 */ }
    }));
    // 받은 문단이 차단을 줄이지 못했으면(같거나 늘면) 앞 글로 되돌린다.
    const after = inspectZiwei(build(), ctx), at = (fs: readonly ZFlag[], n: number, s: number, pi: number) => block(fs).filter(f => f.chapter === n && f.section === s && f.paragraph === pi).length;
    for (const [n, d] of drafts) {
      const b0 = before.get(n); if (!b0 || b0 === d) continue;
      const sections = d.chapter.sections.map((s, si) => ({ ...s, paragraphs: s.paragraphs.map((t, pi) => { const old = b0.chapter.sections[si]?.paragraphs[pi]; if (old === undefined || old === t) return t;
        if (at(after, n, si, pi) >= at(first, n, si, pi) && at(first, n, si, pi) > 0) { reverted++; return old; } return t; }) }));
      drafts.set(n, { ...d, chapter: { ...d.chapter, sections } });
    }
    chs = build();
  }
  // ---- 남은 차단 문장 지우기(문단이 남을 때만 — 빈 소제목은 보류) ----
  const cut: { at: string; rule: string; sentence: string }[] = [];
  let flags = inspectZiwei(chs, ctx);
  const norm = (t: string) => t.replace(/[^가-힣A-Za-z0-9]/g, "");
  for (const f of block(flags).filter(x => x.paragraph >= 0 && x.sentence)) {
    const d = drafts.get(f.chapter), sec = d?.chapter.sections[f.section]; if (!d || !sec) continue;
    const para = sec.paragraphs[f.paragraph] ?? "", kept = splitZ(para).filter(s => norm(s.replace(/[⟪⟫]/g, "")) !== norm(f.sentence.replace(/[⟪⟫]/g, "")) && !norm(s).includes(norm(f.sentence)));
    if (kept.length === splitZ(para).length || !kept.length) continue;
    const paragraphs = sec.paragraphs.map((t, i) => (i === f.paragraph ? kept.join(" ") : t));
    drafts.set(f.chapter, { ...d, chapter: { ...d.chapter, sections: d.chapter.sections.map((s, i) => (i === f.section ? { ...s, paragraphs } : s)) } });
    cut.push({ at: `${f.chapter}.${f.section}.${f.paragraph}`, rule: f.rule, sentence: f.sentence });
  }
  chs = build(); flags = inspectZiwei(chs, ctx);
  const hold = [...new Set([...flags.filter(f => f.rule === "chapter_missing" || f.rule === "section_empty").map(f => `${f.chapter}장 ${f.rule}`), ...block(flags).filter(f => f.paragraph >= 0).map(f => `${f.chapter}.${f.section}.${f.paragraph} ${f.rule}`)])];

  // ---- 표지 · 조립 ----
  const firstText = texts.get(chunks.find(c => c.parts.some(x => x.n === 1))?.id ?? "") ?? "";
  const writerCover = /^\s*\[표지\]\s*(.+?)\s*$/m.exec(firstText)?.[1]?.replace(/[⟪⟫「」]/g, "") ?? "";
  const lifeStar = part.chart.palaces.find(x => x.id === "myeong")!, borrowed = lifeStar.empty ? part.chart.palaces.find(x => x.id === lifeStar.borrowFrom)! : lifeStar;
  const engineCover = `${STAR_NAMES[borrowed.majors[0]].easy}이 비추는 열두 칸`;
  const cover = ziweiCoverOk(writerCover) ? { line: writerCover, source: "writer" as const } : { line: engineCover, source: "engine" as const };
  const chapters: V5Chapter[] = chs.map(c => ({ n: c.n, id: c.id, title: c.title, sections: c.sections.map(s => withKeySpan({ heading: s.heading, paragraphs: s.paragraphs })) }));
  const run = runs.length ? mergeRuns(runs) : null;
  const draft: ZiweiBookDraft = { version: ZIWEI_DRAFT_VERSION, productVersion: "v5", productType: "ziwei_full", title: ZIWEI_BOOK_TITLE, headline: cover.line, finalLine: ZIWEI_FINAL_LINE, edition: BOOK_EDITION, chapters, coverLine: cover.line, baseDate: asOf, ziwei: part };
  const timeValue = part.chart.birth.precision === "exact" ? p.person.birthTime : `${slot?.nameKo ?? "시간대"} (시간대만 앎)`;
  const context = [{ label: "생년월일", value: p.person.birthDate }, { label: "출생시간", value: timeValue }, { label: "성별", value: person.gender === "FEMALE" ? "여성" : "남성" },
    { label: "연애", value: REL_KO[person.relationshipStatus] ?? "미입력" }, { label: "일", value: `${JOB_KO[person.jobStatus] ?? "미입력"}${person.detailJob ? ` · ${person.detailJob}` : ""}` },
    { label: "자녀", value: children === "has" ? "있음" : children === "none" ? "없음" : "미입력" }, { label: "MBTI", value: person.mbti ?? "모름" }];
  const byRule = (fs: readonly ZFlag[]) => fs.reduce<Record<string, number>>((o, f) => ({ ...o, [f.rule]: (o[f.rule] ?? 0) + 1 }), {});
  const review: ZiweiReview = { first, final: flags, rounds, replaced, reverted, cut, hold, log, cover };
  const meta: WriterMeta = {
    writer: run?.writer ?? null, promptVersion: ZIWEI_PROMPT_VERSION, knowledgeVersion: ziweiKnowledgeVersion(), briefVersion: ZIWEI_BRIEF_VERSION,
    briefHash: createHash("sha256").update(JSON.stringify([brief.lines, brief.pairs, design.chapters])).digest("hex").slice(0, 16),
    tokens: { input: run?.usage.inputTokens ?? 0, cachedInput: run?.usage.cachedInputTokens ?? 0, output: run?.usage.outputTokens ?? 0 }, costUsd: run?.costUsd ?? 0, calls: run?.calls ?? [], durationMs: now() - started,
    // 30분 흐름 관문(policy judgeBuild): 빈 장은 결정론 장(빠짐)으로, 지우고도 남은 차단(갈래)이 있는 장은 「four_block:」 사유로 — 그 시도에서 발행하지 않는다(감독 2차 · 결론).
    chapters: chs.map(c => { const left = block(flags).filter(f => f.chapter === c.n); const empty = !c.sections.length || c.sections.every(s => !s.paragraphs.length);
      return { n: c.n, id: c.id, title: c.title, source: empty ? "deterministic" as const : c.source, chars: c.chars, evidence: design.chapters.find(d => d.n === c.n)?.home ?? [],
        ...(left.length ? { reason: `four_block:${[...new Set(left.map(f => f.rule))].join(",")}` } : {}) }; }),
    safety: { deletions: cut.length, byRule: byRule(flags), warnings: flags.filter(f => f.branch === null).length }, recovered: Boolean(a.recover),
    ...(run?.raw?.length ? { raw: run.raw } : {}), review: { first: byRule(first), final: byRule(flags), rounds, replaced, reverted, cut, hold, cover: cover.source, chunks: log },
    ...(deps.testRun ? { test: true } : {}),
  };
  const evidence: ZiweiEvidence = { version: ZIWEI_EVIDENCE_VERSION, productType: "ziwei_full", generatedAt: a.policyAt, input: a.payload, names: person.name, context, meta };
  return { snapshot: createZiweiSnapshot({ reportId: a.reportId, createdAtIso: a.policyAt, draft, evidence }), meta, run, review };
}
