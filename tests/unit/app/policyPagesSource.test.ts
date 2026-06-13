import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

function readAppFile(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

const policyPageSources = [
  readAppFile("src/app/terms/page.tsx"),
  readAppFile("src/app/privacy/page.tsx"),
  readAppFile("src/app/refund/page.tsx"),
] as const;

describe("policy page sources", () => {
  it("terms page contains required policy placeholder markers", () => {
    const source = readAppFile("src/app/terms/page.tsx");
    const expectedMarkers = [
      "이용약관",
      "출시 전 초안",
      "디지털 자기 이해 리포트",
      "참고",
      "support@dvem.ai",
      "홈으로 돌아가기",
      'href="/"',
    ];

    for (const marker of expectedMarkers) {
      expect(source).toContain(marker);
    }
  });

  it("privacy page contains required policy placeholder markers", () => {
    const source = readAppFile("src/app/privacy/page.tsx");
    const expectedMarkers = [
      "개인정보 처리방침",
      "출시 전 초안",
      "생년월일",
      "태어난 시간",
      "MBTI",
      "결제 제공자",
      "카드 정보",
      "support@dvem.ai",
      "홈으로 돌아가기",
      'href="/"',
    ];

    for (const marker of expectedMarkers) {
      expect(source).toContain(marker);
    }
  });

  it("refund page contains required policy placeholder markers", () => {
    const source = [
      readAppFile("src/app/refund/page.tsx"),
      readAppFile("src/lib/legal/businessInfo.ts"),
      readAppFile("src/lib/legal/refundPolicy.ts"),
    ].join("\n");
    const expectedMarkers = [
      "환불정책",
      "상품 유형",
      "환불 가능 시점",
      "환불 제한 시점",
      "장애·중복결제·결과 미제공 처리",
      "입력값 오류 처리",
      "미성년자 취소 안내",
      "문의 방법",
      "처리 기준",
      "생성 시작 전에는 취소 및 환불을 요청할 수 있습니다",
      "생성 시작 후에는 단순 변심에 의한 환불이 제한될 수 있습니다",
      "시스템 장애, 중복결제, 결과 미제공, 회사 귀책 오류가 확인되는 경우 재생성 또는 환불을 진행합니다",
      "환불 또는 재생성 요청 시 결제일시, 결제금액, 입력한 이름 또는 닉네임, 오류 내용을 함께 보내주세요",
      "010-3156-8568",
      "support@dvem.ai",
      "홈으로 돌아가기",
      'href="/"',
    ];

    for (const marker of expectedMarkers) {
      expect(source).toContain(marker);
    }
  });

  it("refund and pre-payment policy copy avoids absolute no-refund wording", () => {
    const source = [
      readAppFile("src/app/refund/page.tsx"),
      readAppFile("src/lib/legal/refundPolicy.ts"),
      readAppFile("src/components/payment/DevTossCheckoutLauncher.tsx"),
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
      expect(source).not.toContain(marker);
    }
  });

  it("policy pages avoid final legal wording", () => {
    const blockedMarkers = ["최종 확정", "법률 자문", "보장합니다"];

    for (const source of policyPageSources) {
      for (const marker of blockedMarkers) {
        expect(source).not.toContain(marker);
      }
    }
  });

  it("policy pages do not include payment implementation markers", () => {
    const blockedMarkers = [
      "createPayment",
      "confirmPayment",
      "TossPayments",
      "Paddle",
      "fetch(",
      "process.env",
    ];

    for (const source of policyPageSources) {
      for (const marker of blockedMarkers) {
        expect(source).not.toContain(marker);
      }
    }
  });
});
