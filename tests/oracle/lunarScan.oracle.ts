import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { it } from "vitest";
import { lunarToSolarDate } from "@/lib/saju/solarTerms";
import { lunarToSolar } from "./oracle";

// Lunar month 1st day, 1930-2025: engine (lunar-javascript, Chinese UTC+8 calendar) vs oracle (KST new moon).
// Not part of `pnpm test`. Run: pnpm exec vitest run --config tests/oracle/vitest.oracle.config.ts
it("lunar month starts: engine vs oracle", { timeout: 600_000 }, () => {
  const rows = [["lunar_date", "engine", "oracle", "days"]];
  for (let year = 1930; year <= 2025; year++) {
    for (let month = 1; month <= 12; month++) {
      const date = `${year}-${String(month).padStart(2, "0")}-01`;
      const engine = lunarToSolarDate(date, false);
      const oracle = lunarToSolar(date, false);
      if (engine !== oracle) rows.push([date, engine, oracle, String((Date.parse(oracle) - Date.parse(engine)) / 86_400_000)]);
    }
  }
  writeFileSync(resolve(__dirname, "../../docs/v5/oracle-lunar-differences.csv"), rows.map((row) => row.join(",")).join("\n") + "\n");
});
