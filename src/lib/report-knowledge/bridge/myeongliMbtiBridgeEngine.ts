import {
  getMbtiMyeongliBridgeHints,
  getMbtiRelationshipPair,
  getMbtiReportUseCase,
  getMbtiSourceProfile,
  getMbtiTraitArea,
  type MbtiMyeongliBridgeHint,
  type MbtiReportUseCaseKey,
  type MbtiSourceTraitItem,
  type MbtiSourceType,
  type MbtiTraitArea,
} from "../mbti";
import type {
  BridgeProductContext,
  BuildMyeongliMbtiBridgePacketInput,
  MbtiTraitEvidence,
  MyeongliMbtiBridgeEvidence,
  MyeongliMbtiBridgeIntensity,
  MyeongliMbtiBridgePacket,
  MyeongliSignal,
  MyeongliSignalKind,
} from "./types";

export const BRIDGE_PRODUCT_REPORT_USE_CASE_MAP = {
  general: "generalReport",
  careerMoneyStudy: "careerReport",
  loveMarriageChild: "loveMarriageChildReport",
  compatibility: "compatibilityReport",
  daeun: "daeunReport",
  saeun: "saeunReport",
} as const satisfies Record<BridgeProductContext, MbtiReportUseCaseKey>;

const BRIDGE_PRODUCT_TRAIT_AREAS = {
  general: ["identity", "strengths", "risks", "growth"],
  careerMoneyStudy: ["career", "workplace", "money", "investment", "study"],
  loveMarriageChild: ["love", "marriage", "parenting", "child", "relationships"],
  compatibility: ["relationships", "communication", "love", "marriage"],
  daeun: ["career", "money", "investment", "growth"],
  saeun: ["identity", "career", "relationships", "growth"],
} as const satisfies Record<BridgeProductContext, readonly MbtiTraitArea[]>;

const MBTI_BRIDGE_CAUTION =
  "MBTI source evidence is supporting material and must be grounded against myeongli signals before final writing.";

export function buildMyeongliMbtiBridgePacket(
  input: BuildMyeongliMbtiBridgePacketInput,
): MyeongliMbtiBridgePacket {
  const reportUseCaseKey = BRIDGE_PRODUCT_REPORT_USE_CASE_MAP[input.productContext];
  const sourceProfile = getMbtiSourceProfile(input.mbtiType);

  if (sourceProfile === null) {
    return {
      productContext: input.productContext,
      reportUseCaseKey,
      mbtiType: null,
      sourceProfile: null,
      withMbtiType: null,
      relationshipPair: null,
      evidences: [],
      isEmpty: true,
      unknownType: true,
    };
  }

  const relationshipPair =
    input.productContext === "compatibility" && input.withMbtiType
      ? getMbtiRelationshipPair(sourceProfile.type, input.withMbtiType)
      : null;
  const withMbtiType = relationshipPair?.withType ?? null;
  const reportUseCases =
    getMbtiReportUseCase(sourceProfile.type, reportUseCaseKey) ?? [];
  const bridgeHints = selectBridgeHints(
    getMbtiMyeongliBridgeHints(sourceProfile.type) ?? [],
    input.myeongliSignals,
  );
  const traits = collectTraitEvidence(sourceProfile.type, input.productContext);
  const intensity = resolveBridgeIntensity(
    input.myeongliSignals.length,
    relationshipPair !== null,
  );
  const evidence: MyeongliMbtiBridgeEvidence = {
    id: createBridgeEvidenceId(sourceProfile.type, input.productContext),
    productContext: input.productContext,
    mbtiType: sourceProfile.type,
    signalKinds: uniqueSignalKinds(input.myeongliSignals),
    mbtiEvidence: {
      titleKo: sourceProfile.titleKo,
      archetype: sourceProfile.archetype,
      oneLine: sourceProfile.oneLine,
      reportUseCaseKey,
      reportUseCases,
      traits,
      relationshipPair,
    },
    myeongliEvidence: {
      signals: input.myeongliSignals,
      bridgeHints,
    },
    bridgeSummary: createBridgeSummary({
      mbtiType: sourceProfile.type,
      productContext: input.productContext,
      reportUseCaseKey,
      signalCount: input.myeongliSignals.length,
      traitCount: traits.length,
      hasRelationshipPair: relationshipPair !== null,
    }),
    intensity,
    caution: MBTI_BRIDGE_CAUTION,
  };

  return {
    productContext: input.productContext,
    reportUseCaseKey,
    mbtiType: sourceProfile.type,
    sourceProfile,
    withMbtiType,
    relationshipPair,
    evidences: [evidence],
    isEmpty: false,
    unknownType: false,
  };
}

function collectTraitEvidence(
  mbtiType: MbtiSourceType,
  productContext: BridgeProductContext,
): readonly MbtiTraitEvidence[] {
  return BRIDGE_PRODUCT_TRAIT_AREAS[productContext].flatMap((area) =>
    (getMbtiTraitArea(mbtiType, area) ?? []).map((trait) =>
      normalizeTraitEvidence(area, trait),
    ),
  );
}

function normalizeTraitEvidence(
  area: MbtiTraitArea,
  trait: MbtiSourceTraitItem,
): MbtiTraitEvidence {
  return {
    area,
    id: trait.id ?? null,
    label: trait.label ?? null,
    plainKo: trait.plainKo ?? null,
    strongLine: trait.strongLine ?? null,
    positiveUse: trait.positiveUse ?? null,
    risk: trait.risk ?? null,
    matchingMyeongliSignals: trait.matchingMyeongliSignals ?? [],
    productDomains: trait.productDomains ?? [],
    sourceCoverage: trait.sourceCoverage ?? null,
    source: trait,
  };
}

function selectBridgeHints(
  bridgeHints: readonly MbtiMyeongliBridgeHint[],
  signals: readonly MyeongliSignal[],
): readonly MbtiMyeongliBridgeHint[] {
  if (signals.length === 0) {
    return bridgeHints;
  }

  const signalTokens = new Set(
    signals.flatMap((signal) => [signal.label, signal.value]).filter(isString),
  );
  const matchedHints = bridgeHints.filter((hint) => signalTokens.has(hint.signal));

  return matchedHints.length > 0 ? matchedHints : bridgeHints;
}

function resolveBridgeIntensity(
  signalCount: number,
  hasRelationshipPair: boolean,
): MyeongliMbtiBridgeIntensity {
  if (signalCount >= 3) {
    return "high";
  }

  if (signalCount >= 1 || hasRelationshipPair) {
    return "medium";
  }

  return "low";
}

function uniqueSignalKinds(
  signals: readonly MyeongliSignal[],
): readonly MyeongliSignalKind[] {
  return [...new Set(signals.map((signal) => signal.kind))];
}

function createBridgeEvidenceId(
  mbtiType: MbtiSourceType,
  productContext: BridgeProductContext,
): string {
  return `myeongli-mbti-${mbtiType.toLowerCase()}-${productContext}`;
}

function createBridgeSummary(input: {
  readonly mbtiType: MbtiSourceType;
  readonly productContext: BridgeProductContext;
  readonly reportUseCaseKey: MbtiReportUseCaseKey;
  readonly signalCount: number;
  readonly traitCount: number;
  readonly hasRelationshipPair: boolean;
}): string {
  const pairNote = input.hasRelationshipPair ? " with relationship pair" : "";

  return [
    input.mbtiType,
    input.productContext,
    input.reportUseCaseKey,
    `${input.signalCount} myeongli signals`,
    `${input.traitCount} MBTI traits${pairNote}`,
  ].join(" · ");
}

function isString(value: string | undefined): value is string {
  return typeof value === "string" && value.length > 0;
}
