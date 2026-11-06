// 잠금 증명 비교: pnpm exec tsx tools/p6c-ui2/lockProofDiff.ts <예전 문구 폴더> <지금 문구 폴더>
// 같은 시험·같은 순번의 잠금 값(해시를 입력까지 푼 값)을 짝지어,
// 1) 그대로 같은지, 2) 다르면 보정 문구 한 줄만 자리표(⟨보정 문구⟩)로 바꿨을 때 같아지는지 본다.
// 2)에서도 다르면 그 차이를 찍고 실패(종료 코드 1)한다. 바뀐 문구 짝(예전 → 지금)은 모두 찍는다.
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const [dirA, dirB] = process.argv.slice(2);
type Row = { test: string; n: number; key: string; value: unknown };
const read = (dir: string, file: string): Row[] => readFileSync(join(dir, file), "utf8").split("\n").filter(Boolean).map(line => JSON.parse(line));
const OLD = /(?:출생지 경도|기준 경도) 동경 [\d.]+°로 시간 보정 (?:없음|[+-]?\d+분 적용)(?: \(당시 (?:서머타임|표준시 UTC\+8:30) 반영\))?/g;
const NEW = /태양시 기준(?:\(출생지 동경 [\d.]+°\))? · (?:보정 없음(?: \(\d{2}:\d{2}\))?|\d+분 보정(?: \(\d{2}:\d{2} → (?:전날 |다음 날 )?\d{2}:\d{2}\))?)(?: · 당시 (?:서머타임|표준시 UTC\+8:30) 반영)?/g;
const MARK = "⟨보정 문구⟩";
// 해시 값 자체({sha256})는 입력이 달라지면 당연히 다르다. 입력까지 풀린 곳은 해시 글자를 빼고 입력만 비교한다.
const normalize = (v: unknown, re: RegExp, found: string[]): unknown => {
  if (typeof v === "string") return v.replace(re, m => (found.push(m), MARK));
  if (Array.isArray(v)) return v.map(x => normalize(x, re, found));
  if (v && typeof v === "object") {
    const o = v as Record<string, unknown>;
    if ("sha256" in o && "input" in o && Object.keys(o).length === 2) return { input: normalize(o.input, re, found) };
    return Object.fromEntries(Object.entries(o).map(([k, x]) => [k, normalize(x, re, found)]));
  }
  return v;
};
// 처음 어긋나는 곳(경로·앞뒤 60자).
const firstDiff = (a: unknown, b: unknown, path = "$"): string | null => {
  if (typeof a === "string" && typeof b === "string") {
    if (a === b) return null;
    let i = 0; while (i < a.length && a[i] === b[i]) i++;
    return `${path} @${i}\n  예전: …${a.slice(Math.max(0, i - 60), i + 80)}…\n  지금: …${b.slice(Math.max(0, i - 60), i + 80)}…`;
  }
  if (a && b && typeof a === "object" && typeof b === "object") {
    for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) { const d = firstDiff((a as Record<string, unknown>)[k], (b as Record<string, unknown>)[k], `${path}.${k}`); if (d) return d; }
    return null;
  }
  return JSON.stringify(a) === JSON.stringify(b) ? null : `${path}: ${JSON.stringify(a)?.slice(0, 120)} ≠ ${JSON.stringify(b)?.slice(0, 120)}`;
};

let calls = 0, same = 0, noteOnly = 0, other = 0;
const changedTests = new Set<string>(), changedKeys = new Set<string>(), pairs = new Map<string, number>();
for (const file of readdirSync(dirA).filter(f => f.endsWith(".jsonl")).sort()) {
  const a = read(dirA, file), b = read(dirB, file);
  if (a.length !== b.length) { console.log(`${file}: 잠금 호출 수가 다름 ${a.length} ≠ ${b.length}`); other++; continue; }
  let fileChanged = 0;
  for (let i = 0; i < a.length; i++) {
    calls++;
    if (a[i].test !== b[i].test || a[i].n !== b[i].n) { console.log(`${file}: 순서가 다름 ${a[i].test}#${a[i].n} ≠ ${b[i].test}#${b[i].n}`); other++; continue; }
    if (JSON.stringify(a[i].value) === JSON.stringify(b[i].value)) { same++; continue; }
    const fa: string[] = [], fb: string[] = [];
    const na = normalize(a[i].value, OLD, fa), nb = normalize(b[i].value, NEW, fb);
    const d = firstDiff(na, nb);
    if (d) { other++; console.log(`\n✗ ${file} · ${a[i].test} #${a[i].n} · ${a[i].key.slice(0, 40)}\n${d}`); continue; }
    noteOnly++; fileChanged++; changedTests.add(`${file} · ${a[i].test}`); changedKeys.add(a[i].key);
    // 같은 자리끼리(나온 순서) 짝짓는다. 자리 수가 같아야 "그 한 줄만 바뀜"이다.
    if (fa.length !== fb.length) { other++; console.log(`\n✗ ${file} · ${a[i].test} #${a[i].n}: 문구 자리 수가 다름 ${fa.length} ≠ ${fb.length}`); continue; }
    for (const p of new Set(fa.map((o, j) => `${o}  →  ${fb[j]}`))) pairs.set(p, (pairs.get(p) ?? 0) + 1);
  }
  console.log(`${file}: 잠금 호출 ${a.length}, 문구만 다름 ${fileChanged}`);
}
console.log(`\n잠금 호출 ${calls} · 그대로 같음 ${same} · 보정 문구만 다름 ${noteOnly} · 그 밖의 차이 ${other}`);
console.log(`문구만 달라진 시험 ${changedTests.size}건, 잠금 키 ${changedKeys.size}개`);
console.log("바뀐 문구(예전 → 지금, 값 수):"); for (const [p, c] of pairs) console.log(`  ${p}  (${c})`);
for (const t of changedTests) console.log(`  - ${t}`);
process.exit(other ? 1 : 0);
