/**
 * 장 목록(product-narratives) + 절 단위 재료 배정(P3.8 1).
 * 절마다 그 절의 질문과 1순위 재료(영역 장면·상품 근거·원국 참조·관계 장면·연·월 항목)를 먼저 놓고, trait는 그다음에 붙인다.
 * trait는 책 전체에서 소개 1회(그 절에서 그림으로) + 적용 2회까지("앞에서 본 ○○" 한 문장 + 그 절의 새 정보), 같은 장 안에서는 1회.
 * 같은 축(의미 그룹·가장 센 행동 차원)은 trait·Fusion·팩폭·MBTI 그늘을 합쳐 책 전체 3회, 한 장에 1회.
 * 반복 장(대운 연도·세운 월)은 타임라인 항목 1개 + 그해·그달 글자가 건드리고 앞에서 소개된 trait 0~1개(P3.7 1-1, 적용 1회로 센다).
 */
import type { CompatTopic, Domain, MbtiProfile, MyeongriFeature, SceneItem, SectionPlan } from "@/data/knowledge-v5/schema";
import { sceneFits, type FactProfile } from "./facts";
import type { CustomerProps } from "./props";
import type { ProductNarrative } from "./knowledge";
import type { Rng } from "./seed";
import { meaningGroup } from "./groups";
import type { Brief, ChapterBrief, Material, Trait } from "./schema";
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

/** trait 적용(소개 뒤 다시 부르기)은 책 전체에서 이 횟수까지. */
export const MAX_TRAIT_APPLIES = 2;
/** 같은 축(의미 그룹·가장 센 행동 차원)은 책 전체에서 이 횟수까지(소개 1 + 적용 2). */
export const MAX_AXIS_USES = 3;
/** 한 장에서 새로 소개하는 trait(새 그림)는 이 수까지(앞 장에 소개가 몰리지 않게). */
export const MAX_INTROS_PER_CHAPTER = 2;

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
  /** 고객 생활 소품(P3.5 A1). 없으면(궁합) 장면 변주 힌트를 넣지 않는다. */
  readonly props?: CustomerProps;
  /** 타임라인 키 → 그해·그달 글자가 건드리는 trait id(우선순위 순, P3.7 1-1). 반복 장은 이 안에서만 trait를 받는다. */
  readonly touched?: ReadonlyMap<string, readonly string[]>;
  /** 전환 해(keyEntries)가 건드리는 trait와 어떻게(전환 장 전용, P3.8 1). */
  readonly transitionTouched?: readonly { readonly traitId: string; readonly how: string }[];
  /** 궁합 관계 장면(P3.8 3): 이 관계 유형의 주제들. childAge는 부모·자녀에서 자녀 나이대. */
  readonly relScenes?: { readonly topics: readonly CompatTopic[]; readonly childAge?: "minor" | "adult" };
  /** MBTI 그늘이 차지하는 축(가장 센 행동 차원). */
  readonly mbtiAxes?: readonly string[];
  /** 이미 장에 배정한 참조·근거. */
  readonly usedAux?: Set<string>;
};

const sideOf = (t: Trait) => t.id.match(/^[ab]/)?.[0] ?? "";
const groupKey = (t: Trait) => `${sideOf(t)}${meaningGroup(t.featureId)}`;
/** 가장 센 행동 차원(0.6 이상)과 방향. 의미 그룹이 달라도 같은 차원·방향이면 같은 축이다(P3.7 r1: 과숙·원진·정인이 모두 "말을 삼킨다"). */
export function topDimension(tags: Readonly<Record<string, number>>, min = 0.6): string | null {
  const [d, v] = Object.entries(tags).sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]) || a[0].localeCompare(b[0]))[0] ?? [];
  return d && Math.abs(v) >= min ? `dim:${d}${v > 0 ? "+" : "-"}` : null;
}
export const axesOf = (src: TraitSource): string[] => { const d = topDimension(src.feature.dimensionTags); return [groupKey(src.trait), ...(d ? [`${sideOf(src.trait)}${d}`] : [])]; };

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
const hasFresh = (ctx: PlanCtx, list: readonly SceneItem[] | undefined, chapterId: string) => (list ?? []).some(s => usable(s, ctx, chapterId));
const isCore = (t: Trait) => t.family === "dayPillar" || t.family === "dayMaster";

/** 배정 장부: trait 소개·적용, 축 사용, 장마다 쓴 trait·축. */
class Ledger {
  readonly trait = new Map<string, { intro: string | null; applies: string[] }>();
  readonly axis = new Map<string, { count: number; chapters: Set<string> }>();
  readonly warnings: string[] = [];
  introduced(id: string) { return Boolean(this.trait.get(id)?.intro); }
  inChapter(id: string, chapter: string) { const u = this.trait.get(id); return u?.intro === chapter || Boolean(u?.applies.includes(chapter)); }
  axisFree(keys: readonly string[], chapter: string) { return keys.every(k => { const a = this.axis.get(k); return !a?.chapters.has(chapter) && (a?.count ?? 0) < MAX_AXIS_USES; }); }
  /** mode: intro = 아직 소개 안 된 것만, apply = 소개된 것만(적용 2회 안), any = 둘 다. */
  can(src: TraitSource, chapter: string, mode: "intro" | "apply" | "any"): boolean {
    const id = src.trait.id, intro = this.introduced(id);
    if (this.inChapter(id, chapter)) return false;
    if (mode === "intro" && intro) return false;
    if (mode === "apply" && !intro) return false;
    if (intro && this.trait.get(id)!.applies.length >= MAX_TRAIT_APPLIES) return false;
    return this.axisFree(axesOf(src), chapter);
  }
  /** 쓰고 각도(first·new-domain)를 돌려준다. */
  use(src: TraitSource, chapter: string): "first" | "new-domain" {
    const u = this.trait.get(src.trait.id) ?? { intro: null, applies: [] };
    const angle = u.intro ? "new-domain" : "first";
    if (u.intro) u.applies.push(chapter); else u.intro = chapter;
    this.trait.set(src.trait.id, u);
    this.useAxes(axesOf(src), chapter);
    if (!src.trait.chapters.includes(chapter)) src.trait.chapters.push(chapter);
    return angle;
  }
  useAxes(keys: readonly string[], chapter: string) { for (const k of keys) { const a = this.axis.get(k) ?? { count: 0, chapters: new Set<string>() }; a.count++; a.chapters.add(chapter); this.axis.set(k, a); } }
}

type Section = { q: string; domain: Domain; materials: Material[] };
type Plan = { c: ProductNarrative["chapters"][number]; repeatKey?: string; id: string; index: number; domains: Domain[]; sections: Section[]; aux: Material[] };

export type PlanResult = { readonly chapters: ChapterBrief[]; readonly plan: NonNullable<Brief["plan"]> };

export function planChapters(input: PlanCtx): PlanResult {
  const ctx: PlanCtx = { ...input, usedAux: input.usedAux ?? new Set<string>() };
  const chars = PRODUCT_CHARS[ctx.product];
  const ledger = new Ledger();
  const usedShadows = new Set<string>();
  const usedRel = new Set<string>(), topicUse = new Map<string, number>();
  const byId = new Map(ctx.traits.map(t => [t.trait.id, t]));
  const plans: Plan[] = ctx.narrative.chapters.flatMap(c => c.repeat
    ? ctx.timelineKeys.map(key => ({ c, repeatKey: key as string | undefined, id: `${c.id}:${key}` }))
    : [{ c, repeatKey: undefined as string | undefined, id: c.id }]).map((p, index) => ({
    ...p, index, sections: [], aux: [],
    // 학생이 아닌 고객의 연·월 장면에 시험·교과서 장면을 주지 않는다(P3.7 r1: 37세 간호사에게 "평가 전날").
    domains: (p.c.domains as Domain[]).filter(d => !(p.repeatKey && d === "study" && ctx.facts.job !== "student")),
  }));

  const mbtiOf = (turn: number) => ctx.mbtiPair?.length ? ctx.mbtiPair[turn % ctx.mbtiPair.length] : ctx.mbti ? { who: undefined, profile: ctx.mbti } : undefined;
  /** trait 하나를 이 절에 놓는다(장면은 needScene일 때만, 궁합은 관계 장면이 장면이라 trait 장면을 주지 않는다). */
  const place = (p: Plan, spec: SectionPlan, src: TraitSource, needScene: boolean): Material => {
    const domains = [spec.domain, ...p.domains.filter(d => d !== spec.domain)];
    const d = (needScene ? domains.find(x => hasFresh(ctx, src.feature.scenes[x], p.c.id)) : undefined) ?? spec.domain;
    const scene = needScene ? freshScene(src.feature.scenes[d], ctx, `${p.id}:${src.trait.id}:${d}`, p.c.id) : undefined;
    const angle = ledger.use(src, p.id);
    return { kind: "trait", traitId: src.trait.id, domain: d, ...(scene ? { scene } : {}), angle };
  };
  /** 절의 질문·영역에 맞는 trait를 고른다. */
  const pickTrait = (p: Plan, spec: SectionPlan, mode: NonNullable<SectionPlan["trait"]>, needScene: boolean, extraDims: readonly string[] = [], onlyNew = false): TraitSource | null => {
    if (mode === "none") return null;
    const dims = [...(spec.dims ?? []), ...extraDims, ...(p.c.dimensionFocus ?? [])];
    // intro = 소개 우선(없으면 적용), core = 핵심 trait(이미 뒤 장에서 쓰였어도 책 순서상 여기가 소개가 된다).
    const full = ctx.traits.filter(t => ledger.trait.get(t.trait.id)?.intro === p.id).length >= MAX_INTROS_PER_CHAPTER;
    if (mode === "intro" && !full) { const x = pickTrait(p, spec, "any", needScene, extraDims, true); if (x) return x; }
    const m = mode === "core" || mode === "intro" ? "any" : mode === "any" && full ? "apply" : mode;
    const cands = ctx.traits.filter(t => (!onlyNew || !ledger.introduced(t.trait.id)) && (!spec.side || sideOf(t.trait) === spec.side) && (mode !== "core" || isCore(t.trait)) && ledger.can(t, p.id, m)
      && (!needScene || [spec.domain, ...p.domains].some(d => hasFresh(ctx, t.feature.scenes[d], p.c.id))));
    const score = (t: TraitSource) => dims.reduce((a, d) => a + Math.abs(t.feature.dimensionTags[d] ?? 0), 0) * 3
      + (p.c.evidenceFamilies?.includes(t.trait.family) ? 1.5 : 0) + (ledger.introduced(t.trait.id) ? 0 : 1) + (p.index === 0 && isCore(t.trait) ? 5 : 0) + t.trait.score * 0.05;
    return cands.sort((a, b) => score(b) - score(a) || a.trait.id.localeCompare(b.trait.id))[0] ?? null;
  };
  /** 관계 장면: 이 관계 유형의 주제 중 덜 쓴 주제, 절 질문의 차원과 맞는 장면. 같은 장면은 책에서 한 번, 한 장에 같은 주제 둘은 없다. */
  const pickRel = (p: Plan, spec: SectionPlan): { m: Extract<Material, { kind: "rel" }>; dims: readonly string[] } | null => {
    const rs = ctx.relScenes; if (!rs) return null;
    const dims = [...(spec.dims ?? []), ...(p.c.dimensionFocus ?? [])];
    const inChapter = new Set(p.sections.flatMap(s => s.materials.flatMap(m => m.kind === "rel" ? [m.topic] : [])));
    const cands = rs.topics.flatMap(t => t.scenes.filter(s => !usedRel.has(s.text) && (!s.ages || s.ages === "any" || !rs.childAge || s.ages === rs.childAge)).map(s => ({ t, s })))
      .filter(x => !inChapter.has(x.t.label));
    if (!cands.length) return null;
    const r = ctx.rng.fork(`${p.id}:rel:${p.sections.length}`);
    const jitter = new Map(cands.map(x => [x.s.text, r.next()]));
    const score = (x: (typeof cands)[number]) => dims.reduce((a, d) => a + Math.abs(x.s.dims[d] ?? 0), 0) * 2 - (topicUse.get(x.t.key) ?? 0) * 3 + jitter.get(x.s.text)!;
    const best = [...cands].sort((a, b) => score(b) - score(a))[0];
    usedRel.add(best.s.text); topicUse.set(best.t.key, (topicUse.get(best.t.key) ?? 0) + 1);
    return { m: { kind: "rel", topic: best.t.label, scene: best.s.text }, dims: Object.keys(best.s.dims) };
  };
  const takeAux = (key: string) => { if (ctx.usedAux!.has(key)) return false; ctx.usedAux!.add(key); return true; };

  let mbtiTurn = 0;
  const mbtiScene = (p: Plan, domains: readonly Domain[], label: string): Material | null => {
    const owner = mbtiOf(mbtiTurn); if (!owner) return null;
    for (const d of domains) {
      const scene = freshScene(owner.profile.signals[d], ctx, `${p.id}:${label}:${d}`, p.c.id);
      if (scene) { mbtiTurn++; return { kind: "mbti", domain: d, scene, ...(owner.who ? { who: owner.who } : {}) }; }
    }
    return null;
  };
  // 다른 절의 1순위 재료(참조·근거)는 빈 절 보충에 쓰지 않는다(P3.8: 보충이 뒤 장의 계절 참조를 먼저 가져갔다).
  const reserved = new Set(plans.flatMap(p => (p.c.sections ?? []).flatMap(s => s.use.filter(u => /^(ref|ev):/.test(u)))));
  type Slot = { p: Plan; spec: SectionPlan; sec: Section; traitDone: boolean; relDims: string[] };
  const slots: Slot[] = [];
  for (const p of plans) if (!p.repeatKey) for (const spec of p.c.sections ?? []) { const sec: Section = { q: spec.q, domain: spec.domain, materials: [] }; p.sections.push(sec); slots.push({ p, spec, sec, traitDone: false, relDims: [] }); }
  // ⓪ 핵심 trait 절(1장 등): 같은 장 같은 축 규칙에 팩폭이 먼저 자리를 잡아 핵심 그림이 빠지지 않게 가장 먼저.
  for (const sl of slots) if (sl.spec.trait === "core") {
    const needScene = sl.spec.use.includes("scene") && !ctx.relScenes;
    const src = pickTrait(sl.p, sl.spec, "core", needScene);
    if (src) { sl.sec.materials.push(place(sl.p, sl.spec, src, needScene)); sl.traitDone = true; }
  }
  const KEY_USES = new Set(["shadow", "fusion", "mbtiShadow"]);
  const takeShadow = (p: Plan, spec: SectionPlan, sec: Section): boolean => {
    const s = ctx.shadows.find(x => !usedShadows.has(x.id) && byId.has(x.traitId) && (!spec.side || sideOf(byId.get(x.traitId)!.trait) === spec.side) && ledger.can(byId.get(x.traitId)!, p.id, "any"));
    if (!s) return false;
    usedShadows.add(s.id);
    sec.materials.push(place(p, spec, byId.get(s.traitId)!, false), { kind: "ref", ref: `shadows.${s.id}`, note: `팩폭 재료(연결 trait ${s.traitId})` });
    return true;
  };
  // ① 팩폭·긴장·MBTI 그늘이 핵심인 절을 먼저(책 순서): 앞 장의 trait 적용이 예산을 다 써서 팩폭 장이 비지 않게.
  for (const sl of slots) for (const use of sl.spec.use.filter(u => KEY_USES.has(u))) {
    const { p, spec, sec } = sl;
    if (use === "shadow") { if (takeShadow(p, spec, sec)) sl.traitDone = true; }
    else if (use === "fusion") {
      const src = ctx.traits.find(x => x.trait.fusion?.kind === "tension" && ledger.can(x, p.id, "any")) ?? ctx.traits.find(x => x.trait.fusion?.kind === "conditional" && ledger.can(x, p.id, "any"));
      // MBTI 긴장 연결이 없으면(MBTI 없음 등) 명리 안의 팩폭으로 대신한다.
      if (!src) { if (takeShadow(p, spec, sec)) sl.traitDone = true; continue; }
      sec.materials.push(place(p, spec, src, false), { kind: "ref", ref: `traits.${src.trait.id}.fusion`, note: "명리와 MBTI가 반대로 당기는 지점" });
      sl.traitDone = true;
    } else if (use === "mbtiShadow") {
      const axes = ctx.mbtiAxes ?? [];
      if (ctx.mbti && ledger.axisFree(axes, p.id) && takeAux(use)) { sec.materials.push({ kind: "ref", ref: "mbti.shadows" }); ledger.useAxes(axes, p.id); }
    }
  }
  // ② 나머지는 절 자리(첫째 절 → 둘째 절 …)를 장을 가로질러 돌며: 1순위 재료 → trait. trait 예산이 앞 장에 몰리지 않는다.
  const width = Math.max(0, ...plans.map(p => p.sections.length));
  for (let pos = 0; pos < width; pos++) for (const sl of slots.filter(x => x.p.sections.indexOf(x.sec) === pos)) {
    const { p, spec, sec } = sl;
    for (const use of spec.use) {
      if (use.startsWith("ref:")) { const ref = use.slice(4); if (ctx.has(ref) && takeAux(use)) sec.materials.push({ kind: "ref", ref }); }
      else if (use.startsWith("ev:")) { const e = ctx.evidence[use.slice(3)]; if (e && takeAux(use)) sec.materials.push(e); }
      else if (use.startsWith("recap:")) sec.materials.push({ kind: "ref", ref: `chapters.${use.slice(6)}`, note: "앞 장을 종합한다: 새 특성·새 그림 없이 그 장의 근거로 이번 행동 하나" });
      else if (use === "mbti") { const m = mbtiScene(p, [spec.domain], "mbti"); if (m) sec.materials.push(m); }
      else if (use === "rel") { const r = pickRel(p, spec); if (r) { sec.materials.push(r.m); sl.relDims.push(...r.dims); sec.q = sec.q.replace("{topic}", r.m.topic); } }
    }
    // MBTI 장면이 주재료인데 MBTI가 없으면 그 영역의 trait 장면이 주재료다.
    const noMbti = spec.use.includes("mbti") && !mbtiOf(0);
    const needScene = (spec.use.includes("scene") || noMbti) && !ctx.relScenes;
    const mode = spec.trait && spec.trait !== "none" ? spec.trait : needScene ? "any" : "none";
    if (!sl.traitDone && !spec.use.includes("touched")) {
      const src = pickTrait(p, spec, mode, needScene, sl.relDims);
      if (src) sec.materials.unshift(place(p, spec, src, needScene));
      // 장면을 줄 trait가 없으면(소개·적용·축 상한) MBTI 장면으로 대신한다.
      else if (needScene) { const m = mbtiScene(p, [spec.domain], "mbti-fill"); if (m) sec.materials.push(m); }
    }
  }
  // ③ 전환 장(전환 해가 건드린 trait)과 연·월 항목: 책 순서상 앞 장에서 소개된 trait만, 새 그림·장면 없이 짧게(적용 1회로 센다).
  const order = new Map(plans.map(p => [p.id, p.index]));
  const firstAt = (id: string) => Math.min(...plans.filter(q => q.sections.some(s => s.materials.some(m => m.kind === "trait" && m.traitId === id))).map(q => q.index));
  for (const sl of slots) if (sl.spec.use.includes("touched")) {
    const { p, sec } = sl;
    let n = 0;
    for (const t of (ctx.transitionTouched ?? []).filter((x, i, a) => a.findIndex(y => y.traitId === x.traitId) === i && byId.has(x.traitId) && firstAt(x.traitId) < p.index)) {
      if (n >= 2 || !ledger.can(byId.get(t.traitId)!, p.id, "apply")) continue;
      ledger.use(byId.get(t.traitId)!, p.id); n++;
      sec.materials.push({ kind: "ref", ref: `traits.${t.traitId}`, note: `전환 해가 건드림(${t.how}): "앞에서 본" 한 문장으로만` });
    }
  }
  for (const p of plans) if (p.repeatKey) {
    const id = (ctx.touched?.get(p.repeatKey) ?? []).find(t => byId.has(t) && firstAt(t) < p.index && ledger.can(byId.get(t)!, p.id, "apply"));
    if (id) { ledger.use(byId.get(id)!, p.id); p.aux.push({ kind: "ref", ref: `traits.${id}`, note: "짧게만" }); }
  }
  // ④ 빈 절 보충: 그 절 영역의 trait 장면 → MBTI 장면(그 영역 → 다른 영역) → 관계 장면 → 아무 절의 1순위도 아닌 원국 참조. 그래도 비면 절을 뺀다.
  const ALL: Domain[] = ["alone", "relationships", "work", "study", "money", "love"];
  for (const { p, spec, sec } of slots) {
    if (sec.materials.length) continue;
    // 마지막 장은 새 특성을 소개하지 않는다(앞 장 종합).
    const src = pickTrait(p, spec, p.index === plans.length - 1 ? "apply" : "any", !ctx.relScenes);
    if (src) { sec.materials.push(place(p, spec, src, !ctx.relScenes)); continue; }
    if (p.index < plans.length - 1 && takeShadow(p, spec, sec)) continue;
    const m = ctx.relScenes ? pickRel(p, spec)?.m : mbtiScene(p, [spec.domain, ...ALL.filter(d => d !== spec.domain)], "fill");
    if (m) { sec.materials.push(m); if (m.kind === "rel") sec.q = sec.q.replace("{topic}", m.topic); continue; }
    const ref = ["chart.elements", "chart.yinYang", "chart.climate", "fortunes", "unused", "chart.thisYear"].find(r => !reserved.has(`ref:${r}`) && ctx.has(r) && takeAux(`ref:${r}`));
    if (ref) { sec.materials.push({ kind: "ref", ref, note: "앞 장과 다른 각도로만 짧게" }); continue; }
    // 마지막 두 장은 같은 영역의 앞 장을 종합하고(새 재료 없이), 그 밖에는 MBTI 기능 설명을 한 번만.
    if (p.index >= plans.length - 2) {
      const prev = plans.find(q => q.index < p.index && !q.repeatKey && q.domains.includes(spec.domain) && !plans.some(r => r.sections.some(x => x.materials.some(m => m.kind === "ref" && m.ref === `chapters.${q.c.id}`))));
      if (prev) { sec.materials.push({ kind: "ref", ref: `chapters.${prev.c.id}`, note: "앞 장을 종합한다: 새 특성·새 그림 없이 그 장의 근거로 이번 행동 하나" }); continue; }
    }
    if (ctx.mbti && takeAux("ref:mbti.functions")) sec.materials.push({ kind: "ref", ref: "mbti.functions", note: "이 절의 질문에 맞는 기능 하나만(같은 기능 근거는 책에서 2번까지)" });
  }
  for (const p of plans) p.sections = p.sections.filter(s => s.materials.length);
  // 소개(first)는 책 순서상 가장 앞 절이 받는다(①·② 배정 순서와 책 순서가 다르다). 장부의 소개 장도 책 순서로 다시 맞춘다.
  const seen = new Set<string>();
  for (const p of [...plans].sort((a, b) => a.index - b.index)) for (const s of p.sections) for (const m of s.materials) if (m.kind === "trait") {
    (m as { angle: string }).angle = seen.has(m.traitId) ? "new-domain" : "first"; seen.add(m.traitId);
  }
  for (const [id, u] of ledger.trait) { const all = [u.intro!, ...u.applies].sort((a, b) => (order.get(a) ?? 0) - (order.get(b) ?? 0)); ledger.trait.set(id, { intro: all[0], applies: all.slice(1) }); }
  for (const t of ctx.traits) t.trait.chapters.sort((a, b) => (order.get(a) ?? 0) - (order.get(b) ?? 0));

  const total = plans.length;
  const hints = ctx.props ? sceneHints(ctx.props, plans).hints : [];
  const chapters = plans.map((p): ChapterBrief => {
    const repeat = Boolean(p.repeatKey);
    const flat = repeat ? [{ kind: "timeline" as const, entryKey: p.repeatKey! }, ...p.aux] : p.sections.flatMap(s => s.materials).slice(0, 12);
    return {
      id: p.id, index: p.index + 1, title: p.c.title, question: p.c.question, role: p.c.role,
      // 절이 4개보다 적으면(재료가 적은 고객) 목표 분량도 절 수만큼만: 같은 말로 채우지 않게(길이는 정보량의 결과).
      targetChars: repeat ? chars.repeat! : p.sections.length >= 4 ? chars.chapter : [Math.round(chars.chapter[0] * Math.max(1, p.sections.length) / 4), Math.round(chars.chapter[1] * Math.max(1, p.sections.length) / 4)],
      subheadings: repeat ? [1, 1] : [p.sections.length, p.sections.length],
      paragraphs: [p.c.paragraphs.min, p.c.paragraphs.max],
      useName: p.index === 0 || p.index === total - 1 || p.index === Math.floor(total / 2),
      materials: flat.length ? flat : [{ kind: "ref", ref: "chart.dayMaster" }],
      ...(repeat ? {} : { sections: p.sections }),
      ...(repeat ? { note: "### 소제목은 타임라인 항목 label 그대로. 간지·배지·세기 숫자는 UI 카드가 보여 주므로 본문은 해석만." } : {}),
      ...(hints[p.index] ? { sceneHint: hints[p.index] } : {}),
    };
  });
  // 배정 기록과 상한 경고(안전망이 원고의 실제 언급과 비교한다).
  const traits: NonNullable<Brief["plan"]>["traits"] = {};
  for (const t of ctx.traits) { const u = ledger.trait.get(t.trait.id); if (u) traits[t.trait.id] = { intro: u.intro, applies: [...u.applies], axes: axesOf(t) }; }
  const axes = Object.fromEntries([...ledger.axis].map(([k, v]) => [k, v.count]));
  for (const [id, u] of Object.entries(traits)) if (u.applies.length > MAX_TRAIT_APPLIES) ledger.warnings.push(`${id} 적용 ${u.applies.length}회`);
  for (const [k, n] of Object.entries(axes)) if (n > MAX_AXIS_USES) ledger.warnings.push(`축 ${k} ${n}회`);
  return { chapters, plan: { traits, axes, warnings: ledger.warnings } };
}
