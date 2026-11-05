/**
 * 연애·결혼·자녀 전용 브리프 설계기(P6d G). 장마다 정해진 근거 종류(LOVE_REQUIRED)를 엔진 값과 심화 지식 DB로 채운다.
 * 관계 상태(솔로·썸·연애 중·기혼)마다 3·4·7·8·9장의 근거가 달라지고, 미입력이면 단정하지 않는다(조건형).
 * 시기는 경향으로만(결혼·이별·임신 시기 단정 금지). 자녀 자리는 시간 미상이면 유보.
 */
import type { MbtiProfile } from "@/data/knowledge-v5/schema";
import type { ChartDetections } from "@/lib/saju/detections/types";
import { getAnnualPillar } from "@/lib/saju/detections";
import { GROUP_LEVEL_KO, GROUP_NAME_KO, groupStrength, type TenGodGroupKey } from "@/lib/saju/groupStrength";
import { getTenGod } from "@/lib/saju/tenGods";
import type { SajuCalcResult, TenGod } from "@/lib/saju/types";
import { deepLines, type Knowledge } from "../knowledge";
import { ELEMENT_KO, ganjiOf, josa, tenGodLabel, TEN_GOD_GROUP } from "../labels";
import type { ChartBrief, Material } from "../schema";
import type { FactProfile } from "../facts";

type Evidence = Extract<Material, { kind: "evidence" }>;
/** 처음 만남·초반 검증 신호(연애 중·기혼에게는 쓰지 않는다). */
const FIRST_MEET = /초반|처음 만난|처음 만나|첫 만남|소개팅|만나자마자|캐묻|첫 데이트|알게 된 지/;
export type LoveStatus = "single" | "some" | "dating" | "married" | "unknown";
export const loveStatusOf = (relationshipStatus: string): LoveStatus => ({ single: "single", some: "some", dating: "dating", marriage_preparing: "dating", married: "married" } as Record<string, LoveStatus>)[relationshipStatus] ?? "unknown";
export const LOVE_STATUS_KO: Readonly<Record<LoveStatus, string>> = { single: "솔로", some: "썸", dating: "연애 중", married: "기혼", unknown: "관계 미입력" };
const ev = (key: string, facts: readonly string[], note?: string): Evidence => ({ kind: "evidence", key, facts: facts.filter(Boolean).length ? facts.filter(Boolean) : ["근거 없음: 이 절은 짧게"], ...(note ? { note } : {}) });
const pick = <T,>(xs: readonly T[], seed: number, n = 1): T[] => xs.length ? Array.from({ length: Math.min(n, xs.length) }, (_, i) => xs[(seed + i) % xs.length]) : [];
const hash = (s: string) => [...s].reduce((a, ch) => (a * 31 + ch.charCodeAt(0)) >>> 0, 11);
const POS = { year: "태어난 해", month: "태어난 달", day: "태어난 날", hour: "태어난 시각" } as Record<string, string>;

/** 상태별 절 질문(3·4·7·8·9장). */
export const LOVE_STATUS_Q: Readonly<Record<string, Readonly<Record<LoveStatus, string>>>> = {
  // P6e 8: 2장 둘째·셋째 절, 4장 첫 절도 상태별(연애 중·기혼에게 프로필·첫 만남·고백 이야기를 하지 않는다).
  profile: { single: "프로필에는 무엇을 담을까?", some: "썸 상대에게 어떤 모습을 더 보여 줄까?", dating: "오래된 사이에서 다시 보이는 내 매력은?", married: "오래 함께한 사이에서 다시 보이는 내 매력은?", unknown: "처음 보는 사람에게 무엇을 먼저 보여 줄까?" },
  firstMeet: { single: "첫 만남 30분에는 무엇을 보여 줄까?", some: "다음 만남에서는 무엇을 보여 줄까?", dating: "처음 끌렸던 모습은 어떻게 다시 켤까?", married: "처음 끌렸던 모습은 어떻게 다시 켤까?", unknown: "처음 만난 자리에서는 무엇을 보여 줄까?" },
  crush: { single: "호감이 생기면 나는 어떻게 움직일까?", some: "호감이 커지면 나는 어떻게 움직일까?", dating: "좋아하는 마음은 지금 어떻게 표현될까?", married: "아끼는 마음은 요즘 어떻게 표현될까?", unknown: "호감이 생기면 나는 어떻게 움직일까?" },
  meet: { single: "어디서 만나고, 어떤 신호는 피할까?", some: "이 썸을 이어 갈지 볼 신호는?", dating: "지금 관계를 점검할 질문은?", married: "배우자와 맞는 점과 다른 점은?", unknown: "어떤 사람을 만나면 편하고, 어떤 신호는 피할까?" },
  talk: { single: "연락 리듬과 고백은 어떻게 할까?", some: "연락 리듬과 마음을 전하는 순간은?", dating: "둘의 대화 리듬은 어떻게 맞출까?", married: "부부 대화의 리듬은 어떻게 맞출까?", unknown: "호감이 생기면 연락은 어떻게 할까?" },
  home: { single: "언젠가 함께 산다면 무엇을 먼저 정할까?", some: "함께하는 생활을 떠올리면 무엇이 중요할까?", dating: "함께 살게 된다면 돈·역할·집은?", married: "지금 생활에서 돈·역할·양가·집은 어떻게 나눌까?", unknown: "함께 살게 된다면 무엇을 먼저 정할까?" },
  parent: { single: "아이를 키우게 된다면 나는 어떤 부모일까?", some: "아이를 키우게 된다면 나는 어떤 부모일까?", dating: "아이를 키우게 된다면 둘은 무엇을 나눌까?", married: "아이와 함께하는 생활은 어떻게 설계할까?", unknown: "아이를 키우게 된다면 나는 어떤 부모일까?" },
  road: { single: "앞으로 3년, 인연을 위해 무엇을 할까?", some: "앞으로 3년, 이 마음을 어떻게 키울까?", dating: "앞으로 3년, 둘의 관계를 어떻게 다질까?", married: "앞으로 3년, 둘의 생활을 어떻게 가꿀까?", unknown: "앞으로 3년, 관계를 위해 무엇을 할까?" },
};

export type LoveCtx = {
  readonly saju: SajuCalcResult; readonly det: ChartDetections; readonly k: Knowledge; readonly chart: ChartBrief; readonly mbti: MbtiProfile | null;
  readonly gender: "MALE" | "FEMALE" | null; readonly relationshipStatus: string; readonly facts: FactProfile; readonly hitIds: ReadonlySet<string>; readonly baseDate: string;
  readonly priorEvidence?: ReadonlySet<string>;
  /** 기존 연애 근거(배우자·자녀 별·자리, 맞는 유형, 만남 장소, 호감 신호): loveEvidence·loveDesign 결과에서 재사용. */
  readonly base: Readonly<Record<string, Material>>;
};

export function loveDesign2(c: LoveCtx): Record<string, Evidence> {
  const { saju, det, k, chart, mbti } = c;
  const gs = groupStrength(saju);
  const status = loveStatusOf(c.relationshipStatus);
  const seed = hash(`${saju.pillars.day.stem}${saju.pillars.day.branch}${c.relationshipStatus}`);
  const fresh = (lines: readonly string[]) => [...lines].sort((a, b) => Number(c.priorEvidence?.has(a) ?? false) - Number(c.priorEvidence?.has(b) ?? false));
  const statusTag = `관계 상태: ${LOVE_STATUS_KO[status]}`;
  const together = status === "dating" || status === "married";
  const unknownNote = status === "unknown" ? "관계 상태가 입력되지 않았다: 연인·배우자가 있다고도 없다고도 단정하지 말고 조건형('생기면·만약')으로만" : undefined;
  // 자녀 장(l8) 씨앗에서 결혼·양가 낱말은 뺀다(P6c E3 marriage_talk).
  const seeds = (facet: string, n = 2) => status === "unknown" ? [] : pick(deepLines(k, "status-scenes", `love:${status}`, facet).filter(x => facet !== "l8" || !/결혼|시댁|처가|양가|상견례|신혼|혼수|예식|배우자|부부/.test(x)), seed, n).map(x => `상황 씨앗: ${x}`);
  const baseFacts = (key: string) => { const m = c.base[key]; return m?.kind === "evidence" ? m.facts : []; };
  // 이 사람에게 뚜렷한 십성(연애 신호): 원국 분포 많은 순.
  const present = (Object.entries(saju.tenGods.distribution) as [TenGod, number][]).filter(([, v]) => v >= 0.5).sort((a, b) => b[1] - a[1]).map(([t]) => t);
  const la = (facet: string, n = 2) => present.slice(0, 2).flatMap(t => pick(fresh(deepLines(k, "love-attract", `tenGod:${t}`, facet)), seed, 1).map(x => `${tenGodLabel(t)}: ${x}`)).slice(0, n);
  const shin = (code: string) => c.hitIds.has(`shinsal:${code}`);
  const charmShinsal = (["DOHWASAL", "HONGYEOMSAL", "TWELVE_JANGSEONGSAL"] as const).filter(shin);
  const charmLines = charmShinsal.flatMap(code => pick(fresh(deepLines(k, "love-attract", `shinsal:${code}`, "charm")), seed, 1).map(x => `${k.features.get(`shinsal:${code}`)?.name ?? code}: ${x}`));
  const elStrong = det.elementBalance.strongest.element, elWeak = det.elementBalance.weakest.element;
  const appeal = (facet: string) => [...pick(fresh(deepLines(k, "element-appeal", `element:${elStrong}`, facet, "strong")), seed, 1).map(x => `${josa(ELEMENT_KO[elStrong], "이가")} 강한 쪽: ${x}`), ...pick(fresh(deepLines(k, "element-appeal", `element:${elWeak}`, facet, "weak")), seed, 1).map(x => `${josa(ELEMENT_KO[elWeak], "이가")} 약한 쪽: ${x}`)];
  // 배우자 별 묶음과 세기.
  const spouseGroup: TenGodGroupKey | null = c.gender === "MALE" ? "WEALTH" : c.gender === "FEMALE" ? "OFFICER" : null;
  const childGroup: TenGodGroupKey | null = c.gender === "MALE" ? "OFFICER" : c.gender === "FEMALE" ? "OUTPUT" : null;
  const dayStage = det.twelveStages.find(s => s.position === "day");
  const stageF = dayStage ? k.features.get(`twelveStage:${dayStage.stage}`) : undefined;
  // 일지 관계: 형·충·파·해·원진(태어난 날 땅 글자가 낀 것).
  const dayRel = det.relations.filter(r => ["CHUNG", "HYEONG", "PA", "HAE", "WONJIN"].includes(r.kind) && r.members.some(m => m.position === "day" && !/^[甲乙丙丁戊己庚辛壬癸]$/.test(m.char)));
  const relName = (r: (typeof dayRel)[number]) => `${r.key}${({ CHUNG: "충", HYEONG: "형", PA: "파", HAE: "해", WONJIN: "원진" } as Record<string, string>)[r.kind]}(${r.members.filter(m => m.position !== "day").map(m => POS[m.position] ?? m.position).join("·")}과)`;
  const solitary = (["GOSINSAL", "GWASUKSAL", "WONJIN"] as const).filter(x => shin(x)).map(x => k.features.get(`shinsal:${x}`)?.name ?? x);
  // 피해야 할 신호: 강한·약한 오행과 묶음.
  const ranked = (Object.keys(gs) as TenGodGroupKey[]).sort((a, b) => gs[b].value - gs[a].value);
  // 최종판3 2f: 연애 중·기혼은 처음 만남 검증 신호(「초반부터 …」「내 이야기만 캐묻나요?」)를 주지 않는다 → 지금 관계 점검 줄만.
  const firstMeet = (x: string) => !(status === "dating" || status === "married") || !FIRST_MEET.test(x);
  const flags = [
    ...(status === "dating" || status === "married" ? [] : [
      ...pick(fresh(deepLines(k, "red-flags", `element:${elStrong}`, "flag", "strong")), seed, 1),
      ...pick(fresh(deepLines(k, "red-flags", `group:${ranked[0]}`, "flag", gs[ranked[0]].level === "strong" ? "strong" : "weak")), seed, 1)]),
    ...pick(fresh(deepLines(k, "red-flags", `element:${elWeak}`, "check", "weak")).filter(firstMeet), seed, 1).map(x => `점검: ${x}`),
  ];
  // 통념 궁합(고친 표): 좋음 2~3, 노력 1~2.
  const good = mbti?.conventionalCompat.filter(x => x.fit === "좋음").slice(0, 3) ?? [];
  const hard = mbti?.conventionalCompat.filter(x => x.fit === "노력").slice(0, 2) ?? [];
  // 반안·정관·재성: 결혼관.
  const marriageView = [
    ...(shin("TWELVE_BANANSAL") ? ["반안살: 안정과 격식을 아는 쪽 → 함께 사는 생활의 틀을 중시"] : []),
    `정관 ${saju.tenGods.distribution.正官 >= 0.5 ? "있음: 약속·책임으로 관계를 지키는 쪽" : "약함: 형식보다 둘만의 방식으로"}`,
    `재성 ${GROUP_LEVEL_KO[gs.WEALTH.level]}: ${gs.WEALTH.level === "strong" ? "생활의 현실(돈·집)을 먼저 챙기는 쪽" : gs.WEALTH.level === "weak" ? "돈 이야기를 미루기 쉬움 → 처음부터 규칙으로" : "현실과 마음을 함께 보는 쪽"}`,
  ];
  // 인연의 흐름(경향): 앞으로 10년 가운데 배우자 별 묶음이 하늘 글자로 오는 해, 도화 해.
  const ty = chart.thisYear.year;
  const yrs = Array.from({ length: 10 }, (_, i) => ty + i).map(y => { const p = getAnnualPillar(y); return { y, p, tg: getTenGod(saju.dayMaster, p.stem) }; });
  const loveYears = spouseGroup ? yrs.filter(x => TEN_GOD_GROUP[x.tg] === spouseGroup).slice(0, 3).map(x => `${x.y}년 ${ganjiOf(x.p).hangul} ${tenGodLabel(x.tg)}: 배우자 별 쪽 기운이 들어오는 해(만남·관계의 일이 앞에 오는 경향, 시기 단정 금지)`) : [];
  const three = yrs.slice(0, 3).map(x => `${x.y}년 ${tenGodLabel(x.tg)}: ${TEN_GOD_GROUP[x.tg] === spouseGroup ? "관계 쪽 기운" : TEN_GOD_GROUP[x.tg] === "OUTPUT" ? "표현이 늘어나는 해" : TEN_GOD_GROUP[x.tg] === "RESOURCE" ? "마음을 돌보고 정리하는 해" : TEN_GOD_GROUP[x.tg] === "PEER" ? "내 기준이 세지는 해" : "현실 일이 늘어나는 해"}`);
  const [by, bm] = c.baseDate.split("-").map(Number);
  const hourKnown = det.hourIncluded;
  return {
    loveEngine: ev("loveEngine", [...baseFacts("spousePalace").slice(0, 2), ...(spouseGroup ? [`배우자 별 묶음(${GROUP_NAME_KO[spouseGroup]}) 세기: ${GROUP_LEVEL_KO[gs[spouseGroup].level]}`] : []), ...baseFacts("spouseStar").slice(0, 1), chart.stars ? `자리: ${chart.stars.spouse.line}` : ""], "배우자 자리·별은 엔진 값 그대로(있음·땅속·없음을 바꾸지 않는다)"),
    dayStage: ev("dayStage", [...(dayStage && stageF ? [`태어난 날 땅 글자의 십이운성: ${stageF.name} — ${stageF.meaning.split(/(?<=[.!?])\s+/)[1] ?? stageF.meaning.split(/(?<=[.!?])\s+/)[0]}`] : []), ...(mbti ? [`연애 기능: ${mbti.cognitiveFunctions.slice(0, 2).map(f => f.easy).join(" / ")}`] : [])]),
    charm: ev("charm", [...charmLines, ...appeal("loveImage"), ...la("charm", 1), `식상(표현하는 힘) ${GROUP_LEVEL_KO[gs.OUTPUT.level]}`]),
    // P6e 8: 연애 중·기혼은 프로필·첫 만남 대신 오래된 사이에서 다시 보이는 매력·처음 끌렸던 모습 다시 켜기.
    profile: together
      ? ev("profile", [statusTag, ...la("attachment", 1), ...appeal("loveImage").slice(0, 1), ...seeds("l3", 1)], "오래 만난 상대가 다시 알아보는 내 모습으로 쓴다. 프로필·소개팅·첫 만남 이야기는 쓰지 않는다")
      : ev("profile", appeal("profile"), "프로필 문장 예시는 하나만 직접 지어 보여 준다"),
    firstMeet: together
      ? ev("firstMeet", [statusTag, ...la("date", 1), ...la("charm", 2).slice(1), ...seeds("l9", 1)], "처음 끌렸던 모습을 다시 보여 주는 행동 하나로 쓴다. 첫 만남·소개팅·고백 이야기는 쓰지 않는다")
      : ev("firstMeet", appeal("firstMeet")),
    matchTypes: ev("matchTypes", baseFacts("matchTypes"), "유형마다 근거 하나와 장면 하나. 만남 시기 이야기는 꺼내지 않는다(안내 문장도 쓰지 않는다)"),
    combos: ev("combos", [...good.map(x => `통념상 잘 맞는 조합: ${x.type} — ${x.why}`), ...hard.map(x => `통념상 맞추는 데 노력이 드는 조합: ${x.type} — ${x.why}`)], "MBTI 조합은 흔히 도는 궁합표의 통념이다. 어려운 조합도 만나면 안 된다고 쓰지 않는다"),
    meetState: ev("meetState", [statusTag, ...(status === "single" || status === "unknown" ? baseFacts("meetingPlaces") : []), ...flags.map(x => x.startsWith("점검") ? x : `피해야 할 신호: ${x}`), ...seeds("l3", 2)], unknownNote ?? (status === "married" ? "배우자와 맞는 점·다른 점은 단정하지 않고 '이런 점이 맞는다면'으로" : status === "dating" ? "관계 점검 질문을 둘 셋, 상대를 평가하지 않는다" : "만남 경로·장소와 피해야 할 신호")),
    crush: together
      ? ev("crush", [statusTag, ...la("attachment", 2), ...la("contact", 1)], "지금 관계에서 마음을 표현하는 리듬으로 쓴다. 고백·첫 연락·썸 이야기는 쓰지 않는다")
      : ev("crush", [...baseFacts("crush").slice(0, 2), ...la("confess", 1)]),
    talkRhythm: ev("talkRhythm", [statusTag, ...la("contact", 2), ...seeds("l4", 2)], unknownNote ?? (status === "single" || status === "some" ? "연락 리듬·고백 성향, 문장 예시 하나(따옴표 한 줄)" : "대화 리듬, 문장 예시 하나")),
    express: ev("express", [...la("attachment", 2), ...la("date", 1)]),
    jealousy: ev("jealousy", [...(solitary.length ? [`관계 신살: ${solitary.join("·")} → 혼자 정리하는 시간이 필요한 쪽`] : []), ...la("conflict", 2)], "서운함은 한 문장만: 같은 말을 장마다 되풀이하지 않는다"),
    dayRelations: ev("dayRelations", dayRel.length ? dayRel.slice(0, 3).map(r => `태어난 날 땅 글자의 ${relName(r)}: ${k.features.get(`relation:${r.kind}`)?.name ?? r.kind}`) : ["태어난 날 땅 글자에 형·충·파·해가 없음 → 다툼은 밖에서 오는 일정·속도 차이에서"], "관계 이름은 엔진 값 그대로. 없으면 '없다'고만"),
    dangerSigns: ev("dangerSigns", [...pick(fresh(deepLines(k, "red-flags", `group:${ranked[ranked.length - 1]}`, "flag", "weak")).filter(firstMeet), seed, 1).map(x => `관계가 위험할 때의 신호: ${x}`), ...pick(deepLines(k, "red-flags", `group:${ranked[0]}`, "check", gs[ranked[0]].level === "strong" ? "strong" : "weak").filter(firstMeet), seed, 1).map(x => `점검: ${x}`)]),
    marriageView: ev("marriageView", marriageView, "성향만 쓴다. 시기 이야기는 꺼내지 않는다('시기는 말하지 않아요' 같은 안내 문장도 쓰지 않는다)"),
    homeState: ev("homeState", [statusTag, ...seeds("l7", 2), status === "married" ? "기혼: 지금 생활 점검 — 돈·역할·양가·집 중 하나씩" : "조건형: '함께 살게 된다면'"], unknownNote),
    childStar: ev("childStar", [...baseFacts("childStar").slice(0, 2), ...(childGroup ? [`자녀 별 묶음(${GROUP_NAME_KO[childGroup]}) 세기: ${GROUP_LEVEL_KO[gs[childGroup].level]}`] : []), ...(hourKnown ? baseFacts("childPalace").slice(0, 1) : ["출생 시각을 몰라 자녀 자리(태어난 시각의 땅 글자)는 보지 않는다(유보)"])], "부모로서의 결만 쓴다. 자녀의 성별·수·시기 이야기는 꺼내지 않는다(그런 안내 문장도 쓰지 않는다)"),
    parentState: ev("parentState", [statusTag, `자녀: ${c.facts.children === "has" ? "있음(입력)" : c.facts.children === "none" ? "없음(입력) → 조건형으로" : "입력 없음 → '아이를 키우게 된다면'으로"}`, ...seeds("l8", 2)], unknownNote),
    loveTiming: ev("loveTiming", [...loveYears, ...(chart.currentDayun ? [`지금 대운: ${chart.currentDayun.tenGod}(${chart.currentDayun.years}) — 관계는 이 흐름의 경향으로만`] : [])], "경향만: 만남·결혼·이별의 시기를 단정하지 않는다"),
    loveRoadmap: ev("loveRoadmap", [statusTag, ...three, ...seeds("l9", 2), `첫 달(${by}년 ${bm}월) 행동 하나`], unknownNote ?? "해마다 행동 하나, 첫 달 행동 하나. '이번 달'이라 쓰지 않고 달 이름으로"),
  };
}

/**
 * 9장 × 관계 상태 주제표(P6e 8). 브리프 질문(LOVE_STATUS_Q)·근거(loveDesign2)가 이 표대로 갈린다. 장 제목은 4장만 상태에 따라 바뀐다(LOVE_STATUS_TITLE).
 * 솔로·미입력 = 만남 준비, 썸 = 마음을 키우는 단계, 연애 중·기혼 = 지금 관계를 가꾸는 단계.
 */
export const LOVE_STATUS_TABLE: Readonly<Record<string, Readonly<Record<LoveStatus, string>>>> = {
  "love-engine": { single: "사랑의 엔진(공통)", some: "사랑의 엔진(공통)", dating: "사랑의 엔진(공통)", married: "사랑의 엔진(공통)", unknown: "사랑의 엔진(공통)" },
  charm: { single: "끄는 매력 · 프로필 · 첫 만남 30분", some: "끄는 매력 · 썸 상대에게 더 보여 줄 모습 · 다음 만남", dating: "끄는 매력 · 오래된 사이에서 다시 보이는 매력 · 처음 끌렸던 모습 다시 켜기", married: "끄는 매력 · 오래 함께한 사이의 매력 · 처음 끌렸던 모습 다시 켜기", unknown: "끄는 매력 · 처음 보는 사람에게 보여 줄 것 · 처음 만난 자리" },
  match: { single: "맞는 사람 · 통념 궁합 · 만날 곳과 피할 신호", some: "맞는 사람 · 통념 궁합 · 이 썸을 이어 갈 신호", dating: "맞는 사람 · 통념 궁합 · 지금 관계 점검 질문", married: "맞는 사람 · 통념 궁합 · 배우자와 맞는 점·다른 점", unknown: "맞는 사람 · 통념 궁합 · 편한 사람과 피할 신호(조건형)" },
  contact: { single: "호감 · 연락 리듬과 고백 · 숨길 때와 드러낼 때", some: "커지는 호감 · 연락 리듬과 마음 전하기 · 숨길 때와 드러낼 때", dating: "지금의 표현 · 둘의 대화 리듬 · 숨길 때와 드러낼 때", married: "요즘의 표현 · 부부 대화 리듬 · 숨길 때와 드러낼 때", unknown: "호감 · 연락(조건형) · 숨길 때와 드러낼 때" },
  "in-love": { single: "연애할 때의 나(조건형)", some: "연애할 때의 나(조건형)", dating: "연애할 때의 나", married: "함께 지낼 때의 나", unknown: "연애할 때의 나(조건형)" },
  conflict: { single: "갈등과 회복(조건형)", some: "갈등과 회복", dating: "갈등과 회복", married: "갈등과 회복", unknown: "갈등과 회복(조건형)" },
  marriage: { single: "결혼관 · 언젠가 함께 산다면", some: "결혼관 · 함께하는 생활 상상", dating: "결혼관 · 함께 살게 된다면 돈·역할·집", married: "결혼관 · 지금 생활의 돈·역할·양가·집", unknown: "결혼관 · 함께 살게 된다면(조건형)" },
  parenting: { single: "자녀 별·자리 · 아이를 키운다면", some: "자녀 별·자리 · 아이를 키운다면", dating: "자녀 별·자리 · 아이를 키운다면 둘이 나눌 것", married: "자녀 별·자리 · 아이와의 생활 설계", unknown: "자녀 별·자리 · 아이를 키운다면(조건형)" },
  flow: { single: "인연의 흐름 · 3년 인연 로드맵", some: "인연의 흐름 · 3년 마음 키우기", dating: "인연의 흐름 · 3년 관계 다지기", married: "인연의 흐름 · 3년 생활 가꾸기", unknown: "인연의 흐름 · 3년 관계 로드맵(조건형)" },
};
/** 4장 제목: 연애 중·기혼은 고백 대신 지금 관계의 표현 리듬. */
export const LOVE_STATUS_TITLE: Readonly<Record<string, Partial<Record<LoveStatus, string>>>> = { contact: { dating: "표현과 대화의 리듬", married: "표현과 대화의 리듬" } };

export const LOVE_REQUIRED: Readonly<Record<string, { readonly evidence: readonly string[]; readonly terms: readonly RegExp[] }>> = {
  "love-engine": { evidence: ["loveEngine", "dayStage"], terms: [/배우자 (자리|별)/, /장생|목욕|관대|건록|제왕|쇠|병|사|묘|절|태|양|십이운성/] },
  charm: { evidence: ["charm", "profile", "firstMeet"], terms: [/도화|홍염|장성|식상|나무|불|흙|쇠|물/] },
  match: { evidence: ["matchTypes", "combos", "meetState"], terms: [/[EI][NS][TF][JP]|기운|별/] },
  contact: { evidence: ["crush", "talkRhythm"], terms: [/연락|대화|고백|표현/] },
  "in-love": { evidence: ["express", "jealousy"], terms: [/표현|질투|서운|데이트/] },
  conflict: { evidence: ["dayRelations", "dangerSigns"], terms: [/충|형|파|해|원진|태어난 날/] },
  marriage: { evidence: ["marriageView", "homeState"], terms: [/정관|재성|반안/] },
  parenting: { evidence: ["childStar", "parentState"], terms: [/자녀 (별|자리)/] },
  flow: { evidence: ["loveTiming", "loveRoadmap"], terms: [/\d{4}년/] },
};
