import { describe, expect, it } from "vitest";

import { selectMbtiKnowledge } from "../../../src/lib/report-knowledge/mbtiKnowledgeSelector";

describe("REPORT-17 MBTI knowledge selector", () => {
  it("selects INTP-specific scenes for comprehensive reports", () => {
    const selected = selectMbtiKnowledge({
      mbti: "INTP",
      contexts: ["core_identity", "study", "money"],
      productType: "comprehensive",
    });

    expect(selected?.mbti).toBe("INTP");
    expect(selected?.selectedTraits.some(t => t.sourceEvidenceId === "mbti:INTP:traits:thinkingStyle:ti_internal_model")).toBe(true);
    expect(selected?.selectedTraits.some(t => t.sourceEvidenceId === "mbti:INTP:traits:money:automated_money_routine")).toBe(true);
    expect(selected?.selectedSwitches.length).toBeGreaterThan(0);
  });

  it("selects ENTJ-specific scenes for comprehensive reports", () => {
    const selected = selectMbtiKnowledge({
      mbti: "ENTJ",
      contexts: ["core_identity", "work", "money"],
      productType: "comprehensive",
    });

    expect(selected?.mbti).toBe("ENTJ");
    expect(selected?.selectedTraits.some(t => t.sourceEvidenceId === "mbti:ENTJ:traits:career:large_team_manager")).toBe(true);
    expect(selected?.selectedTraits.some(t => t.sourceEvidenceId === "mbti:ENTJ:traits:money:expansion_reserve_limit")).toBe(true);
  });

  it("returns empty for products where MBTI is not a core layer", () => {
    expect(
      selectMbtiKnowledge({
        mbti: "INTP",
        contexts: ["core_identity"],
        productType: "yearly_flow",
      }),
    ).toBeUndefined();
  });

  it("returns empty when MBTI input is absent", () => {
    expect(
      selectMbtiKnowledge({
        mbti: null,
        contexts: ["core_identity"],
        productType: "comprehensive",
      }),
    ).toBeUndefined();
  });
});
