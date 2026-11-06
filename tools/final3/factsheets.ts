/**
 * 정답지 출력·자기검증(최종판3 1, 호출 0).
 *   NODE_PATH=tools/llm/shim pnpm exec tsx tools/final3/factsheets.ts [--sample 3000]
 * - 장덕민·장소담·전성민·최지우 정답지(저장본 입력과 같은 입력) → docs/v5/final3/factsheets/<이름>.json, 궁합은 <A>×<B>.json(pair 칸)
 * - 저장본 17권 정답지 자기검증 + 무작위 출생 표본 자기검증(비겁 기준 수정 전·후 모순 수).
 */
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { calculateSaju } from "../../src/lib/saju/calculateSaju";
import { groupStrength, groupLevel } from "../../src/lib/saju/groupStrength";
import { selfCheck } from "../../src/lib/factsheet/selfcheck";
import { factSheetOfSnap, type Snap } from "../final/replay";

const OUT = "docs/v5/final3/factsheets", STORED = ".cache/final3/stored";
mkdirSync(OUT, { recursive: true });
const snap = (name: string) => JSON.parse(readFileSync(join(STORED, `${name}.snapshot.json`), "utf8")) as Snap;

const lines: string[] = ["# 정답지 자기검증(최종판3 1, 호출 0)", "", "명령: `NODE_PATH=tools/llm/shim pnpm exec tsx tools/final3/factsheets.ts`", ""];
const fsDeokmin = factSheetOfSnap(snap("final2-deokmin-full"));
const fsSodam = factSheetOfSnap(snap("final2-sodam-career"));
const fsPair = factSheetOfSnap(snap("final2-sodam-seongmin"));
const fsJiwoo = factSheetOfSnap(snap("final-deokmin-jiwoo"));
const write = (name: string, v: unknown) => writeFileSync(join(OUT, `${name}.json`), JSON.stringify(v, null, 1) + "\n");
write("장덕민", { ...fsDeokmin, people: fsDeokmin.people });
write("장소담", fsSodam);
write("전성민", { ...fsPair, people: [fsPair.people[1]], pair: undefined });
write("최지우", { ...fsJiwoo, people: [fsJiwoo.people[1]], pair: undefined });
write("장소담×전성민", fsPair);
write("장덕민×최지우", fsJiwoo);

lines.push("## 저장본 17권 정답지 자기검증", "", "| 책 | 모순 |", "|---|---|");
for (const f of readdirSync(STORED).filter(x => x.endsWith(".snapshot.json")).sort()) {
  const issues = selfCheck(factSheetOfSnap(snap(f.replace(/\.snapshot\.json$/, ""))));
  lines.push(`| ${f.replace(/\.snapshot\.json$/, "")} | ${issues.length ? issues.map(i => `${i.who} ${i.kind}: ${i.detail}`).join("<br>") : "0"} |`);
}

// 무작위 출생 표본: 비겁 기준(일간 자신 포함 → 뺌) 전·후 「신약인데 비겁 강」 수.
const n = Number(process.argv[process.argv.indexOf("--sample") + 1]) || 3000;
let seed = 20261105; const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2 ** 31) / 2 ** 31);
let before = 0, after = 0, strongWeak = 0;
for (let i = 0; i < n; i++) {
  const y = 1950 + Math.floor(rnd() * 60), m = 1 + Math.floor(rnd() * 12), d = 1 + Math.floor(rnd() * 28), h = Math.floor(rnd() * 24), mi = Math.floor(rnd() * 60);
  const saju = calculateSaju({ birthDate: `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`, birthTime: `${String(h).padStart(2, "0")}:${String(mi).padStart(2, "0")}`, birthTimeUnknown: false, approximateBirthTimeSlot: "" as never, calendarType: "SOLAR", gender: rnd() < 0.5 ? "MALE" : "FEMALE", timezone: "Asia/Seoul" } as never);
  const lv = saju.structureAnalysis.dayMasterStrength.level, g = groupStrength(saju);
  const weak = lv === "WEAK" || lv === "VERY_WEAK";
  if (weak && (groupLevel(g.PEER.value + 1) === "strong" || g.RESOURCE.level === "strong")) before++;
  if (weak && (g.PEER.level === "strong" || g.RESOURCE.level === "strong")) after++;
  if ((lv === "STRONG" || lv === "VERY_STRONG") && g.PEER.level === "weak" && g.RESOURCE.level === "weak") strongWeak++;
}
lines.push("", `## 무작위 출생 ${n}명(1950~2009, 시각 있음)`, "", "| 모순 | 비겁에 일간 포함(수정 전) | 일간 뺌(수정 후) |", "|---|---|---|",
  `| 신약·매우 신약인데 비겁 또는 인성 강 | ${before} | ${after} |`, `| 신강·매우 신강인데 비겁·인성 모두 약 | — | ${strongWeak} |`);
writeFileSync("docs/v5/final3/factsheet-selfcheck.md", lines.join("\n") + "\n");
console.log(lines.slice(-6).join("\n"));
console.log("장덕민 비겁", JSON.stringify(fsDeokmin.people[0].groups.PEER), fsDeokmin.people[0].strength.labelKo);
