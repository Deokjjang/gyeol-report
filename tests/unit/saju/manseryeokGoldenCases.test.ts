import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { resolveBirthTimeCalculation } from "@/lib/saju/birthTimePrecision";
import { DEFAULT_SAJU_TIME_POLICY } from "@/lib/saju/calcPolicy";
import { lunarToSolarDate } from "@/lib/saju/solarTerms";
import { MANSERYEOK_GOLDEN_CASES, type ManseryeokGoldenCase } from "../../fixtures/saju/manseryeokGoldenCases";
import { LEGACY_ENGINE_GOLDEN_OUTPUT } from "../../fixtures/saju/manseryeokLegacyGoldenOutput";

// docs/manseryeok-golden-cases.csv is generated here (GOLDEN_WRITE=1) and otherwise locked to the engine.
// The expected column is left for a human to fill from a reference app; it is preserved on rewrite.
const CSV = resolve(__dirname, "../../../docs/manseryeok-golden-cases.csv");
const HEADER = ["id", "category", "calendar", "leap", "date", "time", "gender", "solar_date", "utc_offset_min", "correction_min",
  "current_engine", "new_unified", "new_split", "expected", "note"] as const;

function run(c: ManseryeokGoldenCase, ziHourRule: "unified" | "split") {
  try {
    const birthDate = c.calendar === "LUNAR" ? lunarToSolarDate(c.date, c.leap) : c.date;
    const r = resolveBirthTimeCalculation({ birthDate, birthTime: c.time, birthTimeUnknown: c.unknown, approximateBirthTimeSlot: c.slot },
      { ...DEFAULT_SAJU_TIME_POLICY, ziHourRule });
    const pillars = (["year", "month", "day", "hour"] as const).map((k) => k === "hour" && c.unknown ? "-"
      : r.stable[k] ? r.candidates[k][0].stem + r.candidates[k][0].branch : r.candidates[k].map((p) => p.stem + p.branch).join("/") + "?").join(" ");
    return { birthDate, pillars, offset: String(r.timeBasis?.utcOffsetMinutes ?? ""), correction: String(r.timeBasis?.solarTimeCorrectionMinutes ?? "") };
  } catch (error) {
    return { birthDate: "", pillars: `ERROR:${(error as Error).name}`, offset: "", correction: "" };
  }
}

const cell = (value: string) => /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
function parseExpected(): Map<string, string> {
  try {
    const rows = readFileSync(CSV, "utf8").trim().split("\n").slice(1);
    return new Map(rows.map((row) => {
      const cells = row.match(/("([^"]|"")*"|[^,]*)(,|$)/g)!.map((v) => v.replace(/,$/, "").replace(/^"|"$/g, "").replace(/""/g, '"'));
      return [cells[0], cells[HEADER.indexOf("expected")] ?? ""];
    }));
  } catch {
    return new Map();
  }
}

function buildCsv(): string {
  const expected = parseExpected();
  const lines = MANSERYEOK_GOLDEN_CASES.map((c) => {
    const unified = run(c, "unified");
    const split = run(c, "split");
    const time = c.unknown ? "(미상)" : c.slot ? `(${c.slot})` : c.time;
    return [c.id, c.category, c.calendar, c.leap ? "Y" : "N", c.date, time, c.gender === "MALE" ? "M" : "F", unified.birthDate,
      unified.offset, unified.correction, LEGACY_ENGINE_GOLDEN_OUTPUT[c.id] ?? "", unified.pillars, split.pillars,
      expected.get(c.id) ?? "", c.note].map(cell).join(",");
  });
  return [HEADER.join(","), ...lines].join("\n") + "\n";
}

describe("manseryeok golden cases", () => {
  it("required: 2000-05-11 17:05 female -> 庚辰 辛巳 己巳 壬申", () => {
    const c = MANSERYEOK_GOLDEN_CASES.find((value) => value.id === "G01")!;
    expect(run(c, "unified").pillars).toBe("庚辰 辛巳 己巳 壬申");
    expect(run(c, "split").pillars).toBe("庚辰 辛巳 己巳 壬申");
  });

  it("docs/manseryeok-golden-cases.csv matches the engine", () => {
    const csv = buildCsv();
    if (process.env.GOLDEN_WRITE === "1") writeFileSync(CSV, csv);
    expect(readFileSync(CSV, "utf8")).toBe(csv);
  });
});
