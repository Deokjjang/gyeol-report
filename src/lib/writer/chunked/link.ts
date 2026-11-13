/**
 * AM2-5 1부 → AM2-6 1부(덕짱님 지시 2026-11-12) — key 「연결 고리」는 문장이 아니라 재료다(결정론, 호출 0).
 * 재료 다섯 가지: ① 자리 뜻(지식 DB deep/seat-meaning — 그 key의 영역 신호로 하위 뜻을 고른다) ② 관계 뜻 한 마디(합 맺힘 · 충 부딪침 · 형 다듬음 · 파 어긋남 ·
 * 해 방해 · 반합·방합 모임 · 공망 빔 — 그 관계 배지 줄의 그림도 함께) ③ 입력(연애 상태 · 일 · 바람 영역) ④ 그 key의 영역 신호와 배지 방향(좋은 쪽 · 살필 쪽)
 * ⑤ 같은 자리가 이 책에서 몇 번째로 걸리는지(두 번째부터는 앞 key와 관계 뜻이 무엇이 다른지만).
 *   AM2-8 P8 뒤 고침: 몇 번째인지는 재료 칸(nth)에만 둔다 — 작가 글에 「이 책에서 이 자리 처음」 「이 책 2번째」를 주면 본문이 「이 책에서 처음 나오는 달」 「이 책에서 두 번째로 가까운 사람」으로 옮긴다(P8 annual-1 2월 · annual-p6b 3월). 앞 key가 있으면 「앞: …」만.
 * - 엔진 값(그 key의 관계 배지와 자리)과 입력(인물 카드 사실), 두 근거가 다 있을 때만 만든다(억지 고리 0 — `verifyLinks`가 2,010명에서 본다).
 * - 입력 조건: 자녀 입력이 「있음」이 아니면 시 자리를 자녀로 쓰지 않는다 · 시간 미상이면 시 자리는 없다 · 연애 상태 미입력이면 일 자리를 연애로 잇지 않는다.
 * - 반드시 쓸 것이 둘이면 둘째 관계에도 관계 뜻 한 마디를 재료로 준다(P5 R-G3 8 key).
 * - 바람은 key마다 넣지 않는다. 바람과 이어지는 고리는 책 전체에서 엔진이 강도순으로 1~3개만 고른다(`rankWishLinks`, intake).
 * key 짝(명리 × MBTI)은 Fusion DB 규칙에 「잇는 이유」(공통·보완·긴장)가 있을 때만(`keyPairWhy`).
 */
import type { Knowledge } from "@/lib/brief/knowledge";
import { deepLines } from "@/lib/brief/knowledge";
import type { Brief, TimelineEntry } from "@/lib/brief/schema";
import { coreOf, relName } from "@/lib/brief/core";
import { josa } from "@/lib/brief/labels";
import { stripFnCodes } from "./card";

export type Seat = "year" | "month" | "day" | "hour";
export const SEAT_KO: Readonly<Record<Seat, string>> = { year: "태어난 해", month: "태어난 달", day: "태어난 날", hour: "태어난 시각" };
const SEAT_OF: Readonly<Record<string, Seat>> = { "태어난 해": "year", "태어난 달": "month", "태어난 날": "day", "태어난 시각": "hour" };
/** 한 관계가 여러 자리에 닿으면 이 순서로 고른다(일 · 월 자리가 무겁다 — core.ts 가중치와 같은 생각). */
const SEAT_ORDER: readonly Seat[] = ["day", "month", "year", "hour"];
export const seatsOfWith = (w: string | undefined): Seat[] => (w ?? "").split("·").map(x => x.trim()).filter(Boolean).map(x => SEAT_OF[/^태어난 /.test(x) ? x : `태어난 ${x}`]).filter((x): x is Seat => Boolean(x));
const TOPIC_KO: Readonly<Record<string, string>> = { love: "연애", money: "돈", work: "일", study: "공부", people: "사람", mind: "마음" };
/** 그 자리와 이어지는 바람 영역(적은 바람의 주제). */
export const SEAT_TOPICS: Readonly<Record<Seat, readonly string[]>> = { day: ["love", "people"], month: ["work", "study", "money"], year: ["people", "work"], hour: [] };
/** 세운 달 영역 신호 → 자리. */
const SIGNAL_KO: Readonly<Record<string, string>> = { love: "연애", money: "돈", work: "일", people: "사람", mind: "마음" };
/** 자리 → 장면 씨앗 영역(mbti-seeds 영역 이름). 일 자리는 쪽(가까운 사람 · 내 생활)에 따라. */
export const SEAT_DOMAIN: Readonly<Record<Seat, readonly string[]>> = { day: ["love", "relationships"], month: ["work", "money"], year: ["relationships", "work"], hour: ["alone"] };

/** 관계 뜻 한 마디(덕짱님 지시 AM2-6 1부). 원진은 지시 목록 밖이라 화면 「까끌한 엇박자」와 같은 말. */
export const REL_WORD: Readonly<Record<string, string>> = { YUKHAP: "맺힘", STEM_HAP: "맺힘", SAMHAP: "모임", BANGHAP: "모임", CHUNG: "부딪침", HYEONG: "다듬음", PA: "어긋남", HAE: "방해", WONJIN: "엇박자", GONGMANG: "빔" };
/** 배지 방향: 충·형·파·해·원진·공망은 살필 쪽, 합(배지 결이 plus)은 좋은 쪽, 그 밖(결이 섞인 합)은 정하지 않는다. */
const MINUS_KIND = new Set(["CHUNG", "HYEONG", "PA", "HAE", "WONJIN", "GONGMANG"]);
const HAP_KIND = new Set(["YUKHAP", "STEM_HAP", "SAMHAP", "BANGHAP"]);
export type Dir = "plus" | "minus" | "none";
/** 배지 줄의 그 관계 그림(「햇빛과 보석이 어울려 겉이 빛나고 속은 눌리는 흐름」 → 「겉이 빛나고 속은 눌리는」). */
export function relImageOf(line: string): string {
  const t = line.replace(/^반합\([^)]*\): /, "").replace(/\s?(흐름|해|달)$/, "").trim();
  const m = /(?:어울려|만나|부딪쳐|맞서|어긋나|방해해|모여|완성되어|묶여|눌러|겹쳐|잃어|밀어|짝이 맞아|손을 잡아|해를 끼쳐|든 해,|든 달,) (.+)$/.exec(t);
  return (m?.[1] ?? t).replace(/^힘을 줘도 /, "힘을 줘도 ").trim();
}
type Badge = TimelineEntry["badges"][number];
export const dirOfBadge = (b: Pick<Badge, "kind" | "tone">): Dir => (MINUS_KIND.has(b.kind) ? "minus" : HAP_KIND.has(b.kind) && b.tone === "plus" ? "plus" : "none");

export { loveUpOf } from "@/lib/brief/core";
/** 화면 핵심 줄에 붙이는 자리 뜻(두세 글자, 지식 DB short:*). 일 자리는 연애가 오르면 가까운 사람, 아니면 내 생활. */
export function seatShortOf(k: Pick<Knowledge, "deep">, seat: Seat, o: { loveUp: boolean; children: boolean }): string {
  const facet = seat === "day" ? (o.loveUp ? "short:close" : "short:life") : seat === "hour" && o.children ? "short:children" : "short";
  return deepLines(k, "seat-meaning", `seat:${seat}`, facet)[0] ?? "";
}

/** 고리 재료 한 줄과 그 근거(엔진 값 · 입력 출처). text = 작가에게 가는 재료 줄(문장 아님). */
export type Link = {
  readonly text: string; readonly seat?: Seat; readonly engine: readonly string[]; readonly input: readonly string[]; readonly kind: "seat" | "echo" | "second" | "wish";
  /** 재료 칸(검사·도구용): 관계 이름 · 관계 뜻 한 마디 · 방향 · 자리 뜻 · 이 책에서 몇 번째 자리. */
  readonly rel?: string; readonly word?: string; readonly dir?: Dir; readonly seatMeaning?: string; readonly nth?: number; readonly topics?: readonly string[];
  /** 이 고리 자리 뜻의 영역(장면 씨앗 영역 이름 — love · money · work · relationships · alone). */ readonly areas?: readonly string[];
};
/** 자리 뜻 → 영역 신호 칸(그 자리 뜻이 가리키는 쪽만). */
function facetArea(seat: Seat, side: "close" | "life", facet: string): ("love" | "money" | "work" | "people" | "mind")[] {
  if (seat === "day") return side === "life" ? ["mind"] : ["love"];
  if (seat === "month") return /^money:/.test(facet) ? ["money"] : /^people:/.test(facet) ? ["people"] : ["work"];
  if (seat === "year") return facet === "people" ? ["people"] : ["work"];
  return ["mind"];
}
/** AM2-7 3부 4: 태어난 날 자리의 쪽은 책 하나에 하나(연애 상태를 적었으면 가까운 사람 쪽, 아니면 내 생활 쪽). 화면 핵심 줄도 같은 값(book.ts seatSide). */
export const daySide = (b: Pick<Brief, "person">): "close" | "life" => (b.person.facts.relationship === "unknown" ? "life" : "close");
/** 영역 신호 칸 → 장면 씨앗 영역. 기혼의 「배우자와의 사이」는 사람 사이 씨앗도 받는다. */
const AREA_DOMAIN = (a: readonly string[], rel: string): string[] => a.flatMap(x => x === "love" ? (rel === "married" ? ["relationships", "love"] : ["love"]) : x === "people" ? ["relationships"] : x === "mind" ? ["alone"] : [x]);
export type LinkCtx = {
  readonly brief: Brief; readonly k: Pick<Knowledge, "deep">;
  /** 적은 바람 주제(세운만, 바람이 「ok」일 때). */ readonly wishTopics: readonly string[];
  /** 바람과 이어지는 영역이 오르는 달(이름 「7월 · 정미월」). */ readonly wishMonths: ReadonlySet<string>;
  /** 그 시기가 속한 대운 십성(세운 달은 책의 해 대운). */ readonly dayunTenGod?: string;
  /** 같은 겹침 재료를 책에서 한 번만(관계 이름|자리). */ readonly echoed: Set<string>;
  /** 자리를 처음 쓴 key(자리 → 이름 · 관계 뜻 · 몇 번째 · 쪽). 같은 자리가 다시 나오면 앞 key와 무엇이 다른지만 준다. */ readonly seatUsed?: Map<string, { label: string; word: string; n: number; short: string; key?: string; rel?: string }>;
};
type Facet = { readonly facet: string; readonly who: string; readonly input: string };

const JOB_FACET = (job: string): { facet: string; who: string } | null => job === "employee" ? { facet: "work", who: "직장인" } : job === "freelancer" ? { facet: "work", who: "프리랜서" }
  : job === "self_employed" ? { facet: "business", who: "자영업" } : job === "business_owner" ? { facet: "business", who: "사업" } : job === "job_seeker" ? { facet: "seek", who: "취업 준비" } : null;
/** 그 자리에 쓸 입력(없으면 null — 고리를 만들지 않는다). side: 일 자리의 쪽(가까운 사람 · 내 생활). */
function facetOf(seat: Seat, b: Brief, wishTopics: readonly string[], side: "close" | "life"): Facet | null {
  const f = b.person.facts, rel = f.relationship, job = f.job.status;
  const wish = wishTopics.filter(t => SEAT_TOPICS[seat].includes(t));
  if (seat === "day") {
    if (side === "life") {
      // 내 생활 쪽: 일 입력(직장인 · 프리랜서 · 사업 · 학생 · 취준) → 없으면 연애 상태.
      if (job === "employee") return { facet: "life:employee", who: "직장인", input: "job=employee" };
      if (job === "freelancer" || job === "self_employed" || job === "business_owner") return { facet: "life:work", who: JOB_FACET(job)!.who, input: `job=${job}` };
      if (job === "student") return { facet: "life:student", who: "학생", input: "job=student" };
      if (job === "job_seeker") return { facet: "life:seek", who: "취업 준비", input: "job=job_seeker" };
      if (rel === "single") return { facet: "life:solo", who: "솔로", input: "relationship=single" };
      if (rel === "dating") return { facet: "life:dating", who: "연애 중", input: "relationship=dating" };
      if (rel === "married") return { facet: "life:married", who: "기혼", input: "relationship=married" };
      return null;
    }
    // 브리프의 연애 상태는 넷(single · dating · married · unknown — 썸은 솔로, 결혼 준비는 연애 중으로 접힌다).
    if (rel === "single") return { facet: "solo", who: "솔로", input: "relationship=single" };
    if (rel === "dating") return { facet: "dating", who: "연애 중", input: "relationship=dating" };
    if (rel === "married") return { facet: "married", who: "기혼", input: "relationship=married" };
    return wish.length ? { facet: "base", who: `바람에 ${wish.map(t => TOPIC_KO[t]).join("·")} 쪽을 적음`, input: `wish:${wish.join(",")}` } : null;
  }
  if (seat === "month") {
    const j = JOB_FACET(job);
    if (j) return { facet: j.facet, who: j.who, input: `job=${job}` };
    return wish.length ? { facet: "base", who: `바람에 ${wish.map(t => TOPIC_KO[t]).join("·")} 쪽을 적음`, input: `wish:${wish.join(",")}` } : null;
  }
  if (seat === "year") {
    if (job === "employee") return { facet: "work", who: "직장인", input: "job=employee" };
    if (wishTopics.includes("people")) return { facet: "people", who: "바람에 사람 쪽을 적음", input: "wish:people" };
    return null;
  }
  // 시 자리: 시간 미상이면 없다. 자녀는 자녀 입력이 「있음」일 때만(그 밖에는 고리를 만들지 않는다 — 「아랫사람·후배」는 연차 말이라 입력 밖).
  if (!f.birthTimeKnown) return null;
  return f.children === "has" ? { facet: "children", who: "자녀 있음", input: "children=has" } : null;
}
const seatText = (k: Pick<Knowledge, "deep">, seat: Seat, facet: string) => deepLines(k, "seat-meaning", `seat:${seat}`, facet)[0] ?? "";
/** 월 자리 하위 뜻: 그 key에서 돈·사람이 오르면 그쪽(직장인 · 사업 입력일 때만 — 지식 DB money:* · people:*). */
const monthFacet = (fc: Facet, e: Pick<TimelineEntry, "signals">) => (fc.facet === "work" || fc.facet === "business") && e.signals ? (e.signals.money === "↑" && e.signals.work !== "↑" ? `money:${fc.facet}` : e.signals.people === "↑" && e.signals.work !== "↑" ? `people:${fc.facet}` : fc.facet) : fc.facet;
const DIR_KO: Readonly<Record<Dir, string>> = { plus: "좋은 쪽", minus: "살필 쪽", none: "섞임" };

/** key 하나의 고리 재료 0~3줄(자리 재료 · 겹침 · 둘째 핵심). 엔진 값(핵심 관계의 자리)과 입력이 다 있을 때만. */
export function keyLinks(e: TimelineEntry, c: LinkCtx, label: string, others: readonly { readonly e: TimelineEntry; readonly label: string }[]): Link[] {
  const core = coreOf(e, { ...(c.dayunTenGod ? { dayunTenGod: c.dayunTenGod } : {}) });
  const unit = e.kind === "month" ? "달" : "해";
  const gender = c.brief.person.gender;
  const out: Link[] = [];
  let seatDone = false;
  core.forEach((it, ci) => {
    if (it.kind !== "rel") return;
    const word = REL_WORD[it.badge.kind] ?? "걸림", image = relImageOf(it.badge.line), dir0 = dirOfBadge(it.badge);
    if (seatDone || it.badge.kind === "GONGMANG") {
      // 둘째 핵심(또는 공망): 자리 없이 관계 뜻 한 마디만(이름과 함께 이 사람 상황에 맞춘 한 마디로 — 이름만 부르고 끝내지 않게).
      if (ci > 0) out.push({ kind: "second", engine: [`${e.key}:${it.badge.kind}:${it.name}`], input: ["engine-only"], rel: it.name, word, dir: dir0,
        text: `둘째 핵심 〔${it.name} = ${word}(${image})〕 — 이름과 함께 이 ${unit}의 말로 한 마디(이름만 부르고 끝내지 않는다 · 배지 줄을 옮기지 않는다)` });
      return;
    }
    const seats = seatsOfWith(it.badge.with).filter(s => s !== "hour" || c.brief.person.facts.birthTimeKnown);
    for (const seat of SEAT_ORDER.filter(s => seats.includes(s))) {
      // AM2-7 3부 4: 자리 뜻은 한 권 안에서 자리마다 하나 — 입력으로 정한다(연애 상태를 적었으면 가까운 사람 쪽, 아니면 내 생활 쪽). 달마다 영역 신호로 바꾸지 않는다.
      const side = seat === "day" ? daySide(c.brief) : "close"; void gender;
      const fc0 = facetOf(seat, c.brief, c.wishTopics, side); if (!fc0) continue;
      const facet = seat === "month" ? monthFacet(fc0, e) : fc0.facet;
      const base = seatText(c.k, seat, side === "life" ? "life:base" : "base"), mine = seatText(c.k, seat, facet) || seatText(c.k, seat, fc0.facet);
      if (!base || !mine) continue;
      // 그 자리 뜻의 영역(가까운 사람 → 연애 · 내 생활 → 마음 · 일터 → 일 · 일로 버는 돈 → 돈 · 일터 사람들 → 사람)만 칩과 맞댄다(다른 영역 칩은 이 고리와 관계없다).
      const area = facetArea(seat, side, facet);
      const sig = e.signals ? area.filter(d => e.signals![d] === "↑") : [], down = e.signals ? area.filter(d => e.signals![d] === "↓") : [];
      // 방향: 배지가 살필 쪽이거나 그 자리 영역 칩이 ↓면 살필 쪽, 합(plus)이고 ↓가 없으면 좋은 쪽.
      // 결이 섞인 합(병신합 「겉이 빛나고 속은 눌리는」 · 오미합 …)은 칩이 올라도 섞임 그대로 — 좋은 쪽은 배지 결이 plus인 합만.
      const dir: Dir = dir0 === "minus" || down.length ? "minus" : dir0 === "plus" ? "plus" : "none";
      const engine = [`${e.key}:${it.badge.kind}:${it.name}@${SEAT_KO[seat]}`, ...sig.map(d => `${e.key}:signal:${d}↑`), ...down.map(d => `${e.key}:signal:${d}↓`)];
      // 같은 자리는 바로 앞 key(가장 최근에 그 자리를 쓴 key)와 견준다.
      const usedKey = seat, prev = c.seatUsed?.get(usedKey), nth = (prev?.n ?? 0) + 1;
      const shortNow = seatText(c.k, seat, seat === "day" ? (side === "life" ? "short:life" : "short:close") : seat === "hour" && fc0.facet === "children" ? "short:children" : "short") || "자리";
      c.seatUsed?.set(usedKey, { label, word, n: nth, short: shortNow, key: e.key, rel: it.name });
      const sigText = [sig.length ? `이 ${unit} 오름: ${sig.map(d => SIGNAL_KO[d]).join("·")}` : "", down.length ? `이 ${unit} 살핌: ${down.map(d => SIGNAL_KO[d]).join("·")}` : ""].filter(Boolean).join(" · ");
      // AM2-7 2부 4: 지금 상태 말은 이 책을 쓴 날 + 2년 안의 해 · 달에만 사실 꼴로 — 그 뒤 해는 조건 꼴로.
      const far = e.kind === "year" && Number(e.key) > Number(c.brief.baseDate.slice(0, 4)) + 2;
      const who = far ? `${fc0.who}(그때도 그렇다면 — 조건 꼴로)` : fc0.who;
      // AM2-7 3부 5 · 4부 1: 같은 자리 둘째부터는 「앞 key(간지 달 · 해) + 그때 같은 자리 관계 전부 + 이번 관계 뜻 + 입력 한 마디」만. 뜻이 같으면 「이번에도」. 글자째 옮길 틀은 주지 않는다.
      const prevE = prev?.key ? others.find(o => o.e.key === prev.key)?.e : undefined;
      const prevRels = prevE ? [...new Set(prevE.badges.filter(b2 => seatsOfWith(b2.with).includes(seat)).map(b2 => relName(b2.label)))] : prev?.rel ? [prev.rel] : [];
      const text = !prev
        ? `〔${SEAT_KO[seat]} 자리 = ${base}(${who}: ${mine})〕 × 〔${it.name} = ${word}(${image})〕 · ${DIR_KO[dir]}${sigText ? ` · ${sigText}` : ""}`
        : `〔${SEAT_KO[seat]} 자리 · ${shortNow}〕 앞: ${prev.label}(그때 같은 자리: ${prevRels.join(" · ") || prev.rel} — ${prev.word}) · 이번: 〔${it.name} = ${word}(${image})〕${prev.word === word ? " · 앞과 같음" : " · 앞과 다름"} · 입력 한 마디: ${who} · ${DIR_KO[dir]}${sigText ? ` · ${sigText}` : ""}`;
      out.push({ kind: "seat", seat, engine, input: [fc0.input], text, rel: it.name, word, dir, seatMeaning: mine, nth, topics: SEAT_TOPICS[seat], areas: AREA_DOMAIN(area, c.brief.person.facts.relationship) });
      // 겹침: 같은 관계 이름이 같은 자리에 책 안 다른 곳(세운은 그 해, 그다음 다른 key)에도 걸리면 재료 한 줄. 같은 겹침은 책에서 한 번.
      const echoKey = `${it.name}|${seat}`;
      const same = (x: TimelineEntry) => x.badges.some(b2 => relName(b2.label) === it.name && seatsOfWith(b2.with).includes(seat));
      const yearE = e.kind === "month" ? others.find(o => o.e.kind === "year") : undefined;
      const echoAt = yearE && same(yearE.e) ? { where: `${yearE.e.ganji.hangul}년 한 해`, key: yearE.e.key, year: true } : (() => { const o = others.find(x => x.e.key !== e.key && x.e.kind === e.kind && same(x.e)); return o ? { where: o.label, key: o.e.key, year: false } : null; })();
      if (echoAt && !c.echoed.has(echoKey)) {
        c.echoed.add(echoKey);
        out.push({ kind: "echo", seat, engine: [`${echoAt.key}:${it.badge.kind}:${it.name}@${SEAT_KO[seat]}`], input: [fc0.input], rel: it.name, word,
          text: `겹침 〔${echoAt.where}에도 같은 ${SEAT_KO[seat]} 자리에 ${it.name}〕 — 한 마디로만` });
      }
      seatDone = true;
      return;
    }
  });
  return out;
}

/** 바람 고리 후보(책 전체): 바람 영역과 같은 자리의 고리 재료가 있는 key. 강도: 같은 자리가 그 해와 바람 달에 함께 걸림(1) > 바람 달(2) > 그 밖(3). */
export function rankWishLinks(keys: readonly { readonly key: string; readonly label: string; readonly links?: readonly Link[] }[], c: Pick<LinkCtx, "wishTopics" | "wishMonths">, yearEntry: TimelineEntry | undefined, max = 3): { key: string; label: string; tier: 1 | 2 | 3; topics: string[]; seat: Seat; rel: string }[] {
  if (!c.wishTopics.length) return [];
  const cands = keys.flatMap((k, idx) => {
    const l = (k.links ?? []).find(x => x.kind === "seat" && x.seat); if (!l?.seat) return [];
    const topics = c.wishTopics.filter(t => SEAT_TOPICS[l.seat!].includes(t)); if (!topics.length) return [];
    const inYear = Boolean(yearEntry?.badges.some(b => relName(b.label) === l.rel && seatsOfWith(b.with).includes(l.seat!)));
    const wm = c.wishMonths.has(k.label);
    const tier: 1 | 2 | 3 = inYear && wm ? 1 : wm ? 2 : 3;
    return [{ key: k.key, label: k.label, tier, topics, seat: l.seat, rel: l.rel ?? "", idx }];
  });
  return cands.sort((a, b) => a.tier - b.tier || a.idx - b.idx).slice(0, max).map(({ idx: _i, ...rest }) => (void _i, rest));
}

/** 2,010명 검사(8부): 고리 재료마다 엔진 값과 입력 출처를 대조하고 입력 조건을 본다. 위반 글 목록(없으면 []). */
export function verifyLinks(b: Brief, keys: readonly { readonly key: string; readonly links?: readonly Link[] }[]): string[] {
  const out: string[] = [], f = b.person.facts, entries = new Map((b.timeline?.entries ?? []).map(e => [e.key, e] as const));
  for (const k of keys) for (const l of k.links ?? []) {
    const at = `${k.key} ${l.kind}`;
    if (!l.engine.length || !l.input.length) out.push(`${at}: 근거 하나뿐(엔진 ${l.engine.length} · 입력 ${l.input.length})`);
    for (const src of l.engine) {
      const m = /^([^:]+):([A-Z_]+):(.+)@(태어난 (?:해|달|날|시각))$/.exec(src);
      if (m) { const e = entries.get(m[1]); const ok = e?.badges.some(b2 => b2.kind === m[2] && relName(b2.label) === m[3] && seatsOfWith(b2.with).includes(SEAT_OF[m[4]])); if (!ok) out.push(`${at}: 엔진 값 없음 ${src}`); continue; }
      const m2 = /^([^:@]+):([A-Z_]+):([^@]+)$/.exec(src);
      if (m2) { const e = entries.get(m2[1]); if (!e?.badges.some(b2 => b2.kind === m2[2] && relName(b2.label) === m2[3])) out.push(`${at}: 엔진 값 없음 ${src}`); continue; }
      const s = /^([^:]+):signal:(love|money|work|people|mind)([↑↓])$/.exec(src);
      if (s) { if (entries.get(s[1])?.signals?.[s[2] as "love"] !== s[3]) out.push(`${at}: 영역 신호 없음 ${src}`); continue; }
      if (/:wishMonth$/.test(src)) continue;
      out.push(`${at}: 모르는 엔진 출처 ${src}`);
    }
    for (const src of l.input) {
      const [kk, v] = src.split(/[=:]/);
      if (kk === "relationship" && f.relationship !== v) out.push(`${at}: 입력 ${src} ≠ ${f.relationship}`);
      else if (kk === "job" && f.job.status !== v) out.push(`${at}: 입력 ${src} ≠ ${f.job.status}`);
      else if (kk === "children" && f.children !== "has") out.push(`${at}: 자녀 입력 없음`);
      else if (kk === "wish" && b.product !== "annual_fortune") out.push(`${at}: 세운 밖 바람`);
      else if (kk === "engine-only" && l.kind !== "second") out.push(`${at}: 입력 없는 자리 재료`);
    }
    if (l.seat === "hour" && !f.birthTimeKnown) out.push(`${at}: 시간 미상인데 시 자리`);
    if (/자녀|아이/.test(l.text) && f.children !== "has") out.push(`${at}: 자녀 입력 없이 자녀`);
    if (/배우자|부부/.test(l.text) && f.relationship !== "married") out.push(`${at}: 기혼 아님인데 배우자`);
    if (/연인과/.test(l.text) && f.relationship !== "dating") out.push(`${at}: 연애 중 아님인데 연인`);
    if (f.relationship === "unknown" && l.kind === "seat" && l.seat === "day" && /연애|연인|배우자/.test(l.text) && !l.input.some(x => x.startsWith("wish:"))) out.push(`${at}: 연애 미입력인데 일 자리를 연애로`);
    if (/후배|아랫사람|부하|팀원|사수|선배/.test(l.text)) out.push(`${at}: 연차·직급 말`);
    if (/바람/.test(l.text) && l.kind !== "wish" && !(k.links ?? []).some(x => x.kind === "wish")) out.push(`${at}: 바람 고리 밖 key에 바람`);
  }
  return out;
}

// ---------- key 짝(명리 × MBTI) ----------
const TG_HANJA: Readonly<Record<string, string>> = { 비견: "比肩", 겁재: "劫財", 식신: "食神", 상관: "傷官", 편재: "偏財", 정재: "正財", 편관: "偏官", 정관: "正官", 편인: "偏印", 정인: "正印" };
const OTHER_TG = /비견|겁재|식신|상관|편재|정재|편관|정관|편인|정인/g;
/** Fusion DB 규칙의 「잇는 이유」 종류: resonance = 공통(같은 쪽으로 겹침) · tension = 긴장(부딪침) · conditional = 보완(조건이 맞으면 서로 메움). */
export type PairReason = "공통" | "보완" | "긴장";
export const REASON_OF: Readonly<Record<string, PairReason>> = { resonance: "공통", tension: "긴장", conditional: "보완" };
/**
 * AM2-6 2부: key 짝은 Fusion DB 규칙에 「잇는 이유」(공통·보완·긴장)가 있을 때만. 그 유형이 주어인 한 문장(다른 십성·숫자·직장 전제가 없는 것)을 이유 줄로.
 * 짝 카드 머리(「…이 하늘에 든 때 ·」)는 붙이지 않는다(작가가 「…가 하늘에 든 달이라, 유형은」 인과 꼴로 옮겼다 — P5 R-G11).
 */
export function keyPairWhy(k: Pick<Knowledge, "fusionByFeature">, tg: string, mbti: string, fits: (t: string) => boolean): { id: string; why: string; reason: PairReason } | null {
  const h = TG_HANJA[tg]; if (!h) return null;
  const rule = (k.fusionByFeature.get(`tenGod:${h}`) ?? []).find(r => r.mbtiTarget === mbti);
  const reason = rule ? REASON_OF[(rule as { kind?: string }).kind ?? ""] : undefined;
  if (!rule || !reason) return null;
  // 기능 기호(Ne·Fe …)가 든 문장은 뗀 자리가 비문이 된다(「ENFP는 로 사람을 끌어모으고」) — 기호 없는 문장만.
  const sents = rule.why.split(/(?<=[.!?])\s+/).map(s => stripFnCodes(s.trim(), mbti)).filter(s => s && !/(^|\s)(로|으로|는|은|가|이|를|을|와|과|의)(\s|$)/.test(s));
  const pick = sents.find(s => s.includes(mbti) && ![...s.matchAll(OTHER_TG)].some(m => m[0] !== tg) && !/\d/.test(s) && fits(s));
  return pick ? { id: rule.id, why: pick.replace(/[.!]$/, ""), reason } : null;
}
/** 짝 이유 줄 머리(작가에게 보이는 꼴): 「공통 — …」. 문장 꼴 안내는 작가 규칙이 맡는다. */
export const pairReasonText = (reason: PairReason, tg: string, why: string) => `${reason}(하늘 ${josa(tg, "과와")} 이 유형) — ${why}`;
