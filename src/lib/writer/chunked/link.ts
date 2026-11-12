/**
 * AM2-5 1부(덕짱님 지시 2026-11-12) — key 「연결 고리」: 그 달·해의 핵심 관계가 닿는 원국 자리(연·월·일·시)가 이 사람 삶의 어느 쪽인지,
 * 그리고 이 사람의 입력(연애 상태·일·적은 바람과 바람 영역·자녀)과 그 key의 영역 신호, 책 안 다른 key와의 겹침을 잇는 결정론 줄 0~2개(호출 0).
 * - 자리 뜻은 지식 DB(deep/seat-meaning.json — 궁위 통설, deep/annual-relation note와 같은 자리 뜻).
 * - 엔진 값(그 key의 관계 배지와 자리)과 입력(인물 카드 사실), 두 근거가 다 있을 때만 만든다(억지 고리 0 — `verifyLinks`가 2,010명에서 본다).
 * - 입력 조건: 자녀 입력이 「있음」이 아니면 시 자리를 자녀로 쓰지 않는다 · 솔로·썸이면 일 자리는 「가장 가까운 사람·연애」 경향으로만 · 시간 미상이면 시 자리는 없다.
 * - 고리 글은 경향 말(「…쪽이 움직이는 때」)만 — 성사·사건 예언 없음(작가 규칙이 막는다).
 * key 짝(명리 × MBTI): 그 key의 하늘 십성 × MBTI 유형 규칙이 Fusion DB(knowledge-v5/fusion)에 있을 때만, key당 하나, 같은 짝은 책에서 한 번.
 */
import type { Knowledge } from "@/lib/brief/knowledge";
import { deepLines } from "@/lib/brief/knowledge";
import type { Brief, TimelineEntry } from "@/lib/brief/schema";
import { coreOf, relName } from "@/lib/brief/core";
import { josa } from "@/lib/brief/labels";
import { stripFnCodes } from "./card";

export type Seat = "year" | "month" | "day" | "hour";
const SEAT_KO: Readonly<Record<Seat, string>> = { year: "태어난 해", month: "태어난 달", day: "태어난 날", hour: "태어난 시각" };
const SEAT_OF: Readonly<Record<string, Seat>> = { "태어난 해": "year", "태어난 달": "month", "태어난 날": "day", "태어난 시각": "hour" };
/** 한 관계가 여러 자리에 닿으면 이 순서로 고른다(일 · 월 자리가 무겁다 — core.ts 가중치와 같은 생각). */
const SEAT_ORDER: readonly Seat[] = ["day", "month", "year", "hour"];
export const seatsOfWith = (w: string | undefined): Seat[] => (w ?? "").split("·").map(x => x.trim()).filter(Boolean).map(x => SEAT_OF[/^태어난 /.test(x) ? x : `태어난 ${x}`]).filter((x): x is Seat => Boolean(x));
const TOPIC_KO: Readonly<Record<string, string>> = { love: "연애", money: "돈", work: "일", study: "공부", people: "사람", mind: "마음" };
/** 그 자리와 이어지는 바람 영역(적은 바람의 주제). */
const SEAT_TOPICS: Readonly<Record<Seat, readonly string[]>> = { day: ["love", "people"], month: ["work", "study", "money"], year: ["people", "work"], hour: [] };
/** 세운 달 영역 신호 → 자리. */
const SEAT_SIGNAL: Readonly<Record<Seat, readonly ("love" | "money" | "work" | "people" | "mind")[]>> = { day: ["love", "people"], month: ["work", "money"], year: ["people", "work"], hour: [] };
const SIGNAL_KO: Readonly<Record<string, string>> = { love: "연애", money: "돈", work: "일", people: "사람", mind: "마음" };

/** 고리 한 줄과 그 근거(엔진 값 · 입력 출처). */
export type Link = { readonly text: string; readonly seat?: Seat; readonly engine: readonly string[]; readonly input: readonly string[]; readonly kind: "seat" | "echo" };
export type LinkCtx = {
  readonly brief: Brief; readonly k: Pick<Knowledge, "deep">;
  /** 적은 바람 주제(세운만, 바람이 「ok」일 때). */ readonly wishTopics: readonly string[];
  /** 바람과 이어지는 영역이 오르는 달(이름 「7월 · 정미월」). */ readonly wishMonths: ReadonlySet<string>;
  /** 그 시기가 속한 대운 십성(세운 달은 책의 해 대운). */ readonly dayunTenGod?: string;
  /** 같은 겹침 고리를 책에서 한 번만(관계 이름|자리). */ readonly echoed: Set<string>;
  /** 자리 고리를 처음 쓴 key(자리|입력 → 이름). 같은 자리를 다시 쓰면 그 key를 가리켜 짧게(같은 고리 문장이 여러 달에 되풀이되지 않게). */ readonly seatUsed?: Map<string, string>;
};
type Facet = { readonly facet: string; readonly who: string; readonly input: string };

/** 그 자리에 쓸 입력(없으면 null — 고리를 만들지 않는다). */
function facetOf(seat: Seat, b: Brief, wishTopics: readonly string[]): Facet | null {
  const f = b.person.facts, rel = f.relationship, job = f.job.status;
  const wish = wishTopics.filter(t => SEAT_TOPICS[seat].includes(t));
  if (seat === "day") {
    // 브리프의 연애 상태는 넷(single · dating · married · unknown — 썸은 솔로, 결혼 준비는 연애 중으로 접힌다).
    if (rel === "single") return { facet: "solo", who: "솔로인", input: "relationship=single" };
    if (rel === "dating") return { facet: "dating", who: "연애 중인", input: "relationship=dating" };
    if (rel === "married") return { facet: "married", who: "기혼인", input: "relationship=married" };
    return wish.length ? { facet: "base", who: `바람에 ${wish.map(t => TOPIC_KO[t]).join("·")} 쪽을 적은`, input: `wish:${wish.join(",")}` } : null;
  }
  if (seat === "month") {
    if (job === "employee") return { facet: "work", who: "직장인인", input: "job=employee" };
    if (job === "freelancer") return { facet: "work", who: "프리랜서인", input: "job=freelancer" };
    if (job === "self_employed" || job === "business_owner") return { facet: "business", who: job === "business_owner" ? "사업을 하는" : "자영업을 하는", input: `job=${job}` };
    if (job === "job_seeker") return { facet: "seek", who: "취업을 준비하는", input: "job=job_seeker" };
    return wish.length ? { facet: "base", who: `바람에 ${wish.map(t => TOPIC_KO[t]).join("·")} 쪽을 적은`, input: `wish:${wish.join(",")}` } : null;
  }
  if (seat === "year") {
    if (job === "employee") return { facet: "work", who: "직장인인", input: "job=employee" };
    if (wishTopics.includes("people")) return { facet: "people", who: "바람에 사람 쪽을 적은", input: "wish:people" };
    return null;
  }
  // 시 자리: 시간 미상이면 없다. 자녀는 자녀 입력이 「있음」일 때만(그 밖에는 고리를 만들지 않는다 — 「아랫사람·후배」는 연차 말이라 입력 밖).
  if (!f.birthTimeKnown) return null;
  return f.children === "has" ? { facet: "children", who: "자녀가 있는", input: "children=has" } : null;
}
const seatText = (k: Pick<Knowledge, "deep">, seat: Seat, facet: string) => deepLines(k, "seat-meaning", `seat:${seat}`, facet)[0] ?? "";

/** key 하나의 고리 0~2줄. 엔진 값(핵심 관계의 자리)과 입력이 다 있을 때만. */
export function keyLinks(e: TimelineEntry, c: LinkCtx, label: string, others: readonly { readonly e: TimelineEntry; readonly label: string }[]): Link[] {
  const core = coreOf(e, { ...(c.dayunTenGod ? { dayunTenGod: c.dayunTenGod } : {}) });
  const unit = e.kind === "month" ? "달" : "해";
  for (const it of core) {
    if (it.kind !== "rel" || it.badge.kind === "GONGMANG") continue;
    const seats = seatsOfWith(it.badge.with).filter(s => s !== "hour" || c.brief.person.facts.birthTimeKnown);
    for (const seat of SEAT_ORDER.filter(s => seats.includes(s))) {
      const fc = facetOf(seat, c.brief, c.wishTopics); if (!fc) continue;
      const base = seatText(c.k, seat, "base"), mine = seatText(c.k, seat, fc.facet);
      if (!base || !mine) continue;
      const wish = c.wishTopics.filter(t => SEAT_TOPICS[seat].includes(t) && !fc.input.startsWith("wish:"));
      const sig = e.signals ? SEAT_SIGNAL[seat].filter(d => e.signals![d] === "↑") : [];
      const engine = [`${e.key}:${it.badge.kind}:${it.name}@${SEAT_KO[seat]}`, ...sig.map(d => `${e.key}:signal:${d}↑`)];
      const input = [fc.input, ...wish.map(t => `wish:${t}`)];
      const extra = [wish.length ? `적어 준 바람의 ${wish.map(t => TOPIC_KO[t]).join("·")} 쪽과 같은 자리` : "", sig.length ? `이 ${unit} ${sig.map(d => SIGNAL_KO[d]).join("·")} 쪽 기운도 오름` : ""].filter(Boolean);
      const usedKey = `${seat}|${fc.input}`, prevLabel = c.seatUsed?.get(usedKey);
      if (!prevLabel) c.seatUsed?.set(usedKey, label);
      const first: Link = { kind: "seat", seat, engine, input, text: prevLabel
        ? `${josa(it.name, "이가")} 닿는 ${SEAT_KO[seat]} 자리(${base}) · ${prevLabel}과 같은 자리라 ${fc.who} 이 사람의 ${josa(mine, "이가")} 다시 움직이는 때${extra.length ? ` · ${extra.join(" · ")}` : ""}`
        : `${josa(it.name, "이가")} 닿는 ${SEAT_KO[seat]} 자리는 ${base} · ${fc.who} 이 사람에게는 ${josa(mine, "이가")} 움직이는 때${extra.length ? ` · ${extra.join(" · ")}` : ""}` };
      // 겹침: 같은 관계 이름이 같은 자리에 책 안 다른 곳(세운은 그 해, 그다음 다른 key)에도 걸리면 한 줄. 같은 겹침은 책에서 한 번.
      const echoKey = `${it.name}|${seat}`;
      const same = (x: TimelineEntry) => x.badges.some(b2 => relName(b2.label) === it.name && seatsOfWith(b2.with).includes(seat));
      const yearE = e.kind === "month" ? others.find(o => o.e.kind === "year") : undefined;
      const echoAt = yearE && same(yearE.e) ? { where: `${yearE.e.ganji.hangul}년 한 해`, key: yearE.e.key, year: true } : (() => { const o = others.find(x => x.e.key !== e.key && x.e.kind === e.kind && same(x.e)); return o ? { where: o.label, key: o.e.key, year: false } : null; })();
      const wishMonth = e.kind === "month" && c.wishMonths.has(label);
      const out: Link[] = [first];
      if (echoAt && !c.echoed.has(echoKey)) {
        c.echoed.add(echoKey);
        out.push({ kind: "echo", seat, engine: [`${echoAt.key}:${it.badge.kind}:${it.name}@${SEAT_KO[seat]}`, ...(wishMonth ? [`${e.key}:wishMonth`] : [])], input: [fc.input, ...(wishMonth ? ["wish:months"] : [])],
          text: echoAt.year ? `${echoAt.where}에 걸린 ${josa(it.name, "이가")} 이 달에 같은 자리에서 한 번 더 걸리는 때${wishMonth ? " · 바람과 이어지는 영역이 오르는 달" : ""}` : `같은 ${SEAT_KO[seat]} 자리의 ${josa(it.name, "이가")} ${echoAt.where}에도 걸림` });
      }
      return out;
    }
  }
  return [];
}

/** 2,010명 검사(5부): 고리마다 엔진 값과 입력 출처를 대조하고 입력 조건을 본다. 위반 글 목록(없으면 []). */
export function verifyLinks(b: Brief, keys: readonly { readonly key: string; readonly links?: readonly Link[] }[]): string[] {
  const out: string[] = [], f = b.person.facts, entries = new Map((b.timeline?.entries ?? []).map(e => [e.key, e] as const));
  for (const k of keys) for (const l of k.links ?? []) {
    const at = `${k.key} ${l.kind}`;
    if (!l.engine.length || !l.input.length) out.push(`${at}: 근거 하나뿐(엔진 ${l.engine.length} · 입력 ${l.input.length})`);
    for (const src of l.engine) {
      const m = /^([^:]+):([A-Z_]+):(.+)@(태어난 (?:해|달|날|시각))$/.exec(src);
      if (m) { const e = entries.get(m[1]); const ok = e?.badges.some(b2 => b2.kind === m[2] && relName(b2.label) === m[3] && seatsOfWith(b2.with).includes(SEAT_OF[m[4]])); if (!ok) out.push(`${at}: 엔진 값 없음 ${src}`); continue; }
      const s = /^([^:]+):signal:(love|money|work|people|mind)↑$/.exec(src);
      if (s) { if (entries.get(s[1])?.signals?.[s[2] as "love"] !== "↑") out.push(`${at}: 영역 신호 없음 ${src}`); continue; }
      if (/:wishMonth$/.test(src)) continue;
      out.push(`${at}: 모르는 엔진 출처 ${src}`);
    }
    for (const src of l.input) {
      const [kk, v] = src.split(/[=:]/);
      if (kk === "relationship" && f.relationship !== v) out.push(`${at}: 입력 ${src} ≠ ${f.relationship}`);
      else if (kk === "job" && f.job.status !== v) out.push(`${at}: 입력 ${src} ≠ ${f.job.status}`);
      else if (kk === "children" && f.children !== "has") out.push(`${at}: 자녀 입력 없음`);
      else if (kk === "wish" && b.product !== "annual_fortune") out.push(`${at}: 세운 밖 바람`);
    }
    if (l.seat === "hour" && !f.birthTimeKnown) out.push(`${at}: 시간 미상인데 시 자리`);
    if (/자녀|아이/.test(l.text) && f.children !== "has") out.push(`${at}: 자녀 입력 없이 자녀`);
    if (/배우자|부부/.test(l.text) && f.relationship !== "married") out.push(`${at}: 기혼 아님인데 배우자`);
    if (/연인과/.test(l.text) && f.relationship !== "dating") out.push(`${at}: 연애 중 아님인데 연인`);
    if (f.relationship === "single" && l.kind === "seat" && l.seat === "day" && !/가장 가까운 사람·연애/.test(l.text)) out.push(`${at}: 솔로인데 일 자리 뜻이 「가장 가까운 사람·연애」 경향이 아님`);
    if (/후배|아랫사람|부하|팀원|사수|선배/.test(l.text)) out.push(`${at}: 연차·직급 말`);
  }
  return out;
}

// ---------- key 짝(명리 × MBTI) ----------
const TG_HANJA: Readonly<Record<string, string>> = { 비견: "比肩", 겁재: "劫財", 식신: "食神", 상관: "傷官", 편재: "偏財", 정재: "正財", 편관: "偏官", 정관: "正官", 편인: "偏印", 정인: "正印" };
const OTHER_TG = /비견|겁재|식신|상관|편재|정재|편관|정관|편인|정인/g;
/** Fusion DB 규칙의 이유에서 그 유형이 주어인 한 문장(다른 십성·숫자·직장 전제가 없는 것). 없으면 null. */
export function keyPairWhy(k: Pick<Knowledge, "fusionByFeature">, tg: string, mbti: string, fits: (t: string) => boolean): { id: string; why: string } | null {
  const h = TG_HANJA[tg]; if (!h) return null;
  const rule = (k.fusionByFeature.get(`tenGod:${h}`) ?? []).find(r => r.mbtiTarget === mbti);
  if (!rule) return null;
  // 기능 기호(Ne·Fe …)가 든 문장은 뗀 자리가 비문이 된다(「ENFP는 로 사람을 끌어모으고」) — 기호 없는 문장만.
  const sents = rule.why.split(/(?<=[.!?])\s+/).map(s => stripFnCodes(s.trim(), mbti)).filter(s => s && !/(^|\s)(로|으로|는|은|가|이|를|을|와|과|의)(\s|$)/.test(s));
  const pick = sents.find(s => s.includes(mbti) && ![...s.matchAll(OTHER_TG)].some(m => m[0] !== tg) && !/\d/.test(s) && fits(s));
  return pick ? { id: rule.id, why: `${josa(tg, "이가")} 하늘에 든 때 · ${pick.replace(/[.!]$/, "")}` } : null;
}
