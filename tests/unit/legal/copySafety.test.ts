import { describe, expect, it } from "vitest";

import {
  findUnsafeVisibleCopy,
  forbiddenAdvertisingClaimPatterns,
} from "../../../src/lib/legal/copySafety";

describe("copy safety helper", () => {
  it("allows safe report, disclaimer, refund, and price copy", () => {
    const safeCopy = [
      "성향 해석 리포트입니다.",
      "의료·법률·투자 자문을 제공하지 않습니다.",
      "생성 시작 후 단순 변심 환불이 제한될 수 있습니다.",
      "정가 1,290원 / 런칭가 990원 / 총 결제금액 990원",
      "자동 생성 디지털 리포트이며 자기이해와 참고 목적입니다.",
    ].join("\n");

    expect(findUnsafeVisibleCopy(safeCopy)).toEqual([]);
  });

  it("detects hard forbidden advertising and advisory claims", () => {
    const unsafeCopy = [
      "적중률 100%",
      "100% 보장",
      "반드시 성공합니다",
      "운명 확정",
      "우울증 분석",
      "불안장애 분석",
      "투자 추천",
      "법률 자문을 제공합니다",
      "의료 상담을 제공합니다",
      "오늘만 90% 할인",
    ].join("\n");

    expect(findUnsafeVisibleCopy(unsafeCopy)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ term: "적중률", reason: "guarantee" }),
        expect.objectContaining({ term: "100%", reason: "guarantee" }),
        expect.objectContaining({ term: "100% 보장", reason: "guarantee" }),
        expect.objectContaining({ term: "반드시 성공", reason: "certainty" }),
        expect.objectContaining({ term: "운명 확정", reason: "certainty" }),
        expect.objectContaining({ term: "우울증 분석", reason: "medical" }),
        expect.objectContaining({ term: "불안장애 분석", reason: "medical" }),
        expect.objectContaining({ term: "투자 추천", reason: "investment" }),
        expect.objectContaining({ term: "법률 자문", reason: "legal" }),
        expect.objectContaining({ term: "의료 상담", reason: "medical" }),
        expect.objectContaining({ term: "오늘만", reason: "price_exaggeration" }),
        expect.objectContaining({ term: "90% 할인", reason: "price_exaggeration" }),
      ]),
    );
  });

  it("keeps the forbidden pattern list explicit", () => {
    expect(forbiddenAdvertisingClaimPatterns.map((pattern) => pattern.term)).toEqual(
      expect.arrayContaining([
        "적중률",
        "100% 맞춤",
        "100% 정확",
        "100% 보장",
        "보장",
        "무조건",
        "진단",
        "치료",
        "의료 상담",
        "법률 자문",
        "투자 추천",
        "수익 보장",
        "90% 할인",
      ]),
    );
  });
});
