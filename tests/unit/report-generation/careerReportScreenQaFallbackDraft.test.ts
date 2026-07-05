import { describe, expect, it } from "vitest";

import {
  buildCareerReportScreenQaFallbackDraft,
  careerActionPlanLabels,
} from "../../../src/lib/report-generation/careerReportDraftTypes";
import {
  summarizeCareerReportDraftQuality,
  validateCareerReportDraft,
} from "../../../src/lib/report-generation/careerReportDraftValidator";
import {
  buildCareerReportEvidence,
} from "../../../src/lib/report-knowledge/careerReportEvidence";
import {
  requireCareerReportFixture,
} from "../../../src/lib/report-knowledge/careerReportFixtures";

function buildFallbackDraft() {
  const fixture = requireCareerReportFixture("deokmin-career");
  const evidence = buildCareerReportEvidence({
    fixtureId: fixture.id,
    person: fixture.person,
  });

  return buildCareerReportScreenQaFallbackDraft(evidence);
}

describe("buildCareerReportScreenQaFallbackDraft", () => {
  it("builds a validator-safe preview draft from career evidence", () => {
    const draft = buildFallbackDraft();
    const validation = validateCareerReportDraft(draft);

    expect(validation.ok).toBe(true);
    expect(validation.value?.personLabel).toBe("덕민");
    expect(validation.value?.recommendedJobs.length).toBeGreaterThanOrEqual(8);
    expect(validation.value?.unsuitableJobs.length).toBeGreaterThanOrEqual(3);
    expect(validation.value?.careerPaths.length).toBeGreaterThanOrEqual(3);
    expect(validation.value?.careerTiming.length).toBeGreaterThanOrEqual(3);
    expect(validation.value?.safetyNotes.length).toBeGreaterThanOrEqual(2);
  });

  it("keeps the required launch sections and action plan labels", () => {
    const draft = buildFallbackDraft();

    expect(draft.coreLine.length).toBeGreaterThan(0);
    expect(draft.careerIdentity.body.length).toBeGreaterThan(0);
    expect(draft.moneyEarningStyle.bestIncomeChannels.length).toBeGreaterThanOrEqual(3);
    expect(draft.investmentAndSavingStyle.suitablePatterns.length).toBeGreaterThanOrEqual(3);
    expect(draft.studyCertificatePlan.recommendedStudyMethods.length).toBeGreaterThanOrEqual(3);
    expect(draft.actionPlan.map((item) => item.label)).toEqual([
      ...careerActionPlanLabels,
    ]);
  });

  it("does not leak internal preview artifacts into visible draft text", () => {
    const draft = buildFallbackDraft();
    const quality = summarizeCareerReportDraftQuality(draft);

    expect(quality.internalArtifactWarnings).toBe(0);
    expect(JSON.stringify(draft)).not.toContain("fixture");
    expect(JSON.stringify(draft)).not.toContain("debug");
  });
});
