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
- 문단은 문단으로, 소제목은 짧은 소제목으로, 카드 줄은 한 줄로 돌려준다. "덧붙일 새 문단 하나" 항목은 새 문단 하나(4문장)만 돌려준다(지금 글은 시스템이 그대로 둔다). 원문에 ⟪ ⟫가 있으면 고친 글에도 핵심 문장 하나만 ⟪ ⟫로 감싼다.
- "명리학에서" 금지. 그림 별명·농사 비유 금지. 브리프의 사실(facts)과 어긋나지 않게.
- 한자와 MBTI 약어(Te·Si 등)는 쓰지 않는다(용어는 한글 이름만, 시스템이 붙인다). 안내·면책 문장("단정하는 말은 아니에요")은 쓰지 않는다(책에 한 번 시스템이 넣는다).
- 작가에게 준 규칙을 독자에게 옮기지 않는다("~쓰지 마세요" 금지). 첫 문단의 첫 문장은 앞 소제목 없이도 뜻이 서게("또한·여기에·그래서·~도"로 열지 않는다).
- 출력: 항목마다 "[P번호] 고친 글". 앞뒤 설명 없이.`;

/** P6e 2: 수리 뒤에도 사실·금지 규칙에 걸린 소제목을 통째로 다시 쓰는 호출(책 1권당 최대 1회). 그래도 걸리면 소제목을 뺀다. */
export const REWRITE_SYSTEM = `너는 결리포트 원고의 교정 작가다. [S번호] 소제목마다 적힌 문제를 고쳐 그 소제목 전체를 처음부터 다시 쓴다.
- 출력 꼴: "[S번호]" 다음 줄에 "### 소제목", 이어서 문단 3개(문단마다 3~4문장, 빈 줄로 나눔). 핵심 문장 하나를 ⟪ ⟫로 감싼다.
- 첫 문단의 첫 문장은 이 소제목만 읽어도 뜻이 서게 연다("또한·여기에·이처럼·그래서·반대로·~도"로 열지 않는다).
- 질문(q)에 답하고, 재료(materials)와 facts에 있는 사실만 쓴다. 새 사람·새 사건·입력에 없는 경력·연인·자녀를 만들지 않는다.
- 문제로 짚인 내용(틀린 자리·틀린 사람·틀린 세기·지침 문장·조각 문장)은 고치거나 빼고, 나머지 좋은 내용(근거·장면·행동)은 살린다. 분량은 원문과 비슷하게.
- 쉬운 존댓말(~입니다/~예요). 한자·MBTI 약어·안내·면책 문장·"명리학에서"·그림 별명 금지.
- 앞뒤 설명 없이 [S번호] 덩어리만.`;

/** 안전망 문장 규칙의 쉬운 이름(수리 지시용). */
const SAFETY_DETAIL: Readonly<Record<string, string>> = {
  date_event: "날짜·사건 확정", love_timing: "인연·결혼 시기", fact_spouse: "입력에 없는 배우자", fact_partner: "입력에 없는 연인", fact_children: "입력에 없는 자녀(아이가 이미 있다고 읽히는 말 대신 \"아이를 키우게 된다면\"처럼 가정형으로)", fact_job: "입력과 다른 직업 형태",
  hour_pillar: "시간 미상인데 시주·자녀 자리", mbti_absent: "MBTI 없음인데 MBTI", internal_term: "내부 용어", internal_label: "내부 라벨·지침 말", family_member: "입력에 없는 가족 구성원",
  old_negative: "옛 부정 낱말", source_mention: "출처 언급", self_deflating: "스스로 김빼는 말", breakup_advice: "이별 권유", compat_judgement: "한쪽 평가", band_mismatch: "궁합 구간과 다른 말", score_mismatch: "점수와 다른 숫자",
  experience_assert: "입력에 없는 경험 단정 → 질문형·경향형",
};
type Target = { readonly key: string; readonly chapter: number; readonly section: number; readonly paragraph: number; readonly card?: CardField; readonly flags: LintFlag[] };
const CARD_LABEL: Readonly<Record<CardField, string>> = { image: "그림", todo: "해 볼 것", review: "돌아보기", caution: "살필 점" };

/** 짧은 소제목 문제 하나뿐인 항목: 원문을 바꾸지 않고 새 문단을 뒤에 붙인다. */
const appendOnly = (t: Pick<Target, "flags" | "card">) => !t.card && t.flags.every(f => f.rule === "short_section");
/** 고객 사실 묶음(교정 작가가 지켜야 할 것만). */
function factsOf(brief: Brief): Record<string, unknown> {
  const c = brief.chart;
  return {
    person: { facts: brief.person.facts, forbiddenFacts: brief.person.forbiddenFacts, lifeStage: (brief.person as { lifeStage?: string }).lifeStage },
    yinYang: `${c.yinYang.yin}:${c.yinYang.yang}`, elementsPresence: c.elements.presence, currentDayun: c.currentDayun && { years: c.currentDayun.years, phase: c.currentDayun.phase },
    stars: c.stars ? { spouse: c.stars.spouse.line, child: c.stars.child.line } : undefined, coreImage: brief.compatibility?.pairImage.line ?? c.coreImage.line,
    // P6d: 묶음 세기(만세력 가중값 단계)·기준 날짜(시점 말 대신)·궁합 두 사람 값.
    groups: c.groups?.line, ...(brief.partner?.chart.groups ? { partnerGroups: brief.partner.chart.groups.line } : {}), baseDate: brief.baseDate,
    ...(brief.compatibility ? { pair: { a: { name: brief.compatibility.a.callName, lacking: brief.compatibility.a.lacking, excess: brief.compatibility.a.excess, mbti: brief.compatibility.a.mbti, shinsal: brief.compatibility.a.shinsal, positions: c.positions?.line }, b: { name: brief.compatibility.b.callName, lacking: brief.compatibility.b.lacking, excess: brief.compatibility.b.excess, mbti: brief.compatibility.b.mbti, shinsal: brief.compatibility.b.shinsal, positions: brief.partner?.chart.positions?.line }, dayRelations: brief.compatibility.dayRelations } } : { positions: c.positions?.line }),
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

export function repairPrompt(brief: Brief, chapters: readonly FinalChapter[], targets: readonly Target[], writerBrief?: Record<string, unknown>): { system: string; user: string; chars: number } {
  let chars = 0;
  const items = targets.map((t, i) => {
    const ch = chapters.find(c => c.n === t.chapter)!, s = ch.sections[t.section];
    const where = t.card ? `${t.chapter}장 · ${s.heading}의 카드 줄 [${CARD_LABEL[t.card]}]` : t.paragraph < 0 ? `${t.chapter}장 「${ch.title}」의 소제목` : `${t.chapter}장 「${ch.title}」 · 소제목 「${s.heading}」 · 문단 ${t.paragraph + 1}`;
    const entry = brief.timeline?.entries.find(e => e.key === s.heading);
    const cardInfo = entry ? ` (이 시기: ${entry.tenGod.stem}·${entry.tenGod.branch}, 관계 ${entry.badges.map(b => b.label).join("·") || "없음"}, ${entry.period === "past" ? "발행일 전 → 질문형" : "앞으로 → 명령형"})` : "";
    const orig = appendOnly(t) ? "" : originalOf(t, chapters); chars += orig.length;
    const problems = t.flags.map((f, j) => `(${j + 1}) ${f.hint}${f.detail ? ` [${SAFETY_DETAIL[f.detail] ?? f.detail}]` : ""}${f.sentence ? ` — 걸린 부분: "${f.sentence.slice(0, 120)}"` : ""}`).join("\n");
    const yi = entry?.dayun?.position ? ` 대운 위치: ${entry.dayun.position}` : "";
    // P6e: 짧은 소제목은 그 절의 질문·재료를 함께 준다(더하는 문단이 근거 위에 서게).
    // P6e: 짧은 소제목(그 문제 하나뿐인 항목)은 덧붙일 새 문단 하나만 받는다. 겹치지 않게 소제목 전문과 그 절의 질문·재료를 준다.
    if (appendOnly(t)) {
      const sb = writerBrief ? sectionBrief(writerBrief, t.chapter, t.section) : null;
      const whole = s.paragraphs.join("\n\n"); chars += 200;
      return `[P${i + 1}] ${t.chapter}장 「${ch.title}」 · 소제목 「${s.heading}」에 덧붙일 새 문단 하나${sb?.q ? `\n절 질문(q): ${sb.q}` : ""}${sb?.materials ? `\n절 재료: ${JSON.stringify(sb.materials)}` : ""}\n문제:\n${problems}\n지금 글(그대로 둔다, 되풀이 금지):\n${whole}`;
    }
    return `[P${i + 1}] ${where}${t.card ? cardInfo : yi}\n문제:\n${problems}\n원문: ${orig || "(없음 — 새로 한 줄)"}`;
  });
  const user = `facts:\n\`\`\`json\n${JSON.stringify(factsOf(brief))}\n\`\`\`\n\n[항목]\n${items.join("\n\n")}\n\n항목마다 "[P번호] 고친 글"로 돌려주세요.`;
  return { system: REPAIR_SYSTEM, user, chars };
}

/** "[P1] …" 덩어리를 번호 → 글로. 끝까지 오지 않은 마지막 덩어리도 받는다(잘림은 enforce가 다시 본다). */
export function parseRepair(text: string): Map<number, string> {
  const out = new Map<number, string>();
  const parts = text.split(/^\s*\[P(\d+)\]\s*/m);
  // 빈 줄은 문단 나눔으로 남긴다(P6e: 짧은 소제목에 문단을 더한 수리).
  for (let i = 1; i + 1 < parts.length; i += 2) { const v = parts[i + 1].split(/\n\s*\n/).map(x => x.replace(/\s+/g, " ").trim()).filter(Boolean).join("\n\n"); if (v) out.set(Number(parts[i]), v); }
  return out;
}

export function applyRepairs(chapters: readonly FinalChapter[], targets: readonly Target[], fixes: ReadonlyMap<number, string>): { chapters: FinalChapter[]; applied: number } {
  let applied = 0;
  const out = chapters.map(c => ({ ...c, sections: c.sections.map((s, si) => {
    let heading = s.heading, card: SectionCard | undefined = s.card ? { ...s.card } : undefined;
    // 문단 자리마다 바꾼 글(빈 줄이 있으면 여러 문단). 소제목·카드 줄은 한 줄.
    const paragraphs: string[][] = s.paragraphs.map(p => [p]);
    targets.forEach((t, i) => {
      if (t.chapter !== c.n || t.section !== si) return;
      const v = fixes.get(i + 1); if (!v) return;
      applied++;
      if (t.card) { card = { ...(card ?? {}), [t.card]: v.replace(/\s+/g, " ").replace(/^\[[^\]]+\]\s*/, "").trim() }; return; }
      if (t.paragraph < 0) heading = v.replace(/\s+/g, " ").replace(/^#+\s*/, "").trim();
      else if (appendOnly(t)) { const add = v.split("\n\n")[0]?.replace(/\s+/g, " ").trim(); const last = paragraphs.length - 1; if (add && last >= 0) paragraphs[last] = [...paragraphs[last], add]; }
      else if (paragraphs[t.paragraph]) paragraphs[t.paragraph] = [v.replace(/\s+/g, " ").trim()];
    });
    return { ...s, heading, paragraphs: paragraphs.flat(), ...(card ? { card } : {}) };
  }) }));
  return { chapters: out, applied };
}

/** 수리 호출 1회. 대상이 없거나 작가가 없으면 그대로. */
export async function repairPass(o: WriterOptions, run: WriterRun, brief: Brief, chapters: readonly FinalChapter[], flags: readonly LintFlag[], writerBrief?: Record<string, unknown>): Promise<{ run: WriterRun; chapters: FinalChapter[]; targets: number; applied: number }> {
  const targets = repairTargets(flags, chapters);
  if (!targets.length || !run.writer) return { run, chapters: [...chapters], targets: targets.length, applied: 0 };
  const p = repairPrompt(brief, chapters, targets, writerBrief);
  const perChar = MODEL_TOKENS_PER_CHAR[run.writer.model] ?? 1;
  // 짧은 소제목에 더하는 문단 몫(소제목마다 400자 안팎)을 더한다.
  const grow = targets.filter(appendOnly).length * 250;
  const maxTokens = Math.ceil((p.chars + grow) * perChar * 1.6) + 400;
  const r = await completeText(o, run, p.system, p.user, maxTokens);
  const a = applyRepairs(chapters, targets, parseRepair(r.text));
  return { run: r.run, chapters: a.chapters, targets: targets.length, applied: a.applied };
}

/** P6e 2: 사실·금지 규칙이 남은 소제목(반복 장 key 제외). 소제목 줄·문단 어디에 걸렸든 소제목 하나로 모은다. */
export type SectionTarget = { readonly chapter: number; readonly section: number; readonly flags: LintFlag[] };
export function hardSections(flags: readonly LintFlag[], chapters: readonly FinalChapter[], hard: ReadonlySet<string>): SectionTarget[] {
  const by = new Map<string, SectionTarget>();
  for (const f of flags) {
    if (f.card || !hard.has(f.rule)) continue;
    const ch = chapters.find(c => c.n === f.chapter); const s = ch?.sections[f.section];
    if (!ch || !s || ch.source === "deterministic" || ch.keys?.includes(s.heading)) continue;
    const k = `${f.chapter}.${f.section}`;
    const t = by.get(k) ?? { chapter: f.chapter, section: f.section, flags: [] };
    t.flags.push(f); by.set(k, t);
  }
  return [...by.values()];
}

/** 작가가 본 절 재료(질문·materials): 장 번호·절 순서로 찾는다(절 수가 다르면 질문만 없이). */
type WriterSection = { q?: string; materials?: unknown };
function sectionBrief(writerBrief: Record<string, unknown>, chapter: number, section: number): WriterSection | null {
  const chs = writerBrief.chapters as { n: number; sections?: WriterSection[] }[] | undefined;
  return chs?.find(c => c.n === chapter)?.sections?.[section] ?? null;
}

export function rewritePrompt(brief: Brief, chapters: readonly FinalChapter[], targets: readonly SectionTarget[], writerBrief: Record<string, unknown>): { system: string; user: string; chars: number } {
  let chars = 0;
  const items = targets.map((t, i) => {
    const ch = chapters.find(c => c.n === t.chapter)!, s = ch.sections[t.section];
    const sb = sectionBrief(writerBrief, t.chapter, t.section);
    const text = [`### ${s.heading}`, ...s.paragraphs].join("\n\n"); chars += text.length;
    const problems = t.flags.map((f, j) => `(${j + 1}) ${f.hint}${f.detail ? ` [${SAFETY_DETAIL[f.detail] ?? f.detail}]` : ""}${f.sentence ? ` — 걸린 부분: "${f.sentence.slice(0, 120)}"` : ""}`).join("\n");
    return `[S${i + 1}] ${t.chapter}장 「${ch.title}」의 소제목 하나${sb?.q ? `\n질문(q): ${sb.q}` : ""}${sb?.materials ? `\nmaterials: ${JSON.stringify(sb.materials)}` : ""}\n문제:\n${problems}\n지금 글:\n${text}`;
  });
  const user = `facts:\n\`\`\`json\n${JSON.stringify(factsOf(brief))}\n\`\`\`\n\n${items.join("\n\n---\n\n")}\n\n소제목마다 "[S번호]" 다음에 다시 쓴 소제목 전체를 돌려주세요.`;
  return { system: REWRITE_SYSTEM, user, chars };
}

/** "[S1]\n### 소제목\n\n문단…" → 번호 → { heading, paragraphs }. */
export function parseRewrite(text: string): Map<number, { heading: string; paragraphs: string[] }> {
  const out = new Map<number, { heading: string; paragraphs: string[] }>();
  const parts = text.split(/^\s*\[S(\d+)\]\s*/m);
  for (let i = 1; i + 1 < parts.length; i += 2) {
    const body = parts[i + 1].trim(); const m = body.match(/^#{2,4}\s*(.+)$/m);
    const heading = (m?.[1] ?? "").trim();
    const rest = m ? body.slice((m.index ?? 0) + m[0].length) : body;
    const paragraphs = rest.split(/\n\s*\n/).map(p => p.replace(/\s+/g, " ").trim()).filter(p => p && !/^#{1,4}\s/.test(p) && !/^-{3,}$/.test(p));
    if (heading && paragraphs.length) out.set(Number(parts[i]), { heading, paragraphs });
  }
  return out;
}

/** 소제목 재작성 호출 1회. 받은 소제목은 같은 자리에 넣는다(받지 못한 소제목은 그대로 두고 부르는 쪽이 다시 본다). */
export async function rewritePass(o: WriterOptions, run: WriterRun, brief: Brief, chapters: readonly FinalChapter[], targets: readonly SectionTarget[], writerBrief: Record<string, unknown>): Promise<{ run: WriterRun; chapters: FinalChapter[]; applied: number }> {
  if (!targets.length || !run.writer) return { run, chapters: [...chapters], applied: 0 };
  const p = rewritePrompt(brief, chapters, targets, writerBrief);
  const perChar = MODEL_TOKENS_PER_CHAR[run.writer.model] ?? 1;
  const r = await completeText(o, run, p.system, p.user, Math.ceil(p.chars * perChar * 1.6) + 600, "rewrite");
  const got = parseRewrite(r.text);
  let applied = 0;
  const out = chapters.map(c => ({ ...c, sections: c.sections.map((s, si) => {
    const i = targets.findIndex(t => t.chapter === c.n && t.section === si); const v = i >= 0 ? got.get(i + 1) : undefined;
    if (!v) return s;
    applied++; return { ...s, heading: v.heading, paragraphs: v.paragraphs };
  }) }));
  return { run: r.run, chapters: out, applied };
}

/**
 * 재작성 뒤에도 사실·금지 규칙에 걸린 소제목은 통째로 뺀다(문단만 빼면 고아 문장이 남는다, P6e 2). 반복 장 key는 문단 단위(빈 key는 결정론으로 채운다).
 * 뺀 소제목·문단은 자리·규칙·문장을 돌려준다(Book 메타·보고서).
 */
export function dropHardSections(chapters: readonly FinalChapter[], targets: readonly SectionTarget[]): { chapters: FinalChapter[]; dropped: { at: string; heading: string; rules: string[]; sentences: string[] }[] } {
  const dropped: { at: string; heading: string; rules: string[]; sentences: string[] }[] = [];
  const out = chapters.map(c => {
    const sections = c.sections.filter((s, si) => {
      const t = targets.find(x => x.chapter === c.n && x.section === si); if (!t) return true;
      dropped.push({ at: `${c.n}.${si}`, heading: s.heading, rules: [...new Set(t.flags.map(f => f.rule))], sentences: t.flags.map(f => f.sentence.slice(0, 200)) });
      return false;
    });
    return { ...c, sections, chars: sections.reduce((a, s) => a + s.paragraphs.join("").length, 0) };
  });
  return { chapters: out, dropped };
}
