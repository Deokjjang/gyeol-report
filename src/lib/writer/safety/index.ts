/**
 * 안전망(P3 D, 결정론·호출 0). 문장 검사 → 장 검사(장 수·순서, 분량 60% 미만 교체, 반복 장 키 누락 보충) → 장별 source·사유 기록.
 * 결정론 작가가 쓴 장도 같은 문장 검사를 거친다.
 */
import type { Brief } from "@/lib/brief/schema";
import { writeDeterministicChapter } from "../deterministic";
import { chapterChars, type BookChapter, type BookSection, type ChapterSource } from "../format";
import type { WriterChapter } from "../prompt";
import { briefCopyMetric, connectorRepeats, traitMentions, type BriefCopyMetric, type ConnectorRepeat, type TraitUseMetric } from "./metrics";
import { allowedWindows, filterParagraph, sentenceViolation, styleWarnings, type Deletion, type Replacement, type SafetyFacts, type StyleWarning } from "./sentences";
import { glossaryWarnings } from "./terms";
import { fixBackrefs, mergeShrunk } from "./tidy";

export { OLD_NEGATIVE, isPastAssertion, splitSentences } from "./patterns";
export { sentenceViolation, copiesExample, type SafetyFacts, type Deletion, type Replacement, type StyleWarning } from "./sentences";

/** 장 분량이 목표 하한의 이 비율 미만이면 결정론 작가로 교체한다. */
export const MIN_CHAPTER_RATIO = 0.6;

export type DraftChapter = { readonly chapter: BookChapter; readonly source: Exclude<ChapterSource, "deterministic"> };
export type FinalChapter = { readonly n: number; readonly id: string; readonly title: string; readonly sections: readonly BookSection[]; readonly source: ChapterSource; readonly reason?: string; readonly chars: number; readonly keys?: readonly string[] };
/** props: 브리프 usedProps 소품이 본문에 나온 장 수(P3.6 A1). experience: 경험 단정 바꿈·지움 수(P3.6 A6). */
/** traitUse: 원고의 trait 언급(소개·적용)·장 안 중복·같은 축 중복(P3.8 1). */
export type SafetyMetrics = { readonly briefCopy: BriefCopyMetric; readonly connectors: readonly ConnectorRepeat[]; readonly merged: number; readonly backrefFixed: number; readonly props?: Readonly<Record<string, number>>; readonly experience?: { readonly replaced: number; readonly deleted: number }; readonly traitUse?: TraitUseMetric };
export type SafetyReport = { readonly deletions: readonly Deletion[]; readonly warnings: readonly StyleWarning[]; readonly replacements?: readonly Replacement[]; readonly metrics?: SafetyMetrics };
/** 같은 소품이 본문에 나와도 되는 장 수(P3.6 A1). */
export const MAX_PROP_CHAPTERS = 2;

/** 결정론 작가는 문체 예시를 보지 않으므로 예시 복사 검사를 하지 않는다(틀 문장이 DB 비유와 우연히 겹치는 오탐 방지). */
const ANY_WINDOW: ReadonlySet<string> = { has: () => true } as unknown as ReadonlySet<string>;

export function safetyFacts(brief: Brief): SafetyFacts {
  const f = brief.person.facts;
  return { birthTimeKnown: f.birthTimeKnown, mbti: f.mbti, relationship: f.relationship, children: f.children, job: f.job.class, ...(brief.compatibility ? { compat: { score: brief.compatibility.score.value, band: brief.compatibility.score.band.label } } : {}) };
}

const CONDITIONAL_TITLE = /(된다면|되면|한다면)$/;
/** shrunk: 문장이 지워져 줄어든 소제목(삭제 후 정리 대상, P3.5 A4). */
function filterSections(sections: readonly BookSection[], f: SafetyFacts, n: number, deletions: Deletion[], keyed: boolean, allowed: ReadonlySet<string>, seen: Set<string>, title = "", shrunk?: Set<BookSection>, replacements?: Replacement[]): BookSection[] {
  const cond = CONDITIONAL_TITLE.test(title.trim());
  return sections.map(s => {
    const headingBad = !keyed && s.heading && sentenceViolation(s.heading, f, allowed, cond);
    if (headingBad) deletions.push({ chapter: n, rule: headingBad, sentence: `### ${s.heading}` });
    const before = deletions.length;
    const out = { heading: headingBad ? "" : s.heading, paragraphs: s.paragraphs.map(p => filterParagraph(p, f, n, deletions, allowed, seen, cond, replacements)).filter(Boolean) };
    if (deletions.length > before) shrunk?.add(out);
    return out;
  }).filter(s => s.paragraphs.length);
}

/** 반복 장: 머리글을 key로 맞춘다("2026년"·"2026 ·" 같은 변형 허용). key가 아닌 소제목은 버린다. */
function keyedSections(sections: readonly BookSection[], keys: readonly string[]): Map<string, BookSection> {
  const out = new Map<string, BookSection>();
  for (const s of sections) {
    const key = keys.find(k => s.heading.trim() === k) ?? keys.find(k => s.heading.includes(k));
    if (key && !out.has(key)) out.set(key, { heading: key, paragraphs: s.paragraphs });
  }
  return out;
}

export function applySafetyNet(brief: Brief, plan: readonly WriterChapter[], drafts: ReadonlyMap<number, DraftChapter>): { chapters: FinalChapter[]; report: SafetyReport } {
  const f = safetyFacts(brief);
  const allowed = allowedWindows(JSON.stringify(brief));
  const seen = new Set<string>(); // 책 전체 같은 문장(장 순서대로 먼저 나온 것만 남긴다)
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
  return { chapters, report: { deletions, warnings, replacements, metrics: { briefCopy: briefCopyMetric(brief, chapters), connectors: connectorRepeats(chapters), merged, backrefFixed, props, experience, traitUse } } };
}
