import { describe, expect, it } from "vitest";

import { CHECKOUT_POLICY_VERSIONS, POLICY_EFFECTIVE_DATE, POLICY_HISTORY } from "../../../src/lib/legal/policyVersions";
import {
  prePaymentRefundNoticeKo,
  refundPolicyHistoryLinesKo,
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
      "ticket_report",
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
      "이용권으로 만든 리포트",
    ]);
  });

  it("contains required refund and support notices", () => {
    expect(refundPolicyRequiredNotices).toContain(
      "리포트 생성 전에는 결제일로부터 7일 이내 취소 및 환불을 요청할 수 있습니다.",
    );
    expect(refundPolicyRequiredNotices).toContain(
      "리포트 생성이 시작되거나 결과가 제공된 이후에는 디지털 콘텐츠 특성상 단순 변심 환불(청약철회)은 되지 않습니다.",
    );
    expect(refundPolicyRequiredNotices).toContain(
      "미제공, 중복결제, 시스템 오류, 회사 귀책 오류가 확인되는 경우 환불 또는 재제공을 진행합니다.",
    );
    expect(refundPolicyRequiredNotices).toContain(
      "환불이 확정된 경우 관련 법령에 따라 환급 절차를 진행합니다.",
    );
    expect(refundPolicyRequiredNotices).toContain(
      "미성년자가 법정대리인 동의 없이 결제한 경우 본인 또는 법정대리인이 계약 취소를 요청할 수 있습니다.",
    );
    expect(refundPolicyRequiredNotices).toContain(
      "이용권으로 만든 리포트는 환불하지 않으며, 오류가 확인되면 다시 만들어 드리거나 이용권을 다시 드립니다.",
    );
    expect(refundPolicySupportRequestGuidanceKo).toBe(
      "환불 또는 재생성 요청 시 결제일시, 결제금액, 입력한 이름 또는 닉네임, 오류 내용을 함께 보내주세요. 이용권으로 만든 리포트는 리포트 주소를 함께 보내주세요.",
    );
    expect(prePaymentRefundNoticeKo).toBe(
      "리포트 생성 전에는 결제일로부터 7일 이내 환불 가능하며, 생성이 시작되면 디지털 콘텐츠 특성상 단순 변심 환불은 되지 않습니다. 미제공·중복결제·시스템 오류는 환불 또는 재제공합니다. 이용권으로 만든 리포트는 환불 대신 다시 만들어 드리거나 이용권을 다시 드립니다.",
    );
  });

  it("P 추가(2026-11-06): 세 문서 버전 2026-11-06.1, 앞 판(2026-11-05.1, 11월 6일 시행)이 변경 이력에 남고 환불정책도 시행일·이력을 보인다", () => {
    expect(CHECKOUT_POLICY_VERSIONS).toEqual({ terms: "2026-11-06.1", privacy: "2026-11-06.1", refund: "2026-11-06.1" });
    expect(POLICY_EFFECTIVE_DATE).toBe("2026-11-06");
    for (const kind of ["terms", "privacy", "refund"] as const) {
      const lines = POLICY_HISTORY[kind];
      expect(lines[0]).toContain("시행(현재, 문서 버전 2026-11-06.1)");
      expect(lines[1]).toMatch(/^2026년 11월 6일 시행\(문서 버전 2026-11-05\.1\)/);
    }
    expect(refundPolicyHistoryLinesKo[0]).toBe("시행일: 2026년 11월 6일");
    expect(refundPolicyHistoryLinesKo.slice(1)).toEqual(POLICY_HISTORY.refund.map(line => `변경 이력: ${line}`));
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
