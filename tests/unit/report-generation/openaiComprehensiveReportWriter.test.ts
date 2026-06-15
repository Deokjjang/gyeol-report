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
        ? "관계에서 써먹을 것은 보완하는 사람을 고르는 기준입니다. 부족한 수와 화를 채우듯 정서적 완충이 되고 감정 표현을 부드럽게 풀어주는 사람이 맞는 사람일 수 있습니다. 피해야 할 패턴은 감정 기복이 크고 책임이 흐릿한 사람입니다. MBTI 관계 기준은 감정을 천천히 풀어주고 생활 리듬과 책임감이 안정적인 성향을 보되 MBTI만으로 단정하지 않는 태도입니다."
      : chapterId === "risk_and_growth"
        ? "피해야 할 패턴은 계속 버티기만 하다가 과열되는 흐름입니다. 수 부족은 밤 산책, 수변 공간, 충분한 수분, 기록, 잠 루틴으로 식히고, 화 부족은 햇빛, 가벼운 운동, 발표와 표현 연습으로 밖으로 내야 합니다. 토 과다는 책임 덜어내기와 경계선 정리하기로 조절해야 합니다."
      : `${titleKo}에 맞는 환경은 기준을 세우고 빠르게 실행할 수 있는 곳입니다. ${titleKo}에서 피해야 할 패턴은 결론만 던지고 상대의 속도를 보지 않는 흐름이므로, 질문을 먼저 넣는 처방이 필요합니다.`;
  const hitReadingLines =
    chapterId === "work_money_study"
      ? [
          "일을 잡으면 초반에는 빠르게 판을 정리하지만, 쉬는 기준은 자주 뒤로 밀릴 수 있습니다.",
          "자격증이나 전문서 공부도 왜 써먹는지가 보여야 집중력이 붙는 편입니다.",
          "돈은 벌 아이디어보다 지킬 구조가 없을 때 더 빨리 새기 쉽습니다.",
        ]
      : chapterId === "love_relationships"
        ? [
            "호감이 있어도 따뜻한 말보다 해결책이 먼저 나갈 수 있습니다.",
            "상대가 감정을 말할 때, 덕민님은 위로보다 결론을 먼저 주고 싶어질 수 있습니다.",
            "감정 기복이 큰 사람보다 말과 생활이 안정적인 사람이 오래 맞을 가능성이 큽니다.",
          ]
        : chapterId === "risk_and_growth"
          ? [
              "쉬어야 할 때도 머리가 꺼지지 않아 다음 일정을 먼저 굴릴 수 있습니다.",
              "버티는 힘은 강하지만, 회복 타이밍은 자주 늦게 잡히기 쉽습니다.",
            ]
          : chapterId === "final_message"
            ? [
                "덕민님은 이기는 법을 빨리 배우지만, 오래 가는 법은 따로 설계해야 하는 편입니다.",
              ]
            : [
                `덕민님, ${titleKo}에서 상대가 설명을 끝내기 전에 이미 결론이 보이는 상황 자주 나오지 않나요?`,
                `${titleKo}에서는 감정보다 기준을 먼저 세우는 편입니다.`,
                `${titleKo}에서는 책임을 먼저 떠안는 장면이 나올 수 있습니다.`,
              ].slice(0, chapterId === "opening" || chapterId === "saju_identity" ? 2 : 3);
  const solutionLines =
    chapterId === "opening"
      ? []
      : chapterId === "final_message"
        ? [
            "오늘부터 회의나 대화 전에 상대의 핵심을 한 문장으로 되받아 주세요.",
            "일에서는 맡을 일과 버릴 일을 구분해 책임의 경계선을 정하세요.",
            "돈은 계좌와 예산을 나누어 공격 계획과 방어 계획을 분리하세요.",
            "회복은 밤 산책, 수면, 기록처럼 일정에 박아 두세요.",
          ]
      : chapterId === "work_money_study"
        ? [
            "공부/일 루틴은 자격증, 전문서, 직무 학습, 사업 학습을 2주 단위로 쪼개세요.",
            "돈은 공격 계획과 방어 계획을 분리해야 합니다.",
            "현금흐름과 투자와 자기계발 예산을 따로 보세요.",
            "쉬는 시간을 성능 관리 일정으로 먼저 넣으세요.",
          ]
        : chapterId === "love_relationships"
          ? [
              "맞는 상대: 감정을 천천히 풀어주고 덕민님의 과열을 식혀주는 사람이 맞기 쉽습니다.",
              "피해야 할 상대: 감정 기복이 크고 책임이 흐릿한 사람은 조심할 상대입니다.",
              "보완 기운: 수 기운과 화 기운처럼 감정 완충과 표현 온도를 보태는 타입이 좋습니다.",
              "MBTI 관계 기준: 감정을 천천히 풀어주고 생활 리듬과 책임감이 안정적인 성향을 보되 MBTI만으로 궁합을 단정하지 않습니다.",
            ]
          : chapterId === "risk_and_growth"
            ? [
                "수 부족은 밤 산책, 수변 공간, 충분한 수분, 기록, 잠 루틴으로 식히세요.",
                "화 부족은 햇빛, 가벼운 운동, 발표와 표현 연습으로 밖으로 내세요.",
                "토 과다는 책임 덜어내기와 경계선 정리하기로 조절하세요.",
                "회복은 기분 문제가 아니라 일정으로 박아야 합니다.",
              ]
            : [
                `${titleKo}에서는 결론을 말하기 전에 질문을 먼저 넣으세요.`,
                `${titleKo}에서는 책임 범위를 문장으로 정리하세요.`,
              ];

  return {
    chapterId,
    titleKo,
    headline: `${titleKo}는 갑목과 갑신일주를 먼저 놓고 읽습니다.`,
    hitReadingLines,
    body:
      chapterId === "final_message"
        ? "마지막으로 남길 말에서는 갑목과 갑신일주의 큰 방향, 압박 속 판단, 책임을 처리하는 방식이 한 줄로 정리됩니다. 입력한 ENTJ 성향으로 보면 덕민님은 효율, 목표, 역할 정리, 빠른 결론과 해결 중심을 통해 이 사주 구조를 체감하기 쉽습니다. 일에서는 맡을 일과 버릴 일을 나누고, 관계에서는 조언 전에 질문을 먼저 넣고, 돈에서는 계좌와 예산을 분리하며, 회복에서는 밤 산책과 수면과 기록을 일정에 고정해야 합니다. 돈과 일은 성과를 밀어붙이는 힘으로 쓰되, 관계에서는 상대의 속도를 확인하고, 회복에서는 아무 성과도 내지 않는 시간을 먼저 확보해야 오래 갑니다. 오늘부터 할 작은 실행은 회의 전에 질문 하나 쓰기, 계좌를 용도별로 나누기, 침대에 눕기 전 내일 일정 메모를 닫기입니다. 또 하나는 메시지를 보내기 전에 말의 온도를 한 번 낮추고, 마지막 하나는 밤 산책이나 기록으로 머리를 식힌 뒤 판단을 미루는 것입니다. 오래 가는 방식은 더 세게 밀어붙이는 일이 아니라, 방향과 책임과 회복을 동시에 운영하는 장치에서 나옵니다."
        : `${titleKo}에서는 갑목과 갑신일주를 1차 근거로 삼고 ENTJ는 보조 근거로 연결합니다. 덕민님, ${titleKo}에서 상대가 아직 고민 중인데 이미 답이 보이는 상황 많지 않나요? ${titleKo}의 갑목은 방향을 세우고 앞으로 밀고 가려는 힘이라서 결론을 빠르게 잡는 모습으로 나타납니다. ${titleKo}에서 갑신일주는 압박 속에서도 기준을 지키려는 구조라서, 같은 구조라도 회의와 메시지, 일과 관계와 돈에서는 전혀 다른 장면으로 드러납니다. ${titleKo}을 MBTI 언어로 번역하면 ENTJ식 효율, 목표, 역할 정리와 문제 해결 속도가 이 흐름을 보조합니다. 그래서 ${titleKo}의 조언은 막연한 위로보다 무엇을 기준으로 삼고 어디서 힘을 뺄지 정하는 쪽이어야 합니다. ${titleKo}에서는 결론을 바로 말하기 전에 질문을 하나 넣는 루틴을 두어야 합니다. ${titleKo}은 용어를 나열하는 칸이 아니라 실제 선택과 말투와 돈 쓰는 방식으로 사주 구조를 읽는 챕터입니다. ${titleKo}의 본문은 사용자가 하루 중 어떤 순간에 강해지고 어떤 순간에 과열되는지 떠올릴 수 있게 충분히 길고 구체적으로 이어져야 합니다. ${topicExtra}`,
    solutionLines,
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
                "갑목과 갑신일주를 1차 근거로 삼고 재고귀인은 자산화 흐름으로만 연결합니다. 갑목은 돈을 단순히 모으는 것보다 방향과 판을 키우려는 힘으로 나타납니다. 갑신일주는 압박이 걸릴수록 기준을 세우는 구조라서, 재고귀인과 만나면 성과를 기록하고 묶어두는 방식으로 현실화됩니다. ENTJ는 이 흐름을 보조하는 성취 감각입니다. 공부는 자격증, 전문서, 직무 학습, 사업 학습처럼 성과로 바뀌는 지식일 때 오래 갑니다. 돈은 감정적 안정감보다 통제 가능한 판을 확보하는 문제로 느껴지기 쉽습니다. 이 챕터에서는 일하는 방식, 돈을 버는 방식, 지식을 쌓아 실력으로 바꾸는 방식을 하나의 성과 루틴으로 연결해 설명합니다. 과열될 때는 쉬는 시간을 낭비가 아니라 판단력을 유지하는 장치로 넣어야 오래 갑니다. 재고귀인이 말하는 자산화는 단순히 돈을 아끼라는 뜻이 아니라, 성과가 흩어지지 않게 기록하고 묶고 다시 굴릴 수 있는 형태로 만드는 감각입니다. 그래서 이 장에서는 직무 학습과 사업 학습, 자격증과 실전 경험이 결국 같은 판에서 연결된다는 점까지 풀어야 합니다.",
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
    expect(JSON.stringify(calls[0].body)).toContain("selectedSajuFeatureEvidence");
    expect(JSON.stringify(calls[0].body)).toContain("sajuFeatureSpotlight");
    expect(JSON.stringify(calls[0].body)).toContain("sajuSignatureScenes");
    expect(JSON.stringify(calls[0].body)).toContain("day_pillar_gapsin");
    expect(JSON.stringify(calls[0].body)).toContain("symbolicImage");
    expect(JSON.stringify(calls[0].body)).toContain("positiveReading");
    expect(JSON.stringify(calls[0].body)).toContain("practicalUse");
    expect(responseFormatSchema).not.toContain("profileTable");
    expect(responseFormatSchema).not.toContain("sajuFeatureSpotlight");
    expect(responseFormatSchema).not.toContain("sajuSignatureScenes");
    expect(responseFormatSchema).not.toContain("yearPillar");
    expect(JSON.stringify(calls[0].body)).toContain("day_master_gabmok");
    expect(result.draft).toMatchObject({
      sajuFeatureSpotlight: {
        title: "덕민님 사주에서 특히 눈에 띄는 기운",
      },
      sajuSignatureScenes: expect.arrayContaining([
        expect.objectContaining({ id: "hyeonchim_entj_fast_conclusion" }),
      ]),
    });
  });

  it("sends capped selected Saju feature evidence grouped by V2 chapter", async () => {
    const calls: RequestInit[] = [];
    const fetchImpl: typeof fetch = async (_input, init) => {
      if (init !== undefined) {
        calls.push(init);
      }

      return createJsonResponse({
        output_text: JSON.stringify(createValidDraft()),
      });
    };

    await generateComprehensiveReportDraft({
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

    const requestText = JSON.stringify(calls[0].body);
    const requestBody = JSON.parse(String(calls[0].body)) as {
      readonly input?: readonly {
        readonly content?: string | readonly {
          readonly text?: string;
        }[];
      }[];
    };
    const userText = requestBody.input
      ?.flatMap((message) =>
        typeof message.content === "string" ? [message.content] : message.content ?? [],
      )
      .map((content) => (typeof content === "string" ? content : content.text ?? ""))
      .join("\n") ?? "";
    const evidenceStart = userText.indexOf('"selectedSajuFeatureEvidence"');
    const evidenceText = evidenceStart >= 0 ? userText.slice(evidenceStart) : "";

    expect(requestText).toContain("selectedSajuFeatureEvidence");
    expect(userText).toContain('"chapterId": "saju_identity"');
    expect(userText).toContain('"chapterId": "work_money_study"');
    expect(userText).toContain('"chapterId": "love_relationships"');
    expect(userText).toContain('"chapterId": "risk_and_growth"');
    expect(requestText).toContain("day_pillar_gapsin");
    expect(requestText).toContain("element_fire_missing");
    expect(requestText).toContain("element_water_missing");
    expect(requestText).toContain("gwiin_jaego");
    expect(requestText).not.toContain("sinsal_dohwa");
    expect(requestText).not.toContain("twelve_sinsal_banan");
    expect(evidenceText).not.toContain("strict self-discipline");
    expect(evidenceText).not.toContain("leader type");
    expect(evidenceText).not.toContain("strong energy");
  });

  it("repairs one-pass repairable V2 quality errors", async () => {
    const repairableDraft = {
      ...createValidDraft(),
      chapters: createValidDraft().chapters.map((chapter) =>
        chapter.chapterId === "opening"
          ? {
              ...chapter,
              hitReadingLines: [
                "덕민님은 성장할 수 있습니다.",
                "덕민님은 장점과 단점이 있습니다.",
              ],
            }
          : chapter,
      ),
    };
    const repairedDraft = createValidDraft();
    const calls: RequestInit[] = [];
    const fetchImpl: typeof fetch = async (_input, init) => {
      if (init !== undefined) {
        calls.push(init);
      }

      return createJsonResponse({
        output_text: JSON.stringify(calls.length === 1 ? repairableDraft : repairedDraft),
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
    const repairRequestBody = JSON.stringify(calls[1]?.body);
    const parsedRepairRequest = JSON.parse(String(calls[1]?.body)) as {
      readonly text?: {
        readonly format?: {
          readonly schema?: unknown;
        };
      };
    };

    expect(calls).toHaveLength(2);
    expect(result.draft).toMatchObject(repairedDraft);
    expect(result.rawText).toBe(JSON.stringify(repairedDraft));
    expect(result.warnings).toEqual([
      "quality repair: attempted",
      "quality repair: passed",
    ]);
    expect(repairRequestBody).toContain("validation errors");
    expect(repairRequestBody).toContain("DIRECT_HIT_READING_TOO_GENERIC: opening");
    expect(repairRequestBody).toContain("profileTable 출력 금지");
    expect(repairRequestBody).toContain("hitReadingLines");
    expect(repairRequestBody).toContain("solutionLines");
    expect(JSON.stringify(parsedRepairRequest.text?.format?.schema)).not.toContain(
      "profileTable",
    );
  });

  it("accepts repaired risk generic hit-reading with concrete remedies as warning", async () => {
    const initialDraft = {
      ...createValidDraft(),
      chapters: createValidDraft().chapters.map((chapter) =>
        chapter.chapterId === "opening"
          ? {
              ...chapter,
              hitReadingLines: [
                "덕민님은 성장할 수 있습니다.",
                "덕민님은 장점과 단점이 있습니다.",
              ],
            }
          : chapter,
      ),
    };
    const repairedWithRiskWarning = {
      ...createValidDraft(),
      chapters: createValidDraft().chapters.map((chapter) =>
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
    };
    let callCount = 0;
    const fetchImpl: typeof fetch = async () => {
      callCount += 1;

      return createJsonResponse({
        output_text: JSON.stringify(
          callCount === 1 ? initialDraft : repairedWithRiskWarning,
        ),
      });
    };

    const result = await generateComprehensiveReportDraft({
      mbtiType: "ENTJ",
      evidencePacket: createPacket(),
      config: {
        apiKey: "test_key",
        model: "test_model",
        enabled: true,
        fetchImpl,
      },
    });

    expect(callCount).toBe(2);
    expect(result.draft).toMatchObject(repairedWithRiskWarning);
    expect(result.warnings).toEqual([
      "quality repair: attempted",
      "quality repair: passed with warnings",
      "DIRECT_HIT_READING_TOO_GENERIC: risk_and_growth",
    ]);
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
    let callCount = 0;

    const error = await expectSafeGenerationFailure(
      generateComprehensiveReportDraft({
        mbtiType: "ENTJ",
        evidencePacket: createPacket(),
        config: {
          apiKey: "test_key",
          model: "test_model",
          enabled: true,
          fetchImpl: async () => {
            callCount += 1;

            return createJsonResponse({
              output_text: JSON.stringify(draft),
            });
          },
        },
      }),
    );

    expect(error.stage).toBe("draft_validation");
    expect(error.validationErrors?.join("\n")).toContain(
      "UNSUPPORTED_SAJU_TERM",
    );
    expect(callCount).toBe(1);
    expect(error.repairAttempted).toBeUndefined();
  });

  it("fails safely after one repair attempt when repaired draft is still invalid", async () => {
    const repairableDraft = {
      ...createValidDraft(),
      chapters: createValidDraft().chapters.map((chapter) =>
        chapter.chapterId === "opening"
          ? {
              ...chapter,
              hitReadingLines: [
                "덕민님은 성장할 수 있습니다.",
                "덕민님은 장점과 단점이 있습니다.",
              ],
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
        output_text: JSON.stringify(repairableDraft),
      });
    };

    const error = await expectSafeGenerationFailure(
      generateComprehensiveReportDraft({
        userDisplayName: "덕민",
        mbtiType: "ENTJ",
        evidencePacket: createPacket(),
        config: {
          apiKey: "test_key",
          model: "test_model",
          enabled: true,
          fetchImpl,
        },
      }),
    );

    expect(calls).toHaveLength(2);
    expect(error.stage).toBe("draft_validation");
    expect(error.repairAttempted).toBe(true);
    expect(error.repairPassed).toBe(false);
    expect(error.validationErrors?.join("\n")).toContain(
      "DIRECT_HIT_READING_TOO_GENERIC: opening",
    );
  });

  it("sanitizes mild internal meta copy before validation", async () => {
    const metaDraft = {
      ...createValidDraft(),
      openingSummary:
        "이 초안에서는 사주 구조를 먼저 놓고 ENTJ는 보조로 연결합니다.",
    };
    let callCount = 0;
    const fetchImpl: typeof fetch = async () => {
      callCount += 1;

      return createJsonResponse({
        output_text: JSON.stringify(metaDraft),
      });
    };

    const result = await generateComprehensiveReportDraft({
      mbtiType: "ENTJ",
      evidencePacket: createPacket(),
      config: {
        apiKey: "test_key",
        model: "test_model",
        enabled: true,
        fetchImpl,
      },
    });

    expect(callCount).toBe(1);
    expect(result.warnings).toEqual(["copy sanitizer: applied"]);
    expect(JSON.stringify(result.draft)).not.toContain("초안");
    expect(JSON.stringify(result.draft)).toContain("리포트");
  });

  it("sanitizes document meta wording and normalizes weak final message before validation", async () => {
    const weakDraft = {
      ...createValidDraft(),
      openingSummary:
        "이 문서에서는 사주 구조를 먼저 놓고 ENTJ는 보조로 연결합니다.",
      chapters: createValidDraft().chapters.map((chapter) =>
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
    let callCount = 0;
    const fetchImpl: typeof fetch = async () => {
      callCount += 1;

      return createJsonResponse({
        output_text: JSON.stringify(weakDraft),
      });
    };

    const result = await generateComprehensiveReportDraft({
      mbtiType: "ENTJ",
      evidencePacket: createPacket(),
      config: {
        apiKey: "test_key",
        model: "test_model",
        enabled: true,
        fetchImpl,
      },
    });
    const serialized = JSON.stringify(result.draft);

    expect(callCount).toBe(1);
    expect(result.warnings).toEqual([
      "copy sanitizer: applied",
      "final message normalizer: applied",
    ]);
    expect(serialized).not.toContain("이 문서");
    expect(serialized).not.toContain("문서에서는");
    expect(serialized).not.toContain("문서 자체");
    expect(serialized).toContain("이 리포트에서는");
    expect(serialized).toContain("마지막 핵심");
    expect(serialized).toContain("오늘부터");
  });

  it("repairs unsafe copy mild meta wording and repeated sentences from model output", async () => {
    const unsafeDraft = {
      ...createValidDraft(),
      openingSummary:
        "이 문서는 치료 방향을 다루지 않지만 사주 구조를 먼저 놓고 ENTJ는 보조로 연결합니다.",
      chapters: createValidDraft().chapters.map((chapter) =>
        [
          "personality_pattern",
          "work_money_study",
          "love_relationships",
        ].includes(chapter.chapterId)
          ? {
              ...chapter,
              body: `${chapter.body} 다만 contrast는 분명합니다.`,
            }
          : chapter,
      ),
    };
    const repairedDraft = {
      ...createValidDraft(),
      openingSummary:
        "이 리포트는 관리 방향을 단정하지 않고 사주 구조를 먼저 놓고 ENTJ는 보조로 연결합니다.",
      chapters: createValidDraft().chapters.map((chapter) =>
        [
          "personality_pattern",
          "work_money_study",
          "love_relationships",
        ].includes(chapter.chapterId)
          ? {
              ...chapter,
              body: `${chapter.body} ${chapter.titleKo}에서는 다만 차이가 분명합니다. ${chapter.titleKo}의 대비는 생활 조언으로 조정할 수 있습니다.`,
            }
          : chapter,
      ),
    };
    let callCount = 0;
    const fetchImpl: typeof fetch = async () => {
      callCount += 1;

      return createJsonResponse({
        output_text: JSON.stringify(callCount === 1 ? unsafeDraft : repairedDraft),
      });
    };

    const result = await generateComprehensiveReportDraft({
      mbtiType: "ENTJ",
      evidencePacket: createPacket(),
      config: {
        apiKey: "test_key",
        model: "test_model",
        enabled: true,
        fetchImpl,
      },
    });
    const serialized = JSON.stringify(result.draft);

    expect(callCount).toBe(2);
    expect(result.warnings).toEqual([
      "copy sanitizer: applied",
      "quality repair: attempted",
      "quality repair: passed",
    ]);
    expect(serialized).not.toContain("치료");
    expect(result.draft.openingSummary).not.toContain("문서");
    expect(serialized).not.toContain("이 문서는");
    expect(serialized).not.toContain("contrast");
    expect(serialized).not.toContain("다만 contrast는 분명합니다.");
    expect(serialized).toContain("관리");
    expect(serialized).toContain("리포트");
    expect(serialized).toContain("차이가 분명합니다");
  });

  it("sanitizes repaired draft before final validation", async () => {
    const repairableDraft = {
      ...createValidDraft(),
      chapters: createValidDraft().chapters.map((chapter) =>
        chapter.chapterId === "opening"
          ? {
              ...chapter,
              hitReadingLines: [
                "덕민님은 성장할 수 있습니다.",
                "덕민님은 장점과 단점이 있습니다.",
              ],
            }
          : chapter,
      ),
    };
    const repairedDraft = {
      ...createValidDraft(),
      finalAdvice:
        "치료라는 표현 대신 생활 루틴으로 관리하는 방향을 남깁니다. 성과를 밀어붙이는 힘은 살리되, 관계에서는 질문을 먼저 넣고 돈에서는 계좌와 예산을 분리하며 회복에서는 밤 산책과 수면을 일정에 고정해 오래 가는 방식을 만들어 주세요.",
      chapters: createValidDraft().chapters.map((chapter) =>
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
    };
    let callCount = 0;
    const fetchImpl: typeof fetch = async () => {
      callCount += 1;

      return createJsonResponse({
        output_text: JSON.stringify(callCount === 1 ? repairableDraft : repairedDraft),
      });
    };

    const result = await generateComprehensiveReportDraft({
      mbtiType: "ENTJ",
      evidencePacket: createPacket(),
      config: {
        apiKey: "test_key",
        model: "test_model",
        enabled: true,
        fetchImpl,
      },
    });
    const serialized = JSON.stringify(result.draft);

    expect(callCount).toBe(2);
    expect(result.warnings).toEqual([
      "copy sanitizer: applied",
      "final message normalizer: applied",
      "quality repair: attempted",
      "quality repair: passed",
    ]);
    expect(serialized).not.toContain("치료");
    expect(serialized).toContain("관리");
    expect(serialized).toContain("마지막 핵심");
  });

  it("fails if repair keeps repeated sentences after sanitizer cleanup", async () => {
    const unsafeDraft = {
      ...createValidDraft(),
      openingSummary:
        "이 문서는 치료 방향을 다루지 않지만 사주 구조를 먼저 놓고 ENTJ는 보조로 연결합니다.",
      chapters: createValidDraft().chapters.map((chapter) =>
        [
          "personality_pattern",
          "work_money_study",
          "love_relationships",
        ].includes(chapter.chapterId)
          ? {
              ...chapter,
              body: `${chapter.body} 다만 contrast는 분명합니다.`,
            }
          : chapter,
      ),
    };
    let callCount = 0;
    const fetchImpl: typeof fetch = async () => {
      callCount += 1;

      return createJsonResponse({
        output_text: JSON.stringify(unsafeDraft),
      });
    };

    const error = await expectSafeGenerationFailure(
      generateComprehensiveReportDraft({
        mbtiType: "ENTJ",
        evidencePacket: createPacket(),
        config: {
          apiKey: "test_key",
          model: "test_model",
          enabled: true,
          fetchImpl,
        },
      }),
    );
    const validationErrors = error.validationErrors?.join("\n") ?? "";

    expect(callCount).toBe(2);
    expect(error.stage).toBe("draft_validation");
    expect(error.repairAttempted).toBe(true);
    expect(error.repairPassed).toBe(false);
    expect(validationErrors).toContain(
      "REPEATED_SENTENCE: 다만 대비는 분명합니다.",
    );
    expect(validationErrors).not.toContain("UNSAFE_MEDICAL_COPY: 치료");
    expect(validationErrors).not.toContain("MILD_INTERNAL_META_COPY: 문서");
  });

  it("sanitizes internal template wording from model output", async () => {
    const draft = {
      ...createValidDraft(),
      openingSummary:
        "검증된 JSON으로 저장되는 내부 문장이라는 표현은 제거하고, 사주 구조를 먼저 놓고 ENTJ는 보조로 연결하는 사용자용 해석으로 충분히 길게 정리합니다.",
    };

    const result = await generateComprehensiveReportDraft({
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
    });
    const serialized = JSON.stringify(result.draft);

    expect(result.warnings).toEqual(["copy sanitizer: applied"]);
    expect(serialized).not.toContain("JSON");
    expect(serialized).toContain("리포트 형식");
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
