/**
 * 장 목록(product-narratives) + 장별 재료 배정.
 * 재료 4~6 = trait 2~4 + 보조 재료(좋은 기운·팩폭·안 쓴 기운·MBTI 신호·흐름·상품 근거). trait는 최대 3장, 장마다 다른 영역. 같은 장면 재사용 금지.
 * 반복 장(대운 연도·세운 월)은 타임라인 항목 1개 + trait 1개(항목 자체가 재료를 가진다).
 */
import type { Domain, MbtiProfile, MyeongriFeature, SceneItem } from "@/data/knowledge-v5/schema";
import { sceneFits, type FactProfile } from "./facts";
import type { CustomerProps } from "./props";
import type { ProductNarrative } from "./knowledge";
import type { Rng } from "./seed";
import type { ChapterBrief, Material, Trait } from "./schema";
import type { ProductKey } from "./traits";

/** SPEC §1 분량(P3 고정): 장 1,000~1,250자. 반복 항목(대운 연도·세운 월)은 항목당. 총량 = 장 수 × 장 목표 + 항목 수 × 항목 목표. */
export const CHAPTER_CHARS: [number, number] = [1000, 1250];
export const PRODUCT_CHARS: Record<ProductKey, { total: [number, number]; chapter: [number, number]; repeat?: [number, number] }> = {
  saju_mbti_full: { total: [13000, 16250], chapter: CHAPTER_CHARS },
  career_money_study: { total: [9000, 11250], chapter: CHAPTER_CHARS },
  love_marriage_child: { total: [9000, 11250], chapter: CHAPTER_CHARS },
  saju_mbti_compatibility: { total: [9000, 11250], chapter: CHAPTER_CHARS },
  major_fortune: { total: [10300, 13400], chapter: CHAPTER_CHARS, repeat: [450, 600] },
  annual_fortune: { total: [9400, 12800], chapter: CHAPTER_CHARS, repeat: [450, 650] },
};
const TRAIT_SLOTS: Record<string, number> = { HOOK: 3, WHY: 3, SCENE: 3, TWIST: 2, PAYOFF: 2 };

/** 장별 보조 재료 계획. mbti:<domain>=MBTI 신호 장면, ref:<경로>=브리프 안 다른 절을 가리킴, evidence:<key>=상품 근거, shadow=다음 팩폭. */
const AUX: Record<string, string[]> = {
  // 종합
  "saju_mbti_full/core": ["ref:chart.dayMaster", "ref:mbti"],
  "saju_mbti_full/portrait": ["mbti:relationships"],
  "saju_mbti_full/why": ["ref:chart.elements", "ref:chart.yinYang"],
  "saju_mbti_full/tension": ["fusion:tension"],
  "saju_mbti_full/strengths": ["ref:fortunes"],
  // 올해 기운 한 줄은 '지금의 흐름' 장 하나에만 둔다(P3 전체 원고 시험: 6장·11장 중복).
  "saju_mbti_full/work-money": ["mbti:work", "mbti:money"],
  "saju_mbti_full/relationships": ["mbti:relationships"],
  "saju_mbti_full/love": ["mbti:love"],
  "saju_mbti_full/fact-bomb": ["shadow", "shadow"],
  "saju_mbti_full/study": ["mbti:study"],
  "saju_mbti_full/fortune": ["ref:fortunes", "ref:chart.thisYear", "ref:chart.currentDayun"],
  "saju_mbti_full/recovery": ["ref:chart.climate", "mbti:alone"],
  "saju_mbti_full/direction": ["ref:unused", "ref:chart.currentDayun"],
  // 커리어
  "career_money_study/work-core": ["ref:chart.strength", "ref:mbti"],
  "career_money_study/choice-scene": ["mbti:work"],
  "career_money_study/choice-why": ["ref:chart.elements"],
  "career_money_study/fit": ["evidence:jobFit", "ref:fortunes"],
  "career_money_study/burden": ["shadow"],
  "career_money_study/money": ["mbti:money", "evidence:investment"],
  "career_money_study/study": ["mbti:study"],
  "career_money_study/timing-risk": ["ref:chart.thisYear", "ref:chart.currentDayun", "shadow"],
  "career_money_study/plan": ["ref:unused", "evidence:investment"],
  // 연애
  "love_marriage_child/love-core": ["ref:chart.yinYang", "ref:mbti"],
  "love_marriage_child/spark": ["mbti:love"],
  "love_marriage_child/attracted-to": ["evidence:spouseStar", "evidence:partnerMatch"],
  "love_marriage_child/expression": ["mbti:love"],
  "love_marriage_child/inner-gap": ["shadow", "fusion:tension"],
  "love_marriage_child/conflict-recovery": ["mbti:relationships"],
  "love_marriage_child/marriage": ["evidence:spouseStar", "evidence:spousePalace"],
  "love_marriage_child/parenting": ["evidence:childStar", "evidence:childPalace"],
  "love_marriage_child/strategy": ["evidence:meetingPlaces", "ref:unused"],
  // 궁합
  "saju_mbti_compatibility/pair-core": ["ref:compatibility.a", "ref:compatibility.b"],
  "saju_mbti_compatibility/same-scene": ["ref:compatibility.differences"],
  "saju_mbti_compatibility/direction-ab": ["ref:compatibility.tenGodAB"],
  "saju_mbti_compatibility/direction-ba": ["ref:compatibility.tenGodBA"],
  "saju_mbti_compatibility/attraction": ["ref:compatibility.complement", "ref:compatibility.mbtiConvention"],
  "saju_mbti_compatibility/friction": ["ref:compatibility.dayRelations", "ref:compatibility.differences"],
  "saju_mbti_compatibility/domain-scene": ["ref:compatibility.lens"],
  "saju_mbti_compatibility/felt-differently": ["ref:compatibility.common"],
  "saju_mbti_compatibility/one-thing": ["ref:compatibility.complement", "ref:compatibility.score"],
  // 대운·세운
  "major_fortune/overview": ["ref:timeline.cycles", "ref:chart.currentDayun"],
  "major_fortune/current-cycle": ["ref:chart.currentDayun", "ref:chart.elements"],
  "major_fortune/transition": ["ref:timeline.keyEntries"],
  "major_fortune/closing": ["ref:unused"],
  "annual_fortune/overview": ["ref:chart.thisYear", "ref:timeline.keyEntries"],
  "annual_fortune/current-dayun": ["ref:chart.currentDayun"],
  "annual_fortune/key-months": ["ref:timeline.keyEntries"],
  "annual_fortune/closing": ["ref:unused"],
};

export type TraitSource = { readonly trait: Trait; readonly feature: MyeongriFeature; readonly fusionScene?: SceneItem };
export type PlanCtx = {
  readonly product: ProductKey; readonly narrative: ProductNarrative; readonly traits: readonly TraitSource[];
  readonly facts: FactProfile; readonly rng: Rng; readonly usedScenes: Set<string>;
  readonly mbti: MbtiProfile | null;
  readonly has: (ref: string) => boolean;
  readonly evidence: Readonly<Record<string, Material>>;
  readonly shadows: readonly { id: string; traitId: string }[];
  readonly timelineKeys: readonly string[];
  /** 궁합: 장별 장면 영역(관계 유형 sceneDomains). */
  readonly sceneDomains?: readonly Domain[];
  /** 궁합: A·B trait 선호(direction-ab는 B의 trait를 먼저). */
  readonly prefer?: (chapterId: string, t: Trait) => number;
  /** 고객 생활 소품(P3.5 A1). 없으면(궁합) 장면 변주 힌트를 넣지 않는다. */
  readonly props?: CustomerProps;
};

/** 장 영역 → 소품 줄. 일·돈·배움은 직업, 사랑·결혼은 관계 상태, 사람·혼자는 나이대 소품을 먼저 쓴다. */
const PROP_POOL: Record<Domain, readonly ("job" | "relationship" | "age")[]> = {
  work: ["job", "job"], money: ["job", "age"], study: ["job", "age"], love: ["relationship", "age"], marriage: ["relationship", "relationship"], relationships: ["age", "relationship"], alone: ["age", "job"],
};
/** 장마다 소품 2개를 줄별 커서로 돌려 준다(같은 소품이 연달아 나오지 않게). */
function sceneHints(props: CustomerProps, plans: readonly { repeatKey?: string; domains: readonly Domain[] }[]): (string[] | undefined)[] {
  const pools = { job: props.job.props, relationship: props.relationship, age: props.age };
  const cursor = { job: 0, relationship: 0, age: 0 };
  return plans.map(p => {
    if (p.repeatKey) return undefined;
    const out: string[] = [];
    for (const line of PROP_POOL[p.domains[0] ?? "relationships"]) { const pool = pools[line]; const x = pool[cursor[line]++ % pool.length]; if (x && !out.includes(x)) out.push(x); }
    return out.length ? out : undefined;
  });
}

const FAMILY_IF = /결혼(하면|한다면|을 (생각|앞둔))|함께 살게|같이 살게|아이를 (키우|낳)|부모가 (되|된)/;
/** 결혼·자녀 언젠가형 장면(unmarried·children none·조건 문구). */
export const conditionalFamily = (s: SceneItem) => s.requires.relationship === "unmarried" || s.requires.children === "none" || FAMILY_IF.test(s.text);
/** 결혼·자녀 조건부 장면은 연애 상품과 종합 '사람 사이에서' 장에만 둔다(P3.5 A5). */
export const familyChapter = (product: ProductKey, chapterId: string) => product === "love_marriage_child" || (product === "saju_mbti_full" && chapterId === "relationships");
const usable = (s: SceneItem, ctx: PlanCtx, chapterId: string) => sceneFits(s.requires, ctx.facts) && !ctx.usedScenes.has(s.text) && (familyChapter(ctx.product, chapterId) || !conditionalFamily(s));

function freshScene(list: readonly SceneItem[] | undefined, ctx: PlanCtx, label: string, chapterId: string): string | undefined {
  const ok = (list ?? []).filter(s => usable(s, ctx, chapterId));
  if (!ok.length) return undefined;
  const s = ctx.rng.fork(label).pick(ok); ctx.usedScenes.add(s.text); return s.text;
}

type Use = { count: number; domains: Set<Domain> };
const hasFresh = (ctx: PlanCtx, list: readonly SceneItem[] | undefined, chapterId: string) => (list ?? []).some(s => usable(s, ctx, chapterId));
/** 이 장에 이 trait를 놓을 수 있는가(3장 상한·영역 중복·장면 여부). 상태를 바꾸지 않는다. */
function feasibleDomains(ctx: PlanCtx, src: TraitSource, domains: readonly Domain[], uses: Map<string, Use>, chapterId: string): Domain[] {
  const u = uses.get(src.trait.id);
  if ((u?.count ?? 0) >= 3) return [];
  return domains.filter(d => !u?.domains.has(d) && hasFresh(ctx, src.feature.scenes[d], chapterId));
}
function assign(ctx: PlanCtx, src: TraitSource, domains: readonly Domain[], uses: Map<string, Use>, chapterId: string): Material | null {
  const ok = feasibleDomains(ctx, src, domains, uses, chapterId);
  if (!ok.length) return null;
  const d = ok[ctx.rng.fork(`${chapterId}:${src.trait.id}:dom`).int(ok.length)];
  const scene = freshScene(src.feature.scenes[d], ctx, `${chapterId}:${src.trait.id}:${d}`, chapterId)!;
  const u = uses.get(src.trait.id) ?? { count: 0, domains: new Set<Domain>() };
  u.domains.add(d); u.count++; uses.set(src.trait.id, u);
  src.trait.chapters.push(chapterId);
  return { kind: "trait", traitId: src.trait.id, domain: d, scene, angle: u.count === 1 ? "first" : "new-domain" };
}

function auxMaterials(ctx: PlanCtx, chapterId: string, shadowCursor: { i: number }): Material[] {
  const out: Material[] = [];
  for (const spec of AUX[`${ctx.product}/${chapterId}`] ?? []) {
    if (spec.startsWith("ref:")) { const ref = spec.slice(4); if (ctx.has(ref)) out.push({ kind: "ref", ref }); }
    else if (spec.startsWith("mbti:")) {
      if (!ctx.mbti) continue;
      const d = spec.slice(5) as Domain; const scene = freshScene(ctx.mbti.signals[d], ctx, `${chapterId}:mbti:${d}`, chapterId);
      if (scene) out.push({ kind: "mbti", domain: d, scene });
    } else if (spec.startsWith("evidence:")) { const e = ctx.evidence[spec.slice(9)]; if (e) out.push(e); }
    else if (spec === "shadow") { const s = ctx.shadows[shadowCursor.i++]; if (s) out.push({ kind: "ref", ref: `shadows.${s.id}`, note: `팩폭 재료(연결 trait ${s.traitId})` }); }
    else if (spec === "fusion:tension") {
      const t = ctx.traits.find(x => x.trait.fusion?.kind === "tension") ?? ctx.traits.find(x => x.trait.fusion?.kind === "conditional");
      if (t) out.push({ kind: "ref", ref: `traits.${t.trait.id}.fusion`, note: "명리와 MBTI가 반대로 당기는 지점" });
      else { const s = ctx.shadows[shadowCursor.i++]; if (s) out.push({ kind: "ref", ref: `shadows.${s.id}`, note: "MBTI 긴장 재료가 없어 명리 안의 팩폭으로 대신" }); }
    }
  }
  return out;
}

const isCore = (t: Trait) => t.family === "dayPillar" || t.family === "dayMaster";

export function planChapters(ctx: PlanCtx): ChapterBrief[] {
  const chars = PRODUCT_CHARS[ctx.product];
  const uses = new Map<string, Use>();
  const shadowCursor = { i: 0 };
  const domainsOf = (cDomains: readonly Domain[]) => ctx.sceneDomains?.length ? [...new Set([...ctx.sceneDomains, ...cDomains.filter(d => ctx.sceneDomains!.includes(d))])] : cDomains;
  const plans = ctx.narrative.chapters.flatMap(c => c.repeat
    ? ctx.timelineKeys.map(key => ({ c, repeatKey: key as string | undefined, id: `${c.id}:${key}` }))
    : [{ c, repeatKey: undefined as string | undefined, id: c.id }]).map((p, index) => {
    const aux = p.repeatKey ? [] : auxMaterials(ctx, p.c.id, shadowCursor);
    // 재료 4~6: trait 2~4 + 보조. 반복 장은 trait 1.
    const target = p.repeatKey ? 1 : Math.min(4, Math.max(2, Math.min(TRAIT_SLOTS[p.c.role] ?? 2, 6 - aux.length), 4 - aux.length));
    return { ...p, index, aux, target, domains: domainsOf(p.c.domains as Domain[]), traits: [] as Material[] };
  });
  const prefScore = (p: (typeof plans)[number], t: TraitSource) => (ctx.prefer?.(p.c.id, t.trait) ?? 0) * 10 + (p.c.evidenceFamilies?.includes(t.trait.family) ? 2 : 0) + (p.index === 0 && isCore(t.trait) ? 100 : 0);
  // 라운드 로빈: 모든 장이 n번째 trait를 받기 전에는 아무 장도 n+1번째를 받지 않는다. 후보가 적은 장부터.
  for (let round = 1; round <= 4; round++) {
    const open = plans.filter(p => p.traits.length < p.target && p.traits.length < round);
    const cands = (p: (typeof plans)[number]) => ctx.traits.filter(t => !p.traits.some(m => m.kind === "trait" && m.traitId === t.trait.id) && feasibleDomains(ctx, t, p.domains, uses, p.id).length);
    open.sort((a, b) => cands(a).length - cands(b).length || a.index - b.index);
    for (const p of open) {
      const best = cands(p).sort((a, b) => prefScore(p, b) - prefScore(p, a) || (uses.get(a.trait.id)?.count ?? 0) - (uses.get(b.trait.id)?.count ?? 0) || b.trait.score - a.trait.score || a.trait.id.localeCompare(b.trait.id))[0];
      if (best) { const m = assign(ctx, best, p.domains, uses, p.id); if (m) p.traits.push(m); }
    }
  }
  // 재료가 4개보다 적은 비반복 장은 MBTI 신호(장 영역 → 그 밖 영역) 장면으로 채운다.
  for (const p of plans) {
    if (p.repeatKey || !ctx.mbti) continue;
    const domains: Domain[] = [...p.domains, ...(["alone", "relationships", "work", "study", "money", "love"] as Domain[]).filter(d => !p.domains.includes(d))];
    for (const d of domains) {
      if (p.traits.length + p.aux.length >= 4) break;
      const scene = freshScene(ctx.mbti.signals[d], ctx, `${p.id}:fill:${d}`, p.c.id);
      if (scene) p.aux.push({ kind: "mbti", domain: d, scene });
    }
  }
  // 그래도 4개보다 적으면(MBTI 없음 등) trait를 더 붙이고(4개까지), 마지막으로 원국·흐름 참조를 붙인다.
  const FILL_REFS = ["chart.elements", "chart.yinYang", "chart.climate", "chart.thisYear", "fortunes", "unused", "chart.currentDayun"];
  for (const p of plans) {
    if (p.repeatKey) continue;
    for (const src of ctx.traits) {
      if (p.traits.length + p.aux.length >= 4 || p.traits.length >= 4) break;
      if (p.traits.some(m => m.kind === "trait" && m.traitId === src.trait.id)) continue;
      const m = assign(ctx, src, p.domains, uses, p.id); if (m) p.traits.push(m);
    }
    for (const ref of FILL_REFS) {
      if (p.traits.length + p.aux.length >= 4) break;
      if (ctx.has(ref) && !p.aux.some(m => m.kind === "ref" && m.ref === ref)) p.aux.push({ kind: "ref", ref, note: "앞 장과 다른 각도로만 짧게" });
    }
  }
  const total = plans.length;
  const hints = ctx.props ? sceneHints(ctx.props, plans) : [];
  const order = new Map(plans.map(p => [p.id, p.index]));
  for (const t of ctx.traits) t.trait.chapters.sort((a, b) => (order.get(a) ?? 0) - (order.get(b) ?? 0));
  return plans.map(p => {
    const repeat = Boolean(p.repeatKey);
    const materials: Material[] = repeat ? [{ kind: "timeline", entryKey: p.repeatKey! }, ...p.traits] : [...p.traits, ...p.aux].slice(0, 6);
    return {
      id: p.id, index: p.index + 1, title: p.c.title, question: p.c.question, role: p.c.role,
      targetChars: repeat ? chars.repeat! : chars.chapter,
      subheadings: repeat ? [1, 1] as [number, number] : [3, 5] as [number, number],
      paragraphs: [p.c.paragraphs.min, p.c.paragraphs.max] as [number, number],
      useName: p.index === 0 || p.index === total - 1 || p.index === Math.floor(total / 2),
      materials,
      ...(repeat ? { note: "### 소제목은 타임라인 항목 label 그대로. 간지·배지·세기 숫자는 UI 카드가 보여 주므로 본문은 해석만." } : {}),
      ...(hints[p.index] ? { sceneHint: hints[p.index] } : {}),
    };
  });
}
