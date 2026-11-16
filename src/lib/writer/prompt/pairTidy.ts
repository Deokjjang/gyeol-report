/**
 * W8 작가 입력 재료 정리(4종만, 호출 0) — W7 부품 중 「바꿔치기」만 쓰고 성격 정답지 거르기는 쓰지 않는다.
 *  ① 꼬리표(persona-tags.json)의 바꾼 재료(rw: 결정 2 사주 안 관계 줄 → 흐름 장면, 건강 단정 → 생활 리듬)를 보내고, drop 줄은 보내지 않는다.
 *  ② 짝 정리(약하게): 같은 사람 · 같은 차원 · 반대 끝 · 둘 다 세기 2 이상 · 같은 조건(대상·상황)인 성격·상황 줄 짝만 찾아 약한 쪽을 뺀다.
 *     약한 쪽 = 그 끝 줄들의 출처 무게(W7 4-1 표) × 줄 세기 합이 작은 쪽, 같으면 뒤에 온 줄이 있는 쪽. 그 절(소제목)의 유일한 재료·그 특성의 유일한 글이면 빼지 않는다.
 * 출처 무게(W7 4-1): 일간·월령·가장 센/약한 오행 3 · 투출 십성·일주·일지 2 · 그 밖 명리 1 · 사주 안 관계 0 · 엔진 강약 곱(strong 1.5 · weak 0.5)
 *   · MBTI 주·부기능 3 · 3·4차 기능 1 · 그 밖 MBTI 줄(씨앗·유형 글) 2 · 심화 재료·나머지 1.
 */
import type { Knowledge } from "@/lib/brief/knowledge";
import type { Brief, Trait } from "@/lib/brief/schema";
import type { PersonaTag } from "@/data/knowledge-v5/schema";
import { materialKey, swapMaterials, type MaterialTable } from "./materials";

/** 명리 특성의 출처 무게(W7 persona.ts hitWeight와 같은 표). 투출 = 년·월·시 천간 십성에 그 십성. */
export function traitWeight(t: Pick<Trait, "featureId" | "family" | "positions" | "strength">, stems: readonly string[]): number {
  const mul = t.strength === "strong" ? 1.5 : t.strength === "weak" ? 0.5 : 1;
  const base = (() => {
    switch (t.family) {
      case "relation": return 0;
      case "dayMaster": case "climate": return 3;
      case "element": return /:(STRONG|WEAK|MISSING)$/.test(t.featureId) ? 3 : 1;
      case "dayPillar": return 2;
      case "branch": return t.positions.includes("day") ? 2 : 1;
      case "tenGod": { const tg = t.featureId.split(":")[1]; return stems.includes(tg) ? 2 : 1; }
      default: return /WONJIN/.test(t.featureId) ? 0 : 1;
    }
  })();
  return base * mul;
}

/** 작가 입력 한 조각(원문 기준): 주인(0 본인 · 1 상대 · −1 모름) · 출처 무게 · 놓인 자리(절 · 특성) · 처음 나온 차례. */
export type PiecePlace = { readonly owner: number; readonly key: string; readonly text: string; readonly w: number; readonly order: number; readonly sole: boolean };
export type PairDrop = { readonly owner: number; readonly dim: string; readonly dropped: string; readonly kept: string; readonly score: readonly [number, number] };
export type PieceAudit = { readonly pieces: readonly PiecePlace[]; readonly drops: readonly PairDrop[]; readonly rw: number; readonly tagDrop: number; readonly protectedPairs: number };

const PAIR_MIN = 2;
const condKey = (t: PersonaTag) => `${t.c?.who ?? ""}|${t.c?.sit ?? ""}`;

/** 작가 입력(renderRaw 뒤)을 걸으며 원문 조각을 재료로 바꾸고, 꼬리표 rw/drop과 짝 정리를 적용한다. */
export function tidyPieces(o: Record<string, unknown>, table: MaterialTable, brief: Brief, k: Knowledge): { out: Record<string, unknown>; audit: PieceAudit } {
  const compat = Boolean(brief.compatibility && brief.partner);
  const stemsOf = (c: Brief["chart"] | undefined) => { const p = c?.positions; return p ? [p.yearStem[0], p.monthStem[0], p.hourStem?.[0]].filter((x): x is string => Boolean(x)) : []; };
  const stems = [stemsOf(brief.chart), stemsOf(brief.partner?.chart)];
  const traitById = new Map(brief.traits.map(t => [t.id, t]));
  const ownerOfId = (id: string) => (/^b(t\d|\d)/.test(id) ? 1 : /^a(t\d|\d)/.test(id) ? 0 : undefined);
  const callA = brief.compatibility?.a.callName.replace(/님$/, "") ?? "", callB = brief.compatibility?.b.callName.replace(/님$/, "") ?? "";
  const byName = (t: string, owner: number) => { if (owner !== -1 || !compat) return owner; const a = Boolean(callA) && t.includes(callA), b = Boolean(callB) && t.includes(callB); return a && !b ? 0 : b && !a ? 1 : -1; };
  const weightOfTrait = (id: string, owner: number) => { const t = traitById.get(id); return t ? traitWeight(t, stems[Math.max(0, ownerOfId(t.id) ?? owner)] ?? []) : 1; };
  // 걷기 맥락: 주인 · 출처 무게 · 놓인 자리(같은 자리에 재료가 하나뿐이면 지킨다).
  type Ctx = { owner: number; w: number; place: string };
  const placeCount = new Map<string, number>();
  const seen: { owner: number; text: string; w: number; place: string }[] = [];
  let rw = 0, tagDrop = 0;
  const walk = (x: unknown, c: Ctx, keepOf: (c: Ctx) => (orig: string) => boolean | string): unknown => {
    if (typeof x === "string") return swapMaterials(x, table, keepOf({ ...c, owner: byName(x, c.owner) }));
    // 뗀 조각으로 빈 글이 된 칸만 지운다(원래 빈 글 칸은 W6.1처럼 둔다).
    if (Array.isArray(x)) return x.map(y => [y, walk(y, c, keepOf)] as const).filter(([y, v]) => v !== "" || y === "").map(([, v]) => v);
    if (x && typeof x === "object") {
      const r = x as Record<string, unknown>, id = String(r.traitId ?? r.id ?? "");
      const own = ownerOfId(id) ?? c.owner;
      // 특성 객체(traits[]) = 그 특성 무게 · 자리 = 특성 · 절 재료(fusion 등 traitId) = 그 특성 무게.
      const isTrait = typeof r.id === "string" && traitById.has(r.id) && "meaning" in r;
      const w = isTrait ? weightOfTrait(r.id as string, own) : typeof r.traitId === "string" ? weightOfTrait(r.traitId, own) : r.kind === "mbti" ? 2 : c.w;
      const place = isTrait ? `trait:${r.id as string}` : c.place;
      return Object.fromEntries(Object.entries(r).map(([kk, v]) => {
        if (kk === "partner") return [kk, walk(v, { owner: 1, w: 1, place: "partner" }, keepOf)];
        if (kk === "sections" && Array.isArray(v)) return [kk, v.map((sec, si) => { const mats = (sec as { materials?: unknown[] }).materials; const pl = `${String(r.n ?? "")}.${si}`; if (Array.isArray(mats)) placeCount.set(pl, mats.length); return walk(sec, { ...c, owner: own, w, place: pl }, keepOf); })];
        if (kk === "mbti") return [kk, walk(v, { ...c, owner: own, w: 2, place: "mbti" }, keepOf)];
        if (c.place === "chart" && (kk === "dayMaster" || kk === "climate" || kk === "elements")) return [kk, walk(v, { ...c, owner: own, w: 3 }, keepOf)];
        if (kk === "functions" && Array.isArray(v)) return [kk, v.map(f => walk(f, { ...c, owner: own, w: typeof f === "string" && /주기능|부기능/.test(f) ? 3 : typeof f === "string" && /3차|열등/.test(f) ? 1 : 2 }, keepOf))];
        return [kk, walk(v, { ...c, owner: own, w, place }, keepOf)];
      }).filter(([kk, v]) => v !== "" || r[kk as string] === ""));
    }
    return x;
  };
  const top = (keepOf: (c: Ctx) => (orig: string) => boolean | string) => Object.fromEntries(Object.entries(o).map(([kk, v]) => {
    const owner = !compat ? 0 : kk === "chart" || kk === "mbti" || kk === "person" ? 0 : kk === "partner" ? 1 : -1;
    const w = kk === "mbti" ? 2 : 1;
    return [kk, walk(v, { owner, w, place: kk === "traits" ? "traits" : kk }, keepOf)];
  }).filter(([kk, v]) => v !== "" || o[kk as string] === ""));
  // 1차: 조각 모으기(바꿔치기만, 짝 정리 없이 같은 길로 걷는다).
  const tagged = (orig: string) => k.personaTags.get(materialKey(orig));
  top(c => orig => { const t = tagged(orig); if (t?.drop) return false; seen.push({ owner: c.owner, text: orig, w: c.w, place: c.place }); return t?.rw ?? true; });
  // 자리마다 조각 수(특성은 조각 수, 절은 재료 칸 수 — 절 재료가 하나뿐이면 그 재료의 글을 지킨다).
  // 유일한 재료: 특성은 그 특성의 글 조각이 하나뿐일 때, 절은 재료 칸이 하나뿐이고 그 절의 글 조각도 하나뿐일 때(커리어 근거 칸처럼 한 칸에 줄 여럿이면 유일하지 않다).
  const pieces = new Map<string, Set<string>>();
  for (const s of seen) { const m = pieces.get(s.place) ?? new Set<string>(); m.add(s.text); pieces.set(s.place, m); }
  const soleAt = (place: string) => (place.startsWith("trait:") ? (pieces.get(place)?.size ?? 0) <= 1 : placeCount.has(place) ? (placeCount.get(place) ?? 0) <= 1 && (pieces.get(place)?.size ?? 0) <= 1 : false);
  const uniq = new Map<string, PiecePlace>();
  seen.forEach((s, i) => { const key = `${s.owner}|${materialKey(s.text)}`; const was = uniq.get(key); uniq.set(key, was ? { ...was, w: Math.max(was.w, s.w), sole: was.sole || soleAt(s.place) } : { owner: s.owner, key: materialKey(s.text), text: s.text, w: s.w, order: i, sole: soleAt(s.place) }); });
  // 짝 찾기: 주인(모름 −1은 뺌) × 차원 × 조건 → 끝마다 조각(세기 2 이상, 성격·상황 줄만).
  type Cand = PiecePlace & { s: number };
  const groups = new Map<string, { plus: Cand[]; minus: Cand[] }>();
  for (const p of uniq.values()) {
    if (p.owner < 0) continue;
    const t = k.personaTags.get(p.key); if (!t || t.drop || (t.k !== "trait" && t.k !== "situ")) continue;
    for (const [dim, pole, s] of t.d) {
      if (s < PAIR_MIN) continue;
      const g = groups.get(`${p.owner}|${dim}|${condKey(t)}`) ?? { plus: [], minus: [] };
      (pole > 0 ? g.plus : g.minus).push({ ...p, s });
      groups.set(`${p.owner}|${dim}|${condKey(t)}`, g);
    }
  }
  const drops: PairDrop[] = [], gone = new Set<string>(); let protectedPairs = 0;
  const score = (c: Cand) => c.w * c.s;
  // 약한 쪽 = 그 끝 줄들의 (출처 무게 × 세기) 합이 작은 쪽, 같으면 뒤에 온 줄이 있는 쪽. 그 쪽의 세기 2 이상 줄만 뺀다(유일한 재료는 지킴).
  // 줄끼리 되풀이해 약한 줄을 빼면 두 끝을 번갈아 거의 다 뺀다(W8 1단계 8입력 종합 31~33줄) → 무리 단위로 한 번만 정한다. 무리마다 원래 조각으로 따로 정한다.
  const sum = (xs: Cand[]) => xs.reduce((a, c) => a + score(c), 0), last = (xs: Cand[]) => Math.max(...xs.map(c => c.order));
  for (const [gk, g] of groups) {
    if (!g.plus.length || !g.minus.length) continue;
    const sp = sum(g.plus), sm = sum(g.minus);
    const [lose, win] = sp !== sm ? (sp < sm ? [g.plus, g.minus] : [g.minus, g.plus]) : last(g.plus) > last(g.minus) ? [g.plus, g.minus] : [g.minus, g.plus];
    const top1 = win.reduce((a, b) => (score(b) > score(a) ? b : a));
    for (const lo of lose) {
      if (lo.sole) { protectedPairs++; continue; }
      if (gone.has(`${lo.owner}|${lo.key}`)) continue;
      gone.add(`${lo.owner}|${lo.key}`);
      drops.push({ owner: lo.owner, dim: gk.split("|")[1], dropped: lo.text, kept: top1.text, score: [sum(lose), sum(win)] });
    }
  }
  // 2차: 바꿔치기 + 짝 정리로 뺀 줄.
  const out = top(c => orig => { const t = tagged(orig); if (t?.drop) { tagDrop++; return false; } if (gone.has(`${c.owner}|${materialKey(orig)}`)) return false; if (t?.rw) { rw++; return t.rw; } return true; });
  return { out, audit: { pieces: [...uniq.values()], drops, rw, tagDrop, protectedPairs } };
}
