import { describe, expect, it } from "vitest";

import { buildMajorFortuneEvidence } from "../../../src/lib/report-knowledge/majorFortuneEvidence";
import {
  requireMajorFortuneFixture,
} from "../../../src/lib/report-knowledge/majorFortuneFixtures";
import {
  majorFortuneReportDraftJsonSchema,
  type MajorFortuneReportDraft,
} from "../../../src/lib/report-generation/majorFortuneReportDraftTypes";
import {
  MajorFortuneReportWriterFailure,
  generateMajorFortuneReportDraft,
  majorFortuneResponseFormatName,
} from "../../../src/lib/report-generation/openaiMajorFortuneReportWriter";
import {
  buildOpenAIMajorFortuneReportWriterMessages,
} from "../../../src/lib/report-generation/openaiMajorFortuneReportWriterPrompt";
import {
  getMajorFortunePreviewSnapshotRelativePath,
  sanitizeMajorFortunePreviewSnapshotPayload,
} from "../../../src/lib/report-generation/majorFortunePreviewSnapshot";

function buildPacket() {
  const fixture = requireMajorFortuneFixture("deokmin-current-major-fortune");

  return buildMajorFortuneEvidence({
    fixtureId: fixture.id,
    currentYear: fixture.currentYear,
    person: fixture.person,
  });
}

function createValidDraft(): MajorFortuneReportDraft {
  return {
    version: "v1",
    productType: "major_fortune",
    productVersion: "v1",
    personLabel: "덕민",
    openingTitle: "현재 대운 戊辰 흐름",
    openingSummary:
      "이 대운은 10년 동안 역할과 책임 기준을 다시 잡는 배경으로 체감될 수 있습니다.",
    coreLine:
      "戊辰 대운은 현실 구조와 책임 기준을 다시 까는 10년 흐름입니다.",
    userContextSummary: {
      lifeStatusLabel: "직장인",
      fieldLabel: "개발·서비스 기획",
      relationshipStatusLabel: "미입력",
      translationNote:
        "개발·서비스 기획의 프로젝트, 문서화, 운영 책임 장면으로 번역했습니다.",
    },
    cycleSummary: {
      ganji: "戊辰",
      displayTitle: "현재 대운 戊辰",
      cycleIndexLabel: "3번째 대운",
      currentPositionLabel: "2026년 기준 1년차",
      ageRangeLabel: "대운표 기준 구간",
      yearRangeLabel: "2026년~2035년",
      stemLabel: "戊 · 양토",
      branchLabel: "辰 · 양토",
      elementLabel: "토의 대운",
      tenGodLabel: "편재의 대운",
      basisLabel: "입력된 대운표 기준",
    },
    calculationBasis: {
      basisType: "user_supplied_major_fortune_table",
      displayLabel: "입력된 대운표 기준",
      explanation:
        "이 대운 구간은 사용자가 검증해 입력한 대운표를 기준으로 잡았습니다.",
      ageBasisLabel: "표기 나이는 대운표 기준 나이입니다.",
      note: "현재 리포트에서는 2026년을 기준으로 현재 위치한 대운을 읽습니다.",
    },
    previousToCurrentShift: {
      previousGanji: "丁卯",
      currentGanji: "戊辰",
      plain:
        "丁卯 대운에서 戊辰 대운으로 넘어오며 표현과 관계의 배경이 현실 구조와 책임의 배경으로 바뀝니다.",
      whatChanged: [
        "표현과 관계 조율보다 현실 구조, 계약, 책임 기준이 더 중요해집니다.",
        "2026년은 戊辰 대운의 1년차라 초반 기준 설정이 이후 10년에 반복될 수 있습니다.",
      ],
    },
    decadeArchetype: {
      label: "현실 구조 재편형",
      metaphor: "흙더미를 다시 설계도로 바꾸는 10년",
      plain:
        "戊辰 대운은 해야 할 일, 관리할 일, 책임질 일을 흙처럼 쌓아 두기보다 구조로 다시 짜야 하는 배경입니다.",
    },
    flowIndexSummary: {
      flowIndex: 72,
      flowTypeLabel: "책임·구조 재편형",
      flowIndexCaution:
        "이 지표는 좋고 나쁨이 아니라 10년 동안 반복될 체감 강도를 보여 줍니다.",
    },
    bigThemes: [
      {
        title: "기준을 직접 세우는 10년",
        metaphor: "일이 흙처럼 쌓이기 전에 길을 먼저 내는 흐름",
        body: "편재는 돈과 현실 자원을 다루는 힘이고, 토는 현실 책임을 쌓이게 만드는 배경입니다.",
        likelyScenes: [
          "프로젝트 기준을 직접 문서화하는 장면",
          "맡을 일과 맡지 않을 일을 나누는 장면",
        ],
        strategy: "초반부터 역할 경계를 문서로 남기세요.",
      },
      {
        title: "현실 숫자를 정리하는 10년",
        metaphor: "돈과 계약의 흙더미를 월 단위로 나누는 흐름",
        body: "토 과다는 급여, 생활비, 계약처럼 관리할 항목이 늘어나는 구조로 체감될 수 있습니다.",
        likelyScenes: [
          "고정지출을 월초에 나누는 장면",
          "계약과 정산 기준을 다시 맞추는 장면",
        ],
        strategy: "반복 비용과 책임 비용을 먼저 분리하세요.",
      },
      {
        title: "관계의 거리와 역할을 재배치하는 10년",
        metaphor: "사람과 약속이 실제 역할로 묶이는 흐름",
        body: "육합과 충은 사람, 일정, 역할이 묶였다가 다시 조정되는 장면으로 나타날 수 있습니다.",
        likelyScenes: [
          "가족 일정과 업무 일정이 겹치는 장면",
          "상사, 동료, 친구와 역할 경계를 다시 맞추는 장면",
        ],
        strategy: "관계 안에서도 감정보다 역할과 시간을 먼저 확인하세요.",
      },
    ],
    myeongliLayers: {
      tenGodLayer: {
        majorStemTenGod: "편재",
        annualStemTenGodsInCycle: Array.from({ length: 10 }, (_, index) => {
          const year = 2026 + index;
          const stems = ["丙", "丁", "戊", "己", "庚", "辛", "壬", "癸", "甲", "乙"];
          const tenGods = ["식신", "상관", "편재", "정재", "편관", "정관", "편인", "정인", "비견", "겁재"];

          return {
            year,
            stem: stems[index] ?? "丙",
            tenGod: tenGods[index] ?? "식신",
            plain: `${year}년 천간은 甲(갑목) 일간에게 ${tenGods[index] ?? "식신"}으로 작용해 그해의 행동 방식과 압박 지점을 바꿉니다.`,
          };
        }),
        plain:
          "戊辰 대운의 천간 戊는 甲(갑목) 일간에게 편재입니다. 편재는 돈, 자원, 거래, 현실을 실제로 움직이는 힘입니다.",
      },
      elementLayer: {
        majorElements: ["토"],
        fillMissing: [],
        overloadHeavy: ["토"],
        plain:
          "戊辰 대운은 토의 책임과 현실 기준을 키우며, 이미 무거운 토 과다를 더 체감하게 만들 수 있습니다.",
      },
      branchInteractionLayer: {
        interactions: [
          {
            year: null,
            type: "해",
            plainType: "큰 충돌은 아니지만 피로와 누수가 쌓이는 장면",
            plain:
              "卯辰 해는 관계와 일정에서 겉으로 큰 충돌 없이 피로가 쌓이는 장면으로 나타날 수 있습니다.",
            impactArea: "relationship",
          },
        ],
        plain:
          "대운 지지는 원국의 지지와 맞물리며 관계, 일, 생활 리듬의 장기 배치를 바꿉니다.",
      },
      hiddenStemLayer: {
        majorBranchHiddenStems: ["戊(편재)", "乙(겁재)", "癸(정인)"],
        plain:
          "辰 지장간은 戊(편재)·乙(겁재)·癸(정인)입니다. 겉으로는 토이지만 안쪽에는 돈, 자기 기준, 회복 이슈가 같이 들어옵니다.",
      },
      twelveStageLayer: null,
      auxiliaryStarsLayer: [
        {
          label: "천을귀인",
          plain: "막혔을 때 도움을 주는 사람, 제도, 조언이 들어올 수 있는 보호 장치입니다.",
          caution: null,
        },
      ],
    },
    decadeCards: [
      {
        label: "일·성과",
        index: 78,
        headline: "프로젝트 기준을 잡는 역할이 반복됩니다.",
        body: "보고, 문서화, 일정 조율처럼 결과를 보이게 만드는 일이 중요해집니다.",
      },
      {
        label: "돈·현실",
        index: 70,
        headline: "고정지출과 장기 관리 기준이 중요해집니다.",
        body: "급여, 생활비, 계약, 정산처럼 현실 숫자를 직접 챙기는 장면이 늘 수 있습니다.",
      },
      {
        label: "인간관계",
        index: 64,
        headline: "연락과 역할 경계를 다시 맞춥니다.",
        body: "동료, 친구, 메시지, 거리감의 기준을 짧고 분명하게 정리해야 합니다.",
      },
      {
        label: "연애·가족",
        index: 62,
        headline: "가족과 가까운 관계의 역할이 재배치됩니다.",
        body: "부모, 집안 일정, 약속, 생활 동선에서 맡아야 할 몫을 조율하게 됩니다.",
      },
      {
        label: "학업·자격증",
        index: 68,
        headline: "업무 공부와 포트폴리오를 장기 자산으로 만듭니다.",
        body: "자격증, 실무 정리, 발표 자료처럼 남는 결과물을 쌓는 방식이 좋습니다.",
      },
      {
        label: "몸·생활 리듬",
        index: 59,
        headline: "회복 루틴을 구조화해야 합니다.",
        body: "수면, 식사, 피로, 컨디션을 일정처럼 관리해야 장기 압박을 버틸 수 있습니다.",
      },
    ],
    keySignals: [
      {
        type: "opportunity",
        title: "역할 재정리 기회",
        body: "결과물을 보이게 만들고 기준을 세우는 방식으로 커리어 기반을 만들 수 있습니다.",
        evidenceLabel: "비견 대운",
      },
      {
        type: "difficulty",
        title: "현실 책임 부담",
        body: "토 과다가 자극되어 돈, 계약, 관리 책임이 누적될 수 있습니다.",
        evidenceLabel: "토 과다 자극",
      },
    ],
    majorStructure: {
      ganjiExplanation:
        "戊辰은 토가 강하게 들어와 현실 구조와 책임 기준을 동시에 건드립니다.",
      tenGodExplanation:
        "비견: 자기 기준, 동등함, 경쟁과 공감이 장기 배경으로 반복됩니다.",
      elementEffectExplanation:
        "목은 방향을 세우고 토는 현실 책임을 무겁게 만들 수 있습니다.",
      branchInteractionExplanation:
        "卯戌 육합: 사람과 일정이 묶이며 실제 움직임이 생기기 쉽습니다.",
      transitionExplanation:
        "丁卯 대운에서 戊辰 대운으로 넘어오며 실행 기준이 중요해졌습니다.",
    },
    cycleChapters: Array.from({ length: 6 }, (_, index) => ({
      title: `대운 해석 ${index + 1}`,
      headline: "반복되는 장기 장면을 구체적으로 봅니다.",
      body:
        "직장, 가족, 돈 중 한 영역에서 내가 정리해야 하는 역할이 반복될 가능성이 큽니다.",
      likelyScenes: [
        "프로젝트 기준을 문서로 남겨야 하는 장면",
        "계약과 생활비 기준을 다시 맞추는 장면",
      ],
      practicalAdvice: [
        "역할과 마감 기준을 말보다 문서로 남기세요.",
        "돈과 일정은 월 단위로 먼저 나누어 보세요.",
      ],
    })),
    phaseTimeline: [
      {
        phase: "early",
        label: "초반 1~3년",
        headline: "새 기준을 세우는 구간",
        body: "이전 대운과 달라진 역할을 파악하는 시간이 됩니다.",
        advice: "큰 결론보다 반복되는 압박의 원인을 먼저 기록하세요.",
      },
      {
        phase: "middle",
        label: "중반 4~7년",
        headline: "책임이 구체화되는 구간",
        body: "프로젝트, 돈, 관계의 기준이 실제 선택으로 굳어집니다.",
        advice: "맡을 일과 맡지 않을 일을 구분하세요.",
      },
      {
        phase: "late",
        label: "후반 8~10년",
        headline: "다음 대운으로 넘어갈 준비",
        body: "쌓아 둔 구조가 다음 선택의 기반이 됩니다.",
        advice: "성과와 비용을 정리해 다음 방향을 준비하세요.",
      },
    ],
    strongYears: [
      {
        year: 2026,
        ganji: "丙午",
        headline: "대운이 바뀌며 현실 구조를 새로 까는 해",
        body: "戊辰 대운 1년차라 책임 범위와 돈의 기준을 새로 잡는 이유가 분명합니다.",
        advice: "계약, 정산, 역할 범위를 초반부터 문서로 남기세요.",
        whyStrong:
          "대운 戊辰이 시작되고 세운 丙午가 화의 속도와 노출을 올려 토 책임을 자극하기 때문입니다.",
        likelyArea: "일·성과",
        pushStrategy: "프로젝트 기준, 문서화, 운영 체계",
        reduceStrategy: "권한 없는 책임, 끝없는 일정 추가, 기록 없는 구두 지시",
      },
      {
        year: 2028,
        ganji: "戊申",
        headline: "대운 천간이 반복되어 돈과 역할이 강해지는 해",
        body: "戊가 반복되어 편재의 돈, 거래, 현실 자원 테마가 같은 방향으로 겹칩니다.",
        advice: "무리한 확장보다 고정비와 책임 비용을 줄이세요.",
        whyStrong:
          "대운 천간 戊와 세운 戊가 겹쳐 편재의 돈, 계약, 현실 자원 테마가 강해지기 때문입니다.",
        likelyArea: "돈·외부기회",
        pushStrategy: "외부 프로젝트, 계약, 정산 기준, 비용 구조 단순화",
        reduceStrategy: "감으로 하는 투자, 애매한 돈거래, 구두 약속",
      },
      {
        year: 2030,
        ganji: "庚戌",
        headline: "辰戌 충으로 구조가 크게 흔들릴 수 있는 해",
        body: "대운 辰과 戌이 부딪혀 일, 집, 계약, 관계의 기준을 다시 조정해야 하는 이유가 생깁니다.",
        advice: "중요한 약속과 비용 구조는 미리 점검하세요.",
        whyStrong:
          "대운 辰과 세운 戌이 충으로 부딪혀 이미 깔린 구조와 새 책임이 충돌하기 쉽기 때문입니다.",
        likelyArea: "관계",
        pushStrategy: "역할 조율, 연락 방식 정리, 가족·동료와의 일정 합의",
        reduceStrategy: "말하지 않은 기대, 무리한 대신 처리, 애매한 약속",
      },
    ],
    majorFortuneTimelineRows: Array.from({ length: 10 }, (_, index) => {
      const year = 2026 + index;
      const yearIndexInCycle = index + 1;
      const phase =
        yearIndexInCycle <= 3
          ? "early"
          : yearIndexInCycle <= 7
            ? "middle"
            : "late";
      const annualGanjis = ["丙午", "丁未", "戊申", "己酉", "庚戌", "辛亥", "壬子", "癸丑", "甲寅", "乙卯"];
      const annualTenGods = ["식신", "상관", "편재", "정재", "편관", "정관", "편인", "정인", "비견", "겁재"];

      return {
        year,
        ageLabel: `${27 + index}세`,
        ageBasisLabel: "대운표 기준 나이",
        yearIndexInCycle,
        phase,
        isCurrentYear: year === 2026,
        isCycleStartYear: year === 2026,
        isCycleEndYear: year === 2035,
        badges: [
          ...(year === 2026 ? ["올해" as const, "전환" as const] : []),
          ...(year === 2028 ? ["강함" as const] : []),
          ...(year === 2030 ? ["주의" as const] : []),
          ...(year === 2035 ? ["정리" as const] : []),
        ],
        majorGanji: "戊辰",
        annualGanji: annualGanjis[index] ?? "丙午",
        annualTenGodLabel: annualTenGods[index] ?? "식신",
        keyInteractionLabel: year === 2030 ? "충: 굳어 있던 배치가 부딪혀 바뀌는 장면" : null,
        oneLine:
          year === 2026
            ? "2026년 丙午: 대운 戊辰이 시작되고, 세운 丙午가 속도와 노출을 올립니다. 일을 크게 벌리기보다 책임 범위부터 좁혀야 하는 해입니다."
            : `${year}년 ${annualGanjis[index] ?? "丙午"}: 대운 戊辰의 장기 과제 위에 세운 ${annualTenGods[index] ?? "식신"} 흐름이 얹힙니다. 역할, 돈, 관계의 우선순위를 다시 잡아야 하는 해입니다.`,
        strategy:
          year === 2030
            ? "크게 벌리기보다 계약, 역할, 일정의 충돌 지점을 먼저 줄이세요."
            : "결과물을 만들되, 책임 범위와 회복 시간을 같이 잡으세요.",
      };
    }),
    cycleYearTimeline: Array.from({ length: 10 }, (_, index) => {
      const year = 2026 + index;
      const yearIndexInCycle = index + 1;
      const phase =
        yearIndexInCycle <= 3
          ? "early"
          : yearIndexInCycle <= 7
            ? "middle"
            : "late";

      return {
        year,
        ganji: ["丙午", "丁未", "戊申", "己酉", "庚戌", "辛亥", "壬子", "癸丑", "甲寅", "乙卯"][index] ?? "丙午",
        yearIndexInCycle,
        phase,
        headline: `${yearIndexInCycle}년차 현실 구조 조정`,
        roleOfYearInCycle:
          yearIndexInCycle === 1
            ? "새 대운 진입, 현실 구조를 다시 까는 해"
            : "반복되는 책임을 전략으로 바꾸는 해",
        plainInterpretation: `${year}년은 戊辰 대운의 ${yearIndexInCycle}년차로 돈, 역할, 생활 기준을 조정하는 해입니다.`,
        strategicFocus: "책임 범위와 비용 구조를 먼저 정리하기",
        whyItMatters:
          yearIndexInCycle === 1
            ? "첫해에 잡은 기준이 이후 10년 운영 방식으로 반복되기 쉽기 때문입니다."
            : "같은 현실 테마가 반복되며 장기 선택의 기준이 되기 때문입니다.",
      };
    }),
    finalAdvice: [
      {
        label: "일·성과",
        body: "프로젝트·보고·문서화는 중간 점검 기준을 먼저 잡아 두세요.",
      },
      {
        label: "돈·현실",
        body: "급여·생활비·정산·계약은 월초에 분리해 두세요.",
      },
      {
        label: "인간관계",
        body: "상사·동료·친구와의 연락은 요청 사항을 짧게 정리해 전달하세요.",
      },
      {
        label: "연애·가족",
        body: "연인·가족·부모와의 약속은 시간과 역할을 먼저 맞춰 두세요.",
      },
      {
        label: "학업·자격증",
        body: "자격증·업무 공부·포트폴리오는 결과물 단위로 쪼개서 남기세요.",
      },
      {
        label: "몸·생활 리듬",
        body: "수면·식사·회복 시간을 일정처럼 고정하세요.",
      },
    ],
    safetyNotes: [
      "이 리포트는 인생의 성공이나 실패를 단정하지 않습니다.",
      "대운은 장기 배경이며 실제 선택과 환경에 따라 체감이 달라질 수 있습니다.",
    ],
  };
}

function openAIResponse(rawText: string): Response {
  return new Response(JSON.stringify({ output_text: rawText }), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function assertStrictRequiredKeys(schema: unknown): void {
  if (!isRecord(schema)) {
    return;
  }

  if (isRecord(schema.properties)) {
    expect(Array.isArray(schema.required)).toBe(true);

    if (Array.isArray(schema.required)) {
      expect([...schema.required].sort()).toEqual(
        Object.keys(schema.properties).sort(),
      );
    }
  }

  for (const value of Object.values(schema)) {
    if (Array.isArray(value)) {
      value.forEach(assertStrictRequiredKeys);
      continue;
    }

    if (isRecord(value)) {
      assertStrictRequiredKeys(value);
    }
  }
}

describe("openaiMajorFortuneReportWriter", () => {
  it("does not call OpenAI when disabled", async () => {
    let called = false;

    await expect(
      generateMajorFortuneReportDraft({
        evidencePacket: buildPacket(),
        config: {
          enabled: false,
          apiKey: "sk-test",
          model: "test-model",
          fetchImpl: async () => {
            called = true;
            return openAIResponse("{}");
          },
        },
      }),
    ).rejects.toMatchObject({ code: "OPENAI_REPORT_WRITER_DISABLED" });
    expect(called).toBe(false);
  });

  it("uses a strict major_fortune_report_draft response format and validates the draft", async () => {
    const requests: unknown[] = [];
    const fetchImpl: typeof fetch = async (_url, init) => {
      requests.push(JSON.parse(String(init?.body)) as unknown);

      return openAIResponse(JSON.stringify(createValidDraft()));
    };
    const result = await generateMajorFortuneReportDraft({
      evidencePacket: buildPacket(),
      config: {
        enabled: true,
        apiKey: "sk-test",
        model: "test-model",
        fetchImpl,
      },
    });
    const requestText = JSON.stringify(requests[0]);

    expect(result.draft.productType).toBe("major_fortune");
    expect(result.draft.phaseTimeline).toHaveLength(3);
    expect(result.draft.finalAdvice).toHaveLength(6);
    expect(requestText).toContain(majorFortuneResponseFormatName);
    expect(requestText).toContain('"strict":true');
    expect(requestText).toContain('"schema"');
    expect(requestText).toContain("major_fortune");
    expect(requestText).toContain("lifeAreaSignals");
    expect(requestText).toContain("currentMajorFortune");
    expect(requestText).toContain("currentAnnualCross");
    expect(requestText).toContain("domainFlows");
    expect(requestText).toContain("bridgeEvidence");
    expect(requestText).toContain("mbtiBasis");
    expect(requestText).not.toContain("sk-test");
  });

  it("keeps the major draft json schema strict-compatible", () => {
    expect(majorFortuneReportDraftJsonSchema.properties.phaseTimeline.items.required).toEqual([
      "phase",
      "label",
      "headline",
      "body",
      "advice",
    ]);
    expect(majorFortuneReportDraftJsonSchema.properties.finalAdvice.items.required).toEqual([
      "label",
      "body",
    ]);
    expect(
      majorFortuneReportDraftJsonSchema.properties.cycleSummary.required,
    ).toContain("basisLabel");
    assertStrictRequiredKeys(majorFortuneReportDraftJsonSchema);
  });

  it("passes the evidence packet into the prompt", () => {
    const packet = buildPacket();
    const messages = buildOpenAIMajorFortuneReportWriterMessages({
      evidencePacket: packet,
    });
    const promptText = `${messages.system}\n${messages.developer}\n${messages.user}`;

    expect(promptText).toContain("Use only provided evidence");
    expect(promptText).toContain("Do not invent major fortune cycles");
    expect(promptText).toContain("10-year background");
    expect(promptText).toContain(packet.currentCycle.ganji);
    expect(promptText).toContain(packet.majorTenGod.stemTenGod);
    expect(promptText).toContain(packet.currentMajorFortune.ganji);
    expect(promptText).toContain(packet.currentAnnualCross.annualGanji);
    expect(promptText).toContain('"productKey": "daeun"');
    expect(promptText).toContain("MBTI는 명리 흐름의 원인이 아니다");
  });

  it("exposes safe diagnostics without leaking the API key", async () => {
    const fetchImpl: typeof fetch = async () =>
      new Response(
        JSON.stringify({
          error: {
            type: "invalid_request_error",
            code: "invalid_json_schema",
            message:
              "Invalid major schema. Authorization: Bearer sk-test OPENAI_API_KEY=sk-test",
            param: "text.format.schema",
          },
        }),
        {
          status: 400,
          headers: { "content-type": "application/json" },
        },
      );

    let caught: unknown;
    try {
      await generateMajorFortuneReportDraft({
        evidencePacket: buildPacket(),
        config: {
          enabled: true,
          apiKey: "sk-test",
          model: "test-model",
          fetchImpl,
        },
      });
    } catch (error) {
      caught = error;
    }

    expect(caught).toBeInstanceOf(MajorFortuneReportWriterFailure);
    expect(String(caught)).not.toContain("sk-test");
    expect(String(caught)).not.toContain("Authorization");
    expect(String(caught)).toContain("major_fortune_report_draft");
  });

  it("sanitizes major preview snapshots without requiring OpenAI", () => {
    const packet = buildPacket();
    const draft = {
      ...createValidDraft(),
      openingSummary:
        "반드시 성공합니다. debug evidence fixture precomputed 편관(편관, 압박과 책임)",
      cycleSummary: {
        ...createValidDraft().cycleSummary,
        basisLabel: "fixture_precomputed",
      },
    };
    const sanitized = sanitizeMajorFortunePreviewSnapshotPayload({
      evidencePacket: packet,
      draft,
    });
    const serialized = JSON.stringify(sanitized);

    expect(getMajorFortunePreviewSnapshotRelativePath("deokmin-current-major-fortune")).toContain(
      ".tmp/major-fortune-preview/deokmin-current-major-fortune-latest.json",
    );
    expect(serialized).not.toContain("반드시");
    expect(serialized).not.toContain("성공합니다");
    expect(serialized).not.toContain("debug");
    expect(serialized).not.toContain("편관(편관");
    expect(sanitized.draft.cycleSummary.basisLabel).toBe(
      "개발용 사전 계산 대운표 기준",
    );
    expect(sanitized.draft.calculationBasis.displayLabel).toBe(
      "입력된 대운표 기준",
    );
    expect(serialized).toContain("evidencePacket");
    expect(serialized).toContain("major_fortune");
  });
});
