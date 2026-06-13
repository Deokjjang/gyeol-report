import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { findUnsafeVisibleCopy } from "../../../src/lib/legal/copySafety";

const source = readFileSync(
  join(process.cwd(), "docs/toss-pg-review-checkout-path.md"),
  "utf8",
);

describe("Toss PG review checkout path document", () => {
  it("documents the required capture sequence and screen-level copy", () => {
    const requiredMarkers = [
      "토스페이먼츠 결제경로 캡처 체크리스트",
      "캡처 순서",
      "메인 페이지",
      "상품 목록 페이지",
      "상품 상세 페이지",
      "리포트 입력 페이지",
      "입력값 완료 상태",
      "결제 직전 확인",
      "필수 체크박스 전체 체크 후 결제 버튼 활성화 상태",
      "토스 결제창",
      "결제 성공 화면",
      "리포트 결과 화면",
      "사업자정보",
      "이용약관",
      "개인정보처리방침",
      "환불정책",
      "총 결제금액 990원",
      "결제 후 온라인 열람",
      "자동 생성 디지털 리포트",
      "990원 결제하고 리포트 생성하기",
      "PPT 구성 권장 순서",
      "주의사항",
    ];

    for (const marker of requiredMarkers) {
      expect(source).toContain(marker);
    }
  });

  it("documents local review URLs including policy route variants", () => {
    const requiredUrls = [
      "http://localhost:3000/",
      "http://localhost:3000/products",
      "http://localhost:3000/products/saju-mbti-full",
      "http://localhost:3000/report/new",
      "http://localhost:3000/payments/toss/success",
      "http://localhost:3000/reports/<report_id>",
      "http://localhost:3000/business",
      "http://localhost:3000/terms",
      "http://localhost:3000/privacy",
      "http://localhost:3000/refund",
      "http://localhost:3000/legal/business-info",
      "http://localhost:3000/legal/terms",
      "http://localhost:3000/legal/privacy",
      "http://localhost:3000/legal/refund",
    ];

    for (const url of requiredUrls) {
      expect(source).toContain(url);
    }
  });

  it("does not introduce unsafe product claims", () => {
    expect(findUnsafeVisibleCopy(source)).toEqual([]);
  });
});
