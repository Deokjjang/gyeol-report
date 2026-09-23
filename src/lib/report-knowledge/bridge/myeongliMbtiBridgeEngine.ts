import { normalizeBridgeSignals, selectMatchedBridgeHints } from "./bridgeHintSelection";
import {
  getMbtiRelationshipPair,
  getMbtiReportUseCase,
  getMbtiSourceProfile,
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
  const signals = normalizeBridgeSignals(input.myeongliSignals);
  const matches = selectMatchedBridgeHints({
    mbtiType: sourceProfile.type, productContext: input.productContext,
    factIds: new Set(signals.map((signal) => signal.id!)),
    traitAreas: BRIDGE_PRODUCT_TRAIT_AREAS[input.productContext],
  });
  const bridgeHints = matches.map((match) => match.hint);
  const traits = [...new Map(matches.flatMap((match) => match.traits).map(({ area, trait }) =>
    [`${area}:${trait.id}`, normalizeTraitEvidence(area, trait)] as const)).values()];
  const usedIds = new Set(matches.flatMap((match) => match.interaction.myeongliEvidenceIds));
  const matchedSignals = signals.filter((signal) => usedIds.has(signal.id!));
  const intensity = matches.some((match) => match.interaction.intensity === "medium") ? "medium" : "low";
  const evidence: MyeongliMbtiBridgeEvidence = {
    id: createBridgeEvidenceId(sourceProfile.type, input.productContext),
    productContext: input.productContext,
    mbtiType: sourceProfile.type,
    signalKinds: uniqueSignalKinds(matchedSignals),
    interactions: matches.map((match) => match.interaction),
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
      signals: matchedSignals,
      bridgeHints,
    },
    bridgeSummary: createBridgeSummary({
      mbtiType: sourceProfile.type,
      productContext: input.productContext,
      reportUseCaseKey,
      signalCount: matchedSignals.length,
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
    evidences: matches.length ? [evidence] : [],
    isEmpty: matches.length === 0,
    unknownType: false,
  };
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
