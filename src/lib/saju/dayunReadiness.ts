/**
 * AM2-4 7부(덕짱님 결정 2026-11-12 「시각 미상으로 대운을 판정할 수 없는 고객은 입력 단계에서 막는다」) — 대운 판정 준비(계산은 그대로, 호출 0).
 * - 엔진(calculateCustomerDayun)이 출생 시각 범위 전체에서 대운 시작 해·간지를 하나로 정하면 그대로 간다.
 * - 시각을 모르면(하루 전체 범위) 열두 시진 대략 시간대마다 다시 계산해, 정해지는 시간대가 있으면 「대략적인 시간대를 고르세요」(선택지 = 그 시간대들).
 * - 어느 시간대로도 정해지지 않으면(또는 고른 시간대로도 정해지지 않으면) 「이 생일은 대운을 정확히 계산할 수 없어요」 — 대운 결제 전 단계에서 막고 세운을 권한다.
 * 계산 기준·보정(만세력 정책)은 바꾸지 않는다: 같은 엔진을 범위만 좁혀 부른다.
 */
import { calculateCustomerDayun, type CustomerDayunInput } from "./customerDayun";
import { BIRTH_TIME_SLOT_DEFINITIONS, birthTimeSlotOptions } from "./birthTimePrecisionTypes";

export type DayunReadiness =
  | { readonly ok: true }
  | { readonly ok: false; readonly code: "DAYUN_NEED_SLOT"; readonly slots: readonly { readonly value: string; readonly label: string }[]; readonly message: string }
  | { readonly ok: false; readonly code: "DAYUN_UNDETERMINABLE"; readonly message: string; readonly recommend: "annual_fortune" };

export const DAYUN_NEED_SLOT_MESSAGE = "태어난 시각을 모르면 이 생일은 대운이 시작되는 해를 하나로 정할 수 없어요. 대략적인 시간대를 골라 주시면 대운을 계산할 수 있어요.";
export const DAYUN_UNDETERMINABLE_MESSAGE = "이 생일은 대운을 정확히 계산할 수 없어요. 대운(앞으로의 나) 대신 세운(나의 한 해)을 권해요 — 세운은 이 입력 그대로 만들 수 있어요.";

/** 대운이 하나로 정해지는지. 성별이 없거나 입력이 이상하면 이 함수가 판정하지 않는다(ok — 다른 입력 검사가 맡는다). */
export function dayunReadiness(person: CustomerDayunInput): DayunReadiness {
  const r = calculateCustomerDayun(person);
  if (r.ok || r.error !== "DAYUN_UNCERTAIN") return { ok: true };
  const unknown = person.birthTimeUnknown === true || (!person.birthTime && !person.approximateBirthTimeSlot);
  if (unknown) {
    const labels = new Map(birthTimeSlotOptions(person.birthDate).map(s => [s.value, s.labelKo] as const));
    const slots = BIRTH_TIME_SLOT_DEFINITIONS.filter(s => calculateCustomerDayun({ ...person, birthTime: "", birthTimeUnknown: false, approximateBirthTimeSlot: s.value }).ok).map(s => ({ value: s.value, label: labels.get(s.value) ?? s.labelKo }));
    if (slots.length) return { ok: false, code: "DAYUN_NEED_SLOT", slots, message: DAYUN_NEED_SLOT_MESSAGE };
  }
  return { ok: false, code: "DAYUN_UNDETERMINABLE", message: DAYUN_UNDETERMINABLE_MESSAGE, recommend: "annual_fortune" };
}
