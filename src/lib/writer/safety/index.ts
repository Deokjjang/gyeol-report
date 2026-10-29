/**
 * 안전망(P3 D, 결정론·호출 0). 문장 검사 → 장 검사(장 수·순서, 분량 60% 미만 교체, 반복 장 키 누락 보충) → 장별 source·사유 기록.
 * 결정론 작가가 쓴 장도 같은 문장 검사를 거친다.
 */
import type { Brief } from "@/lib/brief/schema";
import { writeDeterministicChapter } from "../deterministic";
import { chapterChars, type BookChapter, type BookSection, type ChapterSource } from "../format";
import type { WriterChapter } from "../prompt";
import { allowedWindows, filterParagraph, sentenceViolation, styleWarnings, type Deletion, type SafetyFacts, type StyleWarning } from "./sentences";

export { OLD_NEGATIVE, isPastAssertion, splitSentences } from "./patterns";
export { sentenceViolation, copiesExample, type SafetyFacts, type Deletion, type StyleWarning } from "./sentences";

/** 장 분량이 목표 하한의 이 비율 미만이면 결정론 작가로 교체한다. */
export const MIN_CHAPTER_RATIO = 0.6;

export type DraftChapter = { readonly chapter: BookChapter; readonly source: Exclude<ChapterSource, "deterministic"> };
export type FinalChapter = { readonly n: number; readonly id: string; readonly title: string; readonly sections: readonly BookSection[]; readonly source: ChapterSource; readonly reason?: string; readonly chars: number; readonly keys?: readonly string[] };
export type SafetyReport = { readonly deletions: readonly Deletion[]; readonly warnings: readonly StyleWarning[] };

/** 결정론 작가는 문체 예시를 보지 않으므로 예시 복사 검사를 하지 않는다(틀 문장이 DB 비유와 우연히 겹치는 오탐 방지). */
const ANY_WINDOW: ReadonlySet<string> = { has: () => true } as unknown as ReadonlySet<string>;

export function safetyFacts(brief: Brief): SafetyFacts {
  const f = brief.person.facts;
  return { birthTimeKnown: f.birthTimeKnown, mbti: f.mbti, relationship: f.relationship, children: f.children, job: f.job.class };
}

function filterSections(sections: readonly BookSection[], f: SafetyFacts, n: number, deletions: Deletion[], keyed: boolean, allowed: ReadonlySet<string>): BookSection[] {
  return sections.map(s => {
    const headingBad = !keyed && s.heading && sentenceViolation(s.heading, f, allowed);
    if (headingBad) deletions.push({ chapter: n, rule: headingBad, sentence: `### ${s.heading}` });
    return { heading: headingBad ? "" : s.heading, paragraphs: s.paragraphs.map(p => filterParagraph(p, f, n, deletions, allowed)).filter(Boolean) };
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
  const deletions: Deletion[] = [], warnings: StyleWarning[] = [];
  const terms = [...new Set(brief.traits.map(t => t.name.replace(/\s*\(.*$/, "").replace(/[一-鿿]/g, "").trim()).filter(t => t.length >= 2))];
  const introduced = new Set<string>();
  const chapters = plan.map((ch): FinalChapter => {
    const draft = drafts.get(ch.n);
    const det = (reason: string, keys?: readonly string[]): BookSection[] => filterSections(writeDeterministicChapter(brief, ch, keys ? { keys } : {}).sections, f, ch.n, deletions, Boolean(ch.keys), ANY_WINDOW);
    if (ch.keys) {
      const have = draft ? keyedSections(filterSections(draft.chapter.sections, f, ch.n, deletions, true, allowed), ch.keys) : new Map<string, BookSection>();
      const missing = ch.keys.filter(k => !have.get(k)?.paragraphs.length);
      if (missing.length) for (const s of det("keys", missing)) have.set(s.heading, s);
      const sections = ch.keys.map(k => have.get(k) ?? { heading: k, paragraphs: [] });
      const source: ChapterSource = !draft || missing.length === ch.keys.length ? "deterministic" : draft.source;
      const reason = !draft ? "missing" : missing.length ? `keys_filled:${missing.join(",")}` : undefined;
      sections.forEach(s => warnings.push(...styleWarnings(ch.n, s.paragraphs, terms, introduced)));
      return { n: ch.n, id: ch.id, title: ch.title, sections, source, ...(reason ? { reason } : {}), chars: sections.reduce((a, s) => a + s.paragraphs.join("").length, 0), keys: ch.keys };
    }
    let sections = draft ? filterSections(draft.chapter.sections, f, ch.n, deletions, false, allowed) : [];
    let source: ChapterSource = draft?.source ?? "deterministic";
    let reason: string | undefined = draft ? undefined : "missing";
    const min = Math.round(ch.targetChars[0] * MIN_CHAPTER_RATIO);
    const chars = chapterChars({ n: ch.n, title: "", sections });
    if (draft && chars < min) { reason = `too_short:${chars}<${min}`; source = "deterministic"; sections = []; }
    if (!sections.length) { sections = det(reason ?? "empty"); source = "deterministic"; reason ??= "empty"; }
    sections.forEach(s => warnings.push(...styleWarnings(ch.n, s.paragraphs, terms, introduced)));
    return { n: ch.n, id: ch.id, title: ch.title, sections, source, ...(reason ? { reason } : {}), chars: chapterChars({ n: ch.n, title: "", sections }) };
  });
  return { chapters, report: { deletions, warnings } };
}
