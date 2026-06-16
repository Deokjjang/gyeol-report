import { describe, expect, it } from "vitest";

import type {
  ComprehensiveReportV1Draft,
  ComprehensiveReportV2Draft,
} from "../../../src/lib/report-generation/comprehensiveReportDraftTypes";
import {
  areAllDraftValidationErrorsRepairable,
  getComprehensiveReportDraftValidationIssues,
  isRepairableDraftValidationError,
  validateComprehensiveReportDraft,
} from "../../../src/lib/report-generation/comprehensiveReportDraftValidator";
import { normalizeComprehensiveReportFinalMessage } from "../../../src/lib/report-generation/comprehensiveReportNarrativePostProcessor";
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
    `${input.title}에서는 ${input.sajuTerm}을 먼저 놓고 읽습니다. 덕민님, ${input.title}에서 상대가 한참 설명하기 전에 이미 결론이 보이는 상황 자주 나오지 않나요? ${input.title}의 ${input.sajuTerm}은 단순한 이름이 아니라 행동의 출발점입니다. ${input.title}에서 덕민님은 상황을 오래 구경하기보다 기준을 세우고 판을 정리하려는 쪽으로 움직입니다. 그래서 ${input.title}의 일상 장면에서는 회의와 메시지에서 말이 빠르고 판단이 선명하게 보일 수 있습니다. 입력한 ENTJ 성향도 ${input.title}의 이 지점과 맞물리지만, 결론은 MBTI가 아니라 사주 구조에서 먼저 나옵니다. ${input.title}를 MBTI 언어로 번역하면 효율, 목표, 역할 정리, 빠른 결론과 해결 중심이 강해지는 흐름입니다. 좋은 환경에서는 ${input.title}의 이 힘이 추진력과 책임감으로 살아나고, 나쁜 환경에서는 쉬지 못하고 계속 자신을 몰아붙이는 압박으로 바뀔 수 있습니다. ${input.title}은 같은 사주 구조가 다른 생활 장면에서 어떻게 다른 결과로 바뀌는지 보여주는 챕터입니다. ${input.title}에서는 결론을 바로 던지기 전에 질문을 한 번 넣는 루틴을 두어야 합니다. ${input.title}의 핵심은 용어를 외우게 하는 것이 아니라 실제 선택과 말투, 돈과 관계를 떠올리게 만드는 데 있습니다.`;

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
  if (chapterId === "opening") {
    return [];
  }
  if (chapterId === "final_message") {
    return [
      "오늘부터 회의나 대화 전에 결론을 바로 던지기보다 상대의 핵심을 한 문장으로 되받아 주세요.",
      "일에서는 맡을 일과 버릴 일을 구분해 책임의 경계선을 먼저 정하세요.",
      "돈은 계좌와 예산을 나누어 공격 계획과 방어 계획을 분리하세요.",
      "회복은 밤 산책, 수면, 기록처럼 일정에 박아 두는 쉬는 장치로 다루세요.",
    ];
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
      "MBTI 관계 기준: 감정을 천천히 풀어주고 약속과 생활 리듬이 안정적인 성향이 맞기 쉽지만 MBTI만으로 궁합을 단정하지 마세요.",
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
            ? "관계에서 써먹을 것은 보완하는 사람을 고르는 기준입니다. 부족한 수와 화를 채워 주듯 정서적 완충이 되고 감정 표현을 부드럽게 풀어주는 사람이 맞는 사람일 수 있습니다. 피해야 할 패턴은 감정 기복이 크고 책임이 흐릿하거나 계속 확인받으려는 관계입니다. MBTI 관계 기준으로는 감정을 천천히 풀어주고 생활 리듬이 안정적인 성향을 보되 MBTI만으로 단정하지 않는 태도가 필요합니다."
          : chapterId === "risk_and_growth"
            ? "피해야 할 패턴은 계속 버티기만 하다가 몸과 마음이 동시에 꺼지는 흐름입니다. 수 부족은 밤 산책, 수변 공간, 충분한 수분, 기록, 잠 루틴으로 식히고, 화 부족은 햇빛, 가벼운 운동, 발표와 표현 연습으로 밖으로 내야 합니다. 토 과다는 책임 덜어내기와 경계선 정리하기로 조절해야 합니다."
          : chapterId === "final_message"
            ? "마지막으로 남길 말에서는 갑목과 갑신일주의 큰 방향, 압박 속 판단, 책임을 처리하는 방식이 한 줄로 정리되어야 합니다. 입력한 ENTJ 성향으로 보면 덕민님은 효율, 목표, 역할 정리, 빠른 결론과 해결 중심을 통해 이 사주 구조를 체감하기 쉽습니다. 일에서는 맡을 일과 버릴 일을 나누고, 관계에서는 조언 전에 질문을 먼저 넣고, 돈에서는 계좌와 예산을 분리하며, 회복에서는 밤 산책과 수면과 기록을 일정에 고정해야 합니다. 오늘부터 할 작은 실행은 회의 전에 질문 하나 쓰기, 계좌를 용도별로 나누기, 침대에 눕기 전 내일 일정 메모를 닫기입니다. 오래 가는 방식은 더 세게 밀어붙이는 일이 아니라, 방향과 책임과 회복을 동시에 운영하는 장치에서 나옵니다."
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

    expect(result.ok).toBe(true);
    expect(result.errors).toEqual([]);
    expect(result.value).toMatchObject(draft);
    expect(result.warnings).toEqual(
      expect.arrayContaining([
        "SAJU_FEATURE_SPOTLIGHT_EMPTY",
        "SAJU_SIGNATURE_SCENES_EMPTY",
      ]),
    );
  });

  it("parses deterministic spotlight and signature scenes as non-fatal V2 metadata", () => {
    const draft: ComprehensiveReportV2Draft = {
      ...createValidV2Draft(),
      sajuFeatureSpotlight: {
        title: "덕민님 사주에서 특히 눈에 띄는 기운",
        groups: [
          {
            groupId: "good_fortune",
            title: "좋게 쓰면 크게 살아나는 기운",
            items: [
              {
                featureId: "gwiin_cheoneul",
                labelKo: "천을귀인",
                badge: "막힌 길에 손을 내미는 귀인",
                shortMeaning: "중요한 순간에 도움과 기회가 붙는 기운",
                vividLine: "필요한 순간에 사람이나 제도의 통로가 열릴 수 있습니다.",
                practicalLine: "필요한 것을 정확히 요청할 때 더 잘 살아납니다.",
                polarity: "positive",
                sourceChapterIds: ["saju_identity"],
              },
            ],
          },
        ],
      },
      sajuSignatureScenes: [
        {
          id: "cheoneul_no_resource_late_request",
          title: "천을귀인 + 무인성",
          featureIds: ["gwiin_cheoneul", "structure_no_resource"],
          featureLabels: ["천을귀인", "무인성"],
          topics: ["relationship", "work", "growth"],
          sceneLine:
            "도움받을 통로는 있는데 한참 혼자 정리한 뒤에야 요청할 수 있습니다.",
          interpretationLine:
            "천을귀인은 도움의 별이지만 무인성은 기대고 요청하는 감각을 늦게 만들 수 있습니다.",
          practicalLine:
            "막힌 순간에 필요한 도움을 한 문장으로 적어 보내는 습관이 좋습니다.",
        },
      ],
    };
    const result = validateComprehensiveReportDraft(draft);

    expect(result.ok).toBe(true);
    expect(result.errors).toEqual([]);
    expect(result.value).toMatchObject({
      sajuFeatureSpotlight: {
        title: "덕민님 사주에서 특히 눈에 띄는 기운",
      },
      sajuSignatureScenes: [
        expect.objectContaining({ id: "cheoneul_no_resource_late_request" }),
      ],
    });
    expect(result.warnings).toEqual(
      expect.arrayContaining(["SAJU_FEATURE_SPOTLIGHT_USAGE_NOT_DETECTED"]),
    );
  });

  it("rejects prompt artifact terms in user-visible V2 report text", () => {
    const artifactCases = [
      "체감형 명중",
      "정리와 각인",
      "signature scene",
      "spotlight",
      "feature evidence",
      "selected evidence",
      "OpenAI",
      "JSON",
      "draft",
      "debug",
    ];

    for (const artifact of artifactCases) {
      const draft = createValidV2Draft();
      const result = validateComprehensiveReportDraft({
        ...draft,
        chapters: draft.chapters.map((chapter) =>
          chapter.chapterId === "personality_pattern"
            ? {
                ...chapter,
                body: `${chapter.body} ${artifact} 같은 내부 생성 용어는 최종 본문에 남으면 안 됩니다.`,
              }
            : chapter,
        ),
      });

      expect(result.ok, artifact).toBe(false);
      expect(result.errors.join("\n")).toContain("INTERNAL_META_COPY");
    }
  });

  it("rejects generic user labels in user-visible V2 report text", () => {
    const draft = createValidV2Draft();
    const result = validateComprehensiveReportDraft({
      ...draft,
      openingSummary: `${draft.openingSummary} 사용자님은 이 표현이 남으면 안 됩니다.`,
    });

    expect(result.ok).toBe(false);
    expect(result.errors.join("\n")).toContain(
      "GENERIC_USER_LABEL_COPY: 사용자님",
    );
  });

  it("rejects exact duplicate questions in V2 chapter bodies", () => {
    const duplicateQuestion = "왜 같은 질문이 반복되어 보일까요?";
    const draft = createValidV2Draft();
    const result = validateComprehensiveReportDraft({
      ...draft,
      chapters: draft.chapters.map((chapter) =>
        chapter.chapterId === "personality_pattern" ||
        chapter.chapterId === "work_money_study"
          ? {
              ...chapter,
              body: `${chapter.body}\n${duplicateQuestion}`,
            }
          : chapter,
      ),
    });

    expect(result.ok).toBe(false);
    expect(result.errors.join("\n")).toContain("REPEATED_QUESTION");
  });

  it("warns when repeated key phrases dominate the V2 report", () => {
    const draft = createValidV2Draft();
    const repeatedPhrase = Array.from({ length: 7 }, () => "말의 온도").join(" ");
    const result = validateComprehensiveReportDraft({
      ...draft,
      chapters: draft.chapters.map((chapter) =>
        chapter.chapterId === "personality_pattern"
          ? {
              ...chapter,
              body: `${chapter.body} ${repeatedPhrase}`,
            }
          : chapter,
      ),
    });

    expect(result.ok).toBe(true);
    expect(result.warnings).toContain("REPEATED_KEY_PHRASE_WARNING: 말의 온도");
  });

  it("rejects excessive repeated key phrases in V2 report text", () => {
    const draft = createValidV2Draft();
    const repeatedPhrase = Array.from({ length: 11 }, () => "해결 중심").join(" ");
    const result = validateComprehensiveReportDraft({
      ...draft,
      chapters: draft.chapters.map((chapter) =>
        chapter.chapterId === "personality_pattern"
          ? {
              ...chapter,
              body: `${chapter.body} ${repeatedPhrase}`,
            }
          : chapter,
      ),
    });

    expect(result.ok).toBe(false);
    expect(result.errors.join("\n")).toContain(
      "REPEATED_KEY_PHRASE_OVERUSE: 해결 중심",
    );
  });

  it("warns when meeting scenes are overused across the V2 report", () => {
    const draft = createValidV2Draft();
    const repeatedMeeting = Array.from(
      { length: 5 },
      (_, index) => `회의에서 비슷한 정리 장면 ${index + 1}이 반복됩니다.`,
    ).join(" ");
    const result = validateComprehensiveReportDraft({
      ...draft,
      chapters: draft.chapters.map((chapter) =>
        chapter.chapterId === "personality_pattern"
          ? {
              ...chapter,
              body: `${chapter.body} ${repeatedMeeting}`,
            }
          : chapter,
      ),
    });

    expect(result.ok).toBe(true);
    expect(result.warnings).toContain("MEETING_SCENE_DENSITY_WARNING: 회의");
  });

  it("rejects extreme meeting-scene overuse across the V2 report", () => {
    const draft = createValidV2Draft();
    const repeatedMeeting = Array.from(
      { length: 9 },
      () => "회의에서 비슷한 정리 장면이 반복됩니다.",
    ).join(" ");
    const result = validateComprehensiveReportDraft({
      ...draft,
      chapters: draft.chapters.map((chapter) =>
        chapter.chapterId === "personality_pattern"
          ? {
              ...chapter,
              body: `${chapter.body} ${repeatedMeeting}`,
            }
          : chapter,
      ),
    });

    expect(result.ok).toBe(false);
    expect(result.errors.join("\n")).toContain("MEETING_SCENE_OVERUSE: 회의");
  });

  it("warns when question-like lines are too dense in one V2 chapter", () => {
    const draft = createValidV2Draft();
    const result = validateComprehensiveReportDraft({
      ...draft,
      chapters: draft.chapters.map((chapter) =>
        chapter.chapterId === "personality_pattern"
          ? {
              ...chapter,
              body: [
                chapter.body,
                "상대가 길게 말하면 답답하지 않나요?",
                "역할이 흐리면 바로 정리하고 싶지 않나요?",
                "감정보다 해결책이 먼저 떠오르지 않나요?",
                "밤에도 머리가 잘 꺼지지 않나요?",
              ].join("\n"),
            }
          : chapter,
      ),
    });

    expect(result.ok).toBe(true);
    expect(result.warnings).toContain(
      "QUESTION_DENSITY_WARNING: personality_pattern",
    );
    expect(result.warnings).toContain(
      "CONSECUTIVE_QUESTION_WARNING: personality_pattern",
    );
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

  it("still blocks raw unsafe medical copy when sanitizer is not run", () => {
    const draft = {
      ...createValidV2Draft(),
      finalAdvice:
        "치료라는 단어가 그대로 남으면 최종 저장 전 검증에서 막아야 합니다.",
    };
    const result = validateComprehensiveReportDraft(draft);

    expect(result.ok).toBe(false);
    expect(result.errors.join("\n")).toContain("UNSAFE_MEDICAL_COPY: 치료");
  });

  it("still blocks raw advertising guarantee copy when sanitizer is not run", () => {
    const draft = {
      ...createValidV2Draft(),
      finalAdvice:
        "성공이 보장됩니다라는 표현이 그대로 남으면 최종 저장 전 검증에서 막아야 합니다.",
    };
    const result = validateComprehensiveReportDraft(draft);

    expect(result.ok).toBe(false);
    expect(result.errors.join("\n")).toContain("UNSAFE_ADVERTISING_COPY");
    expect(result.errors.join("\n")).toContain("보장");
  });

  it("still blocks raw evidence label copy when sanitizer is not run", () => {
    const draft = {
      ...createValidV2Draft(),
      openingSummary:
        "사주 근거를 사용자 본문에 라벨처럼 노출하면 안 되는 흐름입니다.",
    };
    const result = validateComprehensiveReportDraft(draft);

    expect(result.ok).toBe(false);
    expect(result.errors.join("\n")).toContain(
      "VISIBLE_EVIDENCE_DEBUG_LABEL: 사주 근거",
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

  it("classifies repairable quality issues separately from fatal safety issues", () => {
    const issues = getComprehensiveReportDraftValidationIssues([
      "CHAPTER_BODY_TOO_SHORT: love_relationships",
      "DIRECT_HIT_READING_TOO_GENERIC: opening",
      "UNSAFE_CERTAINTY_COPY: 반드시 성공",
      "UNSAFE_ADVERTISING_COPY: 100%",
      "UNSAFE_MEDICAL_COPY: 치료",
      "EVERYDAY_SCENE_MISSING: work_money_study",
      "MBTI_SUPPORT_MISSING: love_relationships",
      "V2_TEMPLATE_LABEL_COPY: 이렇게 쓰면 좋습니다",
      "FINAL_MESSAGE_TOO_SHORT",
      "UNSUPPORTED_SAJU_TERM: 도화살",
      "UNSAFE_MEDICAL_COPY: 우울증 분석",
      "VISIBLE_EVIDENCE_DEBUG_LABEL: 분석 근거 보기",
      "REPEATED_SENTENCE: 같은 문장입니다.",
    ]);

    expect(isRepairableDraftValidationError("CHAPTER_BODY_TOO_SHORT: love_relationships")).toBe(
      true,
    );
    expect(isRepairableDraftValidationError("DIRECT_HIT_READING_TOO_GENERIC: opening")).toBe(
      true,
    );
    expect(isRepairableDraftValidationError("UNSAFE_CERTAINTY_COPY: 반드시 성공")).toBe(
      true,
    );
    expect(isRepairableDraftValidationError("UNSAFE_ADVERTISING_COPY: 100%")).toBe(
      true,
    );
    expect(isRepairableDraftValidationError("UNSAFE_MEDICAL_COPY: 치료")).toBe(
      true,
    );
    expect(isRepairableDraftValidationError("MILD_INTERNAL_META_COPY: 문서")).toBe(
      true,
    );
    expect(isRepairableDraftValidationError("REPEATED_SENTENCE: 다만 contrast는 분명합니다.")).toBe(
      true,
    );
    expect(isRepairableDraftValidationError("EVERYDAY_SCENE_MISSING: work_money_study")).toBe(
      true,
    );
    expect(isRepairableDraftValidationError("MBTI_SUPPORT_MISSING: love_relationships")).toBe(
      true,
    );
    expect(isRepairableDraftValidationError("V2_TEMPLATE_LABEL_COPY: 이렇게 쓰면 좋습니다")).toBe(
      true,
    );
    expect(isRepairableDraftValidationError("FINAL_MESSAGE_TOO_SHORT")).toBe(true);
    expect(isRepairableDraftValidationError("UNSUPPORTED_SAJU_TERM: 도화살")).toBe(
      false,
    );
    expect(isRepairableDraftValidationError("UNSAFE_MEDICAL_COPY: 우울증 분석")).toBe(
      true,
    );
    expect(areAllDraftValidationErrorsRepairable([
      "CHAPTER_BODY_TOO_SHORT: love_relationships",
      "LOVE_COMPLEMENT_MISSING",
    ])).toBe(true);
    expect(areAllDraftValidationErrorsRepairable([
      "UNSAFE_MEDICAL_COPY: 치료",
      "MILD_INTERNAL_META_COPY: 문서",
      "REPEATED_SENTENCE: 다만 contrast는 분명합니다.",
    ])).toBe(true);
    expect(areAllDraftValidationErrorsRepairable([
      "CHAPTER_BODY_TOO_SHORT: love_relationships",
      "UNSUPPORTED_SAJU_TERM: 도화살",
    ])).toBe(false);
    expect(issues).toEqual([
      {
        code: "CHAPTER_BODY_TOO_SHORT",
        message: "CHAPTER_BODY_TOO_SHORT: love_relationships",
        severity: "repairable",
        path: "love_relationships",
      },
      {
        code: "DIRECT_HIT_READING_TOO_GENERIC",
        message: "DIRECT_HIT_READING_TOO_GENERIC: opening",
        severity: "repairable",
        path: "opening",
      },
      {
        code: "UNSAFE_CERTAINTY_COPY",
        message: "UNSAFE_CERTAINTY_COPY: 반드시 성공",
        severity: "repairable",
        path: "반드시 성공",
      },
      {
        code: "UNSAFE_ADVERTISING_COPY",
        message: "UNSAFE_ADVERTISING_COPY: 100%",
        severity: "repairable",
        path: "100%",
      },
      {
        code: "UNSAFE_MEDICAL_COPY",
        message: "UNSAFE_MEDICAL_COPY: 치료",
        severity: "repairable",
        path: "치료",
      },
      {
        code: "EVERYDAY_SCENE_MISSING",
        message: "EVERYDAY_SCENE_MISSING: work_money_study",
        severity: "repairable",
        path: "work_money_study",
      },
      {
        code: "MBTI_SUPPORT_MISSING",
        message: "MBTI_SUPPORT_MISSING: love_relationships",
        severity: "repairable",
        path: "love_relationships",
      },
      {
        code: "V2_TEMPLATE_LABEL_COPY",
        message: "V2_TEMPLATE_LABEL_COPY: 이렇게 쓰면 좋습니다",
        severity: "repairable",
        path: "이렇게 쓰면 좋습니다",
      },
      {
        code: "FINAL_MESSAGE_TOO_SHORT",
        message: "FINAL_MESSAGE_TOO_SHORT",
        severity: "repairable",
      },
      {
        code: "UNSUPPORTED_SAJU_TERM",
        message: "UNSUPPORTED_SAJU_TERM: 도화살",
        severity: "fatal",
        path: "도화살",
      },
      {
        code: "UNSAFE_MEDICAL_COPY",
        message: "UNSAFE_MEDICAL_COPY: 우울증 분석",
        severity: "repairable",
        path: "우울증 분석",
      },
      {
        code: "VISIBLE_EVIDENCE_DEBUG_LABEL",
        message: "VISIBLE_EVIDENCE_DEBUG_LABEL: 분석 근거 보기",
        severity: "fatal",
        path: "분석 근거 보기",
      },
      {
        code: "REPEATED_SENTENCE",
        message: "REPEATED_SENTENCE: 같은 문장입니다.",
        severity: "repairable",
        path: "같은 문장입니다.",
      },
    ]);
  });

  it("accepts a slightly short V2 body when hit and solution blocks carry enough density", () => {
    const draft = createValidV2Draft();
    const result = validateComprehensiveReportDraft({
      ...draft,
      chapters: draft.chapters.map((chapter) =>
        chapter.chapterId === "love_relationships"
          ? {
              ...chapter,
              body:
                "갑목과 갑신일주를 먼저 놓고 연애의 속도를 읽습니다. 덕민님은 호감이 있어도 감정 표현보다 해결 모드가 먼저 켜질 수 있습니다. 그래서 관계에서는 따뜻한 말보다 결론이 빨리 나가고, 상대는 그 속도를 차갑게 받아들일 수 있습니다.",
              hitReadingLines: [
                "덕민님, 상대가 감정을 말할 때 위로보다 해결책이 먼저 떠오르는 상황 자주 나오지 않나요? 그 순간 덕민님은 차갑게 굴려는 게 아니라 관계를 빨리 안정시키려는 쪽으로 움직입니다.",
                "호감이 있어도 따뜻한 말보다 지금 무엇을 정리해야 하는지가 먼저 보일 수 있습니다. 그래서 상대는 애정이 없다고 느끼지만, 덕민님 입장에서는 책임지는 방식으로 마음을 보여주는 셈입니다.",
                "좋아하는 사람에게도 감정 표현은 늦고 책임지는 행동이 먼저 나올 수 있습니다. 연애에서 이 패턴을 모르면 좋은 의도도 업무 처리처럼 보일 수 있습니다.",
              ],
              solutionLines: [
                "맞는 상대: 감정을 천천히 풀어주고 덕민님의 과열을 식혀주는 사람이 맞기 쉽습니다. 말의 속도를 늦춰 주면서도 생활의 책임은 흐리지 않는 사람이 오래 맞습니다.",
                "피해야 할 상대: 감정 기복이 크고 책임이 흐릿한 사람은 조심할 상대입니다. 계속 확인받으려 하거나 실행 없이 말만 많은 관계는 덕민님의 피로를 빠르게 키울 수 있습니다.",
                "보완 기운: 수 기운과 화 기운처럼 감정 완충과 표현 온도를 보태는 타입이 좋습니다. 여유 있게 식혀 주고 짧게라도 따뜻한 표현을 밖으로 꺼내게 해 주는 사람이 보완적으로 느껴질 수 있습니다.",
                "MBTI 관계 기준: 감정을 천천히 풀어주고 생활 리듬과 책임감이 안정적인 성향을 보세요. MBTI만으로 궁합을 단정하지 말고 실제 생활 태도, 감정 온도, 책임감을 함께 봐야 합니다.",
              ],
            }
          : chapter,
      ),
    });

    expect(result.ok).toBe(true);
    expect(result.errors.join("\n")).not.toContain(
      "CHAPTER_BODY_TOO_SHORT: love_relationships",
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

  it("rejects fixture-unsupported element terms and passes after removal", () => {
    const draft = createValidV2Draft();
    const withUnsupportedWater = {
      ...draft,
      chapters: draft.chapters.map((chapter) =>
        chapter.chapterId === "risk_and_growth"
          ? {
              ...chapter,
              body: `${chapter.body} 수 부족이 있다고 쓰면 이번 원국에 없는 오행 부족을 만든 것입니다.`,
            }
          : chapter,
      ),
    };
    const unsupportedResult = validateComprehensiveReportDraft(withUnsupportedWater, {
      allowedSajuTerms: [
        "갑목",
        "갑신",
        "갑신일주",
        "목 부족",
        "금 부족",
        "화 부족",
        "토 과다",
        "재다신약",
        "재고귀인",
        "무인성",
        "무식상",
        "현침살",
        "홍염살",
      ],
    });

    expect(unsupportedResult.ok).toBe(false);
    expect(unsupportedResult.errors.join("\n")).toContain(
      "UNSUPPORTED_SAJU_TERM: 수 부족",
    );

    const cleanedDraft = JSON.parse(
      JSON.stringify(withUnsupportedWater).replaceAll("수 부족", "목 부족"),
    ) as typeof draft;
    const cleanedResult = validateComprehensiveReportDraft(
      cleanedDraft,
      {
        allowedSajuTerms: [
          "갑목",
          "갑신",
          "갑신일주",
          "목 부족",
          "금 부족",
          "화 부족",
          "토 과다",
          "재다신약",
          "재고귀인",
          "무인성",
          "무식상",
          "현침살",
          "홍염살",
        ],
      },
    );

    expect(cleanedResult.errors.join("\n")).not.toContain(
      "UNSUPPORTED_SAJU_TERM: 수 부족",
    );
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
    "saju_identity",
    "personality_pattern",
    "work_money_study",
    "love_relationships",
    "people_family_environment",
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
              body:
                chapterId === "personality_pattern"
                  ? "성격과 판단 패턴에서는 갑목과 갑신일주를 먼저 놓고 읽습니다. 덕민님은 목표가 분명할수록 빠르게 움직이고, 입력한 ENTJ 성향도 효율과 목표 정리 쪽에서 보조로 붙습니다. 메시지에서는 답을 짧게 보내고, 업무에서는 큰 방향부터 잡으며, 가족 부탁이 들어오면 먼저 처리하려는 흐름이 나올 수 있습니다. 돈과 일, 관계를 볼 때도 기준을 세우려는 힘이 강하지만 이 본문은 판단이 빠르고 기준이 분명하다는 말만 반복합니다. 갑목은 방향성을 만들고 갑신일주는 압박 속에서 선을 세우는 흐름으로 읽히지만, 이 본문은 성격 풀이를 일반화해 체감형 문장으로 보기 어렵습니다. 그래서 성격과 판단 패턴에서는 일반적인 성향 풀이만으로는 통과하지 못해야 합니다."
                  : `${chapter.titleKo}에서는 사주 구조와 입력한 MBTI를 함께 참고합니다. 이 챕터는 장점과 주의점을 일반적인 설명으로만 정리합니다. 구체적인 일상 장면 없이 성향이 강하고 기준이 분명하다는 말만 반복합니다. 그래서 직접 떠올릴 수 있는 순간이 아니라 추상적인 해석으로 남아야 합니다.`,
            }
          : chapter,
      ),
    });

    expect(result.ok).toBe(false);
    expect(result.errors.join("\n")).toContain(
      `DIRECT_HIT_READING_TOO_GENERIC: ${chapterId}`,
    );
  });

  it.each([
    {
      chapterId: "saju_identity" as const,
      body:
        "갑신일주는 큰 나무가 날카로운 금 위에 선 모습이라, 압박이 걸리는 자리에서 오히려 기준을 빨리 세우고 판을 정리하려는 모습으로 드러날 수 있습니다. 편관과 정관의 역할 감각이 함께 있으면 흩어진 말보다 책임선과 결정 기준을 먼저 잡게 됩니다.",
    },
    {
      chapterId: "saju_identity" as const,
      body:
        "천을귀인이 있어 도움의 통로는 있지만 무인성이 함께 보이면, 막히는 순간 바로 기대기보다 한참 혼자 정리한 뒤에야 도움을 요청하는 장면이 생길 수 있습니다. 이 흐름은 사주의 기본 형상 안에서 혼자 버티는 힘과 도움받는 통로가 같이 있음을 보여줍니다.",
    },
    {
      chapterId: "saju_identity" as const,
      body:
        "재고귀인과 편재, 정재가 함께 있으면 돈이 들어오면 쓰는 즐거움보다 어디에 묶어둘지 먼저 생각하는 식으로 나타날 수 있습니다. 자원을 흘려보내기보다 계좌와 기록처럼 남는 자리를 정할 때 기본 형상이 선명해집니다.",
    },
    {
      chapterId: "saju_identity" as const,
      body:
        "정축일주는 차가운 흙 속의 작은 불씨처럼, 밖으로 바로 밀어붙이기보다 안에서 원리와 구조를 먼저 정리하는 모습으로 드러날 수 있습니다. INTP 성향이 함께 있으면 상대가 말하는 동안 원리상 어디가 맞지 않는지, 어떤 자료와 조건과 예외가 빠졌는지를 조용히 정리하는 장면이 생기기 쉽습니다.",
    },
    {
      chapterId: "work_money_study" as const,
      body:
        "돈이 들어오면 바로 쓰기보다 계좌를 나누고 사업 아이디어가 고객 기반과 반복 수익으로 남는지 먼저 보게 됩니다. 이 흐름은 재고귀인과 편재·정재의 자원 감각, 입력한 ENTJ의 효율 감각이 함께 움직일 때 선명해집니다.",
    },
    {
      chapterId: "love_relationships" as const,
      body:
        "상대가 서운함을 길게 말하는데도 속으로 다음에 어떻게 할 건데가 먼저 떠오를 수 있습니다. 홍염살의 끌림은 있지만 화 부족과 무식상이 겹치면 감정 표현 속도보다 해결책이 먼저 나올 수 있습니다.",
    },
    {
      chapterId: "people_family_environment" as const,
      body:
        "가족 부탁이나 팀 역할이 흐려지면 담당자와 마감, 기준표부터 정리하고 싶어질 수 있습니다. 장성살과 정관의 역할 의식, 입력한 ENTJ의 운영 감각이 겹치면 정리해 주는 사람으로 기대받기 쉽습니다.",
    },
  ])("accepts chapter-specific concrete direct-hit scene for $chapterId", ({ chapterId, body }) => {
    const draft = createValidV2Draft();
    const result = validateComprehensiveReportDraft({
      ...draft,
      chapters: draft.chapters.map((chapter) =>
        chapter.chapterId === chapterId
          ? {
              ...chapter,
              hitReadingLines: [body, ...chapter.hitReadingLines],
              body: `${body}\n\n${chapter.body}`,
            }
          : chapter,
      ),
    });

    expect(result.errors.join("\n")).not.toContain(
      `DIRECT_HIT_READING_MISSING: ${chapterId}`,
    );
    expect(result.errors.join("\n")).not.toContain(
      `DIRECT_HIT_READING_TOO_GENERIC: ${chapterId}`,
    );
    expect(result.ok).toBe(true);
  });

  it("accepts a concrete personality direct-hit scene without MBTI type examples", () => {
    const draft = createValidV2Draft();
    const result = validateComprehensiveReportDraft({
      ...draft,
      chapters: draft.chapters.map((chapter) =>
        chapter.chapterId === "personality_pattern"
          ? {
              ...chapter,
              hitReadingLines: [
                "회의에서 상대 설명이 끝나기 전에 오류와 결론이 동시에 보이는 장면이 꽤 익숙할 수 있습니다.",
              ],
              body:
                `${chapter.body} 회의에서 상대가 설명을 이어갈 때 덕민님은 이미 오류와 결론을 함께 보고 있을 가능성이 큽니다. 현침살의 빠른 오류 감지와 ENTJ식 결론 지향이 겹치면 판단은 빨라지지만 말이 평가처럼 들릴 수 있습니다.`,
              solutionLines: [
                ...chapter.solutionLines,
                "바로 지적하기보다 제가 이해한 핵심은 이것입니다라는 문장으로 시작하세요.",
              ],
            }
          : chapter,
      ),
    });

    expect(result.errors.join("\n")).not.toContain(
      "DIRECT_HIT_READING_MISSING: personality_pattern",
    );
    expect(result.errors.join("\n")).not.toContain(
      "DIRECT_HIT_READING_TOO_GENERIC: personality_pattern",
    );
    expect(result.ok).toBe(true);
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
              solutionLines: [],
              sajuTermsUsed: [],
            }
          : chapter,
      ),
      finalAdvice:
        "덕민님은 강한 기준을 가진 사람이라는 설명만 남기는 마무리입니다. 마지막 조언이 구체적이지 않도록 둡니다.",
    });

    expect(result.ok).toBe(false);
    expect(result.errors.join("\n")).toContain("FINAL_MESSAGE_CLOSING_MISSING");
  });

  it("accepts a weak final message after deterministic final message normalization", () => {
    const draft = createValidV2Draft();
    const weakFinalDraft = {
      ...draft,
      chapters: draft.chapters.map((chapter) =>
        chapter.chapterId === "final_message"
          ? {
              ...chapter,
              headline: "마지막 정리",
              hitReadingLines: ["덕민님은 기준을 빨리 세우는 편입니다."],
              body: "갑목과 갑신일주를 기준으로 마지막 방향을 짧게 정리합니다.",
              solutionLines: [],
              keyPhrases: ["갑목", "갑신일주"],
            }
          : chapter,
      ),
      finalAdvice: "방향성은 살리되 오래 가는 방식을 함께 설계하세요.",
    };
    const normalized = normalizeComprehensiveReportFinalMessage(weakFinalDraft);
    const normalizedSerialized = JSON.stringify(normalized.draft);
    const result = validateComprehensiveReportDraft(normalized.draft, {
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

    expect(normalized.normalized).toBe(true);
    expect(normalizedSerialized).toContain("이 리포트의 마지막 핵심");
    expect(normalizedSerialized).toContain("오늘부터는");
    expect(normalizedSerialized).toContain("갑목");
    expect(normalizedSerialized).toContain("갑신일주");
    expect(result.errors.join("\n")).not.toContain("FINAL_MESSAGE_CLOSING_MISSING");
    expect(result.ok).toBe(true);
  });

  it("rejects V2 template labels inside generated narrative text", () => {
    const draft = createValidV2Draft();
    const result = validateComprehensiveReportDraft({
      ...draft,
      chapters: draft.chapters.map((chapter) =>
        chapter.chapterId === "personality_pattern"
          ? {
              ...chapter,
              body: `${chapter.body} 이런 장면 있지 않나요? 이렇게 쓰면 좋습니다.`,
            }
          : chapter,
      ),
    });

    expect(result.ok).toBe(false);
    expect(result.errors.join("\n")).toContain(
      "V2_TEMPLATE_LABEL_COPY: 이런 장면 있지 않나요?",
    );
    expect(result.errors.join("\n")).toContain(
      "V2_TEMPLATE_LABEL_COPY: 이렇게 쓰면 좋습니다",
    );
  });

  it("rejects V2 major chapters without specific everyday scenes", () => {
    const draft = createValidV2Draft();
    const result = validateComprehensiveReportDraft({
      ...draft,
      chapters: draft.chapters.map((chapter) =>
        chapter.chapterId === "personality_pattern"
          ? {
              ...chapter,
              body:
                "갑목과 갑신일주를 먼저 놓고 목표와 실행을 길게 설명합니다. 입력한 ENTJ 성향으로 보면 효율과 목표 정리가 보조로 붙습니다. 이 문장은 충분히 길지만 생활 장면 단어를 일부러 빼서 구체성 검증을 통과하지 못하게 만듭니다. ".repeat(4),
              hitReadingLines: [
                "덕민님은 목표가 뚜렷해야 움직이는 편입니다.",
                "성과가 보여야 집중력이 붙는 편입니다.",
                "실행 기준이 없으면 에너지가 쉽게 흩어집니다.",
              ],
              solutionLines: [
                "목표를 둘로 나누어 보세요.",
                "성과 기준을 짧게 정하세요.",
                "보조 기준을 확인하세요.",
                "실행 흐름을 정리하세요.",
              ],
            }
          : chapter,
      ),
    });

    expect(result.ok).toBe(false);
    expect(result.errors.join("\n")).toContain(
      "EVERYDAY_SCENE_MISSING: personality_pattern",
    );
  });

  it("rejects V2 major chapters without MBTI support text", () => {
    const draft = createValidV2Draft();
    const result = validateComprehensiveReportDraft({
      ...draft,
      chapters: draft.chapters.map((chapter) =>
        chapter.chapterId === "people_family_environment"
          ? {
              ...chapter,
              body:
                "갑목과 갑신일주를 먼저 놓고 사람과 가족과 환경의 결을 길게 설명합니다. 가족이 부탁하면 거절보다 맡아 처리하고, 팀에서 일이 흐리면 본인이 결국 표와 순서를 만들게 되는 장면이 이어집니다. 명리학 용어는 충분히 길게 풀지만 보조 성향 언어는 일부러 빼서 검증 대상이 되게 합니다. ".repeat(4),
              hitReadingLines: [
                "덕민님은 가까운 사람에게 더 엄격해질 수 있습니다.",
                "부탁을 받으면 거절보다 정돈이 먼저 나올 수 있습니다.",
                "말이 자주 바뀌는 판에서는 피로가 빨리 올라올 수 있습니다.",
              ],
              solutionLines: [
                "조언 전에 질문을 한 번 넣으세요.",
                "맡을 범위를 문장으로 정하세요.",
              ],
              mbtiTermsUsed: [],
            }
          : chapter,
      ),
    });

    expect(result.ok).toBe(false);
    expect(result.errors.join("\n")).toContain(
      "MBTI_SUPPORT_MISSING: people_family_environment",
    );
  });

  it("rejects a short V2 final message without enough integrated guidance", () => {
    const draft = createValidV2Draft();
    const result = validateComprehensiveReportDraft({
      ...draft,
      chapters: draft.chapters.map((chapter) =>
        chapter.chapterId === "final_message"
          ? {
              ...chapter,
              body:
                "갑목과 갑신일주를 기준으로 마지막 방향을 짧게 정리합니다. ENTJ는 보조 성향입니다.",
              solutionLines: ["오늘 하나만 바꾸세요."],
            }
          : chapter,
      ),
    });

    expect(result.ok).toBe(false);
    expect(result.errors.join("\n")).toContain("FINAL_MESSAGE_TOO_SHORT");
    expect(result.errors.join("\n")).toContain("FINAL_MESSAGE_SOLUTIONS_MISSING");
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
              body: `${chapter.sajuTermsUsed.join(" ")}을 먼저 놓고 봅니다. 덕민님, 성과가 보이지 않으면 집중이 흐려지는 상황 자주 나오지 않나요? 이 챕터는 목표와 돈과 실행 기준을 길게 설명하지만 성인 학습 범위 키워드는 일부러 넣지 않습니다. 갑목은 방향을 잡고 갑신일주는 압박 속에서 기준을 세우는 구조라서, 현실 판단과 실행 속도가 같이 움직입니다. 목표를 작게 나누고 돈 계획을 분리하면 과열을 줄일 수 있습니다. 같은 설명을 충분히 길게 이어서 본문 길이 조건은 통과하지만 특정 학습 범위 조건은 통과하지 못하게 만듭니다. `.repeat(3),
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
              body: `${chapter.sajuTermsUsed.join(" ")}을 먼저 놓고 관계를 읽습니다. 덕민님, 좋아해도 따뜻한 말보다 해결책이 먼저 나갈 수 있습니다. 이 문장은 관계 장면을 충분히 길게 설명하지만 상대 기준과 좋지 않은 관계 기준은 일부러 넣지 않습니다. 갑목은 방향을 잡고 갑신일주는 압박 속에서 기준을 세우는 구조라서, 관계에서도 결론이 먼저 보이기 쉽습니다. 감정을 말하기 전에 질문하고 속도를 맞추면 말의 온도가 달라집니다. 본문은 충분히 길어서 길이 검증은 통과하지만 관계 처방 키워드 검증은 실패해야 합니다. `.repeat(3),
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
                "MBTI 관계 기준: 감정을 천천히 풀어주고 생활 리듬과 책임감이 안정적인 성향을 보되 MBTI만으로 궁합을 단정하지 않습니다.",
              ],
            }
          : chapter,
      ),
    });

    expect(result.ok).toBe(true);
  });

  it.each([
    "MBTI는 궁합을 단정하는 기준이 아니라 관계에서 필요한 대화 속도와 표현 방식을 보는 보조 지표로만 사용해야 합니다.",
    "ENTJ라는 유형명보다 중요한 것은 상대가 감정을 천천히 풀어주고, 약속을 지키며, 덕민님의 빠른 결론에 바로 눌리지 않는 생활 리듬을 갖고 있느냐입니다.",
    "MBTI는 보조 지표이므로 유형보다 실제 생활 리듬, 감정 표현 방식, 책임감과 약속 습관을 함께 봐야 합니다.",
  ])("accepts V2 love chapter with MBTI caution: %s", (mbtiCautionLine) => {
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
                mbtiCautionLine,
              ],
            }
          : chapter,
      ),
    });

    expect(result.ok).toBe(true);
  });

  it("accepts MBTI caution in love body even when solution lines hold only partner guidance", () => {
    const draft = createValidV2Draft();
    const result = validateComprehensiveReportDraft({
      ...draft,
      chapters: draft.chapters.map((chapter) =>
        chapter.chapterId === "love_relationships"
          ? {
              ...chapter,
              body: `${chapter.body} MBTI는 궁합을 단정하는 기준이 아니라 관계에서 필요한 대화 속도와 표현 방식을 보는 보조 지표입니다.`,
              solutionLines: [
                "맞는 상대: 감정을 천천히 풀어주고 덕민님의 과열을 식혀주는 사람이 맞기 쉽습니다.",
                "피해야 할 상대: 감정 기복이 크고 책임이 흐릿한 사람은 조심할 상대입니다.",
                "보완 기운: 수 기운과 화 기운처럼 감정 완충과 표현 온도를 보태는 타입이 좋습니다.",
                "관계에서는 실제 생활 태도, 감정 온도, 책임감을 함께 보세요.",
              ],
            }
          : chapter,
      ),
    });

    expect(result.ok).toBe(true);
  });

  it("rejects explicit MBTI type examples until a complement scorer exists", () => {
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

    expect(result.ok).toBe(false);
    expect(result.errors.join("\n")).toContain("MBTI_TYPE_EXAMPLE_FORBIDDEN");
  });

  it.each([
    {
      expectedError: "LOVE_PARTNER_FIT_MISSING",
      solutionLines: [
        "피해야 할 상대: 감정 기복이 크고 책임이 흐릿한 사람은 조심할 상대입니다.",
        "보완 기운: 수 기운과 화 기운처럼 감정 완충과 표현 온도를 보태는 타입이 좋습니다.",
        "MBTI 관계 기준: 감정을 천천히 풀어주고 생활 리듬과 책임감이 안정적인 성향을 보되 MBTI만으로 궁합을 단정하지 않습니다.",
        "관계에서는 대화를 많이 하세요.",
      ],
    },
    {
      expectedError: "LOVE_BAD_MATCH_PATTERN_MISSING",
      solutionLines: [
        "맞는 상대: 감정을 천천히 풀어주고 덕민님의 과열을 식혀주는 사람이 맞기 쉽습니다.",
        "보완 기운: 수 기운과 화 기운처럼 감정 완충과 표현 온도를 보태는 타입이 좋습니다.",
        "MBTI 관계 기준: 감정을 천천히 풀어주고 생활 리듬과 책임감이 안정적인 성향을 보되 MBTI만으로 궁합을 단정하지 않습니다.",
        "서로 배려하세요.",
      ],
    },
    {
      expectedError: "LOVE_COMPLEMENT_MISSING",
      solutionLines: [
        "맞는 상대: 감정을 천천히 풀어주고 덕민님의 과열을 식혀주는 사람이 맞기 쉽습니다.",
        "피해야 할 상대: 감정 기복이 크고 책임이 흐릿한 사람은 조심할 상대입니다.",
        "MBTI 관계 기준: 감정을 천천히 풀어주고 생활 리듬과 책임감이 안정적인 성향을 보되 MBTI만으로 궁합을 단정하지 않습니다.",
        "좋은 사람을 만나세요.",
      ],
    },
    {
      expectedError: "LOVE_MBTI_CAUTION_OR_EXAMPLE_MISSING",
      solutionLines: [
        "맞는 상대: 감정을 천천히 풀어주고 덕민님의 과열을 식혀주는 사람이 맞기 쉽습니다.",
        "피해야 할 상대: 감정 기복이 크고 책임이 흐릿한 사람은 조심할 상대입니다.",
        "보완 기운: 수 기운과 화 기운처럼 감정 완충과 표현 온도를 보태는 타입이 좋습니다.",
        "관계에서는 특정 조건 하나로 단정하지 말고 실제 생활 태도와 감정 온도를 함께 봅니다.",
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
                ...(expectedError === "LOVE_MBTI_CAUTION_OR_EXAMPLE_MISSING"
                  ? {
                      body:
                        "관계에서는 맞는 상대와 피해야 할 패턴을 실제 생활 태도와 감정 온도로 함께 봐야 합니다. 감정 완충과 책임감이 있는 사람을 고르는 기준은 중요하지만, 특정 체계 이름을 빌려 관계를 설명하지는 않습니다.",
                    }
                  : {}),
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
              body:
                "관계에서는 맞는 상대와 피해야 할 패턴을 실제 생활 태도와 감정 온도로 함께 봐야 합니다. 감정 완충과 책임감이 있는 사람을 고르는 기준은 중요하지만, 구체적인 관계 보조 지표는 빠져 있습니다.",
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
              body: `${chapter.sajuTermsUsed.join(" ")}을 먼저 놓고 반복되는 리스크를 읽습니다. 덕민님, 버티는 힘은 강하지만 회복 타이밍은 자주 늦게 잡히기 쉽습니다. 이 문장은 성장 전략을 길게 설명하지만 오행별 생활 처방 키워드는 일부러 넣지 않습니다. 갑목은 방향을 다시 세우고 갑신일주는 압박 속에서도 기준을 붙잡는 구조입니다. 무리하지 말고 일의 순서를 다시 나누면 과열을 줄일 수 있습니다. 본문은 충분히 길어서 길이 조건은 통과하지만 element remedy 검증은 실패해야 합니다. `.repeat(3),
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

  it("accepts generic risk hit-reading as a warning when risk remedies are concrete", () => {
    const draft = createValidV2Draft();
    const result = validateComprehensiveReportDraft({
      ...draft,
      chapters: draft.chapters.map((chapter) =>
        chapter.chapterId === "risk_and_growth"
          ? {
              ...chapter,
              hitReadingLines: [
                "덕민님은 성장할 수 있습니다.",
                "덕민님은 장점과 단점이 있습니다.",
              ],
              body:
                `${chapter.body} 과열과 고립, 과책임으로 번아웃이 오기 전에 멈추는 기준을 잡아야 합니다. 관계 마찰은 감정 완충 부족에서 커질 수 있으니 도움 받기와 경계선을 생활 규칙으로 두는 편이 좋습니다.`,
              solutionLines: [
                "수 부족은 밤 산책, 수변 공간, 충분한 수면, 기록 루틴으로 식히세요.",
                "화 부족은 가벼운 운동과 짧은 표현 연습으로 밖으로 내세요.",
                "토 과다는 책임 덜어내기와 경계선 정리하기로 조절하세요.",
                "번아웃 전에는 도움 받기를 먼저 일정에 넣어야 합니다.",
              ],
            }
          : chapter,
      ),
    });

    expect(result.ok).toBe(true);
    expect(result.warnings).toContain(
      "DIRECT_HIT_READING_TOO_GENERIC: risk_and_growth",
    );
    expect(result.errors).toEqual([]);
  });

  it("rejects generic risk hit-reading when risk remedies are weak", () => {
    const draft = createValidV2Draft();
    const result = validateComprehensiveReportDraft({
      ...draft,
      chapters: draft.chapters.map((chapter) =>
        chapter.chapterId === "risk_and_growth"
          ? {
              ...chapter,
              hitReadingLines: [
                "덕민님은 성장할 수 있습니다.",
                "덕민님은 장점과 단점이 있습니다.",
              ],
              solutionLines: [
                "좋은 방향을 찾으세요.",
                "무리하지 마세요.",
                "성장하세요.",
                "잘 쉬세요.",
              ],
            }
          : chapter,
      ),
    });

    expect(result.ok).toBe(false);
    expect(result.errors.join("\n")).toContain(
      "DIRECT_HIT_READING_TOO_GENERIC: risk_and_growth",
    );
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

  it("rejects unsafe generated advertising, medical, legal, and investment copy", () => {
    const unsafeCases = [
      {
        body: "이 리포트는 우울증 분석을 제공한다는 식으로 보이면 안 됩니다.",
        expectedError: "UNSAFE_MEDICAL_COPY: 우울증 분석",
      },
      {
        body: "이 리포트가 투자 추천을 제공한다고 쓰면 안 됩니다.",
        expectedError: "UNSAFE_INVESTMENT_COPY: 투자 추천",
      },
      {
        body: "이 리포트가 법률 자문을 제공한다고 쓰면 안 됩니다.",
        expectedError: "UNSAFE_LEGAL_COPY: 법률 자문",
      },
      {
        body: "이 구조는 반드시 성공으로 이어진다고 쓰면 안 됩니다.",
        expectedError: "UNSAFE_CERTAINTY_COPY: 반드시 성공",
      },
      {
        body: "이 구조는 100% 보장된다고 쓰면 안 됩니다.",
        expectedError: "UNSAFE_ADVERTISING_COPY",
      },
      {
        body: "이 흐름을 운명 확정이라고 쓰면 안 됩니다.",
        expectedError: "UNSAFE_CERTAINTY_COPY: 운명 확정",
      },
    ];

    for (const testCase of unsafeCases) {
      const result = validateComprehensiveReportDraft(
        replaceSectionBody(
          createValidDraft(),
          "saju_core",
          `${createValidDraft().sections.find((section) => section.sectionId === "saju_core")?.body ?? ""} ${testCase.body}`,
        ),
      );

      expect(result.ok).toBe(false);
      expect(result.errors.join("\n")).toContain(testCase.expectedError);
    }
  });

  it("allows safe tendency and reference-purpose language in generated reports", () => {
    const draft = replaceSectionBody(
      createValidDraft(),
      "saju_core",
      `${createValidDraft().sections.find((section) => section.sectionId === "saju_core")?.body ?? ""} 이런 경향이 나타날 가능성이 큽니다. 자기이해와 참고 목적으로 보세요. 이 표현은 확정이나 자문이 아니라 성향으로 읽힙니다. 도움이 될 수 있습니다.`,
    );
    const result = validateComprehensiveReportDraft(draft, {
      allowedSajuTerms: ["갑목", "갑신", "갑신일주"],
    });

    expect(result.errors).toEqual([]);
    expect(result.ok).toBe(true);
  });

  it("rejects internal meta and debug copy", () => {
    const forbiddenBodies = [
      "검증된 JSON으로 보관되는 문장입니다.",
      "저장용 fixture 문장입니다.",
      "entry ids만 제공된 상태입니다.",
      "제공된 만세력 원문 표는 없고 내부 사정만 있습니다.",
      "OpenAI와 프롬프트와 evidence packet을 언급하는 debug 문장입니다.",
    ];

    for (const body of forbiddenBodies) {
      const result = validateComprehensiveReportDraft(
        replaceSectionBody(createValidDraft(), "saju_core", body),
      );

      expect(result.ok).toBe(false);
      expect(result.errors.join("\n")).toContain("INTERNAL_META_COPY");
    }
  });

  it("classifies mild production wording as repairable meta copy", () => {
    const mildBodies = [
      "이 초안에서는 갑목과 갑신일주를 먼저 해석합니다.",
      "이 원고에서는 갑목과 갑신일주를 먼저 해석합니다.",
      "작성된 글은 갑목과 갑신일주를 먼저 해석합니다.",
      "생성된 내용은 갑목과 갑신일주를 먼저 해석합니다.",
    ];

    for (const body of mildBodies) {
      const draft = createValidDraft();
      const result = validateComprehensiveReportDraft({
        ...draft,
        sections: draft.sections.map((section) =>
          section.sectionId === "saju_core"
            ? {
                ...section,
                body: `${section.body} ${body}`,
              }
            : section,
        ),
      });
      const issues = getComprehensiveReportDraftValidationIssues(result.errors);

      expect(result.ok).toBe(false);
      expect(result.errors.join("\n")).toContain("MILD_INTERNAL_META_COPY");
      expect(issues).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            code: "MILD_INTERNAL_META_COPY",
            severity: "repairable",
          }),
        ]),
      );
      expect(areAllDraftValidationErrorsRepairable(result.errors)).toBe(true);
    }
  });

  it("does not flag legitimate document-work wording as mild internal meta copy", () => {
    const draft = replaceSectionBody(
      createValidDraft(),
      "work_career",
      "갑목과 갑신일주를 먼저 놓고 일하는 방식을 읽습니다. 갑목은 방향을 세우는 힘이고 갑신일주는 압박 속에서도 기준을 정리하는 구조입니다. 그래서 업무에서는 전문서 공부, 문서화, 문서 작업, 문서 정리, 문서로 남기기 같은 실행 방식이 성과를 보존하는 장치가 될 수 있습니다. ENTJ는 이 흐름을 목표와 역할 정리로 체감하게 만드는 보조 언어입니다.",
    );
    const result = validateComprehensiveReportDraft(draft, {
      allowedSajuTerms: ["갑목", "갑신", "갑신일주"],
      allowedMbtiTerms: ["ENTJ"],
    });

    expect(result.errors.join("\n")).not.toContain("MILD_INTERNAL_META_COPY");
    expect(result.ok).toBe(true);
  });

  it("keeps implementation debug wording as fatal meta copy", () => {
    const fatalBodies = [
      "OpenAI 출력이라고 말하는 문장입니다.",
      "JSON 형식이라고 말하는 문장입니다.",
      "프롬프트 내용을 언급하는 문장입니다.",
      "evidence packet을 언급하는 문장입니다.",
      "debug 정보를 언급하는 문장입니다.",
    ];

    for (const body of fatalBodies) {
      const draft = createValidDraft();
      const result = validateComprehensiveReportDraft({
        ...draft,
        sections: draft.sections.map((section) =>
          section.sectionId === "saju_core"
            ? {
                ...section,
                body: `${section.body} ${body}`,
              }
            : section,
        ),
      });
      const issues = getComprehensiveReportDraftValidationIssues(result.errors);

      expect(result.ok).toBe(false);
      expect(result.errors.join("\n")).toContain("INTERNAL_META_COPY");
      expect(issues).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            code: "INTERNAL_META_COPY",
            severity: "fatal",
          }),
        ]),
      );
      expect(areAllDraftValidationErrorsRepairable(result.errors)).toBe(false);
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

  it("rejects V2 work money study chapters without solution lines", () => {
    const draft = createValidV2Draft();
    const result = validateComprehensiveReportDraft({
      ...draft,
      chapters: draft.chapters.map((chapter) =>
        chapter.chapterId === "work_money_study"
          ? {
              ...chapter,
              solutionLines: [],
            }
          : chapter,
      ),
    });

    expect(result.ok).toBe(false);
    expect(result.errors.join("\n")).toContain(
      "SOLUTION_LINES_MISSING: work_money_study",
    );
  });

  it("rejects V2 work money study chapters without MBTI support", () => {
    const draft = createValidV2Draft();
    const neutralWorkBody = Array.from(
      { length: 8 },
      () =>
        "일, 돈, 공부 챕터에서는 재고귀인과 편재를 돈과 계좌 기록으로 읽습니다. 돈이 들어오면 계좌와 예산을 나누고, 전문서와 자격증은 목차와 실전 적용 순서로 정리하는 장면이 자연스럽습니다. 이 문장은 일 처리, 공부 방식, 돈 관리 방식을 설명하지만 입력 성향을 행동 언어로 연결하지 않습니다.",
    ).join(" ");
    const result = validateComprehensiveReportDraft({
      ...draft,
      chapters: draft.chapters.map((chapter) =>
        chapter.chapterId === "work_money_study"
          ? {
              ...chapter,
              hitReadingLines: [
                "돈이 들어오면 계좌와 예산을 먼저 나누는 장면입니다.",
                "전문서를 읽을 때 목차와 실전 적용을 먼저 보는 장면입니다.",
                "사업 아이디어도 남는 구조를 먼저 확인하는 장면입니다.",
              ],
              body: neutralWorkBody,
              solutionLines: [
                "돈은 계좌와 예산으로 나누어 기록하세요.",
                "공부는 목차와 핵심 개념 순서로 정리하세요.",
                "업무나 프로젝트는 맡을 일과 넘길 일을 구분하세요.",
                "루틴은 매주 같은 시간에 점검하세요.",
              ],
              mbtiTermsUsed: [],
            }
          : chapter,
      ),
    });

    expect(result.ok).toBe(false);
    expect(result.errors.join("\n")).toContain(
      "MBTI_SUPPORT_MISSING: work_money_study",
    );
  });

  it("accepts explicit INTP support in the work money study chapter", () => {
    const draft = createValidV2Draft();
    const result = validateComprehensiveReportDraft({
      ...draft,
      profileTable: {
        ...draft.profileTable,
        mbti: "INTP",
      },
      chapters: draft.chapters.map((chapter) =>
        chapter.chapterId === "work_money_study"
          ? {
              ...chapter,
              body: `${chapter.body} MBTI로 입력된 INTP 성향은 공부와 업무에서 원리와 조건이 납득돼야 집중이 붙기 쉬우므로 목차와 실전 적용 순서로 정리하는 보조 언어입니다.`,
              mbtiTermsUsed: ["INTP"],
            }
          : chapter,
      ),
    });

    expect(result.errors.join("\n")).not.toContain(
      "MBTI_SUPPORT_MISSING: work_money_study",
    );
  });

  it("accepts explicit ENTJ support in the work money study chapter", () => {
    const draft = createValidV2Draft();
    const result = validateComprehensiveReportDraft({
      ...draft,
      chapters: draft.chapters.map((chapter) =>
        chapter.chapterId === "work_money_study"
          ? {
              ...chapter,
              body: `${chapter.body} MBTI로 입력된 ENTJ 성향은 기회가 보일 때 바로 확장하려는 속도가 붙기 쉬우므로 수익 구조와 방어 규칙을 먼저 정하는 보조 언어입니다.`,
              mbtiTermsUsed: ["ENTJ"],
            }
          : chapter,
      ),
    });

    expect(result.errors.join("\n")).not.toContain(
      "MBTI_SUPPORT_MISSING: work_money_study",
    );
  });

  it("accepts explicit INTP support in the risk and growth chapter", () => {
    const draft = createValidV2Draft();
    const result = validateComprehensiveReportDraft({
      ...draft,
      profileTable: {
        ...draft.profileTable,
        mbti: "INTP",
      },
      chapters: draft.chapters.map((chapter) =>
        chapter.chapterId === "risk_and_growth"
          ? {
              ...chapter,
              body: `${chapter.body} MBTI로 입력된 INTP 성향은 생각을 오래 검토하는 흐름을 회복 신호와 기록 루틴으로 번역해 보는 보조 언어입니다.`,
              mbtiTermsUsed: ["INTP"],
            }
          : {
              ...chapter,
              body: chapter.body.replaceAll("ENTJ", "INTP"),
              mbtiTermsUsed: chapter.mbtiTermsUsed.map((term) =>
                term === "ENTJ" ? "INTP" : term,
              ),
            },
      ),
    });

    expect(result.errors.join("\n")).not.toContain(
      "MBTI_SUPPORT_MISSING: risk_and_growth",
    );
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
