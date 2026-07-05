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
      "renderTableSlot(\"기초 만세력\", manseRyeokTable)",
      "renderTableSlot(\"MBTI 성향표\", mbtiProfileTable)",
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
      'data-love-marriage-child-report-section="relationship_fit_profile"',
      "잘 맞기 쉬운 관계 스타일",
      "당신은 이런 결의 사람과 오래 갑니다",
      'data-love-marriage-child-report-section="relationship_fatigue_profile"',
      "피로해지는 관계 스타일",
      "이런 관계는 오래 버티기 어렵습니다",
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

  it("renders a direct but non-deterministic relationship fit profile", () => {
    for (const marker of [
      "buildRelationshipFitGroups",
      "생각이 깊고 독립적인 사람",
      "생기와 감정 표현을 보태 주는 사람",
      "말의 온도를 낮춰 주는 사람",
      "책임 기준이 흐리지 않은 사람",
      "INTJ·INTP·ENFP·ISFP",
      "식상·인성 보완",
      "실제 특정 상대와 맞는지는 상대의 사주와 MBTI까지 함께 보는",
      "궁합 리포트의 영역",
    ]) {
      expect(source).toContain(marker);
    }

    expect(source).not.toContain("반드시 잘 맞습니다");
    expect(source).not.toContain("궁합 확정");
  });

  it("renders fatigue relationship patterns without turning them into fate claims", () => {
    for (const marker of [
      "buildRelationshipFatigueGroups",
      "감정 확인만 반복하는 사람",
      "말은 많은데 책임이 약한 사람",
      "기준을 전부 통제로 받는 사람",
      "침묵과 회피로 버티는 사람",
      "돈과 역할을 흐릿하게 두는 사람",
    ]) {
      expect(source).toContain(marker);
    }

    expect(source).not.toContain("무조건 피해야 합니다");
  });

  it("renders Myeongli basis groups from evidence when available", () => {
    for (const marker of [
      "buildMyeongliSignalGroups",
      "resolvedEvidencePacket",
      "pickTenGodLabels",
      "fullPillars.flatMap",
      "normalizeInteractionLabels",
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

    expect(source).toContain("이번 화면에서는 본문을 중심으로 관계 기준을 읽습니다.");
    expect(source).not.toContain("draft 본문");
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
