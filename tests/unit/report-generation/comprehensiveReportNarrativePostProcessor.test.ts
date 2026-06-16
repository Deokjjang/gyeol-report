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

  it("does not generate particle typo around 천을귀인 in final closing rescue", () => {
    const draft = createDraft();
    const result = normalizeComprehensiveReportFinalMessage({
      ...draft,
      profileTable: {
        ...draft.profileTable,
        gwiin: ["천을귀인", "재고귀인"],
        gwiinGilshin: ["천을귀인", "재고귀인"],
      },
    });
    const serialized = JSON.stringify(result.draft);

    expect(result.normalized).toBe(true);
    expect(serialized).toContain("천을귀인 흐름");
    expect(serialized).not.toContain("천을귀인가");
    expect(serialized).not.toContain("재고귀인가");
    expect(serialized).not.toContain("갑신일주가가");
  });

  it("does not append duplicate deterministic closing when final_message is already valid", () => {
    const draft = createDraft();
    const validClosingBody = [
      "이 리포트의 마지막 핵심은 더 세게 밀어붙이는 것이 아니라 갑신일주 흐름을 오래 쓰는 운영법을 만드는 일입니다.",
      "갑목 흐름과 재고귀인 흐름을 함께 보면 일, 관계, 돈, 회복을 하나의 루틴으로 묶어야 합니다.",
      "오늘부터는 첫째, 막힌 일을 안에서 오래 붙잡기보다 필요한 도움을 한 문장으로 요청하세요.",
      "둘째, 돈은 생활비, 저축, 자기계발, 비상금으로 나눠 계좌의 자리를 정하세요.",
      "셋째, 관계에서는 결론보다 먼저 상대 말을 한 문장으로 받아주세요.",
      "이 방식은 표현과 기준을 낮추는 일이 아니라, 기준을 오래 쓰기 위한 실천입니다.",
      "일에서는 우선순위를 작게 나누고, 관계에서는 질문을 먼저 꺼내며, 회복에서는 쉬는 시간을 일정에 넣어야 합니다.",
      "갑신일주, 갑목, 재고귀인, 현침살, 수 부족을 따로 보지 말고 하루의 루틴 안에서 같이 다루면 마지막 조언이 실제 행동으로 이어질 수 있습니다.",
      "중요한 것은 성격을 바꾸는 일이 아니라 힘의 쓰임을 조절하는 일입니다.",
      "일의 기준은 세우되 혼자 전부 끌어안지 않고, 관계의 표현은 늦추지 않되 결론을 먼저 던지지 않으며, 돈의 흐름은 감각이 아니라 계좌와 기록으로 확인하는 쪽이 더 오래 갑니다.",
      "이렇게 하면 강한 판단, 책임감, 실천 루틴이 서로 따로 놀지 않고 같은 방향으로 정리됩니다.",
    ].join(" ");
    const result = normalizeComprehensiveReportFinalMessage({
      ...draft,
      chapters: draft.chapters.map((chapter) =>
        chapter.chapterId === "final_message"
          ? {
              ...chapter,
              body: validClosingBody,
              solutionLines: [
                "오늘부터는 도움 요청을 한 문장으로 정리하세요.",
                "첫째, 돈의 계좌를 나누세요.",
                "둘째, 관계에서 질문을 먼저 꺼내세요.",
                "셋째, 쉬는 시간을 일정에 넣으세요.",
              ],
            }
          : chapter,
      ),
      finalAdvice:
        "오늘부터는 일, 관계, 돈, 회복을 따로 보지 말고 작은 실천 루틴으로 묶어 가세요.",
    });
    const serialized = JSON.stringify(result.draft);

    expect(result.normalized).toBe(false);
    expect(serialized.match(/이 리포트의 마지막 핵심/g)).toHaveLength(1);
  });
});
