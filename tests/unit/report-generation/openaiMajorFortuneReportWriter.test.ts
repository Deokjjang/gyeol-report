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
    openingTitle: "현재 대운 甲戌 흐름",
    openingSummary:
      "이 대운은 10년 동안 역할과 책임 기준을 다시 잡는 배경으로 체감될 수 있습니다.",
    coreLine:
      "甲戌 대운은 일과 현실 책임을 동시에 다루며 장기 방향을 다시 세우는 흐름입니다.",
    userContextSummary: {
      lifeStatusLabel: "직장인",
      fieldLabel: "개발·서비스 기획",
      translationNote:
        "개발·서비스 기획의 프로젝트, 문서화, 운영 책임 장면으로 번역했습니다.",
    },
    cycleSummary: {
      ganji: "甲戌",
      displayTitle: "현재 대운 甲戌",
      ageRangeLabel: "24세~33세",
      yearRangeLabel: "2023년~2032년",
      stemLabel: "甲 · 양목",
      branchLabel: "戌 · 양토",
      elementLabel: "목·토의 대운",
      tenGodLabel: "비견의 대운",
      basisLabel: "사전 계산된 대운표 기준",
    },
    flowIndexSummary: {
      flowIndex: 72,
      flowTypeLabel: "책임·구조 재편형",
      flowIndexCaution:
        "이 지표는 좋고 나쁨이 아니라 10년 동안 반복될 체감 강도를 보여 줍니다.",
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
        "甲戌은 목과 토가 함께 들어와 방향성과 현실 기준을 동시에 건드립니다.",
      tenGodExplanation:
        "비견: 자기 기준, 동등함, 경쟁과 공감이 장기 배경으로 반복됩니다.",
      elementEffectExplanation:
        "목은 방향을 세우고 토는 현실 책임을 무겁게 만들 수 있습니다.",
      branchInteractionExplanation:
        "卯戌 육합: 사람과 일정이 묶이며 실제 움직임이 생기기 쉽습니다.",
      transitionExplanation:
        "癸酉 대운에서 甲戌 대운으로 넘어오며 실행 기준이 중요해졌습니다.",
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
        year: 2024,
        ganji: "甲辰",
        headline: "대운 천간이 반복되는 해",
        body: "자기 기준과 현실 책임이 동시에 강해질 수 있습니다.",
        advice: "결정을 미루기보다 기준을 문서로 정리하세요.",
      },
      {
        year: 2025,
        ganji: "乙巳",
        headline: "목과 화가 이어지는 해",
        body: "대운 오행의 목 기운이 이어지고 화가 결과물을 밖으로 꺼내는 힘을 보탭니다.",
        advice: "작은 결과물부터 공개 가능한 형태로 남기세요.",
      },
      {
        year: 2026,
        ganji: "丙午",
        headline: "표현과 실행이 강해지는 해",
        body: "대운 지지와 원국 지지 작용 위에 표현과 실행의 오행이 강해질 수 있습니다.",
        advice: "마감 전 중간 점검 기준을 두세요.",
      },
    ],
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
    expect(serialized).toContain("evidencePacket");
    expect(serialized).toContain("major_fortune");
  });
});
