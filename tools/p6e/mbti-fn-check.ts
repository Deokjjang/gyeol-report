/**
 * P6e 4: MBTI 기능·태도 검사(16유형 DB 전체). 유형의 기능 네 개·E/I·J/P와 맞지 않는 MBTI 특성 문장을 찾는다.
 *   pnpm exec tsx tools/p6e/mbti-fn-check.ts [--fix] [--json out.json]
 * ① 유형 행동 차원 값(dimensionTags, |값| ≥ 0.3): 그 끝의 태그(POLE_TAGS)가 유형에 맞지 않으면 걸림. --fix면 값을 지운다(그 끝을 그 유형의 근거로 쓰지 않는다).
 * ② 유형 신호 문장(signals)·장면 씨앗(mbti-seeds)·Fusion 장면(fusion/<유형>.json scene)·그늘(shadows): 문장 단서(FN_CUES)가 유형과 어긋나면 걸림(사람이 고친다).
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { cueMisfits, POLE_TAGS, poleFits, tagLabel } from "@/lib/brief/mbtiFn";

const ROOT = resolve(import.meta.dirname, "../..");
const KD = join(ROOT, "src/data/knowledge-v5");
const TYPES = ["INTJ", "INTP", "ENTJ", "ENTP", "INFJ", "INFP", "ENFJ", "ENFP", "ISTJ", "ISFJ", "ESTJ", "ESFJ", "ISTP", "ISFP", "ESTP", "ESFP"];
const fix = process.argv.includes("--fix");
const jsonOut = process.argv.includes("--json") ? process.argv[process.argv.indexOf("--json") + 1] : "";
const dims: { type: string; dim: string; value: number; tag: string }[] = [];
const sentences: { type: string; where: string; text: string; why: string }[] = [];
const walk = (x: unknown, at: string, type: string) => {
  if (typeof x === "string") { for (const m of cueMisfits(type, x)) sentences.push({ type, where: at, text: x, why: m.why }); return; }
  if (Array.isArray(x)) x.forEach((v, i) => walk(v, `${at}[${i}]`, type));
  else if (x && typeof x === "object") for (const [k, v] of Object.entries(x)) if (!["id", "type", "rel", "job", "requires", "sources", "conventionalCompat"].includes(k)) walk(v, `${at}.${k}`, type);
};
for (const t of TYPES) {
  const file = join(KD, "mbti", `${t}.json`), d = JSON.parse(readFileSync(file, "utf8")) as { profiles: { dimensionTags: Record<string, number>; signals: unknown; shadows: unknown; cognitiveFunctions: unknown }[] };
  const p = d.profiles[0];
  let changed = false;
  for (const [dim, v] of Object.entries(p.dimensionTags)) if (Math.abs(v) >= 0.3 && !poleFits(t, dim, v)) { dims.push({ type: t, dim: `${dim}${v > 0 ? "+" : "-"}`, value: v, tag: tagLabel(POLE_TAGS[`${dim}${v > 0 ? "+" : "-"}`]) }); if (fix) { delete p.dimensionTags[dim]; changed = true; } }
  // 손으로 맞춘 JSON 꼴을 지키려고 dimensionTags 줄만 글자로 고친다.
  if (changed) { const text = readFileSync(file, "utf8"); writeFileSync(file, text.replace(/"dimensionTags": \{[^}]*\}/, `"dimensionTags": ${JSON.stringify(p.dimensionTags).replace(/":/g, '": ').replace(/,"/g, ', "').replace(/^\{/, "{ ").replace(/\}$/, " }")}`)); }
  walk(p.signals, `mbti/${t}.signals`, t); walk(p.shadows, `mbti/${t}.shadows`, t);
  walk(JSON.parse(readFileSync(join(KD, "mbti-seeds", `${t}.json`), "utf8")).seeds, `mbti-seeds/${t}`, t);
  walk(JSON.parse(readFileSync(join(KD, "fusion", `${t}.json`), "utf8")), `fusion/${t}`, t);
}
console.log(`① 유형 행동 차원 값 어긋남 ${dims.length}건${fix ? " (지움)" : ""}`);
for (const x of dims) console.log(`  ${x.type} ${x.dim} ${x.value} (태그 ${x.tag})`);
console.log(`② 문장 단서 어긋남 ${sentences.length}건`);
for (const x of sentences) console.log(`  ${x.type} ${x.where} [${x.why}] ${x.text.slice(0, 80)}`);
if (jsonOut) writeFileSync(resolve(ROOT, jsonOut), JSON.stringify({ dims, sentences }, null, 1) + "\n");
