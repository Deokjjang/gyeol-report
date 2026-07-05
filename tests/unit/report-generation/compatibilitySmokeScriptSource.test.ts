import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const smokeSource = readFileSync(
  join(process.cwd(), "scripts/smoke_generate_compatibility_report_draft.ts"),
  "utf8",
);

describe("compatibility smoke report draft source", () => {
  it("creates a screen QA fallback snapshot when the writer is disabled", () => {
    expect(smokeSource).toContain("buildScreenQaCompatibilityDraft");
    expect(smokeSource).toContain("handleScreenQaFallback");
    expect(smokeSource).toContain("getRelationshipTypeOverride");
    expect(smokeSource).toContain("--relationshipType");
    expect(smokeSource).toContain("relationship type override:");
    expect(smokeSource).toContain("relationshipType: relationshipTypeOverride");
    expect(smokeSource).toContain("SKIPPED, OpenAI writer not enabled");
    expect(smokeSource).toContain("fallback screen QA draft generated");
    expect(smokeSource).toContain("relationshipAnalysis: present");
    expect(smokeSource).toContain("writeCompatibilityPreviewSnapshot");
    expect(smokeSource).toContain("getCompatibilityPreviewUrl");
    expect(smokeSource).toContain("A가 주는 피로와 B가 주는 피로");
    expect(smokeSource).toContain("끌림은 빠르게 생기지만");
    expect(smokeSource).toContain("대화 속도가 안 맞을 때 빠르게 피곤해집니다");
    expect(smokeSource).toContain("해결을 위해 속도를 내면");
    expect(smokeSource).toContain("결론 속도와 기준 제시가 빠를 때");
    expect(smokeSource).toContain("리스크 관리는 감정 설득보다 조기 조율");
    expect(smokeSource).not.toContain("申子辰 삼합 수 흐름");
    expect(smokeSource).not.toContain("亥卯未 삼합 목 흐름");
    expect(smokeSource).not.toContain("丑未 충");
    expect(smokeSource).not.toContain("子未 해");
    expect(smokeSource).not.toContain("申亥 해");
  });

  it("keeps the fallback output away from fixed outcome claims", () => {
    expect(smokeSource).not.toContain("무조건 헤어짐");
    expect(smokeSource).not.toContain("반드시 결혼");
    expect(smokeSource).not.toContain("절대 안 맞음");
    expect(smokeSource).not.toContain("파국");
    expect(smokeSource).not.toContain("이혼한다");
    expect(smokeSource).not.toContain("재회 확률");
    expect(smokeSource).not.toContain("사업 성공 보장");
    expect(smokeSource).not.toContain("수익 보장");
  });
});
