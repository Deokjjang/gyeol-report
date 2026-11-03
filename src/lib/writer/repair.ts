/**
 * 수리 패스(P6c A5): 검사(lintBook)에 걸린 문단·소제목·카드 줄만 모아 작가 모델을 한 번 더 부른다(책 1권당 최대 1회).
 * 고친 글은 같은 자리에 넣고, 그래도 걸리면 enforce가 그 문장을 지운다(빈자리를 DB 원문·안전망 문장으로 채우지 않는다).
 */
import type { Brief } from "@/lib/brief/schema";
import type { SectionCard } from "./format";
import { completeText, MODEL_TOKENS_PER_CHAR, type WriterOptions, type WriterRun } from "./runner";
import type { FinalChapter } from "./safety";
import { flagKey, type CardField, type LintFlag } from "./safety/p6c";

export const REPAIR_SYSTEM = `너는 결리포트 원고의 교정 작가다. [항목]마다 적힌 문제만 고쳐 같은 뜻의 글로 다시 쓴다.
- 문제가 없는 문장은 그대로 둔다. 새 사실·새 사람·새 사건을 만들지 않는다. 분량은 원문과 비슷하게, 존댓말(~입니다/~예요).
- 문단은 문단으로, 소제목은 짧은 소제목으로, 카드 줄은 한 줄로 돌려준다. 원문에 ⟪ ⟫가 있으면 고친 글에도 핵심 문장 하나만 ⟪ ⟫로 감싼다.
- "명리학에서" 금지. 그림 별명·농사 비유 금지. 브리프의 사실(facts)과 어긋나지 않게.
- 출력: 항목마다 "[P번호] 고친 글". 앞뒤 설명 없이.`;

type Target = { readonly key: string; readonly chapter: number; readonly section: number; readonly paragraph: number; readonly card?: CardField; readonly flags: LintFlag[] };
const CARD_LABEL: Readonly<Record<CardField, string>> = { image: "그림", todo: "해 볼 것", review: "돌아보기", caution: "살필 점" };

/** 고객 사실 묶음(교정 작가가 지켜야 할 것만). */
function factsOf(brief: Brief): Record<string, unknown> {
  const c = brief.chart;
  return {
    person: { facts: brief.person.facts, forbiddenFacts: brief.person.forbiddenFacts, lifeStage: (brief.person as { lifeStage?: string }).lifeStage },
    yinYang: `${c.yinYang.yin}:${c.yinYang.yang}`, elementsPresence: c.elements.presence, currentDayun: c.currentDayun && { years: c.currentDayun.years, phase: c.currentDayun.phase },
    stars: c.stars ? { spouse: c.stars.spouse.line, child: c.stars.child.line } : undefined, coreImage: brief.compatibility?.pairImage.line ?? c.coreImage.line,
  };
}

export function repairTargets(flags: readonly LintFlag[], chapters: readonly FinalChapter[]): Target[] {
  const by = new Map<string, Target>();
  for (const f of flags) {
    const ch = chapters.find(c => c.n === f.chapter);
    if (!ch || ch.source === "deterministic") continue;
    const k = flagKey(f);
    const t = by.get(k) ?? { key: k, chapter: f.chapter, section: f.section, paragraph: f.paragraph, ...(f.card ? { card: f.card } : {}), flags: [] };
    t.flags.push(f); by.set(k, t);
  }
  return [...by.values()];
}

function originalOf(t: Target, chapters: readonly FinalChapter[]): string {
  const s = chapters.find(c => c.n === t.chapter)?.sections[t.section];
  if (!s) return "";
  if (t.card) return `[${CARD_LABEL[t.card]}] ${s.card?.[t.card] ?? ""}`.trim();
  return t.paragraph < 0 ? s.heading : s.paragraphs[t.paragraph] ?? "";
}

export function repairPrompt(brief: Brief, chapters: readonly FinalChapter[], targets: readonly Target[]): { system: string; user: string; chars: number } {
  let chars = 0;
  const items = targets.map((t, i) => {
    const ch = chapters.find(c => c.n === t.chapter)!, s = ch.sections[t.section];
    const where = t.card ? `${t.chapter}장 · ${s.heading}의 카드 줄 [${CARD_LABEL[t.card]}]` : t.paragraph < 0 ? `${t.chapter}장 「${ch.title}」의 소제목` : `${t.chapter}장 「${ch.title}」 · 소제목 「${s.heading}」 · 문단 ${t.paragraph + 1}`;
    const entry = t.card ? brief.timeline?.entries.find(e => e.key === s.heading) : undefined;
    const cardInfo = entry ? ` (이 시기: ${entry.tenGod.stem}·${entry.tenGod.branch}, 관계 ${entry.badges.map(b => b.label).join("·") || "없음"}, ${entry.period === "past" ? "지난 기간 → 질문형" : "지금·앞으로 → 명령형"})` : "";
    const orig = originalOf(t, chapters); chars += orig.length;
    const problems = t.flags.map((f, j) => `(${j + 1}) ${f.hint}${f.sentence ? ` — 걸린 부분: "${f.sentence.slice(0, 120)}"` : ""}`).join("\n");
    return `[P${i + 1}] ${where}${cardInfo}\n문제:\n${problems}\n원문: ${orig || "(없음 — 새로 한 줄)"}`;
  });
  const user = `facts:\n\`\`\`json\n${JSON.stringify(factsOf(brief))}\n\`\`\`\n\n[항목]\n${items.join("\n\n")}\n\n항목마다 "[P번호] 고친 글"로 돌려주세요.`;
  return { system: REPAIR_SYSTEM, user, chars };
}

/** "[P1] …" 덩어리를 번호 → 글로. 끝까지 오지 않은 마지막 덩어리도 받는다(잘림은 enforce가 다시 본다). */
export function parseRepair(text: string): Map<number, string> {
  const out = new Map<number, string>();
  const parts = text.split(/^\s*\[P(\d+)\]\s*/m);
  for (let i = 1; i + 1 < parts.length; i += 2) { const v = parts[i + 1].replace(/\s+/g, " ").trim(); if (v) out.set(Number(parts[i]), v); }
  return out;
}

export function applyRepairs(chapters: readonly FinalChapter[], targets: readonly Target[], fixes: ReadonlyMap<number, string>): { chapters: FinalChapter[]; applied: number } {
  let applied = 0;
  const out = chapters.map(c => ({ ...c, sections: c.sections.map((s, si) => {
    let heading = s.heading, paragraphs = [...s.paragraphs], card: SectionCard | undefined = s.card ? { ...s.card } : undefined;
    targets.forEach((t, i) => {
      if (t.chapter !== c.n || t.section !== si) return;
      const v = fixes.get(i + 1); if (!v) return;
      applied++;
      if (t.card) { card = { ...(card ?? {}), [t.card]: v.replace(/^\[[^\]]+\]\s*/, "").trim() }; return; }
      if (t.paragraph < 0) heading = v.replace(/^#+\s*/, "").trim(); else paragraphs[t.paragraph] = v;
    });
    return { ...s, heading, paragraphs, ...(card ? { card } : {}) };
  }) }));
  return { chapters: out, applied };
}

/** 수리 호출 1회. 대상이 없거나 작가가 없으면 그대로. */
export async function repairPass(o: WriterOptions, run: WriterRun, brief: Brief, chapters: readonly FinalChapter[], flags: readonly LintFlag[]): Promise<{ run: WriterRun; chapters: FinalChapter[]; targets: number; applied: number }> {
  const targets = repairTargets(flags, chapters);
  if (!targets.length || !run.writer) return { run, chapters: [...chapters], targets: targets.length, applied: 0 };
  const p = repairPrompt(brief, chapters, targets);
  const perChar = MODEL_TOKENS_PER_CHAR[run.writer.model] ?? 1;
  const maxTokens = Math.ceil(p.chars * perChar * 1.6) + 400;
  const r = await completeText(o, run, p.system, p.user, maxTokens);
  const a = applyRepairs(chapters, targets, parseRepair(r.text));
  return { run: r.run, chapters: a.chapters, targets: targets.length, applied: a.applied };
}
