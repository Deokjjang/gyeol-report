import { describe, expect, it } from "vitest";

import { auditReportDistinctiveness } from "../../../src/lib/report-knowledge/reportDistinctivenessAudit";

describe("report distinctiveness audit", () => {
  it("detects exact shared sentences longer than 20 characters", () => {
    const shared =
      "막힌 일을 혼자 끌지 말고 도움을 한 문장으로 요청하는 장면이 반복됩니다.";
    const audit = auditReportDistinctiveness({
      reports: [
        {
          reportId: "deokmin",
          text: `${shared} 덕민은 판을 잡는 쪽으로 움직입니다.`,
          evidenceFeatures: ["천을귀인", "무인성"],
        },
        {
          reportId: "sodam-intp",
          text: `${shared} 소담은 혼자 자료를 확인한 뒤 묻는 쪽입니다.`,
          evidenceFeatures: ["천을귀인", "무인성"],
        },
      ],
    });

    expect(audit.exactSharedSentences).toContain(shared);
    expect(audit.comparedReportIds).toEqual(["deokmin", "sodam-intp"]);
  });

  it("allows shared advice when common evidence explains the overlap", () => {
    const audit = auditReportDistinctiveness({
      reports: [
        {
          reportId: "deokmin",
          text:
            "재고귀인이 있어 계좌 분리 방식이 필요합니다. 천을귀인과 무인성 때문에 도움을 한 문장으로 요청해야 합니다.",
          evidenceFeatures: ["재고귀인", "천을귀인", "무인성"],
        },
        {
          reportId: "sodam-intp",
          text:
            "재고귀인이 있어 계좌 분리 방식이 필요합니다. 천을귀인과 무인성 때문에 도움을 한 문장으로 요청해야 합니다.",
          evidenceFeatures: ["재고귀인", "천을귀인", "무인성"],
        },
      ],
    });

    expect(audit.repeatedAdvicePhrases).toEqual(
      expect.arrayContaining(["계좌 분리", "도움을 한 문장으로 요청"]),
    );
    expect(audit.suspiciousGenericOverlap).toEqual([]);
    expect(audit.verdict).toBe("acceptable_overlap");
  });

  it("marks shared advice without shared evidence as suspicious", () => {
    const audit = auditReportDistinctiveness({
      reports: [
        {
          reportId: "deokmin",
          text: "계좌 분리와 말의 온도, 밤 산책, 잠 루틴이 필요합니다.",
          evidenceFeatures: ["갑신일주"],
        },
        {
          reportId: "sodam-intp",
          text: "계좌 분리와 말의 온도, 밤 산책, 잠 루틴이 필요합니다.",
          evidenceFeatures: ["정축일주"],
        },
      ],
    });

    expect(audit.suspiciousGenericOverlap).toEqual(
      expect.arrayContaining(["계좌 분리", "말의 온도", "밤 산책", "잠 루틴"]),
    );
  });

  it("returns too_similar when many generic overlaps are not explained", () => {
    const generic =
      "도움을 한 문장으로 요청하고 계좌 분리와 말의 온도 조절을 하세요. 덜 닳게 오래 가려면 책임 범위, 밤 산책, 기록, 잠 루틴, 결론 전에 질문을 넣는 습관이 필요합니다.";
    const audit = auditReportDistinctiveness({
      reports: [
        { reportId: "deokmin", text: generic, evidenceFeatures: ["갑신일주"] },
        { reportId: "sodam-intp", text: generic, evidenceFeatures: ["정축일주"] },
      ],
    });

    expect(audit.similarityScore).toBeGreaterThan(0.35);
    expect(audit.verdict).toBe("too_similar");
  });

  it("returns distinct for different texts without repeated generic advice", () => {
    const audit = auditReportDistinctiveness({
      reports: [
        {
          reportId: "deokmin",
          text: "갑신일주는 압박 속에서 기준을 세우는 흐름이 강합니다.",
          evidenceFeatures: ["갑신일주"],
        },
        {
          reportId: "sodam-intp",
          text: "정축일주는 차가운 흙 속 불씨처럼 조용히 정리하는 힘이 강합니다.",
          evidenceFeatures: ["정축일주"],
        },
      ],
    });

    expect(audit.repeatedAdvicePhrases).toEqual([]);
    expect(audit.verdict).toBe("distinct");
  });
});
