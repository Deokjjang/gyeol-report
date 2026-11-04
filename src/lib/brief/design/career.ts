/**
 * 커리어·돈·학업 전용 브리프 설계기(P6d G). 종합과 다른 심화 상품: 장마다 정해진 근거 종류(REQUIRED_EVIDENCE)를 엔진 값과 심화 지식 DB(deep/*)로 채운다.
 * 상태 입력(직장인·자영업·프리랜서·학생·구직/무직·육아/주부·기타)마다 2·3·4·6·7장의 근거가 달라진다. 상태 미입력이면 단정하지 않는다(조건형 두 갈래).
 * 십성 묶음 세기는 만세력 가중값 하나(groupStrength.ts)만 쓴다. 투자 장은 성향 해석만(종목·상품·시점 금지).
 */
import type { MbtiProfile } from "@/data/knowledge-v5/schema";
import type { ChartDetections } from "@/lib/saju/detections/types";
import { getAnnualPillar } from "@/lib/saju/detections";
import { GROUP_LEVEL_KO, GROUP_NAME_KO, groupStrength, TEN_GOD_GROUP_KEYS, type TenGodGroupKey } from "@/lib/saju/groupStrength";
import { getTenGod } from "@/lib/saju/tenGods";
import type { SajuCalcResult, TenGod } from "@/lib/saju/types";
import { deepLines, type Knowledge } from "../knowledge";
import { SCENE_TAGS } from "../facts";
import { ganjiOf, GROUP_EASY, koCount, tenGodLabel, TEN_GOD_GROUP } from "../labels";
import type { ChartBrief, Material } from "../schema";
import { DOMAIN_BY_TEN_GOD } from "../productEvidence";

type Evidence = Extract<Material, { kind: "evidence" }>;
export type CareerStatus = "employee" | "business" | "freelancer" | "student" | "job_seeker" | "homemaker" | "other" | "unknown";
/** 입력 jobStatus → 상태(P6d G). */
export const careerStatusOf = (jobStatus: string): CareerStatus => ({ employee: "employee", self_employed: "business", business_owner: "business", freelancer: "freelancer", student: "student", job_seeker: "job_seeker", unemployed: "job_seeker", homemaker: "homemaker", other: "other" } as Record<string, CareerStatus>)[jobStatus] ?? "unknown";
export const CAREER_STATUS_KO: Readonly<Record<CareerStatus, string>> = { employee: "직장인", business: "자영업·사장", freelancer: "프리랜서", student: "학생", job_seeker: "구직·무직", homemaker: "육아·주부", other: "기타", unknown: "상태 미입력" };

const ev = (key: string, facts: readonly string[], note?: string): Evidence => ({ kind: "evidence", key, facts: facts.filter(Boolean).length ? facts.filter(Boolean) : ["근거 없음: 이 절은 짧게"], ...(note ? { note } : {}) });
const pick = <T,>(xs: readonly T[], seed: number, n = 1): T[] => xs.length ? Array.from({ length: Math.min(n, xs.length) }, (_, i) => xs[(seed + i) % xs.length]) : [];
const hash = (s: string) => [...s].reduce((a, ch) => (a * 31 + ch.charCodeAt(0)) >>> 0, 7);
const SEASON_WORK: Readonly<Record<string, string>> = { 봄: "시작과 확장에 힘이 붙는 온도", 여름: "드러내고 달리는 온도(식히는 시간 필요)", 가을: "다듬고 거두는 온도", 겨울: "안으로 모으고 준비하는 온도(데우는 활동 필요)" };

export type CareerCtx = {
  readonly saju: SajuCalcResult; readonly det: ChartDetections; readonly k: Knowledge; readonly chart: ChartBrief; readonly mbti: MbtiProfile | null;
  readonly jobStatus: string; readonly detailJob: string; readonly hitIds: ReadonlySet<string>; readonly baseDate: string;
  /** 같은 고객의 앞 책이 쓴 근거 줄(P6d G 60%): 같은 줄이 있으면 다른 줄을 먼저 고른다. */
  readonly priorEvidence?: ReadonlySet<string>;
  /** 기존 커리어 근거(직무 3단·진로 다섯 갈래·돈 새는 곳·축적): evidence.ts careerEvidence 결과에서 재사용. */
  readonly base: Readonly<Record<string, Material>>;
  /** 최종판 1-15: 가게 장면이 맞는 생활인가(facts.sceneCtxOf). false인 사업자(스타트업 대표 등)는 가게 씨앗 대신 그 직업 소품(jobProps)을 받는다. */
  readonly shop?: boolean; readonly jobProps?: readonly string[];
};

/** 상태별 절 질문(2·3·4·6·7장, P6d G). 상태 미입력이면 단정하지 않는 질문. */
export const CAREER_STATUS_Q: Readonly<Record<string, Readonly<Record<CareerStatus, string>>>> = {
  now: { employee: "지금 회사에서 버틸 이유와 옮길 신호는?", business: "내 가게는 운영형일까 확장형일까, 직원과 손님은?", freelancer: "일감과 단가를 어떻게 지킬까?", student: "전공과 첫 직장은 어떻게 이어질까?", job_seeker: "어떤 순서로 찾고, 공백기는 어떻게 쓸까?", homemaker: "살림과 내 일의 경계는 어디에 둘까?", other: "지금 자리에서 내 힘은 어디에 쓰일까?", unknown: "어떤 자리라면 내 힘이 바로 쓰일까?" },
  // P6e 13: 직군 순서(구직 = 지원할 직군 순서, 재직 = 지금 직무에서 넓힐 직군).
  jobs: { employee: "지금 직무에서 넓혀 갈 직군은?", business: "내 가게 일과 이어지는 직군은?", freelancer: "건당 일로 이어 갈 직군은?", student: "어느 직군을 목표로 잡을까?", job_seeker: "어느 직군부터 지원하면 좋을까?", homemaker: "다시 일을 찾는다면 어느 직군부터?", other: "나에게 맞는 직군은?", unknown: "나에게 맞는 직군은?" },
  side: { employee: "회사 밖 부업은 맞을까?", business: "두 번째 사업이나 확장은 맞을까?", freelancer: "건당 일 말고 쌓이는 수입은?", student: "학생 때 해 볼 작은 일은?", job_seeker: "구하는 동안 해 볼 작은 일은?", homemaker: "집에서 시작할 작은 일은 맞을까?", other: "부업·창업은 나에게 맞을까?", unknown: "부업·창업은 나에게 맞을까?" },
  pitch: { employee: "이력서와 면접에서 무엇을 내세울까?", business: "가게와 브랜드는 어떤 톤으로 알릴까?", freelancer: "포트폴리오와 영업은 어떻게 할까?", student: "첫 지원서에 무엇을 앞세울까?", job_seeker: "자기소개서 첫 줄과 면접 답은?", homemaker: "다시 일을 찾을 때 무엇을 앞세울까?", other: "나를 소개할 때 무엇을 앞에 둘까?", unknown: "나를 소개할 때 무엇을 앞에 둘까?" },
  pay: { employee: "연봉 협상에서는 어떻게 말할까?", business: "가격을 정하고 올릴 때는?", freelancer: "단가를 정하고 올릴 때는?", student: "첫 일의 조건을 물을 때는?", job_seeker: "처우를 물을 때는 어떻게 말할까?", homemaker: "내 일의 값을 매길 때는?", other: "내 일의 값을 말할 때는?", unknown: "내 일의 값을 말할 때는?" },
  docs: { employee: "승진과 평가는 어떻게 준비할까?", business: "계약·임대차·인허가 서류는 어떻게 챙길까?", freelancer: "계약서와 작업 범위는 어떻게 지킬까?", student: "시험과 자격은 어떻게 준비할까?", job_seeker: "시험·자격은 어떤 순서로 갖출까?", homemaker: "다시 시작할 때 필요한 자격은?", other: "평가·자격은 어떻게 준비할까?", unknown: "평가·자격은 어떻게 준비할까?" },
  money: { employee: "월급형 구조에서 돈은 어떻게 남을까?", business: "매출형 구조에서 돈은 어떻게 남을까?", freelancer: "건당형 구조에서 돈은 어떻게 남을까?", student: "용돈·첫 수입은 어떻게 다룰까?", job_seeker: "수입이 없는 동안 돈은 어떻게 지킬까?", homemaker: "살림 돈과 내 돈은 어떻게 나눌까?", other: "내 수입 구조에서 돈은 어떻게 남을까?", unknown: "월급형·매출형·건당형 가운데 나는 어디에 맞을까?" },
};
/** 최종판 1-15: 가게형이 아닌 사업자(스타트업 대표 등)의 질문 — 「가게」·「임대차」 대신 사업. 없는 열쇠는 CAREER_STATUS_Q.business를 쓴다. */
export const CAREER_BUSINESS_NOSHOP_Q: Readonly<Record<string, string>> = {
  now: "내 사업은 운영형일까 확장형일까, 함께 일할 사람과 고객은?", jobs: "내 사업과 이어지는 직군은?", pitch: "서비스와 브랜드는 어떤 톤으로 알릴까?", docs: "계약·세금·지원사업 서류는 어떻게 챙길까?",
};

export function careerDesign(c: CareerCtx): Record<string, Evidence> {
  const { saju, det, k, chart, mbti } = c;
  const gs = groupStrength(saju);
  const status = careerStatusOf(c.jobStatus);
  const seed = hash(`${saju.pillars.day.stem}${saju.pillars.day.branch}${c.detailJob}${c.jobStatus}`);
  const ranked = [...TEN_GOD_GROUP_KEYS].sort((a, b) => gs[b].value - gs[a].value || a.localeCompare(b));
  const top = ranked[0], weak = ranked[ranked.length - 1];
  const lvl = (g: TenGodGroupKey) => gs[g].level === "strong" ? "strong" : "weak";
  const fresh = (lines: readonly string[]) => [...lines].sort((a, b) => Number(c.priorEvidence?.has(a) ?? false) - Number(c.priorEvidence?.has(b) ?? false));
  // P6e 14: 다섯 힘은 쉬운 이름으로(첫 등장에만 묶음 이름을 괄호로).
  const line = (g: TenGodGroupKey) => `${GROUP_EASY[g]}(${GROUP_NAME_KO[g]}) ${GROUP_LEVEL_KO[gs[g].level]}`;
  const groupLine = TEN_GOD_GROUP_KEYS.map(line).join(" · ");
  const we = (g: TenGodGroupKey, facet: string, n = 1) => pick(fresh(deepLines(k, "work-engine", `group:${g}`, facet, lvl(g))), seed, n);
  // 최종판 1-15: 가게형이 아닌 사업자에게는 가게 장면(손님·단골·매장…)을 주지 않는다. 상황 씨앗은 그 직업의 소품에서 장마다 다른 것을 고른다.
  const noShop = status === "business" && c.shop === false;
  const fit = (xs: readonly string[]) => noShop ? xs.filter(x => !SCENE_TAGS.shop.test(x)) : xs;
  const propPool = noShop ? fit(c.jobProps ?? []) : [];
  let propAt = 0;
  const statusSeeds = (facet: string, n = 2) => status === "unknown" ? []
    : (noShop ? Array.from({ length: Math.min(n, propPool.length) }, () => propPool[(seed + propAt++) % propPool.length])
      : pick(deepLines(k, "status-scenes", `status:${status}`, facet), seed, n)).map(x => `상황 씨앗: ${x}`);
  const statusTag = `상태: ${CAREER_STATUS_KO[status]}${c.detailJob ? ` · 입력 직업 ${c.detailJob}` : ""}`;
  const unknownNote = status === "unknown" ? "상태가 입력되지 않았다: 직장·사업·구직 가운데 하나로 단정하지 말고 '~라면' 두 갈래로만 쓴다" : undefined;
  // 강한 오행(보이는 힘)과 약한 오행.
  const elStrong = det.elementBalance.strongest.element, elWeak = det.elementBalance.weakest.element;
  const appeal = (facet: string, n = 1) => [...pick(fresh(fit(deepLines(k, "element-appeal", `element:${elStrong}`, facet, "strong"))), seed, n), ...pick(fresh(fit(deepLines(k, "element-appeal", `element:${elWeak}`, facet, "weak"))), seed + 1, 1)];
  // 월주: 월간·월지 본기 십성.
  const monthStemTg = saju.tenGods.stems.month, monthBranchTg = saju.tenGods.hiddenStems.find(h => h.branch === saju.pillars.month.branch && h.weight >= 0.5)?.tenGod;
  // P6e 5: 십성마다 자리를 붙인다("월지의 비견" 오류: 월간 비견·월지 정인을 자리 없이 나란히 줘서 작가가 바꿔 썼다).
  const tgMeaning = (tg: TenGod | undefined, where = "") => tg ? `${where ? `${where}: ` : ""}${tenGodLabel(tg)} — ${DOMAIN_BY_TEN_GOD[tg][0]}` : "";
  // 일터의 사람: 원국에 드러난 십성(천간·지지 본기) 가운데 많은 순 3개.
  const present = (Object.entries(saju.tenGods.distribution) as [TenGod, number][]).filter(([, v]) => v >= 0.5).sort((a, b) => b[1] - a[1]).map(([t]) => t).slice(0, 3);
  const people = present.flatMap(t => pick(fresh(deepLines(k, "workplace-people", `tenGod:${t}`, "person")), seed, 1).map(x => `${tenGodLabel(t)}(이 사람 곁의 ${GROUP_NAME_KO[TEN_GOD_GROUP[t] as TenGodGroupKey]} 쪽 사람): ${x}`));
  const roleFacet = status === "business" ? "asOwner" : status === "employee" ? "asMember" : "asLeader";
  const roleLines = present.slice(0, 2).flatMap(t => pick(fresh(fit(deepLines(k, "workplace-people", `tenGod:${t}`, roleFacet))), seed, 1).map(x => `${tenGodLabel(t)} 사람을 대할 때: ${x}`));
  const partner = present.slice(0, 1).flatMap(t => deepLines(k, "workplace-people", `tenGod:${t}`, "partnerCaution").slice(0, 1).map(x => `동업할 때(${tenGodLabel(t)}): ${x}`));
  const POS = { year: "태어난 해", month: "태어난 달", day: "태어난 날", hour: "태어난 시각" } as Record<string, string>;
  const gwiin = det.shinsal.filter(s => /GWIIN/.test(s.code)).map(s => `${k.features.get(`gwiin:${s.code}`)?.name ?? s.code}: ${s.positions.map(p => POS[p] ?? p).join("·")} 자리`);
  const helperTg = present.find(t => TEN_GOD_GROUP[t] === "RESOURCE" || TEN_GOD_GROUP[t] === "OFFICER") ?? present[0];
  const helper = helperTg ? deepLines(k, "workplace-people", `tenGod:${helperTg}`, "helper").slice(0, 1).map(x => `귀인으로 오는 모습(${tenGodLabel(helperTg)}): ${x}`) : [];
  // 문서·자격: 관성·인성 단계 + 상태별 면.
  const docFacet = status === "business" || status === "freelancer" ? "contract" : status === "student" || status === "job_seeker" || status === "homemaker" ? "exam" : status === "employee" ? "promotion" : "promotion";
  const docs = (["OFFICER", "RESOURCE"] as const).flatMap(g => pick(fresh(deepLines(k, "documents", `group:${g}`, docFacet, lvl(g))), seed, 1).map(x => `${line(g)} → ${x}`));
  const docsTrend = (["OFFICER", "RESOURCE"] as const).flatMap(g => pick(deepLines(k, "documents", `group:${g}`, "yearTrend", lvl(g)), seed, 1).map(x => `${GROUP_NAME_KO[g]}이 들어오는 해의 경향: ${x}`));
  // 앞으로 10년 가운데 관성·인성이 하늘 글자로 들어오는 해(경향).
  const ty = chart.thisYear.year;
  const years = Array.from({ length: 10 }, (_, i) => ty + i).map(y => ({ y, tg: getTenGod(saju.dayMaster, getAnnualPillar(y).stem) }));
  const docYears = years.filter(x => TEN_GOD_GROUP[x.tg] === "OFFICER" || TEN_GOD_GROUP[x.tg] === "RESOURCE").slice(0, 4).map(x => `${x.y}년 ${tenGodLabel(x.tg)}(${GROUP_NAME_KO[TEN_GOD_GROUP[x.tg] as TenGodGroupKey]}의 해: 평가·문서가 앞에 오는 경향, 결과는 단정하지 않는다)`);
  // 돈의 길: 정재·편재, 식상→재성, 비겁→재성, 재고.
  const d = saju.tenGods.distribution;
  const wealthKind = Math.max(d.正財, d.偏財) < 0.5 ? "재성이 약해 일한 만큼 받는 구조에서 돈이 남는 쪽" : Math.abs(d.正財 - d.偏財) < 0.3 ? "정재(고정 수입)와 편재(성과·기회 수입)를 함께 굴리는 쪽" : d.正財 > d.偏財 ? "정재형: 고정 수입을 차곡차곡 쌓을 때 남는 쪽" : "편재형: 성과·기회를 크게 굴릴 때 붙는 쪽";
  const flowOW = det.structureFlows.some(f => f.code === "OUTPUT_GENERATES_WEALTH") ? "식상이 재성을 낳는 흐름이 있다(만든 것이 돈이 되는 길)" : gs.OUTPUT.level !== "weak" && gs.WEALTH.level === "weak" ? "식상은 있는데 재성이 약하다: 만든 것을 값으로 바꾸는 단계(가격표·견적)를 따로 챙겨야 남는다" : "";
  const flowPW = gs.PEER.level === "strong" && gs.WEALTH.level !== "strong" ? "비겁이 강해 재성을 나눠 가져가는 구조: 동업·빌려주기·공동 지출에서 돈이 샌다" : "";
  const jaego = c.hitIds.has("gwiin:JAEGO") ? "재고(돈을 모아 두는 창고 자리)가 있어 쌓아 두는 힘이 있다" : "";
  const moneyStatus: Readonly<Record<CareerStatus, string>> = { employee: "월급형: 고정 수입 → 들어온 날 먼저 떼는 순서가 남는 법", business: "매출형: 매출과 내 몫을 나눈다 → 사업 통장과 생활비 통장 분리", freelancer: "건당형: 일감 사이 빈 달을 먼저 계산 → 석 달 치 생활비를 바닥으로", student: "첫 수입: 쓰는 돈과 모으는 돈의 비율을 처음부터 정해 두기", job_seeker: "수입 공백: 고정 지출부터 줄이고 기간을 정해 두기", homemaker: "살림 돈과 내 돈: 이름이 다른 통장으로 나누기", other: "내 수입 구조에 맞춰 들어오는 날과 나가는 날을 한 장에", unknown: "월급형·매출형·건당형 세 갈래를 조건형으로만 비교한다(상태 미입력)" };
  const risk = [...we(top, "burnout", 1).map(x => `지칠 때 돈이 새는 신호: ${x}`), ...(c.base.moneyLeak?.kind === "evidence" ? c.base.moneyLeak.facts.slice(0, 2) : [])];
  // 투자 성향: 가장 강한·가장 약한 묶음의 면.
  const inv = (facet: string) => [...pick(fresh(deepLines(k, "invest", `group:${top}`, facet, lvl(top))), seed, 1).map(x => `${line(top)} → ${x}`), ...pick(fresh(deepLines(k, "invest", `group:${weak}`, facet, lvl(weak))), seed, 1).map(x => `${line(weak)} → ${x}`)];
  const rotation = gs.WEALTH.level === "strong" || d.偏財 + d.劫財 + d.傷官 > d.正財 + d.正官 + d.正印 ? "주식이라면 회전형에 끌리는 성향(편재·겁재·상관 쪽이 더 큼): 규칙으로 속도를 묶는다" : "주식이라면 장기 분산형이 맞는 성향(정재·정관·정인 쪽이 더 큼): 정해 둔 날에만 본다";
  // 타이밍: 대운 위치·다음 대운·세운 3년.
  const cd = chart.currentDayun;
  const three = years.slice(0, 3).map(x => `${x.y}년 ${ganjiOf(getAnnualPillar(x.y)).hangul} ${tenGodLabel(x.tg)}: 일 = ${DOMAIN_BY_TEN_GOD[x.tg][0]}, 돈 = ${DOMAIN_BY_TEN_GOD[x.tg][1]}`);
  const [by, bm] = c.baseDate.split("-").map(Number);
  const nextMonths = [0, 1, 2, 3].map(i => { const m = ((bm - 1 + i * 3) % 12) + 1, y = by + Math.floor((bm - 1 + i * 3) / 12); return `${y}년 ${m}월`; });
  return {
    engineGroups: ev("engineGroups", [`다섯 힘(만세력 가중값): ${groupLine}`, ...we(top, "engine", 2).map(x => `가장 강한 ${GROUP_NAME_KO[top]}으로 일하는 법: ${x}`), ...we(weak, "stop", 1).map(x => `약한 ${GROUP_NAME_KO[weak]} 쪽에서 멈추는 곳: ${x}`)], "다섯 힘의 단계는 그대로(강·보통·약). 숫자는 쓰지 않는다. 다섯 힘은 처음 한 번만 '쉬운 이름(묶음 이름)'으로 정의하고 그 뒤로는 쉬운 이름만 쓰며, 같은 힘의 강약을 장마다 되풀이하지 않는다. 성향 예시는 이 사람 상황에 맞되 누구나 겪어 봤을 장면으로"),
    monthPillar: ev("monthPillar", [`태어난 달 기둥: ${chart.pillars.month.hangul}(${chart.pillars.month.hanja})`, tgMeaning(monthStemTg, "태어난 달 하늘 글자(월간)"), monthBranchTg ? tgMeaning(monthBranchTg, "태어난 달 땅 글자(월지)") : "", ...(mbti ? [`일하는 기능: ${mbti.cognitiveFunctions.slice(0, 2).map(f => f.easy).join(" / ")}`] : [])], "태어난 달은 사회에서 일하는 자리다: 그 자리의 십성이 일하는 방식이 된다. 하늘 글자(월간)와 땅 글자(월지)의 십성을 바꿔 쓰지 않는다"),
    rhythm: ev("rhythm", [...we(top, "decision", 1).map(x => `의사결정: ${x}`), ...we(top, "burnout", 1).map(x => `번아웃 신호: ${x}`), ...we(top, "flow", 1).map(x => `몰입 리듬: ${x}`), ...we(weak, "decision", 1).map(x => `약한 쪽 보완: ${x}`)]),
    nowFit: ev("nowFit", [statusTag, ...(c.base.currentJob?.kind === "evidence" ? c.base.currentJob.facts.filter(x => /판정|성격 근거|운의 근거|쓰이는 곳|목표 직무|이 분야의 일/.test(x)).map(x => x.replace(/이 사람의 강한 힘은 [^,]*/, `이 사람의 다섯 힘은 ${groupLine}`)) : []), `태어난 계절의 일 온도: ${chart.climate.season} — ${SEASON_WORK[chart.climate.season] ?? ""}`], unknownNote ?? "판정을 첫 문장에, 맞는 점·덜 맞는 점마다 근거 하나"),
    statusNow: ev("statusNow", [statusTag, ...statusSeeds("c2", 2), ...(status === "employee" ? [...we(top, "engine", 1).map(x => `버틸 이유: ${x}`), ...we(top, "burnout", 1).map(x => `옮길 신호: ${x}`)] : status === "business" ? [`운영형·확장형: ${gs.OFFICER.level === "strong" || gs.RESOURCE.level === "strong" ? "운영형 쪽(규칙·관리로 지키는 힘이 큼)" : gs.WEALTH.level === "strong" || gs.OUTPUT.level === "strong" ? "확장형 쪽(만들고 넓히는 힘이 큼)" : "운영과 확장을 번갈아 쓰는 쪽"}`, ...roleLines.slice(0, 1)] : status === "job_seeker" ? [...we(top, "decision", 1).map(x => `탐색 순서: ${x}`), ...we(weak, "flow", 1).map(x => `공백기 루틴: ${x}`)] : status === "student" ? [...we(top, "engine", 1).map(x => `전공과 첫 직장을 잇는 힘: ${x}`)] : [...we(top, "engine", 1)])], unknownNote ?? "상태에 맞는 장면 하나와 근거 둘. 다른 상태의 장면은 쓰지 않는다"),
    sideBiz: ev("sideBiz", [statusTag, `부업·창업 적합 체크: 만드는 힘(식상) ${GROUP_LEVEL_KO[gs.OUTPUT.level]} · 값을 받는 힘(재성) ${GROUP_LEVEL_KO[gs.WEALTH.level]} · 내 방식의 힘(비겁) ${GROUP_LEVEL_KO[gs.PEER.level]}`, gs.OUTPUT.level !== "weak" && gs.WEALTH.level !== "weak" ? "맞는 쪽: 만든 것을 직접 파는 작은 일부터" : gs.OUTPUT.level !== "weak" ? "조건부: 만드는 힘은 있으니 값을 매기는 단계를 남에게 맡기거나 정해 두기" : "조건부: 혼자 시작하기보다 정해진 틀이 있는 일부터", ...statusSeeds("c3", 1)], unknownNote ?? "적합 체크는 세 줄 판정 + 맞는 조건 하나 + 안 맞는 조건 하나. 창업을 권하거나 말리지 않는다"),
    visiblePower: ev("visiblePower", [...appeal("power", 1).map(x => `보이는 힘: ${x}`), `만드는 힘(식상) ${GROUP_LEVEL_KO[gs.OUTPUT.level]}`, ...(c.hitIds.has("shinsal:TWELVE_JANGSEONGSAL") ? ["장성살: 앞에 서면 무게가 실리는 존재감"] : []), ...(c.hitIds.has("shinsal:DOHWASAL") ? ["도화: 사람의 눈길을 끄는 매력(일에서는 첫인상·발표)"] : [])]),
    pitch: ev("pitch", [statusTag, ...(status === "business" ? appeal("brand") : status === "freelancer" ? appeal("portfolio") : [...appeal("resume", 1), ...appeal("interview", 1)]).map(x => `방향: ${x}`), ...statusSeeds("c4", 2)], unknownNote ?? "문장 예시는 한두 개를 직접 지어 보여 준다(따옴표 안 한 줄). 입력에 없는 경력·연차는 쓰지 않는다"),
    payTalk: ev("payTalk", [statusTag, ...appeal("pay", 1).map(x => `내세울 근거: ${x}`), ...we(top, "decision", 1).map(x => `말할 때의 버릇: ${x}`)], "금액·퍼센트는 쓰지 않는다. 말의 순서와 근거만"),
    peopleTypes: ev("peopleTypes", people.length ? people : ["원국에 뚜렷한 십성이 적어 사람 유형은 한 갈래로만"], "십성을 사람으로: '이런 사람이 곁에 오면'으로 쓴다. 실제 동료·지인을 지어내지 않는다"),
    helpers: ev("helpers", [...(gwiin.length ? gwiin.slice(0, 3) : ["드러난 귀인 자리가 뚜렷하지 않음 → 돕는 사람은 아래 십성 쪽에서"]), ...helper]),
    roleMode: ev("roleMode", [statusTag, ...roleLines, ...partner], unknownNote ?? (status === "business" ? (noShop ? "사장일 때(팀원·고객) 쪽으로" : "사장일 때(직원·손님) 쪽으로") : status === "employee" ? "팀원일 때와 리더가 될 때를 나눠서" : "리더·팀원 어느 쪽이든 조건형으로")),
    docsLevel: ev("docsLevel", [`규칙의 힘(관성) ${GROUP_LEVEL_KO[gs.OFFICER.level]} · 배우는 힘(인성) ${GROUP_LEVEL_KO[gs.RESOURCE.level]}(만세력 가중값)`, ...docs]),
    docsTiming: ev("docsTiming", [...docYears, ...docsTrend], "해 이름은 경향으로만: 합격·승진·계약 성사를 단정하지 않는다"),
    docsStatus: ev("docsStatus", [statusTag, ...statusSeeds("c6", 2), ...(["OFFICER", "RESOURCE"] as const).flatMap(g => pick(deepLines(k, "documents", `group:${g}`, docFacet, lvl(g)), seed + 1, 1))], unknownNote),
    moneyStructure: ev("moneyStructure", [`값을 받는 힘(재성) ${GROUP_LEVEL_KO[gs.WEALTH.level]}: ${wealthKind}`, flowOW, flowPW, jaego].filter(Boolean)),
    moneyStatus: ev("moneyStatus", [statusTag, moneyStatus[status], ...statusSeeds("c7", 2)], unknownNote),
    moneyRisk: ev("moneyRisk", [...risk, "위험 신호 체크리스트는 세 줄로: 언제·무엇에·얼마나(숫자 없이)"]),
    investStyle: ev("investStyle", [...inv("savings").map(x => `예적금: ${x}`), ...inv("realEstate").slice(0, 1).map(x => `부동산·땅: ${x}`), rotation, ...inv("business").slice(0, 1).map(x => `사업 재투자: ${x}`), ...inv("self").slice(0, 1).map(x => `자기 투자: ${x}`)], "투자 권유가 아니라 성향 해석이다. 종목·상품·매수 시점·수익률은 쓰지 않는다"),
    investMistakes: ev("investMistakes", inv("mistake")),
    investPrinciples: ev("investPrinciples", [...inv("principle"), ...we(top, "decision", 1).map(x => `결정 습관에서 나온 원칙: ${x}`)], "원칙은 정확히 세 개로(셋째는 결정 습관에서)"),
    timingNow: ev("timingNow", cd ? [`지금 대운: ${cd.ganji.hangul}(${cd.ganji.hanja}) ${cd.tenGod}, ${cd.years}`, cd.phase ? `대운 안 위치: ${cd.phase.yearIndex}번째 해(${cd.phase.label}, 뒤로 ${koCount(cd.phase.yearsLeft, "해")})` : "", cd.next ? `다음 대운: ${cd.next.startYear}년부터 ${cd.next.ganji.hangul}(${cd.next.ganji.hanja}) ${cd.next.tenGod}` : ""] : ["대운 정보 없음"], "위치·남은 해는 이 값 그대로"),
    threeYears: ev("threeYears", three, "해마다 경향 한 줄. 사건을 단정하지 않는다"),
    roadmap: ev("roadmap", [`분기 이름: ${nextMonths.join(" · ")}부터 석 달씩`, `첫 달(${nextMonths[0]})에 할 일 하나 — ${c.detailJob ? `${["job_seeker", "student"].includes(status) ? "목표" : "지금 일"}(${c.detailJob})와 바로 이어지는 행동` : "1순위 직군과 이어지는 행동"}`, ...we(top, "flow", 1).map(x => `행동의 바탕: ${x}`)], "분기마다 행동 하나, 첫 달 행동 하나. '이번 달'이라 쓰지 않고 달 이름으로"),
  };
}

/**
 * 장마다 반드시 써야 하는 근거 종류(P6d G). evidence: 브리프에 있어야 할 근거 키, terms: 원고 장 본문에 하나 이상 나와야 하는 낱말(근거를 실제로 썼는지).
 */
export const CAREER_REQUIRED: Readonly<Record<string, { readonly evidence: readonly string[]; readonly terms: readonly RegExp[] }>> = {
  engine: { evidence: ["engineGroups", "monthPillar", "rhythm"], terms: [/비겁|식상|재성|관성|인성/, /태어난 달|월주|월간|월지/] },
  now: { evidence: ["nowFit", "statusNow"], terms: [/비겁|식상|재성|관성|인성|계절|조후/] },
  paths: { evidence: ["pathsGood", "jobGroups", "sideBiz"], terms: [/직장|공무원|전문직|사업|프리랜서/, /직군/, /부업|창업/] },
  show: { evidence: ["visiblePower", "pitch", "payTalk"], terms: [/나무|불|흙|쇠|물|목|화|토|금|수/, /식상/] },
  people: { evidence: ["peopleTypes", "helpers", "roleMode"], terms: [/비견|겁재|식신|상관|편재|정재|편관|정관|편인|정인/] },
  docs: { evidence: ["docsLevel", "docsTiming", "docsStatus"], terms: [/관성|인성/, /\d{4}년/] },
  money: { evidence: ["moneyStructure", "moneyStatus", "moneyRisk"], terms: [/재성|정재|편재/] },
  invest: { evidence: ["investStyle", "investMistakes", "investPrinciples"], terms: [/예적금|저축|적금/, /부동산|주식|자기 투자|사업/] },
  roadmap: { evidence: ["timingNow", "threeYears", "roadmap"], terms: [/대운/, /\d{4}년/] },
};
