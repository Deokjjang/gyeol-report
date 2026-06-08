import { describe, expect, it } from "vitest";
import { evaluateSajuMbtiBridge } from "@/lib/bridge/evaluate";
import { getMbtiProfile } from "@/lib/mbti/types";
import { buildReport } from "@/lib/report/buildReport";
import { createReportFromRawInput } from "@/lib/report/pipeline";
import { calculateSaju } from "@/lib/saju/calculateSaju";
import { getDayPillarProfile } from "@/lib/saju/dayPillarProfile";
import { extractSajuTags } from "@/lib/saju/extractTags";
import type { ReportInput } from "@/lib/report/types";
import type { SajuTag } from "@/lib/saju/tags";
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
  "틀" + "렸다",
] as const;

const expectedSectionIds = [
  "INTRO",
  "QUICK_SUMMARY",
  "SAJU_CORE",
  "DAY_MASTER",
  "ELEMENTS",
  "TEN_GODS",
  "ADVANCED_PATTERNS",
  "SHINSAL",
  "RELATIONS",
  "PRACTICAL_POINTS",
  "MBTI_PROFILE",
  "SAJU_MBTI_BRIDGE",
  "SAJU_MBTI_SUGGESTION",
  "ACTION_GUIDE",
  "DISCLAIMER",
] as const;

const rawElementCodes = [
  "WOOD" + "_WEAK",
  "FIRE" + "_WEAK",
  "EARTH" + "_WEAK",
  "METAL" + "_WEAK",
  "WATER" + "_WEAK",
  "WOOD" + "_STRONG",
  "FIRE" + "_STRONG",
  "EARTH" + "_STRONG",
  "METAL" + "_STRONG",
  "WATER" + "_STRONG",
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

function expectNoRawElementCodes(text: string): void {
  for (const code of rawElementCodes) {
    expect(text).not.toContain(code);
  }
}

function createShinsalTag(code: SajuTag["code"], labelKo: string): SajuTag {
  return {
    code,
    category: "SHINSAL",
    severity: "MEDIUM",
    confidence: "HIGH",
    labelKo,
    descriptionKo: labelKo,
    evidence: [`test:${code}`],
  };
}

describe("buildReport", () => {
  it("builds basic report output", () => {
    const report = buildReport(createReportInput());

    expect(report.version).toBe("v1");
    expect(report.titleKo).toBe("결리포트");
    expect(report.subtitleKo).toBe("사주와 MBTI로 읽는 나의 결");
    expect(report.sections).toHaveLength(expectedSectionIds.length);
    expect(report.notices).toContain(
      "출생정보와 해석 결과는 자기이해용 참고자료입니다.",
    );
  });

  it("returns section ids in exact order", () => {
    const report = buildReport(createReportInput());

    expect(report.sections.map((section) => section.id)).toEqual(
      expectedSectionIds,
    );
  });

  it("accepts day pillar profile data without changing section structure", () => {
    const report = buildReport({
      ...createReportInput(),
      dayPillarProfile: getDayPillarProfile("丙申"),
    });

    expect(report.sections).toHaveLength(expectedSectionIds.length);
    expect(report.sections.map((section) => section.id)).toEqual(
      expectedSectionIds,
    );
  });

  it("uses correct section levels", () => {
    const report = buildReport(createReportInput());
    const levels = Object.fromEntries(
      report.sections.map((section) => [section.id, section.level]),
    );

    expect(levels.INTRO).toBe("FREE_PREVIEW");
    expect(levels.QUICK_SUMMARY).toBe("FREE_PREVIEW");
    expect(levels.SAJU_CORE).toBe("FREE_PREVIEW");
    expect(levels.DAY_MASTER).toBe("FREE_PREVIEW");
    expect(levels.ELEMENTS).toBe("PAID_FULL");
    expect(levels.TEN_GODS).toBe("PAID_FULL");
    expect(levels.ADVANCED_PATTERNS).toBe("PAID_FULL");
    expect(levels.SHINSAL).toBe("PAID_FULL");
    expect(levels.RELATIONS).toBe("PAID_FULL");
    expect(levels.PRACTICAL_POINTS).toBe("PAID_FULL");
    expect(levels.MBTI_PROFILE).toBe("FREE_PREVIEW");
    expect(levels.SAJU_MBTI_BRIDGE).toBe("PAID_FULL");
    expect(levels.SAJU_MBTI_SUGGESTION).toBe("PAID_FULL");
    expect(levels.ACTION_GUIDE).toBe("PAID_FULL");
    expect(levels.DISCLAIMER).toBe("FREE_PREVIEW");
  });

  it("renders the new personal hook section", () => {
    const report = buildReport(createReportInput());
    const section = report.sections.find((item) => item.id === "QUICK_SUMMARY");
    const text = JSON.stringify(section);

    expect(section?.titleKo).toBe("한눈에 보는 나의 결");
    expect(text).toContain("강점");
    expect(text).toContain("주의할 흐름");
    expect(text).toContain("키워드");
    expect(text).toContain("오늘부터 써먹는 루틴");
  });

  it("uses display name in the free preview hook when provided", () => {
    const report = buildReport(
      createReportInput({
        displayName: "덕짱",
      }),
    );
    const section = report.sections.find((item) => item.id === "QUICK_SUMMARY");
    const text = JSON.stringify(section);
    const openingBlock = section?.blocks.find(
      (block) =>
        block.kind === "PARAGRAPH" &&
        block.titleKo === "나를 부르는 첫 문장",
    );
    const oldElementStyle = "토 기운의 " + "방식";

    expect(text).toContain("덕짱님은");
    expect(openingBlock?.bodyKo).toContain("덕짱님은");
    expect(openingBlock?.bodyKo).toContain(
      "기준을 세우고 다시 정리하면서 자기 리듬을 찾는 쪽",
    );
    expect(openingBlock?.bodyKo).not.toContain(oldElementStyle);
    expect(text).not.toContain("undefined님");
    expect(text).not.toContain("null님");
  });

  it("does not repeat the first sentence as the first summary item", () => {
    const report = buildReport(
      createReportInput({
        displayName: "덕짱",
      }),
    );
    const section = report.sections.find((item) => item.id === "QUICK_SUMMARY");
    const openingBlock = section?.blocks.find(
      (block) =>
        block.kind === "PARAGRAPH" &&
        block.titleKo === "나를 부르는 첫 문장",
    );
    const summaryBlock = section?.blocks.find(
      (block) => block.kind === "BULLET_LIST" && block.titleKo === "3줄 요약",
    );

    expect(openingBlock?.bodyKo).toContain("덕짱님은");
    expect(summaryBlock?.itemsKo?.[0]).toBeDefined();
    expect(openingBlock?.bodyKo).not.toBe(summaryBlock?.itemsKo?.[0]);
  });

  it("uses neutral subject when display name is absent", () => {
    const report = buildReport(createReportInput());
    const section = report.sections.find((item) => item.id === "QUICK_SUMMARY");
    const text = JSON.stringify(section);
    const openingBlock = section?.blocks.find(
      (block) =>
        block.kind === "PARAGRAPH" &&
        block.titleKo === "나를 부르는 첫 문장",
    );

    expect(text).toContain("당신은");
    expect(openingBlock?.bodyKo).toContain("당신은");
    expect(text).not.toContain("undefined님");
    expect(text).not.toContain("null님");
  });

  it("renders core pillars deterministically", () => {
    const report = buildReport(createReportInput());
    const section = report.sections.find((item) => item.id === "SAJU_CORE");
    const block = section?.blocks[0];

    expect(block?.kind).toBe("KEY_VALUE");
    expect(block?.keyValues).toEqual([
      { keyKo: "년주", valueKo: "甲辰 갑진 — 갑목 + 진토" },
      { keyKo: "월주", valueKo: "丙寅 병인 — 병화 + 인목" },
      { keyKo: "일주", valueKo: "丙申 병신 — 병화 + 신금" },
      { keyKo: "시주", valueKo: "丁酉 정유 — 정화 + 유금" },
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
    expect(section?.blocks[0]?.bodyKo).toBe(
      "丙火 병화 일간 — 밝게 드러나는 불의 기운",
    );
  });

  it("renders day pillar profile in the day master section", () => {
    const report = buildReport({
      ...createReportInput(),
      dayPillarProfile: getDayPillarProfile("丙申"),
    });
    const section = report.sections.find((item) => item.id === "DAY_MASTER");
    const text = JSON.stringify(section);

    expect(text).toContain("丙火 병화 일간");
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
      expect(report.sections).toHaveLength(expectedSectionIds.length);
      expect(text).toContain(profileResult.profile.nameKo);
      expect(text).toContain(profileResult.profile.imageKo);
      expect(text).toContain(profileResult.profile.coreSummaryKo);
      expect(text).toContain(profileResult.profile.structureKo);
      expect(text).toContain("강점");
      expect(text).toContain("주의할 흐름");
      expect(text).toContain("활용 방향");
      expect(text).toContain("丙火 병화 일간");
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

    expect(text).toContain("오행 밸런스");
    expect(text).toContain("화 기운이 뚜렷한 편입니다.");
    expect(text).toContain("금 기운이 뚜렷한 편입니다.");
    expect(text).toContain("대표 보완 기운인 수 기운은");
    expect(text).not.toContain("FIRE" + "_STRONG");
    expect(text).not.toContain("METAL" + "_STRONG");
    expect(text).not.toContain("WATER" + "_WEAK");
  });

  it("adds practical routine markers to the elements section", () => {
    const report = buildReport(createReportInput());
    const section = report.sections.find((item) => item.id === "ELEMENTS");
    const text = JSON.stringify(section);

    expect(section?.blocks.some((block) => block.kind === "BULLET_LIST")).toBe(
      true,
    );
    expect(text).toContain("오행은 좋고 나쁨을 나누는 점수가 아니라");
    expect(text).toContain("부족한 기운은 억지로 채우기보다");
    expect(text).toContain("추천 색상");
    expect(text).toContain("추천 공간");
    expect(text).toContain("보완 루틴");
  });

  it("uses representative supplement keywords instead of raw element codes", () => {
    const report = buildReport({
      ...createReportInput(),
      structureAnalysis: {
        dayMasterStrength: {
          level: "BALANCED",
          score: 0,
          labelKo: "중화",
          summaryKo: "기운이 한쪽으로 크게 치우치지 않는 흐름입니다.",
          confidence: "MEDIUM",
          evidence: [],
        },
        patterns: [],
        summary: {
          titleKo: "사주 구조 요약",
          bodyKo: "기운의 균형을 함께 보는 편이 좋습니다.",
          keywordsKo: ["WOOD" + "_WEAK", "METAL" + "_WEAK"],
        },
        notices: [],
      },
    });
    const text = JSON.stringify(report);

    expect(text).toContain("대표 보완 기운");
    expect(text).not.toContain("WOOD" + "_WEAK");
    expect(text).not.toContain("METAL" + "_WEAK");
  });

  it("does not expose raw element keywords or old score-table markers", () => {
    const report = buildReport(createReportInput());
    const text = JSON.stringify(report);
    const oldScoreTitle = "고급 참고 " + "점수";
    const oldHighScore = "(" + "4.2" + ")";
    const oldLowScore = "(" + "0.1" + ")";

    expectNoRawElementCodes(text);
    expect(text).not.toContain(oldScoreTitle);
    expect(text).not.toContain(oldHighScore);
    expect(text).not.toContain(oldLowScore);
    expect(text).not.toContain("비견: " + "1.3");
  });

  it("keeps production-style broad-year report output reader-facing", () => {
    const result = createReportFromRawInput({
      displayName: "GYEOLTEST",
      birthDate: "1996-12-06",
      birthTime: "14:15",
      birthTimeUnknown: false,
      calendarType: "SOLAR",
      gender: "FEMALE",
      mbtiType: "ENTJ",
      timezone: "Asia/Seoul",
    });

    expect(result.ok).toBe(true);
    if (!result.ok) {
      throw new Error("expected production-style fixture report");
    }

    const report = result.report;
    const text = JSON.stringify(report);
    const quickSummary = report.sections.find(
      (section) => section.id === "QUICK_SUMMARY",
    );
    const keywordBlock = quickSummary?.blocks.find(
      (block) => block.kind === "BULLET_LIST" && block.titleKo === "키워드",
    );
    const elements = report.sections.find((section) => section.id === "ELEMENTS");
    const elementBalanceBlock = elements?.blocks.find(
      (block) =>
        block.kind === "BULLET_LIST" && block.titleKo === "오행 밸런스",
    );
    const oldHighScore = "(" + "4.2" + ")";
    const oldLowScore = "(" + "0.1" + ")";
    const oldHighBand = "높음 " + "(";
    const oldLowBand = "낮음 " + "(";

    expect(report.sections.map((section) => section.titleKo)).toEqual(
      expect.arrayContaining([
        "한눈에 보는 나의 결",
        "오행",
        "십성",
        "신살·귀인",
        "일·돈·관계 활용 포인트",
        "MBTI 프로필",
      ]),
    );
    expect(keywordBlock).toBeDefined();
    expect(elementBalanceBlock).toBeDefined();
    expect(JSON.stringify(keywordBlock)).toContain("대표 보완 기운: 금");
    expect(JSON.stringify(keywordBlock)).toContain(
      "함께 보면 좋은 보완 기운: 목",
    );
    expect(text).toContain("대표 보완 기운은 금 기운이고");
    expect(text).toContain("목 기운은 함께 보면 좋은 보완 축");
    expectNoRawElementCodes(text);
    expect(text).not.toContain(oldHighScore);
    expect(text).not.toContain(oldLowScore);
    expect(text).not.toContain(oldHighBand);
    expect(text).not.toContain(oldLowBand);
    expect(text).not.toContain("비견: " + "1.3");
  });

  it("uses polished preview and practical safety copy", () => {
    const report = buildReport(createReportInput());
    const text = JSON.stringify(report);
    const badParticle = "시간" + "를";
    const oldDevPreviewCopy = "개발용 미리보기로 전체 구조를 " + "확인합니다.";
    const oldDevModeCopy = "현재 화면은 개발용 전체 미리보기 " + "모드입니다.";

    expect(text).toContain("출생정보와 해석 결과는 자기이해용 참고자료입니다.");
    expect(text).not.toContain(
      "무료 미리보기에서는 " + "핵심 구조 일부를 먼저 확인할 수 있습니다.",
    );
    expect(text).not.toContain(
      "전체 리포트 영역은 " + "정식 결제 연동 이후 제공됩니다.",
    );
    expect(text).toContain("의식적으로 챙겨야 균형이 맞습니다");
    expect(text).toContain("결과를 보장하는 요소가 아니라");
    expect(text).toContain("리마인드 도구");
    expect(text).toContain("이번 주에 조정할 수 있는 행동 단위");
    expect(text).not.toContain(badParticle);
    expect(text).not.toContain(oldDevPreviewCopy);
    expect(text).not.toContain(oldDevModeCopy);
  });

  it("uses compressed Ten Gods reader-facing flow", () => {
    const report = buildReport(createReportInput());
    const section = report.sections.find((item) => item.id === "TEN_GODS");
    const text = JSON.stringify(section);
    const oldMovementTitle = "내가 움직이는 " + "방식";
    const oldDetailTitle = "십성 세부 " + "리딩";
    const oldGroupTitle = "십성 " + "묶음";
    const oldPointTitle = "십성 해석 " + "포인트";

    expect(text).toContain("십성 실전 기준");
    expect(text).toContain("가장 강하게 쓰는 흐름");
    expect(text).toContain("보완해서 보면 좋은 흐름");
    expect(text).toContain("십성 종합");
    expect(text).not.toContain(oldMovementTitle);
    expect(text).not.toContain(oldDetailTitle);
    expect(text).not.toContain(oldGroupTitle);
    expect(text).not.toContain(oldPointTitle);
  });

  it("keeps Ten God reference flow reader-facing without decimal scores", () => {
    const report = buildReport(createReportInput());
    const section = report.sections.find((item) => item.id === "TEN_GODS");
    const text = JSON.stringify(section);
    const oldScoreTitle = "고급 참고 " + "점수";

    expect(text).not.toContain("0.7999999999999999");
    expect(text).not.toContain(oldScoreTitle);
    expect(text).not.toContain("비견: " + "1.3");
    expect(text).not.toContain("겁재: " + "1");
    expect(text).not.toContain("편재: " + "0.1");
    expect(text).toContain("생각을 결과물로 꺼내는 힘");
    expect(text).toContain("돈·자원·성과를 기준표로 관리하는 힘");
  });

  it("preserves Ten Gods fallback without structure analysis", () => {
    const report = buildReport(createReportInput());
    const section = report.sections.find((item) => item.id === "TEN_GODS");
    const text = JSON.stringify(section);

    expect(
      section?.blocks.some(
        (block) => block.kind === "PARAGRAPH" && block.titleKo === "십성 종합",
      ),
    ).toBe(true);
    expect(text).toContain(
      "편인과 비견 흐름이 상대적으로 눈에 띄어 자기 기준, 학습성, 독립적 판단이 강하게 작동할 수 있습니다.",
    );
    expect(text).toContain("기준표와 역할 범위를 나누어 보는 편이 좋습니다");
    expect(text).toContain("십성은 성격표가 아니라");
    expect(text).toContain("관계, 일, 자원, 표현 방식");
    expect(text).toContain("가장 강하게 쓰는 흐름");
    expect(text).toContain("보완해서 보면 좋은 흐름");
    expect(text).not.toContain("십성 " + "묶음");
    expect(text).not.toContain("십성 해석 " + "포인트");
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
    const oldMovementTitle = "내가 움직이는 " + "방식";
    const oldDetailTitle = "십성 세부 " + "리딩";
    const oldGroupTitle = "십성 " + "묶음";
    const oldPointTitle = "십성 해석 " + "포인트";

    expect(report.sections).toHaveLength(expectedSectionIds.length);
    expect(text).toContain("십성 종합");
    expect(text).toContain("가장 강하게 쓰는 흐름");
    expect(text).toContain("보완해서 보면 좋은 흐름");
    expect(text).toContain("내 기준을 세우고 직접 움직이는 힘");
    expect(text).toContain("생각을 결과물로 꺼내는 힘");
    expect(text).toContain("돈·자원·성과를 기준표로 관리하는 힘");
    expect(text).not.toContain(oldMovementTitle);
    expect(text).not.toContain(oldDetailTitle);
    expect(text).not.toContain(oldGroupTitle);
    expect(text).not.toContain(oldPointTitle);
    expect(text).toContain("비겁");
    expect(text).toContain("인성");
    expect(text).toContain("식상");
    expect(text).toContain("재성");
    expect(text).toContain("관성");
    expect(text).toContain("자기 기준");
    expect(text).toContain("학습");
    expect(text).toContain("표현");
    expect(text).toContain("현실 성과와 역할");
    expect(text).toContain("역할과 기준 안에서 방향");
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

    expect(report.sections).toHaveLength(expectedSectionIds.length);
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

  it("renders high-interest practical work resource and relationship points", () => {
    const report = buildReport(createReportInput());
    const section = report.sections.find(
      (item) => item.id === "PRACTICAL_POINTS",
    );
    const text = JSON.stringify(section);

    expect(section?.titleKo).toBe("일·돈·관계 활용 포인트");
    expect(text).toContain("잘 맞는 역할");
    expect(text).toContain("강점이 살아나는 직무 예시");
    expect(text).toContain("돈과 자원을 다루는 방식");
    expect(text).toContain("관계에서 자주 생길 수 있는 장면");
    expect(text).toContain("연애에서 도움이 되는 태도");
    expect(text).toContain("오늘부터 써먹는 루틴");
    expect(text).toContain("강한 기운을 더 쓰는 역할");
    expect(text).toContain("돈과 자원은 많이 들어오는지보다");
    expect(text).toContain("관리·판단·교환·축적");
    expect(text).toContain("내가 편하게 쓰는 반응 방식");
    expect(text).toContain("목표와 기준이 어느 정도 있는 상황");
    expect(text).toContain("구조를 만들고 흐름을 정리할 때");
    expect(text).toContain("기준표·예산·우선순위");
    expect(text).toContain("해결보다 먼저 들어주는 시간");
    expect(text).toContain("책임을 너무 빨리 떠안으면");
    expect(text).toContain("사람과 속도를 맞추는 방식");
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
    expect(text).toContain("막혔을 때 조언·중재·완충");
    expect(text).toContain("끝까지 밀고 들어가는 압축된 에너지");
    expect(text).toContain("핵심 신호");
    expect(text).toContain("반복 신호");
    expect(text).toContain("실전 해석");
    expect(text).toContain("같은 신호가 여러 위치에서 반복되면");
    expect(text).toContain(
      "년·월·일·시의 위치는 사건을 단정하는 기준이 아니라",
    );
    expect(text).toContain("집중력, 검수, 분석");
    expect(text).toContain("말의 강도, 거리 조절");
    expect(text).toContain("예민함을 쓸 곳과 쉬게 할 곳");
    expect(text).toContain("귀인은 누군가가 알아서 도와준다는 뜻보다");
    expect(text).toContain("도움받기 쉬운 태도와 연결 방식");
  });

  it("renders vivid shinsal and gwiin copy for selected signals", () => {
    const input = createReportInput();
    const report = buildReport({
      ...input,
      sajuTags: [
        createShinsalTag("SHINSAL_HONGYEOMSAL", "홍염살"),
        createShinsalTag("SHINSAL_GOSINSAL", "고신살"),
      ],
    });
    const section = report.sections.find((item) => item.id === "SHINSAL");
    const text = JSON.stringify(section);

    expect(text).toContain("말투·표정·분위기");
    expect(text).toContain("혼자 정리할 시간과 독립적인 공간");
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

  it("renders MBTI guidance and saju mbti connection markers", () => {
    const report = buildReport(createReportInput());
    const mbtiSection = report.sections.find(
      (item) => item.id === "MBTI_PROFILE",
    );
    const bridgeSection = report.sections.find(
      (item) => item.id === "SAJU_MBTI_BRIDGE",
    );
    const text = JSON.stringify([mbtiSection, bridgeSection]);

    expect(mbtiSection?.titleKo).toBe("MBTI 프로필");
    expect(bridgeSection?.titleKo).toBe("사주×MBTI 연결");
    expect(text).toContain(
      "MBTI는 내가 인식하는 나의 모습이 반영되기 쉽습니다.",
    );
    expect(text).toContain(
      "가능하면 나를 오래 본 사람의 피드백이나 여러 번의 검사 결과를 함께 참고하면 더 안정적으로 볼 수 있습니다.",
    );
    expect(text).toContain("MBTI 기본 정보");
    expect(text).toContain("자기보고");
    expect(text).toContain("ENTJ");
    expect(text).toContain("전략");
    expect(text).toContain(
      "목표를 세우고, 구조를 만들고, 빠르게 밀고 가는 전략 추진형에 가깝습니다.",
    );
    expect(text).toContain("MBTI는 사주를 대체하는 기준이 아니라");
    expect(text).toContain("생각·판단·소통 방식");
    expect(text).toContain("사주와 MBTI가 겹치는 부분");
    expect(text).toContain("조절 지점");
    expect(text).toContain("의사결정 속도");
    expect(text).toContain("기준을 세우는 방식");
    expect(text).toContain("표현을 먼저 하는지");
    expect(text).toContain("정리를 먼저 하는지");
    expect(text).toContain("에너지가 빨리 닳는 장면");
    expect(text).toContain("회복이 쉬운 장면");
    expect(text).toContain("겹치는 점");
    expect(text).toContain("다르게 보이는 점");
    expect(text).toContain("입력 MBTI 안에서의 세부 스타일");
  });

  it("renders strengthened style labels for selected MBTI types", () => {
    const styleCases = [
      { type: "INTJ", label: "구조 설계형" },
      { type: "INTP", label: "원리 탐색형" },
      { type: "ENTJ", label: "전략 추진형" },
      { type: "ENTP", label: "관점 전환형" },
      { type: "INFP", label: "가치 몰입형" },
      { type: "ENFP", label: "가능성 확장형" },
      { type: "ISTJ", label: "기준 보존형" },
      { type: "ESTJ", label: "운영 정리형" },
    ] as const;

    for (const item of styleCases) {
      const report = buildReport(
        createReportInput({
          mbti: getMbtiProfile(item.type),
        }),
      );
      const section = report.sections.find(
        (reportSection) => reportSection.id === "MBTI_PROFILE",
      );
      const text = JSON.stringify(section);

      expect(text).toContain(item.type);
      expect(text).toContain(item.label);
      expect(text).toContain("일·관계·자기관리 스타일");
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
