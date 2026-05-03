import { describe, expect, it } from "vitest";
import { evaluateSajuMbtiBridge } from "@/lib/bridge/evaluate";
import { getMbtiProfile } from "@/lib/mbti/types";
import { buildReport } from "@/lib/report/buildReport";
import { calculateSaju } from "@/lib/saju/calculateSaju";
import { extractSajuTags } from "@/lib/saju/extractTags";
import type { ReportInput } from "@/lib/report/types";
import type { SajuCalcInput } from "@/lib/saju/types";

const knownTimeInput: SajuCalcInput = {
  birthDate: "2024-02-04",
  birthTime: "17:27",
  birthTimeUnknown: false,
  calendarType: "SOLAR",
  gender: "MALE",
  timezone: "Asia/Seoul",
};

const mbtiSuggestionNotice =
  "입력한 MBTI는 사용자의 자기보고 정보로 존중하며, 사주 기반 제안은 보조 해석으로만 사용합니다.";

const unresolvedMbtiSuggestionSummary =
  "현재 사주 태그만으로는 MBTI 축을 충분히 좁히기 어렵습니다.";

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
] as const;

function createReportInput(overrides?: Partial<ReportInput>): ReportInput {
  const saju = calculateSaju(knownTimeInput);
  const sajuTags = extractSajuTags(saju);
  const mbti = getMbtiProfile("ENTJ");
  const bridge = evaluateSajuMbtiBridge({
    sajuTags,
    mbtiProfile: mbti,
  });

  return {
    saju,
    sajuTags,
    mbti,
    bridgeSignals: bridge.signals,
    ...overrides,
  };
}

function createReportInputFromSajuInput(sajuInput: SajuCalcInput): ReportInput {
  const saju = calculateSaju(sajuInput);
  const sajuTags = extractSajuTags(saju);
  const mbti = getMbtiProfile("ENTJ");
  const bridge = evaluateSajuMbtiBridge({
    sajuTags,
    mbtiProfile: mbti,
  });

  return {
    saju,
    sajuTags,
    mbti,
    bridgeSignals: bridge.signals,
  };
}

function collectReportText(report: ReturnType<typeof buildReport>): string[] {
  const values = [report.titleKo, report.subtitleKo, ...report.notices];

  for (const section of report.sections) {
    values.push(section.titleKo, section.summaryKo);
    for (const block of section.blocks) {
      if (block.titleKo) {
        values.push(block.titleKo);
      }
      if (block.bodyKo) {
        values.push(block.bodyKo);
      }
      if (block.itemsKo) {
        values.push(...block.itemsKo);
      }
      if (block.keyValues) {
        for (const item of block.keyValues) {
          values.push(item.keyKo, item.valueKo);
        }
      }
    }
  }

  return values;
}

describe("buildReport", () => {
  it("builds basic report output", () => {
    const report = buildReport(createReportInput());

    expect(report.version).toBe("v1");
    expect(report.titleKo).toBe("결리포트");
    expect(report.subtitleKo).toBe("사주와 MBTI로 읽는 나의 결");
    expect(report.sections).toHaveLength(13);
    expect(report.notices).toContain(
      "출생정보와 해석 결과는 자기이해용 참고자료입니다.",
    );
  });

  it("returns section ids in exact order", () => {
    const report = buildReport(createReportInput());

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

  it("uses correct section levels", () => {
    const report = buildReport(createReportInput());
    const levels = Object.fromEntries(
      report.sections.map((section) => [section.id, section.level]),
    );

    expect(levels.INTRO).toBe("FREE_PREVIEW");
    expect(levels.SAJU_CORE).toBe("FREE_PREVIEW");
    expect(levels.DAY_MASTER).toBe("FREE_PREVIEW");
    expect(levels.ELEMENTS).toBe("PAID_FULL");
    expect(levels.TEN_GODS).toBe("PAID_FULL");
    expect(levels.ADVANCED_PATTERNS).toBe("PAID_FULL");
    expect(levels.SHINSAL).toBe("PAID_FULL");
    expect(levels.RELATIONS).toBe("PAID_FULL");
    expect(levels.MBTI_PROFILE).toBe("FREE_PREVIEW");
    expect(levels.SAJU_MBTI_BRIDGE).toBe("PAID_FULL");
    expect(levels.SAJU_MBTI_SUGGESTION).toBe("PAID_FULL");
    expect(levels.ACTION_GUIDE).toBe("PAID_FULL");
    expect(levels.DISCLAIMER).toBe("FREE_PREVIEW");
  });

  it("renders core pillars deterministically", () => {
    const report = buildReport(createReportInput());
    const section = report.sections.find((item) => item.id === "SAJU_CORE");
    const block = section?.blocks[0];

    expect(block?.kind).toBe("KEY_VALUE");
    expect(block?.keyValues).toEqual([
      { keyKo: "년주", valueKo: "甲辰" },
      { keyKo: "월주", valueKo: "丙寅" },
      { keyKo: "일주", valueKo: "丙申" },
      { keyKo: "시주", valueKo: "丁酉" },
    ]);
  });

  it("renders missing hour as 모름", () => {
    const unknownInput: SajuCalcInput = {
      birthDate: "2024-02-04",
      birthTimeUnknown: true,
      calendarType: "SOLAR",
      gender: "MALE",
      timezone: "Asia/Seoul",
    };
    const report = buildReport(createReportInputFromSajuInput(unknownInput));
    const section = report.sections.find((item) => item.id === "SAJU_CORE");
    const block = section?.blocks[0];
    const hourValue = block?.keyValues?.find((item) => item.keyKo === "시주");

    expect(hourValue?.valueKo).toBe("모름");
  });

  it("uses day master in the day master section", () => {
    const input = createReportInput();
    const report = buildReport(input);
    const section = report.sections.find((item) => item.id === "DAY_MASTER");

    expect(section?.summaryKo).toBe(
      "일간은 사주에서 나를 대표하는 기준점입니다.",
    );
    expect(section?.blocks[0]?.kind).toBe("HIGHLIGHT");
    expect(section?.blocks[0]?.bodyKo).toBe(`${input.saju.dayMaster} 일간`);
  });

  it("uses display labels in the elements section", () => {
    const report = buildReport(createReportInput());
    const section = report.sections.find((item) => item.id === "ELEMENTS");
    const text = JSON.stringify(section);

    expect(text).toContain("화 기운 강함");
    expect(text).toContain("금 기운 강함");
    expect(text).toContain("수 기운 약함");
    expect(text).not.toContain("FIRE_STRONG");
    expect(text).not.toContain("METAL_STRONG");
    expect(text).not.toContain("WATER_WEAK");
  });

  it("uses deterministic key order for Ten Gods", () => {
    const report = buildReport(createReportInput());
    const section = report.sections.find((item) => item.id === "TEN_GODS");
    const keyOrder = section?.blocks[0]?.keyValues?.map((item) => item.keyKo);

    expect(keyOrder).toEqual([
      "비견",
      "겁재",
      "식신",
      "상관",
      "편재",
      "정재",
      "편관",
      "정관",
      "편인",
      "정인",
    ]);
  });

  it("formats Ten God scores cleanly", () => {
    const report = buildReport(createReportInput());
    const section = report.sections.find((item) => item.id === "TEN_GODS");
    const text = JSON.stringify(section);

    expect(text).not.toContain("0.7999999999999999");
    expect(section?.blocks[0]?.keyValues).toEqual(
      expect.arrayContaining([{ keyKo: "식신", valueKo: "0.8" }]),
    );
  });

  it("uses advanced tags in the advanced pattern section", () => {
    const input = createReportInput();
    const report = buildReport(input);
    const advancedLabels = input.sajuTags
      .filter((tag) => tag.category === "ADVANCED_PATTERN")
      .map((tag) => tag.labelKo);
    const section = report.sections.find(
      (item) => item.id === "ADVANCED_PATTERNS",
    );

    if (advancedLabels.length > 0) {
      expect(section?.blocks[0]?.kind).toBe("BULLET_LIST");
      expect(section?.blocks[0]?.itemsKo).toEqual(advancedLabels);
    } else {
      expect(section?.blocks[0]?.kind).toBe("PARAGRAPH");
    }
  });

  it("uses Korean labels in the advanced pattern section", () => {
    const report = buildReport(createReportInput());
    const section = report.sections.find(
      (item) => item.id === "ADVANCED_PATTERNS",
    );
    const text = JSON.stringify(section);

    expect(text).toContain("관살혼잡 후보");
    expect(text).not.toContain("MIXED_OFFICER_KILLING_STRUCTURE");
  });

  it("renders shinsal section from shinsal tags", () => {
    const input = createReportInput();
    const report = buildReport(input);
    const section = report.sections.find((item) => item.id === "SHINSAL");
    const shinsalLabels = input.sajuTags
      .filter((tag) => tag.category === "SHINSAL")
      .map((tag) => `${tag.labelKo}: ${tag.descriptionKo}`);

    expect(section).toBeDefined();
    expect(section?.level).toBe("PAID_FULL");
    expect(section?.titleKo).toBe("신살·귀인");
    if (shinsalLabels.length > 0) {
      expect(section?.blocks[0]?.kind).toBe("BULLET_LIST");
      expect(section?.blocks[0]?.itemsKo).toEqual(shinsalLabels);
    } else {
      expect(section?.blocks[0]?.kind).toBe("PARAGRAPH");
    }
  });

  it("uses bridge signals in the bridge section", () => {
    const input = createReportInput();
    const report = buildReport(input);
    const section = report.sections.find(
      (item) => item.id === "SAJU_MBTI_BRIDGE",
    );

    if (input.bridgeSignals.length > 0) {
      expect(section?.blocks[0]?.kind).toBe("BULLET_LIST");
      expect(section?.blocks[0]?.itemsKo).toEqual(
        input.bridgeSignals.map((signal) => signal.titleKo),
      );
    } else {
      expect(section?.blocks[0]?.kind).toBe("PARAGRAPH");
    }
  });

  it("renders saju mbti suggestion section", () => {
    const input = createReportInput();
    const report = buildReport(input);
    const section = report.sections.find(
      (item) => item.id === "SAJU_MBTI_SUGGESTION",
    );

    expect(section).toBeDefined();
    expect(section?.level).toBe("PAID_FULL");
    expect(section?.titleKo).toBe("사주 기반 MBTI 보정");
    expect(section?.summaryKo).toBe(
      "입력한 MBTI를 존중하되, 사주 구조에서 다르게 읽히는 성향 축이 있는지 비교합니다.",
    );
    expect(section?.blocks[0]?.kind).toBe("PARAGRAPH");
  });

  it("renders saju mbti suggestion details when suggestion exists", () => {
    const report = buildReport({
      ...createReportInput(),
      mbtiSuggestion: {
        userType: "ENTJ",
        axisSuggestions: [
          {
            axis: "EI",
            suggestedSide: "E",
            strength: "MEDIUM",
            confidence: "MEDIUM",
            titleKo: "표현성과 외향 흐름",
            summaryKo: "생각과 감정을 밖으로 드러내는 흐름이 강해질 수 있습니다.",
            evidence: [
              {
                sajuTagCode: "TEN_GOD_OUTPUT_STRONG",
                reasonKo: "식상 강함",
              },
            ],
          },
        ],
        typeSuggestion: {
          suggestedType: "ENTJ",
          confidence: "MEDIUM",
          matchedAxes: ["EI", "SN", "TF", "JP"],
          unresolvedAxes: [],
          summaryKo:
            "사주 구조에서 네 가지 MBTI 축을 모두 추정할 수 있어 하나의 후보 유형으로 정리했습니다.",
        },
        comparison: {
          userType: "ENTJ",
          suggestedType: "ENTJ",
          direction: "MATCH",
          matchingAxes: ["EI", "SN", "TF", "JP"],
          tensionAxes: [],
          summaryKo:
            "입력한 MBTI와 사주 기반 성향 후보가 전반적으로 잘 맞습니다.",
        },
        notices: [mbtiSuggestionNotice],
      },
    });
    const section = report.sections.find(
      (item) => item.id === "SAJU_MBTI_SUGGESTION",
    );
    const blockKinds = section?.blocks.map((block) => block.kind) ?? [];

    expect(blockKinds).toContain("HIGHLIGHT");
    expect(blockKinds).toContain("KEY_VALUE");
    expect(blockKinds).toContain("BULLET_LIST");
  });

  it("deduplicates notices", () => {
    const input = createReportInput();
    const report = buildReport({
      ...input,
      saju: {
        ...input.saju,
        notices: [
          "중복 알림",
          "중복 알림",
          "출생정보와 해석 결과는 자기이해용 참고자료입니다.",
        ],
      },
    });

    expect(report.notices).toEqual([
      "중복 알림",
      "출생정보와 해석 결과는 자기이해용 참고자료입니다.",
    ]);
  });

  it("forwards mbti suggestion notices", () => {
    const report = buildReport({
      ...createReportInput(),
      mbtiSuggestion: {
        userType: "ENTJ",
        axisSuggestions: [],
        comparison: {
          userType: "ENTJ",
          direction: "UNRESOLVED",
          matchingAxes: [],
          tensionAxes: [],
          summaryKo: unresolvedMbtiSuggestionSummary,
        },
        notices: [mbtiSuggestionNotice],
      },
    });

    expect(report.notices).toContain(mbtiSuggestionNotice);
  });

  it("deduplicates mbti suggestion notices", () => {
    const report = buildReport({
      ...createReportInput(),
      mbtiSuggestion: {
        userType: "ENTJ",
        axisSuggestions: [],
        comparison: {
          userType: "ENTJ",
          direction: "UNRESOLVED",
          matchingAxes: [],
          tensionAxes: [],
          summaryKo: unresolvedMbtiSuggestionSummary,
        },
        notices: [mbtiSuggestionNotice, mbtiSuggestionNotice],
      },
    });

    expect(
      report.notices.filter((item) => item === mbtiSuggestionNotice),
    ).toHaveLength(1);
  });

  it("includes disclaimer as warning", () => {
    const report = buildReport(createReportInput());
    const section = report.sections.find((item) => item.id === "DISCLAIMER");

    expect(section?.level).toBe("FREE_PREVIEW");
    expect(section?.blocks[0]?.kind).toBe("WARNING");
    expect(section?.summaryKo).toBe("본 리포트는 자기이해용 콘텐츠입니다.");
  });

  it("does not include forbidden wording in report text", () => {
    const report = buildReport(createReportInput());

    for (const text of collectReportText(report)) {
      for (const word of forbiddenWords) {
        expect(text).not.toContain(word);
      }
    }
  });

  it("returns deterministic output", () => {
    const input = createReportInput();

    expect(buildReport(input)).toEqual(buildReport(input));
  });
});
