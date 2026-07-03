import { describe, expect, it } from "vitest";

import {
  DaeunAnnualCompareTable,
  DaeunFortuneTable,
  DaeunTimelineTable,
  ManseRyeokCommonTable,
  MbtiCommonProfileTable,
  SaeunAnnualCompareTable,
  SaeunFortuneTable,
  SaeunMonthlyHalfTable,
} from "../../../../src/components/report-tables";

describe("report table component exports", () => {
  it("exports common report table components", () => {
    expect(typeof ManseRyeokCommonTable).toBe("function");
    expect(typeof MbtiCommonProfileTable).toBe("function");
    expect(typeof DaeunFortuneTable).toBe("function");
    expect(typeof DaeunTimelineTable).toBe("function");
    expect(typeof DaeunAnnualCompareTable).toBe("function");
    expect(typeof SaeunFortuneTable).toBe("function");
    expect(typeof SaeunAnnualCompareTable).toBe("function");
    expect(typeof SaeunMonthlyHalfTable).toBe("function");
  });
});
