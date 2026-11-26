// ZW-2 시험 인물: 7부 실측 5명(0부 확정 + 덕짱님 수정 4) + 무작위 사람 만들기(seed 고정). 시험 전용.
import { BIRTH_TIME_SLOT_DEFINITIONS } from "../../../src/lib/saju/birthTimePrecisionTypes";
import type { ZiweiPerson } from "../../../src/lib/ziwei/brief";

export type TestPerson = { readonly id: string; readonly input: { readonly birthDate: string; readonly birthTime?: string; readonly approximateBirthTimeSlot?: string; readonly birthTimePrecision?: string; readonly gender: "MALE" | "FEMALE" }; readonly person: ZiweiPerson };
const mk = (id: string, input: TestPerson["input"], person: Omit<ZiweiPerson, "gender" | "precision"> & { precision?: ZiweiPerson["precision"] }): TestPerson =>
  ({ id, input, person: { gender: input.gender, precision: input.birthTimePrecision === "approximate" ? "approximate" : "exact", ...person } as ZiweiPerson });
/** 7부 Z5 5권(생년 천간 丁 · 戊 · 癸 · 乙 · 庚). */
export const Z5_PEOPLE: readonly TestPerson[] = [
  mk("z5-1", { birthDate: "1997-03-14", birthTime: "10:15", gender: "FEMALE" }, { name: "하린", mbti: "ENFP", relationshipStatus: "some", jobStatus: "freelancer", detailJob: "" }),
  mk("z5-2", { birthDate: "1988-10-30", birthTime: "21:30", gender: "MALE" }, { name: "도윤", mbti: null, relationshipStatus: "dating", jobStatus: "self_employed", detailJob: "" }),
  mk("z5-3", { birthDate: "1983-07-08", birthTime: "10:15", gender: "FEMALE" }, { name: "서윤", mbti: "ISFJ", relationshipStatus: "married", jobStatus: "employee", detailJob: "", children: "has" }),
  mk("z5-4", { birthDate: "2005-03-05", approximateBirthTimeSlot: "MYOSI", birthTimePrecision: "approximate", gender: "FEMALE" }, { name: "지아", mbti: null, relationshipStatus: "single", jobStatus: "student", detailJob: "", slotLabel: "묘시" }),
  mk("z5-5", { birthDate: "1991-02-10", birthTime: "14:20", gender: "MALE" }, { name: "민준", mbti: "INTP", relationshipStatus: "married", jobStatus: "unemployed", detailJob: "" }),
];

const MBTI = ["INTJ", "INTP", "ENTJ", "ENTP", "INFJ", "INFP", "ENFJ", "ENFP", "ISTJ", "ISFJ", "ESTJ", "ESFJ", "ISTP", "ISFP", "ESTP", "ESFP"] as const;
const REL = ["", "single", "some", "dating", "marriage_preparing", "married"] as const;
const JOB = ["", "student", "job_seeker", "employee", "freelancer", "self_employed", "business_owner", "homemaker", "unemployed", "other"] as const;
const DETAIL = ["", "", "", "카페 운영", "회사 기획팀", "프리랜서 디자이너"] as const;
function rng(seed: number) { let a = seed >>> 0; return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
/** 무작위 n명(1950-01-01 ~ 2008-12-31, 정확 70% · 시진 30%, MBTI 60%). */
export function randomPeople(n: number, seed = 20261126): TestPerson[] {
  const r = rng(seed), pick = <T,>(xs: readonly T[]) => xs[Math.floor(r() * xs.length)];
  const lo = Date.UTC(1950, 0, 1), hi = Date.UTC(2008, 11, 31);
  return Array.from({ length: n }, (_, i) => {
    const d = new Date(lo + Math.floor(r() * ((hi - lo) / 86_400_000)) * 86_400_000).toISOString().slice(0, 10);
    const exact = r() < 0.7, gender = r() < 0.5 ? "MALE" as const : "FEMALE" as const;
    const slot = pick(BIRTH_TIME_SLOT_DEFINITIONS);
    const input = exact ? { birthDate: d, birthTime: `${String(Math.floor(r() * 24)).padStart(2, "0")}:${String(Math.floor(r() * 60)).padStart(2, "0")}`, gender } : { birthDate: d, approximateBirthTimeSlot: slot.value, birthTimePrecision: "approximate", gender };
    const ch = r(), children = ch < 0.33 ? "has" as const : ch < 0.55 ? "none" as const : undefined;
    return mk(`r${i}`, input, { name: "가람", mbti: r() < 0.6 ? pick(MBTI) : null, relationshipStatus: pick(REL), jobStatus: pick(JOB), detailJob: pick(DETAIL), ...(children ? { children } : {}), ...(exact ? {} : { slotLabel: slot.nameKo }) });
  });
}
