/**
 * P6c A1 변환 결과 검사: pnpm exec tsx tools/p6c/seeds/check.ts <out.json> <batch.json>
 * 빠진 id·여분 id·길이·문장 끝맺음·따옴표·원문 복사(정규화 최장 공통 부분)·그림 별명·농촌/농사 낱말·MBTI 약어(괄호 밖)를 본다. 위반을 줄마다 출력, 없으면 "OK n".
 */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { FARMING, NICKNAME_KEYS, bareFunctionCodes } from "../../../src/lib/writer/safety/lint";
import { RURAL_PROP } from "../../../src/lib/writer/safety/patterns";
import { norm } from "../../../src/lib/writer/safety/sentences";
import { KNOW, type Item } from "./extract";

const NICK = [...readdirSync(join(KNOW, "myeongri")).flatMap(f => (JSON.parse(readFileSync(join(KNOW, "myeongri", f), "utf8")).features as { easyName: string }[]).map(x => x.easyName)), ...NICKNAME_KEYS];
// 복사 한도: 씨앗은 짧은 구라 12자, 방향·뜻은 작가 lint와 같은 20자(20자 이상 이어 붙으면 실패, P6c A1).
const LIMIT: Record<Item["kind"], [number, number, number]> = { seed: [6, 24, 12], dir: [10, 56, 20], core: [14, 70, 20], fn: [4, 44, 20] };
/** 문장 끝맺음(…니다·…해요·…한다). "필요·중요·바다"처럼 요·다로 끝나는 명사는 허용. */
const ENDING = /(니다|[어아여해예에세네군지]요|이에요|죠|까|[는한된진있없했였겠인]다)[.!?…]*$/;
/** 두 글의 정규화 최장 공통 부분 길이. */
export function lcs(a: string, b: string): number {
  const x = norm(a), y = norm(b); let best = 0;
  const prev = new Array(y.length + 1).fill(0), cur = new Array(y.length + 1).fill(0);
  for (let i = 1; i <= x.length; i++) { for (let j = 1; j <= y.length; j++) { cur[j] = x[i - 1] === y[j - 1] ? prev[j - 1] + 1 : 0; if (cur[j] > best) best = cur[j]; } prev.splice(0, prev.length, ...cur); }
  return best;
}
export function problems(item: Item, out: unknown): string[] {
  if (typeof out !== "string" || !out.trim()) return ["빈 값"];
  const v = out.trim(), p: string[] = [];
  const [min, max, copy] = LIMIT[item.kind];
  const parts = item.kind === "fn" ? v.split("|").map(s => s.trim()) : [v];
  if (item.kind === "fn" && (parts.length !== 2 || parts[0].length < 4 || parts[0].length > 14 || parts[1].length < 10 || parts[1].length > 44)) p.push(`fn 꼴 "쉬운 이름 | 방향"(이름 4~14자, 방향 10~44자): ${v}`);
  if (item.kind !== "fn" && (v.length < min || v.length > max)) p.push(`길이 ${v.length}(${min}~${max})`);
  for (const s of parts) if (ENDING.test(s)) p.push(`문장 끝맺음: ${s}`);
  if (/["'‘’“”?!]/.test(v)) p.push("따옴표·물음표·느낌표");
  if (/[.。]$/.test(v) || /[.] /.test(v)) p.push("마침표(구로 쓴다)");
  const c = lcs(v, item.text); if (c >= copy) p.push(`원문 복사 ${c}자(${copy}자 미만)`);
  const nick = NICK.filter(n => v.includes(n)); if (nick.length) p.push(`그림 별명 ${nick.join(",")}`);
  if (RURAL_PROP.test(v) || FARMING.test(v)) p.push("농촌·농사 낱말");
  if (bareFunctionCodes(v).length) p.push("MBTI 기능 약어는 괄호 안에만(쉬운말(Te))");
  return p;
}

if (process.argv[1]?.endsWith("check.ts")) {
  const out = JSON.parse(readFileSync(process.argv[2], "utf8")) as Record<string, string>;
  const batch = JSON.parse(readFileSync(process.argv[3], "utf8")) as Item[];
  const ids = new Set(batch.map(b => b.id)); let bad = 0;
  for (const b of batch) { const p = problems(b, out[b.id]); if (p.length) { bad++; console.log(`${b.id}\t${p.join(" / ")}`); } }
  for (const id of Object.keys(out)) if (!ids.has(id)) { bad++; console.log(`${id}\t여분 id`); }
  console.log(bad ? `위반 ${bad}/${batch.length}` : `OK ${batch.length}`);
}
