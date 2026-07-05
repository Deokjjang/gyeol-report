import { describe, expect, it, vi } from "vitest";

import type {
  LoveMarriageChildReportDraft,
} from "../../../src/lib/report-generation/loveMarriageChildReportDraftTypes";
import {
  generateLoveMarriageChildReportDraft,
  LoveMarriageChildReportWriterFailure,
  loveMarriageChildResponseFormatName,
} from "../../../src/lib/report-generation/openaiLoveMarriageChildReportWriter";
import {
  buildLoveMarriageChildReportEvidence,
} from "../../../src/lib/report-knowledge/loveMarriageChildReportEvidence";

function buildPacket() {
  return buildLoveMarriageChildReportEvidence({
    name: "덕민",
    gender: "male",
    mbtiType: "ENTJ",
    relationshipStatus: "single",
    saju: {
      dayPillar: "甲申",
      labels: [
        "편재",
        "정재",
        "정관",
        "편관",
        "현침살",
        "화개살",
        "천을귀인",
        "甲己합",
      ],
    },
  });
}

function textSection(
  overrides: Partial<LoveMarriageChildReportDraft["loveStyle"]> = {},
): LoveMarriageChildReportDraft["loveStyle"] {
  return {
    headline: "기준이 선명한 관계에서 안정되는 타입",
    body:
      "당신은 애매한 호감보다 약속, 생활 기준, 감정 처리 방식이 정리된 관계에서 안정됩니다.",
    keyPoints: ["기준", "책임", "표현"],
    caution: "말이 빨라질 때 상대가 압박으로 받아들일 수 있습니다.",
    ...overrides,
  };
}

function patternSection(
  overrides: Partial<LoveMarriageChildReportDraft["attractionPattern"]> = {},
): LoveMarriageChildReportDraft["attractionPattern"] {
  return {
    ...textSection(),
    repeatedPattern: ["상대의 태도와 책임감을 빠르게 봅니다."],
    betterUse: ["초반부터 관계 기준을 부드럽게 확인합니다."],
    ...overrides,
  };
}

function createDraft(): LoveMarriageChildReportDraft {
  return {
    version: "v1",
    productType: "love_marriage_child",
    productVersion: "v1",
    personLabel: "덕민",
    headline: "기준과 책임이 선명할수록 안정되는 관계 구조",
    openingSummary:
      "연애, 결혼, 부모 역할을 반복 패턴과 관계 운영 기준으로 해석한 리포트입니다.",
    loveStyle: textSection(),
    attractionPattern: patternSection(),
    loveStrengths: textSection({
      headline: "관계의 방향을 빠르게 정리하는 힘",
      body: "좋아하는 마음을 약속과 행동 기준으로 옮길 때 강점이 살아납니다.",
    }),
    loveFriction: patternSection({
      headline: "말이 날카로워지는 순간",
      body: "정확한 피드백이 관계에서는 공격처럼 들릴 수 있어 속도 조절이 필요합니다.",
    }),
    marriageRhythm: textSection({
      headline: "역할과 생활 기준이 맞을 때 편해지는 결혼 리듬",
      body: "가사, 돈, 시간 사용 기준을 미리 맞추면 관계 피로가 줄어듭니다.",
    }),
    householdMoneyAndRoleSplit: textSection({
      headline: "돈과 역할은 말보다 기준으로 정리",
      body: "공동비, 개인비, 책임 범위를 문서나 숫자로 맞추는 방식이 안정적입니다.",
    }),
    conflictRecovery: textSection({
      headline: "감정이 커지기 전 기준을 다시 맞추기",
      body: "상대 성격을 단정하지 않고 상황, 말투, 생활 기준을 분리합니다.",
    }),
    parentMode: {
      ...textSection({
        headline: "부모가 되었을 때 기준과 루틴을 세우는 방식",
        body: "당신은 생활 기준, 공부 습관, 약속을 잡아주는 역할에 강합니다.",
      }),
      parentingRolePattern: ["생활 기준을 세우고 반복 루틴을 잡아줍니다."],
      avoidProjection: ["내 기준을 아이의 감정까지 밀어붙이지 않습니다."],
    },
    breakupReunionPattern: {
      ...textSection({
        headline: "관계 정리와 회복은 내 반복 패턴부터 봅니다",
        body: "감정이 커질수록 내가 반복하는 말투와 회피 방식을 먼저 확인합니다.",
      }),
      myLoop: ["상대의 태도 변화를 빠르게 평가합니다."],
      emotionalProcessing: ["감정을 결론으로 바꾸기 전에 말로 정리합니다."],
      repairBoundary: ["회복 가능한 기준과 멈춰야 할 기준을 구분합니다."],
    },
    relationshipTimingHints: [
      {
        label: "관계 점검",
        headline: "감정이 커지기 전 기준을 맞춥니다",
        body: "갈등 신호는 결론이 아니라 말투와 속도를 조율하라는 기준입니다.",
        push: ["생활 기준 정리", "대화 기록"],
        avoid: ["상대 단정", "결론 서두르기"],
      },
    ],
    actionPlan: [
      "연애",
      "결혼",
      "갈등 회복",
      "부모 역할",
      "관계 정리",
      "생활 리듬",
    ].map((label) => ({
      label: label as LoveMarriageChildReportDraft["actionPlan"][number]["label"],
      headline: `${label} 기준`,
      body: "바로 실행할 수 있는 관계 기준입니다.",
      firstAction: "오늘 한 문장으로 정리합니다.",
    })),
    riskManagement: [
      {
        title: "기준이 압박으로 들리는 위험",
        body: "빠른 판단이 상대에게는 평가처럼 들릴 수 있습니다.",
        prevention: "요청과 판단을 분리해 말합니다.",
      },
    ],
    safetyNotes: [
      "이 리포트는 관계 성향과 반복 패턴을 해석한 참고용입니다.",
      "결과를 단정하지 않고 선택과 대화 기준을 정리합니다.",
    ],
  };
}

describe("openaiLoveMarriageChildReportWriter", () => {
  it("does not call OpenAI when disabled", async () => {
    const fetchImpl = vi.fn<typeof fetch>();

    await expect(
      generateLoveMarriageChildReportDraft({
        evidencePacket: buildPacket(),
        config: {
          enabled: false,
          apiKey: "",
          model: "",
          fetchImpl,
        },
      }),
    ).rejects.toMatchObject({
      code: "OPENAI_REPORT_WRITER_DISABLED",
    });
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("builds prompt messages, calls mocked OpenAI, and returns validated draft", async () => {
    const fetchImpl = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(
        JSON.stringify({
          output_text: JSON.stringify(createDraft()),
        }),
        {
          status: 200,
          headers: { "content-type": "application/json" },
        },
      ),
    );

    const result = await generateLoveMarriageChildReportDraft({
      evidencePacket: buildPacket(),
      config: {
        enabled: true,
        apiKey: "sk-test-secret",
        model: "test-model",
        fetchImpl,
      },
    });
    const request = JSON.parse(
      fetchImpl.mock.calls[0]?.[1]?.body as string,
    ) as {
      readonly text: {
        readonly format: {
          readonly name: string;
          readonly strict: boolean;
        };
      };
      readonly input: readonly { readonly role: string; readonly content: string }[];
    };

    expect(result.model).toBe("test-model");
    expect(result.draft.productType).toBe("love_marriage_child");
    expect(result.draft.personLabel).toBe("덕민");
    expect(request.text.format.name).toBe(loveMarriageChildResponseFormatName);
    expect(request.text.format.strict).toBe(true);
    expect(request.input.map((message) => message.role)).toEqual([
      "system",
      "developer",
      "user",
    ]);
    expect(request.input[2]?.content).toContain('"productType": "love_marriage_child"');
    expect(request.input[2]?.content).toContain('"bridgeEvidence"');
  });

  it("fails through validator when returned draft contains forbidden claims", async () => {
    const invalidDraft = {
      ...createDraft(),
      openingSummary: "당신은 반드시 결혼하고 상대가 돌아온다.",
    };
    const fetchImpl = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(
        JSON.stringify({
          output_text: JSON.stringify(invalidDraft),
        }),
        {
          status: 200,
          headers: { "content-type": "application/json" },
        },
      ),
    );

    await expect(
      generateLoveMarriageChildReportDraft({
        evidencePacket: buildPacket(),
        config: {
          enabled: true,
          apiKey: "sk-test-secret",
          model: "test-model",
          fetchImpl,
        },
      }),
    ).rejects.toMatchObject({
      code: "OPENAI_LOVE_MARRIAGE_CHILD_REPORT_WRITER_VALIDATION_FAILED",
      validationErrors: expect.arrayContaining([
        "LOVE_MARRIAGE_CHILD_REPORT_FORBIDDEN_EXPRESSION",
      ]),
    });
  });

  it("diagnostics do not expose API key or bearer token", () => {
    const failure = new LoveMarriageChildReportWriterFailure({
      code: "OPENAI_LOVE_MARRIAGE_CHILD_REPORT_WRITER_REQUEST_FAILED",
      diagnostics: {
        responseFormatName: loveMarriageChildResponseFormatName,
        diagnosticMessage:
          "Authorization: Bearer sk-test-secret OPENAI_API_KEY=sk-test-secret",
      },
    });

    expect(failure.message).not.toContain("sk-test-secret");
    expect(failure.message).not.toContain("OPENAI_API_KEY=sk-test-secret");
    expect(failure.message).toContain("[redacted-auth]");
  });

  it("does not make real network calls in tests", async () => {
    const fetchImpl = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(
        JSON.stringify({
          output_text: JSON.stringify(createDraft()),
        }),
        {
          status: 200,
          headers: { "content-type": "application/json" },
        },
      ),
    );

    await generateLoveMarriageChildReportDraft({
      evidencePacket: buildPacket(),
      config: {
        enabled: true,
        apiKey: "sk-test-secret",
        model: "test-model",
        fetchImpl,
      },
    });

    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });
});
