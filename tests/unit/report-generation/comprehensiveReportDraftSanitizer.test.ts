import { describe, expect, it } from "vitest";

import { sanitizeComprehensiveReportNarrativeDraft } from "../../../src/lib/report-generation/comprehensiveReportDraftSanitizer";
import type {
  ComprehensiveReportV2Draft,
  ComprehensiveReportV2NarrativeDraft,
} from "../../../src/lib/report-generation/comprehensiveReportDraftTypes";

function createNarrativeDraft(): ComprehensiveReportV2NarrativeDraft {
  return {
    version: "comprehensive_v2_draft",
    productType: "saju_mbti_full",
    openingTitle: "치료와 문서를 말하지 않는 리포트",
    openingSummary: "이 초안은 contrast와 output 표현을 정리합니다.",
    coreLine: "진단 대신 성향 해석으로 읽습니다.",
    chapters: [
      {
        chapterId: "opening",
        titleKo: "OpenAI JSON debug를 숨긴 시작",
        headline: "프롬프트와 schema를 말하지 않습니다.",
        hitReadingLines: ["우울증이나 불안장애 같은 단어를 쓰지 않습니다."],
        body:
          "상담치료, 의료 상담, 법률 자문, 투자 추천, 수익 보장, 운명 확정 표현을 자연스럽게 바꿉니다.",
        solutionLines: ["rawText와 response_format, evidence packet을 노출하지 않습니다."],
        keyPhrases: ["draft", "텍스트", "원고"],
        sajuTermsUsed: ["갑목"],
        mbtiTermsUsed: ["ENTJ"],
      },
    ],
    finalAdvice: "100% 보장이나 무조건, 반드시 같은 표현을 줄입니다.",
    safetyNotes: ["API key와 Authorization은 보이지 않아야 합니다."],
  };
}

describe("comprehensive report draft sanitizer", () => {
  it("replaces unsafe medical meta and English template wording in narrative fields", () => {
    const result = sanitizeComprehensiveReportNarrativeDraft(createNarrativeDraft());
    const serialized = JSON.stringify(result.draft);

    expect(result.sanitized).toBe(true);
    expect(result.sanitizedTerms).toEqual(
      expect.arrayContaining(["치료", "문서", "contrast", "output", "초안"]),
    );
    expect(serialized).toContain("관리");
    expect(serialized).toContain("리포트");
    expect(serialized).toContain("대비");
    expect(serialized).toContain("표현");
    expect(serialized).not.toContain("치료");
    expect(serialized).not.toContain("문서");
    expect(serialized).not.toContain("contrast");
    expect(serialized).not.toContain("output");
    expect(serialized).not.toContain("초안");
    expect(serialized).not.toContain("진단");
    expect(serialized).not.toContain("우울증");
    expect(serialized).not.toContain("불안장애");
    expect(serialized).not.toContain("JSON");
    expect(serialized).not.toContain("프롬프트");
    expect(serialized).not.toContain("OpenAI");
  });

  it("does not alter deterministic profileTable fields", () => {
    const draft: ComprehensiveReportV2Draft = {
      ...createNarrativeDraft(),
      openingTitle: "안전한 제목",
      openingSummary: "안전한 요약",
      coreLine: "안전한 핵심선",
      profileTable: {
        dayPillar: "갑신일주",
        dayMaster: "갑목",
        dayPillarKeywords: ["문서"],
        fiveElementSummary: ["목 2", "화 0"],
        excessiveElements: ["토 과다"],
        missingElements: ["수 부족"],
        tenGodSummary: ["편관"],
        specialPatterns: ["재다신약"],
        sinsal: ["현침살"],
        gwiin: ["재고귀인"],
        mbti: "ENTJ",
      },
      finalAdvice: "안전한 마무리",
      safetyNotes: ["안전한 참고 문장"],
    };

    const result = sanitizeComprehensiveReportNarrativeDraft(draft);

    expect(result.draft.profileTable).toEqual(draft.profileTable);
    expect(result.draft.profileTable.dayPillarKeywords).toEqual(["문서"]);
  });

  it("removes fixed MBTI type example wording from generated relationship copy", () => {
    const draft = {
      ...createNarrativeDraft(),
      chapters: [
        {
          ...createNarrativeDraft().chapters[0],
          chapterId: "love_relationships" as const,
          body:
            "MBTI 예시: ISFP, INFP, INTP처럼 보완적으로 느껴질 수 있으나 MBTI만으로 궁합을 단정하지 않습니다.",
          solutionLines: [
            "MBTI 예시: ISFP, INFP, INTP 유형은 보완적으로 느껴질 수 있지만 MBTI만으로 궁합을 단정하지 않습니다.",
          ],
        },
      ],
    };
    const result = sanitizeComprehensiveReportNarrativeDraft(draft);
    const serialized = JSON.stringify(result.draft);

    expect(result.sanitized).toBe(true);
    expect(serialized).toContain(
      "MBTI 유형명보다 중요한 것은 실제 생활 리듬, 약속 습관, 감정 표현 방식입니다.",
    );
    expect(serialized).not.toContain("MBTI 예시");
    expect(serialized).not.toContain("ISFP");
    expect(serialized).not.toContain("INFP");
    expect(serialized).not.toContain("INTP");
  });

  it("replaces prompt artifact wording from generated report copy", () => {
    const draft = {
      ...createNarrativeDraft(),
      openingSummary:
        "체감형 명중보다 중요한 것은 정리와 각인입니다. signature scene과 spotlight을 그대로 쓰지 않습니다.",
      chapters: [
        {
          ...createNarrativeDraft().chapters[0],
          body:
            "feature evidence, selected evidence, computed feature, prompt, raw, debug 같은 내부 용어는 본문에 남기지 않습니다.",
        },
      ],
    };
    const result = sanitizeComprehensiveReportNarrativeDraft(draft);
    const serialized = JSON.stringify(result.draft);

    expect(result.sanitized).toBe(true);
    expect(serialized).toContain("실감나는 해석");
    expect(serialized).toContain("마무리");
    expect(serialized).not.toContain("체감형 명중");
    expect(serialized).not.toContain("정리와 각인");
    expect(serialized).not.toContain("signature scene");
    expect(serialized).not.toContain("spotlight");
    expect(serialized).not.toContain("feature evidence");
    expect(serialized).not.toContain("selected evidence");
    expect(serialized).not.toContain("computed feature");
    expect(serialized).not.toContain("prompt");
    expect(serialized).not.toContain("debug");
  });

  it("replaces advertising guarantee wording before validation", () => {
    const draft = {
      ...createNarrativeDraft(),
      openingSummary: "성공이 보장됩니다. 관계 보장과 재물 보장도 말하지 않습니다.",
      chapters: [
        {
          ...createNarrativeDraft().chapters[0],
          body:
            "수익 보장 같은 문장은 단정 광고처럼 보이므로 가능성 중심으로 바꿉니다.",
        },
      ],
      finalAdvice: "성공 보장 대신 흐름과 가능성으로 마무리합니다.",
    };
    const result = sanitizeComprehensiveReportNarrativeDraft(draft);
    const serialized = JSON.stringify(result.draft);

    expect(result.sanitized).toBe(true);
    expect(serialized).not.toContain("보장");
    expect(serialized).toContain("가능성");
    expect(serialized).toContain("기대할 수 있습니다");
  });

  it("replaces visible evidence and internal label wording before validation", () => {
    const draft = {
      ...createNarrativeDraft(),
      openingSummary: "사주 근거와 선택된 근거를 그대로 노출하지 않습니다.",
      chapters: [
        {
          ...createNarrativeDraft().chapters[0],
          body:
            "명리학 근거, 계산된 근거, feature evidence, selected evidence는 사용자용 문장이 아닙니다.",
        },
      ],
    };
    const result = sanitizeComprehensiveReportNarrativeDraft(draft);
    const serialized = JSON.stringify(result.draft);

    expect(result.sanitized).toBe(true);
    expect(serialized).not.toContain("사주 근거");
    expect(serialized).not.toContain("선택된 근거");
    expect(serialized).not.toContain("명리학 근거");
    expect(serialized).not.toContain("계산된 근거");
    expect(serialized).not.toContain("feature evidence");
    expect(serialized).not.toContain("selected evidence");
    expect(serialized).toContain("사주 흐름");
    expect(serialized).toContain("중요하게 잡힌 흐름");
  });

  it("replaces standalone meta document wording but preserves legitimate document work terms", () => {
    const draft = {
      ...createNarrativeDraft(),
      openingTitle: "이 문서는 최종 해석입니다.",
      openingSummary: "이 문서에서는 사주 구조를 먼저 읽습니다.",
      coreLine: "작성된 문서보다 사용자 해석이 먼저입니다.",
      chapters: [
        {
          ...createNarrativeDraft().chapters[0],
          body:
            "전문서 공부와 문서화, 문서 정리, 문서로 남기기는 일과 공부 조언으로 유지합니다. 문서 자체를 상품처럼 말하지는 않습니다.",
        },
      ],
    };
    const result = sanitizeComprehensiveReportNarrativeDraft(draft);
    const serialized = JSON.stringify(result.draft);

    expect(result.draft.openingTitle).toContain("이 리포트는");
    expect(result.draft.openingSummary).toContain("이 리포트에서는");
    expect(result.draft.coreLine).toContain("작성된 리포트");
    expect(serialized).toContain("전문서");
    expect(serialized).toContain("문서화");
    expect(serialized).toContain("문서 정리");
    expect(serialized).toContain("문서로 남기기");
    expect(serialized).not.toContain("문서 자체");
    expect(serialized).toContain("리포트 자체");
  });
});
