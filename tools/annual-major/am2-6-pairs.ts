/** AM2-6 2부 짝 수 셈(호출 0): 개발 세트 + 무작위 세운·대운 각 N명(seed 7)의 key 짝 · 장 짝 수. 옛 코드 worktree에서도 같은 파일로 돌려 맞댄다(이유 칸이 없으면 「—」). */
import { cases } from "./final";
import { intakeOf, randomPayload } from "./am2-brief";
const N = Number(process.argv[2] ?? 1000), T: Record<string, number> = {};
const add = (k: string, n = 1) => { T[k] = (T[k] ?? 0) + n; };
const run = (p: unknown) => { let r; try { r = intakeOf(p); } catch { return false; } const { brief, intake } = r; const pr = brief.product === "annual_fortune" ? "세운" : "대운";
  const keys = intake.chapters.flatMap(c => c.keys ?? []); add(`${pr} 책`); add(`${pr} key`, keys.length); add(`${pr} key 짝`, keys.filter(k => k.pair).length);
  for (const p2 of intake.pairs) { add(`${pr} 짝(${p2.key ? "key" : "장"}) 이유 ${(p2 as { reason?: string }).reason ?? "—"}`); if (/같은 나이대/.test(p2.why)) add(`${pr} 짝 「같은 나이대」`); }
  if (brief.mbti) add(`${pr} MBTI 있는 책`); return true; };
for (const c of cases().filter(x => x.product !== "launch")) run(c.payload);
for (const prod of ["annual_fortune", "major_fortune"] as const) { let ok = 0; for (let i = 0; ok < N; i++) if (run(randomPayload(i, prod, 7))) ok++; }
console.log(JSON.stringify(T, null, 1));
