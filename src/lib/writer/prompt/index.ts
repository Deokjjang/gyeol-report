/**
 * 작가 프롬프트 조립(P3 B). 접두부(시스템 지침 + 문체 예시)는 고객과 무관해 캐시 대상이고, 브리프는 사용자 메시지로 보낸다.
 * 작가에게는 내부 값(seed·budget·score·family·featureId·간지 색)을 빼고, 대운 연도·세운 월처럼 반복 장은 한 장으로 묶어 keys를 준다.
 */
import type { Knowledge } from "@/lib/brief/knowledge";
import type { Brief, ChapterBrief, Material } from "@/lib/brief/schema";
import { STYLE_EXAMPLES } from "./examples";
import { materialTable, swapDeep } from "./materials";
import { WRITER_PROMPT_VERSION, WRITER_SYSTEM } from "./system";

/** 작가 입력 옵션(P6c A1): 지식 DB가 있으면 원문 문장을 재료(씨앗·방향·핵심 뜻)로 바꿔 보낸다. 없으면(단위 시험) 브리프 그대로. */
export type WriterInputOptions = { readonly knowledge?: Knowledge };

export { WRITER_PROMPT_VERSION } from "./system";

/** 작가가 쓰는 장 하나. 반복 장은 keys(타임라인 키)와 키별 재료를 가진다. */
export type WriterChapter = {
  readonly n: number; readonly id: string; readonly title: string; readonly question: string; readonly role: string;
  readonly targetChars: readonly [number, number]; readonly subheadings: readonly [number, number]; readonly useName: boolean;
  readonly materials: readonly Material[];
  /** 절 계획(P3.8 1): 절 하나 = 소제목 하나. 있으면 작가에게는 materials 대신 이것만 간다. */
  readonly sections?: readonly { readonly q: string; readonly domain: string; readonly materials: readonly Material[] }[];
  readonly keys?: readonly string[];
  readonly perKey?: Readonly<Record<string, readonly Material[]>>;
  readonly note?: string;
  readonly sceneHint?: readonly string[];
};

export function writerChapters(brief: Pick<Brief, "chapters">): WriterChapter[] {
  const out: WriterChapter[] = [];
  const byBase = new Map<string, ChapterBrief[]>();
  for (const c of brief.chapters) {
    const base = c.id.split(":")[0];
    if (!c.id.includes(":")) { out.push({ n: out.length + 1, id: c.id, title: c.title, question: c.question, role: c.role, targetChars: c.targetChars, subheadings: c.subheadings, useName: c.useName, materials: c.materials, ...(c.sections ? { sections: c.sections } : {}), ...(c.sceneHint ? { sceneHint: c.sceneHint } : {}) }); continue; }
    if (!byBase.has(base)) {
      byBase.set(base, []);
      out.push({ n: out.length + 1, id: base, title: c.title, question: c.question, role: c.role, targetChars: c.targetChars, subheadings: c.subheadings, useName: c.useName, materials: [], keys: [], perKey: {} });
    }
    byBase.get(base)!.push(c);
  }
  return out.map(ch => {
    const group = byBase.get(ch.id);
    if (!group) return ch;
    const keys = group.map(c => c.id.slice(ch.id.length + 1));
    return { ...ch, keys, perKey: Object.fromEntries(group.map((c, i) => [keys[i], c.materials.filter(m => m.kind !== "timeline")])), note: "keys마다 ### {key} 하나, 그 아래 문단 3개와 카드 줄 3개([그림]·[해 볼 것] 또는 [돌아보기]·[살필 점]). targetChars는 key 하나의 분량(장 전체가 아니다). 간지·관계 표시·세기 숫자는 카드가 보여 주니 본문은 해석만." };
  });
}

/** 객체에서 몇 필드를 뺀 얕은 사본. */
function omit<T extends object, K extends keyof T>(o: T, ...keys: K[]): Omit<T, K> {
  const copy = { ...o };
  for (const k of keys) delete copy[k];
  return copy;
}

/** 작가 입력용 브리프: 내부 값을 빼고 장을 묶는다. */
/** 작가가 읽을 trait·팩폭: 장에 배정된 것(또는 대표 그림으로 가리켜지는 것)만(P3.8: 안 쓰는 재료는 토큰만 쓰고 반복을 부른다). */
export function writerFacing(brief: Pick<Brief, "traits" | "shadows" | "chapters">) {
  const refs = new Set(brief.chapters.flatMap(c => c.materials.flatMap(m => m.kind === "ref" ? [m.ref] : [])));
  const traits = brief.traits.filter(t => t.chapters.length || brief.traits.some(x => x.sameImageAs === t.id && x.chapters.length));
  const shadows = brief.shadows.filter(s => refs.has(`shadows.${s.id}`));
  return { traits, shadows };
}

/** 원국 요약: 일간 그림 별명·비유는 빼고 핵심 이미지 한 줄만(P6b B-2·B-4). */
const writerChart = (c: Brief["chart"]) => ({ ...omit(c, "dayMaster", "coreImage"), dayMaster: omit(c.dayMaster, "easyName", "metaphor"), coreImage: c.coreImage.line });

export function renderWriterBrief(brief: Brief, opts: WriterInputOptions = {}): Record<string, unknown> {
  const out = renderRaw(brief);
  if (!opts.knowledge) return out;
  // 지식 DB 원문을 재료로(P6c A1). MBTI 기능은 쉬운 이름을 먼저(P6c C5): "일 되게 하는 판단(Te) · 주기능: 방향".
  const table = materialTable(opts.knowledge);
  const swapped = swapDeep(out, table);
  const fn = (b: Brief["mbti"]) => { const p = b && opts.knowledge!.mbti.get(b.type); return p && p.cognitiveFunctions.every(c => table.plain.has(c.easy)) ? p.cognitiveFunctions.map(c => `${table.plain.get(c.easy)}(${c.code}) · ${c.role}: ${table.exact.get(c.easy)}`) : null; };
  const withFn = (m: unknown, b: Brief["mbti"]) => { const f = fn(b); return m && f ? { ...(m as object), functions: f } : m; };
  return { ...swapped, mbti: withFn(swapped.mbti, brief.mbti), ...(brief.partner && swapped.partner ? { partner: { ...(swapped.partner as object), mbti: withFn((swapped.partner as { mbti: unknown }).mbti, brief.partner.mbti) } } : {}) };
}

function renderRaw(brief: Brief): Record<string, unknown> {
  const { style, timeline, fortunes } = brief;
  const { traits, shadows } = writerFacing(brief);
  return {
    ...omit(brief, "version", "seed", "budget", "chapters", "style", "traits", "shadows", "timeline", "fortunes", "usedProps", "plan", "chart", "mbti", "unused", "partner", "appendix", "glossary"),
    chart: writerChart(brief.chart),
    mbti: brief.mbti ? omit(brief.mbti, "image") : null,
    // 그림 별명·이미지·한 줄은 내부 별칭(P6b B-2): 작가는 이름(한자)·뜻(meaning)·나에게(forYou)만 받는다.
    unused: brief.unused.map(u => omit(u, "easyName", "oneLiner")),
    ...(brief.partner ? { partner: { ...brief.partner, chart: writerChart(brief.partner.chart), mbti: brief.partner.mbti ? omit(brief.partner.mbti, "image") : null } } : {}),
    // 좋은 기운이 trait와 같으면 뜻·나에게는 trait 쪽에만 둔다.
    fortunes: fortunes.map(f => f.traitId ? omit(f, "featureId", "easyName", "image", "oneLiner", "meaning", "forYou") : omit(f, "featureId", "easyName", "image", "oneLiner")),
    traits: traits.map(t => omit(t, "score", "family", "featureId", "chapters", "image", "easyName", "oneLiner", "sameImageAs")),
    shadows,
    // 카드 전용 필드(그림 줄·기간·할 일·돌아보기)는 material·when·action과 같은 값이라 보내지 않는다.
    // "badges"라는 키 이름이 본문 낱말 "배지"로 새어 나갔다(P6b E-6): 작가에게는 marks로 준다.
    ...(timeline ? { timeline: { ...timeline, entries: timeline.entries.map(e => ({ ...omit(e, "colors", "ganji", "imageLine", "period", "todo", "review", "badges"), marks: e.badges })) } } : {}),
    // style.rules는 시스템 지침과 같은 내용이라 보내지 않는다(P3.8 토큰).
    style: { register: style.register, readingLevel: style.readingLevel, totalChars: style.totalChars, forbidden: style.forbidden },
    // 절이 있는 장은 절(질문·재료)만 보낸다(장 재료 전체는 절 재료의 사본이라 두 번 보내면 같은 재료를 두 번 쓴다).
    chapters: writerChapters(brief).map(c => ({ ...(c.sections ? { ...omit(c, "materials", "sections"), sections: c.sections.map(x => ({ q: x.q, materials: x.materials })) } : c), targetChars: shownTarget(c.targetChars) })),
  };
}

/**
 * 작가에게 보이는 분량 보정(P6b C-4): Sonnet 5.5·terra 모두 브리프 targetChars의 70~82%만 쓴다(P6a 12권, P6b 1회차 실측).
 * 작가가 보는 목표만 1.25배로 보여 결과가 상품 목표(종합 13~16천 등)에 닿게 한다. 교체 판정(60%)·지표는 원래 목표를 쓴다.
 */
export const WRITER_TARGET_FACTOR = 1.25;
const shownTarget = (t: readonly [number, number]) => [Math.round(t[0] * WRITER_TARGET_FACTOR), Math.round(t[1] * WRITER_TARGET_FACTOR)] as const;

/** 캐시 접두부: 시스템 지침 + 문체 예시. 고객 정보가 없어 모든 호출이 공유한다. */
export const WRITER_PREFIX = `${WRITER_SYSTEM}\n\n# 문체 예시 (사실·문장을 가져오지 말 것)\n${STYLE_EXAMPLES.map(e => `## ${e.label}\n\`\`\`markdown\n${e.text}\n\`\`\``).join("\n\n")}`;

export type WriterPrompt = { readonly system: string; readonly user: string; readonly version: string; readonly chapters: readonly WriterChapter[] };

export function buildWriterPrompt(brief: Brief, opts: WriterInputOptions = {}): WriterPrompt {
  const chapters = writerChapters(brief);
  const list = chapters.map(c => `## ${c.n}. ${c.title}${c.keys ? ` (### ${c.keys.join(" / ### ")})` : ""}`).join("\n");
  const user = `브리프:\n\`\`\`json\n${JSON.stringify(renderWriterBrief(brief, opts))}\n\`\`\`\n\n위 브리프로 책 「${brief.productTitle}」 전체 ${chapters.length}장을 처음부터 끝까지 한 번에 쓰세요. 맨 앞에 [표지] 한 줄, 이어서 장 머리글은 아래 그대로입니다.\n${list}`;
  return { system: WRITER_PREFIX, user, version: WRITER_PROMPT_VERSION, chapters };
}

/** 이어쓰기(SPEC §4-2): 브리프 + 이미 쓴 장의 요약 + 남은 장 목록. 총 생성량은 책 1권 이내. */
export function buildContinuationPrompt(brief: Brief, written: readonly { n: number; title: string; summary: string }[], remaining: readonly WriterChapter[], opts: WriterInputOptions = {}): WriterPrompt {
  const base = buildWriterPrompt(brief, opts);
  const done = written.map(w => `- ${w.n}. ${w.title}: ${w.summary}`).join("\n");
  const list = remaining.map(c => `## ${c.n}. ${c.title}${c.keys ? ` (### ${c.keys.join(" / ### ")})` : ""}`).join("\n");
  const user = `${base.user.split("\n\n위 브리프로")[0]}\n\n이미 쓴 장(다시 쓰지 말 것, 같은 비유·장면·MBTI 연결을 되풀이하지 말 것):\n${done || "- 없음"}\n\n남은 장만 이어서 쓰세요. 장 머리글은 아래 그대로입니다.\n${list}`;
  return { ...base, user, chapters: remaining };
}
