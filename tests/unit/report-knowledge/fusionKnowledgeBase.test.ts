import { describe, expect, it } from "vitest";

import { FUSION_KNOWLEDGE_BASE } from "../../../src/lib/report-knowledge/fusionKnowledgeBase";
import { SAJU_KNOWLEDGE_BY_ID } from "../../../src/lib/report-knowledge/sajuKnowledgeBase";

describe("fusion knowledge base", () => {
  it("contains at least 60 typed fusion rules with required kind density", () => {
    const kindCounts = new Map<string, number>();

    for (const rule of FUSION_KNOWLEDGE_BASE) {
      kindCounts.set(rule.kind, (kindCounts.get(rule.kind) ?? 0) + 1);
    }

    expect(FUSION_KNOWLEDGE_BASE.length).toBeGreaterThanOrEqual(60);
    expect(kindCounts.get("reinforcement")).toBeGreaterThanOrEqual(20);
    expect(kindCounts.get("contrast")).toBeGreaterThanOrEqual(15);
    expect(kindCounts.get("compensation")).toBeGreaterThanOrEqual(10);
    expect(kindCounts.get("topic_specialization")).toBeGreaterThanOrEqual(15);
  });

  it("contains required high-density ENTJ sample rules", () => {
    const summaries = FUSION_KNOWLEDGE_BASE.map((rule) => rule.summary);

    expect(summaries).toEqual(
      expect.arrayContaining([
        "갑신일주 + ENTJ leadership/control",
        "편관 + ENTJ responsibility_pressure",
        "정관 + ENTJ authority_orientation",
        "재성 강함 + ENTJ 성취욕",
        "현침살 + ENTJ 직설성",
        "수 부족/무인성 + ENTJ emotional_dryness",
        "수 부족 + ENTJ 감정 건조함",
        "화 부족 + ENTJ 외향성 contrast",
        "무식상 + ENTJ 자기 어필 contrast",
        "재다신약 + ENTJ 워커홀릭",
        "토 과다 + ENTJ 현실성",
        "금 강함 + ENTJ 판단력",
        "갑목/갑신 + ENTJ 지휘 욕구",
        "편관/정관 + ENTJ 리더십",
        "편재/정재 + ENTJ 돈 구조 설계",
        "재고귀인 + ENTJ 자산화",
        "홍염살 + ENTJ 카리스마",
        "도화살 + ENTJ public_presence",
        "무인성 + ENTJ 들어주는 힘",
        "관성 강함 + ENTJ 높은 기준",
      ]),
    );
  });

  it("contains required generic bridge and contrast rule families", () => {
    const summaries = FUSION_KNOWLEDGE_BASE.map((rule) => rule.summary);

    expect(summaries).toEqual(
      expect.arrayContaining([
        "목 + NT 방향성/전략",
        "토 + TJ 현실/성과/자산 관리",
        "정재 + SJ 안정 자산",
        "편관 + TJ 압박 속 리더십",
        "문창귀인 + NT/NF 글/기획/학습",
        "천을귀인 + F/J/SJ/NF 도움과 보호",
        "화 부족 + E 유형 expression contrast",
        "F 유형 + 금/관성 strong 기준과 책임",
        "T 유형 + 수 강함 감정 깊이",
        "P 유형 + 정관 strong 규칙 책임",
        "J 유형 + 역마살 변화 욕구",
        "I 유형 + 도화/홍염 존재감",
        "S 유형 + 인성/문창 학습 기획",
        "N 유형 + 토 과다 현실 책임",
      ]),
    );
  });

  it("references valid saju entries, keeps saju gating, and numeric priorities", () => {
    for (const rule of FUSION_KNOWLEDGE_BASE) {
      expect(typeof rule.priority).toBe("number");
      expect(Number.isFinite(rule.priority)).toBe(true);
      expect(
        rule.sajuEntryIds.length > 0 ||
          (rule.requiredSajuTags !== undefined && rule.requiredSajuTags.length > 0),
      ).toBe(true);
      expect(rule.phraseSeeds.length).toBeGreaterThan(0);

      for (const id of rule.sajuEntryIds) {
        expect(SAJU_KNOWLEDGE_BY_ID.has(id)).toBe(true);
      }
    }
  });

  it("does not contain deterministic prophecy phrasing", () => {
    const serialized = JSON.stringify(FUSION_KNOWLEDGE_BASE);
    const forbiddenPhrases = [
      "반드시 " + "결혼한다",
      "죽" + "는다",
      "100% " + "확정",
      "절대 " + "성공한다",
      "절대 " + "실패한다",
    ];

    for (const phrase of forbiddenPhrases) {
      expect(serialized).not.toContain(phrase);
    }
  });
});
