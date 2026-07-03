import { describe, expect, it } from "vitest";

import {
  BRIDGE_PRODUCT_REPORT_USE_CASE_MAP,
  buildMyeongliMbtiBridgePacket,
  type BridgeProductContext,
  type MyeongliSignal,
} from "../../../../src/lib/report-knowledge/bridge";

const sampleSignals = [
  {
    kind: "tenGod",
    label: "편관",
    evidence: "일간 기준 편관이 강하게 잡힌다.",
  },
  {
    kind: "element",
    label: "금",
    evidence: "금 기운이 판단 기준을 강화한다.",
  },
  {
    kind: "shinsal",
    label: "현침살",
    evidence: "언어가 날카롭게 전달될 수 있다.",
  },
] as const satisfies readonly MyeongliSignal[];

describe("buildMyeongliMbtiBridgePacket", () => {
  it("maps product contexts to report use case keys", () => {
    expect(BRIDGE_PRODUCT_REPORT_USE_CASE_MAP).toEqual({
      general: "generalReport",
      careerMoneyStudy: "careerReport",
      loveMarriageChild: "loveMarriageChildReport",
      compatibility: "compatibilityReport",
      daeun: "daeunReport",
      saeun: "saeunReport",
    });

    const contexts = Object.keys(
      BRIDGE_PRODUCT_REPORT_USE_CASE_MAP,
    ) as BridgeProductContext[];

    for (const productContext of contexts) {
      const packet = buildMyeongliMbtiBridgePacket({
        mbtiType: "ENTJ",
        productContext,
        myeongliSignals: sampleSignals.slice(0, 1),
      });

      expect(packet.reportUseCaseKey).toBe(
        BRIDGE_PRODUCT_REPORT_USE_CASE_MAP[productContext],
      );
      expect(packet.evidences[0]?.mbtiEvidence.reportUseCases.length).toBeGreaterThan(
        0,
      );
    }
  });

  it("includes compatibility relationship pair when withMbtiType exists", () => {
    const packet = buildMyeongliMbtiBridgePacket({
      mbtiType: "ENTJ",
      productContext: "compatibility",
      myeongliSignals: [],
      withMbtiType: "isfp",
    });

    expect(packet.relationshipPair?.withType).toBe("ISFP");
    expect(packet.withMbtiType).toBe("ISFP");
    expect(packet.evidences[0]?.mbtiEvidence.relationshipPair?.withType).toBe(
      "ISFP",
    );
    expect(packet.evidences[0]?.intensity).toBe("medium");
  });

  it("calculates intensity from signal count", () => {
    expect(
      buildMyeongliMbtiBridgePacket({
        mbtiType: "ENTJ",
        productContext: "general",
        myeongliSignals: [],
      }).evidences[0]?.intensity,
    ).toBe("low");

    expect(
      buildMyeongliMbtiBridgePacket({
        mbtiType: "ENTJ",
        productContext: "general",
        myeongliSignals: sampleSignals.slice(0, 2),
      }).evidences[0]?.intensity,
    ).toBe("medium");

    expect(
      buildMyeongliMbtiBridgePacket({
        mbtiType: "ENTJ",
        productContext: "general",
        myeongliSignals: sampleSignals,
      }).evidences[0]?.intensity,
    ).toBe("high");
  });

  it("matches MBTI bridge hints against myeongli signals", () => {
    const packet = buildMyeongliMbtiBridgePacket({
      mbtiType: "ENTJ",
      productContext: "careerMoneyStudy",
      myeongliSignals: sampleSignals,
    });
    const evidence = packet.evidences[0];

    expect(evidence?.signalKinds).toEqual(["tenGod", "element", "shinsal"]);
    expect(evidence?.myeongliEvidence.bridgeHints.map((hint) => hint.signal)).toEqual(
      expect.arrayContaining(["편관", "금", "현침살"]),
    );
    expect(evidence?.mbtiEvidence.traits.length).toBeGreaterThan(0);
  });

  it("returns empty packet for unknown MBTI type", () => {
    const packet = buildMyeongliMbtiBridgePacket({
      mbtiType: "UNKNOWN",
      productContext: "general",
      myeongliSignals: sampleSignals,
    });

    expect(packet).toMatchObject({
      mbtiType: null,
      sourceProfile: null,
      relationshipPair: null,
      evidences: [],
      isEmpty: true,
      unknownType: true,
    });
  });
});
