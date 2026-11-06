// 시험 쌍 점수(지금 표, v2.1): pnpm exec tsx tools/p6c-score/pairs.ts [--reasons]. before = P4 v5-1, v2 = P6c 점수.
// 하람×서윤 연애, 정희×지우 부모·자녀, 태호×하람 상사·팀원(브리프와 같은 calculateSaju 입력, 이름은 callName).
import type { MbtiType } from "../../src/data/knowledge-v5/schema";
import { calculateSaju } from "../../src/lib/saju/calculateSaju";
import { computeCompatScore, type CompatCategory } from "../../src/lib/compat/score";
import { PEOPLE } from "../p35/people";
import { P36_PEOPLE } from "../p36/people";

type P = { name: string; gender: string; birthDate: string; birthTime: string; birthTimeUnknown: boolean; mbtiType: string };
const side = (p: P) => ({ name: `${p.name}님`, mbti: (p.mbtiType || null) as MbtiType | null, gender: p.gender === "MALE" || p.gender === "FEMALE" ? (p.gender as "MALE" | "FEMALE") : null,
  saju: calculateSaju({ birthDate: p.birthDate, birthTime: p.birthTime, birthTimeUnknown: p.birthTimeUnknown, approximateBirthTimeSlot: "" as never, calendarType: "SOLAR", gender: p.gender as never, timezone: "Asia/Seoul" }) });
export const TEST_PAIRS: readonly { id: string; label: string; category: CompatCategory; a: P; b: P; before: number; v2: number }[] = [
  { id: "love", label: "하람×서윤 연애", category: "love", a: PEOPLE.c1, b: PEOPLE.c2, before: 49, v2: 62 },
  { id: "parentChild", label: "정희×지우 부모·자녀", category: "parentChild", a: P36_PEOPLE.parent, b: P36_PEOPLE.child, before: 45, v2: 55 },
  { id: "managerReport", label: "태호×하람 상사·팀원", category: "managerReport", a: P36_PEOPLE.boss, b: PEOPLE.c1, before: 58, v2: 62 },
];
if (import.meta.url === `file://${process.argv[1]}`) for (const t of TEST_PAIRS) {
  const s = computeCompatScore(t.category, side(t.a), side(t.b));
  console.log(`\n## ${t.label}: ${t.before} → v2 ${t.v2} → ${s.version} ${s.total} (${s.band.label})${s.scaled ? " · MBTI 없음(사주 항목 만점 재배분)" : ""}`);
  for (const i of s.items) console.log(`- ${i.name} ${i.points}/${i.max}${process.argv.includes("--reasons") ? ` — ${i.reason}` : ""}`);
}
