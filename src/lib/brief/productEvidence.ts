/**
 * 상품별 핵심 설계 근거(P6b D): 연애(만나야 할 사람·조합·관계 상태별 지향점), 대운(지난 3년·10년 영역별 설계), 세운(올해 영역별 설계).
 * 모두 원국·운에서 결정론으로 만든 사실 문장이다. 작가는 facts만 사실로 쓰고 note는 쓰는 법이다.
 */
import type { MbtiProfile } from "@/data/knowledge-v5/schema";
import type { SajuCalcResult, TenGod } from "@/lib/saju/types";
import type { ElementState } from "./chart";
import type { FactProfile } from "./facts";
import type { Knowledge } from "./knowledge";
import { ELEMENT_KO, josa, TEN_GOD_GROUP } from "./labels";
import type { Material, TimelineEntry } from "./schema";

type Evidence = Extract<Material, { kind: "evidence" }>;
type Group = "PEER" | "OUTPUT" | "WEALTH" | "OFFICER" | "RESOURCE";
const GROUP_OF = (label: string): Group | undefined => { const tg = label.match(/\((.+)\)/)?.[1] as TenGod | undefined; return tg ? TEN_GOD_GROUP[tg] as Group : undefined; };

/** 배우자 별·배우자 자리 십성이 말하는 사람의 모습(명리 통용 해석, 성별 규칙은 브리프의 배우자 별과 같다). */
const STAR_TYPE: Readonly<Record<TenGod, string>> = {
  正財: "생활을 함께 차곡차곡 꾸리는 성실한 사람(정재)", 偏財: "활동 반경이 넓고 새 세상을 보여 주는 사람(편재)",
  正官: "약속을 지키고 기준이 분명한 믿음직한 사람(정관)", 偏官: "추진력이 있고 결단이 빠른 사람(편관)",
  比肩: "친구처럼 대등하게 어깨를 나란히 하는 사람(비견)", 劫財: "승부욕이 있고 같이 겨루며 크는 사람(겁재)",
  食神: "잘 먹이고 챙기며 분위기를 편하게 하는 사람(식신)", 傷官: "말이 통하고 재치가 있는 사람(상관)",
  偏印: "자기 세계가 깊어 대화가 깊어지는 사람(편인)", 正印: "말없이 보살피고 기다려 주는 사람(정인)",
};

export function loveDesign(saju: SajuCalcResult, k: Knowledge, gender: "MALE" | "FEMALE" | null, st: ElementState, mbti: MbtiProfile | null, facts: FactProfile): Record<string, Evidence> {
  const d = saju.tenGods.distribution;
  const spouse: readonly TenGod[] = gender === "MALE" ? ["正財", "偏財"] : gender === "FEMALE" ? ["正官", "偏官"] : [];
  const star = spouse.filter(t => d[t] > 0).sort((a, b) => d[b] - d[a])[0];
  const palace = saju.tenGods.hiddenStems.find(h => h.branch === saju.pillars.day.branch && h.weight >= 0.5)?.tenGod;
  const lack = st.lacking[0] ?? st.missing[0];
  const good = mbti?.conventionalCompat.filter(c => c.fit === "좋음").slice(0, 2) ?? [];
  const hard = mbti?.conventionalCompat.filter(c => c.fit === "노력").slice(0, 2) ?? [];
  const excess = st.excess[0];
  const types = [
    ...(lack ? [`부족한 ${josa(ELEMENT_KO[lack], "을를")} 채워 주는 사람 — 명리: 내 원국에 ${josa(ELEMENT_KO[lack], "이가")} 약해 그 기운이 넉넉한 사람 곁에서 균형이 잡힘`] : []),
    ...(star ? [`${STAR_TYPE[star]} — 명리: 배우자 별로 보는 기운 가운데 이 사람에게 가장 뚜렷한 쪽`] : spouse.length ? ["서로의 영역을 지켜 주는 독립적인 사람 — 명리: 배우자 별이 드러난 자리에 없어 정해진 틀보다 스스로 고르는 인연"] : []),
    ...(palace ? [`${STAR_TYPE[palace]} — 명리: 배우자 자리(태어난 날의 땅 글자) 속 기운`] : []),
    ...(good[0] ? [`${good[0].type} 같은 사람 — 성향: ${good[0].why}`] : []),
  ].slice(0, 3);
  const state = facts.relationship;
  const goal = state === "single" ? ["지금은 만남의 통로를 넓히는 때: 늘 가던 자리 밖의 모임 하나를 정해 두고, 고르는 기준은 한 줄로 적어 둔다", "호감이 생기면 연락 간격을 일정하게 지켜 상대가 내 속도를 읽게 한다"]
    : state === "dating" ? ["지금은 둘만의 규칙을 만드는 때: 연락 리듬과 다툼이 생겼을 때의 순서(식히는 시간·돌아오는 말)를 미리 정한다", "서로 다른 속도를 고치려 하기보다 어느 쪽이 먼저 움직일지 번갈아 정한다"]
    : state === "married" ? ["지금은 생활의 규칙을 다듬는 때: 돈·집안일·혼자 있는 시간의 몫을 말로 나눈다", "고마움은 크게 한 번보다 작게 자주 말한다"]
    : ["관계 상태와 상관없이: 내 연애 속도를 먼저 알고 상대에게 미리 말해 두는 것이 출발점"];
  return {
    matchTypes: { kind: "evidence", key: "matchTypes", facts: types.length ? types : ["뚜렷하게 부족한 기운이 없어 나와 속도가 비슷한 사람이 편한 쪽"], note: "유형마다 근거 하나와 장면 하나. 만남 시기·결혼 시기는 쓰지 않는다" },
    combos: { kind: "evidence", key: "combos", facts: [
      ...good.map(c => `조화가 잘 맞는 조합: ${c.type} — ${c.why}`),
      ...hard.map(c => `맞추려면 노력이 드는 조합: ${c.type} — ${c.why}`),
      ...(excess ? [`이미 많은 ${josa(ELEMENT_KO[excess], "을를")} 더 보태는 사람과는 같은 쪽으로 쏠려 다툼이 커지기 쉬운 조합`] : []),
    ], note: "MBTI 조합은 통념이다. 어려운 조합도 만나면 안 된다고 쓰지 않고 맞추는 법을 붙인다" },
    stateGoal: { kind: "evidence", key: "stateGoal", facts: goal, note: "입력된 관계 상태에 맞춰 쓴다. 상대·사건을 지어내지 않는다" },
  };
}

/** 대운·세운 영역 설계: 십성 묶음별 일·돈·관계·생활 한 줄(명리 통용 해석). */
const DOMAIN_BY_GROUP: Readonly<Record<Group, readonly [string, string, string, string]>> = {
  PEER: ["내 이름을 걸고 혼자 서는 일이 늘어남", "나눠 갖는 자리가 많아 공동 지출·빌려주기 규칙이 필요함", "동료·경쟁자가 함께 늘어남", "체력이 버팀목: 운동 습관이 성과를 좌우함"],
  OUTPUT: ["만들고 보여 주는 일이 늘어남", "버는 길이 늘어나는 만큼 들어온 날 떼어 두는 규칙이 필요함", "표현이 많아져 말의 온도 조절이 중요함", "바빠지는 만큼 수면 시간을 먼저 지켜야 함"],
  WEALTH: ["결과와 숫자를 책임지는 일이 늘어남", "들어오는 돈과 나가는 돈이 함께 커짐: 한도를 먼저 정함", "현실적인 판단을 요구받는 관계가 늘어남", "일정이 빽빽해지기 쉬워 비우는 날을 미리 정함"],
  OFFICER: ["책임·직급·평가가 또렷해짐", "고정 지출이 붙기 쉬워 정기 점검이 필요함", "위계와 규칙이 있는 관계가 중심이 됨", "압박이 쌓이기 쉬워 회복 루틴이 필요함"],
  RESOURCE: ["배우고 자격을 갖추는 일이 힘이 됨", "벌기보다 지키는 쪽이 맞음: 큰 결정은 공부 뒤로", "도움을 주는 사람이 곁에 생김", "생각이 길어지기 쉬워 몸을 움직이는 일정이 필요함"],
};
const domainLines = (g: Group) => { const [w, m, r, l] = DOMAIN_BY_GROUP[g]; return [`일: ${w}`, `돈: ${m}`, `관계: ${r}`, `생활: ${l}`]; };

export function majorDesign(entries: readonly TimelineEntry[], cycles: NonNullable<import("./schema").Brief["timeline"]>["cycles"], thisYear: number): Record<string, Evidence> {
  const past = entries.filter(e => e.period === "past");
  const cur = cycles.find(c => c.current), next = cycles.find(c => !c.current && Number(c.years.slice(0, 4)) > thisYear);
  const g = cur ? GROUP_OF(cur.tenGod) : undefined, ng = next ? GROUP_OF(next.tenGod) : undefined;
  const decade = [
    ...(cur && g ? [`지금 대운 ${cur.ganji}(${cur.years}): ${cur.tenGod}의 10년`, ...domainLines(g)] : []),
    ...(next && ng ? [`다음 대운 ${next.ganji}(${next.years}): ${next.tenGod}의 10년 — 바뀌는 점: ${DOMAIN_BY_GROUP[ng][0]}`] : []),
  ];
  // 사실이 없으면 근거를 만들지 않는다(빈 근거는 그 절을 비운다).
  return {
    ...(past.length ? { pastSummary: { kind: "evidence" as const, key: "pastSummary", facts: past.map(e => `${e.key}년: ${e.tenGod.stem}의 해(${e.keywords.join("·")})`), note: "지난 3년을 한 장으로 짧게 돌아본다: 해마다 한두 문장, 질문형으로. 사건을 단정하지 않는다" } } : {}),
    ...(decade.length ? { decade: { kind: "evidence" as const, key: "decade", facts: decade, note: "앞으로 10년을 일·돈·관계·생활 네 영역으로 나눠 설계한다. 영역마다 근거(대운 십성)와 할 일 하나" } } : {}),
  };
}

export function annualDesign(yearEntry: TimelineEntry | undefined, months: readonly TimelineEntry[]): Record<string, Evidence> {
  const g = yearEntry ? GROUP_OF(yearEntry.tenGod.stem) : undefined;
  const top = [...months].sort((a, b) => b.flow.score - a.flow.score || a.key.localeCompare(b.key));
  return {
    yearPlan: { kind: "evidence", key: "yearPlan", facts: [
      ...(yearEntry ? [`올해 ${yearEntry.label}: ${yearEntry.tenGod.stem}의 해(${yearEntry.keywords.join("·")})`] : []),
      ...(g ? domainLines(g) : []),
      ...(top[0] ? [`흐름이 가장 크게 오르는 달: ${top[0].label}`] : []),
      ...(top.at(-1) && top.at(-1)!.flow.score < top[0].flow.score ? [`가장 조용한 달: ${top.at(-1)!.label}`] : []),
    ], note: "올해 전체 설계도: 영역마다 근거 하나와 할 일 하나. '가장 ~한 달'은 이 줄의 달만 그렇게 부른다" },
  };
}

