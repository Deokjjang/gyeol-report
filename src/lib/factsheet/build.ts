/**
 * 정답지(최종판3 1): 엔진이 한 사람(궁합은 두 사람)에 대해 계산한, 확인 가능한 모든 사실. 엔진 출력으로만 만든다(손으로 쓰거나 줄이지 않는다).
 * 사실의 닻(누구에게·무엇이·어디에·얼마나)만 담는다. 해석·비유·장면은 담지 않는다.
 * 학파가 갈리는 항목은 엔진이 쓰는 기준을 standards에 적는다(docs/manseryeok-policy.md §5, docs/v5/shinsal-rules.md). 본문·부록·점수가 같은 기준을 쓴다.
 */
import { calculateSaju } from "@/lib/saju/calculateSaju";
import { calculateCustomerDayun } from "@/lib/saju/customerDayun";
import { currentDayunAt, personDaeunsu } from "@/lib/brief/labels";
import { BRANCH_MAIN_ELEMENT, HIDDEN_STEMS, STEM_ELEMENT } from "@/lib/saju/constants";
import { analyzeChartDetections, analyzeIncoming, detectStemClashes, getAnnualPillar, getMonthlyPillars, getTwelveStage } from "@/lib/saju/detections";
import type { ChartPosition, RelationHit, TemporalPosition } from "@/lib/saju/detections/types";
import { CHEONMUN_BRANCHES, HYEONCHIM_CHARS } from "@/lib/saju/detections/tables";
import { groupStrength, GROUP_NAME_KO, GROUP_STRONG, GROUP_WEAK, TEN_GOD_GROUP_KEYS, type TenGodGroupKey } from "@/lib/saju/groupStrength";
import { getTenGod } from "@/lib/saju/tenGods";
import type { EarthlyBranch, FiveElement, HeavenlyStem, Pillar, SajuCalcResult, TenGod } from "@/lib/saju/types";
import type { ShinsalDetection } from "@/lib/saju/shinsalTypes";
import type { Knowledge } from "@/lib/brief/knowledge";
import type { Brief } from "@/lib/brief/schema";
import type { BriefInput, BriefPersonInput } from "@/lib/brief/buildBrief";
import { TEN_GOD_KO } from "@/lib/brief/labels";
import { BASE_POINTS } from "@/lib/compat/display";
import { pairRelations as compatPairRelations, type PairRelation } from "@/lib/compat/relations";

export const FACTSHEET_VERSION = "factsheet-v1" as const;
export type Pos = ChartPosition;
export type Slot = "yearStem" | "yearBranch" | "monthStem" | "monthBranch" | "dayStem" | "dayBranch" | "hourStem" | "hourBranch";
export const POSITIONS: readonly Pos[] = ["year", "month", "day", "hour"];
const slotOf = (p: Pos, part: "Stem" | "Branch") => `${p}${part}` as Slot;

const HANGUL: Readonly<Record<string, string>> = { 甲: "갑", 乙: "을", 丙: "병", 丁: "정", 戊: "무", 己: "기", 庚: "경", 辛: "신", 壬: "임", 癸: "계", 子: "자", 丑: "축", 寅: "인", 卯: "묘", 辰: "진", 巳: "사", 午: "오", 未: "미", 申: "신", 酉: "유", 戌: "술", 亥: "해" };
export const hangulOf = (han: string) => [...han].map(c => HANGUL[c] ?? c).join("");
const STAGE_KO: Readonly<Record<string, string>> = { 長生: "장생", 沐浴: "목욕", 冠帶: "관대", 建祿: "건록", 帝旺: "제왕", 衰: "쇠", 病: "병", 死: "사", 墓: "묘", 絶: "절", 胎: "태", 養: "양" };

/** 학파 기준(엔진이 쓰는 값 그대로). 본문·부록·점수가 모두 이 기준을 쓴다. */
export const STANDARDS = {
  twelveShinsalBasis: "연지 삼합 기준 한 가지(겁·재·천·지·년·월·망신·장성·반안·역마·육해·화개). 일지 기준 미채택",
  cheonmun: CHEONMUN_BRANCHES.join("·") + "(寅·酉 추가설 미채택)",
  hyeonchim: HYEONCHIM_CHARS.join("·") + " 글자가 천간이든 지지든 있는 기둥",
  chukmiHyeong: "丑戌未 삼형은 세 글자 모두면 삼형, 두 글자(丑戌·戌未·丑未)면 partial 형. 丑未는 충이면서 partial 형",
  banhap: "삼합 세 글자 중 아무 두 글자 = 반합(두 글자만 모여 반쯤 묶임, 완성 아님). 세 글자 모두면 삼합(완성)",
  stemClash: "천간충 甲庚·乙辛·丙壬·丁癸 4쌍(戊甲·己乙 미채택). 원국 내부·원국×대운·세운·월운·궁합 두 사람 사이 모두 같은 표",
  peerGroup: "비겁 묶음 값 = 같은 오행 가중값 − 일간 자신(1). 일간은 비견·겁재가 아니다",
  groupLevel: `묶음 세기: 가중값 ${GROUP_STRONG} 이상 강, ${GROUP_WEAK} 미만 약, 그 밖 보통`,
  elementCount: "오행 개수 = 겉 글자(천간 + 지지 본기). 세기 = 월령 2배·지장간 포함 가중(judgeElementBalance). 개수와 세기는 다른 값",
  age: "나이는 만 나이(그해 생일 지난 뒤 기준). 대운수는 한 사람에 한 숫자 = 첫 대운이 시작되는 때의 만 나이",
} as const;

export type ShinsalFact = { readonly id: string; readonly code: string; readonly family: "shinsal" | "gwiin"; readonly name: string; readonly positions: readonly Pos[]; readonly slots: readonly Slot[]; readonly glyphs: readonly string[]; readonly count: number; readonly twelve: boolean };
export type RelationFact = { readonly kind: RelationHit["kind"]; readonly key: string; readonly keyKo: string; readonly members: readonly { readonly where: string; readonly char: string }[]; readonly completeness: RelationHit["completeness"]; readonly subtype?: string; readonly element?: FiveElement; readonly glyphCount: number };
export type IncomingFact = { readonly ganji: string; readonly ganjiKo: string; readonly stemTenGod: string; readonly branchTenGod: string; readonly twelveStage: string; readonly gongmang: boolean; readonly relations: readonly RelationFact[]; readonly stemClashes: readonly RelationFact[] };
/** manStartAge(운영 Q 8-1): 그 대운 줄 「만 X~Y세」의 X = 대운수 + 10 × (순서 − 1)(labels.dayunLabel과 같은 값). startAge는 엔진 값(세는 나이) 그대로. */
export type DayunFact = IncomingFact & { readonly index: number; readonly startYear: number; readonly endYear: number; readonly startAge: number; readonly startSolarKst: string | null; readonly manStartAge: number };
export type PersonFacts = {
  readonly name: string; readonly gender: "MALE" | "FEMALE" | null; readonly birthDate: string; readonly birthTime: string | null; readonly timeKnown: boolean;
  readonly pillars: Readonly<Record<Pos, { readonly stem: HeavenlyStem; readonly branch: EarthlyBranch; readonly ganjiKo: string; readonly hidden: readonly { readonly stem: HeavenlyStem; readonly weight: number; readonly tenGod: string }[] } | null>>;
  readonly dayMaster: { readonly stem: HeavenlyStem; readonly ko: string; readonly element: FiveElement };
  readonly tenGods: Readonly<Partial<Record<Slot, readonly string[]>>>;
  readonly elements: { readonly count: Readonly<Record<FiveElement, number>>; readonly weighted: Readonly<Record<FiveElement, number>>; readonly strength: Readonly<Record<FiveElement, number>>; readonly status: Readonly<Record<FiveElement, string>>; readonly hidden: Readonly<Record<FiveElement, boolean>>; readonly strongest: FiveElement; readonly weakest: FiveElement; readonly mostCounted: readonly FiveElement[] };
  readonly yinYang: { readonly yin: number; readonly yang: number; readonly label: string };
  readonly strength: { readonly level: string; readonly labelKo: string; readonly score: number };
  readonly groups: Readonly<Record<TenGodGroupKey, { readonly name: string; readonly element: FiveElement; readonly value: number; readonly level: "강" | "보통" | "약" }>>;
  readonly twelveStages: readonly { readonly position: Pos; readonly branch: EarthlyBranch; readonly stage: string; readonly ko: string }[];
  readonly twelveShinsalBasis: { readonly basis: "yearBranch"; readonly branch: EarthlyBranch };
  readonly shinsal: readonly ShinsalFact[];
  readonly relations: readonly RelationFact[];
  readonly stemClashes: readonly RelationFact[];
  readonly gongmang: readonly { readonly basis: string; readonly branches: readonly string[]; readonly positions: readonly Pos[] }[];
  readonly climate: { readonly season: string; readonly level: string; readonly lacking: readonly FiveElement[] };
  /** number: 이 사람의 대운수(한 사람에 한 숫자 = 첫 대운이 시작되는 때의 만 나이, 운영 Q 8-1). 대운마다의 시작 나이는 cycles[].manStartAge. current: 기준 시각(발행 시각)에 지나는 대운 index(최종 A-5, 교운 시각 비교). */
  readonly dayun: { readonly direction: string | null; readonly number: number | null; readonly current?: number | null; readonly cycles: readonly DayunFact[] };
  readonly annual: readonly (IncomingFact & { readonly year: number })[];
  readonly monthly: readonly (IncomingFact & { readonly year: number; readonly index: number; readonly startKst: string })[];
  readonly mbti: { readonly type: string; readonly stack: readonly string[] } | null;
  readonly input: { readonly relationship: string; readonly children: string; readonly job: { readonly class: string; readonly status: string; readonly detail: string } } | null;
};
export type PairFacts = {
  readonly relationshipType: string;
  /** 두 사람 기둥끼리(A 자리 × B 자리) 관계. 원국 감지와 같은 detectRelations·detectStemClashes. */
  readonly relations: readonly RelationFact[];
  readonly stemClashes: readonly RelationFact[];
  /** 두 사람이 모두 가진 것(차이의 근거나 한 사람만의 특징으로 쓰면 안 됨). */
  readonly common: { readonly shinsal: readonly string[]; readonly dayStage: string | null; readonly mbtiLetters: readonly string[]; readonly profile: readonly string[] };
  readonly score: { readonly value: number; readonly base: number; readonly components: readonly { readonly name: string; readonly points: number; readonly max: number }[]; readonly formula: string } | null;
};
export type FactSheet = { readonly version: typeof FACTSHEET_VERSION; readonly product: string; readonly baseDate: string; readonly standards: typeof STANDARDS; readonly people: readonly PersonFacts[]; readonly pair?: PairFacts; readonly mbtiIds: readonly string[] };

const sajuOf = (p: BriefPersonInput, gender: "MALE" | "FEMALE" | null): SajuCalcResult =>
  calculateSaju({ birthDate: p.birthDate, birthTime: p.birthTime, birthTimeUnknown: p.birthTimeUnknown, approximateBirthTimeSlot: (p.approximateBirthTimeSlot ?? "") as never, calendarType: "SOLAR", gender: gender ?? "OTHER_OR_UNSPECIFIED", timezone: "Asia/Seoul" } as never);

const whereKo = (pos: string, prefix = "") => `${prefix}${({ year: "연", month: "월", day: "일", hour: "시", dayun: "대운", annual: "세운", monthly: "월운" } as Record<string, string>)[pos] ?? pos}`;
function relFact(r: RelationHit, label: (pos: string) => string = p => whereKo(p)): RelationFact {
  const chars = r.members.map(m => m.char);
  return { kind: r.kind, key: r.key, keyKo: hangulOf(r.key), members: r.members.map(m => ({ where: label(m.position), char: m.char })), completeness: r.completeness, ...(r.subtype ? { subtype: r.subtype } : {}), ...(r.element ? { element: r.element } : {}), glyphCount: new Set(chars).size };
}

/** 원래 신살 감지(basis)로 천간/지지 칸을 복원한다. */
function slotsOf(code: string, positions: readonly Pos[], saju: SajuCalcResult, original?: ShinsalDetection, evidence: readonly string[] = []): Slot[] {
  const out = new Set<Slot>();
  const P = saju.pillars as Record<Pos, Pillar | undefined>;
  const charsEv = evidence.find(e => e.startsWith("chars:"))?.slice(6);
  for (const pos of positions) {
    const pl = P[pos]; if (!pl) continue;
    if (code === "HYEONCHIMSAL" && charsEv) { if (charsEv.includes(pl.stem)) out.add(slotOf(pos, "Stem")); if (charsEv.includes(pl.branch)) out.add(slotOf(pos, "Branch")); continue; }
    const b = original?.basis as Record<string, unknown> | undefined;
    const target = (b?.matchedStem ?? b?.matchedTarget ?? b?.matchedBranch ?? null) as string | null;
    if (b?.kind === "STEM_BRANCH_PAIR") { out.add(slotOf(pos, "Stem")); out.add(slotOf(pos, "Branch")); continue; }
    if (target) { if (pl.stem === target) out.add(slotOf(pos, "Stem")); if (pl.branch === target) out.add(slotOf(pos, "Branch")); continue; }
    out.add(slotOf(pos, "Branch"));
  }
  return [...out];
}

const PILLAR_BASED = new Set(["GOEGANG", "EUMCHAK_YANGCHA", "BAEKHODAESAL"]);
const genderOf = (input: BriefPersonInput) => (input.gender === "MALE" || input.gender === "FEMALE" ? input.gender : null);
function personFacts(input: BriefPersonInput, k: Knowledge, baseDate: string, brief: Brief | null, side: "person" | "partner", baseAt?: string, saju: SajuCalcResult = sajuOf(input, genderOf(input))): PersonFacts {
  const gender = genderOf(input);
  const det = analyzeChartDetections(saju);
  const dm = saju.dayMaster;
  const P = saju.pillars as Record<Pos, Pillar | undefined>;
  const included = (pos: Pos) => Boolean(P[pos]) && (pos !== "hour" || det.hourIncluded);
  const pillars = Object.fromEntries(POSITIONS.map(pos => {
    const pl = included(pos) ? P[pos]! : null;
    return [pos, pl ? { stem: pl.stem, branch: pl.branch, ganjiKo: hangulOf(pl.stem + pl.branch), hidden: (HIDDEN_STEMS[pl.branch] ?? []).map(h => ({ stem: h.stem, weight: h.weight, tenGod: TEN_GOD_KO[getTenGod(dm, h.stem) as TenGod] })) } : null];
  })) as PersonFacts["pillars"];
  const tenGods: Partial<Record<Slot, string[]>> = {};
  for (const pos of POSITIONS) {
    const pl = pillars[pos]; if (!pl) continue;
    if (pos !== "day") tenGods[slotOf(pos, "Stem")] = [TEN_GOD_KO[getTenGod(dm, pl.stem) as TenGod]];
    tenGods[slotOf(pos, "Branch")] = pl.hidden.map(h => h.tenGod);
  }
  const bal = det.elementBalance;
  const EL: readonly FiveElement[] = ["WOOD", "FIRE", "EARTH", "METAL", "WATER"];
  const count = Object.fromEntries(EL.map(e => [e, 0])) as Record<FiveElement, number>;
  const hidden = Object.fromEntries(EL.map(e => [e, false])) as Record<FiveElement, boolean>;
  for (const pos of POSITIONS) { const pl = pillars[pos]; if (!pl) continue; count[STEM_ELEMENT[pl.stem]]++; count[BRANCH_MAIN_ELEMENT[pl.branch]]++; for (const h of pl.hidden) hidden[STEM_ELEMENT[h.stem]] = true; }
  const maxCount = Math.max(...EL.map(e => count[e]));
  const gs = groupStrength(saju);
  const groups = Object.fromEntries(TEN_GOD_GROUP_KEYS.map(g => [g, { name: GROUP_NAME_KO[g], element: gs[g].element, value: gs[g].value, level: ({ strong: "강", medium: "보통", weak: "약" } as const)[gs[g].level] }])) as PersonFacts["groups"];
  const featureName = (id: string, fallback: string) => (k.features.get(id)?.name ?? fallback).replace(/\(.*$/, "");
  const shinsal: ShinsalFact[] = [];
  const pushShinsal = (code: string, family: "shinsal" | "gwiin", positions: readonly Pos[], slots: readonly Slot[], fallbackName: string) => {
    const id = `${family}:${code}`;
    const had = shinsal.find(s => s.id === id);
    const glyphs = [...new Set(slots.map(s => { const pos = s.replace(/(Stem|Branch)$/, "") as Pos; const pl = pillars[pos]; return pl ? (s.endsWith("Stem") ? pl.stem : pl.branch) : ""; }).filter(Boolean))];
    if (had) { const slotsAll = [...new Set([...had.slots, ...slots])]; shinsal[shinsal.indexOf(had)] = { ...had, positions: [...new Set([...had.positions, ...positions])], slots: slotsAll, glyphs: [...new Set([...had.glyphs, ...glyphs])], count: slotsAll.length }; return; }
    shinsal.push({ id, code, family, name: featureName(id, fallbackName), positions: [...positions], slots: [...slots], glyphs, count: slots.length, twelve: code.startsWith("TWELVE_") });
  };
  for (const s of det.shinsal) {
    const family = /GWIIN$/.test(s.code) ? "gwiin" : "shinsal";
    const original = saju.shinsal.find(o => o.code === s.code && o.positions.some(p => s.positions.includes(p as Pos)));
    pushShinsal(s.code, family, s.positions, slotsOf(s.code, s.positions, saju, original, s.evidence), s.labelKo);
  }
  for (const s of det.extraShinsal) {
    const slots = PILLAR_BASED.has(s.code) ? s.positions.flatMap(p => [slotOf(p, "Stem"), slotOf(p, "Branch")]) : s.positions.map(p => slotOf(p, "Branch"));
    pushShinsal(s.code, s.family, s.positions, slots, s.code);
  }
  const natalRel = det.relations.map(r => relFact(r));
  const clashes = det.stemClashes.map(r => relFact(r));
  const incoming = (position: TemporalPosition, pillar: Pillar): IncomingFact => {
    const inc = analyzeIncoming(saju, position, pillar);
    const natalStems = POSITIONS.filter(p => pillars[p]).map(p => ({ position: p, pillar: { stem: pillars[p]!.stem, branch: pillars[p]!.branch } }));
    const sc = detectStemClashes([...natalStems, { position, pillar }]).filter(r => r.members.some(m => m.position === position));
    return { ganji: pillar.stem + pillar.branch, ganjiKo: hangulOf(pillar.stem + pillar.branch), stemTenGod: TEN_GOD_KO[inc.stemTenGod], branchTenGod: TEN_GOD_KO[inc.branchTenGod], twelveStage: STAGE_KO[inc.twelveStage] ?? inc.twelveStage, gongmang: inc.gongmang, relations: inc.relations.map(r => relFact(r)), stemClashes: sc.map(r => relFact(r)) };
  };
  const dr = calculateCustomerDayun({ birthDate: input.birthDate, birthTime: input.birthTime, birthTimeUnknown: input.birthTimeUnknown, approximateBirthTimeSlot: input.approximateBirthTimeSlot ?? "", gender: gender ?? "", name: input.name });
  const daeunsu = dr.ok ? personDaeunsu(input.birthDate, dr.value.cycles) : undefined;
  const cycles: DayunFact[] = dr.ok ? dr.value.cycles.map(c => ({ ...incoming("dayun", { stem: c.stem, branch: c.branch }), index: c.index, startYear: c.startYear, endYear: c.endYear, startAge: c.startAge, manStartAge: daeunsu !== undefined ? daeunsu + 10 * (c.index - 1) : c.startAge - 1, startSolarKst: c.startSolarKst })) : [];
  const baseYear = Number(baseDate.slice(0, 4));
  const annual = Array.from({ length: 14 }, (_, i) => baseYear - 1 + i).map(year => ({ year, ...incoming("annual", getAnnualPillar(year)) }));
  const monthly = [baseYear, baseYear + 1].flatMap(year => getMonthlyPillars(year).map(m => ({ year, index: m.index, startKst: m.startKst, ...incoming("monthly", m.pillar) })));
  const pb = side === "person" ? brief?.person : brief?.partner?.person;
  const mb = side === "person" ? brief?.mbti : brief?.partner?.mbti;
  return {
    name: input.name, gender, birthDate: input.birthDate, birthTime: input.birthTimeUnknown ? null : input.birthTime, timeKnown: det.hourIncluded,
    pillars, dayMaster: { stem: dm, ko: hangulOf(dm), element: STEM_ELEMENT[dm] }, tenGods,
    elements: { count, weighted: { ...saju.elements.weighted }, strength: { ...bal.scores }, status: { ...bal.status }, hidden, strongest: bal.strongest.element, weakest: bal.weakest.element, mostCounted: EL.filter(e => count[e] === maxCount) },
    yinYang: { yin: saju.yinYang.yin, yang: saju.yinYang.yang, label: saju.yinYang.label },
    strength: { level: saju.structureAnalysis.dayMasterStrength.level, labelKo: saju.structureAnalysis.dayMasterStrength.labelKo, score: saju.structureAnalysis.dayMasterStrength.score },
    groups,
    twelveStages: det.twelveStages.filter(t => (POSITIONS as readonly string[]).includes(t.position)).map(t => ({ position: t.position as Pos, branch: t.branch, stage: t.stage, ko: STAGE_KO[t.stage] ?? t.stage })),
    twelveShinsalBasis: { basis: "yearBranch", branch: saju.pillars.year.branch },
    shinsal, relations: natalRel, stemClashes: clashes,
    gongmang: det.gongmang.map(g => ({ basis: g.basis, branches: [...g.branches], positions: [...g.positions] })),
    climate: { season: det.climate.season, level: det.climate.level, lacking: [...det.climate.lackingElements] },
    dayun: { direction: dr.ok ? dr.value.direction : null, number: cycles[0] ? daeunsu ?? null : null,
      current: !dr.ok ? null : currentDayunAt(dr.value.cycles, baseAt && Number.isFinite(Date.parse(baseAt)) ? Date.parse(baseAt) : Date.parse(`${baseDate}T12:00:00+09:00`))?.index ?? null, cycles },
    annual, monthly,
    mbti: mb ? { type: mb.type, stack: [...mb.functions] } : input.mbtiType ? { type: input.mbtiType, stack: [] } : null,
    input: pb ? { relationship: pb.facts.relationship, children: pb.facts.children, job: { ...pb.facts.job } } : null,
  };
}

/**
 * 두 사람 기둥끼리 관계(A 자리 × B 자리). W3 P3 5절: 브리프 요약·화면과 같은 한 구현(compat/relations.pairRelations — 같은 관계는 한 줄, 삼형 한 줄)을 쓴다.
 * 예전에는 자리 쌍마다 한 줄을 따로 만들어 정답지 15개 대 요약 11가지로 셈이 갈렸다(research-w2 CO5).
 */
function pairRelationFacts(rows: readonly PairRelation[], a: PersonFacts, b: PersonFacts): { relations: RelationFact[]; stemClashes: RelationFact[] } {
  const relations: RelationFact[] = [], stemClashes: RelationFact[] = [];
  for (const r of rows) {
    const part = r.sky ? "stem" : "branch";
    const side = (p: PersonFacts, ps: readonly Pos[]) => ps.flatMap(pos => { const pl = p.pillars[pos]; return pl ? [{ where: `${p.name} ${whereKo(pos)}`, char: pl[part] as string }] : []; });
    const fact: RelationFact = { kind: r.kind, key: r.key, keyKo: hangulOf(r.key), members: [...side(a, r.a), ...side(b, r.b)], completeness: r.completeness, ...(r.subtype ? { subtype: r.subtype } : {}), glyphCount: new Set(r.chars).size };
    (r.kind === "STEM_CHUNG" ? stemClashes : relations).push(fact);
  }
  return { relations, stemClashes };
}

export function buildFactSheet(input: BriefInput, brief: Brief | null, k: Knowledge): FactSheet {
  const sajuA = sajuOf(input.person, genderOf(input.person));
  const a = personFacts(input.person, k, input.baseDate, brief, "person", input.baseAt, sajuA);
  const people: PersonFacts[] = [a];
  let pair: PairFacts | undefined;
  if (input.partner) {
    const sajuB = sajuOf(input.partner, genderOf(input.partner));
    const b = personFacts(input.partner, k, input.baseDate, brief, "partner", input.baseAt, sajuB);
    people.push(b);
    const rel = pairRelationFacts(compatPairRelations(sajuA, sajuB), a, b);
    const bIds = new Set(b.shinsal.map(s => s.id));
    const dayStage = (p: PersonFacts) => p.twelveStages.find(t => t.position === "day")?.ko ?? null;
    const sc = brief?.compatibility?.score;
    const letters = a.mbti && b.mbti ? [...a.mbti.type].filter((c, i) => b.mbti!.type[i] === c) : [];
    const prof = brief?.compatibility?.profiles;
    const same = prof && prof.length === 2 ? (["energy", "lead", "conflict", "express", "decide", "offer", "money"] as const).filter(x => (prof[0] as Record<string, unknown>)[x] != null && (prof[0] as Record<string, unknown>)[x] === (prof[1] as Record<string, unknown>)[x]) : [];
    pair = {
      relationshipType: input.relationshipType ?? "", ...rel,
      common: { shinsal: a.shinsal.filter(s => bIds.has(s.id)).map(s => s.name), dayStage: dayStage(a) && dayStage(a) === dayStage(b) ? dayStage(a) : null, mbtiLetters: letters, profile: [...same] },
      score: sc ? (() => { const items = sc.components.filter(c => (c.level as string) !== "기본"); return { value: sc.value, base: BASE_POINTS, components: items.map(c => ({ name: c.name, points: c.points, max: c.max })), formula: `총점 = 기본점 ${BASE_POINTS} + 항목 점수 합(src/lib/compat/score.ts)` }; })() : null,
    };
  }
  const mbtiIds = [...new Set((brief?.chapters ?? []).flatMap(c => c.materials).flatMap(m => (m.kind === "mbti" && m.seedId ? [m.seedId] : [])))];
  return { version: FACTSHEET_VERSION, product: input.product, baseDate: input.baseDate, standards: STANDARDS, people, ...(pair ? { pair } : {}), mbtiIds };
}

/** 한 사람의 정답지에서 이름(부를 이름)·그 사람 신살 이름 묶음. */
export const shinsalNames = (p: PersonFacts) => new Set(p.shinsal.map(s => s.name));
export const groupLevelOf = (p: PersonFacts, g: TenGodGroupKey) => p.groups[g].level;
export { getTwelveStage };
