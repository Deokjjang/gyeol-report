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
export const ganjiOf = (p: Pillar) => ({ hanja: p.stem + p.branch, hangul: STEM_KO[p.stem] + BRANCH_KO[p.branch] });
export const ganjiLabel = (p: Pillar) => `${p.stem}${p.branch}(${STEM_KO[p.stem]}${BRANCH_KO[p.branch]})`;
export const colorsOf = (p: Pillar) => ({
  stem: { element: STEM_ELEMENT[p.stem], hex: ELEMENT_HEX[STEM_ELEMENT[p.stem]] },
  branch: { element: BRANCH_MAIN_ELEMENT[p.branch], hex: ELEMENT_HEX[BRANCH_MAIN_ELEMENT[p.branch]] },
});
export const tenGodLabel = (t: TenGod) => `${TEN_GOD_KO[t]}(${t})`;
