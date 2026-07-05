import { describe, expect, it } from "vitest";

import {
  CareerReportCommonTables,
  CareerReportManseRyeokTable,
  CareerReportMbtiProfileTable,
  CompatibilityTable,
  ConnectionSummaryTable,
  DaeunAnnualCompareTable,
  DaeunFortuneTable,
  DaeunTimelineTable,
  ManseRyeokCommonTable,
  MbtiCommonProfileTable,
  LoveMarriageChildReportCommonTables,
  LoveMarriageChildReportManseRyeokTable,
  LoveMarriageChildReportMbtiProfileTable,
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
    expect(typeof CompatibilityTable).toBe("function");
    expect(typeof ConnectionSummaryTable).toBe("function");
    expect(typeof CareerReportCommonTables).toBe("function");
    expect(typeof CareerReportManseRyeokTable).toBe("function");
    expect(typeof CareerReportMbtiProfileTable).toBe("function");
    expect(typeof LoveMarriageChildReportCommonTables).toBe("function");
    expect(typeof LoveMarriageChildReportManseRyeokTable).toBe("function");
    expect(typeof LoveMarriageChildReportMbtiProfileTable).toBe("function");
  });
});
