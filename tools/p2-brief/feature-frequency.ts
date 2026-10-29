/**
 * trait 희소성 표: 무작위 출생(1940~2015, 시간 미상 25%) N명 중 각 지식 id가 감지된 비율 → src/lib/brief/data/feature-frequency.json.
 * 실행: pnpm exec tsx tools/p2-brief/feature-frequency.ts [N=8000]
 */
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { collectFeatureHits } from "../../src/lib/brief/featureHits";
import { createRng } from "../../src/lib/brief/seed";
import { calculateSaju } from "../../src/lib/saju/calculateSaju";
import { analyzeChartDetections } from "../../src/lib/saju/detections";

const N = Number(process.argv[2] ?? 8000);
const rng = createRng(20261029);
const counts = new Map<string, number>(); let ok = 0;
for (let i = 0; i < N; i++) {
  const y = 1940 + rng.int(76), m = 1 + rng.int(12), d = 1 + rng.int(28), unknown = rng.next() < 0.25;
  try {
    const saju = calculateSaju({ birthDate: `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`, birthTime: unknown ? "" : `${String(rng.int(24)).padStart(2, "0")}:${String(rng.int(60)).padStart(2, "0")}`, birthTimeUnknown: unknown, calendarType: "SOLAR", gender: rng.next() < 0.5 ? "MALE" : "FEMALE", timezone: "Asia/Seoul" });
    const ids = new Set(collectFeatureHits(saju, analyzeChartDetections(saju)).map(h => h.id));
    for (const id of ids) counts.set(id, (counts.get(id) ?? 0) + 1);
    ok++;
  } catch { /* 절기 경계일 + 시간 미상은 calculateSaju가 거절(기존 동작) */ }
}
const table = Object.fromEntries([...counts].sort(([a], [b]) => a.localeCompare(b)).map(([id, n]) => [id, Math.round((n / ok) * 10000) / 10000]));
writeFileSync(join(import.meta.dirname, "../../src/lib/brief/data/feature-frequency.json"), JSON.stringify(table, null, 1) + "\n");
console.log(`charts ${ok}/${N}, ids ${counts.size}`);
