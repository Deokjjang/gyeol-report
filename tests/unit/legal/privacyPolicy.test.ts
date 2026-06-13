import { describe, expect, it } from "vitest";

import {
  prePaymentPrivacyNoticeKo,
  privacyPolicyCollectionItems,
  privacyPolicyExternalServiceRows,
  privacyPolicyMinorNoticeKo,
  privacyPolicyNoResidentRegistrationNumberKo,
  privacyPolicyOverseasProcessingKo,
  privacyPolicyPurposeItems,
  privacyPolicyRetentionRows,
  privacyPolicySensitiveInfoLimitKo,
  privacyPolicyUnder14Ko,
} from "../../../src/lib/legal/privacyPolicy";

describe("privacy policy constants", () => {
  it("lists collected data and purposes for the report service", () => {
    expect(privacyPolicyCollectionItems).toEqual([
      "이름 또는 닉네임",
      "생년월일",
      "출생시간",
      "성별",
      "MBTI",
      "결제 거래정보",
      "리포트 생성 및 열람 정보",
      "접속기록",
      "고객 문의 정보",
    ]);
    expect(privacyPolicyPurposeItems).toContain("리포트 생성 및 제공");
    expect(privacyPolicyPurposeItems).toContain("결제 처리 및 결제 내역 확인");
    expect(privacyPolicyPurposeItems).toContain(
      "고객 문의 및 환불·재생성 요청 처리",
    );
    expect(privacyPolicyPurposeItems).toContain("법령상 거래기록 보존");
  });

  it("separates service retention from legal transaction records", () => {
    expect(privacyPolicyRetentionRows.map((row) => row.categoryKo)).toEqual([
      "리포트 입력정보",
      "리포트 결과",
      "결제 및 계약 기록",
      "소비자 불만 또는 분쟁 처리 기록",
      "접속기록",
    ]);
    expect(privacyPolicyRetentionRows.map((row) => row.periodKo)).toContain(
      "관련 법령에 따른 보존기간",
    );
  });

  it("lists external processors and overseas processing possibility", () => {
    expect(privacyPolicyExternalServiceRows).toEqual([
      {
        providerKo: "토스페이먼츠",
        purposeKo: "결제 승인, 결제 취소, 결제 내역 확인",
      },
      {
        providerKo: "Supabase",
        purposeKo:
          "입력정보, 결제 주문 정보, 리포트 열람 정보 저장 및 서비스 운영",
      },
      {
        providerKo: "OpenAI API",
        purposeKo:
          "입력값과 deterministic evidence를 바탕으로 리포트 문장 생성 보조",
      },
      {
        providerKo: "호스팅 제공자",
        purposeKo: "서비스 제공을 위한 웹 호스팅",
      },
    ]);
    expect(privacyPolicyOverseasProcessingKo).toContain(
      "일부 서비스는 국외에서 제공될 수 있습니다",
    );
    expect(privacyPolicyOverseasProcessingKo).toContain(
      "리포트 입력정보, 결제 주문 식별 정보, 리포트 생성 및 열람 정보, 접속기록",
    );
    expect(privacyPolicyOverseasProcessingKo).toContain(
      "데이터 저장, 서비스 운영, 리포트 문장 생성 보조, 웹 호스팅",
    );
  });

  it("defines age and sensitive information limits", () => {
    expect(privacyPolicyUnder14Ko).toBe(
      "만 14세 미만은 현재 버전에서 서비스를 이용할 수 없습니다.",
    );
    expect(privacyPolicyMinorNoticeKo).toContain(
      "만 19세 미만 미성년자는 결제 시 법정대리인 동의가 필요하며",
    );
    expect(privacyPolicySensitiveInfoLimitKo).toContain(
      "건강정보, 질병정보, 정신질환 정보",
    );
    expect(privacyPolicySensitiveInfoLimitKo).toContain(
      "문의 과정에서 민감정보를 포함하지 않도록 주의",
    );
    expect(privacyPolicyNoResidentRegistrationNumberKo).toBe(
      "회사는 주민등록번호를 수집하지 않습니다.",
    );
    expect(prePaymentPrivacyNoticeKo).toBe(
      "리포트 생성을 위해 이름 또는 닉네임, 생년월일, 출생시간, 성별, MBTI가 처리됩니다.",
    );
  });

  it("does not use unsafe product claim wording", () => {
    const policyCopy = [
      ...privacyPolicyCollectionItems,
      ...privacyPolicyPurposeItems,
      ...privacyPolicyRetentionRows.flatMap((row) => [
        row.categoryKo,
        row.periodKo,
      ]),
      ...privacyPolicyExternalServiceRows.flatMap((row) => [
        row.providerKo,
        row.purposeKo,
      ]),
      privacyPolicyOverseasProcessingKo,
      privacyPolicyUnder14Ko,
      privacyPolicyMinorNoticeKo,
      privacyPolicySensitiveInfoLimitKo,
      privacyPolicyNoResidentRegistrationNumberKo,
      prePaymentPrivacyNoticeKo,
    ].join("\n");
    const blockedMarkers = [
      "적중률",
      "100% 맞춤",
      "보장",
      "반드시 성공",
      "운명 확정",
      "정신질환 분석",
      "우울증 분석",
      "불안장애 분석",
      "투자 추천",
    ];

    for (const marker of blockedMarkers) {
      expect(policyCopy).not.toContain(marker);
    }
  });
});
