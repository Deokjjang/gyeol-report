/**
 * ZW-1 자미두수 판정 준비(대운의 dayunReadiness와 같은 꼴, 호출 0).
 * - 시각을 정확히 알거나 시진(대략 시간대)만 알면 만든다.
 * - 시각을 전혀 모르면 만들 수 없다 → 「시간대를 고르세요」(선택지 = 12시진). 입력 단계에서 막는다.
 * - 한국 음력 변환 범위(생일 1900-01-31 ~ 2050-12-30) 밖이면 만들 수 없다.
 * 성별이 없거나 입력이 이상하면 이 함수가 판정하지 않는다(ok — 다른 입력 검사가 맡는다).
 */
import { birthTimeSlotOptions, normalizeBirthTimePrecision } from "@/lib/saju/birthTimePrecisionTypes";
import { ZIWEI_SOLAR_RANGE, type ZiweiBirthInput } from "./lunar";

export type ZiweiReadiness =
  | { readonly ok: true }
  | { readonly ok: false; readonly code: "ZIWEI_NEED_SLOT"; readonly slots: readonly { readonly value: string; readonly label: string }[]; readonly message: string }
  | { readonly ok: false; readonly code: "ZIWEI_OUT_OF_RANGE"; readonly message: string };

export const ZIWEI_NEED_SLOT_MESSAGE = "자미두수는 태어난 시간대가 있어야 명반을 만들 수 있어요. 정확한 시각을 모르셔도 대략적인 시간대(시진)만 골라 주시면 돼요.";
export const ZIWEI_OUT_OF_RANGE_MESSAGE = `자미두수는 ${ZIWEI_SOLAR_RANGE.min.slice(0, 4)}~${ZIWEI_SOLAR_RANGE.max.slice(0, 4)}년 사이에 태어난 분만 만들 수 있어요.`;

export function ziweiReadiness(person: ZiweiBirthInput): ZiweiReadiness {
  const parsed = normalizeBirthTimePrecision(person);
  if (!parsed.ok || typeof person.birthDate !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(person.birthDate)) return { ok: true };
  // 마지막 날(2050-12-31) 밤 11시대는 자미 날짜가 범위 밖 다음 날이 되므로 마지막 날은 받지 않는다.
  if (person.birthDate < ZIWEI_SOLAR_RANGE.min || person.birthDate >= ZIWEI_SOLAR_RANGE.max) return { ok: false, code: "ZIWEI_OUT_OF_RANGE", message: ZIWEI_OUT_OF_RANGE_MESSAGE };
  if (parsed.precision !== "unknown") return { ok: true };
  return { ok: false, code: "ZIWEI_NEED_SLOT", slots: birthTimeSlotOptions(person.birthDate).map(s => ({ value: s.value, label: s.labelKo })), message: ZIWEI_NEED_SLOT_MESSAGE };
}
