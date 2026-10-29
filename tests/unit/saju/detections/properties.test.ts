/** 성질 테스트: 결정론 의사난수 출생 입력 300건(시간 미상) + 유입 기둥. */
import { describe, expect, it } from "vitest";
import { collectFeatureHits } from "@/lib/brief/featureHits";
import { calculateSaju } from "@/lib/saju/calculateSaju";
import { SEXAGENARY_CYCLE } from "@/lib/saju/constants";
import { analyzeChartDetections, analyzeIncoming, type TemporalPosition } from "@/lib/saju/detections";
import type { SajuCalcInput, SajuCalcResult } from "@/lib/saju/types";

function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function charts(n: number, seed: number, timeUnknown: boolean): SajuCalcResult[] {
  const rand = rng(seed);
  const out: SajuCalcResult[] = [];
  while (out.length < n) {
    const year = 1940 + Math.floor(rand() * 76);
    const month = 1 + Math.floor(rand() * 12);
    const day = 1 + Math.floor(rand() * 28);
    const input: SajuCalcInput = {
      birthDate: `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
      ...(timeUnknown ? {} : { birthTime: `${String(Math.floor(rand() * 24)).padStart(2, "0")}:${String(Math.floor(rand() * 60)).padStart(2, "0")}` }),
      birthTimeUnknown: timeUnknown,
      calendarType: "SOLAR",
      gender: rand() < 0.5 ? "MALE" : "FEMALE",
      timezone: "Asia/Seoul",
    };
    try {
      out.push(calculateSaju(input));
    } catch {
      // 절입 경계에서 시간 미상이면 원국이 하나로 정해지지 않아 계산을 거부한다(기존 동작).
    }
  }
  return out;
}

const unknown = charts(300, 7, true);
const known = charts(100, 11, false);

describe("시간 미상 → 시주 관여 0건", () => {
  it("300건 모두 detection·featureHit 어디에도 hour가 없다", () => {
    for (const saju of unknown) {
      const det = analyzeChartDetections(saju, { gongmangBasis: "day+year" });
      expect(det.hourIncluded).toBe(false);
      const json = JSON.stringify(det);
      expect(json).not.toContain('"hour"');
      for (const hit of collectFeatureHits(saju, det)) expect(hit.positions).not.toContain("hour");
    }
  }, 30_000);
  it("시간을 알면 hourIncluded=true이고 시지 운성이 있다", () => {
    for (const saju of known) {
      const det = analyzeChartDetections(saju);
      expect(det.hourIncluded).toBe(true);
      expect(det.twelveStages.map((t) => t.position)).toContain("hour");
    }
  }, 30_000);
});

describe("결정론", () => {
  it("같은 입력 → 깊은 동일 출력", () => {
    for (const saju of [...unknown.slice(0, 100), ...known.slice(0, 50)]) {
      const again = calculateSaju(saju.input);
      expect(analyzeChartDetections(again)).toEqual(analyzeChartDetections(saju));
      expect(collectFeatureHits(again, analyzeChartDetections(again))).toEqual(collectFeatureHits(saju, analyzeChartDetections(saju)));
    }
  }, 30_000);
});

describe("유입 관계", () => {
  it("유입 관계는 늘 유입 기둥을 구성원으로 갖고 adjacent=false", () => {
    const rand = rng(99);
    const positions: TemporalPosition[] = ["dayun", "annual", "monthly"];
    let relationCount = 0;
    for (const saju of [...unknown, ...known]) {
      const position = positions[Math.floor(rand() * 3)];
      const pillar = SEXAGENARY_CYCLE[Math.floor(rand() * 60)];
      const inc = analyzeIncoming(saju, position, pillar);
      relationCount += inc.relations.length;
      for (const r of inc.relations) {
        expect(r.members.some((m) => m.position === position)).toBe(true);
        expect(r.adjacent).toBe(false);
        if (saju.input.birthTimeUnknown) expect(r.members.map((m) => m.position)).not.toContain("hour");
      }
    }
    expect(relationCount).toBeGreaterThan(100);
  }, 30_000);
});
