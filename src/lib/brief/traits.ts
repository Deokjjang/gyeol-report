/**
 * trait 선택: 감지된 요소마다 점수 = 강도 × 위치 가중치(일주 > 월지 > 기타) × 희소성 × MBTI 연결 강도 × 상품 관련도.
 * 가족 다양성 제약(일간·일주 1, 오행·음양·조후 1~2, 십성 2~3, 신살·귀인 2~3, 운성·합충 1~2, 천간·지지 0~1) 안에서 10개(8~12)를 고른다.
 * Fusion은 정확한 유형 > 인지기능(주·부 > 3차·열등) > 선호 글자 순.
 */
import type { FeatureFamily, FusionRule, MbtiLink, MbtiProfile, MbtiType, MyeongriFeature } from "@/data/knowledge-v5/schema";
import type { ChartPosition } from "@/lib/saju/detections/types";
import type { TenGod, SajuCalcResult } from "@/lib/saju/types";
import frequency from "./data/feature-frequency.json";
import type { FeatureHit } from "./featureTypes";
import type { Knowledge } from "./knowledge";
import { POSITION_KO, TEN_GOD_GROUP } from "./labels";
import type { Rng } from "./seed";
import { pickN } from "./seed";
import type { Trait } from "./schema";

export type ProductKey = "saju_mbti_full" | "career_money_study" | "love_marriage_child" | "saju_mbti_compatibility" | "major_fortune" | "annual_fortune";

const STRENGTH = { strong: 1, medium: 0.75, weak: 0.5 } as const;
const POSITION_WEIGHT: Record<ChartPosition, number> = { day: 1.5, month: 1.25, year: 1, hour: 1 };
/** 생성 전 기본 빈도(가족 평균). tools/p2-brief/feature-frequency.ts가 실측 표(data/feature-frequency.json)를 만든다. */
const FAMILY_FREQ: Record<FeatureFamily, number> = { dayMaster: 0.1, dayPillar: 0.017, stem: 0.25, branch: 0.3, tenGod: 0.5, tenGodBalance: 0.3, shinsal: 0.15, gwiin: 0.2, twelveStage: 0.3, relation: 0.25, element: 0.3, yinYang: 0.4, climate: 0.025, structure: 0.2 };
const FREQ = frequency as Record<string, number>;
const BASE_FAMILY: Partial<Record<FeatureFamily, number>> = { dayPillar: 1.3, dayMaster: 1.1, tenGod: 1.1, shinsal: 1.1, gwiin: 1, element: 1, yinYang: 0.9, climate: 0.9, structure: 1, tenGodBalance: 1, twelveStage: 0.9, relation: 0.95, stem: 0.8, branch: 0.8 };
const PRODUCT_FAMILY: Record<ProductKey, Partial<Record<FeatureFamily, number>>> = {
  saju_mbti_full: BASE_FAMILY,
  saju_mbti_compatibility: BASE_FAMILY,
  career_money_study: { ...BASE_FAMILY, tenGod: 1.3, structure: 1.3, tenGodBalance: 1.2, twelveStage: 1.1, gwiin: 1.1, yinYang: 0.7, climate: 0.8 },
  love_marriage_child: { ...BASE_FAMILY, shinsal: 1.2, branch: 1, relation: 1.1, yinYang: 1.1, structure: 0.8, tenGodBalance: 0.9 },
  major_fortune: { ...BASE_FAMILY, element: 1.2, climate: 1.1, twelveStage: 1.1, structure: 1.1 },
  annual_fortune: { ...BASE_FAMILY, element: 1.2, climate: 1.1, twelveStage: 1.1, structure: 1.1 },
};
const PRODUCT_ID_BOOST: Partial<Record<ProductKey, Record<string, number>>> = {
  love_marriage_child: { "shinsal:DOHWASAL": 1.4, "shinsal:HONGYEOMSAL": 1.4, "shinsal:TWELVE_NYEONSAL": 1.2, "shinsal:WONJIN": 1.2, "shinsal:GOSINSAL": 1.2, "shinsal:GWASUKSAL": 1.2, "shinsal:EUMCHAK_YANGCHA": 1.2 },
  career_money_study: { "shinsal:TWELVE_JANGSEONGSAL": 1.3, "shinsal:YEOKMASAL": 1.2, "shinsal:GOEGANG": 1.2, "shinsal:YANGIN": 1.2, "shinsal:HYEONCHIMSAL": 1.2, "gwiin:MUN_CHANG_GWIIN": 1.3, "gwiin:HAK_DANG_GWIIN": 1.3, "gwiin:JAEGO": 1.3, "gwiin:AMROK": 1.2 },
};
const LOW_INFO = /:BALANCED$/;

export const GROUPS: readonly { key: string; families: readonly FeatureFamily[]; min: number; max: number }[] = [
  { key: "core", families: ["dayMaster", "dayPillar"], min: 1, max: 1 },
  { key: "elementYinYang", families: ["element", "yinYang", "climate"], min: 1, max: 2 },
  { key: "tenGod", families: ["tenGod", "tenGodBalance", "structure"], min: 2, max: 3 },
  { key: "shinsalGwiin", families: ["shinsal", "gwiin"], min: 2, max: 3 },
  { key: "stageRelation", families: ["twelveStage", "relation"], min: 1, max: 2 },
  { key: "glyph", families: ["stem", "branch"], min: 0, max: 1 },
];
export const TRAIT_TARGET = 10;
const groupOf = (f: FeatureFamily) => GROUPS.find(g => g.families.includes(f))!.key;

export type FactsForFusion = { readonly mbti: MbtiType | null; readonly birthTimeKnown: boolean; readonly genderKnown: boolean; readonly contextKnown: boolean };

const ROLE_RANK: Record<string, number> = { 주기능: 3.5, 부기능: 3, "3차기능": 2, 열등기능: 1.5 };
function linkRank(target: string, profile: MbtiProfile): number {
  if (target === profile.type) return 4;
  const fn = profile.cognitiveFunctions.find(c => c.code === target);
  if (fn) return ROLE_RANK[fn.role] ?? 1;
  if (target.length === 1 && profile.type.includes(target)) return 1;
  return 0;
}

export type FusionChoice = { readonly target: string; readonly kind: "resonance" | "tension" | "conditional"; readonly why: string; readonly scene?: FusionRule["scene"]; readonly source: "fusion" | "mbtiLink"; readonly rank: number };
export function chooseFusion(featureId: string, feature: MyeongriFeature, k: Knowledge, f: FactsForFusion): FusionChoice | null {
  if (!f.mbti) return null;
  const profile = k.mbti.get(f.mbti); if (!profile) return null;
  const ok = (r: FusionRule) => r.factBoundary.requires.every(q => q === "mbtiKnown" || (q === "exactTime" || q === "approximateTime" ? f.birthTimeKnown : q === "genderKnown" ? f.genderKnown : f.contextKnown));
  const rules = (k.fusionByFeature.get(featureId) ?? []).filter(ok).map(r => ({ r, rank: linkRank(r.mbtiTarget, profile) })).filter(x => x.rank > 0)
    .sort((a, b) => b.rank - a.rank || Math.abs(b.r.score ?? 0) - Math.abs(a.r.score ?? 0) || a.r.id.localeCompare(b.r.id));
  if (rules[0]) return { target: rules[0].r.mbtiTarget, kind: rules[0].r.kind, why: rules[0].r.why, scene: rules[0].r.scene, source: "fusion", rank: rules[0].rank };
  const links = feature.mbtiLinks.map((l: MbtiLink) => ({ l, rank: linkRank(l.target, profile) })).filter(x => x.rank > 0).sort((a, b) => b.rank - a.rank || a.l.target.localeCompare(b.l.target));
  return links[0] ? { target: links[0].l.target, kind: links[0].l.kind, why: links[0].l.why, source: "mbtiLink", rank: links[0].rank } : null;
}
const mbtiFactor = (c: FusionChoice | null) => !c ? 1 : c.source === "mbtiLink" ? 1.05 : c.rank >= 4 ? 1.35 : c.rank >= 3 ? 1.25 : c.rank >= 1.5 ? 1.15 : 1.08;

export type ScoredHit = { readonly hit: FeatureHit; readonly feature: MyeongriFeature; readonly score: number; readonly fusion: FusionChoice | null; readonly group: string };

export function scoreHits(hits: readonly FeatureHit[], k: Knowledge, product: ProductKey, f: FactsForFusion): ScoredHit[] {
  const out: ScoredHit[] = [];
  for (const hit of hits) {
    const feature = k.features.get(hit.id); if (!feature) continue;
    const pos = hit.family === "dayMaster" || hit.family === "dayPillar" ? 1.5 : Math.max(1, ...hit.positions.map(p => POSITION_WEIGHT[p]));
    const freq = Math.max(0.001, FREQ[hit.id] ?? FAMILY_FREQ[hit.family]);
    const rarity = 1 + Math.min(1, Math.log10(1 / freq) / 3);
    const fusion = chooseFusion(hit.id, feature, k, f);
    const relevance = (PRODUCT_FAMILY[product][hit.family] ?? 1) * (PRODUCT_ID_BOOST[product]?.[hit.id] ?? 1) * (LOW_INFO.test(hit.id) ? 0.4 : 1);
    const intensity = STRENGTH[hit.strength] * Math.min(1.3, 1 + 0.1 * (hit.count - 1));
    out.push({ hit, feature, fusion, group: groupOf(hit.family), score: Math.round(intensity * pos * rarity * mbtiFactor(fusion) * relevance * 1000) / 1000 });
  }
  return out.sort((a, b) => b.score - a.score || a.hit.id.localeCompare(b.hit.id));
}

/** 같은 이름의 신살(망신살·십이신살 망신살 등)은 하나만. */
const rootName = (s: ScoredHit) => s.feature.name.replace(/·.*$/, "");

export function selectTraits(scored: readonly ScoredHit[], target = TRAIT_TARGET): ScoredHit[] {
  const chosen: ScoredHit[] = []; const roots = new Set<string>();
  const count = (g: string) => chosen.filter(c => c.group === g).length;
  const canTake = (s: ScoredHit) => !chosen.includes(s) && !roots.has(rootName(s)) && count(s.group) < GROUPS.find(g => g.key === s.group)!.max;
  const take = (s: ScoredHit) => { chosen.push(s); roots.add(rootName(s)); };
  for (const g of GROUPS) for (const s of scored.filter(x => x.group === g.key)) { if (count(g.key) >= g.min) break; if (canTake(s)) take(s); }
  for (const s of scored) { if (chosen.length >= target) break; if (canTake(s)) take(s); }
  return [...chosen].sort((a, b) => b.score - a.score || a.hit.id.localeCompare(b.hit.id));
}

const MAIN_ORDER: readonly ChartPosition[] = ["day", "month", "year", "hour"];
export function mainPosition(hit: FeatureHit): ChartPosition | null { return MAIN_ORDER.find(p => hit.positions.includes(p)) ?? null; }

export type GroupScores = Readonly<Record<"PEER" | "OUTPUT" | "WEALTH" | "OFFICER" | "RESOURCE", number>>;
const GROUP_WORD: Record<string, keyof GroupScores> = { 비겁: "PEER", 식상: "OUTPUT", 재성: "WEALTH", 관성: "OFFICER", 인성: "RESOURCE" };
/** 과사용 문장에 적힌 조건(신강·신약, 십성 묶음 많음·약함)이 이 원국과 어긋나면 고르지 않는다(근거 없는 팩폭 방지). 임계값은 extractSajuTags와 같다(≥2.5 강, <1 약). */
export function overuseFits(line: string, strengthLevel: string, groups?: GroupScores): boolean {
  const weak = strengthLevel === "WEAK" || strengthLevel === "VERY_WEAK", strong = strengthLevel === "STRONG" || strengthLevel === "VERY_STRONG";
  if (/(일간|몸|내 힘)이 약하|신약/.test(line) && !weak) return false;
  if (/(일간|몸|내 힘)이 (강하|세)|신강/.test(line) && !strong) return false;
  if (groups) for (const m of line.matchAll(/(비겁|식상|재성|관성|인성)(이|가)? ?(약하|약한|약해|없|많|강하|강한|세면|넘치)/g)) {
    const v = groups[GROUP_WORD[m[1]]];
    if (/약|없/.test(m[3]) ? v >= 1 : v < 2.5) return false;
  }
  return true;
}

export function buildTrait(s: ScoredHit, id: string, rng: Rng, strengthLevel = "BALANCED", groups?: GroupScores): Trait {
  const { hit, feature } = s;
  const variant = hit.variantKey ? feature.variants?.find(v => v.key === hit.variantKey || [...v.key].reverse().join("") === hit.variantKey) : undefined;
  const pos = mainPosition(hit);
  const good = pickN(rng.fork("good"), feature.strengths, 2);
  return {
    id, featureId: hit.id, family: hit.family,
    name: variant ? `${feature.name} ${variant.name}` : feature.name,
    easyName: feature.easyName, positions: [...hit.positions], strength: hit.strength, score: s.score,
    image: variant?.image ?? feature.image,
    oneLiner: variant?.oneLiner ?? feature.oneLiner,
    ...(pos && feature.positionNuance ? { positionNote: `${POSITION_KO[pos]} 자리: ${feature.positionNuance[pos]}` } : variant?.nuance ? { positionNote: variant.nuance } : {}),
    ...(hit.strength === "strong" ? { strengthNote: feature.strengthRules.strong } : hit.strength === "weak" ? { strengthNote: feature.strengthRules.weak } : {}),
    good,
    ...(feature.overuse.some(o => overuseFits(o, strengthLevel, groups)) ? { overuse: rng.fork("overuse").pick(feature.overuse.filter(o => overuseFits(o, strengthLevel, groups))) } : {}),
    ...(s.fusion ? { fusion: { target: s.fusion.target, kind: s.fusion.kind, why: s.fusion.why, source: s.fusion.source } } : {}),
    chapters: [],
  };
}

// ---------- 좋은 기운 · 팩폭 · 아직 쓰지 못한 기운 ----------
const GOOD_IDS = /^(gwiin:|shinsal:(TWELVE_JANGSEONGSAL|TWELVE_BANANSAL|CHEONMUN)$|structure:(RESOURCE_SUPPORTS_DAYMASTER|OUTPUT_GENERATES_WEALTH|WEALTH_GENERATES_OFFICER)$)/;
const WARNING_IDS = /^(shinsal:(BAEKHODAESAL|GOEGANG|YANGIN|WONJIN|GWIMUN|HYEONCHIMSAL|MANGSINSAL|TWELVE_MANGSINSAL|TWELVE_GEOPSAL|TWELVE_JAESAL|TWELVE_YUKHAESAL|GOSINSAL|GWASUKSAL|EUMCHAK_YANGCHA|CHEONRA_JIMANG|GONGMANG)|relation:(CHUNG|HYEONG|PA|HAE)|element:\w+:(STRONG|MISSING)|tenGodBalance:\w+:STRONG|structure:(WEAK_\w+|MIXED_OFFICER_KILLING|FIRE_METAL_TENSION))$/;

export function buildFortunes(scored: readonly ScoredHit[], traits: readonly Trait[], limit = 4) {
  return scored.filter(s => GOOD_IDS.test(s.hit.id)).slice(0, limit).map(s => {
    const t = traits.find(x => x.featureId === s.hit.id);
    return { featureId: s.hit.id, name: s.feature.name, easyName: s.feature.easyName, image: s.feature.image, oneLiner: s.feature.oneLiner, direct: s.feature.strengths[0], ...(t ? { traitId: t.id } : {}) };
  });
}

export function buildShadows(selected: readonly ScoredHit[], traits: Trait[], min = 2, max = 4) {
  const ranked = selected.map((s, i) => ({ s, t: traits[i], w: s.score * (WARNING_IDS.test(s.hit.id) ? 1.3 : 1) * (s.fusion?.kind === "tension" ? 1.2 : 1) }))
    .filter(x => x.t.overuse && !GOOD_IDS.test(x.s.hit.id))
    .sort((a, b) => b.w - a.w || a.t.id.localeCompare(b.t.id));
  const warn = ranked.filter(x => WARNING_IDS.test(x.s.hit.id) || x.s.fusion?.kind === "tension");
  const pick = [...warn.slice(0, max), ...ranked.filter(x => !warn.includes(x))].slice(0, Math.max(min, Math.min(max, warn.length || min)));
  return pick.map((x, i) => {
    const where = x.t.positions.map(p => POSITION_KO[p]).join("·");
    const shadow = {
      id: `s${i + 1}`, traitId: x.t.id, text: x.t.overuse!,
      basis: `${x.t.name}${where ? ` (${where})` : ""} — ${x.t.strengthNote ?? x.t.oneLiner}`,
      warmTurn: x.s.feature.strengths.find(g => !x.t.good.includes(g)) ?? x.t.good[0],
    };
    delete x.t.overuse; // 압축: 팩폭 재료는 shadows에만 둔다
    return shadow;
  });
}

const GROUP_TEN_GODS: Record<string, readonly TenGod[]> = { PEER: ["比肩", "劫財"], OUTPUT: ["食神", "傷官"], WEALTH: ["偏財", "正財"], OFFICER: ["偏官", "正官"], RESOURCE: ["偏印", "正印"] };
export function buildUnused(saju: SajuCalcResult, missing: readonly string[], k: Knowledge) {
  const out = [];
  for (const e of missing) {
    const f = k.features.get(`element:${e}:MISSING`); if (!f) continue;
    out.push({ kind: "element" as const, key: e, name: f.name, easyName: f.easyName, oneLiner: f.oneLiner, actions: f.remedy?.actions.slice(0, 3) ?? [], places: f.remedy?.places.slice(0, 3) ?? [] });
  }
  const dist = saju.tenGods.distribution;
  for (const [g, tgs] of Object.entries(GROUP_TEN_GODS)) {
    if (tgs.some(t => dist[t] > 0)) continue;
    const f = k.features.get(`tenGodBalance:${g}:WEAK`); if (!f) continue;
    out.push({ kind: "tenGod" as const, key: g, name: f.name, easyName: f.easyName, oneLiner: f.oneLiner, actions: [], places: [] });
  }
  return out;
}
export { TEN_GOD_GROUP };
