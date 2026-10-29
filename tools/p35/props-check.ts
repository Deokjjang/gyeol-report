// 소품 사전 검사: pnpm exec tsx tools/p35/props-check.ts
// 스키마 + 직업군 매칭 표본 + 금지(연인·자녀·배우자 전제는 relationship 밖 금지, 한자·MBTI 금지).
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { matchJob, PropsSchema } from "../../src/lib/brief/props";

const raw = JSON.parse(readFileSync(join(import.meta.dirname, "../../src/lib/brief/data/props.json"), "utf8"));
const r = PropsSchema.safeParse(raw);
const errors: string[] = [];
if (!r.success) errors.push(...r.error.issues.slice(0, 30).map(i => `schema ${i.path.join(".")}: ${i.message}`));
else {
  const p = r.data;
  const FAMILY = /아이|자녀|아들|딸|육아|등원|하원|남편|아내|배우자|연인|애인|남자친구|여자친구|데이트|기념일/;
  const BAD = /[一-鿿]|\b[EI][NS][TF][JP]\b|MBTI/;
  const all = (where: string, list: readonly string[], family = true) => list.forEach(x => { if (BAD.test(x)) errors.push(`${where}: 한자·MBTI "${x}"`); if (family && FAMILY.test(x)) errors.push(`${where}: 가족·연인 전제 "${x}"`); });
  p.jobs.forEach(j => all(`jobs.${j.id}`, j.props));
  Object.entries(p.jobStatus).forEach(([k, v]) => all(`jobStatus.${k}`, v));
  Object.entries(p.age).forEach(([k, v]) => all(`age.${k}`, v));
  all("relationship.single", p.relationship.single); all("relationship.unknown", p.relationship.unknown);
  const ids = new Set<string>(); p.jobs.forEach(j => { if (ids.has(j.id)) errors.push(`중복 id ${j.id}`); ids.add(j.id); });
  const samples: [string, string][] = [
    ["서비스 기획자", "기획"], ["백엔드 개발자", "개발"], ["간호사", "간호"], ["초등학교 교사", "교사"], ["일러스트레이터", "일러스트"], ["대학생", "대학생"],
    ["마케터", "마케팅"], ["바리스타", "카페"], ["공무원", "공무원"], ["회계사", "회계"], ["유튜버", "크리에이터"], ["요리사", "요리"], ["물리치료사", "치료"],
  ];
  for (const [job, want] of samples) { const m = matchJob(job, p); console.log(`${job} → ${m?.name ?? "없음"} : ${m?.props.join(", ") ?? ""}`); if (!m || !(m.name + m.id + m.keywords.join("")).includes(want.slice(0, 2))) errors.push(`매칭 표본 실패: ${job} (기대 '${want}' 포함 직업군)`); }
}
console.log(JSON.stringify({ errors: errors.length }));
errors.forEach(e => console.log(e));
process.exit(errors.length ? 1 : 0);
