import { describe, expect, it } from "vitest";

import type { CompatibilityReportDraft } from "../../../src/lib/report-generation/compatibilityReportDraftTypes";
import {
  normalizeCompatibilityFinalAdviceItemForValidation,
  sanitizeCompatibilityAwkwardKoreanText,
  sanitizeCompatibilityKoreanCopy,
  sanitizeCompatibilityVisibleText,
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
    relationshipAnalysis: {
      connectionSummary:
        "빠른 구조화와 깊은 검토가 만나 끌림은 있지만 속도 조율이 필요한 궁합입니다.",
      firstImpression:
        "덕민님은 방향을 먼저 잡고, 소담님은 전제와 조건을 확인하며 관계를 읽습니다.",
      stayingPower:
        "결론 시간과 검토 시간을 분리하면 서로의 방식이 장기 안정성으로 바뀝니다.",
      frictionPoints: [
        "빠른 결론과 느린 검토가 같은 대화 안에서 부딪힐 수 있습니다.",
      ],
      categoryReading:
        "연애 관계에서는 끌림보다 대화 속도와 감정 확인 방식이 체감 궁합을 좌우합니다.",
      aToBFatigue:
        "덕민님은 소담님의 검토가 길어질수록 결정이 미뤄진다고 느낄 수 있습니다.",
      bToAFatigue:
        "소담님은 덕민님의 결론 속도가 빠를수록 감정과 전제를 건너뛴다고 느낄 수 있습니다.",
      communicationRecovery:
        "싸운 뒤 바로 결론을 내기보다 감정 확인과 실행 결정을 분리해야 회복이 빠릅니다.",
      roleMoneyLifeRhythm:
        "돈과 일정은 각자 관리하되 공유 기준만 먼저 맞추는 쪽이 덜 지칩니다.",
      categorySpecificAdvice: [
        "연애에서는 답을 재촉하기보다 언제 다시 이야기할지 먼저 정하세요.",
      ],
      timingCautions: ["중요한 약속 변경은 즉시 결론보다 확인 시간을 먼저 둬야 합니다."],
      repairStrategy: ["결론, 검토, 실행을 한 번에 처리하지 말고 단계로 나누세요."],
      riskManagement: ["속도 차이를 성의 부족으로 해석하지 않는 규칙이 필요합니다."],
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

  it("rejects launch forbidden relationship and business guarantee copy", () => {
    const draft = createValidCompatibilityDraft();
    const result = validate({
      ...draft,
      relationshipAnalysis: {
        ...draft.relationshipAnalysis,
        riskManagement: [
          ...draft.relationshipAnalysis.riskManagement,
          "이 조합은 파국으로 갑니다. 사업 성공 보장도 가능합니다.",
        ],
      },
    });

    expect(result.errors).toEqual(
      expect.arrayContaining([
        "UNSAFE_COMPATIBILITY_COPY: 파국",
        "UNSAFE_COMPATIBILITY_COPY: 사업 성공 보장",
      ]),
    );
  });

  it("rejects missing A to B and B to A fatigue sections", () => {
    const draft = createValidCompatibilityDraft();
    const result = validate({
      ...draft,
      relationshipAnalysis: {
        ...draft.relationshipAnalysis,
        aToBFatigue: "",
        bToAFatigue: "",
      },
    });

    expect(result.errors).toEqual(
      expect.arrayContaining([
        "COMPATIBILITY_RELATIONSHIP_ANALYSIS_MISSING: aToBFatigue",
        "COMPATIBILITY_RELATIONSHIP_ANALYSIS_MISSING: bToAFatigue",
        "COMPATIBILITY_A_TO_B_FATIGUE_MISSING",
        "COMPATIBILITY_B_TO_A_FATIGUE_MISSING",
      ]),
    );
  });

  it("rejects legacy relationshipType values in writer drafts", () => {
    const draft = createValidCompatibilityDraft();
    const result = validate({
      ...draft,
      relationshipType: "business_work_partner",
    });

    expect(result.errors).toContain(
      "COMPATIBILITY_RELATIONSHIP_TYPE_NOT_CANONICAL: business_work_partner",
    );
  });

  it("rejects generic relationship advice without concrete situation", () => {
    const draft = createValidCompatibilityDraft();
    const result = validate({
      ...draft,
      finalAdvice: [...draft.finalAdvice, "서로 배려하세요"],
    });

    expect(result.errors).toContain("GENERIC_COMPATIBILITY_ADVICE: 서로 배려하세요");
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

  it("warns when a help-request final advice prefix contains conflict recovery content", () => {
    const draft = createValidCompatibilityDraft();
    const result = validate({
      ...draft,
      finalAdvice: [
        draft.finalAdvice[0],
        draft.finalAdvice[1],
        "도움 요청: 서운함이 생기면 상대의 성격을 해석하기 전에 상황을 다시 말하세요.",
      ],
    });

    expect(result.ok).toBe(true);
    expect(result.warnings).toContain(
      "COMPATIBILITY_FINAL_ADVICE_LABEL_MISMATCH_WARNING: 도움 요청",
    );
  });

  it("does not warn when final advice labels match their content", () => {
    const draft = createValidCompatibilityDraft();
    const result = validate({
      ...draft,
      finalAdvice: [
        draft.finalAdvice[0],
        draft.finalAdvice[1],
        "갈등 회복: 서운함이 생기면 상대의 성격을 해석하기 전에 상황을 다시 말하세요.",
      ],
    });

    expect(result.ok).toBe(true);
    expect(result.warnings).toEqual([]);
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

  it("sanitizes Korean particle errors recursively on draft fields", () => {
    const draft = createValidCompatibilityDraft();
    const result = validate({
      ...draft,
      openingTitle: "파트너십가 흔들릴 때",
      openingSummary: "소담의 정화을 보완합니다.",
      coreLine: "Partner A이 먼저 Partner B을 확인합니다.",
      scoreSummary: {
        ...draft.scoreSummary,
        scoreLabel: "협업 시너지은 높고 관리 부담가 낮습니다.",
      },
      chartComparison: {
        personA: {
          ...draft.chartComparison.personA,
          displayName: "Family A이",
        },
        personB: {
          ...draft.chartComparison.personB,
          displayName: "Family B이",
        },
      },
      keyCompatibilityPoints: {
        ...draft.keyCompatibilityPoints,
        attractionPoints: ["정화은 반응합니다."],
      },
      chapters: draft.chapters.map((chapter, index) =>
        index === 0
          ? {
              ...chapter,
              body: "Partner A이 Family A을 말하고 Partner B이 Family B을 확인합니다.",
              directHitScenes: ["정화을 살립니다."],
              practicalAdvice: ["파트너십가 흔들리면 다시 정리하세요."],
            }
          : chapter,
      ),
      finalAdvice: [
        ...draft.finalAdvice,
        "협업 시너지은 기록으로 남기고 협업 시너지과 기준을 맞추세요.",
      ],
    });
    const serialized = JSON.stringify(result.value);

    expect(result.ok).toBe(true);
    expect(serialized).not.toMatch(
      /정화을|표현의 온도이|기준 정리이|Partner A을|Partner B을|Family A을|Family B을|Partner A은|Partner A이|Partner B은|Partner B이|Family A은|Family A이|Family B은|Family B이|파트너십가|관리 부담가|협업 시너지은|협업 시너지과/u,
    );
    expect(serialized).toContain("정화를");
    expect(serialized).toContain("Partner A가");
    expect(serialized).toContain("Partner B를");
    expect(serialized).toContain("Family A를");
    expect(serialized).toContain("Family B를");
    expect(serialized).toContain("파트너십이");
    expect(serialized).toContain("협업 시너지는");
    expect(serialized).toContain("관리 부담이");
    expect(serialized).toContain("협업 시너지와");
  });

  it("sanitizes internal artifact language from safety notes", () => {
    const draft = createValidCompatibilityDraft();
    const result = validate({
      ...draft,
      safetyNotes: [
        "diagnostic-only 진단용 evidence debug 사용자용 본문 확정 feature",
      ],
    });

    expect(result.ok).toBe(true);
    expect(result.value?.safetyNotes.join("\n")).toContain(
      "이 리포트는 관계의 성공이나 실패를 단정하지 않습니다.",
    );
    expect(result.value?.safetyNotes.join("\n")).not.toMatch(
      /diagnostic-only|진단용|evidence|debug/u,
    );
  });

  it("adapts non-romance relationship copy before returning a sanitized draft", () => {
    const draft = createValidCompatibilityDraft();
    const business = validate({
      ...draft,
      relationshipType: "businessPartner",
      openingSummary:
        "연애 데이트 애인 설렘 호감 끌림 관계의 온도 즐거움보다 의무 관계가 쉽게 흩어지지 않고 상대가 내 부족한 부분을 넘깁니다.",
      scoreSummary: {
        ...draft.scoreSummary,
        scoreCaution: "끌림과 보완은 있지만 조율이 필요합니다.",
      },
    });
    const family = validate({
      ...draft,
      relationshipType: "parentChild",
      openingSummary:
        "연애 데이트 애인 설렘 호감 끌림 방향과 구조 온도와 반응 관계가 입체적으로 굴러갑니다.",
    });

    expect(business.ok).toBe(true);
    expect(JSON.stringify(business.value)).not.toMatch(
      /데이트|연애|애인|설렘|호감|관계의 온도|즐거움보다 의무/u,
    );
    expect(JSON.stringify(business.value)).toContain("협업 시너지");
    expect(JSON.stringify(business.value)).toContain("협업 구조가 쉽게 흔들리지 않고");
    expect(JSON.stringify(business.value)).toContain("상대 역할에 내 책임");
    expect(JSON.stringify(business.value)).toContain("협업 분위기");
    expect(JSON.stringify(business.value)).toContain("자율성보다 관리 부담");
    expect(family.ok).toBe(true);
    expect(JSON.stringify(family.value)).not.toMatch(/데이트|연애|애인|설렘|호감/u);
    expect(JSON.stringify(family.value)).not.toContain(
      "관계가 입체적으로 굴러갑니다",
    );
    expect(JSON.stringify(family.value)).toContain("생활 기준과 정리감");
    expect(JSON.stringify(family.value)).toContain("말의 통로와 정서 반응");
    expect(JSON.stringify(family.value)).toContain(
      "가족 관계가 덜 막히고 편안해집니다",
    );
  });

  it("exposes a deterministic awkward Korean sanitizer", () => {
    expect(sanitizeCompatibilityAwkwardKoreanText("목·금가 살아납니다.")).toBe(
      "목과 금의 흐름이 살아납니다.",
    );
    expect(sanitizeCompatibilityAwkwardKoreanText("목·금이 약해 보입니다.")).toBe(
      "목과 금의 흐름이 약해 보입니다.",
    );
    expect(sanitizeCompatibilityAwkwardKoreanText("화·수가 약해 보입니다.")).toBe(
      "화와 수의 흐름이 약해 보입니다.",
    );
    expect(sanitizeCompatibilityAwkwardKoreanText("丑未 충가 있어 조율합니다.")).toBe(
      "丑未 충이 있어 조율합니다.",
    );
    expect(
      sanitizeCompatibilityKoreanCopy(
        "정화을 표현의 온도이 기준 정리이 무토은 계수은 Partner A을 Partner A은 Partner A이 Partner B을 Partner B은 Partner B이 Family A을 Family A은 Family B을 Family B은 파트너십가 관리 부담가 협업 시너지과 경금을",
      ),
    ).toBe(
      "정화를 표현의 온도가 기준 정리가 무토는 계수는 Partner A를 Partner A는 Partner A가 Partner B를 Partner B는 Partner B가 Family A를 Family A는 Family B를 Family B는 파트너십이 관리 부담이 협업 시너지와 경금을",
    );
  });

  it("cleans business over-sanitized phrases without replacing every reaction word", () => {
    const sanitized = sanitizeCompatibilityVisibleText(
      [
        "협업의 협업 시너지을 만듭니다.",
        "현장 실행 피드백과 즉시성에 더 실행 피드백할 수 있습니다.",
        "표현의 협업 분위기.",
        "실행 피드백만 하는 구조.",
        "자기 방식으로 실행 피드백하면 됩니다.",
      ].join(" "),
      "businessPartner",
    );
    const reaction = sanitizeCompatibilityVisibleText(
      "상황이 바뀌면 빠르게 반응합니다.",
      "businessPartner",
    );

    expect(sanitized).toContain("협업 시너지를 만듭니다.");
    expect(sanitized).toContain(
      "현장 피드백과 즉시성에 더 빠르게 반응할 수 있습니다.",
    );
    expect(sanitized).toContain("커뮤니케이션 분위기.");
    expect(sanitized).toContain("실행만 맡는 구조.");
    expect(sanitized).toContain("자기 방식으로 반응하면 됩니다.");
    expect(sanitized).not.toMatch(
      /협업의 협업 시너지을|협업 시너지을|현장 실행 피드백과 즉시성에 더 실행 피드백할 수 있습니다|표현의 협업 분위기|실행 피드백만 하는 구조/u,
    );
    expect(reaction).toContain("빠르게 반응합니다.");
    expect(reaction).not.toContain("실행 피드백합니다.");
  });

  it("normalizes final advice prefixes for validation", () => {
    expect(
      normalizeCompatibilityFinalAdviceItemForValidation(
        "갈등 회복: 감정이 올라온 날에는 다음 날 다시 말하세요.",
      ),
    ).toEqual({
      label: "갈등 회복",
      body: "감정이 올라온 날에는 다음 날 다시 말하세요.",
    });
    expect(
      normalizeCompatibilityFinalAdviceItemForValidation(
        "도움 요청: 필요한 지원을 한 문장으로 말하세요.",
      ),
    ).toEqual({
      label: "도움 요청",
      body: "필요한 지원을 한 문장으로 말하세요.",
    });
    expect(
      normalizeCompatibilityFinalAdviceItemForValidation(
        "대화 규칙: 갈등 회복: 감정이 올라온 날에는 다음 날 다시 말하세요.",
      ),
    ).toEqual({
      label: "갈등 회복",
      body: "감정이 올라온 날에는 다음 날 다시 말하세요.",
    });
    expect(
      normalizeCompatibilityFinalAdviceItemForValidation(
        "업무 기준: 신뢰 관리: 결정권을 문서로 남기세요.",
      ),
    ).toEqual({
      label: "신뢰 관리",
      body: "결정권을 문서로 남기세요.",
    });
  });
});
