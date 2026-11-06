/** 무작위 고객 30+7명(brief 성질 시험과 같은 PRNG)의 장별 절 수 분포(개발용). */
import { buildBrief, loadKnowledge, type BriefInput, type BriefPersonInput } from "../../src/lib/brief";
import { createRng } from "../../src/lib/brief/seed";

const k = loadKnowledge();
const MBTIS = [...k.mbti.keys()];
const REL = ["", "single", "some", "dating", "married"], JOB = ["", "student", "employee", "freelancer", "self_employed", "business_owner", "homemaker"];
function randomPerson(i: number): BriefPersonInput {
  const r = createRng(9000 + i);
  const y = 1950 + r.int(60), m = 1 + r.int(12), d = 1 + r.int(28);
  const unknown = r.next() < 0.4;
  return { name: `고객${i}`, gender: (["MALE", "FEMALE", ""] as const)[r.int(3)], birthDate: `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`,
    birthTime: unknown ? "" : `${String(r.int(24)).padStart(2, "0")}:${String(r.int(60)).padStart(2, "0")}`, birthTimeUnknown: unknown, mbtiType: r.next() < 0.25 ? "" : r.pick(MBTIS),
    context: { relationshipStatus: r.pick(REL), jobStatus: r.pick(JOB), detailJob: "", children: (["has", "none", "unknown"] as const)[r.int(3)] } };
}
const PRODUCTS = ["saju_mbti_full", "career_money_study", "love_marriage_child", "major_fortune", "annual_fortune"] as const;
const rows: string[] = [];
for (let i = 0; i < 30; i++) {
  const input: BriefInput = { product: PRODUCTS[i % 5], person: randomPerson(i), baseDate: "2026-10-27", ...(i % 5 === 4 ? { selectedYear: 2026 } : {}) };
  try { const b = buildBrief(input, k); const short = b.chapters.filter(c => c.sections && c.sections.length < 3).map(c => `${c.id}:${c.sections!.length}`); rows.push(`${i} ${input.product} mbti=${input.person.mbtiType || "-"} short=[${short.join(" ")}] tokens=${b.budget.estimatedTokens}`); } catch (e) { rows.push(`${i} err ${String(e).slice(0, 60)}`); }
}
console.log(rows.join("\n"));
