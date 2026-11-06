import { BRANCH_MAIN_ELEMENT, STEM_ELEMENT } from "@/lib/saju/constants";
import type { EarthlyBranch, FiveElement, HeavenlyStem, Pillar, TenGod } from "@/lib/saju/types";

const STEM_KO: Record<HeavenlyStem, string> = { 甲: "갑", 乙: "을", 丙: "병", 丁: "정", 戊: "무", 己: "기", 庚: "경", 辛: "신", 壬: "임", 癸: "계" };
const BRANCH_KO: Record<EarthlyBranch, string> = { 子: "자", 丑: "축", 寅: "인", 卯: "묘", 辰: "진", 巳: "사", 午: "오", 未: "미", 申: "신", 酉: "유", 戌: "술", 亥: "해" };
export const ELEMENT_KO: Record<FiveElement, string> = { WOOD: "나무(목)", FIRE: "불(화)", EARTH: "흙(토)", METAL: "쇠(금)", WATER: "물(수)" };
/** 오행 색 코드(UI 카드용): 목 초록, 화 빨강, 토 노랑, 금 흰·회색, 수 남색. */
export const ELEMENT_HEX: Record<FiveElement, string> = { WOOD: "#2F8F5B", FIRE: "#D2493A", EARTH: "#C99A2E", METAL: "#8E9AAF", WATER: "#2C4A7A" };
export const TEN_GOD_KO: Record<TenGod, string> = { 比肩: "비견", 劫財: "겁재", 食神: "식신", 傷官: "상관", 偏財: "편재", 正財: "정재", 偏官: "편관", 正官: "정관", 偏印: "편인", 正印: "정인" };
export const TEN_GOD_GROUP: Record<TenGod, "PEER" | "OUTPUT" | "WEALTH" | "OFFICER" | "RESOURCE"> = {
  比肩: "PEER", 劫財: "PEER", 食神: "OUTPUT", 傷官: "OUTPUT", 偏財: "WEALTH", 正財: "WEALTH", 偏官: "OFFICER", 正官: "OFFICER", 偏印: "RESOURCE", 正印: "RESOURCE",
};
export const POSITION_KO = { year: "태어난 해", month: "태어난 달", day: "태어난 날", hour: "태어난 시각" } as const;

/** 합충형해의 자리 문장(P3.6 A4): 짝마다 "태어난 날과 시각 사이", 세 자리면 "태어난 해·달·날 세 자리". */
export function pairWhere(pairs: readonly (readonly (keyof typeof POSITION_KO)[])[]): string {
  const short = (x: keyof typeof POSITION_KO) => POSITION_KO[x].replace("태어난 ", "");
  return pairs.map(p => p.length === 2 ? `태어난 ${josa(short(p[0]), "과와")} ${short(p[1])} 사이`
    : `태어난 ${p.map(short).join("·")} ${p.length === 3 ? "세" : "네"} 자리`).join(", ");
}

/** 받침에 맞는 조사(은/는, 이/가, 을/를, 과/와). "불(화)"처럼 괄호 앞이 한글이면 그 글자, "丙午(병오)"처럼 한자면 괄호 안 글자 기준. */
export function josa(word: string, pair: "은는" | "이가" | "을를" | "과와"): string {
  const m = word.match(/^(.*?)\(([^)]*)\)$/);
  const ch = (m && /[가-힣]$/.test(m[1]) ? m[1] : m ? m[2] : word).slice(-1);
  const code = ch.charCodeAt(0) - 0xac00;
  const batchim = code >= 0 && code <= 11171 ? code % 28 !== 0 : false;
  return word + (batchim ? pair[0] : pair[1]);
}
/** 글자 하나 + 한글 읽기: "亥(해)". 조사는 josa로 읽기 기준. */
export const glyphLabel = (ch: string) => `${ch}(${STEM_KO[ch as HeavenlyStem] ?? BRANCH_KO[ch as EarthlyBranch] ?? ch})`;
export const ganjiOf = (p: Pillar) => ({ hanja: p.stem + p.branch, hangul: STEM_KO[p.stem] + BRANCH_KO[p.branch] });
export const ganjiLabel = (p: Pillar) => `${p.stem}${p.branch}(${STEM_KO[p.stem]}${BRANCH_KO[p.branch]})`;
export const colorsOf = (p: Pillar) => ({
  stem: { element: STEM_ELEMENT[p.stem], hex: ELEMENT_HEX[STEM_ELEMENT[p.stem]] },
  branch: { element: BRANCH_MAIN_ELEMENT[p.branch], hex: ELEMENT_HEX[BRANCH_MAIN_ELEMENT[p.branch]] },
});
export const tenGodLabel = (t: TenGod) => `${TEN_GOD_KO[t]}(${t})`;

/** 관계 이름(P6b B-3): 용어를 먼저, 괄호에 쉬운 뜻. 그림 별명은 쓰지 않는다. */
export const REL_PLAIN: Readonly<Record<string, string>> = {
  STEM_HAP: "천간합(하늘 글자끼리 끌려 묶임)", YUKHAP: "육합(땅 글자끼리 맞물림)", SAMHAP: "삼합(세 글자가 한 기운으로 모임)", BANGHAP: "방합(한 계절 세 글자가 모임)",
  CHUNG: "충(마주 서서 부딪침)", HYEONG: "형(서로 깎고 다듬는 마찰)", PA: "파(맞춰 둔 것에 금이 감)", HAE: "해(가까운 사이의 작은 서운함)", WONJIN: "원진(이유 없이 거슬리는 엇박자)",
  // 최종판3 7: 천간충(엔진 STEM_CHUNG_TABLE 甲庚·乙辛·丙壬·丁癸). 궁합 두 사람 관계 목록이 쓴다.
  STEM_CHUNG: "천간충(하늘 글자끼리 마주 서서 부딪침)",
};
/** 반합(최종판3 7): 삼합 세 글자 중 두 글자만 모인 것. "완성"이 아니라 반쯤 묶인 것이다. */
export const HALF_HAP_PLAIN = "반합(세 글자 중 두 글자만 모여 반쯤 묶임)";
/** 삼형 세 글자(寅巳申·丑戌未)가 두 사람 글자에 다 모였을 때(최종판3 7: 삼형은 한 줄로). 두 글자만이면 형(REL_PLAIN.HYEONG). */
export const SAMHYEONG_PLAIN = "삼형(세 땅 글자가 서로 깎고 다듬는 마찰)";
/**
 * 반합 뜻 문장(최종판3 7): 지식 DB 삼합 배지 줄("물의 팀이 완성되어 … 크게 모이는 흐름")은 세 글자가 다 모였을 때의 말이라,
 * 두 글자만 모인 반합에는 "반쯤 묶여 … 모이기 시작하는"으로 바꿔 쓴다("완성" 금지). 궁합 관계 목록·대운·세운 카드가 같이 쓴다.
 */
export const halfHapLine = (line: string) => line
  .replace(/의 팀이 완성되어|의 기운이 절반쯤 모여/, "의 기운이 반쯤 묶여").replace(/팀이 완성되어|기운이 절반쯤 모여/, "기운이 반쯤 묶여")
  .replace(/크게 모이는/, "모이기 시작하는").replace(/세 글자가 한 팀이 되어 한 가지 힘이 크게 뭉치는/, "세 글자 중 두 글자만 모여 한 가지 힘이 반쯤 뭉치는");
/** 관계 쉬운 문장(relationsPlain): "왼쪽 글자와 오른쪽 글자가 {관계 이름(쉬운 뜻)} 관계예요. {뜻}이에요."
 * 궁합 관계 쪽(두 사람 자리끼리, P6b D)과 대운·세운 카드(들어오는 글자와 내 자리, P6c-ui2 i)가 같이 쓴다. half: 세 글자 중 두 글자만 만난 삼합.
 * name: 관계 이름을 직접 줄 때(삼형 세 글자 등). */
export const relationPlain = (left: string, right: string, kind: string, half: boolean, line: string, name?: string) =>
  `${josa(left, "과와")} ${josa(right, "이가")} ${name ?? (half ? HALF_HAP_PLAIN : REL_PLAIN[kind] ?? kind)} 관계예요.${line ? ` ${line}이에요.` : ""}`;

/**
 * 대운 표기(최종판3 8): 6개 상품의 브리프(currentDayun·timeline.cycles·연도 카드 머리 문장)·Book(대운 표·부록)이 모두 이 함수 하나를 쓴다.
 * 형식: "무진 대운: 2027년 5월 무렵부터 (대운수 27)". 교운 시각은 엔진 정밀 계산(customerDayun, lunar-javascript sect 2) 그대로 쓰고 다시 계산하지 않는다.
 * - 시작: 정확한 출생시간이면 교운 시각(startSolarKst)의 연·월, 대략·미상이면 가능한 범위의 연·월(같은 달이면 한 달, 다르면 "4~6월").
 * - 대운수·나이(운영 Q 8-1, 덕짱님 결정 2026-11-06): 둘 다 dayunStartManAge 하나 — 그 대운이 시작되는 때의 실제 만 나이 X.
 *   「(대운수 X)」와 「만 X~(X+9)세」가 대운마다 같은 값이다(대운마다 10씩 다르다). birthDate가 없을 때만(연·월만 쓰는 호출)
 *   엔진 startAge로 센 X(교운 해 − 출생 해)를 두 곳에 같이 쓴다. 이 변경 전 책은 저장된 표기(전통 날수 ÷ 3) 그대로다.
 * - 기간(최종 A-4): 끝은 다음 대운의 교운 연·월(「2029년 11월 무렵까지」) — 연도만으로 끊지 않는다(엔진 endYear는 표기에 쓰지 않음).
 */
export type DayunCycleLike = { readonly index: number; readonly stem: HeavenlyStem; readonly branch: EarthlyBranch; readonly startYear: number; readonly endYear: number; readonly startAge: number;
  readonly startSolarKst: string | null; readonly startSolarRange: { readonly earliestKst: string; readonly latestKst: string } };
export type DayunLabel = { readonly name: string; readonly start: string; readonly month: string; readonly daeunsu: number; readonly ages: string; readonly years: string; readonly line: string; readonly until: string; readonly period: string };
const dayunMonth = (c: Pick<DayunCycleLike, "startSolarKst" | "startSolarRange">) => {
  const from = c.startSolarKst ?? c.startSolarRange.earliestKst, to = c.startSolarKst ?? c.startSolarRange.latestKst;
  const m1 = Number(from.slice(5, 7)), m2 = Number(to.slice(5, 7)), year = Number(from.slice(0, 4));
  return { year, month: m1 === m2 || Number(to.slice(0, 4)) !== year ? `${m1}월` : `${m1}~${m2}월` };
};
export function dayunLabel(c: DayunCycleLike, birthDate?: string, next?: DayunCycleLike): DayunLabel {
  const name = `${STEM_KO[c.stem]}${BRANCH_KO[c.branch]} 대운`;
  const { year, month } = dayunMonth(c);
  const daeunsu = birthDate ? dayunStartManAge(birthDate, c) : c.startAge - 1;
  const start = `${year}년 ${month} 무렵부터`;
  // 끝: 다음 대운 교운 연·월. 다음 대운이 계산 범위 밖이면 같은 달 10년 뒤.
  const end = next ? dayunMonth(next) : { year: year + 10, month };
  const until = `${end.year}년 ${end.month} 무렵까지`;
  return { name, start, month, daeunsu, ages: `만 ${daeunsu}~${daeunsu + 9}세`, years: `${c.startYear}~${c.endYear}`, line: `${name}: ${start} (대운수 ${daeunsu})`, until, period: `${start} ${until}` };
}
/** 교운 시각(ms): 정확한 출생시간이면 그 시각, 대략·미상이면 가능한 범위의 가운데. */
export const dayunStartMs = (c: Pick<DayunCycleLike, "startSolarKst" | "startSolarRange">) =>
  c.startSolarKst ? Date.parse(c.startSolarKst) : (Date.parse(c.startSolarRange.earliestKst) + Date.parse(c.startSolarRange.latestKst)) / 2;
/**
 * 대운수 = 그 대운이 시작되는 때의 실제 만 나이(운영 Q 8-1). 시작 때는 dayunStartMs(엔진 교운 시각, 대략·미상은 범위 가운데) 그대로,
 * 생일이 지났는지는 한국 날짜(KST)로 본다(2월 29일생은 평년 3월 1일에 한 살). 대운 줄·나이 구간·정답지·관리자 화면이 모두 이 함수 하나를 쓴다.
 */
export function dayunStartManAge(birthDate: string, c: Pick<DayunCycleLike, "startSolarKst" | "startSolarRange">): number {
  const at = new Date(dayunStartMs(c) + 9 * 3_600_000).toISOString().slice(0, 10);
  const [by, bm, bd] = birthDate.slice(0, 10).split("-").map(Number), [y, m, d] = at.split("-").map(Number);
  return y - by - (m < bm || (m === bm && d < bd) ? 1 : 0);
}
/** 지금 대운(최종 A-5): 기준 시각(발행 시각)과 교운 시각을 비교해 고른다(연도로 고르지 않는다). 첫 대운 전이면 undefined. */
export function currentDayunAt<T extends Pick<DayunCycleLike, "index" | "startSolarKst" | "startSolarRange">>(cycles: readonly T[], atMs: number): T | undefined {
  let cur: T | undefined;
  for (const c of [...cycles].sort((a, b) => a.index - b.index)) if (dayunStartMs(c) <= atMs) cur = c;
  return cur;
}
/** 두 시각 사이 개월 수(내림). */
export function monthsBetween(fromMs: number, toMs: number): number {
  const a = new Date(fromMs + 9 * 3_600_000), b = new Date(toMs + 9 * 3_600_000);
  let m = (b.getUTCFullYear() - a.getUTCFullYear()) * 12 + (b.getUTCMonth() - a.getUTCMonth());
  if (b.getUTCDate() < a.getUTCDate() || (b.getUTCDate() === a.getUTCDate() && b.getTime() % 86_400_000 < a.getTime() % 86_400_000)) m -= 1;
  return Math.max(0, m);
}
/** 남은 기간 말(최종 A-4): 교운 시각 기준. 「약 3년 2개월」·「약 5개월」·「한 달이 안 남음」. */
export function remainingKo(fromMs: number, toMs: number): string {
  const m = monthsBetween(fromMs, toMs), y = Math.floor(m / 12), r = m % 12;
  return m === 0 ? "한 달이 안 남음" : y === 0 ? `약 ${r}개월` : `약 ${y}년${r ? ` ${r}개월` : ""}`;
}
/** 부록 한 줄(운영 Q 8-1): 대운수는 그 대운이 시작되는 때의 만 나이(dayunStartManAge). 이 변경 전 책은 저장된 옛 문장(날수 ÷ 3) 그대로. */
export const DAYUN_AGE_NOTE = "대운수는 그 대운이 시작될 때의 만 나이예요. 대운이 바뀌는 때는 태어난 시각부터 절기가 바뀌는 시각까지 따져서 계산했어요.";
/** 한 자리 수 + 고유어 단위(해·달·번·명·가지)는 고유어 수로(P6e 19: "남은 해는 1해" → "한 해"). 10 이상은 숫자. */
const NATIVE_NUM = ["", "한", "두", "세", "네", "다섯", "여섯", "일곱", "여덟", "아홉"];
export const koCount = (n: number, unit: string) => (Number.isInteger(n) && n >= 1 && n <= 9 ? `${NATIVE_NUM[n]} ${unit}` : `${n}${unit}`);
/** 다섯 힘의 쉬운 이름(P6e 14): 첫 등장에 "내 방식의 힘(비겁)", 그 뒤로는 쉬운 이름만. */
export const GROUP_EASY: Readonly<Record<"PEER" | "OUTPUT" | "WEALTH" | "OFFICER" | "RESOURCE", string>> = { PEER: "내 방식의 힘", OUTPUT: "만드는 힘", WEALTH: "값을 받는 힘", OFFICER: "규칙의 힘", RESOURCE: "배우는 힘" };
export const GROUP_EASY_BY_NAME: Readonly<Record<string, string>> = { 비겁: "내 방식의 힘", 식상: "만드는 힘", 재성: "값을 받는 힘", 관성: "규칙의 힘", 인성: "배우는 힘" };
