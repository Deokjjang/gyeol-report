import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(
  join(process.cwd(), "docs/report-product-ssot.md"),
  "utf8",
);

describe("report product SSOT document", () => {
  it("locks product, interpretation, voice, and UI standards", () => {
    const requiredMarkers = [
      "Report Product SSOT v0.1",
      "명리 계산값 + MBTI 지식베이스 + bridge engine",
      "외부 사용자는 명리 기반 리포트 + MBTI 성향 보정",
      "~일 수 있습니다",
      "신호가 있어요",
      "젊은 사용자",
      "single/solo",
      "dating",
      "married",
      "breakup_reunion",
      "unknown",
      "결혼 생각 있음",
      "미입력이라서",
      "만세력표",
      "MBTI표",
      "#8CB84A",
      "#E96B72",
      "#D39A3A",
      "#F2CF63",
      "#7DB9D8",
      "가까운 키워드 30",
      "먼 키워드 30",
      "원문 그대로 출력",
      "type MbtiKnowledgeProfile",
      "type MbtiTrait",
      "type MyeongliMbtiBridge",
      "type MbtiRelationInsight",
      "현침살 + ENTJ",
      "도화/홍염 + ESFP",
      "직업 리포트는 현재 직업에 갇히지",
      "세운은 현재 대운과 MBTI 반영",
      "대운은 현재 세운과 MBTI 반영",
      "실제 자녀",
      "전체 리포트 복사",
      "AI 붙여넣기용 요약",
      "v1.0",
      "특정 종목 매수/매도",
      "카드 과다 분할 방지",
      "PHASE 0",
      "PHASE 10",
    ];

    for (const marker of requiredMarkers) {
      expect(source).toContain(marker);
    }
  });
});
