import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import {
  generateComprehensiveV2ProductDraft,
} from "../../../src/lib/report-generation/comprehensiveV2GenerationHandler";
import {
  validateComprehensiveReportDraft,
} from "../../../src/lib/report-generation/comprehensiveReportDraftValidator";
import type { SinglePersonGenerationInput } from "../../../src/lib/report-generation/reportInputAdapter";

const sourcePath = join(
  process.cwd(),
  "src/lib/report-generation/comprehensiveV2GenerationHandler.ts",
);
const source = readFileSync(sourcePath, "utf8");

const comprehensiveV2Input = {
  kind: "comprehensiveV2",
  productKey: "saju_mbti_full",
  productSlug: "saju-mbti-full",
  person: {
    name: "덕민",
    birthDate: "1996-12-06",
    birthTime: "09:30",
    birthTimeUnknown: false,
    approximateBirthTimeSlot: "",
    gender: "MALE",
    mbtiType: "ENTJ",
    calendarType: "solar",
    timezone: "Asia/Seoul",
  },
  userContext: {
    relationshipStatus: "single",
    jobStatus: "employee",
    detailJob: "서비스 기획자",
    focusAreas: ["직업", "돈"],
  },
  productOptions: {},
} as const satisfies SinglePersonGenerationInput;

describe("comprehensive V2 generation handler", () => {
  it("generates a validated comprehensive V2 product preview draft", async () => {
    const result = await generateComprehensiveV2ProductDraft(comprehensiveV2Input);

    expect(result).toMatchObject({
      ok: true,
      kind: "comprehensiveV2",
      draft: {
        version: "comprehensive_v2_draft",
        productType: "saju_mbti_full",
        productVersion: "v2",
      },
      evidencePacket: {
        productKey: "saju_mbti_full",
        productSlug: "saju-mbti-full",
        productType: "saju_mbti_full",
        mbtiType: "ENTJ",
      },
    });
    if (!result.ok) return;

    expect(result.draft.profileTable.fiveElementSummary.length).toBeGreaterThan(0);
    expect(result.draft.sajuFeatureChapter?.items.length).toBeGreaterThanOrEqual(3);
    const draftWithoutPreviewVersion = Object.fromEntries(
      Object.entries(result.draft).filter(([key]) => key !== "productVersion"),
    );
    expect(validateComprehensiveReportDraft(draftWithoutPreviewVersion).ok).toBe(true);
  });

  it("rejects non comprehensiveV2 generation input", async () => {
    const result = await generateComprehensiveV2ProductDraft({
      ...comprehensiveV2Input,
      kind: "careerMoneyStudy",
      productKey: "career_money_study",
      productSlug: "career-money-study",
    } as unknown as SinglePersonGenerationInput);

    expect(result).toEqual({
      ok: false,
      kind: "comprehensiveV2",
      error: {
        code: "INVALID_REPORT_INPUT",
        message: "Comprehensive V2 generation requires comprehensiveV2 input.",
      },
    });
  });

  it("keeps writer usage behind explicit options and avoids runtime side effects", () => {
    expect(source).toContain("options.writer?.enabled === true");
    expect(source).toContain("options.writer.config !== undefined");
    expect(source).toContain("buildLocalComprehensiveV2Draft");

    const forbiddenMarkers = [
      "src/app",
      "api/reports",
      "persistence",
      "payment",
      "supabase",
      "fetch(",
      "Date.now",
    ];

    for (const marker of forbiddenMarkers) {
      expect(source).not.toContain(marker);
    }
  });
});
