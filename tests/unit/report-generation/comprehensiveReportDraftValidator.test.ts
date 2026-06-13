import { describe, expect, it } from "vitest";

import type { ComprehensiveReportDraft } from "../../../src/lib/report-generation/comprehensiveReportDraftTypes";
import { validateComprehensiveReportDraft } from "../../../src/lib/report-generation/comprehensiveReportDraftValidator";
import {
  COMPREHENSIVE_REPORT_SECTION_DEFINITIONS,
  type ComprehensiveReportSectionDefinition,
} from "../../../src/lib/report-knowledge/reportSectionSchema";

function createSection(definition: ComprehensiveReportSectionDefinition) {
  if (definition.id === "manse_table") {
    return {
      sectionId: definition.id,
      titleKo: definition.titleKo,
      oneLine: "사주 기본 구조를 정리했습니다.",
      body: "사주 원국의 기본 구조를 정리했습니다.",
      evidenceSummary: ["사주 기본 구조"],
      sajuTermsUsed: [],
      mbtiTermsUsed: [],
      cautionLevel: "low" as const,
    };
  }

  if (definition.id === "mbti_table") {
    return {
      sectionId: definition.id,
      titleKo: definition.titleKo,
      oneLine: "MBTI 입력 기준을 정리했습니다.",
      body: "입력하신 MBTI 유형을 리포트 보조 기준으로 반영했습니다.",
      evidenceSummary: ["ENTJ"],
      sajuTermsUsed: [],
      mbtiTermsUsed: ["ENTJ", "Te/Ni"],
      cautionLevel: "low" as const,
    };
  }

  const isMbtiDisplay =
    definition.id === "mbti_core";
  const sajuTermsUsed =
    definition.primaryBasis === "display" && isMbtiDisplay
      ? []
      : ["갑목", "갑신일주"];
  const mbtiTermsUsed = isMbtiDisplay ? ["ENTJ", "Te/Ni"] : ["ENTJ"];

  return {
    sectionId: definition.id,
    titleKo: definition.titleKo,
    oneLine: `${definition.titleKo} 핵심을 사주 근거로 정리합니다.`,
    body:
      `${definition.titleKo}에서는 갑목과 갑신일주를 먼저 놓고 ENTJ 성향은 보조 근거로만 연결합니다. 갑목은 방향을 세우고 앞으로 밀고 가려는 힘이라서, ${definition.titleKo}에서는 결론을 빨리 잡고 판을 키우려는 모습으로 나타납니다. 갑신일주는 압박 속에서도 기준을 잃지 않으려는 구조라서, ${definition.id} 항목에서는 같은 근거라도 실제 생활 장면에 맞춰 다르게 풀어냅니다. 그래서 ${definition.titleKo}의 조언은 추상적인 위로보다 지금 기준을 어디에 세울지 정하는 쪽으로 이어져야 합니다.`,
    evidenceSummary: ["갑목", "갑신일주", "ENTJ"],
    sajuTermsUsed,
    mbtiTermsUsed,
    cautionLevel: "medium" as const,
  };
}

function createValidDraft(): ComprehensiveReportDraft {
  return {
    version: "comprehensive_v1_draft",
    productType: "saju_mbti_full",
    tone: ["saju_first", "conversational", "direct"],
    openingTitle: "사주와 MBTI가 만나는 지점",
    openingSummary:
      "사주 원국의 구조를 먼저 보고 MBTI는 사용자가 체감하는 자기상을 보조로 연결합니다.",
    coreLine: "사주 구조가 먼저이고 ENTJ는 그 구조를 증폭합니다.",
    sections: COMPREHENSIVE_REPORT_SECTION_DEFINITIONS.map(createSection),
    finalAdvice:
      "강하게 드러나는 성향은 성과로 쓰되, 감정 순환과 휴식은 의식적으로 챙기는 편이 좋습니다.",
    safetyNotes: ["자기이해용 참고 콘텐츠입니다."],
  };
}

function replaceSectionBody(
  draft: ComprehensiveReportDraft,
  sectionId: string,
  body: string,
): ComprehensiveReportDraft {
  return {
    ...draft,
    sections: draft.sections.map((section) =>
      section.sectionId === sectionId
        ? {
            ...section,
            body,
          }
        : section,
    ),
  };
}

describe("comprehensive report draft validator", () => {
  it("accepts a valid Saju-first draft fixture", () => {
    const result = validateComprehensiveReportDraft(createValidDraft());

    expect(result).toEqual({
      ok: true,
      errors: [],
      value: createValidDraft(),
    });
  });

  it("accepts a dense generated draft with short display sections", () => {
    const result = validateComprehensiveReportDraft(createValidDraft(), {
      allowedSajuTerms: ["갑목", "갑신", "갑신일주"],
      allowedMbtiTerms: ["ENTJ"],
    });

    expect(result.errors).toEqual([]);
    expect(result.ok).toBe(true);
  });

  it("rejects a missing section", () => {
    const draft = createValidDraft();
    const result = validateComprehensiveReportDraft({
      ...draft,
      sections: draft.sections.slice(1),
    });

    expect(result.ok).toBe(false);
    expect(result.errors.join("\n")).toContain("draft missing section");
  });

  it("rejects duplicate section ids", () => {
    const draft = createValidDraft();
    const result = validateComprehensiveReportDraft({
      ...draft,
      sections: [draft.sections[0], draft.sections[0], ...draft.sections.slice(2)],
    });

    expect(result.ok).toBe(false);
    expect(result.errors.join("\n")).toContain("duplicate section");
  });

  it("rejects invalid section ids", () => {
    const draft = createValidDraft();
    const [firstSection, ...remainingSections] = draft.sections;
    const result = validateComprehensiveReportDraft({
      ...draft,
      sections: [
        {
          ...firstSection,
          sectionId: "invalid_section",
        },
        ...remainingSections,
      ],
    });

    expect(result.ok).toBe(false);
    expect(result.errors.join("\n")).toContain("invalid section id");
  });

  it("rejects forbidden prophecy phrasing", () => {
    const draft = createValidDraft();
    const [firstSection, ...remainingSections] = draft.sections;
    const result = validateComprehensiveReportDraft({
      ...draft,
      sections: [
        {
          ...firstSection,
          body: "이 구조는 " + "100% " + "확정",
        },
        ...remainingSections,
      ],
    });

    expect(result.ok).toBe(false);
    expect(result.errors.join("\n")).toContain("FORBIDDEN_PROPHECY_PHRASE");
  });

  it("rejects internal meta and debug copy", () => {
    const forbiddenBodies = [
      "검증된 JSON으로 보관되는 문장입니다.",
      "저장용 fixture 문장입니다.",
      "entry ids만 제공된 상태입니다.",
      "제공된 만세력 원문 표는 없고 내부 사정만 있습니다.",
    ];

    for (const body of forbiddenBodies) {
      const result = validateComprehensiveReportDraft(
        replaceSectionBody(createValidDraft(), "saju_core", body),
      );

      expect(result.ok).toBe(false);
      expect(result.errors.join("\n")).toContain("INTERNAL_META_COPY");
    }
  });

  it("rejects unsupported Saju terms when allowed terms are provided", () => {
    const draft = replaceSectionBody(
      createValidDraft(),
      "love_relationship",
      "갑목과 갑신일주를 먼저 보되, 도화살과 반안살이 있다는 식으로 없는 신살을 섞으면 안 됩니다.",
    );
    const result = validateComprehensiveReportDraft(draft, {
      allowedSajuTerms: ["갑목", "갑신", "갑신일주", "현침", "현침살", "홍염", "홍염살"],
    });

    expect(result.ok).toBe(false);
    expect(result.errors.join("\n")).toContain("UNSUPPORTED_SAJU_TERM: 도화살");
    expect(result.errors.join("\n")).toContain("UNSUPPORTED_SAJU_TERM: 반안살");
  });

  it("does not flag Korean words that only contain a ganji substring", () => {
    const densitySuffix =
      " 추가로 갑목은 방향을 세우는 힘이고 갑신일주는 압박 속에서도 판단 기준을 유지하는 구조입니다. 이 설명은 허용된 사주 근거를 충분히 풀어 쓰기 위한 문장입니다.";
    const bodies = [
      "성장성이 강하고 갑목과 갑신일주의 방향성이 잘 드러납니다. 갑목은 앞으로 뻗는 힘이라 기준이 잡히면 실행 방향이 빨라지고, 갑신일주는 압박 속에서도 판단 기준을 세우려는 구조라서 일반 단어 속 장성을 사주 용어로 오해하면 안 됩니다. 이 문장은 성향 설명을 위한 일반 표현을 함께 포함하며, 실제 해석은 갑목과 갑신일주 안에서만 정리합니다.",
      "정해진 기준을 따르되 갑목과 갑신일주를 먼저 놓고 봅니다. 갑목은 방향을 만들고 갑신일주는 기준을 세우는 구조라서, 이 문장의 정해진은 일반 표현이지 별도 일주를 새로 말하는 것이 아닙니다. 핵심은 unsupported 간지를 만들지 않는 것이고, 해석은 이미 허용된 갑목과 갑신일주로 충분히 설명됩니다.",
      "정해놓은 루틴이 있으면 갑목과 갑신일주의 방향성이 더 안정됩니다. 갑목은 목표를 세우는 힘이고 갑신일주는 압박에도 기준을 유지하려는 구조라서, 정해놓은이라는 일반 표현은 unsupported 사주 용어가 아닙니다. 루틴 설명과 사주 용어 검증은 분리되어야 하며, 본문은 허용된 사주 근거만 사용합니다.",
      "정해야 할 기준이 있어도 갑목과 갑신일주를 먼저 봅니다. 갑목은 큰 방향을 잡는 힘이고 갑신일주는 긴장 속에서 판단을 세우는 구조라서, 정해야라는 표현은 사주 간지와 분리해서 봐야 합니다. 일반 동사 활용은 사주 term match가 아니며, 실제 용어는 갑목과 갑신일주로 제한됩니다.",
      "관계의 선을 정해두는 편이고 ENTJ는 보조 근거로만 연결합니다. 갑목은 관계에서도 방향을 정하려는 힘이고 갑신일주는 기준이 흐려지는 상황을 불편해하는 구조라서, 이 문장은 일반 동사 표현을 포함합니다. 그래서 정해두는이라는 말은 별도 일주명을 말하지 않으며, 본문은 허용된 용어만 해석합니다.",
      "관계의 선을 정해 두는 편이고 ENTJ는 보조 근거로만 연결합니다. 갑목은 앞으로 나아갈 기준을 만들고 갑신일주는 압박 속에서도 선을 유지하려는 구조라서, 띄어 쓴 정해 두는도 사주 용어가 아닙니다. 문맥상 일주나 살을 말하지 않으며, 허용된 사주 근거만 설명합니다.",
      "회복시키는 루틴이 필요해도 갑목과 갑신일주를 먼저 놓고 봅니다. 갑목은 방향을 다시 세우는 힘이고 갑신일주는 압박 속에서 기준을 붙잡는 구조라서, 회복시키는이라는 일반 표현은 별도 사주 용어가 아닙니다. 이 문장은 생활 조언을 설명할 뿐이며, 사주 근거는 허용된 갑목과 갑신일주 안에서만 정리합니다.",
      "회복시켜야 오래 가는 구조라도 갑목과 갑신일주를 먼저 해석합니다. 갑목은 앞으로 나아갈 방향을 만들고 갑신일주는 긴장 속에서도 판단 기준을 세우는 구조라서, 회복시켜야라는 말은 일반 동사 활용입니다. 검증기는 이런 일반어를 사주 용어로 오해하지 않아야 하며, 본문은 허용된 근거만 사용합니다.",
      "회복 시간이 필요하다는 조언도 갑목과 갑신일주의 구조 안에서 설명합니다. 갑목은 방향을 세우고 갑신일주는 압박 속에서 버티는 힘이라, 회복 시간이라는 일반 표현은 unsupported 사주 용어가 아닙니다. 핵심은 생활 루틴을 설명하되 실제 사주 용어는 허용된 목록 안에서만 쓰는 것입니다.",
    ];

    for (const body of bodies) {
      const result = validateComprehensiveReportDraft(
        replaceSectionBody(createValidDraft(), "personality", `${body}${densitySuffix}`),
        {
          allowedSajuTerms: ["갑목", "갑신", "갑신일주"],
        },
      );

      expect(result.errors).toEqual([]);
      expect(result.ok).toBe(true);
    }
  });

  it("rejects contextual unsupported ganji and unsupported sinsal terms", () => {
    const cases = [
      {
        body: "장성살이 있습니다.",
        expectedError: "UNSUPPORTED_SAJU_TERM: 장성살",
      },
      {
        body: "장성 살 기운이 있습니다.",
        expectedError: "UNSUPPORTED_SAJU_TERM: 장성살",
      },
      {
        body: "정해일주 성향이 있다고 쓰면 evidence 밖의 일주를 만든 것입니다.",
        expectedError: "UNSUPPORTED_SAJU_TERM: 정해일주",
      },
      {
        body: "정해 일주 성향이 있다고 쓰면 evidence 밖의 일주를 만든 것입니다.",
        expectedError: "UNSUPPORTED_SAJU_TERM: 정해일주",
      },
      {
        body: "도화살이 강합니다.",
        expectedError: "UNSUPPORTED_SAJU_TERM: 도화살",
      },
      {
        body: "반안살이 있습니다.",
        expectedError: "UNSUPPORTED_SAJU_TERM: 반안살",
      },
    ];

    for (const testCase of cases) {
      const result = validateComprehensiveReportDraft(
        replaceSectionBody(createValidDraft(), "personality", testCase.body),
        {
          allowedSajuTerms: ["갑목", "갑신", "갑신일주", "현침살", "홍염살"],
        },
      );

      expect(result.ok).toBe(false);
      expect(result.errors.join("\n")).toContain(testCase.expectedError);
      expect(result.errors).not.toContain("UNSUPPORTED_SAJU_TERM: 정해");
    }
  });

  it("allows selected Saju terms and direct non-insulting tone", () => {
    const draft = replaceSectionBody(
      createValidDraft(),
      "personality",
      "갑신일주와 현침살이 먼저 보여서, 사람을 싫어하는 건 아닌데 비효율적인 사람을 오래 기다리는 데 에너지를 많이 씁니다. 갑신일주는 압박 속에서 기준을 세우는 일주라 말과 판단이 빨라지고, 현침살은 그 판단을 더 예리하게 만듭니다. 홍염살과 재고귀인은 보조 흐름으로만 쓰며, ENTJ는 이 직선적인 처리 방식을 체감 성향으로 설명하는 참고값입니다.",
    );
    const result = validateComprehensiveReportDraft(draft, {
      allowedSajuTerms: [
        "갑목",
        "갑신",
        "갑신일주",
        "현침",
        "현침살",
        "홍염",
        "홍염살",
        "재고",
        "재고귀인",
      ],
    });

    expect(result.errors).toEqual([]);
    expect(result.ok).toBe(true);
  });

  it("rejects private payment field strings", () => {
    const draft = createValidDraft();
    const result = validateComprehensiveReportDraft({
      ...draft,
      sections: draft.sections,
      paymentKey: "fixture_private_value",
    });

    expect(result.ok).toBe(false);
    expect(result.errors.join("\n")).toContain("PRIVATE_FIELD_LEAK");
  });

  it("rejects MBTI-only Saju-first sections", () => {
    const draft = createValidDraft();
    const result = validateComprehensiveReportDraft({
      ...draft,
      sections: draft.sections.map((section) =>
        section.sectionId === "mbti_core" || section.sectionId === "mbti_table"
          ? section
          : {
              ...section,
              sajuTermsUsed: [],
              mbtiTermsUsed: ["ENTJ", "Te/Ni", "MBTI"],
            },
      ),
    });

    expect(result.ok).toBe(false);
    expect(result.errors.join("\n")).toContain("Saju-first draft");
  });

  it("rejects display sections with long generated prose", () => {
    const draft = replaceSectionBody(
      createValidDraft(),
      "manse_table",
      "사주 원국의 기본 구조를 정리했습니다. 이 문장은 display 섹션을 넘어서 긴 해석문처럼 이어지고, 원래는 deterministic UI가 보여줘야 할 표 영역에 과도한 해석을 넣는 상황을 검증하기 위해 충분히 길게 작성합니다.",
    );
    const result = validateComprehensiveReportDraft(draft);

    expect(result.ok).toBe(false);
    expect(result.errors.join("\n")).toContain("DISPLAY_SECTION_TOO_LONG: manse_table");
  });

  it("rejects MBTI-first phrasing outside MBTI sections", () => {
    const result = validateComprehensiveReportDraft(
      replaceSectionBody(
        createValidDraft(),
        "saju_core",
        "ENTJ라서 리더십이 강하다고 시작하면 사주가 뒤로 밀립니다.",
      ),
    );

    expect(result.ok).toBe(false);
    expect(result.errors.join("\n")).toContain("MBTI_FIRST_FORBIDDEN: saju_core");
  });

  it("rejects repeated identical sentences across sections", () => {
    const repeated = "갑목과 갑신일주가 먼저 보이고 ENTJ는 보조 근거로만 연결합니다.";
    const draft = createValidDraft();
    const result = validateComprehensiveReportDraft({
      ...draft,
      sections: draft.sections.map((section) =>
        section.sectionId === "personality" ||
        section.sectionId === "strengths" ||
        section.sectionId === "weaknesses"
          ? {
              ...section,
              body: repeated,
            }
          : section,
      ),
    });

    expect(result.ok).toBe(false);
    expect(result.errors.join("\n")).toContain("REPEATED_SENTENCE");
  });

  it("rejects too-short interpretation section bodies in generated drafts", () => {
    const result = validateComprehensiveReportDraft(
      replaceSectionBody(
        createValidDraft(),
        "environment_luck",
        "좋은 판을 만나면 빨리 치고 나가지만, 환경이 거칠면 소모도 큽니다.",
      ),
      {
        allowedSajuTerms: ["갑목", "갑신", "갑신일주"],
      },
    );

    expect(result.ok).toBe(false);
    expect(result.errors.join("\n")).toContain(
      "SECTION_BODY_TOO_SHORT: environment_luck body too short",
    );
  });

  it("rejects interpretation section body that repeats the one-line summary", () => {
    const draft = createValidDraft();
    const target = draft.sections.find((section) => section.sectionId === "work_career");

    if (target === undefined) {
      throw new Error("Missing work_career section fixture.");
    }

    const result = validateComprehensiveReportDraft(
      replaceSectionBody(draft, "work_career", target.oneLine),
      {
        allowedSajuTerms: ["갑목", "갑신", "갑신일주"],
      },
    );

    expect(result.ok).toBe(false);
    expect(result.errors.join("\n")).toContain(
      "SECTION_BODY_SAME_AS_ONELINE: work_career",
    );
  });

  it("rejects generic placeholder body in interpretation sections", () => {
    const result = validateComprehensiveReportDraft(
      replaceSectionBody(
        createValidDraft(),
        "saju_core",
        "사주 원국의 기본 구조를 정리했습니다.",
      ),
      {
        allowedSajuTerms: ["갑목", "갑신", "갑신일주"],
      },
    );

    expect(result.ok).toBe(false);
    expect(result.errors.join("\n")).toContain("GENERIC_PLACEHOLDER_BODY: saju_core");
  });

  it("rejects dense interpretation bodies that do not explain a Saju term", () => {
    const result = validateComprehensiveReportDraft(
      replaceSectionBody(
        createValidDraft(),
        "strengths",
        "이 섹션에서는 빠른 판단과 추진력이 강하게 나타납니다. 목표가 생기면 오래 망설이기보다 구조를 먼저 잡고, 필요한 사람과 자원을 정리하려는 태도가 분명합니다. 그래서 일이나 관계에서도 애매한 상태를 길게 두기보다 기준을 세우고 다음 행동을 정하려는 쪽으로 움직입니다.",
      ),
      {
        allowedSajuTerms: ["갑목", "갑신", "갑신일주"],
      },
    );

    expect(result.ok).toBe(false);
    expect(result.errors.join("\n")).toContain(
      "SAJU_TERM_EXPLANATION_MISSING: strengths",
    );
  });

  it("allows repeated central short phrases while keeping sentence repetition guarded", () => {
    const draft = createValidDraft();
    const result = validateComprehensiveReportDraft(
      {
        ...draft,
        sections: draft.sections.map((section) =>
          section.sectionId === "personality" ||
          section.sectionId === "weaknesses" ||
          section.sectionId === "love_relationship"
            ? {
                ...section,
                body: `${section.body} ${section.titleKo}에서는 표현 온도와 감정 완충을 이 주제에 맞춰 다르게 설명합니다.`,
              }
            : section,
        ),
      },
      {
        allowedSajuTerms: ["갑목", "갑신", "갑신일주"],
      },
    );

    expect(result.errors).toEqual([]);
    expect(result.ok).toBe(true);
  });

  it("rejects raw OpenAI metadata fields", () => {
    const draft = createValidDraft();
    const result = validateComprehensiveReportDraft({
      ...draft,
      usage: {
        input_tokens: 1,
      },
    });

    expect(result.ok).toBe(false);
    expect(result.errors.join("\n")).toContain("raw OpenAI metadata");
  });
});
