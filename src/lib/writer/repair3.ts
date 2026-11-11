/**
 * 문장 단위 일괄 수리(최종판3 4): 결정론 검사 깃발 + 검수 지적 + 표지 문제를 한 번에 모아 작가 모델을 한 번 부른다(책 1권당 최대 1회).
 * 지적된 문장만 고친다(문단 전체를 다시 쓰지 않는다). 정답지(엔진 사실)를 함께 준다.
 * 수리본은 다시 검사하고, 실패한 문장만 지운다. 지우면 문단이 깨지는 경우(앞말에 기대는 다음 문장, 소제목의 마지막 문단)는 원문을 두고 기록한다.
 */
import { removeSentenceAt } from "./safety/orphan";
import type { Brief } from "@/lib/brief/schema";
import type { FactSheet, PersonFacts } from "@/lib/factsheet/build";
import { completeText, MODEL_TOKENS_PER_CHAR, type WriterOptions, type WriterRun } from "./runner";
import type { FinalChapter } from "./safety";
import { RURAL_PROP, splitSentences } from "./safety/patterns";
import { HARD_RULES, type LintFlag } from "./safety/p6c";
import type { Numbered, ReviewIssue } from "./review";

export const REPAIR3_SYSTEM = `너는 결리포트 원고의 교정 작가다. [R번호] 항목마다 적힌 문제를 고쳐 그 문장 하나만 다시 쓴다.
- 지적된 문장만 고친다. 앞뒤 문장(문맥)은 흐름을 맞추는 데만 쓰고 돌려주지 않는다. 문단 흐름이 이어지게 쓴다.
- 정답지(facts)와 맞게 쓴다. 새 사실·새 사람·새 사건·입력에 없는 상황을 만들지 않는다. 같은 장면·같은 처방을 다른 말로 되풀이하지 않는다.
- 고칠 수 없거나 빼는 게 맞으면 "[R번호] (삭제)"라고만 쓴다.
- 쉬운 존댓말(~입니다/~예요), 원문과 비슷한 길이. 한자·"명리학에서"·그림 별명·안내·면책 문장 금지. 행동 시점은 연·월 숫자 대신 "앞으로 한 달".
- 대운·세운의 기간·해는 정답지(facts) 값만 쓴다. 연도를 지울 때 "올해까지"·"끝 무렵" 같은 기간을 새로 지어 넣지 않는다(모르면 기간을 빼고 흐름만 쓴다).
- [표지] 항목은 공백 빼고 16~26자, 명사로 끝나는 그림 한 줄로(설명문·직업·나이 금지).
- [추가] 항목은 그 문단 끝에 붙일 새 문장 하나를 쓴다.
- 출력: 항목마다 "[R번호] 고친 문장". 앞뒤 설명 없이.`;

/** 수리 항목: 문장(sentence)·소제목(heading)·표지(cover)·문단 끝에 더할 문장(append). */
export type RepairItem = { readonly id: number; readonly kind: "sentence" | "heading" | "cover" | "append"; readonly chapter: number; readonly section: number; readonly paragraph: number; readonly original: string; readonly problems: string[]; readonly source: ("lint" | "review" | "cover")[] };
/** 최종판3 6: 항목 상한·항목당 글자 상한·출력 상한(고정)으로 수리 1회의 최악 비용을 묶는다. */
export const REPAIR3_MAX_ITEMS = 40;
export const REPAIR3_PROBLEM_CHARS = 300, REPAIR3_CONTEXT_CHARS = 240, REPAIR3_MAX_TOKENS = 8_000;

const CAT_KO: Readonly<Record<string, string>> = { F: "사실·뜻 불일치", C: "같은 사람 모순", I: "입력 밖 상황 단정", R: "다른 장 반복", L: "내부 라벨·면책·규칙 노출", T: "시점 표현", A: "비문·단어 오용" };

/** 문단 안에서 원문 문장을 찾는다(정리 뒤 문장과 같은 꼴). */
const locate = (chapters: readonly FinalChapter[], chapter: number, section: number, paragraph: number, sentence: string) => {
  const p = chapters.find(c => c.n === chapter)?.sections[section]?.paragraphs[paragraph] ?? "";
  return splitSentences(p.replace(/[⟪⟫]/g, "")).find(s => s === sentence || s.includes(sentence) || sentence.includes(s)) ?? null;
};

/** 깃발·지적·표지 문제 → 항목(같은 문장은 한 항목, 문제는 모은다). */
export function repairItems(a: { chapters: readonly FinalChapter[]; flags: readonly LintFlag[]; issues: readonly ReviewIssue[]; numbered: readonly Numbered[]; cover?: { line: string; problem: string } | null; byN?: ReadonlyMap<number, Numbered> }): RepairItem[] {
  const out: RepairItem[] = [], key = new Map<string, RepairItem>();
  const add = (k: string, base: Omit<RepairItem, "id" | "problems" | "source">, problem: string, src: RepairItem["source"][number]) => {
    const had = key.get(k);
    if (had) { if (!had.problems.includes(problem)) had.problems.push(problem); if (!had.source.includes(src)) had.source.push(src); return; }
    if (out.length >= REPAIR3_MAX_ITEMS) return;
    const it: RepairItem = { ...base, id: out.length + 1, problems: [problem], source: [src] }; out.push(it); key.set(k, it);
  };
  if (a.cover) add("cover", { kind: "cover", chapter: 0, section: 0, paragraph: -1, original: a.cover.line }, `표지: ${a.cover.problem}`, "cover");
  // AM 재생성 판독(major-1·annual-1): 수리 40칸이 모두 lint(대부분 문체 깃발)로 차서 검수가 맞게 짚은 사실·면책 지적이 고쳐지지 않았고, 8칸은 조립이 어차피 떼는 머리 문장 베낌에 쓰였다.
  // → 칸 순서: 사실·금지 깃발(안 고치면 지워진다) → 검수 지적 → 문체 깃발. 머리 문장 베낌(「YYYY년 간지는 …이 하늘에, …이 땅에」)에는 칸을 주지 않는다.
  const HEAD_COPY = /^(\d{4}년 )?[가-힣]{2}(\([一-鿿]{2}\))?(월)?(\([一-鿿]{2}月?\))?(은|는) [^.?!]{0,40}(하늘에|천간에)[^.?!]{0,40}(땅에|지지에)/;
  const flagsOf = (hard: boolean) => a.flags.filter(f => HARD_RULES.has(f.rule as never) === hard && !(f.sentence && HEAD_COPY.test(f.sentence)));
  const addFlags = (list: readonly LintFlag[]) => { for (const f of list) {
    const ch = a.chapters.find(c => c.n === f.chapter); if (!ch || ch.source === "deterministic" || f.card) continue;
    const problem = `${f.hint}${f.detail ? ` [${f.detail}]` : ""}`;
    if (f.paragraph < 0) { add(`h:${f.chapter}.${f.section}`, { kind: "heading", chapter: f.chapter, section: f.section, paragraph: -1, original: ch.sections[f.section]?.heading ?? "" }, problem, "lint"); continue; }
    if (!f.sentence) { add(`a:${f.chapter}.${f.section}.${f.paragraph}`, { kind: "append", chapter: f.chapter, section: f.section, paragraph: f.paragraph, original: ch.sections[f.section]?.paragraphs[f.paragraph] ?? "" }, problem, "lint"); continue; }
    const s = locate(a.chapters, f.chapter, f.section, f.paragraph, f.sentence); if (!s) continue;
    add(`s:${f.chapter}.${f.section}.${f.paragraph}:${s}`, { kind: "sentence", chapter: f.chapter, section: f.section, paragraph: f.paragraph, original: s }, problem, "lint");
  } };
  addFlags(flagsOf(true));
  const byN = a.byN ?? new Map(a.numbered.map(x => [x.n, x]));
  for (const i of a.issues) {
    const x = byN.get(i.s); if (!x) continue;
    const other = i.s2 ? byN.get(i.s2)?.text : undefined;
    const problem = `${CAT_KO[i.cat] ?? i.cat}: ${i.why}${i.ref ? ` (근거 ${i.ref})` : ""}${i.field ? ` (입력 칸 ${i.field})` : ""}${other ? ` — 비교 문장: "${other.slice(0, 120)}"` : ""}`;
    if (x.n === 0) { add("cover", { kind: "cover", chapter: 0, section: 0, paragraph: -1, original: x.text }, problem, "review"); continue; }
    if (x.paragraph < 0) { add(`h:${x.chapter}.${x.section}`, { kind: "heading", chapter: x.chapter, section: x.section, paragraph: -1, original: x.text }, problem, "review"); continue; }
    const s = locate(a.chapters, x.chapter, x.section, x.paragraph, x.text) ?? x.text;
    add(`s:${x.chapter}.${x.section}.${x.paragraph}:${s}`, { kind: "sentence", chapter: x.chapter, section: x.section, paragraph: x.paragraph, original: s }, problem, "review");
  }
  addFlags(flagsOf(false));
  return out;
}

/** 정답지 요약(수리용 닻): 사람마다 기둥·강약·묶음·오행·신살·관계·올해·대운. */
export function factsBrief(sheet: FactSheet, brief: Brief): Record<string, unknown> {
  // AM 7부(세운 판독): 세운 책의 「그 해」는 신년판 해(2027)다. 기준일의 해(2026)를 닻으로 주니 수리가 맞는 2027 관계 문장을 2026 오(午)로 고쳐 썼다
  // (「자와 미가 … 해(害)」→「자와 올해 오가 … 부딪치는」). 세운은 책의 해, 나머지는 기준일의 해 — 연도를 숫자로 함께 준다.
  const base = Number(sheet.baseDate.slice(0, 4)), bookYear = brief.product === "annual_fortune" ? Number(brief.timeline?.entries.find(e => e.kind === "year")?.key) : NaN;
  const y = Number.isInteger(bookYear) && bookYear > 2000 ? bookYear : base;
  const person = (p: PersonFacts) => ({ name: p.name, pillars: Object.fromEntries(Object.entries(p.pillars).map(([k, v]) => [k, v ? `${v.ganjiKo}(${v.stem}${v.branch})` : "시간 미상"])), strength: p.strength.labelKo,
    groups: Object.values(p.groups).map(g => `${g.name} ${g.level}`).join(" · "), elements: Object.keys(p.elements.count).map(e => `${e} 겉 ${p.elements.count[e as never]}개·세기 ${p.elements.status[e as never]}`).join(" · "),
    shinsal: p.shinsal.map(s => `${s.name}(${s.slots.join("·")})`).join(", "), relations: p.relations.map(r => `${r.key} ${r.kind}${r.completeness !== "full" ? `(${r.completeness})` : ""}`).join(", "),
    thisYear: p.annual.filter(a => a.year === y).map(a => `${a.year}년 ${a.ganjiKo}: 원국과 ${a.relations.map(r => `${r.key} ${r.kind}`).join("·") || "관계 없음"}`)[0], mbti: p.mbti?.type ?? null, input: p.input });
  return { people: sheet.people.map(person), ...(sheet.pair ? { pairCommon: sheet.pair.common } : {}), forbiddenFacts: brief.person.forbiddenFacts, ...(brief.compatibility?.profiles?.length ? { profiles: brief.compatibility.profiles.map(p => p.line) } : {}), product: brief.product };
}

const sentenceContext = (chapters: readonly FinalChapter[], it: RepairItem) => {
  if (it.kind !== "sentence") return "";
  const ss = splitSentences((chapters.find(c => c.n === it.chapter)?.sections[it.section]?.paragraphs[it.paragraph] ?? "").replace(/[⟪⟫]/g, ""));
  const i = ss.indexOf(it.original);
  return `앞: ${i > 0 ? ss[i - 1] : "(문단 첫 문장)"} / 뒤: ${i >= 0 && i + 1 < ss.length ? ss[i + 1] : "(문단 끝)"}`;
};

export function repair3Prompt(sheet: FactSheet, brief: Brief, chapters: readonly FinalChapter[], items: readonly RepairItem[]): { system: string; user: string; chars: number } {
  let chars = 0;
  const lines = items.map(it => {
    chars += it.original.length;
    const tag = it.kind === "cover" ? "[표지] " : it.kind === "heading" ? "[소제목] " : it.kind === "append" ? "[추가] " : "";
    const title = it.chapter ? `${it.chapter}장 「${chapters.find(c => c.n === it.chapter)?.title ?? ""}」` : "표지";
    return `[R${it.id}] ${tag}${title}\n문제:\n${it.problems.join(" ").length > REPAIR3_PROBLEM_CHARS ? `(1) ${it.problems.join(" / ").slice(0, REPAIR3_PROBLEM_CHARS)}` : it.problems.map((p, j) => `(${j + 1}) ${p}`).join("\n")}\n${it.kind === "append" ? "문단" : "원문"}: ${it.original.slice(0, 600)}${it.kind === "sentence" ? `\n문맥: ${sentenceContext(chapters, it).slice(0, REPAIR3_CONTEXT_CHARS)}` : ""}`;
  });
  const user = `facts(정답지):\n\`\`\`json\n${JSON.stringify(factsBrief(sheet, brief))}\n\`\`\`\n\n[항목]\n${lines.join("\n\n")}\n\n항목마다 "[R번호] 고친 문장"으로 돌려주세요.`;
  return { system: REPAIR3_SYSTEM, user, chars };
}

export function parseRepair3(text: string): Map<number, string> {
  const out = new Map<number, string>();
  const parts = text.split(/^\s*\[R(\d+)\]\s*/m);
  for (let i = 1; i + 1 < parts.length; i += 2) { const v = parts[i + 1].replace(/\s+/g, " ").replace(/^\[(표지|소제목|추가)\]\s*/, "").trim(); if (v) out.set(Number(parts[i]), v); }
  return out;
}

export type AppliedRepair = { readonly id: number; readonly kind: RepairItem["kind"]; readonly at: string; readonly before: string; readonly after: string; readonly source: readonly string[] };
const DELETE = /^\(?삭제\)?\.?$/;
/** 고친 문장을 제자리에 넣는다. (삭제)는 지운 것으로 기록. 표지는 cover로 돌려준다. */
export function applyRepair3(chapters: readonly FinalChapter[], items: readonly RepairItem[], fixes: ReadonlyMap<number, string>): { chapters: FinalChapter[]; cover: string | null; applied: AppliedRepair[] } {
  const applied: AppliedRepair[] = [];
  let cover: string | null = null;
  const out = chapters.map(c => ({ ...c, sections: c.sections.map(s => ({ ...s, paragraphs: [...s.paragraphs] })) }));
  for (const it of items) {
    const v = fixes.get(it.id); if (!v) continue;
    const at = `${it.chapter}.${it.section}.${it.paragraph}`;
    if (it.kind === "cover") { if (!DELETE.test(v)) { cover = v.replace(/[*"“”]/g, "").trim(); applied.push({ id: it.id, kind: it.kind, at: "cover", before: it.original, after: cover, source: it.source }); } continue; }
    const sec = out.find(c => c.n === it.chapter)?.sections[it.section]; if (!sec) continue;
    if (it.kind === "heading") { if (!DELETE.test(v)) { sec.heading = v.replace(/^#+\s*/, ""); applied.push({ id: it.id, kind: it.kind, at, before: it.original, after: sec.heading, source: it.source }); } continue; }
    if (it.kind === "append") { if (!DELETE.test(v)) { sec.paragraphs[it.paragraph] = `${sec.paragraphs[it.paragraph]} ${v}`.trim(); applied.push({ id: it.id, kind: it.kind, at, before: "", after: v, source: it.source }); } continue; }
    const p = sec.paragraphs[it.paragraph] ?? ""; if (!p.includes(it.original) && !p.replace(/[⟪⟫]/g, "").includes(it.original)) continue;
    const marked = p.includes(`⟪${it.original}⟫`);
    const after = DELETE.test(v) ? "" : v.replace(/[⟪⟫]/g, "");
    // 최종 A-9: (삭제)면 바로 뒤 문장이 접속어로 시작하는 고아 문장이 되지 않게 접속어를 뗀다.
    const ss = after ? [] : splitSentences(p), di = ss.findIndex(x => x.replace(/[⟪⟫]/g, "") === it.original.replace(/[⟪⟫]/g, "") || x.replace(/[⟪⟫]/g, "").includes(it.original));
    sec.paragraphs[it.paragraph] = (!after && di >= 0 ? removeSentenceAt(ss, di).sentences.join(" ") : (marked ? p.replace(`⟪${it.original}⟫`, after ? `⟪${after}⟫` : "") : p.replace(it.original, after))).replace(/\s{2,}/g, " ").trim();
    applied.push({ id: it.id, kind: it.kind, at, before: it.original, after, source: it.source });
  }
  return { chapters: out.map(c => ({ ...c, sections: c.sections.map(s => ({ ...s, paragraphs: s.paragraphs.filter(Boolean) })) })), cover, applied };
}

/** 수리 호출 1회(작가 모델). 항목이 없거나 작가가 없으면 그대로. */
export async function repair3Pass(o: WriterOptions, run: WriterRun, sheet: FactSheet, brief: Brief, chapters: readonly FinalChapter[], items: readonly RepairItem[]): Promise<{ run: WriterRun; chapters: FinalChapter[]; cover: string | null; applied: AppliedRepair[]; text: string }> {
  if (!items.length || !run.writer) return { run, chapters: [...chapters], cover: null, applied: [], text: "" };
  const p = repair3Prompt(sheet, brief, chapters, items);
  const maxTokens = repair3MaxTokens(p.chars, items.length, run.writer.model);
  const r = await completeText(o, run, p.system, p.user, maxTokens, "repair");
  const a = applyRepair3(chapters, items, parseRepair3(r.text));
  return { run: r.run, chapters: a.chapters, cover: a.cover, applied: a.applied, text: r.text };
}
export const repair3MaxTokens = (chars: number, items: number, model: string) => Math.min(REPAIR3_MAX_TOKENS, Math.ceil(chars * (MODEL_TOKENS_PER_CHAR[model] ?? 1) * 1.6) + 40 * items + 400);

/** 다음 문장이 앞말(내용)을 가리킨다(지우면 문단이 깨진다). 최종 A-9: 접속어(그래서·하지만 등)는 여기서 빼고, 지운 뒤 접속어만 뗀다(orphan.ts). */
const LEANS = /^(이처럼|이렇게|이런|그런|그 덕분|그만큼|여기에|그 결과|그러다(?! 보니)|그때|이때|이 |그 )/;
/**
 * 최종판3 12: 수리 문장이 재검사(정답지 대조 포함)에 새로 걸리면 그 문장을 수리 전 원문으로 되돌린다(호출 0).
 * 판독: 검수가 음양 2:6을 거꾸로 읽고(오탐) 수리가 맞는 문장을 틀리게 고쳤다. 원문도 걸리는 경우(원래 검사 깃발)는 뒤의 지우기가 처리한다.
 */
export type Reverted = { readonly at: string; readonly after: string; readonly before: string; readonly rule: string };
export function revertWorse(chapters: readonly FinalChapter[], applied: readonly AppliedRepair[], flags: readonly LintFlag[]): { chapters: FinalChapter[]; reverted: Reverted[] } {
  const norm = (s: string) => s.replace(/[^가-힣0-9]/g, "");
  const out = chapters.map(c => ({ ...c, sections: c.sections.map(s => ({ ...s, paragraphs: [...s.paragraphs] })) }));
  const reverted: Reverted[] = [];
  for (const f of flags) {
    if (f.paragraph < 0 || f.card || !f.sentence) continue;
    const fs = norm(f.sentence);
    const a = applied.find(x => x.kind === "sentence" && x.before && x.after && (fs.includes(norm(x.after).slice(0, 24)) || norm(x.after).includes(fs.slice(0, 24))));
    if (!a) continue;
    const sec = out.find(c => c.n === f.chapter)?.sections[f.section]; const p = sec?.paragraphs[f.paragraph]; if (!sec || p === undefined) continue;
    const ss = splitSentences(p), i = ss.findIndex(s => norm(s) === fs || norm(s).includes(fs));
    if (i < 0) continue;
    ss[i] = a.before; (sec.paragraphs as string[])[f.paragraph] = ss.join(" ");
    reverted.push({ at: `${f.chapter}.${f.section}.${f.paragraph}`, after: a.after, before: a.before, rule: f.rule });
  }
  return { chapters: out, reverted };
}
/** 두 문장이 거의 같은 말인가(한글·숫자 두 글자 묶음 겹침 0.6 이상). */
export function nearSame(a: string, b: string): boolean {
  const bi = (s: string) => { const t = s.replace(/[^가-힣0-9]/g, ""); const out = new Set<string>(); for (let i = 0; i + 1 < t.length; i++) out.add(t.slice(i, i + 2)); return out; };
  const x = bi(a), y = bi(b); if (x.size < 6 || y.size < 6) return false;
  let inter = 0; for (const g of x) if (y.has(g)) inter++;
  return inter / (x.size + y.size - inter) >= 0.6;
}
/**
 * AM 판독(4종 14건이 삭제·수리 단계에서 생김): 수리 문장이 같은 문단의 다른 문장과 거의 같은 말이면 그 수리 문장을 뺀다(이웃 문장이 이미 말함),
 * 원문에 없던 시골 소품(「곳간」 등, 문체 규칙이라 revertWorse가 안 봄)을 넣었으면 원문으로 되돌린다(호출 0).
 */
export function revertRepairSideEffects(chapters: readonly FinalChapter[], applied: readonly AppliedRepair[]): { chapters: FinalChapter[]; reverted: Reverted[] } {
  const norm = (s: string) => s.replace(/[^가-힣0-9]/g, "");
  const out = chapters.map(c => ({ ...c, sections: c.sections.map(s => ({ ...s, paragraphs: [...s.paragraphs] })) }));
  const reverted: Reverted[] = [];
  for (const a of applied) {
    if (a.kind !== "sentence" || !a.after) continue;
    const [cn, sn, pn] = a.at.split(".").map(Number);
    const sec = out.find(c => c.n === cn)?.sections[sn]; const p = sec?.paragraphs[pn]; if (!sec || p === undefined) continue;
    const ss = splitSentences(p), key = norm(a.after).slice(0, 24), i = ss.findIndex(s => norm(s).includes(key));
    if (i < 0) continue;
    if (RURAL_PROP.test(a.after) && !RURAL_PROP.test(a.before)) { ss[i] = a.before; reverted.push({ at: a.at, after: a.after, before: a.before, rule: "repair_rural_prop" }); }
    else if (ss.length > 1 && ss.some((s, j) => j !== i && nearSame(s, ss[i]))) { reverted.push({ at: a.at, after: a.after, before: a.before, rule: "repair_duplicate" }); ss.splice(i, 1); }
    else continue;
    (sec.paragraphs as string[])[pn] = ss.join(" ");
  }
  return { chapters: out.map(c => ({ ...c, sections: c.sections.map(s => ({ ...s, paragraphs: s.paragraphs.filter(Boolean) })) })), reverted };
}
export type Deleted = { readonly at: string; readonly sentence: string; readonly rule: string; readonly kept?: "leans" | "last_paragraph"; readonly connectiveStripped?: boolean };
/** 남은 사실·금지 깃발 문장을 지운다. 지우면 문단이 깨지면 원문을 두고 kept로 기록한다. */
export function deleteFlagged(chapters: readonly FinalChapter[], flags: readonly LintFlag[], hard: ReadonlySet<string>): { chapters: FinalChapter[]; deleted: Deleted[] } {
  const out = chapters.map(c => ({ ...c, sections: c.sections.map(s => ({ ...s, paragraphs: [...s.paragraphs] })) }));
  const deleted: Deleted[] = [];
  for (const f of flags) {
    if (!hard.has(f.rule) || f.card || f.paragraph < 0 || !f.sentence) continue;
    const ch = out.find(c => c.n === f.chapter); if (!ch || ch.source === "deterministic") continue;
    const sec = ch.sections[f.section]; const p = sec?.paragraphs[f.paragraph]; if (!sec || p === undefined) continue;
    const ss = splitSentences(p), i = ss.findIndex(x => x.replace(/[⟪⟫]/g, "").includes(f.sentence) || f.sentence.includes(x.replace(/[⟪⟫]/g, "")));
    const at = `${f.chapter}.${f.section}.${f.paragraph}`;
    if (i < 0) continue;
    if (i + 1 < ss.length && LEANS.test(ss[i + 1].replace(/[⟪⟫]/g, ""))) { deleted.push({ at, sentence: f.sentence, rule: f.rule, kept: "leans" }); continue; }
    const { sentences: rest, stripped } = removeSentenceAt(ss, i);
    if (!rest.length && sec.paragraphs.filter(Boolean).length <= 1) { deleted.push({ at, sentence: f.sentence, rule: f.rule, kept: "last_paragraph" }); continue; }
    sec.paragraphs[f.paragraph] = rest.join(" ");
    deleted.push({ at, sentence: f.sentence, rule: f.rule, ...(stripped ? { connectiveStripped: true } : {}) });
  }
  return { chapters: out.map(c => ({ ...c, sections: c.sections.map(s => ({ ...s, paragraphs: s.paragraphs.filter(x => x.trim()) })) })), deleted };
}
