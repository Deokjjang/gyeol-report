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
  return {
    chapterId,
    titleKo,
    headline: `${titleKo}는 갑목과 갑신일주를 생활 장면으로 읽는 챕터입니다.`,
    body:
      `${titleKo}에서는 갑목과 갑신일주를 먼저 놓고 봅니다. 갑목은 방향을 세우고 판을 키우는 힘이라 덕민님이 가만히 기다리기보다 먼저 기준을 잡게 만듭니다. 갑신일주는 압박 속에서도 판단을 세우는 구조라서, 일과 돈과 관계에서 같은 근거가 서로 다른 장면으로 드러납니다. ENTJ는 이 흐름을 보조하는 자기상으로만 연결됩니다. 이렇게 쓰면 좋습니다. 결론을 바로 말하기 전에 질문을 먼저 던지는 루틴을 두면 날카로움이 조언으로 바뀝니다.`,
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
    expect(html).toContain("만세력 요약");
    expect(html).toContain("연주");
    expect(html).toContain("월주");
    expect(html).toContain("일주");
    expect(html).toContain("시주");
    expect(html).toContain("일간");
    expect(html).toContain("오행");
    expect(html).toContain("십성");
    expect(html).toContain("신살");
    expect(html).toContain("귀인");
    expect(html).toContain("MBTI");
    expect(html).toContain("병자");
    expect(html).toContain("갑목");
    expect(html).toContain("화 부족");
    expect(html).toContain("편재");
    expect(html).toContain("현침살");
    expect(html).toContain("사주가 보여주는 기본 형상");
    expect(html).toContain("사주가 보여주는 기본 형상는 갑목과 갑신일주");
    expect(html).toContain("갑목은 방향을 세우고 판을 키우는 힘");
    expect(html).toContain("일, 돈, 공부가 연결되는 방식");
    expect(html).toContain("이렇게 쓰면 좋습니다");
    expect(html).toContain("최종 조언");
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
