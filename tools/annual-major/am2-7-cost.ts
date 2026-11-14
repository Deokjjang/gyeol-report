/** AM2-7 8부(호출 0): P7 권별 비용 표(첫 묶음 · 문단 교체 · 다시 쓰기 비중) → ~/Desktop/gyeol-review/annual-major-02/P7-cost.md. 비교로 P6 같은 표를 함께 낸다. */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { OUT2 } from "./am2-6-books";

const IDS = ["annual-1", "annual-p5", "annual-p6a", "annual-p6b", "major-1", "major-p5", "major-p6a", "major-p6b"];
type Log = { kind: string; round: number; costUsd: number };
function row(stage: string, id: string) {
  const p = join(OUT2, `${stage}-${id}`, "snapshot.json");
  if (!existsSync(p)) return null;
  const m = (JSON.parse(readFileSync(p, "utf8")) as { evidencePacket: { meta: { costUsd: number; calls: unknown[]; durationMs: number; review: { log: Log[] } } } }).evidencePacket.meta;
  const first = m.review.log.filter(l => l.kind === "first"), rw = m.review.log.filter(l => l.kind === "rewrite");
  const sum = (ls: Log[]) => ls.reduce((a, l) => a + l.costUsd, 0);
  return { id, cost: m.costUsd, calls: m.calls.length, first: first.length, firstUsd: sum(first), rw: rw.length, rwUsd: sum(rw), rounds: [...new Set(rw.map(l => l.round))], sec: Math.round(m.durationMs / 1000) };
}
export function costTable(stage: string): string {
  const rows = IDS.map(id => row(stage, id)).filter((x): x is NonNullable<typeof x> => Boolean(x));
  const tot = rows.reduce((a, r) => a + r.cost, 0), rwt = rows.reduce((a, r) => a + r.rwUsd, 0);
  const pct = (a: number, b: number) => (b ? Math.round((100 * a) / b) : 0);
  return [`## ${stage}`, "", "| 책 | 비용 | 호출 | 첫 묶음(수 · 비용) | 문단 교체(수 · 비용, 회차) | 다시 쓰기 비중 | 시간 |", "|---|---|---|---|---|---|---|",
    ...rows.map(r => `| ${r.id} | $${r.cost.toFixed(4)} | ${r.calls} | ${r.first} · $${r.firstUsd.toFixed(4)} | ${r.rw} · $${r.rwUsd.toFixed(4)}${r.rounds.length ? ` (${r.rounds.map(x => `#${x}`).join(", ")})` : ""} | ${pct(r.rwUsd, r.cost)}% | ${r.sec}초 |`),
    `| **합** | **$${tot.toFixed(4)}** | ${rows.reduce((a, r) => a + r.calls, 0)} | | $${rwt.toFixed(4)} | ${pct(rwt, tot)}% | |`, ""].join("\n");
}
if (process.argv[1]?.endsWith("am2-7-cost.ts")) {
  const md = ["# P7 비용(AM2-7 8부)", "", costTable("P7"), costTable("P6")].join("\n");
  writeFileSync(join(OUT2, "P7-cost.md"), md);
  console.log(md);
}
