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

function countMatches(text: string, pattern: RegExp): number {
  return text.match(pattern)?.length ?? 0;
}

describe("report output fixture", () => {
  it("produces stable 15-section report", () => {
    const report = getFixtureReport();

    expect(report.version).toBe("v1");
    expect(report.titleKo).toBe("결리포트");
    expect(report.sections).toHaveLength(expectedSectionIds.length);
    expect(report.sections.map((section) => section.id)).toEqual(
      expectedSectionIds,
    );
  });

  it("shows core pillars", () => {
    const report = getFixtureReport();
    const section = findSection(report, "SAJU_CORE");
    const block = section.blocks.find((item) => item.kind === "KEY_VALUE");

    expect(block?.keyValues).toEqual(
      expect.arrayContaining([
        { keyKo: "년주", valueKo: "甲辰 갑진 — 갑목 + 진토" },
        { keyKo: "월주", valueKo: "丙寅 병인 — 병화 + 인목" },
        { keyKo: "일주", valueKo: "丙申 병신 — 병화 + 신금" },
        { keyKo: "시주", valueKo: "丁酉 정유 — 정화 + 유금" },
      ]),
    );
  });

  it("shows professional shinsal terms", () => {
    const report = getFixtureReport();
    const section = findSection(report, "SHINSAL");
    const text = collectSectionText(section);

    expect(text).toContain("천을귀인");
    expect(text).toContain("월덕귀인");
    expect(text).toContain("천덕귀인");
    expect(text).toContain("태극귀인");
    expect(text).toContain("문창귀인");
    expect(text).toContain("학당귀인");
    expect(text).toContain("현침살");
    expect(text).toContain("백호대살");
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
    const block = section.blocks.find((item) => item.kind === "BULLET_LIST");

    expect(block?.kind).toBe("BULLET_LIST");
    if (block?.kind !== "BULLET_LIST") {
      throw new Error("missing shinsal bullet list");
    }

    expect(text).toMatch(/지살|역마살|화개살|화개/);
    expect(block.itemsKo?.length ?? 0).toBeLessThanOrEqual(11);
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

  it("limits and deduplicates shinsal fixture output", () => {
    const report = getFixtureReport();
    const section = findSection(report, "SHINSAL");
    const block = section.blocks.find((item) => item.kind === "BULLET_LIST");
    const text = collectSectionText(section);
    const noticePrefix = "그 밖의 신살 신호도 함께 감지되지만";

    expect(block?.kind).toBe("BULLET_LIST");
    if (block?.kind !== "BULLET_LIST") {
      throw new Error("missing shinsal bullet list");
    }

    const items = block.itemsKo ?? [];

    expect(items.length).toBeLessThanOrEqual(11);
    expect(countMatches(text, /역마살/g)).toBeLessThanOrEqual(1);
    expect(countMatches(text, /화개살|화개/g)).toBeLessThanOrEqual(1);
    expect(countMatches(text, /도화살|도화|홍염살|홍염|년살/g)).toBeLessThanOrEqual(
      1,
    );
    if (items.some((item) => item.includes(noticePrefix))) {
      expect(items.at(-1)).toContain(noticePrefix);
    }
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

    expect(text).toContain("일주 핵심");
    expect(text).toContain("일주 구조");
    expect(text).toContain("오행 밸런스");
    expect(text).toContain("추천 색상·공간·보완 루틴");
    expect(text).toContain("가장 강하게 쓰는 흐름");
    expect(text).toContain("보완해서 보면 좋은 흐름");
    expect(text).toContain("내가 움직이는 방식");
    expect(text).toContain("십성 묶음");
    expect(text).toContain("십성 종합");
    expect(text).toContain("십성 해석 포인트");
    expect(text).toContain(
      "밝은 태양이 날카로운 금속 위에 비치는 이미지입니다.",
    );
    expect(text).toContain(
      "병신일주는 밝게 드러나는 표현성과 빠른 판단력이 함께 작동하는 구조입니다.",
    );
    expect(text).toContain("물가 산책, 수면 루틴, 반신욕");
    expect(text).toContain("십성 세부 리딩");
    expect(text).toContain("비겁");
    expect(text).toContain("인성");
    expect(text).toContain("식상");
    expect(text).toContain("재성");
    expect(text).toContain("관성");
  });

  it("renders enhanced Ten Gods blocks in fixture output", () => {
    const report = getFixtureReport();
    const section = findSection(report, "TEN_GODS");
    const text = collectSectionText(section);
    const blockKinds = section.blocks.map((block) => block.kind);

    expect(blockKinds).toContain("PARAGRAPH");
    expect(blockKinds).toContain("BULLET_LIST");
    expect(text).toContain("십성 묶음");
    expect(text).toContain("십성 종합");
    expect(text).toContain("십성 해석 포인트");
    expect(text).toContain("가장 강하게 쓰는 흐름");
    expect(text).toContain("보완해서 보면 좋은 흐름");
    expect(text).toContain("내 기준을 세우고 직접 움직이는 힘");
    expect(text).toContain("생각을 결과물로 꺼내는 힘");
    expect(text).toContain("돈·자원·성과를 기준표로 관리하는 힘");
    expect(text).toContain("자기 기준");
    expect(text).toContain("학습");
    expect(text).toContain("표현");
    expect(text).toContain("현실 감각");
    expect(text).toContain("책임");
    expect(text).not.toContain("십성 흐름");
  });

  it("includes structure analysis in fixture output", () => {
    const report = getFixtureReport();
    const text = JSON.stringify(report);

    expect(text).toContain("신강신약");
    expect(text).toContain("구조 근거");
    expect(text).toContain("사주 구조 요약");
    expect(text).toContain("구조 후보");
    expect(text).toContain("해석 기준");
    expect(text).toContain("비겁");
    expect(text).toContain("인성");
    expect(text).toContain("식상");
    expect(text).toContain("재성");
    expect(text).toContain("관성");
    expect(text).toContain("인성 강한 구조");
    expect(text).toContain("비겁 강한 구조");
    expect(text).toContain("관살혼잡 후보");
  });

  it("renders richer advanced pattern blocks in fixture output", () => {
    const report = getFixtureReport();
    const section = findSection(report, "ADVANCED_PATTERNS");
    const text = collectSectionText(section);
    const blockKinds = section.blocks.map((block) => block.kind);

    expect(blockKinds).toContain("HIGHLIGHT");
    expect(blockKinds).toContain("PARAGRAPH");
    expect(blockKinds).toContain("BULLET_LIST");
    expect(text).toContain("신강신약");
    expect(text).toContain("구조 후보");
    expect(text).toContain("해석 기준");
  });

  it("renders day master profile blocks in fixture output", () => {
    const report = getFixtureReport();
    const section = findSection(report, "DAY_MASTER");
    const text = collectSectionText(section);
    const blockKinds = section.blocks.map((block) => block.kind);

    expect(blockKinds).toContain("HIGHLIGHT");
    expect(blockKinds).toContain("KEY_VALUE");
    expect(blockKinds).toContain("PARAGRAPH");
    expect(blockKinds).toContain("BULLET_LIST");
    expect(text).toContain("병신일주");
    expect(text).toContain("일주 핵심");
    expect(text).toContain("일주 구조");
    expect(text).toContain("강점");
    expect(text).toContain("주의할 흐름");
    expect(text).toContain("활용 방향");
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

    expect(text).toContain("화 기운이 뚜렷한 편입니다.");
    expect(text).toContain("금 기운이 뚜렷한 편입니다.");
    expect(text).toContain("대표 보완 기운인 수 기운은");
    expect(text).not.toContain("FIRE" + "_STRONG");
    expect(text).not.toContain("METAL" + "_STRONG");
    expect(text).not.toContain("WATER" + "_WEAK");
    expect(text).not.toContain("TEN_GOD_OUTPUT_STRONG");
    expect(text).not.toContain("OFFICER_PRESSURE_HIGH");
    expect(text).not.toContain("WEALTH_OVERLOAD");
  });

  it("uses polished public copy and mobile-readable labels", () => {
    const report = getFixtureReport();
    const text = JSON.stringify(report);
    const mbtiText = collectSectionText(findSection(report, "MBTI_PROFILE"));
    const badParticle = "시간" + "를";
    const oldDevPreviewCopy = "개발용 미리보기로 전체 구조를 " + "확인합니다.";
    const oldDevModeCopy = "현재 화면은 개발용 전체 미리보기 " + "모드입니다.";

    expect(text).toContain("출생정보와 해석 결과는 자기이해용 참고자료입니다.");
    expect(text).toContain(
      "사주 기반 MBTI 후보는 확정 판정이 아니라 자기이해를 돕기 위한 비교 기준입니다.",
    );
    expect(text).toContain(
      "입력한 MBTI는 사용자의 자기보고 정보로 존중하며, 사주 기반 제안은 보조 해석으로만 사용합니다.",
    );
    expect(text).not.toContain(
      "무료 미리보기에서는 " + "핵심 구조 일부를 먼저 확인할 수 있습니다.",
    );
    expect(text).not.toContain(
      "전체 리포트 영역은 " + "정식 결제 연동 이후 제공됩니다.",
    );
    expect(text).toContain("의식적으로 챙겨야 균형이 맞습니다");
    expect(text).toContain("십성 세부 리딩");
    expect(text).toContain("잘 맞는 역할");
    expect(text).toContain("돈과 자원을 다루는 방식");
    expect(text).toContain("관계에서 자주 생길 수 있는 장면");
    expect(text).toContain("연애에서 도움이 되는 태도");
    expect(text).toContain("결과를 보장하는 요소가 아니라");
    expect(text).toContain("리마인드 도구");
    expect(text).not.toContain(badParticle);
    expect(text).not.toContain(oldDevPreviewCopy);
    expect(text).not.toContain(oldDevModeCopy);
    expect(mbtiText).toContain("MBTI 기본 정보");
    expect(mbtiText).toContain("스타일 설명");
    expect(mbtiText).not.toContain('"titleKo":"입력 MBTI"');
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
