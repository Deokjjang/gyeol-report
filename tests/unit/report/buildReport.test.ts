import { describe, expect, it } from "vitest";
import { evaluateSajuMbtiBridge } from "@/lib/bridge/evaluate";
import { getMbtiProfile } from "@/lib/mbti/types";
import { buildReport } from "@/lib/report/buildReport";
import { calculateSaju } from "@/lib/saju/calculateSaju";
import { getDayPillarProfile } from "@/lib/saju/dayPillarProfile";
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

const supportedDayPillarCodes = [
  "甲子",
  "甲午",
  "乙卯",
  "乙酉",
  "丙寅",
  "丙申",
  "丁卯",
  "戊辰",
  "己未",
  "庚申",
] as const;

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

function countMatches(text: string, pattern: RegExp): number {
  return text.match(pattern)?.length ?? 0;
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

  it("accepts day pillar profile data without changing section structure", () => {
    const report = buildReport({
      ...createReportInput(),
      dayPillarProfile: getDayPillarProfile("丙申"),
    });

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

  it("renders day pillar profile in the day master section", () => {
    const report = buildReport({
      ...createReportInput(),
      dayPillarProfile: getDayPillarProfile("丙申"),
    });
    const section = report.sections.find((item) => item.id === "DAY_MASTER");
    const text = JSON.stringify(section);

    expect(text).toContain("丙 일간");
    expect(text).toContain("병신일주");
    expect(text).toContain(
      "밝은 태양이 날카로운 금속 위에 비치는 이미지입니다.",
    );
    expect(text).toContain(
      "병신일주는 밝게 드러나는 표현성과 빠른 판단력이 함께 작동하는 구조입니다.",
    );
    expect(text).toContain("丙 화 일간이 申 금 위에 앉은 구조");
    expect(text).toContain("빠른 판단과 실행");
    expect(text).toContain("주의할 흐름");
    expect(text).toContain("활용 방향");
  });

  it("renders all supported day pillar profiles in the day master section", () => {
    for (const code of supportedDayPillarCodes) {
      const profileResult = getDayPillarProfile(code);

      expect(profileResult.ok).toBe(true);
      if (!profileResult.ok) {
        throw new Error(`Expected profile for ${code}`);
      }

      const report = buildReport({
        ...createReportInput(),
        dayPillarProfile: profileResult,
      });
      const dayMaster = report.sections.find(
        (section) => section.id === "DAY_MASTER",
      );
      const text = JSON.stringify(dayMaster);

      expect(dayMaster).toBeDefined();
      expect(report.sections).toHaveLength(13);
      expect(text).toContain(profileResult.profile.nameKo);
      expect(text).toContain(profileResult.profile.imageKo);
      expect(text).toContain(profileResult.profile.coreSummaryKo);
      expect(text).toContain(profileResult.profile.structureKo);
      expect(text).toContain("강점");
      expect(text).toContain("주의할 흐름");
      expect(text).toContain("활용 방향");
      expect(text).toContain("丙 일간");
    }
  });

  it("preserves generic day master fallback when profile is missing", () => {
    const report = buildReport(createReportInput());
    const section = report.sections.find((item) => item.id === "DAY_MASTER");
    const text = JSON.stringify(section);

    expect(section?.blocks.some((block) => block.kind === "HIGHLIGHT")).toBe(
      true,
    );
    expect(
      section?.blocks.some(
        (block) => block.kind === "PARAGRAPH" && block.titleKo === "일간 해석",
      ),
    ).toBe(true);
    expect(text).toContain(
      "丙 일간은 밝게 드러나는 화의 성질을 기준으로 자신을 표현합니다.",
    );
    expect(text).not.toContain("병신일주");
  });

  it("preserves generic day master fallback when profile is not found", () => {
    const input = createReportInput();
    const report = buildReport({
      ...input,
      saju: {
        ...input.saju,
        dayMaster: "甲",
        pillars: {
          ...input.saju.pillars,
          day: { stem: "甲", branch: "子" },
        },
      },
      dayPillarProfile: {
        ok: false,
        code: "甲子",
        reason: "PROFILE_NOT_FOUND",
      },
    });
    const section = report.sections.find((item) => item.id === "DAY_MASTER");
    const text = JSON.stringify(section);

    expect(text).toContain("일간 해석");
    expect(text).toContain("일간은 사주에서 나를 대표하는 기준점이며");
    expect(text).not.toContain("병신일주");
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

  it("adds flow paragraph to the elements section", () => {
    const report = buildReport(createReportInput());
    const section = report.sections.find((item) => item.id === "ELEMENTS");
    const text = JSON.stringify(section);

    expect(section?.blocks.some((block) => block.kind === "BULLET_LIST")).toBe(
      true,
    );
    expect(
      section?.blocks.some(
        (block) => block.kind === "PARAGRAPH" && block.titleKo === "오행 흐름",
      ),
    ).toBe(true);
    expect(text).toContain(
      "화와 금의 신호가 비교적 두드러지고, 수 기운은 약하게 표시됩니다.",
    );
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

  it("preserves Ten Gods fallback without structure analysis", () => {
    const report = buildReport(createReportInput());
    const section = report.sections.find((item) => item.id === "TEN_GODS");
    const text = JSON.stringify(section);

    expect(section?.blocks.some((block) => block.kind === "KEY_VALUE")).toBe(
      true,
    );
    expect(
      section?.blocks.some(
        (block) => block.kind === "PARAGRAPH" && block.titleKo === "십성 흐름",
      ),
    ).toBe(true);
    expect(text).toContain(
      "편인과 비견의 점수가 상대적으로 높게 나타나 자기 기준, 학습성, 독립적 판단이 강하게 작동할 수 있습니다.",
    );
    expect(text).not.toContain("십성 묶음");
    expect(text).not.toContain("십성 해석 포인트");
  });

  it("renders enhanced Ten Gods blocks with structure analysis", () => {
    const report = buildReport({
      ...createReportInput(),
      structureAnalysis: {
        dayMasterStrength: {
          level: "WEAK",
          score: -0.8,
          labelKo: "신약",
          summaryKo:
            "일간을 돕는 힘보다 소모·성과·책임 쪽 신호가 더 강하게 나타납니다.",
          confidence: "MEDIUM",
          evidence: [
            { source: "TEN_GODS", keyKo: "비겁", valueKo: "1.0" },
            { source: "TEN_GODS", keyKo: "인성", valueKo: "0.5" },
            { source: "TEN_GODS", keyKo: "식상", valueKo: "1.2" },
            { source: "TEN_GODS", keyKo: "재성", valueKo: "1.4" },
            { source: "TEN_GODS", keyKo: "관성", valueKo: "0.8" },
          ],
        },
        patterns: [
          {
            code: "WEAK_DAYMASTER_WITH_STRONG_WEALTH",
            labelKo: "재다신약 후보",
            summaryKo:
              "재성 신호가 일간의 힘보다 크게 작동해, 성과·돈·현실 책임을 감당하는 과정에서 부담이 커질 수 있는 구조입니다.",
            confidence: "MEDIUM",
            evidence: [{ source: "TEN_GODS", keyKo: "재성", valueKo: "1.4" }],
          },
        ],
        summary: {
          titleKo: "사주 구조 요약",
          bodyKo:
            "이 사주는 신약 흐름을 바탕으로 재다신약 후보 신호가 함께 보입니다.",
          keywordsKo: ["신약", "재다신약 후보"],
        },
        notices: [
          "신강신약과 구조 후보는 단정이 아니라 현재 계산된 오행·십성 신호를 바탕으로 한 해석 기준입니다.",
        ],
      },
    });
    const section = report.sections.find((item) => item.id === "TEN_GODS");
    const text = JSON.stringify(section);

    expect(report.sections).toHaveLength(13);
    expect(text).toContain("십성 묶음");
    expect(text).toContain("십성 종합");
    expect(text).toContain("십성 해석 포인트");
    expect(text).toContain("비겁");
    expect(text).toContain("인성");
    expect(text).toContain("식상");
    expect(text).toContain("재성");
    expect(text).toContain("관성");
    expect(text).toContain("자기 기준");
    expect(text).toContain("학습");
    expect(text).toContain("표현");
    expect(text).toContain("현실 감각");
    expect(text).toContain("책임");
    expect(text).toContain("비견");
    expect(text).toContain("겁재");
    expect(text).toContain("식신");
    expect(text).toContain("상관");
    expect(text).toContain("편재");
    expect(text).toContain("정재");
    expect(text).toContain("편관");
    expect(text).toContain("정관");
    expect(text).toContain("편인");
    expect(text).toContain("정인");
  });

  it("renders structure analysis in the advanced pattern section", () => {
    const report = buildReport({
      ...createReportInput(),
      structureAnalysis: {
        dayMasterStrength: {
          level: "WEAK",
          score: -0.8,
          labelKo: "신약",
          summaryKo:
            "일간을 돕는 힘보다 소모·성과·책임 쪽 신호가 더 강하게 나타납니다.",
          confidence: "MEDIUM",
          evidence: [
            { source: "TEN_GODS", keyKo: "비겁", valueKo: "1.0" },
            { source: "TEN_GODS", keyKo: "인성", valueKo: "0.5" },
            { source: "TEN_GODS", keyKo: "식상", valueKo: "1.2" },
            { source: "TEN_GODS", keyKo: "재성", valueKo: "1.4" },
            { source: "TEN_GODS", keyKo: "관성", valueKo: "0.8" },
          ],
        },
        patterns: [
          {
            code: "WEAK_DAYMASTER_WITH_STRONG_WEALTH",
            labelKo: "재다신약 후보",
            summaryKo:
              "재성 신호가 일간의 힘보다 크게 작동해, 성과·돈·현실 책임을 감당하는 과정에서 부담이 커질 수 있는 구조입니다.",
            confidence: "MEDIUM",
            evidence: [{ source: "TEN_GODS", keyKo: "재성", valueKo: "1.4" }],
          },
        ],
        summary: {
          titleKo: "사주 구조 요약",
          bodyKo:
            "이 사주는 신약 흐름을 바탕으로 재다신약 후보 신호가 함께 보입니다.",
          keywordsKo: ["신약", "재다신약 후보"],
        },
        notices: [
          "신강신약과 구조 후보는 단정이 아니라 현재 계산된 오행·십성 신호를 바탕으로 한 해석 기준입니다.",
        ],
      },
    });
    const section = report.sections.find(
      (item) => item.id === "ADVANCED_PATTERNS",
    );
    const text = JSON.stringify(section);

    expect(report.sections).toHaveLength(13);
    expect(text).toContain("신강신약");
    expect(text).toContain("신약");
    expect(text).toContain("구조 근거");
    expect(text).toContain("비겁");
    expect(text).toContain("인성");
    expect(text).toContain("식상");
    expect(text).toContain("재성");
    expect(text).toContain("관성");
    expect(text).toContain("사주 구조 요약");
    expect(text).toContain("구조 후보");
    expect(text).toContain("재다신약 후보");
    expect(text).toContain("해석 기준");
  });

  it("preserves advanced pattern fallback without structure analysis", () => {
    const report = buildReport(createReportInput());
    const section = report.sections.find(
      (item) => item.id === "ADVANCED_PATTERNS",
    );
    const text = JSON.stringify(section);

    expect(section?.titleKo).toBe("고급 구조 후보");
    expect(text).toContain("구조 후보");
    expect(text).toContain("관살혼잡 후보");
    expect(text).not.toContain("신강신약");
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
    const report = buildReport(createReportInput());
    const section = report.sections.find((item) => item.id === "SHINSAL");
    const text = JSON.stringify(section);

    expect(section).toBeDefined();
    expect(section?.level).toBe("PAID_FULL");
    expect(section?.titleKo).toBe("신살·귀인");
    expect(section?.blocks[0]?.kind).toBe("BULLET_LIST");
    expect(text).toContain("현침살");
    expect(text).toContain("백호대살");
    expect(text).toContain("천을귀인");
  });

  it("renders Twelve Shinsal narrative text", () => {
    const report = buildReport(createReportInput());
    const section = report.sections.find((item) => item.id === "SHINSAL");
    const text = JSON.stringify(section);

    expect(text).toMatch(/지살|역마살|화개살|화개/);
    expect(countMatches(text, /역마살/g)).toBeLessThanOrEqual(1);
    expect(countMatches(text, /화개살|화개/g)).toBeLessThanOrEqual(1);
  });

  it("limits and deduplicates shinsal display items", () => {
    const report = buildReport(createReportInput());
    const section = report.sections.find((item) => item.id === "SHINSAL");
    const block = section?.blocks.find((item) => item.kind === "BULLET_LIST");

    expect(block?.kind).toBe("BULLET_LIST");
    if (block?.kind !== "BULLET_LIST") {
      throw new Error("missing shinsal bullet list");
    }

    const items = block.itemsKo ?? [];
    const text = JSON.stringify(section);
    const noticePrefix = "그 밖의 신살 신호도 함께 감지되지만";

    expect(items.length).toBeLessThanOrEqual(11);
    if (items.some((item) => item.includes(noticePrefix))) {
      expect(items.at(-1)).toContain(noticePrefix);
    }
    expect(countMatches(text, /역마살/g)).toBeLessThanOrEqual(1);
    expect(countMatches(text, /화개살|화개/g)).toBeLessThanOrEqual(1);
    expect(countMatches(text, /도화살|도화|홍염살|홍염|년살/g)).toBeLessThanOrEqual(
      1,
    );
  });

  it("uses Korean position labels in the relations section", () => {
    const report = buildReport(createReportInput());
    const section = report.sections.find((item) => item.id === "RELATIONS");
    const text = JSON.stringify(section);

    expect(text).toContain("지지합: 년주와 시주 사이의 辰酉 합 신호");
    expect(text).toContain("지지충: 월주와 일주 사이의 寅申 충 신호");
    expect(text).not.toContain("year-hour");
    expect(text).not.toContain("month-day");
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

  it("softens high-tension saju mbti suggestion display", () => {
    const report = buildReport({
      ...createReportInput(),
      mbtiSuggestion: {
        userType: "ENTJ",
        axisSuggestions: [
          {
            axis: "EI",
            suggestedSide: "I",
            strength: "MEDIUM",
            confidence: "MEDIUM",
            titleKo: "내면 처리와 독립적 숙고",
            summaryKo:
              "외부 반응보다 혼자 정리하고 깊게 생각하는 흐름이 두드러질 수 있습니다.",
            evidence: [
              {
                sajuTagCode: "SHINSAL_HWAGAE",
                reasonKo: "화개",
              },
            ],
          },
        ],
        typeSuggestion: {
          suggestedType: "INFP",
          confidence: "MEDIUM",
          matchedAxes: ["EI", "SN", "TF", "JP"],
          unresolvedAxes: [],
          summaryKo:
            "사주 구조에서 네 가지 MBTI 축을 모두 추정할 수 있어 하나의 후보 유형으로 정리했습니다.",
        },
        comparison: {
          userType: "ENTJ",
          suggestedType: "INFP",
          direction: "PARTIAL_MATCH",
          matchingAxes: [],
          tensionAxes: ["EI", "SN", "TF", "JP"],
          summaryKo:
            "입력한 MBTI와 사주 기반 성향 후보가 일부 축에서는 맞고, 일부 축에서는 다르게 읽힙니다.",
        },
        notices: [mbtiSuggestionNotice],
      },
    });
    const section = report.sections.find(
      (item) => item.id === "SAJU_MBTI_SUGGESTION",
    );
    const text = JSON.stringify(section);
    const keyValueBlocks =
      section?.blocks.filter((block) => block.kind === "KEY_VALUE") ?? [];

    expect(text).toContain(
      "하나의 유형명으로 단정하기보다 축별 차이를 중심으로 보는 편이 적절합니다.",
    );
    expect(
      keyValueBlocks.some((block) =>
        block.keyValues?.some((item) => item.keyKo === "후보 MBTI"),
      ),
    ).toBe(false);
  });

  it("keeps candidate mbti key value for low-tension suggestion display", () => {
    const report = buildReport({
      ...createReportInput(),
      mbtiSuggestion: {
        userType: "ENTJ",
        axisSuggestions: [],
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
    const candidateBlock = section?.blocks.find(
      (block) =>
        block.kind === "KEY_VALUE" &&
        block.keyValues?.some((item) => item.keyKo === "후보 MBTI"),
    );

    expect(candidateBlock?.keyValues).toEqual(
      expect.arrayContaining([{ keyKo: "후보 MBTI", valueKo: "ENTJ" }]),
    );
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
