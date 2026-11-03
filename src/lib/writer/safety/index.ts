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
import { FAMILY_MEMBER, RURAL_PROP, splitSentences, tidyHeading } from "./patterns";
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
  readonly remaining: Readonly<Record<string, number>>; readonly removed: number; readonly droppedParagraphs: number; readonly cover: "writer" | "fallback"; readonly cardFlags: readonly string[] };
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
/** shrunk: 문장이 지워져 줄어든 소제목(삭제 후 정리 대상, P3.5 A4). */
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
  const prior = { text: "" }; let merged = 0, backrefFixed = 0;
  const tidy = (sections: readonly BookSection[]) => { const r = fixBackrefs(sections, brief, prior); backrefFixed += r.fixed; return r.sections; };
  const chapters = plan.map((ch): FinalChapter => {
    const draft = drafts.get(ch.n);
    const det = (reason: string, keys?: readonly string[]): BookSection[] => filterSections(writeDeterministicChapter(brief, ch, { ...(keys ? { keys } : {}), avoid: seen }).sections, f, ch.n, deletions, Boolean(ch.keys), ANY_WINDOW, seen, ch.title, undefined, replacements);
    if (ch.keys) {
      const have = draft ? keyedSections(filterSections(draft.chapter.sections, f, ch.n, deletions, true, allowed, seen, ch.title, undefined, replacements), ch.keys) : new Map<string, BookSection>();
      const missing = ch.keys.filter(k => !have.get(k)?.paragraphs.length);
      if (missing.length) for (const s of det("keys", missing)) have.set(s.heading, s);
      // 세기 주장 대조(E-11): 어긋난 "가장 ~한 달·해" 문장을 지운다.
      for (const [key, sec] of have) {
        const bad = intensityViolations(brief, key, sec.paragraphs.join(" "));
        if (bad.length) { for (const b of bad) deletions.push({ chapter: ch.n, rule: "intensity_mismatch", sentence: b }); have.set(key, { ...sec, paragraphs: sec.paragraphs.map(p => bad.reduce((x, b) => x.replace(b, ""), p).replace(/ {2,}/g, " ").trim()).filter(Boolean) }); }
      }
      const sections = tidy(ch.keys.map(k => have.get(k) ?? { heading: k, paragraphs: [] }));
      const source: ChapterSource = !draft || missing.length === ch.keys.length ? "deterministic" : draft.source;
      const reason = !draft ? "missing" : missing.length ? `keys_filled:${missing.join(",")}` : undefined;
      sections.forEach(s => { warnings.push(...styleWarnings(ch.n, s.paragraphs, terms, introduced)); warnings.push(...glossaryWarnings(ch.n, s.paragraphs, introduced)); });
      return { n: ch.n, id: ch.id, title: ch.title, sections, source, ...(reason ? { reason } : {}), chars: sections.reduce((a, s) => a + s.paragraphs.join("").length, 0), keys: ch.keys };
    }
    const shrunk = new Set<BookSection>();
    let sections = draft ? filterSections(draft.chapter.sections, f, ch.n, deletions, false, allowed, seen, ch.title, shrunk, replacements) : [];
    if (draft) { const m = mergeShrunk(sections, shrunk); sections = m.sections; merged += m.merged; }
    let source: ChapterSource = draft?.source ?? "deterministic";
    let reason: string | undefined = draft ? undefined : "missing";
    const min = Math.round(ch.targetChars[0] * MIN_CHAPTER_RATIO);
    const chars = chapterChars({ n: ch.n, title: "", sections });
    if (draft && chars < min) { reason = `too_short:${chars}<${min}`; source = "deterministic"; sections = []; }
    if (!sections.length) { sections = det(reason ?? "empty"); source = "deterministic"; reason ??= "empty"; }
    sections = tidy(sections);
    sections.forEach(s => { warnings.push(...styleWarnings(ch.n, s.paragraphs, terms, introduced)); warnings.push(...glossaryWarnings(ch.n, s.paragraphs, introduced)); });
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
