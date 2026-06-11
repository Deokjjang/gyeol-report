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
      `${definition.titleKo}에서는 갑목과 갑신일주를 먼저 놓고 ENTJ 성향은 보조 근거로만 연결합니다. ${definition.id} 항목은 같은 근거라도 다른 장면으로 풀어냅니다.`,
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
    expect(result.errors.join("\n")).toContain("forbidden prophecy phrase");
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
      expect(result.errors.join("\n")).toContain("internal meta phrase");
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
    expect(result.errors.join("\n")).toContain("unsupported Saju term: 도화살");
    expect(result.errors.join("\n")).toContain("unsupported Saju term: 반안살");
  });

  it("allows selected Saju terms and direct non-insulting tone", () => {
    const draft = replaceSectionBody(
      createValidDraft(),
      "personality",
      "갑신일주와 현침살이 먼저 보여서, 사람을 싫어하는 건 아닌데 비효율적인 사람을 오래 기다리는 데 에너지를 많이 씁니다. 홍염살은 매력을 보태지만 ENTJ는 보조 근거로만 씁니다.",
    );
    const result = validateComprehensiveReportDraft(draft, {
      allowedSajuTerms: ["갑목", "갑신", "갑신일주", "현침", "현침살", "홍염", "홍염살"],
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
    expect(result.errors.join("\n")).toContain("private field marker");
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
    expect(result.errors.join("\n")).toContain("display body must stay short");
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
    expect(result.errors.join("\n")).toContain("MBTI-first phrasing");
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
    expect(result.errors.join("\n")).toContain("repeats the same sentence");
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
