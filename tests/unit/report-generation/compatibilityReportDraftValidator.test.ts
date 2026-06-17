import { describe, expect, it } from "vitest";

import type { CompatibilityReportDraft } from "../../../src/lib/report-generation/compatibilityReportDraftTypes";
import {
  sanitizeCompatibilityAwkwardKoreanText,
  validateCompatibilityReportDraft,
} from "../../../src/lib/report-generation/compatibilityReportDraftValidator";
import {
  buildCompatibilityEvidencePacketFromFixtureId,
} from "../../../src/lib/report-knowledge/compatibilityEvidenceBuilder";
import {
  deriveAllowedCompatibilityMbtiTerms,
  deriveAllowedCompatibilitySajuTerms,
} from "../../../src/lib/report-generation/openaiCompatibilityReportWriterPrompt";

function createValidCompatibilityDraft(): CompatibilityReportDraft {
  const packet = buildCompatibilityEvidencePacketFromFixtureId("deokmin-sodam-love");

  return {
    version: "compatibility_v1_draft",
    productType: "saju_mbti_compatibility",
    productVersion: "1.0",
    relationshipType: "love",
    personALabel: "덕민",
    personBLabel: "소담",
    openingTitle: "서로 다른 속도가 끌림과 조율을 함께 만드는 궁합",
    openingSummary:
      "덕민님과 소담님은 천을귀인과 재고귀인을 함께 쓰지만, ENTJ의 실행 속도와 INTP의 검토 속도가 다르게 움직입니다.",
    coreLine:
      "갑신일주와 정축일주의 차이는 빠른 구조화와 조용한 검토가 만나는 장면으로 드러납니다.",
    scoreSummary: packet.score,
    chartComparison: {
      personA: packet.personAChartSummary,
      personB: packet.personBChartSummary,
    },
    keyCompatibilityPoints: {
      attractionPoints: ["천을귀인과 재고귀인이 함께 있어 막힌 일을 같이 정리하는 힘이 있습니다."],
      strengthPoints: ["ENTJ와 INTP는 결론과 원리 검토가 나뉘면 서로의 빈칸을 채울 수 있습니다."],
      frictionPoints: ["한쪽은 빠른 결론, 한쪽은 조건 확인이 필요해 대화 속도가 어긋날 수 있습니다."],
      relationshipRules: ["중요한 결정은 결론 시간과 검토 시간을 따로 정해야 합니다."],
    },
    chapters: [
      "overview",
      "attraction",
      "strengths",
      "frictions",
      "communication",
      "relationship_scenes",
      "money_lifestyle",
      "conflict_recovery",
      "long_term_rules",
    ].map((id) => ({
      id: id as CompatibilityReportDraft["chapters"][number]["id"],
      title: `궁합 ${id}`,
      headline: "두 사람의 실제 리듬을 놓고 보는 장입니다.",
      body:
        "덕민님의 갑신일주와 소담님의 정축일주는 서로 다른 방식으로 관계를 정리합니다. ENTJ는 빨리 방향을 잡고, INTP는 조건과 예외를 확인한 뒤 움직일 때 안정됩니다.",
      directHitScenes: [
        "한쪽은 바로 결론을 내고 싶고, 한쪽은 원리와 조건을 더 확인해야 움직이는 장면이 반복될 수 있습니다.",
      ],
      practicalAdvice: ["중요한 대화는 결론, 검토, 실행 시간을 나누어 정하세요."],
    })),
    finalAdvice: [
      "오늘부터 중요한 이야기는 결론부터 밀지 말고 검토 시간을 함께 정하세요.",
      "돈과 일정은 각자의 방식으로 관리하되 공유 기준만 먼저 맞추세요.",
      "도움이 필요할 때는 혼자 정리하지 말고 필요한 지원을 한 문장으로 공유하세요.",
    ],
    safetyNotes: [
      "이 점수는 관계의 성공이나 실패를 단정하는 값이 아니라 조정 지점을 보기 위한 참고입니다.",
    ],
  };
}

function validate(draft: unknown) {
  const packet = buildCompatibilityEvidencePacketFromFixtureId("deokmin-sodam-love");

  return validateCompatibilityReportDraft(draft, {
    allowedSajuTerms: deriveAllowedCompatibilitySajuTerms(packet),
    allowedMbtiTerms: deriveAllowedCompatibilityMbtiTerms(packet),
  });
}

describe("compatibilityReportDraftValidator", () => {
  it("passes a valid compatibility draft with actual input MBTIs", () => {
    const result = validate(createValidCompatibilityDraft());

    expect(result.ok).toBe(true);
    expect(result.warnings).toEqual([]);
  });

  it("fails when score summary is missing", () => {
    const draft = { ...createValidCompatibilityDraft() } as Partial<CompatibilityReportDraft>;
    delete draft.scoreSummary;

    expect(validate(draft).ok).toBe(false);
  });

  it("fails when a chapter direct-hit scene is missing", () => {
    const draft = createValidCompatibilityDraft();
    const result = validate({
      ...draft,
      chapters: draft.chapters.map((chapter, index) =>
        index === 0 ? { ...chapter, directHitScenes: [] } : chapter,
      ),
    });

    expect(result.errors).toContain("COMPATIBILITY_DIRECT_HIT_MISSING: overview");
  });

  it("fails unsafe destiny and fixed-outcome copy", () => {
    const draft = createValidCompatibilityDraft();
    const result = validate({
      ...draft,
      openingSummary: `${draft.openingSummary} 천생연분 확정입니다.`,
    });

    expect(result.errors).toContain("UNSAFE_COMPATIBILITY_COPY: 천생연분 확정");
  });

  it("blocks internal artifact labels from visible draft fields", () => {
    const draft = createValidCompatibilityDraft();
    const result = validate({
      ...draft,
      openingSummary: `${draft.openingSummary} OpenAI debug draft`,
    });

    expect(result.errors).toEqual(
      expect.arrayContaining([
        "UNSAFE_COMPATIBILITY_COPY: OpenAI",
        "UNSAFE_COMPATIBILITY_COPY: debug",
        "UNSAFE_COMPATIBILITY_COPY: draft",
      ]),
    );
  });

  it("blocks candidate MBTI recommendations while allowing actual input MBTIs", () => {
    const draft = createValidCompatibilityDraft();
    const result = validate({
      ...draft,
      finalAdvice: [...draft.finalAdvice, "INFJ가 좋습니다."],
    });

    expect(result.errors).toContain(
      "MBTI_CANDIDATE_RECOMMENDATION_NOT_ALLOWED: INFJ",
    );
    expect(validate(draft).ok).toBe(true);
  });

  it("blocks diagnostic-only compatibility terms from visible copy", () => {
    const draft = createValidCompatibilityDraft();
    const result = validate({
      ...draft,
      openingSummary: `${draft.openingSummary} 백호대살이 강하게 작동합니다.`,
    });

    expect(result.errors).toContain("UNSUPPORTED_COMPATIBILITY_TERM: 백호대살");
  });

  it("emits a non-fatal repetitive advice warning", () => {
    const draft = createValidCompatibilityDraft();
    const repeated =
      "연락 규칙은 먼저 정하세요. 연락 템포가 다르면 연락 기준을 다시 보고, 연락 문제를 감정으로만 보지 마세요.";
    const result = validate({
      ...draft,
      chapters: draft.chapters.map((chapter, index) =>
        index < 2
          ? {
              ...chapter,
              practicalAdvice: [...chapter.practicalAdvice, repeated],
            }
          : chapter,
      ),
      finalAdvice: [...draft.finalAdvice, repeated],
    });

    expect(result.ok).toBe(true);
    expect(result.warnings).toContain(
      "COMPATIBILITY_REPETITIVE_ADVICE_WARNING: 연락",
    );
  });

  it("does not fail or warn on reasonable phrase reuse", () => {
    const draft = createValidCompatibilityDraft();
    const result = validate({
      ...draft,
      finalAdvice: [...draft.finalAdvice, "약속은 한 번만 다시 확인하세요."],
    });

    expect(result.ok).toBe(true);
    expect(result.warnings).toEqual([]);
  });

  it("warns when the default help-request final advice slot contains conflict recovery content", () => {
    const draft = createValidCompatibilityDraft();
    const result = validate({
      ...draft,
      finalAdvice: [
        draft.finalAdvice[0],
        draft.finalAdvice[1],
        "서운함이 생기면 상대의 성격을 해석하기 전에 무엇이 어긋났는지 먼저 말하세요.",
      ],
    });

    expect(result.ok).toBe(true);
    expect(result.warnings).toContain(
      "COMPATIBILITY_FINAL_ADVICE_LABEL_MISMATCH_WARNING: 도움 요청",
    );
  });

  it("sanitizes known awkward Korean phrases without failing the draft", () => {
    const draft = createValidCompatibilityDraft();
    const result = validate({
      ...draft,
      openingSummary: `${draft.openingSummary} 목·금가 서로를 보완합니다.`,
      finalAdvice: [...draft.finalAdvice, "丑未 충가 있어 바로 결론 내리지 마세요."],
    });

    expect(result.ok).toBe(true);
    expect(result.value?.openingSummary).toContain("목과 금의 흐름이");
    expect(result.value?.finalAdvice.join("\n")).toContain("충이 있어");
  });

  it("exposes a deterministic awkward Korean sanitizer", () => {
    expect(sanitizeCompatibilityAwkwardKoreanText("목·금가 살아납니다.")).toBe(
      "목과 금의 흐름이 살아납니다.",
    );
    expect(sanitizeCompatibilityAwkwardKoreanText("丑未 충가 있어 조율합니다.")).toBe(
      "丑未 충이 있어 조율합니다.",
    );
  });
});
