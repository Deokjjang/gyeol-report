/**
 * 의미 그룹·이미지 계열(P3.7 1-3).
 * - 의미 그룹: 같은 뜻의 재료(편관 trait·관성 많음·관성 과다 구조)는 한 묶음으로 세어 책 전체 2장까지만 배정한다.
 * - 이미지 계열: 같은 대상을 그린 그림(정화 촛불·정축 등불·겨울 정화 연탄불)은 책에서 대표 그림 하나만 주제로 쓴다.
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

/** 이미지 계열 id: 일간 글자를 그린 그림(일간·일주·같은 천간·조후·일간 오행)은 한 계열. 그 밖에는 의미 그룹과 같다. */
export function imageFamily(featureId: string, dayStem: HeavenlyStem): string {
  const [fam, key] = featureId.split(":");
  if (fam === "dayMaster" || fam === "dayPillar" || fam === "climate" || (fam === "stem" && key === dayStem) || (fam === "element" && key === STEM_ELEMENT[dayStem])) return "self";
  return meaningGroup(featureId);
}
