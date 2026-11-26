/**
 * ZW-1 2부 · 자미두수 DB 결정론 검사(tests/unit/ziwei/dbCheck.ts). 위반 0 · 단계별 수량.
 * 보고: ZW_DB_REPORT=<경로>를 주면 가족별 수량 · 명리 그림 근접 목록을 JSON으로 쓴다.
 * PHASE: "pilot"(2부 파일럿 항목이 모두 있다) → 3부 본작성 뒤 "full"(481 수량 100%).
 */
import { writeFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { FULL_COUNTS, fullExpectedIds, PILOT_IDS, runZiweiDbCheck } from "./dbCheck";

const PHASE = "full" as "pilot" | "full";

describe("자미두수 DB", () => {
  const report = runZiweiDbCheck();
  it("결정론 검사 위반 0", () => {
    expect(report.issues.map(i => `${i.file} ${i.id} [${i.rule}] ${i.text ?? ""}`)).toEqual([]);
  });
  it("보고: 가족별 수량 · 문장 · 그림 · 명리 그림 근접(실패 아님)", () => {
    const out = process.env.ZW_DB_REPORT;
    if (out) writeFileSync(out, JSON.stringify({ counts: report.counts, sentences: report.sentences, images: report.images, myeongriImageNear: report.myeongriImageNear }, null, 1));
    expect(report.images).toBeGreaterThan(0);
  });
  it(`수량(${PHASE})`, () => {
    if (PHASE === "pilot") expect(PILOT_IDS.filter(id => !report.ids.has(id))).toEqual([]);
    else {
      expect(fullExpectedIds().filter(id => !report.ids.has(id))).toEqual([]);
      expect(report.counts).toEqual(FULL_COUNTS);
      expect(report.ids.size).toBe(Object.values(FULL_COUNTS).reduce((a, b) => a + b, 0));
    }
  });
});
