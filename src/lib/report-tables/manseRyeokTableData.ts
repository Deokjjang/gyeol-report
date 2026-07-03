import {
  getBranchDisplay,
  getStemDisplay,
} from "./displayDictionaries";
import type {
  ManseRyeokCommonTableData,
  ManseRyeokDetailRow,
  ManseRyeokPillarKey,
  ManseRyeokStemBranchCell,
} from "./types";

export type ManseRyeokFourPillarGridColumnInput = {
  readonly columnId: ManseRyeokPillarKey;
  readonly labelKo?: string;
  readonly pillar?: string;
  readonly heavenlyStem?: string;
  readonly earthlyBranch?: string;
  readonly tenGod?: readonly string[] | string;
  readonly hiddenStems?: readonly string[];
  readonly twelveLifeStage?: readonly string[];
  readonly twelveSinsal?: readonly string[];
  readonly sinsal?: readonly string[];
  readonly gwiin?: readonly string[];
  readonly interactions?: readonly string[];
};

export type BuildManseRyeokCommonTableDataInput = {
  readonly title?: string;
  readonly displayName?: string;
  readonly fourPillarGrid?: readonly ManseRyeokFourPillarGridColumnInput[];
};

const MANSE_RYEOK_COLUMNS: ManseRyeokCommonTableData["columns"] = [
  { key: "hour", label: "시주" },
  { key: "day", label: "일주" },
  { key: "month", label: "월주" },
  { key: "year", label: "연주" },
];

const DETAIL_ROW_DEFINITIONS: readonly Pick<
  ManseRyeokDetailRow,
  "key" | "label"
>[] = [
  { key: "hiddenStems", label: "지장간" },
  { key: "twelveLifeStage", label: "십이운성" },
  { key: "twelveSinsal", label: "십이신살" },
  { key: "sinsalAndGwiin", label: "신살/귀인" },
  { key: "interactions", label: "합충형파해" },
];

export function buildManseRyeokCommonTableData(
  input: BuildManseRyeokCommonTableDataInput,
): ManseRyeokCommonTableData {
  const pillarsByKey = new Map<ManseRyeokPillarKey, ManseRyeokFourPillarGridColumnInput>();

  for (const pillar of input.fourPillarGrid ?? []) {
    pillarsByKey.set(pillar.columnId, pillar);
  }

  return {
    title: buildTitle(input),
    columns: MANSE_RYEOK_COLUMNS,
    stemRow: buildStemRow(pillarsByKey),
    branchRow: buildBranchRow(pillarsByKey),
    detailRows: buildDetailRows(pillarsByKey),
  };
}

function buildTitle(input: BuildManseRyeokCommonTableDataInput): string {
  if (input.title) {
    return input.title;
  }

  if (input.displayName) {
    return `${input.displayName}님의 만세력`;
  }

  return "나의 만세력";
}

function buildStemRow(
  pillarsByKey: ReadonlyMap<ManseRyeokPillarKey, ManseRyeokFourPillarGridColumnInput>,
): ManseRyeokCommonTableData["stemRow"] {
  return {
    hour: buildStemCell(pillarsByKey.get("hour")),
    day: buildStemCell(pillarsByKey.get("day")),
    month: buildStemCell(pillarsByKey.get("month")),
    year: buildStemCell(pillarsByKey.get("year")),
  };
}

function buildBranchRow(
  pillarsByKey: ReadonlyMap<ManseRyeokPillarKey, ManseRyeokFourPillarGridColumnInput>,
): ManseRyeokCommonTableData["branchRow"] {
  return {
    hour: buildBranchCell(pillarsByKey.get("hour")),
    day: buildBranchCell(pillarsByKey.get("day")),
    month: buildBranchCell(pillarsByKey.get("month")),
    year: buildBranchCell(pillarsByKey.get("year")),
  };
}

function buildStemCell(
  pillar: ManseRyeokFourPillarGridColumnInput | undefined,
): ManseRyeokStemBranchCell | null {
  const stem = getStemHanja(pillar);

  if (!stem) {
    return null;
  }

  return {
    ...getStemDisplay(stem),
    tenGod: getTenGod(pillar?.tenGod, "stem"),
  };
}

function buildBranchCell(
  pillar: ManseRyeokFourPillarGridColumnInput | undefined,
): ManseRyeokStemBranchCell | null {
  const branch = getBranchHanja(pillar);

  if (!branch) {
    return null;
  }

  return {
    ...getBranchDisplay(branch),
    tenGod: getTenGod(pillar?.tenGod, "branch"),
  };
}

function buildDetailRows(
  pillarsByKey: ReadonlyMap<ManseRyeokPillarKey, ManseRyeokFourPillarGridColumnInput>,
): readonly ManseRyeokDetailRow[] {
  return DETAIL_ROW_DEFINITIONS.map((definition) => ({
    ...definition,
    cells: {
      hour: getDetailValues(pillarsByKey.get("hour"), definition.key),
      day: getDetailValues(pillarsByKey.get("day"), definition.key),
      month: getDetailValues(pillarsByKey.get("month"), definition.key),
      year: getDetailValues(pillarsByKey.get("year"), definition.key),
    },
  }));
}

function getStemHanja(
  pillar: ManseRyeokFourPillarGridColumnInput | undefined,
): string | null {
  return pillar?.heavenlyStem ?? pillar?.pillar?.slice(0, 1) ?? null;
}

function getBranchHanja(
  pillar: ManseRyeokFourPillarGridColumnInput | undefined,
): string | null {
  return pillar?.earthlyBranch ?? pillar?.pillar?.slice(1, 2) ?? null;
}

function getTenGod(
  tenGod: readonly string[] | string | undefined,
  target: "stem" | "branch",
): string | null {
  const values = typeof tenGod === "string" ? [tenGod] : (tenGod ?? []);
  const prefix = target === "stem" ? "천간" : "지지";
  const prefixedValue = values.find((value) => value.startsWith(prefix));

  if (prefixedValue) {
    return prefixedValue.replace(prefix, "").trim() || null;
  }

  return values[target === "stem" ? 0 : 1] ?? null;
}

function getDetailValues(
  pillar: ManseRyeokFourPillarGridColumnInput | undefined,
  rowKey: ManseRyeokDetailRow["key"],
): readonly string[] {
  if (!pillar) {
    return [];
  }

  switch (rowKey) {
    case "hiddenStems":
      return pillar.hiddenStems ?? [];
    case "twelveLifeStage":
      return pillar.twelveLifeStage ?? [];
    case "twelveSinsal":
      return pillar.twelveSinsal ?? [];
    case "sinsalAndGwiin":
      return [...(pillar.sinsal ?? []), ...(pillar.gwiin ?? [])];
    case "interactions":
      return pillar.interactions ?? [];
  }
}
