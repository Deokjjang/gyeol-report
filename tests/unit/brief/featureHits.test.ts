import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { collectFeatureHits } from "@/lib/brief/featureHits";
import type { FeatureHit } from "@/lib/brief/featureTypes";
import { calculateSaju } from "@/lib/saju/calculateSaju";
import { analyzeChartDetections } from "@/lib/saju/detections";
import type { Gender } from "@/lib/saju/types";
import { chartOf } from "../saju/detections/chartFixture";

const DIR = join(__dirname, "../../../src/data/knowledge-v5/myeongri");
const KNOWLEDGE = new Map<string, string>(
  readdirSync(DIR)
    .filter((f) => f.endsWith(".json"))
    .flatMap((f) => (JSON.parse(readFileSync(join(DIR, f), "utf8").replace(/^﻿/, "")) as { features: { id: string; family: string }[] }).features)
    .map((x) => [x.id, x.family]),
);

const hitsOf = (text: string, opts: { gender?: Gender; timeUnknown?: boolean } = {}) => {
  const saju = chartOf(text, opts);
  return collectFeatureHits(saju, analyzeChartDetections(saju));
};
const byId = (hits: readonly FeatureHit[], id: string, variantKey?: string) =>
  hits.filter((h) => h.id === id && (variantKey === undefined || h.variantKey === variantKey));

describe("collectFeatureHits: id 무결성", () => {
  it("실제 입력 600건의 모든 id가 지식 DB에 있고 family가 같다", () => {
    let total = 0;
    for (let i = 0; i < 600; i += 1) {
      const year = 1940 + ((i * 37) % 76);
      const month = 1 + ((i * 7) % 12);
      const day = 1 + ((i * 11) % 28);
      const unknown = i % 5 === 0;
      let saju;
      try {
        saju = calculateSaju({
          birthDate: `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
          ...(unknown ? {} : { birthTime: `${String((i * 5) % 24).padStart(2, "0")}:${String((i * 13) % 60).padStart(2, "0")}` }),
          birthTimeUnknown: unknown,
          calendarType: "SOLAR",
          gender: (["MALE", "FEMALE", "OTHER_OR_UNSPECIFIED"] as const)[i % 3],
          timezone: "Asia/Seoul",
        });
      } catch {
        continue;
      }
      for (const hit of collectFeatureHits(saju, analyzeChartDetections(saju))) {
        expect(KNOWLEDGE.get(hit.id), hit.id).toBe(hit.family);
        expect(hit.count).toBeGreaterThanOrEqual(1);
        if (unknown) expect(hit.positions).not.toContain("hour");
        total += 1;
      }
    }
    expect(total).toBeGreaterThan(600 * 20);
  });
});

describe("collectFeatureHits: 가족별 매핑", () => {
  const hits = hitsOf("甲子 丙寅 甲午 丙寅");

  it("일간·일주는 day 자리, 천간은 일간 제외 자리 합본", () => {
    expect(byId(hits, "dayMaster:甲")[0].positions).toEqual(["day"]);
    expect(byId(hits, "dayPillar:甲午")[0].positions).toEqual(["day"]);
    expect(byId(hits, "stem:甲")[0].positions).toEqual(["year"]);
    expect(byId(hits, "stem:丙")[0]).toMatchObject({ positions: ["month", "hour"], count: 2 });
  });

  it("지지는 모든 자리, 십성은 천간(년·월·시) + 지지 본기(일지 포함)", () => {
    expect(byId(hits, "branch:寅")[0].positions).toEqual(["month", "hour"]);
    expect(byId(hits, "tenGod:傷官")[0].positions).toEqual(["day"]); // 午 본기 丁 = 甲의 傷官
    expect(byId(hits, "tenGod:食神")[0].positions).toEqual(["month", "hour"]); // 丙 투간
  });

  it("십이운성은 자리별, 월·일 strong / 년·시 weak", () => {
    expect(byId(hits, "twelveStage:建祿")[0]).toMatchObject({ positions: ["month", "hour"], strength: "strong", count: 2 });
    expect(byId(hits, "twelveStage:沐浴")[0]).toMatchObject({ positions: ["year"], strength: "weak" });
  });

  it("관계는 variantKey별, 충은 월-일 strong·년-시 weak", () => {
    expect(byId(hits, "relation:CHUNG", "子午")[0]).toMatchObject({ positions: ["year", "day"], strength: "medium" });
    const mdClash = hitsOf("甲子 庚午 甲子 丙寅");
    expect(byId(mdClash, "relation:CHUNG", "子午")[0]).toMatchObject({ strength: "strong", count: 2 });
    const yhClash = hitsOf("甲子 丙寅 甲辰 庚午");
    expect(byId(yhClash, "relation:CHUNG", "子午")[0].strength).toBe("weak");
  });

  it("원진은 shinsal:WONJIN(variantKey 포함)으로 낸다", () => {
    const w = byId(hitsOf("甲子 辛未 戊寅 庚申"), "shinsal:WONJIN", "子未")[0];
    expect(w).toMatchObject({ family: "shinsal", positions: ["year", "month"], count: 1 });
  });

  it("삼합 full strong, 인접 반합 medium, 떨어진 반합 weak", () => {
    expect(byId(hitsOf("甲申 丙子 戊辰 庚午"), "relation:SAMHAP", "申子辰")[0].strength).toBe("strong");
    expect(byId(hitsOf("甲子 丙辰 戊午 庚午"), "relation:SAMHAP")[0].strength).toBe("medium");
    expect(byId(hitsOf("甲子 丙寅 戊午 庚辰"), "relation:SAMHAP", "申子辰")[0].strength).toBe("weak");
  });

  it("오행: 라벨 없는 오행은 BALANCED, 음양은 성별 접미(미지정·BALANCED는 없음)", () => {
    const saju = chartOf("甲子 丙寅 甲午 丙寅");
    const labeled = new Set(saju.elements.labels.map((l) => l.split("_")[0]));
    const elementHits = hits.filter((h) => h.family === "element");
    expect(elementHits).toHaveLength(5);
    for (const h of elementHits) expect(h.id.endsWith(":BALANCED")).toBe(!labeled.has(h.id.split(":")[1]));
    expect(hits.find((h) => h.family === "yinYang")?.id).toBe("yinYang:YANG_HEAVY:FEMALE");
    expect(hitsOf("甲子 丙寅 甲午 丙寅", { gender: "OTHER_OR_UNSPECIFIED" }).find((h) => h.family === "yinYang")?.id).toBe("yinYang:YANG_HEAVY");
    expect(hitsOf("甲子 丁卯 甲午 丁卯", { gender: "MALE" }).find((h) => h.family === "yinYang")?.id).toBe("yinYang:BALANCED");
  });

  it("조후는 climate:<일간>:<계절>, strength = level", () => {
    const saju = chartOf("甲子 丙寅 甲午 丙寅");
    const det = analyzeChartDetections(saju);
    expect(byId(hits, `climate:甲:spring`)[0]).toMatchObject({ positions: [], strength: det.climate.level });
  });

  it("기존 귀인 코드는 gwiin 가족, 현침살은 글자 수로 강약", () => {
    expect(hits.filter((h) => h.id.startsWith("gwiin:")).every((h) => h.family === "gwiin")).toBe(true);
    const h3 = byId(hitsOf("甲午 辛卯 甲申 丙寅"), "shinsal:HYEONCHIMSAL")[0];
    expect(h3.strength).toBe("strong");
  });

  it("구조 3코드는 structureFlows에서 structure:<code>로 낸다", () => {
    for (let i = 0; i < 400; i += 1) {
      const saju = calculateSaju({ birthDate: `${1950 + (i % 60)}-${String(1 + (i % 12)).padStart(2, "0")}-${String(1 + (i % 27)).padStart(2, "0")}`, birthTime: `${String(i % 24).padStart(2, "0")}:30`, birthTimeUnknown: false, calendarType: "SOLAR", gender: "MALE", timezone: "Asia/Seoul" });
      const det = analyzeChartDetections(saju);
      const ids = collectFeatureHits(saju, det).map((h) => h.id);
      for (const f of det.structureFlows) expect(ids).toContain(`structure:${f.code}`);
    }
  });

  it("시간 미상이면 시주가 있어도 hour 자리 hit 0", () => {
    const unknown = hitsOf("甲子 丙寅 甲午 丙寅", { timeUnknown: true });
    expect(unknown.flatMap((h) => h.positions)).not.toContain("hour");
    expect(byId(unknown, "stem:丙")[0].count).toBe(1);
  });
});
