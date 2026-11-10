import { describe, expect, it } from "vitest";

import { CHECKOUT_POLICY_VERSIONS, META_OPTOUT_POLICY_EFFECTIVE_DATE, OPS_Q_POLICY_EFFECTIVE_DATE, POLICY_EFFECTIVE_DATE, POLICY_EFFECTIVE_DATES_KO, POLICY_HISTORY } from "../../../src/lib/legal/policyVersions";
import { termsPolicySections } from "../../../src/lib/legal/termsPolicy";
import { META_DEFAULT_FROM } from "../../../src/lib/analytics/metaConsent";
import { privacyPolicySections } from "../../../src/lib/legal/privacyPolicy";
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

  it("운영 Q(2026-11-07)·결정 A(광고 측정 기본 허용): 약관 2026-11-06.1·환불정책 2026-11-07.1 그대로, 개인정보처리방침은 문서만 두 번 개정(동의 버전 2026-11-06.1 그대로), 방침 시행일은 결정 A 배포일 상수 하나, 변경 이력은 최신이 먼저", () => {
    expect(CHECKOUT_POLICY_VERSIONS).toEqual({ terms: "2026-11-06.1", privacy: "2026-11-06.1", refund: "2026-11-07.1" });
    expect(POLICY_EFFECTIVE_DATE).toBe("2026-11-06");
    expect(OPS_Q_POLICY_EFFECTIVE_DATE).toBe("2026-11-07");
    // 결정 A 13번 시행일 = 2026-12-10(덕짱님 결정: 30일 공지 뒤, 코드 동작 시각 META_DEFAULT_FROM과 같은 날). 방침 자체 시행일은 11월 7일 그대로.
    expect(META_OPTOUT_POLICY_EFFECTIVE_DATE).toBe("2026-12-10"); expect(META_DEFAULT_FROM!.slice(0, 10)).toBe(META_OPTOUT_POLICY_EFFECTIVE_DATE);
    const optOut = "2026년 12월 10일";
    expect(POLICY_EFFECTIVE_DATES_KO).toEqual({ terms: "2026년 11월 6일", privacy: "2026년 11월 7일", refund: "2026년 11월 7일" });
    // 약관: 첫 줄 F 문서 개정(동의 버전 그대로) → 2026-11-06.1(현재) → 2026-11-05.1.
    expect(POLICY_HISTORY.terms[0]).toMatch(/^2026년 11월 \d{1,2}일 개정\(문서 개정 — 동의 버전 2026-11-06\.1 그대로, 이용자에게 유리한 변경이라 다시 동의하지 않아도 됩니다\): 이용권 조항에 「가입 이용권」/);
    expect(POLICY_HISTORY.terms[1]).toMatch(/^2026년 11월 6일 시행\(현재, 문서 버전 2026-11-06\.1\)/);
    expect(POLICY_HISTORY.terms[2]).toMatch(/^2026년 11월 6일 시행\(문서 버전 2026-11-05\.1\)/);
    expect(termsPolicySections.at(-1)!.bodyKo[0]).toBe("시행일: 2026년 11월 6일");
    // 환불정책: 2026-11-07.1(현재) → 2026-11-06.1 → 2026-11-05.1.
    // 개인정보처리방침: 결정 A 문서 개정(현재) → 11월 7일 문서 개정(Telegram) → 2026-11-06.1 → 2026-11-05.1. 동의 버전은 모두 그대로.
    expect(POLICY_HISTORY.refund[0]).toMatch(/^2026년 11월 7일 시행\(현재, 문서 버전 2026-11-07\.1\)/);
    // F: 처리방침 첫 줄은 가입 이용권 지급 기록·방문 통계 문서 개정(동의 버전 그대로).
    expect(POLICY_HISTORY.privacy[0]).toMatch(/^2026년 11월 \d{1,2}일 개정\(문서 개정 — 동의 버전 2026-11-06\.1 그대로\): 가입 이용권 중복 지급을 막는 기록/);
    expect(POLICY_HISTORY.privacy[1].startsWith(`${optOut} 시행(2026년 11월 9일부터 공지, 문서 개정 — 동의 버전 2026-11-06.1 그대로라 다시 동의하지 않아도 됩니다)`)).toBe(true);
    expect(POLICY_HISTORY.privacy[1]).toContain("「광고 설정」에서 거부할 수 있음");
    expect(POLICY_HISTORY.privacy[2]).toMatch(/^2026년 11월 7일 시행\(문서 개정 — 동의 버전 2026-11-06\.1 그대로\)/);
    expect(POLICY_HISTORY.privacy[2]).toContain("Telegram Messenger Inc.");
    expect(POLICY_HISTORY.privacy.join("\n")).not.toContain("2026-11-07.1");
    for (const [kind, from] of [["privacy", 3], ["refund", 1]] as const) {
      const lines = POLICY_HISTORY[kind];
      expect(lines[from]).toMatch(/^2026년 11월 6일 시행\(문서 버전 2026-11-06\.1\)/);
      expect(lines[from + 1]).toMatch(/^2026년 11월 6일 시행\(문서 버전 2026-11-05\.1\)/);
      // 처리방침은 시행일 앞뒤에 모두 맞게 「현재」를 붙이지 않는다(13번 변경이 12월 10일 시행 — 시각에 따라 틀려짐).
      expect(lines.filter(line => line.includes("(현재,"))).toHaveLength(kind === "privacy" ? 0 : 1);
    }
    expect(POLICY_HISTORY.refund[0]).toContain("맨 위에 요약 세 줄");
    const privacyEnd = privacyPolicySections.at(-1)!.blocks[0];
    expect(privacyEnd.kind === "p" && privacyEnd.text).toBe(`이 방침은 2026년 11월 7일부터 시행합니다. 다만 13번 광고 성과 측정의 변경(아래 변경 이력 첫 줄)은 ${optOut}부터 시행합니다. 내용이 바뀌면 시행 7일 전(이용자에게 불리한 변경은 30일 전)부터 서비스 화면에 알립니다.`);
    expect(refundPolicyHistoryLinesKo[0]).toBe("시행일: 2026년 11월 7일");
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
