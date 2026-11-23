/** ZW-1 1부 · 무작위 1만 명 조각 3/4(2,500명): 어댑터 ↔ 소형 검증기 일치 + 불변식. */
import { expect, it } from "vitest";
import { randomShardFailures } from "./helpers";

it("무작위 2,500명(조각 3/4) 어긋남 0", () => {
  const r = randomShardFailures(3);
  expect(r.checked).toBe(2500);
  expect(r.failures.slice(0, 10)).toEqual([]);
}, 600_000);
