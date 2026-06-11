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
    const source = readAppFile("src/app/refund/page.tsx");
    const expectedMarkers = [
      "환불 안내",
      "출시 전 초안",
      "실제 결제는 아직 활성화되어 있지 않습니다",
      "결제 실패",
      "전체 리포트",
      "support@dvem.ai",
      "홈으로 돌아가기",
      'href="/"',
    ];

    for (const marker of expectedMarkers) {
      expect(source).toContain(marker);
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
