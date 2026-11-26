/**
 * ZW-2 5부 — 자미 책 원고 검사(생성 중 · 결정론 · 호출 0). 깃발마다 갈래(오류 관문 ①): fact(엔진 값 틀림) · input(입력 상태) · memo(작성 메모 · 내부 말) ·
 * broken(읽을 수 없는 문장) · future(확정 예언) · health(건강 단정). 갈래가 있는 깃발이 차단 — 걸린 문단을 한 번 교체하고, 그래도 남으면 그 문장을 지운다.
 * 갈래 없는 깃발(style)은 기록만.
 */
import type { FinalChapter } from "../safety";
import type { ZiweiBrief } from "@/lib/ziwei/brief";
import type { ZiweiDesign } from "@/lib/ziwei/design";
import type { Intake } from "./intake";

export type ZBranch = "fact" | "input" | "memo" | "broken" | "future" | "health";
export type ZFlag = { readonly chapter: number; readonly section: number; readonly paragraph: number; readonly rule: string; readonly sentence: string; readonly detail: string; readonly branch: ZBranch | null };
export type ZCheckCtx = { readonly brief: ZiweiBrief; readonly design: ZiweiDesign; readonly intake: Intake };
export const splitZ = (t: string) => t.split(/(?<=[.!?])\s+/).map(s => s.trim()).filter(Boolean);

/** 형식 검사(장 · 소제목 수 · 빈 문단). 주장 검사는 5부 claims(아래 ZIWEI_CHECKS)에 더한다. */
function structure(chs: readonly FinalChapter[], c: ZCheckCtx): ZFlag[] {
  const out: ZFlag[] = [];
  for (const d of c.design.chapters) {
    const ch = chs.find(x => x.n === d.n);
    if (!ch || !ch.sections.length) { out.push({ chapter: d.n, section: -1, paragraph: -1, rule: "chapter_missing", sentence: "", detail: `${d.n}장이 비었다`, branch: "broken" }); continue; }
    if (ch.sections.length !== d.sections.length) out.push({ chapter: d.n, section: -1, paragraph: -1, rule: "section_count", sentence: "", detail: `소제목 ${ch.sections.length}/${d.sections.length}`, branch: null });
    ch.sections.forEach((s, si) => { if (!s.paragraphs.length) out.push({ chapter: d.n, section: si, paragraph: -1, rule: "section_empty", sentence: "", detail: "빈 소제목", branch: "broken" }); });
  }
  return out;
}
export type ZCheck = (chs: readonly FinalChapter[], c: ZCheckCtx) => ZFlag[];
/** 5부가 채우는 주장 검사 목록. */
export const ZIWEI_CHECKS: ZCheck[] = [structure];
export function inspectZiwei(chs: readonly FinalChapter[], c: ZCheckCtx): ZFlag[] { return ZIWEI_CHECKS.flatMap(f => f(chs, c)); }
