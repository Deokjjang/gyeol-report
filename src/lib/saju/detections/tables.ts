/**
 * v5 감지 규칙표 (P2). 근거: 지식 DB strengthRules.rule 문장, 정책 docs/manseryeok-policy.md §5.
 * 표는 데이터만 담는다. 판정 로직은 relations.ts·twelveStages.ts·climate.ts·extraShinsal.ts.
 */
import { STEM_COMBINATIONS, BRANCH_COMBINATIONS, BRANCH_CLASHES } from "../constants";
import type { EarthlyBranch as B, FiveElement, HeavenlyStem as S } from "../types";
import type { Season, TwelveStage } from "./types";

type Pair<T> = readonly [T, T];
type Triple = readonly [B, B, B];

/** 천간합 化氣. 짝 순서는 constants.STEM_COMBINATIONS(=지식 DB variants.key). */
const STEM_HAP_ELEMENT: Record<string, FiveElement> = { 甲己: "EARTH", 乙庚: "METAL", 丙辛: "WATER", 丁壬: "WOOD", 戊癸: "FIRE" };
export const STEM_HAP_TABLE: readonly { pair: Pair<S>; element: FiveElement }[] = STEM_COMBINATIONS.map((pair) => ({
  pair,
  element: STEM_HAP_ELEMENT[pair.join("")],
}));

/** 육합 합화 오행. 午未는 火/土 학파차이라 미지정. */
const YUKHAP_ELEMENT: Record<string, FiveElement | undefined> = { 子丑: "EARTH", 寅亥: "WOOD", 卯戌: "FIRE", 辰酉: "METAL", 巳申: "WATER", 午未: undefined };
export const YUKHAP_TABLE: readonly { pair: Pair<B>; element?: FiveElement }[] = BRANCH_COMBINATIONS.map((pair) => ({
  pair,
  element: YUKHAP_ELEMENT[pair.join("")],
}));

export const CHUNG_TABLE: readonly Pair<B>[] = BRANCH_CLASHES;
/** 파(破): 子酉·丑辰·寅亥·卯午·巳申·戌未. */
export const PA_TABLE: readonly Pair<B>[] = [["子", "酉"], ["丑", "辰"], ["寅", "亥"], ["卯", "午"], ["巳", "申"], ["戌", "未"]];
/** 해(害, 육해): 子未·丑午·寅巳·卯辰·申亥·酉戌. */
export const HAE_TABLE: readonly Pair<B>[] = [["子", "未"], ["丑", "午"], ["寅", "巳"], ["卯", "辰"], ["申", "亥"], ["酉", "戌"]];
/** 원진: 子未·丑午·寅酉·卯申·辰亥·巳戌 (지식 DB shinsal:WONJIN). */
export const WONJIN_TABLE: readonly Pair<B>[] = [["子", "未"], ["丑", "午"], ["寅", "酉"], ["卯", "申"], ["辰", "亥"], ["巳", "戌"]];
/** 귀문: 子酉·丑午·寅未·卯申·辰亥·巳戌 (월-일·일-시 인접만). */
export const GWIMUN_TABLE: readonly Pair<B>[] = [["子", "酉"], ["丑", "午"], ["寅", "未"], ["卯", "申"], ["辰", "亥"], ["巳", "戌"]];

/** 삼합: [생지, 왕지, 고지]. 반합 = 왕지 포함 2자(생지+고지 2자는 기본 미포함). */
export const SAMHAP_TABLE: readonly { members: Triple; element: FiveElement }[] = [
  { members: ["申", "子", "辰"], element: "WATER" },
  { members: ["寅", "午", "戌"], element: "FIRE" },
  { members: ["巳", "酉", "丑"], element: "METAL" },
  { members: ["亥", "卯", "未"], element: "WOOD" },
];
/** 방합: 3자 완성만 성립. season = 그 방합의 계절(월지 계절이 같으면 strong). */
export const BANGHAP_TABLE: readonly { members: Triple; element: FiveElement; season: Season }[] = [
  { members: ["寅", "卯", "辰"], element: "WOOD", season: "spring" },
  { members: ["巳", "午", "未"], element: "FIRE", season: "summer" },
  { members: ["申", "酉", "戌"], element: "METAL", season: "autumn" },
  { members: ["亥", "子", "丑"], element: "WATER", season: "winter" },
];
/** 형: 삼형 寅巳申·丑戌未(3자 full, 2자 partial), 상형 子卯, 자형 辰辰·午午·酉酉·亥亥. */
export const SAMHYEONG_TABLE: readonly Triple[] = [["寅", "巳", "申"], ["丑", "戌", "未"]];
export const SANGHYEONG_TABLE: readonly Pair<B>[] = [["子", "卯"]];
export const JAHYEONG_BRANCHES: readonly B[] = ["辰", "午", "酉", "亥"];

/** 월지 → 계절. */
export const SEASON_BY_BRANCH: Record<B, Season> = {
  寅: "spring", 卯: "spring", 辰: "spring",
  巳: "summer", 午: "summer", 未: "summer",
  申: "autumn", 酉: "autumn", 戌: "autumn",
  亥: "winter", 子: "winter", 丑: "winter",
};

/** 십이운성 長生 자리. 양간 순행·음간 역행, 戊=丙·己=丁(화토동법). */
export const CHANGSAENG_BRANCH: Record<S, B> = {
  甲: "亥", 丙: "寅", 戊: "寅", 庚: "巳", 壬: "申",
  乙: "午", 丁: "酉", 己: "酉", 辛: "子", 癸: "卯",
};
export const STAGE_ORDER: readonly TwelveStage[] = ["長生", "沐浴", "冠帶", "建祿", "帝旺", "衰", "病", "死", "墓", "絶", "胎", "養"];

/** 괴강: 庚辰·庚戌·壬辰·戊戌 (壬戌·戊辰 미채택). */
export const GOEGANG_PILLARS: readonly string[] = ["庚辰", "庚戌", "壬辰", "戊戌"];
/** 양인: 양간만(자평). 음간은 학파차이로 미채택. */
export const YANGIN_BRANCH: Partial<Record<S, B>> = { 甲: "卯", 丙: "午", 戊: "午", 庚: "酉", 壬: "子" };
/** 천문성: 亥·卯·未·戌 (寅·酉 추가설 미채택). */
export const CHEONMUN_BRANCHES: readonly B[] = ["亥", "卯", "未", "戌"];
/** 음착양차 12간지. */
export const EUMCHAK_YANGCHA_PILLARS: readonly string[] = ["丙子", "丁丑", "戊寅", "辛卯", "壬辰", "癸巳", "丙午", "丁未", "戊申", "辛酉", "壬戌", "癸亥"];
/** 천라지망: 본 DB 명명 辰巳=천라, 戌亥=지망 (고전 일부는 반대). */
export const CHEONRA_JIMANG_PAIRS: readonly { pair: Pair<B>; name: "천라" | "지망" }[] = [
  { pair: ["辰", "巳"], name: "천라" },
  { pair: ["戌", "亥"], name: "지망" },
];
/** 건록(祿): 甲寅 乙卯 丙戊巳 丁己午 庚申 辛酉 壬亥 癸子. 암록·금여 강약 판단용. */
export const ROK_BRANCH: Record<S, B> = { 甲: "寅", 乙: "卯", 丙: "巳", 丁: "午", 戊: "巳", 己: "午", 庚: "申", 辛: "酉", 壬: "亥", 癸: "子" };
/** 암록: 건록과 육합하는 지지. */
export const AMROK_BRANCH: Record<S, B> = { 甲: "亥", 乙: "戌", 丙: "申", 丁: "未", 戊: "申", 己: "未", 庚: "巳", 辛: "辰", 壬: "寅", 癸: "丑" };
/** 복성귀인 현대 표(丁=酉, 亥 이설 미채택). */
export const BOKSEONG_BRANCH: Record<S, B> = { 甲: "寅", 乙: "丑", 丙: "子", 丁: "酉", 戊: "申", 己: "未", 庚: "午", 辛: "巳", 壬: "辰", 癸: "卯" };
/** 금여: 祿前二辰. */
export const GEUMYEO_BRANCH: Record<S, B> = { 甲: "辰", 乙: "巳", 丙: "未", 丁: "申", 戊: "未", 己: "申", 庚: "戌", 辛: "亥", 壬: "丑", 癸: "寅" };
/** 문곡: 현대 통용표(문창 지지와 충하는 자리). */
export const MUNGOK_BRANCH: Record<S, B> = { 甲: "亥", 乙: "子", 丙: "寅", 丁: "卯", 戊: "寅", 己: "卯", 庚: "巳", 辛: "午", 壬: "申", 癸: "酉" };
/** 재고: 재성 오행의 묘고. */
export const JAEGO_BRANCH: Record<S, B> = { 甲: "辰", 乙: "辰", 戊: "辰", 己: "辰", 丙: "丑", 丁: "丑", 庚: "未", 辛: "未", 壬: "戌", 癸: "戌" };
/** 천의: 월지 바로 앞 지지(寅월→丑 … 丑월→子). */
export const CHEON_EUI_BRANCH: Record<B, B> = {
  寅: "丑", 卯: "寅", 辰: "卯", 巳: "辰", 午: "巳", 未: "午", 申: "未", 酉: "申", 戌: "酉", 亥: "戌", 子: "亥", 丑: "子",
};

/* ───────────── 조후 (40항목, climate-0*.json rule 문장을 표로 옮김) ───────────── */

/**
 * 조후 필요 기운 한 줄. stem이 천간(년·월·시)에 드러나거나(visible), branches 중 하나가 지지에 있으면 충족.
 * visible=false면 지지로만 센다(예 午 속 丁을 "丙·巳·午" 규칙의 일부로 셀 때).
 */
export type ClimateNeedRow = {
  readonly stem: S;
  readonly role: "primary" | "secondary" | "support";
  readonly branches: readonly B[];
  readonly visible: boolean;
};

/** level 판정에 쓰는 사실. found(r) = 해당 role 중 하나라도 충족. */
export type ClimateFacts = {
  readonly P: boolean;
  readonly S: boolean;
  readonly U: boolean;
  readonly month: B;
  /** 천간(년·월·시) 투출 여부(일간 제외). */
  vis(...stems: S[]): boolean;
  /** 지지에 있는가(시간 미상이면 시지 제외). */
  br(...branches: B[]): boolean;
  /** 글자 수: 천간 + 지지 본기 오행(일간 제외). */
  n(...elements: FiveElement[]): number;
  /** 천간 글자 수(일간 제외) + 같은 본기 지지 수. 예 乙 2개 이상 → stemCount("乙") + 卯. */
  count(stem: S): number;
};
export type ClimateLevel = "strong" | "medium" | "weak";
export type ClimateRule = { readonly needs: readonly ClimateNeedRow[]; readonly level: (f: ClimateFacts) => ClimateLevel; readonly rule: string };

const need = (stem: S, role: "P" | "S" | "U", branches = "", visible = true): ClimateNeedRow => ({
  stem,
  role: role === "P" ? "primary" : role === "S" ? "secondary" : "support",
  branches: [...branches] as B[],
  visible,
});
const both = (f: ClimateFacts): ClimateLevel => (f.P && f.S ? "strong" : f.P || f.S ? "medium" : "weak");
/** 戌月 화고 1단계 완화(weak→medium). */
const relaxXu = (f: ClimateFacts, level: ClimateLevel): ClimateLevel => (f.month === "戌" && level === "weak" ? "medium" : level);

export const CLIMATE_TABLE: Record<`${S}:${Season}`, ClimateRule> = {
  "甲:spring": { rule: "庚·丙 둘 다 strong, 하나 medium, 없으면 weak", needs: [need("庚", "P", "申"), need("丙", "S", "巳寅")], level: both },
  "甲:summer": { rule: "癸(子) strong, 보조(壬·亥·丑·辰)만 medium, 수 없음 weak", needs: [need("癸", "P", "子"), need("壬", "U", "亥"), need("癸", "U", "丑辰", false)], level: (f) => (f.P ? "strong" : f.U ? "medium" : "weak") },
  "甲:autumn": { rule: "丁+庚 strong, 丁 또는 丙 대체 medium, 丁 없으면 weak", needs: [need("丁", "P", "午"), need("庚", "S", "申"), need("丙", "U", "巳")], level: (f) => (f.P && f.S ? "strong" : f.P || f.U ? "medium" : "weak") },
  "甲:winter": { rule: "丙 strong, 丁·庚 medium(화 0이면 weak)", needs: [need("丙", "P", "巳寅"), need("庚", "S", "申"), need("丁", "U", "午")], level: (f) => (f.P ? "strong" : f.U ? "medium" : "weak") },
  "乙:spring": { rule: "丙·癸 둘 다 strong, 하나 medium, 없으면 weak", needs: [need("丙", "P", "巳寅"), need("癸", "S", "子辰")], level: both },
  "乙:summer": { rule: "癸(子) strong, 보조(壬·亥·辰·丑)만 medium, 수 없음 weak", needs: [need("癸", "P", "子"), need("壬", "U", "亥"), need("癸", "U", "辰丑", false)], level: (f) => (f.P ? "strong" : f.U ? "medium" : "weak") },
  "乙:autumn": { rule: "癸(子·亥)·丙(巳·午) 둘 다 strong, 하나 medium, 없으면 weak", needs: [need("癸", "P", "子"), need("壬", "P", "亥", false), need("丙", "S", "巳"), need("丁", "S", "午", false)], level: both },
  "乙:winter": { rule: "丙(巳·午·寅) strong, 丁만 medium, 화 0 weak", needs: [need("丙", "P", "巳寅"), need("丁", "P", "午", false), need("丁", "U")], level: (f) => (f.P ? "strong" : f.U ? "medium" : "weak") },
  "丙:spring": { rule: "壬(亥) strong, 癸·子 medium, 수 0 weak. 庚은 목 많을 때 보조", needs: [need("壬", "P", "亥"), need("癸", "U", "子"), need("庚", "U", "申")], level: (f) => (f.P ? "strong" : f.vis("癸") || f.br("子") ? "medium" : "weak") },
  "丙:summer": { rule: "壬+庚 strong, 壬만·癸·子 medium, 수 0 weak", needs: [need("壬", "P", "亥"), need("庚", "S", "申"), need("癸", "U", "子")], level: (f) => (f.P && f.S ? "strong" : f.P || f.vis("癸") || f.br("子") ? "medium" : "weak") },
  "丙:autumn": { rule: "壬(亥·申)·甲(寅·亥) 둘 다 strong, 하나 medium, 없으면 weak. 戌月 1단계 완화", needs: [need("壬", "P", "亥申"), need("甲", "S", "寅亥")], level: (f) => relaxXu(f, both(f)) },
  "丙:winter": { rule: "甲 없고 수≥3 weak, 壬·甲 있고 수 제어(수<3 또는 戊) strong", needs: [need("壬", "P", "亥"), need("甲", "S", "寅亥"), need("戊", "U", "辰戌")], level: (f) => {
    const water = f.n("WATER");
    if (!f.S && water >= 3) return "weak";
    if (f.P && f.S && (water < 3 || f.U)) return "strong";
    return f.P || f.S ? "medium" : "weak";
  } },
  "丁:spring": { rule: "甲+庚 strong, 庚 없고 乙≥2 weak(습목), 하나 medium", needs: [need("甲", "P", "寅"), need("庚", "S", "申巳"), need("戊", "U")], level: (f) => (f.P && f.S ? "strong" : !f.S && f.count("乙") >= 2 ? "weak" : f.P || f.S ? "medium" : "weak") },
  "丁:summer": { rule: "壬+庚 strong, 壬 medium, 수 0 weak(과열)", needs: [need("壬", "P", "亥申"), need("庚", "S", "申巳")], level: (f) => (f.P && f.S ? "strong" : f.P || f.n("WATER") > 0 ? "medium" : "weak") },
  "丁:autumn": { rule: "甲+庚 strong, 甲 없고 금≥3 weak, 하나 medium. 戌月 1단계 완화", needs: [need("甲", "P", "寅亥"), need("庚", "S", "申")], level: (f) => relaxXu(f, f.P && f.S ? "strong" : !f.P && f.n("METAL") >= 3 ? "weak" : f.P || f.S ? "medium" : "weak") },
  "丁:winter": { rule: "甲+庚 strong, 甲 없고 수≥3 weak, 온기(丙·巳·午·未) 보조", needs: [need("甲", "P", "寅亥"), need("庚", "S", "申"), need("丙", "U", "巳"), need("丁", "U", "午未", false)], level: (f) => (f.P && f.S ? "strong" : !f.P && f.n("WATER") >= 3 ? "weak" : f.P || f.S || f.U ? "medium" : "weak") },
  "戊:spring": { rule: "丙+癸 strong, 丙 없고 목≥3 weak, 하나 medium. 甲 보조", needs: [need("丙", "P", "寅巳"), need("癸", "S", "子辰"), need("甲", "U")], level: (f) => (f.P && f.S ? "strong" : !f.P && f.n("WOOD") >= 3 ? "weak" : f.P || f.S ? "medium" : "weak") },
  "戊:summer": { rule: "壬·癸 투출+지지 뿌리(亥·子·申·辰) strong, 수 기운 medium, 수 0 weak", needs: [need("壬", "P", "亥申"), need("癸", "P", "子辰"), need("甲", "U"), need("丙", "U")], level: (f) => (f.vis("壬", "癸") && f.br("亥", "子", "申", "辰") ? "strong" : f.P ? "medium" : "weak") },
  "戊:autumn": { rule: "丙+癸 strong, 丙 없고 금≥3 weak, 하나 medium", needs: [need("丙", "P", "寅巳"), need("癸", "S", "子辰")], level: (f) => (f.P && f.S ? "strong" : !f.P && f.n("METAL") >= 3 ? "weak" : f.P || f.S ? "medium" : "weak") },
  "戊:winter": { rule: "丙(寅·巳·午)+甲 strong, 丙 또는 화 medium, 丙·화 0 weak", needs: [need("丙", "P", "寅巳"), need("丁", "P", "午", false), need("甲", "S", "寅亥")], level: (f) => (f.P && f.S ? "strong" : f.P || f.n("FIRE") > 0 ? "medium" : "weak") },
  "己:spring": { rule: "볕(丙·巳·午)+습기(癸·子·亥·辰) strong, 하나 medium, 둘 다 없고 목≥3 weak", needs: [need("丙", "P", "巳"), need("丁", "P", "午", false), need("癸", "S", "子辰"), need("壬", "S", "亥", false), need("甲", "U")], level: (f) => (f.P && f.S ? "strong" : f.P || f.S ? "medium" : f.n("WOOD") >= 3 ? "weak" : "medium") },
  "己:summer": { rule: "癸(子·亥·丑·辰) strong, 화≥3+수 0 weak", needs: [need("癸", "P", "子丑辰"), need("壬", "P", "亥", false), need("丙", "S")], level: (f) => (f.P ? "strong" : f.n("FIRE") >= 3 && f.n("WATER") === 0 ? "weak" : "medium") },
  "己:autumn": { rule: "볕(丙·巳·午)+습기(癸·子·亥·辰·丑) strong, 금≥3+화 0 weak", needs: [need("丙", "P", "巳"), need("丁", "P", "午", false), need("癸", "S", "子辰丑"), need("壬", "S", "亥", false)], level: (f) => (f.P && f.S ? "strong" : !f.P && f.n("METAL") >= 3 && f.n("FIRE") === 0 ? "weak" : f.P || f.S ? "medium" : "weak") },
  "己:winter": { rule: "볕(丙·巳·午·寅)+甲 strong, 볕 medium, 화 0+수≥3 weak", needs: [need("丙", "P", "巳寅"), need("丁", "P", "午", false), need("甲", "S", "寅")], level: (f) => (f.P && f.S ? "strong" : f.P ? "medium" : f.n("WATER") >= 3 ? "weak" : f.S ? "medium" : "weak") },
  "庚:spring": { rule: "丁(午·未·戌)+甲 strong, 丁 또는 丙 medium, 화 0 weak", needs: [need("丁", "P", "午未戌"), need("甲", "S", "寅"), need("丙", "U", "巳寅")], level: (f) => (f.P && f.S ? "strong" : f.P || f.U ? "medium" : "weak") },
  "庚:summer": { rule: "壬·癸(亥·子·丑·辰) strong, 수 0+화≥3 weak", needs: [need("壬", "P", "亥"), need("癸", "P", "子丑辰")], level: (f) => (f.P ? "strong" : f.n("FIRE") >= 3 ? "weak" : "medium") },
  "庚:autumn": { rule: "丁(午·未·戌)+甲(寅) strong, 하나 medium, 둘 다 0 weak", needs: [need("丁", "P", "午未戌"), need("甲", "S", "寅")], level: both },
  "庚:winter": { rule: "화(丁·丙·巳·午·寅·戌)+甲 strong, 화 medium, 화 0 weak", needs: [need("丁", "P", "午戌"), need("丙", "P", "巳寅"), need("甲", "S", "寅")], level: (f) => (f.P && f.S ? "strong" : f.P ? "medium" : "weak") },
  "辛:spring": { rule: "壬(亥·子·申)+己(丑·辰) strong, 하나 medium, 둘 다 0 weak", needs: [need("壬", "P", "亥申"), need("癸", "P", "子", false), need("己", "S", "丑"), need("戊", "S", "辰", false)], level: both },
  "辛:summer": { rule: "壬·癸(亥·子·申·丑·辰) strong, 화≥3+수 0 weak. 己 보조", needs: [need("壬", "P", "亥申"), need("癸", "P", "子丑辰"), need("己", "U")], level: (f) => (f.P ? "strong" : f.n("FIRE") >= 3 ? "weak" : "medium") },
  "辛:autumn": { rule: "壬 투간 또는 亥·子·申 strong, 癸만 medium, 壬癸亥子 없음 weak. 甲·寅 가점", needs: [need("壬", "P", "亥申"), need("癸", "P", "子", false), need("癸", "U"), need("甲", "U", "寅")], level: (f) => (f.P ? "strong" : f.vis("癸") ? "medium" : "weak") },
  "辛:winter": { rule: "丙 투간 또는 巳·午 strong, 丁만 medium, 丙丁巳午 없음 weak. 壬 가점", needs: [need("丙", "P", "巳"), need("丁", "P", "午", false), need("丁", "U"), need("壬", "U", "亥")], level: (f) => (f.P ? "strong" : f.vis("丁") ? "medium" : "weak") },
  "壬:spring": { rule: "庚辛 투간 또는 申酉·亥子 strong, 庚辛申酉 없고 목≥3 weak", needs: [need("庚", "P", "申"), need("辛", "P", "酉"), need("壬", "P", "亥", false), need("癸", "P", "子", false), need("戊", "U"), need("丙", "U")], level: (f) => (f.P ? "strong" : !f.vis("庚", "辛") && !f.br("申", "酉") && f.n("WOOD") >= 3 ? "weak" : "medium") },
  "壬:summer": { rule: "庚辛 투간 또는 申酉亥子 strong, 금수≤2+화토≥4 weak", needs: [need("庚", "P", "申"), need("辛", "P", "酉"), need("壬", "P", "亥", false), need("癸", "P", "子", false), need("癸", "U")], level: (f) => (f.P ? "strong" : f.n("METAL", "WATER") <= 2 && f.n("FIRE", "EARTH") >= 4 ? "weak" : "medium") },
  "壬:autumn": { rule: "甲 투간 또는 寅卯 strong, 甲乙寅卯 없고 금≥3 weak. 戊 가점", needs: [need("甲", "P", "寅"), need("乙", "P", "卯", false), need("戊", "U")], level: (f) => (f.P ? "strong" : !f.vis("乙") && f.n("METAL") >= 3 ? "weak" : "medium") },
  "壬:winter": { rule: "丙 투간 또는 巳·午·寅 strong, 丁만 medium, 丙丁巳午寅 없음 weak. 戊 가점", needs: [need("丙", "P", "巳寅"), need("丁", "P", "午", false), need("丁", "U"), need("戊", "U")], level: (f) => (f.P ? "strong" : f.vis("丁") ? "medium" : "weak") },
  "癸:spring": { rule: "辛·庚 투간 또는 申酉亥子 strong, 庚辛申酉 없고 목≥3 weak. 丙 가점", needs: [need("辛", "P", "酉"), need("庚", "P", "申"), need("壬", "P", "亥", false), need("癸", "P", "子", false), need("丙", "U")], level: (f) => (f.P ? "strong" : !f.vis("庚", "辛") && !f.br("申", "酉") && f.n("WOOD") >= 3 ? "weak" : "medium") },
  "癸:summer": { rule: "庚辛 투간 또는 申酉亥子 strong, 금수≤2 weak. 壬 가점", needs: [need("庚", "P", "申"), need("辛", "P", "酉"), need("壬", "P", "亥", false), need("癸", "P", "子", false), need("壬", "U")], level: (f) => (f.P ? "strong" : f.n("METAL", "WATER") <= 2 ? "weak" : "medium") },
  "癸:autumn": { rule: "辛 투간+丙(巳·午) strong, 丙丁巳午 없고 금≥3 weak, 庚만 medium", needs: [need("辛", "P"), need("丙", "S", "巳"), need("丁", "S", "午", false), need("庚", "U")], level: (f) => (f.P && f.S ? "strong" : !f.S && !f.vis("丁") && f.n("METAL") >= 3 ? "weak" : "medium") },
  "癸:winter": { rule: "丙 투간 또는 巳·午 strong, 丁만 medium, 丙丁巳午 없음 weak. 辛 가점", needs: [need("丙", "P", "巳"), need("丁", "P", "午", false), need("丁", "U"), need("辛", "U")], level: (f) => (f.P ? "strong" : f.vis("丁") ? "medium" : "weak") },
};
