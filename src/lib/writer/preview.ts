/**
 * AM 4부 「먼저 읽기」(덕짱님 결정 2026-11-11: 결정론 검사 뒤 공개). 작가 스트림에서 장이 저장될 때 호출 0으로 정리(tidy)·검사(lint)를 돌려,
 * 사실·금지 규칙(HARD_RULES)에 걸린 문장은 가린 미리보기를 장 원고와 함께 저장한다. 책이 완성되면 화면은 최종본(검수·수리·렌더 뒤)으로 바꿔 끼운다.
 * 미리보기는 저장 원고(작가 원문)를 바꾸지 않는다 — 발행 경로(검사 → 수리 → 발행)는 그대로다.
 */
import type { WriterChapter } from "./prompt";
import type { SavedChapter } from "./runner";
import type { FinalChapter } from "./safety";
import { HARD_RULES, lintBook, tidyBook, type LintCtx } from "./safety/p6c";
import { splitSentences } from "./safety/patterns";

export type ChapterPreview = {
  readonly n: number; readonly title: string;
  readonly sections: readonly { readonly heading: string; readonly paragraphs: readonly string[] }[];
  /** 가린 문장 수(사실·금지 규칙). */
  readonly hidden: number;
};

const strip = (s: string) => s.replace(/[⟪⟫]/g, "");

export function chapterPreview(c: SavedChapter, ctx: LintCtx, plan?: WriterChapter): ChapterPreview {
  const fc: FinalChapter = { n: c.n, id: plan?.id ?? String(c.n), title: c.chapter.title, source: "writer", chars: 0,
    sections: c.chapter.sections.map(s => ({ heading: s.heading, paragraphs: [...s.paragraphs] })), ...(plan?.keys?.length ? { keys: plan.keys } : {}) };
  const tidied = tidyBook([fc], ctx).chapters[0] ?? fc;
  const hard = lintBook([tidied], ctx).filter(f => HARD_RULES.has(f.rule) && f.paragraph >= 0 && !f.card);
  const hide = new Set(hard.map(f => `${f.section}.${f.paragraph}|${strip(f.sentence)}`));
  let hidden = 0;
  const sections = tidied.sections.map((s, si) => ({
    heading: strip(s.heading),
    paragraphs: s.paragraphs.map((p, pi) => splitSentences(p).filter(x => { const drop = hide.has(`${si}.${pi}|${strip(x)}`); if (drop) hidden++; return !drop; }).map(strip).join(" ")).filter(Boolean),
  })).filter(s => s.paragraphs.length);
  return { n: c.n, title: tidied.title, sections, hidden };
}
