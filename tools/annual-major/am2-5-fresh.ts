/**
 * AM2-5 6부 P5 「처음 보는 두 입력」(세운 1 · 대운 1): 개발 세트(final.ts cases)와 지금까지 판독에 쓴 입력(annual-1 · major-1)이 아니다.
 * 조건은 기존 두 권과 다르게 고른다. 고른 뒤 이 입력에 맞춰 코드를 고치지 않는다(고른 이유만 적는다 — am2.md 15절).
 * 가상 인물만(고객 원고 아님).
 */
import { payloadOf } from "./mockRun";

export type Fresh = { readonly id: string; readonly product: "annual" | "major"; readonly note: string; readonly payload: () => unknown };
export const FRESH: readonly Fresh[] = [
  // 세운 annual-1(20대 후반 여성 · 직장인 · 솔로 · ENFP · 바람 있음)과 반대: 30대 중반 남성 · 자영업(개발 세트에 없음) · 연애 중 · ESFJ(개발 세트에 없음) · 바람 없음.
  { id: "annual-p5", product: "annual", note: "30대 중반 남성·자영업·연애 중·ESFJ·바람 없음(P5 처음 보는 입력)", payload: () => payloadOf("annual_fortune", { name: "도윤재", birthDate: "1991-09-27", birthTime: "19:40", gender: "MALE", mbti: "ESFJ", job: "self_employed", rel: "dating" }) },
  // 대운 major-1(20대 후반 남성 · 직장인 · 솔로 · ENTP)과 다름: 40대 초반 여성 · 프리랜서 · 기혼 · MBTI 없음.
  { id: "major-p5", product: "major", note: "40대 초반 여성·프리랜서·기혼·MBTI 없음(P5 처음 보는 입력)", payload: () => payloadOf("major_fortune", { name: "서미란", birthDate: "1983-12-05", birthTime: "07:15", gender: "FEMALE", mbti: "", job: "freelancer", rel: "married" }) },
];
