import { describe, expect, it } from "vitest";

import { createReportFromRawInput } from "@/lib/report/pipeline";

const fixtureInput = {
  birthDate: "2024-02-04",
  birthTime: "17:27",
  birthTimeUnknown: false,
  calendarType: "SOLAR",
  gender: "MALE",
  timezone: "Asia/Seoul",
  mbtiType: "ENTJ",
} as const;

const forbiddenWords = [
  "무조" + "건",
  "반드" + "시",
  "운" + "명",
  "죽" + "음",
  "사고가 " + "난다",
  "바람기가 " + "있다",
  "돈복이 " + "있다",
  "결혼" + "한다",
  "망" + "한다",
  "절" + "대",
  "항" + "상",
  "틀" + "렸다",
] as const;

type PipelineResult = ReturnType<typeof createReportFromRawInput>;
type FixtureReport = Extract<PipelineResult, { ok: true }>["report"];
type FixtureSection = FixtureReport["sections"][number];

function getFixtureReport(): FixtureReport {
  const result = createReportFromRawInput(fixtureInput);

  expect(result.ok).toBe(true);
  if (!result.ok) {
    throw new Error("fixture report generation failed");
  }

  return result.report;
}

function findSection(report: FixtureReport, id: FixtureSection["id"]): FixtureSection {
  const section = report.sections.find((item) => item.id === id);

  expect(section).toBeDefined();
  if (!section) {
    throw new Error(`missing section: ${id}`);
  }

  return section;
}

function collectSectionText(section: { blocks: readonly unknown[] }): string {
  return JSON.stringify(section);
}

describe("report output fixture", () => {
  it("produces stable 13-section report", () => {
    const report = getFixtureReport();

    expect(report.version).toBe("v1");
    expect(report.titleKo).toBe("결리포트");
    expect(report.sections).toHaveLength(13);
    expect(report.sections.map((section) => section.id)).toEqual([
      "INTRO",
      "SAJU_CORE",
      "DAY_MASTER",
      "ELEMENTS",
      "TEN_GODS",
      "ADVANCED_PATTERNS",
      "SHINSAL",
      "RELATIONS",
      "MBTI_PROFILE",
      "SAJU_MBTI_BRIDGE",
      "SAJU_MBTI_SUGGESTION",
      "ACTION_GUIDE",
      "DISCLAIMER",
    ]);
  });

  it("shows core pillars", () => {
    const report = getFixtureReport();
    const section = findSection(report, "SAJU_CORE");
    const block = section.blocks.find((item) => item.kind === "KEY_VALUE");

    expect(block?.keyValues).toEqual(
      expect.arrayContaining([
        { keyKo: "년주", valueKo: "甲辰" },
        { keyKo: "월주", valueKo: "丙寅" },
        { keyKo: "일주", valueKo: "丙申" },
        { keyKo: "시주", valueKo: "丁酉" },
      ]),
    );
  });

  it("shows professional shinsal terms", () => {
    const report = getFixtureReport();
    const section = findSection(report, "SHINSAL");
    const text = collectSectionText(section);

    expect(text).toContain("현침살");
    expect(text).toContain("홍염살");
    expect(text).toContain("백호대살");
    expect(text).toContain("천을귀인");
    expect(text).toContain("월덕귀인");
    expect(text).toContain("천덕귀인");
  });

  it("shows Twelve Shinsal terms in the shinsal section", () => {
    const report = getFixtureReport();
    const section = findSection(report, "SHINSAL");
    const text = collectSectionText(section);
    const twelveTerms = ["반안살", "재살", "장성살", "역마살", "화개살"];

    expect(twelveTerms.some((term) => text.includes(term))).toBe(true);
  });

  it("shows Twelve Shinsal narrative text in the shinsal section", () => {
    const report = getFixtureReport();
    const section = findSection(report, "SHINSAL");
    const text = collectSectionText(section);
    const narrativePhrases = [
      "역마살은 이동과 변화 속에서 에너지가 살아나고 활동 반경이 넓어지는 흐름을 보여줍니다.",
      "화개살은 혼자 깊이 몰입하고 의미를 정리하는 과정에서 내면의 깊이가 살아나는 흐름을 보여줍니다.",
    ];

    expect(narrativePhrases.some((phrase) => text.includes(phrase))).toBe(
      true,
    );
  });

  it("does not use fallback colon style for Twelve Shinsal output", () => {
    const report = getFixtureReport();
    const section = findSection(report, "SHINSAL");
    const text = collectSectionText(section);

    expect(text).not.toContain("반안살:");
    expect(text).not.toContain("화개살:");
    expect(text).not.toContain("장성살:");
    expect(text).not.toContain("재살:");
  });

  it("does not expose raw Twelve Shinsal codes in fixture output", () => {
    const report = getFixtureReport();
    const text = JSON.stringify(report);

    expect(text).not.toContain("TWELVE_");
    expect(text).not.toContain("SHINSAL_TWELVE_");
  });

  it("deduplicates repeated shinsal labels in fixture output", () => {
    const report = getFixtureReport();
    const section = findSection(report, "SHINSAL");
    const block = section.blocks.find((item) => item.kind === "BULLET_LIST");

    expect(block?.kind).toBe("BULLET_LIST");
    if (block?.kind !== "BULLET_LIST") {
      throw new Error("missing shinsal bullet list");
    }

    const woldeokItems = block.itemsKo?.filter((item) =>
      item.includes(
        "월덕귀인은 관계 안에서 분위기를 부드럽게 만들고 갈등을 완충하는 힘으로 읽을 수 있습니다.",
      ),
    );

    expect(woldeokItems).toHaveLength(1);
  });

  it("renders shinsal items as narrative sentences", () => {
    const report = getFixtureReport();
    const section = findSection(report, "SHINSAL");
    const block = section.blocks.find((item) => item.kind === "BULLET_LIST");

    expect(block?.kind).toBe("BULLET_LIST");
    if (block?.kind !== "BULLET_LIST") {
      throw new Error("missing shinsal bullet list");
    }

    expect(block.itemsKo).toContain(
      "현침살이 보여, 남들이 놓치는 작은 차이를 빠르게 포착하는 예리함이 드러납니다.",
    );
    expect(block.itemsKo.some((item) => item.includes("현침살: 현침살은"))).toBe(
      false,
    );
    expect(block.itemsKo.some((item) => item.startsWith("현침살:"))).toBe(false);
    expect(block.itemsKo.some((item) => item.startsWith("홍염살:"))).toBe(false);
    expect(block.itemsKo.some((item) => item.startsWith("월덕귀인:"))).toBe(
      false,
    );
  });

  it("includes saju mbti suggestion section", () => {
    const report = getFixtureReport();
    const section = findSection(report, "SAJU_MBTI_SUGGESTION");
    const text = collectSectionText(section);

    expect(section.titleKo).toBe("사주 기반 MBTI 보정");
    expect(text).toContain("입력 MBTI");
    expect(text).toContain("사주 기반");
  });

  it("softens high-tension saju mbti suggestion in fixture output", () => {
    const report = getFixtureReport();
    const section = findSection(report, "SAJU_MBTI_SUGGESTION");
    const text = collectSectionText(section);
    const keyValueBlocks = section.blocks.filter(
      (block) => block.kind === "KEY_VALUE",
    );

    expect(text).toContain(
      "하나의 유형명으로 단정하기보다 축별 차이를 중심으로 보는 편이 적절합니다.",
    );
    expect(
      keyValueBlocks.some((block) =>
        block.keyValues?.some((item) => item.keyKo === "후보 MBTI"),
      ),
    ).toBe(false);
  });

  it("includes core interpretation text in fixture output", () => {
    const report = getFixtureReport();
    const text = JSON.stringify(report);

    expect(text).toContain("일간 해석");
    expect(text).toContain("오행 흐름");
    expect(text).toContain("십성 흐름");
    expect(text).toContain("속도 조절과 감정 소모 관리");
    expect(text).toContain("감정 회복·휴식·유연한 조율");
    expect(text).toContain("현실 책임과 성과 압박");
  });

  it("uses Korean relation labels and avoids internal position notation", () => {
    const report = getFixtureReport();
    const section = findSection(report, "RELATIONS");
    const text = collectSectionText(section);

    expect(text).toContain("지지합: 년주와 시주 사이의 辰酉 합 신호");
    expect(text).toContain("지지충: 월주와 일주 사이의 寅申 충 신호");
    expect(text).not.toContain("year-hour");
    expect(text).not.toContain("month-day");
    expect(text).not.toContain("year-month");
    expect(text).not.toContain("month-hour");
  });

  it("includes safety and suggestion notices", () => {
    const report = getFixtureReport();

    expect(report.notices).toContain(
      "출생정보와 해석 결과는 자기이해용 참고자료입니다.",
    );
    expect(report.notices).toContain(
      "입력한 MBTI는 사용자의 자기보고 정보로 존중하며, 사주 기반 제안은 보조 해석으로만 사용합니다.",
    );
  });

  it("uses normalized display text instead of raw display codes", () => {
    const report = getFixtureReport();
    const text = JSON.stringify(report);

    expect(text).toContain("화 기운 강함");
    expect(text).toContain("금 기운 강함");
    expect(text).toContain("수 기운 약함");
    expect(text).not.toContain("FIRE_STRONG");
    expect(text).not.toContain("METAL_STRONG");
    expect(text).not.toContain("WATER_WEAK");
    expect(text).not.toContain("TEN_GOD_OUTPUT_STRONG");
    expect(text).not.toContain("OFFICER_PRESSURE_HIGH");
    expect(text).not.toContain("WEALTH_OVERLOAD");
  });

  it("avoids forbidden wording in serialized output", () => {
    const report = getFixtureReport();
    const text = JSON.stringify(report);

    for (const word of forbiddenWords) {
      expect(text).not.toContain(word);
    }
  });

  it("returns deterministic output", () => {
    expect(getFixtureReport()).toEqual(getFixtureReport());
  });
});
