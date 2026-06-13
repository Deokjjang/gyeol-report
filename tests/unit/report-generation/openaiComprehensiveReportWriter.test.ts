import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import {
  generateComprehensiveReportDraft,
  isSafeReportGenerationError,
} from "../../../src/lib/report-generation/openaiComprehensiveReportWriter";
import type {
  ComprehensiveReportV2ChapterId,
  ComprehensiveReportV2NarrativeDraft,
} from "../../../src/lib/report-generation/comprehensiveReportDraftTypes";
import { buildComprehensiveReportEvidencePacketFromComputedFacts } from "../../../src/lib/report-knowledge/comprehensiveReportEvidenceInputBuilder";
import type { ComputedSajuFacts } from "../../../src/lib/report-knowledge/sajuComputedFactsTypes";

const deokminSampleFacts = {
  dayMaster: "갑",
  dayPillar: "갑신",
  fiveElementCounts: {
    wood: 2,
    fire: 0,
    earth: 4,
    metal: 2,
    water: 0,
  },
  excessiveElements: ["earth"],
  missingElements: ["fire", "water"],
  usefulElements: ["water", "wood"],
  tenGodSignals: [
    { tenGod: "pian_cai", strength: "strong" },
    { tenGod: "zheng_cai", strength: "present" },
    { tenGod: "zheng_guan", strength: "strong" },
    { tenGod: "qi_sha", strength: "strong" },
  ],
  specialPatterns: ["jaeda_sinyak", "no_resource", "no_output"],
  sinsal: ["hyeonchim", "hongyeom"],
  gwiin: ["jaego"],
} as const satisfies ComputedSajuFacts;

function createChapter(chapterId: ComprehensiveReportV2ChapterId, titleKo: string) {
  const topicExtra =
    chapterId === "work_money_study"
      ? "공부/일 루틴은 자격증, 전문서, 직무 학습, 사업 학습을 2주 단위 목표로 쪼개는 방식이 맞습니다. 돈은 공격 계획과 방어 계획을 분리해야 하며, 현금흐름과 투자와 자기계발 예산을 따로 보아야 합니다."
      : chapterId === "love_relationships"
        ? "관계에서 써먹을 것은 보완하는 사람을 고르는 기준입니다. 부족한 수와 화를 채우듯 정서적 완충이 되고 감정 표현을 부드럽게 풀어주는 사람이 맞는 사람일 수 있습니다. 피해야 할 패턴은 감정 기복이 크고 책임이 흐릿한 사람입니다. ISFP, INFP, INTP 같은 예시는 참고만 하고 MBTI만으로 단정하지 않는 태도가 필요합니다."
      : chapterId === "risk_and_growth"
        ? "피해야 할 패턴은 계속 버티기만 하다가 과열되는 흐름입니다. 수 부족은 밤 산책, 수변 공간, 충분한 수분, 기록, 잠 루틴으로 식히고, 화 부족은 햇빛, 가벼운 운동, 발표와 표현 연습으로 밖으로 내야 합니다. 토 과다는 책임 덜어내기와 경계선 정리하기로 조절해야 합니다."
      : `${titleKo}에 맞는 환경은 기준을 세우고 빠르게 실행할 수 있는 곳입니다. ${titleKo}에서 피해야 할 패턴은 결론만 던지고 상대의 속도를 보지 않는 흐름이므로, 질문을 먼저 넣는 처방이 필요합니다.`;

  return {
    chapterId,
    titleKo,
    headline: `${titleKo}는 갑목과 갑신일주를 먼저 놓고 읽습니다.`,
    body:
      `${titleKo}에서는 갑목과 갑신일주를 1차 근거로 삼고 ENTJ는 보조 근거로 연결합니다. 덕민님, ${titleKo}에서 상대가 아직 고민 중인데 이미 답이 보이는 상황 많지 않나요? ${titleKo}의 갑목은 방향을 세우고 앞으로 밀고 가려는 힘이라서 결론을 빠르게 잡는 모습으로 나타납니다. ${titleKo}에서 갑신일주는 압박 속에서도 기준을 지키려는 구조라서, 같은 구조라도 일과 관계와 돈에서는 전혀 다른 장면으로 드러납니다. 그래서 ${titleKo}의 조언은 막연한 위로보다 무엇을 기준으로 삼고 어디서 힘을 뺄지 정하는 쪽이어야 합니다. 이렇게 쓰면 좋습니다. ${titleKo}에서는 결론을 바로 말하기 전에 질문을 하나 넣는 루틴을 두어야 합니다. ${titleKo}은 용어를 나열하는 칸이 아니라 실제 선택과 말투와 돈 쓰는 방식으로 사주 구조를 읽는 챕터입니다. ${titleKo}의 본문은 사용자가 하루 중 어떤 순간에 강해지고 어떤 순간에 과열되는지 떠올릴 수 있게 충분히 길고 구체적으로 이어져야 합니다. ${topicExtra}`,
    keyPhrases: [titleKo, "갑목", "갑신일주"],
    sajuTermsUsed: ["갑목", "갑신일주"],
    mbtiTermsUsed: ["ENTJ"],
  };
}

function createValidDraft(): ComprehensiveReportV2NarrativeDraft {
  return {
    version: "comprehensive_v2_draft",
    productType: "saju_mbti_full",
    openingTitle: "사주가 먼저 보이는 종합 리포트",
    openingSummary:
      "사주 원국의 구조를 먼저 놓고 MBTI는 체감되는 자기상을 보조로 연결합니다.",
    coreLine: "갑목 구조와 ENTJ 성향이 성취 쪽에서 만납니다.",
    chapters: [
      createChapter("opening", "처음에 보이는 결"),
      createChapter("saju_identity", "사주가 보여주는 기본 형상"),
      createChapter("personality_pattern", "성격과 판단 패턴"),
      createChapter("work_money_study", "일, 돈, 공부가 연결되는 방식"),
      createChapter("love_relationships", "연애와 관계의 온도"),
      createChapter("people_family_environment", "사람, 가족, 환경"),
      createChapter("risk_and_growth", "반복되는 리스크와 성장법"),
      createChapter("final_message", "마지막으로 남길 말"),
    ],
    finalAdvice:
      "성과를 밀어붙이는 힘은 살리되, 휴식과 감정 표현은 의식적으로 보완해 주세요.",
    safetyNotes: ["자기이해용 참고 콘텐츠입니다."],
  };
}

function createPacket() {
  return buildComprehensiveReportEvidencePacketFromComputedFacts({
    mbtiType: "ENTJ",
    sajuFacts: deokminSampleFacts,
  }).packet;
}

function createJsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status });
}

async function expectSafeGenerationFailure(
  promise: Promise<unknown>,
): Promise<ReturnType<typeof expectSafeError>> {
  try {
    await promise;
  } catch (error) {
    return expectSafeError(error);
  }

  throw new Error("Expected safe report generation failure.");
}

function expectSafeError(error: unknown) {
  expect(isSafeReportGenerationError(error)).toBe(true);

  if (!isSafeReportGenerationError(error)) {
    throw new Error("Expected safe report generation error.");
  }

  return error;
}

describe("OpenAI comprehensive report writer", () => {
  it("builds prompt parses JSON validates draft and returns raw text", async () => {
    const baseDraft = createValidDraft();
    const modelDraft = {
      ...baseDraft,
      chapters: baseDraft.chapters.map((chapter) =>
        chapter.chapterId === "work_money_study"
          ? {
              ...chapter,
              body:
                "갑목과 갑신일주를 1차 근거로 삼고 재고귀인은 자산화 흐름으로만 연결합니다. 갑목은 돈을 단순히 모으는 것보다 방향과 판을 키우려는 힘으로 나타납니다. 갑신일주는 압박이 걸릴수록 기준을 세우는 구조라서, 재고귀인과 만나면 성과를 문서화하고 묶어두는 방식으로 현실화됩니다. ENTJ는 이 흐름을 보조하는 성취 감각입니다. 공부는 자격증, 전문서, 직무 학습, 사업 학습처럼 성과로 바뀌는 지식일 때 오래 갑니다. 돈은 감정적 안정감보다 통제 가능한 판을 확보하는 문제로 느껴지기 쉽습니다. 이 챕터에서는 일하는 방식, 돈을 버는 방식, 지식을 쌓아 실력으로 바꾸는 방식을 하나의 성과 루틴으로 연결해 설명합니다. 과열될 때는 쉬는 시간을 낭비가 아니라 판단력을 유지하는 장치로 넣어야 오래 갑니다. 재고귀인이 말하는 자산화는 단순히 돈을 아끼라는 뜻이 아니라, 성과가 흩어지지 않게 기록하고 묶고 다시 굴릴 수 있는 형태로 만드는 감각입니다. 그래서 이 장에서는 직무 학습과 사업 학습, 자격증과 실전 경험이 결국 같은 판에서 연결된다는 점까지 풀어야 합니다.",
              sajuTermsUsed: ["갑목", "갑신일주", "재고귀인"],
            }
          : chapter,
      ),
    };
    const calls: RequestInit[] = [];
    const fetchImpl: typeof fetch = async (_input, init) => {
      if (init !== undefined) {
        calls.push(init);
      }
      return createJsonResponse({
        output_text: JSON.stringify(modelDraft),
      });
    };

    const result = await generateComprehensiveReportDraft({
      userDisplayName: "덕민",
      mbtiType: "ENTJ",
      evidencePacket: createPacket(),
      config: {
        apiKey: "test_key",
        model: "test_model",
        enabled: true,
        fetchImpl,
      },
    });

    expect(result.draft).toMatchObject(modelDraft);
    expect(result.draft).toMatchObject({
      profileTable: {
        dayMaster: "갑목",
        dayPillar: "갑신일주",
        missingElements: expect.arrayContaining(["화 부족", "수 부족"]),
        excessiveElements: expect.arrayContaining(["토 과다"]),
        tenGodSummary: expect.arrayContaining(["편재", "정재", "정관", "편관"]),
        sinsal: expect.arrayContaining(["현침살", "홍염살"]),
        gwiin: expect.arrayContaining(["재고귀인"]),
        mbti: "ENTJ",
      },
    });
    expect(result.rawText).toBe(JSON.stringify(modelDraft));
    expect(result.warnings).toEqual([]);
    expect(JSON.stringify(calls[0].body)).toContain("사주가 1차 근거");
    expect(JSON.stringify(calls[0].body)).toContain(
      "이번 리포트에서 사용할 수 있는 사주 용어",
    );
    const requestBody = JSON.parse(String(calls[0].body)) as {
      readonly text?: {
        readonly format?: {
          readonly schema?: unknown;
        };
      };
    };
    const responseFormatSchema = JSON.stringify(requestBody.text?.format?.schema);

    expect(JSON.stringify(calls[0].body)).toContain("재고귀인");
    expect(JSON.stringify(calls[0].body)).not.toContain("천을귀인");
    expect(responseFormatSchema).not.toContain("profileTable");
    expect(responseFormatSchema).not.toContain("yearPillar");
    expect(JSON.stringify(calls[0].body)).toContain("day_master_gabmok");
  });

  it("rejects invalid JSON responses", async () => {
    const error = await expectSafeGenerationFailure(
      generateComprehensiveReportDraft({
        mbtiType: "ENTJ",
        evidencePacket: createPacket(),
        config: {
          apiKey: "test_key",
          model: "test_model",
          enabled: true,
          fetchImpl: async () => createJsonResponse({ output_text: "not json" }),
        },
      }),
    );

    expect(error.code).toBe("OPENAI_REPORT_WRITER_INVALID_JSON");
    expect(error.stage).toBe("json_parse");
    expect(error.validationErrors).toEqual(["JSON_PARSE_FAILED"]);
  });

  it("exposes OpenAI request failures as openai stage", async () => {
    const error = await expectSafeGenerationFailure(
      generateComprehensiveReportDraft({
        mbtiType: "ENTJ",
        evidencePacket: createPacket(),
        config: {
          apiKey: "test_key",
          model: "test_model",
          enabled: true,
          fetchImpl: async () =>
            new Response(
              JSON.stringify({
                error: {
                  type: "invalid_request_error",
                  code: "schema_invalid",
                  message: "Response format schema is invalid.",
                  param: "text.format.schema",
                },
                request_id: "req_body_123",
              }),
              {
                status: 400,
                headers: {
                  "content-type": "application/json",
                  "x-request-id": "req_header_123",
                },
              },
            ),
        },
      }),
    );

    expect(error.code).toBe("OPENAI_REPORT_WRITER_REQUEST_FAILED");
    expect(error.stage).toBe("openai");
    expect(error.status).toBe(400);
    expect(error.errorType).toBe("invalid_request_error");
    expect(error.errorCode).toBe("schema_invalid");
    expect(error.diagnosticMessage).toBe("Response format schema is invalid.");
    expect(error.errorParam).toBe("text.format.schema");
    expect(error.requestId).toBe("req_header_123");
    expect(JSON.stringify(error)).not.toContain("test_key");
  });

  it("rejects unsafe draft JSON", async () => {
    const draft = {
      ...createValidDraft(),
      finalAdvice: "이 구조는 " + "절대 " + "성공한다",
    };

    const error = await expectSafeGenerationFailure(
      generateComprehensiveReportDraft({
        mbtiType: "ENTJ",
        evidencePacket: createPacket(),
        config: {
          apiKey: "test_key",
          model: "test_model",
          enabled: true,
          fetchImpl: async () =>
            createJsonResponse({
              output_text: JSON.stringify(draft),
            }),
        },
      }),
    );

    expect(error.code).toBe("OPENAI_REPORT_WRITER_INVALID_JSON");
    expect(error.stage).toBe("draft_validation");
    expect(error.validationErrors?.join("\n")).toContain(
      "FORBIDDEN_PROPHECY_PHRASE",
    );
  });

  it("rejects unsupported Saju terms outside the evidence packet", async () => {
    const draft = {
      ...createValidDraft(),
      chapters: createValidDraft().chapters.map((chapter) =>
        chapter.chapterId === "love_relationships"
          ? {
              ...chapter,
              body:
                "갑목과 갑신일주를 먼저 보면서 도화살과 반안살까지 있다고 쓰면 evidence 밖의 사주 용어가 섞입니다.",
            }
          : chapter,
      ),
    };

    const error = await expectSafeGenerationFailure(
      generateComprehensiveReportDraft({
        mbtiType: "ENTJ",
        evidencePacket: createPacket(),
        config: {
          apiKey: "test_key",
          model: "test_model",
          enabled: true,
          fetchImpl: async () =>
            createJsonResponse({
              output_text: JSON.stringify(draft),
            }),
        },
      }),
    );

    expect(error.stage).toBe("draft_validation");
    expect(error.validationErrors?.join("\n")).toContain(
      "UNSUPPORTED_SAJU_TERM",
    );
  });

  it("rejects internal meta copy from model output", async () => {
    const draft = {
      ...createValidDraft(),
      openingSummary: "검증된 JSON으로 저장되는 내부 문장입니다.",
    };

    const error = await expectSafeGenerationFailure(
      generateComprehensiveReportDraft({
        mbtiType: "ENTJ",
        evidencePacket: createPacket(),
        config: {
          apiKey: "test_key",
          model: "test_model",
          enabled: true,
          fetchImpl: async () =>
            createJsonResponse({
              output_text: JSON.stringify(draft),
            }),
        },
      }),
    );

    expect(error.stage).toBe("draft_validation");
    expect(error.validationErrors?.join("\n")).toContain("INTERNAL_META_COPY");
  });

  it("does not include DB save payment or result render wiring in source", () => {
    const source = readFileSync(
      join(process.cwd(), "src/lib/report-generation/openaiComprehensiveReportWriter.ts"),
      "utf8",
    );
    const blockedMarkers = [
      "supabase",
      "payment",
      "reportId",
      "insert(",
      "update(",
      "fetch(\"/api/",
    ];

    for (const marker of blockedMarkers) {
      expect(source).not.toContain(marker);
    }
  });
});
