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

/**
 * 그해·그달 십성별 영역 한 줄(P6b D 대운·세운: 연도·월마다 일·돈·관계·컨디션). 명리 통용 해석으로 쓴 결정론 표.
 * 브리프는 타임라인 항목 재료(material.domains)로 넣고, 작가는 영역마다 한두 문장으로 푼다.
 */
export const DOMAIN_BY_TEN_GOD: Readonly<Record<TenGod, readonly [string, string, string, string]>> = {
  比肩: ["내 이름을 걸고 직접 하려는 마음이 커짐", "같이 쓰는 돈·나눠 내는 돈에서 내 몫이 줄기 쉬움", "동료가 경쟁자처럼 느껴지기 쉬움", "체력이 받쳐 줄 때 고집이 힘이 됨"],
  劫財: ["승부욕이 올라 경쟁이 붙는 일에서 힘이 남", "지인을 통한 지출·빌려주기가 늘기 쉬움", "사람이 몰리는 만큼 비교도 따라옴", "무리해서 이기려다 지치기 쉬움"],
  食神: ["만들고 다듬는 일에 손이 잘 붙음", "작은 수입이 꾸준히 들어오기 좋음", "말투가 부드러워져 사이가 편해짐", "먹고 쉬는 데 시간이 쏠리기 쉬움"],
  傷官: ["아이디어와 말이 날카로워져 틀을 바꾸고 싶어짐", "기분 따라 쓰는 지출이 늘기 쉬움", "옳은 말이 상처가 되기 쉬움", "생각이 많아 잠이 늦어지기 쉬움"],
  偏財: ["판을 넓히고 사람을 만나는 일이 늘어남", "들어오는 돈과 나가는 돈이 함께 커짐", "활동 반경이 넓어져 새 인연이 생김", "일정이 빽빽해지기 쉬움"],
  正財: ["맡은 일을 꼼꼼히 마무리하는 힘이 커짐", "고정 수입·저축을 다지기 좋음", "약속을 지키는 쪽에서 신뢰가 쌓임", "아끼느라 쉬는 데 인색해지기 쉬움"],
  偏官: ["급한 일과 책임이 한꺼번에 몰리기 쉬움", "예상 못 한 지출에 대비가 필요함", "윗사람·규칙과 부딪치기 쉬움", "압박이 쌓여 회복 시간이 필요함"],
  正官: ["평가와 기준이 또렷해져 인정받을 기회가 생김", "고정 지출을 정리하기 좋음", "약속과 예의가 관계를 지켜 줌", "규칙적인 생활이 힘이 됨"],
  偏印: ["혼자 파고드는 공부·연구에 힘이 실림", "벌기보다 지키는 쪽이 맞음", "혼자 있고 싶어져 연락이 뜸해지기 쉬움", "생각이 많아져 몸을 움직이는 일정이 필요함"],
  正印: ["배우고 준비하는 일이 결과로 이어지기 좋음", "큰 결정보다 계획과 기록을 먼저", "도와주는 사람이 곁에 생김", "쉬는 만큼 회복이 잘 됨"],
};
export const periodDomains = (tg: TenGod) => { const [w, m, r, l] = DOMAIN_BY_TEN_GOD[tg]; return [`일: ${w}`, `돈: ${m}`, `관계: ${r}`, `컨디션: ${l}`]; };

/** 대운·세운 영역 설계: 십성 묶음별 일·돈·관계·생활 한 줄(명리 통용 해석). */
const DOMAIN_BY_GROUP: Readonly<Record<Group, readonly [string, string, string, string]>> = {
  PEER: ["내 이름을 걸고 혼자 서는 일이 늘어남", "나눠 갖는 자리가 많아 공동 지출·빌려주기 규칙이 필요함", "동료·경쟁자가 함께 늘어남", "체력이 버팀목: 운동 습관이 성과를 좌우함"],
  OUTPUT: ["만들고 보여 주는 일이 늘어남", "버는 길이 늘어나는 만큼 들어온 날 떼어 두는 규칙이 필요함", "표현이 많아져 말의 온도 조절이 중요함", "바빠지는 만큼 수면 시간을 먼저 지켜야 함"],
  WEALTH: ["결과와 숫자를 책임지는 일이 늘어남", "들어오는 돈과 나가는 돈이 함께 커짐: 한도를 먼저 정함", "현실적인 판단을 요구받는 관계가 늘어남", "일정이 빽빽해지기 쉬워 비우는 날을 미리 정함"],
  OFFICER: ["책임·직급·평가가 또렷해짐", "고정 지출이 붙기 쉬워 정기 점검이 필요함", "위계와 규칙이 있는 관계가 중심이 됨", "압박이 쌓이기 쉬워 회복 루틴이 필요함"],
  RESOURCE: ["배우고 자격을 갖추는 일이 힘이 됨", "벌기보다 지키는 쪽이 맞음: 큰 결정은 공부 뒤로", "도움을 주는 사람이 곁에 생김", "생각이 길어지기 쉬워 몸을 움직이는 일정이 필요함"],
};
const domainLines = (g: Group) => { const [w, m, r, l] = DOMAIN_BY_GROUP[g]; return [`일: ${w}`, `돈: ${m}`, `관계: ${r}`, `생활: ${l}`]; };

/** 지난 3년의 패턴 한 줄(P6c E4): 같은 묶음이 이어졌는지, 어디서 넘어갔는지. */
function pastPattern(past: readonly TimelineEntry[]): string {
  const gs = past.map(e => GROUP_OF(e.tenGod.stem));
  const word = (g?: Group) => (g ? DOMAIN_BY_GROUP[g][0] : "흐름");
  if (gs.every(g => g && g === gs[0])) return `패턴: 세 해 내내 같은 쪽 — ${word(gs[0])}`;
  if (gs.length === 3 && gs[0] === gs[1]) return `패턴: 두 해 이어진 흐름(${word(gs[0])})이 ${past[2].key}년에 바뀜(${word(gs[2])})`;
  if (gs.length === 3 && gs[1] === gs[2]) return `패턴: ${past[0].key}년의 흐름(${word(gs[0])}) 뒤로 두 해가 같은 쪽(${word(gs[1])})`;
  return `패턴: 해마다 다른 쪽으로 옮겨 감 — ${gs.map(g => word(g)).join(" → ")}`;
}

/** 종합 가족 장(P6c E2): 연주·월주(뿌리·부모 자리), 인성(돌봄을 받는 방식), 비겁(형제·또래), 식상(돌보는 방식). 가족 구성원은 조건형으로만. */
const FAMILY_TG: Readonly<Record<TenGod, string>> = {
  比肩: "나란히 서는 대등한 분위기", 劫財: "겨루며 크는 분위기", 食神: "먹이고 챙기는 분위기", 傷官: "말과 표현이 자유로운 분위기", 偏財: "바깥 활동이 많은 분위기",
  正財: "살림을 꼼꼼히 챙기는 분위기", 偏官: "책임을 먼저 배우는 엄한 분위기", 正官: "규칙과 예의를 먼저 배우는 분위기", 偏印: "혼자 생각할 틈이 많은 분위기", 正印: "보살핌과 배움을 받는 분위기",
};
export function familyDesign(saju: SajuCalcResult, groups: Readonly<Record<string, number>>): Record<string, Evidence> {
  const main = (p: "year" | "month") => saju.tenGods.hiddenStems.find(h => h.branch === saju.pillars[p].branch && h.weight >= 0.5)?.tenGod;
  const seat = (p: "year" | "month", label: string) => { const st = saju.tenGods.stems[p], br = main(p); const tgs = [...new Set([st, br].filter((x): x is TenGod => Boolean(x)))]; return tgs.length ? `${label}: ${tgs.map(t => FAMILY_TG[t]).join(" + ")}` : ""; };
  const level = (g: string) => (groups[g] ?? 0) >= 2.5 ? "strong" : (groups[g] ?? 0) > 0 ? "weak" : "none";
  const receive = { strong: "인성이 강해 돌봄과 배움을 잘 받아들이는 쪽: 기대는 법을 안다(과하면 결정을 남에게 미룸)", weak: "인성이 옅어 스스로 해결하는 쪽: 도움을 청하는 말이 늦음 → 한 줄 부탁 연습", none: "인성이 없어 받기보다 주는 쪽에 익숙함: 도움받는 것도 관계의 일로 연습" }[level("RESOURCE")];
  const give = { strong: "식상이 강해 먹이고 챙기는 손으로 마음을 표현하는 쪽(과하면 잔소리로 들림)", weak: "식상이 옅어 말보다 한 번의 행동으로 챙기는 쪽", none: "식상이 없어 챙기는 마음이 겉으로 덜 보이는 쪽: 표현 한 줄을 정해 둔다" }[level("OUTPUT")];
  const peer = { strong: "비겁이 강해 형제·또래와 대등하게 겨루며 크는 쪽(형제가 있다면 경쟁과 의리가 함께)", weak: "비겁이 옅어 또래와 거리를 두고 혼자 서는 쪽", none: "비겁이 없어 혼자 결정하는 데 익숙한 쪽" }[level("PEER")];
  const note = "가족 구성원(부모·형제 등)은 지어내지 않는다. 쓴다면 '부모님이 계시다면'처럼 조건형으로만, 과거 사건 단정 금지. 친구·모임 이야기는 관계 장 몫";
  return {
    familyRoots: { kind: "evidence", key: "familyRoots", facts: [seat("year", "뿌리 자리(태어난 해)"), seat("month", "부모·형제 자리(태어난 달)")].filter(Boolean).length ? [seat("year", "뿌리 자리(태어난 해)"), seat("month", "부모·형제 자리(태어난 달)")].filter(Boolean) : ["뿌리 자리의 기운이 뚜렷하지 않아 지금의 관계로 본다"], note },
    careReceive: { kind: "evidence", key: "careReceive", facts: [receive], note },
    careGive: { kind: "evidence", key: "careGive", facts: [give, peer], note },
  };
}

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
    ...(past.length ? { pastSummary: { kind: "evidence" as const, key: "pastSummary", facts: [`세 해의 십성: ${past.map(e => `${e.key}년 ${e.tenGod.stem}`).join(" → ")}`, pastPattern(past)], note: "세 해를 하나의 흐름(패턴)으로만 요약한다. 해마다 따로 풀지 않는다(연도 장에서 푼다). 질문형으로, 사건을 단정하지 않는다" } } : {}),
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

/** 눈여겨볼 달(P6c E5): 세 달이 어떻게 이어지는지만(월별 장 설명을 되풀이하지 않는다). keyEntries를 달 순서로. */
export function keyMonthsLink(months: readonly TimelineEntry[], keys: readonly string[]): Evidence | null {
  const picked = months.filter(e => keys.includes(e.key)).sort((a, b) => a.key.localeCompare(b.key));
  if (picked.length < 2) return null;
  const name = (e: TimelineEntry) => e.label.split(" · ")[1]?.split(" ")[0] ?? e.label;
  const gs = picked.map(e => GROUP_OF(e.tenGod.stem));
  const link = gs.every(g => g === gs[0]) ? `이어지는 점: ${picked.length}달 모두 같은 쪽 기운이라 한 흐름이 길게 이어짐(${picked[0].keywords[0]})`
    : `이어지는 점: ${name(picked[0])}에 연 '${picked[0].keywords[0]}'이 ${name(picked.at(-1)!)}의 '${picked.at(-1)!.keywords[0]}'으로 넘어감`;
  return { kind: "evidence", key: "keyMonthsLink", facts: [`세 달: ${picked.map(e => `${name(e)}(${e.tenGod.stem})`).join(" → ")}`, link], note: "월별 장에서 쓴 각 달의 설명을 되풀이하지 않는다. 세 달이 어떻게 이어지는지(앞 달이 무엇을 열고 뒤 달이 무엇을 받는지)만 쓴다" };
}

