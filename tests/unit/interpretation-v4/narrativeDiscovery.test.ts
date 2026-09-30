import { writeFileSync } from "node:fs";
import { expect, it } from "vitest";
import { calculateSaju } from "../../../src/lib/saju/calculateSaju";
import { buildMyeongliMaterialPacket } from "../../../src/lib/interpretation-v4/materialPacket";

it("finds an actual Jia ENTJ chart with wealth, officer, needle and recognition evidence", () => {
  let found: unknown;
  search: for (const year of [1988, 1992, 1994, 1984, 1990, 1996, 2001, 1986, 1998]) for (let month = 1; month <= 12; month++) for (const day of [6, 18, 27]) for (const time of ["01:30", "05:30", "09:30", "13:30", "17:30", "21:30"]) {
    const date = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const calculation = calculateSaju({ birthDate: date, birthTime: time, birthTimeUnknown: false, calendarType: "SOLAR", gender: "FEMALE", timezone: "Asia/Seoul" });
    if (calculation.dayMaster !== "甲") continue;
    const packet = buildMyeongliMaterialPacket({ calculation, mbti: "ENTJ" });
    if (["entj-wealth", "entj-pressure", "entj-needle"].every(id => packet.fusions.some(f => f.ruleId === id)) && packet.fortuneComposites.some(f => f.ruleId === "wealth-and-name")) {
      found = { date, time, pillars: calculation.pillars, features: packet.selected.map(m => m.feature), fusions: packet.fusions, fortune: packet.fortuneComposites };
      break search;
    }
  }
  expect(found).toBeDefined();
  if (process.env.V4_PHASE4_DISCOVER === "1") writeFileSync("/tmp/gyeol-v4-phase4a-discovery.json", JSON.stringify(found, null, 2));
}, 30000);
