/**
 * ZW-1 1부 · 골든 명반 20(공개 명반, tests/fixtures/ziwei/golden-20.json). 공개된 음력 날짜 · 시진을 넣어 공개값과 맞댄다.
 * 한국 · 중국 음력이 다른 날의 골든은 넣지 않는다(덕짱 수정 5) — 표의 krcn이 모두 「같음」이어야 하고, 시험이 다시 확인한다.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { Solar } from "lunar-javascript";
import { computeZiweiChart } from "@/lib/ziwei/chart";
import { solarToKoreanLunar } from "@/lib/ziwei/lunar";
import { compareWithVerifier, invariantViolations } from "./helpers";

type Golden = {
  id: string; source: string; program: string; input: { birthDate: string; slot: string; gender: "MALE" | "FEMALE" };
  lunar: [number, number, number, boolean]; krcn: string; life: string; body: string; class: number;
  firstDecadal?: [number, number]; direction?: "forward" | "backward";
  majors: Record<string, string>; minors?: Record<string, string>; mutagens?: (string | null)[];
};
const FIXTURE = JSON.parse(readFileSync(resolve(__dirname, "../../fixtures/ziwei/golden-20.json"), "utf8")) as { charts: Golden[] };

describe("골든 명반 20", () => {
  it("20개, 출처가 있고, 모두 한중 음력이 같은 날", () => {
    expect(FIXTURE.charts).toHaveLength(20);
    for (const g of FIXTURE.charts) {
      expect(g.source, g.id).toMatch(/^https:\/\//);
      const kr = solarToKoreanLunar(g.input.birthDate);
      const [y, m, d] = g.input.birthDate.split("-").map(Number);
      const cn = (Solar as unknown as { fromYmd(y: number, m: number, d: number): { getLunar(): { getYear(): number; getMonth(): number; getDay(): number } } }).fromYmd(y, m, d).getLunar();
      expect([kr.year, kr.month, kr.day, kr.leap], `${g.id} 한국 음력 = 공개 음력`).toEqual(g.lunar);
      expect([cn.getYear(), Math.abs(cn.getMonth()), cn.getDay(), cn.getMonth() < 0], `${g.id} 중국 음력 = 공개 음력`).toEqual(g.lunar);
      expect(g.krcn).toBe("같음");
    }
  });

  for (const g of FIXTURE.charts) {
    it(`${g.id} ${g.program} ${g.input.birthDate} ${g.input.slot}`, () => {
      const c = computeZiweiChart({ birthDate: g.input.birthDate, birthTime: "", birthTimeUnknown: false, approximateBirthTimeSlot: g.input.slot, gender: g.input.gender } as never, "2026-11-24");
      const got: Record<string, unknown> = { life: c.lifePalace.branch, body: c.bodyPalace.branch, class: c.fiveClass.number };
      const want: Record<string, unknown> = { life: g.life, body: g.body, class: g.class };
      for (const id of Object.keys(g.majors)) { got[id] = c.stars.find(s => s.id === id)?.branch; want[id] = g.majors[id]; }
      for (const id of Object.keys(g.minors ?? {})) { got[id] = c.stars.find(s => s.id === id)?.branch; want[id] = g.minors![id]; }
      if (g.mutagens) g.mutagens.forEach((star, i) => { if (star !== null) { got[`사화${i}`] = c.mutagens[i].star; want[`사화${i}`] = star; } });
      if (g.firstDecadal) { got.firstDecadal = [c.decadals[0].startAge, c.decadals[0].endAge]; want.firstDecadal = g.firstDecadal; }
      if (g.direction) { got.direction = c.direction; want.direction = g.direction; }
      expect(got).toEqual(want);
      expect(compareWithVerifier(c)).toEqual([]);
      expect(invariantViolations(c)).toEqual([]);
    });
  }
});
