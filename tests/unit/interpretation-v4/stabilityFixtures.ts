import { singleRuntimeInput } from "./runtimeFixtures";

// Locked before the baseline run. No success-based selection or seed retries.
export const STABILITY_SEED = 0x13d2026;
const types = ["ISTJ", "ISFJ", "INFJ", "INTJ", "ISTP", "ISFP", "INFP", "INTP", "ESTP", "ESFP", "ENFP", "ENTP", "ESTJ", "ESFJ", "ENFJ", "ENTJ"];
const jobs = [
  ["", ""], ["employee", "제조업 재무기획"], ["freelancer", "기술 문서 번역"],
  ["student", "디자인 전공"], ["job_seeker", "서비스 기획 준비"], ["business_owner", "온라인 교육사업"],
  ["homemaker", "가정 돌봄"], ["unemployed", "휴식 및 다음 일 준비"],
] as const;
const relationships = ["", "single", "some", "dating", "marriage_preparing", "married"] as const;
const times = ["00:20", "03:45", "07:10", "11:30", "14:15", "18:40", "21:20", "23:10"];
// Use only known canonical approximate slots; do not invent any time interval.
const canonicalSlots = ["JASI", "JINSI", "OSI", "MISI", "YUSI", "HAESI"];
export function stabilityFixtures(cohort: "training" | "holdout") {
  let state = STABILITY_SEED;
  const random = (n: number) => { state = (Math.imul(state, 1664525) + 1013904223) >>> 0; return state % n; };
  const all = Array.from({ length: 120 }, (_, i) => {
    const date = `${1968 + random(40)}-${String(1 + random(12)).padStart(2, "0")}-${String(1 + random(28)).padStart(2, "0")}`;
    const precision = (["exact", "approximate", "unknown"] as const)[i % 3];
    const [jobStatus, detailJob] = jobs[(Math.floor(i / 3) + i) % jobs.length];
    const payload = singleRuntimeInput("saju_mbti_full", "saju-mbti-full", {
      id: `stability-${i}`, name: "가상검수", date, ...(precision === "exact" ? { time: times[random(times.length)] } : {}),
      gender: i % 3 === 0 ? "MALE" : "FEMALE", mbti: i % 7 === 0 ? "" : types[Math.floor(i / 6) % types.length],
      context: { jobStatus, detailJob, relationshipStatus: relationships[Math.floor(i / 2) % relationships.length] },
    }, precision === "approximate" ? canonicalSlots[random(canonicalSlots.length)] : "");
    return { id: `S${String(i + 1).padStart(3, "0")}`, precision, payload };
  });
  return cohort === "training" ? all.slice(0, 96) : all.slice(96);
}
