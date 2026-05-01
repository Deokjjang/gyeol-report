import { describe, expect, it } from "vitest";
import { evaluateSajuMbtiBridge } from "@/lib/bridge/evaluate";
import { getMbtiProfile } from "@/lib/mbti/types";
import type { SajuTag } from "@/lib/saju/tags";

function createTag(code: SajuTag["code"]): SajuTag {
  return {
    code,
    category: "NOTICE",
    severity: "INFO",
    confidence: "HIGH",
    labelKo: code,
    descriptionKo: "테스트용 태그입니다.",
    evidence: [`test:${code}`],
  };
}

const forbiddenWords = [
  "무조" + "건",
  "반드" + "시",
  "운" + "명",
  "죽" + "음",
  "사고가 " + "난다",
  "바람기가 " + "있다",
  "돈복이 " + "있다",
  "결혼" + "한다",
  "망" + "한다",
  "절" + "대",
  "항" + "상",
] as const;

describe("evaluateSajuMbtiBridge", () => {
  it("returns empty signals when no rule matches", () => {
    const result = evaluateSajuMbtiBridge({
      sajuTags: [],
      mbtiProfile: getMbtiProfile("ENTJ"),
    });

    expect(result).toEqual({
      mbtiType: "ENTJ",
      signals: [],
      notices: [],
    });
  });

  it("matches DIRECTNESS_OVERLAP", () => {
    const result = evaluateSajuMbtiBridge({
      sajuTags: [createTag("BRANCH_CLASH_PRESENT")],
      mbtiProfile: getMbtiProfile("ENTJ"),
    });
    const signal = result.signals.find(
      (item) => item.titleKo === "직선성과 충돌 민감성의 겹침",
    );

    expect(result.mbtiType).toBe("ENTJ");
    expect(result.notices).toEqual([]);
    expect(signal).toBeDefined();
    expect(signal?.direction).toBe("OVERLAP");
    expect(signal?.strength).toBe("MEDIUM");
    expect(signal?.confidence).toBe("MEDIUM");
    expect(signal?.evidence).toEqual([
      {
        sajuTagCode: "BRANCH_CLASH_PRESENT",
        reasonKo: "사주 태그 BRANCH_CLASH_PRESENT가 감지되었습니다.",
      },
      {
        mbtiTraitCode: "DIRECT_DECISION",
        reasonKo: "MBTI 특성 DIRECT_DECISION가 감지되었습니다.",
      },
      {
        mbtiTraitCode: "CONFLICT_DIRECTNESS",
        reasonKo: "MBTI 특성 CONFLICT_DIRECTNESS가 감지되었습니다.",
      },
    ]);
  });

  it("requires all required MBTI traits", () => {
    const result = evaluateSajuMbtiBridge({
      sajuTags: [createTag("BRANCH_CLASH_PRESENT")],
      mbtiProfile: getMbtiProfile("ESTJ"),
    });

    expect(
      result.signals.some(
        (signal) => signal.titleKo === "직선성과 충돌 민감성의 겹침",
      ),
    ).toBe(false);
  });

  it("requires all required Saju tags", () => {
    const result = evaluateSajuMbtiBridge({
      sajuTags: [],
      mbtiProfile: getMbtiProfile("ENTJ"),
    });

    expect(
      result.signals.some(
        (signal) => signal.titleKo === "직선성과 충돌 민감성의 겹침",
      ),
    ).toBe(false);
  });

  it("preserves BRIDGE_RULES order for multiple matches", () => {
    const result = evaluateSajuMbtiBridge({
      sajuTags: [
        createTag("BRANCH_CLASH_PRESENT"),
        createTag("WEALTH_OVERLOAD"),
      ],
      mbtiProfile: getMbtiProfile("ENTJ"),
    });

    expect(result.signals.map((signal) => signal.titleKo)).toEqual([
      "직선성과 충돌 민감성의 겹침",
      "현실 책임과 효율 지향의 겹침",
      "갈등을 정면으로 다루는 구조",
    ]);
  });

  it("matches compensation rule", () => {
    const result = evaluateSajuMbtiBridge({
      sajuTags: [createTag("RESOURCE_SUPPORT_MISSING")],
      mbtiProfile: getMbtiProfile("INTJ"),
    });

    expect(result.signals).toHaveLength(1);
    expect(result.signals[0]?.direction).toBe("COMPENSATION");
    expect(result.signals[0]?.titleKo).toBe(
      "부족한 인성 흐름을 사고 정리로 보완",
    );
  });

  it("creates deterministic evidence order", () => {
    const result = evaluateSajuMbtiBridge({
      sajuTags: [createTag("RESOURCE_SUPPORT_MISSING")],
      mbtiProfile: getMbtiProfile("INTJ"),
    });

    expect(result.signals[0]?.evidence).toEqual([
      {
        sajuTagCode: "RESOURCE_SUPPORT_MISSING",
        reasonKo: "사주 태그 RESOURCE_SUPPORT_MISSING가 감지되었습니다.",
      },
      {
        mbtiTraitCode: "INTERNAL_PROCESSING",
        reasonKo: "MBTI 특성 INTERNAL_PROCESSING가 감지되었습니다.",
      },
      {
        mbtiTraitCode: "ABSTRACT_PATTERNING",
        reasonKo: "MBTI 특성 ABSTRACT_PATTERNING가 감지되었습니다.",
      },
    ]);
  });

  it("does not mutate inputs", () => {
    const sajuTags = [createTag("BRANCH_CLASH_PRESENT")];
    const mbtiProfile = getMbtiProfile("ENTJ");
    const beforeTags = structuredClone(sajuTags);
    const beforeProfile = structuredClone(mbtiProfile);

    evaluateSajuMbtiBridge({ sajuTags, mbtiProfile });

    expect(sajuTags).toEqual(beforeTags);
    expect(mbtiProfile).toEqual(beforeProfile);
  });

  it("does not include forbidden wording in produced signals", () => {
    const result = evaluateSajuMbtiBridge({
      sajuTags: [
        createTag("BRANCH_CLASH_PRESENT"),
        createTag("WEALTH_OVERLOAD"),
      ],
      mbtiProfile: getMbtiProfile("ENTJ"),
    });

    for (const signal of result.signals) {
      for (const word of forbiddenWords) {
        expect(signal.titleKo).not.toContain(word);
        expect(signal.summaryKo).not.toContain(word);
        for (const evidence of signal.evidence) {
          expect(evidence.reasonKo).not.toContain(word);
        }
      }
    }
  });

  it("returns deterministic results", () => {
    const input = {
      sajuTags: [
        createTag("BRANCH_CLASH_PRESENT"),
        createTag("WEALTH_OVERLOAD"),
      ],
      mbtiProfile: getMbtiProfile("ENTJ"),
    };

    expect(evaluateSajuMbtiBridge(input)).toEqual(
      evaluateSajuMbtiBridge(input),
    );
  });
});
