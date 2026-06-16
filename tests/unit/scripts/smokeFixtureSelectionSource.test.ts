import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const draftSmokeSource = readFileSync(
  join(process.cwd(), "scripts", "smoke_generate_comprehensive_report_draft.ts"),
  "utf8",
);
const saveSmokeSource = readFileSync(
  join(process.cwd(), "scripts", "smoke_generate_and_save_comprehensive_report.ts"),
  "utf8",
);
const auditSmokeSource = readFileSync(
  join(process.cwd(), "scripts", "smoke_audit_saju_features.ts"),
  "utf8",
);
const distinctivenessSmokeSource = readFileSync(
  join(process.cwd(), "scripts", "smoke_compare_report_distinctiveness.ts"),
  "utf8",
);
const matrixSource = readFileSync(
  join(process.cwd(), "src", "lib", "report-knowledge", "reportQualityFixtureMatrix.ts"),
  "utf8",
);
const auditFormatterSource = readFileSync(
  join(process.cwd(), "src", "lib", "report-knowledge", "sajuFeatureAudit.ts"),
  "utf8",
);

describe("report smoke fixture selection source", () => {
  it("supports deokmin fixture selection in draft save and audit smoke scripts", () => {
    expect(matrixSource).toContain("--fixture");
    expect(matrixSource).toContain("deokmin");
    expect(matrixSource).toContain("sodam-intp");
    expect(matrixSource).toContain("default");
    expect(auditSmokeSource).toContain("--fixture");
    expect(auditSmokeSource).toContain("deokmin");
    expect(auditSmokeSource).toContain("sodam-intp");
    expect(auditSmokeSource).toContain("default");
    expect(draftSmokeSource).toContain("getReportSmokeFixture");
    expect(draftSmokeSource).toContain("getReportSmokeFixtureIdFromArgs");
    expect(draftSmokeSource).toContain("getReportSmokeFixtureMatrixModeFromArgs");
    expect(draftSmokeSource).toContain("getReportQualitySmokeSampleFixtures");
    expect(draftSmokeSource).toContain("report fixture:");
    expect(draftSmokeSource).toContain("quality matrix smoke: sample");
    expect(matrixSource).toContain("--fixture-matrix");
    expect(saveSmokeSource).toContain("getReportSmokeFixture");
    expect(saveSmokeSource).toContain("getReportSmokeFixtureIdFromArgs");
    expect(saveSmokeSource).toContain("report fixture:");
    expect(auditSmokeSource).toContain("getSajuAuditFixture");
    expect(auditFormatterSource).toContain("audit fixture:");
    expect(distinctivenessSmokeSource).toContain("--fixtures");
    expect(distinctivenessSmokeSource).toContain("sodam-intp");
    expect(distinctivenessSmokeSource).toContain("auditReportDistinctiveness");
  });

  it("routes report smoke through deokmin external pillars instead of hardcoded default facts", () => {
    expect(matrixSource).toContain("deokmin-external-manse");
    expect(matrixSource).toContain("己卯");
    expect(matrixSource).toContain("辛未");
    expect(matrixSource).toContain("甲申");
    expect(matrixSource).toContain("戊辰");
    expect(draftSmokeSource).not.toContain("deokminSampleFacts");
    expect(saveSmokeSource).not.toContain("deokminSampleFacts");
    expect(saveSmokeSource).toContain("1999-07-31");
    expect(saveSmokeSource).toContain("07:30");
  });

  it("routes report smoke through the Sodam INTP fixture when requested", () => {
    expect(matrixSource).toContain("sodam-intp");
    expect(matrixSource).toContain("Sodam INTP 丁丑");
    expect(matrixSource).toContain("소담");
    expect(matrixSource).toContain("INTP");
    expect(matrixSource).toContain("丙子");
    expect(matrixSource).toContain("己亥");
    expect(matrixSource).toContain("丁丑");
    expect(matrixSource).toContain("丁未");
    expect(saveSmokeSource).toContain("SODAM_REPORT_SMOKE_FIXTURE_ID");
    expect(saveSmokeSource).toContain("1996-12-06");
    expect(saveSmokeSource).toContain("14:15");
    expect(auditFormatterSource).toContain("SODAM_INTP_MANSE_FIXTURE");
  });

  it("keeps matrix smoke sample separate from the single deokmin path", () => {
    expect(matrixSource).toContain("REPORT_QUALITY_SMOKE_SAMPLE_FIXTURE_IDS");
    expect(matrixSource).toContain("deokmin-external-manse");
    expect(matrixSource).toContain("sodam-intp");
    expect(matrixSource).toContain("reflective-water-infp");
    expect(matrixSource).toContain("money-resource-estp");
    expect(matrixSource).toContain("responsibility-earth-istj");
    expect(matrixSource).toContain("growth-wood-infj");
    expect(matrixSource).toContain("getReportQualitySmokeSampleFixtures");
    expect(matrixSource).toContain("getReportSmokeFixtureMatrixModeFromArgs");
    expect(draftSmokeSource).toContain("fixture id:");
    expect(draftSmokeSource).toContain("MBTI:");
    expect(draftSmokeSource).toContain("pillars:");
    expect(draftSmokeSource).toContain("computed feature count:");
    expect(draftSmokeSource).toContain("differentiation modules count:");
    expect(draftSmokeSource).toContain("quality gate summary:");
    expect(draftSmokeSource).toContain("validator warnings count:");
    expect(distinctivenessSmokeSource).toContain("cross-report distinctiveness");
    expect(distinctivenessSmokeSource).toContain("verdict:");
  });
});
