import type {
  CompatibilityConnectionSummaryData,
  CompatibilityPersonTableData,
  CompatibilityRelationCategory,
  CompatibilityTableData,
  ManseRyeokCommonTableData,
  MbtiCommonProfileTableData,
} from "./types";

export type CompatibilityPersonTableInput = {
  readonly label?: string;
  readonly displayName?: string | null;
  readonly manseRyeok: ManseRyeokCommonTableData;
  readonly mbti?: MbtiCommonProfileTableData | null;
};

export type CompatibilityConnectionSummaryInput = {
  readonly compatibilityHeadline?: string | null;
  readonly overallTone?: string | null;
  readonly myeongliConnectionSummary?: string | null;
  readonly mbtiConnectionSummary?: string | null;
  readonly dayMasterRelation?: string | null;
  readonly dayBranchRelation?: string | null;
  readonly elementBalance?: string | null;
  readonly tenGodRelation?: string | null;
  readonly interactionLabels?: readonly string[] | string;
  readonly sharedStrengths?: readonly string[] | string;
  readonly frictionPoints?: readonly string[] | string;
  readonly repairStrategy?: string | null;
  readonly timingNotes?: readonly string[] | string;
};

export type BuildCompatibilityTableDataInput = {
  readonly title?: string;
  readonly relationCategory: string;
  readonly personA: CompatibilityPersonTableInput;
  readonly personB: CompatibilityPersonTableInput;
  readonly connectionSummary?: CompatibilityConnectionSummaryInput;
};

const SUPPORTED_RELATION_CATEGORIES: readonly CompatibilityRelationCategory[] = [
  "love",
  "marriage",
  "parentChild",
  "coworker",
  "managerReport",
  "businessPartner",
  "friendship",
];

export function buildCompatibilityTableData(
  input: BuildCompatibilityTableDataInput,
): CompatibilityTableData {
  const relationCategory = normalizeRelationCategory(input.relationCategory);

  return {
    title: input.title ?? "궁합표",
    relationCategory,
    personA: buildPersonTableData(input.personA, "A"),
    connectionSummary: buildConnectionSummary(input.connectionSummary),
    personB: buildPersonTableData(input.personB, "B"),
  };
}

function normalizeRelationCategory(
  relationCategory: string,
): CompatibilityRelationCategory {
  if (
    SUPPORTED_RELATION_CATEGORIES.includes(
      relationCategory as CompatibilityRelationCategory,
    )
  ) {
    return relationCategory as CompatibilityRelationCategory;
  }

  throw new Error(`Unsupported compatibility relation category: ${relationCategory}`);
}

function buildPersonTableData(
  input: CompatibilityPersonTableInput,
  defaultLabel: string,
): CompatibilityPersonTableData {
  return {
    label: input.label ?? defaultLabel,
    displayName: input.displayName ?? null,
    manseRyeok: input.manseRyeok,
    mbti: input.mbti ?? null,
  };
}

function buildConnectionSummary(
  input: CompatibilityConnectionSummaryInput | undefined,
): CompatibilityConnectionSummaryData {
  return {
    compatibilityHeadline: input?.compatibilityHeadline ?? null,
    overallTone: input?.overallTone ?? null,
    myeongliConnectionSummary: input?.myeongliConnectionSummary ?? null,
    mbtiConnectionSummary: input?.mbtiConnectionSummary ?? null,
    dayMasterRelation: input?.dayMasterRelation ?? null,
    dayBranchRelation: input?.dayBranchRelation ?? null,
    elementBalance: input?.elementBalance ?? null,
    tenGodRelation: input?.tenGodRelation ?? null,
    interactionLabels: normalizeList(input?.interactionLabels),
    sharedStrengths: normalizeList(input?.sharedStrengths),
    frictionPoints: normalizeList(input?.frictionPoints),
    repairStrategy: input?.repairStrategy ?? null,
    timingNotes: normalizeList(input?.timingNotes),
  };
}

function normalizeList(values: readonly string[] | string | undefined): readonly string[] {
  if (values === undefined) {
    return [];
  }

  if (typeof values === "string") {
    return [values];
  }

  return values;
}
