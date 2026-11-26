/**
 * ZW-2 2부 — 자미두수 특징 카드(결정론, 호출 0). 별 하나 = FeatureCard 하나(system "ziwei").
 * - 행동 꼬리표는 명리 · MBTI 카드와 같은 축(behavior-ontology 31차원) — 새 꼬리표 0. 별 DB의 dimensionTags를 그대로 쓰고, 사화가 붙은 별은 사화 DB 꼬리표를 0.2배로 보탠다
 *   (화록 · 화권 · 화과 = 그 칸 영역의 힘을 보탬, 화기 = 「공들이는 칸」 — 집요 · 완벽 · 속생각 쪽). 등급 낱말은 쓰지 않는다.
 * - where = 궁 쉬운 이름(「나」 「짝」 …). 공궁은 맞은편 칸 주성을 빌려 읽는다 — 빌린 별 카드는 where에 「빌려 읽기(맞은편 쉬운 이름)」를 단다.
 * - domains = 그 궁 DB 영역(AREA6). strength: 명궁 · 신궁 칸 주성(빌린 별 포함)과 사화가 붙은 별 strong, 그 밖 주성 medium, 보좌 · 살성 · 연애 별 weak.
 * 입력은 순수 데이터(명반 · 조회 결과)라 브라우저 · 서버 어디서나 돈다(DB 로더는 부르는 쪽이 넘긴다).
 */
import type { ZiweiChart } from "@/lib/ziwei/types";
import type { ZiweiLookup } from "@/lib/ziwei/lookup";
import { PALACE_NAMES, STAR_NAMES, type MutagenId, type PalaceId, type StarId } from "@/lib/ziwei/ids";
import type { Domain } from "@/data/knowledge-v5/schema";
import { AREA6, AREA6_OF, type Area6, type FeatureCard } from "./features";

/** 사화 보정 몫(별 꼬리표에 보태는 사화 꼬리표의 배수). */
export const ZIWEI_MUTAGEN_WEIGHT = 0.2;
export type ZiweiCard = FeatureCard & {
  readonly system: "ziwei";
  readonly palace: PalaceId;
  readonly star: StarId;
  readonly kind: "major" | "helper" | "malefic" | "love";
  readonly mutagen?: MutagenId;
  /** 공궁에서 맞은편 칸 주성을 빌려 읽은 카드(빌려 온 칸). */
  readonly borrowedFrom?: PalaceId;
};

const round = (v: number) => Math.round(v * 100) / 100;
/** 별 꼬리표 + 사화 꼬리표 × 0.2(±1 안, 0은 뺀다). */
export function ziweiTags(star: Readonly<Record<string, number>>, mutagen?: Readonly<Record<string, number>>): Record<string, number> {
  const out: Record<string, number> = { ...star };
  for (const [d, v] of Object.entries(mutagen ?? {})) out[d] = (out[d] ?? 0) + v * ZIWEI_MUTAGEN_WEIGHT;
  return Object.fromEntries(Object.entries(out).map(([d, v]) => [d, round(Math.max(-1, Math.min(1, v)))] as const).filter(([, v]) => v !== 0));
}
const areaOf = (domains: readonly Domain[]): Area6[] => { const s = new Set(domains.map(d => AREA6_OF[d])); return AREA6.filter(a => s.has(a)); };
export const ziweiStarName = (id: StarId) => `${STAR_NAMES[id].ko}(${STAR_NAMES[id].easy})`;

/** 명반 + 조회 결과 → 카드(궁 순서 · 칸 안 별 순서 그대로). 조회에 DB 항목이 빠진 별은 카드를 만들지 않는다(조회 missing이 따로 잡는다). */
export function ziweiCards(chart: ZiweiChart, look: ZiweiLookup): ZiweiCard[] {
  const mutOf = new Map(chart.mutagens.map(m => [m.star, m.mutagen] as const));
  const mutTags = new Map(look.mutagens.map(m => [m.mutagen, m.entry?.entry.dimensionTags ?? {}] as const));
  const body = chart.bodyPalace.palace;
  const out: ZiweiCard[] = [];
  for (const p of look.palaces) {
    const domains = areaOf(p.entry?.entry.domains ?? []);
    const where = PALACE_NAMES[p.palace].easy;
    const core = p.palace === "myeong" || p.palace === body;
    const card = (star: StarId, kind: ZiweiCard["kind"], tags: Readonly<Record<string, number>>, extra: { borrowedFrom?: PalaceId } = {}): ZiweiCard => {
      const mutagen = mutOf.get(star);
      // 빌린 별의 사화는 그 별이 실제로 앉은 칸(맞은편) 몫이다 — 빈 칸 카드에는 사화를 붙이지 않는다.
      const own = extra.borrowedFrom ? undefined : mutagen;
      const strength = kind === "major" ? (core || own ? "strong" : "medium") : "weak";
      return { id: `z:${p.palace}:${star}${extra.borrowedFrom ? ":b" : ""}`, system: "ziwei", key: `zw:star:${star}`, name: ziweiStarName(star),
        where: extra.borrowedFrom ? [`${where} · 빌려 읽기(${PALACE_NAMES[extra.borrowedFrom].easy})`] : [where], strength,
        tags: ziweiTags(tags, own ? mutTags.get(own) : undefined), domains, polarity: kind === "helper" || own === "rok" || own === "gwon" || own === "gwa" ? "plus" : kind === "malefic" ? "minus" : "mixed",
        palace: p.palace, star, kind, ...(own ? { mutagen: own } : {}), ...extra };
    };
    for (const m of p.majors) if (m.entry) out.push(card(m.star, "major", m.entry.entry.dimensionTags));
    if (p.borrow) for (const m of p.borrow.majors) if (m.entry) out.push(card(m.star, "major", m.entry.entry.dimensionTags, { borrowedFrom: p.borrow.from }));
    for (const [list, kind] of [[p.helpers, "helper"], [p.malefics, "malefic"], [p.loves, "love"]] as const) for (const s of list) if (s.entry) out.push(card(s.star, kind, s.entry.entry.dimensionTags));
  }
  return out;
}
