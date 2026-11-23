/**
 * ZW-1 2부 · 자미두수 DB 결정론 검사(tests/unit/ziwei/dbCheck.ts). 위반 0 · 단계별 수량.
 * PHASE: "pilot"(2부 파일럿 항목이 모두 있다) → 3부 본작성 뒤 "full"(481 수량 100%).
 */
import { describe, expect, it } from "vitest";
import { PILOT_IDS, runZiweiDbCheck } from "./dbCheck";

const PHASE: "pilot" | "full" = "pilot";

describe("자미두수 DB", () => {
  const report = runZiweiDbCheck();
  it("결정론 검사 위반 0", () => {
    expect(report.issues.map(i => `${i.file} ${i.id} [${i.rule}] ${i.text ?? ""}`)).toEqual([]);
  });
  it(`수량(${PHASE})`, () => {
    if (PHASE === "pilot") expect(PILOT_IDS.filter(id => !report.ids.has(id))).toEqual([]);
  });
});
