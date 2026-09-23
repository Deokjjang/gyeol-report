import { buildLoveRelationshipNarrative } from "./loveRelationshipNarrative";
import { withReportInputEvidence } from "./reportInputEvidence";
import { withBirthTimeEvidence } from "../saju/birthTimePrecisionTypes";
import { calculateSaju } from "../saju/calculateSaju";
import type {
  Gender as SajuCalcGender,
  HiddenStemEntry,
  Pillar,
  SajuCalcResult,
  TenGod as SajuCalcTenGod,
} from "../saju/types";
import {
  buildLoveMarriageChildReportEvidence,
  type BuildLoveMarriageChildReportEvidenceInput,
  type LoveMarriageChildSajuEvidenceInput,
} from "../report-knowledge/loveMarriageChildReportEvidence";
import type {
  EarthlyBranch,
  HeavenlyStem,
  TenGod,
} from "../report-knowledge/annualFortuneTypes";
import type {
  LoveMarriageChildFullPillarEvidence,
  LoveMarriageChildFullPillarKey,
  LoveMarriageChildGender,
  LoveMarriageChildReportEvidencePacket,
} from "../report-knowledge/loveMarriageChildReportTypes";
import {
  validateLoveMarriageChildReportDraft,
} from "./loveMarriageChildReportDraftValidator";
import type {
  LoveMarriageChildReportDraft,
} from "./loveMarriageChildReportDraftTypes";
import {
  generateLoveMarriageChildReportDraft,
  type LoveMarriageChildReportWriterConfig,
  type LoveMarriageChildReportWriterResult,
} from "./openaiLoveMarriageChildReportWriter";
import type { SinglePersonGenerationInput } from "./reportInputAdapter";

export type LoveMarriageChildGenerationErrorCode =
  | "LOVE_MARRIAGE_CHILD_GENERATION_FAILED"
  | "LOVE_MARRIAGE_CHILD_DRAFT_INVALID"
  | "INVALID_REPORT_INPUT";

export type LoveMarriageChildGenerationResult =
  | {
      readonly ok: true;
      readonly kind: "loveMarriageChild";
      readonly draft: LoveMarriageChildReportDraft;
      readonly evidencePacket: LoveMarriageChildReportEvidencePacket;
    }
  | {
      readonly ok: false;
      readonly kind: "loveMarriageChild";
      readonly error: {
        readonly code: LoveMarriageChildGenerationErrorCode;
        readonly message: string;
      };
    };

export type LoveMarriageChildGenerationHandlerOptions = {
  readonly writer?: {
    readonly enabled: boolean;
    readonly config?: LoveMarriageChildReportWriterConfig;
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
} as const satisfies Record<SajuCalcTenGod, TenGod>;

export async function generateLoveMarriageChildProductDraft(
  input: SinglePersonGenerationInput,
  options: LoveMarriageChildGenerationHandlerOptions = {},
): Promise<LoveMarriageChildGenerationResult> {
  if (input.kind !== "loveMarriageChild") {
    return loveMarriageChildFailure({
      code: "INVALID_REPORT_INPUT",
      message: "Love marriage child generation requires loveMarriageChild input.",
    });
  }

  let evidencePacket: LoveMarriageChildReportEvidencePacket;
  try {
    evidencePacket = buildLoveMarriageChildEvidenceFromGenerationInput(input);
  } catch (error) {
    return loveMarriageChildFailure({
      code: "LOVE_MARRIAGE_CHILD_GENERATION_FAILED",
      message: getErrorMessage(error),
    });
  }

  let draftResult: LoveMarriageChildReportWriterResult;
  try {
    draftResult =
      options.writer?.enabled === true && options.writer.config !== undefined
        ? await generateLoveMarriageChildReportDraft({
            evidencePacket,
            config: options.writer.config,
          })
        : {
            draft: buildLoveMarriageChildFallbackDraft({
              evidencePacket,
              userContext: input.userContext,
            }),
            model: "local-love-marriage-child-fallback",
          };
  } catch (error) {
    return loveMarriageChildFailure({
      code: "LOVE_MARRIAGE_CHILD_GENERATION_FAILED",
      message: getErrorMessage(error),
    });
  }

  const validation = validateLoveMarriageChildReportDraft(draftResult.draft, evidencePacket);

  if (!validation.ok || validation.value === undefined) {
    return loveMarriageChildFailure({
      code: "LOVE_MARRIAGE_CHILD_DRAFT_INVALID",
      message: validation.errors.join("; "),
    });
  }

  return {
    ok: true,
    kind: "loveMarriageChild",
    draft: validation.value,
    evidencePacket: withReportInputEvidence(evidencePacket, input),
  };
}

function buildLoveMarriageChildEvidenceFromGenerationInput(
  input: SinglePersonGenerationInput,
): LoveMarriageChildReportEvidencePacket {
  const saju = calculateLoveMarriageChildSaju(input.person);
  const evidenceInput: BuildLoveMarriageChildReportEvidenceInput = {
    name: input.person.name,
    gender: toLoveMarriageChildGender(input.person.gender),
    mbtiType: input.person.mbtiType === "" ? null : input.person.mbtiType,
    relationshipStatus: toLoveRelationshipStatus(
      input.userContext.relationshipStatus,
    ),
    saju: toLoveMarriageChildSajuEvidenceInput(saju),
  };

  return withBirthTimeEvidence(buildLoveMarriageChildReportEvidence(evidenceInput), { person: saju.birthTimeContext });
}

function calculateLoveMarriageChildSaju(
  person: SinglePersonGenerationInput["person"],
): SajuCalcResult {
  const birthTime = person.birthTime.trim();

  return calculateSaju({
    birthDate: person.birthDate,
    ...(person.birthTimeUnknown || birthTime.length === 0
      ? {}
      : { birthTime }),
    birthTimeUnknown: person.birthTimeUnknown,
    birthTimePrecision: person.birthTimePrecision,
    approximateBirthTimeSlot: person.approximateBirthTimeSlot,
    calendarType: "SOLAR",
    gender: toSajuGender(person.gender),
    timezone: "Asia/Seoul",
  });
}

function toLoveMarriageChildSajuEvidenceInput(
  result: SajuCalcResult,
): LoveMarriageChildSajuEvidenceInput {
  const fullPillars = toFullPillars(result);
  const tenGods = collectActiveTenGods(result);
  const sinsal = uniqueStrings(
    result.shinsal.map((detection) => detection.labelKo),
  );
  const gwiin = uniqueStrings(
    result.shinsal
      .filter((detection) => detection.category === "NOBLE_HELP")
      .map((detection) => detection.labelKo),
  );
  const interactions = uniqueStrings([
    ...result.relations.stemCombinations,
    ...result.relations.branchCombinations,
    ...result.relations.branchClashes,
  ]);

  return {
    dayMaster: result.dayMaster as HeavenlyStem,
    dayPillar: formatPillar(result.pillars.day),
    dayBranch: result.pillars.day.branch as EarthlyBranch,
    fullPillars,
    labels: uniqueStrings([
      ...tenGods,
      ...sinsal,
      ...gwiin,
      ...interactions,
    ]),
    tenGods,
    sinsal,
    gwiin,
    interactions,
  };
}

function toFullPillars(
  result: SajuCalcResult,
): readonly LoveMarriageChildFullPillarEvidence[] {
  const pillarEntries = [
    ["year", result.pillars.year],
    ["month", result.pillars.month],
    ["day", result.pillars.day],
    ...(result.pillars.hour === undefined
      ? []
      : [["hour", result.pillars.hour] as const]),
  ] as const;

  const interactions = uniqueStrings([
    ...result.relations.stemCombinations,
    ...result.relations.branchCombinations,
    ...result.relations.branchClashes,
  ]);

  return pillarEntries.map(([key, pillar]) => {
    const hiddenStemEntries = getHiddenStemEntries(result, pillar.branch);

    return {
      key,
      pillar: formatPillar(pillar),
      stem: pillar.stem as HeavenlyStem,
      branch: pillar.branch as EarthlyBranch,
      stemTenGod: getStemTenGod(result, key),
      branchTenGod: toKoreanTenGod(hiddenStemEntries[0]?.tenGod),
      hiddenStems: hiddenStemEntries.map((entry) => formatHiddenStem(entry)),
      sinsal: result.shinsal
        .filter((detection) => detection.positions.includes(key))
        .map((detection) => detection.labelKo),
      gwiin: result.shinsal
        .filter(
          (detection) =>
            detection.category === "NOBLE_HELP" &&
            detection.positions.includes(key),
        )
        .map((detection) => detection.labelKo),
      interactions: interactions.filter(
        (interaction) =>
          interaction.includes(pillar.stem) || interaction.includes(pillar.branch),
      ),
    };
  });
}

function getStemTenGod(
  result: SajuCalcResult,
  key: LoveMarriageChildFullPillarKey,
): TenGod | null {
  if (key === "day") {
    return "비견";
  }

  return key === "hour" || key === "month" || key === "year"
    ? toKoreanTenGod(result.tenGods.stems[key])
    : null;
}

function getHiddenStemEntries(
  result: SajuCalcResult,
  branch: EarthlyBranch,
): readonly HiddenStemEntry[] {
  return result.tenGods.hiddenStems
    .filter((entry) => entry.branch === branch)
    .sort((a, b) => b.weight - a.weight);
}

function formatHiddenStem(entry: HiddenStemEntry): string {
  const tenGod = toKoreanTenGod(entry.tenGod);

  return tenGod === null ? entry.stem : `${entry.stem} ${tenGod}`;
}

function collectActiveTenGods(result: SajuCalcResult): readonly TenGod[] {
  return uniqueStrings(
    Object.entries(result.tenGods.distribution)
      .filter(([, count]) => count > 0)
      .map(([tenGod]) => toKoreanTenGod(tenGod as SajuCalcTenGod))
      .filter((tenGod): tenGod is TenGod => tenGod !== null),
  ) as readonly TenGod[];
}

function toKoreanTenGod(tenGod: SajuCalcTenGod | undefined): TenGod | null {
  return tenGod === undefined ? null : tenGodKoByHanja[tenGod];
}

function toLoveMarriageChildGender(
  gender: SinglePersonGenerationInput["person"]["gender"],
): LoveMarriageChildGender {
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

function toLoveRelationshipStatus(status: SinglePersonGenerationInput["userContext"]["relationshipStatus"]): LoveMarriageChildReportEvidencePacket["personContext"]["relationshipStatus"] {
  return status === "" ? "unknown" : status;
}

function buildLoveMarriageChildFallbackDraft(input: {
  readonly evidencePacket: LoveMarriageChildReportEvidencePacket;
  readonly userContext: SinglePersonGenerationInput["userContext"];
}): LoveMarriageChildReportDraft {
  return buildLoveRelationshipNarrative(input.evidencePacket, input.userContext);
}

function loveMarriageChildFailure(input: {
  readonly code: LoveMarriageChildGenerationErrorCode;
  readonly message: string;
}): LoveMarriageChildGenerationResult {
  return {
    ok: false,
    kind: "loveMarriageChild",
    error: input,
  };
}

function formatPillar(pillar: Pillar): string {
  return `${pillar.stem}${pillar.branch}`;
}

function uniqueStrings(values: readonly string[]): readonly string[] {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
