import { describe, expect, it } from "vitest";

import { buildAnnualFortuneEvidence } from "../../../src/lib/report-knowledge/annualFortuneEvidence";
import {
  requireAnnualFortuneFixture,
} from "../../../src/lib/report-knowledge/annualFortuneFixtures";
import {
  annualFortuneReportDraftJsonSchema,
  type AnnualFortuneReportDraft,
} from "../../../src/lib/report-generation/annualFortuneReportDraftTypes";
import {
  AnnualFortuneReportWriterFailure,
  annualFortuneResponseFormatName,
  generateAnnualFortuneReportDraft,
} from "../../../src/lib/report-generation/openaiAnnualFortuneReportWriter";
import {
  buildOpenAIAnnualFortuneReportWriterMessages,
} from "../../../src/lib/report-generation/openaiAnnualFortuneReportWriterPrompt";
import {
  getAnnualFortunePreviewSnapshotRelativePath,
  sanitizeAnnualFortunePreviewSnapshotPayload,
} from "../../../src/lib/report-generation/annualFortunePreviewSnapshot";

function buildPacket() {
  const fixture = requireAnnualFortuneFixture("deokmin-2026-current");

  return buildAnnualFortuneEvidence({
    targetYear: fixture.targetYear,
    currentDate: new Date(`${fixture.currentDate}T00:00:00+09:00`),
    person: fixture.person,
  });
}

function createValidDraft(): AnnualFortuneReportDraft {
  return {
    version: "v1",
    productType: "annual_fortune",
    productVersion: "v1",
    targetYear: 2026,
    mode: "current_year",
    personLabel: "덕민",
    userContextSummary: {
      lifeStatusLabel: "직장인",
      fieldLabel: "개발·서비스 기획",
      translationNote:
        "올해 흐름은 직장·프로젝트·보고·서비스 운영 장면을 중심으로 번역했습니다.",
    },
    openingTitle: "2026년 세운 흐름",
    openingSummary: "올해 준비와 활용, 기회와 조심할 지점을 봅니다.",
    coreLine: "丙午의 화 기운이 표현과 실행을 밀어 올리는 흐름입니다.",
    yearSummary: {
      ganji: "丙午",
      displayTitle: "2026년 丙午",
      elementLabel: "화의 해",
      tenGodLabel: "식신의 해",
      modeLabel: "올해 흐름",
      yearTone: "올해 흐름을 쓰는 방식이 중요합니다.",
    },
    scoreSummary: {
      flowIndex: 72,
      flowTypeLabel: "출력·현실압 동시 상승형",
      flowIndexCaution: "흐름 지표는 결과를 단정하지 않고 조율할 지점을 보여 줍니다.",
    },
    flowCards: [
      {
        label: "일·성과",
        score: 78,
        headline: "결과물을 밖으로 꺼내기 쉽습니다.",
        body: "직장이나 작업에서 보여 줄 결과가 생기기 쉽습니다.",
      },
    ],
    keySignals: [
      {
        type: "opportunity",
        title: "표현 기회",
        body: "말과 결과물이 밖으로 나오는 장면이 생길 수 있습니다.",
        evidenceLabel: "식신",
      },
    ],
    annualStructure: {
      ganjiExplanation: "丙午는 화의 기운이 강하게 들어오는 해입니다.",
      tenGodExplanation: "식신은 결과물을 꾸준히 밖으로 꺼내는 기운입니다.",
      elementEffectExplanation: "화 부족을 채우지만 토 책임도 같이 무거워질 수 있습니다.",
      branchInteractionExplanation: "午未 육합은 생활 리듬에 약속과 움직임을 만듭니다.",
    },
    chapters: Array.from({ length: 6 }, (_, index) => ({
      title: `흐름 ${index + 1}`,
      headline: "생활 장면으로 확인되는 흐름입니다.",
      body: "직장, 돈, 가족 중 한 영역에서 내가 정리해야 하는 역할이 강해졌을 가능성이 큽니다.",
      likelyScenes: [
        "맡은 일을 결과물로 정리해야 하는 장면입니다.",
        "일정과 돈의 기준을 다시 세우는 장면입니다.",
      ],
      practicalAdvice: [
        "큰 결정을 바로 확정하지 말고 근거를 한 번 더 확인하세요.",
        "책임이 몰리면 역할과 마감 기준을 문장으로 남기세요.",
      ],
    })),
    monthlyFlow: Array.from({ length: 12 }, (_, index) => ({
      month: index + 1,
      label: `${index + 1}월`,
      headline: "흐름을 확인하는 달입니다.",
      monthGanji: "甲子",
      monthlyBasis: "달력월 기준 운영 가이드",
      elementFocus: "화",
      natalInteractionSummary: "화 부족 보완 / 토 과다 자극 / 뚜렷한 지지 충·합·해는 약함",
      body: "일과 생활의 리듬을 같이 확인해야 합니다.",
      advice: "무리한 확정보다 기준 정리를 먼저 하세요.",
    })),
    finalAdvice: [
      "일정과 책임을 한 문장으로 정리하세요.",
      "돈과 기록은 미루지 말고 같은 날 확인하세요.",
      "몸의 리듬이 무너지면 약속을 줄이세요.",
      "결과를 내야 하는 일은 작은 단위로 쪼개세요.",
    ],
    safetyNotes: [
      "이 리포트는 결과를 단정하지 않습니다.",
      "입력되지 않았거나 확실하지 않은 정보는 제한적으로만 반영했습니다.",
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

describe("openaiAnnualFortuneReportWriter", () => {
  it("does not call OpenAI when disabled", async () => {
    let called = false;

    await expect(
      generateAnnualFortuneReportDraft({
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

  it("uses a strict annual_fortune_report_draft response format and validates the draft", async () => {
    const requests: unknown[] = [];
    const fetchImpl: typeof fetch = async (_url, init) => {
      requests.push(JSON.parse(String(init?.body)) as unknown);

      return openAIResponse(JSON.stringify(createValidDraft()));
    };
    const result = await generateAnnualFortuneReportDraft({
      evidencePacket: buildPacket(),
      config: {
        enabled: true,
        apiKey: "sk-test",
        model: "test-model",
        fetchImpl,
      },
    });
    const requestText = JSON.stringify(requests[0]);

    expect(result.draft.productType).toBe("annual_fortune");
    expect(result.draft.monthlyFlow).toHaveLength(12);
    expect(requestText).toContain(annualFortuneResponseFormatName);
    expect(requestText).toContain('"strict":true');
    expect(requestText).toContain('"schema"');
    expect(requestText).toContain("annual_fortune");
    expect(requestText).toContain("lifeAreaSignals");
    expect(requestText).not.toContain("sk-test");
  });

  it("keeps the annual draft json schema strict-compatible", () => {
    const monthlyFlowSchema =
      annualFortuneReportDraftJsonSchema.properties.monthlyFlow.items;

    expect(monthlyFlowSchema.required).toEqual([
      "month",
      "label",
      "headline",
      "monthGanji",
      "monthlyBasis",
      "elementFocus",
      "natalInteractionSummary",
      "body",
      "advice",
    ]);
    expect(monthlyFlowSchema.properties.monthGanji.type).toEqual([
      "string",
      "null",
    ]);
    expect(monthlyFlowSchema.properties.monthlyBasis.type).toEqual([
      "string",
      "null",
    ]);
    expect(monthlyFlowSchema.properties.elementFocus.type).toEqual([
      "string",
      "null",
    ]);
    expect(monthlyFlowSchema.properties.natalInteractionSummary.type).toEqual([
      "string",
      "null",
    ]);
    expect(
      annualFortuneReportDraftJsonSchema.properties.scoreSummary.required,
    ).toEqual(["flowIndex", "flowTypeLabel", "flowIndexCaution"]);
    expect(
      annualFortuneReportDraftJsonSchema.required,
    ).toContain("userContextSummary");
    assertStrictRequiredKeys(annualFortuneReportDraftJsonSchema);
  });

  it("passes the evidence packet into the prompt", () => {
    const packet = buildPacket();
    const messages = buildOpenAIAnnualFortuneReportWriterMessages({
      evidencePacket: packet,
    });
    const promptText = `${messages.system}\n${messages.developer}\n${messages.user}`;

    expect(promptText).toContain("Use only provided evidence");
    expect(promptText).toContain("Do not change calculation results");
    expect(promptText).toContain(String(packet.targetYear));
    expect(promptText).toContain(packet.annualGanji.ganji);
    expect(promptText).toContain(packet.annualTenGod.stemTenGod);
  });

  it("exposes safe diagnostics without leaking the API key", async () => {
    const fetchImpl: typeof fetch = async () =>
      new Response(
        JSON.stringify({
          error: {
            type: "invalid_request_error",
            code: "invalid_json_schema",
            message:
              "Invalid annual schema. Authorization: Bearer sk-test OPENAI_API_KEY=sk-test",
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
      await generateAnnualFortuneReportDraft({
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

    expect(caught).toBeInstanceOf(AnnualFortuneReportWriterFailure);
    expect(String(caught)).not.toContain("sk-test");
    expect(String(caught)).not.toContain("Authorization");
    expect(String(caught)).toContain("annual_fortune_report_draft");
  });

  it("sanitizes annual preview snapshots without requiring OpenAI", () => {
    const packet = buildPacket();
    const draft = {
      ...createValidDraft(),
      openingSummary:
        "올해 반드시 승진합니다. debug evidence 식신(식신, 결과물·표현·생산성)",
      monthlyFlow: createValidDraft().monthlyFlow.map((flow) => ({
        ...flow,
        monthlyBasis: "calendar_month_approximation",
      })),
    };
    const sanitized = sanitizeAnnualFortunePreviewSnapshotPayload({
      evidencePacket: packet,
      draft,
    });
    const serialized = JSON.stringify(sanitized);

    expect(getAnnualFortunePreviewSnapshotRelativePath("deokmin-2026-current")).toContain(
      ".tmp/annual-fortune-preview/deokmin-2026-current-latest.json",
    );
    expect(serialized).not.toContain("반드시");
    expect(serialized).not.toContain("승진합니다");
    expect(serialized).not.toContain("debug");
    expect(serialized).not.toContain("식신(식신");
    expect(serialized).not.toContain('"monthlyBasis":"calendar_month_approximation"');
    expect(serialized).toContain("달력월 기준 운영 가이드");
    expect(serialized).toContain("evidencePacket");
    expect(serialized).toContain("annual_fortune");
  });
});
