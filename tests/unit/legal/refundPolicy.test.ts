import { describe, expect, it } from "vitest";

import {
  prePaymentRefundNoticeKo,
  refundPolicyRequiredNotices,
  refundPolicyStateRows,
  refundPolicyStates,
  refundPolicySupportRequestGuidanceKo,
} from "../../../src/lib/legal/refundPolicy";

describe("refund policy constants", () => {
  it("defines the state-based refund policy model", () => {
    expect(refundPolicyStates).toEqual([
      "before_payment",
      "paid_before_generation",
      "generation_started",
      "generated",
      "generation_failed",
      "duplicate_payment",
      "system_error",
      "wrong_input",
      "minor_cancellation",
      "company_fault",
    ]);
    expect(refundPolicyStateRows.map((row) => row.statusKo)).toEqual([
      "결제 전",
      "결제 완료 후, 생성 시작 전",
      "생성 시작 후",
      "결과 생성 완료",
      "결과 미제공",
      "중복결제",
      "시스템 장애",
      "잘못된 입력값",
      "미성년자 법정 취소",
      "회사 귀책 오류",
    ]);
  });

  it("contains required refund and support notices", () => {
    expect(refundPolicyRequiredNotices).toContain(
      "생성 시작 전에는 취소 및 환불을 요청할 수 있습니다.",
    );
    expect(refundPolicyRequiredNotices).toContain(
      "생성 시작 후에는 단순 변심에 의한 환불이 제한될 수 있습니다.",
    );
    expect(refundPolicyRequiredNotices).toContain(
      "시스템 장애, 중복결제, 결과 미제공, 회사 귀책 오류가 확인되는 경우 재생성 또는 환불을 진행합니다.",
    );
    expect(refundPolicyRequiredNotices).toContain(
      "환불이 확정된 경우 관련 법령에 따라 환급 절차를 진행합니다.",
    );
    expect(refundPolicyRequiredNotices).toContain(
      "미성년자가 법정대리인 동의 없이 결제한 경우 본인 또는 법정대리인이 계약 취소를 요청할 수 있습니다.",
    );
    expect(refundPolicySupportRequestGuidanceKo).toBe(
      "환불 또는 재생성 요청 시 결제일시, 결제금액, 입력한 이름 또는 닉네임, 오류 내용을 함께 보내주세요.",
    );
    expect(prePaymentRefundNoticeKo).toBe(
      "생성 시작 후 단순 변심에 의한 환불이 제한될 수 있으며, 장애·중복결제·결과 미제공·법령상 취소 사유는 예외입니다.",
    );
  });

  it("avoids unsafe absolute no-refund and risk copy", () => {
    const policyCopy = [
      ...refundPolicyStateRows.flatMap((row) => [
        row.statusKo,
        row.handlingKo,
      ]),
      ...refundPolicyRequiredNotices,
      refundPolicySupportRequestGuidanceKo,
      prePaymentRefundNoticeKo,
    ].join("\n");
    const blockedMarkers = [
      "어떠한 경우에도 환불 불가",
      "무조건 환불 불가",
      "전액 환불 불가",
      "회사는 책임지지 않습니다",
      "진단",
      "치료",
      "적중률",
      "100%",
      "보장",
      "반드시",
      "운명 확정",
    ];

    for (const marker of blockedMarkers) {
      expect(policyCopy).not.toContain(marker);
    }
  });
});
