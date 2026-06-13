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
      userDisplayName: "덕민",
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
    expect(combined).toContain("이번 리포트에서 사용할 수 있는 사주 용어");
    expect(combined).toContain(
      "목록에 없는 신살, 귀인, 일주, 십성, 오행, 격국, 패턴은 절대 언급하지 마라",
    );
    expect(combined).toContain("갑목");
    expect(combined).toContain("갑신일주");
    expect(combined).toContain("현침살");
    expect(combined).toContain("홍염살");
    expect(combined).toContain("재고귀인");
    expect(combined).not.toContain("도화살");
    expect(combined).not.toContain("반안살");
    expect(combined).not.toContain("장성살");
    expect(combined).not.toContain("천을귀인");
    expect(combined).toContain("comprehensive_v2_draft");
    expect(combined).toContain("hitReadingLines");
    expect(combined).toContain("solutionLines");
    expect(combined).toContain("체감형 명중 문장");
    expect(combined).toContain("덕민님, 이런 상황 많지 않나요");
    expect(combined).toContain("실천 솔루션");
    expect(combined).toContain("final_message는 체감형 명중보다 정리와 각인이 우선이다");
    expect(combined).toContain("final_message hitReadingLines는 있어도 되지만");
    expect(combined).toContain("덜 닳게 오래 가는 법");
    expect(combined).toContain("회복과 표현을 시스템에 넣는 일");
    expect(combined).toContain("profileTable은 시스템이 deterministic facts로 붙인다");
    expect(combined).toContain("너는 profileTable을 출력하지 않는다");
    expect(combined).toContain("profileTable 필드는 절대 출력하지 않는다");
    expect(combined).toContain("너는 narrative fields만 JSON으로 작성한다");
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
    expect(combined).toContain("MBTI 예시");
    expect(combined).toContain("MBTI만으로 궁합을 단정하지 않는다");
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
    expect(combined).toContain("체감형 명중 문장");
    expect(combined).toContain("구체적 장면 예시");
    expect(combined).toContain("실천 솔루션");
    expect(combined).toContain("덕민님, 이런 상황 자주 나오지 않나요");
    expect(combined).toContain("공부/일 루틴");
    expect(combined).toContain("오행 부족/과다에 따른 생활 처방");
    expect(combined).toContain("밤 산책");
    expect(combined).toContain("수변 공간");
    expect(combined).toContain("햇빛");
    expect(combined).toContain("책임 덜어내기");
    expect(combined).toContain("지치기 전까지 멈추는 신호");
    expect(combined).toContain("책임을 내려놓는 기준");
    expect(combined).toContain("짧은 칭찬과 감정 표현");
    expect(combined).toContain("맡을 일과 버릴 일");
    expect(combined).toContain("ISFP");
    expect(combined).toContain("INFP");
    expect(combined).toContain("INTP");
    expect(combined).toContain("MBTI 예시를 단정하지 않는 방식");
    expect(combined).toContain("편관은 덕민님을 편하게 두지 않는 압박");
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
    expect(combined).toContain("성향 해석과 자기이해 목적의 참고 문장");
    expect(combined).toContain("Korean output");
    expect(combined).toContain('"mbtiType": "ENTJ"');
    expect(combined).toContain("day_master_gabmok");
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

  it("builds a repair prompt for same-schema narrative fixes", () => {
    const messages = buildOpenAIComprehensiveReportRepairMessages({
      userDisplayName: "덕민",
      mbtiType: "ENTJ",
      allowedSajuTerms: ["갑목", "갑신일주", "현침살"],
      draftJson:
        "{\"version\":\"comprehensive_v2_draft\",\"chapters\":[],\"finalAdvice\":\"짧음\"}",
      validationErrors: [
        "CHAPTER_BODY_TOO_SHORT: love_relationships",
        "DIRECT_HIT_READING_TOO_GENERIC: opening",
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
    expect(combined).toContain("제작/작성 메타 표현을 제거하라");
    expect(combined).toContain("이 초안에서는 금지");
    expect(combined).toContain("작성된 글은");
    expect(combined).toContain("이 문서는");
    expect(combined).toContain("본문을 더 길고 구체적으로 보강하라");
    expect(combined).toContain(
      "진단, 치료, 정신질환, 우울증, 불안장애, 투자 추천, 법률 자문, 반드시, 무조건, 100%, 보장, 운명 확정 같은 위험 문구를 제거한다",
    );
    expect(combined).toContain("성향 해석과 자기이해 목적의 참고 문장으로 고친다");
    expect(combined).toContain("사주 용어는 evidence에 있는 것만 사용하라");
    expect(combined).toContain("갑목");
    expect(combined).not.toContain("도화살");
  });
});
