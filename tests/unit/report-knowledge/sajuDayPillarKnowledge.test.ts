import { describe, expect, it } from "vitest";

import {
  findUnsafeSajuDayPillarClaims,
  requireSajuDayPillarEntry,
  SAJU_DAY_PILLAR_KNOWLEDGE,
} from "../../../src/lib/report-knowledge/sajuDayPillarKnowledge";

const REQUIRED_DAY_PILLAR_LABELS = [
  "갑자일주",
  "을축일주",
  "병인일주",
  "정묘일주",
  "무진일주",
  "기사일주",
  "경오일주",
  "신미일주",
  "임신일주",
  "계유일주",
  "갑술일주",
  "을해일주",
  "병자일주",
  "정축일주",
  "무인일주",
  "기묘일주",
  "경진일주",
  "신사일주",
  "임오일주",
  "계미일주",
  "갑신일주",
  "을유일주",
  "병술일주",
  "정해일주",
  "무자일주",
  "기축일주",
  "경인일주",
  "신묘일주",
  "임진일주",
  "계사일주",
  "갑오일주",
  "을미일주",
  "병신일주",
  "정유일주",
  "무술일주",
  "기해일주",
  "경자일주",
  "신축일주",
  "임인일주",
  "계묘일주",
  "갑진일주",
  "을사일주",
  "병오일주",
  "정미일주",
  "무신일주",
  "기유일주",
  "경술일주",
  "신해일주",
  "임자일주",
  "계축일주",
  "갑인일주",
  "을묘일주",
  "병진일주",
  "정사일주",
  "무오일주",
  "기미일주",
  "경신일주",
  "신유일주",
  "임술일주",
  "계해일주",
] as const;

function combinedVisibleText(entry: (typeof SAJU_DAY_PILLAR_KNOWLEDGE)[number]) {
  return [
    entry.elementImage,
    entry.symbolicImage,
    entry.personality,
    entry.workMoney,
    entry.loveRelationship,
    entry.familyPeople,
    entry.growth,
    entry.positiveReading,
    entry.cautionReading,
    entry.practicalUse,
    ...entry.coreKeywords,
    ...entry.sceneSeeds,
    ...entry.phraseSeeds,
  ].join("\n");
}

describe("saju day pillar knowledge", () => {
  it("contains all 60 day pillars", () => {
    expect(SAJU_DAY_PILLAR_KNOWLEDGE).toHaveLength(60);

    for (const labelKo of REQUIRED_DAY_PILLAR_LABELS) {
      expect(requireSajuDayPillarEntry(labelKo).labelKo).toBe(labelKo);
    }
  });

  it("keeps every day pillar entry useful and non-placeholder", () => {
    for (const entry of SAJU_DAY_PILLAR_KNOWLEDGE) {
      const text = combinedVisibleText(entry);

      expect(entry.symbolicImage.length).toBeGreaterThan(20);
      expect(entry.coreKeywords.length).toBeGreaterThanOrEqual(3);
      expect(entry.personality.length).toBeGreaterThan(80);
      expect(entry.workMoney.length).toBeGreaterThan(80);
      expect(entry.loveRelationship.length).toBeGreaterThan(80);
      expect(entry.growth.length).toBeGreaterThan(80);
      expect(entry.positiveReading.length).toBeGreaterThan(35);
      expect(entry.cautionReading.length).toBeGreaterThan(35);
      expect(entry.practicalUse.length).toBeGreaterThan(35);
      expect(entry.sceneSeeds.length).toBeGreaterThanOrEqual(3);
      expect(entry.phraseSeeds.length).toBeGreaterThanOrEqual(3);
      expect(text).not.toMatch(/TODO|추후 작성|sample|임시|placeholder/i);
    }
  });

  it("has richer specific anchors for key example day pillars", () => {
    const gapsin = requireSajuDayPillarEntry("갑신일주");
    const byeongo = requireSajuDayPillarEntry("병오일주");
    const gyehae = requireSajuDayPillarEntry("계해일주");

    expect(gapsin.symbolicImage).toMatch(/나무|금/);
    expect(combinedVisibleText(gapsin)).toContain("압박");
    expect(combinedVisibleText(gapsin)).toContain("자기관리");
    expect(combinedVisibleText(gapsin)).not.toContain("strict self-discipline");

    expect(combinedVisibleText(byeongo)).toMatch(/태양|한낮/);
    expect(combinedVisibleText(byeongo)).toContain("존재감");
    expect(combinedVisibleText(byeongo)).toContain("과열");

    expect(combinedVisibleText(gyehae)).toMatch(/물|깊은/);
    expect(combinedVisibleText(gyehae)).toContain("사색");
    expect(combinedVisibleText(gyehae)).toContain("직관");
  });

  it("maps day pillars to topics, polarity, vividness, and bridge needs", () => {
    const gapsin = requireSajuDayPillarEntry("갑신일주");
    const byeongo = requireSajuDayPillarEntry("병오일주");
    const gyehae = requireSajuDayPillarEntry("계해일주");

    expect(gapsin.relatedTopics).toEqual(
      expect.arrayContaining(["identity", "personality", "work", "growth"]),
    );
    expect(gapsin.vividness).toBe(5);
    expect(gapsin.mbtiBridgeNeeds).toEqual(
      expect.arrayContaining(["responsibility_clarity", "emotional_buffer"]),
    );
    expect(byeongo.relatedTopics).toEqual(expect.arrayContaining(["love", "work"]));
    expect(gyehae.relatedTopics).toEqual(
      expect.arrayContaining(["study", "relationship", "growth"]),
    );
    expect(["positive", "mixed", "warning"]).toContain(gyehae.polarity);
  });

  it("keeps unsafe claims and English residue out of day pillar fields", () => {
    expect(findUnsafeSajuDayPillarClaims()).toEqual([]);
  });
});
