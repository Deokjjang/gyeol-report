import { describe, expect, it } from "vitest";

import {
  buildCareerReportEvidence,
  summarizeCareerReportEvidenceMatrixQuality,
} from "../../../src/lib/report-knowledge/careerReportEvidence";
import {
  CAREER_REPORT_FIXTURES,
  requireCareerReportFixture,
} from "../../../src/lib/report-knowledge/careerReportFixtures";

function buildFixtureEvidence(fixtureId: string) {
  const fixture = requireCareerReportFixture(fixtureId);

  return buildCareerReportEvidence({
    fixtureId: fixture.id,
    person: fixture.person,
  });
}

describe("careerReportEvidence", () => {
  it("builds the career money study evidence packet", () => {
    const evidence = buildFixtureEvidence("deokmin-career");

    expect(evidence.productType).toBe("career_money_study");
    expect(evidence.productVersion).toBe("v1");
    expect(evidence.personLabel).toBe("덕민");
    expect(evidence.userContext.fieldLabel).toBe("개발·서비스 기획");
    expect(evidence.dayMaster).toBe("甲");
    expect(evidence.mbtiType).toBe("ENTJ");
    expect(evidence.investmentProfile.disclaimer).toContain("금융 자문이 아닙니다");
    expect(evidence.recommendedJobs[0]).toMatchObject({
      fit: "high",
    });
    expect(evidence.bridgeEvidence.productKey).toBe("careerMoneyStudy");
    expect(evidence.bridgeEvidence.primaryEvidence.length).toBeGreaterThan(0);
    expect(evidence.bridgeEvidence.primaryEvidence[0]?.purposes).toEqual(
      expect.arrayContaining(["career", "money", "investment", "study"]),
    );
    expect(evidence.bridgeEvidence.cautionEvidence[0]?.purposes).toContain(
      "caution",
    );
    expect(evidence.bridgeEvidence.forbiddenAngles).toEqual(
      expect.arrayContaining(["수익 확정", "합격 확정", "승진·이직 확정"]),
    );
  });

  it("derives Myeongli career evidence from ten-gods and elements", () => {
    const deokmin = buildFixtureEvidence("deokmin-career");
    const officer = buildFixtureEvidence("career-sample-officer-dating");
    const expression = buildFixtureEvidence("career-sample-expression-married");
    const resource = buildFixtureEvidence("career-sample-resource-unknown");

    expect(deokmin.myeongliCareerBasis.moneyPlain).toMatch(
      /돈|자원|계약|정산/u,
    );
    expect(officer.myeongliCareerBasis.careerPlain).toMatch(
      /조직|규칙|평가|책임/u,
    );
    expect(expression.myeongliCareerBasis.careerPlain).toMatch(
      /결과물|표현|콘텐츠|포트폴리오/u,
    );
    expect(resource.myeongliCareerBasis.studyPlain).toMatch(
      /공부|자격증|문서|연구/u,
    );
    expect(deokmin.myeongliCareerBasis.moneyPlain).toContain("토");
    expect(deokmin.myeongliCareerBasis.moneyPlain).toContain("홍보");
    expect(deokmin.myeongliCareerBasis.moneyPlain).toContain("회복");
  });

  it("derives MBTI career evidence without overriding Myeongli", () => {
    const deokmin = buildFixtureEvidence("deokmin-career");
    const intp = buildFixtureEvidence("career-sample-resource-unknown");
    const enfp = buildFixtureEvidence("career-sample-expression-married");
    const unknownMbti = buildCareerReportEvidence({
      person: {
        ...requireCareerReportFixture("career-sample-wealth-single").person,
        mbti: null,
      },
    });

    expect(deokmin.mbtiCareerBasis.workStylePlain).toMatch(
      /전략|구조|리더십|목표/u,
    );
    expect(deokmin.combinedCareerProfile.plain).toContain(
      "명리는 자원과 구조",
    );
    expect(intp.mbtiCareerBasis.workStylePlain).toMatch(/분석|연구/u);
    expect(enfp.mbtiCareerBasis.workStylePlain).toMatch(/사람|표현|결과물/u);
    expect(unknownMbti.myeongliCareerBasis.moneyPlain).toContain("돈");
    expect(unknownMbti.mbtiCareerBasis.workStylePlain).toContain("MBTI");
  });

  it("keeps bridge evidence safe for unknown MBTI or sparse labels", () => {
    const fixture = requireCareerReportFixture("career-sample-wealth-single");
    const buildSparseUnknownMbtiEvidence = () =>
      buildCareerReportEvidence({
        person: {
          ...fixture.person,
          mbti: "ZZZZ",
          labels: [],
        },
      });

    expect(buildSparseUnknownMbtiEvidence).not.toThrow();

    const evidence = buildSparseUnknownMbtiEvidence();

    expect(evidence.bridgeEvidence.productKey).toBe("careerMoneyStudy");
    expect(evidence.bridgeEvidence.primaryEvidence).toEqual([]);
    expect(evidence.bridgeEvidence.supportingEvidence).toEqual([]);
    expect(evidence.bridgeEvidence.cautionEvidence).toEqual([]);
    expect(evidence.bridgeEvidence.forbiddenAngles).toEqual(
      expect.arrayContaining(["수익 확정", "합격 확정", "승진·이직 확정"]),
    );
  });

  it("combines Deokmin into an operations planning resource profile", () => {
    const evidence = buildFixtureEvidence("deokmin-career");

    expect(evidence.combinedCareerProfile.headline).toContain("운영형 기획자");
    expect(evidence.combinedCareerProfile.headline).toContain("전략형 PM");
    expect(evidence.combinedCareerProfile.headline).toContain("수익 구조");
    expect(evidence.combinedCareerProfile.workStyleArchetypes).toContain(
      "operator_planner",
    );
    expect(evidence.combinedCareerProfile.moneyStyleArchetypes).toContain(
      "contract_project_income",
    );
  });

  it("generates job recommendations with reason and caution", () => {
    const deokmin = buildFixtureEvidence("deokmin-career");
    const other = buildFixtureEvidence("career-sample-expression-married");

    expect(deokmin.recommendedJobs.length).toBeGreaterThanOrEqual(8);
    expect(deokmin.recommendedJobs.map((job) => job.title)).toEqual(
      expect.arrayContaining([
        "서비스 기획자",
        "PM / PO",
        "운영기획",
        "핀테크/결제/정산 서비스 기획",
      ]),
    );
    expect(
      deokmin.recommendedJobs.every(
        (job) => job.reason.length > 0 && job.caution.length > 0,
      ),
    ).toBe(true);
    expect(other.recommendedJobs.map((job) => job.title)).not.toEqual(
      deokmin.recommendedJobs.map((job) => job.title),
    );
  });

  it("builds money, investment, study, and timing evidence safely", () => {
    const evidence = buildFixtureEvidence("deokmin-career");
    const serialized = JSON.stringify(evidence);

    expect(evidence.moneyStrategies.map((item) => item.label).join("\n")).toMatch(
      /계약|정산|고정비|부업/u,
    );
    expect(evidence.investmentProfile.preferred).toEqual(
      expect.arrayContaining([
        "blue_chip_monthly_dca",
        "index_diversification",
        "avoid_leverage",
      ]),
    );
    expect(evidence.investmentProfile.plain).toMatch(
      /우량 자산|월|분산|적립/u,
    );
    expect(serialized).not.toMatch(/\b(?:AAPL|TSLA|NVDA|005930)\b/u);
    expect(serialized).not.toContain("투자 수익이 납니다");
    expect(evidence.studyCertificateStrategy.recommendedMethods).toContain(
      "포트폴리오 케이스 정리",
    );
    expect(evidence.timingHints.length).toBeGreaterThan(0);
    expect(evidence.timingHints.map((signal) => signal.plain).join("\n")).toMatch(
      /가능성|쉬운 흐름|수 있습니다/u,
    );
    expect(new Set(evidence.timingHints.map((signal) => signal.title)).size).toBe(
      evidence.timingHints.length,
    );
  });

  it("summarizes matrix quality without Deokmin leakage", () => {
    const packets = CAREER_REPORT_FIXTURES.map((fixture) =>
      buildCareerReportEvidence({
        fixtureId: fixture.id,
        person: fixture.person,
      }),
    );
    const summary = summarizeCareerReportEvidenceMatrixQuality(packets);

    expect(summary.sameJobsAcrossAllFixturesWarnings).toBe(0);
    expect(summary.specificStockTickerWarnings).toBe(0);
    expect(summary.guaranteedReturnWarnings).toBe(0);
    expect(summary.hardDeterministicClaimWarnings).toBe(0);
    expect(summary.deokminLeakageWarnings).toBe(0);
  });
});
