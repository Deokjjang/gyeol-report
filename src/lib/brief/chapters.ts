/**
 * 장 목록(product-narratives) + 장별 재료 배정.
 * 재료 4~6 = trait 2~4 + 보조 재료(좋은 기운·팩폭·안 쓴 기운·MBTI 신호·흐름·상품 근거). 같은 의미 그룹(trait·Fusion·팩폭 포함)은 책 전체 2장, 장마다 다른 영역. 같은 장면 재사용 금지.
 * 반복 장(대운 연도·세운 월)은 타임라인 항목 1개 + 그해·그달 글자가 실제로 건드리는 trait 0~1개(P3.7 1-1).
 */
import type { Domain, MbtiProfile, MyeongriFeature, SceneItem } from "@/data/knowledge-v5/schema";
import { sceneFits, type FactProfile } from "./facts";
import type { CustomerProps } from "./props";
import type { ProductNarrative } from "./knowledge";
import type { Rng } from "./seed";
import { meaningGroup } from "./groups";
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
  "saju_mbti_full/direction": ["ref:unused"],
  // 커리어
  "career_money_study/work-core": ["ref:chart.strength", "ref:mbti"],
  "career_money_study/choice-scene": ["mbti:work"],
  "career_money_study/choice-why": ["ref:chart.elements"],
  // 직무 추천 장, 지금 일 장, 돈 버는 방식 장, 돈 굴리는 원칙 장(P3.7 1-4).
  "career_money_study/fit": ["evidence:jobPicks", "evidence:jobFit"],
  "career_money_study/burden": ["evidence:currentJob", "shadow"],
  "career_money_study/money": ["mbti:money", "evidence:earnStyle"],
  "career_money_study/study": ["mbti:study", "evidence:studyFit"],
  "career_money_study/timing-risk": ["evidence:investment", "ref:chart.thisYear", "ref:chart.currentDayun", "shadow"],
  "career_money_study/plan": ["ref:unused"],
  // 연애
  "love_marriage_child/love-core": ["ref:chart.yinYang", "ref:mbti"],
  "love_marriage_child/spark": ["evidence:loveSignals", "mbti:love"],
  "love_marriage_child/attracted-to": ["evidence:spouseStar", "evidence:partnerMatch"],
  "love_marriage_child/expression": ["evidence:pushPull", "mbti:love"],
  "love_marriage_child/inner-gap": ["shadow", "fusion:tension"],
  "love_marriage_child/conflict-recovery": ["mbti:relationships"],
  "love_marriage_child/marriage": ["evidence:spousePalace"],
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
  "saju_mbti_compatibility/one-thing": ["ref:compatibility.score"],
  // 대운·세운
  "major_fortune/overview": ["ref:timeline.cycles"],
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
  /** 궁합: 두 사람의 MBTI(장면을 번갈아 주고 누구 장면인지 적는다, P3.6 B). */
  readonly mbtiPair?: readonly { readonly who: string; readonly profile: MbtiProfile }[];
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
  /** 타임라인 키 → 그해·그달 글자가 건드리는 trait id(우선순위 순, P3.7 1-1). 반복 장은 이 안에서만 trait를 받는다. */
  readonly touched?: ReadonlyMap<string, readonly string[]>;
  /** 이미 장에 배정한 참조·근거(auxMaterials가 채운다). */
  readonly usedAux?: Set<string>;
};

/** 같은 의미 그룹(trait·Fusion·팩폭)은 책 전체에서 이 장 수까지(P3.7 1-3). */
export const MAX_GROUP_CHAPTERS = 2;
/** 궁합은 두 사람의 같은 의미 그룹을 따로 센다. */
const groupKey = (t: Trait) => `${t.id.match(/^[ab]/)?.[0] ?? ""}${meaningGroup(t.featureId)}`;
/**
 * 성향 키(P3.7 r1 채점: 과숙·원진·정인이 모두 "말을 삼킨다"로 일곱 번 나왔다): 행동 차원 중 가장 센 하나(0.7 이상)와 방향.
 * 의미 그룹이 달라도 성향 키가 같으면 같은 뜻으로 보고 함께 2장까지.
 */
function tendencyKey(src: TraitSource): string | null {
  const [d, v] = Object.entries(src.feature.dimensionTags).sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]) || a[0].localeCompare(b[0]))[0] ?? [];
  return d && Math.abs(v) >= 0.7 ? `${src.trait.id.match(/^[ab]/)?.[0] ?? ""}dim:${d}${v > 0 ? "+" : "-"}` : null;
}
const keysOf = (src: TraitSource) => [groupKey(src.trait), tendencyKey(src)].filter((x): x is string => x !== null);

/** 장 영역 → 소품 줄. 일·돈·배움은 직업, 사랑·결혼은 관계 상태, 사람·혼자는 생활 단계 소품을 먼저 쓴다. */
const PROP_POOL: Record<Domain, readonly ("job" | "relationship" | "stage")[]> = {
  work: ["job", "job"], money: ["job", "stage"], study: ["job", "stage"], love: ["relationship", "stage"], marriage: ["relationship", "relationship"], relationships: ["stage", "relationship"], alone: ["stage", "job"],
};
/** 같은 소품은 책 전체에서 이 횟수까지만 힌트로 준다(P3.6 A1). */
export const MAX_PROP_USES = 2;
/** 장마다 소품 2개를 줄별 커서로 돌려 준다. 책 단위 사용 기록(usedProps)으로 한 소품은 2회까지. */
export function sceneHints(props: CustomerProps, plans: readonly { repeatKey?: string; domains: readonly Domain[] }[]): { hints: (string[] | undefined)[]; usedProps: Record<string, number> } {
  const pools = { job: props.job.props, relationship: props.relationship, stage: props.stage.props };
  const cursor = { job: 0, relationship: 0, stage: 0 };
  const usedProps: Record<string, number> = {};
  const hints = plans.map(p => {
    if (p.repeatKey) return undefined;
    const out: string[] = [];
    for (const line of PROP_POOL[p.domains[0] ?? "relationships"]) {
      const pool = pools[line];
      for (let tries = 0; tries < pool.length; tries++) {
        const x = pool[cursor[line]++ % pool.length];
        if (!x || out.includes(x) || (usedProps[x] ?? 0) >= MAX_PROP_USES) continue;
        out.push(x); usedProps[x] = (usedProps[x] ?? 0) + 1; break;
      }
    }
    return out.length ? out : undefined;
  });
  return { hints, usedProps };
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

type Use = { count: number; domains: Set<Domain>; chapters: Set<string> };
const hasFresh = (ctx: PlanCtx, list: readonly SceneItem[] | undefined, chapterId: string) => (list ?? []).some(s => usable(s, ctx, chapterId));
/** 의미 그룹 사용 기록에 장 하나를 더한다(같은 장 안의 두 번째 사용은 세지 않는다). */
function countGroup(uses: Map<string, Use>, key: string, chapterId: string, domain?: Domain) {
  const u = uses.get(key) ?? { count: 0, domains: new Set<Domain>(), chapters: new Set<string>() };
  if (!u.chapters.has(chapterId)) { u.chapters.add(chapterId); u.count++; }
  if (domain) u.domains.add(domain);
  uses.set(key, u);
}
/** 이 장에 이 trait를 놓을 수 있는가(의미 그룹·성향 키 2장 상한·영역 중복·장면 여부). 상태를 바꾸지 않는다. */
function feasibleDomains(ctx: PlanCtx, src: TraitSource, domains: readonly Domain[], uses: Map<string, Use>, chapterId: string): Domain[] {
  for (const key of keysOf(src)) { const u = uses.get(key); if (!u?.chapters.has(chapterId) && (u?.count ?? 0) >= MAX_GROUP_CHAPTERS) return []; }
  const u = uses.get(groupKey(src.trait));
  return domains.filter(d => !u?.domains.has(d) && hasFresh(ctx, src.feature.scenes[d], chapterId));
}
function assign(ctx: PlanCtx, src: TraitSource, domains: readonly Domain[], uses: Map<string, Use>, chapterId: string): Material | null {
  const ok = feasibleDomains(ctx, src, domains, uses, chapterId);
  if (!ok.length) return null;
  const d = ok[ctx.rng.fork(`${chapterId}:${src.trait.id}:dom`).int(ok.length)];
  const scene = freshScene(src.feature.scenes[d], ctx, `${chapterId}:${src.trait.id}:${d}`, chapterId)!;
  for (const key of keysOf(src)) countGroup(uses, key, chapterId, d);
  src.trait.chapters.push(chapterId);
  return { kind: "trait", traitId: src.trait.id, domain: d, scene, angle: "first" };
}

function auxMaterials(ctx: PlanCtx, chapterId: string, shadowCursor: { i: number }, uses: Map<string, Use>): Material[] {
  const out: Material[] = [];
  // 팩폭·Fusion 참조도 그 trait의 의미 그룹 1장으로 센다(P3.7 1-3: 같은 뜻이 세 장에 나왔다).
  const count = (traitId: string) => { const t = ctx.traits.find(x => x.trait.id === traitId); if (t) for (const key of keysOf(t)) countGroup(uses, key, chapterId); };
  for (const spec of AUX[`${ctx.product}/${chapterId}`] ?? []) {
    // 같은 참조·근거는 책에서 한 장에만(P3.7 r1: 배우자 별·지금 대운·궁합 보완이 두 장에 들어가 같은 말이 반복됐다).
    if ((spec.startsWith("ref:") || spec.startsWith("evidence:")) && ctx.usedAux?.has(spec)) continue;
    ctx.usedAux?.add(spec);
    if (spec.startsWith("ref:")) { const ref = spec.slice(4); if (ctx.has(ref)) out.push({ kind: "ref", ref }); }
    else if (spec.startsWith("mbti:")) {
      if (!ctx.mbti) continue;
      const d = spec.slice(5) as Domain; const scene = freshScene(ctx.mbti.signals[d], ctx, `${chapterId}:mbti:${d}`, chapterId);
      if (scene) out.push({ kind: "mbti", domain: d, scene });
    } else if (spec.startsWith("evidence:")) { const e = ctx.evidence[spec.slice(9)]; if (e) out.push(e); }
    else if (spec === "shadow") { const s = ctx.shadows[shadowCursor.i++]; if (s) { out.push({ kind: "ref", ref: `shadows.${s.id}`, note: `팩폭 재료(연결 trait ${s.traitId})` }); count(s.traitId); } }
    else if (spec === "fusion:tension") {
      const free = (x: TraitSource) => keysOf(x).every(key => (uses.get(key)?.count ?? 0) < MAX_GROUP_CHAPTERS);
      const t = ctx.traits.find(x => x.trait.fusion?.kind === "tension" && free(x)) ?? ctx.traits.find(x => x.trait.fusion?.kind === "conditional" && free(x));
      if (t) { out.push({ kind: "ref", ref: `traits.${t.trait.id}.fusion`, note: "명리와 MBTI가 반대로 당기는 지점" }); count(t.trait.id); }
      else { const s = ctx.shadows[shadowCursor.i++]; if (s) { out.push({ kind: "ref", ref: `shadows.${s.id}`, note: "MBTI 긴장 재료가 없어 명리 안의 팩폭으로 대신" }); count(s.traitId); } }
    }
  }
  return out;
}

const isCore = (t: Trait) => t.family === "dayPillar" || t.family === "dayMaster";

export function planChapters(input: PlanCtx): ChapterBrief[] {
  const ctx: PlanCtx = { ...input, usedAux: input.usedAux ?? new Set<string>() };
  const chars = PRODUCT_CHARS[ctx.product];
  const uses = new Map<string, Use>();
  const shadowCursor = { i: 0 };
  const domainsOf = (cDomains: readonly Domain[]) => ctx.sceneDomains?.length ? [...new Set([...ctx.sceneDomains, ...cDomains.filter(d => ctx.sceneDomains!.includes(d))])] : cDomains;
  const plans = ctx.narrative.chapters.flatMap(c => c.repeat
    ? ctx.timelineKeys.map(key => ({ c, repeatKey: key as string | undefined, id: `${c.id}:${key}` }))
    : [{ c, repeatKey: undefined as string | undefined, id: c.id }]).map((p, index) => {
    const aux = p.repeatKey ? [] : auxMaterials(ctx, p.id, shadowCursor, uses);
    // 재료 4~6: trait 2~4 + 보조. 반복 장은 trait 1.
    const target = p.repeatKey ? 1 : Math.min(4, Math.max(2, Math.min(TRAIT_SLOTS[p.c.role] ?? 2, 6 - aux.length), 4 - aux.length));
    // 학생이 아닌 고객의 연·월 장면에 시험·교과서 장면을 주지 않는다(P3.7 r1: 37세 간호사에게 "평가 전날").
    const domains = domainsOf(p.c.domains as Domain[]).filter(d => !(p.repeatKey && d === "study" && ctx.facts.job !== "student"));
    return { ...p, index, aux, target, domains, traits: [] as Material[] };
  });
  const prefScore = (p: (typeof plans)[number], t: TraitSource) => (ctx.prefer?.(p.c.id, t.trait) ?? 0) * 10 + (p.c.evidenceFamilies?.includes(t.trait.family) ? 2 : 0) + (p.index === 0 && isCore(t.trait) ? 100 : 0);
  // 라운드 로빈: 모든 장이 n번째 trait를 받기 전에는 아무 장도 n+1번째를 받지 않는다. 후보가 적은 장부터.
  for (let round = 1; round <= 4; round++) {
    const open = plans.filter(p => p.traits.length < p.target && p.traits.length < round);
    // 같은 장에 같은 의미 그룹 둘은 넣지 않는다. 반복 장은 그해·그달 글자가 건드리는 trait만(P3.7 1-1).
    const inChapter = (p: (typeof plans)[number], t: TraitSource) => p.traits.some(m => m.kind === "trait" && ctx.traits.some(x => x.trait.id === m.traitId && groupKey(x.trait) === groupKey(t.trait)));
    const cands = (p: (typeof plans)[number]) => ctx.traits.filter(t => (!p.repeatKey || ctx.touched?.get(p.repeatKey)?.includes(t.trait.id)) && !inChapter(p, t) && feasibleDomains(ctx, t, p.domains, uses, p.id).length);
    open.sort((a, b) => cands(a).length - cands(b).length || a.index - b.index);
    for (const p of open) {
      const touchRank = (t: TraitSource) => p.repeatKey ? ctx.touched?.get(p.repeatKey)?.indexOf(t.trait.id) ?? 0 : 0;
      const best = cands(p).sort((a, b) => touchRank(a) - touchRank(b) || prefScore(p, b) - prefScore(p, a) || (uses.get(groupKey(a.trait))?.count ?? 0) - (uses.get(groupKey(b.trait))?.count ?? 0) || b.trait.score - a.trait.score || a.trait.id.localeCompare(b.trait.id))[0];
      if (best) { const m = assign(ctx, best, p.domains, uses, p.id); if (m) p.traits.push(m); }
    }
  }
  // Fusion 참조가 가리키는 trait가 다른 장의 trait 재료로도 나오면 그 Fusion은 그 장에서 이미 쓰인다: 참조를 뺀다(P3.7 r1: 1장 연결을 5장이 다시 씀).
  for (const p of plans) p.aux = p.aux.filter(m => !(m.kind === "ref" && /^traits\..+\.fusion$/.test(m.ref) && plans.some(q => q !== p && q.traits.some(x => x.kind === "trait" && x.traitId === m.ref.split(".")[1]))));
  // 재료가 4개보다 적은 비반복 장은 MBTI 신호(장 영역 → 그 밖 영역) 장면으로 채운다.
  for (const p of plans) {
    if (p.repeatKey || !ctx.mbti) continue;
    const domains: Domain[] = [...p.domains, ...(["alone", "relationships", "work", "study", "money", "love"] as Domain[]).filter(d => !p.domains.includes(d))];
    let turn = p.index;
    for (const d of domains) {
      if (p.traits.length + p.aux.length >= 4) break;
      const owner = ctx.mbtiPair?.length ? ctx.mbtiPair[turn % ctx.mbtiPair.length] : undefined;
      const scene = freshScene((owner?.profile ?? ctx.mbti).signals[d], ctx, `${p.id}:fill:${d}${owner ? `:${owner.who}` : ""}`, p.c.id);
      if (scene) { p.aux.push({ kind: "mbti", domain: d, scene, ...(owner ? { who: owner.who } : {}) }); turn++; }
    }
  }
  // 그래도 4개보다 적으면(MBTI 없음 등) trait를 더 붙이고(4개까지), 마지막으로 원국·흐름 참조를 붙인다.
  const FILL_REFS = ["chart.elements", "chart.yinYang", "chart.climate", "chart.thisYear", "fortunes", "unused", "chart.currentDayun"];
  for (const p of plans) {
    if (p.repeatKey) continue;
    for (const src of ctx.traits) {
      if (p.traits.length + p.aux.length >= 4 || p.traits.length >= 4) break;
      if (p.traits.some(m => m.kind === "trait" && ctx.traits.some(x => x.trait.id === m.traitId && groupKey(x.trait) === groupKey(src.trait)))) continue;
      const m = assign(ctx, src, p.domains, uses, p.id); if (m) p.traits.push(m);
    }
    for (const ref of FILL_REFS) {
      if (p.traits.length + p.aux.length >= 4) break;
      if (ctx.has(ref) && !p.aux.some(m => m.kind === "ref" && m.ref === ref)) p.aux.push({ kind: "ref", ref, note: "앞 장과 다른 각도로만 짧게" });
    }
  }
  // 연·월 항목의 trait는 앞의 일반 장에서 이미 소개된 것만 남긴다(원국 특성은 다시 소개하지 않고 짧게 부른다, P3.7 r1: 연도 key에서 trait가 처음 나와 그림을 새로 그렸다).
  const introducedAt = (traitId: string) => Math.min(...plans.filter(q => !q.repeatKey && q.traits.some(m => m.kind === "trait" && m.traitId === traitId)).map(q => q.index));
  for (const p of plans) if (p.repeatKey) p.traits = p.traits.filter(m => {
    if (m.kind !== "trait" || introducedAt(m.traitId) < p.index) return true;
    const src = ctx.traits.find(x => x.trait.id === m.traitId)!; src.trait.chapters.splice(src.trait.chapters.indexOf(p.id), 1); return false;
  });
  // 같은 trait의 "first"(그림으로 처음 소개)는 책 순서상 가장 앞 장이 받는다. 배정 순서(라운드 로빈)를 따르면 뒤 장이 소개하고 앞 장이 "앞에서 본"을 쓰게 된다(P3.6 B).
  const seenTrait = new Set<string>();
  for (const p of [...plans].sort((a, b) => a.index - b.index)) for (const m of p.traits) if (m.kind === "trait") {
    (m as { angle: string }).angle = seenTrait.has(m.traitId) ? "new-domain" : "first"; seenTrait.add(m.traitId);
  }
  const total = plans.length;
  const hints = ctx.props ? sceneHints(ctx.props, plans).hints : [];
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
