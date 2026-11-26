/**
 * ZW-2 2부 — 자미 브리프(결정론, 호출 0): 명반 + DB 조회 → 작가에게 갈 사실 조각(Z 줄) · MBTI 짝 · 반대 쌍 정리 · 장면 후보 · 칸 렌즈.
 * - Z 줄은 「칸 쉬운 이름 · 별(밝기 말은 근거 「통용」인 칸만) · 사화 · 빌려 읽기 여부 | 뜻 한 마디」 사실 조각이다. 지시어 대신 이름, 등급 낱말 · 「살성」 갈래 이름 0
 *   (보좌 · 살성 · 연애 별은 쉬운 이름 먼저 「곧은 뿔(경양)」).
 * - DB 글은 text.ts cleanZiwei로 다듬는다(조언 꼬리 · 규칙 · 면책 · 판정 안 된 조건 · 내부 말 · 건강 · 극단 운명 말 · 등급 낱말 문장 뺌) → 입력 거름(premise fitSegments).
 * - 근거마다 집 장 하나(home). 다른 장은 설계도(design.ts)의 「새 각도」 칸이 있을 때만 그 줄을 쓴다.
 * - MBTI: 명궁 주성(공궁이면 빌린 주성) × 유형 짝 파일에서만, 책당 최대 3(ZIWEI_PAIR_MAX). MBTI가 없으면 짝 0.
 * - 반대 쌍: 같은 집 장 안 두 줄이 같은 차원 반대 끝(둘 다 |값| ≥ 0.4)이면 — 같은 칸이면 긴장 짝, 다른 칸이면 덧줄(칸 줄이 아닌 쪽)을 뺀다(책당 16까지, 넘으면 기록), 칸 줄끼리면 「다른 무대」 짝.
 */
import type { MbtiType } from "@/data/knowledge-v5/schema";
import type { Knowledge } from "@/lib/brief/knowledge";
import { fitSegments, type Inputs } from "@/lib/brief/premise";
import { ziweiCards, type ZiweiCard } from "@/lib/brief/cards/ziwei";
import { BODY_PALACE_NAME, BRANCH_KO, FIVE_CLASS_INFO, MUTAGEN_NAMES, PALACE_NAMES, STAR_NAMES, type MajorStarId, type MutagenId, type PalaceId, type StarId } from "./ids";
import type { ZiweiKnowledge } from "./knowledge";
import { lookupZiwei, type ZiweiLookup, type ZiweiPalaceRead } from "./lookup";
import { cleanZiwei, maskPalaceNames, newCleanLog, splitSents, untimeZw, type CleanCtx, type CleanLog } from "./text";
import { josa } from "@/lib/brief/labels";
import type { ZiweiChart, ZiweiDecadal } from "./types";

export const ZIWEI_BRIEF_VERSION = "ziwei-brief-zw2" as const;
export const ZIWEI_PAIR_MAX = 3;
export const ZIWEI_TIDY_MAX = 16;
export const ZIWEI_CLASH_MIN = 0.4;
/** 사람 전체를 말하는 장(2 나의 칸 · 3 속마음과 나중의 나 · 7 몸과 마음의 리듬): 칸이 달라도 반대 끝이면 긴장 짝. 그 밖의 장은 칸이 곧 무대라 같은 칸 안에서만 본다. */
export const ZIWEI_SELF_HOMES: ReadonlySet<number> = new Set([2, 3, 7]);
/** 반대 쌍으로 볼 두 줄인가(같은 집 장 · 다른 별 · 같은 칸 또는 사람 전체 장). */
export const clashScope = (a: Pick<ZLine, "home" | "palace" | "cards">, b: Pick<ZLine, "home" | "palace" | "cards">) =>
  a.home === b.home && a.cards.length > 0 && b.cards.length > 0 && !a.cards.some(c => b.cards.includes(c)) && ((Boolean(a.palace) && a.palace === b.palace) || ZIWEI_SELF_HOMES.has(a.home));
/** 칸 → 집 장(9장 설계, 덕짱님 2026-11-26). */
export const PALACE_HOME: Readonly<Record<PalaceId, number>> = { myeong: 2, bokdeok: 3, jaebaek: 4, gwanrok: 4, cheoni: 4, bucheo: 5, janyeo: 5, jeontaek: 5, hyeongje: 6, nobok: 6, bumo: 6, jilaek: 7 };

export type ZLineKind = "chart" | "class" | "empty" | "palace" | "essence" | "strength" | "overuse" | "minor" | "deep" | "deepWatch" | "body" | "mutagen" | "mutagenWatch" | "love" | "decade";
/** 사실 조각 하나. facts = 불변식 대조용 엔진 값(작가에게 보이지 않는다). */
export type ZLine = {
  readonly id: string; readonly kind: ZLineKind; readonly value: string; readonly meaning: string; readonly home: number;
  readonly palace?: PalaceId; readonly cards: readonly string[]; readonly dims: Readonly<Record<string, number>>;
  readonly facts: { readonly stars?: readonly StarId[]; readonly mutagens?: readonly { readonly mutagen: MutagenId; readonly star: StarId }[]; readonly borrowedFrom?: PalaceId; readonly brightStars?: readonly StarId[]; readonly years?: readonly [number, number]; readonly decade?: "current" | "next" };
};
export type ZPair = { readonly id: string; readonly z: string; readonly b: string; readonly reason: "공통" | "보완" | "긴장"; readonly why: string; readonly use: readonly number[]; readonly ruleId: string; readonly star: MajorStarId };
export type ZBLine = { readonly id: string; readonly value: string; readonly meaning: string };
export type ZTension = { readonly a: string; readonly b: string; readonly dim: string; readonly dimName: string; readonly kind: "긴장" | "다른 무대" };
export type ZiweiPerson = {
  readonly name: string; readonly gender: "MALE" | "FEMALE"; readonly mbti: MbtiType | null;
  readonly relationshipStatus: string; readonly jobStatus: string; readonly detailJob: string; readonly children?: "has" | "none";
  readonly precision: "exact" | "approximate"; readonly slotLabel?: string;
};
export type ZiweiBrief = {
  readonly version: typeof ZIWEI_BRIEF_VERSION; readonly asOf: string; readonly person: ZiweiPerson; readonly inputs: Inputs;
  readonly chart: ZiweiChart; readonly lookup: ZiweiLookup; readonly cards: readonly ZiweiCard[];
  readonly lines: readonly ZLine[]; readonly mbtiLines: readonly ZBLine[]; readonly pairs: readonly ZPair[]; readonly tensions: readonly ZTension[];
  /** 칸마다 읽는 각도(입력 렌즈 — 「~를 읽는 자리」 꼴을 각도 말로) · 무대 한 줄 · 장면 후보(broad, 입력에 맞는 것만). */
  readonly palaces: Readonly<Record<PalaceId, { readonly angle: string; readonly lensKey: string; readonly stage: string; readonly scenes: readonly string[] }>>;
  readonly body: { readonly palace: PalaceId; readonly angle: string; readonly scenes: readonly string[] };
  readonly log: { readonly clean: CleanLog; readonly tidy: readonly { readonly line: string; readonly why: string }[]; readonly tidyOver: readonly { readonly line: string; readonly why: string }[]; readonly missing: readonly string[] };
};

const PE = (p: PalaceId) => PALACE_NAMES[p].easy;
export const majorLabel = (s: StarId) => `${STAR_NAMES[s].ko}(${STAR_NAMES[s].easy})`;
/** 보좌 · 살성 · 연애 별: 쉬운 이름 먼저(0부 덕짱님 수정 3 — 「곧은 뿔(경양)」). */
export const minorLabel = (s: StarId) => `${STAR_NAMES[s].easy}(${STAR_NAMES[s].ko})`;
export const starLabel = (s: StarId) => (STAR_NAMES[s].kind === "major" ? majorLabel(s) : minorLabel(s));
export const mutLabel = (m: MutagenId) => `${MUTAGEN_NAMES[m].ko}(${MUTAGEN_NAMES[m].easy})`;
const first = (t: string, n = 1) => splitSents(t).slice(0, n).join(" ");
/** 「이 칸은 「…」를 읽는 자리로, …」 · 「…를 읽는 자리입니다」 → 각도 말(「…」). */
export function lensAngle(line: string): string {
  const q = /「([^」]+)」/.exec(line)?.[1];
  const m = /^(.*?)(?:을|를) 읽는 자리(?:입니다|예요|로)/.exec(line.replace(/^이 칸은\s*/, ""));
  return (m?.[1] ?? q ?? line).replace(/[.。]$/, "").trim();
}
const relKo: Readonly<Record<string, string>> = { single: "솔로", some: "썸", dating: "연애 중", marriage_preparing: "결혼 준비 중", married: "기혼" };
const jobKo: Readonly<Record<string, string>> = { student: "학생", job_seeker: "구직 중", employee: "직장인", freelancer: "프리랜서", self_employed: "자영업", business_owner: "사업", homemaker: "살림 · 육아", unemployed: "쉬는 중", other: "기타" };
/** 인물 카드 줄(작가에게 보이는 입력 — 상태만, 이유로 쓰지 않는다). */
export function personLines(p: ZiweiPerson): string[] {
  return [`이름: ${p.name}`, `연애: ${relKo[p.relationshipStatus] ?? "미입력"}`, `일: ${jobKo[p.jobStatus] ?? "미입력"}${p.detailJob ? ` · ${p.detailJob}` : " · 하는 일 적지 않음"}`,
    `자녀: ${p.children === "has" ? "있음" : p.children === "none" ? "없음" : "미입력"}`, `MBTI: ${p.mbti ?? "미입력"}`, `태어난 시각: ${p.precision === "exact" ? "정확히 앎" : `시간대만 앎${p.slotLabel ? `(${p.slotLabel})` : ""}`}`];
}
export function ziweiInputs(p: Pick<ZiweiPerson, "relationshipStatus" | "jobStatus" | "detailJob" | "children">): Inputs {
  const s = p.jobStatus;
  const job: Inputs["job"] = s === "employee" ? "employee" : /^(self_employed|business_owner)$/.test(s) ? "business" : s === "freelancer" ? "freelancer" : s === "student" ? "student" : s === "job_seeker" ? "seeker" : /^(unemployed|homemaker)$/.test(s) ? "resting" : "none";
  const r = p.relationshipStatus;
  const rel: Inputs["rel"] = r === "single" ? "single" : r === "some" ? "some" : r === "dating" || r === "marriage_preparing" ? "dating" : r === "married" ? "married" : "none";
  return { job, rel, children: p.children === "has" ? "has" : "none", residence: "none", shop: job === "business" && /가게|매장|카페|식당|숍|샵|점포|장사|요식|판매|쇼핑몰/.test(p.detailJob) };
}
const sumTags = (cards: readonly ZiweiCard[]) => { const o: Record<string, number> = {}; for (const c of cards) for (const [d, v] of Object.entries(c.tags)) o[d] = Math.round(((o[d] ?? 0) + v) * 100) / 100; return o; };

export function buildZiweiBrief(a: { readonly chart: ZiweiChart; readonly kb: ZiweiKnowledge; readonly k: Pick<Knowledge, "ontology" | "mbti">; readonly person: ZiweiPerson; readonly asOf: string }): ZiweiBrief {
  const { chart, kb, k, person } = a;
  const inputs = ziweiInputs(person);
  const look = lookupZiwei(chart, kb, { relationshipStatus: person.relationshipStatus as never, jobStatus: person.jobStatus as never, ...(person.children ? { children: person.children } : {}), mbti: person.mbti });
  const cards = ziweiCards(chart, look);
  const clog = newCleanLog();
  /** DB 글 → 작가 글: 다듬기 + 입력 거름. */
  const clean = (t: string | null | undefined, c: CleanCtx, max = 2) => { if (!t) return ""; const m = maskPalaceNames(cleanZiwei(t, c, clog, max)); return m.unmask(fitSegments(m.text, inputs, /(?<=[.!?])\s+/)); };
  const lines: ZLine[] = [];
  let n = 0;
  const add = (l: Omit<ZLine, "id">) => { if (!l.value) return null; const id = `Z${++n}`; lines.push({ ...l, id }); return id; };
  const cardsOf = (p: PalaceId, pred: (c: ZiweiCard) => boolean = () => true) => cards.filter(c => c.palace === p && pred(c));
  const mutOf = new Map(chart.mutagens.map(m => [m.star, m.mutagen] as const));
  const placed = new Map(chart.stars.map(s => [s.id, s] as const));
  const brightOk = (s: StarId) => placed.get(s)?.brightnessBasis === "통용" && Boolean(placed.get(s)?.brightness);
  const readOf = new Map(look.palaces.map(r => [r.palace, r] as const));
  const palaceInfo = {} as Record<PalaceId, { angle: string; lensKey: string; stage: string; scenes: string[] }>;

  // ---- 1장: 명반 머리 · 오행국 · 빈 칸 ----
  const empties = chart.palaces.filter(p => p.empty).map(p => p.id);
  const body = chart.bodyPalace.palace;
  add({ kind: "chart", home: 1, cards: [], dims: {}, facts: {},
    value: `명궁 ${BRANCH_KO[chart.lifePalace.branch]}(${chart.lifePalace.branch}) 칸 · 신궁(${BODY_PALACE_NAME.easy})은 ${PE(body)} 칸에 겹침 · 큰 별이 없는 빈 칸 ${empties.length}개${empties.length ? `(${empties.map(PE).join(" · ")})` : ""}`,
    meaning: "명반은 열두 칸이고, 칸마다 삶의 무대 하나가 있다. 칸에 앉은 별이 그 무대에서의 나를 말한다" });
  const fc = look.fiveClass;
  add({ kind: "class", home: 1, cards: [], dims: {}, facts: {}, value: `오행국 ${FIVE_CLASS_INFO[fc.id].ko}(국수 ${fc.number})`, meaning: clean(fc.entry ? `${fc.entry.oneLiner}. ${fc.entry.forYou.base}` : "", {}, 2) });
  if (empties.length) add({ kind: "empty", home: 1, cards: [], dims: {}, facts: {},
    value: `빈 칸 ${empties.length}개 · ${empties.map(p => `${PE(p)} 칸은 맞은편 ${PE(chart.palaces.find(x => x.id === p)!.borrowFrom!)} 칸의 별을 빌려 읽음`).join(" · ")}`,
    meaning: clean(look.palaces.find(r => r.borrow)?.borrow?.rule?.entry.oneLiner, {}, 1) });

  // ---- 칸 줄 12 ----
  for (const p of chart.palaces) {
    const r = readOf.get(p.id)!;
    const lens = r.lens;
    palaceInfo[p.id] = { angle: lens ? clean(lensAngle(lens.line), { palace: p.id }, 1) || lensAngle(lens.line) : "", lensKey: lens?.key ?? "default", stage: clean(r.entry?.entry.stage, { palace: p.id }, 1), scenes: scenesOf(r, clean) };
    const minors = [...p.helpers, ...p.malefics, ...p.loves];
    const majorText = (s: MajorStarId) => { const m = mutOf.get(s); const br = brightOk(s) ? kb.stars.get(s)?.brightness?.[placed.get(s)!.brightness!.level] : undefined;
      const look0 = br ? first(clean(br, { palace: p.id, star: s }, 1)).replace(/ 모습으로 나옵니다\.?$/, " 모습").replace(/모습(?:입니다|이에요|예요)\.?$/, "모습").replace(/\.$/, "") : "";
      return `${majorLabel(s)}${m ? ` · ${mutLabel(m)}` : ""}${look0 ? ` · 별 모습: ${look0}` : ""}`; };
    let value: string, meaning: string;
    const borrowedFrom = p.empty ? p.borrowFrom : undefined;
    if (p.empty && borrowedFrom) {
      const from = chart.palaces.find(x => x.id === borrowedFrom)!;
      value = `${PE(p.id)} 칸(${PALACE_NAMES[p.id].ko}) · 큰 별이 없는 빈 칸 · 맞은편 ${PE(borrowedFrom)} 칸의 ${from.majors.map(majorLabel).join(" · ")}을 빌려 읽음`;
      meaning = r.borrow?.majors.map(m => first(clean(m.nuance, { palace: p.id, star: m.star }, 1))).filter(Boolean).join(" ") ?? "";
    } else {
      value = `${PE(p.id)} 칸(${PALACE_NAMES[p.id].ko}) · 앉은 별: ${p.majors.map(majorText).join(" · ")}${p.majors.length === 2 ? " — 두 별이 함께" : ""}`;
      meaning = r.majors.map(m => first(clean(m.nuance, { palace: p.id, star: m.star }, 2), p.majors.length === 2 ? 1 : 2)).filter(Boolean).join(" ");
    }
    if (minors.length) value += ` · 곁의 별: ${minors.map(s => `${minorLabel(s)}${mutOf.get(s) ? ` ${mutLabel(mutOf.get(s)!)}` : ""}`).join(" · ")}`;
    if (p.id === body) value += ` · 신궁이 겹친 칸`;
    add({ kind: "palace", home: PALACE_HOME[p.id], palace: p.id, cards: cardsOf(p.id, c => c.kind === "major").map(c => c.id), dims: sumTags(cardsOf(p.id, c => c.kind === "major")), value, meaning,
      facts: { stars: [...p.majors, ...minors], mutagens: [...p.majors, ...minors].filter(s => mutOf.has(s)).map(s => ({ mutagen: mutOf.get(s)!, star: s })), ...(borrowedFrom ? { borrowedFrom } : {}), brightStars: p.majors.filter(brightOk) } });
  }

  // ---- 2장: 명궁 덧줄(타고난 결 · 잘 쓰는 힘 · 지나치면 · 곁의 별) ----
  const life = chart.palaces.find(p => p.id === "myeong")!;
  const lifeStars: MajorStarId[] = life.empty ? (readOf.get("myeong")!.borrow?.majors.map(m => m.star) ?? []) : [...life.majors];
  for (const s of lifeStars) {
    const e = kb.stars.get(s); if (!e) continue;
    const c = cardsOf("myeong", x => x.star === s && x.kind === "major");
    const lvl = !life.empty && brightOk(s) ? placed.get(s)!.brightness!.level : "normal";
    const base = lvl !== "normal" && e.forYou[lvl] ? e.forYou[lvl]! : e.forYou.base;
    add({ kind: "essence", home: 2, palace: "myeong", cards: c.map(x => x.id), dims: sumTags(c), facts: { stars: [s] }, value: `${majorLabel(s)} · 나 칸의 타고난 결${life.empty ? "(빌려 읽기)" : ""}`, meaning: clean(base, { palace: "myeong", star: s }, 2) });
    add({ kind: "strength", home: 2, palace: "myeong", cards: c.map(x => x.id), dims: sumTags(c), facts: { stars: [s] }, value: `${majorLabel(s)} · 잘 쓰는 힘`, meaning: clean(e.strengths.slice(0, 2).join(" "), { palace: "myeong", star: s }, 2) });
    add({ kind: "overuse", home: 2, palace: "myeong", cards: c.map(x => x.id), dims: sumTags(c), facts: { stars: [s] }, value: `${majorLabel(s)} · 지나치면`, meaning: clean(e.overuse[0], { palace: "myeong", star: s }, 2) });
  }
  for (const s of [...life.helpers, ...life.malefics, ...life.loves]) {
    const e = kb.stars.get(s); if (!e) continue;
    const c = cardsOf("myeong", x => x.star === s);
    add({ kind: "minor", home: 2, palace: "myeong", cards: c.map(x => x.id), dims: sumTags(c), facts: { stars: [s] }, value: `${minorLabel(s)} · 나 칸 곁의 별`, meaning: clean(`${e.oneLiner}. ${e.forYou.base}`, { palace: "myeong", star: s }, 2) });
  }
  // ---- 심화 4궁(명궁 2장 · 재백 · 관록 4장 · 부처 5장) ----
  for (const d of look.deep) {
    if (!d.entry) continue;
    const e = d.entry.entry, home = PALACE_HOME[d.palace], c = cardsOf(d.palace, x => x.kind === "major");
    const what = d.kind === "empty" ? `빈 칸(맞은편 별을 빌려 읽음)` : d.kind === "pair" ? `${chart.palaces.find(p => p.id === d.palace)!.majors.map(majorLabel).join(" · ")} 두 별` : majorLabel(d.bundle as StarId);
    add({ kind: "deep", home, palace: d.palace, cards: c.map(x => x.id), dims: sumTags(c), facts: {}, value: `${PE(d.palace)} 칸 깊이 읽기 · ${what}`, meaning: clean(`${e.headline}. ${e.reading[0]}`, { palace: d.palace }, 2) });
    const w = clean(e.watch[0], { palace: d.palace }, 2);
    if (w) add({ kind: "deepWatch", home, palace: d.palace, cards: c.map(x => x.id), dims: sumTags(c), facts: {}, value: `${PE(d.palace)} 칸 깊이 읽기 · 살필 점`, meaning: w });
  }
  // ---- 3장: 신궁 ----
  const sin = look.body;
  const bodyRead = readOf.get(body)!;
  add({ kind: "body", home: 3, palace: body, cards: cardsOf(body, c => c.kind === "major").map(c => c.id), dims: sumTags(cardsOf(body, c => c.kind === "major")), facts: { stars: chart.palaces.find(p => p.id === body)!.majors },
    value: `신궁(${BODY_PALACE_NAME.easy}) · ${PE(body)} 칸에 겹침${bodyRead.majors.length ? ` · 그 칸의 별: ${bodyRead.majors.map(m => majorLabel(m.star)).join(" · ")}` : ""}`,
    meaning: clean(sin.entry?.entry.forYou.base, { palace: body }, 2) });
  // ---- 5장: 연애 별 ----
  const loves = chart.palaces.flatMap(p => p.loves.map(s => ({ s, p: p.id })));
  if (loves.length) add({ kind: "love", home: 5, cards: loves.flatMap(x => cardsOf(x.p, c => c.star === x.s).map(c => c.id)), dims: sumTags(loves.flatMap(x => cardsOf(x.p, c => c.star === x.s))), facts: { stars: loves.map(x => x.s) },
    value: `연애 별 · ${loves.map(x => `${josa(minorLabel(x.s), "은는")} ${PE(x.p)} 칸`).join(" · ")}`, meaning: loves.slice(0, 2).map(x => first(clean(`${kb.stars.get(x.s)?.oneLiner ?? ""}.`, { star: x.s }, 1))).filter(Boolean).join(" ") });
  // ---- 8장: 생년 사화 4 ----
  for (const m of look.mutagens) {
    const e = m.entry?.entry; if (!e) continue;
    const c = cards.filter(x => x.star === m.star && x.palace === m.palace);
    add({ kind: "mutagen", home: 8, palace: m.palace, cards: c.map(x => x.id), dims: sumTags(c), facts: { mutagens: [{ mutagen: m.mutagen, star: m.star }], stars: [m.star] },
      value: `${mutLabel(m.mutagen)} · ${starLabel(m.star)} · ${PE(m.palace)} 칸`, meaning: clean(`${e.oneLiner}. ${e.forYou.base}`, { palace: m.palace, star: m.star as StarId, mutagen: m.mutagen }, 2) });
    if (m.mutagen === "gi") { const w = clean(e.overuse[0], { mutagen: "gi" }, 2); if (w) add({ kind: "mutagenWatch", home: 8, palace: m.palace, cards: c.map(x => x.id), dims: sumTags(c), facts: {}, value: `${mutLabel("gi")} · 지나치면`, meaning: w }); }
  }
  // ---- 9장: 지금 · 다음 대한(연도 범위만 — 나이 말 없음) ----
  const dec = (d: ZiweiDecadal | undefined, which: "current" | "next") => d && add({ kind: "decade", home: 9, palace: d.palace, cards: [], dims: {}, facts: { years: [d.startYear, d.endYear], decade: which },
    value: `${which === "current" ? "지금 머무는 10년" : "다음 10년"} · ${PE(d.palace)} 칸 · ${d.startYear}~${d.endYear}년`, meaning: palaceInfo[d.palace].stage });
  dec(chart.now.current !== undefined ? chart.decadals[chart.now.current] : undefined, "current");
  dec(chart.now.next !== undefined ? chart.decadals[chart.now.next] : undefined, "next");

  // ---- MBTI 짝(명궁 주성 · 빌린 주성 × 유형, 책당 최대 3) ----
  const mbtiLines: ZBLine[] = [], pairs: ZPair[] = [];
  if (person.mbti && look.mbti) {
    const prof = k.mbti.get(person.mbti);
    for (const r of look.mbti.rules) {
      if (pairs.length >= ZIWEI_PAIR_MAX || !r.entry) continue;
      const rule = r.entry.entry, dim = k.ontology.dimensions.find(d => d.id === rule.dimension);
      const zLine = lines.find(l => l.kind === "essence" && l.facts.stars?.[0] === r.star) ?? lines.find(l => l.kind === "palace" && l.palace === "myeong");
      if (!zLine || !dim) continue;
      const sign = (prof?.dimensionTags[rule.dimension] ?? 1) >= 0 ? "plus" : "minus";
      const bid = `B${mbtiLines.length + 1}`;
      mbtiLines.push({ id: bid, value: `${person.mbti} · ${dim.name}: ${dim.poles[sign].label}`, meaning: untimeZw(fitSegments(dim.poles[sign].description, inputs)).replace(/\.$/, "") });
      const why = clean(rule.why, { palace: "myeong", star: r.star }, 2);
      if (!why) { mbtiLines.pop(); continue; }
      pairs.push({ id: `P${pairs.length + 1}`, z: zLine.id, b: bid, reason: rule.kind === "resonance" ? "공통" : rule.kind === "tension" ? "긴장" : "보완", why, use: [2], ruleId: rule.id, star: r.star });
    }
  }

  // ---- 반대 쌍 정리(같은 집 장 안) ----
  const { kept, tensions, tidy, tidyOver } = tidyLines(lines, k);
  return { version: ZIWEI_BRIEF_VERSION, asOf: a.asOf, person, inputs, chart, lookup: look, cards, lines: kept, mbtiLines, pairs: pairs.filter(p => kept.some(l => l.id === p.z)), tensions,
    palaces: palaceInfo, body: { palace: body, angle: sin.lens ? lensAngle(sin.lens.line) : "", scenes: scenesOf(bodyRead, clean) },
    log: { clean: clog, tidy, tidyOver, missing: look.missing } };
}

/** 칸의 장면 후보: 궁 항목 · 주성(빌린 별 포함) 장면 가운데 그 칸 영역에 맞는 broad(큰 틀) — 입력에 맞는 것만(조회가 requires로 이미 거름), 두 개까지. */
function scenesOf(r: ZiweiPalaceRead, clean: (t: string, c: CleanCtx, max?: number) => string): string[] {
  const domains = new Set(r.entry?.entry.domains ?? []);
  const pool = [...(r.entry?.scenes ?? []), ...r.majors.flatMap(m => m.entry?.scenes ?? []), ...(r.borrow?.majors.flatMap(m => m.entry?.scenes ?? []) ?? [])];
  const out: string[] = [];
  for (const s of [...pool.filter(x => x.domain && domains.has(x.domain)), ...pool.filter(x => !x.domain || !domains.has(x.domain))]) {
    const t = clean(s.broad, { palace: r.palace }, 1);
    if (t && !out.includes(t)) out.push(t);
    if (out.length >= 2) break;
  }
  return out;
}

/** 뺄 수 있는 덧줄(칸 · 사화 · 대한 · 심화 · 명반 머리 줄은 빼지 않는다 — 장마다 근거가 있어야 한다). */
const DROPPABLE: ReadonlySet<ZLineKind> = new Set(["essence", "strength", "overuse", "minor", "deepWatch", "mutagenWatch", "love"]);
/**
 * 같은 집 장 안 반대 끝 정리(결정론). 자미는 칸이 곧 무대라 — 같은 칸 두 별이 반대 끝이면 「긴장」 짝, 사람 전체 장(2 · 3 · 7)에서 칸이 다르면 「다른 무대」 짝으로 남겨
 * 작가가 둘을 함께 쓰게 한다(같은 별 쌍 · 같은 차원은 한 번, clashScope). 짝이 상한(책당 16)을 넘으면 덧줄(곁의 별 · 연애 별 → 뒤 줄)을 빼고, 뺄 덧줄이 없으면 기록만.
 */
export function tidyLines(lines: readonly ZLine[], k: Pick<Knowledge, "ontology">, cap = ZIWEI_TIDY_MAX) {
  const gone = new Set<string>(), tensions: ZTension[] = [], tidy: { line: string; why: string }[] = [], tidyOver: { line: string; why: string }[] = [];
  const nameOf = (d: string) => k.ontology.dimensions.find(x => x.id === d)?.name ?? d;
  const clash = (a: ZLine, b: ZLine) => Object.entries(a.dims).filter(([d, v]) => Math.abs(v) >= ZIWEI_CLASH_MIN && b.dims[d] !== undefined && Math.abs(b.dims[d]) >= ZIWEI_CLASH_MIN && Math.sign(v) !== Math.sign(b.dims[d]))
    .sort((x, y) => Math.abs(y[1] * b.dims[y[0]]) - Math.abs(x[1] * b.dims[x[0]]) || x[0].localeCompare(y[0]))[0]?.[0];
  const seen = new Set<string>();
  for (let j = 1; j < lines.length; j++) for (let i = 0; i < j; i++) {
    const a = lines[i], b = lines[j];
    if (gone.has(a.id) || gone.has(b.id) || !clashScope(a, b)) continue;
    const d = clash(a, b); if (!d) continue;
    const key = `${[[...a.cards].sort().join("+"), [...b.cards].sort().join("+")].sort().join("|")}|${d}`;
    if (seen.has(key)) continue; seen.add(key);
    if (tensions.length < cap) { tensions.push({ a: a.id, b: b.id, dim: d, dimName: nameOf(d), kind: a.palace && a.palace === b.palace ? "긴장" : "다른 무대" }); continue; }
    const extra = [a, b].filter(x => DROPPABLE.has(x.kind));
    const lose = extra.find(x => x.kind === "minor" || x.kind === "love") ?? extra.at(-1);
    const why = `${nameOf(d)} 반대 끝(${(lose === a ? b : a).id}) · 짝 상한 ${cap}`;
    // 뺄 덧줄이 없으면(칸 · 사화 · 심화 줄끼리) 빼지 않고 긴장 짝으로 남기고 상한 초과로 기록한다.
    if (lose) { gone.add(lose.id); tidy.push({ line: lose.id, why }); } else { tidyOver.push({ line: b.id, why }); tensions.push({ a: a.id, b: b.id, dim: d, dimName: nameOf(d), kind: a.palace && a.palace === b.palace ? "긴장" : "다른 무대" }); }
  }
  return { kept: lines.filter(l => !gone.has(l.id)), tensions: tensions.filter(t => !gone.has(t.a) && !gone.has(t.b)), tidy, tidyOver };
}
