/**
 * ZW-1 자미두수 계산 기준(0부 확정, 덕짱 2026-11-24). 기준은 이 파일 한 곳에 둔다 — 어댑터(chart.ts)가 이 표로 강제하고,
 * 계산 라이브러리 출력이 이 표와 다르면 오류를 낸다(시험이 잡는다).
 *
 * | 항목 | 기준 |
 * | 유파 | 삼합파 안성(algorithm default) + 생년 사화. 비성 사화 없음 |
 * | 음력 | 한국 음력(KASI, korean-lunar-calendar). 사주 엔진의 음력 입력 경로(lunar-javascript, 중국 농력)와 다르다 — 고객 경로는 양력만 |
 * | 해 경계 | 음력 설(사주는 입춘) |
 * | 윤달 | 1~15일 그 달, 16일~ 다음 달(lunar.ts effectiveLunarMonth 한 곳) |
 * | 시진 · 날짜 | 사주 엔진(태양시 · 통자시) 그대로. 사주 시지 = 자미 시진 |
 * | 사화 | 통행표. 경 · 무 · 임년은 학파차이(중주파 무 태양과 · 경 천부과 · 임 천부과, 북파 경 천상기) |
 * | 밝기 | 7단(묘왕득리평불함) → 3단. 全書 卷三과 다른 1칸 · 全書 빈칸 42칸은 근거로 쓰지 않음(brightnessBasis) |
 * | 대한 | 명궁부터 국수 세(세는 나이)에 시작, 양남음녀 순행 · 음남양녀 역행, 고객에게는 연도 범위 |
 */
import type { Branch, Brightness7, MajorStarId, MinorStarId, MutagenId, StarId, Stem } from "./ids";

/** 계산 기준이 바뀌면 올린다. 책 스냅샷에 저장한다. */
export const ZIWEI_CALC_VERSION = "ziwei-v1-sanhe-kasi" as const;
/** 계산 라이브러리 버전(내부 기록 전용, 고객 화면 · 상품 · 마케팅에 이름을 쓰지 않는다). package.json과 같아야 한다(시험). */
export const ZIWEI_LIBRARY_VERSION = "2.6.5" as const;

export const ZIWEI_BASIS = Object.freeze({
  school: "sanhe",
  mutagenScope: "birth-year",
  lunarCalendar: "kasi",
  yearBoundary: "lunar-new-year",
  leapMonth: "split-15",
  hourRule: "saju-solar-unified",
  mutagenTable: "common-v1",
  brightnessTable: "iztro-2.6.5",
  decadal: "life-palace-nominal-age",
} as const);

/** 생년 사화 표: 천간 → [화록, 화권, 화과, 화기]. 통행표(「甲廉破武陽 … 癸破巨陰貪」). */
export const MUTAGEN_TABLE: Readonly<Record<Stem, readonly [StarId, StarId, StarId, StarId]>> = {
  甲: ["yeomjeong", "pagun", "mugok", "taeyang"],
  乙: ["cheongi", "cheonryang", "jami", "taeeum"],
  丙: ["cheondong", "cheongi", "munchang", "yeomjeong"],
  丁: ["taeeum", "cheondong", "cheongi", "geomun"],
  戊: ["tamrang", "taeeum", "ubil", "cheongi"],
  己: ["mugok", "tamrang", "cheonryang", "mungok"],
  庚: ["taeyang", "mugok", "taeeum", "cheondong"],
  辛: ["geomun", "taeyang", "mungok", "munchang"],
  壬: ["cheonryang", "jami", "jwabo", "mugok"],
  癸: ["pagun", "geomun", "taeeum", "tamrang"],
};
export const MUTAGEN_ORDER: readonly MutagenId[] = ["rok", "gwon", "gwa", "gi"];
/**
 * 학파차이 해(표가 유파마다 다른 천간)와 다른 표. 고객 문구 · DB confidence에 쓴다(유파 이름은 내부 기록).
 * 근거(0부 조사, 2026-11-24): 중주파(왕정지) 무 태양과 · 경 천부과 · 임 천부과 — ziweifu.com/ziweizatan/1886.html, tradiculture.com 사화표 해설,
 * fortel-ziweidoushu(중주파 구현) starDerivative. 북파 경 = 陽武同相(천동과 · 천상기) — ziweifu 같은 글, 108s.tw/article/info/95.
 * 경 = 陽武同陰(천동과 · 태음기)은 전서 일부 판본 · 민파로 전함 — zh.wikipedia 紫微斗數, ziweifu(위키문헌 全書 卷二 원문은 통행표 「庚日武陰同」).
 */
export const MUTAGEN_SCHOOL_VARIANTS: Readonly<Partial<Record<Stem, readonly { readonly school: string; readonly mutagen: MutagenId; readonly star: StarId }[]>>> = {
  戊: [{ school: "중주파", mutagen: "gwa", star: "taeyang" }],
  庚: [{ school: "중주파", mutagen: "gwa", star: "cheonbu" }, { school: "북파", mutagen: "gwa", star: "cheondong" }, { school: "북파", mutagen: "gi", star: "cheonsang" }, { school: "전서 일부 판본", mutagen: "gwa", star: "cheondong" }, { school: "전서 일부 판본", mutagen: "gi", star: "taeeum" }],
  壬: [{ school: "중주파", mutagen: "gwa", star: "cheonbu" }],
};

/** 밝기 표(7단). 배열 0번 = 寅, 1번 = 卯 … 11번 = 丑(계산 라이브러리 2.6.5 표와 같다 — 시험이 맞댄다). */
/** 「·」 = 그 칸 밝기 없음. */
const B = (s: string): readonly (Brightness7 | null)[] => [...s].map(c => (c === "·" ? null : (c as Brightness7)));
export const BRIGHTNESS_TABLE: Readonly<Partial<Record<MajorStarId | MinorStarId, readonly (Brightness7 | null)[]>>> = {
  jami: B("왕왕득왕묘묘왕왕득왕평묘"),
  cheongi: B("득왕리평묘함득왕리평묘함"),
  taeyang: B("왕묘왕왕왕득득평불함함불"),
  mugok: B("득리묘평왕묘득리묘평왕묘"),
  cheondong: B("리평평묘함불왕평평묘왕불"),
  yeomjeong: B("묘평리함평리묘평리함평리"),
  cheonbu: B("묘득묘득왕묘득왕묘득묘묘"),
  taeeum: B("왕함함함불불리왕왕묘묘묘"),
  tamrang: B("평리묘함왕묘평리묘함왕묘"),
  geomun: B("묘묘함왕왕불묘묘함왕왕불"),
  cheonsang: B("묘함득득묘득묘함득득묘묘"),
  cheonryang: B("묘묘묘함묘왕함득묘함묘왕"),
  chilsal: B("묘왕묘평왕묘묘왕묘평왕묘"),
  pagun: B("득함왕평묘왕득함왕평묘왕"),
  munchang: B("함리득묘함리득묘함리득묘"),
  mungok: B("평왕득묘함왕득묘함왕득묘"),
  hwaseong: B("묘리함득묘리함득묘리함득"),
  yeongseong: B("묘리함득묘리함득묘리함득"),
  gyeongyang: B("·함묘·함묘·함묘·함묘"),
  tara: B("함·묘함·묘함·묘함·묘"),
};
export const brightnessIndex = (branch: Branch): number => ("寅卯辰巳午未申酉戌亥子丑".indexOf(branch));

/**
 * 『紫微斗數全書』 卷三 「論諸星同垣各司所宜」 14주성 묘왕 기록(위키문헌 원문 그대로, 간체 원문을 번체 별 이름으로만 바꿈, 地 = 得).
 * 출처: https://zh.wikisource.org/wiki/紫微斗數全書/卷三 (원문 297·363·375·437·355·474·325·384·453·490·335·341·511·528행).
 * 이 기록과 같은 칸 = 통용, 다른 칸(천기 辰) = 학파차이, 기록 없는 칸(42칸) = 추정.
 */
export const ZHUANSHU_BRIGHTNESS: Readonly<Record<MajorStarId, string>> = {
  jami: "庙丑未午 旺寅申卯酉巳亥 平子",
  cheongi: "庙子午 旺辰酉 陷丑未",
  taeyang: "庙卯 旺寅辰巳午 陷子",
  mugok: "庙辰戌丑未 旺子午 平巳亥",
  cheondong: "庙巳亥 旺子申 陷午",
  yeomjeong: "庙寅申 利辰戌丑未 陷巳亥",
  cheonbu: "庙子丑未寅辰戌 旺午酉 地卯巳申亥",
  taeeum: "庙亥子丑 旺寅酉戌 陷卯辰巳",
  tamrang: "庙辰戌丑未 旺子午 陷巳亥",
  geomun: "庙寅申卯酉 旺子午巳亥 陷辰戌",
  cheonsang: "庙子午丑寅申 地辰戌巳亥未 陷卯酉",
  cheonryang: "庙子午寅卯辰戌 旺丑未 地酉 陷申巳亥",
  chilsal: "庙辰戌丑未寅申 旺子午卯酉 平巳亥",
  pagun: "庙子午 旺辰戌丑未 陷卯酉",
};
const ZHUANSHU_LEVEL: Readonly<Record<string, Brightness7>> = { 庙: "묘", 旺: "왕", 地: "득", 得: "득", 利: "리", 平: "평", 闲: "평", 陷: "함" };
/** 全書 기록 → 칸별 7단(기록 없는 칸은 없음). */
export function zhuanshuBrightness(star: MajorStarId): Partial<Record<Branch, Brightness7>> {
  const out: Partial<Record<Branch, Brightness7>> = {};
  for (const group of ZHUANSHU_BRIGHTNESS[star].split(" ")) {
    const level = ZHUANSHU_LEVEL[group[0]];
    if (!level) throw new Error(`全書 밝기 등급을 읽을 수 없음: ${star} ${group}`);
    for (const b of group.slice(1)) out[b as Branch] = level;
  }
  return out;
}
export type BrightnessBasis = "통용" | "학파차이" | "추정";
/** 이 칸의 밝기 근거. 「통용」만 본문 · 카드에서 밝기 말을 쓴다. 보좌 · 살성 밝기는 대조한 표가 없어 「추정」. */
export function brightnessBasisOf(star: StarId, branch: Branch, raw: Brightness7 | null): BrightnessBasis | null {
  if (!raw) return null;
  if (!(star in ZHUANSHU_BRIGHTNESS)) return "추정";
  const ref = zhuanshuBrightness(star as MajorStarId)[branch];
  if (!ref) return "추정";
  return ref === raw ? "통용" : "학파차이";
}
