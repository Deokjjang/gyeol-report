/**
 * AM2-5 5부 연결 고리 검사(호출 0): 개발 세트 10명 + 무작위 세운·대운 각 1,000명(seed 7, AM2-4와 같은 입력)에서
 *   ① 근거 없는 고리 0(고리마다 엔진 값 — 그 key 배지의 관계·자리·영역 신호 — 과 입력 출처 — 연애 상태·일·바람·자녀 — 를 대조, link.ts verifyLinks)
 *   ② 입력 조건 위반 0(자녀 · 솔로 · 시간 미상 · 연차 말)
 *   ③ 고리·짝·장면 수(key 몫)와 「이 사람만의 재료」(고리 또는 짝)가 있는 key 비율.
 *   NODE_PATH=tools/llm/shim pnpm exec tsx tools/annual-major/am2-5-links.ts [--random 1000] [--seed 7] [--show annual-1]
 */
import { cases } from "./final";
import { intakeOf, randomPayload } from "./am2-brief";
import { verifyLinks } from "../../src/lib/writer/chunked/link";
import { briefCheck } from "../../src/lib/writer/chunked/check";
import { briefCtxFor } from "../../src/lib/writer/chunked/publish";
import { safetyFacts } from "../../src/lib/writer/safety";

const argv = process.argv.slice(2);
if (argv[0] === "--show") {
  const c = cases().find(x => x.id === argv[1])!; const { brief, intake } = intakeOf(c.payload);
  for (const k of intake.chapters.flatMap(ch => ch.keys ?? [])) for (const l of k.links ?? []) console.log(`${k.label} [${l.kind}] ${l.text}\n   엔진: ${l.engine.join(", ")} · 입력: ${l.input.join(", ")}`);
  console.log("검사:", verifyLinks(brief, intake.chapters.flatMap(ch => ch.keys ?? [])));
  process.exit(0);
}
const N = argv.includes("--random") ? Number(argv[argv.indexOf("--random") + 1]) : 1000, seed = argv.includes("--seed") ? Number(argv[argv.indexOf("--seed") + 1]) : 7;
const tally = { people: 0, keys: 0, links: 0, linkKeys: 0, pairKeys: 0, sceneKeys: 0, ownKeys: 0, bad: 0, brief: 0, rejected: 0 };
const byProduct: Record<string, { keys: number; own: number; scene: number; pair: number; books: number; ownBooksTwoThirds: number }> = {};
const samples: string[] = [], briefSamples: string[] = [];
const run = (who: string, payload: unknown) => {
  let r: ReturnType<typeof intakeOf>;
  try { r = intakeOf(payload); } catch (e) { if (/Uncertain|시각|birth/i.test(String(e))) { tally.rejected++; return false; } throw e; }
  const { brief, intake } = r, keys = intake.chapters.flatMap(ch => ch.keys ?? []);
  tally.people++; tally.keys += keys.length;
  const p = (byProduct[brief.product] ??= { keys: 0, own: 0, scene: 0, pair: 0, books: 0, ownBooksTwoThirds: 0 });
  p.books++; p.keys += keys.length;
  let own = 0;
  for (const k of keys) { const l = k.links?.length ?? 0; tally.links += l; if (l) tally.linkKeys++; if (k.pair) { tally.pairKeys++; p.pair++; } if (k.scene) { tally.sceneKeys++; p.scene++; } if (l || k.pair) { tally.ownKeys++; own++; p.own++; } }
  if (own * 3 >= keys.length * 2) p.ownBooksTwoThirds++;
  const v = verifyLinks(brief, keys); tally.bad += v.length; for (const x of v) if (samples.length < 20) samples.push(`${who} ${x}`);
  const issues = briefCheck(intake, safetyFacts(brief).nicknames ?? [], briefCtxFor(brief)); tally.brief += issues.length; for (const i of issues) if (briefSamples.length < 20) briefSamples.push(`${who} [${i.rule}] ${i.where}: ${i.text.slice(0, 140)}`);
  return true;
};
for (const c of cases().filter(x => x.product !== "launch")) run(c.id, c.payload);
for (const prod of ["annual_fortune", "major_fortune"] as const) { let ok = 0; for (let i = 0; ok < N; i++) if (run(`${prod}#${i}`, randomPayload(i, prod, seed))) ok++; }
console.log(`검사 ${tally.people}명(만세력이 받지 않는 출생 시각 ${tally.rejected}명은 다음 입력으로 채움) · key ${tally.keys} · 고리 ${tally.links}(고리 있는 key ${tally.linkKeys}) · 짝 key ${tally.pairKeys} · 장면 key ${tally.sceneKeys} · 고리 또는 짝이 있는 key ${tally.ownKeys}(${(100 * tally.ownKeys / tally.keys).toFixed(1)}%)`);
for (const [prod, p] of Object.entries(byProduct)) console.log(`  ${prod}: ${p.books}권 · key ${p.keys} · 고리·짝 key ${(100 * p.own / p.keys).toFixed(1)}% · 장면 key ${(100 * p.scene / p.keys).toFixed(1)}% · 짝 key ${(100 * p.pair / p.keys).toFixed(1)}% · 고리·짝 key가 3분의 2 이상인 책 ${p.ownBooksTwoThirds}/${p.books}`);
console.log(`근거 없는 고리·입력 조건 위반 ${tally.bad} · 브리프 검사(카드 ≡ 엔진 · 충돌 빌드 포함) 위반 ${tally.brief}`);
for (const s of [...samples, ...briefSamples]) console.log(`- ${s}`);
