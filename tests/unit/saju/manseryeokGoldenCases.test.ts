import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { resolveBirthTimeCalculation } from "@/lib/saju/birthTimePrecision";
import { DEFAULT_SAJU_TIME_POLICY } from "@/lib/saju/calcPolicy";
import { lunarToSolarDate } from "@/lib/saju/solarTerms";
import { MANSERYEOK_GOLDEN_CASES, MANSERYEOK_GOLDEN_PRIORITY, type ManseryeokGoldenCase } from "../../fixtures/saju/manseryeokGoldenCases";
import { LEGACY_ENGINE_GOLDEN_OUTPUT } from "../../fixtures/saju/manseryeokLegacyGoldenOutput";

// docs/manseryeok-golden-cases.csv is generated here (GOLDEN_WRITE=1) and otherwise locked to the engine.
// expected and other_app_settings come from the independent oracle (tests/oracle, ORACLE_WRITE=1); they are preserved on rewrite.
const CSV = resolve(__dirname, "../../../docs/manseryeok-golden-cases.csv");
const HEADER = ["id", "priority", "category", "calendar", "leap", "date", "time", "gender", "solar_date", "utc_offset_min", "correction_min",
  "current_engine", "new_unified", "new_split", "expected", "other_app_settings", "note"] as const;

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
function parsePreserved(): Map<string, { expected: string; other: string }> {
  try {
    const [header, ...rows] = readFileSync(CSV, "utf8").trim().split("\n").map((row) =>
      row.match(/("([^"]|"")*"|[^,]*)(,|$)/g)!.map((v) => v.replace(/,$/, "").replace(/^"|"$/g, "").replace(/""/g, '"')));
    // The file's own header locates the columns, so adding a column never shifts preserved values.
    const expected = header.indexOf("expected");
    const other = header.indexOf("other_app_settings");
    return new Map(rows.map((cells) => [cells[0], { expected: cells[expected] ?? "", other: other < 0 ? "" : cells[other] ?? "" }]));
  } catch {
    return new Map();
  }
}

function buildCsv(): string {
  const preserved = parsePreserved();
  const lines = MANSERYEOK_GOLDEN_CASES.map((c) => {
    const unified = run(c, "unified");
    const split = run(c, "split");
    const time = c.unknown ? "(미상)" : c.slot ? `(${c.slot})` : c.time;
    return [c.id, String(MANSERYEOK_GOLDEN_PRIORITY[c.id] ?? ""), c.category, c.calendar, c.leap ? "Y" : "N", c.date, time, c.gender === "MALE" ? "M" : "F", unified.birthDate,
      unified.offset, unified.correction, LEGACY_ENGINE_GOLDEN_OUTPUT[c.id] ?? "", unified.pillars, split.pillars,
      preserved.get(c.id)?.expected ?? "", preserved.get(c.id)?.other ?? "", c.note].map(cell).join(",");
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
