import {
  getMbtiFunctionDisplay,
  getMbtiPreferenceDisplay,
} from "./displayDictionaries";
import type {
  MbtiCommonProfileTableData,
  MbtiCoreSummaryItem,
  MbtiFunctionCode,
  MbtiFunctionStackPosition,
  MbtiFunctionStackRow,
  MbtiPreferenceAxisKey,
  MbtiPreferenceAxisRow,
  MbtiPreferenceCode,
  MbtiReportUsageNote,
} from "./types";

export type MbtiSourceTraitItem = {
  readonly id?: string;
  readonly label?: string;
  readonly plainKo?: string;
  readonly strongLine?: string;
  readonly positiveUse?: string;
  readonly risk?: string;
  readonly productDomains?: readonly string[];
};

export type MbtiCommonProfileSourceInput = {
  readonly type: string;
  readonly titleKo: string;
  readonly archetype: string;
  readonly oneLine: string;
  readonly preferenceAxes?: Partial<Record<MbtiPreferenceAxisKey, string>>;
  readonly functionStack?: Partial<Record<MbtiFunctionStackPosition, string>>;
  readonly summary?: Readonly<Record<string, string | undefined>>;
  readonly traits?: Readonly<
    Record<string, readonly MbtiSourceTraitItem[] | undefined>
  >;
  readonly closeKeywords?: readonly string[];
  readonly farKeywords?: readonly string[];
};

const PREFERENCE_AXIS_DEFINITIONS: readonly {
  readonly axisKey: MbtiPreferenceAxisKey;
  readonly label: string;
  readonly leftCode: MbtiPreferenceCode;
  readonly rightCode: MbtiPreferenceCode;
}[] = [
  { axisKey: "energy", label: "에너지 방향", leftCode: "E", rightCode: "I" },
  { axisKey: "perception", label: "인식 방식", leftCode: "S", rightCode: "N" },
  { axisKey: "judgment", label: "판단 방식", leftCode: "T", rightCode: "F" },
  { axisKey: "lifestyle", label: "생활 양식", leftCode: "J", rightCode: "P" },
];

const FUNCTION_STACK_DEFINITIONS: readonly {
  readonly position: MbtiFunctionStackPosition;
  readonly label: string;
}[] = [
  { position: "dominant", label: "주 기능" },
  { position: "auxiliary", label: "부 기능" },
  { position: "tertiary", label: "3차 기능" },
  { position: "inferior", label: "열등 기능" },
];

const CORE_SUMMARY_DEFINITIONS: readonly {
  readonly key: string;
  readonly label: string;
}[] = [
  { key: "identity", label: "정체성" },
  { key: "strength", label: "강점" },
  { key: "risk", label: "주의점" },
  { key: "growthStrategy", label: "성장 전략" },
];

export function buildMbtiCommonProfileTableData(
  input: MbtiCommonProfileSourceInput,
): MbtiCommonProfileTableData {
  return {
    type: input.type,
    titleKo: input.titleKo,
    archetype: input.archetype,
    oneLine: input.oneLine,
    preferenceRows: buildPreferenceRows(input.preferenceAxes),
    functionRows: buildFunctionRows(input.functionStack),
    coreSummary: buildCoreSummary(input.summary),
    closeKeywords: input.closeKeywords ?? [],
    farKeywords: input.farKeywords ?? [],
    reportUsageNotes: buildReportUsageNotes(input.traits),
  };
}

function buildPreferenceRows(
  preferenceAxes: MbtiCommonProfileSourceInput["preferenceAxes"],
): readonly MbtiPreferenceAxisRow[] {
  return PREFERENCE_AXIS_DEFINITIONS.map((definition) => {
    const selectedCode = preferenceAxes?.[definition.axisKey];

    if (selectedCode === undefined) {
      throw new Error(`Missing MBTI preference axis: ${definition.axisKey}`);
    }

    if (
      selectedCode !== definition.leftCode &&
      selectedCode !== definition.rightCode
    ) {
      throw new Error(
        `Unsupported MBTI preference selection for ${definition.axisKey}: ${selectedCode}`,
      );
    }

    return {
      axisKey: definition.axisKey,
      label: definition.label,
      selectedCode,
      left: {
        ...getMbtiPreferenceDisplay(definition.leftCode),
        selected: selectedCode === definition.leftCode,
      },
      right: {
        ...getMbtiPreferenceDisplay(definition.rightCode),
        selected: selectedCode === definition.rightCode,
      },
    };
  });
}

function buildFunctionRows(
  functionStack: MbtiCommonProfileSourceInput["functionStack"],
): readonly MbtiFunctionStackRow[] {
  return FUNCTION_STACK_DEFINITIONS.map((definition) => {
    const code = functionStack?.[definition.position];

    if (code === undefined) {
      throw new Error(`Missing MBTI function code: ${definition.position}`);
    }

    return {
      position: definition.position,
      label: definition.label,
      ...getMbtiFunctionDisplay(code as MbtiFunctionCode),
    };
  });
}

function buildCoreSummary(
  summary: MbtiCommonProfileSourceInput["summary"],
): readonly MbtiCoreSummaryItem[] {
  return CORE_SUMMARY_DEFINITIONS.flatMap((definition) => {
    const text = summary?.[definition.key];

    if (!text) {
      return [];
    }

    return [
      {
        key: definition.key,
        label: definition.label,
        text,
      },
    ];
  });
}

function buildReportUsageNotes(
  traits: MbtiCommonProfileSourceInput["traits"],
): readonly MbtiReportUsageNote[] {
  if (!traits) {
    return [];
  }

  return Object.entries(traits).flatMap(([categoryKey, traitItems]) => {
    if (!traitItems) {
      return [];
    }

    return traitItems.map((trait) => ({
      categoryKey,
      id: trait.id ?? null,
      label: trait.label ?? trait.id ?? categoryKey,
      plainKo: trait.plainKo ?? null,
      strongLine: trait.strongLine ?? null,
      positiveUse: trait.positiveUse ?? null,
      risk: trait.risk ?? null,
      productDomains: trait.productDomains ?? [],
    }));
  });
}
