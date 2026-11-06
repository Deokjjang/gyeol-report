/**
 * calc-audit 1-a 2부: tzdata와 한국천문연구원 역서 이력이 어긋나는 구간을 매분 훑어
 * 엔진(= tzdata) 기둥과 달라지는 「출생 시계 시각」 구간을 모두 뽑는다.
 *   KASI-w: 역서 시각을 「바뀌기 직전 시계」로 읽음(data/kasi-almanac-2023-korea.zi 그대로)
 *   KASI-s: 역서 시각을 모두 「표준시」로 읽음(같은 파일의 Rule 시각에 s 접미사)
 * 실행: pnpm exec tsx scripts/calc-audit/uncertain-windows.ts   (출력: docs/v5/calc-audit/uncertain-windows.json)
 */
import { readFileSync, writeFileSync } from "node:fs";
import { calculateSaju } from "../../src/lib/saju/calculateSaju";
import { KASI, TZDATA, parseZic, reference, type TzModel } from "./reference";

const here = new URL(".", import.meta.url);
const OUT = new URL("../../docs/v5/calc-audit/", import.meta.url);
const MIN = 60_000, DAY = 1440 * MIN;
const kasiText = readFileSync(new URL("data/kasi-almanac-2023-korea.zi", here), "utf8");
// Rule 줄의 AT 칸(8번째 칸)에 s 접미사를 붙인다.
const standardReading = kasiText.split("\n").map((line) => {
  if (!line.startsWith("Rule\tKASI")) return line;
  const cols = line.split("\t");
  cols[7] = `${cols[7].trim()}s`;
  return cols.join("\t");
}).join("\n");
const KASI_S: TzModel = { name: "kasi-almanac-2023-standard-reading", periods: parseZic(standardReading) };

// 두 이력 중 하나라도 전환이 있는 날(벽시계 기준) 앞뒤 하루.
const days = new Set<string>();
for (const m of [TZDATA, KASI, KASI_S]) for (const p of m.periods) if (Number.isFinite(p.startUtc) && p.startUtc > Date.UTC(1940, 0, 1)) {
  const wall = p.startUtc + 9 * 3600_000;
  for (const s of [-DAY, 0, DAY]) days.add(new Date(wall + s).toISOString().slice(0, 10));
}
type Window = { model: string; from: string; to: string; minutes: number; pillars: string[]; example: string };
const windows: Window[] = [];
const P = ["year", "month", "day", "hour"] as const;
for (const model of [KASI, KASI_S]) {
  let open: Window | null = null;
  for (const date of [...days].sort()) for (let m = 0; m < 1440; m++) {
    const time = `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
    const e = calculateSaju({ birthDate: date, birthTime: time, birthTimeUnknown: false, calendarType: "SOLAR", gender: "MALE", timezone: "Asia/Seoul" });
    const k = reference({ date, time }, model);
    const ep = Object.fromEntries(P.map((p) => [p, e.pillars[p]!.stem + e.pillars[p]!.branch]));
    const diff = P.filter((p) => ep[p] !== k.pillars[p]);
    const stamp = `${date}T${time}`;
    if (diff.length) {
      if (open && open.to === prevMinute(stamp)) { open.to = stamp; open.minutes++; for (const d of diff) if (!open.pillars.includes(d)) open.pillars.push(d); }
      else { open = { model: model.name, from: stamp, to: stamp, minutes: 1, pillars: [...diff], example: `${stamp} 엔진 ${P.map((p) => ep[p]).join(" ")} / ${model.name} ${P.map((p) => k.pillars[p]).join(" ")}` }; windows.push(open); }
    }
  }
}
function prevMinute(stamp: string) { return new Date(Date.parse(`${stamp}:00Z`) - MIN).toISOString().slice(0, 16); }
const out = { sweptDays: days.size, sweptMinutes: days.size * 1440 * 2, windows };
writeFileSync(new URL("uncertain-windows.json", OUT), JSON.stringify(out, null, 2) + "\n");
console.log(JSON.stringify(out, null, 2));
