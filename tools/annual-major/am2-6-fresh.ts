/**
 * AM2-6 9부 P6 「처음 보는 네 입력」(세운 2 · 대운 2): 개발 세트(final.ts cases) · P5 처음 보는 두 입력(am2-5-fresh)과 겹치지 않는다.
 * 꼭 넣을 조건(덕짱님 지시): 학생 또는 일 미입력 · 기혼 + 자녀 · 대운 하나는 시간 미상(시간대 질문으로 대운이 정해진 사람) · 세운 하나는 MBTI 미입력 · 바람 있음과 없음.
 * 「기혼 + 자녀」는 주문 입력(폼 · payload)에 자녀 칸이 없어 기혼 · 자녀 미입력으로 넣는다(덕짱님 답 2026-11-12 「기혼·자녀 미입력으로」).
 * 고른 뒤 이 입력에 맞춰 코드를 고치지 않는다(고른 이유만 적는다 — am2.md 16절). 가상 인물만(고객 원고 아님).
 */
import { payloadOf } from "./mockRun";
import type { Fresh } from "./am2-5-fresh";

/** 시간대(대략) 입력 payload: 출생 시각 모름 → 대운 시간대 질문(DAYUN_NEED_SLOT)에서 고른 시간대. */
const approx = (p: Parameters<typeof payloadOf>[1] & { slot: string }) => { const base = payloadOf("major_fortune", { ...p, birthTime: "", unknown: false }) as unknown as { person: Record<string, unknown> };
  return { ...base, person: { ...base.person, birthTime: "", birthTimeUnknown: false, birthTimePrecision: "approximate", approximateBirthTimeSlot: p.slot } }; };
export const FRESH6: readonly Fresh[] = [
  // 세운 ① 20대 초반 여성 · 학생 · 솔로 · MBTI 없음 · 바람 있음(공부·몸) — annual-1(직장인 · ENFP) · annual-p5(자영업 · ESFJ · 연애 중)와 일 · MBTI · 나이가 다르다.
  { id: "annual-p6a", product: "annual", note: "20대 초반 여성·학생·솔로·MBTI 없음·바람 있음(P6 처음 보는 입력)", payload: () => payloadOf("annual_fortune", { name: "강예린", birthDate: "2005-06-18", birthTime: "15:10", gender: "FEMALE", mbti: "", job: "student", rel: "single", wish: "2027년에는 자격증 시험에 붙고, 운동도 꾸준히 하고 싶어요" }) },
  // 세운 ② 40대 후반 남성 · 일 미입력 · 기혼(자녀 미입력) · ISTJ · 바람 없음 — 세운 기혼 · 일 미입력 · 40대는 처음이다.
  { id: "annual-p6b", product: "annual", note: "40대 후반 남성·일 미입력·기혼(자녀 미입력)·ISTJ·바람 없음(P6 처음 보는 입력)", payload: () => payloadOf("annual_fortune", { name: "최정훈", birthDate: "1979-02-21", birthTime: "06:40", gender: "MALE", mbti: "ISTJ", job: "", rel: "married" }) },
  // 대운 ① 30대 후반 여성 · 출생 시각 모름 → 시간대 질문에서 진시(07:30~09:29) · 취업 준비 · 연애 중 · ENFJ — 시간대로 대운이 정해진 사람.
  { id: "major-p6a", product: "major", note: "30대 후반 여성·시각 모름→시간대 진시·취업 준비·연애 중·ENFJ(P6 처음 보는 입력)", payload: () => approx({ name: "한유경", birthDate: "1987-03-06", birthTime: "", gender: "FEMALE", mbti: "ENFJ", job: "job_seeker", rel: "dating", slot: "JINSI" }) },
  // 대운 ② 50대 중반 남성 · 쉬는 중 · 솔로 · ESTP — major-1(20대 직장인 솔로) · major-p5(40대 프리랜서 기혼 · MBTI 없음)와 나이 · 일이 다르다.
  // (「썸」은 브리프가 연애 중으로 접는다 — P2부터의 공용 규칙이라 4종도 같아 이번 판에서 고치지 않고, 이 입력에는 쓰지 않았다. 16-8 남은 것.)
  { id: "major-p6b", product: "major", note: "50대 중반 남성·쉬는 중·솔로·ESTP(P6 처음 보는 입력)", payload: () => payloadOf("major_fortune", { name: "오민석", birthDate: "1971-08-29", birthTime: "13:20", gender: "MALE", mbti: "ESTP", job: "unemployed", rel: "single" }) },
];
