import { describe, expect, it } from "vitest";
import { detectShinsal } from "@/lib/saju/shinsal";
import type { PillarSet } from "@/lib/saju/analyze";

function createPillars(params: {
  yearBranch: PillarSet["year"]["branch"];
  monthBranch: PillarSet["month"]["branch"];
  dayBranch: PillarSet["day"]["branch"];
  hourBranch?: NonNullable<PillarSet["hour"]>["branch"];
}): PillarSet {
  return {
    year: { stem: "甲", branch: params.yearBranch },
    month: { stem: "丙", branch: params.monthBranch },
    day: { stem: "丙", branch: params.dayBranch },
    hour:
      params.hourBranch === undefined
        ? undefined
        : { stem: "丁", branch: params.hourBranch },
  };
}

describe("Twelve Shinsal detection", () => {
  it("detects Twelve Geopsal from year group", () => {
    const detections = detectShinsal(
      createPillars({
        yearBranch: "亥",
        monthBranch: "申",
        dayBranch: "子",
      }),
    );
    const geopsal = detections.find(
      (item) =>
        item.code === "TWELVE_GEOPSAL" && item.positions.includes("month"),
    );

    expect(geopsal).toBeDefined();
    expect(geopsal?.basis.kind).toBe("BRANCH_GROUP_TO_BRANCH");
    expect(geopsal?.basis).toMatchObject({
      reference: "YEAR_BRANCH",
      referenceBranch: "亥",
      matchedBranch: "申",
    });
  });

  it("detects Twelve Banansal", () => {
    const detections = detectShinsal(
      createPillars({
        yearBranch: "亥",
        monthBranch: "辰",
        dayBranch: "子",
      }),
    );
    const banansal = detections.find(
      (item) => item.code === "TWELVE_BANANSAL",
    );

    expect(banansal).toBeDefined();
    expect(banansal?.labelKo).toBe("반안살");
  });

  it("detects Twelve Jangseongsal", () => {
    const detections = detectShinsal(
      createPillars({
        yearBranch: "亥",
        monthBranch: "卯",
        dayBranch: "子",
      }),
    );
    const jangseongsal = detections.find(
      (item) => item.code === "TWELVE_JANGSEONGSAL",
    );

    expect(jangseongsal).toBeDefined();
    expect(jangseongsal?.labelKo).toBe("장성살");
  });

  it("detects Twelve Hwagae distinct from existing HWAGAE", () => {
    const detections = detectShinsal(
      createPillars({
        yearBranch: "亥",
        monthBranch: "未",
        dayBranch: "子",
      }),
    );
    const codes = detections.map((item) => item.code);

    expect(codes).toContain("TWELVE_HWAGAE");
  });

  it("preserves rule order", () => {
    const detections = detectShinsal(
      createPillars({
        yearBranch: "亥",
        monthBranch: "申",
        dayBranch: "酉",
        hourBranch: "戌",
      }),
    );
    const twelveCodes = detections
      .map((item) => item.code)
      .filter((code) => code.startsWith("TWELVE_"));

    expect(twelveCodes.slice(0, 3)).toEqual([
      "TWELVE_GEOPSAL",
      "TWELVE_JAESAL",
      "TWELVE_CHEONSAL",
    ]);
  });

  it("preserves pillar order for same rule", () => {
    const detections = detectShinsal(
      createPillars({
        yearBranch: "亥",
        monthBranch: "申",
        dayBranch: "申",
        hourBranch: "申",
      }),
    );
    const geopsalPositions = detections
      .filter((item) => item.code === "TWELVE_GEOPSAL")
      .map((item) => item.positions[0]);

    expect(geopsalPositions).toEqual(["month", "day", "hour"]);
  });

  it("skips missing hour", () => {
    const detections = detectShinsal(
      createPillars({
        yearBranch: "亥",
        monthBranch: "申",
        dayBranch: "酉",
      }),
    );

    expect(
      detections
        .filter((item) => item.code.startsWith("TWELVE_"))
        .some((item) => item.positions.includes("hour")),
    ).toBe(false);
  });

  it("applies safe Twelve Shinsal metadata", () => {
    const twelveDetections = detectShinsal(
      createPillars({
        yearBranch: "亥",
        monthBranch: "申",
        dayBranch: "酉",
        hourBranch: "戌",
      }),
    ).filter((item) => item.code.startsWith("TWELVE_"));

    expect(twelveDetections.length).toBeGreaterThan(0);
    for (const detection of twelveDetections) {
      expect(detection.category).toBe("TWELVE_SHINSAL");
      expect(detection.labelKo).toBeTruthy();
      expect(detection.descriptionKo).toBeTruthy();
      expect(detection.severity).toBe("INFO");
      expect(detection.confidence).toBe("MEDIUM");
    }
  });

  it("uses deterministic evidence", () => {
    const detections = detectShinsal(
      createPillars({
        yearBranch: "亥",
        monthBranch: "申",
        dayBranch: "子",
      }),
    );
    const geopsal = detections.find(
      (item) =>
        item.code === "TWELVE_GEOPSAL" && item.positions.includes("month"),
    );

    expect(geopsal?.evidence).toContain("shinsal:TWELVE_GEOPSAL");
    expect(geopsal?.evidence).toContain("source:BRANCH_GROUP_TO_BRANCH");
    expect(geopsal?.evidence).toContain("reference:YEAR_BRANCH");
    expect(geopsal?.evidence).toContain("referenceBranch:亥");
    expect(geopsal?.evidence).toContain("position:month");
    expect(geopsal?.evidence).toContain("branch:申");
  });

  it("is deterministic", () => {
    const pillars = createPillars({
      yearBranch: "亥",
      monthBranch: "申",
      dayBranch: "酉",
      hourBranch: "戌",
    });

    expect(detectShinsal(pillars)).toEqual(detectShinsal(pillars));
  });
});
