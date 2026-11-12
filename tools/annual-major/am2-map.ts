/**
 * AM2-3 0번 결함 지도(호출 0): am2-3-defects.ts 의 결함마다 원인 층 · 고칠 곳(파일:줄, 지금 코드에서 찾음) · 재발 방지 검사 · 확인 방법을 표로 낸다.
 *   NODE_PATH=tools/llm/shim pnpm exec tsx tools/annual-major/am2-map.ts [--hit <am2-hit 출력.txt> ...] > map.md
 * --hit: am2-hit.ts --src 출력(| id | sev | 적중/놓침/근원 | 규칙 | …). 주면 확인 방법 칸에 P2 replay 결과를 적는다.
 */
import { readFileSync } from "node:fs";
import { DEFECTS, DEFECTS_4, FEEDBACK, type Defect } from "./am2-3-defects";

const argv = process.argv.slice(2);
const hit = new Map<string, { state: string; rules: string }>();
argv.forEach((a, i) => { if (a !== "--hit") return;
  for (const line of readFileSync(argv[i + 1], "utf8").split("\n")) { const m = line.match(/^\| ([A-Z]-[a-z]?\d+) \| [^|]+ \| (적중|놓침|근원) \| ([^|]+) \|/); if (m) hit.set(m[1], { state: m[2], rules: m[3].trim() }); } });

const files = new Map<string, string[]>();
const linesOf = (f: string) => { if (!files.has(f)) { try { files.set(f, readFileSync(f, "utf8").split("\n")); } catch { files.set(f, []); } } return files.get(f)!; };
const LAYER: Record<Defect["layer"], string> = { card: "카드", plan: "설계도", input: "작가 입력", rule: "작가 규칙", check: "결정론 검사", screen: "화면" };

/** 기호 설명에서 찾을 말: 영문 식별자(3자 이상) → 「인용」 조각 → 한글 첫 낱말. 처음 맞는 줄. */
function locate(file: string, sym: string): string {
  const L = linesOf(file); if (!L.length) return file;
  const ids = sym.match(/[A-Za-z_][A-Za-z0-9_]{2,}/g) ?? [], quotes = [...sym.matchAll(/「([^」]+)」/g)].map(m => m[1].replace(/…/g, "").slice(0, 12)).filter(q => q.length >= 2);
  const words = sym.replace(/[「」()·→]/g, " ").split(/\s+/).filter(w => /^[가-힣]{2,}$/.test(w));
  for (const needle of [...ids, ...quotes, ...words]) {
    const at = L.findIndex(l => l.includes(needle) && (ids.includes(needle) ? new RegExp(`(?:const|function|let|export|type|[{,]\\s*)\\s*${needle}\\b|\\b${needle}\\s*[=:(]`).test(l) : true));
    const any = at >= 0 ? at : L.findIndex(l => l.includes(needle));
    if (any >= 0) return `${file}:${any + 1}`;
  }
  return file;
}
const short = (p: string) => p.replace(/^src\/lib\/writer\/chunked\//, "chunked/").replace(/^src\/lib\/writer\//, "writer/").replace(/^src\/lib\/brief\//, "brief/").replace(/^src\/data\/knowledge-v5\//, "knowledge-v5/").replace(/^src\/lib\//, "");
const cell = (t: string) => t.replace(/\|/g, "\\|").replace(/\n/g, " ");

function row(d: Defect): string {
  const where = d.fix.length ? d.fix.map(([f, s]) => `${short(locate(f, s))} ${s}`).join("<br>") : "—(고치지 않음, 목록만)";
  const h = hit.get(d.id);
  const how = d.det.length ? (h ? `P2 replay ${h.state}(${h.rules})` : `결정론 검사 ${d.det.join("·")}`) + (d.proof ? ` · ${d.proof}` : "") : (d.proof ?? "판독");
  return `| ${d.id} | ${d.sev} | ${cell(d.loc)} | ${cell(d.what)} | ${LAYER[d.layer]} | ${cell(where)} | ${d.det.join("·") || "—(근원)"} | ${cell(how)} |`;
}
const head = "| id | 등급 | 자리 | 결함 | 원인 층 | 고칠 곳(파일:줄 기호) | 재발 방지 검사 | 확인 방법 |\n|---|---|---|---|---|---|---|---|";
const groups: [string, readonly Defect[]][] = [
  ["P2 세운 annual-1", DEFECTS.filter(d => d.src === "P2-annual-1")], ["P2 대운 major-1", DEFECTS.filter(d => d.src === "P2-major-1")],
  ["AM-01 4종", DEFECTS_4], ["덕짱님 피드백 6가지", FEEDBACK]];
for (const [name, ds] of groups) {
  const n = (s: string) => ds.filter(d => d.sev === s).length, layers = Object.entries(ds.reduce<Record<string, number>>((o, d) => ({ ...o, [LAYER[d.layer]]: (o[LAYER[d.layer]] ?? 0) + 1 }), {})).map(([k, v]) => `${k} ${v}`).join(" · ");
  console.log(`\n#### ${name} — ${["차단", "경계", "경미", "객관", "피드백"].filter(s => n(s)).map(s => `${s} ${n(s)}`).join(" / ")} (원인 층: ${layers})\n\n${head}\n${ds.map(row).join("\n")}`);
}
