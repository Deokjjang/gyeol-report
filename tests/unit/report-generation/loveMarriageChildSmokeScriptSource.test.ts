import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const scriptSource = readFileSync(
  join(
    process.cwd(),
    "scripts/smoke_generate_love_marriage_child_report_draft.ts",
  ),
  "utf8",
);

describe("smoke_generate_love_marriage_child_report_draft source", () => {
  it("supports deokmin-love fixture and write-preview mode", () => {
    expect(scriptSource).toContain("--fixture");
    expect(scriptSource).toContain("--write-preview");
    expect(scriptSource).toContain("deokmin-love");
    expect(scriptSource).toContain(".tmp/love-marriage-child-report-preview");
    expect(scriptSource).toContain("getPreviewUrl");
    expect(scriptSource).toContain("love-marriage-child-report-preview");
  });

  it("uses writer disabled fallback without a static writer import", () => {
    expect(scriptSource).toContain("OPENAI_REPORT_WRITER_ENABLED");
    expect(scriptSource).toContain("OpenAI writer disabled");
    expect(scriptSource).toContain("OpenAI writer env incomplete");
    expect(scriptSource).toContain("buildScreenQaDraft");
    expect(scriptSource).toContain("handleScreenQaDraft");
    expect(scriptSource).toContain("await import(");
    expect(scriptSource).toContain(
      "../src/lib/report-generation/openaiLoveMarriageChildReportWriter",
    );
    expect(scriptSource).not.toContain(
      "from \"../src/lib/report-generation/openaiLoveMarriageChildReportWriter\"",
    );
  });

  it("includes all launch preview draft sections", () => {
    for (const marker of [
      "headline",
      "openingSummary",
      "loveStyle",
      "attractionPattern",
      "loveStrengths",
      "loveFriction",
      "marriageRhythm",
      "householdMoneyAndRoleSplit",
      "conflictRecovery",
      "parentMode",
      "breakupReunionPattern",
      "relationshipTimingHints",
      "actionPlan",
      "riskManagement",
      "safetyNotes",
    ]) {
      expect(scriptSource).toContain(marker);
    }
  });

  it("adds direct relationship-fit guidance without turning into compatibility judgment", () => {
    for (const marker of [
      "INTJ·INTP·ENFP·ISFP 후보",
      "상관·인성처럼 표현과 완충",
      "귀인형 조율감",
      "실제 궁합은 상대의 사주와 MBTI까지 함께 봐야 합니다",
      "추천 MBTI는 확정 궁합이 아니라",
      "감정 확인은 많지만 행동 기준이 흐린 사람",
      "침묵이나 회피로 버티는 사람",
    ]) {
      expect(scriptSource).toContain(marker);
    }

    expect(scriptSource).not.toContain("반드시 잘 맞습니다");
    expect(scriptSource).not.toContain("궁합 확정");
  });

  it("includes full four-pillar fixture data for the preview manse ryeok table", () => {
    expect(scriptSource).toContain("fullPillars");

    for (const marker of [
      "key: \"year\"",
      "key: \"month\"",
      "key: \"day\"",
      "key: \"hour\"",
      "stemTenGod",
      "branchTenGod",
      "hiddenStems",
      "twelveLifeStage",
      "twelveSinsal",
      "sinsal",
      "gwiin",
      "interactions",
    ]) {
      expect(scriptSource).toContain(marker);
    }

    expect(scriptSource).toContain("연일 천간합 甲己");
    expect(scriptSource).not.toContain("申亥해");
    expect(scriptSource).not.toContain("도화살");
    expect(scriptSource).not.toContain("홍염살");
    expect(scriptSource).not.toContain("\"식신\"");
  });

  it("keeps child and breakup reunion wording inside safe boundaries", () => {
    expect(scriptSource).toContain("부모가 되었을 때");
    expect(scriptSource).toContain("내 반복 패턴");
    expect(scriptSource).toContain("감정 처리");

    for (const forbidden of [
      "자녀운",
      "자식복",
      "재회 확률",
      "상대가 돌아온다",
      "placeholder",
    ]) {
      expect(scriptSource).not.toContain(forbidden);
    }
  });
});
