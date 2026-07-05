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
import type {
  LoveMarriageChildReportDraft,
} from "../../../../src/lib/report-generation/loveMarriageChildReportDraftTypes";
import {
  buildLoveMarriageChildReportEvidence,
} from "../../../../src/lib/report-knowledge/loveMarriageChildReportEvidence";

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
      yearPillar: "기묘",
      monthPillar: "신미",
      dayPillar: "갑신일주",
      hourPillar: "무진",
      dayMaster: "갑목",
      dayPillarKeywords: ["바위 위 소나무", "압박 속 리더십"],
      fiveElementSummary: ["목 2", "화 0", "토 4", "금 2", "수 0"],
      fiveElementBadges: [
        "목 2 · 초록",
        "화 0 · 빨강",
        "토 4 · 갈색",
        "금 2 · 금색",
        "수 0 · 파랑",
      ],
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
    sajuSymbolicNickname: {
      title: "큰 나무가 날카로운 금 위에 선 사람",
      subtitle:
        "방향성은 강하고 판단은 빠르지만, 완충과 회복을 같이 설계해야 오래 갑니다.",
      components: [
        {
          source: "day_pillar",
          label: "갑신일주",
          meaning: "큰 나무가 날카로운 금 위에 서는 형상입니다.",
        },
      ],
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
    reportDifferentiationModules: [
      {
        moduleId: "saju_weapon",
        title: "내 사주의 무기",
        items: [
          {
            title: "판이 흐릴 때 기준을 세우는 힘",
            body: "장성살과 갑신일주가 역할을 정리하는 감각으로 드러납니다.",
            practicalLine: "팀플이나 프로젝트에서 기준과 역할을 먼저 나누면 좋습니다.",
            sourceFeatureIds: ["twelve_sinsal_jangseong", "day_pillar_gapsin"],
          },
        ],
      },
      {
        moduleId: "saju_trap",
        title: "반복되는 함정",
        items: [
          {
            title: "도움 요청이 늦어지는 패턴",
            body: "무인성과 수 부족이 겹치면 안에서 오래 붙잡는 시간이 길어질 수 있습니다.",
            practicalLine: "막힌 지점을 한 문장으로 적어 먼저 공유해야 합니다.",
            sourceFeatureIds: ["structure_no_resource", "element_water_missing"],
          },
        ],
      },
      {
        moduleId: "daily_scene",
        title: "찔리는 일상 장면",
        items: [
          {
            title: "카톡에서 다음 행동을 먼저 정리하는 장면",
            body: "상대는 감정을 풀고 있는데 사용자는 해결 순서를 먼저 떠올릴 수 있습니다.",
            sourceFeatureIds: ["sinsal_hyeonchim", "element_fire_missing"],
          },
        ],
      },
      {
        moduleId: "switch_action",
        title: "바꾸는 스위치",
        items: [
          {
            title: "결론 전에 한 문장 되받기",
            body: "바로 정리하기 전에 상대의 핵심을 먼저 되받아 말합니다.",
            sourceFeatureIds: ["sinsal_hyeonchim"],
          },
        ],
      },
      {
        moduleId: "relationship_needs",
        title: "관계에서 봐야 할 조건",
        items: [
          {
            title: "표현 속도와 약속 습관",
            body: "MBTI 유형명보다 실제 생활 리듬과 감정 표현 방식이 중요합니다.",
            sourceFeatureIds: ["sinsal_wonjin", "element_fire_missing"],
          },
        ],
      },
    ],
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

function createLoveMarriageChildEvidencePacket() {
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
        "상관",
        "현침살",
        "홍염살",
        "도화살",
        "화개살",
        "천을귀인",
        "월덕귀인",
        "연일 천간합 甲己",
      ],
    },
  });
}

function createLoveMarriageChildDraft(
  input: { readonly withEvidencePacket?: boolean } = {},
): LoveMarriageChildReportDraft {
  const section = {
    headline: "기준이 맞을 때 안정되는 관계입니다",
    body:
      "당신은 감정만으로 관계를 끌고 가기보다 약속, 역할, 생활 기준을 함께 확인할 때 편해집니다.",
    keyPoints: ["명확한 약속", "생활 기준", "대화 순서"],
    caution: "기준을 너무 빠르게 제시하면 상대가 평가받는 느낌을 받을 수 있습니다.",
  };
  const patternSection = {
    ...section,
    repeatedPattern: ["상대의 책임감을 빠르게 봅니다."],
    betterUse: ["초반에는 기준을 묻되 결론은 늦춥니다."],
  };

  const withEvidencePacket = input.withEvidencePacket ?? true;

  return {
    version: "v1",
    productType: "love_marriage_child",
    productVersion: "v1",
    personLabel: "덕민",
    headline: "기준과 책임이 선명할수록 안정되는 관계 구조",
    openingSummary:
      "관계가 깊어질수록 감정만큼 생활 기준과 책임의 균형이 중요해집니다.",
    ...(withEvidencePacket
      ? { evidencePacket: createLoveMarriageChildEvidencePacket() }
      : {}),
    loveStyle: section,
    attractionPattern: patternSection,
    loveStrengths: section,
    loveFriction: patternSection,
    marriageRhythm: section,
    householdMoneyAndRoleSplit: section,
    conflictRecovery: section,
    parentMode: {
      ...section,
      parentingRolePattern: ["생활 루틴을 잡아줍니다."],
      avoidProjection: ["내 속도를 아이의 속도로 착각하지 않습니다."],
    },
    breakupReunionPattern: {
      ...section,
      myLoop: ["빠른 판단으로 결론을 앞당기려 합니다."],
      emotionalProcessing: ["감정을 사실과 분리해 적습니다."],
      repairBoundary: ["내가 바꿀 수 있는 행동과 상대 몫을 나눕니다."],
    },
    relationshipTimingHints: [
      {
        label: "관계 점검",
        headline: "감정이 커지기 전 기준을 맞춥니다",
        body:
          "갈등 신호는 결론이 아니라 말투, 속도, 생활 기준을 조율하라는 기준입니다.",
        push: ["생활 기준 정리"],
        avoid: ["상대 단정"],
      },
    ],
    actionPlan: [
      {
        label: "연애",
        headline: "관계 속도를 말로 확인하기",
        body: "호감만 확인하지 말고 서로의 관계 속도와 기준을 확인합니다.",
        firstAction: "원하는 관계 속도를 한 문장으로 적습니다.",
      },
    ],
    riskManagement: [
      {
        title: "기준이 압박으로 들리는 위험",
        body: "빠른 판단이 상대에게는 평가처럼 들릴 수 있습니다.",
        prevention: "요청과 판단을 분리해 말합니다.",
      },
    ],
    safetyNotes: ["관계 성향과 반복 패턴을 해석한 참고용입니다."],
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
    expect(html).not.toContain("사주×MBTI 종합 리포트 v1.0");
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
    expect(html).toContain("만세력");
    expect(html).not.toContain("만세력 요약");
    expect(html).toContain("시주");
    expect(html).toContain("일주");
    expect(html).toContain("월주");
    expect(html).toContain("연주");
    expect(html).toContain("천간");
    expect(html).toContain("지지");
    expect(html).not.toContain("지장간</h3>");
    expect(html).not.toContain("십이운성</h3>");
    expect(html).not.toContain("십이신살</h3>");
    expect(html).not.toContain("신살/귀인</h3>");
    expect(html).not.toContain("합충형파해</h3>");
    expect(html).toContain("manse-element-wood-green");
    expect(html).toContain("manse-element-earth-soil");
    expect(html).toContain("manse-element-metal-gold");
    expect(html).toContain("ENTJ 대담한 통솔자");
    expect(html).toContain("목표를 현실화하는 전략 지휘관");
    expect(html).toContain("선호 지표 비교");
    expect(html).toContain("외향 Extravert");
    expect(html).toContain("직관 iNtuition");
    expect(html).toContain("사고 Thinking");
    expect(html).toContain("판단 Judging");
    expect(html).toContain("mbti-preference-selected");
    expect(html).toContain("기능 서열");
    expect(html).toContain("주 기능");
    expect(html).toContain("Te");
    expect(html).toContain("외향 사고");
    expect(html).toContain("부 기능");
    expect(html).toContain("Ni");
    expect(html).toContain("내향 직관");
    expect(html).toContain("일간");
    expect(html).toContain("오행 분포");
    expect(html).toContain("목 2");
    expect(html).toContain("화 0");
    expect(html).toContain("토 4");
    expect(html).toContain("금 2");
    expect(html).toContain("수 0");
    expect(html).not.toContain("초록");
    expect(html).not.toContain("빨강");
    expect(html).not.toContain("갈색");
    expect(html).not.toContain("금색");
    expect(html).not.toContain("파랑");
    expect(html).toContain("element-chip--wood");
    expect(html).toContain("element-chip--fire");
    expect(html).toContain("element-chip--earth");
    expect(html).toContain("element-chip--metal");
    expect(html).toContain("element-chip--water");
    expect(html).toContain("element-bg--wood");
    expect(html).toContain("element-bg--fire");
    expect(html).toContain("element-bg--earth");
    expect(html).toContain("element-bg--metal");
    expect(html).toContain("element-bg--water");
    expect(html).toContain("과다/부족");
    expect(html).toContain("주요 구조");
    expect(html).toContain("신살 요약");
    expect(html).toContain("귀인/길신 요약");
    expect(html).toContain("MBTI 입력값");
    expect(html).toContain("戊");
    expect(html).toContain("甲");
    expect(html).toContain("辛");
    expect(html).toContain("己");
    expect(html).toContain("辰");
    expect(html).toContain("申");
    expect(html).toContain("未");
    expect(html).toContain("卯");
    expect(html).toContain("무");
    expect(html).toContain("갑");
    expect(html).toContain("진");
    expect(html).toContain("묘");
    expect(html).not.toContain(">용<");
    expect(html).not.toContain(">원숭이<");
    expect(html).not.toContain(">양<");
    expect(html).not.toContain(">토끼<");
    expect(html).toContain("갑목");
    expect(html).toContain("화 부족");
    expect(html).toContain("편재");
    expect(html).toContain("현침살");
    expect(html).toContain("장성살");
    expect(html).toContain("천을귀인");
    expect(html).not.toContain("백호대살");
    expect(html).toContain("사주 한줄 별칭");
    expect(html).toContain("큰 나무가 날카로운 금 위에 선 사람");
    expect(html).toContain("완충과 회복을 같이 설계해야 오래 갑니다");
    expect(html).toContain("덕민님 사주에서 특히 눈에 띄는 기운");
    expect(html).toContain("좋게 쓰면 크게 살아나는 기운");
    expect(html).toContain("타고난 재능과 강점");
    expect(html).toContain("주의해서 다뤄야 하는 기운");
    expect(html).toContain("부족해서 보완하면 좋은 기운");
    expect(html).toContain("천을귀인");
    expect(html).toContain("막힌 길에 손을 내미는 귀인");
    expect(html).toContain("읽기 전에 잡고 갈 핵심 포인트");
    expect(html).toContain("내 사주의 무기");
    expect(html).toContain("반복되는 함정");
    expect(html).toContain("찔리는 일상 장면");
    expect(html).toContain("바꾸는 스위치");
    expect(html).toContain("관계에서 봐야 할 조건");
    expect(html).toContain("판이 흐릴 때 기준을 세우는 힘");
    expect(html).toContain("카톡에서 다음 행동을 먼저 정리하는 장면");
    expect(html).not.toContain("천을귀인 - 막힌 길에 손을 내미는 귀인");
    expect(html).not.toContain("장성살 - 중심을 잡는 장수의 별");
    expect(html).not.toContain("원진살 - 가까울수록 결이 거슬리는 신호");
    expect(html).not.toContain("수 부족 - 냉각수가 부족한 엔진");
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
    expect(html).not.toContain("본문에서 반복해 나열하지 않고");
    expect(html).not.toContain("입력한 MBTI는 사주 해석을 보조");
    expect(html).not.toContain("분석 근거 보기");
    expect(html).not.toContain("사주 근거");
    expect(html).not.toContain("MBTI 참고");
    expect(html).not.toContain("근거 요약");
    expect(html).not.toContain("핵심 용어");
    expect(html).not.toContain("반영 포인트");
  });

  it("renders a love marriage child draft through the dedicated result branch", async () => {
    const loveResult = {
      ...createResult({
        snapshotVersion: null,
        draft: null,
      }),
      productType: "saju_mbti_full",
      draft: createLoveMarriageChildDraft(),
    } as unknown as PaidReportResult;
    mockGetPaidReportResult.mockResolvedValue({
      ok: true,
      result: loveResult,
    });

    const html = await renderPage("love_marriage_child_result_test");

    expect(html).toContain("연애·결혼·자녀 리포트");
    expect(html).toContain("덕민님의 관계 리포트");
    expect(html).toContain("기초 만세력");
    expect(html).toContain("덕민님의 만세력");
    expect(html).toContain("MBTI 성향표");
    expect(html).toContain("ENTJ 대담한 통솔자");
    expect(html).toContain("명리 핵심 근거");
    expect(html).toContain("재성");
    expect(html).toContain("사랑 방식");
    expect(html).toContain("내가 부모가 되었을 때");
    expect(html).toContain("이별/재회 고민이 있을 때");
    expect(html).toContain("관계 성향과 반복 패턴을 해석한 참고용");
    expect(html).not.toContain("사주×MBTI 종합 리포트");
    expect(html).not.toContain("재회 확률");
    expect(html).not.toContain("자식복");
  });

  it("renders the love marriage child branch safely without evidence packet", async () => {
    const loveResult = {
      ...createResult({
        snapshotVersion: null,
        draft: null,
      }),
      productType: "saju_mbti_full",
      draft: createLoveMarriageChildDraft({ withEvidencePacket: false }),
    } as unknown as PaidReportResult;
    mockGetPaidReportResult.mockResolvedValue({
      ok: true,
      result: loveResult,
    });

    const html = await renderPage("love_marriage_child_no_evidence_test");

    expect(html).toContain("연애·결혼·자녀 리포트");
    expect(html).toContain("이번 화면에서는 본문을 중심으로 관계 기준을 읽습니다.");
    expect(html).not.toContain("draft 본문");
    expect(html).not.toContain("기초 만세력");
    expect(html).not.toContain("MBTI 성향표");
  });

  it("keeps V2 page rendering when MBTI source is unknown", async () => {
    const baseDraft = createV2Draft();
    const draft = {
      ...baseDraft,
      profileTable: {
        ...baseDraft.profileTable,
        mbti: "UNKNOWN",
      },
    };
    mockGetPaidReportResult.mockResolvedValue({
      ok: true,
      result: createResult({
        snapshotVersion: "comprehensive_v2_draft",
        draft,
      }),
    });

    const html = await renderPage("report_result_page_test");

    expect(html).toContain("만세력 및 명리학 표");
    expect(html).toContain("MBTI 입력값");
    expect(html).toContain("UNKNOWN");
    expect(html).not.toContain("선호 지표 비교");
    expect(html).not.toContain("기능 서열");
    expect(html).not.toContain("Unsupported MBTI");
  });

  it("hides empty V2 differentiation modules", async () => {
    const draft = {
      ...createV2Draft(),
      reportDifferentiationModules: [
        {
          moduleId: "saju_weapon" as const,
          title: "내 사주의 무기" as const,
          items: [],
        },
      ],
    };
    mockGetPaidReportResult.mockResolvedValue({
      ok: true,
      result: createResult({
        snapshotVersion: "comprehensive_v2_draft",
        draft,
      }),
    });

    const html = await renderPage("report_result_page_test");

    expect(html).not.toContain("읽기 전에 잡고 갈 핵심 포인트");
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
