import { buildCareerReportEvidence } from "../report-knowledge/careerReportEvidence";
import type {
  CareerReportEvidencePacket,
  CareerReportFixturePerson,
  CareerReportPillars,
} from "../report-knowledge/careerReportTypes";
import type {
  UserContextProfile,
  UserLifeStatus,
  UserRelationshipStatus,
} from "../report-knowledge/userContextTypes";
import { calculateSaju } from "../saju/calculateSaju";
import type {
  ElementLabel,
  Gender as SajuCalcGender,
  Pillar,
  SajuCalcResult,
  TenGod as SajuCalcTenGod,
} from "../saju/types";
import {
  buildCareerReportScreenQaFallbackDraft,
  type CareerReportDraft,
} from "./careerReportDraftTypes";
import {
  validateCareerReportDraft,
} from "./careerReportDraftValidator";
import {
  generateCareerReportDraft,
  type CareerReportWriterConfig,
  type CareerReportWriterResult,
} from "./openaiCareerReportWriter";
import type { SinglePersonGenerationInput } from "./reportInputAdapter";
import type { JobStatus } from "./reportInputTypes";

export type CareerMoneyStudyGenerationErrorCode =
  | "CAREER_MONEY_STUDY_GENERATION_FAILED"
  | "CAREER_MONEY_STUDY_DRAFT_INVALID"
  | "INVALID_REPORT_INPUT";

export type CareerMoneyStudyGenerationResult =
  | {
      readonly ok: true;
      readonly kind: "careerMoneyStudy";
      readonly draft: CareerReportDraft;
      readonly evidencePacket: CareerReportEvidencePacket;
    }
  | {
      readonly ok: false;
      readonly kind: "careerMoneyStudy";
      readonly error: {
        readonly code: CareerMoneyStudyGenerationErrorCode;
        readonly message: string;
      };
    };

export type CareerMoneyStudyGenerationHandlerOptions = {
  readonly writer?: {
    readonly enabled: boolean;
    readonly config?: CareerReportWriterConfig;
  };
};

const tenGodKoByHanja = {
  比肩: "비견",
  劫財: "겁재",
  食神: "식신",
  傷官: "상관",
  偏財: "편재",
  正財: "정재",
  偏官: "편관",
  正官: "정관",
  偏印: "편인",
  正印: "정인",
} as const satisfies Record<SajuCalcTenGod, string>;

const elementLabelKoByCalc = {
  WOOD_STRONG: "목 과다",
  WOOD_WEAK: "목 부족",
  WOOD_MISSING: "목 부족",
  FIRE_STRONG: "화 과다",
  FIRE_WEAK: "화 부족",
  FIRE_MISSING: "화 부족",
  EARTH_STRONG: "토 과다",
  EARTH_WEAK: "토 부족",
  EARTH_MISSING: "토 부족",
  METAL_STRONG: "금 과다",
  METAL_WEAK: "금 부족",
  METAL_MISSING: "금 부족",
  WATER_STRONG: "수 과다",
  WATER_WEAK: "수 부족",
  WATER_MISSING: "수 부족",
} as const satisfies Record<ElementLabel, string>;

export async function generateCareerMoneyStudyProductDraft(
  input: SinglePersonGenerationInput,
  options: CareerMoneyStudyGenerationHandlerOptions = {},
): Promise<CareerMoneyStudyGenerationResult> {
  if (input.kind !== "careerMoneyStudy") {
    return careerMoneyStudyFailure({
      code: "INVALID_REPORT_INPUT",
      message: "Career money study generation requires careerMoneyStudy input.",
    });
  }

  let evidencePacket: CareerReportEvidencePacket;
  try {
    evidencePacket = buildCareerEvidenceFromGenerationInput(input);
  } catch (error) {
    return careerMoneyStudyFailure({
      code: "CAREER_MONEY_STUDY_GENERATION_FAILED",
      message: getErrorMessage(error),
    });
  }

  let draftResult: CareerReportWriterResult;
  try {
    draftResult =
      options.writer?.enabled === true && options.writer.config !== undefined
        ? await generateCareerReportDraft({
            evidencePacket,
            config: options.writer.config,
          })
        : {
            draft: buildCareerReportScreenQaFallbackDraft(evidencePacket),
            model: "local-career-money-study-fallback",
          };
  } catch (error) {
    return careerMoneyStudyFailure({
      code: "CAREER_MONEY_STUDY_GENERATION_FAILED",
      message: getErrorMessage(error),
    });
  }

  const validation = validateCareerReportDraft(draftResult.draft);

  if (!validation.ok || validation.value === undefined) {
    return careerMoneyStudyFailure({
      code: "CAREER_MONEY_STUDY_DRAFT_INVALID",
      message: validation.errors.join("; "),
    });
  }

  return {
    ok: true,
    kind: "careerMoneyStudy",
    draft: validation.value,
    evidencePacket,
  };
}

function buildCareerEvidenceFromGenerationInput(
  input: SinglePersonGenerationInput,
): CareerReportEvidencePacket {
  const saju = calculateCareerSaju(input.person);
  const person: CareerReportFixturePerson = {
    label: input.person.name,
    birthDate: input.person.birthDate,
    ...(input.person.birthTimeUnknown || input.person.birthTime.trim().length === 0
      ? {}
      : { birthTime: input.person.birthTime.trim() }),
    gender: toCareerGender(input.person.gender),
    mbti: input.person.mbtiType === "" ? null : input.person.mbtiType,
    userContext: toCareerUserContext(input),
    pillars: toCareerPillars(saju),
    labels: deriveCareerLabels(saju, input),
  };

  return buildCareerReportEvidence({
    fixtureId: "product-preview-career-money-study",
    person,
  });
}

function calculateCareerSaju(
  person: SinglePersonGenerationInput["person"],
): SajuCalcResult {
  const birthTime = person.birthTime.trim();

  return calculateSaju({
    birthDate: person.birthDate,
    ...(person.birthTimeUnknown || birthTime.length === 0
      ? {}
      : { birthTime }),
    birthTimeUnknown: person.birthTimeUnknown || birthTime.length === 0,
    calendarType: "SOLAR",
    gender: toSajuGender(person.gender),
    timezone: "Asia/Seoul",
  });
}

function toCareerPillars(result: SajuCalcResult): CareerReportPillars {
  return {
    year: formatPillar(result.pillars.year),
    month: formatPillar(result.pillars.month),
    day: formatPillar(result.pillars.day),
    ...(result.pillars.hour === undefined
      ? {}
      : { hour: formatPillar(result.pillars.hour) }),
  };
}

function deriveCareerLabels(
  result: SajuCalcResult,
  input: SinglePersonGenerationInput,
): readonly string[] {
  const activeTenGods = collectActiveTenGodLabels(result);
  const labels = [
    ...activeTenGods,
    ...deriveTenGodGroupLabels(result),
    ...result.elements.labels.map((label) => elementLabelKoByCalc[label]),
    ...result.structureAnalysis.patterns.map((pattern) => pattern.labelKo),
    ...deriveStructureFallbackLabels(result),
    ...result.relations.stemCombinations,
    ...result.relations.branchCombinations,
    ...result.relations.branchClashes,
    ...result.shinsal.map((detection) => detection.labelKo),
    ...input.userContext.focusAreas.map((area) => `${area} 관심`),
  ];

  return uniqueStrings(labels);
}

function collectActiveTenGodLabels(result: SajuCalcResult): readonly string[] {
  return uniqueStrings(
    Object.entries(result.tenGods.distribution)
      .filter(([, count]) => count > 0)
      .map(([tenGod]) => tenGodKoByHanja[tenGod as SajuCalcTenGod]),
  );
}

function deriveTenGodGroupLabels(result: SajuCalcResult): readonly string[] {
  const count = (tenGods: readonly SajuCalcTenGod[]) =>
    tenGods.reduce(
      (sum, tenGod) => sum + (result.tenGods.distribution[tenGod] ?? 0),
      0,
    );
  const groups: string[] = [];

  if (count(["偏財", "正財"]) > 0) groups.push("재성");
  if (count(["偏官", "正官"]) > 0) groups.push("관성");
  if (count(["食神", "傷官"]) > 0) groups.push("식상");
  if (count(["偏印", "正印"]) > 0) groups.push("인성");
  if (count(["比肩", "劫財"]) > 0) groups.push("비겁");

  return groups;
}

function deriveStructureFallbackLabels(result: SajuCalcResult): readonly string[] {
  const labels: string[] = [];
  const hasOutput =
    (result.tenGods.distribution["食神"] ?? 0) +
      (result.tenGods.distribution["傷官"] ?? 0) >
    0;
  const hasResource =
    (result.tenGods.distribution["偏印"] ?? 0) +
      (result.tenGods.distribution["正印"] ?? 0) >
    0;
  const wealthCount =
    (result.tenGods.distribution["偏財"] ?? 0) +
    (result.tenGods.distribution["正財"] ?? 0);
  const strengthLevel = result.structureAnalysis.dayMasterStrength.level;

  if (!hasOutput) labels.push("무식상");
  if (!hasResource) labels.push("무인성");
  if (wealthCount >= 2 && (strengthLevel === "WEAK" || strengthLevel === "VERY_WEAK")) {
    labels.push("재다신약");
  }
  if (strengthLevel === "WEAK" || strengthLevel === "VERY_WEAK") {
    labels.push("신약");
  }
  if (strengthLevel === "STRONG" || strengthLevel === "VERY_STRONG") {
    labels.push("신강");
  }

  return labels;
}

function toCareerUserContext(
  input: SinglePersonGenerationInput,
): UserContextProfile {
  const fieldLabel = input.userContext.detailJob.trim();

  return {
    lifeStatus: toCareerLifeStatus(input.userContext.jobStatus),
    fieldLabel:
      fieldLabel.length > 0
        ? fieldLabel
        : input.userContext.focusAreas.length > 0
          ? input.userContext.focusAreas.join(" · ")
          : null,
    relationshipStatus: toCareerRelationshipStatus(
      input.userContext.relationshipStatus,
    ),
  };
}

function toCareerLifeStatus(status: JobStatus): UserLifeStatus {
  if (status === "student") return "student";
  if (status === "job_seeker") return "job_seeker";
  if (status === "employee") return "employee";
  if (status === "freelancer") return "freelancer";
  if (status === "self_employed" || status === "business_owner") {
    return "business_owner";
  }
  if (status === "homemaker" || status === "unemployed") {
    return "resting";
  }

  return "other";
}

function toCareerRelationshipStatus(
  status: SinglePersonGenerationInput["userContext"]["relationshipStatus"],
): UserRelationshipStatus {
  if (status === "single" || status === "dating" || status === "married") {
    return status;
  }

  if (status === "some" || status === "marriage_preparing") {
    return "dating";
  }

  return "unknown";
}

function toCareerGender(
  gender: SinglePersonGenerationInput["person"]["gender"],
): string {
  if (gender === "MALE") return "male";
  if (gender === "FEMALE") return "female";
  return "unknown";
}

function toSajuGender(
  gender: SinglePersonGenerationInput["person"]["gender"],
): SajuCalcGender {
  if (gender === "MALE" || gender === "FEMALE") {
    return gender;
  }

  return "OTHER_OR_UNSPECIFIED";
}

function formatPillar(pillar: Pillar): string {
  return `${pillar.stem}${pillar.branch}`;
}

function uniqueStrings(values: readonly string[]): readonly string[] {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}

function careerMoneyStudyFailure(input: {
  readonly code: CareerMoneyStudyGenerationErrorCode;
  readonly message: string;
}): CareerMoneyStudyGenerationResult {
  return {
    ok: false,
    kind: "careerMoneyStudy",
    error: input,
  };
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Unknown career generation error.";
}
