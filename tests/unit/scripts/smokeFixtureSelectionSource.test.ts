import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

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
    expect(matrixSource).toContain("--fixture-matrix");
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
    expect(distinctivenessSmokeSource).toContain("cross-report distinctiveness");
    expect(distinctivenessSmokeSource).toContain("verdict:");
  });
});
