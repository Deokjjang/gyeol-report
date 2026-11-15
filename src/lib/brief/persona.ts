/**
 * W7-2 성격 정답지(결정론): 한 사람의 실제 특징(원국 계산) + MBTI에서 차원마다 값 하나(또는 조건부 긴장)를 정한다.
 * 사실 정답지(factsheet)처럼 성격에도 단일 출처를 둔다 — 작가 입력 거르기(W7-3)·성격 요약표·궁합 성격표·검사가 이 표를 쓴다.
 *
 * 우선순위(보고서 w7.md 4절 표):
 *  명리 — 일간·월령(계절)·가장 센/약한 오행 = 3 · 투출 십성·일주(일지) = 2 · 지장간 십성·신살·귀인·그 밖 = 1 · 사주 안 관계 = 0(결정 2).
 *         엔진 강약(hit.strength) 곱: strong 1.5 · medium 1 · weak 0.5.
 *  MBTI — 주·부기능 = 3 · 글자(E/I·J/P) = 2 · 3·4차 기능 = 1(mbtiFn POLE_TAGS의 기능·태도 표).
 *         단 E/I·J/P가 정하는 다섯 차원(기운·나섬·다툼·말로 풀기·새것)은 MBTI가 있으면 글자 쪽(최종판2 1-3 판독 검증 규칙 — 조건부 긴장이면 그대로).
 * 줄 무게: 특징 하나의 꼬리표 줄(trait 1 · situ 0.5, 세기 1~3)을 평균해 그 특징의 차원 값으로 쓴다(줄 많은 특징이 이기지 않게).
 */
import { createHash } from "node:crypto";
import type { Knowledge } from "./knowledge";
import type { FeatureHit } from "./featureTypes";
import { POLE_TAGS, stackOf } from "./mbtiFn";
import type { PersonaTag } from "@/data/knowledge-v5/schema";
import type { ProfileCodes } from "./pairProfile";

const keyOf = (text: string) => createHash("sha1").update(text).digest("hex").slice(0, 12);

/** 긴장 기준값(W7-4 전수 분포로 정함 — w7.md 4절): 두 끝이 모두 THETA 이상이고 차이가 큰 쪽의 DELTA 이하면 긴장 후보. 값은 |합| ≥ ASSERT일 때만. */
export const PERSONA_RULES = { THETA: 3, DELTA: 0.35, ASSERT: 1 } as const;

export type PoleCond = { readonly who?: string; readonly sit?: string };
export type PersonaDim = {
  readonly id: string;
  /** 1 = + 끝 · −1 = − 끝 · 0 = 근거 모자람(거르지 않음). 긴장이면 큰 쪽(같으면 MBTI 쪽, 없으면 +). */
  readonly v: 1 | -1 | 0;
  readonly plus: number; readonly minus: number;
  /** 조건부 긴장(두 끝의 조건이 다름): 끝마다 조건. */
  readonly tension?: { readonly plus: PoleCond; readonly minus: PoleCond };
  /** 근거 이름(무게 큰 순). */
  readonly why: readonly string[];
};
export type PersonaSheet = {
  readonly dims: readonly PersonaDim[];
  readonly core: readonly { readonly id: string; readonly v: 1 | -1; readonly why: readonly string[] }[];
  readonly tensions: readonly { readonly id: string; readonly plus: PoleCond; readonly minus: PoleCond; readonly why: readonly string[] }[];
  readonly discoveries: readonly { readonly id: string; readonly v: 1 | -1; readonly domain: string; readonly key: string }[];
};

type Contribution = { dim: string; pole: 1 | -1; w: number; who: string; cond?: PoleCond };

/** 특징 하나가 작가에게 보낼 수 있는 DB 글(재료 dbTexts와 같은 칸, 그 사람의 자리·강약에 맞는 것만). */
export function featureTexts(k: Knowledge, hit: Pick<FeatureHit, "id" | "positions" | "strength">): { text: string; field: string }[] {
  const f = k.features.get(hit.id); if (!f) return [];
  const out: { text: string; field: string }[] = [];
  const put = (t: unknown, field: string) => { if (typeof t === "string" && t.length >= 10) out.push({ text: t, field }); };
  for (const [dom, l] of Object.entries(f.scenes)) for (const s of l ?? []) put(s.text, `scenes.${dom}`);
  put(f.life, "life"); put(f.shadow, "shadow"); put(f.meaning, "meaning");
  put(f.forYou?.base, "forYou.base"); if (hit.strength === "strong") put(f.forYou?.strong, "forYou.strong"); if (hit.strength === "weak") put(f.forYou?.weak, "forYou.weak");
  for (const v of f.strengths ?? []) put(v, "strengths");
  for (const v of f.overuse ?? []) put(v, "overuse");
  if (hit.strength === "strong") put(f.strengthRules?.strong, "strengthRules.strong"); if (hit.strength === "weak") put(f.strengthRules?.weak, "strengthRules.weak");
  for (const p of hit.positions) put((f.positionNuance as Record<string, string> | undefined)?.[p], `positionNuance.${p}`);
  return out;
}

/** 명리 특징의 우선순위 무게(보고서 표). 투출 = 년·월·시 천간 십성에 그 십성이 있음. */
export function hitWeight(hit: Pick<FeatureHit, "id" | "family" | "positions" | "strength">, stemTenGods: Readonly<Partial<Record<string, string | null>>>): number {
  const mul = hit.strength === "strong" ? 1.5 : hit.strength === "weak" ? 0.5 : 1;
  const base = (() => {
    switch (hit.family) {
      case "relation": return 0;
      case "dayMaster": case "climate": return 3;
      case "element": return /:(STRONG|WEAK|MISSING)$/.test(hit.id) ? 3 : 1;
      case "dayPillar": return 2;
      case "branch": return hit.positions.includes("day") ? 2 : 1;
      case "tenGod": { const tg = hit.id.split(":")[1]; return Object.entries(stemTenGods).some(([p, v]) => p !== "day" && v === tg) ? 2 : 1; }
      default: return /WONJIN/.test(hit.id) ? 0 : 1;
    }
  })();
  return base * mul;
}

const mapOld = (k: Knowledge) => { const m = new Map<string, [string, 1 | -1]>(); for (const d of k.ontology.persona?.dims ?? []) for (const [o, s] of d.from) m.set(o, [d.id, s]); return m; };

/** MBTI 기여: 기능·태도 표(POLE_TAGS)를 사전 차원으로 옮겨, 주·부기능 3 · 글자 2 · 3·4차 1. */
export function mbtiContributions(k: Knowledge, type: string | null): Contribution[] {
  if (!type) return [];
  const stack = stackOf(type), old = mapOld(k), out: Contribution[] = [];
  for (const [key, tag] of Object.entries(POLE_TAGS)) {
    const m = old.get(key.slice(0, -1)); if (!m) continue;
    const pole = ((key.endsWith("+") ? 1 : -1) * m[1]) as 1 | -1;
    let w = 0;
    for (const fn of tag.fn ?? []) { const r = stack.indexOf(fn); if (r === 0 || r === 1) w = Math.max(w, 3); else if (r >= 2) w = Math.max(w, 1); }
    for (const a of tag.att ?? []) if (type.includes(a)) w = Math.max(w, 2);
    if (w) out.push({ dim: m[0], pole, w, who: `MBTI ${type}` });
  }
  return out;
}

/** 꼬리표 줄 → 특징 하나의 차원 값(줄 평균). */
function featureContributions(k: Knowledge, hit: FeatureHit, weight: number, name: string): Contribution[] {
  if (!weight) return [];
  const acc = new Map<string, { sum: number; n: number; conds: PoleCond[] }>(); let n = 0;
  for (const { text } of featureTexts(k, hit)) {
    const t: PersonaTag | undefined = k.personaTags.get(keyOf(text));
    if (!t || (t.k !== "trait" && t.k !== "situ")) continue;
    n++;
    const lw = t.k === "trait" ? 1 : 0.5;
    for (const [dim, pole, s] of t.d) { const key = `${dim}${pole > 0 ? "+" : "-"}`; const a = acc.get(key) ?? { sum: 0, n: 0, conds: [] }; a.sum += s * lw; a.n++; if (t.c && (t.c.who || t.c.sit)) a.conds.push({ ...(t.c.who ? { who: t.c.who } : {}), ...(t.c.sit ? { sit: t.c.sit } : {}) }); acc.set(key, a); }
  }
  if (!n) return [];
  return [...acc].map(([key, a]) => ({ dim: key.slice(0, -1), pole: (key.endsWith("+") ? 1 : -1) as 1 | -1, w: (a.sum / n) * weight * 3, who: name, ...(a.conds.length * 2 > a.n ? { cond: a.conds[0] } : {}) }));
}

const sameCond = (a?: PoleCond, b?: PoleCond) => (a?.who ?? "") === (b?.who ?? "") && (a?.sit ?? "") === (b?.sit ?? "");

/** 정답지. hits = 원국 특징 전부, stemTenGods = saju.tenGods.stems(투출 판정), mbti = 유형(없으면 null). */
export function personaSheet(k: Knowledge, hits: readonly FeatureHit[], stemTenGods: Readonly<Partial<Record<string, string | null>>>, mbti: string | null): PersonaSheet {
  const contribs: Contribution[] = [];
  for (const h of hits) contribs.push(...featureContributions(k, h, hitWeight(h, stemTenGods), k.features.get(h.id)?.name ?? h.id));
  contribs.push(...mbtiContributions(k, mbti));
  const dims: PersonaDim[] = [];
  for (const d of k.ontology.persona?.dims ?? []) {
    const cs = contribs.filter(c => c.dim === d.id);
    const P = cs.filter(c => c.pole > 0).reduce((a, c) => a + c.w, 0), M = cs.filter(c => c.pole < 0).reduce((a, c) => a + c.w, 0);
    const net = P - M, big = Math.max(P, M);
    const mbtiPole = cs.filter(c => c.who.startsWith("MBTI")).sort((a, b) => b.w - a.w)[0]?.pole;
    let v: 1 | -1 | 0 = Math.abs(net) >= PERSONA_RULES.ASSERT ? (net > 0 ? 1 : -1) : 0;
    let tension: PersonaDim["tension"];
    if (P >= PERSONA_RULES.THETA && M >= PERSONA_RULES.THETA && Math.abs(net) <= PERSONA_RULES.DELTA * big) {
      const pc = cs.filter(c => c.pole > 0 && c.cond).sort((a, b) => b.w - a.w)[0]?.cond, mc = cs.filter(c => c.pole < 0 && c.cond).sort((a, b) => b.w - a.w)[0]?.cond;
      if ((pc || mc) && !sameCond(pc, mc)) tension = { plus: pc ?? {}, minus: mc ?? {} };
      if (v === 0) v = (mbtiPole ?? 1) as 1 | -1;
    }
    const why = [...new Map(cs.filter(c => v === 0 || c.pole === v).sort((a, b) => b.w - a.w).map(c => [c.who, c])).keys()].slice(0, 3);
    dims.push({ id: d.id, v, plus: Math.round(P * 10) / 10, minus: Math.round(M * 10) / 10, ...(tension ? { tension } : {}), why });
  }
  // 최종판2 1-3(판독 검증 — ISTJ를 「앞에 나서는·그 자리에서 받아치는」 쪽으로 쓴 결함): MBTI가 있으면 E/I·J/P 글자가 정하는 다섯 차원은 글자 쪽(조건부 긴장 제외).
  const m = mbti && /^[EI][NS][TF][JP]$/.test(mbti) ? mbti : null;
  if (m) for (const [id, pole] of [["socialEnergy", m[0] === "E" ? 1 : -1], ["attentionSeeking", m[0] === "E" ? 1 : -1], ["conflictApproach", m[0] === "E" ? 1 : -1], ["verbalOutput", m[0] === "E" ? 1 : -1], ["noveltySeeking", m[3] === "P" ? 1 : -1]] as const) {
    const i = dims.findIndex(d => d.id === id); if (i < 0 || dims[i].tension || dims[i].v === pole) continue;
    dims[i] = { ...dims[i], v: pole, why: [`MBTI ${m} 글자`, ...dims[i].why.filter(w => !w.startsWith("MBTI"))].slice(0, 3) };
  }
  const core = dims.filter(d => d.v !== 0 && !d.tension).sort((a, b) => Math.abs(b.plus - b.minus) - Math.abs(a.plus - a.minus)).slice(0, 5).map(d => ({ id: d.id, v: d.v as 1 | -1, why: d.why }));
  const tensions = dims.filter(d => d.tension).sort((a, b) => Math.min(b.plus, b.minus) - Math.min(a.plus, a.minus)).slice(0, 3).map(d => ({ id: d.id, plus: d.tension!.plus, minus: d.tension!.minus, why: d.why }));
  // 발견: 핵심 × 영역 — 그 사람 특징의 장면 줄 중 그 끝을 말하는 것(무게 큰 특징 먼저).
  const DOMAINS = ["work", "money", "love", "relationships", "marriage"];
  const discoveries: PersonaSheet["discoveries"][number][] = [];
  const ordered = [...hits].sort((a, b) => hitWeight(b, stemTenGods) - hitWeight(a, stemTenGods) || a.id.localeCompare(b.id));
  for (const c of core) for (const dom of DOMAINS) {
    for (const h of ordered) {
      if (!hitWeight(h, stemTenGods)) continue;
      const hitLine = featureTexts(k, h).find(x => x.field === `scenes.${dom}` && k.personaTags.get(keyOf(x.text))?.d.some(([dd, p]) => dd === c.id && p === c.v));
      if (hitLine) { discoveries.push({ id: c.id, v: c.v, domain: dom, key: keyOf(hitLine.text) }); break; }
    }
  }
  return { dims, core, tensions, discoveries };
}

/** 줄 하나가 정답지와 맞는지: 긴장 아닌 차원에서 반대 끝이면 false(뺀다). 긴장 차원은 줄 조건이 그 끝의 조건과 맞을 때만 true. */
export function lineFits(sheet: PersonaSheet, tag: PersonaTag | undefined): boolean {
  if (!tag || tag.k === "flow" || tag.k === "explain" || tag.k === "advice" || tag.k === "pair") return true;
  for (const [dim, pole] of tag.d) {
    const d = sheet.dims.find(x => x.id === dim); if (!d || d.v === 0) continue;
    if (d.tension) { const want = pole > 0 ? d.tension.plus : d.tension.minus; const got: PoleCond = tag.c ? { ...(tag.c.who ? { who: tag.c.who } : {}), ...(tag.c.sit ? { sit: tag.c.sit } : {}) } : {}; if (!sameCond(got, want)) return false; continue; }
    if (pole !== d.v) return false;
  }
  return true;
}
export const personaKey = keyOf;

/** W7-2 단일 출처: 성격 요약표(한 사람 4종)·궁합 성격표 값을 정답지에서 뽑는다(차원 값 0이면 MBTI 글자, 그것도 없으면 비움). */
export function profileCodesFromSheet(sheet: PersonaSheet, mbti: string | null): ProfileCodes {
  const v = (id: string) => sheet.dims.find(d => d.id === id)?.v ?? 0;
  const m = mbti && /^[EI][NS][TF][JP]$/.test(mbti) ? mbti : null;
  const se = v("socialEnergy"), lead = v("attentionSeeking"), cf = v("conflictApproach"), vo = v("verbalOutput"), ee = v("emotionalExpression"), ds = v("decisionSpeed"), nv = v("noveltySeeking"), sp = v("spendingControl");
  return {
    energy: se > 0 ? "E" : se < 0 ? "I" : m ? (m[0] as "E" | "I") : null,
    lead: lead > 0 ? "front" : lead < 0 ? "back" : m ? (m[0] === "E" ? "front" : "back") : null,
    conflict: cf > 0 ? "now" : cf < 0 ? "later" : m ? (m[0] === "E" ? "now" : "later") : null,
    express: vo > 0 ? (ee > 0 ? "말·표정" : "말") : vo < 0 ? "행동" : ee > 0 ? "말·표정" : ee < 0 ? "행동" : null,
    decide: ds > 0 ? "fast" : ds < 0 ? "slow" : "mid",
    offer: nv > 0 ? "open" : nv < 0 ? "hold" : m ? (m[3] === "J" ? "hold" : "open") : null,
    money: sp > 0 ? "plan" : sp < 0 ? "now" : null,
  };
}

/** W7-4: 옛 차원(행동 벡터·POLE_CUES·EXTRA) → 사전 차원(뒤집음). 사전 차원 자기 이름도 넣는다. */
export function personaDimMap(k: Knowledge): Map<string, readonly [string, 1 | -1]> {
  const m = new Map<string, readonly [string, 1 | -1]>();
  for (const d of k.ontology.persona?.dims ?? []) { m.set(d.id, [d.id, 1]); for (const [o, sg] of d.from) m.set(o, [d.id, sg]); }
  return m;
}
