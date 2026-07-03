import { describe, expect, it } from "vitest";

import {
  buildMyeongliMbtiBridgePacket,
  buildProductBridgeEvidence,
  mapCompatibilityRelationCategory,
  PRODUCT_BRIDGE_KEYS,
  type MyeongliSignal,
} from "../../../../src/lib/report-knowledge/bridge";

const sampleSignals = [
  {
    kind: "tenGod",
    label: "편관",
    evidence: "책임과 압박 신호가 강하다.",
  },
  {
    kind: "element",
    label: "금",
    evidence: "판단 기준이 또렷하다.",
  },
  {
    kind: "shinsal",
    label: "현침살",
    evidence: "표현이 날카롭게 전달될 수 있다.",
  },
] as const satisfies readonly MyeongliSignal[];

describe("product bridge adapter", () => {
  it("exposes the supported product keys", () => {
    expect(PRODUCT_BRIDGE_KEYS).toEqual([
      "general",
      "careerMoneyStudy",
      "loveMarriageChild",
      "compatibility",
      "daeun",
      "saeun",
    ]);
  });

  it("splits general bridge evidence into product buckets", () => {
    const packet = buildMyeongliMbtiBridgePacket({
      mbtiType: "ENTJ",
      productContext: "general",
      myeongliSignals: sampleSignals,
    });
    const productEvidence = buildProductBridgeEvidence(packet, "general");

    expect(productEvidence.productKey).toBe("general");
    expect(productEvidence.primaryEvidence.length).toBeGreaterThan(0);
    expect(productEvidence.cautionEvidence.length).toBeGreaterThan(0);
    expect(productEvidence.primaryEvidence[0]?.purposes).toEqual(
      expect.arrayContaining(["identity", "growth", "caution"]),
    );
    expect(productEvidence.recommendedTone).toContain("명리 중심");
  });

  it("splits career money study evidence into career buckets", () => {
    const packet = buildMyeongliMbtiBridgePacket({
      mbtiType: "ENTJ",
      productContext: "careerMoneyStudy",
      myeongliSignals: sampleSignals.slice(0, 2),
    });
    const productEvidence = buildProductBridgeEvidence(
      packet,
      "careerMoneyStudy",
    );

    expect(productEvidence.primaryEvidence.length).toBeGreaterThan(0);
    expect(productEvidence.primaryEvidence[0]?.purposes).toEqual(
      expect.arrayContaining(["career", "money", "investment", "study"]),
    );
    expect(productEvidence.forbiddenAngles).toEqual(
      expect.arrayContaining(["수익 확정", "합격 확정", "승진·이직 확정"]),
    );
  });

  it("splits compatibility evidence and keeps relationship purpose", () => {
    const packet = buildMyeongliMbtiBridgePacket({
      mbtiType: "ENTJ",
      productContext: "compatibility",
      myeongliSignals: [],
      withMbtiType: "ISFP",
    });
    const productEvidence = buildProductBridgeEvidence(packet, "compatibility");

    expect(productEvidence.primaryEvidence.length).toBeGreaterThan(0);
    expect(productEvidence.primaryEvidence[0]?.purposes).toContain("relationship");
    expect(productEvidence.cautionEvidence.length).toBeGreaterThan(0);
    expect(productEvidence.forbiddenAngles).toEqual(
      expect.arrayContaining(["절대 안 맞음", "관계 파탄 확정", "결혼 확정"]),
    );
  });

  it("marks daeun and saeun evidence as timing evidence", () => {
    const daeunPacket = buildMyeongliMbtiBridgePacket({
      mbtiType: "ENTJ",
      productContext: "daeun",
      myeongliSignals: sampleSignals.slice(0, 1),
    });
    const saeunPacket = buildMyeongliMbtiBridgePacket({
      mbtiType: "ENTJ",
      productContext: "saeun",
      myeongliSignals: sampleSignals.slice(0, 1),
    });

    expect(
      buildProductBridgeEvidence(daeunPacket, "daeun").primaryEvidence[0]?.purposes,
    ).toContain("timing");
    expect(
      buildProductBridgeEvidence(saeunPacket, "saeun").primaryEvidence[0]?.purposes,
    ).toContain("timing");
  });

  it("maps compatibility relation category terms from specs and implementation", () => {
    expect(mapCompatibilityRelationCategory("business_work_partner")).toBe(
      "businessPartner",
    );
    expect(mapCompatibilityRelationCategory("businessPartner")).toBe(
      "businessPartner",
    );
    expect(mapCompatibilityRelationCategory("workplace_colleague")).toBe(
      "workplaceColleague",
    );
    expect(mapCompatibilityRelationCategory("coworker")).toBe(
      "workplaceColleague",
    );
    expect(mapCompatibilityRelationCategory("boss_subordinate")).toBe(
      "bossSubordinate",
    );
    expect(mapCompatibilityRelationCategory("managerReport")).toBe(
      "bossSubordinate",
    );
    expect(mapCompatibilityRelationCategory("parent_child")).toBe("parentChild");
    expect(mapCompatibilityRelationCategory("parentChild")).toBe("parentChild");
    expect(mapCompatibilityRelationCategory("friend_social")).toBe("friendSocial");
    expect(mapCompatibilityRelationCategory("friendship")).toBe("friendSocial");
    expect(mapCompatibilityRelationCategory("unknown")).toBeNull();
  });

  it("keeps forbidden angles even for empty packets", () => {
    const emptyPacket = buildMyeongliMbtiBridgePacket({
      mbtiType: "UNKNOWN",
      productContext: "general",
      myeongliSignals: sampleSignals,
    });
    const productEvidence = buildProductBridgeEvidence(emptyPacket, "general");

    expect(productEvidence.primaryEvidence).toEqual([]);
    expect(productEvidence.supportingEvidence).toEqual([]);
    expect(productEvidence.cautionEvidence).toEqual([]);
    expect(productEvidence.forbiddenAngles).toEqual(
      expect.arrayContaining([
        "명리 신호와 MBTI 성향을 같은 원인으로 단정하지 않는다.",
        "확정 예언, 진단, 보장 문장으로 쓰지 않는다.",
        "관계 파탄, 결혼 확정, 수익 확정 같은 결론으로 쓰지 않는다.",
      ]),
    );
  });
});
