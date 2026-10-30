/**
 * 의미 그룹·이미지 계열(P3.7 1-3).
 * - 의미 그룹: 같은 뜻의 재료(편관 trait·관성 많음·관성 과다 구조)는 한 묶음으로 세어 책 전체 2장까지만 배정한다.
 * - 이미지 계열: 같은 대상을 그린 그림(정화 촛불·정축 등불·겨울 정화 연탄불, 김장독·곳간·금고)은 책에서 대표 그림 하나만 주제로 쓴다.
 */
import { STEM_ELEMENT } from "@/lib/saju/constants";
import type { HeavenlyStem, TenGod } from "@/lib/saju/types";
import { TEN_GOD_GROUP } from "./labels";

const GROUP_WORD = /(PEER|OUTPUT|WEALTH|OFFICER|RESOURCE)/;

/** 의미 그룹 id. 십성·십성 묶음·십성 구조는 묶음(PEER…)으로, 오행은 원소로, 일간·일주는 core로 묶는다. 나머지는 id 그대로. */
export function meaningGroup(featureId: string): string {
  const [fam, key, state] = featureId.split(":");
  if (fam === "tenGod") return `tg:${TEN_GOD_GROUP[key as TenGod]}`;
  if (fam === "tenGodBalance") return `tg:${key}`;
  if (fam === "structure") {
    if (key === "WATER_WEAK_RECOVERY_NEEDED") return "el:WATER";
    const m = (key.match(/STRONG_([A-Z]+)/)?.[1] ?? key).match(GROUP_WORD);
    return m ? `tg:${m[1]}` : featureId;
  }
  if (fam === "element") return `el:${key}`;
  if (fam === "dayMaster" || fam === "dayPillar") return "core";
  return state === undefined ? featureId : `${fam}:${key}`;
}

/**
 * 그림 대상 계열(P3.8 1, P3.7 r2: 卯 식물 그림 5개·저장 그림 4개가 한 책에 섞였다). 그림의 대상 명사로 같은 대상을 묶는다.
 * 배경 낱말(비 오는·눈 내린·바위 위에서)은 넣지 않는다. 순서가 우선순위다(김장독은 '저장'이지 '밭'이 아니다).
 */
const IMAGE_OBJECTS: readonly [string, readonly string[]][] = [
  ["store", ["김장독", "장독", "쌀독", "항아리", "곳간", "창고", "금고", "저장고", "저장 구덩이", "서랍", "저금통", "통장", "궤짝", "이삿짐", "쌀가마"]],
  ["plant", ["나무", "새싹", "묘목", "덩굴", "콩나물", "화분", "텃밭", "모종", "꽃잎", "꽃봉오리", "들꽃", "달맞이꽃", "풀잎", "넝쿨", "뿌리", "씨앗", "새순", "대나무", "소나무"]],
  ["fire", ["등불", "촛불", "연탄", "모닥불", "난로", "횃불", "화로", "불꽃", "아궁이", "불씨", "장작불"]],
  ["water", ["강물", "바닷물", "샘물", "개울", "호수", "시냇물", "우물", "물길", "물동이", "분수"]],
  ["field", ["밭", "들판", "논두렁", "갯벌", "모래톱"]],
  ["metal", ["칼날", "보석", "가위", "바늘", "자물쇠", "저울", "강철"]],
  ["road", ["안장", "버스", "기차", "터미널", "정거장", "바퀴", "돛단배", "갈림길", "길목"]],
];
export function imageObject(metaphor: string): string | null {
  for (const [id, words] of IMAGE_OBJECTS) if (words.some(w => metaphor.includes(w))) return id;
  return null;
}
/**
 * 이미지 계열 id: 일간 글자를 그린 그림(일간·일주·같은 천간·조후·일간 오행)은 한 계열(self).
 * 그 밖에는 그림의 대상(저장·식물·불·물·밭·쇠·길)으로 묶고, 대상을 못 찾으면 의미 그룹과 같다.
 */
export function imageFamily(featureId: string, dayStem: HeavenlyStem, metaphor = ""): string {
  const [fam, key] = featureId.split(":");
  if (fam === "dayMaster" || fam === "dayPillar" || fam === "climate" || (fam === "stem" && key === dayStem) || (fam === "element" && key === STEM_ELEMENT[dayStem])) return "self";
  const obj = imageObject(metaphor);
  return obj ? `img:${obj}` : meaningGroup(featureId);
}
