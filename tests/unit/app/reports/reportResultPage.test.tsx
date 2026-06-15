import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

import ReportResultPage from "../../../../src/app/reports/[reportId]/page";
import { getPaidReportResult } from "../../../../src/lib/reports/supabasePaidReportResultAdapter";
import type {
  ComprehensiveReportDraft,
  ComprehensiveReportV2ChapterId,
  ComprehensiveReportV2Draft,
} from "../../../../src/lib/report-generation/comprehensiveReportDraftTypes";
import type { PaidReportResult } from "../../../../src/lib/reports/paidReportResultTypes";
import {
  COMPREHENSIVE_REPORT_SECTION_DEFINITIONS,
  type ComprehensiveReportSectionDefinition,
} from "../../../../src/lib/report-knowledge/reportSectionSchema";

vi.mock("../../../../src/lib/reports/supabasePaidReportResultAdapter", () => ({
  getPaidReportResult: vi.fn(),
}));

const mockGetPaidReportResult = vi.mocked(getPaidReportResult);
const createdAt = "2026-06-12T10:00:00.000Z";
const updatedAt = "2026-06-12T10:00:01.000Z";

function createDraftSection(definition: ComprehensiveReportSectionDefinition) {
  const isMbtiDisplay =
    definition.id === "mbti_core" || definition.id === "mbti_table";

  return {
    sectionId: definition.id,
    titleKo: definition.titleKo,
    oneLine: `${definition.titleKo} 한 줄 핵심입니다.`,
    body:
      "갑목과 갑신일주를 먼저 놓고 ENTJ는 보조 근거로 연결한 본문입니다.",
    evidenceSummary: ["갑목", "갑신일주", "ENTJ"],
    sajuTermsUsed:
      definition.primaryBasis === "display" && isMbtiDisplay
        ? []
        : ["갑목", "갑신일주"],
    mbtiTermsUsed: isMbtiDisplay ? ["ENTJ", "Te/Ni"] : ["ENTJ"],
    cautionLevel: "medium" as const,
  };
}

function createDraft(): ComprehensiveReportDraft {
  return {
    version: "comprehensive_v1_draft",
    productType: "saju_mbti_full",
    tone: ["saju_first", "conversational", "direct"],
    openingTitle: "한눈에 보는 결",
    openingSummary:
      "사주 원국의 구조를 먼저 보고 MBTI는 사용자가 체감하는 자기상을 보조로 연결합니다.",
    coreLine: "갑목과 갑신일주가 중심이고 ENTJ는 그 방향을 강화합니다.",
    sections: COMPREHENSIVE_REPORT_SECTION_DEFINITIONS.map(createDraftSection),
    finalAdvice:
      "강하게 드러나는 성향은 성과로 쓰되, 감정 순환과 휴식은 의식적으로 챙기는 편이 좋습니다.",
    safetyNotes: ["자기이해용 참고 콘텐츠입니다."],
  };
}

function createV2Chapter(chapterId: ComprehensiveReportV2ChapterId, titleKo: string) {
  const isFinal = chapterId === "final_message";

  return {
    chapterId,
    titleKo,
    headline: `${titleKo}는 갑목과 갑신일주를 생활 장면으로 읽는 챕터입니다.`,
    hitReadingLines: [
      `덕민님, ${titleKo}에서 상대가 설명을 끝내기 전에 이미 결론이 보이는 상황 자주 나오지 않나요?`,
      `${titleKo}에서는 감정보다 기준을 먼저 세우는 편입니다.`,
      `${titleKo}에서는 책임을 먼저 떠안는 장면이 나올 수 있습니다.`,
    ].slice(0, chapterId === "opening" || chapterId === "saju_identity" ? 2 : 3),
    body:
      isFinal
        ? "마지막으로 남길 말에서는 갑목과 갑신일주의 큰 방향, 압박 속 판단, 책임을 처리하는 방식이 한 줄로 정리됩니다. 입력한 ENTJ 성향으로 보면 덕민님은 효율, 목표, 역할 정리, 빠른 결론과 해결 중심을 통해 이 사주 구조를 체감하기 쉽습니다. 일에서는 맡을 일과 버릴 일을 나누고, 관계에서는 조언 전에 질문을 먼저 넣고, 돈에서는 계좌와 예산을 분리하며, 회복에서는 밤 산책과 수면과 기록을 일정에 고정해야 합니다. 오늘부터 할 작은 실행은 회의 전에 질문 하나 쓰기, 계좌를 용도별로 나누기, 침대에 눕기 전 내일 일정 메모를 닫기입니다. 오래 가는 방식은 더 세게 밀어붙이는 일이 아니라, 방향과 책임과 회복을 동시에 운영하는 장치에서 나옵니다."
        : `${titleKo}에서는 갑목과 갑신일주를 먼저 놓고 봅니다. 갑목은 방향을 세우고 판을 키우는 힘이라 덕민님이 가만히 기다리기보다 먼저 기준을 잡게 만듭니다. 갑신일주는 압박 속에서도 판단을 세우는 구조라서, 회의와 메시지, 일과 돈과 관계에서 같은 근거가 서로 다른 장면으로 드러납니다. ENTJ는 이 흐름을 보조하는 자기상으로만 연결되고, MBTI 언어로는 효율과 목표, 역할 정리, 빠른 결론과 해결 중심으로 체감됩니다. 결론을 바로 말하기 전에 질문을 먼저 던지는 루틴을 두면 날카로움이 조언으로 바뀝니다.`,
    solutionLines:
      chapterId === "opening"
        ? []
        : chapterId === "final_message"
          ? [
              "오늘 회의나 대화 전에 상대의 핵심을 한 문장으로 되받아 주세요.",
              "일에서는 맡을 일과 버릴 일을 구분해 책임의 경계선을 정하세요.",
              "돈은 계좌와 예산을 나누어 공격 계획과 방어 계획을 분리하세요.",
              "회복은 밤 산책, 수면, 기록처럼 일정에 박아 두세요.",
            ]
        : [
            "결론을 바로 말하기 전에 질문을 먼저 넣으세요.",
            "책임 범위를 문장으로 정리하세요.",
            "쉬는 시간을 일정에 먼저 넣으세요.",
            "감정 표현은 짧게라도 밖으로 내세요.",
          ],
    keyPhrases: [titleKo, "갑목", "갑신일주"],
    sajuTermsUsed: ["갑목", "갑신일주"],
    mbtiTermsUsed: ["ENTJ"],
  };
}

function createV2Draft(): ComprehensiveReportV2Draft {
  return {
    version: "comprehensive_v2_draft",
    productType: "saju_mbti_full",
    openingTitle: "덕민님의 결은 큰 방향과 빠른 판단에 있습니다",
    openingSummary:
      "갑목과 갑신일주를 먼저 놓고 읽으면, 덕민님은 작은 안정감보다 큰 방향과 기준을 먼저 찾는 사람에 가깝습니다.",
    coreLine: "사주 구조가 먼저이고 ENTJ는 그 구조를 성취 쪽으로 증폭합니다.",
    profileTable: {
      yearPillar: "병자",
      monthPillar: "경자",
      dayPillar: "갑신일주",
      hourPillar: "신미",
      dayMaster: "갑목",
      dayPillarKeywords: ["바위 위 소나무", "압박 속 리더십"],
      fiveElementSummary: ["목 2", "화 0", "토 4", "금 2", "수 0"],
      excessiveElements: ["토 과다"],
      missingElements: ["화 부족", "수 부족"],
      tenGodSummary: ["편재", "정재", "정관", "편관"],
      specialPatterns: ["재다신약", "무인성", "무식상"],
      sinsal: ["현침살", "홍염살"],
      gwiin: ["재고귀인"],
      twelveSinsal: ["장성살", "지살"],
      majorSinsal: ["현침살", "홍염살", "백호대살"],
      gwiinGilshin: ["천을귀인", "문창귀인", "재고귀인"],
      mbti: "ENTJ",
    },
    sajuFeatureSpotlight: {
      title: "덕민님 사주에서 특히 눈에 띄는 기운",
      subtitle: "계산된 원국과 선택된 명리학 근거에서 강하게 잡힌 항목만 정리했습니다.",
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
              vividLine:
                "완전히 혼자만 버티는 팔자라기보다, 필요한 순간에 사람이나 제도의 통로가 열릴 수 있습니다.",
              practicalLine:
                "도움을 기다리기보다 필요한 것을 정확히 요청할 때 더 잘 살아납니다.",
              polarity: "positive",
              sourceChapterIds: ["saju_identity"],
            },
          ],
        },
        {
          groupId: "talent",
          title: "타고난 재능과 강점",
          items: [
            {
              featureId: "twelve_sinsal_jangseong",
              labelKo: "장성살",
              badge: "중심을 잡는 장수의 별",
              shortMeaning: "흩어진 판에서 기준을 세우는 기운",
              vividLine:
                "사람들이 우왕좌왕할 때 뒤에 숨기보다 앞에서 중심을 잡는 힘입니다.",
              practicalLine:
                "팀과 프로젝트에서 기준과 역할을 먼저 정리할수록 살아납니다.",
              polarity: "positive",
              sourceChapterIds: ["work_money_study"],
            },
          ],
        },
        {
          groupId: "caution",
          title: "주의해서 다뤄야 하는 기운",
          items: [
            {
              featureId: "sinsal_wonjin",
              labelKo: "원진살",
              badge: "가까울수록 결이 거슬리는 신호",
              shortMeaning: "친밀한 관계에서 작은 어긋남이 크게 남는 기운",
              vividLine:
                "멀리 있을 때는 괜찮다가 가까워질수록 말투와 생활 리듬이 예민하게 걸릴 수 있습니다.",
              practicalLine:
                "서운함을 쌓기 전에 연락 간격과 감정 표현선을 구체적으로 맞춰야 합니다.",
              polarity: "mixed",
              sourceChapterIds: ["love_relationships"],
            },
          ],
        },
        {
          groupId: "balance",
          title: "부족해서 보완하면 좋은 기운",
          items: [
            {
              featureId: "element_water_missing",
              labelKo: "수 부족",
              badge: "냉각수가 부족한 엔진",
              shortMeaning: "생각을 식히고 감정을 완충하는 장치가 필요한 구조",
              vividLine: "머리는 계속 돌아가는데, 멈추는 스위치가 늦게 켜질 수 있습니다.",
              practicalLine:
                "밤 산책, 수분, 기록, 잠 루틴처럼 식히는 장치를 일정에 넣어야 합니다.",
              polarity: "mixed",
              sourceChapterIds: ["risk_and_growth"],
            },
          ],
        },
      ],
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
      "덕민님은 이기는 법을 빨리 배우는 쪽에 강점이 있습니다. 다만 오래 가려면 쉬는 시간도 전략으로 인정해야 합니다.",
    safetyNotes: ["자기이해용 참고 콘텐츠입니다."],
  };
}

function createResult(
  overrides: Partial<PaidReportResult> = {},
): PaidReportResult {
  return {
    reportId: "report_result_page_test",
    productType: "saju_mbti_full",
    status: "generated",
    snapshotStatus: "generated",
    snapshotVersion: "comprehensive_v1_draft",
    draft: createDraft(),
    createdAt,
    updatedAt,
    ...overrides,
  };
}

async function renderPage(reportId: string | undefined): Promise<string> {
  const element = await ReportResultPage({
    params: Promise.resolve({ reportId }),
  });

  return renderToStaticMarkup(element);
}

describe("report result page", () => {
  beforeEach(() => {
    mockGetPaidReportResult.mockReset();
  });

  it("loads by report id and renders a generated comprehensive draft", async () => {
    const fullPaymentKey = "pay_full_key_must_not_render";
    const resultWithPrivateExtras = {
      ...createResult(),
      ["payment" + "Key"]: fullPaymentKey,
      ["provider" + "PaymentId"]: "provider_payment_must_not_render",
      ["input" + "Snapshot"]: { birthDate: "1996-12-06" },
      ["share" + "Token"]: "share_token_must_not_render",
      ["access" + "TokenHash"]: "access_hash_must_not_render",
    };
    mockGetPaidReportResult.mockResolvedValue({
      ok: true,
      result: resultWithPrivateExtras,
    });

    const html = await renderPage("report_result_page_test");
    const firstCall = mockGetPaidReportResult.mock.calls[0]?.[0];

    expect(firstCall?.reportId).toBe("report_result_page_test");
    expect(typeof firstCall?.client).toBe("object");
    expect(html).toContain("결리포트");
    expect(html).toContain("사주×MBTI 종합 리포트");
    expect(html).toContain("한눈에 보는 결");
    expect(html).toContain("사주 원국의 구조를 먼저 보고");
    expect(html).toContain("갑목과 갑신일주가 중심이고 ENTJ");
    expect(html).toContain("사주 원국 요약");
    expect(html).toContain("MBTI 입력 요약");
    expect(html).toContain("성격");
    expect(html).toContain("성격 한 줄 핵심입니다.");
    expect(html).toContain("갑목과 갑신일주를 먼저 놓고 ENTJ");
    expect(html).toContain("분석 근거 보기");
    expect(html).toContain("사주 근거");
    expect(html).toContain("MBTI 참고");
    expect(html).toContain("최종 조언");
    expect(html).not.toContain(fullPaymentKey);
    expect(html).not.toContain("provider_payment_must_not_render");
    expect(html).not.toContain("input" + "Snapshot");
    expect(html).not.toContain("share_token_must_not_render");
    expect(html).not.toContain("access_hash_must_not_render");
    expect(html).not.toContain("OPENAI_API_KEY");
    expect(html).not.toContain("{&quot;version&quot;");
  });

  it("renders a V2 narrative draft without evidence debug UI", async () => {
    mockGetPaidReportResult.mockResolvedValue({
      ok: true,
      result: createResult({
        snapshotVersion: "comprehensive_v2_draft",
        draft: createV2Draft(),
      }),
    });

    const html = await renderPage("report_result_page_test");

    expect(html).toContain("사주×MBTI 종합 리포트");
    expect(html).toContain("덕민님의 결은 큰 방향과 빠른 판단에 있습니다");
    expect(html).toContain("사주 구조가 먼저이고 ENTJ");
    expect(html).toContain("만세력 및 명리학 표");
    expect(html).not.toContain("만세력 요약");
    expect(html).toContain("연주");
    expect(html).toContain("월주");
    expect(html).toContain("일주");
    expect(html).toContain("시주");
    expect(html).toContain("일간");
    expect(html).toContain("일주 해석 키워드");
    expect(html).toContain("오행 분포");
    expect(html).toContain("십성 핵심");
    expect(html).toContain("십이신살");
    expect(html).toContain("주요 신살");
    expect(html).toContain("귀인/길신");
    expect(html).toContain("MBTI 입력값");
    expect(html).toContain("병자");
    expect(html).toContain("갑목");
    expect(html).toContain("화 부족");
    expect(html).toContain("편재");
    expect(html).toContain("현침살");
    expect(html).toContain("장성살");
    expect(html).toContain("천을귀인");
    expect(html).toContain("덕민님 사주에서 특히 눈에 띄는 기운");
    expect(html).toContain("좋게 쓰면 크게 살아나는 기운");
    expect(html).toContain("타고난 재능과 강점");
    expect(html).toContain("주의해서 다뤄야 하는 기운");
    expect(html).toContain("부족해서 보완하면 좋은 기운");
    expect(html).toContain("천을귀인 - 막힌 길에 손을 내미는 귀인");
    expect(html).toContain("장성살 - 중심을 잡는 장수의 별");
    expect(html).toContain("원진살 - 가까울수록 결이 거슬리는 신호");
    expect(html).toContain("수 부족 - 냉각수가 부족한 엔진");
    expect(html).not.toContain("도화살");
    expect(html).toContain("사주가 보여주는 기본 형상");
    expect(html).toContain("사주가 보여주는 기본 형상는 갑목과 갑신일주");
    expect(html).toContain("갑목은 방향을 세우고 판을 키우는 힘");
    expect(html).not.toContain("이런 장면 있지 않나요?");
    expect(html).toContain("상대가 설명을 끝내기 전에 이미 결론이 보이는 상황");
    expect(html).toContain("일, 돈, 공부가 연결되는 방식");
    expect(html).not.toContain("이렇게 쓰면 좋습니다");
    expect(html).toContain("결론을 바로 말하기 전에 질문을 먼저 넣으세요.");
    expect(html).toContain("마지막으로 남길 말");
    expect(html).not.toContain("최종 조언");
    expect(html).not.toContain("처음에 보이는 결 핵심");
    expect(html).not.toContain("리포트 ID");
    expect(html).not.toContain("상품");
    expect(html).not.toContain("상태");
    expect(html).not.toContain("본문에서 반복해 나열하지 않고");
    expect(html).not.toContain("입력한 MBTI는 사주 해석을 보조");
    expect(html).not.toContain("분석 근거 보기");
    expect(html).not.toContain("사주 근거");
    expect(html).not.toContain("MBTI 참고");
    expect(html).not.toContain("근거 요약");
    expect(html).not.toContain("핵심 용어");
    expect(html).not.toContain("반영 포인트");
  });

  it("keeps placeholder state when no generated draft exists", async () => {
    mockGetPaidReportResult.mockResolvedValue({
      ok: true,
      result: createResult({
        status: "ready",
        snapshotStatus: "missing",
        snapshotVersion: null,
        draft: null,
      }),
    });

    const html = await renderPage("report_result_page_test");

    expect(html).toContain("리포트 준비 완료");
    expect(html).toContain("결제가 완료되었고 리포트가 생성되었습니다.");
    expect(html).toContain("상세 리포트 생성 대기 중입니다.");
  });

  it("shows invalid state safely", async () => {
    mockGetPaidReportResult.mockResolvedValue({
      ok: false,
      error: {
        code: "REPORT_RESULT_INVALID_REQUEST",
        messageKo: "Paid report result request is invalid.",
      },
    });

    const html = await renderPage("../bad");

    expect(html).toContain("리포트 정보가 올바르지 않습니다.");
    expect(html).not.toContain("payment" + "Key");
  });

  it("shows unavailable state safely", async () => {
    mockGetPaidReportResult.mockResolvedValue({
      ok: false,
      error: {
        code: "REPORT_RESULT_NOT_FOUND",
        messageKo: "Supabase paid report result RPC failed.",
      },
    });

    const html = await renderPage("report_missing_result");

    expect(html).toContain("리포트를 찾을 수 없습니다.");
    expect(html).toContain("결제가 완료된 리포트만 조회할 수 있습니다.");
    expect(html).not.toContain("provider" + "Payment" + "Id");
    expect(html).not.toContain("share" + "Token");
    expect(html).not.toContain("access" + "TokenHash");
  });

  it("shows invalid snapshot state safely", async () => {
    mockGetPaidReportResult.mockResolvedValue({
      ok: false,
      error: {
        code: "REPORT_RESULT_SNAPSHOT_INVALID",
        messageKo: "Supabase paid report result snapshot is invalid.",
      },
    });

    const html = await renderPage("report_invalid_snapshot");

    expect(html).toContain("리포트를 불러오지 못했습니다.");
    expect(html).toContain("저장된 리포트 형식을 확인할 수 없습니다.");
    expect(html).not.toContain("raw JSON");
  });
});
