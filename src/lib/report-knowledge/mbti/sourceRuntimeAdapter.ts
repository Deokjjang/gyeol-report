import { readFileSync } from "node:fs";
import { join } from "node:path";

import { MBTI_TYPES, type MbtiType } from "../mbtiKnowledgeTypes";

export const MBTI_SOURCE_TYPES = MBTI_TYPES;

export type MbtiSourceType = MbtiType;

export const MBTI_REPORT_USE_CASE_KEYS = [
  "generalReport",
  "careerReport",
  "loveMarriageChildReport",
  "compatibilityReport",
  "daeunReport",
  "saeunReport",
] as const;

export type MbtiReportUseCaseKey =
  (typeof MBTI_REPORT_USE_CASE_KEYS)[number];

export const MBTI_TRAIT_AREAS = [
  "identity",
  "thinkingStyle",
  "career",
  "workplace",
  "money",
  "investment",
  "study",
  "love",
  "marriage",
  "parenting",
  "child",
  "relationships",
  "communication",
  "strengths",
  "risks",
  "growth",
] as const;

export type MbtiTraitArea = (typeof MBTI_TRAIT_AREAS)[number];

// Selection routes existing knowledge; matchingMyeongliSignals are not themselves
// proof of a natal fact. Bridge keeps its separate validated fact conditions.
export const MBTI_PRODUCT_TRAIT_AREAS = {
  generalReport: MBTI_TRAIT_AREAS,
  careerReport: ["career", "workplace", "money", "investment", "study"],
  loveMarriageChildReport: ["love", "marriage", "parenting", "child", "relationships", "communication", "risks", "growth"],
  compatibilityReport: ["communication", "relationships", "thinkingStyle", "love", "marriage", "workplace", "money", "growth"],
  daeunReport: ["thinkingStyle", "career", "workplace", "money", "study", "relationships", "risks", "growth"],
  saeunReport: ["thinkingStyle", "career", "workplace", "money", "study", "relationships", "risks", "growth"],
} as const satisfies Record<MbtiReportUseCaseKey, readonly MbtiTraitArea[]>;

export function getMbtiProductTraits(type: string | null | undefined, product: MbtiReportUseCaseKey, limitPerArea?: number) {
  const profile = getMbtiSourceProfile(type);
  return MBTI_PRODUCT_TRAIT_AREAS[product].flatMap(area =>
    (profile?.traits?.[area] ?? []).slice(0, limitPerArea).map(trait => ({
      area, trait, evidenceId: `mbti:${profile!.type}:traits:${area}:${trait.id}`,
    })));
}

/** Small behavioral basis shared by the two fortune products, not a second personality report. */
export function getMbtiFortuneBasis<P extends "daeunReport" | "saeunReport">(type: string | null | undefined, product: P) {
  const profile = getMbtiSourceProfile(type);
  const selected = getMbtiProductTraits(type, product, 1);
  const reading = (area: MbtiTraitArea) => selected.find(t => t.area === area)?.trait.plainKo;
  return {
    type: profile?.type ?? null, titleKo: profile?.titleKo ?? null, archetype: profile?.archetype ?? null,
    summary: profile?.oneLine ?? "MBTI가 입력되지 않아 명리 흐름과 실제 생활 경험을 중심으로 읽습니다.",
    coreTraits: [reading("career"), reading("money"), reading("study")].filter((s): s is string => Boolean(s)),
    stressPattern: reading("risks") ?? "입력된 MBTI 기준 스트레스 패턴 없음",
    decisionPattern: reading("thinkingStyle") ?? "입력된 MBTI 기준 의사결정 패턴 없음",
    workPattern: reading("workplace") ?? "입력된 MBTI 기준 일 처리 패턴 없음",
    relationshipPattern: reading("relationships") ?? "입력된 MBTI 기준 관계 반응 패턴 없음",
    growthPattern: reading("growth") ?? "입력된 MBTI 기준 성장 패턴 없음",
    reportUseCase: product, reportUseCases: getMbtiReportUseCase(type, product) ?? [],
  };
}

export type MbtiSourceTraitItem = {
  readonly id?: string;
  readonly label?: string;
  readonly plainKo?: string;
  readonly strongLine?: string;
  readonly positiveUse?: string;
  readonly risk?: string;
  readonly matchingMyeongliSignals?: readonly string[];
  readonly productDomains?: readonly string[];
  readonly sourceCoverage?: string;
  readonly [key: string]: unknown;
};

export type MbtiRelationshipPair = {
  readonly withType: MbtiSourceType;
  readonly label: string | null;
  readonly sourceRelationName: string | null;
  readonly sourceCoverage: string | null;
  readonly sharedGround: readonly string[];
  readonly friction: readonly string[];
  readonly positiveInfluence: readonly string[];
  readonly lovePattern: string | null;
  readonly marriagePattern: string | null;
  readonly repairStrategy: readonly string[];
  readonly reportLine: string | null;
};

export type MbtiMyeongliBridgeHint = {
  readonly signal: string;
  readonly reason: string;
  readonly relatedTraits: readonly string[];
  readonly productDomains: readonly string[];
  readonly sourceCoverage: string | null;
};

export type MbtiSourceProfile = {
  readonly type: MbtiSourceType;
  readonly titleKo: string;
  readonly archetype: string;
  readonly oneLine: string;
  readonly preferenceAxes?: Readonly<Record<string, string>>;
  readonly functionStack?: Readonly<Record<string, string>>;
  readonly summary?: Readonly<Record<string, string>>;
  readonly traits?: Partial<
    Record<MbtiTraitArea, readonly MbtiSourceTraitItem[]>
  >;
  readonly relationshipHints?: {
    readonly comfortableTypes?: readonly string[];
    readonly challengingTypes?: readonly string[];
    readonly notablePairs?: readonly MbtiRelationshipPairInput[];
  };
  readonly myeongliBridgeHints?: readonly MbtiMyeongliBridgeHintInput[];
  readonly reportUseCases?: Partial<
    Record<MbtiReportUseCaseKey, readonly string[]>
  >;
  readonly [key: string]: unknown;
};

type MbtiRelationshipPairInput = {
  readonly withType?: string;
  readonly label?: string;
  readonly sourceRelationName?: string;
  readonly sourceCoverage?: string;
  readonly sharedGround?: readonly string[];
  readonly friction?: readonly string[];
  readonly positiveInfluence?: readonly string[];
  readonly lovePattern?: string;
  readonly marriagePattern?: string;
  readonly repairStrategy?: readonly string[];
  readonly reportLine?: string;
};

type MbtiMyeongliBridgeHintInput = {
  readonly signal?: string;
  readonly reason?: string;
  readonly relatedTraits?: readonly string[];
  readonly productDomains?: readonly string[];
  readonly sourceCoverage?: string;
};

const sourceCache: Partial<Record<MbtiSourceType, MbtiSourceProfile>> = {};

export function getMbtiSourceProfile(
  type: string | null | undefined,
): MbtiSourceProfile | null {
  const normalizedType = normalizeMbtiSourceType(type);

  if (normalizedType === null) {
    return null;
  }

  return sourceCache[normalizedType] ?? readMbtiSourceProfile(normalizedType);
}

export function getMbtiTraitArea(
  type: string | null | undefined,
  area: string | null | undefined,
): readonly MbtiSourceTraitItem[] | null {
  const profile = getMbtiSourceProfile(type);
  const traitArea = normalizeMbtiTraitArea(area);

  if (profile === null || traitArea === null) {
    return null;
  }

  return profile.traits?.[traitArea] ?? null;
}

export function getMbtiReportUseCase(
  type: string | null | undefined,
  reportKey: string | null | undefined,
): readonly string[] | null {
  const profile = getMbtiSourceProfile(type);
  const useCaseKey = normalizeMbtiReportUseCaseKey(reportKey);

  if (profile === null || useCaseKey === null) {
    return null;
  }

  return profile.reportUseCases?.[useCaseKey] ?? null;
}

export function getMbtiRelationshipPair(
  type: string | null | undefined,
  withType: string | null | undefined,
): MbtiRelationshipPair | null {
  const profile = getMbtiSourceProfile(type);
  const normalizedWithType = normalizeMbtiSourceType(withType);

  if (profile === null || normalizedWithType === null) {
    return null;
  }

  const pair = profile.relationshipHints?.notablePairs?.find(
    (candidate) => normalizeMbtiSourceType(candidate.withType) === normalizedWithType,
  );

  return pair === undefined ? null : normalizeRelationshipPair(pair);
}

export function getMbtiMyeongliBridgeHints(
  type: string | null | undefined,
): readonly MbtiMyeongliBridgeHint[] | null {
  const profile = getMbtiSourceProfile(type);

  if (profile === null) {
    return null;
  }

  return (profile.myeongliBridgeHints ?? []).flatMap((hint) => {
    const normalizedHint = normalizeMyeongliBridgeHint(hint);

    return normalizedHint === null ? [] : [normalizedHint];
  });
}

function normalizeMbtiSourceType(
  type: string | null | undefined,
): MbtiSourceType | null {
  if (type === null || type === undefined) {
    return null;
  }

  const normalized = type.trim().toUpperCase();

  return (MBTI_SOURCE_TYPES as readonly string[]).includes(normalized)
    ? (normalized as MbtiSourceType)
    : null;
}

function normalizeMbtiTraitArea(
  area: string | null | undefined,
): MbtiTraitArea | null {
  if (area === null || area === undefined) {
    return null;
  }

  const normalized = area.trim();

  return (MBTI_TRAIT_AREAS as readonly string[]).includes(normalized)
    ? (normalized as MbtiTraitArea)
    : null;
}

function normalizeMbtiReportUseCaseKey(
  reportKey: string | null | undefined,
): MbtiReportUseCaseKey | null {
  if (reportKey === null || reportKey === undefined) {
    return null;
  }

  const normalized = reportKey.trim();

  return (MBTI_REPORT_USE_CASE_KEYS as readonly string[]).includes(normalized)
    ? (normalized as MbtiReportUseCaseKey)
    : null;
}

function readMbtiSourceProfile(type: MbtiSourceType): MbtiSourceProfile {
  const profile = parseMbtiSourceFile(type);

  sourceCache[type] = profile;

  return profile;
}

function parseMbtiSourceFile(type: MbtiSourceType): MbtiSourceProfile {
  const sourcePath = join(
    process.cwd(),
    "docs/product/mbti/source",
    `${type}.json`,
  );
  const rawText = stripUtf8Bom(readFileSync(sourcePath, "utf8"));
  const parsed = JSON.parse(rawText) as unknown;

  if (!isObjectRecord(parsed) || parsed.type !== type) {
    throw new Error(`Invalid MBTI source profile: ${type}`);
  }

  return parsed as MbtiSourceProfile;
}

function normalizeRelationshipPair(
  pair: MbtiRelationshipPairInput,
): MbtiRelationshipPair {
  const withType = normalizeMbtiSourceType(pair.withType);

  if (withType === null) {
    throw new Error(`Invalid MBTI relationship pair type: ${pair.withType}`);
  }

  return {
    withType,
    label: pair.label ?? null,
    sourceRelationName: pair.sourceRelationName ?? null,
    sourceCoverage: pair.sourceCoverage ?? null,
    sharedGround: pair.sharedGround ?? [],
    friction: pair.friction ?? [],
    positiveInfluence: pair.positiveInfluence ?? [],
    lovePattern: pair.lovePattern ?? null,
    marriagePattern: pair.marriagePattern ?? null,
    repairStrategy: pair.repairStrategy ?? [],
    reportLine: pair.reportLine ?? null,
  };
}

function normalizeMyeongliBridgeHint(
  hint: MbtiMyeongliBridgeHintInput,
): MbtiMyeongliBridgeHint | null {
  if (hint.signal === undefined || hint.reason === undefined) {
    return null;
  }

  return {
    signal: hint.signal,
    reason: hint.reason,
    relatedTraits: hint.relatedTraits ?? [],
    productDomains: hint.productDomains ?? [],
    sourceCoverage: hint.sourceCoverage ?? null,
  };
}

function stripUtf8Bom(text: string): string {
  return text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;
}

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
