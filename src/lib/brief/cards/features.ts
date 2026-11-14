/**
 * W3 P3 연결 시스템 1·2 — 특징 카드와 연결(결정론, 호출 0).
 * - 특징 카드: 명리(trait/FeatureHit + MyeongriFeature.dimensionTags) · MBTI(MbtiProfile.dimensionTags, 유형·기능·글자) · 자미두수(인터페이스만).
 * - 의미 태그 = behavior-ontology 31차원 그대로(새 태그 0). 연결은 두 카드가 같은 차원을 둘 다 가질 때만(|값| ≥ 0.3).
 * - 연결 규칙: Fusion 규칙이 있으면 그 kind·dimension(resonance → 공통, tension → 긴장, conditional → 보완),
 *   없으면 scorePair — 섞임(conditional) → 보완, 같은 부호·둘 다 ≥ 0.4 → 공통, 반대 부호·둘 다 ≥ 0.4 → 긴장, 반대 부호·한쪽 < 0.4 → 차이
 *   (같은 부호인데 한쪽 < 0.4는 「공통」이라 부를 만큼 겹치지 않아 연결하지 않는다 — 설계안에 없는 칸, 가장 단순한 쪽).
 * - why: Fusion why에서 장면 문장을 빼고 MBTI 쪽을 처음 부르는 문장 하나(명리만 말하는 앞 문장은 card.evidence 뜻과 겹친다). 계산 연결은 차원 양끝 설명으로 조립.
 * 시간 미상이면 시 자리 카드·자리 이름이 없다(엔진 hit에 hour가 없다). MBTI가 없으면 MBTI 카드 0 → 연결 0.
 */
import type { Domain, FusionRule, MbtiProfile, MyeongriFeature } from "@/data/knowledge-v5/schema";
import { scorePair } from "@/data/knowledge-v5/cross-score";
import { poleFits, POLE_TAGS, poleKey } from "../mbtiFn";
import type { Knowledge } from "../knowledge";
import { josa } from "../labels";
import { splitSentences } from "@/lib/writer/safety/patterns";

/** 적용 영역 6개(설계 0.2): 지식 DB DOMAINS 7개는 그대로 두고 카드에서만 쓰는 대응표. */
export const AREA6 = ["성격", "일", "돈", "연애", "관계", "가족"] as const;
export type Area6 = (typeof AREA6)[number];
export const AREA6_OF: Readonly<Record<Domain, Area6>> = { work: "일", study: "일", money: "돈", love: "연애", marriage: "가족", relationships: "관계", alone: "성격" };

export type CardSystem = "myeongri" | "mbti" | "ziwei";
export type FeatureCard = {
  readonly id: string; readonly system: CardSystem;
  /** 지식 DB id(명리 feature id · MBTI 유형 · 기능 코드 · 글자). */
  readonly key: string;
  /** 쉬운 이름(작가에게 보이는 이름). */
  readonly name: string;
  /** 자리 이름(독자용 「일지」「월간」, 원국 전체 판단은 「원국 전체」). 시간 미상이면 시 자리 없음. MBTI는 「MBTI」. */
  readonly where: readonly string[];
  readonly strength: "strong" | "medium" | "weak";
  readonly tags: Readonly<Record<string, number>>;
  readonly domains: readonly Area6[];
  readonly polarity: "plus" | "minus" | "mixed";
  /** 궁합: 카드 주인(a = 신청인, b = 상대). */
  readonly owner?: "a" | "b";
  /** MBTI 카드의 유형(기능·글자 카드도 유형을 들고 있다 — 기능 맞춤 거름용). */
  readonly mbti?: string;
  /** 명리 카드가 가리키는 브리프 trait id. */
  readonly traitId?: string;
};
export type ConnKind = "공통" | "차이" | "보완" | "긴장";
/** 연결 하나. a·b = 카드 id, tag = 행동 차원 id, tagName = 차원 쉬운 이름, source = Fusion 규칙 id 또는 "computed"·"mbtiLink". */
export type Connection = { readonly kind: ConnKind; readonly a: string; readonly b: string; readonly tag: string; readonly tagName: string; readonly why: string; readonly source: string; readonly dir?: string };

/** 등급 말을 뜻 말로(W3 P3 설계 0.3 — 4종 카드 책의 작가 입력 전체 — 지식 DB 뜻 문장·특성 이름의 「토 과다」「신약한」 포함). */
const GRADE_WORDS: readonly (readonly [RegExp, string])[] = [
  [/매우 신강한/g, "힘이 아주 센"], [/신강한/g, "힘이 센"], [/매우 신약한/g, "힘이 많이 여린"], [/신약한/g, "힘이 여린"], [/중화된/g, "힘이 고른"],
  [/매우 신강/g, "힘이 아주 센 쪽"], [/신강/g, "힘이 센 쪽"], [/매우 신약/g, "힘이 많이 여린 쪽"], [/신약/g, "힘이 여린 쪽"], [/중화/g, "힘이 고른 쪽"], [/ ?과다/g, " 많음"],
];
/** 묶음 세기 단계(「규칙의 힘(관성) 강」)도 뜻 말로(상품 근거 사실 줄). */
export const GROUP_LEVEL_PLAIN: Readonly<Record<string, string>> = { 강: "넉넉한 쪽", 강함: "넉넉한 쪽", 보통: "있는 만큼 쓰는 쪽", 약: "적은 쪽", 약함: "적은 쪽", 있음: "있지만 계절에 눌린 쪽" };
const GROUP_NAME = "(비겁|식상|재성|관성|인성)";
const GROUP_PHRASE: readonly (readonly [RegExp, string])[] = [
  [new RegExp(`${GROUP_NAME}이 보통이라`, "g"), "$1이 고른 편이라"], [new RegExp(`${GROUP_NAME}이 약해`, "g"), "$1이 적어"], [new RegExp(`${GROUP_NAME}이 강해`, "g"), "$1이 넉넉해"],
  [new RegExp(`${GROUP_NAME}이 약한`, "g"), "$1이 적은"], [new RegExp(`${GROUP_NAME}이 강한`, "g"), "$1이 넉넉한"],
];
export const plainGrade = (t: string) => [...GRADE_WORDS, ...GROUP_PHRASE].reduce((x, [re, to]) => x.replace(re, to), t).replace(/((?:비겁|식상|재성|관성|인성)(?:\([^)]*\))?|\((?:비겁|식상|재성|관성|인성)\)) (강함|강|보통|약함|약|있음)(?![가-힣])/g, (_m, g: string, lv: string) => `${g} ${GROUP_LEVEL_PLAIN[lv]}`);

export const LINK_MIN = 0.3;
export const LINK_STRONG = 0.4;
export const FUSION_KIND: Readonly<Record<FusionRule["kind"], ConnKind>> = { resonance: "공통", tension: "긴장", conditional: "보완" };

/** 자미두수 변환기(인터페이스만 — 엔진이 없다). */
export type ZiweiConverter = (chart: unknown) => FeatureCard[];
export const ziweiCards: ZiweiConverter = () => [];

const domainsOf = (tags: Readonly<Record<string, number>>, k: Knowledge): Area6[] => {
  const out = new Set<Area6>();
  for (const [d, v] of Object.entries(tags)) if (Math.abs(v) >= LINK_MIN) for (const x of k.ontology.dimensions.find(o => o.id === d)?.domains ?? []) out.add(AREA6_OF[x]);
  return AREA6.filter(a => out.has(a));
};

const GOOD = /^(gwiin:|shinsal:(TWELVE_JANGSEONGSAL|TWELVE_BANANSAL|CHEONMUN)$|structure:(RESOURCE_SUPPORTS_DAYMASTER|OUTPUT_GENERATES_WEALTH|WEALTH_GENERATES_OFFICER)$)/;
const WARN = /^(shinsal:(BAEKHODAESAL|GOEGANG|YANGIN|WONJIN|GWIMUN|HYEONCHIMSAL|MANGSINSAL|TWELVE_MANGSINSAL|TWELVE_GEOPSAL|TWELVE_JAESAL|TWELVE_YUKHAESAL|GOSINSAL|GWASUKSAL|EUMCHAK_YANGCHA|CHEONRA_JIMANG|GONGMANG)|relation:(CHUNG|HYEONG|PA|HAE)|element:\w+:(STRONG|MISSING)|tenGodBalance:\w+:STRONG|structure:(WEAK_\w+|MIXED_OFFICER_KILLING|FIRE_METAL_TENSION))$/;

/** 명리 카드: trait(브리프) + 지식 DB 요소 + 자리 이름(design.ts가 정답지 칸으로 정한다). */
export function myeongriCard(t: { readonly id: string; readonly featureId: string; readonly name: string; readonly strength: "strong" | "medium" | "weak" }, f: MyeongriFeature, where: readonly string[], k: Knowledge, owner?: "a" | "b"): FeatureCard {
  return { id: `m:${t.id}`, system: "myeongri", key: t.featureId, name: plainGrade(t.name.replace(/\s?\([^)]*\)/g, "").trim()), where, strength: t.strength, tags: f.dimensionTags, domains: domainsOf(f.dimensionTags, k),
    polarity: GOOD.test(t.featureId) ? "plus" : WARN.test(t.featureId) ? "minus" : "mixed", traitId: t.id, ...(owner ? { owner } : {}) };
}

const LETTER_NAME: Readonly<Record<string, string>> = { E: "외향", I: "내향", J: "계획형", P: "탐색형" };
/** MBTI 카드: 유형 1 + 기능 4(주·부·3차·열등) + 태도 글자(E/I·J/P). 기능·글자 카드의 태그는 그 기능·글자가 만드는 차원 끝(POLE_TAGS)만. */
export function mbtiCards(p: MbtiProfile, k: Knowledge, owner?: "a" | "b"): FeatureCard[] {
  const pre = owner ? `${owner}:` : "";
  const base = { system: "mbti" as const, where: ["MBTI"], polarity: "mixed" as const, mbti: p.type, ...(owner ? { owner } : {}) };
  const subset = (fits: (dim: string, v: number) => boolean) => Object.fromEntries(Object.entries(p.dimensionTags).filter(([d, v]) => fits(d, v)));
  const out: FeatureCard[] = [{ ...base, id: `b:${pre}${p.type}`, key: p.type, name: p.type, strength: "strong", tags: p.dimensionTags, domains: domainsOf(p.dimensionTags, k) }];
  for (const c of p.cognitiveFunctions) {
    const tags = subset((d, v) => Boolean(POLE_TAGS[poleKey(d, v)]?.fn?.includes(c.code)));
    if (Object.keys(tags).length) out.push({ ...base, id: `b:${pre}${c.code}`, key: c.code, name: `${c.code}(${c.role})`, strength: c.role === "주기능" || c.role === "부기능" ? "strong" : c.role === "3차기능" ? "medium" : "weak", tags, domains: domainsOf(tags, k) });
  }
  for (const l of [...p.type].filter(x => LETTER_NAME[x])) {
    const tags = subset((d, v) => Boolean(POLE_TAGS[poleKey(d, v)]?.att?.includes(l as never)));
    if (Object.keys(tags).length) out.push({ ...base, id: `b:${pre}${l}`, key: l, name: `${l}(${LETTER_NAME[l]})`, strength: "medium", tags, domains: domainsOf(tags, k) });
  }
  return out;
}

const SCENE_SENT = /['"“”‘’「」]|\d|단톡|카톡|회식|메모|택배|문자|전화|예약|책상|주말|퇴근|출근|저녁|아침|떡볶이|모임에서|자리에서|날에는/;
/** Fusion·연결 이유 한 문장(장면 문장 제거). MBTI 쪽(유형·기능·글자)을 처음 부르는 문장, 없으면 첫 문장. */
export function linkWhy(why: string, mbtiKeys: readonly string[]): string {
  const ss = splitSentences(why).filter(s => !SCENE_SENT.test(s));
  const all = ss.length ? ss : splitSentences(why).slice(0, 1);
  return all.find(s => mbtiKeys.some(m => s.includes(m))) ?? all[0] ?? "";
}

const shortDesc = (s: string) => s.replace(/\s*편입니다\.?$/, " 편").replace(/입니다\.?$/, "").replace(/\.$/, "");
/** 계산 연결 이유: 차원 양끝 설명(behavior-ontology)으로 한 문장. */
function computedWhy(kind: ConnKind, dim: string, a: FeatureCard, b: FeatureCard, va: number, vb: number, k: Knowledge): string {
  const d = k.ontology.dimensions.find(x => x.id === dim);
  if (!d) return "";
  const pa = shortDesc((va >= 0 ? d.poles.plus : d.poles.minus).description), pb = shortDesc((vb >= 0 ? d.poles.plus : d.poles.minus).description);
  if (kind === "공통") return `${josa(a.name, "과와")} ${b.name} 모두 ${pa}이라 같은 쪽으로 겹칩니다.`;
  if (kind === "보완") return `${josa(a.name, "은는")} ${pa}, ${josa(b.name, "은는")} ${pb}이라 상황에 따라 서로를 채웁니다.`;
  return `${josa(a.name, "은는")} ${pa}인데 ${josa(b.name, "은는")} ${pb}입니다.`;
}

export type ConnectOpts = {
  /** Fusion 규칙을 쓸 수 있는가(사실 조건: 시간·성별·맥락). 없으면 모두 허용. */
  readonly ruleOk?: (r: FusionRule) => boolean;
  /** 이미 고른 Fusion 규칙(브리프 trait.fusion이 고른 것) — 있으면 이것을 쓴다. null = 규칙 없이 계산. */
  readonly rule?: FusionRule | null;
  /** 연결 종류를 정해 줄 때(브리프 trait.fusion.kind — mbtiLink 연결). */
  readonly kind?: FusionRule["kind"];
  /** 이유 문장을 정해 줄 때(mbtiLink 이유). */
  readonly why?: string;
  readonly source?: string;
};
/** 두 카드가 함께 가진 차원(둘 다 |값| ≥ 0.3), |곱|이 큰 순. MBTI 쪽은 그 유형의 기능·태도에 맞는 끝만. */
export function sharedDims(a: FeatureCard, b: FeatureCard): { dim: string; va: number; vb: number }[] {
  const fit = (c: FeatureCard, d: string, v: number) => c.system !== "mbti" || poleFits(c.mbti, d, v);
  return Object.entries(a.tags).flatMap(([dim, va]) => { const vb = b.tags[dim]; return vb !== undefined && Math.abs(va) >= LINK_MIN && Math.abs(vb) >= LINK_MIN && fit(a, dim, va) && fit(b, dim, vb) ? [{ dim, va, vb }] : []; })
    .sort((x, y) => Math.abs(y.va * y.vb) - Math.abs(x.va * x.vb) || x.dim.localeCompare(y.dim));
}
const kindOf = (va: number, vb: number): ConnKind | null => Math.sign(va) === Math.sign(vb)
  ? (Math.abs(va) >= LINK_STRONG && Math.abs(vb) >= LINK_STRONG ? "공통" : null)
  : (Math.abs(va) >= LINK_STRONG && Math.abs(vb) >= LINK_STRONG ? "긴장" : "차이");

/** 명리 카드 × MBTI 카드의 Fusion 규칙(정확한 대상 key). */
export function fusionRuleFor(a: FeatureCard, b: FeatureCard, k: Knowledge, ok: (r: FusionRule) => boolean = () => true): FusionRule | null {
  if (a.system !== "myeongri" || b.system !== "mbti") return null;
  return (k.fusionByFeature.get(a.key) ?? []).filter(r => r.mbtiTarget === b.key && ok(r)).sort((x, y) => Math.abs(y.score ?? 0) - Math.abs(x.score ?? 0) || x.id.localeCompare(y.id))[0] ?? null;
}

/** 두 카드 연결 하나(없으면 null): 함께 가진 차원이 있을 때만. */
export function connect(a: FeatureCard, b: FeatureCard, k: Knowledge, opts: ConnectOpts = {}): Connection | null {
  const shared = sharedDims(a, b);
  if (!shared.length) return null;
  const nameOf = (dim: string) => k.ontology.dimensions.find(d => d.id === dim)?.name ?? dim;
  const mk = (kind: ConnKind, s: { dim: string; va: number; vb: number }, why: string, source: string): Connection => ({ kind, a: a.id, b: b.id, tag: s.dim, tagName: nameOf(s.dim), why: why || computedWhy(kind, s.dim, a, b, s.va, s.vb, k), source });
  const mbtiKeys = [b.key, ...(b.mbti ? [b.mbti] : []), ...(a.system === "mbti" ? [a.key] : [])];
  const rule = opts.rule !== undefined ? opts.rule : fusionRuleFor(a, b, k, opts.ruleOk);
  if (rule) {
    const s = shared.find(x => x.dim === rule.dimension) ?? shared[0];
    // 이유는 브리프가 이 원국에 맞게 거른 문장(opts.why)이 있으면 그것에서(원문에는 원국과 어긋나 뺀 문장이 있을 수 있다).
    return mk(FUSION_KIND[opts.kind ?? rule.kind], s, linkWhy(opts.why ?? rule.why, mbtiKeys), rule.id);
  }
  if (opts.kind) return mk(FUSION_KIND[opts.kind], shared[0], opts.why ? linkWhy(opts.why, mbtiKeys) : "", opts.source ?? "mbtiLink");
  const sc = scorePair(a.key, a.tags, b.key, b.tags);
  // 섞임(conditional) → 보완: 두 카드가 반대 끝에 선 차원에서(같은 끝이면 「채운다」가 아니라 겹침이다).
  const opp = shared.find(x => Math.sign(x.va) !== Math.sign(x.vb));
  if (sc?.kind === "conditional" && opp) return mk("보완", opp, "", "computed");
  for (const s of shared) { const kind = kindOf(s.va, s.vb); if (kind) return mk(kind, s, "", "computed"); }
  return null;
}

/** 두 카드의 연결 후보 전부: connect가 고른 것(Fusion 우선) + 함께 가진 다른 차원의 계산 연결(같은 차원·같은 이유가 책에서 겹칠 때 고를 다른 차원). */
export function connectAll(a: FeatureCard, b: FeatureCard, k: Knowledge, opts: ConnectOpts = {}): Connection[] {
  const first = connect(a, b, k, opts), out = first ? [first] : [];
  const nameOf = (dim: string) => k.ontology.dimensions.find(d => d.id === dim)?.name ?? dim;
  for (const s of sharedDims(a, b)) {
    if (out.some(c => c.tag === s.dim)) continue;
    const kind = kindOf(s.va, s.vb);
    if (kind) out.push({ kind, a: a.id, b: b.id, tag: s.dim, tagName: nameOf(s.dim), why: computedWhy(kind, s.dim, a, b, s.va, s.vb, k), source: "computed" });
  }
  return out;
}

/** 연결의 같음 판정 열쇠(책에서 같은 연결 두 번 금지): 두 카드 key + 차원. */
export const connectionKey = (c: Connection, cards: ReadonlyMap<string, FeatureCard>) => `${cards.get(c.a)?.key ?? c.a}|${cards.get(c.b)?.key ?? c.b}|${c.tag}`;
