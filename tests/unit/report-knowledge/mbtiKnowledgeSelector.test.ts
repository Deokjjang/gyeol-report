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
    expect(selected?.selectedScenes.join("\n")).toContain("혼자 자료를 찾아보고");
    expect(selected?.selectedScenes.join("\n")).toContain("목차");
    expect(selected?.selectedSwitches.length).toBeGreaterThan(0);
  });

  it("selects ENTJ-specific scenes for comprehensive reports", () => {
    const selected = selectMbtiKnowledge({
      mbti: "ENTJ",
      contexts: ["core_identity", "work", "money"],
      productType: "comprehensive",
    });

    expect(selected?.mbti).toBe("ENTJ");
    expect(selected?.selectedScenes.join("\n")).toContain("담당자, 기준, 마감선");
    expect(selected?.selectedScenes.join("\n")).toContain("수익 모델");
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
