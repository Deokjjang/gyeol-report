import { describe, expect, it } from "vitest";

import {
  buildOpenAIComprehensiveReportRepairMessages,
  buildOpenAIComprehensiveReportWriterMessages,
} from "../../../src/lib/report-generation/openaiReportWriterPrompt";
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

describe("OpenAI report writer prompt", () => {
  it("builds Saju-first instructions with the evidence packet JSON", () => {
    const { packet } = buildComprehensiveReportEvidencePacketFromComputedFacts({
      mbtiType: "ENTJ",
      sajuFacts: deokminSampleFacts,
    });
    const messages = buildOpenAIComprehensiveReportWriterMessages({
      userDisplayName: "사용자",
      mbtiType: "ENTJ",
      evidencePacket: packet,
    });
    const combined = [messages.system, messages.developer, messages.user].join("\n");

    expect(combined).toContain("사주가 1차 근거");
    expect(combined).toContain("MBTI는 보조 근거");
    expect(combined).toContain("ENTJ라서 그렇다 금지");
    expect(combined).toContain("Use only provided evidence");
    expect(combined).toContain("Do not invent Saju facts");
    expect(combined).toContain("evidence에 없는 신살/귀인/십성/오행/일주 금지");
    expect(combined).toContain("제공된 명리학 feature evidence에 있는 항목만 사용하라");
    expect(combined).toContain("없는 신살·귀인·길신을 새로 만들지 말 것");
    expect(combined).toContain("좋은 기운은 좋게 느껴지게");
    expect(combined).toContain("주의 신살은 운영법으로");
    expect(combined).toContain("selectedSajuFeatureEvidence");
    expect(combined).toContain(
      "각 chapter는 selectedSajuFeatureEvidence[chapterId]에 제공된 feature 중 최소 2개 이상",
    );
    expect(combined).toContain(
      "없는 feature를 만들지 말고 제공된 feature만 사용하라",
    );
    expect(combined).toContain("좋은 길신/귀인은 상징 이미지와 실제 활용 방향");
    expect(combined).toContain(
      "성격 챕터는 질문을 나열하지 말고, 구체 장면 1개를 반드시 포함하라",
    );
    expect(combined).toContain("사람들과 대화할 때 상대 설명이 끝나기 전에 오류와 결론");
    expect(combined).toContain("카톡에서 상대는 감정을 풀고 있는데");
    expect(combined).toContain("담당자·기준표·마감선");
    expect(combined).toContain("대화/카톡/수업/팀플에서 드러나는 장면");
    expect(combined).toContain("알바/업무, 프로젝트, 실전 적용");
    expect(combined).toContain("직장인에게만 맞는 회의 장면에 치우치지 말고");
    expect(combined).toContain("수업·팀플·카톡·친구·가족·알바·업무·돈·잠들기 전");
    expect(combined).toContain(
      "personality_pattern에는 selected signature scene 중 personality/work/relationship 관련 장면",
    );
    expect(combined).toContain("symbolicImage");
    expect(combined).toContain("work_money_study에는 돈/계좌/전문서/자격증/사업 아이디어/실전 적용");
    expect(combined).toContain("love_relationships에는 상대가 서운함을 말하는 장면");
    expect(combined).toContain("people_family_environment에는 가족 부탁, 팀 역할 분담");
    expect(combined).toContain("positiveReading");
    expect(combined).toContain("cautionReading");
    expect(combined).toContain("practicalUse");
    expect(combined).toContain("sceneSeeds");
    expect(combined).toContain("phraseSeeds");
    expect(combined).toContain("이번 리포트에서 사용할 수 있는 사주 용어");
    expect(combined).toContain(
      "목록에 없는 신살, 귀인, 일주, 십성, 오행, 격국, 패턴은 절대 언급하지 마라",
    );
    expect(combined).toContain("갑목");
    expect(combined).toContain("갑신일주");
    expect(combined).toContain("현침살");
    expect(combined).toContain("홍염살");
    expect(combined).toContain("재고귀인");
    expect(combined).toContain("comprehensive_v2_draft");
    expect(combined).toContain("hitReadingLines");
    expect(combined).toContain("solutionLines");
    expect(combined).toContain("바로 와닿는 장면 문장");
    expect(combined).toContain("사용자님, 이런 상황 많지 않나요");
    expect(combined).toContain("실천 솔루션");
    expect(combined).toContain(
      "final_message는 단순 요약이 아니라 전체 리포트의 상징을 회수하는 장이다",
    );
    expect(combined).toContain("오늘부터 할 수 있는 3가지");
    expect(combined).toContain("final_message hitReadingLines는 있어도 되지만");
    expect(combined).toContain("덜 닳게 오래 가는 법");
    expect(combined).toContain("회복과 표현을 시스템에 넣는 일");
    expect(combined).toContain("profileTable은 시스템이 deterministic facts로 붙인다");
    expect(combined).toContain("만세력 및 명리학 표는 deterministic profileTable로 제공된다");
    expect(combined).toContain("너는 profileTable을 출력하지 않는다");
    expect(combined).toContain("profileTable 필드는 절대 출력하지 않는다");
    expect(combined).toContain("너는 narrative fields만 JSON으로 작성한다");
    expect(combined).toContain("hitReadingLines와 solutionLines는 본문에 자연스럽게 녹일 것");
    expect(combined).toContain("이런 장면 있지 않나요 / 이렇게 쓰면 좋습니다 라벨 금지");
    expect(combined).toContain("일상 장면을 구체적으로 쓸 것");
    expect(combined).toContain("MBTI 보조 해석을 충분히 쓸 것");
    expect(combined).toContain("final_message는 긴 마무리 챕터로 쓸 것");
    expect(combined).toContain(
      "final_message는 짧은 요약이 아니라 리포트 전체를 닫는 긴 마무리 챕터다",
    );
    expect(combined).toContain(
      "final_message는 최소한 일, 관계, 돈, 회복/표현 중 3개 이상을 연결해 실제 실천 방향으로 마무리하라",
    );
    expect(combined).toContain("8개 챕터");
    expect(combined).toContain("근거 목록을 따로 보여주지 말고 본문에 녹여라");
    expect(combined).toContain("work_money_study");
    expect(combined).toContain("love_relationships");
    expect(combined).toContain("people_family_environment");
    expect(combined).toContain("공부는 학생 공부뿐 아니라 자격증, 전문서, 직무 학습, 사업 학습까지 포함");
    expect(combined).toContain("연애는 오행적으로 필요한 사람과 MBTI 관계 스타일을 함께 풀어라");
    expect(combined).toContain("love_relationships.solutionLines");
    expect(combined).toContain("맞는 상대");
    expect(combined).toContain("피해야 할 상대");
    expect(combined).toContain("보완 기운");
    expect(combined).toContain("MBTI 관계 기준");
    expect(combined).toContain("MBTI 보완 유형을 구체적으로 나열하지 마라");
    expect(combined).toContain(
      "MBTI는 궁합 단정 기준이 아니라 관계 성향을 보는 보조 지표",
    );
    expect(combined).toContain("MBTI는 궁합을 단정하는 기준이 아니라");
    expect(combined).toContain("단정하지 않는 방식");
    expect(combined).toContain("display 섹션은 짧게");
    expect(combined).toContain("시스템 사정");
    expect(combined).toContain("팩폭은 하되 모욕 금지");
    expect(combined).toContain("제작 과정 표현을 쓰지 마라");
    expect(combined).toContain("초안");
    expect(combined).toContain("원고");
    expect(combined).toContain("작성된 글");
    expect(combined).toContain("생성된 내용");
    expect(combined).toContain("문서");
    expect(combined).toContain("텍스트");
    expect(combined).toContain("같은 근거를 섹션별로 다르게 풀어라");
    expect(combined).toContain("사주 용어를 쉬운 말로 풀어 설명");
    expect(combined).toContain("섹션마다 같은 근거를 다른 결과로 풀어라");
    expect(combined).toContain("구체적인 조언");
    expect(combined).toContain("바로 와닿는 장면 문장");
    expect(combined).toContain("구체적 장면 예시");
    expect(combined).toContain("실천 솔루션");
    expect(combined).toContain("명리학적 흐름");
    expect(combined).toContain("사용자님, 이런 상황 자주 나오지 않나요");
    expect(combined).toContain("공부/일 루틴");
    expect(combined).toContain("오행 부족/과다에 따른 생활 조언");
    expect(combined).toContain("밤 산책");
    expect(combined).toContain("수변 공간");
    expect(combined).toContain("햇빛");
    expect(combined).toContain("책임 덜어내기");
    expect(combined).toContain("지치기 전까지 멈추는 신호");
    expect(combined).toContain("책임을 내려놓는 기준");
    expect(combined).toContain("짧은 칭찬과 감정 표현");
    expect(combined).toContain("맡을 일과 버릴 일");
    expect(combined).toContain("구체 MBTI type은 쓰지 않는다");
    expect(combined).not.toContain("ISFP");
    expect(combined).not.toContain("INFP");
    expect(combined).not.toContain("INTP");
    expect(combined).not.toContain("MBTI 예시");
    expect(combined).toContain("편관은 사용자님을 편하게 두지 않는 압박");
    expect(combined).toContain("휴식은 감정 문제가 아니라 성능 유지 장치");
    expect(combined).toContain("공통점");
    expect(combined).toContain("차이점");
    expect(combined).toContain("보완점");
    expect(combined).toContain("정확한 날짜 예언 금지");
    expect(combined).toContain(
      "의료·심리치료·법률·투자 자문처럼 보이는 표현을 쓰지 마라",
    );
    expect(combined).toContain(
      "금지: 진단, 치료, 정신질환, 우울증, 불안장애, 투자 추천, 법률 자문, 반드시, 무조건, 100%, 보장, 운명 확정",
    );
    expect(combined).toContain("보장 같은 단정 광고 표현 금지");
    expect(combined).toContain(
      "사주 근거, 명리학 근거, 선택된 근거, feature evidence 같은 내부 표현 금지",
    );
    expect(combined).toContain("리포트 본문에는 의료·심리치료 관련 단어를 쓰지 마라");
    expect(combined).toContain("특히 치료, 진단, 우울증, 불안장애, 정신질환이라는 단어는 금지한다");
    expect(combined).toContain(
      "최종 리포트 본문에 \"치료\"라는 단어를 쓰지 마라",
    );
    expect(combined).toContain(
      "\"문서\", \"초안\", \"원고\", \"텍스트\" 같은 제작물 메타 표현을 쓰지 마라",
    );
    expect(combined).toContain(
      "\"문서\", \"초안\", \"생성된 내용\" 같은 제작 메타 표현을 쓰지 마라",
    );
    expect(combined).toContain("영어 단어 contrast/output/draft를 쓰지 마라");
    expect(combined).toContain("정책성 disclaimer를 본문에 넣지 말고");
    expect(combined).toContain("치료는 관리, 조정, 생활 조언, 운영법으로 바꿔라");
    expect(combined).toContain("문서는 리포트, 결과, 해석");
    expect(combined).toContain("영어 템플릿 단어 금지: contrast");
    expect(combined).toContain("contrast는 차이, 대비, 긴장으로 바꿔라");
    expect(combined).toContain("성향 해석과 자기이해 목적의 참고 문장");
    expect(combined).toContain("Korean output");
    expect(combined).toContain('"mbtiType": "ENTJ"');
    expect(combined).toContain("day_master_gabmok");
    expect(combined).toContain("twelve_sinsal_jisal");
    expect(combined).toContain("day_pillar_gapsin");
    expect(combined).toContain("element_fire_missing");
    expect(combined).toContain("element_water_missing");
    expect(combined).toContain("element_earth_excess");
    expect(combined).not.toContain("strict self-discipline");
    expect(combined).not.toContain("leader type");
    expect(combined).not.toContain("strong energy");
  });

  it("does not include private payment or OpenAI key markers in prompt text", () => {
    const { packet } = buildComprehensiveReportEvidencePacketFromComputedFacts({
      mbtiType: "ENTJ",
      sajuFacts: deokminSampleFacts,
    });
    const messages = buildOpenAIComprehensiveReportWriterMessages({
      mbtiType: "ENTJ",
      evidencePacket: packet,
    });
    const combined = [messages.system, messages.developer, messages.user].join("\n");
    const blockedMarkers = [
      "payment" + "Key",
      "provider" + "PaymentId",
      "OPENAI" + "_API" + "_KEY",
    ];

    for (const marker of blockedMarkers) {
      expect(combined).not.toContain(marker);
    }
  });

  it("instructs the model to use spotlight and signature scenes without inventing features", () => {
    const { packet } = buildComprehensiveReportEvidencePacketFromComputedFacts({
      mbtiType: "ENTJ",
      sajuFacts: {
        ...deokminSampleFacts,
        specialPatterns: ["no_resource", "no_output"],
      },
    });
    const messages = buildOpenAIComprehensiveReportWriterMessages({
      mbtiType: "ENTJ",
      evidencePacket: packet,
    });
    const combined = [messages.system, messages.developer, messages.user].join("\n");

    expect(combined).toContain("사주 feature spotlight");
    expect(combined).toContain("sajuSignatureScenes");
    expect(combined).toContain("signature scene");
    expect(combined).toContain("같은 질문을 반복하지 말고");
    expect(combined).toContain("각 chapter의 질문형 문장은 최대 2개까지만 사용하라");
    expect(combined).toContain("같은 형태의 ~하지 않나요? 문장을 반복하지 마라");
    expect(combined).toContain("질문 여러 개를 나열하는 대신 구체 장면을 먼저 보여줘라");
    expect(combined).toContain(
      "사람들과 대화, 카톡이나 DM, 수업, 팀플, 가족 부탁, 계좌 분리, 전문서 공부, 연애 대화, 잠들기 전",
    );
    expect(combined).toContain(
      "그대로 복붙하지 말고 자연스럽게 풀어써라",
    );
    expect(combined).toContain("signature scene은 내부 용어");
    expect(combined).toContain("내부 품질 평가 표현");
    expect(combined).toContain("생성 지시");
    expect(combined).toContain("용하다");
    expect(combined).toContain(
      "본문에서는 각 주요 chapter마다 spotlight 또는 signature scene 중 최소 1개 이상",
    );
    expect(combined).toContain("없는 feature는 절대 만들지 마라");
    expect(combined).toContain("좋은 길신/귀인은 상징 이미지와 실제 활용 방향");
    expect(combined).toContain("sajuFeatureSpotlight");
  });

  it("instructs the model to use differentiation modules without overfitting", () => {
    const { packet } = buildComprehensiveReportEvidencePacketFromComputedFacts({
      mbtiType: "ENTJ",
      sajuFacts: deokminSampleFacts,
    });
    const messages = buildOpenAIComprehensiveReportWriterMessages({
      mbtiType: "ENTJ",
      evidencePacket: packet,
    });
    const combined = [messages.system, messages.developer, messages.user].join("\n");

    expect(combined).toContain("reportDifferentiationModules");
    expect(combined).toContain("차별화 모듈");
    expect(combined).toContain("재미는 가벼운 농담이 아니라, 구체 장면과 비유에서 나온다");
    expect(combined).toContain("각 챕터는 같은 결론을 반복하지 말고 서로 다른 정보 역할");
    expect(combined).toContain("찔리는 일상 장면");
    expect(combined).toContain("바꾸는 스위치");
    expect(combined).toContain("MBTI 보완 유형 추천 목록을 쓰지 말고");
    expect(combined).not.toContain("덕민");
    expect(combined).not.toContain("ISFP, INFP, INTP");
    expect(combined).not.toContain("MBTI 예시");
  });

  it("builds a repair prompt for same-schema narrative fixes", () => {
    const messages = buildOpenAIComprehensiveReportRepairMessages({
      userDisplayName: "사용자",
      mbtiType: "ENTJ",
      allowedSajuTerms: ["갑목", "갑신일주", "현침살"],
      draftJson:
        "{\"version\":\"comprehensive_v2_draft\",\"chapters\":[],\"finalAdvice\":\"짧음\"}",
      validationErrors: [
        "CHAPTER_BODY_TOO_SHORT: love_relationships",
        "DIRECT_HIT_READING_TOO_GENERIC: opening",
        "LOVE_MBTI_CAUTION_OR_EXAMPLE_MISSING",
      ],
    });
    const combined = [messages.system, messages.developer, messages.user].join("\n");

    expect(combined).toContain("validation errors");
    expect(combined).toContain("CHAPTER_BODY_TOO_SHORT: love_relationships");
    expect(combined).toContain("same JSON schema");
    expect(combined).toContain("profileTable 출력 금지");
    expect(combined).toContain("절대 profileTable을 출력하지 않는다");
    expect(combined).toContain("hitReadingLines");
    expect(combined).toContain("solutionLines");
    expect(combined).toContain(
      "LOVE_MBTI_CAUTION_OR_EXAMPLE_MISSING이 있으면 연애와 관계 챕터에 MBTI를 궁합 단정 기준으로 쓰지 말고",
    );
    expect(combined).toContain("관계에서 필요한 성향과 생활 리듬을 보는 보조 지표");
    expect(combined).toContain("구체적인 MBTI 유형명 예시는 쓰지 마라");
    expect(combined).toContain("제작/작성 메타 표현을 제거하라");
    expect(combined).toContain("이 초안에서는 금지");
    expect(combined).toContain("작성된 글은");
    expect(combined).toContain("이 문서는");
    expect(combined).toContain("본문을 더 길고 구체적으로 보강하라");
    expect(combined).toContain(
      "진단, 치료, 정신질환, 우울증, 불안장애, 투자 추천, 법률 자문, 반드시, 무조건, 100%, 보장, 운명 확정 같은 위험 문구를 제거한다",
    );
    expect(combined).toContain("보장 같은 단정 광고 표현을 모두 제거하라");
    expect(combined).toContain("DIRECT_HIT_READING_MISSING: work_money_study");
    expect(combined).toContain("돈, 계좌, 전문서, 자격증, 사업 아이디어, 실전 적용");
    expect(combined).toContain("DIRECT_HIT_READING_MISSING: love_relationships");
    expect(combined).toContain("상대가 서운함을 말하는 장면");
    expect(combined).toContain("DIRECT_HIT_READING_MISSING: people_family_environment");
    expect(combined).toContain("가족 부탁, 팀 역할 분담, 담당자·마감·기준표");
    expect(combined).toContain(
      "사주 근거, 선택된 근거, feature evidence 같은 내부 표현을 쓰지 마라",
    );
    expect(combined).toContain(
      "성격 챕터에는 사람들과 대화/카톡/수업/팀플/설명/오류/결론 같은 구체 장면",
    );
    expect(combined).toContain("치료는 관리, 조정, 생활 조언, 운영법으로 바꿔라");
    expect(combined).toContain("문서는 리포트 또는 문맥상 자연스러운 표현으로 바꿔라");
    expect(combined).toContain("영어 단어 contrast는 차이, 대비, 긴장으로 바꿔라");
    expect(combined).toContain("영어 단어 output은 표현으로, draft는 리포트로 바꿔라");
    expect(combined).toContain("반복된 문장은 하나만 남기거나 서로 다른 표현으로 바꿔라");
    expect(combined).toContain("성향 해석과 자기이해 목적의 참고 문장으로 고친다");
    expect(combined).toContain("사주 용어는 evidence에 있는 것만 사용하라");
    expect(combined).toContain("갑목");
    expect(combined).not.toContain("도화살");
  });
});
