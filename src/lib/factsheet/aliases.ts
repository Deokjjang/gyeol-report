/**
 * 정답지 별칭(최종판3 1): 같은 대상의 표현을 한 이름으로 묶는다. 지식 DB 용어(이름·한자·별칭)와 엔진 표에서 만든다(손 목록은 자리 말·짧은 꼴만).
 *  - 신살·귀인: 천덕/천덕귀인/天德/天德貴人 → 「천덕귀인」
 *  - 자리: 일지/태어난 날 땅 글자/배우자 자리 → dayBranch
 *  - 관계: 丑戌未 삼형/축술미형/축술미 → 글자 묶음 {丑,戌,未} + 종류
 */
import type { Knowledge } from "@/lib/brief/knowledge";
import type { Slot } from "./build";

const KO2HAN: Readonly<Record<string, string>> = { 갑: "甲", 을: "乙", 병: "丙", 정: "丁", 무: "戊", 기: "己", 경: "庚", 신: "辛", 임: "壬", 계: "癸" };
const BR2HAN: Readonly<Record<string, string>> = { 자: "子", 축: "丑", 인: "寅", 묘: "卯", 진: "辰", 사: "巳", 오: "午", 미: "未", 신: "申", 유: "酉", 술: "戌", 해: "亥" };
export const stemHan = (ko: string) => KO2HAN[ko];
export const branchHan = (ko: string) => BR2HAN[ko];
const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** 짧은 꼴이 일상어와 겹치는 이름(짧은 꼴은 별칭에 넣지 않는다). */
const SHORT_DENY = new Set(["망신", "장성", "태극", "재고", "천의", "천문", "학당", "문창", "겁", "재", "천", "지", "년", "월", "육해", "고신", "과숙", "금여"]);
export type ShinsalAlias = { readonly name: string; readonly re: RegExp };

/** 지식 DB 신살·귀인 이름 → 별칭 꼴(긴 것부터). 이름은 정답지 ShinsalFact.name과 같은 꼴(괄호 앞 한글). */
export function shinsalAliases(k: Pick<Knowledge, "features">): ShinsalAlias[] {
  const byName = new Map<string, Set<string>>();
  for (const f of k.features.values()) {
    if (f.family !== "shinsal" && f.family !== "gwiin") continue;
    const m = f.name.match(/^([가-힣]+)(?:\(([一-鿿]+)\))?/); if (!m) continue;
    const name = m[1], han = m[2] ?? "";
    const set = byName.get(name) ?? new Set<string>(); byName.set(name, set);
    set.add(name); if (han) set.add(han);
    const short = name.replace(/(귀인|대살|관살|살|성|록)$/, "");
    if (short !== name && short.length >= 2 && !SHORT_DENY.has(short)) set.add(short);
    if (han.length > 2) { const hs = han.replace(/(貴人|大殺|關殺|殺|星|祿)$/, ""); if (hs.length >= 2 && hs !== han) set.add(hs); }
    for (const a of ((f as unknown as { aliases?: string[] }).aliases ?? [])) { const a2 = String(a).replace(/\(.*$/, "").trim(); if (/^[가-힣]{2,8}$/.test(a2) && !SHORT_DENY.has(a2)) set.add(a2); }
  }
  // 망신살은 십이신살·일반 두 id가 같은 이름(정답지에서 둘 다 「망신살」)이다.
  return [...byName].map(([name, set]) => ({ name, re: new RegExp(`(?<![가-힣])(${[...set].sort((a, b) => b.length - a.length).map(escape).join("|")})(?=$|[^가-힣]|[은는이가을를의와과에도로만이라](?:$|[^가-힣]|[가-힣]))`) }));
}

/** 자리 말 → 칸. 짧은 한자어(일지·월간 등)와 풀어 쓴 말. 「시간」은 일상어라 한자·풀어 쓴 말만. */
export const POSITION_WORDS: readonly { readonly re: RegExp; readonly slots: readonly Slot[]; readonly label: string }[] = [
  { re: /일간|태어난 날의? (하늘 글자|천간|윗글자)|나 자신을 뜻하는 글자|일간 자리/, slots: ["dayStem"], label: "일간" },
  { re: /일지|태어난 날의? (땅 글자|지지|아랫글자)|배우자 ?(자리|궁)|배우자궁|일지 자리/, slots: ["dayBranch"], label: "일지" },
  { re: /월간|태어난 달의? (하늘 글자|천간)/, slots: ["monthStem"], label: "월간" },
  { re: /월지|태어난 달의? (땅 글자|지지)|계절 자리/, slots: ["monthBranch"], label: "월지" },
  { re: /[연년]간|태어난 해의? (하늘 글자|천간)/, slots: ["yearStem"], label: "연간" },
  { re: /[연년]지|태어난 해의? (땅 글자|지지)/, slots: ["yearBranch"], label: "연지" },
  { re: /시간\(時干\)|태어난 시(각)?의? (하늘 글자|천간)/, slots: ["hourStem"], label: "시간" },
  { re: /시지|태어난 시(각)?의? (땅 글자|지지)|자녀 ?(자리|궁)|자녀궁/, slots: ["hourBranch"], label: "시지" },
];

/** 십이운성(두 글자 이름은 그대로, 한 글자는 한자·「운성」 문맥일 때만). */
export const STAGE_TWO = ["장생", "목욕", "관대", "건록", "제왕"] as const;
export const STAGE_ONE: Readonly<Record<string, string>> = { 쇠: "衰", 병: "病", 사: "死", 묘: "墓", 절: "絶", 태: "胎", 양: "養" };
export const STAGE_HAN: Readonly<Record<string, string>> = { 長生: "장생", 沐浴: "목욕", 冠帶: "관대", 建祿: "건록", 帝旺: "제왕", 衰: "쇠", 病: "병", 死: "사", 墓: "묘", 絶: "절", 胎: "태", 養: "양" };

/** 관계 글자 묶음 + 종류(한글·한자). 「축술미 삼형」「축술미형」「丑戌未」「축미충」「자축합」「병임충」. */
export const BRANCH_REL = /(?<![가-힣])([자축인묘진사오미신유술해]{2,3}|[子丑寅卯辰巳午未申酉戌亥]{2,3}) ?(삼형살?|삼형|자형|상형|형살|형|충|육합|삼합|반합|방합|합|파|해|원진)(?=[이가은는을를의와과도에로만]|[^가-힣]|$)/g;
export const STEM_REL = /(?<![가-힣])([갑을병정무기경신임계]{2}|[甲乙丙丁戊己庚辛壬癸]{2}) ?(천간합|천간충|합|충)(?=[이가은는을를의와과도에로만]|[^가-힣]|$)/g;
export const REL_KIND: Readonly<Record<string, readonly string[]>> = {
  삼형: ["HYEONG"], 삼형살: ["HYEONG"], 형: ["HYEONG"], 형살: ["HYEONG"], 자형: ["HYEONG"], 상형: ["HYEONG"], 충: ["CHUNG", "STEM_CHUNG"], 육합: ["YUKHAP"], 삼합: ["SAMHAP"], 반합: ["SAMHAP"], 방합: ["BANGHAP"],
  합: ["YUKHAP", "SAMHAP", "BANGHAP", "STEM_HAP"], 파: ["PA"], 해: ["HAE"], 원진: ["WONJIN"], 천간합: ["STEM_HAP"], 천간충: ["STEM_CHUNG"],
};
/** 한글 글자 묶음 → 한자 글자들(지지 우선; 「신」은 지지 申, 천간 문맥은 STEM_REL). */
export const branchChars = (s: string) => [...s].map(c => BR2HAN[c] ?? c);
export const stemChars = (s: string) => [...s].map(c => KO2HAN[c] ?? c);

/** 오행 이름 → 엔진 오행. */
export const ELEMENT_RE = /(?<![가-힣])(나무|불|흙|쇠|물|목|화|토|금|수)(?:\((?:목|화|토|금|수|木|火|土|金|水)\))?(?=[이가은는도의을를와과에]|\s|기운)/g;
export const ELEMENT_OF: Readonly<Record<string, "WOOD" | "FIRE" | "EARTH" | "METAL" | "WATER">> = { 나무: "WOOD", 목: "WOOD", 불: "FIRE", 화: "FIRE", 흙: "EARTH", 토: "EARTH", 쇠: "METAL", 금: "METAL", 물: "WATER", 수: "WATER" };
