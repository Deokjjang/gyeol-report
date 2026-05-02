import { describe, expect, it } from "vitest";
import { detectShinsal } from "@/lib/saju/shinsal";
import type { PillarSet } from "@/lib/saju/analyze";

function createPillars(overrides?: Partial<PillarSet>): PillarSet {
  return {
    year: { stem: "甲", branch: "辰" },
    month: { stem: "丙", branch: "寅" },
    day: { stem: "丙", branch: "申" },
    hour: { stem: "丁", branch: "酉" },
    ...overrides,
  };
}

describe("detectShinsal", () => {
  it("detects branch-only HYEONCHIMSAL", () => {
    const detections = detectShinsal(createPillars());
    const hyeonchim = detections.find(
      (item) => item.code === "HYEONCHIMSAL" && item.positions.includes("hour"),
    );

    expect(hyeonchim).toBeDefined();
    expect(hyeonchim?.labelKo).toBe("현침살");
    expect(hyeonchim?.basis.kind).toBe("BRANCH_ONLY");
    expect(hyeonchim?.evidence).toContain("shinsal:HYEONCHIMSAL");
    expect(hyeonchim?.evidence).toContain("position:hour");
    expect(hyeonchim?.evidence).toContain("branch:酉");
  });

  it("detects DAY_STEM_TO_BRANCH HONGYEOMSAL", () => {
    const detections = detectShinsal(createPillars());
    const hongyeom = detections.find(
      (item) => item.code === "HONGYEOMSAL" && item.positions.includes("month"),
    );

    expect(hongyeom).toBeDefined();
    expect(hongyeom?.basis.kind).toBe("DAY_STEM_TO_BRANCH");
    expect(hongyeom?.evidence).toContain("dayStem:丙");
    expect(hongyeom?.evidence).toContain("branch:寅");
  });

  it("detects STEM_BRANCH_PAIR BAEKHODAESAL", () => {
    const pillars = createPillars({
      year: { stem: "甲", branch: "辰" },
    });
    const detections = detectShinsal(pillars);
    const baekho = detections.find(
      (item) =>
        item.code === "BAEKHODAESAL" && item.positions.includes("year"),
    );

    expect(baekho).toBeDefined();
    expect(baekho?.basis.kind).toBe("STEM_BRANCH_PAIR");
    expect(baekho?.evidence).toContain("stem:甲");
    expect(baekho?.evidence).toContain("branch:辰");
  });

  it("detects YEAR_BRANCH_TO_BRANCH YEOKMASAL", () => {
    const detections = detectShinsal(createPillars());
    const yeokma = detections.find(
      (item) => item.code === "YEOKMASAL" && item.positions.includes("month"),
    );

    expect(yeokma).toBeDefined();
    expect(yeokma?.basis.kind).toBe("YEAR_BRANCH_TO_BRANCH");
    expect(yeokma?.evidence).toContain("yearBranch:辰");
    expect(yeokma?.evidence).toContain("branch:寅");
  });

  it("detects DOHWASAL for year group", () => {
    const detections = detectShinsal(createPillars());
    const dohwa = detections.find(
      (item) => item.code === "DOHWASAL" && item.positions.includes("hour"),
    );

    expect(dohwa).toBeDefined();
  });

  it("detects HWAGAE for year group", () => {
    const detections = detectShinsal(createPillars());
    const hwagae = detections.find(
      (item) => item.code === "HWAGAE" && item.positions.includes("year"),
    );

    expect(hwagae).toBeDefined();
  });

  it("detects MONTH_BRANCH_TO_STEM WOL_DEOK_GWIIN", () => {
    const detections = detectShinsal(createPillars());
    const wolDeok = detections.filter(
      (item) => item.code === "WOL_DEOK_GWIIN",
    );

    expect(wolDeok.length).toBeGreaterThan(0);
    expect(
      wolDeok.some(
        (item) =>
          item.evidence.includes("monthBranch:寅") &&
          item.evidence.includes("stem:丙"),
      ),
    ).toBe(true);
  });

  it("detects MONTH_BRANCH_TO_STEM_OR_BRANCH CHEON_DEOK_GWIIN", () => {
    const detections = detectShinsal(createPillars());
    const cheonDeok = detections.find(
      (item) =>
        item.code === "CHEON_DEOK_GWIIN" && item.positions.includes("hour"),
    );

    expect(cheonDeok).toBeDefined();
    expect(cheonDeok?.basis.kind).toBe("MONTH_BRANCH_TO_STEM_OR_BRANCH");
    expect(cheonDeok?.evidence).toContain("monthBranch:寅");
    expect(cheonDeok?.evidence).toContain("target:丁");
  });

  it("skips missing hour", () => {
    const pillars = createPillars({
      hour: undefined,
    });
    const detections = detectShinsal(pillars);

    expect(
      detections.some((item) => item.positions.includes("hour")),
    ).toBe(false);
  });

  it("preserves rule order first", () => {
    const detections = detectShinsal(createPillars());
    const codes = detections.map((item) => item.code);

    expect(codes.indexOf("HYEONCHIMSAL")).toBeLessThan(
      codes.indexOf("HONGYEOMSAL"),
    );
    expect(codes.indexOf("HONGYEOMSAL")).toBeLessThan(
      codes.indexOf("BAEKHODAESAL"),
    );
  });

  it("preserves pillar order within same rule", () => {
    const pillars = createPillars({
      year: { stem: "甲", branch: "卯" },
      month: { stem: "丙", branch: "酉" },
      day: { stem: "丙", branch: "卯" },
      hour: { stem: "丁", branch: "酉" },
    });
    const hyeonchimPositions = detectShinsal(pillars)
      .filter((item) => item.code === "HYEONCHIMSAL")
      .map((item) => item.positions[0]);

    expect(hyeonchimPositions).toEqual(["year", "month", "day", "hour"]);
  });

  it("returns multiple detections for multiple positions", () => {
    const pillars = createPillars({
      year: { stem: "甲", branch: "卯" },
      month: { stem: "丙", branch: "酉" },
      day: { stem: "丙", branch: "卯" },
      hour: { stem: "丁", branch: "酉" },
    });
    const hyeonchim = detectShinsal(pillars).filter(
      (item) => item.code === "HYEONCHIMSAL",
    );

    expect(hyeonchim).toHaveLength(4);
  });

  it("applies metadata", () => {
    const detections = detectShinsal(createPillars());
    const cheonEul = detections.find(
      (item) =>
        item.code === "CHEON_EUL_GWIIN" && item.positions.includes("hour"),
    );

    expect(cheonEul).toBeDefined();
    expect(cheonEul?.labelKo).toBe("천을귀인");
    expect(cheonEul?.category).toBe("NOBLE_HELP");
    expect(cheonEul?.severity).toBe("INFO");
    expect(cheonEul?.confidence).toBe("MEDIUM");
    expect(cheonEul?.descriptionKo).toBeTruthy();
  });

  it("uses safe descriptions", () => {
    const forbiddenWords = [
      "\uBB34\uC870\uAC74",
      "\uBC18\uB4DC\uC2DC",
      "\uC6B4\uBA85",
      "\uC8FD\uC74C",
      "\uC0AC\uACE0\uAC00 \uB09C\uB2E4",
      "\uBC14\uB78C\uAE30\uAC00 \uC788\uB2E4",
      "\uB3C8\uBCF5\uC774 \uC788\uB2E4",
      "\uACB0\uD63C\uD55C\uB2E4",
      "\uB9DD\uD55C\uB2E4",
      "\uC808\uB300",
      "\uD56D\uC0C1",
    ];
    const detections = detectShinsal(createPillars());

    for (const detection of detections) {
      for (const word of forbiddenWords) {
        expect(detection.descriptionKo).not.toContain(word);
      }
    }
  });

  it("is deterministic", () => {
    const pillars = createPillars();

    expect(detectShinsal(pillars)).toEqual(detectShinsal(pillars));
  });
});
