/**
 * 저장본 17권 모으기(최종판3 5, 호출 0): P6d 4·P6e 5(docs/v5/baseline) + 최종 4·최종2 4(로컬 DB 발행본)를 한 폴더에 <이름>.snapshot.json으로.
 *   NODE_PATH=tools/llm/shim pnpm exec tsx tools/final3/export-stored.ts [.cache/final3/stored]
 */
import { copyFileSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { loadSnap } from "../final/replay";

export const STORED_DB: Readonly<Record<string, string>> = {
  "final-deokmin-career": "report_065b67917da04a3983333fa0bbfdb296",
  "final-deokmin-love": "report_8dbe7218366449868ff33aaf364f1a58",
  "final-deokmin-jiwoo": "report_c136f0c838d94fd0811717ca80883562",
  "final-sodam-full-dating": "report_0c7636d107c84b8baa997c7051fe5cea",
  "final2-deokmin-full": "report_ef42d66ffef340f0b9de46d2eb57af16",
  "final2-sodam-career": "report_fe29cb0ed88a4a459c14f1b377a3a9bf",
  "final2-sodam-love": "report_a29459e21b9548e79d3e3a5cd33e118e",
  "final2-sodam-seongmin": "report_4d95800013d242e48022248ca9394bf2",
};
const BASE: Readonly<Record<string, string>> = {
  "p6d-chaerin-love": "docs/v5/baseline/p6d/chaerin-love", "p6d-pair-business": "docs/v5/baseline/p6d/pair-business", "p6d-sodam-full": "docs/v5/baseline/p6d/sodam-full", "p6d-taeo-career": "docs/v5/baseline/p6d/taeo-career",
  "p6e-chaerin-love": "docs/v5/baseline/p6e/chaerin-love", "p6e-pair-business": "docs/v5/baseline/p6e/pair-business", "p6e-seoha-love-single": "docs/v5/baseline/p6e/seoha-love-single", "p6e-sodam-full": "docs/v5/baseline/p6e/sodam-full", "p6e-taeo-career": "docs/v5/baseline/p6e/taeo-career",
};

if (process.argv[1]?.endsWith("export-stored.ts")) void (async () => {
  const dir = process.argv[2] ?? ".cache/final3/stored";
  mkdirSync(dir, { recursive: true });
  for (const [name, src] of Object.entries(BASE)) copyFileSync(`${src}.snapshot.json`, join(dir, `${name}.snapshot.json`));
  for (const [name, id] of Object.entries(STORED_DB)) { const { snap } = await loadSnap(id); writeFileSync(join(dir, `${name}.snapshot.json`), JSON.stringify(snap)); }
  console.log(`저장본 ${Object.keys(BASE).length + Object.keys(STORED_DB).length}권 → ${dir}`);
})();
