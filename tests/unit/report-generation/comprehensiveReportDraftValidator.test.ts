import { describe, expect, it } from "vitest";

import type {
  ComprehensiveReportV1Draft,
  ComprehensiveReportV2Draft,
} from "../../../src/lib/report-generation/comprehensiveReportDraftTypes";
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

function createValidDraft(): ComprehensiveReportV1Draft {
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
  draft: ComprehensiveReportV1Draft,
  sectionId: string,
  body: string,
): ComprehensiveReportV1Draft {
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

function createLongChapterBody(input: {
  readonly title: string;
  readonly sajuTerm: string;
  readonly chapterId?: ComprehensiveReportV2Draft["chapters"][number]["chapterId"];
  readonly extra?: string;
}): string {
  const base =
    `${input.title}에서는 ${input.sajuTerm}을 먼저 놓고 읽습니다. 덕민님, ${input.title}에서 상대가 한참 설명하기 전에 이미 결론이 보이는 상황 자주 나오지 않나요? ${input.title}의 ${input.sajuTerm}은 단순한 이름이 아니라 행동의 출발점입니다. ${input.title}에서 덕민님은 상황을 오래 구경하기보다 기준을 세우고 판을 정리하려는 쪽으로 움직입니다. 그래서 ${input.title}의 일상 장면에서는 말이 빠르고 판단이 선명하게 보일 수 있습니다. 입력한 ENTJ 성향도 ${input.title}의 이 지점과 맞물리지만, 결론은 MBTI가 아니라 사주 구조에서 먼저 나옵니다. 좋은 환경에서는 ${input.title}의 이 힘이 추진력과 책임감으로 살아나고, 나쁜 환경에서는 쉬지 못하고 계속 자신을 몰아붙이는 압박으로 바뀔 수 있습니다. ${input.title}은 같은 사주 구조가 다른 생활 장면에서 어떻게 다른 결과로 바뀌는지 보여주는 챕터입니다. 이렇게 쓰면 좋습니다. ${input.title}에서는 결론을 바로 던지기 전에 질문을 한 번 넣는 루틴을 두어야 합니다. ${input.title}의 핵심은 용어를 외우게 하는 것이 아니라 실제 선택과 말투, 돈과 관계를 떠올리게 만드는 데 있습니다.`;

  return `${base} ${input.extra ?? ""}`.trim();
}

function createHitReadingLines(
  chapterId: ComprehensiveReportV2Draft["chapters"][number]["chapterId"],
  titleKo: string,
): readonly string[] {
  const common = [
    `덕민님, ${titleKo}에서 상대가 설명을 끝내기 전에 이미 결론이 보이는 상황 자주 나오지 않나요?`,
    `${titleKo}에서는 감정보다 기준을 먼저 세우는 편입니다.`,
  ];

  if (chapterId === "personality_pattern") {
    return [
      ...common,
      "말수가 적어서가 아니라 이미 머릿속에서 정리가 끝나 말이 짧아질 가능성이 큽니다.",
    ];
  }
  if (chapterId === "work_money_study") {
    return [
      "일을 잡으면 초반에는 빠르게 판을 정리하지만, 쉬는 기준은 자주 뒤로 밀릴 수 있습니다.",
      "자격증이나 전문서 공부도 왜 써먹는지가 보여야 집중력이 붙는 편입니다.",
      "돈은 벌 아이디어보다 지킬 구조가 없을 때 더 빨리 새기 쉽습니다.",
    ];
  }
  if (chapterId === "love_relationships") {
    return [
      "호감이 있어도 따뜻한 말보다 해결책이 먼저 나갈 수 있습니다.",
      "상대가 감정을 말할 때, 덕민님은 위로보다 결론을 먼저 주고 싶어질 수 있습니다.",
      "감정 기복이 큰 사람보다 말과 생활이 안정적인 사람이 오래 맞을 가능성이 큽니다.",
    ];
  }
  if (chapterId === "people_family_environment") {
    return [
      ...common,
      "가까운 사람 문제를 보면 내가 정리해야겠다는 감각이 먼저 올라올 수 있습니다.",
    ];
  }
  if (chapterId === "risk_and_growth") {
    return [
      "쉬어야 할 때도 머리가 꺼지지 않아 다음 일정을 먼저 굴릴 수 있습니다.",
      "버티는 힘은 강하지만, 회복 타이밍은 자주 늦게 잡히기 쉽습니다.",
    ];
  }
  if (chapterId === "final_message") {
    return ["덕민님은 이기는 법을 빨리 배우지만, 오래 가는 법은 따로 설계해야 하는 편입니다."];
  }

  return common;
}

function createSolutionLines(
  chapterId: ComprehensiveReportV2Draft["chapters"][number]["chapterId"],
  titleKo: string,
): readonly string[] {
  if (chapterId === "opening" || chapterId === "final_message") {
    return [];
  }
  if (chapterId === "work_money_study") {
    return [
      "공부/일 루틴은 자격증, 전문서, 직무 학습, 사업 학습을 2주 단위로 쪼개세요.",
      "돈은 공격 계획과 방어 계획을 분리해야 합니다.",
      "현금흐름, 투자, 자기계발 예산을 따로 보세요.",
      "쉬는 시간을 성능 관리 일정으로 먼저 넣으세요.",
    ];
  }
  if (chapterId === "love_relationships") {
    return [
      "맞는 상대: 감정을 천천히 풀어주고 덕민님의 과열을 식혀주는 사람이 맞는 사람일 수 있습니다.",
      "피해야 할 상대: 감정 기복이 크고 책임이 흐릿한 사람은 피해야 할 패턴입니다.",
      "보완 기운: 수 부족과 화 부족을 보완하듯 감정 완충과 표현 온도를 보태는 사람이 좋습니다.",
      "MBTI 예시: ISFP, INFP, INTP는 예시일 뿐이고 MBTI만으로 궁합을 단정하지 마세요.",
    ];
  }
  if (chapterId === "risk_and_growth") {
    return [
      "수 부족은 밤 산책, 수변 공간, 충분한 수분, 기록, 잠 루틴으로 식히세요.",
      "화 부족은 햇빛, 가벼운 운동, 발표와 표현 연습으로 밖으로 내세요.",
      "토 과다는 책임 덜어내기와 경계선 정리하기로 조절하세요.",
      "회복은 기분 문제가 아니라 일정으로 박아야 합니다.",
    ];
  }

  return [
    `${titleKo}에서는 결론을 말하기 전에 질문을 먼저 넣으세요.`,
    `${titleKo}에서는 책임 범위를 문장으로 정리하세요.`,
  ];
}

function createV2Chapter(
  chapterId: ComprehensiveReportV2Draft["chapters"][number]["chapterId"],
  titleKo: string,
  minimumTerm = "갑목",
) {
  return {
    chapterId,
    titleKo,
    headline: `${titleKo}의 핵심은 사주 구조를 생활 장면으로 읽는 것입니다.`,
    hitReadingLines: createHitReadingLines(chapterId, titleKo),
    body: createLongChapterBody({
      title: titleKo,
      sajuTerm: minimumTerm,
      chapterId,
      extra:
        chapterId === "work_money_study"
          ? "공부는 학교 공부만이 아니라 자격증, 전문서, 직무 학습, 사업을 배우는 방식까지 포함됩니다. 돈은 성과를 증명하는 도구가 되기 쉽고, 자산 관리는 감정 문제가 아니라 통제 가능한 판을 만드는 일에 가깝습니다. 일, 돈, 공부가 연결되는 방식에서는 성취욕이 과열될 때 쉬는 시간을 성능 관리로 받아들이는 조언까지 이어져야 합니다."
          : chapterId === "love_relationships"
            ? "관계에서 써먹을 것은 보완하는 사람을 고르는 기준입니다. 부족한 수와 화를 채워 주듯 정서적 완충이 되고 감정 표현을 부드럽게 풀어주는 사람이 맞는 사람일 수 있습니다. 피해야 할 패턴은 감정 기복이 크고 책임이 흐릿하거나 계속 확인받으려는 관계입니다. ISFP, INFP, INTP 같은 예시는 참고가 될 수 있지만 MBTI만으로 단정하지 않는 태도가 필요합니다."
          : chapterId === "risk_and_growth"
            ? "피해야 할 패턴은 계속 버티기만 하다가 몸과 마음이 동시에 꺼지는 흐름입니다. 수 부족은 밤 산책, 수변 공간, 충분한 수분, 기록, 잠 루틴으로 식히고, 화 부족은 햇빛, 가벼운 운동, 발표와 표현 연습으로 밖으로 내야 합니다. 토 과다는 책임 덜어내기와 경계선 정리하기로 조절해야 합니다."
          : `${titleKo}에서는 관계와 일, 돈과 성장에서 같은 구조가 어떻게 다른 표정으로 바뀌는지 장면을 바꿔 읽어야 합니다. ${titleKo}은 용어를 나열하지 않고 실제 선택과 말투와 행동으로 풀어내며, 이 챕터만의 결론과 조언을 분명히 남겨야 합니다.`,
    }),
    solutionLines: createSolutionLines(chapterId, titleKo),
    keyPhrases: [`${titleKo} 핵심`, minimumTerm],
    sajuTermsUsed:
      chapterId === "opening" || chapterId === "final_message"
        ? [minimumTerm]
        : [minimumTerm, "갑신일주"],
    mbtiTermsUsed: ["ENTJ"],
  };
}

function createValidV2Draft(): ComprehensiveReportV2Draft {
  return {
    version: "comprehensive_v2_draft",
    productType: "saju_mbti_full",
    openingTitle: "덕민님의 결은 빠른 판단과 큰 판에 있습니다",
    openingSummary:
      "갑목과 갑신일주를 먼저 놓고 읽으면, 덕민님은 작은 안정감보다 큰 방향과 기준을 먼저 찾는 사람에 가깝습니다.",
    coreLine:
      "갑목의 방향성과 갑신일주의 압박 대응력이 ENTJ 성향과 만나 성취 중심의 결을 만듭니다.",
    profileTable: {
      dayPillar: "갑신일주",
      dayMaster: "갑목",
      fiveElementSummary: ["목 2", "화 0", "토 4", "금 2", "수 0"],
      excessiveElements: ["토 과다"],
      missingElements: ["화 부족", "수 부족"],
      tenGodSummary: ["편재", "정재", "정관", "편관"],
      specialPatterns: ["재다신약", "무인성", "무식상"],
      sinsal: ["현침살", "홍염살"],
      gwiin: ["재고귀인"],
      mbti: "ENTJ",
    },
    chapters: [
      createV2Chapter("opening", "처음에 보이는 결"),
      createV2Chapter("saju_identity", "사주가 보여주는 기본 형상"),
      createV2Chapter("personality_pattern", "성격과 판단 패턴"),
      createV2Chapter("work_money_study", "일, 돈, 공부가 연결되는 방식"),
      createV2Chapter("love_relationships", "연애와 관계의 온도"),
      createV2Chapter("people_family_environment", "사람, 가족, 환경"),
      createV2Chapter("risk_and_growth", "반복되는 리스크와 성장법"),
      createV2Chapter("final_message", "마지막으로 남길 말"),
    ],
    finalAdvice:
      "덕민님은 이기는 법을 빨리 배우는 쪽에 강점이 있습니다. 다만 오래 가려면 성과를 내지 않는 시간도 전략으로 인정해야 합니다.",
    safetyNotes: ["자기이해용 참고 콘텐츠입니다."],
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

  it("accepts a valid V2 narrative draft fixture", () => {
    const draft = createValidV2Draft();
    const result = validateComprehensiveReportDraft(draft, {
      allowedSajuTerms: [
        "갑목",
        "갑신",
        "갑신일주",
        "토 과다",
        "수 부족",
        "화 부족",
        "편재",
        "정재",
        "정관",
        "편관",
        "재다신약",
        "재고귀인",
        "무인성",
        "무식상",
        "현침살",
        "홍염살",
      ],
      allowedMbtiTerms: ["ENTJ"],
    });

    expect(result).toEqual({
      ok: true,
      errors: [],
      value: draft,
    });
  });

  it("rejects final V2 drafts without deterministic profile table", () => {
    const draftWithoutProfileTable = Object.fromEntries(
      Object.entries(createValidV2Draft()).filter(([key]) => key !== "profileTable"),
    );
    const result = validateComprehensiveReportDraft(draftWithoutProfileTable);

    expect(result.ok).toBe(false);
    expect(result.errors.join("\n")).toContain(
      "profileTable is required for comprehensive_v2_draft.",
    );
  });

  it("rejects V2 drafts with missing or short narrative chapters", () => {
    const draft = createValidV2Draft();
    const missingResult = validateComprehensiveReportDraft({
      ...draft,
      chapters: draft.chapters.slice(1),
    });
    const shortResult = validateComprehensiveReportDraft({
      ...draft,
      chapters: draft.chapters.map((chapter) =>
        chapter.chapterId === "work_money_study"
          ? {
              ...chapter,
              body:
                "갑목은 빠르게 방향을 잡는 힘입니다. 이 문장은 기본 필드는 통과하지만 narrative chapter로 보기에는 너무 짧습니다.",
            }
          : chapter,
      ),
    });

    expect(missingResult.ok).toBe(false);
    expect(missingResult.errors.join("\n")).toContain("draft missing chapter: opening");
    expect(shortResult.ok).toBe(false);
    expect(shortResult.errors.join("\n")).toContain(
      "CHAPTER_BODY_TOO_SHORT: work_money_study",
    );
  });

  it("rejects V2 visible evidence labels and MBTI-first opening", () => {
    const debugLabelResult = validateComprehensiveReportDraft({
      ...createValidV2Draft(),
      chapters: createValidV2Draft().chapters.map((chapter) =>
        chapter.chapterId === "personality_pattern"
          ? {
              ...chapter,
              body: `${chapter.body} 분석 근거 보기 같은 UI 문구가 본문에 나오면 안 됩니다.`,
            }
          : chapter,
      ),
    });
    const mbtiFirstResult = validateComprehensiveReportDraft({
      ...createValidV2Draft(),
      openingSummary: "ENTJ라서 추진력이 강하다고 먼저 말하면 안 됩니다.",
    });

    expect(debugLabelResult.ok).toBe(false);
    expect(debugLabelResult.errors.join("\n")).toContain(
      "VISIBLE_EVIDENCE_DEBUG_LABEL: 분석 근거 보기",
    );
    expect(mbtiFirstResult.ok).toBe(false);
    expect(mbtiFirstResult.errors.join("\n")).toContain(
      "MBTI_FIRST_FORBIDDEN: opening",
    );
  });

  it("rejects unsupported Saju terms in V2 narrative drafts", () => {
    const draft = createValidV2Draft();
    const result = validateComprehensiveReportDraft(
      {
        ...draft,
        chapters: draft.chapters.map((chapter) =>
          chapter.chapterId === "love_relationships"
            ? {
                ...chapter,
                body: `${chapter.body} 도화살이 있다고 쓰면 허용되지 않은 신살을 만든 것입니다.`,
              }
            : chapter,
        ),
      },
      {
        allowedSajuTerms: ["갑목", "갑신", "갑신일주"],
      },
    );

    expect(result.ok).toBe(false);
    expect(result.errors.join("\n")).toContain("UNSUPPORTED_SAJU_TERM: 도화살");
  });

  it("rejects V2 drafts without enough direct hit-reading sentences", () => {
    const draft = createValidV2Draft();
    const result = validateComprehensiveReportDraft({
      ...draft,
      chapters: draft.chapters.map((chapter) => ({
        ...chapter,
        hitReadingLines:
          chapter.chapterId === "opening"
            ? ["덕민님은 성격이 좋습니다."]
            : [],
      })),
    });

    expect(result.ok).toBe(false);
    expect(result.errors.join("\n")).toContain("DIRECT_HIT_READING_MISSING");
    expect(result.errors.join("\n")).toContain("DIRECT_HIT_READING_TOO_GENERIC");
  });

  it("allows generic final_message hit-reading when closing advice is concrete", () => {
    const draft = createValidV2Draft();
    const result = validateComprehensiveReportDraft({
      ...draft,
      chapters: draft.chapters.map((chapter) =>
        chapter.chapterId === "final_message"
          ? {
              ...chapter,
              hitReadingLines: ["덕민님은 성장할 수 있습니다."],
              body: `${chapter.body} 덕민님은 더 세게 밀어붙이는 법보다 덜 닳게 오래 가는 법을 배워야 합니다. 회복과 표현을 일과 관계 안에 넣는 것이 마지막 방향입니다.`,
            }
          : chapter,
      ),
      finalAdvice:
        "지금 필요한 건 의지력이 아니라 회복과 표현을 시스템에 넣는 일입니다. 일과 관계에서 오래 가는 방식을 먼저 설계하세요.",
    });

    expect(result.ok).toBe(true);
    expect(result.errors.join("\n")).not.toContain(
      "DIRECT_HIT_READING_TOO_GENERIC: final_message",
    );
  });

  it.each([
    "personality_pattern",
    "work_money_study",
    "love_relationships",
  ] as const)("rejects generic hit-reading in main V2 chapter %s", (chapterId) => {
    const draft = createValidV2Draft();
    const result = validateComprehensiveReportDraft({
      ...draft,
      chapters: draft.chapters.map((chapter) =>
        chapter.chapterId === chapterId
          ? {
              ...chapter,
              hitReadingLines: [
                "덕민님은 성장할 수 있습니다.",
                "덕민님은 장점과 단점이 있습니다.",
                "덕민님은 성격이 좋습니다.",
              ],
            }
          : chapter,
      ),
    });

    expect(result.ok).toBe(false);
    expect(result.errors.join("\n")).toContain(
      `DIRECT_HIT_READING_TOO_GENERIC: ${chapterId}`,
    );
  });

  it("rejects V2 drafts when all main hit-reading lines are generic", () => {
    const draft = createValidV2Draft();
    const result = validateComprehensiveReportDraft({
      ...draft,
      chapters: draft.chapters.map((chapter) =>
        chapter.chapterId === "final_message"
          ? chapter
          : {
              ...chapter,
              hitReadingLines: Array.from(
                { length: chapter.hitReadingLines.length },
                () => "덕민님은 성장할 수 있습니다.",
              ),
            },
      ),
    });

    expect(result.ok).toBe(false);
    expect(result.errors.join("\n")).toContain("DIRECT_HIT_READING_TOO_GENERIC");
  });

  it("rejects V2 drafts without meaningful final message closing advice", () => {
    const draft = createValidV2Draft();
    const result = validateComprehensiveReportDraft({
      ...draft,
      chapters: draft.chapters.map((chapter) =>
        chapter.chapterId === "final_message"
          ? {
              ...chapter,
              headline: "마지막 정리는 기준만 반복하는 흐름입니다",
              hitReadingLines: ["덕민님은 성장할 수 있습니다."],
              body:
                "갑목과 갑신일주를 바탕으로 마지막 문장을 정리합니다. 덕민님은 기준을 빨리 세우는 흐름이 강하고 압박 속에서도 판단을 놓지 않는 편입니다. 이 마무리는 충분히 길지만 앞으로 무엇을 관리해야 하는지 뚜렷하게 말하지 않습니다. 사주 용어는 들어가지만 마지막 조언으로서 남는 처방이 약하다는 점을 검증하기 위한 문장입니다. 덕민님은 강한 기준을 가진 사람이라는 설명만 반복합니다.",
              keyPhrases: ["마지막 정리", "갑목"],
            }
          : chapter,
      ),
      finalAdvice:
        "덕민님은 강한 기준을 가진 사람이라는 설명만 남기는 마무리입니다. 마지막 조언이 구체적이지 않도록 둡니다.",
    });

    expect(result.ok).toBe(false);
    expect(result.errors.join("\n")).toContain("FINAL_MESSAGE_CLOSING_MISSING");
  });

  it("rejects V2 major chapters without prescriptions", () => {
    const draft = createValidV2Draft();
    const result = validateComprehensiveReportDraft({
      ...draft,
      chapters: draft.chapters.map((chapter) =>
        chapter.chapterId === "personality_pattern"
          ? {
              ...chapter,
              solutionLines: [],
            }
          : chapter,
      ),
    });

    expect(result.ok).toBe(false);
    expect(result.errors.join("\n")).toContain(
      "SOLUTION_LINES_MISSING: personality_pattern",
    );
  });

  it("rejects V2 work money study without adult study scope", () => {
    const draft = createValidV2Draft();
    const result = validateComprehensiveReportDraft({
      ...draft,
      chapters: draft.chapters.map((chapter) =>
        chapter.chapterId === "work_money_study"
          ? {
              ...chapter,
              body: `${chapter.sajuTermsUsed.join(" ")}을 먼저 놓고 봅니다. 덕민님, 성과가 보이지 않으면 집중이 흐려지는 상황 자주 나오지 않나요? 이 챕터는 목표와 돈과 실행 기준을 길게 설명하지만 성인 학습 범위 키워드는 일부러 넣지 않습니다. 갑목은 방향을 잡고 갑신일주는 압박 속에서 기준을 세우는 구조라서, 현실 판단과 실행 속도가 같이 움직입니다. 이렇게 쓰면 좋습니다. 목표를 작게 나누고 돈 계획을 분리하세요. 같은 설명을 충분히 길게 이어서 본문 길이 조건은 통과하지만 특정 학습 범위 조건은 통과하지 못하게 만듭니다. `.repeat(3),
              hitReadingLines: [
                "일을 잡으면 초반에는 빠르게 판을 정리하지만 쉬는 기준은 자주 뒤로 밀릴 수 있습니다.",
                "성과가 보여야 집중력이 붙는 편입니다.",
                "돈은 지킬 구조가 없을 때 더 빨리 새기 쉽습니다.",
              ],
              solutionLines: [
                "목표를 작게 나누세요.",
                "돈 계획을 따로 보세요.",
                "쉬는 시간을 넣으세요.",
                "실행 후 점검하세요.",
              ],
            }
          : chapter,
      ),
    });

    expect(result.ok).toBe(false);
    expect(result.errors.join("\n")).toContain("WORK_STUDY_SCOPE_MISSING");
  });

  it("rejects V2 love chapter without partner criteria", () => {
    const draft = createValidV2Draft();
    const result = validateComprehensiveReportDraft({
      ...draft,
      chapters: draft.chapters.map((chapter) =>
        chapter.chapterId === "love_relationships"
          ? {
              ...chapter,
              body: `${chapter.sajuTermsUsed.join(" ")}을 먼저 놓고 관계를 읽습니다. 덕민님, 좋아해도 따뜻한 말보다 해결책이 먼저 나갈 수 있습니다. 이 문장은 관계 장면을 충분히 길게 설명하지만 상대 기준과 좋지 않은 관계 기준은 일부러 넣지 않습니다. 갑목은 방향을 잡고 갑신일주는 압박 속에서 기준을 세우는 구조라서, 관계에서도 결론이 먼저 보이기 쉽습니다. 이렇게 쓰면 좋습니다. 감정을 말하기 전에 질문하고 속도를 맞추세요. 본문은 충분히 길어서 길이 검증은 통과하지만 관계 처방 키워드 검증은 실패해야 합니다. `.repeat(3),
              hitReadingLines: [
                "호감이 있어도 따뜻한 말보다 해결책이 먼저 나갈 수 있습니다.",
                "상대가 감정을 말할 때, 덕민님은 위로보다 결론을 먼저 주고 싶어질 수 있습니다.",
                "말과 생활이 차분한 사람이 오래 이어질 가능성이 큽니다.",
              ],
              solutionLines: [
                "감정을 말하기 전에 질문하세요.",
                "속도를 맞추세요.",
                "말을 부드럽게 바꾸세요.",
                "생활 리듬을 확인하세요.",
              ],
            }
          : chapter,
      ),
    });

    expect(result.ok).toBe(false);
    expect(result.errors.join("\n")).toContain("LOVE_PARTNER_FIT_MISSING");
    expect(result.errors.join("\n")).toContain("LOVE_BAD_MATCH_PATTERN_MISSING");
  });

  it("accepts V2 love chapter with structural partner prescriptions in solution lines", () => {
    const draft = createValidV2Draft();
    const result = validateComprehensiveReportDraft({
      ...draft,
      chapters: draft.chapters.map((chapter) =>
        chapter.chapterId === "love_relationships"
          ? {
              ...chapter,
              solutionLines: [
                "맞는 상대: 감정을 천천히 풀어주고 덕민님의 과열을 식혀주는 사람이 맞기 쉽습니다.",
                "피해야 할 상대: 감정 기복이 크고 책임이 흐릿한 사람은 조심할 상대입니다.",
                "보완 기운: 수 기운과 화 기운처럼 감정 완충과 표현 온도를 보태는 타입이 좋습니다.",
                "MBTI 예시: ISFP, INFP, INTP 유형은 보완적으로 느껴질 수 있지만 MBTI만으로 궁합을 단정하지 않습니다.",
              ],
            }
          : chapter,
      ),
    });

    expect(result.ok).toBe(true);
  });

  it.each([
    {
      expectedError: "LOVE_PARTNER_FIT_MISSING",
      solutionLines: [
        "피해야 할 상대: 감정 기복이 크고 책임이 흐릿한 사람은 조심할 상대입니다.",
        "보완 기운: 수 기운과 화 기운처럼 감정 완충과 표현 온도를 보태는 타입이 좋습니다.",
        "MBTI 예시: ISFP, INFP, INTP 유형은 보완적으로 느껴질 수 있지만 MBTI만으로 궁합을 단정하지 않습니다.",
        "관계에서는 대화를 많이 하세요.",
      ],
    },
    {
      expectedError: "LOVE_BAD_MATCH_PATTERN_MISSING",
      solutionLines: [
        "맞는 상대: 감정을 천천히 풀어주고 덕민님의 과열을 식혀주는 사람이 맞기 쉽습니다.",
        "보완 기운: 수 기운과 화 기운처럼 감정 완충과 표현 온도를 보태는 타입이 좋습니다.",
        "MBTI 예시: ISFP, INFP, INTP 유형은 보완적으로 느껴질 수 있지만 MBTI만으로 궁합을 단정하지 않습니다.",
        "서로 배려하세요.",
      ],
    },
    {
      expectedError: "LOVE_COMPLEMENT_MISSING",
      solutionLines: [
        "맞는 상대: 감정을 천천히 풀어주고 덕민님의 과열을 식혀주는 사람이 맞기 쉽습니다.",
        "피해야 할 상대: 감정 기복이 크고 책임이 흐릿한 사람은 조심할 상대입니다.",
        "MBTI 예시: ISFP, INFP, INTP 유형은 보완적으로 느껴질 수 있지만 MBTI만으로 궁합을 단정하지 않습니다.",
        "좋은 사람을 만나세요.",
      ],
    },
    {
      expectedError: "LOVE_MBTI_CAUTION_OR_EXAMPLE_MISSING",
      solutionLines: [
        "맞는 상대: 감정을 천천히 풀어주고 덕민님의 과열을 식혀주는 사람이 맞기 쉽습니다.",
        "피해야 할 상대: 감정 기복이 크고 책임이 흐릿한 사람은 조심할 상대입니다.",
        "보완 기운: 수 기운과 화 기운처럼 감정 완충과 표현 온도를 보태는 타입이 좋습니다.",
        "MBTI 예시: ISFP, INFP, INTP 유형이 잘 맞습니다.",
      ],
    },
  ])(
    "rejects V2 love solution lines missing structural guidance: $expectedError",
    ({ expectedError, solutionLines }) => {
      const draft = createValidV2Draft();
      const result = validateComprehensiveReportDraft({
        ...draft,
        chapters: draft.chapters.map((chapter) =>
          chapter.chapterId === "love_relationships"
            ? {
                ...chapter,
                solutionLines,
              }
            : chapter,
        ),
      });

      expect(result.ok).toBe(false);
      expect(result.errors.join("\n")).toContain(expectedError);
    },
  );

  it("rejects generic love solution lines", () => {
    const draft = createValidV2Draft();
    const result = validateComprehensiveReportDraft({
      ...draft,
      chapters: draft.chapters.map((chapter) =>
        chapter.chapterId === "love_relationships"
          ? {
              ...chapter,
              solutionLines: [
                "좋은 사람을 만나세요.",
                "서로 배려하세요.",
                "대화를 많이 하세요.",
                "연애를 잘하세요.",
              ],
            }
          : chapter,
      ),
    });

    expect(result.ok).toBe(false);
    expect(result.errors.join("\n")).toContain("LOVE_PARTNER_FIT_MISSING");
    expect(result.errors.join("\n")).toContain("LOVE_BAD_MATCH_PATTERN_MISSING");
    expect(result.errors.join("\n")).toContain("LOVE_COMPLEMENT_MISSING");
    expect(result.errors.join("\n")).toContain(
      "LOVE_MBTI_CAUTION_OR_EXAMPLE_MISSING",
    );
  });

  it("rejects V2 risk chapter without element remedies", () => {
    const draft = createValidV2Draft();
    const result = validateComprehensiveReportDraft({
      ...draft,
      chapters: draft.chapters.map((chapter) =>
        chapter.chapterId === "risk_and_growth"
          ? {
              ...chapter,
              hitReadingLines: [
                "덕민님, 버티는 힘은 강하지만 멈추는 기준은 자주 늦게 잡히기 쉽습니다.",
                "성과가 급할수록 자기 상태를 뒤늦게 확인하는 편입니다.",
              ],
              body: `${chapter.sajuTermsUsed.join(" ")}을 먼저 놓고 반복되는 리스크를 읽습니다. 덕민님, 버티는 힘은 강하지만 회복 타이밍은 자주 늦게 잡히기 쉽습니다. 이 문장은 성장 전략을 길게 설명하지만 오행별 생활 처방 키워드는 일부러 넣지 않습니다. 갑목은 방향을 다시 세우고 갑신일주는 압박 속에서도 기준을 붙잡는 구조입니다. 이렇게 쓰면 좋습니다. 무리하지 말고 일의 순서를 다시 나누세요. 본문은 충분히 길어서 길이 조건은 통과하지만 element remedy 검증은 실패해야 합니다. `.repeat(3),
              solutionLines: [
                "무리하지 마세요.",
                "쉬는 시간을 넣으세요.",
                "일을 나누세요.",
                "다시 점검하세요.",
              ],
            }
          : chapter,
      ),
    });

    expect(result.ok).toBe(false);
    expect(result.errors.join("\n")).toContain("ELEMENT_REMEDY_MISSING");
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
