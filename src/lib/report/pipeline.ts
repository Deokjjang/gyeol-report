import { evaluateSajuMbtiBridge } from "../bridge/evaluate";
import { evaluateSajuMbtiSuggestion } from "../mbti/sajuSuggestion";
import { getMbtiProfile } from "../mbti/types";
import { calculateSaju } from "../saju/calculateSaju";
import {
  createDayPillarCode,
  getDayPillarProfile,
} from "../saju/dayPillarProfile";
import { extractSajuTags } from "../saju/extractTags";
import { validateReportRequest } from "../validation/reportRequest";
import type {
  ReportRequestRawInput,
  ReportRequestValidationError,
} from "../validation/types";
import { buildReport } from "./buildReport";
import type { ReportOutput } from "./types";

export type ReportPipelineSuccess = {
  ok: true;
  report: ReportOutput;
};

export type ReportPipelineFailure = {
  ok: false;
  errors: ReportRequestValidationError[];
};

export type ReportPipelineResult =
  | ReportPipelineSuccess
  | ReportPipelineFailure;

export function createReportFromRawInput(
  raw: ReportRequestRawInput,
): ReportPipelineResult {
  const validation = validateReportRequest(raw);

  if (!validation.ok) {
    return {
      ok: false,
      errors: validation.errors,
    };
  }

  const saju = calculateSaju(validation.value.sajuInput);
  const dayPillarProfile = getDayPillarProfile(
    createDayPillarCode({
      stem: saju.pillars.day.stem,
      branch: saju.pillars.day.branch,
    }),
  );
  const sajuTags = extractSajuTags(saju);
  const mbti = getMbtiProfile(validation.value.mbtiType);
  const mbtiSuggestion = evaluateSajuMbtiSuggestion({
    sajuTags,
    userType: validation.value.mbtiType,
  });
  const bridge = evaluateSajuMbtiBridge({
    sajuTags,
    mbtiProfile: mbti,
  });
  const report = buildReport({
    saju,
    sajuTags,
    mbti,
    bridgeSignals: bridge.signals,
    mbtiSuggestion,
    dayPillarProfile,
  });

  return {
    ok: true,
    report,
  };
}
