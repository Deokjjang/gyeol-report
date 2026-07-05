import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(
  join(
    process.cwd(),
    "src/app/reports/[reportId]/LoveMarriageChildReportView.tsx",
  ),
  "utf8",
);

describe("LoveMarriageChildReportView source", () => {
  it("defines the launch result view props and table slots", () => {
    for (const marker of [
      "type LoveMarriageChildReportViewProps",
      "readonly draft: LoveMarriageChildReportDraft",
      "readonly evidencePacket?: LoveMarriageChildReportEvidencePacket",
      "readonly manseRyeokTable?: ReactNode",
      "readonly mbtiProfileTable?: ReactNode",
      "renderTableSlot(\"공통 만세력표\", manseRyeokTable)",
      "renderTableSlot(\"공통 MBTI표\", mbtiProfileTable)",
    ]) {
      expect(source).toContain(marker);
    }
  });

  it("renders the required top flow and body sections", () => {
    for (const marker of [
      'data-love-marriage-child-report-section="report_header"',
      'data-love-marriage-child-report-section="common_tables"',
      'data-love-marriage-child-report-section="myeongli_signal_basis"',
      'data-love-marriage-child-report-section="opening_summary"',
      "핵심 요약",
      "사랑 방식",
      "끌리는 사람과 반복 패턴",
      "연애에서 강한 점",
      "연애에서 자주 막히는 점",
      "결혼 생활 리듬",
      "돈/가사/역할 분담",
      "갈등 회복 방식",
      "내가 부모가 되었을 때",
      "이별/재회 고민이 있을 때",
      "관계 타이밍 힌트",
      "실행 기준",
      "리스크 관리",
      "안전 안내",
    ]) {
      expect(source).toContain(marker);
    }
  });

  it("renders Myeongli basis groups from evidence when available", () => {
    for (const marker of [
      "buildMyeongliSignalGroups",
      "resolvedEvidencePacket",
      "pickTenGodSignals",
      "재성",
      "관성",
      "식상",
      "인성",
      "비겁",
      "도화·홍염",
      "현침·화개",
      "귀인",
      "합충형파해",
      "표에 나온 신호를 관계 장면으로 풀어 읽습니다",
    ]) {
      expect(source).toContain(marker);
    }
  });

  it("keeps parent-mode and breakup/reunion copy inside safe boundaries", () => {
    expect(source).toContain("부모 역할 패턴");
    expect(source).toContain("주의할 투사");
    expect(source).toContain("내 반복 패턴");
    expect(source).toContain("감정 처리");
    expect(source).toContain("회복 경계선");

    for (const forbidden of [
      "자녀운",
      "자녀 성향",
      "자식복",
      "재회 확률",
      "상대가 돌아온다",
    ]) {
      expect(source).not.toContain(forbidden);
    }
  });

  it("does not connect route, product flow, payment, persistence, or API code", () => {
    for (const forbidden of [
      "checkout",
      "payment",
      "persistence",
      "supabase",
      "createReport",
      "report/new",
    ]) {
      expect(source).not.toContain(forbidden);
    }
  });
});
