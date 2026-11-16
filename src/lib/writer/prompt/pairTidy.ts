/**
 * W8 작가 입력 재료 정리(4종만, 호출 0) — W7 부품 중 「바꿔치기」만 쓰고 성격 정답지 거르기는 쓰지 않는다.
 *  ① 꼬리표(persona-tags.json)의 바꾼 재료(rw: 결정 2 사주 안 관계 줄 → 흐름 장면, 건강 단정 → 생활 리듬)를 보내고, drop 줄은 보내지 않는다.
 *  ② 짝 정리(약하게): 같은 사람 · 같은 차원 · 반대 끝 · 둘 다 세기 2 이상 · 같은 조건(대상·상황)인 성격·상황 줄 짝만 찾아 약한 쪽을 뺀다.
 *     약한 쪽 = 그 끝 줄들의 출처 무게(W7 4-1 표) × 줄 세기 합이 작은 쪽, 같으면 뒤에 온 줄이 있는 쪽. 그 절(소제목)의 유일한 재료·그 특성의 유일한 글이면 빼지 않는다.
 * 출처 무게(W7 4-1): 일간·월령·가장 센/약한 오행 3 · 투출 십성·일주·일지 2 · 그 밖 명리 1 · 사주 안 관계 0 · 엔진 강약 곱(strong 1.5 · weak 0.5)
 *   · MBTI 주·부기능 3 · 3·4차 기능 1 · 그 밖 MBTI 줄(씨앗·유형 글) 2 · 심화 재료·나머지 1.
 * W8.1(1단계 모순 19건 추적으로 고른 고침만 — docs/v5/w8-1.md):
 *  G1(T1): 짝 정리 대상에 세기 1 줄도 넣는다(조건이 다른 짝은 넣지 않는다 — T2는 1건이라 고르지 않음). 약한 쪽 판단은 W8과 같다.
 *  G3(T4): 성격 요약표(W6 판, 검사와 같은 profilePoles)가 값을 가진 차원에서 그 사람 줄 · 궁합 「두 사람 모두」 주인 없는 성격·상황 줄 중 값과 반대 끝인 줄을 뺀다
 *          (궁합 공통 줄은 두 사람 중 한 사람이라도 반대면). 두 역할 장면(k=pair)은 공통 줄이 아니라 그대로.
 *  G5(T6): 차원 꼬리표가 없는 줄(꼬리표 없음·설명 갈래 d=[])이 이 책 특징의 글이면(과함·그림자 칸 제외) 그 특징의 차원 벡터(|w| ≥ 0.5)로 결정론 꼬리표(세기 1)를 붙여 G1·G3 대상에 넣는다.
 *  결정 4 상한: W8 짝 정리(세기 2+)는 W8 그대로 모두 먼저 빼고(W8 최대 28), 새 고침(G3·G1)은 남은 칸(MAX_DROPS − W8 수)만큼 세기 곱이 큰 것부터 빼고 나머지는 남긴다.
 */
import type { Knowledge } from "@/lib/brief/knowledge";
import type { Brief, Trait } from "@/lib/brief/schema";
import type { PersonaTag } from "@/data/knowledge-v5/schema";
import { profilePoles } from "../safety/contradiction";
import type { ProfileCodes } from "@/lib/brief/pairProfile";
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
/** by: w8 = W8 짝 정리(세기 2+) · g1 = 세기 1이 낀 짝 · g3 = 성격 요약표 대조. */
export type PairDrop = { readonly owner: number; readonly dim: string; readonly dropped: string; readonly kept: string; readonly score: readonly [number, number]; readonly by?: "w8" | "g1" | "g3"; readonly derived?: boolean };
export type PieceAudit = { readonly pieces: readonly PiecePlace[]; readonly drops: readonly PairDrop[]; readonly rw: number; readonly tagDrop: number; readonly protectedPairs: number; readonly derived?: number; readonly capped?: number; readonly left?: readonly PairDrop[] };

/** G1: 세기 1 줄도 짝 정리 대상(W8은 2). */
const PAIR_MIN = 1;
/** 결정 4(전수 시험 권당 평균 ≤ 16 · 최대 ≤ 28): 새 고침까지 합친 한 권 상한(W8 짝 정리만으로 넘는 책은 W8 수 그대로, 새 고침 0). 상한 28 첫판은 전수 평균 23.66(43%가 상한)이라 낮췄다(W8 9.10 · W7 28.9). */
export const MAX_DROPS = 16;
const condKey = (t: PersonaTag) => `${t.c?.who ?? ""}|${t.c?.sit ?? ""}`;
type Dim = readonly [string, 1 | -1, number];

/**
 * G5: 이 책 특징(브리프 traits)의 DB 글 → (특징 id, 칸). 과함(overuse)·그림자(shadow) 칸은 빼고 돌려준다(그 칸은 특징 벡터의 반대·넘친 쪽이라).
 * 차원 = 특징 dimensionTags(옛 차원) 중 |w| ≥ 0.5를 성격 사전 차원으로 옮긴 것(사전 from 표). 한 사전 차원에 두 끝이 같이 오면 그 차원은 뺀다.
 */
export function featureLineDims(brief: Pick<Brief, "traits">, k: Pick<Knowledge, "features" | "ontology">): Map<string, readonly Dim[]> {
  const map = new Map<string, readonly [string, 1 | -1]>();
  for (const d of k.ontology.persona?.dims ?? []) { map.set(d.id, [d.id, 1]); for (const [o, sg] of d.from) map.set(o, [d.id, sg]); }
  const out = new Map<string, readonly Dim[]>();
  for (const t of brief.traits) {
    const f = k.features.get(t.featureId); if (!f || f.family === "relation" || /WONJIN/.test(f.id)) continue;
    const acc = new Map<string, Set<1 | -1>>();
    for (const [od, w] of Object.entries(f.dimensionTags)) { if (Math.abs(w) < 0.5) continue; const m = map.get(od); if (!m) continue; const s = acc.get(m[0]) ?? new Set<1 | -1>(); s.add((Math.sign(w) * m[1]) as 1 | -1); acc.set(m[0], s); }
    const dims: Dim[] = [...acc].filter(([, s]) => s.size === 1).map(([d, s]) => [d, [...s][0], 1] as const);
    if (!dims.length) continue;
    const put = (x: unknown) => { if (typeof x === "string" && x.length >= 10 && !out.has(materialKey(x))) out.set(materialKey(x), dims); };
    for (const l of Object.values(f.scenes ?? {})) for (const s of (l ?? []) as { text: string }[]) put(s.text);
    put(f.life); put(f.meaning); for (const v of Object.values(f.forYou ?? {})) put(v); for (const v of f.strengths ?? []) put(v);
    for (const v of Object.values(f.strengthRules ?? {})) put(v); for (const v of Object.values(f.positionNuance ?? {})) put(v);
  }
  return out;
}

/** 작가 입력(renderRaw 뒤)을 걸으며 원문 조각을 재료로 바꾸고, 꼬리표 rw/drop과 짝 정리를 적용한다. */
export function tidyPieces(o: Record<string, unknown>, table: MaterialTable, brief: Brief, k: Knowledge, self: ProfileCodes | null = null): { out: Record<string, unknown>; audit: PieceAudit } {
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
  // G5: 차원 꼬리표가 없는 줄(꼬리표 없음 · 설명 갈래 d=[])이 이 책 특징의 글이면 그 특징 벡터로 꼬리표(세기 1)를 붙인다.
  const featDims = featureLineDims(brief, k);
  let derived = 0;
  const dimsOf = (p: PiecePlace): { k: PersonaTag["k"]; d: readonly Dim[]; c: string; derived: boolean } | null => {
    const t = k.personaTags.get(p.key);
    if (t?.drop) return null;
    if (t && t.d.length) return t.k === "trait" || t.k === "situ" || t.k === "pair" ? { k: t.k, d: t.d, c: condKey(t), derived: false } : null;
    if (t && t.k !== "explain") return null;
    const fd = featDims.get(p.key); return fd ? { k: "trait", d: fd, c: "|", derived: true } : null;
  };
  type Cand = PiecePlace & { s: number; derived: boolean };
  type Planned = { cand: Cand; dim: string; kept: string; score: [number, number]; by: "w8" | "g1" | "g3"; prod: number };
  const planned: Planned[] = [], planKey = new Set<string>(); let protectedPairs = 0;
  const pkey = (p: { owner: number; key: string }) => `${p.owner}|${p.key}`;
  for (const p of uniq.values()) { const x = dimsOf(p); if (x?.derived) derived++; }
  const score = (c: Cand) => c.w * c.s;
  const sum = (xs: Cand[]) => xs.reduce((a, c) => a + score(c), 0), last = (xs: Cand[]) => Math.max(...xs.map(c => c.order));
  // 약한 쪽 = 그 끝 줄들의 (출처 무게 × 세기) 합이 작은 쪽, 같으면 뒤에 온 줄이 있는 쪽. 그 쪽 줄을 뺀다(유일한 재료는 지킴).
  // 줄끼리 되풀이해 약한 줄을 빼면 두 끝을 번갈아 거의 다 뺀다(W8 1단계 8입력 종합 31~33줄) → 무리 단위로 한 번만 정한다. 무리마다 원래 조각으로 따로 정한다.
  const decide = (g: { plus: Cand[]; minus: Cand[] }, fixed?: 1 | -1): [Cand[], Cand[]] => {
    if (fixed) return fixed > 0 ? [g.plus, g.minus] : [g.minus, g.plus];
    const sp = sum(g.plus), sm = sum(g.minus);
    return sp !== sm ? (sp < sm ? [g.plus, g.minus] : [g.minus, g.plus]) : last(g.plus) > last(g.minus) ? [g.plus, g.minus] : [g.minus, g.plus];
  };
  const groupsOf = (min: number, withDerived: boolean, skip: Set<string>) => {
    const gs = new Map<string, { plus: Cand[]; minus: Cand[] }>();
    for (const p of uniq.values()) {
      if (p.owner < 0 || skip.has(pkey(p))) continue;
      const x = dimsOf(p); if (!x || (x.k !== "trait" && x.k !== "situ") || (x.derived && !withDerived)) continue;
      for (const [dim, pole, s] of x.d) {
        if (s < min) continue;
        const gk = `${p.owner}|${dim}|${x.c}`, g = gs.get(gk) ?? { plus: [], minus: [] };
        (pole > 0 ? g.plus : g.minus).push({ ...p, s, derived: x.derived }); gs.set(gk, g);
      }
    }
    return gs;
  };
  // 1단계 — W8 짝 정리 그대로(같은 사람·같은 차원·같은 조건, 둘 다 세기 2+, 꼬리표 그대로): 이미 측정·판독을 거친 부품이라 먼저, 상한 없이(W8 최대 28).
  const w8Lose = new Map<string, 1 | -1>();
  for (const [gk, g] of groupsOf(2, false, new Set())) {
    if (!g.plus.length || !g.minus.length) continue;
    const [lose, win] = decide(g), top1 = win.reduce((a, b) => (score(b) > score(a) ? b : a));
    w8Lose.set(gk, lose === g.plus ? 1 : -1);
    for (const lo of lose) {
      if (lo.sole) { protectedPairs++; continue; }
      if (planKey.has(pkey(lo))) continue;
      planKey.add(pkey(lo)); planned.push({ cand: lo, dim: gk.split("|")[1], kept: top1.text, score: [sum(lose), sum(win)], by: "w8", prod: lo.s * top1.s });
    }
  }
  // 2단계 — 새 고침(W8.1): G3 성격 요약표 대조 · G1 세기 1 짝(G5 꼬리표 포함). W8 1단계가 뺀 줄은 다시 보지 않는다.
  // G3: 사람마다 profilePoles(검사와 같은 대응). 궁합 공통 줄(주인 −1, 성격·상황 줄)은 두 사람 중 한 사람이라도 반대면.
  const poles = compat ? (brief.compatibility?.profiles ?? []).map(c => profilePoles(c)) : [profilePoles(self)];
  for (const p of uniq.values()) {
    if (planKey.has(pkey(p))) continue;
    const x = dimsOf(p); if (!x || (x.k !== "trait" && x.k !== "situ")) continue;
    const who = p.owner >= 0 ? [p.owner] : compat ? poles.map((_, i) => i) : [];
    // 한 줄에 성격표 차원이 여럿이면 반대 끝 세기 합 > 같은 끝 세기 합일 때만 반대 줄(「단톡방 … 바로 전화」 결정 빠름+2 · 반응+1 ↔ 성격표 결정 빠름 · 다툼 정리 뒤).
    for (const i of who) {
      const pv = poles[i]; if (!pv) continue;
      const opp = x.d.filter(([d, pole]) => pv.get(d) === -pole), agree = x.d.reduce((a, [d, pole, s]) => a + (pv.get(d) === pole ? s : 0), 0);
      const oppS = opp.reduce((a, [, , s]) => a + s, 0);
      if (!opp.length || oppS <= agree) continue;
      if (p.sole) { protectedPairs++; break; }
      const [dim, pole, s] = opp.reduce((a, b) => (b[2] > a[2] ? b : a));
      if (!planKey.has(pkey(p))) { planKey.add(pkey(p)); planned.push({ cand: { ...p, s, derived: x.derived }, dim, kept: `성격 요약표 ${dim}${pole > 0 ? "−" : "+"}`, score: [p.w * oppS, 3], by: "g3", prod: s * 3 }); }
      break;
    }
  }
  // G1: 짝 찾기(세기 1 이상, G5 꼬리표 포함) — W8 1단계·성격표 대조로 뺄 줄은 빼고 본다. W8이 이미 정한 무리(같은 사람·차원·조건)는 W8과 같은 끝을 약한 쪽으로 둔다(두 끝을 다 빼지 않게).
  for (const [gk, g] of groupsOf(PAIR_MIN, true, planKey)) {
    if (!g.plus.length || !g.minus.length) continue;
    const [lose, win] = decide(g, w8Lose.get(gk)), top1 = win.reduce((a, b) => (score(b) > score(a) ? b : a));
    for (const lo of lose) {
      if (lo.sole) { protectedPairs++; continue; }
      if (planKey.has(pkey(lo))) continue;
      planKey.add(pkey(lo)); planned.push({ cand: lo, dim: gk.split("|")[1], kept: top1.text, score: [sum(lose), sum(win)], by: "g1", prod: lo.s * top1.s });
    }
  }
  // 결정 4 상한: W8 1단계는 모두 뺀다. 새 고침은 남은 칸(MAX_DROPS − W8 수)만큼 세기 곱(빠질 줄 세기 × 남길 쪽 세기, 성격표는 3)이 큰 것부터, 같으면 성격표 대조 → 앞에 온 줄. 넘친 것은 남긴다.
  const base = planned.filter(x => x.by === "w8"), ext = planned.filter(x => x.by !== "w8").sort((a, b) => b.prod - a.prod || (a.by === "g3" ? 0 : 1) - (b.by === "g3" ? 0 : 1) || a.cand.order - b.cand.order);
  const room = Math.max(0, MAX_DROPS - base.length), take = [...base, ...ext.slice(0, room)], rest = ext.slice(room);
  const asDrop = (x: Planned): PairDrop => ({ owner: x.cand.owner, dim: x.dim, dropped: x.cand.text, kept: x.kept, score: x.score, by: x.by, ...(x.cand.derived ? { derived: true } : {}) });
  const drops: PairDrop[] = take.map(asDrop), gone = new Set<string>(take.map(x => pkey(x.cand)));
  const capped = rest.length, left: PairDrop[] = rest.map(asDrop);
  // 2차: 바꿔치기 + 짝 정리로 뺀 줄.
  const out = top(c => orig => { const t = tagged(orig); if (t?.drop) { tagDrop++; return false; } if (gone.has(`${c.owner}|${materialKey(orig)}`)) return false; if (t?.rw) { rw++; return t.rw; } return true; });
  return { out, audit: { pieces: [...uniq.values()], drops, rw, tagDrop, protectedPairs, derived, capped, left } };
}
