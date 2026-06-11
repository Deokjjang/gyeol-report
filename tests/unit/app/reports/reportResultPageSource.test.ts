import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(
  join(process.cwd(), "src/app/reports/[reportId]/page.tsx"),
  "utf8",
);

describe("report result page source", () => {
  it("renders generated report draft sections and safe fallback states", () => {
    const requiredMarkers = [
      "사주×MBTI 종합 리포트",
      "draft.openingTitle",
      "draft.openingSummary",
      "draft.coreLine",
      "draft.sections.map",
      "<details",
      "section.titleKo",
      "section.oneLine",
      "section.body",
      "근거 요약",
      "사주 근거",
      "MBTI 보조 근거",
      "최종 조언",
      "리포트 준비 완료",
      "결제가 완료되었고 리포트가 생성되었습니다.",
      "상세 리포트 생성 대기 중입니다.",
      "리포트를 찾을 수 없습니다.",
      "결제가 완료된 리포트만 조회할 수 있습니다.",
      "리포트 정보가 올바르지 않습니다.",
      "저장된 리포트 형식을 확인할 수 없습니다.",
      "getPaidReportResult",
    ];
    const blockedMarkers = [
      "callOpenAIReportWriter",
      "generateComprehensiveReportDraft",
      "saveComprehensiveReportDraftSnapshot",
      "confirmTossPayment",
      "payment" + "Key",
      "provider" + "PaymentId",
      "provider" + "_payment" + "_id",
      "input" + "Snapshot",
      "input" + "_snapshot",
      "share" + "Token",
      "access" + "TokenHash",
      "OPENAI" + "_API" + "_KEY",
      "SUPABASE" + "_SERVICE" + "_ROLE",
      "service" + "_role",
      "현" + "침살",
      "망" + "신살",
      "백" + "호대살",
      "홍" + "염살",
      "재" + "다신약",
      "제" + "다신약",
      "바" + "넘",
      "Bar" + "num",
    ];

    for (const marker of requiredMarkers) {
      expect(source).toContain(marker);
    }

    for (const marker of blockedMarkers) {
      expect(source).not.toContain(marker);
    }
  });
});
