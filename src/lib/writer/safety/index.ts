/**
 * 안전망(P3 D, 결정론·호출 0). 문장 검사 → 장 검사(장 수·순서, 분량 50% 미만 교체(P6b: 60%→50%), 반복 장 키 누락 보충) → 장별 source·사유 기록.
 * 결정론 작가가 쓴 장도 같은 문장 검사를 거친다.
 */
import type { Brief } from "@/lib/brief/schema";
import { writeDeterministicChapter } from "../deterministic";
import { chapterChars, type BookChapter, type BookSection, type ChapterSource } from "../format";
import type { WriterChapter } from "../prompt";
import { briefCopyMetric, connectorRepeats, infoRepeats, p6bMetric, traitMentions, type BriefCopyMetric, type ConnectorRepeat, type InfoRepeatMetric, type P6bMetric, type TraitUseMetric } from "./metrics";
import { allowedWindows, filterParagraph, sentenceViolation, styleWarnings, type Deletion, type Replacement, type SafetyFacts, type StyleWarning } from "./sentences";
import { glossaryWarnings } from "./terms";
import { FAMILY_MEMBER, isPastAssertion, RURAL_PROP, softenExperience, splitSentences, tidyHeading, tidyText } from "./patterns";
import { fixBackrefs, mergeShrunk } from "./tidy";

export { OLD_NEGATIVE, isPastAssertion, splitSentences } from "./patterns";
export { sentenceViolation, copiesExample, type SafetyFacts, type Deletion, type Replacement, type StyleWarning } from "./sentences";
import { norm } from "./sentences";

/**
 * 장 분량이 목표 하한의 이 비율 미만이면 결정론 작가로 교체한다.
 * P6b: 60%에서 50%로. 절 단위 목표에서 실호출 4번이 60%를 1~7자 차이로 못 넘어 온전한 작가 원고가 결정론 장으로 바뀌었다(539<540, 731<738 등).
 */
export const MIN_CHAPTER_RATIO = 0.5;

export type DraftChapter = { readonly chapter: BookChapter; readonly source: Exclude<ChapterSource, "deterministic"> };
export type FinalChapter = { readonly n: number; readonly id: string; readonly title: string; readonly sections: readonly BookSection[]; readonly source: ChapterSource; readonly reason?: string; readonly chars: number; readonly keys?: readonly string[] };
/** props: 브리프 usedProps 소품이 본문에 나온 장 수(P3.6 A1). experience: 경험 단정 바꿈·지움 수(P3.6 A6). */
/** traitUse: 원고의 trait 언급(소개·적용)·장 안 중복·같은 축 중복(P3.8 1, 참고용). infoRepeats: 같은 정보(주장·장면·처방) 반복(P6 반복의 정의). */
/** p6c(P6c): 결정론 정리 수, 수리 전 검사 결과(규칙별), 수리 대상·적용·호출 수, 재요청 장, 수리 뒤 남은 것(지운 문장·뺀 문단), 표지 출처, 대체한 카드 줄. */
export type P6cMetric = { readonly tidy: { readonly prefix: number; readonly mbtiCode: number; readonly monthNow: number; readonly keyMarks: number }; readonly flags: Readonly<Record<string, number>>;
  readonly repairTargets: number; readonly repaired: number; readonly repairCalls: number; readonly redoCalls: number; readonly redoChapters: readonly number[];
  readonly remaining: Readonly<Record<string, number>>; readonly removed: number; readonly droppedParagraphs: number; readonly cover: "writer" | "fallback" | "core"; readonly cardFlags: readonly string[];
  /** P6d B: 수리 뒤에도 사실·금지 규칙에 걸려 문단째 뺀 자리와 규칙·문장(진단용). */
  readonly dropped?: readonly { readonly at: string; readonly rule: string; readonly detail?: string; readonly sentence: string }[];
  /** P6e 2: 소제목 재작성(대상·적용·호출 수)과 재작성 뒤에도 걸려 통째로 뺀 소제목(자리·소제목·규칙·걸린 문장). */
  readonly rewriteTargets?: number; readonly rewritten?: number; readonly rewriteCalls?: number;
  readonly droppedSections?: readonly { readonly at: string; readonly heading: string; readonly rules: readonly string[]; readonly sentences: readonly string[] }[];
  /** P6e 7: 작가 출력에서 지운 한자 수(경고)·렌더 단계가 붙인 용어 표기 수. */
  readonly hanjaStripped?: number; readonly termsAnnotated?: number;
  /** P6e 15: 수리 뒤에도 남아 뗀 작가 안내 문장·떼지 못한 것. */
  readonly noticesRemoved?: readonly string[]; readonly noticesKept?: readonly string[] };
export type SafetyMetrics = { readonly briefCopy: BriefCopyMetric; readonly connectors: readonly ConnectorRepeat[]; readonly merged: number; readonly backrefFixed: number; readonly props?: Readonly<Record<string, number>>; readonly experience?: { readonly replaced: number; readonly deleted: number }; readonly traitUse?: TraitUseMetric; readonly infoRepeats?: InfoRepeatMetric; readonly p6b?: P6bMetric; readonly p6c?: P6cMetric };
export type SafetyReport = { readonly deletions: readonly Deletion[]; readonly warnings: readonly StyleWarning[]; readonly replacements?: readonly Replacement[]; readonly metrics?: SafetyMetrics };
/** 같은 소품이 본문에 나와도 되는 장 수(P3.6 A1). */
export const MAX_PROP_CHAPTERS = 2;

/** 결정론 작가는 문체 예시를 보지 않으므로 예시 복사 검사를 하지 않는다(틀 문장이 DB 비유와 우연히 겹치는 오탐 방지). */
const ANY_WINDOW: ReadonlySet<string> = { has: () => true } as unknown as ReadonlySet<string>;

export function safetyFacts(brief: Brief): SafetyFacts {
  const f = brief.person.facts;
  // 그림 별명은 띄어쓰기가 있는 것만 지운다("말 안장"): 한 낱말 별명("꽃길")은 일상어와 겹친다(P6b B-2).
  const nicknames = [...new Set([...brief.traits.map(t => t.easyName), ...brief.fortunes.map(x => x.easyName), ...brief.unused.map(x => x.easyName)].filter(n => n.includes(" ")))];
  return { birthTimeKnown: f.birthTimeKnown, mbti: f.mbti, relationship: f.relationship, children: f.children, job: f.job.class, nicknames,
    ...(brief.compatibility ? { compat: { score: brief.compatibility.score.value, band: brief.compatibility.score.band.label }, familyOk: brief.compatibility.relationshipType === "parentChild" } : {}) };
}

/**
 * 세기 주장(P6b E-11): "가장 거센/센/강한 달·해"는 흐름 점수가 가장 높은 항목에서만, "가장 조용한/약한"은 가장 낮은 항목에서만.
 * 반복 장(대운 연도·세운 월)의 key 본문을 엔진 흐름 점수(card.flow.score)와 대조해 어긋난 문장을 지운다.
 */
const PEAK = /가장 (거센|센|강한|뜨거운|크게 움직이는|큰|좋은|활발한|바쁜)( [가-힣]+)? ?(달|해|때|시기)/;
const LOW = /가장 (조용한|약한|잔잔한|느린|차분한|한가한)( [가-힣]+)? ?(달|해|때|시기)/;
export function intensityViolations(brief: Brief, key: string, text: string): string[] {
  const entries = (brief.timeline?.entries ?? []).filter(e => e.kind === (key.includes("-M") ? "month" : "year"));
  const me = entries.find(e => e.key === key); if (!me || entries.length < 2) return [];
  const max = Math.max(...entries.map(e => e.flow.score)), min = Math.min(...entries.map(e => e.flow.score));
  return splitSentences(text).filter(s => (PEAK.test(s) && me.flow.score < max) || (LOW.test(s) && me.flow.score > min));
}

const CONDITIONAL_TITLE = /(된다면|되면|한다면)$/;
/**
 * 작가 원고 정리(P6d B): 문장을 지우지 않는다. 뜻을 바꾸지 않는 정리(tidyText·소제목 다듬기)와 경험 단정의 경향형 바꿈(기록)만 하고,
 * 규칙에 걸린 문장은 lintBook이 문단째 수리로 보낸다(수리 뒤에도 사실·금지 규칙이면 문단째 뺀다). 문장 삭제는 조각 문장을 남겼다("하는 물음이 자주 올라와요").
 */
function tidySections(sections: readonly BookSection[], n: number, replacements: Replacement[]): BookSection[] {
  return sections.map(s => ({ heading: tidyHeading(s.heading), paragraphs: s.paragraphs.map(p => softenParagraph(tidyText(p), n, replacements)).filter(Boolean), ...(s.card ? { card: s.card } : {}) })).filter(s => s.paragraphs.length);
}
function softenParagraph(p: string, n: number, replacements: Replacement[]): string {
  let out = p;
  for (const s of splitSentences(p)) if (isPastAssertion(s)) { const soft = softenExperience(s); if (soft && soft !== s) { replacements.push({ chapter: n, rule: "experience_assert", from: s, to: soft }); out = out.replace(s, soft); } }
  return out;
}
/** 결정론 작가 장(호출 0): 지식 DB 문장을 고를 때 규칙에 걸린 문장은 처음부터 고르지 않는다(ok). 쓴 뒤에 지우지 않는다. */
function filterSections(sections: readonly BookSection[], f: SafetyFacts, n: number, deletions: Deletion[], keyed: boolean, allowed: ReadonlySet<string>, seen: Set<string>, title = "", shrunk?: Set<BookSection>, replacements?: Replacement[]): BookSection[] {
  const cond = CONDITIONAL_TITLE.test(title.trim());
  return sections.map(s => {
    const headingBad = !keyed && s.heading && sentenceViolation(s.heading, f, allowed, cond);
    if (headingBad) deletions.push({ chapter: n, rule: headingBad, sentence: `### ${s.heading}` });
    const before = deletions.length;
    const out = { heading: headingBad ? "" : tidyHeading(s.heading), paragraphs: s.paragraphs.map(p => filterParagraph(p, f, n, deletions, allowed, seen, cond, replacements)).filter(Boolean), ...(s.card ? { card: s.card } : {}) };
    if (deletions.length > before) shrunk?.add(out);
    return out;
  }).filter(s => s.paragraphs.length);
}

/** 반복 장: 머리글을 key로 맞춘다("2026년"·"2026 ·" 같은 변형 허용). key가 아닌 소제목은 버린다. */
function keyedSections(sections: readonly BookSection[], keys: readonly string[]): Map<string, BookSection> {
  const out = new Map<string, BookSection>();
  for (const s of sections) {
    const key = keys.find(k => s.heading.trim() === k) ?? keys.find(k => s.heading.includes(k));
    if (key && !out.has(key)) out.set(key, { heading: key, paragraphs: s.paragraphs, ...(s.card ? { card: s.card } : {}) });
  }
  return out;
}

/** priorSentences: 같은 고객의 이전 Book 문장(P6b E-1). 같은 문장(20자 이상)이 이번 책에 나오면 지운다. */
export function applySafetyNet(brief: Brief, plan: readonly WriterChapter[], drafts: ReadonlyMap<number, DraftChapter>, opts: { priorSentences?: readonly string[] } = {}): { chapters: FinalChapter[]; report: SafetyReport } {
  const f = safetyFacts(brief);
  const allowed = allowedWindows(JSON.stringify(brief));
  const seen = new Set<string>(); // 책 전체 같은 문장(장 순서대로 먼저 나온 것만 남긴다)
  for (const s of opts.priorSentences ?? []) { const key = norm(s); if (key.length >= 20) seen.add(key); }
  const deletions: Deletion[] = [], warnings: StyleWarning[] = [], replacements: Replacement[] = [];
  const terms = [...new Set(brief.traits.map(t => t.name.replace(/\s*\(.*$/, "").replace(/[一-鿿]/g, "").trim()).filter(t => t.length >= 2))];
  const introduced = new Set<string>();
  const prior = { text: "" }; const merged = 0; let backrefFixed = 0;
  // 앞 장들의 문장 전부(짧은 문장 포함): 결정론 장이 같은 말·거의 같은 말을 되풀이하지 않게 넘긴다(P6c I).
  const bookSentences: string[] = [];
  const remember = (sections: readonly BookSection[]) => { for (const s of sections) for (const p of s.paragraphs) bookSentences.push(...splitSentences(p)); };
  const tidy = (sections: readonly BookSection[]) => { const r = fixBackrefs(sections, brief, prior); backrefFixed += r.fixed; return r.sections; };
  const chapters = plan.map((ch): FinalChapter => {
    const draft = drafts.get(ch.n);
    const cond = CONDITIONAL_TITLE.test(ch.title.trim());
    const ok = (s: string) => !sentenceViolation(s, f, ANY_WINDOW, cond) && !isPastAssertion(s);
    const det = (reason: string, keys?: readonly string[]): BookSection[] => filterSections(writeDeterministicChapter(brief, ch, { ...(keys ? { keys } : {}), avoid: seen, prior: bookSentences, ok }).sections, f, ch.n, deletions, Boolean(ch.keys), ANY_WINDOW, seen, ch.title, undefined, replacements);
    if (ch.keys) {
      const have = draft ? keyedSections(tidySections(draft.chapter.sections, ch.n, replacements), ch.keys) : new Map<string, BookSection>();
      const missing = ch.keys.filter(k => !have.get(k)?.paragraphs.length);
      if (missing.length) for (const s of det("keys", missing)) have.set(s.heading, s);
      // 세기 주장 대조(E-11)는 lintBook(intensity_claim)이 수리로 보낸다(P6d B: 지우지 않는다).
      const sections = tidy(ch.keys.map(k => have.get(k) ?? { heading: k, paragraphs: [] }));
      const source: ChapterSource = !draft || missing.length === ch.keys.length ? "deterministic" : draft.source;
      const reason = !draft ? "missing" : missing.length ? `keys_filled:${missing.join(",")}` : undefined;
      sections.forEach(s => { warnings.push(...styleWarnings(ch.n, s.paragraphs, terms, introduced)); warnings.push(...glossaryWarnings(ch.n, s.paragraphs, introduced)); });
      remember(sections);
      return { n: ch.n, id: ch.id, title: ch.title, sections, source, ...(reason ? { reason } : {}), chars: sections.reduce((a, s) => a + s.paragraphs.join("").length, 0), keys: ch.keys };
    }
    let sections = draft ? tidySections(draft.chapter.sections, ch.n, replacements) : [];
    void allowed; void mergeShrunk;
    let source: ChapterSource = draft?.source ?? "deterministic";
    let reason: string | undefined = draft ? undefined : "missing";
    const min = Math.round(ch.targetChars[0] * MIN_CHAPTER_RATIO);
    const chars = chapterChars({ n: ch.n, title: "", sections });
    if (draft && chars < min) { reason = `too_short:${chars}<${min}`; source = "deterministic"; sections = []; }
    if (!sections.length) { sections = det(reason ?? "empty"); source = "deterministic"; reason ??= "empty"; }
    sections = tidy(sections);
    sections.forEach(s => { warnings.push(...styleWarnings(ch.n, s.paragraphs, terms, introduced)); warnings.push(...glossaryWarnings(ch.n, s.paragraphs, introduced)); });
    remember(sections);
    return { n: ch.n, id: ch.id, title: ch.title, sections, source, ...(reason ? { reason } : {}), chars: chapterChars({ n: ch.n, title: "", sections }) };
  });
  // 책 단위 소품 사용(P3.6 A1): 힌트로 준 소품이 본문 몇 장에 나왔는지. 2장 초과는 경고.
  const props: Record<string, number> = {};
  for (const prop of Object.keys(brief.usedProps ?? {})) {
    props[prop] = chapters.filter(c => c.sections.some(s => s.paragraphs.some(p => p.includes(prop)))).length;
    if (props[prop] > MAX_PROP_CHAPTERS) warnings.push({ chapter: 0, kind: "prop_overuse", text: `${prop}×${props[prop]}` });
  }
  const experience = { replaced: replacements.length, deleted: deletions.filter(d => d.rule === "experience_assert").length };
  const traitUse = traitMentions(brief, chapters);
  for (const w of traitUse.warnings) warnings.push({ chapter: 0, kind: "trait_repeat", text: w });
  const info = infoRepeats(brief, chapters);
  for (const r of info.pairs) warnings.push({ chapter: Number(r.at[1].split(".")[0]), kind: "info_repeat", text: `${r.kind} ${r.at.join("~")}: ${r.b}` });
  return { chapters, report: { deletions, warnings, replacements, metrics: { briefCopy: briefCopyMetric(brief, chapters), connectors: connectorRepeats(chapters), merged, backrefFixed, props, experience, traitUse, infoRepeats: info,
    p6b: p6bMetric(brief, chapters, [RURAL_PROP, ...(f.familyOk ? [] : [FAMILY_MEMBER]), /배지|제시되지 않/, /\*\*/]) } } };
}

export { allowedWindows } from "./sentences";
/**
 * 수리 뒤 문단을 다 뺀 key(P6d B): 그 key만 결정론 문단으로 채운다(규칙에 걸리는 지식 DB 문장은 고르지 않는다). 다른 장은 건드리지 않는다.
 */
export function writeKeyFill(brief: Brief, plan: readonly WriterChapter[], chapters: readonly FinalChapter[], empty: readonly { chapter: number; key: string }[]): FinalChapter[] {
  const f = safetyFacts(brief);
  const ok = (s: string) => !sentenceViolation(s, f, ANY_WINDOW) && !isPastAssertion(s);
  const prior = chapters.flatMap(c => c.sections.flatMap(s => s.paragraphs.flatMap(p => splitSentences(p))));
  return chapters.map(c => {
    // 소제목이 하나도 남지 않은 장은 장 전체를 결정론으로(빈 장 금지).
    if (!c.keys && !c.sections.some(s => s.paragraphs.length)) { const ch = plan.find(p => p.n === c.n); if (!ch) return c; const sections = writeDeterministicChapter(brief, ch, { prior, ok }).sections; return { ...c, sections, source: "deterministic" as const, reason: [c.reason, "emptied"].filter(Boolean).join(";"), chars: sections.reduce((a, s) => a + s.paragraphs.join("").length, 0) }; }
    const keys = empty.filter(e => e.chapter === c.n).map(e => e.key); const ch = plan.find(p => p.n === c.n);
    if (!keys.length || !ch) return c;
    const fill = new Map(writeDeterministicChapter(brief, ch, { keys, prior, ok }).sections.map(s => [s.heading, s]));
    const sections = c.sections.map(s => keys.includes(s.heading) && !s.paragraphs.length ? { ...s, paragraphs: fill.get(s.heading)?.paragraphs ?? [] } : s);
    return { ...c, sections, source: c.source, reason: [c.reason, `keys_filled:${keys.join(",")}`].filter(Boolean).join(";"), chars: sections.reduce((a, s) => a + s.paragraphs.join("").length, 0) };
  });
}
