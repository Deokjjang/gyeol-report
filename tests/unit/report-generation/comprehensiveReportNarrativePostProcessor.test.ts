import { describe, expect, it } from "vitest";

import { normalizeComprehensiveReportFinalMessage } from "../../../src/lib/report-generation/comprehensiveReportNarrativePostProcessor";
import type { ComprehensiveReportV2Draft } from "../../../src/lib/report-generation/comprehensiveReportDraftTypes";

function createDraft(): ComprehensiveReportV2Draft {
  return {
    version: "comprehensive_v2_draft",
    productType: "saju_mbti_full",
    openingTitle: "사주와 MBTI가 만나는 지점",
    openingSummary: "갑목과 갑신일주를 먼저 보고 ENTJ는 보조로 연결합니다.",
    coreLine: "갑목의 방향성과 ENTJ의 목표 지향이 함께 보입니다.",
    profileTable: {
      dayMaster: "갑목",
      dayPillar: "갑신일주",
      fiveElementSummary: ["목 2", "화 0", "토 4", "금 2", "수 0"],
      excessiveElements: ["토 과다"],
      missingElements: ["화 부족", "수 부족"],
      tenGodSummary: ["편관", "정관"],
      specialPatterns: ["재다신약"],
      sinsal: ["현침살"],
      gwiin: ["재고귀인"],
      mbti: "ENTJ",
    },
    chapters: [
      {
        chapterId: "final_message",
        titleKo: "마지막으로 남길 말",
        headline: "마지막 정리",
        hitReadingLines: ["덕민님은 기준을 빨리 세우는 편입니다."],
        body: "갑목과 갑신일주를 기준으로 마지막 방향을 짧게 정리합니다.",
        solutionLines: [],
        keyPhrases: ["갑목", "갑신일주"],
        sajuTermsUsed: ["갑목", "갑신일주"],
        mbtiTermsUsed: ["ENTJ"],
      },
    ],
    finalAdvice: "방향성은 살리되 오래 가는 방식을 함께 설계하세요.",
    safetyNotes: ["자기이해용 참고 콘텐츠입니다."],
  };
}

describe("comprehensive report narrative post processor", () => {
  it("strengthens weak final_message with deterministic closing guidance", () => {
    const result = normalizeComprehensiveReportFinalMessage(createDraft());
    const serialized = JSON.stringify(result.draft);
    const finalChapter = result.draft.chapters.find(
      (chapter) => chapter.chapterId === "final_message",
    );

    expect(result.normalized).toBe(true);
    expect(finalChapter?.body).toContain("이 리포트의 마지막 핵심");
    expect(finalChapter?.body).toContain("일, 관계, 돈, 회복");
    expect(finalChapter?.body).toContain("오늘부터는");
    expect(finalChapter?.solutionLines).toHaveLength(4);
    expect(serialized).not.toContain("문서");
    expect(serialized).not.toContain("초안");
    expect(serialized).not.toContain("생성");
    expect(serialized).not.toContain("OpenAI");
    expect(serialized).not.toContain("JSON");
    expect(serialized).not.toContain("프롬프트");
    expect(serialized).not.toContain("치료");
    expect(serialized).not.toContain("진단");
    expect(serialized).not.toContain("보장");
    expect(serialized).not.toContain("반드시");
    expect(serialized).not.toContain("100%");
  });
});
