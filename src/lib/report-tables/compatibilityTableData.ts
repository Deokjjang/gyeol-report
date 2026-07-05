import type {
  CompatibilityConnectionSummaryData,
  CompatibilityPersonTableData,
  CompatibilityRelationCategory,
  CompatibilityTableData,
  ManseRyeokCommonTableData,
  ManseRyeokDetailRow,
  ManseRyeokPillarKey,
  MbtiCommonProfileTableData,
  MbtiReportUsageNote,
} from "./types";
import {
  buildManseRyeokCommonTableData,
  type BuildManseRyeokCommonTableDataInput,
} from "./manseRyeokTableData";
import { normalizeCompatibilityRelationCategory } from "../report-knowledge/compatibilityTypes";

export type CompatibilityPersonTableInput = {
  readonly label?: string;
  readonly displayName?: string | null;
  readonly manseRyeok?: ManseRyeokCommonTableData;
  readonly manseRyeokInput?: BuildManseRyeokCommonTableDataInput;
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

export function buildCompatibilityTableData(
  input: BuildCompatibilityTableDataInput,
): CompatibilityTableData {
  const relationCategory: CompatibilityRelationCategory =
    normalizeCompatibilityRelationCategory(input.relationCategory);

  return {
    title: input.title ?? "궁합표",
    relationCategory,
    personA: buildPersonTableData(input.personA, "A"),
    connectionSummary: buildConnectionSummary(input.connectionSummary),
    personB: buildPersonTableData(input.personB, "B"),
  };
}

function buildPersonTableData(
  input: CompatibilityPersonTableInput,
  defaultLabel: string,
): CompatibilityPersonTableData {
  return {
    label: input.label ?? defaultLabel,
    displayName: input.displayName ?? null,
    manseRyeok: buildCompatibilityManseRyeokTable(input),
    mbti: normalizeCompatibilityMbtiTable(input.mbti ?? null),
  };
}

function buildCompatibilityManseRyeokTable(
  input: CompatibilityPersonTableInput,
): ManseRyeokCommonTableData {
  const table =
    input.manseRyeokInput === undefined
      ? input.manseRyeok
      : buildManseRyeokCommonTableData(input.manseRyeokInput);

  if (table === undefined) {
    throw new Error("Compatibility person manseRyeok table is required.");
  }

  return sanitizeCompatibilityManseRyeokTable(table);
}

function sanitizeCompatibilityManseRyeokTable(
  table: ManseRyeokCommonTableData,
): ManseRyeokCommonTableData {
  const branchSet = new Set(
    table.columns.flatMap((column) => {
      const branch = table.branchRow[column.key]?.hanja;

      return branch === undefined ? [] : [branch];
    }),
  );

  return {
    ...table,
    detailRows: table.detailRows.map((row) => ({
      ...row,
      cells: mapDetailCells(row, (values) =>
        values.filter((value) => shouldKeepManseDetailValue(value, row.key, branchSet)),
      ),
    })),
  };
}

function mapDetailCells(
  row: ManseRyeokDetailRow,
  mapValues: (values: readonly string[]) => readonly string[],
): ManseRyeokDetailRow["cells"] {
  return {
    hour: mapValues(row.cells.hour),
    day: mapValues(row.cells.day),
    month: mapValues(row.cells.month),
    year: mapValues(row.cells.year),
  } satisfies Record<ManseRyeokPillarKey, readonly string[]>;
}

const EARTHLY_BRANCHES = [
  "子",
  "丑",
  "寅",
  "卯",
  "辰",
  "巳",
  "午",
  "未",
  "申",
  "酉",
  "戌",
  "亥",
] as const;

function shouldKeepManseDetailValue(
  value: string,
  rowKey: ManseRyeokDetailRow["key"],
  branchSet: ReadonlySet<string>,
): boolean {
  if (hasCompatibilitySpecificMarker(value)) {
    return false;
  }

  if (rowKey !== "interactions") {
    return true;
  }

  const referencedBranches = EARTHLY_BRANCHES.filter((branch) =>
    value.includes(branch),
  );

  return (
    referencedBranches.length === 0 ||
    referencedBranches.every((branch) => branchSet.has(branch))
  );
}

function normalizeCompatibilityMbtiTable(
  mbti: MbtiCommonProfileTableData | null,
): MbtiCommonProfileTableData | null {
  if (mbti === null) {
    return null;
  }

  return {
    ...mbti,
    coreSummary: mbti.coreSummary.slice(0, 3),
    closeKeywords: mbti.closeKeywords.slice(0, 6),
    farKeywords: mbti.farKeywords.slice(0, 6),
    reportUsageNotes: mbti.reportUsageNotes
      .filter(isCompatibilityMbtiUsageNote)
      .map(sanitizeCompatibilityMbtiUsageNote)
      .slice(0, 5),
  };
}

const COMPATIBILITY_MBTI_NOTE_CATEGORIES = new Set([
  "love",
  "marriage",
  "relationships",
  "communication",
  "strengths",
  "risks",
  "growth",
]);

function isCompatibilityMbtiUsageNote(note: MbtiReportUsageNote): boolean {
  return (
    COMPATIBILITY_MBTI_NOTE_CATEGORIES.has(note.categoryKey) ||
    note.productDomains.some((domain) =>
      ["compatibility", "relationship", "love", "marriage"].includes(domain),
    )
  );
}

function sanitizeCompatibilityMbtiUsageNote(
  note: MbtiReportUsageNote,
): MbtiReportUsageNote {
  return {
    ...note,
    label: sanitizeDisplayText(note.label) ?? "관계 활용 포인트",
    plainKo: sanitizeDisplayText(note.plainKo),
    strongLine: sanitizeDisplayText(note.strongLine),
    positiveUse: sanitizeDisplayText(note.positiveUse),
    risk: sanitizeDisplayText(note.risk),
  };
}

function buildConnectionSummary(
  input: CompatibilityConnectionSummaryInput | undefined,
): CompatibilityConnectionSummaryData {
  return {
    compatibilityHeadline: sanitizeDisplayText(input?.compatibilityHeadline),
    overallTone: sanitizeDisplayText(input?.overallTone),
    myeongliConnectionSummary: sanitizeDisplayText(input?.myeongliConnectionSummary),
    mbtiConnectionSummary: sanitizeDisplayText(input?.mbtiConnectionSummary),
    dayMasterRelation: sanitizeDisplayText(input?.dayMasterRelation),
    dayBranchRelation: sanitizeDisplayText(input?.dayBranchRelation),
    elementBalance: sanitizeDisplayText(input?.elementBalance),
    tenGodRelation: sanitizeDisplayText(input?.tenGodRelation),
    interactionLabels: normalizeList(input?.interactionLabels),
    sharedStrengths: normalizeList(input?.sharedStrengths),
    frictionPoints: normalizeList(input?.frictionPoints),
    repairStrategy: sanitizeDisplayText(input?.repairStrategy),
    timingNotes: normalizeList(input?.timingNotes),
  };
}

function normalizeList(values: readonly string[] | string | undefined): readonly string[] {
  if (values === undefined) {
    return [];
  }

  if (typeof values === "string") {
    return sanitizeDisplayText(values) === null ? [] : [values];
  }

  return values.flatMap((value) => {
    const sanitized = sanitizeDisplayText(value);

    return sanitized === null ? [] : [sanitized];
  });
}

function sanitizeDisplayText(value: string | null | undefined): string | null {
  if (value === undefined || value === null) {
    return null;
  }

  return hasCompatibilitySpecificMarker(value) ? null : value;
}

function hasCompatibilitySpecificMarker(value: string): boolean {
  const normalized = value.trim().toLowerCase();

  return [
    "profile tables",
    "career money study",
    "careerreportusecases",
    "operator_planner",
    "categorykey",
    "productdomains",
    "placeholder",
    "raw",
    "궁합 교차",
  ].some((marker) => normalized.includes(marker));
}
